const fetchHtml = require('../fetch-html');

describe('fetch-html', () => {
  it('fetches HTML from a remote URL', async () => {
    const url = 'https://raw.githubusercontent.com/ilyashusterman/doc-to-readable/refs/heads/main/docs/index.html';
    const html = await fetchHtml(url);
    expect(typeof html).toBe('string');
    expect(html).toMatch(/<html[\s>]/i);
    expect(html).toMatch(/doc-to-readable/i); // Should contain project name
  });
}); 