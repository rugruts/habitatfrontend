import Stripe from 'stripe';
import { supabaseHelpers } from './supabase';

// Initialize Stripe with secret key (server-side only)
const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY || 'sk_test_placeholder';
const stripe = typeof window === 'undefined'
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-07-30.basil' })
  : null;

export interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: Stripe.PaymentIntent | Stripe.Charge | Stripe.Dispute | Stripe.Invoice | Record<string, unknown>;
  };
  created: number;
}

export class StripeWebhookHandler {
  private webhookSecret: string;

  constructor(webhookSecret: string) {
    this.webhookSecret = webhookSecret;
  }

  // Verify webhook signature
  verifyWebhook(payload: string, signature: string): WebhookEvent {
    try {
      if (!stripe) {
        throw new Error('Stripe not available on client-side');
      }

      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );
      return event as WebhookEvent;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw new Error('Invalid webhook signature');
    }
  }

  // Handle different webhook events
  async handleWebhook(event: WebhookEvent): Promise<void> {
    console.log(`Processing webhook event: ${event.type}`);

    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.canceled':
          await this.handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
          break;

        case 'charge.dispute.created':
          await this.handleChargeDispute(event.data.object as Stripe.Dispute);
          break;

        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          // Handle subscription events if needed
          console.log(`Subscription event: ${event.type}`);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error(`Error handling webhook event ${event.type}:`, error);
      throw error;
    }
  }

  // Handle successful payment
  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      console.log('Payment succeeded:', paymentIntent.id);

      // Update payment record in database
      const paymentData = {
        stripe_payment_intent_id: paymentIntent.id,
        stripe_charge_id: paymentIntent.latest_charge as string,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency.toUpperCase(),
        status: 'succeeded' as const,
        payment_method: this.getPaymentMethodType(paymentIntent.payment_method),
        payment_method_details: paymentIntent.payment_method_types,
        processed_at: new Date().toISOString(),
        receipt_url: null, // Would need to fetch from charges separately
        metadata: paymentIntent.metadata
      };

      // Find existing payment record or create new one
      const existingPayment = await this.findPaymentByIntentId(paymentIntent.id);
      
      if (existingPayment) {
        await supabaseHelpers.updatePaymentStatus(
          existingPayment.id,
          'succeeded',
          paymentData
        );
      } else {
        // Create new payment record
        await supabaseHelpers.createPayment(paymentData);
      }

      // Update booking status if this payment is for a booking
      if (paymentIntent.metadata.booking_id) {
        await this.updateBookingAfterPayment(
          paymentIntent.metadata.booking_id,
          'confirmed'
        );
      }

      // Send confirmation email
      await this.sendPaymentConfirmationEmail(paymentIntent);

    } catch (error) {
      console.error('Error handling payment succeeded:', error);
      throw error;
    }
  }

  // Handle failed payment
  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      console.log('Payment failed:', paymentIntent.id);

      const failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';

      // Update payment record
      const existingPayment = await this.findPaymentByIntentId(paymentIntent.id);
      
      if (existingPayment) {
        await supabaseHelpers.updatePaymentStatus(
          existingPayment.id,
          'failed',
          {
            failed_at: new Date().toISOString(),
            failure_reason: failureReason
          }
        );
      }

      // Update booking status
      if (paymentIntent.metadata.booking_id) {
        await this.updateBookingAfterPayment(
          paymentIntent.metadata.booking_id,
          'pending'
        );
      }

      // Send failure notification email
      await this.sendPaymentFailureEmail(paymentIntent, failureReason);

    } catch (error) {
      console.error('Error handling payment failed:', error);
      throw error;
    }
  }

  // Handle canceled payment
  private async handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      console.log('Payment canceled:', paymentIntent.id);

      // Update payment record
      const existingPayment = await this.findPaymentByIntentId(paymentIntent.id);
      
      if (existingPayment) {
        await supabaseHelpers.updatePaymentStatus(
          existingPayment.id,
          'cancelled'
        );
      }

      // Update booking status
      if (paymentIntent.metadata.booking_id) {
        await this.updateBookingAfterPayment(
          paymentIntent.metadata.booking_id,
          'cancelled'
        );
      }

    } catch (error) {
      console.error('Error handling payment canceled:', error);
      throw error;
    }
  }

  // Handle charge dispute
  private async handleChargeDispute(dispute: Stripe.Dispute): Promise<void> {
    try {
      console.log('Charge dispute created:', dispute.id);

      // Find the payment record
      const paymentIntent = await stripe.paymentIntents.retrieve(
        dispute.payment_intent as string
      );

      const existingPayment = await this.findPaymentByIntentId(paymentIntent.id);
      
      if (existingPayment) {
        // Update payment with dispute information
        await supabaseHelpers.updatePaymentStatus(
          existingPayment.id,
          'refunded', // or create a new 'disputed' status
          {
            metadata: {
              ...existingPayment.metadata,
              dispute_id: dispute.id,
              dispute_reason: dispute.reason,
              dispute_status: dispute.status
            }
          }
        );
      }

      // Notify admin about dispute
      await this.notifyAdminAboutDispute(dispute, paymentIntent);

    } catch (error) {
      console.error('Error handling charge dispute:', error);
      throw error;
    }
  }

  // Handle invoice payment succeeded (for recurring payments if implemented)
  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    console.log('Invoice payment succeeded:', invoice.id);
    // Handle recurring payment logic here if needed
  }

  // Helper methods

  private async findPaymentByIntentId(paymentIntentId: string): Promise<{
    id: string;
    stripe_payment_intent_id: string;
    amount: number;
    currency: string;
    status: string;
    metadata?: Record<string, unknown>;
  } | null> {
    try {
      // This would need to be implemented in supabaseHelpers
      // For now, return null
      return null;
    } catch (error) {
      console.error('Error finding payment by intent ID:', error);
      return null;
    }
  }

  private async updateBookingAfterPayment(bookingId: string, status: string): Promise<void> {
    try {
      // Update booking status in database
      // This would need to be implemented in supabaseHelpers
      console.log(`Updating booking ${bookingId} to status: ${status}`);
    } catch (error) {
      console.error('Error updating booking after payment:', error);
    }
  }

  private getPaymentMethodType(paymentMethod: string | Stripe.PaymentMethod | null | undefined): 'card' | 'bank_transfer' | 'cash' {
    // Determine payment method type from Stripe payment method
    if (typeof paymentMethod === 'string') {
      return 'card'; // Default for most cases
    }

    if (paymentMethod?.type === 'card') return 'card';
    if (paymentMethod?.type === 'sepa_debit') return 'bank_transfer';

    return 'card'; // Default fallback
  }

  private async sendPaymentConfirmationEmail(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      // Send confirmation email using your email service
      console.log('Sending payment confirmation email for:', paymentIntent.id);
      
      // This would integrate with your email automation system
      // You could trigger an email template here
    } catch (error) {
      console.error('Error sending payment confirmation email:', error);
    }
  }

  private async sendPaymentFailureEmail(paymentIntent: Stripe.PaymentIntent, _reason: string): Promise<void> {
    try {
      // Send failure notification email
      console.log('Sending payment failure email for:', paymentIntent.id);

      // This would integrate with your email automation system
    } catch (error) {
      console.error('Error sending payment failure email:', error);
    }
  }

  private async notifyAdminAboutDispute(dispute: Stripe.Dispute, _paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      // Notify admin about the dispute
      console.log('Notifying admin about dispute:', dispute.id);

      // This could send an email to admin or create a notification in the system
    } catch (error) {
      console.error('Error notifying admin about dispute:', error);
    }
  }
}

// Export a default instance
export const webhookHandler = new StripeWebhookHandler(
  process.env.STRIPE_WEBHOOK_SECRET || ''
);

export default StripeWebhookHandler;
