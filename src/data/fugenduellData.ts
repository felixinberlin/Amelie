export interface PlantRosterItem {
  id: string;
  nameCommonDe: string;
  nameCommonEn: string;
  scientificName: string;
  csr: 'R' | 'C' | 'S' | 'RC' | 'RCS' | 'SR' | 'CR' | 'CS';
  csrLabelDe: string;
  csrLabelEn: string;
  stats: {
    wurzel: number; // 0-10 Rooting depth & bud bank capacity
    tritt: number;  // 0-10 Compaction & trampling tolerance
    duerre: number; // 0-10 Drought & leaf turgor / CAM-C4
    saat: number;   // 0-10 Seed output & dispersal distance
    tempo: number;  // 0-10 Relative growth rate (RGR)
    chemie: number; // 0-10 Allelopathy & secondary compounds
  };
  totalBudget: number; // Max 36 points
  primaryDatabaseSource: string;
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

export const FUGENDUELL_STARTER_ROSTER: PlantRosterItem[] = [
  {
    id: 'taraxacum-officinale',
    nameCommonDe: 'Gewöhnlicher Löwenzahn',
    nameCommonEn: 'Common Dandelion',
    scientificName: 'Taraxacum officinale',
    csr: 'RC',
    csrLabelDe: 'Ruderal-Konkurrent (RC)',
    csrLabelEn: 'Ruderal-Competitor (RC)',
    stats: { wurzel: 5, tritt: 5, duerre: 5, saat: 6, tempo: 7, chemie: 4 },
    totalBudget: 32,
    primaryDatabaseSource: 'UNDERPLOT DB (1.0m Pfahlwurzel) & LEDA Seed DB',
    signatureSkill: {
      nameDe: 'Pfahlwurzelbohrer & Fallschirmwolke',
      nameEn: 'Taproot Borer & Parachute Cloud',
      type: 'Defensive',
      mechanismDe: 'Regeneriert aus 5mm Wurzelstücken: WURZEL +2 und nur halber Deckungsverlust bei Bausanierungen.',
      mechanismEn: 'Regenerates from root fragments: +2 ROOT and halves coverage loss against physical disturbances.'
    },
    urbanHabitatDe: 'Asphalt-Dehnungsfugen, Gehwegkanten, Bussteige',
    urbanHabitatEn: 'Asphalt expansion seams, sidewalk curbs, bus platforms',
    growthTimeLapseWeeks: [1, 2, 4, 8]
  },
  {
    id: 'plantago-major',
    nameCommonDe: 'Breitwegerich',
    nameCommonEn: 'Greater Plantain',
    scientificName: 'Plantago major',
    csr: 'RCS',
    csrLabelDe: 'Universal-Stresstolerator (RCS)',
    csrLabelEn: 'Universal Stress-Tolerator (RCS)',
    stats: { wurzel: 5, tritt: 9, duerre: 6, saat: 4, tempo: 4, chemie: 4 },
    totalBudget: 32,
    primaryDatabaseSource: 'Cole & Bayfield Trample Protocol (Index 78/100)',
    signatureSkill: {
      nameDe: 'Trittplatte & Sohlenfracht',
      nameEn: 'Trample Plate & Shoe Freight',
      type: 'Passive',
      mechanismDe: 'Flache Rosette mit elastischen Blattrippen: TRITT zählt doppelt in Fußgängerzonen; Samen haften an Schuhsohlen.',
      mechanismEn: 'Prostrate rosette: TRAMPLE stat counts double under high foot traffic; seeds stick to shoe soles.'
    },
    urbanHabitatDe: 'Kopfsteinpflaster, Schulhöfe, Bahnschwellen',
    urbanHabitatEn: 'Cobblestone joints, school playgrounds, transit walkways',
    growthTimeLapseWeeks: [1, 2, 4, 8]
  },
  {
    id: 'poa-annua',
    nameCommonDe: 'Einjähriges Rispengras',
    nameCommonEn: 'Annual Meadow Grass',
    scientificName: 'Poa annua',
    csr: 'R',
    csrLabelDe: 'Reiner Ruderal-Pionier (R)',
    csrLabelEn: 'Pure Ruderal Pioneer (R)',
    stats: { wurzel: 3, tritt: 6, duerre: 4, saat: 8, tempo: 10, chemie: 3 },
    totalBudget: 34,
    primaryDatabaseSource: 'Grime & Hunt RGR (0.35 g/g/d) & SID Kew',
    signatureSkill: {
      nameDe: 'Dauerblüte (Blitz-Phenologie)',
      nameEn: 'Continuous Bloom (Rapid Phenology)',
      type: 'Offensive',
      mechanismDe: 'Blüht und samt in unter 45 Tagen aus: Gewinnt immer den Initiative-Vorteil in jeder Duellrunde.',
      mechanismEn: 'Flowers and seeds in <45 days: Gains permanent round turn priority.'
    },
    urbanHabitatDe: 'Pflasterritzen aller Art, feuchte Gehwegsenken',
    urbanHabitatEn: 'Pavement crevices of all types, moist sidewalk depressions',
    growthTimeLapseWeeks: [1, 2, 3, 6]
  },
  {
    id: 'cardamine-hirsuta',
    nameCommonDe: 'Behaartes Schaumkraut',
    nameCommonEn: 'Hairy Bittercress',
    scientificName: 'Cardamine hirsuta',
    csr: 'R',
    csrLabelDe: 'Ephemerer Ruderalis (R)',
    csrLabelEn: 'Ephemeral Ruderal (R)',
    stats: { wurzel: 3, tritt: 4, duerre: 3, saat: 8, tempo: 9, chemie: 5 },
    totalBudget: 32,
    primaryDatabaseSource: 'SID Kew & Ballistic Dehiscence Trials',
    signatureSkill: {
      nameDe: 'Schleudersitz (Ballistochorie)',
      nameEn: 'Ejection Seat (Ballistic Dehiscence)',
      type: 'Utility',
      mechanismDe: 'Unter Überdruck explodierende Schoten schleudern Samen über 1,5m weit in benachbarte Ritzen.',
      mechanismEn: 'High-pressure siliques launch seeds over 1.5m into neighboring pavement fissures on defeat.'
    },
    urbanHabitatDe: 'Baumscheibenränder, Friedhofswege, Schotter',
    urbanHabitatEn: 'Tree pits, urban gravel walks, park seams',
    growthTimeLapseWeeks: [1, 2, 4, 6]
  },
  {
    id: 'cymbalaria-muralis',
    nameCommonDe: 'Zimbelkraut',
    nameCommonEn: 'Ivy-Leaved Toadflax',
    scientificName: 'Cymbalaria muralis',
    csr: 'SR',
    csrLabelDe: 'Stress-Ruderal Mauer-Spezialist (SR)',
    csrLabelEn: 'Stress-Ruderal Wall Specialist (SR)',
    stats: { wurzel: 4, tritt: 3, duerre: 6, saat: 7, tempo: 6, chemie: 4 },
    totalBudget: 30,
    primaryDatabaseSource: 'Kew Plants of the World & Negative Phototropism Specs',
    signatureSkill: {
      nameDe: 'Lichtflucht (Negativer Phototropismus)',
      nameEn: 'Light Flight (Negative Phototropism)',
      type: 'Substrate',
      mechanismDe: 'Fruchtstiele wenden sich aktiv vom Licht ab und pflanzen ihre Samen eigenhändig tief in Mauerfugen ein.',
      mechanismEn: 'Fruiting stalks bend away from light to push seeds directly into deep mortar crevices.'
    },
    urbanHabitatDe: 'Historische Ziegelmauern, Kalkmörtelfugen, Bahndämme',
    urbanHabitatEn: 'Historic brick facades, limestone mortar joints, railway walls',
    growthTimeLapseWeeks: [1, 3, 6, 12]
  },
  {
    id: 'asplenium-ruta-muraria',
    nameCommonDe: 'Mauerraute',
    nameCommonEn: 'Wall-Rue Fern',
    scientificName: 'Asplenium ruta-muraria',
    csr: 'S',
    csrLabelDe: 'Extremer Stresstolerator (S)',
    csrLabelEn: 'Extreme Stress-Tolerator (S)',
    stats: { wurzel: 6, tritt: 2, duerre: 9, saat: 4, tempo: 2, chemie: 5 },
    totalBudget: 28,
    primaryDatabaseSource: 'Xylem Functional Traits DB (Austrocknungstoleranz)',
    signatureSkill: {
      nameDe: 'Kalkanker (Saxicol-Festung)',
      nameEn: 'Limestone Anchor (Saxicole Fortress)',
      type: 'Defensive',
      mechanismDe: 'Verzahnung im alkalischen Mörtel: Unzerstörbar gegen Trockenheit und Hitze in vertikalen Fugen.',
      mechanismEn: 'Root wedging into mortar: Immune to lethal drought damage in vertical masonry cracks.'
    },
    urbanHabitatDe: 'Alte Kalksteinmauern, Brückenpfeiler, schattige Fugen',
    urbanHabitatEn: 'Old masonry, bridge abutments, vertical lime seams',
    growthTimeLapseWeeks: [2, 6, 12, 24]
  },
  {
    id: 'bryum-argenteum',
    nameCommonDe: 'Silber-Birnmoos',
    nameCommonEn: 'Silver Moss',
    scientificName: 'Bryum argenteum',
    csr: 'S',
    csrLabelDe: 'Poikilohydrer Stresstolerator (S)',
    csrLabelEn: 'Poikilohydric Stress-Tolerator (S)',
    stats: { wurzel: 3, tritt: 5, duerre: 10, saat: 3, tempo: 2, chemie: 4 },
    totalBudget: 27,
    primaryDatabaseSource: 'Bryophyte Desiccation Tolerance Studies',
    signatureSkill: {
      nameDe: 'Trockenstarre (Kryptobiose)',
      nameEn: 'Desiccation Stupor (Cryptobiosis)',
      type: 'Passive',
      mechanismDe: 'Poikilohydrische Wiederbelebung: Sinkt niemals unter 5% Deckung und erholt sich nach Regen in Minuten.',
      mechanismEn: 'Poikilohydric recovery: Never drops below 5% coverage; rebounds immediately upon rehydration.'
    },
    urbanHabitatDe: 'Asphaltporen, sonnige Bordsteinkanten, Dächer',
    urbanHabitatEn: 'Sidewalk pores, baking curbstones, rooftop edges',
    growthTimeLapseWeeks: [1, 4, 8, 16]
  },
  {
    id: 'portulaca-oleracea',
    nameCommonDe: 'Sommer-Portulak',
    nameCommonEn: 'Common Purslane',
    scientificName: 'Portulaca oleracea',
    csr: 'SR',
    csrLabelDe: 'Sukkulenter Hitze-Stresstolerator (SR)',
    csrLabelEn: 'Succulent Heat Specialist (SR)',
    stats: { wurzel: 4, tritt: 4, duerre: 10, saat: 7, tempo: 6, chemie: 4 },
    totalBudget: 35,
    primaryDatabaseSource: 'C4/CAM Dual Pathway Photosynthesis Data',
    signatureSkill: {
      nameDe: 'C4-Turbo (Dualer Stoffwechsel)',
      nameEn: 'C4-Turbo (Dual Photosynthesis)',
      type: 'Passive',
      mechanismDe: 'Schaltet bei Hitze von C4 auf CAM um: DÜRRE-Multiplikator verdreifacht sich bei Straßentemperaturen >40°C.',
      mechanismEn: 'Switches between C4 and CAM: Triples drought multiplier in extreme heatwaves.'
    },
    urbanHabitatDe: 'Sonnigste Gehwegplatten, Straßenbahnbetten, Parkplätze',
    urbanHabitatEn: 'Scorching pavement flagstones, tram ballast, open parking slabs',
    growthTimeLapseWeeks: [1, 2, 4, 8]
  },
  {
    id: 'erigeron-canadensis',
    nameCommonDe: 'Kanadisches Berufkraut',
    nameCommonEn: 'Canadian Horseweed',
    scientificName: 'Erigeron canadensis',
    csr: 'R',
    csrLabelDe: 'Urbane Hitzeinsel-Pionier (R)',
    csrLabelEn: 'Urban Heat-Island Pioneer (R)',
    stats: { wurzel: 4, tritt: 3, duerre: 5, saat: 9, tempo: 7, chemie: 5 },
    totalBudget: 33,
    primaryDatabaseSource: 'SID Kew (200.000 Flugsamen/Individuum)',
    signatureSkill: {
      nameDe: 'Resistenzfeld & Windexpress',
      nameEn: 'Resistance Field & Wind Express',
      type: 'Offensive',
      mechanismDe: 'Über 200.000 aerodynamische Flugsamen: Reicht in städtischen Fallwinden hunderte Meter weit.',
      mechanismEn: '200,000 aerodynamic seeds per plant: Exploits urban canyon wind tunnels across kilometers.'
    },
    urbanHabitatDe: 'Fassadenränder, Baulücken, sandige Risse',
    urbanHabitatEn: 'Building perimeter seams, vacant lots, sandy curb fissures',
    growthTimeLapseWeeks: [1, 2, 5, 10]
  },
  {
    id: 'chelidonium-majus',
    nameCommonDe: 'Schöllkraut',
    nameCommonEn: 'Greater Celandine',
    scientificName: 'Chelidonium majus',
    csr: 'CR',
    csrLabelDe: 'Chemisch-aggressiver Konkurrent (CR)',
    csrLabelEn: 'Chemical Aggressive Competitor (CR)',
    stats: { wurzel: 5, tritt: 4, duerre: 4, saat: 6, tempo: 5, chemie: 9 },
    totalBudget: 33,
    primaryDatabaseSource: "Dr. Duke's Phytochemical DB (Isochinolin-Alkaloide)",
    signatureSkill: {
      nameDe: 'Orange-Milchsaft & Ameisenpost',
      nameEn: 'Orange Latex & Ant Post',
      type: 'Offensive',
      mechanismDe: 'Giftiger Alkaloid-Milchsaft senkt Gegner-CHEMIE um -2; fettreiche Elaiosome locken Ameisen als Samenspediteure an.',
      mechanismEn: 'Toxic latex sap reduces opponent CHEMISTRY by -2; lipid-rich elaiosomes summon ants for dispersal.'
    },
    urbanHabitatDe: 'Hinterhöfe, Mauerecken, Parkwegränder',
    urbanHabitatEn: 'Courtyard masonry, shadowy wall recesses, alleyway edges',
    growthTimeLapseWeeks: [1, 3, 6, 12]
  },
  {
    id: 'sagina-procumbens',
    nameCommonDe: 'Niederliegendes Mastkraut',
    nameCommonEn: 'Procumbent Pearlwort',
    scientificName: 'Sagina procumbens',
    csr: 'SR',
    csrLabelDe: 'Polster-Stresstolerator (SR)',
    csrLabelEn: 'Mat-Forming Stress-Tolerator (SR)',
    stats: { wurzel: 4, tritt: 8, duerre: 6, saat: 5, tempo: 5, chemie: 3 },
    totalBudget: 31,
    primaryDatabaseSource: 'Urban Trampling Studies (Berlin Sidewalks)',
    signatureSkill: {
      nameDe: 'Polstergriff (Asphaltmatte)',
      nameEn: 'Cushion Grip (Asphalt Mat)',
      type: 'Defensive',
      mechanismDe: 'Flacher Rasenpolsterwuchs: Erleidet 0% Deckungsverlust durch Tritte und regeneriert +3% Deckung pro Runde.',
      mechanismEn: 'Dense moss-like mat: Takes zero damage from trampling and heals +3% coverage per round.'
    },
    urbanHabitatDe: 'Feuchte Pflasterfugen, Waschbetonplatten, Brunnenränder',
    urbanHabitatEn: 'Moist paving seams, exposed aggregate slabs, street gutters',
    growthTimeLapseWeeks: [1, 2, 4, 8]
  },
  {
    id: 'cochlearia-danica',
    nameCommonDe: 'Dänisches Löffelkraut',
    nameCommonEn: 'Danish Scurvygrass',
    scientificName: 'Cochlearia danica',
    csr: 'SR',
    csrLabelDe: 'Halophytischer Salz-Spezialist (SR)',
    csrLabelEn: 'Halophytic Salt Specialist (SR)',
    stats: { wurzel: 4, tritt: 5, duerre: 7, saat: 5, tempo: 4, chemie: 7 },
    totalBudget: 32,
    primaryDatabaseSource: 'Highway Halophyte Expansion Database (BfN)',
    signatureSkill: {
      nameDe: 'Salzpumpe (Streusalz-Booster)',
      nameEn: 'Salt Pump (De-icing Salt Booster)',
      type: 'Substrate',
      mechanismDe: 'Blattsalzdrüsen: Verdoppelt Deckungszuwachs in winterlichen Streusalz-Ritzen, in denen Konkurrenten absterben.',
      mechanismEn: 'Salt glands: Doubles coverage in brine/salt-soaked curb seams where competitors perish.'
    },
    urbanHabitatDe: 'Mittelstreifen, Autobahnränder, gesalzene Gehwegkanten',
    urbanHabitatEn: 'Street medians, expressway margins, salted winter sidewalks',
    growthTimeLapseWeeks: [1, 3, 6, 10]
  },
  {
    id: 'buddleja-davidii',
    nameCommonDe: 'Schmetterlingsflieder',
    nameCommonEn: 'Butterfly Bush',
    scientificName: 'Buddleja davidii',
    csr: 'CS',
    csrLabelDe: 'Holziger Konkurrent-Stresstolerator (CS)',
    csrLabelEn: 'Woody Competitor-Stress Tolerator (CS)',
    stats: { wurzel: 6, tritt: 3, duerre: 6, saat: 8, tempo: 5, chemie: 4 },
    totalBudget: 32,
    primaryDatabaseSource: 'SID Kew (3.000.000 Flugsamen/Busch) & Urban Forestry',
    signatureSkill: {
      nameDe: 'Mauerkrone (Substrat-Sprenger)',
      nameEn: 'Wall Crown (Substrate Breaker)',
      type: 'Substrate',
      mechanismDe: 'Verholzende Wurzeln weiten Mauerrisse dauerhaft auf und schaffen neuen Lebensraum für Nachfolger.',
      mechanismEn: 'Woody roots fracture masonry permanently, expanding the arena crack.'
    },
    urbanHabitatDe: 'Gleisanlagen, Mauerkronen, Trümmergrundstücke',
    urbanHabitatEn: 'Rail corridors, masonry crowns, post-industrial ruins',
    growthTimeLapseWeeks: [2, 6, 12, 24]
  },
  {
    id: 'ailanthus-altissima',
    nameCommonDe: 'Götterbaum (Invasiv)',
    nameCommonEn: 'Tree of Heaven (Invasive)',
    scientificName: 'Ailanthus altissima',
    csr: 'C',
    csrLabelDe: 'Dominanter Konkurrent (C) · Banned in Ranked',
    csrLabelEn: 'Dominant Competitor (C) · Banned in Ranked',
    stats: { wurzel: 8, tritt: 4, duerre: 7, saat: 7, tempo: 4, chemie: 6 },
    totalBudget: 36,
    primaryDatabaseSource: 'EU Invasive Alien Species Roster & Dr. Duke (Ailanthon)',
    signatureSkill: {
      nameDe: 'Ailanthon-Gift (Allelopathische Barriere)',
      nameEn: 'Ailanthone Herbicide (Allelopathic Barrier)',
      type: 'Offensive',
      mechanismDe: 'Sondert hochwirksames Ailanthon in den Boden ab: Senkt alle gegnerischen Werte um -2 (Aus Ranked gebannt).',
      mechanismEn: 'Exudes potent ailanthone toxin into crack soil: -2 to all opponent stats (Banned from ranked matches).'
    },
    urbanHabitatDe: 'U-Bahnhöfe, Tiefgaragen-Risse, Fassadensockel',
    urbanHabitatEn: 'Subway exits, underground car park joints, foundation cracks',
    growthTimeLapseWeeks: [2, 6, 12, 24],
    bannedFromRanked: true
  }
];

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
