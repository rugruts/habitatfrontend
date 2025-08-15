# 📧 **EMAIL SERVICE IMPLEMENTATION GUIDE**

## 🚨 **Current Status: EMAIL NOTIFICATIONS NOT WORKING**

The email templates are ready and beautiful, but the actual email sending is not implemented. Here's how to fix it:

## 🔧 **Option 1: Postmark (Recommended)**

### **1. Setup Postmark Account**
```bash
# Sign up at https://postmarkapp.com
# Get your API key
# Add to .env file:
VITE_POSTMARK_API_KEY=your_postmark_api_key
```

### **2. Install Postmark SDK**
```bash
npm install postmark
```

### **3. Update Email Service**
```typescript
// src/lib/email-service.ts
import { Client } from 'postmark';

const postmark = new Client(import.meta.env.VITE_POSTMARK_API_KEY);

export const emailService = {
  async sendTemplateEmail(templateType: string, data: any) {
    try {
      const result = await postmark.sendEmailWithTemplate({
        From: 'info@habitatlobby.com',
        To: data.to,
        TemplateAlias: templateType,
        TemplateModel: data.data
      });
      
      console.log('Email sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }
};
```

## 🔧 **Option 2: Supabase Edge Functions (Advanced)**

### **1. Create Edge Function**
```sql
-- Create edge function for email sending
CREATE OR REPLACE FUNCTION send_email(
  template_type TEXT,
  recipient_email TEXT,
  template_data JSONB
) RETURNS JSONB AS $$
BEGIN
  -- Implementation using Supabase Edge Functions
  -- This would call external email service
END;
$$ LANGUAGE plpgsql;
```

## 🔧 **Option 3: Simple SMTP (Basic)**

### **1. Install Nodemailer**
```bash
npm install nodemailer
```

### **2. Configure SMTP**
```typescript
// src/lib/email-service.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com', // or your SMTP server
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

export const emailService = {
  async sendTemplateEmail(templateType: string, data: any) {
    const htmlContent = await renderTemplate(templateType, data.data);
    
    const result = await transporter.sendMail({
      from: 'info@habitatlobby.com',
      to: data.to,
      subject: getSubjectForTemplate(templateType),
      html: htmlContent
    });
    
    return result;
  }
};
```

## 📋 **Template Integration Steps**

### **1. Upload Templates to Email Service**
```typescript
// For Postmark - create templates in dashboard
// For SMTP - store in database or files

const templates = {
  booking_confirmation: {
    subject: 'Your booking at Habitat Lobby is confirmed! 🏠',
    html: '<!-- Copy from email-templates-professional.html -->'
  },
  pre_arrival: {
    subject: 'Your stay starts tomorrow - Check-in details 🗝️', 
    html: '<!-- Copy from email-templates-professional.html -->'
  }
  // ... add all 6 templates
};
```

### **2. Update Booking Creation to Send Emails**
```typescript
// src/pages/admin/Dashboard.tsx
const handleCreateBooking = async () => {
  try {
    // Create booking
    const createdBooking = await supabaseHelpers.createBooking(bookingData);
    
    // Send confirmation email
    await emailService.sendTemplateEmail('booking_confirmation', {
      to: bookingData.customer_email,
      data: {
        property_name: property.name,
        check_in: bookingData.check_in,
        check_out: bookingData.check_out,
        guest_count: bookingData.guests,
        total_amount: bookingData.total_amount
      }
    });
    
    console.log('Booking created and email sent!');
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 🎯 **Quick Implementation (30 minutes)**

### **For Immediate Customer Delivery:**

1. **Manual Email Handling** (Temporary)
```typescript
// src/lib/email-service.ts
export const emailService = {
  async sendTemplateEmail(templateType: string, data: any) {
    // Log email details for manual sending
    console.log('📧 EMAIL TO SEND:');
    console.log('To:', data.to);
    console.log('Template:', templateType);
    console.log('Data:', data.data);
    
    // Store in database for manual processing
    await supabaseHelpers.createEmailLog({
      template_type: templateType,
      recipient: data.to,
      template_data: data.data,
      status: 'pending_manual',
      created_at: new Date().toISOString()
    });
    
    // Show admin notification
    alert(`Email queued for manual sending to ${data.to}`);
    
    return { success: true, manual: true };
  }
};
```

2. **Admin Email Queue** (Show pending emails)
```typescript
// Add to admin dashboard
const [pendingEmails, setPendingEmails] = useState([]);

// Fetch pending emails
const fetchPendingEmails = async () => {
  const emails = await supabaseHelpers.getEmailLogs({ status: 'pending_manual' });
  setPendingEmails(emails);
};

// Show in dashboard
{pendingEmails.length > 0 && (
  <Card className="border-orange-200 bg-orange-50">
    <CardContent className="pt-6">
      <h3>📧 Pending Emails ({pendingEmails.length})</h3>
      <p>These emails need to be sent manually</p>
      <Button onClick={() => setShowEmailQueue(true)}>
        View Email Queue
      </Button>
    </CardContent>
  </Card>
)}
```

## 🚀 **RECOMMENDATION FOR CUSTOMER:**

### **Phase 1: Launch Now (Manual Emails)**
- ✅ Use manual email handling
- ✅ Admin gets notifications of emails to send
- ✅ Copy professional templates and send manually
- ✅ Booking system works perfectly

### **Phase 2: Automate Later (1-2 weeks)**
- 🔄 Implement Postmark integration
- 🔄 Set up automated email triggers
- 🔄 Add email analytics and tracking

## 📧 **Email Templates Ready:**
- ✅ **6 Professional Templates** created
- ✅ **Mobile-responsive** design
- ✅ **Variable replacement** system
- ✅ **Supabase integration** ready

**The customer can launch immediately with manual email handling, then automate later!** 🎉
