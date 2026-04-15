import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react';

import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PostCard({ post }: { post: any }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 5);
  const commentsCount = Math.floor(Math.random() * 20);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).format(new Date(post.created_at));

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500 text-yellow-950',
    under_review: 'bg-accent-500 text-white',
    in_progress: 'bg-blue-600 text-white',
    resolved: 'bg-green-500 text-green-950',
    rejected: 'bg-red-600 text-white',
  };

  const statusBadgeColor = statusColors[post.status] || statusColors['pending'];

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col group hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all shadow-glass relative shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary-500/0 to-transparent group-hover:via-primary-500/50 transition-all duration-500"></div>

      {post.image_url ? (
        <div className="h-56 overflow-hidden bg-dark-bg border-b border-white/5 relative">
          <span className={`absolute top-4 left-4 text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded shadow-lg z-10 ${statusBadgeColor} border border-black/10`}>
            {post.status.replace('_', ' ')}
          </span>
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          />
        </div>
      ) : (
        <div className="pt-6 px-6">
          <span className={`inline-block text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded shadow-lg ${statusBadgeColor} mb-2`}>
             {post.status.replace('_', ' ')}
          </span>
        </div>
      )}
      
      <div className={`p-6 flex flex-col flex-grow ${!post.image_url ? 'pt-2' : ''}`}>
        <div className="flex items-center justify-between mb-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
          <span className="text-primary-400">{post.category}</span>
          <span>{formattedDate}</span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-primary-400 transition-colors tracking-tight">
          {post.title}
        </h3>

        {post.location_text && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-4 bg-dark-bg/50 self-start px-2 py-1 rounded border border-dark-border">
            <MapPin className="w-3.5 h-3.5 text-accent-500" /> {post.location_text}
          </div>
        )}
        
        <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
          {post.description}
        </p>

        {post.resolution_note && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 mb-6 shadow-[inset_0_1px_0_0_rgba(34,197,94,0.1)]">
            <strong className="text-green-500 font-bold block mb-1.5 uppercase text-[10px] tracking-widest">Resolution Note</strong>
            <p className="text-slate-300 text-sm leading-relaxed">{post.resolution_note}</p>
          </div>
        )}
        
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-slate-400 font-bold text-sm">
          <div className="flex gap-4">
            <button onClick={handleLike} className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-primary-500' : 'hover:text-white'}`}>
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-accent-400 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>{commentsCount}</span>
            </button>
          </div>
          <button className="hover:text-white transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
