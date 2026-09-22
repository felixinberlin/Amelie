export interface BuriedTreasureItem {
  id: string;
  nameDe: string;
  nameEn: string;
  nameEs: string;
  descDe: string;
  descEn: string;
  descEs: string;
  icon: string;
  xRatio: number; // 0..1 in canvas
  yRatio: number; // 0..1 in canvas
  depthThreshold: number; // how much digging is needed nearby
  found: boolean;
  discoveredAt?: number;
}

export type GrainType = 'lentils' | 'chickpeas' | 'coffee';

export interface GrainAcousticProfile {
  centerFrequency: number;
  qFactor: number;
  maxVolume: number;
}

export function getGrainAcousticProfile(grainType: GrainType): GrainAcousticProfile {
  switch (grainType) {
    case 'chickpeas':
      return { centerFrequency: 900, qFactor: 2.0, maxVolume: 0.22 };
    case 'coffee':
      return { centerFrequency: 1400, qFactor: 2.8, maxVolume: 0.19 };
    case 'lentils':
    default:
      return { centerFrequency: 2400, qFactor: 3.5, maxVolume: 0.16 };
  }
}

export function calculateHandDepth(grainsStirred: number): number {
  // 0 to 25 cm depth
  return Math.min(25, Math.round(grainsStirred / 35));
}

export function evaluateTreasureDiscovery(
  treasures: BuriedTreasureItem[],
  pointerX: number,
  pointerY: number,
  canvasWidth: number,
  canvasHeight: number,
  isInteracting: boolean,
  isPointerDown: boolean,
  discoveryRadius: number = 40
): {
  updatedTreasures: BuriedTreasureItem[];
  newlyDiscovered: BuriedTreasureItem | null;
} {
  if (!isInteracting || !isPointerDown || canvasWidth <= 0 || canvasHeight <= 0) {
    return { updatedTreasures: treasures, newlyDiscovered: null };
  }

  let newlyDiscovered: BuriedTreasureItem | null = null;

  const updatedTreasures = treasures.map((t) => {
    if (t.found) return t;

    const tx = t.xRatio * canvasWidth;
    const ty = t.yRatio * canvasHeight;
    const dist = Math.hypot(pointerX - tx, pointerY - ty);

    if (dist < discoveryRadius) {
      newlyDiscovered = { ...t, found: true, discoveredAt: Date.now() };
      return newlyDiscovered;
    }

    return t;
  });

  return { updatedTreasures, newlyDiscovered };
}
