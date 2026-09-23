import React, { useState } from 'react';
import { Sun, Zap, ExternalLink } from 'lucide-react';
import { Language } from '../../types';

interface BalkonkraftwerkSimulatorProps {
  lang: Language;
  onOpenDose?: (doseId: string) => void;
  isEmbedded?: boolean;
}

export const BalkonkraftwerkSimulator: React.FC<BalkonkraftwerkSimulatorProps> = ({
  lang,
  onOpenDose,
  isEmbedded = false,
}) => {
  const [balkonWatts, setBalkonWatts] = useState<number>(800);
  const [balkonOrientation, setBalkonOrientation] = useState<'south' | 'southeast_west' | 'east_west' | 'north'>('south');
  const [balkonTilt, setBalkonTilt] = useState<'vertical_90' | 'angled_30' | 'flat_0'>('vertical_90');
  const [balkonShade, setBalkonShade] = useState<'none' | 'partial' | 'heavy'>('none');
  const [householdBaseLoad, setHouseholdBaseLoad] = useState<'single' | 'couple' | 'family'>('couple');
  const [electricityPrice, setElectricityPrice] = useState<number>(0.36);
  const [hardwareCost, setHardwareCost] = useState<number>(420);

  const orientEff = { south: 1.0, southeast_west: 0.92, east_west: 0.78, north: 0.48 }[balkonOrientation];
  const tiltEff = { angled_30: 1.0, vertical_90: 0.74, flat_0: 0.86 }[balkonTilt];
  const shadeEff = { none: 1.0, partial: 0.78, heavy: 0.52 }[balkonShade];

  const annualYieldKwh = Math.round((balkonWatts / 1000) * 1020 * orientEff * tiltEff * shadeEff);
  const baseConsumptionRate = { single: 0.62, couple: 0.76, family: 0.89 }[householdBaseLoad];
  const sizeModifier = balkonWatts <= 400 ? 0.12 : balkonWatts <= 600 ? 0.05 : 0;
  const selfConsumptionRatio = Math.min(0.95, baseConsumptionRate + sizeModifier);

  const selfConsumedKwh = Math.round(annualYieldKwh * selfConsumptionRatio);
  const fedToGridKwh = Math.max(0, annualYieldKwh - selfConsumedKwh);
  const annualMoneySavedEur = Math.round(selfConsumedKwh * electricityPrice);
  const paybackYears = Number((hardwareCost / Math.max(15, annualMoneySavedEur)).toFixed(1));
  const co2AvoidedKg = Math.round(annualYieldKwh * 0.38);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
      {/* Controls Panel */}
      <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="font-serif-title font-bold text-stone-900 text-lg flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-600" />
            <span>{lang === 'de' ? 'Stecker-Solar: Ertrag & Mieter-Amortisation' : lang === 'es' ? 'Solar de balcón: rendimiento y amortización para inquilinos' : 'Balcony Solar: Yield & Tenant Payback'}</span>
          </h3>
          <span className="text-xs font-mono-code bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200 font-semibold">
            Solarpaket I
          </span>
        </div>

        {/* Inverter / Module Wattage */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
            {lang === 'de' ? 'Wechselrichter-Leistung:' : lang === 'es' ? 'Pico de inversor y módulos:' : 'Inverter & Module Peak:'}
          </label>
          <div className="grid grid-cols-4 gap-2 text-xs font-mono-code">
            {[400, 600, 800, 1000].map((w) => (
              <button
                key={w}
                onClick={() => setBalkonWatts(w)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  balkonWatts === w
                    ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold shadow-2xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <div>{w} W</div>
                <div className="text-3xs text-stone-500 mt-0.5 font-normal">
                  {w === 800 ? (lang === 'de' ? 'Standard' : lang === 'es' ? 'Límite' : 'Limit') : `${w / 400} Mod.`}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Orientation */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
            {lang === 'de' ? 'Balkon-Ausrichtung:' : lang === 'es' ? 'Orientación del balcón:' : 'Balcony Compass Orientation:'}
          </label>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {[
              { id: 'south', labelDe: 'Süden (100%)', labelEn: 'South (100%)' },
              { id: 'southeast_west', labelDe: 'SO / SW (92%)', labelEn: 'SE / SW (92%)' },
              { id: 'east_west', labelDe: 'Ost / West (78%)', labelEn: 'East/West (78%)' },
              { id: 'north', labelDe: 'Nord (48%)', labelEn: 'North (48%)' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setBalkonOrientation(item.id as any)}
                className={`p-2 rounded-xl border text-center transition-all ${
                  balkonOrientation === item.id
                    ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-semibold'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                {lang === 'de' ? item.labelDe : item.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Railing Tilt Angle */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
            {lang === 'de' ? 'Neigungswinkel am Geländer:' : lang === 'es' ? 'Ángulo de inclinación:' : 'Mounting Tilt Angle:'}
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'vertical_90', labelDe: '90° Senkrecht', labelEn: '90° Vertical', descDe: 'Einfach am Gitter', descEn: 'Direct railing' },
              { id: 'angled_30', labelDe: '30° Aufgeständert', labelEn: '30° Angled', descDe: 'Optimum Sommer', descEn: 'Summer peak' },
              { id: 'flat_0', labelDe: '0° Flach (Balkonboden)', labelEn: '0° Flat', descDe: 'Verschmutzungsgefahr', descEn: 'Dust accumulation' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setBalkonTilt(item.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  balkonTilt === item.id
                    ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-semibold'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <div className="font-semibold">{lang === 'de' ? item.labelDe : item.labelEn}</div>
                <div className="text-3xs text-stone-500 mt-0.5">{lang === 'de' ? item.descDe : item.descEn}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Shading & Base Load */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
              {lang === 'de' ? 'Verschattung:' : lang === 'es' ? 'Obstáculos / sombra:' : 'Obstruction / Shade:'}
            </label>
            <select
              value={balkonShade}
              onChange={(e) => setBalkonShade(e.target.value as any)}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white font-medium"
            >
              <option value="none">{lang === 'de' ? 'Freier Himmel (100%)' : lang === 'es' ? 'Cielo sin sombra (100 %)' : 'Unshaded Sky (100%)'}</option>
              <option value="partial">{lang === 'de' ? 'Leichter Baumschatten (78%)' : lang === 'es' ? 'Sombra de árbol / barandilla (78 %)' : 'Tree / Rail shadow (78%)'}</option>
              <option value="heavy">{lang === 'de' ? 'Tiefer Berliner Hinterhof (52%)' : lang === 'es' ? 'Patio urbano denso (52 %)' : 'Dense urban courtyard (52%)'}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-1.5">
              {lang === 'de' ? 'Grundlast am Tag:' : lang === 'es' ? 'Consumo base diurno:' : 'Daytime Standby Load:'}
            </label>
            <select
              value={householdBaseLoad}
              onChange={(e) => setHouseholdBaseLoad(e.target.value as any)}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white font-medium"
            >
              <option value="single">{lang === 'de' ? 'Single (~120W, Kühlschrank/WLAN)' : lang === 'es' ? 'Una persona (~120 W en reposo)' : 'Single (~120W standby)'}</option>
              <option value="couple">{lang === 'de' ? 'Paar (~220W, Homeoffice/PC)' : lang === 'es' ? 'Pareja (~220 W, teletrabajo)' : 'Couple (~220W, WFH setup)'}</option>
              <option value="family">{lang === 'de' ? 'Familie (~350W, Spülmaschine)' : lang === 'es' ? 'Familia (~350 W, mucho uso de día)' : 'Family (~350W heavy day use)'}</option>
            </select>
          </div>
        </div>

        {/* Electricity Price Slider */}
        <div>
          <div className="flex justify-between text-xs font-mono-code mb-1">
            <span className="text-stone-600">{lang === 'de' ? 'Aktueller Strompreis:' : lang === 'es' ? 'Tarifa eléctrica:' : 'Electricity Tariff:'}</span>
            <span className="font-bold text-amber-900">{(electricityPrice * 100).toFixed(0)} ct / kWh</span>
          </div>
          <input
            type="range"
            min="0.25"
            max="0.55"
            step="0.01"
            value={electricityPrice}
            onChange={(e) => setElectricityPrice(parseFloat(e.target.value))}
            className="w-full accent-amber-600"
          />
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-6 bg-stone-900 text-white rounded-2xl p-6 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="text-xs font-mono-code uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            <span>{lang === 'de' ? 'Ertrags- & Amortisations-Rechnung' : lang === 'es' ? 'Rendimiento anual y ahorro' : 'Annual Yield & Cash Savings'}</span>
          </div>
          <span className="text-3xs font-mono-code bg-stone-800 text-stone-300 px-2 py-0.5 rounded">
            DIN VDE 0100-551-1
          </span>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80">
            <div className="text-2xs text-stone-400 font-mono-code uppercase">{lang === 'de' ? 'Jahresertrag' : lang === 'es' ? 'Rendimiento anual' : 'Annual Yield'}</div>
            <div className="text-2xl font-bold font-mono-code text-amber-300 mt-1">{annualYieldKwh}</div>
            <div className="text-3xs text-stone-400">kWh / {lang === 'de' ? 'Jahr' : lang === 'es' ? 'año' : 'year'}</div>
          </div>

          <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80">
            <div className="text-2xs text-stone-400 font-mono-code uppercase">{lang === 'de' ? 'Direktverbrauch' : lang === 'es' ? 'Autoconsumo' : 'Self-Consumed'}</div>
            <div className="text-2xl font-bold font-mono-code text-emerald-400 mt-1">{selfConsumedKwh}</div>
            <div className="text-3xs text-stone-400">{Math.round(selfConsumptionRatio * 100)}% {lang === 'de' ? 'im Haushalt' : lang === 'es' ? 'en casa' : 'on-site'}</div>
          </div>

          <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80 col-span-2 sm:col-span-1">
            <div className="text-2xs text-stone-400 font-mono-code uppercase">{lang === 'de' ? 'Geldeinsparung' : lang === 'es' ? 'Ahorro anual' : 'Annual Savings'}</div>
            <div className="text-2xl font-bold font-mono-code text-amber-400 mt-1">{annualMoneySavedEur} €</div>
            <div className="text-3xs text-stone-400">{lang === 'de' ? 'pro Jahr im Geldbeutel' : lang === 'es' ? 'en tu bolsillo' : 'in your pocket'}</div>
          </div>
        </div>

        {/* Payback bar */}
        <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-stone-300 font-medium">
              {lang === 'de' ? 'Amortisationszeit (Kaufpreis ~420 €):' : lang === 'es' ? 'Amortización (~420 € de equipo):' : 'Payback Period (~420 € hardware):'}
            </span>
            <span className="font-mono-code font-bold text-emerald-400">
              {paybackYears} {lang === 'de' ? 'Jahre' : lang === 'es' ? 'años' : 'years'}
            </span>
          </div>
          <div className="w-full bg-stone-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(15, (5 / paybackYears) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between text-3xs text-stone-400 font-mono-code">
            <span>{lang === 'de' ? 'Schnell amortisiert (< 3 J.)' : lang === 'es' ? 'Rápida (< 3 años)' : 'Fast (< 3 yrs)'}</span>
            <span>{lang === 'de' ? 'Nach 25 Jahren Garantie: Reiner Gewinn' : lang === 'es' ? '25 años de garantía: todo lo demás es ganancia' : '25-yr warranty yields pure gain'}</span>
          </div>
        </div>

        {/* Environmental & Autonomy Breakdown */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-stone-800/40 border border-stone-700/50">
            <span className="text-stone-400 block text-3xs">{lang === 'de' ? 'CO2-Vermeidung:' : lang === 'es' ? 'CO2 evitado:' : 'CO2 Avoided:'}</span>
            <span className="font-mono-code font-bold text-stone-200 text-sm">~{co2AvoidedKg} kg / {lang === 'de' ? 'Jahr' : lang === 'es' ? 'año' : 'yr'}</span>
          </div>
          <div className="p-3 rounded-lg bg-stone-800/40 border border-stone-700/50">
            <span className="text-stone-400 block text-3xs">{lang === 'de' ? 'Netzeinspeisung (Schenkung):' : lang === 'es' ? 'Inyectado a la red (regalo sin contador):' : 'Fed to grid (unmetered gift):'}</span>
            <span className="font-mono-code font-bold text-stone-200 text-sm">~{fedToGridKwh} kWh / {lang === 'de' ? 'Jahr' : lang === 'es' ? 'año' : 'yr'}</span>
          </div>
        </div>

        {/* Amélie Insight Box */}
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs text-amber-200 leading-relaxed font-serif-title">
          <p>
            {lang === 'de'
              ? '💡 Amélie-Perspektive: Ein Balkonkraftwerk ist angewandte Volkssouveränität. Es braucht keinen Solarteur, keinen Dachdecker und keinen Notartermin. Es schenkt einer normalen Mietwohnung 20 Jahre lang kostenlosen Basisstrom für den Kühlschrank.'
              : lang === 'es' ? '💡 Perspectiva Amélie: la solar de balcón es soberanía energética de base. No necesita techador, ni permisos de electricista, ni deuda. Da a un piso de alquiler corriente 20 años de electricidad base gratis para la nevera de la familia.' : '💡 Amélie Perspective: Balcony solar is grassroots energy sovereignty. It requires no roofing contractor, no electrician permits, and no debt. It gives an ordinary rental flat 20 years of free baseline power for the family refrigerator.'}
          </p>
        </div>
      </div>
    </div>
  );
};
