/**
 * Umsetzungsplan-Register — Prüfer für Umsetzungspläne nach § 9 EnEfG
 * (Implementation Plan Register — checker for plans under § 9 EnEfG)
 *
 * Reiner, deterministischer TypeScript-Kern: kein DOM, kein Netzwerk, kein Modell.
 * Registerkern (Status, Fundstelle, Abrufdatum, Suchnachweis, Snapshot, CSV,
 * Sprachwächter) kommt aus `src/engine/vernichtungs-offenlegungsregister/` und
 * wird hier nur angepasst, nicht kopiert.
 *
 * SCHEMA-STAND: versioniert nach Merkblattfassung (siehe `FASSUNGEN`).
 *  - BAFA-Merkblatt EnEfG, Stand 16.09.2026: Abschnitt 5 selbst gelesen am
 *    28.09.2026. Es verlangt FÜNF Angaben (Priorisierung, Bezeichnung,
 *    Investitionsvolumen, Zeitrahmen, Umsetzungsfortschritt). Herkunft und
 *    verantwortliche Person sind seit der 7. Änderung (30.04.2026) nicht mehr
 *    im Muster.
 *  - Merkblatt, Stand 12.02.2025: NICHT selbst gelesen. Die sieben Angaben
 *    stammen aus der Reviewer-Lesung (Kopie auf visalvis.de). Stand `vorläufig`.
 *
 * Harte Invarianten (Safety Case):
 *  1. Das Register kennt genau zwei Status: `gefunden` und `kein Plan gefunden`.
 *     Letzterer trägt immer Stand und Suchweg. Kein „säumig", kein „Verstoß",
 *     kein „fehlt", kein „erfüllt"/„grün".
 *  2. Jeder Befund ist eine Frage mit Regel-ID und Klartext De/En.
 *  3. Kein Prüfergebnis enthält ein Gesamturteil.
 *  4. Keine Auswertung bildet eine Quote gegen die geschätzte Zahl der
 *     Verpflichteten und keine Rangfolge nach Unternehmen. Die Auswertung
 *     nennt keine Unternehmen, sie trägt den Selektionshinweis im Kopf.
 *  5. Ein Status außerhalb der Merkblatt-Kategorien wird nicht still einer
 *     Kategorie zugeordnet. Er wird gezählt und erfragt.
 *  6. Ungültige Eingaben (Quelle, Datum, Rechtsstand, Fassung, doppelte IDs,
 *     Widerspruch gefunden/nicht gefunden) werfen einen Fehler.
 *
 * Lizenz: CC0 1.0 Public Domain.
 */

import {
  erstelleRegister,
  registerAlsCsv,
  assertNeutraleSprache,
  istNeutral,
  type Offenlegung,
  type Suchnachweis,
  type RegisterZeile,
} from '../vernichtungs-offenlegungsregister/offenlegungsPruefer';

// ---------------------------------------------------------------------------
// Fassungen und Vokabular
// ---------------------------------------------------------------------------

/** `a. F.` = § 9 EnEfG vor der Novelle, `n. F.` = nach der Novelle (BT-Drs. 21/8027). */
export type Rechtsstand = 'a. F.' | 'n. F.';
export const RECHTSSTAENDE: readonly Rechtsstand[] = ['a. F.', 'n. F.'] as const;

/** Merkblattfassungen, gegen die geprüft werden kann (ISO-Datum des Stands). */
export type MerkblattFassung = '2025-02-12' | '2026-09-16';

/** Stand des Schemas je Fassung. */
export type SchemaStand = 'vorläufig' | `gegen Merkblatt ${string} geprüft am ${string}`;

/** Die Angaben, die ein Merkblatt für jede Maßnahme nennt. */
export type PlanFeld =
  | 'prioritaet'
  | 'massnahme'
  | 'investitionsvolumen'
  | 'zeitrahmen'
  | 'herkunft'
  | 'verantwortlich'
  | 'status';

export const PLAN_FELDER: readonly PlanFeld[] = [
  'prioritaet',
  'massnahme',
  'investitionsvolumen',
  'zeitrahmen',
  'herkunft',
  'verantwortlich',
  'status',
] as const;

export const FELDNAMEN: Readonly<Record<PlanFeld, { de: string; en: string }>> = {
  prioritaet: { de: 'Priorität', en: 'priority' },
  massnahme: { de: 'Maßnahmenbezeichnung', en: 'measure name' },
  investitionsvolumen: { de: 'Investitionsvolumen', en: 'investment volume' },
  zeitrahmen: { de: 'Zeitrahmen', en: 'time frame' },
  herkunft: { de: 'Herkunft der Maßnahme', en: 'origin of the measure' },
  verantwortlich: { de: 'verantwortliche Person', en: 'responsible person' },
  status: { de: 'Status (Umsetzungsfortschritt)', en: 'status (implementation progress)' },
};

/** Eine Merkblattfassung mit ihren Angaben und ihrem Lesestand. */
export interface Fassung {
  id: MerkblattFassung;
  standDe: string;
  pflichtangaben: readonly PlanFeld[];
  schemaStand: SchemaStand;
  /** Auf welchen § 9 sich die Fassung bezieht. */
  rechtsstand: Rechtsstand;
  gelesenDe: string;
  quelle: string;
}

export const FASSUNGEN: Readonly<Record<MerkblattFassung, Fassung>> = {
  '2026-09-16': {
    id: '2026-09-16',
    standDe: '16.09.2026',
    pflichtangaben: ['prioritaet', 'massnahme', 'investitionsvolumen', 'zeitrahmen', 'status'],
    schemaStand: 'gegen Merkblatt 16.09.2026 geprüft am 2026-09-28',
    rechtsstand: 'a. F.',
    gelesenDe:
      'Abschnitt 5 selbst gelesen am 28.09.2026 (PDF, 20 S., sha256 1a62fa7dac0253e007eca19a32b9c12395d3d272e600b7f839d869dbc435d529)',
    quelle:
      'https://www.bafa.de/SharedDocs/Downloads/DE/Energie/ea_merkblatt_energieefffizienzgesetz.pdf?__blob=publicationFile&v=14',
  },
  '2025-02-12': {
    id: '2025-02-12',
    standDe: '12.02.2025',
    pflichtangaben: ['prioritaet', 'massnahme', 'investitionsvolumen', 'zeitrahmen', 'herkunft', 'verantwortlich', 'status'],
    schemaStand: 'vorläufig',
    rechtsstand: 'a. F.',
    gelesenDe:
      'Nicht selbst gelesen. Sieben Angaben laut Reviewer-Lesung (Kopie auf visalvis.de), 06-suche/amelie-classification-log.md',
    quelle: 'visalvis.de (Kopie des BAFA-Merkblatts, Stand 12.02.2025; URL nicht festgehalten)',
  },
};

/** Die zum Bauzeitpunkt gültige Fassung. */
export const AKTUELLE_FASSUNG: MerkblattFassung = '2026-09-16';

/** Kategorien des Umsetzungsfortschritts laut Merkblatt („kann … erfolgen"). */
export type StatusKategorie = 'Offen' | 'In Bearbeitung' | 'Abgeschlossen';
export const STATUS_VOKABULAR: readonly StatusKategorie[] = ['Offen', 'In Bearbeitung', 'Abgeschlossen'] as const;

/** Fest im Kopf jeder Auswertung (Wortlaut der Dose). */
export const SELEKTIONSHINWEIS_DE =
  'Veröffentlicht haben die, die veröffentlichen. Die Umsetzungsquote der gefundenen Pläne beschreibt diese Pläne, nicht die Branche und nicht alle Verpflichteten.';
export const SELEKTIONSHINWEIS_EN =
  'Those who published are those who publish. The implementation rate of the plans found describes these plans, not the sector and not all obliged companies.';

// ---------------------------------------------------------------------------
// Typen
// ---------------------------------------------------------------------------

/** Wert eines Feldes, das die Quelle nicht lesbar hergibt (z. B. geschwärzt). */
export type Unbekannt = 'unbekannt';

/** Herkunft der Daten eines Eintrags. */
export type Datenart = 'veroeffentlichter-plan' | 'merkblatt-muster' | 'synthetisch';
export const DATENARTEN: readonly Datenart[] = ['veroeffentlichter-plan', 'merkblatt-muster', 'synthetisch'] as const;

/** Eine Zeile des Plans, wortgetreu übertragen (Texte wie im Dokument). */
export interface Massnahme {
  id: string;
  prioritaet?: string;
  massnahme?: string;
  investitionsvolumen?: string;
  zeitrahmen?: string;
  herkunft?: string;
  verantwortlich?: string;
  status?: string;
}

/** Herkunft eines Plans. */
export interface PlanQuelle {
  url: string;
  /** ISO-Datum JJJJ-MM-TT */
  abgerufenAm: string;
  archivSnapshot?: string;
  /** SHA-256 der abgerufenen Datei, falls festgehalten */
  sha256?: string;
}

/** Ein übertragener Umsetzungsplan eines Unternehmens zu einem Planstand. */
export interface Umsetzungsplan {
  unternehmen: string;
  datenart: Datenart;
  rechtsstand: Rechtsstand;
  /** Fassung, gegen die geprüft wird */
  merkblattFassung: MerkblattFassung;
  /** JJJJ-MM oder JJJJ-MM-TT */
  erstellt: string;
  aktualisiert?: string;
  format: 'tabelle' | 'freitext';
  quelle: PlanQuelle;
  /** Verantwortliche Person im Kopf des Plans (gilt für alle Zeilen ohne eigene Angabe) */
  verantwortlichPlan?: string;
  /** Summenzeile oder Gesamtvolumen, wortgetreu */
  gesamtInvestitionsvolumen?: string;
  massnahmen: Massnahme[];
  anmerkung?: string;
}

/** Die deterministischen Regeln. */
export type RegelId =
  | 'U0-FREITEXT'
  | 'U1-ANGABE'
  | 'U2-STATUS'
  | 'U3-ZEITRAHMEN'
  | 'U4-INVESTITION'
  | 'U5-SUMME'
  | 'U6-ZEITRAHMEN-ABGELAUFEN'
  | 'U7-RECHTSSTAND';

/** Ein Befund ist immer eine Frage an die Übertragung, nie ein Urteil. */
export interface Befund {
  regel: RegelId;
  art: 'frage';
  massnahme: string | null;
  frageDe: string;
  frageEn: string;
}

/** Eine Betragsspanne in Euro; `ohneBetrag` zählt Maßnahmen ohne lesbaren Betrag. */
export interface Spanne {
  vonEuro: number;
  bisEuro: number;
  ohneBetrag: number;
}

/** Zählung nach Status. */
export interface StatusVerteilung {
  Offen: number;
  'In Bearbeitung': number;
  Abgeschlossen: number;
  ausserhalbVokabular: number;
  unbekannt: number;
}

/** Ergebnis von `pruefeUmsetzungsplan`. Enthält bewusst kein Gesamturteil. */
export interface PlanErgebnis {
  unternehmen: string;
  datenart: Datenart;
  /** JJJJ-MM */
  planstand: string;
  rechtsstand: Rechtsstand;
  merkblattFassung: MerkblattFassung;
  schemaStatus: SchemaStand;
  befunde: Befund[];
  felderUnbekannt: string[];
  statusVerteilung: StatusVerteilung;
  /** Wortlaut außerhalb des Vokabulars → Anzahl */
  statusAusserhalbVokabular: Record<string, number>;
  investitionOffen: Spanne;
  investitionAusserhalbVokabular: Spanne;
  investitionGesamt: Spanne;
}

/** Ergebnis von `werteAus`. Nennt keine Unternehmen und keine Quote. */
export interface Auswertung {
  selektionshinweisDe: string;
  selektionshinweisEn: string;
  anzahlPlaene: number;
  davonKeinVeroeffentlichterPlan: number;
  anzahlMassnahmen: number;
  statusVerteilung: StatusVerteilung;
  statusAusserhalbVokabular: Record<string, number>;
  investitionOffen: Spanne;
  investitionAusserhalbVokabular: Spanne;
  schemaStaende: string[];
  satzDe: string;
  satzEn: string;
}

// ---------------------------------------------------------------------------
// Sprachwächter
// ---------------------------------------------------------------------------

/** Zusätzlich zu den Wörtern des Registerkerns: kein „fehlt", kein Pranger. */
export const ZUSAETZLICH_VERBOTEN: readonly RegExp[] = [/\bfehlt\b/i, /\bfehlen\b/i, /pranger/i];

/**
 * Wirft, wenn ein Text ein Vorwurfswort enthält: die Liste des Registerkerns
 * (`assertNeutraleSprache`) plus `ZUSAETZLICH_VERBOTEN`.
 */
export function assertNeutral(text: string): string {
  assertNeutraleSprache(text);
  for (const m of ZUSAETZLICH_VERBOTEN) {
    if (m.test(text)) throw new Error(`Unzulässiges Wort in Ausgabe: ${m.source}`);
  }
  return text;
}

function neutral(text: string): boolean {
  return istNeutral(text) && !ZUSAETZLICH_VERBOTEN.some((m) => m.test(text));
}

/** Zählschlüssel für Statuswörter, die selbst ein Vorwurfswort enthalten. */
export const NICHT_ZITIERT = '(Wortlaut nicht zitiert)';

/** Zitiert übertragenen Text nur, wenn er neutral ist; sonst verweist er auf die Zeile. */
function zitat(text: string, id: string): { de: string; en: string } {
  const t = text.trim();
  return neutral(t) ? { de: `„${t}"`, en: `"${t}"` } : { de: `in Zeile ${id}`, en: `in row ${id}` };
}

function befund(regel: RegelId, massnahme: string | null, frageDe: string, frageEn: string): Befund {
  if (!frageDe.trim().endsWith('?') || !frageEn.trim().endsWith('?')) {
    throw new Error(`Befund ${regel} ist nicht als Frage formuliert`);
  }
  assertNeutral(frageDe);
  assertNeutral(frageEn);
  return { regel, art: 'frage', massnahme, frageDe, frageEn };
}

// ---------------------------------------------------------------------------
// Beträge
// ---------------------------------------------------------------------------

const ZAHL_DE = /^(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d{1,2})?$/;

function zahlInCent(token: string): number | null {
  const t = token.trim();
  if (!ZAHL_DE.test(t)) return null;
  const [ganz, dezimal = ''] = t.replace(/\./g, '').split(',');
  return Number(ganz) * 100 + Number(dezimal.padEnd(2, '0'));
}

/**
 * Liest ein Investitionsvolumen, wie es in Plänen steht: Einzelbetrag
 * („2.575.074,00 €"), Bandbreite („2.000 € - 5.000 €"), Obergrenze
 * („bis 20.000 €", Untergrenze 0), „ca." sowie „T€"/„TEUR"/„Mio.".
 * Liefert `null`, wenn der Text kein Betrag ist („auf Anfrage", „ab 5.000 €").
 */
export function leseBetrag(text: string): { vonCent: number; bisCent: number } | null {
  let t = text.replace(/ /g, ' ').trim();
  let faktor = 1;
  const mio = /\s*(?:Mio\.?|Millionen)\s*(?:€|EUR)?\s*$/i;
  const tsd = /\s*(?:T€|TEUR|Tsd\.?\s*(?:€|EUR)?)\s*$/i;
  if (mio.test(t)) {
    faktor = 1_000_000;
    t = t.replace(mio, '');
  } else if (tsd.test(t)) {
    faktor = 1_000;
    t = t.replace(tsd, '');
  }
  t = t.replace(/€|EUR/gi, '').replace(/\s+/g, ' ').trim();
  let bisPraefix = false;
  if (/^bis\s/i.test(t)) {
    bisPraefix = true;
    t = t.replace(/^bis\s+/i, '');
  }
  t = t.replace(/^(?:ca\.|rd\.|etwa)\s*/i, '');
  const teile = t.split(/\s*[–-]\s*|\s+bis\s+/i);
  if (teile.length > 2 || (bisPraefix && teile.length !== 1)) return null;
  const cents = teile.map(zahlInCent);
  if (cents.some((c) => c === null)) return null;
  const [a, b] = cents as number[];
  const mal = (c: number) => Math.round(c * faktor);
  if (bisPraefix) return { vonCent: 0, bisCent: mal(a) };
  if (teile.length === 1) return { vonCent: mal(a), bisCent: mal(a) };
  return { vonCent: mal(a), bisCent: mal(b) };
}

function euroText(cent: number): string {
  const ganz = Math.floor(cent / 100);
  const rest = cent % 100;
  const tausender = String(ganz).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return rest === 0 ? `${tausender} €` : `${tausender},${String(rest).padStart(2, '0')} €`;
}

/** Klartext einer Spanne, z. B. „32.000 € – 45.000 €". */
export function spanneText(s: Spanne): string {
  const von = Math.round(s.vonEuro * 100);
  const bis = Math.round(s.bisEuro * 100);
  const basis = von === bis ? euroText(von) : `${euroText(von)} – ${euroText(bis)}`;
  return s.ohneBetrag > 0 ? `${basis} (zuzüglich ${s.ohneBetrag} ohne lesbaren Betrag)` : basis;
}

// ---------------------------------------------------------------------------
// Zeitrahmen
// ---------------------------------------------------------------------------

const MONATE: Readonly<Record<string, number>> = {
  januar: 1, jan: 1, februar: 2, feb: 2, 'märz': 3, maerz: 3, 'mär': 3, mrz: 3, april: 4, apr: 4,
  mai: 5, juni: 6, jun: 6, juli: 7, jul: 7, august: 8, aug: 8, september: 9, sep: 9, sept: 9,
  oktober: 10, okt: 10, november: 11, nov: 11, dezember: 12, dez: 12,
};

interface Token {
  jahr: number | null;
  vonMonat: number;
  bisMonat: number;
}

function leseToken(roh: string): Token | null {
  const t = roh.trim().replace(/\s+/g, ' ');
  let m: RegExpMatchArray | null;
  if ((m = t.match(/^(\d{1,2})\/(\d{4})$/))) {
    const mo = Number(m[1]);
    return mo >= 1 && mo <= 12 ? { jahr: Number(m[2]), vonMonat: mo, bisMonat: mo } : null;
  }
  if ((m = t.match(/^(\d{4})-(\d{2})$/))) {
    const mo = Number(m[2]);
    return mo >= 1 && mo <= 12 ? { jahr: Number(m[1]), vonMonat: mo, bisMonat: mo } : null;
  }
  if ((m = t.match(/^\d{1,2}\.(\d{1,2})\.(\d{4})$/))) {
    const mo = Number(m[1]);
    return mo >= 1 && mo <= 12 ? { jahr: Number(m[2]), vonMonat: mo, bisMonat: mo } : null;
  }
  if ((m = t.match(/^Q([1-4])(?:\s*[/ ]\s*(\d{4}))?$/i))) {
    const q = Number(m[1]);
    return { jahr: m[2] ? Number(m[2]) : null, vonMonat: q * 3 - 2, bisMonat: q * 3 };
  }
  if ((m = t.match(/^(\d{4})$/))) return { jahr: Number(m[1]), vonMonat: 1, bisMonat: 12 };
  if ((m = t.match(/^([A-Za-zÄÖÜäöü]+)\.?(?:\s+(\d{4}))?$/))) {
    const mo = MONATE[m[1].toLowerCase()];
    return mo ? { jahr: m[2] ? Number(m[2]) : null, vonMonat: mo, bisMonat: mo } : null;
  }
  return null;
}

const ym = (jahr: number, monat: number) => `${jahr}-${String(monat).padStart(2, '0')}`;

/** Ergebnis von `leseZeitrahmen`. */
export type Zeitrahmen =
  | { ok: true; beginn: string | null; ende: string; mehrteilig: boolean }
  | { ok: false; grund: 'format' | 'reihenfolge' };

/**
 * Liest einen Zeitrahmen, wie er in Plänen steht: „07/2022 - 03/2027",
 * „Februar 2025 - Juni 2025", „Q2 - Q3 2024", „Q3/2024 -12/2025",
 * mehrteilig mit „&" („Q2/2024 & Q1 - Q2/2026"). Fehlt am Anfang das Jahr,
 * gilt das Jahr des Endes. Ein einzelner Zeitpunkt ist das Ende (Merkblatt:
 * „bis wann die Umsetzung … abgeschlossen sein soll").
 */
export function leseZeitrahmen(text: string): Zeitrahmen {
  const segmente = text.replace(/ /g, ' ').split(/\s*[&;]\s*/).filter((s) => s.trim() !== '');
  if (segmente.length === 0) return { ok: false, grund: 'format' };
  const spannen: { von: string; bis: string }[] = [];
  for (const seg of segmente) {
    const roh = seg.trim().replace(/^bis\s+/i, '');
    const teile = roh.split(/\s*[–-]\s*/);
    if (teile.length > 2) return { ok: false, grund: 'format' };
    const tokens = teile.map(leseToken);
    if (tokens.some((x) => x === null)) return { ok: false, grund: 'format' };
    const [a, b] = tokens as Token[];
    if (!b) {
      if (a.jahr === null) return { ok: false, grund: 'format' };
      spannen.push({ von: ym(a.jahr, a.vonMonat), bis: ym(a.jahr, a.bisMonat) });
      continue;
    }
    if (b.jahr === null) return { ok: false, grund: 'format' };
    const jahrA = a.jahr ?? b.jahr;
    const von = ym(jahrA, a.vonMonat);
    const bis = ym(b.jahr, b.bisMonat);
    if (von > bis) return { ok: false, grund: 'reihenfolge' };
    spannen.push({ von, bis });
  }
  const ende = spannen.map((s) => s.bis).sort().at(-1) as string;
  const einzeln = segmente.length === 1 && !/[–-]/.test(segmente[0].replace(/^bis\s+/i, ''));
  const beginn = einzeln ? null : (spannen.map((s) => s.von).sort()[0] as string);
  return { ok: true, beginn, ende, mehrteilig: segmente.length > 1 };
}

// ---------------------------------------------------------------------------
// Eingabeprüfung
// ---------------------------------------------------------------------------

const ISO_DATUM = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const PLANSTAND = /^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/;

function pruefeText(wert: unknown, feld: string): string {
  if (typeof wert !== 'string' || wert.trim() === '') throw new Error(`${feld} fehlt oder ist leer`);
  if (/[\r\n]/.test(wert)) throw new Error(`${feld}: Zeilenumbruch nicht erlaubt`);
  return wert;
}

function pruefeIsoDatum(wert: unknown, feld: string): string {
  if (typeof wert !== 'string' || !ISO_DATUM.test(wert) || Number.isNaN(Date.parse(wert))) {
    throw new Error(`${feld}: kein gültiges ISO-Datum (JJJJ-MM-TT): ${String(wert)}`);
  }
  return wert;
}

function pruefePlanstand(wert: unknown, feld: string): string {
  if (typeof wert !== 'string' || !PLANSTAND.test(wert)) {
    throw new Error(`${feld}: JJJJ-MM oder JJJJ-MM-TT erwartet: ${String(wert)}`);
  }
  return wert.slice(0, 7);
}

const leer = (v: string | undefined): boolean => v === undefined || v.trim() === '';

// ---------------------------------------------------------------------------
// Prüfer
// ---------------------------------------------------------------------------

const leereSpanne = (): { von: number; bis: number; ohne: number } => ({ von: 0, bis: 0, ohne: 0 });
const alsSpanne = (s: { von: number; bis: number; ohne: number }): Spanne => ({
  vonEuro: s.von / 100,
  bisEuro: s.bis / 100,
  ohneBetrag: s.ohne,
});

function statusKategorie(wert: string): StatusKategorie | null {
  const n = wert.trim().replace(/\s+/g, ' ').toLowerCase();
  return STATUS_VOKABULAR.find((k) => k.toLowerCase() === n) ?? null;
}

/**
 * Prüft einen übertragenen Umsetzungsplan deterministisch gegen eine
 * Merkblattfassung (Standard: die im Plan genannte). Ohne Netz, ohne Modell.
 * Jeder Befund ist eine Frage.
 *
 * Regeln: U0 Freitext ohne Tabelle · U1 Angabe der Fassung nicht übertragen ·
 * U2 Status außerhalb der Merkblatt-Kategorien · U3 Zeitrahmen nicht lesbar
 * oder vertauscht · U4 Investitionsvolumen kein Betrag · U5 Gesamtsumme passt
 * nicht zu den Einzelwerten · U6 Zeitrahmen vor dem Planstand abgelaufen, Status
 * nicht „Abgeschlossen" · U7 Rechtsstand des Plans ≠ Rechtsstand der Fassung.
 *
 * Liefert zusätzlich Statusverteilung und Investitionssumme der offenen
 * Maßnahmen. Eine Maßnahme zählt nur dann als offen, wenn ihr Status „Offen"
 * lautet — andere Wörter werden nicht umgedeutet.
 *
 * @throws bei ungültiger Eingabe (siehe Invariante 6)
 */
export function pruefeUmsetzungsplan(plan: Umsetzungsplan, optionen: { fassung?: MerkblattFassung } = {}): PlanErgebnis {
  const unternehmen = pruefeText(plan?.unternehmen, 'unternehmen');
  if (!DATENARTEN.includes(plan.datenart)) throw new Error(`${unternehmen}: unbekannte Datenart ${String(plan.datenart)}`);
  if (!RECHTSSTAENDE.includes(plan.rechtsstand)) {
    throw new Error(`${unternehmen}: Rechtsstand muss „a. F." oder „n. F." sein, nicht ${String(plan.rechtsstand)}`);
  }
  const fassungId = optionen.fassung ?? plan.merkblattFassung;
  const fassung = FASSUNGEN[fassungId as MerkblattFassung];
  if (!fassung) throw new Error(`${unternehmen}: unbekannte Merkblattfassung ${String(fassungId)}`);
  const erstellt = pruefePlanstand(plan.erstellt, `${unternehmen}: erstellt`);
  const aktualisiert = plan.aktualisiert === undefined ? null : pruefePlanstand(plan.aktualisiert, `${unternehmen}: aktualisiert`);
  if (aktualisiert !== null && aktualisiert < erstellt) throw new Error(`${unternehmen}: aktualisiert liegt vor erstellt`);
  const planstand = aktualisiert ?? erstellt;
  if (!plan.quelle || typeof plan.quelle.url !== 'string' || !/^https?:\/\//.test(plan.quelle.url)) {
    throw new Error(`${unternehmen}: Quell-URL fehlt oder ist ungültig`);
  }
  pruefeIsoDatum(plan.quelle.abgerufenAm, `${unternehmen}: quelle.abgerufenAm`);
  if (plan.format !== 'tabelle' && plan.format !== 'freitext') throw new Error(`Unbekanntes Format: ${String(plan.format)}`);
  if (!Array.isArray(plan.massnahmen)) throw new Error('massnahmen muss ein Array sein');
  if (plan.format === 'tabelle' && plan.massnahmen.length === 0) {
    throw new Error('Format „tabelle" ohne Maßnahmen — als „freitext" übertragen oder Zeilen ergänzen');
  }
  const ids = new Set<string>();
  for (const m of plan.massnahmen) {
    if (typeof m.id !== 'string' || m.id.trim() === '') throw new Error('Maßnahme ohne id');
    if (ids.has(m.id)) throw new Error(`Doppelte Maßnahmen-ID: ${m.id}`);
    ids.add(m.id);
    for (const f of PLAN_FELDER) {
      const v = m[f];
      if (v !== undefined && typeof v !== 'string') throw new Error(`${m.id}.${f}: Zeichenkette erwartet`);
    }
  }

  const befunde: Befund[] = [];
  const felderUnbekannt: string[] = [];

  // U7 — Rechtsstand
  if (plan.rechtsstand !== fassung.rechtsstand) {
    befunde.push(
      befund(
        'U7-RECHTSSTAND',
        null,
        `Der Plan ist als § 9 EnEfG ${plan.rechtsstand} erfasst, das Merkblatt (Stand ${fassung.standDe}) beschreibt § 9 in der Fassung ${fassung.rechtsstand === 'a. F.' ? 'vor' : 'nach'} der Novelle. Gibt es schon eine Merkblattfassung zu diesem Rechtsstand?`,
        `The plan is recorded under § 9 EnEfG ${plan.rechtsstand}, but the guidance (as of ${fassung.standDe}) describes § 9 as it stood ${fassung.rechtsstand === 'a. F.' ? 'before' : 'after'} the amendment. Is there a guidance version for this legal state yet?`
      )
    );
  }

  // U0 — Freitext
  if (plan.format === 'freitext') {
    befunde.push(
      befund(
        'U0-FREITEXT',
        null,
        'Der Plan liegt nur als Fließtext vor, ohne Tabelle. Lassen sich Maßnahmen, Investitionsvolumen, Zeitrahmen und Status daraus von Hand übertragen?',
        'The plan is prose only, without a table. Can measures, investment volume, time frame and status be transcribed from it by hand?'
      )
    );
    if (plan.massnahmen.length === 0) felderUnbekannt.push(...PLAN_FELDER.map((f) => `*.${f}`));
  }

  // U1 — Angaben der Fassung
  for (const f of fassung.pflichtangaben) {
    if (plan.massnahmen.length === 0) break;
    const ohne = plan.massnahmen.filter((m) => {
      if (f === 'verantwortlich' && !leer(plan.verantwortlichPlan)) return false;
      return leer(m[f]);
    });
    if (ohne.length === 0) continue;
    if (f === 'investitionsvolumen' && ohne.length === plan.massnahmen.length && !leer(plan.gesamtInvestitionsvolumen)) {
      // Merkblatt-Fußnote: statt Einzelwerten darf nur das Gesamtvolumen stehen.
      continue;
    }
    const n = FELDNAMEN[f];
    if (ohne.length === plan.massnahmen.length) {
      befunde.push(
        befund(
          'U1-ANGABE',
          null,
          `Der Plan nennt in keiner Zeile die Angabe „${n.de}", die das Merkblatt (Stand ${fassung.standDe}) aufführt. Steht sie an anderer Stelle im Dokument?`,
          `The plan gives no "${n.en}" in any row, which the guidance (as of ${fassung.standDe}) lists. Is it stated elsewhere in the document?`
        )
      );
    } else {
      for (const m of ohne) {
        befunde.push(
          befund(
            'U1-ANGABE',
            m.id,
            `Zeile ${m.id}: Hier ist keine Angabe „${n.de}" übertragen. Ist das Feld im Dokument leer, oder wurde es beim Übertragen übersprungen?`,
            `Row ${m.id}: no "${n.en}" is transcribed here. Is the field empty in the document, or was it skipped during transcription?`
          )
        );
      }
    }
  }

  const verteilung: StatusVerteilung = { Offen: 0, 'In Bearbeitung': 0, Abgeschlossen: 0, ausserhalbVokabular: 0, unbekannt: 0 };
  const ausserhalb: Record<string, number> = {};
  const offen = leereSpanne();
  const fremd = leereSpanne();
  const gesamt = leereSpanne();

  for (const m of plan.massnahmen) {
    for (const f of PLAN_FELDER) if (m[f]?.trim() === 'unbekannt') felderUnbekannt.push(`${m.id}.${f}`);

    // U2 — Status
    let kategorie: StatusKategorie | null = null;
    let statusBekannt = false;
    if (leer(m.status) || m.status!.trim() === 'unbekannt') {
      verteilung.unbekannt += 1;
    } else {
      statusBekannt = true;
      kategorie = statusKategorie(m.status!);
      if (kategorie) {
        verteilung[kategorie] += 1;
      } else {
        verteilung.ausserhalbVokabular += 1;
        const wort = m.status!.trim().replace(/\s+/g, ' ');
        const schluesselWort = neutral(wort) ? wort : NICHT_ZITIERT;
        ausserhalb[schluesselWort] = (ausserhalb[schluesselWort] ?? 0) + 1;
        const z = zitat(wort, m.id);
        befunde.push(
          befund(
            'U2-STATUS',
            m.id,
            `Zeile ${m.id}: Der Status ${z.de} gehört nicht zu den Kategorien des Merkblatts (Offen, In Bearbeitung, Abgeschlossen). Welcher Kategorie entspricht er?`,
            `Row ${m.id}: the status ${z.en} is not one of the guidance categories (Open, In progress, Completed). Which category does it correspond to?`
          )
        );
      }
    }

    // U4 — Investitionsvolumen
    let betrag: { vonCent: number; bisCent: number } | null = null;
    if (!leer(m.investitionsvolumen) && m.investitionsvolumen!.trim() !== 'unbekannt') {
      betrag = leseBetrag(m.investitionsvolumen!);
      const z = zitat(m.investitionsvolumen!, m.id);
      if (betrag === null) {
        befunde.push(
          befund(
            'U4-INVESTITION',
            m.id,
            `Zeile ${m.id}: Das Investitionsvolumen ${z.de} ist weder Betrag noch Bandbreite in Euro. Ist der Betrag bewusst nicht genannt (Geschäftsgeheimnis), oder anders angegeben?`,
            `Row ${m.id}: the investment volume ${z.en} is neither an amount nor a range in euros. Is the amount deliberately withheld (trade secret), or stated differently?`
          )
        );
      } else if (betrag.vonCent > betrag.bisCent) {
        befunde.push(
          befund(
            'U4-INVESTITION',
            m.id,
            `Zeile ${m.id}: Bei ${z.de} liegt die Untergrenze über der Obergrenze. Ist die Bandbreite vertauscht?`,
            `Row ${m.id}: in ${z.en} the lower bound exceeds the upper bound. Is the range reversed?`
          )
        );
        betrag = null;
      }
    }
    const buche = (s: { von: number; bis: number; ohne: number }) => {
      if (betrag) {
        s.von += betrag.vonCent;
        s.bis += betrag.bisCent;
      } else s.ohne += 1;
    };
    buche(gesamt);
    if (kategorie === 'Offen') buche(offen);
    if (statusBekannt && kategorie === null) buche(fremd);

    // U3 / U6 — Zeitrahmen
    if (!leer(m.zeitrahmen) && m.zeitrahmen!.trim() !== 'unbekannt') {
      const zr = leseZeitrahmen(m.zeitrahmen!);
      const z = zitat(m.zeitrahmen!, m.id);
      if (!zr.ok) {
        befunde.push(
          zr.grund === 'format'
            ? befund(
                'U3-ZEITRAHMEN',
                m.id,
                `Zeile ${m.id}: Der Zeitrahmen ${z.de} lässt sich nicht als Monat oder Quartal mit Jahr lesen. Wie ist er gemeint?`,
                `Row ${m.id}: the time frame ${z.en} cannot be read as a month or quarter with a year. What is meant?`
              )
            : befund(
                'U3-ZEITRAHMEN',
                m.id,
                `Zeile ${m.id}: Der Zeitrahmen ${z.de} endet vor seinem Beginn. Sind Anfang und Ende vertauscht?`,
                `Row ${m.id}: the time frame ${z.en} ends before it begins. Are start and end swapped?`
              )
        );
      } else if (zr.ende < planstand && statusBekannt && kategorie !== 'Abgeschlossen') {
        befunde.push(
          befund(
            'U6-ZEITRAHMEN-ABGELAUFEN',
            m.id,
            `Zeile ${m.id}: Der Zeitrahmen endet ${zr.ende}, vor dem Planstand ${planstand}, und der Status ist nicht „Abgeschlossen". Ist der Status zum Planstand noch aktuell?`,
            `Row ${m.id}: the time frame ends ${zr.ende}, before the plan date ${planstand}, and the status is not "Completed". Is the status still current as of the plan date?`
          )
        );
      }
    }
  }

  // U5 — Gesamtsumme
  if (!leer(plan.gesamtInvestitionsvolumen)) {
    const g = leseBetrag(plan.gesamtInvestitionsvolumen!);
    const z = zitat(plan.gesamtInvestitionsvolumen!, 'Summe');
    if (g === null) {
      befunde.push(
        befund(
          'U4-INVESTITION',
          null,
          `Das Gesamtinvestitionsvolumen ${z.de} ist weder Betrag noch Bandbreite in Euro. Wie ist es angegeben?`,
          `The total investment volume ${z.en} is neither an amount nor a range in euros. How is it stated?`
        )
      );
    } else if (gesamt.ohne === 0 && plan.massnahmen.length > 0) {
      const toleranz = 100; // 1 € Rundung
      if (g.vonCent < gesamt.von - toleranz || g.bisCent > gesamt.bis + toleranz) {
        const summe = spanneText(alsSpanne(gesamt));
        befunde.push(
          befund(
            'U5-SUMME',
            null,
            `Die angegebene Gesamtsumme ${z.de} liegt außerhalb der Summe der Einzelwerte (${summe}). Ist eine Zeile nicht übertragen, oder enthält die Summe weitere Posten?`,
            `The stated total ${z.en} lies outside the sum of the rows (${summe}). Was a row not transcribed, or does the total include other items?`
          )
        );
      }
    }
  }

  return {
    unternehmen,
    datenart: plan.datenart,
    planstand,
    rechtsstand: plan.rechtsstand,
    merkblattFassung: fassung.id,
    schemaStatus: fassung.schemaStand,
    befunde,
    felderUnbekannt,
    statusVerteilung: verteilung,
    statusAusserhalbVokabular: ausserhalb,
    investitionOffen: alsSpanne(offen),
    investitionAusserhalbVokabular: alsSpanne(fremd),
    investitionGesamt: alsSpanne(gesamt),
  };
}

// ---------------------------------------------------------------------------
// Auswertung (Aggregat)
// ---------------------------------------------------------------------------

const plural = (n: number, eins: string, viele: string) => `${n} ${n === 1 ? eins : viele}`;

/**
 * Fasst Prüfergebnisse zusammen: Statusverteilung und Investitionsvolumen der
 * offenen Maßnahmen. Nennt keine Unternehmen (kein Ranking), bildet keine
 * Quote und trägt den Selektionshinweis im Kopf.
 */
export function werteAus(ergebnisse: PlanErgebnis[]): Auswertung {
  const verteilung: StatusVerteilung = { Offen: 0, 'In Bearbeitung': 0, Abgeschlossen: 0, ausserhalbVokabular: 0, unbekannt: 0 };
  const ausserhalb: Record<string, number> = {};
  const offen = leereSpanne();
  const fremd = leereSpanne();
  let massnahmen = 0;
  let keinPlan = 0;
  const staende = new Set<string>();
  for (const e of ergebnisse) {
    for (const k of Object.keys(verteilung) as (keyof StatusVerteilung)[]) verteilung[k] += e.statusVerteilung[k];
    for (const [w, n] of Object.entries(e.statusAusserhalbVokabular)) ausserhalb[w] = (ausserhalb[w] ?? 0) + n;
    offen.von += Math.round(e.investitionOffen.vonEuro * 100);
    offen.bis += Math.round(e.investitionOffen.bisEuro * 100);
    offen.ohne += e.investitionOffen.ohneBetrag;
    fremd.von += Math.round(e.investitionAusserhalbVokabular.vonEuro * 100);
    fremd.bis += Math.round(e.investitionAusserhalbVokabular.bisEuro * 100);
    fremd.ohne += e.investitionAusserhalbVokabular.ohneBetrag;
    massnahmen += Object.values(e.statusVerteilung).reduce((a, b) => a + b, 0);
    if (e.datenart !== 'veroeffentlichter-plan') keinPlan += 1;
    staende.add(`${e.merkblattFassung}: ${e.schemaStatus}`);
  }
  const offenSpanne = alsSpanne(offen);
  const n = ergebnisse.length;
  let satzDe = `${plural(n, 'gefundener Plan', 'gefundene Pläne')}, davon ${plural(verteilung.Offen, 'Maßnahme', 'Maßnahmen')} offen, Investitionsvolumen offen ${spanneText(offenSpanne)}.`;
  let satzEn = `${plural(n, 'plan found', 'plans found')}, of which ${plural(verteilung.Offen, 'measure', 'measures')} open, open investment volume ${spanneText(offenSpanne)}.`;
  if (verteilung.ausserhalbVokabular > 0) {
    satzDe += ` Weitere ${plural(verteilung.ausserhalbVokabular, 'Maßnahme trägt', 'Maßnahmen tragen')} einen Status außerhalb der Merkblatt-Kategorien und ${verteilung.ausserhalbVokabular === 1 ? 'ist' : 'sind'} nicht als offen gezählt.`;
    satzEn += ` Another ${plural(verteilung.ausserhalbVokabular, 'measure carries', 'measures carry')} a status outside the guidance categories and ${verteilung.ausserhalbVokabular === 1 ? 'is' : 'are'} not counted as open.`;
  }
  if (keinPlan > 0) {
    satzDe += ` ${plural(keinPlan, 'Eintrag ist', 'Einträge sind')} kein veröffentlichter Plan (Merkblatt-Muster oder synthetisch).`;
    satzEn += ` ${plural(keinPlan, 'entry is', 'entries are')} not a published plan (guidance sample or synthetic).`;
  }
  return {
    selektionshinweisDe: SELEKTIONSHINWEIS_DE,
    selektionshinweisEn: SELEKTIONSHINWEIS_EN,
    anzahlPlaene: n,
    davonKeinVeroeffentlichterPlan: keinPlan,
    anzahlMassnahmen: massnahmen,
    statusVerteilung: verteilung,
    statusAusserhalbVokabular: ausserhalb,
    investitionOffen: offenSpanne,
    investitionAusserhalbVokabular: alsSpanne(fremd),
    schemaStaende: [...staende].sort(),
    satzDe: assertNeutral(satzDe),
    satzEn: assertNeutral(satzEn),
  };
}

// ---------------------------------------------------------------------------
// Register (Adapter auf den Registerkern)
// ---------------------------------------------------------------------------

/** Die einzigen zwei Registerstatus. */
export type PlanRegisterStatus = 'gefunden' | 'kein Plan gefunden';
export const PLAN_REGISTER_STATUS: readonly PlanRegisterStatus[] = ['gefunden', 'kein Plan gefunden'] as const;

/** Nachweis einer erfolglosen Suche: Stand und Suchweg sind Pflicht. */
export interface PlanSuchnachweis {
  unternehmen: string;
  planjahr: number;
  synthetisch?: boolean;
  /** ISO-Datum der Suche */
  stand: string;
  suchweg: { orte: string[]; suchbegriffe: string[] };
}

/** Eine Zeile des Registers (Unternehmen × Planjahr). */
export interface PlanRegisterZeile {
  unternehmen: string;
  planjahr: number;
  planstand: string | null;
  status: PlanRegisterStatus;
  statusText: string;
  stand: string;
  suchweg: string | null;
  quelleUrl: string | null;
  abgerufenAm: string | null;
  archivSnapshot: string | null;
  anzahlFragen: number | null;
  schemaStatus: SchemaStand | null;
  rechtsstand: Rechtsstand | null;
  datenart: Datenart | null;
  /** true für alles, was kein veröffentlichter Plan ist */
  synthetisch: boolean;
}

const schluessel = (u: string, j: number) => `${u}\u0000${j}`;

/**
 * Baut das Register aus Plänen und Suchnachweisen. Schlüssel ist
 * Unternehmen × Planjahr (Jahr des Planstands); zwei Pläne desselben
 * Unternehmens im selben Jahr werfen einen Fehler.
 *
 * Dublettenprüfung, Widerspruch gefunden/nicht gefunden, Datums- und
 * Suchwegprüfung sowie die alphabetische Sortierung leistet
 * `erstelleRegister` aus dem Registerkern; dieser Adapter ersetzt nur die
 * Statusbezeichnung („kein Plan gefunden") und die Fragenzahl.
 */
export function erstellePlanRegister(
  plaene: Umsetzungsplan[],
  suchnachweise: PlanSuchnachweis[],
  optionen: { fassung?: MerkblattFassung } = {}
): PlanRegisterZeile[] {
  const ergebnisse = new Map<string, { plan: Umsetzungsplan; erg: PlanErgebnis }>();
  const offenlegungen: Offenlegung[] = plaene.map((p) => {
    const erg = pruefeUmsetzungsplan(p, optionen);
    const planjahr = Number(erg.planstand.slice(0, 4));
    ergebnisse.set(schluessel(erg.unternehmen, planjahr), { plan: p, erg });
    return {
      unternehmen: erg.unternehmen,
      geschaeftsjahr: planjahr,
      synthetisch: p.datenart !== 'veroeffentlichter-plan',
      format: 'freitext',
      quelle: { url: p.quelle.url, abgerufenAm: p.quelle.abgerufenAm, archivSnapshot: p.quelle.archivSnapshot },
      positionen: [],
    };
  });
  const nachweise: Suchnachweis[] = suchnachweise.map((s) => {
    pruefeText(s?.unternehmen, 'suchnachweis.unternehmen');
    for (const t of [...(s.suchweg?.orte ?? []), ...(s.suchweg?.suchbegriffe ?? [])]) pruefeText(t, `${s.unternehmen}: suchweg`);
    return {
      unternehmen: s.unternehmen,
      geschaeftsjahr: s.planjahr,
      synthetisch: s.synthetisch,
      stand: s.stand,
      suchweg: s.suchweg,
    };
  });

  return erstelleRegister(offenlegungen, nachweise).map((z: RegisterZeile): PlanRegisterZeile => {
    if (z.status === 'gefunden') {
      const t = ergebnisse.get(schluessel(z.unternehmen, z.geschaeftsjahr));
      if (!t) throw new Error(`Registerzeile ohne Plan: ${z.unternehmen} ${z.geschaeftsjahr}`);
      return {
        unternehmen: z.unternehmen,
        planjahr: z.geschaeftsjahr,
        planstand: t.erg.planstand,
        status: 'gefunden',
        statusText: assertNeutral(`gefunden (Planstand ${t.erg.planstand}, abgerufen am ${z.abgerufenAm})`),
        stand: z.stand,
        suchweg: null,
        quelleUrl: z.quelleUrl,
        abgerufenAm: z.abgerufenAm,
        archivSnapshot: z.archivSnapshot,
        anzahlFragen: t.erg.befunde.length,
        schemaStatus: t.erg.schemaStatus,
        rechtsstand: t.erg.rechtsstand,
        datenart: t.plan.datenart,
        synthetisch: z.synthetisch,
      };
    }
    return {
      unternehmen: z.unternehmen,
      planjahr: z.geschaeftsjahr,
      planstand: null,
      status: 'kein Plan gefunden',
      statusText: assertNeutral(`kein Plan gefunden (Stand: ${z.stand}, Suchweg: ${z.suchweg})`),
      stand: z.stand,
      suchweg: z.suchweg,
      quelleUrl: null,
      abgerufenAm: null,
      archivSnapshot: null,
      anzahlFragen: null,
      schemaStatus: null,
      rechtsstand: null,
      datenart: null,
      synthetisch: z.synthetisch,
    };
  });
}

/**
 * Statische CSV (Semikolon, RFC-4180-Quoting) über `registerAlsCsv` aus dem
 * Registerkern. Spalte `geschaeftsjahr` heißt hier `planjahr`; angehängt
 * werden `planstand`, `rechtsstand`, `datenart`.
 */
export function planRegisterAlsCsv(zeilen: PlanRegisterZeile[]): string {
  // Der Registerkern ist auf seine eigenen Status-Literale typisiert; die CSV
  // stringifiziert die Felder nur. Die Umwandlung ist daher strukturell.
  const basis = zeilen.map((z) => ({
    unternehmen: z.unternehmen,
    geschaeftsjahr: z.planjahr,
    status: z.status,
    statusText: z.statusText,
    stand: z.stand,
    suchweg: z.suchweg,
    quelleUrl: z.quelleUrl,
    abgerufenAm: z.abgerufenAm,
    archivSnapshot: z.archivSnapshot,
    anzahlFragen: z.anzahlFragen,
    schemaStatus: z.schemaStatus,
    synthetisch: z.synthetisch,
  })) as unknown as RegisterZeile[];
  const zeilenText = registerAlsCsv(basis).split('\n');
  if (zeilenText.length !== zeilen.length + 1) throw new Error('CSV-Zeilen nicht eindeutig (Zeilenumbruch in einem Feld?)');
  const kopfAlt = zeilenText[0];
  if (!kopfAlt.startsWith('unternehmen;geschaeftsjahr;')) throw new Error(`Unerwarteter CSV-Kopf des Registerkerns: ${kopfAlt}`);
  const kopf = `${kopfAlt.replace(/^unternehmen;geschaeftsjahr;/, 'unternehmen;planjahr;')};planstand;rechtsstand;datenart`;
  const rumpf = zeilen.map((z, i) => `${zeilenText[i + 1]};${z.planstand ?? ''};${z.rechtsstand ?? ''};${z.datenart ?? ''}`);
  return assertNeutral([kopf, ...rumpf].join('\n'));
}
