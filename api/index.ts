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
    // Try multiple possible paths for the dist directory
    const possiblePaths = [
      resolve(__dirname, '..', 'dist'),
      resolve(__dirname, '..', '..', 'dist'),
      resolve(process.cwd(), 'dist'),
      '/var/task/dist', // Vercel's build environment
    ];

    let distPath = null;
    let template = null;
    let render = null;

    // Find the correct dist path
    for (const path of possiblePaths) {
      try {
        const templatePath = resolve(path, 'client', 'index.html');
        const serverPath = resolve(path, 'server', 'entry-server.js');
        
        // Test if files exist
        readFileSync(templatePath, 'utf-8');
        require(serverPath);
        
        distPath = path;
        template = readFileSync(templatePath, 'utf-8');
        const { render: renderFn } = await import(serverPath);
        render = renderFn;
        break;
      } catch (error) {
        console.log(`Path ${path} not found or invalid`);
        continue;
      }
    }

    if (!template || !render) {
      throw new Error('Could not find build files. Available paths tried: ' + possiblePaths.join(', '));
    }

    console.log('Using dist path:', distPath);
    console.log('Rendering URL:', url);

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
    console.error('API handler error:', error);
    res.status(500).send(`<h1>Internal Server Error</h1><p>${error.message}</p>`);
  }
} 