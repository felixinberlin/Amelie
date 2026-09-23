import React, { useState } from 'react';
import { PlusCircle, Copy, Check, Download, Eye, Sparkles, AlertCircle } from 'lucide-react';
import { Language, Verdict } from '../types';
import { AMELIE_PLEDGE } from '../data/manifest';
import { getTranslation } from '../i18n';

interface DosePackerProps {
  lang: Language;
  initialData?: {
    title?: string;
    oneLiner?: string;
    recipient?: string;
    verdict?: Verdict;
    problem?: string;
    whyNow?: string;
    sketch?: string;
    ticketName?: string;
    ticketCriteria?: string;
    failureMode?: string;
    priorArt?: string;
  } | null;
}

export const DosePacker: React.FC<DosePackerProps> = ({ lang, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [oneLiner, setOneLiner] = useState(initialData?.oneLiner || '');
  const [recipient, setRecipient] = useState(initialData?.recipient || '');
  const [verdict, setVerdict] = useState<Verdict>(initialData?.verdict || 'gift');
  const [problem, setProblem] = useState(initialData?.problem || '');
  const [whyNow, setWhyNow] = useState(initialData?.whyNow || '');
  const [sketch, setSketch] = useState(initialData?.sketch || '');
  const [ticketName, setTicketName] = useState(initialData?.ticketName || '');
  const [ticketCriteria, setTicketCriteria] = useState(initialData?.ticketCriteria || '');
  const [failureMode, setFailureMode] = useState(initialData?.failureMode || '');
  const [priorArt, setPriorArt] = useState(initialData?.priorArt || '');

  React.useEffect(() => {
    if (initialData) {
      if (initialData.title !== undefined) setTitle(initialData.title);
      if (initialData.oneLiner !== undefined) setOneLiner(initialData.oneLiner);
      if (initialData.recipient !== undefined) setRecipient(initialData.recipient);
      if (initialData.verdict !== undefined) setVerdict(initialData.verdict);
      if (initialData.problem !== undefined) setProblem(initialData.problem);
      if (initialData.whyNow !== undefined) setWhyNow(initialData.whyNow);
      if (initialData.sketch !== undefined) setSketch(initialData.sketch);
      if (initialData.ticketName !== undefined) setTicketName(initialData.ticketName);
      if (initialData.ticketCriteria !== undefined) setTicketCriteria(initialData.ticketCriteria);
      if (initialData.failureMode !== undefined) setFailureMode(initialData.failureMode);
      if (initialData.priorArt !== undefined) setPriorArt(initialData.priorArt);
    }
  }, [initialData]);

  const [copiedMd, setCopiedMd] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const t = getTranslation(lang);

  const getLocalizedVerdictText = (v: Verdict) => {
    if (v === 'gift') return lang === 'de' ? '🎁 verschenken' : lang === 'es' ? '🎁 regalar' : '🎁 gift';
    if (v === 'build_first') return lang === 'de' ? '🔨 erst Skelett bauen' : lang === 'es' ? '🔨 construir esqueleto primero' : '🔨 build first';
    return lang === 'de' ? '🔒 behalten' : lang === 'es' ? '🔒 conservar' : '🔒 kept';
  };

  const generateMarkdown = () => {
    const isDe = lang === 'de';
    const isEs = lang === 'es';
    const defaultTitle = isDe ? 'Unbenannte Dose' : isEs ? 'Lata sin título' : 'Untitled Tin';

    return `# ${title || defaultTitle}

**${isDe ? 'Ein Satz' : isEs ? 'Una frase' : 'One sentence'}:** ${oneLiner || '...'}

**${isDe ? 'Stand' : isEs ? 'Fecha' : 'Date'}:** ${new Date().toISOString().slice(0, 10)}
**${isDe ? 'Empfänger' : isEs ? 'Destinatario' : 'Recipient'}:** ${recipient || '...'}
**${isDe ? 'Verdikt' : isEs ? 'Veredicto' : 'Verdict'}:** ${getLocalizedVerdictText(verdict)}

---

## ${isDe ? 'Das Problem' : isEs ? 'El Problema' : 'The Problem'}
${problem || '...'}

## ${isDe ? 'Warum das jetzt geht' : isEs ? 'Por qué ahora' : 'Why Now'}
${whyNow ? whyNow.split('\n').filter(Boolean).map((line, idx) => `${idx + 1}. ${line}`).join('\n') : '...'}

## ${isDe ? 'Skizze' : isEs ? 'Esquema' : 'Sketch'}
${sketch || '...'}

## ${isDe ? 'Erster Schritt' : isEs ? 'Primer Paso' : 'First Step'}
**Ticket: ${ticketName || 'Ticket #1'}**
${ticketCriteria || '...'}

## ${isDe ? 'Wo es kippt' : isEs ? 'Punto crítico de falla' : 'Where it Breaks'}
${failureMode || '...'}

## ${isDe ? 'Wer es schon versucht hat' : isEs ? 'Intentos previos y brecha' : 'Prior Art'}
${priorArt || '...'}

---

## ${isDe ? 'Der Amélie-Pledge' : isEs ? 'El Compromiso Amélie' : 'The Amélie Pledge'}
> ${AMELIE_PLEDGE[lang]}
`;
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const downloadMarkdown = () => {
    const slug = (title || 'new-tin')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const blob = new Blob([generateMarkdown()], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${slug}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadExample = () => {
    if (lang === 'de') {
      setTitle('Kiez-Schattenkarte');
      setOneLiner('Mikroklima-Navigation für Hitzewellen: der schattigste Fußweg durch den Kiez in Echtzeit berechnet.');
      setRecipient('Kiezlabor / CityLAB Berlin · OpenStreetMap Berlin Community');
      setVerdict('gift');
      setProblem('In Berliner Hitzewellen (35°C+) vermeiden ältere Menschen und Familien das Verlassen der Wohnung. Routing-Apps (Google, Apple, Komoot) optimieren stur auf kürzeste Zeit, nie auf Baumkronen- und Gebäudeschatten.');
      setWhyNow('Offene LiDAR-Baumkronen- und 3D-Gebäudedaten des Berliner Geoportals (FIS-Broker) sind frei verfügbar.\nSonnenstands-Shader lassen sich in WebAssembly und WebGL sekundenschnell im Browser des Nutzers berechnen.');
      setSketch('Einfache Web-Karte mit A/B-Wegfinder. Drei Layer: Gebäude-Schattenwurf + Baumkronen-Abdeckung + Trinksäulen des Berliner Senats.');
      setTicketName('Schatten-Raster aus Sonnenstand und FIS-Broker-Gebäudehöhe generieren');
      setTicketCriteria('Fertig, wenn für einen Kiez-Ausschnitt (500x500m) um 14:00 Uhr die sonnenabgewandten Straßenhälften als Polygon-Maske gezeichnet werden.');
      setFailureMode('Kippt, wenn Nutzer ohne Schattenwarnung in Sackgassen geraten oder die Datenmenge 10 MB übersteigt und auf Mobilgeräten lagt.');
      setPriorArt('Shadowmap.org existiert kommerziell als globales 3D-Tool, ist aber weder Fußgänger-Navi noch lokal datensparsam optimiert.');
    } else if (lang === 'es') {
      setTitle('Mapa de Sombras Barrial');
      setOneLiner('Navegación microclimática para olas de calor: cálculo en tiempo real de la ruta peatonal con mayor sombra en el barrio.');
      setRecipient('Kiezlabor / CityLAB Berlin · Comunidad OpenStreetMap Berlín');
      setVerdict('gift');
      setProblem('Durante las olas de calor en Berlín (35°C+), personas mayores y familias evitan salir a la calle. Las aplicaciones de mapas optimizan únicamente por menor tiempo, ignorando la sombra de árboles y edificios.');
      setWhyNow('Datos abiertos LiDAR de copas de árboles y modelos 3D de edificios del geoportal FIS-Broker están disponibles públicamente.\nShaders solares en WebAssembly y WebGL pueden renderizarse en segundos en el navegador móvil.');
      setSketch('Mapa web minimalista con selector de rutas A/B. Tres capas: sombra de edificios + copas de árboles + fuentes públicas de agua potable.');
      setTicketName('Generar cuadrícula de sombra según posición solar y altura de edificios');
      setTicketCriteria('Completado cuando en un cuadrante barrial (500x500m) a las 14:00 se rendericen las mitades de calle sombreadas como polígonos.');
      setFailureMode('Falla si los peatones quedan atrapados en callejones sin salida o si el peso de los datos supera 10MB y produce retrasos en móviles.');
      setPriorArt('Shadowmap.org existe como herramienta 3D global comercial, pero no está optimizada para peatones locales ni eficiencia de datos.');
    } else {
      setTitle('Neighborhood Shade Route Finder');
      setOneLiner('Microclimate pedestrian navigation for heatwaves: computes the shadiest walking path through the city in real time.');
      setRecipient('Kiezlabor / CityLAB Berlin · OpenStreetMap Community');
      setVerdict('gift');
      setProblem('During Berlin heatwaves (35°C+), vulnerable seniors and families avoid going outside. Standard navigation apps optimize strictly for travel time, ignoring tree canopy and building shadow cover.');
      setWhyNow('Open LiDAR canopy data and 3D building outlines from the FIS-Broker open portal are freely available.\nReal-time sun azimuth shaders calculate instantaneously in browser WebGL/WebAssembly.');
      setSketch('Minimalist web map with A/B routing. Three core layers: building shadows + tree canopy coverage + public drinking fountains.');
      setTicketName('Generate shadow raster mask from sun elevation and open building heights');
      setTicketCriteria('Done when for a 500x500m neighborhood patch at 14:00, shadowed street sides render as clean polygon masks.');
      setFailureMode('Breaks if pedestrians get routed into dead ends or if geometry payloads exceed 10 MB on mobile devices.');
      setPriorArt('Shadowmap.org exists commercially for global 3D photography, but lacks pedestrian street-level microclimate routing.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Intro Header */}
      <div className="rounded-2xl bg-amber-900/5 border border-amber-800/20 p-6 md:p-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
            <PlusCircle className="w-3.5 h-3.5 text-amber-800" />
            <span>{lang === 'de' ? 'Dosen-Werkstatt' : lang === 'es' ? 'Taller de Latas' : 'Tin Workshop'}</span>
          </div>

          <button
            onClick={loadExample}
            className="text-xs text-amber-900 hover:text-amber-950 underline font-medium flex items-center gap-1 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'de' ? 'Beispiel laden (Kiez-Schattenkarte)' : lang === 'es' ? 'Cargar ejemplo (Mapa de Sombras)' : 'Load sample (Neighborhood Shade)'}</span>
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-stone-900 tracking-tight">
          {t.ui.packer_heading}
        </h2>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          {t.ui.packer_subheading}
        </p>
      </div>

      {/* Editor or Preview Toggle */}
      <div className="flex items-center justify-between bg-stone-200/60 p-1 rounded-xl border border-stone-300">
        <button
          onClick={() => setPreviewMode(false)}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            !previewMode ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {lang === 'de' ? '1. Formular ausfüllen' : lang === 'es' ? '1. Completar campos' : '1. Fill in fields'}
        </button>
        <button
          onClick={() => setPreviewMode(true)}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            previewMode ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{lang === 'de' ? '2. Amélie-Dose Vorschau' : lang === 'es' ? '2. Vista previa' : '2. Tin Preview'}</span>
        </button>
      </div>

      {!previewMode ? (
        <form onSubmit={(e) => { e.preventDefault(); setPreviewMode(true); }} className="space-y-6 bg-[#fdfbf7] p-6 md:p-8 rounded-2xl border border-stone-200 shadow-xs">
          {/* Title & Verdict */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold font-mono-code uppercase text-stone-700">
                {lang === 'de' ? 'Titel der Dose' : lang === 'es' ? 'Título de la Lata' : 'Tin Title'} *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Altbau Thermal, Neighborhood Shade..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:ring-2 focus:ring-amber-800/20 shadow-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold font-mono-code uppercase text-stone-700">
                {lang === 'de' ? 'Verdikt' : lang === 'es' ? 'Veredicto' : 'Verdict'}
              </label>
              <select
                value={verdict}
                onChange={(e) => setVerdict(e.target.value as Verdict)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:ring-2 focus:ring-amber-800/20 shadow-xs"
              >
                <option value="gift">{t.ui.verdict_gift}</option>
                <option value="build_first">{t.ui.verdict_build_first}</option>
                <option value="keep">{t.ui.verdict_keep}</option>
              </select>
            </div>
          </div>

          {/* One-Liner */}
          <div className="space-y-1">
            <label className="text-xs font-bold font-mono-code uppercase text-stone-700">
              {lang === 'de' ? 'Ein Satz (One-Liner)' : lang === 'es' ? 'Una frase resumen' : 'One Sentence (One-Liner)'} *
            </label>
            <input
              type="text"
              required
              value={oneLiner}
              onChange={(e) => setOneLiner(e.target.value)}
              placeholder={lang === 'de' ? 'In einem einzigen, poetisch-präzisen Satz zusammengefasst...' : lang === 'es' ? 'Resumido en una sola frase, poéticamente precisa...' : 'Summarized in a single, poetically precise sentence...'}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:ring-2 focus:ring-amber-800/20 shadow-xs"
            />
          </div>

          {/* Recipient */}
          <div className="space-y-1">
            <label className="text-xs font-bold font-mono-code uppercase text-stone-700">
              {t.ui.recipient} *
            </label>
            <input
              type="text"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. CityLAB Berlin, SSDeV, OpenStreetMap..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:ring-2 focus:ring-amber-800/20 shadow-xs"
            />
          </div>

          {/* Problem */}
          <div className="space-y-1">
            <label className="text-xs font-bold font-mono-code uppercase text-stone-700">
              {lang === 'de' ? 'Das Problem' : lang === 'es' ? 'El Problema' : 'The Problem'} *
            </label>
            <textarea
              rows={3}
              required
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder={lang === 'de' ? 'Wo tut es weh? Warum leidet jemand darunter? Woran scheitern bestehende Alternativen?' : lang === 'es' ? '¿Dónde duele? ¿Por qué sufre alguien? ¿Por qué fallan las herramientas actuales?' : 'Where does friction occur? Why do people suffer? Why do current tools fall short?'}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:ring-2 focus:ring-amber-800/20 shadow-xs"
            />
          </div>

          {/* Why Now */}
          <div className="space-y-1">
            <label className="text-xs font-bold font-mono-code uppercase text-stone-700">
              {lang === 'de' ? 'Warum das jetzt geht (je Zeile ein Knick)' : lang === 'es' ? 'Por qué ahora (un avance por línea)' : 'Why Now (one breakthrough per line)'}
            </label>
            <textarea
              rows={2}
              value={whyNow}
              onChange={(e) => setWhyNow(e.target.value)}
              placeholder={lang === 'de' ? 'Neue APIs, LLM-Kostensturz, Sensorpreise, offene Geodaten...' : lang === 'es' ? 'Nuevas APIs abiertas, caída del coste de los modelos, precio de sensores, geodatos abiertos...' : 'New open APIs, model cost reductions, sensor prices, open geodata...'}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:ring-2 focus:ring-amber-800/20 shadow-xs"
            />
          </div>

          {/* Sketch */}
          <div className="space-y-1">
            <label className="text-xs font-bold font-mono-code uppercase text-stone-700">
              {lang === 'de' ? 'Skizze & UI/Architektur-Idee' : lang === 'es' ? 'Esquema y concepto UI/arquitectura' : 'Sketch & Architecture Concept'}
            </label>
            <textarea
              rows={2}
              value={sketch}
              onChange={(e) => setSketch(e.target.value)}
              placeholder={lang === 'de' ? 'Wie sieht der Bildschirm aus? Welche drei Komponenten kommunizieren?' : lang === 'es' ? '¿Cómo se ve la interfaz? ¿Qué componentes se comunican?' : 'What does the interface look like? Which components communicate?'}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:ring-2 focus:ring-amber-800/20 shadow-xs"
            />
          </div>

          {/* Ticket #1 */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
            <span className="text-xs font-bold font-mono-code uppercase text-emerald-900 block">
              {lang === 'de' ? 'Erster Schritt (Ticket #1)' : lang === 'es' ? 'Primer Paso (Ticket #1)' : 'First Step (Ticket #1)'}
            </span>
            <div className="space-y-2">
              <input
                type="text"
                value={ticketName}
                onChange={(e) => setTicketName(e.target.value)}
                placeholder={lang === 'de' ? 'Ticket-Titel (z.B. Lokalen Parser auf Test-HTML ansetzen)' : lang === 'es' ? 'Título del ticket (p. ej., construir un parser de ráster mínimo)' : 'Ticket title (e.g., build minimal raster parser)'}
                className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-stone-900 text-xs focus:ring-2 focus:ring-emerald-600/20"
              />
              <input
                type="text"
                value={ticketCriteria}
                onChange={(e) => setTicketCriteria(e.target.value)}
                placeholder={lang === 'de' ? 'Fertig, wenn: (Konkretes, überprüfbares Kriterium in 2 Tagen)' : lang === 'es' ? 'Terminado cuando: (hito concreto y comprobable en 2 días)' : 'Done when: (Concrete, testable milestone in 2 days)'}
                className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-stone-900 text-xs focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>
          </div>

          {/* Failure Mode & Prior Art */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold font-mono-code uppercase text-stone-700">
                {lang === 'de' ? 'Wo es kippt (Failure Mode)' : lang === 'es' ? 'Punto crítico de falla' : 'Where It Breaks (Failure Mode)'}
              </label>
              <textarea
                rows={2}
                value={failureMode}
                onChange={(e) => setFailureMode(e.target.value)}
                placeholder={lang === 'de' ? 'Die Bruchstelle: Woran sterben solche Projekte meistens?' : lang === 'es' ? 'El punto de ruptura: ¿qué hace fracasar proyectos así?' : 'The breaking point: what makes such projects fail?'}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs focus:ring-2 focus:ring-amber-800/20 shadow-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold font-mono-code uppercase text-stone-700">
                {lang === 'de' ? 'Wer es schon versucht hat (Prior Art)' : lang === 'es' ? 'Intentos previos (Prior Art)' : 'Prior Art'}
              </label>
              <textarea
                rows={2}
                value={priorArt}
                onChange={(e) => setPriorArt(e.target.value)}
                placeholder={lang === 'de' ? 'Bestehende Versuche, Repos, und warum deine Lücke noch frei ist.' : lang === 'es' ? 'Repositorios existentes, intentos previos y por qué tu nicho sigue libre.' : 'Existing repos, prior attempts, and why your niche remains unoccupied.'}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs focus:ring-2 focus:ring-amber-800/20 shadow-xs"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              {lang === 'de' ? 'Vorschau & Export →' : lang === 'es' ? 'Vista previa y Exportar →' : 'Preview & Export →'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6 bg-[#fdfbf7] p-6 md:p-8 rounded-2xl border border-stone-200 shadow-xs">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
            <span className="text-xs font-mono-code text-stone-600">
              {lang === 'de' ? 'Amélie-Einseiter ist bereit zum Verschenken' : lang === 'es' ? 'Hoja única Amélie lista para regalar' : 'Amélie One-Pager ready to gift'}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={copyMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-800 transition-colors shadow-2xs"
              >
                {copiedMd ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">{lang === 'de' ? 'Kopiert!' : lang === 'es' ? '¡Copiado!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-600" />
                    <span>{lang === 'de' ? 'Markdown kopieren' : lang === 'es' ? 'Copiar Markdown' : 'Copy Markdown'}</span>
                  </>
                )}
              </button>

              <button
                onClick={downloadMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-xs font-semibold text-white transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'de' ? '.md herunterladen' : lang === 'es' ? 'Descargar .md' : 'Download .md'}</span>
              </button>

              <button
                onClick={() => setPreviewMode(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              >
                {lang === 'de' ? 'Weiter bearbeiten' : lang === 'es' ? 'Seguir editando' : 'Edit further'}
              </button>
            </div>
          </div>

          {/* Formatted Markdown Box */}
          <pre className="p-6 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm font-mono-code text-stone-800 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px]">
            {generateMarkdown()}
          </pre>
        </div>
      )}
    </div>
  );
};
