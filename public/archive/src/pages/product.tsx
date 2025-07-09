import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Head from '../components/Head';
import InstagramWidget from '../components/InstagramWidget';
import ProductReviews from '../components/ProductReviews';
import ShippingInfo from '../components/ShippingInfo';
import ClientOnly from '../components/ClientOnly';
import { getProductBySlug } from '../api/products';
import { addToCart } from '../utils/cart';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X, ShoppingCart, Zap, Eye, Users, MapPin, Truck, DollarSign, RefreshCw, Star } from 'lucide-react';
import { preventScrollOnClick } from '../utils/scrollUtils';
import type { Product } from '../types/product';

interface ProductPageProps {
  initialData?: {
    product?: Product;
  };
}

// Create a simple Not Found component
const ProductNotFound = () => (
  <div className="text-center py-20">
    <h1 className="text-4xl font-bold mb-4">404 - Product Not Found</h1>
    <p>Sorry, we couldn't find the product you're looking for.</p>
  </div>
);

const ProductPage: React.FC<ProductPageProps> = ({ initialData = {} }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(initialData.product || null);
  const [loading, setLoading] = useState(!initialData.product);
  const [activeImage, setActiveImage] = useState(0);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [urgencyData, setUrgencyData] = useState({ viewing: 0, addedToCart: 0 });

  const faqItems = useMemo(() => [
    {
      question: "Are the items new or used?",
      answer: "We offer both new and second-hand items. Product condition is clearly listed in the description (e.g., Brand New, Like New, Refurbished, or Used – Good Condition)."
    },
    {
      question: "Do products come with a warranty?",
      answer: "New items typically include a manufacturer warranty. For second-hand items, we offer a 30-day HappyDeel Guarantee for returns and exchanges, unless otherwise stated."
    },
    {
      question: "Can I return a product if it doesn't meet my expectations?",
      answer: "Yes! We offer 30-day hassle-free returns. The item must be in the same condition as received. Read our Return Policy for more details."
    },
    {
      question: "How long does shipping take?",
      answer: "Most orders ship within 5–8 business days. Delivery times vary by location, but you can expect your item within 5–8 business days on average."
    },
    {
      question: "Is there free shipping?",
      answer: "Yes, we offer free standard shipping on all orders currently. Express options are also available at checkout."
    },
    {
      question: "Are your second-hand products tested?",
      answer: "Absolutely. All second-hand electronics go through a multi-point inspection and are fully functional unless otherwise stated."
    },
    {
      question: "Can I trust the product photos?",
      answer: "Yes — what you see is what you get. Our photos show the actual product (or a very close representation for new items). We do not use stock images for used items."
    },
    {
      question: "Is local pickup available?",
      answer: "Currently, we are an online-only store, but we're working on introducing local pickup options in select cities soon."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach us anytime at support@happydeel.com or call us at +17176484487. We're available 7 days a week."
    }
  ], []);

  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      // Only fetch if we don't have initial data
      if (!initialData.product && slug) {
        try {
          const data = await getProductBySlug(slug);
          
          if (!mounted) return;

          if (!data) {
            navigate('/', { replace: true });
            return;
          }

          setProduct(data);
        } catch (error) {
          console.error('Error loading product:', error);
          if (mounted) {
            setError(error as Error);
            navigate('/', { replace: true });
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    };

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [slug, navigate, initialData.product]);

  // Generate urgency data on client side only
  useEffect(() => {
    if (!product) return;

    // Create a simple hash from the product slug for consistency
    let hash = 0;
    for (let i = 0; i < product.slug.length; i++) {
      const char = product.slug.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use the hash to generate consistent random numbers
    const seed = Math.abs(hash);
    const viewing = 6 + (seed % 14); // Range: 6-19
    const addedToCart = Math.max(1, Math.floor(viewing * (0.3 + (seed % 100) / 500))); // 30-50% of viewers
    
    setUrgencyData({ viewing, addedToCart });
  }, [product]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (showZoom) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [showZoom]);

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    preventScrollOnClick(() => {
      // Add product to cart
      addToCart(product);
      
      // Show loading state briefly for better UX
      setTimeout(() => {
        setIsAddingToCart(false);
        navigate('/checkout');
      }, 500);
    }, true);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    setIsBuyingNow(true);
    
    preventScrollOnClick(() => {
      // Add product to cart
      addToCart(product);
      
      // Show loading state briefly for better UX
      setTimeout(() => {
        setIsBuyingNow(false);
        navigate('/checkout');
      }, 500);
    }, true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl text-gray-600">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're having trouble loading this product.</p>
            <Link to="/" className="text-[#0046be] hover:text-[#003494]">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (product === null) {
    return <ProductNotFound />;
  }
  
  const { title, description, price, images, condition, reviews } = product;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* 
        Head component for client-side meta updates.
        Initial SEO metadata is handled server-side in entry-server.tsx
      */}
      <Head
        title={product.meta?.title || `${product.title} - HappyDeel`}
        description={product.meta?.description || `Discover ${product.title} on HappyDeel. ${product.description}.`}
        keywords={product.meta?.keywords || `${product.title}, HappyDeel, ecommerce, online shopping`}
      />
      
      <Header />
      <main className="flex-grow bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-start">
            {/* Image Gallery - Fixed */}
            <div className="relative lg:sticky lg:top-0 lg:self-start">
              <div 
                onClick={() => setShowZoom(true)}
                className="cursor-zoom-in relative group"
              >
                <img 
                  src={images[activeImage]} 
                  alt={`${title} - Image ${activeImage + 1}`}
                  className="w-full h-[500px] object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-lg"></div>
              </div>

              {/* Thumbnails */}
              <div className="mt-4 flex justify-center space-x-2 overflow-x-auto py-2">
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                      activeImage === idx ? 'ring-2 ring-[#0046be]' : 'ring-1 ring-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${title} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {activeImage === idx && (
                      <div className="absolute inset-0 bg-white/10"></div>
                    )}
                  </button>
                ))}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-[#0046be] hover:text-white p-2 rounded-full transition-all duration-300"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setActiveImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-[#0046be] hover:text-white p-2 rounded-full transition-all duration-300"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
            
            {/* Product Info - Increased height for desktop to show CTA buttons */}
            <div className="lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:pr-4 scrollbar-hide">
              <h1 className="text-3xl font-medium text-gray-900">{title}</h1>
              <div className="mt-2 text-gray-600">{condition}</div>
              {/* Price - FIXED: Use consistent locale formatting */}
              <div className="mt-4 text-4xl font-bold text-gray-900">
                ${new Intl.NumberFormat('en-US').format(price)}
              </div>
              
              {/* Mobile-Responsive Urgency Indicator - Only show when data is available */}
              <ClientOnly fallback={
                <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <div className="flex items-center text-gray-400">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                        <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse hidden sm:block"></div>
                    </div>
                  </div>
                </div>
              }>
                {(urgencyData.viewing > 0 || urgencyData.addedToCart > 0) && (
                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="flex items-center text-blue-700">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                          <span className="text-xs sm:text-sm font-medium">
                            <span className="hidden xs:inline">{urgencyData.viewing} people viewing</span>
                            <span className="xs:hidden">{urgencyData.viewing} viewing</span>
                          </span>
                        </div>
                        <div className="flex items-center text-indigo-700">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                          <span className="text-xs sm:text-sm font-medium">
                            <span className="hidden xs:inline">{urgencyData.addedToCart} added to cart</span>
                            <span className="xs:hidden">{urgencyData.addedToCart} in cart</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                        <span className="text-xs text-gray-600 font-medium hidden sm:inline">Live activity</span>
                      </div>
                    </div>
                  </div>
                )}
              </ClientOnly>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                {/* Add to Cart Button */}
                <button 
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || isBuyingNow}
                  className="w-full bg-[#0046be] hover:bg-[#003494] text-white py-4 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </button>

                {/* Buy Now Button */}
                <button 
                  onClick={handleBuyNow}
                  disabled={isAddingToCart || isBuyingNow}
                  className="w-full bg-white border-2 border-[#0046be] text-[#0046be] hover:bg-blue-50 hover:border-[#003494] hover:text-[#003494] py-4 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBuyingNow ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0046be] mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Buy Now
                    </>
                  )}
                </button>
              </div>

              {/* Enhanced Shipping Information with Country Detection */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping & Delivery</h3>
                <ClientOnly fallback={
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-lg mr-3 flex-shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mt-1"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                }>
                  <ShippingInfo />
                </ClientOnly>
              </div>
              
              {/* Product Description */}
              <div className="mt-8">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Product Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{description}</p>
              </div>
              
              {/* FAQ Section */}
              <div className="mt-12 border-t pt-8">
                <button
                  onClick={() => setShowFAQ(!showFAQ)}
                  className="w-full flex items-center justify-between text-left text-gray-900 hover:text-[#0046be] transition-colors duration-300"
                >
                  <span className="text-xl font-medium">Frequently Asked Questions</span>
                  {showFAQ ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                
                {showFAQ && (
                  <div className="mt-6 space-y-6">
                    {faqItems.map((item, index) => (
                      <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                        <h3 className="font-medium text-gray-900 mb-2">{item.question}</h3>
                        <p className="text-gray-600">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Instagram Widget */}
              <div className="mt-12 border-t pt-8">
                <h2 className="text-xl font-medium text-gray-900 mb-6 text-center">Follow Us on Instagram</h2>
                <InstagramWidget />
              </div>
            </div>
          </div>

          {/* Product Reviews Section - Only show if reviews exist */}
          {reviews && reviews.length > 0 && (
            <div className="mt-16">
              <ProductReviews 
                reviews={reviews}
                averageRating={product.rating}
                totalReviews={product.reviewCount}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Zoom Modal */}
      {showZoom && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50"
          onClick={() => setShowZoom(false)}
        >
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowZoom(false);
              }}
              className="p-2 text-white hover:text-[#0046be] transition-colors duration-200"
              aria-label="Close zoom view"
            >
              <X className="h-8 w-8" />
            </button>
          </div>
          
          <div 
            className="absolute inset-0 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-full max-h-full">
              <img
                src={images[activeImage]}
                alt={`${title} - Image ${activeImage + 1}`}
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-[#0046be] p-3 rounded-full text-white transition-colors duration-200"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-[#0046be] p-3 rounded-full text-white transition-colors duration-200"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;