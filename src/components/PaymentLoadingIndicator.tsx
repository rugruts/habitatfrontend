import React from 'react';
import { Loader2, CreditCard, CheckCircle, Clock } from 'lucide-react';

interface PaymentLoadingIndicatorProps {
  stage: 'idle' | 'validating' | 'processing' | 'confirming' | 'completing';
  isVisible: boolean;
}

const stageConfig = {
  idle: { icon: Clock, text: 'Ready to process', color: 'text-gray-500' },
  validating: { icon: Loader2, text: 'Validating payment details...', color: 'text-blue-500' },
  processing: { icon: CreditCard, text: 'Processing payment...', color: 'text-blue-500' },
  confirming: { icon: Loader2, text: 'Confirming transaction...', color: 'text-green-500' },
  completing: { icon: CheckCircle, text: 'Payment successful!', color: 'text-green-500' }
};

export const PaymentLoadingIndicator: React.FC<PaymentLoadingIndicatorProps> = ({
  stage,
  isVisible
}) => {
  if (!isVisible || stage === 'idle') return null;

  const config = stageConfig[stage];
  const IconComponent = config.icon;

  return (
    <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center space-x-3">
        <IconComponent 
          className={`h-5 w-5 ${config.color} ${
            stage === 'validating' || stage === 'confirming' ? 'animate-spin' : ''
          }`}
        />
        <span className={`text-sm font-medium ${config.color}`}>
          {config.text}
        </span>
      </div>
    </div>
  );
};

export default PaymentLoadingIndicator;


