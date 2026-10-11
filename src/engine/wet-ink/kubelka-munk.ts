import { KubelkaMunkCoefficients } from './types';

/**
 * Kubelka-Munk Theory for Liquid Media and Ink Wash Rendering.
 *
 * Traditional alpha blending (C = alpha * C_fg + (1 - alpha) * C_bg)
 * fails completely for pigments: mixing yellow (#FFDD00) and blue (#0044CC)
 * in RGB produces a dull, muddy gray-brown (approx #809066).
 *
 * In physical optics, pigments do not emit light—they selectively absorb (K)
 * and scatter (S) incident photons as light penetrates through paper cellulose fibers.
 *
 * Kubelka-Munk Differential Equations:
 *   dI/dx = -(K + S)I + S J
 *  -dJ/dx = -(K + S)J + S I
 *
 * For a semi-infinite layer (opaque paint / heavy ink deposit):
 *   (K / S) = (1 - R_inf)^2 / (2 * R_inf)
 *   R_inf = 1 + (K/S) - sqrt((K/S)^2 + 2(K/S))
 *
 * For a finite wash of thickness x over paper substrate with reflectance R_g:
 *   a = 1 + K / S
 *   b = sqrt(a^2 - 1)
 *   R = (1 - R_g * (a - b * coth(b * S * x))) / (a - R_g + b * coth(b * S * x))
 *
 * Multi-Pigment Mixture (Duncan 1940 extension):
 *   K_mix = sum( c_i * K_i )
 *   S_mix = sum( c_i * S_i )
 */

// Paper background reflectance (warm archival rag paper)
export const PAPER_REFLECTANCE: [number, number, number] = [0.965, 0.948, 0.910];

/**
 * Saunderson (1942) Fresnel boundary correction constants.
 * k1: Fresnel surface reflectance of unpolarized light at normal incidence (air to refractive medium n ≈ 1.5).
 * k2: Internal diffuse Fresnel reflection coefficient (Judd 1942).
 */
export const DEFAULT_SAUNDERSON_K1 = 0.04;
export const DEFAULT_SAUNDERSON_K2 = 0.60;

/**
 * Saunderson (1942) surface & internal reflection correction.
 * Converts theoretical internal Kubelka-Munk reflectance R_int into measured/observed
 * macroscopic reflectance R_obs in the presence of air-dielectric Fresnel boundaries:
 *
 *   R_obs = k1 + ((1 - k1) * (1 - k2) * R_int) / (1 - k2 * R_int)
 *
 * Reference:
 *   Saunderson, J. L. (1942). "Calculation of the Color of Pigmented Plastics."
 *   Journal of the Optical Society of America, 32(12), 727-729.
 *
 * @param R_int Internal theoretical reflectance [0, 1]
 * @param k1 External Fresnel reflection coefficient (default: 0.04)
 * @param k2 Internal diffuse reflection coefficient (default: 0.60)
 */
export function saundersonCorrection(
  R_int: number,
  k1: number = DEFAULT_SAUNDERSON_K1,
  k2: number = DEFAULT_SAUNDERSON_K2
): number {
  const clampedR = Math.max(0, Math.min(1, R_int));
  const denom = 1.0 - k2 * clampedR;
  if (Math.abs(denom) < 1e-6) return 1.0;
  const R_obs = k1 + ((1.0 - k1) * (1.0 - k2) * clampedR) / denom;
  return Math.max(0, Math.min(1, R_obs));
}

/**
 * Inverse Saunderson correction.
 * Recovers internal theoretical reflectance R_int from observed macroscopic reflectance R_obs:
 *
 *   R_int = (R_obs - k1) / (1 - k1 - k2 + k2 * R_obs)
 */
export function inverseSaunderson(
  R_obs: number,
  k1: number = DEFAULT_SAUNDERSON_K1,
  k2: number = DEFAULT_SAUNDERSON_K2
): number {
  if (R_obs <= k1) return 0.0;
  if (R_obs >= 1.0) return 1.0;
  const num = R_obs - k1;
  const den = 1.0 - k1 - k2 + k2 * R_obs;
  if (Math.abs(den) < 1e-6) return 0.0;
  const R_int = num / den;
  return Math.max(0, Math.min(1, R_int));
}

/**
 * Hyperbolic cotangent: coth(z) = (exp(2z) + 1) / (exp(2z) - 1)
 */
function coth(z: number): number {
  if (Math.abs(z) < 1e-6) return 1e6;
  const exp2z = Math.exp(Math.min(50, 2 * z));
  return (exp2z + 1) / (exp2z - 1);
}

/**
 * Calculates spectral reflectance for a single channel using finite-layer Kubelka-Munk.
 * @param K Absorption coefficient
 * @param S Scattering coefficient
 * @param x Layer thickness / pigment concentration
 * @param Rg Substrate reflectance (paper)
 * @param applySaunderson Whether to apply Saunderson Fresnel boundary correction
 * @param k1 External Fresnel reflection coefficient
 * @param k2 Internal diffuse reflection coefficient
 */
export function calculateKMReflectance(
  K: number,
  S: number,
  x: number,
  Rg: number,
  applySaunderson: boolean = false,
  k1: number = DEFAULT_SAUNDERSON_K1,
  k2: number = DEFAULT_SAUNDERSON_K2
): number {
  if (x <= 1e-5 || (K <= 1e-5 && S <= 1e-5)) {
    return Rg;
  }

  // Safe non-zero scattering
  const safeS = Math.max(0.001, S);
  const a = 1.0 + K / safeS;
  const b = Math.sqrt(Math.max(1e-6, a * a - 1.0));
  const bSx = b * safeS * x;

  if (bSx > 15.0) {
    // Approaches infinite thickness limit R_inf
    const R_inf = Math.max(0.0, Math.min(1.0, a - b));
    return applySaunderson ? saundersonCorrection(R_inf, k1, k2) : R_inf;
  }

  const cothVal = coth(bSx);
  const numerator = 1.0 - Rg * (a - b * cothVal);
  const denominator = a - Rg + b * cothVal;

  if (Math.abs(denominator) < 1e-6) return Rg;
  const R = Math.max(0.0, Math.min(1.0, numerator / denominator));
  return applySaunderson ? saundersonCorrection(R, k1, k2) : R;
}

/**
 * Fast 1D Lookup Table (LUT) for real-time Kubelka-Munk reflectance.
 * Precomputes spectral response across 512 discrete concentration steps [0, maxConcentration],
 * turning millions of exponential, square root, and hyperbolic cotangent calls
 * into a single O(1) typed array lookup.
 */
export class KubelkaMunkLUT {
  readonly tableR: Float32Array;
  readonly tableG: Float32Array;
  readonly tableB: Float32Array;
  readonly resolution: number;
  readonly maxConcentration: number;
  readonly scale: number;
  readonly saunderson: boolean;

  constructor(
    km: KubelkaMunkCoefficients,
    paperReflectance: [number, number, number] = PAPER_REFLECTANCE,
    resolution: number = 512,
    maxConcentration: number = 3.5,
    applySaunderson: boolean = false,
    k1: number = DEFAULT_SAUNDERSON_K1,
    k2: number = DEFAULT_SAUNDERSON_K2
  ) {
    this.resolution = resolution;
    this.maxConcentration = maxConcentration;
    this.scale = (resolution - 1) / maxConcentration;
    this.saunderson = applySaunderson;
    this.tableR = new Float32Array(resolution);
    this.tableG = new Float32Array(resolution);
    this.tableB = new Float32Array(resolution);

    for (let i = 0; i < resolution; i++) {
      const x = (i / (resolution - 1)) * maxConcentration;
      this.tableR[i] = calculateKMReflectance(km.K[0], km.S[0], x, paperReflectance[0], applySaunderson, k1, k2);
      this.tableG[i] = calculateKMReflectance(km.K[1], km.S[1], x, paperReflectance[1], applySaunderson, k1, k2);
      this.tableB[i] = calculateKMReflectance(km.K[2], km.S[2], x, paperReflectance[2], applySaunderson, k1, k2);
    }
  }

  lookupRGB(concentration: number, out: [number, number, number]): void {
    if (concentration <= 1e-5) {
      out[0] = this.tableR[0];
      out[1] = this.tableG[0];
      out[2] = this.tableB[0];
      return;
    }
    const idx = Math.min(this.resolution - 1, (concentration * this.scale) | 0);
    out[0] = this.tableR[idx];
    out[1] = this.tableG[idx];
    out[2] = this.tableB[idx];
  }
}

/**
 * Evaluates full RGB reflectance for a mixture of multiple pigments over paper.
 */
export function evaluatePigmentMixture(
  components: Array<{ km: KubelkaMunkCoefficients; concentration: number }>,
  thickness: number = 1.0,
  paperReflectance: [number, number, number] = PAPER_REFLECTANCE,
  applySaunderson: boolean = false
): [number, number, number] {
  // Sum mixture K and S per channel
  const K_mix: [number, number, number] = [0, 0, 0];
  const S_mix: [number, number, number] = [0, 0, 0];

  let totalConcentration = 0;
  for (const comp of components) {
    if (comp.concentration <= 0) continue;
    totalConcentration += comp.concentration;
    for (let c = 0; c < 3; c++) {
      K_mix[c] += comp.km.K[c] * comp.concentration;
      S_mix[c] += comp.km.S[c] * comp.concentration;
    }
  }

  if (totalConcentration <= 1e-5) {
    return [...paperReflectance];
  }

  return [
    calculateKMReflectance(K_mix[0], S_mix[0], thickness, paperReflectance[0], applySaunderson),
    calculateKMReflectance(K_mix[1], S_mix[1], thickness, paperReflectance[1], applySaunderson),
    calculateKMReflectance(K_mix[2], S_mix[2], thickness, paperReflectance[2], applySaunderson),
  ];
}

/**
 * Standard Naive RGB alpha blend (demonstrates the digital muddy defect).
 */
export function naiveRgbBlend(
  c1: [number, number, number],
  w1: number,
  c2: [number, number, number],
  w2: number
): [number, number, number] {
  const sumW = w1 + w2;
  if (sumW <= 1e-5) return [250, 247, 238];
  return [
    Math.round((c1[0] * w1 + c2[0] * w2) / sumW),
    Math.round((c1[1] * w1 + c2[1] * w2) / sumW),
    Math.round((c1[2] * w1 + c2[2] * w2) / sumW),
  ];
}

/**
 * Exportable GLSL snippet for use in WebGL2 fragment shaders.
 */
export const GLSL_KUBELKA_MUNK_SNIPPET = `
// ============================================================================
// Scientific Kubelka-Munk Optical Layering with Saunderson (1942) Correction
// Solves light penetration, backscattering, and Fresnel boundaries.
// ============================================================================

float coth(float z) {
  float ez = exp(clamp(2.0 * z, -30.0, 30.0));
  return (ez + 1.0) / max(0.00001, ez - 1.0);
}

float saunderson(float R_int, float k1, float k2) {
  float r = clamp(R_int, 0.0, 1.0);
  return k1 + ((1.0 - k1) * (1.0 - k2) * r) / max(0.0001, 1.0 - k2 * r);
}

float kmReflectanceChannel(float K, float S, float x, float Rg) {
  if (x < 0.0001 || (K < 0.0001 && S < 0.0001)) {
    return Rg;
  }
  float safeS = max(0.001, S);
  float a = 1.0 + K / safeS;
  float b = sqrt(max(0.00001, a * a - 1.0));
  float bSx = b * safeS * x;
  
  if (bSx > 12.0) {
    return a - b; // R_infinity asymptote
  }
  
  float c = coth(bSx);
  float num = 1.0 - Rg * (a - b * c);
  float den = a - Rg + b * c;
  return clamp(num / max(0.0001, den), 0.0, 1.0);
}

vec3 renderKubelkaMunk(vec3 K_mix, vec3 S_mix, float thickness, vec3 paperReflectance) {
  return vec3(
    kmReflectanceChannel(K_mix.r, S_mix.r, thickness, paperReflectance.r),
    kmReflectanceChannel(K_mix.g, S_mix.g, thickness, paperReflectance.g),
    kmReflectanceChannel(K_mix.b, S_mix.b, thickness, paperReflectance.b)
  );
}
`;
