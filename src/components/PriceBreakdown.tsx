import * as React from "react";
import type { QuoteRes } from "@/types/booking";
import { centsToEUR } from "@/lib/api";

export const PriceBreakdown: React.FC<{ quote: QuoteRes; className?: string }> = ({ quote, className }) => {
  return (
    <div className={["rounded-lg border p-4 bg-accent/5", className ?? ""].join(" ")}> 
      <div className="space-y-2">
        {quote.lineItems.map((li, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{li.label}</span>
            <span className="font-medium">{centsToEUR(li.amountCents)}</span>
          </div>
        ))}
        <div className="border-t pt-2 flex items-center justify-between">
          <span className="font-medium">Total</span>
          <span className="font-semibold text-primary">{centsToEUR(quote.totalCents)}</span>
        </div>
        {quote.refundableUntil && (
          <div className="text-xs text-muted-foreground">Free cancellation until {new Date(quote.refundableUntil).toLocaleString()}</div>
        )}
      </div>
    </div>
  );
};

