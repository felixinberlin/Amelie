# Commercial Opportunity: ESPR DiscloseReady

**ID:** `espr-discloseready`  
**Amélie Twin:** `vernichtungs-offenlegungsregister` (Dose #42)  
**Status:** Ready to Scaffold (Ticket 01 engine complete)  
**Category:** B2B Compliance Micro-SaaS  
**Target Buyer:** European Retailers, Fashion & Consumer Tech Brands, E-Commerce Operators  

---

## 1. The Core Commercial Problem
Under **Article 24 of the EU Ecodesign for Sustainable Products Regulation (ESPR)** and **Implementing Regulation (EU) 2026/2**, large and medium consumer goods companies must publicly disclose the volume, weight, CN categories, disposal reasons, and derogation rationale for unsold goods destroyed annually.
- **The Pain:** Violations incur direct statutory fines and severe ESG reputational damage.
- **The Current Alternative:** Companies pay €15,000–€35,000 to ESG consultancy firms (PwC, KPMG, Deloitte) for manual compliance advisory.
- **The Solution:** A specialized web portal: Upload warehouse inventory scrap reports (CSV/Excel) $\to$ deterministic mapping to Annex I CN-codes $\to$ generate audit-ready Annex I PDF/XLSX disclosure report with legally sound derogation text.

---

## 2. The 5 Commercial Vectors

| Vector | Rating | Analysis |
|---|:---:|---|
| **1. Pain & WTP** | **5/5** | High financial fine avoidance. Annual compliance budget already allocated. |
| **2. Time-to-Ship** | **4/5** | Core calculation engine is **already built and tested** in `07-demos/vernichtungs-offenlegungsregister/` (28 Vitest tests). Only needs an upload UI and PDF generator. |
| **3. Distribution** | **5/5** | Regulatory deadline driven. High search volume for "ESPR Article 24 disclosure template", "Implementing Regulation 2026/2 Annex I generator". |
| **4. Monetization** | **4/5** | €490 – €1,490 per annual report filing or €99/month subscription. |
| **5. Defensibility** | **5/5** | Complex legal logic: conditional disclosure mandates, CN-code tax classification, and strictly bounded derogation categories that naive LLMs hallucinate. |

---

## 3. Minimum Viable Product (MVP) Scope
1. **Frontend:** Single-page upload dropzone (CSV/Excel with SKU, description, units destroyed, reason).
2. **Deterministic Engine:** Reuses `src/engine/vernichtungs-offenlegungsregister/offenlegungsPruefer.ts`.
3. **Export:** Download official Annex I formatted PDF + audit-trail spreadsheet.
4. **Checkout:** Stripe / Lemon Squeezy paywall on export.
