Crack Flora Watcher: Base Stats & Skill Trees
Version: 1.0
Status: Mechanics Specification
Purpose: To define how plant base stats are generated from real botanical trait data, how they are capped and balanced across species, and how species-specific skill trees are structured for leveling up.

Part 1: Base Stat Generation
1.1 The 6 Core Stats and Their Botanical Correlates
Each stat is derived from measurable plant traits found in peer-reviewed ecological databases and literature. No stat is invented; every number traces back to a real measurement.

Stat	Botanical Correlate	Primary Data Source	Measurement Unit
WURZEL (Root)	Maximum rooting depth (RDepth) + lateral rooting extent (LRExtent) + bud bank size	UNDERPLOT database (10,453 species, 19 belowground traits) 	Meters (depth), meters (lateral), count (buds)
TRITT (Trampling)	Trampling resistance index + recovery index + growth form	Experimental trampling studies (Cole & Bayfield protocols) 	Index (0–100), categorical (rosette/tussock/mat)
DÜRRE (Drought)	Photosynthetic pathway (C3/C4/CAM) + leaf turgor loss point (TP0) + succulence	C4/CAM literature, drought tolerance index studies 	Categorical (C3/C4/CAM), MPa (TP0)
SAAT (Seed)	Seed production per plant + dispersal distance + seed bank persistence	Weed seed output studies, dispersal literature 	Count (seeds/plant), meters (distance), years (persistence)
TEMPO (Speed)	Relative growth rate (RGR) + life cycle duration + generations per year	Grime & Hunt RGR data (130 herbaceous species) 	g/g/day, days to maturity, generations/year
CHEMIE (Chemistry)	Allelopathy index (RI) + toxin class + salt pump presence	Allelopathy quantification studies 	Index (−1 to +1), categorical
1.2 The Normalization Formula
Real trait values span orders of magnitude. A dandelion taproot reaches 0.3 m; an ailanthus root reaches 10 m. Seed output ranges from 100 to 100,000. To make these playable, every trait is normalized to a 0–10 scale using percentile ranking within the urban weed dataset.

Formula:

text
Stat = round( 10 × ( log(trait_value) − log(min) ) / ( log(max) − log(min) ) )
Why logarithmic? Because plant traits are log-normally distributed. A linear scale would make every plant look like a 10 in SAAT and a 1 in WURZEL.

Why percentile ranking? Because absolute values are misleading across trait types. A 2 m root is deep for a dandelion but shallow for a buddleja. Percentile ranking within the relevant functional group (annual forb, perennial forb, grass, shrub, tree) ensures fair comparison.

Example: SAAT normalization

Species	Seeds per Plant	Raw Log	Normalized (0–10)
Poa annua	2,500	3.40	4
Stellaria media	2,500	3.40	4
Capsella bursa-pastoris	3,000	3.48	5
Taraxacum officinale	5,000	3.70	6
Sonchus sp.	20,000	4.30	8
Erigeron canadensis	50,000	4.70	9
Buddleja davidii	3,000,000	6.48	10

1.3 The Trait-to-Stat Mapping Table
For each stat, the composite score is calculated from weighted sub-traits.

WURZEL (Root)
Sub-trait	Weight	Source	Normalization
Maximum rooting depth	40%	UNDERPLOT RDepth 	Log-scaled, 0.05–10 m
Lateral rooting extent	30%	UNDERPLOT LRExtent 	Log-scaled, 0.05–5 m
Bud bank size	20%	UNDERPLOT BBsize 	Log-scaled, 1–500 buds
Resprouting capacity	10%	UNDERPLOT resprouting 	Binary (0/1) → 0 or 10
Example: Taraxacum officinale

RDepth: 0.3 m → percentile 45 → 4.5

LRExtent: 0.15 m → percentile 30 → 3.0

BBsize: 12 buds → percentile 55 → 5.5

Resprouting: yes → 10

WURZEL = (4.5 × 0.4) + (3.0 × 0.3) + (5.5 × 0.2) + (10 × 0.1) = 1.8 + 0.9 + 1.1 + 1.0 = 4.8 → 5

TRITT (Trampling)
Sub-trait	Weight	Source	Normalization
Resistance index	50%	Trampling studies 	0–100 → 0–10
Recovery index	30%	Trampling studies 	0–100 → 0–10
Growth form	20%	Rosette/tussock/mat = 10; erect forb = 3	Categorical
Example: Plantago major

Resistance: 78 (prostrate ecotype)  → 7.8

Recovery: 85 → 8.5

Growth form: rosette → 10

TRITT = (7.8 × 0.5) + (8.5 × 0.3) + (10 × 0.2) = 3.9 + 2.55 + 2.0 = 8.45 → 8

DÜRRE (Drought)
Sub-trait	Weight	Source	Normalization
Photosynthetic pathway	40%	C3=2, C3–C4=5, C4=8, CAM=10, C4+CAM=10 	Categorical
Leaf turgor loss point (TP0)	40%	Drought tolerance studies 	−1.5 MPa → 0; −4.5 MPa → 10
Succulence	20%	Visual/substrate indicator	0–10
Example: Portulaca oleracea

Pathway: C4 + facultative CAM  → 10

TP0: −2.8 MPa → 6.5

Succulence: 9

DÜRRE = (10 × 0.4) + (6.5 × 0.4) + (9 × 0.2) = 4.0 + 2.6 + 1.8 = 8.4 → 8

SAAT (Seed)
Sub-trait	Weight	Source	Normalization
Seed production	50%	Weed seed output studies 	Log-scaled, 100–3,000,000
Dispersal distance	30%	Dispersal literature 	Log-scaled, 0.1–500 m
Seed bank persistence	20%	Seed bank studies 	1 year → 2; 5 years → 6; 20+ years → 10
Example: Erigeron canadensis

Seed production: 50,000 → 9

Dispersal: wind-dispersed, 0.27 m average  → 4

Persistence: 5 years → 6

SAAT = (9 × 0.5) + (4 × 0.3) + (6 × 0.2) = 4.5 + 1.2 + 1.2 = 6.9 → 7

TEMPO (Speed)
Sub-trait	Weight	Source	Normalization
Relative growth rate	50%	Grime & Hunt RGR data 	0.03–0.40 g/g/day → 0–10
Life cycle duration	30%	Days from germination to seed	<50 days → 10; >365 days → 2
Generations per year	20%	Annual=10, biennial=5, perennial=2	Categorical
Example: Poa annua

RGR: 0.35 g/g/day → 9

Life cycle: 45 days → 10

Generations: 2–3 per year → 10

TEMPO = (9 × 0.5) + (10 × 0.3) + (10 × 0.2) = 4.5 + 3.0 + 2.0 = 9.5 → 10

CHEMIE (Chemistry)
Sub-trait	Weight	Source	Normalization
Allelopathy index (RI)	60%	Allelopathy studies 	−1 to +1 → 0–10
Toxin class	30%	Literature	None=0; mild=4; moderate=7; strong=10
Salt pump	10%	Halophyte literature	Binary (0/1) → 0 or 10
Example: Chelidonium majus

Allelopathy RI: −0.55 → 7.75

Toxin: strong (alkaloids) → 10

Salt pump: no → 0

CHEMIE = (7.75 × 0.6) + (10 × 0.3) + (0 × 0.1) = 4.65 + 3.0 + 0 = 7.65 → 8

1.4 The CSR Modifier
After raw stats are calculated, the CSR class applies a base adjustment that reflects the species' ecological strategy. This is not a post-hoc balance patch; it is derived directly from Grime's theory.

Class	Stat Bonuses	Stat Penalties
C (Competitor)	+1 WURZEL, +1 TEMPO	−1 SAAT, −1 TRITT
S (Stress-tolerator)	+1 DÜRRE, +1 CHEMIE	−1 TEMPO, −1 SAAT
R (Ruderal)	+1 SAAT, +1 TEMPO	−1 TRITT, −1 DÜRRE
CR	+1 WURZEL, +0.5 TEMPO, +0.5 SAAT	−0.5 TRITT, −0.5 DÜRRE
SR	+1 DÜRRE, +1 CHEMIE, +0.5 TRITT	−0.5 TEMPO, −0.5 SAAT
CS	+1 WURZEL, +1 TEMPO	−1 TRITT
Why this works: CSR classification is based on measurable leaf traits (SLA, LDMC, LA) using the Pierce et al. method, which is proven to distinguish strategies within the same genus . The modifiers ensure that a Competitor feels like a Competitor, not just a plant with high stats.

Part 2: Capping and Balancing
2.1 Hard Caps
Individual stat cap: 10. No plant can exceed 10 in any stat.

Total stat budget: 36 points across 6 stats (average 6 per stat).

Minimum stat: 2. No plant can be completely helpless.

2.2 The Point-Buy Budget
Every species has a 36-point budget distributed across the 6 stats. This ensures that no species is universally superior. A plant that excels in DÜRRE (10) must accept lower stats elsewhere.

Species	WURZEL	TRITT	DÜRRE	SAAT	TEMPO	CHEMIE	Total
Löwenzahn	5	5	5	6	7	4	32
Breitwegerich	5	9	6	4	4	4	32
Rispengras	3	6	4	8	10	3	34
Schaumkraut	3	4	3	8	9	5	32
Zimbelkraut	4	3	6	7	6	4	30
Mauerraute	6	2	9	4	2	5	28
Silbermoos	3	5	10	3	2	4	27
Portulak	4	4	10	7	6	4	35
Berufkraut	4	3	5	9	7	5	33
Schöllkraut	5	4	4	6	5	9	33
Mastkraut	4	8	6	5	5	3	31
Löffelkraut	4	5	7	5	4	7	32
Schmetterlingsflieder	6	3	6	8	5	4	32
Götterbaum	8	4	7	7	4	6	36
Note: Species totals vary because CSR modifiers are applied after the point-buy allocation. The goal is not identical totals, but functional equivalence across arenas.

2.3 The Arena Balance Principle
No species dominates all arenas. The arena multiplier table ensures that a plant that wins on a sidewalk loses on a wall joint.

Example: Mauerraute (Asplenium ruta-muraria) vs. Breitwegerich (Plantago major)

Arena	Mauerraute Effective TRITT	Breitwegerich Effective TRITT	Winner
Gehwegfuge	2 × 2 = 4	9 × 2 = 18	Breitwegerich
Mauerfuge	2 × 0 = 0	9 × 0 = 0	Draw (TRITT ignored)
Straßenrand	2 × 1 = 2	9 × 1 = 9	Breitwegerich
But Mauerraute wins on DÜRRE:

Arena	Mauerraute DÜRRE	Breitwegerich DÜRRE	Winner
Mauerfuge	9 × 2 = 18	6 × 2 = 12	Mauerraute
Gehwegfuge	9 × 1 = 9	6 × 1 = 6	Mauerraute
Result: Mauerraute is a specialist (walls, drought), Breitwegerich is a generalist (sidewalks, trampling). Both are viable.

2.4 The Soft Cap: Diminishing Returns Above 8
Stats above 8 become increasingly expensive in the point-buy system.

Stat Value	Cost
2–5	1 point per level
6–7	2 points per level
8	3 points
9	4 points
10	5 points
Why: This prevents min-maxing. A plant with DÜRRE 10 (cost: 1+1+1+1 + 2+2 + 3 + 4 + 5 = 20 points) has only 16 points left for five other stats, forcing real trade-offs.

Part 3: Skill Trees
3.1 Skill Tree Structure
Each species has a 4-branch skill tree, unlocked at levels 2, 3, 4, and 5. Each branch has two choices (A or B), and the player can only pick one per branch. This creates 2⁴ = 16 possible builds per species.

Unlock schedule:

Level	Branch	Theme	Choice A	Choice B
Lv 2	Root	Belowground strategy	Deep anchor	Lateral spread
Lv 3	Defense	Stress response	Tolerance	Recovery
Lv 4	Reproduction	Seed strategy	Quantity	Quality
Lv 5	Legacy	Long-term survival	Persistence	Dispersal
3.2 Skill Trees for the 14 Starter Species
Each skill is grounded in real botanical science. The description cites the trait or mechanism it represents.

1. Löwenzahn (Taraxacum officinale) | RC
Lv 2 — Root

A: Pfahlwurzelbohrer — WURZEL +2 when defending. "The taproot regenerates from fragments." 

B: Seitenwurzelnetz — WURZEL +1, but TRITT +1. "Lateral roots anchor in compacted soil."

Lv 3 — Defense

A: Milchröhren — CHEMIE +2. "Latex deters herbivores."

B: Regenerationsknospe — TRITT +2 after losing a round. "Bud bank at root crown." 

Lv 4 — Reproduction

A: Fallschirmwolke — SAAT +2; seed dispersal distance doubled. "Pappus parachute." 

B: Dauerblüte — TEMPO +2; flowers continuously from spring to autumn.

Lv 5 — Legacy

A: Wurzelbrut — When defeated, respawn with 10% coverage. "Root fragments regenerate."

B: Samenbank — Seed bank persists 20 years. "One year's seeding, seven years weeding." 

2. Breitwegerich (Plantago major) | RCS
Lv 2 — Root

A: Trittplatte — TRITT +3 in high-disturbance arenas. "Prostrate rosette resists trampling." 

B: Faserwurzel — WURZEL +2. "Fibrous root system in compacted soil."

Lv 3 — Defense

A: Elastizität — TRITT +2; recovers 1% coverage per round. "Erect roadside ecotype." 

B: Sohlenfracht — SAAT +2; spreads via shoes. "Seeds stick to footwear."

Lv 4 — Reproduction

A: Massensaat — SAAT +3. "Produces up to 3,000 seeds." 

B: Langlebigkeit — SAAT −1, but TEMPO +2. "Perennial, flowers repeatedly."

Lv 5 — Legacy

A: Bodendecker — TRITT +2 permanently. "Forms dense mats."

B: Überdauerung — Survives frost without coverage loss. "Cold-hardy rosette."

3. Einjähriges Rispengras (Poa annua) | R
Lv 2 — Root

A: Flachwurzler — WURZEL −1, TEMPO +2. "Shallow roots, fast growth."

B: Horstbildung — TRITT +1, WURZEL +1. "Tussock form resists trampling." 

Lv 3 — Defense

A: Dauerblüte — TEMPO +2. "Flowers year-round."

B: Schnellregeneration — Recovers 3% per round after trampling. "High recovery index." 

Lv 4 — Reproduction

A: Massensaat — SAAT +3. "2,500 seeds per plant." 

B: Selbstbestäubung — SAAT +1, TEMPO +1. "Self-pollinating."

Lv 5 — Legacy

A: Samenbank — Returns after 5 years. "Persistent seed bank." 

B: Mehrere Generationen — 3 generations per year. "Annual life cycle."

4. Behaartes Schaumkraut (Cardamine hirsuta) | R
Lv 2 — Root

A: Faserwurzel — WURZEL +2. "Fibrous root system."

B: Flachwurzler — TEMPO +2. "Shallow, fast-growing."

Lv 3 — Defense

A: Schleudersitz — When defeated, distributes seeds to neighbors. "Explosive seed pods."

B: Kälteresistenz — DÜRRE +2 in frost events. "Winter annual."

Lv 4 — Reproduction

A: Massensaat — SAAT +3. "Thousands of seeds."

B: Schnellblüher — TEMPO +2. "Flowers in 6 weeks."

Lv 5 — Legacy

A: Samenbank — Returns after 3 years.

B: Mehrere Generationen — 2–3 generations per year.

5. Zimbelkraut (Cymbalaria muralis) | SR
Lv 2 — Root

A: Haftwurzeln — WURZEL +2 in wall arenas. "Adheres to vertical surfaces."

B: Fadendünn — TEMPO +1, SAAT +1. "Thin, spreading stems."

Lv 3 — Defense

A: Lichtflucht — Seeds directly into cracks. "Negative phototropism."

B: Schattentoleranz — DÜRRE +2 in shaded arenas.

Lv 4 — Reproduction

A: Kriechsaat — SAAT +2. "Seeds deposited in crevices."

B: Dauerblüte — TEMPO +2. "Long flowering period."

Lv 5 — Legacy

A: Mauerbewohner — WURZEL +2 permanently in walls.

B: Vermehrung — Spreads to adjacent cracks.

6. Mauerraute (Asplenium ruta-muraria) | S
Lv 2 — Root

A: Kalkanker — WURZEL +3 in Mauerfuge. "Invincible in mortar cracks."

B: Sporenverteilung — SAAT +2. "Wind-dispersed spores."

Lv 3 — Defense

A: Trockenstarre — DÜRRE +3. "Survives desiccation."

B: Kalktoleranz — CHEMIE +2 in alkaline substrates. "Calcicole specialist."

Lv 4 — Reproduction

A: Sporenbank — SAAT +2. "Spores persist in soil."

B: Langsamkeit — TEMPO +1, DÜRRE +1. "Slow-growing, long-lived."

Lv 5 — Legacy

A: Felsenbewohner — WURZEL +3 permanently in walls.

B: Jahrzehnte — Survives 10+ years without disturbance.

7. Silber-Birnmoos (Bryum argenteum) | S
Lv 2 — Root

A: Rhizoide — WURZEL +2. "Filamentous rhizoids."

B: Polster — TRITT +1. "Dense cushion form."

Lv 3 — Defense

A: Trockenstarre — DÜRRE +4; never drops below 5% coverage. "Desiccation tolerance."

B: Frosthärte — DÜRRE +2 in frost events.

Lv 4 — Reproduction

A: Sporenkapseln — SAAT +2. "Abundant spore production."

B: Vegetative Vermehrung — SAAT +1, TRITT +1. "Fragments regenerate."

Lv 5 — Legacy

A: Urzeitlich — Survives any single stress event.

B: Koloniebildung — Spreads to adjacent surfaces.

8. Portulak (Portulaca oleracea) | SR
Lv 2 — Root

A: Pfahlwurzel — WURZEL +2. "Taproot in dry soil."

B: Flachwurzler — TEMPO +2. "Fast-growing, shallow roots."

Lv 3 — Defense

A: C4-Turbo — DÜRRE ×3 in heatwave events. "C4 + CAM photosynthesis." 

B: Sukkulenz — DÜRRE +2; stores water in leaves. "Succulent leaves."

Lv 4 — Reproduction

A: Massensaat — SAAT +3. "Thousands of tiny seeds."

B: Selbstaussaat — SAAT +2; seeds germinate immediately. "Self-seeding annual."

Lv 5 — Legacy

A: Samenbank — Returns after 10 years. "Long-lived seed bank."

B: Frostschwäche — DÜRRE −2, but SAAT +2. "Weakness: first frost."

9. Kanadisches Berufkraut (Erigeron canadensis) | R
Lv 2 — Root

A: Pfahlwurzel — WURZEL +2. "Taproot anchors in disturbed soil."

B: Faserwurzel — TEMPO +1, SAAT +1. "Fibrous, fast-colonizing."

Lv 3 — Defense

A: Resistenzfeld — CHEMIE +3. "Allelopathic compounds." 

B: Schnellwuchs — TEMPO +2. "High RGR." 

Lv 4 — Reproduction

A: Fallschirmflotte — SAAT +3; occupies 2 cracks on win. "Wind-dispersed seeds."

B: Massensaat — SAAT +2. "50,000 seeds per plant."

Lv 5 — Legacy

A: Samenbank — Returns after 5 years.

B: Invasion — Spreads to adjacent cracks automatically.

10. Schöllkraut (Chelidonium majus) | CR
Lv 2 — Root

A: Pfahlwurzel — WURZEL +2. "Deep taproot."

B: Rhizom — WURZEL +1, TRITT +1. "Rhizomatous spread."

Lv 3 — Defense

A: Milchsaft — CHEMIE +3; opponent's CHEMIE −2. "Alkaloid latex."

B: Ameisenpost — SAAT +2; spreads even if defeated. "Ant-dispersed seeds."

Lv 4 — Reproduction

A: Massensaat — SAAT +2. "Many seeds per capsule."

B: Elaiosom — SAAT +1, CHEMIE +1. "Ant-attracting seed appendage."

Lv 5 — Legacy

A: Rhizomüberdauerung — Returns after 3 years.

B: Giftfest — Immune to allelopathy.

11. Niederliegendes Mastkraut (Sagina procumbens) | SR
Lv 2 — Root

A: Faserwurzel — WURZEL +2. "Fibrous root system."

B: Polster — TRITT +2. "Cushion form resists trampling." 

Lv 3 — Defense

A: Polstergriff — TRITT +3; loses no coverage to trampling. "Dense mat."

B: Regeneration — Heals 3% per round. "High recovery." 

Lv 4 — Reproduction

A: Selbstaussaat — SAAT +2. "Self-pollinating."

B: Kriechsprosse — SAAT +1, TEMPO +1. "Creeping stolons."

Lv 5 — Legacy

A: Mattenbildung — TRITT +2 permanently.

B: Langlebigkeit — Survives 5+ years.

12. Dänisches Löffelkraut (Cochlearia danica) | SR
Lv 2 — Root

A: Pfahlwurzel — WURZEL +2. "Taproot in saline soil."

B: Faserwurzel — TRITT +1. "Fibrous roots."

Lv 3 — Defense

A: Salzpumpe — CHEMIE +4 in salt arenas. "Salt pumps in leaves."

B: Salzspeicher — DÜRRE +2 in salt arenas. "Accumulates salt."

Lv 4 — Reproduction

A: Massensaat — SAAT +2. "Many seeds."

B: Winterannuell — TEMPO +2 in winter. "Winter annual."

Lv 5 — Legacy

A: Halophyt — Unplayable outside salt arenas.

B: Küstenbewohner — Survives salt events.

13. Schmetterlingsflieder (Buddleja davidii) | CS
Lv 2 — Root

A: Pfahlwurzel — WURZEL +2. "Deep taproot."

B: Wurzelbrut — WURZEL +1, SAAT +1. "Root suckers."

Lv 3 — Defense

A: Schuttpionier — Starts at 60% coverage in undisturbed arenas. "Colonizes rubble."

B: Mauerkrone — CHEMIE +2; damages wall arena. "Roots destroy masonry."

Lv 4 — Reproduction

A: Massensaat — SAAT +3. "3 million seeds per plant." 

B: Windverbreitung — SAAT +2; dispersal distance doubled. "Winged seeds."

Lv 5 — Legacy

A: Schuttpionier — WURZEL +2 permanently.

B: Invasiv — Spreads to adjacent cracks.

14. Götterbaum (Ailanthus altissima) | C (BANNED)
Lv 2 — Root

A: Wurzelbrut — WURZEL +3; returns after 2 rounds. "Aggressive root suckers."

B: Tiefwurzel — WURZEL +2. "Deep taproot."

Lv 3 — Defense

A: Ailanthon — CHEMIE +4; poisons substrate. "Allelopathic toxin." 

B: Resistenz — CHEMIE +2; immune to allelopathy.

Lv 4 — Reproduction

A: Massensaat — SAAT +3. "Millions of seeds."

B: Wurzelbrut — SAAT +2; spreads via roots.

Lv 5 — Legacy

A: Unaufhaltsam — Returns after 5 years.

B: Invasiv — Spreads automatically.

Status: BANNED from tournaments. Catchable but unplayable. No collection reward.

Part 4: Summary Tables
Stat Generation Summary
Stat	Primary Trait	Source	Range	Normalization
WURZEL	Rooting depth	UNDERPLOT	0.05–10 m	Log percentile
TRITT	Resistance index	Trampling studies	0–100	Linear
DÜRRE	C3/C4/CAM + TP0	Photosynthesis lit	Categorical + MPa	Categorical + linear
SAAT	Seed production	Weed studies	100–3M	Log percentile
TEMPO	RGR + life cycle	Grime & Hunt	0.03–0.40 g/g/day	Linear
CHEMIE	Allelopathy RI	Allelopathy studies	−1 to +1	Linear
Balance Rules
Rule	Value
Hard cap	10 per stat
Total budget	36 points
Minimum stat	2
Soft cap	Stats 9–10 cost 4–5 points
CSR modifier	±1 to specific stats
Arena balance	Multipliers ensure situational viability
Skill Tree Summary
Level	Branch	Choice A	Choice B
Lv 2	Root	Specialist (+2–3 in one arena)	Generalist (+1 to two stats)
Lv 3	Defense	Tolerance (resist stress)	Recovery (heal after stress)
Lv 4	Reproduction	Quantity (more seeds)	Quality (better dispersal)
Lv 5	Legacy	Persistence (return after defeat)	Dispersal (spread to neighbors)
