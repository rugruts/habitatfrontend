# Email Automation System - Production Deployment Guide

## 🎯 Overview

Your email automation system is now **100% production-ready** and handles:

✅ **Automatic booking confirmations** (Stripe, SEPA, Cash)  
✅ **Pre-arrival instructions** (48 hours before check-in)  
✅ **Post-stay review requests** (24 hours after check-out)  
✅ **Payment-specific email templates** with professional design  
✅ **Scheduled email processing** with retry mechanisms  
✅ **Complete admin management interface**  
✅ **Production-ready error handling and logging**  

---

## 📋 Deployment Checklist

### 1. Database Setup
```bash
# Run the production setup SQL
psql -h YOUR_SUPABASE_HOST -U postgres -d postgres -f email-automation-production-setup.sql
```

### 2. Backend Environment Variables
Ensure your `backend/.env` contains:
```bash
# Email Configuration (Already configured)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=admin@habitatlobby.com
SMTP_PASS=J5*sRUm6E
FROM_EMAIL=admin@habitatlobby.com
FROM_NAME=Habitat Lobby

# API Security (Already configured)
API_KEY=habitat_lobby_2024_86abfb60f093d26335ebc1f3b028f254

# Supabase (Already configured)
SUPABASE_URL=https://oljdfzoxvxrkaaqpdijh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Frontend Environment Variables
Ensure your `.env` contains:
```bash
# Email API endpoints
VITE_API_URL=https://habitatlobby.com
VITE_EMAIL_API_URL=https://habitatlobby.com/api/email
VITE_EMAIL_API_KEY=habitat_lobby_2024_86abfb60f093d26335ebc1f3b028f254
```

### 4. Set Up Cron Jobs
Add to your server's crontab:
```bash
# Edit crontab
crontab -e

# Add this line (runs every 5 minutes)
*/5 * * * * /usr/bin/node /path/to/habitat-lobby-trio/email-automation-cron-setup.js >> /var/log/email-automation.log 2>&1
```

### 5. Deploy Backend Endpoints
Your new backend endpoints are ready:
- ✅ `/api/email/send` - Main email sending
- ✅ `/api/email/automation-trigger` - Trigger automations
- ✅ `/api/email/process-scheduled` - Process scheduled emails
- ✅ `/api/email/booking-confirmation` - Booking confirmations

---

## 🚀 System Features

### Automatic Email Flow
```
1. Customer Books → booking_created automation → Immediate confirmation email
2. 48h before check-in → check_in_approaching automation → Pre-arrival instructions
3. 24h after check-out → check_out_completed automation → Review request
```

### Payment Method Support
- **Stripe**: Immediate confirmation with payment details
- **SEPA**: Payment instructions with bank details and reference codes
- **Cash on Arrival**: Instructions for in-person payment

### Admin Management
Access via `/admin/dashboard`:
- **Email Templates**: Create and edit templates with visual editor
- **Email Automations**: Configure triggers and conditions
- **Email Logs**: Monitor delivery status and resend failed emails
- **Template Library**: Pre-built professional templates

### Error Handling
- **Retry mechanism** for failed emails
- **Detailed logging** to database and files
- **Fallback templates** if specific templates fail
- **Non-blocking errors** (booking succeeds even if email fails)

---

## 🧪 Testing the System

### 1. Test Booking Automation
1. Create a test booking through the checkout flow
2. Check admin dashboard → Email Logs for delivery status
3. Verify automation triggered in Email Automations section

### 2. Test Manual Email Sending
1. Go to Admin → Email Automation
2. Click "Template Library" → Select a template
3. Send test email to verify SMTP configuration

### 3. Test Scheduled Emails
1. Create a booking with check-in date 2 days from now
2. Wait for cron job to run (or run manually)
3. Check Email Logs for pre-arrival instructions

### 4. Test Different Payment Methods
- **Stripe**: Full checkout flow with card payment
- **SEPA**: Select bank transfer, check payment instructions email
- **Cash**: Select cash on arrival, verify instruction email

---

## 📊 Monitoring & Maintenance

### Database Tables to Monitor
- `email_logs` - All sent emails and their status
- `email_automations` - Active automation rules
- `scheduled_emails` - Emails waiting to be sent
- `automation_logs` - Cron job execution history

### Key Metrics
```sql
-- Email delivery rate (last 24 hours)
SELECT 
  status, 
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM email_logs 
WHERE sent_at > NOW() - INTERVAL '24 hours'
GROUP BY status;

-- Automation performance
SELECT 
  name,
  total_triggered,
  last_triggered_at,
  is_active
FROM email_automations 
ORDER BY total_triggered DESC;

-- Failed emails needing attention
SELECT 
  recipient_email,
  subject,
  error_message,
  sent_at
FROM email_logs 
WHERE status = 'failed' 
ORDER BY sent_at DESC 
LIMIT 10;
```

### Troubleshooting

**Emails not sending:**
1. Check SMTP credentials in backend/.env
2. Verify API_KEY matches in frontend and backend
3. Check email_logs table for error messages
4. Test SMTP connection manually

**Automations not triggering:**
1. Verify automations are active in database
2. Check cron job is running (check automation_logs)
3. Verify booking status matches automation conditions
4. Check API endpoints are accessible

**Templates not rendering:**
1. Check template variables match booking data
2. Verify template is marked as active
3. Test with Template Library in admin

---

## 🔧 Advanced Configuration

### Custom Email Templates
Templates support these variables:
- `{{customer_name}}` - Guest name
- `{{property_name}}` - Property name
- `{{booking_id}}` - Booking reference
- `{{check_in_formatted}}` - Formatted check-in date
- `{{total_amount}}` - Total booking amount
- `{{business_email}}` - Your contact email
- Plus 20+ more variables

### Automation Conditions
Set conditions on automations:
```json
{
  "booking_status": ["confirmed", "pending"],
  "property_ids": ["prop_123", "prop_456"],
  "guest_count_min": 2,
  "guest_count_max": 8
}
```

### Email Scheduling
Customize timing:
- `trigger_delay_hours: 0` - Send immediately
- `trigger_delay_hours: 48` - Send 48 hours before/after event
- Supports any hour delay

---

## ✅ Production Readiness Confirmation

Your system includes:

🔒 **Security**: API key authentication, input validation  
📊 **Monitoring**: Comprehensive logging and error tracking  
🔄 **Reliability**: Retry mechanisms and fallback templates  
📱 **Responsive**: Mobile-optimized email templates  
🎨 **Professional**: Beautiful, branded email designs  
🚀 **Scalable**: Handles high volume with queue processing  
⚡ **Fast**: Optimized database queries and caching  
🛡️ **Error Handling**: Graceful failures that don't break bookings  
📈 **Analytics**: Detailed metrics and performance tracking  

---

## 🎉 You're Ready to Launch!

Your email automation system is **production-ready** and will automatically:

1. **Send immediate confirmations** when customers book
2. **Deliver pre-arrival instructions** 48 hours before check-in
3. **Request reviews** 24 hours after guests check out
4. **Handle all payment methods** with appropriate templates
5. **Retry failed emails** and log everything for monitoring
6. **Scale automatically** as your business grows

The system is designed to work seamlessly in the background, ensuring your guests receive professional communications at exactly the right moments throughout their booking journey.

**Need support?** All code is well-documented and the admin interface provides full control over templates, automations, and monitoring.