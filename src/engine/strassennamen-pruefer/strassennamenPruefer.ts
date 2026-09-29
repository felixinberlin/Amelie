/**
 * Straßennamen-Prüfer — Ähnlichkeitsprüfung neuer Straßennamen gegen ein Verzeichnis
 * (Street Name Checker — similarity check of proposed street names against a directory)
 *
 * Reiner, deterministischer TypeScript-Kern: kein DOM, kein Netzwerk, kein Modell.
 *
 * Harte Invarianten (Safety Case):
 *  1. Das Ergebnis ist eine Liste von Prüfhinweisen mit Fundstelle. Es gibt kein
 *     Gesamturteil, kein Feld `ok`, `gueltig`, `unzulaessig` o. ä. Die Entscheidung
 *     bleibt bei Amt und Gremium. Ein leeres Ergebnis heißt nur: unter den
 *     eingestellten Schwellen keine Ähnlichkeit zum übergebenen Verzeichnis.
 *  2. Jeder Hinweis trägt Regel-ID, Stärke, Fundstelle (vorhandene Straße) und
 *     Klartext De/En. `assertNeutraleSprache` wirft, wenn Ausgabetext ein
 *     Urteilswort enthält.
 *  3. Kölner Phonetik ist nie allein ein starkes Signal (höchstens `mittel`) und
 *     wird für Namen unter 4 Zeichen nicht ausgewertet (Falschalarm-Bremse).
 *  4. Die Personennamen-Ausnahme unterdrückt Klang und Editierdistanz nicht
 *     stillschweigend: das Unterdrückte steht in `unterdrueckt`.
 *  5. Ungültige Eingaben (leerer Vorschlag, doppelte Straßen-IDs, falsche Typen)
 *     werfen einen Fehler.
 *  6. Kein Netzwerkzugriff; Straßendaten kommen als Argument.
 *
 * Lizenz: CC0 1.0 Public Domain.
 */

// ---------------------------------------------------------------------------
// Typen
// ---------------------------------------------------------------------------

export type RegelId = 'S1-IDENTISCH' | 'S2-GRUNDWORT' | 'S3-KLANG' | 'S4-DISTANZ';
export type Staerke = 'stark' | 'mittel' | 'schwach';

export interface Strasse {
  id?: string;
  name: string;
  ortsteil?: string;
}

/** Ein Vorschlag: reine Zeichenkette oder mit Angaben für die Schalter. */
export interface Vorschlag {
  name: string;
  /** Der Name geht auf eine Person zurück (Schalter Personennamen-Ausnahme). */
  personenname?: boolean;
  /** Ortsteil, in dem die Straße liegen soll (Schalter räumlicher Zusammenhang). */
  ortsteil?: string;
}

export interface Optionen {
  /** Personennamen-Ausnahme aktiv (Standard: true). Nur wirksam bei `personenname: true`. */
  personennamenAusnahme?: boolean;
  /** Kürzeste Stammlänge für Klang und Distanz (Standard 4). */
  minStammLaenge?: number;
  /** Höchste Editierdistanz für kurze Stämme (bis 8 Zeichen, Standard 1). */
  maxDistanzKurz?: number;
  /** Höchste Editierdistanz für längere Stämme (ab 9 Zeichen, Standard 2). */
  maxDistanzLang?: number;
  /** Grundwörter, die abgestreift werden (Standard: `STANDARD_GRUNDWOERTER`). */
  grundwoerter?: readonly string[];
}

export interface Normalisiert {
  original: string;
  /** Kleinschreibung, ß→ss, Umlaute→ae/oe/ue, ohne Satzzeichen, Leerraum verdichtet. */
  voll: string;
  /** Stamm ohne Grundwort und ohne Trenner. */
  stamm: string;
  /** Abgestreiftes Grundwort (kanonisch, `str` → `strasse`) oder null. */
  grundwort: string | null;
}

export interface Fundstelle {
  strasse: string;
  id: string | null;
  ortsteil: string | null;
  /** `verzeichnis` oder `vorschlagsliste`. */
  quelle: 'verzeichnis' | 'vorschlagsliste';
}

export interface Richtlinienbezug {
  /** Nur Quellen, die im Dossier oder Reviewer-Log belegt sind. */
  quelle: string;
  /** Wörtliches Zitat aus dem Dossier, sonst null. */
  zitat: string | null;
  /** Absatznummer: nicht übertragen. */
  absatz: null;
}

export interface Hinweis {
  regelId: RegelId;
  staerke: Staerke;
  /** Alle Regeln, die für dieselbe Straße angeschlagen haben (stärkste zuerst). */
  signale: RegelId[];
  fundstelle: Fundstelle;
  richtlinie: Richtlinienbezug;
  /** `gleicher-ortsteil`, `anderer-ortsteil` oder `unbekannt`. Es wird nichts unterdrückt. */
  raum: 'gleicher-ortsteil' | 'anderer-ortsteil' | 'unbekannt';
  distanz: number | null;
  klangcode: string | null;
  begruendungDe: string;
  begruendungEn: string;
}

export interface Unterdrueckt {
  regelId: RegelId;
  fundstelle: Fundstelle;
  grundDe: string;
  grundEn: string;
}

export interface Pruefergebnis {
  vorschlag: string;
  normalisiert: Normalisiert;
  klangcode: string;
  /** Sortiert nach Stärke, dann Straßenname. */
  hinweise: Hinweis[];
  unterdrueckt: Unterdrueckt[];
  geprueftGegen: number;
  geltungsgrenzeDe: string;
  geltungsgrenzeEn: string;
}

// ---------------------------------------------------------------------------
// Konstanten
// ---------------------------------------------------------------------------

export const STANDARD_GRUNDWOERTER: readonly string[] = [
  'strasse', 'str', 'weg', 'allee', 'platz', 'gasse', 'ring', 'pfad', 'damm', 'ufer', 'steig',
] as const;

export const GELTUNGSGRENZE_DE =
  'Dieser Prüfer vergleicht nur Schreibweise, Klang und Editierdistanz mit dem übergebenen Verzeichnis. ' +
  'Kein Hinweis bedeutet nur: unter den eingestellten Schwellen wurde keine Ähnlichkeit gefunden. ' +
  'Die Entscheidung liegt bei Amt und Gremium.';
export const GELTUNGSGRENZE_EN =
  'This checker compares only spelling, sound and edit distance against the directory you supply. ' +
  'No note only means: nothing similar was found under the configured thresholds. ' +
  'The decision rests with the office and the council.';

/** Wörter, die eine Bewertung oder Freigabe ausdrücken würden. Kommen in keiner Ausgabe vor. */
export const URTEILSWOERTER = /zul(ä|ae)ssig|verboten|abgelehnt|genehmigt|unbedenklich|sicher|freigegeben|gr(ü|ue)n|admissible|inadmissible|forbidden|approved|rejected|\bsafe\b|\bok\b/i;

const QUELLE_FRANKFURT = 'Frankfurt am Main, Leitfaden Straßenbenennung (2023), Zitat laut Dossier';
const QUELLE_VIER = 'Kommunale Richtlinien (Drensteinfurt, Bornheim, Dortmund, Frankfurt 2023); Wortlaut und Absatz nicht übertragen';

const RICHTLINIE: Record<RegelId, Richtlinienbezug> = {
  'S1-IDENTISCH': { quelle: QUELLE_VIER, zitat: null, absatz: null },
  'S2-GRUNDWORT': { quelle: QUELLE_FRANKFURT, zitat: 'nur durch das Grundwort unterschieden', absatz: null },
  'S3-KLANG': { quelle: QUELLE_FRANKFURT, zitat: 'gleichklingende Namen sind zu vermeiden', absatz: null },
  'S4-DISTANZ': { quelle: 'Heuristik dieses Prüfers, keine Richtlinienregel', zitat: null, absatz: null },
};

const RANG: Record<RegelId, number> = { 'S1-IDENTISCH': 0, 'S2-GRUNDWORT': 1, 'S3-KLANG': 2, 'S4-DISTANZ': 3 };
const STAERKE_RANG: Record<Staerke, number> = { stark: 0, mittel: 1, schwach: 2 };

// ---------------------------------------------------------------------------
// Normalisierung
// ---------------------------------------------------------------------------

function fuerVergleich(s: string): string {
  return s
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function kanonischesGrundwort(g: string): string {
  return g === 'str' ? 'strasse' : g;
}

export function normalisiere(name: string, grundwoerter: readonly string[] = STANDARD_GRUNDWOERTER): Normalisiert {
  if (typeof name !== 'string' || fuerVergleich(name) === '') {
    throw new Error('Straßenname muss ein nicht leerer Text sein.');
  }
  const voll = fuerVergleich(name);
  // Längste Grundwörter zuerst; Trenner (Leerzeichen/Bindestrich) vor dem Grundwort erlaubt.
  const sortiert = [...grundwoerter].sort((a, b) => b.length - a.length);
  let stamm = voll;
  let grundwort: string | null = null;
  for (const g of sortiert) {
    if (voll.endsWith(g)) {
      const rest = voll.slice(0, voll.length - g.length).replace(/[\s-]+$/, '');
      const restKompakt = rest.replace(/[\s-]/g, '');
      // Nur abstreifen, wenn ein echter Stamm übrig bleibt („Ring" allein bleibt Ring).
      if (restKompakt.length >= 3) {
        stamm = rest;
        grundwort = kanonischesGrundwort(g);
        break;
      }
    }
  }
  return { original: name, voll, stamm: stamm.replace(/[\s-]/g, ''), grundwort };
}

// ---------------------------------------------------------------------------
// Kölner Phonetik
// ---------------------------------------------------------------------------

/**
 * Kölner Phonetik (Postel 1969) auf einem bereits normalisierten Text.
 * Eingabe: nur a–z; Umlaute wurden zu ae/oe/ue aufgelöst.
 */
export function koelnerPhonetik(text: string): string {
  const w = fuerVergleich(text).replace(/[^a-z]/g, '').toUpperCase();
  const codes: string[] = [];
  for (let i = 0; i < w.length; i++) {
    const c = w[i];
    const vor = i > 0 ? w[i - 1] : '';
    const nach = i < w.length - 1 ? w[i + 1] : '';
    let code: string;
    if ('AEIJOUY'.includes(c)) code = '0';
    else if (c === 'H') code = '';
    else if (c === 'B') code = '1';
    else if (c === 'P') code = nach === 'H' ? '3' : '1';
    else if (c === 'D' || c === 'T') code = 'CSZ'.includes(nach) && nach !== '' ? '8' : '2';
    else if (c === 'F' || c === 'V' || c === 'W') code = '3';
    else if (c === 'G' || c === 'K' || c === 'Q') code = '4';
    else if (c === 'C') {
      if (i === 0) code = nach !== '' && 'AHKLOQRUX'.includes(nach) ? '4' : '8';
      else if ('SZ'.includes(vor)) code = '8';
      else code = nach !== '' && 'AHKOQUX'.includes(nach) ? '4' : '8';
    } else if (c === 'X') code = 'CKQ'.includes(vor) && vor !== '' ? '8' : '48';
    else if (c === 'L') code = '5';
    else if (c === 'M' || c === 'N') code = '6';
    else if (c === 'R') code = '7';
    else if (c === 'S' || c === 'Z') code = '8';
    else code = '';
    codes.push(code);
  }
  const roh = codes.join('');
  let ohneDoppelte = '';
  for (const z of roh) if (z !== ohneDoppelte[ohneDoppelte.length - 1]) ohneDoppelte += z;
  if (ohneDoppelte.length === 0) return '';
  return ohneDoppelte[0] + ohneDoppelte.slice(1).replace(/0/g, '');
}

// ---------------------------------------------------------------------------
// Editierdistanz (Damerau-Levenshtein, optimal string alignment)
// ---------------------------------------------------------------------------

export function editierdistanz(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const kosten = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + kosten);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[m][n];
}

// ---------------------------------------------------------------------------
// Prüfung
// ---------------------------------------------------------------------------

export function assertNeutraleSprache(text: string): void {
  const m = text.match(URTEILSWOERTER);
  if (m) throw new Error(`Urteilswort in Ausgabetext: „${m[0]}“. Der Prüfer gibt nur Hinweise.`);
}

function alsVorschlag(v: string | Vorschlag): Vorschlag {
  return typeof v === 'string' ? { name: v } : v;
}

function pruefeVerzeichnis(verzeichnis: readonly Strasse[]): void {
  if (!Array.isArray(verzeichnis)) throw new Error('Verzeichnis muss eine Liste sein.');
  const ids = new Set<string>();
  for (const s of verzeichnis) {
    if (!s || typeof s.name !== 'string' || s.name.trim() === '') {
      throw new Error('Jede Straße im Verzeichnis braucht einen nicht leeren Namen.');
    }
    if (s.id !== undefined) {
      if (ids.has(s.id)) throw new Error(`Doppelte Straßen-ID: ${s.id}`);
      ids.add(s.id);
    }
  }
}

function raumVon(vorschlag: Vorschlag, s: Strasse): Hinweis['raum'] {
  if (!vorschlag.ortsteil || !s.ortsteil) return 'unbekannt';
  return fuerVergleich(vorschlag.ortsteil) === fuerVergleich(s.ortsteil) ? 'gleicher-ortsteil' : 'anderer-ortsteil';
}

function maxDistanz(stammLaenge: number, o: Required<Pick<Optionen, 'maxDistanzKurz' | 'maxDistanzLang'>>): number {
  return stammLaenge >= 9 ? o.maxDistanzLang : o.maxDistanzKurz;
}

interface Kandidat extends Strasse {
  quelle: Fundstelle['quelle'];
}

function pruefeEinen(vorschlag: Vorschlag, kandidaten: readonly Kandidat[], optionen: Optionen): Pruefergebnis {
  const grundwoerter = optionen.grundwoerter ?? STANDARD_GRUNDWOERTER;
  const minStamm = optionen.minStammLaenge ?? 4;
  const dist = {
    maxDistanzKurz: optionen.maxDistanzKurz ?? 1,
    maxDistanzLang: optionen.maxDistanzLang ?? 2,
  };
  const person = (optionen.personennamenAusnahme ?? true) && vorschlag.personenname === true;

  const norm = normalisiere(vorschlag.name, grundwoerter);
  const code = koelnerPhonetik(norm.stamm);
  const hinweise: Hinweis[] = [];
  const unterdrueckt: Unterdrueckt[] = [];

  for (const k of kandidaten) {
    const kn = normalisiere(k.name, grundwoerter);
    const fundstelle: Fundstelle = { strasse: k.name, id: k.id ?? null, ortsteil: k.ortsteil ?? null, quelle: k.quelle };
    const signale: RegelId[] = [];
    let distanz: number | null = null;
    let kcode: string | null = null;

    if (kn.stamm === norm.stamm) {
      signale.push(kn.grundwort === norm.grundwort ? 'S1-IDENTISCH' : 'S2-GRUNDWORT');
    } else if (norm.stamm.length >= minStamm && kn.stamm.length >= minStamm) {
      const kc = koelnerPhonetik(kn.stamm);
      const d = editierdistanz(norm.stamm, kn.stamm);
      const grenze = maxDistanz(Math.min(norm.stamm.length, kn.stamm.length), dist);
      const klang = code !== '' && kc === code;
      const nah = d <= grenze;
      if (klang || nah) {
        distanz = d;
        kcode = kc;
        const gefunden: RegelId[] = [];
        if (klang) gefunden.push('S3-KLANG');
        if (nah) gefunden.push('S4-DISTANZ');
        if (person) {
          for (const r of gefunden) {
            unterdrueckt.push({
              regelId: r,
              fundstelle,
              grundDe: 'Personennamen-Ausnahme: Der Vorschlag geht auf eine Person zurück; Klang und Editierdistanz werden nicht als Hinweis gemeldet.',
              grundEn: 'Person-name exception: the proposal refers to a person; sound and edit distance are not reported as a note.',
            });
          }
        } else {
          signale.push(...gefunden);
        }
      }
    }
    if (signale.length === 0) continue;

    signale.sort((a, b) => RANG[a] - RANG[b]);
    const regelId = signale[0];
    const staerke: Staerke =
      regelId === 'S1-IDENTISCH' || regelId === 'S2-GRUNDWORT' ? 'stark' : signale.length > 1 ? 'mittel' : regelId === 'S3-KLANG' ? 'mittel' : 'schwach';
    const h: Hinweis = {
      regelId,
      staerke,
      signale,
      fundstelle,
      richtlinie: RICHTLINIE[regelId],
      raum: raumVon(vorschlag, k),
      distanz,
      klangcode: kcode,
      ...begruende(regelId, vorschlag.name, k.name, norm, kn, distanz, signale),
    };
    // Straßennamen selbst (z. B. „Grüner Weg“) sind Daten, kein Urteil: vor der Prüfung entfernen.
    let text = h.begruendungDe + ' ' + h.begruendungEn;
    for (const teil of [vorschlag.name, k.name, norm.stamm, kn.stamm]) text = text.split(teil).join(' ');
    assertNeutraleSprache(text);
    hinweise.push(h);
  }

  hinweise.sort(
    (a, b) =>
      STAERKE_RANG[a.staerke] - STAERKE_RANG[b.staerke] ||
      RANG[a.regelId] - RANG[b.regelId] ||
      a.fundstelle.strasse.localeCompare(b.fundstelle.strasse, 'de') ||
      (a.fundstelle.id ?? '').localeCompare(b.fundstelle.id ?? ''),
  );

  return {
    vorschlag: vorschlag.name,
    normalisiert: norm,
    klangcode: code,
    hinweise,
    unterdrueckt,
    geprueftGegen: kandidaten.length,
    geltungsgrenzeDe: GELTUNGSGRENZE_DE,
    geltungsgrenzeEn: GELTUNGSGRENZE_EN,
  };
}

function begruende(
  regelId: RegelId,
  vorschlag: string,
  vorhanden: string,
  n: Normalisiert,
  kn: Normalisiert,
  distanz: number | null,
  signale: RegelId[],
): { begruendungDe: string; begruendungEn: string } {
  const paar = `„${vorschlag}“ / „${vorhanden}“`;
  const zusatz = signale.length > 1 ? ` Weitere Signale: ${signale.slice(1).join(', ')}.` : '';
  const zusatzEn = signale.length > 1 ? ` Further signals: ${signale.slice(1).join(', ')}.` : '';
  switch (regelId) {
    case 'S1-IDENTISCH':
      return {
        begruendungDe: `Prüfhinweis: ${paar} ergeben nach Normalisierung (ß/ss, Umlaute, Groß-/Kleinschreibung) denselben Namen „${n.stamm}${n.grundwort ? ' + ' + n.grundwort : ''}“. Ist die Doppelung gewollt?`,
        begruendungEn: `Note: ${paar} are the same name after normalisation (ß/ss, umlauts, case): "${n.stamm}${n.grundwort ? ' + ' + n.grundwort : ''}". Is the duplication intended?`,
      };
    case 'S2-GRUNDWORT':
      return {
        begruendungDe: `Prüfhinweis: ${paar} haben denselben Stamm „${n.stamm}“ und unterscheiden sich nur im Grundwort (${n.grundwort ?? 'keins'} / ${kn.grundwort ?? 'keins'}). Frankfurter Leitfaden 2023 nennt Namen, die nur durch das Grundwort unterschieden sind. Reicht der Unterschied für die Verwechslungsgefahr?`,
        begruendungEn: `Note: ${paar} share the stem "${n.stamm}" and differ only in the generic word (${n.grundwort ?? 'none'} / ${kn.grundwort ?? 'none'}). The Frankfurt guide (2023) lists names distinguished only by the generic word. Is the difference enough to avoid confusion?`,
      };
    case 'S3-KLANG':
      return {
        begruendungDe: `Prüfhinweis: ${paar} klingen nach Kölner Phonetik gleich („${n.stamm}“ / „${kn.stamm}“).${zusatz} Frankfurter Leitfaden 2023: gleichklingende Namen sind zu vermeiden. Wird der Klang im Alltag verwechselt?`,
        begruendungEn: `Note: ${paar} sound the same under Cologne phonetics ("${n.stamm}" / "${kn.stamm}").${zusatzEn} Frankfurt guide (2023): names that sound alike are to be avoided. Would the sound be confused in daily use?`,
      };
    case 'S4-DISTANZ':
      return {
        begruendungDe: `Prüfhinweis: ${paar} liegen nur ${distanz} Zeichen auseinander („${n.stamm}“ / „${kn.stamm}“). Das ist eine Heuristik des Prüfers, keine Richtlinienregel. Tippfehler-Nähe oder Zufall?`,
        begruendungEn: `Note: ${paar} differ by only ${distanz} character(s) ("${n.stamm}" / "${kn.stamm}"). This is a heuristic of the checker, not a guideline rule. Typo proximity or coincidence?`,
      };
  }
}

/** Ein Vorschlag gegen ein Verzeichnis. */
export function pruefeStrassenname(
  vorschlag: string | Vorschlag,
  verzeichnis: readonly Strasse[],
  optionen: Optionen = {},
): Pruefergebnis {
  pruefeVerzeichnis(verzeichnis);
  const v = alsVorschlag(vorschlag);
  const kandidaten: Kandidat[] = verzeichnis.map((s) => ({ ...s, quelle: 'verzeichnis' }));
  return pruefeEinen(v, kandidaten, optionen);
}

/**
 * Mehrere Vorschläge: jeder gegen das Verzeichnis und gegen die anderen Vorschläge
 * der Liste (Fundstelle `vorschlagsliste`). Reihenfolge der Ausgabe = Eingabereihenfolge.
 */
export function pruefeVorschlagsliste(
  vorschlaege: readonly (string | Vorschlag)[],
  verzeichnis: readonly Strasse[],
  optionen: Optionen = {},
): Pruefergebnis[] {
  pruefeVerzeichnis(verzeichnis);
  const liste = vorschlaege.map(alsVorschlag);
  return liste.map((v, i) => {
    const kandidaten: Kandidat[] = [
      ...verzeichnis.map((s): Kandidat => ({ ...s, quelle: 'verzeichnis' })),
      ...liste.flatMap((w, j): Kandidat[] =>
        j === i ? [] : [{ id: `vorschlag-${j + 1}`, name: w.name, ortsteil: w.ortsteil, quelle: 'vorschlagsliste' }],
      ),
    ];
    return pruefeEinen(v, kandidaten, optionen);
  });
}

/** Stabile JSON-Ausgabe (für Export/Snapshot). */
export function alsJson(ergebnisse: readonly Pruefergebnis[]): string {
  return JSON.stringify(ergebnisse, null, 2);
}
