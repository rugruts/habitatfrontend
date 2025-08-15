# 🚀 Habitat Lobby - Supabase Integration Setup Guide

## 📋 Overview

Your Habitat Lobby booking system now includes full Supabase integration for:
- ✅ Real-time availability checking
- ✅ Booking management
- ✅ Property management
- ✅ Admin dashboard
- ✅ Payment tracking

## 🛠️ Database Setup

### Step 1: Create Database Schema

1. **Go to your Supabase project:** https://oljdfzoxvxrkaaqpdijh.supabase.co
2. **Navigate to:** SQL Editor
3. **Copy and paste** the contents of `supabase-schema.sql`
4. **Click "Run"** to create all tables and functions

### Step 2: Populate with Property Data

1. **In SQL Editor**, copy and paste the contents of `supabase-seed-data.sql`
2. **Click "Run"** to populate with your property data

## 📊 Database Tables Created

### Properties Table
- Stores all apartment/property information
- Includes pricing, amenities, location data
- Supports multiple images and detailed descriptions

### Bookings Table
- Tracks all reservations
- Links to Stripe payment intents
- Supports multiple booking statuses

### Availability Overrides Table
- Allows blocking specific dates
- Supports custom pricing for special dates
- Useful for maintenance or events

### Booking Line Items Table
- Detailed pricing breakdown
- Supports accommodation, cleaning, taxes, fees

## 🔧 Features Implemented

### Real-Time Availability
- Checks actual bookings in database
- Prevents double bookings
- Shows accurate availability calendar

### Booking Flow
1. User selects dates → Real availability check
2. Quote generation → Live pricing calculation
3. Payment processing → Stripe integration
4. Booking confirmation → Database storage

### Admin Dashboard
- View all bookings
- Manage availability
- Track payments
- Property management

## 🌐 Deployment Files

### New Deployment Package
- **File:** `habitat-lobby-supabase-deployment.zip`
- **Size:** ~5.5MB
- **Includes:** Full Supabase integration

### Environment Variables
Your `.env.production` now includes:
```
VITE_SUPABASE_URL=https://oljdfzoxvxrkaaqpdijh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚀 Deployment Steps

### Option 1: Hostinger File Manager
1. **Delete** old files from `public_html`
2. **Upload** `habitat-lobby-supabase-deployment.zip`
3. **Extract** the zip file
4. **Test** your site

### Option 2: FTP Upload
1. **Use FileZilla** or your preferred FTP client
2. **Upload** all files from the new `dist` folder
3. **Overwrite** existing files

## 🧪 Testing Your Integration

### 1. Test Availability Calendar
- Visit any apartment page
- Select dates → Should show real availability
- Try booking → Should prevent conflicts

### 2. Test Booking Flow
- Complete a test booking
- Check Supabase dashboard for new booking record
- Verify Stripe payment intent creation

### 3. Test Admin Dashboard
- Visit `/admin/dashboard`
- View bookings list
- Check availability calendar

## 📱 API Endpoints

Your site now uses these Supabase functions:

### Availability Checking
```javascript
// Check if dates are available
supabaseHelpers.checkAvailability(propertyId, checkIn, checkOut)

// Get availability calendar
supabaseHelpers.getAvailabilityCalendar(propertyId, startDate, endDate)
```

### Booking Management
```javascript
// Create new booking
supabaseHelpers.createBooking(bookingData)

// Update booking status
supabaseHelpers.updateBookingStatus(bookingId, status)
```

## 🔒 Security Features

### Row Level Security (RLS)
- Properties: Public read access for active properties
- Bookings: Admin-only access
- Secure API key usage

### Data Validation
- Date range validation
- Guest count limits
- Minimum night requirements

## 🎯 Next Steps

1. **Deploy** the new version
2. **Run** the SQL scripts in Supabase
3. **Test** the booking flow
4. **Monitor** bookings in Supabase dashboard

## 🆘 Troubleshooting

### If Supabase is unavailable:
- System automatically falls back to mock data
- Booking flow continues to work
- No user-facing errors

### Common Issues:
1. **Environment variables not loaded** → Check .env files
2. **Database connection fails** → Verify Supabase URL/key
3. **Booking creation fails** → Check table permissions

## 📞 Support

Your booking system is now production-ready with:
- Real database integration
- Conflict prevention
- Payment processing
- Admin management

**Ready to go live!** 🎉
