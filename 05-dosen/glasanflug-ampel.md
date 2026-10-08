---
status: Delivered
date_delivered: '2026-09-22T00:00:00Z'
delivery_method: E-Mail
target_maker: 'NABU Berlin, Projekt „Artenschutz am Gebäude"'
review_score: 30/35
architecture_tier: Tier 1
source_type: Type A
---
# Glasanflug-Ampel

*(englisch: Bird Glass Hazard Score)*

**Ein Satz:** Die Fassadenfotos, die beim Melden eines toten Vogels ohnehin hochgeladen werden, einmal durchrechnen — Glasanteil, gespiegeltes Grün, Durchsichten, Ecken — und daraus den Entwurf einer LAG-VSW-Bewertung erzeugen, mit jedem Eingangswert und seiner Unsicherheit auf dem Blatt.

**Stand:** 22. September 2026 · **Prüfen ab:** März 2027
**Empfänger:** **NABU Berlin, „Artenschutz am Gebäude"** (Julia Lorenz, Helen Friedlein) zusammen mit **NABU Jena** (Maximilian Schätz, Upstream des quelloffenen Vogelschlagmelders) · **zweiter Empfänger, eigener Kontext:** LBV Bayern · **fachlicher Eigentümer des Schemas:** LAG VSW
**Verdikt:** 🔨 **erst Skelett, dann verschenken** — die natürliche Heimat ist ein quelloffenes Repo mit einem einzelnen, unbezahlten Maintainer, und nach der Amélie-Regel geht dorthin nur, wer Code mitbringt.  
**Review:** 32/35 · Tier 1 · Type A (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))

---

> 🦅 **Interaktiver Simulator im Browser:**
> - **In der Dose ausführen:** [Interaktive Glasanflug-Ampel & LAG-VSW-Rechner öffnen](#dose=glasanflug-ampel)
> - **Vollbild-Labor:** [Sandkasten „Glasanflug" öffnen](#sim=glasanflug)
>
> Der deterministische Rechner bildet Tabelle 3 und 4 des Beschlusses 21/01 (Stand 2023) der Länderarbeitsgemeinschaft der Vogelschutzwarten mit Live-Ampelbewertung, Vorrangregeln, Herkunftsattributen je Eingangswert und Risikobegründung vollständig interaktiv im Browser ab.

---

## Das Problem

Über 5 % der jährlich in Deutschland vorkommenden Vögel sterben an Glas, nur 15–35 % der Opfer werden gefunden. Rechtlich entscheidet eine Frage: Ist das Tötungsrisiko nach § 44 Abs. 1 Nr. 1 BNatSchG signifikant erhöht? Die LAG VSW zieht die Grenze bei zwei Schlagopfern je 100 m Fassade und Jahr als normal, ab fünf als signifikant erhöht.

Die Münchner Untersuchung (LBV mit LfU Bayern, 2021) zeigt, was das in der Praxis heißt: neun Komplexe, 1.957 m Fassade, dreizehn Wochen zu Fuß — unmarkierte Glaswände 0,41 Kollisionen pro Meter, Fassaden 0,02, markierte Lärmschutzwände null. Freistehendes unmarkiertes Glas fordert pro Meter rund achtundzwanzigmal so viele Opfer wie eine Fassade, und drei Glaswände kamen auf rund 46 Kollisionen je 100 m in drei Monaten — das Neunfache der Signifikanzschwelle in einem Vierteljahr. Markierte Wände: null. Die Studie stufte die Komplexe anschließend von Hand in Priorität 1 und 2 ein.

Diese Arbeit skaliert mit Personal und mit nichts sonst: hinfahren, ablaufen, bewerten, priorisieren.

Und der Bedarf ist gerade sprunghaft gestiegen:
- Am 10. Juni 2026 hat die Berliner Senatsverwaltung die „Beurteilungshilfe" als einheitlichen Standard für Bau- und Planungsverfahren eingeführt, um „den Artenschutz verbindlich in Bauprozesse einzubinden"; eine Nachmeldung am 10. August 2026 ergänzte, der Schutz beginne „bereits bei der Planung, nicht erst am fertigen Gebäude".
- Die Beurteilungshilfe ist qualitativ und verweist für die eigentliche Einstufung auf den Beschluss 21/01 der LAG VSW — ein 4-Klassen-Punktesystem, das als PDF existiert.
- Seit Februar/März 2026 gibt es digitale Meldeportale in Jena, Leipzig und Berlin (vogelschlagmelder.de). Jena allein hat über 200 Meldungen erfasst.

## Warum das jetzt geht

1. **Die Fotos sind schon da:** Der quelloffene Vogelschlagmelder (NABU Jena, Leipzig, Berlin, seit Februar 2026) erfasst pro Meldung bis zu fünf Fotos, die Ausrichtung der betroffenen Fassade, die Größe der Anprallspur und eine geokodierte Adresse. Das ist fast genau der Eingangssatz, den das Schema verlangt.
2. **Der Glasanteil einer Fassade ist ein gelöstes Messproblem — in der Gebäudeenergie-Branche:** Fenster-Wand-Verhältnis aus Straßenbildern, Suppa u. a. 2025 mit YOLOv9, bei 94 % der Fassaden innerhalb von fünf Prozentpunkten, 100 % innerhalb von ±10 Prozentpunkten, Workflow offen veröffentlicht. Dazu Fassadenparsing (SOLOv2, Mask R-CNN) und Glas- und Transparenzsegmentierung (City University Hong Kong, TransCues auf der WACV 2026).
3. **Die Spiegelung ist messbar geworden:** NFGlassNet (arXiv 2511.16887) erkennt Glas über den Kontrast der Reflexion zwischen Blitz- und Nicht-Blitz-Aufnahme — physikalisch genau die Frage, die das Schema stellt.
4. **Das Umfeld ist eine Abfrage:** Grün, Wasser und Alleen stehen in OpenStreetMap; Berlin hat ein Baumkataster mit rund 885.000 Einzelbäumen.
5. **Die Plattform ist quelloffen:** Der Vogelschlagmelder liegt unter GPLv3 auf Codeberg (`nabu-jena/Vogelschlagmelder`), Python, Docker Compose, OpenAPI-Doku, aktiv gepflegt, selbst hostbar. Eine Bewertungsschicht muss nichts neu bauen, sie dockt an.

## Skizze

- **Eingabe:** die Meldung, die ohnehin entsteht — Fotos, Fassadenausrichtung, Koordinate. Optional ein gezieltes Fassadenfoto für eine Bewertung ohne Opferfund.
- **Ableitung:** Glasflächen segmentieren → Anteil und Größe zusammenhängender Scheiben je Höhenzone bestimmen → geometrische Sonderfälle erkennen (verglaste Ecke, Durchsicht, freistehende Scheibe) → Spiegelinhalt klassifizieren (Himmel, Vegetation, Bau) → Umfeld aus OSM und Baumkataster auf mehreren Radien abfragen.
- **Berechnung:** maschinenlesbare Fassung von LAG VSW 21/01 (Stand 2023) — Faktoren, Punktwerte, Schwellen im Wortlaut mit Versionsnummer. Die Software rechnet, sie interpretiert nicht.
- **Ausgabe:** eine Seite. Foto mit Overlays, jeder Faktor mit geschätztem Wert, Herkunft der Schätzung und Unsicherheit, von Hand überschreibbar. Was das Bild nicht hergibt, steht als „unbestimmt" da statt als Zahl. Aus demselben Blatt fällt das Anschreiben an den Gebäudeeigentümer heraus.
- **Interaktiver Prototyp:** Im Browser direkt erlebbar über den [Glasanflug-Simulator](#dose=glasanflug-ampel) oder im [Vollbild-Sandkasten](#sim=glasanflug).

**Nicht dabei:** keine Produktempfehlungen, kein Zertifikat, kein automatisches § 44-Urteil, keine Prognose toter Vögel, keine flächendeckende Bewertung fremder Gebäude aus Straßenbildern, keine öffentliche Karte „gefährlicher Häuser".

## Erster Schritt

**Ticket: Erledigt am 22.09.2026 — das Schema ausführbar machen, ohne eine Zeile Bilderkennung.**

- **Code:** Liegt in `04-werkzeug/glasanflug-ampel/` (Python) und `src/engine/glasanflug/` (TypeScript).
- **Interaktiver Simulator im Browser:** [Simulator öffnen](#dose=glasanflug-ampel) oder [Vollbild-Sandkasten](#sim=glasanflug).
- **Umfang:** Regeldatei mit den Wortlauten des Beschlusses (Stand 2023), reine Bewertungsfunktion mit Herkunftsangabe je Eingabewert (`bewerte(...)`), `signifikanzschwelle(...)` für Monitoringdaten, 26 automatisierte Tests grün — darunter alle elf durchgerechneten Beispiele aus dem Anhang des Beschlusses, die Münchner Felddaten, beide Vorrangregeln und der Regelkonflikt. CC0, damit im GPLv3-Melder direkt verwendbar.
- **Nächstes Ticket:** Kriterium 1 (Anteil frei sichtbarer Glasfläche ohne Markierung) aus einem gemeldeten Fassadenfoto schätzen. Fertig, wenn für dreißig handbestimmte Fassaden die geschätzte Stufe in vier von fünf Fällen stimmt und jede Abweichung mit dem Bild daneben erklärbar ist.

## Wo es kippt

1. **Eine Zahl, die sicherer klingt als die Datenlage, wird in beide Richtungen missbraucht.** Die Ausgabe ist ein ausgefüllter Entwurf mit sichtbaren Eingangswerten, nie ein unanfechtbares Urteil. Keine Faktoren gezeigt = keine Stufe vergeben.
2. **Die Evidenz widerspricht Teilen der Intuition des Schemas.** Li u. a. (Biological Conservation 310, 2025; 3.078 Gebäude, 65.633 Erfassungstage) zeigten: Vegetation wirkte auf 1.000 m (Frühjahr) bis 10 km (Herbst) am stärksten — Landschaftsebene, nicht Grundstücksebene —, und Bäume innerhalb von 5 m senkten das Herbstrisiko sogar; niedrigere Gebäude mit hohem Glasanteil schnitten schlechter ab. Samuels u. a. (PeerJ, 2022) fanden kleine Oberlichter fast so oft getroffen wie große Glastüren; Fluggeschwindigkeit und Anflugwinkel sagten mehr aus als die Scheibengröße. Daher: Umfeldgrün auf mehreren Radien abfragen, Nahbereich nicht überbewerten, keine Todeszahlen prognostizieren.
3. **Das Foto sieht die Reflexion nur einmal.** Morgens, im Juli, von schräg unten: drei verschiedene Bilder. Der Blitz-Trick funktioniert an einem Einzelfenster aus zwei Metern Entfernung, nicht an einer 20-Meter-Fassade. Uhrzeit und Richtung mitführen, mehrere Aufnahmen erlauben, im Zweifel „unbestimmt" ausweisen.
4. **Das Schema gehört nicht dem, der es programmiert.** Wortgetreue Abbildung, Versionsnummer auf dem Blatt, Rückkanal zur LAG VSW. Wenn sie nicht mitgehen, bleibt es ein Rechner für die eigene Beratungspraxis des NABU.
5. **Der Weg von der Planungshilfe zum Pranger ist kurz.** Meldungen enthalten Adressen. Eine Karte der Meldungen ist etwas anderes als eine Karte, die Gebäude bewertet. Die Einstufung gehört in das Schreiben an den Eigentümer, nicht auf eine öffentliche Ebene.
6. **Fotorechte und Menschen dahinter.** Der Melder nimmt Nutzungsrechte für Naturschutzzwecke — für ein Bewertungsmodul reicht das vermutlich, für einen Trainingsdatensatz nicht selbstverständlich. Vor der ersten Zeile Modellcode klären.

## Wer es schon versucht hat

**Verdikt `verengt` (21./22.09.2026, korrigiert von „frei").** Der Rechner existiert zweimal, nur in Nordamerika, und die Gegenrichtung ist in Deutschland besetzt:

- **FLAP Canada, „BirdSafe DIY Building Risk Assessment App"** (`flapapp.ca`): kostenlos, browserbasiert, Tag- und Nachtrisiko pro Fassade — ein geführter Fragebogen ohne Bildauswertung. Daneben kostenpflichtige Vor-Ort-Begutachtung.
- **LEED v5 und Pilot Credit SSpc55:** echter Punkterechner mit offizieller Tabellenvorlage (`Bird Collision Threat Rating`), Threat Factor ≤ 30 nach ABC-Skala, CSA A460:19 (R2024) als kanadischer Weg. Bewertet Materialien aus der Planung, nicht Situationen aus Bildern: Zertifizierungs-, keine Vollzugslogik.
- **New York Local Law 15 (seit 2021) und Toronto (seit 2010):** Nachweismärkte, bedient von Planungsbüros. Compliance-Software nicht auffindbar.
- **Österreich: ONR 191040.** Im Flugtunnel Hohenau-Ringelsdorf geprüft: Markierung qualifiziert sich ab ≥ 90 % Meiderate. Die Wiener Umweltanwaltschaft (WUA) führt die Liste der geprüften Muster (Broschüre „Geprüfte Muster", 5. Aufl. 2022: Kategorien A ≤ 10 %, B > 10–20 %, C > 20–42 %, D > 42 % Anflüge; zwei Tests, ONR für Durchsicht und WIN für Spiegelung; WIN-Ergebnisse gelten nur bis zur geprüften Außenreflexion). Die Produktseite ist abgedeckt — sie gehört nicht in die Bewertungsschicht. Als Demo-Baustein im Simulator liegt ein Abgleich, der ein Muster nur mit der Tabelle vergleicht (siehe „Antwort und Lehre").
- **Deutschland/Schweiz, Schemaseite:** LAG VSW 21/01 (aktualisiert 2023), Berliner Beurteilungshilfe, Merkblätter, `vogelglas.vogelwarte.ch`. Kein digitales Werkzeug, das das Schema rechnet.
- **Gegenrichtung besetzt:** `vogelschlagmelder.de` (NABU Jena, Leipzig, Berlin) — Meldungen mit bis zu fünf Fotos, Ausrichtung, Fundort; Gefahrenkarte ist eine Heatmap der Meldungen, keine Gebäudebewertung. Melden ist gelöst, Bewerten nicht.
- **Forschung:** Fassaden- und Glassegmentierung sowie Fenster-Wand-Verhältnis aus Straßenbildern sind gelöst und publiziert; niemand hat sie auf Vogelschlag angewendet.

**Die verbleibende, engere Lücke:** ein ausführbares, versioniertes und zitierfähiges Modul für das deutsche LAG-VSW-Schema. BirdSafe zeigt, dass gebäudebezogene Fragebögen mit Fotos/Renderings und Landschaftsfragen bereits existieren; eine deutsche Nachfrage nach automatischer Fotobewertung ist nicht belegt. Bildauswertung und Geodaten bleiben Forschungsvorschläge, keine Fähigkeit des gelieferten Rechners.

## Neubewertung (6. Oktober 2026)

- **Vorarbeiten präzisiert:** FLAPs BirdSafe DIY fragt Fassadenrisiken ab; ein USGBC-Schulungspapier von 2026 beschreibt Fotos oder Renderings als Teil des Fragebogens. Das verengt die Neuheit, belegt aber keinen Rechner für LAG VSW 21/01.
- **Anwendungskontext:** Berlins Beurteilungshilfe für Planungs- und Genehmigungsverfahren schafft einen konkreten fachlichen Kontext. Sie ist kein Beleg für Nachfrage nach KI-Bewertung.
- **Meldeweg und Rechte:** Das NABU-Jena-Formular nimmt Fotos, Fundort und Fassadenausrichtung auf. Die dortigen Foto-Nutzungsrechte sind keine bestätigte Erlaubnis für Modelltraining.
- **Bewertung getrennt von Wirkung:** Eine Feldstudie von 2026 bietet ein Vorher-Nachher-Kontrolldesign für Maßnahmen. Gebäude-Risikobewertung und Wirksamkeitsnachweis sind verschiedene Aufgaben.
- **Nächste offene Spur:** Eine wiederholte Sichtprüfung installierter Muster könnte Verschleiß oder fehlende Elemente dokumentieren. Bedarf, Produktlage und messbare Wirkung sind ungeklärt; die Analogie zur Straßenmarkierungswartung ist kein übertragbares Messverfahren.
- **Street View:** Google-Bilder dürfen laut Maps-Bedingungen nicht für abgeleitete Inhalte sowie Training, Test oder Validierung von ML verwendet werden; die Static API kostet pro Abruf, verlangt aktivierte Abrechnung und liefert höchstens 640×640 Pixel. Street View Insights analysiert Daten über Vertex AI und ist für diesen Arbeitsweg ausgeschlossen.
- **Bessere Ergänzungen:** Mapillary bietet Straßenbilder mit Aufnahmedatum und CC BY-SA. Zuerst Abdeckung der NABU-Fassaden, Perspektive und Lizenzpassung prüfen; Trainings- oder CC0-Nutzung nicht voraussetzen. Berlins Orthophotos und LoD2-Gebäudemodelle helfen bei Vegetations- und Gebäudeumfeld, zeigen aber keine Fassadenfenster.
- **Aktuelle Einschätzung:** verengt; 30/35 Kernpunkte plus 3/5 Fun = 33/40. Die 30/35 bewerten nur den gelieferten deterministischen Rechner, nicht automatische Fotoauswertung.

Quellen: [NABU-Jena-Melder](https://vogelschlag.nabu-jena.de/), [Berliner SenMVKU](https://www.berlin.de/sen/uvk/presse/pressemitteilungen/2026/pressemitteilung.1679571.php), [FLAP BirdSafe](https://www.flapapp.ca/), [USGBC-Schulung 2026](https://www.usgbc.org/sites/default/files/2026-05/Save%20the%20Birds%20course_1.pdf), [Lawson et al. 2026](https://academic.oup.com/condor/article/128/3/1/8677179), [Ottawa-Preprint](https://ecoevorxiv.org/repository/view/12042/), [Google Maps-Bedingungen](https://cloud.google.com/maps-platform/terms), [Mapillary-Lizenz](https://help.mapillary.com/hc/en-us/articles/115001770409-CC-BY-SA-license-for-open-data), [Berliner Orthophotos](https://www.berlin.de/sen/stadt/stadtdaten/geoinformation/landesvermessung/geotopographie-atkis/dop-digitale-orthophotos/), [Berliner 3D-Stadtmodell](https://daten.berlin.de/artikel/berlin-3d-stadtmodell-als-open-data).

## Antwort und Lehre (30.09.2026)

**Eine Antwort ist eingetroffen** (NABU-Bundesgeschäftsstelle, Naturschutzkommunikation, 29.09.2026) auf die Mail vom 22.09.2026 an die Sammeladresse. Sie ist eine freundliche Auskunft ohne Bezug auf die Idee, mit Hinweis auf die Broschüre und die WUA-Übersicht und mit Spendenbitte. Kein Interesse und keine Ablehnung, kein Nachfassen.

Fachlich enthält sie eine Korrektur, die wir übernehmen:
- Die Bewertungen der Broschüre sind **Flugtunnel-Ergebnisse der WUA für bestimmte Produkte**. Anders gestaltete, auch ähnliche Markierungen können besser oder schlechter wirken; gleich wirksame Lösungen dürfen nicht von vornherein ausgeschlossen werden. Die getesteten Markierungen sind **nicht gesetzlich verbindlich**.
- Die Mail vom 22.09.2026 sprach von „zertifizierten Punktrastern (9x9 cm) statt nutzloser Aufkleber". Das war zu stark: Das 90-mm-Raster gehört zu den SEEN-Aluminiumpunkten (9 mm Durchmesser), nicht zu einer allgemeinen Vorgabe. Die Dose selbst rechnet nur das LAG-VSW-Schema und gibt keine Produktempfehlung.
- Empfängerlehre: Die Sammeladresse liefert Standardauskunft. Adressat der Bewertungsschicht bleibt NABU Berlin / Jena (Melder) und die LAG VSW als Eigentümerin des Schemas; **Eigentümerin der Markierungstabelle ist die WUA in Wien**, also ein anderer Empfänger.

**Demo-Baustein (Stand 30.09.2026):** `src/engine/glasanflug/markierung.ts` gleicht ein geplantes Muster mit einem Tatsachenauszug der WUA-Tabelle ab. Ein Muster, das nicht in der Tabelle steht, ergibt „nicht getestet", nie „unwirksam". Liegt die geplante Außenreflexion über dem geprüften Wert oder fehlt sie, meldet der Abgleich „außerhalb des Geltungsbereichs". Nachnutzungsrecht an der Tabelle ist **nicht geklärt**; vor einer Gabe an die WUA die Zeilen gegen wua-wien.at prüfen und die WUA fragen. Ventures-Prüfung: als eigenes Produkt ein Kill (Zahlungsbereitschaft und Verteidigbarkeit gering, Daten gehören Dritten), stimmiger als Gabe.

## Vorarbeit

- **LAG VSW Beschluss 21/01 (aktualisiert 2023):** Bewertungsleitfaden für Glasfassaden; Schwellenwerte: 2 Opfer/100 m/a normal, ≥ 5 signifikant erhöht.
- **Berliner Beurteilungshilfe (SenMVKU):** Standard für Bau- und Planungsverfahren seit 10.06.2026.
- **Münchner Feldstudie (Wölfl & Bornemann / LBV mit LfU Bayern, 2021):** 1.957 m Fassade, unmarkierte Glaswände 28× so viele Opfer pro Meter wie Fassaden.
- **Vogelschlagmelder:** `vogelschlagmelder.de`, `berlin.vogelschlagmelder.de`, Quellcode GPLv3 auf Codeberg (`nabu-jena/Vogelschlagmelder`).
- **LBV-Projekt:** „Vogelschlag an Glas verhindern" (2023–2027), Dr. Peter Stimmler (`vogelschlag@lbv.de`).
- **Normen & Standards:** ONR 191040, LEED v5 (BD+C/O+M SS Credits), ABC Material Threat Factors, CSA A460:19 (R2024), FLAP BirdSafe.
- **Bildverarbeitung:** Suppa u. a. (*Building Simulation* 2025, YOLOv9 WWR), SOLOv2, TransCues (WACV 2026), NFGlassNet (arXiv 2511.16887).
- **Evidenz & Grenzen:** Li u. a. (*Biological Conservation* 310, 2025), Samuels u. a. (*PeerJ* 2022).
- **Geodaten:** OpenStreetMap Landuse, Berliner Baumkataster.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
