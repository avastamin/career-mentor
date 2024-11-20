-- Create Stripe schema
CREATE SCHEMA IF NOT EXISTS stripe;

-- Create Stripe functions
CREATE OR REPLACE FUNCTION stripe.create_checkout_session(
  customer_id text,
  price_id text,
  success_url text,
  cancel_url text,
  metadata jsonb DEFAULT '{}'::jsonb
) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stripe_key text;
  response jsonb;
BEGIN
  -- Get Stripe secret key from env
  stripe_key := current_setting('app.settings.stripe_secret_key');

  -- Create checkout session via Stripe API
  SELECT content::jsonb INTO response
  FROM http((
    'POST',
    'https://api.stripe.com/v1/checkout/sessions',
    ARRAY[http_header('Authorization', 'Bearer ' || stripe_key)],
    'application/x-www-form-urlencoded',
    'customer='        || customer_id ||
    '&line_items[0][price]='     || price_id ||
    '&line_items[0][quantity]=1' ||
    '&mode=subscription' ||
    '&success_url='     || urlencode(success_url) ||
    '&cancel_url='      || urlencode(cancel_url) ||
    '&client_reference_id=' || (metadata->>'supabase_user_id')
  )::http_request);

  RETURN response->>'id';
END;
$$;

-- Create function to get checkout session
CREATE OR REPLACE FUNCTION stripe.get_checkout_session(session_id text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stripe_key text;
  response jsonb;
BEGIN
  -- Get Stripe secret key from env
  stripe_key := current_setting('app.settings.stripe_secret_key');

  -- Get session from Stripe API
  SELECT content::jsonb INTO response
  FROM http((
    'GET',
    'https://api.stripe.com/v1/checkout/sessions/' || session_id,
    ARRAY[http_header('Authorization', 'Bearer ' || stripe_key)],
    'application/x-www-form-urlencoded',
    ''
  )::http_request);

  RETURN response;
END;
$$;

-- Create function to cancel subscription
CREATE OR REPLACE FUNCTION stripe.cancel_subscription(subscription_id text)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stripe_key text;
  response jsonb;
BEGIN
  -- Get Stripe secret key from env
  stripe_key := current_setting('app.settings.stripe_secret_key');

  -- Cancel subscription via Stripe API
  SELECT content::jsonb INTO response
  FROM http((
    'DELETE',
    'https://api.stripe.com/v1/subscriptions/' || subscription_id,
    ARRAY[http_header('Authorization', 'Bearer ' || stripe_key)],
    'application/x-www-form-urlencoded',
    ''
  )::http_request);

  RETURN true;
END;
$$;

-- Create function to resume subscription
CREATE OR REPLACE FUNCTION stripe.resume_subscription(subscription_id text)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stripe_key text;
  response jsonb;
BEGIN
  -- Get Stripe secret key from env
  stripe_key := current_setting('app.settings.stripe_secret_key');

  -- Resume subscription via Stripe API
  SELECT content::jsonb INTO response
  FROM http((
    'POST',
    'https://api.stripe.com/v1/subscriptions/' || subscription_id,
    ARRAY[http_header('Authorization', 'Bearer ' || stripe_key)],
    'application/x-www-form-urlencoded',
    'cancel_at_period_end=false'
  )::http_request);

  RETURN true;
END;
$$;

-- Create public wrapper functions
CREATE OR REPLACE FUNCTION public.create_stripe_checkout(
  price_id text,
  success_url text,
  cancel_url text
) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stripe_customer_id text;
  checkout_session_id text;
  user_id uuid;
BEGIN
  -- Get authenticated user ID
  user_id := auth.uid();
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get or create Stripe customer ID
  SELECT up.stripe_customer_id INTO stripe_customer_id
  FROM user_profiles up
  WHERE up.id = user_id;

  -- Create checkout session
  checkout_session_id := stripe.create_checkout_session(
    stripe_customer_id,
    price_id,
    success_url,
    cancel_url,
    jsonb_build_object('supabase_user_id', user_id::text)
  );

  RETURN checkout_session_id;
END;
$$;

-- Create function to get checkout session
CREATE OR REPLACE FUNCTION public.get_checkout_session(
  session_id text
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Get authenticated user ID
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  RETURN stripe.get_checkout_session(session_id);
END;
$$;

-- Create function to cancel subscription
CREATE OR REPLACE FUNCTION public.cancel_subscription()
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  subscription_id text;
BEGIN
  -- Get authenticated user ID
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get subscription ID
  SELECT s.stripe_subscription_id INTO subscription_id
  FROM subscriptions s
  WHERE s.user_id = auth.uid()
  AND s.status = 'active';

  IF subscription_id IS NULL THEN
    RAISE EXCEPTION 'No active subscription found';
  END IF;

  RETURN stripe.cancel_subscription(subscription_id);
END;
$$;

-- Create function to resume subscription
CREATE OR REPLACE FUNCTION public.resume_subscription()
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  subscription_id text;
BEGIN
  -- Get authenticated user ID
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get subscription ID
  SELECT s.stripe_subscription_id INTO subscription_id
  FROM subscriptions s
  WHERE s.user_id = auth.uid()
  AND s.status = 'canceled'
  AND s.cancel_at_period_end = true;

  IF subscription_id IS NULL THEN
    RAISE EXCEPTION 'No canceled subscription found';
  END IF;

  RETURN stripe.resume_subscription(subscription_id);
END;
$$;