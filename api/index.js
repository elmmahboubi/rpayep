// This file is the entry point for the Vercel Serverless Function.
// It imports and uses our Express application from the built server bundle.

import createServer from '../server.prod.ts';

let app;

// Create the app instance once
createServer().then(instance => {
  app = instance;
}).catch(err => {
  console.error('Failed to create server instance:', err);
  // Don't exit, just log the error
});

// Export a handler function for Vercel
export default async function handler(req, res) {
  if (!app) {
    // If app is not ready, return a simple response
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>HappyDeel - Loading...</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
            <div style="text-align: center;">
              <h1>Loading...</h1>
              <p>Please wait while we set up the server.</p>
            </div>
          </div>
        </body>
      </html>
    `);
    return;
  }
  
  try {
    await app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
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
} 