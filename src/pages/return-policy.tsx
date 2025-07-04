import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Head from '../components/Head';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReturnPolicyPage: React.FC = () => {
  // Generate breadcrumb schema
  const generateReturnPolicyBreadcrumbSchema = () => {
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
          "name": "Return Policy",
          "item": typeof window !== 'undefined' ? window.location.href : ''
        }
      ]
    };
  };

  // Generate FAQ schema
  const generateReturnPolicyFAQSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the return window?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You have 30 days from the date of delivery to return your item. To be eligible for a return, your item must be unused and in the same condition that you received it, in the original packaging, and accompanied by the original receipt or proof of purchase."
          }
        },
        {
          "@type": "Question",
          "name": "How do I start a return?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Contact our customer service team at +17176484487 to initiate a return. Pack the item securely in its original packaging, include the return form provided with your order, and ship the item to the address provided by our customer service team."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to process a refund?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Once we receive and inspect your return, we will send you an email to notify you that we have received your returned item. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer free shipping?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, for all orders within the USA, we offer standard shipping (3-5 business days), free shipping on all orders currently, and tracking information provided via email."
          }
        }
      ]
    };
  };

  const schemaData = [
    { id: 'breadcrumb', data: generateReturnPolicyBreadcrumbSchema() },
    { id: 'faq', data: generateReturnPolicyFAQSchema() }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Head
        title="Return Policy - HappyDeel"
        description="Learn about HappyDeel's 30-day return policy. We offer hassle-free returns with free shipping on all US orders."
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
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Return Policy</h1>
            
            <div className="prose max-w-none text-gray-600">
              <p className="text-lg mb-6">
                At HappyDeel, we want you to be completely satisfied with your purchase. If you're not entirely happy with your order, we're here to help.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Return Window</h2>
              <p>
                You have 30 days from the date of delivery to return your item. To be eligible for a return, your item must be:
              </p>
              <ul className="list-disc pl-6 mt-4 mb-6">
                <li>Unused and in the same condition that you received it</li>
                <li>In the original packaging</li>
                <li>Accompanied by the original receipt or proof of purchase</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Return Process</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact our customer service team at +17176484487 to initiate a return</li>
                <li>Pack the item securely in its original packaging</li>
                <li>Include the return form provided with your order</li>
                <li>Ship the item to the address provided by our customer service team</li>
              </ol>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Refunds</h2>
              <p>
                Once we receive and inspect your return, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
              </p>
              <p className="mt-4">
                If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Shipping</h2>
              <p>
                For all orders within the USA, we offer:
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li>Standard shipping (3-5 business days)</li>
                <li>Free shipping on all orders currently</li>
                <li>Tracking information provided via email</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
              <p>
                If you have any questions about our return policy, please contact us:
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

export default ReturnPolicyPage;