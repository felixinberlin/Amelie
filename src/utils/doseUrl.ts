/** Permanent website URLs and backwards-compatible delivery links. */
import metadata from 'virtual:site-metadata';
import { chapterPath, dosePath, simulatorPath, venturePath, parsePageRoute, resolveSimulator } from '../routing/routes';

export function getBaseUrl(): string {
  const origin = typeof window !== 'undefined' && /^https?:$/.test(window.location.protocol) ? window.location.origin : '';
  return `${origin}${import.meta.env.BASE_URL || '/'}`;
}

function route() {
  if (typeof window === 'undefined') return null;
  const base = import.meta.env.BASE_URL || '/';
  const pathname = window.location.pathname.startsWith(base) ? '/' + window.location.pathname.slice(base.length) : window.location.pathname;
  return parsePageRoute(pathname, window.location.search);
}

function absolute(path: string): string {
  const url = new URL(path, 'https://amelie.invalid');
  const lang = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('lang') : null;
  if (lang && /^(de|en|es)$/.test(lang)) url.searchParams.set('lang', lang);
  return getBaseUrl() + (url.pathname + url.search + url.hash).slice(1);
}
export function getDoseUrl(id: string): string {
  return absolute(metadata.doseIds.includes(id) ? dosePath(id) : `/dosen/?dose=${encodeURIComponent(id)}`);
}
/** Project policy: delivery links always point to the root-level dose anchor. */
export function getDeliveryDoseUrl(id: string): string { return `${getBaseUrl()}#dose=${encodeURIComponent(id)}`; }
export function getSimulatorUrl(key: string): string { return absolute(simulatorPath(resolveSimulator(key) ?? key)); }
export function getBookChapterUrl(id: string, slug: string): string { return absolute(chapterPath(id, slug)); }
export function getVentureUrl(id: string): string { return absolute(venturePath(id)); }
export function getCompareUrl(ids: string[]): string {
  return absolute(`/compare/?${new URLSearchParams({ items: ids.join(',') })}`);
}

export function parseDoseIdFromUrl(): string | null {
  const r = route();
  if (r?.kind === 'dose') return r.doseId;
  if (typeof window === 'undefined') return null;
  try {
    const match = window.location.hash.match(/^#\/?dose(?:=|\/)([^&/?]+)/i);
    return match ? decodeURIComponent(match[1]) : new URLSearchParams(window.location.search).get('dose');
  } catch { return null; }
}
export function parseBookSlugFromUrl(): string | null {
  const r = route();
  if (r?.kind === 'dose' && r.chapter) return r.chapter;
  if (typeof window === 'undefined') return null;
  try {
    const hash = new URLSearchParams(window.location.hash.replace(/^#\/?/, ''));
    const query = new URLSearchParams(window.location.search);
    return hash.get('buch') || hash.get('chapter') || hash.get('book') || query.get('buch') || query.get('chapter') || query.get('book');
  } catch { return null; }
}
export function parseSimulatorFromUrl(): string | null {
  const r = route();
  if (r?.kind === 'simulator') return r.simulator;
  if (typeof window === 'undefined') return null;
  try {
    const match = window.location.hash.match(/^#\/?(?:sim|simulator|sandbox)(?:=|\/)([^&/?]+)/i);
    if (match) return decodeURIComponent(match[1]);
    const query = new URLSearchParams(window.location.search);
    return query.get('sim') || query.get('simulator') || query.get('sandbox');
  } catch { return null; }
}
export function parseCompareFromUrl(): string[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const r = route();
    const match = window.location.hash.match(/^#\/?compare=([^&]*)/i);
    const value = match ? decodeURIComponent(match[1]) : r?.tab === 'compare' ? new URLSearchParams(window.location.search).get('items') : null;
    return value === null ? null : value.split(',').map(s => s.trim()).filter(Boolean);
  } catch { return null; }
}
export function parseVentureFromUrl(): string | null {
  const r = route();
  if (r?.kind === 'venture') return r.ventureId;
  if (typeof window === 'undefined') return null;
  try {
    const match = window.location.hash.match(/^#\/?venture=([^&]+)/i);
    return match ? decodeURIComponent(match[1]) : null;
  } catch { return null; }
}

/**
 * Replaces placeholder [Link zur Dose...] or [Link to tin...] in email text
 * with real, clickable URLs using the current origin
 */
export function resolveEmailBodyDoseUrls(body: string, doseLinks?: string[]): string {
  if (!doseLinks || doseLinks.length === 0) return body;

  let resolved = body;

  // If there is only one dose link and a generic or named placeholder
  if (doseLinks.length === 1) {
    const url = getDeliveryDoseUrl(doseLinks[0]);
    resolved = resolved.replace(/\[Link zur Dose:[^\]]+\]/gi, url);
    resolved = resolved.replace(/\[Link to Dose:[^\]]+\]/gi, url);
    resolved = resolved.replace(/\[Link to tin:[^\]]+\]/gi, url);
    resolved = resolved.replace(/\[Link zur Dose\]/gi, url);
    resolved = resolved.replace(/\[Link to tin\]/gi, url);
  } else if (doseLinks.length >= 2) {
    // Multiple dose links: e.g. Sperrmüll-Radar & Kiez-Lärmkarte
    // In mail-2:
    // - Sperrmüll-Radar: [Link zur Dose]
    // - Kiez-Lärmkarte: [Link zur Dose]
    doseLinks.forEach((id) => {
      const url = getDeliveryDoseUrl(id);
      // Replace case where dose ID or key is in placeholder
      const escapedId = id.replace(/-/g, '[-\\s]?');
      const specificRegex = new RegExp(`\\[(?:Link zur Dose|Link to tin):?\\s*${escapedId}[^\\]]*\\]`, 'gi');
      resolved = resolved.replace(specificRegex, url);
    });

    // Sequential fallback for lines like "- Name: [Link zur Dose]"
    let linkIdx = 0;
    resolved = resolved.replace(/\[(?:Link zur Dose|Link to tin)\]/gi, () => {
      if (linkIdx < doseLinks.length) {
        const url = getDeliveryDoseUrl(doseLinks[linkIdx]);
        linkIdx++;
        return url;
      }
      return getDeliveryDoseUrl(doseLinks[0]);
    });
  }

  return resolved;
}
