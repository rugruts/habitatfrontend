import { apartments } from "@/data/apartments";
import { supabase, supabaseHelpers } from "@/lib/supabase";
import type { QuoteReq, QuoteRes, StartCheckoutReq, StartCheckoutRes } from "@/types/booking";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// NOTE: Stripe operations should be handled by the backend API
// Never use Stripe secret key in frontend code - it's a security risk!

// API client with Supabase integration
export const api = {
  async quote(payload: QuoteReq): Promise<QuoteRes> {
    await sleep(250);

    try {
      // Get property from Supabase
      const property = await supabaseHelpers.getProperty(payload.unitSlug);
      if (!property) throw new Error("Property not found");

      const checkIn = new Date(payload.checkIn);
      const checkOut = new Date(payload.checkOut);
      const nights = Math.max(0, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
      if (!nights) throw new Error("Invalid dates");

      // Check minimum nights requirement (default to 2 nights)
      const minNights = property.min_nights || 2;
      if (nights < minNights) {
        throw new Error(`Minimum stay is ${minNights} nights`);
      }

      // Check availability
      const isAvailable = await supabaseHelpers.checkAvailability(
        property.id,
        payload.checkIn,
        payload.checkOut
      );

      if (!isAvailable) {
        throw new Error("Selected dates are not available");
      }

      // Get price per night - check different possible field names
      const pricePerNightRaw = property.price_per_night || property.base_price || property.pricePerNight;
      if (!pricePerNightRaw || isNaN(pricePerNightRaw)) {
        throw new Error("Property price not available");
      }

      // Check if price is already in cents (if > 1000, assume it's in cents)
      const baseRateCents = pricePerNightRaw > 1000 ? Math.round(pricePerNightRaw) : Math.round(pricePerNightRaw * 100);
      const pricePerNightEuros = Math.round(baseRateCents / 100);
      const cleaningFeeCents = 3000; // 30€ cleaning fee
      const subtotal = nights * baseRateCents;

      console.log('Pricing calculation:', {
        pricePerNightRaw,
        baseRateCents,
        pricePerNightEuros,
        nights,
        subtotal,
        cleaningFeeCents
      });

      // Validate calculations
      if (isNaN(baseRateCents) || isNaN(subtotal) || baseRateCents <= 0) {
        throw new Error("Invalid pricing calculation");
      }

      const lineItems = [
        { label: `${nights} night${nights > 1 ? "s" : ""} x €${pricePerNightEuros}`, amountCents: subtotal },
        { label: "Cleaning fee", amountCents: cleaningFeeCents },
      ];

      const totalCents = lineItems.reduce((s, li) => s + li.amountCents, 0);

      // Refundable until 48h before check-in
      const refundableUntil = new Date(checkIn);
      refundableUntil.setHours(refundableUntil.getHours() - 48);

      return {
        nights,
        currency: "EUR",
        lineItems,
        totalCents,
        minNights: property.min_nights,
        refundableUntil: refundableUntil.toISOString(),
      };
    } catch (error) {
      console.error('Quote error, falling back to apartments data:', error);
      // Fallback to apartments data if Supabase fails
      const unit = apartments.find((a) => a.slug === payload.unitSlug);
      if (!unit) {
        console.error('Unit not found in apartments data:', payload.unitSlug);
        throw new Error("Unit not found");
      }

      console.log('Using fallback unit data:', unit);

      const checkIn = new Date(payload.checkIn);
      const checkOut = new Date(payload.checkOut);
      const nights = Math.max(0, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
      if (!nights) throw new Error("Invalid dates");

      // Validate unit price
      if (!unit.pricePerNight || isNaN(unit.pricePerNight) || unit.pricePerNight <= 0) {
        throw new Error("Invalid unit price");
      }

      const baseRateCents = Math.round(unit.pricePerNight * 100);
      const cleaningFeeCents = 3000;
      const subtotal = nights * baseRateCents;

      console.log('Fallback pricing calculation:', {
        unitPricePerNight: unit.pricePerNight,
        baseRateCents,
        nights,
        subtotal,
        cleaningFeeCents
      });

      // Validate calculations
      if (isNaN(baseRateCents) || isNaN(subtotal) || baseRateCents <= 0) {
        throw new Error("Invalid pricing calculation in fallback");
      }

      const lineItems = [
        { label: `${nights} night${nights > 1 ? "s" : ""} x €${unit.pricePerNight}`, amountCents: subtotal },
        { label: "Cleaning fee", amountCents: cleaningFeeCents },
      ];

      const totalCents = lineItems.reduce((s, li) => s + li.amountCents, 0);

      const refundableUntil = new Date(checkIn);
      refundableUntil.setHours(refundableUntil.getHours() - 48);

      return {
        nights,
        currency: "EUR",
        lineItems,
        totalCents,
        minNights: 2,
        refundableUntil: refundableUntil.toISOString(),
      };
    }
  },

  async startCheckout(payload: StartCheckoutReq): Promise<StartCheckoutRes> {
    const quote = await this.quote(payload);
    await sleep(250);

    try {
      // Get property from Supabase
      const property = await supabaseHelpers.getProperty(payload.unitSlug);
      if (!property) throw new Error("Property not found");

      // Double-check availability before creating payment intent
      const isAvailable = await supabaseHelpers.checkAvailability(
        property.id,
        payload.checkIn,
        payload.checkOut
      );

      if (!isAvailable) {
        throw new Error("Selected dates are no longer available");
      }

      // Create pending booking in Supabase with ID information
      const booking = await supabaseHelpers.createBooking({
        property_id: property.id,
        check_in: payload.checkIn,
        check_out: payload.checkOut,
        guests: payload.guests,
        customer_name: `${payload.customer?.firstName || ''} ${payload.customer?.lastName || ''}`.trim(),
        customer_email: payload.customer?.email || '',
        customer_phone: payload.customer?.phone,
        customer_country: payload.customer?.country,
        total_amount: quote.totalCents / 100, // Convert cents to euros
        currency: quote.currency,
        status: 'pending',
        source: 'website',
        specialRequests: payload.customer?.specialRequests
      });

      // Create Stripe Payment Intent via backend API (secure)
      // The backend handles all Stripe operations with the secret key
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

      try {
        const paymentResponse = await fetch(`${apiUrl}/payments/create-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_EMAIL_API_KEY || ''}`,
          },
          body: JSON.stringify({
            amount: quote.totalCents,
            currency: quote.currency.toLowerCase(),
            bookingId: booking.id,
            metadata: {
              booking_id: booking.id,
              unitSlug: payload.unitSlug,
              propertyId: property.id,
              checkIn: payload.checkIn,
              checkOut: payload.checkOut,
              guests: payload.guests.toString(),
              customerEmail: payload.customer?.email || '',
              customerName: `${payload.customer?.firstName || ''} ${payload.customer?.lastName || ''}`.trim(),
            },
            description: `Booking for ${payload.unitSlug} from ${payload.checkIn} to ${payload.checkOut}`,
          }),
        });

        if (!paymentResponse.ok) {
          throw new Error(`Backend API error: ${paymentResponse.statusText}`);
        }

        const paymentIntent = await paymentResponse.json();

        return {
          bookingId: booking.id,
          clientSecret: paymentIntent.client_secret,
          currency: quote.currency,
          totalCents: quote.totalCents,
          paymentIntentId: paymentIntent.id,
        };
      } catch (apiError) {
        console.error('Backend payment intent creation failed:', apiError);
        // Fallback: Create a mock payment intent for development
        const mockId = `pi_${Math.random().toString(36).slice(2, 24)}`;
        const mockSecret = `${mockId}_secret_${Math.random().toString(36).slice(2, 24)}`;

        return {
          bookingId: booking.id,
          clientSecret: mockSecret,
          currency: quote.currency,
          totalCents: quote.totalCents,
          paymentIntentId: mockId,
        };
      }
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  },
};

export function centsToEUR(amount: number) {
  if (!amount || amount === 0) {
    return new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" }).format(0);
  }
  
  // Smart conversion for mixed data formats:
  // - Stripe API: always in cents (large numbers like 21800)
  // - Database: might be in euros (medium numbers like 315)
  
  if (amount >= 1000) {
    // Large amounts are definitely in cents (e.g., 21800 cents = €218.00)
    return new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" }).format(amount / 100);
  }
  
  if (amount >= 10 && amount < 1000) {
    // Medium amounts (10-999) are likely euros from database
    // This covers typical booking amounts like €50-€999
    return new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" }).format(amount);
  }
  
  if (amount < 10) {
    // Very small amounts could be:
    // - Small fees/refunds in cents (e.g., 50 cents = €0.50)
    // - Or very small euro amounts (e.g., €5.00)
    // If < 5, treat as cents; if >= 5, treat as euros
    if (amount < 5) {
      return new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" }).format(amount / 100);
    } else {
      return new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" }).format(amount);
    }
  }
  
  // Fallback: treat as euros
  return new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" }).format(amount);
}

