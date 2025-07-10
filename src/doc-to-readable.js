import { processDom } from './process-dom.js';
import { splitMarkdownByHeaders } from './split-markdown.js';

/**
 * Convert a URL or HTML/text to markdown.
 * @param {string} input - The URL or HTML/text.
 * @param {{ type: 'url' | 'html' }} options - Specify input type.
 * @returns {Promise<string>} Markdown
 */
export async function docToMarkdown(input, options = { type: 'html' }) {
  if (options.type === 'url') {
    return await processDom(input, null, { inline_title: true });
  } else if (options.type === 'html') {
    return await processDom('', input, { inline_title: true });
  } else {
    throw new Error('Invalid type for docToMarkdown: ' + options.type);
  }
}

/**
 * Convert a markdown text to a list of split sections (markdown chunks).
 * @param {string} markdown - The markdown.
 * @returns {Promise<Array<{section: string, title: string|null}>>}
 */
export async function splitReadableDocs(markdown) {
  const sections = splitMarkdownByHeaders(markdown);
  // Rename content -> section for output
  return sections.map(({ title, content }) => ({ title, section: content }));
} 