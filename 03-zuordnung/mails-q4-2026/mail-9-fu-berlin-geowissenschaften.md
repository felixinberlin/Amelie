# Mail 9 — Kristallwachstum 3D → FU Berlin Geowissenschaften (Mineralogie-Petrologie)

**Status:** Entwurf als Datei, versandfertig.
**An:** timm.john@fu-berlin.de — Prof. Dr. Timm John, Leiter der Arbeitsgruppe Mineralogie-Petrologie, Institut für Geologische Wissenschaften, Freie Universität Berlin (Malteserstr. 74–100, 12249 Berlin). Adresse am 25.09.2026 von `fu-berlin.de/geol` abgelesen.
**Betreff:** Idee zu verschenken: Interaktive 3D-Kristallisation & Gefüge-Didaktik im Browser

---

Guten Tag Prof. John,

ich recherchiere Software-Werkzeuge, die erst seit kurzer Zeit technisch im Browser möglich sind, und baue nur einen kleinen Teil davon selbst. Diese Idee gehört thematisch in die geowissenschaftliche Lehre (Mineralogie, Kristallographie und Gefügebildung) und nicht zu mir — deshalb schenke ich sie Ihnen und Ihrem Fachbereich.

In der universitären Didaktik werden Nichtgleichgewichts-Kristallisation, Dendritenwachstum und Grenzflächenenergie häufig noch über statische 2D-Diagramme oder Kunststoffgitter vermittelt, weil rigorose 3D-Simulationen historisch Supercomputer brauchten. Gleichzeitig bleiben existierende Web-Demos zur Diffusionsbegrenzten Aggregation (DLA) reine Bildschirmschoner: hübsche Partikelwolken ohne thermodynamischen Antrieb und ohne kristallographische Orientierungsfelder.

Kristallwachstum 3D schließt diese Lücke direkt im Browser über WebGPU:
1. **Hybride Physik:** Brownsche DLA-Partikelkeimung mit analytischer Driftkorrektur, gekoppelt mit dem Kobayashi-Phasenfeld-Modell (1993) für unterkühlte Schmelzen auf volumetrischen 3D-Gittern.
2. **Didaktische Gefügelinsen:** Echtzeit-Umschaltung zwischen 5 Analyse-Ebenen (Phasenordnungsparameter φ, EBSD-IPF Orientierungsfeld, thermische Unterkühlung ΔT mit latenter Wärme, Gibbs-Thomson-Krümmung und virtuelles Rasterelektronenmikroskop).
3. **Quantitative Didaktik & 3D-Druck:** Live-Messung der fraktalen Dimension (D_f) über 3D-Box-Counting, deterministische Rezept-Hashes (`K3D-...`) und direkter Export wasserdichter, stützfreier Manifold-Meshes (3MF/STL) für den 3D-Druck im Hörsaal.

Ein kompaktes Dokument mit Architektur, physikalischer Herleitung und den Bruchstellen (wo das Modell numerisch kippen kann):
https://github.com/felixinberlin/Amelie/blob/main/05-dosen/kristallwachstum-3d.md

Das funktionale Open-Source-Scaffolding mit WGSL-Shaderkernen, STL-Generator und interaktivem Voxel-Laufzeitkern steht frei bereit:
https://github.com/felixinberlin/Amelie/tree/main/07-demos/kristallwachstum-3d

Falls das für eine studentische Abschlussarbeit, ein Lehrprojekt in den Geomaterialien oder eine interaktive Vorlesungs-Visualisierung nützlich ist: Nehmen Sie den Code, verändern oder veröffentlichen Sie ihn nach Belieben.

Keine Bedingungen, CC0 / gemeinfrei, keinerlei Gegenleistung erwartet. Wenn Sie für solche interaktiven Visualisierungen im Fachbereich keine Verwendung haben oder bereits an Ähnlichem arbeiten, ignorieren Sie diese Nachricht bitte einfach — ich hake nicht nach.

Mit freundlichen Grüßen
Félix
Berlin · github.com/felixinberlin/Amelie
