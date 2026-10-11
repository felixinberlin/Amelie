export type SimulationLayer = 'composite' | 'moisture' | 'paper' | 'pigment' | 'vectorField';
export type EngineMode = 'webgl2' | 'cpu';

export interface KubelkaMunkCoefficients {
  K: [number, number, number]; // Absorption per channel [r, g, b]
  S: [number, number, number]; // Scattering per channel [r, g, b]
}

export interface WetInkPaperConfig {
  id: string;
  nameDe: string;
  nameEn: string;
  nameEs: string;
  descriptionDe: string;
  descriptionEn: string;
  roughness: number;        // 0 to 1: paper tooth depth (granulation & dry brush)
  fiberStrength: number;    // 0 to 1: anisotropy (0 = isotropic copy paper, 1 = long washi fibers)
  fiberBaseAngle: number;   // radians, primary fiber orientation
  capacity: number;         // 0 to 1: sizing (how much water fibers absorb before surface pools)
  evaporationMult: number;  // evaporation speed modifier
  fiberLength?: number;     // mean strand length in cells (default derived from fiberStrength)
  fiberCoverage?: number;   // strand length per cell of area (default derived from fiberStrength)
}

export interface WetInkPigmentConfig {
  id: string;
  nameDe: string;
  nameEn: string;
  nameEs: string;
  colorHex: string;
  r: number;
  g: number;
  b: number;
  density: number;          // pigment concentration
  granulationFactor: number;// tendency to pool in valleys
  bleedSpeed: number;       // capillary mobility
  edgeDarkening: number;    // coffee-ring perimeter drift
  km: KubelkaMunkCoefficients; // Scientific Kubelka-Munk spectral coefficients
}

export interface WetInkSimParams {
  capillaryThreshold: number; // ε_min: moisture threshold before capillary diffusion starts
  enableCapillaryThreshold: boolean; // if false -> smoke/blur bug demonstration
  capillarySpeed: number;
  evaporationRate: number;
  edgeDarkeningStrength: number;
  granulationStrength: number;
  backrunStrength: number;
  dryBrushSensitivity: number;
  tiltX?: number; // Board tilt gravity X (-1 to 1)
  tiltY?: number; // Board tilt gravity Y (-1 to 1)
  enableSaunderson?: boolean; // Saunderson (1942) Fresnel boundary correction
}

export interface SimulationSnapshot {
  waterFilm: Float32Array;
  velX: Float32Array;
  velY: Float32Array;
  pigmentSuspended: Float32Array;
  fiberMoisture: Float32Array;
  pigmentDeposited: Float32Array;
  totalWater: number;
  totalDepositedPigment: number;
}

export type SealStyle = 'zhuwen' | 'baiwen';
export type SealShape = 'square' | 'round';
export type SealGlyph = 'amelie' | 'mo' | 'ji' | 'he' | 'yong' | 'classic';

export interface SealOptions {
  size?: number;
  style?: SealStyle;
  shape?: SealShape;
  glyph?: SealGlyph;
  chippedEdge?: boolean;
}

// Brush Tip Footprint Geometries (Pinsel-Formen / 毛笔与画笔形制)
export type BrushTipShape =
  | 'round'       // Classical round / pointed tip (Zhongfeng 中锋)
  | 'flat'        // Chisel / Flat ribbon brush (Hake / Paibi 排笔)
  | 'slanted'     // Slanted / Cefeng side-cutting chisel (Cefeng 侧锋)
  | 'fan'         // Multi-bristle split fan tufts (Kuabi 散笔 / 抓笔)
  | 'dagger';     // Tapered rigger / sword leaf brush (Bambusblatt / 剑笔)

// Brush Bristle Materials (Borsten-Materialien / 毛料)
export type BrushMaterial =
  | 'weasel'  // 狼毫 (Langhao / Kolinsky Weasel): Springy, elastic, sharp snap
  | 'goat'    // 羊毫 (Yanghao / Soft Goat): Plump, thirsty, rich wash reservoir
  | 'mixed'   // 兼毫 (Jianhao / Hybrid): Firm weasel spine in soft goat mantle
  | 'horse'   // 马毫 / 猪鬃 (Maha / Coarse Bristle): Stiff, coarse, rich Fei Bai striations
  | 'sable';  // 紫毫 / 松鼠 (Zihao / Fine Sable): Ultra-fine, velvety, smooth flow

export interface BrushMaterialConfig {
  id: BrushMaterial;
  nameDe: string;
  nameEn: string;
  zh: string;
  descDe: string;
  descEn: string;
  stiffness: number;           // 0.1 (soft) to 1.0 (very stiff spring)
  reservoir: number;           // fluid capacity scale (0.5 to 1.5)
  flowRate: number;            // ink delivery rate scale
  dryBrushSensitivity: number; // multiplier on speed/pressure threshold for dry brush (Fei Bai)
  bristleSplitting: number;    // micro-striation intensity (0 = silky, 1 = coarse split bristles)
  frictionSound: number;       // acoustic friction factor (0.5 = soft, 1.5 = raspy)
}

export const BRUSH_MATERIAL_PRESETS: BrushMaterialConfig[] = [
  {
    id: 'weasel',
    nameDe: 'Wiesel (狼毫)',
    nameEn: 'Weasel (Langhao)',
    zh: '狼毫',
    descDe: 'Kolinsky-Wieselhaar: Hohe Federkraft (Tanxing), spitze Linienführung, dynamische Rückfederung',
    descEn: 'Kolinsky weasel: High spring elasticity, sharp tip control, dynamic snap-back',
    stiffness: 0.85,
    reservoir: 0.85,
    flowRate: 0.95,
    dryBrushSensitivity: 1.25,
    bristleSplitting: 0.15,
    frictionSound: 1.15,
  },
  {
    id: 'goat',
    nameDe: 'Ziege (羊毫)',
    nameEn: 'Goat (Yanghao)',
    zh: '羊毫',
    descDe: 'Weiches Ziegenhaar: Extrem saugfähig, tiefes Tintenreservoir, fleischig sattes Fließen',
    descEn: 'Soft goat hair: Highly absorbent, vast fluid reservoir, luscious full washes',
    stiffness: 0.25,
    reservoir: 1.45,
    flowRate: 1.30,
    dryBrushSensitivity: 0.65,
    bristleSplitting: 0.10,
    frictionSound: 0.75,
  },
  {
    id: 'mixed',
    nameDe: 'Misch (兼毫)',
    nameEn: 'Hybrid (Jianhao)',
    zh: '兼毫',
    descDe: 'Kombiniertes Mischhaar: Elastischer Wieselkern im weichen Ziegenmantel — der klassische Meisterpinsel',
    descEn: 'Hybrid mixed hair: Resilient weasel core wrapped in soft goat mantle — the balanced all-rounder',
    stiffness: 0.55,
    reservoir: 1.05,
    flowRate: 1.00,
    dryBrushSensitivity: 1.00,
    bristleSplitting: 0.20,
    frictionSound: 1.00,
  },
  {
    id: 'horse',
    nameDe: 'Borste (马毫/猪鬃)',
    nameEn: 'Bristle (Hog/Horse)',
    zh: '马毫',
    descDe: 'Kräftiges Pferde- & Borstenhaar: Rau, grobfaserig, frühe Fei-Bai-Maserung und Textur für Felsen & Rinde',
    descEn: 'Coarse hog & horse bristle: Rugged, textured, early dry-brush striations for rocks & tree bark',
    stiffness: 0.95,
    reservoir: 0.90,
    flowRate: 0.85,
    dryBrushSensitivity: 1.55,
    bristleSplitting: 0.65,
    frictionSound: 1.45,
  },
  {
    id: 'sable',
    nameDe: 'Zobel (紫毫)',
    nameEn: 'Sable (Zihao)',
    zh: '紫毫',
    descDe: 'Feines Zobel- & Hasenhaar: Seidig weich, präzise Farbglasuren, samtige Farbverläufe ohne Kratzen',
    descEn: 'Fine sable & hare hair: Silky soft, continuous velvety fluid delivery, zero scratchiness',
    stiffness: 0.45,
    reservoir: 1.15,
    flowRate: 1.10,
    dryBrushSensitivity: 0.80,
    bristleSplitting: 0.05,
    frictionSound: 0.60,
  },
];
