# Commercial Opportunity: CyanoWatch Pro

**ID:** `cyanowatch-pro`  
**Amélie Twin:** `aquascan-sentinel` (PR #145)  
**Status:** Criteria Extracted  
**Category:** B2B Environmental API / Water Management SaaS  
**Target Buyer:** Municipal Waterworks, Regional Tourism Authorities, Bathing Lake Operators, Water Sports Associations  

---

## 1. The Core Commercial Problem
Under the EU Bathing Water Directive (*Badegewässer-Richtlinie 2006/7/EG*) and Water Framework Directive (WFD), operators of public bathing sites and water reservoirs must monitor cyanobacteria (toxic blue-green algae) blooms and water turbidity.
- **The Pain:** Sudden cyanobacteria blooms produce microcystin toxins, causing acute health hazards for swimmers and pets. Unpredicted beach closures during peak summer weekends result in massive revenue losses for regional tourism, while delayed warnings expose municipalities to legal liability.
- **The Current Alternative:** Manual water grab-sampling by municipal health offices (*Gesundheitsämter*) conducted once every 2–4 weeks. Lab results take 48–72 hours, by which time the toxic bloom may have already peaked or subsided.
- **The Solution:** Automated Copernicus Sentinel-2 satellite pipeline running on a 5-day cadence. It computes Normalized Difference Chlorophyll Index (NDCI) and Total Suspended Matter (TSM) algorithms for subscribed lake coordinates, delivering automated SMS/webhook alerts 48 hours before visible shore contamination.

---

## 2. The 5 Commercial Vectors

| Vector | Rating | Analysis |
|---|:---:|---|
| **1. Pain & WTP** | **4/5** | High public health liability and immediate commercial losses for recreational operators. €390/month per lake region is far cheaper than €1,500 emergency water testing. |
| **2. Time-to-Ship** | **4/5** | **$\le 14$ days.** Sentinel Hub / Planetary Computer API integration + validated NDCI spectral band math (B05/B04). |
| **3. Distribution** | **4/5** | Regional tourism boards, Association of German Swimming Masters (*BDS*), municipal water utility associations (*VKU*). |
| **4. Monetization** | **4/5** | €390/month per lake region during swimming season (May–September), or €1,900 annual package including winter reservoir monitoring. |
| **5. Defensibility** | **4/5** | Calibrated regional atmospheric correction pipelines for small inland water bodies (< 5 ha) where standard global marine models fail. |

---

## 3. Minimum Viable Product (MVP) Scope
1. **Lake Coordinate Register:** User enters lake polygon or centroid coordinates.
2. **Sentinel-2 Processing Pipeline:** Fetches Level-2A imagery, masks clouds, and calculates NDCI index.
3. **Early Warning Thresholds:** Automated alerts when chlorophyll-a index exceeds 25 µg/l (warning) or 50 µg/l (critical bloom).
4. **Public Widget & Dashboard:** Embeddable status badge for municipal tourism websites ("Wasserqualität: Ausgezeichnet").
