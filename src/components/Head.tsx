import React from 'react';
import * as helmetAsync from 'react-helmet-async';

const { Helmet } = helmetAsync;

interface HeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: string;
  schema?: Array<{ id: string; data: any }>;
}

/**
 * Head component for client-side meta tag management.
 * 
 * Note: This component is now primarily for client-side updates.
 * The initial SEO metadata is rendered server-side in entry-server.tsx
 * to ensure perfect SEO without hydration mismatches.
 * 
 * This component can be used for dynamic meta tag updates after navigation.
 */
const Head: React.FC<HeadProps> = ({
  title = 'HappyDeel',
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  robots = 'index, follow',
  schema = []
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {robots && <meta name="robots" content={robots} />}
      {/* Open Graph */}
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonical && <meta property="og:url" content={canonical} />}
      {/* Twitter */}
      {twitterTitle && <meta name="twitter:title" content={twitterTitle} />}
      {twitterDescription && <meta name="twitter:description" content={twitterDescription} />}
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      {/* Structured Data */}
      {schema.map((item) => (
        <script key={item.id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item.data) }} />
      ))}
    </Helmet>
  );
};

export default Head;