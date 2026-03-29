import React, { useEffect, useState } from 'react';
import { supabase, type Post } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import Hero from '../components/Hero';
import PostCard from '../components/PostCard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();

    // Set up realtime subscription
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' }, 
        (payload) => {
          // Handle inserts/updates/deletes for Realtime feed
          const newPost = payload.new as Post;
          const oldPost = payload.old as Post;

          if (payload.eventType === 'INSERT' && newPost.status === 'approved') {
            setPosts((prev) => [newPost, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            if (newPost.status === 'approved') {
              setPosts((prev) => {
                const exists = prev.find(p => p.id === newPost.id);
                if (exists) {
                  return prev.map(p => p.id === newPost.id ? newPost : p);
                }
                return [newPost, ...prev];
              });
            } else {
              // If status changed to rejected/pending, remove it
              setPosts((prev) => prev.filter(p => p.id !== newPost.id));
            }
          } else if (payload.eventType === 'DELETE') {
            setPosts((prev) => prev.filter(p => p.id !== oldPost.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Hero />
      
      <div id="feed" className="bg-[#050505] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b border-dark-border pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                {t('home.feed.title')}
              </h2>
              <p className="text-slate-500 text-sm mt-1">{t('home.feed.subtitle')}</p>
            </div>
            <a href="#feed" className="text-primary-500 font-bold text-sm tracking-widest uppercase hover:text-primary-400">
              {t('home.feed.view_all')}
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-dark-surface rounded-lg border border-dark-border">
              <p className="text-slate-400 font-medium">{t('home.feed.empty')}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
