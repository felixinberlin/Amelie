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
