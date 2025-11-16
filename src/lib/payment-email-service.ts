import { supabase, supabaseHelpers } from './supabase';
import { emailTemplateService, EmailTemplate } from '../services/EmailTemplateService';

export type PaymentMethod = 'stripe' | 'sepa' | 'cash_on_arrival';
export type TemplateType = EmailTemplate['template_type'];

export interface PaymentBookingEmailData {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number; // in euros
  currency: string;
  paymentMethod: PaymentMethod;
  specialRequests?: string;
  propertyAddress?: string;
  // Payment-specific data
  sepaData?: {
    referenceCode: string;
    iban: string;
    bic: string;
    accountHolder: string;
    bankName: string;
    paymentDeadline: string;
  };
  cashData?: {
    referenceCode: string;
    checkInTime: string;
    paymentLocation: string;
  };
  stripeData?: {
    paymentIntentId: string;
    last4?: string;
    brand?: string;
  };
}

export class PaymentEmailService {
  private readonly API_BASE_URL = import.meta.env.VITE_EMAIL_API_URL || 'http://localhost:3001/api/email';

  // Get the appropriate template name based on payment method and stage
  private getTemplateName(paymentMethod: PaymentMethod, stage: 'instructions' | 'received'): string {
    // Map to exact template names that exist in the database
    const templateMap = {
      stripe: {
        instructions: 'booking_confirmation_stripe',
        received: 'booking_confirmation_stripe' // Stripe is immediate
      },
      sepa: {
        instructions: 'booking_confirmation_sepa_instructions',
        received: 'booking_confirmation_sepa_received'
      },
      cash_on_arrival: {
        instructions: 'booking_confirmation_cash_instructions',
        received: 'booking_confirmation_cash_received'
      }
    };

    return templateMap[paymentMethod][stage];
  }

  // Process template with payment-specific variables and enhanced data
  private processPaymentTemplate(template: string, bookingData: PaymentBookingEmailData): string {
    // Calculate stay duration
    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Format dates beautifully
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    const baseVariables = {
      // Guest information
      customer_name: bookingData.guestName,
      guest_name: bookingData.guestName, // Alternative variable name
      
      // Property information
      property_name: bookingData.propertyName,
      property_address: bookingData.propertyAddress || 'Trikala, Greece',
      
      // Booking details
      booking_id: bookingData.bookingId,
      booking_reference: bookingData.bookingId,
      
      // Dates and duration
      check_in: checkInDate.toLocaleDateString('en-GB'),
      check_in_formatted: formatDate(checkInDate),
      check_in_day: checkInDate.toLocaleDateString('en-GB', { weekday: 'long' }),
      check_out: checkOutDate.toLocaleDateString('en-GB'),
      check_out_formatted: formatDate(checkOutDate),
      check_out_day: checkOutDate.toLocaleDateString('en-GB', { weekday: 'long' }),
      nights: nights.toString(),
      nights_plural: nights > 1 ? 'nights' : 'night',
      
      // Guest details
      guests: bookingData.guests.toString(),
      guests_plural: bookingData.guests > 1 ? 'guests' : 'guest',
      
      // Pricing
      total_amount: bookingData.totalAmount.toFixed(2),
      currency: bookingData.currency || 'EUR',
      currency_symbol: '€',
      
      // Business information
      business_name: 'Habitat Lobby',
      business_email: 'admin@habitatlobby.com',
      business_phone: '+30 697 769 0685',
      business_address: 'Alexandras 59, Trikala 42100, Greece',
      business_city: 'Trikala',
      business_country: 'Greece',
      
      // URLs
      booking_url: `${window.location.origin}/view-booking/${bookingData.bookingId}`,
      property_url: `${window.location.origin}/apartments`,
      review_url: `${window.location.origin}/review/${bookingData.bookingId}`,
      contact_url: `${window.location.origin}/contact`,
      
      // Special requests
      special_requests: bookingData.specialRequests || '',
      has_special_requests: bookingData.specialRequests ? 'true' : 'false',
      
      // Current year for footer
      current_year: new Date().getFullYear().toString(),
      
      // Payment method info
      payment_method: bookingData.paymentMethod,
      payment_method_display: this.getPaymentMethodDisplay(bookingData.paymentMethod)
    };

    // Add payment-specific variables
    let paymentVariables = {};
    
    if (bookingData.paymentMethod === 'sepa' && bookingData.sepaData) {
      const paymentDeadlineDate = new Date(bookingData.sepaData.paymentDeadline);
      paymentVariables = {
        sepa_reference: bookingData.sepaData.referenceCode,
        sepa_reference_code: bookingData.sepaData.referenceCode,
        sepa_iban: bookingData.sepaData.iban,
        sepa_bic: bookingData.sepaData.bic,
        sepa_swift: bookingData.sepaData.bic,
        sepa_account_holder: bookingData.sepaData.accountHolder,
        sepa_bank_name: bookingData.sepaData.bankName,
        payment_deadline: paymentDeadlineDate.toLocaleDateString('en-GB'),
        payment_deadline_formatted: formatDate(paymentDeadlineDate),
        payment_deadline_time: paymentDeadlineDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      };
    } else if (bookingData.paymentMethod === 'cash_on_arrival' && bookingData.cashData) {
      paymentVariables = {
        cash_reference: bookingData.cashData.referenceCode,
        cash_reference_code: bookingData.cashData.referenceCode,
        check_in_time: bookingData.cashData.checkInTime || '15:00',
        payment_location: bookingData.cashData.paymentLocation || 'At the property during check-in',
        payment_instructions: 'Please have the exact amount ready in cash (Euro notes) upon arrival.'
      };
    } else if (bookingData.paymentMethod === 'stripe' && bookingData.stripeData) {
      paymentVariables = {
        payment_intent_id: bookingData.stripeData.paymentIntentId,
        card_last4: bookingData.stripeData.last4 || '',
        card_brand: bookingData.stripeData.brand || ''
      };
    }

    const allVariables = { ...baseVariables, ...paymentVariables };
    
    return emailTemplateService.processTemplate(template, allVariables);
  }

  // Get user-friendly payment method display name
  private getPaymentMethodDisplay(paymentMethod: PaymentMethod): string {
    const displayNames = {
      stripe: 'Credit Card',
      sepa: 'Bank Transfer (SEPA)',
      cash_on_arrival: 'Cash on Arrival'
    };
    return displayNames[paymentMethod] || paymentMethod;
  }

  // Send payment-specific booking email
  async sendPaymentBookingEmail(
    bookingData: PaymentBookingEmailData,
    stage: 'instructions' | 'received' = 'instructions'
  ): Promise<boolean> {
    try {
      const templateName = this.getTemplateName(bookingData.paymentMethod, stage);
      
      console.log(`📧 Sending ${bookingData.paymentMethod} email (${stage}) to:`, bookingData.guestEmail);
      console.log(`📧 Template name:`, templateName);
      
      // Get the template from database by name instead of type
      const templates = await emailTemplateService.getAllTemplates();
      let template = templates.find(t => t.name === templateName && t.is_active);
      
      if (!template) {
        console.warn(`Primary template not found by name: ${templateName}, trying fallback...`);
        
        // Try fallback template types
        const fallbackTypes: TemplateType[] = ['payment_confirmation', 'booking_confirmation'];
        for (const fallbackType of fallbackTypes) {
          template = await emailTemplateService.getTemplateByType(fallbackType);
          if (template) {
            console.log(`✅ Using fallback template type: ${fallbackType}`);
            break;
          }
        }
      }

      if (!template) {
        console.error(`No template found for ${bookingData.paymentMethod} payment email (${stage})`);
        return false;
      }

      // Process template with variables
      const processedSubject = this.processPaymentTemplate(template.subject, bookingData);
      const processedContent = this.processPaymentTemplate(template.content, bookingData);

      // Send email via backend API
      const response = await fetch(`${this.API_BASE_URL}/payment-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_EMAIL_API_KEY || ''
        },
        body: JSON.stringify({
          to: bookingData.guestEmail,
          toName: bookingData.guestName,
          subject: processedSubject,
          htmlBody: processedContent,
          metadata: {
            booking_id: bookingData.bookingId,
            payment_method: bookingData.paymentMethod,
            template_name: templateName,
            template_type: template.template_type,
            stage: stage
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Email API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      // Log the email
      await emailTemplateService.logEmail({
        template_id: template.id,
        recipient_email: bookingData.guestEmail,
        recipient_name: bookingData.guestName,
        subject: processedSubject,
        content: processedContent,
        status: 'sent',
        booking_id: bookingData.bookingId,
        sent_at: new Date().toISOString(),
        metadata: {
          payment_method: bookingData.paymentMethod,
          template_name: templateName,
          template_type: template.template_type,
          stage: stage
        }
      });

      const result = await response.json();
      console.log('✅ Payment email sent successfully:', result);
      
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send payment booking email:', error);
      
      // Log failed email with more descriptive subject
      try {
        const templateName = this.getTemplateName(bookingData.paymentMethod, stage);
        await emailTemplateService.logEmail({
          recipient_email: bookingData.guestEmail,
          recipient_name: bookingData.guestName,
          subject: `Payment Email Failed - ${bookingData.paymentMethod}`,
          content: `Email sending failed for booking ${bookingData.bookingId}`,
          status: 'failed',
          booking_id: bookingData.bookingId,
          sent_at: new Date().toISOString(),
          error_message: error instanceof Error ? error.message : 'Unknown error',
          metadata: {
            payment_method: bookingData.paymentMethod,
            template_name: templateName,
            stage: stage,
            error_type: 'template_selection_or_processing'
          }
        });
      } catch (logError) {
        console.error('Failed to log email error:', logError);
      }
      
      return false;
    }
  }

  // Send Stripe booking confirmation (immediate)
  async sendStripeBookingConfirmation(bookingData: PaymentBookingEmailData): Promise<boolean> {
    return this.sendPaymentBookingEmail({
      ...bookingData,
      paymentMethod: 'stripe'
    }, 'instructions'); // Stripe sends confirmation immediately
  }

  // Send SEPA payment instructions (when booking created)
  async sendSEPAPaymentInstructions(bookingData: PaymentBookingEmailData): Promise<boolean> {
    if (!bookingData.sepaData) {
      throw new Error('SEPA data is required for SEPA payment instructions');
    }
    
    return this.sendPaymentBookingEmail({
      ...bookingData,
      paymentMethod: 'sepa'
    }, 'instructions');
  }

  // Send SEPA payment received confirmation (when admin confirms)
  async sendSEPAPaymentReceived(bookingData: PaymentBookingEmailData): Promise<boolean> {
    if (!bookingData.sepaData) {
      throw new Error('SEPA data is required for SEPA payment confirmation');
    }
    
    return this.sendPaymentBookingEmail({
      ...bookingData,
      paymentMethod: 'sepa'
    }, 'received');
  }

  // Send cash on arrival instructions (when booking created)
  async sendCashOnArrivalInstructions(bookingData: PaymentBookingEmailData): Promise<boolean> {
    if (!bookingData.cashData) {
      throw new Error('Cash data is required for cash on arrival instructions');
    }
    
    return this.sendPaymentBookingEmail({
      ...bookingData,
      paymentMethod: 'cash_on_arrival'
    }, 'instructions');
  }

  // Send cash payment received confirmation (when admin confirms)
  async sendCashPaymentReceived(bookingData: PaymentBookingEmailData): Promise<boolean> {
    if (!bookingData.cashData) {
      throw new Error('Cash data is required for cash payment confirmation');
    }
    
    return this.sendPaymentBookingEmail({
      ...bookingData,
      paymentMethod: 'cash_on_arrival'
    }, 'received');
  }

  // Helper method to send booking email by ID with payment method detection
  async sendBookingEmailById(bookingId: string, stage: 'instructions' | 'received' = 'instructions'): Promise<boolean> {
    try {
      // Get booking details from database
      const bookings = await supabaseHelpers.getAllBookings(1, 0, { booking_id: bookingId });
      
      if (!bookings.bookings || bookings.bookings.length === 0) {
        console.error('Booking not found:', bookingId);
        return false;
      }

      const booking = bookings.bookings[0];
      
      // Detect payment method based on booking data
      let paymentMethod: PaymentMethod = 'stripe'; // default
      let paymentData = {};

      // Check for SEPA payment
      const { data: sepaPayment } = await supabase
        .from('sepa_payments')
        .select('*')
        .eq('booking_id', bookingId)
        .single();

      if (sepaPayment) {
        paymentMethod = 'sepa';
        paymentData = {
          sepaData: {
            referenceCode: sepaPayment.reference_code,
            iban: sepaPayment.iban_info?.iban || 'GR1234567890123456789012345',
            bic: sepaPayment.iban_info?.bic || 'PIRBGRAA',
            accountHolder: sepaPayment.iban_info?.account_holder || 'HABITAT LOBBY',
            bankName: sepaPayment.iban_info?.bank_name || 'Piraeus Bank',
            paymentDeadline: sepaPayment.expires_at
          }
        };
      } else {
        // Check for cash payment
        const { data: cashPayment } = await supabase
          .from('cash_on_arrival_payments')
          .select('*')
          .eq('booking_id', bookingId)
          .single();

        if (cashPayment) {
          paymentMethod = 'cash_on_arrival';
          paymentData = {
            cashData: {
              referenceCode: cashPayment.reference_code,
              checkInTime: cashPayment.check_in_time,
              paymentLocation: cashPayment.payment_location
            }
          };
        }
      }

      const emailData: PaymentBookingEmailData = {
        bookingId: booking.id,
        guestName: booking.customer_name,
        guestEmail: booking.customer_email,
        propertyName: booking.properties?.name || 'Property',
        checkIn: booking.check_in,
        checkOut: booking.check_out,
        guests: booking.guests,
        totalAmount: booking.total_amount,
        currency: booking.currency || 'EUR',
        paymentMethod,
        specialRequests: booking.special_requests,
        ...paymentData
      };

      return await this.sendPaymentBookingEmail(emailData, stage);
      
    } catch (error) {
      console.error('Failed to send booking email by ID:', error);
      return false;
    }
  }
}

export const paymentEmailService = new PaymentEmailService();