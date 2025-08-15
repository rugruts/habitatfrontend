-- Habitat Lobby Admin Dashboard - Simple Schema Creation
-- This script creates tables with basic VARCHAR types to avoid enum issues

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    date_of_birth DATE,
    nationality VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'en',
    total_bookings INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0, -- in cents
    average_rating DECIMAL(3,2),
    notes TEXT,
    tags TEXT[],
    is_vip BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID,
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    amount INTEGER NOT NULL, -- in cents
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(50) DEFAULT 'pending', -- pending, succeeded, failed, cancelled, refunded
    payment_method VARCHAR(50) DEFAULT 'card', -- card, bank_transfer, cash
    payment_method_details JSONB,
    processed_at TIMESTAMP WITH TIME ZONE,
    refunded_amount INTEGER DEFAULT 0,
    refund_reason TEXT,
    receipt_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_address TEXT,
    amount INTEGER NOT NULL, -- in cents
    tax_amount INTEGER DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(50) DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
    due_date DATE,
    paid_at TIMESTAMP WITH TIME ZONE,
    pdf_url TEXT,
    elorus_invoice_id VARCHAR(255),
    line_items JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    template_type VARCHAR(100) NOT NULL, -- booking_confirmation, pre_arrival, etc.
    variables TEXT[] DEFAULT '{}', -- Available template variables
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID,
    booking_id UUID,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, sent, failed, bounced
    sent_at TIMESTAMP WITH TIME ZONE,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_automations table
CREATE TABLE IF NOT EXISTS email_automations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    template_id UUID,
    trigger_type VARCHAR(100) NOT NULL, -- booking_created, check_in_approaching, etc.
    trigger_delay_hours INTEGER DEFAULT 0,
    conditions JSONB DEFAULT '{}', -- Additional conditions for triggering
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create id_documents table (safe version)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'id_documents') THEN
        CREATE TABLE id_documents (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            booking_id UUID,
            guest_name VARCHAR(255) NOT NULL,
            document_type VARCHAR(100) NOT NULL, -- passport, id_card, driving_license
            document_number VARCHAR(255),
            document_front_url TEXT,
            document_back_url TEXT,
            verification_status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected
            verified_at TIMESTAMP WITH TIME ZONE,
            verified_by UUID, -- admin user id
            rejection_reason TEXT,
            auto_delete_at TIMESTAMP WITH TIME ZONE, -- For GDPR compliance
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Create calendar_syncs table
CREATE TABLE IF NOT EXISTS calendar_syncs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID,
    platform VARCHAR(100) NOT NULL, -- airbnb, booking_com, vrbo, etc.
    calendar_url TEXT NOT NULL,
    sync_direction VARCHAR(20) DEFAULT 'import', -- import, export, bidirectional
    last_sync_at TIMESTAMP WITH TIME ZONE,
    next_sync_at TIMESTAMP WITH TIME ZONE,
    sync_frequency_hours INTEGER DEFAULT 24,
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, error
    error_message TEXT,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sync_logs table
CREATE TABLE IF NOT EXISTS sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_sync_id UUID,
    sync_type VARCHAR(50) NOT NULL, -- import, export
    status VARCHAR(50) NOT NULL, -- success, error, partial
    bookings_processed INTEGER DEFAULT 0,
    bookings_created INTEGER DEFAULT 0,
    bookings_updated INTEGER DEFAULT 0,
    error_details JSONB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL, -- email, payment, booking, etc.
    key VARCHAR(255) NOT NULL,
    value TEXT,
    data_type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    is_sensitive BOOLEAN DEFAULT false, -- For API keys, passwords, etc.
    updated_by UUID, -- admin user id
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category, key)
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- admin user id
    action VARCHAR(100) NOT NULL, -- CREATE, UPDATE, DELETE, etc.
    resource_type VARCHAR(100) NOT NULL, -- booking, payment, property, etc.
    resource_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_created_at ON guests(created_at);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

CREATE INDEX IF NOT EXISTS idx_invoices_booking_id ON invoices(booking_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

CREATE INDEX IF NOT EXISTS idx_email_logs_booking_id ON email_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_scheduled_for ON email_logs(scheduled_for);

CREATE INDEX IF NOT EXISTS idx_id_documents_booking_id ON id_documents(booking_id);
CREATE INDEX IF NOT EXISTS idx_id_documents_verification_status ON id_documents(verification_status);

CREATE INDEX IF NOT EXISTS idx_calendar_syncs_property_id ON calendar_syncs(property_id);
CREATE INDEX IF NOT EXISTS idx_calendar_syncs_next_sync_at ON calendar_syncs(next_sync_at);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable RLS on all tables
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
