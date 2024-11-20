-- Create function to handle Stripe checkout creation
create or replace function public.create_stripe_checkout(
  price_id text,
  success_url text,
  cancel_url text
) returns text
language plpgsql security definer
set search_path = public
as $$
declare
  stripe_customer_id text;
  checkout_session_id text;
  user_id uuid;
begin
  -- Get authenticated user ID
  user_id := auth.uid();
  if user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Get or create Stripe customer ID
  select up.stripe_customer_id into stripe_customer_id
  from user_profiles up
  where up.id = user_id;

  -- Create checkout session via Stripe API
  select checkout_session.id into checkout_session_id
  from stripe.create_checkout_session(
    stripe_customer_id,
    price_id,
    success_url,
    cancel_url,
    jsonb_build_object(
      'supabase_user_id', user_id::text
    )
  );

  return checkout_session_id;
end;
$$;

-- Function to get checkout session
create or replace function public.get_checkout_session(
  session_id text
) returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  checkout_data jsonb;
begin
  -- Get authenticated user ID
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  -- Get checkout session from Stripe
  select session.data into checkout_data
  from stripe.get_checkout_session(session_id);

  return checkout_data;
end;
$$;

-- Function to cancel subscription
create or replace function public.cancel_subscription()
returns boolean
language plpgsql security definer
set search_path = public
as $$
declare
  subscription_id text;
begin
  -- Get authenticated user ID
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  -- Get subscription ID
  select s.stripe_subscription_id into subscription_id
  from subscriptions s
  where s.user_id = auth.uid()
  and s.status = 'active';

  if subscription_id is null then
    raise exception 'No active subscription found';
  end if;

  -- Cancel subscription via Stripe
  perform stripe.cancel_subscription(subscription_id);

  return true;
end;
$$;

-- Function to resume canceled subscription
create or replace function public.resume_subscription()
returns boolean
language plpgsql security definer
set search_path = public
as $$
declare
  subscription_id text;
begin
  -- Get authenticated user ID
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  -- Get subscription ID
  select s.stripe_subscription_id into subscription_id
  from subscriptions s
  where s.user_id = auth.uid()
  and s.status = 'canceled'
  and s.cancel_at_period_end = true;

  if subscription_id is null then
    raise exception 'No canceled subscription found';
  end if;

  -- Resume subscription via Stripe
  perform stripe.resume_subscription(subscription_id);

  return true;
end;
$$;