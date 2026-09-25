---
status: Available
delivery_method: E-Mail
target_maker: Family Caregiver Alliance
review_score: 28/35
architecture_tier: Tier 1/2
source_type: Type B
---
# PillSafe Vision

**One sentence:** A single overhead photo of a 7-day pillbox shields exhausted family caregivers from fatal medication errors using multimodal imprint and color verification against doctor schedules.

**As of:** September 2026 · **Recheck by:** März 2027  
**Recipient:** Family Caregiver Alliance · AARP Caregiving · National Institute on Aging  
**Verdict:** 🎁 **gift**  
**Review:** 28/35 · Tier 1/2 · Type B (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The problem

Over 40 million informal family caregivers sort polypharmacy regimens late at night. Visually indistinguishable white generic pills lead to thousands of avoidable hospitalizations annually.

## Why now

- Multimodal vision models parse subtle tablet imprints, bevels, and scoring lines under uneven kitchen illumination.
- WebGPU/Wasm enables complete on-device inference with zero patient data transmission to corporate clouds.
- Standardized national prescription QR codes allow instant schedule synchronization.

## Sketch

Camera scans 7x4 organizer grid. Segmentation isolates compartments. Vision model counts tablets and cross-references imprints against medication schedule, instantly flagging discrepancies.

## First step

**Ticket:** P0: 4-slot pillbox photo segmentation and tablet count.

Counts tablet units per compartment with 95% accuracy across 10 sample images.

## Where it breaks

False confidence on generic identical unmarked white tablets: Model must output explicit ambiguity warnings rather than ungrounded guesses.

## Who has already tried this

Identifying pills by photo is a crowded market (Smart Pill ID, checkmypill, Pill Pal, AI Pill Identifier), and so is counting tablets by camera (PillScan). MyTherapy and gesund.de already scan the German federal medication plan QR code for free. Not found (check of 24.09.2026): an app that verifies a filled pill organizer compartment by compartment against the plan. Open before any delivery: whether such a warning feature would be a regulated medical device, and whether an open imprint database exists for German generics.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
