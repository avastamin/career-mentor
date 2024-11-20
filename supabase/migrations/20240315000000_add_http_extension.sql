-- Enable HTTP extension for Stripe API calls
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Grant usage to authenticated users
GRANT USAGE ON SCHEMA extensions TO authenticated;

-- Create Stripe schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS stripe;

-- Create function to handle HTTP requests
CREATE TYPE http_request AS (
  method text,
  uri text,
  headers http_header[],
  content_type text,
  content text
);

-- Create function to handle HTTP responses
CREATE TYPE http_response AS (
  status int,
  content_type text,
  headers http_header[],
  content text
);

-- Create type for HTTP headers
CREATE TYPE http_header AS (
  field text,
  value text
);