-- Create URL encoding function
CREATE OR REPLACE FUNCTION urlencode(data text) RETURNS text LANGUAGE SQL AS $$
    SELECT regexp_replace(
        regexp_replace(
            regexp_replace(
                convert_to(data, 'UTF8'),
                E'\\\\x00([0-9a-f]{2})', E'%\\1', 'g'
            ),
            '([^a-zA-Z0-9_-])',
            E'%\\1', 'g'
        ),
        ' ', '+', 'g'
    );
$$;