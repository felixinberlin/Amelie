# Amélie — Matrix: Idea → Recipient

For every idea from `ideas-neue-projekte.md`: who benefits, why specifically them, through which channel, and with what pitch.

**Verdict legend:** 🎁 give away · 🔨 build a skeleton first, then give away · 🔒 keep
**Status** to maintain: `found → packed → delivered → response → built`

> Rule from the manifest: bare ideas go to companies, research, funding bodies, and communities. To individual open-source maintainers only **with code**.

---

## 1. Agent & MCP tooling

### git-archaeologist (MCP) — M · 🔨

**Who benefits:** any team with a codebase older than half the people working on it. And especially: every AI coding tool whose biggest weakness is missing history. An agent that can read `blame → PR → issue → discussion` as one chain stops inventing intentions.

**Recipients:**
- **GitLens / GitKraken** (maintainer: Eric Amodio, `@eamodio`) — GitLens has surfaced blame for years; exposing history as an MCP tool server is the obvious next step they haven't taken yet. A company, so no code obligation.
- **Sourcegraph** — code intelligence is their thesis, history is their blind spot.
- **MCP registries** (official registry, PulseMCP, Smithery) as a distribution path, if you build it yourself.

**Channel:** GitHub Discussion in the `gitkraken/vscode-gitlens` repo (a company, not an unpaid solo maintainer) + in parallel a Show HN, if a prototype exists.

**Hook:** "Your agent guesses why the code looks the way it does. The answer exists — it's just scattered across blame, a PR, an issue, and a Slack thread, and nobody has ever chained them together."

**Why 🔨:** an MCP server that just wraps `git log` is a weekend. Only with the skeleton does the idea become real for others.

---

### Spec-Drift Detector — M · 🔒 (keep) + spread the idea anyway

**Who benefits:** the entire spec-driven-development movement, which is currently missing its immune system: specs get written, implementations drift away, nobody notices until an agent builds something wrong based on the stale spec.

**Recipients:**
- **Tessl** (Guy Podjarny) — "spec as source" is their entire product. Drift detection is the missing half; they have the framework and the registry, but not the CI check that *hard*-fails on divergence. They run a podcast and actively look for takes on the topic — an open door.
- **GitHub Spec Kit** — an open-source toolkit from GitHub (a company, not a solo maintainer), discussions open, exactly this problem space.
- **Optic / OpenAPI ecosystem** — they do drift detection for APIs; generalizing to prose specs is their adjacent market.

**Channel:** a discussion in the `github/spec-kit` repo (public, visible, costs nobody any nerves) + an email/podcast pitch to Tessl.

**Hook:** "Spec-driven development has no immune system. Nothing in the build notices when the implementation drifts from the spec — and from that moment on, the agent reliably builds the wrong thing, with a rationale attached."

**Why 🔒:** you have this problem for real, across several repos (`recipes`, OCR, tortilla-*). This is the candidate with the fastest self-interest payoff. Making the idea public costs you nothing — it will get built by several parties regardless.

---

### Agent Postmortem Recorder — S · 🔨

**Who benefits:** anyone using Claude Code seriously, especially in multi-agent setups like yours. The existing observability scene shows you *that* something went wrong (OTel traces, hook-event dashboards) — but nobody delivers the consequence: the concrete `CLAUDE.md` patch for the misunderstanding class that's statistically costing the most.

**Recipients:**
- **The Claude Code plugin/skill community** — the cheapest distribution path there is: publish as a plugin, done.
- **Existing hook-observability projects** (e.g. `claude-code-multi-agent-observability`) — as a PR, not a wish.
- **Anthropic DevRel** — feature feedback is welcome, and "agent postmortem" is a category they haven't staked out themselves yet.

**Channel:** build it (a weekend), publish, list it in the relevant directories. For this one, building *is* the giving away.

**Hook:** "Agent observability tells you the session went wrong. It doesn't tell you which three lines were missing from CLAUDE.md — even though that's exactly what's in the logs."

---

### Diffgeist — S · 🎁

**Who benefits:** everyone who should be reading dependency release notes and doesn't. The trick is personalization: not "React 20 changes X," but "React 20 changes X, and you use X in four places — here they are."

**Recipients:**
- **Andrew Nesbitt / Ecosyste.ms** — building the open data layer over package ecosystems, writes about downstream testing, FOSDEM speaker. He has the data that makes this idea cheap in the first place, and he's reachable via blog/Mastodon. The idea fits into his existing program instead of adding work on top.
- **Renovate / Mend** — Renovate opens the PRs; a personalized changelog *inside* the PR body is a pure addition to their product.
- **Socket.dev** — already analyzes what an update actually changes.

**Channel:** email to Nesbitt (short, one page attached) + a feature discussion at Renovate (a company).

**Hook:** "Release notes are written for everyone. Only the part your code actually calls is interesting — and today that can be computed for a few cents per repo."

---

### Home-Network MCP — S · 🔨

**Who benefits:** Home Assistant already has MCP in both directions — but routers, DNS, and networking are the unoccupied part. "Who's on the network," "blocklist on/off," "who's hogging the bandwidth," via chat instead of the Fritzbox web UI, is a weekend project with an immediate audience.

**Recipients:**
- **Home Assistant / Open Home Foundation** (Paulus Schoutsen) — community forum and integrations ecosystem; a custom integration is the natural home.
- **Pi-hole community** — toggling DNS blocklists is their core business.
- **AVM/Fritzbox tinkering scene** (IPPF, Home Assistant forum) — they've already done the API work, only the tool-server layer is missing.

**Channel:** build it, then list it in MCP registries and show it in the HA forum. Without code, it's just one wish among a thousand in the HA ecosystem.

**Hook:** "Your agent can explain the light, but not who's currently hogging your network."

---

## 2. Physics toys

### Wet Ink — M · 🔒 (keep) + give away the plan

**Who benefits:** nobody in the short term except you — and that's fine, that's your "prettiest thing." The *plan*, on the other hand, is immediately valuable to others: a fully worked-out roadmap with a CPU reference implementation, visual regression tests, and an honest SVG warning doesn't exist anywhere else.

**Recipients (for the plan, not the product):**
- **Escape Motions (Rebelle)** — do real fluid-watercolor simulation in the desktop space, version 8.3 is current. A WebGL2 variant with Kubelka-Munk isn't competition, it's a demonstration that this works in the browser.
- **The calligraphy/sumi community and the WebGL demoscene** — Shadertoy, Observable, CodePen: currency there.
- **Teaching:** the plan is a better seminar project than anything usually assigned in graphics courses — including the GPU-vs-CPU testing methodology.

**Channel:** publish `wet-ink-plan.md` as a public blog post/gist once P2 (feathering) is running and you have a GIF. The GIF is the distributor.

**Hook:** "Twelve days, one physics, no three.js. Here's the complete plan, including the exact spot where it's guaranteed to look like smoke instead of ink."

---

### Altbau Thermal — L · 🎁 ← **strongest gift candidate on the whole list**

**Who benefits:** everyone currently trying to understand Berlin's building stock from an energy standpoint — and that's currently a surprisingly large, well-funded group of people.

**Recipients:**
- **co2online (nonprofit) — project "EnergyMap Berlin"**: uses AI to assess the energy condition of 360,000 Berlin buildings for municipal heat planning, and voluntarily collects consumption data from residents via "HeizCheck." Your idea is exactly their missing front end: draw a floor plan → see what the windows, radiators, and exterior wall are doing. They have data and budget, but no tangible resident-facing tool. **This is the one email you should write this week.**
- **Verbraucherzentrale Berlin / Verbraucherzentrale energy consulting** — offer free energy consulting including a building check. Consulting explains in numbers what a simulation shows in ten seconds. They're looking for communication tools, not another brochure.
- **Prototype Fund** — applications from October 1, 2026, open source, public interest. Fits the scope literally.
- **Tenant initiatives & the Berlin Tenants' Association** — for the argumentation side ("the wall is the problem, not my ventilation habits").

**Channel:** direct email to co2online (EnergyMap project team) with the one-page template; Verbraucherzentrale Berlin in parallel. Prototype Fund as a pointer to both ("if you're looking for someone to build this — here's the fund").

**Hook:** "You calculate the condition of 360,000 buildings. The people living inside them see one number from that. A floor plan you draw yourself, and a curve that honestly shows what a tilted window costs in a pre-war building — that's the same physics, just something you can actually look at."

---

### Pin Tumbler — M · 🎁

**Who benefits:** the locksport scene teaches feel; a simulator teaches the *model* before you have the feel. Pins, springs, tolerances, binding order — exactly the part beginners spend weeks feeling around blindly for.

**Recipients:**
- **SSDeV — Sportsfreunde der Sperrtechnik Deutschland e.V.**, with its own **Berlin chapter** and wiki. The largest organized lockpicking association in the German-speaking world, explicitly focused on knowledge transfer. A community with time and interest: the perfect recipient type.
- **TOOOL** (NL/US) — the same role internationally.
- **CCC / Congress workshops** — lock mechanics have always been on the program there; a simulator as a workshop add-on distributes itself.
- **Locksmithing apprenticeships** — the unexpected market: apprentices currently learn cylinders from plexiglass cutaway models.

**Channel:** SSDeV Berlin chapter (regulars' meetup), in person or via `wiki.ssdev.org`; propose a workshop at the next Congress.

**Hook:** "You teach people the feel. The model behind it — tolerances, binding order, why one pin sets first — is only visible once you can simulate it. Haptics via phone vibration is close enough to actually teach."

---

### Räucher-Sim (Smoke Sim) — S · 🎁 via publishing

**Who benefits:** nobody with a budget. This isn't a product, it's a gift to strangers on the internet — and there's a whole functioning culture for exactly that (web toys with no goal, no score, no account).

**Recipients:**
- **The web-toy public** — collections in the vein of neal.fun, Shadertoy, CodePen. Distribution is the entire mechanism.
- **Children's and science museums, exhibition builders** — a smoke sim that reacts to breath is a ready-made installation for little money. Berlin: Futurium, Spectrum/Technikmuseum.
- **Meditation/mindfulness apps** — offered license-free as a background scene.

**Channel:** build it (a weekend), post the link, source code MIT. No pitch needed.

**Hook:** none needed — the thing is its own pitch.

---

### Kristallwachstum 3D (Crystal Growth 3D) — M · 🎁

**Who benefits:** the generative-design scene needs new generators, and DLA in 3D space with live parameters and GLB export is a generator that leads directly to a printable file. Every run a one-of-a-kind piece.

**Recipients:**
- **Nervous System** (Jessica Rosenkrantz & Jesse Louis-Rosenberg) — have done nothing but generative design → 3D printing since 2007, from jewelry to lungs. They're the natural, reachable addressee.
- **Prusa / Printables community** — generator projects with seed sharing are gold there; competitions run regularly.
- **Mineralogy education** — DLA explains dendritic growth better than any illustration. TU Berlin, Museum für Naturkunde.

**Channel:** Nervous System directly (contact form/Instagram, they reply to substance); in parallel as a Printables project with a seed gallery.

**Hook:** "Diffusion-limited aggregation in 3D space, live parameters, export as GLB. Every seed an object you can print — and the parameters are the actual artwork."

---

## 3. Berlin / everyday life

### Sperrmüll-Radar (Bulky-Waste Radar) — M · 🎁 ← the purest Amélie idea on the list

**Who benefits:** "free to take" is a Berlin protocol without a protocol. 12-hour half-life, no account, no ownership — the technical version doesn't exist because nobody makes money from it. Exactly why it belongs in public hands or a community.

**Recipients:**
- **CityLAB Berlin (Technologiestiftung Berlin)** — builds prototypes for the city, runs a summer conference as a point of contact, operates a path into administration via the GovTech TestLAB. The ideal recipient: publicly funded, looking for topics.
- **BSR** (Berlin's sanitation authority) — already runs bulky-waste pickups in the districts; a map showing what's currently at the curb lowers their costs and extends product lifespans.
- **OpenStreetMap Berlin** (Hack Weekend) — a community with exactly the right understanding of decaying geo-pins.
- **Prototype Fund** — from October, open source, public interest.
- **Zero-waste/repair-café scene, nebenan.de** — distribution and user base.

**Channel:** CityLAB first (they know everyone else). One-pager plus an explicit note on the 12-hour decay logic as a privacy feature.

**Hook:** "Berlin has a functioning giveaway protocol without a single server: a box, a curb, a sign. The only missing piece is knowing where one is standing right now — and that needs no accounts, just pins with a half-life."

---

### Commute Oracle — M · 🔨

**Who benefits:** everyone who doesn't need the official ETA, but their own. The official info knows the timetable; it doesn't know how long *you* take to reach the platform, which exit you use, or that you never catch the 9:04 pm.

**Recipients:**
- **Jannis Redmann (`derhuerst`)** — runs the open Berlin transit ecosystem (`vbb-rest`, `bvg-rest`, `vbb-gtfs`, transport.rest). Without these APIs the idea is expensive, with them it's a weekend. **But:** a solo maintainer → approach only with code, never as a feature request.
- **Träwelling community** — already voluntarily logs their trips. The dataset the model would learn from already exists there.
- **Transitous / MOTIS** — open routing infrastructure, looking for use cases.

**Channel:** build a small working thing on top of `vbb-rest`, then show it in the community. The prototype is the ticket in.

**Hook:** "The official ETA knows the timetable. It doesn't know that you need seven minutes to the stop and that the north exit is closed. Thirty of your own trips are enough for a model to know that."

---

### Kiez-Lärmkarte (Neighborhood Noise Map) — L · 🎁

**Who benefits:** everyone looking for a flat in Berlin or trying to substantiate a noise complaint — and the research that's been refining exactly this methodology for years. Privacy-first (only dB levels, never audio, local aggregation) isn't a nice-to-have, it's the condition for existing at all.

**Recipients:**
- **Noise-Planet / NoiseCapture** (Université Gustave Eiffel + CNRS, open source on GitHub) — run worldwide crowdsourced noise maps with exactly this architecture. Your contribution would be the quiet-window perspective ("when is this street quiet") instead of the average map. Research = the ideal recipient for a bare idea.
- **Senate Department for the Environment / Berlin noise action plan** — work with models and averages; measured quiet windows are complementary, not competing.
- **Prototype Fund** — from October.
- **Resident and tenant initiatives** — the actual users.

**Channel:** email to the NoiseCapture group (research, in English, one paragraph of methodology is enough) + CityLAB for the Berlin variant.

**Hook:** "Noise action plans deliver yearly averages. People are looking for something else: the time window in which this street is quiet. Same sensors, different question — without storing a single audio recording."

---

## 4. The esoteric corner, but as software

### Tarot as a state machine — M · 🎁 as a specification

**Who benefits:** the appeal isn't the interpretation, it's the insight that **a spread is already a program** — typed state transitions, positions as slots, meaning as a function of adjacency. That interests two very different groups at once.

**Recipients:**
- **Labyrinthos** — a tarot learning app with its own deck and a didactic bent; a formal notation for spreads is exactly their teaching problem.
- **Indie game devs** — deckbuilder engines are looking for card-as-rule representations. A small DSL is immediately usable there.
- **Deck artists on Kickstarter** — need digital companions but can't code; an open spread-DSL plus renderer is a gift to an entire milieu.
- **Teaching:** "state machines for people who don't do computer science" — tarot turns out to be a surprisingly good didactic example.

**Channel:** publish the DSL spec (one page of JSON schema plus two examples) publicly, spread it in r/tarot and indie-dev circles. The spec is the gift, not the app.

**Hook:** "A spread is already a program — it just was never written down that way. Positions are slots, cards are typed transitions, the animation falls out of the structure."

---

### Dream journal with a motif map — M · 🔨

**Who benefits:** the market is full of dream apps that ship everything to the cloud and promise interpretation. None promises the opposite: entries embedded locally, recurring motifs as clusters over time, **nothing leaves the device**. That's the feature, and it's a privacy argument, not a marketing line.

**Recipients:**
- **Obsidian plugin ecosystem** — the cheapest path: no product of your own, a plugin instead. The user base is already local-first by inclination.
- **Local-first scene** (Ink & Switch and its orbit) — looking for convincing end-user examples; "the most sensitive data imaginable, still useful" is one.
- **Sleep research / lucid-dreaming community** — motif frequency over time is a real research interest that usually fails on privacy grounds.

**Channel:** build it as an Obsidian plugin, show it in the Obsidian forum. Without an artifact it's just one more app idea.

**Hook:** "Every dream app promises interpretation. This one promises that the dreams never leave the device — and still delivers the motif map, because the embeddings run locally."

**Caution:** sensitive data. If you give this away, give away the privacy architecture with it, or someone builds the opposite under your name.

---

### True randomness as a service — S/Hardware · 🎁

**Who benefits:** the TRNG hardware already exists and is affordable; what's missing is the bridge into the agent era. An MCP server between a noise diode and a model is thirty lines of code — and after that, every dice, sigil, or card-draw app pulls from physical noise instead of `Math.random()`.

**Recipients:**
- **Infinite Noise TRNG** (`waywardgeek/infnoise`, distributed via leetronics in Germany, Crowd Supply history) — finished, open hardware. An MCP wrapper extends their reach without creating work for them. **Approach with code** (a small repo that uses their hardware).
- **Crowd Supply/Hackaday public** — this kind of thing distributes itself there.
- **Cryptography education** — "touching entropy" makes a good lab exercise.
- **Its own neighbor ideas** — the tarot DSL and dice toys are the first consumers. A gift that serves other gifts.

**Channel:** build the MCP server, list it in the registries, link it around the infnoise community.

**Hook:** "Between a noise diode and an agent, exactly one tool server is missing. After that, every app that uses it rolls dice with physics."

---

## 5. Meta / dev culture

### Repo Museum — M · 🎁 via building and showing

**Who benefits:** software visualization has a long history (Gource as a film, CodeCity as a city model in research), but it's never become **walkable**. Repo = room, commits = exhibits, dead branches = basement is a metaphor that's immediately understood.

**Recipients:**
- **DevRel and conference booths** — a walkable repo is a trade-show magnet; companies pay for things like this.
- **Onboarding at large teams** — "this is our house" is a better first day than an architecture diagram.
- **Gource** (Andrew Caudwell) and the **software visualization research** (the CodeCity lineage) — an academic fit exists, a paper out of this is realistic.
- **GitHub** — already had Skyline as a 3D commit gimmick once; the successor to it is unoccupied.

**Channel:** build and show a demo using a famous repo (e.g. curl or React). It distributes itself; the requests follow.

**Hook:** "Gource shows history as a film you can't change anything about. Nobody shows it as a place you walk through — with the dead branches lying in the basement."

---

### Ghost Replay for editing — M · 🎁 to research

**Who benefits:** we measure commits and keystrokes. In between lie the forty seconds of scrolling in which the decision actually gets made — and nobody measures that. It's a research question dressed up as a Trackmania gimmick.

**Recipients:**
- **HCI/software-engineering research** (CHI, VL/HCC, ICSE circles; in Germany, groups at TU/HPI focused on developer experience) — "how do developers actually move through code" is an open, publishable question, and your ghost is an immediately legible instrument. **Best recipient type for this idea: research, because you don't need to ship code.**
- **WakaTime / Codealike and successors** — measure time, not movement. A natural product extension.
- **VS Code / JetBrains DevEx teams** — companies, reachable via feature discussions.
- **Bootcamps and mentors** — the ghost shows the rhythm that code review never sees.

**Channel:** a short email to one or two HCI groups with the one-pager; in parallel, publish the idea openly so a student can pick it up as a project.

**Hook:** "We measure commits and keystrokes. The real work is the forty seconds of scrolling before that — and there's no instrument for it, even though every editor produces the data."

---

### Bugs → Spaced Repetition — S · 🔨

**Who benefits:** postmortems get written and never read again. Flashcards do get read. Symptom on the front, root cause on the back, generated automatically from the fix — after three months you know which error class is really costing you.

**Recipients:**
- **Anki ecosystem** — as an add-on plus a git hook. The largest spaced-repetition user base, an open add-on architecture.
- **Incident/postmortem tooling** (Sentry and its orbit) — they own the error data and the postmortem ritual, but no learning loop afterward. A company, so reachable without code.
- **Bootcamps and team leads** — "our top three error classes this quarter" is onboarding material nobody else has.

**Channel:** build the git hook + CLI (a weekend), the Anki add-on afterward, then show it.

**Hook:** "Every fixed bug is already a flashcard: symptom on the front, root cause on the back. It just never gets generated — even though the diff contains both."

---

## Order, if you start this week

| # | Action | Effort |
|---|---|---|
| 1 | **Altbau Thermal → co2online (EnergyMap Berlin)** — the email with the highest hit probability on the whole list | 1 h |
| 2 | **Set up the `amelie` repo**, CC0, 19 issues labeled `up-for-grabs` | 2 h |
| 3 | **Sperrmüll-Radar + Kiez-Lärmkarte → CityLAB Berlin**, one email, two one-pagers | 1 h |
| 4 | **Spec-Drift Detector → spec-kit discussion + Tessl** (spread the idea while building it yourself) | 1 h |
| 5 | **Pin Tumbler → SSDeV Berlin chapter** — no pitch, a visit to the regulars' meetup | 1 evening |
| 6 | Before October 1: finish the three Prototype-Fund-suitable one-pagers | 3 h |

---

## Status list

*As of the existence check from September 2026. All tins live in `dosen/`.*

| Idea | Verdict | Recipient #1 | Status |
|---|---|---|---|
| Altbau Thermal | 🎁 | EnergyMap consortium / UdK Berlin | **packed**, freshly retargeted |
| Sperrmüll-Radar | 🎁 | CityLAB Berlin | **packed** |
| Kiez-Lärmkarte | 🎁 | Noise-Planet / NoiseCapture | **packed** |
| Pin Tumbler | 🎁 | SSDeV Berlin | **packed**, narrowed |
| Diffgeist | 🎁 | Andrew Nesbitt (Ecosyste.ms) | **packed** |
| True Randomness as a Service | 🔨 | infnoise / leetronics | **packed** |
| Bugs → Spaced Repetition | 🔨 | Anki ecosystem | **packed** |
| Agent Postmortem Recorder | 🔨 | Claude Code plugin community | **packed**, narrowed |
| Räucher-Sim | 🎁 build | web-toy public | **packed** |
| Kristallwachstum 3D | 🎁 | Nervous System | **packed**, heavily narrowed |
| Tarot as a state machine | 🎁 spec | indie devs / schema collections | **packed**, narrowed |
| Dream journal | 🔨 | Obsidian plugin ecosystem | **packed**, narrowed |
| Ghost Replay | 🎁 | HCI research | **packed**, narrowed |
| Spec-Drift Detector | 🔒 + spread | spec-kit / Tessl | **packed**, kept |
| Wet Ink | 🔒 | plan to Escape Motions et al. | **packed**, kept |
| ~~git-archaeologist~~ | ❌ | — | **discarded** — built multiple times |
| ~~Home-Network MCP~~ | ❌ | — | **discarded** — ≥4 Fritzbox MCPs exist |
| ~~Repo Museum~~ | ❌ | — | **discarded** — already built |
| ~~Commute Oracle~~ | ❌ | — | **discarded** — commercially occupied |

**Tally:** 15 tins packed (6 of them with a narrowed premise), 2 of those kept, **4 discarded**.

Rationale for the discards and the pattern behind them: `dosen/_entsorgt.md`.

---

## Sources & as of (September 2026)

All recipients are verified, no invented contacts. Personal contact details are deliberately not listed here — get those from the respective site when you send.

- co2online / EnergyMap Berlin (AI-based heat planning, 360,000 buildings, HeizCheck): [zfk.de](https://www.zfk.de/energie/waerme/ki-tool-berliner-koennen-bei-waermeplanung-mithelfen)
- Verbraucherzentrale Berlin, free building check: [verbraucherzentrale-berlin.de](https://www.verbraucherzentrale-berlin.de/gebaeudecheck)
- Prototype Fund, round from 10/1/2026: [prototypefund.de](https://www.prototypefund.de/blog/runde-12-startet) · terms: [StartHub Hessen](https://www.starthub-hessen.de/de/services/navigator/prototype-fund-bewerbung-ab-01-oktober-2026-moglich/)
- CityLAB Berlin / Technologiestiftung, summer conference 2026: [technologiestiftung-berlin.de](https://www.technologiestiftung-berlin.de/veranstaltungen/citylab-sommerkonferenz-2026) · GovTech TestLAB: [smart-city-berlin.de](https://smart-city-berlin.de/detail-news/govtech-testlab-testlabor-fuer-die-berliner-verwaltung)
- SSDeV, Berlin chapter: [wiki.ssdev.org/wiki/Berlin](https://wiki.ssdev.org/wiki/Berlin) · [blog.ssdev.org](https://blog.ssdev.org/)
- NoiseCapture / Noise-Planet (Université Gustave Eiffel, CNRS): [noise-planet.org](https://noise-planet.org/noisecapture.html) · [GitHub](https://github.com/Universite-Gustave-Eiffel/NoiseCapture)
- Tessl, spec-driven framework & registry (Guy Podjarny): [tessl.io](https://tessl.io/blog/tessl-launches-spec-driven-framework-and-registry)
- GitHub Spec Kit: [github.com/github/spec-kit](https://github.com/github/spec-kit)
- GitLens / GitKraken (Eric Amodio): [github.com/gitkraken/vscode-gitlens](https://github.com/gitkraken/vscode-gitlens)
- Ecosyste.ms / Andrew Nesbitt, FOSDEM 2026: [nesbitt.io](https://nesbitt.io/) · [fosdem.org](https://fosdem.org/2026/schedule/speaker/andrew_nesbitt/)
- Home Assistant MCP integrations: [home-assistant.io/integrations/mcp](https://www.home-assistant.io/integrations/mcp/) · [mcp_server](https://www.home-assistant.io/integrations/mcp_server/)
- Rebelle / Escape Motions (8.3, August 2026): [cgchannel.com](https://www.cgchannel.com/2026/08/escape-motions-releases-rebelle-8/) · [escapemotions.com](https://www.escapemotions.com/products/rebelle/about)
- Nervous System (Rosenkrantz & Louis-Rosenberg, since 2007): [n-e-r-v-o-u-s.com](https://n-e-r-v-o-u-s.com/about_us.php)
- Berlin transit ecosystem (`derhuerst`): [vbb-rest](https://github.com/derhuerst/vbb-rest) · [vbb-gtfs](https://github.com/derhuerst/vbb-gtfs)
- Infinite Noise TRNG (waywardgeek / leetronics): [GitHub](https://github.com/waywardgeek/infnoise) · [Crowd Supply](https://www.crowdsupply.com/leetronics/infinite-noise-trng)
- Gource (Andrew Caudwell): [gource.io](https://gource.io/) · CodeCity (Wettel): [ACM](https://dl.acm.org/doi/10.1145/1370175.1370188)
- MCP registries, listing overview: [guide](https://tallyfy.com/how-to-list-mcp-server-registry-smithery-glama-pulsemcp/)
- Claude Code hook observability, example project: [claude-code-multi-agent-observability](https://github.com/kcwoodfield/claude-code-multi-agent-observability)
- Labyrinthos Tarot: [App Store](https://apps.apple.com/us/app/labyrinthos-tarot-reading/id1155180220)
