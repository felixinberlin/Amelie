import React, { useState, useMemo } from 'react';
import { Search, Filter, Gift, Hammer, Lock, ArrowUpRight, Sparkles, Brain } from 'lucide-react';
import { DoseItem, Language, Verdict, DomainCategory } from '../types';
import { getTranslation } from '../i18n';

interface DosenGalleryProps {
  dosen: DoseItem[];
  lang: Language;
  onSelectDose: (dose: DoseItem) => void;
  onOpenSimulator?: (simId: 'altbau' | 'glasanflug' | 'streiflicht' | 'wetink' | 'balkon' | 'regenwasser' | 'klarlokal' | 'crackflora') => void;
}

export const DosenGallery: React.FC<DosenGalleryProps> = ({ dosen, lang, onSelectDose, onOpenSimulator }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerdict, setSelectedVerdict] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const t = getTranslation(lang);

  const filteredDosen = useMemo(() => {
    return dosen.filter((d) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        d.title.toLowerCase().includes(q) ||
        d.oneLinerDe.toLowerCase().includes(q) ||
        d.oneLinerEn.toLowerCase().includes(q) ||
        d.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        d.recipientsDe.toLowerCase().includes(q) ||
        d.recipientsEn.toLowerCase().includes(q) ||
        d.problemDe.toLowerCase().includes(q) ||
        d.problemEn.toLowerCase().includes(q);

      const matchesVerdict = selectedVerdict === 'all' || d.verdict === selectedVerdict;
      const matchesDomain = selectedDomain === 'all' || d.domain === selectedDomain;

      return matchesSearch && matchesVerdict && matchesDomain;
    });
  }, [dosen, searchQuery, selectedVerdict, selectedDomain]);

  const domainOptions = [
    { id: 'all', labelDe: 'Alle Bereiche', labelEn: 'All Domains', labelEs: 'Todas las áreas' },
    { id: 'civic', labelDe: 'Zivilgesellschaft & Berlin', labelEn: 'Civic & Berlin', labelEs: 'Sociedad civil y Berlín' },
    { id: 'tools', labelDe: 'DevTools & MCP', labelEn: 'DevTools & MCP', labelEs: 'DevTools y MCP' },
    { id: 'physics', labelDe: 'Hardware & Physik', labelEn: 'Hardware & Physics', labelEs: 'Hardware y Física' },
    { id: 'creative', labelDe: 'Kreativ & Kunst', labelEn: 'Creative & Art', labelEs: 'Creatividad y Arte' },
    { id: 'knowledge', labelDe: 'Lernen & Wissen', labelEn: 'Knowledge & Learning', labelEs: 'Aprendizaje y Ciencia' },
  ];

  const verdictOptions = [
    { id: 'all', labelDe: 'Alle Verdikte', labelEn: 'All Verdicts', labelEs: 'Todos los veredictos' },
    { id: 'gift', labelDe: '🎁 Verschenken', labelEn: '🎁 Gift', labelEs: '🎁 Regalar' },
    { id: 'build_first', labelDe: '🔨 Erst bauen', labelEn: '🔨 Build First', labelEs: '🔨 Construir primero' },
    { id: 'keep', labelDe: '🔒 Behalten', labelEn: '🔒 Kept', labelEs: '🔒 Conservar' },
  ];

  const getDomainLabel = (opt: typeof domainOptions[0]) => {
    if (lang === 'de') return opt.labelDe;
    if (lang === 'es') return opt.labelEs;
    return opt.labelEn;
  };

  const getVerdictOptionLabel = (opt: typeof verdictOptions[0]) => {
    if (lang === 'de') return opt.labelDe;
    if (lang === 'es') return opt.labelEs;
    return opt.labelEn;
  };

  const getVerdictLabel = (verdict: Verdict) => {
    if (verdict === 'gift') return t.ui.verdict_gift;
    if (verdict === 'build_first') return t.ui.verdict_build_first;
    return t.ui.verdict_keep;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Banner */}
      <div className="rounded-2xl bg-amber-900/5 border border-amber-800/20 p-6 md:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{t.ui.tins_badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-stone-900 tracking-tight">
            {t.ui.tins_heading}
          </h2>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            {t.ui.tins_subheading}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.ui.search_placeholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Domain Dropdown */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 shadow-xs"
          >
            {domainOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {getDomainLabel(opt)}
              </option>
            ))}
          </select>

          {/* Verdict Dropdown */}
          <select
            value={selectedVerdict}
            onChange={(e) => setSelectedVerdict(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 shadow-xs"
          >
            {verdictOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {getVerdictOptionLabel(opt)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Dosen */}
      {filteredDosen.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-white border border-stone-200 text-stone-500">
          <p className="text-base font-medium">
            {lang === 'de' ? 'Keine passende Dose gefunden.' : lang === 'es' ? 'No se encontró ninguna lata coincidente.' : 'No matching tins found.'}
          </p>
          <p className="text-xs text-stone-400 mt-1">
            {lang === 'de' ? 'Probiere andere Suchbegriffe oder Filter.' : lang === 'es' ? 'Intenta con otros términos o filtros.' : 'Try changing your search terms or filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDosen.map((dose) => {
            const isGift = dose.verdict === 'gift';
            const isBuildFirst = dose.verdict === 'build_first';
            const isKept = dose.verdict === 'keep';

            return (
              <div
                key={dose.id}
                onClick={() => onSelectDose(dose)}
                className="group relative rounded-2xl bg-[#fdfbf7] border border-stone-200 hover:border-amber-800/40 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-lg cursor-pointer"
              >
                <div>
                  {/* Card Header Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        isGift
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : isBuildFirst
                          ? 'bg-amber-50 text-amber-900 border border-amber-200'
                          : 'bg-stone-100 text-stone-800 border border-stone-300'
                      }`}
                    >
                      {isGift && <Gift className="w-3 h-3 text-emerald-600" />}
                      {isBuildFirst && <Hammer className="w-3 h-3 text-amber-700" />}
                      {isKept && <Lock className="w-3 h-3 text-stone-600" />}
                      <span>{getVerdictLabel(dose.verdict)}</span>
                    </span>

                    {dose.aiFrontier && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono-code font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-2xs">
                        <Brain className="w-3 h-3 text-indigo-700" />
                        <span>AI-Native</span>
                      </span>
                    )}

                    <span className="text-xs font-mono-code text-stone-600">
                      {dose.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold font-serif-title text-stone-900 group-hover:text-amber-900 transition-colors tracking-tight flex items-center justify-between">
                    <span>{dose.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>

                  {/* Simulator badge if available */}
                  {dose.id === 'altbau-thermal' && onOpenSimulator && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSimulator('altbau');
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100/90 hover:bg-amber-200 text-amber-900 text-xs font-mono-code font-bold transition-all shadow-2xs border border-amber-300/80"
                      >
                        <Sparkles className="w-3 h-3 text-amber-700" />
                        <span>{lang === 'de' ? '🏢 Live-Wärmebilanz Simulator' : '🏢 Live Heat Loss Simulator'}</span>
                      </button>
                    </div>
                  )}
                  {dose.id === 'wet-ink-capillary' && onOpenSimulator && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSimulator('wetink');
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100/90 hover:bg-amber-200 text-amber-900 text-xs font-mono-code font-bold transition-all shadow-2xs border border-amber-300/80"
                      >
                        <Sparkles className="w-3 h-3 text-amber-700" />
                        <span>{lang === 'de' ? '🖋️ Live-Tinte Simulator' : '🖋️ Live Wet Ink Simulator'}</span>
                      </button>
                    </div>
                  )}
                  {dose.id === 'klarlokal' && onOpenSimulator && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSimulator('klarlokal');
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/90 hover:bg-emerald-200 text-emerald-950 text-xs font-mono-code font-bold transition-all shadow-2xs border border-emerald-300/80"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-700" />
                        <span>{lang === 'de' ? '🛡️ Live-Brecheisen Simulator' : '🛡️ Live Battering Ram'}</span>
                      </button>
                    </div>
                  )}
                  {dose.id === 'crack-flora-watcher' && onOpenSimulator && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSimulator('crackflora');
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-lime-100/90 hover:bg-lime-200 text-lime-950 text-xs font-mono-code font-bold transition-all shadow-2xs border border-lime-400/80"
                      >
                        <Sparkles className="w-3 h-3 text-lime-800" />
                        <span>{lang === 'de' ? '🌱 Live-Ritzengrün Simulator' : '🌱 Live Pavement Lab'}</span>
                      </button>
                    </div>
                  )}

                  {/* One Liner */}
                  <p className="mt-2 text-xs sm:text-sm text-stone-700 italic font-serif-title line-clamp-3 leading-relaxed">
                    "{lang === 'de' ? dose.oneLinerDe : dose.oneLinerEn}"
                  </p>

                  {/* Recipient */}
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <span className="text-xs text-stone-600 block">
                      {t.ui.recipient}
                    </span>
                    <p className="text-xs font-semibold text-stone-800 line-clamp-1">
                      {lang === 'de' ? dose.recipientsDe : dose.recipientsEn}
                    </p>
                  </div>
                </div>

                {/* Tags & Action */}
                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {dose.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {dose.tags.length > 2 && (
                      <span className="text-xs text-stone-600 px-1 py-0.5">
                        +{dose.tags.length - 2}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-amber-900 group-hover:underline">
                    {t.ui.open_tin}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
