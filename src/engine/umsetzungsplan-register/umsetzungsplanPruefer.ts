/**
 * Umsetzungsplan-Register — Prüfer für veröffentlichte Umsetzungspläne nach § 9 EnEfG
 * (Implementation Plan Register — checker for implementation plans published under § 9 EnEfG)
 *
 * Reiner, deterministischer TypeScript-Kern: kein DOM, kein Netzwerk, kein Modell.
 *
 * SCHEMA-STAND: VORLÄUFIG. Gelesen wurde das BAFA-Merkblatt zum EnEfG in der
 * Fassung 02/2025 (Stand 12.02.2025, Kopie auf visalvis.de). Die Fassungen 10/2025
 * und 05/2026 sind nur aus Suchschnipseln bekannt und NICHT gelesen. Die aktuell
 * gültige Fassung auf bafa.de wurde nicht gelesen. Das Schema trägt deshalb
 * `vorläufig`; die Merkblatt-Fassung ist ein Schemafeld (`merkblattFassung`).
 *
 * Harte Invarianten (Safety Case):
 *  1. Das Register kennt genau zwei Status: `gefunden` und `kein Plan gefunden`.
 *     Letzterer trägt immer Stand (Datum) und Suchweg. Kein Vorwurfswort
 *     („säumig", „Verstoß", „violation", „fehlt") in irgendeiner Ausgabe; das
 *     wird per Code erzwungen, nicht nur per Konvention.
 *  2. Jeder Befund ist eine Frage mit Regel-ID und Klartext (De/En). Der Prüfer
 *     urteilt nicht über Unternehmen. Kein Gesamturteil.
 *  3. Kein Ranking und keine Sortierung nach Firma oder Volumen: Ausgaben folgen
 *     der Erfassungsreihenfolge. Aggregat statt Rangliste.
 *  4. Jede Auswertung trägt im Kopf den Selektionshinweis. Es gibt keine Quote
 *     gegen die Verpflichtetenschätzung (kein Nenner, nur zitiert).
 *  5. Ungültige Eingaben werfen einen Fehler, nichts wird still ignoriert.
 *  6. `unbekannt` ist ein gleichberechtigter Feldwert (Pläne ohne Standardtabelle):
 *     Regeln, die das Feld brauchen, schweigen, und das Feld wird gelistet.
 *
 * Der Registerkern (zwei Status, Fundstelle, Abrufdatum, Archiv-Snapshot, Stand
 * und Suchweg) folgt dem Muster von `src/engine/vernichtungs-offenlegungsregister/`;
 * die Liste der verbotenen Wörter wird von dort importiert und erweitert.
 *
 * Lizenz: CC0 1.0 Public Domain.
 */

import { VERBOTENE_WOERTER as VERBOTENE_BASIS } from '../vernichtungs-offenlegungsregister/offenlegungsPruefer';

// ---------------------------------------------------------------------------
// Schema-Stand
// ---------------------------------------------------------------------------

export type SchemaStatus = 'vorläufig' | `gegen Merkblatt ${string} geprüft am ${string}`;

/** Aktueller Stand: vorläufig, weil die gültige Merkblattfassung nicht gelesen wurde. */
export const SCHEMA_STATUS: SchemaStatus = 'vorläufig';

/** Die tatsächlich gelesene Merkblattfassung (Quelle des Schemas). */
export const MERKBLATT_GELESEN = '02/2025';
/** Fassungen, die nur aus Schnipseln bekannt und nicht gelesen sind. */
export const MERKBLATT_UNGELESEN: readonly string[] = ['10/2025', '05/2026'] as const;

/** Die sieben Pflichtangaben laut BAFA-Merkblatt (Fassung 02/2025). */
export type Pflichtangabe =
  | 'prioritaet'
  | 'bezeichnung'
  | 'investitionEur'
  | 'zeitrahmen'
  | 'herkunft'
  | 'verantwortlich'
  | 'status';

export const PFLICHTANGABEN: readonly Pflichtangabe[] = [
  'prioritaet',
  'bezeichnung',
  'investitionEur',
  'zeitrahmen',
  'herkunft',
  'verantwortlich',
  'status',
] as const;

/** Klartextnamen der Pflichtangaben (De/En). */
export const PFLICHTANGABE_NAMEN: Readonly<Record<Pflichtangabe, { de: string; en: string }>> = {
  prioritaet: { de: 'Priorität', en: 'priority' },
  bezeichnung: { de: 'Maßnahmenbezeichnung', en: 'measure name' },
  investitionEur: { de: 'Investitionsvolumen', en: 'investment volume' },
  zeitrahmen: { de: 'Zeitrahmen', en: 'time frame' },
  herkunft: { de: 'Herkunft der Maßnahme', en: 'origin of the measure' },
  verantwortlich: { de: 'verantwortliche Funktion', en: 'responsible function' },
  status: { de: 'Status', en: 'status' },
};

/** Geschlossenes Statusvokabular des Merkblatts. */
export type MassnahmenStatus = 'Offen' | 'In Bearbeitung' | 'Abgeschlossen';
export const STATUS_VOKABULAR: readonly MassnahmenStatus[] = ['Offen', 'In Bearbeitung', 'Abgeschlossen'] as const;

/** Eine benannte Annahme über ein Feld, mit Herkunft. */
export interface Annahme {
  feld: string;
  annahmeDe: string;
  annahmeEn: string;
  herkunft: string;
}

/** Feldannahmen des vorläufigen Schemas. `feld` wortgleich mit `x-annahmen` in `umsetzungsplan-schema.json`. */
export const ANNAHMEN: readonly Annahme[] = [
  {
    feld: 'prioritaet',
    annahmeDe: 'Rangangabe der Maßnahme, Zahl oder Kurzwort; das Merkblatt-Format ist nur aus der Fassung 02/2025 bekannt.',
    annahmeEn: 'Rank of the measure, number or short word; the format is known from the 02/2025 version only.',
    herkunft: 'BAFA-Merkblatt EnEfG, Fassung 02/2025 (Kopie visalvis.de), gelesen',
  },
  {
    feld: 'investitionEur',
    annahmeDe: 'Investitionsvolumen in Euro, numerisch (Zahl oder Text wie „12.500 €" / „1,2 Mio. €").',
    annahmeEn: 'Investment volume in euros, numeric (number or text such as "12.500 €" / "1,2 Mio. €").',
    herkunft: 'Merkblatt 02/2025 nennt die Spalte; die Einheit Euro ist eine Annahme',
  },
  {
    feld: 'zeitrahmen',
    annahmeDe: 'Zeitrahmen mit mindestens einer Jahresangabe (z. B. „2026", „Q3 2026", „2026-2027", „bis 12/2026").',
    annahmeEn: 'Time frame containing at least one year (e.g. "2026", "Q3 2026", "2026-2027", "bis 12/2026").',
    herkunft: 'Merkblatt 02/2025 nennt die Spalte; Parserform ist eine Annahme',
  },
  {
    feld: 'status',
    annahmeDe: 'Geschlossenes Vokabular Offen, In Bearbeitung, Abgeschlossen.',
    annahmeEn: 'Closed vocabulary Offen, In Bearbeitung, Abgeschlossen.',
    herkunft: 'Merkblatt 02/2025, gelesen; Sanofi-Aventis (11/2025) und VON ARDENNE (04/2025) laut Dossier wortgleich',
  },
  {
    feld: 'merkblattFassung',
    annahmeDe: 'Fassung des Merkblatts, gegen die ein Plan erstellt wurde. Gelesen ist nur 02/2025; 10/2025 und 05/2026 sind ungelesen.',
    annahmeEn: 'Version of the leaflet a plan was written against. Only 02/2025 was read; 10/2025 and 05/2026 are unread.',
    herkunft: 'Suchschnipsel zu neueren Fassungen; bafa.de nicht gelesen',
  },
] as const;

/** Behördenschätzung der Verpflichteten (BT-Drs. 21/8027). Nur zitiert, nie als Nenner verwendet. */
export const VERPFLICHTETE_SCHAETZUNG = 16461;

// ---------------------------------------------------------------------------
// Typen
// ---------------------------------------------------------------------------

export type Unbekannt = 'unbekannt';
export type Rechtsstand = 'a.F.' | 'n.F.';

/** Eine Zeile der Maßnahmentabelle. `undefined` oder leer = die Übertragung hat keinen Wert. */
export interface Massnahme {
  id: string;
  prioritaet?: number | string | Unbekannt;
  bezeichnung?: string | Unbekannt;
  investitionEur?: number | string | Unbekannt;
  zeitrahmen?: string | Unbekannt;
  herkunft?: string | Unbekannt;
  verantwortlich?: string | Unbekannt;
  status?: string | Unbekannt;
}

export interface Quelle {
  url: string;
  /** ISO-Datum JJJJ-MM-TT */
  abgerufenAm: string;
  archivSnapshot?: string;
}

/** Ein übertragener Umsetzungsplan eines Unternehmens für einen Planstand. */
export interface Umsetzungsplan {
  unternehmen: string;
  /** Planstand als Text, z. B. „2025-11" oder „2025-04-07" */
  planstand: string;
  /** true für konstruierte Testdaten, die keinen echten Plan abbilden */
  synthetisch?: boolean;
  format: 'tabelle' | 'freitext';
  rechtsstand: Rechtsstand;
  /** Fassung, gegen die der Plan erstellt wurde, oder `unbekannt`. */
  merkblattFassung: string | Unbekannt;
  quelle: Quelle;
  massnahmen: Massnahme[];
  freitext?: string;
}

/** Nachweis einer erfolglosen Suche: Stand und Suchweg sind Pflicht. */
export interface Suchnachweis {
  unternehmen: string;
  planstand: string;
  synthetisch?: boolean;
  /** ISO-Datum der Suche */
  stand: string;
  suchweg: { orte: string[]; suchbegriffe: string[] };
}

export type RegelId =
  | 'U0-KEINE-TABELLE'
  | 'U1-PFLICHTANGABE'
  | 'U2-STATUS'
  | 'U3-ZEITRAHMEN'
  | 'U4-INVESTITION'
  | 'U5-MERKBLATT';

/** Ein Befund ist immer eine Frage an die Übertragung, nie ein Urteil. */
export interface Befund {
  regel: RegelId;
  art: 'frage';
  massnahme: string | null;
  frageDe: string;
  frageEn: string;
}

/** Ergebnis von `pruefeUmsetzungsplan`. Enthält bewusst kein Gesamturteil. */
export interface PruefErgebnis {
  unternehmen: string;
  planstand: string;
  rechtsstand: Rechtsstand;
  schemaStatus: SchemaStatus;
  merkblattFassungSchema: string;
  befunde: Befund[];
  /** Felder mit Wert `unbekannt`, als `<massnahme>.<feld>` bzw. `*.<feld>` bzw. `merkblattFassung` */
  felderUnbekannt: string[];
}

export type RegisterStatus = 'gefunden' | 'kein Plan gefunden';
export const REGISTER_STATUS: readonly RegisterStatus[] = ['gefunden', 'kein Plan gefunden'] as const;

export interface RegisterZeile {
  unternehmen: string;
  planstand: string;
  status: RegisterStatus;
  statusText: string;
  stand: string;
  suchweg: string | null;
  quelleUrl: string | null;
  abgerufenAm: string | null;
  archivSnapshot: string | null;
  anzahlFragen: number | null;
  rechtsstand: Rechtsstand | null;
  merkblattFassung: string | null;
  schemaStatus: SchemaStatus;
  synthetisch: boolean;
}

// ---------------------------------------------------------------------------
// Neutrale Sprache
// ---------------------------------------------------------------------------

/** Wörter, die keine Ausgabe dieses Kerns je enthalten darf (Basisliste plus „fehlt"-Formen). */
export const VERBOTENE_WOERTER: readonly RegExp[] = [
  ...VERBOTENE_BASIS,
  /\bfehlt\b/i,
  /\bfehlend/i,
  /\bfehlen\b/i,
  /\bmissing\b/i,
];

/** Wirft, wenn ein Text ein Vorwurfswort enthält. */
export function assertNeutraleSprache(text: string): string {
  for (const muster of VERBOTENE_WOERTER) {
    if (muster.test(text)) throw new Error(`Unzulässiges Vorwurfswort in Ausgabe: ${muster.source}`);
  }
  return text;
}

export function istNeutral(text: string): boolean {
  return !VERBOTENE_WOERTER.some((m) => m.test(text));
}

// ---------------------------------------------------------------------------
// Hilfen
// ---------------------------------------------------------------------------

const ISO_DATUM = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

function pruefeDatum(wert: unknown, feld: string): string {
  if (typeof wert !== 'string' || !ISO_DATUM.test(wert) || Number.isNaN(Date.parse(wert))) {
    throw new Error(`${feld}: kein gültiges ISO-Datum (JJJJ-MM-TT): ${String(wert)}`);
  }
  return wert;
}

function pruefeKopf(unternehmen: unknown, planstand: unknown): void {
  if (typeof unternehmen !== 'string' || unternehmen.trim() === '') throw new Error('Unternehmen fehlt');
  if (typeof planstand !== 'string' || planstand.trim() === '') throw new Error(`${String(unternehmen)}: Planstand ungültig`);
}

const fmt = (n: number): string => String(Math.round(n * 100) / 100);

function befund(regel: RegelId, massnahme: string | null, frageDe: string, frageEn: string): Befund {
  if (!frageDe.trim().endsWith('?') || !frageEn.trim().endsWith('?')) {
    throw new Error(`Befund ${regel} ist nicht als Frage formuliert`);
  }
  assertNeutraleSprache(frageDe);
  assertNeutraleSprache(frageEn);
  return { regel, art: 'frage', massnahme, frageDe, frageEn };
}

const ohneWert = (v: unknown): boolean => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');

/**
 * Liest ein Investitionsvolumen in Euro. Akzeptiert Zahlen und deutsche Texte
 * („12.500 €", „12.500,50 EUR", „1,2 Mio. €", „250 Tsd."). Liefert `null`,
 * wenn der Wert nicht numerisch lesbar ist.
 */
export function parseInvestition(wert: number | string): number | null {
  if (typeof wert === 'number') return Number.isFinite(wert) && wert >= 0 ? wert : null;
  let s = wert.trim().toLowerCase();
  let faktor = 1;
  if (/\b(mio|million|millionen)\b\.?/.test(s)) faktor = 1e6;
  else if (/\b(tsd|tausend)\b\.?/.test(s)) faktor = 1e3;
  s = s
    .replace(/\b(mio|millionen|million|tsd|tausend)\b\.?/g, '')
    .replace(/€|eur(o)?\b/g, '')
    .replace(/\s+/g, '');
  let zahl: number;
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) zahl = Number(s.replace(/\./g, '').replace(',', '.'));
  else if (/^\d+,\d+$/.test(s)) zahl = Number(s.replace(',', '.'));
  else if (/^\d+(\.\d+)?$/.test(s)) zahl = Number(s);
  else return null;
  return Number.isFinite(zahl) ? zahl * faktor : null;
}

/**
 * Liest einen Zeitrahmen: mindestens eine Jahreszahl 2000–2099 muss vorkommen.
 * `von` und `bis` sind das erste und letzte gefundene Jahr.
 */
export function parseZeitrahmen(text: string): { von: number; bis: number } | null {
  const jahre = [...text.matchAll(/(?<!\d)(20\d{2})(?!\d)/g)].map((m) => Number(m[1]));
  if (jahre.length === 0) return null;
  return { von: jahre[0], bis: jahre[jahre.length - 1] };
}

/** Normalisiert einen Status auf das Vokabular (Groß-/Kleinschreibung egal), sonst `null`. */
export function normalisiereStatus(text: string): MassnahmenStatus | null {
  const t = text.trim().toLowerCase();
  return STATUS_VOKABULAR.find((s) => s.toLowerCase() === t) ?? null;
}

// ---------------------------------------------------------------------------
// Prüfer
// ---------------------------------------------------------------------------

/**
 * Prüft einen übertragenen Plan deterministisch gegen das vorläufige Schema.
 * Ohne Netz, ohne Modell. Jeder Befund ist eine Frage.
 *
 * Regeln: U0 Plan ohne Tabelle · U1 Pflichtangabe ohne Wert · U2 Status außerhalb
 * des Vokabulars · U3 Zeitrahmen nicht lesbar (oder Ende vor Beginn) ·
 * U4 Investitionsvolumen nicht numerisch · U5 Merkblattfassung des Plans weicht
 * von der gelesenen ab.
 *
 * @throws bei ungültiger Eingabe (siehe Invariante 5)
 */
export function pruefeUmsetzungsplan(p: Umsetzungsplan): PruefErgebnis {
  pruefeKopf(p?.unternehmen, p?.planstand);
  if (!p.quelle || typeof p.quelle.url !== 'string' || !/^https?:\/\//.test(p.quelle.url)) {
    throw new Error(`${p.unternehmen} ${p.planstand}: Quell-URL fehlt oder ist ungültig`);
  }
  pruefeDatum(p.quelle.abgerufenAm, 'quelle.abgerufenAm');
  if (p.format !== 'tabelle' && p.format !== 'freitext') throw new Error(`Unbekanntes Format: ${String(p.format)}`);
  if (p.rechtsstand !== 'a.F.' && p.rechtsstand !== 'n.F.') {
    throw new Error(`Rechtsstand muss „a.F." oder „n.F." sein: ${String(p.rechtsstand)}`);
  }
  if (typeof p.merkblattFassung !== 'string' || p.merkblattFassung.trim() === '') {
    throw new Error(`${p.unternehmen} ${p.planstand}: merkblattFassung fehlt (Fassung oder „unbekannt" angeben)`);
  }
  if (!Array.isArray(p.massnahmen)) throw new Error('massnahmen muss ein Array sein');
  if (p.format === 'tabelle' && p.massnahmen.length === 0) {
    throw new Error('Format „tabelle" ohne Maßnahmen — als „freitext" übertragen oder Maßnahmen ergänzen');
  }

  const befunde: Befund[] = [];
  const felderUnbekannt: string[] = [];

  if (p.format === 'freitext') {
    befunde.push(
      befund(
        'U0-KEINE-TABELLE',
        null,
        'Der Plan liegt nur als Erklärtext ohne Standardtabelle vor. Lassen sich die sieben Pflichtangaben daraus von Hand übertragen?',
        'The plan is an explanatory text without the standard table. Can the seven mandatory fields be transcribed from it by hand?'
      )
    );
    if (p.massnahmen.length === 0) felderUnbekannt.push(...PFLICHTANGABEN.map((f) => `*.${f}`));
  }

  // U5 — Merkblattfassung
  if (p.merkblattFassung === 'unbekannt') {
    felderUnbekannt.push('merkblattFassung');
  } else if (p.merkblattFassung.trim() !== MERKBLATT_GELESEN) {
    const f = istNeutral(p.merkblattFassung) ? p.merkblattFassung.trim() : '(Angabe)';
    const ungelesen = MERKBLATT_UNGELESEN.includes(f);
    befunde.push(
      befund(
        'U5-MERKBLATT',
        null,
        `Der Plan nennt die Merkblattfassung ${f}; gelesen ist nur ${MERKBLATT_GELESEN}${ungelesen ? ` (${f} ist ungelesen)` : ''}. Hat sich das Spaltenformat geändert?`,
        `The plan names leaflet version ${f}; only ${MERKBLATT_GELESEN} was read${ungelesen ? ` (${f} is unread)` : ''}. Has the column format changed?`
      )
    );
  }

  const ids = new Set<string>();
  for (const m of p.massnahmen) {
    if (typeof m.id !== 'string' || m.id === '') throw new Error('Maßnahme ohne id');
    if (ids.has(m.id)) throw new Error(`Doppelte Maßnahmen-ID: ${m.id}`);
    ids.add(m.id);
    pruefeMassnahme(m, befunde, felderUnbekannt);
  }

  return {
    unternehmen: p.unternehmen,
    planstand: p.planstand,
    rechtsstand: p.rechtsstand,
    schemaStatus: SCHEMA_STATUS,
    merkblattFassungSchema: MERKBLATT_GELESEN,
    befunde,
    felderUnbekannt,
  };
}

function pruefeMassnahme(m: Massnahme, befunde: Befund[], unbekannt: string[]): void {
  // U1 — Pflichtangaben; `unbekannt` wird gelistet, kein Befund
  for (const feld of PFLICHTANGABEN) {
    const v = m[feld];
    if (v === 'unbekannt') {
      unbekannt.push(`${m.id}.${feld}`);
      continue;
    }
    if (ohneWert(v)) {
      const n = PFLICHTANGABE_NAMEN[feld];
      befunde.push(
        befund(
          'U1-PFLICHTANGABE',
          m.id,
          `Zu dieser Maßnahme ist keine Angabe zu „${n.de}" übertragen. Nennt der Plan sie?`,
          `No value for "${n.en}" is transcribed for this measure. Does the plan state it?`
        )
      );
      continue;
    }
    if (feld === 'prioritaet' && typeof v === 'number' && !(Number.isFinite(v) && v > 0)) {
      throw new Error(`${m.id}.prioritaet: ungültige Zahl ${String(v)}`);
    }
    if (typeof v !== 'string' && typeof v !== 'number') throw new Error(`${m.id}.${feld}: Text oder Zahl erwartet`);
    if (feld !== 'prioritaet' && feld !== 'investitionEur' && typeof v !== 'string') {
      throw new Error(`${m.id}.${feld}: Text erwartet`);
    }
  }

  // U2 — Status im Vokabular
  if (typeof m.status === 'string' && m.status !== 'unbekannt' && !ohneWert(m.status)) {
    if (normalisiereStatus(m.status) === null) {
      const z = istNeutral(m.status) ? `„${m.status.trim()}"` : '(Angabe)';
      befunde.push(
        befund(
          'U2-STATUS',
          m.id,
          `Der Status ${z} steht nicht im Vokabular Offen, In Bearbeitung, Abgeschlossen. Wurde er richtig übertragen?`,
          `The status ${z} is not in the vocabulary Offen, In Bearbeitung, Abgeschlossen. Was it transcribed correctly?`
        )
      );
    }
  }

  // U3 — Zeitrahmen
  if (typeof m.zeitrahmen === 'string' && m.zeitrahmen !== 'unbekannt' && !ohneWert(m.zeitrahmen)) {
    const z = parseZeitrahmen(m.zeitrahmen);
    const zitat = istNeutral(m.zeitrahmen) ? `„${m.zeitrahmen.trim()}"` : '(Angabe)';
    if (z === null) {
      befunde.push(
        befund(
          'U3-ZEITRAHMEN',
          m.id,
          `Der Zeitrahmen ${zitat} enthält keine lesbare Jahreszahl. Wurde er richtig übertragen?`,
          `The time frame ${zitat} contains no readable year. Was it transcribed correctly?`
        )
      );
    } else if (z.bis < z.von) {
      befunde.push(
        befund(
          'U3-ZEITRAHMEN',
          m.id,
          `Im Zeitrahmen ${zitat} liegt das Ende (${z.bis}) vor dem Beginn (${z.von}). Sind die Jahre vertauscht?`,
          `In the time frame ${zitat} the end (${z.bis}) lies before the start (${z.von}). Are the years swapped?`
        )
      );
    }
  }

  // U4 — Investitionsvolumen numerisch
  if (m.investitionEur !== undefined && m.investitionEur !== 'unbekannt' && !ohneWert(m.investitionEur)) {
    const v = parseInvestition(m.investitionEur as number | string);
    if (v === null) {
      const z = typeof m.investitionEur === 'string' && istNeutral(m.investitionEur) ? `„${m.investitionEur.trim()}"` : '(Angabe)';
      befunde.push(
        befund(
          'U4-INVESTITION',
          m.id,
          `Das Investitionsvolumen ${z} ist nicht als Euro-Betrag lesbar. Nennt der Plan eine Zahl?`,
          `The investment volume ${z} cannot be read as a euro amount. Does the plan give a number?`
        )
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Register und Auswertung
// ---------------------------------------------------------------------------

function suchwegText(s: Suchnachweis['suchweg']): string {
  return `Orte: ${s.orte.join(', ')}; Suchbegriffe: ${s.suchbegriffe.map((b) => `„${b}"`).join(', ')}`;
}

/**
 * Baut das Register (Unternehmen × Planstand). Der Status folgt allein daraus,
 * in welcher Liste ein Eintrag steht. Die Reihenfolge ist die Erfassungsreihenfolge
 * (erst gefundene Pläne, dann Suchnachweise), niemals nach Firma oder Volumen sortiert.
 *
 * @throws bei doppelten Paaren, Widersprüchen, fehlendem Stand/Suchweg oder ungültigem Plan
 */
export function erstelleRegister(plaene: Umsetzungsplan[], suchnachweise: Suchnachweis[]): RegisterZeile[] {
  const gesehen = new Set<string>();
  const schluessel = (u: string, ps: string) => `${u}\u0000${ps}`;
  const zeilen: RegisterZeile[] = [];

  for (const p of plaene) {
    const erg = pruefeUmsetzungsplan(p);
    const k = schluessel(p.unternehmen, p.planstand);
    if (gesehen.has(k)) throw new Error(`Doppelter Eintrag: ${p.unternehmen} Planstand ${p.planstand}`);
    gesehen.add(k);
    zeilen.push({
      unternehmen: p.unternehmen,
      planstand: p.planstand,
      status: 'gefunden',
      statusText: assertNeutraleSprache(`gefunden (abgerufen am ${p.quelle.abgerufenAm})`),
      stand: p.quelle.abgerufenAm,
      suchweg: null,
      quelleUrl: p.quelle.url,
      abgerufenAm: p.quelle.abgerufenAm,
      archivSnapshot: p.quelle.archivSnapshot ?? null,
      anzahlFragen: erg.befunde.length,
      rechtsstand: p.rechtsstand,
      merkblattFassung: p.merkblattFassung,
      schemaStatus: erg.schemaStatus,
      synthetisch: p.synthetisch === true,
    });
  }

  for (const s of suchnachweise) {
    pruefeKopf(s?.unternehmen, s?.planstand);
    pruefeDatum(s.stand, `${s.unternehmen} ${s.planstand}: stand`);
    const orte = s.suchweg?.orte;
    const begriffe = s.suchweg?.suchbegriffe;
    if (!Array.isArray(orte) || orte.filter((x) => x.trim()).length === 0) {
      throw new Error(`${s.unternehmen} ${s.planstand}: Suchweg ohne Orte — ohne Suchweg kein Eintrag`);
    }
    if (!Array.isArray(begriffe) || begriffe.filter((x) => x.trim()).length === 0) {
      throw new Error(`${s.unternehmen} ${s.planstand}: Suchweg ohne Suchbegriffe — ohne Suchweg kein Eintrag`);
    }
    const k = schluessel(s.unternehmen, s.planstand);
    if (gesehen.has(k)) {
      throw new Error(`Widerspruch: ${s.unternehmen} Planstand ${s.planstand} steht als gefunden und als nicht gefunden`);
    }
    gesehen.add(k);
    const weg = suchwegText(s.suchweg);
    zeilen.push({
      unternehmen: s.unternehmen,
      planstand: s.planstand,
      status: 'kein Plan gefunden',
      statusText: assertNeutraleSprache(`kein Plan gefunden (Stand: ${s.stand}, Suchweg: ${weg})`),
      stand: s.stand,
      suchweg: weg,
      quelleUrl: null,
      abgerufenAm: null,
      archivSnapshot: null,
      anzahlFragen: null,
      rechtsstand: null,
      merkblattFassung: null,
      schemaStatus: SCHEMA_STATUS,
      synthetisch: s.synthetisch === true,
    });
  }
  return zeilen;
}

/** Der feste Kopf jeder Auswertung. */
export interface Auswertungskopf {
  titel: string;
  selektionshinweisDe: string;
  selektionshinweisEn: string;
  bedingtePflichtDe: string;
  bedingtePflichtEn: string;
  nennerHinweisDe: string;
  nennerHinweisEn: string;
  schemaStatus: SchemaStatus;
  merkblattFassungGelesen: string;
  merkblattFassungenUngelesen: readonly string[];
}

export const SELEKTIONSHINWEIS_DE =
  'Selektionshinweis: Veröffentlichen tun die Sorgfältigen. Die Umsetzungsquote der gefundenen Pläne ist eine Obergrenze-Tendenz der Disziplinierten und kein Branchenmaß.';
export const SELEKTIONSHINWEIS_EN =
  'Selection note: those who publish are the diligent ones. The implementation rate of the plans found is an upper-bound tendency of the disciplined and not an industry measure.';

/** Statusverteilung über Maßnahmen der gefundenen Pläne (nicht über Firmen). */
export interface Statusverteilung {
  Offen: number;
  'In Bearbeitung': number;
  Abgeschlossen: number;
  /** Maßnahmen mit Status `unbekannt`, ohne Wert oder außerhalb des Vokabulars */
  ohneLesbarenStatus: number;
}

export interface Einzelnachweis {
  unternehmen: string;
  planstand: string;
  rechtsstand: Rechtsstand;
  merkblattFassung: string;
  anzahlMassnahmen: number;
  massnahmenOffen: number;
  investitionOffenEur: number;
  anzahlFragen: number;
  quelleUrl: string;
  abgerufenAm: string;
  synthetisch: boolean;
}

export interface Auswertung {
  kopf: Auswertungskopf;
  gefundenePlaene: number;
  massnahmenGesamt: number;
  massnahmenOffen: number;
  statusverteilung: Statusverteilung;
  /**
   * Anteil je Status an den Maßnahmen mit lesbarem Status, in Prozent (1 Nachkommastelle),
   * oder `null`, wenn keine Maßnahme einen lesbaren Status hat. Gilt nur für gefundene Pläne.
   */
  statusquoteProzent: Record<MassnahmenStatus, number> | null;
  /** Summe der numerisch lesbaren Investitionsvolumen der Maßnahmen mit Status „Offen". */
  investitionOffenEur: number;
  /** Offene Maßnahmen ohne lesbares Volumen: die Summe ist eine Untergrenze. */
  massnahmenOffenOhneVolumen: number;
  keinPlanGefunden: number;
  /** In Erfassungsreihenfolge, ohne Ranking. */
  einzelnachweise: Einzelnachweis[];
  register: RegisterZeile[];
}

function kopf(): Auswertungskopf {
  return {
    titel: 'Umsetzungsplan-Register nach § 9 EnEfG — Auswertung (Schema vorläufig)',
    selektionshinweisDe: SELEKTIONSHINWEIS_DE,
    selektionshinweisEn: SELEKTIONSHINWEIS_EN,
    bedingtePflichtDe:
      'Die Pflicht ist bedingt (Verbrauchsschwelle nicht öffentlich, Ausnahme bei EnMS/UMS, Schwärzung von Geschäftsgeheimnissen, Frist ab Audit). „Kein Plan gefunden" ist kein Urteil über das Unternehmen.',
    bedingtePflichtEn:
      'The duty is conditional (consumption threshold not public, exemption with EnMS/UMS, redaction of trade secrets, deadline runs from the audit). "No plan found" is not a judgement on the company.',
    nennerHinweisDe: `Es gibt keine Liste der Verpflichteten. Die Behördenschätzung (BT-Drs. 21/8027) nennt rund ${VERPFLICHTETE_SCHAETZUNG.toLocaleString('de-DE')}; sie wird nur zitiert und nie als Nenner einer Quote verwendet.`,
    nennerHinweisEn: `There is no list of obliged companies. The authority estimate (BT-Drs. 21/8027) is about ${VERPFLICHTETE_SCHAETZUNG.toLocaleString('en-US')}; it is quoted only and never used as a denominator.`,
    schemaStatus: SCHEMA_STATUS,
    merkblattFassungGelesen: MERKBLATT_GELESEN,
    merkblattFassungenUngelesen: MERKBLATT_UNGELESEN,
  };
}

/**
 * Aggregat statt Ranking: „N gefundene Pläne, davon M Maßnahmen offen,
 * Investitionsvolumen der offenen Maßnahmen" plus Einzelnachweise in
 * Erfassungsreihenfolge. Der Kopf mit Selektionshinweis ist fester Bestandteil.
 */
export function erstelleAuswertung(plaene: Umsetzungsplan[], suchnachweise: Suchnachweis[] = []): Auswertung {
  const register = erstelleRegister(plaene, suchnachweise);
  const verteilung: Statusverteilung = { Offen: 0, 'In Bearbeitung': 0, Abgeschlossen: 0, ohneLesbarenStatus: 0 };
  let investOffen = 0;
  let offenOhneVolumen = 0;
  let gesamt = 0;
  const einzel: Einzelnachweis[] = [];

  for (const p of plaene) {
    const erg = pruefeUmsetzungsplan(p);
    let offen = 0;
    let invest = 0;
    for (const m of p.massnahmen) {
      gesamt++;
      const st = typeof m.status === 'string' ? normalisiereStatus(m.status) : null;
      if (st === null) {
        verteilung.ohneLesbarenStatus++;
        continue;
      }
      verteilung[st]++;
      if (st === 'Offen') {
        offen++;
        const v = m.investitionEur === undefined || m.investitionEur === 'unbekannt' ? null : parseInvestition(m.investitionEur);
        if (v === null) offenOhneVolumen++;
        else invest += v;
      }
    }
    investOffen += invest;
    einzel.push({
      unternehmen: p.unternehmen,
      planstand: p.planstand,
      rechtsstand: p.rechtsstand,
      merkblattFassung: p.merkblattFassung,
      anzahlMassnahmen: p.massnahmen.length,
      massnahmenOffen: offen,
      investitionOffenEur: invest,
      anzahlFragen: erg.befunde.length,
      quelleUrl: p.quelle.url,
      abgerufenAm: p.quelle.abgerufenAm,
      synthetisch: p.synthetisch === true,
    });
  }

  const lesbar = verteilung.Offen + verteilung['In Bearbeitung'] + verteilung.Abgeschlossen;
  const anteil = (n: number) => Math.round((n / lesbar) * 1000) / 10;
  const quote =
    lesbar === 0
      ? null
      : { Offen: anteil(verteilung.Offen), 'In Bearbeitung': anteil(verteilung['In Bearbeitung']), Abgeschlossen: anteil(verteilung.Abgeschlossen) };

  return {
    kopf: kopf(),
    gefundenePlaene: plaene.length,
    massnahmenGesamt: gesamt,
    massnahmenOffen: verteilung.Offen,
    statusverteilung: verteilung,
    statusquoteProzent: quote,
    investitionOffenEur: investOffen,
    massnahmenOffenOhneVolumen: offenOhneVolumen,
    keinPlanGefunden: suchnachweise.length,
    einzelnachweise: einzel,
    register,
  };
}

/** Klartext-Auswertung; der Selektionshinweis steht in der ersten Zeile nach dem Titel. */
export function auswertungAlsText(a: Auswertung): string {
  const k = a.kopf;
  const zeilen = [
    k.titel,
    k.selektionshinweisDe,
    k.selektionshinweisEn,
    k.bedingtePflichtDe,
    k.nennerHinweisDe,
    `Schema: ${k.schemaStatus}; Merkblatt gelesen: ${k.merkblattFassungGelesen}; ungelesen: ${k.merkblattFassungenUngelesen.join(', ')}`,
    '',
    `${a.gefundenePlaene} gefundene Pläne, davon ${a.massnahmenOffen} Maßnahmen offen, Investitionsvolumen der offenen Maßnahmen: ${fmt(a.investitionOffenEur)} EUR` +
      (a.massnahmenOffenOhneVolumen > 0 ? ` (Untergrenze: bei ${a.massnahmenOffenOhneVolumen} offenen Maßnahmen ohne lesbares Volumen)` : ''),
    `Maßnahmen gesamt: ${a.massnahmenGesamt} (Offen ${a.statusverteilung.Offen}, In Bearbeitung ${a.statusverteilung['In Bearbeitung']}, Abgeschlossen ${a.statusverteilung.Abgeschlossen}, ohne lesbaren Status ${a.statusverteilung.ohneLesbarenStatus})`,
    `${a.keinPlanGefunden} Einträge „kein Plan gefunden" (siehe Register, jeweils mit Stand und Suchweg)`,
  ];
  return assertNeutraleSprache(zeilen.join('\n'));
}

const CSV_SPALTEN: readonly (keyof RegisterZeile)[] = [
  'unternehmen',
  'planstand',
  'status',
  'statusText',
  'stand',
  'suchweg',
  'quelleUrl',
  'abgerufenAm',
  'archivSnapshot',
  'anzahlFragen',
  'rechtsstand',
  'merkblattFassung',
  'schemaStatus',
  'synthetisch',
];

/** Statische CSV (Semikolon, RFC-4180-Quoting). Der Selektionshinweis steht als Kommentarzeile im Kopf. */
export function registerAlsCsv(zeilen: RegisterZeile[]): string {
  const zelle = (v: unknown): string => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const text = [
    `# ${SELEKTIONSHINWEIS_DE}`,
    `# ${SELEKTIONSHINWEIS_EN}`,
    CSV_SPALTEN.join(';'),
    ...zeilen.map((z) => CSV_SPALTEN.map((k) => zelle(z[k])).join(';')),
  ].join('\n');
  return assertNeutraleSprache(text);
}
