---
name: idea-reviewer
description: Multi-vector classification, stress-testing, and architectural triage for public-good app ideas in Amélie. Bridges the three discovery engines (amelie-ideenrunde, lacunar-bisociation, asymmetric-inversion) and packaging/delivery. Evaluates candidates across 7 structured vectors: Novelty (Boden taxonomy & Lacunar gap), Complexity (architectural tier & sensor dependency), Possibility/Feasibility ("Why Now" & physics/law reality-check), Future/Longevity (regulatory runway & maintenance half-life), Grounded SWOT (civic gift resilience), Tech Tree Position (roots, trunk, branches), and Available Documentation (Type A–D ground truth fidelity). Use whenever evaluating, reviewing, classifying, or stress-testing an idea — "review idea", "classify idea", "vektoren", "SWOT", "tech tree", "ideenevaluation", "prüfe die Machbarkeit", "stresstest", or before packing a candidate into an Amélie Dose.
---

# Amélie — Idea Reviewer & Vector Classifier

A systematic protocol for auditing, classifying, and stress-testing public-good app ideas across seven rigorous structural vectors.

---

## 1. Why this skill exists

Amélie operates three distinct idea discovery engines:
1. **`amelie-ideenrunde`**: Empirical primary-source scavenging (digging into manual bottlenecks and unautomated evaluation schemes).
2. **`lacunar-bisociation`**: Analogical and combinational collision (crossing distant frames to expose genuine conceptual gaps).
3. **`asymmetric-inversion`**: Systemic and regulatory inversion (flipping crowded industrial/compliance pipelines into citizen counter-tools).

However, raw discovery engines suffer from optimism bias: ideas sound clever, gaps appear real, and novelties seem transformative until subjected to physics, legal liability, architecture tiers, or maintenance reality. 

The **Idea Reviewer & Vector Classifier** acts as the independent auditor. It does not invent ideas; it **measures, classifies, and stress-tests them** before they reach the packaging stage (`05-dosen/`) or delivery dispatch.

---

## 2. State and Memory

The reviewer separates static evaluation rubrics from cumulative review records:

| State File | Location | Contents |
|---|---|---|
| `amelie-classification-log.md` | `06-suche/` | Cumulative ledger of all reviewed ideas, 7-vector scorecards, SWOT profiles, tech-tree nodes, and triage recommendations. |
| `amelie-pruefprotokoll.md` | `06-suche/` | Shared existence verdicts (`[reviewed]`). |
| `amelie-suchplaybook.md` | `06-suche/` | Updated Besetzungsatlas and methodology retro. |
| `08-friedhof/README.md` | `08-friedhof/` | Autopsy records for ideas killed during review. |

If `06-suche/amelie-classification-log.md` does not yet exist, initialize it from `assets/classification-log-template.md`.

---

## 3. The 7-Vector Classification Matrix

Every idea submitted to the Reviewer is evaluated against seven explicit vectors. Each vector produces a qualitative verdict, a quantitative score (1–5 scale, where 3 is acceptable threshold and 5 is exceptional), and concrete grounding evidence.

```
       [1] Novelty (Boden/Lacunar)
                ^
  [7] Ground Truth     [2] Complexity (Tier)
          \       /
           [ IDEA ] ---- [3] Possibility (Why Now)
          /       \
  [6] Tech Tree        [4] Future / Longevity
                v
        [5] Civic SWOT
```

### Vector 1 · Novelty & Distance (Boden & Lacunar Criteria)
* **Boden Taxonomy**:
  * *Combinational*: Recombines familiar tools without shifting rules ($V_1 \le 2$).
  * *Exploratory*: Pushes existing boundaries within an established standard ($V_1 = 3\text{--}4$).
  * *Transformational*: Alters the underlying rule space, making previously impossible workflows trivial ($V_1 = 5$).
* **The Lacunar Gap Test**: Can the gap be stated in one sentence *without naming the technical solution*? (e.g., *"Tenants have no non-destructive way to verify if basement risers are lead"* vs. *"An app that detects lead with a camera"*).
* **Prior Art & Recombination Penalty**: Deduct points if the idea is simply "X for Y" or has been built by commercial startups within the last 24 months.

### Vector 2 · Technical Complexity & Execution Burden
* **Architectural Tiers**:
  * **Tier 1 (Zero-Cloud / Static)**: 100% client-side HTML5/TS, WebGL/WebGPU, Web Audio, or WASM. Zero external server, zero database ($V_2 = 1\text{--}2$, Best for Amélie gifts).
  * **Tier 2 (Static Open Data Hybrid)**: Client-side engine querying pre-compiled static assets (PMTiles, GeoJSON, KOSTRA precipitation raster, SQLite WASM) hosted on GitHub Pages ($V_2 = 3$).
  * **Tier 3 (Ephemeral API Bridge)**: Minimal CORS-proxy or ephemeral public API query without persistent state ($V_2 = 4$).
  * **Tier 4 (Heavy Backend / Persistent Database)**: Requires PostgreSQL, continuous background scrapers, or user accounts. **Red flag for Amélie Rule 4** ($V_2 = 5$).
* **Hardware & Sensor Dependency**: Pure smartphone camera/audio/touch vs. external specialized hardware (microscopes, sensors). External hardware incurs a severe feasibility penalty.

### Vector 3 · Possibility & "Why Now" Reality Check
* **The Technical Catalyst**: What commodity edge capability, open dataset, or browser standard makes this buildable *now* that was impossible or unaffordable before 2024?
* **Physics & Signal-to-Noise Reality**: Does the physical measurement make sense? (e.g. Can an iPhone microphone distinguish a 50 Hz pipe hum from ambient traffic? Does a camera macro lens resolve solder seam geometry under basement lighting?).
* **Legal & Privacy Viability**: Does it comply with GDPR Art. 6/9? Operating 100% on-device eliminates GDPR data controller liabilities.

### Vector 4 · Future Runway, Policy Alignment & Longevity
* **Regulatory Tailwind**: Is the problem backed by an expanding EU directive, DIN norm, or statutory deadline (e.g. TrinkwV 2026, EPBD, ESPR, EU Nature Restoration Law) or is it tied to a temporary commercial hype?
* **Maintenance Half-Life**: If the repository is handed over to an NGO or university with zero dedicated dev budget, will it still run in 36 months without bitrot? (Static TypeScript on GitHub Pages has an infinite maintenance half-life; Node.js backend microservices rot in 6 months).
* **Civic Leverage**: Does this gift unblock thousands of citizens, volunteers, or field workers, or is it an esoteric edge case?

### Vector 5 · Grounded Civic SWOT Analysis
Standard corporate SWOT fails for public-good gifts. The Reviewer applies Amélie's **Civic SWOT Framework** (detailed in `references/swot-civic-standards.md`):
* **Strengths (S)**: Unconditional CC0 gift, zero account barrier, defense against patent trolls, privacy-by-design.
* **Weaknesses (W)**: Non-destructive limitations, lack of official laboratory certification, reliance on citizen discipline.
* **Opportunities (O)**: Adoption by municipal open-data labs (CityLAB), university research integration, Prototype Fund funding.
* **Threats (T)**: Hostile vendor lock-in, legal pushback from property owner associations, big tech embedding commodity feature.

### Vector 6 · Tech Tree Position & Capability Dependency Graph
Maps where the idea lives within the broader open-source knowledge graph:
* **Roots (Prerequisites)**: What libraries, models, and specs must be in place? (e.g., Web Audio API FFT, WebGPU compute shaders, Tesseract WASM, EPSG:25833 projection routines).
* **Trunk (Core Scaffolding / First Step Ticket)**: What is the minimal, standalone, testable kernel that proves the concept? (The First Step Ticket criteria).
* **Branches (Downstream Unlocks)**: What future applications, civic campaigns, or scientific studies does this tool unlock once published?

### Vector 7 · Available Documentation & Ground Truth Fidelity
* **Source Classification**:
  * **Type A**: Official technical norm, DIN/EN/VDI standard, municipal statute (*Satzung*), published fee schedule (*Gebührenordnung*).
  * **Type B**: Institutional report with explicitly stated manual evaluation bottleneck (e.g., Thünen, MonViA).
  * **Type C**: Public AI trial / pilot workshop reports with documented failure modes (e.g., CompGen).
  * **Type D**: Academic peer-reviewed research papers (arXiv, ECCV, Springer) with proven algorithms but no end-user tool.
* **Ground Truth Fidelity**: Are cited numerical thresholds ($\theta$, dB, KBE, kf, $U$-values) verified directly from original primary texts or scraped from third-party blogs?

---

## 4. The Review Protocol (Step by Step)

### Step 0 · Intake & Input Normalization
1. Receive idea candidate from user or from discovery logs (`06-suche/`).
2. Identify origin method: `amelie-ideenrunde`, `lacunar-bisociation`, `asymmetric-inversion`, or `user-proposal`.
3. Check graveyard (`08-friedhof/README.md`) to verify idea is not already dead.

### Step 1 · Vector Evaluation
Evaluate the candidate across all 7 vectors using the rubrics in `references/vector-rubrics.md`. Assign integer scores (1–5) and write 1–2 grounding sentences per vector.

### Step 2 · Tech Tree Mapping
Draft the 3-level ASCII or Mermaid Tech Tree (Roots $\to$ Trunk $\to$ Branches).

### Step 3 · Civic SWOT Synthesis
Compile the 4-quadrant Civic SWOT table, identifying the single most fatal threat (*The Achilles Heel*) and the strongest defensibility anchor.

### Step 4 · Synthesis & Triage Verdict
Synthesize scores into a composite recommendation:
* **`Dose Ready (Packen)`**: Score $\ge 24/35$, no vector $< 3$, Tier 1/2 complexity, verified Type A/B/D source. Ready for `05-dosen/` packaging.
* **`Verengt (Narrowed Pivot)`**: Strong core idea, but direct implementation hits crowded fields or requires enterprise architecture. Formulate the single narrow residual gap.
* **`Needs Research (Unklar)`**: Ground truth numbers ambiguous or physics signal-to-noise unverified. Pass back to discovery engine.
* **`Graveyard Candidate (Friedhof)`**: Fails "Why Now", duplicates commercial software $\le 12$ months old, or fails physical/legal reality-check. Formulate the death certificate.

### Step 5 · Log & Output
1. Append the full review to `06-suche/amelie-classification-log.md`.
2. Present the user with the structured Review Scorecard, Tech Tree, SWOT, and Triage Verdict.

---

## 5. Standard Output Format

```markdown
### Review Scorecard: [Idea Title] (`id`)
**Origin:** [Method] · **Category:** [Domain] · **Intended Recipient:** [Recipient]

#### 1. Vector Radar (Score: [Total]/35)
| Vector | Score (1-5) | Key Finding / Grounding |
|---|:---:|---|
| **V1 · Novelty** | X/5 | [Boden type + Lacunar gap sentence] |
| **V2 · Complexity** | X/5 | [Architecture Tier + sensor burden] |
| **V3 · Possibility** | X/5 | ["Why Now" enabler + physics validity] |
| **V4 · Future/Longevity** | X/5 | [Regulatory runway + maintenance half-life] |
| **V5 · Civic SWOT** | X/5 | [Defensibility & Achilles heel] |
| **V6 · Tech Tree** | X/5 | [Root prerequisites & downstream unlocks] |
| **V7 · Documentation** | X/5 | [Source Type A-D + primary fidelity] |

#### 2. Tech Tree Position
```
[Roots / Prerequisites]
        └── [Trunk: Minimal Core Scaffolding]
                    ├── [Branch A: Immediate Civic Tool]
                    └── [Branch B: Scientific / Downstream Unlock]
```

#### 3. Civic SWOT
| Strengths (S) | Weaknesses (W) |
|---|---|
| • ... | • ... |
| **Opportunities (O)** | **Threats (T)** |
| • ... | • ... |

#### 4. Synthesis Verdict & Triage
* **Verdict:** `[Dose Ready | Verengt | Needs Research | Friedhof]`
* **The Residual Gap / Condition:** [One sharp sentence]
* **Actionable Next Step:** [Concrete engineering ticket or search mandate]
```

---

## References

- `references/vector-rubrics.md` — Detailed quantitative scoring scales and calibration cases.
- `references/tech-tree-framework.md` — Guidelines for mapping open-source capability trees.
- `references/swot-civic-standards.md` — Ground rules for civic & public-good SWOT analysis.
- `references/skill-update.md` — Protocol for refining evaluation rubrics.
- `assets/classification-log-template.md` — State file template.
