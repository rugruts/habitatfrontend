import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CalendarDays, 
  Users, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Star,
  MapPin,
  Clock,
  Euro,
  ArrowRight,
  Heart,
  Share2,
  Phone,
  Mail,
  Sparkles,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, addDays, differenceInDays, isToday, isTomorrow } from 'date-fns';
import { supabaseHelpers } from '@/lib/supabase';
import { useBookingStore } from '@/state/bookingStore';
import { api } from '@/lib/api';
import ShareModal from './ShareModal';

interface EmbeddedAvailabilityWidgetProps {
  propertyId: string;
  maxGuests?: number;
  basePrice?: number;
  className?: string;
  reviewStats?: {
    totalReviews: number;
    averageRating: number;
  };
  property?: {
    id: string;
    name: string;
    description: string;
    images: string[];
    city: string;
    country: string;
  };
}

interface AvailabilityResult {
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
}

export const EmbeddedAvailabilityWidget: React.FC<EmbeddedAvailabilityWidgetProps> = React.memo(({
  propertyId,
  maxGuests = 4,
  basePrice = 0,
  className = '',
  reviewStats,
  property
}) => {
  const { t } = useTranslation();
    // Unique instance ID for component isolation
  const instanceId = React.useMemo(() => Math.random().toString(36).substr(2, 9), []);
  
  React.useEffect(() => {
    // Component lifecycle logging (can be removed in production)
    return () => {
      // Cleanup on unmount
    };
  }, [propertyId, instanceId]);
  
  const navigate = useNavigate();
  const { setUnit, setDates, setGuests, setQuote } = useBookingStore();
  
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [guests, setGuestsCount] = useState<number>(2);
  const [isChecking, setIsChecking] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<AvailabilityResult | null>(null);
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Load availability data on mount
  useEffect(() => {
    const loadAvailability = async () => {
      setIsLoadingAvailability(true);
      try {
        // Get availability for next 90 days
        const today = new Date();
        const endDate = addDays(today, 90);
        
        const availabilityMap = await supabaseHelpers.getAvailabilityCalendar(
          propertyId,
          format(today, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd')
        );
        
        // Convert to Set of available date strings
        const available = new Set<string>();
        availabilityMap.forEach((isAvailable, dateStr) => {
          if (isAvailable) {
            available.add(dateStr);
          }
        });
        
        setAvailableDates(available);
      } catch (error) {
        console.error('Failed to load availability:', error);
        // Fallback: assume most dates are available
        const available = new Set<string>();
        for (let i = 0; i < 90; i++) {
          const date = addDays(new Date(), i);
          available.add(format(date, 'yyyy-MM-dd'));
        }
        setAvailableDates(available);
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    loadAvailability();
  }, [propertyId]);

  // Disabled dates for calendar
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) return true;
    
    // Disable dates beyond 90 days
    if (date > addDays(today, 90)) return true;
    
    // Disable unavailable dates
    const dateStr = format(date, 'yyyy-MM-dd');
    return !availableDates.has(dateStr);
  };

  const handleRangeSelect = async (range: DateRange | undefined) => {
    setSelectedRange(range);
    setAvailabilityResult(null);

    if (!range?.from || !range?.to) return;

    const checkIn = range.from;
    const checkOut = range.to;
    const nights = differenceInDays(checkOut, checkIn);

    // Minimum 2 nights
    if (nights < 2) {
      setAvailabilityResult({
        available: false,
        message: "Minimum stay is 2 nights. Please select a longer period."
      });
      return;
    }

    setIsChecking(true);
    try {
      // Check availability
      const isAvailable = await supabaseHelpers.checkAvailability(
        propertyId,
        format(checkIn, 'yyyy-MM-dd'),
        format(checkOut, 'yyyy-MM-dd')
      );

      if (!isAvailable) {
        setAvailabilityResult({
          available: false,
          message: "Sorry, these dates are not available. Please select different dates."
        });
        return;
      }

      // Get pricing
      let priceBreakdown = undefined;
      try {
        const quote = await api.quote({
          unitSlug: propertyId,
          checkIn: format(checkIn, 'yyyy-MM-dd'),
          checkOut: format(checkOut, 'yyyy-MM-dd'),
          guests
        });

        // Extract pricing from lineItems
        const accommodationItem = quote.lineItems.find(item => item.label.includes('night'));
        const cleaningItem = quote.lineItems.find(item => item.label.includes('Cleaning'));
        
        const basePrice = accommodationItem ? Math.round(accommodationItem.amountCents / quote.nights / 100) : 0;
        const subtotal = accommodationItem ? Math.round(accommodationItem.amountCents / 100) : 0;
        const cleaningFee = cleaningItem ? Math.round(cleaningItem.amountCents / 100) : 0;

        priceBreakdown = {
          basePrice,
          nights: quote.nights,
          subtotal,
          cleaningFee,
          total: Math.round(quote.totalCents / 100),
          currency: quote.currency
        };
      } catch (error) {
        console.error('Failed to get pricing:', error);
      }

              setAvailabilityResult({
          available: true,
          message: t('widget.available', { nights: nights.toString() }),
          priceBreakdown
        });

    } catch (error) {
      console.error('Availability check failed:', error);
      setAvailabilityResult({
        available: false,
        message: t('common.error')
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleBookNow = async () => {
    if (!selectedRange?.from || !selectedRange?.to || !availabilityResult?.available) return;

    setIsBooking(true);
    try {
      // Set booking store data
      setUnit(propertyId);
      setDates({
        from: format(selectedRange.from, 'yyyy-MM-dd'),
        to: format(selectedRange.to, 'yyyy-MM-dd')
      });
      setGuests(guests);

      // Get quote
      const quote = await api.quote({
        unitSlug: propertyId,
        checkIn: format(selectedRange.from, 'yyyy-MM-dd'),
        checkOut: format(selectedRange.to, 'yyyy-MM-dd'),
        guests
      });

      setQuote(quote);

      // Navigate to checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Failed to prepare booking:', error);
    } finally {
      setIsBooking(false);
    }
  };



  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  return (
    <>
      <Card className={`${className} bg-white/80 backdrop-blur-sm border-0 shadow-2xl`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            {t('widget.checkAvailability')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShare}
              className="p-2 h-auto text-muted-foreground hover:text-primary"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Price Display */}
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold text-primary">€{basePrice}</div>
          <div className="text-muted-foreground">{t('pages.home.perNight')}</div>
          <Badge variant="secondary" className="ml-auto">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            {reviewStats ? `${reviewStats.averageRating.toFixed(1)} (${reviewStats.totalReviews})` : '4.9 (0)'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex flex-col items-center gap-1 h-auto py-3"
            asChild
          >
            <Link to="/contact">
              <Mail className="h-4 w-4" />
              <span className="text-xs">Contact</span>
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex flex-col items-center gap-1 h-auto py-3"
            onClick={() => {
              const mapSection = document.getElementById('map-section');
              if (mapSection) {
                mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
          >
            <MapPin className="h-4 w-4" />
            <span className="text-xs">{t('ui.map')}</span>
          </Button>
        </div>

        <Separator />

        {/* Guests Selection */}
        <div className="space-y-3">
          <Label htmlFor="guests" className="text-sm font-medium">{t('booking.guests')}</Label>
          <Select value={guests.toString()} onValueChange={(value) => setGuestsCount(parseInt(value))}>
            <SelectTrigger className="h-12">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {num} {num === 1 ? t('summary.guest') : t('summary.guests')}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">{t('booking.selectDates')}</Label>
          {isLoadingAvailability ? (
            <div className="flex items-center justify-center py-8 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">{t('common.loading')}</span>
              </div>
            </div>
          ) : (
            <div 
              className="border rounded-lg overflow-hidden relative" 
              data-calendar-container={instanceId}
              style={{ isolation: 'isolate' }}
            >
              <Calendar
                key={`availability-calendar-${propertyId}-${instanceId}`}
                mode="range"
                selected={selectedRange}
                onSelect={handleRangeSelect}
                disabled={disabledDays}
                numberOfMonths={1}
                className="w-full"
                data-calendar-instance={instanceId}
                style={{ contain: 'layout style paint' }}
                classNames={{
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary/90",
                  day_range_middle: "bg-primary/20 text-primary-foreground",
                  day_range_start: "bg-primary text-primary-foreground",
                  day_range_end: "bg-primary text-primary-foreground",
                  day_disabled: "text-gray-300 opacity-30 cursor-not-allowed bg-gray-100/50 pointer-events-none line-through",
                  day_today: "bg-blue-50 text-blue-600 font-semibold border border-blue-200",
                }}
              />
            </div>
          )}
        </div>

        {/* Availability Check Status */}
        {isChecking && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="p-2 bg-blue-100 rounded-full">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-blue-900">{t('booking.calculating')}</div>
              <div className="text-sm text-blue-700">{t('booking.selectDatesToContinue')}</div>
            </div>
          </div>
        )}

        {/* Availability Result */}
        {availabilityResult && (
          <div className={`p-4 rounded-lg border ${
            availabilityResult.available 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                availabilityResult.available ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {availabilityResult.available ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  availabilityResult.available ? 'text-green-900' : 'text-red-900'
                }`}>
                  {availabilityResult.message}
                </p>
                
                {/* Price Breakdown */}
                {availabilityResult.available && availabilityResult.priceBreakdown && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">€{availabilityResult.priceBreakdown.basePrice} × {availabilityResult.priceBreakdown.nights} {t('booking.nights')}</span>
                      <span>€{availabilityResult.priceBreakdown.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('price.cleaningFee')}</span>
                      <span>€{availabilityResult.priceBreakdown.cleaningFee}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>{t('price.total')}</span>
                      <span className="text-primary">€{availabilityResult.priceBreakdown.total}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {availabilityResult?.available && (
            <Button 
              onClick={handleBookNow} 
              disabled={isBooking}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
            >
              {isBooking ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  {t('booking.continue')}
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  {t('apartment.bookNow')}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          )}
          

        </div>

        {/* Trust Indicators */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>{t('trust.securePayment')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>{t('trust.instantConfirmation')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Share Modal */}
    <ShareModal
      isOpen={isShareModalOpen}
      onClose={() => setIsShareModalOpen(false)}
      property={property || {
        id: propertyId,
        name: `Apartment ${propertyId}`,
        description: "Beautiful apartment for your stay",
        images: [],
        city: "Trikala",
        country: "Greece"
      }}
    />
  </>
  );
});
