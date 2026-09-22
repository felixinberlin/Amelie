export type SimulatorKey =
  | 'altbau'
  | 'glasanflug'
  | 'streiflicht'
  | 'wetink'
  | 'balkon'
  | 'regenwasser'
  | 'klarlokal'
  | 'crackflora'
  | 'laerm'
  | 'fugenduell';

export interface DoseSimulatorInfo {
  key: SimulatorKey;
  titleDe: string;
  titleEn: string;
  titleEs: string;
  descriptionDe: string;
  descriptionEn: string;
  descriptionEs: string;
  icon: string;
}

export const DOSE_SIMULATOR_MAP: Record<string, DoseSimulatorInfo> = {
  'altbau-thermal': {
    key: 'altbau',
    titleDe: 'Altbau Thermal Simulator',
    titleEn: 'Altbau Thermal Simulator',
    titleEs: 'Simulador Térmico de Edificio Antiguo',
    descriptionDe: 'Interaktiver 2D-Raumeck-Wärmeleitsimulator nach DIN EN ISO 10211 mit Schimmelrisiko-Berechnung.',
    descriptionEn: 'Interactive 2D room corner thermal conductor simulation per DIN EN ISO 10211 with mold risk calculation.',
    descriptionEs: 'Simulador interactivo 2D de conducción térmica en esquinas según DIN EN ISO 10211 con cálculo de riesgo de moho.',
    icon: '🏢',
  },
  'glasanflug-ampel': {
    key: 'glasanflug',
    titleDe: 'Glasanflug-Risikoampel',
    titleEn: 'Bird Glass Strike Hazard Calculator',
    titleEs: 'Calculadora de Riesgo de Colisión de Aves con Vidrio',
    descriptionDe: 'Rechnet das Bewertungsschema der Vogelschutzwarten (LAG VSW 21/01, Stand 2023) aus: vier Kriterien, zwei Vorrangregeln, Beispiele aus dem Anhang des Beschlusses — und „unbestimmt" statt geratener Zahlen.',
    descriptionEn: 'Computes the official German bird-collision assessment scheme (LAG VSW 21/01, 2023 revision): four criteria, two priority rules, worked examples from the decision\u2019s annex \u2014 and \u201cundetermined\u201d instead of guessed numbers.',
    descriptionEs: 'Evaluación de riesgo de colisión de aves en vidrio basada en el estándar oficial LAG-VSW.',
    icon: '🐦',
  },
  'streiflicht': {
    key: 'streiflicht',
    titleDe: 'Streiflicht RTI & Raking Light Labor',
    titleEn: 'RTI Grazing Light Surface Lab',
    titleEs: 'Laboratorio RTI de Luz Rasante',
    descriptionDe: 'Reflectance Transformation Imaging (RTI) zur optischen Lesbarmachung abgetragener Steininschriften.',
    descriptionEn: 'Reflectance Transformation Imaging (RTI) to optically reveal worn stone inscriptions via directional grazing light.',
    descriptionEs: 'Imágenes de transformación de reflectancia (RTI) para revelar inscripciones erosionadas mediante luz rasante.',
    icon: '🔦',
  },
  'wet-ink': {
    key: 'wetink',
    titleDe: 'Wet Ink Kapillar-Simulator',
    titleEn: 'Wet Ink Capillary Flow Simulator',
    titleEs: 'Simulador de Tinta Líquida y Flujo Capilar',
    descriptionDe: 'Echtzeit-Simulation von Tintenausblutung, Fasersaugspannung und Papier-Kapillareffekten im Browser.',
    descriptionEn: 'Real-time simulation of ink bleed, paper fiber capillary absorption, and feathering directly in canvas.',
    descriptionEs: 'Simulación en tiempo real de absorción capilar, sangrado de tinta y textura de papel en lienzo.',
    icon: '🖋️',
  },
  'wet-ink-capillary': {
    key: 'wetink',
    titleDe: 'Wet Ink Kapillar-Simulator',
    titleEn: 'Wet Ink Capillary Flow Simulator',
    titleEs: 'Simulador de Tinta Líquida y Flujo Capilar',
    descriptionDe: 'Echtzeit-Simulation von Tintenausblutung, Fasersaugspannung und Papier-Kapillareffekten im Browser.',
    descriptionEn: 'Real-time simulation of ink bleed, paper fiber capillary absorption, and feathering directly in canvas.',
    descriptionEs: 'Simulación en tiempo real de absorción capilar, sangrado de tinta y textura de papel en lienzo.',
    icon: '🖋️',
  },
  'balkonkraftwerk': {
    key: 'balkon',
    titleDe: 'Balkonkraftwerk Ertrags- & Amortisationsrechner',
    titleEn: 'Balcony Solar Yield & Payback Calculator',
    titleEs: 'Calculadora de Rendimiento y Amortización Solar de Balcón',
    descriptionDe: 'Berechnet PVGIS-Jahresertrag, Eigenverbrauchsquote und Amortisationsdauer für Mini-Solaranlagen.',
    descriptionEn: 'Calculates PVGIS annual yield, self-consumption share, and payback duration for plug-in solar kits.',
    descriptionEs: 'Calcula rendimiento anual PVGIS, cuota de autoconsumo y amortización para kits solares de balcón.',
    icon: '☀️',
  },
  'regenwasser': {
    key: 'regenwasser',
    titleDe: 'Regenwasser & Zisternen-Dimensionierer',
    titleEn: 'Rainwater Harvesting & Cistern Sizing Calculator',
    titleEs: 'Calculadora de Recolección de Lluvia y Dimensionamiento de Cisterna',
    descriptionDe: 'Dachablauf-Simulation nach DIN 1989-1 mit Trinkwasser-Einsparung und Starkregen-Rückhaltepuffer.',
    descriptionEn: 'Roof runoff harvest simulation per DIN 1989-1 with potable water savings and storm surge buffer.',
    descriptionEs: 'Simulación de escorrentía de techos según DIN 1989-1 con ahorro de agua potable y amortiguación pluvial.',
    icon: '🌧️',
  },
  'klarlokal': {
    key: 'klarlokal',
    titleDe: 'KlarLokal: Beamtendeutsch-Brecheisen',
    titleEn: 'KlarLokal: Bureaucracy Battering Ram',
    titleEs: 'KlarLokal: Palanca contra la Burocracia',
    descriptionDe: '100% lokale WebGPU/WebLLM-Inferenz nach DIN SPEC 33429 (Leichte Sprache) zur Extraktion von Frist, Urteil und Checkliste.',
    descriptionEn: '100% on-device WebGPU/WebLLM inference per DIN SPEC 33429 to extract deadline, plain verdict, and action checklist.',
    descriptionEs: 'Inferencia local por WebGPU/WebLLM según DIN SPEC 33429 para extraer plazos, veredicto y lista de acciones.',
    icon: '🛡️',
  },
  'crack-flora-watcher': {
    key: 'crackflora',
    titleDe: 'Crack Flora Watcher: Ritzengrün-Labor',
    titleEn: 'Crack Flora Watcher: Pavement Botany Lab',
    titleEs: 'Crack Flora Watcher: Laboratorio de Botánica Urbana',
    descriptionDe: 'Toughness-Index-Berechnung und Zeitraffer-Tracking von Straßenritzen-Pflanzen für die #Krautschau Bürgerwissenschaft.',
    descriptionEn: 'Toughness index scoring and time-lapse growth monitoring for pavement sidewalk botany (#Krautschau).',
    descriptionEs: 'Puntaje de resistencia botánica urbana y seguimiento de plantas en grietas para la ciencia ciudadana.',
    icon: '🌿',
  },
  'kiez-laermkarte': {
    key: 'laerm',
    titleDe: 'Kiez-Lärmkarte: 24h Zeitstruktur & Ruhe-Fenster',
    titleEn: 'Kiez Noise Map: 24h Rhythm & Tranquility Windows',
    titleEs: 'Mapa de Ruido Kiez: Ritmo 24h y Ventanas de Calma',
    descriptionDe: '24h Zeitstruktur-Simulator Berliner Straßen-Typologien mit WHO-Schlaftest und Zero-Audio Live-Pegelmessung.',
    descriptionEn: '24h diurnal soundscape simulator for Berlin street typologies with WHO sleep audit and zero-audio live dB meter.',
    descriptionEs: 'Simulador acústico 24h para tipologías de calles berlinesas con test de sueño de la OMS y sonómetro en vivo sin audio.',
    icon: '🎧',
  },
  'fugenduell-asphalt-arena': {
    key: 'fugenduell',
    titleDe: 'Fugenduell: Asphaltritzen-Arena',
    titleEn: 'Fugenduell: Sidewalk Crack Arena',
    titleEs: 'Fugenduell: Duelo de Grietas Urbanas',
    descriptionDe: 'Taktisches Ökologie-Duell: 14 Asphalthelden, 36-Punkte-CSR-Budget, 6 Saison-Events und Deckungs-Tauziehen.',
    descriptionEn: 'Tactical ecology duel: 14 asphalt pioneers, 36-point CSR budget, 6 seasonal rounds, and coverage tug-of-war.',
    descriptionEs: 'Duelo táctico de ecología urbana: 14 especies pioneras, presupuesto CSR de 36 puntos y 6 rondas estacionales.',
    icon: '⚔️',
  },
};
