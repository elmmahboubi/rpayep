import type { Product } from '../types/product';

// Use Vite's import.meta.glob for both SSR and client
const productModules = import.meta.glob('../products/*/product.json', { 
  eager: true,
  import: 'default'
});

console.log('Product modules loaded:', Object.keys(productModules).length);

// Create products array with error handling
const allProducts: Product[] = Object.entries(productModules).map(([path, module]) => {
  try {
    const folderSlug = path.split('/')[2];
    const productData = module as any;
    
    console.log(`Processing product: ${folderSlug}`);
    
    return {
      id: productData.slug || folderSlug,
      slug: productData.slug || folderSlug, // Use slug from JSON, fallback to folder name
      ...productData
    };
  } catch (error) {
    console.error(`Error processing product at ${path}:`, error);
    // Return a fallback product to prevent crashes
    return {
      id: 'error-product',
      slug: 'error-product',
      title: 'Product Not Available',
      description: 'This product is temporarily unavailable.',
      price: 0,
      rating: 0,
      reviewCount: 0,
      inStock: false,
      images: [],
      condition: 'Unknown',
      category: 'Unknown',
      brand: 'Unknown',
      payeeEmail: 'happyemilliano@gmail.com',
      currency: 'USD',
      checkoutLink: '',
      meta: {
        title: 'Product Not Available - HappyDeel',
        description: 'This product is temporarily unavailable.',
        keywords: ''
      }
    };
  }
}).filter(Boolean); // Remove any undefined products

console.log('Total products loaded:', allProducts.length);

export async function getProducts(): Promise<Product[]> {
  try {
    console.log('getProducts called, returning', allProducts.length, 'products');
    return allProducts;
  } catch (error) {
    console.error('Error in getProducts:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    console.log('getProductBySlug called with slug:', slug);
    const product = allProducts.find(product => product.slug === slug);
    console.log('Product found:', product ? product.title : 'Not found');
    return product;
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    return undefined;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const featured = allProducts.sort((a, b) => b.slug.localeCompare(a.slug)).slice(0, 3);
    console.log('getFeaturedProducts returning', featured.length, 'products');
    return featured;
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  try {
    const currentProduct = allProducts.find(p => p.slug === slug);
    if (!currentProduct) return [];
    const related = allProducts.filter(product => product.category === currentProduct.category && product.slug !== slug).slice(0, 3);
    console.log('getRelatedProducts returning', related.length, 'products for slug:', slug);
    return related;
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    return [];
  }
}