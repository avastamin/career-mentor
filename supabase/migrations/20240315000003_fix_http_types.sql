-- Drop and recreate HTTP types with proper casting
DROP TYPE IF EXISTS http_request CASCADE;
DROP TYPE IF EXISTS http_response CASCADE;
DROP TYPE IF EXISTS http_header CASCADE;

-- Create HTTP types
CREATE TYPE http_header AS (
  field text,
  value text
);

CREATE TYPE http_request AS (
  method text,
  uri text,
  headers http_header[],
  content_type text,
  content text
);

CREATE TYPE http_response AS (
  status integer,
  content_type text,
  headers http_header[],
  content text
);

-- Create helper function for HTTP headers
CREATE OR REPLACE FUNCTION make_http_headers(headers jsonb)
RETURNS http_header[]
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT array_agg((key, value::text)::http_header)
  FROM jsonb_each(headers)
$$;

-- Update Stripe checkout function with proper type casting
CREATE OR REPLACE FUNCTION stripe.create_checkout_session(
  customer_id text,
  price_id text,
  success_url text,
  cancel_url text,
  metadata jsonb DEFAULT '{}'::jsonb
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stripe_key text;
  request_headers http_header[];
  request_body text;
  response jsonb;
BEGIN
  -- Get Stripe secret key
  stripe_key := get_app_setting('stripe_secret_key');
  IF stripe_key IS NULL THEN
    RAISE EXCEPTION 'Stripe secret key not configured';
  END IF;

  -- Prepare headers
  request_headers := ARRAY[
    ROW('Authorization', 'Bearer ' || stripe_key)::http_header,
    ROW('Content-Type', 'application/x-www-form-urlencoded')::http_header
  ];

  -- Prepare request body
  request_body := array_to_string(ARRAY[
    'customer=' || customer_id,
    'line_items[0][price]=' || price_id,
    'line_items[0][quantity]=1',
    'mode=subscription',
    'success_url=' || urlencode(success_url),
    'cancel_url=' || urlencode(cancel_url),
    'client_reference_id=' || (metadata->>'supabase_user_id'),
    'automatic_tax[enabled]=true',
    'allow_promotion_codes=true',
    'billing_address_collection=required'
  ], '&');

  -- Make HTTP request
  SELECT content::jsonb INTO response
  FROM http(
    (
      'POST',
      'https://api.stripe.com/v1/checkout/sessions',
      request_headers,
      'application/x-www-form-urlencoded',
      request_body
    )::http_request
  );

  IF response->>'error' IS NOT NULL THEN
    RAISE EXCEPTION 'Stripe API error: %', response->>'error';
  END IF;

  RETURN jsonb_build_object('session_id', response->>'id');
END;
$$;