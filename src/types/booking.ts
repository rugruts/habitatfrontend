export type Currency = "EUR";

export type QuoteReq = {
  unitSlug: string;
  checkIn: string; // ISO date (yyyy-mm-dd)
  checkOut: string; // ISO date
  guests: number;
};

export type LineItem = {
  label: string;
  amountCents: number;
};

export type QuoteRes = {
  nights: number;
  currency: Currency;
  lineItems: LineItem[];
  totalCents: number;
  minNights?: number;
  refundableUntil?: string; // ISO timestamp
};

export type StartCheckoutReq = QuoteReq & {
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    country?: string;
    specialRequests?: string;
  };
};

export type StartCheckoutRes = {
  bookingId: string;
  clientSecret: string; // Stripe client secret
  currency: Currency;
  totalCents: number;
  paymentIntentId?: string; // Stripe payment intent ID
};

export type AvailabilityDay = {
  date: string; // ISO date
  disabled: boolean; // cannot start/end inside disabled ranges
};

export type UnitSummary = {
  slug: string;
  name: string;
  baseRateCents: number;
  minNights?: number;
};

