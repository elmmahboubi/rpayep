import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ONLY for the client build
export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    outDir: 'dist/client',
    manifest: true,
    sourcemap: true,
    rollupOptions: {
      input: '/index.html',
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'visitor-utils': ['axios', 'ua-parser-js'],
        },
      },
    },
  },
}); 