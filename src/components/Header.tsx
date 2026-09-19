import React, { useState, useRef, useEffect } from 'react';
import {
  Gift,
  Mail,
  Compass,
  PlusCircle,
  Trash2,
  Globe,
  Sparkles,
  Sliders,
  Search,
  FolderSync,
  Heart,
  Smile,
  FolderGit2,
  ChevronDown,
  Check,
} from 'lucide-react';
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
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary navigation tabs: Curated, clean, 3 essential pillars
  const mainTabs = [
    {
      id: 'dosen',
      label: t.nav.tins,
      icon: Gift,
      badge: dosenCount,
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
  ];

  // Secondary tools, candidate pipeline, and archive organized into semantic groups
  const moreGroups = [
    {
      title: t.nav.group.concepts,
      items: [
        {
          id: 'unpacked',
          label: t.nav.unpacked,
          icon: Sparkles,
          badge: unpackedCount,
          desc: t.nav.desc.unpacked,
        },
        {
          id: 'sandboxes',
          label: t.nav.sandboxes,
          icon: Sliders,
          badge: 8,
          desc: t.nav.desc.sandboxes,
        },
        {
          id: 'normal-jobs',
          label: t.nav.normalJobs,
          icon: Heart,
          badge: 10,
          desc: t.nav.desc.normalJobs,
        },
        {
          id: 'whimsy',
          label: t.nav.whimsy,
          icon: Smile,
          desc: t.nav.desc.whimsy,
        },
      ],
    },
    {
      title: t.nav.group.tools,
      items: [
        {
          id: 'packer',
          label: t.nav.packer,
          icon: PlusCircle,
          desc: t.nav.desc.packer,
        },
        {
          id: 'playbook',
          label: t.nav.playbook,
          icon: Search,
          desc: t.nav.desc.playbook,
        },
        {
          id: 'google-import',
          label: t.nav.googleImport,
          icon: FolderSync,
          desc: t.nav.desc.googleImport,
        },
        {
          id: 'data-hub',
          label: t.nav.githubPages,
          icon: FolderGit2,
          desc: t.nav.desc.githubPages,
        },
      ],
    },
    {
      title: t.nav.group.archive,
      items: [
        {
          id: 'muster-emails',
          label: t.nav.musterEmails,
          icon: Mail,
          badge: 4,
          desc: t.nav.desc.musterEmails,
        },
        {
          id: 'discarded',
          label: t.nav.discarded,
          icon: Trash2,
          badge: discardedCount,
          desc: t.nav.desc.discarded,
        },
      ],
    },
  ];

  // Flattened items for active state matching
  const allMoreItems = moreGroups.flatMap((g) => g.items);
  const activeMoreItem = allMoreItems.find((item) => item.id === currentTab);
  const isMoreActive = Boolean(activeMoreItem);

  return (
    <header className="border-b border-[#dfd1be] bg-[#fbf6ee]/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: Brand identity (left) and Always-Visible Language Switcher (right) */}
        <div className="py-2.5 sm:py-3 flex items-center justify-between gap-3 border-b border-[#dfd1be]/60">
          {/* Brand identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              onClick={() => setCurrentTab('dosen')}
              className="w-10 h-10 rounded-xl bg-[#8c1d40] border border-[#741533] flex items-center justify-center text-[#fff9f5] shadow-xs shrink-0 transform -rotate-1 hover:rotate-0 transition-transform cursor-pointer"
            >
              <Gift className="w-5 h-5 text-[#f6bd60]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('dosen')}
                  className="text-xl sm:text-2xl font-bold font-amelie tracking-tight text-[#2b1e16] hover:text-[#8c1d40] transition-colors cursor-pointer text-left truncate"
                >
                  {t.app.title}
                </button>
                <span className="text-[10px] font-typewriter px-1.5 py-0.5 rounded border border-[#8c1d40]/30 bg-[#8c1d40]/10 text-[#8c1d40] font-bold shrink-0">
                  CC0
                </span>
                <span className="hidden md:inline-block text-[10px] font-typewriter text-[#8b6f57] shrink-0">
                  {t.app.kula_ring}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#6b5849] font-medium truncate hidden sm:block">
                <span className="italic font-amelie text-[#8c1d40] font-semibold">{t.app.kula_french}</span>
                <span className="mx-1.5 opacity-40">·</span>
                <span>{t.app.tagline}</span>
              </p>
            </div>
          </div>

          {/* Right side: Language Selector - ALWAYS VISIBLE, shrink-0, perfectly positioned on right */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-[#ede3d1]/90 p-1 rounded-lg border border-[#d8cbba] shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-[#8c1d40] ml-1 mr-0.5 hidden sm:inline-block" />
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded text-xs font-typewriter transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#fbf7f0] text-[#8c1d40] shadow-xs font-bold border border-[#d4c3b0]'
                    : 'text-[#6b5849] hover:text-[#2b1e16]'
                }`}
                title="English (Canonical XLIFF source)"
              >
                EN
              </button>
              <button
                onClick={() => setLang('de')}
                className={`px-2.5 py-1 rounded text-xs font-typewriter transition-all cursor-pointer ${
                  lang === 'de'
                    ? 'bg-[#fbf7f0] text-[#8c1d40] shadow-xs font-bold border border-[#d4c3b0]'
                    : 'text-[#6b5849] hover:text-[#2b1e16]'
                }`}
                title="Deutsch"
              >
                DE
              </button>
              <button
                onClick={() => setLang('es')}
                className={`px-2.5 py-1 rounded text-xs font-typewriter transition-all cursor-pointer ${
                  lang === 'es'
                    ? 'bg-[#fbf7f0] text-[#8c1d40] shadow-xs font-bold border border-[#d4c3b0]'
                    : 'text-[#6b5849] hover:text-[#2b1e16]'
                }`}
                title="Español"
              >
                ES
              </button>
            </div>
          </div>
        </div>

        {/* Clean, Streamlined Tab Navigation with "Mehr & Werkzeuge" Dropdown */}
        <nav className="flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id);
                  setIsMoreOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
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

          {/* "Mehr & Werkzeuge" Dropdown - Opens strictly inwards (right-0) so it never overflows */}
          <div className="relative ml-auto sm:ml-0" ref={dropdownRef}>
            <button
              onClick={() => setIsMoreOpen((prev) => !prev)}
              className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                isMoreActive
                  ? 'bg-[#8c1d40] text-[#fff9f5] shadow-xs border border-[#741533]'
                  : isMoreOpen
                  ? 'bg-[#ede3d1] text-[#2b1e16] border border-[#d8cbba]'
                  : 'text-[#6b5849] hover:text-[#2b1e16] hover:bg-[#ede3d1]/60 border border-transparent'
              }`}
              title={t.nav.tools_archive_desc}
            >
              {isMoreActive && activeMoreItem ? (
                React.createElement(activeMoreItem.icon, {
                  className: 'w-4 h-4 text-[#f6bd60]',
                })
              ) : (
                <Sparkles className={`w-4 h-4 ${isMoreOpen ? 'text-[#8c1d40]' : 'text-[#8b6f57]'}`} />
              )}
              <span className={isMoreActive ? 'font-semibold tracking-tight' : ''}>
                {isMoreActive && activeMoreItem ? activeMoreItem.label : t.nav.more}
              </span>
              {isMoreActive && activeMoreItem?.badge !== undefined && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-typewriter font-bold bg-[#741533] text-[#fde047]">
                  {activeMoreItem.badge}
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isMoreOpen ? 'rotate-180 text-[#8c1d40]' : isMoreActive ? 'text-[#f6bd60]' : 'text-[#8b6f57]'
                }`}
              />
            </button>

            {/* Dropdown Menu - Explicitly anchored to right edge (right-0) with max-width and internal scroll */}
            {isMoreOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-[#fffdf9] border border-[#dfd1be] shadow-2xl p-2.5 z-50 animate-fadeIn max-h-[80vh] overflow-y-auto divide-y divide-[#f0e4d4]">
                <div className="px-2.5 py-2">
                  <span className="text-[10px] font-typewriter uppercase tracking-widest text-[#8c1d40] font-bold block">
                    ✦ {t.nav.tools_archive} ✦
                  </span>
                  <p className="text-xs text-[#6b5849] mt-0.5">
                    {t.nav.tools_archive_desc}
                  </p>
                </div>

                {moreGroups.map((group, gIdx) => (
                  <div key={gIdx} className="py-2 first:pt-1 space-y-1">
                    <div className="px-2.5 py-0.5 text-[10px] font-typewriter font-bold uppercase tracking-wider text-[#8c1d40]/80">
                      {group.title}
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isItemActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCurrentTab(item.id);
                            setIsMoreOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer ${
                            isItemActive
                              ? 'bg-[#8c1d40] text-white shadow-2xs'
                              : 'hover:bg-[#faf4e8] text-[#2b1e16]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isItemActive
                                  ? 'bg-[#741533] text-[#f6bd60]'
                                  : 'bg-[#ede3d1] text-[#8c1d40]'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-semibold truncate">
                                {item.label}
                              </div>
                              <div
                                className={`text-[10px] truncate ${
                                  isItemActive ? 'text-[#f6bd60]/90' : 'text-[#8b6f57]'
                                }`}
                              >
                                {item.desc}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {item.badge !== undefined && (
                              <span
                                className={`text-[11px] px-1.5 py-0.5 rounded-full font-typewriter font-bold ${
                                  isItemActive
                                    ? 'bg-[#741533] text-[#fde047]'
                                    : 'bg-[#ede3d1] text-[#5c4a3d]'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            {isItemActive && <Check className="w-4 h-4 text-[#f6bd60]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
