import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// SSR build config - separate from client and server builds
export default defineConfig({
  plugins: [react()],
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: 'dist/server',
    rollupOptions: {
      // No manualChunks for SSR - let Vite handle it
      external: ['react', 'react-dom', 'react-router-dom'],
    },
  },
}); 