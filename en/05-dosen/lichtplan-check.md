---
status: Available
delivery_method: E-Mail
target_maker: State environment agencies with their own guidance
review_score: 32/35
architecture_tier: Tier 1/2
source_type: Type A
---
# Lighting Plan Check

**One sentence:** A web form that checks planned outdoor lighting against the scattered insect- and bird-friendly criteria of several agencies, and shows with citations where it fails.

**As of:** 18. September 2026 · **Recheck by:** September 2027  
**Recipient:** State environment agencies with their own guidance (e.g. Hamburg's "Light & Nature Conservation") · secondary: conservation NGOs, municipal environment offices retrofitting street lighting  
**Verdict:** 🎁 **gift**  
**Review:** 32/35 · Tier 1/2 · Type A (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The problem

Builders, municipalities and lighting designers are expected to check outdoor lighting against bird and insect protection criteria — but those criteria are scattered across PDF guidance from several agencies and NGOs instead of sitting in one place: steep beam angles, colour temperature at or below 2700 K and ideally around 2200 K, shielding, operating hours. Anyone not hiring a lighting designer has no way to check a plan themselves.

## Why now

- Language models can consolidate PDF guidance from several agencies into one sourced criteria catalogue — previously that meant reading every state's guidance by hand.
- The check itself needs no model, only thresholds. The effort is entirely in the research, not the building.

## Sketch

A form for location (near-natural yes/no, roughly geocoded), luminaire type, colour temperature, beam angle, shielding and operating hours; output as a traffic light per criterion, with the guidance quoted verbatim and a recommendation. Not included: camera analysis of existing installations, and any claim to replace an expert report in a permit procedure.

## First step

**Ticket:** Transfer the four or five guidance documents into one shared criteria table.

Done when a table of criterion, threshold, source and source date exists that explicitly marks contradictions between the documents — 2200 K versus 2700 K, for instance — instead of hiding them.

## Where it breaks

The guidance documents contradict each other in detail, and a tool that declares a wrong threshold "safe" is worse than none. Remedy: quote every criterion with its source rather than asserting it, and say plainly throughout that this is a self-check, not a substitute for an expert report.

## Who has already tried this

No automated checking app was found (three searches on 18 Sep 2026). There is text guidance from the Hamburg environment authority and from conservation NGOs, plus a commercial advisory offer from a luminaire manufacturer — but no neutral self-check tool.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
