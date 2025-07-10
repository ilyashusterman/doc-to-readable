# doc-to-readable

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

const sections = await splitReadableDocs('<h1>Title</h1>\n<p>Content</p>', { type: 'html' });
// sections: [{ title: 'Title', section: '...' }, ...]
```

### PDF Support
- For PDF files, convert to HTML first using the included helpers, then use `docToMarkdown` or `splitReadableDocs`.

## API
- `docToMarkdown(input: string, options: { type: 'url' | 'html' }): Promise<string>`
- `splitReadableDocs(input: string, options: { type: 'url' | 'html' }): Promise<Array<{ section: string, title: string | null }>>`

## License
MIT 