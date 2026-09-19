import React from 'react';
import { Gift, Mail, Compass, PlusCircle, Trash2, Globe, Sparkles, Sliders, Search, FolderSync, Heart, Smile, FolderGit2 } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../i18n';
import { getStorageProvider } from '../services/storageService';

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
      id: 'data-hub',
      label: t.nav.githubPages,
      icon: FolderGit2,
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
    <header className="border-b border-[#dfd1be] bg-[#fbf6ee]/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#8c1d40] border border-[#741533] flex items-center justify-center text-[#fff9f5] shadow-sm transform -rotate-1 hover:rotate-0 transition-transform">
                <Gift className="w-5 h-5 text-[#f6bd60]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold font-amelie tracking-tight text-[#2b1e16]">
                    {t.app.title}
                  </h1>
                  <span className="text-[11px] font-typewriter px-2 py-0.5 rounded border border-[#8c1d40]/40 bg-[#8c1d40]/10 text-[#8c1d40] font-bold">
                    CC0 · 1974–2026
                  </span>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-typewriter tracking-widest px-2 py-0.5 rounded bg-[#1b4332]/10 text-[#1b4332] border border-[#1b4332]/25 font-bold">
                    PAR AVION · XLIFF
                  </span>
                  <button
                    onClick={() => setCurrentTab('data-hub')}
                    className="hidden md:inline-flex items-center gap-1 text-[10px] font-typewriter px-2 py-0.5 rounded bg-[#2e7d32]/10 text-[#2e7d32] border border-[#2e7d32]/25 font-bold hover:bg-[#2e7d32]/20 transition-colors cursor-pointer"
                    title="GitHub Pages & Static Data Hub"
                  >
                    <FolderGit2 className="w-3 h-3" />
                    <span>GITHUB PAGES</span>
                  </button>
                </div>
                <p className="text-xs text-[#6b5849] font-medium flex items-center gap-1.5">
                  <span className="italic font-amelie text-xs text-[#8c1d40] font-semibold">« Le Kula-Ring des Idées »</span>
                  <span>—</span>
                  <span>{t.app.tagline}</span>
                </p>
              </div>
            </div>

            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-1 md:hidden bg-[#ede3d1]/80 p-0.5 rounded-lg border border-[#d8cbba]">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded text-xs font-typewriter transition-all ${
                  lang === 'en' ? 'bg-[#fbf7f0] text-[#8c1d40] font-bold shadow-xs' : 'text-[#6b5849]'
                }`}
                title="English (Canonical)"
              >
                EN
              </button>
              <button
                onClick={() => setLang('de')}
                className={`px-2 py-1 rounded text-xs font-typewriter transition-all ${
                  lang === 'de' ? 'bg-[#fbf7f0] text-[#8c1d40] font-bold shadow-xs' : 'text-[#6b5849]'
                }`}
                title="Deutsch"
              >
                DE
              </button>
              <button
                onClick={() => setLang('es')}
                className={`px-2 py-1 rounded text-xs font-typewriter transition-all ${
                  lang === 'es' ? 'bg-[#fbf7f0] text-[#8c1d40] font-bold shadow-xs' : 'text-[#6b5849]'
                }`}
                title="Español"
              >
                ES
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs text-[#5c4a3d] bg-[#f4ede0] px-3.5 py-1.5 rounded-lg border border-[#d8cbba]/80 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#c5832b]" />
              <span className="font-amelie italic">{t.app.subtitle}</span>
            </div>

            {/* Desktop Language Selector */}
            <div className="hidden md:flex items-center gap-1 bg-[#ede3d1]/90 p-1 rounded-lg border border-[#d8cbba]">
              <button
                onClick={() => setLang('en')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-typewriter transition-all ${
                  lang === 'en'
                    ? 'bg-[#fbf7f0] text-[#8c1d40] shadow-xs font-bold border border-[#d4c3b0]'
                    : 'text-[#6b5849] hover:text-[#2b1e16]'
                }`}
              >
                <Globe className="w-3 h-3 text-[#c5832b]" />
                <span>EN <span className="text-[10px] text-[#8c1d40] font-bold">(Source)</span></span>
              </button>
              <button
                onClick={() => setLang('de')}
                className={`px-2.5 py-1 rounded text-xs font-typewriter transition-all ${
                  lang === 'de'
                    ? 'bg-[#fbf7f0] text-[#8c1d40] shadow-xs font-bold border border-[#d4c3b0]'
                    : 'text-[#6b5849] hover:text-[#2b1e16]'
                }`}
              >
                DE
              </button>
              <button
                onClick={() => setLang('es')}
                className={`px-2.5 py-1 rounded text-xs font-typewriter transition-all ${
                  lang === 'es'
                    ? 'bg-[#fbf7f0] text-[#8c1d40] shadow-xs font-bold border border-[#d4c3b0]'
                    : 'text-[#6b5849] hover:text-[#2b1e16]'
                }`}
              >
                ES
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1.5 overflow-x-auto pb-2.5 scrollbar-none pt-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#8c1d40] text-[#fff9f5] shadow-xs border border-[#741533]'
                    : 'text-[#6b5849] hover:text-[#2b1e16] hover:bg-[#ede3d1]/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#f6bd60]' : 'text-[#8b6f57]'}`} />
                <span className={isActive ? 'font-semibold tracking-tight' : ''}>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-typewriter font-bold ${
                      isActive
                        ? 'bg-[#741533] text-[#fde047]'
                        : 'bg-[#ede3d1] text-[#5c4a3d] border border-[#d8cbba]'
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
