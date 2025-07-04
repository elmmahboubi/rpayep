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
      console.error('SSR Error:', error);
      // Return a fallback HTML instead of crashing
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>HappyDeel - Something went wrong</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body>
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
              <div style="text-align: center;">
                <h1>Something went wrong</h1>
                <p>Please try again later.</p>
                <a href="/" style="color: #0070f3; text-decoration: none;">Go back home</a>
              </div>
            </div>
          </body>
        </html>
      `);
    }
  });

  return app;
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  createProdServer().then(app => {
    const port = process.env.PORT || 4173;
    app.listen(port, () => {
      console.log(`Production server running at http://localhost:${port}`);
    });
  });
}

// For Vercel deployment
export default createProdServer; 