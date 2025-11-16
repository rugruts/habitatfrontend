import { supabaseHelpers } from './supabase';
import { emailService } from './email-service';

export interface AutomationTrigger {
  type: 'booking_created' | 'check_in_approaching' | 'id_missing' | 'check_out_completed';
  bookingId: string;
  delayHours?: number;
  metadata?: Record<string, unknown>;
}

export class EmailAutomationScheduler {
  // Trigger automation based on booking events
  async triggerAutomation(trigger: AutomationTrigger): Promise<void> {
    try {
      console.log(`Triggering email automation: ${trigger.type} for booking ${trigger.bookingId}`);

      // Get active automations for this trigger type
      const automations = await this.getActiveAutomations(trigger.type);

      if (automations.length === 0) {
        console.log(`No active automations found for trigger: ${trigger.type}`);
        return;
      }

      // Process each automation
      for (const automation of automations) {
        await this.processAutomation(automation, trigger);
      }

    } catch (error) {
      console.error('Error triggering automation:', error);
    }
  }

  // Get active automations for a trigger type
  private async getActiveAutomations(triggerType: string): Promise<{
    id: string;
    name: string;
    template_id: string;
    trigger_type: string;
    trigger_delay_hours: number;
    is_active: boolean;
  }[]> {
    try {
      // This would be implemented in supabaseHelpers
      // For now, return mock data based on trigger type
      const mockAutomations = [
        {
          id: '1',
          name: 'Send Booking Confirmation',
          template_id: 'template_1',
          trigger_type: 'booking_created',
          trigger_delay_hours: 0,
          is_active: true
        },
        {
          id: '2',
          name: 'Pre-Arrival Instructions',
          template_id: 'template_2',
          trigger_type: 'check_in_approaching',
          trigger_delay_hours: 48,
          is_active: true
        },
        {
          id: '3',
          name: 'ID Verification Reminder',
          template_id: 'template_3',
          trigger_type: 'id_missing',
          trigger_delay_hours: 72,
          is_active: true
        },
        {
          id: '4',
          name: 'Post-Stay Thank You',
          template_id: 'template_4',
          trigger_type: 'check_out_completed',
          trigger_delay_hours: 24,
          is_active: true
        }
      ];

      return mockAutomations.filter(a => a.trigger_type === triggerType && a.is_active);

    } catch (error) {
      console.error('Error getting active automations:', error);
      return [];
    }
  }

  // Process individual automation
  private async processAutomation(automation: {
    id: string;
    name: string;
    template_id: string;
    trigger_type: string;
    trigger_delay_hours: number;
    is_active: boolean;
  }, trigger: AutomationTrigger): Promise<void> {
    try {
      const delayHours = trigger.delayHours ?? automation.trigger_delay_hours;

      if (delayHours === 0) {
        // Send immediately
        await this.sendAutomationEmail(automation, trigger.bookingId);
      } else {
        // Schedule for later
        await this.scheduleAutomationEmail(automation, trigger.bookingId, delayHours);
      }

    } catch (error) {
      console.error('Error processing automation:', error);
    }
  }

  // Send automation email immediately
  private async sendAutomationEmail(automation: {
    id: string;
    name: string;
    template_id: string;
    trigger_type: string;
    trigger_delay_hours: number;
    is_active: boolean;
  }, bookingId: string): Promise<void> {
    try {
      let result;

      switch (automation.trigger_type) {
        case 'booking_created':
          result = await emailService.sendBookingConfirmation(bookingId);
          break;

        case 'check_in_approaching':
          result = await emailService.sendPreArrivalInstructions(bookingId);
          break;

        case 'id_missing':
          result = await emailService.sendIDVerificationReminder(bookingId);
          break;

        case 'check_out_completed':
          result = await emailService.sendPostStayThankYou(bookingId);
          break;

        default:
          console.log(`Unknown automation trigger type: ${automation.trigger_type}`);
          return;
      }

      if (result.success) {
        console.log(`Automation email sent successfully: ${automation.name}`);
      } else {
        console.error(`Automation email failed: ${automation.name} - ${result.error}`);
      }

    } catch (error) {
      console.error('Error sending automation email:', error);
    }
  }

  // Schedule automation email for later
  private async scheduleAutomationEmail(automation: {
    id: string;
    name: string;
    template_id: string;
    trigger_type: string;
    trigger_delay_hours: number;
    is_active: boolean;
  }, bookingId: string, delayHours: number): Promise<void> {
    try {
      const scheduledFor = new Date();
      scheduledFor.setHours(scheduledFor.getHours() + delayHours);

      // Get booking details for email log
      const booking = await supabaseHelpers.getBookingById(bookingId);
      if (!booking) {
        console.error('Booking not found for scheduling:', bookingId);
        return;
      }

      // Get template details
      const templates = await supabaseHelpers.getAllEmailTemplates();
      const template = templates.find(t => t.id === automation.template_id);
      if (!template) {
        console.error('Template not found for automation:', automation.template_id);
        return;
      }

      // Create scheduled email log entry
      await supabaseHelpers.createEmailLog({
        template_id: automation.template_id,
        booking_id: bookingId,
        recipient_email: booking.customer_email,
        recipient_name: booking.customer_name,
        subject: template.subject,
        content: template.content,
        status: 'scheduled',
        scheduled_for: scheduledFor.toISOString(),
        metadata: {
          automation_id: automation.id,
          automation_name: automation.name,
          trigger_type: automation.trigger_type
        }
      });

      console.log(`Email scheduled for ${scheduledFor.toISOString()}: ${automation.name}`);

    } catch (error) {
      console.error('Error scheduling automation email:', error);
    }
  }

  // Process scheduled emails (this would be called by a cron job)
  async processScheduledEmails(): Promise<void> {
    try {
      console.log('Processing scheduled emails...');

      // Get emails scheduled for now or earlier
      const { logs } = await supabaseHelpers.getEmailLogs(100, 0, {
        status: 'scheduled'
      });

      const now = new Date();
      const dueEmails = logs.filter(log => 
        log.scheduled_for && new Date(log.scheduled_for) <= now
      );

      console.log(`Found ${dueEmails.length} emails due for sending`);

      for (const emailLog of dueEmails) {
        await this.processDueEmail(emailLog);
      }

    } catch (error) {
      console.error('Error processing scheduled emails:', error);
    }
  }

  // Process a single due email
  private async processDueEmail(emailLog: {
    id: string;
    booking_id: string;
    recipient_email: string;
    recipient_name: string;
    subject: string;
    content: string;
    template_id: string;
    metadata?: {
      trigger_type?: string;
      automation_name?: string;
    };
  }): Promise<void> {
    try {
      // Update status to prevent duplicate processing
      await supabaseHelpers.updateEmailLogStatus(emailLog.id, 'sent');

      // Send the email based on template type
      if (emailLog.metadata?.trigger_type) {
        const automation = {
          trigger_type: emailLog.metadata.trigger_type,
          name: emailLog.metadata.automation_name
        };

        await this.sendAutomationEmail(automation, emailLog.booking_id);
      } else {
        // Send generic template email
        const result = await emailService.sendEmail({
          to: emailLog.recipient_email,
          toName: emailLog.recipient_name,
          subject: emailLog.subject,
          htmlBody: emailLog.content,
          templateId: emailLog.template_id,
          bookingId: emailLog.booking_id
        });

        if (!result.success) {
          await supabaseHelpers.updateEmailLogStatus(emailLog.id, 'failed', {
            error: result.error
          });
        }
      }

    } catch (error) {
      console.error('Error processing due email:', error);
      
      // Mark as failed
      await supabaseHelpers.updateEmailLogStatus(emailLog.id, 'failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Trigger booking-related automations
  async onBookingCreated(bookingId: string): Promise<void> {
    await this.triggerAutomation({
      type: 'booking_created',
      bookingId
    });
  }

  async onCheckInApproaching(bookingId: string, hoursUntilCheckIn: number = 48): Promise<void> {
    await this.triggerAutomation({
      type: 'check_in_approaching',
      bookingId,
      delayHours: Math.max(0, hoursUntilCheckIn - 48) // Send 48 hours before check-in
    });
  }

  async onIDVerificationMissing(bookingId: string): Promise<void> {
    await this.triggerAutomation({
      type: 'id_missing',
      bookingId
    });
  }

  async onCheckOutCompleted(bookingId: string): Promise<void> {
    await this.triggerAutomation({
      type: 'check_out_completed',
      bookingId,
      delayHours: 24 // Send 24 hours after check-out
    });
  }

  // Check for missing ID verifications (run daily)
  async checkMissingIDVerifications(): Promise<void> {
    try {
      console.log('Checking for missing ID verifications...');

      // Get confirmed bookings with check-in within 7 days that don't have ID verification
      const { bookings } = await supabaseHelpers.getAllBookings(100, 0, {
        status: 'confirmed'
      });

      const now = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(now.getDate() + 7);

      const bookingsNeedingID = bookings.filter(booking => {
        const checkInDate = new Date(booking.check_in);
        return checkInDate >= now && 
               checkInDate <= sevenDaysFromNow && 
               !booking.id_verified;
      });

      console.log(`Found ${bookingsNeedingID.length} bookings needing ID verification`);

      for (const booking of bookingsNeedingID) {
        await this.onIDVerificationMissing(booking.id);
      }

    } catch (error) {
      console.error('Error checking missing ID verifications:', error);
    }
  }
}

// Export default instance
export const emailAutomation = new EmailAutomationScheduler();

export default EmailAutomationScheduler;
