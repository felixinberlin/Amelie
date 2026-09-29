# Commercial Opportunity: ProcureLens Pro (VergabePilot B2B)

**ID:** `procure-lens-pro`  
**Amélie Twin:** `procure-lens` / `ausschreibungs-fluglotse` (PR #94 / #111)  
**Status:** Criteria Extracted  
**Category:** B2B Compliance & Public Tender SaaS  
**Target Buyer:** European SMEs, IT Consultancies, Engineering Contractors, and Defense Suppliers bidding on public sector contracts  

---

## 1. The Core Commercial Problem
Public sector contracts in Germany and the EU (governed by VgV, UVgO, VOB/A, and TED eForms) represent a €2+ trillion annual market. However, preparing tender submissions is fraught with bureaucratic disqualification traps.
- **The Pain:** Bidders routinely spend 50–120 hours compiling proposals only to be rejected in formal pre-qualification (*Formelle Ausschlussgründe*) due to missing declarations of self-cleaning, outdated commercial register extracts, or misread minimum turnover criteria.
- **The Current Alternative:** Dedicated bid management agencies (€5,000–€15,000 per tender) or fragmented notification portals (Vergabe24, TED, Bund.de) that offer search alerts but zero pre-flight bid audit capabilities.
- **The Solution:** A specialized B2B compliance pre-flight checker: Ingests public tender dossiers (TED XML / eForms / PDF tender specs) $\to$ automatically extracts all mandatory formal submission requirements (*Eignungskriterien*, *Ausschlussgründe*, *Mindestanforderungen*) $\to$ provides bidders with an automated pre-submission checklist and compliance verification report before bid submission.

---

## 2. The 5 Commercial Vectors

| Vector | Rating | Analysis |
|---|:---:|---|
| **1. Pain & WTP** | **5/5** | Huge financial stakes. Winning a single public tender yields €50,000 to €5,000,000+ in revenue. Bidders eagerly pay €99–€390/month or €49 per tender report to eliminate the risk of formal disqualification. |
| **2. Time-to-Ship** | **4/5** | **$\le 7$ days.** Leverages standard EU eForms schemas (XML/JSON) and structured VgV/VOB checklists. Uses deterministic document parsing + targeted LLM extraction against standard qualification schemas. |
| **3. Distribution** | **4/5** | High-intent search traffic around CPV tender codes, public tender portals (TED, Vergabe.Bund.de, Evergabe), and German bidding forums (Vergabeblog). |
| **4. Monetization** | **5/5** | High-tier SaaS: €99/mo (Starter: 5 tenders/mo), €249/mo (Pro: unlimited + team audit), or €49 one-off per tender pre-flight check via Stripe. |
| **5. Defensibility** | **4/5** | Grounded in rigid statutory procurement rules (VgV § 57, GWB § 122–126). Hard rules for exclusion grounds and compliance criteria that generic LLMs fail without domain-grounded schemas. |

---

## 3. Minimum Viable Product (MVP) Scope
1. **Intake:** Ingest tender URL (Bund.de / TED / DTVP) or upload tender documents (PDF/ZIP).
2. **Deterministic Extraction:** Parses CPV code, execution deadline, formal exclusion criteria (§ 123/124 GWB), and required suitability proofs.
3. **Pre-Flight Audit Sheet:** Visual interactive checklist (*Green/Yellow/Red*) showing missing certificates, declarations, and proof deadlines.
4. **Paywall:** Free tender summary $\to$ €49 / subscription unlock for full Pre-Flight Audit Checklist and compliance certificate pack.
