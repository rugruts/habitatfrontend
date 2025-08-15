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
            <p>For support, contact us at <a href="mailto:hello@habitatlobby.com">hello@habitatlobby.com</a></p>
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
      For support, contact us at hello@habitatlobby.com
    `;

    return { subject, html, text };
  }

  // Send booking confirmation email
  async sendBookingConfirmation(bookingData: BookingEmailData): Promise<boolean> {
    try {
      const emailContent = this.createBookingConfirmationEmail(bookingData);
      
      console.log('📧 Sending booking confirmation email to:', bookingData.guestEmail);
      console.log('📧 Email subject:', emailContent.subject);
      
      // Send email via Vercel API backend
      const response = await fetch(`${this.API_BASE_URL}/booking-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_EMAIL_API_KEY || ''
        },
        body: JSON.stringify({
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
}

// Export singleton instance
export const bookingEmailService = new BookingEmailService();
