import React, { useState, useEffect } from 'react';
import { supabaseHelpers } from '@/lib/supabase';
import { settingsService, BusinessSettings, APISettings, NotificationSettings, AutomationSettings, SecuritySettings } from '@/services/SettingsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { EmailTest } from './EmailTest';
import {
  Settings,
  Building, 
  Key, 
  Mail, 
  CreditCard, 
  Shield, 
  Bell,
  Save,
  Eye,
  EyeOff,
  RefreshCw,
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  Globe,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';

// Using imported interfaces from SettingsService

const SettingsManagement: React.FC = () => {
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    business_name: 'Habitat Lobby',
            business_address: 'Alexandras 59, Trikala 42100, Greece',
          business_phone: '+30 697 769 0685',
      business_email: 'admin@habitatlobby.com',
    business_website: 'https://habitatlobby.com',
    tax_id: 'GR123456789',
    currency: 'EUR',
    timezone: 'Europe/Athens',
    language: 'en'
  });

  const [apiSettings, setApiSettings] = useState<APISettings>({
    stripe_publishable_key: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    stripe_secret_key: '', // NEVER expose secret key in frontend - it's a security risk!
    stripe_webhook_secret: '', // NEVER expose webhook secret in frontend
    postmark_api_key: '', // Not using Postmark anymore
    elorus_api_key: '',
    google_analytics_id: '',
    facebook_pixel_id: ''
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_notifications: true,
    booking_notifications: true,
    payment_notifications: true,
    review_notifications: true,
    maintenance_notifications: false,
    notification_email: 'stefanos@habitatlobby.com'
  });

  const [automationSettings, setAutomationSettings] = useState<AutomationSettings>({
    auto_confirm_bookings: false,
    auto_send_confirmations: true,
    auto_send_pre_arrival: true,
    auto_send_id_reminders: true,
    auto_send_post_stay: true,
    auto_generate_invoices: true,
    auto_sync_calendars: true,
    auto_delete_old_documents: true
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    session_timeout: 480, // 8 hours
    require_2fa: false,
    password_expiry_days: 90,
    max_login_attempts: 5,
    document_retention_days: 30,
    backup_frequency: 'daily'
  });

  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('business');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      // Fetch settings using the real service
      const [
        businessData,
        apiData,
        notificationData,
        automationData,
        securityData
      ] = await Promise.all([
        settingsService.getBusinessSettings(),
        settingsService.getAPISettings(),
        settingsService.getNotificationSettings(),
        settingsService.getAutomationSettings(),
        settingsService.getSecuritySettings()
      ]);

      console.log('⚙️ Fetched business settings:', businessData);
      console.log('🔑 Fetched API settings:', apiData);
      console.log('🔔 Fetched notification settings:', notificationData);
      console.log('🤖 Fetched automation settings:', automationData);
      console.log('🔒 Fetched security settings:', securityData);

      setBusinessSettings(businessData);
      setApiSettings(apiData);
      setNotificationSettings(notificationData);
      setAutomationSettings(automationData);
      setSecuritySettings(securityData);

    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (settingsType: string, settings: Record<string, unknown>) => {
    try {
      setSaving(true);
      console.log(`Saving ${settingsType} settings:`, settings);

      // Use the appropriate service method based on settings type
      switch (settingsType) {
        case 'business':
          await settingsService.updateBusinessSettings(settings);
          break;
        case 'integrations':
        case 'api':
          await settingsService.updateAPISettings(settings);
          break;
        case 'notifications':
          await settingsService.updateNotificationSettings(settings);
          break;
        case 'automation':
          await settingsService.updateAutomationSettings(settings);
          break;
        case 'security':
          await settingsService.updateSecuritySettings(settings);
          break;
        default:
          throw new Error(`Unknown settings type: ${settingsType}`);
      }

      console.log(`✅ ${settingsType} settings saved successfully`);

    } catch (error) {
      console.error(`❌ Error saving ${settingsType} settings:`, error);
      alert(`Failed to save ${settingsType} settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const getSettingDescription = (category: string, key: string): string => {
    const descriptions: Record<string, Record<string, string>> = {
      business: {
        business_name: 'Company or business name',
        business_address: 'Physical business address',
        business_phone: 'Primary contact phone number',
        business_email: 'Primary contact email address',
        business_website: 'Company website URL',
        tax_id: 'Tax identification number',
        currency: 'Default currency for transactions',
        timezone: 'Business timezone',
        language: 'Default language for communications'
      },
      integrations: {
        stripe_publishable_key: 'Stripe publishable API key',
        stripe_secret_key: 'Stripe secret API key',
        stripe_webhook_secret: 'Stripe webhook endpoint secret',
        postmark_api_key: 'Postmark email service API key',
        elorus_api_key: 'Elorus invoicing service API key',
        google_analytics_id: 'Google Analytics tracking ID',
        facebook_pixel_id: 'Facebook Pixel tracking ID'
      },
      notifications: {
        email_notifications: 'Enable email notifications',
        booking_notifications: 'Enable booking notifications',
        payment_notifications: 'Enable payment notifications',
        review_notifications: 'Enable review notifications',
        maintenance_notifications: 'Enable maintenance notifications',
        notification_email: 'Email address for notifications'
      },
      automation: {
        auto_confirm_bookings: 'Automatically confirm new bookings',
        auto_send_confirmations: 'Send booking confirmation emails',
        auto_send_pre_arrival: 'Send pre-arrival instructions',
        auto_send_id_reminders: 'Send ID verification reminders',
        auto_send_post_stay: 'Send post-stay follow-up emails',
        auto_generate_invoices: 'Automatically generate invoices',
        auto_sync_calendars: 'Sync with external calendars',
        auto_delete_old_documents: 'Delete expired documents'
      },
      security: {
        session_timeout: 'Session timeout in minutes',
        require_2fa: 'Require two-factor authentication',
        password_expiry_days: 'Password expiry period in days',
        max_login_attempts: 'Maximum login attempts before lockout',
        document_retention_days: 'Document retention period in days',
        backup_frequency: 'Backup frequency schedule'
      }
    };

    return descriptions[category]?.[key] || `${category} setting: ${key}`;
  };

  const toggleApiKeyVisibility = (keyName: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [keyName]: !prev[keyName]
    }));
  };

  const maskApiKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return '*'.repeat(key.length);
    return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  const currencies = [
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'CHF', label: 'Swiss Franc (CHF)' }
  ];

  const timezones = [
    { value: 'Europe/Athens', label: 'Europe/Athens (Greece)' },
    { value: 'UTC', label: 'UTC' },
    { value: 'Europe/London', label: 'Europe/London' },
    { value: 'America/New_York', label: 'America/New_York' },
    { value: 'Europe/Paris', label: 'Europe/Paris' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'el', label: 'Greek' },
    { value: 'de', label: 'German' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings & Configuration</h2>
          <p className="text-gray-600">Manage business settings, integrations, and system configuration</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="email-test" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Test
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Business Name</Label>
                  <Input
                    value={businessSettings.business_name}
                    onChange={(e) => setBusinessSettings(prev => ({ ...prev, business_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Tax ID / VAT Number</Label>
                  <Input
                    value={businessSettings.tax_id}
                    onChange={(e) => setBusinessSettings(prev => ({ ...prev, tax_id: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Business Address</Label>
                <Textarea
                  value={businessSettings.business_address}
                  onChange={(e) => setBusinessSettings(prev => ({ ...prev, business_address: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={businessSettings.business_phone}
                    onChange={(e) => setBusinessSettings(prev => ({ ...prev, business_phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={businessSettings.business_email}
                    onChange={(e) => setBusinessSettings(prev => ({ ...prev, business_email: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Website URL</Label>
                <Input
                  value={businessSettings.business_website}
                  onChange={(e) => setBusinessSettings(prev => ({ ...prev, business_website: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>Currency</Label>
                  <Select value={businessSettings.currency} onValueChange={(value) => setBusinessSettings(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Select value={businessSettings.timezone} onValueChange={(value) => setBusinessSettings(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((timezone) => (
                        <SelectItem key={timezone.value} value={timezone.value}>
                          {timezone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Language</Label>
                  <Select value={businessSettings.language} onValueChange={(value) => setBusinessSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => saveSettings('business', businessSettings)} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Business Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys & Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stripe */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Stripe Payment Processing
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label>Publishable Key</Label>
                    <div className="flex gap-2">
                      <Input
                        type={showApiKeys.stripe_publishable ? 'text' : 'password'}
                        value={showApiKeys.stripe_publishable ? apiSettings.stripe_publishable_key : maskApiKey(apiSettings.stripe_publishable_key)}
                        onChange={(e) => setApiSettings(prev => ({ ...prev, stripe_publishable_key: e.target.value }))}
                        placeholder="pk_live_..."
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleApiKeyVisibility('stripe_publishable')}
                      >
                        {showApiKeys.stripe_publishable ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Secret Key</Label>
                    <div className="flex gap-2">
                      <Input
                        type={showApiKeys.stripe_secret ? 'text' : 'password'}
                        value={showApiKeys.stripe_secret ? apiSettings.stripe_secret_key : maskApiKey(apiSettings.stripe_secret_key)}
                        onChange={(e) => setApiSettings(prev => ({ ...prev, stripe_secret_key: e.target.value }))}
                        placeholder="sk_live_..."
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleApiKeyVisibility('stripe_secret')}
                      >
                        {showApiKeys.stripe_secret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Webhook Secret</Label>
                    <div className="flex gap-2">
                      <Input
                        type={showApiKeys.stripe_webhook ? 'text' : 'password'}
                        value={showApiKeys.stripe_webhook ? apiSettings.stripe_webhook_secret : maskApiKey(apiSettings.stripe_webhook_secret)}
                        onChange={(e) => setApiSettings(prev => ({ ...prev, stripe_webhook_secret: e.target.value }))}
                        placeholder="whsec_..."
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleApiKeyVisibility('stripe_webhook')}
                      >
                        {showApiKeys.stripe_webhook ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Email */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Service (Postmark)
                </h3>
                <div>
                  <Label>API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      type={showApiKeys.postmark ? 'text' : 'password'}
                      value={showApiKeys.postmark ? apiSettings.postmark_api_key : maskApiKey(apiSettings.postmark_api_key)}
                      onChange={(e) => setApiSettings(prev => ({ ...prev, postmark_api_key: e.target.value }))}
                      placeholder="Server API Token"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleApiKeyVisibility('postmark')}
                    >
                      {showApiKeys.postmark ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Invoicing */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Invoicing Service (Elorus)
                </h3>
                <div>
                  <Label>API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      type={showApiKeys.elorus ? 'text' : 'password'}
                      value={showApiKeys.elorus ? apiSettings.elorus_api_key : maskApiKey(apiSettings.elorus_api_key)}
                      onChange={(e) => setApiSettings(prev => ({ ...prev, elorus_api_key: e.target.value }))}
                      placeholder="Elorus API Key"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleApiKeyVisibility('elorus')}
                    >
                      {showApiKeys.elorus ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => saveSettings('integrations', apiSettings)} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save API Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Notification Email</Label>
                <Input
                  type="email"
                  value={notificationSettings.notification_email}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, notification_email: e.target.value }))}
                  placeholder="stefanos@habitatlobby.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email address where notifications will be sent
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.email_notifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, email_notifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Booking Notifications</Label>
                      <p className="text-sm text-gray-600">Get notified when new bookings are made</p>
                    </div>
                    <Switch
                      checked={notificationSettings.booking_notifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, booking_notifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Payment Notifications</Label>
                      <p className="text-sm text-gray-600">Get notified about payment events</p>
                    </div>
                    <Switch
                      checked={notificationSettings.payment_notifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, payment_notifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Review Notifications</Label>
                      <p className="text-sm text-gray-600">Get notified about new guest reviews</p>
                    </div>
                    <Switch
                      checked={notificationSettings.review_notifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, review_notifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Notifications</Label>
                      <p className="text-sm text-gray-600">Get notified about system maintenance</p>
                    </div>
                    <Switch
                      checked={notificationSettings.maintenance_notifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, maintenance_notifications: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => saveSettings('notifications', notificationSettings)} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Notification Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Booking Automation</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-confirm Bookings</Label>
                      <p className="text-sm text-gray-600">Automatically confirm bookings after payment</p>
                    </div>
                    <Switch
                      checked={automationSettings.auto_confirm_bookings}
                      onCheckedChange={(checked) => setAutomationSettings(prev => ({ ...prev, auto_confirm_bookings: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-generate Invoices</Label>
                      <p className="text-sm text-gray-600">Automatically create invoices for bookings</p>
                    </div>
                    <Switch
                      checked={automationSettings.auto_generate_invoices}
                      onCheckedChange={(checked) => setAutomationSettings(prev => ({ ...prev, auto_generate_invoices: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Email Automation</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Send Booking Confirmations</Label>
                      <p className="text-sm text-gray-600">Automatically send confirmation emails</p>
                    </div>
                    <Switch
                      checked={automationSettings.auto_send_confirmations}
                      onCheckedChange={(checked) => setAutomationSettings(prev => ({ ...prev, auto_send_confirmations: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Send Pre-arrival Instructions</Label>
                      <p className="text-sm text-gray-600">Send instructions 48h before check-in</p>
                    </div>
                    <Switch
                      checked={automationSettings.auto_send_pre_arrival}
                      onCheckedChange={(checked) => setAutomationSettings(prev => ({ ...prev, auto_send_pre_arrival: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Send ID Verification Reminders</Label>
                      <p className="text-sm text-gray-600">Remind guests to upload ID documents</p>
                    </div>
                    <Switch
                      checked={automationSettings.auto_send_id_reminders}
                      onCheckedChange={(checked) => setAutomationSettings(prev => ({ ...prev, auto_send_id_reminders: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Send Post-stay Thank You</Label>
                      <p className="text-sm text-gray-600">Send thank you emails after checkout</p>
                    </div>
                    <Switch
                      checked={automationSettings.auto_send_post_stay}
                      onCheckedChange={(checked) => setAutomationSettings(prev => ({ ...prev, auto_send_post_stay: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">System Automation</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-sync Calendars</Label>
                      <p className="text-sm text-gray-600">Automatically sync with OTA calendars</p>
                    </div>
                    <Switch
                      checked={automationSettings.auto_sync_calendars}
                      onCheckedChange={(checked) => setAutomationSettings(prev => ({ ...prev, auto_sync_calendars: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-delete Old Documents</Label>
                      <p className="text-sm text-gray-600">Automatically delete expired ID documents</p>
                    </div>
                    <Switch
                      checked={automationSettings.auto_delete_old_documents}
                      onCheckedChange={(checked) => setAutomationSettings(prev => ({ ...prev, auto_delete_old_documents: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => saveSettings('automation', automationSettings)} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Automation Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={securitySettings.session_timeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, session_timeout: parseInt(e.target.value) || 480 }))}
                    min="30"
                    max="1440"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically log out after this period of inactivity
                  </p>
                </div>
                <div>
                  <Label>Max Login Attempts</Label>
                  <Input
                    type="number"
                    value={securitySettings.max_login_attempts}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, max_login_attempts: parseInt(e.target.value) || 5 }))}
                    min="3"
                    max="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lock account after this many failed attempts
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Password Expiry (days)</Label>
                  <Input
                    type="number"
                    value={securitySettings.password_expiry_days}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, password_expiry_days: parseInt(e.target.value) || 90 }))}
                    min="30"
                    max="365"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Force password change after this period
                  </p>
                </div>
                <div>
                  <Label>Document Retention (days)</Label>
                  <Input
                    type="number"
                    value={securitySettings.document_retention_days}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, document_retention_days: parseInt(e.target.value) || 30 }))}
                    min="7"
                    max="365"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically delete ID documents after this period
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Backup Frequency</Label>
                  <Select value={securitySettings.backup_frequency} onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, backup_frequency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={securitySettings.require_2fa}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, require_2fa: checked }))}
                  />
                  <div>
                    <Label>Require Two-Factor Authentication</Label>
                    <p className="text-xs text-gray-500">
                      Require 2FA for admin access
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => saveSettings('security', securitySettings)} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Security Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email-test" className="space-y-6">
          <EmailTest />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;
