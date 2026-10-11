/**
 * Paper Topography & Wenzel / Cassie-Baxter Wetting Regime Transitions.
 *
 * Grounded in classic surface thermodynamics and wetting mechanics:
 * - Wenzel, R. N. (1936). "Resistance of solid surfaces to wetting by water."
 *   Industrial & Engineering Chemistry, 28(8), 988-994.
 * - Cassie, A. B. D., & Baxter, S. (1944). "Wettability of porous surfaces."
 *   Transactions of the Faraday Society, 40, 546-551.
 * - Quéré, D. (2005). "Rough surfaces: Wetting and hysteresis."
 *   Surface Science, 592(1-3), 8-18.
 * - Hubbe, M. A. et al. (2015). "Paper surface chemistry and wetting."
 *   BioResources, 10(4), 8659-8757.
 *
 * Quantifies how microscopic cellulose fiber roughness r_w and solid area fraction f_s
 * govern the apparent contact angles θ_W and θ_CB, determines thermodynamic stability
 * between homogeneous Wenzel imbibition and heterogeneous Cassie-Baxter air trapping,
 * and calculates the Laplace breakthrough pressure for stylus-induced wetting transitions.
 */

export interface PaperTopographyParams {
  /** Paper substrate name */
  name: string;
  nameDe: string;
  /** Wenzel roughness factor r_w = A_actual / A_projected (must be >= 1.0) */
  roughnessRatio: number;
  /** Solid fraction of fiber summits f_s ∈ (0, 1] */
  solidFraction: number;
  /** Mean cellulose pore radius R_pore in meters (e.g. 2e-6 = 2 μm) */
  meanPoreRadius: number;
  /** Intrinsic Young contact angle θ_Y in radians for flat cellulose with this sizing */
  intrinsicYoungAngle: number;
  descriptionDe: string;
}

export interface WettingTransitionResult {
  /** Intrinsic Young contact angle θ_Y (degrees) */
  youngAngleDeg: number;
  /** Apparent Wenzel contact angle θ_W (degrees, or 0 if complete wetting) */
  wenzelAngleDeg: number;
  /** Apparent Cassie-Baxter contact angle θ_CB (degrees) */
  cassieBaxterAngleDeg: number;
  /** Critical Young contact angle θ_c* (degrees) separating stable regimes */
  criticalYoungAngleDeg: number;
  /** Thermodynamically stable state */
  stableRegime: 'wenzel' | 'cassie_baxter' | 'complete_wetting';
  /** Laplace breakthrough pressure ΔP_Laplace (Pascals) needed to force pore invasion */
  laplaceBreakthroughPressurePa: number;
  /** Free energy difference ΔG / γ = cos θ_W - cos θ_CB */
  freeEnergyDifference: number;
}

/** Surface tension of aqueous ink at 20 °C in N/m (water ~0.0728 N/m) */
export const WATER_SURFACE_TENSION = 0.0728; // N / m

/**
 * Calculates apparent Wenzel contact angle θ_W:
 *   cos θ_W = r_w · cos θ_Y
 *
 * Note: If r_w · cos θ_Y >= 1, complete wetting occurs (θ_W = 0°).
 * If r_w · cos θ_Y <= -1, complete non-wetting occurs (θ_W = 180°).
 *
 * @param youngAngleRad Intrinsic Young contact angle in radians
 * @param roughnessRatio Wenzel roughness factor r_w >= 1.0
 * @returns Apparent Wenzel angle in radians
 */
export function calculateWenzelAngle(
  youngAngleRad: number,
  roughnessRatio: number
): number {
  const rw = Math.max(1.0, roughnessRatio);
  const cosY = Math.cos(youngAngleRad);
  const cosW = rw * cosY;

  if (cosW >= 1.0) return 0.0;
  if (cosW <= -1.0) return Math.PI;
  return Math.acos(cosW);
}

/**
 * Calculates apparent Cassie-Baxter contact angle θ_CB:
 *   cos θ_CB = f_s · cos θ_Y + f_s - 1 = f_s · (cos θ_Y + 1) - 1
 *
 * @param youngAngleRad Intrinsic Young contact angle in radians
 * @param solidFraction Solid area fraction f_s ∈ (0, 1]
 * @returns Apparent Cassie-Baxter angle in radians
 */
export function calculateCassieBaxterAngle(
  youngAngleRad: number,
  solidFraction: number
): number {
  const fs = Math.max(1e-4, Math.min(1.0, solidFraction));
  const cosY = Math.cos(youngAngleRad);
  const cosCB = fs * (cosY + 1) - 1;

  if (cosCB >= 1.0) return 0.0;
  if (cosCB <= -1.0) return Math.PI;
  return Math.acos(cosCB);
}

/**
 * Calculates critical Young contact angle θ_c* where Wenzel and Cassie-Baxter states
 * have equal free energy:
 *   cos θ_c* = (f_s - 1) / (r_w - f_s)
 *
 * For θ_Y < θ_c*, Wenzel state (filled valleys) is more stable.
 * For θ_Y > θ_c*, Cassie-Baxter state (air cushion) is more stable.
 *
 * @param roughnessRatio Wenzel roughness r_w >= 1.0
 * @param solidFraction Solid fraction f_s ∈ (0, 1]
 * @returns Critical Young angle in radians
 */
export function calculateCriticalTransitionAngle(
  roughnessRatio: number,
  solidFraction: number
): number {
  const rw = Math.max(1.0, roughnessRatio);
  const fs = Math.max(1e-4, Math.min(1.0, solidFraction));

  const denominator = rw - fs;
  if (Math.abs(denominator) <= 1e-6) {
    return Math.PI / 2;
  }

  const cosCrit = (fs - 1) / denominator;
  if (cosCrit >= 1.0) return 0.0;
  if (cosCrit <= -1.0) return Math.PI;
  return Math.acos(cosCrit);
}

/**
 * Calculates Laplace intrusion / breakthrough pressure needed to overcome capillary resistance
 * and force liquid into air-trapped pore channels:
 *   ΔP_Laplace = - (2 · γ_LV · cos θ_Y) / R_pore
 *
 * @param youngAngleRad Intrinsic Young contact angle in radians
 * @param meanPoreRadius Pore radius in meters
 * @param surfaceTension Liquid surface tension in N/m (default 0.0728 N/m)
 * @returns Laplace breakthrough pressure in Pascals (positive when pressure must be applied)
 */
export function calculateLaplaceBreakthroughPressure(
  youngAngleRad: number,
  meanPoreRadius: number,
  surfaceTension: number = WATER_SURFACE_TENSION
): number {
  const Rp = Math.max(1e-9, meanPoreRadius);
  const cosY = Math.cos(youngAngleRad);
  return (-2 * surfaceTension * cosY) / Rp;
}

/**
 * Evaluates comprehensive wetting regime behavior and transition stability for a given paper substrate:
 *
 * @param paper Paper topography parameters
 * @param customYoungAngleRad Optional overridden Young contact angle (e.g. from ink surfactant)
 * @param surfaceTension Liquid surface tension in N/m
 * @returns Complete wetting transition report
 */
export function analyzePaperWettingRegime(
  paper: PaperTopographyParams,
  customYoungAngleRad?: number,
  surfaceTension: number = WATER_SURFACE_TENSION
): WettingTransitionResult {
  const thetaY = customYoungAngleRad ?? paper.intrinsicYoungAngle;
  const rw = paper.roughnessRatio;
  const fs = paper.solidFraction;

  const thetaW = calculateWenzelAngle(thetaY, rw);
  const thetaCB = calculateCassieBaxterAngle(thetaY, fs);
  const thetaCrit = calculateCriticalTransitionAngle(rw, fs);

  const cosW = Math.cos(thetaW);
  const cosCB = Math.cos(thetaCB);
  const freeEnergyDifference = cosW - cosCB;

  const laplacePa = calculateLaplaceBreakthroughPressure(thetaY, paper.meanPoreRadius, surfaceTension);

  let stableRegime: 'wenzel' | 'cassie_baxter' | 'complete_wetting' = 'wenzel';
  if (cosW >= 0.999) {
    stableRegime = 'complete_wetting';
  } else if (thetaY < thetaCrit) {
    stableRegime = 'wenzel';
  } else {
    stableRegime = 'cassie_baxter';
  }

  const radToDeg = 180 / Math.PI;

  return {
    youngAngleDeg: thetaY * radToDeg,
    wenzelAngleDeg: thetaW * radToDeg,
    cassieBaxterAngleDeg: thetaCB * radToDeg,
    criticalYoungAngleDeg: thetaCrit * radToDeg,
    stableRegime,
    laplaceBreakthroughPressurePa: laplacePa,
    freeEnergyDifference,
  };
}

/**
 * Comprehensive Catalog of Authentic Historical & Fine Art Paper Substrates.
 */
export const PAPER_TOPOGRAPHY_CATALOG: Record<string, PaperTopographyParams> = {
  // Raw Sheng Xuan (生宣) — Unsized, open porous mulberry/wingceltis fibers
  // Strong wicking, spontaneous Wenzel wetting
  shengXuan: {
    name: 'Raw Xuan Paper (Sheng Xuan / 生宣)',
    nameDe: 'Rohes Xuan-Papier (Sheng Xuan / 生宣)',
    roughnessRatio: 1.85,
    solidFraction: 0.35,
    meanPoreRadius: 4.5e-6, // 4.5 μm large porous channels
    intrinsicYoungAngle: (32 * Math.PI) / 180, // 32° highly hydrophilic
    descriptionDe: 'Ungeleimtes chinesisches Kalligrafiepapier aus Qingtan-Rinde und Stroh. Große offene Poren; Tinte schlägt sofort in den Wenzel-Zustand um und saugt rasch ein.',
  },

  // Semi-sized Ban Shu Xuan (半熟宣) — Lightly sized with potassium alum
  // Controlled wicking and crisp stroke contours
  banShuXuan: {
    name: 'Semi-Sized Xuan Paper (Ban Shu Xuan / 半熟宣)',
    nameDe: 'Halbreifes Xuan-Papier (Ban Shu Xuan / 半熟宣)',
    roughnessRatio: 1.45,
    solidFraction: 0.55,
    meanPoreRadius: 2.2e-6, // 2.2 μm
    intrinsicYoungAngle: (55 * Math.PI) / 180, // 55° moderate wetting
    descriptionDe: 'Teilgeleimtes Xuan mit fein dosiertem Alaun. Ausgewogenes Gleichgewicht zwischen Kapillarzug und Randschärfe.',
  },

  // Fully sized Shu Xuan (熟宣) — Alum + Gelatin sizing
  // Hydrophobic surface resistance; supports delicate gongbi washes without bleed
  shuXuan: {
    name: 'Sized Xuan Paper (Shu Xuan / 熟宣)',
    nameDe: 'Reifes Xuan-Papier (Shu Xuan / 熟宣)',
    roughnessRatio: 1.20,
    solidFraction: 0.85,
    meanPoreRadius: 0.8e-6, // 0.8 μm tight pores
    intrinsicYoungAngle: (82 * Math.PI) / 180, // 82° sizing layer
    descriptionDe: 'Vollständig mit Knochenleim und Alaun versiegeltes Papier für die Gongbi-Feinmalerei. Hält flüssigen Film stabil aufrecht.',
  },

  // Japanese Torinoko Washi (鳥の子和紙)
  // Highly refined Gampi / Kozo fibers, smooth silky calendered surface
  torinokoWashi: {
    name: 'Japanese Torinoko Washi (鳥の子和紙)',
    nameDe: 'Japanisches Torinoko-Washi (鳥の子和紙)',
    roughnessRatio: 1.28,
    solidFraction: 0.72,
    meanPoreRadius: 1.4e-6,
    intrinsicYoungAngle: (60 * Math.PI) / 180,
    descriptionDe: 'Traditionelles japanisches Gampi-Maulbeerpapier. Dichte Fasern, glatte Oberflächenstruktur mit edlem Seidenglanz.',
  },

  // Arches Cold Press Aquarelle 300 g/m² (Hadern-Bütten)
  // 100% Cotton rag, gelatin sized, deep relief felt texture
  archesAquarelle: {
    name: 'Arches Cold Press Watercolor Paper (300 g/m²)',
    nameDe: 'Arches Feinkorn Aquarellpapier (300 g/m²)',
    roughnessRatio: 2.15, // High tactile relief
    solidFraction: 0.42,
    meanPoreRadius: 7.5e-6,
    intrinsicYoungAngle: (70 * Math.PI) / 180,
    descriptionDe: 'Reines Baumwoll-Hadernpapier mit Filzstruktur. Hohe Reliefrauheit (r_w = 2,15); Pigmente granulieren markant in den Papiertälern.',
  },
};
