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
  Activity,
  ChevronDown,
  Check,
  Coins,
  Gamepad2,
  Radar,
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation, withCount } from '../i18n';
import { SIMULATOR_COUNT } from '../data/doseSimulators';
import { NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS } from '../data/ideas/normalJobsAndEverydayPeople';
import { PLAYABLE_GAME_COUNT } from './GamesView';
import { GAME_IDEAS } from '../data/ideas/games';
import { GAME_DOSE_IDS } from '../data/pipeline';
import { MoodSwitcher } from './MoodSwitcher';
import { AMELIE_MUSTERS } from '../data/musterEmails';
import { FUNDING_DATA } from '../data/funding';

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

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
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
      id: 'games',
      label: t.nav.games,
      icon: Gamepad2,
      badge: GAME_IDEAS.length + GAME_DOSE_IDS.length + PLAYABLE_GAME_COUNT,
    },
    {
      id: 'compare',
      label: lang === 'de' ? 'Vergleich' : lang === 'es' ? 'Comparar' : 'Compare',
      icon: Radar,
    },
    {
      id: 'funding',
      label: lang === 'de' ? 'Förderkompass' : lang === 'es' ? 'Brújula de fondos' : 'Funding compass',
      icon: Coins,
      badge: FUNDING_DATA.length,
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
          badge: SIMULATOR_COUNT,
          desc: withCount(t.nav.desc.sandboxes, SIMULATOR_COUNT),
        },
        {
          id: 'normal-jobs',
          label: t.nav.normalJobs,
          icon: Heart,
          badge: NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS.length,
          desc: withCount(t.nav.desc.normalJobs, NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS.length),
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
        {
          id: 'audit',
          label: 'Self-Audit Cockpit',
          icon: Activity,
          desc: 'Deterministic offline repository health inspection',
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
          badge: AMELIE_MUSTERS.length,
          desc: withCount(t.nav.desc.musterEmails, AMELIE_MUSTERS.length),
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
    <header className="border-b border-[var(--m-line)] bg-[var(--m-bg-2)]/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: Brand identity (left) and Always-Visible Language Switcher (right) */}
        <div className="py-2.5 sm:py-3 flex items-center justify-between gap-3 border-b border-[var(--m-line)]/60">
          {/* Brand identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              onClick={() => setCurrentTab('dosen')}
              className="w-10 h-10 rounded-xl bg-[var(--m-accent)] border border-[var(--m-accent-strong)] flex items-center justify-center text-[var(--m-on-accent)] shadow-xs shrink-0 transform -rotate-1 hover:rotate-0 transition-transform cursor-pointer"
            >
              <Gift className="w-5 h-5 text-[var(--m-gold)]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('dosen')}
                  className="text-xl sm:text-2xl font-bold font-amelie tracking-tight text-[var(--m-ink)] hover:text-[var(--m-accent)] transition-colors cursor-pointer text-left truncate"
                >
                  {t.app.title}
                </button>
                <span className="text-[10px] font-typewriter px-1.5 py-0.5 rounded border border-[var(--m-accent)]/30 bg-[var(--m-accent)]/10 text-[var(--m-accent)] font-bold shrink-0">
                  CC0
                </span>
                <span className="hidden md:inline-block text-[10px] font-typewriter text-[var(--m-muted)] shrink-0">
                  {t.app.kula_ring}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[var(--m-ink-3)] font-medium truncate hidden sm:block">
                <span className="italic font-amelie text-[var(--m-accent)] font-semibold">{t.app.kula_french}</span>
                <span className="mx-1.5 opacity-40">·</span>
                <span>{t.app.tagline}</span>
              </p>
            </div>
          </div>

          {/* Right side: Language Selector - ALWAYS VISIBLE, shrink-0, perfectly positioned on right */}
          <div className="flex items-center gap-2 shrink-0">
            <MoodSwitcher lang={lang} />
            <div className="flex items-center gap-1 bg-[var(--m-sunk)]/90 p-1 rounded-lg border border-[var(--m-line-strong)] shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-[var(--m-accent)] ml-1 mr-0.5 hidden sm:inline-block" />
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded text-xs font-typewriter transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[var(--m-bg)] text-[var(--m-accent)] shadow-xs font-bold border border-[var(--m-line-strong)]'
                    : 'text-[var(--m-ink-3)] hover:text-[var(--m-ink)]'
                }`}
                title="English (Canonical XLIFF source)"
              >
                EN
              </button>
              <button
                onClick={() => setLang('de')}
                className={`px-2.5 py-1 rounded text-xs font-typewriter transition-all cursor-pointer ${
                  lang === 'de'
                    ? 'bg-[var(--m-bg)] text-[var(--m-accent)] shadow-xs font-bold border border-[var(--m-line-strong)]'
                    : 'text-[var(--m-ink-3)] hover:text-[var(--m-ink)]'
                }`}
                title="Deutsch"
              >
                DE
              </button>
              <button
                onClick={() => setLang('es')}
                className={`px-2.5 py-1 rounded text-xs font-typewriter transition-all cursor-pointer ${
                  lang === 'es'
                    ? 'bg-[var(--m-bg)] text-[var(--m-accent)] shadow-xs font-bold border border-[var(--m-line-strong)]'
                    : 'text-[var(--m-ink-3)] hover:text-[var(--m-ink)]'
                }`}
                title="Español"
              >
                ES
              </button>
            </div>
          </div>
        </div>

        {/* Clean, Streamlined Tab Navigation with "Mehr & Werkzeuge" Dropdown */}
        <div className="flex items-center justify-between gap-2 py-2">
          {/* Main tabs container - can scroll horizontally on narrow viewports without clipping the dropdown */}
          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar min-w-0" aria-label="Main Navigation">
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
                      ? 'bg-[var(--m-accent)] text-[var(--m-on-accent)] shadow-xs border border-[var(--m-accent-strong)]'
                      : 'text-[var(--m-ink-3)] hover:text-[var(--m-ink)] hover:bg-[var(--m-sunk)]/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--m-gold)]' : 'text-[var(--m-muted)]'}`} />
                  <span className={isActive ? 'font-semibold tracking-tight' : ''}>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-typewriter font-bold ${
                        isActive
                          ? 'bg-[var(--m-accent-strong)] text-[#fde047]'
                          : 'bg-[var(--m-sunk)] text-[var(--m-ink-2)] border border-[var(--m-line-strong)]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* "Mehr & Werkzeuge" Dropdown - Sits OUTSIDE the scrolling nav so it is NEVER clipped */}
          <div className="relative shrink-0 ml-auto sm:ml-0" ref={dropdownRef}>
            <button
              type="button"
              id="header-more-menu-button"
              aria-haspopup="true"
              aria-expanded={isMoreOpen}
              onClick={() => setIsMoreOpen((prev) => !prev)}
              className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                isMoreActive
                  ? 'bg-[var(--m-accent)] text-[var(--m-on-accent)] shadow-xs border border-[var(--m-accent-strong)]'
                  : isMoreOpen
                  ? 'bg-[var(--m-sunk)] text-[var(--m-ink)] border border-[var(--m-line-strong)]'
                  : 'text-[var(--m-ink-3)] hover:text-[var(--m-ink)] hover:bg-[var(--m-sunk)]/60 border border-transparent'
              }`}
              title={t.nav.tools_archive_desc}
            >
              {isMoreActive && activeMoreItem ? (
                React.createElement(activeMoreItem.icon, {
                  className: 'w-4 h-4 text-[var(--m-gold)]',
                })
              ) : (
                <Sparkles className={`w-4 h-4 ${isMoreOpen ? 'text-[var(--m-accent)]' : 'text-[var(--m-muted)]'}`} />
              )}
              <span className={isMoreActive ? 'font-semibold tracking-tight' : ''}>
                {isMoreActive && activeMoreItem ? activeMoreItem.label : t.nav.more}
              </span>
              {isMoreActive && activeMoreItem?.badge !== undefined && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-typewriter font-bold bg-[var(--m-accent-strong)] text-[#fde047]">
                  {activeMoreItem.badge}
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isMoreOpen ? 'rotate-180 text-[var(--m-accent)]' : isMoreActive ? 'text-[var(--m-gold)]' : 'text-[var(--m-muted)]'
                }`}
              />
            </button>

            {/* Dropdown Menu - Explicitly anchored to right edge (right-0) with max-width and internal scroll */}
            {isMoreOpen && (
              <div
                id="header-more-dropdown-menu"
                role="menu"
                aria-orientation="vertical"
                className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-[var(--m-surface)] border border-[var(--m-line)] shadow-2xl p-2.5 z-50 animate-fadeIn max-h-[calc(100vh-6rem)] overflow-y-auto divide-y divide-[var(--m-sunk)]"
              >
                <div className="px-2.5 py-2">
                  <span className="text-[10px] font-typewriter uppercase tracking-widest text-[var(--m-accent)] font-bold block">
                    ✦ {t.nav.tools_archive} ✦
                  </span>
                  <p className="text-xs text-[var(--m-ink-3)] mt-0.5">
                    {t.nav.tools_archive_desc}
                  </p>
                </div>

                {moreGroups.map((group, gIdx) => (
                  <div key={gIdx} className="py-2 first:pt-1 space-y-1">
                    <div className="px-2.5 py-0.5 text-[10px] font-typewriter font-bold uppercase tracking-wider text-[var(--m-accent)]/80">
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
                              ? 'bg-[var(--m-accent)] text-white shadow-2xs'
                              : 'hover:bg-[var(--m-surface-2)] text-[var(--m-ink)]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isItemActive
                                  ? 'bg-[var(--m-accent-strong)] text-[var(--m-gold)]'
                                  : 'bg-[var(--m-sunk)] text-[var(--m-accent)]'
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
                                  isItemActive ? 'text-[var(--m-gold)]/90' : 'text-[var(--m-muted)]'
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
                                    ? 'bg-[var(--m-accent-strong)] text-[#fde047]'
                                    : 'bg-[var(--m-sunk)] text-[var(--m-ink-2)]'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            {isItemActive && <Check className="w-4 h-4 text-[var(--m-gold)]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
