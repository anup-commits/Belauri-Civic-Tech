export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          bio: string | null
          location: string | null
          is_admin: boolean
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          is_admin?: boolean
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          is_admin?: boolean
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string
          category: 'corruption' | 'infrastructure' | 'public_service' | 'other'
          location: string | null
          latitude: number | null
          longitude: number | null
          image_url: string | null
          is_anonymous: boolean
          status: 'pending' | 'approved' | 'rejected' | 'resolved'
          upvotes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description: string
          category: 'corruption' | 'infrastructure' | 'public_service' | 'other'
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          image_url?: string | null
          is_anonymous?: boolean
          status?: 'pending' | 'approved' | 'rejected' | 'resolved'
          upvotes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          description?: string
          category?: 'corruption' | 'infrastructure' | 'public_service' | 'other'
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          image_url?: string | null
          is_anonymous?: boolean
          status?: 'pending' | 'approved' | 'rejected' | 'resolved'
          upvotes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          author_id: string
          title: string
          slug: string
          content: string
          excerpt: string
          featured_image: string | null
          category: 'news' | 'blog' | 'update' | 'campaign'
          is_published: boolean
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          slug: string
          content: string
          excerpt: string
          featured_image?: string | null
          category: 'news' | 'blog' | 'update' | 'campaign'
          is_published?: boolean
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string
          featured_image?: string | null
          category?: 'news' | 'blog' | 'update' | 'campaign'
          is_published?: boolean
          views_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          organizer_id: string
          title: string
          description: string
          event_date: string
          location: string
          image_url: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organizer_id: string
          title: string
          description: string
          event_date: string
          location: string
          image_url?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organizer_id?: string
          title?: string
          description?: string
          event_date?: string
          location?: string
          image_url?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      gallery: {
        Row: {
          id: string
          uploaded_by: string
          title: string
          description: string | null
          media_url: string
          media_type: 'image' | 'video'
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          uploaded_by: string
          title: string
          description?: string | null
          media_url: string
          media_type: 'image' | 'video'
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          uploaded_by?: string
          title?: string
          description?: string | null
          media_url?: string
          media_type?: 'image' | 'video'
          is_published?: boolean
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          post_id: string | null
          report_id: string | null
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id?: string | null
          report_id?: string | null
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string | null
          report_id?: string | null
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      report_votes: {
        Row: {
          id: string
          report_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          report_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}
