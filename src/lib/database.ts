import { supabase, withRetry, handleSupabaseError } from './supabase';
import type { UserProfile } from './types';
import type { Database } from './supabase-types';

type UserProfileRow = Database['public']['Tables']['user_profiles']['Row'];
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await withRetry(
      () => supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single(),
      3,
      1000
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', handleSupabaseError(error));
    return null;
  }
}

export async function createUserProfile(userId: string): Promise<UserProfile> {
  try {
    const { data, error } = await withRetry(
      () => supabase
        .from('user_profiles')
        .insert({
          id: userId,
          role: 'free'
        })
        .select()
        .single(),
      3,
      1000
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user profile:', handleSupabaseError(error));
    throw error;
  }
}

export async function updateUserProfile(
  userId: string, 
  updates: Partial<UserProfileUpdate>
): Promise<UserProfile | null> {
  try {
    const { data, error } = await withRetry(
      () => supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single(),
      3,
      1000
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user profile:', handleSupabaseError(error));
    return null;
  }
}

export async function deleteUserAccount(userId: string): Promise<void> {
  try {
    const { error: rpcError } = await withRetry(
      () => supabase.rpc('delete_user_with_data'),
      3,
      1000
    );
    
    if (rpcError) {
      console.error('RPC Error:', rpcError);
      throw new Error('Failed to delete account');
    }
  } catch (error) {
    console.error('Error deleting account:', handleSupabaseError(error));
    throw error;
  }
}

// Subscribe to user profile changes
export function subscribeToUserProfile(
  userId: string,
  callback: (profile: UserProfile) => void
): () => void {
  const subscription = supabase
    .channel(`user-profile-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_profiles',
        filter: `id=eq.${userId}`
      },
      (payload) => {
        if (payload.new) {
          callback(payload.new as UserProfile);
        }
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
}