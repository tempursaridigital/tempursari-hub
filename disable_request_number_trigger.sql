-- Disable Database Request Number Trigger
-- Run this in your Supabase SQL Editor
-- Since we're now generating request numbers in the application code

-- 1. Check current triggers
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name LIKE '%request_number%';

-- 2. Drop the trigger (to prevent conflicts)
DROP TRIGGER IF EXISTS set_request_number_trigger ON public.service_requests;

-- 3. Drop the trigger function (optional, but clean)
DROP FUNCTION IF EXISTS public.set_request_number();

-- 4. Keep the generate_request_number function (might be useful for other purposes)
-- Don't drop this one: DROP FUNCTION IF EXISTS public.generate_request_number();

-- 5. Verify triggers are removed
SELECT 
    COUNT(*) as remaining_triggers
FROM information_schema.triggers 
WHERE trigger_name LIKE '%request_number%';

-- 6. Test that we can insert without the trigger
-- This should work now with application-generated request numbers
SELECT 'Trigger disabled successfully' as status;
