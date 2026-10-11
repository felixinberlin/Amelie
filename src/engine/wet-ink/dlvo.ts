/**
 * DLVO Colloid Stability & Evaporative Flocculation Theory.
 *
 * Grounded in classic and modern colloid physics:
 * - Derjaguin, B., & Landau, L. (1941). "Theory of the stability of strongly charged lyophobic sols..."
 *   Acta Physicochimica URSS, 14, 633-662.
 * - Verwey, E. J. W., & Overbeek, J. T. G. (1948). Theory of the Stability of Lyophobic Colloids. Elsevier.
 * - Hogg, R., Healy, T. W., & Fuerstenau, D. W. (1966). "Mutual coagulation of colloidal dispersions."
 *   Trans. Faraday Soc., 62, 1638-1651.
 * - Elimelech, M. et al. (1995). Particle Deposition and Aggregation. Butterworth-Heinemann.
 *
 * Models the competitive balance between Van der Waals attraction and electrostatic
 * double-layer repulsion, computing the primary energy barrier V_max, secondary minimum V_sec,
 * and evaporation-driven ionic collapse (critical coagulation concentration / pigment granulation).
 */

// Fundamental Physical Constants (SI units)
export const BOLTZMANN_CONSTANT = 1.380649e-23; // J / K
export const ELEMENTARY_CHARGE = 1.602176634e-19; // C
export const VACUUM_PERMITTIVITY = 8.8541878128e-12; // F / m
export const AVOGADRO_CONSTANT = 6.02214076e23; // mol^-1

export interface ColloidParticleParams {
  /** Particle hydrodynamic radius a (meters, e.g. 50e-9 = 50 nm) */
  radius: number;
  /** Effective Hamaker constant A_H in aqueous medium (Joules, typically 0.5e-20 to 10e-20 J) */
  hamakerConstant: number;
  /** Zeta potential ζ (Volts, e.g. -0.040 V = -40 mV) */
  zetaPotential: number;
}

export interface ElectrolyteSolutionParams {
  /** Temperature T (Kelvin, standard 298.15 K = 25 °C) */
  temperature: number;
  /** Relative permittivity of solvent ε_r (dimensionless, ~78.4 for water at 25 °C) */
  relativePermittivity?: number;
  /** Ionic strength I in molarity (mol/L, e.g. 0.005 M = 5 mM) */
  ionicStrength: number;
  /** Electrolyte valence z (e.g. 1 for 1:1 electrolytes like NaCl/KCl) */
  valence?: number;
}

export interface DlvoEnergyProfile {
  /** Separation distance H (m) at energy barrier peak */
  hBarrier: number;
  /** Primary energy barrier height V_max in Joules */
  barrierJoules: number;
  /** Energy barrier in units of thermal energy (V_max / (k_B · T)) */
  barrierKBT: number;
  /** Secondary energy minimum depth V_sec in Joules (negative, or 0 if none) */
  secondaryMinJoules: number;
  /** Secondary energy minimum in units of thermal energy */
  secondaryMinKBT: number;
  /** Separation distance H (m) at secondary minimum */
  hSecondaryMin: number;
  /** Debye screening length λ_D = 1/κ (meters) */
  debyeLength: number;
  /** Colloid stability classification */
  stability: 'stable' | 'slow_flocculation' | 'fast_coagulation';
}

/**
 * Calculates the inverse Debye screening length κ (m⁻¹) and Debye length λ_D (m):
 *   κ = sqrt( (2 · e² · N_A · I_m3) / (ε_r · ε₀ · k_B · T) )
 * where I_m3 is ionic strength in mol/m³ (I_mol_per_L · 1000).
 *
 * @param solution Solution parameters
 * @returns { kappa: number, debyeLength: number }
 */
export function calculateDebyeProperties(
  solution: ElectrolyteSolutionParams
): { kappa: number; debyeLength: number } {
  const T = Math.max(273.15, solution.temperature);
  const epsR = solution.relativePermittivity ?? 78.4;
  const I_m3 = Math.max(1e-6, solution.ionicStrength) * 1000; // convert mol/L to mol/m³

  const numerator = 2 * Math.pow(ELEMENTARY_CHARGE, 2) * AVOGADRO_CONSTANT * I_m3;
  const denominator = epsR * VACUUM_PERMITTIVITY * BOLTZMANN_CONSTANT * T;
  const kappa = Math.sqrt(numerator / denominator);
  const debyeLength = 1 / kappa;

  return { kappa, debyeLength };
}

/**
 * Calculates Van der Waals attractive energy V_A(H) between two identical spherical particles:
 * Exact Hamaker (1937) sphere-sphere formulation:
 *   s = (2a + H) / a
 *   V_A(H) = - (A_H / 6) · [ 2/(s² - 4) + 2/s² + ln((s² - 4)/s²) ]
 *
 * @param separation Surface-to-surface separation H (meters)
 * @param particle Particle parameters
 * @returns Attractive energy in Joules (negative)
 */
export function calculateVanDerWaalsEnergy(
  separation: number,
  particle: ColloidParticleParams
): number {
  const H = Math.max(1e-11, separation); // Cutoff at 0.01 nm (Born repulsion regime)
  const a = particle.radius;
  const s = (2 * a + H) / a;
  const s2 = s * s;
  const s2Minus4 = s2 - 4;

  if (s2Minus4 <= 1e-12) {
    // Derjaguin approximation for extremely close contact
    return -(particle.hamakerConstant * a) / (12 * H);
  }

  const term1 = 2 / s2Minus4;
  const term2 = 2 / s2;
  const term3 = Math.log(s2Minus4 / s2);

  return -(particle.hamakerConstant / 6) * (term1 + term2 + term3);
}

/**
 * Calculates electrostatic double-layer repulsive potential V_R(H) using
 * the Derjaguin / Hogg-Healy-Fuerstenau (1966) approximation:
 *   V_R(H) = 2π · ε_r · ε₀ · a · ζ² · ln(1 + exp(-κ · H))
 *
 * @param separation Surface-to-surface separation H (meters)
 * @param particle Particle parameters
 * @param solution Solution parameters
 * @returns Repulsive energy in Joules (positive)
 */
export function calculateElectrostaticRepulsion(
  separation: number,
  particle: ColloidParticleParams,
  solution: ElectrolyteSolutionParams
): number {
  const H = Math.max(0, separation);
  const a = particle.radius;
  const epsR = solution.relativePermittivity ?? 78.4;
  const zeta = particle.zetaPotential;
  const { kappa } = calculateDebyeProperties(solution);

  const kappaH = kappa * H;
  // Numerical guard for large separations
  if (kappaH > 50) return 0;

  const prefactor = 2 * Math.PI * epsR * VACUUM_PERMITTIVITY * a * (zeta * zeta);
  const logTerm = Math.log(1 + Math.exp(-kappaH));

  return prefactor * logTerm;
}

/**
 * Calculates total DLVO interaction energy V_tot(H) = V_A(H) + V_R(H):
 *
 * @param separation Surface-to-surface separation H (meters)
 * @param particle Particle parameters
 * @param solution Solution parameters
 * @returns Total energy in Joules
 */
export function calculateTotalDlvoEnergy(
  separation: number,
  particle: ColloidParticleParams,
  solution: ElectrolyteSolutionParams
): number {
  const va = calculateVanDerWaalsEnergy(separation, particle);
  const vr = calculateElectrostaticRepulsion(separation, particle, solution);
  return va + vr;
}

/**
 * Scans the DLVO interaction curve across separation range H ∈ [0.1 nm, 100 nm]
 * to locate the primary energy barrier V_max and secondary minimum V_sec.
 *
 * @param particle Particle parameters
 * @param solution Solution parameters
 * @returns Comprehensive DLVO energy profile and stability verdict
 */
export function analyzeDlvoStability(
  particle: ColloidParticleParams,
  solution: ElectrolyteSolutionParams
): DlvoEnergyProfile {
  const T = Math.max(273.15, solution.temperature);
  const kBT = BOLTZMANN_CONSTANT * T;
  const { debyeLength } = calculateDebyeProperties(solution);

  // Sample H logarithmically from 0.1 nm (1e-10 m) to 100 nm (1e-7 m)
  const numSteps = 500;
  const logMin = Math.log(1e-10);
  const logMax = Math.log(1e-7);

  let barrierJoules = -Infinity;
  let hBarrier = 1e-10;

  let secondaryMinJoules = 0;
  let hSecondaryMin = 0;

  let prevEnergy = -Infinity;
  let passedBarrier = false;

  for (let step = 0; step < numSteps; step++) {
    const logH = logMin + (step / (numSteps - 1)) * (logMax - logMin);
    const H = Math.exp(logH);
    const vTot = calculateTotalDlvoEnergy(H, particle, solution);

    if (vTot > barrierJoules) {
      barrierJoules = vTot;
      hBarrier = H;
    }

    if (barrierJoules > 0 && vTot < barrierJoules) {
      passedBarrier = true;
    }

    // Look for secondary minimum beyond the barrier
    if (passedBarrier && vTot < 0 && vTot < secondaryMinJoules) {
      secondaryMinJoules = vTot;
      hSecondaryMin = H;
    }

    prevEnergy = vTot;
  }

  const clampedBarrier = Math.max(0, barrierJoules);
  const barrierKBT = clampedBarrier / kBT;
  const finalHBarrier = barrierJoules > 0 ? hBarrier : 0;
  const secondaryMinKBT = secondaryMinJoules / kBT;

  // Stability classification:
  // > 20 k_B T : Kinetically stable (metastable sol)
  // 5 - 20 k_B T : Slow flocculation
  // < 5 k_B T : Fast coagulation (immediate pigment granulation)
  let stability: 'stable' | 'slow_flocculation' | 'fast_coagulation' = 'fast_coagulation';
  if (barrierKBT >= 20) {
    stability = 'stable';
  } else if (barrierKBT >= 5) {
    stability = 'slow_flocculation';
  }

  return {
    hBarrier: finalHBarrier,
    barrierJoules: clampedBarrier,
    barrierKBT,
    secondaryMinJoules,
    secondaryMinKBT,
    hSecondaryMin,
    debyeLength,
    stability,
  };
}

/**
 * Simulates evaporation-induced colloid destabilization.
 * As water fraction declines from 1.0 down to dry, ionic strength scales as:
 *   I(t) = I_0 / waterFraction
 *
 * When ionic concentration crosses the Critical Coagulation Concentration (CCC),
 * the electrostatic barrier collapses, triggering pigment flocculation.
 *
 * @param particle Colloid particle parameters
 * @param solution Initial solution parameters
 * @param waterFraction Remaining water volume fraction (0 < waterFraction <= 1)
 * @returns DLVO energy profile and effective aggregation rate factor
 */
export function simulateEvaporativeDlvo(
  particle: ColloidParticleParams,
  solution: ElectrolyteSolutionParams,
  waterFraction: number
): {
  profile: DlvoEnergyProfile;
  currentIonicStrength: number;
  aggregationRateFactor: number;
} {
  const clampedFraction = Math.max(0.01, Math.min(1.0, waterFraction));
  const currentIonicStrength = solution.ionicStrength / clampedFraction;

  const currentSolution: ElectrolyteSolutionParams = {
    ...solution,
    ionicStrength: currentIonicStrength,
  };

  const profile = analyzeDlvoStability(particle, currentSolution);

  // Fuchs stability factor W approximation:
  // W ≈ 1 + exp(V_max / k_B T) / (2 · κ · a)
  // Aggregation rate factor is 1 / W (1.0 = diffusion-limited fast aggregation)
  let aggregationRateFactor: number;
  if (profile.barrierKBT <= 0) {
    aggregationRateFactor = 1.0; // Rapid coagulation
  } else if (profile.barrierKBT >= 30) {
    aggregationRateFactor = 0.0; // Completely halted
  } else {
    // Smooth sigmoid transition between fast coagulation and stable
    aggregationRateFactor = 1 / (1 + Math.exp(profile.barrierKBT - 10));
  }

  return {
    profile,
    currentIonicStrength,
    aggregationRateFactor,
  };
}

/**
 * Standard Colloid Particle Catalog for Artistic & Calligraphic Inks.
 */
export const COLLOID_PIGMENT_CATALOG: Record<
  string,
  {
    name: string;
    particle: ColloidParticleParams;
    defaultSolution: ElectrolyteSolutionParams;
  }
> = {
  // Ultra-fine Carbon Soot (松烟) stabilized with hydrolyzed gelatin
  // Moderate Hamaker constant, high negative zeta potential (-45 mV)
  carbonBlackGelatin: {
    name: 'Pine Soot with Gelatin (松烟墨)',
    particle: {
      radius: 40e-9,           // 40 nm colloidal radius
      hamakerConstant: 3.5e-20, // 3.5e-20 J
      zetaPotential: -0.045,   // -45 mV (electrosteric repulsion)
    },
    defaultSolution: {
      temperature: 298.15,
      ionicStrength: 0.002,     // 2 mM ionic strength
    },
  },

  // Dense Mineral Vermilion (Cinnabar / 朱砂 / HgS)
  // Large heavy crystal, high Hamaker constant, lower zeta potential (-22 mV)
  // Readily granulates upon evaporation
  vermilionMineral: {
    name: 'Mineral Vermilion Cinnabar (HgS / 朱砂)',
    particle: {
      radius: 450e-9,          // 450 nm (large mineral grain)
      hamakerConstant: 9.5e-20, // 9.5e-20 J (high mineral attraction)
      zetaPotential: -0.022,   // -22 mV (weak repulsion)
    },
    defaultSolution: {
      temperature: 298.15,
      ionicStrength: 0.005,     // 5 mM ionic strength
    },
  },

  // Lapis Lazuli / Ultramarine Blue (青金石 / Lazurite)
  // Moderate radius, pronounced granulation tendencies
  ultramarineMineral: {
    name: 'Natural Ultramarine (Lapis Lazuli / 青金石)',
    particle: {
      radius: 280e-9,          // 280 nm
      hamakerConstant: 6.0e-20,
      zetaPotential: -0.028,   // -28 mV
    },
    defaultSolution: {
      temperature: 298.15,
      ionicStrength: 0.004,
    },
  },
};
