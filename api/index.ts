import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Use process.cwd() for more reliable path resolution in Vercel's environment
const DIST_PATH = resolve(process.cwd(), 'dist');
const TEMPLATE_PATH = resolve(DIST_PATH, 'client', 'index.html');
const SERVER_ENTRY_PATH = resolve(DIST_PATH, 'server', 'entry-server.js');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url ?? '/';

  try {
    const template = readFileSync(TEMPLATE_PATH, 'utf-8');
    const { render } = await import(SERVER_ENTRY_PATH);

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
      .setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
      .send(html);
  } catch (error) {
    console.error('API handler error:', error);
    res.status(500).send(`<h1>Internal Server Error</h1><p>${(error as Error).message}</p>`);
  }
} 