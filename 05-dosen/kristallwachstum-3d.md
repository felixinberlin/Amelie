---
status: Available
delivery_method: E-Mail
target_maker: Geowissenschaften FU Berlin / Lehrmittel-Verlage
---
# Kristallwachstum 3D

**Ein Satz:** Die erste hybride DLA-Phasenfeld-Pipeline im Browser: Brownsche Keimbildung trifft anisotrope Kobayashi-Thermodynamik — von der fraktalen Wachstumsdidaktik mit 9 Gefügelinsen bis zum wasserdichten, druckbaren 3D-Rezept.

**Stand:** September 2026 · **Prüfen ab:** September 2027
**Empfänger:** Geowissenschaften FU Berlin / Lehrmittel-Verlage · nachrangig: Three.js/WebGPU-Demoszene, Nervous System (Jessica Rosenkrantz & Jesse Louis-Rosenberg), Printables/Prusa-Community
**Verdikt:** 🎁 verschenken — verengt auf Hybrid-Pipeline & didaktische Gefügeanalyse

---

## Das Problem

Kristallisation, dendritische Erstarrung und Gefügebildung (von Schneeflocken über metallische Gusslegierungen bis zu Pegmatit-Mineralien) werden an Schulen und Universitäten fast ausschließlich über statische 2D-Lehrbuchdiagramme vermittelt. Physikalisch fundierte 3D-Simulationen galten bisher als rechenintensive Supercomputer-Aufgaben.

Gleichzeitig leidet die Creative-Coding- und Maker-Szene an einem doppelten Bruch:
1. **Das Bildschirmschoner-Dilemma:** Tausende DLA-Demos (Diffusion-Limited Aggregation) erzeugen hübsche Punktwolken-Render, ignorieren aber thermodynamische Randbedingungen (anisotrope Grenzflächenenergie, Unterkühlung, Orientierungsfelder) und haben null didaktischen Nährwert.
2. **Der Bruch vor dem 3D-Druck:** Vom fraktalen Partikelhaufen bis zu einem physisch druckbaren Objekt liegt ungelöste Fleißarbeit — Wandstärkenkontrolle, Verhinderung brüchiger Äste, Einhalten von Überhangwinkeln und Erzeugen eines garantierten wasserdichten Manifold-Netzes.

## Warum das jetzt geht

1. **WebGPU Compute Shader (WGSL) im Browser:** Moderne WebGPU-Pipelines berechnen Brownsche Zufallsbewegungen und zehntausende Gitterzellen parallel mit über 60 FPS direkt auf Standard-Grafikkarten.
2. **Hybride DLA-Phasenfeld-Synthese:** Das Kobayashi-Phasenfeld-Modell (1993) für unterkühlte Schmelzen lässt sich auf 3D-Gittern (bis 192³ Voxel) in WGSL lösen. Gekoppelt mit DLA-Keimbildung entsteht thermodynamisch exakte Dendritenmorphologie ohne Supercomputer.
3. **GPU-Marching-Cubes & parametrisches Rezept:** Wasserdichte Isoflächen-Netze können direkt auf der GPU extrahiert werden. Ein kurzer Seed-String kodiert das physikalische Wachstumsrezept und garantiert identische Reproduzierbarkeit.

## Skizze

- **Stufe 1 (WebGPU DLA-Keimbildung):** Sphärische Partikelinjektion mit analytischer Quartic-Solver-Driftkorrektur (nach Mark Stock) gegen Artefakte. Orientierungs-SSBO speichert lokale Kristallgitterachsen pro Kristallit.
- **Stufe 2 (Kobayashi Phasenfeld-Relaxation):** Das DLA-Skelett initialisiert das Phasenfeld $\phi$. Diskrete Allen-Cahn-Schritte mit anisotroper Grenzflächenenergie glätten Kanten, simulieren thermische Unterkühlung und bilden kristallographische Trachten (kubisch, hexagonal) heraus.
- **Stufe 3 (9 Didaktische Gefügelinsen):** Umschaltbare wissenschaftliche Analyseebenen:
  - `MELT`: Phasengrenze Schmelze/Festkörper.
  - `ORIENT`: Kristallorientierung als Inverse-Pole-Figure (IPF) Falschfarbenkarte.
  - `THERM`: Lokales Temperatur- und Übersättigungsfeld samt latenter Schmelzwärme.
  - `CURV`: Mittlere Oberflächenkrümmung und Gibbs-Thomson-Effekt.
  - `SEM`: Virtuelle Rasterelektronenmikroskopie-Beleuchtung.
- **Stufe 4 (Echtzeit-Metriken & Print-Rezept):**
  - Live-Berechnung der fraktalen Dimension $D_f$ via 3D-Box-Counting.
  - Physische Druckschranken (Mindest-Astdurchmesser, Überhangwinkel) als aktive Wachstumsbegrenzer im Solver.
  - Export: Wasserdichtes 3MF/STL für den 3D-Druck sowie teilbarer Seed-Code (`K3D-[Seed]-[Params]`).

**Nicht dabei:** Kein proprietärer Slicer, kein geschlossener Web-Shop, keine Batch-Cloud-Berechnung (alles läuft 100 % lokal im Browser).

## Das Buch zur Dose (Rohrecherche & Architektur)

- [Kapitel 1: Didaktische & Physikalische Recherche](../02-recherche/kristallwachstum-3d-didaktik-physik.md) — Analyse von WebGPU-DLA (`scttfrdmn`, `markstock/dla-nd`), Phasenfeld-Solidification (`fronkt/solidify`, Kobayashi 1993) und der 4-Stufen-Architektur.
- [Kapitel 2: Open-Source-Scaffolding](../07-demos/kristallwachstum-3d/README.md) — Konkrete WGSL-Shaderkerne (`shaders.wgsl.ts`), DLA-Driftkorrektur, Box-Counting und STL-Export.

## Erster Schritt

**Ticket: Hybride 2D/3D-Dendriten-Keimung in WebGPU mit $D_f$-Messung.**

1. WebGPU Compute Pipeline mit Partikel-Array und Orientierungsfeld aufsetzen.
2. 50 Iterationen Kobayashi-Phasenfeld-Glättung über das DLA-Aggregat rechnen.
3. Berechnete fraktale Dimension $D_f$ live im HUD einblenden und mit theoretischen Werten (2D: ~1,71; 3D: ~2,3–2,5) vergleichen.

**Fertig, wenn:** Ein Seed reproduzierbar vom fraktalen Keim zur hexagonalen/kubischen Dendrite wächst, die fraktale Dimension numerisch stabil ausgegeben wird und das Mesh wasserdicht als STL exportiert werden kann.

## Wo es kippt

1. **Hardware-Hürde WebGPU:** Ältere Mobilgeräte oder Browser ohne aktivierte WebGPU-Unterstützung scheitern. Gegenmaßnahme: Ein sauberer WebGL2/Canvas-Fallback für 2D-Didaktik oder vereinfachtes Voxel-Gitter.
2. **Numerische Instabilität bei zu großem Zeitschritten:** Phasenfeld-Gleichungen neigen bei zu großem $\Delta t$ zum Oszillieren. Feste adaptive Zeitschrittgrenzen im Compute-Pass sind Pflicht.
3. **Formen-Ermüdung:** Reine DLA-Bäume wirken ohne Gitteranisotropie nach wenigen Seeds beliebig. Nur das Zusammenspiel mit Kristalltrachten und Vorzugsrichtungen erzeugt echte mineralogische Vielfalt.

## Wer es schon versucht hat

- **scttfrdmn/webgpu-compute-exploration:** Starke WebGPU-Scaffolding-Demos für DLA und Fluide, jedoch ohne Phasenfeld-Thermodynamik oder Druck-Pipeline.
- **fronkt/solidify:** Exzellente WGSL-Implementierung des Kobayashi-Phasenfeldes bei 192³ Voxeln mit 9 Linsen und EBSD-Karten — aber rein kontinuumsmechanisch ohne DLA-Keimbildung.
- **markstock/dla-nd:** Mathematisch präzise 1D–5D DLA-Referenz mit Quartic-Solver-Bias-Korrektur (C-basiert, nicht browsernativ).
- **Nervous System:** Pioniere des generativen 3D-Drucks (Hyphae, Floraform), kommerziell orientiert, keine offene didaktische Physik-Plattform.
- **Mineralogie-Lehre:** Nutzt weiterhin vorwiegend statische Kristallgittermodelle und Lehrbuchtafeln.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
