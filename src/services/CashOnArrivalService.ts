import { supabase } from '@/lib/supabase';

export interface CashOnArrivalPayment {
  id: string;
  booking_id: string;
  reference_code: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  customer_info: {
    name: string;
    email: string;
  };
  payment_instructions: string;
  property_address?: string;
  payment_location: string;
  check_in_time: string;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  confirmed_by?: string;
}

export class CashOnArrivalService {
  // Generate unique reference code for cash payment
  private generateReferenceCode(bookingId: string): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `CASH-${timestamp}-${random}`;
  }

  // Create cash on arrival payment record
  async createCashOnArrivalPayment(
    bookingId: string,
    amount: number,
    currency: string = 'EUR',
    customerInfo: {
      name: string;
      email: string;
    },
    propertyInfo: {
      address?: string;
      checkInTime?: string;
    } = {}
  ): Promise<CashOnArrivalPayment> {
    try {
      const referenceCode = this.generateReferenceCode(bookingId);
      const checkInTime = propertyInfo.checkInTime || '15:00';
      const paymentLocation = propertyInfo.address || 'At the property during check-in';

      const paymentData = {
        booking_id: bookingId,
        reference_code: referenceCode,
        amount: amount / 100, // Convert from cents to euros
        currency,
        status: 'pending',
        customer_info: customerInfo,
        payment_instructions: this.generatePaymentInstructions(amount / 100, paymentLocation, checkInTime),
        property_address: propertyInfo.address,
        payment_location: paymentLocation,
        check_in_time: checkInTime,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Try to insert into database
      try {
        const { data, error } = await supabase
          .from('cash_on_arrival_payments')
          .insert([paymentData])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (dbError) {
        // If table doesn't exist, create a mock response for now
        console.warn('Cash payments table not found, using fallback:', dbError);
        return {
          id: `cash_${Date.now()}`,
          ...paymentData
        };
      }
    } catch (error) {
      console.error('Error creating cash on arrival payment:', error);
      throw new Error(`Failed to create cash payment record: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Generate payment instructions for cash on arrival
  private generatePaymentInstructions(amount: number, location: string, checkInTime: string): string {
    return `
Cash Payment Instructions:

Amount to Pay: €${amount.toFixed(2)}
Payment Location: ${location}
Payment Time: During check-in at ${checkInTime}

Please ensure you have the exact amount or similar denominations ready. 
You can pay in cash when you arrive at the property during check-in.

A receipt will be provided upon payment confirmation.
    `.trim();
  }

  // Get cash payment by booking ID
  async getCashPayment(bookingId: string): Promise<CashOnArrivalPayment | null> {
    try {
      const { data, error } = await supabase
        .from('cash_on_arrival_payments')
        .select('*')
        .eq('booking_id', bookingId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No record found
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching cash payment:', error);
      return null;
    }
  }

  // Get cash payment by reference code
  async getCashPaymentByReference(referenceCode: string): Promise<CashOnArrivalPayment | null> {
    try {
      const { data, error } = await supabase
        .from('cash_on_arrival_payments')
        .select('*')
        .eq('reference_code', referenceCode)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No record found
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching cash payment by reference:', error);
      return null;
    }
  }

  // Confirm cash payment (admin action after guest pays on arrival)
  async confirmCashPayment(
    referenceCode: string,
    confirmedBy: string
  ): Promise<CashOnArrivalPayment> {
    try {
      const { data, error } = await supabase
        .from('cash_on_arrival_payments')
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
          confirmed_by: confirmedBy,
          updated_at: new Date().toISOString()
        })
        .eq('reference_code', referenceCode)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error confirming cash payment:', error);
      throw new Error(`Failed to confirm cash payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Cancel cash payment
  async cancelCashPayment(referenceCode: string): Promise<CashOnArrivalPayment> {
    try {
      const { data, error } = await supabase
        .from('cash_on_arrival_payments')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('reference_code', referenceCode)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error cancelling cash payment:', error);
      throw new Error(`Failed to cancel cash payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get all pending cash payments (for admin dashboard)
  async getPendingCashPayments(): Promise<CashOnArrivalPayment[]> {
    try {
      const { data, error } = await supabase
        .from('cash_on_arrival_payments')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pending cash payments:', error);
      return [];
    }
  }

  // Get payment statistics
  async getPaymentStats(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('cash_on_arrival_payments')
        .select('status');

      if (error) throw error;

      const payments = data || [];
      return {
        total: payments.length,
        pending: payments.filter(p => p.status === 'pending').length,
        confirmed: payments.filter(p => p.status === 'confirmed').length,
        cancelled: payments.filter(p => p.status === 'cancelled').length
      };
    } catch (error) {
      console.error('Error fetching cash payment stats:', error);
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        cancelled: 0
      };
    }
  }
}

export const cashOnArrivalService = new CashOnArrivalService();
