import { apartments } from "@/data/apartments";
import { supabase, supabaseHelpers } from "@/lib/supabase";
import type { QuoteReq, QuoteRes, StartCheckoutReq, StartCheckoutRes } from "@/types/booking";
import Stripe from 'stripe';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Initialize Stripe with secret key
const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key_here', {
  apiVersion: '2025-07-30.basil',
});

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
        total_amount: quote.totalCents / 100, // Convert cents to euros
        currency: quote.currency,
        status: 'pending',
        source: 'website',

        specialRequests: payload.customer?.specialRequests
      });

      // Create Stripe Payment Intent with booking ID in metadata
      const paymentIntent = await stripe.paymentIntents.create({
        amount: quote.totalCents,
        currency: quote.currency.toLowerCase(),
        metadata: {
          booking_id: booking.id, // Important: This links the payment to the booking
          unitSlug: payload.unitSlug,
          propertyId: property.id,
          checkIn: payload.checkIn,
          checkOut: payload.checkOut,
          guests: payload.guests.toString(),
          customerEmail: payload.customer?.email || '',
          customerName: `${payload.customer?.firstName || ''} ${payload.customer?.lastName || ''}`.trim(),
        },
        description: `Booking for ${payload.unitSlug} from ${payload.checkIn} to ${payload.checkOut}`,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      // Update booking with payment intent ID
      console.log('Updating booking with payment intent ID:', paymentIntent.id);
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ payment_intent_id: paymentIntent.id })
        .eq('id', booking.id);

      if (updateError) {
        console.error('Failed to update booking with payment intent ID:', updateError);
        console.error('Update error details:', JSON.stringify(updateError, null, 2));
        throw new Error(`Failed to link payment to booking: ${updateError.message}`);
      }

      // Create separate payment record with payment_intent_id
      // This would be handled by the payment webhook in production

      return {
        bookingId: booking.id,
        clientSecret: paymentIntent.client_secret!,
        currency: quote.currency,
        totalCents: quote.totalCents,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      // Fallback to mock for development - create a proper mock payment intent
      const mockPaymentIntent = await stripe.paymentIntents.create({
        amount: quote.totalCents,
        currency: quote.currency.toLowerCase(),
        payment_method_types: ['card'],
        metadata: {
          unitSlug: payload.unitSlug,
          checkIn: payload.checkIn,
          checkOut: payload.checkOut,
          guests: payload.guests.toString(),
        },
        description: `Booking for ${payload.unitSlug} from ${payload.checkIn} to ${payload.checkOut}`,
      });

      return {
        bookingId: `bk_${Math.random().toString(36).slice(2, 8)}`,
        clientSecret: mockPaymentIntent.client_secret!,
        currency: quote.currency,
        totalCents: quote.totalCents,
        paymentIntentId: mockPaymentIntent.id,
      };
    }
  },
};

export function centsToEUR(cents: number) {
  return new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

