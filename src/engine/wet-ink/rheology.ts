/**
 * Non-Newtonian Ink Rheology & Thixotropic Shear Dynamics.
 *
 * Grounded in peer-reviewed fluid rheology:
 * - Cross, M. M. (1965). "Rheology of non-Newtonian fluids: A new flow equation for pseudoplastic systems."
 *   Journal of Colloid Science, 20(5), 417-437.
 * - Carreau, P. J. (1972). "Rheological equations from molecular network theories."
 *   Transactions of The Society of Rheology, 16(1), 99-127.
 * - Herschel, W. H., & Bulkley, R. (1926). "Measurement of consistency as applied to rubber-benzene solutions."
 *   Proc. ASTM, 26, 621-633.
 * - Mewis, J., & Wagner, N. J. (2009). "Thixotropy."
 *   Advances in Colloid and Interface Science, 147-148, 214-227.
 *
 * Authentic ink formulations (carbon soot in gelatin binder, cinnabar, acrylic, iron gall)
 * exhibit non-Newtonian shear-thinning and time-dependent thixotropic recovery.
 */

export interface CrossModelParams {
  /** Zero-shear rate plateau viscosity η₀ (Pa·s) */
  eta0: number;
  /** Infinite-shear rate plateau viscosity η_∞ (Pa·s) */
  etaInf: number;
  /** Characteristic Cross relaxation time constant K (s) */
  timeConstant: number;
  /** Rate index m (dimensionless, 0 < m <= 1) */
  rateIndex: number;
}

export interface CarreauYasudaParams {
  /** Zero-shear rate plateau viscosity η₀ (Pa·s) */
  eta0: number;
  /** Infinite-shear rate plateau viscosity η_∞ (Pa·s) */
  etaInf: number;
  /** Relaxation time λ (s) */
  lambda: number;
  /** Power-law index n (n < 1 for shear-thinning) */
  powerLawIndex: number;
  /** Yasuda transition width parameter a (typically ~2) */
  transitionWidth?: number;
}

export interface HerschelBulkleyParams {
  /** Yield stress τ_y (Pa) */
  yieldStress: number;
  /** Consistency index K (Pa·s^n) */
  consistencyIndex: number;
  /** Flow behavior index n (dimensionless) */
  flowIndex: number;
}

export interface ThixotropyParams {
  /** Structural recovery time constant τ_rec (s) at rest */
  recoveryTime: number;
  /** Structural breakdown rate coefficient k_break (s) under shear */
  breakdownRate: number;
}

export interface InkRheologyProfile {
  name: string;
  nameDe: string;
  cross: CrossModelParams;
  carreau: CarreauYasudaParams;
  yieldStress: HerschelBulkleyParams;
  thixotropy: ThixotropyParams;
  descriptionDe: string;
}

/**
 * Calculates dynamic viscosity using the Cross (1965) model:
 *   η(γ̇) = η_∞ + (η₀ - η_∞) / (1 + (K · γ̇)^m)
 *
 * @param shearRate Shear rate γ̇ in s⁻¹ (must be >= 0)
 * @param params Cross model parameters
 * @returns Apparent dynamic viscosity η in Pa·s
 */
export function calculateCrossViscosity(
  shearRate: number,
  params: CrossModelParams
): number {
  const gammaDot = Math.max(0, shearRate);
  if (gammaDot === 0) {
    return params.eta0;
  }
  const denominator = 1 + Math.pow(params.timeConstant * gammaDot, params.rateIndex);
  return params.etaInf + (params.eta0 - params.etaInf) / denominator;
}

/**
 * Calculates dynamic viscosity using the Carreau-Yasuda (1972) model:
 *   η(γ̇) = η_∞ + (η₀ - η_∞) · [1 + (λ · γ̇)^a]^((n - 1) / a)
 *
 * @param shearRate Shear rate γ̇ in s⁻¹ (must be >= 0)
 * @param params Carreau-Yasuda parameters
 * @returns Apparent dynamic viscosity η in Pa·s
 */
export function calculateCarreauYasudaViscosity(
  shearRate: number,
  params: CarreauYasudaParams
): number {
  const gammaDot = Math.max(0, shearRate);
  if (gammaDot === 0) {
    return params.eta0;
  }
  const a = params.transitionWidth ?? 2;
  const inner = 1 + Math.pow(params.lambda * gammaDot, a);
  const exponent = (params.powerLawIndex - 1) / a;
  return params.etaInf + (params.eta0 - params.etaInf) * Math.pow(inner, exponent);
}

/**
 * Calculates shear stress and apparent viscosity using the Herschel-Bulkley model:
 *   τ(γ̇) = τ_y + K · (γ̇)^n
 *   η_app(γ̇) = τ / γ̇ = (τ_y / γ̇) + K · (γ̇)^(n - 1)
 *
 * @param shearRate Shear rate γ̇ in s⁻¹
 * @param params Herschel-Bulkley parameters
 * @returns Shear stress τ (Pa) and apparent viscosity η_app (Pa·s)
 */
export function calculateHerschelBulkley(
  shearRate: number,
  params: HerschelBulkleyParams
): { shearStress: number; apparentViscosity: number; isYielded: boolean } {
  const gammaDot = Math.max(0, shearRate);
  if (gammaDot <= 1e-6) {
    return {
      shearStress: params.yieldStress,
      apparentViscosity: params.yieldStress / 1e-6,
      isYielded: false,
    };
  }
  const stress = params.yieldStress + params.consistencyIndex * Math.pow(gammaDot, params.flowIndex);
  return {
    shearStress: stress,
    apparentViscosity: stress / gammaDot,
    isYielded: true,
  };
}

/**
 * Computes steady-state structural state parameter λ_ss ∈ [0, 1]
 * under continuous shear rate γ̇:
 *   dλ/dt = (1 - λ)/τ_rec - k_break · γ̇ · λ = 0
 *   => λ_ss = 1 / (1 + k_break · τ_rec · γ̇)
 *
 * @param shearRate Shear rate γ̇ in s⁻¹
 * @param params Thixotropic parameters
 * @returns Structural state parameter λ_ss between 0 (fully disrupted) and 1 (fully structured)
 */
export function calculateSteadyStateThixotropy(
  shearRate: number,
  params: ThixotropyParams
): number {
  const gammaDot = Math.max(0, shearRate);
  const denom = 1 + params.breakdownRate * params.recoveryTime * gammaDot;
  return 1 / denom;
}

/**
 * Evolves thixotropic structure parameter λ over time interval dt:
 *   λ(t + dt) = λ_ss + (λ(t) - λ_ss) · exp(- (1/τ_rec + k_break · γ̇) · dt)
 *
 * @param currentLambda Current structure parameter λ(t) ∈ [0, 1]
 * @param shearRate Current shear rate γ̇ in s⁻¹
 * @param dt Time increment in seconds
 * @param params Thixotropy parameters
 * @returns Updated structure parameter λ(t + dt) ∈ [0, 1]
 */
export function evolveThixotropy(
  currentLambda: number,
  shearRate: number,
  dt: number,
  params: ThixotropyParams
): number {
  const gammaDot = Math.max(0, shearRate);
  const lambdaSS = calculateSteadyStateThixotropy(gammaDot, params);
  const rate = (1 / params.recoveryTime) + params.breakdownRate * gammaDot;
  const decay = Math.exp(-rate * dt);
  const nextLambda = lambdaSS + (currentLambda - lambdaSS) * decay;
  return Math.min(1.0, Math.max(0.0, nextLambda));
}

/**
 * Estimates shear rate γ̇ at brush/stylus tip based on stylus velocity and ink film thickness:
 *   γ̇ ≈ v_tip / h_film
 *
 * @param tipVelocity Tip velocity in mm/s
 * @param filmThicknessMicrons Film thickness in micrometers (μm)
 * @returns Shear rate γ̇ in s⁻¹
 */
export function estimateShearRate(
  tipVelocity: number,
  filmThicknessMicrons: number
): number {
  const hMeters = Math.max(1e-6, filmThicknessMicrons * 1e-6);
  const vMetersPerSec = Math.max(0, tipVelocity * 1e-3);
  return vMetersPerSec / hMeters;
}

/**
 * Catalog of authentic ink rheology profiles based on physical and historical formulations.
 */
export const INK_RHEOLOGY_CATALOG: Record<string, InkRheologyProfile> = {
  // Traditional Chinese Pine Soot Ink (松烟墨) with ox-hide gelatin binder (牛胶)
  // High yield stress, pronounced thixotropy, strong shear-thinning
  pineSootGelatin: {
    name: 'Pine Soot & Gelatin Ink (Song-Yan Mo / 松烟墨)',
    nameDe: 'Kiefernruß & Knochenleim (Song-Yan Mo / 松烟墨)',
    cross: {
      eta0: 1.85,          // 1850 mPa·s at rest (gel structure)
      etaInf: 0.0035,      // 3.5 mPa·s at infinite shear
      timeConstant: 0.45,  // K = 0.45 s
      rateIndex: 0.82,     // Strongly shear-thinning
    },
    carreau: {
      eta0: 1.85,
      etaInf: 0.0035,
      lambda: 0.50,
      powerLawIndex: 0.22,
      transitionWidth: 2.0,
    },
    yieldStress: {
      yieldStress: 0.42,    // 0.42 Pa yield stress prevents unintended sagging
      consistencyIndex: 0.085,
      flowIndex: 0.35,
    },
    thixotropy: {
      recoveryTime: 4.8,    // 4.8 s gelation recovery
      breakdownRate: 0.015,
    },
    descriptionDe: 'Traditionelle Rußtusche mit tierischem Kollagen-Bindemittel. Hohe Ruheviskosität und Fließgrenze; wird unter dem Pinselstrich sofort flüssig und geliert im Stillstand.',
  },

  // Vermilion Cinnabar Ink (朱砂墨) with high density HgS mineral particles
  // Bingham plastic / Herschel-Bulkley with very high yield stress and rapid sedimentation
  vermilionCinnabar: {
    name: 'Vermilion Cinnabar Paste (Zhu Sha / 朱砂)',
    nameDe: 'Zinnober-Mineralpaste (Zhu Sha / 朱砂)',
    cross: {
      eta0: 4.20,          // 4200 mPa·s at rest (dense mineral suspension)
      etaInf: 0.0090,      // 9.0 mPa·s
      timeConstant: 0.95,
      rateIndex: 0.88,
    },
    carreau: {
      eta0: 4.20,
      etaInf: 0.0090,
      lambda: 1.10,
      powerLawIndex: 0.18,
      transitionWidth: 1.8,
    },
    yieldStress: {
      yieldStress: 1.65,    // 1.65 Pa yield stress
      consistencyIndex: 0.22,
      flowIndex: 0.40,
    },
    thixotropy: {
      recoveryTime: 7.5,
      breakdownRate: 0.022,
    },
    descriptionDe: 'Schwere mineralische Quecksilbersulfid-Suspension. Hohe Fließgrenze (1,65 Pa); bildet scharfe Siegelkanten ohne Ausfransen.',
  },

  // Modern Carbon Black Fountain Pen Ink (e.g. Platinum Carbon Black, Sailor Kiwaguro)
  // Submicron pigment with surfactants; near-Newtonian at moderate shear
  fountainPenCarbon: {
    name: 'Pigmented Fountain Pen Ink (Carbon Black)',
    nameDe: 'Pigmentierte Füllhaltertinte (Carbon Black)',
    cross: {
      eta0: 0.0028,        // 2.8 mPa·s
      etaInf: 0.0012,      // 1.2 mPa·s (close to water)
      timeConstant: 0.012,
      rateIndex: 0.45,
    },
    carreau: {
      eta0: 0.0028,
      etaInf: 0.0012,
      lambda: 0.015,
      powerLawIndex: 0.85,
      transitionWidth: 2.0,
    },
    yieldStress: {
      yieldStress: 0.001,  // Negligible yield stress
      consistencyIndex: 0.0025,
      flowIndex: 0.92,
    },
    thixotropy: {
      recoveryTime: 0.2,
      breakdownRate: 0.001,
    },
    descriptionDe: 'Flüssige Füllhaltertinte mit Nanosuspension und Netzmitteln. Nahezu newtonsch mit minimaler Viskositätsänderung; fließt leicht durch feine Kapillaren.',
  },

  // Historical Iron Gall Ink (Eisengallustinte)
  // Low initial viscosity, progressive oxidative cross-linking
  ironGallHistoric: {
    name: 'Historic Iron Gall Ink (18th Century Recipe)',
    nameDe: 'Historische Eisengallustinte (18. Jh.)',
    cross: {
      eta0: 0.0042,        // 4.2 mPa·s (with gum arabic / Gummi arabicum)
      etaInf: 0.0014,      // 1.4 mPa·s
      timeConstant: 0.08,
      rateIndex: 0.60,
    },
    carreau: {
      eta0: 0.0042,
      etaInf: 0.0014,
      lambda: 0.09,
      powerLawIndex: 0.72,
      transitionWidth: 2.0,
    },
    yieldStress: {
      yieldStress: 0.015,
      consistencyIndex: 0.0038,
      flowIndex: 0.78,
    },
    thixotropy: {
      recoveryTime: 1.2,
      breakdownRate: 0.005,
    },
    descriptionDe: 'Gallapfel-Tannin-Eisen-Komplex mit Gummi arabicum als Schutzkolloid. Mäßige Strukturviskosität; dringt rasch tief in Hadernpapier ein.',
  },

  // Modern Acrylic Calligraphy Ink (High-solids acrylic polymer dispersion)
  acrylicCalligraphy: {
    name: 'Acrylic Calligraphy Ink',
    nameDe: 'Acryl-Kalligrafietinte',
    cross: {
      eta0: 0.45,          // 450 mPa·s
      etaInf: 0.0045,      // 4.5 mPa·s
      timeConstant: 0.25,
      rateIndex: 0.78,
    },
    carreau: {
      eta0: 0.45,
      etaInf: 0.0045,
      lambda: 0.30,
      powerLawIndex: 0.32,
      transitionWidth: 2.0,
    },
    yieldStress: {
      yieldStress: 0.12,
      consistencyIndex: 0.035,
      flowIndex: 0.45,
    },
    thixotropy: {
      recoveryTime: 2.5,
      breakdownRate: 0.010,
    },
    descriptionDe: 'Polymergebundene Künstler-Acryltusche. Ausgeprägtes Scherverdünnen für opaken Pinselauftrag bei geringer Faserwanderung.',
  },
};
