export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          role: 'free' | 'pro' | 'premium' | 'admin'
          stripe_customer_id: string | null
          subscription_status: 'active' | 'canceled' | 'past_due' | null
          subscription_period_end: string | null
          analysis_credits: number | null
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          preferences: Json | null
        }
        Insert: {
          id: string
          role?: 'free' | 'pro' | 'premium' | 'admin'
          stripe_customer_id?: string | null
          subscription_status?: 'active' | 'canceled' | 'past_due' | null
          subscription_period_end?: string | null
          analysis_credits?: number | null
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          preferences?: Json | null
        }
        Update: {
          id?: string
          role?: 'free' | 'pro' | 'premium' | 'admin'
          stripe_customer_id?: string | null
          subscription_status?: 'active' | 'canceled' | 'past_due' | null
          subscription_period_end?: string | null
          analysis_credits?: number | null
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          preferences?: Json | null
        }
      }

      career_analyses: {
        Row: {
          id: string
          user_id: string
          profile: Json
          analysis_results: Json
          created_at: string
          updated_at: string
          status: 'pending' | 'completed' | 'failed'
          error_message: string | null
        }
        Insert: {
          id?: string
          user_id: string
          profile: Json
          analysis_results: Json
          created_at?: string
          updated_at?: string
          status?: 'pending' | 'completed' | 'failed'
          error_message?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          profile?: Json
          analysis_results?: Json
          created_at?: string
          updated_at?: string
          status?: 'pending' | 'completed' | 'failed'
          error_message?: string | null
        }
      }

      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string
          stripe_subscription_id: string
          plan_id: string
          status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid'
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          canceled_at: string | null
          trial_start: string | null
          trial_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id: string
          stripe_subscription_id: string
          plan_id: string
          status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid'
          current_period_start: string
          current_period_end: string
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          plan_id?: string
          status?: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid'
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      admin_audit_logs: {
        Row: {
          id: string
          admin_id: string
          action_type: string
          resource_type: string
          resource_id: string | null
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action_type: string
          resource_type: string
          resource_id?: string | null
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          action_type?: string
          resource_type?: string
          resource_id?: string | null
          details?: Json | null
          created_at?: string
        }
      }

      admin_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          created_at: string
          updated_at: string
          created_by: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: Json
          created_at?: string
          updated_at?: string
          created_by: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          created_at?: string
          updated_at?: string
          created_by?: string
          updated_by?: string | null
        }
      }
    }

    Views: {
      subscription_status: {
        Row: {
          user_id: string
          is_subscribed: boolean
          plan: 'free' | 'pro' | 'premium'
          status: 'active' | 'canceled' | 'past_due' | null
          current_period_end: string | null
        }
      }
    }

    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      get_remaining_analyses: {
        Args: { target_user_id: string }
        Returns: number
      }
      has_reached_analysis_limit: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      create_analysis_with_credits: {
        Args: {
          p_user_id: string
          p_profile: Json
          p_results: Json
        }
        Returns: Database['public']['Tables']['career_analyses']['Row']
      }
      create_stripe_checkout: {
        Args: {
          price_id: string
          success_url: string
          cancel_url: string
        }
        Returns: string
      }
      get_checkout_session: {
        Args: { session_id: string }
        Returns: Json
      }
      cancel_subscription: {
        Args: Record<string, never>
        Returns: boolean
      }
      resume_subscription: {
        Args: Record<string, never>
        Returns: boolean
      }
    }

    Enums: {
      user_role: 'free' | 'pro' | 'premium' | 'admin'
      subscription_status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid'
    }
  }
}