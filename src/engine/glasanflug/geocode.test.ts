import { describe, expect, it } from 'vitest';
import { parsePhotonCandidates } from './geocode';

describe('Glasanflug address lookup', () => {
  it('returns candidate coordinates in longitude-latitude GeoJSON order', () => {
    const result = parsePhotonCandidates({ features: [{
      geometry: { coordinates: [13.405, 52.52] },
      properties: { name: 'Testhaus', city: 'Berlin', osm_id: 42 },
    }] });
    expect(result).toEqual([{ label: 'Testhaus, Berlin', latitude: 52.52, longitude: 13.405, osmId: 42 }]);
  });
  it('rejects malformed and out-of-range coordinates', () => {
    expect(parsePhotonCandidates({ features: [
      { geometry: { coordinates: [181, 52] } },
      { geometry: { coordinates: [13] } },
      { geometry: { coordinates: [13.4, 52.5] }, properties: {} },
    ] })).toHaveLength(1);
  });
  it('rejects invalid server responses', () => {
    expect(() => parsePhotonCandidates({})).toThrow('Invalid Photon response');
  });
});
