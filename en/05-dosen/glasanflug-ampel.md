# Glasanflug-Ampel (Bird Glass Hazard Score)

**One sentence:** Take the façade photos that German bird-collision reports already carry, compute them once — glass share, reflected greenery, see-throughs, glazed corners — and return a draft assessment under the German LAG VSW scheme, with every input and its uncertainty on the page.

**As of:** 22 Sep 2026 · **Recheck by:** March 2027
**Recipient:** **NABU Berlin, "Artenschutz am Gebäude"** (Julia Lorenz, Helen Friedlein) together with **NABU Jena** (Maximilian Schätz, upstream of the open-source Vogelschlagmelder) · **second recipient, separate context:** LBV Bavaria · **owner of the scheme, always named:** LAG VSW
**Verdict:** 🔨 **skeleton first, then give it away** — the natural home is an open-source repo maintained by one unpaid person, and the Amélie rule says: go there only with code.

---

## The problem

An estimated **100 million birds a year die on glass in Germany**; **only 15–35 % of victims are ever found**. Legally one question decides everything: is the killing risk at this building *significantly elevated* under § 44 BNatSchG? The LAG VSW draws the line at **two collision victims per 100 m of façade per year as "normal", and five or more as "significantly elevated".**

Germany's one substantial field study shows how far reality sits from that line. **Munich, 2020** (LBV with the Bavarian environment agency, published 2021): nine building complexes, **1,957 m of façade**, thirteen weeks, surveyed twice a week. 125 records.

| Structure | Collisions | Length | Per metre |
|---|---|---|---|
| marked noise barriers | **0** | 93 m | 0 |
| unmarked glass walls | 90 | 217 m | **0.41** |
| building façades | 35 | 1,647 m | 0.02 |

Free-standing unmarked glass kills roughly **twenty-eight times as much per metre** as a façade, and three glass walls on one street reached about **46 collisions per 100 m in three months** — nine times the significance threshold in a quarter of a year. Marked walls: zero. The study then assigned priorities 1 and 2 by hand.

That is the work in question: **drive there, walk the façade, judge it, rank it.** It scales with staff and with nothing else.

And demand for it just jumped:

- **On 10 June 2026 Berlin introduced its "Beurteilungshilfe" as a uniform standard** for building and planning procedures, explicitly to "bind species protection into construction processes"; a follow-up statement on 10 August 2026 added that protection "begins at the planning stage, not at the finished building".
- That assessment aid is **qualitative** and refers, for the actual classification, to **LAG VSW 21/01** — a four-class point system that exists as a PDF. Nothing else.
- Since February/March 2026 there are **digital collision reporting portals** in Jena, Leipzig and Berlin. Jena alone has passed 200 reports.

## Why this is possible now

**1. The photos already exist, and they are the right ones.** A report in the Vogelschlagmelder records date, the bird's condition, species, **the impact mark and its size**, **the orientation of the façade involved**, a coordinate resolved to an address — and **up to five photos**. That is very nearly the input set the scheme asks for. Today those images are only archived.

**2. Measuring a façade's glass share is a solved problem — in another industry.** Building-energy researchers have been extracting window-to-wall ratios from street imagery for years. Suppa et al. (*Building Simulation*, 2025) reach **±5 percentage points on 94 % of façades** with YOLOv9 on Street View, ±10 on 100 %, and publish the workflow openly. Add façade parsing (SOLOv2, Mask R-CNN) and a whole line of glass and transparency segmentation (City University Hong Kong's mirror-and-glass series, TransCues at WACV 2026).

**3. The reflection itself has become measurable.** **NFGlassNet** (arXiv 2511.16887) detects glass through the *contrast in reflections* between a flash and a no-flash shot — physically the question the scheme asks. Code promised "upon acceptance", so: building block, not dependency.

**4. The surroundings are a query.** Greenery, water and tree lines are in OpenStreetMap; Berlin's tree cadastre holds some 885,000 individual trees, openly queryable.

**5. And the platform is open source.** The Vogelschlagmelder is **GPLv3 on Codeberg** (`nabu-jena/Vogelschlagmelder`): Python, Docker Compose, OpenAPI docs, 159 commits, active as of September 2026, self-hostable — Berlin already runs its own instance. An assessment layer need not build anything; it docks.

## Sketch

- **Input:** the report that is created anyway — photos, façade orientation, coordinate. Optionally a deliberate façade photo for an assessment without a victim.
- **Derivation:** segment glass → share and **size of contiguous panes** per height zone → geometric special cases (glazed corner, see-through, free-standing pane) → classify what is reflected (sky / vegetation / built) → surroundings from OSM and the tree cadastre, **at several radii** (see "Where it breaks").
- **Scoring:** a **machine-readable version of LAG VSW 21/01** — factors, point values, thresholds, verbatim, with a version number. The software computes; it does not interpret.
- **Output:** one page. Photo with overlays, then every factor with its estimated value, **the origin of that estimate** and its uncertainty, each editable by hand. Anything the image cannot support says **"undetermined"**. The letter to the building owner falls out of the same sheet — the part volunteers type today.

**Not included:** no product recommendations, no certificate, no automatic § 44 verdict, no prediction of annual deaths, **no blanket scoring of other people's buildings from street imagery**, no public map of "dangerous houses".

## First step

**Ticket: make the scheme executable — without a single line of computer vision.**

Transcribe LAG VSW 21/01 into a rule file (YAML or JSON): every factor, point value and threshold, with the original wording beside it. Add a pure function that takes values by hand and returns a class plus its justification, and test cases from Berlin's assessment aid and the Munich study — those nine complexes are already classified by hand.

**Done when:** three hand-assessed buildings come out in the same class from manual input — **and every deviation traces to a named input value, not to the rules.**

Two advantages, both worth more than the code: the result is **useful on its own** (a citable, versioned form of the scheme any authority can reuse), and it is the skeleton that makes the idea deliverable at all — as a GPL-compatible module beside the Vogelschlagmelder, rather than a shout at an unpaid maintainer.

## Where it breaks

**1. A number that sounds more certain than the evidence gets abused in both directions.** The output is a **filled-in draft with visible inputs**, never a result. No factors shown, no class given.

**2. The evidence contradicts part of the intuition the scheme rests on.** Li et al. (*Biological Conservation* 310, 2025) analysed **3,078 buildings over 65,633 survey days** across China. Vegetation predicted collisions most strongly at **1,000 m in spring and 10 km in autumn** — landscape scale, not plot scale — and **trees within 5 m actually reduced autumn risk**; shorter buildings with high glass coverage were worse. Add Samuels et al. (*PeerJ*, 2022): small transom windows were struck nearly as often as large glass doors, with flight speed and approach angle predicting better than pane size. So: query surrounding greenery **at several radii**, don't over-weight the near field, and never let the sheet forecast deaths — it ranks situations.

**3. The photo sees the reflection once.** Morning, July, from below: three answers. The flash/no-flash trick works on **a single window at two metres**, not on a 20-metre façade. Carry time and direction — the reporting tool already does — allow several shots, and say "undetermined" when in doubt.

**4. The scheme does not belong to whoever codes it.** Verbatim mapping, scheme version printed on the sheet, a correction path back to the LAG VSW. If they won't come along, call it what it then is: a calculator for one organisation's own advisory work.

**5. The path from planning aid to pillory is short here** — the reports carry addresses. A map of reports is not a map that **rates** buildings. Assessments belong in the letter to the owner, not on a public layer.

**6. Photo rights and the people behind them.** The reporting tool takes usage rights to the photos for conservation purposes — probably enough for an assessment module, not obviously enough for a training set. Settle that before the first line of code.

## Who has tried already

**Verdict `narrowed`, not `free`.** The calculator exists twice elsewhere, and the opposite direction is now occupied in Germany:

- **FLAP Canada, "BirdSafe DIY Building Risk Assessment App"** (`flapapp.ca`): free, browser-based, day and night risk **per façade** — a guided **questionnaire**. No image analysis. Paid BirdSafe assessments with site visits alongside.
- **LEED Pilot Credit SSpc55 and now LEED v5**: a real score calculator with an official spreadsheet — `(Zone 1 + Zone 2 factored area) / adjusted façade area = Bird Collision Threat Rating`, target ≤ 15, Zone 1 the first 36 ft, glazed corners and fly-throughs ≤ 25. Since **24 April 2026** LEED v5 carries bird collisions in two credits requiring an ABC **threat factor ≤ 30**, with **CSA A460:19 (R2024)** recognised as the Canadian compliance path. It scores **materials from a design**, not a situation from an image: certification logic, not enforcement.
- **New York's Local Law 15** (in force since 10 Jan 2021) and **Toronto** since 2010 created markets for documentation, served by consultancies and material lists. Compliance software: not found.
- **Austria: ONR 191040.** Tested in the flight tunnel at the Hohenau-Ringelsdorf biological station (Martin Rössler): a marking qualifies when **at least 90 % of birds avoid the marked pane**. Vienna's environmental ombudsman publishes the ranked list. **The product side is thoroughly covered — which is why it is not part of this idea.**
- **Germany and Switzerland, scheme side:** LAG VSW 21/01, Berlin's assessment aid, Bavarian and Nuremberg leaflets, `vogelglas.vogelwarte.ch`. **No digital tool that computes the scheme.**
- **The opposite direction is newly occupied, and it is the most important change:** **vogelschlagmelder.de** — NABU Jena and Leipzig since February/March 2026, NABU Berlin with its own instance, code **GPLv3 on Codeberg**, active. Reports carry up to five photos, façade orientation, impact mark and geocoding; the **Gefahrenkarte** is a heatmap **of received reports**, not an assessment. **Reporting is solved. Rating is not.**
- **Research:** façade and glass segmentation, and window-to-wall measurement from street imagery, are solved and published; nobody has pointed them at bird collisions. No open-source project on building collision risk was found.

**The gap that remains:** the **German scheme** as an executable, citable module **on a reporting platform that already collects the necessary photos** — situational factors estimated rather than asked for, the result a checkable sheet for the authority and the owner rather than a certification score.

## Prior work

- **LAG VSW 21/01** — `vogelschutzwarten.de/glasanflug.htm`. *Not machine-readable during this research (robots.txt / 403 on every mirror found). Copy the point values from the original, not from leaflets — they disagree (Nuremberg 2023 says "more than four" rather than five victims per 100 m).*
- **Berlin:** assessment aid (SenMVKU), introduced as a uniform standard on 10 June 2026; press statement of 10 August 2026.
- **Munich study:** Wölfl & Bornemann (LBV) with LfU Bayern, 2021.
- **Vogelschlagmelder:** `vogelschlagmelder.de`, `berlin.vogelschlagmelder.de`, source at `codeberg.org/nabu-jena/Vogelschlagmelder` (GPLv3).
- **LBV project** "Vogelschlag an Glas verhindern" (2023–2027); `vogelschlag@lbv.de`.
- **Standards and products:** ONR 191040, Hohenau flight tunnel, Vienna environmental ombudsman, Swiss Ornithological Institute Sempach.
- **International calculators:** USGBC SSpc55 and LEED v5, ABC Material Threat Factors, CSA A460:19 (R2024), FLAP BirdSafe.
- **Vision side:** Suppa et al., *Building Simulation* 2025; SOLOv2 façade parsing; mirror-and-glass detection (CityU HK); TransCues (WACV 2026); NFGlassNet (arXiv 2511.16887); window detection (arXiv 2107.10006).
- **Evidence and limits:** Li et al., *Biological Conservation* 310 (2025); Samuels et al., *PeerJ* (2022).
- **Geodata:** OpenStreetMap land use, Berlin tree cadastre via Gieß den Kiez.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If one day you have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
