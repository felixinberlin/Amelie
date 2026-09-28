import { describe, it, expect } from 'vitest';
import { calculateGeoDelta } from '../src/index'; // Adjust path as needed for actual project structure

// Mock GeoJSON types for demonstration, assuming they would be defined in src/types.ts or similar
type GeoJsonFeature = {
  type: "Feature";
  id?: string | number;
  geometry: { type: string; coordinates: any };
  properties: Record<string, any>;
};

type GeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
};

describe('calculateGeoDelta', () => {
  it('should correctly identify added, removed, and modified GeoJSON features', () => {
    const oldGeoJson: GeoJsonFeatureCollection = {
      type: 'FeatureCollection',
      features: [
        { id: 1, type: 'Feature', geometry: { type: 'Point', coordinates: [10, 20] }, properties: { name: 'Park A', area: 100 } },
        { id: 2, type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[0,0],[0,1],[1,1],[1,0],[0,0]]] }, properties: { name: 'Building B', height: 10 } },
        { id: 4, type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[5,5],[5,6],[6,6],[6,5],[5,5]]] }, properties: { name: 'Road Segment C' } },
      ],
    };

    const newGeoJson: GeoJsonFeatureCollection = {
      type: 'FeatureCollection',
      features: [
        // Modified feature 1 (property change: name)
        { id: 1, type: 'Feature', geometry: { type: 'Point', coordinates: [10, 20] }, properties: { name: 'Park A (Renamed)', area: 100 } },
        // Feature 2 is removed
        // Added feature 3
        { id: 3, type: 'Feature', geometry: { type: 'Point', coordinates: [30, 40] }, properties: { name: 'New Library' } },
        // Modified feature 4 (property change: name, geometry untouched in this mock for simplicity)
        { id: 4, type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[5,5],[5,6],[6,6],[6,5],[5,5]]] }, properties: { name: 'Road Segment C Improved' } },
      ],
    };

    const { added, removed, modified } = calculateGeoDelta(oldGeoJson, newGeoJson);

    expect(added).toHaveLength(1); // New Library
    expect(added[0].properties.name).toBe('New Library');

    expect(removed).toHaveLength(1); // Building B
    expect(removed[0].properties.name).toBe('Building B');

    expect(modified).toHaveLength(2); // Park A, Road Segment C
    expect(modified.find(m => m.old.id === 1)?.old.properties.name).toBe('Park A');
    expect(modified.find(m => m.new.id === 1)?.new.properties.name).toBe('Park A (Renamed)');
    expect(modified.find(m => m.old.id === 4)?.old.properties.name).toBe('Road Segment C');
    expect(modified.find(m => m.new.id === 4)?.new.properties.name).toBe('Road Segment C Improved');

    // Test with no changes
    const noChange = calculateGeoDelta(oldGeoJson, oldGeoJson);
    expect(noChange.added).toHaveLength(0);
    expect(noChange.removed).toHaveLength(0);
    expect(noChange.modified).toHaveLength(0);
  });

  it('should handle empty feature collections', () => {
    const empty: GeoJsonFeatureCollection = { type: 'FeatureCollection', features: [] };
    const oneFeature: GeoJsonFeatureCollection = {
      type: 'FeatureCollection',
      features: [
        { id: 1, type: 'Feature', geometry: { type: 'Point', coordinates: [10, 20] }, properties: { name: 'Park A' } },
      ],
    };

    const { added, removed, modified } = calculateGeoDelta(empty, oneFeature);
    expect(added).toHaveLength(1);
    expect(removed).toHaveLength(0);
    expect(modified).toHaveLength(0);

    const { added: added2, removed: removed2, modified: modified2 } = calculateGeoDelta(oneFeature, empty);
    expect(added2).toHaveLength(0);
    expect(removed2).toHaveLength(1);
    expect(modified2).toHaveLength(0);
  });
});
