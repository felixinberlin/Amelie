// Jobcenter-Hilfe: Fristen als Kalenderdatei (iCalendar, RFC 5545). Lizenz: CC0.
//
// Ganztägige Termine mit Erinnerung zwei Tage vorher. Die UID hängt nur von
// Titel und Datum ab, damit ein erneuter Import denselben Termin ersetzt statt
// ihn zu verdoppeln. Läuft im Browser ohne Bibliothek.

import { parseIso, plusTage, type IsoDatum } from './gruendungsnavigator';

export interface KalenderEintrag {
  titel: string;
  datum: IsoDatum;
  beschreibung?: string;
}

/** Text nach RFC 5545 3.3.11 maskieren */
export function maskiere(t: string): string {
  return t.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** Zeilen nach RFC 5545 3.1 auf höchstens 75 Oktette falten, ohne UTF-8-Zeichen zu teilen */
export function falte(zeile: string): string {
  const enc = new TextEncoder();
  const teile: string[] = [];
  let aktuell = '';
  let bytes = 0;
  for (const z of zeile) {
    const n = enc.encode(z).length;
    const grenze = teile.length ? 74 : 75; // Folgezeilen beginnen mit einem Leerzeichen
    if (bytes + n > grenze) {
      teile.push(aktuell);
      aktuell = '';
      bytes = 0;
    }
    aktuell += z;
    bytes += n;
  }
  teile.push(aktuell);
  return teile.join('\r\n ');
}

/** Kleiner, stabiler Hash (FNV-1a, 32 Bit) für die UID */
function fnv(t: string): string {
  let h = 0x811c9dc5;
  for (const b of new TextEncoder().encode(t)) {
    h ^= b;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

const kompakt = (d: IsoDatum) => d.replace(/-/g, '');

/**
 * Erzeugt eine .ics-Datei. `erzeugtAm` (UTC, z. B. „20261016T120000Z“) wird
 * übergeben statt gelesen, damit die Ausgabe prüfbar gleich bleibt.
 */
export function erzeugeIcs(eintraege: KalenderEintrag[], erzeugtAm: string): string {
  if (!/^\d{8}T\d{6}Z$/.test(erzeugtAm)) throw new Error(`erzeugtAm „${erzeugtAm}“ nicht im Format JJJJMMTTThhmmssZ`);
  const z: string[] = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Amelie//Jobcenter-Hilfe//DE', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  for (const e of eintraege) {
    parseIso(e.datum);
    if (!e.titel.trim()) throw new Error('Kalendereintrag ohne Titel');
    z.push(
      'BEGIN:VEVENT',
      `UID:${fnv(e.titel + '|' + e.datum)}-${kompakt(e.datum)}@jobcenter-hilfe.amelie`,
      `DTSTAMP:${erzeugtAm}`,
      `DTSTART;VALUE=DATE:${kompakt(e.datum)}`,
      `DTEND;VALUE=DATE:${kompakt(plusTage(e.datum, 1))}`,
      `SUMMARY:${maskiere(e.titel)}`,
      ...(e.beschreibung ? [`DESCRIPTION:${maskiere(e.beschreibung)}`] : []),
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${maskiere(e.titel)}`,
      'TRIGGER:-P2D',
      'END:VALARM',
      'END:VEVENT',
    );
  }
  z.push('END:VCALENDAR');
  return z.map(falte).join('\r\n') + '\r\n';
}
