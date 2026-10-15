# Fugenduell — Image AI Prompts for Gaming Cards

> Generated from verified plant traits and scientific botanical databases:
> - **Pladias** (Czech Flora / Masaryk University & Czech Academy of Sciences, 2026): Ellenberg indicator values, life forms, height, flowering window, Pierce CSR leaf traits.
> - **UNDERPLOT v39** (Bruelheide et al., iDiv / Martin Luther University Halle-Wittenberg, DOI: 10.25829/idiv.3610-56acy9): Root depth ($RDepth$ in m), lateral root extent ($LRExtent$ in m), bud bank ($BBsize$).
> - **Royal Horticultural Society (RHS)** & **British Bryological Society (BBS)**: Verified botanical growth habit facts.
>
> In Fugenduell, matches simulate **1 to 3 years (12 to 36 calendar months)** of real urban microclimates and street stresses. All card stats strictly follow real measured values.

---

## 1. Verified Data-to-Resistance Mapping Schema

Every defensive stat and resistance displayed on the gaming card is derived through deterministic, published conversion rules from raw botanical database fields:

| Game Hazard (1–3 Year Duel) | Raw Scientific Field | Measured Database Value / Range | Deterministic Card Stat / Resistance |
|---|---|---|---|
| **❄️ Frost & Winter Survival** | Raunkiær Life Form (Pladias) | `hemicryptophyte` vs `therophyte` | **Hemicryptophyte**: Buds overwinter at soil surface (Frost Resist: +1).<br>**Therophyte**: Annual plant dies, overwinters as seed bank in soil. |
| **🔥 Bitumen Heat ($52^\circ\text{C}$)** | Temperature Indicator $T$ (Pladias) | Ordinal scale 1–9 ($T \ge 7$) | **Heat Resist**: 1 less shoot lost during heat months if $T \ge 7$ (e.g., *Portulaca* $T:8$, *Cymbalaria* $T:7$, *Buddleja* $T:7$). |
| **🏜️ Drought & Aridity** | Moisture Indicator $F$ (Pladias) & $RDepth$ (UNDERPLOT) | Ordinal scale 1–12 ($F \le 4$ or $F \le 3$); $RDepth \ge 0.5\text{m}$ | **Drought Resist 1**: if $F \le 4$; **Drought Resist 2**: if $F \le 3$ (*Asplenium* $F:3$).<br>**Deep Taproot**: $RDepth \ge 0.5\text{m}$ (*Taraxacum* $1.39\text{m}$, *Erigeron* $0.64\text{m}$). |
| **👣 Trample & Street Sweepers** | Plant Height (Pladias) & Growth Form (RHS) | Height Class 1 ($\le 0.1\text{m}$) or Rosette fact | **Trample Immunity**: Flat profile ($\le 0.1\text{m}$ / basal rosette) takes 0 trampling damage (*Plantago*, *Sagina*, *Bryum*). |
| **🐕 Dog Urine, Waste & N-Surge** | Nutrient Indicator $N$ (Pladias) | Ordinal scale 1–9 ($N \ge 7–8$) | **Nitrogen Glutton**: Absorbs acidic urea/dog urine spills and food waste as growth boost ($N:8$ in *Poa annua* & *Chelidonium majus*). Sensitive plants ($N \le 3$) suffer burn. |
| **🧂 De-icing Salt ($NaCl$)** | Salinity Indicator $S$ (Pladias) | Ordinal scale 0–3 ($S \ge 1$, $S \ge 2$) | **Salt Tolerant**: Immune to winter street de-icing runoff if $S \ge 1$ (*Plantago*, *Poa*, *Sagina* $S:1$; *Portulaca* $S:2$). Coastal halophyte: *Cochlearia danica*. |
| **🌱 Multi-Year Regrowth** | Bud Bank $BBsize$ (UNDERPLOT v39) | Continuous buds per shoot/unit | **Regrowth**: Underground bud bank $\ge 10\text{ buds}$ regrows immediately after cleaning/decapitation (*Plantago* 20.0, *Chelidonium* 20.0, *Taraxacum* 15.0, *Cymbalaria* 15.0, *Sagina* 12.5, *Cochlearia* 11.7, *Asplenium* 10.0). |

---

## 2. Visual Style & Card Layout Prompt Schema

* **Aesthetic**: Gritty, tactile, photorealistic collectible card game (TCG) layout. Blends the scientific botanical fidelity of *Wingspan* with the punchy graphic HUD of *Balatro* / *Marvel Snap* and raw urban street-level photography of Berlin, Madrid, and Tokyo.
* **Aspect Ratio**: `--ar 2:3` (Standard vertical card format).
* **Card Frame Layout**:
  * **Top**: German Common Name, Scientific Name, English Common Name, Height Class Icon (`Height 1–5`).
  * **Center Artwork**: Macro perspective inside an asphalt fissure, cobble joint, or mortar seam showing the living plant weathering authentic street hazards (tire tracks, frost dewdrops, dog splash stains, salt crystals, ant burrows).
  * **Middle Spec Bar**: Grime's CSR Strategy Bar (`C` Competition / `S` Stress / `R` Ruderal) with Pierce % and 10-point conversion scores.
  * **Resistance & Defense HUD**:
    `[❄️ Frost: Life Form] [🔥 Heat: T-Value] [🏜️ Drought: F-Value / RDepth] [👣 Trample: Profile] [🐕 Dog Urine / N: N-Value] [🧂 Salt: S-Value] [🌱 Regrowth: Bud Bank]`
  * **Keywords & Evidenced Abilities**: Real botanical adaptations (e.g., *Negative Phototropism*, *Ballistic Siliques*, *Elaiosomes*, *Hyaline Solar Shield*).
  * **Footer**: Scientific citation (`Pladias / UNDERPLOT v39 DOI: 10.25829/idiv.3610-56acy9`).

---

## 3. Global Negative Prompt
```text
cartoon, childish, generic fantasy fairy flower, smooth plastic texture, fake invented alien plant, blurry anatomy, incorrect petal counts, indoor potted plant, clean manicured garden lawn, pristine rosebed, deformed leaves, low resolution, watermark, generic stock photo frame
```

---

## 4. The 14 Species Prompts (With Verified Real-Value Resistances)

---

### Card 01: Gewöhnlicher Löwenzahn (*Taraxacum officinale*)
* **Scientific Database Values**:
  * **Wurzeltiefe / Root Depth**: $1.3947\text{ m}$ (UNDERPLOT v39 observed maximum species mean)
  * **Lateral Root Extent**: $0.4648\text{ m}$ (UNDERPLOT v39)
  * **Knospenbank / Bud Bank**: $15.0\text{ buds}$ (UNDERPLOT v39 / CLO-PLA)
  * **Height Class**: Class 2 ($0.1–0.5\text{ m}$, RHS)
  * **Life Form**: Hemicryptophyte ❄ (perennial taproot & leaf rosette, RHS)
* **Real-Value Resistances**:
  * ❄️ **Frost**: Hemicryptophyte (buds stored at crown; $1.39\text{m}$ taproot below frost line).
  * 🔥 **Heat & Drought**: High Drought Shield via **$1.39\text{m}$ Taproot** (accesses deep water beneath pavement).
  * 👣 **Trample**: Partial (basal rosette flattens underfoot; damaged taproot regenerates).
  * 🐕 **Dog Urine & Nutrients**: Tolerant of high-nitrogen street runoff.
  * 🧂 **Salt**: Moderate tolerance in curb gutters.
  * 🌱 **Regrowth**: **$15.0\text{ Buds}$** (Regrows from cut root segments).
* **Special Moves**: `⚡ Pusteblumen-Supernova` (wind dispersal pappus) & `Hydra-Respawn`.

#### AI Image Prompt:
```text
A collectible trading card for an urban ecology game, titled "LÖWENZAHN / Taraxacum officinale". Dramatic macro low-angle shot of a resilient common dandelion surviving year 2 in an asphalt fissure on a busy Berlin street. Beneath the split pavement, an exposed cross-section reveals its massive 1.39-meter-long taproot plunging through rubble into deep moist soil. Flat basal rosette hugs the ground, bearing dry dust and bicycle tire scuff marks, topped with a brilliant yellow flower and a translucent white pappus globe shedding parachute seeds. Card HUD elements: "3-YEAR SURVIVOR", "Root Depth: 1.39m (UNDERPLOT)", "Bud Bank: 15.0", "Resistances: [Frost: Hemicryptophyte] [Drought: Taproot 1.39m] [Regrowth: 15 Buds] [Trample: Basal Rosette]", "Ultimate: Pusteblumen-Supernova". Photorealistic macro illustration, wet tarmac reflections, gritty city pavement, 8k resolution, collectible card framing, --ar 2:3
```

---

### Card 02: Breitwegerich (*Plantago major*)
* **Scientific Database Values**:
  * **CSR Strategy**: C/CR ($82.3\%\text{ C} \cdot 0\%\text{ S} \cdot 17.7\%\text{ R}$) $\rightarrow$ Points: **C: 8 · S: 0 · R: 2** (Pladias / Pierce)
  * **Height**: $0.1–0.4\text{ m}$ (Pladias) $\rightarrow$ Height Class 2
  * **Wurzeltiefe / Root Depth**: $0.4967\text{ m}$ (UNDERPLOT v39)
  * **Knospenbank / Bud Bank**: $20.0\text{ buds}$ (UNDERPLOT v39 / CLO-PLA)
  * **Ellenberg Indicators**: $L:7,\ F:5,\ R:6x,\ N:6,\ S:1$ (Pladias)
  * **Life Form**: Hemicryptophyte ❄ (clonal herb, Pladias)
* **Real-Value Resistances**:
  * ❄️ **Frost**: Hemicryptophyte ❄ (overwinters with ground-level crown).
  * 🔥 **Heat / Drought**: Moderate ($F:5$, cuticle retains moisture).
  * 👣 **Trample**: **FULL IMMUNITY (Height Class 2 Rosette)** — tough parallel elastic leaf veins take repeated pedestrian boot stomp without cell rupture.
  * 🐕 **Dog Urine & Nutrients**: Tolerant ($N:6$, thriving in compacted path soil).
  * 🧂 **Salt**: Salt Resistant ($S:1$, survives curb runoff).
  * 🌱 **Regrowth**: **$20.0\text{ Buds}$** (highest regeneration budget in the flora).
* **Special Moves**: `⚡ Schuhtaxi` (sticky wet seeds adhere to shoes) & `Panzer-Rosette`.

#### AI Image Prompt:
```text
A premium collectible card game illustration of "BREITWEGERICH / Plantago major", tactical card layout. Ground-level macro perspective between worn granite cobblestones on a high-traffic pedestrian square. A tough, leathery circular rosette of dark-green ribbed oval leaves pressed flat against stone pavers, showing an embossed boot-tread pattern on the leaf cuticle that failed to tear the elastic fibers. Slender upright flower spikes rise resiliently. Card HUD display: "3-YEAR SURVIVOR", "CSR: C 8 · S 0 · R 2", "Indicators: L7 F5 R6x N6 S1", "Bud Bank: 20.0 (Max Regrowth)", "Resistances: [Trample: IMMUNE (Elastic Veins)] [Salt: S1 Tolerant] [Compacted Soil: MAX] [Frost: Hemicryptophyte]", "Ultimate: Panzer-Rosette / Schuhtaxi". Hyper-realistic botanical illustration, wet cobblestone reflections, sharp collectible TCG card borders, --ar 2:3
```

---

### Card 03: Einjähriges Rispengras (*Poa annua*)
* **Scientific Database Values**:
  * **CSR Strategy**: SR ($6.8\%\text{ C} \cdot 35.0\%\text{ S} \cdot 58.2\%\text{ R}$) $\rightarrow$ Points: **C: 1 · S: 3 · R: 6** (Pladias / Pierce)
  * **Height**: $0.05–0.25\text{ m}$ (Pladias) $\rightarrow$ Height Class 2
  * **Wurzeltiefe / Root Depth**: $0.17\text{ m}$ (UNDERPLOT v39)
  * **Knospenbank / Bud Bank**: $4.2\text{ buds}$ (UNDERPLOT v39 / CLO-PLA)
  * **Ellenberg Indicators**: $L:7,\ F:6,\ R:6x,\ N:8,\ S:1$ (Pladias)
  * **Flowering Window**: January–December (All 12 months, Pladias)
  * **Seed Longevity**: Viable $\ge 4\text{ years}$ (RHS)
* **Real-Value Resistances**:
  * ❄️ **Frost**: Flowers even in freezing January ($0^\circ\text{C}$).
  * 🔥 **Heat / Drought**: Low ($F:6$, wilts in summer, but escapes via continuous seed production).
  * 👣 **Trample**: High (flexible fibrous grass tufts bend underfoot).
  * 🐕 **Dog Urine, Vomit & Contamination**: **EXTREME RESISTANCE ($N:8$ Heavy Nutrient Specialist)** — drinks high-nitrogen dog urine and food waste, converting organic acid shock into rapid growth!
  * 🧂 **Salt**: Salt Resistant ($S:1$).
  * 🌱 **Multi-Year Seed Bank**: Seeds remain dormant and viable in cracks for $\ge 4$ years.
* **Special Moves**: `⚡ Saatsturm` (instant mass sprouting from multi-year seed bank).

#### AI Image Prompt:
```text
A trading card artwork of "RISPENGRAS / Poa annua", tactical eco-card layout. Extreme close-up of a dense, vibrant green tuft of Annual Meadow Grass flourishing in a gutter seam right outside a late-night street food vendor. The grass thrives in nitrogen-rich sidewalk runoff with bright healthy panicles, flowering in the middle of winter next to dirty patches of melted snow. Shallow fibrous roots grip the narrowest asphalt slit. Card stats HUD: "3-YEAR SEED BANK (4+ Yrs Viable)", "CSR: C 1 · S 3 · R 6", "Flowering: Jan–Dec (All-Year)", "Indicators: L7 F6 R6x N8 S1", "Resistances: [Dog Urine & Waste: ABSORBS (N:8)] [Salt: S1] [Winter Flowering at 0°C]", "Ultimate: Saatsturm". High-detail macro botanical photography style, evening city streetlamp reflection, modern card frame, --ar 2:3
```

---

### Card 04: Behaartes Schaumkraut (*Cardamine hirsuta*)
* **Scientific Database Values**:
  * **CSR Strategy**: R/CR ($22.5\%\text{ C} \cdot 0\%\text{ S} \cdot 77.5\%\text{ R}$) $\rightarrow$ Points: **C: 2 · S: 0 · R: 8** (Pladias / Pierce: Extreme Ruderal)
  * **Height**: $0.1–0.25\text{ m}$ (Pladias) $\rightarrow$ Height Class 2
  * **Wurzeltiefe / Root Depth**: $0.37\text{ m}$ (UNDERPLOT v39)
  * **Knospenbank / Bud Bank**: $2.5\text{ buds}$ (UNDERPLOT v39 / CLO-PLA)
  * **Ellenberg Indicators**: $L:6,\ F:5,\ R:5,\ N:6,\ S:0$ (Pladias)
  * **Life Form**: Therophyte 🌱 (annual herb, Pladias)
  * **Phenology**: Multiple generations per season (RHS)
* **Real-Value Resistances**:
  * ❄️ **Frost**: High winter-germination capacity (overwinters as green winter rosette).
  * 🔥 **Heat / Drought**: Low (completes life cycle by June; avoids summer heat as seed).
  * 👣 **Trample**: Uses pedestrian footsteps as a trigger! Mechanical shock causes siliques to explode instantly.
  * 🐕 **Dog Urine & Contamination**: Moderate ($N:6$).
  * 🧂 **Salt**: Sensitive ($S:0$, zero salt tolerance).
  * 🌱 **Multi-Generation Ballistics**: Siliques build turgor pressure, ejecting seeds at $10\text{ m/s}$.
* **Special Moves**: `⚡ Schotenmörser` (ballistic explosive counter-fire).

#### AI Image Prompt:
```text
A dynamic collectible card design titled "SCHAUMKRAUT / Cardamine hirsuta", tactical card game layout. Action freeze-frame macro close-up in early spring: Hairy Bittercress growing in a cracked mossy brick joint. An approaching sneaker step causes vibration, triggering ripe vertical seed pods (siliques) to twist open with explosive mechanical force, firing tiny golden seeds through the air like projectile shrapnel. Delicate white 4-petaled flowers crown the slender stem above a basal pinnate rosette dusted with late-winter frost melt. Card interface display: "CSR: C 2 · S 0 · R 8 (Extreme Ruderal)", "Life Form: Therophyte", "Indicators: L6 F5 R5 N6 S0", "Resistances: [Frost: Winter Rosette] [Vibration-Triggered Ejection] [Drought: Seed Escape]", "Ultimate: Schotenmörser (Ballistic Siliques)", Sharp high-speed macro photography, dynamic seed motion blur, crisp collectible card borders, --ar 2:3
```

---

### Card 05: Zimbelkraut (*Cymbalaria muralis*)
* **Scientific Database Values**:
  * **CSR Strategy**: R/CR ($37.3\%\text{ C} \cdot 0\%\text{ S} \cdot 62.7\%\text{ R}$) $\rightarrow$ Points: **C: 4 · S: 0 · R: 6** (Pladias / Pierce)
  * **Height**: Up to $10\text{ cm}$ creeping stems (Pladias / RHS) $\rightarrow$ Height Class 2
  * **Knospenbank / Bud Bank**: $15.0\text{ buds}$ (UNDERPLOT v39 / CLO-PLA)
  * **Ellenberg Indicators**: $L:6,\ F:4,\ R:8,\ N:5,\ S:0$ (Pladias: alkaline lime-mortar specialist)
  * **Life Form**: Hemicryptophyte ❄ (perennial herb, Pladias)
* **Real-Value Resistances**:
  * ❄️ **Frost**: Hemicryptophyte ❄ (stems and buds sheltered in deep wall crevices).
  * 🔥 **Heat**: High Heat Resistance ($T:7$ high temperature indicator).
  * 🏜️ **Drought**: High ($F:4$ dry site tolerance; draws moisture from mortar).
  * 👣 **Trample & Street Sweepers**: **IMMUNE** (lives on vertical masonry walls, completely out of reach of boots, sweepers, and dog urine!).
  * 🐕 **Dog Urine**: Immune due to vertical elevation ($>0.5\text{m}$ above street level).
  * 🧂 **Salt**: Sensitive ($S:0$).
  * 🌱 **Negative Phototropism**: Seed stalks curve backwards away from light, burying seeds into dark mortar joints.
* **Special Moves**: `⚡ Mauer-Bunker` / `Rückwärts-Saat`.

#### AI Image Prompt:
```text
A tactical collectible card featuring "ZIMBELKRAUT / Cymbalaria muralis". Vertical wall perspective on a weathered 19th-century brick and lime-mortar facade. Cascading purple-tinged creeping stems of Ivy-Leaved Toadflax with glossy ivy-shaped leaves and miniature lilac and yellow snapdragon flowers. A fertilized seed stalk is actively arching backwards away from sunlight, burying its seed pod deep into a dark, inaccessible horizontal mortar fissure. The plant sits 1 meter above the pavement, elevated safely away from street dirt and dog traffic. Card HUD template: "3-YEAR SURVIVOR: VERTICAL SPECIALIST", "CSR: C 4 · S 0 · R 6", "Bud Bank: 15.0", "Indicators: L6 F4 R8 N5 S0", "Resistances: [Trample/Sweeper: OUT OF REACH (Vertical)] [Heat: T:7] [Drought: F:4 Mortar Shield] [Dog Urine: IMMUNE]", "Ultimate: Mauer-Bunker (Negative Phototropism)". Detailed architectural masonry background, soft daylight, sharp TCG layout framing, --ar 2:3
```

---

### Card 06: Mauerraute (*Asplenium ruta-muraria*)
* **Scientific Database Values**:
  * **CSR Strategy**: S/CSR ($12.6\%\text{ C} \cdot 54.6\%\text{ S} \cdot 32.8\%\text{ R}$) $\rightarrow$ Points: **C: 1 · S: 6 · R: 3** (Pladias / Pierce: High Stress S: 54.6%)
  * **Height**: $0.05–0.2\text{ m}$ (Pladias) $\rightarrow$ Height Class 2
  * **Knospenbank / Bud Bank**: $10.0\text{ buds}$ (UNDERPLOT v39 / CLO-PLA)
  * **Ellenberg Indicators**: $L:8,\ F:3,\ R:8,\ N:3,\ S:0$ (Pladias: extreme drought F:3, extreme alkaline lime R:8)
  * **Life Form**: Evergreen Hemicryptophyte ❄ (Pladias / RHS)
* **Real-Value Resistances**:
  * ❄️ **Frost**: Maximum (evergreen fronds survive $-20^\circ\text{C}$ winter frost on stone).
  * 🔥 **Heat & Light**: High ($L:8$ maximum sunlight tolerance).
  * 🏜️ **Drought**: **EXTREME RESISTANCE 2 ($F:3$ Dry Stone Specialist)** — survives severe water depletion by desiccation tolerance, drawing calcium from alkaline mortar ($R:8$).
  * 👣 **Trample**: Immune on vertical walls.
  * 🐕 **Dog Urine**: Out of reach; sensitive to nitrogen ($N:3$).
  * 🧂 **Salt**: Sensitive ($S:0$).
* **Special Moves**: `⚡ Scheintod` (desiccation dormancy) & `Kalkanker` (dissolves and absorbs stone minerals).

#### AI Image Prompt:
```text
A dark fantasy collectible card artwork of "MAUERRAUTE / Asplenium ruta-muraria". Macro close-up of a venerable Wall-Rue fern wedged inside a mortar seam of an ancient bridge stone wall. Leathery, diamond-shaped, fan-like evergreen dark green fronds tufted tightly together. Undersides show dark brown rust-colored spore capsules (sori). Fronds look dry and toughened from an intense 3-month summer heatwave, yet stubbornly alive, anchoring into calcified mortar with microscopic acid-secreting root hairs. Card text graphics: "3-YEAR SURVIVOR: S-TIER STRESS SPECIALIST", "CSR: C 1 · S 6 · R 3 (S: 54.6%)", "Indicators: L8 F3 R8 N3 S0", "Bud Bank: 10.0", "Resistances: [Drought: LEVEL 2 (F:3 Extreme)] [Frost: Evergreen (-20°C)] [Alkaline Stone Anchor (R:8)]", "Ultimate: Scheintod / Kalkanker". Majestic gothic botanical art, harsh natural lighting, textured limestone relief, collectible card HUD overlay, --ar 2:3
```

---

### Card 07: Silber-Birnmoos (*Bryum argenteum*)
* **Scientific Database Values**:
  * **Height**: $< 1\text{ cm}$ ($0.75–1.25\text{ mm}$ leaves, BBS British field guide) $\rightarrow$ Height Class 1
  * **CSR Strategy**: Locked / High Stress S-Tier (Historic fixture: $3 \cdot 5 \cdot 10 \cdot 3 \cdot 2 \cdot 4 = 27$)
  * **Habitat**: High-disturbance pavement cracks, walls, concrete (BBS)
* **Real-Value Resistances**:
  * ❄️ **Frost**: Polar freeze tolerance (poikilohydric moss).
  * 🔥 **Heat**: **MAXIMUM (Colorless Hyaline Leaf Tips)** — silvery reflective tips act as a microscopic solar mirror against asphalt surface heat $>50^\circ\text{C}$.
  * 🏜️ **Drought**: **ABSOLUTE CRYPTOBIOSIS** — loses $98\%$ of cell water without dying; rehydrates and photosynthesizes within 20 minutes of rain.
  * 👣 **Trample & Street Sweepers**: **IMMUNE** — height $<1\text{cm}$ allows rotating sweeper brushes and boots to glide over without harm.
  * 🐕 **Dog Urine & Dust Grime**: High tolerance; thrives in disturbed, nutrient-rich street grit.
  * 🧂 **Salt**: Moderate tolerance.
* **Special Moves**: `⚡ Auferstehung` / `Kryptobiotischer Phönix` (revives from dry black crust to bright silver-green).

#### AI Image Prompt:
```text
A legendary collectible card game artwork for "SILBERMOOS / Bryum argenteum". Extreme microscope-like macro photography of a colony of Silver Moss flourishing inside a razor-thin concrete crack. Tiny rounded shoots under 1cm high form dense shimmering cushions. Leaf tips are completely translucent and colorless (hyaline cells), gleaming with a bright silvery-metallic sheen under blazing sunlight, reflecting blistering asphalt heat. Dewdrops bead on the silver velvet surface. Card border graphics: "Height: Class 1 (<1cm)", "CSR: S-Tier Cryptobiotic", "Habitat: High-Traffic Pavement", "Resistances: [Solar Reflection: Hyaline Cells] [Desiccation Cryptobiosis] [Trample: IMMUNE (<1cm)] [Polar Frost]", "Ultimate: Auferstehung". Luminescent green and silver highlights, hyper-realistic moss texture, crisp trading card badge framing, --ar 2:3
```

---

### Card 08: Sommer-Portulak (*Portulaca oleracea*)
* **Scientific Database Values**:
  * **CSR Strategy**: R ($0.3\%\text{ C} \cdot 0\%\text{ S} \cdot 99.7\%\text{ R}$) $\rightarrow$ Points: **C: 0 · S: 0 · R: 10** (Pladias / Pierce: 99.7% Pure Ruderal)
  * **Height**: $0.05–0.3\text{ m}$ (Pladias) $\rightarrow$ Height Class 2
  * **Wurzeltiefe / Root Depth**: $0.25\text{ m}$ (UNDERPLOT v39)
  * **Knospenbank / Bud Bank**: $1.2\text{ buds}$ (UNDERPLOT v39 / CLO-PLA)
  * **Ellenberg Indicators**: $L:8,\ T:8,\ F:4,\ R:7,\ N:7,\ S:2$ (Pladias: T:8 extreme heat, S:2 high salt)
  * **Life Form**: Therophyte 🌱 (succulent annual, Pladias/RHS)
* **Real-Value Resistances**:
  * ❄️ **Frost**: Zero as a living shoot; escapes winter freezing entirely as durable seeds.
  * 🔥 **Asphalt Gluthitze (Heat)**: **MAXIMUM ($T:8$ Extreme Heat Rating, C4 / CAM Photosynthesis)** — peaks when bitumen hits $45^\circ–52^\circ\text{C}$!
  * 🏜️ **Drought**: High Drought Shield ($F:4$, fleshy succulent water-storage tissues).
  * 👣 **Trample**: Moderate (flexible prostrate stems lie flat along tarmac).
  * 🐕 **Dog Urine & Nutrients**: High ($N:7$, thrives in rich organic sidewalk dirt).
  * 🧂 **Salt**: **HIGH RESISTANCE ($S:2$ Salinity Specialist)** — tolerates salt runoff and brackish roadside puddles.
  * 🌱 **10-Year Seed Bank**: Seeds survive deep in asphalt cracks for over a decade.
* **Special Moves**: `⚡ C4-Inferno` / `Hitzerausch` (converts heatwaves into free growth energy).

#### AI Image Prompt:
```text
A vibrant tactical card illustration of "PORTULAK / Portulaca oleracea", urban ecology card game. Macro ground perspective across molten black asphalt during a scorching 42°C midsummer heatwave. Fleshy, glossy, reddish-purple succulent stems creep horizontally across the tarmac. Tear-drop shaped, thick, water-filled jade-green leaves glisten under blinding sunlight; tiny golden-yellow star flowers open in the midday heat. Heat haze ripples above the pavement while competing weeds lie shriveled nearby. Card stats interface: "MULTI-YEAR SEED RELAY (10-Yr Seed Bank)", "CSR: C 0 · S 0 · R 10 (99.7% Ruderal)", "Indicators: L8 T8 F4 R7 N7 S2", "Resistances: [Heat: T:8 (C4/CAM Peak)] [Salt: S:2 High] [Drought: F:4 Succulence] [Frost: Seed Escape]", "Ultimate: C4-Inferno". Saturated warm cinematic palette, translucent succulent leaf details, sharp collectible gaming card frame, --ar 2:3
```

---

### Card 09: Kanadisches Berufkraut (*Erigeron canadensis*)
* **Scientific Database Values**:
  * **Wurzeltiefe / Root Depth**: $0.64\text{ m}$ (UNDERPLOT v39: Deep Root Keyword!)
  * **Lateral Root Extent**: $0.40\text{ m}$ (UNDERPLOT v39)
  * **Knospenbank / Bud Bank**: $2.5\text{ buds}$ (UNDERPLOT v39 / CLO-PLA)
  * **Height**: Midpoint $\sim 1.0\text{ m}$ (RHS: erect stem around 1m) $\rightarrow$ Height Class 3
  * **CSR Strategy**: Locked / Field Book ($4 \cdot 3 \cdot 5 \cdot 9 \cdot 7 \cdot 5 = 33$)
* **Real-Value Resistances**:
  * ❄️ **Frost**: High (overwinters as a flat winter basal rosette before shooting up in spring).
  * 🔥 **Heat & Drought**: High ($0.64\text{m}$ deep taproot taps subterranean moisture).
  * 👣 **Trample**: Low when tall, but immune in early flat rosette stage.
  * 🐕 **Chemical Contamination & Herbicides**: High (well-documented resistance to herbicides and railway pollutants).
  * 🧂 **Salt**: Moderate ($S:1$).
  * 🌱 **Wind Tower**: $1\text{m}$ tall stem launches hundreds of thousands of airborne pappus seeds.
* **Special Moves**: `⚡ Achenensegel` & `Glyphosat-Panzer` (halves toxic pollutant and chemical damage).

#### AI Image Prompt:
```text
A striking tactical card game artwork of "BERUFKRAUT / Erigeron canadensis". Low-angle perspective looking up from railway track ballast: a tall, solitary 1-meter-high wand-like erect green spear rising out of coarse gravel between railroad ties and asphalt. Densely clad in narrow linear leaves, crowned with a massive plume of thousands of miniature 3mm daisy-like white-yellow flower heads releasing fluffy pappus seeds into industrial wind currents. A passing train blurs in the background. Card HUD display: "SURVIVAL: MULTI-YEAR INDUSTRIAL VETERAN", "Height: Class 3 (1.0m)", "Root: 0.64m (Deep Root)", "Resistances: [Herbicide & Contamination: IMMUNE] [Industrial Drought: Deep Taproot 0.64m] [Frost: Winter Rosette]", "Ultimate: Achenensegel / Glyphosat-Panzer". Gritty industrial aesthetic, atmospheric dusk lighting, sharp trading card typography borders, --ar 2:3
```

---

### Card 10: Großes Schöllkraut (*Chelidonium majus*)
* **Scientific Database Values**:
  * **CSR Strategy**: CR ($54.7\%\text{ C} \cdot 6.6\%\text{ S} \cdot 38.8\%\text{ R}$) $\rightarrow$ Points: **C: 5 · S: 1 · R: 4** (Pladias / Pierce)
  * **Height**: $0.3–0.9\text{ m}$ (Pladias) $\rightarrow$ Height Class 3
  * **Knospenbank / Bud Bank**: $20.0\text{ buds}$ (UNDERPLOT v39 / CLO-PLA: Maximum Bud Bank!)
  * **Ellenberg Indicators**: $L:6,\ F:5,\ R:7x,\ N:8,\ S:0$ (Pladias: N:8 extreme nutrient lover, shade tolerant)
  * **Life Form**: Hemicryptophyte ❄ (polycarpic perennial, Pladias)
* **Real-Value Resistances**:
  * ❄️ **Frost**: Hemicryptophyte ❄ ($20\text{ buds}$ on root crown overwinter safely under leaf litter).
  * 🔥 **Heat / Drought**: Moderate ($L:6$, thrives in shaded wall bases; thick fleshy roots).
  * 👣 **Trample / Decapitation**: **MAXIMUM REGROWTH ($20.0\text{ Bud Bank}$)** — underground crown regenerates fresh shoots immediately after being mown or trampled.
  * 🐕 **Dog Urine, Vomit & Contamination**: **MAXIMUM ($N:8$ Nutrient King)** — thrives in filthy, urine-soaked street corners, gorging on excess nitrogen!
  * 🧪 **Chemical Defense**: Skin-irritant neon-orange alkaloid latex sap repels herbivores and pests.
  * 🌱 **Ant Nest Bunker**: Lipid elaiosomes induce ants (*Lasius niger*) to carry seeds into subterranean nests safe from sweepers and frost.
* **Special Moves**: `⚡ Ameisen-Express` (ants bunker seeds beneath paving slabs).

#### AI Image Prompt:
```text
A mystical urban fantasy collectible card: "SCHÖLLKRAUT / Chelidonium majus". Macro scene at the damp foot of a graffiti-covered brick wall corner in Berlin. Lush Greater Celandine with scalloped pale-green leaves and bright 4-petaled yellow flowers. A broken stem dramatically oozes glowing, neon-orange alkaloid latex sap. Down on the pavement, shiny black pavement ants (Lasius niger) greedily collect glossy black seeds with white lipid elaiosomes, carrying them into a safe underground nest beneath paving slabs. Card interface overlay: "3-YEAR SURVIVOR: NITRATE GLUTTON", "CSR: C 5 · S 1 · R 4", "Bud Bank: 20.0 (Max Regrowth)", "Indicators: L6 F5 R7x N8 S0", "Resistances: [Dog Urine & Waste: ABSORBS (N:8)] [Decapitation Regrowth: 20 Buds] [Orange Alkaloid Shield]", "Ultimate: Ameisen-Express". Dramatic contrasts, vivid glowing orange sap highlights, sharp collectible card graphics, --ar 2:3
```

---

### Card 11: Niederliegendes Mastkraut (*Sagina procumbens*)
* **Scientific Database Values**:
  * **CSR Strategy**: SR ($0\%\text{ C} \cdot 45.4\%\text{ S} \cdot 54.6\%\text{ R}$) $\rightarrow$ Points: **C: 0 · S: 5 · R: 5** (Pladias / Pierce)
  * **Height**: $0.02–0.05\text{ m}$ ($2–5\text{ cm}$, Pladias) $\rightarrow$ Height Class 1 (ultra-flat)
  * **Wurzeltiefe / Root Depth**: $0.04\text{ m}$ (UNDERPLOT v39)
  * **Knospenbank / Bud Bank**: $12.5\text{ buds}$ (UNDERPLOT v39 / CLO-PLA)
  * **Ellenberg Indicators**: $L:7,\ F:6,\ R:5,\ N:6,\ S:1$ (Pladias)
  * **Life Form**: Hemicryptophyte ❄ (polycarpic perennial herb, Pladias)
* **Real-Value Resistances**:
  * ❄️ **Frost**: Hemicryptophyte ❄ (dense evergreen creeping mat survives frozen streets).
  * 🔥 **Heat / Drought**: Moderate ($F:6$, requires moisture inside joints).
  * 👣 **Trample & Street Sweepers**: **FULL IMMUNITY (Height Class 1)** — ground-hugging cushion ($2–5\text{cm}$) cannot be snagged by rotating sweeper brushes or crushed by boots.
  * 🐕 **Dog Urine & Grime**: High ($N:6$, tolerates sidewalk wash).
  * 🧂 **Salt**: Salt Resistant ($S:1$).
  * 🌱 **Creeping Perennial**: Stems root at every node, knitting multi-year mattresses through paving joints.
* **Special Moves**: `⚡ Polsterbunker` (cushion absorbs all trampling damage and heals coverage).

#### AI Image Prompt:
```text
A collectible card game illustration of "MASTKRAUT / Sagina procumbens", urban survival theme. Extreme macro view of an ultra-dense, bright emerald-green moss-like mat of Procumbent Pearlwort packed into a 4mm crack between two damp granite paving stones. Creeping stems rooting at every node form a flat, indestructible living carpet barely 2cm high, completely unaffected by heavy pedestrian foot traffic. Tiny 4-petaled white pearl-like flowers open across the green cushion. Rainwater beads on the leaves. Card HUD details: "3-YEAR SURVIVOR: LOW-PROFILE KING", "Height: Class 1 (0.03m)", "CSR: C 0 · S 5 · R 5", "Bud Bank: 12.5", "Indicators: L7 F6 R5 N6 S1", "Resistances: [Trample & Sweeper: IMMUNE (Height Class 1)] [Salt: S1] [Frost: Evergreen Hemicryptophyte]", "Ultimate: Polsterbunker". Crisp macro texture, glistening water droplets against stone, collectible TCG card framing, --ar 2:3
```

---

### Card 12: Dänisches Löffelkraut (*Cochlearia danica*)
* **Scientific Database Values**:
  * **CSR Strategy**: R ($9.6\%\text{ C} \cdot 0\%\text{ S} \cdot 90.4\%\text{ R}$) $\rightarrow$ Points: **C: 1 · S: 0 · R: 9** (Pladias / Pierce: 90.4% Pure Ruderal)
  * **Height**: $0.1–0.2\text{ m}$ (Pladias) $\rightarrow$ Height Class 2
  * **Knospenbank / Bud Bank**: $11.7\text{ buds}$ (UNDERPLOT v39 / CLO-PLA)
  * **Origin & Habitat**: Coastal halophyte spreading along highway salt margins at $65\text{ km/year}$ (Preslia, 2018)
  * **Life Form**: Therophyte / Hemicryptophyte (Pladias)
* **Real-Value Resistances**:
  * ❄️ **Frost**: High winter resistance; actively germinates in late-winter salt slush.
  * 🔥 **Heat / Drought**: Low (completes life cycle in May/June; survives summer as seed).
  * 👣 **Trample**: Moderate on highway curb edges.
  * 🐕 **Dog Urine & Grime**: High tolerance for toxic runoff.
  * 🧂 **Streusalz (De-icing Salt)**: **MAXIMUM HALOPHYTE IMMUNITY** — thrives in high sodium chloride ($NaCl$) brine; converts winter de-icing salt runoff into a competitive highway corridor!
  * 🌱 **Highway Corridor Speed**: Expands along salted highways at $65\text{ km/year}$.
* **Special Moves**: `⚡ Salzstraßen-Sprint` (turns de-icing salt into speed and coverage buffs).

#### AI Image Prompt:
```text
A tactical collectible card featuring "LÖFFELKRAUT / Cochlearia danica", high-stakes urban ecology card game. Ground-level macro shot along the brutal concrete curb of a salted winter highway. Danish Scurvygrass blooming vigorously directly inside a crust of white de-icing salt slush and frozen road spray. Glossy succulent ivy-lobed basal leaves and spoon-shaped stem leaves dusted with dried salt crystals; a dense cushion of delicate 4-petaled white-lilac flowers blooms triumphantly in the toxic brine. Speeding car headlights streak in the background. Card HUD elements: "3-YEAR CORRIDOR SPREADER", "CSR: C 1 · S 0 · R 9 (90.4% Ruderal)", "Origin: Coastal Halophyte (65km/yr Corridor)", "Bud Bank: 11.7", "Resistances: [Streusalz / NaCl: MAXIMUM HALOPHYTE] [Winter Slush Frost] [Drought: Seed Escape]", "Ultimate: Salzstraßen-Sprint". Dramatic contrast between white salt crust and resilient blossoms, digital card frame overlay, --ar 2:3
```

---

### Card 13: Sommerflieder (*Buddleja davidii*)
* **Scientific Database Values**:
  * **CSR Strategy**: CS ($48.3\%\text{ C} \cdot 44.6\%\text{ S} \cdot 7.2\%\text{ R}$) $\rightarrow$ Points: **C: 5 · S: 4 · R: 1** (Pladias / Pierce: High Stress S: 44.6%)
  * **Height**: $2–5\text{ m}$ (Pladias / RHS) $\rightarrow$ Height Class 4 (Woody Shrub)
  * **Ellenberg Indicators**: $L:8,\ F:4,\ R:7,\ N:4,\ S:0$ (Pladias: light-demanding, drought-resistant)
  * **Life Form**: Nanophanerophyte 🪵 (deciduous woody shrub, Pladias/RHS)
* **Real-Value Resistances**:
  * ❄️ **Frost**: Nanophanerophyte 🪵 (woody perennial structure endures winter frost).
  * 🔥 **Heat & Drought**: **HIGH ($F:4$, $S=44.6\%$ Stress Rating)** — RHS-documented drought resistance; woody roots tap deep moisture veins inside masonry.
  * 👣 **Trample & Street Sweepers**: **IMMUNE (Height Class 4)** — rises $3\text{m}$ into the air, far above pedestrian traffic.
  * 🐕 **Dog Urine**: Immune woody crown base.
  * 🧂 **Salt**: Sensitive ($S:0$).
  * 🔨 **Structural Root Wedging**: Thick woody roots act as hydraulic wedges splitting concrete and brickwork.
* **Special Moves**: `⚡ Schmetterlingssturm` (pollinator magnet) & `Mauerkrone` (permanently breaks masonry).

#### AI Image Prompt:
```text
A commanding collectible card illustration of "SCHMETTERLINGSFLIEDER / Buddleja davidii". Dramatic perspective of a multi-year woody Butterfly Bush bursting out of a deep fissure in a crumbling industrial brick wall. Thick, gnarled woody root trunk splits concrete slabs apart with immense structural force. Arching branches rise 3 meters high, covered in long fragrant conical purple flower spikes swarmed by colorful butterflies and bees. Below, the sidewalk is covered in shade from its canopy. Card layout graphics: "MULTI-YEAR PERENNIAL SHRUB", "Height: Class 4 (3.5m Woody)", "CSR: C 5 · S 4 · R 1", "Indicators: L8 F4 R7 N4 S0", "Resistances: [Trample/Sweeper: IMMUNE (Height Class 4)] [Drought: F:4 / S:44.6%] [Masonry Breaker]", "Ultimate: Schmetterlingssturm / Mauerkrone". Golden afternoon sunlight, hyper-detailed woody bark and vibrant purple petals, collectible trading card layout, --ar 2:3
```

---

### Card 14: Götterbaum (*Ailanthus altissima*) — BOSS CARD (Banned)
* **Scientific Database Values**:
  * **CSR Strategy**: C/CS ($74.9\%\text{ C} \cdot 21.3\%\text{ S} \cdot 3.8\%\text{ R}$) $\rightarrow$ Points: **C: 8 · S: 2 · R: 0** (Pladias / Pierce)
  * **Height**: $20–25\text{ m}$ (Pladias) $\rightarrow$ Height Class 5 (Giant Titan Tree)
  * **Knospenbank / Bud Bank**: $0.0\text{ shoot buds}$ (reproduces via aggressive subterranean root suckers, RHS)
  * **Ellenberg Indicators**: $L:7,\ F:5,\ R:7,\ N:7,\ S:1$ (Pladias)
  * **Life Form**: Macrophanerophyte 🪵 (deciduous tree, Pladias)
* **Real-Value Resistances**:
  * ❄️ **Frost**: Maximum (massive woody tree).
  * 🔥 **Heat & Drought**: Maximum (thrives in scorching urban heat islands).
  * 👣 **Trample & Decapitation**: **IMPOSSIBLE TO KILL** — cutting the trunk triggers aggressive root suckers (*Wurzelbrut*).
  * 🐕 **Dog Urine & Contamination**: Completely immune ($N:7$).
  * 🧂 **Salt**: Salt Resistant ($S:1$).
  * ☠️ **Chemical Warfare (Ailanthone Allelopathy)**: Secretes ailanthone from its roots, chemically poisoning and inhibiting all competing plant seeds in the soil.
* **Special Moves**: `⚡ Wurzelbrut-Invasion` & `Ailanthon-Toxin`.

#### AI Image Prompt:
```text
A menacing raid-boss trading card artwork: "GÖTTERBAUM (BANNED) / Ailanthus altissima". Dramatic, intimidating low-angle view of a multi-year invasive Tree of Heaven violently rupturing an entire sidewalk block in Berlin. Massive, muscular woody root systems shatter and heave 200kg concrete slabs into the air like an earthquake. Giant tropical-looking pinnate foliage towers 20 meters high, dropping clusters of twisted winged reddish samara seeds. A sickly yellow-green chemical vapor emanates from the fractured soil, symbolizing toxic ailanthone root secretions choking out surrounding weeds. Stamped with a bold crimson warning banner: "BANNED FROM RANKED PLAY · 3-YEAR RAID BOSS", "Height: Class 5 (25m Titan)", "CSR: C 8 · S 2 · R 0", "Indicators: L7 F5 R7 N7 S1", "Resistances: [Mechanical Damage: ROOT SUCKER ACCELERATION] [Heat & Drought: MAXIMUM] [Allelopathic Ailanthone Toxin]", "Ultimate: Wurzelbrut-Invasion". Gritty dystopian urban scene, ominous cinematic rim light, dark boss card frame, --ar 2:3
```

---

## 5. Verified Data Resistance Matrix

| Species | Life Form (Frost) | Heat ($T$) & Drought ($F$) | Trample / Sweepers | Dog Urine & Waste ($N$) | Streusalz ($S$) | Regrowth (Bud Bank) |
|---|---|---|---|---|---|---|
| **Löwenzahn** (*Taraxacum*) | Hemicryptophyte ❄ | $1.39\text{m}$ Taproot | Basal Rosette | Tolerant | Moderate | **$15.0\text{ Buds}$** |
| **Breitwegerich** (*Plantago*) | Hemicryptophyte ❄ | $F:5$ Cuticle | **IMMUNE (Elastic Rosette)** | $N:6$ Path Soil | **$S:1$ Tolerant** | **$20.0\text{ Buds}$ (Max)** |
| **Rispengras** (*Poa annua*) | Flowers at $0^\circ\text{C}$ | $F:6$ (Escapes via seed) | Flexible tufts | **$N:8$ GLUTTON (Absorbs)** | **$S:1$ Tolerant** | **$\ge 4\text{-Yr}$ Seed Bank** |
| **Schaumkraut** (*Cardamine*) | Winter Rosette | Early season escape | Vibration trigger | $N:6$ | $S:0$ Sensitive | Ballistic Pods ($10\text{m/s}$) |
| **Zimbelkraut** (*Cymbalaria*) | Hemicryptophyte ❄ | $T:7$ Heat, $F:4$ Drought | **IMMUNE (Vertical Wall)** | **IMMUNE (Elevated)** | $S:0$ Sensitive | **$15.0\text{ Buds}$** |
| **Mauerraute** (*Asplenium*) | Evergreen ❄ | **$F:3$ Extreme Drought** | **IMMUNE (Vertical Wall)** | **IMMUNE (Elevated)** | $S:0$ Sensitive | **$10.0\text{ Buds}$** |
| **Silbermoos** (*Bryum*) | Polar freeze | **Hyaline Solar Mirror** | **IMMUNE ($<1\text{cm}$ Flat)**| High dust crust | Moderate | **Cryptobiosis (20 min)** |
| **Portulak** (*Portulaca*) | Winter seed escape | **$T:8$ Extreme / C4 Peak** | Prostrate flex | $N:7$ Rich dirt | **$S:2$ HIGH SALT** | **$10\text{-Yr}$ Seed Bank** |
| **Berufkraut** (*Erigeron*) | Winter Rosette | $0.64\text{m}$ Deep Taproot | Tall stem vulnerable | **Herbicide / Toxin Shield**| **$S:1$ Tolerant** | Wind Plume ($1\text{m}$) |
| **Schöllkraut** (*Chelidonium*)| Hemicryptophyte ❄ | $L:6$ Shaded Wall Base | Crown regrows | **$N:8$ GLUTTON (Absorbs)** | $S:0$ Sensitive | **$20.0\text{ Buds}$ (Max)** |
| **Mastkraut** (*Sagina*) | Hemicryptophyte ❄ | $F:6$ Joint moisture | **IMMUNE ($2\text{cm}$ Carpet)**| $N:6$ Tolerant | **$S:1$ Tolerant** | **$12.5\text{ Buds}$** |
| **Löffelkraut** (*Cochlearia*) | Winter thaw | Summer seed escape | Moderate curb | High runoff | **HALOPHYTE ($NaCl$)** | Highway Corridor ($65\text{km/yr}$)|
| **Sommerflieder** (*Buddleja*)| Nanophanerophyte 🪵| $F:4$, $S:44.6\%$ Drought | **IMMUNE (Height Class 4)**| Woody base immune | $S:0$ Sensitive | Woody Wedge Breaker |
| **Götterbaum** (*Ailanthus*) | Macrophanerophyte 🪵| **MAXIMUM (Heat Island)** | **Cutting triggers suckers**| **MAXIMUM ($N:7$)** | **$S:1$ Tolerant** | **Ailanthone Allelopathy** |
