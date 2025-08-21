-- Fix the request number generation function
-- Run this in your Supabase SQL Editor

-- Drop and recreate the function with proper column references
CREATE OR REPLACE FUNCTION public.generate_request_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  today_str TEXT;
  counter INTEGER;
  request_number TEXT;
BEGIN
  today_str := to_char(now(), 'YYYYMMDD');
  
  -- Get the next counter for today (fix ambiguous column reference)
  SELECT COALESCE(MAX(CAST(SUBSTRING(sr.request_number FROM 13) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.service_requests sr
  WHERE sr.request_number LIKE 'REQ-' || today_str || '-%';
  
  request_number := 'REQ-' || today_str || '-' || LPAD(counter::TEXT, 4, '0');
  
  RETURN request_number;
END;
$$;

-- Recreate the trigger function
CREATE OR REPLACE FUNCTION public.set_request_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.request_number IS NULL OR NEW.request_number = '' THEN
    NEW.request_number := public.generate_request_number();
  END IF;
  RETURN NEW;
END;
$$;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS set_request_number_trigger ON public.service_requests;

CREATE TRIGGER set_request_number_trigger
  BEFORE INSERT ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.set_request_number();

-- Test the function
SELECT public.generate_request_number();
