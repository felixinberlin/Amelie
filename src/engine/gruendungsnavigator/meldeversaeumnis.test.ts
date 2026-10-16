// Meldeversäumnis-Zähler: Fixtures aus den Primärtexten (Reviewer 14.10.2026,
// Primärprüfung 16.10.2026). Jede Fixture nennt ihre Quelle. Lizenz: CC0.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  zaehleMeldeversaeumnisse,
  PFLICHT_HINWEIS,
  ZAEHLER_VERBOTEN,
  type Ereignis,
  type TerminEreignis,
} from './meldeversaeumnis';
import { assertKeinVersprechen } from './gruendungsnavigator';

const ROOT = resolve(__dirname, '../../..');
const NORMEN = JSON.parse(readFileSync(resolve(ROOT, '07-demos/gruendungsnavigator/data/normen.json'), 'utf8')) as Record<string, unknown>;

const mv = (datum: string, x: Partial<TerminEreignis> = {}): TerminEreignis => ({ art: 'termin', datum, erschienen: false, grund: 'keiner', haerte: 'nein', neBelehrung: 'ja', ...x });
const da = (datum: string): TerminEreignis => ({ art: 'termin', datum, erschienen: true });
const eins = (e: Ereignis[], o = {}) => {
  const r = zaehleMeldeversaeumnisse(e, o);
  expect(r.szenarien).toHaveLength(1);
  return { r, s: r.szenarien[0], letzter: r.szenarien[0].schritte.at(-1)! };
};

describe('Fixtures aus BA-Weisung, Gesetz und Wuppertaler Arbeitshilfe', () => {
  it('F1 (FW Rz 32.5): MV, wahrgenommen, MV → 2. ist wiederholt, 30 %, Folge 1', () => {
    const { s, letzter } = eins([mv('2026-07-10'), da('2026-08-10'), mv('2026-09-10')]);
    expect(s.stand).toEqual({ zaehlung32: 2, folge7b: 1 });
    expect(letzter.rechtsfolge).toMatch(/30 % des Regelbedarfs für einen Monat/);
  });

  it('F2 (FW 7b.77 gegen AH Ziff. 6): Härte zählt nach § 32, bricht nach Weisung die Folge; Widerspruch gemeldet', () => {
    const { r, s } = eins([mv('2026-07-10'), mv('2026-08-10', { haerte: 'festgestellt' }), mv('2026-09-10')]);
    expect(s.schritte[1].rechtsfolge).toMatch(/keine Minderung/);
    expect(s.stand).toEqual({ zaehlung32: 3, folge7b: 1 });
    expect(s.schritte[2].rechtsfolge).toMatch(/30 %/);
    expect(r.konflikte.map((k) => k.thema)).toContain('Außergewöhnliche Härte und die Folge von drei Versäumnissen');
  });

  it('F3 (FW 32.6 gegen AH Ziff. 2): 10 Tage Unterbrechung → nach Weisung erstes MV, Widerspruch gemeldet', () => {
    const { r, s } = eins([mv('2026-07-10'), { art: 'unterbrechung', von: '2026-08-01', bis: '2026-08-10', wegen: 'sonstiges' }, mv('2026-09-10')]);
    expect(s.stand.zaehlung32).toBe(1);
    expect(s.schritte.at(-1)!.rechtsfolge).toMatch(/Erstes Meldeversäumnis/);
    const k = r.konflikte.find((x) => x.thema.startsWith('Unterbrechung'))!;
    expect(k.wuppertal).toMatch(/30 %/);
    expect(k.belege.join(' ')).toContain('BT-Drs. 21/3541');
  });

  it('F3 Gegenprobe: zwei Monate Unterbrechung → beide Lesarten gleich, kein Widerspruch', () => {
    const { r } = eins([mv('2026-07-10'), { art: 'unterbrechung', von: '2026-08-01', bis: '2026-09-30', wegen: 'sonstiges' }, mv('2026-10-10')]);
    expect(r.konflikte).toEqual([]);
  });

  it('F4 (FW 32.6 Abs. 8): Versagung nach § 66 SGB I → keine Neuzählung; Folge als ungeregelt gemeldet', () => {
    const { r, s } = eins([mv('2026-07-10'), { art: 'unterbrechung', von: '2026-08-01', bis: '2026-08-31', wegen: 'mitwirkung66' }, mv('2026-09-10')]);
    expect(s.stand.zaehlung32).toBe(2);
    expect(r.ungeregelt.join(' ')).toMatch(/§ 66 SGB I/);
  });

  it('F5/F6 (§ 65a Abs. 2, FW 32.29): Versäumnis vor dem 01.07. → altes Recht, zählt nicht mit', () => {
    const { s } = eins([mv('2026-06-20', { festgestelltAm: '2026-06-25' }), mv('2026-07-15')]);
    expect(s.schritte[0].rechtsfolge).toMatch(/alte Recht/);
    expect(s.stand.zaehlung32).toBe(1);
  });

  it('F23: vor dem 01.07. versäumt, aber erst danach festgestellt → ungeregelt gemeldet', () => {
    const { r } = eins([mv('2026-06-25', { festgestelltAm: '2026-07-10' }), mv('2026-07-20')]);
    expect(r.ungeregelt.join(' ')).toMatch(/Rz 32.29/);
  });

  it('F8 (§ 32 Abs. 3, § 31a Abs. 2 S. 3): drei in Folge mit Belehrung → keine 30 %, Nichterreichbarkeit prüfen, Anhörung', () => {
    const { letzter } = eins([mv('2026-07-10'), mv('2026-08-10'), mv('2026-09-10', { festgestelltAm: '2026-09-20' })]);
    expect(letzter.rechtsfolge).toMatch(/Nichterreichbarkeit/);
    expect(letzter.rechtsfolge).toMatch(/Keine 30-%-Minderung/);
    expect(letzter.rechtsfolge).toMatch(/Anhörung/);
    expect(letzter.ab).toBe('2026-10-01');
  });

  it('Drei in Folge ohne Belehrung über den Wegfall → keine Nichterreichbarkeit, 30 %', () => {
    const { letzter } = eins([mv('2026-07-10'), mv('2026-08-10'), mv('2026-09-10', { neBelehrung: 'nein' })]);
    expect(letzter.rechtsfolge).toMatch(/30 %/);
    expect(letzter.rechtsfolge).toMatch(/keine Nichterreichbarkeit/);
  });

  it('F10 (FW 7b.77 S. 3): nach 30 % Termin wahrgenommen → Folge 0, Zählung läuft weiter', () => {
    const { s } = eins([mv('2026-07-10'), mv('2026-08-10'), da('2026-09-10')]);
    expect(s.stand).toEqual({ zaehlung32: 2, folge7b: 0 });
  });

  it('F11 (AH Ziff. 4): Vorsprache ohne Einladung → zählt nicht als wahrgenommener Termin', () => {
    const { s } = eins([mv('2026-07-10'), mv('2026-08-10'), { art: 'vorsprache', datum: '2026-08-20', wie: 'persoenlich' }]);
    expect(s.stand.folge7b).toBe(2);
    expect(s.schritte.at(-1)!.quelle).toBe('oertlich');
  });

  it('F12 (AH Ziff. 4): Vorsprache vor der Feststellung des dritten → laut Arbeitshilfe keine NE, 30 %; ungeregelt gemeldet', () => {
    const { r, s } = eins([mv('2026-07-10'), mv('2026-08-10'), mv('2026-09-10', { festgestelltAm: '2026-09-25' }), { art: 'vorsprache', datum: '2026-09-15', wie: 'persoenlich' }]);
    const dritter = s.schritte.find((x) => x.datum === '2026-09-10')!;
    expect(dritter.rechtsfolge).toMatch(/keine Nichterreichbarkeit, stattdessen 30 %/);
    expect(dritter.quelle).toBe('oertlich');
    expect(r.ungeregelt.join(' ')).toMatch(/Rz 7b.79/);
  });

  it('F13 (§ 7b Abs. 4 S. 5, FW 7b.74/7b.85): persönliche Meldung im Warnmonat → durchgehend erreichbar, 30 %, Folge 0', () => {
    const { s } = eins([mv('2026-07-10'), mv('2026-08-10'), mv('2026-09-10', { festgestelltAm: '2026-09-20' }), { art: 'vorsprache', datum: '2026-10-05', wie: 'persoenlich' }]);
    const l = s.schritte.at(-1)!;
    expect(l.rechtsfolge).toMatch(/durchgehend erreichbar/);
    expect(l.rechtsfolge).toMatch(/30 %/);
    expect(s.stand.folge7b).toBe(0);
  });

  it('F14 (§ 7b Abs. 4 S. 2–4): Text nennt Monat ohne Regelbedarf, laufende Miete und das Ende des Bewilligungszeitraums', () => {
    const { letzter } = eins([mv('2026-07-10'), mv('2026-08-10'), mv('2026-09-10', { festgestelltAm: '2026-09-20' })], { bewilligungsEnde: '2027-02-28' });
    expect(letzter.rechtsfolge).toMatch(/ohne Regelbedarf/);
    expect(letzter.rechtsfolge).toMatch(/Miete, Heizung und Mehrbedarfe laufen weiter/);
    expect(letzter.rechtsfolge).toMatch(/28\.02\.2027/);
  });

  it('F14b (FW 7b.90): Meldung nach dem Warnmonat → Anspruch ab Vorsprache, Hinweis Ein-Personen-BG', () => {
    const { s } = eins([mv('2026-07-10'), mv('2026-08-10'), mv('2026-09-10', { festgestelltAm: '2026-09-20' }), { art: 'vorsprache', datum: '2026-11-12', wie: 'persoenlich' }]);
    expect(s.schritte.at(-1)!.rechtsfolge).toMatch(/ab dem Tag der Vorsprache/);
  });

  it('F15b (FW 7b.81 gegen AH Ziff. 7 b): Feststellung im letzten Monat des Bewilligungszeitraums → Widerspruch gemeldet', () => {
    const { r } = eins([mv('2026-10-01'), mv('2026-11-02'), mv('2026-12-01', { festgestelltAm: '2026-12-15' })], { bewilligungsEnde: '2026-12-31' });
    expect(r.konflikte.map((k) => k.thema)).toContain('Feststellung im letzten Monat des Bewilligungszeitraums');
  });

  it('F19 (FW 32.5, 7b.77): MV, wahrgenommen, MV, wahrgenommen, MV → 2. und 3. je 30 %, keine NE', () => {
    const { s } = eins([mv('2026-07-10'), da('2026-08-01'), mv('2026-08-10'), da('2026-09-01'), mv('2026-09-10')]);
    const mvs = s.schritte.filter((x) => x.was.includes('versäumt'));
    expect(mvs[1].rechtsfolge).toMatch(/30 %/);
    expect(mvs[2].rechtsfolge).toMatch(/30 %/);
    expect(s.schritte.some((x) => /Nichterreichbarkeit prüft/.test(x.rechtsfolge))).toBe(false);
  });

  it('F20 (§ 31b Abs. 1): Feststellung nach mehr als sechs Monaten → Hinweis und ungeregelt', () => {
    const { r, s } = eins([mv('2026-07-10'), mv('2026-08-10', { festgestelltAm: '2027-03-01' })]);
    expect(s.schritte.at(-1)!.rechtsfolge).toMatch(/sechs Monate/);
    expect(r.ungeregelt.join(' ')).toMatch(/sechs Monaten/);
  });

  it('F21 (§ 31b Abs. 1, § 37 Abs. 2 SGB X, FW 31.49): zur Post 29.05. → ab 01.07.; 27.05. → ab 01.06.', () => {
    const a = eins([mv('2026-07-10'), mv('2026-08-10', { zurPostAm: '2026-08-29' })]).letzter;
    expect(a.rechtsfolge).toContain('02.09.2026');
    expect(a.ab).toBe('2026-10-01');
    const b = eins([mv('2026-07-10'), mv('2026-08-10', { zurPostAm: '2026-08-27' })]).letzter;
    expect(b.ab).toBe('2026-09-01');
  });

  it('F22 (FW 7b.80): drittes MV am 07.10., Feststellung im Oktober → Wegfall ab 01.11.', () => {
    const { letzter } = eins([mv('2026-08-05'), mv('2026-09-05'), mv('2026-10-07', { festgestelltAm: '2026-10-20' })]);
    expect(letzter.ab).toBe('2026-11-01');
  });

  it('F24 (FW 7b.78): Termine bei verschiedenen Stellen zählen in einer Folge', () => {
    // Der Zähler kennt keine Stellen: drei Termine sind drei Termine
    const { s } = eins([mv('2026-07-10'), mv('2026-08-10'), mv('2026-09-10')]);
    expect(s.stand.folge7b).toBe(3);
  });

  it('F25 (FW 7b.77 Bsp. 1): MV, MV, MV mit wichtigem Grund, MV → 4. wiederholt, 30 %, Folge 1', () => {
    const { s } = eins([mv('2026-07-10'), mv('2026-08-10'), mv('2026-09-10', { grund: 'anerkannt' }), mv('2026-10-10')]);
    expect(s.stand).toEqual({ zaehlung32: 3, folge7b: 1 });
    expect(s.schritte.at(-1)!.rechtsfolge).toMatch(/30 %/);
  });

  it('F26 (FW 7b.84): Meldung nur am Sicherheitsdienst, telefonisch, per E-Mail oder online gilt nicht', () => {
    for (const wie of ['sicherheitsdienst', 'telefon', 'email', 'online'] as const) {
      const { s } = eins([mv('2026-07-10'), mv('2026-08-10'), mv('2026-09-10', { festgestelltAm: '2026-09-20' }), { art: 'vorsprache', datum: '2026-10-05', wie }]);
      expect(s.schritte.at(-1)!.rechtsfolge).toMatch(/nicht als persönliche Meldung/);
    }
  });
});

describe('Offene Eingaben und Gegenproben', () => {
  it('G1: wichtiger Grund „offen“ → zwei Szenarien, der Zähler sagt nicht, welches gilt', () => {
    const r = zaehleMeldeversaeumnisse([mv('2026-07-10'), mv('2026-08-10', { grund: 'offen' })]);
    expect(r.szenarien).toHaveLength(2);
    const [schlecht, gut] = r.szenarien;
    expect(schlecht.schritte.at(-1)!.rechtsfolge).toMatch(/30 %/);
    expect(gut.schritte.at(-1)!.rechtsfolge).toMatch(/keine Minderung/);
  });

  it('Belehrung unbekannt → beide Szenarien, einmal mit Nichterreichbarkeit', () => {
    const r = zaehleMeldeversaeumnisse([mv('2026-07-10'), mv('2026-08-10'), mv('2026-09-10', { neBelehrung: 'unbekannt' })]);
    expect(r.szenarien).toHaveLength(2);
    expect(r.szenarien[0].schritte.at(-1)!.rechtsfolge).toMatch(/Nichterreichbarkeit/);
    expect(r.szenarien[1].schritte.at(-1)!.rechtsfolge).toMatch(/keine Nichterreichbarkeit/);
  });

  it('Reihenfolge der Eingabe spielt keine Rolle', () => {
    const a = zaehleMeldeversaeumnisse([mv('2026-07-10'), da('2026-08-01'), mv('2026-09-10')]);
    const b = zaehleMeldeversaeumnisse([mv('2026-09-10'), mv('2026-07-10'), da('2026-08-01')]);
    expect(b).toEqual(a);
  });

  it.each([
    [[mv('10.07.2026')]],
    [[mv('2026-02-30')]],
    [[{ art: 'unterbrechung', von: '2026-09-10', bis: '2026-09-01', wegen: 'sonstiges' } as Ereignis]],
  ])('ungültige Eingabe wirft statt zu raten (%#)', (e) => {
    expect(() => zaehleMeldeversaeumnisse(e as Ereignis[])).toThrow();
  });

  it('jedes Ergebnis enthält den Pflichtsatz zur persönlichen Meldung, auch ohne Ereignisse', () => {
    expect(zaehleMeldeversaeumnisse([]).hinweise).toContain(PFLICHT_HINWEIS);
    expect(zaehleMeldeversaeumnisse([da('2026-08-01')]).hinweise).toContain(PFLICHT_HINWEIS);
  });

  it('Sprachwächter: kein Ausgabetext sagt „kein Risiko“, „Sie müssen nicht“ oder verspricht etwas', () => {
    const faelle: Ereignis[][] = [
      [mv('2026-07-10'), mv('2026-08-10'), mv('2026-09-10', { festgestelltAm: '2026-09-20' }), { art: 'vorsprache', datum: '2026-10-05', wie: 'persoenlich' }],
      [mv('2026-07-10', { grund: 'offen', haerte: 'offen', neBelehrung: 'unbekannt' }), da('2026-08-01')],
      [mv('2026-06-01'), { art: 'unterbrechung', von: '2026-07-01', bis: '2026-07-05', wegen: 'mitwirkung66' }],
    ];
    for (const f of faelle) {
      const text = JSON.stringify(zaehleMeldeversaeumnisse(f)).toLowerCase();
      for (const w of ZAEHLER_VERBOTEN) expect(text, w).not.toContain(w);
      expect(() => assertKeinVersprechen(text)).not.toThrow();
    }
  });

  it('Gegenprobe Sprachwächter: ein verbotener Satz würde gefunden', () => {
    expect(ZAEHLER_VERBOTEN.some((w) => 'Es besteht kein Risiko.'.toLowerCase().includes(w))).toBe(true);
  });

  it('jede genannte Norm steht im Register', () => {
    const r = zaehleMeldeversaeumnisse([mv('2026-07-10'), mv('2026-08-10', { zurPostAm: '2026-08-29', festgestelltAm: '2027-03-01' }), mv('2026-09-10', { festgestelltAm: '2026-09-20' }), { art: 'unterbrechung', von: '2026-10-01', bis: '2026-10-05', wegen: 'mitwirkung66' }]);
    for (const s of r.szenarien) for (const x of s.schritte) for (const n of x.normen) expect(NORMEN, n).toHaveProperty(n);
  });
});
