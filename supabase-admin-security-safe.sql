-- Habitat Lobby Admin Dashboard - Safe Security Policies
-- Run this AFTER supabase-admin-schema-safe.sql to set up proper RLS policies

-- Create admin role check function (safe version)
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user is an admin
  -- Updated with your admin email
  RETURN auth.email() IN (
    'HabitatLobby@protonmail.com',
    'admin@habitatlobby.com',
    'info@habitatlobby.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can access admin features
CREATE OR REPLACE FUNCTION can_access_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Must be authenticated and be an admin
  RETURN auth.role() = 'authenticated' AND is_admin_user();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies if they exist and create new ones

-- Guests table policies
DROP POLICY IF EXISTS "Admin access to guests" ON guests;
CREATE POLICY "Admin access to guests" ON guests
    FOR ALL USING (can_access_admin());

-- Payments table policies
DROP POLICY IF EXISTS "Admin access to payments" ON payments;
CREATE POLICY "Admin access to payments" ON payments
    FOR ALL USING (can_access_admin());

-- Invoices table policies
DROP POLICY IF EXISTS "Admin access to invoices" ON invoices;
CREATE POLICY "Admin access to invoices" ON invoices
    FOR ALL USING (can_access_admin());

-- Email templates table policies
DROP POLICY IF EXISTS "Admin access to email_templates" ON email_templates;
CREATE POLICY "Admin access to email_templates" ON email_templates
    FOR ALL USING (can_access_admin());

-- Email logs table policies
DROP POLICY IF EXISTS "Admin access to email_logs" ON email_logs;
CREATE POLICY "Admin access to email_logs" ON email_logs
    FOR ALL USING (can_access_admin());

-- Email automations table policies
DROP POLICY IF EXISTS "Admin access to email_automations" ON email_automations;
CREATE POLICY "Admin access to email_automations" ON email_automations
    FOR ALL USING (can_access_admin());

-- ID documents table policies
DROP POLICY IF EXISTS "Admin access to id_documents" ON id_documents;
CREATE POLICY "Admin access to id_documents" ON id_documents
    FOR ALL USING (can_access_admin());

-- Calendar syncs table policies
DROP POLICY IF EXISTS "Admin access to calendar_syncs" ON calendar_syncs;
CREATE POLICY "Admin access to calendar_syncs" ON calendar_syncs
    FOR ALL USING (can_access_admin());

-- Sync logs table policies
DROP POLICY IF EXISTS "Admin access to sync_logs" ON sync_logs;
CREATE POLICY "Admin access to sync_logs" ON sync_logs
    FOR ALL USING (can_access_admin());

-- System settings table policies
DROP POLICY IF EXISTS "Admin access to system_settings" ON system_settings;
CREATE POLICY "Admin access to system_settings" ON system_settings
    FOR ALL USING (can_access_admin());

-- Audit logs table policies
DROP POLICY IF EXISTS "Admin access to audit_logs" ON audit_logs;
CREATE POLICY "Admin access to audit_logs" ON audit_logs
    FOR ALL USING (can_access_admin());

-- Update existing table policies to use admin check (if tables exist)

-- Properties table - admin can manage, guests can read
DO $$ BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'properties') THEN
        DROP POLICY IF EXISTS "Properties are viewable by everyone" ON properties;
        DROP POLICY IF EXISTS "Admin can manage properties" ON properties;

        CREATE POLICY "Properties are viewable by everyone" ON properties
            FOR SELECT USING (active = true);

        CREATE POLICY "Admin can manage properties" ON properties
            FOR ALL USING (can_access_admin());
    END IF;
END $$;

-- Bookings table - admin can manage all, guests can manage their own
DO $$ BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bookings') THEN
        DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
        DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
        DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
        DROP POLICY IF EXISTS "Admin can manage all bookings" ON bookings;

        CREATE POLICY "Users can view their own bookings" ON bookings
            FOR SELECT USING (
                customer_email = auth.email() OR can_access_admin()
            );

        CREATE POLICY "Users can create bookings" ON bookings
            FOR INSERT WITH CHECK (
                customer_email = auth.email() OR can_access_admin()
            );

        CREATE POLICY "Users can update their own bookings" ON bookings
            FOR UPDATE USING (
                customer_email = auth.email() OR can_access_admin()
            );

        CREATE POLICY "Admin can manage all bookings" ON bookings
            FOR ALL USING (can_access_admin());
    END IF;
END $$;

-- Booking line items - follow booking permissions
DO $$ BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'booking_line_items') THEN
        DROP POLICY IF EXISTS "Users can view their booking line items" ON booking_line_items;
        DROP POLICY IF EXISTS "Admin can manage all booking line items" ON booking_line_items;

        CREATE POLICY "Users can view their booking line items" ON booking_line_items
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM bookings 
                    WHERE bookings.id = booking_line_items.booking_id 
                    AND (bookings.customer_email = auth.email() OR can_access_admin())
                )
            );

        CREATE POLICY "Admin can manage all booking line items" ON booking_line_items
            FOR ALL USING (can_access_admin());
    END IF;
END $$;

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Only log if user is authenticated
    IF auth.role() = 'authenticated' THEN
        INSERT INTO audit_logs (
            user_id,
            action,
            resource_type,
            resource_id,
            old_values,
            new_values,
            ip_address,
            metadata
        ) VALUES (
            auth.uid(),
            TG_OP,
            TG_TABLE_NAME,
            COALESCE(NEW.id::text, OLD.id::text),
            CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
            CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
            inet_client_addr(),
            jsonb_build_object(
                'table', TG_TABLE_NAME,
                'operation', TG_OP,
                'timestamp', NOW()
            )
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to important tables (safe version)
DO $$ BEGIN
    -- Drop existing triggers if they exist
    DROP TRIGGER IF EXISTS audit_bookings_trigger ON bookings;
    DROP TRIGGER IF EXISTS audit_payments_trigger ON payments;
    DROP TRIGGER IF EXISTS audit_properties_trigger ON properties;
    DROP TRIGGER IF EXISTS audit_system_settings_trigger ON system_settings;

    -- Create triggers only if tables exist
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bookings') THEN
        CREATE TRIGGER audit_bookings_trigger
            AFTER INSERT OR UPDATE OR DELETE ON bookings
            FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payments') THEN
        CREATE TRIGGER audit_payments_trigger
            AFTER INSERT OR UPDATE OR DELETE ON payments
            FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'properties') THEN
        CREATE TRIGGER audit_properties_trigger
            AFTER INSERT OR UPDATE OR DELETE ON properties
            FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'system_settings') THEN
        CREATE TRIGGER audit_system_settings_trigger
            AFTER INSERT OR UPDATE OR DELETE ON system_settings
            FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    END IF;
END $$;

-- Create function to clean up old audit logs (run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
    -- Delete audit logs older than 1 year
    DELETE FROM audit_logs 
    WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean up expired documents
CREATE OR REPLACE FUNCTION cleanup_expired_documents()
RETURNS void AS $$
BEGIN
    -- Delete documents that have passed their auto-delete date
    DELETE FROM id_documents 
    WHERE auto_delete_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create indexes for performance on commonly queried columns (safe version)
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create partial indexes for active records (safe version)
DO $$ BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'properties') THEN
        CREATE INDEX IF NOT EXISTS idx_properties_active ON properties(id) WHERE active = true;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bookings') THEN
        CREATE INDEX IF NOT EXISTS idx_bookings_active ON bookings(id) WHERE status != 'cancelled';
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_calendar_syncs_active ON calendar_syncs(id) WHERE is_active = true;
