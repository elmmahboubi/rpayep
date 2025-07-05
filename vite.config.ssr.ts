import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: 'dist/server',
    rollupOptions: {
      output: {
        format: 'esm',
      },
    },
  },
  ssr: {
    // This is crucial to bundle this dependency
    noExternal: ['react-helmet-async'],
  },
}); 