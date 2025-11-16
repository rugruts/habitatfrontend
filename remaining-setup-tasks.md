# Remaining Setup Tasks for Habitat Lobby

## Current Status
The Habitat Lobby property management system has been developed with most features complete, but there are still some setup steps that need to be performed to get the system fully operational.

## Database Setup Required

### 1. Core Database Schema
The main database schema (`supabase-schema.sql`) has been created but may need to be updated with additional fields:

- Run `ADD_MISSING_PROPERTY_FIELDS.sql` to add missing columns to properties table
- Verify all new columns exist in properties table
- Test RLS policies are working correctly

### 2. Property Data Migration
Properties need to be added to the database:

- Run `MIGRATE_APARTMENTS_TO_DB.sql` to add the 2 sample apartments to the properties table
- This will populate the database with initial property data

### 3. Image Support
Image functionality needs to be enabled:

- Run `SIMPLE_ADD_IMAGES.sql` to add image support and sample images
- This adds the images column to the properties table

### 4. Rate Management Tables
Rate rules and blackout dates functionality needs to be set up:

- Run `RATE_RULES_SCHEMA.sql` to create rate_rules and blackout_dates tables
- This enables the rate management features in the admin panel

### 5. Additional Setup Scripts
Several other SQL scripts may need to be run:

- `setup-database.sql` - Complete database setup with all required tables
- `system-settings-setup.sql` - System settings table and initial data
- `fix-guests-table-structure.sql` - Guest table structure fixes
- `create-guests-from-existing-bookings.sql` - Migrate existing booking guests to guests table
- `create-guest-notes-table.sql` - Guest notes functionality
- `create-payments-invoices-tables.sql` - Payment and invoice tables

## Environment Configuration Required

### 1. Environment Variables
The following environment variables need to be configured in the hosting environment:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 2. Supabase Configuration
- Ensure storage buckets (`property-images`, `documents`) exist
- Test image upload functionality works
- Verify authentication is properly configured
- Create admin user accounts

## Deployment Steps Required

### 1. Build for Production
```bash
npm run build
```

### 2. Deploy Files
Upload all contents from the `deploy/` folder to your hosting provider:
- Ensure `.htaccess` is uploaded (may be hidden)
- Verify all assets load correctly
- Test the favicon appears in browser tabs

### 3. Test Functionality
- Test admin login with default credentials
- Test property management features
- Test booking flow
- Verify payment methods work
- Check email automation

## Admin Panel Setup

### 1. Admin Account Creation
Default admin accounts have been created:
- `admin@habitat.com` with role 'admin'
- `info@habitatlobby.com` with role 'admin'

These should be updated with secure passwords after initial setup.

### 2. Property Management Testing
After running the setup scripts, verify:
- Properties tab shows 2 properties with images
- Rate Rules tab is ready for pricing rules
- Blackout Dates tab is ready for blocking dates
- Price Calendar tab is ready for visual management

## Payment System Configuration

### 1. Stripe Setup
- Set up your Stripe account
- Configure webhook endpoints
- Enable payment methods: Cards, Apple Pay, Google Pay, SEPA, Cash on Arrival

### 2. Test Payments
- Verify Stripe keys are correct
- Test payment processing with test cards
- Check browser console for errors
- Ensure HTTPS is enabled

## Email System Configuration

### 1. Email Service Setup
- Configure Postmark or other email service
- Set up email templates
- Test email automation system

### 2. Email Templates
- Run `setup-email-templates.sql` to set up email templates
- Configure email automation rules
- Test email sending functionality

## Content Security Policy

Some minor issues may still exist:
- Preload warnings (performance optimization, doesn't affect functionality)
- hCaptcha warnings (third-party service, doesn't affect core functionality)
- Stripe Link payment method warning (test mode only)

## Mobile Optimization

Verify:
- Progressive Web App features work
- Touch-friendly interface functions
- Fast loading times
- Responsive design on all devices

## Monitoring and Maintenance

After deployment:
1. Monitor error logs in hosting platform
2. Check browser console for JavaScript errors
3. Watch Supabase logs for database issues
4. Monitor page load times and performance
5. Set up automated backups for database

## Common Issues to Watch For

1. **404 Errors on Refresh** - Ensure `.htaccess` is uploaded and server supports URL rewriting
2. **Payment Methods Not Working** - Verify Stripe keys and HTTPS
3. **Database Connection Issues** - Verify Supabase credentials and run migration scripts
4. **Images Not Loading** - Check file permissions and storage policies
5. **Admin Access Denied** - Check RLS policies and user permissions

## Next Steps Summary

1. Run all required SQL scripts in Supabase
2. Configure environment variables
3. Set up Stripe payment processing
4. Configure email services
5. Deploy files to hosting platform
6. Test all functionality
7. Update admin credentials
8. Monitor for any issues