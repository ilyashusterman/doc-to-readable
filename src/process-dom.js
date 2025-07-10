// Orchestrator for HTML-to-Markdown processing pipeline
// Exports: processDom
// This function fetches HTML (if needed) and delegates to htmlToArticle for markdown conversion.
import { fetchHtml } from './fetch-html.js';
import { htmlToArticle } from './html-to-article.js';

/**
 * Process a DOM string, Document, or URL and return Markdown.
 * @param {string} url - The source URL (for filters, optional, or to fetch HTML if htmlOrDoc is null).
 * @param {string|Document|null} htmlOrDoc - HTML string, Document, or null to fetch from URL.
 * @param {Object} options - { inline_title }
 * @returns {Promise<string>} Markdown
 */
export async function processDom(url, htmlOrDoc, options = {}) {
  if (htmlOrDoc === null && url) {
    const html = await fetchHtml(url);
    return await htmlToArticle(html);
  } else if (typeof htmlOrDoc === 'string') {
    return await htmlToArticle(htmlOrDoc);
  } else {
    throw new Error('processDom only supports HTML string or URL input after refactor.');
  }
} 