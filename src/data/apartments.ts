export type Amenity = "wifi" | "ac" | "kitchen" | "elevator" | "balcony";

export type Attraction = {
  name: string;
  distance: string;
  time: string;
  type: "nature" | "culture" | "dining" | "unesco" | "recreation";
  coordinates: { lat: number; lng: number };
};

export type Apartment = {
  slug: string;
  name: string;
  location: string;
  rating: number;
  short: string;
  description: string;
  pricePerNight: number;
  images: string[];
  amenities: Amenity[];
  nearbyAttractions?: Attraction[];
};

import hero1 from "@/assets/apt-loft-1.jpg";
import hero2 from "@/assets/apt-suite-1.jpg";

// Import apartment 1 photos
import apt1Photo1 from "@/assets/appartment 1/PHOTO-2025-03-23-13-13-42.jpg";
import apt1Photo2 from "@/assets/appartment 1/PHOTO-2025-03-23-13-17-19.jpg";
import apt1Photo3 from "@/assets/appartment 1/PHOTO-2025-03-23-13-17-41.jpg";
import apt1Photo4 from "@/assets/appartment 1/PHOTO-2025-03-23-13-17-57.jpg";
import apt1Photo5 from "@/assets/appartment 1/PHOTO-2025-03-23-13-18-06.jpg";
import apt1Photo6 from "@/assets/appartment 1/PHOTO-2025-03-23-13-18-14.jpg";
import apt1Photo7 from "@/assets/appartment 1/PHOTO-2025-03-23-13-18-21.jpg";
import apt1Photo8 from "@/assets/appartment 1/PHOTO-2025-03-23-13-18-29.jpg";
import apt1Photo9 from "@/assets/appartment 1/PHOTO-2025-03-23-13-18-38.jpg";
import apt1Photo10 from "@/assets/appartment 1/PHOTO-2025-03-23-13-18-46.jpg";
import apt1Photo11 from "@/assets/appartment 1/PHOTO-2025-03-23-13-19-08.jpg";

// Real attractions with exact coordinates based on actual property location
export const realAttractions: Attraction[] = [
  {
    name: "Mill of Elves Thematic Park",
    distance: "0.1 km",
    time: "1-minute walk",
    type: "recreation",
    coordinates: { lat: 39.54621349532007, lng: 21.75862114087692 }
  },
  {
    name: "Traditional Taverna",
    distance: "0.1 km",
    time: "1-minute walk",
    type: "dining",
    coordinates: { lat: 39.54727604090631, lng: 21.76211705417508 }
  },
  {
    name: "Trikala Byzantine Castle",
    distance: "1.5 km",
    time: "18-minute walk",
    type: "culture",
    coordinates: { lat: 39.55909282040134, lng: 21.762799831270158 }
  },
  {
    name: "Central Square",
    distance: "1 km",
    time: "12-minute walk",
    type: "dining",
    coordinates: { lat: 39.556069855057764, lng: 21.76777301543737 }
  },
  {
    name: "Trikala Train Station",
    distance: "0.2 km",
    time: "2-minute walk",
    type: "recreation",
    coordinates: { lat: 39.5548, lng: 21.7681 }
  },
  {
    name: "Supermarket",
    distance: "0.1 km",
    time: "1-minute walk",
    type: "recreation",
    coordinates: { lat: 39.5545, lng: 21.7675 }
  },
  {
    name: "Meteora Monasteries",
    distance: "25 km",
    time: "30-minute drive",
    type: "unesco",
    coordinates: { lat: 39.7218601012325, lng: 21.62630267069926 }
  }
];

export const apartments: Apartment[] = [
  {
    slug: "test-apartment",
    name: "Test Apartment",
    location: "Trikala Center, Greece",
    rating: 5.0,
    short: "Test apartment for payment verification - €1 per night!",
    description:
      "This is a test apartment specifically created for payment testing. Book for just €1 per night to verify the Stripe payment integration is working correctly.",
    pricePerNight: 1,
    images: [
      hero1,
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["wifi", "ac", "kitchen", "balcony"],
    nearbyAttractions: realAttractions,
  },
  {
    slug: "river-loft",
    name: "River Loft",
    location: "Trikala Center, Greece",
    rating: 4.9,
    short: "Sunlit loft with deep‑green accents by the Lithaios river.",
    description:
      "Wake to soft daylight and the sound of the river. The River Loft pairs natural textures with deep‑green notes for an elegant, restful stay—steps from bicycles, bridges, and cozy cafes.",
    pricePerNight: 110,
    images: [
      hero1,
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["wifi", "ac", "kitchen", "balcony"],
    nearbyAttractions: realAttractions,
  },
  {
    slug: "apartment-1",
    name: "Apartment 1 – 1-Bedroom Apartment with Views",
    location: "Trikala Center, Greece",
    rating: 4.8,
    short: "Bright, stylish retreat with balcony and sweeping views of the garden, mountains, city, and nearby landmarks — right in the heart of Trikala.",
    description:
      "Step into your private city sanctuary. Apartment 1 offers 50 m² of thoughtfully designed comfort, combining modern amenities with a warm, welcoming atmosphere. Featuring a private entrance, a spacious living room with a sofa bed, a separate bedroom with a large double bed, and a modern bathroom with a walk-in shower, it's the ideal base for couples, friends, or small families.",
    pricePerNight: 95,
    images: [
      apt1Photo11, // PHOTO-2025-03-23-13-19-08 - Main hero image
      apt1Photo1,
      apt1Photo2,
      apt1Photo3,
      apt1Photo4,
      apt1Photo5,
      apt1Photo6,
      apt1Photo7,
      apt1Photo8,
      apt1Photo9,
      apt1Photo10
    ],
    amenities: ["wifi", "ac", "kitchen", "elevator"],
    nearbyAttractions: realAttractions,
  },
];
