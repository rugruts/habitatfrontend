import * as React from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { centsToEUR } from "@/lib/api";
import "react-day-picker/dist/style.css";

type AvailabilityStatus = "available" | "booked" | "blocked" | "checkout-only" | "checkin-only";

type AvailabilityDay = {
  date: string;
  status: AvailabilityStatus;
  price?: number; // in cents
  minStay?: number;
};

type Props = {
  unitSlug: string;
  availability: AvailabilityDay[];
  selectedRange?: DateRange;
  onRangeSelect?: (range: DateRange | undefined) => void;
  className?: string;
};

export const AvailabilityCalendar: React.FC<Props> = ({
  unitSlug,
  availability,
  selectedRange,
  onRangeSelect,
  className
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  // Create lookup for availability data
  const availabilityMap = React.useMemo(() => {
    const map = new Map<string, AvailabilityDay>();
    availability.forEach(day => {
      map.set(day.date, day);
    });
    return map;
  }, [availability]);

  // Custom day renderer with pricing and availability
  const renderDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayData = availabilityMap.get(dateStr);
    
    if (!dayData) return null;

    const isSelected = selectedRange?.from && selectedRange?.to && 
      date >= selectedRange.from && date <= selectedRange.to;

    return (
      <div className={`
        relative w-full h-full min-h-[60px] p-1 rounded-md transition-all duration-200
        ${dayData.status === 'available' ? 'bg-green-50 hover:bg-green-100 cursor-pointer' : ''}
        ${dayData.status === 'booked' ? 'bg-red-50 cursor-not-allowed' : ''}
        ${dayData.status === 'blocked' ? 'bg-gray-100 cursor-not-allowed' : ''}
        ${isSelected ? 'bg-accent text-white' : ''}
      `}>
        <div className="text-sm font-medium">{date.getDate()}</div>
        {dayData.price && dayData.status === 'available' && (
          <div className="text-xs text-muted-foreground mt-1">
            {centsToEUR(dayData.price)}
          </div>
        )}
        {dayData.status === 'booked' && (
          <div className="text-xs text-red-600 font-medium">Booked</div>
        )}
        {dayData.minStay && dayData.minStay > 1 && (
          <div className="text-xs text-accent font-medium">
            {dayData.minStay}n min
          </div>
        )}
      </div>
    );
  };

  // Disable unavailable dates
  const disabledDates = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayData = availabilityMap.get(dateStr);
    return !dayData || dayData.status !== 'available';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Availability & Pricing</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="bg-green-50">Available</Badge>
            <Badge variant="outline" className="bg-red-50">Booked</Badge>
            <Badge variant="outline" className="bg-gray-100">Blocked</Badge>
          </div>

          {/* Calendar */}
          <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={onRangeSelect}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            disabled={disabledDates}
            numberOfMonths={1}
            showOutsideDays={false}
            components={{
              Day: ({ date }) => renderDay(date)
            }}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};
