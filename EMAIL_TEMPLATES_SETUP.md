# 📧 **Professional Email Templates for Habitat Lobby Trikala**

## 🎨 **Modern Design Features**

✅ **Mobile-First Responsive Design**
✅ **Professional Gradient Headers** 
✅ **Clean Typography** (System fonts)
✅ **Consistent Color Scheme**
✅ **Action-Oriented CTAs**
✅ **Visual Hierarchy** with cards and sections
✅ **Accessibility Compliant**
✅ **Brand Consistency**

## 📋 **6 Essential Templates Created**

### **1. Booking Confirmation** 🏠
- **Subject:** `Your booking at Habitat Lobby is confirmed! 🏠`
- **Use Case:** Sent immediately after successful booking
- **Key Features:** Booking details card, location info, contact buttons
- **Variables:** `{{ .PropertyName }}`, `{{ .CheckIn }}`, `{{ .CheckOut }}`, `{{ .GuestCount }}`, `{{ .TotalAmount }}`

### **2. Pre-Arrival Instructions** 🗝️
- **Subject:** `Your stay starts tomorrow - Check-in details 🗝️`
- **Use Case:** Sent 24 hours before check-in
- **Key Features:** Check-in instructions, WiFi details, local recommendations
- **Variables:** `{{ .PropertyName }}`, `{{ .PropertyAddress }}`, `{{ .GuestCount }}`

### **3. ID Verification Reminder** 🆔
- **Subject:** `ID Verification Required - Quick & Secure 🆔`
- **Use Case:** Sent if ID not uploaded 48 hours before check-in
- **Key Features:** Urgency banner, security assurance, upload button
- **Variables:** `{{ .VerificationURL }}`

### **4. Payment Confirmation** 💳
- **Subject:** `Payment received - Thank you! 💳`
- **Use Case:** Sent after successful payment processing
- **Key Features:** Payment summary, receipt download, next steps
- **Variables:** `{{ .Amount }}`, `{{ .PaymentMethod }}`, `{{ .TransactionID }}`, `{{ .PaymentDate }}`

### **5. Post-Stay Thank You** ⭐
- **Subject:** `Thank you for staying with us! How was your experience? ⭐`
- **Use Case:** Sent 24 hours after checkout
- **Key Features:** Review request, return offer, social media links
- **Variables:** `{{ .PropertyName }}`, `{{ .ReviewURL }}`, `{{ .BookAgainURL }}`

### **6. Booking Cancellation** ❌
- **Subject:** `Booking Cancelled - Refund Processing 💰`
- **Use Case:** Sent when booking is cancelled
- **Key Features:** Cancellation summary, refund details, future booking invitation
- **Variables:** `{{ .BookingID }}`, `{{ .PropertyName }}`, `{{ .RefundAmount }}`, `{{ .CancellationDate }}`

## 🔧 **Supabase Setup Instructions**

### **Step 1: Access Email Templates**
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. You'll see tabs for different email types

### **Step 2: Configure Each Template**

For each template, copy the HTML from `email-templates-professional.html` and:

1. **Subject Line:** Use the provided subject
2. **Message Body:** Copy the HTML code
3. **Variables:** Replace with actual Supabase variables:
   - `{{ .ConfirmationURL }}` → Supabase confirmation URL
   - `{{ .Token }}` → Booking ID or reference
   - `{{ .Email }}` → User email
   - `{{ .SiteURL }}` → Your website URL
   - `{{ .Data }}` → Custom data (dates, amounts)

### **Step 3: Variable Mapping**

**Supabase Variables Available:**
```
{{ .ConfirmationURL }}  - Email confirmation link
{{ .Token }}           - Verification token
{{ .TokenHash }}       - Hashed token
{{ .SiteURL }}         - Your site URL
{{ .Email }}           - User's email
{{ .Data }}            - Custom data object
{{ .RedirectTo }}      - Redirect URL
```

**Custom Variables for Booking System:**
- Replace `{{ .PropertyName }}` with actual property name
- Replace `{{ .CheckIn }}` with check-in date
- Replace `{{ .TotalAmount }}` with booking total
- Replace `{{ .GuestCount }}` with number of guests

### **Step 4: Test Templates**

1. **Preview Mode:** Use Supabase preview to see how emails look
2. **Test Emails:** Send test emails to yourself
3. **Mobile Testing:** Check on mobile devices
4. **Variable Testing:** Ensure all variables populate correctly

## 🎯 **Template Automation Setup**

### **In Your Admin Dashboard:**

1. **Booking Confirmation** → Trigger on booking creation
2. **Pre-Arrival** → Trigger 24 hours before check-in
3. **ID Verification** → Trigger if no ID uploaded 48 hours before
4. **Payment Confirmation** → Trigger on successful payment
5. **Post-Stay** → Trigger 24 hours after checkout
6. **Cancellation** → Trigger on booking cancellation

### **Email Service Integration:**

Update your `email-service.ts` to use these templates:

```typescript
// Example usage
await emailService.sendTemplateEmail('booking_confirmation', {
  to: booking.customer_email,
  data: {
    propertyName: booking.property.name,
    checkIn: booking.check_in,
    checkOut: booking.check_out,
    totalAmount: booking.total_amount,
    guestCount: booking.guest_count
  }
});
```

## 🌟 **Design Highlights**

### **Color Scheme:**
- **Primary Green:** `#10b981` (Emerald)
- **Secondary Blue:** `#3b82f6` (Blue)
- **Warning Orange:** `#f59e0b` (Amber)
- **Success Green:** `#059669` (Emerald Dark)
- **Purple Accent:** `#8b5cf6` (Violet)
- **Neutral Gray:** `#6b7280` (Gray)

### **Typography:**
- **Font Stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Responsive:** Scales beautifully on all devices
- **Hierarchy:** Clear heading structure

### **Layout:**
- **Max Width:** 600px (optimal for email clients)
- **Padding:** Consistent spacing throughout
- **Border Radius:** Modern rounded corners
- **Shadows:** Subtle depth with box-shadows
- **Gradients:** Professional gradient backgrounds

## 🚀 **Ready to Deploy!**

These templates are:
- ✅ **Production Ready**
- ✅ **Mobile Optimized**
- ✅ **Brand Consistent**
- ✅ **Conversion Focused**
- ✅ **Professional Design**

**Your guests will receive beautiful, professional emails that reflect the quality of your Trikala properties!** 🏠✨
