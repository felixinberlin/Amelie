# Glasanflug-Ampel (Bird Glass Hazard Score)

**One sentence:** A photo of a façade plus its location → an estimate of the inputs the German LAG VSW assessment scheme asks for (glass share, reflected greenery, see-throughs, glazed corners, surroundings) → a risk class with every input and its uncertainty on the page, offered as a filled-in draft rather than a verdict.

**As of:** 21 Sep 2026 · **Recheck by:** March 2027 *(shortened — the English-speaking side of this field is commercial and moves)*
**Recipient:** **LBV** (Bavarian bird conservation association), project "Vogelschlag an Glas verhindern" 2023–2027 · **owner of the scheme, always to be named:** LAG VSW (German state bird conservation authorities) · secondary: Swiss Ornithological Institute Sempach; for a North American variant: FLAP Canada, American Bird Conservancy
**Verdict:** 🎁 give away

---

## The problem

An estimated **100 million birds a year die on glass in Germany**, and **only 15–35 % of victims are ever found**. Legally everything hinges on one question: is the killing risk at this building *significantly elevated* under § 44 BNatSchG? The threshold sits at roughly **four to five collision victims per 100 m of façade per year** — German leaflets disagree on four versus five, which is why the number has to come from the scheme itself.

For the question *before* construction, Germany has had a tool since 2021: the **LAG VSW 21/01 assessment procedure**, a point system separating low, medium, high and very high risk, with rules of thumb every planner ought to know — panes under 1.5 m² are usually unproblematic, **continuous glass over 6 m² often is not**, and free-standing glass walls, see-throughs and glazed corners are the actual traps.

It exists as a PDF. That is all.

Who pays for that: the lower nature conservation authorities judging submitted plans; architects who are now expected to self-assess early (Berlin stated in **August 2026** that protection "begins at the planning stage"); building owners who get a report of dead birds and don't know which façade to fix first; and the recipient itself — the LBV awards its "bird-friendly glass" plaque via an online form plus **an inspection by trained staff on site**. That is the right final step, but as the *only* step it caps the project at as many buildings as staff can drive to.

## Why this is possible now

1. **Detecting glass is solved research.** Glass and transparency segmentation is its own dense field (City University Hong Kong's mirror-and-glass series; TransCues, WACV 2026; arXiv 2402.08571). Façade parsing — windows, storeys, bays — has been off the shelf for years (Mask R-CNN on façade imagery, arXiv 2107.10006).
2. **The reflection itself has become measurable.** The decisive factor is not *how much* glass but **what it reflects** — trees and sky are what turn a pane into a flight path. **NFGlassNet** (arXiv 2511.16887) detects glass precisely through the *contrast in reflections* between a flash and a no-flash shot. Code is promised "upon acceptance", so treat it as a building block, not a dependency.
3. **The surroundings need not be guessed.** Green space, water and tree lines are in OpenStreetMap; Berlin's tree cadastre holds some 885,000 individual trees and is openly queryable. "Vegetation within reflecting distance" becomes a query instead of an impression.
4. **And the part that was always missing is now cheap:** prose explaining *why* a façade lands in class 3. A score without a justification convinces no authority; a per-factor justification used to be consultancy work.

## Sketch

- **Input:** one to three photos per façade (direction and time of day stored, because reflection depends on both) plus a coordinate.
- **Derivation:** segment glass → share and **size of contiguous panes** per height zone → detect geometric special cases (glazed corner, see-through, free-standing pane) → classify what is reflected (sky / vegetation / built) → surroundings from OSM and tree cadastre.
- **Scoring:** a **machine-readable version of LAG VSW 21/01** — factors, point values, thresholds, verbatim. The software computes; it does not interpret.
- **Output:** one page. Photo with overlays, then every factor with its estimated value, **the origin of that estimate** (image / geodata / user) and its uncertainty. Every value editable by hand, the class recomputes. Anything the image cannot support says **"undetermined"**, not a number.

**Not included:** no product recommendations (the glass industry does that and has an interest), no certificate, no automatic § 44 verdict, no prediction of annual deaths, no blanket scoring of other people's buildings from street imagery, no published map of "dangerous houses".

## First step

**Ticket: make the scheme executable — without a single line of computer vision.**

Transcribe LAG VSW 21/01 into a rule file (YAML or JSON): every factor, every point value, every threshold, with the original wording beside it. Add a calculator that takes values by hand, and test cases from the examples in Berlin's assessment aid.

**Done when:** three buildings the LBV has already assessed by hand come out in the same risk class from manual input — **and every deviation traces back to a named input value, not to the rules.**

Deliberately the dullest possible beginning. It is useful on its own (a citable, versioned form of the scheme that any authority can reuse), and it answers, before any investment in vision, whether the scheme is even stated precisely enough to be computed.

## Where it breaks

**1. A number that sounds more certain than it is gets abused in both directions.** "Class 2, all fine" is as wrong in a developer's hands as "class 4" is as grounds for refusal. The output must be a **filled-in draft with visible inputs**, never a result. No factors shown, no class given.

**2. The photo sees the reflection once.** The same façade answers differently in the morning, in July, and from below. The flash/no-flash trick works on **a single window at two metres**, not on a 20-metre façade. So: record time and direction, allow several shots, and report reflection as undetermined rather than guessing.

**3. The evidence base will not carry precision.** Samuels et al. (PeerJ, 2022) filmed collisions at a house: **small transom windows were struck nearly as often as large glass doors**, and flight speed and approach angle predicted better than pane size. Add the 15–35 % detection rate. A score can **rank situations**; it cannot forecast deaths, and must not pretend to.

**4. The scheme does not belong to whoever codes it.** Software that "interprets" LAG VSW 21/01 splits practice into two procedures. So: verbatim mapping, scheme version printed on the sheet, and a correction path back to the LAG VSW. If they will not come along, don't build it.

**5. The path from planning aid to pillory is short.** Façades can be scored en masse from street imagery. Technically tempting, socially ruinous: owners who find an automated risk score about their building online stop cooperating. Own buildings, or buildings with a mandate. Nothing else.

## Who has tried already

**Verdict `narrowed`, not `free`** — a correction of the September 2026 judgement, which rested on a single German-language search. The calculator already exists twice, elsewhere and differently:

- **FLAP Canada, "BirdSafe DIY Building Risk Assessment App"** (`flapapp.ca`): free, browser-based, estimates daytime and nighttime collision risk **per façade** and shows which windows are worst. It is a **guided questionnaire** — the human supplies the judgement, the software computes. No image analysis, Canadian context. Alongside it, paid BirdSafe assessments with site visits.
- **LEED Pilot Credit SSpc55, "Bird Collision Deterrence"** (USGBC): a genuine score calculator with an official spreadsheet. `(Zone 1 factored area + Zone 2 factored area) / adjusted building façade area = Bird Collision Threat Rating`, target ≤ 15, Zone 1 being the first 36 ft above grade, glazed corners and fly-through conditions ≤ 25. The weights are **Material Threat Factors** from American Bird Conservancy flight-tunnel testing. The decisive difference: it scores **materials from a design**, not a situation from an image — and it is certification logic, not enforcement.
- **New York's Local Law 15 (2020)** created a compliance market, served by consultancies and material lists. Software for it: not found.
- **Germany and Switzerland:** LAG VSW 21/01 (PDF), Berlin's assessment aid, Bavarian LfU leaflets, Nuremberg 2023, and `vogelglas.vogelwarte.ch` with brochures, tested products and advisor lists. **Not one digital tool that computes the scheme.**
- **The recipient has not built it either** — but has the bottleneck: the plaque runs on an online form plus an on-site inspection by trained staff.
- **Research:** façade and glass segmentation are solved and published; nobody has applied them to bird collisions. No open-source project on building collision risk was found.
- **Adjacent, and deliberately not this:** `birdmapper.org` (Global Bird Collision Mapper) and the LBV reporting desk collect **victims**. That is the opposite direction — evidence rather than prediction — and the most interesting calibration data this idea could ask for.

**The gap that remains:** the **German scheme** as an executable, citable tool whose situational factors — glass share, reflected greenery, see-throughs, corners, surrounding vegetation — are **estimated from a photo and geodata instead of asked for**, producing a checkable sheet for the authority and the owner rather than a certification score. That is the idea. Not "a bird collision app".

## Prior work

- **LAG VSW 21/01**, "Vermeidung von Vogelverlusten an Glasscheiben — Bewertungsverfahren": `vogelschutzwarten.de/glasanflug.htm`. *Note: the PDF was not machine-readable during this research (robots.txt / 403). The point values must be copied from the original, not from leaflets — which is exactly the first ticket.*
- **Berlin**, assessment aid on collision risk at glass surfaces (SenMVKU) and the press release of 10 Aug 2026 anchoring bird protection in the planning phase.
- **LBV project** "Vogelschlag an Glas verhindern" (2023–2027): advice, reporting desk, plaque. Contact `vogelschlag@lbv.de`.
- **Swiss Ornithological Institute Sempach**, `vogelglas.vogelwarte.ch` — "Bird-friendly building with glass and light", 2017 leaflet, product testing.
- **American Bird Conservancy**, Material Threat Factors and the LEED innovation credit; USGBC SSpc55 with its calculation template.
- **FLAP Canada**, the BirdSafe app and "An Analysis of Collision Mitigation Effectiveness".
- **Vision side:** mirror-and-glass detection (CityU HK), TransCues (WACV 2026), arXiv 2402.08571, NFGlassNet (arXiv 2511.16887), façade window detection (arXiv 2107.10006).
- **Geodata:** OpenStreetMap land use, Berlin tree cadastre via Gieß den Kiez.
- **Evidence and limits:** Samuels, Fenton, Fernández-Juricic & MacDougall-Shackleton (PeerJ, 2022).

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If one day you have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
