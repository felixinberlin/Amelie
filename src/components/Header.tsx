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
  Briefcase,
  Gamepad2,
  Radar,
  MessageSquare,
  Library,
  Lightbulb,
  Wrench,
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
import { SISTER_PROJECTS } from '../data/sisterProjects';
import { QUELLEN_DATA } from '../data/quellen';
import { NAV_SECTIONS, NavSectionId, sectionOfTab, visibleSections } from '../data/navigation';

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
  const [adminMode, setAdminMode] = useState<boolean>(() => {
    try {
      return new URLSearchParams(window.location.search).has('admin') || localStorage.getItem('amelie-admin') === '1';
    } catch {
      return false;
    }
  });
  const toggleAdmin = () => {
    setAdminMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('amelie-admin', next ? '1' : '0');
      } catch {
        /* Speicher gesperrt: Schalter gilt nur für diese Sitzung */
      }
      return next;
    });
  };
  const L: 'de' | 'en' | 'es' = lang === 'de' ? 'de' : lang === 'es' ? 'es' : 'en';

  // Meta je Tab (Label, Icon, Zähler, Kurzbeschreibung); die Zuordnung zu Bereichen steht in data/navigation.ts
  const tabMeta: Record<string, { label: string; icon: React.ElementType; badge?: number; desc?: string }> = {
    dosen: { label: t.nav.tins, icon: Gift, badge: dosenCount },
    compare: { label: lang === 'de' ? 'Vergleich' : lang === 'es' ? 'Comparar' : 'Compare', icon: Radar },
    manifest: { label: t.nav.manifest, icon: Compass },
    unpacked: { label: t.nav.unpacked, icon: Sparkles, badge: unpackedCount, desc: t.nav.desc.unpacked },
    'normal-jobs': { label: t.nav.normalJobs, icon: Heart, badge: NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS.length },
    discarded: { label: t.nav.discarded, icon: Trash2, badge: discardedCount },
    games: { label: t.nav.games, icon: Gamepad2, badge: GAME_IDEAS.length + GAME_DOSE_IDS.length + PLAYABLE_GAME_COUNT },
    sandboxes: { label: t.nav.sandboxes, icon: Sliders, badge: SIMULATOR_COUNT },
    whimsy: { label: t.nav.whimsy, icon: Smile },
    quellen: { label: lang === 'de' ? 'Quellen' : lang === 'es' ? 'Fuentes' : 'Sources', icon: Library, badge: QUELLEN_DATA.length },
    relatives: { label: lang === 'de' ? 'Verwandte' : lang === 'es' ? 'Parientes' : 'Relatives', icon: Heart, badge: SISTER_PROJECTS.length },
    reddit: { label: 'Reddit', icon: MessageSquare },
    funding: { label: lang === 'de' ? 'Förderkompass' : lang === 'es' ? 'Brújula de fondos' : 'Funding compass', icon: Coins, badge: FUNDING_DATA.length },
    ventures: { label: 'Ventures', icon: Briefcase },
    playbook: { label: t.nav.playbook, icon: Search },
    matrix: { label: t.nav.matrix, icon: Mail, badge: mailsCount },
    'muster-emails': { label: t.nav.musterEmails, icon: Mail, badge: AMELIE_MUSTERS.length },
    packer: { label: t.nav.packer, icon: PlusCircle },
    'google-import': { label: t.nav.googleImport, icon: FolderSync },
    'data-hub': { label: t.nav.githubPages, icon: FolderGit2 },
    audit: { label: 'Self-Audit', icon: Activity },
  };
  const sectionIcon: Record<NavSectionId, React.ElementType> = {
    gifts: Gift, ideas: Lightbulb, play: Gamepad2, research: Library, workshop: Wrench,
  };
  const sections = visibleSections(currentTab, adminMode);
  const activeSection = sectionOfTab(currentTab);
  const openSection = (id: NavSectionId) => {
    const sec = NAV_SECTIONS.find((x) => x.id === id);
    if (sec && !sec.tabs.includes(currentTab)) setCurrentTab(sec.tabs[0]);
  };

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

        {/* Ebene 1: fünf Bereiche nach Absicht. Ebene 2: die Unterseiten des aktiven Bereichs. */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar min-w-0" aria-label="Main Navigation">
            {sections.map((sec) => {
              const Icon = sectionIcon[sec.id];
              const isActive = activeSection?.id === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => openSection(sec.id)}
                  title={sec.hint[L]}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--m-accent)] text-[var(--m-on-accent)] shadow-xs border border-[var(--m-accent-strong)]'
                      : 'text-[var(--m-ink-3)] hover:text-[var(--m-ink)] hover:bg-[var(--m-sunk)]/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--m-gold)]' : 'text-[var(--m-muted)]'}`} />
                  <span className={isActive ? 'font-semibold tracking-tight' : ''}>{sec.label[L]}</span>
                </button>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={toggleAdmin}
            aria-pressed={adminMode}
            title={L === 'de' ? 'Werkstatt (Betrieb) ein-/ausblenden' : 'Show/hide workshop (operations)'}
            className={`shrink-0 p-2 rounded-lg border cursor-pointer ${
              adminMode ? 'bg-[var(--m-sunk)] border-[var(--m-line-strong)] text-[var(--m-accent)]' : 'border-transparent text-[var(--m-muted)] hover:text-[var(--m-ink)]'
            }`}
          >
            <Wrench className="w-4 h-4" />
          </button>
        </div>

        {activeSection && (
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2" aria-label={activeSection.label[L]}>
            {activeSection.tabs.map((id) => {
              const m = tabMeta[id];
              if (!m) return null;
              const Icon = m.icon;
              const isActive = currentTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setCurrentTab(id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs sm:text-[13px] whitespace-nowrap cursor-pointer border ${
                    isActive
                      ? 'bg-[var(--m-sunk)] text-[var(--m-ink)] font-semibold border-[var(--m-line-strong)]'
                      : 'text-[var(--m-ink-3)] hover:text-[var(--m-ink)] border-transparent hover:bg-[var(--m-sunk)]/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[var(--m-accent)]" />
                  {m.label}
                  {m.badge !== undefined && (
                    <span className="text-[10px] px-1.5 rounded-full font-typewriter bg-[var(--m-bg)] border border-[var(--m-line)] text-[var(--m-ink-2)]">{m.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};
