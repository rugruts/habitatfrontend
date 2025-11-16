# Habitat Lobby - Deployment Requirements

## Overview
This document outlines all requirements for deploying the Habitat Lobby property management system. The system consists of a React/TypeScript frontend with a Supabase backend, integrated with Stripe for payments and various third-party services.

## Prerequisites

### 1. Development Environment
- Node.js version 16.x or higher
- npm or yarn package manager
- Git for version control
- Code editor (VS Code recommended)

### 2. Supabase Setup
- Supabase account (free or paid tier)
- New Supabase project created
- Project URL and API keys available

### 3. Stripe Account
- Stripe account (test mode for development, live for production)
- API keys (publishable and secret)
- Webhook signing secret

### 4. Domain and Hosting
- Custom domain name (optional but recommended)
- Hosting platform (Vercel, Netlify, or custom server)
- SSL certificate (provided by hosting platform)

## Supabase Configuration

### 1. Database Schema
Run the following SQL files in your Supabase SQL editor in order:
1. `supabase-schema.sql` - Main database schema
2. `system-settings-setup.sql` - System settings table and initial data
3. `fix-guests-table-structure.sql` - Guest table structure fixes
4. `create-guests-from-existing-bookings.sql` - Migrate existing booking guests to guests table
5. `create-guest-notes-table.sql` - Guest notes functionality
6. `create-payments-invoices-tables.sql` - Payment and invoice tables

### 2. Authentication
- Enable email/password authentication
- Create admin user accounts
- Configure Row Level Security (RLS) policies (already included in schema)

### 3. Storage
Create the following storage buckets:
- `property-images` - For property photos and media
- `documents` - For guest documents and other files

Set appropriate access policies for storage buckets:
- Public read access for property images
- Authenticated write access for document uploads

### 4. Functions
The following database functions are used by the application:
- `check_property_availability` - Check if dates are available for booking
- `update_setting` - Update system settings with history tracking

These are included in the schema files and will be created automatically.

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email Services (Postmark/Elorus)
VITE_POSTMARK_API_KEY=your_postmark_api_key
VITE_ELRUS_API_KEY=your_elorus_api_key

# Other Services
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

## Third-Party Services

### 1. Stripe Payment Processing
Required for payment processing:
- Account created and verified
- Bank account linked for payouts
- API keys configured
- Webhook endpoint configured in Stripe dashboard:
  `https://yourdomain.com/api/webhooks/stripe`

### 2. Email Services
#### Postmark (Primary)
- Account created
- Sender signature verified
- API key configured
- Templates created for transactional emails

#### Elorus (Optional - Invoicing)
- Account created
- API key configured
- Invoice templates created

### 3. Cloudinary (Optional - Image Management)
- Account created
- Cloud name and upload preset configured
- API keys configured

### 4. Google Maps (Optional - Property Location)
- Google Cloud Platform account
- Maps JavaScript API enabled
- API key configured with appropriate restrictions

## Build and Deployment

### 1. Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Production Build
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### 3. Deployment Options

#### Vercel (Recommended)
1. Connect your Git repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy

#### Netlify
1. Connect your Git repository to Netlify
2. Set environment variables in Netlify dashboard
3. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Deploy

#### Custom Server
1. Build the application: `npm run build`
2. Upload the `dist` folder to your server
3. Configure your web server (nginx, Apache, etc.) to serve the static files
4. Set environment variables on the server

## SSL and HTTPS
Ensure your hosting platform provides SSL certificates or configure your own:
- Let's Encrypt (free)
- Commercial SSL certificate
- Cloudflare SSL (if using Cloudflare)

## Domain Configuration
1. Point your domain's DNS to your hosting platform
2. Configure www and non-www redirects as needed
3. Set up email DNS records (MX, SPF, DKIM) if using custom email

## Post-Deployment Setup

### 1. Admin Account Creation
1. Navigate to the admin login page
2. Create your first admin account
3. Configure business settings in the admin panel

### 2. Property Setup
1. Add your properties through the admin panel
2. Upload property images
3. Configure pricing and availability
4. Set up amenities and house rules

### 3. Email Configuration
1. Configure email templates in the admin panel
2. Set up email automation rules
3. Test email sending functionality

### 4. Payment Configuration
1. Verify Stripe webhook is working
2. Test payment processing with test cards
3. Configure payout settings in Stripe dashboard

### 5. Calendar Synchronization
1. Connect your external calendar platforms (Airbnb, Booking.com)
2. Configure import/export settings
3. Test calendar synchronization

## Monitoring and Maintenance

### 1. Error Tracking
Set up error tracking with services like:
- Sentry
- Rollbar
- Custom logging solution

### 2. Performance Monitoring
- Google Analytics
- Page performance monitoring
- Uptime monitoring

### 3. Database Backups
- Enable Supabase database backups
- Set up automated export procedures
- Test restore procedures

### 4. Security Updates
- Regular dependency updates
- Security scanning
- SSL certificate renewal

## Troubleshooting Common Issues

### 1. Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies
- Ensure database is not paused

### 2. Payment Processing Issues
- Verify Stripe keys
- Check webhook configuration
- Test with Stripe test cards

### 3. Email Sending Issues
- Verify Postmark/Elorus API keys
- Check domain verification
- Review email sending limits

### 4. Deployment Issues
- Check build logs for errors
- Verify environment variables
- Ensure all dependencies are installed

## Support and Maintenance

For ongoing support and maintenance:
- Keep dependencies updated
- Monitor application performance
- Regular security audits
- Backup procedures
- Update documentation as needed