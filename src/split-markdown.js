import { marked } from 'marked';

/**
 * Splits a Markdown string into sections using both ATX (#) and Setext (===/---) headers.
 * - Each section: { title: string|null, content: string }
 * - Pre-header content included as section with title=null
 * - Ignores headers inside fenced code blocks (handled by marked)
 * - Includes header line(s) in content
 * - Titles are plain text, stripped of Markdown symbols
 * - Works in browser and Node.js
 * @param {string} markdown - The input markdown text
 * @returns {Array<{title: string|null, content: string}>} - Array of sections
 */
export function splitMarkdownByHeaders(markdown) {
  if (!markdown || markdown.trim() === '') {
    return [{ title: null, content: '' }];
  }
  const lines = markdown.split(/\r?\n/);
  const sections = [];
  let currentTitle = null;
  let currentContent = [];
  let setextCandidate = null;
  let inCodeBlock = false;
  let codeBlockFence = '';

  function pushSection() {
    if (currentTitle !== null || currentContent.length > 0) {
      sections.push({
        title: currentTitle,
        content: currentContent.join('\n').trim()
      });
    }
    currentTitle = null;
    currentContent = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Detect start/end of fenced code block
    const fenceMatch = line.match(/^([`~]{3,})(.*)$/);
    if (fenceMatch) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockFence = fenceMatch[1];
      } else if (line.startsWith(codeBlockFence)) {
        inCodeBlock = false;
        codeBlockFence = '';
      }
      if (setextCandidate !== null) {
        currentContent.push(setextCandidate);
        setextCandidate = null;
      }
      currentContent.push(line);
      continue;
    }
    if (inCodeBlock) {
      if (setextCandidate !== null) {
        currentContent.push(setextCandidate);
        setextCandidate = null;
      }
      currentContent.push(line);
      continue;
    }
    // ATX header
    const atxMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (atxMatch) {
      pushSection();
      currentTitle = atxMatch[2].trim();
      currentContent.push(line);
      continue;
    }
    // Setext header candidate (previous line)
    if (setextCandidate !== null && /^(=+|-+)\s*$/.test(line)) {
      pushSection();
      currentTitle = setextCandidate.trim();
      currentContent.push(setextCandidate); // header line
      currentContent.push(line); // underline
      setextCandidate = null;
      continue;
    }
    // If this line could be a Setext header (needs to be followed by === or ---)
    if (i + 1 < lines.length && /^(=+|-+)\s*$/.test(lines[i + 1])) {
      setextCandidate = line;
      continue;
    }
    // Normal content
    if (setextCandidate !== null) {
      currentContent.push(setextCandidate);
      setextCandidate = null;
    }
    currentContent.push(line);
  }
  // Flush any remaining setext candidate
  if (setextCandidate !== null) {
    currentContent.push(setextCandidate);
  }
  pushSection();
  // Remove empty sections
  return sections.filter(s => s.content.length > 0 || s.title !== null);
}

