-- Fix Storage Bucket Configuration
-- Run this in your Supabase SQL Editor

-- 1. Check if bucket exists
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name = 'service-documents';

-- 2. If bucket doesn't exist, create it
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'service-documents',
    'service-documents',
    true, -- Make it public for easier access
    2097152, -- 2MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'image/jpg']
) ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. Update existing bucket to be public if it exists
UPDATE storage.buckets 
SET 
    public = true,
    file_size_limit = 2097152,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'image/jpg']
WHERE name = 'service-documents';

-- 4. Drop existing policies and recreate them
DROP POLICY IF EXISTS "Allow anonymous document uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow viewing all documents" ON storage.objects;
DROP POLICY IF EXISTS "Operators can view all documents" ON storage.objects;

-- 5. Create new policies
CREATE POLICY "Allow anonymous document uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'service-documents');

CREATE POLICY "Allow public viewing of documents" ON storage.objects
FOR SELECT USING (bucket_id = 'service-documents');

CREATE POLICY "Allow operators to manage documents" ON storage.objects
FOR ALL USING (
    bucket_id = 'service-documents' 
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('operator', 'admin')
    )
);

-- 6. Verify the setup
SELECT 
    'Bucket Status' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'service-documents') 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as result
UNION ALL
SELECT 
    'Bucket Public' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'service-documents' AND public = true) 
        THEN 'YES' 
        ELSE 'NO' 
    END as result;

-- 7. Show all storage policies
SELECT 
    policyname,
    cmd as command,
    qual as condition
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%document%'
ORDER BY policyname;
