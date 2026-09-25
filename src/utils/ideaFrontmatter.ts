/**
 * Parsing and mapping for the strict YAML frontmatter carried by every Dose
 * (`05-dosen/*.md`). Deliberately isomorphic — no `fs`, no browser globals —
 * so the exact same code runs in `scripts/sync-idea-frontmatter.mjs` (Node,
 * generates the frontmatter) and in `src/data/doseFrontmatterSource.ts`
 * (browser, reads it back via `import.meta.glob`).
 *
 * `DoseStatus` (see `src/types.ts`) stays the app's one real status field.
 * `IdeaStatus` is a thin, ticket-facing translation of it that only ever
 * flows outward into the frontmatter — nothing here maps IdeaStatus back
 * onto DoseStatus, so there is exactly one status system, not two.
 */
import { Buffer as BufferPolyfill } from 'buffer';
import matter from 'gray-matter';
import { DoseStatus, IdeaFrontmatter, IdeaStatus, SentEmailRecord } from '../types';

// gray-matter unconditionally calls Buffer.from(...) internally
// (node_modules/gray-matter/lib/utils.js). Node (this script, vitest) already
// has a global Buffer; a browser bundle does not, and Vite — unlike webpack —
// does not polyfill Node core globals by default, so every parse threw
// "Buffer is not defined" once this ran client-side and every Dose silently
// fell back to "not sent". Installing the standard browser-safe `buffer`
// package as the global fixes gray-matter everywhere without reimplementing
// YAML (the generated frontmatter already uses real YAML features, e.g. a
// folded `>-` block scalar for a long target_maker value).
if (typeof globalThis.Buffer === 'undefined') {
  (globalThis as unknown as { Buffer: typeof BufferPolyfill }).Buffer = BufferPolyfill;
}

/** DoseStatus → IdeaStatus. Exhaustive so a new DoseStatus fails to compile here, not silently. */
export const DOSE_STATUS_TO_IDEA_STATUS: Record<DoseStatus, IdeaStatus> = {
  gefunden: IdeaStatus.Available,
  gepackt: IdeaStatus.Available,
  zugestellt: IdeaStatus.Delivered,
  antwort: IdeaStatus.InProgress,
  gebaut: IdeaStatus.Launched,
  entsorgt: IdeaStatus.Available,
};

const VALID_IDEA_STATUSES: readonly string[] = Object.values(IdeaStatus);

function isIdeaStatus(value: unknown): value is IdeaStatus {
  return typeof value === 'string' && VALID_IDEA_STATUSES.includes(value);
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && !Number.isNaN(Date.parse(value));
}

/**
 * Parses and strictly validates one Dose's raw markdown (frontmatter + body)
 * against `IdeaFrontmatter`. Never throws: an invalid or misspelled `status`
 * is logged as a warning and the file is skipped (returns `null`) instead of
 * silently producing a wrong delivery state for that Dose.
 */
export function parseIdeaFrontmatter(raw: string, sourceLabel: string): IdeaFrontmatter | null {
  let data: Record<string, unknown>;
  try {
    data = matter(raw).data as Record<string, unknown>;
  } catch (err) {
    console.warn(`[ideaFrontmatter] ${sourceLabel}: could not parse YAML frontmatter — ${(err as Error).message}`);
    return null;
  }

  if (data.status === undefined) {
    console.warn(`[ideaFrontmatter] ${sourceLabel}: no "status" in frontmatter — skipping.`);
    return null;
  }
  if (!isIdeaStatus(data.status)) {
    console.warn(
      `[ideaFrontmatter] ${sourceLabel}: invalid or misspelled status "${String(data.status)}" — ` +
        `expected one of ${VALID_IDEA_STATUSES.join(', ')}. Skipping.`
    );
    return null;
  }

  if (data.date_delivered !== undefined && !isIsoTimestamp(data.date_delivered)) {
    console.warn(
      `[ideaFrontmatter] ${sourceLabel}: "date_delivered" is not a valid ISO 8601 timestamp ("${String(
        data.date_delivered
      )}") — ignoring it.`
    );
    delete data.date_delivered;
  }

  const frontmatter: IdeaFrontmatter = { status: data.status };
  if (typeof data.date_delivered === 'string') frontmatter.date_delivered = data.date_delivered;
  if (typeof data.delivery_method === 'string') frontmatter.delivery_method = data.delivery_method;
  if (typeof data.target_maker === 'string') frontmatter.target_maker = data.target_maker;
  if (typeof data.review_score === 'string') frontmatter.review_score = data.review_score;
  if (typeof data.architecture_tier === 'string') frontmatter.architecture_tier = data.architecture_tier;
  if (typeof data.source_type === 'string') frontmatter.source_type = data.source_type;
  return frontmatter;
}

/**
 * Maps one Dose's strictly-typed frontmatter to the frontend's
 * `SentEmailRecord` shape (Acceptance Criteria "Map the State"):
 *  - status === Delivered  → sent: true
 *  - date_delivered        → sentAt
 *  - target_maker + delivery_method → notes (concatenated)
 */
export function mapIdeaFrontmatterToDeliveryState(frontmatter: IdeaFrontmatter | null): SentEmailRecord {
  if (!frontmatter) {
    return { sent: false, sentAt: '' };
  }
  const notes = [frontmatter.target_maker, frontmatter.delivery_method].filter(Boolean).join(' · ') || undefined;
  return {
    sent: frontmatter.status === IdeaStatus.Delivered,
    sentAt: frontmatter.status === IdeaStatus.Delivered ? frontmatter.date_delivered ?? '' : '',
    notes,
  };
}
