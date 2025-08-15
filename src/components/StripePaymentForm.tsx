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
import { Loader2, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/stripe';

interface StripePaymentFormProps {
  amount: number;
  currency: string;
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
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  currency,
  bookingDetails,
  customerDetails,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
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
        setErrorMessage(error.message || 'An unexpected error occurred.');
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred.');
      onError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
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

      {/* Payment Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-accent" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
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
