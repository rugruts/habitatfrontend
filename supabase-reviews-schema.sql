-- Reviews System Database Schema
-- Run this in your Supabase SQL Editor to add review functionality

-- Create custom types for reviews
DO $$ BEGIN
    CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected', 'hidden');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE review_source AS ENUM ('direct', 'email_link', 'admin_created');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Booking relationship
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    
    -- Guest information
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_avatar_url TEXT,
    
    -- Review content
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
    
    -- Review text
    title VARCHAR(255),
    review_text TEXT NOT NULL,
    pros TEXT,
    cons TEXT,
    
    -- Additional details
    stay_date DATE NOT NULL,
    nights_stayed INTEGER NOT NULL,
    guest_count INTEGER NOT NULL,
    trip_type VARCHAR(50), -- business, leisure, family, couple, solo
    
    -- Review metadata
    status review_status DEFAULT 'pending',
    source review_source DEFAULT 'direct',
    language VARCHAR(10) DEFAULT 'en',
    
    -- Moderation
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    admin_notes TEXT,
    moderated_by UUID,
    moderated_at TIMESTAMP WITH TIME ZONE,
    
    -- Engagement
    helpful_count INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0,
    
    -- Review photos
    photos TEXT[] DEFAULT '{}',
    
    -- Response tracking
    has_response BOOLEAN DEFAULT false,
    
    -- Analytics
    ip_address INET,
    user_agent TEXT,
    
    CONSTRAINT valid_overall_rating CHECK (overall_rating BETWEEN 1 AND 5),
    CONSTRAINT valid_nights_stayed CHECK (nights_stayed > 0),
    CONSTRAINT valid_guest_count CHECK (guest_count > 0)
);

-- Create review responses table (for host/admin responses)
CREATE TABLE IF NOT EXISTS review_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
    
    -- Response content
    response_text TEXT NOT NULL,
    
    -- Response metadata
    responder_name VARCHAR(255) NOT NULL,
    responder_email VARCHAR(255),
    responder_role VARCHAR(50) DEFAULT 'host', -- host, admin, manager
    
    -- Moderation
    is_public BOOLEAN DEFAULT true,
    admin_notes TEXT,
    
    CONSTRAINT non_empty_response CHECK (LENGTH(TRIM(response_text)) > 0)
);

-- Create review analytics table
CREATE TABLE IF NOT EXISTS review_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    
    -- Date period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    period_type VARCHAR(20) NOT NULL, -- daily, weekly, monthly, yearly
    
    -- Review metrics
    total_reviews INTEGER DEFAULT 0,
    approved_reviews INTEGER DEFAULT 0,
    pending_reviews INTEGER DEFAULT 0,
    
    -- Rating averages
    avg_overall_rating DECIMAL(3,2),
    avg_cleanliness_rating DECIMAL(3,2),
    avg_communication_rating DECIMAL(3,2),
    avg_location_rating DECIMAL(3,2),
    avg_value_rating DECIMAL(3,2),
    avg_accuracy_rating DECIMAL(3,2),
    
    -- Response metrics
    response_rate DECIMAL(5,2), -- percentage
    avg_response_time_hours INTEGER,
    
    -- Engagement metrics
    total_helpful_votes INTEGER DEFAULT 0,
    total_reports INTEGER DEFAULT 0,
    
    UNIQUE(property_id, period_start, period_end, period_type)
);

-- Create review invitations table (for tracking review requests)
CREATE TABLE IF NOT EXISTS review_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    guest_email VARCHAR(255) NOT NULL,
    
    -- Invitation details
    invitation_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Tracking
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_sent BOOLEAN DEFAULT false,
    is_opened BOOLEAN DEFAULT false,
    is_clicked BOOLEAN DEFAULT false,
    is_completed BOOLEAN DEFAULT false,
    
    -- Email details
    email_subject VARCHAR(255),
    email_template_id UUID,
    
    CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_property_id ON reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_overall_rating ON reviews(overall_rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_guest_email ON reviews(guest_email);
CREATE INDEX IF NOT EXISTS idx_reviews_is_featured ON reviews(is_featured);

CREATE INDEX IF NOT EXISTS idx_review_responses_review_id ON review_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_review_responses_created_at ON review_responses(created_at);

CREATE INDEX IF NOT EXISTS idx_review_analytics_property_id ON review_analytics(property_id);
CREATE INDEX IF NOT EXISTS idx_review_analytics_period ON review_analytics(period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_review_invitations_booking_id ON review_invitations(booking_id);
CREATE INDEX IF NOT EXISTS idx_review_invitations_token ON review_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_review_invitations_guest_email ON review_invitations(guest_email);
CREATE INDEX IF NOT EXISTS idx_review_invitations_expires_at ON review_invitations(expires_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_responses_updated_at BEFORE UPDATE ON review_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_invitations_updated_at BEFORE UPDATE ON review_invitations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update review response flag
CREATE OR REPLACE FUNCTION update_review_has_response()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE reviews SET has_response = true WHERE id = NEW.review_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE reviews SET has_response = EXISTS(
            SELECT 1 FROM review_responses WHERE review_id = OLD.review_id
        ) WHERE id = OLD.review_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_review_has_response
    AFTER INSERT OR DELETE ON review_responses
    FOR EACH ROW EXECUTE FUNCTION update_review_has_response();

-- Create RLS policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_invitations ENABLE ROW LEVEL SECURITY;

-- Public can read approved reviews
CREATE POLICY "Public can read approved reviews" ON reviews
    FOR SELECT USING (status = 'approved');

-- Guests can read their own reviews
CREATE POLICY "Guests can read their own reviews" ON reviews
    FOR SELECT USING (guest_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Guests can create reviews for their bookings
CREATE POLICY "Guests can create reviews for their bookings" ON reviews
    FOR INSERT WITH CHECK (
        guest_email = current_setting('request.jwt.claims', true)::json->>'email'
        AND EXISTS (
            SELECT 1 FROM bookings 
            WHERE id = booking_id 
            AND customer_email = guest_email
            AND status IN ('checked_out', 'completed')
        )
    );

-- Public can read public review responses
CREATE POLICY "Public can read public review responses" ON review_responses
    FOR SELECT USING (is_public = true);

-- Public can read review analytics
CREATE POLICY "Public can read review analytics" ON review_analytics
    FOR SELECT USING (true);

-- Guests can access their review invitations
CREATE POLICY "Guests can access their review invitations" ON review_invitations
    FOR SELECT USING (guest_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Add review-related columns to bookings table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'review_invitation_sent') THEN
        ALTER TABLE bookings ADD COLUMN review_invitation_sent BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'review_invitation_sent_at') THEN
        ALTER TABLE bookings ADD COLUMN review_invitation_sent_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'has_review') THEN
        ALTER TABLE bookings ADD COLUMN has_review BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Create function to update booking review status
CREATE OR REPLACE FUNCTION update_booking_review_status()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE bookings SET has_review = true WHERE id = NEW.booking_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE bookings SET has_review = EXISTS(
            SELECT 1 FROM reviews WHERE booking_id = OLD.booking_id
        ) WHERE id = OLD.booking_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_booking_review_status
    AFTER INSERT OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_booking_review_status();
