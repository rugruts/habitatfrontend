import { supabase } from '../lib/supabase';

export interface CalendarSync {
  id: string;
  name: string;
  property_id?: string;
  property_name?: string;
  platform: 'airbnb' | 'booking_com' | 'vrbo' | 'expedia' | 'custom';
  sync_type: 'import' | 'export' | 'bidirectional';
  ical_url?: string;
  export_url?: string;
  is_active: boolean;
  sync_frequency_hours: number;
  last_sync_at?: string;
  next_sync_at?: string;
  total_bookings_synced: number;
  last_error?: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CalendarSyncLog {
  id: string;
  calendar_sync_id: string;
  sync_type: 'import' | 'export';
  status: 'success' | 'failed' | 'partial' | 'in_progress';
  bookings_processed: number;
  bookings_added: number;
  bookings_updated: number;
  bookings_removed: number;
  error_message?: string;
  sync_details: Record<string, any>;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
}

export interface ExternalBooking {
  id: string;
  calendar_sync_id: string;
  external_id?: string;
  property_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  guest_name?: string;
  guest_email?: string;
  guest_count: number;
  status: string;
  platform: CalendarSync['platform'];
  raw_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateCalendarSyncData {
  name: string;
  property_id?: string;
  platform: CalendarSync['platform'];
  sync_type: CalendarSync['sync_type'];
  ical_url?: string;
  sync_frequency_hours?: number;
  is_active?: boolean;
  settings?: Record<string, any>;
}

export interface UpdateCalendarSyncData extends Partial<CreateCalendarSyncData> {
  id: string;
}

export class CalendarSyncService {
  // Get all calendar syncs
  async getAllSyncs(): Promise<CalendarSync[]> {
    const { data, error } = await supabase
      .from('calendar_syncs')
      .select(`
        *,
        properties(id, name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching calendar syncs:', error);
      throw new Error(`Failed to fetch calendar syncs: ${error.message}`);
    }

    return (data || []).map(sync => ({
      ...sync,
      property_name: sync.properties?.name || 'All Properties'
    }));
  }

  // Get calendar sync by ID
  async getSyncById(id: string): Promise<CalendarSync | null> {
    const { data, error } = await supabase
      .from('calendar_syncs')
      .select(`
        *,
        properties(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Sync not found
      }
      console.error('Error fetching calendar sync:', error);
      throw new Error(`Failed to fetch calendar sync: ${error.message}`);
    }

    return {
      ...data,
      property_name: data.properties?.name || 'All Properties'
    };
  }

  // Create new calendar sync
  async createSync(syncData: CreateCalendarSyncData): Promise<CalendarSync> {
    const { data, error } = await supabase
      .from('calendar_syncs')
      .insert([{
        ...syncData,
        is_active: syncData.is_active ?? true,
        sync_frequency_hours: syncData.sync_frequency_hours ?? 6,
        settings: syncData.settings || {}
      }])
      .select(`
        *,
        properties(id, name)
      `)
      .single();

    if (error) {
      console.error('Error creating calendar sync:', error);
      throw new Error(`Failed to create calendar sync: ${error.message}`);
    }

    return {
      ...data,
      property_name: data.properties?.name || 'All Properties'
    };
  }

  // Update calendar sync
  async updateSync(syncData: UpdateCalendarSyncData): Promise<CalendarSync> {
    const { id, ...updateData } = syncData;
    
    const { data, error } = await supabase
      .from('calendar_syncs')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        properties(id, name)
      `)
      .single();

    if (error) {
      console.error('Error updating calendar sync:', error);
      throw new Error(`Failed to update calendar sync: ${error.message}`);
    }

    return {
      ...data,
      property_name: data.properties?.name || 'All Properties'
    };
  }

  // Delete calendar sync
  async deleteSync(id: string): Promise<void> {
    const { error } = await supabase
      .from('calendar_syncs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting calendar sync:', error);
      throw new Error(`Failed to delete calendar sync: ${error.message}`);
    }
  }

  // Toggle sync active status
  async toggleSyncStatus(id: string, isActive: boolean): Promise<CalendarSync> {
    const { data, error } = await supabase
      .from('calendar_syncs')
      .update({ is_active: isActive })
      .eq('id', id)
      .select(`
        *,
        properties(id, name)
      `)
      .single();

    if (error) {
      console.error('Error toggling sync status:', error);
      throw new Error(`Failed to toggle sync status: ${error.message}`);
    }

    return {
      ...data,
      property_name: data.properties?.name || 'All Properties'
    };
  }

  // Get sync logs
  async getSyncLogs(limit: number = 50, offset: number = 0): Promise<CalendarSyncLog[]> {
    const { data, error } = await supabase
      .from('calendar_sync_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching sync logs:', error);
      throw new Error(`Failed to fetch sync logs: ${error.message}`);
    }

    return data || [];
  }

  // Get external bookings
  async getExternalBookings(calendarSyncId?: string): Promise<ExternalBooking[]> {
    let query = supabase
      .from('external_bookings')
      .select('*')
      .order('start_date', { ascending: true });

    if (calendarSyncId) {
      query = query.eq('calendar_sync_id', calendarSyncId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching external bookings:', error);
      throw new Error(`Failed to fetch external bookings: ${error.message}`);
    }

    return data || [];
  }

  // Trigger manual sync
  async triggerSync(syncId: string): Promise<any> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch(`${import.meta.env.VITE_EMAIL_API_URL}/admin/sync-calendar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-api-key': import.meta.env.VITE_API_KEY || 'default-key'
        },
        body: JSON.stringify({
          syncId,
          syncType: 'import'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error triggering sync:', error);
      throw error;
    }
  }

  // Get export URL for property
  getExportUrl(propertyId?: string): string {
    const baseUrl = import.meta.env.VITE_EMAIL_API_URL || 'https://backendhabitatapi.vercel.app/api';
    return `${baseUrl}/calendar/export?propertyId=${propertyId || 'all'}`;
  }
}

export const calendarSyncService = new CalendarSyncService();
