import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { translations, Language, TranslationKey } from '../locales/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load initial value
  useEffect(() => {
    const saved = localStorage.getItem('belauri_lang') as Language;
    if (saved && (saved === 'en' || saved === 'np')) {
      handleSetLanguage(saved);
    } else {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.includes('np') || browserLang.includes('ne')) {
        handleSetLanguage('np');
      } else {
        handleSetLanguage('en');
      }
    }
  }, []);

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('belauri_lang', lang);
    if (lang === 'np') {
      document.body.classList.add('lang-np');
    } else {
      document.body.classList.remove('lang-np');
    }
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    const dict = translations[language];
    if (dict && typeof dict[key] === 'string') {
      return dict[key];
    }
    // Fallback to english if missing
    return translations['en'][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
