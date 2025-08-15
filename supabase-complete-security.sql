-- Habitat Lobby - Complete Security Policies
-- Run this AFTER supabase-complete-schema.sql and supabase-sample-data.sql

-- Create admin role check function
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.email() IN (
    'HabitatLobby@protonmail.com',
    'info@habitatlobby.com',
    'admin@habitatlobby.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can access admin features
CREATE OR REPLACE FUNCTION can_access_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.role() = 'authenticated' AND is_admin_user();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Properties policies
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON properties;
DROP POLICY IF EXISTS "Admin can manage properties" ON properties;

CREATE POLICY "Properties are viewable by everyone" ON properties
    FOR SELECT USING (active = true);

CREATE POLICY "Admin can manage properties" ON properties
    FOR ALL USING (can_access_admin());

-- Bookings policies
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

-- Booking line items policies
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

-- Admin-only table policies
CREATE POLICY "Admin access to guests" ON guests FOR ALL USING (can_access_admin());
CREATE POLICY "Admin access to payments" ON payments FOR ALL USING (can_access_admin());
CREATE POLICY "Admin access to invoices" ON invoices FOR ALL USING (can_access_admin());
CREATE POLICY "Admin access to email_templates" ON email_templates FOR ALL USING (can_access_admin());
CREATE POLICY "Admin access to email_logs" ON email_logs FOR ALL USING (can_access_admin());
CREATE POLICY "Admin access to email_automations" ON email_automations FOR ALL USING (can_access_admin());
CREATE POLICY "Admin access to id_documents" ON id_documents FOR ALL USING (can_access_admin());
CREATE POLICY "Admin access to calendar_syncs" ON calendar_syncs FOR ALL USING (can_access_admin());
CREATE POLICY "Admin access to sync_logs" ON sync_logs FOR ALL USING (can_access_admin());
CREATE POLICY "Admin access to system_settings" ON system_settings FOR ALL USING (can_access_admin());
CREATE POLICY "Admin access to audit_logs" ON audit_logs FOR ALL USING (can_access_admin());

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

-- Add audit triggers to important tables
DROP TRIGGER IF EXISTS audit_bookings_trigger ON bookings;
DROP TRIGGER IF EXISTS audit_payments_trigger ON payments;
DROP TRIGGER IF EXISTS audit_properties_trigger ON properties;
DROP TRIGGER IF EXISTS audit_system_settings_trigger ON system_settings;

CREATE TRIGGER audit_bookings_trigger
    AFTER INSERT OR UPDATE OR DELETE ON bookings
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_payments_trigger
    AFTER INSERT OR UPDATE OR DELETE ON payments
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_properties_trigger
    AFTER INSERT OR UPDATE OR DELETE ON properties
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_system_settings_trigger
    AFTER INSERT OR UPDATE OR DELETE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
