-- Test Request Number Generation
-- Run this in your Supabase SQL Editor to test the new system

-- 1. Check current request numbers for today
SELECT 
    request_number,
    created_at,
    full_name
FROM service_requests 
WHERE request_number LIKE 'REQ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-%'
ORDER BY request_number DESC;

-- 2. Check for any duplicate request numbers
SELECT 
    request_number,
    COUNT(*) as count
FROM service_requests 
GROUP BY request_number 
HAVING COUNT(*) > 1;

-- 3. Check for NULL or empty request numbers
SELECT 
    id,
    request_number,
    created_at
FROM service_requests 
WHERE request_number IS NULL OR request_number = ''
ORDER BY created_at DESC;

-- 4. Show request number pattern analysis
SELECT 
    SUBSTRING(request_number FROM 1 FOR 13) as date_prefix,
    COUNT(*) as count,
    MIN(request_number) as first_number,
    MAX(request_number) as last_number
FROM service_requests 
WHERE request_number IS NOT NULL
GROUP BY SUBSTRING(request_number FROM 1 FOR 13)
ORDER BY date_prefix DESC
LIMIT 10;

-- 5. Verify uniqueness constraint is working
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'service_requests' 
AND indexname LIKE '%request_number%';
