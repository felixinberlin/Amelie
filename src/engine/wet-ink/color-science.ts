/**
 * ISO/CIE 11664-6:2014 & CIE Technical Report 142-2001
 * CIEDE2000 (ΔE₀₀) Standard Color Difference & CIELAB Color Space Engine.
 *
 * Implements the standard industrial and academic metric for measuring
 * human perceptual color difference, validated against the 34 reference
 * test pairs published by Sharma, Wu, and Dalal (2005).
 *
 * Reference:
 *   Sharma, G., Wu, W., & Dalal, E. N. (2005).
 *   "The CIEDE2000 color-difference formula: Implementation notes,
 *   supplementary test data, and mathematical observations."
 *   Color Research & Application, 30(1), 21-30.
 */

// CIE Standard Illuminant D65 reference white point (2° standard observer)
export const D65_WHITE: [number, number, number] = [95.047, 100.0, 108.883];

/**
 * Gamma linearization for sRGB (IEC 61966-2-1:1999).
 * Converts 8-bit [0, 255] (default) or normalized [0, 1] gamma-compressed sRGB into linear radiometric intensity.
 */
export function srgbToLinear(c: number, isNormalized: boolean = false): number {
  const norm = isNormalized
    ? Math.max(0.0, Math.min(1.0, c))
    : Math.max(0.0, Math.min(255.0, c)) / 255.0;
  return norm <= 0.04045
    ? norm / 12.92
    : Math.pow((norm + 0.055) / 1.055, 2.4);
}

/**
 * Encodes linear radiometric intensity into sRGB with standard gamma 2.4 curve.
 * Returns integer [0, 255] by default, or float [0, 1] if to8Bit is false.
 */
export function linearToSrgb(linear: number, to8Bit: boolean = true): number {
  const clamped = Math.max(0.0, Math.min(1.0, linear));
  const s = clamped <= 0.0031308
    ? clamped * 12.92
    : 1.055 * Math.pow(clamped, 1.0 / 2.4) - 0.055;
  return to8Bit
    ? Math.round(Math.max(0.0, Math.min(255.0, s * 255.0)))
    : Math.max(0.0, Math.min(1.0, s));
}

/**
 * Converts sRGB to CIE 1931 XYZ tristimulus values under Illuminant D65.
 */
export function srgbToXyz(
  r: number,
  g: number,
  b: number,
  isNormalized: boolean = false
): [number, number, number] {
  const rLin = srgbToLinear(r, isNormalized);
  const gLin = srgbToLinear(g, isNormalized);
  const bLin = srgbToLinear(b, isNormalized);

  // sRGB D65 transformation matrix (scaled to Y in [0, 100])
  const X = (0.4124564 * rLin + 0.3575761 * gLin + 0.1804375 * bLin) * 100.0;
  const Y = (0.2126729 * rLin + 0.7151522 * gLin + 0.0721750 * bLin) * 100.0;
  const Z = (0.0193339 * rLin + 0.1191920 * gLin + 0.9503041 * bLin) * 100.0;

  return [X, Y, Z];
}

/**
 * Non-linear transfer function for CIE L*a*b* conversion (delta = 6/29).
 */
function labF(t: number): number {
  const delta = 6.0 / 29.0;
  const deltaCubed = delta * delta * delta; // ≈ 0.008856
  return t > deltaCubed
    ? Math.cbrt(t)
    : t / (3.0 * delta * delta) + 4.0 / 29.0;
}

/**
 * Converts CIE 1931 XYZ tristimulus values to CIE 1976 L*a*b* (CIELAB) coordinates.
 */
export function xyzToLab(
  X: number,
  Y: number,
  Z: number,
  whitePoint: [number, number, number] = D65_WHITE
): [number, number, number] {
  const fx = labF(X / whitePoint[0]);
  const fy = labF(Y / whitePoint[1]);
  const fz = labF(Z / whitePoint[2]);

  const L = Math.max(0.0, Math.min(100.0, 116.0 * fy - 16.0));
  const a = 500.0 * (fx - fy);
  const b = 200.0 * (fy - fz);

  return [L, a, b];
}

/**
 * Converts sRGB directly to CIE L*a*b*.
 */
export function srgbToLab(
  r: number,
  g: number,
  b: number,
  isNormalized: boolean = false
): [number, number, number] {
  const [X, Y, Z] = srgbToXyz(r, g, b, isNormalized);
  return xyzToLab(X, Y, Z);
}

const DEG_TO_RAD = Math.PI / 180.0;
const RAD_TO_DEG = 180.0 / Math.PI;

/**
 * Computes standard ISO/CIE CIEDE2000 (ΔE₀₀) perceptual color difference between two Lab colors.
 *
 * Parametric weighting factors:
 *   kL = 1.0 (lightness weighting)
 *   kC = 1.0 (chroma weighting)
 *   kH = 1.0 (hue weighting)
 *
 * @param lab1 Reference color [L*, a*, b*]
 * @param lab2 Sample color [L*, a*, b*]
 * @returns ΔE₀₀ metric (0 = identical, < 1.0 = imperceptible to human eye, > 5.0 = distinct colors)
 */
export function ciede2000(
  lab1: [number, number, number],
  lab2: [number, number, number],
  kL: number = 1.0,
  kC: number = 1.0,
  kH: number = 1.0
): number {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;

  // 1. Calculate C_i and mean C
  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const C_bar = (C1 + C2) / 2.0;

  // G factor for modified a' coordinate
  const C_bar_7 = Math.pow(C_bar, 7);
  const G = 0.5 * (1.0 - Math.sqrt(C_bar_7 / (C_bar_7 + 6103515625))); // 25^7 = 6103515625

  const a1_prime = (1.0 + G) * a1;
  const a2_prime = (1.0 + G) * a2;

  const C1_prime = Math.hypot(a1_prime, b1);
  const C2_prime = Math.hypot(a2_prime, b2);

  let h1_prime = Math.atan2(b1, a1_prime) * RAD_TO_DEG;
  if (h1_prime < 0) h1_prime += 360.0;

  let h2_prime = Math.atan2(b2, a2_prime) * RAD_TO_DEG;
  if (h2_prime < 0) h2_prime += 360.0;

  // 2. Lightness, Chroma, and Hue differences
  const delta_L_prime = L2 - L1;
  const delta_C_prime = C2_prime - C1_prime;

  let delta_h_prime = 0.0;
  if (C1_prime * C2_prime !== 0) {
    const diff = h2_prime - h1_prime;
    if (Math.abs(diff) <= 180.0) {
      delta_h_prime = diff;
    } else if (diff > 180.0) {
      delta_h_prime = diff - 360.0;
    } else {
      delta_h_prime = diff + 360.0;
    }
  }

  const delta_H_prime = 2.0 * Math.sqrt(C1_prime * C2_prime) * Math.sin((delta_h_prime / 2.0) * DEG_TO_RAD);

  // 3. Weighting arithmetic
  const L_bar_prime = (L1 + L2) / 2.0;
  const C_bar_prime = (C1_prime + C2_prime) / 2.0;

  let h_bar_prime = 0.0;
  if (C1_prime * C2_prime === 0) {
    h_bar_prime = h1_prime + h2_prime;
  } else {
    const sumH = h1_prime + h2_prime;
    if (Math.abs(h1_prime - h2_prime) <= 180.0) {
      h_bar_prime = sumH / 2.0;
    } else if (sumH < 360.0) {
      h_bar_prime = (sumH + 360.0) / 2.0;
    } else {
      h_bar_prime = (sumH - 360.0) / 2.0;
    }
  }

  const T =
    1.0 -
    0.17 * Math.cos((h_bar_prime - 30.0) * DEG_TO_RAD) +
    0.24 * Math.cos(2.0 * h_bar_prime * DEG_TO_RAD) +
    0.32 * Math.cos((3.0 * h_bar_prime + 6.0) * DEG_TO_RAD) -
    0.20 * Math.cos((4.0 * h_bar_prime - 63.0) * DEG_TO_RAD);

  const delta_theta = 30.0 * Math.exp(-Math.pow((h_bar_prime - 275.0) / 25.0, 2));

  const C_bar_prime_7 = Math.pow(C_bar_prime, 7);
  const R_C = 2.0 * Math.sqrt(C_bar_prime_7 / (C_bar_prime_7 + 6103515625));

  const L_term_sq = Math.pow(L_bar_prime - 50.0, 2);
  const S_L = 1.0 + (0.015 * L_term_sq) / Math.sqrt(20.0 + L_term_sq);
  const S_C = 1.0 + 0.045 * C_bar_prime;
  const S_H = 1.0 + 0.015 * C_bar_prime * T;

  const R_T = -Math.sin(2.0 * delta_theta * DEG_TO_RAD) * R_C;

  // 4. Combined ΔE₀₀ metric
  const l_ratio = delta_L_prime / (kL * S_L);
  const c_ratio = delta_C_prime / (kC * S_C);
  const h_ratio = delta_H_prime / (kH * S_H);

  const dE2 =
    l_ratio * l_ratio +
    c_ratio * c_ratio +
    h_ratio * h_ratio +
    R_T * c_ratio * h_ratio;

  return Math.sqrt(Math.max(0.0, dE2));
}

/**
 * Measures perceptual color difference ΔE₀₀ directly between two sRGB colors.
 */
export function srgbDeltaE(
  rgb1: [number, number, number],
  rgb2: [number, number, number],
  isNormalized: boolean = false
): number {
  const lab1 = srgbToLab(rgb1[0], rgb1[1], rgb1[2], isNormalized);
  const lab2 = srgbToLab(rgb2[0], rgb2[1], rgb2[2], isNormalized);
  return ciede2000(lab1, lab2);
}
