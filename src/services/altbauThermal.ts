// Steady-state room heat balance for the Altbau Thermal sketch (05-dosen/altbau-thermal.md,
// "Erster Schritt": one room, one exterior wall with a window, stationary).
//
// Deliberately simple enough to check by hand. Every result is a band, because the inputs
// (construction, usage) are uncertain. The band widths below are assumptions of this sketch,
// not standard values.

export const CEILING_H = 3.4;   // m, Berlin Altbau
export const WINDOW_H = 1.9;    // m, fixed
export const CP_AIR = 0.34;     // Wh/(m3 K), rho * c_p / 3600
export const RSI_WALL = 0.13;   // m2K/W, DIN 4108-2 standard interior wall
export const RSI_CORNER = 0.25; // m2K/W, DIN 4108-2 value for corners / behind furniture
export const RSI_BLOCKED = 0.45; // m2K/W, stagnant air behind tight wardrobe (0 cm distance)
export const BERLIN_HGT = 3200; // Kd, Heating degree days (Heizgradtage) for Berlin
export const ENERGY_PRICE_KWH = 0.12; // €/kWh, typical Berlin gas / district heating baseline

export const BAND = {
  u: [0.8, 1.25] as const,      // U-values: construction unknown
  n: [0.6, 1.6] as const,       // air change: usage unknown
  rsi: [0.25, 0.35] as const,   // corner surface resistance; 0.35 = assumed "blocked by furniture"
};

export interface AltbauInput {
  roomWidth: number;   // m, length of the exterior wall
  roomArea: number;    // m2 floor area (depth = area / width)
  windowWidth: number; // m
  wallU: number;       // W/m2K
  windowU: number;     // W/m2K
  airChange: number;   // 1/h
  roomTemp: number;    // C
  outsideTemp: number; // C
  relHumidity: number; // %, room air
  hasCornerFurniture?: boolean; // tight wardrobe in corner (0 cm distance)
  hasSecondExteriorWall?: boolean; // corner room (2 exterior walls)
}

export type MoldVerdict = 'above' | 'overlap' | 'below';

export interface AltbauResult {
  wallArea: number;
  windowArea: number;
  volume: number;
  deltaT: number;
  hWall: number;   // W/K, mid assumption
  hWindow: number; // W/K
  hVent: number;   // W/K
  heatMid: number; // W, mid assumption (for the hand calculation, never shown as "the" result)
  heatLow: number; // W
  heatHigh: number;
  cornerMid: number; // C
  cornerLow: number; // C, worst case
  cornerHigh: number;
  corner2DGeometricMid: number; // C, 2D ISO 10211 geometric corner effect
  fRsiMid: number; // temperature factor fRsi (DIN 4108-2 requires >= 0.70)
  fRsiLow: number;
  fRsiHigh: number;
  dewPoint: number;       // C, condensation on the surface
  moldThreshold: number;  // C, surface at 80 % relative humidity
  verdict: MoldVerdict;
  dewInBand: boolean;
  annualKwhMid: number;   // kWh/a
  annualKwhLow: number;
  annualKwhHigh: number;
  annualCostMid: number;  // €/a
  // Deep physics additions:
  surfaceRhCorner: number; // % relative humidity directly on the corner surface
  surfaceRhWall: number;   // % relative humidity on plane wall
  moldGerminationDays: number; // estimated days to mold germination per Sedlbauer LIM
  condensateRateCorner: number; // g/(m2 h) condensation rate when surface < dew point
  stratification: {
    floorTemp: number;     // C at z = 0.1 m
    sittingTemp: number;   // C at z = 1.1 m
    headTemp: number;      // C at z = 1.7 m
    ceilingTemp: number;   // C at z = 3.4 m
    draftRiskPercent: number; // % predicted dissatisfied (PPD) per ISO 7730
  };
  finiteDifference2D: FiniteDifferenceCornerResult;
}

export interface FiniteDifferenceCornerResult {
  gridSize: number;
  dx: number; // m
  grid: number[][]; // [y][x] temperatures in C
  minCornerTemp: number; // C
  asymptotic1DTemp: number; // C
  fRsi2D: number;
  psiValue: number; // W/(m K) linear thermal transmittance
  isotherms: {
    temp: number;
    label: string;
    points: [number, number][]; // normalized [0..1, 0..1]
  }[];
}

/** Saturation vapor pressure in Pa (Magnus formula per DIN 4108-3) */
export function saturationVaporPressure(tempC: number): number {
  return 611.2 * Math.exp((17.62 * tempC) / (243.12 + tempC));
}

/** Dew point (Magnus formula), rh in 0..1. */
export function dewPoint(tempC: number, rh: number): number {
  const safeRh = Math.max(0.01, Math.min(0.999, rh));
  const a = 17.62, b = 243.12;
  const g = Math.log(safeRh) + (a * tempC) / (b + tempC);
  return (b * g) / (a - g);
}

/** Surface relative humidity given indoor climate and surface temperature */
export function surfaceRelativeHumidity(roomTemp: number, roomRh: number, surfaceTemp: number): number {
  const pv = (roomRh / 100) * saturationVaporPressure(roomTemp);
  const psatSurface = saturationVaporPressure(surfaceTemp);
  return Math.min(100, Math.max(0, (pv / psatSurface) * 100));
}

/** Temperature factor fRsi = (theta_si - theta_e) / (theta_i - theta_e) per DIN 4108-2 */
export function calculateFRsi(thetaSi: number, thetaI: number, thetaE: number): number {
  const delta = thetaI - thetaE;
  if (Math.abs(delta) < 0.001) return 1.0;
  return Math.max(0, Math.min(1.0, (thetaSi - thetaE) / delta));
}

/**
 * 2D Finite Difference Heat Solver for DIN EN ISO 10211 L-Corner Geometry
 * Solves: d2T/dx2 + d2T/dy2 = 0 with convective boundary conditions on 2 exterior and 2 interior faces.
 */
export function solve2DCornerThermalField(
  wallU: number,
  roomTemp: number,
  outsideTemp: number,
  rsi: number, // m2K/W inner surface resistance
  rse: number = 0.04 // m2K/W outer surface resistance
): FiniteDifferenceCornerResult {
  const N = 24; // 24x24 nodes
  const L = 1.0; // 1 meter domain
  const dx = L / (N - 1);
  const wallThickness = 0.38; // 38 cm solid brick Altbau wall
  const kd = Math.round(wallThickness / dx); // index of inner corner (~9)

  // Derived effective thermal conductivity k_eff from U-value:
  // 1/U = rsi + d/k + rse => d/k = 1/U - rsi - rse => k = d / (1/U - rsi - rse)
  const rWall = Math.max(0.08, 1 / wallU - 0.13 - rse);
  const kEff = Math.max(0.1, wallThickness / rWall);

  const hi = 1 / rsi;
  const he = 1 / rse;
  const biI = (hi * dx) / kEff;
  const biE = (he * dx) / kEff;

  // Initialize grid with linear interpolation between outsideTemp and roomTemp
  const grid: number[][] = Array.from({ length: N }, (_, y) =>
    Array.from({ length: N }, (_, x) => {
      if (x > kd && y > kd) return roomTemp; // inside room air
      const distFromOuter = Math.min(x, y) / kd;
      return outsideTemp + (roomTemp - outsideTemp) * Math.max(0, Math.min(1, distFromOuter));
    })
  );

  // Successive Over-Relaxation (SOR) Gauss-Seidel iterations
  const omega = 1.35;
  const maxIterations = 140;

  for (let it = 0; it < maxIterations; it++) {
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        // Skip nodes inside the room air
        if (x > kd && y > kd) {
          grid[y][x] = roomTemp;
          continue;
        }

        let tNew = grid[y][x];

        // 1. Exterior boundaries
        if (x === 0 && y === 0) {
          // Sharp outer corner
          tNew = (grid[0][1] + grid[1][0] + 2 * biE * outsideTemp) / (2 + 2 * biE);
        } else if (x === 0 && y < N - 1) {
          // Left exterior wall face
          tNew = (2 * grid[y][1] + grid[y + 1][0] + grid[y - 1][0] + 2 * biE * outsideTemp) / (4 + 2 * biE);
        } else if (y === 0 && x < N - 1) {
          // Bottom exterior wall face
          tNew = (2 * grid[1][x] + grid[0][x + 1] + grid[0][x - 1] + 2 * biE * outsideTemp) / (4 + 2 * biE);
        }
        // 2. Interior boundaries
        else if (x === kd && y === kd) {
          // Re-entrant interior corner node (faces room on top-right quadrant)
          tNew =
            (2 * grid[y][x - 1] + 2 * grid[y - 1][x] + grid[y + 1][x] + grid[y][x + 1] + 2 * biI * roomTemp) /
            (6 + 2 * biI);
        } else if (x === kd && y > kd && y < N - 1) {
          // Vertical interior face
          tNew = (2 * grid[y][x - 1] + grid[y + 1][x] + grid[y - 1][x] + 2 * biI * roomTemp) / (4 + 2 * biI);
        } else if (y === kd && x > kd && x < N - 1) {
          // Horizontal interior face
          tNew = (2 * grid[y - 1][x] + grid[y][x + 1] + grid[y][x - 1] + 2 * biI * roomTemp) / (4 + 2 * biI);
        }
        // 3. Adiabatic far boundaries (symmetry cut-off per DIN EN ISO 10211)
        else if (y === N - 1 && x <= kd) {
          tNew = grid[N - 2][x];
        } else if (x === N - 1 && y <= kd) {
          tNew = grid[y][N - 2];
        }
        // 4. Interior material nodes (Laplace equation d2T/dx2 + d2T/dy2 = 0)
        else if (x > 0 && y > 0) {
          tNew = (grid[y][x + 1] + grid[y][x - 1] + grid[y + 1][x] + grid[y - 1][x]) / 4;
        }

        // Apply relaxation
        grid[y][x] = grid[y][x] + omega * (tNew - grid[y][x]);
      }
    }
  }

  const minCornerTemp = grid[kd][kd];
  const asymptotic1DTemp = grid[kd][N - 2];
  const fRsi2D = calculateFRsi(minCornerTemp, roomTemp, outsideTemp);

  // Linear thermal transmittance psi [W/(m K)]
  // psi = L_2D - (U1*l1 + U2*l2)
  const lInt = L - wallThickness;
  const phi1D = 2 * wallU * lInt * (roomTemp - outsideTemp);
  let phi2DActual = 0;
  for (let y = kd; y < N - 1; y++) {
    phi2DActual += hi * (roomTemp - grid[y][kd]) * dx;
  }
  for (let x = kd; x < N - 1; x++) {
    phi2DActual += hi * (roomTemp - grid[kd][x]) * dx;
  }
  const deltaT = roomTemp - outsideTemp;
  const psiValue = deltaT > 0.01 ? (phi2DActual - phi1D) / deltaT : 0.08;

  // Extract Isotherm Paths across the grid for visualization
  const targetIsotherms = [
    { temp: 0, label: '0 °C' },
    { temp: 5, label: '+5 °C' },
    { temp: 10, label: '+10 °C' },
    { temp: 12.6, label: '+12.6 °C (Schimmelschwelle)' },
    { temp: 15, label: '+15 °C' },
  ];

  const isotherms = targetIsotherms.map((iso) => {
    const points: [number, number][] = [];
    const tTarget = iso.temp;
    // Trace contour points along grid columns
    for (let x = 0; x < N; x++) {
      for (let y = 0; y < N - 1; y++) {
        if (x > kd && y >= kd) continue;
        const t1 = grid[y][x];
        const t2 = grid[y + 1][x];
        if ((t1 <= tTarget && t2 >= tTarget) || (t1 >= tTarget && t2 <= tTarget)) {
          const frac = Math.abs(t2 - t1) > 0.001 ? (tTarget - t1) / (t2 - t1) : 0.5;
          const py = (y + frac) / (N - 1);
          const px = x / (N - 1);
          points.push([px, py]);
        }
      }
    }
    return { temp: iso.temp, label: iso.label, points };
  });

  return {
    gridSize: N,
    dx,
    grid,
    minCornerTemp,
    asymptotic1DTemp,
    fRsi2D,
    psiValue,
    isotherms,
  };
}

/** Vertical air temperature stratification in Berlin Altbau with 3.4m ceiling height */
export function calculateRoomStratification(
  roomTemp: number,
  outsideTemp: number,
  windowTilted: boolean
) {
  const deltaT = roomTemp - outsideTemp;
  // Natural buoyancy gradient: warm air accumulates under 3.4m ceiling
  const baseStratificationKPerM = 0.75; // K per vertical meter
  const ceilingBoost = baseStratificationKPerM * 1.8; // +1.35 K at 3.4 m
  const floorCooling = baseStratificationKPerM * 1.6; // -1.2 K at floor

  // When window is tilted (Dauerkipp), cold outdoor air drops down as cold air lake (Kaltluftsee)
  const tiltColdDrop = windowTilted ? Math.min(6.0, 1.8 + deltaT * 0.16) : 0;

  const floorTemp = roomTemp - floorCooling - tiltColdDrop;
  const sittingTemp = roomTemp - 0.4 - (windowTilted ? tiltColdDrop * 0.4 : 0);
  const headTemp = roomTemp;
  const ceilingTemp = roomTemp + ceilingBoost + (windowTilted ? -0.5 : 0);

  // Predicted Percentage of Dissatisfied (PPD) draft rating per DIN EN ISO 7730
  // Draft risk is high when vertical head-to-ankle gradient > 3 K or local floor velocity is high
  const vertGradient = headTemp - floorTemp;
  const draftRiskPercent = Math.min(
    100,
    Math.max(5, Math.round(100 / (1 + Math.exp(-(vertGradient - 2.5) * 0.9))))
  );

  return {
    floorTemp,
    sittingTemp,
    headTemp,
    ceilingTemp,
    draftRiskPercent,
  };
}

/** Sedlbauer Isopleth Model: germination days as function of surface RH and temperature */
export function calculateSedlbauerGermination(surfaceTemp: number, surfaceRh: number): number {
  if (surfaceRh < 75 || surfaceTemp < 0) return 999; // no mold growth
  if (surfaceRh >= 90) return Math.max(2, Math.round(14 - (surfaceTemp - 10) * 0.5));
  if (surfaceRh >= 80) return Math.max(6, Math.round(30 - (surfaceRh - 80) * 2));
  return 45; // 75 - 80% takes > 30-60 days
}


/** Effective window width: never wider than the wall minus 0.4 m of reveal. */
export function effectiveWindowWidth(roomWidth: number, windowWidth: number): number {
  return Math.max(0.3, Math.min(windowWidth, roomWidth - 0.4));
}

function heat(i: AltbauInput, wallArea: number, windowArea: number, volume: number, uk: number, nk: number) {
  const dT = i.roomTemp - i.outsideTemp;
  const hWall = i.wallU * uk * wallArea;
  const hWindow = i.windowU * uk * windowArea;
  const hVent = CP_AIR * i.airChange * nk * volume;
  return { hWall, hWindow, hVent, q: (hWall + hWindow + hVent) * dT };
}

function cornerTemp(i: AltbauInput, uk: number, rsi: number): number {
  return i.roomTemp - i.wallU * uk * rsi * (i.roomTemp - i.outsideTemp);
}

export function computeAltbau(i: AltbauInput): AltbauResult {
  const windowArea = effectiveWindowWidth(i.roomWidth, i.windowWidth) * WINDOW_H;
  const wallArea = Math.max(0, i.roomWidth * CEILING_H - windowArea);
  const volume = i.roomArea * CEILING_H;
  const mid = heat(i, wallArea, windowArea, volume, 1, 1);
  const low = heat(i, wallArea, windowArea, volume, BAND.u[0], BAND.n[0]);
  const high = heat(i, wallArea, windowArea, volume, BAND.u[1], BAND.n[1]);

  // If furniture is placed tightly against the corner, Rsi increases significantly (hindered convection)
  const rsiMid = i.hasCornerFurniture ? RSI_BLOCKED : RSI_CORNER;
  const rsiWorst = i.hasCornerFurniture ? 0.52 : BAND.rsi[1];
  const rsiBest = i.hasCornerFurniture ? 0.38 : BAND.rsi[0];

  const cornerHigh = cornerTemp(i, BAND.u[0], rsiBest); // best case
  const cornerLow = cornerTemp(i, BAND.u[1], rsiWorst);  // worst case
  const cornerMid = cornerTemp(i, 1, rsiMid);

  // Geometric 2D corner effect per DIN EN ISO 10211:
  // In a real 2D external corner, heat flows into 2 external surfaces.
  // The geometric temperature drop reduces theta_si by an additional ~1.5 - 2.5 K for uninsulated brick
  const geometricCorrection = (i.hasSecondExteriorWall ? 1.8 : 1.1) * (i.wallU / 1.7);
  const corner2DGeometricMid = Math.max(i.outsideTemp + 0.5, cornerMid - geometricCorrection);

  const rh = Math.min(0.99, Math.max(0.05, i.relHumidity / 100));
  const dew = dewPoint(i.roomTemp, rh);
  const mold = dewPoint(i.roomTemp, Math.min(0.99, rh / 0.8));

  // fRsi values
  const fRsiMid = calculateFRsi(corner2DGeometricMid, i.roomTemp, i.outsideTemp);
  const fRsiLow = calculateFRsi(cornerLow - geometricCorrection, i.roomTemp, i.outsideTemp);
  const fRsiHigh = calculateFRsi(cornerHigh, i.roomTemp, i.outsideTemp);

  const effectiveCornerLow = cornerLow - geometricCorrection;
  const verdict: MoldVerdict = effectiveCornerLow > mold ? 'above' : cornerHigh < mold ? 'below' : 'overlap';

  // Annual space heating demand estimate (Berlin heating degree days)
  const annualHours = 24 * BERLIN_HGT;
  const annualKwhMid = (mid.hWall + mid.hWindow + mid.hVent) * annualHours / 1000;
  const annualKwhLow = (low.hWall + low.hWindow + low.hVent) * annualHours / 1000;
  const annualKwhHigh = (high.hWall + high.hWindow + high.hVent) * annualHours / 1000;

  // Run 2D numerical finite difference solver (DIN EN ISO 10211)
  const finiteDiff = solve2DCornerThermalField(i.wallU, i.roomTemp, i.outsideTemp, rsiMid);

  // Surface relative humidities
  const surfaceRhCorner = surfaceRelativeHumidity(i.roomTemp, i.relHumidity, corner2DGeometricMid);
  const wall1DTemp = i.roomTemp - i.wallU * RSI_WALL * (i.roomTemp - i.outsideTemp);
  const surfaceRhWall = surfaceRelativeHumidity(i.roomTemp, i.relHumidity, wall1DTemp);

  // Sedlbauer mold germination estimate
  const moldGerminationDays = calculateSedlbauerGermination(corner2DGeometricMid, surfaceRhCorner);

  // Condensate rate (g/m2h) when surface is below dew point
  const pv = (i.relHumidity / 100) * saturationVaporPressure(i.roomTemp);
  const psatCorner = saturationVaporPressure(corner2DGeometricMid);
  const condensateRateCorner =
    corner2DGeometricMid < dew ? Math.max(0, 7.0e-4 * (pv - psatCorner) * 3600) : 0;

  // Vertical air temperature stratification
  const stratification = calculateRoomStratification(
    i.roomTemp,
    i.outsideTemp,
    i.airChange > 1.5
  );

  return {
    wallArea, windowArea, volume, deltaT: i.roomTemp - i.outsideTemp,
    hWall: mid.hWall, hWindow: mid.hWindow, hVent: mid.hVent, heatMid: mid.q,
    heatLow: low.q, heatHigh: high.q,
    cornerMid, cornerLow: effectiveCornerLow, cornerHigh,
    corner2DGeometricMid,
    fRsiMid, fRsiLow, fRsiHigh,
    dewPoint: dew, moldThreshold: mold, verdict,
    dewInBand: dew >= effectiveCornerLow && dew <= cornerHigh,
    annualKwhMid, annualKwhLow, annualKwhHigh,
    annualCostMid: annualKwhMid * ENERGY_PRICE_KWH,
    surfaceRhCorner,
    surfaceRhWall,
    moldGerminationDays,
    condensateRateCorner,
    stratification,
    finiteDifference2D: finiteDiff,
  };
}

export interface BuildingTypologyPreset {
  id: string;
  nameDe: string;
  nameEn: string;
  year: string;
  wallTypeDescDe: string;
  wallTypeDescEn: string;
  wallU: number;
  windowTypeDescDe: string;
  windowTypeDescEn: string;
  windowU: number;
  baseAirChange: number;
  isInsulated: boolean;
}

export const BERLIN_TYPOLOGY_PRESETS: BuildingTypologyPreset[] = [
  {
    id: 'altbau_1905',
    nameDe: 'Klassischer Berliner Altbau (1905)',
    nameEn: 'Classic Berlin Wilhelminian Altbau (1905)',
    year: '1880–1918',
    wallTypeDescDe: '38 cm Vollziegelmauerwerk verputzt, ungedämmt',
    wallTypeDescEn: '38 cm solid brick masonry plastered, uninsulated',
    wallU: 1.70,
    windowTypeDescDe: 'Kastenfenster (Doppelfenster Holz)',
    windowTypeDescEn: 'Traditional box sash wood window',
    windowU: 2.80,
    baseAirChange: 0.6,
    isInsulated: false,
  },
  {
    id: 'nachkrieg_1960',
    nameDe: 'Nachkriegsbau Wiederaufbau (1960)',
    nameEn: 'Post-War Reconstruction (1960)',
    year: '1949–1968',
    wallTypeDescDe: '24 cm Hohlblock/Bimsbeton mit Kältebrücken',
    wallTypeDescEn: '24 cm hollow concrete/cinderblock thermal bridges',
    wallU: 1.95,
    windowTypeDescDe: 'Verbundfenster Holz (altes Isolierglas)',
    windowTypeDescEn: 'Composite window with 1st gen double glass',
    windowU: 2.90,
    baseAirChange: 0.5,
    isInsulated: false,
  },
  {
    id: 'plattenbau_wbs70',
    nameDe: 'Plattenbau WBS 70 (Ost-Berlin 1980)',
    nameEn: 'Prefab Panel WBS 70 (East Berlin 1980)',
    year: '1970–1990',
    wallTypeDescDe: 'Dreischicht-Außenwandplatte Beton mit 6 cm Kerndämmung',
    wallTypeDescEn: 'Three-layer concrete sandwich with 6 cm core',
    wallU: 0.85,
    windowTypeDescDe: 'Holzfenster zweischeibig',
    windowTypeDescEn: 'Standard double pane wood window',
    windowU: 2.60,
    baseAirChange: 0.5,
    isInsulated: false,
  },
  {
    id: 'altbau_renovated',
    nameDe: 'Vollsanierter Altbau (KfW 55 Effizienzhaus)',
    nameEn: 'Deeply Retrofitted Altbau (KfW 55)',
    year: 'Sanierung 2020+',
    wallTypeDescDe: '38 cm Ziegel + 16 cm Mineralwolle-WDVS',
    wallTypeDescEn: '38 cm brick + 16 cm mineral wool ETICS',
    wallU: 0.22,
    windowTypeDescDe: 'Dreifach-Wärmeschutzverglasung mit warmer Kante',
    windowTypeDescEn: 'Triple low-e glazing with warm-edge spacer',
    windowU: 0.80,
    baseAirChange: 0.4,
    isInsulated: true,
  },
];

