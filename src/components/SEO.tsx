import React from 'react';
import { Helmet } from 'react-helmet-async';

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
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://habitat-lobby.lovable.app';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : undefined;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  
  // Default keywords for all pages
  const defaultKeywords = [
    'Habitat Lobby',
    'Trikala accommodation',
    'Greece apartments',
    'boutique apartments',
    'Trikala hotels',
    'Central Greece',
    'Thessaly accommodation',
    'cycling city Greece',
    'Meteora base',
    'authentic Greek experience'
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
      <meta name="contact" content="info@habitatlobby.com" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      
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

// Predefined structured data schemas
export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Habitat Lobby",
  "description": "Boutique apartments in Trikala, Greece offering authentic local experiences",
  "url": "https://habitat-lobby.lovable.app",
  "logo": "https://habitat-lobby.lovable.app/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+30-243-123-4567",
    "contactType": "customer service",
    "email": "info@habitatlobby.com",
    "availableLanguage": ["English", "Greek"]
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Alexandrias 69",
    "addressLocality": "Trikala",
    "addressCountry": "GR",
    "postalCode": "42100"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 39.5551,
    "longitude": 21.7665
  },
  "sameAs": [
    "https://www.instagram.com/habitatlobby",
    "https://www.facebook.com/habitatlobby"
  ]
});

export const createAccommodationSchema = (apartment: any) => ({
  "@context": "https://schema.org",
  "@type": "Accommodation",
  "name": apartment.name,
  "description": apartment.description,
  "url": `https://habitat-lobby.lovable.app/apartments/${apartment.slug}`,
  "image": apartment.images?.[0],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Alexandrias 69",
    "addressLocality": "Trikala",
    "addressCountry": "GR",
    "postalCode": "42100"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 39.5551,
    "longitude": 21.7665
  },
  "amenityFeature": apartment.amenities?.map((amenity: string) => ({
    "@type": "LocationFeatureSpecification",
    "name": amenity
  })),
  "numberOfRooms": apartment.bedrooms,
  "occupancy": {
    "@type": "QuantitativeValue",
    "maxValue": apartment.maxGuests
  },
  "priceRange": `€${apartment.basePrice} - €${apartment.basePrice * 1.5}`,
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Credit Card, Debit Card"
});

export const createLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Habitat Lobby",
  "description": "Boutique apartments in Trikala, Greece's cycling capital",
  "url": "https://habitat-lobby.lovable.app",
  "telephone": "+30-243-123-4567",
  "email": "info@habitatlobby.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Alexandrias 69",
    "addressLocality": "Trikala",
    "addressRegion": "Thessaly",
    "postalCode": "42100",
    "addressCountry": "GR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 39.5551,
    "longitude": 21.7665
  },
  "openingHours": "Mo-Su 00:00-24:00",
  "priceRange": "€€",
  "servesCuisine": "Greek",
  "acceptsReservations": true,
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "Free WiFi"
    },
    {
      "@type": "LocationFeatureSpecification", 
      "name": "Air Conditioning"
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Kitchen"
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Bike Storage"
    }
  ]
});
