import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: '/doc-to-readable/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../docs'),
    emptyOutDir: true,
  },
  ssr: {
    // Ensure node-fetch is treated as an external module in SSR
    noExternal: ['node-fetch'],
  },
});
