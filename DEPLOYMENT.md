# 🚀 Habitat Lobby - Hostinger Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ What You Need:
1. **Hostinger hosting account** with cPanel access
2. **Domain name** pointed to your Hostinger hosting
3. **Stripe account** (test keys are already configured)
4. **FTP/File Manager access** to your hosting

## 🛠️ Step-by-Step Deployment

### Step 1: Build the Project
```bash
# Run the deployment script
./deploy.sh

# Or manually:
npm install --legacy-peer-deps
npm run build
```

### Step 2: Upload to Hostinger
1. **Access cPanel** → File Manager
2. **Navigate** to `public_html` directory
3. **Upload** all files from the `dist` directory
4. **Ensure** `.htaccess` file is uploaded (handles React routing)

### Step 3: Configure Environment
1. **Edit** `.env.production` file
2. **Replace** `YOUR_DOMAIN.com` with your actual domain
3. **Update** contact information

### Step 4: Test Your Site
1. **Visit** your domain
2. **Test** booking flow
3. **Verify** Stripe payment form loads
4. **Check** all pages work correctly

## 🔧 Hostinger-Specific Configuration

### File Structure After Upload:
```
public_html/
├── index.html
├── .htaccess (IMPORTANT!)
├── assets/
│   ├── css files
│   └── js files
├── images/
└── other static files
```

### Important Notes:
- ✅ **React Router**: `.htaccess` handles client-side routing
- ✅ **HTTPS**: Hostinger provides free SSL certificates
- ✅ **Stripe**: Works with test keys, switch to live keys when ready
- ✅ **Performance**: Files are optimized and compressed

## 🔐 Security & SSL

### SSL Certificate:
1. **cPanel** → SSL/TLS
2. **Enable** "Force HTTPS Redirect"
3. **Verify** SSL certificate is active

### Environment Variables:
- Test Stripe keys are safe for development
- Switch to live keys only when ready for real payments
- Never expose secret keys in frontend code

## 📱 Testing Checklist

After deployment, test:
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Apartment pages display
- [ ] Availability calendar functions
- [ ] Booking flow works
- [ ] Stripe payment form loads
- [ ] Contact forms work
- [ ] Mobile responsiveness
- [ ] All images load

## 🚨 Troubleshooting

### Common Issues:

**404 Errors on Page Refresh:**
- Ensure `.htaccess` file is uploaded
- Check Apache mod_rewrite is enabled

**Stripe Not Loading:**
- Verify HTTPS is working
- Check browser console for errors
- Ensure Stripe keys are correct

**Images Not Loading:**
- Check file paths are correct
- Verify images are uploaded
- Check file permissions

**Slow Loading:**
- Enable compression in cPanel
- Optimize images
- Use Hostinger's CDN if available

## 📞 Support

If you encounter issues:
1. **Check** browser console for errors
2. **Verify** all files uploaded correctly
3. **Test** on different devices/browsers
4. **Contact** Hostinger support for server issues

## 🎉 Go Live Checklist

When ready for real bookings:
1. **Replace** Stripe test keys with live keys
2. **Update** contact information
3. **Test** real payment flow
4. **Set up** booking confirmation emails
5. **Configure** calendar integrations
6. **Add** Google Analytics (optional)

---

**🏡 Your Habitat Lobby booking system is ready to welcome guests!**
