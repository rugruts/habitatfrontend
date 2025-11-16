import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Building2, 
  Clock, 
  Euro, 
  Copy, 
  Download,
  Mail,
  Phone
} from 'lucide-react';
import { SEPAPayment } from '@/services/SEPAPaymentService';
import SEPAPaymentInstructions from './SEPAPaymentInstructions';

interface SEPAPaymentConfirmationProps {
  sepaPayment: SEPAPayment;
  bookingId: string;
  onCopyReference?: (referenceCode: string) => void;
  onDownloadInstructions?: (payment: SEPAPayment) => void;
  onBackToHome?: () => void;
}

export const SEPAPaymentConfirmation: React.FC<SEPAPaymentConfirmationProps> = ({
  sepaPayment,
  bookingId,
  onCopyReference,
  onDownloadInstructions,
  onBackToHome
}) => {
  const [copiedReference, setCopiedReference] = React.useState(false);

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(sepaPayment.reference_code);
      setCopiedReference(true);
      onCopyReference?.(sepaPayment.reference_code);
      setTimeout(() => setCopiedReference(false), 2000);
    } catch (error) {
      console.error('Failed to copy reference code:', error);
    }
  };

  const handleDownloadInstructions = () => {
    onDownloadInstructions?.(sepaPayment);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEPA Payment Instructions Sent!</h1>
          <p className="text-gray-600 mt-2">
            Your booking has been created and is pending payment confirmation.
          </p>
        </div>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary">Booking ID: {bookingId}</Badge>
          <Badge variant="outline">Pending Payment</Badge>
        </div>
      </div>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Euro className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                €{sepaPayment.amount.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Amount to Transfer</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-blue-600">
                {new Date(sepaPayment.expires_at).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">Payment Deadline</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-orange-600">
                {sepaPayment.reference_code}
              </div>
              <div className="text-sm text-gray-600">Reference Code</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Complete the bank transfer using the details below</li>
                <li>• Include the reference code in your transfer description</li>
                <li>• We'll confirm your booking once payment is received</li>
                <li>• You'll receive an email confirmation with all details</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <SEPAPaymentInstructions 
        sepaPayment={sepaPayment}
        onCopyReference={onCopyReference}
        onDownloadInstructions={onDownloadInstructions}
      />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleCopyReference}
          className="flex-1"
          variant="outline"
        >
          <Copy className="h-4 w-4 mr-2" />
          {copiedReference ? 'Copied!' : 'Copy Reference Code'}
        </Button>
        <Button
          onClick={handleDownloadInstructions}
          className="flex-1"
          variant="outline"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Instructions
        </Button>
        <Button
          onClick={onBackToHome}
          className="flex-1"
        >
          Back to Home
        </Button>
      </div>

      {/* Contact Information */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium">Email Support</div>
                <div className="text-sm text-gray-600">support@habitatlobby.com</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium">Phone Support</div>
                <div className="text-sm text-gray-600">+30 123 456 7890</div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Reference your booking ID ({bookingId})</strong> when contacting support for faster assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEPAPaymentConfirmation;
