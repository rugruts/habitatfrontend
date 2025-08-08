export type Amenity = "wifi" | "ac" | "kitchen" | "elevator" | "balcony";

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
};

import hero1 from "@/assets/apt-loft-1.jpg";
import hero2 from "@/assets/apt-suite-1.jpg";

export const apartments: Apartment[] = [
  {
    slug: "river-loft",
    name: "River Loft",
    location: "Trikala Center, Greece",
    rating: 4.9,
    short: "Sunlit loft with deep‑green accents by the Lithaios river.",
    description:
      "Wake to soft daylight and the sound of the river. The River Loft pairs natural textures with deep‑green notes for an elegant, restful stay—steps from bicycles, bridges, and cozy cafes.",
    pricePerNight: 110,
    images: [hero1],
    amenities: ["wifi", "ac", "kitchen", "balcony"],
  },
  {
    slug: "garden-suite",
    name: "Garden Suite",
    location: "Trikala Center, Greece",
    rating: 4.8,
    short: "Warm minimalist one‑bedroom suite with a calming palette.",
    description:
      "A serene retreat in the city. The Garden Suite blends linen, oak, and soft brass lighting—perfect after a day cycling the riverside or exploring Meteora.",
    pricePerNight: 95,
    images: [hero2],
    amenities: ["wifi", "ac", "kitchen", "elevator"],
  },
];
