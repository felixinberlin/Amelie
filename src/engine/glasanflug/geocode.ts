/** Address lookup is opt-in. Photon returns OSM-based candidate positions, not verified glass geometry. */
export interface GeocodedCandidate {
  label: string;
  latitude: number;
  longitude: number;
  osmId: number | null;
}
export function parsePhotonCandidates(data: unknown): GeocodedCandidate[] {
  if (!data || typeof data !== 'object' || !('features' in data) || !Array.isArray(data.features)) {
    throw new Error('Invalid Photon response');
  }
  return data.features.flatMap((feature: any) => {
    const coordinates = feature?.geometry?.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) return [];
    const [longitude, latitude] = coordinates;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return [];
    const props = feature.properties ?? {};
    const label = [props.name, props.street, props.housenumber, props.postcode, props.city, props.country]
      .filter((v): v is string => typeof v === 'string' && Boolean(v.trim())).join(', ');
    return [{ label: label || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
      latitude, longitude, osmId: Number.isInteger(props.osm_id) ? props.osm_id : null }];
  });
}
export async function geocodeAddress(address: string, signal?: AbortSignal): Promise<GeocodedCandidate[]> {
  const query = address.trim();
  if (query.length < 4 || query.length > 250) throw new Error('Enter an address (4–250 characters)');
  const url = new URL('https://photon.komoot.io/api/');
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '5');
  const response = await fetch(url.toString(), { signal });
  if (!response.ok) throw new Error(`Photon HTTP ${response.status}`);
  return parsePhotonCandidates(await response.json());
}
