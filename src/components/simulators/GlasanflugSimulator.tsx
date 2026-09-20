import React, { useState } from 'react';
import { ShieldAlert, ExternalLink } from 'lucide-react';
import { Language } from '../../types';

interface GlasanflugSimulatorProps {
  lang: Language;
  onOpenDose?: (doseId: string) => void;
  isEmbedded?: boolean;
}

export const GlasanflugSimulator: React.FC<GlasanflugSimulatorProps> = ({
  lang,
  onOpenDose,
  isEmbedded = false,
}) => {
  const [paneTransparency, setPaneTransparency] = useState<'clear' | 'tinted' | 'mirrored'>('clear');
  const [vegetationDistance, setVegetationDistance] = useState<'immediate' | 'medium' | 'none'>('immediate');
  const [throughVision, setThroughVision] = useState<boolean>(true); // Durchsicht (Eckverglasung / Korridor)
  const [patternType, setPatternType] = useState<'none' | 'dots_9x9' | 'stripes_5mm' | 'silhouettes'>('none');

  let birdRiskScore = 0;
  if (paneTransparency === 'mirrored') birdRiskScore += 45;
  else if (paneTransparency === 'clear') birdRiskScore += 30;
  else birdRiskScore += 15;

  if (vegetationDistance === 'immediate') birdRiskScore += 35; // Trees reflecting directly into glass
  else if (vegetationDistance === 'medium') birdRiskScore += 20;

  if (throughVision) birdRiskScore += 30;

  // Pattern mitigation
  if (patternType === 'dots_9x9') birdRiskScore = Math.max(5, birdRiskScore - 65);
  else if (patternType === 'stripes_5mm') birdRiskScore = Math.max(8, birdRiskScore - 60);
  else if (patternType === 'silhouettes') birdRiskScore = Math.max(25, birdRiskScore - 15); // Black bird stickers are ineffective!

  const birdTrafficLight: 'green' | 'amber' | 'red' =
    birdRiskScore < 25 ? 'green' : birdRiskScore < 50 ? 'amber' : 'red';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="font-serif-title font-bold text-stone-900 text-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
            <span>{lang === 'de' ? 'Vogelschlag-Risiko nach LAG-VSW Standard' : 'Bird Glass Hazard Score Calculator'}</span>
          </h3>
          <span className="text-xs font-mono-code bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
            Candidate Pipeline
          </span>
        </div>

        {/* Glass Type */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
            {lang === 'de' ? 'Glas-Reflexionsgrad:' : 'Glass Reflection Index:'}
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setPaneTransparency('clear')}
              className={`p-2 rounded-xl border text-left transition-all ${
                paneTransparency === 'clear' ? 'border-amber-800 bg-amber-50/80 font-bold' : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              {lang === 'de' ? 'Normales Floatglas (15%)' : 'Standard Float Glass (15%)'}
            </button>
            <button
              onClick={() => setPaneTransparency('mirrored')}
              className={`p-2 rounded-xl border text-left transition-all ${
                paneTransparency === 'mirrored' ? 'border-amber-800 bg-amber-50/80 font-bold text-rose-900' : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              {lang === 'de' ? 'Sonnenschutz / Verspiegelt (>30%)' : 'Mirrored / Solar (>30%)'}
            </button>
            <button
              onClick={() => setPaneTransparency('tinted')}
              className={`p-2 rounded-xl border text-left transition-all ${
                paneTransparency === 'tinted' ? 'border-amber-800 bg-amber-50/80 font-bold' : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              {lang === 'de' ? 'Entspiegelt / Mattiert (<8%)' : 'Anti-Reflective / Matt (<8%)'}
            </button>
          </div>
        </div>

        {/* Vegetation Distance */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
            {lang === 'de' ? 'Vegetation / Bäume vor der Scheibe:' : 'Vegetation / Trees Facing Glass:'}
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setVegetationDistance('immediate')}
              className={`p-2 rounded-xl border text-left transition-all ${
                vegetationDistance === 'immediate' ? 'border-amber-800 bg-amber-50/80 font-bold text-rose-900' : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              {lang === 'de' ? 'Direkt vor Scheibe (<5m)' : 'Directly in front (<5m)'}
            </button>
            <button
              onClick={() => setVegetationDistance('medium')}
              className={`p-2 rounded-xl border text-left transition-all ${
                vegetationDistance === 'medium' ? 'border-amber-800 bg-amber-50/80 font-bold' : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              {lang === 'de' ? 'Mittlere Distanz (5-15m)' : 'Medium distance (5-15m)'}
            </button>
            <button
              onClick={() => setVegetationDistance('none')}
              className={`p-2 rounded-xl border text-left transition-all ${
                vegetationDistance === 'none' ? 'border-amber-800 bg-amber-50/80 font-bold' : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              {lang === 'de' ? 'Freie Fläche / Hof' : 'Clear courtyard / Open'}
            </button>
          </div>
        </div>

        {/* Pattern Grid Type */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
            {lang === 'de' ? 'Vogelschutz-Markierung auf Pos. 1 (Außenseite):' : 'Protective Markings on Pane:'}
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setPatternType('none')}
              className={`p-2 rounded-xl border text-left transition-all ${
                patternType === 'none' ? 'border-amber-800 bg-amber-50 font-bold' : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              {lang === 'de' ? 'Keine Markierung' : 'No Markings'}
            </button>
            <button
              onClick={() => setPatternType('dots_9x9')}
              className={`p-2 rounded-xl border text-left transition-all ${
                patternType === 'dots_9x9' ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold' : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              {lang === 'de' ? 'Punktraster 9x9cm (LAG-Norm)' : '9x9cm Dot Grid (LAG Standard)'}
            </button>
            <button
              onClick={() => setPatternType('stripes_5mm')}
              className={`p-2 rounded-xl border text-left transition-all ${
                patternType === 'stripes_5mm' ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold' : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              {lang === 'de' ? 'Vertikalstreifen 5mm / 10cm' : 'Vertical Stripes 5mm / 10cm'}
            </button>
            <button
              onClick={() => setPatternType('silhouettes')}
              className={`p-2 rounded-xl border text-left transition-all ${
                patternType === 'silhouettes' ? 'border-rose-700 bg-rose-50 text-rose-900 font-bold' : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              {lang === 'de' ? 'Greifvogel-Aufkleber (Nutzen 0)' : 'Raptor Silhouette (Zero efficacy)'}
            </button>
          </div>
        </div>

        {/* Through vision */}
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
          <span className="text-xs font-medium text-stone-700">
            {lang === 'de' ? 'Vollständige Durchsicht vorhanden (z.B. Eckverglasung, Gang)?' : 'Through-vision corridor present?'}
          </span>
          <input
            type="checkbox"
            checked={throughVision}
            onChange={(e) => setThroughVision(e.target.checked)}
            className="w-4 h-4 accent-amber-800 cursor-pointer"
          />
        </div>
      </div>

      {/* Evaluation Results */}
      <div className="lg:col-span-6 space-y-4">
        <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md border border-stone-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono-code uppercase tracking-wider text-stone-400">
              {lang === 'de' ? 'LAG-VSW Risikobewertung' : 'LAG-VSW Hazard Classification'}
            </span>
            <span className="text-xs font-mono-code text-stone-300">BNatSchG §44 Abs. 1 Nr. 1</span>
          </div>

          {/* Traffic Light Card */}
          <div
            className={`p-5 rounded-xl border mb-5 flex items-center gap-4 ${
              birdTrafficLight === 'green'
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-100'
                : birdTrafficLight === 'amber'
                ? 'bg-amber-950/80 border-amber-600 text-amber-100'
                : 'bg-rose-950/80 border-rose-700 text-rose-100'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold font-mono-code shrink-0 ${
                birdTrafficLight === 'green'
                  ? 'bg-emerald-500 text-white'
                  : birdTrafficLight === 'amber'
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-rose-600 text-white animate-pulse'
              }`}
            >
              {birdRiskScore}
            </div>
            <div>
              <h4 className="font-serif-title font-bold text-base">
                {birdTrafficLight === 'green'
                  ? lang === 'de'
                    ? 'GRÜN — Wirksam vogelschlagarm (<25%)'
                    : 'GREEN — Highly bird-safe (<25%)'
                  : birdTrafficLight === 'amber'
                  ? lang === 'de'
                    ? 'GELB — Erhöhtes Kollisionsrisiko'
                    : 'AMBER — Elevated hazard rate'
                  : lang === 'de'
                  ? 'ROT — Akute Tötungsfalle nach §44'
                  : 'RED — Severe collision hazard (§44 violation)'}
              </h4>
              <p className="text-xs opacity-90 mt-0.5">
                {patternType === 'silhouettes'
                  ? (lang === 'de'
                    ? 'Achtung: Greifvogel-Silhouetten werden von Singvögeln schlicht umflogen — die Scheibe daneben bleibt tödlich.'
                    : 'Warning: Bird silhouettes are ineffective. Birds simply fly around the sticker.')
                  : ''}
                {patternType === 'dots_9x9' && (lang === 'de' ? 'Geprüftes Punktraster unterbricht Spiegelung physikalisch.' : 'Certified dot matrix breaks reflections.')}
                {patternType === 'none' && (lang === 'de' ? 'Unmarkierte Glasfläche mit Pflanzenspiegelung ist für Vögel unsichtbar.' : 'Unmarked glass reflecting vegetation is visually invisible.')}
              </p>
            </div>
          </div>

          {/* Ready to send */}
          <div className="pt-4 border-t border-stone-800 text-xs flex items-center justify-between text-stone-400">
            {onOpenDose ? (
              <button
                onClick={() => onOpenDose('lichtplan-check')}
                className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>{lang === 'de' ? 'Dose: Lichtplan-Check öffnen' : 'Open Tin: Light Plan Check'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            ) : (
              <span>{lang === 'de' ? 'Empfänger: LAG Vogelschutzwarten / NABU' : 'Recipient: LAG Bird Conservation / NABU'}</span>
            )}
            <span className="text-emerald-400 font-mono-code">{lang === 'de' ? 'Status: Lücke frei' : 'Status: Gap open'}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
          <span className="font-bold block text-emerald-900">
            {lang === 'de' ? 'Warum existiert diese App noch nicht?' : 'Why is this tool not yet built?'}
          </span>
          <p className="text-emerald-900/90 text-[11px] leading-relaxed">
            {lang === 'de'
              ? 'Das offizielle Prüfschema existiert seit Jahren als 30-seitiges PDF der Vogelschutzwarten. Architekten und Bauämter blättern es mühsam durch. Ein 3-Klick-Rechner im Browser schließt diese Lücke sofort.'
              : 'The regulatory standard has existed for years as a 30-page PDF document. Architects and building authorities thumb through it manually. A clean web calculator makes it instantly usable.'}
          </p>
        </div>
      </div>
    </div>
  );
};
