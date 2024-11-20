-- Create custom settings table for secure configuration
CREATE TABLE IF NOT EXISTS app_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Function to get app setting
CREATE OR REPLACE FUNCTION get_app_setting(setting_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT value 
    FROM app_settings 
    WHERE key = setting_key
  );
END;
$$;

-- Function to set app setting
CREATE OR REPLACE FUNCTION set_app_setting(setting_key text, setting_value text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO app_settings (key, value)
  VALUES (setting_key, setting_value)
  ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value,
      updated_at = now();
END;
$$;

-- Update stripe.create_checkout_session to use app_settings
CREATE OR REPLACE FUNCTION stripe.create_checkout_session(
  customer_id text,
  price_id text,
  success_url text,
  cancel_url text,
  metadata jsonb DEFAULT '{}'::jsonb
) RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stripe_key text;
  response jsonb;
BEGIN
  -- Get Stripe secret key from app_settings
  stripe_key := get_app_setting('stripe_secret_key');
  IF stripe_key IS NULL THEN
    RAISE EXCEPTION 'Stripe secret key not configured';
  END IF;

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
    '&client_reference_id=' || (metadata->>'supabase_user_id') ||
    '&automatic_tax[enabled]=true' ||
    '&allow_promotion_codes=true' ||
    '&billing_address_collection=required'
  )::http_request);

  IF response->>'error' IS NOT NULL THEN
    RAISE EXCEPTION 'Stripe API error: %', response->>'error';
  END IF;

  RETURN response->>'id';
END;
$$;

-- Update other Stripe functions to use app_settings
CREATE OR REPLACE FUNCTION stripe.get_checkout_session(session_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stripe_key text;
  response jsonb;
BEGIN
  stripe_key := get_app_setting('stripe_secret_key');
  IF stripe_key IS NULL THEN
    RAISE EXCEPTION 'Stripe secret key not configured';
  END IF;

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

-- Update cancel subscription function
CREATE OR REPLACE FUNCTION stripe.cancel_subscription(subscription_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stripe_key text;
  response jsonb;
BEGIN
  stripe_key := get_app_setting('stripe_secret_key');
  IF stripe_key IS NULL THEN
    RAISE EXCEPTION 'Stripe secret key not configured';
  END IF;

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

-- Update resume subscription function
CREATE OR REPLACE FUNCTION stripe.resume_subscription(subscription_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stripe_key text;
  response jsonb;
BEGIN
  stripe_key := get_app_setting('stripe_secret_key');
  IF stripe_key IS NULL THEN
    RAISE EXCEPTION 'Stripe secret key not configured';
  END IF;

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