---
status: Available
delivery_method: E-Mail
target_maker: Open Source Community (Labyrinthos / Twine / Ink / Tarot MCP)
review_score: 31/35
architecture_tier: Tier 1
source_type: Type B/D
---
# Tarot Spread Graph DSL (Tarot State Machine)

**One sentence:** A spread is already a program — positions are coordinate slots, cards act as typed states, and meaning emerges from directed relations. An open JSON specification for vendor-independent tarot spreads.

**Status:** September 2026 · **Review from:** September 2027  
**Recipient:** Open Source Ecosystem (GitHub / npm / MCP / Twine / Ink / Labyrinthos)  
**Verdict:** 🎁 Gifted as open specification, schema & runnable engine (CC0 Public Domain) — focused on relational graphs  
**Review:** 31/35 · Tier 1 · Type B/D (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The Problem

Tarot spreads have been passed down for over two centuries almost exclusively in prose: *“Card 1 is the situation, Card 2 crosses it representing the immediate hurdle, Card 3 forms the foundation, Card 4 the receding past...”* That is a specification, but an imprecise one. The crucial structural rules are never machine-readable:

- **What does “crosses” mean?** An orthogonal 90° geometric rotation on layer $z=1$ along with a semantic conflict relation between two nodes — formalized nowhere.
- **How does a reversed card alter neighbor dynamics?** Every experienced reader knows that a reversal does not merely negate a card's keyword; it blocks transition dynamics (`leads_to`) and intensifies inner reflections (`mirrors`).
- **Deck incompatibilities:** How should the same spread behave when applied to a 22-card Majors-only deck or a 36-card Lenormand deck? Without contracts, digital apps simply crash or draw duplicates.

**The consequence:** Every tarot app, Discord bot, and MCP server implements spreads as rigid, hardcoded arrays (`cards[0]..cards[9]`). Adding a new spread requires custom code; alternative decks break existing tooling. Independent artists who crowdfund physical decks on Kickstarter lack the engineering resources to provide digital companions.

## Why Now

The honest truth: **A spread DSL could have been written in 2010.** What creates decisive leverage today:

1. **LLM & AI Agent Architectures (MCP Servers):** Modern Tarot MCP servers (`tarotoo-mcp-server`, `deckaura/tarot-mcp-server`, `fzlzjerry/tarot-mcp`, `OracleBone`) connect AI assistants to tarot decks, but feed models flat prompt strings. A typed graph DSL provides structured tension fields and causal paths so models can generate psychologically grounded reflections rather than generic horoscope slop.
2. **Generative Graph Layouts in the Browser:** Modern declarative CSS Grid, SVG, and canvas/graph engines (React Flow, Dagre) render layouts autonomously from normalized $(x, y, \theta, z)$ coordinates without hardcoded views.
3. **Automated Parsing from Literature:** Historical spread descriptions from hundreds of public domain works can now be reliably parsed into formal JSON schema objects via multimodal models.

## The Design

An open, vendor-independent specification (`spread.schema.json`) based on JSON Schema (Draft 2020-12):

- **Deck Contract (`deckContract`):** Defines prerequisites (`minCards`, `requiredArcana`, `allowReversals`). Fails deterministically before drawing if a deck does not satisfy spread constraints.
- **Slots (Nodes):** Position with unique ID, bilingual labels, sequential order, geometric layout $(x, y, \theta, z)$, and functional role (`querent`, `situation`, `obstacle`, `foundation`, `outcome`, `advice`, etc.).
- **Relations (Directed Edges):** Typed semantic connections:
  - `crosses`: Orthogonal conflict / immediate challenge ($\theta = 90^\circ, z = 1$).
  - `grounds`: Foundational root feeding the situation.
  - `crowns`: Conscious aspiration / idealized potential.
  - `leads_to`: Temporal or causal transition.
  - `mirrors`: Symmetrical reflection across two perspectives.
  - `opposes`: Antithetical confrontation between opposing forces.
  - `clarifies`: Contextual illumination of target card.
  - `synthesizes`: Integration of converging energies into a whole.
- **Elemental Dignities (*Golden Dawn*):** Optional dynamic edge tension modulation:
  - Friendly (+0.25): Fire + Air, Water + Earth.
  - Hostile (-0.35): Fire vs Water, Air vs Earth.
  - Identical (+/-0.15): Intensifies prevailing polarity.
- **Reference Instances:** Celtic Cross (10 slots), Three-Card Timeline (3 slots), Horseshoe (7 slots), Relationship Cross (5 slots).

**The gift is the specification, schema, test suite, and open source scaffolding — free for the entire community.**

## The Dose Book (Research & Scaffolding)

- [Chapter 1: Community Needs & Occult Traditions](../../02-recherche/tarot-occult-community-needs.md) — Analysis of r/tarot, r/occult, and Discord: card-catalog reductionism, reversal blockades, elemental dignities, and proprietary deck traps.
- [Chapter 2: Architecture & Relational Graph Model](../../02-recherche/tarot-zustandsmaschine-dsl.md) — Comparative analysis of Tarotsmith, Deckaura, Tarot MCP servers, and open graph schemas.
- [Chapter 3: Open Source Scaffolding & Examples](../../07-demos/tarot-zustandsmaschine/README.md) — Complete JSON Schema (`spread.schema.json`), Celtic Cross, Three-Card, Horseshoe, and Relationship Cross references.
- [Chapter 4: Open Source Stack Recommendations](../../07-demos/tarot-zustandsmaschine/open-source-stack.md) — Integration guide for `tarot-json`, `XState v5`, `React Flow`, `Ajv`, and `Inkjs`.

## First Step (Completed)

**Ticket #01: Canonical Celtic Cross as Typed JSON Specification & Engine.**

1. Formal JSON Schema definition (`spread.schema.json`) with deck contracts, slots, and 8 relation types.
2. 4 Canonical reference spreads: Celtic Cross (`celtic-cross.json`), Three-Card (`three-card-linear.json`), Horseshoe (`horseshoe.json`), and Relationship Cross (`relationship-cross.json`).
3. Fully verified TypeScript engine (`tarotEngine.ts`) with Golden Dawn elemental dignities, reversal modulators, deck contract validation, spread integrity checks, and whole-spread reading summary generator (50 tests in `tarotEngine.test.ts`).

## Boundary & Risk

**Over-formalization vs. Intuitive Ambiguity.** Tarot relies on associative projection and symbolism. A system attempting to force every occult nuance into rigid enums destroys the practice. The boundary is absolute: **The DSL describes topology and geometry, never fixed doctrinal interpretations.** Card meanings remain in the domain of the deck creator and the reader.

**Second Risk (Community Perception):** A technical data format can be perceived as cold reductionism. Positioning is key: This is a **notation system** (like sheet music in musical composition), not a replacement for human intuition.

## Prior Art & Open Source Landscape

- **Tarotsmith Spread Schema (`tarotschema/codex`):** Provides a schema.org `DefinedTermSet` for spread texts, but lacks relational topology, geometric layering, deck contracts, and dynamic edge tension calculations.
- **metabismuth/tarot-json & Deckaura:** Cataloged the 78 Rider-Waite-Smith cards into clean JSON — the card catalog layer is solved.
- **Tarot MCP Servers (`tarotoo`, `deckaura`, `fzlzjerry`, `OracleBone`):** Expose tool-calling for LLMs, but lack graph topology to pass relational tension to models.
- **Cybertarot & Commercial Apps:** Hardcode spreads into rigid UI arrays without an open exchange standard.

**The Gap:** An open, vendor-independent graph notation for spreads that empowers indie deck creators, game designers, and AI pipelines alike.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 1.0 Universal / Public Domain. — Félix, Berlin · github.com/felixinberlin
