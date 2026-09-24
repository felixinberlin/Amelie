import { DiscardedItem, Todesursache, Killerart, Fundweg, Herkunft, Stadium, Language } from '../types';

/**
 * Der Friedhof zählt. Eine einzelne tote Idee ist eine Anekdote; dreißig mit
 * Totenschein sind ein Muster — welche Suche tötet, woher die Toten kommen,
 * wie weit sie es geschafft haben. Dieselbe Rechnung speist die App
 * (DiscardedGallery) und 08-friedhof/README.md (scripts/friedhof-muster.mjs).
 */

type Label = Record<Language, string>;

export const URSACHE: Record<Todesursache, Label & { stoneDe: string; stoneEn: string }> = {
  gebaut: { de: 'Schon gebaut', en: 'Already built', es: 'Ya construida', stoneDe: 'Es gab sie schon', stoneEn: 'It already existed' },
  'beim-empfaenger': { de: 'Beim Empfänger selbst', en: 'Recipient built it', es: 'La tiene el destinatario', stoneDe: 'Der Empfänger hatte sie', stoneEn: 'The recipient had it' },
  duplikat: { de: 'Duplikat', en: 'Duplicate', es: 'Duplicado', stoneDe: 'Stand schon bei uns', stoneEn: 'We already had it' },
  mode: { de: 'Keine neue Fähigkeit', en: 'No new capability', es: 'Sin capacidad nueva', stoneDe: 'Nur ein Standardmuster', stoneEn: 'Just a standard pattern' },
  'reality-check': { de: 'Reality-Check', en: 'Reality check', es: 'Choque con la realidad', stoneDe: 'Daten, Recht oder Physik', stoneEn: 'Data, law or physics' },
  praemisse: { de: 'Falsche Prämisse', en: 'False premise', es: 'Premisa falsa', stoneDe: 'Das Problem gab es nicht', stoneEn: 'The problem was not real' },
};

export const KILLER: Record<Killerart, Label> = {
  kommerziell: { de: 'Firma', en: 'Company', es: 'Empresa' },
  gemeinnuetzig: { de: 'Gemeinnützige', en: 'Non-profit', es: 'Sin ánimo de lucro' },
  behoerde: { de: 'Behörde', en: 'Public body', es: 'Administración' },
  forschung: { de: 'Forschung', en: 'Research', es: 'Investigación' },
  community: { de: 'Community / Indie', en: 'Community / indie', es: 'Comunidad / indie' },
  'eigener-bestand': { de: 'Eigener Bestand', en: 'Own records', es: 'Registro propio' },
  keiner: { de: 'Niemand', en: 'Nobody', es: 'Nadie' },
};

export const FUNDWEG: Record<Fundweg, Label> = {
  englisch: { de: 'Englische Suche', en: 'English search', es: 'Búsqueda en inglés' },
  deutsch: { de: 'Deutsche Suche', en: 'German search', es: 'Búsqueda en alemán' },
  forum: { de: 'Forum / Nische', en: 'Forum / niche', es: 'Foro / nicho' },
  empfaenger: { de: 'Empfänger-Suche', en: 'Recipient search', es: 'Búsqueda del destinatario' },
  'eigener-bestand': { de: 'Eigener Atlas / Protokoll', en: 'Own atlas / log', es: 'Atlas / registro propio' },
  'ohne-suche': { de: 'Ohne Suche', en: 'No search needed', es: 'Sin búsqueda' },
  unbekannt: { de: 'Nicht dokumentiert', en: 'Not documented', es: 'Sin documentar' },
};

export const HERKUNFT: Record<Herkunft, Label> = {
  ideenliste: { de: 'Ideenliste', en: 'Idea list', es: 'Lista de ideas' },
  brainstorm: { de: 'Brainstorm', en: 'Brainstorm', es: 'Lluvia de ideas' },
  quelle: { de: 'Primärquelle', en: 'Primary source', es: 'Fuente primaria' },
  bisoziation: { de: 'Bisoziation', en: 'Bisociation', es: 'Bisociación' },
  'modell-katalog': { de: 'Modell-Katalog', en: 'Model catalogue', es: 'Catálogo de modelo' },
};

export const STADIUM: Record<Stadium, Label> = {
  kandidat: { de: 'Kandidat', en: 'Candidate', es: 'Candidata' },
  dose: { de: 'Dose gepackt', en: 'Tin packed', es: 'Lata empaquetada' },
  'mail-entwurf': { de: 'Mail entworfen', en: 'Mail drafted', es: 'Correo redactado' },
  zugestellt: { de: 'Zugestellt', en: 'Delivered', es: 'Entregada' },
};

export interface Zaehlung<K extends string> {
  key: K;
  count: number;
}

export function countBy<K extends string>(items: DiscardedItem[], pick: (d: DiscardedItem) => K): Zaehlung<K>[] {
  const m = new Map<K, number>();
  for (const d of items) m.set(pick(d), (m.get(pick(d)) ?? 0) + 1);
  return [...m.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

export interface FriedhofMuster {
  total: number;
  ursache: Zaehlung<Todesursache>[];
  killer: Zaehlung<Killerart>[];
  fundweg: Zaehlung<Fundweg>[];
  herkunft: Zaehlung<Herkunft>[];
  stadium: Zaehlung<Stadium>[];
  /** Tote, die schon Dose oder Mail waren — die teuren Tode */
  spaete: number;
  /** Anteil der dokumentierten Fundwege, die ohne eigene Suche auskamen (Atlas/Protokoll/Reality-Check) */
  ohneNeueSuche: number;
  dokumentierteFundwege: number;
}

export function friedhofMuster(items: DiscardedItem[]): FriedhofMuster {
  const dokumentiert = items.filter((d) => d.foundBy !== 'unbekannt');
  return {
    total: items.length,
    ursache: countBy(items, (d) => d.cause),
    killer: countBy(items, (d) => d.killer),
    fundweg: countBy(items, (d) => d.foundBy),
    herkunft: countBy(items, (d) => d.origin),
    stadium: countBy(items, (d) => d.stage),
    spaete: items.filter((d) => d.stage !== 'kandidat').length,
    ohneNeueSuche: dokumentiert.filter((d) => d.foundBy === 'eigener-bestand' || d.foundBy === 'ohne-suche').length,
    dokumentierteFundwege: dokumentiert.length,
  };
}

/** Neueste Gräber zuerst; Monatsangaben („2026-09") gelten als Monatsanfang. */
export function nachTodesdatum(items: DiscardedItem[]): DiscardedItem[] {
  const key = (d: DiscardedItem) => (d.diedOn.length === 7 ? `${d.diedOn}-00` : d.diedOn);
  return [...items].sort((a, b) => key(b).localeCompare(key(a)) || a.title.localeCompare(b.title));
}

/** „2026-09-21" → „21.09.2026", „2026-09" → „09/2026" */
export function formatTodesdatum(iso: string, lang: Language): string {
  const [y, m, d] = iso.split('-');
  if (!d) return lang === 'en' ? `${m}/${y}` : `${m}/${y}`;
  return lang === 'en' ? `${y}-${m}-${d}` : `${d}.${m}.${y}`;
}
