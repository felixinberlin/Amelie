import React from 'react';
import { Gift, Mail, Compass, PlusCircle, Trash2, Globe, Sparkles, Sliders, Search, FolderSync, Heart, Smile } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../i18n';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  dosenCount: number;
  unpackedCount?: number;
  discardedCount: number;
  mailsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  dosenCount,
  unpackedCount,
  discardedCount,
  mailsCount,
}) => {
  const t = getTranslation(lang);

  const tabs = [
    {
      id: 'dosen',
      label: t.nav.tins,
      icon: Gift,
      badge: dosenCount,
    },
    {
      id: 'normal-jobs',
      label: t.nav.normalJobs,
      icon: Heart,
      badge: 10,
    },
    {
      id: 'whimsy',
      label: t.nav.whimsy,
      icon: Smile,
    },
    {
      id: 'unpacked',
      label: t.nav.unpacked,
      icon: Sparkles,
      badge: unpackedCount,
    },
    {
      id: 'google-import',
      label: t.nav.googleImport,
      icon: FolderSync,
    },
    {
      id: 'sandboxes',
      label: t.nav.sandboxes,
      icon: Sliders,
    },
    {
      id: 'playbook',
      label: t.nav.playbook,
      icon: Search,
    },
    {
      id: 'matrix',
      label: t.nav.matrix,
      icon: Mail,
      badge: mailsCount,
    },
    {
      id: 'manifest',
      label: t.nav.manifest,
      icon: Compass,
    },
    {
      id: 'packer',
      label: t.nav.packer,
      icon: PlusCircle,
    },
    {
      id: 'discarded',
      label: t.nav.discarded,
      icon: Trash2,
      badge: discardedCount,
    },
  ];

  return (
    <header className="border-b border-stone-200/80 bg-[#fdfbf7]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-800/10 border border-amber-800/20 flex items-center justify-center text-amber-900 shadow-xs">
                <Gift className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold font-serif-title tracking-tight text-stone-900">
                    {t.app.title}
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 font-medium">
                    CC0
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-stone-200/80 text-stone-600 font-semibold">
                    XLIFF i18n
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  {t.app.tagline}
                </p>
              </div>
            </div>

            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-1 md:hidden bg-stone-200/60 p-0.5 rounded-lg border border-stone-300/80">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  lang === 'en' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
                title="English (Main)"
              >
                EN
              </button>
              <button
                onClick={() => setLang('de')}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  lang === 'de' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
                title="Deutsch"
              >
                DE
              </button>
              <button
                onClick={() => setLang('es')}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  lang === 'es' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
                title="Español"
              >
                ES
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs text-stone-500 bg-stone-100/80 px-3 py-1.5 rounded-lg border border-stone-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.app.subtitle}</span>
            </div>

            {/* Desktop Language Selector */}
            <div className="hidden md:flex items-center gap-1 bg-stone-200/60 p-0.5 rounded-lg border border-stone-300/80">
              <button
                onClick={() => setLang('en')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  lang === 'en'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Globe className="w-3 h-3 text-stone-400" />
                <span>English <span className="text-[10px] text-amber-700 font-bold">(Main)</span></span>
              </button>
              <button
                onClick={() => setLang('de')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  lang === 'de'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Deutsch
              </button>
              <button
                onClick={() => setLang('es')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  lang === 'es'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Español
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-stone-900 text-stone-50 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-xs px-1.5 py-0.2 rounded-full font-mono-code ${
                      isActive
                        ? 'bg-stone-800 text-amber-300'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
