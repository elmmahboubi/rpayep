import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ONLY for the SSR build
export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ['react-helmet-async'],
  },
  build: {
    ssr: true,
    outDir: 'dist/server',
    minify: true,
    rollupOptions: {
      input: 'src/entry-server.tsx',
      output: {
        format: 'es',
        entryFileNames: 'entry-server.js',
      },
      external: ['express', 'fs', 'path', 'compression'],
    },
  },
}); 