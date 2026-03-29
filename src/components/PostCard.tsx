import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function PostCard({ post }: { post: any }) {
  const { t } = useLanguage();
  
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).format(new Date(post.created_at));

  // Try to find translation for category
  const catKey = `category.${post.category.toLowerCase().replace(/ /g, '_').replace('-', '_')}` as any;
  const translatedCategory = t(catKey) || post.category;

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden flex flex-col group hover:border-[#444] transition-colors relative">
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary-600/0 to-transparent group-hover:via-primary-600/50 transition-all duration-500"></div>

      {post.image_url && (
        <div className="h-48 overflow-hidden bg-[#050505] border-b border-dark-border">
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          />
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black tracking-wider text-primary-500 uppercase px-2 py-1 border border-primary-500/30 bg-primary-500/10 rounded">
            {translatedCategory}
          </span>
          <span className="text-xs text-slate-500 font-medium font-mono tracking-tight">
            {formattedDate}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-primary-400 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
          {post.description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-dark-border flex items-center text-white font-bold text-xs uppercase tracking-wider group-hover:text-primary-500 transition-colors">
          {t('postcard.read_full')} <span className="ml-2">→</span>
        </div>
      </div>
    </div>
  );
}
