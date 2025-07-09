import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import FeaturedProduct from '../components/FeaturedProduct';
import ProductReviews from '../components/ProductReviews';
import Footer from '../components/Footer';
import Head from '../components/Head';
import CookieConsent from '../components/CookieConsent';
import ClientOnly from '../components/ClientOnly';
import { getProducts, getFeaturedProducts } from '../api/products';

interface HomePageProps {
  initialData?: {
    products?: any[];
    featured?: any[];
  };
}

const HomePage: React.FC<HomePageProps> = ({ initialData = {} }) => {
  const [allProducts, setAllProducts] = useState(initialData.products || []);
  const [featuredProducts, setFeaturedProducts] = useState(initialData.featured || []);
  const [loading, setLoading] = useState(!initialData.products);
  const location = useLocation();

  useEffect(() => {
    const loadProducts = async () => {
      // Only fetch if we don't have initial data
      if (!initialData.products) {
        try {
          const [products, featured] = await Promise.all([
            getProducts(),
            getFeaturedProducts()
          ]);
          setAllProducts(products);
          setFeaturedProducts(featured);
        } catch (error) {
          console.error('Error loading products:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProducts();
  }, [initialData.products]);

  // FIXED: Handle hash-based navigation for same-page sections
  useEffect(() => {
    // Handle hash navigation when component mounts or location changes
    const handleHashNavigation = () => {
      if (location.hash) {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          // Delay slightly to ensure all content is rendered
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    // Handle hash navigation on mount
    handleHashNavigation();

    // Handle hash navigation when location changes
    if (location.hash) {
      handleHashNavigation();
    }

    // Handle legacy state-based scrolling (for backward compatibility)
    if (!loading && location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      // Clear the state to prevent scrolling on subsequent renders
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, document.title);
      }
    }
  }, [loading, location.hash, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0046be]"></div>
      </div>
    );
  }

  // Aggregate reviews from all products
  const aggregateReviews = () => {
    const allReviews: any[] = [];
    let totalRating = 0;
    let reviewCount = 0;

    // Collect reviews from all products
    [...allProducts, ...featuredProducts].forEach(product => {
      if (product.reviews && Array.isArray(product.reviews)) {
        allReviews.push(...product.reviews);
        product.reviews.forEach((review: any) => {
          if (typeof review.rating === 'number') {
            totalRating += review.rating;
            reviewCount++;
          }
        });
      }
    });

    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;
    
    return {
      reviews: allReviews,
      averageRating,
      totalReviews: allReviews.length
    };
  };

  const { reviews, averageRating, totalReviews } = aggregateReviews();

  return (
    <div className="min-h-screen flex flex-col">
      {/* 
        Head component for client-side meta updates.
        Initial SEO metadata is handled server-side in entry-server.tsx
      */}
      <Head
        title="HappyDeel - Where Savings Make You Smile"
        description="Discover premium cameras and photography equipment at HappyDeel. Shop the latest DSLR, mirrorless, and compact cameras from top brands with free shipping."
        keywords="cameras, photography equipment, DSLR, mirrorless cameras, electronics, tech gadgets, used cameras, refurbished electronics"
      />
      
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Featured Products Section */}
        <section id="featured" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Today's Deals</h2>
              <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                Discover our handpicked selection of premium tech gadgets that stand out for their exceptional quality and performance.
              </p>
            </div>
            
            <div className="space-y-12">
              {featuredProducts.map((product) => (
                <FeaturedProduct key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
        
        {/* All Products Section */}
        <ProductGrid products={allProducts} />
        
        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
              <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                Read reviews from photographers who have purchased from our store.
              </p>
            </div>
            
            <ProductReviews 
              reviews={reviews}
              averageRating={averageRating}
              totalReviews={totalReviews}
            />
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-16 bg-[#0046be]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-8">
              Subscribe to our newsletter to receive updates on new products, special offers, and photography tips.
            </p>
            <form className="max-w-md mx-auto flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button 
                type="submit"
                className="bg-[#313a4b] hover:bg-[#262d3b] text-white px-6 py-3 rounded-r-lg font-medium transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Cookie Consent - Wrapped in ClientOnly to prevent hydration mismatches */}
      <ClientOnly>
        <CookieConsent />
      </ClientOnly>
    </div>
  );
};

export default HomePage;