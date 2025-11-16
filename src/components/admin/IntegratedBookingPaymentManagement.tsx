import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  AlertTriangle,
  DollarSign,
  Building2,
  User,
  Calendar,
  Copy,
  Euro
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { supabaseHelpers } from '@/lib/supabase';
import { centsToEUR } from '@/lib/api';
import { sepaPaymentService, type SEPAPayment } from '@/services/SEPAPaymentService';
import { cashOnArrivalService, type CashOnArrivalPayment } from '@/services/CashOnArrivalService';
import { paymentEmailService } from '@/lib/payment-email-service';

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

interface PendingPayment {
  id: string;
  bookingId: string;
  referenceCode: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  createdAt: string;
  type: 'sepa' | 'cash';
  paymentData: SEPAPayment | CashOnArrivalPayment;
  expiresAt?: string;
}

export const IntegratedBookingPaymentManagement: React.FC = () => {
  // Booking management state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(true);
  const [bookingNotification, setBookingNotification] = useState<{message: string; type: 'success' | 'info' | 'warning'} | null>(null);

  // Payment approval state
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState<string>('');
  const [paymentStats, setPaymentStats] = useState({
    totalPending: 0,
    sepaCount: 0,
    cashCount: 0,
    totalAmount: 0
  });

  // Filters
  const [filters, setFilters] = useState<BookingFilters>({
    status: 'all',
    paymentStatus: 'pending',
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

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setBookingLoading(true);
      const response = await supabaseHelpers.getAllBookings();
      setBookings(response.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setBookingLoading(false);
    }
  };

  // Load pending payments
  const loadPendingPayments = async () => {
    try {
      setPaymentLoading(true);
      setPaymentError('');

      // Get pending SEPA payments
      const sepaPayments = await sepaPaymentService.getPendingSEPAPayments();
      
      // Get pending cash payments
      const cashPayments = await cashOnArrivalService.getPendingCashPayments();

      // Combine and format payments
      const allPayments: PendingPayment[] = [];

      // Process SEPA payments
      for (const sepa of sepaPayments) {
        try {
          // Get booking details
          const bookings = await supabaseHelpers.getAllBookings(1, 0, { booking_id: sepa.booking_id });
          const booking = bookings.bookings?.[0];
          
          if (booking) {
            allPayments.push({
              id: sepa.id,
              bookingId: sepa.booking_id,
              referenceCode: sepa.reference_code,
              amount: sepa.amount,
              currency: sepa.currency,
              customerName: sepa.customer_info.name,
              customerEmail: sepa.customer_info.email,
              propertyName: booking.properties?.name || 'Unknown Property',
              checkIn: booking.check_in,
              checkOut: booking.check_out,
              guests: booking.guests,
              createdAt: sepa.created_at,
              type: 'sepa',
              paymentData: sepa,
              expiresAt: sepa.expires_at
            });
          }
        } catch (err) {
          console.warn('Failed to load booking for SEPA payment:', sepa.id, err);
        }
      }

      // Process cash payments
      for (const cash of cashPayments) {
        try {
          // Get booking details
          const bookings = await supabaseHelpers.getAllBookings(1, 0, { booking_id: cash.booking_id });
          const booking = bookings.bookings?.[0];
          
          if (booking) {
            allPayments.push({
              id: cash.id,
              bookingId: cash.booking_id,
              referenceCode: cash.reference_code,
              amount: cash.amount,
              currency: cash.currency,
              customerName: cash.customer_info.name,
              customerEmail: cash.customer_info.email,
              propertyName: booking.properties?.name || 'Unknown Property',
              checkIn: booking.check_in,
              checkOut: booking.check_out,
              guests: booking.guests,
              createdAt: cash.created_at,
              type: 'cash',
              paymentData: cash
            });
          }
        } catch (err) {
          console.warn('Failed to load booking for cash payment:', cash.id, err);
        }
      }

      // Sort by creation date (newest first)
      allPayments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setPendingPayments(allPayments);

      // Calculate stats
      const stats = {
        totalPending: allPayments.length,
        sepaCount: allPayments.filter(p => p.type === 'sepa').length,
        cashCount: allPayments.filter(p => p.type === 'cash').length,
        totalAmount: allPayments.reduce((sum, p) => sum + p.amount, 0)
      };
      setPaymentStats(stats);

    } catch (err) {
      console.error('Error loading pending payments:', err);
      setPaymentError(err instanceof Error ? err.message : 'Failed to load pending payments');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Apply filters
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

  // Initialize data
  useEffect(() => {
    fetchBookings();
    loadPendingPayments();
  }, []);

  // Get status badge styles
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

  // Booking management functions
  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsDialog(true);
  };

  const handleEditBooking = (booking: Booking) => {
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
  };

  const handleSaveEdit = async () => {
    if (!selectedBooking) {
      console.error('No selected booking to save');
      return;
    }

    try {
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
          status: editForm.status,
          special_requests: editForm.notes, // Map notes to special_requests
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedBooking.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      // Update local state
      setBookings(prev => prev.map(booking =>
        booking.id === selectedBooking.id ? { ...booking, ...data } : booking
      ));

      setShowEditDialog(false);
      setBookingNotification({
        message: `Booking updated successfully`,
        type: 'success'
      });

    } catch (error) {
      console.error('Error updating booking:', error);
      alert(`Failed to update booking: ${error.message}`);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      // Delete booking from Supabase
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      // Update local state
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert(`Failed to delete booking: ${error.message}`);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBookings.size === 0) return;

    const count = selectedBookings.size;
    if (!confirm(`Are you sure you want to delete ${count} selected booking${count > 1 ? 's' : ''}?`)) {
      return;
    }

    try {
      // Delete all selected bookings
      const { error } = await supabase
        .from('bookings')
        .delete()
        .in('id', Array.from(selectedBookings));

      if (error) {
        console.error('Bulk delete error:', error);
        throw error;
      }

      // Clear selection
      setSelectedBookings(new Set());

      // Update local state
      setBookings(prev => prev.filter(booking => !selectedBookings.has(booking.id)));

      setBookingNotification({
        message: `${count} booking${count > 1 ? 's' : ''} deleted successfully`,
        type: 'warning'
      });

    } catch (error) {
      console.error('Bulk delete error:', error);
      alert(`Failed to delete bookings: ${error.message}`);
    }
  };

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

  // Payment approval functions
  const approvePayment = async (payment: PendingPayment) => {
    try {
      setProcessing(payment.id);
      setPaymentError('');
      setPaymentSuccess('');

      const adminUser = 'Admin';

      // Confirm payment based on type
      if (payment.type === 'sepa') {
        await sepaPaymentService.confirmSEPAPayment(payment.referenceCode, adminUser);
      } else {
        await cashOnArrivalService.confirmCashPayment(payment.referenceCode, adminUser);
      }

      // Update booking status to confirmed
      await supabaseHelpers.updateBookingStatus(payment.bookingId, 'confirmed');

      // Send confirmation email
      const emailData = {
        bookingId: payment.bookingId,
        guestName: payment.customerName,
        guestEmail: payment.customerEmail,
        propertyName: payment.propertyName,
        checkIn: payment.checkIn,
        checkOut: payment.checkOut,
        guests: payment.guests,
        totalAmount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.type as 'sepa' | 'cash_on_arrival',
        ...(payment.type === 'sepa' && {
          sepaData: {
            referenceCode: payment.referenceCode,
            iban: (payment.paymentData as SEPAPayment).iban_info?.iban || 'N/A',
            bic: (payment.paymentData as SEPAPayment).iban_info?.bic || 'N/A',
            accountHolder: (payment.paymentData as SEPAPayment).iban_info?.account_holder || 'N/A',
            bankName: (payment.paymentData as SEPAPayment).iban_info?.bank_name || 'N/A',
            paymentDeadline: payment.expiresAt || ''
          }
        }),
        ...(payment.type === 'cash' && {
          cashData: {
            referenceCode: payment.referenceCode,
            checkInTime: (payment.paymentData as CashOnArrivalPayment).check_in_time,
            paymentLocation: (payment.paymentData as CashOnArrivalPayment).payment_location
          }
        })
      };

      const emailSent = await paymentEmailService.sendPaymentBookingEmail(emailData, 'received');
      
      if (emailSent) {
        setPaymentSuccess(`Payment approved and confirmation email sent to ${payment.customerEmail}`);
      } else {
        setPaymentSuccess(`Payment approved successfully, but email sending failed. Please contact the customer manually.`);
      }

      // Reload payments
      await loadPendingPayments();

    } catch (err) {
      console.error('Error approving payment:', err);
      setPaymentError(err instanceof Error ? err.message : 'Failed to approve payment');
    } finally {
      setProcessing(null);
    }
  };

  const cancelPayment = async (payment: PendingPayment) => {
    try {
      setProcessing(payment.id);
      setPaymentError('');
      setPaymentSuccess('');

      // Cancel payment based on type
      if (payment.type === 'sepa') {
        await sepaPaymentService.cancelSEPAPayment(payment.referenceCode);
      } else {
        await cashOnArrivalService.cancelCashPayment(payment.referenceCode);
      }

      // Update booking status to cancelled
      await supabaseHelpers.updateBookingStatus(payment.bookingId, 'cancelled');

      setPaymentSuccess(`Payment cancelled for booking ${payment.bookingId}`);
      
      // Reload payments
      await loadPendingPayments();

    } catch (err) {
      console.error('Error cancelling payment:', err);
      setPaymentError(err instanceof Error ? err.message : 'Failed to cancel payment');
    } finally {
      setProcessing(null);
    }
  };

  const copyReference = async (referenceCode: string) => {
    try {
      await navigator.clipboard.writeText(referenceCode);
      setPaymentSuccess('Reference code copied to clipboard');
      setTimeout(() => setPaymentSuccess(''), 2000);
    } catch (err) {
      console.warn('Failed to copy to clipboard:', err);
    }
  };

  const isExpired = (payment: PendingPayment): boolean => {
    if (payment.type === 'sepa' && payment.expiresAt) {
      return new Date() > new Date(payment.expiresAt);
    }
    return false;
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      paymentStatus: 'pending',
      source: 'all',
      dateRange: 'all',
      search: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Pending Bookings Approvals</h1>
          <p className="text-gray-600">Manage pending payments and bookings in one place</p>
        </div>
        <Button onClick={() => { fetchBookings(); loadPendingPayments(); }}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{paymentStats.totalPending}</div>
            <div className="text-sm text-gray-600">Pending Payments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{paymentStats.sepaCount}</div>
            <div className="text-sm text-gray-600">SEPA Transfers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Euro className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{paymentStats.cashCount}</div>
            <div className="text-sm text-gray-600">Cash Payments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">€{paymentStats.totalAmount.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total Amount</div>
          </CardContent>
        </Card>
      </div>

      {/* Error/Success Messages */}
      {(paymentError || bookingNotification || paymentSuccess) && (
        <div className="space-y-2">
          {paymentError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{paymentError}</AlertDescription>
            </Alert>
          )}
          
          {paymentSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{paymentSuccess}</AlertDescription>
            </Alert>
          )}
          
          {bookingNotification && (
            <Alert className={bookingNotification.type === 'success' ? 'border-green-200 bg-green-50' : 
                             bookingNotification.type === 'info' ? 'border-blue-200 bg-blue-50' : 
                             'border-yellow-200 bg-yellow-50'}>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className={bookingNotification.type === 'success' ? 'text-green-800' : 
                                           bookingNotification.type === 'info' ? 'text-blue-800' : 
                                           'text-yellow-800'}>
                {bookingNotification.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Payment Approvals Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Pending Payment Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading pending payments...</p>
            </div>
          ) : pendingPayments.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Pending Payments</h3>
              <p className="text-gray-600">All payments have been processed!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <Card key={payment.id} className={`${isExpired(payment) ? 'border-red-200 bg-red-50' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {payment.type === 'sepa' ? (
                            <Building2 className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Euro className="h-5 w-5 text-green-600" />
                          )}
                          {payment.propertyName}
                          {isExpired(payment) && (
                            <Badge variant="destructive">Expired</Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant={payment.type === 'sepa' ? 'default' : 'secondary'}>
                            {payment.type === 'sepa' ? 'SEPA Transfer' : 'Cash on Arrival'}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            Created {new Date(payment.createdAt).toLocaleDateString()}
                          </span>
                          {payment.expiresAt && (
                            <span className={`text-sm ${isExpired(payment) ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                              Expires {new Date(payment.expiresAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          €{payment.amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">{payment.currency}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{payment.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{payment.customerEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {new Date(payment.checkIn).toLocaleDateString()} - {new Date(payment.checkOut).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{payment.guests} guests</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Booking ID:</span>
                          <span className="text-sm font-mono">{payment.bookingId}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Reference:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono">{payment.referenceCode}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyReference(payment.referenceCode)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {payment.type === 'sepa' && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">IBAN:</span>
                              <span className="text-sm font-mono">
                                {(payment.paymentData as SEPAPayment).iban_info?.iban || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">BIC:</span>
                              <span className="text-sm font-mono">
                                {(payment.paymentData as SEPAPayment).iban_info?.bic || 'N/A'}
                              </span>
                            </div>
                          </>
                        )}
                        {payment.type === 'cash' && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Check-in Time:</span>
                              <span className="text-sm">
                                {(payment.paymentData as CashOnArrivalPayment).check_in_time}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Payment Location:</span>
                              <span className="text-sm">
                                {(payment.paymentData as CashOnArrivalPayment).payment_location}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        onClick={() => approvePayment(payment)}
                        disabled={processing === payment.id}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {processing === payment.id ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve Payment
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => cancelPayment(payment)}
                        disabled={processing === payment.id}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
          {bookingLoading ? (
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
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Confirmation
                </Button>
                {selectedBooking.payment_status === 'paid' && (
                  <Button variant="outline">
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
            <DialogDescription>
              Update booking details and guest information.
            </DialogDescription>
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

export default IntegratedBookingPaymentManagement;
