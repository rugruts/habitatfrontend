import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  AddressElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Shield, CheckCircle, Euro, Info, Building2 } from 'lucide-react';
import { formatCurrency } from '@/lib/stripe';
import PaymentMethodsSelector, { PaymentMethod } from './PaymentMethodsSelector';
import { CashOnArrivalService } from '@/services/CashOnArrivalService';
import { sepaPaymentService, SEPAPayment } from '@/services/SEPAPaymentService';
import PaymentLoadingIndicator from './PaymentLoadingIndicator';

interface StripePaymentFormProps {
  amount: number;
  currency: string;
  bookingId?: string;
  bookingDetails: {
    unitName: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
  };
  customerDetails?: {
    name: string;
    email: string;
  };
  onSuccess: (paymentIntent: { 
    id: string; 
    status: string; 
    amount: number;
    metadata?: {
      booking_id?: string;
    };
  }) => void;
  onError: (error: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  currency,
  bookingId,
  bookingDetails,
  customerDetails,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'idle' | 'validating' | 'processing' | 'confirming' | 'completing'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  const [showCashOnArrivalInfo, setShowCashOnArrivalInfo] = useState(false);
  const [sepaPayment, setSepaPayment] = useState<SEPAPayment | null>(null);
  const [showSepaInstructions, setShowSepaInstructions] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setLoadingStage('validating');
    setErrorMessage('');

    try {
      // Handle cash on arrival separately
      if (selectedPaymentMethod === 'cash_on_arrival') {
        setLoadingStage('processing');
        await handleCashOnArrival();
        return;
      }

      // Handle SEPA bank transfer separately
      if (selectedPaymentMethod === 'sepa') {
        setLoadingStage('processing');
        await handleSEPAPayment();
        return;
      }

      // Handle other payment methods with Stripe
      if (!stripe || !elements) {
        throw new Error('Payment system not available. Please refresh and try again.');
      }

      setLoadingStage('processing');

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-confirmation`,
          payment_method_data: {
            billing_details: {
              name: customerDetails?.name || 'Guest',
              email: customerDetails?.email || undefined,
            },
          },
        },
        redirect: 'if_required',
      });

      if (error) {
        // Enhanced error handling with specific error types
        let userFriendlyMessage = 'Payment failed. Please try again.';
        
        if (error.type === 'card_error') {
          userFriendlyMessage = error.message || 'Your card was declined. Please check your details or try a different card.';
        } else if (error.type === 'validation_error') {
          userFriendlyMessage = 'Please check your payment details and try again.';
        } else if (error.type === 'api_error') {
          userFriendlyMessage = 'Payment system temporarily unavailable. Please try again in a moment.';
        }
        
        setErrorMessage(userFriendlyMessage);
        onError(userFriendlyMessage);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setLoadingStage('confirming');
        onSuccess(paymentIntent);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('An unexpected error occurred during payment.');
      onError('Payment failed');
    } finally {
      setIsLoading(false);
      setLoadingStage('idle');
    }
  };

  const handleCashOnArrival = async () => {
    try {
      // For cash on arrival, we'll create the booking after the payment intent
      // This way we can use the actual booking ID from the backend
      
      // Simulate successful payment for cash on arrival
      const mockPaymentIntent = {
        id: `cash_${Date.now()}`,
        status: 'succeeded',
        amount: amount,
        metadata: {
          payment_method: 'cash_on_arrival',
          booking_id: bookingId
        }
      };

      onSuccess(mockPaymentIntent);
    } catch (error) {
      console.error('Cash on arrival error:', error);
      setErrorMessage('Failed to process cash on arrival booking.');
      onError('Cash on arrival booking failed');
    }
  };

  const handleSEPAPayment = async () => {
    try {
      console.log('Processing SEPA bank transfer booking...');
      
      if (!bookingId) {
        throw new Error('Booking ID is required for SEPA payment');
      }

      // Create SEPA payment record
      const sepaPaymentData = await sepaPaymentService.createSEPAPayment(
        bookingId,
        amount,
        currency,
        {
          name: customerDetails?.name || 'Guest',
          email: customerDetails?.email || ''
        }
      );

      console.log('SEPA payment created:', sepaPaymentData);
      setSepaPayment(sepaPaymentData);
      setShowSepaInstructions(true);

      // Create a mock payment intent for SEPA (similar to cash on arrival)
      const mockPaymentIntent = {
        id: `sepa_${Date.now()}`,
        status: 'succeeded',
        amount: amount,
        metadata: {
          payment_method: 'sepa_bank_transfer',
          booking_id: bookingId,
          sepa_reference: sepaPaymentData.reference_code
        }
      };

      onSuccess(mockPaymentIntent);
    } catch (error) {
      console.error('SEPA payment error:', error);
      setErrorMessage('Failed to process SEPA bank transfer booking.');
      onError('SEPA bank transfer booking failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <Card className="border-0 shadow-lg bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Accommodation:</span>
            <span className="text-sm font-medium">{bookingDetails.unitName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Check-in:</span>
            <span className="text-sm font-medium">{bookingDetails.checkIn}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Check-out:</span>
            <span className="text-sm font-medium">{bookingDetails.checkOut}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Guests:</span>
            <span className="text-sm font-medium">{bookingDetails.guests}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Nights:</span>
            <span className="text-sm font-medium">{bookingDetails.nights}</span>
          </div>
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-bold text-lg">{formatCurrency(amount, currency)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Selector */}
      <PaymentMethodsSelector
        selectedMethod={selectedPaymentMethod}
        onMethodChange={setSelectedPaymentMethod}
        amount={amount}
        currency={currency}
      />

      {/* Payment Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-accent" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Cash on Arrival Info */}
          {selectedPaymentMethod === 'cash_on_arrival' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Euro className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">Cash on Arrival</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    You can pay in cash when you arrive at the property. No payment is required now.
                  </p>
                  <div className="text-sm text-blue-600">
                    <p><strong>Amount to pay:</strong> {formatCurrency(amount, currency)}</p>
                    <p><strong>Payment location:</strong> At the property upon check-in</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEPA Bank Transfer Info */}
          {selectedPaymentMethod === 'sepa' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-900 mb-2">SEPA Bank Transfer</h3>
                  <p className="text-sm text-green-700 mb-3">
                    Pay via bank transfer using our IBAN. You will receive detailed payment instructions and a unique reference code.
                  </p>
                  <div className="text-sm text-green-600">
                    <p><strong>Amount to pay:</strong> {formatCurrency(amount, currency)}</p>
                    <p><strong>Processing time:</strong> 1-3 business days</p>
                    <p><strong>Booking status:</strong> Pending until payment received</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stripe Payment Elements (only for card payments) */}
          {selectedPaymentMethod === 'card' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Billing Address */}
              <div>
                <h3 className="text-sm font-medium mb-3">Billing Address</h3>
                <AddressElement 
                  options={{
                  mode: 'billing',
                  allowedCountries: ['GR', 'US', 'GB', 'DE', 'FR', 'IT', 'ES'],
                }}
              />
            </div>

            {/* Payment Element */}
            <div>
              <h3 className="text-sm font-medium mb-3">Payment Method</h3>
              <PaymentElement
                options={{
                  layout: 'tabs',
                  wallets: {
                    applePay: 'auto',
                    googlePay: 'auto',
                  },
                }}
              />
            </div>

            {/* Payment Loading Indicator */}
            <PaymentLoadingIndicator 
              stage={loadingStage} 
              isVisible={isLoading} 
            />

            {/* Error Message */}
            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!stripe || isLoading}
              className="w-full h-12 text-lg font-semibold bg-accent hover:bg-accent/90"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Pay {formatCurrency(amount, currency)}
                </div>
              )}
            </Button>
          </form>
        )}

        {/* Cash on Arrival Submit Button */}
        {selectedPaymentMethod === 'cash_on_arrival' && (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing Booking...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Euro className="h-5 w-5" />
                Confirm Cash on Arrival Booking
              </div>
            )}
          </Button>
        )}

        {/* SEPA Bank Transfer Submit Button */}
        {selectedPaymentMethod === 'sepa' && (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing SEPA Booking...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Confirm SEPA Bank Transfer Booking
              </div>
            )}
          </Button>
        )}
        </CardContent>
      </Card>

      {/* Payment Methods Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>We accept multiple payment methods for your convenience</p>
        <div className="flex justify-center gap-3 mt-3 flex-wrap">
          <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
            <span>💳</span>
            <span className="text-xs">Cards</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
            <span>🍎</span>
            <span className="text-xs">Apple Pay</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
            <span>🟢</span>
            <span className="text-xs">Google Pay</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
            <span>🅿️</span>
            <span className="text-xs">PayPal</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
            <span>🏦</span>
            <span className="text-xs">Bank Transfer</span>
          </div>
        </div>
        <p className="text-xs mt-2 opacity-75">Secure payments powered by Stripe</p>
      </div>
    </div>
  );
};

export default StripePaymentForm;
