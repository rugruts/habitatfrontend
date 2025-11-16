import { bookingEmailService } from '@/lib/booking-email-service';
import { emailAutomationService } from './EmailAutomationService';

export interface EmailAttempt {
  id: string;
  bookingId: string;
  emailType: 'booking_confirmation' | 'payment_receipt' | 'pre_arrival' | 'post_checkout';
  recipientEmail: string;
  recipientName: string;
  attempts: number;
  maxAttempts: number;
  status: 'pending' | 'sent' | 'failed' | 'exhausted';
  lastAttemptAt: string;
  nextRetryAt?: string;
  errors: string[];
  metadata?: Record<string, unknown>;
}

export class EmailFallbackService {
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAYS = [5 * 60 * 1000, 30 * 60 * 1000, 2 * 60 * 60 * 1000]; // 5min, 30min, 2h

  // Main email sending with fallback chain
  async sendEmailWithFallback(
    bookingId: string,
    emailType: 'booking_confirmation' | 'payment_receipt' | 'pre_arrival' | 'post_checkout',
    emailData: {
      recipientEmail: string;
      recipientName?: string;
      bookingData?: Record<string, unknown>;
    }
  ): Promise<{ success: boolean; method: string; error?: string }> {
    const { recipientEmail, recipientName, bookingData } = emailData;

    console.log(`📧 Attempting to send ${emailType} email for booking ${bookingId}`);

    // Method 1: Try Email Automation Service
    try {
      if (emailType === 'booking_confirmation' && bookingData) {
        console.log('📧 Trying email automation service...');
        await emailAutomationService.processAutomationTrigger({
          booking_id: bookingId,
          guest_email: recipientEmail,
          guest_name: recipientName || 'Guest',
          property_name: bookingData.propertyName || 'Property',
          check_in: bookingData.checkIn || '',
          check_out: bookingData.checkOut || '',
          guest_count: bookingData.guests || 1,
          total_amount: bookingData.totalAmount || 0,
          booking_status: 'confirmed',
          property_id: bookingData.propertyId || ''
        });
        
        console.log('✅ Email automation service succeeded');
        return { success: true, method: 'automation' };
      }
    } catch (automationError) {
      console.warn('⚠️ Email automation service failed:', automationError);
    }

    // Method 2: Try Direct Booking Email Service
    try {
      console.log('📧 Trying direct booking email service...');
      const success = await bookingEmailService.sendBookingConfirmationById(bookingId);
      
      if (success) {
        console.log('✅ Direct booking email service succeeded');
        return { success: true, method: 'direct' };
      }
    } catch (directError) {
      console.warn('⚠️ Direct booking email service failed:', directError);
    }

    // Method 3: Queue for retry
    console.log('📧 All immediate methods failed, queuing for retry...');
    await this.queueEmailForRetry(bookingId, emailType, emailData);
    
    return { 
      success: false, 
      method: 'queued_for_retry',
      error: 'Email queued for retry due to service failures'
    };
  }

  // Queue email for retry attempts
  private async queueEmailForRetry(
    bookingId: string,
    emailType: 'booking_confirmation' | 'payment_receipt' | 'pre_arrival' | 'post_checkout',
    emailData: {
      recipientEmail: string;
      recipientName?: string;
      bookingData?: Record<string, unknown>;
    }
  ): Promise<void> {
    const emailAttempt: EmailAttempt = {
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      bookingId,
      emailType,
      recipientEmail: emailData.recipientEmail,
      recipientName: emailData.recipientName || 'Guest',
      attempts: 0,
      maxAttempts: this.MAX_RETRY_ATTEMPTS,
      status: 'pending',
      lastAttemptAt: new Date().toISOString(),
      nextRetryAt: new Date(Date.now() + this.RETRY_DELAYS[0]).toISOString(),
      errors: [],
      metadata: emailData.bookingData
    };

    // Store in localStorage for now (in production, use a proper queue system)
    const existingQueue = this.getEmailQueue();
    existingQueue.push(emailAttempt);
    localStorage.setItem('email_retry_queue', JSON.stringify(existingQueue));

    console.log('📧 Email queued for retry:', emailAttempt.id);
  }

  // Process retry queue
  async processRetryQueue(): Promise<void> {
    const queue = this.getEmailQueue();
    const now = new Date();

    for (const emailAttempt of queue) {
      if (
        emailAttempt.status === 'pending' &&
        emailAttempt.nextRetryAt &&
        new Date(emailAttempt.nextRetryAt) <= now &&
        emailAttempt.attempts < emailAttempt.maxAttempts
      ) {
        await this.retryEmail(emailAttempt);
      }
    }
  }

  // Retry individual email
  private async retryEmail(emailAttempt: EmailAttempt): Promise<void> {
    console.log(`📧 Retrying email attempt ${emailAttempt.attempts + 1}/${emailAttempt.maxAttempts} for ${emailAttempt.id}`);

    emailAttempt.attempts++;
    emailAttempt.lastAttemptAt = new Date().toISOString();

    try {
      // Try direct booking email service for retry
      const success = await bookingEmailService.sendBookingConfirmationById(emailAttempt.bookingId);

      if (success) {
        emailAttempt.status = 'sent';
        console.log('✅ Email retry succeeded:', emailAttempt.id);
      } else {
        throw new Error('Booking email service returned false');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      emailAttempt.errors.push(`Attempt ${emailAttempt.attempts}: ${errorMessage}`);

      if (emailAttempt.attempts >= emailAttempt.maxAttempts) {
        emailAttempt.status = 'exhausted';
        console.error('❌ Email retry exhausted:', emailAttempt.id);
        
        // Send notification to admin about failed email
        this.notifyAdminOfEmailFailure(emailAttempt);
      } else {
        // Schedule next retry
        const nextDelay = this.RETRY_DELAYS[emailAttempt.attempts - 1] || this.RETRY_DELAYS[this.RETRY_DELAYS.length - 1];
        emailAttempt.nextRetryAt = new Date(Date.now() + nextDelay).toISOString();
        console.log(`📧 Email retry scheduled for ${emailAttempt.nextRetryAt}:`, emailAttempt.id);
      }
    }

    // Update queue
    this.updateEmailInQueue(emailAttempt);
  }

  // Get email retry queue from storage
  private getEmailQueue(): EmailAttempt[] {
    try {
      const queueData = localStorage.getItem('email_retry_queue');
      return queueData ? JSON.parse(queueData) : [];
    } catch (error) {
      console.error('Error reading email queue:', error);
      return [];
    }
  }

  // Update email attempt in queue
  private updateEmailInQueue(emailAttempt: EmailAttempt): void {
    const queue = this.getEmailQueue();
    const index = queue.findIndex(item => item.id === emailAttempt.id);
    
    if (index !== -1) {
      queue[index] = emailAttempt;
      localStorage.setItem('email_retry_queue', JSON.stringify(queue));
    }
  }

  // Notify admin of email failure
  private notifyAdminOfEmailFailure(emailAttempt: EmailAttempt): void {
    console.error('💥 Email delivery failed after all retries:', {
      emailId: emailAttempt.id,
      bookingId: emailAttempt.bookingId,
      emailType: emailAttempt.emailType,
      recipientEmail: emailAttempt.recipientEmail,
      errors: emailAttempt.errors
    });

    // In production, send this to a monitoring service or admin notification system
    // Example: Sentry, Slack webhook, admin dashboard notification, etc.
  }

  // Get queue statistics
  getQueueStats(): {
    total: number;
    pending: number;
    sent: number;
    failed: number;
    exhausted: number;
  } {
    const queue = this.getEmailQueue();
    
    return {
      total: queue.length,
      pending: queue.filter(item => item.status === 'pending').length,
      sent: queue.filter(item => item.status === 'sent').length,
      failed: queue.filter(item => item.status === 'failed').length,
      exhausted: queue.filter(item => item.status === 'exhausted').length
    };
  }

  // Clear old completed emails from queue
  cleanupQueue(olderThanDays: number = 7): void {
    const queue = this.getEmailQueue();
    const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    
    const cleanedQueue = queue.filter(item => {
      if (item.status === 'sent' || item.status === 'exhausted') {
        return new Date(item.lastAttemptAt) > cutoffDate;
      }
      return true; // Keep pending items
    });

    localStorage.setItem('email_retry_queue', JSON.stringify(cleanedQueue));
    console.log(`📧 Cleaned up ${queue.length - cleanedQueue.length} old email attempts`);
  }
}

export const emailFallbackService = new EmailFallbackService();

// Auto-process retry queue every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    emailFallbackService.processRetryQueue().catch(error => {
      console.error('Error processing email retry queue:', error);
    });
  }, 5 * 60 * 1000); // 5 minutes

  // Cleanup old emails daily
  setInterval(() => {
    emailFallbackService.cleanupQueue();
  }, 24 * 60 * 60 * 1000); // 24 hours
}


