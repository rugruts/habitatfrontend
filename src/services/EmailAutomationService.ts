import { supabase } from '../lib/supabase';
import { emailTemplateService } from './EmailTemplateService';

export interface EmailAutomation {
  id: string;
  name: string;
  template_id: string;
  trigger_type: 'booking_created' | 'check_in_approaching' | 'check_out_completed' | 'payment_reminder' | 'review_request';
  trigger_delay_hours: number;
  is_active: boolean;
  conditions?: {
    booking_status?: string[];
    property_ids?: string[];
    guest_count_min?: number;
    guest_count_max?: number;
  };
  created_at: string;
  updated_at: string;
  last_triggered_at?: string;
  total_triggered: number;
}

export interface AutomationTrigger {
  booking_id: string;
  guest_email: string;
  guest_name?: string;
  property_name: string;
  check_in: string;
  check_out: string;
  guest_count: number;
  total_amount: number;
  booking_status: string;
  property_id: string;
}

export class EmailAutomationService {
  // Get all automations
  async getAllAutomations(): Promise<EmailAutomation[]> {
    const { data, error } = await supabase
      .from('email_automations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching automations:', error);
      throw new Error(`Failed to fetch automations: ${error.message}`);
    }

    return data || [];
  }

  // Get active automations
  async getActiveAutomations(): Promise<EmailAutomation[]> {
    const { data, error } = await supabase
      .from('email_automations')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active automations:', error);
      throw new Error(`Failed to fetch active automations: ${error.message}`);
    }

    return data || [];
  }

  // Create automation
  async createAutomation(automation: Omit<EmailAutomation, 'id' | 'created_at' | 'updated_at' | 'total_triggered'>): Promise<EmailAutomation> {
    const { data, error } = await supabase
      .from('email_automations')
      .insert([automation])
      .select()
      .single();

    if (error) {
      console.error('Error creating automation:', error);
      throw new Error(`Failed to create automation: ${error.message}`);
    }

    return data;
  }

  // Update automation
  async updateAutomation(id: string, updates: Partial<EmailAutomation>): Promise<EmailAutomation> {
    const { data, error } = await supabase
      .from('email_automations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating automation:', error);
      throw new Error(`Failed to update automation: ${error.message}`);
    }

    return data;
  }

  // Delete automation
  async deleteAutomation(id: string): Promise<void> {
    const { error } = await supabase
      .from('email_automations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting automation:', error);
      throw new Error(`Failed to delete automation: ${error.message}`);
    }
  }

  // Process automation triggers
  async processAutomationTrigger(trigger: AutomationTrigger): Promise<void> {
    console.log('🔄 Processing automation trigger:', trigger);

    try {
      // Get all active automations
      const automations = await this.getActiveAutomations();

      for (const automation of automations) {
        // Check if automation should be triggered
        if (this.shouldTriggerAutomation(automation, trigger)) {
          await this.executeAutomation(automation, trigger);
        }
      }
    } catch (error) {
      console.error('❌ Error processing automation trigger:', error);
      throw error;
    }
  }

  // Check if automation should be triggered
  private shouldTriggerAutomation(automation: EmailAutomation, trigger: AutomationTrigger): boolean {
    // Check conditions
    if (automation.conditions) {
      if (automation.conditions.booking_status && 
          !automation.conditions.booking_status.includes(trigger.booking_status)) {
        return false;
      }

      if (automation.conditions.property_ids && 
          !automation.conditions.property_ids.includes(trigger.property_id)) {
        return false;
      }

      if (automation.conditions.guest_count_min && 
          trigger.guest_count < automation.conditions.guest_count_min) {
        return false;
      }

      if (automation.conditions.guest_count_max && 
          trigger.guest_count > automation.conditions.guest_count_max) {
        return false;
      }
    }

    return true;
  }

  // Execute automation
  private async executeAutomation(automation: EmailAutomation, trigger: AutomationTrigger): Promise<void> {
    try {
      console.log(`📧 Executing automation: ${automation.name}`);

      // Get the template
      const template = await emailTemplateService.getTemplateById(automation.template_id);
      if (!template) {
        console.error(`Template not found for automation: ${automation.id}`);
        return;
      }

      // Prepare variables
      const variables = {
        customer_name: trigger.guest_name || 'Guest',
        property_name: trigger.property_name,
        check_in: trigger.check_in,
        check_out: trigger.check_out,
        guests: trigger.guest_count,
        total_amount: trigger.total_amount,
        booking_id: trigger.booking_id,
        business_name: 'Habitat Lobby',
        business_email: 'admin@habitatlobby.com',
        business_phone: '+30 697 769 0685',
        business_address: 'Alexandras 59, Trikala 42100, Greece',
        review_url: `${window.location.origin}/review/${trigger.booking_id}`,
        booking_url: `${window.location.origin}/booking/${trigger.booking_id}`,
        property_url: `${window.location.origin}/apartment/${trigger.property_id}`
      };

      // Process template
      const processedSubject = emailTemplateService.processTemplate(template.subject, variables);
      const processedContent = emailTemplateService.processTemplate(template.content, variables);

      // Send email via backend API
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_EMAIL_API_KEY || ''
        },
        body: JSON.stringify({
          to: trigger.guest_email,
          toName: trigger.guest_name,
          subject: processedSubject,
          htmlBody: processedContent,
          metadata: {
            automation_id: automation.id,
            trigger_type: automation.trigger_type,
            booking_id: trigger.booking_id,
            property_id: trigger.property_id
          }
        })
      });

      if (response.ok) {
        // Log successful email
        await emailTemplateService.logEmail({
          template_id: template.id,
          recipient_email: trigger.guest_email,
          recipient_name: trigger.guest_name,
          subject: processedSubject,
          content: processedContent,
          status: 'sent',
          booking_id: trigger.booking_id,
          sent_at: new Date().toISOString(),
          metadata: {
            automation_id: automation.id,
            trigger_type: automation.trigger_type,
            property_id: trigger.property_id
          }
        });

        // Update automation stats
        await this.updateAutomation(automation.id, {
          last_triggered_at: new Date().toISOString(),
          total_triggered: automation.total_triggered + 1
        });

        console.log(`✅ Automation executed successfully: ${automation.name}`);
      } else {
        const errorText = await response.text();
        throw new Error(`Backend API error: ${errorText}`);
      }
    } catch (error) {
      console.error(`❌ Error executing automation ${automation.name}:`, error);

      // Log failed email
      await emailTemplateService.logEmail({
        template_id: automation.template_id,
        recipient_email: trigger.guest_email,
        recipient_name: trigger.guest_name,
        subject: 'Email Failed',
        content: 'Email content not available',
        status: 'failed',
        booking_id: trigger.booking_id,
        sent_at: new Date().toISOString(),
        error_message: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          automation_id: automation.id,
          trigger_type: automation.trigger_type,
          property_id: trigger.property_id
        }
      });

      throw error;
    }
  }

  // Schedule delayed emails
  async scheduleDelayedEmail(automation: EmailAutomation, trigger: AutomationTrigger, delayHours: number): Promise<void> {
    const scheduledTime = new Date();
    scheduledTime.setHours(scheduledTime.getHours() + delayHours);

    console.log(`⏰ Scheduling delayed email for ${scheduledTime.toISOString()}`);

    // Store in database for processing by a cron job
    const { error } = await supabase
      .from('scheduled_emails')
      .insert({
        automation_id: automation.id,
        booking_id: trigger.booking_id,
        guest_email: trigger.guest_email,
        guest_name: trigger.guest_name,
                 scheduled_for: scheduledTime.toISOString(),
         status: 'scheduled',
        metadata: {
          trigger_type: automation.trigger_type,
          property_id: trigger.property_id,
          property_name: trigger.property_name,
          check_in: trigger.check_in,
          check_out: trigger.check_out,
          guest_count: trigger.guest_count,
          total_amount: trigger.total_amount
        }
      });

    if (error) {
      console.error('Error scheduling delayed email:', error);
      throw new Error(`Failed to schedule email: ${error.message}`);
    }
  }

  // Process scheduled emails (called by cron job)
  async processScheduledEmails(): Promise<void> {
    const now = new Date();
         const { data: scheduledEmails, error } = await supabase
       .from('scheduled_emails')
       .select('*')
       .eq('status', 'scheduled')
       .lte('scheduled_for', now.toISOString());

    if (error) {
      console.error('Error fetching scheduled emails:', error);
      return;
    }

    for (const scheduledEmail of scheduledEmails || []) {
      try {
        // Get the automation
        const automation = await this.getAutomationById(scheduledEmail.automation_id);
        if (!automation) continue;

        // Create trigger from scheduled email data
        const trigger: AutomationTrigger = {
          booking_id: scheduledEmail.booking_id,
          guest_email: scheduledEmail.guest_email,
          guest_name: scheduledEmail.guest_name,
          property_name: scheduledEmail.metadata.property_name,
          check_in: scheduledEmail.metadata.check_in,
          check_out: scheduledEmail.metadata.check_out,
          guest_count: scheduledEmail.metadata.guest_count,
          total_amount: scheduledEmail.metadata.total_amount,
          booking_status: 'confirmed',
          property_id: scheduledEmail.metadata.property_id
        };

        // Execute the automation
        await this.executeAutomation(automation, trigger);

        // Mark as processed
        await supabase
          .from('scheduled_emails')
          .update({ status: 'sent', sent_at: new Date().toISOString() })
          .eq('id', scheduledEmail.id);

      } catch (error) {
        console.error('Error processing scheduled email:', error);
        
        // Mark as failed
        await supabase
          .from('scheduled_emails')
          .update({ 
            status: 'failed', 
            error_message: error instanceof Error ? error.message : 'Unknown error' 
          })
          .eq('id', scheduledEmail.id);
      }
    }
  }

  // Get automation by ID
  async getAutomationById(id: string): Promise<EmailAutomation | null> {
    const { data, error } = await supabase
      .from('email_automations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching automation:', error);
      throw new Error(`Failed to fetch automation: ${error.message}`);
    }

    return data;
  }
}

export const emailAutomationService = new EmailAutomationService();
