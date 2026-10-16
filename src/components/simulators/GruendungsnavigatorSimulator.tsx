import React, { useMemo, useState } from 'react';
import { CalendarClock, ExternalLink, Map, MessagesSquare, ShieldCheck } from 'lucide-react';
import { Language } from '../../types';
import {
  berechneFristen,
  erwerbstaetigenFreibetrag,
  GELTUNGSGRENZE_DE,
  GELTUNGSGRENZE_EN,
  RECHTSSTAND,
  type FristEingabe,
} from '../../engine/gruendungsnavigator/gruendungsnavigator';

interface Props {
  lang: Language;
  isEmbedded?: boolean;
}

const BASE = `${import.meta.env.BASE_URL}gruendungsnavigator/`;

const FELDER: { key: keyof FristEingabe; de: string; en: string }[] = [
  { key: 'antrag', de: 'Antrag beim Jobcenter eingegangen', en: 'Application received by job centre' },
  { key: 'gruendung', de: 'Start der Tätigkeit (erster Auftrag)', en: 'Business start (first order)' },
  { key: 'bescheidBekanntgabe', de: 'Bescheid bekannt gegeben', en: 'Notice served' },
  { key: 'widerspruch', de: 'Widerspruch eingereicht', en: 'Objection filed' },
  { key: 'widerspruchsbescheidBekanntgabe', de: 'Widerspruchsbescheid bekannt gegeben', en: 'Objection decision served' },
  { key: 'bezugsbeginn', de: 'Beginn Leistungsbezug als Selbständige/r', en: 'Start of benefits while self-employed' },
  { key: 'einstiegsgeldBeginn', de: 'Beginn Einstiegsgeld', en: 'Start of start-up grant' },
  { key: 'vorschussAntrag', de: 'Antrag auf Vorschuss eingegangen (§ 42 SGB I)', en: 'Application for advance payment received (section 42 SGB I)' },
];

const ART_DE: Record<string, string> = { frist: 'Frist bis', fruehestens: 'frühestens', spaetestens: 'spätestens', hinweis: 'Hinweis' };
const ART_EN: Record<string, string> = { frist: 'deadline', fruehestens: 'earliest', spaetestens: 'at the latest', hinweis: 'note' };

const datumDe = (iso: string) => iso.split('-').reverse().join('.');

export const GruendungsnavigatorSimulator: React.FC<Props> = ({ lang, isEmbedded = false }) => {
  const de = lang !== 'en';
  const [eingabe, setEingabe] = useState<FristEingabe>({ antrag: '2026-10-12', gruendung: '2026-11-02' });
  const [gewinn, setGewinn] = useState(800);
  const [zeigeDemo, setZeigeDemo] = useState(false);

  const fristen = useMemo(() => berechneFristen(eingabe), [eingabe]);
  const fb = useMemo(() => erwerbstaetigenFreibetrag(Math.max(0, gewinn || 0)), [gewinn]);

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
              ? 'Telefonbaum (7 Fragen, 23 Antworten), 34 Fragen plus Zusatzfragen je Branche (Webentwicklung: 42), 30 Rechte-Karten, sechs Branchenpakete und eigene Fassung, Präsentationsmodus, Zusammenfassungs-Mail.'
              : 'Phone decision tree (7 questions, 23 answers), 34 questions plus extra ones per sector (web development: 42), 30 rights cards, six sector packs and your own version, presentation mode, summary mail.'}</span>
          </span>
        </a>
        <a href={`${BASE}fall-landkarte.html`} target="_blank" rel="noopener noreferrer"
          className="flex items-start gap-3 rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] p-4 hover:border-[var(--m-copper)] transition-colors">
          <Map className="w-5 h-5 mt-0.5 text-[var(--m-accent)] shrink-0" />
          <span>
            <span className="block font-bold text-sm text-[var(--m-ink)]">{de ? 'Fall-Landkarte öffnen' : 'Open case map'} <ExternalLink className="inline w-3 h-3" /></span>
            <span className="block text-xs text-[var(--m-ink-soft,#6b5b4b)] mt-1">{de
              ? '9 Stationen vom Antrag bis zum Ausstieg, 107 Antworten mit Frist und Normtext, Fristen-Zeitstrahl, 59 Normen.'
              : '9 stations from application to exit, 107 answers with deadline and statute text, deadline timeline, 59 statutes.'}</span>
          </span>
        </a>
      </div>

      <div className="rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarClock className="w-4 h-4 text-[var(--m-accent)]" />
          <h4 className="font-bold text-sm text-[var(--m-ink)]">{de ? 'Fristenrechner (getesteter Kern)' : 'Deadline calculator (tested kernel)'}</h4>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {FELDER.map((f) => (
            <label key={f.key} className="text-xs text-[var(--m-ink)] flex flex-col gap-1">
              {de ? f.de : f.en}
              <input type="date" value={(eingabe[f.key] as string) ?? ''}
                onChange={(e) => setEingabe((s) => ({ ...s, [f.key]: e.target.value || undefined }))}
                className="px-2 py-1.5 rounded-lg border border-[var(--m-line-strong)] bg-white text-sm" />
            </label>
          ))}
          <label className="text-xs text-[var(--m-ink)] flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" checked={eingabe.mitRechtsbehelfsbelehrung !== false}
              onChange={(e) => setEingabe((s) => ({ ...s, mitRechtsbehelfsbelehrung: e.target.checked }))} />
            {de ? 'Bescheid enthält eine Rechtsbehelfsbelehrung' : 'Notice contains instructions on legal remedies'}
          </label>
        </div>

        <ul className="mt-4 space-y-2" aria-live="polite">
          {fristen.length === 0 && <li className="text-xs text-stone-500">{de ? 'Ein Datum eingeben, dann erscheinen die Fristen.' : 'Enter a date to see deadlines.'}</li>}
          {fristen.map((f) => (
            <li key={f.id} className={`rounded-lg border p-2.5 text-xs ${f.art === 'hinweis' ? 'border-amber-400 bg-amber-50' : 'border-[var(--m-line)] bg-white'}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-bold text-[var(--m-ink)]">{de ? f.titelDe : f.titelEn}</span>
                <span className="font-typewriter">
                  {(de ? ART_DE : ART_EN)[f.art]}{f.datum ? ` ${de ? datumDe(f.datum) : f.datum}` : ''}
                </span>
              </div>
              <p className="mt-1 text-stone-600">{de ? f.begruendungDe : f.begruendungEn}</p>
              {f.verschobenVon && <p className="mt-1 text-stone-500">{de ? `Verschoben vom ${datumDe(f.verschobenVon)} (Wochenende/Feiertag).` : `Moved from ${f.verschobenVon} (weekend/holiday).`}</p>}
              <p className="mt-1 text-stone-400 font-typewriter">{f.normId}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-[var(--m-line-strong)] bg-[var(--m-surface)] p-4 text-xs">
        <h4 className="font-bold text-sm text-[var(--m-ink)] mb-2">{de ? 'Freibetrag auf den Gewinn (§ 11b Abs. 2, 3 SGB II)' : 'Allowance on profit (section 11b(2),(3) SGB II)'}</h4>
        <label className="flex items-center gap-2">
          {de ? 'Monatlicher Gewinn (€)' : 'Monthly profit (€)'}
          <input type="number" min={0} step={10} value={gewinn} onChange={(e) => setGewinn(+e.target.value)}
            className="w-28 px-2 py-1 rounded-lg border border-[var(--m-line-strong)] bg-white" />
        </label>
        <p className="mt-2">
          {de ? 'Frei bleiben' : 'Remains free'}: <b>{fb.summe.toFixed(2)} €</b> (100 + {fb.stufe20} + {fb.stufe30} + {fb.stufe10}) ·{' '}
          {de ? 'angerechnet' : 'counted'}: <b>{fb.angerechnet.toFixed(2)} €</b>
        </p>
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
        <span>{de ? GELTUNGSGRENZE_DE : GELTUNGSGRENZE_EN} {de ? 'Rechtsstand' : 'Legal status'}: {RECHTSSTAND.fassung}. {de ? 'Eingaben bleiben im Browser.' : 'Inputs stay in your browser.'}</span>
      </p>
    </div>
  );
};

export default GruendungsnavigatorSimulator;
