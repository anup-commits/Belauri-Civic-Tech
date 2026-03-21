/*
  # BELAURI FIRST - Social Activism Platform Database Schema

  ## Overview
  Complete database structure for a social activism platform focused on anti-corruption,
  youth empowerment, and civic engagement in Belauri Municipality, Nepal.

  ## New Tables

  ### 1. `profiles`
  Extended user profile information linked to auth.users
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text)
  - `avatar_url` (text, optional)
  - `bio` (text, optional)
  - `location` (text, optional)
  - `is_admin` (boolean, default false)
  - `is_verified` (boolean, default false)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `reports`
  Corruption and civic issue reports submitted by users or anonymously
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles, nullable for anonymous)
  - `title` (text)
  - `description` (text)
  - `category` (text: corruption, infrastructure, public_service, other)
  - `location` (text, optional)
  - `latitude` (numeric, optional)
  - `longitude` (numeric, optional)
  - `image_url` (text, optional)
  - `is_anonymous` (boolean, default false)
  - `status` (text: pending, approved, rejected, resolved)
  - `upvotes_count` (integer, default 0)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `posts`
  News, blog posts, and updates from admins
  - `id` (uuid, primary key)
  - `author_id` (uuid, references profiles)
  - `title` (text)
  - `slug` (text, unique)
  - `content` (text)
  - `excerpt` (text)
  - `featured_image` (text, optional)
  - `category` (text: news, blog, update, campaign)
  - `is_published` (boolean, default false)
  - `views_count` (integer, default 0)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `events`
  Activism events, meetups, and campaigns
  - `id` (uuid, primary key)
  - `organizer_id` (uuid, references profiles)
  - `title` (text)
  - `description` (text)
  - `event_date` (timestamptz)
  - `location` (text)
  - `image_url` (text, optional)
  - `is_published` (boolean, default false)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. `gallery`
  Images and media from activism work
  - `id` (uuid, primary key)
  - `uploaded_by` (uuid, references profiles)
  - `title` (text)
  - `description` (text, optional)
  - `media_url` (text)
  - `media_type` (text: image, video)
  - `is_published` (boolean, default false)
  - `created_at` (timestamptz)

  ### 6. `comments`
  Comments on posts and reports
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `post_id` (uuid, references posts, nullable)
  - `report_id` (uuid, references reports, nullable)
  - `content` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. `report_votes`
  Upvoting system for community validation of reports
  - `id` (uuid, primary key)
  - `report_id` (uuid, references reports)
  - `user_id` (uuid, references profiles)
  - `created_at` (timestamptz)
  - Unique constraint on (report_id, user_id)

  ## Security
  - RLS enabled on all tables
  - Public read access for approved/published content
  - Authenticated users can create content
  - Only admins can approve/reject reports and manage content
  - Users can only edit their own content
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_url text,
  bio text,
  location text,
  is_admin boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('corruption', 'infrastructure', 'public_service', 'other')),
  location text,
  latitude numeric,
  longitude numeric,
  image_url text,
  is_anonymous boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'resolved')),
  upvotes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  featured_image text,
  category text NOT NULL CHECK (category IN ('news', 'blog', 'update', 'campaign')),
  is_published boolean DEFAULT false,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  event_date timestamptz NOT NULL,
  location text NOT NULL,
  image_url text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  media_url text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (
    (post_id IS NOT NULL AND report_id IS NULL) OR
    (post_id IS NULL AND report_id IS NOT NULL)
  )
);

-- Create report_votes table
CREATE TABLE IF NOT EXISTS report_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(report_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_report ON comments(report_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for reports
CREATE POLICY "Approved reports are viewable by everyone"
  ON reports FOR SELECT
  USING (status = 'approved' OR status = 'resolved');

CREATE POLICY "Authenticated users can view all reports"
  ON reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create reports"
  ON reports FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own reports if pending"
  ON reports FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND status = 'pending')
  WITH CHECK (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can update any report"
  ON reports FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Admins can delete reports"
  ON reports FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- RLS Policies for posts
CREATE POLICY "Published posts are viewable by everyone"
  ON posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Admins can update posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Admins can delete posts"
  ON posts FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- RLS Policies for events
CREATE POLICY "Published events are viewable by everyone"
  ON events FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Admins can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Admins can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- RLS Policies for gallery
CREATE POLICY "Published gallery items are viewable by everyone"
  ON gallery FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all gallery items"
  ON gallery FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can create gallery items"
  ON gallery FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Admins can update gallery items"
  ON gallery FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Admins can delete gallery items"
  ON gallery FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any comment"
  ON comments FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- RLS Policies for report_votes
CREATE POLICY "Votes are viewable by everyone"
  ON report_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create votes"
  ON report_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes"
  ON report_votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update upvotes count
CREATE OR REPLACE FUNCTION update_report_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reports
    SET upvotes_count = upvotes_count + 1
    WHERE id = NEW.report_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reports
    SET upvotes_count = upvotes_count - 1
    WHERE id = OLD.report_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for upvotes count
DROP TRIGGER IF EXISTS trigger_update_report_upvotes ON report_votes;
CREATE TRIGGER trigger_update_report_upvotes
  AFTER INSERT OR DELETE ON report_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_report_upvotes();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_reports_updated_at ON reports;
CREATE TRIGGER trigger_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_posts_updated_at ON posts;
CREATE TRIGGER trigger_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_events_updated_at ON events;
CREATE TRIGGER trigger_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_comments_updated_at ON comments;
CREATE TRIGGER trigger_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();