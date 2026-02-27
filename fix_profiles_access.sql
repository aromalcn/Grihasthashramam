-- ==========================================
-- Fix Profiles Access & Data Integrity
-- ==========================================

-- 1. Helper Function: Check if user is admin (Secure)
CREATE OR REPLACE FUNCTION public.is_admin_safe()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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

-- 2. RLS: Ensure Admins can SEE ALL profiles
-- (Re-applying the View Policy to be sure)
DROP POLICY IF EXISTS "Profiles View Policy" ON profiles;
CREATE POLICY "Profiles View Policy"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id               -- User sees their own
  OR
  is_admin_safe()              -- Admin sees everyone
);

-- 3. TRIGGER: Ensure full_name is saved on Signup
-- This prevents "empty name" issues for new users.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, usertype)
  VALUES (
    new.id,
    new.email,
    -- Try to get full_name from metadata, fallback to email username or empty string
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'usertype', 'user')
  );
  RETURN new;
END;
$$;

-- Re-create the trigger to use the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. OPTIONAL: Backfill prompt for the user (Commented out safety)
-- If you need to fix EXISTING users with empty names, you might need to run a manual update:
-- UPDATE profiles 
-- SET full_name = 'User ' || substring(id::text, 1, 4) 
-- WHERE full_name IS NULL OR full_name = '';
