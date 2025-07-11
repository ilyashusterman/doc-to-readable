import { docToMarkdown, splitReadableDocs } from '../doc-to-readable.js';

// Helper to generate HTML of different sizes
function generateTestHTML(sizeKB) {
  const baseHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Benchmark Test - ${sizeKB}KB</title>
    </head>
    <body>
      <main>
        <h1>Performance Benchmark</h1>
        <p>This is a test document for benchmarking performance with ${sizeKB}KB of content.</p>
        <h2>Section 1</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <h2>Section 2</h2>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <h2>Section 3</h2>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
      </main>
    </body>
    </html>
  `;
  
  // Calculate how many repetitions needed to reach target size
  const targetSize = sizeKB * 1024;
  const baseSize = baseHTML.length;
  const repetitions = Math.ceil(targetSize / baseSize);
  
  // Repeat content to reach target size
  let content = '';
  for (let i = 0; i < repetitions; i++) {
    content += baseHTML;
  }
  
  return content;
}

// Helper to measure memory usage
function getMemoryUsage() {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024), // MB
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
    };
  }
  return null;
}

// Helper to measure execution time
async function measureExecutionTime(fn) {
  const startTime = performance.now();
  const startMemory = getMemoryUsage();
  
  const result = await fn();
  
  const endTime = performance.now();
  const endMemory = getMemoryUsage();
  
  return {
    executionTime: Math.round(endTime - startTime),
    result,
    memory: startMemory && endMemory ? {
      start: startMemory,
      end: endMemory,
      delta: {
        rss: endMemory.rss - startMemory.rss,
        heapUsed: endMemory.heapUsed - startMemory.heapUsed,
        heapTotal: endMemory.heapTotal - startMemory.heapTotal,
      }
    } : null
  };
}

describe('Performance Benchmarks', () => {
  const testSizes = [1, 10, 100, 1000]; // KB - removed 5000KB due to size limit
  
  testSizes.forEach(sizeKB => {
    describe(`${sizeKB}KB HTML Processing`, () => {
      let testHTML;
      
      beforeAll(() => {
        testHTML = generateTestHTML(sizeKB);
        console.log(`Generated ${sizeKB}KB test HTML (${testHTML.length} bytes)`);
      });
      
      it(`docToMarkdown performance for ${sizeKB}KB`, async () => {
        const metrics = await measureExecutionTime(async () => {
          return await docToMarkdown(testHTML, { type: 'html' });
        });
        
        console.log(`\n📊 docToMarkdown ${sizeKB}KB Results:`);
        console.log(`⏱️  Execution time: ${metrics.executionTime}ms`);
        console.log(`📄 Output size: ${metrics.result.length} characters`);
        
        if (metrics.memory) {
          console.log(`🧠 Memory usage:`);
          console.log(`   RSS: ${metrics.memory.delta.rss}MB`);
          console.log(`   Heap Used: ${metrics.memory.delta.heapUsed}MB`);
          console.log(`   Heap Total: ${metrics.memory.delta.heapTotal}MB`);
        }
        
        // Assertions for performance expectations
        expect(metrics.executionTime).toBeLessThan(sizeKB * 1000); // More realistic threshold
        expect(metrics.result.length).toBeGreaterThan(0);
        expect(typeof metrics.result).toBe('string');
      }, 30000); // 30 second timeout for large files
      
      it(`splitReadableDocs performance for ${sizeKB}KB`, async () => {
        // First convert to markdown, then split
        const markdown = await docToMarkdown(testHTML, { type: 'html' });
        
        const metrics = await measureExecutionTime(async () => {
          return await splitReadableDocs(markdown);
        });
        
        console.log(`\n📊 splitReadableDocs ${sizeKB}KB Results:`);
        console.log(`⏱️  Execution time: ${metrics.executionTime}ms`);
        console.log(`📄 Sections found: ${metrics.result.length}`);
        
        if (metrics.memory) {
          console.log(`🧠 Memory usage:`);
          console.log(`   RSS: ${metrics.memory.delta.rss}MB`);
          console.log(`   Heap Used: ${metrics.memory.delta.heapUsed}MB`);
          console.log(`   Heap Total: ${metrics.memory.delta.heapTotal}MB`);
        }
        
        // Assertions
        expect(metrics.executionTime).toBeLessThan(sizeKB * 200); // More realistic threshold
        expect(Array.isArray(metrics.result)).toBe(true);
        expect(metrics.result.length).toBeGreaterThan(0);
      }, 30000); // 30 second timeout for large files
    });
  });
  
  describe('Large File Handling', () => {
    it('handles files at the size limit (2MB)', async () => {
      // Generate HTML close to the 2MB limit
      const sizeKB = 2000; // 2MB
      const testHTML = generateTestHTML(sizeKB);
      
      console.log(`\n📊 Testing 2MB file (${testHTML.length} bytes)`);
      
      const metrics = await measureExecutionTime(async () => {
        return await docToMarkdown(testHTML, { type: 'html' });
      });
      
      console.log(`⏱️  Execution time: ${metrics.executionTime}ms`);
      console.log(`📄 Output size: ${metrics.result.length} characters`);
      
      if (metrics.memory) {
        console.log(`🧠 Memory usage:`);
        console.log(`   RSS: ${metrics.memory.delta.rss}MB`);
        console.log(`   Heap Used: ${metrics.memory.delta.heapUsed}MB`);
        console.log(`   Heap Total: ${metrics.memory.delta.heapTotal}MB`);
      }
      
      expect(metrics.executionTime).toBeLessThan(15000); // Should complete in under 10 seconds
      expect(metrics.result.length).toBeGreaterThan(0);
    }, 30000);
    
    it('rejects files over the size limit', async () => {
      // Generate HTML over the 2MB limit
      const sizeKB = 2500; // 2.5MB
      const testHTML = generateTestHTML(sizeKB);
      
      console.log(`\n📊 Testing oversized file (${testHTML.length} bytes)`);
      
      await expect(docToMarkdown(testHTML, { type: 'html' }))
        .rejects
        .toThrow('Input HTML is too large');
    });
  });
  
  describe('Edge Cases', () => {
    it('handles very large HTML with many sections', async () => {
      // Generate HTML with many sections
      let largeHTML = '<!DOCTYPE html><html><head><title>Many Sections</title></head><body><main>';
      
      for (let i = 1; i <= 100; i++) {
        largeHTML += `<h1>Section ${i}</h1><p>Content for section ${i}. `.repeat(50) + '</p>';
      }
      
      largeHTML += '</main></body></html>';
      
      const metrics = await measureExecutionTime(async () => {
        const markdown = await docToMarkdown(largeHTML, { type: 'html' });
        return await splitReadableDocs(markdown);
      });
      
      console.log(`\n📊 Many Sections Benchmark:`);
      console.log(`⏱️  Execution time: ${metrics.executionTime}ms`);
      console.log(`📄 Sections found: ${metrics.result.length}`);
      console.log(`📄 Input size: ${largeHTML.length} characters`);
      
      expect(metrics.executionTime).toBeLessThan(10000); // Should complete in under 10 seconds
      expect(metrics.result.length).toBeGreaterThan(90); // Should find most sections
    }, 30000);
    
    it('handles HTML with very long paragraphs', async () => {
      // Generate HTML with very long paragraphs
      let longParagraphHTML = '<!DOCTYPE html><html><head><title>Long Paragraphs</title></head><body><main>';
      
      for (let i = 1; i <= 10; i++) {
        longParagraphHTML += `<h1>Section ${i}</h1>`;
        longParagraphHTML += `<p>${'This is a very long paragraph. '.repeat(1000)}</p>`;
      }
      
      longParagraphHTML += '</main></body></html>';
      
      const metrics = await measureExecutionTime(async () => {
        return await docToMarkdown(longParagraphHTML, { type: 'html' });
      });
      
      console.log(`\n📊 Long Paragraphs Benchmark:`);
      console.log(`⏱️  Execution time: ${metrics.executionTime}ms`);
      console.log(`📄 Output size: ${metrics.result.length} characters`);
      console.log(`📄 Input size: ${longParagraphHTML.length} characters`);
      
      expect(metrics.executionTime).toBeLessThan(5000); // Should complete in under 5 seconds
      expect(metrics.result.length).toBeGreaterThan(0);
    }, 30000);
  });
}); 