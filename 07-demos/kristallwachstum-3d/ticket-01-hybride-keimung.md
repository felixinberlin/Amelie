# Ticket 01: Hybride WebGPU-Dendriten-Keimung mit Kobayashi-Relaxation & D_f-Messung

**Komponente:** `src/engine/kristallwachstum` / `src/components/simulators/KristallwachstumSimulator.tsx`
**Status:** Abgeschlossen & Verifiziert (25.09.2026) · WebGPU Pipeline & CPU Fallback aktiv, 100% Testabdeckung
**Zuständigkeit:** MINT-Didaktik / 3D-Geometrie / WebGPU Compute
**Zugehörige Dose:** [`05-dosen/kristallwachstum-3d.md`](../../05-dosen/kristallwachstum-3d.md)
**Architektur & Recherche:** [`02-recherche/kristallwachstum-3d-didaktik-physik.md`](../../02-recherche/kristallwachstum-3d-didaktik-physik.md)

---

## 1. Problemstellung

Die klassische Diffusionsbegrenzte Aggregation (DLA) erzeugt stark verästelte, fraktale Strukturen, modelliert jedoch keine Grenzflächen-Thermodynamik (Oberflächenenergie, Gibbs-Thomson-Effekt, kubische/hexagonale Anisotropie). Das Kobayashi-Phasenfeld-Modell (1993) wiederum liefert physikalisch exakte Dendriten, erfordert jedoch eine initialisierte Keimgeometrie und hohe Rechenleistung.

Zwischen beiden Welten fehlt im Browser:
1. Eine Verknüpfung aus stochastischer DLA-Keimbildung und thermodynamischer Phasenfeld-Grenzflächenrelaxation.
2. Eine quantitative didaktische Auswertung der fraktalen Dimension ($D_f$) in Echtzeit über 3D-Box-Counting.
3. Die automatische Generierung eines stützfreien, wasserdichten Netzes (3MF/STL) mit Wandstärken-Kontrolle für den 3D-Druck.

---

## 2. Technische Aufgabenpakete

- [x] **Task 1: WGSL Compute Shader definieren (`shaders.wgsl.ts`)**
  - Implementierung des 3D-Brownschen Random Walks mit analytischer Mark-Stock-Quartic-Driftkorrektur.
  - Implementierung der Allen-Cahn-Phasenfeldgleichung:
    $$\tau \frac{\partial \phi}{\partial t} = \nabla \cdot (\epsilon^2(\theta) \nabla \phi) + \phi(1-\phi)\left(\phi - \frac{1}{2} + m(T)\right)$$
  - 3D 7-Punkt-Laplace-Operator auf $32^3$ bis $192^3$ Voxelgittern.
  - Anisotropie-Funktionen für kubische $\langle 100 \rangle$ Kristalltrachten und hexagonale $K_6$-Symmetrie.

- [x] **Task 2: Simulations-Engine & Didaktik-Metriken (`engine.ts`)**
  - Diskreter Integrationsschritt (DLA-Partikelkeimung $\to$ Phasenfeld-Relaxation $\to$ latente Wärmediffusion).
  - Deterministisches 3D-Box-Counting zur Echtzeit-Bestimmung der fraktalen Dimension:
    $$D_f = \lim_{s \to 0} \frac{\log N(s)}{\log(1/s)}$$
  - Lineare Regression über Oktave-Boxgrößen mit Validierung gegen theoretische Werte ($D_f \approx 2{,}2 - 2{,}6$).

- [x] **Task 3: Geometrie-Synthese & Wasserdichter STL-Export**
  - Manifold-Oberflächenextraktion aktiver Voxel unter Berücksichtigung von Mindestwandstärken ($0{,}8\,\text{mm} - 3{,}0\,\text{mm}$) zur Vermeidung von Astbrüchen im Slicer.
  - ASCII-STL-Writer für den direkten Download im Browser.

- [x] **Task 4: Interaktives Labor-Dashboard (`KristallwachstumSimulator.tsx`)**
  - 5 wissenschaftliche Gefügelinsen (`ORIENT` / EBSD-IPF, `MELT` $\phi$, `THERM` $\Delta T$, `CURV`, `SEM`).
  - Presets: Wismut-Trichter-Dendrit, Stellare Schneeflocke, Pyrit-Facetten-Aggregat.
  - Deterministisches Rezept-Token (`K3D-[Seed]-A[ε]-U[ΔT]-W[Wand]`) zum Reproduzieren exakter Kristallgeometrien.

---

## 3. Akzeptanzkriterien (Definition of Done)

1. **Numerische Stabilität:** Bei 50 Phasenfeld-Zeitschritten oszilliert der Ordnungsparameter $\phi$ nicht über $[0, 1]$.
2. **Messgenauigkeit:** Die berechnete fraktale Dimension $D_f$ liegt im physikalisch plausiblen Intervall $1{,}85 \le D_f \le 2{,}85$.
3. **Druckbarkeit:** Die generierte STL-Datei ist manifold (geschlossene Oberfläche ohne offene Kanten) und wird von PrusaSlicer/BambuStudio ohne Reparaturhinweis geladen.
4. **Testabdeckung:** Sämtliche Unit-Tests in `engine.test.ts` laufen grün durch.
