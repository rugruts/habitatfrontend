# 📧 Backend Email Service Setup Guide

## 🎉 **Complete Email Solution Implemented!**

A full-stack email solution using:
- **Frontend**: React app with email service integration
- **Backend**: Node.js/Express API with Hostinger SMTP
- **Real Email Sending**: Using your Hostinger email account

## 🚀 **Quick Start**

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Start Both Servers
```bash
# Windows
start-dev.bat

# Linux/Mac
chmod +x start-dev.sh
./start-dev.sh

# Or manually:
# Terminal 1: cd backend && npm run dev
# Terminal 2: npm run dev
```

### 3. Test the System
1. **Backend Health Check**: http://localhost:3001/health
2. **Frontend**: http://localhost:8081
3. **Make a test booking** to verify emails are sent!

## 📡 **How It Works**

```
Frontend (React) → Backend API (Node.js) → Hostinger SMTP → Email Delivered
```

1. **User makes booking** on frontend
2. **Frontend calls** backend API `/api/email/send-booking-confirmation`
3. **Backend sends email** via Hostinger SMTP
4. **Real email delivered** to customer's inbox!

## 🔧 **Configuration**

### Frontend (.env.local)
```bash
VITE_EMAIL_API_URL=http://localhost:3001/api/email
VITE_EMAIL_API_KEY=habitat_lobby_secure_api_key_2024
```

### Backend (.env)
```bash
PORT=3001
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=info@theonicurse.xyz
SMTP_PASS=Matra1234!
FROM_EMAIL=info@theonicurse.xyz
FROM_NAME=Habitat Lobby
API_KEY=habitat_lobby_secure_api_key_2024
```

## 🧪 **Testing Email Service**

### 1. Test SMTP Connection
```bash
curl -X POST http://localhost:3001/api/email/test-connection \
  -H "Content-Type: application/json" \
  -H "x-api-key: habitat_lobby_secure_api_key_2024"
```

### 2. Send Test Email
```bash
curl -X POST http://localhost:3001/api/email/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: habitat_lobby_secure_api_key_2024" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Test Email",
    "htmlBody": "<h1>Hello from Habitat Lobby!</h1>"
  }'
```

### 3. Frontend Email Test
1. Go to **Admin Dashboard** → **Settings** → **Email Test**
2. Click "Test SMTP Connection"
3. Enter your email and click "Send Test"

## ✅ **What's Working**

- ✅ **Real SMTP Email Sending** via Hostinger
- ✅ **Booking Confirmation Emails** (automatic)
- ✅ **Professional HTML Templates**
- ✅ **Email Logging** in database
- ✅ **Error Handling** and retry logic
- ✅ **Security** (API key authentication)
- ✅ **Rate Limiting** (100 requests/15min)
- ✅ **CORS Protection**
- ✅ **Admin Testing Interface**

## 🔒 **Security Features**

- **API Key Authentication**: All endpoints protected
- **Rate Limiting**: Prevents spam/abuse
- **CORS Protection**: Only allowed origins
- **Input Validation**: Email validation, required fields
- **Error Handling**: Secure error messages

## 📊 **Monitoring & Logs**

- **Backend Logs**: Console output shows all email operations
- **Database Logs**: All emails logged in `email_logs` table
- **Health Check**: `GET /health` endpoint
- **Error Tracking**: Failed emails logged with error details

## 🚀 **Production Deployment**

### Backend Deployment Options:
1. **Vercel/Netlify Functions**
2. **Railway/Render**
3. **DigitalOcean/AWS**
4. **Your Hostinger VPS**

### Environment Variables for Production:
```bash
PORT=3001
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=info@yourdomain.com
SMTP_PASS=your_secure_password
FROM_EMAIL=info@yourdomain.com
FROM_NAME=Your Business Name
API_KEY=generate_secure_random_key
CORS_ORIGIN=https://yourdomain.com
```

## 🎯 **Next Steps**

1. **Test the booking flow** end-to-end
2. **Customize email templates** in `backend/routes/email.js`
3. **Deploy backend** to production
4. **Update frontend** API URL for production
5. **Set up monitoring** and alerts

## 💰 **Cost Benefits**

- **Hostinger SMTP**: FREE with hosting
- **No monthly fees** for email service
- **Unlimited emails** (within hosting limits)
- **Professional email address** (info@yourdomain.com)

## 🔧 **Troubleshooting**

### Backend Not Starting
```bash
cd backend
npm install
npm run dev
```

### SMTP Connection Failed
- Check Hostinger email credentials
- Verify email account is active
- Test with email client first

### Frontend API Errors
- Ensure backend is running on port 3001
- Check API key matches in both .env files
- Verify CORS origins are correct

The email system is now fully functional with real email sending! 🎉
