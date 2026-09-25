---
status: Available
delivery_method: E-Mail
target_maker: CityLAB Berlin / Technologiestiftung
review_score: 29/35
architecture_tier: Tier 2
source_type: Type B
---
# Observation Post with Handover

**One sentence:** An adoption nobody acts on still tells the neighbourhood "this tree is being cared for". Instead, the post should visibly age, fall vacant and be taken over — without breaking the observation series.

**As of:** 21. September 2026 · **Recheck by:** März 2027  
**Recipient:** CityLAB Berlin / Technologiestiftung (the tree-watering platform) · secondary: GLOBE Netherlands (GrowApp), USA-NPN (Nature's Notebook)  
**Verdict:** 🎁 **gift**  
**Review:** 29/35 · Tier 2 · Type B (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The problem

The Berlin tree platform lets people adopt a single street tree so the neighbourhood knows it is being cared for. That promise is never withdrawn: the source code has exactly two operations, adopt and unadopt, and the second must be triggered by the adopter. No expiry, no inactivity check, no handover. Anyone who moves away, falls ill or loses interest leaves behind a tree marked as cared for that no longer is — and the longer the project runs, the more such markers accumulate. One level up, the same pattern costs science its most valuable data: in phenology apps the observation series is tied to the account, so whoever photographs the same tree later starts at image one.

## Why now

- Image registration is library code: showing the previous photo semi-transparently to find the vantage point is already done by existing phenology apps. What is missing is only that the overlay may belong to someone else.
- Individual-level segmentation runs on device — not "which species" but "the same plant as in image one". In 2022 that was still a research project.
- The ageing part needs no AI at all: watering events already carry timestamps; the signal is in the database and simply is not evaluated.

## Sketch

The post is the object, not the person: one tree, one vantage point, one recipe of height, bearing and a reference object in frame. The state of the post is publicly visible and moves from tended through overdue to seeking successor; the threshold comes from the matter itself — watering intervals in a heatwave, the species' phenological window — not from a round number. Whoever takes over a post receives the last image as an overlay and supplies a match confirming both vantage point and individual; the series then continues unbroken. The history belongs to the post: quitting costs the role, not the observations. Not included: competition for posts, duels, seizing active adoptions, rankings between people, or a new app.

## First step

**Ticket:** One post changes hands, and the series does not break.

Done when the export yields four images as one time series, correctly attributed to who took what when, with no break at the handover. For the tree platform there is a smaller precursor with no AI at all: give the adoption marker an age and let it visibly age on the map; the watering data is already there.

## Where it breaks

If the marker is the wrong object: adoption is not exclusive, several people can adopt the same tree. Expiry per person is then meaningless — what must age is the tree's care, not a person's bookmark. If expiry reads as a threat, it drives away exactly the people worth keeping; the state belongs on the post and must be phrased neutrally, never on the person. And handover only pays where the series has a destination — without one it is bookkeeping.

## Who has already tried this

The Berlin platform is open source and was checked in code: the adoption store knows adopt, unadopt and a check for adoption by others, and nothing else; no match for expiry, inactivity, transfer or orphaning. Nature's Notebook does know a handover, but at group and programme level, as an administrative act, and it assumes the departing person acts beforehand — precisely the case at issue here is not covered. GrowApp fully covers the time-lapse, with the series tied to the account. The competitive mechanic from the original brainstorm is mature in location-based games, but there it attaches to virtual objects that owe nobody anything.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
