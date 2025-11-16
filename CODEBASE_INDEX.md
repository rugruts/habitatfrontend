# Habitat Lobby - Comprehensive Codebase Index

**Last Updated**: 2025-01-25  
**Version**: Production-Ready with Supabase Integration  
**Project**: Premium Apartment Booking Platform for Trikala, Greece

---

## 🏗️ Project Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS + Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe + SEPA Bank Transfers
- **Email**: Nodemailer (SMTP)
- **Deployment**: Vercel (Frontend) + Hostinger (Production)
- **State Management**: Zustand + React Query

---

## 📂 Project Structure

```
habitat-lobby-trio/
├── src/                          # Frontend source code
│   ├── components/               # Reusable UI components
│   │   ├── admin/               # Admin dashboard components
│   │   ├── checkout/            # Payment & booking components
│   │   └── ui/                  # Base UI components (shadcn/ui)
│   ├── pages/                   # React Router pages
│   │   ├── admin/               # Admin dashboard pages
│   │   └── *.tsx                # Public pages
│   ├── lib/                     # Core libraries & utilities
│   │   ├── supabase/            # Database utilities
│   │   └── translations/        # i18n translations
│   ├── hooks/                   # Custom React hooks
│   ├── contexts/                # React context providers
│   ├── services/                # API services
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions
│   ├── styles/                  # Global styles
│   └── data/                    # Static data & configs
├── backend/                      # Backend API (Node.js)
│   ├── api/                     # API endpoints
│   │   ├── stripe/              # Stripe webhooks
│   │   ├── email/               # Email services
│   │   ├── admin/               # Admin APIs
│   │   ├── calendar/            # Calendar sync
│   │   └── weather/             # Weather APIs
│   └── services/                # Backend services
├── supabase/                    # Database schema & migrations
├── deploy/                      # Production deployment files
└── *.sql                       # Database setup scripts
```

---

## 🗄️ Database Schema (Supabase)

### Core Tables

#### [`properties`](src/types/database.ts:12-44)
Premium apartment listings with comprehensive details
- **Fields**: id, name, slug, description, price_per_night, max_guests, bedrooms, bathrooms, amenities, images, location, active
- **Features**: JSON location data, array fields for amenities/images
- **Usage**: Main property management, availability checking

#### [`bookings`](src/types/database.ts:107-173)
Complete booking lifecycle management
- **Fields**: id, property_id, check_in, check_out, guests, customer_name, customer_email, total_amount, status, payment_intent_id
- **Statuses**: pending, confirmed, cancelled, completed
- **Integration**: Stripe payment intents, email automation

#### [`guests`](src/types/database.ts:233-305)
Guest relationship management with analytics
- **Fields**: id, first_name, last_name, email, phone, total_bookings, total_spent, id_verified, vip_status
- **Features**: Automatic booking tracking, VIP management, ID verification workflow

#### [`payments`](src/types/database.ts:307-370)
Payment processing with multiple methods
- **Fields**: id, booking_id, stripe_payment_intent_id, amount, currency, status, payment_method
- **Methods**: card, bank_transfer (SEPA), cash
- **Integration**: Full Stripe webhook processing

### Advanced Tables

#### [`email_templates`](complete-admin-system-schema.sql:27-38) & [`email_logs`](complete-admin-system-schema.sql:41-55)
Professional email automation system
- **Templates**: booking_confirmation, pre_arrival, post_stay, payment_confirmation
- **Logging**: Full email tracking with status monitoring
- **Variables**: Dynamic content replacement

#### [`calendar_syncs`](complete-admin-system-schema.sql:86-103) & [`external_bookings`](complete-admin-system-schema.sql:123-145)
Multi-platform calendar synchronization
- **Platforms**: Airbnb, Booking.com, VRBO, Expedia, Custom
- **Sync Types**: import, export, bidirectional
- **Conflict Prevention**: Automatic overlap detection

#### [`rate_rules`](complete-admin-system-schema.sql:170-189) & [`blackout_dates`](complete-admin-system-schema.sql:192-207)
Dynamic pricing and availability management
- **Rule Types**: seasonal, weekend, holiday, minimum_stay, advance_booking
- **Modifiers**: percentage, fixed_amount, absolute_price
- **Priority System**: Weighted rule application

---

## 🎨 Frontend Components

### Core Pages

#### [`src/pages/Index.tsx`](src/pages/Index.tsx:76)
**Main Landing Page** - Premium user experience with performance optimization
- **Features**: Hero section with stats, property showcase, reviews integration
- **Performance**: Lazy loading, image optimization, Web Vitals tracking
- **SEO**: Structured data, meta tags, social sharing

#### [`src/pages/ApartmentDetail.tsx`](src/pages/ApartmentDetail.tsx:1)
**Property Detail Page** - Comprehensive apartment information
- **Features**: Image galleries, amenities, nearby attractions, availability calendar
- **Integration**: Real-time availability, dynamic pricing, booking flow

#### [`src/pages/CheckoutEnhanced.tsx`](src/pages/CheckoutEnhanced.tsx:1)
**Payment Processing** - Multi-method payment system
- **Methods**: Stripe (cards), SEPA bank transfer, cash on arrival
- **Features**: Payment validation, booking confirmation, email automation
- **Security**: PCI compliance, fraud prevention

### Admin Dashboard

#### [`src/components/admin/BookingManagement.tsx`](src/components/admin/BookingManagement.tsx:1)
**Booking Administration** - Complete booking lifecycle management
- **Features**: Status updates, customer communication, payment tracking
- **Analytics**: Revenue reporting, occupancy rates, guest insights

#### [`src/components/admin/EmailAutomationManagement.tsx`](src/components/admin/EmailAutomationManagement.tsx:1)
**Email System** - Professional communication automation
- **Features**: Template management, automation rules, delivery tracking
- **Integration**: Supabase logging, error handling, retry logic

### Layout Components

#### [`src/components/Header.tsx`](src/components/Header.tsx:43)
**Navigation System** - Responsive header with mobile optimization
- **Features**: Mega menu, mobile navigation, language switcher, weather widget
- **Accessibility**: Keyboard navigation, screen reader support, focus management

#### [`src/components/Footer.tsx`](src/components/Footer.tsx:33)
**Footer Component** - Comprehensive footer with business information
- **Features**: Contact info, links, social media, trust indicators
- **SEO**: Structured data, local business information

---

## 🛠️ Services & Utilities

### Database Services

#### [`src/lib/supabase.ts`](src/lib/supabase.ts:1)
**Comprehensive Database Layer** - Production-ready Supabase integration
- **Helper Functions**: 1,794 lines of advanced database operations
- **Features**: 
  - Availability checking with conflict detection
  - Guest management with booking analytics
  - Payment processing with Stripe integration
  - Email automation with template system
  - Calendar sync with external platforms
  - Dynamic pricing with rule engine
  - Review system with moderation
  - Admin analytics and reporting

### API Services

#### [`src/lib/api.ts`](src/lib/api.ts:14)
**Booking API Client** - Frontend-backend communication
- **Functions**: `quote()`, `startCheckout()`
- **Features**: Price calculation, availability validation, Stripe integration
- **Fallback**: Graceful degradation to static data

#### [`src/lib/booking-email-service.ts`](src/lib/booking-email-service.ts:34)
**Email Service** - Professional email system for bookings
- **Templates**: Booking confirmation, SEPA payment instructions, payment received
- **Features**: HTML/text emails, professional styling, multi-language support
- **Integration**: Backend API, error handling, status tracking

### Utility Services

#### [`src/utils/performance.ts`](src/utils/performance.ts:14)
**Performance Monitoring** - Core Web Vitals and custom metrics
- **Metrics**: LCP, FID, CLS, custom timing
- **Features**: Real-time monitoring, analytics integration, development logging
- **Class**: `PerformanceMonitor` with singleton pattern

#### [`src/utils/accessibility.ts`](src/utils/accessibility.ts:4)
**Accessibility Framework** - WCAG compliance utilities
- **Classes**: `FocusManager`, `AriaAnnouncer`, `KeyboardNavigation`
- **Features**: Focus trapping, screen reader support, motion preferences
- **Compliance**: WCAG 2.1 AA standards

### Authentication

#### [`src/contexts/AuthContext.tsx`](src/contexts/AuthContext.tsx:5) & [`src/contexts/AdminAuthContext.tsx`](src/contexts/AdminAuthContext.tsx:5)
**Authentication System** - Dual-layer auth for users and admins
- **Guest Auth**: Basic user authentication
- **Admin Auth**: Role-based access control with email whitelist
- **Features**: Session management, protected routes, auto-refresh

---

## 🌐 Backend API Endpoints

### Core APIs

#### Email Services
- **[`/api/email/booking-confirmation`](backend/api/email/booking-confirmation.js:23)** - Send booking confirmations
- **[`/api/send-email`](backend/api/send-email.js:25)** - Generic email sending with validation
- **[`/api/contact`](backend/api/contact.js:3)** - Contact form processing

#### Payment Processing  
- **[`/api/stripe/webhook`](backend/api/stripe/webhook.js:10)** - Stripe webhook handler
  - **Events**: payment_intent.succeeded, payment_intent.payment_failed
  - **Actions**: Booking confirmation, status updates, error handling

#### Utility Services
- **`/api/weather/trikala`** - Local weather information
- **`/api/calendar/export`** - iCal calendar export
- **`/api/admin/sync-*`** - Admin data synchronization

### API Security
- **Authentication**: API key validation (`x-api-key` header)
- **CORS**: Production-ready with habitatlobby.com whitelist
- **Rate Limiting**: Configurable request limits
- **Environment**: Production/development configuration

---

## 💳 Payment Processing

### Stripe Integration
- **Frontend**: [`src/lib/stripe.ts`](src/lib/stripe.ts:6) - Client-side payment handling
- **Backend**: [`backend/api/stripe/webhook.js`](backend/api/stripe/webhook.js:4) - Webhook processing
- **Features**: Card payments, SEPA, payment intents, webhook validation
- **Security**: PCI compliance, fraud detection, secure tokenization

### SEPA Bank Transfers
- **Email Templates**: Professional payment instructions with IBAN details
- **Reference Codes**: Automated payment matching
- **Status Tracking**: Payment confirmation workflow
- **Integration**: Full booking lifecycle management

---

## 📊 Key Features

### Booking System
- **Real-time Availability**: Multi-source conflict detection
- **Dynamic Pricing**: Rule-based pricing engine with seasonal rates
- **Guest Management**: Comprehensive guest profiles with analytics
- **Payment Processing**: Multi-method payments with automated confirmation

### Admin Dashboard
- **Booking Management**: Complete lifecycle control with status tracking
- **Email Automation**: Template-based communication with scheduling
- **Calendar Sync**: Multi-platform synchronization (Airbnb, Booking.com)
- **Analytics**: Revenue tracking, occupancy rates, guest insights

### User Experience
- **Performance**: Core Web Vitals optimization, lazy loading
- **Accessibility**: WCAG 2.1 AA compliance, screen reader support
- **Mobile-First**: Responsive design with touch optimization
- **Internationalization**: Multi-language support with local preferences

### Business Operations
- **Property Management**: Multiple apartments with detailed information
- **Rate Management**: Seasonal pricing, weekend premiums, blackout dates
- **Guest Communication**: Automated emails, pre-arrival instructions
- **Financial Tracking**: Payment processing, invoicing, revenue reporting

---

## 🚀 Deployment & Environment

### Production Configuration
- **Frontend**: Vercel deployment with optimized builds
- **Backend**: Node.js APIs with Hostinger hosting
- **Database**: Supabase (managed PostgreSQL)
- **Email**: SMTP with Hostinger (admin@habitatlobby.com)
- **Domain**: habitatlobby.com with SSL

### Environment Variables
- **Frontend**: [`/.env`](.env:1) - 39 environment variables
- **Backend**: [`/backend/.env`](backend/.env:1) - Production SMTP, Supabase, Stripe config
- **Security**: API keys, database credentials, webhook secrets

### Database Setup
- **Schema**: [`complete-admin-system-schema.sql`](complete-admin-system-schema.sql:1) - 845-line complete setup
- **Features**: All tables, indexes, triggers, functions, RLS policies
- **Data**: Default templates, settings, sample data

---

## 🎯 Business Model

### Target Market
- **Location**: Trikala, Greece (Thessaly region)
- **Property Type**: Premium apartments with modern amenities
- **Target Guests**: Tourists, business travelers, digital nomads
- **Unique Selling Points**: Local experiences, cycling city, Meteora proximity

### Revenue Streams
- **Direct Bookings**: Primary revenue through habitatlobby.com
- **Channel Management**: Airbnb, Booking.com integration
- **Premium Services**: Local experiences, concierge services
- **Seasonal Optimization**: Dynamic pricing based on demand

---

## 📱 Contact & Support

- **Business Email**: admin@habitatlobby.com
- **Phone**: +30 697 769 0685
- **Address**: Alexandras 59, Trikala 42100, Greece
- **Website**: https://habitatlobby.com
- **Admin Access**: Restricted to authorized personnel only

---

## 🔧 Development Guidelines

### Code Quality
- **TypeScript**: Strict typing with proper interfaces
- **Performance**: Core Web Vitals monitoring and optimization
- **Accessibility**: WCAG 2.1 AA compliance throughout
- **Security**: Input validation, XSS prevention, CSRF protection

### Database Operations
- **Supabase**: Production-ready with RLS policies
- **Transactions**: Atomic operations for booking creation
- **Error Handling**: Comprehensive error management with logging
- **Performance**: Optimized queries with proper indexing

### Email System
- **Templates**: Professional HTML with fallback text
- **Automation**: Event-driven email workflows
- **Tracking**: Delivery status and error monitoring
- **Compliance**: GDPR-compliant with opt-out mechanisms

---

This codebase represents a production-ready, enterprise-level booking platform with comprehensive features for property management, guest experience, and business operations. The system is built with scalability, security, and user experience as primary considerations.
