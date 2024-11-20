import { supabase, withRetry, handleSupabaseError } from './supabase';
import type { AdminAuditLog, AdminSettings, AdminStats, AdminAction } from './types';

export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await withRetry(
      () => supabase.rpc('is_admin', { user_id: userId }),
      3,
      1000
    );
    
    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error('Error checking admin status:', handleSupabaseError(error));
    return false;
  }
}

export async function updateAnalysisCredits(userId: string, credits: number): Promise<void> {
  try {
    const { error } = await withRetry(
      () => supabase.rpc('admin_update_analysis_credits', {
        target_user_id: userId,
        new_credits: credits
      }),
      3,
      1000
    );

    if (error) throw error;
  } catch (error) {
    console.error('Error updating analysis credits:', handleSupabaseError(error));
    throw error;
  }
}

export async function logAdminAction(
  action: AdminAction,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    const { error } = await withRetry(
      () => supabase.rpc('log_admin_action', {
        action_type: action,
        resource_type: resourceType,
        resource_id: resourceId,
        details: details
      }),
      3,
      1000
    );

    if (error) throw error;
  } catch (error) {
    console.error('Error logging admin action:', handleSupabaseError(error));
    throw error;
  }
}

export async function getAdminAuditLogs(
  limit: number = 50,
  offset: number = 0
): Promise<AdminAuditLog[]> {
  try {
    const { data, error } = await withRetry(
      () => supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1),
      3,
      1000
    );

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching admin audit logs:', handleSupabaseError(error));
    throw error;
  }
}

export async function getAdminSettings(): Promise<AdminSettings[]> {
  try {
    const { data, error } = await withRetry(
      () => supabase
        .from('admin_settings')
        .select('*')
        .order('setting_key'),
      3,
      1000
    );

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching admin settings:', handleSupabaseError(error));
    throw error;
  }
}

export async function updateAdminSetting(
  key: string,
  value: Record<string, any>
): Promise<void> {
  try {
    const { error: updateError } = await withRetry(
      () => supabase
        .from('admin_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString()
        }),
      3,
      1000
    );

    if (updateError) throw updateError;

    await logAdminAction(
      'settings_update',
      'admin_settings',
      key,
      { old_value: value }
    );
  } catch (error) {
    console.error('Error updating admin setting:', handleSupabaseError(error));
    throw error;
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const { data, error } = await withRetry(
      () => supabase.rpc('get_admin_stats'),
      3,
      1000
    );

    if (error) throw error;
    return data || {
      total_users: 0,
      active_subscriptions: 0,
      total_analyses: 0,
      revenue_mtd: 0
    };
  } catch (error) {
    console.error('Error fetching admin stats:', handleSupabaseError(error));
    throw error;
  }
}