import type { Product } from '../types/product';

// Use Vite's import.meta.glob for both SSR and client
const productModules = import.meta.glob('../products/*/product.json', { 
  eager: true,
  import: 'default'
});
const allProducts: Product[] = Object.entries(productModules).map(([path, module]) => {
  const folderSlug = path.split('/')[2];
  const productData = module as any;
  
  return {
    id: productData.slug || folderSlug,
    slug: productData.slug || folderSlug, // Use slug from JSON, fallback to folder name
    ...productData
  };
});

export async function getProducts(): Promise<Product[]> {
  return allProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return allProducts.find(product => product.slug === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return allProducts.sort((a, b) => b.slug.localeCompare(a.slug)).slice(0, 3);
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  const currentProduct = allProducts.find(p => p.slug === slug);
  if (!currentProduct) return [];
  return allProducts.filter(product => product.category === currentProduct.category && product.slug !== slug).slice(0, 3);
}