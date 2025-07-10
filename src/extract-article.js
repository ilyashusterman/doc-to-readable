// Article extraction utility using Readability
// Exports: extractArticleFromDom
import { Readability } from '@mozilla/readability';

/**
 * Extracts the main article content from a DOM using Readability (browser or Node.js)
 * @param {Document} doc
 * @returns {Promise<string>} Extracted article HTML or empty string
 */
export async function extractArticleFromDom(doc) {
  console.log('[extractArticleFromDom] called');
  // Always use the imported Readability class
  if (!Readability) {
    console.error('[extractArticleFromDom] Readability class not found');
    return '';
  }
  console.log('[extractArticleFromDom] Instantiating Readability');
  const reader = new Readability(doc);
  const article = reader.parse();
  console.log('[extractArticleFromDom] Article extraction complete', {...article});
  return article?.content || '';
} 