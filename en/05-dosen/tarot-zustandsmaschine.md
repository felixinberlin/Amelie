---
status: Available
delivery_method: Reddit Post
target_maker: Open Source Tarot & Developer Community (r/tarot / r/webdev / r/indiegames / r/occult)
review_score: 31/35
architecture_tier: Tier 1
source_type: Type B/D
---
# Tarot Spread Graph DSL — Arcana Schema

**One sentence:** Tarot spreads and readings receive an open-source JSON Schema standard (**Arcana Schema v2.0.0**) for spatial board layouts, typed directed graph relations, and deck contracts.

**Status:** September 2026 · **Review from:** September 2027  
**Project & Docs:** [felixinberlin.github.io/Arcana-schema](https://felixinberlin.github.io/Arcana-schema/) · GitHub: [felixinberlin/Arcana-schema](https://github.com/felixinberlin/Arcana-schema)  
**Recipient / Outreach:** Reddit Community (`r/tarot`, `r/webdev`, `r/indiegames`, `r/occult`), indie deck creators, and game narrative engineers  
**Verdict:** 🎁 Released & gifted as open specification, npm package (`@arcana-schema/validator`), and interactive schema playground (MIT / CC BY 4.0)  
**Review:** 31/35 · Tier 1 · Type B/D (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The Problem

Tarot spreads have been passed down for over two centuries almost exclusively in prose: *“Card 1 is the situation, Card 2 crosses it representing the immediate hurdle, Card 3 forms the foundation...”* In digital applications, spreads have historically been hardcoded as flat arrays (`cards[0]..cards[9]`). The key structural rules were left unformalized:

- **What does “crosses” mean?** An orthogonal 90° geometric rotation on layer $z=1$ alongside a semantic conflict relation between two nodes — formalized nowhere until now.
- **How do reversals affect neighboring cards?** A reversal does not merely negate a single card; it blocks transition dynamics (`leads_to`) and heightens symmetrical reflections (`mirrors`).
- **Deck Incompatibilities:** How should the same spread behave when applied to a 22-card Majors-only deck or a 36-card Lenormand deck?
- **Fragmented Reading Logs:** Every tarot journal and app stores historical readings in proprietary structures, preventing cross-tool interoperability.

## Arcana Schema Architecture

**Arcana Schema (v2.0.0)** establishes a formal, dual-validated JSON specification (JSON Schema Draft 2020-12 & Draft-7) with a production validator (`@arcana-schema/validator`):

1. **Clean Separation (`TarotSpreadDefinition` vs. `TarotReading`):** Reusable spread definitions are strictly decoupled from historical session logs.
2. **Declarative Deck Contracts (`deckContract`):** Enforces minimum card counts (`minCards`), major/minor arcana requirements (`requiredArcana`), and reversal constraints before drawing.
3. **Geometric Slot Coordinates (`layout`):** Normalized $(x, y, \theta, z)$ coordinates allow frontends to render layouts dynamically without custom CSS per spread.
4. **Typed Directed Relations (`relations`):** 9 semantic edge types (`crosses`, `grounds`, `crowns`, `leads_to`, `mirrors`, `opposes`, `clarifies`, `culminates_in`, `adjacent_to`).
5. **Canonical Catalog & SDK:** Ships with canonical reference spreads (Single Card, Past-Present-Future, Celtic Cross, Tree of Life) and deterministic Markdown/HTML renderers.

## Reddit Post Announcement (Minimal Schema Example)

Community outreach is structured as a Reddit announcement post highlighting the schema and a minimal example:

```json
{
  "schemaVersion": "2.0.0",
  "id": "past-present-future",
  "name": "Past, Present, Future",
  "deckContract": { "minCards": 3, "allowReversals": true },
  "slots": [
    { "id": "past", "order": 1, "role": "Past Foundations", "layout": { "x": 0.2, "y": 0.5, "rotation": 0 } },
    { "id": "present", "order": 2, "role": "Present Circumstance", "layout": { "x": 0.5, "y": 0.5, "rotation": 0 } },
    { "id": "future", "order": 3, "role": "Emerging Outcome", "layout": { "x": 0.8, "y": 0.5, "rotation": 0 } }
  ],
  "relations": [
    { "source": "past", "target": "present", "type": "leads_to" },
    { "source": "present", "target": "future", "type": "leads_to" }
  ]
}
```

## Research & Scaffolding

- [Chapter 1: Community Needs & Occult Traditions](../../02-recherche/tarot-occult-community-needs.md)
- [Chapter 2: Architecture & Relational Graph Model](../../02-recherche/tarot-zustandsmaschine-dsl.md)
- [Chapter 3: Open Source Scaffolding & Examples](../../07-demos/tarot-zustandsmaschine/README.md)
- [Arcana Schema Live Docs & Playground](https://felixinberlin.github.io/Arcana-schema/)

---

CC0 1.0 Universal / MIT & CC BY 4.0. — Félix, Berlin · github.com/felixinberlin/Arcana-schema
