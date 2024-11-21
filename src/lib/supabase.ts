import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase-types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Improved retry functionality with exponential backoff
interface RetryOptions {
  retries?: number;
  retryDelay?: number;
  onRetry?: (attempt: number, error: any) => void;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit & RetryOptions
): Promise<Response> {
  const { retries = 3, retryDelay = 1000, onRetry, ...fetchOptions } = options;
  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);

      // Only retry on network errors or 5xx server errors
      if (!response.ok && response.status >= 500) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error as Error;

      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt);
        console.warn(
          `Attempt ${attempt + 1} failed, retrying in ${delay}ms:`,
          error
        );

        if (onRetry) {
          onRetry(attempt, error);
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      break;
    }
  }

  throw lastError;
}

// Initialize Supabase client with improved configuration


export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: "sb-" + supabaseUrl.split("//")[1] + "-auth-token",
    flowType: "pkce",
  },
  global: {
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    },
  },
  db: {
    schema: "public",
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },

  // Add retry configuration
  fetch: (url, options = {}) => {
    return fetchWithRetry(url, {
      ...options,
      retries: 3,
      retryDelay: 1000,
    });
  },
});

// Add retry functionality for operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  shouldRetry: (error: any) => boolean = () => true
): Promise<T> => {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Check if we should retry this error
      if (!shouldRetry(error)) {
        throw error;
      }

      console.warn(`Attempt ${i + 1} failed:`, error);

      if (i < maxRetries - 1) {
        const backoffDelay = delay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        continue;
      }
    }
  }

  throw lastError;
};

// Add error handling wrapper with improved error messages
export const handleSupabaseError = (error: any) => {
  console.error("Supabase error:", error);

  if (error?.message?.includes("Failed to fetch")) {
    return new Error(
      "Unable to connect to the server. Please check your internet connection and try again."
    );
  }

  if (error?.code === "PGRST202") {
    return new Error(
      "The requested operation is not available. Please try again later."
    );
  }

  if (error?.status === 401 || error?.message?.includes("401")) {
    // Clear auth state and redirect to sign in
    localStorage.removeItem("sb-" + supabaseUrl.split("//")[1] + "-auth-token");
    window.location.href = "/signin?error=session_expired";
    return new Error("Your session has expired. Please sign in again.");
  }

  if (error?.code === "23505") {
    return new Error("This record already exists.");
  }

  if (error?.code === "23503") {
    return new Error("This operation would violate data integrity rules.");
  }

  return new Error(
    error?.message || error?.error_description || "An unexpected error occurred"
  );
};

// Add session refresh helper with retry
export const refreshSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await withRetry(
      () => supabase.auth.getSession(),
      3,
      1000,
      (error) => {
        // Only retry on network errors
        return error?.message?.includes("Failed to fetch");
      }
    );

    if (error) throw error;

    if (!session) {
      localStorage.removeItem(
        "sb-" + supabaseUrl.split("//")[1] + "-auth-token"
      );
      window.location.href = "/signin?error=no_session";
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error refreshing session:", error);
    return null;
  }
};

// Add auth state check helper
export const isAuthenticated = async () => {
  const session = await refreshSession();
  return !!session;
};
