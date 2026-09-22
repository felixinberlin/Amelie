# Glasanflug-Ampel

*(englisch, wie die Idee ursprünglich hieß: Bird Glass Hazard Score Calculator)*

**Ein Satz:** Die Fassadenfotos, die beim Melden eines toten Vogels ohnehin hochgeladen werden, einmal durchrechnen — Glasanteil, gespiegeltes Grün, Durchsichten, Ecken — und daraus den Entwurf einer LAG-VSW-Bewertung erzeugen, mit jedem Eingangswert und seiner Unsicherheit auf dem Blatt.

**Stand:** 22.09.2026 · **Prüfen ab:** 03/2027 *(verkürzt: das Feld hat sich zwischen Februar und September 2026 dreimal bewegt)*
**Empfänger:** **NABU Berlin, „Artenschutz am Gebäude"** (Julia Lorenz, Helen Friedlein) zusammen mit **NABU Jena** (Maximilian Schätz, Upstream des Vogelschlagmelders) · **zweiter Empfänger, eigener Kontext:** LBV Bayern, Projekt „Vogelschlag an Glas verhindern" (Dr. Peter Stimmler) · **fachlicher Eigentümer des Schemas, immer mitzunennen:** LAG VSW
**Verdikt:** 🔨 **erst Skelett, dann verschenken** — die natürliche Heimat ist ein quelloffenes Repo mit einem einzelnen, unbezahlten Maintainer. Regel 4 des Manifests: dorthin nur mit Code.

---

## Das Problem

In Deutschland sterben nach LBV-Schätzung **über 100 Millionen Vögel pro Jahr** an Glas; **nur 15–35 % der Opfer werden gefunden**. Rechtlich entscheidet eine einzige Frage: Ist das Tötungsrisiko an diesem Bauwerk *signifikant erhöht* im Sinne von § 44 Abs. 1 Nr. 1 BNatSchG? Die LAG VSW zieht die Grenze bei **zwei Schlagopfern pro 100 m Fassade und Jahr als „normal" und ab fünf als „signifikant erhöht"**.

Wie weit die Realität davon weg ist, zeigt die einzige größere deutsche Feldstudie: **München 2020**, neun Gebäudekomplexe, **1.957 m Fassadenlänge**, dreizehn Wochen, zweimal pro Woche abgelaufen (LBV + LfU Bayern, 2021). 125 Nachweise. Aufgeschlüsselt:

| Struktur | Kollisionen | Länge | pro Meter |
|---|---|---|---|
| markierte Lärmschutzwände | **0** | 93 m | 0 |
| unmarkierte Glaswände | 90 | 217 m | **0,41** |
| Gebäudefassaden | 35 | 1.647 m | 0,02 |

Freistehendes, unmarkiertes Glas tötet also **rund achtundzwanzigmal so viel pro Meter** wie eine Fassade — und drei Glaswände in der Walter-Gropius-Straße kamen in drei Monaten auf etwa **46 Kollisionen je 100 m**, das Neunfache der Signifikanzschwelle in einem Viertel des Jahres. Markierte Wände: null. Die Studie vergab am Ende von Hand Priorität 1 und 2.

Das ist die Arbeit, um die es geht: **hinfahren, ablaufen, einschätzen, priorisieren.** Sie skaliert mit Personal, mit nichts sonst.

Und die Nachfrage dafür ist gerade sprunghaft gestiegen:

- **Berlin hat am 10.06.2026 die „Beurteilungshilfe zur Einschätzung des Kollisionsrisikos an Glasflächen" als einheitlichen Standard eingeführt** — für Bau- und Planungsverfahren, mit dem erklärten Ziel, „den Artenschutz verbindlich in Bauprozesse einzubinden". Am 10.08.2026 hat die Senatsverwaltung nachgelegt: Der Schutz beginne „nicht erst am fertigen Gebäude, sondern bereits bei der Planung".
- Die Beurteilungshilfe selbst ist **qualitativ** und verweist für die eigentliche Einstufung auf **LAG VSW 21/01** — ein Punktesystem mit vier Klassen, das als PDF existiert. Sonst nichts.
- Seit Februar/März 2026 gibt es in Jena, Leipzig und Berlin **digitale Vogelschlagmelder**. Jena zählt über 200 Meldungen, davon der Großteil aus diesem Jahr.

**Wer leidet:** untere Naturschutzbehörden, die jetzt Planungen nach einem Schema beurteilen sollen, das niemand vorgerechnet hat; Architekturbüros, von denen die Selbsteinschätzung verlangt wird; Eigentümer, die nach einer Meldung nicht wissen, welche Fläche zuerst dran ist; und die Ehrenamtlichen, die Meldungen entgegennehmen und daraus ein Anschreiben an den Eigentümer machen müssen.

## Warum das jetzt geht

**1. Die Fotos sind schon da, und zwar die richtigen.** Der Vogelschlagmelder erfasst pro Meldung: Datum, Zustand des Vogels, Art, **Anprallspur und ihre Größe**, **Ausrichtung der betroffenen Fassade**, Koordinate mit Adressauflösung — und **bis zu fünf Fotos**. Das ist fast genau der Eingabesatz, den das Schema verlangt. Bisher werden diese Bilder nur archiviert.

**2. Der Glasanteil einer Fassade ist ein gelöstes Messproblem — in einer anderen Branche.** Die Gebäudeenergie-Leute extrahieren seit Jahren Fenster-Wand-Verhältnisse aus Straßenbildern. Suppa u. a. (*Building Simulation*, 2025) kommen mit YOLOv9 auf Street-View-Bildern bei **94 % der Fassaden auf ±5 Prozentpunkte** gegenüber der Handmessung, bei 100 % auf ±10, und stellen den Workflow offen zur Verfügung. Dazu Fassadenparsing (SOLOv2, Mask R-CNN) und eine ganze Reihe zu Glas- und Transparenzsegmentierung (Mirror-and-Glass-Reihe der City University Hong Kong, TransCues auf der WACV 2026).

**3. Die Spiegelung selbst ist messbar geworden.** Der entscheidende Faktor ist nicht *wie viel* Glas, sondern **was darin steht**. **NFGlassNet** (arXiv 2511.16887) erkennt Glas über den **Kontrast der Spiegelung** zwischen Blitz- und Nicht-Blitz-Aufnahme — physikalisch genau die Frage des Schemas. Code erst „upon acceptance", also Baustein, nicht Abhängigkeit.

**4. Das Umfeld ist eine Abfrage.** Grün, Wasser, Alleen stehen in OpenStreetMap; Berlin hat ein Baumkataster mit rund 885.000 Einzelbäumen, offen abfragbar.

**5. Und die Plattform ist quelloffen.** Der Vogelschlagmelder liegt unter **GPLv3 auf Codeberg** (`nabu-jena/Vogelschlagmelder`), Python, Docker-Compose, OpenAPI-Dokumentation, 159 Commits, zuletzt September 2026, von anderen Gruppen selbst hostbar — Berlin betreibt bereits eine eigene Instanz. Eine Bewertungsschicht muss hier nichts neu bauen; sie dockt an.

## Skizze

- **Eingabe:** die Meldung, die ohnehin entsteht — Fotos, Fassadenrichtung, Koordinate. Optional ein bewusst aufgenommenes Fassadenfoto für eine Vorab-Bewertung ohne Opfer.
- **Ableitung:** Glasflächen segmentieren → Anteil und **Größe zusammenhängender Scheiben** je Höhenzone → geometrische Sonderfälle (verglaste Ecke, Durchsicht, freistehende Scheibe) → Spiegelinhalt klassifizieren (Himmel / Vegetation / Bau) → Umfeld aus OSM und Baumkataster, **auf mehreren Radien** (siehe „Wo es kippt").
- **Bewertung:** eine **maschinenlesbare Fassung von LAG VSW 21/01** — Faktoren, Punktwerte, Schwellen, im Wortlaut, mit Versionsnummer. Die Software rechnet; sie interpretiert nichts.
- **Ausgabe:** eine Seite. Foto mit Overlays, darunter jeder Faktor mit geschätztem Wert, **Herkunft der Schätzung** (Bild / Geodaten / Eingabe) und Unsicherheit, jeder Wert von Hand überschreibbar. Was das Bild nicht hergibt, steht als **„unbestimmt"** da und nicht als Zahl. Aus demselben Blatt fällt das Anschreiben an den Eigentümer ab — das ist der Teil, den heute Ehrenamtliche tippen.

**Nicht dabei:** keine Produktempfehlung (dafür gibt es den Flugtunnel und die Herstellerlisten), kein Zertifikat, kein automatisches §-44-Urteil, keine Prognose toter Vögel pro Jahr, **keine flächendeckende Bewertung fremder Gebäude aus Straßenbildern**, keine öffentliche Karte „gefährlicher Häuser".

## Erster Schritt

**Ticket: Das Schema ausführbar machen — ohne eine Zeile Bilderkennung.**

LAG VSW 21/01 in eine Regeldatei übertragen (YAML oder JSON): jeder Faktor, jeder Punktwert, jede Schwelle, jeweils mit dem Originalwortlaut daneben. Dazu eine reine Funktion, die Werte von Hand entgegennimmt und Klasse plus Begründung zurückgibt, und Testfälle aus den Beispielen der Berliner Beurteilungshilfe und der Münchner Studie — die neun Komplexe dort sind bereits von Hand eingestuft.

**Fertig, wenn:** drei von Hand beurteilte Gebäude bei manueller Eingabe dieselbe Klasse bekommen — **und jede Abweichung sich auf einen benannten Eingabewert zurückführen lässt, nicht auf die Regeln.**

Zwei Vorzüge, und beide zählen mehr als der Code: Das Ergebnis ist **für sich allein nützlich** (eine zitierbare, versionierte Fassung des Schemas, die jede Behörde nachnutzen kann), und es ist das Skelett, das die Idee nach Regel 4 überhaupt erst zustellbar macht — als GPLv3-kompatibles Modul neben dem Vogelschlagmelder, nicht als Zuruf an einen unbezahlten Maintainer.

## Wo es kippt

**1. Eine Zahl, die sicherer klingt als die Datenlage, wird in beide Richtungen missbraucht.** „Klasse 2, alles in Ordnung" ist als Bauherrenargument genauso falsch wie „Klasse 4" als Ablehnungsgrund. Die Ausgabe ist ein **ausgefüllter Vorschlag mit sichtbaren Eingangswerten**, kein Ergebnis. Wer die Faktoren nicht sieht, bekommt auch keine Klasse.

**2. Die Evidenz widerspricht der Intuition, auf der das Schema teilweise ruht.** Li u. a. (*Biological Conservation* 310, 2025) haben **3.078 Gebäude über 65.633 Erfassungstage** in China ausgewertet — der größte Datensatz dieser Art. Ergebnis: Vegetation wirkt am stärksten auf **1.000 m im Frühjahr und 10 km im Herbst**, also auf Landschafts-, nicht auf Grundstücksebene; **Bäume innerhalb von 5 m senkten das Risiko im Herbst sogar**. Dazu Samuels u. a. (*PeerJ*, 2022): kleine Oberlichter wurden fast so oft getroffen wie große Glastüren, bessere Prädiktoren waren Fluggeschwindigkeit und Anflugwinkel. Konsequenz für die Skizze: Umfeldgrün **auf mehreren Radien** abfragen und die Nahbereichsspiegelung nicht überziehen. Und für die Ausgabe: Eine Ampel kann **ordnen**, sie kann keine Todeszahlen vorhersagen.

**3. Das Foto sieht die Spiegelung einmal.** Dieselbe Fassade liefert morgens, im Juli und von schräg unten drei Antworten. Der Blitz/Nicht-Blitz-Trick funktioniert am **einzelnen Fenster auf zwei Meter**, nicht an einer 20-Meter-Fassade. Also: Uhrzeit und Richtung mitführen — der Melder tut das bereits —, mehrere Aufnahmen zulassen, im Zweifel „unbestimmt".

**4. Das Schema gehört nicht dem, der es programmiert.** Eine Software, die LAG VSW 21/01 „auslegt", spaltet die Praxis in zwei Verfahren. Wortgetreue Abbildung, Schemaversion im Ausdruck, Korrekturweg zur LAG VSW. Ziehen die Vogelschutzwarten nicht mit, bleibt es bestenfalls der Rechner für die eigene Beratung — dann lieber so nennen.

**5. Der Weg vom Planungshilfsmittel zum Pranger ist kurz** — und hier besonders kurz, weil die Meldedaten Adressen enthalten. Eine Karte, die Meldungen zeigt, ist etwas anderes als eine Karte, die Gebäude **bewertet**. Nur eigene Gebäude oder solche mit Auftrag; Bewertungen gehören in das Anschreiben an den Eigentümer, nicht in die öffentliche Ebene.

**6. Die Fotorechte und die Personen dahinter.** Der Melder sichert sich die Nutzungsrechte an den Fotos für den Naturschutzzweck — für ein Auswertungsmodul reicht das vermutlich, für ein Trainingsdatenset nicht selbstverständlich. Das ist vor der ersten Zeile Code zu klären, nicht danach.

## Wer es schon versucht hat

**Urteil `verengt`, nicht `frei`** — Korrektur des Urteils aus Runde 2, das auf einer einzigen deutschen Suche beruhte. Der Rechner existiert bereits zweimal, nur anderswo und anders — und die Gegenrichtung ist in Deutschland seit diesem Jahr besetzt:

- **FLAP Canada, „BirdSafe DIY Building Risk Assessment App"** (`flapapp.ca`): kostenlos, im Browser, schätzt Kollisionsrisiko bei Tag und Nacht **pro Fassade** und zeigt die gefährlichsten Fenster. Ein geführter **Fragebogen** — der Mensch liefert die Einschätzung, die Software rechnet. Keine Bildauswertung. Daneben kostenpflichtige BirdSafe-Begutachtung mit Ortsterminen.
- **LEED, Pilot Credit SSpc55** und inzwischen **LEED v5**: ein ausgewachsener Punkterechner mit offizieller Tabellenvorlage — `(Zone 1 + Zone 2 gewichtete Fläche) / bereinigte Fassadenfläche = Bird Collision Threat Rating`, Ziel ≤ 15, Zone 1 die ersten 36 Fuß, verglaste Ecken und Durchflüge ≤ 25. Seit **24.04.2026** führt LEED v5 Vogelschlag in zwei Credits und verlangt dort einen **Threat Factor ≤ 30** nach ABC-Skala; für Kanada ist **CSA A460:19 (R2024)** als gleichwertiger Nachweisweg anerkannt. Bewertet wird: **Material aus der Planung**, nicht Situation aus dem Bild. Zertifizierungslogik, keine Vollzugshilfe.
- **New York, Local Law 15** (Pflicht seit 10.01.2021), **Toronto** seit 2010: Märkte für Nachweise, bedient von Beratungsbüros und Materiallisten. **Compliance-Software: nicht gefunden.**
- **Österreich: ONR 191040.** Prüfung im Flugtunnel der Biologischen Station Hohenau-Ringelsdorf (Martin Rössler): Eine Markierung gilt, wenn **mindestens 90 % der Vögel die markierte Scheibe meiden**. Die Wiener Umweltanwaltschaft veröffentlicht die Rangliste geprüfter Muster. **Die Produktseite ist damit gründlich abgedeckt — deshalb gehört sie nicht in diese Idee.**
- **Deutschland und Schweiz, Schemaseite:** LAG VSW 21/01, Berliner Beurteilungshilfe, LfU-Bayern- und Nürnberger Merkblätter, `vogelglas.vogelwarte.ch` mit Broschüren und Produkttests. **Kein digitales Werkzeug, das das Schema rechnet.**
- **Die Gegenrichtung ist neu besetzt, und das ist die wichtigste Änderung seit gestern:** **vogelschlagmelder.de** — NABU Jena und NABU Leipzig seit Februar/März 2026, NABU Berlin mit eigener Instanz, Code **GPLv3 auf Codeberg**, Python, Docker, aktiv. Meldung mit bis zu fünf Fotos, Fassadenrichtung, Anprallspur, Geokodierung; dazu eine **Gefahrenkarte**, die allerdings nur eine Heatmap **der eingegangenen Meldungen** ist, keine Bewertung. Jena: über 200 Meldungen. **Melden ist gelöst. Bewerten nicht.**
- **Forschung:** Fassaden- und Glassegmentierung sowie die Fenster-Wand-Messung aus Straßenbildern sind gelöst und publiziert; auf Vogelschlag angewendet hat sie niemand. Ein quelloffenes Projekt zu Vogelschlagrisiko an Gebäuden war nicht zu finden.

**Restlücke, die bleibt:** das **deutsche Schema** als ausführbares, zitierfähiges Modul **auf einer Meldeplattform, die die nötigen Fotos bereits einsammelt** — Situationsfaktoren geschätzt statt abgefragt, Ergebnis ein prüfbares Blatt für Behörde und Eigentümer statt einer Zertifikatspunktzahl. Das ist die Idee. Nicht „eine Vogelschlag-App".

## Vorarbeit

- **LAG VSW 21/01**, „Vermeidung von Vogelverlusten an Glasscheiben — Bewertungsverfahren": `vogelschutzwarten.de/glasanflug.htm`. *Hinweis: maschinell nicht abrufbar (robots.txt bzw. 403 auf allen gefundenen Spiegeln). Die Punktwerte gehören aus dem Original abgeschrieben, nicht aus Merkblättern — die widersprechen sich (Nürnberg 2023 nennt „mehr als vier" statt fünf Schlagopfer je 100 m).*
- **Berlin:** Beurteilungshilfe (SenMVKU), als einheitlicher Standard eingeführt 10.06.2026; Pressemitteilung 10.08.2026 zur Verankerung in der Planungsphase.
- **München-Studie:** Wölfl & Bornemann (LBV) mit LfU Bayern, 2021 — „Untersuchung zum Vogelschlag an Glas in München", neun Komplexe, 1.957 m, 13 Wochen.
- **Vogelschlagmelder:** `vogelschlagmelder.de`, `berlin.vogelschlagmelder.de`, Quellcode `codeberg.org/nabu-jena/Vogelschlagmelder` (GPLv3, Maintainer Maximilian Schätz), Kontakt Berlin `artenschutz_am_gebaeude@nabu-berlin.de`.
- **LBV-Projekt** „Vogelschlag an Glas verhindern" (2023–2027) mit Beratung, Meldestelle und Plakette; `vogelschlag@lbv.de`.
- **Norm- und Produktseite:** ONR 191040, Flugtunnel Hohenau-Ringelsdorf, Wiener Umweltanwaltschaft; Schweizerische Vogelwarte Sempach.
- **Internationale Rechner:** USGBC SSpc55 und LEED v5, ABC Material Threat Factors, CSA A460:19 (R2024), FLAP BirdSafe.
- **Bildseite:** Suppa u. a., *Building Simulation* 2025 (YOLOv9, Fenster-Wand-Verhältnis aus Street View, 94 % ±5 Prozentpunkte); Fassadenparsing mit SOLOv2; Mirror-and-Glass-Detection (CityU HK); TransCues (WACV 2026); NFGlassNet (arXiv 2511.16887); Fenster-Mask-R-CNN (arXiv 2107.10006).
- **Evidenz und Grenzen:** Li u. a., *Biological Conservation* 310 (2025), 3.078 Gebäude; Samuels u. a., *PeerJ* (2022).
- **Geodaten:** OpenStreetMap-Landnutzung, Berliner Baumkataster über Gieß den Kiez.

---

**In one paragraph, for forwarding:** Germany has an official four-level bird-strike risk scheme for glass (LAG VSW 21/01) that exists only as a PDF, and since June 2026 Berlin requires it to be applied in building and planning procedures. North America has calculators — FLAP's BirdSafe questionnaire, LEED v5's threat-factor credits, CSA A460 — but they ask a human for the inputs, or score materials off a plan. Meanwhile German NGOs launched open-source collision reporting in 2026 that already collects up to five façade photos, the façade's orientation and a geocoded address per report. The gap is the layer in between: estimate the *situational* inputs from those photos plus open geodata, and hand back a sheet that shows every input and its uncertainty instead of a verdict.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
