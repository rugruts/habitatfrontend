import * as React from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabaseHelpers } from "@/lib/supabase";
import { centsToEUR } from "@/lib/api";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { analyticsService, AnalyticsDashboard } from "@/services/AnalyticsService";
import { cn } from "@/lib/utils";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import CalendarView from "@/components/admin/CalendarView";
import BookingManagement from "@/components/admin/BookingManagement";

import GuestManagement from "@/components/admin/GuestManagement";
import PaymentInvoiceManagement from "@/components/admin/PaymentInvoiceManagement";
import EmailAutomationManagement from "@/components/admin/EmailAutomationManagement";

import CalendarSyncManagement from "@/components/admin/CalendarSyncManagement";
import SettingsManagement from "@/components/admin/SettingsManagement";
import UnitsRatesManagement from "@/components/admin/UnitsRatesManagement";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Plus,
  Filter,
  Search,
  Edit,
  Trash2,
  LogOut,
  BarChart3,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  MapPin,
  Home,
  Star,
  Eye,
  Download,
  Upload,
  Bell,
  PieChart,
  Activity,
  Wifi,
  Shield,
  CreditCard,
  MessageSquare,
  FileText,
  Printer,
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check,
  Globe
} from "lucide-react";

// Types for property and booking data
interface Property {
  id: string;
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
  amenities: string[];
  active: boolean;
  created_at: string;
}

interface Booking {
  id: string;
  property_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_intent_id?: string;
  created_at: string;
  properties?: {
    name: string;
    slug: string;
  };
}

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  occupancyRate: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  upcomingBookings: number;
  pendingPayments: number;
  missingIds: number;
  needsCleaning: number;
  todayCheckInGuests: Booking[];
  todayCheckOutGuests: Booking[];
}

// Generate availability data for calendar
const generateAvailabilityData = (propertyId: string, bookings: Booking[]) => {
  const availability = [];
  const today = new Date();

  // Generate 90 days of availability data
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    // Check if this date has a booking
    const hasBooking = bookings.some(booking =>
      booking.property_id === propertyId &&
      dateStr >= booking.check_in &&
      dateStr < booking.check_out
    );

    availability.push({
      date: dateStr,
      status: hasBooking ? 'booked' : 'available',
      price: hasBooking ? undefined : 9500, // €95 per night default
      minStay: 2
    });
  }

  return availability;
};

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAdminAuth();
  const [selectedTab, setSelectedTab] = React.useState('overview');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);
  const [showBookingDialog, setShowBookingDialog] = React.useState(false);
  const [showNewBookingDialog, setShowNewBookingDialog] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState('apartment-1');
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [stats, setStats] = React.useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    occupancyRate: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
    upcomingBookings: 0,
    pendingPayments: 0,
    missingIds: 0,
    needsCleaning: 0,
    todayCheckInGuests: [],
    todayCheckOutGuests: []
  });
  const [loading, setLoading] = React.useState(true);
  const [analytics, setAnalytics] = React.useState<AnalyticsDashboard | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = React.useState(false);
  const [newBooking, setNewBooking] = React.useState({
    propertyId: '',
    guestName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    totalCents: 0,
    source: 'manual',
    notes: ''
  });

  const handleLogout = async () => {
    await signOut();
  };

  // Fetch bookings and stats from Supabase
  const fetchBookings = async () => {
    try {
      setLoading(true);

      // Fetch bookings and dashboard metrics
      const [bookingsResponse, metricsResponse] = await Promise.all([
        supabaseHelpers.getAllBookings(),
        supabaseHelpers.getDashboardMetrics()
      ]);

      const bookingsData = bookingsResponse.bookings || [];
      setBookings(bookingsData);

      // Use real metrics from Supabase
      const metrics = metricsResponse;
      const today = new Date().toISOString().split('T')[0];

      // Get today's check-ins and check-outs from bookings
      const todayCheckIns = bookingsData.filter(booking => booking.check_in === today);
      const todayCheckOuts = bookingsData.filter(booking => booking.check_out === today);
      const upcomingBookings = bookingsData.filter(booking => booking.check_in > today);

      // Calculate total revenue from bookings
      const totalRevenue = bookingsData.reduce((sum, booking) => sum + booking.total_amount, 0);
      const thisMonth = new Date().toISOString().slice(0, 7);
      const monthlyRevenue = bookingsData
        .filter(booking => booking.created_at.startsWith(thisMonth))
        .reduce((sum, booking) => sum + booking.total_amount, 0);

      // Simple occupancy calculation
      const occupancyRate = Math.round((metrics.bookings.confirmed / (metrics.bookings.confirmed + 10)) * 100);

      setStats({
        totalBookings: metrics.bookings.total,
        totalRevenue,
        monthlyRevenue,
        yearlyRevenue: metrics.revenue.current_month * 12, // Estimate
        occupancyRate,
        todayCheckIns: metrics.today.check_ins,
        todayCheckOuts: metrics.today.check_outs,
        upcomingBookings: upcomingBookings.length,
        pendingPayments: metrics.bookings.pending,
        missingIds: 0, // ID verification removed
        needsCleaning: 0, // TODO: Add needs_cleaning to metrics
        todayCheckInGuests: todayCheckIns,
        todayCheckOutGuests: todayCheckOuts
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Set empty data on error
      setBookings([]);
      setStats({
        totalBookings: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        yearlyRevenue: 0,
        occupancyRate: 0,
        todayCheckIns: 0,
        todayCheckOuts: 0,
        upcomingBookings: 0,
        pendingPayments: 0,
        missingIds: 0,
        needsCleaning: 0,
        todayCheckInGuests: [],
        todayCheckOutGuests: []
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const propertiesData = await supabaseHelpers.getAllProperties();
      console.log('Fetched properties:', propertiesData); // Debug log
      setProperties(propertiesData || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Set empty array on error
      setProperties([]);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      console.log('📊 Fetching analytics data...');

      const analyticsData = await analyticsService.getDashboardAnalytics();
      console.log('📈 Analytics data loaded:', analyticsData);

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBookings();
    fetchProperties();
    fetchAnalytics();
  }, []);

  // Filter bookings based on search
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (booking.properties?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getSourceBadge = (source: string) => {
    const colors = {
      manual: 'bg-green-100 text-green-800 border-green-200',
      airbnb: 'bg-red-100 text-red-800 border-red-200',
      'booking.com': 'bg-blue-100 text-blue-800 border-blue-200'
    };

    return (
      <Badge variant="outline" className={colors[source] || 'bg-gray-100 text-gray-800'}>
        {source === 'booking.com' ? 'Booking.com' :
         source === 'manual' ? 'Direct' :
         source.charAt(0).toUpperCase() + source.slice(1)}
      </Badge>
    );
  };

  const handleCreateBooking = async () => {
    try {
      // Get property by ID
      const properties = await supabaseHelpers.getAllProperties();
      const property = properties.find(p => p.id === newBooking.propertyId);

      if (!property) {
        console.error('Property not found for ID:', newBooking.propertyId);
        return;
      }

      // Create booking in Supabase
      const bookingData = {
        property_id: property.id,
        check_in: newBooking.checkIn,
        check_out: newBooking.checkOut,
        guests: newBooking.guests,
        customer_name: newBooking.guestName,
        customer_email: newBooking.email,
        customer_phone: newBooking.phone,
        total_amount: newBooking.totalCents / 100, // Convert cents to euros
        currency: 'EUR',
        status: 'confirmed' as const,
        source: newBooking.source,
        notes: newBooking.notes
      };

      const createdBooking = await supabaseHelpers.createBooking(bookingData);
      console.log('Booking created successfully:', createdBooking);

      // Refresh bookings to show the new one
      await fetchBookings();

      setShowNewBookingDialog(false);

      // Reset form
      setNewBooking({
        propertyId: '',
        guestName: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: 2,
        totalCents: 0,
        source: 'manual',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      // You could show an error toast here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Helmet>
        <title>Admin Dashboard - Habitat Lobby</title>
        <meta name="description" content="Comprehensive admin dashboard for managing bookings, guests, and property operations" />
      </Helmet>

      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl text-primary">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.email} • Manage bookings and availability
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => setShowNewBookingDialog(true)} className="w-fit">
                <Plus className="h-4 w-4 mr-2" />
                Add Booking
              </Button>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-fit"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">

        {/* Simple Navigation Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-10 bg-white border border-gray-200">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="units" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Units & Rates
            </TabsTrigger>
            <TabsTrigger value="guests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Guests
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Emails
            </TabsTrigger>

            <TabsTrigger value="sync" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar Sync
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Alerts Section */}
            {(stats.pendingPayments > 0 || stats.missingIds > 0 || stats.needsCleaning > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.pendingPayments > 0 && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="font-semibold text-orange-800">{stats.pendingPayments} Pending Payments</p>
                          <p className="text-sm text-orange-600">Require attention</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {stats.missingIds > 0 && (
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-semibold text-red-800">{stats.missingIds} Missing IDs</p>
                          <p className="text-sm text-red-600">Send reminders</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {stats.needsCleaning > 0 && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Home className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-semibold text-blue-800">{stats.needsCleaning} Need Cleaning</p>
                          <p className="text-sm text-blue-600">Post-checkout</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Revenue Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{centsToEUR(stats.monthlyRevenue)}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
                  <p className="text-xs text-muted-foreground">Current month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Yearly Revenue</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{centsToEUR(stats.yearlyRevenue)}</div>
                  <p className="text-xs text-muted-foreground">This year</p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Analytics Section */}
            {analytics && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Advanced Analytics</h3>
                  <Button variant="outline" onClick={fetchAnalytics} disabled={analyticsLoading}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {analyticsLoading ? 'Loading...' : 'Refresh Analytics'}
                  </Button>
                </div>

                {/* Property Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Property Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.property_performance.slice(0, 3).map((property) => (
                        <div key={property.property_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{property.property_name}</p>
                            <p className="text-sm text-gray-600">{property.total_bookings} bookings</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{centsToEUR(property.total_revenue)}</p>
                            <p className="text-sm text-gray-600">{property.occupancy_rate}% occupied</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Guest Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Guest Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Guests</span>
                          <span className="font-semibold">{analytics.guest_analytics.total_guests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Returning Guests</span>
                          <span className="font-semibold">{analytics.guest_analytics.returning_guests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Avg Stay Duration</span>
                          <span className="font-semibold">{analytics.guest_analytics.average_stay_duration} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Satisfaction</span>
                          <span className="font-semibold">{analytics.guest_analytics.guest_satisfaction}/5.0</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Top Nationalities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics.guest_analytics.top_nationalities.slice(0, 5).map((nationality, index) => (
                          <div key={nationality.nationality} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">#{index + 1}</span>
                              <span className="text-sm">{nationality.nationality}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">{nationality.count}</span>
                              <span className="text-xs text-gray-500">({nationality.percentage}%)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Financial Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Financial Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Gross Revenue</p>
                        <p className="text-lg font-bold">{centsToEUR(analytics.financial_metrics.gross_revenue)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Net Revenue</p>
                        <p className="text-lg font-bold">{centsToEUR(analytics.financial_metrics.net_revenue)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Profit Margin</p>
                        <p className="text-lg font-bold">{analytics.financial_metrics.profit_margin}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Avg Daily Rate</p>
                        <p className="text-lg font-bold">{centsToEUR(analytics.financial_metrics.average_daily_rate)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Today's Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Today's Check-ins ({stats.todayCheckIns})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.todayCheckInGuests.length > 0 ? (
                    <div className="space-y-3">
                      {stats.todayCheckInGuests.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-medium">{booking.customer_name}</p>
                            <p className="text-sm text-gray-600">{booking.properties?.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{centsToEUR(booking.total_amount)}</p>
                            <p className="text-sm text-gray-600">{booking.guests} guests</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No check-ins today</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Today's Check-outs ({stats.todayCheckOuts})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.todayCheckOutGuests.length > 0 ? (
                    <div className="space-y-3">
                      {stats.todayCheckOutGuests.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <p className="font-medium">{booking.customer_name}</p>
                            <p className="text-sm text-gray-600">{booking.properties?.name}</p>
                          </div>
                          <div className="text-right">
                            <Button size="sm" variant="outline">
                              Mark Cleaned
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No check-outs today</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button onClick={() => setShowNewBookingDialog(true)} className="h-20 flex-col">
                    <Plus className="h-6 w-6 mb-2" />
                    New Booking
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => setSelectedTab('calendar')}>
                    <CalendarIcon className="h-6 w-6 mb-2" />
                    View Calendar
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => setSelectedTab('bookings')}>
                    <Users className="h-6 w-6 mb-2" />
                    All Bookings
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Mail className="h-6 w-6 mb-2" />
                    Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <BookingManagement
              onBookingUpdate={(booking) => {
                console.log('Booking updated:', booking);
                fetchBookings(); // Refresh bookings
              }}
              onBookingDelete={(bookingId) => {
                console.log('Booking deleted:', bookingId);
                fetchBookings(); // Refresh bookings
              }}
            />
          </TabsContent>



          <TabsContent value="calendar" className="space-y-6">
            <CalendarView
              onBookingCreate={(booking) => {
                console.log('New booking created:', booking);
                fetchBookings(); // Refresh bookings
              }}
              onBookingEdit={(booking) => {
                console.log('Booking edited:', booking);
                fetchBookings(); // Refresh bookings
              }}
              onBookingDelete={(bookingId) => {
                console.log('Booking deleted:', bookingId);
                fetchBookings(); // Refresh bookings
              }}
            />
          </TabsContent>

          <TabsContent value="units" className="space-y-6">
            <UnitsRatesManagement />
          </TabsContent>

          <TabsContent value="guests" className="space-y-6">
            <GuestManagement />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <PaymentInvoiceManagement />
          </TabsContent>

          <TabsContent value="emails" className="space-y-6">
            <EmailAutomationManagement />
          </TabsContent>



          <TabsContent value="sync" className="space-y-6">
            <CalendarSyncManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsManagement />
          </TabsContent>
        </Tabs>

        {/* New Booking Dialog */}
        <Dialog open={showNewBookingDialog} onOpenChange={setShowNewBookingDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Booking</DialogTitle>
              <DialogDescription>
                Create a new booking for a guest. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Property</Label>
                <Select value={newBooking.propertyId} onValueChange={(value) => setNewBooking({...newBooking, propertyId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.length === 0 ? (
                      <SelectItem value="no-properties" disabled>No properties found - Check Supabase</SelectItem>
                    ) : (
                      properties.map(property => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name} - {property.city}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkin">Check-in</Label>
                  <Input
                    id="checkin"
                    type="date"
                    value={newBooking.checkIn}
                    onChange={(e) => setNewBooking({...newBooking, checkIn: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout">Check-out</Label>
                  <Input
                    id="checkout"
                    type="date"
                    value={newBooking.checkOut}
                    onChange={(e) => setNewBooking({...newBooking, checkOut: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guest-name">Guest Name</Label>
                <Input
                  id="guest-name"
                  value={newBooking.guestName}
                  onChange={(e) => setNewBooking({...newBooking, guestName: e.target.value})}
                  placeholder="Full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newBooking.email}
                  onChange={(e) => setNewBooking({...newBooking, email: e.target.value})}
                  placeholder="guest@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newBooking.phone}
                    onChange={(e) => setNewBooking({...newBooking, phone: e.target.value})}
                    placeholder="+30 123 456 7890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests">Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="6"
                    value={newBooking.guests}
                    onChange={(e) => setNewBooking({...newBooking, guests: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="total">Total Amount (€)</Label>
                <Input
                  id="total"
                  type="number"
                  step="0.01"
                  value={newBooking.totalCents / 100}
                  onChange={(e) => setNewBooking({...newBooking, totalCents: Math.round(parseFloat(e.target.value) * 100)})}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Booking Source</Label>
                <Select value={newBooking.source} onValueChange={(value) => setNewBooking({...newBooking, source: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Direct/Manual</SelectItem>
                    <SelectItem value="airbnb">Airbnb</SelectItem>
                    <SelectItem value="booking.com">Booking.com</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newBooking.notes}
                  onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                  placeholder="Special requests or notes..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowNewBookingDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreateBooking} className="flex-1">
                  Add Booking
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Booking Detail Dialog */}
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Guest</Label>
                    <p className="font-medium">{selectedBooking.customer_name}</p>
                    <p className="text-sm text-gray-600">{selectedBooking.customer_email}</p>
                    {selectedBooking.customer_phone && <p className="text-sm text-gray-600">{selectedBooking.customer_phone}</p>}
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Booking Details</Label>
                    <p className="font-medium">{selectedBooking.properties?.name || 'Property'}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedBooking.check_in).toLocaleDateString()} → {new Date(selectedBooking.check_out).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">{selectedBooking.guests} guests</p>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Amount</Label>
                    <p className="font-semibold text-lg">{centsToEUR(selectedBooking.total_amount)}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {selectedBooking.status}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Direct
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Payment</Label>
                    <p className="text-sm text-gray-600">
                      {selectedBooking.payment_intent_id ? `Payment ID: ${selectedBooking.payment_intent_id}` : 'No payment info'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;
