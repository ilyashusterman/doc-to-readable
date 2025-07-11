import { parseDomFromString } from './parse-dom.js';
import { convertToMarkdown } from './markdown-converter.js';
import {extractArticleFromDom} from './extract-article.js';

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

  // 1. Extract title before sanitization
  const titleMatch = htmlText.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // 2. Parse HTML string to DOM
  const doc = await parseDomFromString(htmlText);

  // 3. Extract readable article
  const readableHtmlArticle = extractArticleFromDom(doc);

  // 4. Convert to Markdown
  let markdown = convertToMarkdown(readableHtmlArticle);

  // 5. Prepend title if it exists
  if (title && title.trim()) {
    markdown = `# ${title.trim()}\n\n${markdown}`;
  }

  return markdown;
} 