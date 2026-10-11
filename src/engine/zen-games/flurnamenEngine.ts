/**
 * Flurnamen-Verortungsspiel (Historic Field Name Geolocation Engine)
 *
 * Simulates the core mechanic of Ticket 01 for the candidate idea 'flurnamen-verortungsspiel':
 * Players match historical micro-toponyms (Flurnamen) onto an open cadastral parcel basemap
 * using etymological landscape clues and spatial priors (Leave-one-out validation).
 */

export type FlurnameCategory = 'topography' | 'agriculture' | 'mythology' | 'jurisdiction';

export interface FlurnameParcel {
  id: string;
  name: string;
  nameEn: string;
  nameEs: string;
  targetXPercent: number; // 0..100 on normalized cadastral sector
  targetYPercent: number; // 0..100 on normalized cadastral sector
  region: string;
  category: FlurnameCategory;
  clueDe: string;
  clueEn: string;
  clueEs: string;
  etymologyDe: string;
  etymologyEn: string;
  etymologyEs: string;
}

export const HISTORIC_FLURNAMEN_CORPUS: FlurnameParcel[] = [
  {
    id: 'galgenberg',
    name: 'Galgenberg',
    nameEn: 'Gallows Hill',
    nameEs: 'Cerro de la horca',
    targetXPercent: 82,
    targetYPercent: 18,
    region: 'Rostock-Umland (MV)',
    category: 'jurisdiction',
    clueDe: 'Höchste windige Kuppe an der Gemarkungsgrenze, weit abseits des Dorfes und von der Heerstraße aus gut einsehbar.',
    clueEn: 'Highest windswept knoll on the parish boundary, far from the village and clearly visible from the main highway.',
    clueEs: 'Colina más alta en el límite de la aldea, apartada y visible desde el camino principal.',
    etymologyDe: 'Richtstätten lagen aus Rechts- und Aberglaubensgründen fast ausnahmslos an Gemarkungsgrenzen auf exponierten Hügeln.',
    etymologyEn: 'Execution sites were placed on parish borders on elevated ridges for legal jurisdiction and folkloric deterrence.',
    etymologyEs: 'Los patíbulos se erigían en los linderos del municipio sobre colinas altas por motivos legales y supersticiosos.',
  },
  {
    id: 'wolfskuhle',
    name: 'Wolfskuhle',
    nameEn: 'Wolf Hollow',
    nameEs: 'Hondonada del lobo',
    targetXPercent: 74,
    targetYPercent: 78,
    region: 'Mecklenburgische Schweiz',
    category: 'mythology',
    clueDe: 'Tief eingeschnittene Waldsenke im dichten Buchenholz, unwegsam und feucht.',
    clueEn: 'Deeply sunken forest hollow in dense beechwoods, rough and damp.',
    clueEs: 'Hondonada profunda en el bosque de hayas, abrupta y húmeda.',
    etymologyDe: 'Hier wurden bis ins 18. Jahrhundert Fallgruben („Wolfsgruben") angelegt oder Wölfe in Kessellagen getrieben.',
    etymologyEn: 'Sites of historical pitfall traps ("wolf pits") or natural cul-de-sacs where predators were corralled.',
    etymologyEs: 'Antiguas fosas trampa para lobos excavadas en el bosque hasta el siglo XVIII.',
  },
  {
    id: 'hexenacker',
    name: 'Hexenacker',
    nameEn: 'Witches’ Acre',
    nameEs: 'Campo de las brujas',
    targetXPercent: 18,
    targetYPercent: 22,
    region: 'Thüringer Becken',
    category: 'agriculture',
    clueDe: 'Karger, grobsteiniger Geschiebelehm-Acker auf einer Trockenkuppe. Ernten vertrockneten regelmäßig.',
    clueEn: 'Stony, barren glacial till field on a dry knoll. Crops regularly withered.',
    clueEs: 'Campo pedregoso y árido en una loma seca donde las cosechas solían arruinarse.',
    etymologyDe: 'Missernten und ständige Pflugschäden wurden im Volksglauben Hexerei und Teufelswerk zugeschrieben.',
    etymologyEn: 'Recurrent agricultural crop failure and broken plowshares were historically blamed on local witchcraft.',
    etymologyEs: 'Las malas cosechas y arados rotos se atribuían popularmente a hechicerías y brujas.',
  },
  {
    id: 'teufelsmoor',
    name: 'Teufelsmoor',
    nameEn: 'Devil’s Peatland',
    nameEs: 'Turbera del diablo',
    targetXPercent: 28,
    targetYPercent: 84,
    region: 'Rostocker Heide',
    category: 'mythology',
    clueDe: 'Schwingender Schilfgürtel und modriges Niedermoor am Bachrand, für Fuhrwerke unpassierbar.',
    clueEn: 'Quaking reed bed and rotting peat fen along the brookside, impassable for carts.',
    clueEs: 'Carrizal tembloroso y ciénaga junto al arroyo, intransitable para carretas.',
    etymologyDe: 'Heikle, gefährliche Feuchtstellen, in denen Vieh versinken konnte, trugen häufig dämonisierende Schrecknamen.',
    etymologyEn: 'Perilous marshlands where cattle could sink without trace were routinely named after fiends and devils.',
    etymologyEs: 'Zonas pantanosas traicioneras donde el ganado se hundía llevaban nombres demoníacos de advertencia.',
  },
  {
    id: 'pfarrwiese',
    name: 'Pfarrwiese',
    nameEn: 'Parson’s Meadow',
    nameEs: 'Prado del cura',
    targetXPercent: 48,
    targetYPercent: 52,
    region: 'Vorpommern',
    category: 'agriculture',
    clueDe: 'Fruchtbare, saftige Aue direkt am dörflichen Bachlauf, unweit des Kirchturms.',
    clueEn: 'Fertile, lush alluvial meadow right along the village stream, near the church.',
    clueEs: 'Prado fértil y verde junto al arroyo del pueblo, no lejos de la torre de la iglesia.',
    etymologyDe: 'Teil der Pfründe (Widum/Pfarrdotation), die dem Pfarrer zur eigenen Bewirtschaftung oder Verpachtung zugestanden war.',
    etymologyEn: 'Church glebe land granted to the parish priest for his sustenance or tenant leasing.',
    etymologyEs: 'Tierra comunal asignada al sacerdote del pueblo para su sustento o alquiler.',
  },
  {
    id: 'katzensprung',
    name: 'Katzensprung',
    nameEn: 'Cat’s Leap',
    nameEs: 'Salto del gato',
    targetXPercent: 42,
    targetYPercent: 38,
    region: 'Prignitz',
    category: 'topography',
    clueDe: 'Winziger, schmaler Parzellenstreifen zwischen Dorfweg und altem Entwässerungsgraben.',
    clueEn: 'Tiny, narrow sliver of land sandwiched between the village lane and an ancient drainage ditch.',
    clueEs: 'Franja estrecha de tierra encajada entre el camino del pueblo y una zanja antigua.',
    etymologyDe: 'Scherzhafter Spottname für so kleine Grundstücke, dass man sie „mit einem Katzensprung" überqueren konnte.',
    etymologyEn: 'Humorous diminutive toponym designating a plot so diminutive you could leap across it like a cat.',
    etymologyEs: 'Topónimo jocoso para un terreno tan diminuto que se cruzaba de un salto de gato.',
  },
  {
    id: 'hungerborn',
    name: 'Hungerborn',
    nameEn: 'Famine Spring',
    nameEs: 'Manantial del hambre',
    targetXPercent: 14,
    targetYPercent: 62,
    region: 'Thüringer Wald',
    category: 'topography',
    clueDe: 'Intermittierende Karstquelle an einer Felsspalte, die nur in extremen Trockenjahren aktiv wird.',
    clueEn: 'Intermittent karst spring in a rocky cleft that only flows during severe drought years.',
    clueEs: 'Manantial kárstico intermitente en una hendidura rocosa que solo brota en años de gran sequía.',
    etymologyDe: 'Fieber- oder Hungerquellen galten als böses Omen, da ihr Auftreten mit Dürren und Missernten koinzidierte.',
    etymologyEn: 'Hunger springs only surfaced during exceptional hydrological conditions, portending drought and crop loss.',
    etymologyEs: 'Manantiales que solo manaban en condiciones hidrológicas anómalas, presagiando sequía y escasez.',
  },
  {
    id: 'huehnerbiss',
    name: 'Hühnerbiss',
    nameEn: 'Hen’s Peck',
    nameEs: 'Picotazo de gallina',
    targetXPercent: 60,
    targetYPercent: 42,
    region: 'Mecklenburg-Strelitz',
    category: 'agriculture',
    clueDe: 'Ein winziges dreieckiges Zwickelstück am Feldrand, das beim Wenden des Ochsenpflugs übrigblieb.',
    clueEn: 'A tiny triangular leftover wedge at field margins, spared by heavy ox plow turning circles.',
    clueEs: 'Pequeño remanente triangular en el borde del campo, dejado al girar el arado de bueyes.',
    etymologyDe: 'Bezeichnung für Restparzellen von der Größe, die „ein Huhn auf einmal abpicken könnte".',
    etymologyEn: 'Folkloric term for a residual wedge so minuscule a single hen could peck it clean in minutes.',
    etymologyEs: 'Término popular para una porción residual tan minúscula como el bocado de una gallina.',
  },
];

export interface GuessEvaluation {
  parcel: FlurnameParcel;
  guessXPercent: number;
  guessYPercent: number;
  distanceMeters: number;
  score: number;
  ratingLabelDe: string;
  ratingLabelEn: string;
  ratingLabelEs: string;
}

/**
 * Scale assumption: The cadastral sector represents approximately 1,200m x 800m.
 */
export const CADASTRAL_SECTOR_WIDTH_METERS = 1200;
export const CADASTRAL_SECTOR_HEIGHT_METERS = 800;

/**
 * Calculates Euclidean distance in real-world meters between player click and ground truth.
 */
export function calculateParcelDistanceMeters(
  guessXPercent: number,
  guessYPercent: number,
  targetXPercent: number,
  targetYPercent: number
): number {
  const dxMeters = ((guessXPercent - targetXPercent) / 100) * CADASTRAL_SECTOR_WIDTH_METERS;
  const dyMeters = ((guessYPercent - targetYPercent) / 100) * CADASTRAL_SECTOR_HEIGHT_METERS;
  return Math.round(Math.hypot(dxMeters, dyMeters));
}

/**
 * Scores a guess based on hit radius and assigns localized qualitative feedback.
 */
export function evaluateParcelGuess(
  parcel: FlurnameParcel,
  guessXPercent: number,
  guessYPercent: number
): GuessEvaluation {
  const distanceMeters = calculateParcelDistanceMeters(
    guessXPercent,
    guessYPercent,
    parcel.targetXPercent,
    parcel.targetYPercent
  );

  let score = 0;
  let ratingLabelDe = '';
  let ratingLabelEn = '';
  let ratingLabelEs = '';

  if (distanceMeters <= 60) {
    score = 100;
    ratingLabelDe = 'Volltreffer! Historischer Flurkern exakt geortet.';
    ratingLabelEn = 'Bulls-eye! Historical parcel centroid located exactly.';
    ratingLabelEs = '¡Diana! Núcleo histórico de la parcela ubicado exactamente.';
  } else if (distanceMeters <= 140) {
    score = 75;
    ratingLabelDe = 'Sehr nah dran! Nur eine Parzellengrenze daneben.';
    ratingLabelEn = 'Very close! Barely one parcel boundary off.';
    ratingLabelEs = '¡Muy cerca! Apenas a un linde de distancia.';
  } else if (distanceMeters <= 260) {
    score = 45;
    ratingLabelDe = 'Guter toponymischer Riecher, richtige Landschaftslage.';
    ratingLabelEn = 'Good toponymic intuition, right landscape feature.';
    ratingLabelEs = 'Buena intuición toponímica, paisaje acertado.';
  } else {
    score = 15;
    ratingLabelDe = 'Weit entfernt – beachten Sie Geländeform und Windrichtung.';
    ratingLabelEn = 'Far off — consider landforms and exposure clues.';
    ratingLabelEs = 'Lejos — considera la orografía y los vientos.';
  }

  return {
    parcel,
    guessXPercent,
    guessYPercent,
    distanceMeters,
    score,
    ratingLabelDe,
    ratingLabelEn,
    ratingLabelEs,
  };
}

/**
 * Deterministic Leave-One-Out spatial prior estimator.
 * Demonstrates how known georeferenced parcels inform the location of unassigned names
 * by category centroid without requiring external LLM hallucination.
 */
export function computeLeaveOneOutCategoryCentroid(
  knownParcels: FlurnameParcel[],
  targetCategory: FlurnameCategory,
  excludedParcelId?: string
): { centroidX: number; centroidY: number; sampleCount: number } {
  const matching = knownParcels.filter(
    (p) => p.category === targetCategory && p.id !== excludedParcelId
  );

  if (matching.length === 0) {
    return { centroidX: 50, centroidY: 50, sampleCount: 0 };
  }

  const sumX = matching.reduce((acc, p) => acc + p.targetXPercent, 0);
  const sumY = matching.reduce((acc, p) => acc + p.targetYPercent, 0);

  return {
    centroidX: Math.round((sumX / matching.length) * 10) / 10,
    centroidY: Math.round((sumY / matching.length) * 10) / 10,
    sampleCount: matching.length,
  };
}
