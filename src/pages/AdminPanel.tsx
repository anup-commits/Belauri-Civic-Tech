import React, { useState, useEffect } from 'react';
import { supabase, type Post } from '../lib/supabase';
import { ShieldAlert, Check, X as RejectIcon, Trash2, Loader2, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AdminPanel() {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simple hardcoded check for the demo (as per prompt instructions: "hard-code check or use Supabase auth")
  // For production, Supabase Auth with an actual admin user should be used.
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'belauri123!') {
      setIsAuthenticated(true);
      fetchPendingPosts();
    } else {
      setError('Invalid admin password');
    }
  };

  const fetchPendingPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .in('status', ['pending', 'rejected']) // Show pending and maybe rejected
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // Real-time subscription for admin
    const channel = supabase
      .channel('admin:posts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPosts(prev => [payload.new as Post, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Post;
            if (updated.status === 'approved') {
              setPosts(prev => prev.filter(p => p.id !== updated.id));
            } else {
              setPosts(prev => {
                const exists = prev.find(p => p.id === updated.id);
                if (exists) return prev.map(p => p.id === updated.id ? updated : p);
                return [updated, ...prev];
              });
            }
          } else if (payload.eventType === 'DELETE') {
            setPosts(prev => prev.filter(p => p.id !== (payload.old as Post).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      // Because RLS might block normal users from updating other's posts, 
      // the logged-in user needs Admin privileges in Supabase if using RLS.
      // If auth setup is incomplete for RLS, this might fail unless service_role key is used.
      // Assuming policies allow updaters who are authenticated 'admin@belauri.org' or similar.
      const { error } = await supabase
        .from('posts')
        .update({ status: newStatus, approved_at: newStatus === 'approved' ? new Date().toISOString() : null })
        .eq('id', id);

      if (error) throw error;
      
      // Optimistic upate done by realtime subscription
    } catch (err: any) {
      alert('Error updating post: ' + err.message);
    }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post completely?")) return;
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      alert('Error deleting post: ' + err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl border border-slate-700">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-primary-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-6">Secret Admin Access</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 bg-red-500/20 text-red-300 rounded-xl text-sm border border-red-500/30">{error}</div>}
            <div>
              <input
                type="password"
                placeholder="Enter admin password..."
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 rounded-xl transition-colors">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white py-4 px-6 flex justify-between items-center shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-primary-500" />
          <h1 className="text-xl font-bold font-sans">Belauri First Admin</h1>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium bg-slate-800 px-4 py-2 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6 pt-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Pending Submissions</h2>
            <p className="text-slate-500 mt-2">Review and approve community stories before they go public.</p>
          </div>
          <div className="text-sm font-medium bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full border border-primary-200">
            {posts.length} Pending
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Check className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">All caught up!</h3>
            <p className="text-slate-500">There are no pending posts to review.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow">
                {post.image_url && (
                  <div className="w-full md:w-48 h-48 md:h-auto rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100">
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-grow flex flex-col">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{post.title}</h3>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${post.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {post.status}
                    </span>
                  </div>
                  
                  <div className="text-xs font-medium text-slate-500 mb-4 flex gap-3">
                    <span className="bg-slate-100 px-2 py-1 rounded-md">{post.category}</span>
                    <span className="flex items-center">{new Date(post.created_at).toLocaleString()}</span>
                  </div>
                  
                  <p className="text-slate-700 mb-6 flex-grow whitespace-pre-wrap">{post.description}</p>
                  
                  <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => updateStatus(post.id, 'approved')}
                      className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <Check className="w-5 h-5" />
                      Approve
                    </button>
                    {post.status !== 'rejected' && (
                      <button 
                        onClick={() => updateStatus(post.id, 'rejected')}
                        className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <RejectIcon className="w-5 h-5 text-slate-400" />
                        Reject
                      </button>
                    )}
                    <button 
                      onClick={() => deletePost(post.id)}
                      className="px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl flex items-center justify-center transition-colors"
                      title="Delete Permanently"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
