---
status: Available
delivery_method: E-Mail
target_maker: Deutsche Umwelthilfe e.V.
review_score: 24/35
architecture_tier: Tier 1
source_type: Type A
---
# Destruction Disclosure Register

*(German: Vernichtungs-Offenlegungsregister)*

**One sentence:** An open register of the mandatory figures that large companies must publish under Art. 24 ESPR on destroyed unsold consumer products. Its core is a deterministic checker against the table format in Annex I of Implementing Regulation (EU) 2026/2 that never says "violation", only "found" or "no disclosure found (as of, search path)".

**As of:** 28 September 2026 · **Recheck by:** September 2027
**Recipient:** **Deutsche Umwelthilfe e.V. (DUH), circular economy team.** DUH campaigns against the destruction of returns and unsold goods and publicly warns of enforcement gaps in the destruction ban ("missing company lists"). **Verify the contact person before sending** (on duh.de: name, role, address). No person has been identified, and no mail goes out without verification. · secondary: Greenpeace e.V. (campaign against the destruction of goods), Changing Markets. No person identified there either.
**Verdict:** 🔨 **build the skeleton first, then gift.** The recipient has a campaign mandate but no software arm. The gift only becomes usable once schema, checker and one real disclosure as a fixture are in the scaffolding.
**Review:** 24/35 · Tier 1 (core) / Tier 2 (register) · Type A, search snippets only (details: `06-suche/amelie-classification-log.md`, ESPR round 28.09.2026)
**Status:** packed, not delivered. No mail created.

---

## The problem

Since financial year 2025, large companies that discard unsold consumer products must disclose once a year how much they discarded, why, and by which route (Art. 24 ESPR, Regulation (EU) 2024/1781). These figures appear scattered across company websites, as a standalone PDF or as a chapter in the sustainability report. A search for the exact mandatory title ("Disclosure on Discarded Unsold Consumer Products") found exactly one document, Signify's disclosure for FY 2025 dated 4 May 2026. The gap sentence: **the mandatory figures on destroyed goods sit every year on hundreds of company pages and in PDFs, but nowhere side by side.**

**Who suffers:** environmental groups such as DUH and Greenpeace, who want to show whether the destruction ban works (textiles and footwear since 19 July 2026) and have to hunt down every disclosure one by one. The Commission needs the same figures to decide on extending the ban under Art. 25.

## Why now

1. **The first vintage is appearing now.** The disclosure for FY 2025 is due within 12 months, i.e. by 31 December 2026 for calendar financial years. Until then the format is free. Whoever collects the first vintage sets the format of the debate.
2. **The mandatory format is coming, but later.** Implementing Regulation (EU) 2026/2 (OJ 10 February 2026) applies from 2 March 2027. The Annex I table format is mandatory for financial years starting on or after 2 March 2027, so for calendar financial years first for FY 2028, disclosed in 2029. That is the majority reading across six independent snippets. A minority reading (FYs from 2 March 2026) is set aside but not refuted.
3. **The why-now window is time-limited and named honestly.** For FY 2025 to 2027 (published 2026 to 2028) there will be three vintages in free, heterogeneous formats: tables, prose, CSRD chapters, PDF and HTML. LLM extraction with human confirmation can bring them into one schema, which was not feasible at reasonable cost before 2024. From disclosure year 2029 a deterministic parser is enough. **The durable core is therefore the deterministic checker against Annex I. The LLM stage is a transition module, not the heart of the tin.**

## Sketch

- **Input:** one disclosure per company and financial year, entered into the Annex I schema by hand or as an LLM suggestion confirmed by a human. Each comes with source URL, retrieval date and an archive snapshot. For missing disclosures, the date and search path are recorded (which pages, which search terms, on which day).
- **Logic:** `pruefeOffenlegung()` is deterministic and runs without network and without a model. It checks whether the percentages across treatment routes add up to 100, whether every reason comes from the list of derogations, whether CN codes are well-formed, whether units and weight per product group are plausible against each other, and whether estimates are flagged. Every finding carries a rule ID and is **phrased as a question** (e.g. "The shares add up to 92 %. Is a treatment route missing?").
- **Output:** a static CSV/JSON table per company × financial year with only two statuses: **"found"** or **"no disclosure found (as of: date, search path)"**. The output **never says "violation", "overdue" or "missing"**. The reason: the duty is conditional. It only arises if a company discards unsold goods, and "no disclosure found" may simply mean "nothing discarded".
- **Start list:** there is no list of obliged companies. The register therefore needs a **curated start list**, e.g. large clothing and footwear retailers in Germany covered by the textile ban, plus the exact-title search. The start list is published and dated. Without a denominator any rate is an assertion, so the register outputs no rates.
- **Schema status:** the Annex I schema is **`provisional`**. So far it comes only from law-firm and vendor snippets, because the legal text (IR 2026/2 Art. 2/3 and Annex I, ESPR Art. 24(1)) could not be read. The flag is only dropped once the schema has been checked field by field against the legal text.

**Not included:** no rating of companies, no ranking, no naming and shaming, no rates without a denominator. No continuously running crawler, no server, no database (one annual run by the curator is enough). No spare-part prices (the spare-part price time series is explicitly not part of this tin). No legal advice.

## First step

**Ticket 01: Annex I as a schema, one checker, one real disclosure.** Model the Annex I format of Implementing Regulation (EU) 2026/2 as a JSON Schema (`anhang1-schema.json`), plus a deterministic TypeScript checker `pruefeOffenlegung(offenlegung)`.

**Precondition:** before writing the schema, read the full legal text of IR 2026/2 (Art. 2/3, Annex I) and ESPR Art. 24(1). If it is not reachable, the schema carries `"status": "vorläufig"` (provisional) and names the snippet source for each field.

**Done when:**
- a Vitest suite with at least 15 cases is green, including: complete disclosure (0 findings), percentage sum ≠ 100, reason outside the derogation list, invalid CN code, implausible units vs. weight, missing estimate flag, prose-only disclosure without a table (passes, fields `unknown`);
- **Signify's FY 2025 disclosure** (PDF of 4 May 2026) has been transcribed by hand as the first fixture, with source URL and retrieval date;
- a test ensures that no output contains the words "Verstoß", "säumig" or "violation", and that the only status for missing disclosures is "no disclosure found" with date and search path;
- every finding carries a rule ID and a plain-language question (De/En);
- the schema states its status (`provisional` or `checked against legal text on …`);
- everything lives in the scaffolding under `07-demos/vernichtungs-offenlegungsregister/` (Rule 4).

## Where it breaks

**The register is read as a pillory, although a missing disclosure proves nothing.** The duty is conditional, and there is no list of obliged companies. A row "no disclosure found" next to a brand name still reads like an accusation, and an "implausible" flag can trigger a cease-and-desist letter. The remedy is architectural: only the two neutral statuses, findings as questions, every row with source URL, retrieval date and archive snapshot, no rates, a published start list.

**Second: curator fatigue and catch-up.** The register needs curation every year. The Commission or a compliance vendor may build its own register (precedent: the UK Modern Slavery Act, where NGOs collected first and the government later built a registry). That is why the core is the checker, not the collection. It stays useful until 2029 as a self-test for companies and is then the only parser needed.

**Disclosed openly:**
- **Evidence from search snippets only.** WebFetch on eur-lex.europa.eu returned `EGRESS_BLOCKED`. Neither the legal text nor the Signify disclosure was read in full.
- **The timeline rests on the majority reading** of law-firm snippets. Freshfields contradicts itself between two snippets.
- **The Annex I schema is provisional** until checked against the legal text.
- **No recipient person has been identified.**

## Who has already tried this

**Research 28 September 2026 (ESPR round; triple find by all three engines, 11 independent counter-searches by the reviewer in German and English), search snippets only.** Details: `06-suche/amelie-pruefprotokoll.md`, section ESPR round.

- **No aggregator found,** neither at NGOs, in journalism nor at the Commission. Searches included "ESPR Article 24 disclosure tracker", analyses by Changing Markets, EEB and Zero Waste Europe, and analyses by Greenpeace and DUH.
- **Only vendor-side compliance tools:** Flexireo, Generation Impact, Cleo Labs, Complir, Compliance & Risks. Plus explainers by law firms (Cooley 7 May 2026, Freshfields, Linklaters, Cattwyk, trade-e-bility).
- **The Commission is a data user, not a collector.** It must take the Art. 24 disclosures into account before extending the ban under Art. 25. According to the ESPR working plan 2025–2030, however, it plans no extension in the next five years, so its incentive to collect is weak in the short term.
- **Premise confirmed:** Signify N.V., "Disclosure on Discarded Unsold Consumer Products", FY 2025, standalone PDF of 4 May 2026.
- **Known pattern:** under the UK Modern Slavery Act, NGOs (Business & Human Rights Resource Centre, TISCreport) were the first to collect the scattered mandatory statements.

**Remaining gap:** an open, dated register of Art. 24 disclosures with a deterministic Annex I checker that lists missing disclosures neutrally as "no disclosure found (as of, search path)".

## Prior art

- Regulation (EU) 2024/1781 (Ecodesign for Sustainable Products, ESPR), Art. 24 (disclosure) and Art. 25 (destruction ban): https://eur-lex.europa.eu/eli/reg/2024/1781/oj (not reachable, `EGRESS_BLOCKED`)
- Implementing Regulation (EU) 2026/2, Annex I (disclosure format), OJ 10 February 2026, applies from 2 March 2027. Seen only as snippets. **Read the legal text before Ticket 01.**
- Signify N.V., "Disclosure on Discarded Unsold Consumer Products", FY 2025, PDF of 4 May 2026 (assets.signify.com, file name `20260504-signify-espr-disclosure.pdf`, snippet only; establish the full URL before use)
- Law-firm explainers (snippets): Cooley (products.cooley.com, 7 May 2026), Freshfields, Linklaters, Cattwyk, trade-e-bility; vendor: Generation Impact
- Umweltbundesamt (German Environment Agency), topic page on the destruction ban (umweltbundesamt.de, snippet only)
- DUH press release on missing company lists for the destruction ban (duh.de; mirrored at it-boltwise.de, snippet only)
- Origin: triple find in the ESPR round. Idea round ("Vernichtungs-Register"), bisociation (ESPR Art. 24 × EURING ringing recovery centre, "Offenlegungs-Sammelbuch") and inversion (OP-4, "Offenlegungsregister"). Atlas pattern: "disclosure duty without a register → register free".
- The tin online: https://felixinberlin.github.io/Amelie/#dose=vernichtungs-offenlegungsregister

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
