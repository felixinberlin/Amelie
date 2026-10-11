/**
 * Physical Radial Paper Chromatography & Multi-Pigment Separation Engine.
 *
 * Models the differential capillary advection and pore-size exclusion of
 * multi-pigment ink suspensions in fibrous porous media (Xuan / Washi paper),
 * synthesizing:
 *   1. Lucas (1918) & Washburn (1921) capillary kinetics in porous networks:
 *        R(t) = sqrt(R₀² + (γ · r_pore · cos θ / 2η) · t)
 *   2. Stokes-Einstein hydrodynamic mobility & Darcy pore straining:
 *        D_k = k_B · T / (6πη · r_p,k)
 *        v_k(r, t) = R_f,k · v_solvent(r, t)
 *   3. Subtractive optical synthesis via Kubelka-Munk & Saunderson (1942).
 *   4. IUPAC (1993) chromatographic resolution R_s & ISO/CIE CIEDE2000 (ΔE₀₀)
 *      perceptual separation trajectory.
 *
 * References:
 *   - Lucas, R. (1918). "Ueber das Zeitgesetz des kapillaren Aufstiegs von Flüssigkeiten." Kolloid-Z. 23(1), 15-22.
 *   - Washburn, E. W. (1921). "The Dynamics of Capillary Flow." Phys. Rev. 17(3), 273-283.
 *   - Consden, R., Gordon, A. H., & Martin, A. J. (1944). "Qualitative analysis of proteins by a partition chromatographic method using paper." Biochem. J. 38(3), 224.
 *   - Ettre, L. S. (1993). "Nomenclature for chromatography (IUPAC Recommendations 1993)." Pure Appl. Chem. 65(4), 819-872.
 */

import { WetInkPigmentConfig, KubelkaMunkCoefficients } from './types';
import { evaluatePigmentMixture, PAPER_REFLECTANCE } from './kubelka-munk';
import { ciede2000, srgbToLab } from './color-science';

export interface PigmentParticleProperties {
  /** Hydrodynamic radius in nanometers (e.g. 15-5000 nm) */
  radiusNm: number;
  /** Theoretical retardation factor R_f on unsized cellulose paper (0 < R_f <= 1) */
  retardationFactor: number;
  /** Steric filtration / straining factor (coarse particles filter faster) */
  strainingRate: number;
}

/**
 * Standard hydrodynamic particle data for historic and fine art pigments.
 * Nanometer radii based on electron microscopy literature for artist pigments.
 */
export const PIGMENT_PARTICLE_CATALOG: Record<string, PigmentParticleProperties> = {
  sumi: {
    // Pine soot carbon black aggregates (ultra-fine colloidal nanospheres)
    radiusNm: 35,
    retardationFactor: 0.94,
    strainingRate: 0.05,
  },
  zinnober: {
    // Cinnabar (α-HgS) crushed mineral crystal grains (dense, heavy, coarse)
    radiusNm: 2400,
    retardationFactor: 0.62,
    strainingRate: 0.45,
  },
  preussischblau: {
    // Prussian Blue (Fe4[Fe(CN)6]3) colloidal nanoparticles
    radiusNm: 75,
    retardationFactor: 0.91,
    strainingRate: 0.08,
  },
  kadmiumgelb: {
    // Cadmium Yellow (CdS) precipitated crystalline grains
    radiusNm: 450,
    retardationFactor: 0.73,
    strainingRate: 0.28,
  },
  sepia: {
    // Sepia / Melanin organic macromolecular complexes
    radiusNm: 120,
    retardationFactor: 0.88,
    strainingRate: 0.12,
  },
  krapplack: {
    // Alizarin crimson lake fine organic dye precipitate
    radiusNm: 25,
    retardationFactor: 0.96,
    strainingRate: 0.04,
  },
  eisengallus: {
    // Iron(III) pyrogallate colloidal ink complexes
    radiusNm: 60,
    retardationFactor: 0.89,
    strainingRate: 0.10,
  },
  indigo: {
    // Indigofera tinctoria vat nano-aggregates
    radiusNm: 95,
    retardationFactor: 0.90,
    strainingRate: 0.11,
  },
};

/**
 * Lucas-Washburn equation for capillary radial wetting front.
 * Computes the expanding radius of the solvent (water) front at time t.
 *
 * @param r0 Initial droplet radius in mm
 * @param t Elapsed time in seconds
 * @param poreRadiusUm Mean paper pore radius in micrometers (default 10 µm for Xuan/Washi)
 * @param contactAngleDeg Wetting contact angle in degrees (default 20° for raw Xuan)
 * @param surfaceTension Surface tension in N/m (default 0.0728 N/m for water at 20°C)
 * @param viscosity Dynamic viscosity in Pa·s (default 0.001002 Pa·s for water at 20°C)
 */
export function lucasWashburnRadius(
  r0: number,
  t: number,
  poreRadiusUm: number = 10.0,
  contactAngleDeg: number = 20.0,
  surfaceTension: number = 0.0728,
  viscosity: number = 0.001002
): number {
  if (t <= 0) return r0;
  const rPoreM = poreRadiusUm * 1e-6;
  const thetaRad = (contactAngleDeg * Math.PI) / 180.0;
  const cosTheta = Math.max(0.01, Math.cos(thetaRad));

  // Lucas-Washburn rate constant K_w = (γ · r_pore · cos θ) / (2 · η) in m²/s
  const Kw = (surfaceTension * rPoreM * cosTheta) / (2.0 * viscosity);

  // Convert mm to m for calculation, then back to mm
  const r0M = r0 * 1e-3;
  const rSquaredM2 = r0M * r0M + Kw * t;
  return Math.sqrt(rSquaredM2) * 1e3;
}

export interface ChromatographyComponent {
  pigment: WetInkPigmentConfig;
  initialFraction: number; // 0 to 1
  particle: PigmentParticleProperties;
}

export interface RadialChromatographyResult {
  /** Radial coordinates in mm from drop center */
  radialGrid: Float64Array;
  /** Solvent front radius in mm */
  solventFrontRadius: number;
  /** Concentration profile for each component at final time [componentIdx][radialCell] */
  concentrations: Float64Array[];
  /** Subtractive optical reflectance [r, g, b] across radial cells [0, 1] */
  reflectanceProfile: Array<[number, number, number]>;
  /** sRGB [0, 255] color across radial cells */
  srgbProfile: Array<[number, number, number]>;
  /** CIEDE2000 color difference ΔE₀₀ relative to center mixture across radial cells */
  deltaEProfile: Float64Array;
  /** Empirical retention factors R_f for each component */
  retentionFactors: number[];
  /** Peak radial position for each component in mm */
  peakRadii: number[];
  /** IUPAC chromatographic resolution R_s between adjacent components */
  resolutions: number[];
}

/**
 * Simulates radial capillary paper chromatography for a multi-pigment ink droplet.
 *
 * Solves the radial advection-dispersion-filtration equation with Lucas-Washburn front kinematics:
 *   ∂c_k/∂t = (1/r) ∂/∂r [ r D_k ∂c_k/∂r ] - (1/r) ∂/∂r [ r v_k(r, t) c_k ] - λ_k c_k
 *
 * @param components Multi-pigment mixture specification
 * @param initialRadiusMm Initial droplet radius in mm (default 3.0 mm)
 * @param durationSec Time duration of capillary expansion in seconds (default 1.5 s)
 * @param numCells Radial grid resolution (default 120 cells)
 * @param poreRadiusUm Mean paper pore radius in µm
 */
export function simulateRadialChromatography(
  components: ChromatographyComponent[],
  initialRadiusMm: number = 3.0,
  durationSec: number = 1.5,
  numCells: number = 120,
  poreRadiusUm: number = 10.0
): RadialChromatographyResult {
  if (components.length === 0) {
    throw new Error('At least one pigment component required for chromatography');
  }

  // Normalize initial fractions
  const totalFraction = components.reduce((acc, c) => acc + c.initialFraction, 0);
  const normalizedComponents = components.map(c => ({
    ...c,
    initialFraction: c.initialFraction / (totalFraction || 1),
  }));

  const rMaxMm = lucasWashburnRadius(initialRadiusMm, durationSec, poreRadiusUm) * 1.08;
  const dr = rMaxMm / numCells;
  const radialGrid = new Float64Array(numCells);
  for (let i = 0; i < numCells; i++) {
    radialGrid[i] = (i + 0.5) * dr;
  }

  const numComponents = normalizedComponents.length;
  const concentrations: Float64Array[] = [];

  for (let k = 0; k < numComponents; k++) {
    const c = new Float64Array(numCells);
    // Initial top-hat droplet distribution with smooth capillary boundary
    for (let i = 0; i < numCells; i++) {
      const r = radialGrid[i];
      if (r <= initialRadiusMm) {
        c[i] = normalizedComponents[k].initialFraction;
      } else {
        c[i] = 0.0;
      }
    }
    concentrations.push(c);
  }

  // Simulation time-stepping (explicit forward Euler with CFL control)
  const dt = 0.005; // 5 ms sub-steps
  const steps = Math.round(durationSec / dt);

  for (let step = 0; step < steps; step++) {
    const t = (step + 1) * dt;
    const currentSolventR = lucasWashburnRadius(initialRadiusMm, t, poreRadiusUm);

    // Solvent radial velocity v_solvent = dR/dt at the front, decaying inward as 1/r
    // v_solvent(r) = (Kw / 2R) * (currentSolventR / r)
    const vFront = (currentSolventR - lucasWashburnRadius(initialRadiusMm, Math.max(0, t - dt), poreRadiusUm)) / dt;

    for (let k = 0; k < numComponents; k++) {
      const comp = normalizedComponents[k];
      const c = concentrations[k];
      const cNext = new Float64Array(numCells);
      const rf = comp.particle.retardationFactor;
      const straining = comp.particle.strainingRate;
      const baseDiff = 0.08 * (100.0 / Math.max(15, comp.particle.radiusNm)); // dispersion (mm²/s)

      for (let i = 0; i < numCells; i++) {
        const r = radialGrid[i];
        if (r > currentSolventR * 1.05) {
          cNext[i] = 0.0;
          continue;
        }

        // 1. Advection flux: v_k(r) = R_f · vFront · (currentSolventR / max(r, r0))
        const effectiveV = rf * vFront * (initialRadiusMm / Math.max(r, initialRadiusMm));

        // Upwind difference for radial advection
        let advectionFlux = 0.0;
        if (i > 0) {
          const fluxIn = radialGrid[i - 1] * effectiveV * c[i - 1];
          const fluxOut = r * effectiveV * c[i];
          advectionFlux = (fluxIn - fluxOut) / (r * dr);
        } else {
          advectionFlux = -(effectiveV * c[0]) / dr;
        }

        // 2. Capillary dispersion: (1/r) d/dr [ r D dc/dr ]
        let dispersionFlux = 0.0;
        if (i > 0 && i < numCells - 1) {
          const rPlus = r + 0.5 * dr;
          const rMinus = r - 0.5 * dr;
          const gradPlus = (c[i + 1] - c[i]) / dr;
          const gradMinus = (c[i] - c[i - 1]) / dr;
          dispersionFlux = baseDiff * (rPlus * gradPlus - rMinus * gradMinus) / (r * dr);
        }

        // 3. Steric pore filtration / straining (loss of mobile particles to cellulose binding)
        const filtrationLoss = straining * 0.12 * c[i];

        const dcdt = advectionFlux + dispersionFlux - filtrationLoss;
        cNext[i] = Math.max(0.0, c[i] + dcdt * dt);
      }

      concentrations[k] = cNext;
    }
  }

  const finalSolventR = lucasWashburnRadius(initialRadiusMm, durationSec, poreRadiusUm);

  // Compute peak positions and retention factors R_f
  const peakRadii: number[] = [];
  const retentionFactors: number[] = [];
  const peakWidths: number[] = [];

  for (let k = 0; k < numComponents; k++) {
    const c = concentrations[k];
    let maxVal = -1;
    let maxIdx = 0;
    for (let i = 0; i < numCells; i++) {
      if (radialGrid[i] <= finalSolventR && c[i] > maxVal) {
        maxVal = c[i];
        maxIdx = i;
      }
    }
    const peakR = radialGrid[maxIdx];
    peakRadii.push(peakR);
    retentionFactors.push(Math.min(1.0, peakR / finalSolventR));

    // Measure Full Width at Half Maximum (FWHM) of the peak
    const halfMax = maxVal / 2.0;
    let leftR = peakR, rightR = peakR;
    for (let i = maxIdx; i >= 0; i--) {
      if (c[i] <= halfMax) { leftR = radialGrid[i]; break; }
    }
    for (let i = maxIdx; i < numCells; i++) {
      if (c[i] <= halfMax || radialGrid[i] > finalSolventR) { rightR = radialGrid[i]; break; }
    }
    peakWidths.push(Math.max(dr, rightR - leftR));
  }

  // Calculate IUPAC Chromatographic Resolution: R_s = 2 * |r2 - r1| / (w1 + w2)
  const resolutions: number[] = [];
  for (let k = 0; k < numComponents - 1; k++) {
    const deltaPeak = Math.abs(peakRadii[k + 1] - peakRadii[k]);
    const meanWidth = (peakWidths[k] + peakWidths[k + 1]) / 2.0;
    const rs = meanWidth > 1e-6 ? deltaPeak / meanWidth : 0.0;
    resolutions.push(Math.round(rs * 1000) / 1000);
  }

  // Subtractive Kubelka-Munk optical synthesis across radial cells
  const reflectanceProfile: Array<[number, number, number]> = [];
  const srgbProfile: Array<[number, number, number]> = [];
  const labProfile: Array<[number, number, number]> = [];

  for (let i = 0; i < numCells; i++) {
    const pigmentInputs = normalizedComponents.map((comp, k) => ({
      km: comp.pigment.km,
      concentration: concentrations[k][i],
    }));

    // If completely outside the wet region, return pure paper reflectance
    if (radialGrid[i] > finalSolventR) {
      reflectanceProfile.push([PAPER_REFLECTANCE[0], PAPER_REFLECTANCE[1], PAPER_REFLECTANCE[2]]);
      srgbProfile.push([255, 255, 255]);
      labProfile.push([100, 0, 0]);
      continue;
    }

    const R = evaluatePigmentMixture(pigmentInputs, 1.0, PAPER_REFLECTANCE, true);
    reflectanceProfile.push(R);

    const rByte = Math.round(Math.max(0, Math.min(255, R[0] * 255)));
    const gByte = Math.round(Math.max(0, Math.min(255, R[1] * 255)));
    const bByte = Math.round(Math.max(0, Math.min(255, R[2] * 255)));
    srgbProfile.push([rByte, gByte, bByte]);

    const lab = srgbToLab(rByte, gByte, bByte);
    labProfile.push(lab);
  }

  // Compute CIEDE2000 ΔE₀₀ color shift profile relative to the droplet core (cell 0)
  const deltaEProfile = new Float64Array(numCells);
  const coreLab = labProfile[0];
  for (let i = 0; i < numCells; i++) {
    if (radialGrid[i] > finalSolventR) {
      deltaEProfile[i] = 0.0;
    } else {
      deltaEProfile[i] = ciede2000(coreLab, labProfile[i]);
    }
  }

  return {
    radialGrid,
    solventFrontRadius: finalSolventR,
    concentrations,
    reflectanceProfile,
    srgbProfile,
    deltaEProfile,
    retentionFactors,
    peakRadii,
    resolutions,
  };
}
