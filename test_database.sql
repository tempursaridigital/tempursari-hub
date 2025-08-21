-- Test Database Connection and Data
-- Run this in your Supabase SQL Editor

-- 1. Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('service_requests', 'profiles', 'operator_notes');

-- 2. Check service_requests data
SELECT 
  COUNT(*) as total_requests,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
  COUNT(CASE WHEN status = 'on_process' THEN 1 END) as on_process,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled
FROM service_requests;

-- 3. Check profiles data
SELECT 
  user_id,
  full_name,
  role,
  created_at
FROM profiles 
WHERE role = 'operator'
ORDER BY created_at DESC;

-- 4. Test RLS policies
-- This should work if you're logged in as an operator
SELECT 
  'service_requests' as table_name,
  COUNT(*) as record_count
FROM service_requests
UNION ALL
SELECT 
  'profiles' as table_name,
  COUNT(*) as record_count
FROM profiles;

-- 5. Check recent requests
SELECT 
  request_number,
  full_name,
  service_type,
  status,
  created_at
FROM service_requests 
ORDER BY created_at DESC 
LIMIT 5;
