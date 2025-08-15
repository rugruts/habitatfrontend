-- Drop payments table if it exists to recreate with correct structure
DROP TABLE IF EXISTS payments CASCADE;

-- Create payments table for Stripe payment sync
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'eur',
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled', 'refunded')),
  payment_method TEXT,
  refunded_amount DECIMAL(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop invoices table if it exists to recreate with correct structure
DROP TABLE IF EXISTS invoices CASCADE;

-- Create invoices table for Stripe invoice sync
CREATE TABLE invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  stripe_invoice_id TEXT UNIQUE,
  invoice_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
  issued_date DATE,
  due_date DATE,
  pdf_url TEXT,
  customer_email TEXT,
  customer_name TEXT,
  elorus_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_stripe_id ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

CREATE INDEX IF NOT EXISTS idx_invoices_stripe_id ON invoices(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoices_booking_id ON invoices(booking_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for payments
DROP POLICY IF EXISTS "Admin can view all payments" ON payments;
CREATE POLICY "Admin can view all payments" ON payments
  FOR SELECT USING (
    auth.email() IN (
      'admin@habitat.com',
      'admin@habitatlobby.com', 
      'info@habitatlobby.com',
      'booking@habitatlobby.com'
    )
  );

DROP POLICY IF EXISTS "Admin can insert payments" ON payments;
CREATE POLICY "Admin can insert payments" ON payments
  FOR INSERT WITH CHECK (
    auth.email() IN (
      'admin@habitat.com',
      'admin@habitatlobby.com', 
      'info@habitatlobby.com',
      'booking@habitatlobby.com'
    )
  );

DROP POLICY IF EXISTS "Admin can update payments" ON payments;
CREATE POLICY "Admin can update payments" ON payments
  FOR UPDATE USING (
    auth.email() IN (
      'admin@habitat.com',
      'admin@habitatlobby.com', 
      'info@habitatlobby.com',
      'booking@habitatlobby.com'
    )
  );

-- Create RLS policies for invoices
DROP POLICY IF EXISTS "Admin can view all invoices" ON invoices;
CREATE POLICY "Admin can view all invoices" ON invoices
  FOR SELECT USING (
    auth.email() IN (
      'admin@habitat.com',
      'admin@habitatlobby.com', 
      'info@habitatlobby.com',
      'booking@habitatlobby.com'
    )
  );

DROP POLICY IF EXISTS "Admin can insert invoices" ON invoices;
CREATE POLICY "Admin can insert invoices" ON invoices
  FOR INSERT WITH CHECK (
    auth.email() IN (
      'admin@habitat.com',
      'admin@habitatlobby.com', 
      'info@habitatlobby.com',
      'booking@habitatlobby.com'
    )
  );

DROP POLICY IF EXISTS "Admin can update invoices" ON invoices;
CREATE POLICY "Admin can update invoices" ON invoices
  FOR UPDATE USING (
    auth.email() IN (
      'admin@habitat.com',
      'admin@habitatlobby.com', 
      'info@habitatlobby.com',
      'booking@habitatlobby.com'
    )
  );

-- Grant permissions to authenticated users (admins)
GRANT SELECT, INSERT, UPDATE ON payments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON invoices TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
