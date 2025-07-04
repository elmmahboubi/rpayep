import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteImagemin from 'vite-plugin-imagemin';

// Using a function allows us to cleanly separate configs based on the `ssrBuild` flag
export default defineConfig(({ command, ssrBuild }) => {
  if (ssrBuild) {
    // --- SERVER-SIDE RENDERING (SSR) BUILD CONFIG ---
    return {
      plugins: [react()], // Only essential plugins for SSR
      build: {
        ssr: true,
        outDir: 'dist/server',
        rollupOptions: {
          input: 'src/entry-server.tsx',
          output: {
            format: 'es',
            // Explicitly disable manualChunks for SSR build
            manualChunks: undefined,
          },
          // Keep React and related libraries as external for the Node environment
          external: ['react', 'react-dom', 'react-router-dom', 'express'],
        },
        minify: true, // Minify the server bundle for production
      },
    };
  }

  // --- CLIENT-SIDE BUILD CONFIG ---
  return {
    plugins: [
      react(),
      // Only include these plugins for client build
      command === 'build' && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
      command === 'build' && viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 85,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
              active: false,
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
        webp: {
          quality: 85,
        },
      }),
    ].filter(Boolean),
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      outDir: 'dist/client',
      rollupOptions: {
        // Vite will automatically find and use index.html as the entry
        input: 'index.html',
        output: {
          // manualChunks only exists in client build - no conflict with external
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['lucide-react'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  };
});