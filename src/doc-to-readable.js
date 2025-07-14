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
  } else if (options.type === 'markdown') {
    return input;
  } else {
    throw new Error('Not implemented for type: ' + options.type);
  }
}

/**
 * Convert a markdown text or document to a list of split sections (markdown chunks).
 * @param {string} text - The markdown or document input.
 * @param {{ type?: 'markdown' | 'url' | 'html' }} [options] - Specify input type. Defaults to 'markdown'.
 * @returns {Promise<Array<{section: string, title: string|null}>>}
 */
export async function splitReadableDocs(text, options = { type: 'markdown' }) {
  let markdown;
  if (options.type === 'markdown') {
    markdown = text;
  } else {
    markdown = await docToMarkdown(text, { type: options.type || 'html' });
  }
  const sections = splitMarkdownByHeaders(markdown);
  // Return as { title, content }
  return sections;
} 