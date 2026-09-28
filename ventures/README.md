# Ventures Hub: The Parallel Commercial Lab

> *"Amélie uncovers the gaps. Ventures captures the economic value."*

This directory houses the commercial twin of the Amélie discovery engine. While **Amélie** gifts software tools to public institutions and civil society under CC0, **Ventures** turns high-leverage commercial findings into revenue-generating software (Micro-SaaS, B2B compliance tools, and developer assets) to fund ongoing research and AI compute credits.

---

## 1. The Gabel-Triage (Bifurcated Pipeline)

When the 3 Amélie discovery engines (`scout`, `collider`, `inversion`) run, ideas are routed by the `idea-reviewer`:

```
                       [Discovery Engines]
                                │
                     [Unified Candidate Pool]
                                │
                  ┌─────────────┴─────────────┐
                  ▼                           ▼
        [Civic Route (Amélie)]      [Market Route (Ventures)]
        • Target: NGOs, Unis, Gov   • Target: B2B, Retailers, Devs
        • License: CC0 Public Domain• License: Commercial / Paid
        • Arch: Zero-Cloud / Static • Arch: Micro-SaaS / Pro SDK
        • Dest: 05-dosen/           • Dest: ventures/
```

---

## 2. The 5 Commercial Vectors

Every commercial opportunity in this directory is audited against five market vectors:

| Vector | Metric | Threshold |
|---|---|---|
| **1. Pain & WTP** | Statutory fine avoidance, compliance audit cost, direct dev time. | High immediate financial risk or cost. |
| **2. Time-to-Ship (TTS)** | Speed to deliver a working MVP. | $\le 7$ days using deterministic engines. |
| **3. Distribution Channel** | How customers find it without cold calls. | Regulatory deadlines, search intent, dev communities. |
| **4. Monetization Shape** | Pricing model. | One-time license ($79–$299) or SaaS (€49–€490/mo). |
| **5. Defensibility** | Barrier to entry. | Deterministic parsers / physics / compliance logic (not naive prompts). |

---

## 3. Directory Layout

```
ventures/
├── README.md               # Operating manual & commercial criteria
├── funding-and-angels.md   # Comprehensive investor & grant guide (Angels, EU, Grants)
├── kapital-und-kanaele.md  # Solo founder economics, Merchant of Record, GründungsBONUS, B2G channels
├── market-leads.json       # Structured ledger of commercial leads (auto-exported)
└── opportunities/          # Detailed product dossiers & MVP specifications
    ├── espr-discloseready.md
    ├── wet-ink-pro-sdk.md
    ├── zero-drift-swarm-kit.md
    └── clp-chemical-safety-api.md
```

---

## 4. Mechanical Commands

- **Export new leads from Amélie:** `npm run export:market`
- **Audit current opportunities:** `node scripts/export-market-leads.mjs --status`

---

## 5. Active Feature Branches & Session Continuity

- **Local Branch `feat/venture-leads-round-2`:**
  - Houses the latest batch of commercial leads and opportunity dossiers extracted from the September 28, 2026 discovery runs:
    - `ventures/opportunities/spdx-driftguard-ci.md` (SPDX license whitelist CI guard against copyleft/AGPL drift)
    - `ventures/opportunities/procure-lens-pro.md` (VergabePilot B2B / tender pre-flight audit against formal disqualification)
    - `ventures/market-leads.json` (10 active leads)
  - Kept on a dedicated local branch to maintain strict architectural separation from Amélie's public CC0 `main` branch until ready for commercial dispatch. To work on these leads in a new session: `git checkout feat/venture-leads-round-2`.

---

## Funding inputs

Capital and grant sources for the commercial twins:
- **Strategy, Stage-Roadmap & Pitch-Matrix:** See [funding-and-angels.md](funding-and-angels.md) (BAND, EBAN, INVEST 25% rebate, HTGF, Earlybird Vision Lab).
- **Solo-Founder Economics, Kanäle & Competitor-Checks:** See [kapital-und-kanaele.md](kapital-und-kanaele.md) (IBB GründungsBONUS Plus, Merchant of Record, TinySeed, Calm Company Fund, Complir warning, Bund Direktvergabe bis 50k €).
- **Komplette Förderlandkarte:** Siehe Abschnitt E in `06-suche/amelie-foerderlandschaft.md` und `06-suche/amelie-foerder-und-preisatlas.md`.

