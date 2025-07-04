import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Head from '../components/Head';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
  // Generate breadcrumb schema
  const generateTermsBreadcrumbSchema = () => {
    if (typeof window === 'undefined') return {};
    const baseUrl = window.location.origin;
    
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Terms of Service",
          "item": typeof window !== 'undefined' ? window.location.href : ''
        }
      ]
    };
  };

  // Generate FAQ schema
  const generateTermsFAQSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are the account requirements?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You must be 18 years or older to use this service, provide accurate and complete information when creating an account, maintain the security of your account, and notify us immediately of any unauthorized access."
          }
        },
        {
          "@type": "Question",
          "name": "What is your shipping policy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For all orders within the USA: Standard shipping takes 3-5 business days, free shipping on all orders currently, orders are processed within 1 business day, and tracking information is provided via email."
          }
        },
        {
          "@type": "Question",
          "name": "What payment methods do you accept?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We accept Credit/Debit Cards (Visa, Mastercard, American Express), PayPal, Shop Pay, and Apple Pay."
          }
        },
        {
          "@type": "Question",
          "name": "What are the product terms?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All product descriptions are accurate to the best of our knowledge. We reserve the right to modify or discontinue products. Prices are subject to change without notice, and we do not guarantee product availability."
          }
        }
      ]
    };
  };

  const schemaData = [
    { id: 'breadcrumb', data: generateTermsBreadcrumbSchema() },
    { id: 'faq', data: generateTermsFAQSchema() }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Head
        title="Terms of Service - HappyDeel"
        description="Read HappyDeel's Terms of Service. Learn about account requirements, shipping policy, payment methods, and product terms."
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        schema={schemaData}
      />
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-[#0046be] hover:text-[#003494] mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            
            <div className="prose max-w-none text-gray-600">
              <p className="text-lg mb-6">
                Welcome to HappyDeel. By accessing or using our website, you agree to be bound by these Terms of Service.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Account Terms</h2>
              <ul className="list-disc pl-6 mt-4 mb-6">
                <li>You must be 18 years or older to use this service</li>
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must notify us immediately of any unauthorized access</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Shipping Policy</h2>
              <p>
                For all orders within the USA:
              </p>
              <ul className="list-disc pl-6 mt-4 mb-6">
                <li>Standard shipping takes 3-5 business days</li>
                <li>Free shipping on all orders currently</li>
                <li>Orders are processed within 1 business day</li>
                <li>Tracking information is provided via email</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Product Terms</h2>
              <ul className="list-disc pl-6 mt-4 mb-6">
                <li>All product descriptions are accurate to the best of our knowledge</li>
                <li>We reserve the right to modify or discontinue products</li>
                <li>Prices are subject to change without notice</li>
                <li>We do not guarantee product availability</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Payment Terms</h2>
              <p>
                We accept the following payment methods:
              </p>
              <ul className="list-disc pl-6 mt-4 mb-6">
                <li>Credit/Debit Cards (Visa, Mastercard, American Express)</li>
                <li>PayPal</li>
                <li>Shop Pay</li>
                <li>Apple Pay</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
              <p>
                HappyDeel shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none mt-4">
                <li>Phone: +17176484487</li>
                <li>Email: support@happydeel.com</li>
                <li>Hours: Monday - Friday, 9:00 AM - 5:00 PM EST</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;