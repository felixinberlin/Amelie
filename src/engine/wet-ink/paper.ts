import { WetInkPaperConfig } from './types';

// Fast seeded pseudo-random number generator (Mulberry32)
export function createSeededRng(seed: number) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 2D Value Noise with smooth hermite interpolation
export class ValueNoise2D {
  private perm: Uint8Array;
  private values: Float32Array;

  constructor(seed: number = 42) {
    const rng = createSeededRng(seed);
    this.perm = new Uint8Array(512);
    this.values = new Float32Array(256);

    for (let i = 0; i < 256; i++) {
      this.values[i] = rng();
      this.perm[i] = i;
    }

    // Shuffle
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = this.perm[i];
      this.perm[i] = this.perm[j];
      this.perm[j] = tmp;
    }

    for (let i = 0; i < 256; i++) {
      this.perm[256 + i] = this.perm[i];
    }
  }

  get(x: number, y: number): number {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    // Hermite smoothstep
    const sx = xf * xf * (3 - 2 * xf);
    const sy = yf * yf * (3 - 2 * yf);

    const s00 = this.perm[this.perm[xi] + yi];
    const s10 = this.perm[this.perm[xi + 1] + yi];
    const s01 = this.perm[this.perm[xi] + yi + 1];
    const s11 = this.perm[this.perm[xi + 1] + yi + 1];

    const v00 = this.values[s00];
    const v10 = this.values[s10];
    const v01 = this.values[s01];
    const v11 = this.values[s11];

    const nx0 = v00 * (1 - sx) + v10 * sx;
    const nx1 = v01 * (1 - sx) + v11 * sx;

    return nx0 * (1 - sy) + nx1 * sy;
  }

  // Fractional Brownian Motion (fBm)
  fbm(x: number, y: number, octaves: number = 4, lacunarity: number = 2.0, gain: number = 0.5): number {
    let total = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxAmp = 0;

    for (let i = 0; i < octaves; i++) {
      total += this.get(x * frequency, y * frequency) * amplitude;
      maxAmp += amplitude;
      frequency *= lacunarity;
      amplitude *= gain;
    }

    return total / maxAmp;
  }
}

export interface PaperMaps {
  width: number;
  height: number;
  heightMap: Float32Array;       // 0..1 (paper tooth relief)
  fiberAngleMap: Float32Array;   // radians, local fiber orientation
  fiberStrengthMap: Float32Array;// 0..1 anisotropic conductance along fiberAngle
  capacityMap: Float32Array;     // 0..1 maximum local liquid absorption
  rakingNormalsX: Float32Array;  // horizontal relief slope for raking light
  rakingNormalsY: Float32Array;  // vertical relief slope for raking light
  // Precomputed anisotropic directional conductance tensors (eliminates 1.5 million Math.cos calls per frame)
  fiberWeightH: Float32Array;
  fiberWeightV: Float32Array;
  fiberWeightD1: Float32Array;
  fiberWeightD2: Float32Array;
}

export function generatePaperMaps(
  width: number,
  height: number,
  config: WetInkPaperConfig,
  seed: number = 42
): PaperMaps {
  const size = width * height;
  const heightMap = new Float32Array(size);
  const fiberAngleMap = new Float32Array(size);
  const fiberStrengthMap = new Float32Array(size);
  const capacityMap = new Float32Array(size);
  const rakingNormalsX = new Float32Array(size);
  const rakingNormalsY = new Float32Array(size);
  const fiberWeightH = new Float32Array(size);
  const fiberWeightV = new Float32Array(size);
  const fiberWeightD1 = new Float32Array(size);
  const fiberWeightD2 = new Float32Array(size);

  const noise1 = new ValueNoise2D(seed);
  const noise2 = new ValueNoise2D(seed + 101);
  const noiseFibers = new ValueNoise2D(seed + 333);

  const scale = 0.05; // base frequency for paper tooth

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;

      // 1. Paper Height / Grain (fBm)
      const nH1 = noise1.fbm(x * scale, y * scale, 4, 2.1, 0.45);
      const nH2 = noise2.get(x * 0.25, y * 0.25); // microscopic grit
      const rawHeight = nH1 * 0.75 + nH2 * 0.25;
      // Modulate with roughness
      heightMap[idx] = Math.max(0, Math.min(1, 0.5 + (rawHeight - 0.5) * config.roughness * 1.6));

      // 2. Fiber Angle & Anisotropy
      // Local swirl around base angle
      const fiberCurl = (noiseFibers.get(x * 0.03, y * 0.03) - 0.5) * Math.PI * 0.6;
      const angle = config.fiberBaseAngle + fiberCurl;
      fiberAngleMap[idx] = angle;

      // Fiber strength varies slightly per cluster (bundles of cellulose)
      const clusterNoise = noiseFibers.get(x * 0.08, y * 0.08);
      const strength = Math.max(0, Math.min(1, config.fiberStrength * (0.7 + clusterNoise * 0.6)));
      fiberStrengthMap[idx] = strength;

      // Directional anisotropic conductance: alignment^2 along primary axes
      const oneMinusStr = 1.0 - strength;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      fiberWeightH[idx] = oneMinusStr + strength * (cosA * cosA);
      fiberWeightV[idx] = oneMinusStr + strength * (sinA * sinA);
      const cosD1 = Math.cos(Math.PI * 0.25 - angle);
      fiberWeightD1[idx] = oneMinusStr + strength * (cosD1 * cosD1);
      const cosD2 = Math.cos(Math.PI * 0.75 - angle);
      fiberWeightD2[idx] = oneMinusStr + strength * (cosD2 * cosD2);

      // 3. Absorption Capacity (Sizing)
      // Thicker paper zones can hold slightly more moisture
      const baseCap = config.capacity;
      capacityMap[idx] = Math.max(0.1, Math.min(1.0, baseCap * (0.85 + (1 - heightMap[idx]) * 0.3)));
    }
  }

  // Calculate slopes for raking light (grazing relief shading)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const hL = heightMap[idx - 1];
      const hR = heightMap[idx + 1];
      const hU = heightMap[idx - width];
      const hD = heightMap[idx + width];

      rakingNormalsX[idx] = (hR - hL) * 0.5;
      rakingNormalsY[idx] = (hD - hU) * 0.5;
    }
  }

  return {
    width,
    height,
    heightMap,
    fiberAngleMap,
    fiberStrengthMap,
    capacityMap,
    rakingNormalsX,
    rakingNormalsY,
    fiberWeightH,
    fiberWeightV,
    fiberWeightD1,
    fiberWeightD2,
  };
}
