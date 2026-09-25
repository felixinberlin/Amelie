---
status: Available
delivery_method: E-Mail
target_maker: Service Employees International Union
review_score: 34/35
architecture_tier: Tier 1
source_type: Type A
---
# ChemHazard Stop (Chemical Safety Shield for Cleaners)

**One sentence:** Point phone camera at 2 cleaning chemical bottles: Warns audibly in 20 languages against toxic chlorine gas and acid burns.

**As of:** 17.09.2026 · **Recheck by:** März 2027  
**Recipient:** Service Employees International Union (SEIU) · European Cleaning and Facility Services Industry  
**Verdict:** 🎁 **gift**  
**Review:** 34/35 · Tier 1 · Type A (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The problem

Commercial cleaners work under extreme speed pressure, frequently facing language hurdles. Accidental mixing of acidic descalers with bleach releases deadly chlorine gas into confined restrooms.

## Why now

- Vision models parse compound names on warped, wet, and scuffed bottles in milliseconds.
- Instant spoken audio warning in the worker's mother tongue removes the burden of reading technical German.
- Zero internet requirement—runs 100% offline in basement restrooms and custodial closets.

## Sketch

Worker holds 2 bottles in front of phone camera. If acid + hypochlorite detected: Screen flashes high-contrast red, phone vibrates, loud voice announces: "STOP! Do not mix! Poisonous gas!"

## First step

**Ticket:** P0: Visual dual-bottle compound classification with incompatibility matrix and audio alert.

Triggers audio alarm on acid + hypochlorite combination within 1 second of camera detection.

## Where it breaks

Muted audio settings: App must trigger distinctive high-frequency haptic vibration pulses alongside screen flashes.

## Who has already tried this

The recipient already runs the information system: BG BAU operates WINGIS (hazardous substance information, also mobile) with the GISCODE for cleaning agents, plus DGUV rule 101-019 with collective operating instructions. Mixing bans are textbook knowledge and appear in every public-health warning. Not found (check of 24.09.2026): a camera app that recognises two bottles and warns loudly before mixing. Tipping risk: a false "all clear" is worse than no app — for professional products the GISCODE from the product or safety data sheet is a safer input than image recognition.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
