-- Custom Map Pins System
-- Allows admin to create global pins that appear on all maps

-- Custom map pins table
CREATE TABLE IF NOT EXISTS custom_map_pins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL DEFAULT 'general',
    icon_name VARCHAR(100) NOT NULL DEFAULT 'MapPin',
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    color VARCHAR(7) DEFAULT '#3b82f6', -- Hex color for pin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    
    -- Additional metadata
    address TEXT,
    website_url TEXT,
    phone_number VARCHAR(50),
    opening_hours JSONB, -- Store structured opening hours
    tags TEXT[], -- Array of tags for filtering
    priority INTEGER DEFAULT 1, -- For ordering/importance
    
    -- For different map contexts
    show_on_property_maps BOOLEAN DEFAULT true,
    show_on_guide_maps BOOLEAN DEFAULT true,
    show_on_overview_maps BOOLEAN DEFAULT true
);

-- Pin categories table for organization
CREATE TABLE IF NOT EXISTS pin_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6b7280',
    icon_name VARCHAR(100) DEFAULT 'MapPin',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default categories
INSERT INTO pin_categories (name, description, color, icon_name, sort_order) VALUES
    ('restaurants', 'Restaurants and dining', '#f97316', 'Utensils', 1),
    ('attractions', 'Tourist attractions and landmarks', '#a855f7', 'Landmark', 2),
    ('shopping', 'Shopping centers and markets', '#3b82f6', 'ShoppingBag', 3),
    ('transportation', 'Bus stops, train stations', '#ef4444', 'Bus', 4),
    ('services', 'Banks, pharmacies, hospitals', '#22c55e', 'Building', 5),
    ('entertainment', 'Cafes, bars, cultural venues', '#ec4899', 'Music', 6),
    ('nature', 'Parks, trails, outdoor activities', '#16a34a', 'Trees', 7),
    ('accommodation', 'Hotels and lodging', '#6366f1', 'Home', 8),
    ('general', 'Miscellaneous points of interest', '#6b7280', 'MapPin', 9)
ON CONFLICT (name) DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_custom_map_pins_active ON custom_map_pins(is_active);
CREATE INDEX IF NOT EXISTS idx_custom_map_pins_category ON custom_map_pins(category);
CREATE INDEX IF NOT EXISTS idx_custom_map_pins_location ON custom_map_pins(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_custom_map_pins_featured ON custom_map_pins(is_featured);
CREATE INDEX IF NOT EXISTS idx_custom_map_pins_priority ON custom_map_pins(priority DESC);

-- RLS policies for custom_map_pins
ALTER TABLE custom_map_pins ENABLE ROW LEVEL SECURITY;

-- Public can read active pins
CREATE POLICY "Anyone can view active custom map pins" ON custom_map_pins
    FOR SELECT USING (is_active = true);

-- Only authenticated users can manage pins
CREATE POLICY "Authenticated users can manage custom map pins" ON custom_map_pins
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS policies for pin_categories
ALTER TABLE pin_categories ENABLE ROW LEVEL SECURITY;

-- Public can read active categories
CREATE POLICY "Anyone can view active pin categories" ON pin_categories
    FOR SELECT USING (is_active = true);

-- Only authenticated users can manage categories
CREATE POLICY "Authenticated users can manage pin categories" ON pin_categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Update trigger for custom_map_pins
CREATE OR REPLACE FUNCTION update_custom_map_pins_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_custom_map_pins_updated_at
    BEFORE UPDATE ON custom_map_pins
    FOR EACH ROW
    EXECUTE FUNCTION update_custom_map_pins_updated_at();

-- Sample data
INSERT INTO custom_map_pins (name, description, category, icon_name, latitude, longitude, address, tags, show_on_property_maps, show_on_guide_maps) VALUES
    ('Central Square of Trikala', 'Historic city center with cafes and shops', 'attractions', 'Landmark', 39.55510279080275, 21.767754077911377, 'Central Square, Trikala 42100', ARRAY['historic', 'shopping', 'central'], true, true),
    ('Trikala Castle', 'Byzantine fortress overlooking the city', 'attractions', 'Castle', 39.559102790802754, 21.76659850814025, 'Castle Hill, Trikala', ARRAY['historic', 'byzantine', 'viewpoint'], true, true),
    ('Mill of Elves', 'Traditional watermill and cultural center', 'attractions', 'Building', 39.55424947509666, 21.76398527463002, 'Mill of Elves, Trikala', ARRAY['cultural', 'traditional', 'museum'], true, true),
    ('Lithaios River Bridge', 'Scenic bridge over Lithaios River', 'nature', 'MapPin', 39.55724947509666, 21.764829445238736, 'Lithaios Bridge, Trikala', ARRAY['scenic', 'river', 'walking'], true, true),
    ('Local Market', 'Traditional Greek market', 'shopping', 'ShoppingBag', 39.55624947509666, 21.76701451813425, 'Central Market, Trikala', ARRAY['local', 'food', 'authentic'], true, true),
    ('Tsitsanis Museum', 'Museum dedicated to famous Greek composer', 'entertainment', 'Music', 39.55624947509666, 21.76598745813425, 'Tsitsanis Museum, Trikala', ARRAY['music', 'culture', 'museum'], true, true)
ON CONFLICT DO NOTHING;