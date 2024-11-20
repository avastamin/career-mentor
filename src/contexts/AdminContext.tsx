import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Cache admin status in sessionStorage
const ADMIN_CACHE_KEY = 'isAdmin';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState<boolean>(() => {
    // Initialize from session storage if available
    const cached = sessionStorage.getItem(ADMIN_CACHE_KEY);
    return cached === 'true';
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdminUser(false);
        sessionStorage.removeItem(ADMIN_CACHE_KEY);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check user_profiles table for admin role
        const { data, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        const isAdmin = data?.role === 'admin';
        setIsAdminUser(isAdmin);
        
        // Cache the result
        sessionStorage.setItem(ADMIN_CACHE_KEY, isAdmin.toString());

      } catch (err) {
        console.error('Error checking admin status:', err);
        setError('Failed to verify admin status');
        setIsAdminUser(false);
        sessionStorage.removeItem(ADMIN_CACHE_KEY);
      } finally {
        setLoading(false);
      }
    };

    // Set up subscription for role changes
    const subscription = supabase
      .channel('admin_role_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_profiles',
        filter: `id=eq.${user?.id}`
      }, () => {
        // Recheck admin status when profile changes
        checkAdminStatus();
      })
      .subscribe();

    checkAdminStatus();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const value = {
    isAdmin: isAdminUser,
    loading,
    error
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};