import { useContext } from 'react';
import { AdminAuthContext } from '@/contexts/AdminAuthContext';

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    // During development, provide a fallback to prevent crashes during hot reloading
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ useAdminAuth called outside of AdminAuthProvider - providing fallback');
      return {
        user: null,
        loading: false,
        isAdmin: false,
        signIn: async () => ({ error: 'Context not available' }),
        signOut: async () => {},
        resetPassword: async () => ({ error: 'Context not available' })
      };
    }
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};



