import type { Product } from '../types/product';

let isServer = typeof window === 'undefined';

// --- Server-side (SSR) implementation ---
let getProductsImpl: () => Promise<Product[]>;
let getProductBySlugImpl: (slug: string) => Promise<Product | undefined>;
let getFeaturedProductsImpl: () => Promise<Product[]>;
let getRelatedProductsImpl: (slug: string) => Promise<Product[]>;

if (isServer) {
  const fs = require('fs');
  const path = require('path');

  function getAllProductSlugs(): string[] {
    const productsDir = path.resolve(process.cwd(), 'src/products');
    return fs.readdirSync(productsDir).filter((dir: string) => {
      const stat = fs.statSync(path.join(productsDir, dir));
      return stat.isDirectory() && fs.existsSync(path.join(productsDir, dir, 'product.json'));
    });
  }

  getProductsImpl = async function getProducts() {
    const slugs = getAllProductSlugs();
    return slugs.map((slug) => {
      const productJsonPath = path.join(process.cwd(), 'src/products', slug, 'product.json');
      const productJson = fs.readFileSync(productJsonPath, 'utf-8');
      const product = JSON.parse(productJson);
      return { id: slug, slug, ...product };
    });
  };

  getProductBySlugImpl = async function getProductBySlug(slug: string) {
    try {
      const productJsonPath = path.join(process.cwd(), 'src/products', slug, 'product.json');
      const productJson = fs.readFileSync(productJsonPath, 'utf-8');
      const product = JSON.parse(productJson);
      return { id: slug, slug, ...product };
    } catch {
      return undefined;
    }
  };

  getFeaturedProductsImpl = async function getFeaturedProducts() {
    const products = await getProductsImpl();
    return products.sort((a, b) => b.slug.localeCompare(a.slug)).slice(0, 3);
  };

  getRelatedProductsImpl = async function getRelatedProducts(slug: string) {
    const products = await getProductsImpl();
    const currentProduct = products.find((p) => p.slug === slug);
    if (!currentProduct) return [];
    return products.filter((product) => product.category === currentProduct.category && product.slug !== slug).slice(0, 3);
  };
} else {
  // --- Client-side (Vite) implementation ---
  const productModules = import.meta.glob('../products/*/product.json', { 
    eager: true,
    import: 'default'
  });
  const allProducts = Object.entries(productModules).map(([path, module]) => {
    const slug = path.split('/')[2];
    return {
      id: slug,
      slug,
      ...(module as any)
    };
  });

  getProductsImpl = async function getProducts() {
    return allProducts;
  };

  getProductBySlugImpl = async function getProductBySlug(slug: string) {
    return allProducts.find(product => product.slug === slug);
  };

  getFeaturedProductsImpl = async function getFeaturedProducts() {
    return allProducts.sort((a, b) => b.slug.localeCompare(a.slug)).slice(0, 3);
  };

  getRelatedProductsImpl = async function getRelatedProducts(slug: string) {
    const currentProduct = allProducts.find(p => p.slug === slug);
    if (!currentProduct) return [];
    return allProducts.filter(product => product.category === currentProduct.category && product.slug !== slug).slice(0, 3);
  };
}

export const getProducts = getProductsImpl;
export const getProductBySlug = getProductBySlugImpl;
export const getFeaturedProducts = getFeaturedProductsImpl;
export const getRelatedProducts = getRelatedProductsImpl;