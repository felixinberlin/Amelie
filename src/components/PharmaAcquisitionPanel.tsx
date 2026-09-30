import React, { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Language } from '../types';
import {
  APPROACHES,
  BASE_ASSUMPTIONS,
  PHARMA_FACTS,
  PHARMA_SOURCES,
  PHARMA_TEST_PLAN,
  PHARMA_TEST_STOP_DE,
  PHARMA_TEST_STOP_EN,
  computeApproach,
} from '../data/pharmaAcquisition';

interface Props {
  lang: Language;
}

const eur = (n: number) =>
  `${n < 0 ? '−' : ''}${Math.abs(Math.round(n)).toLocaleString('de-DE')} €`;

export const PharmaAcquisitionPanel: React.FC<Props> = ({ lang }) => {
  const isDe = lang === 'de';
  const L = (de: string, en: string) => (isDe ? de : en);

  const [dealPriceEur, setDealPriceEur] = useState(BASE_ASSUMPTIONS.dealPriceEur);
  const [feePct, setFeePct] = useState(BASE_ASSUMPTIONS.feePct);
  const [mandateToClose, setMandateToClose] = useState(BASE_ASSUMPTIONS.mandateToClose);

  const results = useMemo(
    () =>
      APPROACHES.map((ap) =>
        computeApproach(ap, { ...BASE_ASSUMPTIONS, dealPriceEur, feePct, mandateToClose }),
      ),
    [dealPriceEur, feePct, mandateToClose],
  );

  const totalTest = PHARMA_TEST_PLAN.reduce((s, t) => s + t.budgetEur, 0);

  return (
    <div id="venture-farmacia-mandate-engine" className="mt-4 space-y-5 text-xs text-[var(--m-ink-2)]">
      <p className="leading-relaxed">
        {L(
          'Anfrage aus Reddit: Wie gewinnt ein Vermittler in Spanien Kunden für Kauf und Verkauf von Apotheken, mit Zeit, Kosten, Investition und ROI je Ansatz? Die Käuferseite ist nicht der Engpass, die Verkäufer sind es. Deshalb rechnen die Zeilen unten Aufträge von Verkäufern.',
          'Request from Reddit: how does a broker in Spain win clients for buying and selling pharmacies, with time, cost, investment and ROI per approach? Buyers are not the bottleneck, sellers are. So the rows below count mandates from sellers.',
        )}
      </p>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-900">
        <span className="font-bold">{L('Annahmen, keine Messwerte. ', 'Assumptions, not measurements. ')}</span>
        {L(
          'Preis, Provision und Abschlussquote lassen sich unten ändern. Die Konversionsraten je Ansatz sind geraten; erst der 90-Tage-Test misst sie.',
          'Price, fee and closing rate can be changed below. The conversion rates per approach are guesses; only the 90-day test measures them.',
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="font-typewriter font-bold text-[var(--m-ink-3)]">{L('Kaufpreis je Apotheke', 'Price per pharmacy')}: {eur(dealPriceEur)}</span>
          <input type="range" min={500_000} max={2_000_000} step={50_000} value={dealPriceEur}
            onChange={(e) => setDealPriceEur(Number(e.target.value))} className="w-full" />
        </label>
        <label className="block">
          <span className="font-typewriter font-bold text-[var(--m-ink-3)]">{L('Provision je Seite', 'Fee per side')}: {(feePct * 100).toFixed(1)} %</span>
          <input type="range" min={0.01} max={0.05} step={0.005} value={feePct}
            onChange={(e) => setFeePct(Number(e.target.value))} className="w-full" />
        </label>
        <label className="block">
          <span className="font-typewriter font-bold text-[var(--m-ink-3)]">{L('Aufträge, die abschließen', 'Mandates that close')}: {Math.round(mandateToClose * 100)} %</span>
          <input type="range" min={0.1} max={0.8} step={0.05} value={mandateToClose}
            onChange={(e) => setMandateToClose(Number(e.target.value))} className="w-full" />
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--m-line)]">
        <table className="w-full text-[11px]">
          <thead className="bg-[var(--m-sunk)] text-left text-[var(--m-ink-3)]">
            <tr>
              <th className="p-2">{L('Ansatz', 'Approach')}</th>
              <th className="p-2 text-right">{L('Investition', 'Investment')}</th>
              <th className="p-2 text-right">{L('Kosten/Jahr', 'Cost/yr')}</th>
              <th className="p-2 text-right">{L('Erste Provision', 'First fee')}</th>
              <th className="p-2 text-right">{L('Abschlüsse/Jahr', 'Closings/yr')}</th>
              <th className="p-2 text-right">{L('Ergebnis 24 Mon.', 'Net 24 mo.')}</th>
              <th className="p-2 text-right">ROI 24</th>
              <th className="p-2 text-right">{L('Amortisiert', 'Payback')}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.approach.id} className="border-t border-[var(--m-sunk)] align-top">
                <td className="p-2 min-w-[14rem]">
                  <div className="font-semibold text-[var(--m-ink)]">{L(r.approach.nameDe, r.approach.nameEn)}</div>
                  <div className="mt-0.5">{L(r.approach.whatDe, r.approach.whatEn)}</div>
                  <div className="mt-0.5 text-[var(--m-ink-3)]">{L('Risiko: ', 'Risk: ')}{L(r.approach.riskDe, r.approach.riskEn)}</div>
                </td>
                <td className="p-2 text-right whitespace-nowrap">{eur(r.approach.setupEur)}</td>
                <td className="p-2 text-right whitespace-nowrap">{eur(r.opexPerYear)}</td>
                <td className="p-2 text-right whitespace-nowrap">
                  {r.monthsToFirstFee === null ? '–' : `${Math.round(r.monthsToFirstFee)} ${L('Mon.', 'mo.')}`}
                </td>
                <td className="p-2 text-right whitespace-nowrap">{r.closingsPerYear.toFixed(1)}</td>
                <td className={`p-2 text-right whitespace-nowrap font-semibold ${r.net24m >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {eur(r.net24m)}
                </td>
                <td className="p-2 text-right whitespace-nowrap">
                  {r.roi24m === null ? L('Helfer', 'enabler') : `${Math.round(r.roi24m * 100)} %`}
                </td>
                <td className="p-2 text-right whitespace-nowrap">
                  {r.paybackMonth === null ? '–' : `${r.paybackMonth} ${L('Mon.', 'mo.')}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-[var(--m-ink-3)]">
        {L(
          'Rechnung: Kontakte × Auftragsquote × Abschlussquote × Preis × Provision. Die erste Provision kommt erst nach Kontaktvorlauf, einem Monat bis zum Auftrag und acht Monaten Abwicklung. ROI 24 = Ergebnis nach 24 Monaten geteilt durch alle Kosten einschließlich Investition.',
          'Formula: leads × mandate rate × closing rate × price × fee. The first fee arrives only after the lead lag, one month to the mandate and eight months of processing. ROI 24 = net after 24 months divided by all costs including investment.',
        )}
      </p>

      <div>
        <h5 className="font-amelie font-bold text-sm text-[var(--m-ink)] mb-1.5">
          {L('90-Tage-Test statt Bauchgefühl', '90-day test instead of gut feeling')} ({eur(totalTest)})
        </h5>
        <ol className="list-decimal pl-5 space-y-1">
          {PHARMA_TEST_PLAN.map((t) => (
            <li key={t.de}>
              {L(t.de, t.en)} <span className="text-[var(--m-ink-3)]">({eur(t.budgetEur)})</span>
            </li>
          ))}
        </ol>
        <p className="mt-1.5 font-semibold text-[var(--m-ink)]">{L(PHARMA_TEST_STOP_DE, PHARMA_TEST_STOP_EN)}</p>
      </div>

      <div>
        <h5 className="font-amelie font-bold text-sm text-[var(--m-ink)] mb-1.5">
          {L('Belegte Marktdaten (Suchschnipsel, vor Nennung prüfen)', 'Evidence (search snippets, verify before quoting)')}
        </h5>
        <ul className="space-y-1">
          {PHARMA_FACTS.map((f) => {
            const src = PHARMA_SOURCES.find((s) => s.id === f.sourceId);
            return (
              <li key={f.sourceId + f.de.slice(0, 12)}>
                {L(f.de, f.en)}{' '}
                {src && (
                  <a href={src.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-[var(--m-accent)] hover:underline">
                    {src.title}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
