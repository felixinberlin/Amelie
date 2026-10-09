/**
 * Observed vegetation around a user-supplied coordinate, not an LAG-VSW score.
 * OSM coverage is incomplete; point distances are not pane-to-vegetation distances.
 */
export interface VegetationObservation {
  id: string;
  kind: string;
  distanceMetres: number;
  latitude: number;
  longitude: number;
}
export interface VegetationSurvey {
  point: { latitude: number; longitude: number };
  radiusMetres: 100;
  source: 'OpenStreetMap / Overpass API';
  retrievedAt: string;
  observations: VegetationObservation[];
  /** Absence of a mapped feature is NEVER evidence of absence of vegetation. */
  coverageVerified: false;
}
interface OsmElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}
const earthRadiusMetres = 6371008.8;
export function distanceMetres(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  const rad = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * rad;
  const dLon = (b.longitude - a.longitude) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.latitude * rad) * Math.cos(b.latitude * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * earthRadiusMetres * Math.asin(Math.min(1, Math.sqrt(h)));
}
export function parseVegetationNodes(data: { elements?: OsmElement[] }, latitude: number, longitude: number): VegetationObservation[] {
  if (!Array.isArray(data.elements)) throw new Error('Invalid Overpass response');
  return data.elements
    .filter(e => e.type === 'node' && Number.isFinite(e.lat) && Number.isFinite(e.lon))
    .map(e => ({
      id: `osm:${e.type}/${e.id}`,
      kind: e.tags?.natural === 'tree' ? 'tree' : e.tags?.barrier === 'hedge' ? 'hedge' : 'shrub',
      distanceMetres: Math.round(distanceMetres({ latitude, longitude }, { latitude: e.lat!, longitude: e.lon! }) * 10) / 10,
      latitude: e.lat!,
      longitude: e.lon!,
    }))
    .filter(e => e.distanceMetres <= 100)
    .sort((a, b) => a.distanceMetres - b.distanceMetres);
}
/** An explicitly point-only query: no polygons represented by misleading centroid distances. */
export function overpassVegetationQuery(latitude: number, longitude: number): string {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    throw new Error('Invalid coordinates');
  }
  return `[out:json][timeout:25];(node(around:100,${latitude},${longitude})["natural"="tree"];node(around:100,${latitude},${longitude})["natural"="shrub"];node(around:100,${latitude},${longitude})["barrier"="hedge"];);out body;`;
}
export async function lookupVegetation(latitude: number, longitude: number, signal?: AbortSignal): Promise<VegetationSurvey> {
  const query = overpassVegetationQuery(latitude, longitude);
  const response = await fetch('https://overpass.kumi.systems/api/interpreter', {
    method: 'POST',
    body: new URLSearchParams({ data: query }),
    signal,
  });
  if (!response.ok) throw new Error(`Overpass HTTP ${response.status}`);
  const data = await response.json();
  return {
    point: { latitude, longitude },
    radiusMetres: 100,
    source: 'OpenStreetMap / Overpass API',
    retrievedAt: new Date().toISOString(),
    observations: parseVegetationNodes(data, latitude, longitude),
    coverageVerified: false,
  };
}
