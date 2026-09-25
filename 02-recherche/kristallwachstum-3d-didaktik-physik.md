# Kristallwachstum 3D: Didaktische & Physikalische Recherche

**ID / Slug:** `kristallwachstum-3d`  
**Datum:** 25. September 2026  
**Lizenz:** CC0 1.0 Public Domain  

---

## 1. Ausgangslage & Der didaktische Engpass

Die Kristallisation und Dendritenbildung in der Natur (Schneeflocken nach Nakaya/Frank, Eisblumen, Wismut-Trichter, metallurgische Erstarrungsgefüge, geologische Pegmatite und Mineral-Aggregate) wird in Schule und Universität fast ausnahmslos anhand statischer 2D-Schemazeichnungen vermittelt. 

Klassische 3D-Simulationen galten lange als rechenzeitintensiv und Supercomputern vorbehalten. In der Creative-Coding- und Maker-Szene existieren zwar zahllose 2D- und 3D-DLA-Implementierungen (Diffusion-Limited Aggregation nach Witten & Sander, 1981), diese enden jedoch zu 99 % am selben Punkt: **ein Bild oder ein statischer Punktwolken-Render**.

Weder physikalisch-thermodynamische Didaktik (Anisotropie, Keimbildung, Phasenfeld-Kopplung) noch eine echte Überführung in die Realität (druckfertiges, wasserdichtes Mesh, parameterstabiles Rezept) werden bisher in einem zugänglichen Browser-Werkzeug vereint.

---

## 2. Stand der Open-Source-Ökosysteme & Gaps

Eine detaillierte Prüfung moderner GPU- und Algorithmen-Repositories zeigt die Bausteine und Lücken:

| Repository / Projekt | Verifizierte Stärken & Fähigkeiten | Grenzen / Lücken für Kristallwachstum 3D |
| :--- | :--- | :--- |
| **scttfrdmn/webgpu-compute-exploration** | 10 interaktive WebGPU/WGSL-Beispiele inkl. DLA, SPH-Fluide, Molekulardynamik, Rust/WASM-Pipelines. | Reine Partikelsimulation, keine Phasenfeld-Relaxation, keine Gitter-Kristallographie, kein didaktisches Analyse-Interface. |
| **fronkt/solidify** | Kobayashi (1993) anisotropes Phasenfeld-Modell für unterkühlte Schmelzen auf WGSL-Compute-Shadern. Echte 3D-Volumetrie (bis 192³ ≈ 7,1 Mio. Voxel), Quaternionen-Orientierung pro Korn, kubische ⟨100⟩ und hexagonale K₆-Anisotropie, 9 didaktische Linsen (MELT, ORIENT, SLICE, SEM, THERM etc.), EBSD-IPF- und Niyama-Karten. | Reines Phasenfeld-Kontinuum; keine DLA-Brownian-Skelett-Keimung für fraktale Keimstrukturen. |
| **markstock/dla-nd** | Arbiträr-dimensionales (1D–5D) C/Off-Lattice-DLA; persistente 2^D-Tree-Raumunterteilung, analytischer Quartic-Solver zur Vermeidung von Drift-Bias bei Partikelsprüngen; Stickiness- und Stubbornness-Modelle; OBJ-Export. | C-Code, nicht browsernativ; keine Gitterbindungs-Orientierungsfelder. |
| **max-ayres/DLA-Project** & **jrieke/DiffusionLimitedAggregation** | Mathematische Analyse von Injektions-/Kill-Radien; Berechnung fraktaler Dimensionen (Box-Counting); Python/Cython 3D-Gitter. | Reine akademische Python-Skripte ohne Shader-Echtzeit. |
| **pyPFC** | 3D Phase Field Crystal (PFC) Modellierung mit PyTorch (GPU/CPU) auf atomarer Skala. | Schwergewichtiges Python/PyTorch-Forschungsframework, ungeeignet für 60 FPS im Webbrowser. |
| **MRAC-IAAC/Diffusion-Limited-Aggregation** | Morphogenetische 3D-DLA-Erweiterung (Grasshopper/Kangaroo2) mit Richtungsvektoren, Spin und Kurven-Attraktoren für asymmetrische Mineralisation. | CAD-spezifisch, keine WebGPU/WebGL-Basis. |

### Die Forschungslücke (Restlücke)

1. **Hybride Synthese (DLA → Phasenfeld):** Brownian-Motion-Skelettierung via DLA liefert die fraktale Keim-Morphologie; eine anschließende Phasenfeld-Relaxation (Allen-Cahn / Kobayashi-Gleichung) glättet Grenzflächen thermodynamisch konsistent und bildet atomare Gitteranisotropien ab.
2. **Orientierungsfeld-geführtes DLA:** Speicherung einer Orientierungsmatrix / Quaternion pro verankertem Kristallit, um echte kristallographische Trachten (z. B. kubisch wie Pyrit/Halit oder hexagonal wie Quarz/Eis) mit organischen Übergängen darzustellen.
3. **Didaktische Schicht & physisches Rezept:** Echtzeit-Messung der fraktalen Dimension $D_f$, Gefügeanalyse (ASTM-Korngröße) und Export als deterministisches Seed-Rezept samt wasserdichtem 3MF/STL-Mesh.

---

## 3. Die 4-Stufen-Architektur für WebGPU / WebGL2

```
[Stufe 1: DLA-Skelettierung] ──► [Stufe 2: Phasenfeld-Relaxation] ──► [Stufe 3: Voxel/Isosurface] ──► [Stufe 4: Didaktik & Export]
   • WGSL Compute Shader           • Kobayashi (1993) Modell            • GPU Marching Cubes              • Fraktale Dimension D_f
   • Quartic-Solver Bias-Korr.     • Anisotrope Grenzflächenenergie     • TSL / Three.js PBR Shader       • 9 Didaktische Linsen
   • Orientierungs-SSBO            • Latente Schmelzwärme τ ∂φ/∂t       • Wasserdichte Manifold-Netze     • Seed-Rezept & 3MF/STL
```

### Stufe 1: DLA-Skelett-Generierung (WebGPU Compute Shader)
- Partikel führen Brownsche Zufallsbewegungen in einem sphärischen Injektionsvolumen aus ($R_{\text{inj}} = 1,5 \cdot R_{\text{cluster}}$, $R_{\text{kill}} = 1,725 \cdot R_{\text{cluster}}$).
- Ein 3D-Speicherpuffer (`storage buffer`) hält das Belegungs- und Orientierungsfeld vor.
- Partikel lagern sich mit einstellbarer Stickiness an. Die Gitterbindung wird durch lokale Kristallachsen bestimmt.

### Stufe 2: Phasenfeld-Relaxation (Kobayashi-Formalismus)
- Die DLA-Belegung dient als Anfangswert für den Phasenordnungsparameter $\phi \in [0, 1]$ (0 = Schmelze/Lösung, 1 = Festkörper).
- Ausführung von 100–300 Zeitschritten der Allen-Cahn-Gleichung mit anisotrope Funktion $\epsilon(\theta, \psi)$:
  $$\tau \frac{\partial \phi}{\partial t} = \nabla \cdot (\epsilon^2 \nabla \phi) + \phi(1-\phi)\left(\phi - \frac{1}{2} + m(T)\right)$$
- Bildet dendritische Verästelungen, Ecken und Facetten thermodynamisch korrekt aus.

### Stufe 3: Rendering & Isosurface-Extraktion
- Rendering über GPU-beschleunigte Marching Cubes oder Instanced-Lattice-Voxel.
- Neun didaktische Linsen nach Solidify-Vorbild:
  - `MELT`: Phasengrenze flüssig/fest.
  - `ORIENT`: Inverse Pole Figure (IPF) Falschfarben nach Kristallorientierung.
  - `THERM`: Lokales Temperatur- und Übersättigungsfeld.
  - `SEM`: Virtuelle Rasterelektronenmikroskopie-Beleuchtung.
  - `CURV`: Mittlere Oberflächenkrümmung.

### Stufe 4: Didaktische Metriken & Print-Rezept
- **Echtzeit-Berechnung der fraktalen Dimension:** Box-Counting über 3D-Oktree ($D_f \approx 1,71$ in 2D bzw. $2,29 \dots 2,50$ in 3D).
- **Das Rezept:** Ein kurzer komprimierter String `K3D-[Seed]-[Stickiness]-[Anisotropie]-[Supercooling]`.
- **Mesh-Garantie:** Begrenzung von Mindestwandstärken und Überhängen direkt im Wachstums-Solver.

---

## 4. Empfänger & didaktischer Nutzen

1. **Universitäre Lehre & Institute:**
   - FU Berlin, Fachbereich Geowissenschaften (Mineralogie-Petrologie).
   - TU Berlin, Institut für Werkstoffwissenschaften und -technologien (Metallurgische Erstarrung).
   - Museum für Naturkunde Berlin (Didaktik der Mineralbildung).
2. **Open-Source- & Didaktik-Community:**
   - Three.js / WebGPU Creative Coding Showcase.
   - OER (Open Educational Resources) Geowissenschaften.
   - Maker-Community (Prusa Printables / Nervous System) für mathematisch reproduzierbare generative Kunstobjekte.
