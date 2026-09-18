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
            {lang === 'de' ? 'FREI (Lücke offen)' : 'OPEN GAP'}
          </span>
        );
      case 'beim_empfaenger':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono-code font-bold text-xs border border-amber-300">
            {lang === 'de' ? 'BEIM EMPFÄNGER' : 'AT RECIPIENT'}
          </span>
        );
      case 'wird_besetzt':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 font-mono-code font-bold text-xs border border-orange-300">
            {lang === 'de' ? 'WIRD BESETZT' : 'OCCUPYING NOW'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono-code text-xs border border-stone-300">
            <ShieldAlert className="w-3 h-3 text-stone-500" />
            {lang === 'de' ? 'DICHT (Besetzt)' : 'SATURATED'}
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
              <span>{lang === 'de' ? 'Schritt 0,5: Prüf-Playbook & Besetzungsatlas' : 'Step 0.5: Search Playbook & Saturation Atlas'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-stone-900 tracking-tight">
              {lang === 'de' ? 'Vor dem Schreiben suchen. Die teuerste Lektion.' : 'Search before writing. The most valuable lesson.'}
            </h2>
            <p className="text-sm text-stone-600 mt-1.5 max-w-3xl leading-relaxed">
              {lang === 'de'
                ? 'Von 19 Ideen waren 4 bereits gebaut und 5 enger als gedacht. Eine Stunde Recherche nach der 4-Schritte-Sequenz spart Tage verbrannter Arbeit und verhindert peinliche Erstansprachen.'
                : 'Out of 19 initial ideas, 4 were already built and 5 were much narrower than anticipated. One hour following the 4-step sequence prevents wasted effort and burned first contacts.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-xl border border-stone-200/80 self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab('atlas')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'atlas' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🗺️ {lang === 'de' ? 'Besetzungsatlas' : 'Saturation Atlas'}
            </button>
            <button
              onClick={() => setActiveSubTab('search_gen')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'search_gen' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🔍 {lang === 'de' ? '4-Schritte-Suchgenerator' : '4-Step Search Generator'}
            </button>
            <button
              onClick={() => setActiveSubTab('bisociation')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'bisociation' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ⚡ {lang === 'de' ? 'Bisoziations-Studio' : 'Bisociation Studio'}
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
                {lang === 'de' ? 'Die Amélie-Faustregel:' : 'The Golden Rule of Amélie:'}
              </span>
              <span className="text-amber-900/90 text-xs leading-relaxed">
                {lang === 'de'
                  ? '„Wenn Endnutzer dafür zahlen würden oder eine Stadt es als Pressemitteilung verkaufen kann, existiert es. Frei ist, was ein Fachgremium als PDF veröffentlicht und niemand je in Software gegossen hat."'
                  : '"If end users would pay for it or a city can announce it in a press release, it already exists. What is truly free is what expert committees publish as a PDF and no one has ever turned into software."'}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 font-mono-code font-bold text-[11px] shrink-0">
              Stand: September 2026
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-200 font-mono-code uppercase text-stone-600">
                  <th className="py-3 px-4 font-semibold">{lang === 'de' ? 'Domäne / Problemfeld' : 'Domain / Problem Field'}</th>
                  <th className="py-3 px-4 font-semibold">{lang === 'de' ? 'Status' : 'Status'}</th>
                  <th className="py-3 px-4 font-semibold">{lang === 'de' ? 'Recherche-Belege & Begründung' : 'Research Evidence & Reason'}</th>
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
              {lang === 'de' ? '4-Schritte-Prüfsequenz für neue Ideen' : 'The 4-Step Verification Sequence'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === 'de'
                ? 'Geben Sie das Thema und den anvisierten Empfänger ein. Amélie erzeugt die 4 methodischen Suchanfragen nach dem Playbook. Klicken Sie auf „Suchen", um Google direkt zu öffnen.'
                : 'Enter your idea topic and intended recipient. Amélie generates the 4 exact search queries following the playbook.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1">
                  {lang === 'de' ? 'Thema / Funktion:' : 'Topic / Core Action:'}
                </label>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="z.B. Wildbienen Nisthilfen, Vogelschutz Glas, Grabstein"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1">
                  {lang === 'de' ? 'Anvisierter Empfänger / Organisation:' : 'Target Recipient / Mandate:'}
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
                title: lang === 'de' ? '1. <Empfänger> KI' : '1. <Recipient> AI',
                sub: lang === 'de' ? 'Billigster Kill: Hat der Empfänger das schon selbst?' : 'Cheapest kill: Does recipient already have it?',
                query: `site:${recipientInput.toLowerCase().replace(/\s+/g, '')}.de KI OR AI OR App OR Prototyp`,
                rawQuery: `${recipientInput} KI AI Prototyp ${topicInput}`,
              },
              {
                step: 2,
                title: lang === 'de' ? '2. Deutsch, Funktionswörter' : '2. German Function Words',
                sub: lang === 'de' ? 'Was das Ding tut (Leitfaden, Bewertungsverfahren)' : 'What it does (manual guidelines, scoring rubric)',
                query: `"${topicInput}" Bewertungsverfahren OR Punktesystem OR Leitfaden OR "Auswertung dauert"`,
                rawQuery: `${topicInput} Bewertungsverfahren Punktesystem Leitfaden`,
              },
              {
                step: 3,
                title: lang === 'de' ? '3. Englisch, Produktwörter' : '3. English Product Terms',
                sub: lang === 'de' ? 'Findet internationale & kommerzielle Konkurrenz' : 'Catches international commercial products',
                query: `"${topicInput}" app AI tool 2025 OR 2026`,
                rawQuery: `${topicInput} app AI tool software 2026`,
              },
              {
                step: 4,
                title: lang === 'de' ? '4. Forum & Nischen-Community' : '4. Forum & Niche Communities',
                sub: lang === 'de' ? 'Findet Indie-Apps unter dem SEO-Radar' : 'Catches unindexed indie apps on forums/GitHub',
                query: `site:github.com OR site:discourse.org "${topicInput}"`,
                rawQuery: `${topicInput} github discourse forum`,
              },
            ].map((q) => (
              <div key={q.step} className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono-code text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Schritt {q.step}
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
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100"
                  >
                    {copiedQuery === `query-${q.step}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedQuery === `query-${q.step}` ? 'Kopiert!' : 'Kopieren'}</span>
                  </button>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(q.rawQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs"
                  >
                    <span>In Google suchen</span>
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
              {lang === 'de' ? 'Lacunar Bisociation: Frame A + Frame B Collider' : 'Lacunar Bisociation Studio'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === 'de'
                ? 'Kombinieren Sie einen realen Engpass einer Organisation (Frame A) mit einem konkreten technischen Mechanismus (Frame B). Der Schnittpunkt erzeugt lakunäre Lücken, die sich als CC0-Dose verschenken lassen.'
                : 'Collide an authentic organizational bottleneck (Frame A) with an emerging technical mechanism (Frame B) to expose unserved gaps.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Frame A: Anchor */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase font-mono-code text-stone-600 block">
                  Frame A: Anker (Organisation mit Mandat)
                </span>
                <div className="space-y-2">
                  {anchorFrames.map((a, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedAnchor(i)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        selectedAnchor === i
                          ? 'border-amber-800 bg-amber-50/80 font-bold text-stone-950 shadow-xs'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-amber-900">{a.orgDe}</div>
                      <div className="text-xs font-semibold mt-0.5">{a.titleDe}</div>
                      <div className="text-[11px] text-stone-500 font-normal mt-1 leading-snug">{a.problemDe}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame B: Collider */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase font-mono-code text-stone-600 block">
                  Frame B: Kollisions-Mechanismus
                </span>
                <div className="space-y-2">
                  {colliderFrames.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedCollider(i)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        selectedCollider === i
                          ? 'border-amber-800 bg-amber-50/80 font-bold text-stone-950 shadow-xs'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="text-xs font-semibold">{c.titleDe}</div>
                      <div className="text-[11px] text-stone-500 font-normal mt-1 leading-snug">{c.techDe}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Collision Result Card */}
            <div className="mt-6 p-5 rounded-2xl bg-stone-900 text-white border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code text-amber-400 uppercase tracking-wider">
                  Erzeugte Amélie-Kandidatin
                </span>
                <span className="text-xs font-mono-code bg-stone-800 px-2 py-0.5 rounded text-stone-300">
                  Lacunar Bisociation
                </span>
              </div>

              <h4 className="text-lg font-bold font-serif-title text-amber-100">
                {anchorFrames[selectedAnchor].titleDe} × {colliderFrames[selectedCollider].titleDe}
              </h4>

              <p className="text-xs text-stone-300 leading-relaxed">
                <strong className="text-white">Empfänger:</strong> {anchorFrames[selectedAnchor].orgDe}
                <br />
                <strong className="text-white">Der Zuschnitt:</strong> {anchorFrames[selectedAnchor].problemDe}{' '}
                Die Lösung nutzt {colliderFrames[selectedCollider].techDe}
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
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold shadow-xs transition-colors"
                  >
                    <span>In Pipeline übernehmen</span>
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
