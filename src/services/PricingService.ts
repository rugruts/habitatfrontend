import { supabase } from '../lib/supabase';

export interface RateRule {
  id: string;
  name: string;
  description?: string;
  property_id: string;
  rule_type: 'seasonal' | 'weekend' | 'holiday' | 'minimum_stay' | 'advance_booking' | 'last_minute' | 'custom';
  start_date?: string | null;
  end_date?: string | null;
  days_of_week?: number[];
  price_modifier: number;
  modifier_type: 'percentage' | 'fixed_amount' | 'absolute_price';
  min_nights?: number;
  max_nights?: number;
  advance_booking_days?: number;
  is_active: boolean;
  priority: number;
  conditions: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface BlackoutDate {
  id: string;
  property_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SeasonalRate {
  id: string;
  property_id: string;
  name: string;
  start_date: string;
  end_date: string;
  base_price: number; // in cents
  weekend_multiplier: number;
  min_nights: number;
  max_nights?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingResult {
  base_price: number; // in cents
  total_price: number; // in cents
  price_per_night: number; // in cents
  nights: number;
  applied_rules: Array<{
    rule_id: string;
    rule_name: string;
    modifier_type: string;
    modifier_amount: number;
  }>;
  is_available: boolean;
  blackout_reason?: string;
}

export interface CreateRateRuleData {
  name: string;
  description?: string;
  property_id: string;
  rule_type: RateRule['rule_type'];
  start_date?: string | null;
  end_date?: string | null;
  days_of_week?: number[];
  price_modifier: number;
  modifier_type: RateRule['modifier_type'];
  min_nights?: number;
  max_nights?: number;
  advance_booking_days?: number;
  is_active?: boolean;
  priority?: number;
  conditions?: Record<string, unknown>;
}

export interface CreateBlackoutDateData {
  property_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  description?: string;
  is_active?: boolean;
}

export class PricingService {
  // Get all rate rules
  async getAllRateRules(propertyId?: string): Promise<RateRule[]> {
    let query = supabase
      .from('rate_rules')
      .select('*')
      .order('priority', { ascending: false });

    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching rate rules:', error);
      throw new Error(`Failed to fetch rate rules: ${error.message}`);
    }

    return data || [];
  }

  // Get all blackout dates
  async getAllBlackoutDates(propertyId?: string): Promise<BlackoutDate[]> {
    let query = supabase
      .from('blackout_dates')
      .select('*')
      .order('start_date', { ascending: true });

    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching blackout dates:', error);
      throw new Error(`Failed to fetch blackout dates: ${error.message}`);
    }

    return data || [];
  }

  // Create rate rule
  async createRateRule(ruleData: CreateRateRuleData): Promise<RateRule> {
    const { data, error } = await supabase
      .from('rate_rules')
      .insert([{
        ...ruleData,
        is_active: ruleData.is_active ?? true,
        priority: ruleData.priority ?? 0,
        conditions: ruleData.conditions || {}
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating rate rule:', error);
      throw new Error(`Failed to create rate rule: ${error.message}`);
    }

    return data;
  }

  // Create blackout date
  async createBlackoutDate(blackoutData: CreateBlackoutDateData): Promise<BlackoutDate> {
    const { data, error } = await supabase
      .from('blackout_dates')
      .insert([{
        ...blackoutData,
        is_active: blackoutData.is_active ?? true
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating blackout date:', error);
      throw new Error(`Failed to create blackout date: ${error.message}`);
    }

    return data;
  }

  // Update rate rule
  async updateRateRule(id: string, updates: Partial<CreateRateRuleData>): Promise<RateRule> {
    const { data, error } = await supabase
      .from('rate_rules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating rate rule:', error);
      throw new Error(`Failed to update rate rule: ${error.message}`);
    }

    return data;
  }

  // Update blackout date
  async updateBlackoutDate(id: string, updates: Partial<CreateBlackoutDateData>): Promise<BlackoutDate> {
    const { data, error } = await supabase
      .from('blackout_dates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blackout date:', error);
      throw new Error(`Failed to update blackout date: ${error.message}`);
    }

    return data;
  }

  // Delete rate rule
  async deleteRateRule(id: string): Promise<void> {
    const { error } = await supabase
      .from('rate_rules')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting rate rule:', error);
      throw new Error(`Failed to delete rate rule: ${error.message}`);
    }
  }

  // Delete blackout date
  async deleteBlackoutDate(id: string): Promise<void> {
    const { error } = await supabase
      .from('blackout_dates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blackout date:', error);
      throw new Error(`Failed to delete blackout date: ${error.message}`);
    }
  }

  // Calculate dynamic pricing
  async calculatePricing(propertyId: string, checkIn: string, checkOut: string): Promise<PricingResult> {
    try {
      // First check for blackout dates
      const { data: blackouts } = await supabase
        .from('blackout_dates')
        .select('*')
        .eq('property_id', propertyId)
        .eq('is_active', true)
        .or(`and(start_date.lte.${checkIn},end_date.gte.${checkIn}),and(start_date.lte.${checkOut},end_date.gte.${checkOut}),and(start_date.gte.${checkIn},end_date.lte.${checkOut})`);

      if (blackouts && blackouts.length > 0) {
        return {
          base_price: 0,
          total_price: 0,
          price_per_night: 0,
          nights: 0,
          applied_rules: [],
          is_available: false,
          blackout_reason: blackouts[0].reason
        };
      }

      // Calculate using database function
      const { data: pricingData, error } = await supabase
        .rpc('calculate_dynamic_price', {
          p_property_id: propertyId,
          p_check_in: checkIn,
          p_check_out: checkOut
        });

      if (error) {
        console.error('Error calculating pricing:', error);
        throw new Error(`Failed to calculate pricing: ${error.message}`);
      }

      if (!pricingData || pricingData.length === 0) {
        throw new Error('No pricing data returned');
      }

      const result = pricingData[0];
      const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));

      return {
        base_price: result.base_price,
        total_price: result.total_price,
        price_per_night: Math.round(result.total_price / nights),
        nights,
        applied_rules: result.applied_rules || [],
        is_available: true
      };

    } catch (error) {
      console.error('Error in calculatePricing:', error);
      
      // Fallback to simple calculation
      const { data: property } = await supabase
        .from('properties')
        .select('base_price')
        .eq('id', propertyId)
        .single();

      if (!property) {
        throw new Error('Property not found');
      }

      const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = property.base_price * nights;

      return {
        base_price: property.base_price,
        total_price: totalPrice,
        price_per_night: property.base_price,
        nights,
        applied_rules: [],
        is_available: true
      };
    }
  }

  // Toggle rule/blackout status
  async toggleRateRuleStatus(id: string, isActive: boolean): Promise<RateRule> {
    return this.updateRateRule(id, { is_active: isActive });
  }

  async toggleBlackoutDateStatus(id: string, isActive: boolean): Promise<BlackoutDate> {
    return this.updateBlackoutDate(id, { is_active: isActive });
  }

  // Get pricing for date range (for calendar view)
  async getPricingCalendar(propertyId: string, startDate: string, endDate: string): Promise<Record<string, number>> {
    const pricing: Record<string, number> = {};
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Generate pricing for each day
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayStr = nextDay.toISOString().split('T')[0];

      try {
        const result = await this.calculatePricing(propertyId, dateStr, nextDayStr);
        pricing[dateStr] = result.price_per_night;
      } catch (error) {
        console.error(`Error calculating pricing for ${dateStr}:`, error);
        pricing[dateStr] = 0;
      }
    }

    return pricing;
  }
}

export const pricingService = new PricingService();
