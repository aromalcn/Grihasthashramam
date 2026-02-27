-- ==========================================
-- Fix Orders RLS Policies
-- ==========================================

-- 1. Enable RLS on the table (idempotent)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to start fresh and avoid conflicts
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders; -- If you have this
DROP POLICY IF EXISTS "Orders View Policy" ON orders;
DROP POLICY IF EXISTS "Orders Insert Policy" ON orders;
DROP POLICY IF EXISTS "Orders Update Policy" ON orders;
DROP POLICY IF EXISTS "Orders Delete Policy" ON orders;

-- 3. Create new clean policies

-- A. VIEW: Users see their own, Admins see all (using secure function from previous fix)
CREATE POLICY "Orders View Policy"
ON orders FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR
  is_admin_safe()
);

-- B. INSERT: Users can create orders for themselves
CREATE POLICY "Orders Insert Policy"
ON orders FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

-- C. UPDATE: Admins can update orders (e.g. change status), Users generally shouldn't update after placement
-- unless you want them to be able to cancel pending orders.
CREATE POLICY "Orders Update Policy"
ON orders FOR UPDATE
TO authenticated
USING (
  is_admin_safe()
);

-- D. DELETE: Admins only
CREATE POLICY "Orders Delete Policy"
ON orders FOR DELETE
TO authenticated
USING (
  is_admin_safe()
);
