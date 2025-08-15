-- Email Templates Setup for Habitat Lobby
-- Run this in Supabase SQL Editor to set up all email templates

-- Clear existing templates (optional)
-- DELETE FROM email_templates;

-- Insert booking confirmation template
INSERT INTO email_templates (
    name,
    template_type,
    subject,
    html_content,
    text_content,
    variables,
    is_active
) VALUES (
    'Booking Confirmation',
    'booking_confirmation',
    'Booking Confirmation - {{property_name}}',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .booking-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Confirmed!</h1>
        </div>
        <div class="content">
            <p>Dear {{customer_name}},</p>
            <p>Thank you for your booking! Your reservation has been confirmed.</p>
            
            <div class="booking-details">
                <h3>Booking Details</h3>
                <p><strong>Property:</strong> {{property_name}}</p>
                <p><strong>Check-in:</strong> {{check_in_date}}</p>
                <p><strong>Check-out:</strong> {{check_out_date}}</p>
                <p><strong>Guests:</strong> {{guest_count}}</p>
                <p><strong>Total Amount:</strong> €{{total_amount}}</p>
                <p><strong>Booking Reference:</strong> {{booking_id}}</p>
            </div>
            
            <p>We look forward to welcoming you!</p>
            <p>Best regards,<br>Habitat Lobby Team</p>
        </div>
        <div class="footer">
            <p>© 2024 Habitat Lobby. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
    'Dear {{customer_name}},

Thank you for your booking! Your reservation has been confirmed.

Booking Details:
- Property: {{property_name}}
- Check-in: {{check_in_date}}
- Check-out: {{check_out_date}}
- Guests: {{guest_count}}
- Total Amount: €{{total_amount}}
- Booking Reference: {{booking_id}}

We look forward to welcoming you!

Best regards,
Habitat Lobby Team',
    '["customer_name", "property_name", "check_in_date", "check_out_date", "guest_count", "total_amount", "booking_id"]',
    true
);

-- Insert payment confirmation template
INSERT INTO email_templates (
    name,
    template_type,
    subject,
    html_content,
    text_content,
    variables,
    is_active
) VALUES (
    'Payment Confirmation',
    'payment_confirmation',
    'Payment Received - {{property_name}}',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payment Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .payment-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Payment Received!</h1>
        </div>
        <div class="content">
            <p>Dear {{customer_name}},</p>
            <p>We have successfully received your payment for your booking at {{property_name}}.</p>
            
            <div class="payment-details">
                <h3>Payment Details</h3>
                <p><strong>Amount Paid:</strong> €{{payment_amount}}</p>
                <p><strong>Payment Method:</strong> {{payment_method}}</p>
                <p><strong>Transaction ID:</strong> {{transaction_id}}</p>
                <p><strong>Payment Date:</strong> {{payment_date}}</p>
            </div>
            
            <p>Your booking is now fully confirmed. We will send you check-in instructions closer to your arrival date.</p>
            <p>Best regards,<br>Habitat Lobby Team</p>
        </div>
        <div class="footer">
            <p>© 2024 Habitat Lobby. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
    'Dear {{customer_name}},

We have successfully received your payment for your booking at {{property_name}}.

Payment Details:
- Amount Paid: €{{payment_amount}}
- Payment Method: {{payment_method}}
- Transaction ID: {{transaction_id}}
- Payment Date: {{payment_date}}

Your booking is now fully confirmed. We will send you check-in instructions closer to your arrival date.

Best regards,
Habitat Lobby Team',
    '["customer_name", "property_name", "payment_amount", "payment_method", "transaction_id", "payment_date"]',
    true
);

-- Insert check-in instructions template
INSERT INTO email_templates (
    name,
    template_type,
    subject,
    html_content,
    text_content,
    variables,
    is_active
) VALUES (
    'Check-in Instructions',
    'checkin_instructions',
    'Check-in Instructions - {{property_name}}',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Check-in Instructions</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #7c3aed; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .instructions { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .important { background: #fef3c7; padding: 10px; border-left: 4px solid #f59e0b; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to {{property_name}}!</h1>
        </div>
        <div class="content">
            <p>Dear {{customer_name}},</p>
            <p>Your check-in date is approaching! Here are your check-in instructions:</p>
            
            <div class="instructions">
                <h3>Check-in Details</h3>
                <p><strong>Check-in Time:</strong> {{check_in_time}}</p>
                <p><strong>Property Address:</strong> {{property_address}}</p>
                <p><strong>Access Code:</strong> {{access_code}}</p>
                <p><strong>WiFi Password:</strong> {{wifi_password}}</p>
            </div>
            
            <div class="important">
                <p><strong>Important:</strong> Please ensure you have completed your ID verification before arrival. If you haven''t done so yet, please upload your ID document through our portal.</p>
            </div>
            
            <p>If you have any questions or need assistance, please don''t hesitate to contact us.</p>
            <p>We hope you have a wonderful stay!</p>
            <p>Best regards,<br>Habitat Lobby Team</p>
        </div>
        <div class="footer">
            <p>© 2024 Habitat Lobby. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
    'Dear {{customer_name}},

Your check-in date is approaching! Here are your check-in instructions:

Check-in Details:
- Check-in Time: {{check_in_time}}
- Property Address: {{property_address}}
- Access Code: {{access_code}}
- WiFi Password: {{wifi_password}}

IMPORTANT: Please ensure you have completed your ID verification before arrival. If you haven''t done so yet, please upload your ID document through our portal.

If you have any questions or need assistance, please don''t hesitate to contact us.

We hope you have a wonderful stay!

Best regards,
Habitat Lobby Team',
    '["customer_name", "property_name", "check_in_time", "property_address", "access_code", "wifi_password"]',
    true
);

-- Insert ID verification reminder template
INSERT INTO email_templates (
    name,
    template_type,
    subject,
    html_content,
    text_content,
    variables,
    is_active
) VALUES (
    'ID Verification Reminder',
    'id_verification_reminder',
    'ID Verification Required - {{property_name}}',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>ID Verification Required</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .verification-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .cta-button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ID Verification Required</h1>
        </div>
        <div class="content">
            <p>Dear {{customer_name}},</p>
            <p>We need you to complete your ID verification for your upcoming stay at {{property_name}}.</p>
            
            <div class="verification-info">
                <h3>Why ID Verification?</h3>
                <p>ID verification is required for security purposes and to comply with local regulations. This helps us ensure a safe environment for all our guests.</p>
                
                <p><strong>Check-in Date:</strong> {{check_in_date}}</p>
                <p><strong>Deadline:</strong> Please complete verification at least 24 hours before check-in</p>
            </div>
            
            <a href="{{verification_link}}" class="cta-button">Complete ID Verification</a>
            
            <p>The verification process is quick and secure. You''ll need to upload a clear photo of your government-issued ID.</p>
            <p>If you have any questions, please contact our support team.</p>
            <p>Best regards,<br>Habitat Lobby Team</p>
        </div>
        <div class="footer">
            <p>© 2024 Habitat Lobby. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
    'Dear {{customer_name}},

We need you to complete your ID verification for your upcoming stay at {{property_name}}.

Why ID Verification?
ID verification is required for security purposes and to comply with local regulations. This helps us ensure a safe environment for all our guests.

Check-in Date: {{check_in_date}}
Deadline: Please complete verification at least 24 hours before check-in

Complete your verification here: {{verification_link}}

The verification process is quick and secure. You''ll need to upload a clear photo of your government-issued ID.

If you have any questions, please contact our support team.

Best regards,
Habitat Lobby Team',
    '["customer_name", "property_name", "check_in_date", "verification_link"]',
    true
);

-- Insert booking cancellation template
INSERT INTO email_templates (
    name,
    template_type,
    subject,
    html_content,
    text_content,
    variables,
    is_active
) VALUES (
    'Booking Cancellation',
    'booking_cancellation',
    'Booking Cancelled - {{property_name}}',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Cancellation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .cancellation-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Cancelled</h1>
        </div>
        <div class="content">
            <p>Dear {{customer_name}},</p>
            <p>We''re sorry to inform you that your booking has been cancelled.</p>
            
            <div class="cancellation-details">
                <h3>Cancelled Booking Details</h3>
                <p><strong>Property:</strong> {{property_name}}</p>
                <p><strong>Check-in Date:</strong> {{check_in_date}}</p>
                <p><strong>Check-out Date:</strong> {{check_out_date}}</p>
                <p><strong>Booking Reference:</strong> {{booking_id}}</p>
                <p><strong>Cancellation Reason:</strong> {{cancellation_reason}}</p>
            </div>
            
            <p>If a refund is applicable, it will be processed within 5-7 business days to your original payment method.</p>
            <p>If you have any questions about this cancellation, please contact our support team.</p>
            <p>We hope to welcome you in the future!</p>
            <p>Best regards,<br>Habitat Lobby Team</p>
        </div>
        <div class="footer">
            <p>© 2024 Habitat Lobby. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
    'Dear {{customer_name}},

We''re sorry to inform you that your booking has been cancelled.

Cancelled Booking Details:
- Property: {{property_name}}
- Check-in Date: {{check_in_date}}
- Check-out Date: {{check_out_date}}
- Booking Reference: {{booking_id}}
- Cancellation Reason: {{cancellation_reason}}

If a refund is applicable, it will be processed within 5-7 business days to your original payment method.

If you have any questions about this cancellation, please contact our support team.

We hope to welcome you in the future!

Best regards,
Habitat Lobby Team',
    '["customer_name", "property_name", "check_in_date", "check_out_date", "booking_id", "cancellation_reason"]',
    true
);

-- Insert welcome email template
INSERT INTO email_templates (
    name,
    template_type,
    subject,
    html_content,
    text_content,
    variables,
    is_active
) VALUES (
    'Welcome Email',
    'welcome',
    'Welcome to Habitat Lobby!',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to Habitat Lobby</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .welcome-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Habitat Lobby!</h1>
        </div>
        <div class="content">
            <p>Dear {{customer_name}},</p>
            <p>Welcome to Habitat Lobby! We''re excited to have you as our guest.</p>

            <div class="welcome-info">
                <h3>What''s Next?</h3>
                <p>• Complete your booking if you haven''t already</p>
                <p>• Upload your ID for verification</p>
                <p>• Check your email for booking confirmations</p>
                <p>• Contact us if you have any questions</p>
            </div>

            <p>We''re here to make your stay exceptional. Don''t hesitate to reach out if you need anything!</p>
            <p>Best regards,<br>Habitat Lobby Team</p>
        </div>
        <div class="footer">
            <p>© 2024 Habitat Lobby. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
    'Dear {{customer_name}},

Welcome to Habitat Lobby! We''re excited to have you as our guest.

What''s Next?
• Complete your booking if you haven''t already
• Upload your ID for verification
• Check your email for booking confirmations
• Contact us if you have any questions

We''re here to make your stay exceptional. Don''t hesitate to reach out if you need anything!

Best regards,
Habitat Lobby Team',
    '["customer_name"]',
    true
);

-- Insert checkout reminder template
INSERT INTO email_templates (
    name,
    template_type,
    subject,
    html_content,
    text_content,
    variables,
    is_active
) VALUES (
    'Checkout Reminder',
    'checkout_reminder',
    'Checkout Reminder - {{property_name}}',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Checkout Reminder</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .checkout-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Checkout Reminder</h1>
        </div>
        <div class="content">
            <p>Dear {{customer_name}},</p>
            <p>We hope you''ve enjoyed your stay at {{property_name}}! This is a friendly reminder about your checkout.</p>

            <div class="checkout-info">
                <h3>Checkout Details</h3>
                <p><strong>Checkout Time:</strong> {{checkout_time}}</p>
                <p><strong>Checkout Date:</strong> {{checkout_date}}</p>
                <p><strong>Instructions:</strong></p>
                <ul>
                    <li>Please leave the keys in the property</li>
                    <li>Ensure all windows and doors are locked</li>
                    <li>Take any personal belongings with you</li>
                    <li>Leave the property in good condition</li>
                </ul>
            </div>

            <p>Thank you for choosing Habitat Lobby! We''d love to welcome you back in the future.</p>
            <p>Safe travels!</p>
            <p>Best regards,<br>Habitat Lobby Team</p>
        </div>
        <div class="footer">
            <p>© 2024 Habitat Lobby. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
    'Dear {{customer_name}},

We hope you''ve enjoyed your stay at {{property_name}}! This is a friendly reminder about your checkout.

Checkout Details:
- Checkout Time: {{checkout_time}}
- Checkout Date: {{checkout_date}}

Instructions:
• Please leave the keys in the property
• Ensure all windows and doors are locked
• Take any personal belongings with you
• Leave the property in good condition

Thank you for choosing Habitat Lobby! We''d love to welcome you back in the future.

Safe travels!

Best regards,
Habitat Lobby Team',
    '["customer_name", "property_name", "checkout_time", "checkout_date"]',
    true
);

-- Verify templates were created
SELECT
    name,
    template_type,
    subject,
    is_active,
    created_at
FROM email_templates
ORDER BY created_at DESC;
