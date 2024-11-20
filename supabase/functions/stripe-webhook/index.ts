import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Stripe from 'https://esm.sh/stripe@12.4.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient()
})

const PLANS = {
  'price_1QMzcALbngEU6IxBCH6dSTSk': 'pro',
  'price_1QMzXsLbngEU6IxBPIeuYKYP': 'premium'
} as const

const ANALYSIS_CREDITS = {
  pro: 10,
  premium: -1 // Unlimited
}

serve(async (req) => {
  try {
    // Get the stripe signature from the headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('No stripe signature found')
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')
    if (!webhookSecret) {
      throw new Error('Missing webhook secret')
    }

    // Verify the webhook
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id
        const priceId = subscription.items.data[0].price.id as keyof typeof PLANS
        const plan = PLANS[priceId]

        if (!plan) {
          throw new Error(`Invalid price ID: ${priceId}`)
        }

        // Update user profile
        await supabaseAdmin
          .from('user_profiles')
          .update({
            role: plan,
            subscription_status: subscription.status,
            subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            analysis_credits: ANALYSIS_CREDITS[plan],
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        // Downgrade to free plan
        await supabaseAdmin
          .from('user_profiles')
          .update({
            role: 'free',
            subscription_status: 'canceled',
            subscription_period_end: null,
            analysis_credits: 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})