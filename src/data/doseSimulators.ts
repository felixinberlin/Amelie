export type SimulatorKey =
  | 'altbau'
  | 'glasanflug'
  | 'streiflicht'
  | 'wetink'
  | 'balkon'
  | 'regenwasser'
  | 'klarlokal'
  | 'crackflora';

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
  'glasanflug': {
    key: 'glasanflug',
    titleDe: 'Glasanflug-Risikoampel',
    titleEn: 'Bird Glass Strike Hazard Calculator',
    titleEs: 'Calculadora de Riesgo de Colisión de Aves con Vidrio',
    descriptionDe: 'Berechnung des Vogelschlag-Risikos nach den Kriterien der Länderarbeitsgemeinschaft der Vogelschutzwarten (LAG-VSW).',
    descriptionEn: 'Bird glass collision hazard rating based on the German State Bird Protection Stations (LAG-VSW) standard.',
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
};
