import { supabase } from '../lib/supabase';

async function setAdminRole(userId: string) {
  try {
    // Update user_profiles table to set role as admin
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ 
        role: 'admin',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (profileError) throw profileError;

    // Log admin action
    const { error: logError } = await supabase
      .from('admin_audit_logs')
      .insert({
        admin_id: userId,
        action_type: 'admin_created',
        resource_type: 'user_profiles',
        details: { method: 'manual_upgrade' }
      });

    if (logError) throw logError;

    console.log('Successfully set user as admin!');
    return true;
  } catch (error) {
    console.error('Error setting admin role:', error);
    return false;
  }
}

// Get the user ID from auth and set as admin
async function main() {
  console.log('Fetching user...');
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('Error getting user:', authError);
    return;
  }

  console.log('Setting admin role for user:', user.id);
  const success = await setAdminRole(user.id);

  if (success) {
    console.log('User has been upgraded to admin role');
    console.log('You can now access admin features by logging in');
  } else {
    console.log('Failed to set admin role');
  }
}

main().catch(console.error);