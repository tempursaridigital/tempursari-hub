-- Debug Request Number Generation
-- Run this in your Supabase SQL Editor to debug the issue

-- 1. Check current request numbers
SELECT 
    request_number,
    created_at
FROM service_requests 
ORDER BY created_at DESC 
LIMIT 10;

-- 2. Check if the generate_request_number function exists
SELECT 
    proname as function_name,
    prosrc as function_body
FROM pg_proc 
WHERE proname = 'generate_request_number';

-- 3. Test the function manually
SELECT generate_request_number() as generated_number;

-- 4. Check the trigger
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'set_request_number_trigger';

-- 5. Check for any NULL request_number entries
SELECT 
    id,
    request_number,
    created_at
FROM service_requests 
WHERE request_number IS NULL 
ORDER BY created_at DESC;
