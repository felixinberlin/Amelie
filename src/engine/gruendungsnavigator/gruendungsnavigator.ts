// Gründungsnavigator — deterministischer Kern. Lizenz: CC0 1.0 Public Domain.
//
// Der Prototyp (public/gruendungsnavigator/) ist eine HTML-Seite mit
// Entscheidungsbaum, Fragenkatalog und Normtexten. Dieser Kern zieht das
// heraus, was man rechnen und prüfen kann, statt es zu raten:
//
//   1. Fristen: Monatsfristen nach § 64 SGG / § 26 SGB X i. V. m. §§ 187, 188
//      BGB, Verschiebung auf den nächsten Werktag, Untätigkeit, Einstiegsgeld-
//      Höchstdauer, Prüfung der Selbständigkeit nach einem Jahr.
//   2. Erwerbstätigenfreibetrag nach § 11b Abs. 2, 3 SGB II.
//   3. Strukturprüfung des Telefon-Entscheidungsbaums und der Normverweise.
//   4. Sprachwächter: Das Werkzeug sagt nie „Sie bekommen“, „garantiert“ oder
//      „Anspruch auf Einstiegsgeld“. Einstiegsgeld ist Ermessen (§ 16b SGB II).
//
// Jede Ausgabe trägt eine Norm-ID aus dem Normregister der Fall-Landkarte
// (public/gruendungsnavigator/fall-landkarte.html, Konstante L). Die Tests
// prüfen, dass jede hier benutzte ID dort existiert.
//
// Keine Rechtsberatung. Rechtsstand: SGB II in der Fassung vom 16.04.2026
// (BGBl. I Nr. 107), in Kraft seit 01.07.2026; Normtexte geprüft 11.10.2026, Wortlaut-Zitate erneut 16.10.2026.

export const RECHTSSTAND = {
  fassung: 'SGB II i. d. F. des Dreizehnten Änderungsgesetzes vom 16.04.2026 (BGBl. I Nr. 107), in Kraft 01.07.2026',
  geprueftAm: '2026-10-16',
  geprueftGegen: 'gesetze-im-internet.de (Zitat-Abgleich npm run check:gn-zitate; nicht abrufbare Seiten per curl von Hand)',
} as const;

export const GELTUNGSGRENZE_DE =
  'Allgemeine Information, keine Rechtsberatung und keine Entscheidung im Einzelfall. Fristen sind Rechenhilfen: Maßgeblich sind das Datum auf dem Bescheid, die Rechtsbehelfsbelehrung und die zuständige Stelle.';
export const GELTUNGSGRENZE_EN =
  'General information, not legal advice and not a decision on an individual case. Deadlines are calculation aids: what counts is the date on the notice, the instructions on legal remedies and the competent office.';

// ---------------------------------------------------------------- Datum

/** ISO-Datum 'YYYY-MM-DD'. Gerechnet wird in UTC, damit keine Zeitzone stört. */
export type IsoDatum = string;

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseIso(d: IsoDatum): Date {
  const m = ISO.exec(d);
  if (!m) throw new Error(`Kein ISO-Datum: "${d}"`);
  const date = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (date.getUTCMonth() !== +m[2] - 1 || date.getUTCDate() !== +m[3]) throw new Error(`Ungültiges Datum: "${d}"`);
  return date;
}

export function toIso(d: Date): IsoDatum {
  return d.toISOString().slice(0, 10);
}

export function plusTage(d: IsoDatum, n: number): IsoDatum {
  const x = parseIso(d);
  x.setUTCDate(x.getUTCDate() + n);
  return toIso(x);
}

/**
 * Gleicher Tag n Monate später; fehlt der Tag im Zielmonat, der letzte Tag
 * des Monats (§ 188 Abs. 2, 3 BGB). 31.01. + 1 Monat = 28./29.02.
 */
export function plusMonate(d: IsoDatum, n: number): IsoDatum {
  const x = parseIso(d);
  const tag = x.getUTCDate();
  const ziel = new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth() + n, 1));
  const letzter = new Date(Date.UTC(ziel.getUTCFullYear(), ziel.getUTCMonth() + 1, 0)).getUTCDate();
  ziel.setUTCDate(Math.min(tag, letzter));
  return toIso(ziel);
}

/** Ostersonntag (Gaußsche Osterformel, Anonymer Gregorianischer Algorithmus). */
export function ostersonntag(jahr: number): IsoDatum {
  const a = jahr % 19;
  const b = Math.floor(jahr / 100);
  const c = jahr % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const monat = Math.floor((h + l - 7 * m + 114) / 31);
  const tag = ((h + l - 7 * m + 114) % 31) + 1;
  return toIso(new Date(Date.UTC(jahr, monat - 1, tag)));
}

/** Bundesweite gesetzliche Feiertage. Landesfeiertage gibt man als `zusatzFeiertage` mit. */
export function bundesFeiertage(jahr: number): IsoDatum[] {
  const ostern = ostersonntag(jahr);
  return [
    `${jahr}-01-01`,
    plusTage(ostern, -2), // Karfreitag
    plusTage(ostern, 1), // Ostermontag
    `${jahr}-05-01`,
    plusTage(ostern, 39), // Christi Himmelfahrt
    plusTage(ostern, 50), // Pfingstmontag
    `${jahr}-10-03`,
    `${jahr}-12-25`,
    `${jahr}-12-26`,
  ];
}

export function istWerktag(d: IsoDatum, zusatzFeiertage: IsoDatum[] = []): boolean {
  const wt = parseIso(d).getUTCDay();
  if (wt === 0 || wt === 6) return false;
  const jahr = +d.slice(0, 4);
  return !bundesFeiertage(jahr).includes(d) && !zusatzFeiertage.includes(d);
}

/** Fällt ein Fristende auf Samstag, Sonntag oder Feiertag, endet sie am nächsten Werktag (§ 64 Abs. 3 SGG). */
export function naechsterWerktag(d: IsoDatum, zusatzFeiertage: IsoDatum[] = []): IsoDatum {
  let x = d;
  while (!istWerktag(x, zusatzFeiertage)) x = plusTage(x, 1);
  return x;
}

// ---------------------------------------------------------------- Fristen

export type FristArt =
  /** Letzter Tag, an dem etwas eingehen muss */
  | 'frist'
  /** Frühester Tag, ab dem etwas zulässig ist */
  | 'fruehestens'
  /** Spätester Zeitpunkt, zu dem das Jobcenter etwas tut */
  | 'spaetestens'
  /** Kein Datum, sondern ein Warnhinweis */
  | 'hinweis';

export interface FristEintrag {
  id: string;
  art: FristArt;
  titelDe: string;
  titelEn: string;
  /** Datum oder null bei Hinweisen */
  datum: IsoDatum | null;
  /** Norm-ID im Register der Fall-Landkarte */
  normId: string;
  begruendungDe: string;
  begruendungEn: string;
  /** Wurde das Ende wegen Wochenende/Feiertag verschoben? */
  verschobenVon?: IsoDatum;
}

export interface FristEingabe {
  /** Tag, an dem der (auch formlose) Antrag beim Jobcenter einging */
  antrag?: IsoDatum;
  /** Erster Tag der selbständigen Tätigkeit (erster Auftrag, erste Rechnung) */
  gruendung?: IsoDatum;
  /** Tag der Bekanntgabe eines Bescheids (Datum der Bekanntgabe, nicht Datum des Briefkopfs) */
  bescheidBekanntgabe?: IsoDatum;
  /** Enthält der Bescheid eine korrekte Rechtsbehelfsbelehrung? Standard: ja */
  mitRechtsbehelfsbelehrung?: boolean;
  /** Tag, an dem der Widerspruch einging */
  widerspruch?: IsoDatum;
  /** Tag der Bekanntgabe des Widerspruchsbescheids */
  widerspruchsbescheidBekanntgabe?: IsoDatum;
  /** Beginn des ununterbrochenen Leistungsbezugs als Selbständige/r */
  bezugsbeginn?: IsoDatum;
  /** Erster Tag des Einstiegsgelds */
  einstiegsgeldBeginn?: IsoDatum;
  /** Letzter Tag des (vorläufigen) Bewilligungszeitraums */
  bewilligungsEnde?: IsoDatum;
  /** Tag, an dem ein Antrag auf Vorschuss (§ 42 Abs. 1 Satz 2 SGB I) einging */
  vorschussAntrag?: IsoDatum;
  /** Landesfeiertage, z. B. Berlin 08.03. */
  zusatzFeiertage?: IsoDatum[];
}

function fristEnde(start: IsoDatum, monate: number, feiertage: IsoDatum[]): { datum: IsoDatum; verschobenVon?: IsoDatum } {
  const roh = plusMonate(start, monate);
  const datum = naechsterWerktag(roh, feiertage);
  return datum === roh ? { datum } : { datum, verschobenVon: roh };
}

/**
 * Rechnet alle Fristen, für die ein Ausgangsdatum vorliegt. Reihenfolge: nach
 * Datum, Hinweise zuerst. Fehlt ein Ausgangsdatum, fehlt die Frist; es wird
 * nichts geschätzt.
 */
export function berechneFristen(e: FristEingabe): FristEintrag[] {
  const ft = e.zusatzFeiertage ?? [];
  const out: FristEintrag[] = [];

  if (e.antrag && e.gruendung && parseIso(e.gruendung) < parseIso(e.antrag)) {
    out.push({
      id: 'antrag-nach-gruendung',
      art: 'hinweis',
      titelDe: 'Antrag nach dem Start der Tätigkeit',
      titelEn: 'Application after the business started',
      datum: null,
      normId: 'sgb2_37',
      begruendungDe: `Die Tätigkeit begann am ${e.gruendung}, der Antrag ging am ${e.antrag} ein. „Leistungen nach diesem Buch werden nicht für Zeiten vor der Antragstellung erbracht.“ Mit der Beratung klären, was das für Einstiegsgeld und Zuschuss bedeutet.`,
      begruendungEn: `The business started on ${e.gruendung}, the application arrived on ${e.antrag}. Benefits under SGB II are not provided for periods before the application. Clarify with an advice centre what this means for the start-up grant and subsidy.`,
    });
  }

  if (e.gruendung) {
    out.push({
      id: 'gewerbeanzeige',
      art: 'frist',
      titelDe: 'Gewerbeanzeige',
      titelEn: 'Trade registration',
      datum: e.gruendung,
      normId: 'gewo14',
      begruendungDe: 'Gleichzeitig mit dem Beginn des Gewerbes (Freie Berufe brauchen keine Gewerbeanzeige).',
      begruendungEn: 'At the same time as the trade begins (liberal professions do not register a trade).',
    });
    const fa = fristEnde(e.gruendung, 1, ft);
    out.push({
      id: 'finanzamt',
      art: 'frist',
      titelDe: 'Mitteilung an das Finanzamt',
      titelEn: 'Notification to the tax office',
      datum: fa.datum,
      verschobenVon: fa.verschobenVon,
      normId: 'ao138',
      begruendungDe: 'Innerhalb eines Monats nach Aufnahme der Tätigkeit (Fragebogen zur steuerlichen Erfassung).',
      begruendungEn: 'Within one month of starting the activity (tax registration questionnaire).',
    });
  }

  if (e.bescheidBekanntgabe) {
    const mitBelehrung = e.mitRechtsbehelfsbelehrung !== false;
    const w = fristEnde(e.bescheidBekanntgabe, mitBelehrung ? 1 : 12, ft);
    out.push({
      id: 'widerspruch',
      art: 'frist',
      titelDe: mitBelehrung ? 'Widerspruch' : 'Widerspruch (ohne korrekte Belehrung)',
      titelEn: mitBelehrung ? 'Objection' : 'Objection (no correct instructions on remedies)',
      datum: w.datum,
      verschobenVon: w.verschobenVon,
      normId: mitBelehrung ? 'sgg84' : 'sgg66',
      begruendungDe: mitBelehrung
        ? 'Binnen eines Monats nach Bekanntgabe. Ein per Post geschickter Bescheid gilt erst einige Tage nach Aufgabe zur Post als bekannt gegeben (§ 37 Abs. 2 SGB X); im Zweifel früh einreichen.'
        : 'Fehlt die Rechtsbehelfsbelehrung oder ist sie falsch, läuft grundsätzlich ein Jahr ab Bekanntgabe. Trotzdem nicht abwarten.',
      begruendungEn: mitBelehrung
        ? 'Within one month of notification. A notice sent by post counts as notified only some days after posting (section 37(2) SGB X); if in doubt, file early.'
        : 'If the instructions on remedies are missing or wrong, the period is generally one year from notification. Do not wait anyway.',
    });
  }

  if (e.antrag) {
    const roh = plusMonate(e.antrag, 6);
    out.push({
      id: 'untaetigkeit-antrag',
      art: 'fruehestens',
      titelDe: 'Untätigkeitsklage zum Antrag zulässig',
      titelEn: 'Action for failure to act on the application admissible',
      datum: plusTage(roh, 1),
      normId: 'sgg88',
      begruendungDe: 'Nicht vor Ablauf von sechs Monaten seit dem Antrag. Letztes Mittel: zuerst schriftlich erinnern.',
      begruendungEn: 'Not before six months have passed since the application. Last resort: send a written reminder first.',
    });
  }

  if (e.widerspruch) {
    const roh = plusMonate(e.widerspruch, 3);
    out.push({
      id: 'untaetigkeit-widerspruch',
      art: 'fruehestens',
      titelDe: 'Untätigkeitsklage zum Widerspruch zulässig',
      titelEn: 'Action for failure to decide the objection admissible',
      datum: plusTage(roh, 1),
      normId: 'sgg88',
      begruendungDe: 'Nicht vor Ablauf von drei Monaten seit dem Widerspruch.',
      begruendungEn: 'Not before three months have passed since the objection.',
    });
  }

  if (e.vorschussAntrag) {
    // „die Vorschußzahlung beginnt spätestens nach Ablauf eines Kalendermonats nach Eingang des Antrags“.
    // Monat wie die übrigen Fristen gerechnet (§§ 187, 188 BGB); ob § 42 SGB I neben der vorläufigen
    // Entscheidung nach § 41a SGB II greift, entscheidet der Kern nicht.
    const roh = plusMonate(e.vorschussAntrag, 1);
    out.push({
      id: 'vorschuss',
      art: 'spaetestens',
      titelDe: 'Vorschuss: Zahlung beginnt spätestens',
      titelEn: 'Advance payment: begins at the latest',
      datum: plusTage(roh, 1),
      normId: 'sgb1_42',
      begruendungDe: 'Nur wenn der Anspruch dem Grunde nach besteht und die Höhe voraussichtlich längere Zeit braucht. Dann muss der Vorschuss auf Antrag gezahlt werden, spätestens nach Ablauf eines Kalendermonats nach Eingang des Antrags. Ob das neben der vorläufigen Entscheidung (§ 41a SGB II) gilt, mit einer Beratung klären.',
      begruendungEn: 'Only if the entitlement exists in principle and fixing the amount is likely to take longer. Then the advance must be paid on application, at the latest after one calendar month from receipt of the application. Whether this applies alongside a provisional decision (section 41a SGB II): ask an advice centre.',
    });
  }

  if (e.widerspruchsbescheidBekanntgabe) {
    const k = fristEnde(e.widerspruchsbescheidBekanntgabe, 1, ft);
    out.push({
      id: 'klage',
      art: 'frist',
      titelDe: 'Klage beim Sozialgericht',
      titelEn: 'Action at the social court',
      datum: k.datum,
      verschobenVon: k.verschobenVon,
      normId: 'sgg87',
      begruendungDe: 'Binnen eines Monats nach Bekanntgabe des Widerspruchsbescheids. Das Verfahren ist für Leistungsberechtigte kostenfrei (§ 183 SGG).',
      begruendungEn: 'Within one month of notification of the objection decision. Proceedings are free of court fees for benefit recipients (section 183 SGG).',
    });
    out.push({
      id: 'eks-nachweise',
      art: 'hinweis',
      titelDe: 'Nachweise zählen nur bis zum Widerspruchsbescheid',
      titelEn: 'Evidence counts only until the objection decision',
      datum: null,
      normId: 'sgb2_41a',
      begruendungDe: 'Nachweise zum Einkommen, die nach Abschluss des Verwaltungsverfahrens eingehen, werden seit 01.07.2026 nicht mehr berücksichtigt.',
      begruendungEn: 'Since 1 July 2026, income evidence received after the administrative procedure ends is no longer taken into account.',
    });
  }

  if (e.bezugsbeginn) {
    out.push({
      id: 'pruefung-selbstaendigkeit',
      art: 'spaetestens',
      titelDe: 'Prüfung, ob ein Verweis auf eine Beschäftigung zumutbar ist',
      titelEn: 'Review whether referral to employment is reasonable',
      datum: plusMonate(e.bezugsbeginn, 12),
      normId: 'sgb2_10',
      begruendungDe: 'Spätestens nach einem Jahr ununterbrochenen Leistungsbezugs prüft das Jobcenter. Gut, bis dahin Zahlen und Meilensteine bereitzuhalten.',
      begruendungEn: 'At the latest after one year of uninterrupted benefit receipt the job centre reviews. Have figures and milestones ready by then.',
    });
  }

  if (e.einstiegsgeldBeginn) {
    out.push({
      id: 'einstiegsgeld-hoechstdauer',
      art: 'spaetestens',
      titelDe: 'Letzter möglicher Tag Einstiegsgeld',
      titelEn: 'Last possible day of start-up grant',
      datum: plusTage(plusMonate(e.einstiegsgeldBeginn, 24), -1),
      normId: 'sgb2_16b',
      begruendungDe: 'Höchstens 24 Monate. Die tatsächliche Dauer steht im Bescheid und kann kürzer sein.',
      begruendungEn: 'At most 24 months. The actual duration is in the notice and may be shorter.',
    });
  }

  if (e.bewilligungsEnde) {
    out.push({
      id: 'vorlaeufig-gilt-als-festgesetzt',
      art: 'spaetestens',
      titelDe: 'Vorläufige Leistungen gelten als festgesetzt',
      titelEn: 'Provisional benefits are deemed final',
      datum: plusMonate(e.bewilligungsEnde, 12),
      normId: 'sgb2_41a',
      begruendungDe: 'Ohne abschließende Entscheidung innerhalb eines Jahres nach Ende des Bewilligungszeitraums. Die Anlage EKS trotzdem fristgemäß einreichen.',
      begruendungEn: 'Without a final decision within one year after the end of the approval period. Still submit the income statement (Anlage EKS) on time.',
    });
  }

  const rang = (f: FristEintrag) => (f.datum ? parseIso(f.datum).getTime() : -Infinity);
  return out.sort((a, b) => rang(a) - rang(b));
}

// ---------------------------------------------------------------- Reihenfolge

export type Reihenfolge = 'antrag-vor-start' | 'gleicher-tag' | 'start-vor-antrag' | 'unbekannt';

/**
 * Reihenfolge von Antrag und Start der Tätigkeit (§ 37 Abs. 2 SGB II).
 * Fehlt ein Datum, ist das Ergebnis „unbekannt“, nie ein Rechtsurteil.
 * „gleicher-tag“ ist ein Grenzfall: mit der Beratung klären.
 */
export function pruefeReihenfolge(antrag?: IsoDatum, start?: IsoDatum): { ergebnis: Reihenfolge; normId: 'sgb2_37' } {
  if (!antrag || !start) return { ergebnis: 'unbekannt', normId: 'sgb2_37' };
  const a = parseIso(antrag).getTime();
  const s = parseIso(start).getTime();
  return { ergebnis: a < s ? 'antrag-vor-start' : a === s ? 'gleicher-tag' : 'start-vor-antrag', normId: 'sgb2_37' };
}

/** Normstand älter als `maxMonate` (Standard 12)? Dann vor Nutzung neu gegen die Amtsquelle lesen. */
export function normstandVeraltet(heute: IsoDatum, geprueftAm: IsoDatum = RECHTSSTAND.geprueftAm, maxMonate = 12): boolean {
  return parseIso(heute) > parseIso(plusMonate(geprueftAm, maxMonate));
}

// ---------------------------------------------------------------- Freibetrag

export interface Freibetrag {
  grundabsetzung: number;
  stufe20: number;
  stufe30: number;
  stufe10: number;
  summe: number;
  /** Was vom Einkommen angerechnet wird (Einkommen minus Freibetrag, nicht unter 0) */
  angerechnet: number;
}

const rund = (x: number) => Math.round(x * 100) / 100;

/**
 * Freibetrag bei Erwerbseinkommen nach § 11b Abs. 2, 3 SGB II (Fassung 2023,
 * unverändert durch das 13. Änderungsgesetz): 100 € Grundabsetzungsbetrag,
 * 20 % von 100–520 €, 30 % von 520–1.000 €, 10 % von 1.000–1.200 €
 * (1.500 € mit minderjährigem Kind). Höchstens 348 € (ohne Kind).
 *
 * Vereinfachung: Bei Selbständigen ist „Einkommen“ der monatliche Gewinn
 * nach Anlage EKS; höhere tatsächliche Absetzbeträge über 400 € (§ 11b Abs. 2
 * Satz 2) sind nicht modelliert.
 */
export function erwerbstaetigenFreibetrag(einkommen: number, mitKind = false): Freibetrag {
  if (!Number.isFinite(einkommen) || einkommen < 0) throw new Error('Einkommen muss eine Zahl ≥ 0 sein');
  const anteil = (von: number, bis: number, satz: number) => Math.max(0, Math.min(einkommen, bis) - von) * satz;
  const grundabsetzung = Math.min(einkommen, 100);
  const stufe20 = rund(anteil(100, 520, 0.2));
  const stufe30 = rund(anteil(520, 1000, 0.3));
  const stufe10 = rund(anteil(1000, mitKind ? 1500 : 1200, 0.1));
  const summe = rund(grundabsetzung + stufe20 + stufe30 + stufe10);
  return { grundabsetzung, stufe20, stufe30, stufe10, summe, angerechnet: rund(Math.max(0, einkommen - summe)) };
}

// ---------------------------------------------------------------- Entscheidungsbaum

export interface BaumAntwort {
  k: string;
  t: string;
  say: string;
  laws: string[];
  end?: boolean;
  next?: number;
}

export interface BaumSchritt {
  id: string;
  q: string;
  answers: BaumAntwort[];
}

/**
 * Strukturprüfung des Telefon-Entscheidungsbaums: jede Antwort endet oder
 * zeigt auf einen gültigen nächsten Schritt, jede Norm-ID existiert, kein
 * Schritt ist unerreichbar, Antwortschlüssel sind je Schritt eindeutig.
 * Liefert Probleme als Klartext; leer heißt in Ordnung.
 */
export function pruefeBaum(schritte: BaumSchritt[], normIds: Iterable<string>): string[] {
  const normen = new Set(normIds);
  const probleme: string[] = [];
  const erreichbar = new Set<number>([0]);
  schritte.forEach((s, i) => {
    const keys = s.answers.map((a) => a.k);
    if (new Set(keys).size !== keys.length) probleme.push(`${s.id}: doppelte Antwortschlüssel`);
    if (s.answers.length === 0) probleme.push(`${s.id}: keine Antworten`);
    for (const a of s.answers) {
      if (!a.end) {
        if (a.next === undefined) probleme.push(`${s.id}/${a.k}: weder end noch next`);
        else if (a.next > schritte.length || a.next < 0) probleme.push(`${s.id}/${a.k}: next=${a.next} außerhalb`);
        else if (a.next <= i) probleme.push(`${s.id}/${a.k}: next=${a.next} springt zurück`);
        else erreichbar.add(a.next);
      }
      for (const l of a.laws) if (!normen.has(l)) probleme.push(`${s.id}/${a.k}: unbekannte Norm "${l}"`);
      if (!a.say.trim()) probleme.push(`${s.id}/${a.k}: leere Formulierung`);
    }
  });
  schritte.forEach((s, i) => {
    if (!erreichbar.has(i)) probleme.push(`${s.id}: unerreichbar`);
  });
  return probleme;
}

/** Weg durch den Baum: Antwortschlüssel je Schritt → besuchte Schritte und alle zitierten Normen (für die Abschluss-Mail). */
export function geheBaum(schritte: BaumSchritt[], wahl: Record<string, string>): { pfad: string[]; normen: string[]; endeBei: string | null } {
  const pfad: string[] = [];
  const normen: string[] = [];
  let i = 0;
  while (i < schritte.length) {
    const s = schritte[i];
    const a = s.answers.find((x) => x.k === wahl[s.id]);
    if (!a) return { pfad, normen, endeBei: null };
    pfad.push(`${s.id}:${a.k}`);
    for (const l of a.laws) if (!normen.includes(l)) normen.push(l);
    if (a.end) return { pfad, normen, endeBei: s.id };
    i = a.next ?? schritte.length;
  }
  return { pfad, normen, endeBei: null };
}

// ---------------------------------------------------------------- Unterlagen-Mappe

export interface MappenPosten {
  titel: string;
  seiten: number;
}

export interface IndexZeile {
  nr: number;
  titel: string;
  von: number;
  bis: number;
  seiten: number;
}

/** Steht auf jedem Deckblatt: Es belegt nicht, dass die Unterlagen angekommen sind. */
export const DECKBLATT_HINWEIS_DE =
  'Dieses Deckblatt ist kein Zugangsnachweis. Lassen Sie sich den Eingang bestätigen: Eingangsstempel auf einer Kopie oder die Eingangsbestätigung von jobcenter.digital.';

/**
 * Seitenindex für eine Unterlagen-Mappe: Anlage 1 beginnt auf `ersteSeite`
 * (Seite 1 ist das Deckblatt). Seitenzahlen müssen ganze Zahlen ab 1 sein,
 * sonst wirft die Funktion; geraten wird nichts.
 */
export function seitenIndex(posten: MappenPosten[], ersteSeite = 2): { zeilen: IndexZeile[]; gesamt: number } {
  if (!Number.isInteger(ersteSeite) || ersteSeite < 1) throw new Error(`Ungültige erste Seite: ${ersteSeite}`);
  let seite = ersteSeite;
  const zeilen = posten.map((p, i) => {
    if (!Number.isInteger(p.seiten) || p.seiten < 1) throw new Error(`Anlage ${i + 1} (${p.titel}): Seitenzahl ${p.seiten} ist keine ganze Zahl ab 1`);
    const z = { nr: i + 1, titel: p.titel, von: seite, bis: seite + p.seiten - 1, seiten: p.seiten };
    seite += p.seiten;
    return z;
  });
  return { zeilen, gesamt: seite - 1 };
}

// ---------------------------------------------------------------- Sprachwächter

/** Wörter, die eine Ermessensentscheidung als sicher ausgeben würden. */
export const VERSPRECHENSWOERTER = [
  'garantiert',
  'Sie bekommen',
  'wird bewilligt',
  'Anspruch auf Einstiegsgeld',
  'Anspruch auf den Zuschuss',
  'rechtssicher',
  'Anspruch besteht',
  'unzulässig',
  'rechtswidrig',
] as const;

/** Wirft, wenn ein Text eine Förderung verspricht. Einstiegsgeld und Zuschuss sind Kann-Leistungen. */
export function assertKeinVersprechen(text: string): void {
  for (const w of VERSPRECHENSWOERTER) {
    if (text.toLowerCase().includes(w.toLowerCase())) throw new Error(`Versprechenswort im Text: "${w}"`);
  }
}
