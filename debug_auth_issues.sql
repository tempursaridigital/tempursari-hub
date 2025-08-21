-- Debug Authentication Issues
-- Run this in your Supabase SQL Editor to check auth setup

-- 1. Check if profiles table exists and has data
SELECT 
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN role = 'operator' THEN 1 END) as operators,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
    COUNT(CASE WHEN role = 'user' THEN 1 END) as users
FROM profiles;

-- 2. Show all operator profiles
SELECT 
    user_id,
    full_name,
    role,
    created_at
FROM profiles 
WHERE role IN ('operator', 'admin')
ORDER BY created_at DESC;

-- 3. Check RLS policies on profiles table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- 4. Check if auth.users has matching records
SELECT 
    p.user_id,
    p.full_name,
    p.role,
    CASE 
        WHEN au.id IS NOT NULL THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as auth_user_exists
FROM profiles p
LEFT JOIN auth.users au ON p.user_id = au.id
WHERE p.role IN ('operator', 'admin');

-- 5. Test RLS policy (this should work if you're authenticated as an operator)
-- If this returns no results, there might be an RLS issue
SELECT 
    'RLS Test - Can access profiles' as test_name,
    COUNT(*) as accessible_profiles
FROM profiles;
