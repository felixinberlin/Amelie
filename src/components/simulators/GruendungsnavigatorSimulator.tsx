import React, { useState } from 'react';
import { ExternalLink, FolderGit2, Map, MessagesSquare, ShieldCheck } from 'lucide-react';
import { Language } from '../../types';

interface Props {
  lang: Language;
  isEmbedded?: boolean;
}

// Das Werkzeug lebt seit 17.10.2026 im eigenen Repository; die Dose verweist nur noch dorthin.
const BASE = 'https://felixinberlin.github.io/jobcenter-hilfe/';
const REPO = 'https://github.com/felixinberlin/jobcenter-hilfe';

export const GruendungsnavigatorSimulator: React.FC<Props> = ({ lang, isEmbedded = false }) => {
  const de = lang !== 'en';
  const [zeigeDemo, setZeigeDemo] = useState(false);

  return (
    <div className={`space-y-5 ${isEmbedded ? '' : 'p-4'}`}>
      <div className="grid gap-3 sm:grid-cols-2">
        <a href={`${BASE}jobcenter-hilfe.html`} target="_blank" rel="noopener noreferrer"
          className="flex items-start gap-3 rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] p-4 hover:border-[var(--m-copper)] transition-colors sm:col-span-2">
          <ShieldCheck className="w-5 h-5 mt-0.5 text-[var(--m-accent)] shrink-0" />
          <span>
            <span className="block font-bold text-sm text-[var(--m-ink)]">{de ? 'Jobcenter-Hilfe für alle öffnen' : 'Open Job Centre Help for everyone'} <ExternalLink className="inline w-3 h-3" /></span>
            <span className="block text-xs text-[var(--m-ink-soft,#6b5b4b)] mt-1">{de
              ? 'Meldeversäumnis-Zähler (§ 32, § 7b), Rückforderung und Aufrechnung, Miete, Fristen, Unterlagen, Vermögen. Offline, ohne KI zur Laufzeit.'
              : 'Missed-appointment counter (sections 32, 7b), repayment and deductions, rent, deadlines, documents, savings. Offline, no AI at runtime.'}</span>
          </span>
        </a>
        <a href={BASE} target="_blank" rel="noopener noreferrer"
          className="flex items-start gap-3 rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] p-4 hover:border-[var(--m-copper)] transition-colors">
          <MessagesSquare className="w-5 h-5 mt-0.5 text-[var(--m-accent)] shrink-0" />
          <span>
            <span className="block font-bold text-sm text-[var(--m-ink)]">{de ? 'Gesprächsnavigator öffnen' : 'Open conversation navigator'} <ExternalLink className="inline w-3 h-3" /></span>
            <span className="block text-xs text-[var(--m-ink-soft,#6b5b4b)] mt-1">{de
              ? 'Telefonbaum (7 Fragen, 23 Antworten), 35 Fragen plus Zusatzfragen je Branche (Webentwicklung: 43), 30 Rechte-Karten, sechs Branchenpakete und eigene Fassung, Präsentationsmodus, Zusammenfassungs-Mail.'
              : 'Phone decision tree (7 questions, 23 answers), 35 questions plus extra ones per sector (web development: 43), 30 rights cards, six sector packs and your own version, presentation mode, summary mail.'}</span>
          </span>
        </a>
        <a href={`${BASE}fall-landkarte.html`} target="_blank" rel="noopener noreferrer"
          className="flex items-start gap-3 rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] p-4 hover:border-[var(--m-copper)] transition-colors">
          <Map className="w-5 h-5 mt-0.5 text-[var(--m-accent)] shrink-0" />
          <span>
            <span className="block font-bold text-sm text-[var(--m-ink)]">{de ? 'Fall-Landkarte öffnen' : 'Open case map'} <ExternalLink className="inline w-3 h-3" /></span>
            <span className="block text-xs text-[var(--m-ink-soft,#6b5b4b)] mt-1">{de
              ? '9 Stationen vom Antrag bis zum Ausstieg, 107 Antworten mit Frist und Normtext, Fristen-Zeitstrahl, 61 Normen.'
              : '9 stations from application to exit, 107 answers with deadline and statute text, deadline timeline, 61 statutes.'}</span>
          </span>
        </a>
        <a href={REPO} target="_blank" rel="noopener noreferrer"
          className="flex items-start gap-3 rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] p-4 hover:border-[var(--m-copper)] transition-colors sm:col-span-2">
          <FolderGit2 className="w-5 h-5 mt-0.5 text-[var(--m-accent)] shrink-0" />
          <span>
            <span className="block font-bold text-sm text-[var(--m-ink)]">{de ? 'Quellcode, Prüfakte und Korrekturen' : 'Source code, audit file and corrections'} <ExternalLink className="inline w-3 h-3" /></span>
            <span className="block text-xs text-[var(--m-ink-soft,#6b5b4b)] mt-1">{de
              ? 'Eigenes Repository felixinberlin/jobcenter-hilfe (CC0): getesteter Kern mit Fristenrechner, Normregister, Prüfakte, Korrektur-Formular.'
              : 'Own repository felixinberlin/jobcenter-hilfe (CC0): tested kernel with deadline calculator, statute register, audit file, correction form.'}</span>
          </span>
        </a>
      </div>

      <div>
        <button type="button" onClick={() => setZeigeDemo((v) => !v)}
          className="text-xs font-typewriter font-bold px-3 py-1.5 rounded-lg border border-[var(--m-line-strong)] bg-[var(--m-surface)] hover:border-[var(--m-copper)]">
          {zeigeDemo ? (de ? 'Demo ausblenden' : 'Hide demo') : (de ? 'Gesprächsnavigator hier einbetten' : 'Embed conversation navigator here')}
        </button>
        {zeigeDemo && (
          <iframe src={BASE} title={de ? 'Gründungsnavigator' : 'Start-up navigator'} loading="lazy"
            className="mt-3 w-full h-[720px] rounded-xl border border-[var(--m-line-strong)] bg-white" />
        )}
      </div>

      <p className="flex items-start gap-2 text-[11px] text-stone-500">
        <ShieldCheck className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>{de
          ? 'Keine Rechtsberatung. Mit KI-Unterstützung geschrieben, zur Laufzeit keine KI; Eingaben bleiben im Browser.'
          : 'Not legal advice. Written with AI assistance, no AI at runtime; inputs stay in your browser.'}</span>
      </p>
    </div>
  );
};

export default GruendungsnavigatorSimulator;
