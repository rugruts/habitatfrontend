import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Lock, 
  Shield, 
  Check, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { centsToEUR } from "@/lib/api";

type PaymentMethod = 'card' | 'paypal' | 'bank';

type Props = {
  totalCents: number;
  currency: string;
  onPaymentSubmit: (paymentData: any) => Promise<void>;
  loading?: boolean;
  className?: string;
};

export const PaymentForm: React.FC<Props> = ({ 
  totalCents, 
  currency, 
  onPaymentSubmit, 
  loading = false,
  className 
}) => {
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('card');
  const [cardData, setCardData] = React.useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    country: '',
    postalCode: ''
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateCard = () => {
    const newErrors: Record<string, string> = {};
    
    if (!cardData.number || cardData.number.length < 16) {
      newErrors.number = 'Please enter a valid card number';
    }
    if (!cardData.expiry || !/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      newErrors.expiry = 'Please enter expiry as MM/YY';
    }
    if (!cardData.cvc || cardData.cvc.length < 3) {
      newErrors.cvc = 'Please enter a valid CVC';
    }
    if (!cardData.name.trim()) {
      newErrors.name = 'Please enter the cardholder name';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'card' && !validateCard()) {
      return;
    }
    
    await onPaymentSubmit({
      method: paymentMethod,
      cardData: paymentMethod === 'card' ? cardData : undefined
    });
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-green-600" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-3 p-3 border rounded-lg text-left transition-colors ${
                  paymentMethod === 'card' ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="h-5 w-5" />
                <div>
                  <div className="font-medium">Credit or Debit Card</div>
                  <div className="text-xs text-muted-foreground">Visa, Mastercard, American Express</div>
                </div>
                {paymentMethod === 'card' && <Check className="h-4 w-4 text-accent ml-auto" />}
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`flex items-center gap-3 p-3 border rounded-lg text-left transition-colors ${
                  paymentMethod === 'paypal' ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'
                }`}
                disabled
              >
                <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
                <div>
                  <div className="font-medium">PayPal</div>
                  <div className="text-xs text-muted-foreground">Coming soon</div>
                </div>
                <Badge variant="outline" className="ml-auto">Soon</Badge>
              </button>
            </div>
          </div>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={(e) => setCardData({...cardData, number: formatCardNumber(e.target.value)})}
                  maxLength={19}
                  className={errors.number ? 'border-red-500' : ''}
                />
                {errors.number && (
                  <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.number}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({...cardData, expiry: formatExpiry(e.target.value)})}
                    maxLength={5}
                    className={errors.expiry ? 'border-red-500' : ''}
                  />
                  {errors.expiry && (
                    <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.expiry}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cardData.cvc}
                    onChange={(e) => setCardData({...cardData, cvc: e.target.value.replace(/\D/g, '')})}
                    maxLength={4}
                    className={errors.cvc ? 'border-red-500' : ''}
                  />
                  {errors.cvc && (
                    <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.cvc}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardData.name}
                  onChange={(e) => setCardData({...cardData, name: e.target.value})}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="Greece"
                    value={cardData.country}
                    onChange={(e) => setCardData({...cardData, country: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="12345"
                    value={cardData.postalCode}
                    onChange={(e) => setCardData({...cardData, postalCode: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Your payment is secure</span>
            </div>
            <p className="text-sm text-green-700">
              We use industry-standard encryption to protect your payment information. 
              Your card details are processed securely by Stripe.
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-semibold" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Complete Payment - ${centsToEUR(totalCents)}`
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By completing this payment, you agree to our terms and conditions.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
