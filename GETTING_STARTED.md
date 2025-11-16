# Habitat Lobby - Getting Started Guide

Welcome to the Habitat Lobby project! This guide will help you get up and running quickly.

## Quick Links

- **Frontend Repository**: https://github.com/rugruts/habitatfrontend
- **Backend Repository**: https://github.com/rugruts/backendhabitat
- **Live Site**: https://habitatlobby.com

## Documentation

Start with these documents in order:

1. **[LOCAL_SETUP.md](./LOCAL_SETUP.md)** - Set up your development environment
2. **[SECURITY.md](./SECURITY.md)** - Understand security best practices
3. **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Overview of implemented features
4. **[AUGMENTATION_STATUS.md](./AUGMENTATION_STATUS.md)** - Current project status
5. **[backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)** - API reference

## Project Structure

```
habitat-lobby-trio/
├── Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── Backend (Node.js + Express)
│   ├── lib/
│   │   ├── availability.js
│   │   ├── pricing.js
│   │   ├── stripe-server.js
│   │   └── ical-sync.js
│   ├── api/
│   │   ├── booking.js
│   │   ├── stripe-webhook.js
│   │   ├── ical.js
│   │   └── cron.js
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── Database (Supabase)
│   └── supabase/migrations/
│       ├── 20250116000000_create_booking_payment_system.sql
│       └── 20250117000000_create_ical_tables.sql
│
└── Documentation
    ├── LOCAL_SETUP.md
    ├── SECURITY.md
    ├── IMPLEMENTATION_SUMMARY.md
    ├── AUGMENTATION_STATUS.md
    ├── PR_DESCRIPTIONS.md
    └── GETTING_STARTED.md (this file)
```

## Key Features

### ✅ Payment Processing
- Secure Stripe integration (server-side only)
- Payment intents with idempotency keys
- Webhook signature verification
- 3D Secure enabled

### ✅ Booking Management
- Soft holds to prevent double-booking
- Availability checking
- Price calculations with fees
- Booking status tracking

### ✅ Calendar Synchronization
- OTA feed integration (Airbnb, Booking.com, VRBO)
- Automatic sync with error handling
- iCal calendar export
- Scheduled background tasks

### ✅ Security
- Row Level Security (RLS) on all tables
- Role-based access control
- Audit logging for compliance
- Environment variable management

## Development Workflow

### 1. Clone Repositories

```bash
# Clone main repository
git clone https://github.com/rugruts/habitatfrontend.git
cd habitatfrontend

# Backend is a submodule
git submodule update --init --recursive
```

### 2. Set Up Environment

```bash
# Copy environment template
cp .env.sample .env

# Edit .env with your values
# - Supabase credentials
# - Stripe keys
# - Email service credentials
```

### 3. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 4. Apply Database Migrations

```bash
# Using Supabase CLI
supabase migration up

# Or manually in Supabase dashboard
# Copy SQL from supabase/migrations/ and run
```

### 5. Start Development Servers

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Stripe webhook forwarding
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

## Testing the Payment Flow

### 1. Generate a Quote

```bash
curl -X POST http://localhost:3001/api/booking/quote \
  -H "Content-Type: application/json" \
  -d '{
    "unitId": "550e8400-e29b-41d4-a716-446655440000",
    "checkIn": "2025-02-01",
    "checkOut": "2025-02-05"
  }'
```

### 2. Create a Booking

```bash
curl -X POST http://localhost:3001/api/booking/create \
  -H "Content-Type: application/json" \
  -d '{
    "unitId": "550e8400-e29b-41d4-a716-446655440000",
    "checkIn": "2025-02-01",
    "checkOut": "2025-02-05",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "+30 123 456 7890"
  }'
```

### 3. Complete Payment

Use Stripe test card: `4242 4242 4242 4242`

### 4. Verify Webhook

Check backend logs for webhook event processing

## Deployment

### Prerequisites

- Vercel account
- Supabase project
- Stripe account
- Email service (Postmark/SendGrid)

### Steps

1. **Deploy Backend**
   ```bash
   cd backend
   vercel deploy
   ```

2. **Deploy Frontend**
   ```bash
   vercel deploy
   ```

3. **Set Environment Variables**
   - Add all variables from `.env.sample` to Vercel

4. **Configure Stripe Webhooks**
   - Add webhook endpoint: `https://your-backend.vercel.app/api/stripe/webhook`

5. **Apply Migrations**
   - Run migrations in Supabase dashboard

6. **Test End-to-End**
   - Create test booking
   - Verify payment processing
   - Check email notifications

## Common Tasks

### Add a New OTA Feed

```bash
curl -X POST http://localhost:3001/api/ical/feeds \
  -H "Content-Type: application/json" \
  -d '{
    "unitId": "550e8400-e29b-41d4-a716-446655440000",
    "source": "airbnb",
    "feedUrl": "https://www.airbnb.com/calendar/ical/..."
  }'
```

### Manually Sync Feeds

```bash
curl -X POST http://localhost:3001/api/cron/sync-ical \
  -H "x-cron-secret: your_cron_secret"
```

### Export Calendar

```bash
curl http://localhost:3001/api/ical/apartment-1 > calendar.ics
```

### View Audit Logs

```bash
# In Supabase dashboard
SELECT * FROM audits ORDER BY created_at DESC LIMIT 50;
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Stripe Connection Issues

- Verify `STRIPE_SECRET_KEY` is correct
- Check webhook secret is set
- Ensure Stripe CLI is running for local testing

### Database Connection Issues

- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check Supabase project is active
- Verify network connectivity

### Email Not Sending

- Verify SMTP credentials
- Check email service is active
- Review email logs in backend

## Support

For issues or questions:

1. Check the relevant documentation file
2. Review error logs in backend
3. Check Supabase logs
4. Review Stripe dashboard for payment issues

## Next Steps

1. **Read** - Review all documentation
2. **Setup** - Follow LOCAL_SETUP.md
3. **Test** - Run manual tests
4. **Deploy** - Follow deployment steps
5. **Integrate** - Update frontend to use new APIs
6. **Monitor** - Set up error tracking

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## License

Proprietary - Habitat Lobby

## Contact

For questions or support, contact the development team.

