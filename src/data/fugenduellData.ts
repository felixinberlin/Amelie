import { stressMeasurements, StressMeasurement } from './fugenduellStressTraits';
import { botanicalSkills, rootDepth, scientificCsr, BotanicalSkill } from './fugenduellSkills';
export interface PlantRosterItem {
  id: string;
  nameCommonDe: string;
  nameCommonEn: string;
  scientificName: string;
  csr: string | null; // Pladias / Pierce method, never inferred from game archetype
  csrLabelDe: string;
  csrLabelEn: string;
  stats: {
    wurzel: number | null; // UNDERPLOT RDepth, metres, species mean of observed maxima
    tritt: number | null; // No verified trampling measurement yet
    duerre: number | null; // No verified physiological drought threshold yet
    saat: number | null; // No verified seed output measurement yet
    tempo: number | null; // No verified relative growth rate yet
    chemie: number | null; // No verified common chemical metric yet
  };
  totalBudget: number | null; // Always null in scientific roster; numeric only in explicit prototype fixtures
  skills: BotanicalSkill[];
  stressMeasurements: StressMeasurement[];
  primaryDatabaseSource: string;
  /** @deprecated Compatibility alias for the archived engine; use the four sourced skills. */
  signatureSkill: {
    nameDe: string;
    nameEn: string;
    type: 'Passive' | 'Offensive' | 'Defensive' | 'Utility' | 'Substrate';
    mechanismDe: string;
    mechanismEn: string;
  };
  urbanHabitatDe: string;
  urbanHabitatEn: string;
  growthTimeLapseWeeks: number[];
  bannedFromRanked?: boolean;
}

const ROSTER_IDENTITIES = [
  { id: 'taraxacum-officinale', nameCommonDe: 'Gewöhnlicher Löwenzahn', nameCommonEn: 'Common Dandelion', scientificName: 'Taraxacum officinale' },
  { id: 'plantago-major', nameCommonDe: 'Breitwegerich', nameCommonEn: 'Greater Plantain', scientificName: 'Plantago major' },
  { id: 'poa-annua', nameCommonDe: 'Einjähriges Rispengras', nameCommonEn: 'Annual Meadow Grass', scientificName: 'Poa annua' },
  { id: 'cardamine-hirsuta', nameCommonDe: 'Behaartes Schaumkraut', nameCommonEn: 'Hairy Bittercress', scientificName: 'Cardamine hirsuta' },
  { id: 'cymbalaria-muralis', nameCommonDe: 'Zimbelkraut', nameCommonEn: 'Ivy-Leaved Toadflax', scientificName: 'Cymbalaria muralis' },
  { id: 'asplenium-ruta-muraria', nameCommonDe: 'Mauerraute', nameCommonEn: 'Wall-Rue Fern', scientificName: 'Asplenium ruta-muraria' },
  { id: 'bryum-argenteum', nameCommonDe: 'Silber-Birnmoos', nameCommonEn: 'Silver Moss', scientificName: 'Bryum argenteum' },
  { id: 'portulaca-oleracea', nameCommonDe: 'Sommer-Portulak', nameCommonEn: 'Common Purslane', scientificName: 'Portulaca oleracea' },
  { id: 'erigeron-canadensis', nameCommonDe: 'Kanadisches Berufkraut', nameCommonEn: 'Canadian Horseweed', scientificName: 'Erigeron canadensis' },
  { id: 'chelidonium-majus', nameCommonDe: 'Schöllkraut', nameCommonEn: 'Greater Celandine', scientificName: 'Chelidonium majus' },
  { id: 'sagina-procumbens', nameCommonDe: 'Niederliegendes Mastkraut', nameCommonEn: 'Procumbent Pearlwort', scientificName: 'Sagina procumbens' },
  { id: 'cochlearia-danica', nameCommonDe: 'Dänisches Löffelkraut', nameCommonEn: 'Danish Scurvygrass', scientificName: 'Cochlearia danica' },
  { id: 'buddleja-davidii', nameCommonDe: 'Schmetterlingsflieder', nameCommonEn: 'Butterfly Bush', scientificName: 'Buddleja davidii' },
  { id: 'ailanthus-altissima', nameCommonDe: 'Götterbaum (Invasiv)', nameCommonEn: 'Tree of Heaven (Invasive)', scientificName: 'Ailanthus altissima' },
];

/** Scientific roster. No unitless 0–10 skill scores or invented thresholds. */
export const FUGENDUELL_STARTER_ROSTER: PlantRosterItem[] = ROSTER_IDENTITIES.map(plant => {
 const skills=botanicalSkills(plant.id);
 const csr=scientificCsr(plant.id);
 return {...plant, csr, csrLabelDe:csr ? `${csr} · Pladias/Pierce` : 'CSR noch nicht verifiziert', csrLabelEn:csr ? `${csr} · Pladias/Pierce` : 'CSR not verified',
  stats:{wurzel:rootDepth(plant.id),tritt:null,duerre:null,saat:null,tempo:null,chemie:null},skills,totalBudget:null,stressMeasurements:stressMeasurements(),
  primaryDatabaseSource:[...new Set(skills.map(skill=>skill.source))].join(' · '),
  signatureSkill:{type:'Utility' as const,nameDe:skills[0].nameDe,nameEn:skills[0].nameEn,mechanismDe:skills[0].descriptionDe,mechanismEn:skills[0].descriptionEn},
  urbanHabitatDe:'Siehe den artspezifischen Quellenkontext',urbanHabitatEn:'See taxon-specific source context',
  growthTimeLapseWeeks:[],
 };
});

export interface BattleEvent {
  round: number;
  monthDe: string;
  monthEn: string;
  titleDe: string;
  titleEn: string;
  testedStat: 'wurzel' | 'tritt' | 'duerre' | 'saat' | 'tempo' | 'chemie';
  statLabelDe: string;
  statLabelEn: string;
  narrativeDe: string;
  narrativeEn: string;
  environmentalIntensity: number; // 1-5
}

export const SEASONAL_BATTLE_EVENTS: BattleEvent[] = [
  {
    round: 1,
    monthDe: 'März',
    monthEn: 'March',
    titleDe: 'Schneeschmelze & Wurzelaufbruch',
    titleEn: 'Snowmelt & Root Flush',
    testedStat: 'wurzel',
    statLabelDe: 'WURZEL',
    statLabelEn: 'ROOT',
    narrativeDe: 'Tauwasser schwemmt Nährstoffe in die Tiefe. Wer die tiefere Pfahlwurzel und aktive Knospen hat, gewinnt den Frühlingsstart.',
    narrativeEn: 'Meltwater flushes minerals deep into the fissure. The plant with deeper taproots and active bud banks captures the spring surge.',
    environmentalIntensity: 3
  },
  {
    round: 2,
    monthDe: 'Mai',
    monthEn: 'May',
    titleDe: 'Kehrmaschine & Trittlawine (#Krautschau)',
    titleEn: 'Street Sweeper & Pedestrian Rush',
    testedStat: 'tritt',
    statLabelDe: 'TRITT',
    statLabelEn: 'TRAMPLE',
    narrativeDe: 'Bürgersteige füllen sich, Kinder rollen mit Skateboards, Straßenkehrmaschinen bürsten die Fugen. Reine Trittfestigkeit entscheidet.',
    narrativeEn: 'Pedestrian corridors surge with foot strikes and maintenance street brushes. Pure mechanical compaction tolerance is tested.',
    environmentalIntensity: 4
  },
  {
    round: 3,
    monthDe: 'Juli',
    monthEn: 'July',
    titleDe: 'Asphalt-Gluthitze 39°C',
    titleEn: 'Sidewalk Heatwave 39°C',
    testedStat: 'duerre',
    statLabelDe: 'DÜRRE',
    statLabelEn: 'DROUGHT',
    narrativeDe: 'Oberflächentemperatur im Asphalt übersteigt 52°C. Null Regen seit 21 Tagen. C4/CAM-Stoffwechsel und Turgordruck retten vor dem Verdorren.',
    narrativeEn: 'Surface bitumen temperatures reach 52°C. Zero rainfall for 3 weeks. Xylem resistance and succulence prevent total desiccation.',
    environmentalIntensity: 5
  },
  {
    round: 4,
    monthDe: 'September',
    monthEn: 'September',
    titleDe: 'Herbststurm & Samenausbreitung',
    titleEn: 'Autumn Gale & Seed Dispersal',
    testedStat: 'saat',
    statLabelDe: 'SAAT',
    statLabelEn: 'SEED',
    narrativeDe: 'Herbstböen fegen durch die Straßenschluchten. Wer Flugschirme, Kletten oder Schleuderkapseln besitzt, erobert neue Territorien.',
    narrativeEn: 'Turbulent updrafts rush through concrete street canyons. Plants with pappus parachutes or ballistic siliques colonize adjacent tiles.',
    environmentalIntensity: 3
  },
  {
    round: 5,
    monthDe: 'Oktober',
    monthEn: 'October',
    titleDe: 'Letzter Wachstumsspurt vor Frost',
    titleEn: 'Final Growth Sprint Before Frost',
    testedStat: 'tempo',
    statLabelDe: 'TEMPO',
    statLabelEn: 'SPEED',
    narrativeDe: 'Tageslicht schrumpft rapide. Nur Arten mit extrem hoher Wachstumsrate (RGR) schaffen noch eine letzte vegetative Generation.',
    narrativeEn: 'Daylight fades quickly. Only high Relative Growth Rate (RGR) species can push one final seed generation before freeze-up.',
    environmentalIntensity: 3
  },
  {
    round: 6,
    monthDe: 'Januar',
    monthEn: 'January',
    titleDe: 'Eisregen & Streusalz-Schock',
    titleEn: 'Freezing Rain & Winter De-icing Salt',
    testedStat: 'chemie',
    statLabelDe: 'CHEMIE',
    statLabelEn: 'CHEMISTRY',
    narrativeDe: 'Tausalz und saurer Straßenschmutz fluten die Fuge. Nur Pflanzen mit chemischen Schutzstoffen und Salzdrüsen überleben den Frost.',
    narrativeEn: 'Toxic deicing salt and road runoff saturate the pore soil. Only halophytic chemical defenses prevent cellular collapse.',
    environmentalIntensity: 4
  }
];

/** Arena context for the skill conditions of the Crack Flora master deck (Gehwegfuge, Mauerfuge, Streusalz-Zone …). */
export interface ArenaContext {
  id: string;
  labelDe: string;
  labelEn: string;
  labelEs: string;
  surface: 'asphalt' | 'mortar' | 'paving' | 'gravel';
  disturbance: number;     // 0-10 (Trittlast, Kehrmaschine)
  surfaceTempC: number;    // Sommer-Oberflächentemperatur
  vertical: boolean;       // senkrechte Mauerfuge
  saline: boolean;         // Streusalz-Zone
}

export const FUGENDUELL_ARENAS: ArenaContext[] = [
  { id: 'gehwegfuge', labelDe: 'Gehwegfuge (Asphalt)', labelEn: 'Sidewalk crack (asphalt)', labelEs: 'Grieta de acera (asfalto)', surface: 'asphalt', disturbance: 5, surfaceTempC: 40, vertical: false, saline: false },
  { id: 'hauptstrasse', labelDe: 'Hauptstraße (Pflasterfuge, hohe Trittlast)', labelEn: 'High-traffic walkway (cobbles)', labelEs: 'Calle principal (adoquín, mucho tráfico)', surface: 'paving', disturbance: 8, surfaceTempC: 35, vertical: false, saline: false },
  { id: 'mauerfuge', labelDe: 'Mauerfuge (Kalkmörtel, senkrecht)', labelEn: 'Wall joint (lime mortar, vertical)', labelEs: 'Junta de muro (mortero de cal, vertical)', surface: 'mortar', disturbance: 1, surfaceTempC: 30, vertical: true, saline: false },
  { id: 'suedwand', labelDe: 'Südwand-Asphalt (>50 °C)', labelEn: 'South-facing sunbake (>50 °C)', labelEs: 'Asfalto orientado al sur (>50 °C)', surface: 'asphalt', disturbance: 3, surfaceTempC: 52, vertical: false, saline: false },
  { id: 'streusalz', labelDe: 'Autobahnrand (Streusalz-Zone)', labelEn: 'Highway median (de-icing salt)', labelEs: 'Arcén de autopista (sal de deshielo)', surface: 'gravel', disturbance: 2, surfaceTempC: 38, vertical: false, saline: true },
  { id: 'gleisbett', labelDe: 'Gleisbett / Brache (Schotter)', labelEn: 'Railway bed / wasteland (gravel)', labelEs: 'Balasto / solar (grava)', surface: 'gravel', disturbance: 2, surfaceTempC: 42, vertical: false, saline: false },
];
