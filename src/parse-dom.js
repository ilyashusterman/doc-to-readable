import DOMPurify from 'dompurify';
// DOM creation and element extraction utilities
// Exports: parseDomFromString, extractElementById

let DOMPurifyInstance;
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

async function ensureDomPurifyInstance() {
  if (DOMPurifyInstance) return DOMPurifyInstance;
  if (isBrowser) {
    DOMPurifyInstance = (await import('dompurify')).default;
    return DOMPurifyInstance;
  } else {
    const { JSDOM } = await import('jsdom');
    const window = (new JSDOM('')).window;
    const createDOMPurify = (await import('dompurify')).default;
    DOMPurifyInstance = createDOMPurify(window);
    return DOMPurifyInstance;
  }
}

// DOMPurify config to remove styles, images, and CSS-related tags/attributes
const PURIFY_CONFIG = {
  FORBID_TAGS: ['style', 'img', 'link'],
  FORBID_ATTR: ['style'],
  ALLOWED_TAGS: ['title', 'head', 'body', 'main', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span', 'a', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'em', 'strong', 'b', 'i', 'u', 's', 'del', 'ins', 'mark', 'small', 'sub', 'sup', 'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption', 'colgroup', 'col']
};

// Helper to sanitize HTML
async function sanitizeHtml(html) {
  const purify = await ensureDomPurifyInstance();
  if (!purify) return html;
  return purify.sanitize(html, PURIFY_CONFIG);
}

/**
 * Parses an HTML string into a Document, in browser or Node.js.
 * @param {string} html
 * @param {string} [url]
 * @returns {Promise<Document>}
 */
export async function parseDomFromString(html){
  if (isBrowser){
    const parser = new window.DOMParser();
    return parser.parseFromString(html, 'text/html');
  }else{
    const { JSDOM } = await import('jsdom');
    return new JSDOM(await sanitizeHtml(html)).window.document;
  }
}

