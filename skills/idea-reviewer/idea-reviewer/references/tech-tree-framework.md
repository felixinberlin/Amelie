# The Civic Tech Tree Framework

A structural methodology for mapping software ideas as nodes in a public-interest technology graph.

---

## 1. Why Tech Trees Matter in Amélie

In commercial product development, roadmaps represent feature sequences designed for user acquisition and venture funding. 

In Amélie's gift economy, ideas are **nodes on an open tech tree**. A good gift:
1. Does not reinvent existing roots (it stands on open standards, browser APIs, and public data).
2. Delivers a compact, standalone trunk (an executable proof-of-concept that works immediately).
3. Unlocks downstream branches for civil society, researchers, or local governments without demanding that Amélie build them.

---

## 2. The Three-Layer Tech Tree Structure

When reviewing an idea, map it explicitly into three structural layers:

```
[LAYER 0: ROOTS]
Prerequisites, Open Data & Commodity APIs
(What must exist in the world before this idea is feasible?)
        │
        ▼
[LAYER 1: TRUNK]
The Minimal Viable Gift (The First Step Ticket)
(What is the smallest verifiable code artifact that proves the premise?)
        │
        ▼
[LAYER 2: BRANCHES]
Downstream Civic Unlocks & Research Frontiers
(What becomes possible once this gift is in the hands of the recipient?)
```

---

## 3. Layer Definitions

### Layer 0 · Roots (Prerequisites & Standard Foundations)
Roots represent technical, legal, and operational primitives that the idea relies upon. A healthy idea has **sturdy, open roots**:
* **Open Regulatory Standards**: DIN/EN norms, EU Directives, VDI guidelines, municipal bylaws.
* **Public Geodata & Open Statistics**: OpenStreetMap/Overpass API, DWD-KOSTRA precipitation grids, municipal ALKIS land parcels, Copernicus satellite imagery.
* **Client-Side Edge APIs**: WebGL/WebGPU, Web Audio API (FFT / AudioWorklet), WebAssembly runtimes, Web Workers, Canvas 2D.
* **Open Source Libraries**: Tesseract WASM, Leaflet, Proj4js, SQLite WASM, ONNX Runtime Web.

*Failure Mode*: If the idea requires a root that is proprietary, behind an expensive paywall, or not yet standardized in modern browsers, the idea's roots are diseased ($V_6 \le 2$).

### Layer 1 · Trunk (The Core Scaffolding / First Step Ticket)
The trunk is the gift itself. Per Amélie's Rule 4, a bare idea without a running trunk cannot be given to a solo maintainer.
* **The DoD (Definition of Done)**: Can the trunk be verified in a single Vitest or browser test?
* **Zero-Setup Barrier**: Can a user open `index.html` in Chrome/Firefox and immediately test the functionality without running `docker compose` or setting up an AWS account?
* **Single Responsibility**: The trunk does one thing with uncompromising fidelity (e.g. calculates the LAG-VSW score from an uploaded photo, or runs an on-device 50-step phase-field crystal relaxation).

### Layer 2 · Branches (Downstream Civic Unlocks)
Once the trunk exists and is handed to the recipient, what does it unlock?
* **Branch A (Direct Civic Empowerment)**: Citizens, tenants, or volunteers gain immediate self-efficacy (e.g. generating a legally binding fee exemption form, or avoiding lead-contaminated water).
* **Branch B (Institutional Efficiency)**: Public health departments, municipal planning offices, or university labs eliminate a manual paper bottleneck.
* **Branch C (Defensive Commons / Open Dataset)**: Aggregating non-PII diagnostic reports into a public map (e.g. community noise maps, bird collision hotspots), turning isolated citizen measurements into systemic evidence.

---

## 4. Tech Tree Review Checklist

During the review, check:
1. **Root Audit**: Are all Layer 0 dependencies 100% open-source or public domain?
2. **Trunk Isolation**: Can Layer 1 function standalone if all external networks go down?
3. **Branch Plausibility**: Are Layer 2 unlocks genuine civic outcomes, or are they speculative monetization dreams?
