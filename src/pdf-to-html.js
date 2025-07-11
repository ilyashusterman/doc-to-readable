let getDocument, pdfjsLib;
let pdfjsAvailable = true;
let pdfjsInitialized = false;

async function initPdfjs() {
  if (pdfjsInitialized) return;
  try {
    const pdfjsDist = await import('pdfjs-dist');
    getDocument = pdfjsDist.getDocument;
    pdfjsLib = pdfjsDist;
// Configure pdfjs worker
const pdfjsVersion = '5.3.93';
const workerPath = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`;
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;
} else {
  console.log('Running in a non-browser environment, workerSrc not set.');
    }
    pdfjsAvailable = true;
  } catch (e) {
    pdfjsAvailable = false;
    console.warn('[pdf-to-html] pdfjs-dist not available or failed to load. PDF conversion is disabled in this environment.');
  }
  pdfjsInitialized = true;
}

// Escape HTML characters, preserve math and special characters
function escapeHtml(str, isMath = false) {
  if (isMath) return str;
  return str.replace(/[&<>"']/g, s => ({
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": ''
  })[s]);
}

// Cluster items by x-coordinate with dynamic tolerance
function clusterXCoordinates(items, xTolerance) {
  const clusters = [];
  for (const item of items) {
    const x = item.transform[4];
    let cluster = clusters.find(c => c.items.some(i => Math.abs(i.transform[4] - x) < xTolerance));
    if (!cluster) {
      cluster = { items: [] };
      clusters.push(cluster);
    }
    cluster.items.push(item);
  }
  return clusters.map(c => c.items.sort((a, b) => a.transform[4] - b.transform[4])).filter(c => c.length > 0);
}

// Calculate dynamic x-tolerance
function calculateXTolerance(items) {
  const xPositions = items.map(i => i.transform[4]).sort((a, b) => a - b);
  const gaps = xPositions.slice(1).map((x, i) => x - xPositions[i]).filter(g => g > 0);
  const avgGap = gaps.length ? gaps.reduce((sum, g) => sum + g, 0) / gaps.length : 15;
  return Math.max(10, avgGap * 1.5);
}

// Group text items into lines
function groupTextByLine(items, yTolerance = 5) {
  const lines = [];
  for (const item of items) {
    const y = Math.round(item.transform[5]);
    let line = lines.find(l => Math.abs(l.y - y) < yTolerance);
    if (!line) {
      line = { y, items: [] };
      lines.push(line);
    }
    line.items.push(item);
  }
  lines.sort((a, b) => b.y - a.y);
  lines.forEach(line => line.items.sort((a, b) => a.transform[4] - b.transform[4]));
  return lines;
}

// Group lines into paragraphs
function groupLinesIntoParagraphs(lines, minGap = 10) {
  if (lines.length === 0) return [];
  const paragraphs = [];
  let current = [lines[0]];
  for (let i = 1; i < lines.length; ++i) {
    const gap = Math.abs(lines[i].y - lines[i - 1].y);
    if (gap > minGap) {
      paragraphs.push(current);
      current = [];
    }
    current.push(lines[i]);
  }
  if (current.length) paragraphs.push(current);
  return paragraphs;
}

// Detect headers
function headingLevel(line, allFontSizes, lines, index) {
  const fontSizes = line.items.map(i => i.height || 0);
  const size = Math.max(...fontSizes);
  const text = line.items.map(i => i.str).join('').trim();
  const textLength = text.length;
  const isBold = line.items.some(i => /Bold/.test(i.fontName || ''));
  const isUppercase = text === text.toUpperCase();
  const medianSize = allFontSizes.sort((a, b) => a - b)[Math.floor(allFontSizes.length / 2)];
  const isFollowedByGap = index < lines.length - 1 && Math.abs(lines[index + 1].y - line.y) > 15;
  const isIsolated = (index === 0 || Math.abs(lines[index - 1].y - line.y) > 10) && 
                     (index === lines.length - 1 || Math.abs(lines[index + 1].y - line.y) > 10);
  const blacklist = [/^\d+\./, /^Figure/, /^Table/, /^Note:/, /^•/, /^-/];
  const isSurrounded = (index > 0 && Math.abs(lines[index - 1].y - line.y) < 5) || 
                       (index < lines.length - 1 && Math.abs(lines[index + 1].y - line.y) < 5);

  if (blacklist.some(regex => regex.test(text)) || isSurrounded) return 0;

  if (size >= 1.7 * medianSize && textLength <= 50 && isIsolated) return 1;
  if (size >= 1.4 * medianSize && textLength <= 75 && isIsolated) return 2;
  if ((isBold || isUppercase) && textLength <= 30 && isFollowedByGap && isIsolated) return 2;
  return 0;
}

// Detect code lines
function isCodeLine(line) {
  const text = line.items.map(i => i.str).join('');
  const codePatterns = /\b(function|var|let|const|if|else|for|while|return|class|async|await)\b|[\{\}\(\)\[\];,=+\-*\/=>]|\/\/|#/g;
  const fontName = line.items[0].fontName || '';
  const patternCount = (text.match(codePatterns) || []).length;
  return (/Mono|Courier/i.test(fontName) || patternCount >= 2) && text.length > 10;
}

// Detect math content
function isMathContent(line) {
  const text = line.items.map(i => i.str).join('');
  const mathDelimiters = /^\$[\s\S]*\$|^\(.+\)$|^\[[\s\S]*\]$|^\${2}[\s\S]*\${2}$/;
  const mathChars = /[\u03B1-\u03C9\u0391-\u03A9∫∑∏∞√∂\^\/\\frac\\sum]/;
  const inlineMath = /\b[\w]+[\^_][\w]+|[\w]+\/[\w]+/g;
  return mathDelimiters.test(text) || (mathChars.test(text) && !/^[a-zA-Z\s]+$/.test(text)) || inlineMath.test(text);
}

// Apply styles without nesting
function spanify(item, isMath = false) {
  let s = escapeHtml(item.str, isMath);
  const font = item.fontName || '';
  const classes = [];
  if (/Bold/.test(font)) classes.push('bold');
  if (/Italic|Oblique/.test(font)) classes.push('italic');
  if (classes.length) s = `<span class="${classes.join(' ')}">${s}</span>`;
  return s;
}

// Detect tables with strict validation
function detectTable(paragraphs, xTolerance) {
  const tables = [];
  let i = 0;
  while (i < paragraphs.length) {
    let j = i;
    const rows = [];
    const blacklist = [/^\d+\./, /^•/, /^-/];
    while (j < paragraphs.length && paragraphs[j].length > 0) {
      const items = paragraphs[j][0].items;
      const text = items.map(i => i.str).join('').trim();
      if (items.length < 2 || blacklist.some(regex => regex.test(text))) break;
      const clusters = clusterXCoordinates(items, xTolerance);
      if (clusters.length >= 2) {
        rows.push(clusters);
        // Validate column consistency across rows
        if (rows.length >= 2) {
          const colCounts = rows.map(r => r.length);
          const maxCols = Math.max(...colCounts);
          const minCols = Math.min(...colCounts);
          if (maxCols - minCols <= 1) { // Allow ±1 column variation
            const nonEmptyCells = rows.flat().filter(cell => cell.map(i => i.str).join('').trim()).length;
            if (nonEmptyCells / rows.flat().length >= 0.5) {
              tables.push({ start: i, end: j, rows });
              i = j + 1;
              break;
            }
          }
        }
      }
      j++;
    }
    i++;
  }
  return tables;
}

// Main conversion function with custom title
export async function pdfToHtmlFromBuffer(arrayBuffer, customTitle = '') {
  await initPdfjs();
  if (!pdfjsAvailable) {
    console.warn('[pdf-to-html] pdfjs-dist not available; cannot convert PDF to HTML.');
    throw new Error('pdfjs-dist not available; PDF conversion is disabled in this environment.');
  }
  try {
    const pdfDocument = await getDocument({ data: arrayBuffer }).promise;
    const meta = await pdfDocument.getMetadata().catch(() => ({ info: { Title: '' } }));
    const docTitle = meta.info.Title || customTitle;
    const titleDiv = docTitle===''? '': `<title>${escapeHtml(docTitle)}</title>`
    let html = '<article role="main">\n';
    let skippedText = [];

    for (let pageNum = 1; pageNum <= pdfDocument.numPages; ++pageNum) {
      try {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const allFontSizes = textContent.items.map(i => i.height || 0).filter(h => h > 0);
        const xTolerance = calculateXTolerance(textContent.items);
        const lines = groupTextByLine(textContent.items);
        const paragraphs = groupLinesIntoParagraphs(lines);
        const tables = detectTable(paragraphs, xTolerance);

        let tableStartIndices = new Set(tables.map(t => t.start));

        for (let p = 0; p < paragraphs.length; ++p) {
          if (tableStartIndices.has(p)) {
            const table = tables.find(t => t.start === p);
            const maxCols = Math.max(...table.rows.map(row => row.length));
            const tableContent = table.rows.map(row => row.map(cell => cell.map(i => i.str).join('')).join('')).join('');
            if (tableContent.trim()) {
              html += `<table role="grid" aria-label="Table from page ${pageNum}">\n<caption>Table ${pageNum}</caption>\n<thead>\n<tr>` +
                table.rows[0].map(cell => `<th scope="col">${cell.map(i => escapeHtml(i.str)).join(' ') || ''}</th>`).join('') +
                '</tr>\n</thead>\n<tbody>\n';
              table.rows.slice(1).forEach(row => {
                html += '<tr>' +
                  row.map(cell => `<td>${cell.map(i => escapeHtml(i.str)).join(' ') || ''}</td>`).join('') +
                  (row.length < maxCols ? '<td></td>'.repeat(maxCols - row.length) : '') +
                  '</tr>\n';
              });
              html += '</tbody>\n</table>\n';
            } else {
              skippedText.push(`Table on page ${pageNum} skipped due to empty content`);
            }
            p = table.end;
            continue;
          }

          const linesInPara = paragraphs[p];
          if (!linesInPara || !linesInPara.length) continue;

          if (linesInPara.length > 1 && linesInPara.some(isCodeLine)) {
            const codeText = linesInPara.map(line => line.items.map(i => escapeHtml(i.str)).join(' ')).join('\n').trim();
            if (codeText) {
              html += `<pre><code>${codeText}</code></pre>\n`;
            } else {
              skippedText.push(`Code block on page ${pageNum} skipped: ${codeText}`);
            }
            continue;
          }

          for (let i = 0; i < linesInPara.length; i++) {
            const line = linesInPara[i];
            const text = line.items.map(i => i.str).join('');
            if (!text.trim() && !text.match(/[\s•\-\–]/)) {
              skippedText.push(`Line on page ${pageNum} skipped: ${text}`);
              continue;
            }

            if (isMathContent(line)) {
              const mathText = line.items.map(i => i.str).join('');
              const ariaLabel = `Mathematical expression: ${mathText.replace(/[\$\[\]\(\)\\]/g, '')}`;
              if (mathText.startsWith('$') && mathText.endsWith('$') || mathText.startsWith('\\(') && mathText.endsWith('\\)')) {
                html += `<span class="math-inline" aria-label="${ariaLabel}">${mathText}</span>\n`;
              } else {
                html += `<div class="math-display" aria-label="${ariaLabel}">${mathText}</div>\n`;
              }
              continue;
            }

            const level = headingLevel(line, allFontSizes, linesInPara, i);
            if (level > 0) {
              const headerText = line.items.map(i => spanify(i)).join(' ');
              if (headerText.trim()) {
                html += `<h${level}>${headerText}</h${level}>\n`;
              } else {
                skippedText.push(`Header on page ${pageNum} skipped: ${headerText}`);
              }
              continue;
            }

            if (isCodeLine(line)) {
              const codeText = line.items.map(i => escapeHtml(i.str)).join(' ');
              if (codeText.trim()) {
                html += `<pre><code>${codeText}</code></pre>\n`;
              } else {
                skippedText.push(`Code line on page ${pageNum} skipped: ${codeText}`);
              }
              continue;
            }

            const paraText = line.items.map(i => spanify(i)).join(' ');
            if (paraText.trim() || text.match(/[\s•\-\–]/)) {
              html += `<p>${paraText}</p>\n`;
            } else {
              skippedText.push(`Paragraph on page ${pageNum} skipped: ${paraText}`);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing page ${pageNum}:`, error);
        skippedText.push(`Page ${pageNum} processing failed: ${error.message}`);
      }
    }

    if (skippedText.length) {
      console.warn('Skipped content:', skippedText);
    }

    html += '</article>\n';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${titleDiv}
  <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" async></script>
  <style>
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 4px; }
    .math-inline, .math-display { font-family: 'Times New Roman', serif; }
    h1, h2 { margin: 0.5em 0; }
    p { margin: 0.5em 0; }
    .bold { font-weight: bold; }
    .italic { font-style: italic; }
  </style>
</head>
<body>
${html}
</body>
</html>`;
  } catch (error) {
    console.error('Error processing PDF:', error);
    return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Error</title></head><body><p>Error processing PDF</p></body></html>';
  }
}