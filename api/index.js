// This file is the entry point for the Vercel Serverless Function.
// It imports and uses our Express application from the built server bundle.

import createServer from '../dist/server/server.js';

let app;

// Create the app instance once
createServer().then(instance => {
  app = instance;
}).catch(err => {
  console.error('Failed to create server instance:', err);
  process.exit(1);
});

// Export a handler function for Vercel
export default async function handler(req, res) {
  if (!app) {
    res.status(500).send('Server failed to initialize');
    return;
  }
  await app(req, res);
} 