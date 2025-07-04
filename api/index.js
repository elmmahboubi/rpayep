// This file is the entry point for the Vercel Serverless Function.
// It imports and uses our Express application from the built server bundle.

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple SSR render function
async function renderPage(url) {
  try {
    // Read the HTML template
    const template = await fs.readFile(
      path.resolve(__dirname, '../dist/client/index.html'),
      'utf-8'
    );

    // For now, return a simple HTML with basic meta tags
    // This is a fallback until we can get the full SSR working
    const title = url.includes('/products/') ? 'Product - HappyDeel' : 'HappyDeel - Where Savings Make You Smile';
    const description = 'Discover premium cameras and photography equipment at HappyDeel. Shop the latest DSLR, mirrorless, and compact cameras from top brands.';
    
    const headHtml = `
      <title>${title}</title>
      <meta name="description" content="${description}" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charset="utf-8" />
      <link rel="canonical" href="https://happydeel.com${url}" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://happydeel.com${url}" />
    `;

    const appHtml = `
      <div id="root">
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
          <div style="text-align: center;">
            <h1>Loading...</h1>
            <p>Please wait while the page loads.</p>
          </div>
        </div>
      </div>
    `;

    const initialData = {};

    const html = template
      .replace(`<!--ssr-head-outlet-->`, headHtml)
      .replace(`<!--ssr-outlet-->`, appHtml)
      .replace(
        `<!--initial-data-->`,
        `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}</script>`
      );

    return { html, statusCode: 200 };
  } catch (error) {
    console.error('Render error:', error);
    return {
      html: `
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
      `,
      statusCode: 500
    };
  }
}

// Create Express app
const app = express();

// Serve static files
app.use(express.static(path.resolve(__dirname, '../dist/client'), { index: false }));

// Handle all routes
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl;
    console.log('Handling request for:', url);
    
    const { html, statusCode } = await renderPage(url);
    
    res.status(statusCode).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (error) {
    console.error('Request error:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>HappyDeel - Error</title>
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

// Export for Vercel
export default app; 