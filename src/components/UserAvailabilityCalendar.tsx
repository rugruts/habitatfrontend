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
import { cn } from "@/lib/utils";

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
  const { guests, setUnit, setDates, setGuests, setQuote } = useBookingStore();
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
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
  const [propertyData, setPropertyData] = useState<{
    id: string;
    name: string;
    base_price: number;
    max_guests: number;
    bedrooms: number;
    bathrooms: number;
  } | null>(null);

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
      setGuests(guests);

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
    <div className="space-y-4 md:space-y-6">
      {/* Enhanced Date Selection */}
      <div className="space-y-4">
        <div className="flex justify-center">
          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={handleRangeSelect}
            disabled={disabledDays}
            numberOfMonths={window.innerWidth > 768 ? 2 : 1}
            className="rounded-lg border-0 shadow-lg bg-white p-4"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center mb-4",
              caption_label: "text-lg font-semibold text-gray-800",
              nav: "space-x-1 flex items-center",
              nav_button: "h-8 w-8 bg-blue-50 hover:bg-blue-100 p-0 rounded-full transition-colors",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-gray-500 rounded-md w-10 h-10 font-medium text-sm flex items-center justify-center",
              row: "flex w-full mt-2",
              cell: "h-10 w-10 text-center text-sm p-0 relative hover:bg-blue-50 rounded-lg transition-colors [&:has([aria-selected].day-range-end)]:rounded-r-lg [&:has([aria-selected].day-outside)]:bg-blue-100/50 [&:has([aria-selected])]:bg-blue-100 first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg focus-within:relative focus-within:z-20",
              day: "h-10 w-10 p-0 font-medium aria-selected:opacity-100 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110",
              day_selected: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg",
              day_range_middle: "bg-blue-100 text-blue-800 hover:bg-blue-200",
              day_range_start: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg",
              day_range_end: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg",
              day_disabled: "text-gray-300 opacity-40 cursor-not-allowed bg-gray-50 pointer-events-none line-through",
              day_today: "bg-amber-100 text-amber-800 font-bold border-2 border-amber-400 shadow-sm",
              day_outside: "text-gray-400 opacity-50",
            }}
          />
        </div>
        
        {/* Calendar Legend */}
        <div className="flex items-center justify-center gap-6 text-xs bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span className="text-gray-600">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-100 border-2 border-amber-400 rounded"></div>
            <span className="text-gray-600">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded opacity-60"></div>
            <span className="text-gray-600">Unavailable</span>
          </div>
        </div>
      </div>

      {/* Enhanced Guest Selection */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Users className="h-5 w-5 text-blue-600" />
            Number of Guests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-800">Guests</span>
              <p className="text-xs text-gray-600">Maximum {maxGuests} guests</p>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl p-2 shadow-sm border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                disabled={guests <= 1}
                className="h-10 w-10 p-0 rounded-full border-gray-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-30"
              >
                -
              </Button>
              <span className="w-8 text-center font-bold text-lg text-gray-800">{guests}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGuests(Math.min(maxGuests, guests + 1))}
                disabled={guests >= maxGuests}
                className="h-10 w-10 p-0 rounded-full border-gray-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-30"
              >
                +
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Selection Summary */}
      {selectedRange?.from && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Your Selection</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-700">Dates</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatDateRange()}</span>
                </div>
                {nights > 0 && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-gray-700">Duration</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{nights} night{nights > 1 ? 's' : ''}</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-700">Guests</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{guests} guest{guests > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Check Availability Button */}
      <Button
        onClick={checkAvailability}
        disabled={!selectedRange?.from || !selectedRange?.to || isCheckingAvailability}
        className={cn(
          "w-full h-14 text-lg font-bold rounded-xl transition-all duration-300 shadow-xl",
          (!selectedRange?.from || !selectedRange?.to)
            ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl hover:scale-[1.02]"
        )}
      >
        {isCheckingAvailability ? (
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 animate-spin" />
            Checking Availability...
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5" />
            Check Availability
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </Button>

      {/* Enhanced Availability Result */}
      {availabilityResult && (
        <Card className={cn(
          "border-0 shadow-2xl transform transition-all duration-500 animate-in slide-in-from-bottom-4",
          availabilityResult.available
            ? 'bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200'
            : 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-200'
        )}>
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-6">
              {availabilityResult.available ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-800 mb-1">Perfect!</p>
                    <p className="text-emerald-700 font-medium">{availabilityResult.message}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <XCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-800 mb-1">Not Available</p>
                    <p className="text-red-700 font-medium">{availabilityResult.message}</p>
                  </div>
                </div>
              )}
            </div>

            {availabilityResult.available && (
              <div className="space-y-6">
                {/* Enhanced Pricing Breakdown */}
                {availabilityResult.priceBreakdown ? (
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Calculator className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">Price Breakdown</h4>
                        <p className="text-sm text-gray-600">All fees included</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">€{availabilityResult.priceBreakdown.basePrice} × {availabilityResult.priceBreakdown.nights} nights</span>
                        <span className="font-semibold text-gray-900">€{availabilityResult.priceBreakdown.subtotal}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Cleaning fee</span>
                        <span className="font-semibold text-gray-900">€{availabilityResult.priceBreakdown.cleaningFee}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl shadow-lg">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-bold">€{availabilityResult.priceBreakdown.total}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <Euro className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-800 text-lg">Pricing at Checkout</h4>
                        <p className="text-sm text-blue-600">Final pricing will be calculated during booking</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleContinueToBooking}
                  disabled={isBooking}
                  className="w-full h-14 text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
                >
                  {isBooking ? (
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 animate-spin" />
                      Preparing Your Booking...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5" />
                      Continue to Booking
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserAvailabilityCalendar;
