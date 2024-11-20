import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Stripe from 'https://esm.sh/stripe@12.4.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

// Map price IDs to plan names
const PLANS = {
  'price_1QMzcALbngEU6IxBCH6dSTSk': 'pro',
  'price_1QMzXsLbngEU6IxBPIeuYKYP': 'premium'
} as const

// Map subscription status to analysis credits
const ANALYSIS_CREDITS = {
  pro: 10,
  premium: -1 // Unlimited
}

serve(async (req) => {
  try {
    // Verify webhook signature
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('No Stripe signature found')
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')
    if (!webhookSecret) {
      throw new Error('Missing webhook secret')
    }

    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    // Initialize Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

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

        // Update user profile with new subscription details
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            role: plan,
            subscription_status: subscription.status,
            subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            analysis_credits: ANALYSIS_CREDITS[plan],
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        if (updateError) {
          throw updateError
        }

        // Log subscription event
        await supabase.from('admin_audit_logs').insert({
          admin_id: 'system',
          action_type: 'subscription_updated',
          resource_type: 'subscriptions',
          resource_id: subscription.id,
          details: {
            plan,
            status: subscription.status,
            price_id: priceId
          }
        })

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        // Downgrade to free plan
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            role: 'free',
            subscription_status: 'canceled',
            subscription_period_end: null,
            analysis_credits: 1, // Free tier gets 1 analysis
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        if (updateError) {
          throw updateError
        }

        // Log subscription cancellation
        await supabase.from('admin_audit_logs').insert({
          admin_id: 'system',
          action_type: 'subscription_canceled',
          resource_type: 'subscriptions',
          resource_id: subscription.id,
          details: {
            previous_plan: subscription.items.data[0].price.id,
            cancel_reason: subscription.cancellation_details?.reason || 'unknown'
          }
        })

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        if (!invoice.subscription) break

        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
        const userId = subscription.metadata.supabase_user_id

        // Update subscription status
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            subscription_status: 'past_due',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        if (updateError) {
          throw updateError
        }

        // Log payment failure
        await supabase.from('admin_audit_logs').insert({
          admin_id: 'system',
          action_type: 'payment_failed',
          resource_type: 'invoices',
          resource_id: invoice.id,
          details: {
            subscription_id: invoice.subscription,
            amount: invoice.amount_due,
            currency: invoice.currency
          }
        })

        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})