# Habitat Lobby - Backend Integration Setup Guide

This guide will help you set up the complete backend integration for the Habitat Lobby admin dashboard.

## 🗄️ Database Setup

### 1. Run the Database Schema Scripts

Execute these SQL scripts in your Supabase SQL editor in the following order:

```bash
# 1. Main schema (if not already done)
supabase-schema.sql

# 2. Admin dashboard tables
supabase-admin-schema.sql

# 3. Seed data for admin dashboard
supabase-admin-seed-data.sql

# 4. Security policies
supabase-admin-security.sql

# 5. Storage setup
supabase-storage-setup.sql
```

### 2. Environment Variables

Create or update your `.env.local` file with the following variables:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (for payment processing)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Service (Postmark)
POSTMARK_API_KEY=your_postmark_api_key

# Elorus (for invoicing)
ELORUS_API_KEY=your_elorus_api_key
```

## 🔐 Authentication Setup

### 1. Admin User Setup

The system uses email-based admin authentication. Update the admin emails in:

```sql
-- In supabase-admin-security.sql, update the is_admin_user() function
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.email() IN (
    'your-admin-email@habitatlobby.com',
    'stefanos@habitatlobby.com',
    'admin@habitatlobby.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Create Admin User

1. Go to your Supabase Auth dashboard
2. Create a new user with one of the admin emails
3. Set a secure password
4. Verify the email if needed

## 💳 Payment Integration (Stripe)

### 1. Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Set up webhooks pointing to your application

### 2. Webhook Endpoint

Create a webhook endpoint in your backend to handle Stripe events:

```typescript
// Example webhook handler
import { webhookHandler } from '@/lib/stripe-webhooks';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  try {
    const event = webhookHandler.verifyWebhook(body, signature);
    await webhookHandler.handleWebhook(event);
    
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }
}
```

## 📧 Email Integration (Postmark)

### 1. Postmark Setup

1. Create a Postmark account at https://postmarkapp.com
2. Set up a sender signature or domain
3. Get your Server API Token

### 2. Email Templates

The system includes these email templates:
- Booking Confirmation
- Pre-Arrival Instructions
- ID Verification Reminder
- Post-Stay Thank You

These are stored in the `email_templates` table and can be managed through the admin dashboard.

## 📁 File Storage Setup

### 1. Supabase Storage Buckets

The system creates these storage buckets:
- `id-documents` (private) - For ID verification documents
- `property-images` (public) - For property photos
- `invoices` (private) - For generated invoices
- `documents` (private) - For general documents

### 2. Storage Policies

The storage policies are automatically created by the `supabase-storage-setup.sql` script. They ensure:
- Only admins can upload/manage files
- ID documents are private and secure
- Property images are publicly accessible
- Proper file size and type validation

## 🔄 Automation Setup

### 1. Email Automation

The system includes automated email triggers:
- Send confirmation after booking creation
- Send pre-arrival instructions 48h before check-in
- Send ID verification reminders for missing documents
- Send thank you emails 24h after checkout

### 2. Scheduled Tasks

Set up these scheduled tasks (using cron jobs or similar):

```typescript
// Daily cleanup tasks
import { bookingEmailService } from '@/lib/booking-email-service';

// Run daily at 2 AM
export async function dailyCleanup() {
  // Clean up old booking data, send reminders, etc.
  console.log('Running daily cleanup tasks...');
}

// Run every hour
export async function hourlyTasks() {
  // Process any pending email notifications
  console.log('Running hourly tasks...');
}
```

## 🧪 Testing the Integration

### 1. Test Admin Login

1. Navigate to `/admin/login`
2. Login with your admin credentials
3. Verify you can access the dashboard

### 2. Test File Upload

1. Go to ID Verification or Units & Rates
2. Try uploading a test image
3. Verify it appears in Supabase Storage

### 3. Test Email System

1. Go to Email Automation
2. Create a test template
3. Send a test email
4. Check your email and Postmark logs

### 4. Test Payment Integration

1. Create a test booking
2. Process a test payment
3. Verify webhook handling
4. Test refund functionality

## 🔧 Troubleshooting

### Common Issues

1. **Admin Access Denied**
   - Check if your email is in the admin list
   - Verify RLS policies are applied correctly

2. **File Upload Fails**
   - Check storage bucket permissions
   - Verify file size and type limits
   - Check browser console for errors

3. **Email Not Sending**
   - Verify Postmark API key
   - Check sender signature setup
   - Review email logs in admin dashboard

4. **Payment Webhook Issues**
   - Verify webhook URL is accessible
   - Check Stripe webhook secret
   - Review webhook logs

### Database Queries for Debugging

```sql
-- Check admin users
SELECT auth.email(), is_admin_user();

-- Check storage usage
SELECT * FROM storage_statistics;

-- Check recent email logs
SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 10;

-- Check payment status
SELECT * FROM payments ORDER BY created_at DESC LIMIT 10;
```

## 🚀 Production Deployment

### 1. Environment Setup

- Use production Stripe keys
- Set up production Postmark account
- Configure proper domain for Supabase
- Set up SSL certificates

### 2. Security Checklist

- [ ] All API keys are secure and not exposed
- [ ] RLS policies are properly configured
- [ ] Admin emails are production-ready
- [ ] File upload limits are appropriate
- [ ] Webhook endpoints are secured

### 3. Monitoring

Set up monitoring for:
- Database performance
- Storage usage
- Email delivery rates
- Payment processing
- Error rates

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Postmark Documentation](https://postmarkapp.com/developer)
- [React Query Documentation](https://tanstack.com/query/latest)

## 🆘 Support

If you encounter issues:
1. Check the browser console for errors
2. Review Supabase logs
3. Check email service logs
4. Verify webhook delivery in Stripe dashboard

The admin dashboard is now fully integrated with a production-ready backend! 🎉
