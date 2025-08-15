import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Type definitions for filters and data structures
interface BookingFilters {
  booking_id?: string;
  property_id?: string;
  status?: string;
  customer_email?: string;
  check_in_from?: string;
  check_in_to?: string;
  created_from?: string;
  created_to?: string;
}

interface GuestFilters {
  email?: string;
  name?: string;
  search?: string;
  id_verified?: boolean;
  vip_status?: boolean;
  created_from?: string;
  created_to?: string;
}

interface PaymentFilters {
  booking_id?: string;
  status?: string;
  payment_method?: string;
  amount_from?: number;
  amount_to?: number;
  created_from?: string;
  created_to?: string;
}

interface PropertyData {
  name: string;
  description: string;
  city: string;
  country: string;
  address: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  base_price: number;
  currency: string;
  amenities: string;
  images: string;
  active: boolean;
  size_sqm?: number;
  min_nights?: number;
  max_nights?: number;
  check_in_time?: string;
  check_out_time?: string;
  cleaning_fee?: number;
  security_deposit?: number;
}

interface GuestData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  total_bookings?: number;
  total_spent?: number;
  id_verified?: boolean;
  vip_status?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface InvoiceFilters {
  booking_id?: string;
  status?: string;
  invoice_number?: string;
  customer_email?: string;
  created_from?: string;
  created_to?: string;
  date_from?: string;
  date_to?: string;
  amount_from?: number;
  amount_to?: number;
}

interface EmailTemplateData {
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  template_type: string;
  active?: boolean;
  variables?: string;
  created_at?: string;
  updated_at?: string;
}

interface EmailLogFilters {
  template_id?: string;
  recipient_email?: string;
  status?: string;
  sent_from?: string;
  sent_to?: string;
  created_from?: string;
  created_to?: string;
}

interface EmailLogData {
  template_id?: string;
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  html_content: string;
  text_content?: string;
  status: string;
  sent_at?: string;
  error_message?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

interface IDDocumentFilters {
  booking_id?: string;
  guest_email?: string;
  status?: string;
  document_type?: string;
  created_from?: string;
  created_to?: string;
}

interface PaymentData {
  booking_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  stripe_payment_intent_id?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

interface CalendarSyncData {
  property_id: string;
  platform: string;
  calendar_url: string;
  sync_direction: string;
  active: boolean;
  last_sync_at?: string;
  last_error?: string;
  created_at?: string;
  updated_at?: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// For now, we'll use the regular client and handle RLS through proper policies
// In production, you would use a service role key for server-side operations
export const supabaseAdmin = supabase;

// Helper functions for common operations
export const supabaseHelpers = {
  // Check if a date range is available for a property (includes blackout dates)
  async checkAvailability(propertyId: string, checkIn: string, checkOut: string) {
    try {
      // Use the enhanced database function that checks bookings, blackout dates, and external bookings
      const { data, error } = await supabase
        .rpc('check_property_availability', {
          property_uuid: propertyId,
          check_in_date: checkIn,
          check_out_date: checkOut
        });

      if (error) {
        console.error('Database availability check failed:', error);
        // Fallback to manual checking
        return await this.checkAvailabilityFallback(propertyId, checkIn, checkOut);
      }

      return data === true;
    } catch (error) {
      console.error('Availability check error:', error);
      // Fallback to manual checking
      return await this.checkAvailabilityFallback(propertyId, checkIn, checkOut);
    }
  },

  // Fallback availability check (manual checking)
  async checkAvailabilityFallback(propertyId: string, checkIn: string, checkOut: string) {
    // Check confirmed bookings
    const { data: bookings, error: bookingError } = await supabase
      .from('bookings')
      .select('id')
      .eq('property_id', propertyId)
      .eq('status', 'confirmed')
      .or(`and(check_in.lte.${checkOut},check_out.gt.${checkIn})`);

    if (bookingError) throw bookingError;
    if (bookings && bookings.length > 0) return false;

    // Check blackout dates
    const { data: blackouts, error: blackoutError } = await supabase
      .from('blackout_dates')
      .select('id')
      .eq('property_id', propertyId)
      .eq('is_active', true)
      .or(`and(start_date.lte.${checkOut},end_date.gte.${checkIn})`);

    if (blackoutError) throw blackoutError;
    if (blackouts && blackouts.length > 0) return false;

    // Check external bookings
    const { data: externalBookings, error: externalError } = await supabase
      .from('external_bookings')
      .select('id')
      .eq('property_id', propertyId)
      .neq('status', 'cancelled')
      .or(`and(start_date.lte.${checkOut},end_date.gt.${checkIn})`);

    if (externalError) throw externalError;
    if (externalBookings && externalBookings.length > 0) return false;

    return true; // Available if no conflicts found
  },

  // Get availability calendar for a property (includes blackout dates)
  async getAvailabilityCalendar(propertyId: string, startDate: string, endDate: string) {
    // Fetch all data in parallel
    const [bookingsResult, blackoutsResult, externalBookingsResult] = await Promise.all([
      supabase
        .from('bookings')
        .select('check_in, check_out, status')
        .eq('property_id', propertyId)
        .eq('status', 'confirmed')
        .gte('check_out', startDate)
        .lte('check_in', endDate),

      supabase
        .from('blackout_dates')
        .select('start_date, end_date, reason')
        .eq('property_id', propertyId)
        .eq('is_active', true)
        .gte('end_date', startDate)
        .lte('start_date', endDate),

      supabase
        .from('external_bookings')
        .select('start_date, end_date, platform, status')
        .eq('property_id', propertyId)
        .neq('status', 'cancelled')
        .gte('end_date', startDate)
        .lte('start_date', endDate)
    ]);

    if (bookingsResult.error) throw bookingsResult.error;
    if (blackoutsResult.error) throw blackoutsResult.error;
    if (externalBookingsResult.error) throw externalBookingsResult.error;

    // Generate availability map
    const availability = new Map<string, boolean>();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Mark all dates as available initially
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      availability.set(dateStr, true);
    }

    // Mark booked dates as unavailable
    bookingsResult.data?.forEach(booking => {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);

      for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        availability.set(dateStr, false);
      }
    });

    // Mark blackout dates as unavailable
    blackoutsResult.data?.forEach(blackout => {
      const startBlackout = new Date(blackout.start_date);
      const endBlackout = new Date(blackout.end_date);

      for (let d = new Date(startBlackout); d <= endBlackout; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        availability.set(dateStr, false);
      }
    });

    // Mark external booking dates as unavailable
    externalBookingsResult.data?.forEach(booking => {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);

      for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        availability.set(dateStr, false);
      }
    });

    return availability;
  },

  // Get blackout dates for a property
  async getBlackoutDates(propertyId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('blackout_dates')
      .select('*')
      .eq('property_id', propertyId)
      .eq('is_active', true)
      .order('start_date', { ascending: true });

    if (startDate) {
      query = query.gte('end_date', startDate);
    }
    if (endDate) {
      query = query.lte('start_date', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Get external bookings for a property
  async getExternalBookings(propertyId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('external_bookings')
      .select('*')
      .eq('property_id', propertyId)
      .neq('status', 'cancelled')
      .order('start_date', { ascending: true });

    if (startDate) {
      query = query.gte('end_date', startDate);
    }
    if (endDate) {
      query = query.lte('start_date', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Create or update guest record with ID information
  async createOrUpdateGuest(guestData: {
    name: string;
    email: string;
    phone?: string;
    specialRequests?: string;
  }) {
    try {
      // Split name into first and last name
      const nameParts = guestData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Check if guest already exists
      const { data: existingGuest, error: checkError } = await supabase
        .from('guests')
        .select('*')
        .eq('email', guestData.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // Error other than "not found"
        throw checkError;
      }

      const updateData = {
        first_name: firstName,
        last_name: lastName,
        phone: guestData.phone,
        updated_at: new Date().toISOString()
      };

      if (existingGuest) {
        // Update existing guest with new information
        const { data: updatedGuest, error: updateError } = await supabase
          .from('guests')
          .update({
            ...updateData,
            total_bookings: (existingGuest.total_bookings || 0) + 1
          })
          .eq('id', existingGuest.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return updatedGuest;
      } else {
        // Create new guest
        const { data: newGuest, error: createError } = await supabase
          .from('guests')
          .insert([{
            ...updateData,
            email: guestData.email,
            total_bookings: 1,
            total_spent: 0,
            id_verified: false,
            vip_status: false,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (createError) throw createError;
        return newGuest;
      }
    } catch (error) {
      console.error('Error creating/updating guest:', error);
      throw error;
    }
  },

  // Get guest by email
  async getGuestByEmail(email: string) {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching guest by email:', error);
      return null;
    }
  },

  // Create a new booking
  async createBooking(booking: {
    property_id: string;
    check_in: string;
    check_out: string;
    guests: number;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    total_amount: number; // in euros
    currency: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    source?: string;
    notes?: string;
    payment_intent_id?: string;
    specialRequests?: string;
  }) {
    // Convert euros to cents for database storage
    const totalAmountCents = Math.round(booking.total_amount * 100);

    // First, create or update the guest record
    await this.createOrUpdateGuest({
      name: booking.customer_name,
      email: booking.customer_email,
      phone: booking.customer_phone,
      specialRequests: booking.specialRequests
    });

    const bookingData = {
      property_id: booking.property_id,
      check_in: booking.check_in,
      check_out: booking.check_out,
      guests: booking.guests,
      customer_name: booking.customer_name,
      customer_email: booking.customer_email,
      customer_phone: booking.customer_phone,
      subtotal: totalAmountCents, // Required field
      total_amount: totalAmountCents, // Store in cents
      currency: booking.currency,
      status: booking.status,
      booking_source: booking.source || 'direct', // Map source to booking_source
      special_requests: booking.notes, // Map notes to special_requests
      payment_intent_id: booking.payment_intent_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Use admin client for booking creation to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert([bookingData])
      .select(`
        *,
        properties (
          id,
          name,
          city,
          country
        )
      `)
      .single();

    if (error) {
      console.error('Booking creation error:', error);
      throw error;
    }

    // Update guest's total spent amount
    await this.updateGuestSpending(booking.customer_email, totalAmountCents);

    // Note: Payment, invoice, and ID verification records will be created later
    // when the database schema is updated with the required columns

    return data;
  },

  // Update guest spending when booking is confirmed
  async updateGuestSpending(email: string, amountCents: number) {
    try {
      const { data: guest, error: fetchError } = await supabase
        .from('guests')
        .select('total_spent')
        .eq('email', email)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('guests')
        .update({
          total_spent: (guest.total_spent || 0) + amountCents,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error updating guest spending:', error);
      // Don't throw here as this is not critical for booking creation
    }
  },

  // Create payment record for booking
  async createPaymentRecord(bookingId: string, paymentData: {
    amount: number;
    currency: string;
    status: string;
    payment_method: string;
    stripe_payment_intent_id?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          booking_id: bookingId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: paymentData.status,
          payment_method: paymentData.payment_method,
          stripe_payment_intent_id: paymentData.stripe_payment_intent_id,
          processed_at: paymentData.status === 'succeeded' ? new Date().toISOString() : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating payment record:', error);
      // Don't throw here as this is not critical for booking creation
    }
  },

  // Create invoice record for booking
  async createInvoiceRecord(bookingId: string, invoiceData: {
    guest_name: string;
    guest_email: string;
    amount: number;
    currency: string;
  }) {
    try {
      // Generate invoice number
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      const { data, error } = await supabase
        .from('invoices')
        .insert([{
          booking_id: bookingId,
          invoice_number: invoiceNumber,
          guest_name: invoiceData.guest_name,
          guest_email: invoiceData.guest_email,
          amount: invoiceData.amount,
          currency: invoiceData.currency,
          status: 'draft',
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
          line_items: JSON.stringify([{
            description: 'Accommodation',
            quantity: 1,
            unit_price: invoiceData.amount,
            total: invoiceData.amount
          }]),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating invoice record:', error);
      // Don't throw here as this is not critical for booking creation
    }
  },



  // Get booking by ID
  async getBookingById(bookingId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city,
          country
        )
      `)
      .eq('id', bookingId)
      .single();

    if (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
    return data;
  },

  // Update booking status
  async updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled') {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a booking
  async deleteBooking(bookingId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new property
  async createProperty(property: {
    name: string;
    description: string;
    city: string;
    country: string;
    address: string;
    max_guests: number;
    bedrooms: number;
    bathrooms: number;
    base_price: number;
    currency: string;
    amenities: string[] | string;
    images?: string[] | string;
    active: boolean;
    // New fields
    slug?: string;
    size_sqm?: number;
    cleaning_fee?: number;
    security_deposit?: number;
    min_nights?: number;
    max_nights?: number;
    check_in_time?: string;
    check_out_time?: string;
    about_space?: string;
    the_space?: string;
    location_neighborhood?: string;
    house_rules?: string;
  }) {
    const { data, error } = await supabase
      .from('properties')
      .insert([{
        ...property,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a property
  async updateProperty(propertyId: string, updates: Partial<{
    name: string;
    description: string;
    city: string;
    country: string;
    address: string;
    max_guests: number;
    bedrooms: number;
    bathrooms: number;
    base_price: number;
    currency: string;
    amenities: string[] | string;
    images: string[] | string;
    active: boolean;
    // New fields
    slug: string;
    size_sqm: number;
    cleaning_fee: number;
    security_deposit: number;
    min_nights: number;
    max_nights: number;
    check_in_time: string;
    check_out_time: string;
    about_space: string;
    the_space: string;
    location_neighborhood: string;
    house_rules: string;
  }>) {
    console.log('Updating property:', propertyId, 'with updates:', updates);

    // First check if the property exists
    const { data: existingProperty, error: checkError } = await supabase
      .from('properties')
      .select('id')
      .eq('id', propertyId)
      .single();

    if (checkError) {
      console.error('Property not found:', propertyId, checkError);
      throw new Error(`Property with ID ${propertyId} not found`);
    }

    // Now update the property
    const { data, error } = await supabase
      .from('properties')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', propertyId)
      .select();

    if (error) {
      console.error('Update error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.error('No rows updated - likely RLS policy issue');
      throw new Error('Property update was blocked. This might be due to insufficient permissions.');
    }

    console.log('✅ Property updated in database:', data[0]);
    console.log('🕒 Update timestamp:', new Date().toISOString());
    return data[0];
  },

  // Delete a property
  async deleteProperty(propertyId: string) {
    const { data, error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get rate rules for a property
  async getRateRules(propertyId?: string) {
    let query = supabase
      .from('rate_rules')
      .select('*')
      .order('priority', { ascending: true });

    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },



  // Get all bookings for admin dashboard
  async getAllBookings(limit = 50, offset = 0, filters: BookingFilters = {}) {
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          properties (
            id,
            name,
            city,
            country
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.property_id) {
        query = query.eq('property_id', filters.property_id);
      }
      if (filters.customer_email) {
        query = query.ilike('customer_email', `%${filters.customer_email}%`);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        bookings: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return {
        bookings: [],
        total: 0
      };
    }
  },

  // Get property details
  async getProperty(idOrSlug: string) {
    // First try by ID (UUID format)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    let query = supabase.from('properties').select('*');

    if (isUUID) {
      query = query.eq('id', idOrSlug);
    } else {
      // Try to match by slug first, then by name
      query = query.or(`slug.eq.${idOrSlug},name.eq.${idOrSlug}`);
    }

    const { data, error } = await query.single();

    if (error) {
      console.log(`Property not found in Supabase for: ${idOrSlug}`, error);
      throw error;
    }
    return data;
  },

  // Get all properties
  async getAllProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('active', true)
      .order('name');

    if (error) throw error;
    return data;
  },

  // === GUEST MANAGEMENT ===

  // Get all guests with pagination and filters
  async getAllGuests(limit = 50, offset = 0, filters: GuestFilters = {}) {
    let query = supabase
      .from('guests')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (filters.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
    }
    if (filters.vip_status !== undefined) {
      query = query.eq('vip_status', filters.vip_status);
    }
    if (filters.id_verified !== undefined) {
      query = query.eq('id_verified', filters.id_verified);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { guests: data, total: count };
  },

  // Get guest by ID with booking history
  async getGuestById(guestId: string) {
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guestId)
      .single();

    if (guestError) throw guestError;

    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        properties (name, slug)
      `)
      .eq('customer_email', guest.email)
      .order('created_at', { ascending: false });

    if (bookingsError) throw bookingsError;

    return { ...guest, bookings };
  },

  // Create or update guest
  async upsertGuest(guestData: GuestData) {
    const { data, error } = await supabase
      .from('guests')
      .upsert(guestData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // === PAYMENT MANAGEMENT ===

  // Get all payments with pagination and filters
  async getAllPayments(limit = 50, offset = 0, filters: PaymentFilters = {}) {
    let query = supabase
      .from('payments')
      .select(`
        *,
        bookings (
          id,
          customer_name,
          customer_email,
          check_in,
          check_out,
          properties (name)
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.payment_method) {
      query = query.eq('payment_method', filters.payment_method);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { payments: data, total: count };
  },

  // Create payment record
  async createPayment(paymentData: PaymentData) {
    const { data, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update payment status
  async updatePaymentStatus(paymentId: string, status: string, metadata?: Record<string, unknown>) {
    const updateData: { status: string; updated_at: string; metadata?: Record<string, unknown> } = {
      status,
      updated_at: new Date().toISOString()
    };
    if (metadata) updateData.metadata = metadata;

    const { data, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', paymentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // === INVOICE MANAGEMENT ===

  // Get all invoices with pagination and filters
  async getAllInvoices(limit = 50, offset = 0, filters: InvoiceFilters = {}) {
    let query = supabase
      .from('invoices')
      .select(`
        *,
        bookings (
          customer_name,
          customer_email,
          properties (
            name
          )
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters.customer_email) {
      query = query.ilike('customer_email', `%${filters.customer_email}%`);
    }

    if (filters.invoice_number) {
      query = query.ilike('invoice_number', `%${filters.invoice_number}%`);
    }

    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      invoices: data || [],
      total: count || 0
    };
  },

  // === EMAIL TEMPLATE MANAGEMENT ===

  // Get all email templates
  async getAllEmailTemplates() {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create or update email template
  async upsertEmailTemplate(templateData: EmailTemplateData) {
    const { data, error } = await supabase
      .from('email_templates')
      .upsert(templateData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete email template
  async deleteEmailTemplate(templateId: string) {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', templateId);

    if (error) throw error;
  },

  // === EMAIL LOG MANAGEMENT ===

  // Get email logs with pagination and filters
  async getEmailLogs(limit = 50, offset = 0, filters: EmailLogFilters = {}) {
    let query = supabase
      .from('email_logs')
      .select(`
        *,
        email_templates (name, template_type),
        bookings (customer_name, properties(name))
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.template_id) {
      query = query.eq('template_id', filters.template_id);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { logs: data, total: count };
  },

  // Create email log entry
  async createEmailLog(logData: EmailLogData) {
    const { data, error } = await supabase
      .from('email_logs')
      .insert(logData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update email log status
  async updateEmailLogStatus(logId: string, status: string, metadata?: Record<string, unknown>) {
    const updateData: { status: string; updated_at: string; sent_at?: string; error_message?: string } = {
      status,
      updated_at: new Date().toISOString()
    };
    if (status === 'sent') updateData.sent_at = new Date().toISOString();
    if (status === 'failed' && metadata?.error && typeof metadata.error === 'string') {
      updateData.error_message = metadata.error;
    }

    const { data, error } = await supabase
      .from('email_logs')
      .update(updateData)
      .eq('id', logId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // === ID DOCUMENT MANAGEMENT ===

  // Get ID documents with pagination and filters
  async getIDDocuments(limit = 50, offset = 0, filters: IDDocumentFilters = {}) {
    let query = supabase
      .from('id_documents')
      .select(`
        *,
        bookings (
          customer_name,
          customer_email,
          check_in,
          properties (name)
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.document_type) {
      query = query.eq('document_type', filters.document_type);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { documents: data, total: count };
  },

  // Update document verification status
  async updateDocumentStatus(documentId: string, status: string, verifiedBy?: string, rejectionReason?: string) {
    const updateData: {
      status: string;
      updated_at: string;
      verified_by?: string;
      verified_at?: string;
      rejection_reason?: string;
    } = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'verified') {
      updateData.verified_at = new Date().toISOString();
      updateData.verified_by = verifiedBy;
    } else if (status === 'rejected') {
      updateData.verified_at = new Date().toISOString();
      updateData.verified_by = verifiedBy;
      updateData.rejection_reason = rejectionReason;
    }

    const { data, error } = await supabase
      .from('id_documents')
      .update(updateData)
      .eq('id', documentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete expired documents
  async deleteExpiredDocuments() {
    const { data, error } = await supabase
      .from('id_documents')
      .delete()
      .lt('auto_delete_at', new Date().toISOString());

    if (error) throw error;
    return data;
  },

  // === CALENDAR SYNC MANAGEMENT ===

  // Get all calendar syncs
  async getCalendarSyncs() {
    const { data, error } = await supabase
      .from('calendar_syncs')
      .select(`
        *,
        properties (name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create or update calendar sync
  async upsertCalendarSync(syncData: CalendarSyncData) {
    const { data, error } = await supabase
      .from('calendar_syncs')
      .upsert(syncData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update sync status
  async updateSyncStatus(syncId: string, lastSyncAt?: string, lastError?: string) {
    const updateData: { updated_at: string; last_sync_at?: string; last_error?: string } = {
      updated_at: new Date().toISOString()
    };
    if (lastSyncAt) updateData.last_sync_at = lastSyncAt;
    if (lastError !== undefined) updateData.last_error = lastError;

    const { data, error } = await supabase
      .from('calendar_syncs')
      .update(updateData)
      .eq('id', syncId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get sync logs
  async getSyncLogs(syncId?: string, limit = 50) {
    let query = supabase
      .from('sync_logs')
      .select(`
        *,
        calendar_syncs (name, platform)
      `)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (syncId) {
      query = query.eq('calendar_sync_id', syncId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // === SYSTEM SETTINGS ===

  // Get settings by category
  async getSettings(category?: string) {
    let query = supabase
      .from('system_settings')
      .select('*')
      .order('category', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Update setting
  async updateSetting(category: string, key: string, value: string | number | boolean | null) {
    const { data, error } = await supabase
      .from('system_settings')
      .upsert({
        category,
        key,
        value,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update multiple settings at once
  async updateSettings(settingsArray: Array<{
    category: string;
    key: string;
    value: string;
    description?: string;
  }>) {
    try {
      // Use upsert to insert or update settings
      const { data, error } = await supabase
        .from('system_settings')
        .upsert(
          settingsArray.map(setting => ({
            category: setting.category,
            key: setting.key,
            value: setting.value,
            description: setting.description,
            updated_at: new Date().toISOString()
          })),
          {
            onConflict: 'category,key',
            ignoreDuplicates: false
          }
        )
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Get setting by category and key
  async getSetting(category: string, key: string) {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('category', category)
      .eq('key', key)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.value || null;
  },

  // === DASHBOARD ANALYTICS ===

  // Get dashboard metrics
  async getDashboardMetrics() {
    // Get booking counts by status
    const { data: bookingStats, error: bookingError } = await supabase
      .from('bookings')
      .select('status')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (bookingError) throw bookingError;

    // Get revenue for current month
    const { data: revenueData, error: revenueError } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'succeeded')
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

    if (revenueError) throw revenueError;

    // Get today's check-ins and check-outs
    const today = new Date().toISOString().split('T')[0];
    const { data: todayCheckIns, error: checkInError } = await supabase
      .from('bookings')
      .select('*')
      .eq('check_in', today)
      .eq('status', 'confirmed');

    if (checkInError) throw checkInError;

    const { data: todayCheckOuts, error: checkOutError } = await supabase
      .from('bookings')
      .select('*')
      .eq('check_out', today)
      .eq('status', 'confirmed');

    if (checkOutError) throw checkOutError;

    // Get pending ID verifications
    const { data: pendingDocs, error: docsError } = await supabase
      .from('id_documents')
      .select('id')
      .eq('status', 'pending');

    if (docsError) throw docsError;

    return {
      bookings: {
        total: bookingStats?.length || 0,
        pending: bookingStats?.filter(b => b.status === 'pending').length || 0,
        confirmed: bookingStats?.filter(b => b.status === 'confirmed').length || 0,
        cancelled: bookingStats?.filter(b => b.status === 'cancelled').length || 0
      },
      revenue: {
        current_month: revenueData?.reduce((sum, p) => sum + p.amount, 0) || 0
      },
      today: {
        check_ins: todayCheckIns?.length || 0,
        check_outs: todayCheckOuts?.length || 0
      },
      pending_verifications: pendingDocs?.length || 0
    };
  },

  // === PAYMENT HELPERS ===

  // Get payment by Stripe payment intent ID
  async getPaymentByIntentId(paymentIntentId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  },



  // Create invoice
  async createInvoice(invoiceData: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoiceData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update invoice status
  async updateInvoiceStatus(invoiceId: string, status: string, metadata?: Record<string, unknown>) {
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'paid') {
      updateData.paid_at = new Date().toISOString();
    }

    if (metadata) {
      Object.assign(updateData, metadata);
    }

    const { data, error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', invoiceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // === EMAIL AUTOMATION HELPERS ===

  // Trigger email automation
  async triggerEmailAutomation(triggerType: string, bookingId: string, delayHours = 0) {
    try {
      // Get active automations for this trigger type
      const { data: automations, error } = await supabase
        .from('email_automations')
        .select(`
          *,
          email_templates (*)
        `)
        .eq('trigger_type', triggerType)
        .eq('is_active', true);

      if (error) throw error;

      // Get booking details
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          *,
          properties (*)
        `)
        .eq('id', bookingId)
        .single();

      if (bookingError) throw bookingError;

      // Schedule emails for each automation
      for (const automation of automations || []) {
        const scheduledFor = new Date();
        scheduledFor.setHours(scheduledFor.getHours() + (delayHours || automation.trigger_delay_hours));

        await this.createEmailLog({
          template_id: automation.template_id,
          booking_id: bookingId,
          recipient_email: booking.customer_email,
          recipient_name: booking.customer_name,
          subject: automation.email_templates.subject,
          content: automation.email_templates.content,
          status: 'scheduled',
          scheduled_for: scheduledFor.toISOString()
        });
      }

    } catch (error) {
      console.error('Error triggering email automation:', error);
      throw error;
    }
  }
};
