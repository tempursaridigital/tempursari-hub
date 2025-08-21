-- Cleanup Request Numbers
-- Run this in your Supabase SQL Editor to clean up any issues

-- 1. Check for duplicate request numbers
SELECT 
    request_number,
    COUNT(*) as count
FROM service_requests 
WHERE request_number IS NOT NULL 
GROUP BY request_number 
HAVING COUNT(*) > 1;

-- 2. Check for NULL or empty request numbers
SELECT 
    id,
    request_number,
    created_at
FROM service_requests 
WHERE request_number IS NULL OR request_number = ''
ORDER BY created_at DESC;

-- 3. Delete any records with NULL or empty request numbers (if any exist)
-- Uncomment the line below if you want to delete them
-- DELETE FROM service_requests WHERE request_number IS NULL OR request_number = '';

-- 4. If you have duplicates, you can keep the oldest one and delete the rest
-- (Only run this if you have duplicates and want to clean them up)
-- WITH duplicates AS (
--   SELECT 
--     id,
--     request_number,
--     created_at,
--     ROW_NUMBER() OVER (PARTITION BY request_number ORDER BY created_at ASC) as rn
--   FROM service_requests 
--   WHERE request_number IS NOT NULL
-- )
-- DELETE FROM service_requests 
-- WHERE id IN (
--   SELECT id FROM duplicates WHERE rn > 1
-- );

-- 5. Verify cleanup
SELECT 
    COUNT(*) as total_requests,
    COUNT(DISTINCT request_number) as unique_request_numbers,
    COUNT(*) - COUNT(DISTINCT request_number) as duplicates
FROM service_requests;
