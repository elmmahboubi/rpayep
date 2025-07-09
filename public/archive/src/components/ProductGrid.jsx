import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Filter, ChevronDown } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const ProductGrid = ({ products }) => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('price-high'); // Changed default from 'featured' to 'price-high'
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  
  // Add ref for the products section
  const productsRef = useRef(null);

  const searchQuery = searchParams.get('search')?.toLowerCase();

  // Get unique brands and conditions for filters
  const brands = [...new Set(products.map(p => p.brand))];
  const conditions = [...new Set(products.map(p => p.condition))];

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery)
      );
    }

    // Apply brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    // Apply condition filter
    if (selectedConditions.length > 0) {
      filtered = filtered.filter(p => selectedConditions.includes(p.condition));
    }

    // Apply price range filter
    if (priceRange.min !== '') {
      filtered = filtered.filter(p => p.price >= Number(priceRange.min));
    }
    if (priceRange.max !== '') {
      filtered = filtered.filter(p => p.price <= Number(priceRange.max));
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'featured':
        default:
          return 0;
      }
    });
  }, [products, sortBy, selectedBrands, selectedConditions, priceRange, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle scrolling when page changes - moved entirely to useEffect
  useEffect(() => {
    // Only run on client side and when we have a valid page change (not initial load)
    if (typeof window === 'undefined' || !productsRef.current || currentPage === 1) return;
    
    // Small delay to ensure DOM has updated after page change
    const timeoutId = setTimeout(() => {
      if (productsRef.current) {
        const headerHeight = 120; // Approximate header height
        const elementPosition = productsRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 50);

    // Cleanup timeout on unmount or dependency change
    return () => clearTimeout(timeoutId);
  }, [currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrands, selectedConditions, priceRange, sortBy, searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scrolling logic is now handled entirely by the useEffect above
  };

  return (
    <div id="products" ref={productsRef} className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          {/* Filters Sidebar */}
          <div className={`md:w-64 flex-shrink-0 ${filterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-lg mb-4">Filters</h3>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046be]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046be]"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Brands</h4>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          setSelectedBrands(
                            e.target.checked
                              ? [...selectedBrands, brand]
                              : selectedBrands.filter(b => b !== brand)
                          );
                        }}
                        className="mr-2 text-[#0046be] focus:ring-[#0046be]"
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Condition</h4>
                <div className="space-y-2">
                  {conditions.map(condition => (
                    <label key={condition} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(condition)}
                        onChange={(e) => {
                          setSelectedConditions(
                            e.target.checked
                              ? [...selectedConditions, condition]
                              : selectedConditions.filter(c => c !== condition)
                          );
                        }}
                        className="mr-2 text-[#0046be] focus:ring-[#0046be]"
                      />
                      {condition}
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setPriceRange({ min: '', max: '' });
                  setSelectedBrands([]);
                  setSelectedConditions([]);
                }}
                className="w-full px-4 py-2 text-[#0046be] border border-[#0046be] rounded-lg hover:bg-blue-50 transition-colors duration-300"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-medium text-gray-900">
                All Products
                {filteredAndSortedProducts.length > 0 && (
                  <span className="text-sm text-gray-500 ml-2">
                    ({filteredAndSortedProducts.length} items)
                  </span>
                )}
              </h2>
              
              <div className="flex gap-4">
                <button 
                  className="md:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </button>
                
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                    }}
                    className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0046be]"
                  >
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="rating">Highest Rated</option>
                    <option value="featured">Featured</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your criteria.</p>
              </div>
            ) : (
              <>
                {/* Updated grid: 3 columns on desktop (md:grid-cols-3), 2 columns on mobile (grid-cols-2) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex space-x-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                            currentPage === i + 1
                              ? 'bg-[#0046be] text-white'
                              : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-[#0046be] border border-gray-300'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;