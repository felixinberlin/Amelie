import React, { useState, useMemo } from 'react';
import { Search, Filter, Gift, Hammer, Lock, ArrowUpRight, Sparkles, Brain, Link2, Check, ExternalLink, Maximize2 } from 'lucide-react';
import { DoseItem, Language, Verdict, DomainCategory } from '../types';
import { getTranslation, getLocalizedTitle } from '../i18n';
import { getDoseUrl } from '../utils/doseUrl';
import { SimulatorKey } from '../data/doseSimulators';
import { AmelieRulesBanner } from './AmelieRulesBanner';

interface DosenGalleryProps {
  dosen: DoseItem[];
  lang: Language;
  onSelectDose: (dose: DoseItem) => void;
  onOpenSinglePage?: (dose: DoseItem) => void;
  onOpenSimulator?: (simId: SimulatorKey) => void;
  onOpenManifest?: () => void;
  onOpenEmails?: () => void;
}

export const DosenGallery: React.FC<DosenGalleryProps> = ({
  dosen,
  lang,
  onSelectDose,
  onOpenSinglePage,
  onOpenSimulator,
  onOpenManifest,
  onOpenEmails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerdict, setSelectedVerdict] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [copiedDoseId, setCopiedDoseId] = useState<string | null>(null);
  const t = getTranslation(lang);

  const handleCopyUrl = (e: React.MouseEvent, doseId: string) => {
    e.stopPropagation();
    const url = getDoseUrl(doseId);
    navigator.clipboard.writeText(url);
    setCopiedDoseId(doseId);
    setTimeout(() => setCopiedDoseId(null), 2000);
  };

  const filteredDosen = useMemo(() => {
    return dosen.filter((d) => {
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

      return matchesSearch && matchesVerdict && matchesDomain;
    });
  }, [dosen, searchQuery, selectedVerdict, selectedDomain, lang]);

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
      <div className="relative rounded-2xl bg-gradient-to-br from-[#faf4e8] via-[#f5ece0] to-[#eee2cf] border border-[#d8cbba] p-6 md:p-8 shadow-xs overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute right-4 top-2 select-none pointer-events-none opacity-10 hidden sm:block">
          <div className="font-amelie text-8xl font-bold text-[#8c1d40]">1974</div>
        </div>

        <div className="relative max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8c1d40]/10 border border-[#8c1d40]/25 text-[#8c1d40] text-xs font-typewriter font-bold">
              <Gift className="w-3.5 h-3.5 text-[#8c1d40]" />
              <span>
                {lang === 'de'
                  ? 'BOÎTES EN FER-BLANC · DOSEN-ARCHIV'
                  : lang === 'es'
                  ? 'BOÎTES EN FER-BLANC · ARCHIVO DE LATAS'
                  : 'BOÎTES EN FER-BLANC · TIN ARCHIVE'}
              </span>
            </div>
            <span className="text-[11px] font-typewriter text-[#8b6f57] hidden sm:inline">
              ✦ Montmartre 1997 · Berlin 2026 ✦
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-amelie text-[#2b1e16] tracking-tight">
            {t.ui.tins_heading}
          </h2>
          <p className="text-sm sm:text-base text-[#5c4a3d] leading-relaxed font-sans">
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
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b6f57]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.ui.search_placeholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d8cbba] bg-[#fdfbf7] text-[#2b1e16] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#8c1d40]/20 focus:border-[#8c1d40] shadow-2xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-typewriter text-[#8b6f57] hover:text-[#2b1e16]"
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
            className="px-3.5 py-2.5 rounded-xl border border-[#d8cbba] bg-[#fdfbf7] text-[#3d2f23] text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#8c1d40]/20 shadow-2xs cursor-pointer"
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
            className="px-3.5 py-2.5 rounded-xl border border-[#d8cbba] bg-[#fdfbf7] text-[#3d2f23] text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#8c1d40]/20 shadow-2xs cursor-pointer"
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
                onClick={() => (onOpenSinglePage ? onOpenSinglePage(dose) : onSelectDose(dose))}
                className="group relative rounded-2xl amelie-tin-box p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-[#d8cbba] hover:border-[#c5832b]"
              >
                <div>
                  {/* Card Header Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs ${
                        isGift
                          ? 'bg-[#1b4332] text-[#f4fbf7] border border-[#143527]'
                          : isBuildFirst
                          ? 'bg-[#c5832b] text-[#fffdfa] border border-[#a86c1f]'
                          : 'bg-[#8c1d40] text-[#fff9f5] border border-[#721432]'
                      }`}
                    >
                      {isGift && <Gift className="w-3 h-3 text-[#f6bd60]" />}
                      {isBuildFirst && <Hammer className="w-3 h-3 text-[#fef08a]" />}
                      {isKept && <Lock className="w-3 h-3 text-[#fbcfe8]" />}
                      <span className="tracking-wide">{getVerdictLabel(dose.verdict)}</span>
                    </span>

                    <div className="flex items-center gap-1.5 ml-auto">
                      {dose.aiFrontier && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-typewriter font-bold bg-[#264653]/15 text-[#1a3843] border border-[#264653]/30">
                          <Brain className="w-3 h-3 text-[#264653]" />
                          <span>AI-Native</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleCopyUrl(e, dose.id)}
                        className="p-1 rounded-md text-[#8b6f57] hover:text-[#8c1d40] hover:bg-[#8c1d40]/10 transition-colors"
                        title={copiedDoseId === dose.id ? (lang === 'de' ? 'URL kopiert!' : 'URL copied!') : (lang === 'de' ? 'Direkt-URL kopieren' : 'Copy direct URL')}
                      >
                        {copiedDoseId === dose.id ? <Check className="w-3.5 h-3.5 text-[#1b4332]" /> : <Link2 className="w-3.5 h-3.5" />}
                      </button>

                      <span className="text-xs font-typewriter text-[#8b6f57]">
                        {dose.date}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold font-amelie text-[#2b1e16] group-hover:text-[#8c1d40] transition-colors tracking-tight flex items-center justify-between mt-1">
                    <span>{getLocalizedTitle(dose, lang)}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#8b6f57] group-hover:text-[#8c1d40] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>

                  {/* Simulator badge if available */}
                  {dose.id === 'altbau-thermal' && onOpenSimulator && (
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSimulator('altbau');
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#c5832b]/15 hover:bg-[#c5832b]/25 text-[#78350f] text-xs font-typewriter font-bold transition-all border border-[#c5832b]/30 shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3 text-[#c5832b]" />
                        <span>
                          {lang === 'de'
                            ? '🏢 Live-Wärmebilanz Simulator'
                            : lang === 'es'
                            ? '🏢 Simulador de Pérdida Térmica'
                            : '🏢 Live Heat Loss Simulator'}
                        </span>
                      </button>
                    </div>
                  )}
                  {dose.id === 'wet-ink-capillary' && onOpenSimulator && (
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSimulator('wetink');
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#c5832b]/15 hover:bg-[#c5832b]/25 text-[#78350f] text-xs font-typewriter font-bold transition-all border border-[#c5832b]/30 shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3 text-[#c5832b]" />
                        <span>
                          {lang === 'de'
                            ? '🖋️ Live-Tinte Simulator'
                            : lang === 'es'
                            ? '🖋️ Simulador de Tinta Líquida'
                            : '🖋️ Live Wet Ink Simulator'}
                        </span>
                      </button>
                    </div>
                  )}
                  {dose.id === 'klarlokal' && onOpenSimulator && (
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSimulator('klarlokal');
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1b4332]/15 hover:bg-[#1b4332]/25 text-[#1b4332] text-xs font-typewriter font-bold transition-all border border-[#1b4332]/30 shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3 text-[#1b4332]" />
                        <span>
                          {lang === 'de'
                            ? '🛡️ Live-Brecheisen Simulator'
                            : lang === 'es'
                            ? '🛡️ Simulador KlarLokal'
                            : '🛡️ Live Battering Ram'}
                        </span>
                      </button>
                    </div>
                  )}
                  {dose.id === 'crack-flora-watcher' && onOpenSimulator && (
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSimulator('crackflora');
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#2d5a27]/15 hover:bg-[#2d5a27]/25 text-[#1b4332] text-xs font-typewriter font-bold transition-all border border-[#2d5a27]/30 shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3 text-[#2d5a27]" />
                        <span>
                          {lang === 'de'
                            ? '🌱 Live-Ritzengrün Simulator'
                            : lang === 'es'
                            ? '🌱 Laboratorio de Grietas'
                            : '🌱 Live Pavement Lab'}
                        </span>
                      </button>
                    </div>
                  )}
                  {dose.id === 'kiez-laermkarte' && onOpenSimulator && (
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSimulator('laerm');
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#8c1d40]/15 hover:bg-[#8c1d40]/25 text-[#8c1d40] text-xs font-typewriter font-bold transition-all border border-[#8c1d40]/30 shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3 text-[#8c1d40]" />
                        <span>
                          {lang === 'de'
                            ? '🎧 24h Zeitstruktur & Ruhe-Fenster'
                            : lang === 'es'
                            ? '🎧 Simulador de Ruido 24h'
                            : '🎧 24h Noise & Quiet Windows'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* One Liner */}
                  <p className="mt-2.5 text-xs sm:text-sm text-[#4a3b2c] italic font-amelie line-clamp-3 leading-relaxed">
                    « {lang === 'de' ? dose.oneLinerDe : dose.oneLinerEn} »
                  </p>

                  {/* Recipient */}
                  <div className="mt-4 pt-3 border-t border-[#dfd1be]">
                    <span className="text-[11px] font-typewriter text-[#8b6f57] uppercase tracking-wider block font-semibold">
                      {t.ui.recipient}
                    </span>
                    <p className="text-xs font-bold text-[#2b1e16] line-clamp-1 mt-0.5">
                      {lang === 'de' ? dose.recipientsDe : dose.recipientsEn}
                    </p>
                  </div>
                </div>

                {/* Tags & Action */}
                <div className="mt-5 pt-3 border-t border-[#dfd1be] flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {dose.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-typewriter px-2 py-0.5 rounded bg-[#f5ede0] text-[#5c4a3d] border border-[#e2d5c3] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {dose.tags.length > 2 && (
                      <span className="text-[11px] font-typewriter text-[#8b6f57] px-1 py-0.5">
                        +{dose.tags.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleCopyUrl(e, dose.id)}
                      className="p-1.5 rounded-md text-[11px] font-typewriter text-[#7c6655] hover:text-[#8c1d40] hover:bg-[#faf5eb] border border-transparent hover:border-[#dfd1be] transition-colors flex items-center gap-1"
                      title={copiedDoseId === dose.id ? (lang === 'de' ? 'URL kopiert!' : 'URL copied!') : (lang === 'de' ? 'Dosen-URL kopieren' : 'Copy Tin URL')}
                    >
                      {copiedDoseId === dose.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Link2 className="w-3.5 h-3.5 text-[#c5832b]" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDose(dose);
                      }}
                      className="px-2 py-1 rounded-md text-[11px] font-typewriter text-[#7c6655] hover:text-[#8c1d40] hover:bg-[#faf5eb] border border-transparent hover:border-[#dfd1be] transition-colors flex items-center gap-1"
                      title={lang === 'de' ? 'Schnellansicht im Popup' : 'Quick popup view'}
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span className="hidden sm:inline">Popup</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenSinglePage) {
                          onOpenSinglePage(dose);
                        } else {
                          onSelectDose(dose);
                        }
                      }}
                      className="text-xs font-bold font-amelie text-[#8c1d40] hover:underline flex items-center gap-0.5 px-2 py-1 rounded-md hover:bg-[#8c1d40]/5"
                      title={lang === 'de' ? 'Als Einzelseite öffnen' : 'Open as Single Page'}
                    >
                      <span>{lang === 'de' ? 'Einzelseite' : t.ui.open_tin}</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
