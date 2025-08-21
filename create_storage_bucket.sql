-- Create Storage Bucket and Policies for Service Documents
-- Run this in your Supabase SQL Editor

-- 1. Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'service-documents',
    'service-documents',
    true, -- Make it public so we can access files
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- 2. Create RLS policies for the storage bucket

-- Policy to allow anyone to view documents (for public access)
CREATE POLICY "Allow public viewing of documents" ON storage.objects
FOR SELECT USING (bucket_id = 'service-documents');

-- Policy to allow anonymous uploads to service-documents bucket
CREATE POLICY "Allow anonymous document uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'service-documents');

-- Policy to allow authenticated users to upload documents
CREATE POLICY "Allow authenticated document uploads" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'service-documents' 
    AND auth.uid() IS NOT NULL
);

-- Policy to allow operators to delete documents (optional)
CREATE POLICY "Allow operators to delete documents" ON storage.objects
FOR DELETE USING (
    bucket_id = 'service-documents' 
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('operator', 'admin')
    )
);

-- 3. Verify the bucket was created
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name = 'service-documents';

-- 4. Verify the policies were created
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%document%';

-- 5. Test bucket access (this should not error)
-- SELECT storage.get_public_url('service-documents', 'test-path') as test_url;
