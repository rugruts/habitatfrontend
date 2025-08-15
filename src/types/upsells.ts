export type UpsellCategory = 'transport' | 'food' | 'experience' | 'service';

export type Upsell = {
  id: string;
  name: string;
  description: string;
  category: UpsellCategory;
  priceCents: number;
  currency: string;
  image?: string;
  available: boolean;
  maxQuantity?: number;
  duration?: string; // e.g., "2 hours", "full day"
  includes?: string[];
};

export type SelectedUpsell = {
  upsellId: string;
  quantity: number;
  totalCents: number;
};

export const availableUpsells: Upsell[] = [
  {
    id: 'bike-rental',
    name: 'Premium Bike Rental',
    description: 'Explore Trikala on high-quality city bikes with helmet and lock included',
    category: 'transport',
    priceCents: 1500, // €15/day
    currency: 'EUR',
    available: true,
    maxQuantity: 4,
    duration: 'per day',
    includes: ['High-quality city bike', 'Safety helmet', 'Bike lock', 'Route map']
  },
  {
    id: 'airport-transfer',
    name: 'Airport Transfer',
    description: 'Private transfer from/to Thessaloniki Airport (SKG)',
    category: 'transport',
    priceCents: 8000, // €80 one way
    currency: 'EUR',
    available: true,
    maxQuantity: 2,
    includes: ['Private vehicle', 'Professional driver', 'Meet & greet service']
  },
  {
    id: 'welcome-basket',
    name: 'Welcome Basket',
    description: 'Local delicacies and essentials for your arrival',
    category: 'food',
    priceCents: 2500, // €25
    currency: 'EUR',
    available: true,
    maxQuantity: 1,
    includes: ['Local honey & jam', 'Fresh bread', 'Greek coffee', 'Seasonal fruits', 'Welcome note']
  },
  {
    id: 'meteora-tour',
    name: 'Meteora Monasteries Tour',
    description: 'Guided tour to the UNESCO World Heritage Meteora Monasteries',
    category: 'experience',
    priceCents: 4500, // €45 per person
    currency: 'EUR',
    available: true,
    maxQuantity: 6,
    duration: '6 hours',
    includes: ['Professional guide', 'Transportation', 'Monastery entrance fees', 'Traditional lunch']
  },
  {
    id: 'cooking-class',
    name: 'Greek Cooking Class',
    description: 'Learn to cook traditional Greek dishes with a local chef',
    category: 'experience',
    priceCents: 3500, // €35 per person
    currency: 'EUR',
    available: true,
    maxQuantity: 4,
    duration: '3 hours',
    includes: ['Professional chef instruction', 'All ingredients', 'Recipe cards', 'Meal & wine']
  },
  {
    id: 'early-checkin',
    name: 'Early Check-in',
    description: 'Check in before 15:00 (subject to availability)',
    category: 'service',
    priceCents: 2000, // €20
    currency: 'EUR',
    available: true,
    maxQuantity: 1,
    includes: ['Guaranteed early access', 'Room preparation priority']
  },
  {
    id: 'late-checkout',
    name: 'Late Check-out',
    description: 'Check out after 11:00 until 16:00 (subject to availability)',
    category: 'service',
    priceCents: 1500, // €15
    currency: 'EUR',
    available: true,
    maxQuantity: 1,
    includes: ['Extended stay until 16:00', 'Luggage storage if needed']
  },
  {
    id: 'grocery-delivery',
    name: 'Grocery Pre-Delivery',
    description: 'Have groceries waiting for your arrival',
    category: 'service',
    priceCents: 1000, // €10 service fee
    currency: 'EUR',
    available: true,
    maxQuantity: 1,
    includes: ['Shopping service', 'Delivery to apartment', 'Refrigerated storage']
  }
];

export const getUpsellsByCategory = (category: UpsellCategory): Upsell[] => {
  return availableUpsells.filter(upsell => upsell.category === category && upsell.available);
};

export const calculateUpsellsTotal = (selectedUpsells: SelectedUpsell[]): number => {
  return selectedUpsells.reduce((total, selected) => total + selected.totalCents, 0);
};
