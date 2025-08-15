import * as React from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Props = {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
};

export const DateRangePicker: React.FC<Props> = ({ value, onChange, disabled, className }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  // Disable past dates
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || (disabled && disabled(date));
  };

  return (
    <div className={["rounded-lg border bg-white p-3", className ?? ""].join(" ")}>
      <DayPicker
        mode="range"
        selected={value}
        onSelect={onChange}
        numberOfMonths={1}
        disabled={disabledDays}
        captionLayout="buttons"
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        showOutsideDays={false}
        fixedWeeks={false}
        classNames={{
          month: "space-y-4 w-full",
          caption: "flex justify-center pt-1 relative items-center mb-4",
          caption_label: "text-base font-semibold text-gray-900",
          nav: "space-x-1 flex items-center",
          nav_button: "h-8 w-8 bg-transparent p-0 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors flex items-center justify-center",
          nav_button_previous: "absolute left-0",
          nav_button_next: "absolute right-0",
          table: "w-full border-collapse",
          head_row: "flex mb-2",
          head_cell: "text-gray-500 rounded-md w-10 font-medium text-sm text-center",
          row: "flex w-full",
          cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
          day: "h-10 w-10 p-0 font-normal hover:bg-accent/20 rounded-md transition-colors flex items-center justify-center",
          day_selected: "bg-accent text-white hover:bg-accent/90 focus:bg-accent focus:text-white",
          day_today: "bg-accent/10 text-accent font-semibold",
          day_outside: "text-gray-300 opacity-50",
          day_disabled: "text-gray-300 opacity-30 cursor-not-allowed hover:bg-transparent",
          day_range_start: "bg-accent text-white rounded-l-md",
          day_range_end: "bg-accent text-white rounded-r-md",
          day_range_middle: "bg-accent/20 text-accent rounded-none",
          day_hidden: "invisible",
        }}
      />
    </div>
  );
};

