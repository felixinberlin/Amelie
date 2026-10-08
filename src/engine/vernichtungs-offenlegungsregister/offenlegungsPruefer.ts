/**
 * Vernichtungs-Offenlegungsregister — Prüfer für Offenlegungen nach Art. 24 ESPR
 * (Destruction Disclosure Register — checker for Art. 24 ESPR disclosures)
 *
 * Reiner, deterministischer TypeScript-Kern: kein DOM, kein Netzwerk, kein Modell.
 *
 * Anhang I / Artikel 1–3 der DVO (EU) 2026/2 im Volltext geprüft am 2026-10-08.
 * Dies ist ein Übertragungsmodell, keine Rechtsprüfung oder Feststellung der Pflicht.
 * Historische Quellen bleiben unverändert; zukünftige Formatfragen nur explizit.
 *
 * Harte Invarianten (Safety Case):
 *  1. Das Register kennt genau zwei Status: `gefunden` und
 *     `keine Offenlegung gefunden`. Letzterer trägt immer Stand (Datum) und
 *     Suchweg. Es gibt keinen Status „erfüllt", „ok" oder „grün" und keinen
 *     Vorwurf („Verstoß", „säumig", „violation").
 *  2. Jeder Befund ist eine Frage mit Regel-ID und Klartext (De/En). Der Prüfer
 *     urteilt nicht über Unternehmen, er stellt Rückfragen an die Übertragung.
 *  3. Kein Ergebnis enthält ein Gesamturteil. Null Befunde heißt nur: keine der
 *     Regeln hat eine Frage ausgelöst.
 *  4. Ungültige Eingaben (fehlende Quelle, leerer Suchweg, negativer Anteil,
 *     unbekannter Behandlungsweg, Widerspruch gefunden/nicht gefunden) werfen
 *     einen Fehler — nichts wird still ignoriert.
 *  5. `unbekannt` ist ein gleichberechtigter Feldwert (Freitext-Offenlegungen):
 *     Regeln, die das Feld brauchen, schweigen, und das Feld wird gelistet.
 *
 * Lizenz: CC0 1.0 Public Domain.
 */

// ---------------------------------------------------------------------------
// Schema-Stand und Annahmen
// ---------------------------------------------------------------------------

/** Stand des übertragenen Anhang-I-Modells, unabhängig von der Pflicht einer Quelle. */
export type SchemaStatus = 'vorläufig' | `gegen Normtext geprüft am ${string}`;

/** Anhang-I-Feldmodell gegen die Primärquelle geprüft. */
export const SCHEMA_STATUS: SchemaStatus = 'gegen Normtext geprüft am 2026-10-08';

/** Eine benannte Annahme über ein Feld, mit Herkunft. */
export interface Annahme {
  feld: string;
  annahmeDe: string;
  annahmeEn: string;
  herkunft: string;
}

/**
 * Dokumentierte Feldzuordnungen. Wortgleich (feld) mit
 * `x-annahmen` in `07-demos/vernichtungs-offenlegungsregister/anhang1-schema.json`.
 */
export const ANNAHMEN: readonly Annahme[] = [
  { feld: 'stueck', annahmeDe: 'Stückzahl je Kategorie und Grund; Schätzung separat.', annahmeEn: 'Units per category and reason; separate estimate marker.', herkunft: 'DVO 2026/2 Anhang I Abschnitt 2 Fußnoten 6/8' },
  { feld: 'gewichtKg', annahmeDe: 'Gewicht in kg; Verpackung separat gekennzeichnet.', annahmeEn: 'Weight in kg; packaging separately indicated.', herkunft: 'DVO 2026/2 Anhang I Abschnitt 2 Fußnote 7' },
  { feld: 'gruende', annahmeDe: 'Freie Gründe; Ausnahmen nur wo einschlägig.', annahmeEn: 'Free reasons; derogations only where applicable.', herkunft: 'DVO 2026/2 Anhang I Abschnitt 2 Fußnote 8' },
  { feld: 'behandlungswege', annahmeDe: 'Fünf gewichtsbezogene Anteile einschließlich unbekannt; Vernichtung als separate Summe.', annahmeEn: 'Five weight-based shares including unknown; destruction as separate subtotal.', herkunft: 'DVO 2026/2 Anhang I Abschnitt 2 Fußnote Behandlungswege' },
  { feld: 'cnCode', annahmeDe: 'Zwei Stellen allgemein, vier für Anhang II.', annahmeEn: 'Two digits generally, four for Annex II.', herkunft: 'DVO 2026/2 Artikel 3 und Anhang II' },
  { feld: 'schaetzungStueck/schaetzungGewicht', annahmeDe: 'Schätzwerte einzeln mit ± markieren; fehlender Marker ist keine behauptete Schätzung.', annahmeEn: 'Mark each estimated value with ±; missing marker does not establish estimation.', herkunft: 'DVO 2026/2 Anhang I Abschnitt 2 Fußnoten 6/7' },
] as const;

// ---------------------------------------------------------------------------
// Typen
// ---------------------------------------------------------------------------

/** Der Wert eines Feldes, das die Quelle nicht hergibt. */
export type Unbekannt = 'unbekannt';

/**
 * Behandlungswege nach Anhang I, einschließlich unbekannt. `sonstige-verwertung`
 * umfasst u. a. energetische Verwertung.
 */
export type Behandlungsweg =
  | 'vorbereitung-wiederverwendung'
  | 'recycling'
  | 'sonstige-verwertung'
  | 'beseitigung'
  | 'unbekannt';

export const BEHANDLUNGSWEGE: readonly Behandlungsweg[] = [
  'vorbereitung-wiederverwendung',
  'recycling',
  'sonstige-verwertung',
  'beseitigung',
  'unbekannt',
] as const;

/**
 * Kein abschließender Katalog von Offenlegungsgründen: Ausnahmen sind bedingt.
 */
/** @deprecated No whitelist applies to disclosure reasons; retained for imports only. */
export const AUSNAHME_GRUENDE: readonly string[] = [];

/** Anteil eines Behandlungswegs in Prozent. */
export interface WegAnteil {
  weg: Behandlungsweg;
  anteilProzent: number;
}

/** Eine Zeile (Warengruppe) einer Offenlegung. */
export interface Position {
  id: string;
  warengruppe: string;
  cnCode?: string | Unbekannt;
  stueck: number | Unbekannt;
  gewichtKg: number | Unbekannt;
  /** @deprecated Alte gemeinsame Kennzeichnung; neue Übertragungen nutzen die beiden einzelnen Felder. */
  geschaetzt?: boolean;
  schaetzungStueck?: boolean | Unbekannt;
  schaetzungGewicht?: boolean | Unbekannt;
  verpackung?: boolean | Unbekannt;
  vernichtetProzent?: number | Unbekannt;
  gruende: string[] | Unbekannt;
  behandlungswege: WegAnteil[] | Unbekannt;
}

/** Herkunft einer Offenlegung. */
export interface Quelle {
  url: string;
  /** ISO-Datum JJJJ-MM-TT */
  abgerufenAm: string;
  archivSnapshot?: string;
}

/** Eine übertragene Offenlegung eines Unternehmens für ein Geschäftsjahr. */
export interface Offenlegung {
  unternehmen: string;
  geschaeftsjahr: number;
  /** true für konstruierte Testdaten, die keine echte Offenlegung abbilden */
  synthetisch?: boolean;
  format: 'tabelle' | 'freitext';
  quelle: Quelle;
  positionen: Position[];
  freitext?: string;
  /** Historical is the default: Annex I is not retroactively required. */
  pruefmodus?: 'historisch' | 'anhang-i';
  zeitraum?: { von: string; bis: string };
  rechtstraeger?: { kennung: string; typ: string; art: 'einzeln' | 'konsolidiert'; mitglieder: string[] };
  praevention?: { getroffen: string | Unbekannt; geplant: string | Unbekannt };
}

/** Nachweis einer erfolglosen Suche: Stand und Suchweg sind Pflicht. */
export interface Suchnachweis {
  unternehmen: string;
  geschaeftsjahr: number;
  synthetisch?: boolean;
  /** ISO-Datum der Suche */
  stand: string;
  suchweg: { orte: string[]; suchbegriffe: string[] };
}

/** Deterministische Rückfrageregeln, keine rechtliche Bewertung. */
export type RegelId =
  | 'V0-FREITEXT'
  | 'V1-PROZENTSUMME'
  | 'V2-GRUND'
  | 'V3-CN-CODE'
  | 'V4-STUECK-GEWICHT'
  | 'V5-SCHAETZUNG'
  | 'V6-VERNICHTUNGSSUMME'
  | 'V7-ANHANG-FELD';

/** Ein Befund ist immer eine Frage an die Übertragung, nie ein Urteil. */
export interface Befund {
  regel: RegelId;
  art: 'frage';
  position: string | null;
  frageDe: string;
  frageEn: string;
}

/** Ergebnis von `pruefeOffenlegung`. Enthält bewusst kein Gesamturteil. */
export interface PruefErgebnis {
  unternehmen: string;
  geschaeftsjahr: number;
  schemaStatus: SchemaStatus;
  befunde: Befund[];
  /** Felder mit Wert `unbekannt` oder ohne Angabe, als `<position>.<feld>` */
  felderUnbekannt: string[];
}

/** Die einzigen zwei Registerstatus. */
export type RegisterStatus = 'gefunden' | 'keine Offenlegung gefunden';
export const REGISTER_STATUS: readonly RegisterStatus[] = ['gefunden', 'keine Offenlegung gefunden'] as const;

/** Eine Zeile des Registers (Unternehmen × Geschäftsjahr). */
export interface RegisterZeile {
  unternehmen: string;
  geschaeftsjahr: number;
  status: RegisterStatus;
  /** Klartext; bei fehlender Offenlegung mit Stand und Suchweg */
  statusText: string;
  stand: string;
  suchweg: string | null;
  quelleUrl: string | null;
  abgerufenAm: string | null;
  archivSnapshot: string | null;
  anzahlFragen: number | null;
  schemaStatus: SchemaStatus;
  synthetisch: boolean;
}

// ---------------------------------------------------------------------------
// Konstanten und Hilfen
// ---------------------------------------------------------------------------

/** Technische Toleranz für fünf auf ganze Prozent gerundete Anteile, keine Rechtsregel. */
export const PROZENT_TOLERANZ = 2; // Five whole-number shares: engineering rounding tolerance, not legal exemption.

/**
 * Grobe Spannen kg je Stück nach KN-Kapitel (Heuristik, keine Norm). Sie sollen
 * nur Übertragungsfehler (Tonnen statt kg, Stück vertauscht) sichtbar machen.
 */
export const GEWICHT_JE_STUECK: Readonly<Record<string, readonly [number, number]>> = {
  '42': [0.02, 10], // Lederwaren, Taschen
  '61': [0.01, 5], // Bekleidung, gewirkt
  '62': [0.01, 5], // Bekleidung, nicht gewirkt
  '64': [0.05, 5], // Schuhe
  standard: [0.001, 1000],
};

/** Wörter, die keine Ausgabe dieses Kerns je enthalten darf. */
export const VERBOTENE_WOERTER: readonly RegExp[] = [
  /verstoß/i,
  /verstoss/i,
  /säumig/i,
  /saeumig/i,
  /violation/i,
  /non-?complian/i,
];

/**
 * Wirft, wenn ein Text ein Vorwurfswort enthält. Wird auf jede erzeugte
 * Ausgabe angewendet, damit die neutrale Sprache nicht nur Konvention ist.
 */
export function assertNeutraleSprache(text: string): string {
  for (const muster of VERBOTENE_WOERTER) {
    if (muster.test(text)) throw new Error(`Unzulässiges Vorwurfswort in Ausgabe: ${muster.source}`);
  }
  return text;
}

/** true, wenn der Text kein Vorwurfswort enthält. */
export function istNeutral(text: string): boolean {
  return !VERBOTENE_WOERTER.some((m) => m.test(text));
}

const ISO_DATUM = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

function pruefeDatum(wert: unknown, feld: string): string {
  if (typeof wert !== 'string' || !ISO_DATUM.test(wert) || (Number.isNaN(Date.parse(wert)) || new Date(wert).toISOString().slice(0, 10) !== wert)) {
    throw new Error(`${feld}: kein gültiges ISO-Datum (JJJJ-MM-TT): ${String(wert)}`);
  }
  return wert;
}

function pruefeKopf(unternehmen: unknown, gj: unknown): void {
  if (typeof unternehmen !== 'string' || unternehmen.trim() === '') throw new Error('Unternehmen fehlt');
  if (typeof gj !== 'number' || !Number.isInteger(gj)) throw new Error(`Geschäftsjahr ungültig: ${String(gj)}`);
}

const fmt = (n: number): string => String(Math.round(n * 100) / 100);

function befund(regel: RegelId, position: string | null, frageDe: string, frageEn: string): Befund {
  if (!frageDe.trim().endsWith('?') || !frageEn.trim().endsWith('?')) {
    throw new Error(`Befund ${regel} ist nicht als Frage formuliert`);
  }
  assertNeutraleSprache(frageDe);
  assertNeutraleSprache(frageEn);
  return { regel, art: 'frage', position, frageDe, frageEn };
}

/**
 * Formale Prüfung der Anhang-I-Kategorie: zwei oder gelistete vier Ziffern.
 * Kapitel 01–97 ohne das unbelegte Kapitel 77; kein Tarifierungsnachweis.
 * Liefert `null` bei gültigem Code, sonst den Grund.
 */
/** Exhaustive four-digit categories from Annex II (2026/2). */
export const CN_VIERSTELLIG = ['3401','3402','4011','4202','4203','4303','4818','6301','6302','6303','6304','6306','6307','8415','8418','8421','8422','8423','8443','8450','8467','8471','8506','8507','8508','8509','8510','8513','8516','8517','8518','8519','8521','8523','8524','8528','8539','9006','9401','9403','9404','9503','9504','9619'] as const;
export function cnCodeProblem(code: string): 'format' | 'kapitel' | 'granularitaet' | null {
  const z = code.replace(/[\s.]/g, '');
  if (!/^\d+$/.test(z)) return 'format';
  const kapitel = Number(z.slice(0, 2));
  if (kapitel < 1 || kapitel > 97 || kapitel === 77) return 'kapitel';
  if (z.length !== 2 && z.length !== 4) return 'format';
  if (z.length === 4 && !(CN_VIERSTELLIG as readonly string[]).includes(z)) return 'granularitaet';
  return null;
}

// ---------------------------------------------------------------------------
// Prüfer
// ---------------------------------------------------------------------------

/**
 * Prüft Quellenarithmetik und bei ausdrücklicher Auswahl das zukünftige
 * Anhang-I-Feldmodell. Ohne Netz, ohne Modell. Jeder Befund ist eine Frage.
 *
 * Regeln: V0 Freitext ohne Tabelle · V1 Prozentsumme der Behandlungswege ≠ 100 ·
 * V2 fehlender Grund oder mehrere Gründe in einer Zeile · V3 KN-Kategorie ·
 * V4 Mengenheuristik · V5 Schätzbasis · V6 Vernichtungssumme · V7 Formatfelder.
 *
 * @throws bei ungültiger Eingabe (siehe Invariante 4)
 */
export function pruefeOffenlegung(o: Offenlegung): PruefErgebnis {
  pruefeKopf(o?.unternehmen, o?.geschaeftsjahr);
  if (!o.quelle || typeof o.quelle.url !== 'string' || !/^https?:\/\//.test(o.quelle.url)) {
    throw new Error(`${o.unternehmen} ${o.geschaeftsjahr}: Quell-URL fehlt oder ist ungültig`);
  }
  pruefeDatum(o.quelle.abgerufenAm, 'quelle.abgerufenAm');
  if (o.format !== 'tabelle' && o.format !== 'freitext') throw new Error(`Unbekanntes Format: ${String(o.format)}`);
  if (!Array.isArray(o.positionen)) throw new Error('positionen muss ein Array sein');
  if (o.format === 'tabelle' && o.positionen.length === 0) {
    throw new Error('Format „tabelle" ohne Positionen — als „freitext" übertragen oder Positionen ergänzen');
  }

  if (o.pruefmodus !== undefined && o.pruefmodus !== 'historisch' && o.pruefmodus !== 'anhang-i') throw new Error('Unbekannter Prüfmodus');
  if (o.zeitraum !== undefined && (!o.zeitraum || typeof o.zeitraum !== 'object')) throw new Error('zeitraum: Objekt erwartet');
  if (o.rechtstraeger !== undefined) {
    const r=o.rechtstraeger;
    if (!r || typeof r !== 'object' || typeof r.kennung !== 'string' || !r.kennung.trim() || typeof r.typ !== 'string' || !r.typ.trim() || !['einzeln','konsolidiert'].includes(r.art) || !Array.isArray(r.mitglieder) || r.mitglieder.some(m=>typeof m!=='string'||!m.trim())) throw new Error('rechtstraeger: ungültige Angaben');
  }
  if (o.praevention !== undefined) {
    const r=o.praevention;
    if (!r || typeof r!=='object' || typeof r.getroffen!=='string' || !r.getroffen.trim() || typeof r.geplant!=='string'||!r.geplant.trim()) throw new Error('praevention: ungültige Angaben');
  }
  if (o.zeitraum) {
    pruefeDatum(o.zeitraum.von, 'zeitraum.von'); pruefeDatum(o.zeitraum.bis, 'zeitraum.bis');
    if (o.zeitraum.von > o.zeitraum.bis) throw new Error('Geschäftsjahr endet vor Beginn');
  }
  const befunde: Befund[] = [];
  const felderUnbekannt: string[] = [];

  if (o.format === 'freitext') {
    befunde.push(
      befund(
        'V0-FREITEXT',
        null,
        'Die Offenlegung liegt nur als Fließtext vor. Lassen sich Stückzahl, Gewicht, Gründe und Behandlungswege daraus von Hand übertragen?',
        'The disclosure is prose only. Can units, weight, reasons and treatment routes be transcribed from it by hand?'
      )
    );
    if (o.positionen.length === 0) {
      felderUnbekannt.push('*.stueck', '*.gewichtKg', '*.gruende', '*.behandlungswege', '*.cnCode', '*.schaetzungStueck', '*.schaetzungGewicht', '*.verpackung', '*.vernichtetProzent');
    }
  }

  if (o.pruefmodus === 'anhang-i') {
    for (const [feld, vorhanden] of [
      ['zeitraum', Boolean(o.zeitraum)],
      ['rechtstraeger', Boolean(o.rechtstraeger?.kennung?.trim() && o.rechtstraeger?.typ?.trim() && (o.rechtstraeger.art === 'einzeln' || (o.rechtstraeger.art === 'konsolidiert' && o.rechtstraeger.mitglieder.length)))],
      ['praevention.getroffen', Boolean(o.praevention?.getroffen?.trim() && o.praevention.getroffen !== 'unbekannt')],
      ['praevention.geplant', Boolean(o.praevention?.geplant?.trim() && o.praevention.geplant !== 'unbekannt')],
    ] as const) {
      if (!vorhanden) { felderUnbekannt.push(feld); befunde.push(befund('V7-ANHANG-FELD', null, `Für den ausdrücklich gewählten zukünftigen Anhang-I-Vergleich fehlt ${feld}. Lässt sich das Feld aus der Quelle übertragen?`, `For the explicitly selected future Annex I comparison, ${feld} is missing. Can it be transcribed from the source?`)); }
    }
  }
  const ids = new Set<string>();
  for (const p of o.positionen) {
    if (typeof p.id !== 'string' || p.id === '') throw new Error('Position ohne id');
    if (ids.has(p.id)) throw new Error(`Doppelte Positions-ID: ${p.id}`);
    ids.add(p.id);
    pruefePosition(p, befunde, felderUnbekannt, o.pruefmodus === 'anhang-i');
  }

  return {
    unternehmen: o.unternehmen,
    geschaeftsjahr: o.geschaeftsjahr,
    schemaStatus: SCHEMA_STATUS,
    befunde,
    felderUnbekannt,
  };
}

function pruefeZahl(wert: number | Unbekannt, feld: string): number | null {
  if (wert === 'unbekannt') return null;
  if (typeof wert !== 'number' || !Number.isFinite(wert) || wert < 0) {
    throw new Error(`${feld}: ungültige Zahl ${String(wert)}`);
  }
  return wert;
}

function pruefePosition(p: Position, befunde: Befund[], unbekannt: string[], anhang: boolean): void {
  if (p.cnCode !== undefined && typeof p.cnCode !== 'string') throw new Error(`${p.id}.cnCode: Zeichenkette erwartet`);
  if (typeof p.warengruppe !== 'string' || !p.warengruppe.trim()) throw new Error(`${p.id}: Warengruppenbeschreibung fehlt`);
  if (p.verpackung !== undefined && p.verpackung !== 'unbekannt' && typeof p.verpackung !== 'boolean') throw new Error(`${p.id}: ungültige Verpackungsangabe`);
  const stueck = pruefeZahl(p.stueck, `${p.id}.stueck`);
  const kg = pruefeZahl(p.gewichtKg, `${p.id}.gewichtKg`);
  if (stueck === null) unbekannt.push(`${p.id}.stueck`);
  if (kg === null) unbekannt.push(`${p.id}.gewichtKg`);

  // V1 — Prozentsumme der Behandlungswege
  if (p.behandlungswege === 'unbekannt') {
    unbekannt.push(`${p.id}.behandlungswege`);
  } else {
    if (!Array.isArray(p.behandlungswege)) throw new Error(`${p.id}.behandlungswege: Array oder „unbekannt" erwartet`);
    let summe = 0;
    const gesehen = new Set<string>();
    for (const w of p.behandlungswege) {
      if (!BEHANDLUNGSWEGE.includes(w.weg)) throw new Error(`${p.id}: unbekannter Behandlungsweg „${String(w.weg)}"`);
      if (typeof w.anteilProzent !== 'number' || !(w.anteilProzent >= 0 && w.anteilProzent <= 100)) {
        throw new Error(`${p.id}: Anteil für ${w.weg} außerhalb 0–100: ${String(w.anteilProzent)}`);
      }
      if (gesehen.has(w.weg)) throw new Error(`${p.id}: doppelter Behandlungsweg`);
      gesehen.add(w.weg);
      summe += w.anteilProzent;
    }
    if (anhang && BEHANDLUNGSWEGE.some(route=>!gesehen.has(route))) befunde.push(befund('V7-ANHANG-FELD',p.id,'Im zukünftigen Anhang-I-Vergleich sind nicht alle fünf Behandlungswege übertragen. Welche Anteile nennt die Quelle einschließlich unbekannt?', 'For the future Annex I comparison not all five treatment routes were transcribed. Which shares does the source give, including unknown?'));
    if (p.behandlungswege.length === 0 || Math.abs(summe - 100) > PROZENT_TOLERANZ) {
      const s = fmt(summe);
      befunde.push(
        befund(
          'V1-PROZENTSUMME',
          p.id,
          summe < 100
            ? `Die Anteile der Behandlungswege summieren sich auf ${s} %. Fehlt ein Behandlungsweg?`
            : `Die Anteile der Behandlungswege summieren sich auf ${s} %. Ist ein Weg doppelt gezählt?`,
          summe < 100
            ? `The treatment-route shares add up to ${s} %. Is a treatment route missing from the transcription?`
            : `The treatment-route shares add up to ${s} %. Is a route counted twice?`
        )
      );
    }
  }

  // V2 — freie Gründe; mehrere Gründe benötigen im Anhang-I-Vergleich getrennte Zeilen
  if (p.gruende === 'unbekannt') {
    unbekannt.push(`${p.id}.gruende`);
  } else {
    if (!Array.isArray(p.gruende)) throw new Error(`${p.id}.gruende: Array oder „unbekannt" erwartet`);
    if (p.gruende.length === 0) {
      befunde.push(
        befund(
          'V2-GRUND',
          p.id,
          'Zu dieser Warengruppe ist kein Grund übertragen. Nennt die Offenlegung einen?',
          'No reason is transcribed for this product group. Does the disclosure state one?'
        )
      );
    }
    if (p.gruende.some((g) => typeof g !== 'string' || !g.trim())) throw new Error(`${p.id}: leerer oder ungültiger Grund`);
    if (anhang && p.gruende.length > 1) befunde.push(befund('V2-GRUND', p.id, 'Mehrere Gründe stehen in einer Zeile. Lassen sich Stückzahl und Gewicht nach Grund auf getrennte Zeilen verteilen?', 'Several reasons appear in one row. Can units and weight be split into separate rows by reason?'));
  }
  if (p.vernichtetProzent === 'unbekannt' || p.vernichtetProzent === undefined) unbekannt.push(`${p.id}.vernichtetProzent`);
  else {
    if (typeof p.vernichtetProzent !== 'number' || !Number.isFinite(p.vernichtetProzent) || p.vernichtetProzent < 0 || p.vernichtetProzent > 100) throw new Error(`${p.id}: ungültige Vernichtungssumme`);
    if (p.behandlungswege !== 'unbekannt' && ['recycling','sonstige-verwertung','beseitigung'].every(route=>p.behandlungswege !== 'unbekannt' && p.behandlungswege.some(w=>w.weg===route))) {
      const sum = p.behandlungswege.filter(w => ['recycling','sonstige-verwertung','beseitigung'].includes(w.weg)).reduce((a,w) => a+w.anteilProzent,0);
      if (Math.abs(sum-p.vernichtetProzent)>2) befunde.push(befund('V6-VERNICHTUNGSSUMME',p.id,`Die Quelle nennt ${p.vernichtetProzent} % Gesamtvernichtung, die drei Teilwege ergeben ${fmt(sum)} %. Sind die Ausgangswerte richtig übertragen?`,`The source states ${p.vernichtetProzent}% total destruction while the three component routes add up to ${fmt(sum)}%. Were the source values transcribed correctly?`));
    } else unbekannt.push(`${p.id}.vernichtungssumme.berechnung`);
  }
  if (typeof p.verpackung !== 'boolean') {
    unbekannt.push(`${p.id}.verpackung`);
    if (anhang) befunde.push(befund('V7-ANHANG-FELD',p.id,'Im zukünftigen Anhang-I-Vergleich fehlt die Verpackungsangabe. Enthält das Gewicht die Verpackung?','For the future Annex I comparison the packaging flag is missing. Does the weight include packaging?'));
  }

  // V3 — KN-Code formal
  const cnKapitel = anhang ? pruefeCn(p, befunde, unbekannt) : (p.cnCode?.slice(0, 2) ?? null);

  // V4 — Stück und Gewicht zueinander
  if (stueck !== null && kg !== null) {
    if ((stueck === 0) !== (kg === 0)) {
      befunde.push(
        befund(
          'V4-STUECK-GEWICHT',
          p.id,
          `Stückzahl ${fmt(stueck)} und Gewicht ${fmt(kg)} kg passen nicht zusammen, weil eine der beiden Angaben null ist. Ist eine Zahl verrutscht?`,
          `Units ${fmt(stueck)} and weight ${fmt(kg)} kg do not fit together because one of them is zero. Has a figure slipped?`
        )
      );
    } else if (stueck > 0) {
      const [min, max] = GEWICHT_JE_STUECK[cnKapitel ?? 'standard'] ?? GEWICHT_JE_STUECK.standard;
      const jeStueck = kg / stueck;
      if (jeStueck < min || jeStueck > max) {
        const js = jeStueck < 0.01 ? jeStueck.toExponential(2) : fmt(jeStueck);
        befunde.push(
          befund(
            'V4-STUECK-GEWICHT',
            p.id,
            `Das ergibt ${js} kg je Stück, außerhalb der groben Spanne ${min}–${max} kg. Sind Einheiten vertauscht (t statt kg, Kartons statt Stück)?`,
            `That gives ${js} kg per unit, outside the rough range ${min}–${max} kg. Are units mixed up (t instead of kg, cartons instead of units)?`
          )
        );
      }
    }
  }

  if (anhang && [stueck,kg,...(p.behandlungswege==='unbekannt'?[]:p.behandlungswege.map(w=>w.anteilProzent)),p.vernichtetProzent].some(n=>typeof n==='number'&&!Number.isInteger(n))) befunde.push(befund('V7-ANHANG-FELD',p.id,'Die übertragenen Originalwerte enthalten Nachkommastellen. Soll für den zukünftigen Anhang-I-Vergleich zusätzlich eine auf ganze Zahlen gerundete Darstellung erstellt werden?', 'The transcribed source values contain decimals. Should a separate whole-number presentation be created for the future Annex I comparison?'));
  // Estimated quantities are marked independently; absent markers mean unknown.
  for (const feld of ['schaetzungStueck','schaetzungGewicht'] as const) {
    const wert = p[feld];
    if (wert !== undefined && wert !== 'unbekannt' && typeof wert !== 'boolean') throw new Error(`${p.id}.${feld}: ungültige Schätzkennzeichnung`);
    if (typeof wert !== 'boolean') unbekannt.push(`${p.id}.${feld}`);
  }
  if (anhang && (p.schaetzungStueck === true && p.schaetzungGewicht === true)) befunde.push(befund('V5-SCHAETZUNG',p.id,'Beide Mengen sind als geschätzt übertragen. Welche genau bestimmte Ausgangsgröße wurde für die Schätzung verwendet?','Both quantities are transcribed as estimated. Which accurately determined baseline was used for estimation?'));
}

function pruefeCn(p: Position, befunde: Befund[], unbekannt: string[]): string | null {
  if (p.cnCode === undefined || p.cnCode === 'unbekannt') { unbekannt.push(`${p.id}.cnCode`); return null; }
  if (typeof p.cnCode !== 'string') throw new Error(`${p.id}.cnCode: Zeichenkette erwartet`);
  const code=p.cnCode.replace(/[\s.]/g,'');
  if (cnCodeProblem(code) !== null) befunde.push(befund('V3-CN-CODE',p.id,'Für den zukünftigen Anhang-I-Vergleich sind zwei Stellen oder die gelisteten vierstelligen Kategorien vorgesehen. Welche Kategorie ergibt sich aus der Produktbeschreibung?','For the future Annex I comparison, two digits or the listed four-digit categories are specified. Which category follows from the product description?'));
  else if (code.length===2 && CN_VIERSTELLIG.some(c=>c.startsWith(code))) befunde.push(befund('V3-CN-CODE',p.id,'Das Kapitel enthält vierstellig zu meldende Kategorien. Gehört das beschriebene Produkt zu einer Kategorie aus Anhang II?','This chapter contains categories reported at four digits. Does the described product belong to an Annex II category?'));
  return code.slice(0,2);
}

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------

function suchwegText(s: Suchnachweis['suchweg']): string {
  return `Orte: ${s.orte.join(', ')}; Suchbegriffe: ${s.suchbegriffe.map((b) => `„${b}"`).join(', ')}`;
}

/**
 * Baut das Register (Unternehmen × Geschäftsjahr) aus gefundenen Offenlegungen
 * und Suchnachweisen. Der Status folgt allein daraus, in welcher Liste ein
 * Eintrag steht und ob er Quelle bzw. Stand und Suchweg trägt.
 *
 * @throws wenn ein Paar Unternehmen × GJ in beiden Listen oder doppelt steht,
 *         wenn Stand oder Suchweg fehlen, oder bei ungültiger Offenlegung.
 */
export function erstelleRegister(offenlegungen: Offenlegung[], suchnachweise: Suchnachweis[]): RegisterZeile[] {
  const gesehen = new Set<string>();
  const schluessel = (u: string, gj: number) => `${u}\u0000${gj}`;
  const zeilen: RegisterZeile[] = [];

  for (const o of offenlegungen) {
    const erg = pruefeOffenlegung(o);
    const k = schluessel(o.unternehmen, o.geschaeftsjahr);
    if (gesehen.has(k)) throw new Error(`Doppelter Eintrag: ${o.unternehmen} GJ ${o.geschaeftsjahr}`);
    gesehen.add(k);
    zeilen.push({
      unternehmen: o.unternehmen,
      geschaeftsjahr: o.geschaeftsjahr,
      status: 'gefunden',
      statusText: assertNeutraleSprache(`gefunden (abgerufen am ${o.quelle.abgerufenAm})`),
      stand: o.quelle.abgerufenAm,
      suchweg: null,
      quelleUrl: o.quelle.url,
      abgerufenAm: o.quelle.abgerufenAm,
      archivSnapshot: o.quelle.archivSnapshot ?? null,
      anzahlFragen: erg.befunde.length,
      schemaStatus: erg.schemaStatus,
      synthetisch: o.synthetisch === true,
    });
  }

  for (const s of suchnachweise) {
    pruefeKopf(s?.unternehmen, s?.geschaeftsjahr);
    pruefeDatum(s.stand, `${s.unternehmen} ${s.geschaeftsjahr}: stand`);
    const orte = s.suchweg?.orte;
    const begriffe = s.suchweg?.suchbegriffe;
    if (!Array.isArray(orte) || orte.filter((x) => x.trim()).length === 0) {
      throw new Error(`${s.unternehmen} ${s.geschaeftsjahr}: Suchweg ohne Orte — ohne Suchweg kein Eintrag`);
    }
    if (!Array.isArray(begriffe) || begriffe.filter((x) => x.trim()).length === 0) {
      throw new Error(`${s.unternehmen} ${s.geschaeftsjahr}: Suchweg ohne Suchbegriffe — ohne Suchweg kein Eintrag`);
    }
    const k = schluessel(s.unternehmen, s.geschaeftsjahr);
    if (gesehen.has(k)) {
      throw new Error(`Widerspruch: ${s.unternehmen} GJ ${s.geschaeftsjahr} steht als gefunden und als nicht gefunden`);
    }
    gesehen.add(k);
    const weg = suchwegText(s.suchweg);
    zeilen.push({
      unternehmen: s.unternehmen,
      geschaeftsjahr: s.geschaeftsjahr,
      status: 'keine Offenlegung gefunden',
      statusText: assertNeutraleSprache(`keine Offenlegung gefunden (Stand: ${s.stand}, Suchweg: ${weg})`),
      stand: s.stand,
      suchweg: weg,
      quelleUrl: null,
      abgerufenAm: null,
      archivSnapshot: null,
      anzahlFragen: null,
      schemaStatus: SCHEMA_STATUS,
      synthetisch: s.synthetisch === true,
    });
  }

  return zeilen.sort((a, b) => a.unternehmen.localeCompare(b.unternehmen, 'de') || a.geschaeftsjahr - b.geschaeftsjahr);
}

const CSV_SPALTEN: readonly (keyof RegisterZeile)[] = [
  'unternehmen',
  'geschaeftsjahr',
  'status',
  'statusText',
  'stand',
  'suchweg',
  'quelleUrl',
  'abgerufenAm',
  'archivSnapshot',
  'anzahlFragen',
  'schemaStatus',
  'synthetisch',
];

/** Statische CSV (Semikolon, RFC-4180-Quoting) aus Registerzeilen. */
export function registerAlsCsv(zeilen: RegisterZeile[]): string {
  const zelle = (v: unknown): string => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const text = [CSV_SPALTEN.join(';'), ...zeilen.map((z) => CSV_SPALTEN.map((k) => zelle(z[k])).join(';'))].join('\n');
  return assertNeutraleSprache(text);
}
