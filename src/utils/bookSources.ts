/**
 * Lädt die Kapitel-Rohtexte aus dem Repo.
 *
 * Bewusst über import.meta.glob und nicht über eine Kopie in public/: Eine
 * Kopie wäre eine zweite Wahrheit, die driftet. So ist die Datei im Repo die
 * einzige Fassung, und ein falscher Pfad fällt beim Bauen auf statt als 404
 * beim Leser. Lazy geladen — jedes Kapitel wird ein eigener Chunk und belastet
 * das Hauptbundle nicht.
 */

const SOURCES = import.meta.glob(
  [
    '/01-konzept/**/*.md',
    '/02-recherche/**/*.md',
    '/06-suche/**/*.md',
  ],
  { query: '?raw', import: 'default' }
) as Record<string, () => Promise<string>>;

const REPO = 'https://github.com/felixinberlin/Amelie';

/** Repo-relativer Pfad → Schlüssel im Glob (führender Slash) */
function key(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

export function hasSource(path: string): boolean {
  return key(path) in SOURCES;
}

export function listSourcePaths(): string[] {
  return Object.keys(SOURCES).map((k) => k.replace(/^\//, '')).sort();
}

export async function loadSource(path: string): Promise<string> {
  const loader = SOURCES[key(path)];
  if (!loader) {
    throw new Error(`Kein Quelltext für ${path} gefunden.`);
  }
  return loader();
}

/** Ansicht der Datei auf GitHub — zeigt zugleich ihre Commit-Historie. */
export function getRepoFileUrl(path: string): string {
  return `${REPO}/blob/main/${path.split('/').map(encodeURIComponent).join('/')}`;
}

export function getRepoHistoryUrl(path: string): string {
  return `${REPO}/commits/main/${path.split('/').map(encodeURIComponent).join('/')}`;
}

export function getRepoRawUrl(path: string): string {
  return `${REPO}/raw/main/${path.split('/').map(encodeURIComponent).join('/')}`;
}
