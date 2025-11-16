/**
 * Booking Automation Integration Service
 * Automatically triggers email automations when booking events occur
 */

import { supabaseHelpers } from './supabase';

interface BookingEventTrigger {
  bookingId: string;
  eventType: 'booking_created' | 'booking_confirmed' | 'payment_received' | 'check_in_approaching' | 'check_out_completed';
  metadata?: Record<string, unknown>;
}

export class BookingAutomationIntegration {
  private readonly API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  private readonly API_KEY = import.meta.env.VITE_EMAIL_API_KEY || 'habitat_lobby_2024_86abfb60f093d26335ebc1f3b028f254';

  /**
   * Trigger automation when a new booking is created
   */
  async onBookingCreated(bookingId: string): Promise<boolean> {
    try {
      console.log(`🎯 Triggering booking_created automation for booking: ${bookingId}`);
      
      return await this.triggerAutomation({
        bookingId,
        eventType: 'booking_created',
        metadata: {
          triggered_at: new Date().toISOString(),
          trigger_source: 'booking_creation'
        }
      });
    } catch (error) {
      console.error('Error triggering booking_created automation:', error);
      return false;
    }
  }

  /**
   * Trigger automation when booking is confirmed (payment received)
   */
  async onBookingConfirmed(bookingId: string, paymentMethod?: string): Promise<boolean> {
    try {
      console.log(`🎯 Triggering booking_confirmed automation for booking: ${bookingId}`);
      
      return await this.triggerAutomation({
        bookingId,
        eventType: 'booking_confirmed',
        metadata: {
          triggered_at: new Date().toISOString(),
          trigger_source: 'payment_confirmation',
          payment_method: paymentMethod
        }
      });
    } catch (error) {
      console.error('Error triggering booking_confirmed automation:', error);
      return false;
    }
  }

  /**
   * Trigger automation when payment is received for SEPA/Cash bookings
   */
  async onPaymentReceived(bookingId: string, paymentMethod: string): Promise<boolean> {
    try {
      console.log(`🎯 Triggering payment_received automation for booking: ${bookingId}`);
      
      return await this.triggerAutomation({
        bookingId,
        eventType: 'payment_received',
        metadata: {
          triggered_at: new Date().toISOString(),
          trigger_source: 'payment_processing',
          payment_method: paymentMethod
        }
      });
    } catch (error) {
      console.error('Error triggering payment_received automation:', error);
      return false;
    }
  }

  /**
   * Trigger automation when check-in is approaching
   */
  async onCheckInApproaching(bookingId: string, hoursUntilCheckIn: number): Promise<boolean> {
    try {
      console.log(`🎯 Triggering check_in_approaching automation for booking: ${bookingId} (${hoursUntilCheckIn}h until check-in)`);
      
      return await this.triggerAutomation({
        bookingId,
        eventType: 'check_in_approaching',
        metadata: {
          triggered_at: new Date().toISOString(),
          trigger_source: 'scheduled_check',
          hours_until_checkin: hoursUntilCheckIn
        }
      });
    } catch (error) {
      console.error('Error triggering check_in_approaching automation:', error);
      return false;
    }
  }

  /**
   * Trigger automation when check-out is completed
   */
  async onCheckOutCompleted(bookingId: string): Promise<boolean> {
    try {
      console.log(`🎯 Triggering check_out_completed automation for booking: ${bookingId}`);
      
      return await this.triggerAutomation({
        bookingId,
        eventType: 'check_out_completed',
        metadata: {
          triggered_at: new Date().toISOString(),
          trigger_source: 'checkout_completion'
        }
      });
    } catch (error) {
      console.error('Error triggering check_out_completed automation:', error);
      return false;
    }
  }

  /**
   * Core method to trigger automation via backend API
   */
  private async triggerAutomation(trigger: BookingEventTrigger): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/email/automation-trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.API_KEY
        },
        body: JSON.stringify({
          triggerType: trigger.eventType,
          bookingId: trigger.bookingId,
          metadata: trigger.metadata
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Automation API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log(`✅ Automation triggered successfully:`, result);
      
      return result.success;
    } catch (error) {
      console.error('❌ Failed to trigger automation:', error);
      return false;
    }
  }

  /**
   * Check for approaching check-ins and trigger automations
   * This should be called by a scheduled task (daily)
   */
  async checkApproachingCheckIns(): Promise<void> {
    try {
      console.log('🔍 Checking for approaching check-ins...');

      // Get confirmed bookings with check-in within the next 72 hours
      const { bookings } = await supabaseHelpers.getAllBookings(100, 0, {
        status: 'confirmed'
      });

      const now = new Date();
      const seventyTwoHoursFromNow = new Date();
      seventyTwoHoursFromNow.setHours(now.getHours() + 72);

      const approachingBookings = bookings.filter(booking => {
        const checkInDate = new Date(booking.check_in);
        return checkInDate >= now && checkInDate <= seventyTwoHoursFromNow;
      });

      console.log(`📅 Found ${approachingBookings.length} bookings with approaching check-ins`);

      for (const booking of approachingBookings) {
        const checkInDate = new Date(booking.check_in);
        const hoursUntilCheckIn = Math.round((checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60));
        
        // Trigger automation for 48-hour and 24-hour marks
        if (hoursUntilCheckIn <= 48 && hoursUntilCheckIn > 24) {
          await this.onCheckInApproaching(booking.id, hoursUntilCheckIn);
        } else if (hoursUntilCheckIn <= 24 && hoursUntilCheckIn > 2) {
          await this.onCheckInApproaching(booking.id, hoursUntilCheckIn);
        }
      }
    } catch (error) {
      console.error('Error checking approaching check-ins:', error);
    }
  }

  /**
   * Check for completed check-outs and trigger automations
   * This should be called by a scheduled task (daily)
   */
  async checkCompletedCheckOuts(): Promise<void> {
    try {
      console.log('🔍 Checking for completed check-outs...');

      // Get confirmed bookings with check-out within the last 24 hours
      const { bookings } = await supabaseHelpers.getAllBookings(100, 0, {
        status: 'confirmed'
      });

      const now = new Date();
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(now.getHours() - 24);

      const recentlyCompletedBookings = bookings.filter(booking => {
        const checkOutDate = new Date(booking.check_out);
        return checkOutDate >= twentyFourHoursAgo && checkOutDate <= now;
      });

      console.log(`🏁 Found ${recentlyCompletedBookings.length} recently completed bookings`);

      for (const booking of recentlyCompletedBookings) {
        await this.onCheckOutCompleted(booking.id);
      }
    } catch (error) {
      console.error('Error checking completed check-outs:', error);
    }
  }

  /**
   * Process scheduled email queue
   * This should be called by a cron job every few minutes
   */
  async processScheduledEmails(): Promise<void> {
    try {
      console.log('⏰ Processing scheduled email queue...');
      
      const response = await fetch(`${this.API_BASE_URL}/api/email/process-scheduled`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.API_KEY
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Process scheduled API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log(`✅ Scheduled emails processed:`, result);
    } catch (error) {
      console.error('❌ Failed to process scheduled emails:', error);
    }
  }

  /**
   * Test automation connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔧 Testing automation system connectivity...');
      
      const response = await fetch(`${this.API_BASE_URL}/api/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.API_KEY
        },
        body: JSON.stringify({
          to: 'test@habitatlobby.com',
          subject: 'Automation Test',
          htmlBody: '<p>Test email from automation system</p>',
          metadata: { test: true }
        })
      });

      if (response.ok) {
        console.log('✅ Automation system connectivity test passed');
        return true;
      } else {
        console.error('❌ Automation system connectivity test failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Automation system connectivity test error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const bookingAutomationIntegration = new BookingAutomationIntegration();