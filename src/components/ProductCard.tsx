import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { slug, title, price, images, condition } = product;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link to={`/products/${slug}`} className="block">
        <img 
          src={images[0]} 
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="p-4">
          {/* FIXED: Removed invalid 'font-helvetica' class - h3 already uses 'Gotham' font from base styles */}
          <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
            {title}
          </h3>
          <div className="mt-1">
            <span className="text-sm text-gray-500">{condition}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            {/* Price - FIXED: Use consistent locale formatting */}
            <span className="text-xl font-bold text-gray-900">${new Intl.NumberFormat('en-US').format(price)}</span>
            <span className="text-[#0046be] hover:text-[#003494] flex items-center">
              View Details
              <ArrowRight className="h-4 w-4 ml-1" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;