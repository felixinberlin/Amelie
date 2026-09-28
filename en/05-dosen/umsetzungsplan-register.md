---
status: Available
delivery_method: E-Mail
target_maker: DENEFF e.V.
review_score: 25/35
architecture_tier: Tier 1
source_type: Type A
---
# Implementation Plan Register

*(German: Umsetzungsplan-Register)*

**One sentence:** An open, dated register of the implementation plans that companies must publish under § 9 EnEfG (German Energy Efficiency Act). Its core is a deterministic checker against the 7 mandatory fields of the BAFA guidance note that never says "overdue" or "violation", only "found" or "no plan found (as of, search path)".

**As of:** 28 September 2026 · **Recheck by:** September 2027
**Recipient:** **DENEFF e.V. (German Business Initiative for Energy Efficiency), Christian Noll, managing board member.** DENEFF has an efficiency-policy mandate and pushes back against watering down the EnEfG amendment. Noll is only named as author of the amendment explainer of 7 July 2026 on deneff.org. **Contact person unverified: verify name, role and address on deneff.org before sending.** · secondary: Umweltinstitut München (Dr. Leonard Burtscher, author of the EnEfG note of 17 July 2024, current role **not checked**, **verify before sending**).
**Verdict:** 🔨 **build the skeleton first, then gift.** The recipient has so far argued with model calculations and has no software arm. The gift only becomes usable once schema, checker and three real plans as fixtures are in the scaffolding.
**Review:** 25/35 · Tier 1 (core) / Tier 2 (register) · Type A, legal texts and three plans read (details: `06-suche/amelie-classification-log.md`, disclosure round 28.09.2026)
**Status:** packed, not delivered. No mail created.

---

## The problem

Companies with high energy consumption must, within three months of an energy audit, draw up and publish implementation plans for the economically viable measures (§ 9 EnEfG, draft BT-Drs. 21/8027 of 16 Sep 2026). The plans are scattered across company websites or annual reports. Neither the EED nor the EnEfG names a collector, and a German and English search found no aggregator, only consultancy explainers and model calculations (Fraunhofer ISI brief for DENEFF, Umweltinstitut ~54 TWh shortfall, not derived from plan data). The gap sentence: **thousands of companies must say publicly which economic savings measures are still open, but nobody counts how many stay on the shelf.**

**Who suffers:** efficiency and environmental groups such as DENEFF, who argue with model calculations rather than plan data in the ongoing legislative process. Also journalists and researchers who want to check whether the duty works. Plans already disappear: the Diakonie Stetten plan returns 404 after just over a year.

## Why now

1. **The debate is live.** First reading of the government draft on 24 Sep 2026. The Bundesrat asks to delete the publication duty (opinion no. 25, "cutting red tape"); the government's counter-statement keeps the publication.
2. **A de facto standard format exists.** The BAFA guidance note prescribes 7 mandatory fields with a model example (priority, measure name, investment volume, timeframe, origin, responsible function, status ∈ {Open, In progress, Completed}). The plans read from Sanofi-Aventis Deutschland (11/2025) and VON ARDENNE (7 Apr 2025) adopt the 7 columns verbatim. A closed status vocabulary makes the core deterministically checkable without any model.
3. **Whoever archives now secures the vintage.** Links rot, and the plan must be updated yearly, so a time series emerges ("how many 'Open' become 'Completed'?").
4. **The dose holds under old and new § 9.** Waiting for the Bundestag vote is not needed. The schema carries a field `rechtsstand` (old / new version).

## Sketch

- **Input:** one published plan per company and plan date, transcribed by hand from the PDF or web page into the 7-field schema. Plus source URL, retrieval date and an archive snapshot against link rot. For plans not found, date and search path are recorded (which pages, which search terms, on which day).
- **Logic:** `pruefeUmsetzungsplan()` is deterministic and runs without network or model. It checks that all 7 mandatory fields are present, that the status is in the vocabulary, that the timeframe is parseable and the investment volume numeric. It returns the status distribution and the investment total of open measures. Every finding carries a rule ID and is **phrased as a question**.
- **Schema version:** the schema is **versioned against the currently valid guidance-note edition** (field `merkblattFassung`). The edition read was 02/2025 (as of 12 Feb 2025, copy on visalvis.de). Per search snippets newer editions of 10/2025 and 05/2026 exist that are **not read**. Until the valid edition is read on bafa.de, the schema carries `provisional`.
- **Output:** a static CSV/JSON table per company × plan date with only two statuses: **"found"** or **"no plan found (as of: date, search path)"**. The tool **never says "overdue", "violation" or "missing"**. The reason: the duty is conditional. The consumption threshold (2.77 to < 23.6 GWh) is not known from outside, companies with an energy or environmental management system are exempt (§ 9(6)), trade secrets may be redacted (para. 5), and the deadline runs from the audit, whose date nobody sees from outside.
- **Aggregate, not ranking:** output only as "N plans found, of which M measures open, investment volume of open measures" and as individual evidence. **No ranking and no sorting by company or volume.** The table would otherwise be a lead list for contractors and energy service companies.
- **Selection note at the head of every analysis:** those who publish are the diligent ones. The implementation rate of plans found is an upper-bound tendency of the disciplined, not an industry measure.
- **Denominator:** there is no list of obliged companies. The Bundestag paper estimates about **16,461 obliged companies after the amendment** (before: ~24,855). That is an official estimate and is only cited as such, never used to compute a rate of plans found against it.
- **Register core:** two statuses, source, retrieval date and archive snapshot are taken over from `src/engine/vernichtungs-offenlegungsregister/`, not reinvented.

**Not included:** no rating of companies, no ranking, no pillory, no rate against the estimate, no list of obliged companies. No energy quantities: the plans contain **neither MWh/a nor net present value**, so a savings total cannot be formed. No permanent crawler, no server, no database (one yearly run by the curator is enough). No legal advice.

## First step

**Ticket 01: schema from the BAFA guidance note, one checker, three real plans.** Build `umsetzungsplan-schema.json` from the 7 mandatory fields and the status vocabulary, plus a deterministic TypeScript checker `pruefeUmsetzungsplan(plan)`.

**Precondition:** read the **currently valid** guidance-note edition on bafa.de and derive the schema from it. If it is unreachable, the schema carries `"status": "provisional"`, names edition 02/2025 as its source and notes editions 10/2025 and 05/2026 as unread.

**Done when:**
- a Vitest suite with at least 15 cases is green (complete plan, missing mandatory field, status outside the vocabulary, timeframe not parseable, investment volume not numeric, plan without a table like SWU with fields `unknown`, legal status old / new);
- three fixtures are transcribed by hand (Muster GmbH from the guidance note, Sanofi-Aventis 11/2025, VON ARDENNE 04/2025), each with source URL and retrieval date;
- a test ensures no output contains "säumig", "Verstoß" or "violation", that missing plans only appear as "no plan found" with date and search path, and that no output ranks by company or forms a rate against the 16,461 estimate;
- every analysis carries the selection note at its head;
- the schema states its status and guidance-note edition (`provisional` or `checked against guidance note <edition> on …`);
- every finding carries a rule ID and a plain-language question (De/En);
- everything lives under `07-demos/umsetzungsplan-register/` (Rule 4).

## Where it breaks

**A rate from plans found is read as an industry rate.** The register only sees who publishes, that is, the diligent. The duty is conditional, a denominator is missing, and "no plan found" next to a company name reads like an accusation. The remedy is in the architecture: only the two neutral statuses, output only as "N plans found, of which M measures open", a fixed selection note in every analysis, no ranking, no rate against the estimate.

**Second: the lead-list reading.** Open economic measures with investment volume per company are also a sales list for contractors. The data are mandatory publications, so that is no reason to discard the idea. Neutral presentation without ranking and without company sorting is the remedy.

**Third: the law can move.** The Bundesrat asks to delete the publication duty. The risk is capped: **EED Art. 11(2) third subparagraph** requires that action plans and the implementation rate of recommendations be listed in the company's annual report and made publicly available. Deletion would violate Union law, though it could mean fewer plans in practice. The guidance note can also drift (format drift), hence the versioning, and BAFA or BfEE could build their own register. The checker stays useful for companies and BAFA spot checks (§ 18 new version) either way.

**Disclosed openly:**
- **The guidance note read was 02/2025.** Editions 10/2025 and 05/2026 are known from snippets only.
- **The denominator is an official estimate**, not a list.
- **The contact persons are unverified** (Noll only as the author of an explainer page, Burtscher as of 2024).
- **Heterogeneous outliers:** SWU delivers a two-page explainer without a standard table.

## Who has already tried this

**Research 28 Sep 2026 (disclosure round, triple find by all three engines, 6 counter-searches by the reviewer in German and English, legal texts and three plans read in full).**

- **No aggregator of the published plans found.** Searched at DENEFF, Fraunhofer ISI, Umweltinstitut, BfEE and for EED Art. 11 trackers. Found only consultancy explainers, the Fraunhofer ISI brief for DENEFF, the Umweltinstitut model calculation (criticises, does not collect) and two 2025 Springer papers on **non-public** audit data of the energy agencies.
- **The norm names no collector.** EED Art. 11(3) only provides an authority platform for consumption data, not for the plans. The word "Unternehmensregister" (company register) appears in BT-Drs. 21/8027 only as a statistics source. Snippets claiming publication in the Unternehmensregister (energieundrecht.com, twobirds, Grant Thornton/DQS) are refuted by the primary text and probably describe the ministerial draft.
- **Premise confirmed:** at least 10 plans via exact-title search (snippets); Sanofi-Aventis and VON ARDENNE read in full.
- **Neighbour in the collection:** `vernichtungs-offenlegungsregister` (same pattern, different regime, different recipient). This dose is not a building block of it, but reuses its register core.

**Remaining gap:** an open, dated register of published § 9 implementation plans with a deterministic checker against the 7 mandatory fields, neutral status and selection note.

## Prior art

- BT-Drs. 21/8027 of 16 Sep 2026 (government draft of the EnEfG amendment, PDF, 118 pp., dserver.bundestag.de), § 9 new version, § 18, § 19(1) no. 2, Bundesrat opinion no. 25 and counter-statement
- Directive (EU) 2023/1791 (EED), Art. 11(2) third subparagraph and (3): https://eur-lex.europa.eu/eli/dir/2023/1791/oj (read via publications.europa.eu, CELEX 32023L1791)
- BAFA guidance note on the EnEfG (7 mandatory fields, model example), **read as of 12 Feb 2025** (copy on visalvis.de); **read the current edition on bafa.de before Ticket 01**
- Implementation plans as fixtures: Sanofi-Aventis Deutschland (11/2025), VON ARDENNE (7 Apr 2025), Muster GmbH from the guidance note (find full URLs before use)
- DENEFF explainer on the amendment of 7 Jul 2026 (deneff.org), Umweltinstitut München EnEfG note of 17 Jul 2024
- DIN EN 17463 (definition of economic viability)
- Origin: triple find of the disclosure round (idea round, bisociation, inversion). Atlas pattern: "disclosure duty without register → register free", here with the extra question "does a higher norm cap the duty?".
- The dose online: https://felixinberlin.github.io/Amelie/#dose=umsetzungsplan-register

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
