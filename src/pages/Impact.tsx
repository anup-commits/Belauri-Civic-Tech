import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Impact() {
  const { t } = useLanguage();

  return (
    <div className="bg-[#050505] py-24 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 className="text-4xl font-black uppercase tracking-wider mb-6 text-primary-500">
          {t('nav.impact')}
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Real stories of accountability and positive change driven by the youth of Belauri. 
        </p>
        <div className="mt-16 bg-dark-surface border border-dark-border rounded-lg p-12 max-w-3xl mx-auto">
           <p className="text-slate-500 font-medium">Verified case studies and impactful outcomes are currently being compiled. Check back soon.</p>
        </div>
      </div>
    </div>
  );
}
