import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

interface GoogleAnalyticsProps {
  trackingId: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ trackingId }) => {
  const location = useLocation();

  useEffect(() => {
    if (!trackingId || trackingId === 'G-XXXXXXXXXX') {
      console.log('Google Analytics tracking ID not configured');
      return;
    }

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true
      });
    `;
    document.head.appendChild(script2);

    // Make gtag available globally
    window.gtag = function() {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(arguments);
    };

    return () => {
      // Cleanup scripts on unmount
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [trackingId]);

  // Track page views on route changes
  useEffect(() => {
    if (window.gtag && trackingId && trackingId !== 'G-XXXXXXXXXX') {
      window.gtag('config', trackingId, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search,
      });
    }
  }, [location, trackingId]);

  return null;
};

export default GoogleAnalytics;

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
