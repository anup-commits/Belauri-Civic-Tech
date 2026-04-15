-- Belauri First V2 Platform Setup
-- IMPORTANT: Run this in the Supabase SQL Editor.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Auth Users extension)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'volunteer', 'citizen')) DEFAULT 'citizen',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'citizen'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Modify or Re-create Reports Table
-- We will rename the existing 'posts' table or create 'reports'
-- Dropping existing reports/posts if modifying heavily, or just mapping to a new schema
-- Make sure to back up if you have prod data. Assuming dev environment.
DROP TABLE IF EXISTS public.case_updates CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;

CREATE TABLE public.reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for anon
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Corruption', 'Infrastructure', 'Public Service', 'Environment', 'Education', 'Other')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'under_review', 'in_progress', 'resolved', 'rejected')) DEFAULT 'pending',
    image_url TEXT,
    location_text TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    is_anonymous BOOLEAN DEFAULT false,
    resolution_note TEXT,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Case Updates Timeline
CREATE TABLE public.case_updates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    update_text TEXT NOT NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Social Interactions (Comments, Likes)
CREATE TABLE public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Must be logged in to comment
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE public.likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(report_id, user_id)
);

-- 5. Notifications
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Reports RLS
CREATE POLICY "Reports are viewable by everyone." ON public.reports FOR SELECT USING (true);
CREATE POLICY "Anyone can insert a report." ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins and volunteers can update reports." ON public.reports FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'volunteer')
  )
);

-- Case Updates RLS
CREATE POLICY "Updates viewable by everyone." ON public.case_updates FOR SELECT USING (true);
CREATE POLICY "Admins/volunteers can insert updates." ON public.case_updates FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'volunteer')
  )
);

-- Comments RLS
CREATE POLICY "Comments viewable by everyone." ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can insert comments." ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Likes RLS
CREATE POLICY "Likes viewable by everyone." ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can manage own likes." ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own likes." ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- Notifications RLS
CREATE POLICY "Users view own notifications." ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications." ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create Storage bucket for report images if not exists
INSERT INTO storage.buckets (id, name, public) VALUES ('report-images', 'report-images', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Images are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'report-images');
CREATE POLICY "Anyone can upload images." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'report-images');

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Allow admins to delete reports
CREATE POLICY "Admins can delete reports." ON public.reports FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin')
  )
);
