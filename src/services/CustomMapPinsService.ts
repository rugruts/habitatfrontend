import { supabase } from '@/lib/supabase';

export interface CustomMapPin {
  id: string;
  name: string;
  description?: string;
  category: string;
  icon_name: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  is_featured: boolean;
  color: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  address?: string;
  website_url?: string;
  phone_number?: string;
  opening_hours?: Record<string, string>;
  tags?: string[];
  priority: number;
  show_on_property_maps: boolean;
  show_on_guide_maps: boolean;
  show_on_overview_maps: boolean;
}

export interface PinCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon_name: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export class CustomMapPinsService {
  
  // Get all active custom map pins
  static async getActiveMapPins(): Promise<CustomMapPin[]> {
    const { data, error } = await supabase
      .from('custom_map_pins')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get map pins filtered by context (property, guide, or overview)
  static async getMapPinsByContext(context: 'property' | 'guide' | 'overview'): Promise<CustomMapPin[]> {
    const column = `show_on_${context}_maps`;
    
    const { data, error } = await supabase
      .from('custom_map_pins')
      .select('*')
      .eq('is_active', true)
      .eq(column, true)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get map pins by category
  static async getMapPinsByCategory(category: string): Promise<CustomMapPin[]> {
    const { data, error } = await supabase
      .from('custom_map_pins')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get featured map pins
  static async getFeaturedMapPins(): Promise<CustomMapPin[]> {
    const { data, error } = await supabase
      .from('custom_map_pins')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('priority', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get all map pins for admin (including inactive)
  static async getAllMapPins(): Promise<CustomMapPin[]> {
    const { data, error } = await supabase
      .from('custom_map_pins')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Create new map pin
  static async createMapPin(pin: Omit<CustomMapPin, 'id' | 'created_at' | 'updated_at'>): Promise<CustomMapPin> {
    const { data, error } = await supabase
      .from('custom_map_pins')
      .insert([pin])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update existing map pin
  static async updateMapPin(id: string, updates: Partial<CustomMapPin>): Promise<CustomMapPin> {
    const { data, error } = await supabase
      .from('custom_map_pins')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete map pin
  static async deleteMapPin(id: string): Promise<void> {
    const { error } = await supabase
      .from('custom_map_pins')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Toggle pin active status
  static async toggleMapPinStatus(id: string): Promise<CustomMapPin> {
    // First get current status
    const { data: currentPin, error: fetchError } = await supabase
      .from('custom_map_pins')
      .select('is_active')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Toggle status
    const { data, error } = await supabase
      .from('custom_map_pins')
      .update({ is_active: !currentPin.is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Bulk update pin priorities
  static async updatePinPriorities(updates: { id: string; priority: number }[]): Promise<void> {
    const promises = updates.map(({ id, priority }) =>
      supabase
        .from('custom_map_pins')
        .update({ priority })
        .eq('id', id)
    );

    await Promise.all(promises);
  }

  // Get all pin categories
  static async getPinCategories(): Promise<PinCategory[]> {
    const { data, error } = await supabase
      .from('pin_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  }

  // Create new pin category
  static async createPinCategory(category: Omit<PinCategory, 'id' | 'created_at'>): Promise<PinCategory> {
    const { data, error } = await supabase
      .from('pin_categories')
      .insert([category])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update pin category
  static async updatePinCategory(id: string, updates: Partial<PinCategory>): Promise<PinCategory> {
    const { data, error } = await supabase
      .from('pin_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete pin category
  static async deletePinCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('pin_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Search pins by location (within radius)
  static async searchPinsByLocation(
    latitude: number, 
    longitude: number, 
    radiusKm: number = 5
  ): Promise<CustomMapPin[]> {
    // Using basic distance calculation (for more precise, use PostGIS)
    const { data, error } = await supabase.rpc('get_pins_within_radius', {
      center_lat: latitude,
      center_lng: longitude,
      radius_km: radiusKm
    });

    if (error) {
      // Fallback to client-side filtering if function doesn't exist
      console.warn('Using fallback location search:', error);
      const allPins = await this.getActiveMapPins();
      
      return allPins.filter(pin => {
        const distance = this.calculateDistance(latitude, longitude, pin.latitude, pin.longitude);
        return distance <= radiusKm;
      });
    }

    return data || [];
  }

  // Helper function to calculate distance between two points
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI/180);
  }

  // Get pins within bounds (for map viewport)
  static async getPinsWithinBounds(
    northLat: number,
    southLat: number,
    eastLng: number,
    westLng: number
  ): Promise<CustomMapPin[]> {
    const { data, error } = await supabase
      .from('custom_map_pins')
      .select('*')
      .eq('is_active', true)
      .gte('latitude', southLat)
      .lte('latitude', northLat)
      .gte('longitude', westLng)
      .lte('longitude', eastLng)
      .order('priority', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Search pins by text
  static async searchPins(query: string): Promise<CustomMapPin[]> {
    const { data, error } = await supabase
      .from('custom_map_pins')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,address.ilike.%${query}%`)
      .order('priority', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Bulk operations
  static async bulkUpdatePinStatus(pinIds: string[], isActive: boolean): Promise<void> {
    const { error } = await supabase
      .from('custom_map_pins')
      .update({ is_active: isActive })
      .in('id', pinIds);

    if (error) throw error;
  }

  static async bulkDeletePins(pinIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('custom_map_pins')
      .delete()
      .in('id', pinIds);

    if (error) throw error;
  }

  // Get statistics
  static async getPinStats(): Promise<{
    total: number;
    active: number;
    featured: number;
    byCategory: Record<string, number>;
  }> {
    const { data: allPins, error } = await supabase
      .from('custom_map_pins')
      .select('category, is_active, is_featured');

    if (error) throw error;

    const stats = {
      total: allPins?.length || 0,
      active: allPins?.filter(p => p.is_active).length || 0,
      featured: allPins?.filter(p => p.is_featured).length || 0,
      byCategory: {} as Record<string, number>
    };

    allPins?.forEach(pin => {
      stats.byCategory[pin.category] = (stats.byCategory[pin.category] || 0) + 1;
    });

    return stats;
  }
}