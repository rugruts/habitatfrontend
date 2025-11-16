import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X, Loader2, AlertCircle, FileText } from 'lucide-react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { CustomInvoiceDocument, type InvoiceData } from './CustomInvoicePDF';
import { supabase } from '@/lib/supabase';

interface InvoicePDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
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
}

export const InvoicePDFViewer: React.FC<InvoicePDFViewerProps> = ({
  isOpen,
  onClose,
  invoiceId,
  invoiceNumber,
  invoiceData
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<InvoiceData | null>(null);

  const prepareInvoiceData = React.useCallback(async () => {
    if (!invoiceData || !isOpen) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Preparing custom invoice PDF for:', invoiceNumber);

      // Calculate nights between check-in and check-out
      const checkIn = new Date(invoiceData.booking?.check_in || new Date());
      const checkOut = new Date(invoiceData.booking?.check_out || new Date());
      const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));

      const customInvoiceData: InvoiceData = {
        invoiceNumber: invoiceNumber,
        issueDate: invoiceData.issued_date || new Date().toISOString(),
        dueDate: invoiceData.due_date || new Date().toISOString(),
        customer: {
          name: invoiceData.customer_name || 'Guest',
          email: invoiceData.customer_email || '',
        },
        property: {
          name: invoiceData.property_name || 'Accommodation',
          address: 'Thessaloniki, Greece', // You can make this dynamic later
        },
        booking: {
          checkIn: invoiceData.booking?.check_in || new Date().toISOString(),
          checkOut: invoiceData.booking?.check_out || new Date().toISOString(),
          guests: invoiceData.booking?.guests || 1,
          nights: nights,
        },
        amounts: {
          subtotal: invoiceData.amount / 100, // Convert from cents
          tax: invoiceData.tax_amount / 100, // Convert from cents
          total: invoiceData.total_amount / 100, // Convert from cents
        },
        status: invoiceData.status || 'paid',
      };

      setPdfData(customInvoiceData);
      console.log('✅ Custom invoice data prepared:', customInvoiceData);
    } catch (error) {
      console.error('❌ Error preparing invoice data:', error);
      setError(error instanceof Error ? error.message : 'Failed to prepare invoice data');
    } finally {
      setLoading(false);
    }
  }, [invoiceData, isOpen, invoiceNumber]);

  useEffect(() => {
    if (isOpen && invoiceData) {
      prepareInvoiceData();
    }
  }, [isOpen, invoiceData, prepareInvoiceData]);

  useEffect(() => {
    // Clean up data when modal closes
    if (!isOpen) {
      setPdfData(null);
      setError(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Invoice PDF - {invoiceNumber}</DialogTitle>
            <div className="flex items-center gap-2">
              {pdfData && (
                <PDFDownloadLink
                  document={<CustomInvoiceDocument data={pdfData} />}
                  fileName={`${invoiceNumber}.pdf`}
                >
                  {({ loading: downloadLoading }) => (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={downloadLoading}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {downloadLoading ? 'Preparing...' : 'Download'}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Close
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg">
          {loading && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Loading invoice PDF...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-4 text-center max-w-md">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Failed to Load PDF</h3>
                <p className="text-gray-600 text-sm mb-4">{error}</p>
                <Button onClick={prepareInvoiceData} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {pdfData && !loading && !error && (
            <div className="w-full h-full">
              <PDFViewer
                className="w-full h-full border-0 rounded-lg"
                showToolbar={true}
              >
                <CustomInvoiceDocument data={pdfData} />
              </PDFViewer>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
