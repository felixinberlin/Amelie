import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Compass, 
  BookOpen, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  Filter, 
  Copy, 
  Check, 
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  Globe,
  Sliders,
  ChevronDown,
  ChevronUp,
  Tag,
  Share2,
  Layers
} from 'lucide-react';
import { Language, CandidateIdea } from '../types';
import {
  PlaybookThemeId,
  PLAYBOOK_THEMES,
  SATURATION_ATLAS_DATA,
  SaturationStatus,
  SaturationAtlasEntry,
  SEARCH_THEME_PRESETS,
  SearchThemePreset,
  PLAYBOOK_RECIPES,
  PlaybookRecipe,
  ANCHOR_FRAMES,
  COLLIDER_FRAMES,
  AnchorFrame,
  ColliderFrame
} from '../data/playbook';

interface SearchPlaybookStudioProps {
  lang: Language;
  onSendToPipeline?: (candidate: Partial<CandidateIdea>) => void;
  onNavigateToDose?: (doseId: string) => void;
}

export const SearchPlaybookStudio: React.FC<SearchPlaybookStudioProps> = ({
  lang,
  onSendToPipeline,
  onNavigateToDose,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'atlas' | 'search_gen' | 'recipes' | 'bisociation'>('atlas');
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);

  // Saturation Atlas Filter State
  const [selectedTheme, setSelectedTheme] = useState<PlaybookThemeId>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedAtlasId, setExpandedAtlasId] = useState<string | null>(null);

  // Search Query Generator State
  const [selectedPresetId, setSelectedPresetId] = useState<string>(SEARCH_THEME_PRESETS[0].id);
  const [topicInput, setTopicInput] = useState<string>(SEARCH_THEME_PRESETS[0].topicInput);
  const [recipientInput, setRecipientInput] = useState<string>(SEARCH_THEME_PRESETS[0].recipientInput);

  // Bisociation Studio State
  const [bisocAnchorTheme, setBisocAnchorTheme] = useState<PlaybookThemeId>('all');
  const [bisocColliderTheme, setBisocColliderTheme] = useState<PlaybookThemeId>('all');
  const [selectedAnchorId, setSelectedAnchorId] = useState<string>(ANCHOR_FRAMES[0].id);
  const [selectedColliderId, setSelectedColliderId] = useState<string>(COLLIDER_FRAMES[0].id);

  // Handle Preset selection
  const handleSelectPreset = (preset: SearchThemePreset) => {
    setSelectedPresetId(preset.id);
    setTopicInput(preset.topicInput);
    setRecipientInput(preset.recipientInput);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(id);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  // Filtered Saturation Atlas Rows
  const filteredAtlasRows = useMemo(() => {
    return SATURATION_ATLAS_DATA.filter((row) => {
      if (selectedTheme !== 'all' && row.theme !== selectedTheme) {
        return false;
      }
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'dicht' && !row.status.startsWith('dicht')) {
          return false;
        } else if (selectedStatus !== 'dicht' && row.status !== selectedStatus) {
          return false;
        }
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchDe = row.fieldDe.toLowerCase().includes(q) || row.evidenceDe.toLowerCase().includes(q) || (row.lessonDe?.toLowerCase().includes(q) ?? false);
        const matchEn = row.fieldEn.toLowerCase().includes(q) || row.evidenceEn.toLowerCase().includes(q) || (row.lessonEn?.toLowerCase().includes(q) ?? false);
        return matchDe || matchEn;
      }
      return true;
    });
  }, [selectedTheme, selectedStatus, searchQuery]);

  // Atlas Statistics
  const atlasStats = useMemo(() => {
    const total = SATURATION_ATLAS_DATA.length;
    const frei = SATURATION_ATLAS_DATA.filter(r => r.status === 'frei').length;
    const verengt = SATURATION_ATLAS_DATA.filter(r => r.status === 'verengt').length;
    const beimEmpfaenger = SATURATION_ATLAS_DATA.filter(r => r.status === 'beim_empfaenger').length;
    const dicht = SATURATION_ATLAS_DATA.filter(r => r.status.startsWith('dicht') || r.status === 'wird_besetzt').length;
    return { total, frei, verengt, beimEmpfaenger, dicht };
  }, []);

  // Filtered Anchors & Colliders
  const filteredAnchors = useMemo(() => {
    if (bisocAnchorTheme === 'all') return ANCHOR_FRAMES;
    return ANCHOR_FRAMES.filter(a => a.theme === bisocAnchorTheme);
  }, [bisocAnchorTheme]);

  const filteredColliders = useMemo(() => {
    if (bisocColliderTheme === 'all') return COLLIDER_FRAMES;
    return COLLIDER_FRAMES.filter(c => c.theme === bisocColliderTheme);
  }, [bisocColliderTheme]);

  const currentAnchor = useMemo(() => {
    return ANCHOR_FRAMES.find(a => a.id === selectedAnchorId) || ANCHOR_FRAMES[0];
  }, [selectedAnchorId]);

  const currentCollider = useMemo(() => {
    return COLLIDER_FRAMES.find(c => c.id === selectedColliderId) || COLLIDER_FRAMES[0];
  }, [selectedColliderId]);

  const currentPreset = useMemo(() => {
    return SEARCH_THEME_PRESETS.find(p => p.id === selectedPresetId);
  }, [selectedPresetId]);

  const getStatusBadge = (status: SaturationStatus) => {
    switch (status) {
      case 'frei':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono-code font-bold text-xs border border-emerald-300">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            {lang === 'de' ? 'FREI (Lücke offen)' : lang === 'es' ? 'LIBRE (Brecha abierta)' : 'OPEN GAP'}
          </span>
        );
      case 'verengt':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-mono-code font-bold text-xs border border-blue-300">
            <Sliders className="w-3 h-3 text-blue-700" />
            {lang === 'de' ? 'VERENGT (Strukturelle Lücke)' : lang === 'es' ? 'ESTRECHADA' : 'NARROWED GAP'}
          </span>
        );
      case 'beim_empfaenger':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono-code font-bold text-xs border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            {lang === 'de' ? 'BEIM EMPFÄNGER' : lang === 'es' ? 'EN EL DESTINATARIO' : 'AT RECIPIENT'}
          </span>
        );
      case 'wird_besetzt':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 font-mono-code font-bold text-xs border border-orange-300">
            <ShieldAlert className="w-3 h-3 text-orange-700" />
            {lang === 'de' ? 'WIRD BESETZT' : lang === 'es' ? 'OCUPÁNDOSE AHORA' : 'OCCUPYING NOW'}
          </span>
        );
      case 'dicht_forschung':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-mono-code text-xs border border-purple-300">
            <BookOpen className="w-3 h-3 text-purple-600" />
            {lang === 'de' ? 'DICHT (Forschung)' : lang === 'es' ? 'SATURADO (Investigación)' : 'SATURATED (Research)'}
          </span>
        );
      case 'dicht_kommerziell':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 font-mono-code text-xs border border-stone-300">
            <DollarSign className="w-3 h-3 text-stone-600" />
            {lang === 'de' ? 'DICHT (Kommerziell/SEO)' : lang === 'es' ? 'SATURADO (Comercial)' : 'SATURATED (Commercial)'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono-code text-xs border border-stone-300">
            <ShieldAlert className="w-3 h-3 text-stone-500" />
            {lang === 'de' ? 'DICHT (Besetzt)' : lang === 'es' ? 'SATURADO' : 'SATURATED'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-amber-50/90 via-white to-stone-50 border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-mono-code mb-3 border border-amber-200/80">
              <Compass className="w-3.5 h-3.5 text-amber-800" />
              <span>
                {lang === 'de' 
                  ? 'Schritt 0,5: Such-Playbook & Besetzungsatlas' 
                  : lang === 'es' 
                  ? 'Paso 0.5: Playbook de búsqueda y atlas de saturación' 
                  : 'Step 0.5: Search Playbook & Saturation Atlas'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-stone-900 tracking-tight">
              {lang === 'de' 
                ? 'Vor dem Schreiben suchen. Die teuerste Lektion.' 
                : lang === 'es' 
                ? 'Buscar antes de escribir. La lección más valiosa.' 
                : 'Search before writing. The most valuable lesson.'}
            </h2>
            <p className="text-sm text-stone-600 mt-1.5 max-w-3xl leading-relaxed">
              {lang === 'de'
                ? 'Über 200 geprüfte Ideen, 81 beerdigte Gräber und 45 fertige Dosen: Eine strukturierte Vorrecherche spart Tage verbrannter Arbeit und schützt vor peinlichen Erstansprachen.'
                : lang === 'es'
                ? 'Más de 200 ideas evaluadas, 81 tumbas registradas y 45 latas producidas: La verificación previa ahorra días de trabajo y evita contactos redundantes.'
                : 'Over 200 audited ideas, 81 graveyard autopsies and 45 packed Doses: Structured prior art validation prevents weeks of wasted engineering and burned partner contacts.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-xl border border-stone-200/80 self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab('atlas')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'atlas' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🗺️ {lang === 'de' ? 'Besetzungsatlas' : lang === 'es' ? 'Atlas de saturación' : 'Saturation Atlas'}
            </button>
            <button
              onClick={() => setActiveSubTab('search_gen')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'search_gen' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🔍 {lang === 'de' ? '4-Schritte-Suchgenerator' : lang === 'es' ? 'Generador de 4 pasos' : '4-Step Search Generator'}
            </button>
            <button
              onClick={() => setActiveSubTab('recipes')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'recipes' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📜 {lang === 'de' ? 'Such-Rezepte' : lang === 'es' ? 'Recetas de búsqueda' : 'Search Recipes'}
            </button>
            <button
              onClick={() => setActiveSubTab('bisociation')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeSubTab === 'bisociation' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ⚡ {lang === 'de' ? 'Bisoziations-Studio' : lang === 'es' ? 'Estudio de bisociación' : 'Bisociation Studio'}
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SUBTAB 1: BESETZUNGSATLAS */}
      {/* ------------------------------------------------------------------ */}
      {activeSubTab === 'atlas' && (
        <div className="space-y-6">
          {/* Stats Bar & Golden Rule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs flex flex-col justify-between gap-2">
              <div>
                <span className="font-bold text-amber-900 text-sm block">
                  {lang === 'de' ? 'Die Amélie-Faustregel:' : lang === 'es' ? 'La regla de oro de Amélie:' : 'The Golden Rule of Amélie:'}
                </span>
                <span className="text-amber-900/90 text-xs leading-relaxed">
                  {lang === 'de'
                    ? '„Wenn Endnutzer dafür zahlen würden oder eine Stadt es als Pressemitteilung verkaufen kann, existiert es bereits. Frei ist, was ein Fachgremium als PDF veröffentlicht und niemand je in Software gegossen hat."'
                    : lang === 'es'
                    ? '«Si los usuarios pagarían por ello o una ciudad puede anunciarlo en prensa, ya existe. Libre es lo que un comité publica como PDF y nadie ha convertido en software».'
                    : '"If consumers would pay for it or a city can pitch it in a press release, it already exists. What is truly open is what expert committees publish as a PDF rubric and nobody turned into software."'}
                </span>
              </div>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-amber-800/80">
                <span>📚 45 Dosen im Bestand</span>
                <span>•</span>
                <span>🪦 81 Gräber obduziert</span>
                <span>•</span>
                <span>Stand: September 2026</span>
              </div>
            </div>

            {/* Quick Summary Counts */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-mono-code font-bold uppercase text-stone-500">
                {lang === 'de' ? 'Atlas-Verteilung' : lang === 'es' ? 'Distribución del atlas' : 'Atlas Distribution'}
              </span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="text-xs text-emerald-800 font-medium">{lang === 'de' ? 'Freie Lücken' : 'Open Gaps'}</div>
                  <div className="text-lg font-bold font-mono-code text-emerald-950">{atlasStats.frei}</div>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-xs text-blue-800 font-medium">{lang === 'de' ? 'Verengt' : 'Narrowed'}</div>
                  <div className="text-lg font-bold font-mono-code text-blue-950">{atlasStats.verengt}</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="text-xs text-amber-800 font-medium">{lang === 'de' ? 'Beim Empf.' : 'At Recipient'}</div>
                  <div className="text-lg font-bold font-mono-code text-amber-950">{atlasStats.beimEmpfaenger}</div>
                </div>
                <div className="p-2 rounded-lg bg-stone-100 border border-stone-300">
                  <div className="text-xs text-stone-700 font-medium">{lang === 'de' ? 'Dicht/Besetzt' : 'Saturated'}</div>
                  <div className="text-lg font-bold font-mono-code text-stone-900">{atlasStats.dicht}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Filters & Search */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600">
                {lang === 'de' ? 'Themenbereiche & Sektoren:' : lang === 'es' ? 'Sectores temáticos:' : 'Thematic Sectors:'}
              </span>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'de' ? 'Atlas durchsuchen...' : lang === 'es' ? 'Buscar en atlas...' : 'Search atlas...'}
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-800 w-44 sm:w-60"
                  />
                </div>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs bg-white text-stone-700 focus:outline-hidden focus:ring-2 focus:ring-amber-800"
                >
                  <option value="all">{lang === 'de' ? 'Alle Status' : 'All Statuses'}</option>
                  <option value="frei">{lang === 'de' ? 'Nur Frei (Lücke)' : 'Only Free Gaps'}</option>
                  <option value="verengt">{lang === 'de' ? 'Nur Verengt' : 'Only Narrowed'}</option>
                  <option value="beim_empfaenger">{lang === 'de' ? 'Beim Empfänger' : 'At Recipient'}</option>
                  <option value="dicht">{lang === 'de' ? 'Dicht / Besetzt' : 'Saturated'}</option>
                </select>
              </div>
            </div>

            {/* Theme Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PLAYBOOK_THEMES.map((th) => {
                const count = th.id === 'all' 
                  ? SATURATION_ATLAS_DATA.length 
                  : SATURATION_ATLAS_DATA.filter(r => r.theme === th.id).length;
                return (
                  <button
                    key={th.id}
                    onClick={() => setSelectedTheme(th.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedTheme === th.id
                        ? 'bg-amber-800 text-white font-bold shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
                    }`}
                  >
                    <span>{th.icon}</span>
                    <span>{th.label[lang] ?? th.label.en}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedTheme === th.id ? 'bg-amber-900/60 text-amber-100' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Atlas Table & Accordions */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-mono-code">
              <span>{filteredAtlasRows.length} {lang === 'de' ? 'Einträge gefunden' : 'domains found'}</span>
              <span>{lang === 'de' ? 'Klicken für Vertiefung & Lektionen' : 'Click row for details & lessons'}</span>
            </div>

            <div className="divide-y divide-stone-200/80">
              {filteredAtlasRows.map((row) => {
                const isExpanded = expandedAtlasId === row.id;
                return (
                  <div key={row.id} className="transition-colors hover:bg-amber-50/30">
                    <div 
                      onClick={() => setExpandedAtlasId(isExpanded ? null : row.id)}
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-900 text-sm">
                            {lang === 'de' ? row.fieldDe : row.fieldEn}
                          </span>
                          {row.linkedDoseId && (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono-code font-bold">
                              Dose: {row.linkedDoseId}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                          {lang === 'de' ? row.evidenceDe : row.evidenceEn}
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                        {getStatusBadge(row.status)}
                        <div className="text-stone-400 hover:text-stone-700 p-1">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 bg-amber-50/40 border-t border-amber-100 text-xs space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                            <span className="font-bold font-mono-code text-stone-700 text-[11px] uppercase block">
                              🔬 {lang === 'de' ? 'Recherche-Belege & Ground Truth:' : 'Research Evidence & Ground Truth:'}
                            </span>
                            <p className="text-stone-700 leading-relaxed">
                              {lang === 'de' ? row.evidenceDe : row.evidenceEn}
                            </p>
                          </div>

                          {row.lessonDe && (
                            <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                              <span className="font-bold font-mono-code text-amber-900 text-[11px] uppercase block">
                                💡 {lang === 'de' ? 'Playbook-Erkenntnis:' : 'Playbook Lesson Learned:'}
                              </span>
                              <p className="text-stone-700 leading-relaxed">
                                {lang === 'de' ? row.lessonDe : row.lessonEn}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono-code">
                            {row.round && <span>📌 Entdeckt / Auditiert: {row.round}</span>}
                          </div>

                          {row.linkedDoseId && onNavigateToDose && (
                            <button
                              onClick={() => onNavigateToDose(row.linkedDoseId!)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                            >
                              <span>{lang === 'de' ? 'Zur fertigen Dose springen' : 'View packed Dose'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SUBTAB 2: 4-STEP SEARCH GENERATOR */}
      {/* ------------------------------------------------------------------ */}
      {activeSubTab === 'search_gen' && (
        <div className="space-y-6">
          {/* Preset Theme Quick Selector */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif-title font-bold text-stone-900 text-lg">
                  {lang === 'de' ? 'Themen-Presets aus den echten Recherche-Runden' : 'Thematic Presets from Real Search Rounds'}
                </h3>
                <p className="text-xs text-stone-600">
                  {lang === 'de'
                    ? 'Klicken Sie auf ein Thema, um sofort reale Suchanfragen nach der 4-Schritte-Sequenz zu generieren:'
                    : 'Select a theme to instantly populate the 4-step search sequence with authentic data:'}
                </p>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
              {SEARCH_THEME_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-800 bg-amber-50/90 font-bold text-stone-950 shadow-xs ring-1 ring-amber-800'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-amber-900 truncate">
                      {lang === 'de' ? preset.titleDe : preset.titleEn}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-tight">
                      {lang === 'de' ? preset.descriptionDe : preset.descriptionEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Input Form */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-title font-bold text-stone-900 text-lg">
                {lang === 'de' ? '4-Schritte-Prüfsequenz für neue Ideen' : lang === 'es' ? 'Secuencia de verificación de 4 pasos' : 'The 4-Step Verification Sequence'}
              </h3>
              <span className="text-xs font-mono-code bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md font-bold">
                Max. 4 Suchen pro Idee
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === 'de'
                ? 'Geben Sie das Thema und den anvisierten Empfänger ein oder passen Sie das Preset an. Amélie erzeugt die methodischen Suchanfragen nach dem Playbook.'
                : 'Enter your idea topic and intended recipient. Amélie generates the exact methodical search queries following the battle-tested playbook.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1">
                  {lang === 'de' ? 'Thema / Funktion:' : lang === 'es' ? 'Tema / Acción principal:' : 'Topic / Core Action:'}
                </label>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder={lang === 'de' ? 'z.B. Wildbienen Nisthilfen, Vogelschutz Glas' : 'e.g. Wild bee nesting aids, bird glass collision'}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1">
                  {lang === 'de' ? 'Anvisierter Empfänger / Organisation:' : lang === 'es' ? 'Destinatario objetivo / Organización:' : 'Target Recipient / Mandate:'}
                </label>
                <input
                  type="text"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  placeholder="z.B. Thünen Institut, CompGen, CityLAB"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-800"
                />
              </div>
            </div>
          </div>

          {/* Generated 4 Queries + Foreign Counterpart + Funding Inversion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 0: Graveyard Reminder */}
            <div className="p-4 rounded-xl bg-stone-900 text-white border border-stone-800 shadow-xs space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono-code text-amber-400 bg-stone-800 px-2.5 py-1 rounded border border-stone-700">
                  Schritt 0: Friedhof-Check (0 Suchen)
                </span>
                <span className="text-[11px] text-stone-400">81 beerdigte Ideen im Archiv</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {lang === 'de'
                  ? 'Vor jeder Websuche: Liegt die Idee oder ihr Struktur-Muster bereits im Friedhof? Wenn ja, ist sie tot, bis ihre dokumentierte Auferstehungsbedingung eintritt.'
                  : 'Before running web searches: Is the concept or its structural pattern already in the Graveyard? If yes, it remains dead until its resurrection trigger occurs.'}
              </p>
            </div>

            {/* The 4 Standard Search Steps */}
            {[
              {
                step: 1,
                title: lang === 'de' ? '1. <Empfänger> KI / Prototyp' : '1. <Recipient> AI / Prototype',
                sub: lang === 'de' ? 'Billigster Kill: Hat der Empfänger das schon selbst?' : 'Cheapest kill: Does recipient already have it?',
                rawQuery: `${recipientInput} KI AI Prototyp ${topicInput}`,
                purposeDe: 'Verhindert die peinlichste Erstansprache, wenn die Organisation bereits ein eigenes Projekt betreibt.',
                purposeEn: 'Prevents embarrassing outreach if the organization is already running an internal project.',
              },
              {
                step: 2,
                title: lang === 'de' ? '2. Deutsch, Funktionswörter' : '2. German Function & Schema Words',
                sub: lang === 'de' ? 'Was das Ding tut (Leitfaden, Bewertungsverfahren)' : 'What it does (manual guidelines, scoring rubric)',
                rawQuery: `${topicInput} Bewertungsverfahren Punktesystem Leitfaden`,
                purposeDe: 'Findet offizielle Faltblätter, DIN-Normen und Bewertungsbögen ohne digitale Software.',
                purposeEn: 'Finds official PDF pamphlets, DIN standards and evaluation sheets lacking software.',
              },
              {
                step: 3,
                title: lang === 'de' ? '3. Englisch, Produktwörter' : '3. English Product Terms & US Market',
                sub: lang === 'de' ? 'Findet internationale & kommerzielle Konkurrenz' : 'Catches international commercial products',
                rawQuery: `${topicInput} app AI tool software 2026`,
                purposeDe: 'USA bauen Konsumideen 12–24 Monate früher. Findet VC-Produkte und SEO-Apps.',
                purposeEn: 'US markets build consumer apps 12–24 months earlier. Catches VC products & SEO tools.',
              },
              {
                step: 4,
                title: lang === 'de' ? '4. Forum & Nischen-Community' : '4. Forum & Niche Communities',
                sub: lang === 'de' ? 'Findet Indie-Apps unter dem SEO-Radar' : 'Catches unindexed indie apps on forums/GitHub',
                rawQuery: `${topicInput} github discourse forum`,
                purposeDe: 'Findet quelloffene Indie-Projekte auf GitHub, Akkudoktor oder Restarters-Foren.',
                purposeEn: 'Uncovers open-source indie tools on GitHub, Discourse or specialized repair forums.',
              },
            ].map((q) => (
              <div key={q.step} className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono-code text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {lang === 'de' ? 'Schritt' : 'Step'} {q.step}
                    </span>
                    <span className="text-[11px] text-stone-500">{q.sub}</span>
                  </div>
                  <h4 className="font-serif-title font-bold text-stone-900 text-sm">{q.title}</h4>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    {lang === 'de' ? q.purposeDe : q.purposeEn}
                  </p>
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 font-mono-code text-xs text-stone-800 break-all select-all">
                    {q.rawQuery}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <button
                    onClick={() => copyText(q.rawQuery, `query-${q.step}`)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    {copiedQuery === `query-${q.step}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedQuery === `query-${q.step}` ? (lang === 'de' ? 'Kopiert!' : 'Copied!') : (lang === 'de' ? 'Kopieren' : 'Copy')}</span>
                  </button>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(q.rawQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs"
                  >
                    <span>{lang === 'de' ? 'In Google suchen' : 'Search on Google'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}

            {/* Bonus Steps: Foreign Counterpart & Funding */}
            {currentPreset && (
              <>
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono-code text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                        {lang === 'de' ? 'Rezept 2: Auslandsgegenprobe' : 'Recipe 2: Foreign Counterpart'}
                      </span>
                      <span className="text-[11px] text-blue-700">LEED, EPA, NYC Local Law</span>
                    </div>
                    <h4 className="font-serif-title font-bold text-stone-900 text-sm">
                      {lang === 'de' ? 'Internationale Regulierung & Rechenblätter' : 'International Precedents & Spreadsheets'}
                    </h4>
                    <div className="p-2.5 rounded-lg bg-white border border-blue-200 font-mono-code text-xs text-stone-800 break-all select-all">
                      {currentPreset.foreignRegulationKeyword}
                    </div>
                  </div>
                  <div className="flex items-center justify-end pt-2">
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(currentPreset.foreignRegulationKeyword)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold shadow-xs"
                    >
                      <span>Google Suche</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono-code text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                        {lang === 'de' ? 'Rezept 5: Fördercall-Inversion' : 'Recipe 5: Grant Call Inversion'}
                      </span>
                      <span className="text-[11px] text-emerald-700">DBU, Prototype Fund, mFUND</span>
                    </div>
                    <h4 className="font-serif-title font-bold text-stone-900 text-sm">
                      {lang === 'de' ? 'Geldspur & Förderrichtlinien-Suche' : 'Funding Guidelines & Grant Calls'}
                    </h4>
                    <div className="p-2.5 rounded-lg bg-white border border-emerald-200 font-mono-code text-xs text-stone-800 break-all select-all">
                      {currentPreset.fundingKeyword}
                    </div>
                  </div>
                  <div className="flex items-center justify-end pt-2">
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(currentPreset.fundingKeyword)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs"
                    >
                      <span>Google Suche</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SUBTAB 3: SEARCH RECIPES & HEURISTICS */}
      {/* ------------------------------------------------------------------ */}
      {activeSubTab === 'recipes' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs">
            <h3 className="font-bold text-amber-900 text-sm">
              {lang === 'de' ? 'Die Heuristiken des Amélie-Suchplaybooks' : 'The Amélie Search Playbook Heuristics'}
            </h3>
            <p className="text-amber-900/90 text-xs mt-1 leading-relaxed">
              {lang === 'de'
                ? 'Diese 8 Methoden haben in 14 Recherche-Runden zuverlässig freie Lücken identifiziert und Fehlinvestitionen verhindert. Nutzen Sie diese Rezepte, bevor Sie eine Zeile Code schreiben.'
                : 'These 8 methods consistently discovered genuine open gaps and prevented wasted effort across 14 search rounds. Apply these heuristics before writing a single line of code.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PLAYBOOK_RECIPES.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono-code text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-200">
                      Rezept #{recipe.number}
                    </span>
                  </div>

                  <h4 className="font-serif-title font-bold text-stone-900 text-base">
                    {lang === 'de' ? recipe.titleDe : recipe.titleEn}
                  </h4>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {lang === 'de' ? recipe.descriptionDe : recipe.descriptionEn}
                  </p>

                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs space-y-1">
                    <span className="font-bold font-mono-code text-stone-700 text-[10px] uppercase block">
                      Suchmuster-Formel:
                    </span>
                    <div className="font-mono-code text-stone-900 font-semibold text-xs">
                      {lang === 'de' ? recipe.formulaDe : recipe.formulaEn}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
                    <span className="font-bold font-mono-code text-emerald-900 text-[10px] uppercase block">
                      🏆 Reales Fundbeispiel:
                    </span>
                    <p className="text-emerald-950 text-xs leading-relaxed">
                      {lang === 'de' ? recipe.fundExampleDe : recipe.fundExampleEn}
                    </p>
                  </div>

                  {recipe.warningDe && (
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                      ⚠️ {lang === 'de' ? recipe.warningDe : recipe.warningEn}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-[11px] font-mono-code text-stone-500">Query-Test:</span>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(recipe.queryExample)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium"
                  >
                    <span>Testen</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SUBTAB 4: BISOCIATION STUDIO */}
      {/* ------------------------------------------------------------------ */}
      {activeSubTab === 'bisociation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif-title font-bold text-stone-900 text-lg">
              {lang === 'de' ? 'Lacunar Bisociation: Frame A + Frame B Collider' : lang === 'es' ? 'Bisociación Lacunar: Colisionador Marco A + Marco B' : 'Lacunar Bisociation: Frame A + Frame B Collider'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === 'de'
                ? 'Kombinieren Sie einen realen Engpass einer Organisation (Frame A) mit einem konkreten technischen Mechanismus (Frame B). Der Schnittpunkt erzeugt lakunäre Lücken, die sich als CC0-Dose verschenken lassen.'
                : lang === 'es'
                ? 'Combine un cuello de botella real de una organización (Marco A) con un mecanismo técnico concreto (Marco B). El punto de intersección expone brechas ideales para regalar como lata CC0.'
                : 'Collide an authentic organizational bottleneck (Frame A) with an emerging technical mechanism (Frame B) to expose unserved gaps.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Frame A: Anchor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase font-mono-code text-stone-600 block">
                    {lang === 'de' ? 'Frame A: Anker (Organisation mit Mandat)' : 'Frame A: Anchor (Mandate Organization)'}
                  </span>
                  <select
                    value={bisocAnchorTheme}
                    onChange={(e) => setBisocAnchorTheme(e.target.value as PlaybookThemeId)}
                    className="text-[11px] px-2 py-1 rounded border border-stone-300 bg-white"
                  >
                    <option value="all">Alle Themen</option>
                    <option value="nature">Naturschutz</option>
                    <option value="construction">Bau & Holz</option>
                    <option value="compliance">Recht/Register</option>
                    <option value="heritage">Kulturerbe</option>
                    <option value="health_water">Wasser & Lärm</option>
                  </select>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {filteredAnchors.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setSelectedAnchorId(a.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedAnchorId === a.id
                          ? 'border-amber-800 bg-amber-50/80 font-bold text-stone-950 shadow-xs ring-1 ring-amber-800'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-amber-900">{lang === 'de' ? a.orgDe : a.orgEn}</div>
                      <div className="text-xs font-semibold mt-0.5">{lang === 'de' ? a.titleDe : a.titleEn}</div>
                      <div className="text-[11px] text-stone-500 font-normal mt-1 leading-snug">{lang === 'de' ? a.problemDe : a.problemEn}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame B: Collider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase font-mono-code text-stone-600 block">
                    {lang === 'de' ? 'Frame B: Kollisions-Mechanismus' : 'Frame B: Collision Mechanism'}
                  </span>
                  <select
                    value={bisocColliderTheme}
                    onChange={(e) => setBisocColliderTheme(e.target.value as PlaybookThemeId)}
                    className="text-[11px] px-2 py-1 rounded border border-stone-300 bg-white"
                  >
                    <option value="all">Alle Techniken</option>
                    <option value="nature">Filter & Vorprüfung</option>
                    <option value="construction">Deterministische Math</option>
                    <option value="compliance">PDF Schema</option>
                    <option value="heritage">RTI & Phonetik</option>
                    <option value="health_water">Sensorlos & Audio</option>
                  </select>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {filteredColliders.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColliderId(c.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedColliderId === c.id
                          ? 'border-amber-800 bg-amber-50/80 font-bold text-stone-950 shadow-xs ring-1 ring-amber-800'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="text-xs font-semibold text-stone-900">{lang === 'de' ? c.titleDe : c.titleEn}</div>
                      <div className="text-[11px] text-stone-500 font-normal mt-1 leading-snug">{lang === 'de' ? c.techDe : c.techEn}</div>
                      <div className="text-[10px] text-emerald-800 font-mono-code mt-1">✓ {lang === 'de' ? c.whyZeroCostDe : c.whyZeroCostEn}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Collision Result Card */}
            <div className="mt-6 p-5 rounded-2xl bg-stone-900 text-white border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code text-amber-400 uppercase tracking-wider">
                  {lang === 'de' ? 'Erzeugte Amélie-Kandidatin' : lang === 'es' ? 'Candidata Amélie generada' : 'Generated Amélie Candidate'}
                </span>
                <span className="text-xs font-mono-code bg-stone-800 px-2 py-0.5 rounded text-stone-300">
                  Lacunar Bisociation (Frame A × Frame B)
                </span>
              </div>

              <h4 className="text-lg font-bold font-serif-title text-amber-100">
                {lang === 'de' ? currentAnchor.titleDe : currentAnchor.titleEn} × {lang === 'de' ? currentCollider.titleDe : currentCollider.titleEn}
              </h4>

              <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 text-xs text-stone-300 space-y-1.5 leading-relaxed">
                <div>
                  <strong className="text-amber-300">{lang === 'de' ? 'Empfänger mit Mandat: ' : 'Mandate Recipient: '}</strong> 
                  {lang === 'de' ? currentAnchor.orgDe : currentAnchor.orgEn} ({lang === 'de' ? currentAnchor.mandateHolderDe : currentAnchor.mandateHolderEn})
                </div>
                <div>
                  <strong className="text-stone-100">{lang === 'de' ? 'Der reale Engpass: ' : 'The Real Bottleneck: '}</strong> 
                  {lang === 'de' ? currentAnchor.problemDe : currentAnchor.problemEn}
                </div>
                <div>
                  <strong className="text-stone-100">{lang === 'de' ? 'Die technische Lösung: ' : 'The Technical Mechanism: '}</strong> 
                  {lang === 'de' ? currentCollider.techDe : currentCollider.techEn}
                </div>
                <div className="text-emerald-400 font-mono-code text-[11px]">
                  <strong>Zero-Cost Prinzip: </strong> {lang === 'de' ? currentCollider.whyZeroCostDe : currentCollider.whyZeroCostEn}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                {onSendToPipeline && (
                  <button
                    onClick={() =>
                      onSendToPipeline({
                        title: `${lang === 'de' ? currentAnchor.titleDe : currentAnchor.titleEn} Tool`,
                        recipientDe: currentAnchor.orgDe,
                        recipientEn: currentAnchor.orgEn,
                        conceptDe: `${currentAnchor.problemDe} Gelöst über ${currentCollider.titleDe}.`,
                        conceptEn: `${currentAnchor.problemEn} Solved via ${currentCollider.titleEn}.`,
                        status: 'unklar',
                        suggestedVerdict: 'gift',
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <span>{lang === 'de' ? 'In Pipeline übernehmen' : lang === 'es' ? 'Adoptar en pipeline' : 'Add to Pipeline'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
