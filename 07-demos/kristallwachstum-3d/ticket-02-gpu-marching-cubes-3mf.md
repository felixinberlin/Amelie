# Ticket 02: GPU-Marching-Cubes Isosurface-Extraktion & Mehrfarbiger 3MF-Export

**Komponente:** `src/engine/kristallwachstum` / `src/components/simulators/KristallwachstumSimulator.tsx`
**Status:** Ready for Implementation
**Priorität:** Hoch (Nächster logischer Schritt nach Abschluss von Ticket 01)
**Zuständigkeit:** 3D-Geometrie / Computergraphik / Additive Fertigung
**Zugehörige Dose:** [`05-dosen/kristallwachstum-3d.md`](../../05-dosen/kristallwachstum-3d.md)
**Architektur & Recherche:** [`02-recherche/kristallwachstum-3d-didaktik-physik.md`](../../02-recherche/kristallwachstum-3d-didaktik-physik.md)

---

## 1. Problemstellung & Motivation

Mit Ticket 01 wurde die Kernsimulation (DLA + Kobayashi-Phasenfeld, 3D-Box-Counting $D_f$, STL-Export) im Browser lauffähig umgesetzt. 

Der bisherige STL-Export hat jedoch zwei inhärente didaktische und fertigungstechnische Grenzen:
1. **Treppenartefakte durch Voxel:** Die Voxel-Extraktion erzeugt blockartige Kuben-Facetten. Natürliche Kristalltrachten (z. B. pyramidale Quarzspitzen, hexagonale Prismen, Wulff-Gleichgewichtsformen) zeichnen sich jedoch durch glatte kristallographische Ebenen aus.
2. **Monochromie des STL-Formats:** Das STL-Format unterstützt keine Farben oder Materialzuordnungen. In der mineralogischen und werkstoffkundlichen Lehre ist die visuelle Trennung von **Wachstumszonen (ZONING)** und **Kristallorientierungen (EBSD-IPF)** das entscheidende didaktische Merkmal.

Moderne 3D-Drucker im Hochschul- und Maker-Bereich (z. B. Bambu Lab AMS, Prusa XL Multi-Material, Stratasys PolyJet) verarbeiten native **3MF-Dateien** (3D Manufacturing Format) mit Farbdefinitionen pro Vertex oder Dreieck.

---

## 2. Technische Aufgabenpakete

- [ ] **Task 1: GPU-gestützte Marching Cubes Isosurface-Extraktion**
  - Implementierung eines Look-Up-Table (LUT) Marching-Cubes-Kerns zur Extraktion der Isosurface bei $\phi = 0{,}5$.
  - Trilineare Interpolation der Knotenwerte zur exakten Rekonstruktion glatter Facetten und Kanten ohne Treppenbildung.
  - Gewährleistung einer 2-Manifold-Topologie (keine Kantenkollisionen, keine offenen Löcher).

- [ ] **Task 2: Multi-Material 3MF-Archiv-Generator**
  - Erzeugung eines validen OPC/ZIP-Containers mit MIME-Type `application/vnd.ms-package.3dmanufacturing-3dmodel+xml`.
  - Strukturierung der `3D/3dmodel.model` XML-Datei nach der 3MF Core Specification 1.2.3.
  - Einbettung von `<colorgroup>` und `<color>`-Definitionen für Hex-Farbwerte.

- [ ] **Task 3: Gefügelinsen-Backing (EBSD & Petrologische Zonierung)**
  - Farbzuweisung jedes Vertex anhand der aktiven Gefügelinse:
    - `ORIENT`: EBSD-Inverse-Pole-Figure (IPF) RGB-Triplets direkt auf der Kristalloberfläche.
    - `ZONING`: Konzentrische Wachstumsringe nach Kristallisationsiteration ($t_{\text{birth}}$), ideal für Anschauungsmodelle magmatischer Schmelzprozesse.
    - `THERM`: Eingefrorene thermische Gradienten der Erstarrungswärme.

- [ ] **Task 4: Didaktischer Schichtstärken- und Stützstrukturen-Check**
  - Automatisches Taggen von Überhangflächen $> 45^\circ$ im 3MF-Metadatenbereich (`<build>`).
  - Warnung bei Detailelementen unterhalb der Düsenauflösung ($< 0{,}4\,\text{mm}$).

---

## 3. Akzeptanzkriterien (Definition of Done)

1. **Glatte Kristalltrachten:** Die rekonstruierte Marching-Cubes-Oberfläche bildet planare Facetten mit einer mittleren Normalabweichung $< 5^\circ$ zur analytischen Kristallrichtung ab.
2. **3MF-Standardkonformität:** Das generierte 3MF-Archiv öffnet fehlerfrei in PrusaSlicer, Bambu Studio und OrcaSlicer ohne Konvertierungsfehler oder Reparaturbedarf.
3. **Mehrfarbigkeit im Slicer:** Bei Auswahl der Gefügelinsen `ORIENT` oder `ZONING` werden die Farben als getrennte Extruder-Tools oder Vertex-Farben im Slicer erkannt und dargestellt.
4. **Testabdeckung:** Neuer automatisierter Test `marchingCubes.test.ts` bzw. `export3MF.test.ts` verifiziert die XML-Validität und ZIP-Entpackbarkeit.
