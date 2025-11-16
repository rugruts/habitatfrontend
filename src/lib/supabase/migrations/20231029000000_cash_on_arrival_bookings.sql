-- Create cash_on_arrival_bookings table
CREATE TABLE IF NOT EXISTS cash_on_arrival_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  payment_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_cash_on_arrival_booking_id ON cash_on_arrival_bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_cash_on_arrival_status ON cash_on_arrival_bookings(status);

-- Enable Row Level Security
ALTER TABLE cash_on_arrival_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own cash on arrival bookings" ON cash_on_arrival_bookings
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE customer_email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Admins can manage all cash on arrival bookings" ON cash_on_arrival_bookings
  FOR ALL USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM admin_users WHERE is_active = true
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cash_on_arrival_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_cash_on_arrival_updated_at
  BEFORE UPDATE ON cash_on_arrival_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_cash_on_arrival_updated_at();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON cash_on_arrival_bookings TO authenticated;
GRANT ALL ON cash_on_arrival_bookings TO service_role;
