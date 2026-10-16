// Jobcenter-Hilfe: Rechner aus dem Gesetzestext, mit Gegenproben. Lizenz: CC0.
import { describe, it, expect } from 'vitest';
import { vermoegensFreibetrag, pruefeVermoegen, pruefeUnterkunft, pruefeAufrechnung, unterBagatellgrenze, ueberpruefung } from './rechner';
import { assertKeinVersprechen } from './gruendungsnavigator';

describe('Vermögensfreibetrag (§ 12 Abs. 2 SGB II)', () => {
  it('Stufen nach Lebensjahr, höherer Betrag ab Beginn des Geburtstagsmonats', () => {
    expect(vermoegensFreibetrag('2000-05-15', '2026-10-01')).toBe(5000); // 26
    expect(vermoegensFreibetrag('1996-10-20', '2026-09-30')).toBe(5000); // 30. Geburtstag erst im Oktober
    expect(vermoegensFreibetrag('1996-10-20', '2026-10-01')).toBe(10000); // Monat des 30. Geburtstags = Beginn 31. Lebensjahr
    expect(vermoegensFreibetrag('1986-03-31', '2026-03-01')).toBe(12500);
    expect(vermoegensFreibetrag('1976-12-31', '2026-12-01')).toBe(20000);
    expect(vermoegensFreibetrag('1950-01-01', '2026-10-01')).toBe(20000);
  });

  it('29. Februar: Geburtstagsmonat zählt auch in Nichtschaltjahren', () => {
    expect(vermoegensFreibetrag('1996-02-29', '2026-02-01')).toBe(10000);
    expect(vermoegensFreibetrag('1996-02-29', '2026-01-31')).toBe(5000);
  });

  it('nicht ausgeschöpfte Freibeträge gehen über (§ 12 Abs. 2 Satz 3)', () => {
    const r = pruefeVermoegen([
      { name: 'A', geburtsdatum: '1980-01-01', vermoegen: 20000 },
      { name: 'B', geburtsdatum: '2010-06-01', vermoegen: 0 },
    ], '2026-10-16');
    expect(r.freibetragGesamt).toBe(17500);
    expect(r.ueberFreibetrag).toBe(2500);
  });

  it('Gegenproben: negatives Vermögen, Stichtag vor Geburt, keine Person', () => {
    expect(() => pruefeVermoegen([{ name: 'A', geburtsdatum: '1990-01-01', vermoegen: -1 }], '2026-10-16')).toThrow();
    expect(() => vermoegensFreibetrag('2027-01-01', '2026-10-16')).toThrow();
    expect(() => pruefeVermoegen([], '2026-10-16')).toThrow();
  });
});

describe('Unterkunft (§ 22 Abs. 1 SGB II)', () => {
  it('Karenzzeit ein Jahr ab Beginn des ersten Bezugsmonats', () => {
    const r = pruefeUnterkunft({ ersterBezugsmonat: '2026-07-15', miete: 600, grenze: 500, stichtag: '2027-06-30' });
    expect(r.karenzEndeMonat).toBe('2027-06-01');
    expect(r.inKarenz).toBe(true);
    expect(pruefeUnterkunft({ ersterBezugsmonat: '2026-07-15', miete: 600, grenze: 500, stichtag: '2027-07-01' }).inKarenz).toBe(false);
  });

  it('volle Monate ohne Bezug verlängern die Karenzzeit', () => {
    expect(pruefeUnterkunft({ ersterBezugsmonat: '2026-07-01', monateOhneBezugInKarenz: 2, miete: 1, stichtag: '2027-08-15' }).inKarenz).toBe(true);
  });

  it('Deckel: auch in der Karenzzeit nicht über dem Eineinhalbfachen', () => {
    const r = pruefeUnterkunft({ ersterBezugsmonat: '2026-07-01', miete: 900, grenze: 500, stichtag: '2026-10-01' });
    expect(r.deckel).toBe(750);
    expect(r.ueberDeckel).toBe(150);
    expect(r.zeilen.join(' ')).toMatch(/150,00 €/);
  });

  it('nach der Karenzzeit: sechs Monate nach der Aufforderung als Regel, mit Satz zu § 22 Abs. 1a', () => {
    const r = pruefeUnterkunft({ ersterBezugsmonat: '2025-01-01', miete: 600, grenze: 500, kostensenkungZugang: '2026-10-16', stichtag: '2026-10-16' });
    expect(r.inKarenz).toBe(false);
    expect(r.senkungRegelEnde).toBe('2027-04-16');
    expect(r.zeilen.join(' ')).toMatch(/Abs\. 1a/);
  });

  it('ohne Grenze kein Betrag, sondern der Hinweis, wo sie steht', () => {
    const r = pruefeUnterkunft({ ersterBezugsmonat: '2026-07-01', miete: 600, stichtag: '2026-10-01' });
    expect(r.deckel).toBeNull();
    expect(r.zeilen.join(' ')).toMatch(/nicht eingetragen/);
  });

  it('Gegenproben: Bruchmonate, negative Miete', () => {
    expect(() => pruefeUnterkunft({ ersterBezugsmonat: '2026-07-01', monateOhneBezugInKarenz: 1.5, miete: 1, stichtag: '2026-10-01' })).toThrow();
    expect(() => pruefeUnterkunft({ ersterBezugsmonat: '2026-07-01', miete: -5, stichtag: '2026-10-01' })).toThrow();
  });
});

describe('Aufrechnung (§ 43 SGB II) und Bagatellgrenze (§ 40 Abs. 1 Satz 3)', () => {
  it('10 % bei § 41a, 30 % sonst', () => {
    expect(pruefeAufrechnung({ regelbedarf: 563, grund: 'vorlaeufig-41a' }).hoechstensEuro).toBe(56.3);
    expect(pruefeAufrechnung({ regelbedarf: 563, grund: 'sonstiges' }).hoechstensEuro).toBe(168.9);
  });

  it('zusammen mit laufenden höchstens 30 %', () => {
    expect(pruefeAufrechnung({ regelbedarf: 563, grund: 'sonstiges', laufendeProzent: 10 }).hoechstensProzent).toBe(20);
    expect(pruefeAufrechnung({ regelbedarf: 563, grund: 'vorlaeufig-41a', laufendeProzent: 25 }).hoechstensProzent).toBe(5);
  });

  it('Minderung ab 30 %: keine Aufrechnung; darunter die Differenz', () => {
    expect(pruefeAufrechnung({ regelbedarf: 563, grund: 'sonstiges', minderungProzent: 30 }).hoechstensProzent).toBe(0);
    expect(pruefeAufrechnung({ regelbedarf: 563, grund: 'sonstiges', minderungProzent: 10 }).hoechstensProzent).toBe(20);
  });

  it('Bagatellgrenze unter 50 € für die ganze Bedarfsgemeinschaft', () => {
    expect(unterBagatellgrenze(49.99)).toBe(true);
    expect(unterBagatellgrenze(50)).toBe(false);
  });

  it('Gegenproben: negativer Regelbedarf, Prozent über 100', () => {
    expect(() => pruefeAufrechnung({ regelbedarf: -1, grund: 'sonstiges' })).toThrow();
    expect(() => pruefeAufrechnung({ regelbedarf: 563, grund: 'sonstiges', laufendeProzent: 120 })).toThrow();
  });
});

describe('Überprüfungsantrag (§ 40 Abs. 1 SGB II, § 44 Abs. 4 SGB X)', () => {
  it('Antrag bis vier Jahre nach Ende des Bekanntgabejahres', () => {
    expect(ueberpruefung('2024-03-10').antragBis).toBe('2028-12-31');
  });

  it('Nachzahlung ab 1. Januar des Vorjahres des Antrags', () => {
    const r = ueberpruefung('2024-03-10', '2026-10-16');
    expect(r.nachzahlungAb).toBe('2025-01-01');
    expect(r.zeilen.join(' ')).toMatch(/früh stellen/);
  });

  it('Gegenprobe: Antrag vor dem Bescheid wird abgelehnt', () => {
    expect(() => ueberpruefung('2026-03-10', '2026-01-01')).toThrow();
  });
});

describe('Sprachwächter über alle Rechner', () => {
  it('kein Ausgabetext verspricht etwas', () => {
    const texte = [
      ...pruefeVermoegen([{ name: 'A', geburtsdatum: '1990-01-01', vermoegen: 3000 }], '2026-10-16').hinweise,
      ...pruefeUnterkunft({ ersterBezugsmonat: '2026-07-01', miete: 900, grenze: 500, kostensenkungZugang: '2027-08-01', stichtag: '2027-09-01' }).zeilen,
      ...pruefeUnterkunft({ ersterBezugsmonat: '2026-07-01', miete: 900, grenze: 500, stichtag: '2026-09-01' }).zeilen,
      ...pruefeAufrechnung({ regelbedarf: 563, grund: 'sonstiges', laufendeProzent: 10, minderungProzent: 10 }).zeilen,
      ...ueberpruefung('2024-03-10', '2026-10-16').zeilen,
    ];
    for (const t of texte) expect(() => assertKeinVersprechen(t), t).not.toThrow();
  });
});
