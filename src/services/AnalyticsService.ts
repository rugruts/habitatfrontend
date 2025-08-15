import { supabase } from '../lib/supabase';

export interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

export interface BookingTrends {
  daily: RevenueData[];
  weekly: RevenueData[];
  monthly: RevenueData[];
  yearly: RevenueData[];
}

export interface PropertyPerformance {
  property_id: string;
  property_name: string;
  total_bookings: number;
  total_revenue: number;
  average_rating: number;
  occupancy_rate: number;
  average_booking_value: number;
}

export interface GuestAnalytics {
  total_guests: number;
  returning_guests: number;
  average_stay_duration: number;
  top_nationalities: Array<{
    nationality: string;
    count: number;
    percentage: number;
  }>;
  guest_satisfaction: number;
}

export interface SeasonalTrends {
  month: string;
  bookings: number;
  revenue: number;
  average_rate: number;
  occupancy_rate: number;
}

export interface FinancialMetrics {
  gross_revenue: number;
  net_revenue: number;
  cleaning_fees: number;
  taxes: number;
  commission_fees: number;
  profit_margin: number;
  average_daily_rate: number;
  revenue_per_available_room: number;
}

export interface BookingSourceAnalytics {
  source: string;
  bookings: number;
  revenue: number;
  conversion_rate: number;
  average_booking_value: number;
}

export interface AnalyticsDashboard {
  overview: {
    total_revenue: number;
    total_bookings: number;
    total_guests: number;
    average_rating: number;
    occupancy_rate: number;
    growth_rate: number;
  };
  revenue_trends: BookingTrends;
  property_performance: PropertyPerformance[];
  guest_analytics: GuestAnalytics;
  seasonal_trends: SeasonalTrends[];
  financial_metrics: FinancialMetrics;
  booking_sources: BookingSourceAnalytics[];
}

export class AnalyticsService {
  // Get comprehensive analytics dashboard
  async getDashboardAnalytics(startDate?: string, endDate?: string): Promise<AnalyticsDashboard> {
    const start = startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];

    const [
      overview,
      revenueTrends,
      propertyPerformance,
      guestAnalytics,
      seasonalTrends,
      financialMetrics,
      bookingSources
    ] = await Promise.all([
      this.getOverviewMetrics(start, end),
      this.getRevenueTrends(start, end),
      this.getPropertyPerformance(start, end),
      this.getGuestAnalytics(start, end),
      this.getSeasonalTrends(start, end),
      this.getFinancialMetrics(start, end),
      this.getBookingSourceAnalytics(start, end)
    ]);

    return {
      overview,
      revenue_trends: revenueTrends,
      property_performance: propertyPerformance,
      guest_analytics: guestAnalytics,
      seasonal_trends: seasonalTrends,
      financial_metrics: financialMetrics,
      booking_sources: bookingSources
    };
  }

  // Get overview metrics
  async getOverviewMetrics(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        total_amount,
        guests,
        check_in,
        check_out,
        status,
        customer_name
      `)
      .gte('check_in', startDate)
      .lte('check_out', endDate)
      .in('status', ['confirmed', 'checked_in', 'checked_out']);

    if (error) {
      console.error('Error fetching overview metrics:', error);
      throw new Error(`Failed to fetch overview metrics: ${error.message}`);
    }

    const bookings = data || [];
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
    const totalGuests = bookings.reduce((sum, booking) => sum + (booking.guests || 0), 0);
    const uniqueGuests = new Set(bookings.map(b => b.customer_name)).size;

    // Calculate occupancy rate (simplified)
    const totalDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
    const bookedDays = bookings.reduce((sum, booking) => {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
      return sum + Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);

    const occupancyRate = totalDays > 0 ? (bookedDays / totalDays) * 100 : 0;

    return {
      total_revenue: totalRevenue,
      total_bookings: bookings.length,
      total_guests: uniqueGuests,
      average_rating: 4.8, // Placeholder - would come from reviews
      occupancy_rate: Math.round(occupancyRate * 100) / 100,
      growth_rate: 15.2 // Placeholder - would be calculated from previous period
    };
  }

  // Get revenue trends
  async getRevenueTrends(startDate: string, endDate: string): Promise<BookingTrends> {
    const { data, error } = await supabase
      .from('bookings')
      .select('check_in, total_amount, status')
      .gte('check_in', startDate)
      .lte('check_in', endDate)
      .in('status', ['confirmed', 'checked_in', 'checked_out'])
      .order('check_in', { ascending: true });

    if (error) {
      console.error('Error fetching revenue trends:', error);
      throw new Error(`Failed to fetch revenue trends: ${error.message}`);
    }

    const bookings = data || [];

    // Group by different time periods
    const daily = this.groupByPeriod(bookings, 'day');
    const weekly = this.groupByPeriod(bookings, 'week');
    const monthly = this.groupByPeriod(bookings, 'month');
    const yearly = this.groupByPeriod(bookings, 'year');

    return { daily, weekly, monthly, yearly };
  }

  // Get property performance
  async getPropertyPerformance(startDate: string, endDate: string): Promise<PropertyPerformance[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        property_id,
        total_amount,
        status,
        properties(id, name)
      `)
      .gte('check_in', startDate)
      .lte('check_out', endDate)
      .in('status', ['confirmed', 'checked_in', 'checked_out']);

    if (error) {
      console.error('Error fetching property performance:', error);
      throw new Error(`Failed to fetch property performance: ${error.message}`);
    }

    const bookings = data || [];
    const propertyMap = new Map<string, {
      name: string;
      bookings: number;
      revenue: number;
    }>();

    bookings.forEach(booking => {
      const propertyId = booking.property_id;
      const propertyName = booking.properties?.name || 'Unknown Property';
      
      if (!propertyMap.has(propertyId)) {
        propertyMap.set(propertyId, {
          name: propertyName,
          bookings: 0,
          revenue: 0
        });
      }

      const property = propertyMap.get(propertyId)!;
      property.bookings += 1;
      property.revenue += booking.total_amount || 0;
    });

    return Array.from(propertyMap.entries()).map(([propertyId, data]) => ({
      property_id: propertyId,
      property_name: data.name,
      total_bookings: data.bookings,
      total_revenue: data.revenue,
      average_rating: 4.8, // Placeholder
      occupancy_rate: 75, // Placeholder
      average_booking_value: data.bookings > 0 ? Math.round(data.revenue / data.bookings) : 0
    }));
  }

  // Get guest analytics
  async getGuestAnalytics(startDate: string, endDate: string): Promise<GuestAnalytics> {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) {
      console.error('Error fetching guest analytics:', error);
      throw new Error(`Failed to fetch guest analytics: ${error.message}`);
    }

    const guests = data || [];
    const nationalityMap = new Map<string, number>();

    guests.forEach(guest => {
      const nationality = guest.nationality || 'Unknown';
      nationalityMap.set(nationality, (nationalityMap.get(nationality) || 0) + 1);
    });

    const topNationalities = Array.from(nationalityMap.entries())
      .map(([nationality, count]) => ({
        nationality,
        count,
        percentage: Math.round((count / guests.length) * 100 * 100) / 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total_guests: guests.length,
      returning_guests: 0, // Would need to calculate based on email/name matching
      average_stay_duration: 3.2, // Placeholder
      top_nationalities: topNationalities,
      guest_satisfaction: 4.8 // Placeholder
    };
  }

  // Get seasonal trends
  async getSeasonalTrends(startDate: string, endDate: string): Promise<SeasonalTrends[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('check_in, total_amount, status')
      .gte('check_in', startDate)
      .lte('check_in', endDate)
      .in('status', ['confirmed', 'checked_in', 'checked_out']);

    if (error) {
      console.error('Error fetching seasonal trends:', error);
      throw new Error(`Failed to fetch seasonal trends: ${error.message}`);
    }

    const bookings = data || [];
    const monthlyData = this.groupByPeriod(bookings, 'month');

    return monthlyData.map(item => ({
      month: item.date,
      bookings: item.bookings,
      revenue: item.revenue,
      average_rate: item.bookings > 0 ? Math.round(item.revenue / item.bookings) : 0,
      occupancy_rate: 75 // Placeholder
    }));
  }

  // Get financial metrics
  async getFinancialMetrics(startDate: string, endDate: string): Promise<FinancialMetrics> {
    const { data, error } = await supabase
      .from('bookings')
      .select('total_amount, status')
      .gte('check_in', startDate)
      .lte('check_out', endDate)
      .in('status', ['confirmed', 'checked_in', 'checked_out']);

    if (error) {
      console.error('Error fetching financial metrics:', error);
      throw new Error(`Failed to fetch financial metrics: ${error.message}`);
    }

    const bookings = data || [];
    const grossRevenue = bookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
    const cleaningFees = 0; // No cleaning_fee column in current schema
    
    // Calculate other metrics (simplified)
    const taxes = grossRevenue * 0.24; // 24% VAT in Greece
    const commissionFees = grossRevenue * 0.03; // 3% platform fees
    const netRevenue = grossRevenue - taxes - commissionFees;
    const profitMargin = grossRevenue > 0 ? ((netRevenue / grossRevenue) * 100) : 0;

    return {
      gross_revenue: grossRevenue,
      net_revenue: netRevenue,
      cleaning_fees: cleaningFees,
      taxes: taxes,
      commission_fees: commissionFees,
      profit_margin: Math.round(profitMargin * 100) / 100,
      average_daily_rate: bookings.length > 0 ? Math.round(grossRevenue / bookings.length) : 0,
      revenue_per_available_room: grossRevenue // Simplified
    };
  }

  // Get booking source analytics
  async getBookingSourceAnalytics(startDate: string, endDate: string): Promise<BookingSourceAnalytics[]> {
    // Placeholder implementation - would need to track booking sources
    return [
      {
        source: 'Direct Website',
        bookings: 45,
        revenue: 12500,
        conversion_rate: 3.2,
        average_booking_value: 278
      },
      {
        source: 'Airbnb',
        bookings: 23,
        revenue: 6800,
        conversion_rate: 2.1,
        average_booking_value: 296
      },
      {
        source: 'Booking.com',
        bookings: 18,
        revenue: 5200,
        conversion_rate: 1.8,
        average_booking_value: 289
      }
    ];
  }

  // Helper method to group data by time period
  private groupByPeriod(bookings: any[], period: 'day' | 'week' | 'month' | 'year'): RevenueData[] {
    const grouped = new Map<string, { revenue: number; bookings: number }>();

    bookings.forEach(booking => {
      const date = new Date(booking.check_in);
      let key: string;

      switch (period) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'year':
          key = String(date.getFullYear());
          break;
      }

      if (!grouped.has(key)) {
        grouped.set(key, { revenue: 0, bookings: 0 });
      }

      const group = grouped.get(key)!;
      group.revenue += booking.total_amount || 0;
      group.bookings += 1;
    });

    return Array.from(grouped.entries())
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        bookings: data.bookings
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}

export const analyticsService = new AnalyticsService();
