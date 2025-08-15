# 🚀 Production Deployment Guide - habitatlobby.com

## Overview
This guide covers deploying the Habitat Lobby application to production on habitatlobby.com with Supabase backend.

## 📋 Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] Update `.env.production` with live Stripe keys
- [ ] Verify Supabase production URL and keys
- [ ] Set correct domain URLs (habitatlobby.com)
- [ ] Configure email service credentials
- [ ] Set up analytics tracking IDs

### 2. Supabase Backend Setup
- [ ] Database schema is up to date
- [ ] Row Level Security (RLS) policies configured
- [ ] API keys and permissions set correctly
- [ ] Storage buckets configured (if needed)
- [ ] Edge functions deployed (if any)

### 3. Stripe Configuration
- [ ] Switch from test to live Stripe keys
- [ ] Configure webhook endpoints for production
- [ ] Test payment processing in live mode
- [ ] Set up proper error handling

## 🏗️ Build Process

### Option 1: Automated Build Script
```bash
node deploy-production.js
```

### Option 2: Manual Build
```bash
# Install dependencies
npm install

# Run checks
npx tsc --noEmit
npm run lint

# Build for production
npm run build:prod
```

## 🌐 Deployment Steps

### 1. Upload Files
Upload the contents of the `dist/` folder to your web server:
- **Hostinger**: Upload to `public_html/` directory
- **Vercel**: Connect GitHub repo and deploy
- **Netlify**: Drag and drop `dist/` folder
- **Custom Server**: Upload to web root directory

### 2. Web Server Configuration

#### Apache (.htaccess)
Create `.htaccess` in your web root:
```apache
RewriteEngine On
RewriteBase /

# Handle Angular/React Router
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name habitatlobby.com www.habitatlobby.com;
    root /var/www/habitatlobby;
    index index.html;

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
}
```

### 3. SSL Certificate Setup
Use the generated SSL certificate:
```bash
# Install the certificate files:
# - habitatlobby.com.crt (from CA)
# - habitatlobby.com.key (private key)
# - intermediate.crt (CA bundle)
```

### 4. DNS Configuration
Point your domain to the server:
```
A Record: habitatlobby.com → Your Server IP
CNAME: www.habitatlobby.com → habitatlobby.com
```

## 🔧 Supabase Production Setup

### 1. Database Migration
Run the schema update:
```sql
-- Apply the guest table updates
-- (Use the UPDATE_GUEST_SCHEMA.sql file)
```

### 2. Environment Variables
Update Supabase project settings:
- Site URL: `https://habitatlobby.com`
- Redirect URLs: `https://habitatlobby.com/**`

### 3. API Keys
Ensure you're using the correct keys:
- `VITE_SUPABASE_URL`: Your project URL
- `VITE_SUPABASE_ANON_KEY`: Public anon key

## 💳 Stripe Production Setup

### 1. Switch to Live Mode
- Get live publishable key: `pk_live_...`
- Get live secret key: `sk_live_...`
- Update webhook endpoint: `https://habitatlobby.com/api/stripe/webhook`

### 2. Webhook Configuration
Set up webhooks for:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `checkout.session.completed`

## 📧 Email Service Setup

### 1. Production Email Provider
Configure with services like:
- **Postmark**: Professional transactional emails
- **SendGrid**: Reliable email delivery
- **AWS SES**: Cost-effective solution

### 2. Email Templates
Ensure booking confirmation emails work:
- Test email delivery
- Verify template rendering
- Check spam folder placement

## 🧪 Post-Deployment Testing

### 1. Functionality Tests
- [ ] Homepage loads correctly
- [ ] Property listings display
- [ ] Booking flow works end-to-end
- [ ] Payment processing (small test amount)
- [ ] Email confirmations sent
- [ ] Admin dashboard accessible

### 2. Performance Tests
- [ ] Page load speeds < 3 seconds
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility
- [ ] SSL certificate valid

### 3. SEO & Analytics
- [ ] Google Analytics tracking
- [ ] Meta tags and descriptions
- [ ] Sitemap.xml accessible
- [ ] robots.txt configured

## 🔒 Security Checklist

- [ ] HTTPS enforced (redirect HTTP to HTTPS)
- [ ] Security headers configured
- [ ] API keys secured (not exposed in frontend)
- [ ] Database RLS policies active
- [ ] Regular backups scheduled
- [ ] Error logging configured

## 📊 Monitoring Setup

### 1. Uptime Monitoring
- Set up monitoring with services like:
  - UptimeRobot
  - Pingdom
  - StatusCake

### 2. Error Tracking
- Configure error reporting:
  - Sentry
  - LogRocket
  - Bugsnag

### 3. Analytics
- Google Analytics 4
- Facebook Pixel (if using ads)
- Conversion tracking

## 🚨 Troubleshooting

### Common Issues:
1. **404 on refresh**: Configure SPA routing
2. **API errors**: Check CORS settings
3. **Payment failures**: Verify Stripe webhook
4. **Email not sending**: Check email service config
5. **Slow loading**: Optimize images and enable caching

### Support Contacts:
- **Supabase**: support@supabase.io
- **Stripe**: support@stripe.com
- **Domain/Hosting**: Your provider's support

## 📞 Go-Live Checklist

Final steps before announcing:
- [ ] All tests passing
- [ ] Backup created
- [ ] Monitoring active
- [ ] Team notified
- [ ] Documentation updated
- [ ] Support processes ready

---

**🎉 Ready for Production!**
Your Habitat Lobby application is now ready to serve guests at habitatlobby.com!
