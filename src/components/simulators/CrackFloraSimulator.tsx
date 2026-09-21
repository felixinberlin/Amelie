import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Language } from '../../types';

interface CrackFloraSimulatorProps {
  lang: Language;
  onOpenDose?: (doseId: string) => void;
  isEmbedded?: boolean;
}

export const CrackFloraSimulator: React.FC<CrackFloraSimulatorProps> = ({
  lang,
  onOpenDose,
  isEmbedded = false,
}) => {
  const [selectedPlantId, setSelectedPlantId] = useState<'dandelion' | 'plantain' | 'shepherd' | 'fleabane' | 'yarrow'>('dandelion');
  const [substrateType, setSubstrateType] = useState<'pure_asphalt' | 'deep_crack' | 'curb_joint' | 'mortar_wall'>('pure_asphalt');
  const [trafficExposure, setTrafficExposure] = useState<'high_foot' | 'medium_bike' | 'parked_car_tire' | 'low_quiet'>('high_foot');
  const [sunExposure, setSunExposure] = useState<'full_baking_sun' | 'variable_canyon' | 'subway_grate_humid'>('full_baking_sun');
  const [timeLapseWeek, setTimeLapseWeek] = useState<number>(4);
  const [exportedKrautschauData, setExportedKrautschauData] = useState<boolean>(false);

  const plantCatalog = {
    dandelion: {
      nameDe: 'Gewöhnlicher Löwenzahn (Taraxacum sect. Ruderalia)',
      nameEn: 'Common Dandelion (Taraxacum sect. Ruderalia)',
      csrStrategy: 'RC (Ruderal-Konkurrent)',
      csrTraits: { root: 5, trample: 5, drought: 5, seed: 6, speed: 7, chem: 4 },
      baseHardiness: 7.2,
      superpowerDe: 'Pfahlwurzel erzeugt bis zu 10 bar osmotischen Turgordruck und sprengt Asphaltschichten.',
      superpowerEn: 'Taproot generates up to 10 bars of osmotic turgor pressure, fracturing solid bitumen layers.',
      urbanNicheDe: 'Dehnungsfugen, Bordsteinkanten, heiße Bushaltestellen',
      urbanNicheEn: 'Expansion seams, curbstones, sweltering bus station asphalt',
      chalkTag: '#Krautschau #Taraxacum #AsphaltPioneer #CSR_RC',
      growthStages: [
        { week: 1, labelDe: 'Keimling in Bitumenspalte (2 mm)', labelEn: 'Seedling in bitumen seam (2 mm)' },
        { week: 2, labelDe: 'Blattrosette presst sich an den Asphalt', labelEn: 'Leaf rosette flattens against asphalt' },
        { week: 4, labelDe: 'Gelbe Blütenkrone trotzt Fußgänger-Schritten', labelEn: 'Bright flowerhead defying footsteps' },
        { week: 8, labelDe: 'Pusteblume streut Samen über den Kiezwind', labelEn: 'Seed clock launching parachutes in urban updrafts' }
      ]
    },
    plantain: {
      nameDe: 'Breitwegerich (Plantago major)',
      nameEn: 'Greater Plantain / Waybread (Plantago major)',
      csrStrategy: 'RCS (Universal-Stresstolerator)',
      csrTraits: { root: 5, trample: 9, drought: 6, seed: 4, speed: 4, chem: 4 },
      baseHardiness: 8.5,
      superpowerDe: 'Extreme Trittfestigkeit durch elastische Blattadern; verträgt bis zu 250 Trittbelastungen pro Tag.',
      superpowerEn: 'Extreme compaction tolerance via elastic leaf veins; withstanding 250+ foot strikes daily.',
      urbanNicheDe: 'Kopfsteinpflaster, Schulhof-Risse, U-Bahn-Eingänge',
      urbanNicheEn: 'Cobblestone gaps, schoolyard cracks, subway station thresholds',
      chalkTag: '#Krautschau #PlantagoMajor #PavementTank #CSR_RCS',
      growthStages: [
        { week: 1, labelDe: 'Zweikeimblättrig in Mörtelfuge', labelEn: 'Cotyledons emerging from mortar' },
        { week: 2, labelDe: 'Flache, lederartige Schutzblätter etablieren sich', labelEn: 'Flat, leathery armor leaves ground themselves' },
        { week: 4, labelDe: 'Robuste Blütenähren widerstehen Tritten', labelEn: 'Tough flower spikes enduring pedestrian strides' },
        { week: 8, labelDe: 'Schleimige Samenkapseln haften an Schuhsohlen', labelEn: 'Sticky mucilaginous seeds hitching rides on shoe soles' }
      ]
    },
    shepherd: {
      nameDe: 'Hirtentäschelkraut (Capsella bursa-pastoris)',
      nameEn: 'Shepherd’s Purse (Capsella bursa-pastoris)',
      csrStrategy: 'R (Pionier-Ruderal)',
      csrTraits: { root: 3, trample: 5, drought: 4, seed: 8, speed: 8, chem: 4 },
      baseHardiness: 7.8,
      superpowerDe: 'Samen sondern bei Nässe klebrigen Schleim ab, der sie im Asphaltstaub wie Zement verankert.',
      superpowerEn: 'Seeds secrete adhesive mucilage upon rainfall, cementing themselves into micron-level asphalt dust.',
      urbanNicheDe: 'Trockene Parkplatzritzen, Gehweg-Ecken',
      urbanNicheEn: 'Baking parking lot cracks, sunny sidewalk corners',
      chalkTag: '#Krautschau #Capsella #ConcretePioneer #CSR_R',
      growthStages: [
        { week: 1, labelDe: 'Mikroskopischer Trieb im Rissgrund', labelEn: 'Microscopic sprout in crack base' },
        { week: 2, labelDe: 'Filigrane Stängelbildung trotz Staubtrockenheit', labelEn: 'Slender stems shooting up despite bone-dry dust' },
        { week: 4, labelDe: 'Herzförmige Schötchen gefüllt mit Überdauerungssamen', labelEn: 'Heart-shaped seedpods brimming with survival seeds' },
        { week: 8, labelDe: 'Vollständiger Lebenszyklus in 6 Wochen vollendet', labelEn: 'Complete seed-to-seed lifecycle completed in 6 weeks' }
      ]
    },
    fleabane: {
      nameDe: 'Kanadisches Berufkraut (Erigeron canadensis)',
      nameEn: 'Canadian Horseweed (Erigeron canadensis)',
      csrStrategy: 'R (Hitzeinsel-Ruderal)',
      csrTraits: { root: 4, trample: 3, drought: 5, seed: 9, speed: 7, chem: 5 },
      baseHardiness: 8.0,
      superpowerDe: 'Wärmeliebender Neophyt; profitiert von städtischen Wärmeinseln und gedeiht bei über 45 °C Asphalttemperatur.',
      superpowerEn: 'Heat-thriving urban pioneer; capitalizing on microclimates with surface temperatures exceeding 45 °C.',
      urbanNicheDe: 'Hauswand-Abschlüsse, Schotterbetten, Fassadenfugen',
      urbanNicheEn: 'Building perimeter joints, gravel edges, facade crevices',
      chalkTag: '#Krautschau #Erigeron #HeatIslandHero #CSR_R',
      growthStages: [
        { week: 1, labelDe: 'Dichte Rosette im Mauerwinkel', labelEn: 'Dense hairy rosette hugging brick foundation' },
        { week: 2, labelDe: 'Rasanter vertikaler Austrieb entlang der Hauswand', labelEn: 'Rapid vertical shoot tracing building wall' },
        { week: 4, labelDe: 'Über 100 winzige Korbblüten trotzen der Straßenglut', labelEn: '100+ miniature flowerheads defying radiant street heat' },
        { week: 8, labelDe: 'Zehntausende Schirmchensamen segeln durch Straßenschluchten', labelEn: 'Tens of thousands of pappus seeds gliding down wind tunnels' }
      ]
    },
    yarrow: {
      nameDe: 'Gemeine Schafgarbe (Achillea millefolium)',
      nameEn: 'Common Yarrow (Achillea millefolium)',
      csrStrategy: 'CSR (Tiefwurzler-Stresstolerant)',
      csrTraits: { root: 7, trample: 6, drought: 7, seed: 5, speed: 4, chem: 4 },
      baseHardiness: 7.0,
      superpowerDe: 'Tiefwurzelndes Rhizomnetzwerk speichert Feuchtigkeit und widersteht Winter-Streusalz.',
      superpowerEn: 'Deep-rooting rhizome network hoarding moisture while resisting winter street deicing salt.',
      urbanNicheDe: 'Baumscheiben-Ränder, Schotterfugen, Tramgleis-Schotter',
      urbanNicheEn: 'Tree pit edges, gravel curb gutters, tramway gravel beds',
      chalkTag: '#Krautschau #Achillea #SaltResilient #CSR_CSR',
      growthStages: [
        { week: 1, labelDe: 'Fiederblättchen lugen zwischen Granitsteinen hervor', labelEn: 'Feathery pinnate foliage peeking between cobblestones' },
        { week: 2, labelDe: 'Wurzelgeflecht verankert sich im Unterbausand', labelEn: 'Rhizome network locking into deep sub-pavement sand' },
        { week: 4, labelDe: 'Weiße Doldenblüte zieht Wildbienen mitten im Verkehr an', labelEn: 'White flat-topped flower cluster drawing wild solitary bees' },
        { week: 8, labelDe: 'Robuster Rückzug ins Rhizom vor dem Frost', labelEn: 'Hardy dormancy retreat into protected underground rhizome' }
      ]
    }
  };

  const substrateModifiers = {
    pure_asphalt: { score: 1.8, labelDe: 'Reiner Asphalt (Null Substrat)', labelEn: 'Pure Solid Asphalt (Zero Soil)' },
    deep_crack: { score: 1.2, labelDe: 'Tiefer Dehnungsriss (3-5 mm)', labelEn: 'Deep Expansion Seam (3-5 mm)' },
    curb_joint: { score: 0.9, labelDe: 'Bordsteinfuge / Sandbett', labelEn: 'Curbstone Joint / Sand Bed' },
    mortar_wall: { score: 1.5, labelDe: 'Vertikale Mörtelwand / Klinker', labelEn: 'Vertical Brick Wall Mortar' }
  };

  const trafficModifiers = {
    high_foot: { score: 1.2, labelDe: 'Hohe Trittfrequenz (>500 Passanten/Tag)', labelEn: 'High Foot Traffic (>500 walkers/day)' },
    medium_bike: { score: 0.8, labelDe: 'Radweg-Schulter / Skater', labelEn: 'Bike Lane Shoulder / Skaters' },
    parked_car_tire: { score: 1.4, labelDe: 'Parkschein-Zone (Öl & Reifenkontakt)', labelEn: 'Street Parking (Oil & Tire Compaction)' },
    low_quiet: { score: 0.3, labelDe: 'Ruhige Kiez-Ecke', labelEn: 'Quiet Residential Corner' }
  };

  const sunModifiers = {
    full_baking_sun: { score: 1.0, labelDe: 'Glühende Südlage (>50 °C Oberfläche)', labelEn: 'Full Baking Sun (>50 °C surface)' },
    variable_canyon: { score: 0.5, labelDe: 'Straßenschlucht mit Zugluft', labelEn: 'Street Canyon Wind Tunnel' },
    subway_grate_humid: { score: 0.2, labelDe: 'U-Bahn-Schachtabluft (feucht-warm)', labelEn: 'Subway Vent Exhaust (warm-humid)' }
  };

  const currentPlantData = plantCatalog[selectedPlantId];
  const rawToughnessScore = Math.min(
    10.0,
    Number((
      currentPlantData.baseHardiness * 0.55 +
      substrateModifiers[substrateType].score * 1.5 +
      trafficModifiers[trafficExposure].score * 1.2 +
      sunModifiers[sunExposure].score * 1.0
    ).toFixed(1))
  );

  const toughnessRank = rawToughnessScore >= 9.0
    ? (lang === 'de' ? '👑 König der Ritzen (Legendär)' : '👑 King of the Cracks (Legendary)')
    : rawToughnessScore >= 8.0
    ? (lang === 'de' ? '⚔️ Asphaltheld (Elite)' : '⚔️ Asphalt Warrior (Elite)')
    : (lang === 'de' ? '🌿 Kiez-Pionier (Stark)' : '🌿 Sidewalk Pioneer (Sturdy)');

  return (
    <div className="space-y-6">
      {/* Hero Banner for Crack Flora Watcher */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-stone-100 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-lime-950/80 border border-lime-500/50 text-lime-300 text-xs font-mono-code mb-2">
              <span>🌱 #Krautschau Citizen Science · Senckenberg & Flora Incognita Bridge</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-white tracking-tight">
              {lang === 'de' ? 'Crack Flora Watcher: Das Ritzengrün-Labor' : 'Crack Flora Watcher: Pavement Botany Lab'}
            </h3>
            <p className="text-sm text-stone-400 mt-1 max-w-2xl font-serif-title">
              {lang === 'de'
                ? '„Sie sagten, hier kann nichts wachsen. Die Pflanzen sahen das anders." – Berechnen Sie den Härtegrad-Index (Toughness Index) und simulieren Sie das Zeitraffer-Wachstum in extremen Asphalt-Mikrolebensräumen.'
                : '"They said nothing could grow here. The plants disagreed." – Calculate the Toughness Index and explore multi-week growth time-lapses in hostile asphalt micro-habitats.'}
            </p>
          </div>

          {/* Toughness Index Quick Badge */}
          <div className="bg-stone-950/90 p-3.5 rounded-xl border border-stone-800 text-center font-mono-code min-w-[200px]">
            <div className="text-stone-400 text-3xs uppercase tracking-wider">Toughness Index</div>
            <div className="text-3xl font-bold text-lime-400 font-mono-code my-0.5">
              {rawToughnessScore} <span className="text-xs text-stone-500">/ 10.0</span>
            </div>
            <div className="text-2xs font-sans text-stone-300 font-medium">
              {toughnessRank}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Plant Selection & Substrate Parameters */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <h4 className="font-bold text-stone-900 font-serif-title text-base">
                {lang === 'de' ? '1. Asphaltheld & Standort wählen' : '1. Select Pavement Survivor & Micro-Habitat'}
              </h4>
            </div>
            <span className="text-2xs font-mono-code bg-lime-50 text-lime-800 px-2 py-0.5 rounded border border-lime-300">
              Dose #19
            </span>
          </div>

          {/* Plant Buttons */}
          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-2">
              {lang === 'de' ? 'Pflaster-Pionierart:' : 'Pioneer Species:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(plantCatalog) as Array<keyof typeof plantCatalog>).map((pKey) => {
                const p = plantCatalog[pKey];
                const isSelected = selectedPlantId === pKey;
                return (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => setSelectedPlantId(pKey)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-lime-50/80 border-lime-500 text-lime-950 font-bold shadow-2xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="truncate font-sans font-medium text-stone-900">{lang === 'de' ? p.nameDe.split('(')[0] : p.nameEn.split('(')[0]}</div>
                    <div className="text-3xs font-mono-code text-stone-500 italic truncate">({p.nameDe.split('(')[1]?.replace(')', '') || ''})</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Substrate Selector */}
          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-2">
              {lang === 'de' ? 'Untergrund / Substrat-Härte:' : 'Substrate Adversity:'}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(Object.keys(substrateModifiers) as Array<keyof typeof substrateModifiers>).map((subKey) => {
                const isSelected = substrateType === subKey;
                return (
                  <button
                    key={subKey}
                    type="button"
                    onClick={() => setSubstrateType(subKey)}
                    className={`p-2 rounded-lg border text-left text-2xs transition-all ${
                      isSelected
                        ? 'bg-stone-900 text-white font-bold border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div className="font-sans">{lang === 'de' ? substrateModifiers[subKey].labelDe : substrateModifiers[subKey].labelEn}</div>
                    <div className="text-3xs font-mono-code text-stone-400">+{substrateModifiers[subKey].score} Toughness</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Traffic / Compaction Selector */}
          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-2">
              {lang === 'de' ? 'Tritt- & Belastungseinfluss:' : 'Foot & Vehicle Compaction:'}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(Object.keys(trafficModifiers) as Array<keyof typeof trafficModifiers>).map((trafKey) => {
                const isSelected = trafficExposure === trafKey;
                return (
                  <button
                    key={trafKey}
                    type="button"
                    onClick={() => setTrafficExposure(trafKey)}
                    className={`p-2 rounded-lg border text-left text-2xs transition-all ${
                      isSelected
                        ? 'bg-amber-950 text-amber-100 font-bold border-amber-800'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div className="font-sans">{lang === 'de' ? trafficModifiers[trafKey].labelDe : trafficModifiers[trafKey].labelEn}</div>
                    <div className="text-3xs font-mono-code text-amber-500/80">+{trafficModifiers[trafKey].score} Pts</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sun & Microclimate */}
          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider font-mono-code text-stone-600 mb-2">
              {lang === 'de' ? 'Mikroklima & Hitzeinsel-Faktor:' : 'Microclimate & Heat Stress:'}
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(Object.keys(sunModifiers) as Array<keyof typeof sunModifiers>).map((sKey) => {
                const isSelected = sunExposure === sKey;
                return (
                  <button
                    key={sKey}
                    type="button"
                    onClick={() => setSunExposure(sKey)}
                    className={`p-2 rounded-lg border text-left text-2xs transition-all ${
                    isSelected
                      ? 'bg-stone-800 text-white font-bold border-stone-800'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                  >
                    <div className="font-sans leading-tight">{lang === 'de' ? sunModifiers[sKey].labelDe.split('(')[0] : sunModifiers[sKey].labelEn.split('(')[0]}</div>
                    <div className="text-3xs font-mono-code text-stone-400">+{sunModifiers[sKey].score}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bot Superpower Card & CSR Strategy Profile */}
          <div className="p-3.5 bg-lime-50/70 border border-lime-200 rounded-xl space-y-2 text-xs text-lime-950">
            <div className="flex items-center justify-between">
              <div className="font-bold flex items-center gap-1.5 text-stone-900 font-mono-code text-2xs uppercase">
                <span>⚡ Grime CSR Profil & Strategie:</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-lime-200/70 text-lime-900 text-3xs font-mono-code font-bold">
                {currentPlantData.csrStrategy}
              </span>
            </div>

            {/* 6-Axis CSR Mini Traits */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-center py-1">
              <div className="bg-white/80 p-1 rounded border border-lime-200">
                <div className="text-3xs text-stone-500 font-mono-code">Wurzel</div>
                <div className="font-bold text-stone-800 font-mono-code">{currentPlantData.csrTraits.root}/10</div>
              </div>
              <div className="bg-white/80 p-1 rounded border border-lime-200">
                <div className="text-3xs text-stone-500 font-mono-code">Tritt</div>
                <div className="font-bold text-stone-800 font-mono-code">{currentPlantData.csrTraits.trample}/10</div>
              </div>
              <div className="bg-white/80 p-1 rounded border border-lime-200">
                <div className="text-3xs text-stone-500 font-mono-code">Dürre</div>
                <div className="font-bold text-stone-800 font-mono-code">{currentPlantData.csrTraits.drought}/10</div>
              </div>
              <div className="bg-white/80 p-1 rounded border border-lime-200">
                <div className="text-3xs text-stone-500 font-mono-code">Samen</div>
                <div className="font-bold text-stone-800 font-mono-code">{currentPlantData.csrTraits.seed}/10</div>
              </div>
              <div className="bg-white/80 p-1 rounded border border-lime-200">
                <div className="text-3xs text-stone-500 font-mono-code">Tempo</div>
                <div className="font-bold text-stone-800 font-mono-code">{currentPlantData.csrTraits.speed}/10</div>
              </div>
              <div className="bg-white/80 p-1 rounded border border-lime-200">
                <div className="text-3xs text-stone-500 font-mono-code">Salz/Öl</div>
                <div className="font-bold text-stone-800 font-mono-code">{currentPlantData.csrTraits.chem}/10</div>
              </div>
            </div>

            <p className="font-serif-title text-xs leading-relaxed text-stone-800">
              {lang === 'de' ? currentPlantData.superpowerDe : currentPlantData.superpowerEn}
            </p>
            <div className="text-3xs font-mono-code text-lime-800 pt-0.5">
              Typischer Kiez-Spot: {lang === 'de' ? currentPlantData.urbanNicheDe : currentPlantData.urbanNicheEn}
            </div>
          </div>
        </div>

        {/* Right Column: Time-Lapse Visualizer & Krautschau Export */}
        <div className="lg:col-span-6 space-y-4">
          {/* Time-Lapse Box */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-2xs font-mono-code uppercase tracking-wider text-stone-600 font-bold flex items-center gap-1.5">
                <span>⏱️ Kanten-ausgerichtetes Zeitraffer-Tracking</span>
              </span>
              <span className="text-3xs font-mono-code bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                Woche {timeLapseWeek} von 8
              </span>
            </div>

            {/* Asphalt Crack Simulated Canvas */}
            <div className="h-44 bg-gradient-to-br from-stone-800 via-stone-900 to-black rounded-xl p-4 relative overflow-hidden flex flex-col justify-between border border-stone-700 shadow-inner">
              {/* Asphalt Texture Overlay */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

              {/* Simulated Crack Line across canvas */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0,90 Q 60,85 110,105 T 220,95 T 320,115 T 450,100" fill="none" stroke="#222" strokeWidth="6" strokeLinecap="round" />
                <path d="M 0,90 Q 60,85 110,105 T 220,95 T 320,115 T 450,100" fill="none" stroke="#555" strokeWidth="1.5" strokeDasharray="4 2" />
                <circle cx="220" cy="95" r="4" fill="#a3e635" />
              </svg>

              {/* Top Bar on Canvas */}
              <div className="relative z-10 flex justify-between items-center text-3xs font-mono-code text-stone-400">
                <span className="bg-black/60 px-2 py-0.5 rounded text-lime-400">
                  OpenCV Contour Match: 98.4%
                </span>
                <span className="bg-black/60 px-2 py-0.5 rounded text-stone-300">
                  GPS: 52.4862° N, 13.4321° E (Berlin-Neukölln)
                </span>
              </div>

              {/* Growth Stage Center Description */}
              <div className="relative z-10 text-center py-4">
                <div className="inline-block p-3 rounded-2xl bg-black/80 border border-stone-700 backdrop-blur-xs text-white max-w-sm mx-auto shadow-lg">
                  <div className="text-xs font-bold text-lime-300 font-serif-title">
                    {lang === 'de'
                      ? currentPlantData.growthStages.find((s) => s.week === timeLapseWeek)?.labelDe || currentPlantData.growthStages[2].labelDe
                      : currentPlantData.growthStages.find((s) => s.week === timeLapseWeek)?.labelEn || currentPlantData.growthStages[2].labelEn}
                  </div>
                  <div className="text-3xs text-stone-400 font-mono-code mt-1">
                    Substrat: {lang === 'de' ? substrateModifiers[substrateType].labelDe : substrateModifiers[substrateType].labelEn}
                  </div>
                </div>
              </div>

              {/* Chalk Hashtag simulation */}
              <div className="relative z-10 flex justify-between items-end text-3xs font-mono-code text-amber-200/90 font-serif">
                <span className="bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded">
                  ✏️ Kreide-Tag: {currentPlantData.chalkTag}
                </span>
                <span className="text-stone-500">Foto 1 von 4 synchronisiert</span>
              </div>
            </div>

            {/* Week Slider Controls */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-2xs font-mono-code text-stone-600">
                <span>Woche 1: Keimung</span>
                <span>Woche 2: Rosette</span>
                <span>Woche 4: Blüte</span>
                <span>Woche 8: Samen</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 4, 8].map((wk) => (
                  <button
                    key={wk}
                    type="button"
                    onClick={() => setTimeLapseWeek(wk)}
                    className={`py-1.5 rounded-lg text-xs font-mono-code font-bold border transition-all ${
                      timeLapseWeek === wk
                        ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border-stone-200'
                    }`}
                  >
                    W{wk}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Research Data & #Krautschau Senckenberg Export */}
          <div className="bg-stone-900 text-stone-100 rounded-2xl border border-stone-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🏛️</span>
                <span className="text-xs font-bold font-mono-code text-lime-300">
                  {lang === 'de' ? 'Forschungs-Export (#Krautschau & Flora Incognita)' : 'Citizen Science Export (GBIF & #Krautschau)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setExportedKrautschauData(true);
                  setTimeout(() => setExportedKrautschauData(false), 2400);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-2xs font-mono-code transition-all border border-stone-700"
              >
                {exportedKrautschauData ? <Check className="w-3 h-3 text-lime-400" /> : <Copy className="w-3 h-3 text-stone-300" />}
                <span>{exportedKrautschauData ? (lang === 'de' ? 'Exportiert!' : 'Exported!') : (lang === 'de' ? 'GeoJSON kopieren' : 'Copy GeoJSON')}</span>
              </button>
            </div>

            <p className="text-2xs text-stone-400 font-sans leading-relaxed">
              {lang === 'de'
                ? 'Standardisiertes Format für urbane Biodiversitäts-Datenbanken nach dem GartenDiv-Tag-Modell von Flora Incognita:'
                : 'Standardized observation record following the Flora Incognita GartenDiv model for urban biodiversity studies:'}
            </p>

            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-2xs font-mono-code text-stone-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
{`{
  "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [13.4321, 52.4862] },
  "properties": {
    "project": "CrackFloraWatcher",
    "campaign": "Krautschau2026",
    "taxon": "${currentPlantData.nameEn.split('(')[0].trim()}",
    "scientificName": "${currentPlantData.nameDe.split('(')[1]?.replace(')', '') || 'Taraxacum'}",
    "toughnessIndex": ${rawToughnessScore},
    "toughnessRank": "${toughnessRank}",
    "substrate": "${substrateType}",
    "compactionStress": "${trafficExposure}",
    "urbanHeatStress": "${sunExposure}",
    "timeLapseObservationWeeks": ${timeLapseWeek},
    "privacyNoiseOffsetMeters": 25.0,
    "license": "CC0-1.0-Public-Domain"
  }
}`}
            </div>

            {onOpenDose && (
              <div className="pt-2 border-t border-stone-800 flex justify-end">
                <button
                  onClick={() => onOpenDose('crack-flora-watcher')}
                  className="text-lime-400 hover:text-lime-300 hover:underline text-xs flex items-center gap-1 font-semibold"
                >
                  <span>{lang === 'de' ? 'Dose: Crack Flora Watcher öffnen' : 'Open Tin: Crack Flora Watcher'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
