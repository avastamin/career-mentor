import { supabase } from './supabase';
import type { CareerProfile, CareerAnalysis } from './types';
import type { CareerAnalysisRecord } from './supabase-types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOperation<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && (
      error instanceof Error && (
        error.message.includes('Failed to fetch') ||
        error.message.includes('network') ||
        error.message.includes('timeout')
      )
    )) {
      await wait(delay);
      return retryOperation(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function canCreateAnalysis(userId: string): Promise<boolean> {
  try {
    console.log('Checking analysis permission for user:', userId);
    
    const { data, error } = await supabase
      .rpc('has_reached_analysis_limit', { 
        target_user_id: userId 
      });
    
    if (error) {
      console.error('Error checking analysis permission:', error);
      throw error;
    }

    // Function returns true if limit is reached, so we invert it
    return !data;
  } catch (error) {
    console.error('Error checking analysis permission:', error);
    throw error;
  }
}

export async function getRemainingAnalyses(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .rpc('get_remaining_analyses', { 
        target_user_id: userId 
      });
    
    if (error) {
      console.error('Error getting remaining analyses:', error);
      throw error;
    }

    // Ensure we return a number
    return typeof data === 'number' ? data : 0;
  } catch (error) {
    console.error('Error getting remaining analyses:', error);
    // Return 0 instead of throwing to prevent UI breaks
    return 0;
  }
}

// In career-storage.ts

// In career-storage.ts
export async function saveCareerAnalysis(
  userId: string,
  profile: CareerProfile,
  results: CareerAnalysis
): Promise<CareerAnalysisRecord> {
  return retryOperation(async () => {
    try {
      const { data: analysis, error: analysisError } = await supabase
        .rpc('create_analysis_with_credits', {
          p_user_id: userId,
          p_profile: profile,
          p_results: results
        });

      if (analysisError) throw analysisError;
      if (!analysis) throw new Error('No data returned from insert');
      
      return analysis;
    } catch (error) {
      console.error('Error saving career analysis:', error);
      throw error;
    }
  });
}

export async function getLatestCareerAnalysis(userId: string): Promise<CareerAnalysisRecord | null> {
  return retryOperation(async () => {
    try {
      console.log('Fetching latest analysis for user:', userId);
      
      const { data, error } = await supabase
        .from('career_analyses')
        .select()
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching career analysis:', error);
      throw error;
    }
  });
}