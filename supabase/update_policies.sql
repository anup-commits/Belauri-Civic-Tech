-- update_policies.sql
-- This updates the policies to allow the frontend to access, update, and delete all posts.
-- Note: This is for demo purposes only to allow the hardcoded password admin panel to function.

-- 1. Drop existing restricted SELECT policy
DROP POLICY IF EXISTS "Public can view approved posts" ON posts;

-- 2. Allow SELECTing all posts (so the Admin panel can load 'pending' ones)
CREATE POLICY "Demo allow select all posts" 
ON posts FOR SELECT 
USING (true);

-- 3. Allow UPDATE (so the Admin panel can approve/reject posts)
DROP POLICY IF EXISTS "Demo allow update posts" ON posts;
CREATE POLICY "Demo allow update posts" 
ON posts FOR UPDATE 
USING (true);

-- 4. Allow DELETE (so the Admin panel can permanently delete posts)
DROP POLICY IF EXISTS "Demo allow delete posts" ON posts;
CREATE POLICY "Demo allow delete posts" 
ON posts FOR DELETE 
USING (true);
