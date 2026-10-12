---
status: Available
delivery_method: E-Mail
target_maker: Berlin Tenants Association · Consumer Advice Center NRW (Housing)
review_score: 29/35
architecture_tier: Tier 1
source_type: Type A
---
# LegioKlar (Stairwell Legionella Notice Board Decoder)

*(German: LegioKlar — TrinkwV Legionellen-Aushang-Decoder)*

**One sentence:** Decodes photographed laboratory drinking water reports from apartment notice boards, maps CFU/100ml counts and hot water temperatures against the official German Environment Agency (UBA) risk matrix, and instantly generates statutory disclosure requests and tenant defect notices under § 536c BGB.

**Status:** 12 Oct 2026 · **Review from:** September 2027  
**Recipients:** Berliner Mieterverein e.V. · Verbraucherzentrale NRW (Housing Division)  
**Verdict:** 🎁 gift  
**Review:** 29/35 · Tier 1 · V8 Fun 3 (Aha-Moment / Decoding) · Details: [Classification Log](../06-suche/amelie-classification-log.md)

---

## The Problem

In apartment buildings with central domestic hot water heating, landlords must test for Legionella every three years under § 31 Drinking Water Ordinance (TrinkwV). When the technical action limit of 100 CFU/100 ml is met or exceeded, property managers often post complex laboratory reports in the stairwell for only a few days. Tenants do not understand the technical terminology (CFU, DVGW W 551, sampling points, circulation temperatures) and miss out on timely protective measures (such as sterile filters, shower bans, or rent reductions).

Commercial Legionella software caters almost exclusively to facility managers and landlords. Tenant advice portals require tedious manual number entry without contextual assistance.

## Why Now

1. **Clear official matrix:** The German Federal Environment Agency (UBA) and the revised TrinkwV 2023 define exact thresholds (100 / 1,000 / 10,000 CFU/100 ml) and statutory operator obligations.
2. **On-device extraction & parsing:** Client-side parsing extracts metrics and temperatures directly in the browser without uploading private address or tenancy data to external clouds.
3. **Deterministic evaluation core:** Boiler temperatures ($\ge 60\,^\circ\text{C}$) and circulation return temperatures ($\ge 55\,^\circ\text{C}$) can be audited against DVGW W 551 and mapped directly into formal disclosure requests.

## Sketch

- **Input:** Photo or structured values from the test report posted on the hallway notice board.
- **Logic:** Extraction of CFU/100ml per sampling location, evaluation against the UBA matrix (<100 green, 100–999 yellow, 1,000–9,999 orange, $\ge$10,000 red), auditing hot water temperatures against DVGW W 551.
- **Output:** Clear health precautions for tenants (reducing aerosols, sterile shower filters) and a pre-drafted notice to the property management citing § 51 TrinkwV and § 536c BGB.

## First Step

**Ticket:** Ticket 01 completed on 12 Oct 2026 (`src/engine/legio-klar/`).

Pure TypeScript engine `analysiereLaborbefund(befund)` featuring the UBA matrix, DVGW temperature audits, tenant defect notice generator, and 10 Vitest tests. Synthetic fixtures located under `07-demos/legio-klar/data/`.

## Failure Mode

Legal Services Act (RDG): The tool must not provide formal legal representation for individual lawsuits. It provides objective technical classification based on official UBA guidelines and generates template notices that tenants adapt independently.

## Prior Art

Commercial tools (Trinkwasser-App, Hydrosense, WEKA templates) cater to facility managers. Consumer portals require isolated manual data entry. An open, local decoder for notice boards with direct defect notice generation did not exist.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even an answer. If one day you have an idea you won't build yourself, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
