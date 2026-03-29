-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create posts table
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  image_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  approved_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone (public + anon) can view approved posts
CREATE POLICY "Public can view approved posts" 
ON posts FOR SELECT 
USING (status = 'approved');

-- Policy 2: Authenticated users (including anonymous) can insert
CREATE POLICY "Authenticated users can insert posts" 
ON posts FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- Create Storage Bucket for post images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Anon auth uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'post-images' AND auth.uid() = owner);

CREATE POLICY "Public view images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'post-images');

CREATE POLICY "Admin delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'post-images');

-- Enable Realtime for posts table
ALTER PUBLICATION supabase_realtime ADD TABLE posts;

-- Seed Data (Optional, just to start)
-- You can run these lines after getting the first admin or using an anon user id for created_by
-- INSERT INTO posts (title, description, category, status) VALUES 
-- ('Cleaning up the Bagmati River', 'A huge campaign by 500 volunteers...', 'Environment', 'approved'),
-- ('Awareness camp at Local School', 'Taught kids about their rights...', 'Education', 'approved');
