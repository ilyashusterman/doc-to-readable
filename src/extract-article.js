// Article extraction utility using Readability
// Exports: extractArticleFromDom
import { Readability } from '@mozilla/readability';

/**
 * Extracts the main article content from a DOM using Readability (browser or Node.js)
 * @param {Document} doc
 * @returns {string} Extracted article HTML or empty string
 */
export function extractArticleFromDom(doc) {
  // Always use the imported Readability class
  if (!Readability) {
    console.error('[extractArticleFromDom] Readability class not found');
    return '';
  }
  const reader = new Readability(doc);
  const article = reader.parse();
  return article?.content || '';
} 