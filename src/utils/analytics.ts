// Google Analytics utility functions

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
    dataLayer: unknown[];
  }
}

// Analytics event tracking functions
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackBookingStart = (unitSlug: string) => {
  trackEvent('booking_start', 'booking', unitSlug);
};

export const trackBookingComplete = (bookingId: string, value: number) => {
  trackEvent('purchase', 'ecommerce', bookingId, value);
  
  // Enhanced ecommerce tracking
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: bookingId,
      value: value,
      currency: 'EUR',
      items: [{
        item_id: bookingId,
        item_name: 'Apartment Booking',
        category: 'Accommodation',
        quantity: 1,
        price: value
      }]
    });
  }
};

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', 'engagement', pageName);
};

export const trackContactForm = (formType: string) => {
  trackEvent('form_submit', 'contact', formType);
};

export const trackApartmentView = (apartmentName: string) => {
  trackEvent('view_item', 'apartment', apartmentName);
};
