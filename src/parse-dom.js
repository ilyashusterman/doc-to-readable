import DOMPurify from 'dompurify';
// DOM creation and element extraction utilities
// Exports: parseDomFromString, extractElementById


// DOMPurify config to remove styles, images, and CSS-related tags/attributes
const PURIFY_CONFIG = {
  FORBID_TAGS: ['style', 'img', 'link'],
  FORBID_ATTR: ['style']
};

// Helper to sanitize HTML
function sanitizeHtml(html) {
  return DOMPurify.sanitize(html, PURIFY_CONFIG);
}

/**
 * Parses an HTML string into a Document, in browser or Node.js.
 * @param {string} html
 * @param {string} [url]
 * @returns {Promise<Document>}
 */
export async function parseDomFromString(html, url = 'https://example.com'){
  const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
  if (isBrowser) {
    return new window.DOMParser().parseFromString(html, 'text/html');
  } else {
    const { JSDOM } = await import('jsdom');
    return new JSDOM(sanitizeHtml(html), { url }).window.document;
  }
}
