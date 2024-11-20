import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase, refreshSession, handleSupabaseError } from '../lib/supabase';
import { getUserProfile } from '../lib/database';
import type { UserProfile } from '../lib/types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isProMember: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const clearAuthState = () => {
    setSession(null);
    setUser(null);
    setUserProfile(null);
    setError(null);
    localStorage.removeItem('sb-session');
    localStorage.removeItem('sb-user');
    localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_URL.split('//')[1] + '-auth-token');
    sessionStorage.clear();
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await getUserProfile(userId);
      if (profile) {
        setUserProfile(profile);
        return true;
      }
      return false;
    } catch (err) {
      const error = handleSupabaseError(err);
      console.error('Error loading user profile:', error);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return { error };
      }

      if (data.session) {
        setSession(data.session);
        localStorage.setItem('sb-session', JSON.stringify(data.session));
      }

      if (data.user) {
        setUser(data.user);
        localStorage.setItem('sb-user', JSON.stringify(data.user));
        await loadUserProfile(data.user.id);
      }

      navigate('/dashboard/overview', { replace: true });
      return { error: null };
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: { full_name?: string }) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError(error.message);
        return { error };
      }

      if (data.session) {
        setSession(data.session);
        localStorage.setItem('sb-session', JSON.stringify(data.session));
      }

      if (data.user) {
        setUser(data.user);
        localStorage.setItem('sb-user', JSON.stringify(data.user));
        await loadUserProfile(data.user.id);
        navigate('/dashboard/overview', { replace: true });
      }

      return { error: null };
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: signOutError } = await supabase.auth.signOut({
        scope: 'global'
      });

      if (signOutError) {
        setError(signOutError.message);
        return { error: signOutError.message };
      }

      clearAuthState();
      navigate('/', { replace: true });

      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let profileSubscription: ReturnType<typeof supabase.channel> | null = null;

    const initAuth = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get session from Supabase
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            clearAuthState();
          }
          return;
        }

        if (currentSession?.user) {
          if (mounted) {
            setSession(currentSession);
            localStorage.setItem('sb-session', JSON.stringify(currentSession));
            setUser(currentSession.user);
            localStorage.setItem('sb-user', JSON.stringify(currentSession.user));
            await loadUserProfile(currentSession.user.id);

            // Set up realtime subscription for user profile updates
            profileSubscription = supabase
              .channel('user-profile-changes')
              .on(
                'postgres_changes',
                {
                  event: '*',
                  schema: 'public',
                  table: 'user_profiles',
                  filter: `id=eq.${currentSession.user.id}`
                },
                async (payload) => {
                  console.log('Profile update received:', payload);
                  if (payload.new) {
                    setUserProfile(payload.new as UserProfile);
                  } else {
                    // Reload profile if the payload doesn't contain the new data
                    await loadUserProfile(currentSession.user.id);
                  }
                }
              )
              .subscribe();
          }
        } else if (mounted) {
          clearAuthState();
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          clearAuthState();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          clearAuthState();
          navigate('/', { replace: true });
          return;
        }

        if (newSession?.user) {
          setSession(newSession);
          localStorage.setItem('sb-session', JSON.stringify(newSession));
          setUser(newSession.user);
          localStorage.setItem('sb-user', JSON.stringify(newSession.user));
          await loadUserProfile(newSession.user.id);
        } else {
          clearAuthState();
        }
      }
    );

    // Initialize auth state
    initAuth();

    // Cleanup subscriptions on unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (profileSubscription) {
        profileSubscription.unsubscribe();
      }
    };
  }, [navigate]);

  const value = {
    session,
    user,
    userProfile,
    isProMember: userProfile?.role === 'pro' && userProfile?.subscription_status === 'active',
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};