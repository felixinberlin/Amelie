# Commercial Opportunity: CLP Chemical Safety API & Audit Engine

**ID:** `clp-chemical-safety-api`  
**Amélie Twin:** `dose-cleaner-chemical-safety` (ChemGefahr-Stopp)  
**Status:** Engine Verified (`src/engine/chemhazard/chemHazardEngine.test.ts`)  
**Category:** B2B Health & Safety Compliance API  
**Target Buyer:** Commercial Cleaning Companies, Facility Management Giants (Wisag, Dussmann, Gegenbauer), Hospital Sanitation Systems  

---

## 1. The Core Commercial Problem
Accidental mixing of chemical cleaning agents (e.g. acid toilet cleaners containing amidosulfonic acid with sodium hypochlorite chlorine bleaches) generates deadly chlorine gas ($Cl_2$). In the EU, occupational safety regulations hold facility managers personally liable for chemical incidents.
- **The Pain:** Facility managers struggle to audit procurement catalogs and field workers' mobile carts for fatal combination risks. Existing safety datasheets (SDB) are 15-page PDFs unreadable on the job.
- **The Solution:** A deterministic chemical incompatibility API: Ingest supplier product lists or EAN barcodes $\to$ extract EU CLP statements (e.g. EUH031 "Contact with acids liberates toxic gas") $\to$ emit formal safety cases (Never Emits "Safe" - either hard STOP or UNVERIFIED).

---

## 2. The 5 Commercial Vectors

| Vector | Rating | Analysis |
|---|:---:|---|
| **1. Pain & WTP** | **5/5** | Employer liability, BG Bau accident insurance compliance, bodily injury prevention. |
| **2. Time-to-Ship** | **4/5** | Deterministic hazard engine with 12 Vitest tests already verified in `src/engine/chemhazard/`. |
| **3. Distribution** | **4/5** | Direct outreach to facility management software providers (ERP/CAFM integrations) and cleaning associations (BIV). |
| **4. Monetization** | **4/5** | API subscription (€199 – €790/month based on product catalog size / barcode lookups). |
| **5. Defensibility** | **5/5** | Formal safety case architecture: rejection of false reassurance (never emits a naive "clear/safe"), strictly grounded in European chemical regulations. |
