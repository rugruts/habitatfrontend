-- Habitat Lobby Admin Dashboard - Extended Database Schema
-- Run this AFTER the main supabase-schema.sql to add admin dashboard tables

-- Create additional custom types
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded');
CREATE TYPE payment_method AS ENUM ('card', 'bank_transfer', 'cash');
CREATE TYPE document_type AS ENUM ('passport', 'id_card', 'driving_license');
CREATE TYPE document_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
CREATE TYPE email_status AS ENUM ('draft', 'scheduled', 'sent', 'failed', 'cancelled');
CREATE TYPE sync_type AS ENUM ('import', 'export', 'bidirectional');
CREATE TYPE platform_type AS ENUM ('airbnb', 'booking_com', 'vrbo', 'expedia', 'custom');

-- Guests table (CRM functionality)
CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    nationality TEXT,
    address JSONB,
    emergency_contact JSONB,
    dietary_restrictions TEXT[],
    preferences JSONB,
    notes TEXT,
    total_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    last_stay_date DATE,
    vip_status BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    id_verified BOOLEAN DEFAULT false,
    blacklisted BOOLEAN DEFAULT false,
    blacklist_reason TEXT
);

-- Payments table (detailed payment tracking)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_charge_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status payment_status DEFAULT 'pending',
    payment_method payment_method DEFAULT 'card',
    payment_method_details JSONB,
    description TEXT,
    receipt_url TEXT,
    refunded_amount DECIMAL(10,2) DEFAULT 0,
    refund_reason TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    metadata JSONB
);

-- Invoices table (invoice generation and tracking)
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    elorus_invoice_id TEXT,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'draft',
    pdf_url TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Email templates table
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    template_type TEXT NOT NULL, -- 'booking_confirmation', 'pre_arrival', 'id_reminder', 'post_stay', 'custom'
    variables TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    language TEXT DEFAULT 'en',
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- Email logs table (track sent emails)
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status email_status DEFAULT 'scheduled',
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    postmark_message_id TEXT,
    metadata JSONB
);

-- Email automations table
CREATE TABLE email_automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    template_id UUID REFERENCES email_templates(id) ON DELETE CASCADE,
    trigger_type TEXT NOT NULL, -- 'booking_created', 'check_in_approaching', 'id_missing', 'check_out_completed'
    trigger_delay_hours INTEGER DEFAULT 0,
    conditions JSONB,
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    total_triggered INTEGER DEFAULT 0
);

-- ID documents table (secure document storage)
CREATE TABLE id_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
    document_type document_type NOT NULL,
    document_front_url TEXT NOT NULL,
    document_back_url TEXT,
    status document_status DEFAULT 'pending',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by TEXT,
    rejection_reason TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    auto_delete_at TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB
);

-- Calendar syncs table (OTA integration)
CREATE TABLE calendar_syncs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    platform platform_type NOT NULL,
    sync_type sync_type NOT NULL,
    ical_url TEXT,
    export_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sync_frequency_hours INTEGER DEFAULT 6,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    last_error TEXT,
    total_bookings_synced INTEGER DEFAULT 0,
    settings JSONB
);

-- Sync logs table (track sync operations)
CREATE TABLE sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    calendar_sync_id UUID REFERENCES calendar_syncs(id) ON DELETE CASCADE,
    sync_type sync_type NOT NULL,
    status TEXT NOT NULL, -- 'success', 'failed', 'partial'
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    bookings_processed INTEGER DEFAULT 0,
    bookings_added INTEGER DEFAULT 0,
    bookings_updated INTEGER DEFAULT 0,
    bookings_removed INTEGER DEFAULT 0,
    error_message TEXT,
    details JSONB
);

-- System settings table (application configuration)
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    category TEXT NOT NULL, -- 'business', 'payment', 'email', 'security', 'automation'
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT false,
    UNIQUE(category, key)
);

-- Audit logs table (track admin actions)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB
);

-- Create indexes for performance
CREATE INDEX idx_guests_email ON guests(email);
CREATE INDEX idx_guests_last_stay ON guests(last_stay_date);
CREATE INDEX idx_guests_total_bookings ON guests(total_bookings);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_stripe_payment_intent ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_invoices_booking_id ON invoices(booking_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX idx_id_documents_booking_id ON id_documents(booking_id);
CREATE INDEX idx_id_documents_status ON id_documents(status);
CREATE INDEX idx_id_documents_expires_at ON id_documents(expires_at);
CREATE INDEX idx_calendar_syncs_property_id ON calendar_syncs(property_id);
CREATE INDEX idx_calendar_syncs_active ON calendar_syncs(is_active);
CREATE INDEX idx_sync_logs_calendar_sync_id ON sync_logs(calendar_sync_id);
CREATE INDEX idx_sync_logs_started_at ON sync_logs(started_at);
CREATE INDEX idx_system_settings_category_key ON system_settings(category, key);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON guests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_automations_updated_at BEFORE UPDATE ON email_automations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_id_documents_updated_at BEFORE UPDATE ON id_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_syncs_updated_at BEFORE UPDATE ON calendar_syncs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on new tables
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE id_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_syncs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin-only access for most tables)
CREATE POLICY "Admin access to guests" ON guests
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin access to payments" ON payments
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin access to invoices" ON invoices
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin access to email_templates" ON email_templates
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin access to email_logs" ON email_logs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin access to email_automations" ON email_automations
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin access to id_documents" ON id_documents
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin access to calendar_syncs" ON calendar_syncs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin access to sync_logs" ON sync_logs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin access to system_settings" ON system_settings
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin access to audit_logs" ON audit_logs
    FOR ALL USING (auth.role() = 'authenticated');
