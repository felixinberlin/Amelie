import { describe, it, expect } from 'vitest';
import {
  azimutZuHimmelsrichtung,
  berechneAzimut,
  parseGebaeudeGeometrie,
  overpassBuildingQuery,
} from './buildingGeometry';

describe('buildingGeometry', () => {
  it('konvertiert Azimutwinkel präzise in Haupthimmelsrichtungen', () => {
    expect(azimutZuHimmelsrichtung(0)).toBe('N');
    expect(azimutZuHimmelsrichtung(45)).toBe('NO');
    expect(azimutZuHimmelsrichtung(90)).toBe('O');
    expect(azimutZuHimmelsrichtung(135)).toBe('SO');
    expect(azimutZuHimmelsrichtung(180)).toBe('S');
    expect(azimutZuHimmelsrichtung(225)).toBe('SW');
    expect(azimutZuHimmelsrichtung(270)).toBe('W');
    expect(azimutZuHimmelsrichtung(315)).toBe('NW');
    expect(azimutZuHimmelsrichtung(355)).toBe('N');
  });

  it('berechnet Azimut zwischen zwei Koordinaten', () => {
    const punktA = { latitude: 52.52, longitude: 13.40 };
    // Nördlicher Punkt
    const punktNord = { latitude: 52.53, longitude: 13.40 };
    expect(berechneAzimut(punktA, punktNord)).toBeCloseTo(0, 0);

    // Östlicher Punkt
    const punktOst = { latitude: 52.52, longitude: 13.41 };
    expect(berechneAzimut(punktA, punktOst)).toBeCloseTo(90, 0);
  });

  it('erzeugt eine valide Overpass-Query', () => {
    const q = overpassBuildingQuery(50.928, 11.589);
    expect(q).toContain('way(around:50,50.928,11.589)["building"]');
  });

  it('parst OSM Way Geometrie und extrahiert Fassadensegmente', () => {
    const mockOsmResponse = {
      elements: [
        {
          type: 'way',
          id: 123456,
          tags: {
            building: 'university',
            'building:levels': '4',
            height: '14.5',
          },
          geometry: [
            { lat: 50.9280, lon: 11.5890 },
            { lat: 50.9280, lon: 11.5900 }, // ~70m nach Osten
            { lat: 50.9275, lon: 11.5900 }, // ~55m nach Süden
            { lat: 50.9275, lon: 11.5890 }, // ~70m nach Westen
            { lat: 50.9280, lon: 11.5890 }, // Schließen nach Norden
          ],
        },
      ],
    };

    const bld = parseGebaeudeGeometrie(mockOsmResponse, 50.9280, 11.5890);
    expect(bld).not.toBeNull();
    expect(bld?.osmId).toBe('osm:way/123456');
    expect(bld?.stockwerke).toBe(4);
    expect(bld?.hoeheMetres).toBe(14.5);
    expect(bld?.gebaeudeTyp).toBe('university');
    expect(bld?.segmente.length).toBe(4);
    expect(bld?.umfangMetres).toBeGreaterThan(200);
  });

  it('gibt null zurück wenn keine Gebäudeelemente vorhanden sind', () => {
    expect(parseGebaeudeGeometrie({ elements: [] }, 50.0, 11.0)).toBeNull();
  });
});
