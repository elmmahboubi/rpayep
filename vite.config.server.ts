import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Server-side build config only
export default defineConfig({
  plugins: [react()], // Only essential plugins for SSR
  build: {
    ssr: false, // Don't use SSR mode for server build
    outDir: 'dist/server',
    emptyOutDir: false, // Prevent deleting SSR output
    rollupOptions: {
      input: 'src/server.js',
      output: {
        format: 'es', // Use ES modules to match package.json
        entryFileNames: 'server.js', // Output as server.js
      },
      // Keep React and related libraries as external for the Node environment
      external: [
        'react', 'react-dom', 'react-router-dom', 'express',
        'node:fs/promises', 'node:path', 'node:url', 'fs', 'path', 'url'
      ],
    },
    minify: true, // Minify the server bundle for production
  },
}); 