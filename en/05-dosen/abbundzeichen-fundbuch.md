---
status: Available
delivery_method: E-Mail
target_maker: Interessengemeinschaft Bauernhaus e.V.
review_score: 26/35
architecture_tier: Tier 1
source_type: Type D
---
# Carpenters' Marks Logbook

*(German: Abbundzeichen-Fundbuch)*

**One sentence:** A sequence checker for carpenters' assembly marks: people renovating a timber-framed house enter the marks of an exposed wall, and the tool reports gaps, duplicates and foreign series as a hint or a suspicion (for example of reused timber) and stores the find in a format house historians can collect.

**As of:** 27 September 2026 · **Recheck by:** September 2027
**Recipient:** **Interessengemeinschaft Bauernhaus e.V. (IgB), house research section** (annual house researchers' meetings, farmhouse archive at Kreismuseum Syke; many IgB house researchers sit on the North-West working group for house and timber-frame research together with the state heritage offices). Contact according to a search snippet: Dr. Julia Ricker (julia.ricker@igbauernhaus.de) — **verify on igbauernhaus.de before sending (name, role, address); no verification, no mail.** · secondary (UK, separate mail): the Raking Light author who asks for sightings, or the Vernacular Architecture Group — name not established
**Verdict:** 🎁 **gift** — the association counts the renovators among its members and has house research in-house; the gift is a small tested kernel with no running costs, not a platform
**Review:** 26/35 · Tier 1 · Type D (details: `06-suche/amelie-classification-log.md`, Holz-Runde 27.09.2026, re-review)

---

## The problem

Whoever renovates a timber-framed house sees its carpenters' marks exactly once: during the few weeks when plaster and cladding are off. Almost nobody can read them — owners keep asking "what do these marks on old beams mean?" on fachwerk.de. Then the wall is plastered again.

On the other side are the few people who can read the marks. The numbering sequence reveals alterations, moved walls and timber from another frame. But collecting is done by hand: Raking Light keeps a database of 25 instances of Arabic assembly marks in England and publicly asks for sightings; *Vernacular Architecture* 49/1 (2018) calls for standardised recording.

**Who suffers:** renovators who cover up evidence without knowing it; house historians, for whom no distribution ever emerges from which alterations, reused timber or regional marking systems could be read.

## Why now

1. **Vision-language models (2025/26)** can *suggest* readings of struck or scribed marks from a raking-light photo: Roman numerals, tags and flags, red chalk. Before, this needed a building historian on site. This is untested (see "Where it breaks") and not needed for the kernel.
2. **The grammar makes noisy readings checkable.** A numbering sequence has structure: monotonic per frame or wall, one series tag per wall face. A deterministic checker notices when a reading does not fit. Model and rule together form a self-correcting record; the kernel runs without a model.
3. **Research is asking for standardisation and sightings right now** (VA 49/1, Raking Light) — so the export format has a destination.

## Sketch

- **Input:** per member its frame or wall, position, role (post, rail, brace, rafter …) and the mark in a small notation, e.g. `IIII`, `IV`, `XII^`, `VII>>` (numeral + tag type and count). `unreadable` is a state of its own, not an error.
- **Logic:** parser (mark → value, additive/subtractive notation, series) and five deterministic rules: gap, duplicate, foreign series, notation break, direction break — each with a rule ID and a plain-language reason (De/En).
- **Output:** series, findings graded `hint` or `suspicion` (**never "confirmed"**), list of unreadable marks; JSON export with the fields of the VA 49/1 recording terminology (type of mark, tool, location, series), place by default only at municipality level.
- **Later (optional):** photo → model suggests a reading → a human confirms → checker. Photo and confirmed reading are stored side by side.

**Not included:** no map of its own, no collecting database, no server (collecting and curating stays with IgB or the North-West working group), no dating, no building-archaeology findings, no exact locations.

## First step

**Ticket: One wall, one sequence, one suspicion.** A pure TypeScript kernel `pruefeZaehlfolge(bauteile)` for two marking systems: Roman with tags/series marks and plain Roman. Additive forms (`IIII`, `VIIII`) are customary among carpenters and valid.

**Done when:**
- a Vitest suite with at least 20 cases is green, including: complete wall (0 findings), missing post (gap), beam with a foreign tag (suspected reuse), `IIII` next to `IV` (notation break as a hint), unreadable mark (stays `unreadable`, breaks nothing), relocation (direction break);
- at least **one published mark register from the literature** (DSD Kulturspur, ing-hofer.de or an example from Gerner 1996) is transcribed by hand as a fixture and the result matches the published finding;
- the kernel runs as a single static page offline in the browser, with no network call and no model;
- every message carries a rule ID and a plain-language reason (De/En);
- everything lives in the scaffolding under `07-demos/abbundzeichen-fundbuch/` (Rule 4).

## Where it breaks

**Misread marks produce false "reuse" findings.** A layperson takes a hint for a building-archaeology finding, and a collection fills with noisy data. The remedy is architectural: only two grades (`hint`, `suspicion`), never a finding; the model reading is only a suggestion, the human-confirmed reading is stored next to the photo; `unreadable` counts as much as a reading; no automatic map — entries go as an export to curating house historians; location only at municipality level.

**Second: the recipient has no software arm.** That is why the gift is a single static page with tests and nothing to operate.

**Disclosed:**
- **Evidence from search snippets only.** The egress proxy of this environment blocked every page fetch; none of the sources below was read in full.
- **The model reading is untested.** Nobody has checked whether a VLM reads struck marks under raking light usefully. The kernel does not depend on it.
- **The contact is unverified** (Dr. Julia Ricker, from a single snippet).

## Who has already tried this

**Search 27 Sep 2026 (wood round; bisociation, librarian follow-up, English cross-check by the reviewer) — search snippets only.** Details: `06-suche/amelie-pruefprotokoll.md`, section Holz-Runde.

- **No tool, no database, no lay reporting route** for carpenters' marks found, in German or English. In English only papers, CAD software and carpentry calculators turned up; searching for a marks photo app only returned wood-species AI.
- **Research by hand:** Raking Light (hand-kept database, 25 instances, call for sightings); *Vernacular Architecture* 49/1 (2018) on standardised recording.
- **Outreach without recording:** Deutsche Stiftung Denkmalschutz, Kulturspur "Abbundzeichen".
- **Archive without marks:** the IgB farmhouse archive (Kreismuseum Syke) records measured surveys, not marks.
- **Documentation as consultancy work:** BLDAM Brandenburg, "Anforderungen an eine Bestandsdokumentation" (https://bldam-brandenburg.de/wp-content/uploads/2019/01/GrauesHeft-Bauforschung.pdf, snippet only).

**Remaining gap:** a tool that lets renovators turn the marks, in exactly the window when they are visible, into a checkable sequence and store the find in a format house historians can collect.

## Prior art

- *Vernacular Architecture* 49/1 (2018), "Carpenters' assembly marks in timber-framed buildings": https://www.tandfonline.com/doi/full/10.1080/03055477.2018.1523195
- Raking Light, Arabic assembly marks in medieval timber-framed buildings: https://rakinglight.co.uk/uk/arabic-assembly-marks-in-medieval-timber-framed-buildings/
- Deutsche Stiftung Denkmalschutz, Kulturspur "Abbundzeichen": https://www.denkmalschutz.de/denkmale-erhalten/kulturspur-2022/forschungsmethoden-und-spuren/abbundzeichen.html
- Gerner (ed.), *Abbundzeichen – Zimmererzeichen und Bauforschung*, Fulda 1996: https://katalog.slub-dresden.de/id/0-223434957
- Ingenieurbüro Hofer, Abbundzeichen (the sequence reveals alterations): https://www.ing-hofer.de/2019/07/27/abbundzeichen/
- Lay questions on fachwerk.de: https://www.fachwerk.de/threads/bedeutung-zeichen-auf-alten-holzbalken.285377/ · https://www.fachwerk.de/threads/schriftzeichen-auf-alten-holzbalken.286024/
- IgB house research: https://www.igbauernhaus.de/de/2-unsere-themen/hausforschung/hausforschung-in-der-igb.php · meetings: https://www.igbauernhaus.de/de/2-unsere-themen/hausforschung/hausforschertreffen.php · farmhouse archive: https://www.igbauernhaus.de/de/2-unsere-themen/hausforschung/bauernhausarchiv.php
- Origin: bisociation of carpenters' marks × lay mapping of bird dialects (wood round, researcher #2, K1).
- The tin online: https://felixinberlin.github.io/Amelie/#dose=abbundzeichen-fundbuch

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
