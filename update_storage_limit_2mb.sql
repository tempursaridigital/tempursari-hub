-- Update Storage Bucket to 2MB Limit
-- Run this in your Supabase SQL Editor

-- Update the storage bucket file size limit to 2MB
UPDATE storage.buckets 
SET file_size_limit = 2097152  -- 2MB in bytes
WHERE name = 'service-documents';

-- Verify the update
SELECT 
    name,
    public,
    file_size_limit,
    file_size_limit / 1024 / 1024 as size_mb,
    allowed_mime_types
FROM storage.buckets 
WHERE name = 'service-documents';
