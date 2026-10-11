/**
 * Evaporative Dynamics & Marangoni-Countered Coffee-Ring Flows.
 *
 * Grounded in peer-reviewed fluid dynamics:
 * - Deegan, R. D. et al. (1997). "Capillary flow as the cause of ring stains from dried liquid drops."
 *   Nature, 389(6653), 827-829.
 * - Deegan, R. D. et al. (2000). "Contact line deposits in an evaporating drop."
 *   Physical Review E, 62(1), 756-765.
 * - Hu, H., & Larson, R. G. (2002). "Evaporation of a sessile droplet on a substrate."
 *   J. Phys. Chem. B, 106(6), 1334-1344.
 * - Hu, H., & Larson, R. G. (2006). "Marangoni effect reverses coffee-ring depositions."
 *   J. Phys. Chem. B, 110(14), 7090-7094.
 *
 * Models the non-uniform evaporative divergence J(r) at pinned contact lines,
 * depth-averaged outward radial convection v_r(r), Marangoni counter-circulation,
 * and final edge-darkening deposition density profiles.
 */

export interface EvaporationParams {
  /** Contact angle θ_c in radians (0 < θ_c < π) */
  contactAngle: number;
  /** Droplet pinned radius R in meters (e.g. 0.005 m = 5 mm) */
  dropRadius: number;
  /** Baseline central evaporative flux J₀ in kg/(m²·s) */
  baseEvaporativeFlux: number;
  /** Fluid density ρ in kg/m³ (water ~1000 kg/m³) */
  density?: number;
  /** Dynamic fluid viscosity η in Pa·s (water ~0.001 Pa·s) */
  viscosity?: number;
  /** Microscopic contact-line slip cutoff δ in meters (default 1e-6 m = 1 μm) */
  slipCutoff?: number;
}

export interface MarangoniParams {
  /** Surface tension temperature derivative -dγ/dT in N/(m·K) (water ~0.15e-3 N/(m·K)) */
  dGammaDT: number;
  /** Temperature differential between center and contact line ΔT in Kelvin (typically 0.5 - 2 K) */
  deltaT: number;
  /** Surfactant Marangoni suppression factor ∈ [0, 1] (1.0 = completely suppresses coffee ring) */
  surfactantSuppression?: number;
}

export interface RadialEvaporationPoint {
  /** Radial coordinate r in meters */
  r: number;
  /** Normalized radius r / R ∈ [0, 1] */
  normalizedRadius: number;
  /** Local evaporative flux J(r) in kg/(m²·s) */
  evaporativeFlux: number;
  /** Droplet height h(r) in meters */
  height: number;
  /** Depth-averaged outward radial velocity v_r(r) in m/s */
  radialVelocity: number;
  /** Net deposited pigment mass density profile (arbitrary units normalized to center) */
  depositDensity: number;
}

export interface DropletEvaporationSummary {
  /** Deegan singularity exponent λ(θ_c) */
  singularityExponent: number;
  /** Total integrated mass loss rate dM/dt in kg/s */
  totalMassLossRate: number;
  /** Estimated droplet drying time in seconds */
  dryingTimeSeconds: number;
  /** Outward Peclet number at r = 0.9 R */
  pecletNumber: number;
  /** Marangoni number Ma */
  marangoniNumber: number;
  /** Edge-to-center deposit concentration ratio (coffee-ring intensity) */
  coffeeRingRatio: number;
  /** Radial profiles across 100 sample points */
  profile: RadialEvaporationPoint[];
}

/**
 * Calculates Deegan et al. (1997) divergence exponent λ(θ_c):
 *   λ(θ_c) = (π - 2·θ_c) / (2π - 2·θ_c)
 *
 * Properties:
 * - As θ_c → 0 (complete wetting): λ → 0.5 (square-root edge divergence)
 * - At θ_c = π/2 (90°): λ = 0 (perfectly uniform evaporative flux)
 * - At θ_c > π/2 (hydrophobic): λ < 0 (apex evaporates faster than rim)
 *
 * @param contactAngle θ_c in radians
 * @returns Singularity exponent λ
 */
export function calculateSingularityExponent(contactAngle: number): number {
  const theta = Math.max(1e-4, Math.min(Math.PI - 1e-4, contactAngle));
  return (Math.PI - 2 * theta) / (2 * Math.PI - 2 * theta);
}

/**
 * Calculates local evaporative flux J(r) at radial position r:
 *   J(r) = J₀ · (1 - (r / R)²)^(-λ)
 *
 * Uses microscopic slip cutoff δ near r = R to prevent physical singularity.
 *
 * @param r Radial distance from droplet center (meters)
 * @param params Evaporation parameters
 * @returns Local flux in kg/(m²·s)
 */
export function calculateEvaporativeFlux(
  r: number,
  params: EvaporationParams
): number {
  const R = params.dropRadius;
  const delta = params.slipCutoff ?? 1e-6;
  const lambda = calculateSingularityExponent(params.contactAngle);

  // Clamp r to inside the droplet radius with slip cutoff
  const clampedR = Math.max(0, Math.min(R - delta, r));
  const rNorm = clampedR / R;
  const inner = Math.max(1e-6, 1 - rNorm * rNorm);

  return params.baseEvaporativeFlux * Math.pow(inner, -lambda);
}

/**
 * Calculates local droplet height h(r) for spherical cap geometry:
 *   h(r) = h₀ · (1 - (r / R)²)
 * where h₀ ≈ R · tan(θ_c / 2) ≈ R · θ_c / 2 for small θ_c.
 *
 * @param r Radial distance from droplet center (meters)
 * @param params Evaporation parameters
 * @returns Height in meters
 */
export function calculateDropletHeight(
  r: number,
  params: EvaporationParams
): number {
  const R = params.dropRadius;
  const theta = params.contactAngle;
  const h0 = R * Math.tan(theta / 2);
  const rNorm = Math.max(0, Math.min(1.0, r / R));
  return Math.max(1e-8, h0 * (1 - rNorm * rNorm));
}

/**
 * Calculates depth-averaged outward radial velocity v_r(r) (Hu & Larson 2002):
 * From continuity in an evaporating thin droplet:
 *   v_r(r) = (1 / (ρ · r · h(r))) · ∫₀ʳ r' · [J(r') - (J_avg · h(r') / V_vol)] dr'
 * For a pinned contact line, outward flow replenishes liquid evaporated at the rim.
 *
 * @param r Radial distance (meters)
 * @param params Evaporation parameters
 * @param marangoni Optional Marangoni counter-flow parameters
 * @returns Radial outward velocity in m/s (positive = outward toward rim)
 */
export function calculateRadialVelocity(
  r: number,
  params: EvaporationParams,
  marangoni?: MarangoniParams
): number {
  if (r <= 1e-7) return 0;

  const R = params.dropRadius;
  const rho = params.density ?? 1000;
  const h = calculateDropletHeight(r, params);

  // Numerical integration of mass deficit from 0 to r
  const numSteps = 50;
  const dr = r / numSteps;
  let integral = 0;

  for (let i = 0; i < numSteps; i++) {
    const rPrime = (i + 0.5) * dr;
    const jPrime = calculateEvaporativeFlux(rPrime, params);
    // Depth-averaged volume sink term
    integral += rPrime * jPrime * dr;
  }

  // Pure outward continuity flow
  let vOutward = integral / (rho * r * h);

  // Marangoni counter-flow damping:
  // Inward Marangoni surface velocity reduces net outward transport
  if (marangoni && marangoni.dGammaDT > 0) {
    const eta = params.viscosity ?? 1e-3;
    const vMarangoni = (marangoni.dGammaDT * marangoni.deltaT) / (4 * eta);
    const suppression = marangoni.surfactantSuppression ?? 0.0;
    // Net inward thermal shear slows coffee ring flow
    vOutward = Math.max(0, vOutward - (1 - suppression) * vMarangoni * 0.02 * (r / R));
  }

  return vOutward;
}

/**
 * Computes complete radial evaporation profile and coffee-ring deposition metrics:
 *
 * @param params Evaporation parameters
 * @param marangoni Optional Marangoni parameters
 * @returns Droplet evaporation summary with 100-point radial profile
 */
export function analyzeDropletEvaporation(
  params: EvaporationParams,
  marangoni?: MarangoniParams
): DropletEvaporationSummary {
  const R = params.dropRadius;
  const rho = params.density ?? 1000;
  const eta = params.viscosity ?? 1e-3;
  const lambda = calculateSingularityExponent(params.contactAngle);

  // Total droplet volume V = (π · h₀ · R²) / 2 for spherical cap
  const h0 = R * Math.tan(params.contactAngle / 2);
  const totalVolume = (Math.PI * h0 * R * R) / 2;
  const totalMass = totalVolume * rho;

  // Integrated mass loss rate dM/dt = ∫₀ᴿ 2π · r · J(r) dr
  const numSamplePoints = 100;
  let totalMassLossRate = 0;
  const profile: RadialEvaporationPoint[] = [];

  for (let i = 0; i < numSamplePoints; i++) {
    const rNorm = i / (numSamplePoints - 1);
    const r = rNorm * R;
    const j = calculateEvaporativeFlux(r, params);
    const h = calculateDropletHeight(r, params);
    const vr = calculateRadialVelocity(r, params, marangoni);

    // Deegan 2000 deposit density scaling: deposit thickness ~ (1 - (r/R)^2)^(-μ)
    // where μ = (π - 2θ_c) / (π - θ_c)
    const theta = params.contactAngle;
    const mu = (Math.PI - 2 * theta) / (Math.PI - theta);
    const delta = params.slipCutoff ?? 1e-6;
    const clampedRNorm = Math.min(1 - delta / R, rNorm);
    const depositDensity = Math.pow(Math.max(1e-4, 1 - clampedRNorm * clampedRNorm), -mu);

    profile.push({
      r,
      normalizedRadius: rNorm,
      evaporativeFlux: j,
      height: h,
      radialVelocity: vr,
      depositDensity,
    });

    if (i > 0) {
      const prevR = ((i - 1) / (numSamplePoints - 1)) * R;
      const midR = 0.5 * (r + prevR);
      const midJ = calculateEvaporativeFlux(midR, params);
      totalMassLossRate += 2 * Math.PI * midR * midJ * (r - prevR);
    }
  }

  const dryingTimeSeconds = totalMass / Math.max(1e-12, totalMassLossRate);

  // Peclet number Pe = v_r(0.9 R) · R / D_diff (using D_diff ~ 1e-11 m²/s for colloidal pigment)
  const vAtRim = profile[Math.floor(numSamplePoints * 0.9)].radialVelocity;
  const dDiff = 1e-11;
  const pecletNumber = (vAtRim * R) / dDiff;

  // Marangoni number Ma = (-dγ/dT · ΔT · R) / (η · α_th) (α_th ~ 1.4e-7 m²/s thermal diffusivity)
  const dGammaDT = marangoni?.dGammaDT ?? 0.15e-3;
  const deltaT = marangoni?.deltaT ?? 1.0;
  const alphaTh = 1.4e-7;
  const marangoniNumber = (dGammaDT * deltaT * R) / (eta * alphaTh);

  // Coffee-ring ratio: edge deposit density at r = 0.95 R relative to center (r = 0)
  const centerDeposit = profile[0].depositDensity;
  const edgeDeposit = profile[Math.floor(numSamplePoints * 0.95)].depositDensity;
  const coffeeRingRatio = edgeDeposit / Math.max(1e-6, centerDeposit);

  return {
    singularityExponent: lambda,
    totalMassLossRate,
    dryingTimeSeconds,
    pecletNumber,
    marangoniNumber,
    coffeeRingRatio,
    profile,
  };
}
