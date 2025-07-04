import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { getProducts, getFeaturedProducts } from './api/products';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import fs from 'fs';
import path from 'path';

/**
 * Server-side render function. It now returns an object with the rendered
 * app HTML, initial data, and head metadata, instead of a full HTML string.
 */
export async function render(url: string) {
  let initialData = {};
  let headHtml = '';
  const defaultMeta = {
    title: 'HappyDeel - Where Savings Make You Smile',
    description: 'Discover premium cameras and photography equipment at HappyDeel. Shop the latest DSLR, mirrorless, and compact cameras from top brands.',
    keywords: 'cameras, photography equipment, DSLR, mirrorless cameras, electronics, tech gadgets',
    canonicalUrl: `https://happydeel.com${url}`,
    ogImage: 'https://happydeel.com/logosvg.svg'
  };
  
  try {
    let product = null;
    if (url.startsWith('/products/')) {
      let slug = url.split('/products/')[1];
      slug = slug.replace(/\/$/, ''); // Remove trailing slash if present
      const productJsonPath = path.resolve(process.cwd(), 'src/products', slug, 'product.json');
      try {
        const productJson = fs.readFileSync(productJsonPath, 'utf-8');
        product = JSON.parse(productJson);
        initialData = { product };
      } catch (e) {
        product = null;
      }
    } else if (url === '/' || url === '') {
      const [products, featured] = await Promise.all([getProducts(), getFeaturedProducts()]);
      initialData = { products, featured };
    }
    
    // Construct Head Metadata String
    const title = product?.meta?.title || defaultMeta.title;
    const description = product?.meta?.description || defaultMeta.description;
    const keywords = product?.meta?.keywords || defaultMeta.keywords;
    const ogImage = product?.images?.[0] ? `https://happydeel.com${product.images[0]}` : defaultMeta.ogImage;
    
    headHtml = `
      <title>${title}</title>
      <meta name="description" content="${description}">
      <meta name="keywords" content="${keywords}">
      <link rel="canonical" href="${defaultMeta.canonicalUrl}">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${ogImage}">
      <meta property="og:url" content="${defaultMeta.canonicalUrl}">
      <meta property="twitter:card" content="summary_large_image">
    `;

  } catch (error) {
    console.error('Error fetching data for SSR:', error);
    headHtml = `<title>${defaultMeta.title}</title><meta name="description" content="${defaultMeta.description}">`;
  }

  // CRITICAL: Render the React app to a string. This is the only part that goes inside #root.
  let appHtml = '';
  try {
    appHtml = renderToString(
      <ErrorBoundary>
        <StaticRouter location={url}>
          <App initialData={initialData} />
        </StaticRouter>
      </ErrorBoundary>
    );
  } catch (renderError) {
    console.error('SSR render error:', renderError);
    // Fallback to an empty string if render fails.
    // The client will render the loading state.
    appHtml = '';
  }

  return { appHtml, initialData, headHtml };
}