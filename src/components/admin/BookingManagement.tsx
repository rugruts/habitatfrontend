import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  CreditCard, 
  RefreshCw,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { supabaseHelpers } from '@/lib/supabase';
import { centsToEUR } from '@/lib/api';

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  source: 'direct' | 'airbnb' | 'booking_com';
  created_at: string;
  payment_intent_id?: string;
  id_verified?: boolean;
  cleaned?: boolean;
  special_requests?: string;
  notes?: string;
  properties?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface BookingFilters {
  status: string;
  paymentStatus: string;
  source: string;
  dateRange: string;
  search: string;
}

interface BookingManagementProps {
  onBookingUpdate?: (booking: Booking) => void;
  onBookingDelete?: (bookingId: string) => void;
}

const BookingManagement: React.FC<BookingManagementProps> = ({
  onBookingUpdate,
  onBookingDelete
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'info' | 'warning'} | null>(null);

  const [filters, setFilters] = useState<BookingFilters>({
    status: 'all',
    paymentStatus: 'all',
    source: 'all',
    dateRange: 'all',
    search: ''
  });

  const [editForm, setEditForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    check_in: '',
    check_out: '',
    guests: 2,
    total_amount: 0,
    status: 'confirmed' as 'pending' | 'confirmed' | 'cancelled' | 'completed',
    notes: ''
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && selectedBookings.size > 0) {
        event.preventDefault();
        // Call bulk delete directly here to avoid dependency issues
        if (selectedBookings.size === 0) return;

        const count = selectedBookings.size;
        if (!confirm(`Are you sure you want to delete ${count} selected booking${count > 1 ? 's' : ''}?`)) {
          return;
        }

        // Trigger bulk delete
        supabase
          .from('bookings')
          .delete()
          .in('id', Array.from(selectedBookings))
          .then(({ error }) => {
            if (error) {
              console.error('🗑️ Bulk delete error:', error);
              alert(`Failed to delete bookings: ${error.message}`);
            } else {
              console.log('✅ Bulk delete successful');
              setSelectedBookings(new Set());
              setBookings(prev => prev.filter(booking => !selectedBookings.has(booking.id)));
              setNotification({
                message: `${count} booking${count > 1 ? 's' : ''} deleted successfully`,
                type: 'warning'
              });
            }
          });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedBookings]);

  // Fetch bookings and set up real-time subscription
  useEffect(() => {
    fetchBookings();

    // Set up real-time subscription for bookings
    const subscription = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('📡 Real-time booking change received:', payload);

          if (payload.eventType === 'INSERT') {
            // Add new booking
            console.log('📡 Adding new booking to UI:', payload.new.id);
            setBookings(prev => [payload.new as Booking, ...prev]);
            setNotification({
              message: `New booking received from ${(payload.new as Booking).customer_name}`,
              type: 'success'
            });
          } else if (payload.eventType === 'UPDATE') {
            // Update existing booking
            console.log('📡 Updating booking in UI:', payload.new.id);
            setBookings(prev =>
              prev.map(booking =>
                booking.id === payload.new.id ? payload.new as Booking : booking
              )
            );
            setNotification({
              message: `Booking ${(payload.new as Booking).id.slice(-6)} updated`,
              type: 'info'
            });
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted booking
            console.log('📡 Removing booking from UI:', payload.old.id);
            setBookings(prev => {
              const filtered = prev.filter(booking => booking.id !== payload.old.id);
              console.log('📡 Bookings before filter:', prev.length, 'after filter:', filtered.length);
              return filtered;
            });
            setNotification({
              message: `Booking ${payload.old.id.slice(-6)} deleted`,
              type: 'warning'
            });
          }

          // Auto-hide notification after 3 seconds
          setTimeout(() => setNotification(null), 3000);
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
      });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await supabaseHelpers.getAllBookings();
      setBookings(response.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = React.useCallback(() => {
    let filtered = [...bookings];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    // Payment status filter
    if (filters.paymentStatus !== 'all') {
      filtered = filtered.filter(booking => booking.payment_status === filters.paymentStatus);
    }

    // Source filter
    if (filters.source !== 'all') {
      filtered = filtered.filter(booking => booking.source === filters.source);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const today = new Date();
      const filterDate = new Date();

      switch (filters.dateRange) {
        case 'today':
          filtered = filtered.filter(booking =>
            booking.check_in === today.toISOString().split('T')[0] ||
            booking.check_out === today.toISOString().split('T')[0]
          );
          break;
        case 'week':
          filterDate.setDate(today.getDate() + 7);
          filtered = filtered.filter(booking =>
            new Date(booking.check_in) <= filterDate && new Date(booking.check_out) >= today
          );
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() + 1);
          filtered = filtered.filter(booking =>
            new Date(booking.check_in) <= filterDate && new Date(booking.check_out) >= today
          );
          break;
      }
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.customer_name.toLowerCase().includes(searchLower) ||
        booking.customer_email.toLowerCase().includes(searchLower) ||
        booking.properties?.name.toLowerCase().includes(searchLower) ||
        booking.id.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, filters]);

  // Apply filters when bookings or filters change
  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-orange-100 text-orange-800 border-orange-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      refunded: 'bg-purple-100 text-purple-800 border-purple-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSourceBadge = (source: string) => {
    const variants = {
      direct: 'bg-green-100 text-green-800 border-green-200',
      airbnb: 'bg-red-100 text-red-800 border-red-200',
      booking_com: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return variants[source as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsDialog(true);
  };

  const handleEditBooking = (booking: Booking) => {
    console.log('🔧 Edit booking clicked:', booking.id);
    setSelectedBooking(booking);
    setEditForm({
      customer_name: booking.customer_name,
      customer_email: booking.customer_email,
      customer_phone: booking.customer_phone || '',
      check_in: booking.check_in,
      check_out: booking.check_out,
      guests: booking.guests,
      total_amount: booking.total_amount / 100, // Convert cents to euros for display
      status: booking.status,
      notes: booking.special_requests || '' // Use special_requests field
    });
    setShowEditDialog(true);
    console.log('🔧 Edit dialog should be open now');
  };

  const handleSaveEdit = async () => {
    if (!selectedBooking) {
      console.error('💾 No selected booking to save');
      return;
    }

    try {
      console.log('💾 Attempting to save booking changes:', selectedBooking.id);
      console.log('💾 Edit form data:', editForm);

      // Update booking in Supabase
      const { data, error } = await supabase
        .from('bookings')
        .update({
          customer_name: editForm.customer_name,
          customer_email: editForm.customer_email,
          customer_phone: editForm.customer_phone,
          check_in: editForm.check_in,
          check_out: editForm.check_out,
          guests: editForm.guests,
          total_amount: Math.round(editForm.total_amount * 100), // Convert to cents
          subtotal: Math.round(editForm.total_amount * 100), // Also update subtotal
          status: editForm.status,
          special_requests: editForm.notes, // Map notes to special_requests
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedBooking.id)
        .select()
        .single();

      if (error) {
        console.error('💾 Supabase update error:', error);
        throw error;
      }

      console.log('✅ Booking updated successfully:', data);

      // Update local state immediately for instant UI feedback
      setBookings(prev => prev.map(booking =>
        booking.id === selectedBooking.id ? { ...booking, ...data } : booking
      ));

      if (onBookingUpdate) {
        onBookingUpdate(data);
      }

      setShowEditDialog(false);

      // Show success notification
      setNotification({
        message: `Booking ${data.id.slice(-6)} updated successfully`,
        type: 'success'
      });

      // Real-time subscription will also handle the update as backup
    } catch (error) {
      console.error('❌ Error updating booking:', error);
      alert(`Failed to update booking: ${error.message}`);
    }
  };

  // Quick status change function
  const handleQuickStatusChange = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      console.log(`Booking ${bookingId} status updated to ${newStatus}`);
      // Real-time subscription will handle the UI update
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  // Bulk selection functions
  const handleSelectBooking = (bookingId: string, checked: boolean) => {
    setSelectedBookings(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(bookingId);
      } else {
        newSet.delete(bookingId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBookings(new Set(filteredBookings.map(booking => booking.id)));
    } else {
      setSelectedBookings(new Set());
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBookings.size === 0) return;

    const count = selectedBookings.size;
    if (!confirm(`Are you sure you want to delete ${count} selected booking${count > 1 ? 's' : ''}?`)) {
      return;
    }

    try {
      console.log('🗑️ Bulk deleting bookings:', Array.from(selectedBookings));

      // Delete all selected bookings
      const { error } = await supabase
        .from('bookings')
        .delete()
        .in('id', Array.from(selectedBookings));

      if (error) {
        console.error('🗑️ Bulk delete error:', error);
        throw error;
      }

      console.log('✅ Bulk delete successful');

      // Clear selection
      setSelectedBookings(new Set());

      // Manual state update as fallback
      setBookings(prev => prev.filter(booking => !selectedBookings.has(booking.id)));

      setNotification({
        message: `${count} booking${count > 1 ? 's' : ''} deleted successfully`,
        type: 'warning'
      });

    } catch (error) {
      console.error('❌ Bulk delete error:', error);
      alert(`Failed to delete bookings: ${error.message}`);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    console.log('🗑️ Delete booking clicked:', bookingId);
    if (!confirm('Are you sure you want to delete this booking?')) {
      console.log('🗑️ Delete cancelled by user');
      return;
    }

    try {
      console.log('🗑️ Attempting to delete booking from Supabase...');
      // Delete booking from Supabase
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) {
        console.error('🗑️ Supabase delete error:', error);
        throw error;
      }

      console.log('✅ Booking deleted successfully:', bookingId);

      if (onBookingDelete) {
        onBookingDelete(bookingId);
      }

      // Real-time subscription will handle the UI update
      // But also manually remove from state as fallback
      console.log('🔄 Manually removing booking from state as fallback...');
      setBookings(prev => {
        const filtered = prev.filter(booking => booking.id !== bookingId);
        console.log('🔄 Manual removal: before:', prev.length, 'after:', filtered.length);
        return filtered;
      });
    } catch (error) {
      console.error('❌ Error deleting booking:', error);
      alert(`Failed to delete booking: ${error.message}`);
    }
  };

  const handleSendConfirmation = (booking: Booking) => {
    // In a real implementation, trigger email sending
    console.log('Sending confirmation email to:', booking.customer_email);
  };

  const handleRefund = (booking: Booking) => {
    // In a real implementation, process refund via Stripe
    console.log('Processing refund for booking:', booking.id);
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      paymentStatus: 'all',
      source: 'all',
      dateRange: 'all',
      search: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Real-time notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border ${
          notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          notification.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
          'bg-yellow-50 border-yellow-200 text-yellow-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <CheckCircle className="h-4 w-4" />}
            {notification.type === 'info' && <AlertCircle className="h-4 w-4" />}
            {notification.type === 'warning' && <XCircle className="h-4 w-4" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Bulk Selection Info */}
      {selectedBookings.size > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedBookings.size} booking{selectedBookings.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleBulkDelete}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
              <Button
                onClick={() => setSelectedBookings(new Set())}
                variant="outline"
                size="sm"
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <Label className="text-sm">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Name, email, ID..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm">Payment</Label>
              <Select value={filters.paymentStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, paymentStatus: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm">Source</Label>
              <Select value={filters.source} onValueChange={(value) => setFilters(prev => ({ ...prev, source: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="airbnb">Airbnb</SelectItem>
                  <SelectItem value="booking_com">Booking.com</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm">Date Range</Label>
              <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Next 7 Days</SelectItem>
                  <SelectItem value="month">Next 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={resetFilters} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Bookings ({filteredBookings.length})
              {selectedBookings.size > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({selectedBookings.size} selected)
                </span>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedBookings.size > 0 && (
                <Button
                  onClick={handleBulkDelete}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedBookings.size})
                </Button>
              )}
              <Button onClick={fetchBookings} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading bookings...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedBookings.size === filteredBookings.length && filteredBookings.length > 0}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all bookings"
                      />
                    </TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedBookings.has(booking.id)}
                          onCheckedChange={(checked) => handleSelectBooking(booking.id, checked as boolean)}
                          aria-label={`Select booking ${booking.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.customer_name}</p>
                          <p className="text-sm text-gray-600">{booking.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.properties?.name}</p>
                          <p className="text-sm text-gray-600">{booking.guests} guests</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{new Date(booking.check_in).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">to {new Date(booking.check_out).toLocaleDateString()}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold">{centsToEUR(booking.total_amount)}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusBadge(booking.payment_status)}>
                          {booking.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSourceBadge(booking.source)}>
                          {booking.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(booking)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditBooking(booking)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBooking(booking.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Guest Information */}
              <div>
                <h3 className="font-semibold mb-3">Guest Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="font-medium">{selectedBooking.customer_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm">{selectedBooking.customer_email}</p>
                  </div>
                  {selectedBooking.customer_phone && (
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm">{selectedBooking.customer_phone}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium">ID Verification</Label>
                    <div className="flex items-center gap-2">
                      {selectedBooking.id_verified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">
                        {selectedBooking.id_verified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Booking Details */}
              <div>
                <h3 className="font-semibold mb-3">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Property</Label>
                    <p className="font-medium">{selectedBooking.properties?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Guests</Label>
                    <p>{selectedBooking.guests}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Check-in</Label>
                    <p>{new Date(selectedBooking.check_in).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Check-out</Label>
                    <p>{new Date(selectedBooking.check_out).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={getStatusBadge(selectedBooking.status)}>
                      {selectedBooking.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Source</Label>
                    <Badge className={getSourceBadge(selectedBooking.source)}>
                      {selectedBooking.source}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Information */}
              <div>
                <h3 className="font-semibold mb-3">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Total Amount</Label>
                    <p className="font-semibold text-lg">{centsToEUR(selectedBooking.total_amount)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Payment Status</Label>
                    <Badge className={getPaymentStatusBadge(selectedBooking.payment_status)}>
                      {selectedBooking.payment_status}
                    </Badge>
                  </div>
                  {selectedBooking.payment_intent_id && (
                    <div className="col-span-2">
                      <Label className="text-sm font-medium">Payment ID</Label>
                      <p className="text-sm font-mono">{selectedBooking.payment_intent_id}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedBooking.notes && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium">Notes</Label>
                    <p className="text-sm mt-1">{selectedBooking.notes}</p>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleSendConfirmation(selectedBooking)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Confirmation
                </Button>
                {selectedBooking.payment_status === 'paid' && (
                  <Button variant="outline" onClick={() => handleRefund(selectedBooking)}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Process Refund
                  </Button>
                )}
                <Button onClick={() => handleEditBooking(selectedBooking)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Guest Name</Label>
              <Input
                value={editForm.customer_name}
                onChange={(e) => setEditForm(prev => ({ ...prev, customer_name: e.target.value }))}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.customer_email}
                onChange={(e) => setEditForm(prev => ({ ...prev, customer_email: e.target.value }))}
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                value={editForm.customer_phone}
                onChange={(e) => setEditForm(prev => ({ ...prev, customer_phone: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Check-in</Label>
                <Input
                  type="date"
                  value={editForm.check_in}
                  onChange={(e) => setEditForm(prev => ({ ...prev, check_in: e.target.value }))}
                />
              </div>
              <div>
                <Label>Check-out</Label>
                <Input
                  type="date"
                  value={editForm.check_out}
                  onChange={(e) => setEditForm(prev => ({ ...prev, check_out: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Guests</Label>
                <Select value={editForm.guests.toString()} onValueChange={(value) => setEditForm(prev => ({ ...prev, guests: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={editForm.status} onValueChange={(value: 'pending' | 'confirmed' | 'cancelled' | 'completed') => setEditForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Total Amount (€)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={editForm.total_amount}
                onChange={(e) => setEditForm(prev => ({ ...prev, total_amount: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={editForm.notes}
                onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingManagement;
