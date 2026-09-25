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
- **Stufe 3 (Wissenschaftliche Gefügelinsen & 3D-Schnitt):** Umschaltbare didaktische Analyseebenen mit interaktiver 3D-Kamera und Schnittebene:
  - `ORIENT`: Kristallorientierung als Inverse-Pole-Figure (IPF) Falschfarbenkarte.
  - `MELT`: Phasenordnungsparameter $\phi$ (Grenzfläche Schmelze/Festkörper).
  - `THERM`: Lokales Temperatur- und Übersättigungsfeld samt latenter Schmelzwärme.
  - `CURV`: Mittlere Oberflächenkrümmung und Gibbs-Thomson-Effekt.
  - `SEM`: Virtuelle Rasterelektronenmikroskopie-Beleuchtung (BSE-Kontrast).
  - `ZONING`: Petrologische Wachstumszonierung (Kristallisationsringe nach Entstehungszeitpunkt).
  - `Z-SLICE`: Interaktive Schnittebene zur Inspektion innerer Hohlräume (Trichterwachstum).
- **Stufe 4 (Echtzeit-Metriken & Print-Rezept):**
  - Live-Berechnung der fraktalen Dimension $D_f$ via 3D-Box-Counting.
  - Physische Druckschranken (Mindest-Astdurchmesser, Überhangwinkel) als aktive Wachstumsbegrenzer im Solver.
  - Export: Wasserdichtes 3MF/STL für den 3D-Druck sowie teilbarer Seed-Code (`K3D-[Seed]-[Params]`).

**Nicht dabei:** Kein proprietärer Slicer, kein geschlossener Web-Shop, keine Batch-Cloud-Berechnung (alles läuft 100 % lokal im Browser).

## Das Buch zur Dose (Rohrecherche & Architektur)

- [Kapitel 1: Didaktische & Physikalische Recherche](../02-recherche/kristallwachstum-3d-didaktik-physik.md) — Analyse von WebGPU-DLA (`scttfrdmn`, `markstock/dla-nd`), Phasenfeld-Solidification (`fronkt/solidify`, Kobayashi 1993) und der 4-Stufen-Architektur.
- [Kapitel 2: Open-Source-Scaffolding](../07-demos/kristallwachstum-3d/README.md) — Konkrete WGSL-Shaderkerne (`shaders.wgsl.ts`), DLA-Driftkorrektur, Box-Counting und STL-Export.

## Umsetzungsstand & Nächster Schritt

- **Ticket 01 (Abgeschlossen & Verifiziert):** Hybride DLA-Brownsche Keimung gekoppelt mit Kobayashi-Phasenfeld-Relaxation, 3D-Box-Counting ($D_f$-Messung im Vergleich zur Literatur), interaktiver 3D-Kamera, Z-Schnitt-Ebene, 6 Gefügelinsen und wasserdichtem STL-Export (`src/engine/kristallwachstum/` & `KristallwachstumSimulator.tsx`).
- **Ticket 02 (Nächster Schritt): GPU-Marching-Cubes Isosurface-Extraktion & Mehrfarbiger 3MF-Farbexport.**
  1. Marching-Cubes-Kerne zur glatten Facettenrekonstruktion bei $\phi = 0{,}5$ ohne Treppenartefakte.
  2. Generierung eines validen 3MF-OPC/ZIP-Archivs mit `<colorgroup>`-Materialkanälen.
  3. Direktes Backen der EBSD-IPF-Orientierungen und petrologischen Wachstumszonierungen (`ZONING`) als Farbkanäle für Multi-Material-3D-Drucker (z. B. Bambu Lab AMS / Prusa MMU).
  4. **Fertig, wenn:** Das exportierte 3MF-Archiv von PrusaSlicer/Bambu Studio geladen wird und die internen Wachstumsringe als separate Extruder-Farben fehlerfrei druckbar sind.
  - Detail-Ticket: [07-demos/kristallwachstum-3d/ticket-02-gpu-marching-cubes-3mf.md](../07-demos/kristallwachstum-3d/ticket-02-gpu-marching-cubes-3mf.md)

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
