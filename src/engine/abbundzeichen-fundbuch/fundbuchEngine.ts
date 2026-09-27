/**
 * Abbundzeichen-Fundbuch — Zählfolgen-Prüfer für Abbundzeichen
 * (Carpenters' Marks Logbook — sequence checker for assembly marks)
 *
 * Reiner, deterministischer TypeScript-Kern: kein DOM, kein Netzwerk, kein Modell.
 *
 * Harte Invarianten (Safety Case):
 *  1. Jede Meldung trägt genau eine von zwei Stufen: `hinweis` oder `verdacht`.
 *     Einen bestätigten Befund („bestätigt") kann dieser Kern weder im Typsystem
 *     noch zur Laufzeit erzeugen — Bauforschung bleibt Sache der Menschen.
 *  2. `unlesbar` ist ein eigener, gleichberechtigter Zustand, kein Fehler. Ein
 *     unlesbares Zeichen bricht keine Regel und verursacht keinen Befund.
 *  3. Jede Meldung trägt Regel-ID und Klartextbegründung (De/En).
 *  4. Der Export kennt Ortsangaben nur auf Gemeindeebene. Genauere Ortsfelder
 *     werden nicht still verworfen, sondern mit einem Fehler abgelehnt.
 *  5. Ungültige Eingaben (unbekannte Notation, doppelte IDs, fehlende Wand)
 *     werfen einen Fehler — nichts wird still ignoriert.
 *
 * Lizenz: CC0 1.0 Public Domain.
 */

// ---------------------------------------------------------------------------
// Typen
// ---------------------------------------------------------------------------

/**
 * Die einzigen zwei Stufen, die der Kern vergibt. Es gibt bewusst keine dritte
 * Stufe — `'bestaetigt'` ist kein zulässiger Wert dieses Typs.
 */
export type Stufe = 'hinweis' | 'verdacht';

/** Alle zulässigen Stufen zur Laufzeitprüfung. */
export const STUFEN: readonly Stufe[] = ['hinweis', 'verdacht'] as const;

/** Die fünf deterministischen Prüfregeln. */
export type RegelId =
  | 'R1-LUECKE'
  | 'R2-DOPPELUNG'
  | 'R3-FREMDE-SERIE'
  | 'R4-NOTATIONSBRUCH'
  | 'R5-RICHTUNGSBRUCH';

/** Rolle eines Bauteils im Gefüge. */
export type Rolle =
  | 'staender'
  | 'riegel'
  | 'strebe'
  | 'kopfband'
  | 'fussband'
  | 'balken'
  | 'sparren'
  | 'rahm'
  | 'schwelle'
  | 'sonstiges';

/**
 * Typ eines Serienzeichens (Ausstich, Fähnchen …), das der Ziffer angehängt ist.
 * Notation: `^` Ausstich (Dreieckskerbe), `>` Fähnchen, `/` Beistrich, `o` Kreis/Loch.
 * `keine` = römisch einfach, ohne Serienzeichen.
 */
export type SerienTyp = 'keine' | 'ausstich' | 'faehnchen' | 'beistrich' | 'kreis';

/** Serienzeichen: Typ und Anzahl (z. B. `VII>>` → Fähnchen, 2). */
export interface Serie {
  typ: SerienTyp;
  anzahl: number;
}

/**
 * Schreibweise der Ziffer. `neutral` heißt: die Ziffer sieht additiv und
 * subtraktiv gleich aus (z. B. `III`, `VII`) und kann keinen Notationsbruch
 * begründen.
 */
export type Notation = 'additiv' | 'subtraktiv' | 'neutral';

/** Ergebnis des Parsers für ein gelesenes Zeichen. */
export interface GelesenesZeichen {
  zustand: 'gelesen';
  roh: string;
  wert: number;
  notation: Notation;
  serie: Serie;
}

/** Ergebnis des Parsers für ein unlesbares Zeichen — gleichberechtigter Zustand. */
export interface UnlesbaresZeichen {
  zustand: 'unlesbar';
  roh: string;
}

export type ZeichenLesung = GelesenesZeichen | UnlesbaresZeichen;

/** Art der Markierung (Erfassungsfeld, angelehnt an die in VA 49/1 genannte Terminologie). */
export type Markierungsart = 'eingeschlagen' | 'geritzt' | 'gerissen' | 'geroetelt' | 'unbekannt';

/** Werkzeug, mit dem das Zeichen angebracht wurde (Erfassungsfeld). */
export type Werkzeug = 'stemmeisen' | 'reissmesser' | 'beil' | 'saege' | 'roetel' | 'unbekannt';

/**
 * Ein erfasstes Bauteil. Entweder `wand` (Name der Wand/Wandseite) oder
 * `bund` (Nummer des Querbunds) muss gesetzt sein.
 */
export interface Bauteil {
  /** Eindeutige ID des Bauteils innerhalb der Erfassung. */
  id: string;
  wand?: string;
  bund?: number;
  /** Position entlang der Wand bzw. des Bunds (z. B. 1, 2, 3 … von links). */
  position: number;
  rolle: Rolle;
  /** Zeichen in Kurznotation, z. B. `IIII`, `IV`, `XII^`, `VII>>` oder `unlesbar`. */
  zeichen: string;
  markierungsart?: Markierungsart;
  werkzeug?: Werkzeug;
  /** Seite des Holzes, auf der das Zeichen sitzt (z. B. „Außenseite"). */
  seite?: string;
}

/** Eine Meldung des Prüfers. Nie ein Befund, immer nur Hinweis oder Verdacht. */
export interface Meldung {
  regel: RegelId;
  stufe: Stufe;
  /** Gruppenschlüssel der Wand bzw. des Bunds. */
  wand: string;
  /** IDs der betroffenen Bauteile (bei Lücken: die Nachbarn). */
  bauteile: string[];
  textDe: string;
  textEn: string;
}

/** Zusammenfassung einer Zählfolge (Wand × Rolle). */
export interface Folge {
  rolle: Rolle;
  /** Werte der lesbaren Bauteile in Positionsreihenfolge. */
  werte: number[];
  /** Laufrichtung der Zählung entlang der Positionen. */
  richtung: 'aufsteigend' | 'absteigend' | 'unbestimmt';
}

/** Zusammenfassung einer Wand. */
export interface WandSerie {
  wand: string;
  /** Mehrheitlich verwendetes Serienzeichen, `null` wenn keine klare Mehrheit. */
  dominanteSerie: Serie | null;
  zeichensystem: 'roemisch-einfach' | 'roemisch-mit-serienzeichen' | 'gemischt' | 'unbestimmt';
  folgen: Folge[];
}

/** Gesamtergebnis von `pruefeZaehlfolge`. */
export interface PruefErgebnis {
  serien: WandSerie[];
  befunde: Meldung[];
  /** IDs der Bauteile mit unlesbarem Zeichen. */
  unlesbar: string[];
  /** Fester Hinweis, dass das Ergebnis kein Bauforschungsbefund ist. */
  vorbehaltDe: string;
  vorbehaltEn: string;
}

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

const UNLESBAR_FORMEN = new Set(['unlesbar', 'unreadable', '?']);

const SERIEN_ZEICHEN: Record<string, SerienTyp> = {
  '^': 'ausstich',
  '>': 'faehnchen',
  '/': 'beistrich',
  o: 'kreis',
};

/**
 * Zimmermanns-Römisch: Hunderter, Zehner, Einer. Additive Formen mit bis zu
 * vier gleichen Zeichen (`IIII`, `VIIII`, `XXXX`) sind zulässig, ebenso die
 * subtraktiven Paare `IV`, `IX`, `XL`, `XC`.
 */
const ROEMISCH = /^(C{0,3})(XC|XL|L?X{0,4})(IX|IV|V?I{0,4})$/;

const ROEMISCH_WERT: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100 };

function roemischZuWert(ziffer: string): number {
  let summe = 0;
  for (let i = 0; i < ziffer.length; i++) {
    const w = ROEMISCH_WERT[ziffer[i]];
    const naechster = i + 1 < ziffer.length ? ROEMISCH_WERT[ziffer[i + 1]] : 0;
    summe += w < naechster ? -w : w;
  }
  return summe;
}

function bestimmeNotation(ziffer: string): Notation {
  if (/IV|IX|XL|XC/.test(ziffer)) return 'subtraktiv';
  if (/IIII|XXXX/.test(ziffer)) return 'additiv';
  return 'neutral';
}

/**
 * Liest ein Zeichen in Kurznotation.
 *
 * - `unlesbar` (auch `unreadable`, `?`) → Zustand `unlesbar`.
 * - Sonst: römische Ziffer, optional gefolgt von einem wiederholten
 *   Serienzeichen (`^`, `>`, `/`, `o`); die Wiederholung ist die Anzahl.
 *
 * @throws Error bei unbekannter Notation (leeres Zeichen, gemischte Serienzeichen,
 *   ungültige Ziffer). Ein Tippfehler wird nie still als Wert gelesen.
 */
export function parseZeichen(roh: string): ZeichenLesung {
  const eingabe = roh.trim();
  if (UNLESBAR_FORMEN.has(eingabe.toLowerCase())) {
    return { zustand: 'unlesbar', roh };
  }
  const m = /^([IVXLC]+)([\^>\/o]*)$/i.exec(eingabe);
  if (!m) {
    throw new Error(`Unbekannte Zeichennotation: "${roh}". Erlaubt: römische Ziffer + Serienzeichen (^ > / o) oder "unlesbar".`);
  }
  const ziffer = m[1].toUpperCase();
  const suffix = m[2].toLowerCase();
  if (!ROEMISCH.test(ziffer)) {
    throw new Error(`Ungültige römische Ziffer im Zeichen "${roh}".`);
  }
  let serie: Serie = { typ: 'keine', anzahl: 0 };
  if (suffix.length > 0) {
    const verschiedene = new Set(suffix.split(''));
    if (verschiedene.size > 1) {
      throw new Error(`Gemischte Serienzeichen im Zeichen "${roh}" — bitte je Zeichen nur einen Serientyp angeben.`);
    }
    serie = { typ: SERIEN_ZEICHEN[suffix[0]], anzahl: suffix.length };
  }
  const wert = roemischZuWert(ziffer);
  if (wert < 1) {
    throw new Error(`Zeichen "${roh}" ergibt keinen positiven Wert.`);
  }
  return { zustand: 'gelesen', roh, wert, notation: bestimmeNotation(ziffer), serie };
}

/** Schreibt eine Serie als kurzen Schlüssel, z. B. `ausstich×1`. */
export function serienSchluessel(s: Serie): string {
  return s.typ === 'keine' ? 'keine' : `${s.typ}×${s.anzahl}`;
}

function serieDe(s: Serie): string {
  const namen: Record<SerienTyp, string> = {
    keine: 'ohne Serienzeichen',
    ausstich: 'Ausstich',
    faehnchen: 'Fähnchen',
    beistrich: 'Beistrich',
    kreis: 'Kreis',
  };
  return s.typ === 'keine' ? namen.keine : `${s.anzahl}× ${namen[s.typ]}`;
}

function serieEn(s: Serie): string {
  const namen: Record<SerienTyp, string> = {
    keine: 'no series tag',
    ausstich: 'notch',
    faehnchen: 'flag',
    beistrich: 'side stroke',
    kreis: 'circle',
  };
  return s.typ === 'keine' ? namen.keine : `${s.anzahl}× ${namen[s.typ]}`;
}

/** Wert → römische Ziffer (subtraktiv), nur für Klartextbegründungen. */
export function wertZuRoemisch(wert: number): string {
  const tabelle: [number, string][] = [
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let rest = wert;
  let out = '';
  for (const [w, z] of tabelle) {
    while (rest >= w) {
      out += z;
      rest -= w;
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Prüfer
// ---------------------------------------------------------------------------

interface Eintrag {
  teil: Bauteil;
  lesung: ZeichenLesung;
  wand: string;
}

interface GelesenerEintrag extends Eintrag {
  lesung: GelesenesZeichen;
}

const VORBEHALT_DE =
  'Hinweise und Verdachte sind keine Bauforschungsbefunde. Sie zeigen nur, wo eine Zählfolge nicht aufgeht — die Deutung bleibt bei Hausforschenden.';
const VORBEHALT_EN =
  'Hints and suspicions are not building-archaeology findings. They only show where a sequence does not add up — interpretation stays with house historians.';

function wandSchluessel(t: Bauteil): string {
  if (typeof t.wand === 'string' && t.wand.trim() !== '') return t.wand.trim();
  if (typeof t.bund === 'number' && Number.isFinite(t.bund)) return `Bund ${t.bund}`;
  throw new Error(`Bauteil "${t.id}" hat weder Wand noch Bund.`);
}

function gruppiere<T>(liste: T[], schluessel: (x: T) => string): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const x of liste) {
    const k = schluessel(x);
    const g = m.get(k);
    if (g) g.push(x);
    else m.set(k, [x]);
  }
  return m;
}

function nachPosition<T extends Eintrag>(liste: T[]): T[] {
  return [...liste].sort((a, b) => a.teil.position - b.teil.position || a.teil.id.localeCompare(b.teil.id));
}

/** Mehrheitsserie einer Wand: strikte Mehrheit (> 50 %) der lesbaren Bauteile. */
function dominanteSerie(eintraege: GelesenerEintrag[]): Serie | null {
  if (eintraege.length === 0) return null;
  const zaehler = gruppiere(eintraege, (e) => serienSchluessel(e.lesung.serie));
  let beste: GelesenerEintrag[] | null = null;
  for (const g of zaehler.values()) {
    if (!beste || g.length > beste.length) beste = g;
  }
  if (beste && beste.length * 2 > eintraege.length) return beste[0].lesung.serie;
  return null;
}

/**
 * Längste (nicht-strikt) monotone Teilfolge; liefert die Indizes, die darin
 * liegen. Deterministisch: bei Gleichstand gewinnt die früheste Kette.
 */
function laengsteMonotoneTeilfolge(werte: number[], aufsteigend: boolean): Set<number> {
  const n = werte.length;
  const laenge = new Array<number>(n).fill(1);
  const vorg = new Array<number>(n).fill(-1);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      const passt = aufsteigend ? werte[j] <= werte[i] : werte[j] >= werte[i];
      if (passt && laenge[j] + 1 > laenge[i]) {
        laenge[i] = laenge[j] + 1;
        vorg[i] = j;
      }
    }
  }
  let ende = 0;
  for (let i = 1; i < n; i++) if (laenge[i] > laenge[ende]) ende = i;
  const set = new Set<number>();
  for (let k = ende; k >= 0 && n > 0; k = vorg[k]) {
    set.add(k);
    if (vorg[k] === -1) break;
  }
  return set;
}

function richtungVon(werte: number[]): Folge['richtung'] {
  let auf = 0;
  let ab = 0;
  for (let i = 1; i < werte.length; i++) {
    if (werte[i] > werte[i - 1]) auf++;
    else if (werte[i] < werte[i - 1]) ab++;
  }
  if (auf === 0 && ab === 0) return 'unbestimmt';
  return ab > auf ? 'absteigend' : 'aufsteigend';
}

function meldung(
  regel: RegelId,
  stufe: Stufe,
  wand: string,
  bauteile: string[],
  textDe: string,
  textEn: string
): Meldung {
  assertZulaessigeStufe(stufe);
  return { regel, stufe, wand, bauteile, textDe, textEn };
}

/**
 * Laufzeit-Wächter für Invariante 1: wirft, wenn eine Stufe außer
 * `hinweis`/`verdacht` auftaucht (etwa über `as any` oder aus fremdem JSON).
 */
export function assertZulaessigeStufe(stufe: unknown): asserts stufe is Stufe {
  if (!(STUFEN as readonly unknown[]).includes(stufe)) {
    throw new Error(
      `Unzulässige Stufe "${String(stufe)}": Der Kern vergibt nur "hinweis" oder "verdacht", nie einen bestätigten Befund.`
    );
  }
}

/**
 * Prüft die Zählfolgen einer Erfassung mit fünf deterministischen Regeln.
 *
 * - **R1-LUECKE** (`hinweis`): In einer Folge (Wand × Rolle, dominante Serie)
 *   fehlt ein Wert zwischen I und dem Höchstwert. Liegt an der passenden Stelle
 *   ein unlesbares Bauteil, wird keine Lücke gemeldet — es kann den Wert tragen.
 * - **R2-DOPPELUNG** (`verdacht`): gleicher Wert, gleiche Serie, gleiche Rolle
 *   in derselben Wand.
 * - **R3-FREMDE-SERIE** (`verdacht`): Serienzeichen weicht von der strikten
 *   Mehrheitsserie der Wand ab → Verdacht Zweitverwendung.
 * - **R4-NOTATIONSBRUCH** (`hinweis`): additive (`IIII`) und subtraktive (`IV`)
 *   Schreibweise in derselben Wand und Serie.
 * - **R5-RICHTUNGSBRUCH** (`verdacht`): Bauteile, die nicht in der längsten
 *   monotonen Teilfolge entlang der Positionen liegen.
 *
 * Unlesbare Zeichen erscheinen in `unlesbar` und lösen keine Regel aus.
 *
 * @throws Error bei doppelten IDs, fehlender Wand/Bund, ungültiger Position
 *   oder unbekannter Zeichennotation.
 */
export function pruefeZaehlfolge(bauteile: Bauteil[]): PruefErgebnis {
  const ids = new Set<string>();
  const eintraege: Eintrag[] = bauteile.map((teil) => {
    if (!teil || typeof teil.id !== 'string' || teil.id === '') {
      throw new Error('Bauteil ohne ID.');
    }
    if (ids.has(teil.id)) throw new Error(`Doppelte Bauteil-ID "${teil.id}".`);
    ids.add(teil.id);
    if (typeof teil.position !== 'number' || !Number.isFinite(teil.position)) {
      throw new Error(`Bauteil "${teil.id}" hat keine gültige Position.`);
    }
    return { teil, lesung: parseZeichen(teil.zeichen), wand: wandSchluessel(teil) };
  });

  const unlesbar = eintraege.filter((e) => e.lesung.zustand === 'unlesbar').map((e) => e.teil.id);
  const befunde: Meldung[] = [];
  const serien: WandSerie[] = [];

  const waende = gruppiere(eintraege, (e) => e.wand);
  const wandNamen = [...waende.keys()].sort((a, b) => a.localeCompare(b));

  for (const wand of wandNamen) {
    const alle = waende.get(wand)!;
    const gelesen = alle.filter((e): e is GelesenerEintrag => e.lesung.zustand === 'gelesen');
    const dominant = dominanteSerie(gelesen);
    const domKey = dominant ? serienSchluessel(dominant) : null;

    // --- R3: fremde Serie -------------------------------------------------
    if (dominant) {
      for (const e of nachPosition(gelesen)) {
        if (serienSchluessel(e.lesung.serie) !== domKey) {
          befunde.push(
            meldung(
              'R3-FREMDE-SERIE',
              'verdacht',
              wand,
              [e.teil.id],
              `Verdacht Zweitverwendung: Bauteil ${e.teil.id} (${e.lesung.roh}) trägt ${serieDe(e.lesung.serie)}, die Wand ${wand} sonst ${serieDe(dominant)}. Möglicherweise Holz aus einem anderen Verband.`,
              `Suspected reuse: member ${e.teil.id} (${e.lesung.roh}) carries ${serieEn(e.lesung.serie)}, while wall ${wand} otherwise carries ${serieEn(dominant)}. Possibly timber from another frame.`
            )
          );
        }
      }
    }

    // --- R4: Notationsbruch je Serie ----------------------------------------
    for (const [, gruppe] of [...gruppiere(gelesen, (e) => serienSchluessel(e.lesung.serie))].sort((a, b) =>
      a[0].localeCompare(b[0])
    )) {
      const add = nachPosition(gruppe.filter((e) => e.lesung.notation === 'additiv'));
      const sub = nachPosition(gruppe.filter((e) => e.lesung.notation === 'subtraktiv'));
      if (add.length > 0 && sub.length > 0) {
        const s = gruppe[0].lesung.serie;
        befunde.push(
          meldung(
            'R4-NOTATIONSBRUCH',
            'hinweis',
            wand,
            [...add, ...sub].map((e) => e.teil.id),
            `Hinweis: In Wand ${wand} (${serieDe(s)}) stehen additive Schreibweisen (${add.map((e) => e.lesung.roh).join(', ')}) neben subtraktiven (${sub.map((e) => e.lesung.roh).join(', ')}). Das kann auf einen anderen Zimmerer oder eine andere Bauphase deuten — kein Befund.`,
            `Hint: wall ${wand} (${serieEn(s)}) mixes additive forms (${add.map((e) => e.lesung.roh).join(', ')}) with subtractive ones (${sub.map((e) => e.lesung.roh).join(', ')}). This may point to another carpenter or building phase — not a finding.`
          )
        );
      }
    }

    // --- Folgen je Rolle ----------------------------------------------------
    const folgen: Folge[] = [];
    const rollen = gruppiere(alle, (e) => e.teil.rolle);
    for (const rolle of [...rollen.keys()].sort()) {
      const rollenAlle = nachPosition(rollen.get(rolle)!);
      const rollenGelesen = rollenAlle.filter((e): e is GelesenerEintrag => e.lesung.zustand === 'gelesen');

      // R2: Doppelung — gleicher Wert, gleiche Serie
      const doppel = gruppiere(rollenGelesen, (e) => `${serienSchluessel(e.lesung.serie)}|${e.lesung.wert}`);
      for (const [, gruppe] of [...doppel].sort((a, b) => a[0].localeCompare(b[0]))) {
        if (gruppe.length > 1) {
          const z = wertZuRoemisch(gruppe[0].lesung.wert);
          befunde.push(
            meldung(
              'R2-DOPPELUNG',
              'verdacht',
              wand,
              gruppe.map((e) => e.teil.id),
              `Verdacht: Der Wert ${z} (${serieDe(gruppe[0].lesung.serie)}) kommt bei ${rolle} in Wand ${wand} ${gruppe.length}-mal vor (${gruppe.map((e) => e.teil.id).join(', ')}). Verwechslung beim Eintragen oder Zweitverwendung.`,
              `Suspicion: value ${z} (${serieEn(gruppe[0].lesung.serie)}) occurs ${gruppe.length} times for ${rolle} in wall ${wand} (${gruppe.map((e) => e.teil.id).join(', ')}). Mix-up while recording or reused timber.`
            )
          );
        }
      }

      // Folge = dominante Serie (oder alle, wenn keine Mehrheit)
      const folgeGelesen = domKey
        ? rollenGelesen.filter((e) => serienSchluessel(e.lesung.serie) === domKey)
        : rollenGelesen;
      const werte = folgeGelesen.map((e) => e.lesung.wert);
      const richtung = richtungVon(werte);
      folgen.push({ rolle: rolle as Rolle, werte, richtung });

      // R5: Richtungsbruch
      if (folgeGelesen.length >= 3) {
        const aufsteigend = richtung !== 'absteigend';
        const imLauf = laengsteMonotoneTeilfolge(werte, aufsteigend);
        folgeGelesen.forEach((e, i) => {
          if (!imLauf.has(i)) {
            befunde.push(
              meldung(
                'R5-RICHTUNGSBRUCH',
                'verdacht',
                wand,
                [e.teil.id],
                `Verdacht: ${e.teil.id} (${e.lesung.roh}) an Position ${e.teil.position} passt nicht in die ${aufsteigend ? 'aufsteigende' : 'absteigende'} Zählfolge der ${rolle} in Wand ${wand}. Umsetzung des Bauteils oder falsche Positionsangabe.`,
                `Suspicion: ${e.teil.id} (${e.lesung.roh}) at position ${e.teil.position} does not fit the ${aufsteigend ? 'ascending' : 'descending'} sequence of ${rolle} in wall ${wand}. Member relocated or position entered wrongly.`
              )
            );
          }
        });
      }

      // R1: Lücke
      if (folgeGelesen.length > 0) {
        const vorhanden = new Set(werte);
        const max = Math.max(...werte);
        const unlesbareHier = rollenAlle.filter((e) => e.lesung.zustand === 'unlesbar');
        for (let v = 1; v < max; v++) {
          if (vorhanden.has(v)) continue;
          // Nachbarn: größter Wert < v und kleinster Wert > v
          const unten = folgeGelesen.filter((e) => e.lesung.wert < v).sort((a, b) => b.lesung.wert - a.lesung.wert)[0];
          const oben = folgeGelesen.filter((e) => e.lesung.wert > v).sort((a, b) => a.lesung.wert - b.lesung.wert)[0];
          // Unlesbare Bauteile an der passenden Stelle können die fehlenden Werte
          // tragen — gedeckt, wenn es mindestens so viele sind wie Werte fehlen.
          const fehlendHier = oben.lesung.wert - (unten ? unten.lesung.wert : 0) - 1;
          const kandidaten = unlesbareHier.filter((e) => {
            const p = e.teil.position;
            if (!unten) {
              // Lücke am Anfang: unlesbares Bauteil vor dem ersten lesbaren (in Laufrichtung)
              return richtung === 'absteigend' ? p > oben.teil.position : p < oben.teil.position;
            }
            const lo = Math.min(unten.teil.position, oben.teil.position);
            const hi = Math.max(unten.teil.position, oben.teil.position);
            return p > lo && p < hi;
          });
          if (kandidaten.length >= fehlendHier) continue;
          const z = wertZuRoemisch(v);
          befunde.push(
            meldung(
              'R1-LUECKE',
              'hinweis',
              wand,
              [unten?.teil.id, oben.teil.id].filter((x): x is string => typeof x === 'string'),
              `Hinweis: In der Zählfolge der ${rolle} in Wand ${wand} fehlt ${z}. Ein fehlendes Bauteil oder ein Umbau — oder das Bauteil ist noch verdeckt.`,
              `Hint: ${z} is missing from the sequence of ${rolle} in wall ${wand}. A missing member or an alteration — or the member is still covered.`
            )
          );
        }
      }
    }

    const typen = new Set(gelesen.map((e) => (e.lesung.serie.typ === 'keine' ? 'einfach' : 'serie')));
    const zeichensystem: WandSerie['zeichensystem'] =
      typen.size === 0
        ? 'unbestimmt'
        : typen.size === 2
          ? 'gemischt'
          : typen.has('einfach')
            ? 'roemisch-einfach'
            : 'roemisch-mit-serienzeichen';

    serien.push({ wand, dominanteSerie: dominant, zeichensystem, folgen });
  }

  // Invariante: jede Meldung hat eine zulässige Stufe und beide Texte.
  for (const b of befunde) {
    assertZulaessigeStufe(b.stufe);
    if (!b.textDe || !b.textEn) throw new Error(`Meldung ${b.regel} ohne Klartextbegründung.`);
  }

  return { serien, befunde, unlesbar, vorbehaltDe: VORBEHALT_DE, vorbehaltEn: VORBEHALT_EN };
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

/** Metadaten einer Erfassung. Ort nur auf Gemeindeebene. */
export interface FundMeta {
  gemeinde: string;
  landkreis?: string;
  land: string;
  /** Datum der Erfassung, ISO `YYYY-MM-DD`. */
  erfasstAm: string;
  gebaeudeart?: string;
  /** Freitext der Erfassenden; darf keine Adresse enthalten. */
  bemerkung?: string;
}

/** Version des Exportformats. */
export const EXPORT_VERSION = '0.1.0';

/** Felder, die eine genauere Ortsangabe als die Gemeinde verraten würden. */
const VERBOTENE_ORTSFELDER = [
  'strasse',
  'straße',
  'hausnummer',
  'adresse',
  'address',
  'lat',
  'lon',
  'lng',
  'latitude',
  'longitude',
  'koordinaten',
  'coordinates',
  'flurstueck',
  'flurstück',
  'plz',
];

const ERLAUBTE_METAFELDER = new Set(['gemeinde', 'landkreis', 'land', 'erfasstAm', 'gebaeudeart', 'bemerkung']);

/** Ein Bauteil im Export (Erfassungsfelder: Markierungsart, Werkzeug, Lage, Serie). */
export interface ExportBauteil {
  id: string;
  zeichen: string;
  markierungsart: Markierungsart;
  werkzeug: Werkzeug;
  lage: { wand: string; position: number; rolle: Rolle; seite: string | null };
  serie: Serie | null;
  lesung: { zustand: 'gelesen'; wert: number; notation: Notation } | { zustand: 'unlesbar' };
}

/** Das JSON-Exportformat (Schema: `07-demos/abbundzeichen-fundbuch/schemas/fund-export.schema.json`). */
export interface FundExport {
  format: 'abbundzeichen-fundbuch';
  version: string;
  ortsgenauigkeit: 'gemeinde';
  ort: { gemeinde: string; landkreis: string | null; land: string };
  erfasstAm: string;
  gebaeudeart: string | null;
  bemerkung: string | null;
  bauteile: ExportBauteil[];
  befunde: Meldung[];
  unlesbar: string[];
  vorbehaltDe: string;
  vorbehaltEn: string;
}

/**
 * Baut den JSON-Export einer Erfassung (prüft dabei selbst die Zählfolge).
 *
 * @throws Error, wenn `meta` ein Feld enthält, das genauer als die Gemeinde
 *   verortet (Straße, Koordinaten, PLZ …), ein unbekanntes Feld trägt, oder
 *   Pflichtfelder fehlen.
 */
export function exportiereFund(bauteile: Bauteil[], meta: FundMeta): FundExport {
  for (const k of Object.keys(meta)) {
    if (VERBOTENE_ORTSFELDER.includes(k.toLowerCase())) {
      throw new Error(`Ortsfeld "${k}" ist genauer als die Gemeinde und wird nicht exportiert.`);
    }
    if (!ERLAUBTE_METAFELDER.has(k)) {
      throw new Error(`Unbekanntes Metadatenfeld "${k}".`);
    }
  }
  if (!meta.gemeinde || !meta.land) throw new Error('Gemeinde und Land sind Pflichtfelder.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.erfasstAm)) throw new Error('erfasstAm muss ein ISO-Datum (YYYY-MM-DD) sein.');

  const ergebnis = pruefeZaehlfolge(bauteile);
  const exportTeile: ExportBauteil[] = bauteile.map((t) => {
    const l = parseZeichen(t.zeichen);
    return {
      id: t.id,
      zeichen: t.zeichen,
      markierungsart: t.markierungsart ?? 'unbekannt',
      werkzeug: t.werkzeug ?? 'unbekannt',
      lage: { wand: wandSchluessel(t), position: t.position, rolle: t.rolle, seite: t.seite ?? null },
      serie: l.zustand === 'gelesen' ? l.serie : null,
      lesung: l.zustand === 'gelesen' ? { zustand: 'gelesen', wert: l.wert, notation: l.notation } : { zustand: 'unlesbar' },
    };
  });

  return {
    format: 'abbundzeichen-fundbuch',
    version: EXPORT_VERSION,
    ortsgenauigkeit: 'gemeinde',
    ort: { gemeinde: meta.gemeinde, landkreis: meta.landkreis ?? null, land: meta.land },
    erfasstAm: meta.erfasstAm,
    gebaeudeart: meta.gebaeudeart ?? null,
    bemerkung: meta.bemerkung ?? null,
    bauteile: exportTeile,
    befunde: ergebnis.befunde,
    unlesbar: ergebnis.unlesbar,
    vorbehaltDe: ergebnis.vorbehaltDe,
    vorbehaltEn: ergebnis.vorbehaltEn,
  };
}
