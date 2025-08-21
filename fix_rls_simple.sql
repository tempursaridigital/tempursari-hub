-- Simple RLS Policy Fix - Allow operators to view all requests
-- Run this in your Supabase SQL Editor

-- 1. Drop all existing policies on service_requests
DROP POLICY IF EXISTS "Allow anonymous insertions" ON public.service_requests;
DROP POLICY IF EXISTS "Allow public status checks" ON public.service_requests;
DROP POLICY IF EXISTS "Allow operator updates" ON public.service_requests;
DROP POLICY IF EXISTS "Users can view own requests" ON public.service_requests;
DROP POLICY IF EXISTS "Allow anonymous and authenticated requests" ON public.service_requests;
DROP POLICY IF EXISTS "Anyone can view requests by NIK for status check" ON public.service_requests;
DROP POLICY IF EXISTS "Operators can view all requests" ON public.service_requests;
DROP POLICY IF EXISTS "Operators can update requests" ON public.service_requests;

-- 2. Create simple policies
-- Allow anyone to insert (for public submissions)
CREATE POLICY "Allow public insertions" ON public.service_requests
  FOR INSERT WITH CHECK (true);

-- Allow anyone to view (for status checks and operator access)
CREATE POLICY "Allow public viewing" ON public.service_requests
  FOR SELECT USING (true);

-- Allow operators to update
CREATE POLICY "Allow operator updates" ON public.service_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('operator', 'admin')
    )
  );

-- 3. Test the policies
SELECT COUNT(*) as total_requests FROM public.service_requests;
