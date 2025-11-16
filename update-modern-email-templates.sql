-- Update email templates with modern UI/UX design and proper dynamic variables

-- 1. Cash on Arrival Instructions Template
UPDATE email_templates 
SET content = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Reserved - Pay on Arrival</title>
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 32px; text-align: center; }
        .header h1 { color: #ffffff; font-size: 28px; font-weight: 700; margin-bottom: 8px; }
        .header p { color: #dbeafe; font-size: 16px; font-weight: 400; }
        .content { padding: 40px 32px; }
        .status-badge { display: inline-flex; align-items: center; background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 600; margin-bottom: 24px; }
        .status-badge::before { content: "⏳"; margin-right: 8px; }
        .booking-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .booking-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px; }
        .booking-title { font-size: 20px; font-weight: 600; color: #1e293b; }
        .booking-id { font-size: 14px; color: #64748b; font-family: "SF Mono", Consolas, monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 6px; }
        .booking-details { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
        .detail-item { }
        .detail-label { font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px; }
        .detail-value { font-size: 16px; font-weight: 600; color: #1e293b; }
        .payment-info { background: #fffbeb; border: 1px solid #fbbf24; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .payment-header { display: flex; align-items: center; margin-bottom: 16px; }
        .payment-header::before { content: "💰"; font-size: 20px; margin-right: 12px; }
        .payment-title { font-size: 18px; font-weight: 600; color: #92400e; }
        .payment-amount { font-size: 32px; font-weight: 700; color: #92400e; text-align: center; margin: 16px 0; }
        .reference-code { background: #ffffff; border: 2px dashed #fbbf24; padding: 16px; border-radius: 8px; text-align: center; margin: 16px 0; }
        .reference-label { font-size: 12px; font-weight: 500; text-transform: uppercase; color: #92400e; margin-bottom: 8px; }
        .reference-value { font-size: 20px; font-weight: 700; color: #92400e; font-family: "SF Mono", Consolas, monospace; }
        .instructions { background: #eff6ff; border: 1px solid #3b82f6; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .instructions-title { font-size: 18px; font-weight: 600; color: #1d4ed8; margin-bottom: 16px; display: flex; align-items: center; }
        .instructions-title::before { content: "📋"; margin-right: 12px; }
        .instructions-list { list-style: none; }
        .instructions-list li { margin-bottom: 12px; padding-left: 24px; position: relative; }
        .instructions-list li::before { content: "✓"; position: absolute; left: 0; color: #059669; font-weight: bold; }
        .cta-section { text-align: center; margin: 40px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: transform 0.2s; }
        .cta-button:hover { transform: translateY(-2px); }
        .footer { background: #f1f5f9; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer-title { font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 8px; }
        .footer-subtitle { color: #64748b; margin-bottom: 16px; }
        .footer-contact { font-size: 14px; color: #64748b; margin-bottom: 8px; }
        .footer-legal { font-size: 12px; color: #94a3b8; margin-top: 16px; }
        
        @media (max-width: 600px) {
            .header { padding: 32px 24px; }
            .content { padding: 32px 24px; }
            .booking-details { grid-template-columns: 1fr; }
            .booking-header { flex-direction: column; align-items: start; gap: 8px; }
            .footer { padding: 24px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Reserved!</h1>
            <p>Pay comfortably upon arrival</p>
        </div>
        
        <div class="content">
            <div class="status-badge">Awaiting Payment on Arrival</div>
            
            <p style="font-size: 16px; margin-bottom: 24px;">Dear {{customer_name}},</p>
            
            <p style="margin-bottom: 24px;">Great news! Your booking has been successfully reserved. You can pay comfortably in cash when you arrive at the property.</p>
            
            <div class="booking-card">
                <div class="booking-header">
                    <div class="booking-title">{{property_name}}</div>
                    <div class="booking-id">{{booking_reference}}</div>
                </div>
                
                <div class="booking-details">
                    <div class="detail-item">
                        <div class="detail-label">Check-in</div>
                        <div class="detail-value">{{check_in_formatted}}</div>
                        <div style="font-size: 14px; color: #64748b;">{{check_in_time}}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Check-out</div>
                        <div class="detail-value">{{check_out_formatted}}</div>
                        <div style="font-size: 14px; color: #64748b;">11:00</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Duration</div>
                        <div class="detail-value">{{nights}} {{nights_plural}}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Guests</div>
                        <div class="detail-value">{{guests}} {{guests_plural}}</div>
                    </div>
                </div>
            </div>
            
            <div class="payment-info">
                <div class="payment-header">
                    <div class="payment-title">Cash Payment Required</div>
                </div>
                <div class="payment-amount">{{currency_symbol}}{{total_amount}}</div>
                <p style="text-align: center; color: #92400e; font-weight: 500;">Pay this amount in cash upon arrival</p>
                
                <div class="reference-code">
                    <div class="reference-label">Reference Code</div>
                    <div class="reference-value">{{cash_reference_code}}</div>
                </div>
            </div>
            
            <div class="instructions">
                <div class="instructions-title">Payment Instructions</div>
                <ul class="instructions-list">
                    <li>Payment location: {{payment_location}}</li>
                    <li>Please have the exact amount ready in Euro notes</li>
                    <li>Quote your reference code: <strong>{{cash_reference_code}}</strong></li>
                    <li>Payment must be completed during check-in</li>
                    <li>We accept Euro cash only (no credit cards on-site)</li>
                </ul>
            </div>
            
            {{#has_special_requests}}
            <div style="background: #f0fdf4; border: 1px solid #22c55e; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <h4 style="color: #15803d; margin-bottom: 8px; font-weight: 600;">Your Special Requests</h4>
                <p style="color: #166534; margin: 0;">{{special_requests}}</p>
            </div>
            {{/has_special_requests}}
            
            <div class="cta-section">
                <a href="{{booking_url}}" class="cta-button">View Booking Details</a>
            </div>
            
            <p style="margin-top: 32px;">We look forward to welcoming you to {{property_name}} in {{business_city}}!</p>
            
            <p>Warm regards,<br><strong>The {{business_name}} Team</strong></p>
        </div>
        
        <div class="footer">
            <div class="footer-title">{{business_name}}</div>
            <div class="footer-subtitle">Your home away from home in {{business_city}}, {{business_country}}</div>
            
            <div class="footer-contact">📧 {{business_email}} | 📞 {{business_phone}}</div>
            <div class="footer-contact">📍 {{business_address}}</div>
            
            <div class="footer-legal">
                © {{current_year}} {{business_name}}. All rights reserved.<br>
                Booking Reference: {{booking_reference}}
            </div>
        </div>
    </div>
</body>
</html>',
subject = '🏠 Booking Reserved - Pay on Arrival | {{property_name}}'
WHERE name = 'Cash on Arrival Instructions';

-- 2. Cash Payment Received Template
UPDATE email_templates 
SET content = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Received - Booking Confirmed!</title>
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 32px; text-align: center; }
        .header h1 { color: #ffffff; font-size: 28px; font-weight: 700; margin-bottom: 8px; }
        .header p { color: #a7f3d0; font-size: 16px; font-weight: 400; }
        .content { padding: 40px 32px; }
        .status-badge { display: inline-flex; align-items: center; background: #d1fae5; color: #065f46; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 600; margin-bottom: 24px; }
        .status-badge::before { content: "✅"; margin-right: 8px; }
        .confirmation-card { background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border: 1px solid #10b981; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
        .confirmation-icon { font-size: 48px; margin-bottom: 16px; }
        .confirmation-title { font-size: 24px; font-weight: 700; color: #065f46; margin-bottom: 8px; }
        .confirmation-subtitle { color: #047857; font-weight: 500; }
        .booking-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .booking-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px; }
        .booking-title { font-size: 20px; font-weight: 600; color: #1e293b; }
        .booking-id { font-size: 14px; color: #64748b; font-family: "SF Mono", Consolas, monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 6px; }
        .booking-details { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
        .detail-item { }
        .detail-label { font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px; }
        .detail-value { font-size: 16px; font-weight: 600; color: #1e293b; }
        .payment-confirmation { background: #ecfdf5; border: 1px solid #10b981; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .payment-header { display: flex; align-items: center; margin-bottom: 16px; }
        .payment-header::before { content: "💰"; font-size: 20px; margin-right: 12px; }
        .payment-title { font-size: 18px; font-weight: 600; color: #065f46; }
        .payment-amount { font-size: 32px; font-weight: 700; color: #059669; text-align: center; margin: 16px 0; }
        .next-steps { background: #eff6ff; border: 1px solid #3b82f6; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .next-steps-title { font-size: 18px; font-weight: 600; color: #1d4ed8; margin-bottom: 16px; display: flex; align-items: center; }
        .next-steps-title::before { content: "📋"; margin-right: 12px; }
        .next-steps-list { list-style: none; }
        .next-steps-list li { margin-bottom: 12px; padding-left: 24px; position: relative; }
        .next-steps-list li::before { content: "→"; position: absolute; left: 0; color: #1d4ed8; font-weight: bold; }
        .cta-section { text-align: center; margin: 40px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transition: transform 0.2s; margin: 0 8px; }
        .cta-button:hover { transform: translateY(-2px); }
        .cta-button.secondary { background: #ffffff; color: #059669; border: 2px solid #10b981; box-shadow: none; }
        .footer { background: #f1f5f9; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer-title { font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 8px; }
        .footer-subtitle { color: #64748b; margin-bottom: 16px; }
        .footer-contact { font-size: 14px; color: #64748b; margin-bottom: 8px; }
        .footer-legal { font-size: 12px; color: #94a3b8; margin-top: 16px; }
        
        @media (max-width: 600px) {
            .header { padding: 32px 24px; }
            .content { padding: 32px 24px; }
            .booking-details { grid-template-columns: 1fr; }
            .booking-header { flex-direction: column; align-items: start; gap: 8px; }
            .footer { padding: 24px; }
            .cta-button { display: block; margin: 8px 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Payment Received!</h1>
            <p>Your booking is now confirmed</p>
        </div>
        
        <div class="content">
            <div class="status-badge">Booking Confirmed</div>
            
            <p style="font-size: 16px; margin-bottom: 24px;">Dear {{customer_name}},</p>
            
            <div class="confirmation-card">
                <div class="confirmation-icon">🎉</div>
                <div class="confirmation-title">Thank You!</div>
                <div class="confirmation-subtitle">Your cash payment has been received and your booking is now confirmed.</div>
            </div>
            
            <div class="booking-card">
                <div class="booking-header">
                    <div class="booking-title">{{property_name}}</div>
                    <div class="booking-id">{{booking_reference}}</div>
                </div>
                
                <div class="booking-details">
                    <div class="detail-item">
                        <div class="detail-label">Check-in</div>
                        <div class="detail-value">{{check_in_formatted}}</div>
                        <div style="font-size: 14px; color: #64748b;">{{check_in_time}}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Check-out</div>
                        <div class="detail-value">{{check_out_formatted}}</div>
                        <div style="font-size: 14px; color: #64748b;">11:00</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Duration</div>
                        <div class="detail-value">{{nights}} {{nights_plural}}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Guests</div>
                        <div class="detail-value">{{guests}} {{guests_plural}}</div>
                    </div>
                </div>
            </div>
            
            <div class="payment-confirmation">
                <div class="payment-header">
                    <div class="payment-title">Payment Confirmed</div>
                </div>
                <div class="payment-amount">{{currency_symbol}}{{total_amount}}</div>
                <p style="text-align: center; color: #065f46; font-weight: 500;">Cash payment received • Reference: {{cash_reference_code}}</p>
            </div>
            
            <div class="next-steps">
                <div class="next-steps-title">What''s Next?</div>
                <ul class="next-steps-list">
                    <li>Check-in instructions will be sent 48 hours before arrival</li>
                    <li>Bring the same ID document you used when booking</li>
                    <li>Our team is available 24/7 for any assistance needed</li>
                    <li>Free cancellation available up to 48 hours before check-in</li>
                </ul>
            </div>
            
            {{#has_special_requests}}
            <div style="background: #f0fdf4; border: 1px solid #22c55e; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <h4 style="color: #15803d; margin-bottom: 8px; font-weight: 600;">Your Special Requests</h4>
                <p style="color: #166534; margin: 0;">{{special_requests}}</p>
            </div>
            {{/has_special_requests}}
            
            <div class="cta-section">
                <a href="{{booking_url}}" class="cta-button">View Booking Details</a>
                <a href="{{contact_url}}" class="cta-button secondary">Contact Us</a>
            </div>
            
            <p style="margin-top: 32px;">We can''t wait to welcome you to {{property_name}} and provide you with an unforgettable stay in {{business_city}}!</p>
            
            <p>Warm regards,<br><strong>The {{business_name}} Team</strong></p>
        </div>
        
        <div class="footer">
            <div class="footer-title">{{business_name}}</div>
            <div class="footer-subtitle">Your home away from home in {{business_city}}, {{business_country}}</div>
            
            <div class="footer-contact">📧 {{business_email}} | 📞 {{business_phone}}</div>
            <div class="footer-contact">📍 {{business_address}}</div>
            
            <div class="footer-legal">
                © {{current_year}} {{business_name}}. All rights reserved.<br>
                Booking Reference: {{booking_reference}}
            </div>
        </div>
    </div>
</body>
</html>',
subject = '✅ Payment Received - Thank You! | {{property_name}}'
WHERE name = 'Cash Payment Received';

-- 3. SEPA Payment Instructions Template  
UPDATE email_templates 
SET content = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete Your Payment - SEPA Transfer</title>
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%); padding: 40px 32px; text-align: center; }
        .header h1 { color: #ffffff; font-size: 28px; font-weight: 700; margin-bottom: 8px; }
        .header p { color: #ddd6fe; font-size: 16px; font-weight: 400; }
        .content { padding: 40px 32px; }
        .status-badge { display: inline-flex; align-items: center; background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 9999px; font-size: 14px; font-weight: 600; margin-bottom: 24px; }
        .status-badge::before { content: "⏳"; margin-right: 8px; }
        .booking-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .booking-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px; }
        .booking-title { font-size: 20px; font-weight: 600; color: #1e293b; }
        .booking-id { font-size: 14px; color: #64748b; font-family: "SF Mono", Consolas, monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 6px; }
        .booking-details { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
        .detail-item { }
        .detail-label { font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px; }
        .detail-value { font-size: 16px; font-weight: 600; color: #1e293b; }
        .payment-info { background: #fdf4ff; border: 1px solid #8b5cf6; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .payment-header { display: flex; align-items: center; margin-bottom: 16px; }
        .payment-header::before { content: "🏦"; font-size: 20px; margin-right: 12px; }
        .payment-title { font-size: 18px; font-weight: 600; color: #6b21a8; }
        .payment-amount { font-size: 32px; font-weight: 700; color: #7c3aed; text-align: center; margin: 16px 0; }
        .bank-details { background: #ffffff; border: 2px solid #8b5cf6; border-radius: 12px; padding: 20px; margin: 16px 0; }
        .bank-detail { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .bank-detail:last-child { border-bottom: none; }
        .bank-label { font-weight: 500; color: #6b21a8; }
        .bank-value { font-family: "SF Mono", Consolas, monospace; font-weight: 600; color: #1e293b; background: #f3f4f6; padding: 4px 8px; border-radius: 4px; }
        .deadline-warning { background: #fef2f2; border: 1px solid #f87171; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center; }
        .deadline-warning::before { content: "⚠️"; font-size: 24px; display: block; margin-bottom: 8px; }
        .deadline-title { font-size: 16px; font-weight: 600; color: #dc2626; margin-bottom: 8px; }
        .deadline-date { font-size: 20px; font-weight: 700; color: #dc2626; }
        .instructions { background: #eff6ff; border: 1px solid #3b82f6; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .instructions-title { font-size: 18px; font-weight: 600; color: #1d4ed8; margin-bottom: 16px; display: flex; align-items: center; }
        .instructions-title::before { content: "📝"; margin-right: 12px; }
        .instructions-list { list-style: none; }
        .instructions-list li { margin-bottom: 12px; padding-left: 24px; position: relative; }
        .instructions-list li::before { content: counter(step-counter); counter-increment: step-counter; position: absolute; left: 0; background: #1d4ed8; color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; }
        .instructions-list { counter-reset: step-counter; }
        .cta-section { text-align: center; margin: 40px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: