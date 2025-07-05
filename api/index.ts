// /api/index.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'node:fs/promises';
import path from 'node:path';

// This is the Vercel Serverless Function entry point.

// Vercel build output structure: /var/task/
// __dirname will be /var/task/api/
const CWD = path.resolve(__dirname, '..');
const clientDistPath = path.join(CWD, 'dist/client');
const serverDistPath = path.join(CWD, 'dist/server');

// We only need to export a default function for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = req.url ?? '/';

    // 1. Read the HTML template
    const template = await fs.readFile(
      path.join(clientDistPath, 'index.html'),
      'utf-8'
    );

    // 2. Import the server-side render function
    const serverEntryPath = path.join(serverDistPath, 'entry-server.js');
    const { render } = await import(serverEntryPath);

    // 3. Render the app
    const { appHtml, headHtml, initialData, statusCode } = await render(url);

    // 4. Inject the rendered parts into the template
    const html = template
      .replace(`<!--ssr-head-outlet-->`, headHtml)
      .replace(`<!--ssr-outlet-->`, appHtml)
      .replace(
        `<!--initial-data-->`,
        `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}</script>`
      );

    // 5. Send the response
    res
      .status(statusCode || 200)
      .setHeader('Content-Type', 'text/html')
      .setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59') // Recommended Vercel caching
      .end(html);
  } catch (error: any) {
    console.error(error);
    // Send a generic error response
    res.status(500).send('<h1>Internal Server Error</h1>');
  }
} 