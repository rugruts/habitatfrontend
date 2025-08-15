import { create } from "zustand";
import type { QuoteRes } from "@/types/booking";
import type { SelectedUpsell } from "@/types/upsells";

export type Dates = { from?: string; to?: string };

type BookingState = {
  unitSlug?: string;
  dates: Dates;
  guests: number;
  quote?: QuoteRes;
  upsells: SelectedUpsell[];
  setUnit: (slug: string) => void;
  setDates: (dates: Dates) => void;
  setGuests: (n: number) => void;
  setQuote: (q?: QuoteRes) => void;
  setUpsells: (upsells: SelectedUpsell[]) => void;
  reset: () => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  unitSlug: undefined,
  dates: {},
  guests: 2,
  quote: undefined,
  upsells: [],
  setUnit: (unitSlug) => set({ unitSlug }),
  setDates: (dates) => set({ dates }),
  setGuests: (guests) => set({ guests }),
  setQuote: (quote) => set({ quote }),
  setUpsells: (upsells) => set({ upsells }),
  reset: () => set({ unitSlug: undefined, dates: {}, guests: 2, quote: undefined, upsells: [] }),
}));

