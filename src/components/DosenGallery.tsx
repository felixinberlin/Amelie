import { Link } from 'react-router-dom';
import React, { useState, useMemo } from 'react';
import { Search, Filter, Gift, Hammer, Lock, ArrowUpRight, Sparkles, Brain, Link2, Check, ExternalLink, Maximize2, Tag, X } from 'lucide-react';
import { DoseItem, Language, Verdict, DomainCategory } from '../types';
import { getTranslation, getLocalizedTitle, withCount } from '../i18n';
import { DOSE_SIMULATOR_MAP } from '../data/doseSimulators';
import { getDoseUrl, getSimulatorUrl } from '../utils/doseUrl';
import { SimulatorKey } from '../data/doseSimulators';
import { AmelieRulesBanner } from './AmelieRulesBanner';
import { DoseVectorPanel } from './DoseVectorPanel';
import { VECTOR_CATALOG, getDoseVectors, vectorScore, totalScore, coreScore, vectorLabel, VectorKey } from '../data/vectors';

interface DosenGalleryProps {
  dosen: DoseItem[];
  lang: Language;
  onSelectDose: (dose: DoseItem) => void;
  onOpenSinglePage?: (dose: DoseItem) => void;
  onOpenSimulator?: (simId: SimulatorKey) => void;
  onOpenManifest?: () => void;
  onOpenEmails?: () => void;
  initialSelectedTag?: string | null;
  onSelectTag?: (tag: string | null) => void;
}

interface SimulatorBadgeConfig {
  simKey: SimulatorKey;
  labelDe: string;
  labelEn: string;
  labelEs: string;
  colorClasses: string;
  iconColor: string;
}

const SIMULATOR_BADGES: Record<string, SimulatorBadgeConfig> = {
  'altbau-thermal': {
    simKey: 'altbau',
    labelDe: '🏢 Live-Wärmebilanz Simulator',
    labelEn: '🏢 Live Heat Loss Simulator',
    labelEs: '🏢 Simulador de Pérdida Térmica',
    colorClasses: 'bg-[var(--m-copper)]/15 hover:bg-[var(--m-copper)]/25 text-[#78350f] border-[var(--m-copper)]/30',
    iconColor: 'text-[var(--m-copper)]',
  },
  'glasanflug-ampel': {
    simKey: 'glasanflug',
    labelDe: '🐦 Live-Vogelschlag & LAG-VSW Rechner',
    labelEn: '🐦 Live Bird Glass Strike Calculator',
    labelEs: '🐦 Calculadora de Riesgo de Colisión de Aves',
    colorClasses: 'bg-[#0284c7]/15 hover:bg-[#0284c7]/25 text-[#0369a1] border-[#0284c7]/30',
    iconColor: 'text-[#0284c7]',
  },
  'wet-ink': {
    simKey: 'wetink',
    labelDe: '🖋️ Live-Tinte Simulator',
    labelEn: '🖋️ Live Wet Ink Simulator',
    labelEs: '🖋️ Simulador de Tinta Líquida',
    colorClasses: 'bg-[var(--m-copper)]/15 hover:bg-[var(--m-copper)]/25 text-[#78350f] border-[var(--m-copper)]/30',
    iconColor: 'text-[var(--m-copper)]',
  },
  'wet-ink-capillary': {
    simKey: 'wetink',
    labelDe: '🖋️ Live-Tinte Simulator',
    labelEn: '🖋️ Live Wet Ink Simulator',
    labelEs: '🖋️ Simulador de Tinta Líquida',
    colorClasses: 'bg-[var(--m-copper)]/15 hover:bg-[var(--m-copper)]/25 text-[#78350f] border-[var(--m-copper)]/30',
    iconColor: 'text-[var(--m-copper)]',
  },
  'klarlokal': {
    simKey: 'klarlokal',
    labelDe: '🛡️ Live-Brecheisen Simulator',
    labelEn: '🛡️ Live Battering Ram',
    labelEs: '🛡️ Simulador KlarLokal',
    colorClasses: 'bg-[var(--m-green)]/15 hover:bg-[var(--m-green)]/25 text-[var(--m-green)] border-[var(--m-green)]/30',
    iconColor: 'text-[var(--m-green)]',
  },
  'crack-flora-watcher': {
    simKey: 'crackflora',
    labelDe: '🌱 Live-Ritzengrün Simulator',
    labelEn: '🌱 Live Pavement Lab',
    labelEs: '🌱 Laboratorio de Grietas',
    colorClasses: 'bg-[#2d5a27]/15 hover:bg-[#2d5a27]/25 text-[var(--m-green)] border-[#2d5a27]/30',
    iconColor: 'text-[#2d5a27]',
  },
  'kiez-laermkarte': {
    simKey: 'laerm',
    labelDe: '🎧 24h Zeitstruktur & Ruhe-Fenster',
    labelEn: '🎧 24h Noise & Quiet Windows',
    labelEs: '🎧 Simulador de Ruido 24h',
    colorClasses: 'bg-[var(--m-accent)]/15 hover:bg-[var(--m-accent)]/25 text-[var(--m-accent)] border-[var(--m-accent)]/30',
    iconColor: 'text-[var(--m-accent)]',
  },
  'streiflicht': {
    simKey: 'streiflicht',
    labelDe: '🔦 Live-Streiflicht RTI Labor',
    labelEn: '🔦 Live Grazing Light RTI Lab',
    labelEs: '🔦 Laboratorio RTI de Luz Rasante',
    colorClasses: 'bg-[#6366f1]/15 hover:bg-[#6366f1]/25 text-[#4338ca] border-[#6366f1]/30',
    iconColor: 'text-[#6366f1]',
  },
  'balkonkraftwerk': {
    simKey: 'balkon',
    labelDe: '☀️ Live-Balkon-PV Rechner',
    labelEn: '☀️ Live Balcony Solar Calculator',
    labelEs: '☀️ Calculadora Solar de Balcón',
    colorClasses: 'bg-[#d97706]/15 hover:bg-[#d97706]/25 text-[#92400e] border-[#d97706]/30',
    iconColor: 'text-[#d97706]',
  },
  'regenwasser': {
    simKey: 'regenwasser',
    labelDe: '🌧️ Live-Zisternen Simulator',
    labelEn: '🌧️ Live Rainwater Cistern Sizing',
    labelEs: '🌧️ Simulador de Agua de Lluvia',
    colorClasses: 'bg-[#0284c7]/15 hover:bg-[#0284c7]/25 text-[#0369a1] border-[#0284c7]/30',
    iconColor: 'text-[#0284c7]',
  },
  'fugenduell-patenschaft': {
    simKey: 'fugenduell',
    labelDe: '⚔️ Live-Fugenduell Arena',
    labelEn: '⚔️ Live Sidewalk Crack Arena',
    labelEs: '⚔️ Duelo de Grietas Urbanas',
    colorClasses: 'bg-[#78350f]/15 hover:bg-[#78350f]/25 text-[#78350f] border-[#78350f]/30',
    iconColor: 'text-[#78350f]',
  },
  tischschiedsrichter: {
    simKey: 'schiedsrichter',
    labelDe: '🟨 Live-Schiedsrichter (offline)',
    labelEn: '🟨 Live Table Referee (offline)',
    labelEs: '🟨 Árbitro en vivo (sin conexión)',
    colorClasses: 'bg-[#166534]/15 hover:bg-[#166534]/25 text-[#14532d] border-[#166534]/30',
    iconColor: 'text-[#166534]',
  },
  'fugenduell-asphalt-arena': {
    simKey: 'fugenduell',
    labelDe: '⚔️ Live-Fugenduell Arena',
    labelEn: '⚔️ Live Sidewalk Crack Arena',
    labelEs: '⚔️ Duelo de Grietas Urbanas',
    colorClasses: 'bg-[#78350f]/15 hover:bg-[#78350f]/25 text-[#78350f] border-[#78350f]/30',
    iconColor: 'text-[#78350f]',
  },
};

export const DosenGallery: React.FC<DosenGalleryProps> = ({
  dosen,
  lang,
  onSelectDose,
  onOpenSinglePage,
  onOpenSimulator,
  onOpenManifest,
  onOpenEmails,
  initialSelectedTag = null,
  onSelectTag,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerdict, setSelectedVerdict] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedTagState, setSelectedTagState] = useState<string | null>(initialSelectedTag);
  const [copiedDoseId, setCopiedDoseId] = useState<string | null>(null);
  const t = getTranslation(lang);

  const selectedTag = onSelectTag ? initialSelectedTag : selectedTagState;
  const handleSetSelectedTag = (tag: string | null) => {
    if (onSelectTag) {
      onSelectTag(tag);
    } else {
      setSelectedTagState(tag);
    }
  };

  const handleCopyUrl = (e: React.MouseEvent, doseId: string) => {
    e.stopPropagation();
    const url = getDoseUrl(doseId);
    navigator.clipboard.writeText(url);
    setCopiedDoseId(doseId);
    setTimeout(() => setCopiedDoseId(null), 2000);
  };

  const filteredDosen = useMemo(() => {
    const list = dosen.filter((d) => {
      const q = searchQuery.toLowerCase();
      const localizedTitle = getLocalizedTitle(d, lang).toLowerCase();
      const matchesSearch =
        d.title.toLowerCase().includes(q) ||
        localizedTitle.includes(q) ||
        d.oneLinerDe.toLowerCase().includes(q) ||
        d.oneLinerEn.toLowerCase().includes(q) ||
        d.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        d.recipientsDe.toLowerCase().includes(q) ||
        d.recipientsEn.toLowerCase().includes(q) ||
        d.problemDe.toLowerCase().includes(q) ||
        d.problemEn.toLowerCase().includes(q);

      const matchesVerdict = selectedVerdict === 'all' || d.verdict === selectedVerdict;
      const matchesDomain = selectedDomain === 'all' || d.domain === selectedDomain;
      const matchesTag = !selectedTag || d.tags.includes(selectedTag);

      return matchesSearch && matchesVerdict && matchesDomain && matchesTag;
    });
    if (sortBy === 'default') return list;
    const scoreOf = (id: string, key: string) => {
      const vec = getDoseVectors(id);
      if (!vec) return -1;
      if (key === 'total') return totalScore(vec);
      if (key === 'core') return coreScore(vec);
      return vectorScore(vec, key as VectorKey);
    };
    return [...list].sort(
      (a, b) => scoreOf(b.id, sortBy) - scoreOf(a.id, sortBy) || scoreOf(b.id, 'total') - scoreOf(a.id, 'total'),
    );
  }, [dosen, searchQuery, selectedVerdict, selectedDomain, selectedTag, sortBy, lang]);

  const domainOptions = [
    { id: 'all', labelDe: 'Alle Bereiche', labelEn: 'All Domains', labelEs: 'Todas las áreas' },
    { id: 'civic', labelDe: 'Zivilgesellschaft & Berlin', labelEn: 'Civic & Berlin', labelEs: 'Sociedad civil y Berlín' },
    { id: 'tools', labelDe: 'DevTools & MCP', labelEn: 'DevTools & MCP', labelEs: 'DevTools y MCP' },
    { id: 'physics', labelDe: 'Hardware & Physik', labelEn: 'Hardware & Physics', labelEs: 'Hardware y Física' },
    { id: 'creative', labelDe: 'Kreativ & Kunst', labelEn: 'Creative & Art', labelEs: 'Creatividad y Arte' },
    { id: 'knowledge', labelDe: 'Lernen & Wissen', labelEn: 'Knowledge & Learning', labelEs: 'Aprendizaje y Ciencia' },
    { id: 'git', labelDe: 'Git & Repositories', labelEn: 'Git & Repositories', labelEs: 'Git y Repositorios' },
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
      <div className="relative rounded-2xl bg-gradient-to-br from-[var(--m-surface-2)] via-[var(--m-surface-2)] to-[#eee2cf] border border-[var(--m-line-strong)] p-6 md:p-8 shadow-xs overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute right-4 top-2 select-none pointer-events-none opacity-10 hidden sm:block">
          <div className="font-amelie text-8xl font-bold text-[var(--m-accent)]">1974</div>
        </div>

        <div className="relative max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--m-accent)]/10 border border-[var(--m-accent)]/25 text-[var(--m-accent)] text-xs font-typewriter font-bold">
              <Gift className="w-3.5 h-3.5 text-[var(--m-accent)]" />
              <span>
                {lang === 'de'
                  ? 'BOÎTES EN FER-BLANC · DOSEN-ARCHIV'
                  : lang === 'es'
                  ? 'BOÎTES EN FER-BLANC · ARCHIVO DE LATAS'
                  : 'BOÎTES EN FER-BLANC · TIN ARCHIVE'}
              </span>
            </div>
            <span className="text-[11px] font-typewriter text-[var(--m-muted)] hidden sm:inline">
              ✦ Montmartre 1997 · Berlin 2026 ✦
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-amelie text-[var(--m-ink)] tracking-tight">
            {withCount(t.ui.tins_heading, dosen.length)}
          </h2>
          <p className="text-sm sm:text-base text-[var(--m-ink-2)] leading-relaxed font-sans">
            {t.ui.tins_subheading}
          </p>
        </div>
      </div>

      {/* Amélie 5 Rules Interactive Strip */}
      <AmelieRulesBanner
        lang={lang}
        onOpenManifest={onOpenManifest}
        onOpenEmails={onOpenEmails}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--m-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.ui.search_placeholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] text-[var(--m-ink)] text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--m-accent)]/20 focus:border-[var(--m-accent)] shadow-2xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-typewriter text-[var(--m-muted)] hover:text-[var(--m-ink)]"
            >
              {lang === 'de' ? 'Löschen' : lang === 'es' ? 'Borrar' : 'Clear'}
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Domain Dropdown */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] text-[#3d2f23] text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[var(--m-accent)]/20 shadow-2xs cursor-pointer"
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
            className="px-3.5 py-2.5 rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] text-[#3d2f23] text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[var(--m-accent)]/20 shadow-2xs cursor-pointer"
          >
            {verdictOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {getVerdictOptionLabel(opt)}
              </option>
            ))}
          </select>

          {/* Sort by reviewer vector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label={lang === 'de' ? 'Nach Vektor sortieren' : 'Sort by vector'}
            className="px-3.5 py-2.5 rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] text-[#3d2f23] text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[var(--m-accent)]/20 shadow-2xs cursor-pointer"
          >
            <option value="default">{lang === 'de' ? 'Sortierung: Standard' : 'Sort: default'}</option>
            <option value="total">{lang === 'de' ? 'Vektoren: Gesamt (/40)' : 'Vectors: total (/40)'}</option>
            <option value="core">{lang === 'de' ? 'Vektoren: Kern (/35)' : 'Vectors: core (/35)'}</option>
            {VECTOR_CATALOG.map((def) => (
              <option key={def.key} value={def.key}>
                {def.code} · {vectorLabel(def, lang)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Tag Active Filter Banner */}
      {selectedTag && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[var(--m-accent)]/10 border border-[var(--m-accent)]/25 text-[var(--m-accent)] text-xs font-typewriter font-semibold animate-fadeIn">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[var(--m-accent)]" />
            <span>
              {lang === 'de'
                ? `Gefiltert nach Tag: #${selectedTag} (${filteredDosen.length} ${filteredDosen.length === 1 ? 'Dose' : 'Dosen'})`
                : lang === 'es'
                ? `Filtrado por etiqueta: #${selectedTag} (${filteredDosen.length} ${filteredDosen.length === 1 ? 'lata' : 'latas'})`
                : `Filtered by tag: #${selectedTag} (${filteredDosen.length} ${filteredDosen.length === 1 ? 'tin' : 'tins'})`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSetSelectedTag(null)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--m-accent)] text-white hover:bg-[var(--m-accent-strong)] transition-colors shadow-2xs cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>{lang === 'de' ? 'Filter aufheben' : lang === 'es' ? 'Quitar filtro' : 'Clear Filter'}</span>
          </button>
        </div>
      )}

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
              <article
                key={dose.id}
                className="group relative rounded-2xl amelie-tin-box p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-[var(--m-line-strong)] hover:border-[var(--m-copper)]"
              >
                <div>
                  {/* Card Header Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs ${
                        isGift
                          ? 'bg-[var(--m-green)] text-[#f4fbf7] border border-[#143527]'
                          : isBuildFirst
                          ? 'bg-[var(--m-copper)] text-[var(--m-surface)] border border-[#a86c1f]'
                          : 'bg-[var(--m-accent)] text-[var(--m-on-accent)] border border-[var(--m-accent-strong)]'
                      }`}
                    >
                      {isGift && <Gift className="w-3 h-3 text-[var(--m-gold)]" />}
                      {isBuildFirst && <Hammer className="w-3 h-3 text-[#fef08a]" />}
                      {isKept && <Lock className="w-3 h-3 text-[#fbcfe8]" />}
                      <span className="tracking-wide">{getVerdictLabel(dose.verdict)}</span>
                    </span>

                    <div className="flex items-center gap-1.5 ml-auto">
                      {DOSE_SIMULATOR_MAP[dose.id] && (
                        <span
                          title={lang === 'de' ? 'Mit interaktivem Simulator' : lang === 'es' ? 'Con simulador interactivo' : 'Comes with an interactive simulator'}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-typewriter font-bold bg-[var(--m-copper)]/15 text-[#78350f] border border-[var(--m-copper)]/30"
                        >
                          <span aria-hidden="true">{DOSE_SIMULATOR_MAP[dose.id].icon}</span>
                          <span>{lang === 'de' ? 'Simulator' : lang === 'es' ? 'Simulador' : 'Simulator'}</span>
                        </span>
                      )}
                      {dose.aiFrontier && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-typewriter font-bold bg-[#264653]/15 text-[#1a3843] border border-[#264653]/30">
                          <Brain className="w-3 h-3 text-[#264653]" />
                          <span>AI-Native</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleCopyUrl(e, dose.id)}
                        className="p-1 rounded-md text-[var(--m-muted)] hover:text-[var(--m-accent)] hover:bg-[var(--m-accent)]/10 transition-colors"
                        title={copiedDoseId === dose.id ? (lang === 'de' ? 'URL kopiert!' : lang === 'es' ? '¡URL copiada!' : 'URL copied!') : (lang === 'de' ? 'Direkt-URL kopieren' : lang === 'es' ? 'Copiar URL directa' : 'Copy direct URL')}
                      >
                        {copiedDoseId === dose.id ? <Check className="w-3.5 h-3.5 text-[var(--m-green)]" /> : <Link2 className="w-3.5 h-3.5" />}
                      </button>

                      <span className="text-xs font-typewriter text-[var(--m-muted)]">
                        {dose.date}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold font-amelie text-[var(--m-ink)] group-hover:text-[var(--m-accent)] transition-colors tracking-tight flex items-center justify-between mt-1">
                    <Link to={getDoseUrl(dose.id)}>{getLocalizedTitle(dose, lang)}</Link>
                    <ArrowUpRight className="w-4 h-4 text-[var(--m-muted)] group-hover:text-[var(--m-accent)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>

                  {/* Simulator badge if available */}
                  {onOpenSimulator && SIMULATOR_BADGES[dose.id] && (
                    <div className="mt-2.5">
<Link to={getSimulatorUrl(SIMULATOR_BADGES[dose.id].simKey)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-typewriter font-bold transition-all border shadow-2xs cursor-pointer ${SIMULATOR_BADGES[dose.id].colorClasses}`}
                      >
                        <Sparkles className={`w-3 h-3 ${SIMULATOR_BADGES[dose.id].iconColor}`} />
                        <span>
                          {lang === 'de'
                            ? SIMULATOR_BADGES[dose.id].labelDe
                            : lang === 'es'
                            ? SIMULATOR_BADGES[dose.id].labelEs
                            : SIMULATOR_BADGES[dose.id].labelEn}
                        </span>
                      </Link>
                    </div>
                  )}

                  {/* One Liner */}
                  <p className="mt-2.5 text-xs sm:text-sm text-[var(--m-ink-2)] italic font-amelie line-clamp-3 leading-relaxed">
                    « {lang === 'de' ? dose.oneLinerDe : dose.oneLinerEn} »
                  </p>

                  {/* Recipient */}
                  <div className="mt-4 pt-3 border-t border-[var(--m-line)]">
                    <span className="text-[11px] font-typewriter text-[var(--m-muted)] uppercase tracking-wider block font-semibold">
                      {t.ui.recipient}
                    </span>
                    <p className="text-xs font-bold text-[var(--m-ink)] line-clamp-1 mt-0.5">
                      {lang === 'de' ? dose.recipientsDe : dose.recipientsEn}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <DoseVectorPanel doseId={dose.id} lang={lang} compact />
                </div>

                {/* Tags & Action */}
                <div className="mt-5 pt-3 border-t border-[var(--m-line)] flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {dose.tags.slice(0, 2).map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetSelectedTag(selectedTag === tag ? null : tag);
                        }}
                        className={`text-[11px] font-typewriter px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                          selectedTag === tag
                            ? 'bg-[var(--m-accent)] text-white border-[var(--m-accent-strong)] font-bold'
                            : 'bg-[#f5ede0] text-[var(--m-ink-2)] border-[var(--m-line)] hover:bg-[var(--m-accent)]/10 hover:text-[var(--m-accent)] font-medium'
                        }`}
                        title={lang === 'de' ? `Nach Tag #${tag} filtern` : lang === 'es' ? `Filtrar por #${tag}` : `Filter by #${tag}`}
                      >
                        #{tag}
                      </button>
                    ))}
                    {dose.tags.length > 2 && (
                      <span className="text-[11px] font-typewriter text-[var(--m-muted)] px-1 py-0.5">
                        +{dose.tags.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleCopyUrl(e, dose.id)}
                      className="p-1.5 rounded-md text-[11px] font-typewriter text-[#7c6655] hover:text-[var(--m-accent)] hover:bg-[var(--m-surface-2)] border border-transparent hover:border-[var(--m-line)] transition-colors flex items-center gap-1"
                      title={copiedDoseId === dose.id ? (lang === 'de' ? 'URL kopiert!' : lang === 'es' ? '¡URL copiada!' : 'URL copied!') : (lang === 'de' ? 'Dosen-URL kopieren' : lang === 'es' ? 'Copiar URL de la lata' : 'Copy Tin URL')}
                    >
                      {copiedDoseId === dose.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Link2 className="w-3.5 h-3.5 text-[var(--m-copper)]" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDose(dose);
                      }}
                      className="px-2 py-1 rounded-md text-[11px] font-typewriter text-[#7c6655] hover:text-[var(--m-accent)] hover:bg-[var(--m-surface-2)] border border-transparent hover:border-[var(--m-line)] transition-colors flex items-center gap-1"
                      title={lang === 'de' ? 'Schnellansicht im Popup' : lang === 'es' ? 'Vista rápida' : 'Quick popup view'}
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span className="hidden sm:inline">Popup</span>
                    </button>

<Link to={getDoseUrl(dose.id)}
                      className="text-xs font-bold font-amelie text-[var(--m-accent)] hover:underline flex items-center gap-0.5 px-2 py-1 rounded-md hover:bg-[var(--m-accent)]/5"
                      title={lang === 'de' ? 'Als Einzelseite öffnen' : lang === 'es' ? 'Abrir como página' : 'Open as Single Page'}
                    >
                      <span>{lang === 'de' ? 'Einzelseite' : t.ui.open_tin}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
