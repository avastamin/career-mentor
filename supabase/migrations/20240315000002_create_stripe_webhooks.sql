-- Create webhook handling function
CREATE OR REPLACE FUNCTION stripe.handle_webhook(
  payload jsonb,
  stripe_signature text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  event_type text;
  subscription jsonb;
  user_id uuid;
  plan text;
BEGIN
  -- Extract event type
  event_type := payload->>'type';

  -- Handle different event types
  CASE event_type
    WHEN 'customer.subscription.created',
         'customer.subscription.updated' THEN
      subscription := payload->'data'->'object';
      user_id := (subscription->'metadata'->>'supabase_user_id')::uuid;
      
      -- Determine plan from price ID
      CASE subscription->'items'->'data'->0->'price'->>'id'
        WHEN 'price_1QMzcALbngEU6IxBCH6dSTSk' THEN plan := 'pro';
        WHEN 'price_1QMzXsLbngEU6IxBPIeuYKYP' THEN plan := 'premium';
        ELSE RAISE EXCEPTION 'Invalid price ID';
      END CASE;

      -- Update user profile
      UPDATE user_profiles
      SET role = plan,
          subscription_status = subscription->>'status',
          subscription_period_end = to_timestamp((subscription->>'current_period_end')::bigint),
          updated_at = now()
      WHERE id = user_id;

    WHEN 'customer.subscription.deleted' THEN
      subscription := payload->'data'->'object';
      user_id := (subscription->'metadata'->>'supabase_user_id')::uuid;

      -- Downgrade to free plan
      UPDATE user_profiles
      SET role = 'free',
          subscription_status = 'canceled',
          subscription_period_end = null,
          updated_at = now()
      WHERE id = user_id;
  END CASE;

  RETURN jsonb_build_object('success', true);
END;
$$;