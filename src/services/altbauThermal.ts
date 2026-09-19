// Steady-state room heat balance for the Altbau Thermal sketch (05-dosen/altbau-thermal.md,
// "Erster Schritt": one room, one exterior wall with a window, stationary).
//
// Deliberately simple enough to check by hand. Every result is a band, because the inputs
// (construction, usage) are uncertain. The band widths below are assumptions of this sketch,
// not standard values.

export const CEILING_H = 3.4;   // m, Berlin Altbau
export const WINDOW_H = 1.9;    // m, fixed
export const CP_AIR = 0.34;     // Wh/(m3 K), rho * c_p / 3600
export const RSI_CORNER = 0.25; // m2K/W, DIN 4108-2 value for corners / behind furniture

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
  dewPoint: number;       // C, condensation on the surface
  moldThreshold: number;  // C, surface at 80 % relative humidity
  verdict: MoldVerdict;
  dewInBand: boolean;
}

/** Dew point (Magnus), rh in 0..1. */
export function dewPoint(tempC: number, rh: number): number {
  const a = 17.62, b = 243.12;
  const g = Math.log(rh) + (a * tempC) / (b + tempC);
  return (b * g) / (a - g);
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

  const cornerHigh = cornerTemp(i, BAND.u[0], BAND.rsi[0]); // best case
  const cornerLow = cornerTemp(i, BAND.u[1], BAND.rsi[1]);  // worst case
  const rh = Math.min(0.99, Math.max(0.05, i.relHumidity / 100));
  const dew = dewPoint(i.roomTemp, rh);
  const mold = dewPoint(i.roomTemp, Math.min(0.99, rh / 0.8));

  const verdict: MoldVerdict = cornerLow > mold ? 'above' : cornerHigh < mold ? 'below' : 'overlap';
  return {
    wallArea, windowArea, volume, deltaT: i.roomTemp - i.outsideTemp,
    hWall: mid.hWall, hWindow: mid.hWindow, hVent: mid.hVent, heatMid: mid.q,
    heatLow: low.q, heatHigh: high.q,
    cornerMid: cornerTemp(i, 1, RSI_CORNER), cornerLow, cornerHigh,
    dewPoint: dew, moldThreshold: mold, verdict,
    dewInBand: dew >= cornerLow && dew <= cornerHigh,
  };
}
