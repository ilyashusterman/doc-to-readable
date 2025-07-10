// Markdown conversion utility using Turndown and GFM plugin
// Exports: convertToMarkdown
import TurndownService from 'turndown';
import { gfm, tables} from 'turndown-plugin-gfm';

const turndownService = new TurndownService();
turndownService.use(gfm);

export function convertToMarkdown(html) {
  return turndownService.turndown(html);
} 