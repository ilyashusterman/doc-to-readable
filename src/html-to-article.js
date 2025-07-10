import { parseDomFromString } from './parse-dom.js';
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
  let doc;
  if (typeof window === 'undefined') {
    const { JSDOM } = await import('jsdom');
    doc = new JSDOM(htmlText).window.document;
  } else {
    const parser = new window.DOMParser();
    doc = parser.parseFromString(htmlText, 'text/html');
  }

  // 2. Extract document title (if present)
  const titleEl = doc.querySelector('title');
  const title = titleEl ? titleEl.textContent : '';

  // 3. Extract main content (inner HTML of <main>)
  let mainContent = '';
  const main = doc.querySelector('main');
  if (main) {
    mainContent = main.innerHTML;
  } else {
    // fallback: use body content
    mainContent = doc.body.innerHTML;
  }

  // 4. Prepend title as <h1> to HTML if present
  let htmlWithTitle = mainContent;
  if (title) {
    htmlWithTitle = `<h1>${title}</h1>\n` + mainContent;
  }

  // 5. Convert to Markdown
  let markdown = convertToMarkdown(htmlWithTitle);

  return markdown;
} 