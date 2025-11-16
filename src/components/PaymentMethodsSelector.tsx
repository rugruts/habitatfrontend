import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Apple, 
  Smartphone, 
  Building2, 
  Euro,
  Shield,
  CheckCircle,
  Info
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export type PaymentMethod = 
  | 'card' 
  | 'apple_pay' 
  | 'google_pay' 
  | 'sepa' 
  | 'cash_on_arrival';

interface PaymentMethodsSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  amount: number;
  currency: string;
  className?: string;
}

const PaymentMethodsSelector: React.FC<PaymentMethodsSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  amount,
  currency,
  className
}) => {
  const { t } = useTranslation();
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const [isGooglePayAvailable, setIsGooglePayAvailable] = useState(false);

  React.useEffect(() => {
    // Check if Apple Pay is available
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
      setIsApplePayAvailable(true);
    }

    // Check if Google Pay is available
    if (window.google && window.google.payments) {
      setIsGooglePayAvailable(true);
    }
  }, []);

  const paymentMethods = [
    {
      id: 'card' as PaymentMethod,
      name: t('payment.creditCard'),
      description: t('payment.creditCardDesc'),
      icon: CreditCard,
      available: true,
      badge: null
    },
    {
      id: 'apple_pay' as PaymentMethod,
      name: 'Apple Pay',
      description: t('payment.applePayDesc'),
      icon: Apple,
      available: isApplePayAvailable,
      badge: isApplePayAvailable ? null : t('payment.notAvailable')
    },
    {
      id: 'google_pay' as PaymentMethod,
      name: 'Google Pay',
      description: t('payment.googlePayDesc'),
      icon: Smartphone,
      available: isGooglePayAvailable,
      badge: isGooglePayAvailable ? null : t('payment.notAvailable')
    },
    {
      id: 'sepa' as PaymentMethod,
      name: 'SEPA Bank Transfer',
      description: 'Pay via bank transfer with IBAN. You will receive payment instructions and a reference code.',
      icon: Building2,
      available: true,
      badge: 'Manual Confirmation'
    },
    {
      id: 'cash_on_arrival' as PaymentMethod,
      name: t('payment.cashOnArrival'),
      description: t('payment.cashOnArrivalDesc'),
      icon: Euro,
      available: true,
      badge: t('payment.arrivalOnly')
    }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          {t('payment.selectMethod')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedMethod} onValueChange={(value) => onMethodChange(value as PaymentMethod)}>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div key={method.id} className="relative">
                  <RadioGroupItem
                    value={method.id}
                    id={method.id}
                    className="peer sr-only"
                    disabled={!method.available}
                  />
                  <Label
                    htmlFor={method.id}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${
                      !method.available ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <IconComponent className="h-6 w-6 text-gray-600" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{method.name}</span>
                          {method.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {method.badge}
                            </Badge>
                          )}
                          {selectedMethod === method.id && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>

        {/* Payment Security Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-800 mb-1">
                {t('payment.securityTitle')}
              </p>
              <p>{t('payment.securityDesc')}</p>
            </div>
          </div>
        </div>

        {/* Total Amount Display */}
        <div className="mt-4 p-4 bg-primary/5 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">{t('payment.totalAmount')}:</span>
            <span className="text-xl font-bold text-primary">
              {new Intl.NumberFormat('el-GR', {
                style: 'currency',
                currency: currency
              }).format(amount / 100)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsSelector;
