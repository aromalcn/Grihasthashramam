-- ==========================================
-- Fix Infinite Recursion in Profiles RLS
-- ==========================================

-- Problem: RLS policies that check "usertype" on the "profiles" table itself can cause infinite recursion
-- because the check triggers the policy again.
-- Solution: Use a "SECURITY DEFINER" function which runs with owner privileges, bypassing RLS for the check.

-- 1. Create a secure function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin_safe()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- IMPORTANT: Bypasses RLS
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND usertype = 'admin'
  );
END;
$$;

-- 2. Drop existing policies to be safe (drop all potential conflicting ones)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;
DROP POLICY IF EXISTS "Users can see own profile" ON profiles;

-- Drop the policies we are about to create to ensure idempotency
DROP POLICY IF EXISTS "Profiles View Policy" ON profiles;
DROP POLICY IF EXISTS "Profiles Update Policy" ON profiles;
DROP POLICY IF EXISTS "Profiles Insert Policy" ON profiles;
DROP POLICY IF EXISTS "Profiles Delete Policy" ON profiles;

-- 3. Re-create clean policies

-- A. VIEW: Users can see their own profile, Admins can see ALL.
CREATE POLICY "Profiles View Policy"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id               -- User sees their own
  OR
  is_admin_safe()              -- Admin sees everyone (via secure function)
);

-- B. UPDATE: Users can update their own, Admins can update ALL.
CREATE POLICY "Profiles Update Policy"
ON profiles FOR UPDATE
TO authenticated
USING (
  auth.uid() = id
  OR
  is_admin_safe()
);

-- C. INSERT: Usually handled by triggers, but allow self-insert just in case.
CREATE POLICY "Profiles Insert Policy"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id
);

-- D. DELETE: Admins only
CREATE POLICY "Profiles Delete Policy"
ON profiles FOR DELETE
TO authenticated
USING (
  is_admin_safe()
);
