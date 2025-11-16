import { supabase } from '../lib/supabase';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  template_type: 'booking_confirmation' | 'pre_arrival' | 'post_stay' | 'payment_confirmation' | 'cancellation' | 'custom';
  is_active: boolean;
  variables: string[];
  created_at: string;
  updated_at: string;
  last_modified?: string;
}

export interface EmailLog {
  id: string;
  template_id?: string;
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  content: string;
  status: 'sent' | 'failed' | 'pending';
  booking_id?: string;
  guest_id?: string;
  sent_at: string;
  error_message?: string;
  metadata: Record<string, string | number | boolean | null>;
  created_at: string;
}

export interface CreateEmailTemplateData {
  name: string;
  subject: string;
  content: string;
  template_type: EmailTemplate['template_type'];
  is_active?: boolean;
  variables?: string[];
}

export interface UpdateEmailTemplateData extends Partial<CreateEmailTemplateData> {
  id: string;
}

export class EmailTemplateService {
  // Get all email templates
  async getAllTemplates(): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching email templates:', error);
      throw new Error(`Failed to fetch email templates: ${error.message}`);
    }

    return data || [];
  }

  // Get active email templates
  async getActiveTemplates(): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active email templates:', error);
      throw new Error(`Failed to fetch active email templates: ${error.message}`);
    }

    return data || [];
  }

  // Get template by ID
  async getTemplateById(id: string): Promise<EmailTemplate | null> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Template not found
      }
      console.error('Error fetching email template:', error);
      throw new Error(`Failed to fetch email template: ${error.message}`);
    }

    return data;
  }

  // Get template by type
  async getTemplateByType(template_type: EmailTemplate['template_type']): Promise<EmailTemplate | null> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_type', template_type)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Template not found
      }
      console.error('Error fetching email template by type:', error);
      throw new Error(`Failed to fetch email template: ${error.message}`);
    }

    return data;
  }

  // Create new email template
  async createTemplate(templateData: CreateEmailTemplateData): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .insert([{
        ...templateData,
        is_active: templateData.is_active ?? true,
        variables: templateData.variables || []
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating email template:', error);
      throw new Error(`Failed to create email template: ${error.message}`);
    }

    return data;
  }

  // Update email template
  async updateTemplate(templateData: UpdateEmailTemplateData): Promise<EmailTemplate> {
    const { id, ...updateData } = templateData;
    
    const { data, error } = await supabase
      .from('email_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating email template:', error);
      throw new Error(`Failed to update email template: ${error.message}`);
    }

    return data;
  }

  // Delete email template
  async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting email template:', error);
      throw new Error(`Failed to delete email template: ${error.message}`);
    }
  }

  // Toggle template active status
  async toggleTemplateStatus(id: string, isActive: boolean): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling template status:', error);
      throw new Error(`Failed to toggle template status: ${error.message}`);
    }

    return data;
  }

  // Get email logs
  async getEmailLogs(limit: number = 50, offset: number = 0): Promise<EmailLog[]> {
    const { data, error } = await supabase
      .from('email_logs')
      .select('*')
      .order('sent_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching email logs:', error);
      throw new Error(`Failed to fetch email logs: ${error.message}`);
    }

    return data || [];
  }

  // Resend an email from logs
  async resendEmail(emailLogId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Resending email from log:', emailLogId);

      // Get the original email log
      const { data: emailLog, error: fetchError } = await supabase
        .from('email_logs')
        .select('*')
        .eq('id', emailLogId)
        .single();

      if (fetchError) {
        console.error('Error fetching email log:', fetchError);
        throw new Error(`Failed to fetch email log: ${fetchError.message}`);
      }

      if (!emailLog) {
        throw new Error('Email log not found');
      }

      // Create a new email log entry for the resend
      const { data: newEmailLog, error: createError } = await supabase
        .from('email_logs')
        .insert({
          template_id: emailLog.template_id,
          recipient_email: emailLog.recipient_email,
          recipient_name: emailLog.recipient_name,
          subject: `[RESENT] ${emailLog.subject}`,
          content: emailLog.content,
          status: 'pending',
          booking_id: emailLog.booking_id,
          guest_id: emailLog.guest_id,
          metadata: {
            ...emailLog.metadata,
            resent_from: emailLogId,
            resent_at: new Date().toISOString(),
            is_manual_resend: true
          }
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating resend email log:', createError);
        throw new Error(`Failed to create resend log: ${createError.message}`);
      }

      // Try to send the email via backend API
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_EMAIL_API_KEY || ''
          },
          body: JSON.stringify({
            to: emailLog.recipient_email,
            toName: emailLog.recipient_name,
            subject: `[RESENT] ${emailLog.subject}`,
            htmlBody: emailLog.content,
            metadata: {
              ...emailLog.metadata,
              resent_from: emailLogId,
              is_manual_resend: true
            }
          })
        });

        if (response.ok) {
          // Update the new log as sent
          await supabase
            .from('email_logs')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString()
            })
            .eq('id', newEmailLog.id);

          console.log('✅ Email resent successfully');
          return {
            success: true,
            message: 'Email resent successfully'
          };
        } else {
          const errorText = await response.text();
          throw new Error(`Backend API error: ${errorText}`);
        }
      } catch (apiError) {
        console.error('API send failed, updating log as failed:', apiError);

        // Update the new log as failed
        await supabase
          .from('email_logs')
          .update({
            status: 'failed',
            error_message: apiError instanceof Error ? apiError.message : 'Unknown API error'
          })
          .eq('id', newEmailLog.id);

        return {
          success: false,
          message: `Failed to send email: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`
        };
      }
    } catch (error) {
      console.error('❌ Error resending email:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Log email send
  async logEmail(logData: Omit<EmailLog, 'id' | 'created_at'>): Promise<EmailLog> {
    const { data, error } = await supabase
      .from('email_logs')
      .insert([logData])
      .select()
      .single();

    if (error) {
      console.error('Error logging email:', error);
      throw new Error(`Failed to log email: ${error.message}`);
    }

    return data;
  }

  // Process template variables
  processTemplate(template: string, variables: Record<string, string | number | boolean | null>): string {
    let processedTemplate = template;
    
    // Replace all {{variable}} placeholders with actual values
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedTemplate = processedTemplate.replace(regex, String(value || ''));
    });

    return processedTemplate;
  }

  // Extract variables from template content
  extractVariables(content: string): string[] {
    const variableRegex = /{{(\w+)}}/g;
    const variables: string[] = [];
    let match;

    while ((match = variableRegex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    return variables;
  }
}

export const emailTemplateService = new EmailTemplateService();
