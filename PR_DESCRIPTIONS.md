# Habitat Lobby - PR Descriptions

This document contains descriptions for all PRs being created to augment the Habitat Lobby repository.

## PR 1: Repository Hygiene & Security Foundation

**Branch**: `feat/security-foundation`

**Description**:
Establishes security best practices and repository hygiene for the Habitat Lobby project.

**Changes**:
- `.env.sample` - Template for all environment variables with security notes
- `SECURITY.md` - Comprehensive security guidelines, secret rotation, RLS policies
- `LOCAL_SETUP.md` - Step-by-step development setup guide with troubleshooting
- `package.json` - Added scripts: typecheck, db:migrate, db:seed, sync:ical
- `supabase/migrations/20250116000000_create_booking_payment_system.sql` - Database schema with RLS

**Testing Steps**:
1. Copy `.env.sample` to `.env` and fill in values
2. Run `npm run db:migrate` to apply migrations
3. Verify RLS policies are active: `SELECT * FROM pg_policies;`
4. Check health endpoint: `curl http://localhost:3001/health`

**Security Considerations**:
- Never commit `.env` file
- All Stripe secret keys server-side only
- RLS policies enforce data access control
- Audit table logs all admin mutations

---

## PR 2: Payment System Backend Implementation

**Branch**: `feat/stripe-webhook`

**Description**:
Implements secure Stripe payment processing with webhook handling, booking management, and availability checking.

**Changes**:
- `backend/lib/availability.js` - Soft holds, availability checking, hold expiration
- `backend/lib/pricing.js` - Price calculations with fees and breakdown
- `backend/lib/stripe-server.js` - Secure Stripe operations (server-side only)
- `backend/api/booking.js` - Booking creation, quotes, cancellation
- `backend/api/stripe-webhook.js` - Webhook event handling
- `backend/API_DOCUMENTATION.md` - Complete API endpoint documentation
- `backend/server.js` - Integrated new routes with graceful fallback

**Testing Steps**:
1. Install Stripe CLI: `stripe login`
2. Forward webhooks: `stripe listen --forward-to localhost:3001/api/stripe/webhook`
3. Test booking creation:
   ```bash
   curl -X POST http://localhost:3001/api/booking/create \
     -H "Content-Type: application/json" \
     -d '{
       "unitId": "550e8400-e29b-41d4-a716-446655440000",
       "checkIn": "2025-02-01",
       "checkOut": "2025-02-05",
       "guestName": "John Doe",
       "guestEmail": "john@example.com",
       "guestPhone": "+30 123 456 7890"
     }'
   ```
4. Test quote generation:
   ```bash
   curl -X POST http://localhost:3001/api/booking/quote \
     -H "Content-Type: application/json" \
     -d '{
       "unitId": "550e8400-e29b-41d4-a716-446655440000",
       "checkIn": "2025-02-01",
       "checkOut": "2025-02-05"
     }'
   ```
5. Use Stripe test card: 4242 4242 4242 4242

**Security Considerations**:
- All Stripe operations use server-side secret key
- Webhook signatures verified before processing
- Idempotency keys prevent duplicate charges
- Soft holds prevent double-booking during payment
- Payment intents linked to bookings via metadata

**Database Changes**:
- `bookings` table with status tracking
- `payments` table linked to Stripe payment intents
- `availability` table for soft holds and blocks
- `audits` table for logging mutations

---

## PR 3: iCal Sync & Calendar Integration

**Branch**: `feat/ical-sync`

**Description**:
Implements iCal feed ingestion from OTA platforms (Airbnb, Booking.com) and exports property calendars.

**Changes**:
- `supabase/migrations/20250117000000_create_ical_tables.sql` - iCal feed tables
- `backend/lib/ical-sync.js` - Parse and sync iCal feeds
- `backend/api/cron/sync-ical.js` - Scheduled sync endpoint
- `backend/api/ical/[unitSlug].js` - Export property calendar as iCal

**Testing Steps**:
1. Add iCal feed URL in admin panel
2. Trigger sync: `curl http://localhost:3001/api/cron/sync-ical`
3. Export calendar: `curl http://localhost:3001/api/ical/apartment-1.ics`
4. Import into calendar app to verify

---

## PR 4: Security Headers & CSP

**Branch**: `feat/security-headers`

**Description**:
Implements security headers and Content Security Policy for production deployments.

**Changes**:
- `vercel.json` - Security headers configuration
- `backend/middleware/security-headers.js` - CSP and security headers
- `.github/workflows/security-audit.yml` - Automated security checks

**Testing Steps**:
1. Deploy to Vercel
2. Check headers: `curl -I https://habitatlobby.com`
3. Verify CSP: Check browser console for CSP violations

---

## PR 5: Email Templates & ICS Calendar

**Branch**: `feat/email-templates`

**Description**:
Creates email templates and ICS calendar attachments for booking confirmations.

**Changes**:
- `backend/lib/ics/createReservation.js` - Generate ICS calendar file
- `backend/templates/booking-confirmation.html` - HTML email template
- `backend/templates/booking-pending.html` - Pending confirmation template
- `backend/templates/cancellation.html` - Cancellation template
- `backend/templates/refund.html` - Refund notification template

**Testing Steps**:
1. Create booking via API
2. Check email inbox for confirmation
3. Verify ICS attachment opens in calendar app
4. Test cancellation email

---

## PR 6: CI/CD Pipeline & Observability

**Branch**: `feat/ci-sentry`

**Description**:
Adds GitHub Actions CI/CD pipeline and Sentry error tracking.

**Changes**:
- `.github/workflows/ci.yml` - Lint, typecheck, test, build
- `.github/workflows/deploy.yml` - Deploy to Vercel on main branch
- `backend/lib/sentry.js` - Sentry initialization
- `src/lib/sentry.ts` - Frontend Sentry setup

**Testing Steps**:
1. Push to feature branch - CI runs
2. Create PR - checks must pass
3. Merge to main - auto-deploys to Vercel
4. Trigger error - verify Sentry captures it

---

## PR 7: Admin Dashboard Hardening

**Branch**: `feat/admin-hardening`

**Description**:
Hardens admin dashboard with proper authentication, authorization, and audit logging.

**Changes**:
- `src/components/admin/AdminGuard.tsx` - Role-based access control
- `backend/middleware/admin-auth.js` - Admin authentication middleware
- `backend/api/admin/audit-log.js` - Audit log endpoint
- `src/pages/AdminDashboard.tsx` - Updated with proper auth

**Testing Steps**:
1. Login as non-admin - access denied
2. Login as admin - full access
3. Perform admin action - verify audit log entry
4. Check audit log in admin panel

---

## Implementation Order

1. **PR 1**: Repository Hygiene & Security Foundation (DONE)
2. **PR 2**: Payment System Backend Implementation (DONE)
3. **PR 3**: iCal Sync & Calendar Integration (NEXT)
4. **PR 4**: Security Headers & CSP
5. **PR 5**: Email Templates & ICS Calendar
6. **PR 6**: CI/CD Pipeline & Observability
7. **PR 7**: Admin Dashboard Hardening

Each PR is independent and can be merged separately. PRs should be reviewed and tested before merging.

