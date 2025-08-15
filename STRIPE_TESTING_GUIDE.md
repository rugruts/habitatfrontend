# 🧪 Stripe Payment Testing Guide - Test Apartment

## 🎯 Overview

Your **Test Apartment** is now ready for Stripe payment verification! This apartment is specifically designed for testing with:

- **Price:** €1 per night (minimum cost for testing)
- **Minimum stay:** 1 night (quick testing)
- **Real Stripe integration:** Actual payment processing
- **Supabase database:** Real booking storage

## 📦 Deployment Files

### New Deployment Package
- **File:** `habitat-lobby-with-test-apartment.zip`
- **Size:** ~5.5MB
- **Includes:** Test apartment + Supabase integration

## 🚀 Deployment Steps

### 1. Upload New Version
1. **Delete** old files from `public_html`
2. **Upload** `habitat-lobby-with-test-apartment.zip`
3. **Extract** the zip file
4. **Verify** all files are in place

### 2. Set Up Supabase Database
1. **Go to:** https://oljdfzoxvxrkaaqpdijh.supabase.co
2. **Navigate to:** SQL Editor
3. **Run:** `supabase-schema.sql` (creates tables)
4. **Run:** `supabase-seed-data.sql` (adds test apartment)

## 🧪 Testing the Payment Flow

### Step 1: Access Test Apartment
- **URL:** `https://your-domain.com/apartments/test-apartment`
- **Or:** Go to Apartments page → Find "Test Apartment"

### Step 2: Book the Test Apartment
1. **Select dates** (any future dates)
2. **Choose guests** (1-2 guests)
3. **Click "Reserve Now"** 
4. **Total should be:** €1 + €30 cleaning = €31 total

### Step 3: Complete Payment
1. **Fill customer details:**
   - Name: Your name
   - Email: Your email
   - Phone: Optional

2. **Use Stripe test card:**
   - **Card:** `4242 4242 4242 4242`
   - **Expiry:** Any future date (e.g., 12/25)
   - **CVC:** Any 3 digits (e.g., 123)
   - **ZIP:** Any 5 digits (e.g., 12345)

3. **Click "Complete Payment"**

## 💰 What Happens in Stripe

### Successful Payment
- **Amount:** €31.00 (€1 + €30 cleaning)
- **Currency:** EUR
- **Status:** Succeeded
- **Metadata:** Includes booking details

### Check Your Stripe Dashboard
1. **Go to:** https://dashboard.stripe.com/test/payments
2. **Look for:** Recent payment of €31.00
3. **Click payment** to see details
4. **Verify metadata** includes apartment info

## 📊 Database Verification

### Check Supabase Dashboard
1. **Go to:** https://oljdfzoxvxrkaaqpdijh.supabase.co
2. **Navigate to:** Table Editor
3. **Check `bookings` table** for new booking
4. **Verify booking status** is "confirmed"

### Booking Details Should Include:
- Property: Test Apartment
- Customer info
- Payment intent ID
- Total amount: €31.00
- Status: confirmed

## 🔍 Troubleshooting

### Payment Fails
- **Check:** Stripe test keys are correct
- **Verify:** Card details are valid test data
- **Ensure:** JavaScript is enabled

### Booking Not Created
- **Check:** Supabase connection
- **Verify:** Database tables exist
- **Review:** Browser console for errors

### Amount Incorrect
- **Expected:** €1/night + €30 cleaning
- **For 1 night:** €31 total
- **For 2 nights:** €32 total

## 🎉 Success Indicators

### ✅ Payment Successful
- Stripe dashboard shows €31 payment
- Payment status: "Succeeded"
- Metadata contains booking info

### ✅ Booking Created
- Supabase shows new booking record
- Status: "confirmed"
- All details match your input

### ✅ User Experience
- Booking confirmation page appears
- User receives booking ID
- No errors in browser console

## 🔄 Testing Different Scenarios

### Test Card Numbers
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Insufficient funds:** `4000 0000 0000 9995`
- **Expired card:** `4000 0000 0000 0069`

### Test Different Amounts
- **1 night:** €1 + €30 = €31
- **2 nights:** €2 + €30 = €32
- **3 nights:** €3 + €30 = €33

## 📱 Mobile Testing

### Test on Mobile
- **Responsive design** works on all devices
- **Payment form** is mobile-friendly
- **Stripe Elements** adapt to screen size

## 🚨 Important Notes

### Real Money Warning
- **Test mode only:** Uses Stripe test keys
- **No real charges:** Test cards don't charge real money
- **Safe testing:** Can test unlimited times

### Production Considerations
- **Switch to live keys** when ready for real bookings
- **Update webhook endpoints** for production
- **Test with small amounts** first

## 📞 Next Steps

After successful testing:
1. **Verify** money appears in Stripe test dashboard
2. **Check** booking appears in Supabase
3. **Test** admin dashboard to view booking
4. **Ready** to switch to live mode!

## 🎯 Expected Result

**Perfect test:** €31 payment in Stripe + confirmed booking in Supabase = 🎉 Success!

Your booking system is now fully functional and ready for real customers!
