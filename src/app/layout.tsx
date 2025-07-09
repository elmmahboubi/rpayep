import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import Script from "next/script";

export const metadata: Metadata = {
  title: "HappyDeel - Where Savings Make You Smile.",
  description: "Discover premium cameras and photography equipment at HappyDeel. Shop the latest DSLR, mirrorless, and compact cameras from top brands.",
  keywords: "HappyDeel, cameras, photography, electronics, used gear, premium tech, second-hand, deals",
  authors: [{ name: "HappyDeel" }],
  creator: "HappyDeel",
  publisher: "HappyDeel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://happydeel.com"),
  openGraph: {
    title: "HappyDeel - Where Savings Make You Smile.",
    description: "Discover premium cameras and photography equipment at HappyDeel. Shop the latest DSLR, mirrorless, and compact cameras from top brands.",
    url: "https://happydeel.com",
    siteName: "HappyDeel",
    images: [
      {
        url: "/g7x.webp",
        width: 1200,
        height: 630,
        alt: "HappyDeel - Premium Electronics",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HappyDeel - Where Savings Make You Smile.",
    description: "Discover premium cameras and photography equipment at HappyDeel. Shop the latest DSLR, mirrorless, and compact cameras from top brands.",
    images: ["/g7x.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="preload" href="/logosvg.svg" as="image" type="image/svg+xml" />
      </head>
      <body>
        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "HappyDeel",
              "url": "https://happydeel.com",
              "logo": "https://happydeel.com/logosvg.svg",
              "description": "HappyDeel - Where Savings Make You Smile. Discover premium cameras and photography equipment at unbeatable prices.",
              "sameAs": [
                "https://twitter.com/happydeel",
                "https://facebook.com/happydeel",
                "https://instagram.com/happydeel"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "support@happydeel.com"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US"
              }
            })
          }}
        />
        
        {/* WebSite Schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "HappyDeel",
              "url": "https://happydeel.com",
              "description": "HappyDeel - Where Savings Make You Smile. Discover premium cameras and photography equipment at unbeatable prices.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://happydeel.com/api/products/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
