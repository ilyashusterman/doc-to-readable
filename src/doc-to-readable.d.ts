export interface ReadableSection {
  title: string | null;
  content: string;
}

export interface DocToReadableOptions {
  type: 'url' | 'html' | 'markdown';
}

export function docToMarkdown(input: string, options?: DocToReadableOptions): Promise<string>;
export function splitReadableDocs(input: string, options?: DocToReadableOptions): Promise<ReadableSection[]>; 