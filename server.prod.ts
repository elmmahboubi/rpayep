import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import compression from 'compression';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createProdServer() {
  const app = express();

  app.use(compression());
  // Serve static files from the `dist/client` directory
  app.use(express.static(path.resolve(__dirname, 'dist/client'), { index: false }));

  app.use('*', async (req, res) => {
    const url = req.originalUrl;

    try {
      const template = await fs.readFile(
        path.resolve(__dirname, 'dist/client/index.html'),
        'utf-8'
      );
      // Import the server-side render function from the built server entry
      const { render } = await import('./dist/server/entry-server.js');

      const { appHtml, headHtml, initialData, statusCode } = await render(url);

      const html = template
        .replace(`<!--ssr-head-outlet-->`, headHtml)
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(
          `<!--initial-data-->`,
          `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}</script>`
        );

      res.status(statusCode || 200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error: any) {
      console.error(error);
      res.status(500).send(error.stack);
    }
  });

  const port = process.env.PORT || 4173;
  app.listen(port, () => {
    console.log(`Production server running at http://localhost:${port}`);
  });
}

createProdServer(); 