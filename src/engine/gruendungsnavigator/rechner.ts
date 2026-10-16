// Jobcenter-Hilfe: kleine Rechner aus dem Gesetzestext. Lizenz: CC0 1.0 Public Domain.
//
// Jeder Rechner nimmt nur Tatsachen, die die Person selbst einträgt, und gibt
// das Ergebnis mit Norm aus. Keiner bewertet, ob ein Bescheid richtig ist.
// Wortlaut der Normen: 07-demos/gruendungsnavigator/data/normen.json
// (gesetze-im-internet.de, gelesen am 16.10.2026).

import { parseIso, plusMonate, type IsoDatum } from './gruendungsnavigator';

const datumDe = (d: IsoDatum) => d.split('-').reverse().join('.');
const monatsanfang = (d: IsoDatum): IsoDatum => d.slice(0, 8) + '01';
const vor = (a: IsoDatum, b: IsoDatum) => parseIso(a) < parseIso(b);
const istBetrag = (n: number) => typeof n === 'number' && Number.isFinite(n) && n >= 0;
function betrag(n: number, was: string): number {
  if (!istBetrag(n)) throw new Error(`${was}: ${n} ist kein Betrag ab 0`);
  return n;
}
const euro = (n: number) => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/ /g, '.') + ' €';

// ---------------------------------------------------------------- Vermögen (§ 12 Abs. 2 SGB II)

/** Freibeträge nach Lebensjahr: „bis zur Vollendung des 30. Lebensjahres 5 000, ab dem 31. … 10 000, ab dem 41. … 12 500, ab dem 51. … 20 000“ */
export const VERMOEGEN_STUFEN = [
  { abAlter: 0, betrag: 5000 },
  { abAlter: 30, betrag: 10000 },
  { abAlter: 40, betrag: 12500 },
  { abAlter: 50, betrag: 20000 },
] as const;

/**
 * Freibetrag einer Person in einem Monat. Das 31. Lebensjahr beginnt mit dem
 * 30. Geburtstag; der höhere Betrag gilt „ab Beginn des Monats, in dem die
 * jeweilige Altersgrenze … erreicht wird“.
 */
export function vermoegensFreibetrag(geburtsdatum: IsoDatum, stichtag: IsoDatum): number {
  const g = parseIso(geburtsdatum);
  parseIso(stichtag);
  if (vor(stichtag, geburtsdatum)) throw new Error('Stichtag vor dem Geburtsdatum');
  let wert: number = VERMOEGEN_STUFEN[0].betrag;
  for (const s of VERMOEGEN_STUFEN) {
    if (s.abAlter === 0) continue;
    const geburtstag = `${g.getUTCFullYear() + s.abAlter}-${geburtsdatum.slice(5)}`;
    // 29.02. in einem Nichtschaltjahr: der Monat ist trotzdem der Februar
    const monat = geburtstag.slice(0, 8) + '01';
    if (!vor(stichtag, monat)) wert = s.betrag;
  }
  return wert;
}

export interface VermoegenPerson {
  name: string;
  geburtsdatum: IsoDatum;
  /** Vermögen, das die Person selbst als zu berücksichtigend einträgt (€) */
  vermoegen: number;
}

export interface VermoegenErgebnis {
  personen: { name: string; freibetrag: number; vermoegen: number }[];
  freibetragGesamt: number;
  vermoegenGesamt: number;
  /** Betrag über den Freibeträgen, nachdem nicht ausgeschöpfte Freibeträge übertragen wurden; 0 = nichts darüber */
  ueberFreibetrag: number;
  hinweise: string[];
}

/**
 * § 12 Abs. 2: Freibetrag je Person, nicht ausgeschöpfte Freibeträge gehen
 * auf die Person über, deren Vermögen ihren Freibetrag übersteigt. Was als
 * Vermögen zählt (Abs. 1: Hausrat, Auto, Altersvorsorge, Wohneigentum), prüft
 * der Rechner nicht.
 */
export function pruefeVermoegen(personen: VermoegenPerson[], stichtag: IsoDatum): VermoegenErgebnis {
  if (!personen.length) throw new Error('Mindestens eine Person eintragen');
  const p = personen.map((x) => ({ name: x.name, freibetrag: vermoegensFreibetrag(x.geburtsdatum, stichtag), vermoegen: betrag(x.vermoegen, `Vermögen ${x.name}`) }));
  const freibetragGesamt = p.reduce((s, x) => s + x.freibetrag, 0);
  const vermoegenGesamt = p.reduce((s, x) => s + x.vermoegen, 0);
  // Übertragung nur von nicht ausgeschöpften auf übersteigende Personen: im Ergebnis zählt die Summe
  const ueberFreibetrag = Math.max(0, vermoegenGesamt - freibetragGesamt);
  return {
    personen: p,
    freibetragGesamt,
    vermoegenGesamt,
    ueberFreibetrag,
    hinweise: [
      `Stichtag ${datumDe(stichtag)}: maßgeblich ist der Tag des Antrags oder Weiterbewilligungsantrags (§ 12 Abs. 3).`,
      'Nicht als Vermögen zählen unter anderem angemessener Hausrat, ein angemessenes Auto je erwerbsfähiger Person und bestimmte Altersvorsorge (§ 12 Abs. 1). Ob etwas dazu gehört, prüft der Rechner nicht.',
      'Seit dem 01.07.2026 gibt es keine Karenzzeit für Vermögen mehr; bei der Weiterbewilligung wird nach der Anlage Vermögen gefragt.',
    ],
  };
}

// ---------------------------------------------------------------- Unterkunft (§ 22 Abs. 1 SGB II)

export interface KdUEingabe {
  /** Erster Monat, für den Leistungen bezogen wurden (beliebiger Tag des Monats) */
  ersterBezugsmonat: IsoDatum;
  /** Volle Kalendermonate ohne Leistungsbezug innerhalb der Karenzzeit */
  monateOhneBezugInKarenz?: number;
  /** Tatsächliche Kosten der Unterkunft im Monat (ohne Heizung), € */
  miete: number;
  /** Vom Jobcenter genannte angemessene Unterkunftskosten (Grenze), €; leer = unbekannt */
  grenze?: number | null;
  /** Tag, an dem die Aufforderung zur Kostensenkung zuging */
  kostensenkungZugang?: IsoDatum;
  /** Monat, um den es geht */
  stichtag: IsoDatum;
}

export interface KdUErgebnis {
  karenzEndeMonat: IsoDatum;
  inKarenz: boolean;
  /** Obergrenze 1,5 × Grenze, wenn die Grenze bekannt ist */
  deckel: number | null;
  ueberDeckel: number | null;
  ueberGrenze: number | null;
  senkungRegelEnde: IsoDatum | null;
  zeilen: string[];
}

/**
 * Karenzzeit „von einem Jahr ab Beginn des Monats, für den erstmals Leistungen
 * … bezogen werden“, verlängert um volle Monate ohne Bezug; auch in der
 * Karenzzeit nicht über dem Eineinhalbfachen der angemessenen Kosten. Nach der
 * Karenzzeit „in der Regel jedoch längstens für sechs Monate“ nach der
 * Aufforderung, die Kosten zu senken.
 */
export function pruefeUnterkunft(e: KdUEingabe): KdUErgebnis {
  const start = monatsanfang(e.ersterBezugsmonat);
  parseIso(start);
  parseIso(e.stichtag);
  const plus = e.monateOhneBezugInKarenz ?? 0;
  if (!Number.isInteger(plus) || plus < 0) throw new Error(`Monate ohne Bezug: ${plus} ist keine ganze Zahl ab 0`);
  const miete = betrag(e.miete, 'Miete');
  const grenze = e.grenze === undefined || e.grenze === null ? null : betrag(e.grenze, 'Grenze');
  const karenzEndeMonat = plusMonate(start, 12 + plus - 1);
  const inKarenz = vor(monatsanfang(e.stichtag), plusMonate(start, 12 + plus));
  const deckel = grenze === null ? null : Math.round(grenze * 1.5 * 100) / 100;
  const ueberDeckel = deckel === null ? null : Math.max(0, Math.round((miete - deckel) * 100) / 100);
  const ueberGrenze = grenze === null ? null : Math.max(0, Math.round((miete - grenze) * 100) / 100);
  const zeilen: string[] = [];
  zeilen.push(`Karenzzeit: ${datumDe(start)} bis Ende ${datumDe(karenzEndeMonat).slice(3)}${plus ? ` (um ${plus} Monat${plus > 1 ? 'e' : ''} ohne Bezug verlängert)` : ''}. Eine neue Karenzzeit beginnt erst nach drei Jahren ohne Leistungen.`);
  if (grenze === null) zeilen.push('Die angemessene Grenze ist nicht eingetragen. Sie steht in der Richtlinie Ihrer Kommune oder in einem Schreiben des Jobcenters.');
  if (inKarenz) {
    if (ueberDeckel && ueberDeckel > 0) zeilen.push(`In der Karenzzeit, aber über dem Eineinhalbfachen der Grenze (${euro(deckel!)}): ${euro(ueberDeckel)} im Monat werden nach § 22 Abs. 1 Satz 6 nicht anerkannt. In Haushalten mit Kindern oder wenn es unabweisbar ist, kann im Einzelfall mehr anerkannt werden (Satz 7).`);
    else if (deckel !== null) zeilen.push(`In der Karenzzeit und nicht über dem Eineinhalbfachen der Grenze (${euro(deckel)}): die tatsächliche Miete wird anerkannt.`);
    else zeilen.push('In der Karenzzeit: die tatsächliche Miete wird anerkannt, höchstens bis zum Eineinhalbfachen der Grenze.');
    zeilen.push('Ausnahme: Liegt die Miete über einer in Ihrer Kommune festgelegten Quadratmeter-Obergrenze oder über der nach der Mietpreisbremse zulässigen Miete, gilt die Karenzzeit für diesen Teil nicht (§ 22 Abs. 1 Satz 8).');
  } else {
    if (ueberGrenze && ueberGrenze > 0) {
      zeilen.push(`Nach der Karenzzeit und ${euro(ueberGrenze)} über der Grenze. Das Jobcenter muss das mitteilen und sagen, wie lange und unter welchen Voraussetzungen es die höheren Kosten noch übernimmt (§ 22 Abs. 1a).`);
    } else if (grenze !== null) zeilen.push('Nach der Karenzzeit und nicht über der Grenze.');
  }
  let senkungRegelEnde: IsoDatum | null = null;
  if (e.kostensenkungZugang) {
    parseIso(e.kostensenkungZugang);
    senkungRegelEnde = plusMonate(e.kostensenkungZugang, 6);
    zeilen.push(`Aufforderung zur Kostensenkung zugegangen am ${datumDe(e.kostensenkungZugang)}: Die höheren Kosten werden übernommen, solange eine Senkung nicht möglich oder nicht zumutbar ist, in der Regel längstens sechs Monate, also etwa bis ${datumDe(senkungRegelEnde)}. Die Karenzzeit wird darauf nicht angerechnet. Bemühungen (Wohnungssuche, Absagen) aufschreiben.`);
  }
  zeilen.push('Vor einem Umzug die Zusicherung des Jobcenters einholen (§ 22 Abs. 4).');
  return { karenzEndeMonat, inKarenz, deckel, ueberDeckel, ueberGrenze, senkungRegelEnde, zeilen };
}

// ---------------------------------------------------------------- Rückforderung und Aufrechnung (§ 40, § 43 SGB II)

export type ForderungsGrund = 'vorlaeufig-41a' | 'einkommen-48' | 'sonstiges';

export interface AufrechnungEingabe {
  /** Maßgebender Regelbedarf der Person in €, wie im Bescheid */
  regelbedarf: number;
  grund: ForderungsGrund;
  /** Schon laufende Aufrechnungen und Darlehenstilgungen (§ 42a Abs. 2) in Prozent des Regelbedarfs */
  laufendeProzent?: number;
  /** Laufende Minderung nach § 31b in Prozent des Regelbedarfs */
  minderungProzent?: number;
}

export interface AufrechnungErgebnis {
  satzProzent: number;
  hoechstensProzent: number;
  hoechstensEuro: number;
  zeilen: string[];
}

/**
 * Höchstbetrag einer neuen Aufrechnung nach § 43 Abs. 2 und 3: 10 % bei
 * Forderungen aus § 41a oder § 48 Abs. 1 Satz 2 Nr. 3 SGB X, sonst 30 %;
 * zusammen mit laufenden Aufrechnungen höchstens 30 %; bei einer Minderung
 * ab 30 % keine Aufrechnung, darunter höchstens die Differenz.
 */
export function pruefeAufrechnung(e: AufrechnungEingabe): AufrechnungErgebnis {
  const rb = betrag(e.regelbedarf, 'Regelbedarf');
  const laufend = betrag(e.laufendeProzent ?? 0, 'laufende Aufrechnungen');
  const minderung = betrag(e.minderungProzent ?? 0, 'Minderung');
  if (laufend > 100 || minderung > 100) throw new Error('Prozent über 100');
  const satzProzent = e.grund === 'sonstiges' ? 30 : 10;
  let hoechstensProzent = Math.min(satzProzent, Math.max(0, 30 - laufend));
  const zeilen = [`Satz für diese Forderung: ${satzProzent} % des Regelbedarfs (§ 43 Abs. 2 Satz 1).`];
  if (laufend > 0) zeilen.push(`Mit den laufenden ${laufend} % zusammen höchstens 30 %: für die neue Aufrechnung bleiben ${Math.max(0, 30 - laufend)} % (§ 43 Abs. 2 Satz 2).`);
  if (minderung >= 30) {
    hoechstensProzent = 0;
    zeilen.push('Bei einer Minderung von mindestens 30 % ist für diesen Zeitraum keine Aufrechnung zulässig (§ 43 Abs. 3 Satz 1).');
  } else if (minderung > 0) {
    hoechstensProzent = Math.min(hoechstensProzent, 30 - minderung);
    zeilen.push(`Bei einer Minderung von ${minderung} % höchstens die Differenz zu 30 %: ${30 - minderung} % (§ 43 Abs. 3 Satz 2).`);
  }
  const hoechstensEuro = Math.floor((rb * hoechstensProzent) / 100 * 100) / 100;
  zeilen.push(`Höchstens ${hoechstensProzent} % von ${euro(rb)} = ${euro(hoechstensEuro)} im Monat. Steht im Bescheid mehr, nachfragen und prüfen lassen.`);
  zeilen.push('Die Aufrechnung muss schriftlich als Bescheid erklärt werden und endet spätestens drei Jahre nach dem Monat, der auf die Bestandskraft der Forderung folgt (§ 43 Abs. 4).');
  return { satzProzent, hoechstensProzent, hoechstensEuro, zeilen };
}

/** § 40 Abs. 1 Satz 3: keine rückwirkende Aufhebung, wenn sich ausschließlich Erstattungen von insgesamt unter 50 € für die ganze Bedarfsgemeinschaft ergäben. */
export function unterBagatellgrenze(erstattungGesamtBG: number): boolean {
  return betrag(erstattungGesamtBG, 'Erstattung') < 50;
}

// ---------------------------------------------------------------- Überprüfungsantrag (§ 40 Abs. 1 SGB II, § 44 SGB X)

export interface UeberpruefungErgebnis {
  /** Letzter Tag, an dem der Antrag nach § 40 Abs. 1 Satz 2 Nr. 1 reicht */
  antragBis: IsoDatum;
  /** Ab diesem Tag wird bei einem Antrag am angegebenen Tag rückwirkend gezahlt (§ 44 Abs. 4 mit § 40 Abs. 1 Satz 2 Nr. 2) */
  nachzahlungAb: IsoDatum | null;
  zeilen: string[];
}

export function ueberpruefung(bekanntgabe: IsoDatum, antrag?: IsoDatum): UeberpruefungErgebnis {
  const jahr = parseIso(bekanntgabe).getUTCFullYear();
  const antragBis = `${jahr + 4}-12-31`;
  const zeilen = [`Überprüfungsantrag für einen Bescheid aus ${jahr}: bis ${datumDe(antragBis)} (vier Jahre nach Ende des Jahres der Bekanntgabe, § 40 Abs. 1 Satz 2 Nr. 1 SGB II).`];
  let nachzahlungAb: IsoDatum | null = null;
  if (antrag) {
    const a = parseIso(antrag);
    if (vor(antrag, bekanntgabe)) throw new Error('Antrag vor der Bekanntgabe des Bescheids');
    nachzahlungAb = `${a.getUTCFullYear() - 1}-01-01`;
    zeilen.push(`Bei einem Antrag am ${datumDe(antrag)} wird höchstens ab ${datumDe(nachzahlungAb)} nachgezahlt (§ 44 Abs. 4 SGB X, ein Jahr nach § 40 Abs. 1 Satz 2 Nr. 2 SGB II). Jeder Jahreswechsel vor dem Antrag kostet ein Jahr Nachzahlung: früh stellen.`);
    if (vor(antragBis, antrag)) zeilen.push(`Der Antrag am ${datumDe(antrag)} liegt nach dem ${datumDe(antragBis)}.`);
  }
  return { antragBis, nachzahlungAb, zeilen };
}
