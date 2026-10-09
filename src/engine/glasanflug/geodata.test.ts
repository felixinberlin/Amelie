import { describe, expect, it } from 'vitest';
import { distanceMetres, overpassVegetationQuery, parseVegetationNodes } from './geodata';

describe('Glasanflug live vegetation lookup', () => {
  it('uses zero distance for identical locations', () => {
    expect(distanceMetres({ latitude: 52.5, longitude: 13.4 }, { latitude: 52.5, longitude: 13.4 })).toBe(0);
  });
  it('rejects invalid coordinates instead of querying', () => {
    expect(() => overpassVegetationQuery(95, 13)).toThrow();
    expect(() => overpassVegetationQuery(NaN, 13)).toThrow();
  });
  it('requests mapped tree and shrub points without confusing polygon centres with boundaries', () => {
    const query = overpassVegetationQuery(52.52, 13.405);
    expect(query).toContain('node(around:100,52.52,13.405)');
    expect(query).toContain('"natural"="tree"');
    expect(query).not.toContain('way(');
  });
  it('sorts and limits observations while excluding polygon-centre guesses', () => {
    const result = parseVegetationNodes({ elements: [
      { type: 'way', id: 1, center: { lat: 52.52, lon: 13.405 } },
      { type: 'node', id: 2, lat: 52.5201, lon: 13.405, tags: { natural: 'tree' } },
      { type: 'node', id: 3, lat: 53, lon: 13.405 },
      { type: 'node', id: 4, lat: 52.52, lon: 13.405, tags: { natural: 'shrub' } },
    ] }, 52.52, 13.405);
    expect(result.map(x => x.id)).toEqual(['osm:node/4', 'osm:node/2']);
    expect(result[0].distanceMetres).toBe(0);
  });
});
