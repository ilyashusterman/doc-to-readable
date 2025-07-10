import { splitReadableDocs } from '../doc-to-readable.js';

describe('splitReadableDocs', () => {
  it('splits markdown with multiple ATX headers', async () => {
    const md = `# Title 1\nContent 1\n## Subtitle\nContent 2\n# Title 2\nContent 3`;
    const sections = await splitReadableDocs(md);
    expect(sections.length).toBeGreaterThan(1);
    expect(sections[0].title).toBe('Title 1');
    expect(sections[1].title).toBe('Subtitle');
    expect(sections[2].title).toBe('Title 2');
  });

  it('splits markdown with Setext headers', async () => {
    const md = `Title 1\n=======\nContent 1\nTitle 2\n-------\nContent 2`;
    const sections = await splitReadableDocs(md);
    expect(sections.length).toBeGreaterThan(1);
    expect(sections[0].title).toBe('Title 1');
    expect(sections[1].title).toBe('Title 2');
  });

  it('handles markdown with no headers', async () => {
    const md = `Just some content without headers.`;
    const sections = await splitReadableDocs(md);
    expect(sections.length).toBe(1);
    expect(sections[0].title).toBe(null);
    expect(sections[0].section).toContain('Just some content');
  });

  it('ignores headers inside code blocks', async () => {
    const md = `# Title\n\n\n\`\`\`\n# Not a header\n\`\`\`\nContent after code`;
    const sections = await splitReadableDocs(md);
    expect(sections.length).toBe(1);
    expect(sections[0].title).toBe('Title');
    expect(sections[0].section).toContain('Content after code');
  });

  it('handles empty input', async () => {
    const md = '';
    const sections = await splitReadableDocs(md);
    expect(sections.length).toBe(1);
    expect(sections[0].title).toBe(null);
    expect(sections[0].section).toBe('');
  });
}); 