export type Language = 'en' | 'el';

export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.apartments': 'Apartments',
    'nav.experiences': 'Experiences',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    
    // Booking Widget
    'booking.title': 'Book Your Stay',
    'booking.checkin': 'Check-in',
    'booking.checkout': 'Check-out',
    'booking.guests': 'Guests',
    'booking.selectDates': 'Select dates',
    'booking.getPrice': 'Get Price',
    'booking.calculating': 'Calculating...',
    'booking.continue': 'Continue',
    'booking.reserveNow': 'Reserve Now',
    'booking.nights': 'night',
    'booking.nightsPlural': 'nights',
    'booking.wontBeCharged': "You won't be charged yet",
    'booking.selectDatesToContinue': 'Select dates to continue',
    
    // Trust Indicators
    'trust.freeCancellation': 'Free cancellation',
    'trust.instantConfirmation': 'Instant confirmation',
    'trust.bestRateGuarantee': 'Best rate guarantee',
    'trust.localHostSupport': 'Local host support',
    'trust.securePayment': 'Secure payment processing',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.guestDetails': 'Guest Details',
    'checkout.paymentDetails': 'Payment Details',
    'checkout.confirmation': 'Confirmation',
    'checkout.firstName': 'First Name',
    'checkout.lastName': 'Last Name',
    'checkout.email': 'Email Address',
    'checkout.phone': 'Phone Number',
    'checkout.country': 'Country',
    'checkout.specialRequests': 'Special Requests',
    'checkout.specialRequestsPlaceholder': 'Any special requests or requirements...',
    'checkout.continueToPayment': 'Continue to Payment',
    'checkout.back': 'Back',
    'checkout.completePayment': 'Complete Payment',
    'checkout.processing': 'Processing...',
    'checkout.bookingConfirmed': 'Booking Confirmed!',
    'checkout.bookingReference': 'Booking Reference',
    'checkout.confirmationEmailSent': 'A confirmation email has been sent to {email} with your booking details and check-in instructions.',
    'checkout.backToHome': 'Back to Home',
    'checkout.browseMore': 'Browse More Apartments',
    
    // Booking Summary
    'summary.bookingSummary': 'Booking Summary',
    'summary.yourStay': 'Your stay',
    'summary.guest': 'guest',
    'summary.guests': 'guests',
    
    // Price Breakdown
    'price.total': 'Total',
    'price.cleaningFee': 'Cleaning fee',
    'price.freeCancellationUntil': 'Free cancellation until {date}',
    
    // Common
    'common.required': 'Required',
    'common.optional': 'Optional',
    'common.close': 'Close',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
  el: {
    // Navigation
    'nav.home': 'Αρχική',
    'nav.apartments': 'Διαμερίσματα',
    'nav.experiences': 'Εμπειρίες',
    'nav.about': 'Σχετικά',
    'nav.contact': 'Επικοινωνία',
    
    // Booking Widget
    'booking.title': 'Κλείστε τη Διαμονή σας',
    'booking.checkin': 'Άφιξη',
    'booking.checkout': 'Αναχώρηση',
    'booking.guests': 'Επισκέπτες',
    'booking.selectDates': 'Επιλέξτε ημερομηνίες',
    'booking.getPrice': 'Υπολογισμός Τιμής',
    'booking.calculating': 'Υπολογίζεται...',
    'booking.continue': 'Συνέχεια',
    'booking.reserveNow': 'Κράτηση Τώρα',
    'booking.nights': 'νύχτα',
    'booking.nightsPlural': 'νύχτες',
    'booking.wontBeCharged': 'Δεν θα χρεωθείτε ακόμα',
    'booking.selectDatesToContinue': 'Επιλέξτε ημερομηνίες για συνέχεια',
    
    // Trust Indicators
    'trust.freeCancellation': 'Δωρεάν ακύρωση',
    'trust.instantConfirmation': 'Άμεση επιβεβαίωση',
    'trust.bestRateGuarantee': 'Εγγύηση καλύτερης τιμής',
    'trust.localHostSupport': 'Υποστήριξη τοπικού οικοδεσπότη',
    'trust.securePayment': 'Ασφαλής επεξεργασία πληρωμής',
    
    // Checkout
    'checkout.title': 'Ολοκλήρωση Παραγγελίας',
    'checkout.guestDetails': 'Στοιχεία Επισκέπτη',
    'checkout.paymentDetails': 'Στοιχεία Πληρωμής',
    'checkout.confirmation': 'Επιβεβαίωση',
    'checkout.firstName': 'Όνομα',
    'checkout.lastName': 'Επώνυμο',
    'checkout.email': 'Διεύθυνση Email',
    'checkout.phone': 'Τηλέφωνο',
    'checkout.country': 'Χώρα',
    'checkout.specialRequests': 'Ειδικές Απαιτήσεις',
    'checkout.specialRequestsPlaceholder': 'Οποιεσδήποτε ειδικές απαιτήσεις...',
    'checkout.continueToPayment': 'Συνέχεια στην Πληρωμή',
    'checkout.back': 'Πίσω',
    'checkout.completePayment': 'Ολοκλήρωση Πληρωμής',
    'checkout.processing': 'Επεξεργασία...',
    'checkout.bookingConfirmed': 'Η Κράτηση Επιβεβαιώθηκε!',
    'checkout.bookingReference': 'Κωδικός Κράτησης',
    'checkout.confirmationEmailSent': 'Ένα email επιβεβαίωσης στάλθηκε στο {email} με τα στοιχεία της κράτησης και τις οδηγίες check-in.',
    'checkout.backToHome': 'Επιστροφή στην Αρχική',
    'checkout.browseMore': 'Περιηγηθείτε σε Περισσότερα Διαμερίσματα',
    
    // Booking Summary
    'summary.bookingSummary': 'Περίληψη Κράτησης',
    'summary.yourStay': 'Η διαμονή σας',
    'summary.guest': 'επισκέπτης',
    'summary.guests': 'επισκέπτες',
    
    // Price Breakdown
    'price.total': 'Σύνολο',
    'price.cleaningFee': 'Τέλος καθαρισμού',
    'price.freeCancellationUntil': 'Δωρεάν ακύρωση μέχρι {date}',
    
    // Common
    'common.required': 'Απαιτείται',
    'common.optional': 'Προαιρετικό',
    'common.close': 'Κλείσιμο',
    'common.cancel': 'Ακύρωση',
    'common.save': 'Αποθήκευση',
    'common.loading': 'Φόρτωση...',
    'common.error': 'Σφάλμα',
    'common.success': 'Επιτυχία',
  }
};

// Simple i18n context
export const createI18nContext = () => {
  let currentLanguage: Language = 'en';
  
  const setLanguage = (lang: Language) => {
    currentLanguage = lang;
    localStorage.setItem('habitat-language', lang);
  };
  
  const getLanguage = (): Language => {
    const stored = localStorage.getItem('habitat-language') as Language;
    return stored || 'en';
  };
  
  const t = (key: string, params?: Record<string, string>): string => {
    const lang = getLanguage();
    let text = translations[lang][key] || translations.en[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, value);
      });
    }
    
    return text;
  };
  
  return { setLanguage, getLanguage, t };
};

export const i18n = createI18nContext();
