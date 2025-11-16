import { supabaseHelpers } from './supabase';

// NOTE: This service should run on the server-side only
// Stripe operations with secret keys must NEVER be in frontend code
// Use the backend API instead for all payment operations

export interface RefundRequest {
  paymentId: string;
  amount?: number; // Optional for partial refunds
  reason?: string;
  metadata?: Record<string, string>;
}

export interface RefundResult {
  success: boolean;
  refund?: Record<string, unknown>;
  error?: string;
}

export class PaymentService {
  // Process a refund
  async processRefund(request: RefundRequest): Promise<RefundResult> {
    try {
      // Check if we're on the client-side
      if (!stripe) {
        console.warn('Stripe not available on client-side. This should be called from server-side.');
        return { success: false, error: 'Payment processing not available on client-side' };
      }

      // Get payment details from database
      const payment = await this.getPaymentById(request.paymentId);

      if (!payment) {
        return { success: false, error: 'Payment not found' };
      }

      if (!payment.stripe_payment_intent_id) {
        return { success: false, error: 'No Stripe payment intent found' };
      }

      // NOTE: Refund processing should be done via backend API
      // This is a placeholder - actual implementation must be on server-side
      throw new Error('Refund processing must be done via backend API, not frontend');

      // Update payment record in database
      await this.updatePaymentAfterRefund(payment.id, refund, request.reason);

      return { success: true, refund };

    } catch (error) {
      console.error('Error processing refund:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Refund failed' 
      };
    }
  }

  // Get payment details by ID
  private async getPaymentById(paymentId: string): Promise<{
    id: string;
    stripe_payment_intent_id: string;
    amount: number;
    currency: string;
    status: string;
  } | null> {
    try {
      // This would need to be implemented in supabaseHelpers
      // For now, return a mock payment
      return {
        id: paymentId,
        stripe_payment_intent_id: 'pi_mock_payment_intent',
        amount: 100.00,
        currency: 'EUR',
        status: 'succeeded'
      };
    } catch (error) {
      console.error('Error getting payment by ID:', error);
      return null;
    }
  }

  // Update payment record after refund
  private async updatePaymentAfterRefund(
    paymentId: string,
    refund: Record<string, unknown>,
    reason?: string
  ): Promise<void> {
    try {
      const refundAmount = refund.amount / 100; // Convert from cents
      
      await supabaseHelpers.updatePaymentStatus(paymentId, 'refunded', {
        refunded_amount: refundAmount,
        refund_reason: reason,
        metadata: {
          refund_id: refund.id,
          refund_status: refund.status,
          refund_created: new Date(refund.created * 1000).toISOString()
        }
      });

    } catch (error) {
      console.error('Error updating payment after refund:', error);
      throw error;
    }
  }

  // Map refund reason to Stripe's expected values
  private mapRefundReason(reason?: string): Stripe.RefundCreateParams.Reason {
    switch (reason?.toLowerCase()) {
      case 'duplicate':
        return 'duplicate';
      case 'fraudulent':
        return 'fraudulent';
      case 'requested_by_customer':
      default:
        return 'requested_by_customer';
    }
  }

  // Create a payment intent for a booking
  async createPaymentIntent(
    amount: number,
    currency: string = 'EUR',
    metadata: Record<string, string> = {}
  ): Promise<Stripe.PaymentIntent> {
    try {
      if (!stripe) {
        throw new Error('Stripe not available on client-side');
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true,
        },
        metadata,
      });

      return paymentIntent;

    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Capture a payment intent (for manual capture)
  async capturePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
      return paymentIntent;

    } catch (error) {
      console.error('Error capturing payment intent:', error);
      throw error;
    }
  }

  // Cancel a payment intent
  async cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
      return paymentIntent;

    } catch (error) {
      console.error('Error canceling payment intent:', error);
      throw error;
    }
  }

  // Get payment method details
  async getPaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
      return paymentMethod;

    } catch (error) {
      console.error('Error getting payment method:', error);
      throw error;
    }
  }

  // Create a customer in Stripe
  async createCustomer(
    email: string,
    name?: string,
    metadata: Record<string, string> = {}
  ): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata,
      });

      return customer;

    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Update customer information
  async updateCustomer(
    customerId: string,
    updates: Stripe.CustomerUpdateParams
  ): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.update(customerId, updates);
      return customer;

    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  // Get customer by email
  async getCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
    try {
      const customers = await stripe.customers.list({
        email,
        limit: 1,
      });

      return customers.data.length > 0 ? customers.data[0] : null;

    } catch (error) {
      console.error('Error getting customer by email:', error);
      return null;
    }
  }

  // Generate payment report
  async generatePaymentReport(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalAmount: number;
    totalRefunds: number;
    transactionCount: number;
    refundCount: number;
  }> {
    try {
      // Get charges for the date range
      const charges = await stripe.charges.list({
        created: {
          gte: Math.floor(startDate.getTime() / 1000),
          lte: Math.floor(endDate.getTime() / 1000),
        },
        limit: 100, // Adjust as needed
      });

      let totalAmount = 0;
      let totalRefunds = 0;
      let transactionCount = 0;
      let refundCount = 0;

      for (const charge of charges.data) {
        if (charge.paid) {
          totalAmount += charge.amount / 100; // Convert from cents
          transactionCount++;
        }

        if (charge.refunded) {
          totalRefunds += charge.amount_refunded / 100; // Convert from cents
          refundCount++;
        }
      }

      return {
        totalAmount,
        totalRefunds,
        transactionCount,
        refundCount,
      };

    } catch (error) {
      console.error('Error generating payment report:', error);
      throw error;
    }
  }

  // Validate webhook signature
  validateWebhookSignature(payload: string, signature: string, secret: string): boolean {
    try {
      stripe.webhooks.constructEvent(payload, signature, secret);
      return true;
    } catch (error) {
      console.error('Webhook signature validation failed:', error);
      return false;
    }
  }
}

// Export a default instance
export const paymentService = new PaymentService();

export default PaymentService;
