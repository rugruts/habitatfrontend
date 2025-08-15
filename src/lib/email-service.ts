import { supabaseHelpers } from './supabase';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  template_type: string;
  variables: string[];
}

export interface EmailData {
  to: string;
  toName?: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  templateId?: string;
  bookingId?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface BookingData {
  id: string;
  customer_name: string;
  customer_email: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_amount: number;
  properties?: {
    name?: string;
    address?: string;
  };
}

export class EmailService {
  private fromEmail: string;
  private fromName: string;
  private apiUrl: string;
  private apiKey: string;

  constructor(fromEmail: string = 'noreply@habitatlobby.com', fromName: string = 'Habitat Lobby') {
    this.fromEmail = fromEmail;
    this.fromName = fromName;
    this.apiUrl = import.meta.env.VITE_EMAIL_API_URL || 'http://localhost:3001/api/email';
    this.apiKey = import.meta.env.VITE_EMAIL_API_KEY || 'habitat_lobby_secure_api_key_2024';
  }

  // Send email using Supabase built-in email system
  async sendEmail(emailData: EmailData): Promise<EmailResult> {
    try {
      // Log email attempt
      const logEntry = await supabaseHelpers.createEmailLog({
        template_id: emailData.templateId,
        booking_id: emailData.bookingId,
        recipient_email: emailData.to,
        recipient_name: emailData.toName,
        subject: emailData.subject,
        content: emailData.htmlBody,
        status: 'scheduled',
        metadata: emailData.metadata
      });

      // Send email using backend API
      console.log('Sending email via backend API:', {
        to: emailData.to,
        subject: emailData.subject,
        from: `${this.fromName} <${this.fromEmail}>`
      });

      try {
        const response = await fetch(`${this.apiUrl}/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey
          },
          body: JSON.stringify({
            to: emailData.to,
            toName: emailData.toName,
            subject: emailData.subject,
            htmlBody: emailData.htmlBody,
            textBody: emailData.textBody,
            metadata: emailData.metadata
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const result = await response.json();
        const messageId = result.messageId;

        console.log('Email sent successfully via backend:', {
          messageId,
          to: emailData.to,
          subject: emailData.subject
        });

        // Update log with success
        await supabaseHelpers.updateEmailLogStatus(logEntry.id, 'sent', {
          messageId: messageId,
          service: 'backend_api',
          response: result.response
        });

        return {
          success: true,
          messageId: messageId
        };

      } catch (apiError) {
        console.error('Backend API error:', apiError);

        // Update log with failure
        await supabaseHelpers.updateEmailLogStatus(logEntry.id, 'failed', {
          error: apiError instanceof Error ? apiError.message : 'API call failed'
        });

        throw apiError;
      }

    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Send email using template
  async sendTemplateEmail(
    templateId: string,
    to: string,
    toName: string,
    variables: Record<string, string> = {},
    bookingId?: string
  ): Promise<EmailResult> {
    try {
      // Get template from database
      const templates = await supabaseHelpers.getAllEmailTemplates();
      const template = templates.find(t => t.id === templateId);

      if (!template) {
        return {
          success: false,
          error: 'Template not found'
        };
      }

      // Replace variables in subject and content
      const subject = this.replaceVariables(template.subject, variables);
      const content = this.replaceVariables(template.content, variables);

      // Convert plain text to HTML if needed
      const htmlBody = this.textToHtml(content);

      return await this.sendEmail({
        to,
        toName,
        subject,
        htmlBody,
        templateId,
        bookingId,
        metadata: {
          template_type: template.template_type,
          variables: JSON.stringify(variables)
        }
      });

    } catch (error) {
      console.error('Error sending template email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send template email'
      };
    }
  }

  // Send booking confirmation email
  async sendBookingConfirmation(bookingId: string): Promise<EmailResult> {
    try {
      // Get booking details from database
      const booking = await supabaseHelpers.getBookingById(bookingId);
      if (!booking) {
        return { success: false, error: 'Booking not found' };
      }

      console.log('Sending booking confirmation via backend API:', {
        bookingId,
        customerEmail: booking.customer_email,
        customerName: booking.customer_name
      });

      // Log email attempt in database first
      const logEntry = await supabaseHelpers.createEmailLog({
        booking_id: bookingId,
        recipient_email: booking.customer_email,
        recipient_name: booking.customer_name,
        subject: `Booking Confirmed - ${booking.id.slice(-8).toUpperCase()} | Habitat Lobby`,
        content: 'Booking confirmation email',
        status: 'scheduled',
        metadata: { type: 'booking_confirmation' }
      });

      // Call backend booking confirmation endpoint
      const response = await fetch(`${this.apiUrl}/send-booking-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify({
          booking: booking
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || `HTTP ${response.status}`;

        // Update log with failure
        await supabaseHelpers.updateEmailLogStatus(logEntry.id, 'failed', {
          error: errorMessage
        });

        throw new Error(errorMessage);
      }

      const result = await response.json();

      console.log('Booking confirmation email sent successfully:', {
        messageId: result.messageId,
        to: result.to,
        subject: result.subject
      });

      // Update log with success
      await supabaseHelpers.updateEmailLogStatus(logEntry.id, 'sent', {
        messageId: result.messageId,
        service: 'backend_api'
      });

      return {
        success: true,
        messageId: result.messageId
      };

    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send booking confirmation'
      };
    }
  }

  // Create booking confirmation HTML
  private createBookingConfirmationHTML(booking: BookingData): string {
    const checkInDate = new Date(booking.check_in).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const checkOutDate = new Date(booking.check_out).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed</h1>
            <p>Thank you for choosing Habitat Lobby</p>
          </div>

          <div class="content">
            <p>Dear ${booking.customer_name},</p>
            <p>Your booking has been confirmed! We're excited to welcome you to ${booking.properties?.name || 'our property'}.</p>

            <div class="booking-details">
              <h3>Booking Details</h3>
              <div class="detail-row">
                <strong>Booking ID:</strong>
                <span>${booking.id.slice(-8).toUpperCase()}</span>
              </div>
              <div class="detail-row">
                <strong>Property:</strong>
                <span>${booking.properties?.name || 'Property'}</span>
              </div>
              <div class="detail-row">
                <strong>Check-in:</strong>
                <span>${checkInDate} at 15:00</span>
              </div>
              <div class="detail-row">
                <strong>Check-out:</strong>
                <span>${checkOutDate} at 11:00</span>
              </div>
              <div class="detail-row">
                <strong>Guests:</strong>
                <span>${booking.guests}</span>
              </div>
              <div class="detail-row">
                <strong>Total Amount:</strong>
                <span>€${booking.total_amount.toFixed(2)}</span>
              </div>
            </div>

            <h3>What's Next?</h3>
            <ul>
              <li>Confirmation email sent (this email)</li>
              <li>Check-in instructions will be sent 24 hours before arrival</li>
              <li>Access codes will be provided 2 hours before check-in</li>
              <li>Our team is available 24/7 during your stay</li>
            </ul>

            <p>If you have any questions, please don't hesitate to contact us:</p>
            <p>Email: hello@habitatlobby.com<br>
               Phone: +30 243 123 4567</p>
          </div>

          <div class="footer">
            <p>Thank you for choosing Habitat Lobby!</p>
            <p>We look forward to hosting you.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Send pre-arrival instructions
  async sendPreArrivalInstructions(bookingId: string): Promise<EmailResult> {
    try {
      const booking = await supabaseHelpers.getBookingById(bookingId);
      if (!booking) {
        return { success: false, error: 'Booking not found' };
      }

      const variables = {
        guest_name: booking.customer_name,
        property_name: booking.properties?.name || 'Property',
        check_in_time: '15:00',
        property_address: booking.properties?.address || 'Address not available',
        host_phone: '+30 243 123 4567',
        host_name: 'Stefanos'
      };

      const templates = await supabaseHelpers.getAllEmailTemplates();
      const template = templates.find(t => t.template_type === 'pre_arrival' && t.is_active);

      if (!template) {
        return { success: false, error: 'Pre-arrival template not found' };
      }

      return await this.sendTemplateEmail(
        template.id,
        booking.customer_email,
        booking.customer_name,
        variables,
        bookingId
      );

    } catch (error) {
      console.error('Error sending pre-arrival instructions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send pre-arrival instructions'
      };
    }
  }

  // Send ID verification reminder
  async sendIDVerificationReminder(bookingId: string): Promise<EmailResult> {
    try {
      const booking = await supabaseHelpers.getBookingById(bookingId);
      if (!booking) {
        return { success: false, error: 'Booking not found' };
      }

      const variables = {
        guest_name: booking.customer_name,
        property_name: booking.properties?.name || 'Property'
      };

      const templates = await supabaseHelpers.getAllEmailTemplates();
      const template = templates.find(t => t.template_type === 'id_reminder' && t.is_active);

      if (!template) {
        return { success: false, error: 'ID reminder template not found' };
      }

      return await this.sendTemplateEmail(
        template.id,
        booking.customer_email,
        booking.customer_name,
        variables,
        bookingId
      );

    } catch (error) {
      console.error('Error sending ID verification reminder:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send ID verification reminder'
      };
    }
  }

  // Send post-stay thank you
  async sendPostStayThankYou(bookingId: string): Promise<EmailResult> {
    try {
      const booking = await supabaseHelpers.getBookingById(bookingId);
      if (!booking) {
        return { success: false, error: 'Booking not found' };
      }

      const variables = {
        guest_name: booking.customer_name,
        property_name: booking.properties?.name || 'Property'
      };

      const templates = await supabaseHelpers.getAllEmailTemplates();
      const template = templates.find(t => t.template_type === 'post_stay' && t.is_active);

      if (!template) {
        return { success: false, error: 'Post-stay template not found' };
      }

      return await this.sendTemplateEmail(
        template.id,
        booking.customer_email,
        booking.customer_name,
        variables,
        bookingId
      );

    } catch (error) {
      console.error('Error sending post-stay thank you:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send post-stay thank you'
      };
    }
  }

  // Helper methods

  private replaceVariables(text: string, variables: Record<string, string>): string {
    let result = text;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    }
    return result;
  }

  private textToHtml(text: string): string {
    return text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }

  // Convert HTML to plain text
  private htmlToText(html: string): string {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Replace HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }

  // Test email service connectivity
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Testing backend API connection...');

      const response = await fetch(`${this.apiUrl}/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}`
        };
      }

      const result = await response.json();
      console.log('Backend API connection verified successfully');

      return {
        success: true
      };

    } catch (error) {
      console.error('Backend API connection test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Backend API connection test failed'
      };
    }
  }
}

// Create default instance using SMTP email system
export const emailService = new EmailService(
  import.meta.env.VITE_CONTACT_EMAIL || 'info@habitat-lobby.com',
  'Habitat Lobby'
);

export default EmailService;
