import { pdfToHtmlFromBuffer } from './pdf-to-html.js';
// Universal HTML fetcher and DOM creator for browser and Node.js
// Exports: fetchHtmlOrDoc, universalFetch, fetchHtml


export async function universalFetch(url, options = {}) {
  try {
    // Browser environment
    if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
      // Ensure credentials are handled appropriately for CORS
      // surruound with try catch 
        const response = await fetch(url, {
          ...options,
          mode: 'cors',
          credentials: 'omit',
        });
      

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response;
    } 
    // Node.js environment
    else {
      let fetchFn = globalThis.fetch;
      
      // Fallback to node-fetch if global fetch is unavailable
      if (!fetchFn) {
        try {
          fetchFn = fetch;
        } catch (importError) {
          throw new Error(`Failed to load node-fetch: ${importError.message}`);
        }
      }

      const response = await fetchFn(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response;
    }
  } catch (error) {
    // Log the error for debugging
    console.error(`[universalFetch] Error fetching ${url}:`, error.message);
    throw error; // Re-throw to allow calling code to handle it
  }
}

export async function fetchHtml(url, options = {}) {
    console.log('fetchHtml', url, options);
    const res = await universalFetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    const isHtml = contentType.toLowerCase().includes('text/html') || contentType.toLowerCase().includes('application/xhtml+xml');
    const isText = contentType.toLowerCase().includes('text/plain')
    const isPdf = contentType.toLowerCase().includes('pdf');
    if (!isHtml && !isPdf && !isText) {
      throw new Error(`Unsupported content type: ${contentType}. Only HTML and PDF are supported.`);
    }
    if (isPdf) {
      const arrayBuffer = await res.arrayBuffer();
      const html =  await pdfToHtmlFromBuffer(arrayBuffer);
      console.log('html', html);
      return html;

    }
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return await res.text();
}
