# Amélie

**Ideas that belong to someone else.**

A method for delivering app ideas you won't build yourself to the people who can. Named after Amélie Poulain: she finds a tin box behind a tile, spends forty years tracking down the boy it belonged to, leaves it for him in a phone booth, and disappears. She picks the recipient before she makes the gift, and she never follows up afterward.

*As of: 13 October 2026 · Félix, Berlin · All content CC0 (Public Domain)*
*Website: [felixinberlin.github.io/Amelie](https://felixinberlin.github.io/Amelie/) · Translations: [Deutsch](./README.de.md) · [English docs](./en/README.md) · [XLIFF guide](./04-werkzeug/amelie-i18n-xliff.md)*

---

## What this is now

It started as a list of 19 ideas. Today it is three things:

1. **A gallery of gifts ("tins", German *Dosen*).** Each tin is a one-page dossier in German and English: problem, why now, sketch, first ticket, where it breaks, who has tried it, and a named recipient. Every tin has a page on the website, many with an interactive simulator: `https://felixinberlin.github.io/Amelie/#dose=<id>`.
2. **Runnable starting points.** 14 tins come with code and tests in `07-demos/` and `src/engine/`, so a recipient gets a working start, not just an idea.
3. **A memory that makes each search better than the last.** Every checked idea is logged with a verdict, every dead idea gets a death certificate, and every source is tracked. A team of agents and a command-line tool work on that memory.

## The tally (13 October 2026)

| | |
|---|---|
| Tins packed | **46** (5 delivered, 41 packed and waiting for a verified recipient) |
| Runnable demos | **14** (`07-demos/`) |
| Ideas checked | **470** log lines: 26 open, 130 narrowed, 124 unclear, 133 already taken, 57 other |
| Graveyard | **149** dead ideas, 74 of them because someone had already built them |
| Sources tracked | **324** (bodies, datasets, standards, funders, prizes, recipients) |

Live numbers: `npm run bib -- status` and [`AMELIE_STATUS.md`](./AMELIE_STATUS.md).

## What has been delivered

| Date | Tin | To | Outcome |
|---|---|---|---|
| 20 Sep 2026 | Altbau Thermal | EnergyMap Berlin research consortium (UdK Berlin) | no reply recorded |
| 21 Sep 2026 | Sperrmüll-Radar, Kiez-Lärmkarte | CityLAB Berlin | no reply recorded |
| 21 Sep 2026 | Kiez-Lärmkarte | Université Gustave Eiffel / CNRS (NoiseCapture) | no reply recorded |
| 22 Sep 2026 | Glasanflug-Ampel | NABU national office | standard reply with a factual correction, worked into the tin |
| 27 Sep 2026 | Arcana Schema (tarot state machine) | r/tarot moderators | asked for approval first |
| 27 Sep 2026 | ChemGefahr-Stopp | IG BAU, BG BAU, BIV (cleaning sector) | no reply; the mails overstated the tool, correction drafted ([mail 11b](./03-zuordnung/mails-q4-2026/mail-11b-korrektur.md)) |
| 28 Sep 2026 | the method itself | r/ClaudeCode showcase thread | posted |
| 9 Oct 2026 | Glasanflug-Ampel | NABU Jena (bird-collision reporter) | **positive reply** on 12 Oct |

Full texts and status: [`src/data/deliveries.ts`](./src/data/deliveries.ts) and `03-zuordnung/mails-q4-2026/`.

## Next concrete steps

- **ChemGefahr-Stopp:** decide on the one-time correction to the cleaning sector; build [ticket 04](./07-demos/chemhazard-stop/ticket-04-web-scanner-und-qr-etiketten.md) (camera scan in the browser, QR labels for refill bottles) before writing to anyone new.
- **Rule for every mail from now on:** describe only what is built and tested. The NABU Jena mail is the model.

---

## Where to start

| If you want to … | read |
|---|---|
| know what this is about | [`01-konzept/amelie-manifest.md`](./01-konzept/amelie-manifest.md) |
| browse the gifts | [the website](https://felixinberlin.github.io/Amelie/) or `05-dosen/` |
| see what was sent and how it went | [`03-zuordnung/amelie-zustellplan-q4-2026.md`](./03-zuordnung/amelie-zustellplan-q4-2026.md) |
| know whether this works | `02-recherche/amelie-landschaft.md`, `amelie-bewegungen.md`, `amelie-verwandte.md` |
| run a new round of ideas | [`06-suche/amelie-rundenstart.md`](./06-suche/amelie-rundenstart.md), agents explained for people in [`06-suche/amelie-agenten-fuer-menschen.md`](./06-suche/amelie-agenten-fuer-menschen.md) |
| check whether an idea already exists | `npm run bib -- find <words>` ([handbook](./06-suche/amelie-bibliothek-cli.md)) |
| package an idea of your own | [`04-werkzeug/amelie-vorlagen.md`](./04-werkzeug/amelie-vorlagen.md) |
| contribute ideas or code | [`CONTRIBUTING.md`](./CONTRIBUTING.md) |
| read developer docs | [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`docs/website-routing.md`](./docs/website-routing.md) |
| work on this repo as an AI agent | [`AGENTS.md`](./AGENTS.md) |
| roadmap, governance, conduct | [`ROADMAP.md`](./ROADMAP.md), [`GOVERNANCE.md`](./GOVERNANCE.md), [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) |

## Running it

```bash
npm ci
npm run dev            # website locally
npm test               # Vitest suites
npm run lint           # TypeScript + drift guards (tins ↔ data, protocol, graveyard, sources, diagrams)
npm run export:data    # regenerate public/data/*.json after changing a tin
npm run bib -- hilfe   # the memory CLI
```

A tin lives in two places: the Markdown dossier (`05-dosen/<id>.md`, `en/05-dosen/<id>.md`) and the website data (`src/data/dosen.ts`). Change both, then run `npm run export:data`. Details in [`AGENTS.md`](./AGENTS.md).

---

## What's inside

| Folder | What |
|---|---|
| `00-quelle/` | the original list of 19 ideas and the Wet Ink plan |
| `01-konzept/` | the principle: manifesto (five rules, tin format, pledge) and the loop (cadence, budget, when to stop) |
| `02-recherche/` | why it works this way: comparable projects, movements, closest relatives with contact routes, research behind each tin |
| `03-zuordnung/` | who gets what: recipient matrix, delivery plan, every mail in `mails-q4-2026/` |
| `04-werkzeug/` | templates (tin, cold email, repo README), XLIFF guide, email how-to |
| `05-dosen/` | the 46 tins (German); English in `en/05-dosen/` |
| `06-suche/` | how ideas are found and checked: check log (`amelie-pruefprotokoll.md`), search playbook, source register, funding landscape, engine logs, CLI handbooks |
| `07-demos/` | runnable scaffolding per tin: README, tickets, data, schemas |
| `08-friedhof/` | the graveyard: every dead idea with cause, killer, which search found out, and patterns across graves (data in `src/data/graeber.json`) |
| `src/` | the website (React + Vite), tin data, engines with tests |
| `skills/`, `.claude/agents/` | the discovery engines, reviewer, packer, demo builder and librarian as skills and agents |
| `scripts/` | memory CLI (`bib`), exports, drift guards, crew runner (`npm run agent`, `npm run teamrunde`) |
| `blog/` | write-ups, e.g. agent orchestration on a budget |
| `packages/` | Wet Ink packages |
| `ventures/` | the separate commercial track; `main` stays CC0 |

## How new ideas are found

Four discovery engines run in parallel on one topic: primary sources (`ideen-scout`), collision of distant frames (`bisoziations-kollider`), inversion of regulated systems (`inversions-agent`) and "what changed" (`constraint-release-agent`). Their candidates are merged, scored by an independent reviewer on eight vectors (novelty, complexity, possibility, longevity, civic SWOT, tech tree, ground truth, fun), and only "Dose Ready" ideas get packed and scaffolded. A librarian agent alone writes the shared memory. Walking the graveyard first is mandatory, so dead ideas don't come back.

**Where it's open, after 470 checks:**

| Area | Result |
|---|---|
| Developer tooling in the active ecosystem | almost completely occupied |
| Beautiful demos (3D, DLA, fluid sim) | built many times over; residual value in the boring part |
| Commercially attractive consumer apps | occupied by companies |
| EU compliance registers, memorial work, pharmacy, multiplayer games | dense, mostly already with the recipient |
| **Civil society, public administration, associations** | **open, but the recipient is missing more often than the technology** |

What's open is exactly what nobody can make money from and for which no developer scene exists. That's not a limitation of the model; it's its domain, and the one where gifts do the most good.

---

## The five rules, in short

1. **The delivery is the gift, not the find.** One hour per idea, one per check, two per recipient (the 1:2 budget ratio).
2. **Sign it, but demand nothing.** Your name under it, CC0 over it, no conditions.
3. **Deliver once, then walk away.** No following up.
4. **If nobody asked for it, give tools, not a project.** Bare ideas go only to companies, research groups, funding bodies, and associations; to unpaid solo maintainers only with working code attached.
5. **Don't turn it into an excuse.** Keep at most two ideas and actually build them. Giving things away feels productive and still isn't building.

## The pledge

It goes on every tin, modeled on the Open Source Seed Initiative, which prints its formula on the seed packet:

> **This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.**

That's the kula ring in three sentences: the gift moves on, it doesn't come back.
