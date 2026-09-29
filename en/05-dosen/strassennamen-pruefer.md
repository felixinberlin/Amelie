---
status: Available
delivery_method: E-Mail
target_maker: Surveying/geoinformation office of a city (verify person before sending)
review_score: 24/35
architecture_tier: Tier 1
source_type: Type B
---
# Street Name Checker

*(German: Straßennamen-Prüfer)*

**One sentence:** A deterministic checker that holds a proposed new street name against a municipality's street register and reports duplicates and sound-alikes as a review hint with the matching entry, never as "not permitted".

**As of:** 29 September 2026 · **Recheck by:** September 2027
**Recipient:** A person in the **surveying/geoinformation department of a city** (e.g. Frankfurt, Hannover, Düsseldorf) or a state survey office who prepares street naming. **No person identified — verify name, remit and address before sending; no verification, no mail.**
**Verdict:** 🎁 **gift** — narrowly (core 24/35): a small tested kernel with no running costs. Whether offices already check internally is not ruled out (see "Where it breaks").
**Review:** 24/35 · Tier 1 · V8 fun 2 (lookup) · details: `06-suche/amelie-classification-log.md`, Heimatgedächtnis round 29 Sep 2026

---

## The problem

When a new development area is built, dozens of streets need names. Municipal guidelines require that they cannot be confused with existing ones: Frankfurt's guide (2023) says "names that sound alike are to be avoided" and names "distinguished only by the base word". The surveying office keeps a list of proposals and checks similarity against the register by hand, following the guidelines. No tool for this was found.

**Who suffers:** Caseworkers who must search the register for every proposal; in the bad case emergency services, post and visitors when a twin slips through. The Higher Administrative Court of Baden-Württemberg (VGH Mannheim, 13 Nov 1978) upheld a renaming because of risk of confusion.

## Why now

1. **Street lists are machine-readable** (GovData datasets, OSM via Overpass), so the register can be obtained without special access.
2. **The rules are in published guidelines** (Drensteinfurt, Bornheim, Dortmund, Frankfurt 2023) and can be formalised: normalisation, base word, sound, edit distance, exception for personal names.
3. **A pure client kernel is trivial to ship today:** one static page, no data leaves the machine.

## Sketch

- **Input:** the municipality's street list (CSV/GeoJSON), one or more name proposals.
- **Logic:** normalisation (ß/ss, umlauts, case, base word -straße/-weg/-allee/-platz stripped), Cologne phonetics **as one signal among several** (unsuitable for whole addresses), edit distance, base-word duplication ("Lindenweg" vs "Lindenstraße"); exception for personal names and spatial context as a switch; every rule with an ID and plain-language reason.
- **Output:** a review hint per proposal with the matching entry (existing street, rule, guideline clause), **never "not permitted"**; the decision stays with the office and council.
- **Not included:** no field-name suggestion pool (extension stage, not ticket 01), no explanation of name origins (occupied: OSM etymology, city sign projects), no server, no legal advice.

## First step

**Ticket: one proposal, one register, one hint.** A pure TypeScript kernel `pruefeStrassenname(proposal, register, options)` using the rules of three municipal guidelines as its rule source, plus a static offline page.

**Done when:**
- a Vitest suite with at least 20 cases is green, including base-word duplication, ß/ss, umlauts, sound-alike (e.g. "Meier"/"Maier"), personal-name exception and an unremarkable name (0 hints);
- a test set of **known confusable pairs** (from guideline examples and the VGH case) is detected and a real street list (GovData or OSM Overpass) runs without an unexplained flood of hits;
- every message carries rule ID, matching entry and plain-language reason (De/En) and the word "not permitted" is never output;
- the page runs offline with no network call and everything lives in the scaffolding under `07-demos/strassennamen-pruefer/` (rule 4).

## Where it breaks

**The gate was only just reached.** Offices may already check internally: ALKIS specialist schemas or address management systems might include a similarity check; none was found, but it is not ruled out. Then the gift is at most a second opinion for small municipalities without such a schema. Second: a **flood of false alarms** from phonetics. Remedy: hints only, ranking by rule strength, adjustable thresholds, Cologne phonetics never alone.

**Disclosed:**
- Recipient person **not identified**, verify before sending.
- Evidence: guidelines read as web-fetch excerpts, counter-searches for tools (tool/software, OSM forum "find duplicate street names") without a hit; ALKIS-internal not checked.
- Fun is low (2): lookup, no play loop.

## Who has already tried this

Research 29 Sep 2026 (bisociation K8, inversion H2, reviewer check). Details: `06-suche/amelie-pruefprotokoll.md`, Heimatgedächtnis round.

- **By hand:** offices (Münster, Hildesheim, Düsseldorf, Tübingen, Bamberg, Städtetag advice) check manually against the register; no tool found (search snippets).
- **Neighbours, different gap:** explaining name origins is occupied (OSM `name:etymology:wikidata`, sign QR in Koblenz, Leipzig, Braunschweig, Hannover); not the same question.
- **No OSM tool** for duplicate street names found (OSM forum "find duplicate street names").

**Remaining gap:** an open, testable tool that reports duplicates and sound-alikes with the matching entry before the council paper is drafted.

## Funding bridge (hint only)

Who could fund ticket 01: **Prototype Fund** (class 03, per catalogue 1 Oct–30 Nov 2026, snippet, primary page not yet checked; conditions: residence in Germany, individuals/teams up to 4, fully open-source licence, public bodies and associations excluded); secondarily **mFUND** (geodata, rolling outlines, snippet) or **Civic Coding** (recipient channel, 2026 application window closed). Open in the project: compatibility of CC0 with the licence obligation. Check deadline and eligibility on the primary page before any mention. No funding tip in mails without approval.

## Prior art

- Municipal street naming guidelines: Drensteinfurt, Bornheim, Dortmund, Frankfurt am Main (guide 2023).
- VGH Mannheim, 13 Nov 1978 (renaming because of risk of confusion).
- Cologne phonetics (Wikipedia; unsuitable for whole addresses).
- Street data: GovData, OSM via Overpass.
- Origin: bisociation K8 "street name rescuer" and inversion H2 "new-development naming workshop" (Heimatgedächtnis round).
- The tin online: https://felixinberlin.github.io/Amelie/#dose=strassennamen-pruefer

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
