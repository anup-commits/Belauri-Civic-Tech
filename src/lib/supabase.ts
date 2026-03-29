import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PostStatus = 'pending' | 'approved' | 'rejected';

export interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  status: PostStatus;
  created_at: string;
  created_by: string;
  approved_at: string | null;
}
