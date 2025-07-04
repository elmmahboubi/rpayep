import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from './components/ScrollToTop';

// Eager load HomePage for better initial load performance
import HomePage from './pages';

// Lazy load other pages
const ReturnPolicyPage = lazy(() => import('./pages/return-policy'));
const PrivacyPolicyPage = lazy(() => import('./pages/privacy-policy'));
const TermsPage = lazy(() => import('./pages/terms'));
const ProductPage = lazy(() => import('./pages/product'));
const TrackPage = lazy(() => import('./pages/track'));
const ContactPage = lazy(() => import('./pages/contact'));
const AboutPage = lazy(() => import('./pages/about'));
const ShippingPolicyPage = lazy(() => import('./pages/shipping-policy'));
const CookiesPage = lazy(() => import('./pages/cookies'));
const CheckoutPage = lazy(() => import('./pages/checkout'));

interface AppProps {
  initialData?: any;
}

function App({ initialData }: AppProps) {
  return (
    <HelmetProvider>
      <ScrollToTop>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0046be]"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<HomePage initialData={initialData} />} />
            <Route path="/return-policy" element={<ReturnPolicyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/products/:slug" element={<ProductPage initialData={initialData} />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ScrollToTop>
    </HelmetProvider>
  );
}

export default App;