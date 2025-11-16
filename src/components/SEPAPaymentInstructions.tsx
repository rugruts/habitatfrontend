import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Copy, 
  CheckCircle, 
  Clock, 
  Euro, 
  Building2, 
  CreditCard,
  AlertTriangle,
  Download
} from 'lucide-react';
import { SEPAPayment } from '@/services/SEPAPaymentService';

interface SEPAPaymentInstructionsProps {
  sepaPayment: SEPAPayment;
  onCopyReference?: (referenceCode: string) => void;
  onDownloadInstructions?: (payment: SEPAPayment) => void;
}

export const SEPAPaymentInstructions: React.FC<SEPAPaymentInstructionsProps> = ({
  sepaPayment,
  onCopyReference,
  onDownloadInstructions
}) => {
  const [copiedReference, setCopiedReference] = React.useState(false);
  const [copiedIBAN, setCopiedIBAN] = React.useState(false);

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

  const handleCopyIBAN = async () => {
    try {
      await navigator.clipboard.writeText(sepaPayment.iban_info.iban);
      setCopiedIBAN(true);
      setTimeout(() => setCopiedIBAN(false), 2000);
    } catch (error) {
      console.error('Failed to copy IBAN:', error);
    }
  };

  const handleDownloadInstructions = () => {
    onDownloadInstructions?.(sepaPayment);
  };

  const isExpired = new Date() > new Date(sepaPayment.expires_at);

  return (
    <div className="space-y-6">
      {/* Payment Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">SEPA Bank Transfer</h2>
        </div>
        <Badge 
          variant={isExpired ? 'destructive' : sepaPayment.status === 'confirmed' ? 'default' : 'secondary'}
          className="text-sm"
        >
          {isExpired ? 'Expired' : sepaPayment.status.toUpperCase()}
        </Badge>
      </div>

      {/* Important Notice */}
      {isExpired && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Payment Expired</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              This payment has expired. Please contact us to arrange a new payment or extend the deadline.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment Amount */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5 text-green-600" />
            Payment Amount
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            €{sepaPayment.amount.toFixed(2)}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Currency: {sepaPayment.currency}
          </p>
        </CardContent>
      </Card>

      {/* Reference Code - Most Important */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <CheckCircle className="h-5 w-5" />
            Reference Code (IMPORTANT)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <code className="text-lg font-mono font-bold text-blue-800">
                {sepaPayment.reference_code}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyReference}
                className="ml-2"
              >
                {copiedReference ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
          <p className="text-sm text-blue-700 mt-2 font-medium">
            ⚠️ You MUST include this reference code in your transfer description/message
          </p>
        </CardContent>
      </Card>

      {/* Bank Account Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-600" />
            Bank Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Account Holder</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                {sepaPayment.iban_info.account_holder}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Bank Name</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                {sepaPayment.iban_info.bank_name}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">IBAN</label>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono">
                {sepaPayment.iban_info.iban}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyIBAN}
              >
                {copiedIBAN ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">BIC/SWIFT Code</label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg font-mono">
              {sepaPayment.iban_info.bic}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Log into your online banking or visit your bank branch</li>
              <li>Create a new SEPA transfer to our account</li>
              <li>Enter the amount: <strong>€{sepaPayment.amount.toFixed(2)}</strong></li>
              <li>Use our IBAN: <strong>{sepaPayment.iban_info.iban}</strong></li>
              <li><strong>IMPORTANT:</strong> Include the reference code <code className="bg-yellow-100 px-1 rounded">{sepaPayment.reference_code}</code> in the transfer description/message</li>
              <li>Complete the transfer</li>
              <li>Your booking will be confirmed once we receive the payment</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Payment Expiry */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              Payment expires on: <strong>{new Date(sepaPayment.expires_at).toLocaleDateString()}</strong>
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Please complete the transfer before this date to avoid cancellation
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleDownloadInstructions}
          variant="outline"
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Instructions
        </Button>
        <Button
          onClick={handleCopyReference}
          className="flex-1"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy Reference Code
        </Button>
      </div>

      {/* Additional Information */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <h4 className="font-medium text-gray-800 mb-2">Need Help?</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• SEPA transfers usually take 1-3 business days</li>
            <li>• Keep your transfer receipt for reference</li>
            <li>• Contact us if you have any questions about the payment</li>
            <li>• Your booking is secure and will be confirmed upon payment receipt</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEPAPaymentInstructions;
