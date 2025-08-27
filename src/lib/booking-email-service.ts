import { supabaseHelpers } from './supabase';

export interface BookingEmailData {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number; // in euros
  currency: string;
  specialRequests?: string;
  propertyAddress?: string;
}

export interface SEPAPaymentEmailData extends BookingEmailData {
  sepaReferenceCode: string;
  ibanInfo: {
    iban: string;
    bic: string;
    accountHolder: string;
  };
  paymentDeadline: string;
  amount: number;
}

export interface SEPAPaymentReceivedData extends BookingEmailData {
  sepaReferenceCode: string;
  paymentDate: string;
  amount: number;
}

export class BookingEmailService {
  private readonly API_BASE_URL = import.meta.env.VITE_EMAIL_API_URL || 'http://localhost:3001/api/email';

  // Create booking confirmation email content
  private createBookingConfirmationEmail(booking: BookingEmailData): { subject: string; html: string; text: string } {
    const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-GB');
    const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-GB');
    const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24));

    const subject = `Booking Confirmed - ${booking.propertyName} | Habitat Lobby`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2D5A27; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px 20px; background: #ffffff; }
          .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; border-radius: 0 0 8px 8px; }
          .button { background: #D4A574; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          .highlight { background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #2D5A27; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Thank you for choosing Habitat Lobby</p>
          </div>
          
          <div class="content">
            <p>Dear ${booking.guestName},</p>
            
            <p>We're delighted to confirm your reservation. Your booking details are below:</p>
            
            <div class="booking-details">
              <h3 style="margin-top: 0; color: #2D5A27;">Booking Reference: ${booking.bookingId}</h3>
              <div class="detail-row">
                <span><strong>Property:</strong></span>
                <span>${booking.propertyName}</span>
              </div>
              <div class="detail-row">
                <span><strong>Check-in:</strong></span>
                <span>${checkInDate} (15:00)</span>
              </div>
              <div class="detail-row">
                <span><strong>Check-out:</strong></span>
                <span>${checkOutDate} (11:00)</span>
              </div>
              <div class="detail-row">
                <span><strong>Duration:</strong></span>
                <span>${nights} night${nights > 1 ? 's' : ''}</span>
              </div>
              <div class="detail-row">
                <span><strong>Guests:</strong></span>
                <span>${booking.guests}</span>
              </div>
              <div class="detail-row">
                <span><strong>Total Amount:</strong></span>
                <span><strong>€${booking.totalAmount.toFixed(2)}</strong></span>
              </div>
            </div>
            
            ${booking.specialRequests ? `
            <div class="booking-details">
              <h4 style="margin-top: 0; color: #2D5A27;">Special Requests:</h4>
              <p style="margin-bottom: 0;">${booking.specialRequests}</p>
            </div>
            ` : ''}
            
            <div class="highlight">
              <h3 style="margin-top: 0;">📋 What's Next?</h3>
              <ul style="margin-bottom: 0;">
                <li>You'll receive check-in instructions 48 hours before arrival</li>
                <li>Free cancellation up to 48 hours before check-in</li>
                <li>Our local team is available 24/7 for assistance</li>
                <li>Please bring the same ID document used during booking</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://habitatlobby.com/view-booking/${booking.bookingId}" class="button">
                View Booking Details
              </a>
            </div>
            
            <p>We look forward to hosting you in beautiful Trikala!</p>
            
            <p>Best regards,<br>
            <strong>The Habitat Lobby Team</strong></p>
          </div>
          
          <div class="footer">
            <p><strong>Habitat Lobby</strong> | Trikala, Greece</p>
            <p>For support, contact us at <a href="mailto:admin@habitatlobby.com">admin@habitatlobby.com</a> or call +30 697 769 0685</p>
            <p style="font-size: 12px; color: #999; margin-top: 15px;">
              This email was sent regarding your booking ${booking.bookingId}. 
              Please keep this email for your records.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Booking Confirmed - Habitat Lobby
      
      Dear ${booking.guestName},
      
      We're delighted to confirm your reservation.
      
      Booking Reference: ${booking.bookingId}
      Property: ${booking.propertyName}
      Check-in: ${checkInDate} (15:00)
      Check-out: ${checkOutDate} (11:00)
      Duration: ${nights} night${nights > 1 ? 's' : ''}
      Guests: ${booking.guests}
      Total Amount: €${booking.totalAmount.toFixed(2)}
      
      ${booking.specialRequests ? `Special Requests: ${booking.specialRequests}\n\n` : ''}
      
      What's Next?
      - You'll receive check-in instructions 48 hours before arrival
      - Free cancellation up to 48 hours before check-in
      - Our local team is available 24/7 for assistance
      - Please bring the same ID document used during booking
      
      View your booking: https://habitatlobby.com/view-booking/${booking.bookingId}
      
      We look forward to hosting you in beautiful Trikala!
      
      Best regards,
      The Habitat Lobby Team
      
      Habitat Lobby | Trikala, Greece
      For support, contact us at admin@habitatlobby.com or call +30 697 769 0685
    `;

    return { subject, html, text };
  }

  // Create SEPA payment instructions email content
  private createSEPAPaymentInstructionsEmail(booking: SEPAPaymentEmailData): { subject: string; html: string; text: string } {
    const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-GB');
    const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-GB');
    const paymentDeadline = new Date(booking.paymentDeadline).toLocaleDateString('en-GB');
    const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24));

    const subject = `SEPA Payment Instructions - ${booking.propertyName} | Habitat Lobby`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SEPA Payment Instructions</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2D5A27; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px 20px; background: #ffffff; }
          .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; border-radius: 0 0 8px 8px; }
          .button { background: #D4A574; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          .highlight { background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #2D5A27; }
          .warning { background: #fff3cd; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ffc107; }
          .payment-info { background: #d1ecf1; padding: 20px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #17a2b8; }
          .code { background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; font-weight: bold; color: #2D5A27; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏦 SEPA Payment Instructions</h1>
            <p>Complete your booking with bank transfer</p>
          </div>
          
          <div class="content">
            <p>Dear ${booking.guestName},</p>
            
            <p>Thank you for choosing SEPA bank transfer for your booking. Your reservation is <strong>pending payment confirmation</strong>.</p>
            
            <div class="booking-details">
              <h3 style="margin-top: 0; color: #2D5A27;">Booking Reference: ${booking.bookingId}</h3>
              <div class="detail-row">
                <span><strong>Property:</strong></span>
                <span>${booking.propertyName}</span>
              </div>
              <div class="detail-row">
                <span><strong>Check-in:</strong></span>
                <span>${checkInDate} (15:00)</span>
              </div>
              <div class="detail-row">
                <span><strong>Check-out:</strong></span>
                <span>${checkOutDate} (11:00)</span>
              </div>
              <div class="detail-row">
                <span><strong>Duration:</strong></span>
                <span>${nights} night${nights > 1 ? 's' : ''}</span>
              </div>
              <div class="detail-row">
                <span><strong>Guests:</strong></span>
                <span>${booking.guests}</span>
              </div>
              <div class="detail-row">
                <span><strong>Amount to Pay:</strong></span>
                <span><strong>€${booking.amount.toFixed(2)}</strong></span>
              </div>
            </div>
            
            <div class="payment-info">
              <h3 style="margin-top: 0; color: #17a2b8;">💳 Payment Details</h3>
              <div class="detail-row">
                <span><strong>IBAN:</strong></span>
                <span class="code">${booking.ibanInfo.iban}</span>
              </div>
              <div class="detail-row">
                <span><strong>BIC/SWIFT:</strong></span>
                <span class="code">${booking.ibanInfo.bic}</span>
              </div>
              <div class="detail-row">
                <span><strong>Account Holder:</strong></span>
                <span>${booking.ibanInfo.accountHolder}</span>
              </div>
              <div class="detail-row">
                <span><strong>Reference Code:</strong></span>
                <span class="code">${booking.sepaReferenceCode}</span>
              </div>
              <div class="detail-row">
                <span><strong>Payment Deadline:</strong></span>
                <span><strong>${paymentDeadline}</strong></span>
              </div>
            </div>
            
            <div class="warning">
              <h3 style="margin-top: 0; color: #856404;">⚠️ Important Instructions</h3>
              <ol style="margin-bottom: 0;">
                <li><strong>Include the reference code</strong> in your transfer description/message</li>
                <li>Complete the transfer before <strong>${paymentDeadline}</strong></li>
                <li>SEPA transfers typically take 1-3 business days</li>
                <li>Keep your transfer receipt for reference</li>
              </ol>
            </div>
            
            <div class="highlight">
              <h3 style="margin-top: 0;">📋 What happens next?</h3>
              <ul style="margin-bottom: 0;">
                <li>We'll confirm your booking once payment is received</li>
                <li>You'll receive a confirmation email with all details</li>
                <li>Check-in instructions will be sent 48 hours before arrival</li>
                <li>Free cancellation up to 48 hours before check-in</li>
              </ul>
            </div>
            
            <p>If you have any questions about the payment, please contact us immediately.</p>
            
            <p>Best regards,<br>
            <strong>The Habitat Lobby Team</strong></p>
          </div>
          
          <div class="footer">
            <p><strong>Habitat Lobby</strong> | Trikala, Greece</p>
            <p>For support, contact us at <a href="mailto:admin@habitatlobby.com">admin@habitatlobby.com</a> or call +30 697 769 0685</p>
            <p style="font-size: 12px; color: #999; margin-top: 15px;">
              Reference: ${booking.bookingId} | SEPA Code: ${booking.sepaReferenceCode}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      SEPA Payment Instructions - Habitat Lobby
      
      Dear ${booking.guestName},
      
      Thank you for choosing SEPA bank transfer for your booking. Your reservation is pending payment confirmation.
      
      Booking Reference: ${booking.bookingId}
      Property: ${booking.propertyName}
      Check-in: ${checkInDate} (15:00)
      Check-out: ${checkOutDate} (11:00)
      Duration: ${nights} night${nights > 1 ? 's' : ''}
      Guests: ${booking.guests}
      Amount to Pay: €${booking.amount.toFixed(2)}
      
      PAYMENT DETAILS:
      IBAN: ${booking.ibanInfo.iban}
      BIC/SWIFT: ${booking.ibanInfo.bic}
      Account Holder: ${booking.ibanInfo.accountHolder}
      Reference Code: ${booking.sepaReferenceCode}
      Payment Deadline: ${paymentDeadline}
      
      IMPORTANT INSTRUCTIONS:
      1. Include the reference code in your transfer description/message
      2. Complete the transfer before ${paymentDeadline}
      3. SEPA transfers typically take 1-3 business days
      4. Keep your transfer receipt for reference
      
      What happens next?
      - We'll confirm your booking once payment is received
      - You'll receive a confirmation email with all details
      - Check-in instructions will be sent 48 hours before arrival
      - Free cancellation up to 48 hours before check-in
      
      If you have any questions about the payment, please contact us immediately.
      
      Best regards,
      The Habitat Lobby Team
      
      Habitat Lobby | Trikala, Greece
      For support, contact us at admin@habitatlobby.com or call +30 697 769 0685
      
      Reference: ${booking.bookingId} | SEPA Code: ${booking.sepaReferenceCode}
    `;

    return { subject, html, text };
  }

  // Create SEPA payment received confirmation email content
  private createSEPAPaymentReceivedEmail(booking: SEPAPaymentReceivedData): { subject: string; html: string; text: string } {
    const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-GB');
    const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-GB');
    const paymentDate = new Date(booking.paymentDate).toLocaleDateString('en-GB');
    const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24));

    const subject = `Payment Received - Booking Confirmed! ${booking.propertyName} | Habitat Lobby`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Received - Booking Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px 20px; background: #ffffff; }
          .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; border-radius: 0 0 8px 8px; }
          .button { background: #D4A574; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          .highlight { background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #28a745; }
          .payment-confirmation { background: #d4edda; padding: 20px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #28a745; }
          .code { background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; font-weight: bold; color: #28a745; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Payment Received!</h1>
            <p>Your booking is now confirmed</p>
          </div>
          
          <div class="content">
            <p>Dear ${booking.guestName},</p>
            
            <p>Great news! We have received your SEPA bank transfer payment and your booking is now <strong>confirmed</strong>.</p>
            
            <div class="payment-confirmation">
              <h3 style="margin-top: 0; color: #28a745;">💳 Payment Confirmation</h3>
              <div class="detail-row">
                <span><strong>Payment Date:</strong></span>
                <span>${paymentDate}</span>
              </div>
              <div class="detail-row">
                <span><strong>Amount Paid:</strong></span>
                <span><strong>€${booking.amount.toFixed(2)}</strong></span>
              </div>
              <div class="detail-row">
                <span><strong>SEPA Reference:</strong></span>
                <span class="code">${booking.sepaReferenceCode}</span>
              </div>
              <div class="detail-row">
                <span><strong>Booking Status:</strong></span>
                <span style="color: #28a745; font-weight: bold;">✅ Confirmed</span>
              </div>
            </div>
            
            <div class="booking-details">
              <h3 style="margin-top: 0; color: #2D5A27;">Booking Reference: ${booking.bookingId}</h3>
              <div class="detail-row">
                <span><strong>Property:</strong></span>
                <span>${booking.propertyName}</span>
              </div>
              <div class="detail-row">
                <span><strong>Check-in:</strong></span>
                <span>${checkInDate} (15:00)</span>
              </div>
              <div class="detail-row">
                <span><strong>Check-out:</strong></span>
                <span>${checkOutDate} (11:00)</span>
              </div>
              <div class="detail-row">
                <span><strong>Duration:</strong></span>
                <span>${nights} night${nights > 1 ? 's' : ''}</span>
              </div>
              <div class="detail-row">
                <span><strong>Guests:</strong></span>
                <span>${booking.guests}</span>
              </div>
              <div class="detail-row">
                <span><strong>Total Amount:</strong></span>
                <span><strong>€${booking.totalAmount.toFixed(2)}</strong></span>
              </div>
            </div>
            
            ${booking.specialRequests ? `
            <div class="booking-details">
              <h4 style="margin-top: 0; color: #2D5A27;">Special Requests:</h4>
              <p style="margin-bottom: 0;">${booking.specialRequests}</p>
            </div>
            ` : ''}
            
            <div class="highlight">
              <h3 style="margin-top: 0;">📋 What's Next?</h3>
              <ul style="margin-bottom: 0;">
                <li>You'll receive check-in instructions 48 hours before arrival</li>
                <li>Free cancellation up to 48 hours before check-in</li>
                <li>Our local team is available 24/7 for assistance</li>
                <li>Please bring the same ID document used during booking</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://habitatlobby.com/view-booking/${booking.bookingId}" class="button">
                View Booking Details
              </a>
            </div>
            
            <p>We look forward to hosting you in beautiful Trikala!</p>
            
            <p>Best regards,<br>
            <strong>The Habitat Lobby Team</strong></p>
          </div>
          
          <div class="footer">
            <p><strong>Habitat Lobby</strong> | Trikala, Greece</p>
            <p>For support, contact us at <a href="mailto:admin@habitatlobby.com">admin@habitatlobby.com</a> or call +30 697 769 0685</p>
            <p style="font-size: 12px; color: #999; margin-top: 15px;">
              Reference: ${booking.bookingId} | SEPA Code: ${booking.sepaReferenceCode}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Payment Received - Booking Confirmed! Habitat Lobby
      
      Dear ${booking.guestName},
      
      Great news! We have received your SEPA bank transfer payment and your booking is now confirmed.
      
      PAYMENT CONFIRMATION:
      Payment Date: ${paymentDate}
      Amount Paid: €${booking.amount.toFixed(2)}
      SEPA Reference: ${booking.sepaReferenceCode}
      Booking Status: ✅ Confirmed
      
      Booking Reference: ${booking.bookingId}
      Property: ${booking.propertyName}
      Check-in: ${checkInDate} (15:00)
      Check-out: ${checkOutDate} (11:00)
      Duration: ${nights} night${nights > 1 ? 's' : ''}
      Guests: ${booking.guests}
      Total Amount: €${booking.totalAmount.toFixed(2)}
      
      ${booking.specialRequests ? `Special Requests: ${booking.specialRequests}\n\n` : ''}
      
      What's Next?
      - You'll receive check-in instructions 48 hours before arrival
      - Free cancellation up to 48 hours before check-in
      - Our local team is available 24/7 for assistance
      - Please bring the same ID document used during booking
      
      View your booking: https://habitatlobby.com/view-booking/${booking.bookingId}
      
      We look forward to hosting you in beautiful Trikala!
      
      Best regards,
      The Habitat Lobby Team
      
      Habitat Lobby | Trikala, Greece
      For support, contact us at admin@habitatlobby.com or call +30 697 769 0685
      
      Reference: ${booking.bookingId} | SEPA Code: ${booking.sepaReferenceCode}
    `;

    return { subject, html, text };
  }

  // Send booking confirmation email
  async sendBookingConfirmation(bookingData: BookingEmailData): Promise<boolean> {
    try {
      const emailContent = this.createBookingConfirmationEmail(bookingData);
      
      console.log('📧 Sending booking confirmation email to:', bookingData.guestEmail);
      console.log('📧 Email subject:', emailContent.subject);
      
      // Send email via Vercel API backend (consolidated endpoint)
      const response = await fetch(`${this.API_BASE_URL}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_EMAIL_API_KEY || ''
        },
        body: JSON.stringify({
          action: 'booking-confirmation',
          bookingId: bookingData.bookingId
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Email API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('✅ Email sent successfully via API:', result);
      
      console.log('✅ Booking confirmation email sent successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send booking confirmation email:', error);
      return false;
    }
  }

  // Send booking confirmation for a booking ID
  async sendBookingConfirmationById(bookingId: string): Promise<boolean> {
    try {
      // Get booking details from database
      const bookings = await supabaseHelpers.getAllBookings(1, 0, { booking_id: bookingId });
      
      if (!bookings.bookings || bookings.bookings.length === 0) {
        console.error('Booking not found:', bookingId);
        return false;
      }

      const booking = bookings.bookings[0];
      
      const emailData: BookingEmailData = {
        bookingId: booking.id,
        guestName: booking.customer_name,
        guestEmail: booking.customer_email,
        propertyName: booking.properties?.name || 'Property',
        checkIn: booking.check_in,
        checkOut: booking.check_out,
        guests: booking.guests,
        totalAmount: booking.total_amount,
        currency: booking.currency || 'EUR',
        specialRequests: booking.special_requests
      };

      return await this.sendBookingConfirmation(emailData);
      
    } catch (error) {
      console.error('Failed to send booking confirmation by ID:', error);
      return false;
    }
  }

  // Send SEPA payment instructions email
  async sendSEPAPaymentInstructions(bookingData: SEPAPaymentEmailData): Promise<boolean> {
    try {
      const emailContent = this.createSEPAPaymentInstructionsEmail(bookingData);
      
      console.log('📧 Sending SEPA payment instructions email to:', bookingData.guestEmail);
      console.log('📧 Email subject:', emailContent.subject);
      
      // Send email via Vercel API backend (consolidated endpoint)
      const response = await fetch(`${this.API_BASE_URL}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_EMAIL_API_KEY || ''
        },
        body: JSON.stringify({
          action: 'sepa-payment-instructions',
          bookingId: bookingData.bookingId,
          sepaReferenceCode: bookingData.sepaReferenceCode
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Email API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('✅ SEPA payment instructions email sent successfully via API:', result);
      
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send SEPA payment instructions email:', error);
      return false;
    }
  }

  // Send SEPA payment received confirmation email
  async sendSEPAPaymentReceived(bookingData: SEPAPaymentReceivedData): Promise<boolean> {
    try {
      const emailContent = this.createSEPAPaymentReceivedEmail(bookingData);
      
      console.log('📧 Sending SEPA payment received email to:', bookingData.guestEmail);
      console.log('📧 Email subject:', emailContent.subject);
      
      // Send email via Vercel API backend (consolidated endpoint)
      const response = await fetch(`${this.API_BASE_URL}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_EMAIL_API_KEY || ''
        },
        body: JSON.stringify({
          action: 'sepa-payment-received',
          bookingId: bookingData.bookingId,
          sepaReferenceCode: bookingData.sepaReferenceCode
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Email API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('✅ SEPA payment received email sent successfully via API:', result);
      
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send SEPA payment received email:', error);
      return false;
    }
  }
}

// Export singleton instance
export const bookingEmailService = new BookingEmailService();
