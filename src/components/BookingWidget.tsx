import * as React from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DateRangePicker } from "@/components/DateRangePicker";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { api, centsToEUR } from "@/lib/api";
import { useBookingStore } from "@/state/bookingStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Users,
  Clock,
  Shield,
  Star,
  Minus,
  Plus,
  Sparkles,
  MapPin,
  Check,
  ArrowRight
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading";

export const BookingWidget: React.FC<{ unitSlug: string; className?: string }> = React.memo(({ unitSlug, className }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { dates, guests, setDates, setGuests, setUnit, quote, setQuote } = useBookingStore();
  const [range, setRange] = React.useState<DateRange | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();
  const [showCalendar, setShowCalendar] = React.useState(false);

  React.useEffect(() => { setUnit(unitSlug); }, [unitSlug, setUnit]);

  const canQuote = !!(range?.from && range?.to);
  const nights = range?.from && range?.to ?
    Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const nightsText = nights === 1 ? t('booking.nights') : t('booking.nightsPlural');

  const fetchQuote = React.useCallback(async () => {
    if (!canQuote) return;
    setLoading(true); setError(undefined);
    try {
      const res = await api.quote({
        unitSlug,
        checkIn: range!.from!.toISOString().slice(0,10),
        checkOut: range!.to!.toISOString().slice(0,10),
        guests,
      });
      setDates({ from: range!.from!.toISOString().slice(0,10), to: range!.to!.toISOString().slice(0,10) });
      setQuote(res);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to quote";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [canQuote, range, guests, unitSlug, setDates, setQuote]);

  const startCheckout = async () => {
    if (!quote) return;
    navigate("/checkout");
  };

  // Auto-fetch quote when dates/guests change
  React.useEffect(() => {
    if (canQuote) {
      const timer = setTimeout(fetchQuote, 500);
      return () => clearTimeout(timer);
    }
  }, [canQuote, fetchQuote]);

  return (
    <Card className={cn(
      "shadow-2xl border-0 bg-gradient-to-br from-white via-white to-accent/5 lg:sticky lg:top-8 overflow-hidden",
      className
    )}>
      {/* Premium Header */}
      <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-30"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-xl font-serif flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('widget.checkAvailability')}
            </CardTitle>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Star className="h-3 w-3 mr-1" />
              {t('widget.bestRate')}
            </Badge>
          </div>
          <p className="text-white/90 text-sm">{t('widget.checkDates')}</p>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Enhanced Date Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              {t('widget.checkinCheckout')}
            </label>
            {nights > 0 && (
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 font-medium">
                {nights} {nightsText}
              </Badge>
            )}
          </div>

          {showCalendar ? (
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <DateRangePicker value={range} onChange={setRange} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCalendar(false)}
                className="w-full border-gray-200 hover:bg-gray-100"
              >
                Close Calendar
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowCalendar(true)}
              className="w-full h-14 justify-start text-left border-2 border-gray-200 hover:border-accent/50 hover:bg-accent/5 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                    <Calendar className="h-4 w-4 text-accent" />
                  </div>
                  <div className="text-left">
                    {range?.from && range?.to ? (
                      <div>
                        <div className="font-medium text-gray-900">
                          {range.from.toLocaleDateString()} - {range.to.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {nights} night{nights > 1 ? 's' : ''} selected
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium text-gray-600">Select your dates</div>
                        <div className="text-xs text-gray-400">{t('booking.selectDates')}</div>
                      </div>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-accent transition-colors" />
              </div>
            </Button>
          )}
        </div>

        {/* Enhanced Guest Selection */}
        <div className="space-y-4">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Users className="h-4 w-4 text-accent" />
            {t('booking.guests')}
          </label>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Users className="h-4 w-4 text-accent" />
              </div>
              <div>
                            <div className="font-medium text-gray-900">{guests} {guests === 1 ? t('summary.guest') : t('summary.guests')}</div>
            <div className="text-xs text-gray-500">{t('booking.maxGuests', { max: '6' })}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                disabled={guests <= 1}
                className="h-8 w-8 p-0 rounded-full border-gray-300 hover:border-accent hover:bg-accent/10 disabled:opacity-30"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGuests(Math.min(6, guests + 1))}
                disabled={guests >= 6}
                className="h-8 w-8 p-0 rounded-full border-gray-300 hover:border-accent hover:bg-accent/10 disabled:opacity-30"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Price Display */}
        {loading && (
          <div className="text-center py-8 bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl border border-accent/20">
            <div className="relative">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent/30 border-t-accent mx-auto"></div>
              <Sparkles className="h-4 w-4 text-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="text-sm font-medium text-accent mt-3">Calculating your perfect rate...</p>
            <p className="text-xs text-gray-500 mt-1">Finding the best available price</p>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-700 bg-red-50 p-4 rounded-xl border border-red-200 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}

        {quote && !loading && (
          <div className="space-y-6">
            {/* Price Breakdown with Enhanced Styling */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200">
              <PriceBreakdown quote={quote} />
            </div>

            <Separator className="bg-gray-200" />

            {/* Enhanced Trust Indicators */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                {t('widget.whyBookWithUs')}
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">{t('widget.freeCancellation48h')}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-800">{t('widget.instantConfirmation')}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-yellow-800">Best rate guarantee</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-purple-800">24/7 local host support</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Action Buttons */}
        <div className="space-y-4">
          <Button
            className={cn(
              "w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]",
              quote
                ? "bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white"
                : "bg-gray-100 text-gray-500 cursor-not-allowed"
            )}
            onClick={startCheckout}
            disabled={!quote || loading}
          >
            <div className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Checking availability...</span>
                </>
              ) : quote ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>{t('widget.available')} {centsToEUR(quote.totalCents)}</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5" />
                  <span>{t('widget.checkAvailability')}</span>
                </>
              )}
            </div>
          </Button>

          {quote && (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <Check className="h-4 w-4" />
                <span className="font-medium">{t('widget.noPaymentRequired')}</span>
              </div>
              <p className="text-xs text-gray-500">
                {t('widget.secureBooking')}
              </p>
            </div>
          )}

          {!quote && !loading && (
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <MapPin className="h-5 w-5 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">{t('widget.readyToExplore')}</p>
              <p className="text-xs text-gray-500 mt-1">{t('widget.chooseDates')}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

