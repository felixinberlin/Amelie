---
status: Available
delivery_method: E-Mail
target_maker: Ernst-Abbe-Hochschule Jena
review_score: 32/35
architecture_tier: Tier 1
source_type: Type D
---
# Abbe-Puzzle: Der Fourier-Filter

*(Arbeitstitel im Bisoziation-Log: Abbe 4f-Werkbank / Licht-Schnitzer)*

**Ein Satz:** Ein optisches Physik-Puzzlespiel, das die 2D-Fouriertransformation vom Formelblatt auf eine interaktive 4f-Werkbank holt — du schneidest Blenden in die Beugungsebene, um Maschendrahtzäune verschwinden zu lassen, Phasenobjekte ohne Farbstoff sichtbar zu machen und Druckraster aus Archivalien zu filtern, in Echtzeit bei Lichtgeschwindigkeit.

**Stand:** 25. September 2026 · **Prüfen ab:** September 2027  
**Empfänger:** **Ernst-Abbe-Hochschule Jena** (Fachbereich SciTec / Laser- und Optotechnologien, Carl-Zeiss-Promenade 2, 07745 Jena; Prof. Dr. Jens Bliedtner / Didaktik der Photonik) · nachrangig: **DPG Fachgruppe Didaktik der Physik** (Prof. Dr. Holger Cartarius), Physikalisches Anfängerpraktikum der LMU München und TU Berlin (Versuch „Abbe-Theorie / Ortsfrequenzfilterung")  
**Verdikt:** 🎁 **verschenken** — Hochschule am Geburtsort der modernen Optik mit Weiterbildungs- und Lehrauftrag für Photonik und Mikroskopie; die Idee schließt die Lücke zwischen theoretischer Wellenmechanik und frustrierender optischer Justagepraxis  
**Review:** 32/35 · Tier 1 · Type D (Details: [Klassifikations-Log](../06-suche/amelie-classification-log.md))

---

## Das Problem

In der Hochschullehre der Physik, Elektrotechnik und Mikroskopie gehört die zweidimensionale Fouriertransformation ($\mathcal{F}\{f(x,y)\}$) zu den am schwersten vermittelbaren Konzepten. In den Vorlesungen wird sie als rein abstrakte Doppelintegralrechnung auf Tafeln abgeleitet: Studierende memorieren Formeln, entwickeln jedoch keinerlei räumliche Intuition dafür, was Ortsfrequenzen ($k_x, k_y$) in einem optischen Wellenfeld bedeuten — warum hohe Frequenzen an den Bildrändern scharfe Kanten bilden, niederfrequente Anteile das globale Lichtfeld tragen und periodische Muster als diskrete Beugungspeaks orthogonal im Frequenzraum aufblitzen.

Im physikalischen Praktikum (z. B. am Thorlabs EDU-FOP2 Kit) scheitert das Verstehen an der Mechanik:

- **Der 5-Stunden-Justageflaschenhals:** Studierende verbringen vier bis fünf Stunden im abgedunkelten Labor mit Mikrometerschrauben, Raumfiltern und Laserjustage. 90 % der Praktikumszeit wird auf das Beseitigen von Strahlfehlern, Staubbeugungsringen und Astigmatismus verschwendet. Für das eigentliche Experiment — das Erkunden von Filtermasken in der Fourier-Ebene — bleiben oft nur zehn Minuten, in denen hektisch ein einzelner Spalt oder ein Kreuzgitter eingeschoben wird.
- **Fehlende Exploration:** Weil das manuelle Einsetzen von Blenden mikrometergenau erfolgen muss, erprobt niemand unkonventionelle Eingriffe (Schlierenkanten, Zernike-Phasenringe, strukturierte Notch-Filter, optische Korrelation). Die Erkenntnis, dass eine Linse eine kontinuierliche 2D-Fouriertransformation *bei Lichtgeschwindigkeit mit null Watt Stromverbrauch* berechnet (analoges optisches Rechnen), bleibt ein toter Buchstabe.
- **Die Mikroskopie-Blindheit:** Biologie- und Medizinstudierende nutzen täglich Phasenkontrast- und Dunkelfeldmikroskope, verstehen jedoch nicht, warum ein zentraler Ring oder eine Phasenplatte eine transparente, lebende Zelle plötzlich mit plastischem Relief und hohem Kontrast sichtbar macht.

**Wer leidet:** MINT-Studierende im Physik-, Mikroskopie- und Photonikpraktikum, Dozenten der physikalischen Fachdidaktik und MTA-Nachwuchs in der Zytologie, die komplexe optische Kontrastverfahren anwenden, ohne das Wellenprinzip je begriffen zu haben.

## Warum das jetzt geht

1. **Sub-2ms 2D-FFT im Browser:** WebGL2 und standardisiertes WebAssembly mit SIMD führen komplexe zweidimensionale Cooley-Tukey-FFTs auf $256 \times 256$ bis $512 \times 512$ Pixel-Gittern in unter 1,5 Millisekunden aus. Das ermöglicht vollwertige 60-FPS-Interaktivität auf jedem handelsüblichen Laptop oder Tablet ohne Installation.
2. **Direkte Haptik auf dem Frequenzraum:** HTML5 Canvas erlaubt es, Beugungsmasken mit Touch- oder Mausgesten direkt in den Frequenzraum zu schnitzen (Pinholes stanzen, Spalte drehen, Zernike-Phasenplatten aufdampfen, Schlieren-Rasierklingen einschieben) und die Bildrekonstruktion in Echtzeit synchron mitzubewegen.
3. **Didaktische Gamification historischer Meilensteine:** Die Physikgeschichte bietet eine fertige, didaktisch brillante Puzzle-Progression: Ernst Abbes Beugungsexperimente (1873), A. B. Porters Gitterfilterung (1906), Frits Zernikes Phasenkontrastverfahren (Nobelpreis 1953) und August Toeplers Schlierenfotografie lassen sich 1:1 als physikalische Rätselstufen abbilden.

## Skizze

- **Der Versuchsaufbau:** Virtuelle 4f-Optikbank auf dem Bildschirm: Kollimierter Laserstrahl ($\lambda = 532\text{ nm}$) $\to$ Objektträger $\to$ Fourier-Linse $L_1$ ($f = 200\text{ mm}$) $\to$ **Fourier-Filterebene** $\to$ Rekonstruktionslinse $L_2$ ($f = 200\text{ mm}$) $\to$ Kamerasensor.
- **Die Dual-Darstellung:** Links das Originalobjekt, in der Mitte die Fourier-Ebene mit logarithmischem Amplitudenspektrum $\log(1 + |F(k_x, k_y)|)$ und Phasenkarte $\arg(F)$, rechts das in Echtzeit rekonstruierte Ausgangsbild.
- **Die Werkzeugpalette (Filterblenden):**
  - *Lochblende (Pinhole / Tiefpass):* Lässt nur niedrige Frequenzen durch $\to$ weiches, gemitteltes Bild; entfernt feinkörniges Rauschen.
  - *Zentraler Block / Dunkelfeld (Hochpass):* Blockiert den ungebeugten DC-Strahl $\to$ fluoreszierend leuchtende Kanten transparenter Objekte auf tiefschwarzem Grund.
  - *Spaltblende (Richtungsfilter):* Filtert orthogonale Raumrichtungen; löscht vertikale Streifen aus Kreuzrastern.
  - *Notch-Stempel (Beugungsfilter):* Stanzt gezielt Beugungsmaxima aus $\to$ entfernt Moiré-Muster, Halbtaster-Druckpunkte oder Zäune, ohne den Hintergrund zu beeinträchtigen.
  - *Schlieren-Kante (Messerblatt):* Schiebt eine Kante in den Frequenznullpunkt $\to$ wandelt unsichtbare Phasensteigungen (Wärmeschlieren, Glaswellen) in plastischen 3D-Lichtschattenwurf um.
  - *Zernike-Phasenplättchen ($\lambda/4$ bzw. $\pi/2$ Verzögerung):* Phasenkontrastmikroskopie für Phasenobjekte.
- **Puzzle-Kampagne:**
  1. *Level 1 (Der Zaun im Zoo):* Ein Gepard hinter einem regelmäßigen Maschendrahtzaun. Ziel: Finde die Beugungspeaks des Drahtgitters in der Fourier-Ebene und blockiere sie — der Zaun verschwindet spurlos, der Gepard bleibt gestochen scharf.
  2. *Level 2 (Das Geheimnis der Amöbe):* Ein transparentes Phasenobjekt im Wasserglas ($I \approx \text{const}$, aber $\Delta \phi(x,y)$ variiert). Ziel: Setze einen Zernike-Phasenpunkt ein, um die Zellorganellen sichtbar zu machen.
  3. *Level 3 (Der Telegramm-Scan von 1914):* Ein historisches Druckdokument mit störendem 60-lpi-Halbton-Raster. Ziel: Entferne das Druckraster, um eine verblasste handschriftliche Signatur lesbar zu machen.
  4. *Level 4 (Heißluft-Ballon):* Unsichtbare thermische Konvektionsströme über einer Kerze sichtbar machen via Toepler-Schlieren-Messer.
  5. *Level 5 (VanderLugt-Sucher):* Optische Bildkorrelation zum Auffinden eines Musters im Satellitenbild mit einem holografischen Matched Filter.

**Nicht dabei:** Kein Strahljustage-Simulator mit 3D-Schraubengewinden (das löst das echte Praktikum); keine rein geometrische Strahlenoptik (dafür gibt es Chromatron); keine Fourier-Reihen-Mathematik mit Formel-Eingaben.

## Erster Schritt

**Ticket: Ein Gitter, ein Zaun, ein Pinhole, ein invertierbares 2D-FFT-Canvas.**

Ein 2D-Cooley-Tukey-FFT-Lauf für ein 256x256-Graustufenbild mit einem Objekt hinter einem regelmäßigen Gitter; die Fourier-Ebene visualisiert das 2D-Amplitudenspektrum mit zentrierter DC-Komponente; ein interaktiv platzierbarer Notch-Filter (zwei Kreis-Stempel) blockiert die diskreten Beugungspeaks des Gitters; die inverse FFT rekonstruiert das gefilterte Bild in unter 16 ms im Browser.

**Fertig, wenn:** drei Physik-Studierende oder Optik-Dozenten auf Anhieb verstehen, warum das Ausblenden von nur zwei Punkten im Spektrum das gesamte Zaungitter aus dem Bild löscht, während das Objekt unberührt bleibt — und ein automatischer Vitest-Lauf beweist, dass das Parseval-Theorem ($\sum |f|^2 = \frac{1}{N} \sum |F|^2$) auf unter 0,1 % Genauigkeit numerisch eingehalten wird.

## Wo es kippt

**1. Verwechslung mit Photoshop-Filtern:** Wenn Spielende denken, sie bedienen lediglich einen Weichzeichner oder Scharfzeichner, verpufft der didaktische Wert vollständig.  
*Gegenmaßnahme:* Die Benutzeroberfläche zeigt zwingend den realen physikalischen 4f-Strahlengang mit Laser, Linsen und Fourier-Ebene mit physikalischen Einheiten (nm, Linien/mm, Phasenwinkel $\Delta \phi$). Jeder Level knüpft explizit an historische Originalexperimente an (Abbe 1873, Porter 1906, Zernike 1934).

**2. Diskretes FFT-Aliasing:** Eine diskrete 2D-FFT auf $256 \times 256$ Pixeln neigt zu periodischen Randartefakten (Kantenkreuz im Spektrum), die in kontinuierlichem Laserlicht nicht vorkommen.  
*Gegenmaßnahme:* Integrierte Hanning- bzw. Tukey-Fensterung am Bildrand dämpft künstliche Kantenübergänge und garantiert saubere optische Spektren.

## Wer es schon versucht hat

**Recherche 25.09.2026, englisch und deutsch.** Ausführlich: `06-suche/amelie-pruefprotokoll.md`, Runde 13 / Bisoziation Run 8.

- **Geometrische Optikspiele besetzen die falsche Nische:** *Laser Maze*, *Chromatron*, *Optika*, *Aargon* basieren ausnahmslos auf geometrischer Strahlenoptik nach Snellius (17. Jh.) mit Spiegeln, Prismen und Farbteilern — null Wellenmechanik, null Beugung, null Fourier-Optik.
- **Didaktische Mathe-Erklärer ohne Spiel:** Jezzamon (*An Interactive Guide to the Fourier Transform*), 3Blue1Brown und Wolfram Demonstrations visualisieren Fourier-Transformationen als passive oder animierte Schaubilder — keine Spielmechanik, keine Rätsel-Progression, kein physikalischer 4f-Strahlengang.
- **Laborbänke ohne didaktische Zeit:** Universitäts-Praktika (LMU, TU Berlin, RWTH Aachen, Thorlabs EDU-FOP2) nutzen reale 4f-Optikbänke, verlieren jedoch 90 % der Zeit an Justierfrust; Studierende probieren maximal zwei Standard-Spalte aus.
- **Fachsoftware ohne Gamification:** ImageJ/Fiji bietet FFT-Bandpassfilterung als isolierten Menüpunkt für Forscher — ohne didaktische Führung oder physikalische Strahlengang-Visualisierung.

**Restlücke:** Ein wellenoptisches Physik-Puzzlespiel, das die 2D-Ortsfrequenzfilterung nach Ernst Abbe mit echten Beugungsmasken interaktiv spielbar macht und physikalische Intuition für analoges optisches Rechnen vermittelt.

## Vorarbeit

- **Ernst Abbe (1873):** *Beiträge zur Theorie des Mikroskops und der mikroskopischen Wahrnehmung*, Archiv für mikroskopische Anatomie 9, S. 413–468.
- **Joseph W. Goodman (2005):** *Introduction to Fourier Optics*, 3rd/4th Edition, McGraw-Hill.
- **Frits Zernike (1934):** *Phase contrast, a new method for the microscopic observation of transparent objects*, Nobelpreis für Physik 1953.
- **Thorlabs EDU-FOP2:** *Educational Fourier Optics Kit*, Versuchsanleitung und Experimentiervorlagen.
- **DIN ISO 10934:** *Optik und optische Instrumente — Mikroskopie*.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
