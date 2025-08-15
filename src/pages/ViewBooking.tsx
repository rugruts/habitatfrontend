import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import { trackPageView } from '@/components/GoogleAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Globe,
  FileText,
  Edit3,
  MessageCircle,
  Download,
  AlertTriangle,
  RefreshCw,
  Star,
  Camera,
  Wifi,
  Car,
  Coffee
} from 'lucide-react';
import { supabaseHelpers } from '@/lib/supabase';
import Footer from '@/components/Footer';

interface BookingDetails {
  id: string;
  booking_reference: string;
  property_name: string;
  property_address: string;
  check_in: string;
  check_out: string;
  guests: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  total_amount: number;
  currency: string;
  status: string;
  special_requests?: string;
  created_at: string;
  // Guest ID information
  full_name_on_id?: string;
  date_of_birth?: string;
  nationality?: string;
  id_passport_number?: string;
  issuing_country?: string;
  issuing_authority?: string;
}

const ViewBooking: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  
  const [booking, setBooking] = React.useState<BookingDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    trackPageView('view-booking');

    const fetchBooking = async () => {
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get booking details with property and guest information
        const bookingsResult = await supabaseHelpers.getAllBookings(1, 0, { booking_id: bookingId });
        
        if (!bookingsResult.bookings || bookingsResult.bookings.length === 0) {
          setError('Booking not found');
          setLoading(false);
          return;
        }

        const bookingData = bookingsResult.bookings[0];
        
        // Get guest details for ID information
        const guestDetails = await supabaseHelpers.getGuestByEmail(bookingData.customer_email);
        
        const bookingDetails: BookingDetails = {
          id: bookingData.id,
          booking_reference: bookingData.booking_reference || bookingData.id.slice(0, 8).toUpperCase(),
          property_name: bookingData.properties?.name || 'Property',
          property_address: bookingData.properties?.address || '',
          check_in: bookingData.check_in,
          check_out: bookingData.check_out,
          guests: bookingData.guests,
          customer_name: bookingData.customer_name,
          customer_email: bookingData.customer_email,
          customer_phone: bookingData.customer_phone,
          total_amount: bookingData.total_amount,
          currency: bookingData.currency || 'EUR',
          status: bookingData.status,
          special_requests: bookingData.special_requests,
          created_at: bookingData.created_at,
          // Guest ID information
          full_name_on_id: guestDetails?.full_name_on_id,
          date_of_birth: guestDetails?.date_of_birth,
          nationality: guestDetails?.nationality,
          id_passport_number: guestDetails?.id_passport_number,
          issuing_country: guestDetails?.issuing_country,
          issuing_authority: guestDetails?.issuing_authority
        };

        setBooking(bookingDetails);
      } catch (error) {
        console.error('Error fetching booking:', error);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
      <main className="min-h-screen bg-background">
        <div className="container py-20">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading booking details...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container py-20">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">{error || "Booking not found"}</h1>
              <Button onClick={() => navigate("/")}>
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title={`Booking Details - ${booking.booking_reference} | Habitat Lobby`}
        description={`View your booking details for ${booking.property_name}`}
        noindex={true}
      />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-12">
        <div className="container">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl mb-4">
                Booking Details
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-xl opacity-90">
                  Reference: {booking.booking_reference}
                </p>
                {getStatusBadge(booking.status)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property & Dates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent" />
                    Property & Stay Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{booking.property_name}</h3>
                    {booking.property_address && (
                      <p className="text-gray-600">{booking.property_address}</p>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Check-in</p>
                        <p className="text-sm text-gray-600">{formatDate(booking.check_in)}</p>
                        <p className="text-xs text-gray-500">After 15:00</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Check-out</p>
                        <p className="text-sm text-gray-600">{formatDate(booking.check_out)}</p>
                        <p className="text-xs text-gray-500">Before 11:00</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{calculateNights()} night{calculateNights() > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guest Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-accent" />
                    Guest Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Contact Name</p>
                      <p className="text-gray-600">{booking.customer_name}</p>
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">{booking.customer_email}</p>
                    </div>
                  </div>
                  
                  {booking.customer_phone && (
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">{booking.customer_phone}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ID Information */}
              {booking.full_name_on_id && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-accent" />
                      ID Verification Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Full Name on ID</p>
                        <p className="text-gray-600">{booking.full_name_on_id}</p>
                      </div>
                      {booking.nationality && (
                        <div>
                          <p className="font-medium">Nationality</p>
                          <p className="text-gray-600">{booking.nationality}</p>
                        </div>
                      )}
                    </div>
                    
                    {booking.id_passport_number && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium">ID/Passport Number</p>
                          <p className="text-gray-600 font-mono">
                            {booking.id_passport_number.replace(/./g, (char, index) => 
                              index < booking.id_passport_number!.length - 4 ? '•' : char
                            )}
                          </p>
                        </div>
                        {booking.issuing_country && (
                          <div>
                            <p className="font-medium">Issuing Country</p>
                            <p className="text-gray-600">{booking.issuing_country}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please bring the same ID document used during booking for check-in verification.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}

              {/* Special Requests */}
              {booking.special_requests && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-accent" />
                      Special Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{booking.special_requests}</p>
                  </CardContent>
                </Card>
              )}

              {/* Check-in Information */}
              {booking.status === 'confirmed' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      Check-in Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Check-in:</strong> 3:00 PM - 10:00 PM<br />
                        <strong>Check-out:</strong> 11:00 AM<br />
                        Self check-in available with door codes
                      </AlertDescription>
                    </Alert>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">What to Expect</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Check-in instructions will be sent 24 hours before arrival</li>
                        <li>• Door codes and WiFi details provided 2 hours before check-in</li>
                        <li>• Please bring the same ID document used during booking</li>
                        <li>• Contact us immediately if you need early check-in or late check-out</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Local Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent" />
                    Explore Trikala
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Must-Visit Places</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Trikala Castle - Historic fortress with city views</li>
                        <li>• Lithaios River Walk - Scenic cycling and walking paths</li>
                        <li>• Central Square - Heart of the city with cafés</li>
                        <li>• Meteora Monasteries - 1 hour drive, UNESCO site</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Local Tips</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Free bike sharing system throughout the city</li>
                        <li>• Traditional tavernas in the old town</li>
                        <li>• Weekly farmers market on Saturdays</li>
                        <li>• Evening stroll along the riverside</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('/about-trikala', '_blank')}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Discover More About Trikala
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-accent" />
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-accent/10 rounded-lg">
                    <div className="text-3xl font-bold text-accent">
                      €{booking.total_amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Total Amount</div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span>{getStatusBadge(booking.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Booked on:</span>
                      <span>{new Date(booking.created_at).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Currency:</span>
                      <span>{booking.currency}</span>
                    </div>
                  </div>
                  
                  {booking.status === 'confirmed' && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Your booking is confirmed! You'll receive check-in instructions 48 hours before arrival.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="pt-4 border-t space-y-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.print()}
                    >
                      Print Booking Details
                    </Button>

                    {booking.status === 'confirmed' && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(`mailto:info@habitatlobby.com?subject=Booking ${booking.booking_reference} - Special Request&body=Hi, I have a special request for my booking ${booking.booking_reference}:%0D%0A%0D%0A`)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Host
                      </Button>
                    )}

                    {booking.status === 'pending' && (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
                            // Handle cancellation logic here
                            alert('Cancellation feature will be implemented soon. Please contact us directly.');
                          }
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ViewBooking;
