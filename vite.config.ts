import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  if (ssrBuild) {
    // SSR build configuration
    return {
      plugins: [react()],
      build: {
        rollupOptions: {
          input: './src/entry-server.tsx',
        },
      },
      ssr: {
        noExternal: ['react-helmet-async'],
      },
    };
  } else {
    // Client build configuration
    return {
      plugins: [react()],
      build: {
        rollupOptions: {
          input: {
            main: './index.html',
          },
        },
      },
    };
  }
}); 