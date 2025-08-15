import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AdminAuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Add a display name for better debugging
AdminAuthContext.displayName = 'AdminAuthContext';

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

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);



  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setUser(session?.user ?? null);
          if (session?.user) {
            await checkAdminStatus(session.user);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await checkAdminStatus(session.user);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (user: User) => {
    try {
      // Check if user has admin role
      // For now, we'll check if the email is in our admin list
      // In production, you'd want to check a user_roles table or similar
      const adminEmails = [
        'stefanos@habitatlobby.com',
        'admin@habitatlobby.com',
        'info@habitatlobby.com',
        'admin@habitat.com'
      ];
      
      const isUserAdmin = adminEmails.includes(user.email || '');
      console.log('🔐 Admin check:', {
        userEmail: user.email,
        isAdmin: isUserAdmin,
        adminEmails: adminEmails
      });
      setIsAdmin(isUserAdmin);
      
      // You could also check against a database table:
      // const { data, error } = await supabase
      //   .from('user_roles')
      //   .select('role')
      //   .eq('user_id', user.id)
      //   .eq('role', 'admin')
      //   .single();
      // 
      // setIsAdmin(!error && data);
      
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        await checkAdminStatus(data.user);
      }

      return {};
    } catch (error) {
      console.error('Error signing in:', error);
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Error in signOut:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Add display name for better debugging
AdminAuthProvider.displayName = 'AdminAuthProvider';

// Remove default export to avoid confusion during hot reloading
