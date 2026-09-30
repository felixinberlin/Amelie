import React, { useMemo, useState } from 'react';
import { ShieldAlert, ExternalLink, HelpCircle, AlertTriangle } from 'lucide-react';
import { Language } from '../../types';
import {
  ANHANG_BEISPIELE,
  HERKUNFT_LABEL,
  Herkunft,
  KRITERIEN,
  KriteriumId,
  Punktwert,
  SCHEMA_QUELLE,
} from '../../engine/glasanflug/schema';
import { Eingabe, bewerte, signifikanzschwelle } from '../../engine/glasanflug/score';
import {
  KATEGORIE_TEXT,
  Testart,
  WUA_MUSTER,
  findeMuster,
  pruefeMarkierung,
} from '../../engine/glasanflug/markierung';
import { GlasanflugVisualizer } from './GlasanflugVisualizer';

interface GlasanflugSimulatorProps {
  lang: Language;
  onOpenDose?: (doseId: string) => void;
  isEmbedded?: boolean;
}

const HERKUENFTE: Herkunft[] = ['eingabe', 'bild', 'geodaten', 'unbestimmt'];

const START: Eingabe = {
  glasanteil: { punkte: 3, herkunft: 'bild' },
  fassadengestaltung: { punkte: 4, herkunft: 'bild' },
  umgebung: { punkte: 3, herkunft: 'geodaten' },
  gehoelzabstand: { punkte: 3, herkunft: 'geodaten' },
};

const STUFEN_FARBE: Record<string, string> = {
  gering: 'bg-emerald-950/80 border-emerald-700 text-emerald-100',
  mittel: 'bg-amber-950/80 border-amber-600 text-amber-100',
  hoch: 'bg-rose-950/80 border-rose-700 text-rose-100',
};

const PUNKT_FARBE: Record<string, string> = {
  gering: 'bg-emerald-500 text-white',
  mittel: 'bg-amber-500 text-stone-950',
  hoch: 'bg-rose-600 text-white',
};

export const GlasanflugSimulator: React.FC<GlasanflugSimulatorProps> = ({
  lang,
  onOpenDose,
  isEmbedded = false,
}) => {
  const de = lang === 'de';
  const [eingabe, setEingabe] = useState<Eingabe>(START);
  const [fussnote2, setFussnote2] = useState('');
  const [kollisionen, setKollisionen] = useState('6');
  const [fassadenlaenge, setFassadenlaenge] = useState('120');

  const [testart, setTestart] = useState<Testart>('spiegelung');
  const [musterNr, setMusterNr] = useState<string>('6S');
  const [ebene, setEbene] = useState<1 | 2>(2);
  const [ar, setAr] = useState('8');

  const markierung = useMemo(
    () =>
      pruefeMarkierung({
        test: testart,
        musterNr: musterNr === '' ? null : musterNr,
        position: ebene,
        arProzent: ar.trim() === '' || Number.isNaN(Number(ar)) ? null : Number(ar),
      }),
    [testart, musterNr, ebene, ar]
  );
  const ergebnis = useMemo(() => bewerte(eingabe, fussnote2), [eingabe, fussnote2]);
  const monitoring = useMemo(
    () => signifikanzschwelle(Number(kollisionen), Number(fassadenlaenge)),
    [kollisionen, fassadenlaenge]
  );

  const setPunkte = (id: KriteriumId, punkte: Punktwert) =>
    setEingabe((e) => ({
      ...e,
      [id]: { punkte, herkunft: e[id].herkunft === 'unbestimmt' ? 'eingabe' : e[id].herkunft },
    }));

  const setHerkunft = (id: KriteriumId, herkunft: Herkunft) =>
    setEingabe((e) => ({
      ...e,
      [id]: herkunft === 'unbestimmt' ? { punkte: null, herkunft } : { punkte: e[id].punkte ?? 1, herkunft },
    }));

  const glasVoll = eingabe.glasanteil.punkte === 4;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ---------------- Eingabe ---------------- */}
      <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
        <div className="flex items-start justify-between pb-3 border-b border-stone-100 gap-3">
          <h3 className="font-serif-title font-bold text-stone-900 text-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <span>{de ? 'Vogelschlagrisiko an Glas' : 'Bird collision risk at glass'}</span>
          </h3>
          <span className="text-[10px] font-mono-code bg-stone-100 text-stone-700 px-2 py-1 rounded border border-stone-200 text-right leading-tight shrink-0">
            {SCHEMA_QUELLE}
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          {de
            ? 'Vier Kriterien mit je 1 bis 4 Punkten, Summe 4 bis 16. Zwei Regeln überstimmen die Summe. Jeder Wert trägt mit, woher er kommt — was das Bild nicht hergibt, bleibt unbestimmt und wird nicht geraten.'
            : 'Four criteria at 1 to 4 points each, sum 4 to 16. Two rules override the sum. Every value carries its origin — whatever the image cannot supply stays undetermined and is not guessed.'}
        </p>

        {/* Beispiele aus dem Anhang */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider font-mono-code text-stone-500 mb-1.5">
            {de ? 'Beispiele aus dem Anhang des Beschlusses' : 'Worked examples from the decision’s annex'}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ANHANG_BEISPIELE.map((b) => (
              <button
                key={b.ortDe}
                onClick={() => {
                  setEingabe({
                    glasanteil: { punkte: b.werte.glasanteil, herkunft: 'eingabe' },
                    fassadengestaltung: { punkte: b.werte.fassadengestaltung, herkunft: 'eingabe' },
                    umgebung: { punkte: b.werte.umgebung, herkunft: 'eingabe' },
                    gehoelzabstand: { punkte: b.werte.gehoelzabstand, herkunft: 'eingabe' },
                  });
                  setFussnote2('');
                }}
                className="text-[11px] px-2 py-1 rounded-lg border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all text-stone-700"
              >
                {de ? b.ortDe : b.ortEn}
              </button>
            ))}
          </div>
        </div>

        {/* Die vier Kriterien */}
        {KRITERIEN.map((k) => {
          const wert = eingabe[k.id];
          return (
            <div key={k.id} className="pt-1">
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600">
                  {de ? k.nameDe : k.nameEn}
                </label>
                <span className="text-[10px] text-stone-400 font-mono-code shrink-0">
                  {de ? k.quelleDe : k.quelleEn}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {k.stufen.map((s) => {
                  const aktiv = wert.punkte === s.punkte;
                  return (
                    <button
                      key={s.punkte}
                      onClick={() => setPunkte(k.id, s.punkte)}
                      title={de ? s.de : s.en}
                      className={`p-2 rounded-xl border text-left transition-all text-[11px] leading-snug ${
                        aktiv
                          ? 'border-amber-800 bg-amber-50/80 font-bold text-stone-900'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                      }`}
                    >
                      <span className="font-mono-code text-[10px] block opacity-60">{s.punkte}</span>
                      {(de ? s.de : s.en).split('—')[0].trim()}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-1 mt-1.5">
                {HERKUENFTE.map((h) => (
                  <button
                    key={h}
                    onClick={() => setHerkunft(k.id, h)}
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono-code border transition-all ${
                      wert.herkunft === h
                        ? h === 'unbestimmt'
                          ? 'border-stone-400 bg-stone-200 text-stone-800'
                          : 'border-stone-300 bg-stone-100 text-stone-800'
                        : 'border-transparent text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {HERKUNFT_LABEL[h][de ? 'de' : 'en']}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Fußnote 2 */}
        {glasVoll && (
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <label className="block text-[11px] font-semibold text-stone-700">
              {de
                ? 'Ausnahme nach Fußnote 2 — nur mit Begründung'
                : 'Exception under footnote 2 — only with a reason'}
            </label>
            <p className="text-[10px] text-stone-500 leading-relaxed">
              {de
                ? 'Der Beschluss lässt zu, dass transparente oder spiegelnde Flächen im Einzelfall unproblematisch sind, etwa bei einer Straßenflucht ohne Baumbestand. Ohne Text greift die Regel „immer hoch".'
                : 'The decision allows transparent or mirrored surfaces to be unproblematic in individual cases, e.g. a street front without trees. Without a reason, the "always high" rule applies.'}
            </p>
            <input
              value={fussnote2}
              onChange={(e) => setFussnote2(e.target.value)}
              placeholder={de ? 'z. B. keine Vegetation im Spiegelbild' : 'e.g. no vegetation reflected'}
              className="w-full text-[11px] px-2 py-1.5 rounded-lg border border-stone-300 focus:border-amber-700 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* ---------------- Das Blatt ---------------- */}
      <div className="lg:col-span-6 space-y-4">
        {/* Optischer Fassaden- & Flugbahn-Simulator */}
        <GlasanflugVisualizer
          lang={lang}
          eingabe={eingabe}
          stufe={ergebnis.stufe}
          summe={ergebnis.summe}
        />

        <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md border border-stone-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono-code uppercase tracking-wider text-stone-400">
              {de ? 'Das Blatt' : 'The sheet'}
            </span>
            <span className="text-xs font-mono-code text-stone-300">BNatSchG § 44 Abs. 1 Nr. 1</span>
          </div>

          {/* Faktorenliste */}
          <div className="space-y-2 mb-5">
            {KRITERIEN.map((k) => {
              const w = eingabe[k.id];
              const stufe = k.stufen.find((s) => s.punkte === w.punkte);
              return (
                <div key={k.id} className="text-xs border-b border-stone-800 pb-2 last:border-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-stone-300">{de ? k.nameDe : k.nameEn}</span>
                    <span className="font-mono-code shrink-0 text-stone-100">
                      {w.punkte === null ? '—' : w.punkte}
                      <span className="text-stone-500 ml-1">({HERKUNFT_LABEL[w.herkunft][de ? 'de' : 'en']})</span>
                    </span>
                  </div>
                  {stufe && w.punkte !== null && (
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">{de ? stufe.de : stufe.en}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Ergebnis */}
          {!ergebnis.vollstaendig ? (
            <div className="p-5 rounded-xl border border-stone-600 bg-stone-800/60 flex items-start gap-3">
              <HelpCircle className="w-6 h-6 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif-title font-bold text-base text-stone-100">
                  {de ? 'Keine Einstufung' : 'No classification'}
                </h4>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  {de
                    ? `Unbestimmt: ${ergebnis.unbestimmt
                        .map((id) => KRITERIEN.find((k) => k.id === id)!.nameDe)
                        .join(', ')}. Fehlende Kriterien vor Ort oder aus den Unterlagen ergänzen — geraten wird hier nichts.`
                    : `Undetermined: ${ergebnis.unbestimmt
                        .map((id) => KRITERIEN.find((k) => k.id === id)!.nameEn)
                        .join(', ')}. Fill the missing criteria on site or from the documents — nothing is guessed here.`}
                </p>
              </div>
            </div>
          ) : (
            <div className={`p-5 rounded-xl border mb-3 flex items-center gap-4 ${STUFEN_FARBE[ergebnis.stufe!]}`}>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold font-mono-code shrink-0 ${
                  PUNKT_FARBE[ergebnis.stufe!]
                }`}
              >
                {ergebnis.summe}
              </div>
              <div>
                <h4 className="font-serif-title font-bold text-base uppercase">{ergebnis.stufe}</h4>
                <p className="text-xs opacity-90 mt-0.5 leading-relaxed">
                  {de ? ergebnis.eintrag!.bewertungDe : ergebnis.eintrag!.bewertungEn}
                </p>
                <p className="text-[11px] opacity-80 mt-1.5 leading-relaxed">
                  {de ? ergebnis.eintrag!.handlungsbedarfDe : ergebnis.eintrag!.handlungsbedarfEn}
                </p>
              </div>
            </div>
          )}

          {/* Vorrangregeln */}
          {ergebnis.vorrang.map((v, i) => (
            <div
              key={i}
              className={`text-[11px] leading-relaxed p-3 rounded-xl border mb-2 flex items-start gap-2 ${
                v.art === 'konflikt'
                  ? 'border-amber-600 bg-amber-950/60 text-amber-100'
                  : 'border-stone-700 bg-stone-800/60 text-stone-300'
              }`}
            >
              {v.art === 'konflikt' && <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>{de ? v.de : v.en}</span>
            </div>
          ))}

          <div className="pt-4 border-t border-stone-800 text-xs flex items-center justify-between text-stone-400 gap-3">
            {onOpenDose ? (
              <button
                onClick={() => onOpenDose('glasanflug-ampel')}
                className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>{de ? 'Dose: Glasanflug-Ampel' : 'Tin: Bird Glass Hazard Score'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            ) : (
              <span>{de ? 'Empfänger: NABU Berlin / NABU Jena' : 'Recipient: NABU Berlin / NABU Jena'}</span>
            )}
            <span className="text-amber-400 font-mono-code shrink-0">
              {de ? 'Status: verengt' : 'Status: narrowed'}
            </span>
          </div>
        </div>

        {/* Schwellenwerte aus dem Monitoring */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider font-mono-code text-stone-500 block">
            {de ? 'Anderer Weg: Monitoring am Bestandsbau' : 'The other route: monitoring an existing building'}
          </span>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            {de
              ? 'Wo gezählt wurde, entscheidet nicht das Punkteschema, sondern der Schwellenwert: zwei Schlagopfer je 100 m Fassadenlänge und Jahr gelten als normal, ab fünf als signifikant erhöht.'
              : 'Where counts exist, the point scheme does not decide — the threshold does: two victims per 100 m of façade per year count as normal, five or more as significantly elevated.'}
          </p>
          <div className="flex items-end gap-2">
            <label className="text-[11px] text-stone-600 flex-1">
              {de ? 'Funde / Jahr' : 'Finds / year'}
              <input
                type="number"
                min="0"
                value={kollisionen}
                onChange={(e) => setKollisionen(e.target.value)}
                className="w-full mt-0.5 text-xs px-2 py-1 rounded-lg border border-stone-300 focus:border-amber-700 focus:outline-none"
              />
            </label>
            <label className="text-[11px] text-stone-600 flex-1">
              {de ? 'Fassadenlänge (m)' : 'Façade length (m)'}
              <input
                type="number"
                min="1"
                value={fassadenlaenge}
                onChange={(e) => setFassadenlaenge(e.target.value)}
                className="w-full mt-0.5 text-xs px-2 py-1 rounded-lg border border-stone-300 focus:border-amber-700 focus:outline-none"
              />
            </label>
          </div>
          {monitoring && (
            <p
              className={`text-xs font-semibold ${
                monitoring.signifikantErhoeht ? 'text-rose-800' : 'text-emerald-800'
              }`}
            >
              {monitoring.je100m} {de ? 'je 100 m und Jahr — ' : 'per 100 m per year — '}
              {monitoring.signifikantErhoeht
                ? de
                  ? 'signifikant erhöht'
                  : 'significantly elevated'
                : de
                ? 'unterhalb der Signifikanzschwelle'
                : 'below the significance threshold'}
            </p>
          )}
          <p className="text-[10px] text-stone-500 leading-relaxed">
            {de
              ? 'Nur für Bestandsbauten mit Monitoring. Fundraten sind vorher um Abräumung durch Prädatoren und Sucheffizienz zu korrigieren — in Deutschland werden schätzungsweise nur 15 bis 35 % der Opfer gefunden.'
              : 'Only for existing buildings with monitoring. Find rates must first be corrected for scavenging and searcher efficiency — an estimated 15 to 35 % of victims are ever found.'}
          </p>
        </div>


        {/* Markierungsnachweis gegen die WUA-Tabelle */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider font-mono-code text-stone-500 block">
            {de ? 'Markierung gegen geprüfte Muster (WUA, Demo-Auszug)' : 'Marking vs. tested patterns (WUA, demo excerpt)'}
          </span>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            {de
              ? 'Ein Muster, das nicht in der Tabelle steht, ist nicht getestet — nicht unwirksam. Die Tabelle sind produktspezifische Flugtunnel-Ergebnisse, keine verbindliche Liste.'
              : 'A pattern missing from the table is untested — not ineffective. The table lists product-specific flight-tunnel results, not a binding list.'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[11px] text-stone-600 col-span-2">
              {de ? 'Anwendungsfall' : 'Use case'}
              <select
                value={testart}
                onChange={(e) => {
                  const t = e.target.value as Testart;
                  setTestart(t);
                  if (musterNr && findeMuster(musterNr)?.test !== t) setMusterNr('');
                }}
                className="w-full mt-0.5 text-xs px-2 py-1 rounded-lg border border-stone-300"
              >
                <option value="spiegelung">{de ? 'Fenster/Fassade (Spiegelung, WIN)' : 'Window/façade (reflection, WIN)'}</option>
                <option value="durchsicht">{de ? 'Lärmschutzwand/Brüstung (Durchsicht, ONR)' : 'Noise barrier/balustrade (see-through, ONR)'}</option>
              </select>
            </label>
            <label className="text-[11px] text-stone-600 col-span-2">
              {de ? 'Geplantes Muster' : 'Planned pattern'}
              <select
                value={musterNr}
                onChange={(e) => setMusterNr(e.target.value)}
                className="w-full mt-0.5 text-xs px-2 py-1 rounded-lg border border-stone-300"
              >
                <option value="">{de ? 'Anderes Muster (nicht in der Tabelle)' : 'Other pattern (not in the table)'}</option>
                {WUA_MUSTER.filter((m) => m.test === testart).map((m) => (
                  <option key={m.nr} value={m.nr}>
                    {m.nr} · {de ? m.nameDe : m.nameEn}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[11px] text-stone-600">
              {de ? 'Ebene' : 'Position'}
              <select
                value={ebene}
                onChange={(e) => setEbene(Number(e.target.value) as 1 | 2)}
                className="w-full mt-0.5 text-xs px-2 py-1 rounded-lg border border-stone-300"
              >
                <option value={1}>{de ? '1 · Anflugseite' : '1 · approach side'}</option>
                <option value={2}>{de ? '2 · Rückseite/innen' : '2 · back/inner'}</option>
              </select>
            </label>
            {testart === 'spiegelung' && (
              <label className="text-[11px] text-stone-600">
                {de ? 'Außenreflexion AR (%) — leer = unbekannt' : 'External reflectance AR (%) — empty = unknown'}
                <input
                  value={ar}
                  onChange={(e) => setAr(e.target.value)}
                  inputMode="decimal"
                  className="w-full mt-0.5 text-xs px-2 py-1 rounded-lg border border-stone-300 focus:border-amber-700 focus:outline-none"
                />
              </label>
            )}
          </div>
          <div
            className={`p-3 rounded-xl border text-xs ${
              markierung.befund === 'getestet'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : markierung.befund === 'nicht_getestet'
                ? 'bg-stone-50 border-stone-300 text-stone-800'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <p className="font-semibold">
              {markierung.befund === 'getestet' &&
                (de ? 'Geprüft, Geltungsbereich eingehalten' : 'Tested, scope respected')}
              {markierung.befund === 'nicht_getestet' && (de ? 'Nicht getestet — Wirkung unbekannt' : 'Not tested — effect unknown')}
              {markierung.befund === 'geltungsbereich_ueberschritten' &&
                (de ? 'Außerhalb des geprüften Geltungsbereichs' : 'Outside the tested scope')}
              {markierung.befund === 'ebene_abweichend' &&
                (de ? 'Andere Ebene als geprüft' : 'Different position than tested')}
            </p>
            {markierung.muster && markierung.kategorie && (
              <p className="mt-1 font-mono-code text-[11px]">
                {markierung.muster.nr}: {markierung.muster.anfluegeProzent} % {de ? 'Anflüge' : 'strikes'} → {de ? 'Kategorie' : 'category'}{' '}
                {markierung.kategorie} ({KATEGORIE_TEXT[markierung.kategorie].grenze}) · {de ? KATEGORIE_TEXT[markierung.kategorie].de : KATEGORIE_TEXT[markierung.kategorie].en}
              </p>
            )}
            <ul className="mt-1.5 space-y-1 list-disc pl-4 text-[11px] leading-relaxed">
              {markierung.hinweise.map((h, i) => (
                <li key={i}>{de ? h.de : h.en}</li>
              ))}
            </ul>
          </div>
          <p className="text-[10px] text-stone-500 leading-relaxed">
            {de
              ? 'Quelle: Wiener Umweltanwaltschaft / Biologische Station Hohenau-Ringelsdorf, Geprüfte Muster, 5. Aufl. 2022 (Tatsachenauszug zur Demo). Vor Verwendung gegen wua-wien.at prüfen; Nachnutzungsrecht an der Tabelle ist nicht geklärt.'
              : 'Source: Vienna Environmental Advocacy / Hohenau-Ringelsdorf Biological Station, tested patterns, 5th ed. 2022 (factual excerpt for the demo). Check against wua-wien.at before use; reuse rights for the table are not cleared.'}
          </p>
        </div>

        {!isEmbedded && (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-1">
            <span className="font-bold block text-amber-900">
              {de ? 'Was hier fehlt — und das ist die Idee' : 'What is missing here — and that is the idea'}
            </span>
            <p className="text-amber-900/90 text-[11px] leading-relaxed">
              {de
                ? 'Die vier Werte oben klickt hier noch ein Mensch. Drei davon sind Geometrie und Umfeld und ließen sich aus einem Fassadenfoto und offenen Geodaten schätzen — der Glasanteil ist in der Gebäudeenergie-Forschung bereits gelöst. Genau diese Schätzung fehlt, nicht der Rechner: In Kanada gibt es FLAPs Fragebogen, in LEED v5 einen Punkterechner — beide fragen den Menschen. Gemessen wird nirgends.'
                : 'The four values above are still clicked by a human. Three of them are geometry and surroundings and could be estimated from a façade photo plus open geodata — the glass share is already solved in building-energy research. That estimation is what is missing, not the calculator: Canada has FLAP’s questionnaire, LEED v5 has a scoring sheet — both ask a human. Nobody measures.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
