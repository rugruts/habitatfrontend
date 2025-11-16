import React from 'react';
import { Helmet } from 'react-helmet-async';
import { createOrganizationSchema, createAccommodationSchema, createLocalBusinessSchema } from '@/utils/seoSchemas';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  keywords = [],
  author = 'Habitat Lobby',
  publishedTime,
  modifiedTime,
  noindex = false,
  structuredData
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://habitat-lobby.com';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : undefined;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  
  // Default keywords for all pages
  const defaultKeywords = [
    'Habitat Lobby',
    'Trikala accommodation',
    'Greece apartments',
    'premium apartments',
    'Trikala hotels',
    'Central Greece',
    'Thessaly accommodation',
    'cycling city Greece',
    'Meteora base',
    'authentic Greek experience',
    'luxury apartments Greece',
    'premium hotels Trikala',
    'direct booking Greece',
    'Meteora accommodation',
    'Thessaly premium hotels',
    'Greece vacation rentals',
    'Trikala city center hotels',
    'bike-friendly accommodation Greece'
  ];
  
  const allKeywords = [...defaultKeywords, ...keywords].join(', ');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Habitat Lobby" />
      <meta property="og:locale" content="en_US" />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:site" content="@habitatlobby" />
      <meta name="twitter:creator" content="@habitatlobby" />
      
      {/* Article specific */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#0F172A" />
      <meta name="msapplication-TileColor" content="#0F172A" />
      
      {/* Geo Tags for Trikala */}
      <meta name="geo.region" content="GR-43" />
      <meta name="geo.placename" content="Trikala, Greece" />
      <meta name="geo.position" content="39.5551;21.7665" />
      <meta name="ICBM" content="39.5551, 21.7665" />
      
      {/* Business Information */}
              <meta name="contact" content="admin@habitatlobby.com" />
        <meta name="telephone" content="+30 697 769 0685" />
              <meta name="address" content="Alexandras 59, Trikala 42100, Greece" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
