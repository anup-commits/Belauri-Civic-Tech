import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">{t('nav.about')}</h1>
      <div className="prose prose-lg text-slate-600">
        <p className="mb-4">
          Belauri First is a dedicated, youth-led volunteer organization established in Belauri, Kanchanpur. Our mission is to promote transparency, combat corruption, and foster sustainable community development through grassroots actions and digital advocacy.
        </p>
        <p>
          We believe in the power of youth to mobilize positive change. This platform serves as a safe, censorship-free space where citizens can anonymously share their observations, stories, and concerns about local governance, infrastructure, and social issues.
        </p>
      </div>
    </div>
  );
}
