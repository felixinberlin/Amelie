# Commercial Opportunity: DoppikDiff Pro

**ID:** `doppik-diff-pro`  
**Amélie Twin:** `haushaltslupe` (PR #123)  
**Status:** Criteria Extracted  
**Category:** GovTech / Vertical SaaS for Municipal Finance  
**Target Buyer:** Municipal Consulting Firms (Rödl & Partner, PwC Public Sector, BDO), Local Council Factions (CDU/SPD/Grüne/FDP Fraktionen), State Audit Courts (*Landesrechnungshöfe*)  

---

## 1. The Core Commercial Problem
German municipalities manage €350+ billion in public funds across multi-thousand-page budgetary books (*Haushaltspläne*). When city administrations introduce supplementary budgets (*Nachtragshaushalte*), multi-million-euro reallocations are buried across opaque line items (*Teilfinanzhaushalte / Produktbereiche*).
- **The Pain:** Local council members (*Gemeinderäte, Stadträte, Bezirksverordnete*) and financial audit consultancies have only 10–14 days to review supplementary budgets before legislative votes. Manually comparing 800-page Doppik tables item-by-item is impossible, leading to missed deficits, unnoticed fund diversions, and political embarrassment.
- **The Current Alternative:** Manual PDF search and high-cost retainer engagements with municipal audit firms (€15,000–€30,000 per budget cycle).
- **The Solution:** A specialized differential analyzer for German municipal chart of accounts (NKF / Doppik). It parses municipal budget PDFs, extracts product accounts (*Produktkonten*), and outputs a side-by-side visual diff showing every reallocated euro with automated anomaly flags.

---

## 2. The 5 Commercial Vectors

| Vector | Rating | Analysis |
|---|:---:|---|
| **1. Pain & WTP** | **4/5** | High political and advisory value. Political factions easily expense €149/month from their municipal faction allowances (*Fraktionsmittel*); consulting firms bill the output to clients at a 5x markup. |
| **2. Time-to-Ship** | **4/5** | **$\le 10$ days.** Robust PDF table parser (using PyMuPDF / Camelot / pdfplumber) tuned specifically for German municipal Doppik layouts. |
| **3. Distribution** | **4/5** | Direct outreach to municipal faction leaders (*Fraktionsvorsitzende*) and municipal associations (*Städte- und Gemeindebund*, *Deutscher Städtetag*). |
| **4. Monetization** | **4/5** | €149/month SaaS subscription for council members/factions; €890 per supplementary budget audit report for consulting firms. |
| **5. Defensibility** | **4/5** | Domain knowledge of German municipal accounting standards (NKF, GemHVO der Bundesländer) and automated error-detection heuristics. |

---

## 3. Minimum Viable Product (MVP) Scope
1. **Doppik PDF Parser:** Ingests primary budget and supplementary budget PDFs.
2. **Product Code Normalizer:** Normalizes product accounts (e.g., Produkt 51.10.01 - *Öffentliches Grün*) across fiscal years.
3. **Differential Engine:** Computes exact delta in revenue, operational expenses (*Sach- und Dienstleistungen*), and capital expenditures (*Investitionsauszahlungen*).
4. **Executive Briefing Generator:** Automated 3-page summary highlighting the top 10 largest budget shifts for council debates.
