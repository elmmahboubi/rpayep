// /server.js
import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode and configure it.
  // This will be used for both dev and preview.
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  // Use vite's connect instance as middleware.
  // This will handle serving assets and HMR in development.
  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // 1. Read index.html
      let template = await fs.readFile(path.resolve(__dirname, 'index.html'), 'utf-8');

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client &
      //    also applies HTML transforms from plugins, e.g. global preambles.
      template = await vite.transformIndexHtml(url, template);

      // 3. Load the server entry. vite.ssrLoadModule automatically transforms
      //    your ESM source code to be usable in Node.js!
      const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

      // 4. render the app HTML.
      const { appHtml, headHtml, initialData, statusCode } = await render(url);

      // 5. Inject the app-rendered HTML into the template.
      const html = template
        .replace(`<!--ssr-head-outlet-->`, headHtml)
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(`<!--initial-data-->`, `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}</script>`);

      // 6. Send the rendered HTML back.
      res.status(statusCode || 200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your original source code.
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
  
  const port = process.env.PORT || 5173; // Vite's default dev port
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createServer(); 