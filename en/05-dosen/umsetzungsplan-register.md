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

**One sentence:** An open register of the implementation plans that companies must publish under § 9 of the German Energy Efficiency Act (EnEfG, and EED Art. 11(2)) for their cost-effective energy-saving measures. Its core is a deterministic checker against the mandatory items in the BAFA guidance sheet (16 September 2026 version: five) that outputs, per plan, the status distribution and the investment volume of open measures, and never says "overdue", only "found" or "no plan found (as of, search path)".

**As of:** 28 September 2026 · **Recheck by:** September 2027
**Recipient:** **DENEFF e.V. (German Business Initiative for Energy Efficiency), Christian Noll, managing board member.** DENEFF works on efficiency policy and is opposing the watering-down of the EnEfG amendment in the current legislative process. So far it argues with model calculations and surveys, not with the published plans. Name and role appear as author on the amendment explainer on deneff.org dated 7 July 2026 [page]. **Re-verify before sending** (name, role, address on deneff.org). · secondary: Umweltinstitut München e.V., Dr. Leonard Burtscher (author of the EnEfG note of 17 July 2024; current role **not verified**, check before sending).
**Verdict:** 🔨 **build the skeleton first, then gift.** The recipient has a policy mandate but no software arm. The gift only becomes usable once schema, checker and three real plans as fixtures are in the scaffolding.
**Review:** 25/35 · Tier 1 (core) / Tier 2 (register) · Type A, legal texts and three plan PDFs read in full (details: `06-suche/amelie-classification-log.md`, disclosure round 28.09.2026)
**Status:** packed, not delivered. No mail created.

---

## The problem

Companies above a consumption threshold must, after their energy audit, draw up and **publish** an implementation plan for all energy-saving measures identified as cost-effective (§ 9 EnEfG). They are not required to carry the measures out. The plans appear scattered as PDFs on company websites or in the company report. There is no register, no list of obliged companies and nobody counting them. An exact-title search finds at least ten plans [snippet]; one of them (Diakonie Stetten) already returns 404 after little more than a year. The gap sentence: **thousands of companies must say publicly which cost-effective savings measures are still open, but nobody counts how many are left undone.**

**Who suffers:** associations such as DENEFF and Umweltinstitut that argue against the weakening of the law in the Bundestag procedure on the EnEfG amendment (first reading 24 September 2026) and have only model calculations to go on (Fraunhofer ISI short study; Umweltinstitut ~54 TWh of lost savings [snippet]). The mandatory figures that could fill the dispute with data are public, but nowhere side by side.

## Why now

1. **The amendment is being negotiated right now, and publication is up for grabs.** Government bill **BT-Drs. 21/8027 of 16 September 2026** [page]: the new § 9 applies from 2.77 to < 23.6 GWh/a, publication within three months after the audit, annual update (para. 4), plans and implementation rate "should" appear in the annual report; exemptions for trade secrets (para. 5) and for companies with an energy or environmental management system (para. 6); BAFA spot checks now also cover publication (§ 18), fines for non-publication (§ 19(1) no. 2). **No company register**: the place of publication remains the company website or annual report. Law-firm and consultant snippets claiming otherwise are refuted by the primary text (probably describing the ministerial draft).
2. **The format exists in practice.** The current BAFA EnEfG guidance sheet of 16 September 2026 [page] prescribes **five** mandatory items with a worked example: priority, measure name, investment volume (a range is allowed), time frame, status. The vocabulary {Offen, In Bearbeitung, Abgeschlossen} (open, in progress, completed) is only a may-rule. The 12 February 2025 version still listed seven items (plus origin and responsible function); they were dropped with the 7th amendment of 30 April 2026. Sanofi-Aventis Deutschland (11/2025) copies columns and status words; VON ARDENNE (7 April 2025) copies the columns but writes "geplant"/"laufend"/"abgeschlossen" [page]. The checker therefore never silently remaps foreign status words; it asks back instead.
3. **The duty is capped by EU law.** **EED (EU) 2023/1791 Art. 11(2), third subparagraph** [page]: Member States shall ensure that the action plans and the implementation rate of the recommendations are listed in the company's annual report and made publicly available. With the annual update a time series emerges: how many "open" measures become "completed"?
4. **The plans are disappearing.** Whoever secures this vintage now with archive snapshots still has it; heterogeneous outliers (e.g. SWU, a two-page explainer without the standard table) can be brought into the schema via an LLM suggestion with human confirmation. The LLM stage is a curator's aid, not the heart of the tin.

## Sketch

- **Input:** one plan per company and plan version, entered into `umsetzungsplan-schema.json` by hand or as a confirmed LLM suggestion, with source URL, retrieval date, archive snapshot and the field **`rechtsstand`** (`a. F.` = § 9 EnEfG before the amendment, `n. F.` = after the amendment). For missing plans, date and search path are recorded.
- **Logic:** `pruefeUmsetzungsplan()` is deterministic and runs without network or model. It checks that the mandatory items of the selected guidance-sheet version are present, every status comes from the vocabulary (otherwise it asks back), the time frame parses and the investment volume is numeric. It outputs the **status distribution** (open / in progress / completed) and the **investment total of open measures**. That is the key figure: every measure in the plan is cost-effective by definition (§ 9(2)), so "open" means "cost-effective but not yet implemented". Findings carry a rule ID and are phrased as questions.
- **Register core reused:** status, source, retrieval date, search record, archive snapshot, CSV export and language guard are taken from `src/engine/vernichtungs-offenlegungsregister/` (`erstelleRegister`, `registerAlsCsv`, `assertNeutraleSprache`), not reinvented.
- **Output:** a static CSV/JSON table per company × plan version with only two statuses: **"found"** or **"no plan found (as of: date, search path)"**. The output **never says "overdue", "violation" or "missing"**. The duty is conditional: the consumption threshold is not public, companies with a management system are exempt, trade secrets may be redacted, and the deadline runs from an audit whose date nobody knows.
- **No denominator, no rate:** there is no list of obliged companies. The bill estimates **about 16,461** obliged companies after the amendment (about 24,855 before) [page]. That is an official estimate, not a list. The register **never outputs a rate against this estimate**, only "N plans found, M measures of them open, open investment volume X €".
- **Selection notice, fixed at the top of every analysis:** "Those who publish are those who publish. The implementation rate of the plans found describes these plans, not the sector and not all obliged companies."
- **Schema status:** the schema is versioned by guidance-sheet edition. The default is the **16 September 2026 version** (five items, `checked against guidance sheet 16.09.2026 on 2026-09-28`); the 12 February 2025 version (seven items) stays `provisional`, as it is only known through the review.

**Not included:** **no energy quantities (MWh/a) and no net present value** — the plans read contain neither, so no savings total can be computed from them. No company ranking, no league table, no pillory; only aggregates and individual evidence with source. No rate of obliged companies. No permanent crawler, no server, no database (one annual curator run is enough). No legal or energy advice.

## First step

**Ticket 01: mandatory items as a schema, one checker, three real plans.** `umsetzungsplan-schema.json` from the BAFA mandatory items per guidance-sheet version (16.09.2026: five; 12.02.2025: seven) and the status vocabulary {Offen, In Bearbeitung, Abgeschlossen}, plus the field `rechtsstand` (`a. F.` / `n. F.`) and a deterministic TypeScript checker `pruefeUmsetzungsplan(plan)`.

**Precondition (met 28 September 2026):** the current BAFA EnEfG guidance sheet (16 September 2026) has been read; the scaffolding in `07-demos/umsetzungsplan-register/` follows it. Add a new schema version for every new edition.

**Done when:**
- a Vitest suite is green that covers at least: complete plan (0 findings), missing mandatory item, status outside the vocabulary, unparseable time frame, non-numeric investment volume, correct status distribution and "open" investment total, prose-only plan without a table (passes, fields `unbekannt`);
- three fixtures are transcribed by hand, each with source URL and retrieval date: **Muster GmbH** (worked example from the guidance sheet), **Sanofi-Aventis Deutschland 11/2025**, **VON ARDENNE 04/2025**;
- a test ensures that no output contains "säumig", "Verstoß" or "violation", that missing plans only appear as "no plan found" with date and search path, and that no output computes a rate against the number of obliged companies;
- every analysis carries the selection notice and no output ranks companies;
- the register core is imported from `src/engine/vernichtungs-offenlegungsregister/`, not copied;
- the schema states its status (`vorläufig` or `checked against guidance sheet <version> on …`);
- everything lives in the scaffolding under `07-demos/umsetzungsplan-register/` (Rule 4).

## Where it breaks

**A rate from the plans found is read as a sector rate.** The diligent are the ones who publish; a company without a visible plan may be exempt, below the threshold, or negligent — the register cannot tell. The remedy is architectural: output only "N plans found, M measures of them open", the selection notice fixed at the top of every analysis, never "overdue", no rate against the 16,461 estimate.

**Second: pillory and sales-lead readings.** A table of "open cost-effective measures + investment volume per company" is also a sales list for contractors and energy service companies. The data are mandatory publications, so that is no reason to abstain, but it is a reason for neutral presentation: no company ranking, only aggregates and individual evidence with source.

**Third: the publication duty is struck.** The **Bundesrat, in its opinion (no. 25), requests deleting the publication duty** as red-tape reduction; the federal government's counter-statement keeps publication and the three-month deadline [page]. Deletion would breach **EED Art. 11(2)** but would de facto mean fewer plans. The tin works under both the old and the new § 9; that is what the `rechtsstand` field is for.

**Disclosed openly:**
- **Schema tied to the guidance-sheet edition** (currently 16 September 2026, five items); the older 12 February 2025 edition stays `provisional`.
- **Format drift:** with third-party confirmation dropped and a new guidance sheet, the pattern may change; the schema is versioned.
- **No energy quantities:** the key figure is status distribution + investment volume, not savings in MWh.
- **Recipient person** to be re-verified before sending; Umweltinstitut contact not verified.

## Who has already tried this

**Research 28 September 2026 (disclosure round; triple find by all three engines, 6 counter-searches by the reviewer in German and English, legal texts and plans read in full).** Details: `06-suche/amelie-classification-log.md`, section Offenlegungs-Runde.

- **No aggregator of the published plans found** — not at DENEFF, Fraunhofer ISI, Umweltinstitut or BfEE, and no EED Art. 11 tracker.
- **Only consultant explainers** (Luther, IHK Hannover [page]; Grant Thornton, DQS, twobirds, energieundrecht.com [snippet], partly with an outdated ministerial-draft reading).
- **The Fraunhofer ISI short study for DENEFF** and the **Umweltinstitut model calculation (~54 TWh of lost savings)** work with models and surveys, not with plan data [snippet]. The Umweltinstitut page criticises the amendment but does not collect plans [page].
- **Two Springer papers from 2025** analyse **non-public** audit data from energy agencies [snippet], not the published plans.
- **The law names no collector.** EED Art. 11(3) only provides for an authority platform for consumption data, not for the plans [page]. BAFA runs spot checks but publishes no register.

**Remaining gap:** an open, dated register of § 9 implementation plans with a deterministic checker against the BAFA mandatory items that shows the status distribution and open investment volume and lists missing plans neutrally as "no plan found (as of, search path)".

## Prior art

- § 9 EnEfG (current version) [page]: https://www.gesetze-im-internet.de/enefg/__9.html
- Government bill for the EnEfG amendment, **BT-Drs. 21/8027** of 16 September 2026, incl. Bundesrat opinion (no. 25, deletion request) and federal government counter-statement [page]: dserver.bundestag.de/btd/21/080/2108027.pdf
- Directive (EU) 2023/1791 (EED), Art. 11(2) third subparagraph and 11(3) [page]: https://publications.europa.eu/resource/celex/32023L1791
- BAFA EnEfG guidance sheet, version of 16 September 2026 (bafa.de, section 5) [page, demo-builder 28 September 2026]; the 12 February 2025 version (copy on visalvis.de) only via the review.
- Sanofi-Aventis Deutschland, implementation plan under § 9 EnEfG (11/2025) [page]: https://www.sanofi.de/assets/dot-de/pages/docs/verantwortung/planet-care/Umsetzungsplan-EnEfg.pdf
- VON ARDENNE, implementation plan under § 9 EnEfG (7 April 2025) [page]; SWU (explainer without standard table) [page]; Diakonie Stetten (404) [snippet]
- DENEFF, "Energieeffizienzgesetz: EnEfG-Novelle 2026 erklärt" (7 July 2026) [page]: https://deneff.org/energieeffizienzgesetz-enefg-novelle-2026-erklaert/
- Umweltinstitut München, note on the EnEfG amendment [page]: https://umweltinstitut.org/energie-und-klima/meldungen/enefg-novelle/
- Register core (status, search record, snapshot, CSV, language guard): `src/engine/vernichtungs-offenlegungsregister/offenlegungsPruefer.ts`, sister tin https://felixinberlin.github.io/Amelie/#dose=vernichtungs-offenlegungsregister
- Origin: triple find in the disclosure round. Idea round (S1 "Umsetzungsplan-Register"), bisociation and inversion (OP-4, "Umsetzungsplan-Register"). Atlas pattern: "disclosure duty without a register → register free", extended by "does a higher norm cap the duty?".
- The tin online: https://felixinberlin.github.io/Amelie/#dose=umsetzungsplan-register

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
