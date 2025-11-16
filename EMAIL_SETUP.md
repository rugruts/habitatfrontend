# Email System Setup

## Overview

The Habitat Lobby email system sends transactional emails with calendar attachments using SMTP.

## Supported Email Providers

### 1. Postmark (Recommended)

**Setup**:
```bash
EMAIL_PROVIDER=postmark
POSTMARK_API_TOKEN=your_postmark_token
EMAIL_FROM=noreply@habitatlobby.com
```

**Features**:
- Reliable delivery
- Bounce handling
- Template support
- Webhook integration

**Sign up**: https://postmarkapp.com

### 2. SendGrid

**Setup**:
```bash
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=noreply@habitatlobby.com
```

**Features**:
- High deliverability
- Analytics
- Template support

**Sign up**: https://sendgrid.com

### 3. Generic SMTP

**Setup**:
```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_password
EMAIL_FROM=noreply@habitatlobby.com
```

## Email Templates

### 1. Booking Pending
- **Trigger**: When booking is created
- **Content**: Booking details, payment instructions
- **Recipient**: Guest email

### 2. Booking Paid
- **Trigger**: When payment succeeds
- **Content**: Confirmation, booking details, ICS attachment
- **Recipient**: Guest email
- **Attachment**: Calendar event (.ics)

### 3. Booking Cancelled
- **Trigger**: When booking is cancelled
- **Content**: Cancellation details, refund info
- **Recipient**: Guest email

### 4. Pre-Arrival
- **Trigger**: 24 hours before check-in
- **Content**: Check-in instructions, WiFi, parking
- **Recipient**: Guest email

### 5. Post-Stay Review
- **Trigger**: 1 day after check-out
- **Content**: Review request, stay summary
- **Recipient**: Guest email

## ICS Calendar Attachments

### Features

- **UID**: Unique identifier for the event
- **DTSTART/DTEND**: Check-in and check-out times
- **SUMMARY**: Property name
- **DESCRIPTION**: Guest info, booking ID, total price
- **LOCATION**: Property address
- **TIMEZONE**: Europe/Athens

### Example

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Habitat Lobby//Habitat Lobby//EN
BEGIN:VEVENT
UID:booking-123@habitatlobby.com
DTSTART:20250201T150000Z
DTEND:20250205T110000Z
SUMMARY:Reservation at Apartment 1
DESCRIPTION:Guest: John Doe\nEmail: john@example.com\nBooking ID: 123
LOCATION:123 Main St, Athens, Greece
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR
```

## Integration with Booking Flow

### 1. Payment Succeeded Webhook

```javascript
// In backend/api/stripe-webhook.js
const { sendBookingPaidEmail } = require('../lib/email');
const { generateBookingIcs } = require('../lib/ics-generator');

// When payment_intent.succeeded
const icsBuffer = generateBookingIcs(booking, unit, guest);
await sendBookingPaidEmail(booking, guest, icsBuffer);
```

### 2. Booking Cancelled

```javascript
// In backend/api/booking.js
const { sendBookingCancelledEmail } = require('../lib/email');

// When cancelling booking
await sendBookingCancelledEmail(booking, guest);
```

### 3. Scheduled Tasks

```javascript
// In backend/api/cron.js
const { sendPreArrivalEmail, sendPostStayReviewEmail } = require('../lib/email');

// Pre-arrival (24 hours before check-in)
await sendPreArrivalEmail(booking, guest);

// Post-stay (1 day after check-out)
await sendPostStayReviewEmail(booking, guest);
```

## Testing

### Local Testing

```bash
# 1. Set up test email provider
EMAIL_PROVIDER=smtp
SMTP_HOST=localhost
SMTP_PORT=1025

# 2. Start MailHog (local SMTP server)
docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog

# 3. View emails at http://localhost:8025
```

### Production Testing

```bash
# 1. Send test email
curl -X POST http://localhost:3001/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<p>Test</p>"
  }'

# 2. Check email provider dashboard
```

## Troubleshooting

### Email Not Sending

1. **Check credentials**
   ```bash
   # Verify SMTP credentials
   telnet smtp.example.com 587
   ```

2. **Check logs**
   ```bash
   # Backend logs
   npm run dev 2>&1 | grep -i email
   ```

3. **Check email provider**
   - Postmark: https://account.postmarkapp.com/activity
   - SendGrid: https://app.sendgrid.com/email_activity

### ICS Not Attaching

1. **Check ICS generation**
   ```javascript
   const { generateBookingIcs } = require('./lib/ics-generator');
   const ics = generateBookingIcs(booking, unit, guest);
   console.log(ics.toString());
   ```

2. **Check email sending**
   - Verify attachments array is populated
   - Check file size (should be < 1MB)

### Bounces and Complaints

1. **Monitor bounces**
   - Set up webhook in email provider
   - Remove bounced emails from list

2. **Handle complaints**
   - Implement unsubscribe link
   - Honor unsubscribe requests

## Best Practices

1. **Always include unsubscribe link** in transactional emails
2. **Use plain text fallback** for HTML emails
3. **Test templates** before deploying
4. **Monitor delivery rates** regularly
5. **Keep templates responsive** for mobile
6. **Use proper sender name** (e.g., "Habitat Lobby <noreply@habitatlobby.com>")

## Environment Variables

```bash
# Email Provider
EMAIL_PROVIDER=postmark|sendgrid|smtp

# Postmark
POSTMARK_API_TOKEN=your_token

# SendGrid
SENDGRID_API_KEY=your_key

# Generic SMTP
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=user@example.com
SMTP_PASSWORD=password

# Common
EMAIL_FROM=noreply@habitatlobby.com
```

## References

- [Nodemailer Documentation](https://nodemailer.com/)
- [Postmark API](https://postmarkapp.com/developer)
- [SendGrid API](https://sendgrid.com/docs/)
- [RFC 5545 - iCalendar](https://tools.ietf.org/html/rfc5545)

