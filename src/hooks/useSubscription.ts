import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../lib/database';

export function useSubscription() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isProMember, setIsProMember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkSubscription() {
      if (!user) {
        setIsProMember(false);
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(user.id);
        setIsProMember(
          profile?.role === 'pro' && 
          profile?.subscription_status === 'active'
        );
      } catch (err) {
        console.error('Error checking subscription:', err);
        setError('Failed to check subscription status');
        setIsProMember(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkSubscription();
  }, [user]);

  return { isProMember, isLoading, error };
}