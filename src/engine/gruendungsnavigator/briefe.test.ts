// Briefe und Kalender: feste Bausteine, eigene Tatsachen, keine Urteile. Lizenz: CC0.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { erzeugeBrief, BRIEF_TITEL, BRIEF_VERBOTEN, type BriefArt } from './briefe';
import { erzeugeIcs, falte, maskiere } from './kalender';
import { assertKeinVersprechen } from './gruendungsnavigator';

const NORMEN = JSON.parse(readFileSync(resolve(__dirname, '../../../07-demos/gruendungsnavigator/data/normen.json'), 'utf8')) as Record<string, unknown>;
const VOLL = { name: 'Erika Beispiel', bg: '12345BG0001', jobcenter: 'Jobcenter Musterstadt', ortDatum: 'Musterstadt, 16.10.2026', bescheidVom: '01.10.2026', antragVom: '02.09.2026', muendlich: 'Der Zuschuss werde nicht bewilligt.' };
const ARTEN = Object.keys(BRIEF_TITEL) as BriefArt[];

describe('Briefe', () => {
  it.each(ARTEN)('%s: vollständig ausgefüllt, nichts fehlt, Normen im Register, kein verbotenes Wort', (art) => {
    const b = erzeugeBrief(art, VOLL);
    expect(b.fehlt).toEqual([]);
    expect(b.text).not.toMatch(/\[[^\]]+\]/);
    for (const n of b.normen) expect(NORMEN, n).toHaveProperty(n);
    for (const re of BRIEF_VERBOTEN) expect(b.text, String(re)).not.toMatch(re);
    expect(() => assertKeinVersprechen(b.text + b.hinweise.join(' '))).not.toThrow();
    expect(b.text).toContain('Bitte bestätigen Sie mir den Eingang');
  });

  it('leere Felder erscheinen als [Beschriftung] und stehen in „fehlt“', () => {
    const b = erzeugeBrief('widerspruch', {});
    expect(b.fehlt).toEqual(expect.arrayContaining(['Ihr Name', 'BG-Nummer', 'Datum des Bescheids']));
    expect(b.text).toContain('[Datum des Bescheids]');
  });

  it('Widerspruch ohne Tatsachen: „Begründung reiche ich nach“; mit Tatsachen: genau der eigene Text', () => {
    expect(erzeugeBrief('widerspruch', VOLL).text).toContain('Die Begründung reiche ich nach.');
    const t = 'Die Lohnabrechnung für Mai lag dem Jobcenter am 03.06.2026 vor (Eingangsbestätigung anbei).';
    expect(erzeugeBrief('widerspruch', { ...VOLL, tatsachen: t }).text).toContain(t);
  });

  it('Widerspruch mit Akteneinsicht nennt § 25 SGB X; Hinweis zu § 39 und § 86a', () => {
    const b = erzeugeBrief('widerspruch', { ...VOLL, mitAkteneinsicht: true });
    expect(b.text).toContain('§ 25 SGB X');
    expect(b.hinweise.join(' ')).toMatch(/§ 39 Nr\. 1 SGB II/);
    expect(b.hinweise.join(' ')).toMatch(/§ 86a Abs\. 1 SGG/);
  });

  it('Betreff grammatisch: „gegen Ihren Bescheid“, „Überprüfung Ihres Bescheids“', () => {
    expect(erzeugeBrief('widerspruch', VOLL).betreff).toBe('Widerspruch gegen Ihren Bescheid vom 01.10.2026');
    expect(erzeugeBrief('ueberpruefung', { ...VOLL, gegenstand: 'Erstattung März' }).betreff).toBe('Antrag auf Überprüfung Ihres Bescheids vom 01.10.2026 (Erstattung März)');
  });

  it('Gegenproben: Datum falsch geschrieben, unbekannte Briefart', () => {
    expect(() => erzeugeBrief('widerspruch', { ...VOLL, bescheidVom: '2026-10-01' })).toThrow(/TT\.MM\.JJJJ/);
    expect(() => erzeugeBrief('drohbrief' as BriefArt, VOLL)).toThrow();
  });

  it('Gegenprobe Wortsperre: ein Aktenzeichen in den Bausteinen würde gefunden', () => {
    expect(BRIEF_VERBOTEN.some((re) => re.test('vgl. BSG, Urteil vom 1.1.2020, Az. B 4 AS 1/19 R'))).toBe(true);
  });
});

describe('Kalender (RFC 5545)', () => {
  const ics = erzeugeIcs([{ titel: 'Widerspruch: Frist endet', datum: '2026-11-09', beschreibung: 'Bescheid vom 08.10.2026; § 84 SGG, Eingang zählt' }], '20261016T120000Z');

  it('ganztägiger Termin mit Ende am Folgetag und Erinnerung zwei Tage vorher', () => {
    expect(ics).toContain('DTSTART;VALUE=DATE:20261109');
    expect(ics).toContain('DTEND;VALUE=DATE:20261110');
    expect(ics).toContain('TRIGGER:-P2D');
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
  });

  it('maskiert Komma, Semikolon und Zeilenumbruch', () => {
    expect(maskiere('a,b;c\nd\\e')).toBe('a\\,b\\;c\\nd\\\\e');
    expect(ics.replace(/\r\n /g, '')).toContain('08.10.2026\\; § 84 SGG\\, Eingang');
  });

  it('faltet bei 75 Oktetten, ohne Umlaute zu teilen', () => {
    const z = falte('DESCRIPTION:' + 'ä'.repeat(100));
    for (const teil of z.split('\r\n')) expect(new TextEncoder().encode(teil).length).toBeLessThanOrEqual(75);
    expect(z.replace(/\r\n /g, '')).toBe('DESCRIPTION:' + 'ä'.repeat(100));
  });

  it('gleiche Eingabe, gleiche UID (Import ersetzt statt verdoppelt)', () => {
    const uid = (s: string) => s.match(/UID:(\S+)/)![1];
    expect(uid(ics)).toBe(uid(erzeugeIcs([{ titel: 'Widerspruch: Frist endet', datum: '2026-11-09' }], '20270101T000000Z')));
  });

  it('Gegenproben: ungültiges Datum, leerer Titel, falscher Zeitstempel', () => {
    expect(() => erzeugeIcs([{ titel: 'x', datum: '09.11.2026' }], '20261016T120000Z')).toThrow();
    expect(() => erzeugeIcs([{ titel: ' ', datum: '2026-11-09' }], '20261016T120000Z')).toThrow();
    expect(() => erzeugeIcs([], '2026-10-16')).toThrow();
  });
});
