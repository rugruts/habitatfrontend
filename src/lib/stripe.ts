import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
// Add timeout and error handling for better UX
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY, {
  // Add locale for better localization
  locale: 'en',
  // Preload Stripe.js for faster loading
  stripeAccount: undefined,
}).catch((error) => {
  console.error('Failed to load Stripe:', error);
  return null;
});

export { stripePromise };

// Stripe configuration
export const stripeConfig = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  secretKey: import.meta.env.STRIPE_SECRET_KEY,
};

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
};

// Stripe appearance configuration for consistent styling
export const stripeAppearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#0F172A', // Your primary color
    colorBackground: '#ffffff',
    colorText: '#0F172A',
    colorDanger: '#df1b41',
    fontFamily: 'Inter, system-ui, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px',
    tabSpacing: '10px',
  },
  rules: {
    '.Input': {
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '16px',
    },
    '.Input:focus': {
      borderColor: '#0F172A',
      boxShadow: '0 0 0 2px rgba(15, 23, 42, 0.1)',
    },
    '.Label': {
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '8px',
    },
    '.Tab': {
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    '.Tab:hover': {
      backgroundColor: '#f8fafc',
    },
    '.Tab--selected': {
      backgroundColor: '#0F172A',
      color: '#ffffff',
      borderColor: '#0F172A',
    },
  },
};
