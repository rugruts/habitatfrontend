# 🚀 Habitat Lobby - Vercel + Hostinger Deployment

## 🏗️ Architecture Overview

**Frontend (React)** → **Hostinger** → `habitatlobby.com`  
**Backend (API)** → **Vercel** → `habitat-api.vercel.app`  
**Database** → **Supabase** (Cloud)  
**Payments** → **Stripe** (Cloud)  

---

## 📱 Frontend Deployment (Hostinger)

### 1. Build the React App
```bash
# In the root directory
npm run build
```

### 2. Upload to Hostinger
1. **Access Hostinger File Manager** or use FTP
2. **Navigate to:** `/public_html/habitatlobby.com/`
3. **Upload contents** of `dist/` folder
4. **Ensure index.html is in the root**

### 3. Environment Variables
Update your `.env` for production:
```env
VITE_SITE_URL=https://habitatlobby.com
VITE_EMAIL_API_URL=https://habitat-api.vercel.app/api/email
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## ⚡ Backend Deployment (Vercel)

### 1. Install Vercel CLI
```bash
npm i -g vercel
vercel login
```

### 2. Deploy Backend
```bash
cd backend
vercel

# Follow prompts:
# - Project name: habitat-lobby-api
# - Directory: ./
```

### 3. Environment Variables in Vercel
Add these in **Vercel Dashboard** → **Settings** → **Environment Variables**:

```env
NODE_ENV=production
CORS_ORIGIN=https://habitatlobby.com,https://www.habitatlobby.com

# Email Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@habitatlobby.com
SMTP_PASS=your_email_password
FROM_EMAIL=noreply@habitatlobby.com
FROM_NAME=Habitat Lobby

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

---

## 🔧 Configuration Updates

### Update Frontend to Use Vercel API
In your frontend code, update API calls to point to Vercel:

```javascript
// In src/lib/booking-email-service.ts
const API_BASE_URL = 'https://habitat-api.vercel.app/api';
```

### Configure Stripe Webhooks
1. **Go to Stripe Dashboard** → **Webhooks**
2. **Add endpoint:** `https://habitat-api.vercel.app/api/stripe/webhook`
3. **Select events:** `payment_intent.succeeded`, `payment_intent.payment_failed`

---

## 🧪 Testing

### Test API
```bash
curl https://habitat-api.vercel.app/health
```

### Test Frontend
1. Visit `https://habitatlobby.com`
2. Complete a test booking
3. Verify email confirmation

---

## 🎯 Benefits of This Setup

### ✅ Advantages:
- **Cost-effective:** Hostinger for static files, Vercel free tier for API
- **Scalable:** Vercel auto-scales serverless functions
- **Reliable:** No server maintenance needed
- **Fast:** Global CDN for both frontend and backend
- **Easy deployments:** Git push to deploy backend

### 📊 Performance:
- **Frontend:** Fast static file serving from Hostinger
- **Backend:** Serverless functions with global edge network
- **Database:** Supabase with built-in CDN
- **Payments:** Stripe's global infrastructure

---

## 🚨 Troubleshooting

### CORS Issues:
- Check `CORS_ORIGIN` in Vercel environment variables
- Ensure exact domain match (with/without www)

### Email Issues:
- Verify Hostinger SMTP credentials
- Test email sending from Vercel logs

### Payment Issues:
- Check Stripe webhook URL and secret
- Monitor Stripe dashboard for webhook delivery

---

## 🔄 Deployment Workflow

### For Frontend Updates:
1. `npm run build`
2. Upload `dist/` contents to Hostinger
3. Clear any CDN cache

### For Backend Updates:
1. `git push` to your repository
2. Vercel auto-deploys from Git
3. Check deployment logs in Vercel dashboard

This setup gives you the best of both worlds: reliable, fast static hosting for your frontend and powerful, scalable serverless functions for your backend! 🎉
