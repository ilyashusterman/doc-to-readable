export interface MarkdownSection {
  title: string | null;
  content: string;
}

/**
 * Splits a Markdown string into sections using headers.
 * @param markdown The markdown string to split.
 * @returns Array of sections with title and content.
 */
export function splitMarkdownByHeaders(markdown: string): MarkdownSection[]; 