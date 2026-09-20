import React, { useState } from 'react';
import { CloudRain, Droplets, ExternalLink } from 'lucide-react';
import { Language } from '../../types';

interface RegenwasserSimulatorProps {
  lang: Language;
  onOpenDose?: (doseId: string) => void;
  isEmbedded?: boolean;
}

export const RegenwasserSimulator: React.FC<RegenwasserSimulatorProps> = ({
  lang,
  onOpenDose,
  isEmbedded = false,
}) => {
  const [roofAreaM2, setRoofAreaM2] = useState<number>(95);
  const [rainIndexMm, setRainIndexMm] = useState<number>(650);
  const [roofSurface, setRoofSurface] = useState<'tiles' | 'metal_sheet' | 'green_roof'>('tiles');
  const [cisternVolumeL, setCisternVolumeL] = useState<number>(3000);
  const [gardenAreaM2, setGardenAreaM2] = useState<number>(120);
  const [useForToilets, setUseForToilets] = useState<boolean>(true);

  const dischargeCoeff = { tiles: 0.85, metal_sheet: 0.92, green_roof: 0.50 }[roofSurface];
  const annualRainfallHarvestL = Math.round(roofAreaM2 * rainIndexMm * dischargeCoeff * 0.9); // 90% filter efficiency

  const dailyToiletUseL = useForToilets ? 65 : 0;
  const dailySummerGardenL = (gardenAreaM2 * 2.8);
  const dailySummerTotalL = Math.max(15, dailyToiletUseL + dailySummerGardenL);
  const droughtAutonomyDays = Math.round(cisternVolumeL / dailySummerTotalL);

  const waterCostPerM3 = 4.80; // Trinkwasser + Schmutzwassergebühr
  const runoffFeeSavingsEur = roofAreaM2 * 1.65; // Niederschlagswassergebühr Befreiung
  const usableHarvestL = Math.min(annualRainfallHarvestL, (dailySummerTotalL * 120) + (dailyToiletUseL * 240));
  const annualWaterSavingsEur = Math.round((usableHarvestL / 1000) * waterCostPerM3 + runoffFeeSavingsEur);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
      {/* Controls Panel */}
      <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="font-serif-title font-bold text-stone-900 text-lg flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-600" />
            <span>{lang === 'de' ? 'Zisterne: Erntemenge & Trockenheits-Autonomie' : 'Rain Harvesting & Drought Resilience Gauge'}</span>
          </h3>
          <span className="text-xs font-mono-code bg-blue-50 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-200 font-semibold">
            DIN 1989-1
          </span>
        </div>

        {/* Roof Area Slider */}
        <div>
          <div className="flex justify-between text-xs font-mono-code mb-1">
            <span className="text-stone-600">{lang === 'de' ? 'Wirksame Dachgrundfläche:' : 'Catchment Roof Area:'}</span>
            <span className="font-bold text-blue-900">{roofAreaM2} m²</span>
          </div>
          <input
            type="range"
            min="20"
            max="220"
            step="5"
            value={roofAreaM2}
            onChange={(e) => setRoofAreaM2(parseInt(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-3xs text-stone-400 font-mono-code mt-0.5">
            <span>20 m² ({lang === 'de' ? 'Schuppen' : 'Shed'})</span>
            <span>80 m² ({lang === 'de' ? 'Reihenhaus' : 'Row House'})</span>
            <span>200 m² ({lang === 'de' ? 'Einfamilienhaus' : 'Detached'})</span>
          </div>
        </div>

        {/* Annual Rain Index */}
        <div>
          <div className="flex justify-between text-xs font-mono-code mb-1">
            <span className="text-stone-600">{lang === 'de' ? 'Mittlerer Jahresniederschlag:' : 'Annual Rainfall Index:'}</span>
            <span className="font-bold text-blue-900">{rainIndexMm} mm / {lang === 'de' ? 'Jahr' : 'yr'}</span>
          </div>
          <input
            type="range"
            min="450"
            max="1200"
            step="25"
            value={rainIndexMm}
            onChange={(e) => setRainIndexMm(parseInt(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-3xs text-stone-400 font-mono-code mt-0.5">
            <span>480 mm ({lang === 'de' ? 'Berlin / Brandenburg' : 'Dry East'})</span>
            <span>750 mm ({lang === 'de' ? 'Köln / Frankfurt' : 'Central'})</span>
            <span>1100 mm ({lang === 'de' ? 'Voralpenland' : 'Alpine Rim'})</span>
          </div>
        </div>

        {/* Roof Surface Material */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
            {lang === 'de' ? 'Dach-Eindeckung (Abflussbeiwert):' : 'Roof Surface Material:'}
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'tiles', labelDe: 'Ton-/Betonziegel', labelEn: 'Clay Tiles', coeff: '85%' },
              { id: 'metal_sheet', labelDe: 'Blech / Zinkfalz', labelEn: 'Sheet Metal', coeff: '92%' },
              { id: 'green_roof', labelDe: 'Extensiv Gründach', labelEn: 'Green Roof', coeff: '50%' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setRoofSurface(item.id as any)}
                className={`p-2 rounded-xl border text-left transition-all ${
                  roofSurface === item.id
                    ? 'border-blue-600 bg-blue-50/80 text-blue-950 font-semibold'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <div className="font-medium text-2xs">{lang === 'de' ? item.labelDe : item.labelEn}</div>
                <div className="text-3xs text-blue-700 font-mono-code font-bold mt-0.5">{item.coeff} {lang === 'de' ? 'Ertrag' : 'drain'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Cistern Volume */}
        <div>
          <div className="flex justify-between text-xs font-mono-code mb-1">
            <span className="text-stone-600">{lang === 'de' ? 'Zisternen- / Speichervolumen:' : 'Cistern Storage Volume:'}</span>
            <span className="font-bold text-blue-900">{cisternVolumeL.toLocaleString()} Liter</span>
          </div>
          <input
            type="range"
            min="300"
            max="6000"
            step="100"
            value={cisternVolumeL}
            onChange={(e) => setCisternVolumeL(parseInt(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-3xs text-stone-400 font-mono-code mt-0.5">
            <span>300 L ({lang === 'de' ? 'Regentonne' : 'Barrel'})</span>
            <span>1.500 L ({lang === 'de' ? 'Kompakt-Tank' : 'Modular'})</span>
            <span>5.000 L ({lang === 'de' ? 'Erdzisterne' : 'Underground'})</span>
          </div>
        </div>

        {/* Consumption check */}
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-800">
            <input
              type="checkbox"
              checked={useForToilets}
              onChange={(e) => setUseForToilets(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>{lang === 'de' ? 'WC-Spülung angeschlossen (spart ~60 L Trinkwasser täglich)' : 'Connected to toilet flushing (~60 L daily savings)'}</span>
          </label>

          <div>
            <div className="flex justify-between text-xs font-mono-code mb-1">
              <span className="text-stone-600">{lang === 'de' ? 'Gartenfläche zur Bewässerung:' : 'Irrigated Garden Area:'}</span>
              <span className="font-bold text-stone-800">{gardenAreaM2} m²</span>
            </div>
            <input
              type="range"
              min="0"
              max="400"
              step="20"
              value={gardenAreaM2}
              onChange={(e) => setGardenAreaM2(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-6 bg-stone-900 text-white rounded-2xl p-6 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="text-xs font-mono-code uppercase tracking-wider text-blue-400 font-bold flex items-center gap-1.5">
            <Droplets className="w-4 h-4" />
            <span>{lang === 'de' ? 'Wasserbilanz & Trockenheitspuffer' : 'Water Balance & Drought Autonomy'}</span>
          </div>
          <span className="text-3xs font-mono-code bg-stone-800 text-stone-300 px-2 py-0.5 rounded">
            WHG § 55 Abs. 2
          </span>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80">
            <div className="text-2xs text-stone-400 font-mono-code uppercase">{lang === 'de' ? 'Jahres-Ernte' : 'Annual Harvest'}</div>
            <div className="text-2xl font-bold font-mono-code text-blue-300 mt-1">
              {(annualRainfallHarvestL / 1000).toFixed(1)} m³
            </div>
            <div className="text-3xs text-stone-400">{annualRainfallHarvestL.toLocaleString()} Liter</div>
          </div>

          <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80">
            <div className="text-2xs text-stone-400 font-mono-code uppercase">{lang === 'de' ? 'Trocken-Puffer' : 'Drought Days'}</div>
            <div className="text-2xl font-bold font-mono-code text-emerald-400 mt-1">{droughtAutonomyDays}</div>
            <div className="text-3xs text-stone-400">{lang === 'de' ? 'Tage ohne Regen' : 'days autonomy'}</div>
          </div>

          <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80 col-span-2 sm:col-span-1">
            <div className="text-2xs text-stone-400 font-mono-code uppercase">{lang === 'de' ? 'Kostenersparnis' : 'Money Saved'}</div>
            <div className="text-2xl font-bold font-mono-code text-amber-400 mt-1">{annualWaterSavingsEur} €</div>
            <div className="text-3xs text-stone-400">{lang === 'de' ? 'Trink- & Abwasser' : 'water tariff / yr'}</div>
          </div>
        </div>

        {/* Cistern Visual Water Level */}
        <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-300 font-medium">
              {lang === 'de' ? 'Sommerlicher Trockenheits-Schutzfaktor:' : 'Summer Heatwave Protection Level:'}
            </span>
            <span className={`font-mono-code font-bold px-2 py-0.5 rounded text-3xs ${
              droughtAutonomyDays >= 21 ? 'bg-emerald-900/80 text-emerald-300' : droughtAutonomyDays >= 10 ? 'bg-amber-900/80 text-amber-300' : 'bg-red-900/80 text-red-300'
            }`}>
              {droughtAutonomyDays >= 21
                ? (lang === 'de' ? '🟢 Voll krisenfest (> 3 Wochen)' : '🟢 Fully resilient (> 3 wks)')
                : droughtAutonomyDays >= 10
                ? (lang === 'de' ? '🟡 Ausreichend (1-2 Wochen)' : '🟡 Moderate (1-2 wks)')
                : (lang === 'de' ? '🔴 Kritisch klein (< 10 Tage)' : '🔴 Tank too small')}
            </span>
          </div>

          {/* Water Tank Level Indicator */}
          <div className="relative w-full h-8 bg-stone-950 rounded-lg overflow-hidden border border-stone-700">
            <div
              className="bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 h-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(10, (droughtAutonomyDays / 30) * 100))}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-3xs font-mono-code text-white font-bold drop-shadow">
              {lang === 'de' ? `Reicht für ${Math.round(droughtAutonomyDays / 7)} Wochen Hitzeperiode` : `Sustains ${Math.round(droughtAutonomyDays / 7)} weeks of severe heatwave`}
            </span>
          </div>
        </div>

        {/* Municipal Fee Deduction Info */}
        <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 leading-relaxed font-serif-title">
          <p>
            {lang === 'de'
              ? '💧 Satzungsvorteil: Wer Regenwasser auf eigenem Grund nutzt und nicht in die Mischkanalisation einleitet, spart in den meisten deutschen Kommunen 1,50 bis 2,20 € pro m² versiegelter Fläche an Niederschlagswassergebühr — ganz ohne Antragsgebühr.'
              : '💧 Municipal Advantage: Harvesting rainfall on-site avoids stormwater runoff fees in most European cities (saving 1.50 - 2.20 €/m² of sealed roof area every year), while safeguarding local groundwater tables.'}
          </p>
        </div>
      </div>
    </div>
  );
};
