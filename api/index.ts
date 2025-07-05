// /api/index.ts
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import compression from 'compression';

// This file is the entry point for Vercel Serverless Functions.
// It uses the production build artifacts to render the app.

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Vercel build output structure: /var/task/
// The 'dist' folder is at /var/task/dist
// The root of the project is one level up from the 'api' folder
const CWD = path.resolve(__dirname, '..');
const clientDistPath = path.join(CWD, 'dist/client');
const serverDistPath = path.join(CWD, 'dist/server');

const app = express();
app.use(compression());

// Serve static files from the `dist/client` directory
// This is necessary for local testing with `npm run serve`
// On Vercel, the `vercel.json` routes handle this
app.use(express.static(clientDistPath, { index: false }));

// The static serving part is handled by vercel.json `routes`.
// This express app only handles SSR.

app.use('*', async (req, res) => {
  const url = req.originalUrl;

  try {
    const template = await fs.readFile(
      path.join(clientDistPath, 'index.html'),
      'utf-8'
    );
    // Use an absolute path for the import, which is more robust
    const serverEntryPath = path.join(serverDistPath, 'entry-server.js');
    const { render } = await import(serverEntryPath);

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
    res.status(500).send('<h1>Something went wrong</h1><p>Please try again later.</p>');
  }
});

// For local production testing (`npm run serve`)
if (process.env.NODE_ENV !== 'vercel') {
    const port = process.env.PORT || 4173;
    app.listen(port, () => {
        console.log(`✅ Production server for local testing running at http://localhost:${port}`);
    });
}

// Export the app for Vercel
export default app; 