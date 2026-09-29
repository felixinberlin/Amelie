import React, { useMemo, useState } from 'react';
import {
  Compass,
  Search,
  ExternalLink,
  CalendarClock,
  Sparkles,
  ShieldAlert,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Landmark,
  Users,
  Wand2,
  X,
  Calendar,
  Rocket,
  Building2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Filter,
  DollarSign,
  HeartHandshake,
  Eye,
} from 'lucide-react';
import { Language } from '../types';
import {
  FUNDING_DATA,
  FUNDING_EVENTS,
  FUNDING_CATEGORIES,
  FUNDING_APPLICANTS,
  FUNDING_TOPICS,
  FUNDING_RULES,
  FUNDING_RECIPES,
  FUNDING_GAPS_DE,
  FUNDING_GAPS_EN,
  VENTURE_LEADS_DATA,
  SOLO_FOUNDER_GUIDES,
  REAL_PROJECTS_DATA,
  FundingItem,
  FundingStatus,
  FundingEvent,
  FundingApplicant,
  FundingTopic,
  VentureLead,
  SoloFounderTip,
  RealProjectChallenge,
  fundingStatus,
  daysUntil,
} from '../data/funding';

interface FundingCompassProps {
  lang: Language;
}

type MainTab = 'calendar' | 'database' | 'founders' | 'projects' | 'method';
type StatusFilter = 'live' | 'all';
type EventFilter = 'all' | 'deadline' | 'opening' | 'pitch' | 'event';

const STATUS_STYLE: Record<FundingStatus, { cls: string; de: string; en: string }> = {
  'opens-soon': { cls: 'bg-[#fde68a] text-[#78350f] border-[#f59e0b]', de: 'Öffnet bald', en: 'Opens soon' },
  open: { cls: 'bg-[#d1fae5] text-[#064e3b] border-[#34d399]', de: 'Offen', en: 'Open' },
  closing: { cls: 'bg-[#fee2e2] text-[#7f1d1d] border-[#f87171]', de: 'Frist naht', en: 'Closing soon' },
  rolling: { cls: 'bg-[#dbeafe] text-[#1e3a8a] border-[#60a5fa]', de: 'Laufend', en: 'Rolling' },
  closed: { cls: 'bg-[#e7e5e4] text-[#57534e] border-[#d6d3d1]', de: 'Abgelaufen', en: 'Closed' },
  cycle: { cls: 'bg-[#f3e8d8] text-[#6b4a2b] border-[#d8c3a5]', de: 'Zyklisch', en: 'Cyclical' },
  paused: { cls: 'bg-[#ede9fe] text-[#4c1d95] border-[#a78bfa]', de: 'Pausiert', en: 'Paused' },
  resource: { cls: 'bg-[var(--m-bg)] text-[var(--m-ink-2)] border-[var(--m-line-strong)]', de: 'Ressource', en: 'Resource' },
};

const EVENT_TYPE_STYLE: Record<NonNullable<FundingEvent['type']>, { cls: string; dot: string; de: string; en: string }> = {
  deadline: { cls: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500', de: 'Frist', en: 'Deadline' },
  opening: { cls: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', de: 'Öffnung', en: 'Opening' },
  pitch: { cls: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500', de: 'Pitch', en: 'Pitch' },
  event: { cls: 'bg-sky-100 text-sky-800 border-sky-200', dot: 'bg-sky-500', de: 'Event / Messe', en: 'Event' },
};

const LIVE: FundingStatus[] = ['opens-soon', 'open', 'closing', 'rolling'];

function fmtDate(iso: string, lang: Language): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function fmtMonthYear(date: Date, lang: Language): string {
  return date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

const FitDots: React.FC<{ fit: number; label: string }> = ({ fit, label }) => (
  <span className="inline-flex items-center gap-1" title={label} aria-label={`${label}: ${fit}/3`}>
    {[1, 2, 3].map((n) => (
      <span
        key={n}
        className={`w-2.5 h-2.5 rounded-full border ${
          n <= fit ? 'bg-[var(--m-accent)] border-[var(--m-accent-strong)]' : 'bg-transparent border-[#cdbba5]'
        }`}
      />
    ))}
  </span>
);

export const FundingCompass: React.FC<FundingCompassProps> = ({ lang }) => {
  const isDe = lang === 'de';
  const L = (de: string, en: string) => (isDe ? de : en);
  const now = useMemo(() => new Date(), []);

  // Main active tab
  const [activeTab, setActiveTab] = useState<MainTab>('calendar');

  // Calendar state
  const [calDate, setCalDate] = useState<Date>(() => new Date(2026, 9, 1)); // October 2026
  const [selectedDay, setSelectedDay] = useState<string | null>('2026-10-01');
  const [eventFilter, setEventFilter] = useState<EventFilter>('all');

  // Database state
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('live');
  const [applicant, setApplicant] = useState<FundingApplicant | ''>('');
  const [topic, setTopic] = useState<FundingTopic | ''>('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Founders state
  const [ventureCategory, setVentureCategory] = useState<string>('all');
  const [expandedVenture, setExpandedVenture] = useState<string | null>(null);

  // Projects state
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>('all');

  // Method accordion state
  const [showMethod, setShowMethod] = useState(false);

  const enriched = useMemo(
    () => FUNDING_DATA.map((item) => ({ item, status: fundingStatus(item, now) })),
    [now]
  );

  const stats = useMemo(() => {
    const live = enriched.filter((e) => LIVE.includes(e.status)).length;
    const dated = enriched.filter((e) => e.status === 'open' || e.status === 'closing' || e.status === 'opens-soon').length;
    const high = enriched.filter((e) => e.item.fit === 3).length;
    return {
      total: enriched.length,
      live,
      dated,
      high,
      events: FUNDING_EVENTS.length,
      ventures: VENTURE_LEADS_DATA.length,
      founders: SOLO_FOUNDER_GUIDES.length,
      projects: REAL_PROJECTS_DATA.length,
    };
  }, [enriched]);

  const upcoming = useMemo(
    () =>
      FUNDING_EVENTS.map((e) => ({ ...e, days: daysUntil(e.date, now) }))
        .filter((e) => (eventFilter === 'all' ? true : e.type === eventFilter))
        .filter((e) => e.days >= 0)
        .sort((a, b) => a.days - b.days),
    [now, eventFilter]
  );

  // Calendar month days calculation
  const calendarGrid = useMemo(() => {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: {
      day: number;
      iso: string;
      isCurrentMonth: boolean;
      events: FundingEvent[];
    }[] = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const iso = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const evs = FUNDING_EVENTS.filter((e) => e.date === iso && (eventFilter === 'all' || e.type === eventFilter));
      cells.push({ day, iso, isCurrentMonth: false, events: evs });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const evs = FUNDING_EVENTS.filter((e) => e.date === iso && (eventFilter === 'all' || e.type === eventFilter));
      cells.push({ day, iso, isCurrentMonth: true, events: evs });
    }

    // Trailing cells to fill 35 or 42 grid cells
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let day = 1; day <= remaining; day++) {
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        const iso = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const evs = FUNDING_EVENTS.filter((e) => e.date === iso && (eventFilter === 'all' || e.type === eventFilter));
        cells.push({ day, iso, isCurrentMonth: false, events: evs });
      }
    }

    return cells;
  }, [calDate, eventFilter]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return FUNDING_EVENTS.filter((e) => e.date === selectedDay);
  }, [selectedDay]);

  const matches = (item: FundingItem, status: FundingStatus): boolean => {
    if (category !== 'all' && item.category !== category) return false;
    if (statusFilter === 'live' && !LIVE.includes(status) && status !== 'resource') return false;
    if (applicant && !item.applicants.includes(applicant)) return false;
    if (topic && !item.topics.includes(topic)) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const hay = `${item.nameDe} ${item.nameEn} ${item.funder} ${item.fitDe} ${item.fitEn} ${item.amountDe}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  };

  const results = useMemo(() => {
    const order: Record<FundingStatus, number> = {
      closing: 0,
      'opens-soon': 1,
      open: 2,
      rolling: 3,
      resource: 4,
      cycle: 5,
      paused: 6,
      closed: 7,
    };
    return enriched
      .filter((e) => matches(e.item, e.status))
      .sort((a, b) => b.item.fit - a.item.fit || order[a.status] - order[b.status]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enriched, query, category, statusFilter, applicant, topic]);

  const matchmakerActive = Boolean(applicant || topic);

  const copyText = (id: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
  };

  const resetFilters = () => {
    setQuery('');
    setCategory('all');
    setApplicant('');
    setTopic('');
    setStatusFilter('live');
  };

  const jumpToFunding = (refId: string) => {
    setActiveTab('database');
    resetFilters();
    setStatusFilter('all');
    setExpanded(refId);
    setTimeout(() => {
      document.getElementById(`funding-${refId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const jumpToDate = (iso: string) => {
    const [y, m] = iso.split('-').map(Number);
    setCalDate(new Date(y, m - 1, 1));
    setSelectedDay(iso);
  };

  return (
    <div className="space-y-6">
      {/* Hero & Overview */}
      <section className="amelie-tin-box rounded-2xl p-5 sm:p-7 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[var(--m-accent)] mb-2">
              <Compass className="w-5 h-5" />
              <span className="font-typewriter text-xs font-bold tracking-widest uppercase">
                {L('Förder- & Gründerkompass', 'Funding & Founder Compass')}
              </span>
            </div>
            <h2 className="font-amelie text-2xl sm:text-4xl font-bold text-[var(--m-ink)] leading-tight">
              {L('Wer zahlt, wer sucht, wer baut auf einer Dose?', 'Who pays, who searches, who builds on a tin?')}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--m-ink-2)] leading-relaxed">
              {L(
                'Geldgeber und Ausschreibungen sind Schmerzbekenntnisse: Wer Geld auslobt, hat das Vollzugsproblem schon amtlich bestätigt. Hier finden Forscher und Gründer Förderprogramme, einen interaktiven Fristen-Kalender, reale NGO-Challenges und B2B-Zwillinge für nachhaltige Ausgründungen.',
                'Funders and public tenders are confessions of pain: whoever puts money on the table has confirmed the statutory deficit. Here researchers and founders find grant programmes, an interactive deadline calendar, real-world NGO challenges and commercial B2B twins.'
              )}
            </p>
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 shrink-0">
            {[
              { v: stats.total, l: L('Quellen', 'Sources') },
              { v: stats.events, l: L('Kalender-Termine', 'Calendar Dates') },
              { v: stats.ventures, l: L('B2B-Zwillinge', 'B2B Twins') },
              { v: stats.projects, l: L('Reale Bedarfe', 'Real Demands') },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-bg)] px-3 py-2.5 text-center min-w-[80px]">
                <dt className="sr-only">{s.l}</dt>
                <dd className="font-amelie text-2xl sm:text-3xl font-bold text-[var(--m-accent)] leading-none">{s.v}</dd>
                <span className="block mt-1 text-[10px] sm:text-[11px] font-typewriter text-[var(--m-ink-3)]">{s.l}</span>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#e0b96f] bg-[#fdf3d8] px-3.5 py-3 text-xs sm:text-sm text-[#5a4210]">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-[#b45309]" />
          <p>
            {L(
              'Stand 28.09.2026. Vor jeder Nennung in einer Mail Frist, Summe und Zulässigkeit auf der Primärseite prüfen. Amélie verschenkt alle offenen Kerne unter CC0; kommerzielle B2B-Zwillinge und Ausgründungen stehen Gründern frei.',
              'As of 28 Sep 2026. Verify deadline, amount and eligibility on the primary site prior to quoting. Amélie gives away all open cores under CC0; commercial B2B spin-offs remain entirely free to founders.'
            )}
          </p>
        </div>
      </section>

      {/* Main Tab Navigation */}
      <nav aria-label={L('Kompass-Bereiche', 'Compass sections')} className="flex flex-wrap gap-2 border-b border-[var(--m-line)] pb-3">
        {[
          { id: 'calendar', icon: Calendar, label: L('Fristen- & Event-Kalender', 'Deadlines & Events Calendar'), badge: stats.events },
          { id: 'database', icon: Compass, label: L('Förder- & Preiskatalog', 'Funding & Prize Catalog'), badge: stats.total },
          { id: 'founders', icon: Rocket, label: L('Gründer-Labor & B2B-Zwillinge', 'Founders Lab & B2B Twins'), badge: `${stats.founders}+${stats.ventures}` },
          { id: 'projects', icon: Building2, label: L('Reale NGO- & Stadtprojekte', 'Real NGO & City Projects'), badge: stats.projects },
          { id: 'method', icon: BookOpen, label: L('Methodik & Recherche', 'Methodology & Search') },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as MainTab)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer border ${
                isActive
                  ? 'bg-[var(--m-accent)] text-[var(--m-on-accent)] border-[var(--m-accent-strong)] shadow-xs'
                  : 'bg-[var(--m-bg)] text-[var(--m-ink-2)] border-[var(--m-line-strong)] hover:border-[var(--m-accent)]/50 hover:bg-[var(--m-on-accent)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] font-typewriter px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[var(--m-accent-strong)] text-white' : 'bg-[var(--m-sunk)] text-[var(--m-ink-3)]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── TAB 1: KALENDER & FRISTEN ─────────────────────────────────── */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Calendar Header & Month Switcher */}
          <section className="rounded-2xl border border-[var(--m-line)] bg-[var(--m-bg-2)] p-4 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-[var(--m-line)]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[var(--m-accent)] text-[var(--m-on-accent)]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-amelie text-xl sm:text-2xl font-bold text-[var(--m-ink)] capitalize">
                    {fmtMonthYear(calDate, lang)}
                  </h3>
                  <p className="text-xs text-[var(--m-ink-3)] font-typewriter">
                    {L('Stichtage, Öffnungen und Fachveranstaltungen', 'Deadlines, openings and conferences')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-xl border border-[var(--m-line-strong)] bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setCalDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                    className="p-1.5 rounded-lg text-[var(--m-ink-2)] hover:bg-[var(--m-sunk)]/50 cursor-pointer"
                    title={L('Vorheriger Monat', 'Previous month')}
                    aria-label={L('Vorheriger Monat', 'Previous month')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalDate(new Date(2026, 9, 1))}
                    className="px-3 py-1 rounded-lg text-xs font-semibold text-[var(--m-accent)] hover:bg-[var(--m-sunk)]/50 cursor-pointer"
                  >
                    {L('Okt 2026', 'Oct 2026')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                    className="p-1.5 rounded-lg text-[var(--m-ink-2)] hover:bg-[var(--m-sunk)]/50 cursor-pointer"
                    title={L('Nächster Monat', 'Next month')}
                    aria-label={L('Nächster Monat', 'Next month')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Event Type Filter */}
                <div className="flex items-center gap-1 overflow-x-auto py-1">
                  {(['all', 'deadline', 'opening', 'pitch', 'event'] as EventFilter[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setEventFilter(f)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        eventFilter === f
                          ? 'bg-[var(--m-ink)] text-[var(--m-on-accent)] border-[var(--m-ink)]'
                          : 'bg-white/80 text-[var(--m-ink-2)] border-[var(--m-line-strong)] hover:border-[var(--m-ink)]/40'
                      }`}
                    >
                      {f === 'all'
                        ? L('Alle', 'All')
                        : L(EVENT_TYPE_STYLE[f].de, EVENT_TYPE_STYLE[f].en)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Month Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
              {/* Day header labels */}
              {[
                L('Mo', 'Mon'),
                L('Di', 'Tue'),
                L('Mi', 'Wed'),
                L('Do', 'Thu'),
                L('Fr', 'Fri'),
                L('Sa', 'Sat'),
                L('So', 'Sun'),
              ].map((d) => (
                <div key={d} className="font-typewriter text-xs font-bold text-[var(--m-muted)] py-1.5">
                  {d}
                </div>
              ))}

              {/* Day cells */}
              {calendarGrid.map((cell) => {
                const isSelected = selectedDay === cell.iso;
                const hasEvents = cell.events.length > 0;
                return (
                  <button
                    key={cell.iso}
                    type="button"
                    onClick={() => setSelectedDay(cell.iso)}
                    className={`min-h-[64px] sm:min-h-[82px] p-1.5 sm:p-2 rounded-xl text-left border flex flex-col justify-between transition cursor-pointer ${
                      isSelected
                        ? 'border-[var(--m-accent)] bg-[#fff6f8] ring-2 ring-[var(--m-accent)]/30 shadow-xs'
                        : cell.isCurrentMonth
                        ? 'bg-white/80 border-[#e5d8c5] hover:border-[var(--m-accent)]/50 hover:bg-white'
                        : 'bg-[#f4ecdf]/40 border-transparent text-[#a89684] opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs sm:text-sm font-semibold ${
                          isSelected
                            ? 'text-[var(--m-accent)] font-bold'
                            : cell.isCurrentMonth
                            ? 'text-[var(--m-ink)]'
                            : 'text-[#a89684]'
                        }`}
                      >
                        {cell.day}
                      </span>
                      {hasEvents && (
                        <span className="font-typewriter text-[10px] font-bold text-[var(--m-accent)]">
                          {cell.events.length > 1 ? `×${cell.events.length}` : ''}
                        </span>
                      )}
                    </div>

                    {/* Event indicators */}
                    {hasEvents && (
                      <div className="space-y-1 mt-1 w-full overflow-hidden">
                        {cell.events.slice(0, 2).map((ev) => {
                          const style = ev.type ? EVENT_TYPE_STYLE[ev.type] : EVENT_TYPE_STYLE.event;
                          return (
                            <div
                              key={ev.labelEn}
                              className={`text-[9px] sm:text-[10px] truncate px-1 py-0.5 rounded border font-medium ${style.cls}`}
                              title={L(ev.labelDe, ev.labelEn)}
                            >
                              {L(ev.labelDe, ev.labelEn)}
                            </div>
                          );
                        })}
                        {cell.events.length > 2 && (
                          <div className="text-[9px] text-[var(--m-muted)] font-typewriter">
                            +{cell.events.length - 2} {L('weitere', 'more')}
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Day Inspector */}
            {selectedDay && (
              <div className="mt-5 rounded-xl border border-[var(--m-accent)]/30 bg-white p-4 sm:p-5 shadow-xs">
                <div className="flex items-baseline justify-between border-b border-[#e8ded1] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-[var(--m-accent)]" />
                    <h4 className="font-amelie text-base sm:text-lg font-bold text-[var(--m-ink)]">
                      {fmtDate(selectedDay, lang)}
                    </h4>
                  </div>
                  <span className="font-typewriter text-xs text-[var(--m-muted)]">
                    {selectedDayEvents.length}{' '}
                    {selectedDayEvents.length === 1 ? L('Ereignis', 'Event') : L('Ereignisse', 'Events')}
                  </span>
                </div>

                {selectedDayEvents.length === 0 ? (
                  <p className="text-xs sm:text-sm text-[var(--m-ink-3)] italic">
                    {L('Kein fester Stichtag oder Event an diesem Tag hinterlegt.', 'No fixed deadline or event scheduled for this day.')}
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {selectedDayEvents.map((ev) => {
                      const style = ev.type ? EVENT_TYPE_STYLE[ev.type] : EVENT_TYPE_STYLE.event;
                      return (
                        <div
                          key={ev.labelEn}
                          className="rounded-xl border border-[var(--m-line)] bg-[var(--m-surface)] p-3.5 space-y-2 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className={`text-[10px] font-typewriter font-bold px-2 py-0.5 rounded-full border ${style.cls}`}>
                                {L(style.de, style.en)}
                              </span>
                              <span className="font-typewriter text-[11px] text-[var(--m-muted)]">
                                {daysUntil(ev.date, now) === 0
                                  ? L('heute', 'today')
                                  : daysUntil(ev.date, now) > 0
                                  ? L(`in ${daysUntil(ev.date, now)} Tagen`, `in ${daysUntil(ev.date, now)} days`)
                                  : L('vergangen', 'passed')}
                              </span>
                            </div>
                            <h5 className="font-amelie font-bold text-sm text-[var(--m-ink)] leading-snug">
                              {L(ev.labelDe, ev.labelEn)}
                            </h5>
                            {(ev.descriptionDe || ev.descriptionEn) && (
                              <p className="text-xs text-[var(--m-ink-2)] mt-1 leading-relaxed">
                                {L(ev.descriptionDe ?? '', ev.descriptionEn ?? '')}
                              </p>
                            )}
                          </div>

                          {ev.refId && (
                            <button
                              type="button"
                              onClick={() => jumpToFunding(ev.refId!)}
                              className="inline-flex items-center gap-1.5 text-xs text-[var(--m-accent)] font-semibold hover:underline cursor-pointer pt-2 border-t border-[var(--m-sunk)]"
                            >
                              <span>{L('Details im Förderkatalog öffnen', 'View details in funding catalog')}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Upcoming Timeline Strip */}
          <section className="rounded-2xl border border-[var(--m-line)] bg-[var(--m-bg-2)] p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[var(--m-ink)]">
                <CalendarClock className="w-4 h-4 text-[var(--m-accent)]" />
                <h3 className="font-amelie text-lg font-bold">{L('Die nächsten Stichtage & Termine', 'Next deadlines & events')}</h3>
              </div>
              <span className="text-xs font-typewriter text-[var(--m-muted)]">
                {upcoming.length} {L('bevorstehend', 'upcoming')}
              </span>
            </div>

            {upcoming.length === 0 ? (
              <p className="text-sm text-[var(--m-ink-3)]">{L('Keine bevorstehenden Termine für diesen Filter hinterlegt.', 'No upcoming dates found for this filter.')}</p>
            ) : (
              <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.slice(0, 9).map((e, i) => {
                  const style = e.type ? EVENT_TYPE_STYLE[e.type] : EVENT_TYPE_STYLE.event;
                  return (
                    <li
                      key={`${e.date}-${e.labelEn}`}
                      className="group rounded-xl border border-[var(--m-line)] bg-white/80 p-3.5 hover:border-[var(--m-accent)]/50 hover:shadow-xs transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => jumpToDate(e.date)}
                            className="font-typewriter text-[11px] text-[var(--m-muted)] hover:underline cursor-pointer"
                            title={L('Im Kalender anzeigen', 'Show in calendar')}
                          >
                            {fmtDate(e.date, lang)}
                          </button>
                          <span
                            className={`font-typewriter text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              e.days <= 14 ? 'bg-[var(--m-accent)] text-[var(--m-on-accent)]' : 'bg-[var(--m-sunk)] text-[var(--m-ink-2)]'
                            }`}
                          >
                            {e.days === 0 ? L('heute', 'today') : L(`in ${e.days} T.`, `in ${e.days} d`)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className={`text-[9px] font-typewriter font-bold px-1.5 py-0.2 rounded border ${style.cls}`}>
                            {L(style.de, style.en)}
                          </span>
                          {i === 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--m-accent)] font-typewriter font-bold">
                              <Sparkles className="w-3 h-3" /> {L('als Nächstes', 'next up')}
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 text-sm font-semibold text-[var(--m-ink)] leading-snug">
                          {L(e.labelDe, e.labelEn)}
                        </p>
                        {(e.descriptionDe || e.descriptionEn) && (
                          <p className="mt-1 text-xs text-[var(--m-ink-3)] line-clamp-2">
                            {L(e.descriptionDe ?? '', e.descriptionEn ?? '')}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-[var(--m-sunk)] flex items-center justify-between text-[11px]">
                        <button
                          type="button"
                          onClick={() => jumpToDate(e.date)}
                          className="text-[var(--m-ink-3)] hover:text-[var(--m-accent)] cursor-pointer"
                        >
                          {L('Zum Kalender', 'Go to date')}
                        </button>
                        {e.refId && (
                          <button
                            type="button"
                            onClick={() => jumpToFunding(e.refId!)}
                            className="text-[var(--m-accent)] font-medium hover:underline cursor-pointer"
                          >
                            {L('Im Katalog', 'In catalog')}
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </div>
      )}

      {/* ── TAB 2: FÖRDERKATALOG ─────────────────────────────────────── */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          {/* Matchmaker */}
          <section className="rounded-2xl border border-[var(--m-accent)]/25 bg-gradient-to-br from-[#fff8f3] to-[#f6ebdc] p-4 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-1 text-[var(--m-accent)]">
              <Wand2 className="w-4 h-4" />
              <h3 className="font-amelie text-lg font-bold text-[var(--m-ink)]">
                {L('Passende Geldgeber finden (Matchmaker)', 'Find the right funders (Matchmaker)')}
              </h3>
            </div>
            <p className="text-sm text-[var(--m-ink-2)] mb-4">
              {L(
                'Wähle, wer den Antrag stellt und worum es geht. Die Liste unten sortiert sich nach Passung für eine Amélie-Dose.',
                'Pick who applies and what the topic is. The list below re-sorts by fit for an Amélie tin.'
              )}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-typewriter font-bold text-[var(--m-ink-3)] mb-2">
                  <Users className="w-3.5 h-3.5" /> {L('Ich bin', 'I am')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {FUNDING_APPLICANTS.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      aria-pressed={applicant === a.id}
                      onClick={() => setApplicant(applicant === a.id ? '' : a.id)}
                      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border transition cursor-pointer ${
                        applicant === a.id
                          ? 'bg-[var(--m-accent)] text-[var(--m-on-accent)] border-[var(--m-accent-strong)] font-semibold'
                          : 'bg-white/70 text-[var(--m-ink-2)] border-[var(--m-line-strong)] hover:border-[var(--m-accent)]/50'
                      }`}
                    >
                      {L(a.de, a.en)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="flex items-center gap-1.5 text-xs font-typewriter font-bold text-[var(--m-ink-3)] mb-2">
                  <Landmark className="w-3.5 h-3.5" /> {L('Thema der Dose', 'Topic of the tin')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {FUNDING_TOPICS.map((tp) => (
                    <button
                      key={tp.id}
                      type="button"
                      aria-pressed={topic === tp.id}
                      onClick={() => setTopic(topic === tp.id ? '' : tp.id)}
                      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border transition cursor-pointer ${
                        topic === tp.id
                          ? 'bg-[var(--m-green)] text-[#f0fdf4] border-[#14342a] font-semibold'
                          : 'bg-white/70 text-[var(--m-ink-2)] border-[var(--m-line-strong)] hover:border-[var(--m-green)]/50'
                      }`}
                    >
                      {L(tp.de, tp.en)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {matchmakerActive && (
              <div className="mt-4 flex items-center justify-between gap-3 text-sm border-t border-[#eedfc9] pt-3">
                <span className="text-[var(--m-ink-2)]">
                  {L(`${results.length} Treffer, beste Passung zuerst.`, `${results.length} matches, best fit first.`)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setApplicant('');
                    setTopic('');
                  }}
                  className="inline-flex items-center gap-1 text-[var(--m-accent)] hover:underline cursor-pointer text-xs font-semibold"
                >
                  <X className="w-3.5 h-3.5" /> {L('Auswahl löschen', 'Clear selection')}
                </button>
              </div>
            )}
          </section>

          {/* Filters */}
          <section className="space-y-3" aria-label={L('Filter', 'Filters')}>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="relative flex-1">
                <span className="sr-only">{L('Suchen', 'Search')}</span>
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--m-muted)]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={L('Name, Geldgeber, Stichwort …', 'Name, funder, keyword …')}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--m-accent)]/30"
                />
              </label>
              <div className="inline-flex rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-sunk)]/60 p-1 self-start">
                {(['live', 'all'] as StatusFilter[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={statusFilter === s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm cursor-pointer transition ${
                      statusFilter === s ? 'bg-[var(--m-bg)] text-[var(--m-accent)] font-bold shadow-xs' : 'text-[var(--m-ink-3)]'
                    }`}
                  >
                    {s === 'live' ? L('Jetzt nutzbar', 'Usable now') : L('Alle inkl. abgelaufen', 'All incl. closed')}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[{ id: 'all', de: 'Alle', en: 'All' }, ...FUNDING_CATEGORIES].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={category === c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm border cursor-pointer transition ${
                    category === c.id
                      ? 'bg-[var(--m-ink)] text-[var(--m-bg)] border-[var(--m-ink)] font-semibold'
                      : 'bg-[var(--m-bg)] text-[var(--m-ink-2)] border-[var(--m-line-strong)] hover:border-[var(--m-ink)]/40'
                  }`}
                >
                  {L(c.de, c.en)}
                </button>
              ))}
            </div>
          </section>

          {/* Results List */}
          <section aria-live="polite">
            {results.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--m-line-strong)] p-8 text-center text-[var(--m-ink-3)]">
                <p className="font-amelie text-lg">{L('Nichts gefunden.', 'Nothing found.')}</p>
                <button type="button" onClick={resetFilters} className="mt-2 text-[var(--m-accent)] hover:underline cursor-pointer text-sm">
                  {L('Filter zurücksetzen', 'Reset filters')}
                </button>
              </div>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {results.map(({ item, status }) => {
                  const st = STATUS_STYLE[status];
                  const open = expanded === item.id;
                  const dead = status === 'closed';
                  const daysLeft = item.deadline ? daysUntil(item.deadline, now) : null;
                  return (
                    <li
                      key={item.id}
                      id={`funding-${item.id}`}
                      className={`rounded-2xl border bg-[var(--m-surface)] p-4 sm:p-5 transition hover:shadow-md ${
                        open ? 'border-[var(--m-accent)]/50 shadow-md' : 'border-[var(--m-line)]'
                      } ${dead ? 'opacity-70' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="font-typewriter text-[11px] text-[var(--m-muted)]">
                            {L(
                              FUNDING_CATEGORIES.find((c) => c.id === item.category)!.de,
                              FUNDING_CATEGORIES.find((c) => c.id === item.category)!.en
                            )}
                          </span>
                          <h4 className="font-amelie text-lg font-bold text-[var(--m-ink)] leading-snug">{L(item.nameDe, item.nameEn)}</h4>
                          <p className="text-xs text-[var(--m-ink-3)] mt-0.5">{item.funder}</p>
                        </div>
                        <span className={`shrink-0 text-[11px] font-typewriter font-bold px-2.5 py-1 rounded-full border ${st.cls}`}>
                          {L(st.de, st.en)}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-semibold text-[#3b2a1e]">{L(item.amountDe, item.amountEn)}</p>

                      {item.deadline && (
                        <p className="mt-1.5 text-xs font-typewriter text-[var(--m-ink-3)]">
                          {daysLeft !== null && daysLeft >= 0
                            ? L(`Frist ${fmtDate(item.deadline, lang)} (in ${daysLeft} Tagen)`, `Deadline ${fmtDate(item.deadline, lang)} (in ${daysLeft} days)`)
                            : L(`Frist war ${fmtDate(item.deadline, lang)}`, `Deadline was ${fmtDate(item.deadline, lang)}`)}
                        </p>
                      )}
                      {(item.nextDe || item.nextEn) && (
                        <p className="mt-1 text-xs text-[var(--m-ink-3)]">{L(item.nextDe ?? '', item.nextEn ?? '')}</p>
                      )}

                      <p className="mt-3 text-sm text-[var(--m-ink-2)] leading-relaxed">{L(item.fitDe, item.fitEn)}</p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                        <span className="inline-flex items-center gap-2 text-[var(--m-ink-3)]">
                          {L('Passung', 'Fit')}
                          <FitDots fit={item.fit} label={L('Passung für eine Dose', 'Fit for a tin')} />
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border font-typewriter ${
                            item.evidence === 'read'
                              ? 'border-[#34d399] bg-[#ecfdf5] text-[#065f46]'
                              : 'border-[var(--m-line-strong)] bg-[#f6efe4] text-[var(--m-ink-3)]'
                          }`}
                          title={L('Evidenz', 'Evidence')}
                        >
                          {item.evidence === 'read' ? L('gelesen', 'read') : L('Schnipsel', 'snippet')}
                        </span>
                        <span className="text-[var(--m-muted)] font-typewriter">{L('geprüft', 'checked')} {fmtDate(item.checked, lang)}</span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--m-accent)] text-[var(--m-on-accent)] text-xs font-semibold hover:bg-[var(--m-accent-strong)] transition"
                          >
                            {L('Zur Quelle', 'Open source')} <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setExpanded(open ? null : item.id)}
                          aria-expanded={open}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--m-line-strong)] text-xs text-[var(--m-ink-2)] hover:bg-[var(--m-sunk)]/60 cursor-pointer"
                        >
                          {L('Bedingungen', 'Terms')} {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            copyText(
                              item.id,
                              `${L(item.nameDe, item.nameEn)} (${item.funder}): ${L(item.amountDe, item.amountEn)}${item.url ? ' ' + item.url : ''}`
                            )
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--m-line-strong)] text-xs text-[var(--m-ink-2)] hover:bg-[var(--m-sunk)]/60 cursor-pointer"
                          aria-label={L('Kurzinfo kopieren', 'Copy summary')}
                        >
                          {copied === item.id ? <Check className="w-3 h-3 text-[#166534]" /> : <Copy className="w-3 h-3" />}
                          {copied === item.id ? L('Kopiert', 'Copied') : L('Kopieren', 'Copy')}
                        </button>
                      </div>

                      {open && (
                        <div className="mt-3 rounded-xl bg-[#f6efe4] border border-[var(--m-line)] p-3 text-xs sm:text-sm text-[var(--m-ink-2)] space-y-2">
                          <p>
                            <span className="font-typewriter font-bold">{L('Antragsteller: ', 'Applicants: ')}</span>
                            {item.applicants
                              .map((a) => {
                                const f = FUNDING_APPLICANTS.find((x) => x.id === a)!;
                                return L(f.de, f.en);
                              })
                              .join(' · ')}
                          </p>
                          <p>
                            <span className="font-typewriter font-bold">{L('Themen: ', 'Topics: ')}</span>
                            {item.topics
                              .map((tp) => {
                                const f = FUNDING_TOPICS.find((x) => x.id === tp)!;
                                return L(f.de, f.en);
                              })
                              .join(' · ')}
                          </p>
                          {(item.conditionsDe || item.conditionsEn) && (
                            <p>
                              <span className="font-typewriter font-bold">{L('Bedingungen: ', 'Conditions: ')}</span>
                              {L(item.conditionsDe ?? '', item.conditionsEn ?? '')}
                            </p>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      )}

      {/* ── TAB 3: GRÜNDER-LABOR & B2B-ZWILLINGE ────────────────────── */}
      {activeTab === 'founders' && (
        <div className="space-y-8">
          {/* Section Introduction */}
          <section className="rounded-2xl border border-[var(--m-line-strong)] bg-gradient-to-br from-[#fcf7ee] to-[#f4e8d3] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2.5 text-[var(--m-accent)] mb-2">
              <Rocket className="w-5 h-5" />
              <h3 className="font-amelie text-xl sm:text-2xl font-bold text-[var(--m-ink)]">
                {L('Solo-Roadmap & Kommerzielle B2B-Zwillinge', 'Solo Roadmap & Commercial B2B Twins')}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-[var(--m-ink-2)] max-w-3xl leading-relaxed">
              {L(
                'Amélie folgt dem strikten Geschenk-Prinzip (CC0 gemeinfrei). Doch wenn ein Open-Source-Kern ein schmerzhaftes Marktproblem löst, entsteht Raum für ein profitables B2B-Unternehmen oder ein gebootstrapptes Micro-SaaS. Hier ist die Roadmap für Entwickler, die ohne VC-Zwang gründen wollen.',
                'Amélie strictly adheres to the gift principle (CC0 public domain). But whenever an open-source core addresses an acute statutory pain point, it paves the way for a resilient B2B software venture or bootstrapped micro-SaaS. Here is the blueprint for founders without VC pressure.'
              )}
            </p>

            {/* Complir Seed Alert Callout */}
            <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">
                  {L('Markt-Radar: Complir sammelt 11 Mio. $ Seed (September 2026)', 'Market Radar: Complir raises $11m Seed (September 2026)')}
                </p>
                <p className="mt-1 leading-relaxed text-amber-900">
                  {L(
                    'Complir (Kopenhagen) hat 11 Mio. $ von General Catalyst & Y Combinator für breite europäische Produkt-Compliance erhalten. Der Amélie-Zwilling ESPR DiscloseReady beweist: Statt eines unübersichtlichen All-in-One-Monolithen gewinnt der deterministische Einzelfokus auf ESPR Art. 24 & DVO 2026/2.',
                    'Complir (Copenhagen) secured $11m from General Catalyst & YC for broad EU product compliance. The Amélie twin ESPR DiscloseReady proves: instead of a monolithic platform, razor-sharp deterministic focus on ESPR Art. 24 & Implementing Reg 2026/2 captures enterprise pain faster.'
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Subsection 1: Solo-Gründer Roadmap */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[var(--m-accent)]" />
                <h4 className="font-amelie text-lg sm:text-xl font-bold text-[var(--m-ink)]">
                  {L('Solo-Gründer Werkzeuge & Finanzierung', 'Solo Founder Tools & Non-Dilutive Funding')}
                </h4>
              </div>
              <span className="text-xs font-typewriter text-[var(--m-muted)]">
                {SOLO_FOUNDER_GUIDES.length} {L('Leitfäden', 'Guides')}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SOLO_FOUNDER_GUIDES.map((guide) => (
                <div
                  key={guide.id}
                  className="rounded-2xl border border-[var(--m-line)] bg-[var(--m-surface)] p-4 sm:p-5 flex flex-col justify-between hover:shadow-sm transition"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-typewriter font-bold px-2 py-0.5 rounded-full bg-[var(--m-accent)]/10 text-[var(--m-accent)] border border-[var(--m-accent)]/20">
                        {L(guide.badgeDe, guide.badgeEn)}
                      </span>
                    </div>
                    <h5 className="font-amelie font-bold text-base text-[var(--m-ink)] leading-snug">
                      {L(guide.titleDe, guide.titleEn)}
                    </h5>
                    <p className="mt-1 text-xs font-semibold text-[var(--m-accent)]">
                      {L(guide.amountDe, guide.amountEn)}
                    </p>
                    <p className="mt-2 text-xs text-[var(--m-ink-2)] leading-relaxed">
                      {L(guide.summaryDe, guide.summaryEn)}
                    </p>

                    <div className="mt-3 space-y-1.5">
                      <p className="text-[11px] font-typewriter font-bold text-[var(--m-ink-3)] uppercase">
                        {L('Vorteile für Einzelkämpfer', 'Solo Advantages')}
                      </p>
                      <ul className="text-xs text-[var(--m-ink-2)] space-y-1">
                        {(isDe ? guide.prosDe : guide.prosEn).map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-3 rounded-xl bg-amber-50/80 border border-amber-200/80 p-2.5 text-[11px] text-amber-900">
                      <span className="font-bold">{L('Achtung: ', 'Watch out: ')}</span>
                      {L(guide.watchOutDe, guide.watchOutEn)}
                    </div>
                  </div>

                  {guide.link && (
                    <div className="mt-4 pt-3 border-t border-[var(--m-sunk)]">
                      <a
                        href={guide.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[var(--m-accent)] font-semibold hover:underline"
                      >
                        <span>{L('Offizielle Details ansehen', 'View official guidelines')}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Subsection 2: Die 8 Kommerziellen B2B-Zwillinge */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-[var(--m-accent)]" />
                  <h4 className="font-amelie text-lg sm:text-xl font-bold text-[var(--m-ink)]">
                    {L('Die 8 Kommerziellen B2B-Zwillinge (Venture Leads)', 'The 8 Commercial B2B Twins (Venture Leads)')}
                  </h4>
                </div>
                <p className="text-xs text-[var(--m-ink-3)] mt-0.5">
                  {L('Kommerzielle Ableitungen aus den Amélie-Kernen für B2B-Kunden', 'Commercial derivatives from Amélie tins for enterprise buyers')}
                </p>
              </div>

              {/* Category filter pills */}
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all', de: 'Alle (8)', en: 'All (8)' },
                  { id: 'compliance', de: 'Compliance', en: 'Compliance' },
                  { id: 'developer-tools', de: 'Dev Tools', en: 'Dev Tools' },
                  { id: 'legal-tech', de: 'Legal Tech', en: 'Legal Tech' },
                  { id: 'physics-sdk', de: 'Engines / SDK', en: 'Engines / SDK' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setVentureCategory(c.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      ventureCategory === c.id
                        ? 'bg-[var(--m-accent)] text-white border-[var(--m-accent-strong)]'
                        : 'bg-white/80 text-[var(--m-ink-2)] border-[var(--m-line-strong)] hover:border-[var(--m-accent)]/40'
                    }`}
                  >
                    {L(c.de, c.en)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {VENTURE_LEADS_DATA.filter(
                (lead) => ventureCategory === 'all' || lead.category === ventureCategory
              ).map((lead) => {
                const isExpanded = expandedVenture === lead.id;
                return (
                  <div
                    key={lead.id}
                    className="rounded-2xl border border-[var(--m-line)] bg-[var(--m-surface)] p-4 sm:p-5 flex flex-col justify-between hover:shadow-sm transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-typewriter font-bold px-2 py-0.5 rounded-full bg-[var(--m-green)]/10 text-[var(--m-green)] border border-[var(--m-green)]/20">
                            {lead.badge}
                          </span>
                          <h5 className="font-amelie font-bold text-lg text-[var(--m-ink)] mt-1 leading-snug">
                            {lead.name}
                          </h5>
                        </div>
                        <span
                          className={`text-[10px] font-typewriter font-bold px-2 py-0.5 rounded-full border ${
                            lead.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : lead.status === 'validated'
                              ? 'bg-sky-50 text-sky-800 border-sky-300'
                              : 'bg-stone-50 text-stone-700 border-stone-300'
                          }`}
                        >
                          {lead.status === 'active'
                            ? L('Aktiv validiert', 'Active validated')
                            : lead.status === 'validated'
                            ? L('Architektur bereit', 'Architecture ready')
                            : L('Recherche', 'Research')}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-[var(--m-accent)] mb-2">
                        {L(lead.oneLinerDe, lead.oneLinerEn)}
                      </p>

                      <div className="space-y-2 text-xs text-[var(--m-ink-2)]">
                        <p>
                          <span className="font-typewriter font-bold text-[var(--m-ink-3)]">{L('Problem: ', 'Pain: ')}</span>
                          {L(lead.problemDe, lead.problemEn)}
                        </p>
                        <p>
                          <span className="font-typewriter font-bold text-[var(--m-ink-3)]">{L('Zielgruppe: ', 'Target: ')}</span>
                          {L(lead.targetDe, lead.targetEn)}
                        </p>
                        <p>
                          <span className="font-typewriter font-bold text-[var(--m-ink-3)]">{L('Preismodell: ', 'Pricing: ')}</span>
                          <span className="font-semibold text-[var(--m-ink)]">{L(lead.pricingDe, lead.pricingEn)}</span>
                        </p>
                      </div>

                      {lead.competitorWarningDe && (
                        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-900">
                          <span className="font-bold">{L('Wettbewerbs-Radar: ', 'Competitor Radar: ')}</span>
                          {L(lead.competitorWarningDe, lead.competitorWarningEn ?? '')}
                        </div>
                      )}

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-[var(--m-sunk)] space-y-2 text-xs text-[var(--m-ink-2)]">
                          <p>
                            <span className="font-typewriter font-bold text-[var(--m-ink-3)]">{L('Burggraben & Differenzierung: ', 'Moat & Defensibility: ')}</span>
                            {L(lead.defensibilityDe, lead.defensibilityEn)}
                          </p>
                          <p>
                            <span className="font-typewriter font-bold text-[var(--m-ink-3)]">{L('Vertriebskanal: ', 'Distribution Channel: ')}</span>
                            {L(lead.channelDe, lead.channelEn)}
                          </p>
                          <p>
                            <span className="font-typewriter font-bold text-[var(--m-ink-3)]">{L('Passende Frühfinanzierung: ', 'Early Funding Fit: ')}</span>
                            {L(lead.fundingFitDe, lead.fundingFitEn)}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--m-sunk)] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setExpandedVenture(isExpanded ? null : lead.id)}
                        className="inline-flex items-center gap-1 text-xs text-[var(--m-accent)] font-semibold hover:underline cursor-pointer"
                      >
                        {isExpanded ? L('Weniger Details', 'Less details') : L('Burggraben & Vertrieb ansehen', 'View moat & distribution')}
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          copyText(
                            lead.id,
                            `${lead.name}: ${L(lead.oneLinerDe, lead.oneLinerEn)} · Pricing: ${L(lead.pricingDe, lead.pricingEn)}`
                          )
                        }
                        className="inline-flex items-center gap-1 text-[11px] text-[var(--m-ink-3)] hover:text-[var(--m-accent)] cursor-pointer"
                        title={L('Lead kopieren', 'Copy lead')}
                      >
                        {copied === lead.id ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                        {copied === lead.id ? L('Kopiert', 'Copied') : L('Kopieren', 'Copy')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* ── TAB 4: REALE NGO- & STADTPROJEKTE ────────────────────────── */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-[var(--m-line-strong)] bg-gradient-to-br from-[#fcf7ee] to-[#f4e8d3] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2.5 text-[var(--m-accent)] mb-2">
              <Building2 className="w-5 h-5" />
              <h3 className="font-amelie text-xl sm:text-2xl font-bold text-[var(--m-ink)]">
                {L('Reale NGO- & Stadtprojekte (Bedarfsnachweis)', 'Real NGO & City Projects (Validated Need)')}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-[var(--m-ink-2)] max-w-3xl leading-relaxed">
              {L(
                'Amélie baut nur Werkzeuge für nachgewiesene Schmerzpunkte realer Institutionen (Regel 2). Diese Förderinitiativen und Netzwerke dokumentieren hunderte konkrete Vollzugsprobleme von Umweltorganisationen, Kommunen und Behörden mit echtem Budget und politischem Mandat.',
                'Amélie only crafts tools for verified pain points of real institutions (Rule 2). These programmes document hundreds of acute statutory deficits from environmental NGOs, municipalities, and agencies with dedicated funding and political mandates.'
              )}
            </p>

            {/* Filter pills */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {[
                { id: 'all', de: 'Alle Bedarfe', en: 'All demands' },
                { id: 'ngo-challenge', de: 'NGO-Challenges', en: 'NGO Challenges' },
                { id: 'smart-city', de: 'Smart Cities & Kommunen', en: 'Smart Cities & Municipalities' },
                { id: 'civic-award', de: 'Fachjurys & Preise', en: 'Specialist Juries & Awards' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setProjectTypeFilter(f.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                    projectTypeFilter === f.id
                      ? 'bg-[var(--m-accent)] text-white border-[var(--m-accent-strong)]'
                      : 'bg-white/80 text-[var(--m-ink-2)] border-[var(--m-line-strong)] hover:border-[var(--m-accent)]/40'
                  }`}
                >
                  {L(f.de, f.en)}
                </button>
              ))}
            </div>
          </section>

          <div className="grid gap-5 md:grid-cols-2">
            {REAL_PROJECTS_DATA.filter(
              (p) => projectTypeFilter === 'all' || p.type === projectTypeFilter
            ).map((proj) => (
              <div
                key={proj.id}
                className="rounded-2xl border border-[var(--m-line)] bg-[var(--m-surface)] p-5 flex flex-col justify-between hover:shadow-sm transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-typewriter font-bold px-2 py-0.5 rounded-full bg-[var(--m-accent)]/10 text-[var(--m-accent)] border border-[var(--m-accent)]/20">
                      {L(proj.badgeDe, proj.badgeEn)}
                    </span>
                    <span className="text-[11px] font-typewriter text-[var(--m-muted)]">
                      {proj.initiator}
                    </span>
                  </div>

                  <h4 className="font-amelie font-bold text-lg text-[var(--m-ink)] leading-snug">
                    {L(proj.titleDe, proj.titleEn)}
                  </h4>

                  <p className="mt-2 text-xs sm:text-sm text-[var(--m-ink-2)] leading-relaxed">
                    {L(proj.descriptionDe, proj.descriptionEn)}
                  </p>

                  <div className="mt-4 space-y-2.5">
                    <div className="rounded-xl bg-rose-50/80 border border-rose-200/80 p-3 text-xs text-rose-950">
                      <span className="font-typewriter font-bold text-rose-800 uppercase text-[10px] block mb-1">
                        {L('Reales Vollzugsproblem (Schmerzpunkt)', 'Real Enforcement Deficit (Pain Point)')}
                      </span>
                      {L(proj.painDe, proj.painEn)}
                    </div>

                    <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/80 p-3 text-xs text-emerald-950">
                      <span className="font-typewriter font-bold text-emerald-800 uppercase text-[10px] block mb-1">
                        {L('Die Amélie-Chance (Ticket 01)', 'The Amélie Opportunity (Ticket 01)')}
                      </span>
                      {L(proj.opportunityDe, proj.opportunityEn)}
                    </div>
                  </div>
                </div>

                {proj.url && (
                  <div className="mt-4 pt-3 border-t border-[var(--m-sunk)] flex items-center justify-between">
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[var(--m-accent)] font-semibold hover:underline"
                    >
                      <span>{L('Initiative aufrufen', 'Visit initiative')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => copyText(proj.id, `${L(proj.titleDe, proj.titleEn)} (${proj.initiator}): ${proj.url}`)}
                      className="inline-flex items-center gap-1 text-[11px] text-[var(--m-ink-3)] hover:text-[var(--m-accent)] cursor-pointer"
                    >
                      {copied === proj.id ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                      {copied === proj.id ? L('Kopiert', 'Copied') : L('Kopieren', 'Copy')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: METHODIK & RECHERCHE ─────────────────────────────── */}
      {activeTab === 'method' && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-[var(--m-line)] bg-[var(--m-bg-2)] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-[var(--m-ink)]">
              <BookOpen className="w-5 h-5 text-[var(--m-accent)]" />
              <h3 className="font-amelie text-xl font-bold">
                {L('Die 4 Signale der Förderlandschaft', 'The 4 Signals of the Funding Landscape')}
              </h3>
            </div>
            <p className="text-sm text-[var(--m-ink-2)] leading-relaxed mb-6">
              {L(
                'Geldgeber, Preise, EU-Programme, Städte und Angels sind für Amélie kein Selbstzweck, sondern ein vierfaches Werkzeug:',
                'Funders, awards, EU programmes, cities and angels serve a fourfold purpose in Amélie:'
              )}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  titleDe: '1. Der Besetzt-Test',
                  titleEn: '1. The Taken-Test',
                  descDe: 'Taucht eine Idee bereits in geförderten Projekten (Prototype Fund, mFUND, DBU) auf? Dann ist sie besetzt -> ab auf den Friedhof.',
                  descEn: 'Does an idea already appear among funded projects (Prototype Fund, mFUND, DBU)? Then it is taken -> to the graveyard.',
                },
                {
                  titleDe: '2. Das Bedarfs-Signal',
                  titleEn: '2. The Need-Signal',
                  descDe: 'Wer Geld für ein Thema auslobt, belegt den Schmerz amtlich. Richtlinien benennen Defizite präziser als jede PR-Meldung.',
                  descEn: 'Whoever funds a topic officially proves the pain. Guidelines define deficits more sharply than any press release.',
                },
                {
                  titleDe: '3. Das Empfänger-Netzwerk',
                  titleEn: '3. The Recipient Network',
                  descDe: 'Preisträger, Fachjurys und Smart-City-Referenten sind Adressaten mit konkretem Vollzugsmandat für Kaltmails.',
                  descEn: 'Award winners, jury members and smart-city officers are recipients with genuine statutory mandates for gift delivery.',
                },
                {
                  titleDe: '4. Der Kommerzielle Zwilling',
                  titleEn: '4. The Commercial Twin',
                  descDe: 'Stichtag + Bußgeld + Beraterprüfung > 5.000 €? Dann entsteht aus dem offenen CC0-Kern ein lukrativer B2B-Zwilling.',
                  descEn: 'Hard deadline + statutory fine + consultant audit > €5,000? The open CC0 core yields a lucrative commercial B2B twin.',
                },
              ].map((sig) => (
                <div key={sig.titleEn} className="rounded-xl border border-[var(--m-line)] bg-white/80 p-4">
                  <h4 className="font-amelie font-bold text-sm text-[var(--m-ink)] mb-1.5">
                    {L(sig.titleDe, sig.titleEn)}
                  </h4>
                  <p className="text-xs text-[var(--m-ink-2)] leading-relaxed">
                    {L(sig.descDe, sig.descEn)}
                  </p>
                </div>
              ))}
            </div>

            {/* 7 Golden Rules */}
            <div className="mt-8 pt-6 border-t border-[var(--m-line)]">
              <h4 className="font-amelie font-bold text-base text-[var(--m-ink)] mb-3">
                {L('Die 7 Regeln für die Recherche & Dosenverpackung', 'The 7 Rules for Research & Packaging')}
              </h4>
              <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-[var(--m-ink-2)] leading-relaxed">
                {FUNDING_RULES.map((r, i) => (
                  <li key={i}>{L(r.de, r.en)}</li>
                ))}
              </ol>
            </div>

            {/* Search Recipes */}
            <div className="mt-8 pt-6 border-t border-[var(--m-line)]">
              <h4 className="font-amelie font-bold text-base text-[var(--m-ink)] mb-3">
                {L('Die 3 Suchrezepte im Playbook', 'The 3 Search Recipes in the Playbook')}
              </h4>
              <div className="grid gap-3 md:grid-cols-3">
                {FUNDING_RECIPES.map((r) => (
                  <div key={r.titleEn} className="rounded-xl border border-[var(--m-line)] bg-white/80 p-3.5 flex flex-col justify-between">
                    <div>
                      <h5 className="font-amelie font-bold text-[var(--m-ink)] text-sm">{L(r.titleDe, r.titleEn)}</h5>
                      <code className="mt-2 block text-[11px] leading-snug font-typewriter bg-[var(--m-ink)] text-[#f5e9d3] rounded-lg p-2.5 break-words">
                        {r.query}
                      </code>
                      <p className="mt-2 text-xs text-[var(--m-ink-2)] leading-relaxed">{L(r.stepsDe, r.stepsEn)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyText(r.titleEn, r.query)}
                      className="mt-3 inline-flex items-center gap-1 text-[11px] text-[var(--m-accent)] hover:underline cursor-pointer"
                    >
                      {copied === r.titleEn ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied === r.titleEn ? L('Kopiert', 'Copied') : L('Suchbefehl kopieren', 'Copy query')}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--m-line)] space-y-2 text-xs text-[var(--m-ink-3)] leading-relaxed">
              <p>{isDe ? FUNDING_GAPS_DE : FUNDING_GAPS_EN}</p>
              <p>
                {L(
                  'Prosa, Fristen und Nachweise: 06-suche/amelie-foerderlandschaft.md und 06-suche/amelie-foerder-und-preisatlas.md. Rohdaten: public/data/funding.json & public/data/ventures.json.',
                  'Prose, deadlines and evidence: 06-suche/amelie-foerderlandschaft.md and 06-suche/amelie-foerder-und-preisatlas.md. Raw data: public/data/funding.json & public/data/ventures.json.'
                )}
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
