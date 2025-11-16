import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabaseHelpers } from '@/lib/supabase';
import { centsToEUR } from '@/lib/api';
import { 
  Check, 
  Calendar, 
  Users, 
  MapPin, 
  Mail, 
  Phone, 
  Download,
  ArrowLeft,
  Home
} from 'lucide-react';

interface BookingDetails {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
  properties?: {
    name: string;
    address?: string;
    city: string;
    country: string;
  };
}

const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId, fetchBookingDetails]);

  const fetchBookingDetails = React.useCallback(async () => {
    try {
      setLoading(true);
      const bookingData = await supabaseHelpers.getBookingById(bookingId!);
      if (bookingData) {
        setBooking(bookingData);
      } else {
        setError('Booking not found');
      }
    } catch (err) {
      console.error('Error fetching booking:', err);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateNights = () => {
    if (!booking) return 0;
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">{error || 'Booking not found'}</p>
            <Button onClick={() => navigate('/')} variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Booking Confirmed - {booking.id} | Habitat Lobby</title>
        <meta name="description" content={`Booking confirmation for ${booking.properties?.name || 'your stay'} at Habitat Lobby`} />
      </Helmet>

      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="container">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-xl opacity-90 mb-4">
              Thank you for choosing Habitat Lobby
            </p>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Booking ID: {booking.id.slice(-8).toUpperCase()}
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Booking Details */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <p className="font-medium">{formatDate(booking.check_in)}</p>
                    <p className="text-sm text-muted-foreground">From 15:00</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <p className="font-medium">{formatDate(booking.check_out)}</p>
                    <p className="text-sm text-muted-foreground">Until 11:00</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{calculateNights()} night{calculateNights() > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-medium">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Property</p>
                  <p className="font-medium">{booking.properties?.name || 'Property'}</p>
                  {booking.properties?.address && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {booking.properties.address}, {booking.properties.city}, {booking.properties.country}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Guest</p>
                  <p className="font-medium">{booking.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{booking.customer_email}</p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount</span>
                    <span className="text-xl font-bold text-accent">
                      {centsToEUR(booking.total_amount * 100)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Payment completed</p>
                </div>
              </CardContent>
            </Card>

            {/* What's Next */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-900">Confirmation Email Sent</p>
                      <p className="text-sm text-green-700">Check your inbox for booking details</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900">Check-in Instructions</p>
                      <p className="text-sm text-blue-700">Will be sent 24 hours before arrival</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-purple-900">Access Codes</p>
                      <p className="text-sm text-purple-700">Provided 2 hours before check-in</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Need Help?</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                                    <a href="mailto:admin@habitatlobby.com" className="text-blue-600 hover:underline">
                admin@habitatlobby.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href="tel:+302431234567" className="text-blue-600 hover:underline">
                        +30 243 123 4567
                      </a>
                    </div>
                    <p className="text-muted-foreground">Available 24/7 for urgent matters</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Booking Confirmation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </main>
  );
};

export default BookingConfirmation;
