import { Link, useLocation, useNavigate } from 'react-router-dom';
import { chapterPath, dosePath, withPreferences } from '../routing/routes';
import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  ArrowLeft,
  Copy,
  Check,
  Download,
  Printer,
  Maximize2,
  ExternalLink,
  Gift,
  Hammer,
  Lock,
  Sparkles,
  Brain,
  AlertTriangle,
  Lightbulb,
  Target,
  Wrench,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Share2,
  Mail,
  Send,
  FileText,
  Compass,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Play,
} from 'lucide-react';
import { DoseItem, Language, Verdict } from '../types';
import { AMELIE_PLEDGE } from '../data/manifest';
import { getTranslation, getLocalizedTitle } from '../i18n';
const BirdForecastLab = lazy(() => import('./BirdForecastLab').then(m => ({ default: m.BirdForecastLab })));
const BirdMigrationDemo = lazy(() => import('./BirdMigrationDemo').then(m => ({ default: m.BirdMigrationDemo })));

import { DoseVectorPanel } from './DoseVectorPanel';
import { DoseResearchUpdate } from './DoseResearchUpdate';
import { getDoseUrl, getSimulatorUrl } from '../utils/doseUrl';
import { DELIVERIES_DATA } from '../data/deliveries';
import { DOSE_SIMULATOR_MAP, SimulatorKey } from '../data/doseSimulators';
import { getBook } from '../data/doseBooks';
import { DoseBook } from './DoseBook';
import { getBookChapterUrl, parseBookSlugFromUrl } from '../utils/doseUrl';
import { getRepoFileUrl } from '../utils/bookSources';
import { doseImageSrc, doseImageSrcSet, doseImageSizes } from '../utils/doseImage';
import { DoseVideo } from './DoseVideo';
import {
  AltbauThermalSimulator,
  GlasanflugSimulator,
  StreiflichtSimulator,
  WetInkSimulator,
  BalkonkraftwerkSimulator,
  RegenwasserSimulator,
  KlarLokalSimulator,
  CrackFloraSimulator,
  KiezLaermSimulator,
  FugenduellArena,
  TischSchiedsrichterSimulator,
  KristallwachstumSimulator,
  ChemHazardSimulator,
} from './simulators';

interface DoseSinglePageProps {
  dose: DoseItem;
  allDosen: DoseItem[];
  lang: Language;
  onBack: () => void;
  onOpenPopup: (dose: DoseItem) => void;
  onSelectDoseById: (doseId: string) => void;
  onOpenSimulatorTab?: (simId: SimulatorKey) => void;
  onOpenEmailsTab?: () => void;
  onSelectTag?: (tag: string) => void;
}

export const DoseSinglePage: React.FC<DoseSinglePageProps> = ({
  dose,
  allDosen,
  lang,
  onBack,
  onOpenPopup,
  onSelectDoseById,
  onOpenSimulatorTab,
  onOpenEmailsTab,
  onSelectTag,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);
  const [showEmbeddedSimulator, setShowEmbeddedSimulator] = useState(true);
  const [showSchema, setShowSchema] = useState(false);

  const t = getTranslation(lang);
  const isDe = lang === 'de';
  const isEs = lang === 'es';
  const localizedTitle = getLocalizedTitle(dose, lang);

  const doseUrl = getDoseUrl(dose.id);

  // Find previous and next dose for convenient book-like paging
  const currentIndex = allDosen.findIndex((d) => d.id === dose.id);
  const prevDose = currentIndex > 0 ? allDosen[currentIndex - 1] : null;
  const nextDose = currentIndex < allDosen.length - 1 ? allDosen[currentIndex + 1] : null;

  // Simulator info if available
  const simInfo = DOSE_SIMULATOR_MAP[dose.id];

  // Das Buch zur Dose: die Rohrecherche hinter den Behauptungen
  const bookChapters = getBook(dose.id);
  const showBook = Boolean(parseBookSlugFromUrl());
  const initialChapterSlug = parseBookSlugFromUrl() || undefined;


  // Associated delivery emails
  const linkedEmailsFromData = DELIVERIES_DATA.filter(
    (mail) => mail.doseLinks && mail.doseLinks.includes(dose.id)
  );

  // Direct templates on the dose itself
  const directTemplates: typeof DELIVERIES_DATA = (
    dose.emailTemplates && dose.emailTemplates.length > 0
      ? dose.emailTemplates
      : dose.emailTemplate
      ? [
          {
            recipientName: dose.recipientsDe || 'Empfänger / Recipient',
            to: dose.emailTemplate.to,
            cc: dose.emailTemplate.cc,
            subjectDe: dose.emailTemplate.subjectDe,
            subjectEn: dose.emailTemplate.subjectEn,
            bodyDe: dose.emailTemplate.bodyDe,
            bodyEn: dose.emailTemplate.bodyEn,
          },
        ]
      : []
  )
    .filter(
      (tmpl) =>
        !linkedEmailsFromData.some(
          (m) =>
            m.subjectDe === tmpl.subjectDe || m.subjectEn === tmpl.subjectEn
        )
    )
    .map((tmpl, idx) => ({
      id: `tmpl-${dose.id}-${idx}`,
      mailIndex: linkedEmailsFromData.length + idx + 1,
      titleDe: `${tmpl.recipientName}: ${tmpl.subjectDe}`,
      titleEn: `${tmpl.recipientName}: ${tmpl.subjectEn}`,
      recipientOrg: tmpl.recipientName,
      recipientTypeDe: 'Direkt-Vorlage (CC0)',
      recipientTypeEn: 'Direct Handover Template (CC0)',
      contactPathDe: tmpl.to,
      contactPathEn: tmpl.to,
      contactCc: tmpl.cc,
      subjectDe: tmpl.subjectDe,
      subjectEn: tmpl.subjectEn,
      bodyDe: tmpl.bodyDe,
      bodyEn: tmpl.bodyEn,
      doseLinks: [dose.id],
      scheduleDe: 'Sofort versendbar · CC0 Übergabe',
      scheduleEn: 'Immediate dispatch · CC0 Handover',
    }));

  const linkedEmails = [...linkedEmailsFromData, ...directTemplates];

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(doseUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2400);
  };

  const handleCopyMarkdown = () => {
    const mdContent = generateMarkdown();
    navigator.clipboard.writeText(mdContent);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2400);
  };

  const generateMarkdown = () => {
    return `# ${dose.title} (${dose.id}.md)
*Amélie Poulain · Kula-Ring Geschenk-Dose*
*Permanente URL: ${doseUrl}*

**Status:** ${dose.status}
**Verdikt:** ${dose.verdict}
**Datum:** ${dose.date} (Review nach 12 Monaten: ${dose.reviewAfter})
**Empfänger:** ${dose.recipientsDe}
**Domäne:** ${dose.domain}
**Tags:** ${dose.tags.join(', ')}

---

## One-Liner
> ${dose.oneLinerDe}

---

## 1. Das Problem & Der Status Quo
${dose.problemDe}

---

## 2. Warum jetzt? (Der technische Wendepunkt)
${dose.whyNowDe.map((point) => `- ${point}`).join('\n')}

---

## 3. Architektur-Skizze
${dose.sketchDe}

---

## 4. Ticket #1 (Der 2-Tage-Schritt)
**Ticket:** ${dose.firstStepDe.ticket}
**Definition of Done:** ${dose.firstStepDe.criteria}

---

## 5. Die Sollbruchstelle (Wo es kippt)
${dose.failureModeDe}

---

## 6. Stand der Technik (Prior Art)
${dose.priorArtDe}
${bookChapters.length > 0 ? `
---

## 7. Das Buch zur Dose (Rohrecherche)
Die Dose behauptet, das Buch belegt — einschließlich dessen, was gegen die Idee spricht.

${bookChapters
  .map(
    (c) =>
      `- **${c.titleDe}** (${c.date}) — ${c.noteDe}\n  - Lesen: ${getBookChapterUrl(dose.id, c.slug)}\n  - Quelle im Repo: ${getRepoFileUrl(c.path)}`
  )
  .join('\n')}
` : ''}
---
*Lizenz: CC0 1.0 Universal (Public Domain Dedication)*
`;
  };

  const downloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([generateMarkdown()], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${dose.id}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const printDossier = () => {
    window.print();
  };

  const handleCopyEmail = (mailId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmailId(mailId);
    setTimeout(() => setCopiedEmailId(null), 2400);
  };

  const getVerdictLabel = (verdict: Verdict) => {
    if (verdict === 'gift') return t.ui.verdict_gift;
    if (verdict === 'build_first') return t.ui.verdict_build_first;
    return t.ui.verdict_keep;
  };

  return (
    <article className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* 1. TOP BREADCRUMB & ACTION BAR */}
      <nav aria-label="Breadcrumb" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 sm:p-4 rounded-2xl bg-[var(--m-surface)] border border-[var(--m-line)] shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <Link to={withPreferences('/dosen/', location.search)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--m-surface-2)] hover:bg-[var(--m-accent)] hover:text-white text-[var(--m-ink-2)] border border-[var(--m-line-strong)] font-typewriter font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isDe ? 'Zurück zur Übersicht' : isEs ? 'Volver al resumen' : 'Back to Overview'}</span>
          </Link>

          <span className="text-[var(--m-muted)]">/</span>
          <span className="text-[var(--m-muted)] font-typewriter hidden md:inline">
            {isDe ? 'Dosen-Archiv' : isEs ? 'Archivo de latas' : 'Tin Archive'}
          </span>
          <span className="text-[var(--m-muted)] hidden md:inline">/</span>
          <span className="font-bold text-[var(--m-accent)] font-typewriter truncate max-w-[200px] sm:max-w-none">
            {dose.id}.md
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
          {/* Schema info button */}
          <button
            onClick={() => setShowSchema((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-typewriter font-semibold transition-colors cursor-pointer ${
              showSchema
                ? 'bg-[var(--m-accent)] text-white border-[var(--m-accent-strong)]'
                : 'bg-[var(--m-surface-2)] hover:bg-[var(--m-sunk)] text-[var(--m-ink-2)] border-[var(--m-line-strong)]'
            }`}
            title={isDe ? 'Kanonisches Dosen-Schema nach Amélie-Manifest' : 'Canonical tin schema from Amélie Manifest'}
          >
            <HelpCircle className="w-3.5 h-3.5 text-[var(--m-gold)]" />
            <span className="hidden sm:inline">{isDe ? 'Dosen-Schema' : 'Tin Schema'}</span>
          </button>

          {/* Switch to popup */}
          <button
            onClick={() => onOpenPopup(dose)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--m-surface-2)] hover:bg-[var(--m-sunk)] text-[var(--m-ink-2)] border border-[var(--m-line-strong)] text-xs font-typewriter font-semibold transition-colors cursor-pointer"
            title={isDe ? 'In Schnell-Popup ansehen' : isEs ? 'Ver en ventana emergente' : 'View in quick modal'}
          >
            <Maximize2 className="w-3.5 h-3.5 text-[var(--m-accent)]" />
            <span className="hidden sm:inline">{isDe ? 'Popup-Ansicht' : isEs ? 'Ventana emergente' : 'Modal View'}</span>
          </button>

          {/* Download MD */}
          <button
            onClick={downloadMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--m-surface-2)] hover:bg-[var(--m-sunk)] text-[var(--m-ink-2)] border border-[var(--m-line-strong)] text-xs font-typewriter font-semibold transition-colors cursor-pointer"
            title="Download .md"
          >
            <Download className="w-3.5 h-3.5 text-[var(--m-muted)]" />
            <span className="hidden sm:inline">Markdown</span>
          </button>

          {/* Print A4 */}
          <button
            onClick={printDossier}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--m-surface-2)] hover:bg-[var(--m-sunk)] text-[var(--m-ink-2)] border border-[var(--m-line-strong)] text-xs font-typewriter font-semibold transition-colors cursor-pointer"
            title={isDe ? 'A4 drucken' : isEs ? 'Imprimir A4' : 'Print A4'}
          >
            <Printer className="w-3.5 h-3.5 text-[var(--m-muted)]" />
            <span className="hidden sm:inline">{isDe ? 'Drucken' : isEs ? 'Imprimir' : 'Print'}</span>
          </button>
        </div>
      </nav>

      {/* 2. DEDICATED PERMANENT URL BAR */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[var(--m-bg-2)] via-[#f7ede0] to-[#f2e2cd] border-2 border-[var(--m-copper)]/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[var(--m-accent)]/10 border border-[var(--m-accent)]/25 flex items-center justify-center text-[var(--m-accent)] shrink-0">
            <Share2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-typewriter uppercase tracking-widest text-[var(--m-accent)] font-bold block">
              {isDe ? '✦ Permanente Einzel-URL für diese Dose ✦' : isEs ? '✦ URL permanente de esta lata ✦' : '✦ Permanent Single-Page URL ✦'}
            </span>
            <div className="font-mono-code text-xs text-[var(--m-ink)] font-semibold truncate select-all mt-0.5">
              {doseUrl}
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyUrl}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-typewriter font-bold transition-all shadow-xs shrink-0 cursor-pointer ${
            copiedUrl
              ? 'bg-[var(--m-green)] text-[#f4fbf7] border border-[#143527]'
              : 'bg-[var(--m-accent)] hover:bg-[var(--m-accent-strong)] text-white border border-[var(--m-accent-strong)]'
          }`}
        >
          {copiedUrl ? (
            <>
              <Check className="w-4 h-4 text-[var(--m-gold)]" />
              <span>{isDe ? 'URL kopiert!' : isEs ? '¡URL copiada!' : 'URL Copied!'}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>{isDe ? 'Link kopieren' : isEs ? 'Copiar enlace' : 'Copy Direct URL'}</span>
            </>
          )}
        </button>
      </div>

      {/* CANONICAL DOSE SCHEMA DRAWER */}
      {showSchema && (
        <div className="p-6 rounded-3xl bg-[var(--m-ink)] text-[var(--m-bg)] border-2 border-[var(--m-copper)] space-y-4 shadow-md animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--m-ink-2)]">
            <div className="flex items-center gap-2.5">
              <span className="text-[var(--m-gold)] text-xl">✦</span>
              <h3 className="font-typewriter text-sm sm:text-base uppercase tracking-wider font-bold text-[var(--m-gold)]">
                {isDe ? 'Das kanonische Schema einer Dose (Amélie-Manifest)' : 'The Canonical Schema of a Tin (Amélie Manifest)'}
              </h3>
            </div>
            <button
              onClick={() => setShowSchema(false)}
              className="text-xs text-[var(--m-line-strong)] hover:text-white font-typewriter underline"
            >
              {isDe ? 'Schließen' : 'Close'}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-[var(--m-line-strong)] font-sans leading-relaxed">
            {isDe
              ? 'Eine Dose ist kein unverbindlicher Einfall, sondern ein vollständiges Geschenkpaket auf 1 Seite mit 5 Pflichtteilen und 2 Datumsankern:'
              : 'A tin is not a loose suggestion, but a self-contained 1-page gift package consisting of 5 core pillars and 2 mandatory date anchors:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--m-ink)] border border-[var(--m-ink-2)] space-y-1">
              <span className="font-bold text-[var(--m-gold)] block font-typewriter">1. Das Problem</span>
              <span className="text-stone-300 text-[11px] leading-snug block">Wer leidet konkret? Reale Reibung ohne „man könnte".</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--m-ink)] border border-[var(--m-ink-2)] space-y-1">
              <span className="font-bold text-[var(--m-gold)] block font-typewriter">2. Warum jetzt?</span>
              <span className="text-stone-300 text-[11px] leading-snug block">Welcher technologische Knick macht es erst seit Kurzem bezahlbar?</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--m-ink)] border border-[var(--m-ink-2)] space-y-1">
              <span className="font-bold text-[var(--m-gold)] block font-typewriter">3. Die Skizze</span>
              <span className="text-stone-300 text-[11px] leading-snug block">Genug System-Architektur, dass ein Fachmensch nickt. Nicht mehr.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--m-ink)] border border-[var(--m-ink-2)] space-y-1">
              <span className="font-bold text-[#86efac] block font-typewriter">4. Der erste Schritt (Ticket #1)</span>
              <span className="text-stone-300 text-[11px] leading-snug block">Das 2-Tage-Ticket, mit dem man Montag früh beginnt. Mit Kriterien.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--m-ink)] border border-[var(--m-ink-2)] space-y-1">
              <span className="font-bold text-[#fca5a5] block font-typewriter">5. Wo es kippt</span>
              <span className="text-stone-300 text-[11px] leading-snug block">Die reale Sollbruchstelle, die das Vorhaben killen kann. Schafft Glaubwürdigkeit.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--m-ink)] border border-[var(--m-ink-2)] space-y-1">
              <span className="font-bold text-[#93c5fd] block font-typewriter">Pflicht-Datumsanker</span>
              <span className="text-stone-300 text-[11px] leading-snug block">«Stand» (wann recherchiert) & «Prüfen ab» (Verfallsdatum zum Friedhof).</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. EDITORIAL HERO HEADER */}
      <header className="rounded-3xl bg-gradient-to-br from-[var(--m-surface-2)] via-[#f5ede1] to-[#eedfcb] border-2 border-[var(--m-copper)]/50 p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle decorative watermark */}
        <div className="absolute right-4 -top-6 select-none pointer-events-none opacity-5 hidden sm:block">
          <div className="font-amelie text-9xl font-bold text-[var(--m-accent)]">DOSE</div>
        </div>

        <div className="relative space-y-4 max-w-4xl">
          {/* Top Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs ${
                dose.verdict === 'gift'
                  ? 'bg-[var(--m-green)] text-[#f4fbf7] border border-[#143527]'
                  : dose.verdict === 'build_first'
                  ? 'bg-[var(--m-copper)] text-[var(--m-surface)] border border-[#a86c1f]'
                  : 'bg-[var(--m-accent)] text-[var(--m-on-accent)] border border-[var(--m-accent-strong)]'
              }`}
            >
              {dose.verdict === 'gift' && <Gift className="w-3.5 h-3.5 text-[var(--m-gold)]" />}
              {dose.verdict === 'build_first' && <Hammer className="w-3.5 h-3.5 text-[#fef08a]" />}
              {dose.verdict === 'keep' && <Lock className="w-3.5 h-3.5 text-[#fbcfe8]" />}
              <span>{getVerdictLabel(dose.verdict)}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--m-accent)]/10 border border-[var(--m-accent)]/25 text-[var(--m-accent)] text-xs font-typewriter font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>Status: {dose.status.toUpperCase()}</span>
            </span>

            {dose.aiFrontier && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-typewriter font-bold bg-[#264653]/15 text-[#1a3843] border border-[#264653]/30">
                <Brain className="w-3.5 h-3.5 text-[#264653]" />
                <span>AI-Native</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-typewriter text-[var(--m-muted)] bg-white/70 border border-[var(--m-line-strong)]">
              <span>📅 {dose.date}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-typewriter text-[var(--m-green)] bg-[#e8f5e9] border border-[#c8e6c9]">
              <span>✦ CC0 1.0 Public Domain ✦</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-amelie text-[var(--m-ink)] tracking-tight leading-tight">
            {localizedTitle}
          </h1>
          {/* Bild zur Dose — nur wenn es eins gibt, sonst stand hier auf 33 von
              35 Seiten ein leeres <img> mit Rahmen und Schatten. */}
          {dose.image && (
            <figure className="space-y-2">
              <picture>
                <source
                  type="image/webp"
                  srcSet={doseImageSrcSet(dose.image)}
                  sizes={doseImageSizes(dose.imageAspect)}
                />
                <img
                  src={doseImageSrc(dose.image)}
                  alt={dose.imageAlt || localizedTitle}
                  loading="lazy"
                  decoding="async"
                  style={
                    dose.imageAspect
                      ? { aspectRatio: String(dose.imageAspect), maxHeight: 'min(70vh, 34rem)' }
                      : { maxHeight: 'min(70vh, 34rem)' }
                  }
                  className="mx-auto h-auto w-auto max-w-full rounded-2xl border border-[var(--m-line-strong)] shadow-xs bg-[var(--m-surface-2)]"
                />
              </picture>
            </figure>
          )}

          {/* Eigenes Video: Vorschaubild, Datei lädt erst beim Klick */}
          {dose.videoFile && (
            <DoseVideo file={dose.videoFile} poster={dose.videoPoster} aspect={dose.videoAspect} title={lang === 'de' ? dose.videoTitle : dose.videoTitleEn || dose.videoTitle} lang={lang} />
          )}

          {/* Video Demonstration Link (Lazy external stream) */}
          {dose.videoUrl && (
            <div className="flex justify-center -mt-1 mb-2">
              <a
                href={dose.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/10 hover:bg-red-950/20 text-red-900 border border-red-300 text-xs font-mono-code font-semibold transition-all hover:scale-105 shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current text-red-600" />
                <span>{dose.videoTitle || (isDe ? 'Video-Demonstration ansehen (Drive)' : 'Watch Video Demo (Drive)')}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          )}

          {/* Poetic One-Liner Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--m-surface)]/90 border border-[var(--m-line-strong)] text-[var(--m-ink)] font-amelie text-lg sm:text-xl md:text-2xl italic leading-relaxed shadow-xs">
            « {isDe ? dose.oneLinerDe : (isEs && dose.oneLinerEs) || dose.oneLinerEn} »
          </div>

          {/* Reviewer vectors (V1–V8) */}
          <DoseVectorPanel doseId={dose.id} lang={lang} />

          {/* Recipient & Tags Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white/80 border border-[var(--m-line)] space-y-1">
              <span className="text-[11px] font-typewriter uppercase tracking-wider text-[var(--m-accent)] font-bold block">
                {t.ui.recipient}
              </span>
              <p className="text-sm font-bold text-[var(--m-ink)]">
                {isDe ? dose.recipientsDe : (isEs && dose.recipientsEs) || dose.recipientsEn}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-[var(--m-line)] space-y-1">
              <span className="text-[11px] font-typewriter uppercase tracking-wider text-[var(--m-muted)] font-bold block">
                {isDe ? 'Schlagworte & Domäne' : isEs ? 'Etiquetas y área' : 'Tags & Domain'}
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <span className="text-xs font-typewriter font-bold px-2 py-0.5 rounded bg-[var(--m-accent)]/10 text-[var(--m-accent)] border border-[var(--m-accent)]/25">
                  {dose.domain.toUpperCase()}
                </span>
                {dose.tags.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (onSelectTag) {
                        onSelectTag(tag);
                      } else {
                        onBack();
                      }
                    }}
                    className="text-xs font-typewriter px-2 py-0.5 rounded bg-[var(--m-surface-2)] hover:bg-[var(--m-accent)] hover:text-white text-[var(--m-ink-2)] border border-[var(--m-line)] transition-colors cursor-pointer"
                    title={isDe ? `Alle Dosen mit Tag #${tag} anzeigen` : isEs ? `Ver latas con etiqueta #${tag}` : `View all tins with tag #${tag}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {dose.id === 'eurobirdcast' && <Suspense fallback={<p role="status">Loading migration observations…</p>}><BirdMigrationDemo lang={lang} /></Suspense>}

      {/* 4. LIVE INTERACTIVE SIMULATOR (If Available for this Dose) */}
      {simInfo && (
        <section aria-labelledby="simulator-heading" className="rounded-3xl border-2 border-[var(--m-copper)]/60 bg-[var(--m-surface)] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--m-line)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--m-copper)]/15 text-2xl flex items-center justify-center shrink-0 border border-[var(--m-copper)]/30">
                {simInfo.icon}
              </div>
              <div>
                <span className="text-[10px] font-typewriter uppercase tracking-widest text-[var(--m-copper)] font-bold block">
                  ✦ {isDe ? 'Interaktiver Prototyp & Prüfstand' : isEs ? 'Prototipo interactivo' : 'Interactive Prototype Lab'} ✦
                </span>
                <h2 id="simulator-heading" className="text-xl sm:text-2xl font-bold font-amelie text-[var(--m-ink)]">
                  {isDe ? simInfo.titleDe : isEs ? simInfo.titleEs : simInfo.titleEn}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEmbeddedSimulator((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--m-surface-2)] hover:bg-[var(--m-sunk)] text-[var(--m-ink-2)] border border-[var(--m-line-strong)] text-xs font-typewriter font-bold transition-colors cursor-pointer"
              >
                <span>{showEmbeddedSimulator ? (isDe ? 'Ausblenden' : isEs ? 'Ocultar' : 'Hide') : (isDe ? 'Einblenden' : isEs ? 'Mostrar' : 'Show')}</span>
              </button>

              {onOpenSimulatorTab && (
                <Link to={getSimulatorUrl(simInfo.key)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--m-accent)] hover:bg-[var(--m-accent-strong)] text-white text-xs font-typewriter font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isDe ? 'Im Vollbild-Sandbox öffnen' : isEs ? 'Abrir en sandbox completo' : 'Open in Sandbox Tab'}</span>
                </Link>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[var(--m-ink-2)] leading-relaxed">
            {isDe ? simInfo.descriptionDe : isEs ? simInfo.descriptionEs : simInfo.descriptionEn}
          </p>

          {showEmbeddedSimulator && (
            <div className="pt-2">
              {simInfo.key === 'altbau' && <AltbauThermalSimulator lang={lang} />}
              {simInfo.key === 'glasanflug' && <GlasanflugSimulator lang={lang} />}
              {simInfo.key === 'streiflicht' && <StreiflichtSimulator lang={lang} />}
              {simInfo.key === 'wetink' && <WetInkSimulator lang={lang} />}
              {simInfo.key === 'balkon' && <BalkonkraftwerkSimulator lang={lang} />}
              {simInfo.key === 'regenwasser' && <RegenwasserSimulator lang={lang} />}
              {simInfo.key === 'klarlokal' && <KlarLokalSimulator lang={lang} />}
              {simInfo.key === 'crackflora' && <CrackFloraSimulator lang={lang} />}
              {simInfo.key === 'laerm' && <KiezLaermSimulator lang={lang} />}
              {simInfo.key === 'fugenduell' && <FugenduellArena lang={lang} />}
              {simInfo.key === 'schiedsrichter' && <TischSchiedsrichterSimulator lang={lang} isEmbedded />}
              {simInfo.key === 'kristall' && <KristallwachstumSimulator lang={lang} />}
              {simInfo.key === 'chemhazard' && <ChemHazardSimulator lang={lang} isEmbedded />}
            </div>
          )}
        </section>
      )}

      {/* 5. THE 6 CORE AMÉLIE DOSSIER PILLARS */}
      <div className="space-y-6">
        {/* Pillar 1: Problem & Status Quo */}
        <section aria-labelledby="problem-heading" className="rounded-2xl border border-[var(--m-line)] bg-[var(--m-surface)] p-6 sm:p-8 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-[var(--m-accent)] pb-2 border-b border-[var(--m-sunk)]">
            <AlertTriangle className="w-5 h-5 text-[var(--m-accent)]" />
            <h2 id="problem-heading" className="text-lg sm:text-xl font-bold font-amelie text-[var(--m-ink)]">
              {isDe ? 'Das Problem & Status Quo' : isEs ? 'El Problema y el Status Quo' : 'The Problem & Status Quo'}
            </h2>
          </div>
          <div className="text-sm sm:text-base text-[var(--m-ink-2)] leading-relaxed font-sans whitespace-pre-line">
            {isDe ? dose.problemDe : (isEs && dose.problemEs) || dose.problemEn}
          </div>
        </section>

        {/* Pillar 2: Warum jetzt? (Why Now) */}
        <section aria-labelledby="why-now-heading" className="rounded-2xl border border-[var(--m-line)] bg-[var(--m-surface)] p-6 sm:p-8 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-[var(--m-accent)] pb-2 border-b border-[var(--m-sunk)]">
            <Lightbulb className="w-5 h-5 text-[var(--m-copper)]" />
            <h2 id="why-now-heading" className="text-lg sm:text-xl font-bold font-amelie text-[var(--m-ink)]">
              {isDe ? 'Warum das jetzt geht (Technologie-Knick)' : isEs ? 'Por qué ahora (Avance técnico)' : 'Why Now (Technological Breakthrough)'}
            </h2>
          </div>
          <ul className="space-y-2.5 pt-1">
            {(isDe ? dose.whyNowDe : (isEs && dose.whyNowEs) || dose.whyNowEn).map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-[var(--m-ink-2)] leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-[var(--m-surface-2)] border border-[var(--m-line-strong)] text-[var(--m-accent)] text-xs font-typewriter font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Pillar 3: Architektur-Skizze */}
        <section aria-labelledby="sketch-heading" className="rounded-2xl border border-[var(--m-line)] bg-[var(--m-surface)] p-6 sm:p-8 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-[var(--m-accent)] pb-2 border-b border-[var(--m-sunk)]">
            <Target className="w-5 h-5 text-[var(--m-accent)]" />
            <h2 id="sketch-heading" className="text-lg sm:text-xl font-bold font-amelie text-[var(--m-ink)]">
              {isDe ? 'Skizze & System-Architektur' : isEs ? 'Esquema y Arquitectura' : 'Architecture & Sketch'}
            </h2>
          </div>
          <div className="p-5 rounded-xl bg-[var(--m-surface-2)] border border-[var(--m-line)] text-sm text-[var(--m-ink)] font-mono-code whitespace-pre-wrap leading-relaxed">
            {isDe ? dose.sketchDe : (isEs && dose.sketchEs) || dose.sketchEn}
          </div>
        </section>

        {/* Pillar 4: Ticket #1 (Der 2-Tage-Schritt) */}
        <section aria-labelledby="ticket-heading" className="rounded-2xl border-2 border-[var(--m-green)]/40 bg-[#f4fbf7] p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2.5 text-[var(--m-green)] pb-2 border-b border-[#c8e6c9]">
            <Wrench className="w-5 h-5 text-[var(--m-green-2)]" />
            <h2 id="ticket-heading" className="text-lg sm:text-xl font-bold font-amelie text-[var(--m-green)]">
              {isDe ? 'Erster Schritt (Ticket #1)' : isEs ? 'Primer paso (Ticket #1)' : 'First Milestone (Ticket #1)'}
            </h2>
            <span className="ml-auto text-[10px] font-typewriter uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-[var(--m-green)] text-white">
              2-Tage-Schritt
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-typewriter uppercase tracking-wider text-[var(--m-green)] font-bold block">
              {isDe ? 'Ticket-Titel:' : isEs ? 'Alcance del ticket:' : 'Ticket Scope:'}
            </span>
            <div className="p-3.5 rounded-xl bg-white border border-[#c8e6c9] font-bold text-sm text-[#143527]">
              {isDe ? dose.firstStepDe.ticket : dose.firstStepEn.ticket}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-typewriter uppercase tracking-wider text-[var(--m-green)] font-bold block">
              {isDe ? 'Definition of Done (Abnahmekriterien):' : isEs ? 'Criterio de terminado:' : 'Definition of Done (Criteria):'}
            </span>
            <div className="p-4 rounded-xl bg-white border border-[#c8e6c9] text-xs sm:text-sm text-[var(--m-ink)] font-typewriter leading-relaxed">
              {isDe ? dose.firstStepDe.criteria : dose.firstStepEn.criteria}
            </div>
          </div>
        </section>

        {/* Pillar 5: Sollbruchstelle (Wo es kippt) */}
        <section aria-labelledby="failure-heading" className="rounded-2xl border-2 border-[#b91c1c]/30 bg-[#fdf2f2] p-6 sm:p-8 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-[#b91c1c] pb-2 border-b border-[#fecaca]">
            <ShieldAlert className="w-5 h-5 text-[#b91c1c]" />
            <h2 id="failure-heading" className="text-lg sm:text-xl font-bold font-amelie text-[#7f1d1d]">
              {isDe ? 'Wo es kippt (Bruchstelle)' : isEs ? 'Punto crítico de falla' : 'Where it Breaks (Failure Mode)'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#7f1d1d] font-typewriter leading-relaxed">
            {isDe ? dose.failureModeDe : (isEs && dose.failureModeEs) || dose.failureModeEn}
          </p>
        </section>

        {/* Pillar 6: Stand der Technik (Prior Art) */}
        <section aria-labelledby="prior-art-heading" className="rounded-2xl border border-[var(--m-line)] bg-[var(--m-surface)] p-6 sm:p-8 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-[var(--m-muted)] pb-2 border-b border-[var(--m-sunk)]">
            <Compass className="w-5 h-5 text-[var(--m-muted)]" />
            <h2 id="prior-art-heading" className="text-lg sm:text-xl font-bold font-amelie text-[var(--m-ink)]">
              {isDe ? 'Wer es schon versucht hat (Prior Art)' : isEs ? 'Intentos previos (Prior Art)' : 'Prior Art & Unoccupied Gap'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--m-ink-2)] font-mono-code leading-relaxed whitespace-pre-wrap">
            {isDe ? dose.priorArtDe : (isEs && dose.priorArtEs) || dose.priorArtEn}
          </p>
        </section>

        {dose.id === 'eurobirdcast' && (
          <Suspense fallback={<p role="status">Loading migration observations…</p>}>
            <details className="rounded-xl border border-stone-200 bg-white p-5">
              <summary className="cursor-pointer font-semibold">{isDe ? 'Daten, Wissenschaft und Kontakte' : 'Data, science and contacts'}</summary>
              <div className="mt-5"><BirdForecastLab lang={lang} /></div>
            </details>
          </Suspense>
        )}
        <DoseResearchUpdate doseId={dose.id} lang={lang} />

        {/* Pillar 7: Das Buch zur Dose — Rohrecherche hinter den Behauptungen */}
        {bookChapters.length > 0 && (
          <section id="dose-book" aria-labelledby="book-heading" className="scroll-mt-48 rounded-2xl border border-[var(--m-line)] bg-[var(--m-surface)] p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2.5 text-[var(--m-muted)] pb-2 border-b border-[var(--m-sunk)]">
              <BookOpen className="w-5 h-5 text-[var(--m-muted)]" />
              <h2 id="book-heading" className="text-lg sm:text-xl font-bold font-amelie text-[var(--m-ink)]">
                {isDe ? 'Das Buch zur Dose' : isEs ? 'El libro de la lata' : 'The Book Behind the Tin'}
              </h2>
              <span className="ml-auto font-mono-code text-[11px] text-[#9a8570]">
                {bookChapters.length} {isDe ? 'Kapitel' : isEs ? 'capítulos' : 'chapters'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[var(--m-ink-2)] font-typewriter leading-relaxed">
              {isDe
                ? 'Die Dose behauptet, das Buch belegt. Hier liegt die Rohrecherche, aus der sie entstanden ist — einschließlich dessen, was gegen die Idee spricht. Für wen auch immer sie weiterbaut: Das ist der Teil, der Arbeit spart.'
                : isEs
                ? 'La lata afirma, el libro prueba. Aquí está la investigación en bruto de la que surgió, incluido lo que habla en contra de la idea.'
                : 'The tin claims, the book proves. This is the raw research it grew out of — including what argues against the idea. For whoever builds on it, this is the part that saves work.'}
            </p>

            {!showBook && (
              <ul className="space-y-2">
                {bookChapters.map((c) => (
                  <li key={c.slug}>
                    <button
                      onClick={() => navigate({ pathname: chapterPath(dose.id, bookChapters[0].slug), search: location.search })}
                      className="w-full text-left px-4 py-3 rounded-xl border border-[var(--m-line)] bg-[var(--m-surface-2)] hover:bg-[var(--m-sunk)] transition-colors cursor-pointer"
                    >
                      <div className="font-typewriter text-xs font-bold text-[var(--m-ink)]">
                        {isDe ? c.titleDe : c.titleEn}
                      </div>
                      <div className="font-typewriter text-[11px] text-[var(--m-ink-3)] mt-1 leading-snug">
                        {isDe ? c.noteDe : c.noteEn}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => navigate({ pathname: showBook ? dosePath(dose.id) : chapterPath(dose.id, bookChapters[0].slug), search: location.search })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--m-ink)] text-[var(--m-surface-2)] font-typewriter text-xs font-bold hover:bg-[#3d2c20] transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {showBook
                ? (isDe ? 'Buch zuklappen' : isEs ? 'Cerrar el libro' : 'Close the book')
                : (isDe ? 'Buch aufschlagen' : isEs ? 'Abrir el libro' : 'Open the book')}
            </button>

            {showBook && (
              <DoseBook
                chapters={bookChapters}
                lang={lang}
                initialSlug={initialChapterSlug}
                chapterHref={(slug) => getBookChapterUrl(dose.id, slug)}
                onChapterChange={(slug) => {
                  const path = chapterPath(dose.id, slug);
                  if (location.pathname !== path) navigate({ pathname: path, search: location.search });
                }}
              />
            )}
          </section>
        )}
      </div>

      {/* 6. LINKED OUTBOUND DELIVERY EMAILS */}
      {linkedEmails.length > 0 && (
        <section aria-labelledby="emails-heading" className="rounded-3xl border-2 border-[var(--m-accent)]/30 bg-[var(--m-surface)] p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--m-line)]">
            <div className="flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-[var(--m-accent)]" />
              <div>
                <span className="text-[10px] font-typewriter uppercase tracking-widest text-[var(--m-accent)] font-bold block">
                  ✦ {isDe ? 'Zugehörige Muster-Lieferung' : isEs ? 'Envío por correo correspondiente' : 'Associated Outbound Delivery'} ✦
                </span>
                <h2 id="emails-heading" className="text-lg sm:text-xl font-bold font-amelie text-[var(--m-ink)]">
                  {isDe ? 'Verschenke-E-Mails für diese Dose' : isEs ? 'Correos de entrega para esta lata' : 'Delivery Emails Featuring this Tin'}
                </h2>
              </div>
            </div>

            {onOpenEmailsTab && (
              <button
                onClick={onOpenEmailsTab}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--m-surface-2)] hover:bg-[var(--m-sunk)] text-[var(--m-ink-2)] border border-[var(--m-line-strong)] text-xs font-typewriter font-bold transition-colors cursor-pointer"
              >
                <span>{isDe ? `Alle ${DELIVERIES_DATA.length} Muster-Mails ansehen` : `View all ${DELIVERIES_DATA.length} Sample Emails`} →</span>
              </button>
            )}
          </div>

          <p className="text-xs text-[var(--m-ink-2)]">
            {isDe
              ? 'Nach der Amélie-Philosophie wird diese Dose bedingungslos verschenkt (CC0), ohne Terminanfrage und ohne Nachfassen:'
              : isEs ? 'Según la filosofía Amélie, esta lata se entrega sin condiciones (CC0), sin seguimiento ni peticiones de reunión:' : 'Per Amélie philosophy, this tin is delivered unconditionally (CC0) without follow-ups or meeting requests:'}
          </p>

          <div className="space-y-4">
            {linkedEmails.map((mail) => {
              const emailSubject = isDe ? mail.subjectDe : mail.subjectEn;
              const emailBody = isDe ? mail.bodyDe : mail.bodyEn;
              const ccText = mail.contactCc ? `CC: ${mail.contactCc}\n` : '';
              const fullMailText = `To: ${mail.contactPathDe}\n${ccText}Subject: ${emailSubject}\n\n${emailBody}`;

              return (
                <div
                  key={mail.id}
                  className="p-5 rounded-2xl bg-[var(--m-surface-2)] border border-[var(--m-line)] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--m-line)]">
                    <div>
                      <span className="text-xs font-typewriter px-2 py-0.5 rounded bg-[var(--m-accent)]/10 text-[var(--m-accent)] font-bold mr-2">
                        MAIL #{mail.mailIndex}
                      </span>
                      <span className="text-sm font-bold text-[var(--m-ink)] font-amelie">
                        {mail.recipientOrg}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyEmail(mail.id, fullMailText)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--m-accent)] hover:bg-[var(--m-accent-strong)] text-white text-xs font-typewriter font-bold transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
                    >
                      {copiedEmailId === mail.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[var(--m-gold)]" />
                          <span>{t.ui.email_copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isDe ? 'E-Mail kopieren' : isEs ? 'Copiar correo' : 'Copy Email'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="font-typewriter text-xs text-[var(--m-ink)] bg-white p-3 rounded-xl border border-[var(--m-line)] space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-[var(--m-muted)]">
                      <span className="font-bold">{isDe ? 'An: ' : isEs ? 'Para: ' : 'To: '}</span>
                      <span className="text-[var(--m-ink)] font-mono-code">{isDe ? mail.contactPathDe : mail.contactPathEn}</span>
                    </div>
                    <div>
                      <span className="text-[var(--m-muted)] font-bold">
                        {isDe ? 'Betreff: ' : isEs ? 'Asunto: ' : 'Subject: '}
                      </span>
                      <span className="text-[var(--m-ink)] font-medium">{emailSubject}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#2a2723] text-stone-200 font-mono-code text-xs whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto border border-stone-800">
                    {emailBody}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 7. AMÉLIE PLEDGE CARD */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--m-surface-2)] to-[var(--m-sunk)] border border-[var(--m-copper)]/40 text-center space-y-3">
        <div className="text-2xl">✨</div>
        <h3 className="text-base font-bold font-amelie text-[var(--m-ink)]">
          {isDe ? 'Das Amélie-Poulain-Versprechen' : isEs ? 'El compromiso Amélie Poulain' : 'The Amélie Poulain Pledge'}
        </h3>
        <p className="text-xs text-[var(--m-ink-2)] max-w-xl mx-auto italic font-amelie leading-relaxed">
          « {AMELIE_PLEDGE[lang]} »
        </p>
      </div>

      {/* 8. BOTTOM PAGING (Previous / Next Dose) */}
      <footer className="pt-6 border-t border-[var(--m-line)] flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevDose ? (
          <Link to={getDoseUrl(prevDose.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--m-surface)] hover:bg-[var(--m-surface-2)] border border-[var(--m-line)] hover:border-[var(--m-accent)] text-xs text-[var(--m-ink)] font-typewriter font-semibold transition-all cursor-pointer w-full sm:w-auto"
          >
            <ChevronLeft className="w-4 h-4 text-[var(--m-accent)]" />
            <div className="text-left">
              <span className="text-[10px] text-[var(--m-muted)] block uppercase">{isDe ? 'Vorherige Dose' : isEs ? 'Lata anterior' : 'Previous Tin'}</span>
              <span className="font-bold">{getLocalizedTitle(prevDose, lang)}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        <Link to={withPreferences('/dosen/', location.search)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--m-accent)] hover:bg-[var(--m-accent-strong)] text-white text-xs font-typewriter font-bold shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isDe ? 'Zurück zu allen Dosen' : isEs ? 'Volver a todas las latas' : 'Back to All Tins'}</span>
        </Link>

        {nextDose ? (
          <Link to={getDoseUrl(nextDose.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--m-surface)] hover:bg-[var(--m-surface-2)] border border-[var(--m-line)] hover:border-[var(--m-accent)] text-xs text-[var(--m-ink)] font-typewriter font-semibold transition-all cursor-pointer w-full sm:w-auto justify-end"
          >
            <div className="text-right">
              <span className="text-[10px] text-[var(--m-muted)] block uppercase">{isDe ? 'Nächste Dose' : isEs ? 'Lata siguiente' : 'Next Tin'}</span>
              <span className="font-bold">{getLocalizedTitle(nextDose, lang)}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--m-accent)]" />
          </Link>
        ) : (
          <div />
        )}
      </footer>
    </article>
  );
};
