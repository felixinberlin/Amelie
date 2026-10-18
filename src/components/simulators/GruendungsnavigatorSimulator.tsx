import React from 'react';
import { ExternalLink, Mail, ShieldCheck, Smartphone } from 'lucide-react';
import { Language } from '../../types';
import { amelieMailto } from '../../data/kontakt';

interface Props {
  lang: Language;
  isEmbedded?: boolean;
}

// Das Werkzeug wird eine App (Repo felixinberlin/jobcenter-hilfe seit 18.10.2026 privat).
// Amélie zeigt bis dahin eine kleine Vorschau: Widerspruchsfrist und drei Rechte-Karten.
const VORSCHAU = `${import.meta.env.BASE_URL}gruendungsnavigator/`;

const APP_TEILE_DE = [
  'Bescheid prüfen (Miete, Heizung, Warmwasser, Freibeträge)',
  'Anträge ausfüllen bis zum amtlichen PDF (HA, WBA, EK, EKS, BB)',
  'Meldeversäumnis-Zähler (§ 32, § 7b Abs. 4 SGB II)',
  'Rückforderung, Aufrechnung, Überprüfungsantrag',
  'Miete, Vermögen, Unterlagen, Briefe, Kontakt-Protokoll',
  'Gründungsnavigator mit 30 Rechte-Karten und Branchenpaketen, Fall-Landkarte',
];
const APP_TEILE_EN = [
  'Check a notice (rent, heating, hot water, allowances)',
  'Fill in applications up to the official PDF (HA, WBA, EK, EKS, BB)',
  'Missed-appointment counter (sections 32, 7b(4) SGB II)',
  'Repayment, deductions, review request',
  'Rent, savings, documents, letters, contact log',
  'Start-up navigator with 30 rights cards and sector packs, case map',
];

export const GruendungsnavigatorSimulator: React.FC<Props> = ({ lang, isEmbedded = false }) => {
  const de = lang !== 'en';

  return (
    <div className={`space-y-5 ${isEmbedded ? '' : 'p-4'}`}>
      <div className="flex items-start gap-3 rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] p-4">
        <Smartphone className="w-5 h-5 mt-0.5 text-[var(--m-accent)] shrink-0" />
        <div className="text-sm text-[var(--m-ink)]">
          <p className="font-bold">{de ? 'Jobcenter-Hilfe wird eine App.' : 'Job Centre Help is becoming an app.'}</p>
          <p className="text-xs text-[var(--m-ink-soft,#6b5b4b)] mt-1">{de
            ? 'Hier eine kleine Vorschau zum Ausprobieren: Widerspruchsfrist mit Feiertagen je Bundesland und drei Rechte-Karten mit Gesetz im Wortlaut. In der App steckt mehr:'
            : 'Here is a small preview to try (German): objection deadline with holidays per state and three rights cards with the statute quoted verbatim. The app holds more:'}</p>
          <ul className="list-disc pl-5 mt-2 text-xs space-y-0.5">
            {(de ? APP_TEILE_DE : APP_TEILE_EN).map((t) => <li key={t}>{t}</li>)}
          </ul>
          <div className="flex flex-wrap gap-2 mt-3">
            <a href={VORSCHAU} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-typewriter font-bold px-3 py-1.5 rounded-lg border border-[var(--m-line-strong)] bg-[var(--m-surface)] hover:border-[var(--m-copper)]">
              {de ? 'Vorschau im eigenen Fenster' : 'Open preview in its own window'} <ExternalLink className="w-3 h-3" />
            </a>
            <a href={amelieMailto(de ? 'Jobcenter-Hilfe: Bitte Bescheid sagen, wenn die App da ist' : 'Job Centre Help: please let me know when the app is out')}
              className="inline-flex items-center gap-1 text-xs font-typewriter font-bold px-3 py-1.5 rounded-lg border border-[var(--m-line-strong)] bg-[var(--m-surface)] hover:border-[var(--m-copper)]">
              <Mail className="w-3 h-3" /> {de ? 'Bescheid sagen, wenn die App da ist' : 'Tell me when the app is out'}
            </a>
          </div>
        </div>
      </div>

      <iframe src={VORSCHAU} title={de ? 'Jobcenter-Hilfe · Vorschau' : 'Job Centre Help · preview'} loading="lazy"
        className="w-full h-[720px] rounded-xl border border-[var(--m-line-strong)] bg-white" />

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
