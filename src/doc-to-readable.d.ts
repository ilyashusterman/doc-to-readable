export interface ReadableSection {
  title: string | null;
  section: string;
}

export interface DocToReadableOptions {
  type: 'url' | 'html';
}

export function docToMarkdown(input: string, options?: DocToReadableOptions): Promise<string>;
export function splitReadableDocs(input: string): Promise<ReadableSection[]>; 