import historicalRaw from './birdMovementMap.json';
import recentRaw from './birdRecentMap.json';

export interface BirdReading { density: number | null; u: number | null; v: number | null; status: string }
export interface BirdObservations {
  times: string[];
  stations: { code: string; lat: number; lon: number; readings: BirdReading[] }[];
}
export type BirdDatasetId = 'recent' | 'historical';

export interface BirdDataset {
  id: BirdDatasetId;
  data: BirdObservations;
  /** ISO date range shown in labels and used for the CSV filename. */
  first: string;
  last: string;
  defaultStation: string;
  /** Plain-text unit for popups and charts. */
  layer: 'column' | 'band';
}

const make = (id: BirdDatasetId, data: BirdObservations, defaultStation: string, layer: 'column' | 'band'): BirdDataset =>
  ({ id, data, first: data.times[0].slice(0, 10), last: data.times.at(-1)!.slice(0, 10), defaultStation, layer });

export const BIRD_DATASETS: Record<BirdDatasetId, BirdDataset> = {
  recent: make('recent', recentRaw as BirdObservations, 'bewid', 'band'),
  historical: make('historical', historicalRaw as BirdObservations, 'depro', 'column'),
};

/** Hour with the largest mean density across reporting radars: a meaningful starting frame. */
export const strongestFrame = (data: BirdObservations): number => {
  let best = 0, bestMean = -1;
  data.times.forEach((_, i) => {
    const values = data.stations.map(s => s.readings[i]).filter(r => r.status === 'observed' && r.density !== null).map(r => r.density as number);
    const mean = values.length ? values.reduce((a, b) => a + b, 0) / values.length : -1;
    if (mean > bestMean) { bestMean = mean; best = i; }
  });
  return best;
};
