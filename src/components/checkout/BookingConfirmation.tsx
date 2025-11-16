import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  Calendar,
  Users,
  MapPin,
  Mail,
  Phone,
  Download,
  Home,
  Clock,
  Key,
  MessageCircle,
  Eye
} from 'lucide-react';
import { formatCurrency } from '@/lib/stripe';
import { format } from 'date-fns';

interface BookingConfirmationProps {
  bookingId: string;
  unitName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  currency: string;
  onBackToHome: () => void;
  onViewBooking: () => void;
  onDownloadConfirmation?: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingId,
  unitName,
  checkIn,
  checkOut,
  guests,
  customerName,
  customerEmail,
  totalAmount,
  currency,
  onBackToHome,
  onViewBooking,
  onDownloadConfirmation
}) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-green-700 mb-4">
            Thank you for choosing Habitat Lobby. Your reservation has been successfully created.
          </p>
          <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2">
            Booking ID: {bookingId.slice(-8).toUpperCase()}
          </Badge>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            Booking Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{unitName}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>Trikala, Greece</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(checkInDate, 'EEE, MMM d')} - {format(checkOutDate, 'EEE, MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{nights} night{nights !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{guests} guest{guests !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Guest Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{customerEmail}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Total Amount</h4>
                <div className="text-2xl font-bold text-accent">
                  {formatCurrency(totalAmount * 100, currency)}
                </div>
                <p className="text-sm text-gray-600">Payment confirmed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Next */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Confirmation Email Sent</h4>
                <p className="text-sm text-gray-600">
                  A detailed confirmation has been sent to {customerEmail}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium">Check-in Instructions</h4>
                <p className="text-sm text-gray-600">
                  Detailed check-in instructions will be sent 24 hours before your arrival
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Key className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Access Codes</h4>
                <p className="text-sm text-gray-600">
                  Door codes and WiFi details will be provided 2 hours before check-in
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">24/7 Support</h4>
                <p className="text-sm text-gray-600">
                  Our team is available around the clock during your stay
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Contact Information</h4>
              <div className="space-y-1 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>admin@habitatlobby.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+30 243 123 4567</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Check-in Details</h4>
              <div className="space-y-1 text-gray-600">
                <p>Check-in: 3:00 PM - 10:00 PM</p>
                <p>Check-out: 11:00 AM</p>
                <p>Self check-in available</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onViewBooking}
          className="flex-1"
        >
          <Eye className="h-4 w-4 mr-2" />
          View & Manage Booking
        </Button>
        <Button
          onClick={onBackToHome}
          variant="outline"
          className="flex-1"
        >
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        {onDownloadConfirmation && (
          <Button
            onClick={onDownloadConfirmation}
            variant="outline"
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Confirmation
          </Button>
        )}
      </div>
    </div>
  );
};
