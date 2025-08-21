-- Fix for anonymous service request submissions
-- Run this in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own requests" ON public.service_requests;
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;

-- Create new policies that allow anonymous submissions
CREATE POLICY "Allow anonymous and authenticated requests" ON public.service_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous document uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'service-documents'
  );

CREATE POLICY "Allow viewing all documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'service-documents'
  );

-- Verify the changes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('service_requests') 
AND policyname LIKE '%anonymous%';
