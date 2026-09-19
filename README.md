# Amélie

**Ideas that belong to someone else.**

A method for delivering app ideas you won't build yourself to the people who can. Named after Amélie Poulain: she finds a tin box behind a tile, spends forty years tracking down the boy it belonged to, leaves it for him in a phone booth, and disappears. She picks the recipient before she makes the gift, and she never follows up afterward.

*As of: September 2026 · Félix, Berlin · All content CC0 (Public Domain)*  
*Translations: [Deutsch (German)](./README.de.md) · [English Docs](./en/README.md) · [XLIFF Guide](./04-werkzeug/amelie-i18n-xliff.md)*

---

## Languages & Internationalization (i18n)

**English is the primary/canonical language** of the codebase, web application, and core documentation.

To maintain accessibility across communities while avoiding translation drift, Amélie uses **OASIS XLIFF (XML Localization Interchange File Format)** standard files for multilingual distribution:

- **Source Language (Default)**: English (`en`)
- **Localization Format**: XLIFF 1.2 / 2.0 (`.xlf`)
  - `src/i18n/messages.en.xlf` — Canonical translation units (source strings)
  - `src/i18n/messages.de.xlf` — German target translation units
  - `src/i18n/messages.es.xlf` — Spanish target translation units
- **Web App**: Toggle seamlessly between **English**, **Deutsch**, and **Español** in the top navigation bar.

For details on contributing translations or updating strings via CAT tools (OmegaT, Poedit, Crowdin, Lokalise), see [`04-werkzeug/amelie-i18n-xliff.md`](./04-werkzeug/amelie-i18n-xliff.md).

---

## Where to start

| If you want to … | read |
|---|---|
| know what this is about | `01-konzept/amelie-manifest.md` |
| actually do it | `03-zuordnung/amelie-zustellplan-q4-2026.md` — three ready-to-send outreach emails |
| know whether this works | `02-recherche/amelie-landschaft.md` and `…-bewegungen.md` |
| contribute ideas or code | [`CONTRIBUTING.md`](./CONTRIBUTING.md) |
| understand our growth vision | [`ROADMAP.md`](./ROADMAP.md) |
| learn how decisions are made | [`GOVERNANCE.md`](./GOVERNANCE.md) |
| read developer & software docs | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| check community guidelines | [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) |
| package an idea of your own | `04-werkzeug/amelie-vorlagen.md` |
| start a new round of ideas | `06-suche/amelie-rundenstart.md` |
| contribute or edit translations (XLIFF) | `04-werkzeug/amelie-i18n-xliff.md` |

**The next concrete step** is a single email: Altbau Thermal to the EnergyMap Berlin research consortium. Everything else is preparation, and preparation is infinitely stretchable.

---

## What's inside

### `00-quelle/` — the starting point
- **ideas-neue-projekte.md** — the original list of 19 ideas, unchanged
- **wet-ink-plan.md** — the one fully worked-out implementation plan, 12 working days

### `01-konzept/` — the principle
- **amelie-manifest.md** — five rules, the tin format, the pledge, defensive publication, the funding calendar
- **amelie-loop.md** — the practice: six steps, cadence, the budget rule, what counts as a win, when to stop

### `02-recherche/` — why it works this way and not another
- **amelie-landschaft.md** — comparable projects worldwide, eight families from YC to TDCommons, with seven findings
- **amelie-bewegungen.md** — the movements behind it: potlatch, the kula ring, Bhoodan, free software, Repair Café, dāna, and sadaqah jariyah

### `03-zuordnung/` — who gets what
- **amelie-matrix.md** — all 19 ideas with recipient, rationale, channel, hook, and status
- **amelie-zustellplan-q4-2026.md** — the first round: three researched recipients, three finished emails, order and dates

### `04-werkzeug/` — the boilerplate & tooling
- **amelie-vorlagen.md** — tin template, cold email in German and English, GitHub discussion, repo README, grant-application shorthand, checklist
- **amelie-i18n-xliff.md** — standardized XLIFF localization guide for English (canonical), German, and Spanish
- **amelie-email-howto.md** & **gmail-mcp-setup.md** — delivery dispatch instructions

### `05-dosen/` — the gifts themselves
15 finished one-pagers, each with problem, "why now," sketch, first ticket, "where it breaks," "who's already tried it," and recipient. Plus `_entsorgt.md`: the four ideas that already exist, with evidence.

### `06-suche/` — how new ideas get found and checked
- **amelie-rundenstart.md** — instructions for every round of ideas: what to read at the start, what to write at the end
- **amelie-suchplaybook.md** — search order, recipes, the occupied-territory atlas, hit rate, retro
- **amelie-pruefprotokoll.md** — every idea ever checked, one line each, with verdict and evidence
- **amelie-quellen.md** — primary sources, where to dig, and what's already been dug through

---

## The tally

**19 ideas checked.** 15 tins packed, 6 of them with a narrowed premise, and 2 kept. **4 discarded**, because they already exist.

**Where it's open:**

| Area | Result |
|---|---|
| Developer tooling in the active ecosystem | almost completely occupied |
| Beautiful demos (3D, DLA, fluid sim) | built many times over — residual value in the boring part |
| Commercially attractive consumer apps | occupied by companies |
| **Civil society, public administration, associations** | **open** |

What's open is exactly what nobody can make money from and for which no developer scene exists. That's not a limitation of the model — it's its domain, and, of all places, the one where gifts do the most good.

---

## The five rules, in short

1. **The delivery is the gift, not the find.** One hour per idea, one per check, two per recipient (the 1:2 budget ratio).
2. **Sign it, but demand nothing.** Your name under it, CC0 over it, no conditions.
3. **Deliver once, then walk away.** No following up.
4. **If nobody asked for it, give tools, not a project.** Bare ideas go only to companies, research groups, funding bodies, and associations — to unpaid solo maintainers only with working code attached.
5. **Don't turn it into an excuse.** Keep at most two ideas and actually build them. Giving things away feels productive and still isn't building.

---

## The pledge

It goes on every tin, modeled on the Open Source Seed Initiative, which prints its formula on the seed packet:

> **This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.**

That's the kula ring in three sentences: the gift moves on, it doesn't come back.
