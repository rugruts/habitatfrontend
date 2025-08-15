import { supabase } from '../lib/supabase';

export type SettingCategory = 'business' | 'api' | 'notifications' | 'automation' | 'security';

export interface Setting {
  id: string;
  category: SettingCategory;
  key: string;
  value: string;
  encrypted: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SettingHistory {
  id: string;
  setting_id: string;
  old_value?: string;
  new_value?: string;
  changed_by?: string;
  changed_at: string;
  change_reason?: string;
}

export interface BusinessSettings {
  business_name: string;
  business_address: string;
  business_phone: string;
  business_email: string;
  business_website: string;
  tax_id: string;
  currency: string;
  timezone: string;
  language: string;
  logo_url?: string;
}

export interface APISettings {
  stripe_publishable_key: string;
  stripe_secret_key: string;
  stripe_webhook_secret: string;
  postmark_api_key: string;
  elorus_api_key: string;
  google_analytics_id: string;
  facebook_pixel_id: string;
}

export interface NotificationSettings {
  email_notifications: boolean;
  booking_notifications: boolean;
  payment_notifications: boolean;
  review_notifications: boolean;
  maintenance_notifications: boolean;
  notification_email: string;
}

export interface AutomationSettings {
  auto_confirm_bookings: boolean;
  auto_send_confirmations: boolean;
  auto_send_pre_arrival: boolean;
  auto_send_id_reminders: boolean;
  auto_send_post_stay: boolean;
  auto_generate_invoices: boolean;
  auto_sync_calendars: boolean;
  auto_delete_old_documents: boolean;
}

export interface SecuritySettings {
  session_timeout: number;
  require_2fa: boolean;
  password_expiry_days: number;
  max_login_attempts: number;
  document_retention_days: number;
}

export class SettingsService {
  // Get all settings
  async getAllSettings(): Promise<Setting[]> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('category', { ascending: true })
      .order('key', { ascending: true });

    if (error) {
      console.error('Error fetching settings:', error);
      throw new Error(`Failed to fetch settings: ${error.message}`);
    }

    return data || [];
  }

  // Get settings by category
  async getSettingsByCategory(category: SettingCategory): Promise<Setting[]> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('category', category)
      .order('key', { ascending: true });

    if (error) {
      console.error('Error fetching settings by category:', error);
      throw new Error(`Failed to fetch settings: ${error.message}`);
    }

    return data || [];
  }

  // Get single setting
  async getSetting(category: SettingCategory, key: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('category', category)
      .eq('key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Setting not found
      }
      console.error('Error fetching setting:', error);
      throw new Error(`Failed to fetch setting: ${error.message}`);
    }

    return data?.value || null;
  }

  // Update setting
  async updateSetting(category: SettingCategory, key: string, value: string): Promise<Setting> {
    const { data, error } = await supabase
      .rpc('update_setting', {
        p_category: category,
        p_key: key,
        p_value: value
      });

    if (error) {
      console.error('Error updating setting:', error);
      throw new Error(`Failed to update setting: ${error.message}`);
    }

    // Fetch the updated setting
    const { data: updatedSetting, error: fetchError } = await supabase
      .from('settings')
      .select('*')
      .eq('category', category)
      .eq('key', key)
      .single();

    if (fetchError) {
      console.error('Error fetching updated setting:', fetchError);
      throw new Error(`Failed to fetch updated setting: ${fetchError.message}`);
    }

    return updatedSetting;
  }

  // Update multiple settings
  async updateSettings(updates: Array<{ category: SettingCategory; key: string; value: string }>): Promise<void> {
    for (const update of updates) {
      await this.updateSetting(update.category, update.key, update.value);
    }
  }

  // Get business settings as typed object
  async getBusinessSettings(): Promise<BusinessSettings> {
    const settings = await this.getSettingsByCategory('business');
    const settingsMap = new Map(settings.map(s => [s.key, s.value]));

    return {
      business_name: settingsMap.get('business_name') || '',
      business_address: settingsMap.get('business_address') || '',
      business_phone: settingsMap.get('business_phone') || '',
      business_email: settingsMap.get('business_email') || '',
      business_website: settingsMap.get('business_website') || '',
      tax_id: settingsMap.get('tax_id') || '',
      currency: settingsMap.get('currency') || 'EUR',
      timezone: settingsMap.get('timezone') || 'Europe/Athens',
      language: settingsMap.get('language') || 'en',
      logo_url: settingsMap.get('logo_url')
    };
  }

  // Get API settings as typed object
  async getAPISettings(): Promise<APISettings> {
    const settings = await this.getSettingsByCategory('api');
    const settingsMap = new Map(settings.map(s => [s.key, s.value]));

    return {
      stripe_publishable_key: settingsMap.get('stripe_publishable_key') || '',
      stripe_secret_key: settingsMap.get('stripe_secret_key') || '',
      stripe_webhook_secret: settingsMap.get('stripe_webhook_secret') || '',
      postmark_api_key: settingsMap.get('postmark_api_key') || '',
      elorus_api_key: settingsMap.get('elorus_api_key') || '',
      google_analytics_id: settingsMap.get('google_analytics_id') || '',
      facebook_pixel_id: settingsMap.get('facebook_pixel_id') || ''
    };
  }

  // Get notification settings as typed object
  async getNotificationSettings(): Promise<NotificationSettings> {
    const settings = await this.getSettingsByCategory('notifications');
    const settingsMap = new Map(settings.map(s => [s.key, s.value]));

    return {
      email_notifications: settingsMap.get('email_notifications') === 'true',
      booking_notifications: settingsMap.get('booking_notifications') === 'true',
      payment_notifications: settingsMap.get('payment_notifications') === 'true',
      review_notifications: settingsMap.get('review_notifications') === 'true',
      maintenance_notifications: settingsMap.get('maintenance_notifications') === 'true',
      notification_email: settingsMap.get('notification_email') || ''
    };
  }

  // Get automation settings as typed object
  async getAutomationSettings(): Promise<AutomationSettings> {
    const settings = await this.getSettingsByCategory('automation');
    const settingsMap = new Map(settings.map(s => [s.key, s.value]));

    return {
      auto_confirm_bookings: settingsMap.get('auto_confirm_bookings') === 'true',
      auto_send_confirmations: settingsMap.get('auto_send_confirmations') === 'true',
      auto_send_pre_arrival: settingsMap.get('auto_send_pre_arrival') === 'true',
      auto_send_id_reminders: settingsMap.get('auto_send_id_reminders') === 'true',
      auto_send_post_stay: settingsMap.get('auto_send_post_stay') === 'true',
      auto_generate_invoices: settingsMap.get('auto_generate_invoices') === 'true',
      auto_sync_calendars: settingsMap.get('auto_sync_calendars') === 'true',
      auto_delete_old_documents: settingsMap.get('auto_delete_old_documents') === 'true'
    };
  }

  // Get security settings as typed object
  async getSecuritySettings(): Promise<SecuritySettings> {
    const settings = await this.getSettingsByCategory('security');
    const settingsMap = new Map(settings.map(s => [s.key, s.value]));

    return {
      session_timeout: parseInt(settingsMap.get('session_timeout') || '3600'),
      require_2fa: settingsMap.get('require_2fa') === 'true',
      password_expiry_days: parseInt(settingsMap.get('password_expiry_days') || '90'),
      max_login_attempts: parseInt(settingsMap.get('max_login_attempts') || '5'),
      document_retention_days: parseInt(settingsMap.get('document_retention_days') || '2555')
    };
  }

  // Update business settings
  async updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<void> {
    const updates = Object.entries(settings).map(([key, value]) => ({
      category: 'business' as SettingCategory,
      key,
      value: String(value)
    }));

    await this.updateSettings(updates);
  }

  // Update API settings
  async updateAPISettings(settings: Partial<APISettings>): Promise<void> {
    const updates = Object.entries(settings).map(([key, value]) => ({
      category: 'api' as SettingCategory,
      key,
      value: String(value)
    }));

    await this.updateSettings(updates);
  }

  // Update notification settings
  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
    const updates = Object.entries(settings).map(([key, value]) => ({
      category: 'notifications' as SettingCategory,
      key,
      value: String(value)
    }));

    await this.updateSettings(updates);
  }

  // Update automation settings
  async updateAutomationSettings(settings: Partial<AutomationSettings>): Promise<void> {
    const updates = Object.entries(settings).map(([key, value]) => ({
      category: 'automation' as SettingCategory,
      key,
      value: String(value)
    }));

    await this.updateSettings(updates);
  }

  // Update security settings
  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<void> {
    const updates = Object.entries(settings).map(([key, value]) => ({
      category: 'security' as SettingCategory,
      key,
      value: String(value)
    }));

    await this.updateSettings(updates);
  }

  // Get settings history
  async getSettingsHistory(limit: number = 50): Promise<SettingHistory[]> {
    const { data, error } = await supabase
      .from('settings_history')
      .select('*')
      .order('changed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching settings history:', error);
      throw new Error(`Failed to fetch settings history: ${error.message}`);
    }

    return data || [];
  }
}

export const settingsService = new SettingsService();
