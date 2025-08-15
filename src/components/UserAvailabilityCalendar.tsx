import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { CalendarDays, CheckCircle, XCircle, Clock, Users, ArrowRight, Euro, Calculator } from "lucide-react";
import { format, differenceInDays, addDays, isBefore, startOfDay } from "date-fns";
import { useBookingStore } from "@/state/bookingStore";
import { api, centsToEUR } from "@/lib/api";
import { supabaseHelpers } from "@/lib/supabase";

interface UserAvailabilityCalendarProps {
  unitSlug: string;
  onDatesSelected?: (checkIn: Date, checkOut: Date, nights: number) => void;
  maxGuests?: number;
}

// Get availability data from Supabase
const getAvailabilityData = async (unitSlug: string) => {
  try {
    // Get property from Supabase
    const property = await supabaseHelpers.getProperty(unitSlug);
    if (!property) {
      console.warn(`Property not found for slug: ${unitSlug}, using fallback data`);
      return generateFallbackAvailability();
    }

    // Get availability calendar for next 365 days
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 365);

    const availabilityMap = await supabaseHelpers.getAvailabilityCalendar(
      property.id,
      format(today, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd')
    );

    // Convert Map to Set for compatibility
    const availability = new Set<string>();
    availabilityMap.forEach((isAvailable, dateStr) => {
      if (isAvailable) {
        availability.add(dateStr);
      }
    });

    return availability;
  } catch (error) {
    console.error('Failed to fetch availability from Supabase:', error);
    return generateFallbackAvailability();
  }
};

// Fallback availability data for when Supabase is unavailable
const generateFallbackAvailability = () => {
  const availability = new Set<string>();
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = format(date, 'yyyy-MM-dd');

    // Simulate some booked dates (15% chance of being booked)
    const isAvailable = Math.random() > 0.15;
    if (isAvailable) {
      availability.add(dateStr);
    }
  }

  return availability;
};

const UserAvailabilityCalendar: React.FC<UserAvailabilityCalendarProps> = ({
  unitSlug,
  onDatesSelected,
  maxGuests = 4
}) => {
  const navigate = useNavigate();
  const { setUnit, setDates, setGuests: setStoreGuests, setQuote } = useBookingStore();
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<{
    available: boolean;
    message: string;
    priceBreakdown?: {
      basePrice: number;
      nights: number;
      subtotal: number;
      cleaningFee: number;
      total: number;
      currency: string;
    };
  } | null>(null);
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [propertyData, setPropertyData] = useState<any>(null);

  const today = startOfDay(new Date());

  // Load availability data and property info on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingAvailability(true);
      try {
        // Load availability data
        const availability = await getAvailabilityData(unitSlug);
        setAvailableDates(availability);

        // Load property data for pricing
        try {
          const property = await supabaseHelpers.getProperty(unitSlug);
          setPropertyData(property);
        } catch (error) {
          console.warn('Failed to load property data:', error);
          // Use fallback pricing from apartments data if available
          setPropertyData(null);
        }
      } catch (error) {
        console.error('Failed to load availability:', error);
        setAvailableDates(generateFallbackAvailability());
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    loadData();
  }, [unitSlug]);

  // Disable dates that are in the past or not available
  const disabledDays = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return isBefore(date, today) || !availableDates.has(dateStr);
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
    setAvailabilityResult(null);
  };

  const checkAvailability = async () => {
    if (!selectedRange?.from || !selectedRange?.to) return;

    setIsCheckingAvailability(true);

    const checkIn = selectedRange.from;
    const checkOut = selectedRange.to;
    const nights = differenceInDays(checkOut, checkIn);
    let allDatesAvailable = false;

    try {
      // Get property from Supabase
      const property = await supabaseHelpers.getProperty(unitSlug);
      if (!property) {
        throw new Error("Property not found");
      }

      // Check availability using Supabase
      allDatesAvailable = await supabaseHelpers.checkAvailability(
        property.id,
        format(checkIn, 'yyyy-MM-dd'),
        format(checkOut, 'yyyy-MM-dd')
      );
    } catch (error) {
      console.error('Availability check failed, using fallback:', error);

      // Fallback to local check
      allDatesAvailable = true;
      for (let i = 0; i < nights; i++) {
        const date = addDays(checkIn, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        if (!availableDates.has(dateStr)) {
          allDatesAvailable = false;
          break;
        }
      }
    }

    if (allDatesAvailable && nights >= 2) {
      // Calculate pricing breakdown
      let priceBreakdown = null;
      try {
        console.log('Fetching quote for:', { unitSlug, checkIn: format(checkIn, 'yyyy-MM-dd'), checkOut: format(checkOut, 'yyyy-MM-dd'), guests });

        const quote = await api.quote({
          unitSlug,
          checkIn: format(checkIn, 'yyyy-MM-dd'),
          checkOut: format(checkOut, 'yyyy-MM-dd'),
          guests
        });

        console.log('Quote received:', quote);

        // Find cleaning fee line item
        const cleaningFeeItem = quote.lineItems.find(item =>
          item.label.toLowerCase().includes('cleaning')
        );
        const cleaningFeeCents = cleaningFeeItem ? cleaningFeeItem.amountCents : 0;
        const subtotalCents = quote.totalCents - cleaningFeeCents;

        // Calculate price per night from subtotal
        const basePrice = Math.round(subtotalCents / nights / 100);
        const subtotal = Math.round(subtotalCents / 100);
        const cleaningFee = Math.round(cleaningFeeCents / 100);
        const total = Math.round(quote.totalCents / 100);

        console.log('Price breakdown calculation:', {
          quote,
          cleaningFeeCents,
          subtotalCents,
          basePrice,
          subtotal,
          cleaningFee,
          total,
          nights
        });

        // Validate the calculation
        if (isNaN(basePrice) || isNaN(total) || total <= 0 || basePrice <= 0) {
          console.error('Invalid pricing calculation:', { basePrice, total, subtotal, cleaningFee });
          priceBreakdown = null;
        } else {
          priceBreakdown = {
            basePrice,
            nights,
            subtotal,
            cleaningFee,
            total,
            currency: quote.currency
          };
        }
      } catch (error) {
        console.error('Failed to get pricing:', error);
      }

      setAvailabilityResult({
        available: true,
        message: `Great! Your dates are available for ${nights} night${nights > 1 ? 's' : ''}.`,
        priceBreakdown
      });
      onDatesSelected?.(checkIn, checkOut, nights);
    } else if (nights < 2) {
      setAvailabilityResult({
        available: false,
        message: "Minimum stay is 2 nights. Please select a longer period."
      });
    } else {
      setAvailabilityResult({
        available: false,
        message: "Sorry, some dates in your selection are not available. Please choose different dates."
      });
    }

    setIsCheckingAvailability(false);
  };

  const formatDateRange = () => {
    if (!selectedRange?.from) return "Select dates";
    if (!selectedRange?.to) return `${format(selectedRange.from, 'MMM d')} - Select checkout`;
    return `${format(selectedRange.from, 'MMM d')} - ${format(selectedRange.to, 'MMM d')}`;
  };

  const nights = selectedRange?.from && selectedRange?.to
    ? differenceInDays(selectedRange.to, selectedRange.from)
    : 0;

  const handleContinueToBooking = async () => {
    if (!selectedRange?.from || !selectedRange?.to) return;

    setIsBooking(true);
    try {
      // Set booking store data
      setUnit(unitSlug);
      setDates({
        from: format(selectedRange.from, 'yyyy-MM-dd'),
        to: format(selectedRange.to, 'yyyy-MM-dd')
      });
      setStoreGuests(guests);

      // Get quote
      const quote = await api.quote({
        unitSlug,
        checkIn: format(selectedRange.from, 'yyyy-MM-dd'),
        checkOut: format(selectedRange.to, 'yyyy-MM-dd'),
        guests
      });

      setQuote(quote);

      // Navigate to checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Failed to prepare booking:', error);
      // Could show an error message here
    } finally {
      setIsBooking(false);
    }
  };



  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-accent" />
            Select Your Dates
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose your check-in and check-out dates (minimum 2 nights)
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Calendar
              mode="range"
              selected={selectedRange}
              onSelect={handleRangeSelect}
              disabled={disabledDays}
              numberOfMonths={2}
              className="rounded-md border"
              classNames={{
                day_selected: "bg-accent text-white hover:bg-accent/90",
                day_range_middle: "bg-accent/20 text-accent-foreground",
                day_range_start: "bg-accent text-white",
                day_range_end: "bg-accent text-white",
                day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Guest Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            Number of Guests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Guests</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                disabled={guests <= 1}
                className="h-8 w-8 p-0"
              >
                -
              </Button>
              <span className="w-8 text-center font-medium">{guests}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGuests(Math.min(maxGuests, guests + 1))}
                disabled={guests >= maxGuests}
                className="h-8 w-8 p-0"
              >
                +
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Maximum {maxGuests} guests
          </p>
        </CardContent>
      </Card>

      {/* Selection Summary */}
      {selectedRange?.from && (
        <Card className="border-0 shadow-lg bg-gray-50">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dates:</span>
                <span className="text-sm">{formatDateRange()}</span>
              </div>
              {nights > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Nights:</span>
                  <span className="text-sm">{nights} night{nights > 1 ? 's' : ''}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Guests:</span>
                <span className="text-sm">{guests} guest{guests > 1 ? 's' : ''}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Check Availability Button */}
      <Button
        onClick={checkAvailability}
        disabled={!selectedRange?.from || !selectedRange?.to || isCheckingAvailability}
        className="w-full h-12 text-lg font-semibold"
        variant="accent"
      >
        {isCheckingAvailability ? (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 animate-spin" />
            Checking Availability...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            Check Availability
            <ArrowRight className="h-4 w-4" />
          </div>
        )}
      </Button>

      {/* Availability Result */}
      {availabilityResult && (
        <Card className={`border-0 shadow-lg ${
          availabilityResult.available
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {availabilityResult.available ? (
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${
                  availabilityResult.available ? 'text-green-800' : 'text-red-800'
                }`}>
                  {availabilityResult.available ? 'Available!' : 'Not Available'}
                </p>
                <p className={`text-sm ${
                  availabilityResult.available ? 'text-green-700' : 'text-red-700'
                }`}>
                  {availabilityResult.message}
                </p>
              </div>
            </div>

            {availabilityResult.available && (
              <div className="mt-4 pt-4 border-t border-green-200">
                {/* Pricing Breakdown */}
                {availabilityResult.priceBreakdown ? (
                  <div className="mb-4 p-4 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Calculator className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Price Breakdown</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>€{availabilityResult.priceBreakdown.basePrice} × {availabilityResult.priceBreakdown.nights} nights</span>
                        <span>€{availabilityResult.priceBreakdown.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cleaning fee</span>
                        <span>€{availabilityResult.priceBreakdown.cleaningFee}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-green-800 pt-2 border-t border-green-200">
                        <span>Total</span>
                        <span>€{availabilityResult.priceBreakdown.total}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Pricing Available at Checkout</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Final pricing will be calculated and displayed during the booking process.
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleContinueToBooking}
                  disabled={isBooking}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isBooking ? (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 animate-spin" />
                      Preparing Booking...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Continue to Booking
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card className="border-0 shadow-sm bg-gray-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <span>Unavailable</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAvailabilityCalendar;
