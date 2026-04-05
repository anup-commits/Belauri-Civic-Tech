import { useLanguage } from '../contexts/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <div className="bg-[#0a0a0a] border-b border-dark-border py-16 lg:py-24 relative overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-start">
          
          {/* Left Column */}
          <div className="space-y-8 max-w-2xl">
            {/* Top Pill */}
            <div className="inline-flex items-center">
              <span className="px-4 py-1.5 rounded-full border border-dark-border bg-dark-surface text-primary-500 text-xs font-bold tracking-widest uppercase">
                {t('hero.pill')}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight">
              {t('hero.headline_1')} <br className="hidden md:block"/>
              <span className="text-primary-600">{t('hero.headline_2')}</span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl font-medium">
              {t('hero.subtext')}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#feed" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-8 rounded flex items-center justify-center transition-colors">
                {t('hero.btn_submit')}
              </a>
              <a href="#feed" className="bg-transparent border border-dark-border hover:border-slate-600 hover:bg-dark-surface text-white font-bold py-3.5 px-8 rounded flex items-center justify-center transition-all">
                {t('hero.btn_news')}
              </a>
            </div>

            {/* 3 Info Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-dark-border mt-8">
              <div className="bg-[#111] border border-[#222] p-4 rounded text-left">
                <div className="text-[10px] font-black tracking-wider text-primary-600 uppercase mb-2">{t('hero.box1.title')}</div>
                <div className="text-white font-bold text-sm">{t('hero.box1.desc')}</div>
              </div>
              <div className="bg-[#111] border border-[#222] p-4 rounded text-left">
                <div className="text-[10px] font-black tracking-wider text-primary-600 uppercase mb-2">{t('hero.box2.title')}</div>
                <div className="text-white font-bold text-sm">{t('hero.box2.desc')}</div>
              </div>
              <div className="bg-[#111] border border-[#222] p-4 rounded text-left">
                <div className="text-[10px] font-black tracking-wider text-primary-600 uppercase mb-2">{t('hero.box3.title')}</div>
                <div className="text-white font-bold text-sm">{t('hero.box3.desc')}</div>
              </div>
            </div>
          </div>

          {/* Right Column (Mission box) */}
          <div className="lg:pl-8">
            <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-8 shadow-2xl relative overflow-hidden group hover:border-[#333] transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl group-hover:bg-primary-600/10 transition-colors"></div>
              
              <div className="relative z-10">
                <h3 className="text-xs font-black tracking-wider text-primary-600 uppercase mb-3">
                  {t('hero.mission.title')}
                </h3>
                <p className="text-white text-lg font-medium leading-normal mb-8">
                  {t('hero.mission.desc')}
                </p>

                <div className="space-y-4">
                  <div className="border border-dark-border bg-[#0a0a0a]/50 p-5 rounded-lg hover:border-slate-700 transition-colors">
                    <h4 className="text-white font-bold mb-1">{t('hero.mission.pt1.title')}</h4>
                    <p className="text-slate-400 text-sm">{t('hero.mission.pt1.desc')}</p>
                  </div>
                  <div className="border border-dark-border bg-[#0a0a0a]/50 p-5 rounded-lg hover:border-slate-700 transition-colors">
                    <h4 className="text-white font-bold mb-1">{t('hero.mission.pt2.title')}</h4>
                    <p className="text-slate-400 text-sm">{t('hero.mission.pt2.desc')}</p>
                  </div>
                  <div className="border border-dark-border bg-[#0a0a0a]/50 p-5 rounded-lg hover:border-slate-700 transition-colors">
                    <h4 className="text-white font-bold mb-1">{t('hero.mission.pt3.title')}</h4>
                    <p className="text-slate-400 text-sm">{t('hero.mission.pt3.desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
