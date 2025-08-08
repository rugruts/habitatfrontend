import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type BookingBarProps = {
  compact?: boolean;
  className?: string;
};

const BookingBar: React.FC<BookingBarProps> = ({ compact = false, className }) => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = React.useState<string>("");
  const [checkOut, setCheckOut] = React.useState<string>("");
  const [guests, setGuests] = React.useState<string>("2");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For mockup: jump to featured apartments section
    if (location.pathname !== "/") navigate("/");
    setTimeout(() => {
      const el = document.getElementById("apartments");
      el?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <form
      onSubmit={onSearch}
      className={[
        "w-full rounded-lg border bg-card/90 backdrop-blur-sm p-3 md:p-4 shadow-sm",
        compact ? "grid grid-cols-2 gap-2 md:grid-cols-5" : "grid grid-cols-2 gap-2 md:grid-cols-6",
        className ?? "",
      ].join(" ")}
    >
      <div className="col-span-1">
        <label className="block text-xs md:text-sm text-muted-foreground mb-1">Check‑in</label>
        <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
      </div>
      <div className="col-span-1">
        <label className="block text-xs md:text-sm text-muted-foreground mb-1">Check‑out</label>
        <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
      </div>
      <div className="col-span-2 md:col-span-2">
        <label className="block text-xs md:text-sm text-muted-foreground mb-1">Guests</label>
        <Select value={guests} onValueChange={setGuests}>
          <SelectTrigger>
            <SelectValue placeholder="Guests" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 6 }).map((_, i) => (
              <SelectItem key={i} value={String(i + 1)}>
                {i + 1} {i === 0 ? "guest" : "guests"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className={compact ? "col-span-2 md:col-span-1 flex items-end" : "col-span-2 md:col-span-1 flex items-end"}>
        <Button type="submit" variant="hero" className="w-full hover-scale">
          Search
        </Button>
      </div>
    </form>
  );
};

export default BookingBar;
