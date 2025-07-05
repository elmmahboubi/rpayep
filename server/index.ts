import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const root = process.cwd();

async function createServer() {
  const app = express();

  let vite: any;
  if (!isProd) {
    // Development server logic
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root,
      ssr: {
        // Fix for react-helmet-async CJS issue in dev
        noExternal: ['react-helmet-async'],
      },
    });
    app.use(vite.middlewares);
  } else {
    // Production server logic
    const compression = (await import('compression')).default;
    app.use(compression());
    // Serve static files from the `dist/client` directory
    app.use(express.static(path.resolve(root, 'dist/client'), { index: false }));
  }

  app.use('*', async (req: Request, res: Response) => {
    try {
      const url = req.originalUrl;
      let template, render;

      if (!isProd) {
        // 1. Read index.html in dev
        template = await fs.readFile(path.resolve(root, 'index.html'), 'utf-8');
        // 2. Apply Vite HTML transforms.
        template = await vite.transformIndexHtml(url, template);
        // 3. Load the server entry.
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
      } else {
        // 1. Read index.html from build output in prod
        template = await fs.readFile(path.join(root, 'dist/client/index.html'), 'utf-8');
        // 3. Load the server entry from build output
        render = (await import(path.join(root, 'dist/server/entry-server.js'))).render;
      }

      // 4. Render the app HTML.
      const { appHtml, headHtml, initialData, statusCode } = await render(url);

      // 5. Inject the app-rendered HTML into the template.
      const html = template
        .replace(`<!--ssr-head-outlet-->`, headHtml)
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(
          `<!--initial-data-->`,
          `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}</script>`
        );

      // 6. Send the rendered HTML back.
      res
        .status(statusCode || 200)
        .set({ 'Content-Type': 'text/html' })
        .end(html);
    } catch (e: any) {
      if (!isProd) {
        vite.ssrFixStacktrace(e);
      }
      console.error(e.stack);
      res.status(500).send(e.stack);
    }
  });

  return app;
}

// Start the server if not in a serverless environment
if (!process.env.VERCEL) {
  createServer().then((app) =>
    app.listen(5173, () => {
      console.log('✅ HTTP server is listening on http://localhost:5173');
    })
  );
}

// Export the app for Vercel
export default createServer; 