---
status: Available
delivery_method: E-Mail
target_maker: State agencies with a digitised mapping key
review_score: 30/35
architecture_tier: Tier 2
source_type: Type B
---
# Mapping Pilot

**One sentence:** A field assistant for habitat mapping that shows, while you are still on site, which indicator species or structural note is missing to decide between two candidate codes — a live prompt instead of a prediction made later at the desk.

**As of:** 18. September 2026 · **Recheck by:** September 2027  
**Recipient:** State agencies with a digitised mapping key · secondary: training institutions and planning offices with their own survey teams  
**Verdict:** 🎁 **gift**  
**Review:** 30/35 · Tier 2 · Type B (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The problem

Surveyors usually work alone and assign codes in the field from an official key of more than a hundred pages. For transitional and mosaic types the decision often hinges on a single extra observation — an indicator species nobody went looking for, or a structural feature nobody recorded. The gap is typically noticed at the desk, by which time the site is often no longer in the right state, and the narrow six-week season makes a second visit expensive.

## Why now

- Several state mapping keys now exist with structured cross-references, making them machine-readable as decision logic for the first time.
- Small language models run offline on a field phone — which matters because many open-land sites have no network coverage.
- The e-Surveyor study (Ridding et al. 2026) is the first published evidence that automated habitat-type prediction from a species list works at all — but for a different classification system and as an after-the-fact prediction.

## Sketch

The surveyor records species and structural observations as usual during the walk, by voice or shorthand. The app holds the digitised decision logic of one mapping key in the background and detects when two codes remain equally likely. At that moment it shows what is still missing to tell them apart and where it is typically found. No automatic code suggestion, no replacement of professional judgement — only a completeness check while you are still standing on the site.

## First step

**Ticket:** Transfer a single top-level habitat group from one state key by hand into a decision table of code versus required indicator species and structural features.

Done when an experienced surveyor checks that table against three real, completed cases and confirms that the logic reproduces the decision they made at the time.

## Where it breaks

Real practice is more holistic than the printed key suggests — the overall impression of a site often counts for more than individual criteria. A tool that reflects only the written criteria can create false confidence in exactly the borderline cases it targets. Remedy: never sell it as a classifier, only as a reminder of what has not been checked, and validate against real past cases before any rollout, not just against the text.

## Who has already tried this

The e-Surveyor app predicts habitat type from a field species list under three UK classification systems — so the principle works, but for a different system and as an after-the-fact prediction. Vegapp digitises field data entry without classification logic. For the German key, four searches found no comparable tool; no state agency offers more than PDF keys with cross-references.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
