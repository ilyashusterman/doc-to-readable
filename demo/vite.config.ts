import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Set base path depending on environment
// Check if we're building for GitHub Pages (docs folder) or running locally
const isBuildingForGitHubPages = process.argv.includes('build');

export default defineConfig({
  base: isBuildingForGitHubPages ? '/doc-to-readable/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../docs'),
    emptyOutDir: true,
    target: 'esnext',
  },
  ssr: {
    // Ensure node-fetch is treated as an external module in SSR
    noExternal: ['node-fetch'],
  },
});
