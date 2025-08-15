# 🔧 **Supabase Email Template Variables - UPDATED**

## ✅ **All Templates Now Use Correct Supabase Variables**

### **Standard Supabase Variables:**
- `{{ .Email }}` - User's email address
- `{{ .Token }}` - Booking ID / verification token
- `{{ .TokenHash }}` - Hashed token for security
- `{{ .SiteURL }}` - Your website URL
- `{{ .ConfirmationURL }}` - Email confirmation link
- `{{ .RedirectTo }}` - Custom redirect URL

### **Custom Data Variables (via {{ .Data }} object):**

#### **Booking Information:**
- `{{ .Data.property_name }}` - Property name (e.g., "River Loft Apartment")
- `{{ .Data.property_address }}` - Full property address
- `{{ .Data.check_in }}` - Check-in date
- `{{ .Data.check_out }}` - Check-out date
- `{{ .Data.guest_count }}` - Number of guests
- `{{ .Data.total_amount }}` - Total booking amount

#### **Payment Information:**
- `{{ .Data.amount }}` - Payment amount
- `{{ .Data.payment_method }}` - Payment method (e.g., "Card ending in ****1234")
- `{{ .Data.payment_date }}` - Payment date and time

#### **Cancellation Information:**
- `{{ .Data.original_dates }}` - Original booking dates
- `{{ .Data.cancellation_date }}` - Cancellation date
- `{{ .Data.refund_amount }}` - Refund amount

## 📧 **Template-Specific URLs:**

### **1. Booking Confirmation:**
- View Booking: `{{ .SiteURL }}/booking/{{ .Token }}`
- Contact Host: `mailto:info@habitatlobby.com`

### **2. Pre-Arrival Instructions:**
- Contact Host: `mailto:info@habitatlobby.com`

### **3. ID Verification:**
- Upload ID: `{{ .SiteURL }}/id-verification/{{ .Token }}`

### **4. Payment Confirmation:**
- Download Receipt: `{{ .SiteURL }}/receipt/{{ .Token }}`
- View Booking: `{{ .SiteURL }}/booking/{{ .Token }}`

### **5. Post-Stay Thank You:**
- Leave Review: `{{ .SiteURL }}/review/{{ .Token }}`
- Book Again: `{{ .SiteURL }}?promo=TRIKALA_RETURN`
- Instagram: `https://instagram.com/habitatlobby`
- Facebook: `https://facebook.com/habitatlobby`

### **6. Booking Cancellation:**
- Explore Properties: `{{ .SiteURL }}`

## 🔄 **How to Send Emails with Data:**

When sending emails from your admin dashboard, pass data like this:

```typescript
// Example: Booking Confirmation
await emailService.sendTemplateEmail('booking_confirmation', {
  to: booking.customer_email,
  token: booking.id,
  data: {
    property_name: booking.property.name,
    property_address: booking.property.address,
    check_in: booking.check_in,
    check_out: booking.check_out,
    guest_count: booking.guest_count,
    total_amount: booking.total_amount
  }
});

// Example: Payment Confirmation
await emailService.sendTemplateEmail('payment_confirmation', {
  to: payment.customer_email,
  token: payment.transaction_id,
  data: {
    amount: payment.amount,
    payment_method: payment.method,
    payment_date: payment.created_at
  }
});

// Example: ID Verification
await emailService.sendTemplateEmail('id_verification', {
  to: booking.customer_email,
  token: booking.id
});
```

## 🎯 **Template Subjects (Copy These):**

1. **Booking Confirmation:** `Your booking at Habitat Lobby is confirmed! 🏠`
2. **Pre-Arrival:** `Your stay starts tomorrow - Check-in details 🗝️`
3. **ID Verification:** `ID Verification Required - Quick & Secure 🆔`
4. **Payment Confirmation:** `Payment received - Thank you! 💳`
5. **Post-Stay Thank You:** `Thank you for staying with us! How was your experience? ⭐`
6. **Booking Cancellation:** `Booking Cancelled - Refund Processing 💰`

## 🚀 **Ready to Deploy!**

All templates are now:
- ✅ **Using correct Supabase variables**
- ✅ **Trikala-specific content**
- ✅ **Professional design**
- ✅ **Mobile responsive**
- ✅ **Production ready**

**Simply copy the HTML from `email-templates-professional.html` into your Supabase email template editor!** 🎉
