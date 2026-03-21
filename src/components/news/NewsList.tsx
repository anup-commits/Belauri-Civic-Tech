import { useEffect, useState } from 'react';
import { Calendar, User, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';

type Post = Database['public']['Tables']['posts']['Row'] & {
  profiles?: { full_name: string };
};

export default function NewsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'news' | 'blog' | 'update' | 'campaign'>('all');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase
      .from('posts')
      .select('*, profiles(full_name)')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('category', filter);
    }

    const { data, error } = await query;

    if (!error && data) {
      setPosts(data as Post[]);
    }
    setLoading(false);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      news: 'bg-red-100 text-red-800',
      blog: 'bg-blue-100 text-blue-800',
      update: 'bg-green-100 text-green-800',
      campaign: 'bg-yellow-100 text-yellow-800',
    };
    return colors[category as keyof typeof colors] || colors.news;
  };

  return (
    <section id="news" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            News & Updates
          </h2>
          <p className="text-xl text-gray-600">
            Latest updates, campaigns, and stories from the frontlines of our movement
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {['all', 'news', 'blog', 'update', 'campaign'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === cat
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="text-gray-600 mt-4">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No posts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {post.featured_image && (
                  <div className="h-48 bg-gray-200">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(post.category)}`}>
                      {post.category.toUpperCase()}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Eye className="w-3 h-3 mr-1" />
                      {post.views_count}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.profiles?.full_name || 'Admin'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <button className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                    Read More
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
