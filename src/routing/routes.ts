import { ALL_NAV_TABS } from '../data/navigation';
import { DOSE_SIMULATOR_MAP, type SimulatorKey } from '../data/doseSimulators';

export type PageRoute =
  | { kind: 'tab'; tab: string }
  | { kind: 'dose'; tab: 'dosen'; doseId: string; chapter?: string }
  | { kind: 'simulator'; tab: 'sandboxes'; simulator: SimulatorKey }
  | { kind: 'venture'; tab: 'ventures'; ventureId: string }
  | { kind: 'not-found'; tab: 'not-found' };

export const tabPath = (tab: string): string => `/${tab === 'sandboxes' ? 'simulators' : tab}/`;
export const dosePath = (id: string): string => `/dosen/${encodeURIComponent(id)}/`;
export const chapterPath = (id: string, slug: string): string => `${dosePath(id)}book/${encodeURIComponent(slug)}/`;
export const simulatorPath = (key: string): string => `/simulators/${encodeURIComponent(key)}/`;
export const venturePath = (id: string): string => `/ventures/${encodeURIComponent(id)}/`;
export const SIMULATOR_KEYS = [...new Set(Object.values(DOSE_SIMULATOR_MAP).map(s => s.key))];

export function resolveSimulator(raw: string): SimulatorKey | null {
  return DOSE_SIMULATOR_MAP[raw]?.key ?? (SIMULATOR_KEYS.includes(raw as SimulatorKey) ? raw as SimulatorKey : null);
}

/** Pure parser shared by the router and tests. Paths are relative to the app base. */
export function parsePageRoute(pathname: string, search = ''): PageRoute {
  try {
    const parts = pathname.split('/').filter(Boolean).map(decodeURIComponent);
    if (parts.some(p => p.includes('/') || p === '.' || p === '..')) return { kind: 'not-found', tab: 'not-found' };
    const [first, id, book, slug] = parts;
    if (!first) return { kind: 'tab', tab: 'dosen' };
    if (first === 'dosen') {
      const localId = new URLSearchParams(search).get('dose');
      if (parts.length === 1 && localId) return { kind: 'dose', tab: 'dosen', doseId: localId };
      if (parts.length === 2) return { kind: 'dose', tab: 'dosen', doseId: id };
      if (parts.length === 4 && book === 'book') return { kind: 'dose', tab: 'dosen', doseId: id, chapter: slug };
    }
    if (first === 'simulators' && parts.length === 2) {
      const simulator = resolveSimulator(id);
      return simulator ? { kind: 'simulator', tab: 'sandboxes', simulator } : { kind: 'not-found', tab: 'not-found' };
    }
    if (first === 'ventures' && parts.length === 2) return { kind: 'venture', tab: 'ventures', ventureId: id };
    const tab = first === 'simulators' ? 'sandboxes' : first;
    if (parts.length === 1 && ALL_NAV_TABS.includes(tab)) return { kind: 'tab', tab };
  } catch { /* Invalid URI encoding is an unknown route. */ }
  return { kind: 'not-found', tab: 'not-found' };
}

/** Convert legacy destinations without disturbing unrelated query parameters. */
export function legacyDestination(search: string, hash: string): string | null {
  const query = new URLSearchParams(search);
  let target: string | null = null;
  const raw = hash.replace(/^#\/?/, '');
  const legacyHash = /^(dose(?:=|\/)|(?:sim|simulator|sandbox)(?:=|\/)|compare=|venture=)/i.test(raw);
  const params = new URLSearchParams(legacyHash ? raw.replace(/^([^=/]+)\//, '$1=') : '');
  const pick = (...keys: string[]) => keys.map(k => params.get(k) ?? query.get(k)).find(v => v !== null && v !== undefined);
  const dose = pick('dose');
  const sim = pick('sim', 'simulator', 'sandbox');
  const compare = pick('compare');
  const venture = pick('venture');
  if (dose) {
    const chapter = pick('buch', 'chapter', 'book');
    target = chapter ? chapterPath(dose, chapter) : dosePath(dose);
  } else if (sim) target = simulatorPath(resolveSimulator(sim) ?? sim);
  else if (compare !== undefined) {
    target = tabPath('compare');
    query.set('items', compare);
  } else if (venture) target = venturePath(venture);
  if (!target) return null;
  const lang = params.get('lang');
  if (lang) query.set('lang', lang);
  for (const key of ['dose', 'sim', 'simulator', 'sandbox', 'compare', 'venture', 'buch', 'chapter', 'book']) query.delete(key);
  const suffix = query.toString();
  return target + (suffix ? `?${suffix}` : '') + (!legacyHash ? hash : '');
}

/** Carry appearance/access preferences, never destination-specific selectors. */
export function withPreferences(path: string, search: string): string {
  const target = new URL(path, 'https://amelie.invalid');
  const previous = new URLSearchParams(search);
  for (const key of ['lang', 'admin', 'mood']) {
    const value = previous.get(key);
    if (value !== null && !target.searchParams.has(key)) target.searchParams.set(key, value);
  }
  return target.pathname + target.search + target.hash;
}
