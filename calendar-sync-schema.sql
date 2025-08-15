-- Calendar Sync System Schema
-- Run this in Supabase SQL Editor to create calendar sync tables

-- Create platform type enum
CREATE TYPE platform_type AS ENUM (
  'airbnb',
  'booking_com', 
  'vrbo',
  'expedia',
  'custom'
);

-- Create sync type enum
CREATE TYPE sync_type AS ENUM (
  'import',
  'export',
  'bidirectional'
);

-- Create sync status enum
CREATE TYPE sync_status AS ENUM (
  'success',
  'failed',
  'partial',
  'in_progress'
);

-- Create calendar_syncs table
CREATE TABLE IF NOT EXISTS calendar_syncs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  sync_type sync_type NOT NULL,
  ical_url TEXT, -- For import syncs
  export_url TEXT, -- For export syncs (generated)
  is_active BOOLEAN DEFAULT true,
  sync_frequency_hours INTEGER DEFAULT 6,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  next_sync_at TIMESTAMP WITH TIME ZONE,
  total_bookings_synced INTEGER DEFAULT 0,
  last_error TEXT,
  settings JSONB DEFAULT '{}', -- Additional sync settings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calendar_sync_logs table
CREATE TABLE IF NOT EXISTS calendar_sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_sync_id UUID REFERENCES calendar_syncs(id) ON DELETE CASCADE,
  sync_type sync_type NOT NULL,
  status sync_status NOT NULL,
  bookings_processed INTEGER DEFAULT 0,
  bookings_added INTEGER DEFAULT 0,
  bookings_updated INTEGER DEFAULT 0,
  bookings_removed INTEGER DEFAULT 0,
  error_message TEXT,
  sync_details JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER
);

-- Create external_bookings table (for imported bookings)
CREATE TABLE IF NOT EXISTS external_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_sync_id UUID REFERENCES calendar_syncs(id) ON DELETE CASCADE,
  external_id VARCHAR(255), -- ID from external platform
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guest_name VARCHAR(255),
  guest_email VARCHAR(255),
  guest_count INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'confirmed',
  platform platform_type NOT NULL,
  raw_data JSONB DEFAULT '{}', -- Original iCal data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure no overlapping external bookings for same property
  CONSTRAINT no_overlap_external EXCLUDE USING gist (
    property_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  ) WHERE (status != 'cancelled')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calendar_syncs_property ON calendar_syncs(property_id);
CREATE INDEX IF NOT EXISTS idx_calendar_syncs_active ON calendar_syncs(is_active);
CREATE INDEX IF NOT EXISTS idx_calendar_syncs_next_sync ON calendar_syncs(next_sync_at);
CREATE INDEX IF NOT EXISTS idx_calendar_sync_logs_sync_id ON calendar_sync_logs(calendar_sync_id);
CREATE INDEX IF NOT EXISTS idx_calendar_sync_logs_status ON calendar_sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_external_bookings_property ON external_bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_external_bookings_dates ON external_bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_external_bookings_sync ON external_bookings(calendar_sync_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_calendar_sync_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calendar_syncs_updated_at
  BEFORE UPDATE ON calendar_syncs
  FOR EACH ROW
  EXECUTE FUNCTION update_calendar_sync_updated_at();

CREATE TRIGGER trigger_external_bookings_updated_at
  BEFORE UPDATE ON external_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_calendar_sync_updated_at();

-- Create function to schedule next sync
CREATE OR REPLACE FUNCTION schedule_next_sync()
RETURNS TRIGGER AS $$
BEGIN
  NEW.next_sync_at = NOW() + (NEW.sync_frequency_hours || ' hours')::INTERVAL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_schedule_next_sync
  BEFORE INSERT OR UPDATE ON calendar_syncs
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION schedule_next_sync();

-- Enable RLS (Row Level Security)
ALTER TABLE calendar_syncs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for authenticated users)
CREATE POLICY "Allow all operations for authenticated users" ON calendar_syncs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON calendar_sync_logs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON external_bookings
  FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON calendar_syncs TO authenticated;
GRANT ALL ON calendar_sync_logs TO authenticated;
GRANT ALL ON external_bookings TO authenticated;
GRANT USAGE ON SEQUENCE calendar_syncs_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE calendar_sync_logs_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE external_bookings_id_seq TO authenticated;

-- Insert sample calendar sync configurations
INSERT INTO calendar_syncs (name, property_id, platform, sync_type, ical_url, sync_frequency_hours, is_active) VALUES
(
  'Airbnb Import - River Loft',
  (SELECT id FROM properties WHERE name ILIKE '%loft%' LIMIT 1),
  'airbnb',
  'import',
  'https://calendar.airbnb.com/calendar/ical/12345.ics',
  6,
  false -- Disabled by default until real URL is provided
),
(
  'Booking.com Import - Garden Suite',
  (SELECT id FROM properties WHERE name ILIKE '%garden%' LIMIT 1),
  'booking_com',
  'import',
  'https://admin.booking.com/hotel/hoteladmin/ical.html?ses=67890',
  12,
  false -- Disabled by default until real URL is provided
);

-- Insert export sync for all properties
INSERT INTO calendar_syncs (name, property_id, platform, sync_type, export_url, sync_frequency_hours, is_active) VALUES
(
  'Export All Properties',
  NULL, -- NULL means all properties
  'custom',
  'export',
  'https://habitatlobby.com/api/calendar/export/all.ics',
  1,
  true
);
