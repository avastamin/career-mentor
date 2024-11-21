
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Stripe from 'https://esm.sh/stripe@12.4.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, Cache-Control',
}

console.log(`Function "create-checkout" up and running! - By ruhul`);


serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    // Handle preflight request
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
    throw new Error('Invalid HTTP method. Only POST is allowed.');
    }

    const { priceId, successUrl, cancelUrl } = await req.json();

  if (!priceId || !successUrl || !cancelUrl) {
    throw new Error('Missing required fields: priceId, successUrl, or cancelUrl');
    }

    console.log("priceId", priceId);
    console.log("successUrl", successUrl);
    console.log("cancelUrl", cancelUrl);
    
    // Validate inputs
    if (!priceId?.startsWith('price_')) {
      throw new Error('Invalid price ID')
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient()
    })

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      {
        auth: {
          persistSession: false
        }
      }
    )

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader)
    if (userError || !user) {
      throw new Error('Invalid user')
    }

    console.log("Before get or create stripe customer", user);
    // Get or create Stripe customer
      console.log('User ID:', user.id);
      const { data:profile, error } = await supabaseClient
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) {
        console.error('No user profile found with the specified ID');
        console.error('error', error);
      }


      console.log("profile", profile);
    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      // Create new customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id
        }
      })
      console.log("stripe customer", customer);
      customerId = customer.id

      // Save customer ID
      const { data, error } = await supabaseClient
        .from('user_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating stripe_customer_id:', error.message);
      } else {
        console.log('Update successful:', data);
      }

    }

    console.log("customerId -> stripe_customer_id", customerId);
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      automatic_tax: { enabled: true },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_update: {
        address: 'auto', // Automatically save the billing address to the customer profile
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id
        }
      }
    })

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Checkout error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
}) 