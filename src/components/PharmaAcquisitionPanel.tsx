import React, { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Language } from '../types';
import {
  APPROACHES,
  BASE_ASSUMPTIONS,
  PHARMA_FACTS,
  PHARMA_LAB_CONTRAST,
  PHARMA_LAB_FIRMS,
  PHARMA_LAB_KILL,
  PHARMA_LAB_MODELS,
  PHARMA_LAB_NEXT,
  PHARMA_LAB_PORTALS,
  PHARMA_LAB_RUN,
  PHARMA_SOURCES,
  PHARMA_TEST_PLAN,
  PHARMA_TEST_STOP_DE,
  PHARMA_TEST_STOP_EN,
  cashCurve,
  computeApproach,
  type LabName,
  type PharmaApproach,
  type Tri,
} from '../data/pharmaAcquisition';
import { APPROACH_ES, FACTS_ES, MISSING_ES, TEST_ES, TEST_STOP_ES } from '../data/pharmaAcquisitionEs';
import { VECTOR_KEYS, VECTOR_LABELS, type VentureScores } from '../data/venturesDashboard';

interface Props {
  lang: Language;
  /** Commercial Vectors des Leads (aus dem Dossier), wenn geladen. */
  vectors?: VentureScores | null;
}

const COLORS = ['#b45309', '#0f766e', '#4338ca', '#be123c', '#4d7c0f', '#a21caf', '#0369a1', '#78716c'];

const eur = (n: number) => `${n < 0 ? '−' : ''}${Math.abs(Math.round(n)).toLocaleString('de-DE')} €`;

export const PharmaAcquisitionPanel: React.FC<Props> = ({ lang, vectors }) => {
  const L = (de: string, en: string, es: string) => (lang === 'de' ? de : lang === 'es' ? es : en);
  const nameOf = (ap: PharmaApproach) => (lang === 'es' ? APPROACH_ES[ap.id].name : lang === 'de' ? ap.nameDe : ap.nameEn);
  const whatOf = (ap: PharmaApproach) => (lang === 'es' ? APPROACH_ES[ap.id].what : lang === 'de' ? ap.whatDe : ap.whatEn);
  const riskOf = (ap: PharmaApproach) => (lang === 'es' ? APPROACH_ES[ap.id].risk : lang === 'de' ? ap.riskDe : ap.riskEn);
  const mon = L('Mon.', 'mo.', 'm.');
  const tri = (t: Tri) => t[lang];
  const nameLinks = (list: LabName[]) => list.map((n, i) => (
    <React.Fragment key={n.url}>
      {i > 0 && ', '}
      <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-[var(--m-accent)] hover:underline">{n.name}</a>
    </React.Fragment>
  ));

  const [dealPriceEur, setDealPriceEur] = useState(BASE_ASSUMPTIONS.dealPriceEur);
  const [feePct, setFeePct] = useState(BASE_ASSUMPTIONS.feePct);
  const [mandateToClose, setMandateToClose] = useState(BASE_ASSUMPTIONS.mandateToClose);
  const assumptions = { ...BASE_ASSUMPTIONS, dealPriceEur, feePct, mandateToClose };

  const results = useMemo(
    () => APPROACHES.map((ap) => computeApproach(ap, { ...BASE_ASSUMPTIONS, dealPriceEur, feePct, mandateToClose })),
    [dealPriceEur, feePct, mandateToClose],
  );
  const curves = useMemo(
    () => APPROACHES.map((ap) => cashCurve(ap, { ...BASE_ASSUMPTIONS, dealPriceEur, feePct, mandateToClose }, 36)),
    [dealPriceEur, feePct, mandateToClose],
  );
  const totalTest = PHARMA_TEST_PLAN.reduce((s, t) => s + t.budgetEur, 0);
  const sellRows = results.filter((r) => r.roi24m !== null);

  // ── Diagramm 1: ROI nach 24 Monaten ────────────────────────────────────────
  const roiMax = Math.max(1, ...sellRows.map((r) => Math.abs(r.roi24m ?? 0)));
  const roiChartW = 560;
  const roiZero = 250;
  const roiScale = 240 / roiMax;

  // ── Diagramm 2: Kapitalkurven über 36 Monate ───────────────────────────────
  const curveW = 560;
  const curveH = 240;
  const cPad = { l: 56, r: 12, t: 12, b: 26 };
  const allVals = curves.flat();
  const yMin = Math.min(0, ...allVals);
  const yMax = Math.max(0, ...allVals);
  const yRange = yMax - yMin || 1;
  const x = (m: number) => cPad.l + (m / 36) * (curveW - cPad.l - cPad.r);
  const y = (v: number) => cPad.t + (1 - (v - yMin) / yRange) * (curveH - cPad.t - cPad.b);

  // ── Diagramm 3: Zeit bis zur ersten Provision und bis zur Amortisation ─────
  const timeMax = 42;

  const sectionTitle = 'font-amelie font-bold text-sm text-[var(--m-ink)] mb-1.5';

  return (
    <div id="venture-farmacia-mandate-engine" className="space-y-6 text-xs text-[var(--m-ink-2)]">
      <p className="leading-relaxed text-sm">
        {L(
          'Anfrage aus Reddit: Wie gewinnt ein Vermittler in Spanien Kunden für Kauf und Verkauf von Apotheken, mit Zeit, Kosten, Investition und ROI je Ansatz? Die Käuferseite ist nicht der Engpass, die Verkäufer sind es. Deshalb rechnen die Zeilen unten Aufträge von Verkäufern.',
          'Request from Reddit: how does a broker in Spain win clients for buying and selling pharmacies, with time, cost, investment and ROI per approach? Buyers are not the bottleneck, sellers are. So the rows below count mandates from sellers.',
          'Petición desde Reddit: cómo capta un intermediario en España clientes para la compraventa de farmacias, con tiempo, coste, inversión y ROI de cada enfoque. Los compradores no son el cuello de botella; los vendedores sí. Por eso las filas de abajo cuentan mandatos de vendedores.',
        )}
      </p>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-900">
        <span className="font-bold">{L('Annahmen, keine Messwerte. ', 'Assumptions, not measurements. ', 'Supuestos, no mediciones. ')}</span>
        {L(
          'Preis, Provision und Abschlussquote lassen sich unten ändern. Die Konversionsraten je Ansatz sind geraten; erst der 90-Tage-Test misst sie. Marktdaten sind Suchschnipsel vom 30.09.2026 und vor Nennung zu prüfen.',
          'Price, fee and closing rate can be changed below. The conversion rates per approach are guesses; only the 90-day test measures them. Market data are search snippets from 30 Sep 2026 and must be verified before quoting.',
          'Precio, comisión y tasa de cierre se pueden cambiar abajo. Las tasas de conversión de cada enfoque son estimaciones; solo la prueba de 90 días las mide. Los datos de mercado son fragmentos de búsqueda del 30.09.2026 y hay que comprobarlos antes de citarlos.',
        )}
      </div>

      {/* Regler */}
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="font-typewriter font-bold text-[var(--m-ink-3)]">{L('Kaufpreis je Apotheke', 'Price per pharmacy', 'Precio por farmacia')}: {eur(dealPriceEur)}</span>
          <input type="range" min={500_000} max={2_000_000} step={50_000} value={dealPriceEur}
            onChange={(e) => setDealPriceEur(Number(e.target.value))} className="w-full" />
        </label>
        <label className="block">
          <span className="font-typewriter font-bold text-[var(--m-ink-3)]">{L('Provision je Seite', 'Fee per side', 'Comisión por parte')}: {(feePct * 100).toFixed(1)} %</span>
          <input type="range" min={0.01} max={0.07} step={0.005} value={feePct}
            onChange={(e) => setFeePct(Number(e.target.value))} className="w-full" />
        </label>
        <label className="block">
          <span className="font-typewriter font-bold text-[var(--m-ink-3)]">{L('Aufträge, die abschließen', 'Mandates that close', 'Mandatos que cierran')}: {Math.round(mandateToClose * 100)} %</span>
          <input type="range" min={0.1} max={0.8} step={0.05} value={mandateToClose}
            onChange={(e) => setMandateToClose(Number(e.target.value))} className="w-full" />
        </label>
      </div>

      {/* Diagramm 1 */}
      <section>
        <h5 className={sectionTitle}>{L('ROI nach 24 Monaten', 'ROI after 24 months', 'ROI a 24 meses')}</h5>
        <svg viewBox={`0 0 ${roiChartW} ${sellRows.length * 30 + 8}`} className="w-full" role="img"
          aria-label={L('Balkendiagramm ROI je Ansatz', 'Bar chart of ROI per approach', 'Gráfico de barras del ROI por enfoque')}>
          <line x1={roiZero} x2={roiZero} y1={0} y2={sellRows.length * 30 + 8} stroke="currentColor" opacity={0.3} />
          {sellRows.map((r, i) => {
            const v = r.roi24m ?? 0;
            const w = Math.abs(v) * roiScale;
            const pos = v >= 0;
            return (
              <g key={r.approach.id} transform={`translate(0 ${i * 30 + 4})`}>
                <rect x={pos ? roiZero : roiZero - w} y={4} width={Math.max(w, 1)} height={16} rx={2}
                  fill={pos ? '#047857' : '#be123c'} opacity={0.85} />
                <text x={pos ? roiZero + w + 4 : roiZero - w - 4} y={16} fontSize={11} textAnchor={pos ? 'start' : 'end'} fill="currentColor">
                  {Math.round(v * 100)} %
                </text>
                <text x={pos ? 2 : roiChartW - 2} y={16} fontSize={10} textAnchor={pos ? 'start' : 'end'} fill="currentColor" opacity={0.7}>
                  {nameOf(r.approach)}
                </text>
              </g>
            );
          })}
        </svg>
      </section>

      {/* Diagramm 2 */}
      <section>
        <h5 className={sectionTitle}>{L('Kassenstand über 36 Monate (Investition eingerechnet)', 'Cumulative cash over 36 months (investment included)', 'Caja acumulada en 36 meses (inversión incluida)')}</h5>
        <svg viewBox={`0 0 ${curveW} ${curveH}`} className="w-full" role="img"
          aria-label={L('Liniendiagramm Kassenstand je Ansatz', 'Line chart of cumulative cash per approach', 'Gráfico de líneas de la caja acumulada por enfoque')}>
          {[yMin, 0, yMax].filter((v, i, a) => a.indexOf(v) === i).map((v) => (
            <g key={v}>
              <line x1={cPad.l} x2={curveW - cPad.r} y1={y(v)} y2={y(v)} stroke="currentColor" opacity={v === 0 ? 0.5 : 0.15} strokeDasharray={v === 0 ? undefined : '3 3'} />
              <text x={cPad.l - 4} y={y(v) + 3} fontSize={9} textAnchor="end" fill="currentColor">{Math.round(v / 1000)}k</text>
            </g>
          ))}
          {[0, 12, 24, 36].map((m) => (
            <text key={m} x={x(m)} y={curveH - 8} fontSize={9} textAnchor="middle" fill="currentColor">{m}</text>
          ))}
          {curves.map((c, i) => {
            if (APPROACHES[i].side === 'buy') return null;
            return (
              <polyline key={APPROACHES[i].id} fill="none" stroke={COLORS[i]} strokeWidth={1.8}
                points={c.map((v, m) => `${x(m).toFixed(1)},${y(v).toFixed(1)}`).join(' ')} />
            );
          })}
        </svg>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
          {APPROACHES.map((ap, i) => ap.side === 'buy' ? null : (
            <span key={ap.id} className="inline-flex items-center gap-1">
              <span className="inline-block w-3 h-0.5" style={{ background: COLORS[i] }} />
              {nameOf(ap)}
            </span>
          ))}
        </div>
      </section>

      {/* Diagramm 3 */}
      <section>
        <h5 className={sectionTitle}>{L('Wann kommt das erste Geld, wann ist es zurück?', 'When does the first fee arrive, when is it paid back?', '¿Cuándo llega la primera comisión y cuándo se recupera?')}</h5>
        <svg viewBox={`0 0 ${roiChartW} ${sellRows.length * 26 + 22}`} className="w-full" role="img"
          aria-label={L('Zeitachse bis erste Provision und Amortisation', 'Timeline to first fee and payback', 'Línea de tiempo hasta la primera comisión y la recuperación')}>
          {[0, 12, 24, 36].map((m) => {
            const px = 150 + (m / timeMax) * 390;
            return (
              <g key={m}>
                <line x1={px} x2={px} y1={0} y2={sellRows.length * 26} stroke="currentColor" opacity={0.15} strokeDasharray="3 3" />
                <text x={px} y={sellRows.length * 26 + 14} fontSize={9} textAnchor="middle" fill="currentColor">{m} {mon}</text>
              </g>
            );
          })}
          {sellRows.map((r, i) => {
            const first = r.monthsToFirstFee ?? 0;
            const pay = r.paybackMonth ?? timeMax;
            return (
              <g key={r.approach.id} transform={`translate(0 ${i * 26})`}>
                <text x={146} y={15} fontSize={10} textAnchor="end" fill="currentColor" opacity={0.75}>{nameOf(r.approach).slice(0, 26)}</text>
                <rect x={150} y={6} width={(first / timeMax) * 390} height={12} fill="#b45309" opacity={0.75} rx={2} />
                <rect x={150 + (first / timeMax) * 390} y={6} width={Math.max(0, ((pay - first) / timeMax) * 390)} height={12} fill="#0f766e" opacity={0.75} rx={2} />
                <text x={150 + (pay / timeMax) * 390 + 4} y={15} fontSize={9} fill="currentColor">
                  {r.paybackMonth === null ? `> ${timeMax}` : r.paybackMonth}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="flex gap-4 text-[11px]">
          <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-2" style={{ background: '#b45309' }} />{L('bis zur ersten Provision', 'until first fee', 'hasta la primera comisión')}</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-2" style={{ background: '#0f766e' }} />{L('bis Kosten gedeckt', 'until costs are covered', 'hasta cubrir los costes')}</span>
        </div>
      </section>

      {/* Tabelle */}
      <section>
        <h5 className={sectionTitle}>{L('Alle Zahlen je Ansatz', 'All numbers per approach', 'Todas las cifras por enfoque')}</h5>
        <div className="overflow-x-auto rounded-xl border border-[var(--m-line)]">
          <table className="w-full text-[11px]">
            <thead className="bg-[var(--m-sunk)] text-left text-[var(--m-ink-3)]">
              <tr>
                <th className="p-2">{L('Ansatz', 'Approach', 'Enfoque')}</th>
                <th className="p-2 text-right">{L('Investition', 'Investment', 'Inversión')}</th>
                <th className="p-2 text-right">{L('Kosten/Jahr', 'Cost/yr', 'Coste/año')}</th>
                <th className="p-2 text-right">{L('Erste Provision', 'First fee', 'Primera comisión')}</th>
                <th className="p-2 text-right">{L('Abschlüsse/Jahr', 'Closings/yr', 'Cierres/año')}</th>
                <th className="p-2 text-right">{L('Ergebnis 24 Mon.', 'Net 24 mo.', 'Resultado 24 m')}</th>
                <th className="p-2 text-right">ROI 24</th>
                <th className="p-2 text-right">{L('Amortisiert', 'Payback', 'Recuperación')}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.approach.id} className="border-t border-[var(--m-sunk)] align-top">
                  <td className="p-2 min-w-[14rem]">
                    <div className="font-semibold text-[var(--m-ink)]">{nameOf(r.approach)}</div>
                    <div className="mt-0.5">{whatOf(r.approach)}</div>
                    <div className="mt-0.5 text-[var(--m-ink-3)]">{L('Risiko: ', 'Risk: ', 'Riesgo: ')}{riskOf(r.approach)}</div>
                  </td>
                  <td className="p-2 text-right whitespace-nowrap">{eur(r.approach.setupEur)}</td>
                  <td className="p-2 text-right whitespace-nowrap">{eur(r.opexPerYear)}</td>
                  <td className="p-2 text-right whitespace-nowrap">{r.monthsToFirstFee === null ? '–' : `${Math.round(r.monthsToFirstFee)} ${mon}`}</td>
                  <td className="p-2 text-right whitespace-nowrap">{r.closingsPerYear.toFixed(1)}</td>
                  <td className={`p-2 text-right whitespace-nowrap font-semibold ${r.net24m >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>{eur(r.net24m)}</td>
                  <td className="p-2 text-right whitespace-nowrap">{r.roi24m === null ? L('Helfer', 'enabler', 'apoyo') : `${Math.round(r.roi24m * 100)} %`}</td>
                  <td className="p-2 text-right whitespace-nowrap">{r.paybackMonth === null ? '–' : `${r.paybackMonth} ${mon}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-1.5 text-[11px] text-[var(--m-ink-3)]">
          {L(
            `Rechnung: Kontakte × Auftragsquote × Abschlussquote × Preis × Provision. Die erste Provision kommt erst nach Kontaktvorlauf, einem Monat bis zum Auftrag und ${assumptions.monthsMandateToClose} Monaten Abwicklung. ROI 24 = Ergebnis nach 24 Monaten geteilt durch alle Kosten einschließlich Investition.`,
            `Formula: leads × mandate rate × closing rate × price × fee. The first fee arrives only after the lead lag, one month to the mandate and ${assumptions.monthsMandateToClose} months of processing. ROI 24 = net after 24 months divided by all costs including investment.`,
            `Cálculo: contactos × tasa de mandato × tasa de cierre × precio × comisión. La primera comisión llega tras el retraso del contacto, un mes hasta el mandato y ${assumptions.monthsMandateToClose} meses de tramitación. ROI 24 = resultado a 24 meses dividido entre todos los costes, inversión incluida.`,
          )}
        </p>
      </section>

      {/* Vektoren */}
      {vectors && (
        <section className="max-w-md">
          <h5 className={sectionTitle}>{L('Die fünf Commercial Vectors (0–5)', 'The five commercial vectors (0–5)', 'Los cinco vectores comerciales (0–5)')}</h5>
          <div className="space-y-1">
            {VECTOR_KEYS.map((k) => (
              <div key={k} className="flex items-center gap-2 text-[11px]">
                <span className="w-28 shrink-0 text-[var(--m-ink-3)]">{VECTOR_LABELS[k][lang]}</span>
                <div className="flex-1 h-1.5 rounded bg-[var(--m-sunk)]"><div className="h-1.5 rounded bg-[var(--m-accent)]" style={{ width: `${(vectors[k] / 5) * 100}%` }} /></div>
                <span className="font-typewriter w-4 text-right">{vectors[k]}</span>
              </div>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-[var(--m-ink-3)]">
            {L(
              'Urteil: Der Markt trägt, aber es ist kein Software-Produkt, sondern ein Dienstleistungsgeschäft mit Daten-Hebel. Kein Code, bevor die Briefe zeigen, wie viele Inhaber antworten.',
              'Verdict: the market pays, but this is a services business with a data lever, not a software product. No code before the letters show how many owners reply.',
              'Veredicto: el mercado existe y es rentable, pero no es un producto de software, sino un negocio de servicios con un multiplicador de datos. Nada de código antes de que las cartas muestren cuántos titulares responden.',
            )}
          </p>
        </section>
      )}

      {/* Test */}
      <section>
        <h5 className={sectionTitle}>
          {L('90-Tage-Test statt Bauchgefühl', '90-day test instead of gut feeling', 'Prueba de 90 días en lugar de intuición')} ({eur(totalTest)})
        </h5>
        <ol className="list-decimal pl-5 space-y-1">
          {PHARMA_TEST_PLAN.map((t, i) => (
            <li key={t.de}>
              {lang === 'es' ? TEST_ES[i] : lang === 'de' ? t.de : t.en} <span className="text-[var(--m-ink-3)]">({eur(t.budgetEur)})</span>
            </li>
          ))}
        </ol>
        <p className="mt-1.5 font-semibold text-[var(--m-ink)]">{L(PHARMA_TEST_STOP_DE, PHARMA_TEST_STOP_EN, TEST_STOP_ES)}</p>
      </section>

      {/* Zweiter Lauf: Amélie-lab */}
      <section id="venture-farmacia-lab-run">
        <h5 className={sectionTitle}>{L('Zweite Analyse aus dem Lab: vier Geschäftsmodelle', 'Second analysis from the lab: four business models', 'Segundo análisis del Lab: cuatro modelos de negocio')}</h5>
        <p className="leading-relaxed">
          {L(
            `Dieselbe Frage lief am 30.09.2026 im Schwesterprojekt Amélie-lab (Agent Mark, ${PHARMA_LAB_RUN.searches} Suchen). Mark verglich keine Akquisewege, sondern vier Geschäftsmodelle. Zeit, Kosten und ROI je Modell lieferte der Lauf nicht; die Zahlen oben bleiben die einzigen.`,
            `The same question ran on 30 Sep 2026 in the sister project Amélie-lab (agent Mark, ${PHARMA_LAB_RUN.searches} searches). Mark did not compare acquisition channels but four business models. The run gave no time, cost or ROI per model; the numbers above remain the only ones.`,
            `La misma pregunta se analizó el 30.09.2026 en el proyecto hermano Amélie-lab (agente Mark, ${PHARMA_LAB_RUN.searches} búsquedas). Mark no comparó vías de captación, sino cuatro modelos de negocio. El análisis no dio tiempos, costes ni ROI por modelo; las cifras de arriba siguen siendo las únicas.`,
          )}
        </p>
        <div className="mt-2 overflow-x-auto rounded-xl border border-[var(--m-line)]">
          <table className="w-full text-[11px]">
            <thead className="bg-[var(--m-sunk)] text-left text-[var(--m-ink-3)]">
              <tr>
                <th className="p-2">{L('Modell', 'Model', 'Modelo')}</th>
                <th className="p-2">{L('Betreiber', 'Run by', 'Lo opera')}</th>
                <th className="p-2">{L('Stand', 'Status', 'Estado')}</th>
              </tr>
            </thead>
            <tbody>
              {PHARMA_LAB_MODELS.map((m) => (
                <tr key={m.id} data-lab-model={m.id} className="border-t border-[var(--m-sunk)] align-top">
                  <td className="p-2 min-w-[14rem]">
                    <div className="font-semibold text-[var(--m-ink)]">{tri(m.name)}</div>
                    <div className="mt-0.5">{tri(m.note)}</div>
                    {m.reopen && <div className="mt-0.5 text-[var(--m-ink-3)]">{tri(m.reopen)}</div>}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {m.operator === 'actor'
                      ? L('der Vermittler selbst', 'the broker', 'el propio intermediario')
                      : L('Produkt für Dritte', 'product for others', 'producto para terceros')}
                  </td>
                  <td className={`p-2 whitespace-nowrap font-semibold ${m.status === 'shortlist' ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {m.status === 'shortlist' ? L('engere Wahl', 'shortlisted', 'en la lista corta') : L('verworfen', 'killed', 'descartado')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h6 className="mt-3 font-semibold text-[var(--m-ink)]">{L('Was noch niemand beantwortet hat', 'What nobody has answered yet', 'Lo que todavía nadie ha respondido')}</h6>
        <ol className="mt-1 list-decimal pl-5 space-y-1">
          {PHARMA_LAB_NEXT.map((c) => <li key={c.en}>{tri(c)}</li>)}
        </ol>

        <h6 className="mt-3 font-semibold text-[var(--m-ink)]">{L('Gegen das Modell oben gelesen', 'Read against the model above', 'Contrastado con el modelo de arriba')}</h6>
        <ul className="mt-1 list-disc pl-5 space-y-1">
          {PHARMA_LAB_CONTRAST.map((c) => <li key={c.en}>{tri(c)}</li>)}
        </ul>

        <h6 className="mt-3 font-semibold text-[var(--m-ink)]">{L('Abbruchkriterien des Labs', 'The lab’s kill criteria', 'Criterios de descarte del Lab')}</h6>
        <ul className="mt-1 list-disc pl-5 space-y-1">
          {PHARMA_LAB_KILL.map((c) => <li key={c.en}>{tri(c)}</li>)}
        </ul>

        <h6 className="mt-3 font-semibold text-[var(--m-ink)]">{L('Weitere Namen im Markt', 'More names in the market', 'Más nombres en el mercado')}</h6>
        <p className="mt-1">
          {L('Kanzleien und Berater, die das Lab als direkte Konkurrenz führt: ', 'Law firms and advisers the lab lists as direct competitors: ', 'Despachos y asesores que el Lab clasifica como competencia directa: ')}
          {nameLinks(PHARMA_LAB_FIRMS)}.
        </p>
        <p className="mt-1">
          {L('Vermittler und Portale aus den Suchtreffern (nicht einzeln geprüft): ', 'Brokers and portals from the search hits (not checked one by one): ', 'Intermediarios y portales de los resultados de búsqueda (sin comprobar uno a uno): ')}
          {nameLinks(PHARMA_LAB_PORTALS)}.
        </p>

        <p className="mt-2 text-[11px] text-[var(--m-ink-3)]">
          {L(
            `Belegqualität des Lab-Laufs: Von 16 Tatsachenbehauptungen stützt die zitierte Seite ${PHARMA_LAB_RUN.factChecks.supported}, ${PHARMA_LAB_RUN.factChecks.partial} nur teilweise, ${PHARMA_LAB_RUN.factChecks.unsupported} nicht, ${PHARMA_LAB_RUN.factChecks.unchecked} blieben ungeprüft. In die Belege unten kamen nur gestützte Aussagen.`,
            `Evidence quality of the lab run: of 16 factual claims the cited page supports ${PHARMA_LAB_RUN.factChecks.supported}, ${PHARMA_LAB_RUN.factChecks.partial} only in part, ${PHARMA_LAB_RUN.factChecks.unsupported} not at all, and ${PHARMA_LAB_RUN.factChecks.unchecked} were not checked. Only supported claims went into the evidence below.`,
            `Calidad de las evidencias del Lab: de 16 afirmaciones de hecho, la página citada respalda ${PHARMA_LAB_RUN.factChecks.supported}, ${PHARMA_LAB_RUN.factChecks.partial} solo en parte, ${PHARMA_LAB_RUN.factChecks.unsupported} no, y ${PHARMA_LAB_RUN.factChecks.unchecked} quedaron sin comprobar. A los datos de abajo solo pasaron las respaldadas.`,
          )}
        </p>
      </section>

      {/* Belege */}
      <section>
        <h5 className={sectionTitle}>{L('Belegte Marktdaten (Suchschnipsel, vor Nennung prüfen)', 'Evidence (search snippets, verify before quoting)', 'Datos de mercado (fragmentos de búsqueda, comprobar antes de citar)')}</h5>
        <ul className="space-y-1">
          {PHARMA_FACTS.map((f, i) => {
            const src = PHARMA_SOURCES.find((s) => s.id === f.sourceId);
            return (
              <li key={f.sourceId + f.de.slice(0, 12)}>
                {lang === 'es' ? FACTS_ES[i] : lang === 'de' ? f.de : f.en}{' '}
                {src && (
                  <a href={src.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-[var(--m-accent)] hover:underline">
                    {src.title}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {f.labChecked && (
                  <span className="ml-1 text-[var(--m-ink-3)]">({L('Seite vom Lab gelesen', 'page read by the lab', 'página leída por el Lab')})</span>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Lücken */}
      <section>
        <h5 className={sectionTitle}>{L('Was noch fehlt', 'What is still missing', 'Qué falta por comprobar')}</h5>
        <ul className="list-disc pl-5 space-y-0.5">
          {(lang === 'es' ? MISSING_ES : lang === 'de' ? MISSING_DE : MISSING_EN).map((m) => <li key={m}>{m}</li>)}
        </ul>
      </section>
    </div>
  );
};

const MISSING_DE = [
  'Jährliche Zahl der Übertragungen in ganz Spanien (nicht gefunden).',
  'Echte Vermittlertarife (keiner veröffentlicht).',
  'Rechtliche Herkunft der Inhaberadressen (Kammern, Register der Autonomen Gemeinschaften).',
  'Correos-Tarif 2026 für personalisierte Briefe, Tarife von Correo Farmacéutico und El Global, Preis des Infarma-Stands.',
  'Termin der nächsten Infarma.',
  'Nachfrage und Preis eines bezahlten Leitfadens zum Übertragungsrecht je Autonomer Gemeinschaft (Vorschlag des Labs).',
];
const MISSING_EN = [
  'Annual number of transfers across Spain (not found).',
  'Real broker rates (none published).',
  'Legal source of owners’ addresses (professional colleges, regional registers).',
  'Correos 2026 rate for personalised letters, Correo Farmacéutico and El Global rates, Infarma stand price.',
  'Date of the next Infarma.',
  'Demand and price for a paid guide to transfer rules per autonomous community (the lab’s proposal).',
];
