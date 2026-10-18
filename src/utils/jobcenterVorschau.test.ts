// Wächter für die Vorschau public/gruendungsnavigator/index.html.
// Das Werkzeug selbst ist seit 18.10.2026 privat (wird eine App); die Vorschau
// rechnet die Widerspruchsfrist und zitiert drei Normen. Getestet wird der
// Fristkern direkt aus dem HTML, damit Seite und Test nicht auseinanderlaufen.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const DIR = resolve(__dirname, '../../public/gruendungsnavigator');
const html = readFileSync(resolve(DIR, 'index.html'), 'utf8');

interface Ergebnis { bekanntgabe: string; bekanntgabeAmWochenende: boolean; ende: string; verschobenVon: string | null; norm: string }
interface Kern {
  plusMonate(d: string, n: number): string;
  ostern(j: number): string;
  feiertage(j: number, land?: string): string[];
  widerspruchsfrist(e: { datum: string; weg: 'post' | 'hand'; land?: string; ohneBelehrung?: boolean }): Ergebnis | null;
}

const kernQuelle = /<script id="frist-kern">([\s\S]*?)<\/script>/.exec(html)?.[1] ?? '';
const kern = new Function(`${kernQuelle}; return FristKern;`)() as Kern;

describe('Jobcenter-Vorschau: Fristkern', () => {
  it('Monatsende nach § 188 BGB', () => {
    expect(kern.plusMonate('2026-01-31', 1)).toBe('2026-02-28');
    expect(kern.plusMonate('2028-01-31', 1)).toBe('2028-02-29');
    expect(kern.plusMonate('2026-03-15', 1)).toBe('2026-04-15');
  });

  it('Osterformel', () => {
    expect(kern.ostern(2026)).toBe('2026-04-05');
    expect(kern.ostern(2027)).toBe('2027-03-28');
  });

  it('Landesfeiertage', () => {
    expect(kern.feiertage(2026, 'BE')).toContain('2026-03-08');
    expect(kern.feiertage(2026, 'BY')).not.toContain('2026-03-08');
    expect(kern.feiertage(2026, 'NW')).toContain('2026-06-04'); // Fronleichnam
    expect(kern.feiertage(2026, 'SN')).toContain('2026-11-18'); // Buß- und Bettag
    expect(kern.feiertage(2026, 'BY')).not.toContain('2026-08-15'); // nur regional
  });

  it('Post: vierter Tag nach Aufgabe, dann ein Monat', () => {
    const r = kern.widerspruchsfrist({ datum: '2026-10-05', weg: 'post' })!;
    expect(r.bekanntgabe).toBe('2026-10-09');
    expect(r.ende).toBe('2026-11-09');
    expect(r.verschobenVon).toBeNull();
    expect(r.norm).toBe('§ 84 Abs. 1 SGG');
  });

  it('Fristende am Wochenende verschiebt auf Montag (§ 64 Abs. 3 SGG)', () => {
    // Übergabe Do 05.11.2026 → rechnerisch Sa 05.12.2026 → Mo 07.12.2026
    const r = kern.widerspruchsfrist({ datum: '2026-11-05', weg: 'hand' })!;
    expect(r.verschobenVon).toBe('2026-12-05');
    expect(r.ende).toBe('2026-12-07');
  });

  it('Landesfeiertag verschiebt nur im eigenen Land', () => {
    // Übergabe 08.02.2027 → 08.03.2027 (Mo, Frauentag in Berlin)
    expect(kern.widerspruchsfrist({ datum: '2027-02-08', weg: 'hand', land: 'BE' })!.ende).toBe('2027-03-09');
    expect(kern.widerspruchsfrist({ datum: '2027-02-08', weg: 'hand', land: 'HE' })!.ende).toBe('2027-03-08');
  });

  it('Bekanntgabe am Wochenende wird nicht verschoben, aber gemeldet', () => {
    // Aufgabe Di 13.10.2026 → vierter Tag Sa 17.10.2026
    const r = kern.widerspruchsfrist({ datum: '2026-10-13', weg: 'post' })!;
    expect(r.bekanntgabe).toBe('2026-10-17');
    expect(r.bekanntgabeAmWochenende).toBe(true);
    expect(r.ende).toBe('2026-11-17');
  });

  it('Ohne Rechtsbehelfsbelehrung ein Jahr (§ 66 Abs. 2 SGG)', () => {
    const r = kern.widerspruchsfrist({ datum: '2026-10-05', weg: 'hand', ohneBelehrung: true })!;
    expect(r.ende).toBe('2027-10-05');
    expect(r.norm).toBe('§ 66 Abs. 2 SGG');
  });

  it('Ungültige Eingabe ergibt nichts', () => {
    expect(kern.widerspruchsfrist({ datum: '', weg: 'post' })).toBeNull();
    expect(kern.widerspruchsfrist({ datum: '2026-02-30', weg: 'post' })).toBeNull();
  });
});

describe('Jobcenter-Vorschau: Seite', () => {
  it('Wortlaut-Zitate stimmen mit dem geprüften Normregister überein', () => {
    // Stand normen.json im Werkzeug-Repo, Zitat-Abgleich vom 16.10.2026
    for (const satz of [
      'Anträge, die bei einem unzuständigen Leistungsträger, bei einer für die Sozialleistung nicht zuständigen Gemeinde oder bei einer amtlichen Vertretung der Bundesrepublik Deutschland im Ausland gestellt werden, sind unverzüglich an den zuständigen Leistungsträger weiterzuleiten.',
      'Die Behörde darf die Entgegennahme von Erklärungen oder Anträgen, die in ihren Zuständigkeitsbereich fallen, nicht deshalb verweigern, weil sie die Erklärung oder den Antrag in der Sache für unzulässig oder unbegründet hält.',
      'Die Behörde hat den Beteiligten Einsicht in die das Verfahren betreffenden Akten zu gestatten, soweit deren Kenntnis zur Geltendmachung oder Verteidigung ihrer rechtlichen Interessen erforderlich ist.',
    ]) expect(html).toContain(`„${satz}“`);
  });

  it('Transparenz und Grenze sind sichtbar', () => {
    expect(html).toContain('Keine Rechtsberatung');
    expect(html).toContain('zur Laufzeit keine KI');
    expect(html).toContain('Nicht geprüft:');
  });

  it('keine toten Links ins private Werkzeug-Repo, Deep-Link zur Dose', () => {
    for (const f of ['index.html', 'fall-landkarte.html', 'jobcenter-hilfe.html']) {
      expect(readFileSync(resolve(DIR, f), 'utf8')).not.toMatch(/felixinberlin\.github\.io\/jobcenter-hilfe|github\.com\/felixinberlin\/jobcenter-hilfe/);
    }
    expect(html).toContain('https://felixinberlin.github.io/Amelie/#dose=gruendungsnavigator');
  });

  it('keine externen Skripte, kein Speichern', () => {
    expect(html).not.toMatch(/<script[^>]+src=/);
    expect(html).not.toMatch(/localStorage|fetch\(/);
  });
});
