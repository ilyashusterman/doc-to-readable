# doc-to-readable

> **TEST UPDATE**: This README was updated on $(date) to verify GitHub sync works correctly.

Universal document-to-markdown and section splitter for HTML, URLs, and PDFs.

## Features
- Convert HTML, URLs, or PDFs to Markdown
- Split Markdown into logical sections by headers
- Works in Node.js and browser (PDF support is best in Node.js)

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
```


### Split into Sections
```js
import { splitReadableDocs } from 'doc-to-readable';

const sections = await splitReadableDocs('<h1>Title</h1>\n<p>Content</p>');
// sections: [{ title: 'Title', section: '...' }, ...]
```

### PDF Support
- For PDF files, convert to HTML first using the included helpers, then use `docToMarkdown` or `splitReadableDocs`.

## API
- `docToMarkdown(input: string, options: { type: 'url' | 'html' }): Promise<string>`
- `splitReadableDocs(input: string): Promise<Array<{ section: string, title: string | null }>>`

## Main Dependencies
- [@mozilla/readability](https://github.com/mozilla/readability): Extracts main article content from HTML.
- [turndown](https://github.com/mixmark-io/turndown): Converts HTML to Markdown.
- [turndown-plugin-gfm](https://github.com/domchristie/turndown-plugin-gfm): GitHub Flavored Markdown support for Turndown.
- [remark](https://github.com/remarkjs/remark): Markdown processing (used for splitting and parsing).
- [dompurify](https://github.com/cure53/DOMPurify): Sanitizes HTML input.
- [jsdom](https://github.com/jsdom/jsdom): Emulates browser DOM in Node.js for HTML parsing.
- [pdfjs-dist](https://github.com/mozilla/pdfjs-dist): PDF to HTML conversion.

## License
MIT 