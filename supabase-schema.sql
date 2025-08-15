-- Habitat Lobby Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE line_item_type AS ENUM ('accommodation', 'cleaning', 'tax', 'fee', 'discount');

-- Properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    max_guests INTEGER NOT NULL DEFAULT 2,
    bedrooms INTEGER NOT NULL DEFAULT 1,
    bathrooms INTEGER NOT NULL DEFAULT 1,
    size_sqm INTEGER,
    amenities TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    location JSONB NOT NULL,
    active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    min_nights INTEGER DEFAULT 2,
    max_nights INTEGER DEFAULT 30,
    check_in_time TIME DEFAULT '15:00',
    check_out_time TIME DEFAULT '11:00'
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL,
    nights INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    payment_intent_id TEXT,
    stripe_payment_intent_id TEXT,
    status booking_status DEFAULT 'pending',
    special_requests TEXT,
    booking_source TEXT DEFAULT 'website',
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Availability overrides table (for blocking dates or custom pricing)
CREATE TABLE availability_overrides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available BOOLEAN NOT NULL DEFAULT false,
    reason TEXT,
    price_override DECIMAL(10,2),
    UNIQUE(property_id, date)
);

-- Booking line items table (for detailed pricing breakdown)
CREATE TABLE booking_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    type line_item_type NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_active ON properties(active);
CREATE INDEX idx_bookings_property_id ON bookings(property_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX idx_availability_overrides_property_date ON availability_overrides(property_id, date);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_overrides_updated_at BEFORE UPDATE ON availability_overrides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check availability
CREATE OR REPLACE FUNCTION check_availability(
    property_uuid UUID,
    check_in_date DATE,
    check_out_date DATE
)
RETURNS BOOLEAN AS $$
DECLARE
    booking_conflict INTEGER;
    override_conflict INTEGER;
BEGIN
    -- Check for booking conflicts
    SELECT COUNT(*) INTO booking_conflict
    FROM bookings
    WHERE property_id = property_uuid
    AND status = 'confirmed'
    AND (
        (check_in_date >= check_in AND check_in_date < check_out)
        OR (check_out_date > check_in AND check_out_date <= check_out)
        OR (check_in_date <= check_in AND check_out_date >= check_out)
    );

    -- Check for availability overrides that block dates
    SELECT COUNT(*) INTO override_conflict
    FROM availability_overrides
    WHERE property_id = property_uuid
    AND date >= check_in_date
    AND date < check_out_date
    AND available = false;

    RETURN (booking_conflict = 0 AND override_conflict = 0);
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_line_items ENABLE ROW LEVEL SECURITY;

-- Public read access to active properties
CREATE POLICY "Properties are viewable by everyone" ON properties
    FOR SELECT USING (active = true);

-- Bookings are only viewable by authenticated users (admin)
CREATE POLICY "Bookings are viewable by authenticated users" ON bookings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow inserts for bookings (for creating new bookings)
CREATE POLICY "Allow booking creation" ON bookings
    FOR INSERT WITH CHECK (true);

-- Allow updates for bookings (for payment confirmation)
CREATE POLICY "Allow booking updates" ON bookings
    FOR UPDATE USING (true);

-- Availability overrides viewable by everyone
CREATE POLICY "Availability overrides are viewable by everyone" ON availability_overrides
    FOR SELECT USING (true);

-- Booking line items follow booking permissions
CREATE POLICY "Booking line items follow booking permissions" ON booking_line_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = booking_line_items.booking_id
        )
    );

CREATE POLICY "Allow booking line item creation" ON booking_line_items
    FOR INSERT WITH CHECK (true);
