# Stripe Payments & Invoices Sync Setup

## 🎯 Overview

This setup enables real-time syncing of payments and invoices from Stripe to your admin panel.

## 📋 Prerequisites

1. **Stripe Account** with API keys
2. **Supabase Project** with admin access
3. **Backend Server** running on port 3001

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install stripe @supabase/supabase-js
```

### 2. Environment Variables

Add these to your `backend/.env` file:

```env
# Existing variables...
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
FROM_EMAIL=your-from-email

# New Stripe & Supabase variables
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Copy and paste the content from create-payments-invoices-tables.sql
```

### 4. Start Backend Server

```bash
cd backend
npm run dev
```

The server should start on `http://localhost:3001`

## 🎯 Frontend Features

### Payment Management
- ✅ **Sync from Stripe** - Import all Stripe payments
- ✅ **Real-time status** - See payment statuses (pending, succeeded, failed, refunded)
- ✅ **Guest linking** - Payments linked to guest profiles
- ✅ **Refund processing** - Process refunds directly from admin panel

### Invoice Management  
- ✅ **Sync from Stripe** - Import all Stripe invoices
- ✅ **Invoice tracking** - Track invoice status (draft, open, paid, void)
- ✅ **PDF downloads** - Direct links to Stripe invoice PDFs
- ✅ **Guest linking** - Invoices linked to guest profiles

## 🔄 How Sync Works

### Payments Sync
1. Fetches last 100 payments from Stripe
2. Checks if payment exists in database (by `stripe_payment_intent_id`)
3. Inserts new payments or updates existing ones
4. Links payments to bookings when possible

### Invoices Sync
1. Fetches last 100 invoices from Stripe
2. Checks if invoice exists in database (by `stripe_invoice_id`)
3. Inserts new invoices or updates existing ones
4. Links invoices to bookings when possible

## 🎮 Usage

### Manual Sync
1. Go to **Admin Panel > Payments & Invoices**
2. Click **"Sync Payments from Stripe"** or **"Sync Invoices from Stripe"**
3. Wait for sync to complete
4. Click **"Refresh All"** to see updated data

### Automatic Sync
- Sync runs automatically when you open the Payments & Invoices page
- You can also set up webhooks for real-time sync (advanced)

## 🔐 Security

- ✅ **Admin-only access** - Only admin emails can sync data
- ✅ **JWT authentication** - Uses Supabase auth tokens
- ✅ **RLS policies** - Database-level security
- ✅ **Rate limiting** - API rate limiting enabled

## 🐛 Troubleshooting

### Backend Not Starting
```bash
# Check if dependencies are installed
cd backend
npm install

# Check environment variables
cat .env

# Start with verbose logging
npm run dev
```

### Sync Failing
1. **Check Stripe keys** - Make sure `STRIPE_SECRET_KEY` is correct
2. **Check Supabase keys** - Make sure `SUPABASE_SERVICE_ROLE_KEY` is correct
3. **Check database** - Make sure tables exist (run the SQL script)
4. **Check logs** - Look at browser console and backend logs

### No Data Showing
1. **Run sync manually** - Click the sync buttons
2. **Check database** - Verify data exists in `payments` and `invoices` tables
3. **Check permissions** - Make sure your admin email is in the RLS policies

## 📊 Database Schema

### Payments Table
- `stripe_payment_intent_id` - Stripe payment intent ID
- `amount` - Amount in euros (not cents)
- `status` - pending, succeeded, failed, canceled, refunded
- `payment_method` - card, bank_transfer, etc.

### Invoices Table  
- `stripe_invoice_id` - Stripe invoice ID
- `invoice_number` - Human-readable invoice number
- `amount` - Subtotal in euros
- `tax_amount` - Tax amount in euros
- `total_amount` - Total amount in euros
- `status` - draft, open, paid, void, uncollectible

## 🚀 Next Steps

1. **Run the SQL script** to create tables
2. **Install backend dependencies** 
3. **Set environment variables**
4. **Start backend server**
5. **Test sync functionality**

Your payments and invoices will now sync from Stripe! 🎉
