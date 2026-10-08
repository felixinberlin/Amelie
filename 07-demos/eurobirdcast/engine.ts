/** CC0. Research calculation only; no turbine control or collision prediction. */
export interface Layer {
  bottomM: number;
  topM: number;
  densityBirdsKm3: number | null;
  speedKmH: number | null;
  quality: 'accepted' | 'rejected';
}
export interface Profile {
  source: string;
  license: string;
  timestampUtc: string;
  heightReference: 'AGL' | 'AMSL';
  layers: Layer[];
}
export interface Band { bottomM: number; topM: number; heightReference: 'AGL' | 'AMSL' }
export function integrate(profile: Profile, band: Band) {
  if (!profile.source.trim() || !profile.license.trim()) throw new Error('Source and license required');
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(profile.timestampUtc) || !Number.isFinite(Date.parse(profile.timestampUtc))) throw new Error('UTC timestamp required');
  if (![band.bottomM, band.topM].every(Number.isFinite) || band.bottomM < 0 || band.topM <= band.bottomM) throw new Error('Invalid band');
  if (profile.heightReference !== band.heightReference) throw new Error('Height references differ');
  const layers = [...profile.layers].sort((a, b) => a.bottomM - b.bottomM);
  let previousTop = -Infinity;
  let coveredM = 0;
  let observedMtr = 0;
  for (const layer of layers) {
    if (![layer.bottomM, layer.topM].every(Number.isFinite) || layer.bottomM < 0 || layer.topM <= layer.bottomM || layer.bottomM < previousTop) throw new Error('Invalid or overlapping layers');
    previousTop = layer.topM;
    for (const n of [layer.densityBirdsKm3, layer.speedKmH]) {
      if (n !== null && (!Number.isFinite(n) || n < 0)) throw new Error('Invalid measurement');
    }
    const overlapM = Math.max(0, Math.min(band.topM, layer.topM) - Math.max(band.bottomM, layer.bottomM));
    if (layer.quality !== 'accepted' || layer.densityBirdsKm3 === null || layer.speedKmH === null) continue;
    coveredM += overlapM;
    observedMtr += layer.densityBirdsKm3 * layer.speedKmH * overlapM / 1000;
  }
  const complete = Math.abs(coveredM - (band.topM - band.bottomM)) < 1e-8;
  return {
    version: '0.1.0', source: profile.source, license: profile.license,
    timestampUtc: profile.timestampUtc, band: { ...band },
    coverage: coveredM / (band.topM - band.bottomM),
    status: complete ? 'complete' as const : 'insufficient-coverage' as const,
    mtrBirdsKmH: complete ? observedMtr : null,
  };
}
/** Threshold is an experimental parameter, never a legal default. */
export function scenario(report: ReturnType<typeof integrate>, thresholdBirdsKmH: number, durationHours: number, baselineMw: number) {
  if (![thresholdBirdsKmH, durationHours, baselineMw].every(n => Number.isFinite(n) && n >= 0) || durationHours === 0) throw new Error('Invalid scenario');
  if (report.mtrBirdsKmH === null) return { status: 'unknown' as const, passageBirdsKm: null, hypotheticalLossMwh: null };
  const selected = report.mtrBirdsKmH >= thresholdBirdsKmH;
  return { status: selected ? 'selected' as const : 'below-threshold' as const,
    passageBirdsKm: report.mtrBirdsKmH * durationHours,
    hypotheticalLossMwh: selected ? baselineMw * durationHours : 0 };
}
