-- Create Stripe schema
CREATE SCHEMA IF NOT EXISTS stripe;

-- Create function to handle Stripe API calls
CREATE OR REPLACE FUNCTION stripe.api_call(
  method text,
  endpoint text,
  body text DEFAULT ''
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stripe_key text;
  url text;
  response http_response;
BEGIN
  -- Get Stripe secret key
  stripe_key := get_app_setting('stripe_secret_key');
  IF stripe_key IS NULL THEN
    RAISE EXCEPTION 'Stripe secret key not configured';
  END IF;

  -- Build URL
  url := 'https://api.stripe.com/v1/' || endpoint;

  -- Make API call
  SELECT * INTO response
  FROM http((
    method,
    url,
    ARRAY[
      ROW('Authorization', 'Bearer ' || stripe_key)::http_header,
      ROW('Content-Type', 'application/x-www-form-urlencoded')::http_header
    ],
    'application/x-www-form-urlencoded',
    body
  )::http_request);

  -- Parse and return response
  RETURN response.content::jsonb;
END;
$$;

-- Create checkout session function
CREATE OR REPLACE FUNCTION public.create_stripe_checkout(
  price_id text,
  success_url text,
  cancel_url text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id uuid;
  customer_id text;
  body text;
  response jsonb;
BEGIN
  -- Get authenticated user
  user_id := auth.uid();
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get or create Stripe customer
  SELECT stripe_customer_id INTO customer_id
  FROM user_profiles
  WHERE id = user_id;

  -- Build request body
  body := array_to_string(ARRAY[
    'customer=' || customer_id,
    'line_items[0][price]=' || price_id,
    'line_items[0][quantity]=1',
    'mode=subscription',
    'success_url=' || urlencode(success_url),
    'cancel_url=' || urlencode(cancel_url),
    'client_reference_id=' || user_id::text,
    'automatic_tax[enabled]=true',
    'allow_promotion_codes=true',
    'billing_address_collection=required'
  ], '&');

  -- Create checkout session
  response := stripe.api_call(
    'POST',
    'checkout/sessions',
    body
  );

  -- Handle errors
  IF response ? 'error' THEN
    RAISE EXCEPTION 'Stripe error: %', response->>'error';
  END IF;

  RETURN jsonb_build_object('session_id', response->>'id');
END;
$$;