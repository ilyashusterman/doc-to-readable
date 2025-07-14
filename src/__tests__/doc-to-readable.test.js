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

describe('splitReadableDocs', () => {
  it('splits markdown with multiple ATX headers', async () => {
    const md = `# Title 1\nContent 1\n## Subtitle\nContent 2\n# Title 2\nContent 3`;
    const sections = await import('../doc-to-readable.js').then(m => m.splitReadableDocs(md));
    expect(sections.length).toBeGreaterThan(1);
    expect(sections[0].title).toBe('Title 1');
    expect(sections[1].title).toBe('Subtitle');
    expect(sections[2].title).toBe('Title 2');
  });

  it('splits markdown with Setext headers', async () => {
    const md = `Title 1\n=======\nContent 1\nTitle 2\n-------\nContent 2`;
    const sections = await import('../doc-to-readable.js').then(m => m.splitReadableDocs(md));
    expect(sections.length).toBeGreaterThan(1);
    expect(sections[0].title).toBe('Title 1');
    expect(sections[1].title).toBe('Title 2');
  });

  it('handles markdown with no headers', async () => {
    const md = `Just some content without headers.`;
    const sections = await import('../doc-to-readable.js').then(m => m.splitReadableDocs(md));
    expect(sections.length).toBe(1);
    expect(sections[0].title).toBe(null);
    expect(sections[0].content).toContain('Just some content');
  });

  it('ignores headers inside code blocks', async () => {
    const md = `# Title\n\n\n\`\`\`\n# Not a header\n\`\`\`\nContent after code`;
    const sections = await import('../doc-to-readable.js').then(m => m.splitReadableDocs(md));
    expect(sections.length).toBe(1);
    expect(sections[0].title).toBe('Title');
    expect(sections[0].content).toContain('Content after code');
  });

  it('handles empty input', async () => {
    const md = '';
    const sections = await import('../doc-to-readable.js').then(m => m.splitReadableDocs(md));
    expect(sections.length).toBe(1);
    expect(sections[0].title).toBe(null);
    expect(sections[0].content).toBe('');
  });
}); 