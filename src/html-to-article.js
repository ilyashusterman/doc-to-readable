import { parseDomFromString } from './parse-dom.js';
import { extractArticleFromDom } from './extract-article.js';
import { convertToMarkdown } from './markdown-converter.js';

const DEFAULT_MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

/**
 * Convert an HTML string to a markdown article, extracting the main content and title.
 * @param {string} htmlText - The HTML string to process.
 * @param {Object} options - { maxSizeBytes }
 * @returns {Promise<string>} Markdown
 */
export async function htmlToArticle(htmlText, options = {}) {
  const maxSize = options.maxSizeBytes || DEFAULT_MAX_SIZE_BYTES;
  if (htmlText.length > maxSize) {
    console.error(`[htmlToArticle] Input HTML exceeds ${maxSize} bytes. Use the bulk option for large files.`);
    throw new Error(`Input HTML is too large (max ${maxSize} bytes). Please use the bulk option for large files.`);
  }

  // 1. Parse HTML string to DOM
  const doc = await parseDomFromString(htmlText);

  // 2. Extract document title (if present)
  const titleEl = doc.querySelector('title');
  const title = titleEl ? titleEl.textContent : '';

  // 3. Extract main content (Readability)
  let readable = await extractArticleFromDom(doc);
  if (!readable) {
    readable = doc.documentElement.outerHTML;
  }

  // 4. Convert to Markdown
  let markdown = convertToMarkdown(readable);

  // 5. Optionally prepend title
  if (title) {
    markdown = `# ${title}\n\n${markdown}`;
  }

  return markdown;
} 