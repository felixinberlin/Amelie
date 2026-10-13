// Datenschutz-Wächter für Lab-Belege. Lizenz: CC0 1.0 Public Domain.
//
// Anlass 13.10.2026: Lab-Läufe (Agent Mark) trugen in ihrer Absicht ein
// Personenprofil mit Wohnort und Lebensumständen; über public/data/lab-runs/
// war das öffentlich. Félix' Linie: Der Name darf vorkommen, Adresse und
// Telefonnummer nicht. Deshalb prüft dieser Test die Profil- und
// Absichtsfelder (intent, „Intent / Origin“, „Absicht“) auf:
//   - Telefonnummern,
//   - Postleitzahl mit Straße oder Hausnummer,
//   - einen Ort als Ausgangspunkt einer Person („ÖPNV von …“, „Name (Ort, …)“).
// Öffentliche Kontaktdaten von Organisationen in Quellenzitaten sind erlaubt,
// weil sie nicht in diesen Feldern stehen. Schlägt der Test bei einem neuen
// Lab-Import an: vor dem Import schwärzen.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(__dirname, '../..');

const TELEFON = /(?:\+49|0049)[\s/-]?\d[\d\s/-]{6,}\d|\b0(?:1[5-7]\d|[2-9]\d{1,4})[\s/-]?\d{3,}[\s/-]?\d{2,}\b/;
const STRASSE = /\b\d{5}\s+[A-ZÄÖÜ][\wäöüß-]+.{0,40}?\b[\wäöüß-]*(?:straße|strasse|weg|platz|allee|ring|gasse)\s+\d+|\b[\wäöüß-]*(?:straße|strasse|weg|platz|allee|ring|gasse)\s+\d+[a-z]?\s*,?\s*\d{5}\b/i;
// Ort als Ausgangspunkt einer Person, nicht als Thema
const WOHNORT = [/(?:ÖPNV|Bahn|Bus)\s+von\s+[A-ZÄÖÜ][\wäöüß-]+\b(?!\s+aus\s+erreichbar)/, /\(\s*[A-ZÄÖÜ][\wäöüß-]+,\s*Brandenburg\s*[·;]/];

/** Profil- und Absichtsfelder eines Lab-Belegs (JSON-Felder und Markdown-Zeilen). */
function profilTexte(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(/"intent"\s*:\s*"((?:[^"\\]|\\.)*)"/g)) out.push(m[1]);
  for (const m of text.matchAll(/(?:\*\*Intent \/ Origin:\*\*|Absicht:|Absicht „)([^\n]{0,600})/g)) out.push(m[1]);
  return out;
}

function belege(): string[] {
  const out: string[] = [];
  for (const dir of ['06-suche/proposals', '06-suche/lab-processing']) {
    const abs = resolve(ROOT, dir);
    if (!existsSync(abs)) continue;
    for (const f of readdirSync(abs)) if (/\.(json|md)$/.test(f)) out.push(join(dir, f));
  }
  for (const f of ['docs/lab-inbox-inventory.md', '06-suche/lab-intake-review-20261011.md']) if (existsSync(resolve(ROOT, f))) out.push(f);
  return out;
}

describe('Datenschutz: keine Adresse und keine Telefonnummer in Lab-Profilen', () => {
  const liste = belege();

  it('findet Lab-Belege mit Profilfeldern', () => {
    expect(liste.length).toBeGreaterThan(20);
    expect(liste.flatMap((f) => profilTexte(readFileSync(resolve(ROOT, f), 'utf8'))).length).toBeGreaterThan(20);
  });

  it.each([
    ['Telefonnummer', TELEFON],
    ['Postleitzahl mit Straße', STRASSE],
  ])('keine %s in Profil- oder Absichtsfeldern', (_name, muster) => {
    const treffer = liste.filter((f) => profilTexte(readFileSync(resolve(ROOT, f), 'utf8')).some((t) => muster.test(t)));
    expect(treffer).toEqual([]);
  });

  it('kein Wohnort als Ausgangspunkt einer Person', () => {
    const treffer = liste.filter((f) => {
      const text = readFileSync(resolve(ROOT, f), 'utf8');
      return WOHNORT.some((re) => re.test(text));
    });
    expect(treffer).toEqual([]);
  });

  it('die Muster erkennen, was sie sollen (Gegenprobe)', () => {
    expect(TELEFON.test('erreichbar unter 0170 1234567')).toBe(true);
    expect(TELEFON.test('Tel. +49 30 12345678')).toBe(true);
    expect(TELEFON.test('Umsatz 21.000 € im Jahr 2026')).toBe(false);
    expect(STRASSE.test('Musterweg 12, 15868 Musterdorf')).toBe(true);
    expect(STRASSE.test('15868 Musterdorf, Hauptstraße 3')).toBe(true);
    expect(STRASSE.test('§ 16 Abs. 2 SGB I')).toBe(false);
    expect(WOHNORT.some((re) => re.test('Märkte (erreichbar mit ÖPNV von Musterdorf)'))).toBe(true);
    expect(WOHNORT.some((re) => re.test('Félix (Musterdorf, Brandenburg · Berlin per Bahn)'))).toBe(true);
    expect(WOHNORT.some((re) => re.test('Ausflüge in die Lieberose Heide'))).toBe(false);
  });
});
