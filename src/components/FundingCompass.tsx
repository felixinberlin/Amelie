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
  Copy,
  Check,
  Landmark,
  Users,
  Wand2,
  X,
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
  FundingItem,
  FundingStatus,
  FundingApplicant,
  FundingTopic,
  fundingStatus,
  daysUntil,
} from '../data/funding';

interface FundingCompassProps {
  lang: Language;
}

type StatusFilter = 'live' | 'all';

const STATUS_STYLE: Record<FundingStatus, { cls: string; de: string; en: string }> = {
  'opens-soon': { cls: 'bg-[#fde68a] text-[#78350f] border-[#f59e0b]', de: 'Öffnet bald', en: 'Opens soon' },
  open: { cls: 'bg-[#d1fae5] text-[#064e3b] border-[#34d399]', de: 'Offen', en: 'Open' },
  closing: { cls: 'bg-[#fee2e2] text-[#7f1d1d] border-[#f87171]', de: 'Frist naht', en: 'Closing soon' },
  rolling: { cls: 'bg-[#dbeafe] text-[#1e3a8a] border-[#60a5fa]', de: 'Laufend', en: 'Rolling' },
  closed: { cls: 'bg-[#e7e5e4] text-[#57534e] border-[#d6d3d1]', de: 'Abgelaufen', en: 'Closed' },
  cycle: { cls: 'bg-[#f3e8d8] text-[#6b4a2b] border-[#d8c3a5]', de: 'Zyklisch', en: 'Cyclical' },
  paused: { cls: 'bg-[#ede9fe] text-[#4c1d95] border-[#a78bfa]', de: 'Pausiert', en: 'Paused' },
  resource: { cls: 'bg-[#fbf7f0] text-[#5c4a3d] border-[#d8cbba]', de: 'Ressource', en: 'Resource' },
};

const LIVE: FundingStatus[] = ['opens-soon', 'open', 'closing', 'rolling'];

function fmtDate(iso: string, lang: Language): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const FitDots: React.FC<{ fit: number; label: string }> = ({ fit, label }) => (
  <span className="inline-flex items-center gap-1" title={label} aria-label={`${label}: ${fit}/3`}>
    {[1, 2, 3].map((n) => (
      <span
        key={n}
        className={`w-2.5 h-2.5 rounded-full border ${
          n <= fit ? 'bg-[#8c1d40] border-[#741533]' : 'bg-transparent border-[#cdbba5]'
        }`}
      />
    ))}
  </span>
);

export const FundingCompass: React.FC<FundingCompassProps> = ({ lang }) => {
  const isDe = lang === 'de';
  const L = (de: string, en: string) => (isDe ? de : en);
  const now = useMemo(() => new Date(), []);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('live');
  const [applicant, setApplicant] = useState<FundingApplicant | ''>('');
  const [topic, setTopic] = useState<FundingTopic | ''>('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showMethod, setShowMethod] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const enriched = useMemo(
    () => FUNDING_DATA.map((item) => ({ item, status: fundingStatus(item, now) })),
    [now]
  );

  const stats = useMemo(() => {
    const live = enriched.filter((e) => LIVE.includes(e.status)).length;
    const dated = enriched.filter((e) => e.status === 'open' || e.status === 'closing' || e.status === 'opens-soon').length;
    const high = enriched.filter((e) => e.item.fit === 3).length;
    return { total: enriched.length, live, dated, high };
  }, [enriched]);

  const upcoming = useMemo(
    () =>
      FUNDING_EVENTS.map((e) => ({ ...e, days: daysUntil(e.date, now) }))
        .filter((e) => e.days >= 0)
        .sort((a, b) => a.days - b.days)
        .slice(0, 6),
    [now]
  );

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

  const reset = () => {
    setQuery('');
    setCategory('all');
    setApplicant('');
    setTopic('');
    setStatusFilter('live');
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="amelie-tin-box rounded-2xl p-5 sm:p-7 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[#8c1d40] mb-2">
              <Compass className="w-5 h-5" />
              <span className="font-typewriter text-xs font-bold tracking-widest uppercase">
                {L('Förderkompass', 'Funding compass')}
              </span>
            </div>
            <h2 className="font-amelie text-2xl sm:text-4xl font-bold text-[#2b1e16] leading-tight">
              {L('Wer zahlt, wer sucht, wer wartet auf eine Dose?', 'Who pays, who searches, who is waiting for a tin?')}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#5c4a3d] leading-relaxed">
              {L(
                'Geldgeber sind Schmerzbekenntnisse: Wer Geld auslobt, hat das Problem schon amtlich bestätigt. Hier stehen Fonds, Preise, EU-Programme, Städte und Angels, die Ideen liefern, Empfänger nennen oder Ticket 01 einer Dose bezahlen könnten.',
                'Funders are confessions of pain: whoever puts money on the table has already confirmed the problem. Here are the funds, prizes, EU programmes, cities and angels that supply ideas, name recipients, or could pay for a tin’s Ticket 01.'
              )}
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
            {[
              { v: stats.total, l: L('Quellen', 'Sources') },
              { v: stats.live, l: L('jetzt nutzbar', 'usable now') },
              { v: stats.high, l: L('Top-Passung', 'top fit') },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-[#d8cbba] bg-[#fbf7f0] px-3 py-2.5 text-center min-w-[84px]">
                <dt className="sr-only">{s.l}</dt>
                <dd className="font-amelie text-2xl sm:text-3xl font-bold text-[#8c1d40] leading-none">{s.v}</dd>
                <span className="block mt-1 text-[10px] sm:text-[11px] font-typewriter text-[#6b5849]">{s.l}</span>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#e0b96f] bg-[#fdf3d8] px-3.5 py-3 text-xs sm:text-sm text-[#5a4210]">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-[#b45309]" />
          <p>
            {L(
              'Stand 28.09.2026. Die meisten Angaben stammen aus Suchschnipseln, nur „gelesen" markierte Zeilen aus der Seite selbst. Vor jeder Nennung in einer Mail Frist, Summe und Zulässigkeit auf der Primärseite prüfen. Der Status (offen, abgelaufen) wird aus dem heutigen Datum berechnet.',
              'As of 28 Sep 2026. Most entries come from search snippets; only rows marked “read” come from the page itself. Before quoting any in a mail, verify deadline, amount and eligibility on the primary page. Status (open, closed) is computed from today’s date.'
            )}
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section aria-label={L('Nächste Termine', 'Next dates')} className="rounded-2xl border border-[#dfd1be] bg-[#fbf6ee] p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4 text-[#2b1e16]">
          <CalendarClock className="w-4 h-4 text-[#8c1d40]" />
          <h3 className="font-amelie text-lg font-bold">{L('Die nächsten Termine', 'The next dates')}</h3>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-[#6b5849]">{L('Keine bevorstehenden Termine hinterlegt.', 'No upcoming dates on file.')}</p>
        ) : (
          <ol className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e, i) => (
              <li
                key={`${e.date}-${e.labelEn}`}
                className="group relative rounded-xl border border-[#e2d5c1] bg-white/70 p-3.5 hover:border-[#8c1d40]/50 hover:shadow-sm transition"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-typewriter text-[11px] text-[#8b6f57]">{fmtDate(e.date, lang)}</span>
                  <span
                    className={`font-typewriter text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      e.days <= 14 ? 'bg-[#8c1d40] text-[#fff9f5]' : 'bg-[#ede3d1] text-[#5c4a3d]'
                    }`}
                  >
                    {e.days === 0 ? L('heute', 'today') : L(`in ${e.days} T.`, `in ${e.days} d`)}
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-[#2b1e16] leading-snug">{L(e.labelDe, e.labelEn)}</p>
                {i === 0 && (
                  <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#8c1d40] font-typewriter font-bold">
                    <Sparkles className="w-3 h-3" /> {L('als Nächstes', 'next up')}
                  </span>
                )}
                {e.refId && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setCategory('all');
                      setStatusFilter('all');
                      setApplicant('');
                      setTopic('');
                      setExpanded(e.refId!);
                      document.getElementById(`funding-${e.refId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="mt-2 block text-[11px] text-[#6b5849] underline decoration-dotted underline-offset-2 hover:text-[#8c1d40] cursor-pointer"
                  >
                    {L('Eintrag ansehen', 'View entry')}
                  </button>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Matchmaker */}
      <section className="rounded-2xl border border-[#8c1d40]/25 bg-gradient-to-br from-[#fff8f3] to-[#f6ebdc] p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-1 text-[#8c1d40]">
          <Wand2 className="w-4 h-4" />
          <h3 className="font-amelie text-lg font-bold text-[#2b1e16]">{L('Passende Geldgeber finden', 'Find the right funders')}</h3>
        </div>
        <p className="text-sm text-[#5c4a3d] mb-4">
          {L('Wähle, wer den Antrag stellt und worum es geht. Die Liste unten sortiert sich nach Passung für eine Dose.', 'Pick who applies and what it is about. The list below re-sorts by fit for a tin.')}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-typewriter font-bold text-[#6b5849] mb-2">
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
                      ? 'bg-[#8c1d40] text-[#fff9f5] border-[#741533] font-semibold'
                      : 'bg-white/70 text-[#5c4a3d] border-[#d8cbba] hover:border-[#8c1d40]/50'
                  }`}
                >
                  {L(a.de, a.en)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="flex items-center gap-1.5 text-xs font-typewriter font-bold text-[#6b5849] mb-2">
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
                      ? 'bg-[#1b4332] text-[#f0fdf4] border-[#14342a] font-semibold'
                      : 'bg-white/70 text-[#5c4a3d] border-[#d8cbba] hover:border-[#1b4332]/50'
                  }`}
                >
                  {L(tp.de, tp.en)}
                </button>
              ))}
            </div>
          </div>
        </div>
        {matchmakerActive && (
          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <span className="text-[#5c4a3d]">
              {L(`${results.length} Treffer, beste Passung zuerst.`, `${results.length} matches, best fit first.`)}
            </span>
            <button
              type="button"
              onClick={() => {
                setApplicant('');
                setTopic('');
              }}
              className="inline-flex items-center gap-1 text-[#8c1d40] hover:underline cursor-pointer"
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
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6f57]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={L('Name, Geldgeber, Stichwort …', 'Name, funder, keyword …')}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#d8cbba] bg-[#fbf7f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#8c1d40]/30"
            />
          </label>
          <div className="inline-flex rounded-xl border border-[#d8cbba] bg-[#ede3d1]/60 p-1 self-start">
            {(['live', 'all'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={statusFilter === s}
                onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm cursor-pointer transition ${
                  statusFilter === s ? 'bg-[#fbf7f0] text-[#8c1d40] font-bold shadow-xs' : 'text-[#6b5849]'
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
                  ? 'bg-[#2b1e16] text-[#fbf7f0] border-[#2b1e16] font-semibold'
                  : 'bg-[#fbf7f0] text-[#5c4a3d] border-[#d8cbba] hover:border-[#2b1e16]/40'
              }`}
            >
              {L(c.de, c.en)}
            </button>
          ))}
        </div>
      </section>

      {/* Results */}
      <section aria-live="polite">
        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d8cbba] p-8 text-center text-[#6b5849]">
            <p className="font-amelie text-lg">{L('Nichts gefunden.', 'Nothing found.')}</p>
            <button type="button" onClick={reset} className="mt-2 text-[#8c1d40] hover:underline cursor-pointer text-sm">
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
                  className={`rounded-2xl border bg-[#fdfbf7] p-4 sm:p-5 transition hover:shadow-md ${
                    open ? 'border-[#8c1d40]/50 shadow-md' : 'border-[#dfd1be]'
                  } ${dead ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-typewriter text-[11px] text-[#8b6f57]">
                        {L(
                          FUNDING_CATEGORIES.find((c) => c.id === item.category)!.de,
                          FUNDING_CATEGORIES.find((c) => c.id === item.category)!.en
                        )}
                      </span>
                      <h4 className="font-amelie text-lg font-bold text-[#2b1e16] leading-snug">{L(item.nameDe, item.nameEn)}</h4>
                      <p className="text-xs text-[#6b5849] mt-0.5">{item.funder}</p>
                    </div>
                    <span className={`shrink-0 text-[11px] font-typewriter font-bold px-2.5 py-1 rounded-full border ${st.cls}`}>
                      {L(st.de, st.en)}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-semibold text-[#3b2a1e]">{L(item.amountDe, item.amountEn)}</p>

                  {item.deadline && (
                    <p className="mt-1.5 text-xs font-typewriter text-[#6b5849]">
                      {daysLeft !== null && daysLeft >= 0
                        ? L(`Frist ${fmtDate(item.deadline, lang)} (in ${daysLeft} Tagen)`, `Deadline ${fmtDate(item.deadline, lang)} (in ${daysLeft} days)`)
                        : L(`Frist war ${fmtDate(item.deadline, lang)}`, `Deadline was ${fmtDate(item.deadline, lang)}`)}
                    </p>
                  )}
                  {(item.nextDe || item.nextEn) && (
                    <p className="mt-1 text-xs text-[#6b5849]">{L(item.nextDe ?? '', item.nextEn ?? '')}</p>
                  )}

                  <p className="mt-3 text-sm text-[#4a382b] leading-relaxed">{L(item.fitDe, item.fitEn)}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                    <span className="inline-flex items-center gap-2 text-[#6b5849]">
                      {L('Passung', 'Fit')}
                      <FitDots fit={item.fit} label={L('Passung für eine Dose', 'Fit for a tin')} />
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded border font-typewriter ${
                        item.evidence === 'read'
                          ? 'border-[#34d399] bg-[#ecfdf5] text-[#065f46]'
                          : 'border-[#d8cbba] bg-[#f6efe4] text-[#6b5849]'
                      }`}
                      title={L('Evidenz', 'Evidence')}
                    >
                      {item.evidence === 'read' ? L('gelesen', 'read') : L('Schnipsel', 'snippet')}
                    </span>
                    <span className="text-[#8b6f57] font-typewriter">{L('geprüft', 'checked')} {fmtDate(item.checked, lang)}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8c1d40] text-[#fff9f5] text-xs font-semibold hover:bg-[#741533] transition"
                      >
                        {L('Zur Quelle', 'Open source')} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpanded(open ? null : item.id)}
                      aria-expanded={open}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#d8cbba] text-xs text-[#5c4a3d] hover:bg-[#ede3d1]/60 cursor-pointer"
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
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#d8cbba] text-xs text-[#5c4a3d] hover:bg-[#ede3d1]/60 cursor-pointer"
                      aria-label={L('Kurzinfo kopieren', 'Copy summary')}
                    >
                      {copied === item.id ? <Check className="w-3 h-3 text-[#166534]" /> : <Copy className="w-3 h-3" />}
                      {copied === item.id ? L('Kopiert', 'Copied') : L('Kopieren', 'Copy')}
                    </button>
                  </div>

                  {open && (
                    <div className="mt-3 rounded-xl bg-[#f6efe4] border border-[#e2d5c1] p-3 text-xs sm:text-sm text-[#4a382b] space-y-2">
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

      {/* Method */}
      <section className="rounded-2xl border border-[#dfd1be] bg-[#fbf6ee]">
        <button
          type="button"
          onClick={() => setShowMethod((v) => !v)}
          aria-expanded={showMethod}
          className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left cursor-pointer"
        >
          <span className="flex items-center gap-2 font-amelie text-lg font-bold text-[#2b1e16]">
            <BookOpen className="w-4 h-4 text-[#8c1d40]" />
            {L('So nutzt die Forschung den Kompass', 'How research uses the compass')}
          </span>
          {showMethod ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showMethod && (
          <div className="px-4 sm:px-5 pb-5 space-y-5">
            <ol className="list-decimal pl-5 space-y-2 text-sm text-[#4a382b] leading-relaxed">
              {FUNDING_RULES.map((r, i) => (
                <li key={i}>{L(r.de, r.en)}</li>
              ))}
            </ol>
            <div className="grid gap-3 md:grid-cols-3">
              {FUNDING_RECIPES.map((r) => (
                <div key={r.titleEn} className="rounded-xl border border-[#e2d5c1] bg-white/70 p-3.5">
                  <h4 className="font-amelie font-bold text-[#2b1e16] text-sm">{L(r.titleDe, r.titleEn)}</h4>
                  <code className="mt-2 block text-[11px] leading-snug font-typewriter bg-[#2b1e16] text-[#f5e9d3] rounded-lg p-2.5 break-words">
                    {r.query}
                  </code>
                  <p className="mt-2 text-xs text-[#5c4a3d] leading-relaxed">{L(r.stepsDe, r.stepsEn)}</p>
                  <button
                    type="button"
                    onClick={() => copyText(r.titleEn, r.query)}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#8c1d40] hover:underline cursor-pointer"
                  >
                    {copied === r.titleEn ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === r.titleEn ? L('Kopiert', 'Copied') : L('Suchbefehl kopieren', 'Copy query')}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#6b5849] leading-relaxed">{isDe ? FUNDING_GAPS_DE : FUNDING_GAPS_EN}</p>
            <p className="text-xs text-[#6b5849] leading-relaxed">
              {L(
                'Prosa, Fristen und Nachweise: 06-suche/amelie-foerderlandschaft.md und 06-suche/amelie-foerder-und-preisatlas.md. Rohdaten: public/data/funding.json.',
                'Prose, deadlines and evidence: 06-suche/amelie-foerderlandschaft.md and 06-suche/amelie-foerder-und-preisatlas.md. Raw data: public/data/funding.json.'
              )}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
