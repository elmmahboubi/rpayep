import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Head from '../components/Head';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookiesPage: React.FC = () => {
  // Generate breadcrumb schema
  const generateCookiesBreadcrumbSchema = () => {
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
          "name": "Cookies Policy",
          "item": typeof window !== 'undefined' ? window.location.href : ''
        }
      ]
    };
  };

  // Generate FAQ schema
  const generateCookiesFAQSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are cookies?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide useful information to website owners."
          }
        },
        {
          "@type": "Question",
          "name": "What types of cookies do you use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We use Essential Cookies (necessary for website function), Performance Cookies (to understand visitor interactions), Functionality Cookies (to remember choices and provide enhanced features), and Targeting Cookies (for advertising partners to show relevant ads)."
          }
        },
        {
          "@type": "Question",
          "name": "How can I control cookies?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can control and/or delete cookies as you wish. You can delete all cookies from your browser, set your browser to prevent cookies being placed, or accept or decline cookies when prompted. Please note that restricting cookies may impact your experience on our website."
          }
        },
        {
          "@type": "Question",
          "name": "Do you use third-party cookies?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we may use third-party services that use cookies, including Google Analytics (for website analytics), PayPal (for payment processing), social media platforms (for sharing and engagement), and advertising partners (for targeted advertising)."
          }
        }
      ]
    };
  };

  const schemaData = [
    { id: 'breadcrumb', data: generateCookiesBreadcrumbSchema() },
    { id: 'faq', data: generateCookiesFAQSchema() }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Head
        title="Cookies Policy - HappyDeel"
        description="Learn about HappyDeel's use of cookies and similar tracking technologies. Understand how we use cookies and how to manage them."
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
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookies Policy</h1>
            
            <div className="prose max-w-none text-gray-600">
              <p className="text-lg mb-6">
                This Cookies Policy explains how HappyDeel uses cookies and similar tracking technologies on our website. By using our website, you consent to the use of cookies as described in this policy.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Are Cookies?</h2>
              <p className="mb-6">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide useful information to website owners.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Types of Cookies We Use</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Essential Cookies</h3>
                  <p>These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Performance Cookies</h3>
                  <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Functionality Cookies</h3>
                  <p>These cookies allow the website to remember choices you make and provide enhanced, more personal features.</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Targeting Cookies</h3>
                  <p>These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant ads on other sites.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookie Management</h2>
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="font-medium text-gray-900 mb-4">How to Control Cookies</h3>
                <p className="mb-4">You can control and/or delete cookies as you wish. You can:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Delete all cookies from your browser</li>
                  <li>Set your browser to prevent cookies being placed</li>
                  <li>Accept or decline cookies when prompted</li>
                </ul>
                <p className="mt-4 text-sm">
                  Please note that restricting cookies may impact your experience on our website and limit access to certain features.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Third-Party Cookies</h2>
              <p className="mb-6">
                We may use third-party services that use cookies, including:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Google Analytics (for website analytics)</li>
                <li>PayPal (for payment processing)</li>
                <li>Social media platforms (for sharing and engagement)</li>
                <li>Advertising partners (for targeted advertising)</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Updates to This Policy</h2>
              <p className="mb-6">
                We may update this Cookies Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
              <p>
                If you have any questions about our Cookies Policy, please contact us:
              </p>
              <ul className="list-none mt-4">
                <li>Phone: +17176484487</li>
                <li>Email: support@happydeel.com</li>
                <li>Hours: Monday - Friday, 9:00 AM - 5:00 PM EST</li>
              </ul>

              <div className="bg-blue-50 p-6 rounded-lg mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Important Note</h3>
                <p className="text-sm">
                  By continuing to use our website, you agree to the use of cookies as described in this policy. If you do not accept the use of cookies, you should adjust your browser settings accordingly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiesPage;