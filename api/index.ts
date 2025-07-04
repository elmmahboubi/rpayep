// /api/index.ts
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import compression from 'compression';

// This file is the entry point for Vercel Serverless Functions.
// It uses the production build artifacts to render the app.

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Vercel build output structure: /var/task/api/index.js
// The 'dist' folder is at /var/task/dist
const distPath = path.resolve(__dirname, '..', '..', 'dist');
const clientDistPath = path.join(distPath, 'client');
const serverDistPath = path.join(distPath, 'server');

const app = express();
app.use(compression());

// The static serving part is handled by vercel.json `routes`.
// This express app only handles SSR.

app.use('*', async (req, res) => {
  const url = req.originalUrl;

  try {
    const template = await fs.readFile(
      path.join(clientDistPath, 'index.html'),
      'utf-8'
    );
    const { render } = await import(path.join(serverDistPath, 'entry-server.js'));

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
    console.error(error.stack);
    res.status(500).send(error.stack);
  }
});

// Vercel will handle the server logic, we just need to export the app.
export default app; 