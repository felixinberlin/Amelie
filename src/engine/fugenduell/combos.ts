/**
 * Fugenduell: Combo hands, Special Attacks (Ultimates), and Crack Evolution.
 * 
 * Mixes the Balatro-style combo hand recognition from PR #197 with
 * empirical Urban Crevice Soils (UCS, Manu et al. 2025) pedogenesis
 * and rapid micro-evolution (Cheptou et al. 2008 PNAS).
 * 
 * Sources:
 * - Hofhuis et al. 2016, Cell (Cardamine seed ballistics)
 * - Manu et al. 2025, NSF/SciSoc (Urban crevice soils organic carbon +436%)
 * - Cheptou et al. 2008, PNAS (Crepis non-dispersal seeds)
 * - Servigne & Detrain 2008 / Gorb 2003 (Chelidonium myrmecochory)
 * - Scott & Davison 1985 (Cochlearia road salt corridor)
 */
import { SpeciesProfile } from './watchMode';
import { CityPlace } from '../../data/fugenduellPlaces';

export interface ComboHand {
  id: string;
  nameDe: string;
  nameEn: string;
  taglineDe: string;
  taglineEn: string;
  descriptionDe: string;
  descriptionEn: string;
  ecologyDe: string;
  ecologyEn: string;
  tier: 'duo' | 'trio';
  speciesIds: string[];
}

export const KNOWN_COMBO_HANDS: ComboHand[] = [
  {
    id: 'pflaster-panzer',
    nameDe: 'Pflaster-Panzer',
    nameEn: 'Paving Armour',
    taglineDe: 'Trittfeste Flachhelden',
    taglineEn: 'Trample-proof flat champions',
    descriptionDe: 'Beide Pflanzen wachsen extrem flach: In Trittmonaten erhalten beide +1 Trieb wenn der Fußtritt mindestens einen anderen Trieb raubt.',
    descriptionEn: 'Both plants grow extremely flat: in trampling months, both gain +1 shoot when trampling removes at least one other shoot.',
    ecologyDe: 'Tritttolerante Rosetten- und Polsterpflanzen verdrängen auf Wegen empfindliche Arten (Pladias/RHS).',
    ecologyEn: 'Trampling-tolerant rosette and cushion plants replace sensitive species on walkways (Pladias/RHS).',
    tier: 'duo',
    speciesIds: ['plantago-major', 'sagina-procumbens'],
  },
  {
    id: 'salzwall',
    nameDe: 'Salzwall',
    nameEn: 'Salt Wall',
    taglineDe: 'Tödliche Streusalz-Falle',
    taglineEn: 'Lethal road salt trap',
    descriptionDe: 'Dänisches Löffelkraut und ein salztoleranter Verbündeter: Wintersalz trifft nur Pflanzen mit Salz-Zeigerwert 0 (den Feind), doppelt so hart.',
    descriptionEn: 'Danish scurvygrass and a salt-tolerant ally: winter salt hits only plants with salt indicator 0 (the enemy), twice as hard.',
    ecologyDe: 'Streusalzkorridore entlang europäischer Straßen schaffen maritime Inseln im Binnenland (Scott & Davison 1985).',
    ecologyEn: 'Road de-icing salt corridors create maritime micro-islands inland (Scott & Davison 1985).',
    tier: 'duo',
    speciesIds: ['cochlearia-danica'], // detected with any salt-tolerant ally
  },
  {
    id: 'schirm-schatten',
    nameDe: 'Schirm & Schatten',
    nameEn: 'Umbrella & Shade',
    taglineDe: 'Großer Schirm, geschützter Unterwuchs',
    taglineEn: 'Tall canopy, sheltered understory',
    descriptionDe: 'Solange eine hohe Pflanze lebt, verliert ihr schattentoleranter Verbündeter erst nach ungeschützten Pflanzen Triebe durch Platzmangel.',
    descriptionEn: 'While a tall plant survives, its shade-tolerant ally loses shoots to crowding only after unprotected plants.',
    ecologyDe: 'Sukzessionale Schichtung: Schattentolerante Arten wachsen unter lichten Kronen (L-Zeigerwert ≤ 6).',
    ecologyEn: 'Stratification: shade-tolerant species thrive under open canopies (Light indicator ≤ 6).',
    tier: 'duo',
    speciesIds: [], // detected dynamically: tall (height >= 3) + shade (resist.shade)
  },
  {
    id: 'mauer-clan',
    nameDe: 'Mauer-Clan',
    nameEn: 'Wall Clan',
    taglineDe: 'Vertikale Mörtel-Spezialisten',
    taglineEn: 'Vertical mortar specialists',
    descriptionDe: 'In einer Mauerfuge addieren sich beide Mauer-Boni (+1 zusätzliche Passung für jeden), und der Clan verliert bei Platzmangel erst nach ungeschützten Pflanzen Triebe.',
    descriptionEn: 'In a wall joint, both wall bonuses stack (+1 additional fit bonus each), and the clan loses shoots to crowding only after unprotected plants.',
    ecologyDe: 'Lithophyten in vertikalen Fugen entgehen bodengebundenem Tritt und Beschattung (RHS/BBS).',
    ecologyEn: 'Lithophytes in vertical crevices escape ground-level trampling and shading (RHS/BBS).',
    tier: 'duo',
    speciesIds: ['asplenium-ruta-muraria', 'cymbalaria-muralis'],
  },
  {
    id: 'staffellauf',
    nameDe: 'Staffellauf',
    nameEn: 'Relay Race',
    taglineDe: 'Lückenlose Blüh-Staffel',
    taglineEn: 'Unbroken flowering relay',
    descriptionDe: 'Drei Pflanzen mit gestaffelten Blühzeiten (Frühling, Sommer, ganzjährig): Solange jeden Monat mindestens eine Art blüht, erhält das Team +1 Energie!',
    descriptionEn: 'Three plants with staggered flowering windows: as long as at least one plant blooms each month, the team gains +1 energy!',
    ecologyDe: 'Temporale Nischendifferenzierung: Pflanzen teilen sich Licht und Bestäuber über die Saison (Pladias Blühmonate).',
    ecologyEn: 'Temporal niche partitioning: plants share light and pollinators across the season (Pladias flowering months).',
    tier: 'trio',
    speciesIds: ['cardamine-hirsuta', 'portulaca-oleracea', 'poa-annua'],
  },
  {
    id: 'hitzewelle-gang',
    nameDe: 'Hitzewelle-Gang',
    nameEn: 'Heatwave Gang',
    taglineDe: 'Asphalt-Gluthitze-Spezialisten',
    taglineEn: 'Melting asphalt specialists',
    descriptionDe: 'Drei wärmeliebende Arten (alle T ≥ 7): In Hitzemonaten teilen alle drei ihre Härtungspunkte als gemeinsamer Schutzschild.',
    descriptionEn: 'Three thermophilic species (all T ≥ 7): in heat months, all three share hardening points as a collective shield.',
    ecologyDe: 'Wärmeinseln urbaner Straßen begünstigen thermophile Ruderalfluren (T-Zeigerwert ≥ 7).',
    ecologyEn: 'Urban heat islands favor thermophilic ruderal flora (Temperature indicator ≥ 7).',
    tier: 'trio',
    speciesIds: ['portulaca-oleracea', 'buddleja-davidii', 'cymbalaria-muralis'],
  },
  {
    id: 'kinderstube',
    nameDe: 'Kinderstube',
    nameEn: 'Nursery Cushion',
    taglineDe: 'Schützendes Polster-Mikroklima',
    taglineEn: 'Protective cushion microclimate',
    descriptionDe: 'Mastkraut als Polsterpflanze schützt Keimlinge einjähriger Arten: Der Einjährige nimmt 1 Hitzeschaden weniger.',
    descriptionEn: 'Pearlwort cushion shelters annual seedlings: the annual takes 1 less heat damage.',
    ecologyDe: 'Polsterpflanzen („Nurse plants“) puffern Extremtemperaturen und halten Feuchtigkeit für Sämlinge zurück (Pugnaire et al.).',
    ecologyEn: 'Cushion plants act as nurse plants, buffering temperature extremes and retaining moisture for seedlings (Pugnaire et al.).',
    tier: 'duo',
    speciesIds: ['sagina-procumbens'],
  },
  {
    id: 'ameisenstrasse',
    nameDe: 'Ameisenstraße',
    nameEn: 'Ant Highway',
    taglineDe: 'Gemeinsamer Transport ins Erdreich',
    taglineEn: 'Shared underground seed transport',
    descriptionDe: 'Schöllkraut lockt Ameisen an: Die Arbeiterinnen tragen beim Ameisen-Express auch 1 Samen des Partners ins geschützte Nest.',
    descriptionEn: 'Celandine attracts ants: along with elaiosome seeds, workers carry 1 seed of an ally into the protected nest.',
    ecologyDe: 'Waldameisen tragen im Sammelrausch oft auch Begleitsamen ohne Elaiosom in Erdnester ein (Servigne & Detrain 2008).',
    ecologyEn: 'Foraging ants frequently retrieve companion seeds lacking elaiosomes into underground nests (Servigne & Detrain 2008).',
    tier: 'duo',
    speciesIds: ['chelidonium-majus'],
  },
  {
    id: 'sukzessionskette',
    nameDe: 'Sukzessionskette',
    nameEn: 'Succession Chain',
    taglineDe: 'Einjährige → Ausdauernde → Strauch',
    taglineEn: 'Annuals → Perennials → Shrub',
    descriptionDe: 'Komplette Sukzession (Einjähriger + Hemikryptophyt + Großstrauch): Stirbt der Einjährige ab, hinterlässt er Humus für das ausdauernde Kraut (+1 Trieb).',
    descriptionEn: 'Complete succession (Annual + Perennial + Tall shrub): when the annual dies back, decomposing biomass fuels the perennial (+1 shoot).',
    ecologyDe: 'Primärsukzession im Fugenökosystem: Therophyten bereiten Pionierboden für ausdauernde Ruderalarten und Gehölze (Sukopp & Kowarik).',
    ecologyEn: 'Primary succession in crack ecosystems: therophytes create early organic soil for perennials and woody pioneers (Sukopp & Kowarik).',
    tier: 'trio',
    speciesIds: [],
  },
];

/** Detects which combo hands are formed by a 3-species team. */
export function detectComboHands(team: SpeciesProfile[], place?: CityPlace): ComboHand[] {
  const ids = new Set(team.map(p => p.id));
  const hands: ComboHand[] = [];

  // 1. Pflaster-Panzer
  if (ids.has('plantago-major') && ids.has('sagina-procumbens')) {
    hands.push(KNOWN_COMBO_HANDS.find(h => h.id === 'pflaster-panzer')!);
  }

  // 2. Salzwall: Cochlearia + any ally with salt resistance
  if (ids.has('cochlearia-danica')) {
    const saltAlly = team.find(p => p.id !== 'cochlearia-danica' && p.resist.salt === true);
    if (saltAlly) {
      hands.push(KNOWN_COMBO_HANDS.find(h => h.id === 'salzwall')!);
    }
  }

  // 3. Schirm & Schatten: tall plant (height >= 3) + shade tolerant ally (resist.shade)
  const tall = team.find(p => p.heightClass >= 3);
  const shade = team.find(p => p.resist.shade && p.id !== tall?.id);
  if (tall && shade) {
    hands.push(KNOWN_COMBO_HANDS.find(h => h.id === 'schirm-schatten')!);
  }

  // 4. Mauer-Clan
  if (place?.wallJoint && ids.has('asplenium-ruta-muraria') && ids.has('cymbalaria-muralis')) {
    hands.push(KNOWN_COMBO_HANDS.find(h => h.id === 'mauer-clan')!);
  }

  // 5. Staffellauf (Trio)
  if (ids.has('cardamine-hirsuta') && ids.has('portulaca-oleracea') && ids.has('poa-annua')) {
    hands.push(KNOWN_COMBO_HANDS.find(h => h.id === 'staffellauf')!);
  }

  // 6. Hitzewelle-Gang (Trio)
  if (team.length === 3 && ids.size === 3 && team.every(p => p.resist.heat >= 1)) {
    hands.push(KNOWN_COMBO_HANDS.find(h => h.id === 'hitzewelle-gang')!);
  }

  // 7. Kinderstube (Duo: Sagina + an annual therophyte)
  if (ids.has('sagina-procumbens') && team.some(p => p.lifeForm === 'therophyte')) {
    hands.push(KNOWN_COMBO_HANDS.find(h => h.id === 'kinderstube')!);
  }

  // 8. Ameisenstraße (Duo: Chelidonium + ally)
  if (ids.has('chelidonium-majus')) {
    hands.push(KNOWN_COMBO_HANDS.find(h => h.id === 'ameisenstrasse')!);
  }

  // 9. Sukzessionskette (Trio: Annual + Perennial + Tall pioneer shrub)
  const hasTherophyte = team.some(p => p.lifeForm === 'therophyte');
  const hasHemicryptophyte = team.some(p => p.lifeForm === 'hemicryptophyte');
  const hasTallShrub = team.some(p => p.heightClass >= 3);
  if (hasTherophyte && hasHemicryptophyte && hasTallShrub) {
    hands.push(KNOWN_COMBO_HANDS.find(h => h.id === 'sukzessionskette')!);
  }

  return hands;
}

/**
 * Crack Evolution (Manu et al. 2025, Sukopp & Kowarik):
 * Pedogenesis in sidewalk joints over time.
 */
export interface CrackState {
  level: 1 | 2 | 3;
  nameDe: string;
  nameEn: string;
  capacityBonus: number;
  droughtShield: number; // absorbs this many drought losses per summer
  extraCleaning: boolean; // level 3 has cracked asphalt visible to street sweepers
}

export function getCrackState(level: 1 | 2 | 3): CrackState {
  if (level === 1) {
    return {
      level: 1,
      nameDe: 'Stufe 1: Frischer Splitt (Mineralisch)',
      nameEn: 'Level 1: Fresh Grit (Mineral Sand)',
      capacityBonus: 0,
      droughtShield: 0,
      extraCleaning: false,
    };
  }
  if (level === 2) {
    return {
      level: 2,
      nameDe: 'Stufe 2: Moos-Humus-Fuge (+436% C_org)',
      nameEn: 'Level 2: Moss-Humus Joint (+436% SOC)',
      capacityBonus: 15,
      droughtShield: 1, // organic matter acts as a sponge (Manu et al. 2025)
      extraCleaning: false,
    };
  }
  return {
    level: 3,
    nameDe: 'Stufe 3: Aufgesprengter Asphalt (Tief-Spalt)',
    nameEn: 'Level 3: Fractured Asphalt (Deep Crevice)',
    capacityBonus: 30,
    droughtShield: 2,
    extraCleaning: true, // visible road damage attracts extra cleaning
  };
}

