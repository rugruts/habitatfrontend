# Security Guidelines for Habitat Lobby

## Overview

This document outlines security best practices and procedures for maintaining the security of the Habitat Lobby application.

## Environment Variables

### Frontend (.env - VITE_ prefix)
- **VITE_SUPABASE_ANON_KEY**: Public key, safe to expose in browser
- **VITE_STRIPE_PUBLISHABLE_KEY**: Public key, safe to expose in browser
- **VITE_API_URL**: Backend API endpoint
- **VITE_EMAIL_API_KEY**: API key for backend communication (should be rotated regularly)

### Backend (backend/.env - NO prefix)
- **SUPABASE_SERVICE_ROLE_KEY**: ⚠️ NEVER expose in frontend - server-side only
- **STRIPE_SECRET_KEY**: ⚠️ NEVER expose in frontend - server-side only
- **STRIPE_WEBHOOK_SECRET**: ⚠️ NEVER expose in frontend - server-side only
- **SMTP_PASSWORD**: ⚠️ NEVER expose in frontend - server-side only

## Secret Rotation Procedures

### Stripe Keys Rotation
1. Go to Stripe Dashboard → Settings → API Keys
2. Generate new publishable and secret keys
3. Update `VITE_STRIPE_PUBLISHABLE_KEY` in frontend `.env`
4. Update `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in backend `.env`
5. Redeploy both frontend and backend
6. Archive old keys in Stripe dashboard

### Supabase Keys Rotation
1. Go to Supabase Dashboard → Settings → API
2. Generate new anon key and service role key
3. Update `VITE_SUPABASE_ANON_KEY` in frontend `.env`
4. Update `SUPABASE_SERVICE_ROLE_KEY` in backend `.env`
5. Redeploy both frontend and backend
6. Revoke old keys

### Email API Key Rotation
1. Generate new API key in your backend system
2. Update `VITE_EMAIL_API_KEY` in frontend `.env`
3. Redeploy frontend
4. Update backend to accept both old and new keys temporarily
5. After verification, remove old key support

## Security Headers

The application implements the following security headers:

```
Content-Security-Policy: default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; frame-src https://js.stripe.com https://hooks.stripe.com; connect-src 'self' https:;
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Row Level Security (RLS)

All database tables have RLS enabled with specific policies:

- **Public Read**: units, images, rates, availability
- **Admin Only**: bookings, payments, users, audits
- **Authenticated Only**: user-specific data

## Payment Security

- All payment processing happens on the backend
- Stripe webhook signatures are verified
- Payment intents use idempotency keys
- Bookings are soft-held during payment processing
- Holds are released on payment failure

## Booking Security

- Bookings can only be created via backend API
- Availability is checked server-side
- Soft holds prevent double-booking
- Holds expire after 15 minutes if payment not completed

## Audit Logging

All admin mutations are logged to the `audits` table with:
- User ID
- Action type
- Resource ID
- Changes made
- Timestamp

## Incident Response

If a secret is compromised:
1. Immediately rotate the affected key
2. Review audit logs for unauthorized access
3. Notify affected users if necessary
4. Update all systems using the old key
5. Document the incident

## Regular Security Checks

- Review git history for accidentally committed secrets
- Audit RLS policies quarterly
- Review admin access logs monthly
- Update dependencies regularly
- Run security audits with `npm audit`

## Deployment Security

- Use environment variables for all secrets
- Never commit `.env` files
- Use `.env.sample` for documentation
- Verify secrets are set before deployment
- Use HTTPS for all connections
- Enable HSTS headers

