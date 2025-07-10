import { marked } from 'marked';

/**
 * Splits a Markdown string into sections using both ATX (#) and Setext (===/---) headers.
 * - Each section: { title: string|null, content: string }
 * - Pre-header content included as section with title=null
 * - Ignores headers inside fenced code blocks (handled by marked)
 * - Includes header line(s) in content
 * - Titles are plain text, stripped of Markdown symbols
 * - Works in browser and Node.js
 * @param {string} markdown - The input markdown text
 * @returns {Array<{title: string|null, content: string}>} - Array of sections
 */
export function splitMarkdownByHeaders(markdown) {
  // Parse markdown into tokens
  const tokens = marked.lexer(markdown);
  const sections = [];
  let currentSection = null;

  tokens.forEach(token => {
    if (token.type === 'heading') {
      // Start a new section
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: token.text.replace(/[*_~`[\]]/g, '').trim(), // Strip markdown symbols
        content: token.raw // Include raw header line
      };
    } else if (currentSection) {
      // Append to current section
      currentSection.content += token.raw || '';
    } else {
      // Handle pre-header content
      if (!sections.length) {
        sections.push({
          title: null,
          content: token.raw || ''
        });
      } else {
        // Append to last section if no current section
        sections[sections.length - 1].content += token.raw || '';
      }
    }
  });

  // Push final section if it exists
  if (currentSection) {
    sections.push(currentSection);
  }

  // Trim content and return
  return sections.map(section => ({
    title: section.title,
    content: section.content
  }));
  // 
}

