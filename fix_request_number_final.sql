-- Final Fix for Request Number Generation
-- Run this in your Supabase SQL Editor

-- 1. Drop existing function and trigger
DROP TRIGGER IF EXISTS set_request_number_trigger ON public.service_requests;
DROP FUNCTION IF EXISTS public.set_request_number();
DROP FUNCTION IF EXISTS public.generate_request_number();

-- 2. Create a robust request number generation function
CREATE OR REPLACE FUNCTION public.generate_request_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    today_str TEXT;
    next_number INTEGER;
    request_number TEXT;
BEGIN
    -- Get today's date in YYYYMMDD format
    today_str := TO_CHAR(NOW(), 'YYYYMMDD');
    
    -- Get the next sequential number for today
    SELECT COALESCE(MAX(CAST(SUBSTRING(sr.request_number FROM 13) AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.service_requests sr
    WHERE sr.request_number LIKE 'REQ-' || today_str || '-%';
    
    -- Format the request number
    request_number := 'REQ-' || today_str || '-' || LPAD(next_number::TEXT, 4, '0');
    
    -- Double-check for uniqueness (handle race conditions)
    WHILE EXISTS (SELECT 1 FROM public.service_requests WHERE request_number = request_number) LOOP
        next_number := next_number + 1;
        request_number := 'REQ-' || today_str || '-' || LPAD(next_number::TEXT, 4, '0');
    END LOOP;
    
    RETURN request_number;
END;
$$;

-- 3. Create trigger function
CREATE OR REPLACE FUNCTION public.set_request_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only generate request number if it's not already set
    IF NEW.request_number IS NULL OR NEW.request_number = '' THEN
        NEW.request_number := generate_request_number();
    END IF;
    
    RETURN NEW;
END;
$$;

-- 4. Create the trigger
CREATE TRIGGER set_request_number_trigger
    BEFORE INSERT ON public.service_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.set_request_number();

-- 5. Test the function
SELECT generate_request_number() as test_number_1;
SELECT generate_request_number() as test_number_2;
SELECT generate_request_number() as test_number_3;

-- 6. Fix any existing NULL request numbers
UPDATE public.service_requests 
SET request_number = generate_request_number()
WHERE request_number IS NULL OR request_number = '';

-- 7. Verify the fix
SELECT 
    'Function exists' as check_type,
    CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'generate_request_number') 
         THEN 'YES' ELSE 'NO' END as result
UNION ALL
SELECT 
    'Trigger exists' as check_type,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'set_request_number_trigger') 
         THEN 'YES' ELSE 'NO' END as result;
