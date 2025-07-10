import { fetchHtml } from '../fetch-html.js';

async function runTest() {
  const url = 'https://raw.githubusercontent.com/ilyashusterman/doc-to-readable/refs/heads/main/docs/index.html';
  try {
    const html = await fetchHtml(url);
    if (typeof html !== 'string') throw new Error('Result is not a string');
    if (!/<html[\s>]/i.test(html)) throw new Error('HTML does not contain <html> tag');
    if (!/doc-to-readable/i.test(html)) throw new Error('HTML does not contain project name');
    console.log('✅ fetch-html standalone test passed!');
  } catch (err) {
    console.error('❌ fetch-html standalone test failed:', err);
    process.exit(1);
  }
}

runTest(); 