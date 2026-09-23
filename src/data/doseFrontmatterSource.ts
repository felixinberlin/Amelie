/**
 * Reads each Dose's YAML frontmatter straight from `05-dosen/*.md`.
 *
 * Same reasoning as `src/utils/bookSources.ts`: bundled via `import.meta.glob`
 * instead of copying to `public/`, so the Markdown file in the repo stays the
 * only version and a missing/renamed Dose fails the build, not a 404 at
 * runtime. `{ eager: false }` (the default) keeps every Dose its own lazy
 * chunk — loading delivery state never blocks the initial bundle.
 *
 * This is the async, build-time-glob / runtime-import pattern the ticket
 * asked for ("asynchronously fetch"), without the static-hosted app ever
 * doing a real directory listing, which a GitHub-Pages-only site can't do.
 */
import { IdeaFrontmatter } from '../types';
import { parseIdeaFrontmatter } from '../utils/ideaFrontmatter';

const DOSE_FILES = import.meta.glob('/05-dosen/*.md', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>;

/** `/05-dosen/altbau-thermal.md` → `altbau-thermal`. Skips the `_entsorgt.md` graveyard file. */
function doseIdFromPath(path: string): string | null {
  const match = path.match(/\/05-dosen\/([^/]+)\.md$/);
  if (!match) return null;
  const id = match[1];
  return id.startsWith('_') ? null : id;
}

let cache: Promise<Record<string, IdeaFrontmatter | null>> | null = null;

/**
 * Loads and parses every Dose's frontmatter. Resolves once for the whole
 * session — repeated calls (e.g. from both MatrixView and
 * MusterEmailsSection) share one in-flight load instead of re-fetching.
 */
export function loadAllDoseFrontmatter(): Promise<Record<string, IdeaFrontmatter | null>> {
  if (!cache) {
    cache = (async () => {
      const entries = await Promise.all(
        Object.entries(DOSE_FILES).map(async ([path, load]) => {
          const id = doseIdFromPath(path);
          if (!id) return null;
          const raw = await load();
          return [id, parseIdeaFrontmatter(raw, `05-dosen/${id}.md`)] as const;
        })
      );
      const result: Record<string, IdeaFrontmatter | null> = {};
      for (const entry of entries) {
        if (entry) result[entry[0]] = entry[1];
      }
      return result;
    })();
  }
  return cache;
}
