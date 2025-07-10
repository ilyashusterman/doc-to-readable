import { docToMarkdown } from '../doc-to-readable.js';

describe('docToMarkdown (HTML input)', () => {
  it('converts simple HTML with title and body to markdown', async () => {
    const html = `<!DOCTYPE html><html><head><title>Test Title</title></head><body><main><h1>Hello</h1><p>World!</p></main></body></html>`;
    const md = await docToMarkdown(html, { type: 'html' });
    expect(md).toContain('# Test Title');
    expect(md).toContain('Hello');
    expect(md).toContain('World!');
  });

  it('handles HTML without a <title>', async () => {
    const html = `<!DOCTYPE html><html><body><main><h2>No Title</h2><p>Content</p></main></body></html>`;
    const md = await docToMarkdown(html, { type: 'html' });
    expect(md).toContain('No Title');
    expect(md).toContain('Content');
  });

  it('throws an error for input that exceeds max size', async () => {
    const html = '<html>' + 'a'.repeat(2 * 1024 * 1024 + 1) + '</html>';
    await expect(docToMarkdown(html, { type: 'html' })).rejects.toThrow(/too large/);
  });

  it('handles empty HTML input', async () => {
    const html = '';
    const md = await docToMarkdown(html, { type: 'html' });
    expect(typeof md).toBe('string');
  });

  // Add more edge cases as needed
}); 