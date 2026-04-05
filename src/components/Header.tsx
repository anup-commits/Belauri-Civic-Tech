import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, X } from 'lucide-react';
import type { Language } from '../locales/translations';

export default function Header() {
  const { t, language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.news'), path: '/#feed', isHash: true },
    { name: t('nav.initiatives'), path: '/initiatives' },
    { name: t('nav.impact'), path: '/impact' }
  ];

  const handleLanguageSwitch = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <header className="bg-[#0a0a0a] border-b border-dark-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4 flex-shrink-0 group">
            <div className="flex items-baseline gap-2">
              <span className={`font-black tracking-tighter uppercase text-primary-600 ${language === 'np' ? 'text-2xl font-devanagari tracking-normal leading-none mb-1' : 'text-xl'}`}>
                {t('header.title')}
              </span>
              <span className={`hidden sm:inline text-slate-400 font-medium ${language === 'np' ? 'text-sm font-devanagari relative top-[-2px]' : 'text-xs'}`}>
                {t('header.subtitle')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              link.isHash ? (
                <a
                  key={link.path}
                  href={link.path}
                  className="text-sm tracking-wide transition-colors text-slate-400 hover:text-white"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm tracking-wide transition-colors ${
                    location.pathname === link.path ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
            
            {/* Language Switcher */}
            <div className="flex bg-dark-surface border border-dark-border rounded items-center p-0.5 ml-4">
              <button
                onClick={() => handleLanguageSwitch('en')}
                className={`px-3 py-1 text-xs font-bold transition-all ${
                  language === 'en' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('lang.eng')}
              </button>
              <button
                onClick={() => handleLanguageSwitch('np')}
                className={`px-3 py-1 text-xs font-bold transition-all font-devanagari ${
                  language === 'np' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('lang.np')}
              </button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-dark-border bg-dark-surface absolute w-full shadow-2xl">
          <div className="px-4 py-4 space-y-4 font-medium">
            {navLinks.map((link) => (
              link.isHash ? (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-2 py-1 text-base text-slate-300 hover:text-white"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-2 py-1 text-base ${
                    location.pathname === link.path ? 'text-primary-500' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
            <div className="flex pt-4 border-t border-dark-border gap-2">
              <button onClick={() => { handleLanguageSwitch('en'); setIsMenuOpen(false); }} className={`px-4 py-2 border rounded text-xs font-bold flex-1 ${language === 'en' ? 'bg-white text-black' : 'text-white border-dark-border'}`}>{t('lang.eng')}</button>
              <button onClick={() => { handleLanguageSwitch('np'); setIsMenuOpen(false); }} className={`px-4 py-2 border rounded text-xs font-bold flex-1 font-devanagari ${language === 'np' ? 'bg-white text-black' : 'text-white border-dark-border'}`}>{t('lang.np')}</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
