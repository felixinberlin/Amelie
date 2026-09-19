# Altbau Thermal

**Ein Satz:** Grundriss zeichnen, Baualtersklasse wählen, sehen, was die eigene Wohnung thermisch tut — an der Ecke hinter dem Schrank, nicht im Mittel. Die Innenperspektive zu dem, was EnergyMap Berlin von außen für jedes Gebäude ausrechnet.

**Stand:** 19. September 2026 · **Prüfen ab:** September 2027
**Empfänger:** Forschungsverbund EnergyMap Berlin (Leitung UdK Berlin, Fachgebiet VPT) · nachrangig: Verbraucherzentrale Berlin (Energieberatung)
**Verdikt:** 🎁 verschenken — Prüfprotokoll: *verengt* (siehe „Wer es schon versucht hat")

---

## Das Problem

Seit Mai 2025 prognostiziert **EnergyMap Berlin** per KI den Wärmebedarf des Berliner Gebäudebestands (rund 360.000 Gebäude). Damit ist beantwortet: *Was braucht dieses Gebäude?* Offen bleibt: **Was tut meine Wohnung?** Das hängt vom Grundriss ab, von der Ecke hinter dem Schrank und vom Heizkörper unter der Nische. Kein Kataster kann das schließen.

- **Der Schimmelstreit.** Mieter:innen wird gesagt, sie lüfteten falsch; die Eigentümerseite sagt, die Wand sei in Ordnung. Was fehlt, ist eine Aussage, die beide prüfen können: **„Diese Ecke bleibt unter 80 % Oberflächenfeuchte, solange die Raumluft unter X % relativer Feuchte bleibt."** Liegt X bei 42 %, hilft Lüften allein kaum, denn schon normale Raumfeuchte überschreitet die Grenze. Liegt X bei 60 %, hat die Ecke Reserve.
- **Die 20.000-Euro-Entscheidung.** Fenster tauschen, dämmen oder Heizkörper vergrößern: Für *seinen* Grundriss kann niemand die Varianten vergleichen.
- **Die Beratungslücke.** Die Verbraucherzentrale erklärt im Gespräch, was ein Bild in zehn Sekunden zeigen würde (Basis-Check als Hausbesuch in der Mietwohnung kostenlos, Gebäude-Check 30 € Eigenanteil). Ratsuchende können nichts mitnehmen.

**Kein Konkurrenzprodukt:** Das Werkzeug beginnt an der Gebäudehülle und verbraucht EnergyMap-Daten, statt sie zu ersetzen.

## Warum das jetzt geht

1. **Grundriss aus Foto oder PDF** gibt es als Produkt (RoomSketcher, FloorScan). Öffnungen werden schlechter erkannt als Wände, deshalb bestätigt der Mensch jeden Treffer.
2. **Parameter ohne Fachwissen.** Niemand kennt den U-Wert seiner Wand, aber fast alle wissen „Altbau, etwa 1905, Kastenfenster". Die Gebäudetypologie des IWU (TABULA) ordnet Baualtersklassen Bauteilaufbauten zu; 35 cm Vollziegel der Gründerzeit liegt bei U ≈ 1,4–1,6. Die **Streuung innerhalb der Klasse** ist das Band, das die Oberfläche zeigen muss.
3. **2D-Wärmeleitung im Browser.** Stationär genügen JavaScript oder WASM; WebGL2 lohnt erst für die instationäre Echtzeit-Animation.
4. **Freie Wetterdaten:** DWD/BBSR-Testreferenzjahre.
5. **Abrufbare Gebäudedaten:** EnergyMap bietet CSV-Download und Energieatlas-Dienste, `energymap4py` ist auf GitHub veröffentlicht. Welche Attribute genau (Baualtersklasse, Geometrie, Sanierungsstand) abfragbar sind, habe ich nicht geprüft — die erste Frage an den Verbund.

## Skizze

Zeichnen → parametrisieren → simulieren → vergleichen.

- **Eingabe:** Grundriss auf Raster oder aus Bild; Wände, Fenster, Heizkörper. Adresse → Gebäudekontext aus EnergyMap, von Hand korrigierbar.
- **Modell:** Wärmeleitung in **zwei Schnitten**: horizontal (Außenecken, Laibungen, der Schimmelfall) und vertikal (Decke, Brüstung, Heizkörpernische). Raumluft als durchmischter Knoten, keine Strömung. Den Möbeleffekt trägt der Wärmeübergangswiderstand hinter dem Schrank (0,25 statt 0,13 m²K/W).
- **Schimmel ist kein Taupunkt.** Er wächst ab etwa 80 % relativer Oberflächenfeuchte, ohne Kondensat (fRsi ≥ 0,70; bei 20 °C/50 %/−5 °C sind das 12,6 °C, der Taupunkt liegt bei 9,3 °C). Diese stationäre Grenze ist konservativ; das Wetterjahr liefert die **Stunden über 80 %** als Risikoindikator, nie als Befund.
- **Ausgabe:** Temperaturfeld, Ecken-Oberflächentemperatur, Feuchtegrenze der Ecke, Verbrauch und Kosten **als Band**.
- **Der eigentliche Nutzen: A/B.** Zwei Varianten desselben Grundrisses, gleiche Wetterdaten, gleiche Nutzung.

**Nicht dabei:** kein Energieausweis, keine Norm-Heizlast, kein Gutachten, kein Beweismittel im Mietstreit, kein 3D.

## Erster Schritt

**Ticket: Eine Außenecke, ein Fenster, ein Heizkörper, stationär.**

Rastereditor für einen Raum mit zwei Außenwänden; Regler für Wand-U, Fenster-U, Luftwechsel, Raumfeuchte; Ausgabe: Heizleistung, Ecken-Oberflächentemperatur, Feuchtegrenze als Band.

**Fertig, wenn:** (1) der 2D-Löser die zweidimensionalen Testfälle aus Anhang A der DIN EN ISO 10211 reproduziert (laut WUFI auf 0,1 K) und (2) die Heizleistung eine Handrechnung nach DIN EN 12831 auf 10 % trifft und auf eine Änderung des Fenster-U-Werts sichtbar reagiert. Alles Weitere hängt an diesem validierten Raum; für die Instationarität sind die Testfälle der VDI 6007 Blatt 1 der Prüfmaßstab.

## Wo es kippt

**Eine Simulation, die präzise aussieht und falsch ist, ist schlimmer als keine.** Menschen treffen damit fünfstellige Entscheidungen und führen Streit mit der Hausverwaltung.

- **Nie eine Einzelzahl, nie „unbedenklich".** Das Modell darf „kritisch" oder „unklar" sagen. Ein 2D-Schnitt unterschätzt die Kälte echter Raumecken, in denen drei Flächen zusammenlaufen; das Band ist deshalb einseitig optimistisch, und die Oberfläche muss das sagen.
- **Gegen etablierte Verfahren validieren**, bevor es jemand außerhalb sieht (siehe Ticket). Die Methodik steht im Verbund, nicht in meinem Kopf.
- **Das Modell sagt nicht, wer schuld ist.** Es zeigt die Bedingung, unter der eine Ecke trocken bleibt; die tatsächliche Raumfeuchte misst kein Grundriss.

**Zweites Risiko:** Lesart als Energieausweis-Ersatz. Der Nicht-Anspruch gehört in die Oberfläche, nicht ins Impressum. **Drittes:** Der Grundrissimport ist der Punkt, an dem Laien abspringen; dauert das Zeichnen länger als drei Minuten, ist das Werkzeug tot.

## Wer es schon versucht hat

Verdikt **verengt**, nicht frei (19.9.2026, fünf Suchen).

- **Ubakus „Thermische Simulation"** (seit November 2023): Wärmebedarf und Sommer-Übertemperaturgradstunden im Testreferenzjahr, aber tabellarische Eingabe, **eine Lufttemperatur pro Zone**, Bauteile auf 1D reduziert. Kein Grundriss, kein Temperaturfeld, keine Ecken. **Die Sommerrichtung ist auf Zonenebene damit besetzt**; neu wäre nur die räumliche Verteilung.
- **Wärmebrücken-Werkzeuge:** Schöck-Rechner (Herstellertool), Ubakus-U-Wert (2D-FEM je Bauteil), Better Building Heat Transfer Simulator (2025, Fachleute), ThermCAD: Bauteile, keine Wohnung.
- **fRsi-/Taupunkt-Rechner:** Einzelzahl aus gemessener Oberflächentemperatur. **airtec WohnCheck:** nur die Beschreibung gesehen, Umfang ungeprüft.
- **Grundrisserkennung** (RoomSketcher, FloorScan, HottCAD): Geometrie; Thermik von HottCAD ungeprüft.

Nicht gefunden: ein Laienwerkzeug, das Grundriss, räumliche Oberflächentemperatur, Feuchtegrenze und A/B verbindet.

## Vorarbeit

- **EnergyMap Berlin:** UdK Berlin mit co2online, SEnerCon, LUP und Bezirksamt Charlottenburg-Wilmersdorf, Bundesförderung; Web-App seit 28.5.2025; KI-Modell-Validierung auf der BauSIM 2026 (Zürich, 9.–11. September) vorgestellt.
- **CoolingMap** (seit April 2026) und **CO2OL ISLANDS** (seit März 2026), beide UdK-koordiniert: Kühlbedarf und Stadthitze, Anschluss für die Sommerrichtung.
- **Prototype Fund:** Bewerbung 1.10.–30.11.2026, aber seit 2025 nur die Schwerpunkte Datensicherheit und Software-Infrastruktur. Eine Wohnungs-App passt nicht; ein offener, validierter 2D-Wärmeleitungskern als Bibliothek könnte als Infrastruktur gelten, das wäre vorab zu klären. Näher liegt eine studentische Arbeit im Verbund.

---

Diese Idee gehört niemandem. Nehmt sie, baut sie, verkauft sie — ihr schuldet mir nichts, nicht einmal eine Antwort. Wenn ihr eines Tages eine Idee habt, die ihr nicht bauen werdet, gebt sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
