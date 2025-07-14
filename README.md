[![CI](https://github.com/ilyashusterman/doc-to-readable/actions/workflows/node.js.yml/badge.svg)](https://github.com/ilyashusterman/doc-to-readable/actions)
[![npm version](https://badge.fury.io/js/doc-to-readable.svg)](https://www.npmjs.com/package/doc-to-readable)
[![npm downloads](https://img.shields.io/npm/dm/doc-to-readable.svg)](https://www.npmjs.com/package/doc-to-readable)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)

# doc-to-readable

Universal document-to-markdown and section splitter for HTML, URLs, and PDFs.

## Features
- **Cross-platform:** Works in both Node.js and browser environments
- Convert HTML, URLs, or PDFs to Markdown
- Split Markdown into logical sections by headers
- Works in Node.js and browser (PDF support is best in Node.js)
- **High Performance**: Sub-second processing for most documents
- **Memory Efficient**: Optimized for large files up to 2MB

## Installation
```sh
npm install doc-to-readable
```

## Usage

### Convert to Markdown
```js
import { docToMarkdown } from 'doc-to-readable';

// From HTML string
const md = await docToMarkdown('<h1>Hello</h1><p>World</p>', { type: 'html' });

// From URL
const mdFromUrl = await docToMarkdown('https://example.com', { type: 'url' });

// From Markdown (returns as-is)
const mdFromMarkdown = await docToMarkdown('# Title\nContent', { type: 'markdown' });
```


### Split into Sections
```js
import { splitReadableDocs } from 'doc-to-readable';

// From Markdown
const sections = await splitReadableDocs('# Title\n\nContent here\n\n## Subtitle\n\nMore content');
// sections: [{ title: 'Title', content: 'Content here' }, { title: 'Subtitle', content: 'More content' }]

// From HTML
const html = '<h1>Title</h1><p>Content</p><h2>Subtitle</h2><p>More</p>';
const htmlSections = await splitReadableDocs(html, { type: 'html' });

// From URL
const urlSections = await splitReadableDocs('https://example.com', { type: 'url' });
```

### PDF Support
- For PDF files, convert to HTML first using the included helpers, then use `docToMarkdown` or `splitReadableDocs` with `{ type: 'html' }`.

## API
- `docToMarkdown(input: string, options: { type: 'url' | 'html' | 'markdown' }): Promise<string>`
  - If `type` is `'markdown'`, returns input as-is.
  - If unsupported type, throws a Not Implemented error.
- `splitReadableDocs(input: string, options?: { type?: 'markdown' | 'url' | 'html' }): Promise<Array<{ title: string | null, content: string }>>`
  - If `type` is omitted or `'markdown'`, splits input as markdown.
  - If `type` is `'html'` or `'url'`, converts to markdown first, then splits.
- `pdfToHtmlFromBuffer(buffer: ArrayBuffer): Promise<string>` - Convert PDF buffer to HTML

### PDF Buffer to HTML
```js
import { pdfToHtmlFromBuffer } from 'doc-to-readable';

// Convert PDF buffer to HTML
const pdfBuffer = await fetch('document.pdf').then(res => res.arrayBuffer());
const html = await pdfToHtmlFromBuffer(pdfBuffer);

// Then convert to markdown
const md = await docToMarkdown(html, { type: 'html' });
```

## Performance

The library is optimized for high performance across different file sizes. Here are benchmark results from our test suite:

### Processing Speed

| File Size | docToMarkdown | splitReadableDocs | Memory Usage |
|-----------|---------------|-------------------|--------------|
| 1KB       | 265ms         | 0ms               | 33MB RSS     |
| 10KB      | 43ms          | 0ms               | 2MB RSS      |
| 100KB     | 237ms         | 1ms               | 23MB RSS     |
| 1000KB    | 2.7s          | 4ms               | 259MB RSS    |
| 2MB       | 6.3s          | N/A               | 934MB RSS    |

### Key Performance Features

- **Ultra-fast splitting**: `splitReadableDocs` processes documents in sub-millisecond time
- **Linear scaling**: Processing time scales linearly with file size
- **Memory efficient**: Optimized memory usage for large documents
- **Size limits**: Built-in 2MB limit prevents memory issues
- **Real-time ready**: Sub-second processing for documents up to 100KB

### Performance Benchmarks

The library includes comprehensive benchmark tests that validate performance across:
- **Small documents** (1-10KB): Sub-second processing
- **Medium documents** (100KB): ~250ms processing
- **Large documents** (1MB): ~3 seconds processing
- **Very large documents** (2MB): ~6 seconds processing
- **Edge cases**: Many sections, long paragraphs, oversized files

Run benchmarks with:
```sh
npm run test:benchmark
```

## Main Dependencies
- [@mozilla/readability](https://github.com/mozilla/readability): Extracts main article content from HTML.
- [turndown](https://github.com/mixmark-io/turndown): Converts HTML to Markdown.
- [turndown-plugin-gfm](https://github.com/domchristie/turndown-plugin-gfm): GitHub Flavored Markdown support for Turndown.
- [remark](https://github.com/remarkjs/remark): Markdown processing (used for splitting and parsing).
- [dompurify](https://github.com/cure53/DOMPurify): Sanitizes HTML input.
- [jsdom](https://github.com/jsdom/jsdom): Emulates browser DOM in Node.js for HTML parsing.
- [pdf.js](https://github.com/mozilla/pdf.js): PDF to HTML conversion.

▶️ **[Open Live on StackBlitz](https://stackblitz.com/edit/vitejs-vite-wkr9bmtk)**

## License
MIT 

Patch update: API and types for splitReadableDocs and docToMarkdown improved for clarity and flexibility. 
