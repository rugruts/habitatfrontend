import * as React from "react";
import { useBookingStore } from "@/state/bookingStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { api } from "@/lib/api";
import { supabase, supabaseHelpers } from "@/lib/supabase";
import { bookingEmailService } from "@/lib/booking-email-service";
import SEO from "@/components/SEO";
import { trackPageView, trackBookingStart, trackBookingComplete } from "@/components/GoogleAnalytics";
import { ArrowLeft, Lock } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise, stripeAppearance } from "@/lib/stripe";
import StripePaymentForm from "@/components/StripePaymentForm";
import { apartments } from "@/data/apartments";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { BookingSummary } from "@/components/checkout/BookingSummary";
import { GuestDetailsForm } from "@/components/checkout/GuestDetailsForm";
import { BookingConfirmation } from "@/components/checkout/BookingConfirmation";


const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { unitSlug, dates, guests, quote, reset } = useBookingStore();
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    specialRequests: ""
  });
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{
    bookingId: string; 
    customerName: string; 
    customerEmail: string; 
    totalAmount: number
  } | null>(null);
  const [step, setStep] = React.useState<'details' | 'payment' | 'confirmation'>('details');
  const [clientSecret, setClientSecret] = React.useState<string>('');
  const [errors, setErrors] = React.useState<{[key: string]: string}>({});
  const [propertyName, setPropertyName] = React.useState<string>('');

  // emailService is imported from @/lib/email-service

  // Test bookingEmailService on component mount
  React.useEffect(() => {
    console.log('🧪 CheckoutEnhanced: bookingEmailService loaded:', !!bookingEmailService);
    console.log('🧪 CheckoutEnhanced: bookingEmailService type:', typeof bookingEmailService);
    trackPageView('checkout');
    if (unitSlug) {
      trackBookingStart(unitSlug);
    }
  }, [unitSlug]);

  // Fetch property name when component mounts
  React.useEffect(() => {
    const fetchPropertyName = async () => {
      if (unitSlug) {
        console.log('Fetching property name for unitSlug:', unitSlug);
        try {
          // First try to find in apartments data by slug
          const apartment = apartments.find(apt => apt.slug === unitSlug);
          if (apartment) {
            console.log('Found apartment by slug:', apartment.name);
            setPropertyName(apartment.name);
            return;
          }

          // If not found by slug, try to fetch from Supabase by ID
          console.log('Not found in apartments data, fetching from Supabase...');
          const property = await supabaseHelpers.getProperty(unitSlug);
          if (property) {
            console.log('Found property in Supabase:', property.name);
            setPropertyName(property.name);
          } else {
            console.log('Property not found, using fallback');
            setPropertyName(unitSlug); // Fallback to slug/ID
          }
        } catch (error) {
          console.error('Error fetching property name:', error);
          setPropertyName(unitSlug); // Fallback to slug/ID
        }
      }
    };

    fetchPropertyName();
  }, [unitSlug]);

  // Form change handler
  const handleFormChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Form validation
  const validateForm = React.useCallback(() => {
    const newErrors: {[key: string]: string} = {};

    // Contact information validation
    if (!form.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!form.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }



    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  // Check if no booking in progress
  if (!unitSlug || !quote || !dates.from || !dates.to) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEO
          title="Checkout - Habitat Lobby"
          description="Complete your booking at Habitat Lobby"
          noindex={true}
        />
        <div className="container py-10">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">No booking in progress.</p>
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const onSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Skip upsells and go directly to payment
      await onContinueToPayment();
    }
  };

  const onContinueToPayment = async () => {
    setLoading(true);
    setErrors({});
    try {
      console.log('Starting checkout process...');
      const res = await api.startCheckout({
        unitSlug,
        checkIn: dates.from!,
        checkOut: dates.to!,
        guests,
        customer: form,
      });
      console.log('Checkout response:', res);

      if (!res.clientSecret) {
        throw new Error('No client secret received from payment service');
      }

      setClientSecret(res.clientSecret);
      setStep('payment');
    } catch (error: unknown) {
      console.error('Failed to create payment intent:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to prepare payment. Please try again.';
      setErrors({ payment: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const onPaymentSuccess = async (paymentIntent: any) => {
    try {
      console.log('Payment success! Payment intent:', paymentIntent);
      console.log('Payment intent metadata:', paymentIntent.metadata);

      let bookingId = paymentIntent.metadata?.booking_id;

      // If no booking_id in metadata, try to find the booking by payment_intent_id
      if (!bookingId) {
        console.log('No booking_id in metadata, searching by payment_intent_id:', paymentIntent.id);
        try {
          const { data: booking, error } = await supabase
            .from('bookings')
            .select('id')
            .eq('payment_intent_id', paymentIntent.id)
            .single();

          if (error) {
            console.error('Error finding booking by payment_intent_id:', error);
            throw new Error('Could not find booking for this payment');
          }

          bookingId = booking.id;
          console.log('Found booking by payment_intent_id:', bookingId);
        } catch (dbError) {
          console.error('Database error:', dbError);
          throw new Error('Could not find booking for this payment');
        }
      }

      if (!bookingId) {
        console.error('No booking_id found. Available metadata keys:', Object.keys(paymentIntent.metadata || {}));
        throw new Error('No booking ID found in payment intent');
      }

      // Update booking status to confirmed
      if (bookingId) {
        try {
          await supabaseHelpers.updateBookingStatus(bookingId, 'confirmed');
          console.log('✅ Booking confirmed:', bookingId);
          console.log('🔄 Starting email notification process...');

          // Send booking confirmation email
          try {
            console.log('🔄 Attempting to send booking confirmation email for booking:', bookingId);
            console.log('📧 Calling bookingEmailService.sendBookingConfirmationById...');

            const emailResult = await bookingEmailService.sendBookingConfirmationById(bookingId);
            console.log('📧 Email service result:', emailResult);

            if (emailResult) {
              console.log('✅ Booking confirmation email sent successfully!', {
                bookingId: bookingId
              });
            } else {
              console.error('❌ Failed to send booking confirmation email');
              // Note: Email failure doesn't prevent booking confirmation
              console.log('📧 Email will be retried later or sent manually');
            }
          } catch (emailError) {
            console.error('💥 Email service error:', emailError);
            // Note: Email failure doesn't prevent booking confirmation
            console.log('📧 Email will be retried later or sent manually');
          }
        } catch (error) {
          console.error('Failed to update booking status:', error);
        }
      }

      const totalAmount = quote?.totalCents ? quote.totalCents / 100 : 0;

      setResult({
        bookingId,
        customerName: `${form.firstName} ${form.lastName}`.trim(),
        customerEmail: form.email,
        totalAmount
      });

      // Track successful booking completion
      trackBookingComplete(bookingId, totalAmount);

      setStep('confirmation');
    } catch (error) {
      console.error('Error processing payment success:', error);
      setErrors({ payment: 'Payment succeeded but there was an error processing your booking. Please contact support.' });
    }
  };

  const onPaymentError = (error: string) => {
    console.error('Payment failed:', error);
    setErrors({ payment: error || 'Payment failed. Please try again.' });
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Checkout - Habitat Lobby"
        description="Complete your booking at Habitat Lobby"
        noindex={true}
      />

      <div className="container py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="max-w-6xl mx-auto">
            <CheckoutProgress currentStep={step} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            {/* Guest Details Step */}
            {step === 'details' && (
              <div className="space-y-6">
                <GuestDetailsForm
                  form={form}
                  errors={errors}
                  onChange={handleFormChange}
                />
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={onSubmitDetails}
                    className="flex-1"
                    size="lg"
                  >
                    Continue to Add-ons
                  </Button>
                </div>
              </div>
            )}



            {/* Payment Step */}
            {step === 'payment' && clientSecret && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Secure payment powered by Stripe</span>
                </div>

                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: stripeAppearance,
                    locale: 'en',
                  }}
                >
                  <StripePaymentForm
                    amount={quote.totalCents}
                    currency={quote.currency}
                    bookingDetails={{
                      unitName: propertyName || 'Property',
                      checkIn: dates.from!,
                      checkOut: dates.to!,
                      guests,
                      nights: quote.nights,
                    }}
                    customerDetails={{
                      name: `${form.firstName} ${form.lastName}`.trim(),
                      email: form.email,
                    }}
                    onSuccess={onPaymentSuccess}
                    onError={onPaymentError}
                  />
                </Elements>
              </div>
            )}

            {/* Confirmation Step */}
            {step === 'confirmation' && result && (
              <BookingConfirmation
                bookingId={result.bookingId}
                unitName={propertyName || 'Property'}
                checkIn={dates.from!}
                checkOut={dates.to!}
                guests={guests}
                customerName={result.customerName}
                customerEmail={result.customerEmail}
                totalAmount={result.totalAmount}
                currency={quote.currency}
                onViewBooking={() => {
                  reset();
                  navigate(`/view-booking/${result.bookingId}`);
                }}
                onBackToHome={() => {
                  reset();
                  navigate('/');
                }}
              />
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            {step !== 'confirmation' && (
              <BookingSummary
                unitName={propertyName || 'Property'}
                checkIn={dates.from!}
                checkOut={dates.to!}
                guests={guests}
                quote={quote}
                className="sticky top-8"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
