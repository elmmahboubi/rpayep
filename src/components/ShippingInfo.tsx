import React from 'react';
import { MapPin, Truck, DollarSign, RefreshCw } from 'lucide-react';

interface ShippingInfoProps {
  className?: string;
}

const ShippingInfo: React.FC<ShippingInfoProps> = ({ className = '' }) => {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {/* Shipping Destination */}
      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center mb-2">
          <div className="flex items-center justify-center w-8 h-8 bg-[#0046be] rounded-lg mr-2 flex-shrink-0">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <p className="text-sm font-semibold text-gray-900">Shipping:</p>
        </div>
        <div className="ml-10">
          <p className="text-sm text-gray-700 font-medium">
          Ships from the USA 🇺🇸 with fast domestic and international delivery.
          </p>
        </div>
      </div>
      {/* Delivery Time */}
      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center mb-2">
          <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg mr-2 flex-shrink-0">
            <Truck className="h-4 w-4 text-white" />
          </div>
          <p className="text-sm font-semibold text-gray-900">Estimated delivery:</p>
        </div>
        <div className="ml-10">
          <p className="text-sm text-gray-700 font-medium">5-14 business days</p>
          <p className="text-xs text-gray-500 mt-1">Worldwide shipping available</p>
        </div>
      </div>
      {/* Shipping Cost */}
      <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100 hover:border-yellow-200 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center mb-2">
          <div className="flex items-center justify-center w-8 h-8 bg-yellow-600 rounded-lg mr-2 flex-shrink-0">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
          <p className="text-sm font-semibold text-gray-900">Shipping cost:</p>
        </div>
        <div className="ml-10">
          <p className="text-sm font-bold text-green-600">FREE</p>
          <p className="text-xs text-gray-500 mt-1">No minimum order</p>
        </div>
      </div>
      {/* Returns */}
      <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center mb-2">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-lg mr-2 flex-shrink-0">
            <RefreshCw className="h-4 w-4 text-white" />
          </div>
          <p className="text-sm font-semibold text-gray-900">Returns:</p>
        </div>
        <div className="ml-10">
          <p className="text-sm text-gray-700 font-medium">30-day policy</p>
          <p className="text-xs text-gray-500 mt-1">Hassle-free returns</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
