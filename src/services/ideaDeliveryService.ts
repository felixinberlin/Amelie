/**
 * Delivery state for outreach emails (`src/data/deliveries.ts`), derived from
 * the Dosen they link to (`DeliveryEmail.doseLinks`) instead of a hand-edited
 * `localStorage` map. Replaces the old `getSentEmailsMap()` /
 * `markEmailAsSent()` pair in `src/services/storageService.ts`: there is
 * nothing left to toggle by hand — sending a mail means updating the linked
 * Dose's status (`src/data/dosen.ts`) and re-running
 * `scripts/sync-idea-frontmatter.mjs`, which is the only place delivery
 * state is written from now on.
 */
import { DELIVERIES_DATA } from '../data/deliveries';
import { loadAllDoseFrontmatter } from '../data/doseFrontmatterSource';
import { IdeaFrontmatter, IdeaStatus, SentEmailRecord } from '../types';
import { mapIdeaFrontmatterToDeliveryState } from '../utils/ideaFrontmatter';

/**
 * Of the Dosen a mail links to, picks the one whose frontmatter best
 * represents "was this mail sent?" — a Delivered Dose wins outright; failing
 * that, the first Dose with any parsed frontmatter is used as a fallback so
 * `notes` still resolves to something.
 */
function pickRepresentativeFrontmatter(
  doseIds: string[],
  frontmatterByDoseId: Record<string, IdeaFrontmatter | null>
): IdeaFrontmatter | null {
  const linked = doseIds.map((id) => frontmatterByDoseId[id]).filter((fm): fm is IdeaFrontmatter => !!fm);
  return linked.find((fm) => fm.status === IdeaStatus.Delivered) ?? linked[0] ?? null;
}

/**
 * Loads delivery state for every outreach email, keyed by `DeliveryEmail.id`
 * (`mail-1`, `mail-2`, ...) — the same shape `getSentEmailsMap()` used to
 * return, but computed instead of stored.
 */
export async function loadSentEmailsMap(): Promise<Record<string, SentEmailRecord>> {
  const frontmatterByDoseId = await loadAllDoseFrontmatter();
  const result: Record<string, SentEmailRecord> = {};
  for (const mail of DELIVERIES_DATA) {
    const frontmatter = pickRepresentativeFrontmatter(mail.doseLinks ?? [], frontmatterByDoseId);
    result[mail.id] = mapIdeaFrontmatterToDeliveryState(frontmatter);
  }
  return result;
}

/**
 * Delivery state for a single Dose (used by `MusterEmailsSection`, which
 * tracks a free-form template × Dose pairing rather than a fixed mail id).
 */
export async function loadDeliveryStateForDose(doseId: string): Promise<SentEmailRecord> {
  const frontmatterByDoseId = await loadAllDoseFrontmatter();
  return mapIdeaFrontmatterToDeliveryState(frontmatterByDoseId[doseId] ?? null);
}
