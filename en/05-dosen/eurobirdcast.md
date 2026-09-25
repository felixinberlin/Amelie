---
status: Available
delivery_method: E-Mail
target_maker: Open — to be decided only after M0. Candidates: BfN / BioConsult SH
review_score: 30/35
architecture_tier: Tier 2/3
source_type: Type A/D
---
# EuroBirdCast: Auditable Migration Curtailment

*(German: EuroBirdCast: Vogelzug-Abschaltung, nachrechenbar)*
*Working title — "EuroBirdCast" collides with the US trademark BirdCast (Cornell/CSU) and must be replaced before any handover.*

**In one sentence:** Turn already public, weather-radar-derived bird migration profiles into a turbine-specific curtailment recommendation that a regulator can recompute without the service itself.

**Status:** 22 September 2026 (first draft in the morning, rewritten from scratch after review) · **Review after:** March 2027
**Recipients:** open — to be decided only after M0. Candidates: BfN / BioConsult SH, LfU Brandenburg (central carcass registry), operator associations
**Verdict:** 🔨 **build first, if at all** — review protocol: *narrowed, remaining gap unclear*. The first draft of this tin carried 🎁 "verified novel". That was wrong; the correction is below.  
**Review:** 30/35 · Tier 2/3 · Type A/D (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## What this tin lost on 22 September 2026

Three independent reviews (`02-recherche/eurobirdcast-{empfaenger,besetzung,technik}-2026-09-22.md`) refuted the first draft in three places. That belongs up front, not in a footnote:

1. **The recipient does not exist.** ENRAM was a COST Action from 2013 to 2017; enram.eu is an archive. The address named in the first draft could not be substantiated.
2. **The index is not new.** "Collisions per kilowatt-hour generated" is scenario 3 in Bauer et al., *Nature Sustainability*, 2 June 2026 (doi 10.1038/s41893-026-01853-4) — the very study the first draft cited as its leverage. Code and data are open (CC BY 4.0, Zenodo). The metric has an earlier ancestor: Bureau Waardenburg 2022 computes "Percentage of Collisions Avoided" against MWh (30 % = 11 MWh = 0.05 %; 70 % = 545 MWh = 1.65 %; 90 % = 2,294 MWh = 6.14 %).
3. **The problem does not exist in that form.** Onshore Germany has no migration-based curtailment obligation. The "blanket night shutdowns from August to October" are **bat** conditions, tied to temperature (≥ 10 °C) and wind speed (< 6 m/s) and therefore already demand-driven; the phenological shutdowns protect **breeding birds** (§ 45b (6) BNatSchG with Annex 1, § 6 WindBG, 4–6 weeks between 1 March and 31 August, sunrise to sunset). The applicable norm is § 45b, not § 44.

What remains is below — smaller, but real.

## The problem

Not "rigid shutdowns cost yield". Rather: **for bird migration the rule is missing, and for the rule the tool that would make it verifiable is missing.**

- Germany has no onshore migration condition. Where an obligation does exist — bats — the tool has long existed (ProBat 7, BfN). For migration, neither exists.
- In the Netherlands, Start/Stop has been mandatory since May 2023 for every wind farm with a `kavelbesluit`: routine operation, capped at 60 h/year, rotor < 2 rpm, 48-hour forecast, government software EVAS, published seasonal reports (autumn 2025: six shutdowns, 36 hours). The forecast comes from a UvA random-forest model on ERA5 plus a dedicated bird radar at Luchterduinen — **no weather radar, no `vol2bird`**. A 2025 Technolution assessment for Rijkswaterstaat calls its reliability "een lage betrouwbaarheid": the model catches the quiet periods and fails at the migration peaks. Moving to weather radar is not in the 2026 outlook.
- Commercial systems (Robin Radar, Swiss Birdradar) already curtail automatically — proprietary, hardware per site, undisclosed pricing, decision logic not inspectable.

The shared blank is neither the measurement nor the economics. It is **recomputability**: nobody outside the system can check whether a shutdown was justified, or whether a missing one was not.

## Why this works now

1. **The profiles for Germany are already computed and open.** RMI/KMI Belgium has been computing **daily** `vol2bird` profiles for two German radars — `deess` (Essen) and `denhb` (Neuheilenbach) — since October 2019, freely available at `opendata.meteo.be/ftp/observations/radar/vbird/`. No ingestion, no HDF5, no Docker required.
2. **FlySafe** (UvA / KNMI / Royal Netherlands Air Force) has provided free 5-minute real-time profiles across NL, BE and **DE** since August 2026 via the KNMI Data Platform.
3. **The toolchain is maintained:** `vol2birdR` 1.3.2 (16 Sep 2026), `bioRad` 0.12.0.9000 (21 Jul 2026), `getRad` (CRAN) for the raw DWD data.
4. **The thresholds are published:** 250 and 500 MTR (Welcker 2022, BfN-Schriften 635); NL offshore 500 birds/km/h, wind-dependent 400 (3–6 m/s) / 900 (6–11) / 500 (> 11) (van Bemmelen et al. 2022).
5. **The opposite direction is occupied and therefore a calibration source:** the bird conservation station at LfU Brandenburg has run the national central carcass registry for wind turbine casualties since 2002.

What does **not** work, contrary to the first draft: MistNet on DWD data (it needs `sweep_vol_w`, which DWD does not publish, and is trained on S-band — DWD is C-band); a 14-day retrospective from DWD raw volumes (measured retention ≈ 48 h, no PVOL archive); `ρHV < 0.85` as a threshold (the `vol2bird` default is `RHOHVMIN = 0.95`); "Aloft, more than 150 stations" (141 stations in 18 countries, daily only for the `baltrad` branch, `uva` ends in 2023, research-only licence).

## Sketch

```
RMI/KMI VPTS (deess, denhb)   ·   FlySafe (real time, NL/BE/DE)
         │
         ▼
MTR at rotor height  ← hub height + rotor diameter
  (birds per km of front per hour, integrated over the rotor-swept zone)
         │
         ▼
Threshold from a file (250/500 MTR · NL 400/500/900)  +  uncertainty band
         │
         ▼
Recommendation  ──▶  audit record:
                     radar source · time · altitude profile · MTR · uncertainty ·
                     threshold WITH citation · energy loss · decision
```

**The metric is MTR at rotor height, not birds/km³.** MTR is the unit in which the thresholds are formulated in Germany, the Netherlands and Belgium — and therefore the only one in which a result can be checked against published limits.

**The contribution is the audit record, not the shutdown.** From that record alone, the decision must be reproducible without the service. The goal is that a regulator can recompute a curtailment without taking the operator's word for it — precisely what none of the commercial systems expose.

## First step

**Ticket M0: establish demand. Two questions, no product.**

- To BfN / BioConsult SH: project FKZ 3523 15 1601 ("system for recording and forecasting bird migration for demand-driven turbine curtailment in the EEZ", 12/2023–11/2025) has ended. What does the result still lack to be operational — and is it the open, recomputable operating service?
- To the bird conservation station at LfU Brandenburg: would carcass data from the central registry be available in a form that can carry a threshold calibration?

**Done when:** an answer from both directions either names a demand or denies it.

**Kill switch:** if both deny it, the idea moves to `_entsorgt.md`, and that is a full result. Only then is M1 (profile readability, MTR at rotor height) worth starting — the full sequence is in `02-recherche/eurobirdcast-roadmap-2026-09-22.md`.

## Where it breaks

- **The Gotthard null result.** Tettamanti, *J. Environ. Manage.* 401, 1 March 2026: five turbines, BirdScan MV1 radar, turbine-specific MTR thresholds since 2021. Downtime fell from 318 h (spring 2021/22, all turbines) to 28–96 h per turbine in 2023/24 — **the collision count stayed at roughly 190 animals per year.** More temporal precision did not save more birds there. Whether that is a site artefact (alpine pass, five turbines) or a finding is open. While it stays open, the impact claim of the entire field rests on soft ground — and so does this tin's.
- **No buyer.** A tool for an obligation that does not exist gets neither bought nor operated. That is why M0 comes before any code.
- **False precision.** The measurement deviation between radar systems is around 100 MTR at 250 MTR. A traffic light without an uncertainty band claims a precision the measurement cannot deliver.
- **Licensing.** OPERA/Meteogate distributes under a research-only agreement. Whether an operating service would be permissible is unverified; the RMI/KMI files are the detour, and their licence is unverified too.
- **The name.** "EuroBirdCast" collides with BirdCast (Cornell/CSU).

## Who has already tried

- **Bauer et al. 2026** (*Nature Sustainability*, 2 June 2026): 37 radars across DE/FR/BE/NL/LU, around 42,000 turbines; 50 % risk reduction at 1.2 % yield loss, 90 % at 7.6 %; scenario 3 is this tin's index. Code open. **This is the precursor, not the leverage.**
- **Start/Stop + EVAS (NL, since May 2023):** mandatory routine operation with government software and a published audit — exactly the evidence path this tin claimed as its gap. Weakness: the underlying forecast model is rated of low reliability at migration peaks (Technolution 2025).
- **FlySafe (UvA/KNMI, operational, free for DE since 8/2026):** delivers the profiles, makes no operational decision.
- **Robin Radar Systems:** SCADA-coupled curtailment including a "mass migration (radar density grids)" algorithm; Eneco Maasvlakte 2 runs it fully automatically across 22 turbines. Proprietary.
- **Swiss Birdradar Solution:** BirdScan MV1 ("adaptive management of wind parks", automatic communication with wind park controls) — now listed as "(legacy)", superseded by FaunaScan MV2. Proprietary, hardware per site.
- **Bureau Waardenburg 2022 / van Bemmelen et al. 2022:** the economics layer as a commissioned report, including the figures this tin set out to reinvent.
- **RADBIRD (BfN / Helgoland bird observatory, 1 Nov 2019 – 31 Dec 2021):** established the methodology for onshore curtailment. Continued as FKZ 3523 15 1601 (BioConsult SH, 12/2023–11/2025) for the EEZ — the first draft of this tin said RADBIRD "ended as a research report". That was incomplete.
- **HiRAD (Biodiversa+):** WSL (Bauer), UvA, INBO, FMI, Agroscope, **with Swiss BirdRadar Solution AG as a partner**, work package 5 explicitly "data products and tools for stakeholders". The consortium the first draft's email proposed forming has existed since 2024.

## Why there is no draft email here

Because the first draft had two — one to an organisation that has not existed since 2017, at an address that could not be substantiated, aimed at a call whose deadline passed on 12 May 2026 and which requires ≥ 3 partners and TRL 1–4 anyway; and one to the Prototype Fund, which only funds freelancers and partnerships of ≤ 4 people based in Germany, and therefore fitted none of the named recipients.

Both are deleted. A new draft will be written once M0 has named a recipient — with an address that was opened first. Rule 1 of the manifesto: the delivery is the gift, not the find. An email to a dead distribution list is not a delivery.
