import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// IMPORTANT: Vercel builds the project and places the output in the parent directory.
// The `dist` folder will be at `../dist` relative to this `api/index.ts` file.
const VERCEL_DIST_PATH = resolve(__dirname, '..', 'dist');

// The client index.html is our template.
const template = readFileSync(resolve(VERCEL_DIST_PATH, 'client', 'index.html'), 'utf-8');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url ?? '/';
  
  try {
    // Use dynamic import for the ES module SSR entry
    const { render } = await import(resolve(VERCEL_DIST_PATH, 'server', 'entry-server.js'));

    const { appHtml, headHtml, initialData, statusCode } = await render(url);

    const html = template
      .replace(`<!--ssr-head-outlet-->`, headHtml)
      .replace(`<!--ssr-outlet-->`, appHtml)
      .replace(
        `<!--initial-data-->`,
        `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}</script>`
      );

    res
      .status(statusCode || 200)
      .setHeader('Content-Type', 'text/html')
      .setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59') // Recommended Vercel caching
      .send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('<h1>Internal Server Error</h1>');
  }
} 