-- Check Storage Policies for service-documents bucket
-- Run this in your Supabase SQL Editor to verify storage access

-- 1. Check if the bucket exists
SELECT name, public FROM storage.buckets WHERE name = 'service-documents';

-- 2. Check storage policies
SELECT 
    policyname,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects' 
AND policyname LIKE '%service-documents%';

-- 3. If you need to create public access policies, run these:
-- (Only run if the policies don't exist)

-- Allow public viewing of documents
-- INSERT INTO storage.policies (name, bucket_id, definition, check_expression, command)
-- VALUES (
--   'Allow viewing all documents',
--   'service-documents',
--   'true',
--   'true',
--   'SELECT'
-- );

-- Allow anonymous uploads (if needed)
-- INSERT INTO storage.policies (name, bucket_id, definition, check_expression, command)
-- VALUES (
--   'Allow anonymous document uploads',
--   'service-documents',
--   'true',
--   'true',
--   'INSERT'
-- );
