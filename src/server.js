import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In production, we're in dist/server, so go up one level to dist, then to client
const isProd = process.env.NODE_ENV === 'production';
const clientDir = isProd 
  ? path.join(__dirname, '../client')
  : path.join(__dirname, '../../dist/client');
const indexHtmlPath = path.join(clientDir, 'index.html');

async function createServer() {
  const app = express();
  const template = await fs.readFile(indexHtmlPath, 'utf-8');

  app.use(express.static(clientDir, { index: false }));

  app.all('*', async (req, res) => {
    try {
      // Use absolute path for entry-server.js
      const entryServerPath = path.join(__dirname, 'entry-server.js');
      const { render } = await import(entryServerPath);
      const { appHtml, initialData, headHtml } = await render(req.originalUrl);

      // Read the client index.html to get the script tags
      const clientIndexPath = path.join(clientDir, 'index.html');
      const clientTemplate = await fs.readFile(clientIndexPath, 'utf-8');
      
      // Extract script tags from client build
      const scriptMatch = clientTemplate.match(/<script[^>]*src="[^"]*"[^>]*><\/script>/g);
      const scriptTags = scriptMatch ? scriptMatch.join('\n    ') : '';

      const html = template
        .replace('<!--ssr-head-outlet-->', headHtml)
        .replace('<!--ssr-outlet-->', appHtml)
        .replace('<!--initial-data-->', `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}</script>`)
        .replace('<!--ssr-script-outlet-->', scriptTags);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      console.error('SSR Error:', e);
      res.status(500).set({ 'Content-Type': 'text/html' }).end(template);
    }
  });

  return app;
}

if (!process.env.VERCEL) {
  createServer().then(app => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`HTTP server is running at http://localhost:${port}`);
    });
  }).catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default createServer;