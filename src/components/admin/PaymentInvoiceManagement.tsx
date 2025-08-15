import React, { useState, useEffect } from 'react';
import { supabase, supabaseHelpers } from '@/lib/supabase';
import { paymentService } from '@/lib/payment-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { InvoicePDFViewer } from './InvoicePDFViewer';
import {
  CreditCard,
  DollarSign,
  FileText,
  Download,
  RefreshCw,
  Search,
  Filter,
  Eye,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Send,
  Printer,
  Mail
} from 'lucide-react';
import { centsToEUR } from '@/lib/api';

interface Payment {
  id: string;
  booking_id: string;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'refunded';
  payment_method: string;
  created_at: string;
  refunded_amount?: number;
  guest_name: string;
  guest_email: string;
  property_name: string;
}

interface Invoice {
  id: string;
  booking_id: string;
  invoice_number: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'canceled';
  issued_date: string;
  due_date: string;
  pdf_url?: string;
  elorus_id?: string;
  stripe_invoice_id?: string;
  guest_name: string;
  guest_email: string;
  property_name: string;
}

interface RefundRequest {
  payment_id: string;
  amount: number;
  reason: string;
}

const PaymentInvoiceManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('payments');

  const [paymentFilters, setPaymentFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all'
  });

  const [invoiceFilters, setInvoiceFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all'
  });

  const [refundForm, setRefundForm] = useState<RefundRequest>({
    payment_id: '',
    amount: 0,
    reason: ''
  });

  // PDF Viewer state
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [selectedInvoiceForPDF, setSelectedInvoiceForPDF] = useState<{
    invoiceId: string;
    invoiceNumber: string;
    invoiceData?: {
      customer_name: string;
      customer_email: string;
      property_name: string;
      amount: number;
      tax_amount: number;
      total_amount: number;
      issued_date: string;
      due_date: string;
      status: string;
      booking?: {
        check_in: string;
        check_out: string;
        guests: number;
      };
    };
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyPaymentFilters();
  }, [payments, paymentFilters]);

  useEffect(() => {
    applyInvoiceFilters();
  }, [invoices, invoiceFilters]);

  const syncPaymentsFromStripe = async () => {
    try {
      console.log('🔄 Syncing payments from Stripe...');

      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Call your backend API to sync Stripe payments
      const response = await fetch(`${import.meta.env.VITE_EMAIL_API_URL}/admin/sync-stripe-payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to sync payments from Stripe');
      }

      const result = await response.json();
      console.log('✅ Stripe payments synced:', result);

      return result;
    } catch (error) {
      console.error('❌ Error syncing Stripe payments:', error);
      // Don't throw - continue with existing data
    }
  };

  const syncInvoicesFromStripe = async () => {
    try {
      console.log('🔄 Syncing invoices from Stripe...');

      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Call your backend API to sync Stripe invoices
      const response = await fetch(`${import.meta.env.VITE_EMAIL_API_URL}/admin/sync-stripe-invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to sync invoices from Stripe');
      }

      const result = await response.json();
      console.log('✅ Stripe invoices synced:', result);

      return result;
    } catch (error) {
      console.error('❌ Error syncing Stripe invoices:', error);
      // Don't throw - continue with existing data
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // Sync payments from Stripe first
      await syncPaymentsFromStripe();

      // Then fetch from Supabase (which now has the latest Stripe data)
      const { payments: fetchedPayments, total: paymentsTotal } = await supabaseHelpers.getAllPayments(50, 0, {
        status: paymentFilters.status !== 'all' ? paymentFilters.status : undefined
      });

      // Transform payment data to match component interface
      const transformedPayments: Payment[] = (fetchedPayments || []).map(payment => ({
        id: payment.id,
        booking_id: payment.booking_id || '',
        stripe_payment_intent_id: payment.stripe_payment_intent_id || '',
        amount: Math.round(payment.amount * 100), // Convert to cents
        currency: payment.currency,
        status: payment.status as any,
        payment_method: payment.payment_method as any,
        created_at: payment.created_at,
        // Use booking data if available, otherwise show as direct payment
        guest_name: payment.bookings?.customer_name || 'Direct Payment (No Booking)',
        guest_email: payment.bookings?.customer_email || '',
        property_name: payment.bookings?.properties?.name || 'Direct Payment'
      }));

      setPayments(transformedPayments);

      // Sync invoices from Stripe
      await syncInvoicesFromStripe();

      // Fetch invoices from Supabase (which now has the latest Stripe data)
      const { invoices: fetchedInvoices, total: invoicesTotal } = await supabaseHelpers.getAllInvoices(50, 0, {
        status: invoiceFilters.status !== 'all' ? invoiceFilters.status : undefined
      });

      // Transform invoice data to match component interface
      const transformedInvoices: Invoice[] = (fetchedInvoices || []).map(invoice => ({
        id: invoice.id,
        booking_id: invoice.booking_id || '',
        invoice_number: invoice.invoice_number || `INV-${invoice.id.slice(0, 8)}`,
        amount: Math.round(invoice.amount * 100), // Convert to cents
        tax_amount: Math.round(invoice.tax_amount * 100), // Convert to cents
        total_amount: Math.round(invoice.total_amount * 100), // Convert to cents
        status: invoice.status as any,
        issued_date: invoice.issued_date || new Date().toISOString().split('T')[0],
        due_date: invoice.due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        pdf_url: invoice.pdf_url,
        elorus_id: invoice.elorus_id,
        stripe_invoice_id: invoice.stripe_invoice_id,
        // Use booking data if available, otherwise fall back to Stripe invoice data
        guest_name: invoice.bookings?.customer_name || invoice.customer_name || 'Direct Invoice (No Booking)',
        guest_email: invoice.bookings?.customer_email || invoice.customer_email || '',
        property_name: invoice.bookings?.properties?.name || 'Direct Invoice'
      }));

      setInvoices(transformedInvoices);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to empty arrays on error
      setPayments([]);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const applyPaymentFilters = () => {
    let filtered = [...payments];

    if (paymentFilters.search) {
      const searchLower = paymentFilters.search.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.guest_name.toLowerCase().includes(searchLower) ||
        payment.guest_email.toLowerCase().includes(searchLower) ||
        payment.stripe_payment_intent_id.toLowerCase().includes(searchLower)
      );
    }

    if (paymentFilters.status !== 'all') {
      filtered = filtered.filter(payment => payment.status === paymentFilters.status);
    }

    setFilteredPayments(filtered);
  };

  const applyInvoiceFilters = () => {
    let filtered = [...invoices];

    if (invoiceFilters.search) {
      const searchLower = invoiceFilters.search.toLowerCase();
      filtered = filtered.filter(invoice =>
        invoice.guest_name.toLowerCase().includes(searchLower) ||
        invoice.guest_email.toLowerCase().includes(searchLower) ||
        invoice.invoice_number.toLowerCase().includes(searchLower)
      );
    }

    if (invoiceFilters.status !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === invoiceFilters.status);
    }

    setFilteredInvoices(filtered);
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      succeeded: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      canceled: 'bg-gray-100 text-gray-800 border-gray-200',
      refunded: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getInvoiceStatusBadge = (status: string) => {
    const variants = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      sent: 'bg-blue-100 text-blue-800 border-blue-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      overdue: 'bg-red-100 text-red-800 border-red-200',
      canceled: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return variants[status as keyof typeof variants] || variants.draft;
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentDialog(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDialog(true);
  };

  const handleRefund = (payment: Payment) => {
    setRefundForm({
      payment_id: payment.id,
      amount: payment.amount,
      reason: ''
    });
    setSelectedPayment(payment);
    setShowRefundDialog(true);
  };

  const processRefund = async () => {
    if (!selectedPayment) return;

    try {
      console.log('Processing refund:', refundForm);

      // Process refund through Stripe
      const result = await paymentService.processRefund({
        paymentId: selectedPayment.id,
        amount: refundForm.amount > 0 ? refundForm.amount / 100 : undefined, // Convert from cents
        reason: refundForm.reason,
        metadata: {
          processed_by: 'admin',
          processed_at: new Date().toISOString()
        }
      });

      if (result.success) {
        console.log('Refund processed successfully:', result.refund?.id);

        // Refresh data to show updated payment status
        await fetchData();

        // Close dialog and reset form
        setShowRefundDialog(false);
        setRefundForm({ payment_id: '', amount: 0, reason: '' });
        setSelectedPayment(null);
      } else {
        console.error('Refund failed:', result.error);
        // In a real app, you'd show an error message to the user
        alert(`Refund failed: ${result.error}`);
      }

    } catch (error) {
      console.error('Error processing refund:', error);
      alert('An error occurred while processing the refund');
    }
  };

  const downloadInvoice = (invoice: Invoice) => {
    if (invoice.pdf_url) {
      window.open(invoice.pdf_url, '_blank');
    }
  };

  const openPDFViewer = (invoice: Invoice) => {
    setSelectedInvoiceForPDF({
      invoiceId: invoice.stripe_invoice_id || invoice.id,
      invoiceNumber: invoice.invoice_number,
      invoiceData: {
        customer_name: invoice.guest_name,
        customer_email: invoice.guest_email,
        property_name: invoice.property_name,
        amount: invoice.amount,
        tax_amount: invoice.tax_amount,
        total_amount: invoice.total_amount,
        issued_date: invoice.issued_date,
        due_date: invoice.due_date,
        status: invoice.status,
        // We'll need to fetch booking details if available
        booking: invoice.booking_id ? {
          check_in: new Date().toISOString(), // Placeholder - we'll improve this
          check_out: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Placeholder
          guests: 2, // Placeholder
        } : undefined
      }
    });
    setShowPDFViewer(true);
  };

  const closePDFViewer = () => {
    setShowPDFViewer(false);
    setSelectedInvoiceForPDF(null);
  };

  const sendInvoice = async (invoice: Invoice) => {
    try {
      console.log('Sending invoice:', invoice.id, 'to:', invoice.guest_email);
      // In a real implementation, you would call your email API here
    } catch (error) {
      console.error('Error sending invoice:', error);
    }
  };

  const openStripePayment = (paymentIntentId: string) => {
    window.open(`https://dashboard.stripe.com/payments/${paymentIntentId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payments & Invoices</h2>
          <p className="text-gray-600">Manage payments, refunds, and invoice generation</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={async () => {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              const token = session?.access_token;
              const response = await fetch(`${import.meta.env.VITE_EMAIL_API_URL}/admin/test-payments`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });
              const result = await response.json();
              console.log('🧪 Test result:', result);
              alert(JSON.stringify(result, null, 2));
            } catch (error) {
              console.error('❌ Test error:', error);
              alert('Test failed: ' + error.message);
            }
          }}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Test Connection
          </Button>
          <Button variant="outline" onClick={async () => {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              const token = session?.access_token;
              const response = await fetch(`${import.meta.env.VITE_EMAIL_API_URL}/admin/test-booking-ids`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });
              const result = await response.json();
              console.log('🧪 Booking ID test result:', result);
              alert(JSON.stringify(result, null, 2));
            } catch (error) {
              console.error('❌ Booking ID test error:', error);
              alert('Booking ID test failed: ' + error.message);
            }
          }}>
            <Search className="h-4 w-4 mr-2" />
            Test Booking IDs
          </Button>
          <Button variant="outline" onClick={syncPaymentsFromStripe}>
            <CreditCard className="h-4 w-4 mr-2" />
            Sync Payments from Stripe
          </Button>
          <Button variant="outline" onClick={syncInvoicesFromStripe}>
            <FileText className="h-4 w-4 mr-2" />
            Sync Invoices from Stripe
          </Button>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Invoices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          {/* Payment Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Payment Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Guest, email, payment ID..."
                      value={paymentFilters.search}
                      onChange={(e) => setPaymentFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm">Status</Label>
                  <Select value={paymentFilters.status} onValueChange={(value) => setPaymentFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="succeeded">Succeeded</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">Date Range</Label>
                  <Select value={paymentFilters.dateRange} onValueChange={(value) => setPaymentFilters(prev => ({ ...prev, dateRange: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Payments ({filteredPayments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading payments...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guest</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{payment.guest_name}</p>
                              <p className="text-sm text-gray-600">{payment.guest_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{payment.property_name}</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-semibold">{centsToEUR(payment.amount)}</p>
                            {payment.refunded_amount && (
                              <p className="text-sm text-red-600">
                                Refunded: {centsToEUR(payment.refunded_amount)}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getPaymentStatusBadge(payment.status)}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{payment.stripe_payment_intent_id.slice(-8)}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openStripePayment(payment.stripe_payment_intent_id)}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{new Date(payment.created_at).toLocaleDateString()}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewPayment(payment)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {payment.status === 'succeeded' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRefund(payment)}
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              )}
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
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          {/* Invoice Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Invoice Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Guest, email, invoice number..."
                      value={invoiceFilters.search}
                      onChange={(e) => setInvoiceFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm">Status</Label>
                  <Select value={invoiceFilters.status} onValueChange={(value) => setInvoiceFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">Date Range</Label>
                  <Select value={invoiceFilters.dateRange} onValueChange={(value) => setInvoiceFilters(prev => ({ ...prev, dateRange: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoices Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Invoices ({filteredInvoices.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Issued Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <p className="font-mono font-medium">{invoice.invoice_number}</p>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{invoice.guest_name}</p>
                            <p className="text-sm text-gray-600">{invoice.guest_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{invoice.property_name}</p>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{centsToEUR(invoice.total_amount)}</p>
                            <p className="text-sm text-gray-600">
                              Tax: {centsToEUR(invoice.tax_amount)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getInvoiceStatusBadge(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{new Date(invoice.issued_date).toLocaleDateString()}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewInvoice(invoice)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {invoice.pdf_url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadInvoice(invoice)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            {invoice.stripe_invoice_id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openPDFViewer(invoice)}
                                title="View Stripe Invoice PDF"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => sendInvoice(invoice)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Details Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Payment Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold">{centsToEUR(selectedPayment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Currency:</span>
                      <span>{selectedPayment.currency.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getPaymentStatusBadge(selectedPayment.status)}>
                        {selectedPayment.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="capitalize">{selectedPayment.payment_method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span>{new Date(selectedPayment.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Guest Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span>{selectedPayment.guest_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{selectedPayment.guest_email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property:</span>
                      <span>{selectedPayment.property_name}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Stripe Information</h3>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-mono text-sm">{selectedPayment.stripe_payment_intent_id}</p>
                    <p className="text-xs text-gray-600">Payment Intent ID</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openStripePayment(selectedPayment.stripe_payment_intent_id)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View in Stripe
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {selectedPayment.status === 'succeeded' && (
                  <Button onClick={() => handleRefund(selectedPayment)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Process Refund
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Refund Amount</Label>
              <Input
                type="number"
                value={refundForm.amount}
                onChange={(e) => setRefundForm(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                placeholder="Amount in cents"
              />
              <p className="text-xs text-gray-500 mt-1">
                {centsToEUR(refundForm.amount)} (Max: {selectedPayment ? centsToEUR(selectedPayment.amount) : '€0.00'})
              </p>
            </div>

            <div>
              <Label>Reason for Refund</Label>
              <Select value={refundForm.reason} onValueChange={(value) => setRefundForm(prev => ({ ...prev, reason: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="requested_by_customer">Requested by customer</SelectItem>
                  <SelectItem value="duplicate">Duplicate payment</SelectItem>
                  <SelectItem value="fraudulent">Fraudulent</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
                Cancel
              </Button>
              <Button onClick={processRefund} disabled={!refundForm.reason || refundForm.amount <= 0}>
                Process Refund
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Modal */}
      {selectedInvoiceForPDF && (
        <InvoicePDFViewer
          isOpen={showPDFViewer}
          onClose={closePDFViewer}
          invoiceId={selectedInvoiceForPDF.invoiceId}
          invoiceNumber={selectedInvoiceForPDF.invoiceNumber}
          invoiceData={selectedInvoiceForPDF.invoiceData}
        />
      )}
    </div>
  );
};

export default PaymentInvoiceManagement;
