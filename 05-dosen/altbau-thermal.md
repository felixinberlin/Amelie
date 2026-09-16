# Altbau Thermal

**Ein Satz:** Grundriss zeichnen, Baualtersklasse wählen, zusehen, was die eigene Wohnung thermisch tut — die Innenperspektive zu dem, was EnergyMap Berlin von außen für jedes Gebäude ausrechnet.

**Stand:** September 2026 · **Prüfen ab:** September 2027
**Empfänger:** Forschungsverbund EnergyMap Berlin (Projektleitung UdK Berlin) · nachrangig: co2online gGmbH, Verbraucherzentrale Berlin

---

## Das Problem

Seit Mai 2025 gibt es **EnergyMap Berlin**: eine öffentliche Web-App, die mit KI den Wärmebedarf einzelner Berliner Gebäude prognostiziert, Sanierungsoptionen durchspielbar macht und an den Energieatlas anschließt. Dazu eine Python-Schnittstelle für Entwickler:innen. Damit ist eine Frage beantwortet, die vorher offen war: *Was braucht dieses Gebäude?*

Die Frage, die danach kommt, ist unbeantwortet: **Was tut meine Wohnung?**

Zwischen Gebäudehülle und Bewohnerin liegt eine Lücke, die kein Kataster schließen kann, weil sie vom Grundriss abhängt — von der Ecke hinter dem Schrank, vom Fenster im Berliner Zimmer, vom Heizkörper unter der Nische. Drei Situationen, in denen das konkret weh tut:

- **Der Schimmelstreit.** Mieter:innen wird gesagt, sie lüfteten falsch; die Eigentümerseite sagt, die Wand sei in Ordnung. Ein Gebäudewert in kWh/m²a hilft in diesem Streit niemandem. Was fehlt, ist die Oberflächentemperatur **an dieser Ecke** — ein geteiltes Modell, an dem beide Seiten dasselbe sehen.
- **Die 20.000-Euro-Entscheidung.** Fenster tauschen, dämmen oder Heizkörper vergrößern: Wer die drei Varianten für *seinen* Grundriss vergleichen will, hat dafür kein Werkzeug.
- **Die Beratungslücke.** Die kostenfreie Energieberatung erklärt in einem Gespräch, was ein Bild in zehn Sekunden zeigen würde. Beratenden fehlt eine Visualisierung, die die Ratsuchende mit nach Hause nimmt.

**Ausdrücklich kein Konkurrenzprodukt.** Dieses Werkzeug fängt da an, wo EnergyMap aufhört: an der Gebäudehülle. Es verbraucht deren Daten, es ersetzt sie nicht.

## Warum das jetzt geht

Fünf Dinge waren einzeln teuer und sind es nicht mehr — das fünfte ist seit letztem Jahr neu:

1. **Grundriss aus Foto oder PDF.** Wände, Fenster und Türen aus einem Exposé-Grundriss zu extrahieren ist heute ein gelöstes Bildproblem. Vorher war es Handarbeit oder CAD-Import — daran sind Laienwerkzeuge bisher gescheitert.
2. **Parameter ohne Fachwissen.** Niemand kennt den U-Wert seiner Außenwand. Aber fast alle wissen „Altbau, etwa 1905, Berliner Zimmer, Kastendoppelfenster" — daraus lassen sich Bauteilparameter nach Baualtersklasse ableiten, in Sprache statt in Formularen.
3. **Interaktive Simulation im Browser.** Instationäre 2D-Wärmeleitung plus Luftwechsel läuft per WebGL2 in Echtzeit auf einem Mittelklasse-Laptop. Das war bis vor wenigen Jahren Desktop-FEM mit Lizenzkosten.
4. **Frei nutzbare Wetterdaten.** Die ortsgenauen Testreferenzjahre von DWD und BBSR liefern ein realistisches Berliner Stundenjahr.
5. **Die Gebäudedaten sind jetzt öffentlich abrufbar.** Genau das war der fehlende Baustein — und mit der EnergyMap-Web-App und `energymap4py` gibt es ihn seit 2025. Die Wohnungssimulation muss den Gebäudekontext nicht mehr raten, sie kann ihn abfragen.

## Skizze

Zeichnen → parametrisieren → simulieren → vergleichen.

- **Eingabe:** Grundriss auf einem Raster zeichnen oder aus einem Bild übernehmen. Wände, Fenster, Türen, Heizkörper setzen. Adresse eingeben → Gebäudekontext aus EnergyMap vorbelegen, danach von Hand korrigierbar.
- **Modell:** instationäre Wärmeleitung im 2D-Schnitt pro Bauteil, Luftwechsel pro Raum (Fenster zu / gekippt / Stoßlüften), Heizkörper als Quelle mit Thermostatverhalten, Zeitschritt über ein DWD-Testreferenzjahr.
- **Ausgabe:** animiertes Temperaturfeld, Oberflächentemperatur an den kritischen Ecken (Schimmelrisiko als Taupunktunterschreitung, nicht als Bauchgefühl), Verbrauch und Kosten **als Band, nie als eine Zahl**.
- **Der eigentliche Nutzen:** A/B. Zwei Varianten desselben Grundrisses nebeneinander, gleiche Wetterdaten, gleiche Nutzung.
- **Die Sommerrichtung fällt ab.** Dieselbe Gleichung, anderes Vorzeichen: Überhitzung, Verschattung, Nachtlüftung. Für ein Vorhaben, das Kühlbedarf auf Gebäudeebene katastriert, ist das die passende Wohnungsebene.

**Nicht dabei:** kein Energieausweis, keine normkonforme Berechnung, kein 3D, kein Anlagen-Contracting. Ein Werkzeug zum Verstehen, kein Nachweisinstrument.

## Erster Schritt

**Ticket: Ein Raum, ein Fenster, ein Heizkörper, stationär.**

Rastereditor für einen einzelnen Raum mit einer Außenwand. Drei Regler: U-Wert Wand, U-Wert Fenster, Luftwechselrate. Ausgabe: erforderliche Heizleistung und Oberflächentemperatur in der kalten Ecke, bei Berliner Januar-Mitteltemperatur.

**Fertig, wenn:** eine Änderung des Fenster-U-Werts die erforderliche Heizleistung sichtbar verändert und die Zahl gegen eine Handrechnung nach Norm auf 10 % stimmt.

Alles Weitere — Instationarität, Wetterjahr, Grundrisserkennung, EnergyMap-Anbindung, A/B — hängt an diesem einen validierten Raum.

## Wo es kippt

**Das Hauptrisiko ist nicht technisch, sondern ethisch: eine Simulation, die präzise aussieht und falsch ist, ist schlimmer als keine.** Menschen treffen damit fünfstellige Entscheidungen und führen damit Streit mit ihrer Hausverwaltung. Scheingenauigkeit richtet hier echten Schaden an.

Die einzige Gegenmaßnahme, die ich kenne, ist Disziplin in der Darstellung:

- **Nie eine einzelne Zahl ausgeben.** Immer ein Band, und das Band muss ehrlich breit sein.
- **Gegen etablierte Verfahren validieren**, bevor das Ding irgendjemand außerhalb sieht — die Validierungsmethodik dafür ist in diesem Verbund vorhanden, in meinem Kopf nicht.
- **Unsicherheit sichtbar machen, nicht wegdesignen.** Wer den Bauzustand nicht kennt, sieht ein breiteres Band, keine Fußnote.

**Zweites Risiko:** Das Werkzeug wird als Energieausweis-Ersatz gelesen und erbt regulatorische Erwartungen, die es nicht erfüllen kann. Antwort: Der Nicht-Anspruch gehört in die Oberfläche, nicht ins Impressum.

**Drittes Risiko, ehrlich:** Der Grundriss-Upload ist der Punkt, an dem Laien abspringen. Wenn Zeichnen länger als drei Minuten dauert, ist das Werkzeug tot. Deshalb steht die Eingabe und nicht die Physik im Risiko.

## Vorarbeit, die es schon gibt

- **EnergyMap Berlin** — Forschungsverbund unter Leitung der UdK Berlin mit co2online, SEnerCon, LUP und dem Bezirksamt Charlottenburg-Wilmersdorf, gefördert vom Bund. Öffentliche Web-App seit Mai 2025, dazu die Python-Schnittstelle `energymap4py`. Validierung des KI-Modells zuletzt auf der BauSIM 2026 in Zürich vorgestellt.
- **CoolingMap** (2026–2029) und **CO2OL ISLANDS** (2026–2030) — die Nachfolgevorhaben zu Kühlbedarf und klimaresilienter Stadtentwicklung. Dort ist die Sommerrichtung dieses Werkzeugs anschlussfähig.
- **DWD-Testreferenzjahre (TRY)** — ortsgenaue Stundenwetterdaten, mit dem BBSR erstellt.
- **Verbraucherzentrale Berlin, Gebäudecheck** — die kostenfreie Beratungsschiene, in die so ein Werkzeug als Vermittlungsmittel passt.
- **TEASER** (RWTH-EBC) und **SimStadt** — Gebäudebestandsmodellierung auf Quartiersebene. Beide rechnen Bestände. Keiner adressiert die einzelne Wohnung und ihre Bewohnerin. Genau da ist die Lücke.
- **Prototype Fund** — Bewerbungsfenster ab 1. Oktober 2026, Open-Source-Pflicht. Falls ihr eine studentische Arbeit oder ein kleines Vorhaben daraus machen wollt: dort liegt Geld dafür.

---

Diese Idee gehört niemandem. Nehmt sie, baut sie, verkauft sie — ihr schuldet mir nichts, nicht einmal eine Antwort. Wenn ihr eines Tages eine Idee habt, die ihr nicht bauen werdet, gebt sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
