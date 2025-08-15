import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Users, MapPin, Clock, Shield } from 'lucide-react';
import { formatCurrency } from '@/lib/stripe';
import { format } from 'date-fns';
import type { QuoteRes } from '@/types/booking';

interface BookingSummaryProps {
  unitName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  quote: QuoteRes;
  className?: string;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  unitName,
  checkIn,
  checkOut,
  guests,
  quote,
  className
}) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-accent" />
          Booking Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Details */}
        <div>
          <h3 className="font-semibold text-lg mb-2">{unitName}</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {format(checkInDate, 'EEE, MMM d')} - {format(checkOutDate, 'EEE, MMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{quote.nights} nights</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{guests} guest{guests !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium">Price Details</h4>
          {quote.lineItems.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium">
                {formatCurrency(item.amountCents, quote.currency)}
              </span>
            </div>
          ))}
          
          <Separator />
          
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-accent">
              {formatCurrency(quote.totalCents, quote.currency)}
            </span>
          </div>
        </div>

        {/* Policies */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>Free cancellation until {quote.refundableUntil ? 
              format(new Date(quote.refundableUntil), 'MMM d, h:mm a') : 
              '48 hours before check-in'
            }</span>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <h5 className="font-medium text-sm mb-1">Check-in Information</h5>
            <p className="text-xs text-gray-600">
              Check-in: 3:00 PM - 10:00 PM<br />
              Check-out: 11:00 AM<br />
              Self check-in with keypad
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
