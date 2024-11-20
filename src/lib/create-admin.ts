import { supabase } from './supabase';

export async function createAdminUser(email: string, password: string) {
  try {
    // First create the user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin'
        }
      }
    });

    if (authError) throw authError;

    // Then update their profile to admin role
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ role: 'admin' })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { success: false, error };
  }
}