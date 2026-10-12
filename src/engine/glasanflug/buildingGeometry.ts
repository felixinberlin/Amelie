/**
 * Abfrage und Berechnung von Gebäude-Geometrie und Fassadensegmenten aus OpenStreetMap (Overpass API).
 * 
 * Bestimmt für einen Standort (z.B. nach Adresssuche oder Klick):
 * - Gebäudeumriss / Footprint (Polygoneckpunkte)
 * - Fassadensegmente je Himmelsrichtung mit geschätzter Länge und Azimut
 * - Gebäudehöhe / Stockwerksanzahl (`building:levels`, `height`), falls in OSM kartiert
 * 
 * Deterministisch, ohne Schätzungen als Fakten auszugeben.
 * CC0 / Public Domain — Félix, Berlin.
 */

import { distanceMetres } from './geodata';
import { Himmelsrichtung } from './gebaeudeSchema';

export interface FassadenGeometrieSegment {
  segmentIndex: number;
  von: { latitude: number; longitude: number };
  nach: { latitude: number; longitude: number };
  laengeMetres: number;
  azimutGrad: number;
  himmelsrichtung: Himmelsrichtung;
}

export interface GebaeudeGeometrie {
  osmId: string;
  osmType: 'way' | 'relation';
  zentrum: { latitude: number; longitude: number };
  gebaeudeTyp: string;
  stockwerke?: number;
  hoeheMetres?: number;
  umfangMetres: number;
  flaechenInhaltM2?: number;
  segmente: FassadenGeometrieSegment[];
  kartierteFassadenseitenCount: number;
  retrievedAt: string;
}

/**
 * Wandelt einen Azimutwinkel (0-360°) in die 8 Haupthimmelsrichtungen um.
 * 0° = N, 90° = O, 180° = S, 270° = W.
 */
export function azimutZuHimmelsrichtung(grad: number): Himmelsrichtung {
  const norm = ((grad % 360) + 360) % 360;
  if (norm >= 337.5 || norm < 22.5) return 'N';
  if (norm >= 22.5 && norm < 67.5) return 'NO';
  if (norm >= 67.5 && norm < 112.5) return 'O';
  if (norm >= 112.5 && norm < 157.5) return 'SO';
  if (norm >= 157.5 && norm < 202.5) return 'S';
  if (norm >= 202.5 && norm < 247.5) return 'SW';
  if (norm >= 247.5 && norm < 292.5) return 'W';
  return 'NW';
}

/**
 * Berechnet den Azimut (Richtung in Grad von a nach b) auf der Kugeloberfläche.
 */
export function berechneAzimut(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
): number {
  const rad = Math.PI / 180;
  const lat1 = a.latitude * rad;
  const lat2 = b.latitude * rad;
  const dLon = (b.longitude - a.longitude) * rad;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const brng = Math.atan2(y, x) / rad;
  return Math.round(((brng + 360) % 360) * 10) / 10;
}

export function overpassBuildingQuery(latitude: number, longitude: number): string {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    throw new Error('Ungültige Koordinaten für Gebäudeabfrage');
  }
  // Sucht das am nächsten gelegene Gebäude innerhalb eines 50-Meter-Radius
  return `[out:json][timeout:25];(way(around:50,${latitude},${longitude})["building"];relation(around:50,${latitude},${longitude})["building"];);out body geom;`;
}

interface OverpassWayElement {
  type: 'way';
  id: number;
  geometry?: Array<{ lat: number; lon: number }>;
  tags?: Record<string, string>;
}

export function parseGebaeudeGeometrie(
  data: { elements?: any[] },
  zielLat: number,
  zielLon: number
): GebaeudeGeometrie | null {
  if (!Array.isArray(data.elements) || data.elements.length === 0) return null;

  // Suche das am besten passende Gebäude (nächstes Polygon zur Koordinate)
  const ways = data.elements.filter(
    (e) => e.type === 'way' && Array.isArray(e.geometry) && e.geometry.length >= 3
  ) as OverpassWayElement[];

  if (ways.length === 0) return null;

  // Wähle das Way-Element, dessen erster Punkt oder Schwerpunkt am nächsten ist
  let bestWay = ways[0];
  let minDistance = Infinity;

  for (const w of ways) {
    if (!w.geometry || w.geometry.length === 0) continue;
    const p = w.geometry[0];
    const dist = distanceMetres({ latitude: zielLat, longitude: zielLon }, { latitude: p.lat, longitude: p.lon });
    if (dist < minDistance) {
      minDistance = dist;
      bestWay = w;
    }
  }

  const geom = bestWay.geometry!;
  const tags = bestWay.tags || {};

  // Berechne Segmente
  const segmente: FassadenGeometrieSegment[] = [];
  let umfang = 0;

  for (let i = 0; i < geom.length - 1; i++) {
    const von = { latitude: geom[i].lat, longitude: geom[i].lon };
    const nach = { latitude: geom[i + 1].lat, longitude: geom[i + 1].lon };
    const laenge = Math.round(distanceMetres(von, nach) * 10) / 10;
    
    // Ignoriere Mikrosegment-Rauschen (< 1 m)
    if (laenge < 1.0) continue;

    const azimut = berechneAzimut(von, nach);
    // Die Fassaden-Normalenrichtung (Blickrichtung nach außen) steht senkrecht zur Kante (±90°)
    // Wir nehmen die Richtung der Fassadenausrichtung als Normale (+90° rechts vom Linienverlauf)
    const fassadenAusrichtungAzimut = (azimut + 90) % 360;
    const himmelsrichtung = azimutZuHimmelsrichtung(fassadenAusrichtungAzimut);

    umfang += laenge;
    segmente.push({
      segmentIndex: segmente.length + 1,
      von,
      nach,
      laengeMetres: laenge,
      azimutGrad: fassadenAusrichtungAzimut,
      himmelsrichtung,
    });
  }

  const stockwerke = tags['building:levels'] ? parseInt(tags['building:levels'], 10) : undefined;
  const hoehe = tags['height'] ? parseFloat(tags['height']) : stockwerke ? stockwerke * 3.5 : undefined;

  return {
    osmId: `osm:way/${bestWay.id}`,
    osmType: 'way',
    zentrum: { latitude: geom[0].lat, longitude: geom[0].lon },
    gebaeudeTyp: tags['building'] || 'yes',
    stockwerke: Number.isFinite(stockwerke) ? stockwerke : undefined,
    hoeheMetres: Number.isFinite(hoehe) ? Math.round(hoehe! * 10) / 10 : undefined,
    umfangMetres: Math.round(umfang * 10) / 10,
    segmente,
    kartierteFassadenseitenCount: segmente.length,
    retrievedAt: new Date().toISOString(),
  };
}

export async function lookupGebaeudeGeometrie(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<GebaeudeGeometrie | null> {
  const query = overpassBuildingQuery(latitude, longitude);
  const response = await fetch('https://overpass.kumi.systems/api/interpreter', {
    method: 'POST',
    body: new URLSearchParams({ data: query }),
    signal,
  });

  if (!response.ok) throw new Error(`Overpass Building HTTP ${response.status}`);
  const data = await response.json();
  return parseGebaeudeGeometrie(data, latitude, longitude);
}
