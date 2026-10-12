import { describe, it, expect } from 'vitest';
import { erstelleGebaeudeBewertung, toGeoJsonFeature } from './gebaeudeSchema';
import { Eingabe } from './score';

describe('gebaeudeSchema', () => {
  const beispielEingabe: Eingabe = {
    glasanteil: { punkte: 3, herkunft: 'bild' },
    fassadengestaltung: { punkte: 2, herkunft: 'eingabe' },
    umgebung: { punkte: 4, herkunft: 'geodaten' },
    gehoelzabstand: { punkte: 3, herkunft: 'geodaten' },
  };

  const beispielErgebnis = {
    vollstaendig: true,
    summe: 12,
    stufe: 'hoch' as const,
    vorrang: [],
    unbestimmt: [],
  };

  it('erstellt ein valides GebaeudeBewertung-Objekt', () => {
    const bewertung = erstelleGebaeudeBewertung({
      gebaeudeId: 'bld-test-1',
      adresseText: 'Unter den Linden 6, 10117 Berlin',
      latitude: 52.517,
      longitude: 13.393,
      eingabe: beispielEingabe,
      ergebnis: beispielErgebnis,
    });

    expect(bewertung.schemaVersion).toBe('1.0.0');
    expect(bewertung.gebaeudeId).toBe('bld-test-1');
    expect(bewertung.adresse?.text).toBe('Unter den Linden 6, 10117 Berlin');
    expect(bewertung.geokoordinaten?.latitude).toBe(52.517);
    expect(bewertung.geokoordinaten?.longitude).toBe(13.393);
    expect(bewertung.lagVswBewertung.stufe).toBe('hoch');
    expect(bewertung.lagVswBewertung.summe).toBe(12);
    expect(bewertung.fassaden.length).toBe(1);
    expect(bewertung.fassaden[0].glasanteilStufe).toBe(3);
  });

  it('konvertiert erfolgreich in ein valides GeoJSON Feature', () => {
    const bewertung = erstelleGebaeudeBewertung({
      gebaeudeId: 'bld-test-1',
      adresseText: 'Unter den Linden 6, 10117 Berlin',
      latitude: 52.517,
      longitude: 13.393,
      eingabe: beispielEingabe,
      ergebnis: beispielErgebnis,
      monitoring: {
        fundeProJahr: 4,
        fassadenlaengeM: 50,
        signifikantErhoeht: true,
      },
    });

    const geojson = toGeoJsonFeature(bewertung);

    expect(geojson.type).toBe('Feature');
    expect(geojson.id).toBe('bld-test-1');
    expect((geojson.geometry as any).type).toBe('Point');
    // In GeoJSON: [longitude, latitude]
    expect((geojson.geometry as any).coordinates).toEqual([13.393, 52.517]);
    expect((geojson.properties as any).risikostufe).toBe('hoch');
    expect((geojson.properties as any).monitoringSignifikant).toBe(true);
  });

  it('behandelt unvollständige Eingaben sauber', () => {
    const unvollstaendigeEingabe: Eingabe = {
      glasanteil: { punkte: null, herkunft: 'unbestimmt' },
      fassadengestaltung: { punkte: null, herkunft: 'unbestimmt' },
      umgebung: { punkte: null, herkunft: 'unbestimmt' },
      gehoelzabstand: { punkte: null, herkunft: 'unbestimmt' },
    };

    const unvollstaendigesErgebnis = {
      vollstaendig: false,
      summe: null,
      stufe: null,
      vorrang: [],
      unbestimmt: ['glasanteil', 'fassadengestaltung', 'umgebung', 'gehoelzabstand'],
    };

    const bewertung = erstelleGebaeudeBewertung({
      eingabe: unvollstaendigeEingabe,
      ergebnis: unvollstaendigesErgebnis,
    });

    expect(bewertung.lagVswBewertung.vollstaendig).toBe(false);
    expect(bewertung.lagVswBewertung.stufe).toBeNull();
    expect(bewertung.lagVswBewertung.unbestimmteKriterien.length).toBe(4);
    
    const geojson = toGeoJsonFeature(bewertung);
    expect((geojson.properties as any).risikostufe).toBeNull();
    expect((geojson.properties as any).vollstaendig).toBe(false);
  });
});
