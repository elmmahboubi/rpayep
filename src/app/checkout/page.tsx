"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, MapPin } from 'lucide-react';
import { getCartItem, clearCart } from '@/utils/cart';
import { preventScrollOnClick } from '@/utils/scrollUtils';
import type { CartItem } from '@/utils/cart';
import Image from 'next/image';
import type { Product } from '@/types/product';

interface ShippingData {
  streetAddress: string;
  city: string;
  zipCode: string;
  state: string;
  phoneNumber: string;
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [currentStep] = useState<'shipping' | 'payment'>('shipping');
  const [shippingData, setShippingData] = useState({
    streetAddress: '',
    city: '',
    zipCode: '',
    state: '',
    phoneNumber: ''
  });
  const [stateSuggestions, setStateSuggestions] = useState<string[]>([]);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1');

  const countryCodes = [
    { code: '+1', country: 'US/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+39', country: 'Italy' },
    { code: '+34', country: 'Spain' },
    { code: '+31', country: 'Netherlands' },
    { code: '+46', country: 'Sweden' },
    { code: '+47', country: 'Norway' },
    { code: '+45', country: 'Denmark' }
  ];

  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const canadianProvinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
    'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
    'Quebec', 'Saskatchewan', 'Yukon'
  ];

  const ukRegions = [
    'England', 'Scotland', 'Wales', 'Northern Ireland',
    'Bedfordshire', 'Berkshire', 'Bristol', 'Buckinghamshire', 'Cambridgeshire', 'Cheshire',
    'Cornwall', 'Cumbria', 'Derbyshire', 'Devon', 'Dorset', 'Durham', 'East Sussex', 'Essex',
    'Gloucestershire', 'Greater London', 'Greater Manchester', 'Hampshire', 'Herefordshire',
    'Hertfordshire', 'Isle of Wight', 'Kent', 'Lancashire', 'Leicestershire', 'Lincolnshire',
    'London', 'Merseyside', 'Norfolk', 'Northamptonshire', 'Northumberland', 'Nottinghamshire',
    'Oxfordshire', 'Rutland', 'Shropshire', 'Somerset', 'South Yorkshire', 'Staffordshire',
    'Suffolk', 'Surrey', 'Tyne and Wear', 'Warwickshire', 'West Midlands', 'West Sussex',
    'West Yorkshire', 'Wiltshire', 'Worcestershire'
  ];

  const australianStates = [
    'Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland',
    'South Australia', 'Tasmania', 'Victoria', 'Western Australia'
  ];

  const allRegions = [...usStates, ...canadianProvinces, ...ukRegions, ...australianStates];

  useEffect(() => {
    // Wrap cart access in ClientOnly logic
    if (typeof window !== 'undefined') {
      const item = getCartItem();
      if (!item) {
        router.push('/');
        return;
      }
      setCartItem(item);
    }
  }, [router]);

  useEffect(() => {
    if (isRedirecting) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isRedirecting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));

    // Clear phone error when user starts typing
    if (name === 'phoneNumber') {
      setPhoneError('');
    }

    if (name === 'state') {
      if (value.length >= 2) {
        const filtered = allRegions.filter(region => 
          region.toLowerCase().includes(value.toLowerCase())
        );
        setStateSuggestions(filtered.slice(0, 5));
        setShowStateSuggestions(true);
      } else {
        setStateSuggestions([]);
        setShowStateSuggestions(false);
      }
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if it's a valid phone number (7-15 digits)
    if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
      return true;
    }
    
    return false;
  };

  const sendShippingEmail = async (shippingData: ShippingData, product: Product) => {
    try {
      const response = await fetch('/api/send-shipping-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingData,
          product: {
            title: product.title,
            price: product.price,
            slug: product.slug,
            images: product.images
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  };

  const handleStateSelect = (state: string) => {
    setShippingData(prev => ({ ...prev, state }));
    setShowStateSuggestions(false);
    setStateSuggestions([]);
  };

  const handleContinueToCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    const fullPhoneNumber = selectedCountryCode + shippingData.phoneNumber;
    if (!validatePhoneNumber(fullPhoneNumber)) {
      setPhoneError('Please enter a valid phone number');
      return;
    }

    // Check if all required fields are filled
    const requiredFields = ['streetAddress', 'city', 'state', 'zipCode', 'phoneNumber'];
    const missingFields = requiredFields.filter(field => !shippingData[field as keyof typeof shippingData]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSendingEmail(true);
    
    try {
      // Send shipping information to email
      const shippingDataWithFullPhone = {
        ...shippingData,
        phoneNumber: selectedCountryCode + shippingData.phoneNumber
      };
      const emailSent = await sendShippingEmail(shippingDataWithFullPhone, product);
      
      if (!emailSent) {
        alert('Failed to send shipping information. Please try again.');
        setIsSendingEmail(false);
        return;
      }
      setIsSendingEmail(false);
      setIsRedirecting(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        window.location.href = product.checkoutLink;
      }, 4000); // 4 seconds
      
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred during checkout. Please try again.');
      setIsSendingEmail(false);
    }
  };

  const handleClearCart = () => {
    preventScrollOnClick(() => {
      if (typeof window !== 'undefined') {
        clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      router.push('/');
    }, true);
  };

  if (!cartItem) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <Link href="/" className="text-[#0046be] hover:text-[#003494]">
              Continue Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0e7ff] via-[#f8fafc] to-[#f0fdfa]">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-gray-100 flex flex-col items-center max-w-md mx-auto transition-all duration-500">
          <div className="mb-6 flex flex-col items-center">
            {/* Minimal neutral spinner */}
            <div className="mb-6">
              <div className="w-12 h-12 border-4 border-[#0046be]/30 border-t-[#0046be] rounded-full animate-spin"></div>
            </div>
            <Image 
              src="/secure-checkout.png" 
              alt="SSL Secure Checkout" 
              width={180}
              height={32}
              className="h-7 w-auto max-w-full object-contain mb-4 drop-shadow-lg"
            />
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center tracking-tight">Address Confirmed</h2>
            <p className="text-gray-700 text-center mb-2 text-lg font-medium">Your order will be sent to this address</p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-2 w-full max-w-xs text-sm text-gray-800 shadow-sm">
              <div className="font-semibold text-[#0046be] mb-1">Confirmed Address</div>
              <div>{shippingData.streetAddress}</div>
              <div>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</div>
              <div>Phone: {selectedCountryCode + shippingData.phoneNumber}</div>
            </div>
            <p className="text-gray-600 text-center mb-2 text-base">Wait to continue your checkout</p>
            <p className="text-xs text-gray-400 mt-2">Your information is encrypted and protected by SSL. Please do not close this window.</p>
          </div>
        </div>
      </div>
    );
  }

  const { product } = cartItem;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Link href={`/products/${product.slug}`} className="inline-flex items-center text-[#0046be] hover:text-[#003494] mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product
          </Link>

          {currentStep === 'shipping' ? (
            /* Shipping Step - Two Column Layout */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Section - Cart Information */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h2>
                
                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <Image 
                    src={product.images[0]} 
                    alt={product.title}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-cover rounded-xl shadow-sm mb-4 sm:mb-0"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 text-lg">{product.title}</h3>
                    <div className="flex items-center mt-2 space-x-4">
                      <p className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block">{product.condition}</p>
                      <span className="text-sm text-gray-600">Quantity: {cartItem.quantity}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-8 pt-8 space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-semibold text-[#0046be] bg-blue-50 px-3 py-1 rounded-full">FREE</span>
                  </div>
                  <div className="flex justify-between items-center text-2xl font-bold border-t border-gray-200 pt-6">
                    <span>Total:</span>
                    <span className="text-[#0046be]">${product.price.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleClearCart}
                  className="w-full mt-8 px-6 py-3 text-[#0046be] border-2 border-[#0046be] rounded-xl hover:bg-blue-50 hover:text-[#0046be] transition-all duration-300 font-medium"
                >
                  Clear Cart
                </button>
              </div>

              {/* Right Section - Shipping Form */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Shipping Address</h2>
                
                <form onSubmit={handleContinueToCheckout} className="space-y-6">
                    {/* Street Address */}
                    <div>
                      <label htmlFor="streetAddress" className="block text-sm font-semibold text-gray-700 mb-3">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        id="streetAddress"
                        name="streetAddress"
                        value={shippingData.streetAddress}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-[#0046be] transition-all duration-300"
                        placeholder="Enter your street address"
                        autoComplete="street-address"
                      />
                    </div>

                    {/* City and State Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-3">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={shippingData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-[#0046be] transition-all duration-300"
                          placeholder="Enter your city"
                          autoComplete="address-level2"
                        />
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-3">
                          State/Province *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={shippingData.state}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-[#0046be] transition-all duration-300"
                            placeholder="Enter your state or province"
                            autoComplete="address-level1"
                          />
                          {showStateSuggestions && stateSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                              {stateSuggestions.map((state) => (
                                <button
                                  key={state}
                                  type="button"
                                  onClick={() => handleStateSelect(state)}
                                  className="w-full text-left p-4 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                                >
                                  <div className="font-medium text-gray-900">{state}</div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-700 mb-3">
                        Zip Code *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-[#0046be] transition-all duration-300"
                        placeholder="10001"
                        autoComplete="postal-code"
                      />
                    </div>

                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-3">
                        Phone Number *
                      </label>
                      <div className="flex space-x-2">
                        <select
                          value={selectedCountryCode}
                          onChange={(e) => setSelectedCountryCode(e.target.value)}
                          className="px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-[#0046be] transition-all duration-300 bg-white"
                        >
                          {countryCodes.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={shippingData.phoneNumber}
                          onChange={handleInputChange}
                          required
                          maxLength={15}
                          className={`flex-1 px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-[#0046be] transition-all duration-300 ${
                            phoneError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200'
                          }`}
                          placeholder="(555) 123-4567"
                          autoComplete="tel"
                        />
                      </div>
                      {phoneError && (
                        <p className="mt-2 text-sm text-red-600">{phoneError}</p>
                      )}
                      <p className="mt-2 text-xs text-gray-500">Needed for secure delivery and order updates</p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingEmail || isRedirecting}
                      className={`w-full font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                        isSendingEmail || isRedirecting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#0046be] hover:bg-[#003494] text-white'
                      }`}
                    >
                      {isSendingEmail ? 'Confirming Address...' : isRedirecting ? 'Redirecting...' : 'Continue to Payment'}
                    </button>

                    <div className="mt-6 flex flex-col items-center space-y-4">
                      <Image 
                        src="/secure-checkout.png" 
                        alt="Secure Checkout" 
                        width={200}
                        height={32}
                        className="h-8 w-auto max-w-full object-contain"
                      />
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-[#0046be]">SSL Encrypted</span> Secure Checkout
                      </div>
                      <p className="text-xs text-gray-500 text-center max-w-sm">
                        Your information is protected with bank-level security. We use industry-standard SSL encryption to ensure your data remains private and secure.
                      </p>
                    </div>
                  </form>
              </div>
            </div>
          ) : (
            /* Payment Step - Full Height Layout */
            <div className="max-w-6xl mx-auto">
              {/* Compact Shipping Summary */}
              <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-[#0046be] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Shipping to:</h3>
                    <p className="text-gray-600 text-sm">
                      {shippingData.streetAddress}, {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Section with Redirect */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                {isRedirecting ? (
                  <div className="p-12 text-center">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0046be]"></div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Address Has Been Confirmed</h3>
                        <p className="text-gray-600">Redirecting you to our secure payment processor...</p>
                      </div>
                      <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-100 max-w-md">
                        <h4 className="font-semibold text-green-900 mb-3">✓ Address Confirmed</h4>
                        <div className="text-sm text-green-800 space-y-1">
                          <p>{shippingData.streetAddress}</p>
                          <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                          {shippingData.phoneNumber && (
                            <p>Phone: {selectedCountryCode + shippingData.phoneNumber}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Shipping Address Confirmed</h3>
                        <p className="text-gray-600">Your shipping information has been captured successfully.</p>
                      </div>
                      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 max-w-md">
                        <h4 className="font-semibold text-gray-900 mb-3">Shipping to:</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{shippingData.streetAddress}</p>
                          <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                          {shippingData.phoneNumber && (
                            <p>Phone: {shippingData.phoneNumber}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsRedirecting(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setTimeout(() => {
                            window.location.href = product.checkoutLink;
                          }, 1000);
                        }}
                        className="mt-6 bg-[#0046be] hover:bg-[#003494] text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage; 