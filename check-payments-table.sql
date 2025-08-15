-- Check if payments table exists and create it if it doesn't
DO $$
BEGIN
    -- Check if payments table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payments') THEN
        -- Create payments table
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

        -- Create indexes
        CREATE INDEX idx_payments_stripe_id ON payments(stripe_payment_intent_id);
        CREATE INDEX idx_payments_booking_id ON payments(booking_id);
        CREATE INDEX idx_payments_status ON payments(status);
        CREATE INDEX idx_payments_created_at ON payments(created_at);

        -- Enable RLS
        ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies
        CREATE POLICY "Admin can view all payments" ON payments
          FOR SELECT USING (
            auth.email() IN (
              'admin@habitat.com',
              'admin@habitatlobby.com', 
              'info@habitatlobby.com',
              'booking@habitatlobby.com'
            )
          );

        CREATE POLICY "Admin can insert payments" ON payments
          FOR INSERT WITH CHECK (
            auth.email() IN (
              'admin@habitat.com',
              'admin@habitatlobby.com', 
              'info@habitatlobby.com',
              'booking@habitatlobby.com'
            )
          );

        CREATE POLICY "Admin can update payments" ON payments
          FOR UPDATE USING (
            auth.email() IN (
              'admin@habitat.com',
              'admin@habitatlobby.com', 
              'info@habitatlobby.com',
              'booking@habitatlobby.com'
            )
          );

        -- Grant permissions
        GRANT SELECT, INSERT, UPDATE ON payments TO authenticated;

        RAISE NOTICE 'Payments table created successfully';
    ELSE
        RAISE NOTICE 'Payments table already exists';
    END IF;
END $$;
