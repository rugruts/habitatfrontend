-- Create payment tables for SEPA and Cash on Arrival
-- Run this in Supabase SQL Editor to create the missing payment tables

-- Create SEPA payments table
CREATE TABLE IF NOT EXISTS sepa_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    reference_code VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'expired')),
    iban_info JSONB NOT NULL DEFAULT '{}',
    customer_info JSONB NOT NULL DEFAULT '{}',
    payment_instructions TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    confirmed_by VARCHAR(255)
);

-- Create indexes for SEPA payments
CREATE INDEX IF NOT EXISTS idx_sepa_payments_booking_id ON sepa_payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_sepa_payments_reference_code ON sepa_payments(reference_code);
CREATE INDEX IF NOT EXISTS idx_sepa_payments_status ON sepa_payments(status);
CREATE INDEX IF NOT EXISTS idx_sepa_payments_expires_at ON sepa_payments(expires_at);

-- Create Cash on Arrival payments table
CREATE TABLE IF NOT EXISTS cash_on_arrival_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    reference_code VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    customer_info JSONB NOT NULL DEFAULT '{}',
    payment_instructions TEXT,
    property_address TEXT,
    payment_location TEXT NOT NULL DEFAULT 'At the property during check-in',
    check_in_time VARCHAR(10) NOT NULL DEFAULT '15:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    confirmed_by VARCHAR(255)
);

-- Create indexes for Cash on Arrival payments
CREATE INDEX IF NOT EXISTS idx_cash_payments_booking_id ON cash_on_arrival_payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_cash_payments_reference_code ON cash_on_arrival_payments(reference_code);
CREATE INDEX IF NOT EXISTS idx_cash_payments_status ON cash_on_arrival_payments(status);

-- Create or replace trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_sepa_payments_updated_at ON sepa_payments;
CREATE TRIGGER update_sepa_payments_updated_at
    BEFORE UPDATE ON sepa_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cash_payments_updated_at ON cash_on_arrival_payments;
CREATE TRIGGER update_cash_payments_updated_at
    BEFORE UPDATE ON cash_on_arrival_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE sepa_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_on_arrival_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sepa_payments
DROP POLICY IF EXISTS "sepa_payments_select_policy" ON sepa_payments;
CREATE POLICY "sepa_payments_select_policy" ON sepa_payments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "sepa_payments_insert_policy" ON sepa_payments;
CREATE POLICY "sepa_payments_insert_policy" ON sepa_payments
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "sepa_payments_update_policy" ON sepa_payments;
CREATE POLICY "sepa_payments_update_policy" ON sepa_payments
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "sepa_payments_delete_policy" ON sepa_payments;
CREATE POLICY "sepa_payments_delete_policy" ON sepa_payments
    FOR DELETE USING (true);

-- Create RLS policies for cash_on_arrival_payments
DROP POLICY IF EXISTS "cash_payments_select_policy" ON cash_on_arrival_payments;
CREATE POLICY "cash_payments_select_policy" ON cash_on_arrival_payments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "cash_payments_insert_policy" ON cash_on_arrival_payments;
CREATE POLICY "cash_payments_insert_policy" ON cash_on_arrival_payments
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "cash_payments_update_policy" ON cash_on_arrival_payments;
CREATE POLICY "cash_payments_update_policy" ON cash_on_arrival_payments
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "cash_payments_delete_policy" ON cash_on_arrival_payments;
CREATE POLICY "cash_payments_delete_policy" ON cash_on_arrival_payments
    FOR DELETE USING (true);

-- Create function to automatically expire SEPA payments
CREATE OR REPLACE FUNCTION expire_sepa_payments()
RETURNS void AS $$
BEGIN
    UPDATE sepa_payments 
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'pending' 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to run the expiration function
-- This would need to be set up separately in your Supabase dashboard
-- SELECT cron.schedule('expire-sepa-payments', '0 * * * *', 'SELECT expire_sepa_payments();');

-- Add comments to tables for documentation
COMMENT ON TABLE sepa_payments IS 'SEPA bank transfer payment records for bookings';
COMMENT ON TABLE cash_on_arrival_payments IS 'Cash on arrival payment records for bookings';

COMMENT ON COLUMN sepa_payments.reference_code IS 'Unique reference code for the SEPA transfer';
COMMENT ON COLUMN sepa_payments.iban_info IS 'JSON containing IBAN, BIC, account holder, bank name';
COMMENT ON COLUMN sepa_payments.customer_info IS 'JSON containing customer name and email';
COMMENT ON COLUMN sepa_payments.expires_at IS 'When the payment expires and booking may be cancelled';

COMMENT ON COLUMN cash_on_arrival_payments.reference_code IS 'Unique reference code for the cash payment';
COMMENT ON COLUMN cash_on_arrival_payments.customer_info IS 'JSON containing customer name and email';
COMMENT ON COLUMN cash_on_arrival_payments.payment_location IS 'Where the cash payment should be made';
COMMENT ON COLUMN cash_on_arrival_payments.check_in_time IS 'Expected check-in time for payment';

-- Verify tables were created
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('sepa_payments', 'cash_on_arrival_payments')
ORDER BY table_name;