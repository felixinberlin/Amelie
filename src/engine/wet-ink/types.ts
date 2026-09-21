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
