-- Update create_stripe_checkout function to handle URL encoding properly
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
    ARRAY[
      http_header('Authorization', 'Bearer ' || stripe_key),
      http_header('Content-Type', 'application/x-www-form-urlencoded')
    ],
    'application/x-www-form-urlencoded',
    array_to_string(ARRAY[
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
    ], '&')
  )::http_request);

  IF response->>'error' IS NOT NULL THEN
    RAISE EXCEPTION 'Stripe API error: %', response->>'error';
  END IF;

  RETURN jsonb_build_object('session_id', response->>'id');
END;
$$;