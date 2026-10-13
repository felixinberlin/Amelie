---
status: Delivered
delivery_method: E-Mail
target_maker: BIV
review_score: 34/35
architecture_tier: Tier 1
source_type: Type A
---
# ChemHazard Stop / MischStop

*(German: ChemGefahr-Stopp — Quelloffener Misch-Warn-Assistent für Reinigungskräfte)*

**One sentence:** Name two cleaning products and a rule engine that runs without a server warns about dangerous mixtures such as acid + chlorine bleach. It never says "safe", only STOP, "cannot verify" or "no known incompatibility". Camera scanning and a mobile app are not built yet.

**As of:** 27.09.2026, text revised 13.10.2026 · **Recheck by:** March 2027  
**Recipient:** BIV (Federal Association of Contract Cleaners) · EU-OSHA · Service Employees International Union (SEIU) · IG BAU · BG BAU · DGUV · EFCI · European Cleaning and Facility Services Industry  
**Verdict:** 🎁 **gift**  
**Review:** 34/35 · Tier 1 · Type A (Details: [Review Dossier](../../06-suche/amelie-classification-log.md))

---

![Illustration (not the demo): smartphone warns about acidic descaler and chlorine bleach](/chemhazard-stop.jpg)

> **What exists today and what does not (13 Oct 2026)**
> - **Built and tested:** rule engine with three states (STOP, UNVERIFIED, grey without clearance), 45 real products from manufacturers' safety data sheets, web demo with product picker or GTIN/UFI input. On STOP: warning tone, vibration (where the browser allows) and the warning spoken via the browser's speech synthesis in 7 languages (DE, EN, UK, PL, TR, AR, RO).
> - **Not built:** camera scanning of containers and label OCR (ticket 02), recorded voice warnings and alarm control in a mobile app (ticket 03).
> - **Next ticket:** [ticket 04](../../07-demos/chemhazard-stop/ticket-04-web-scanner-und-qr-etiketten.md): barcode/QR camera scan in the browser and QR labels for refill bottles, offline.
> - **Correction:** Until 12 Oct 2026 the chlorine-gas rule required `EUH031` on a label; Dan Klorix (`EUH206`) and Domestos Professional (neither phrase) mixed with an acid gave no warning. Fixed. The emails of 27 Sep 2026 also described camera scanning, 20+ languages and a 15 Hz strobe. That was not true, and 15 Hz would be a seizure risk for people with photosensitive epilepsy (WCAG 2.3.1: at most 3 flashes per second). Correction draft: `03-zuordnung/mails-q4-2026/mail-11b-korrektur.md`.

> 📹 **Video:** [watch on Google Drive](https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link) *(on-demand streaming, 0 KB initial load burden)*



Source review 12 October 2026: 41 real products plus two synthetic examples, 92 GTIN mappings (91 confirmed), and 36 documented current manufacturer source versions. Added 21 DR.SCHNELL products with manufacturer SDS and EAN evidence; the 2025 Meffert SDS replaces its retailer copy. GTIN/UFI must identify exactly one record; GISCODE is display-only. All chemical-completeness reviews remain pending; five new records retain unknown groups. Dan Klorix remains unconfirmed for barcode lookup, and Buzil/Domestos current sources remain unresolved. Mellerud remains an ingredient datasheet without a complete SDS. pH measured at 1% dilution is not treated as concentrate pH. Receipts and remaining work: `07-demos/chemhazard-stop/product-review-2026-10-12.md`. Tests establish software invariants, not chemical safety certification.


Addition after PR #202: Four further manufacturer products (PEROTEX INTENSIV, GASTRO PUR ECO, MILIFEE, PEROCID ECO) are selectable with unknown hazards and unconfirmed GTIN mappings. All 43 source-review records remain unchanged. Current catalogue: 45 real products (41 with sourced hazards, four unreviewed) plus two synthetic examples; 96 GTIN mappings (91 confirmed). New entries remain UNVERIFIED.

## The problem

Commercial cleaners work under extreme speed pressure, frequently navigating severe language barriers. Accidental mixing of an acidic descaler with a hypochlorite bleach releases deadly chlorine gas into confined, poorly ventilated restrooms and custodial closets.

The hazard has been documented for decades, and mixing bans are textbook knowledge — yet accidents happen repeatedly. The root cause: safety warnings remain locked inside 15-page technical Safety Data Sheets (SDS) or German workplace operating instructions in office binders that nobody consults mid-shift.

Germany already operates world-class reference systems: WINGIS/GISBAU (hazardous substance information, GISCODE, operating instructions), GESTIS/IFA, GSApp, CERTISCAN, and DGUV rule 101-019. However, every single one of these is lookup-based. None of them stands between a worker and two bottles at the physical moment of mixing. As of September 2026, no open-source, camera-based, dual-bottle mixing interlock exists on the market. That is the gap.

## Core Principle: Tested Software Invariants

**The app never certifies safety. It only warns of detected danger, or admits it cannot verify.**

This is not a UX preference; it is the fundamental safety case. A false "all clear" (green checkmark) is lethal and far worse than having no app at all. Every design rule strictly follows from this premise:
1. **No green screen, ever.** There is no clearance state.
2. **Unknown identity yields UNVERIFIED; pending reviews must never weaken a supported STOP.**
3. **Community or unverified data can never override a STOP.**
4. **Assistive Warning Aid:** The app is an assistive warning aid, not certified personal protective equipment (PPE), not a compliance tool, and not a replacement for the employer's statutory risk assessment under GefStoffV and DGUV 101-019.

### The Three System Outcomes

| State | Signal | Meaning & Mandatory Copy |
|---|---|---|
| 🔴 **STOP** | High-contrast red screen, loud multilingual voice, repeating haptic vibration, alarm tone | Dangerous chemical combination detected in the local database (e.g., acid + hypochlorite $\to$ chlorine gas). |
| 🟠 **UNVERIFIED** | Amber screen, distinct haptic pattern | One or both products unknown, barcode unreadable, incomplete data, or outdated dataset. |
| ⚪ **NO_KNOWN_INCOMPATIBILITY** | Grey screen (**never green**) | Unique identities, confirmed hazards, documented completeness and current-version reviews; no known rule triggered. **Explicitly not a clearance.** Copy: *"No known dangerous combination in our database. This is not a safety clearance. Do not mix unless instructed by your employer."* |

## Why now

- **On-device barcode reading:** Phones and browsers can read GTIN/GS1 barcodes without a server; matching against confirmed GTIN mappings or unique UFIs (GISCODE display only) runs locally. Not built for ChemHazard Stop yet (ticket 02).
- **Speech instead of reading:** The demo already speaks the warning via the browser's speech synthesis in 7 languages; recorded warnings in more languages are ticket 03.
- **Robust Three-Lane Data Architecture:** Strict legal segregation between public facts from CLP labelling and safety data sheets (hazard statements, CAS numbers), optional licensed GISCODE datasets, and community reports.

## Data Strategy: Three Legally Separated Lanes

1. **Public-Law Lane (Always shippable):** CLP hazard and EUH statements plus the ingredients (CAS numbers) from the manufacturer's safety data sheet. The deterministic trigger for hypochlorite is the ingredient itself (sodium hypochlorite, CAS `7681-52-9`). `EUH031` (*"Contact with acids liberates toxic gas"*) and `EUH206` are additional label cues, not a condition: many chlorine cleaners carry only `EUH206` or neither phrase (checked against the reference products, 12 Oct 2026). Facts, free to redistribute.
2. **Licensed Lane (Optional, written permission required):** WINGIS / GISBAU data, including official GISCODE mappings. Packaged only with explicit written authorization from BG BAU. The app operates independently without it. **Hard rule: WINGIS/GESTIS must never be scraped or redistributed without permission.**
3. **Open & Community Lane:** Manufacturer SDS where licensing allows, GS1 Digital Link / GTIN identifiers, and curated contributions from cleaning contractors and unions submitted via GitHub pull requests.

*Human Verification Queue:* Every product record must pass human verification before entering a production release build. Fully automated SDS scraping risks false negatives, which is the single failure mode this system cannot tolerate.

## Sketch

**Input:** Today: pick from the product list or enter a GTIN/UFI. Goal: the phone camera reads the barcodes of two bottles one after the other (GISCODE display only).
**Logic:** Local incompatibility matrix computes set union of hazard classifications:
$$\text{combined} = \text{hazards}(A) \cup \text{hazards}(B)$$
$$\text{if } \text{rule.required} \subseteq \text{combined} \implies \text{STOP}$$
**Output:**
- Dangerous pair detected $\to$ red full-screen warning (no fast flashing, at most 3 changes per second), warning tone, vibration, spoken warning in the chosen language.
- Unknown product $\to$ Amber screen (*UNVERIFIED*).
- Known pair with no triggered rule $\to$ Grey info screen (*NO_KNOWN_INCOMPATIBILITY*, never green).

*Out of scope:* Chemical inventory management, disposal instructions, first aid advice, SDS authoring, or compliance audit tracking.

## First step

**Ticket:** P0: Standalone Offline Rule Engine & Dual-Input Scanner Interlock with 4-Channel Alarm.
**Definition of Done:**
1. A 100% offline rule engine executes against 20 real cleaning product pairs (e.g., hydrochloric/phosphoric toilet descaler + sodium hypochlorite bleach), returning `STOP` in <50 ms.
2. Any uncataloged product strictly evaluates to `UNVERIFIED`.
3. The engine never outputs a green status or certification of safety under any condition.
4. Triggering `STOP` fires a simulated alarm sound in DE/EN/PL/UK/TR and activates high-contrast visual flash.

## Where it breaks (The Achilles Heel)

**Muted phone or loud operating environment:** Muted volume, connected Bluetooth earbuds, phone inside a pocket, speaker muffled by heavy rubber gloves, or deafening industrial vacuum cleaners (85 dB).  
*Remedy (planned, ticket 03):* vibration in an emergency rhythm ([300, 100, 300, 100, 500] ms, already in the demo where the browser allows), a red full-screen warning without fast flashing (at most 3 changes per second, otherwise a seizure risk for photosensitive epilepsy) and, in a mobile app, the `STREAM_ALARM` audio channel. A browser cannot override silent mode; only an app can.

**Second breaking point: wrong product data.** A gap in the data silently swallows a warning, see the correction above (`EUH031`). That is why every rule depends on ingredients (CAS) rather than label phrases, and every record carries source, date and hash of the manufacturer document.

## Who has already tried this

BG BAU provides world-leading databases in WINGIS, supported by GESTIS (IFA) and DGUV 101-019. However, existing solutions require active desktop research and technical reading comprehension. At the point of action beside the janitorial cart, no interactive warning aid exists. Commercial barcode apps (Yuka, CodeCheck) scan for allergens or cosmetic ratings, but completely lack binary two-component chemical reaction matrices.

## Prior art & Regulatory ground truth

- **GefStoffV & DGUV Rule 101-019** (Handling of cleaning and care agents).
- **Regulation (EC) No 1272/2008 (CLP Regulation)** — Hazard statements EUH031, H314, H318.
- **GISBAU / GISCODE classification system** for professional cleaning chemicals (Product groups GD, GG, GS, GU).

## Delivery

| Date | To | Status |
|---|---|---|
| 27 Sep 2026 14:25 | IG BAU building cleaning (`gebaeudereinigung@igbau.de`) | sent, no reply |
| 27 Sep 2026 14:32 | IG BAU (`kontakt@igbau.de`) + BG BAU (`gisbau@bgbau.de`) | sent, no reply |
| 27 Sep 2026 | Gebäudedienstleister (`info@`, `gl@die-gebaeudedienstleister.de`) | sent, no reply |
| 27 Sep 2026 15:11 | BIV, Christine Sudhop (`biv@die-gebaeudedienstleister.de`) | sent, no reply; text in `03-zuordnung/mails-q4-2026/mail-11-biv.md` |
| — | the same four: correction | **draft** `03-zuordnung/mails-q4-2026/mail-11b-korrektur.md`, Félix decides |
| — | EU-OSHA + BAuA focal point | **draft, rewritten 13 Oct 2026** `03-zuordnung/mails-q4-2026/mail-12-eu-osha.md`; verify a named contact before sending |

No follow-up with IG BAU (rule 3). The texts of 27 Sep stay unchanged as the record of what was sent; they are **no longer** suitable as templates for new recipients.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
