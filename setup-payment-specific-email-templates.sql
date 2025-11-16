-- Payment-Specific Email Templates Setup
-- Run this in Supabase SQL Editor to replace generic templates with payment-method variants

-- First, clear existing booking confirmation templates to avoid conflicts
DELETE FROM email_templates WHERE template_type = 'booking_confirmation';
DELETE FROM email_templates WHERE template_type = 'payment_confirmation';

-- 1. STRIPE CARD PAYMENT - Immediate Booking Confirmation
INSERT INTO email_templates (name, subject, content, template_type, variables, is_active) VALUES (
  'Stripe Card Payment Confirmation',
  '🎉 Booking Confirmed & Payment Received - {{business_name}}',
  '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Booking Confirmed</title><style>body{font-family:Arial,sans-serif;margin:0;padding:0;background:#f8fafc;}.container{max-width:600px;margin:0 auto;background:white;}.header{background:#10b981;color:white;padding:30px;text-align:center;}.content{padding:30px;}.booking-card{background:#f0fdf4;border-radius:10px;padding:20px;margin:20px 0;}.detail{margin:10px 0;}.footer{background:#1f2937;color:white;padding:20px;text-align:center;}</style></head><body><div class="container"><div class="header"><h1>🎉 Booking Confirmed!</h1><p>Payment received • Reservation confirmed</p></div><div class="content"><p>Dear <strong>{{customer_name}}</strong>,</p><p>Your card payment has been processed successfully and your booking is now confirmed!</p><div class="booking-card"><h3>{{property_name}}</h3><div class="detail">📋 Booking ID: {{booking_id}}</div><div class="detail">📅 Check-in: {{check_in}} at 3:00 PM</div><div class="detail">📅 Check-out: {{check_out}} at 11:00 AM</div><div class="detail">👥 Guests: {{guests}}</div><div class="detail">💳 Payment: €{{total_amount}} - ✅ Paid via Stripe</div></div><p>Thank you for choosing {{business_name}}!</p></div><div class="footer"><p>{{business_name}}</p><p>{{business_email}} | {{business_phone}}</p></div></div></body></html>',
  'stripe_booking_confirmation',
  ARRAY['customer_name', 'property_name', 'check_in', 'check_out', 'guests', 'total_amount', 'booking_id', 'business_name', 'business_email', 'business_phone'],
  true
);

-- 2. SEPA BANK TRANSFER - Payment Instructions (when booking created)
INSERT INTO email_templates (name, subject, content, template_type, variables, is_active) VALUES (
  'SEPA Payment Instructions',
  '🏦 Complete Your Payment - {{property_name}} | {{business_name}}',
  '<!DOCTYPE html><html><head><meta charset="utf-8"><title>SEPA Payment Instructions</title><style>body{font-family:Arial,sans-serif;margin:0;padding:0;background:#f8fafc;}.container{max-width:600px;margin:0 auto;background:white;}.header{background:#3b82f6;color:white;padding:30px;text-align:center;}.content{padding:30px;}.booking-card{background:#f8fafc;border-radius:10px;padding:20px;margin:20px 0;}.payment-info{background:#dbeafe;border-radius:10px;padding:20px;margin:20px 0;}.detail{margin:10px 0;}.code{background:#f1f5f9;padding:5px 10px;border-radius:5px;font-family:monospace;font-weight:bold;}.urgent{background:#fee2e2;border-left:4px solid #ef4444;padding:15px;margin:20px 0;}.footer{background:#1f2937;color:white;padding:20px;text-align:center;}</style></head><body><div class="container"><div class="header"><h1>🏦 Complete Your Payment</h1><p>SEPA Bank Transfer Instructions</p></div><div class="content"><p>Dear <strong>{{customer_name}}</strong>,</p><p>Your reservation is pending payment. Please complete the bank transfer using the details below.</p><div class="booking-card"><h3>{{property_name}}</h3><div class="detail">📋 Booking ID: {{booking_id}}</div><div class="detail">📅 Check-in: {{check_in}}</div><div class="detail">📅 Check-out: {{check_out}}</div><div class="detail">👥 Guests: {{guests}}</div><div class="detail">💰 Amount to Pay: <strong>€{{total_amount}}</strong></div></div><div class="payment-info"><h3>💳 Bank Transfer Details</h3><div class="detail">IBAN: <span class="code">{{sepa_iban}}</span></div><div class="detail">BIC/SWIFT: <span class="code">{{sepa_bic}}</span></div><div class="detail">Account Holder: {{sepa_account_holder}}</div><div class="detail">Bank: {{sepa_bank_name}}</div><div class="detail">Reference Code: <span class="code">{{sepa_reference}}</span></div><div class="detail">Payment Deadline: <strong>{{payment_deadline}}</strong></div></div><div class="urgent"><h3>⚠️ IMPORTANT</h3><ol><li>Include reference code "{{sepa_reference}}" in transfer description</li><li>Complete transfer before {{payment_deadline}}</li><li>SEPA transfers take 1-3 business days</li><li>Booking confirmed once payment received</li></ol></div><p>Best regards,<br><strong>The {{business_name}} Team</strong></p></div><div class="footer"><p>{{business_name}}</p><p>{{business_email}} | {{business_phone}}</p><p>Reference: {{booking_id}} | SEPA: {{sepa_reference}}</p></div></div></body></html>',
  'sepa_payment_instructions',
  ARRAY['customer_name', 'property_name', 'check_in', 'check_out', 'guests', 'total_amount', 'booking_id', 'sepa_iban', 'sepa_bic', 'sepa_account_holder', 'sepa_bank_name', 'sepa_reference', 'payment_deadline', 'business_name', 'business_email', 'business_phone'],
  true
);

-- 3. SEPA BANK TRANSFER - Payment Received Confirmation (when admin confirms)
INSERT INTO email_templates (name, subject, content, template_type, variables, is_active) VALUES (
  'SEPA Payment Received',
  '✅ Payment Received - Booking Confirmed! {{property_name}}',
  '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Payment Received</title><style>body{font-family:Arial,sans-serif;margin:0;padding:0;background:#f8fafc;}.container{max-width:600px;margin:0 auto;background:white;}.header{background:#10b981;color:white;padding:30px;text-align:center;}.content{padding:30px;}.booking-card{background:#f0fdf4;border-radius:10px;padding:20px;margin:20px 0;}.payment-confirmed{background:#10b981;color:white;padding:15px;border-radius:10px;text-align:center;margin:20px 0;}.detail{margin:10px 0;}.next-steps{background:#f0f9ff;border-left:4px solid #3b82f6;padding:15px;margin:20px 0;}.footer{background:#1f2937;color:white;padding:20px;text-align:center;}</style></head><body><div class="container"><div class="header"><h1>✅ Payment Received!</h1><p>Your booking is now confirmed</p></div><div class="content"><p>Dear <strong>{{customer_name}}</strong>,</p><p>We have received your SEPA bank transfer and your booking is now <strong>fully confirmed</strong>!</p><div class="payment-confirmed"><h3>💳 Payment Confirmed</h3><p>€{{total_amount}} received</p><p>SEPA Reference: {{sepa_reference}}</p></div><div class="booking-card"><h3>{{property_name}}</h3><div class="detail">📋 Booking ID: {{booking_id}}</div><div class="detail">📅 Check-in: {{check_in}} at 3:00 PM</div><div class="detail">📅 Check-out: {{check_out}} at 11:00 AM</div><div class="detail">👥 Guests: {{guests}}</div><div class="detail">💳 Status: ✅ Paid in Full</div></div><div class="next-steps"><h4>📋 What is Next?</h4><ul><li>Check-in instructions sent 24 hours before arrival</li><li>Bring valid ID for all guests</li><li>Check-in time: 3:00 PM - 8:00 PM</li><li>24/7 support available</li></ul></div><p>We look forward to hosting you!</p></div><div class="footer"><p>{{business_name}}</p><p>{{business_email}} | {{business_phone}}</p><p>Reference: {{booking_id}} | SEPA: {{sepa_reference}}</p></div></div></body></html>',
  'sepa_payment_received',
  ARRAY['customer_name', 'property_name', 'check_in', 'check_out', 'guests', 'total_amount', 'booking_id', 'sepa_reference', 'business_name', 'business_email', 'business_phone'],
  true
);

-- 4. CASH ON ARRIVAL - Payment Instructions (when booking created)
INSERT INTO email_templates (name, subject, content, template_type, variables, is_active) VALUES (
  'Cash on Arrival Instructions',
  '💰 Booking Reserved - Pay on Arrival | {{property_name}}',
  '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Cash on Arrival</title><style>body{font-family:Arial,sans-serif;margin:0;padding:0;background:#f8fafc;}.container{max-width:600px;margin:0 auto;background:white;}.header{background:#f59e0b;color:white;padding:30px;text-align:center;}.content{padding:30px;}.booking-card{background:#fffbeb;border-radius:10px;padding:20px;margin:20px 0;}.cash-info{background:#f59e0b;color:white;padding:15px;border-radius:10px;text-align:center;margin:20px 0;}.detail{margin:10px 0;}.instructions{background:#fef3c7;border-left:4px solid #f59e0b;padding:15px;margin:20px 0;}.important{background:#fee2e2;border-left:4px solid #ef4444;padding:15px;margin:20px 0;}.footer{background:#1f2937;color:white;padding:20px;text-align:center;}</style></head><body><div class="container"><div class="header"><h1>💰 Booking Reserved!</h1><p>Pay conveniently when you arrive</p></div><div class="content"><p>Dear <strong>{{customer_name}}</strong>,</p><p>Your booking is <strong>reserved</strong> and you can pay in cash when you arrive. No payment required now.</p><div class="cash-info"><h3>💰 Pay on Arrival</h3><p style="font-size:24px;font-weight:bold;">€{{total_amount}}</p><p>Cash payment during check-in</p></div><div class="booking-card"><h3>{{property_name}}</h3><div class="detail">📋 Booking ID: {{booking_id}}</div><div class="detail">📅 Check-in: {{check_in}} at {{check_in_time}}</div><div class="detail">📅 Check-out: {{check_out}} at 11:00 AM</div><div class="detail">👥 Guests: {{guests}}</div><div class="detail">📍 Payment Location: {{payment_location}}</div><div class="detail">💳 Status: 💰 Cash on Arrival</div></div><div class="instructions"><h4>💰 Cash Payment Instructions</h4><ul><li>Amount to pay: €{{total_amount}} in cash</li><li>When to pay: During check-in at {{check_in_time}}</li><li>Where to pay: {{payment_location}}</li><li>What to bring: Exact amount or similar</li><li>Receipt: You will receive confirmation receipt</li></ul></div><div class="important"><h4>⚠️ Important Reminders</h4><ul><li>Bring valid ID for all guests</li><li>Check-in time: {{check_in_time}} - 8:00 PM</li><li>Contact us if arriving outside hours</li><li>Cash payment confirms booking</li></ul></div><p>We look forward to welcoming you!</p></div><div class="footer"><p>{{business_name}}</p><p>{{business_email}} | {{business_phone}}</p><p>Reference: {{booking_id}} | Cash: {{cash_reference}}</p></div></div></body></html>',
  'cash_on_arrival_instructions',
  ARRAY['customer_name', 'property_name', 'check_in', 'check_out', 'guests', 'total_amount', 'booking_id', 'check_in_time', 'payment_location', 'cash_reference', 'business_name', 'business_email', 'business_phone'],
  true
);

-- 5. CASH ON ARRIVAL - Payment Received Confirmation (when admin confirms)
INSERT INTO email_templates (name, subject, content, template_type, variables, is_active) VALUES (
  'Cash Payment Received',
  '✅ Payment Received - Thank You! {{property_name}}',
  '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Cash Payment Received</title><style>body{font-family:Arial,sans-serif;margin:0;padding:0;background:#f8fafc;}.container{max-width:600px;margin:0 auto;background:white;}.header{background:#10b981;color:white;padding:30px;text-align:center;}.content{padding:30px;}.booking-card{background:#f0fdf4;border-radius:10px;padding:20px;margin:20px 0;}.payment-confirmed{background:#10b981;color:white;padding:15px;border-radius:10px;text-align:center;margin:20px 0;}.detail{margin:10px 0;}.next-steps{background:#f0f9ff;border-left:4px solid #3b82f6;padding:15px;margin:20px 0;}.footer{background:#1f2937;color:white;padding:20px;text-align:center;}</style></head><body><div class="container"><div class="header"><h1>✅ Payment Received!</h1><p>Thank you for your cash payment</p></div><div class="content"><p>Dear <strong>{{customer_name}}</strong>,</p><p>We have received your cash payment and your stay is now <strong>fully confirmed</strong>. Thank you for choosing us!</p><div class="payment-confirmed"><h3>💰 Cash Payment Confirmed</h3><p>€{{total_amount}} received in cash</p><p>Payment processed on arrival</p></div><div class="booking-card"><h3>{{property_name}}</h3><div class="detail">📋 Booking ID: {{booking_id}}</div><div class="detail">📅 Check-in: {{check_in}}</div><div class="detail">📅 Check-out: {{check_out}}</div><div class="detail">👥 Guests: {{guests}}</div><div class="detail">💳 Status: ✅ Paid in Full</div></div><div class="next-steps"><h4>📋 Enjoy Your Stay!</h4><ul><li>Payment receipt has been processed</li><li>All booking terms apply</li><li>Check-out time: 11:00 AM</li><li>24/7 support available</li><li>Enjoy your time in Trikala!</li></ul></div><p>Thank you again for choosing us. We hope you have a wonderful stay!</p></div><div class="footer"><p>{{business_name}}</p><p>{{business_email}} | {{business_phone}}</p><p>Reference: {{booking_id}} | Cash: {{cash_reference}}</p></div></div></body></html>',
  'cash_payment_received',
  ARRAY['customer_name', 'property_name', 'check_in', 'check_out', 'guests', 'total_amount', 'booking_id', 'cash_reference', 'business_name', 'business_email', 'business_phone'],
  true
);

-- Update existing email template types to handle payment variants
UPDATE email_templates 
SET template_type = 'booking_confirmation_stripe' 
WHERE template_type = 'stripe_booking_confirmation';

UPDATE email_templates 
SET template_type = 'booking_confirmation_sepa_instructions' 
WHERE template_type = 'sepa_payment_instructions';

UPDATE email_templates 
SET template_type = 'booking_confirmation_sepa_received' 
WHERE template_type = 'sepa_payment_received';

UPDATE email_templates 
SET template_type = 'booking_confirmation_cash_instructions' 
WHERE template_type = 'cash_on_arrival_instructions';

UPDATE email_templates 
SET template_type = 'booking_confirmation_cash_received' 
WHERE template_type = 'cash_payment_received';

-- Verify all templates were created
SELECT 
    name,
    template_type,
    is_active,
    array_length(variables, 1) as variable_count,
    created_at
FROM email_templates 
WHERE template_type LIKE '%booking_confirmation%' OR template_type LIKE '%payment%'
ORDER BY template_type;