import React, { useState } from 'react';
import { Search, Compass, BookOpen, ExternalLink, ShieldCheck, ShieldAlert, Sparkles, Filter, Copy, Check, ArrowRight } from 'lucide-react';
import { Language, CandidateIdea } from '../types';

interface SearchPlaybookStudioProps {
  lang: Language;
  onSendToPipeline?: (candidate: Partial<CandidateIdea>) => void;
}

export const SearchPlaybookStudio: React.FC<SearchPlaybookStudioProps> = ({
  lang,
  onSendToPipeline,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'atlas' | 'search_gen' | 'bisociation'>('atlas');
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);

  // Search Query Generator State
  const [topicInput, setTopicInput] = useState<string>('Wildbienen Nisthilfen');
  const [recipientInput, setRecipientInput] = useState<string>('Thünen Institut');

  // Bisociation Studio State
  const [selectedAnchor, setSelectedAnchor] = useState<number>(0);
  const [selectedCollider, setSelectedCollider] = useState<number>(0);

  const anchorFrames = [
    {
      titleDe: 'Naturschutz & Monitoring-Flaschenhals',
      titleEn: 'Biodiversity Monitoring Bottlenecks',
      orgDe: 'Thünen-Institut / MonViA',
      orgEn: 'Thuenen Institute for Biodiversity',
      problemDe: 'Freiwillige senden tausende Fotos von Niströhren ein. Forscher prüfen 90 min manuell pro Block.',
      problemEn: 'Volunteers submit thousands of nesting photos. Researchers spend 90 mins manually per board.',
    },
    {
      titleDe: 'Behördliche Bauprüfungen & Schemata',
      titleEn: 'Regulatory Construction & Bird Hazards',
      orgDe: 'LAG Vogelschutzwarten / NABU',
      orgEn: 'State Bird Conservation Centers',
      problemDe: 'Offizieller Prüfleitfaden für Vogelschlag existiert nur als 30-Seiten PDF. Bauämter rechnen mühsam per Hand.',
      problemEn: 'Official bird-strike testing guide exists only as a 30-page PDF document. Authorities calculate by hand.',
    },
    {
      titleDe: 'Historische Archive & Grabsteine',
      titleEn: 'Eroded Historical Inscriptions',
      orgDe: 'CompGen e.V.',
      orgEn: 'Computer Genealogy Association',
      problemDe: 'LLM Vision-Modelle halluzinieren Buchstaben bei verwittertem Sandstein.',
      problemEn: 'Vision LLMs hallucinate fictional text on eroded historical sandstone.',
    },
    {
      titleDe: 'Städtischer Lärm & Ruhefenster',
      titleEn: 'Urban Noise & Quiet Windows',
      orgDe: 'CityLAB Berlin / Noise-Planet',
      orgEn: 'CityLAB Berlin / Noise-Planet',
      problemDe: 'Lärmkarten zeigen nur Jahresmittelwerte. Mieter wollen wissen, wann die Straße wirklich leise ist.',
      problemEn: 'Noise maps only show yearly averages. Tenants want to know the exact quiet windows.',
    },
  ];

  const colliderFrames = [
    {
      titleDe: 'Smartphone-RTI & Streiflicht',
      titleEn: 'Smartphone RTI & Grazing Light Relief',
      techDe: 'Handy-Taschenlampe flach anhalten (5°-15°), 3 Fotos, Differenzbild erzeugt messbare Schatten.',
      techEn: 'Hold phone flashlight flat at grazing angle (5°-15°), 3 photos, relief subtraction reveals incisions.',
    },
    {
      titleDe: 'Deterministischer Formelrechner (No-AI)',
      titleEn: 'Deterministic Formula Calculator (No-AI)',
      techDe: 'Reine Web-Oberfläche, 3 Schieberegler, direkte Anwendung des PDF-Punktesystems ohne Serverkosten.',
      techEn: 'Pure client-side UI, 3 sliders, direct computation of regulatory points with zero server cost.',
    },
    {
      titleDe: 'Vorsortierung vor KI (Bounding-Box Filter)',
      titleEn: 'Rule-Based Pre-sorter before AI Inference',
      techDe: 'Leere Röhren (95%) per Kontrast verwerfen. Nur belegte Röhren an Mensch oder Modell weiterreichen.',
      techEn: 'Discard empty nesting holes (95%) by contrast. Only feed occupied holes to human experts.',
    },
    {
      titleDe: 'Datensparsame dB-Aggregation am Gerät',
      titleEn: 'Privacy-First On-Device dB Level Aggregation',
      techDe: 'Mikrofon misst ausschließlich Dezibel, niemals Audiosignal. Daten verlassen Gerät nur aggregiert.',
      techEn: 'Microphone only samples numeric decibels, never raw audio. Leaves device as anonymous aggregated histograms.',
    },
  ];

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(id);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  // Besetzungsatlas Data
  const atlasRows = [
    {
      fieldDe: 'Naturschutz-Vollzug (Schemata, Monitoring)',
      fieldEn: 'Conservation Enforcement & Monitoring',
      status: 'frei',
      evidenceDe: 'Vogelschlag-Ampel (LAG-VSW), Wildbienen-Vorsortierer (Thünen). Schemata existieren als PDFs, Software fehlt.',
      evidenceEn: 'Bird glass hazard score (LAG-VSW), bee nesting pre-sorter (Thünen). Standards exist as PDFs, zero software.',
    },
    {
      fieldDe: 'Kulturerbe-Physik (Licht & Topographie)',
      fieldEn: 'Cultural Heritage Physics (Light & Relief)',
      status: 'frei',
      evidenceDe: 'Smartphone-RTI (Streiflicht) existiert nur als akademische Paper auf arXiv/ECCV, kein Laien-Tool.',
      evidenceEn: 'Smartphone RTI only exists as academic papers on arXiv/ECCV, no usable non-expert tool.',
    },
    {
      fieldDe: 'Grabstein-Transkription',
      fieldEn: 'Tombstone Transcription',
      status: 'beim_empfaenger',
      evidenceDe: 'CompGen-Werkstattbericht Mai 2026: eigene KI im Einsatz, Problem sind Halluzinationen bei Verwitterung.',
      evidenceEn: 'CompGen workshop report May 2026: internal AI already active, main hurdle is hallucinations on weathered stone.',
    },
    {
      fieldDe: 'Barrierefreiheit per Foto',
      fieldEn: 'Accessibility via Photography',
      status: 'beim_empfaenger',
      evidenceDe: 'HIIG & Wheelmap haben 2023 eigenen Datensatz trainiert; kein Raum für externe Generic-Apps.',
      evidenceEn: 'HIIG & Wheelmap trained proprietary model in 2023; no space for generic external apps.',
    },
    {
      fieldDe: 'Repair Cafés + KI-Diagnose',
      fieldEn: 'Repair Cafés + AI Diagnostics',
      status: 'wird_besetzt',
      evidenceDe: 'Repair Café International & robotfreak/repair-cafe besetzen die Domäne aktuell aktiv.',
      evidenceEn: 'Repair Café International & robotfreak/repair-cafe are actively occupying this niche.',
    },
    {
      fieldDe: 'Dev-Tooling, MCP, Git-Historie',
      fieldEn: 'Dev Tooling, MCP, Git Archaeology',
      status: 'dicht',
      evidenceDe: 'git-archaeologist, Home-Network MCP. Fenster schließt innerhalb von Monaten.',
      evidenceEn: 'git-archaeologist, Home-Network MCP. Window closes within months.',
    },
    {
      fieldDe: 'Mieter-Tools (Mängel, Schimmel, Nebenkosten)',
      fieldEn: 'Tenant Tools (Defects, Mold, Rent costs)',
      status: 'dicht_kommerziell',
      evidenceDe: 'Miet-Akte, SchimmelScan, MietKlar haben den Markt mit bezahltem SEO besetzt.',
      evidenceEn: 'Miet-Akte, SchimmelScan, MietKlar heavily occupy market with paid SEO.',
    },
    {
      fieldDe: 'Hitze- & Schatten-Routing',
      fieldEn: 'Urban Heat & Shadow Routing',
      status: 'dicht_forschung',
      evidenceDe: 'HEAL/shaded.ors, Shadowmap, Berliner Kühle-Orte-Karten decken alles ab.',
      evidenceEn: 'HEAL/shaded.ors, Shadowmap, official Berlin Cool Places maps cover everything.',
    },
    {
      fieldDe: 'Balkonsolar-Planung',
      fieldEn: 'Balcony Solar Planning',
      status: 'dicht',
      evidenceDe: 'Horisol (Juli 2026), HTW-Simulator, PVGIS.',
      evidenceEn: 'Horisol (July 2026), HTW Simulator, PVGIS.',
    },
    {
      fieldDe: 'Chor-SATB-Stimmtrennung',
      fieldEn: 'Choir SATB Vocal Separation',
      status: 'dicht',
      evidenceDe: 'MVSEP SATB Modell, ChoirMate.',
      evidenceEn: 'MVSEP SATB model, ChoirMate.',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'frei':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono-code font-bold text-xs border border-emerald-300">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            {lang === 'de' ? 'FREI (Lücke offen)' : lang === 'es' ? 'LIBRE (Brecha abierta)' : 'OPEN GAP'}
          </span>
        );
      case 'beim_empfaenger':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono-code font-bold text-xs border border-amber-300">
            {lang === 'de' ? 'BEIM EMPFÄNGER' : lang === 'es' ? 'EN EL DESTINATARIO' : 'AT RECIPIENT'}
          </span>
        );
      case 'wird_besetzt':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 font-mono-code font-bold text-xs border border-orange-300">
            {lang === 'de' ? 'WIRD BESETZT' : lang === 'es' ? 'OCUPÁNDOSE AHORA' : 'OCCUPYING NOW'}
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
              <span>{lang === 'de' ? 'Schritt 0,5: Prüf-Playbook & Besetzungsatlas' : lang === 'es' ? 'Paso 0.5: Playbook de búsqueda y atlas de saturación' : 'Step 0.5: Search Playbook & Saturation Atlas'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-stone-900 tracking-tight">
              {lang === 'de' ? 'Vor dem Schreiben suchen. Die teuerste Lektion.' : lang === 'es' ? 'Buscar antes de escribir. La lección más valiosa.' : 'Search before writing. The most valuable lesson.'}
            </h2>
            <p className="text-sm text-stone-600 mt-1.5 max-w-3xl leading-relaxed">
              {lang === 'de'
                ? 'Von 19 Ideen waren 4 bereits gebaut und 5 enger als gedacht. Eine Stunde Recherche nach der 4-Schritte-Sequenz spart Tage verbrannter Arbeit und verhindert peinliche Erstansprachen.'
                : lang === 'es'
                ? 'De 19 ideas iniciales, 4 ya estaban construidas y 5 eran mucho más estrechas de lo pensado. Una hora con la secuencia de 4 pasos ahorra días de trabajo estéril y evita contactos incómodos.'
                : 'Out of 19 initial ideas, 4 were already built and 5 were much narrower than anticipated. One hour following the 4-step sequence prevents wasted effort and burned first contacts.'}
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
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-amber-900 text-sm block">
                {lang === 'de' ? 'Die Amélie-Faustregel:' : lang === 'es' ? 'La regla de oro de Amélie:' : 'The Golden Rule of Amélie:'}
              </span>
              <span className="text-amber-900/90 text-xs leading-relaxed">
                {lang === 'de'
                  ? '„Wenn Endnutzer dafür zahlen würden oder eine Stadt es als Pressemitteilung verkaufen kann, existiert es. Frei ist, was ein Fachgremium als PDF veröffentlicht und niemand je in Software gegossen hat."'
                  : lang === 'es'
                  ? '«Si los usuarios finales pagarían por ello o una ciudad puede anunciarlo en un comunicado de prensa, ya existe. Lo que está verdaderamente libre es lo que un comité de expertos publica como PDF y nadie ha convertido en software».'
                  : '"If end users would pay for it or a city can announce it in a press release, it already exists. What is truly free is what expert committees publish as a PDF and no one has ever turned into software."'}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 font-mono-code font-bold text-[11px] shrink-0">
              {lang === 'de' ? 'Stand: September 2026' : lang === 'es' ? 'Fecha: Septiembre 2026' : 'Status: September 2026'}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-200 font-mono-code uppercase text-stone-600">
                  <th className="py-3 px-4 font-semibold">{lang === 'de' ? 'Domäne / Problemfeld' : lang === 'es' ? 'Dominio / Campo problemático' : 'Domain / Problem Field'}</th>
                  <th className="py-3 px-4 font-semibold">{lang === 'de' ? 'Status' : lang === 'es' ? 'Estado' : 'Status'}</th>
                  <th className="py-3 px-4 font-semibold">{lang === 'de' ? 'Recherche-Belege & Begründung' : lang === 'es' ? 'Evidencia de investigación' : 'Research Evidence & Reason'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80">
                {atlasRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-stone-900">
                      {lang === 'de' ? row.fieldDe : row.fieldEn}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(row.status)}</td>
                    <td className="py-3.5 px-4 text-stone-600 leading-relaxed">
                      {lang === 'de' ? row.evidenceDe : row.evidenceEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SUBTAB 2: 4-STEP SEARCH GENERATOR */}
      {/* ------------------------------------------------------------------ */}
      {activeSubTab === 'search_gen' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif-title font-bold text-stone-900 text-lg">
              {lang === 'de' ? '4-Schritte-Prüfsequenz für neue Ideen' : lang === 'es' ? 'Secuencia de verificación de 4 pasos' : 'The 4-Step Verification Sequence'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === 'de'
                ? 'Geben Sie das Thema und den anvisierten Empfänger ein. Amélie erzeugt die 4 methodischen Suchanfragen nach dem Playbook. Klicken Sie auf „Suchen", um Google direkt zu öffnen.'
                : lang === 'es'
                ? 'Ingrese el tema y la organización destinataria. Amélie genera las 4 búsquedas metódicas según el playbook.'
                : 'Enter your idea topic and intended recipient. Amélie generates the 4 exact search queries following the playbook.'}
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
                  placeholder={lang === 'de' ? 'z.B. Wildbienen Nisthilfen, Vogelschutz Glas' : lang === 'es' ? 'p.ej. Refugios de abejas, impacto de aves en cristal' : 'e.g. Wild bee nesting aids, bird glass collision'}
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

          {/* Generated 4 Queries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                step: 1,
                title: lang === 'de' ? '1. <Empfänger> KI' : lang === 'es' ? '1. <Destinatario> IA' : '1. <Recipient> AI',
                sub: lang === 'de' ? 'Billigster Kill: Hat der Empfänger das schon selbst?' : lang === 'es' ? 'Filtro inicial: ¿El destinatario ya lo tiene internamente?' : 'Cheapest kill: Does recipient already have it?',
                query: `site:${recipientInput.toLowerCase().replace(/\s+/g, '')}.de KI OR AI OR App OR Prototyp`,
                rawQuery: `${recipientInput} KI AI Prototyp ${topicInput}`,
              },
              {
                step: 2,
                title: lang === 'de' ? '2. Deutsch, Funktionswörter' : lang === 'es' ? '2. Palabras funcionales y normativas' : '2. German Function Words',
                sub: lang === 'de' ? 'Was das Ding tut (Leitfaden, Bewertungsverfahren)' : lang === 'es' ? 'Qué hace (guías, método de evaluación)' : 'What it does (manual guidelines, scoring rubric)',
                query: `"${topicInput}" Bewertungsverfahren OR Punktesystem OR Leitfaden OR "Auswertung dauert"`,
                rawQuery: `${topicInput} Bewertungsverfahren Punktesystem Leitfaden`,
              },
              {
                step: 3,
                title: lang === 'de' ? '3. Englisch, Produktwörter' : lang === 'es' ? '3. Términos de producto en inglés' : '3. English Product Terms',
                sub: lang === 'de' ? 'Findet internationale & kommerzielle Konkurrenz' : lang === 'es' ? 'Competidores comerciales internacionales' : 'Catches international commercial products',
                query: `"${topicInput}" app AI tool 2025 OR 2026`,
                rawQuery: `${topicInput} app AI tool software 2026`,
              },
              {
                step: 4,
                title: lang === 'de' ? '4. Forum & Nischen-Community' : lang === 'es' ? '4. Foros y comunidades de nicho' : '4. Forum & Niche Communities',
                sub: lang === 'de' ? 'Findet Indie-Apps unter dem SEO-Radar' : lang === 'es' ? 'Descubre apps indie fuera del radar SEO' : 'Catches unindexed indie apps on forums/GitHub',
                query: `site:github.com OR site:discourse.org "${topicInput}"`,
                rawQuery: `${topicInput} github discourse forum`,
              },
            ].map((q) => (
              <div key={q.step} className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono-code text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {lang === 'de' ? 'Schritt' : lang === 'es' ? 'Paso' : 'Step'} {q.step}
                  </span>
                  <span className="text-[11px] text-stone-500">{q.sub}</span>
                </div>
                <h4 className="font-serif-title font-bold text-stone-900 text-sm">{q.title}</h4>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 font-mono-code text-xs text-stone-800 break-all select-all">
                  {q.rawQuery}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => copyText(q.rawQuery, `query-${q.step}`)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    {copiedQuery === `query-${q.step}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedQuery === `query-${q.step}` ? (lang === 'de' ? 'Kopiert!' : lang === 'es' ? '¡Copiado!' : 'Copied!') : (lang === 'de' ? 'Kopieren' : lang === 'es' ? 'Copiar' : 'Copy')}</span>
                  </button>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(q.rawQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs"
                  >
                    <span>{lang === 'de' ? 'In Google suchen' : lang === 'es' ? 'Buscar en Google' : 'Search on Google'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SUBTAB 3: BISOCIATION STUDIO */}
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
                <span className="text-xs font-bold uppercase font-mono-code text-stone-600 block">
                  {lang === 'de' ? 'Frame A: Anker (Organisation mit Mandat)' : lang === 'es' ? 'Marco A: Ancla (Organización con mandato)' : 'Frame A: Anchor (Mandate Organization)'}
                </span>
                <div className="space-y-2">
                  {anchorFrames.map((a, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedAnchor(i)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedAnchor === i
                          ? 'border-amber-800 bg-amber-50/80 font-bold text-stone-950 shadow-xs'
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
                <span className="text-xs font-bold uppercase font-mono-code text-stone-600 block">
                  {lang === 'de' ? 'Frame B: Kollisions-Mechanismus' : lang === 'es' ? 'Marco B: Mecanismo de colisión' : 'Frame B: Collision Mechanism'}
                </span>
                <div className="space-y-2">
                  {colliderFrames.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedCollider(i)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedCollider === i
                          ? 'border-amber-800 bg-amber-50/80 font-bold text-stone-950 shadow-xs'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="text-xs font-semibold">{lang === 'de' ? c.titleDe : c.titleEn}</div>
                      <div className="text-[11px] text-stone-500 font-normal mt-1 leading-snug">{lang === 'de' ? c.techDe : c.techEn}</div>
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
                  Lacunar Bisociation
                </span>
              </div>

              <h4 className="text-lg font-bold font-serif-title text-amber-100">
                {lang === 'de' ? anchorFrames[selectedAnchor].titleDe : anchorFrames[selectedAnchor].titleEn} × {lang === 'de' ? colliderFrames[selectedCollider].titleDe : colliderFrames[selectedCollider].titleEn}
              </h4>

              <p className="text-xs text-stone-300 leading-relaxed">
                <strong className="text-white">{lang === 'de' ? 'Empfänger: ' : lang === 'es' ? 'Destinatario: ' : 'Recipient: '}</strong> {lang === 'de' ? anchorFrames[selectedAnchor].orgDe : anchorFrames[selectedAnchor].orgEn}
                <br />
                <strong className="text-white">{lang === 'de' ? 'Der Zuschnitt: ' : lang === 'es' ? 'El enfoque: ' : 'The Angle: '}</strong> {lang === 'de' ? anchorFrames[selectedAnchor].problemDe : anchorFrames[selectedAnchor].problemEn}{' '}
                {lang === 'de' ? 'Die Lösung nutzt ' : lang === 'es' ? 'La solución utiliza ' : 'The solution utilizes '}
                {lang === 'de' ? colliderFrames[selectedCollider].techDe : colliderFrames[selectedCollider].techEn}
              </p>

              <div className="pt-2 flex items-center justify-end">
                {onSendToPipeline && (
                  <button
                    onClick={() =>
                      onSendToPipeline({
                        title: `${anchorFrames[selectedAnchor].titleDe} Tool`,
                        recipientDe: anchorFrames[selectedAnchor].orgDe,
                        recipientEn: anchorFrames[selectedAnchor].orgEn,
                        conceptDe: `${anchorFrames[selectedAnchor].problemDe} Gelöst über ${colliderFrames[selectedCollider].titleDe}.`,
                        conceptEn: `${anchorFrames[selectedAnchor].problemEn} Solved via ${colliderFrames[selectedCollider].titleEn}.`,
                        status: 'unklar',
                        suggestedVerdict: 'gift',
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold shadow-xs transition-colors cursor-pointer"
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
