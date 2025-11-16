// Predefined structured data schemas
export const createOrganizationSchema = () => ({
  "@type": "Organization",
  "@id": "https://habitatlobby.com/#organization",
  "name": "Habitat Lobby",
  "url": "https://habitatlobby.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://habitatlobby.com/logo.png",
    "width": 512,
    "height": 512
  },
  "description": "Luxury premium apartments in Trikala, Greece's cycling capital. Magazine-inspired design with modern amenities.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Alexandrias 69",
    "addressLocality": "Trikala",
    "addressRegion": "Thessaly",
    "postalCode": "42100",
    "addressCountry": "GR"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+30 697 769 0685",
    "contactType": "customer service",
    "email": "admin@habitatlobby.com",
    "availableLanguage": ["English", "Greek"]
  },
  "sameAs": [
    "https://www.facebook.com/habitatlobby",
    "https://www.instagram.com/habitatlobby",
    "https://www.booking.com/hotel/gr/habitat-lobby"
  ]
});

export const createLocalBusinessSchema = () => ({
  "@type": "LodgingBusiness",
  "@id": "https://habitatlobby.com/#business",
  "name": "Habitat Lobby",
  "description": "Luxury premium apartments in the heart of Trikala, Greece. Perfect base for exploring Meteora and Central Greece.",
  "url": "https://habitatlobby.com",
  "telephone": "+30 697 769 0685",
  "email": "admin@habitatlobby.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Alexandras 59",
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
  "openingHours": "Mo-Su 00:00-23:59",
  "priceRange": "€€",
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "Free WiFi",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification", 
      "name": "Air Conditioning",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Kitchen",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Bike Storage",
      "value": true
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "image": [
    "https://habitatlobby.com/assets/apt-loft-1.jpg",
    "https://habitatlobby.com/assets/apt-loft-2.jpg"
  ],
  "areaServed": {
    "@type": "City",
    "name": "Trikala"
  },
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Cash, Credit Card, Bank Transfer",
  "hasMap": "https://maps.google.com/?q=39.5551,21.7665"
});

export const createAccommodationSchema = (apartmentData: {
  name: string;
  description: string;
  slug: string;
  images: string[];
  rooms: number;
  size: number;
  price: number;
}) => ({
  "@type": "Apartment",
  "@id": `https://habitatlobby.com/apartments/${apartmentData.slug}#accommodation`,
  "name": apartmentData.name,
  "description": apartmentData.description,
  "url": `https://habitatlobby.com/apartments/${apartmentData.slug}`,
  "image": apartmentData.images,
  "numberOfRooms": apartmentData.rooms,
  "floorSize": {
    "@type": "QuantitativeValue",
    "value": apartmentData.size,
    "unitCode": "MTK"
  },
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "Free WiFi",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Air Conditioning", 
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Kitchen",
      "value": true
    }
  ],
  "offers": {
    "@type": "Offer",
    "price": apartmentData.price,
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": `https://habitatlobby.com/apartments/${apartmentData.slug}`
  }
});

export const createBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => ({
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": `https://habitatlobby.com${crumb.url}`
  }))
});

export const createFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

