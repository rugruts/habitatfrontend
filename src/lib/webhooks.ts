import { supabaseHelpers } from './supabase';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key_here', {
  apiVersion: '2025-07-30.basil',
});

// Webhook handler for Stripe events
export const handleStripeWebhook = async (event: Stripe.Event) => {
  console.log('Processing Stripe webhook:', event.type);

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    throw error;
  }
};

// Handle successful payment
const handlePaymentSuccess = async (paymentIntent: Stripe.PaymentIntent) => {
  console.log('Payment succeeded:', paymentIntent.id);

  try {
    // Find booking by payment intent ID
    const { data: bookings, error } = await supabaseHelpers.supabase
      .from('bookings')
      .select('*')
      .eq('payment_intent_id', paymentIntent.id)
      .single();

    if (error || !bookings) {
      console.error('Booking not found for payment intent:', paymentIntent.id);
      return;
    }

    // Update booking status to confirmed
    await supabaseHelpers.updateBookingStatus(bookings.id, 'confirmed');

    // Create booking line items if they don't exist
    const { data: existingLineItems } = await supabaseHelpers.supabase
      .from('booking_line_items')
      .select('id')
      .eq('booking_id', bookings.id);

    if (!existingLineItems || existingLineItems.length === 0) {
      // Calculate nights
      const checkIn = new Date(bookings.check_in);
      const checkOut = new Date(bookings.check_out);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

      // Get property details
      const property = await supabaseHelpers.supabase
        .from('properties')
        .select('price_per_night')
        .eq('id', bookings.property_id)
        .single();

      if (property.data) {
        const accommodationAmount = nights * property.data.price_per_night;
        const cleaningFee = 30; // Standard cleaning fee

        // Insert line items
        await supabaseHelpers.supabase
          .from('booking_line_items')
          .insert([
            {
              booking_id: bookings.id,
              description: `${nights} night${nights > 1 ? 's' : ''} x €${property.data.price_per_night}`,
              amount: accommodationAmount,
              quantity: 1,
              type: 'accommodation'
            },
            {
              booking_id: bookings.id,
              description: 'Cleaning fee',
              amount: cleaningFee,
              quantity: 1,
              type: 'cleaning'
            }
          ]);
      }
    }

    console.log('Booking confirmed successfully:', bookings.id);
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
};

// Handle failed payment
const handlePaymentFailed = async (paymentIntent: Stripe.PaymentIntent) => {
  console.log('Payment failed:', paymentIntent.id);

  try {
    // Find booking by payment intent ID
    const { data: bookings, error } = await supabaseHelpers.supabase
      .from('bookings')
      .select('*')
      .eq('payment_intent_id', paymentIntent.id)
      .single();

    if (error || !bookings) {
      console.error('Booking not found for payment intent:', paymentIntent.id);
      return;
    }

    // Update booking status to cancelled
    await supabaseHelpers.updateBookingStatus(bookings.id, 'cancelled');

    console.log('Booking cancelled due to payment failure:', bookings.id);
  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
};

// Handle canceled payment
const handlePaymentCanceled = async (paymentIntent: Stripe.PaymentIntent) => {
  console.log('Payment canceled:', paymentIntent.id);

  try {
    // Find booking by payment intent ID
    const { data: bookings, error } = await supabaseHelpers.supabase
      .from('bookings')
      .select('*')
      .eq('payment_intent_id', paymentIntent.id)
      .single();

    if (error || !bookings) {
      console.error('Booking not found for payment intent:', paymentIntent.id);
      return;
    }

    // Update booking status to cancelled
    await supabaseHelpers.updateBookingStatus(bookings.id, 'cancelled');

    console.log('Booking cancelled:', bookings.id);
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
    throw error;
  }
};

// Verify Stripe webhook signature
export const verifyStripeSignature = (
  payload: string,
  signature: string,
  endpointSecret: string
): Stripe.Event => {
  try {
    return stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw new Error('Invalid signature');
  }
};

// Email notification helpers (to be implemented with your email service)
export const sendBookingConfirmation = async (bookingId: string) => {
  // TODO: Implement email sending logic
  // This could use services like:
  // - Postmark
  // - SendGrid
  // - Resend
  // - Or Supabase Edge Functions
  
  console.log('TODO: Send booking confirmation email for:', bookingId);
};

export const sendBookingCancellation = async (bookingId: string) => {
  // TODO: Implement email sending logic
  console.log('TODO: Send booking cancellation email for:', bookingId);
};
