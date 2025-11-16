# 🚀 Habitat Lobby - Deployment Guide

## 📁 **Deployment Folder Contents**

The `deploy/` folder contains all the production-ready files for your FTP deployment:

### **Core Files:**
- `index.html` - Main application entry point
- `favicon.ico` & `favicon.svg` - Updated logo favicon
- `.htaccess` - Apache configuration for SPA routing
- `robots.txt` - SEO configuration
- `sitemap.xml` - Search engine sitemap

### **Assets:**
- `assets/` - All compiled CSS, JS, and images
- Optimized and minified for production
- Includes all apartment images and icons

## 🔧 **Pre-Deployment Setup**

### **1. Database Migrations**
Run these SQL scripts in your Supabase SQL Editor:

```sql
-- Fix foreign key constraints
fix-scheduled-emails-constraint.sql

-- Create cash on arrival bookings table
src/lib/supabase/migrations/20231029000000_cash_on_arrival_bookings.sql

-- Fix availability check function
src/lib/supabase/migrations/20231030000000_fix_availability_function.sql
```

### **2. Environment Variables**
Ensure these are set in your hosting environment:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_STRIPE_SECRET_KEY=your_stripe_secret_key
```

### **3. Stripe Configuration**
- Set up your Stripe account
- Configure webhook endpoints
- Enable payment methods: Cards, Apple Pay, Google Pay, SEPA

## 📤 **FTP Deployment Steps**

### **Step 1: Upload Files**
1. Connect to your FTP server
2. Navigate to your website root directory
3. Upload all contents from the `deploy/` folder
4. Ensure `.htaccess` is uploaded (may be hidden)

### **Step 2: Verify Upload**
- Check that `index.html` is accessible
- Verify all assets load correctly
- Test the favicon appears in browser tabs

### **Step 3: Test Functionality**
- Test booking flow
- Verify payment methods work
- Check admin dashboard access
- Test email automation

## 🎯 **New Features Added**

### **✅ Updated Logo & Branding**
- Removed "Boutique Stays" tagline
- Updated favicon with new logo design
- Changed theme color to match brand

### **✅ Enhanced Payment Methods**
- **Credit/Debit Cards** - Visa, Mastercard, Amex
- **Apple Pay** - Automatic detection and integration
- **Google Pay** - Mobile payment support
- **SEPA Direct Debit** - EU bank transfers
- **Cash on Arrival** - Pay when you arrive

### **✅ Improved User Experience**
- Payment method selector with clear descriptions
- Security information and trust indicators
- Better error handling and user feedback
- Responsive design for all devices

## 🔒 **Security Features**

### **Content Security Policy**
- Secure script loading
- Protected against XSS attacks
- Safe external resource loading

### **Payment Security**
- Stripe-powered secure payments
- PCI DSS compliant
- Encrypted payment data
- No sensitive data stored locally

## 📱 **Mobile Optimization**

### **Progressive Web App Features**
- Service Worker for offline caching
- Fast loading with optimized assets
- Mobile-first responsive design
- Touch-friendly interface

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **404 Errors on Refresh**
   - Ensure `.htaccess` is uploaded
   - Check server supports URL rewriting

2. **Payment Methods Not Working**
   - Verify Stripe keys are correct
   - Check browser console for errors
   - Ensure HTTPS is enabled

3. **Database Connection Issues**
   - Verify Supabase credentials
   - Check network connectivity
   - Run database migrations

4. **Images Not Loading**
   - Check file permissions
   - Verify asset paths
   - Clear browser cache

## 📞 **Support**

If you encounter any issues:
1. Check browser console for errors
2. Verify all environment variables
3. Test in incognito mode
4. Contact support with error details

## 🎉 **Deployment Complete!**

Your Habitat Lobby website is now live with:
- ✅ Modern, responsive design
- ✅ Multiple payment options
- ✅ Secure booking system
- ✅ Admin dashboard
- ✅ Email automation
- ✅ Multi-language support

**Happy hosting! 🏠✨**
