---
status: Available
delivery_method: E-Mail
target_maker: Ecological planning offices and surveyors calculating impact compensation under the German compensation ordinance
review_score: 31/35
architecture_tier: Tier 1/2
source_type: Type A
---
# Habitat Type Assistant

**One sentence:** Upload field photos of a surveyed site and get a proposal for the applicable habitat type under the German compensation ordinance — with its value-point range, so surveyors confirm instead of looking up one of 668 types by hand.

**As of:** 18. September 2026 · **Recheck by:** März 2027  
**Recipient:** Ecological planning offices and surveyors calculating impact compensation under the German compensation ordinance · secondary: the federal nature conservation agency (BfN) or the KIBI project team  
**Verdict:** 🎁 **gift**  
**Review:** 31/35 · Tier 1/2 · Type A (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The problem

Anyone calculating compensation for construction, roads or wind farms under the German compensation ordinance must assign every surveyed patch to one of 668 habitat types from a 315-page mapping manual before value points from 0 to 24 — and thus the required compensation — are fixed. Manual work with a very thick reference book, patch by patch.

## Why now

- Image classification on field photos has become cheap and fast; ObsIdentify reaches roughly 95 % accuracy on species from a single photo.
- Those models are trained at species level, not on the legally prescribed 668-type classification of the 2025 manual — which is new enough that no public training set exists for it.
- State agencies already hold labelled patches from their habitat surveys; the question is access, not feasibility.

## Sketch

Photos plus a rough location (federal state, land-use context) yield three habitat-type proposals with confidence scores and page references into the manual, which the surveyor confirms or corrects. Optionally wired to an existing value-point calculator. It does not replace the site visit — it is a pre-sort that shortens the lookup.

## First step

**Ticket:** Settle the training-data question before building anything.

Done when a list of possible data sources exists — state habitat surveys, GBIF, app exports — with named contacts. That is the precondition for any model training.

## Where it breaks

The federal KIBI project tackles the same task from the other side, via remote sensing rather than ground photos, which puts a pre-sorting tool in competition for training data and jurisdiction. Without cooperation from a state agency, an independent tool probably gets no access to reliable training data — hence the short review window.

## Who has already tried this

KIBI maps habitat types automatically from aerial and satellite imagery — different data source, narrower catalogue. Field-recording apps digitise data entry without classifying. ObsIdentify and Flora Incognita identify species, not habitat types. Compensation-area registries are GIS administration, not image analysis. No ground-photo-to-type classifier was found, but the field is visibly moving.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
