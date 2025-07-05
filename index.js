// This file is the entry point for the production server.
// It works for both local preview and Vercel deployment.
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import compression from 'compression';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const resolve = (p) => path.resolve(__dirname, p);

const app = express();

app.use(compression());

// Serve static assets from the client build directory
app.use(express.static(resolve('dist/client'), {
  index: false,
}));

app.use('*', async (req, res) => {
  const url = req.originalUrl;

  try {
    const template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8');
    const { render } = await import('./dist/server/entry-server.js');

    const { appHtml, headHtml, initialData, statusCode } = await render(url);

    const html = template
      .replace('<!--ssr-head-outlet-->', headHtml)
      .replace('<!--ssr-outlet-->', appHtml)
      .replace(
        '<!--initial-data-->',
        `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}</script>`
      );

    res.status(statusCode || 200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Production server running at http://localhost:${port}`);
}); 