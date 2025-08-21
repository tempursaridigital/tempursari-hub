-- Comprehensive RLS Policy Fix for Operator Dashboard
-- Run this in your Supabase SQL Editor

-- 1. Fix service_requests policies
DROP POLICY IF EXISTS "Users can view own requests" ON public.service_requests;
DROP POLICY IF EXISTS "Allow anonymous and authenticated requests" ON public.service_requests;
DROP POLICY IF EXISTS "Anyone can view requests by NIK for status check" ON public.service_requests;
DROP POLICY IF EXISTS "Operators can view all requests" ON public.service_requests;
DROP POLICY IF EXISTS "Operators can update requests" ON public.service_requests;

-- Create new policies
CREATE POLICY "Allow anonymous insertions" ON public.service_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public status checks" ON public.service_requests
  FOR SELECT USING (true);

CREATE POLICY "Allow operator updates" ON public.service_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('operator', 'admin')
    )
  );

-- 2. Fix operator_notes policies
DROP POLICY IF EXISTS "Operators can view all notes" ON public.operator_notes;
DROP POLICY IF EXISTS "Operators can insert notes" ON public.operator_notes;

CREATE POLICY "Allow operator notes access" ON public.operator_notes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('operator', 'admin')
    )
  );

-- 3. Fix storage policies
DROP POLICY IF EXISTS "Allow anonymous document uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow viewing all documents" ON storage.objects;
DROP POLICY IF EXISTS "Operators can view all documents" ON storage.objects;

CREATE POLICY "Allow public document access" ON storage.objects
  FOR ALL USING (bucket_id = 'service-documents');

-- 4. Verify the user is an operator
-- Check if your user has operator role
SELECT 
  p.user_id,
  p.full_name,
  p.role
FROM public.profiles p
WHERE p.user_id = 'cc73519e-b60f-4ce9-9b0c-7d6d21b4c512';

-- 5. Test the policies
-- This should return all requests if you're an operator
SELECT COUNT(*) as total_requests FROM public.service_requests;
