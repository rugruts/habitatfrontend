-- Create sepa_payments table
CREATE TABLE IF NOT EXISTS sepa_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    reference_code VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'expired')),
    
    -- IBAN information
    iban_info JSONB NOT NULL DEFAULT '{}',
    
    -- Customer information
    customer_info JSONB NOT NULL DEFAULT '{}',
    
    -- Payment instructions
    payment_instructions TEXT,
    
    -- Timestamps
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    confirmed_by VARCHAR(255)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sepa_payments_booking_id ON sepa_payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_sepa_payments_reference_code ON sepa_payments(reference_code);
CREATE INDEX IF NOT EXISTS idx_sepa_payments_status ON sepa_payments(status);
CREATE INDEX IF NOT EXISTS idx_sepa_payments_expires_at ON sepa_payments(expires_at);
CREATE INDEX IF NOT EXISTS idx_sepa_payments_created_at ON sepa_payments(created_at);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_sepa_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_sepa_payments_updated_at
    BEFORE UPDATE ON sepa_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_sepa_payments_updated_at();

-- Create a function to automatically expire payments
CREATE OR REPLACE FUNCTION expire_sepa_payments()
RETURNS void AS $$
BEGIN
    UPDATE sepa_payments 
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'pending' 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a function to get pending SEPA payments for admin dashboard
CREATE OR REPLACE FUNCTION get_pending_sepa_payments()
RETURNS TABLE (
    id UUID,
    booking_id UUID,
    reference_code VARCHAR(50),
    amount DECIMAL(10,2),
    currency VARCHAR(3),
    status VARCHAR(20),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    days_until_expiry INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sp.id,
        sp.booking_id,
        sp.reference_code,
        sp.amount,
        sp.currency,
        sp.status,
        sp.customer_info->>'name' as customer_name,
        sp.customer_info->>'email' as customer_email,
        sp.created_at,
        sp.expires_at,
        EXTRACT(DAY FROM (sp.expires_at - NOW()))::INTEGER as days_until_expiry
    FROM sepa_payments sp
    WHERE sp.status = 'pending'
    ORDER BY sp.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Add RLS (Row Level Security) policies
ALTER TABLE sepa_payments ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own SEPA payments
CREATE POLICY "Users can view their own SEPA payments" ON sepa_payments
    FOR SELECT USING (
        booking_id IN (
            SELECT id FROM bookings 
            WHERE customer_email = auth.jwt() ->> 'email'
        )
    );

-- Policy for admins to view all SEPA payments
CREATE POLICY "Admins can view all SEPA payments" ON sepa_payments
    FOR ALL USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM admin_users
        )
    );

-- Policy for service role to manage SEPA payments
CREATE POLICY "Service role can manage SEPA payments" ON sepa_payments
    FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON sepa_payments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON sepa_payments TO service_role;

-- Add comments for documentation
COMMENT ON TABLE sepa_payments IS 'Stores SEPA bank transfer payment information';
COMMENT ON COLUMN sepa_payments.reference_code IS 'Unique reference code for bank transfer identification';
COMMENT ON COLUMN sepa_payments.iban_info IS 'JSON object containing IBAN, BIC, account holder, and bank information';
COMMENT ON COLUMN sepa_payments.customer_info IS 'JSON object containing customer name and email';
COMMENT ON COLUMN sepa_payments.payment_instructions IS 'Generated payment instructions for the customer';
COMMENT ON COLUMN sepa_payments.expires_at IS 'Payment deadline - payments expire after this date';
COMMENT ON COLUMN sepa_payments.confirmed_by IS 'Email or ID of admin who confirmed the payment';
