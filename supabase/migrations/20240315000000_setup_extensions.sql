-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant usage permissions
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO authenticated;

-- Create alias for http function
CREATE OR REPLACE FUNCTION http(
  request http_request
) RETURNS http_response
LANGUAGE sql
SECURITY DEFINER
SET search_path = extensions
AS $$
  SELECT * FROM extensions.http_post(
    request.uri,
    request.content,
    request.content_type,
    request.headers
  );
$$;