import { useLanguage } from '../contexts/LanguageContext';

export default function Initiatives() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">{t('nav.initiatives')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-primary-600 mb-4">Anti-Corruption Drives</h2>
          <p className="text-slate-600">Organizing awareness camps, tracking local budget allocations, and ensuring public projects in Belauri meet standard transparency metrics.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-accent-600 mb-4">Community Cleanups</h2>
          <p className="text-slate-600">Regular environmental preservation campaigns to manage waste, plant trees, and keep our urban and rural spaces clean.</p>
        </div>
      </div>
    </div>
  );
}
