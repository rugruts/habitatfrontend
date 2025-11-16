-- iCal Feed Management Tables
-- Handles OTA calendar synchronization (Airbnb, Booking.com, etc)

-- iCal feeds table
CREATE TABLE IF NOT EXISTS ical_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('airbnb', 'booking', 'vrbo', 'manual')),
  feed_url TEXT NOT NULL,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'success', 'error')),
  sync_error TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(unit_id, source)
);

-- iCal events table (synced from feeds)
CREATE TABLE IF NOT EXISTS ical_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id UUID NOT NULL REFERENCES ical_feeds(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL, -- ID from external source
  title TEXT,
  description TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status TEXT DEFAULT 'blocked' CHECK (status IN ('blocked', 'available', 'tentative')),
  source_data JSONB, -- Store original event data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(feed_id, external_id)
);

-- Create indexes for performance
CREATE INDEX idx_ical_feeds_unit_id ON ical_feeds(unit_id);
CREATE INDEX idx_ical_feeds_source ON ical_feeds(source);
CREATE INDEX idx_ical_feeds_is_active ON ical_feeds(is_active);
CREATE INDEX idx_ical_events_unit_id ON ical_events(unit_id);
CREATE INDEX idx_ical_events_feed_id ON ical_events(feed_id);
CREATE INDEX idx_ical_events_dates ON ical_events(check_in, check_out);
CREATE INDEX idx_ical_events_status ON ical_events(status);

-- Create triggers for updated_at
CREATE TRIGGER update_ical_feeds_updated_at
  BEFORE UPDATE ON ical_feeds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ical_events_updated_at
  BEFORE UPDATE ON ical_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for ical_feeds
ALTER TABLE ical_feeds ENABLE ROW LEVEL SECURITY;

-- Admins can read all feeds
CREATE POLICY "Admins can read all ical feeds" ON ical_feeds
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can insert feeds
CREATE POLICY "Admins can insert ical feeds" ON ical_feeds
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update feeds
CREATE POLICY "Admins can update ical feeds" ON ical_feeds
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can delete feeds
CREATE POLICY "Admins can delete ical feeds" ON ical_feeds
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for ical_events
ALTER TABLE ical_events ENABLE ROW LEVEL SECURITY;

-- Admins can read all events
CREATE POLICY "Admins can read all ical events" ON ical_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- System can insert events (via backend)
CREATE POLICY "System can insert ical events" ON ical_events
  FOR INSERT WITH CHECK (true);

-- System can update events (via backend)
CREATE POLICY "System can update ical events" ON ical_events
  FOR UPDATE USING (true);

-- System can delete events (via backend)
CREATE POLICY "System can delete ical events" ON ical_events
  FOR DELETE USING (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ical_feeds TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ical_events TO authenticated;

