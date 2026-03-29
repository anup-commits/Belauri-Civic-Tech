import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#050505] border-t border-dark-border py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full border border-dark-border flex items-center justify-center">
               <span className="text-xs font-bold text-primary-600">N'</span>
             </div>
             <div>
               <p className="text-white font-bold text-sm tracking-wide">{t('header.title')}</p>
               <p className="text-slate-500 text-xs">{t('footer.subtitle')}</p>
             </div>
          </div>
          
          <div className="flex gap-6 text-sm">
            <a href="/secret-admin-belauri" className="text-slate-500 hover:text-white transition-colors font-medium">
              {t('admin.login')}
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">© {new Date().getFullYear()} {t('footer.rights')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
