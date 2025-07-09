import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on client side and check if localStorage is available
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const hasSeenCookieConsent = localStorage.getItem('cookieConsent');
        if (!hasSeenCookieConsent) {
          setIsVisible(true);
        }
      } catch (error) {
        // Silently handle any storage errors
        console.warn('Local storage not available or accessible:', error);
      }
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('cookieConsent', 'true');
      } catch (error) {
        console.warn('Could not save cookie consent:', error);
      }
    }
    setIsVisible(false);
  };

  // Since this component is wrapped in ClientOnly, we don't need the window check
  // ClientOnly ensures this only renders on the client after hydration
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-50 p-4 md:p-6">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-grow text-center sm:text-left">
          <p className="text-gray-700">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{' '}
            <Link to="/cookies" className="text-[#0046be] hover:text-[#003494] underline">
              Learn more
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAccept}
            className="bg-[#0046be] hover:bg-[#003494] text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Accept
          </button>
          <button
            onClick={handleAccept}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close cookie consent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;