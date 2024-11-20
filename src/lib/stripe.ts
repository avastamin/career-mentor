import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "./supabase";

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// Lazy load Stripe with error handling
let stripePromise: Promise<any> | null = null;

export const getStripe = async () => {
  if (!stripePromise) {
    if (!stripePublicKey) {
      throw new Error("Missing Stripe public key");
    }

    try {
      stripePromise = loadStripe(stripePublicKey);
    } catch (error) {
      console.error("Failed to initialize Stripe:", error);
      throw new Error("Failed to initialize payment system");
    }
  }
  return stripePromise;
};

export const createCheckoutSession = async (priceId: string) => {
  debugger;
  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("Please sign in to continue");

    debugger;
    // Call Supabase Edge Function with proper error handling
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        priceId,
        successUrl: `${window.location.origin}/dashboard/overview?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      },
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
  
      },
    });


    if (error) {
      console.error("Edge function error:", error);
      throw new Error("Failed to create checkout session");
    }

    if (!data?.sessionId) {
      throw new Error("No session ID returned");
    }

    // Load Stripe
    const stripe = await getStripe();
    if (!stripe) throw new Error("Failed to load payment system");

    // Redirect to checkout
    const { error: redirectError } = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });

    if (redirectError) throw redirectError;

    return { error: null };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return {
      error:
        error instanceof Error
          ? error
          : new Error("Failed to start checkout process"),
    };
  }
};
