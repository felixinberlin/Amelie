import { describe, expect, it, vi, afterEach } from 'vitest';
import { berlinTreeUrl, lookupBerlinTrees, parseBerlinTrees } from './berlinTrees';
const collection = { type: 'FeatureCollection', numberMatched: 1, features: [{ id: 'strassenbaeume.example', geometry: { type: 'Point', coordinates: [13.405, 52.52] } }] };
afterEach(() => vi.unstubAllGlobals());
describe('Berlin official tree observations', () => {
  it('keeps WFS bbox axis order distinct from GeoJSON coordinates', () => {
    const url = new URL(berlinTreeUrl(52.52, 13.405, 'strassenbaeume'));
    const bbox = url.searchParams.get('bbox')!.split(',');
    expect(Number(bbox[0])).toBeCloseTo(52.5191, 4);
    expect(Number(bbox[1])).toBeCloseTo(13.40352, 4);
    expect(parseBerlinTrees(collection, 52.52, 13.405)[0].distanceMetres).toBe(0);
  });
  it('rejects out-of-region requests, malformed geometry and truncation', () => {
    expect(() => berlinTreeUrl(48, 11, 'anlagenbaeume')).toThrow();
    expect(() => parseBerlinTrees({}, 52.52, 13.405)).toThrow();
    expect(() => parseBerlinTrees({ ...collection, numberMatched: 501 }, 52.52, 13.405)).toThrow('incomplete');
    expect(() => parseBerlinTrees({ ...collection, features: [{ id: 'bad', geometry: { type: 'Point', coordinates: [NaN, 52] } }] }, 52.52, 13.405)).toThrow();
  });
  it('queries both official layers and retains provenance without claiming coverage', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => collection });
    vi.stubGlobal('fetch', fetchMock);
    const survey = await lookupBerlinTrees(52.52, 13.405);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(survey.requestUrls?.[1]).toContain('anlagenbaeume');
    expect(survey.license).toBe('dl-de-zero-2.0');
    expect(survey.coverageVerified).toBe(false);
  });
  it('does not substitute an empty successful survey when a layer fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(lookupBerlinTrees(52.52, 13.405)).rejects.toThrow('503');
  });
});
