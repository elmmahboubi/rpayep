import React from 'react';
import { MapPin, Truck, DollarSign, RefreshCw } from 'lucide-react';

interface ShippingInfoProps {
  className?: string;
}

const ShippingInfo: React.FC<ShippingInfoProps> = ({ className = '' }) => {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {/* Shipping Destination */}
      <div className="flex items-start p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center justify-center w-10 h-10 bg-[#0046be] rounded-lg mr-3 flex-shrink-0">
          <MapPin className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 mb-1">Shipping:</p>
          <p className="text-sm text-gray-700 font-medium">
            🇺🇸 This product ships from the USA. We offer fast shipping both inside and outside the United States.
          </p>
        </div>
      </div>
      {/* Delivery Time */}
      <div className="flex items-start p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg mr-3 flex-shrink-0">
          <Truck className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 mb-1">Estimated delivery:</p>
          <p className="text-sm text-gray-700 font-medium">5-14 business days</p>
          <p className="text-xs text-gray-500 mt-1">Worldwide shipping available</p>
        </div>
      </div>
      {/* Shipping Cost */}
      <div className="flex items-start p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100 hover:border-yellow-200 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center justify-center w-10 h-10 bg-yellow-600 rounded-lg mr-3 flex-shrink-0">
          <DollarSign className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 mb-1">Shipping cost:</p>
          <p className="text-sm font-bold text-green-600">FREE</p>
          <p className="text-xs text-gray-500 mt-1">No minimum order</p>
        </div>
      </div>
      {/* Returns */}
      <div className="flex items-start p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-lg mr-3 flex-shrink-0">
          <RefreshCw className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 mb-1">Returns:</p>
          <p className="text-sm text-gray-700 font-medium">30-day policy</p>
          <p className="text-xs text-gray-500 mt-1">Hassle-free returns</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;