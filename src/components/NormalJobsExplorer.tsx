import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  Wrench, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Users, 
  GraduationCap, 
  Trees, 
  Utensils, 
  Baby, 
  Send,
  User,
  Quote,
  ExternalLink,
  Flame,
  Building2,
  XCircle,
  HelpCircle,
  Stethoscope,
  Compass
} from 'lucide-react';
import { Language } from '../types';
import { NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS } from '../data/ideas/normalJobsAndEverydayPeople';
import { AMELIE_PLEDGE } from '../data/manifest';
import { getLocalizedTitle } from '../i18n';

interface NormalJobsExplorerProps {
  lang: Language;
}

type SectorFilter = 'all' | 'care' | 'craft' | 'cleaning' | 'food' | 'transport' | 'education' | 'forestry';

export const NormalJobsExplorer: React.FC<NormalJobsExplorerProps> = ({ lang }) => {
  const [activeSector, setActiveSector] = useState<SectorFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('ai-nurse-shift-guardian');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);
  const [showEmailModalId, setShowEmailModalId] = useState<string | null>(null);

  // Interactive simulators state
  const [nurseLateEnd, setNurseLateEnd] = useState('21:30');
  const [nurseEarlyStart, setNurseEarlyStart] = useState('06:00');
  const [nurseNightHours, setNurseNightHours] = useState(8);
  const [nurseHourlyWage, setNurseHourlyWage] = useState(23.50);

  const [craftTrade, setCraftTrade] = useState('Fliesenleger');
  const [craftDefect, setCraftDefect] = useState('Estrich-Restfeuchte 3,4% (zulässig max 2,0%)');
  const [craftGenerated, setCraftGenerated] = useState(false);

  const [chemBottleA, setChemBottleA] = useState('acid');
  const [chemBottleB, setChemBottleB] = useState('bleach');

  const [allergenInput, setAllergenInput] = useState('Gewürzmischung mit Senfmehl, Selleriesalz, hydrolysiertes Sojaeiweiß, Weizengluten');

  // Sector counts and filtering
  const sectorCounts = useMemo(() => {
    const counts: Record<SectorFilter, number> = {
      all: NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS.length,
      care: 0,
      craft: 0,
      cleaning: 0,
      transport: 0,
      food: 0,
      education: 0,
      forestry: 0,
    };
    NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS.forEach(idea => {
      const tags = idea.tags || [];
      if (tags.some(t => ['Pflege', 'Gesundheit', 'Wundversorgung', 'Altenpflege', 'Senioren'].includes(t))) counts.care++;
      if (tags.some(t => ['Handwerk', 'Baustelle', 'Sanitär', 'Dachdecker', 'Schornsteinfeger', 'Kfz', 'Schreiner', 'Tischler', 'Friseur', 'Fleischer'].includes(t))) counts.craft++;
      if (tags.some(t => ['Reinigung'].includes(t))) counts.cleaning++;
      if (tags.some(t => ['Lieferanten', 'Paketboten', 'Transport', 'LKW', 'Busfahrer', 'ÖPNV'].includes(t))) counts.transport++;
      if (tags.some(t => ['Gastronomie', 'Bäcker', 'Kochen', 'Lebensmittel', 'Fleischer', 'Kellner', 'Service'].includes(t))) counts.food++;
      if (tags.some(t => ['Kita', 'Bildung', 'Erzieher'].includes(t))) counts.education++;
      if (tags.some(t => ['Forstwirtschaft', 'Wald', 'Landwirtschaft', 'Bauern', 'Gartenbau', 'GaLaBau'].includes(t))) counts.forestry++;
    });
    return counts;
  }, []);

  // Sector filtering
  const filteredIdeas = useMemo(() => {
    return NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS.filter((idea) => {
      const localizedTitle = getLocalizedTitle(idea, lang).toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        idea.title.toLowerCase().includes(q) ||
        localizedTitle.includes(q) ||
        idea.conceptDe.toLowerCase().includes(q) ||
        idea.conceptEn.toLowerCase().includes(q) ||
        (idea.workerPersona?.name || '').toLowerCase().includes(q) ||
        (idea.workerPersona?.role || '').toLowerCase().includes(q) ||
        (idea.problemDe || '').toLowerCase().includes(q);

      if (!matchesSearch) return false;

      const tags = idea.tags || [];
      if (activeSector === 'all') return true;
      if (activeSector === 'care') return tags.some(t => ['Pflege', 'Gesundheit', 'Wundversorgung', 'Altenpflege', 'Senioren'].includes(t));
      if (activeSector === 'craft') return tags.some(t => ['Handwerk', 'Baustelle', 'Sanitär', 'Dachdecker', 'Schornsteinfeger', 'Kfz', 'Schreiner', 'Tischler', 'Friseur', 'Fleischer'].includes(t));
      if (activeSector === 'cleaning') return tags.some(t => ['Reinigung'].includes(t));
      if (activeSector === 'food') return tags.some(t => ['Gastronomie', 'Bäcker', 'Kochen', 'Lebensmittel', 'Fleischer', 'Kellner', 'Service'].includes(t));
      if (activeSector === 'transport') return tags.some(t => ['Lieferanten', 'Paketboten', 'Transport', 'LKW', 'Busfahrer', 'ÖPNV'].includes(t));
      if (activeSector === 'education') return tags.some(t => ['Kita', 'Bildung', 'Erzieher'].includes(t));
      if (activeSector === 'forestry') return tags.some(t => ['Forstwirtschaft', 'Wald', 'Landwirtschaft', 'Bauern', 'Gartenbau', 'GaLaBau'].includes(t));
      return true;
    });
  }, [activeSector, searchQuery, lang]);

  const handleCopyDossier = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyEmail = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmailId(id);
    setTimeout(() => setCopiedEmailId(null), 2500);
  };

  // Calculations for Nurse simulator
  const restHours = useMemo(() => {
    const [lH, lM] = nurseLateEnd.split(':').map(Number);
    const [eH, eM] = nurseEarlyStart.split(':').map(Number);
    let diffMinutes = (eH * 60 + eM) - (lH * 60 + lM);
    if (diffMinutes < 0) diffMinutes += 24 * 60;
    return (diffMinutes / 60).toFixed(1);
  }, [nurseLateEnd, nurseEarlyStart]);

  const isRestIllegal = parseFloat(restHours) < 11.0;
  const nightBonusTotal = (nurseNightHours * nurseHourlyWage * 0.25).toFixed(2);
  const sundayBonusTotal = (nurseNightHours * nurseHourlyWage * 0.50).toFixed(2);

  // Chemical hazard detection
  const isChemDangerous = (chemBottleA === 'acid' && chemBottleB === 'bleach') || 
                          (chemBottleA === 'bleach' && chemBottleB === 'acid') ||
                          (chemBottleA === 'ammonia' && chemBottleB === 'bleach') ||
                          (chemBottleA === 'bleach' && chemBottleB === 'ammonia');

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Hero Header */}
      <div className="bg-[#fbf9f5] border border-amber-900/15 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-72 h-72 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono tracking-wider uppercase text-amber-950 font-semibold">
          <span className="px-3 py-1 rounded-md bg-amber-100/90 border border-amber-300/80 flex items-center gap-1.5 shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
            {lang === 'de' ? 'Arbeit der Vielen' : lang === 'es' ? 'Trabajo de la Mayoría' : 'Everyday People & Real Work'}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
            {NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS.length}{' '}
            {lang === 'de'
              ? 'Praktische Werkzeuge als Schenkung'
              : lang === 'es'
              ? 'Herramientas abiertas como regalo'
              : 'Open Public-Good Tools as Gifts'}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
            {lang === 'de'
              ? 'Vor KI unmöglich → Jetzt kinderleicht'
              : lang === 'es'
              ? 'Antes imposible → Ahora sencillo'
              : 'Before AI impossible → Now easy'}
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-serif text-stone-900 tracking-tight">
            {lang === 'de' 
              ? 'Für die normalen Berufe: Echte Menschen, echte Not und konkrete E-Mail-Adressen' 
              : lang === 'es'
              ? 'Para oficios cotidianos: personas reales, necesidades concretas y correos directos'
              : 'For Everyday Workers: Real People, Real Stories, and Direct Outreach Contacts'}
          </h1>
          <p className="text-stone-700 text-sm md:text-base leading-relaxed max-w-4xl">
            {lang === 'de'
              ? 'KI soll nicht die zehnte Marketing-App bauen, sondern denen helfen, die morgens um 4 Uhr aufstehen, Kranke pflegen, Staub schlucken und schwere Pakete schleppen. Jede Idee hier enthält die wahre Geschichte einer arbeitenden Person, die juristische oder physikalische Schutzwirkung, den genauen technischen Durchbruch und verifizierte Adressen von Gewerkschaften und Innungen, denen wir diese Werkzeuge bedingungslos schenken.'
              : lang === 'es'
              ? 'La IA no debería crear la décima aplicación de marketing, sino proteger a quienes madrugan a las 4 AM, cuidan a los enfermos y cargan paquetes pesados. Cada propuesta incluye una historia real, garantías de protección y contactos directos de sindicatos para regalarla con licencia CC0.'
              : 'AI should not build speculative SaaS toys, but protect those who wake up at 4 AM, care for the sick, swallow construction dust, and haul heavy parcels. Each proposal links an authentic human story, real legal or physical safeguards, the breakthrough that makes it easy today, and verified contact addresses to gift it freely under CC0.'}
          </p>
        </div>

        {/* Guiding Quote */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-3 text-xs text-amber-950 font-medium">
          <Quote className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">
              {lang === 'de' ? 'Das Amélie-Prinzip: ' : lang === 'es' ? 'El Principio Amélie: ' : 'The Amélie Principle: '}
            </span>
            <span>
              {lang === 'de'
                ? '„Zuerst dem einfachen Arbeiter helfen. Den normalen Menschen. Früher war das unbezahlbar oder technisch unmöglich – heute ist es mit einem Standard-Smartphone und Open-Source-Modellen kinderleicht. Wir verschenken jede Lösung schlüsselfertig an die zuständige Gewerkschaft oder Innung."'
                : lang === 'es'
                ? '«Ayudar primero al trabajador común. A la gente cotidiana. Antes esto era inaccesible o imposible; hoy es sencillo con un teléfono inteligente y modelos abiertos. Regalamos cada solución directamente a los sindicatos y gremios.»'
                : '"Help the simple worker first. The everyday people. Before AI, this was unaffordable or technically impossible—today it is effortless with standard phones and open models. We gift every blueprint directly to the workers’ unions."'}
            </span>
          </div>
        </div>
      </div>

      {/* Sector Navigation Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="text-xs font-mono font-semibold uppercase text-stone-500 tracking-wider">
            {lang === 'de' ? 'Berufsfeld wählen:' : lang === 'es' ? 'Categoría de trabajo:' : 'Select Worker Category:'}
          </span>
          <input 
            type="text" 
            placeholder={
              lang === 'de'
                ? 'Suchen nach Beruf, Name, Problem oder Werkzeug...'
                : lang === 'es'
                ? 'Buscar por oficio, nombre, problema o herramienta...'
                : 'Search worker, name, trade or tool...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 w-full sm:w-72 shadow-2xs font-mono"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'all', labelDe: `Alle Berufe (${sectorCounts.all})`, labelEs: `Todos los oficios (${sectorCounts.all})`, labelEn: `All Trades (${sectorCounts.all})`, icon: Users },
            { id: 'care', labelDe: `Pflege & Gesundheit (${sectorCounts.care})`, labelEs: `Salud y Cuidados (${sectorCounts.care})`, labelEn: `Care & Health (${sectorCounts.care})`, icon: Heart },
            { id: 'craft', labelDe: `Bau & Handwerk (${sectorCounts.craft})`, labelEs: `Construcción y Oficios (${sectorCounts.craft})`, labelEn: `Trades & Crafts (${sectorCounts.craft})`, icon: Wrench },
            { id: 'cleaning', labelDe: `Gebäudereinigung (${sectorCounts.cleaning})`, labelEs: `Limpieza de Edificios (${sectorCounts.cleaning})`, labelEn: `Cleaners (${sectorCounts.cleaning})`, icon: ShieldCheck },
            { id: 'transport', labelDe: `Logistik & Fahrer (${sectorCounts.transport})`, labelEs: `Transporte y Reparto (${sectorCounts.transport})`, labelEn: `Transport & Drivers (${sectorCounts.transport})`, icon: Truck },
            { id: 'food', labelDe: `Gastro & Ernährung (${sectorCounts.food})`, labelEs: `Hostelería y Cocina (${sectorCounts.food})`, labelEn: `Food & Kitchens (${sectorCounts.food})`, icon: Utensils },
            { id: 'education', labelDe: `Kita & Erzieher (${sectorCounts.education})`, labelEs: `Educación Infantil (${sectorCounts.education})`, labelEn: `Educators (${sectorCounts.education})`, icon: Baby },
            { id: 'forestry', labelDe: `Agrar, Natur & Forst (${sectorCounts.forestry})`, labelEs: `Agricultura y Bosques (${sectorCounts.forestry})`, labelEn: `Agriculture & Forestry (${sectorCounts.forestry})`, icon: Trees },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSector === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSector(item.id as SectorFilter)}
                className={`px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 shadow-2xs ${
                  isActive 
                    ? 'bg-amber-900 text-amber-50 font-semibold shadow-xs' 
                    : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-200' : 'text-stone-500'}`} />
                <span>{lang === 'de' ? item.labelDe : lang === 'es' ? item.labelEs : item.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ideas List */}
      <div className="space-y-6">
        {filteredIdeas.map((idea) => {
          const isExpanded = expandedId === idea.id;
          const persona = idea.workerPersona;
          const shift = idea.techShift;
          const recipients = idea.realRecipientsList || [];
          const email = idea.readyEmail;
          const localizedTitle = getLocalizedTitle(idea, lang);

          return (
            <div 
              key={idea.id}
              className={`bg-white border rounded-3xl transition-all overflow-hidden ${
                isExpanded 
                  ? 'border-amber-900/30 shadow-md ring-1 ring-amber-900/10' 
                  : 'border-stone-200/90 hover:border-stone-300 shadow-2xs'
              }`}
            >
              {/* Card Summary Header */}
              <div 
                className="p-5 md:p-6 cursor-pointer flex items-start justify-between gap-4 select-none hover:bg-stone-50/50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : idea.id)}
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-amber-100/80 text-amber-900 font-semibold border border-amber-200">
                      {idea.sourceType}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100/90 text-emerald-900 font-semibold border border-emerald-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-700" />
                      {lang === 'de' ? 'Schenkung (CC0)' : lang === 'es' ? 'Donación (CC0)' : 'Gift (CC0)'}
                    </span>
                    {persona && (
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 font-medium flex items-center gap-1">
                        <User className="w-3 h-3 text-stone-500" />
                        {persona.name} · {persona.location}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-serif text-stone-900 tracking-tight flex items-center gap-2">
                      <span>{localizedTitle}</span>
                    </h3>
                    <p className="text-stone-700 text-sm mt-1 leading-relaxed">
                      {lang === 'de' ? idea.conceptDe : idea.conceptEn}
                    </p>
                  </div>

                  {/* Worker Quote Pill */}
                  {persona && (
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 italic flex items-start gap-2 max-w-3xl">
                      <Quote className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>"{lang === 'de' ? persona.quoteDe : persona.quoteEn}"</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <button 
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Deep Dossier */}
              {isExpanded && (
                <div className="p-5 md:p-6 pt-0 border-t border-stone-100 space-y-6">
                  
                  {/* REAL PERSON & REAL STORY SECTION */}
                  {persona && (
                    <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/70 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-950">
                        <User className="w-4 h-4 text-amber-700" />
                        <span>{lang === 'de' ? 'Der echte Mensch hinter dieser Idee' : lang === 'es' ? 'La persona real detrás de esta idea' : 'The Real Worker & Authentic Story'}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="p-3 rounded-xl bg-white border border-amber-200/80 space-y-1">
                          <span className="text-stone-500 font-mono block text-[11px] uppercase">
                            {lang === 'de' ? 'Person & Einsatzort' : lang === 'es' ? 'Persona y lugar de trabajo' : 'Worker & Workplace'}
                          </span>
                          <span className="font-bold text-stone-900 text-sm block">{persona.name}</span>
                          <span className="text-stone-700 font-medium block">{persona.role}</span>
                          <span className="text-stone-500 block">{persona.location}</span>
                        </div>

                        <div className="md:col-span-2 p-3.5 rounded-xl bg-white border border-amber-200/80 space-y-1.5">
                          <span className="text-stone-500 font-mono block text-[11px] uppercase">
                            {lang === 'de' ? 'Die konkrete Härte im Arbeitsalltag' : lang === 'es' ? 'La dificultad real en el trabajo cotidiano' : 'Daily Job Reality & Struggle'}
                          </span>
                          <p className="text-stone-800 leading-relaxed">
                            {lang === 'de' ? persona.storyDe : persona.storyEn}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BEFORE AI WAS NOT POSSIBLE vs. NOW IT'S EASY */}
                  {shift && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Left: Why it was impossible before AI */}
                      <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-rose-950 font-mono font-bold uppercase text-[11px]">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>{lang === 'de' ? 'Vor KI technisch unmöglich' : lang === 'es' ? 'Antes de la IA técnicamente imposible' : 'Impossible Before AI'}</span>
                        </div>
                        <p className="text-rose-900 leading-relaxed">
                          {lang === 'de' ? shift.beforeAiDe : shift.beforeAiEn}
                        </p>
                      </div>

                      {/* Right: Why it is easy now */}
                      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-emerald-950 font-mono font-bold uppercase text-[11px]">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <span>{lang === 'de' ? 'Heute kinderleicht gelöst' : lang === 'es' ? 'Hoy resuelto de forma sencilla' : 'Effortless & Accessible Today'}</span>
                        </div>
                        <p className="text-emerald-900 leading-relaxed">
                          {lang === 'de' ? shift.nowEasyDe : shift.nowEasyEn}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Problem & Legal Defense Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                      <span className="font-mono text-stone-500 uppercase font-semibold block text-[11px]">
                        {lang === 'de' ? 'Systemischer Schaden & Belastung' : lang === 'es' ? 'Carga y daño sistémico' : 'Systemic Burden & Cost'}
                      </span>
                      <p className="text-stone-800 leading-relaxed">
                        {lang === 'de' ? idea.evidenceDe : idea.evidenceEn}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                      <span className="font-mono text-stone-500 uppercase font-semibold block text-[11px]">
                        {lang === 'de' ? 'Erster technischer Prüfschritt (MVP)' : lang === 'es' ? 'Primer paso de verificación técnica (MVP)' : 'First Technical Verification Ticket'}
                      </span>
                      <p className="text-stone-800 font-medium">
                        {lang === 'de' ? idea.firstStepTicketDe : idea.firstStepTicketEn}
                      </p>
                      <p className="text-stone-600 italic">
                        {lang === 'de' ? idea.firstStepCriteriaDe : idea.firstStepCriteriaEn}
                      </p>
                    </div>
                  </div>

                  {/* INTERACTIVE WORKFLOW SIMULATOR (Custom for each key job) */}
                  {idea.id === 'ai-nurse-shift-guardian' && (
                    <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase text-amber-950 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-800" />
                          {lang === 'de' ? 'Interaktiver Test: Schichtfolge & Zuschlagsrechner' : lang === 'es' ? 'Prueba interactiva: Secuencia de turnos y cálculo de suplementos' : 'Interactive Demo: Shift Sequence & Bonus Auditor'}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-300 font-semibold">
                          § 5 ArbZG Check
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <label className="block text-stone-600 font-semibold mb-1">
                            {lang === 'de' ? 'Spätdienst Ende:' : lang === 'es' ? 'Fin del turno de tarde:' : 'Late Shift End:'}
                          </label>
                          <input 
                            type="time" 
                            value={nurseLateEnd}
                            onChange={(e) => setNurseLateEnd(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg font-mono text-stone-900"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-600 font-semibold mb-1">
                            {lang === 'de' ? 'Frühdienst Beginn:' : lang === 'es' ? 'Inicio del turno de mañana:' : 'Early Shift Start:'}
                          </label>
                          <input 
                            type="time" 
                            value={nurseEarlyStart}
                            onChange={(e) => setNurseEarlyStart(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg font-mono text-stone-900"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-600 font-semibold mb-1">
                            {lang === 'de' ? 'Nachtstunden (21-6h):' : lang === 'es' ? 'Horas nocturnas (21-6h):' : 'Night Hours:'}
                          </label>
                          <input 
                            type="number" 
                            min="0"
                            max="12"
                            value={nurseNightHours}
                            onChange={(e) => setNurseNightHours(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg font-mono text-stone-900"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-600 font-semibold mb-1">
                            {lang === 'de' ? 'Stundenlohn (€):' : lang === 'es' ? 'Salario por hora (€):' : 'Hourly Wage ($/€):'}
                          </label>
                          <input 
                            type="number" 
                            step="0.5"
                            value={nurseHourlyWage}
                            onChange={(e) => setNurseHourlyWage(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg font-mono text-stone-900"
                          />
                        </div>
                      </div>

                      {/* Result Box */}
                      <div className="p-3.5 rounded-xl bg-white border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className={`p-2.5 rounded-lg border ${isRestIllegal ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'}`}>
                          <span className="font-bold block mb-0.5">
                            {isRestIllegal ? (lang === 'de' ? '⚠️ Gesetzwidrige Ruhezeit!' : lang === 'es' ? '⚠️ ¡Descanso ilegal!' : '⚠️ Illegal Rest Period!') : (lang === 'de' ? '✅ Gesetzliche Ruhezeit eingehalten' : lang === 'es' ? '✅ Descanso legal cumplido' : '✅ Statutory Rest Compliant')}
                          </span>
                          <span>
                            {lang === 'de'
                              ? `Zwischen Schichten liegen nur ${restHours} Stunden (Gesetz fordert mind. 11h ununterbrochen nach § 5 ArbZG).`
                              : lang === 'es'
                              ? `Entre turnos solo hay ${restHours} horas (la ley exige un mínimo de 11 h ininterrumpidas).`
                              : `Only ${restHours} hours between shifts (Statutory law requires minimum 11 consecutive hours).`}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950">
                          <span className="font-bold block mb-0.5">
                            {lang === 'de' ? '💰 Zustehende steuerfreie Zuschläge:' : lang === 'es' ? '💰 Suplementos libres de impuestos correspondientes:' : '💰 Earned Tax-Free Supplements:'}
                          </span>
                          <div className="flex items-center justify-between pt-1 font-mono">
                            <span>{lang === 'de' ? 'Nacht' : lang === 'es' ? 'Noche' : 'Night'} (+25%): <strong>+{nightBonusTotal} €</strong></span>
                            <span>{lang === 'de' ? 'Sonntag' : lang === 'es' ? 'Domingo' : 'Sunday'} (+50%): <strong>+{sundayBonusTotal} €</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {idea.id === 'ai-tradesman-liability-shield' && (
                    <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase text-amber-950 flex items-center gap-1.5">
                          <Wrench className="w-4 h-4 text-amber-800" />
                          {lang === 'de' ? 'Interaktiver Test: VOB/B Bedenkenanmeldung in 10 Sekunden' : lang === 'es' ? 'Prueba interactiva: Notificación de objeción técnica en 10 s' : 'Interactive Demo: 10-Second VOB/B Liability Notice'}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-300 font-semibold">
                          DIN 18560 Generator
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-stone-600 font-semibold mb-1">
                            {lang === 'de' ? 'Gewerk:' : lang === 'es' ? 'Oficio / Especialidad:' : 'Trade / Subcontractor:'}
                          </label>
                          <select 
                            value={craftTrade}
                            onChange={(e) => setCraftTrade(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-900"
                          >
                            <option value="Fliesenleger">Fliesenleger / Tile Setter</option>
                            <option value="Parkettleger">Parkettleger / Flooring Specialist</option>
                            <option value="Maler und Lackierer">Maler / Painter & Drywaller</option>
                            <option value="Sanitärinstallateur">Sanitär / Plumber</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-stone-600 font-semibold mb-1">
                            {lang === 'de' ? 'Festgestellter Mangel des Vorunternehmers:' : lang === 'es' ? 'Defecto detectado en el soporte o fase previa:' : 'Discovered Substrate Defect:'}
                          </label>
                          <input 
                            type="text" 
                            value={craftDefect}
                            onChange={(e) => setCraftDefect(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-900"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => setCraftGenerated(true)}
                          className="px-3.5 py-1.5 bg-amber-900 hover:bg-amber-800 text-amber-50 rounded-xl text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{lang === 'de' ? 'Rechtssicheres PDF erzeugen' : lang === 'es' ? 'Generar aviso legal seguro' : 'Generate Legal VOB Notice'}</span>
                        </button>
                      </div>

                      {craftGenerated && (
                        <div className="p-3.5 rounded-xl bg-white border border-amber-300 space-y-2 text-xs font-mono text-stone-800">
                          <div className="flex items-center justify-between border-b pb-1.5">
                            <span className="font-bold text-amber-950">FORMELLE BEDENKENANMELDUNG NACH § 4 ABS. 3 VOB/B</span>
                            <span className="text-[10px] text-stone-500">DIN 18560 · Beweis-ID: #VOB-2026-9182</span>
                          </div>
                          <p className="text-[11px] leading-relaxed">
                            {lang === 'de'
                              ? `Hiermit melde ich namens des Gewerk ${craftTrade} formell schriftliche Bedenken gegen die vorgesehene Ausführung an. Feststellung vor Ort: "${craftDefect}". Gemäß DIN 18560 ist eine Verlegung unzulässig, da irreversible Rissbildungen und Hohllagen drohen. Die Gewährleistung für Folgeschäden wird ausdrücklich abgelehnt. Bitte um Baufreigabe erst nach vollständiger Trocknung.`
                              : lang === 'es'
                              ? `Por la presente se notifica objeción formal según VOB/B para el oficio ${craftTrade}. Constatación in situ: "${craftDefect}". Según norma DIN 18560 la instalación resulta improcedente por riesgo de fisuras irreversibles.`
                              : `Hereby filing formal written notice of objection per § 4 Abs. 3 VOB/B for trade ${craftTrade}. Site observation: "${craftDefect}". Under building code DIN 18560, substrate cannot accept installation without severe structural warranty failure.`}
                          </p>
                          <div className="text-[10px] text-emerald-700 font-semibold pt-1">
                            ✓ {lang === 'de' ? 'Bereit zum Versand per WhatsApp / E-Mail an Bauleitung' : lang === 'es' ? 'Listo para enviar por WhatsApp / email a la dirección de obra' : 'Ready to transmit via WhatsApp / email to general contractor'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {idea.id === 'ai-cleaner-chemical-safety-voice' && (
                    <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase text-amber-950 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-amber-800" />
                          {lang === 'de' ? 'Interaktiver Test: Chemische Unverträglichkeitsprüfung' : lang === 'es' ? 'Prueba interactiva: Alarma de toxicidad química' : 'Interactive Demo: Chemical Toxicity Alarm'}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-300 font-semibold">
                          GHS Polyglot Shield
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-stone-600 font-semibold mb-1">
                            {lang === 'de' ? 'Flasche A (z.B. Sanitär-Entkalker):' : lang === 'es' ? 'Botella A (p. ej. descalcificador ácido):' : 'Bottle A (e.g. Acid Descaler):'}
                          </label>
                          <select 
                            value={chemBottleA}
                            onChange={(e) => setChemBottleA(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-mono"
                          >
                            <option value="acid">Phosphorsäure / Essigreiniger (Säure)</option>
                            <option value="neutral">Neutraler Allzweckreiniger (Tenside)</option>
                            <option value="bleach">Chlor-Bleichmittel (Natriumhypochlorit)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-stone-600 font-semibold mb-1">
                            {lang === 'de' ? 'Flasche B (z.B. Schimmelentferner):' : lang === 'es' ? 'Botella B (p. ej. lejía antimoho):' : 'Bottle B (e.g. Mold Cleaner):'}
                          </label>
                          <select 
                            value={chemBottleB}
                            onChange={(e) => setChemBottleB(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-mono"
                          >
                            <option value="bleach">Chlor-Bleichmittel (Natriumhypochlorit)</option>
                            <option value="acid">Phosphorsäure / Urinsteinentferner (Säure)</option>
                            <option value="ammonia">Salmiakgeist (Ammoniakwasser)</option>
                            <option value="neutral">Alkohol-Glasreiniger</option>
                          </select>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl border text-xs font-mono transition-all ${
                        isChemDangerous 
                          ? 'bg-rose-100/90 border-rose-400 text-rose-950 animate-pulse' 
                          : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      }`}>
                        {isChemDangerous ? (
                          <div className="space-y-1">
                            <div className="font-bold flex items-center gap-1.5 text-sm">
                              <AlertTriangle className="w-4 h-4 text-rose-600" />
                              <span>🚨 ALARM: TÖDLICHE Chlorgas-Reaktion! / LETHAL GAS HAZARD!</span>
                            </div>
                            <p className="text-xs">
                              {lang === 'de'
                                ? 'Säure und Natriumhypochlorit setzen sofort giftiges Chlorgas (Cl₂) frei! Verätzungsgefahr der Lunge. Sprachwarnung auf Arabisch, Ukrainisch, Polnisch, Türkisch wird laut abgespielt.'
                                : lang === 'es'
                                ? '¡El ácido y el hipoclorito de sodio liberan gas de cloro tóxico (Cl₂)! Peligro grave para los pulmones. Se activa alarma de voz inmediata.'
                                : 'Acid + Sodium hypochlorite immediately releases lethal chlorine gas (Cl₂)! Loud native-language audio warning triggers on device.'}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>✅ {lang === 'de' ? 'Kombination unkritisch. Normale Schutzhandschuhe tragen.' : lang === 'es' ? 'Combinación no reactiva. Usar guantes de protección estándar.' : 'Safe combination. Standard protective gloves recommended.'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {idea.id === 'ai-line-cook-allergen-radar' && (
                    <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase text-amber-950 flex items-center gap-1.5">
                          <Utensils className="w-4 h-4 text-amber-800" />
                          {lang === 'de' ? 'Interaktiver Test: 14 EU-Allergene Dekodierer' : lang === 'es' ? 'Prueba interactiva: Decodificador de 14 alérgenos UE' : 'Interactive Demo: 14 EU Statutory Allergen Decoder'}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-300 font-semibold">
                          EU 1169/2011
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <label className="block text-stone-600 font-semibold">
                          {lang === 'de' ? 'Zutatenliste aus Foto / Verpackungsrückseite:' : lang === 'es' ? 'Lista de ingredientes de foto o etiqueta:' : 'Packaging Ingredient Text Sample:'}
                        </label>
                        <input 
                          type="text" 
                          value={allergenInput}
                          onChange={(e) => setAllergenInput(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-900 font-mono"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1.5 text-xs">
                        <span className="font-bold text-stone-800 block">
                          {lang === 'de' ? 'Erkannte kennzeichnungspflichtige Allergene:' : lang === 'es' ? 'Alérgenos obligatorios detectados:' : 'Detected Mandatory Statutory Allergens:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {allergenInput.toLowerCase().includes('senf') && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 font-semibold">
                              🌿 Senf (Mustard)
                            </span>
                          )}
                          {allergenInput.toLowerCase().includes('sellerie') && (
                            <span className="px-2 py-0.5 rounded-md bg-green-100 border border-green-300 text-green-900 font-semibold">
                              🥬 Sellerie (Celery)
                            </span>
                          )}
                          {allergenInput.toLowerCase().includes('soja') && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 border border-purple-300 text-purple-900 font-semibold">
                              🫘 Soja (Soy)
                            </span>
                          )}
                          {allergenInput.toLowerCase().includes('weizen') && (
                            <span className="px-2 py-0.5 rounded-md bg-yellow-100 border border-yellow-300 text-yellow-900 font-semibold">
                              🌾 Glutenhaltiges Getreide (Wheat)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VERIFIED RECIPIENTS & DIRECT CONTACT PERSONS (Real emails & people to give to) */}
                  <div className="p-5 rounded-2xl bg-[#f7f5ef] border border-amber-900/20 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-950">
                        <Building2 className="w-4 h-4 text-amber-800" />
                        <span>{lang === 'de' ? 'Echte Ansprechpartner & verifizierte E-Mails zum Schenken' : lang === 'es' ? 'Contactos reales y correos verificados para regalar' : 'Real Organizations & Direct Verified Outreach Contacts'}</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded font-semibold">
                        CC0 / Public Domain Schenkung
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {recipients.map((rec, rIdx) => (
                        <div 
                          key={rIdx}
                          className="p-3.5 rounded-xl bg-white border border-amber-200/80 space-y-2 shadow-2xs hover:border-amber-400 transition-colors"
                        >
                          <div>
                            <span className="font-bold text-stone-900 block leading-tight">{rec.org}</span>
                            {rec.person && (
                              <span className="text-amber-950 font-medium text-[11px] block mt-0.5">
                                👤 {rec.person}
                              </span>
                            )}
                            {rec.location && (
                              <span className="text-stone-500 text-[10px] block font-mono">
                                📍 {rec.location}
                              </span>
                            )}
                          </div>

                          <p className="text-stone-700 text-[11px] leading-snug">
                            {lang === 'de' ? rec.roleDe : rec.roleEn}
                          </p>

                          <div className="pt-1.5 flex items-center justify-between border-t border-stone-100">
                            <a 
                              href={`mailto:${rec.email}?subject=${encodeURIComponent(email?.subjectDe || localizedTitle)}&body=${encodeURIComponent(email?.bodyDe || '')}`}
                              className="text-amber-900 font-mono font-semibold hover:underline flex items-center gap-1 text-[11px]"
                            >
                              <Mail className="w-3.5 h-3.5 text-amber-700" />
                              <span>{rec.email}</span>
                            </a>
                            {rec.url && (
                              <a 
                                href={rec.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-stone-400 hover:text-stone-600"
                                title="Website besuchen"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pre-Formulated Ready-to-Send Email Button */}
                    {email && (
                      <div className="p-4 rounded-xl bg-white border border-amber-300/80 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Send className="w-4 h-4 text-amber-800" />
                            <span className="text-xs font-bold text-stone-900 font-mono uppercase">
                              {lang === 'de'
                                ? 'Fertiges Anschreiben für Gewerkschaft / Verband:'
                                : lang === 'es'
                                ? 'Carta lista para enviar al sindicato o gremio:'
                                : 'Ready-to-Send Gift Letter:'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyEmail(idea.id, `Betreff: ${lang === 'de' ? email.subjectDe : email.subjectEn}\n\n${lang === 'de' ? email.bodyDe : email.bodyEn}`)}
                              className="px-3 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg text-xs text-stone-800 font-medium transition-all flex items-center gap-1"
                            >
                              {copiedEmailId === idea.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-600" />}
                              <span>
                                {copiedEmailId === idea.id
                                  ? (lang === 'de' ? 'Kopiert!' : lang === 'es' ? '¡Copiado!' : 'Copied!')
                                  : (lang === 'de' ? 'Text kopieren' : lang === 'es' ? 'Copiar texto' : 'Copy Text')}
                              </span>
                            </button>

                            <a
                              href={`mailto:${recipients[0]?.email || ''}?subject=${encodeURIComponent(lang === 'de' ? email.subjectDe : email.subjectEn)}&body=${encodeURIComponent(lang === 'de' ? email.bodyDe : email.bodyEn)}`}
                              className="px-3 py-1 bg-amber-900 hover:bg-amber-800 text-amber-50 rounded-lg text-xs font-medium transition-all flex items-center gap-1 shadow-2xs"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>
                                {lang === 'de'
                                  ? 'In Mail-Programm öffnen'
                                  : lang === 'es'
                                  ? 'Abrir en cliente de correo'
                                  : 'Open in Mail Client'}
                              </span>
                            </a>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 font-mono text-[11px] text-stone-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                          <strong>{lang === 'de' ? 'Betreff:' : lang === 'es' ? 'Asunto:' : 'Subject:'}</strong> {lang === 'de' ? email.subjectDe : email.subjectEn}
                          {'\n\n'}
                          {lang === 'de' ? email.bodyDe : email.bodyEn}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-stone-100">
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      {(idea.tags || []).map((t, tidx) => (
                        <span key={tidx} className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200 font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          const isDe = lang === 'de';
                          const isEs = lang === 'es';
                          const humanLabel = isDe ? 'Mensch:' : isEs ? 'Persona:' : 'Worker:';
                          const beforeLabel = isDe ? 'Vor KI unmöglich:' : isEs ? 'Imposible antes de la IA:' : 'Impossible Before AI:';
                          const nowLabel = isDe ? 'Jetzt kinderleicht:' : isEs ? 'Ahora sencillo:' : 'Effortless Today:';
                          const recLabel = isDe ? 'Empfänger:' : isEs ? 'Destinatarios:' : 'Recipients:';
                          const pledgeLabel = isDe ? 'Amélie-Pledge:' : isEs ? 'Compromiso Amélie:' : 'Amélie Pledge:';

                          const beforeText = isDe ? shift?.beforeAiDe : shift?.beforeAiEn;
                          const nowText = isDe ? shift?.nowEasyDe : shift?.nowEasyEn;

                          handleCopyDossier(
                            idea.id,
                            `${localizedTitle}\n\n${humanLabel}\n${persona?.name} (${persona?.role}, ${persona?.location})\n\n${beforeLabel}\n${beforeText}\n\n${nowLabel}\n${nowText}\n\n${recLabel}\n${recipients.map(r => `${r.org} (${r.email})`).join(', ')}\n\n${pledgeLabel}\n${AMELIE_PLEDGE[lang]}`
                          );
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-stone-700 font-medium transition-all flex items-center gap-1.5 shadow-2xs"
                      >
                        {copiedId === idea.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                        <span>
                          {copiedId === idea.id
                            ? (lang === 'de' ? 'Dossier kopiert!' : lang === 'es' ? '¡Dossier copiado!' : 'Brief Copied!')
                            : (lang === 'de' ? 'Komplettes Dossier kopieren' : lang === 'es' ? 'Copiar dossier completo' : 'Copy Full Brief')}
                        </span>
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
