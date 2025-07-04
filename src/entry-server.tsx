import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server';
import * as helmetAsync from 'react-helmet-async';
import { getProducts, getFeaturedProducts, getProductBySlug } from './api/products';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import type { Product } from './types/product';

const { HelmetProvider } = helmetAsync;

// Helper to generate all product meta tags
function generateProductMeta(product: Product, url: string) {
  try {
    const domain = 'https://happydeel.com'; // Use your actual domain
    const brandName = 'HappyDeel';
    const twitterHandle = '@happydeel'; // Replace with your actual Twitter handle

    const title = product.meta?.title || `${product.title} | ${brandName}`;
    const description = product.meta?.description || product.description.substring(0, 160);
    const imageUrl = product.images?.[0] ? `${domain}${product.images[0]}` : `${domain}/logosvg.svg`;
    const canonicalUrl = `${domain}/products/${product.slug}`;

    // JSON-LD Structured Data for Rich Snippets
    const jsonLd = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.title,
      image: product.images.map(img => `${domain}${img}`),
      description: product.description,
      sku: product.id,
      brand: {
        '@type': 'Brand',
        name: product.brand || brandName,
      },
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: product.currency || 'USD',
        price: product.price.toFixed(2),
        availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/UsedCondition', // Assuming most are used
      },
      // Example of adding aggregate rating if you have it
      ...(product.rating && product.reviewCount && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        },
      }),
    };

    const headHtml = `
      <title>${title}</title>
      <meta name="description" content="${description}" />
      <meta name="keywords" content="${product.meta?.keywords || ''}" />
      <link rel="canonical" href="${canonicalUrl}" />

      <!-- Open Graph (Facebook, LinkedIn, etc.) -->
      <meta property="og:type" content="product" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:url" content="${canonicalUrl}" />
      <meta property="og:site_name" content="${brandName}" />
      <meta property="product:brand" content="${product.brand || brandName}" />
      <meta property="product:price:amount" content="${product.price.toFixed(2)}" />
      <meta property="product:price:currency" content="${product.currency || 'USD'}" />
      <meta property="product:availability" content="${product.inStock ? 'in stock' : 'out of stock'}" />

      <!-- Twitter Cards -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${imageUrl}" />
      <meta name="twitter:site" content="${twitterHandle}" />

      <!-- JSON-LD Structured Data -->
      <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    `;
    
    return headHtml;
  } catch (error) {
    console.error('Error generating product meta:', error);
    return generateDefaultMeta(url);
  }
}

// Helper for default meta tags for non-product pages
function generateDefaultMeta(url: string) {
  try {
    const domain = 'https://happydeel.com';
    const brandName = 'HappyDeel';

    const title = `${brandName} - Where Savings Make You Smile`;
    const description = 'Discover premium cameras and photography equipment at HappyDeel. Shop the latest DSLR, mirrorless, and compact cameras from top brands.';
    const keywords = 'cameras, photography equipment, DSLR, mirrorless cameras, electronics, tech gadgets';

    return `
      <title>${title}</title>
      <meta name="description" content="${description}" />
      <meta name="keywords" content="${keywords}" />
      <link rel="canonical" href="${domain}${url}" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${domain}/logosvg.svg" />
      <meta property="og:url" content="${domain}${url}" />
    `;
  } catch (error) {
    console.error('Error generating default meta:', error);
    return '<title>HappyDeel</title>';
  }
}

function createRoutes(initialData: any) {
  return [{ path: "*", Component: () => <App initialData={initialData} /> }];
}

/**
 * Server-side render function. It now returns an object with the rendered
 * app HTML, initial data, and head metadata, instead of a full HTML string.
 */
export async function render(url: string) {
  const helmetContext: object = {};
  let initialData: any = {};
  let statusCode = 200;
  let headHtml = '';

  try {
    if (url.startsWith('/products/')) {
      const slug = url.split('/products/')[1].replace(/\/$/, '');
      console.log('Looking for product with slug:', slug);
      
      const product = await getProductBySlug(slug);
      
      if (!product) {
        console.log('Product not found for slug:', slug);
        statusCode = 404;
        headHtml = generateDefaultMeta(url); // Fallback to default meta for 404
        initialData = { product: null };
      } else {
        console.log('Product found:', product.title);
        initialData = { product };
        headHtml = generateProductMeta(product, url);
      }
    } else {
      // Logic for homepage or other pages
      if (url === '/' || url === '') {
        try {
          const [products, featured] = await Promise.all([getProducts(), getFeaturedProducts()]);
          initialData = { products, featured };
        } catch (error) {
          console.error('Error loading homepage data:', error);
          initialData = { products: [], featured: [] };
        }
      }
      headHtml = generateDefaultMeta(url);
    }
  } catch (error) {
    console.error('Error fetching data for SSR:', error);
    statusCode = 500;
    headHtml = generateDefaultMeta(url);
  }

  try {
    const routes = createRoutes(initialData);
    const handler = createStaticHandler(routes);
    const fetchRequest = new Request(`http://localhost${url}`, { method: 'GET' });
    const context = await handler.query(fetchRequest);
    
    if (context instanceof Response) throw context;

    const router = createStaticRouter(handler.dataRoutes, context);

    const appHtml = renderToString(
      <React.StrictMode>
        <ErrorBoundary>
          <HelmetProvider context={helmetContext}>
            <StaticRouterProvider router={router} context={context} />
          </HelmetProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );

    return { appHtml, initialData, headHtml, statusCode };
  } catch (error) {
    console.error('Error rendering app:', error);
    // Return a fallback HTML
    return {
      appHtml: '<div>Something went wrong. Please try again.</div>',
      initialData: {},
      headHtml: generateDefaultMeta(url),
      statusCode: 500
    };
  }
}