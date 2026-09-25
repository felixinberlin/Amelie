---
name: asymmetric-inversion
description: Generates and validates novel public-good app ideas through systemic, regulatory, and architectural inversion. Discovers unbuilt tools by inverting crowded downstream pipelines upstream, turning institutional compliance models into citizen counter-tools, bridging regulatory enforcement gaps (Vollzugslücken), and replacing commercial marketplaces with ephemeral shadow-protocol commons. Grounded in Jacobi's inversion principle, Illich's convivial tools, Scott's legibility asymmetries, and Amélie's empirical playbook patterns ("Fähigkeit besetzt → Einsatzort frei", "Rechner besetzt → Eingabewerte frei"). Use this skill whenever looking for structural gaps, regulatory/civic tech opportunities, counter-tools, or unbuilt public goods — "asymmetric inversion", "Inversionssuche", "Vollzugslücke", "Gegenwerkzeug", "upstream inversion", "Regulierungslücke", "systemische Ideenfindung" — or when an Amélie round needs high-conviction civic or administrative candidate ideas.
---

# Asymmetric Inversion Protocol (AIP)

A method for discovering app ideas that belong to someone else by systematically inverting crowded commercial, institutional, and regulatory systems.

## Why this skill exists

Traditional ideation suffers from two failure modes documented in Amélie:
1. **Brainstorming Mode Collapse**: Unconstrained brainstorming gravitates toward what commercial startups or existing consumer apps already do (0 survivors out of 10 in Round 2).
2. **The "Empty Search" Illusion**: Searching directly for "App for X" returns nothing, leading to a false verdict of `frei` when the underlying function is actually already built by agencies, ad campaigns, or commercial enterprise suites.

The **Asymmetric Inversion Protocol** avoids both traps by working backward from established, highly funded, or legally mandated systems. Instead of inventing a problem from thin air, AIP locates a massive existing system (a DIN standard, an industrial recycling chain, an administrative fine schedule, or an institutional scoring model) and applies one of **Five Inversion Operators** to find the unmonetizable, unbuilt counterpart that belongs to civil society, local associations, or public research.

## State and Memory

Like `amelie-ideenrunde` and `lacunar-bisociation`, this skill separates stable methodology from cumulative state:

| State File | Location | Contents |
|---|---|---|
| `amelie-inversions-log.md` | `06-suche/` | Every inversion run: target system, operator used, generated candidates, verdicts, and round retro. |
| `amelie-pruefprotokoll.md` | `06-suche/` | Shared existence verdicts (`[method: inversion]`). |
| `amelie-suchplaybook.md` | `06-suche/` | Besetzungsatlas and search stopping rules. |
| `08-friedhof/README.md` | `08-friedhof/` | Graveyard autopsy patterns. |

If `06-suche/amelie-inversions-log.md` does not yet exist, initialize it from `assets/inversions-log.md`.

---

## The Protocol

### Step 0 · Read State & Inspect the Graveyard
1. Read the latest retro in `06-suche/amelie-inversions-log.md`. Its "Next Time" directive is your first constraint.
2. Check `06-suche/amelie-suchplaybook.md` (the Besetzungsatlas) to ensure the target field is not already marked `dicht`.
3. Check `08-friedhof/README.md`. Never reincarnate a corpse whose resurrection condition has not been met.

### Step 1 · Select a Grounded Target System
Pick a real-world system that currently possesses budget, software, or legal enforcement. The target MUST belong to one of four Anchor Classes (detailed in `references/mandate-sources.md`):
- **Class A: The Regulatory Mandate or Technical Norm** (e.g., EU Directives, DIN/EN/VDI standards, municipal statutes (*Satzungen*), administrative inspection duties (*Prüfpflichten*)).
- **Class B: The Downstream Industrial Pipe** (e.g., sorting facilities, scrap logistics, disaster response, commercial remediation).
- **Class C: The Institutional Evaluation Monopoly** (e.g., utility heat calculation, municipal noise averages, insurance damage matrices, tree inspection software).
- **Class D: The Thriving Physical Shadow Protocol** (e.g., sidewalk giveaway boxes, handwritten garden logs, bulletin boards, chalk markings, repair cafe queues).

### Step 2 · Map the Asymmetry
Decompose the target system across four structural vectors:
1. **Who pays / Who profits?** (Where is the commercial incentive concentrated?)
2. **Who carries the burden?** (Which grassroots actor, volunteer, tenant, or frontline worker absorbs the uncompensated friction?)
3. **Where does data stop?** (Where is the data locked into a 50-page PDF, a proprietary portal, or an expensive consultatory report?)
4. **What is the structural blind spot?** (What is systematically ignored because no SaaS subscription can be extracted from it?)

### Step 3 · Apply an Inversion Operator
Select exactly one of the **Five Inversion Operators** (see `references/inversion-operators.md` for definitions, recipes, and case studies):

1. **`OP-1: Temporal Inversion (Upstream Triage)`**  
   *Formula*: Move from end-of-pipe industrial processing to the point-of-decision 12–24 hours before disposal/failure.
2. **`OP-2: Asymmetric Counter-Tooling (Citizen Shield)`**  
   *Formula*: Turn the institutional evaluation algorithm or compliance standard into a citizen-facing verification and evidentiary shield.
3. **`OP-3: Layer Inversion (Input Extraction vs. Calculation)`**  
   *Formula*: When the calculation engine or scoring matrix is crowded, leave the math alone and automate the ambient measurement / sensory extraction that feeds it.
4. **`OP-4: Mandate Inversion (Die Vollzugslücke)`**  
   *Formula*: Bridge the enforcement gap between an ambitious statutory obligation and zero municipal/civic execution budget.
5. **`OP-5: Protocol Inversion (Ephemeral Commons vs. Commercial Platform)`**  
   *Formula*: Convert an extractive, account-based commercial marketplace into an auto-expiring, zero-account digital bridge for a physical ritual.

### Step 4 · The "Why Now" Verification
Every inversion candidate must state its technical trigger:
- Why was this impossible or unaffordable before 2024?
- Identify the exact commodity capability: on-device multimodal edge inference, zero-shot audio classification, WebAssembly spatial indices, zero-cloud local storage, or newly released public open geodata.
- If the idea could have been built in 2018 with OpenCV or a Python script, it fails the "Why Now" test.

### Step 5 · The Recipient Assignment (Rule 4 Check)
Identify the natural institutional home for the gift:
- **Eligible Recipients**: Municipal innovation offices (e.g., CityLAB), university research consortia, public-interest funds (e.g., Prototype Fund), non-profit associations (Vereine), or public agencies.
- **Rule 4 Guard**: Bare ideas are NEVER given to unpaid solo maintainers without working code. If the intended recipient is a solo volunteer, the candidate must either be repointed to an institution or paired with an executable skeleton/patch.

### Step 6 · Existence Check & Stopping Rules
Subject the candidate to Amélie's rigorous verification order (max 4 searches):
1. **Search Likely Recipient**: Check if the prospective recipient already built it.
2. **Search German Functional Terms**: Search what the tool *does*, not what it is called.
3. **Search English Product Terms**: Mandatory US/international search (`app`, `AI`, `tool`, current year) to catch commercial VC offerings.
4. **Search Niche / Forums**: Check specialized communities, GitHub, and academic prototypes.

**Stopping Rule**: If an existing tool/product fully covers the premise and is $\le 12$ months old $\to$ verdict `besetzt`. Do not rationalize. If it has a structural flaw (e.g., commercial paywall, account requirement) $\to$ verdict `verengt`.

### Step 7 · Log & Update
1. Append all candidates and verdicts to `06-suche/amelie-pruefprotokoll.md` tagged with `[method: inversion]`.
2. Update `06-suche/amelie-inversions-log.md` with:
   - Target System & Operator
   - Asymmetry Map
   - Generated Candidates
   - Existence Verdicts
   - Retro (*Learned / Mistake / Next Time*)

---

## Output Format to the User

Keep the summary crisp, grounded, and bilingual (English/German welcome):
1. **Target System & Applied Operator**: Name the norm, pipeline, or institutional friction and the operator used.
2. **The Inversion Thesis**: One sentence explaining the structural flip.
3. **Surviving Candidates**: For each survivor:
   - What it does and the unbuilt gap.
   - "Why now" technical enabler.
   - Assigned recipient & why they want it.
   - Existence check result & key citations.
4. **Graveyard / Kills**: Highlight any idea that died during the check and what it taught the Besetzungsatlas.
5. **Next Time Directive**: The concrete task for the next run.

---

## References

- `references/inversion-operators.md` — Detailed recipes and case studies for the five operators.
- `references/mandate-sources.md` — Guide to mining EU/DIN/municipal norms and fee schedules.
- `references/verification-rules.md` — Stopping rules, search patterns, and evidence standards.
- `assets/inversions-log.md` — State log template.
