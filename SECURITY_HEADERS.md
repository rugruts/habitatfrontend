# Security Headers Configuration

## Overview

This document explains the security headers implemented in Habitat Lobby and their purpose.

## Headers Implemented

### 1. Strict-Transport-Security (HSTS)

**Value**: `max-age=31536000; includeSubDomains; preload`

**Purpose**: Forces HTTPS connections for 1 year

**Why**: Prevents man-in-the-middle attacks by ensuring all communication is encrypted

**Testing**:
```bash
curl -I https://habitatlobby.com | grep Strict-Transport-Security
```

### 2. X-Content-Type-Options

**Value**: `nosniff`

**Purpose**: Prevents MIME type sniffing

**Why**: Stops browsers from guessing content types, preventing XSS attacks

### 3. X-Frame-Options

**Value**: `DENY`

**Purpose**: Prevents clickjacking attacks

**Why**: Prevents the site from being embedded in iframes on other domains

**Note**: Stripe iframes are allowed via CSP frame-src directive

### 4. X-XSS-Protection

**Value**: `1; mode=block`

**Purpose**: Enables browser XSS protection

**Why**: Provides additional XSS protection in older browsers

### 5. Referrer-Policy

**Value**: `strict-origin-when-cross-origin`

**Purpose**: Controls referrer information

**Why**: Prevents leaking sensitive URLs to external sites while allowing same-origin requests

### 6. Permissions-Policy

**Value**: Disables camera, microphone, USB, magnetometer, gyroscope, accelerometer

**Purpose**: Restricts access to device features

**Why**: Prevents malicious scripts from accessing sensitive hardware

**Allowed**:
- `geolocation=(self)` - For location-based features
- `payment=(self)` - For Stripe payments

### 7. Content-Security-Policy (CSP)

**Directives**:

| Directive | Sources | Purpose |
|-----------|---------|---------|
| `default-src` | `'self'` | Default policy for all content |
| `script-src` | `'self'`, `https://js.stripe.com` | Allow scripts from self and Stripe |
| `frame-src` | `'self'`, `https://js.stripe.com` | Allow iframes from self and Stripe |
| `connect-src` | `'self'`, Stripe, Supabase, backend | Allow API connections |
| `img-src` | `'self'`, `data:`, `https:` | Allow images from self and HTTPS |
| `style-src` | `'self'`, `'unsafe-inline'`, Google Fonts | Allow styles |
| `font-src` | `'self'`, Google Fonts | Allow fonts |
| `object-src` | `'none'` | Disable plugins |

**Why**: Prevents XSS attacks by restricting where content can be loaded from

## Testing Security Headers

### Local Testing

```bash
# Start backend
npm run dev

# Check headers
curl -I http://localhost:3001/health
```

### Production Testing

```bash
# Check frontend headers
curl -I https://habitatlobby.com

# Check backend headers
curl -I https://backendhabitatapi.vercel.app/health
```

### Online Tools

- https://securityheaders.com - Scan your site
- https://csp-evaluator.withgoogle.com - Evaluate CSP
- https://observatory.mozilla.org - Mozilla Observatory

## CSP Violations

If you see CSP violations in the browser console:

1. Check the error message for the blocked resource
2. Add the source to the appropriate directive in `security-headers.js`
3. Test locally before deploying
4. Document the reason for the exception

### Common CSP Violations

**Stripe**: Already allowed via `https://js.stripe.com`

**Google Fonts**: Already allowed via `https://fonts.googleapis.com`

**Supabase**: Already allowed via `https://*.supabase.co`

**Custom Domain**: Add to `connect-src` if needed

## Deployment

### Frontend (Vercel)

Security headers are configured in `vercel.json`:

```bash
# Deploy
vercel deploy

# Verify headers
curl -I https://habitatlobby.com
```

### Backend (Vercel)

Security headers are applied via middleware in `backend/server.js`:

```bash
# Deploy
cd backend
vercel deploy

# Verify headers
curl -I https://backendhabitatapi.vercel.app/health
```

## Monitoring

### Check Headers Regularly

```bash
# Create a monitoring script
#!/bin/bash
curl -I https://habitatlobby.com | grep -E "Strict-Transport-Security|X-Frame-Options|Content-Security-Policy"
```

### Browser DevTools

1. Open DevTools (F12)
2. Go to Network tab
3. Click any request
4. Check Response Headers

### CSP Violations

1. Open DevTools Console
2. Look for CSP violation messages
3. Report violations to Sentry (Phase 6)

## Best Practices

1. **Never use `'unsafe-inline'` for scripts** - Use nonces or hashes instead
2. **Keep CSP strict** - Only allow what's necessary
3. **Test before deploying** - Use staging environment
4. **Monitor violations** - Set up CSP violation reporting
5. **Update regularly** - Review headers quarterly

## Future Improvements

1. Remove `'unsafe-inline'` from script-src (requires build changes)
2. Add CSP violation reporting endpoint
3. Implement nonce-based CSP
4. Add Subresource Integrity (SRI) for external scripts
5. Implement Report-Only mode for testing

## References

- [MDN: HTTP Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [OWASP: Security Headers](https://owasp.org/www-project-secure-headers/)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Security Headers](https://securityheaders.com/)

