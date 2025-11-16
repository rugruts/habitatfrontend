import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Euro, 
  Building2, 
  User, 
  Calendar,
  CreditCard,
  RefreshCw,
  AlertTriangle,
  Copy,
  Mail,
  Phone
} from 'lucide-react';
import { sepaPaymentService, type SEPAPayment } from '@/services/SEPAPaymentService';
import { cashOnArrivalService, type CashOnArrivalPayment } from '@/services/CashOnArrivalService';
import { paymentEmailService } from '@/lib/payment-email-service';
import { supabaseHelpers } from '@/lib/supabase';

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

export const PaymentApprovalManagement: React.FC = () => {
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [stats, setStats] = useState({
    totalPending: 0,
    sepaCount: 0,
    cashCount: 0,
    totalAmount: 0
  });

  // Load pending payments
  const loadPendingPayments = async () => {
    try {
      setLoading(true);
      setError('');

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
      setStats(stats);

    } catch (err) {
      console.error('Error loading pending payments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load pending payments');
    } finally {
      setLoading(false);
    }
  };

  // Approve payment
  const approvePayment = async (payment: PendingPayment) => {
    try {
      setProcessing(payment.id);
      setError('');
      setSuccess('');

      const adminUser = 'Admin'; // You can get this from auth context

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
        setSuccess(`Payment approved and confirmation email sent to ${payment.customerEmail}`);
      } else {
        setSuccess(`Payment approved successfully, but email sending failed. Please contact the customer manually.`);
      }

      // Reload payments
      await loadPendingPayments();

    } catch (err) {
      console.error('Error approving payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to approve payment');
    } finally {
      setProcessing(null);
    }
  };

  // Cancel payment
  const cancelPayment = async (payment: PendingPayment) => {
    try {
      setProcessing(payment.id);
      setError('');
      setSuccess('');

      // Cancel payment based on type
      if (payment.type === 'sepa') {
        await sepaPaymentService.cancelSEPAPayment(payment.referenceCode);
      } else {
        await cashOnArrivalService.cancelCashPayment(payment.referenceCode);
      }

      // Update booking status to cancelled
      await supabaseHelpers.updateBookingStatus(payment.bookingId, 'cancelled');

      setSuccess(`Payment cancelled for booking ${payment.bookingId}`);
      
      // Reload payments
      await loadPendingPayments();

    } catch (err) {
      console.error('Error cancelling payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel payment');
    } finally {
      setProcessing(null);
    }
  };

  // Copy reference code
  const copyReference = async (referenceCode: string) => {
    try {
      await navigator.clipboard.writeText(referenceCode);
      setSuccess('Reference code copied to clipboard');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.warn('Failed to copy to clipboard:', err);
    }
  };

  // Check if payment is expired
  const isExpired = (payment: PendingPayment): boolean => {
    if (payment.type === 'sepa' && payment.expiresAt) {
      return new Date() > new Date(payment.expiresAt);
    }
    return false;
  };

  useEffect(() => {
    loadPendingPayments();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading pending payments...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Payment Approvals</h1>
          <p className="text-gray-600">Manage pending SEPA and cash on arrival payments</p>
        </div>
        <Button onClick={loadPendingPayments} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalPending}</div>
            <div className="text-sm text-gray-600">Total Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.sepaCount}</div>
            <div className="text-sm text-gray-600">SEPA Transfers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Euro className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.cashCount}</div>
            <div className="text-sm text-gray-600">Cash Payments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">€{stats.totalAmount.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total Amount</div>
          </CardContent>
        </Card>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Pending Payments List */}
      {pendingPayments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Pending Payments</h3>
            <p className="text-gray-600">All payments have been processed!</p>
          </CardContent>
        </Card>
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
    </div>
  );
};

export default PaymentApprovalManagement;