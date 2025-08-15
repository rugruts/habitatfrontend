-- Habitat Lobby - Sample Data for Production Testing
-- Run this AFTER supabase-complete-schema.sql

-- Insert sample properties
INSERT INTO properties (id, name, description, address, city, country, property_type, bedrooms, bathrooms, max_guests, base_price, amenities, images) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'River Loft Apartment', 'Modern loft apartment with river views in the heart of Volos', 'Dimitriados 15, Volos', 'Volos', 'Greece', 'apartment', 2, 1, 4, 8500, ARRAY['wifi', 'kitchen', 'air_conditioning', 'balcony'], ARRAY['https://example.com/image1.jpg']),
('550e8400-e29b-41d4-a716-446655440002', 'Garden Suite', 'Cozy garden suite with private terrace', 'Iasonos 23, Volos', 'Volos', 'Greece', 'suite', 1, 1, 2, 6500, ARRAY['wifi', 'kitchen', 'garden', 'parking'], ARRAY['https://example.com/image2.jpg']),
('550e8400-e29b-41d4-a716-446655440003', 'Seaside Studio', 'Beautiful studio apartment near the beach', 'Argonauton 45, Volos', 'Volos', 'Greece', 'studio', 1, 1, 2, 5500, ARRAY['wifi', 'air_conditioning', 'beach_access'], ARRAY['https://example.com/image3.jpg']);

-- Insert sample bookings
INSERT INTO bookings (id, property_id, customer_name, customer_email, customer_phone, check_in, check_out, guests, subtotal, taxes, fees, total_amount, status, booking_source) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Maria Papadopoulos', 'maria.p@email.com', '+30 694 123 4567', '2024-08-15', '2024-08-18', 2, 25500, 3060, 500, 29060, 'confirmed', 'direct'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'John Smith', 'john.smith@email.com', '+44 7700 900123', '2024-08-20', '2024-08-25', 2, 32500, 3900, 500, 36900, 'confirmed', 'airbnb'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Sophie Dubois', 'sophie.dubois@email.com', '+33 6 12 34 56 78', '2024-08-25', '2024-08-28', 1, 16500, 1980, 500, 18980, 'pending', 'booking_com'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Andreas Mueller', 'andreas.m@email.com', '+49 151 12345678', '2024-09-01', '2024-09-05', 3, 34000, 4080, 500, 38580, 'checked_in', 'direct'),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Emma Johnson', 'emma.j@email.com', '+1 555 123 4567', '2024-09-10', '2024-09-15', 2, 32500, 3900, 500, 36900, 'checked_out', 'vrbo');

-- Insert booking line items
INSERT INTO booking_line_items (booking_id, description, quantity, unit_price, total_price, item_type) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Accommodation (3 nights)', 3, 8500, 25500, 'accommodation'),
('660e8400-e29b-41d4-a716-446655440001', 'City Tax', 3, 150, 450, 'tax'),
('660e8400-e29b-41d4-a716-446655440001', 'Cleaning Fee', 1, 500, 500, 'fee'),
('660e8400-e29b-41d4-a716-446655440002', 'Accommodation (5 nights)', 5, 6500, 32500, 'accommodation'),
('660e8400-e29b-41d4-a716-446655440002', 'City Tax', 5, 150, 750, 'tax'),
('660e8400-e29b-41d4-a716-446655440002', 'Cleaning Fee', 1, 500, 500, 'fee');

-- Insert sample guests
INSERT INTO guests (id, name, email, phone, country, nationality, total_bookings, total_spent, is_vip) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Maria Papadopoulos', 'maria.p@email.com', '+30 694 123 4567', 'Greece', 'Greek', 1, 29060, false),
('770e8400-e29b-41d4-a716-446655440002', 'John Smith', 'john.smith@email.com', '+44 7700 900123', 'United Kingdom', 'British', 1, 36900, false),
('770e8400-e29b-41d4-a716-446655440003', 'Sophie Dubois', 'sophie.dubois@email.com', '+33 6 12 34 56 78', 'France', 'French', 1, 18980, false),
('770e8400-e29b-41d4-a716-446655440004', 'Andreas Mueller', 'andreas.m@email.com', '+49 151 12345678', 'Germany', 'German', 1, 38580, true),
('770e8400-e29b-41d4-a716-446655440005', 'Emma Johnson', 'emma.j@email.com', '+1 555 123 4567', 'United States', 'American', 1, 36900, false);

-- Insert sample payments
INSERT INTO payments (id, booking_id, stripe_payment_intent_id, amount, status, payment_method, processed_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'pi_1234567890', 29060, 'succeeded', 'card', NOW() - INTERVAL '2 days'),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'pi_1234567891', 36900, 'succeeded', 'card', NOW() - INTERVAL '1 day'),
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'pi_1234567892', 18980, 'pending', 'card', NULL),
('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'pi_1234567893', 38580, 'succeeded', 'card', NOW() - INTERVAL '5 hours'),
('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 'pi_1234567894', 36900, 'succeeded', 'card', NOW() - INTERVAL '3 days');

-- Insert sample invoices
INSERT INTO invoices (id, booking_id, invoice_number, guest_name, guest_email, amount, status, due_date) VALUES
('990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'INV-2024-001', 'Maria Papadopoulos', 'maria.p@email.com', 29060, 'paid', '2024-08-15'),
('990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'INV-2024-002', 'John Smith', 'john.smith@email.com', 36900, 'paid', '2024-08-20'),
('990e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'INV-2024-003', 'Sophie Dubois', 'sophie.dubois@email.com', 18980, 'sent', '2024-08-25'),
('990e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'INV-2024-004', 'Andreas Mueller', 'andreas.m@email.com', 38580, 'paid', '2024-09-01'),
('990e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 'INV-2024-005', 'Emma Johnson', 'emma.j@email.com', 36900, 'paid', '2024-09-10');

-- Insert email templates
INSERT INTO email_templates (id, name, subject, content, template_type, variables, is_active) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'Booking Confirmation', 'Your booking at {property_name} is confirmed!', 'Dear {guest_name},\n\nYour booking has been confirmed!\n\nProperty: {property_name}\nCheck-in: {check_in_date}\nCheck-out: {check_out_date}\nGuests: {guests_count}\n\nTotal Amount: {total_amount}\n\nThank you for choosing Habitat Lobby!', 'booking_confirmation', ARRAY['guest_name', 'property_name', 'check_in_date', 'check_out_date', 'guests_count', 'total_amount'], true),
('aa0e8400-e29b-41d4-a716-446655440002', 'Pre-Arrival Instructions', 'Your stay at {property_name} starts tomorrow!', 'Dear {guest_name},\n\nWe are excited to welcome you tomorrow!\n\nCheck-in time: 15:00\nProperty address: {property_address}\n\nFor any questions, please contact us at +30 243 123 4567.\n\nSee you soon!', 'pre_arrival', ARRAY['guest_name', 'property_name', 'property_address'], true),
('aa0e8400-e29b-41d4-a716-446655440003', 'ID Verification Reminder', 'ID Verification Required for {property_name}', 'Dear {guest_name},\n\nWe need to verify your identity before your stay.\n\nPlease upload a photo of your ID document through our secure portal.\n\nThank you for your cooperation!', 'id_reminder', ARRAY['guest_name', 'property_name'], true),
('aa0e8400-e29b-41d4-a716-446655440004', 'Post-Stay Thank You', 'Thank you for staying with us!', 'Dear {guest_name},\n\nThank you for choosing {property_name} for your stay!\n\nWe hope you had a wonderful time. We would love to hear about your experience.\n\nWe look forward to welcoming you again soon!', 'post_stay', ARRAY['guest_name', 'property_name'], true);

-- Insert email automations
INSERT INTO email_automations (id, name, template_id, trigger_type, trigger_delay_hours, is_active) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'Send Booking Confirmation', 'aa0e8400-e29b-41d4-a716-446655440001', 'booking_created', 0, true),
('bb0e8400-e29b-41d4-a716-446655440002', 'Pre-Arrival Instructions', 'aa0e8400-e29b-41d4-a716-446655440002', 'check_in_approaching', 48, true),
('bb0e8400-e29b-41d4-a716-446655440003', 'ID Verification Reminder', 'aa0e8400-e29b-41d4-a716-446655440003', 'id_missing', 72, true),
('bb0e8400-e29b-41d4-a716-446655440004', 'Post-Stay Thank You', 'aa0e8400-e29b-41d4-a716-446655440004', 'check_out_completed', 24, true);

-- Insert sample email logs
INSERT INTO email_logs (id, template_id, booking_id, recipient_email, recipient_name, subject, content, status, sent_at) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'maria.p@email.com', 'Maria Papadopoulos', 'Your booking at River Loft Apartment is confirmed!', 'Dear Maria,\n\nYour booking has been confirmed!...', 'sent', NOW() - INTERVAL '2 days'),
('cc0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'john.smith@email.com', 'John Smith', 'Your stay at Garden Suite starts tomorrow!', 'Dear John,\n\nWe are excited to welcome you tomorrow!...', 'sent', NOW() - INTERVAL '1 day'),
('cc0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'sophie.dubois@email.com', 'Sophie Dubois', 'ID Verification Required for Seaside Studio', 'Dear Sophie,\n\nWe need to verify your identity...', 'failed', NULL);

-- Insert sample ID documents
INSERT INTO id_documents (id, booking_id, guest_name, document_type, document_number, status, verified_at) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Maria Papadopoulos', 'passport', 'AE1234567', 'verified', NOW() - INTERVAL '2 days'),
('dd0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'John Smith', 'passport', 'GB9876543', 'verified', NOW() - INTERVAL '1 day'),
('dd0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'Sophie Dubois', 'id_card', 'FR5555555', 'pending', NULL),
('dd0e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'Andreas Mueller', 'passport', 'DE1111111', 'verified', NOW() - INTERVAL '5 hours');

-- Insert calendar syncs
INSERT INTO calendar_syncs (id, property_id, platform, calendar_url, sync_direction, last_sync_at, next_sync_at, status) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'airbnb', 'https://calendar.airbnb.com/calendar/ical/12345.ics', 'import', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '22 hours', 'active'),
('ee0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'booking_com', 'https://admin.booking.com/hotel/hoteladmin/ical.html?t=abcd1234', 'bidirectional', NOW() - INTERVAL '1 hour', NOW() + INTERVAL '23 hours', 'active'),
('ee0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'vrbo', 'https://www.vrbo.com/calendar/ical/property/5678.ics', 'import', NOW() - INTERVAL '3 hours', NOW() + INTERVAL '21 hours', 'error');

-- Insert system settings
INSERT INTO system_settings (category, key, value, description) VALUES
('email', 'postmark_api_key', '', 'Postmark API key for sending emails'),
('payment', 'stripe_publishable_key', '', 'Stripe publishable key'),
('payment', 'stripe_secret_key', '', 'Stripe secret key'),
('booking', 'default_check_in_time', '15:00', 'Default check-in time'),
('booking', 'default_check_out_time', '11:00', 'Default check-out time'),
('booking', 'city_tax_rate', '1.50', 'City tax per night per person in EUR'),
('general', 'company_name', 'Habitat Lobby', 'Company name'),
('general', 'company_email', 'info@habitatlobby.com', 'Company contact email'),
('general', 'company_phone', '+30 243 123 4567', 'Company contact phone');
