import { distanceMetres, VegetationObservation, VegetationSurvey } from './geodata';

export const BERLIN_TREE_SOURCE = 'Geoportal Berlin / Baumbestand Berlin' as const;
export const BERLIN_TREE_ENDPOINT = 'https://gdi.berlin.de/services/wfs/baumbestand';
export const BERLIN_TREE_METADATA = 'https://daten.berlin.de/datensaetze/baumbestand-berlin-wfs-48ad3a23';
const LIMIT = 500;
type Layer = 'strassenbaeume' | 'anlagenbaeume';

/** WFS EPSG:4326 BBOX uses latitude/longitude; returned GeoJSON uses longitude/latitude. */
export function berlinTreeUrl(latitude: number, longitude: number, layer: Layer): string {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < 52.3 || latitude > 52.7 || longitude < 13.0 || longitude > 13.8) {
    throw new Error('Berlin tree lookup requires coordinates in Berlin (approximate bounds).');
  }
  const dy = 100 / 111000;
  const dx = dy / Math.cos(latitude * Math.PI / 180);
  const params = new URLSearchParams({ service: 'WFS', version: '2.0.0', request: 'GetFeature',
    typeNames: `baumbestand:${layer}`, outputFormat: 'application/json', srsName: 'EPSG:4326',
    bbox: `${latitude - dy},${longitude - dx},${latitude + dy},${longitude + dx},urn:ogc:def:crs:EPSG::4326`, count: String(LIMIT) });
  return `${BERLIN_TREE_ENDPOINT}?${params}`;
}

export function parseBerlinTrees(data: unknown, latitude: number, longitude: number): VegetationObservation[] {
  const collection = data as { type?: string; features?: { id?: string; geometry?: { type?: string; coordinates?: number[] } }[]; numberMatched?: number | string; numberReturned?: number };
  if (collection?.type !== 'FeatureCollection' || !Array.isArray(collection.features)) throw new Error('Invalid Berlin WFS response');
  // Refuse to report a nearest result from a silently truncated response.
  if (collection.features.length >= LIMIT || (typeof collection.numberMatched === 'number' && collection.numberMatched > collection.features.length)) {
    throw new Error('Berlin WFS result is incomplete; reduce the search area or inspect the data manually.');
  }
  return collection.features.map(feature => {
    const coords = feature.geometry?.coordinates;
    if (feature.geometry?.type !== 'Point' || !coords || coords.length < 2 || !Number.isFinite(coords[0]) || !Number.isFinite(coords[1]) || Math.abs(coords[0]) > 180 || Math.abs(coords[1]) > 90 || typeof feature.id !== 'string') {
      throw new Error('Invalid Berlin tree geometry');
    }
    const point = { latitude: coords[1], longitude: coords[0] };
    return { id: `berlin:${feature.id}`, kind: 'tree', ...point,
      distanceMetres: Math.round(distanceMetres({ latitude, longitude }, point) * 10) / 10 };
  }).filter(tree => tree.distanceMetres <= 100).sort((a, b) => a.distanceMetres - b.distanceMetres);
}

export async function lookupBerlinTrees(latitude: number, longitude: number, signal?: AbortSignal): Promise<VegetationSurvey> {
  const urls = (['strassenbaeume', 'anlagenbaeume'] as const).map(layer => berlinTreeUrl(latitude, longitude, layer));
  const results = await Promise.all(urls.map(async url => {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`Berlin WFS HTTP ${response.status}`);
    return parseBerlinTrees(await response.json(), latitude, longitude);
  }));
  return { point: { latitude, longitude }, radiusMetres: 100, source: BERLIN_TREE_SOURCE,
    sourceUrl: BERLIN_TREE_METADATA, requestUrls: urls, license: 'dl-de-zero-2.0',
    retrievedAt: new Date().toISOString(), observations: results.flat().sort((a, b) => a.distanceMetres - b.distanceMetres), coverageVerified: false };
}
