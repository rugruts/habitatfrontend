# Local Development Setup Guide

## Prerequisites

- Node.js 18+ (install from https://nodejs.org/)
- npm or yarn
- Git
- A Supabase account (https://supabase.com)
- A Stripe account (https://stripe.com)

## Step 1: Clone the Repository

```bash
git clone https://github.com/rugruts/habitatfrontend.git
cd habitatfrontend
```

## Step 2: Install Frontend Dependencies

```bash
npm install
```

## Step 3: Setup Frontend Environment

```bash
# Copy the sample environment file
cp .env.sample .env

# Edit .env with your values
# Required values:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_STRIPE_PUBLISHABLE_KEY
# - VITE_API_URL (point to http://localhost:3001/api for local backend)
```

## Step 4: Setup Backend

```bash
cd backend

# Install backend dependencies
npm install

# Copy the sample environment file
cp ../.env.sample .env

# Edit .env with your backend values
# Required values:
# - SUPABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY
# - STRIPE_SECRET_KEY
# - STRIPE_WEBHOOK_SECRET
# - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
```

## Step 5: Start Development Servers

### Terminal 1 - Frontend

```bash
# From project root
npm run dev
```

Frontend will be available at: http://localhost:5173

### Terminal 2 - Backend

```bash
# From backend directory
npm run dev
```

Backend will be available at: http://localhost:3001

### Terminal 3 - Stripe Webhook Listener (Optional)

```bash
# Install Stripe CLI from https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

This will give you a webhook signing secret to add to your backend `.env` as `STRIPE_WEBHOOK_SECRET`.

## Step 6: Database Setup

### Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Copy the project URL and anon key to your `.env`
3. Get the service role key from Settings → API and add to backend `.env`

### Run Migrations

```bash
# From project root
npm run db:migrate
```

This will run all migrations in `supabase/migrations/`.

### Seed Sample Data (Optional)

```bash
npm run db:seed
```

## Step 7: Verify Setup

### Frontend Health Check

```bash
curl http://localhost:5173
```

### Backend Health Check

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "service": "Habitat Lobby Email API"
}
```

## Step 8: Test Payment Flow

### Using Stripe Test Cards

Use these test card numbers in the checkout:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

Expiry: Any future date
CVC: Any 3 digits

### Test Booking Flow

1. Open http://localhost:5173
2. Select an apartment
3. Choose dates
4. Click "Get Quote"
5. Proceed to checkout
6. Use test card 4242 4242 4242 4242
7. Complete payment

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>
```

### Supabase Connection Issues

- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check Supabase project is active
- Verify network connectivity

### Stripe Issues

- Verify `STRIPE_SECRET_KEY` is correct
- Check webhook secret is set
- Ensure Stripe CLI is running for local webhook testing

### Email Not Sending

- Verify SMTP credentials in backend `.env`
- Check email provider allows SMTP connections
- Review backend logs for errors

## Development Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run typecheck    # Check TypeScript types

# Backend
cd backend
npm run dev          # Start dev server with nodemon
npm run start        # Start production server
npm test             # Run tests

# Database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed sample data
npm run sync:ical    # Sync iCal feeds
```

## Next Steps

- Read SECURITY.md for security guidelines
- Check backend/README.md for API documentation
- Review src/components for UI component usage
- Explore supabase/migrations for database schema

