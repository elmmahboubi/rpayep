import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Head from '../components/Head';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  // Generate breadcrumb schema
  const generatePrivacyPolicyBreadcrumbSchema = () => {
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
          "name": "Privacy Policy",
          "item": typeof window !== 'undefined' ? window.location.href : ''
        }
      ]
    };
  };

  // Generate FAQ schema
  const generatePrivacyPolicyFAQSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What information do you collect?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We collect information that you provide directly to us when you create an account, make a purchase, sign up for our newsletter, contact our customer service, or participate in surveys or promotions."
          }
        },
        {
          "@type": "Question",
          "name": "How do you use my information?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We may use the information we collect to process and fulfill your orders, send you order confirmations and updates, respond to your comments and questions, send you marketing communications (with your consent), improve our website and services, and comply with legal obligations."
          }
        },
        {
          "@type": "Question",
          "name": "Do you share my information with third parties?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except to trusted third parties who assist us in operating our website, conducting our business, or servicing you."
          }
        },
        {
          "@type": "Question",
          "name": "How do you protect my data?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure."
          }
        }
      ]
    };
  };

  const schemaData = [
    { id: 'breadcrumb', data: generatePrivacyPolicyBreadcrumbSchema() },
    { id: 'faq', data: generatePrivacyPolicyFAQSchema() }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Head
        title="Privacy Policy - HappyDeel"
        description="Learn how HappyDeel collects, uses, and protects your personal information. Read our comprehensive privacy policy."
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
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            
            <div className="prose max-w-none text-gray-600">
              <p className="text-lg mb-6">
                At HappyDeel, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
              <p>We collect information that you provide directly to us when you:</p>
              <ul className="list-disc pl-6 mt-4 mb-6">
                <li>Create an account</li>
                <li>Make a purchase</li>
                <li>Sign up for our newsletter</li>
                <li>Contact our customer service</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
              <p>We may use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-4 mb-6">
                <li>Process and fulfill your orders</li>
                <li>Send you order confirmations and updates</li>
                <li>Respond to your comments and questions</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except to trusted third parties who assist us in operating our website, conducting our business, or servicing you.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Information</h2>
              <p>
                For questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none mt-4">
                <li>Phone: +17176484487</li>
                <li>Email: support@happydeel.com</li>
                <li>Address: 1726 Parsons Ave, Columbus, OH 43207, USA</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;