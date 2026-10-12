/**
 * Gebäude- und Fassaden-Bewertungsschema für Vogelschlag an Glas.
 * 
 * Schnittstellendefinition und Konverter für den NABU Vogelschlagmelder
 * (kompatibel mit FastAPI/Pydantic auf codeberg.org/nabu-jena/Vogelschlagmelder).
 * 
 * CC0 / Public Domain — Félix, Berlin.
 */

import { Eingabe } from './score';
import { Risikostufe } from './schema';
import { VegetationSurvey } from './geodata';
import { Testart } from './markierung';

export type Himmelsrichtung = 'N' | 'NO' | 'O' | 'SO' | 'S' | 'SW' | 'W' | 'NW';

export type ErfasserTyp = 'ehrenamtlich' | 'sachverstaendig' | 'buergerin';

export interface FassadenAbschnitt {
  id: string;
  bezeichnung?: string;
  ausrichtung?: Himmelsrichtung | number; // Kompassrichtung oder Azimut in Grad
  flaecheM2?: number;
  hoeheM?: number;
  breiteM?: number;
  glasanteilProzent?: number;
  glasanteilStufe?: 1 | 2 | 3 | 4;
  fassadengestaltungStufe?: 1 | 2 | 3 | 4;
  maximaleScheibengroesseM2?: number;
  markierungVorhanden?: boolean;
  markierungsMusterNr?: string;
  markierungsKategorie?: 'A' | 'B' | 'C' | 'D';
  markierungsTestart?: Testart;
  fotos?: string[]; // Dateinamen oder URLs
}

export interface UmfeldErfassung {
  umgebungStufe?: 1 | 2 | 3 | 4;
  gehoelzabstandStufe?: 1 | 2 | 3 | 4;
  gehoelzabstandMetres?: number;
  gehoelzQuelle?: 'osm' | 'baumkataster_berlin' | 'messung_vor_ort' | 'unbestimmt';
  vegetationObservationsCount?: number;
  naechsteBeobachtung?: {
    distanzMetres: number;
    art: string;
  };
}

export interface LAGVSWEinstufungErgebnis {
  vollstaendig: boolean;
  summe: number | null;
  stufe: Risikostufe | null;
  vorrangregel: string | null;
  regelkonflikt: boolean;
  unbestimmteKriterien: string[];
}

export interface GebaeudeBewertung {
  schemaVersion: '1.0.0';
  gebaeudeId: string;
  erfasstAm: string; // ISO 8601
  erfasserTyp: ErfasserTyp;
  erfasserNotiz?: string;
  adresse?: {
    text: string;
    strasse?: string;
    hausnummer?: string;
    postleitzahl?: string;
    stadt?: string;
  };
  geokoordinaten?: {
    latitude: number;
    longitude: number;
  };
  fassaden: FassadenAbschnitt[];
  umfeld: UmfeldErfassung;
  lagVswBewertung: LAGVSWEinstufungErgebnis;
  monitoring?: {
    fundeProJahr: number | null;
    fassadenlaengeM: number | null;
    signifikantErhoeht: boolean | null;
  };
  disclaimer: string;
}

/**
 * Erstellt eine standardisierte `GebaeudeBewertung` aus den aktuellen Eingaben
 * des Glasanflug-Simulators.
 */
export function erstelleGebaeudeBewertung(params: {
  gebaeudeId?: string;
  adresseText?: string;
  latitude?: number;
  longitude?: number;
  eingabe: Eingabe;
  ergebnis: {
    vollstaendig: boolean;
    summe: number | null;
    stufe: Risikostufe | null;
    vorrang: Array<{ art: string; de: string; en: string }>;
    unbestimmt: string[];
  };
  survey?: VegetationSurvey | null;
  markierung?: {
    musterNr?: string;
    kategorie?: 'A' | 'B' | 'C' | 'D' | null;
    testart?: Testart;
  };
  buildingGeometrie?: {
    osmId?: string;
    gebaeudeTyp?: string;
    stockwerke?: number;
    hoeheMetres?: number;
    umfangMetres?: number;
    segmente?: Array<{
      segmentIndex: number;
      himmelsrichtung: Himmelsrichtung;
      laengeMetres: number;
      azimutGrad: number;
    }>;
  } | null;
  monitoring?: {
    fundeProJahr: number | null;
    fassadenlaengeM: number | null;
    signifikantErhoeht: boolean | null;
  };
  erfasserTyp?: ErfasserTyp;
}): GebaeudeBewertung {
  const {
    gebaeudeId = `bld-${Date.now().toString(36)}`,
    adresseText,
    latitude,
    longitude,
    eingabe,
    ergebnis,
    survey,
    markierung,
    buildingGeometrie,
    monitoring,
    erfasserTyp = 'ehrenamtlich',
  } = params;

  let fassaden: FassadenAbschnitt[] = [];

  if (buildingGeometrie && buildingGeometrie.segmente && buildingGeometrie.segmente.length > 0) {
    fassaden = buildingGeometrie.segmente.map((seg, idx) => ({
      id: `f${seg.segmentIndex}`,
      bezeichnung: `Fassade #${seg.segmentIndex} (${seg.himmelsrichtung}, ${seg.laengeMetres}m)`,
      ausrichtung: seg.himmelsrichtung,
      breiteM: seg.laengeMetres,
      hoeheM: buildingGeometrie.hoeheMetres,
      glasanteilStufe: idx === 0 ? ((eingabe.glasanteil.punkte as 1 | 2 | 3 | 4) ?? undefined) : undefined,
      fassadengestaltungStufe: idx === 0 ? ((eingabe.fassadengestaltung.punkte as 1 | 2 | 3 | 4) ?? undefined) : undefined,
      markierungVorhanden: idx === 0 ? !!markierung?.musterNr : false,
      markierungsMusterNr: idx === 0 ? markierung?.musterNr || undefined : undefined,
      markierungsKategorie: idx === 0 ? markierung?.kategorie || undefined : undefined,
      markierungsTestart: idx === 0 ? markierung?.testart : undefined,
    }));
  } else {
    fassaden = [
      {
        id: 'f1',
        bezeichnung: 'Hauptfassade',
        glasanteilStufe: (eingabe.glasanteil.punkte as 1 | 2 | 3 | 4) ?? undefined,
        fassadengestaltungStufe: (eingabe.fassadengestaltung.punkte as 1 | 2 | 3 | 4) ?? undefined,
        markierungVorhanden: !!markierung?.musterNr,
        markierungsMusterNr: markierung?.musterNr || undefined,
        markierungsKategorie: markierung?.kategorie || undefined,
        markierungsTestart: markierung?.testart,
      },
    ];
  }

  const umfeld: UmfeldErfassung = {
    umgebungStufe: (eingabe.umgebung.punkte as 1 | 2 | 3 | 4) ?? undefined,
    gehoelzabstandStufe: (eingabe.gehoelzabstand.punkte as 1 | 2 | 3 | 4) ?? undefined,
    gehoelzQuelle:
      eingabe.gehoelzabstand.herkunft === 'geodaten'
        ? (survey?.source?.toLowerCase().includes('berlin') ? 'baumkataster_berlin' : 'osm')
        : eingabe.gehoelzabstand.herkunft === 'eingabe'
        ? 'messung_vor_ort'
        : 'unbestimmt',
    vegetationObservationsCount: survey?.observations?.length ?? 0,
    naechsteBeobachtung: survey?.observations?.[0]
      ? {
          distanzMetres: survey.observations[0].distanceMetres,
          art: survey.observations[0].kind,
        }
      : undefined,
  };

  const vorrangRegel = ergebnis.vorrang.find((v) => v.art !== 'konflikt');
  const hatKonflikt = ergebnis.vorrang.some((v) => v.art === 'konflikt');

  const lagVswBewertung: LAGVSWEinstufungErgebnis = {
    vollstaendig: ergebnis.vollstaendig,
    summe: ergebnis.summe,
    stufe: ergebnis.stufe,
    vorrangregel: vorrangRegel ? vorrangRegel.de : null,
    regelkonflikt: hatKonflikt,
    unbestimmteKriterien: ergebnis.unbestimmt,
  };

  return {
    schemaVersion: '1.0.0',
    gebaeudeId,
    erfasstAm: new Date().toISOString(),
    erfasserTyp,
    adresse: adresseText ? { text: adresseText } : undefined,
    geokoordinaten:
      latitude !== undefined && longitude !== undefined && Number.isFinite(latitude) && Number.isFinite(longitude)
        ? { latitude, longitude }
        : undefined,
    fassaden,
    umfeld,
    lagVswBewertung,
    monitoring,
    disclaimer:
      'LAG-VSW 21/01 Schätzung (Amélie). Nicht rechtsverbindlich; Entscheidungshilfe für die Vor-Ort-Ansprache und Dokumentation.',
  };
}

/**
 * Konvertiert eine GebaeudeBewertung in ein RFC 7946 konformes GeoJSON Feature.
 */
export function toGeoJsonFeature(bewertung: GebaeudeBewertung): Record<string, unknown> {
  const coords = bewertung.geokoordinaten
    ? [bewertung.geokoordinaten.longitude, bewertung.geokoordinaten.latitude]
    : [0, 0];

  return {
    type: 'Feature',
    id: bewertung.gebaeudeId,
    geometry: {
      type: 'Point',
      coordinates: coords,
    },
    properties: {
      schemaVersion: bewertung.schemaVersion,
      gebaeudeId: bewertung.gebaeudeId,
      erfasstAm: bewertung.erfasstAm,
      erfasserTyp: bewertung.erfasserTyp,
      adresse: bewertung.adresse?.text ?? null,
      risikostufe: bewertung.lagVswBewertung.stufe,
      punkteSumme: bewertung.lagVswBewertung.summe,
      vollstaendig: bewertung.lagVswBewertung.vollstaendig,
      regelkonflikt: bewertung.lagVswBewertung.regelkonflikt,
      vorrangregel: bewertung.lagVswBewertung.vorrangregel,
      gehoelzQuelle: bewertung.umfeld.gehoelzQuelle,
      naechstesGehoelzDistanz: bewertung.umfeld.naechsteBeobachtung?.distanzMetres ?? null,
      monitoringSignifikant: bewertung.monitoring?.signifikantErhoeht ?? null,
      disclaimer: bewertung.disclaimer,
    },
  };
}
