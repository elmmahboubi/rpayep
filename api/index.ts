import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Use require so TypeScript doesn't type-check the SSR entry
const { render } = require('../dist/server/main.js');

const template = readFileSync(resolve('./dist/client/index.html'), 'utf-8');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url ?? '/';
  
  try {
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
    console.error(error);
    res.status(500).send('<h1>Internal Server Error</h1><p>Something went wrong.</p>');
  }
} 