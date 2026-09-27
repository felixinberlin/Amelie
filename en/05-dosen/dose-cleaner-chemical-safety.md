---
status: Available
delivery_method: E-Mail
target_maker: Service Employees International Union · IG BAU · European Cleaning and Facility Services Industry
review_score: 34/35
architecture_tier: Tier 1
source_type: Type A
---
# ChemHazard Stop / MischStop

*(German: ChemGefahr-Stopp — Quelloffener Misch-Warn-Assistent für Reinigungskräfte)*

**One sentence:** Point a phone camera at two cleaning chemical bottles: Warns audibly in the cleaner's language if the combination is dangerous — 100% offline, in under a second; admits when it cannot verify, but never says "safe."

**As of:** 27.09.2026 · **Recheck by:** March 2027  
**Recipient:** Service Employees International Union (SEIU) · IG BAU · BG BAU · DGUV · EFCI · European Cleaning and Facility Services Industry  
**Verdict:** 🎁 **gift**  
**Review:** 34/35 · Tier 1 · Type A (Details: [Review Dossier](../../06-suche/amelie-classification-log.md))

---

![Point-of-Action Camera Detection: Smartphone scans acidic descaler and chlorine bleach](/chemhazard-stop.jpg)

> 📹 **Live Demonstration:** [Watch Point-of-Action Video on Google Drive](https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link) *(on-demand streaming, 0 KB initial load burden)*

## The problem

Commercial cleaners work under extreme speed pressure, frequently navigating severe language barriers. Accidental mixing of an acidic descaler with a hypochlorite bleach releases deadly chlorine gas into confined, poorly ventilated restrooms and custodial closets.

The hazard has been documented for decades, and mixing bans are textbook knowledge — yet accidents happen repeatedly. The root cause: safety warnings remain locked inside 15-page technical Safety Data Sheets (SDS) or German workplace operating instructions in office binders that nobody consults mid-shift.

Germany already operates world-class reference systems: WINGIS/GISBAU (hazardous substance information, GISCODE, operating instructions), GESTIS/IFA, GSApp, CERTISCAN, and DGUV rule 101-019. However, every single one of these is lookup-based. None of them stands between a worker and two bottles at the physical moment of mixing. As of September 2026, no open-source, camera-based, dual-bottle mixing interlock exists on the market. That is the gap.

## Core Principle: The Safety Case

**The app never certifies safety. It only warns of detected danger, or admits it cannot verify.**

This is not a UX preference; it is the fundamental safety case. A false "all clear" (green checkmark) is lethal and far worse than having no app at all. Every design rule strictly follows from this premise:
1. **No green screen, ever.** There is no clearance state.
2. **Uncertainty always defaults to warning / UNVERIFIED.**
3. **Community or unverified data can never override a STOP.**
4. **Assistive Warning Aid:** The app is an assistive warning aid, not certified personal protective equipment (PPE), not a compliance tool, and not a replacement for the employer's statutory risk assessment under GefStoffV and DGUV 101-019.

### The Three System Outcomes

| State | Signal | Meaning & Mandatory Copy |
|---|---|---|
| 🔴 **STOP** | High-contrast red screen, loud multilingual voice, repeating haptic vibration, alarm tone | Dangerous chemical combination detected in the local database (e.g., acid + hypochlorite $\to$ chlorine gas). |
| 🟠 **UNVERIFIED** | Amber screen, distinct haptic pattern | One or both products unknown, barcode unreadable, incomplete data, or outdated dataset. |
| ⚪ **NO_KNOWN_INCOMPATIBILITY** | Grey screen (**never green**) | Both products identified, no known rule triggered. **Explicitly not a clearance.** Copy: *"No known dangerous combination in our database. This is not a safety clearance. Do not mix unless instructed by your employer."* |

## Why now

- **100% Offline Edge Inference:** Ultra-fast scanning of GTIN/GS1 barcodes, GISCODEs, or container labels directly on the device with zero cloud dependency.
- **Instant Spoken Polyglot Alerts:** Pre-recorded and synthesized warning shouts across 20+ languages (Ukrainian, Polish, Turkish, Arabic, Romanian, Bulgarian, etc.) eliminate the burden of reading technical German.
- **Robust Three-Lane Data Architecture:** Strict legal segregation between public CLP statements (EUH031), optional licensed GISCODE datasets, and open safety data sheets.

## Data Strategy: Three Legally Separated Lanes

1. **Public-Law Lane (Always shippable):** CLP hazard and EUH statements. Specifically, `EUH031` (*"Contact with acids liberates toxic gas"*) serves as the deterministic primary trigger for hypochlorite. Public domain, redistributable.
2. **Licensed Lane (Optional, written permission required):** WINGIS / GISBAU data, including official GISCODE mappings. Packaged only with explicit written authorization from BG BAU. The app operates independently without it. **Hard rule: WINGIS/GESTIS must never be scraped or redistributed without permission.**
3. **Open & Community Lane:** Manufacturer SDS where licensing allows, GS1 Digital Link / GTIN identifiers, and curated contributions from cleaning contractors and unions submitted via GitHub pull requests.

*Human Verification Queue:* Every product record must pass human verification before entering a production release build. Fully automated SDS scraping risks false negatives, which is the single failure mode this system cannot tolerate.

## Sketch

**Input:** Smartphone camera scans barcodes / GISCODEs / labels of two cleaning chemical bottles sequentially or side by side.  
**Logic:** Local incompatibility matrix computes set union of hazard classifications:
$$\text{combined} = \text{hazards}(A) \cup \text{hazards}(B)$$
$$\text{if } \text{rule.required} \subseteq \text{combined} \implies \text{STOP}$$
**Output:**
- Dangerous pair detected $\to$ 4 simultaneous alarm channels (maximum-volume alarm stream, flashing red screen, repeating high-frequency haptics, voice warning in native language).
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
*Remedy:* If there is no sound or audio is drowned out, physical and optical redundancy takes over: the phone vibrates aggressively with a distinctive emergency pulse rhythm ([300, 100, 300, 100, 500] ms) and the display emits a glaring high-frequency optical color strobe flash (pulsing red/white) visible even in peripheral vision and through thick nitrile gloves. Where OS permissions allow, audio is forced through the `STREAM_ALARM` channel at maximum volume.

## Who has already tried this

BG BAU provides world-leading databases in WINGIS, supported by GESTIS (IFA) and DGUV 101-019. However, existing solutions require active desktop research and technical reading comprehension. At the point of action beside the janitorial cart, no interactive warning aid exists. Commercial barcode apps (Yuka, CodeCheck) scan for allergens or cosmetic ratings, but completely lack binary two-component chemical reaction matrices.

## Prior art & Regulatory ground truth

- **GefStoffV & DGUV Rule 101-019** (Handling of cleaning and care agents).
- **Regulation (EC) No 1272/2008 (CLP Regulation)** — Hazard statements EUH031, H314, H318.
- **GISBAU / GISCODE classification system** for professional cleaning chemicals (Product groups GD, GG, GS, GU).

## Sample Outreach Email to Recipients

**Recipients:** IG BAU Building Cleaning Union / Federal Board (`kontakt@igbau.de`)  
**CC:** BG BAU – Statutory Accident Insurance for Construction & Cleaning (`info@bgbau.de`, Attn: Hazardous Substances / GISBAU)  
**Subject:** Life Protection for Cleaners: ChemHazard Stop (Open Safety Gift to IG BAU & BG BAU)

```text
Dear Colleagues at IG BAU Building Cleaning Union (Attn: Ulrike Laux),
Dear Hazardous Substances & GISBAU/WINGIS Prevention Team at BG BAU,

We are reaching out to both of you simultaneously because frontline chemical safety requires the joint strength of workforce advocacy (union) and institutional prevention (statutory accident insurance):

We have developed a turnkey, 100% offline point-of-action safety interlock: ChemHazard Stop / MischStop.

The Workplace Reality:
Commercial cleaners work under extreme speed pressure, frequently at night and across severe language barriers. Accidentally mixing acidic descalers (e.g., sulfamic, phosphoric, or hydrochloric acid) with sodium hypochlorite bleach immediately releases lethal chlorine gas (Cl2) into confined, poorly ventilated restrooms.
Mixing prohibitions are textbook knowledge and thoroughly codified in DGUV Rule 101-019 and WINGIS — yet in the crucial second of mixing, a 15-page Safety Data Sheet filed away in a supervisor's binder provides zero protection. What was missing is a tool standing physically between the worker and two bottles at the custodial cart.

What the Tool Does:
1. Sub-Second Point-of-Action Scan: Point smartphone camera at two containers (barcode, GISCODE, or label OCR). A deterministic local rule engine evaluates reaction risks in <1 ms on-device with zero internet dependency.
2. Polyglot Audio Alerts: In hazardous pairings, loud spoken emergency instructions play in the cleaner's native language (Ukrainian, Polish, Turkish, Arabic, Romanian, Bulgarian, German, English, etc.).
3. Fail-Safe Without Sound: Even if the phone is silenced/muted or drowned out by 85 dB vacuum cleaners, the handset physically pulses with an unmistakable emergency cadence (300-100-300-100-500 ms) while the screen flashes a glaring 15 Hz optical color strobe (red/white) to alert workers even through heavy nitrile gloves.
4. Formal Safety Invariant: The system never emits a dangerous green "safe" clearance. It strictly triggers STOP on danger, or defaults to UNVERIFIED on incomplete data.

Respecting Authority Data & Architecture:
We perform zero unauthorized scraping of WINGIS or GESTIS. The engine triggers deterministically on public-domain EU CLP statements (especially EUH031). The architecture separates public data from licensed GISCODE datasets, ready to connect directly with official BG BAU WINGIS catalogs should BG BAU choose to adopt or host it.

The complete project is turnkey, tested, and released unconditionally into the public domain (CC0):
• Interactive Web Simulator & Live Demo: https://felixinberlin.github.io/Amelie/#dose=dose-cleaner-chemical-safety
• Video Demonstration (Point-of-Action Field Test): https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link
• Source Code, Test Suite & Scaffolding: https://github.com/felixinberlin/Amelie/tree/main/07-demos/chemhazard-stop

"This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will."

In solidarity for worker health and safety,
Amélie Initiative (Félix, Berlin)
```

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
