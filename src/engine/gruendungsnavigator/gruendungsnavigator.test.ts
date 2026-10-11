// Gründungsnavigator — Vitest-Suite. Lizenz: CC0 1.0 Public Domain.
//
// Zwei Teile: der reine Kern (Fristen, Freibetrag, Reihenfolge, Sprache) und
// Drift-Wächter über die ausgelieferten Demo-Seiten in public/gruendungsnavigator/.
// Die Demo-Daten werden aus dem HTML gelesen, damit Seite und Kern nicht
// auseinanderlaufen.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  plusMonate,
  plusTage,
  ostersonntag,
  bundesFeiertage,
  istWerktag,
  naechsterWerktag,
  berechneFristen,
  erwerbstaetigenFreibetrag,
  pruefeReihenfolge,
  normstandVeraltet,
  pruefeBaum,
  geheBaum,
  assertKeinVersprechen,
  parseIso,
  GELTUNGSGRENZE_DE,
  GELTUNGSGRENZE_EN,
  RECHTSSTAND,
  type BaumSchritt,
} from './gruendungsnavigator';

const ROOT = resolve(__dirname, '../../..');
const NAV = readFileSync(resolve(ROOT, 'public/gruendungsnavigator/index.html'), 'utf8');
const KARTE = readFileSync(resolve(ROOT, 'public/gruendungsnavigator/fall-landkarte.html'), 'utf8');

/** Liest `const NAME = …;` aus einem Script-Block der Demo, mit den davor definierten Konstanten. */
function demoKonstante<T>(html: string, name: string, prelude: string): T {
  const start = html.indexOf(`const ${name} = `);
  if (start < 0) throw new Error(`Konstante ${name} fehlt in der Demo`);
  const ab = start + `const ${name} = `.length;
  // Ende: die erste Zeile, die mit "];" oder "};" schließt
  const ende = html.slice(ab).search(/\n[\]}];/);
  const literal = html.slice(ab, ab + ende + 3).replace(/;$/, '');
  return new Function(`${prelude}; return (${literal});`)() as T;
}

type Norm = { t: string; n: string; u: string; d?: string; q?: string; k?: string };
const PRE_NAV = 'const G = "https://www.gesetze-im-internet.de/";';
const PRE_KARTE = 'const G = "https://www.gesetze-im-internet.de/", D = "https://dejure.org/gesetze/";';

const LAW = demoKonstante<Record<string, Norm>>(NAV, 'LAW', PRE_NAV);
const STEPS = demoKonstante<BaumSchritt[]>(NAV, 'STEPS', PRE_NAV);
const QA = demoKonstante<{ c: string; q: string; a: string; laws: string[] }[]>(NAV, 'QA', PRE_NAV);
const RIGHTS = demoKonstante<{ id: string; q: string; say: string; laws: string[]; pl?: string[] }[]>(NAV, 'RIGHTS', PRE_NAV);
const L = demoKonstante<Record<string, Norm>>(KARTE, 'L', PRE_KARTE);
const FRISTEN = demoKonstante<{ f: string; law: string }[]>(KARTE, 'FRISTEN', PRE_KARTE);
const PH = demoKonstante<{ id: string; qs: { q: string; a: unknown[] }[] }[]>(KARTE, 'PH', PRE_KARTE);

// ------------------------------------------------------------------ Datum

describe('Datumsrechnung (§ 188 BGB, § 64 SGG)', () => {
  it.each([
    ['2026-01-15', 1, '2026-02-15'],
    ['2026-01-31', 1, '2026-02-28'],
    ['2028-01-31', 1, '2028-02-29'], // Schaltjahr
    ['2026-03-31', 1, '2026-04-30'],
    ['2026-08-31', 6, '2027-02-28'],
    ['2027-02-28', 12, '2028-02-28'],
    ['2028-02-29', 12, '2029-02-28'], // Schalttag + 1 Jahr
    ['2026-11-30', 3, '2027-02-28'],
    ['2026-12-15', 1, '2027-01-15'], // Jahreswechsel
  ])('%s + %i Monate = %s', (von, n, soll) => {
    expect(plusMonate(von, n)).toBe(soll);
  });

  it('lehnt ungültige Daten ab', () => {
    expect(() => parseIso('2026-02-30')).toThrow();
    expect(() => parseIso('11.10.2026')).toThrow();
  });

  it('Ostersonntag bekannter Jahre', () => {
    expect(ostersonntag(2026)).toBe('2026-04-05');
    expect(ostersonntag(2027)).toBe('2027-03-28');
    expect(ostersonntag(2028)).toBe('2028-04-16');
  });

  it('bundesweite Feiertage 2026', () => {
    expect(bundesFeiertage(2026)).toEqual([
      '2026-01-01', '2026-04-03', '2026-04-06', '2026-05-01', '2026-05-14', '2026-05-25', '2026-10-03', '2026-12-25', '2026-12-26',
    ]);
  });

  it('Werktage und Verschiebung', () => {
    expect(istWerktag('2026-10-12')).toBe(true); // Montag
    expect(istWerktag('2026-10-10')).toBe(false); // Samstag
    expect(istWerktag('2026-10-03')).toBe(false); // Tag der Deutschen Einheit
    expect(naechsterWerktag('2026-10-10')).toBe('2026-10-12');
    expect(naechsterWerktag('2026-12-25')).toBe('2026-12-28'); // Fr Feiertag, Sa 26. Feiertag, So
    expect(naechsterWerktag('2027-03-08', ['2027-03-08'])).toBe('2027-03-09'); // Berlin, Frauentag
    expect(plusTage('2026-12-31', 1)).toBe('2027-01-01');
  });
});

// ------------------------------------------------------------------ Fristen

describe('Fristen', () => {
  it('Widerspruch: ein Monat, auf Werktag verschoben', () => {
    // Bekanntgabe Do 08.10.2026 → 08.11.2026 ist Sonntag → Mo 09.11.
    const f = berechneFristen({ bescheidBekanntgabe: '2026-10-08' });
    const w = f.find((x) => x.id === 'widerspruch')!;
    expect(w.datum).toBe('2026-11-09');
    expect(w.verschobenVon).toBe('2026-11-08');
    expect(w.normId).toBe('sgg84');
  });

  it('Widerspruch ohne Belehrung: ein Jahr (§ 66 SGG)', () => {
    const w = berechneFristen({ bescheidBekanntgabe: '2026-10-12', mitRechtsbehelfsbelehrung: false }).find((x) => x.id === 'widerspruch')!;
    expect(w.datum).toBe('2027-10-12');
    expect(w.normId).toBe('sgg66');
  });

  it('Klage: ein Monat nach Widerspruchsbescheid, plus Hinweis zu Nachweisen', () => {
    const f = berechneFristen({ widerspruchsbescheidBekanntgabe: '2026-12-01' });
    expect(f.find((x) => x.id === 'klage')!.datum).toBe('2027-01-04'); // 01.01. Feiertag, 02./03. Wochenende
    expect(f.find((x) => x.id === 'eks-nachweise')!.normId).toBe('sgb2_41a');
  });

  it('Untätigkeit: frühestens am Tag nach sechs bzw. drei Monaten', () => {
    const f = berechneFristen({ antrag: '2026-10-11', widerspruch: '2026-11-30' });
    expect(f.find((x) => x.id === 'untaetigkeit-antrag')!.datum).toBe('2027-04-12');
    expect(f.find((x) => x.id === 'untaetigkeit-widerspruch')!.datum).toBe('2027-03-01');
  });

  it('Gründung: Gewerbeanzeige am selben Tag, Finanzamt binnen eines Monats', () => {
    const f = berechneFristen({ antrag: '2026-10-01', gruendung: '2026-11-02' });
    expect(f.find((x) => x.id === 'gewerbeanzeige')!.datum).toBe('2026-11-02');
    expect(f.find((x) => x.id === 'finanzamt')!.datum).toBe('2026-12-02');
    expect(f.some((x) => x.id === 'antrag-nach-gruendung')).toBe(false);
  });

  it('warnt, wenn die Gründung vor dem Antrag lag (§ 37 Abs. 2 SGB II)', () => {
    const f = berechneFristen({ antrag: '2026-11-10', gruendung: '2026-11-02' });
    const h = f[0];
    expect(h.id).toBe('antrag-nach-gruendung');
    expect(h.art).toBe('hinweis');
    expect(h.normId).toBe('sgb2_37');
  });

  it('Prüfung der Selbständigkeit nach einem Jahr, auch im Schaltjahr', () => {
    expect(berechneFristen({ bezugsbeginn: '2027-02-28' })[0].datum).toBe('2028-02-28');
    expect(berechneFristen({ bezugsbeginn: '2028-02-29' })[0].datum).toBe('2029-02-28');
  });

  it('Einstiegsgeld: höchstens 24 Monate', () => {
    expect(berechneFristen({ einstiegsgeldBeginn: '2026-11-01' })[0].datum).toBe('2028-10-31');
  });

  it('vorläufige Leistungen gelten nach einem Jahr als festgesetzt', () => {
    expect(berechneFristen({ bewilligungsEnde: '2027-04-30' })[0].datum).toBe('2028-04-30');
  });

  it('ohne Daten keine Fristen, nichts geschätzt', () => {
    expect(berechneFristen({})).toEqual([]);
  });

  it('Ausgabe ist nach Datum sortiert, Hinweise zuerst', () => {
    const f = berechneFristen({
      antrag: '2026-11-10', gruendung: '2026-11-02', bescheidBekanntgabe: '2026-12-01',
      bezugsbeginn: '2026-07-01', einstiegsgeldBeginn: '2026-12-01',
    });
    expect(f[0].art).toBe('hinweis');
    const daten = f.filter((x) => x.datum).map((x) => x.datum!);
    expect([...daten].sort()).toEqual(daten);
  });
});

// ------------------------------------------------------------------ Reihenfolge, Freibetrag, Normstand

describe('Reihenfolge Antrag/Start', () => {
  it.each([
    ['2026-10-01', '2026-11-01', 'antrag-vor-start'],
    ['2026-11-01', '2026-11-01', 'gleicher-tag'],
    ['2026-11-02', '2026-11-01', 'start-vor-antrag'],
    [undefined, '2026-11-01', 'unbekannt'],
    ['2026-11-01', undefined, 'unbekannt'],
  ])('Antrag %s, Start %s → %s', (a, s, soll) => {
    expect(pruefeReihenfolge(a, s).ergebnis).toBe(soll);
  });
});

describe('Erwerbstätigenfreibetrag (§ 11b Abs. 2, 3 SGB II)', () => {
  it.each([
    [0, 0],
    [80, 80],
    [100, 100],
    [520, 184],
    [1000, 328],
    [1200, 348],
    [2000, 348],
  ])('Einkommen %i € → Freibetrag %i €', (ek, soll) => {
    expect(erwerbstaetigenFreibetrag(ek).summe).toBe(soll);
  });

  it('mit Kind bis 1.500 €: höchstens 378 €', () => {
    expect(erwerbstaetigenFreibetrag(1500, true).summe).toBe(378);
    expect(erwerbstaetigenFreibetrag(3000, true).summe).toBe(378);
  });

  it('angerechnet = Einkommen minus Freibetrag', () => {
    expect(erwerbstaetigenFreibetrag(800).angerechnet).toBe(800 - (100 + 84 + 84));
  });

  it('der Wert deckt sich mit der Kurzfassung der Demo', () => {
    expect(L.sgb2_11b.k).toContain('348 €');
    expect(LAW.sgb2_11b.k).toContain('348 €');
  });

  it('lehnt negative Werte ab', () => {
    expect(() => erwerbstaetigenFreibetrag(-1)).toThrow();
  });
});

describe('Normstand', () => {
  it('ist am Prüftag und elf Monate später aktuell, nach zwölf Monaten veraltet', () => {
    expect(RECHTSSTAND.geprueftAm).toBe('2026-10-11');
    expect(normstandVeraltet('2026-10-11')).toBe(false);
    expect(normstandVeraltet('2027-09-11')).toBe(false);
    expect(normstandVeraltet('2027-10-12')).toBe(true);
  });
});

// ------------------------------------------------------------------ Sprache

describe('Sprachwächter', () => {
  it('erkennt Versprechen', () => {
    expect(() => assertKeinVersprechen('Sie bekommen das Einstiegsgeld garantiert.')).toThrow();
    expect(() => assertKeinVersprechen('Das ist unzulässig.')).toThrow();
  });

  it('keine Ausgabe des Kerns verspricht eine Förderung', () => {
    const f = berechneFristen({
      antrag: '2026-11-10', gruendung: '2026-11-02', bescheidBekanntgabe: '2026-12-01', mitRechtsbehelfsbelehrung: false,
      widerspruch: '2026-12-10', widerspruchsbescheidBekanntgabe: '2027-02-01', bezugsbeginn: '2026-07-01',
      einstiegsgeldBeginn: '2026-12-01', bewilligungsEnde: '2027-05-31',
    });
    expect(f.length).toBe(11);
    for (const x of f) {
      for (const t of [x.titelDe, x.titelEn, x.begruendungDe, x.begruendungEn]) expect(() => assertKeinVersprechen(t)).not.toThrow();
    }
    expect(() => assertKeinVersprechen(GELTUNGSGRENZE_DE)).not.toThrow();
    expect(GELTUNGSGRENZE_EN).toMatch(/not legal advice/);
  });
});

// ------------------------------------------------------------------ Demo-Drift

describe('Demo: Gesprächsnavigator (index.html)', () => {
  it('Umfang: 7 Fragen, 23 Antworten, 42 Fragen, 30 Rechte-Karten, davon 9 zu Zuständigkeit', () => {
    expect(STEPS.length).toBe(7);
    expect(STEPS.reduce((n, s) => n + s.answers.length, 0)).toBe(23);
    expect(QA.length).toBe(42);
    expect(RIGHTS.length).toBe(30);
    expect(RIGHTS.filter((r) => (r as { g?: string }).g === 'z' || ['zustaendig', 'einarbeiten'].includes(r.id)).length).toBe(9);
  });

  it('der Telefonbaum ist strukturell gesund', () => {
    expect(pruefeBaum(STEPS, Object.keys(LAW))).toEqual([]);
  });

  it('pruefeBaum meldet kaputte Bäume', () => {
    const kaputt: BaumSchritt[] = [
      { id: 'x1', q: '?', answers: [{ k: 'a', t: 'A', say: 'x', laws: ['gibtsnicht'], next: 5 }, { k: 'a', t: 'B', say: '', laws: [] }] },
      { id: 'x2', q: '?', answers: [{ k: 'a', t: 'A', say: 'x', laws: [], end: true }] },
    ];
    const p = pruefeBaum(kaputt, []);
    expect(p).toEqual(expect.arrayContaining([
      'x1: doppelte Antwortschlüssel',
      'x1/a: next=5 außerhalb',
      'x1/a: unbekannte Norm "gibtsnicht"',
      'x1/a: weder end noch next',
      'x1/a: leere Formulierung',
      'x2: unerreichbar',
    ]));
  });

  it('jeder Weg durch den Baum endet und sammelt Normen', () => {
    // Alle Kombinationen: höchstens 3*3*4*3*3*4*3 Wege, alle müssen enden (end oder letzter Schritt)
    let wege = 0;
    const rek = (i: number, wahl: Record<string, string>) => {
      if (i >= STEPS.length) {
        const r = geheBaum(STEPS, wahl);
        expect(r.pfad.length).toBeGreaterThan(0);
        wege++;
        return;
      }
      for (const a of STEPS[i].answers) {
        const w = { ...wahl, [STEPS[i].id]: a.k };
        if (a.end) {
          const r = geheBaum(STEPS, w);
          expect(r.endeBei).toBe(STEPS[i].id);
          wege++;
        } else rek(a.next!, w);
      }
    };
    rek(0, {});
    expect(wege).toBeGreaterThan(100);
    const r = geheBaum(STEPS, { s1: 'b' });
    expect(r).toEqual({ pfad: ['s1:b'], normen: ['sgb1_14'], endeBei: 's1' });
  });

  it('alle Normverweise in Fragen und Rechte-Karten lösen im Register auf', () => {
    const ids = new Set(Object.keys(LAW));
    for (const q of QA) for (const l of q.laws) expect(ids.has(l), `QA "${q.q}" → ${l}`).toBe(true);
    for (const r of RIGHTS) for (const l of [...r.laws, ...(r.pl ?? [])]) expect(ids.has(l), `Karte ${r.id} → ${l}`).toBe(true);
  });

  it('jede Norm hat Titel, Link und genau eine Kennzeichnung: Wortlaut (q) oder Kurzfassung (k)', () => {
    for (const [id, n] of Object.entries(LAW)) {
      expect(n.t, id).toMatch(/^§ /);
      expect(n.u, id).toMatch(/^https:\/\/www\.gesetze-im-internet\.de\//);
      expect(Boolean(n.q) !== Boolean(n.k), `${id}: q xor k`).toBe(true);
    }
  });

  it('keine Formulierung der Demo verspricht eine Förderung', () => {
    for (const s of STEPS) for (const a of s.answers) expect(() => assertKeinVersprechen(a.say), `${s.id}/${a.k}`).not.toThrow();
    for (const r of RIGHTS) expect(() => assertKeinVersprechen(r.say), r.id).not.toThrow();
  });
});

describe('Demo: Fall-Landkarte (fall-landkarte.html)', () => {
  it('37 Normen, jede mit gesetze-im-internet- und dejure-Link und genau einer Kennzeichnung', () => {
    expect(Object.keys(L).length).toBe(37);
    for (const [id, n] of Object.entries(L)) {
      expect(n.u, id).toMatch(/^https:\/\/www\.gesetze-im-internet\.de\//);
      expect(n.d, id).toMatch(/^https:\/\/dejure\.org\/gesetze\//);
      expect(Boolean(n.q) !== Boolean(n.k), `${id}: q xor k`).toBe(true);
    }
  });

  it('jede Norm-ID, die der Kern ausgibt, steht im Register der Fall-Landkarte', () => {
    const f = berechneFristen({
      antrag: '2026-11-10', gruendung: '2026-11-02', bescheidBekanntgabe: '2026-12-01',
      widerspruch: '2026-12-10', widerspruchsbescheidBekanntgabe: '2027-02-01', bezugsbeginn: '2026-07-01',
      einstiegsgeldBeginn: '2026-12-01', bewilligungsEnde: '2027-05-31',
    });
    const ohneBelehrung = berechneFristen({ bescheidBekanntgabe: '2026-12-01', mitRechtsbehelfsbelehrung: false });
    for (const x of [...f, ...ohneBelehrung]) expect(L[x.normId], x.normId).toBeDefined();
  });

  it('der Fristen-Zeitstrahl verweist nur auf vorhandene Normen', () => {
    for (const fr of FRISTEN) expect(L[fr.law], fr.f).toBeDefined();
  });

  it('wörtliche Zitate widersprechen sich zwischen beiden Seiten nicht', () => {
    // Die Seiten zitieren unterschiedlich lange Ausschnitte; jedes Bruchstück
    // eines Zitats muss im Zitat der anderen Seite wörtlich vorkommen
    // (Anlass: § 10 stand einmal als „selbständig“, einmal als „selbstständig“).
    const stuecke = (q: string) =>
      q.split(/\[…\]|…|\[[^\]]*\]/).map((s) => s.trim().replace(/^[,.;: ]+|[,.;: ]+$/g, '')).filter((s) => s.length > 8);
    let verglichen = 0;
    for (const id of Object.keys(LAW)) {
      const a = LAW[id].q;
      const b = L[id]?.q;
      if (!a || !b) continue;
      const [kurz, lang] = a.length <= b.length ? [a, b] : [b, a];
      for (const s of stuecke(kurz)) {
        if (lang.includes(s.slice(0, 20))) {
          expect(lang, id).toContain(s);
          verglichen++;
        }
      }
    }
    expect(verglichen).toBeGreaterThan(5);
  });
});

// ------------------------------------------------------------------ Zahlen in den Texten

describe('Zahlen-Wächter: Texte nennen die Zahlen der ausgelieferten Seiten', () => {
  // Anlass 11.10.2026: Konzept sagte 26 Fragen und 15 Rechte-Karten, die Seite hatte 42 und 17.
  // Jede Zahl vor „Fragen“, „Rechte-Karten“, „Normen“ oder „Antworten“ muss eine echte Zahl der Seiten sein.
  const kartenFragen = PH.reduce((n, p) => n + p.qs.length, 0);
  const kartenAntworten = PH.reduce((n, p) => n + p.qs.reduce((m, q) => m + q.a.length, 0), 0);
  const erlaubt: Record<string, Set<number>> = {
    Fragen: new Set([STEPS.length, QA.length, kartenFragen]),
    'Rechte-Karten': new Set([RIGHTS.length]),
    Normen: new Set([Object.keys(L).length]),
    Antworten: new Set([STEPS.reduce((n, s) => n + s.answers.length, 0), kartenAntworten]),
    questions: new Set([STEPS.length, QA.length, kartenFragen]),
    'rights cards': new Set([RIGHTS.length]),
    statutes: new Set([Object.keys(L).length]),
    answers: new Set([STEPS.reduce((n, s) => n + s.answers.length, 0), kartenAntworten]),
    replies: new Set([RIGHTS.length]),
  };
  const DOKUMENTE = [
    '07-demos/gruendungsnavigator/README.md',
    '05-dosen/gruendungsnavigator.md',
    'en/05-dosen/gruendungsnavigator.md',
    '02-recherche/gruendungsnavigator-konzept-2026-10-11.md',
    'src/data/dosen.ts',
    'src/data/doseSimulators.ts',
    'src/components/simulators/GruendungsnavigatorSimulator.tsx',
  ];
  // „42 Fragen“, „42 wahrscheinliche Fragen“, „17 typische Antworten“ zählt nicht als Antworten-Zahl der Seite
  const MUSTER = /(\d+)\s+(?:(?:wahrscheinliche|mögliche|possible|likely|typische|typical)\s+)?(Fragen|Rechte-Karten|Normen|Antworten|questions|rights cards|statutes|answers|replies)\b/g;

  it.each(DOKUMENTE)('%s', (pfad) => {
    let text = readFileSync(resolve(ROOT, pfad), 'utf8');
    if (pfad === 'src/data/dosen.ts') {
      const i = text.indexOf("id: 'gruendungsnavigator'");
      text = text.slice(i, text.indexOf('\n  },\n', i));
    }
    const falsch: string[] = [];
    let treffer = 0;
    for (const m of text.matchAll(MUSTER)) {
        treffer++;
      // „N typische Antworten des Gegenübers“ umschreibt die Rechte-Karten (Anlass: blieb bei 17 stehen, als es 30 waren)
      const art = /typische|typical/.test(m[0]) ? 'Rechte-Karten' : m[2];
      if (!erlaubt[art].has(Number(m[1]))) falsch.push(`${m[0]} (erlaubt: ${[...erlaubt[art]].join('/')})`);
    }
    expect(falsch, pfad).toEqual([]);
    expect(treffer, `${pfad} nennt keine Zahl – Muster prüfen`).toBeGreaterThan(0);
  });
});

// ------------------------------------------------------------------ Offline (PWA)

describe('Offline: Manifest, Symbol und Service Worker', () => {
  const DIR = resolve(ROOT, 'public/gruendungsnavigator');
  const manifest = JSON.parse(readFileSync(resolve(DIR, 'manifest.webmanifest'), 'utf8'));
  const sw = readFileSync(resolve(DIR, 'sw.js'), 'utf8');

  it('Manifest ist installierbar: Name, Start, Anzeige, Symbol vorhanden', () => {
    expect(manifest.name).toBeTruthy();
    expect(manifest.start_url).toBe('./');
    expect(manifest.display).toBe('standalone');
    for (const i of manifest.icons) expect(readFileSync(resolve(DIR, i.src), 'utf8')).toContain('<svg');
  });

  it('der Service Worker speichert genau Dateien, die es gibt, und beide Seiten', () => {
    const liste = JSON.parse(sw.match(/const DATEIEN = (\[[^\]]*\])/)![1].replace(/'/g, '"')) as string[];
    expect(liste).toEqual(expect.arrayContaining(['./index.html', './fall-landkarte.html', './manifest.webmanifest', './icon.svg']));
    for (const f of liste.filter((x) => x !== './')) expect(readFileSync(resolve(DIR, f)).length, f).toBeGreaterThan(0);
  });

  it('der Service Worker fasst nur eigene Anfragen an und speichert keine Eingaben', () => {
    expect(sw).toContain("new URL(req.url).origin !== self.location.origin");
    const code = sw.split('\n').filter((z) => !z.trim().startsWith('//')).join('\n');
    expect(code).not.toMatch(/localStorage|POST/);
  });

  it('beide Seiten binden Manifest und Registrierung ein (nur über http, nicht file://)', () => {
    for (const html of [NAV, KARTE]) {
      expect(html).toContain('<link rel="manifest" href="manifest.webmanifest">');
      expect(html).toContain('navigator.serviceWorker.register("sw.js")');
      expect(html).toContain('location.protocol.startsWith("http")');
      expect(html).toContain('id="offline-status"');
    }
  });
});

// ------------------------------------------------------------------ Datenschutz

describe('Datenschutz-Wächter: der Beispielfall ist erfunden', () => {
  // Anlass 11.10.2026: Die Demo beruhte auf einem echten Fall (Beruf, Planzahlen,
  // Zuschussbetrag). Er wurde durch einen erfundenen ersetzt. Die alten Werte
  // stehen hier nur als SHA-256-Präfixe, damit der Test sie nicht selbst
  // veröffentlicht. Kommt einer zurück, schlägt der Test an.
  const VERBOTEN = new Set([
    '6d58162ed755c893', 'f593d1b8d42661d1', 'a7e981697c68949e', 'a2e751720d7659f0', '65c9cec9520fdaa8', 'a01c2add3950c7e0',
    '0644cda50ad91c53', 'aab9f13a69a586b3', '02778bbd29d11f49', '4c6d34f0ca31c5df', 'ae4d9f9df23d0c7b',
  ]);
  const DATEIEN = [
    'public/gruendungsnavigator/index.html',
    'public/gruendungsnavigator/fall-landkarte.html',
    '05-dosen/gruendungsnavigator.md',
    'en/05-dosen/gruendungsnavigator.md',
    '07-demos/gruendungsnavigator/README.md',
    '07-demos/gruendungsnavigator/ticket-01-vorlage.md',
    '07-demos/gruendungsnavigator/pruefakte.md',
    '02-recherche/gruendungsnavigator-konzept-2026-10-11.md',
  ];

  it.each(DATEIEN)('%s enthält keinen Wert des Ursprungsfalls', async (pfad) => {
    const { createHash } = await import('node:crypto');
    const text = readFileSync(resolve(ROOT, pfad), 'utf8').toLowerCase();
    const treffer = [...new Set(text.match(/[a-z0-9äöüß]+(?:\.[0-9]+)*/g) ?? [])]
      .filter((t) => VERBOTEN.has(createHash('sha256').update(t).digest('hex').slice(0, 16)));
    expect(treffer, pfad).toEqual([]);
  });

  it('beide Seiten sagen ausdrücklich, dass der Fall erfunden ist', () => {
    expect(NAV).toContain('erfundenen Beispiel');
    expect(KARTE).toContain('erfunden');
  });
});
