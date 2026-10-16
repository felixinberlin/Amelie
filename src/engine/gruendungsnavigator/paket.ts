// Gründungsnavigator — Branchenpakete. Lizenz: CC0 1.0 Public Domain.
//
// Die Seiten bestehen aus allgemeinen Daten (Telefonbaum, Fragen, Rechte-Karten,
// Fall-Landkarte) und einem Branchenpaket. Allgemeine Texte enthalten
// Platzhalter in doppelten Klammern, z. B. {{beruf}} oder {{zuschuss}}; ein Paket
// liefert die Werte und kann einzelne Texte überschreiben. Einfache Klammern
// ({name}, {datum} …) sind Eingaben der Nutzerin und bleiben unberührt.
//
// Dieser Code läuft zweimal: in den Tests und, von scripts/build-gruendungsnavigator.mjs
// mit esbuild gebündelt, im Browser. Darum keine Node- oder DOM-Abhängigkeiten.

import { VERSPRECHENSWOERTER } from './gruendungsnavigator';

// Für die Seite mitgebündelt (Deckblatt der Unterlagen-Mappe)
export { seitenIndex, DECKBLATT_HINWEIS_DE } from './gruendungsnavigator';

// ---------------------------------------------------------------- Typen

export interface ZuschussPosten {
  /** Wie es im Satz steht, z. B. „einen leistungsstarken Laptop“ */
  was: string;
  /** Kurzwort für Listen, z. B. „Laptop“ */
  kurz: string;
  betrag: number | null;
}

/** Werte eines Pakets. Leere Pakete setzen Texte auf "" und Zahlen auf null. */
export interface PaketWerte {
  beruf: string;
  erfahrung: string;
  erfahrungKurz: string;
  vorhabenKurz: string;
  vorhabenText: string;
  kernbotschaft: string;
  stelle: string;
  zuschussZweck: string;
  zuschussPosten: ZuschussPosten[];
  kostenMonat: number | null;
  umsatz: [number | null, number | null, number | null];
  gewinn: [number | null, number | null, number | null];
  schwelleMonat: number | null;
  fruehwarn: number | null;
  kapitalbedarf: number | null;
  ausstieg: string;
  arbeitszeit: string;
  arbeitszeitAufteilung: string;
  rechtsform: string;
  anmeldung: string;
  steuer: string;
  angebotKurz: string;
  vorbereitet: string;
  vorbereitungBeispiel: string;
  belege: string;
  belegEinzeln: string;
  agendaZeigen: string;
  wiederkehrend: string;
  anpassung: string;
  vorsichtigeAnnahme: string;
  einfachErklaert: string;
  abgrenzung: string;
}

export type Ueberschreibung = Record<string, unknown>;

export interface Zusatzfrage {
  id: string;
  /** Wird hinter dieser Frage einsortiert; fehlt sie, ans Ende */
  nach?: string;
  c: string;
  q: string;
  a: string;
  show: string;
  laws: string[];
}

export interface Paket {
  id: string;
  titel: string;
  beschreibung: string;
  /** Muss bei ausgelieferten Paketen true sein: Person und Zahlen sind ausgedacht */
  erfunden: boolean;
  werte: PaketWerte;
  /** Pfad → Felder, z. B. "fragen/angebot": {a: "…"}, "telefon/s3/d": {say: "…"} */
  ueberschreiben?: Record<string, Ueberschreibung>;
  fragen?: Zusatzfrage[];
  /** Branchentypische Punkte, die man selbst klären muss (keine Rechtsauskunft) */
  pruefpunkte?: string[];
  /** Ersetzt die allgemeine Mitbring-Liste, wenn gesetzt */
  mitbringen?: string[];
}

// ---------------------------------------------------------------- Formatieren

export const euro = (n: number | null | undefined): string =>
  typeof n === 'number' && Number.isFinite(n)
    ? n.toLocaleString('de-DE', { maximumFractionDigits: 0 }).replace(/ /g, '.') + ' €'
    : '[Betrag]';

/** Beschriftungen für leere Werte: so erkennt man im leeren Paket, was einzutragen ist. */
export const WERT_LABEL: Record<string, string> = {
  beruf: 'Beruf',
  erfahrung: 'seit wann',
  erfahrungKurz: 'Erfahrung in Kurzform',
  vorhabenKurz: 'Vorhaben in fünf Wörtern',
  vorhabenText: 'Vorhaben in zwei Sätzen',
  kernbotschaft: 'Kernbotschaft in drei Sätzen',
  stelle: 'fachkundige Stelle',
  zuschussZweck: 'Zweck des Zuschusses',
  ausstieg: 'Monat von bis',
  arbeitszeit: 'Arbeitszeit',
  arbeitszeitAufteilung: 'Aufteilung der Arbeitszeit',
  rechtsform: 'Rechtsform',
  anmeldung: 'Anmeldung',
  steuer: 'Umsatzsteuer',
  angebotKurz: 'Angebot und Preise',
  vorbereitet: 'was vorbereitet ist',
  vorbereitungBeispiel: 'Beispiel für Vorbereitung',
  belege: 'Belege',
  belegEinzeln: 'ein Beleg',
  agendaZeigen: 'was Sie zeigen',
  wiederkehrend: 'wiederkehrende Einnahmen',
  anpassung: 'Plan B',
  vorsichtigeAnnahme: 'vorsichtige Annahme',
  einfachErklaert: 'Ihr Angebot in einem Satz',
  abgrenzung: 'Unterschied zu anderen',
};

const leer = (k: string) => '[' + (WERT_LABEL[k] ?? k) + ']';

function aufzaehlen(teile: string[]): string {
  if (teile.length <= 1) return teile.join('');
  return teile.slice(0, -1).join(', ') + ' und ' + teile[teile.length - 1];
}

/** Abgeleitete und formatierte Platzhalter eines Pakets. */
export function platzhalter(w: PaketWerte): Record<string, string> {
  const t: Record<string, string> = {};
  for (const [k, v] of Object.entries(w)) if (typeof v === 'string') t[k] = v.trim() ? v : leer(k);
  const posten = w.zuschussPosten ?? [];
  const summe = posten.length && posten.every((p) => typeof p.betrag === 'number') ? posten.reduce((s, p) => s + (p.betrag as number), 0) : null;
  t.zuschuss = euro(summe);
  t.zuschussPosten = posten.length ? aufzaehlen(posten.map((p) => `${p.was || '[Posten]'} (${euro(p.betrag)})`)) : '[Posten mit Betrag]';
  t.zuschussKurz = posten.length ? posten.map((p) => p.kurz || '[Posten]').join(', ') : '[Posten]';
  t.kostenMonat = euro(w.kostenMonat);
  t.umsatzJ1 = euro(w.umsatz?.[0]);
  t.umsatzReihe = (w.umsatz ?? []).map(euro).join(' / ');
  t.gewinnReihe = (w.gewinn ?? []).map(euro).join(' / ');
  t.gewinnMonatJ2 = typeof w.gewinn?.[1] === 'number' ? euro(Math.round((w.gewinn[1] as number) / 12 / 50) * 50) : '[Betrag]';
  const u1 = w.umsatz?.[0], g1 = w.gewinn?.[0];
  t.gewinnHalberUmsatz = typeof u1 === 'number' && typeof g1 === 'number' ? euro(Math.round(u1 / 2 - (u1 - g1))) : '[Betrag]';
  t.schwelleMonat = euro(w.schwelleMonat);
  t.fruehwarn = euro(w.fruehwarn);
  t.kapitalbedarf = euro(w.kapitalbedarf);
  return t;
}

/** Ersetzt {{schluessel}} und {{^schluessel}} (erster Buchstabe groß). Unbekannte bleiben stehen. */
export function fuelle(text: string, werte: Record<string, string>): string {
  return text.replace(/\{\{(\^?)(\w+)\}\}/g, (ganz, gross: string, k: string) => {
    if (!(k in werte)) return ganz;
    const v = werte[k];
    return gross ? v.charAt(0).toUpperCase() + v.slice(1) : v;
  });
}

/** Wendet `fuelle` auf alle Zeichenketten einer Struktur an. */
export function fuelleTief<T>(x: T, werte: Record<string, string>): T {
  if (typeof x === 'string') return fuelle(x, werte) as unknown as T;
  if (Array.isArray(x)) return x.map((y) => fuelleTief(y, werte)) as unknown as T;
  if (x && typeof x === 'object') {
    const o: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(x)) o[k] = fuelleTief(v, werte);
    return o as T;
  }
  return x;
}

/** Findet alle {{…}}, die nach dem Füllen übrig sind. */
export function offenePlatzhalter(x: unknown, pfad = ''): string[] {
  if (typeof x === 'string') return [...x.matchAll(/\{\{\^?\w+\}\}/g)].map((m) => `${pfad}: ${m[0]}`);
  if (Array.isArray(x)) return x.flatMap((y, i) => offenePlatzhalter(y, `${pfad}[${i}]`));
  if (x && typeof x === 'object') return Object.entries(x).flatMap(([k, v]) => offenePlatzhalter(v, pfad ? `${pfad}.${k}` : k));
  return [];
}

// ---------------------------------------------------------------- Daten der Seiten

export interface Antwort { k: string; t: string; s?: string; say: string; dos?: string[]; ex?: string; laws: string[]; next?: number; end?: boolean; [x: string]: unknown }
export interface Schritt { id: string; short: string; q: string; answers: Antwort[] }
export interface Frage { id: string; c: string; q: string; a: string; show: string; laws: string[] }
export interface Recht { id: string; g?: string; q: string; t: string; say: string; laws: string[]; next: string[]; tac: string[]; pl: string[] }
export interface Station { id: string; nr: number; t: string; s: string; qs: { q: string; a: Record<string, unknown>[] }[] }

export interface NavigatorDaten {
  telefonbaum: Schritt[];
  kategorien: string[];
  fragen: Frage[];
  rechte: Recht[];
  rechteGruppen: [string, string][];
  mitbringen: string[];
  eigeneFragen: string[];
  danach: string[];
  ablauf: [string, string, string][];
  kennzahlen: [string, string][];
  texte: Record<string, string>;
}

export interface LandkartenDaten {
  stationen: Station[];
  fristen: Record<string, unknown>[];
  texte: Record<string, string>;
}

function klon<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

/**
 * Wendet die Überschreibungen eines Pakets an. Pfade:
 *   telefon/<schrittId>/<antwortKey>   fragen/<frageId>   rechte/<rechtId>
 *   landkarte/<stationId>              landkarte/<stationId>/<frageIndex>
 *   landkarte/<stationId>/<frageIndex>/<antwortIndex>
 * Ein Pfad, der nichts trifft, ist ein Fehler (siehe pruefePaket).
 */
export function wendeUeberschreibungenAn(nav: NavigatorDaten | null, karte: LandkartenDaten | null, paket: Paket): string[] {
  const nichtGefunden: string[] = [];
  for (const [pfad, felder] of Object.entries(paket.ueberschreiben ?? {})) {
    const [art, a, b, c] = pfad.split('/');
    let ziel: Record<string, unknown> | undefined;
    if (art === 'telefon') {
      if (!nav) continue;
      ziel = nav.telefonbaum.find((s) => s.id === a)?.answers.find((x) => x.k === b) as Record<string, unknown> | undefined;
    } else if (art === 'fragen') {
      if (!nav) continue;
      ziel = nav.fragen.find((f) => f.id === a) as unknown as Record<string, unknown> | undefined;
    } else if (art === 'rechte') {
      if (!nav) continue;
      ziel = nav.rechte.find((r) => r.id === a) as unknown as Record<string, unknown> | undefined;
    } else if (art === 'landkarte') {
      if (!karte) continue;
      const st = karte.stationen.find((s) => s.id === a);
      ziel = b === undefined ? (st as unknown as Record<string, unknown>) : c === undefined ? (st?.qs[+b] as unknown as Record<string, unknown>) : st?.qs[+b]?.a[+c];
    }
    if (!ziel) { nichtGefunden.push(pfad); continue; }
    Object.assign(ziel, klon(felder));
  }
  return nichtGefunden;
}

/** Allgemeine Navigator-Daten + Paket → fertige Texte für die Seite. */
export function materialisiereNavigator(basis: NavigatorDaten, paket: Paket): NavigatorDaten {
  const nav = klon(basis);
  wendeUeberschreibungenAn(nav, null, paket);
  for (const z of paket.fragen ?? []) {
    const { nach, ...frage } = z;
    const i = nach ? nav.fragen.findIndex((f) => f.id === nach) : -1;
    if (i >= 0) nav.fragen.splice(i + 1, 0, klon(frage));
    else nav.fragen.push(klon(frage));
  }
  if (paket.mitbringen?.length) nav.mitbringen = klon(paket.mitbringen);
  nav.texte = { ...nav.texte, paketId: paket.id, paketTitel: paket.titel, paketBeschreibung: paket.beschreibung };
  return fuelleTief(nav, { ...platzhalter(paket.werte), paketTitel: paket.titel, paketBeschreibung: paket.beschreibung });
}

/** Allgemeine Landkarten-Daten + Paket → fertige Texte. */
export function materialisiereLandkarte(basis: LandkartenDaten, paket: Paket): LandkartenDaten {
  const karte = klon(basis);
  wendeUeberschreibungenAn(null, karte, paket);
  karte.texte = { ...karte.texte, paketId: paket.id, paketTitel: paket.titel };
  return fuelleTief(karte, { ...platzhalter(paket.werte), paketTitel: paket.titel, paketBeschreibung: paket.beschreibung });
}

// ---------------------------------------------------------------- Prüfen

/** Höchstbetrag für Zuschüsse nach § 16c Abs. 1 Satz 2 SGB II (Wortlaut im Normregister, sgb2_16c1). */
export const ZUSCHUSS_HOECHSTBETRAG = 5000;


/**
 * Inhaltliche Prüfung eines Pakets über das Schema hinaus. Liefert Probleme
 * als Klartext; leer heißt in Ordnung. `strikt` (für ausgelieferte Pakete):
 * alle Werte gefüllt und als erfunden gekennzeichnet. Ohne `karte` (auf der
 * Navigator-Seite) werden Pfade unter landkarte/ nicht geprüft.
 */
export function pruefePaket(
  paket: Paket,
  kontext: { nav: NavigatorDaten; karte: LandkartenDaten | null; normIds: Iterable<string> },
  strikt = false,
): string[] {
  const p: string[] = [];
  const w = paket.werte;
  const normen = new Set(kontext.normIds);

  if (!/^[a-z0-9-]+$/.test(paket.id)) p.push(`id "${paket.id}": nur a-z, 0-9 und -`);
  if (strikt && !paket.erfunden) p.push('ausgelieferte Pakete müssen erfunden sein (erfunden: true)');

  // Zahlen in sich stimmig
  const summe = w.zuschussPosten.every((x) => typeof x.betrag === 'number') ? w.zuschussPosten.reduce((s, x) => s + (x.betrag as number), 0) : null;
  if (summe !== null && summe > ZUSCHUSS_HOECHSTBETRAG) p.push(`Zuschuss ${euro(summe)} über dem Höchstbetrag von ${euro(ZUSCHUSS_HOECHSTBETRAG)} (§ 16c Abs. 1 SGB II)`);
  for (let i = 0; i < 3; i++) {
    const u = w.umsatz[i], g = w.gewinn[i];
    if (typeof u === 'number' && typeof g === 'number' && g > u) p.push(`Jahr ${i + 1}: Gewinn ${euro(g)} größer als Umsatz ${euro(u)}`);
  }
  const u1 = w.umsatz[0], g1 = w.gewinn[0];
  if (typeof u1 === 'number' && typeof g1 === 'number' && typeof w.kostenMonat === 'number' && u1 - g1 < w.kostenMonat * 12) {
    p.push(`Jahr 1: Kosten laut Umsatz minus Gewinn (${euro(u1 - g1)}) kleiner als zwölf Monate laufende Kosten (${euro(w.kostenMonat * 12)})`);
  }
  if (typeof w.schwelleMonat === 'number' && typeof w.gewinn[1] === 'number' && w.gewinn[1] / 12 < w.schwelleMonat) {
    p.push(`Jahr 2: Monatsgewinn ${euro(Math.round(w.gewinn[1] / 12))} unter der eigenen Schwelle ${euro(w.schwelleMonat)}, Ausstieg dann nicht plausibel`);
  }
  if (w.ausstieg.trim() && !/^\d+ bis \d+$/.test(w.ausstieg.trim())) p.push(`ausstieg "${w.ausstieg}": Form „14 bis 16“`);

  // Überschreibungen, Zusatzfragen, Normen
  const nav = klon(kontext.nav), karte = kontext.karte ? klon(kontext.karte) : null;
  for (const pfad of wendeUeberschreibungenAn(nav, karte, paket)) p.push(`Überschreibung trifft nichts: ${pfad}`);
  const ids = new Set(kontext.nav.fragen.map((f) => f.id));
  for (const f of paket.fragen ?? []) {
    if (ids.has(f.id)) p.push(`Zusatzfrage "${f.id}": id gibt es schon`);
    ids.add(f.id);
    if (f.nach && !kontext.nav.fragen.some((x) => x.id === f.nach) && !(paket.fragen ?? []).some((x) => x.id === f.nach)) p.push(`Zusatzfrage "${f.id}": nach "${f.nach}" unbekannt`);
    if (!kontext.nav.kategorien.includes(f.c)) p.push(`Zusatzfrage "${f.id}": Kategorie "${f.c}" unbekannt`);
    for (const l of f.laws) if (!normen.has(l)) p.push(`Zusatzfrage "${f.id}": Norm "${l}" nicht im Register`);
  }
  for (const [pfad, felder] of Object.entries(paket.ueberschreiben ?? {})) {
    const laws = (felder as { laws?: string[] }).laws;
    for (const l of laws ?? []) if (!normen.has(l)) p.push(`${pfad}: Norm "${l}" nicht im Register`);
  }

  // Ergebnis: keine offenen Platzhalter, keine Versprechen
  const fertig: unknown[] = [materialisiereNavigator(kontext.nav, paket)];
  if (kontext.karte) fertig.push(materialisiereLandkarte(kontext.karte, paket));
  for (const o of offenePlatzhalter(fertig)) p.push(`offener Platzhalter ${o}`);
  const text = JSON.stringify(fertig).toLowerCase();
  for (const v of VERSPRECHENSWOERTER) if (text.includes(v.toLowerCase())) p.push(`Versprechenswort im Paket: „${v}“`);

  if (strikt) {
    for (const [k, v] of Object.entries(w)) {
      if (typeof v === 'string' && !v.trim()) p.push(`Wert "${k}" leer`);
      if (v === null) p.push(`Wert "${k}" leer`);
    }
    if (w.umsatz.some((x) => x === null) || w.gewinn.some((x) => x === null)) p.push('Umsatz oder Gewinn unvollständig');
    if (!w.zuschussPosten.length || w.zuschussPosten.some((x) => x.betrag === null)) p.push('Zuschussposten unvollständig');
  }
  return p;
}

const ZAHL_WERTE = ['kostenMonat', 'schwelleMonat', 'fruehwarn', 'kapitalbedarf'];
const istText = (x: unknown): x is string => typeof x === 'string';
const istZahlOderLeer = (x: unknown) => x === null || (typeof x === 'number' && Number.isFinite(x));

/**
 * Formprüfung für Pakete, die jemand hochlädt (der Browser hat kein ajv).
 * Deckt dieselben Pflichtfelder und Typen ab wie paket.schema.json; die
 * Tests halten beide gegeneinander. Leer heißt: Das Paket lässt sich laden.
 */
export function pruefeStruktur(x: unknown): string[] {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return ['Die Datei enthält kein Paket (JSON-Objekt erwartet).'];
  const o = x as Record<string, unknown>;
  const p: string[] = [];
  if (!istText(o.id) || !/^[a-z0-9-]+$/.test(o.id)) p.push('id fehlt oder ist ungültig (nur a-z, 0-9 und -)');
  if (!istText(o.titel) || !o.titel.trim()) p.push('titel fehlt');
  if (!istText(o.beschreibung)) p.push('beschreibung fehlt');
  if (typeof o.erfunden !== 'boolean') p.push('erfunden fehlt (true oder false)');
  const w = o.werte;
  if (!w || typeof w !== 'object' || Array.isArray(w)) return [...p, 'werte fehlen'];
  const wo = w as Record<string, unknown>;
  for (const k of Object.keys(WERT_LABEL)) if (!istText(wo[k])) p.push(`werte.${k}: Text fehlt`);
  for (const k of ZAHL_WERTE) if (!istZahlOderLeer(wo[k])) p.push(`werte.${k}: Zahl oder null`);
  for (const k of ['umsatz', 'gewinn']) {
    const a = wo[k];
    if (!Array.isArray(a) || a.length !== 3 || !a.every(istZahlOderLeer)) p.push(`werte.${k}: drei Zahlen (Jahr 1 bis 3) oder null`);
  }
  const zp = wo.zuschussPosten;
  if (!Array.isArray(zp) || !zp.every((z) => z && typeof z === 'object' && istText(z.was) && istText(z.kurz) && istZahlOderLeer(z.betrag))) {
    p.push('werte.zuschussPosten: Liste aus {was, kurz, betrag}');
  }
  if (o.ueberschreiben !== undefined && (!o.ueberschreiben || typeof o.ueberschreiben !== 'object' || Array.isArray(o.ueberschreiben))) p.push('ueberschreiben: Objekt erwartet');
  if (o.fragen !== undefined) {
    if (!Array.isArray(o.fragen)) p.push('fragen: Liste erwartet');
    else o.fragen.forEach((f, i) => {
      const ok = f && typeof f === 'object' && ['id', 'c', 'q', 'a', 'show'].every((k) => istText((f as Record<string, unknown>)[k])) && Array.isArray((f as Zusatzfrage).laws) && (f as Zusatzfrage).laws.every(istText);
      if (!ok) p.push(`fragen[${i}]: braucht id, c, q, a, show und laws`);
    });
  }
  for (const k of ['pruefpunkte', 'mitbringen']) {
    const a = o[k];
    if (a !== undefined && (!Array.isArray(a) || !a.every(istText))) p.push(`${k}: Liste aus Texten erwartet`);
  }
  return p;
}
