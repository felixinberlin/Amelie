# EuroBirdCast — Lehren und Startpunkt für die nächsten Runden

Stand: 08.10.2026. Gilt für die bestehende Dose `eurobirdcast`, nicht als neue Ideengenerierung. [Frontend](https://felixinberlin.github.io/Amelie/#dose=eurobirdcast) · [Systemtest und Evidenz](../02-recherche/eurobirdcast-real-test-2026-10-08.md).

## Was diese Runde gelehrt hat

1. **Ein sichtbares, begrenztes Ergebnis zuerst.** Der Nutzer wollte schließlich eine verständliche Bewegungskarte, keine perfekte Prognosemaschine. Das Ergebnis ist eine animierte historische Woche mit echten Beobachtungen. Forschung unterstützt die Darstellung; sie darf den Bau nicht endlos verdrängen. Eine neue Runde beginnt mit dem gewünschten sichtbaren Verhalten und einem kleinen überprüfbaren Lieferumfang.
2. **Bestehende Forschung ist ein Baustein, kein Ausschlussgrund.** Der publizierte europäische FluxRGNN-Datensatz ermöglichte einen ausführbaren Vergleich und die Karte. Der Nutzen kann in Zugang, Darstellung und Reproduzierbarkeit liegen. Keine Neuheitsbehauptung erfinden, aber einen brauchbaren Beitrag auch nicht wegen geringer algorithmischer Neuheit verwerfen.
3. **Qualität pro Messgröße prüfen.** Wir hatten den Geschwindigkeits-Gap fälschlich als Dichte-Ausschluss benutzt. Gleichzeitig fehlte die biologische `sd_vvp`-Schwelle. Beides wurde korrigiert. Fehlende Vogeldiskriminierung bleibt unbekannt; breite Tierdichte ist nicht automatisch Vogeldichte. Ein rotes Gate zuerst auf Einheiten, Flags und Implementierung prüfen, bevor man eine ganze Datenquelle verwirft.
4. **Zeitstempel und Wiederholungen wirklich lesen.** Mehrere Dateien zum nominalen Viertelstunden-Zeitpunkt waren echte Fünfminutenscans, keine Verarbeitungsversionen. Profile nach Quelle gruppieren, gültige Scans im Slot explizit mitteln, Abdeckung auf der angegebenen Zeitebene berechnen. Nicht aus Dateianzahl eine unabhängige Stichprobengröße ableiten.
5. **Null, fehlend und tagsüber getrennt halten.** Publiziertes Preprocessing setzt Tagesdichten auf null. Solche Werte machen einen Nachtzugtest künstlich leicht. Die Karte und der Vergleich respektieren Nacht- und Fehlwertmasken. Echte nächtliche Nullen bleiben zulässig; fehlende Messungen werden nicht als kein Vogelzug dargestellt.
6. **Bewegung ist nicht gleich Route.** `bird_u/bird_v` sind geschätzte Vogel-Grundbewegung; Wetter-`u/v` sind andere Variablen. Kartenpfeile zeigen die lokale mittlere Richtung mit schematischer Länge. Keine einzelnen Tiere, Verbindungen zwischen Radaren oder zukünftigen Flugwege erfinden. Kreisgröße ist relative Dichtedarstellung, keine Vogelzahl oder tatsächliche Radarreichweite.
7. **Historische Wetterinformation ist kein operativer Prognosenachweis.** 2015 trainieren, 2016 abstimmen, 2017 testen. Der Wetterzusatz senkte den Log-MAE im gewählten Test um 16,6%; ERA 5 enthält jedoch spätere Beobachtungen. Das Ergebnis belegt weder Live-Güte noch Nutzen von Artenwissen, Tracking oder Beringung. Stunden und Standorte sind korreliert; keine Signifikanz aus 18.217 Zeilen behaupten.
8. **Teamrollen und Schreibrechte konkret verteilen.** Datenarbeiter: reproduzierbarer Import und Provenienz. Mathematischer Reviewer: Flag-Semantik, Leakage und Pfeilgeometrie. Kontakt-/UX-Rolle: verifizierte Ansprechpartner und Browserprüfungen. Hauptagent: Zusammenführung, Frontend, sichtbare Kontrolle und Veröffentlichung. Ein Verantwortlicher pro Datei; native Agenten, keine Vertex-Aufrufe.
9. **Gezielte Fachfrage statt Massenmail.** Peter Desmet: korrigierte Radar-QC. Judy Shamoun-Baranes: wissenschaftlich sinnvoller Vergleich. Heiko Schmaljohann: Abflugökologie und Felddaten. DDA/EURING/Movebank: jeweils eigener Datenzugang. Expertise ist weder Nachfrage noch Zustimmung. Entwürfe sind unversandt; BfN-Gegenbefund bleibt erhalten, kein Nachfassen.
10. **Den gebauten Stand testen.** Browserprüfungen nutzen `dist`: nach Frontendänderungen neu bauen. Verschachtelte `details` brauchen gezielte Summary-Selektoren. Vor pixelgenauen Scrolltests auf geladene Fonts warten. Datumsauswahl, Tastaturregler, Wiedergabe/Pause, Quellen und deutsche Oberfläche prüfen. Karte tatsächlich ansehen, nicht nur den Build abhaken.
11. **Kleine, nachvollziehbare Downloads.** Das 269,7 MB-ZIP enthält die benötigten CSVs;29,2 GB-Modellergebnisse sind unnötig. Byte-Range-Zugriff mit ZIP-CRC, Größenprüfung und SHA-256 pro entpacktem Mitglied reicht. Ein Manifest-Hash ist kein Hash des gesamten Archivs. Quelldaten bleiben außerhalb Git; CC-BY-Attribution bleibt erhalten, Code ist CC 0.
12. **Zeitgleiches Arbeiten früh erkennen.** Vor Beginn fetch/PR-Abgleich; vor Veröffentlichung neue Main-Commits integrieren und die kombinierte Suite prüfen. Nicht überschreiben oder force-pushen. Die parallel entstandene Constraint-Release-Methode wurde sauber integriert; ihr vorgeschlagener Stations-Holdout ist ein eigener Test, kein ausgeführtes Ergebnis dieser Karte.

## Verifizierter Ausgangsstand

- Frontend:21 gemeinsame Radarstandorte in Deutschland/Belgien/Niederlanden,168 UTC-Stunden vom 1.–7.10.2017,1.351 vorhandene Nachtbeobachtungen; Datum, Zeitregler und Wiedergabe.
- Daten: `src/data/birdMovementMap.json`; Generator und 5 Tests unter `07-demos/eurobirdcast/map/`. Quelle Lippert et al.2022, DOI 10.5281/zenodo.6874789, CC BY 4.0.
- Europäischer Vergleich:61.881 zulässige Radarstunden;21 gemeinsame Standorte aus 22 Quelldatensatz-Standorten. Log-MAE saisonal 0,7925, plus Wetter 0,6606.21 ist die ausgewertete Anzahl,22 die ursprüngliche Quellenanzahl.
- Strenger Protzel-Rohdatenpilot:9/4/1 Nächte vor Lag,5/0/0 danach; weiterhin kein Score. Das darf neben dem funktionierenden vorbereiteten Benchmark stehen.
- Nach Integration von Main:760 Vitest-Tests plus 23 Python-Tests bestanden.15 Browser-Tests, Lint und Produktionsbuild bestanden. Bewertung bleibt 22/35; keine Zustellung.

## So beginnt die nächste Runde

1. Aktuellen Branch, offene PRs, diesen Bericht und die aktuellen Dossiers lesen. Bestehende Nutzervorgaben beibehalten; keine neue Vollsuche starten, wenn nur eine konkrete Kartenverbesserung gefragt ist.
2. Den vorhandenen Generator ausführen und das Frontend öffnen. Quelle, Lizenz, Messdatum, Nachtdefinition, Koordinaten, Einheiten, Fehlwerte und Anzahlen gegen den Artefaktstand prüfen. Neue Daten als neue Version mit Provenienz behandeln.
3. Genau **eine** Verbesserung wählen: beispielsweise aktuellere qualitätsgesicherte Beobachtungen, zusätzliche historische Wochen oder bessere Kartenerklärung. Wissenschaftliche Korrektheit und Bedienbarkeit getrennt prüfen. Kein Forecast- oder Artenfeature ohne passende Daten erzwingen.
4. Für frischere Daten zuerst konkrete Station/Zeitraum und echte Publikationsverzögerung messen. Historische Wiedergabe nicht als aktuell beschriften. Reale Veröffentlichungs-/Abrufzeiten zusätzlich zu Messzeiten speichern.
5. Falls Prognosen später gewünscht sind: Ausgabezeit-archivierte Wettervorhersagen und verfügbare Radardaten prospektiv speichern. Gleiche ungesehene Nächte für Baselines und Zusatzquellen; neue Saisons und unabhängige Standorte. Den separat vorgeschlagenen Donor-only-Stations-Holdout nicht mit target-trainierter Stationshistorie vermischen.
6. Dossiers DE/EN, `src/data/dosen.ts`, Export und Prüfprotokoll gemeinsam aktualisieren. Neue Quellen nur über den Bibliothekar. Danach relevante Tests, Lint, Build, Browserkontrolle, Commit und Push. Externe Kontaktaufnahme nur bei entsprechender Nutzeranweisung.

## Nicht erneut tun

Kein mathematischer Theoremname als Ersatz für Messdaten; kein Vollständigkeitsversprechen für „alle europäischen Daten“; keine erfundene Artbestimmung; kein Aufweichen eines Gates nach Betrachtung des Scores; keine Verwechslung der historischen Karte mit einer Live-Vorhersage. Das bestehende funktionierende Demo bleibt der Startpunkt.

## Veröffentlichung tatsächlich geprüft

Am 08.10.2026 wurde zusätzlich die öffentliche GitHub-Pages-Version im echten Browser geprüft: Bewegungskarte geladen, Wiedergabe bewegt den Zeitregler, Pause funktioniert, Datum auf 2017-10-07 gewechselt, Tabelle mit 21 Radarzeilen und numerischen Beobachtungen sichtbar, keine Clientfehler. Der Demo-Deploymentlauf 37827734370 war erfolgreich. Diese Prüfung betrifft die tatsächlich veröffentlichte Karte, nicht nur einen lokalen Build; sie macht die historischen Daten nicht zu aktuellen Beobachtungen.

## Zusätzliche Demo-Lehre

Wissenschaft sichtbar machen: verifizierte Ortsnamen, ein anklickbarer Standort mit eigener Zeitreihe und beobachtet/fehlend/tagsüber-Zahlen sind nützlicher als erfundene Fluglinien. Stationsdiagramme dürfen unterschiedliche Skalen haben, müssen das aber sagen. Nachtwiedergabe darf leere Frames überspringen; die Zeitachse darf deshalb nicht so tun, als seien Stunden gleichmäßig abgespielt worden. Große Kartenansicht braucht Escape und Fokus-Rückgabe. Forschende fair würdigen; Energiebetreiber zu offenen Monitoring-/Schutzdaten auffordern, ohne aus Radar pauschale Schuld oder Kollisionsnachweise zu erfinden.

Demo-Politur geprüft: 760 Vitest + 23 Python + 18 Browser-Tests sowie Lint und Build grün. Stationsauswahl, echte Fehlwertsegmente, Nachtwiedergabe, Escape und Fokus-Rückgabe geprüft. Visuelle Kontrolle fand trotz grüner Sichtbarkeitstests eine defekte große Kartenansicht: ein transformierter Vorfahr begrenzte `position: fixed` und Leaflet zeigte den falschen Ausschnitt. Korrektur: Dialog per React-Portal direkt unter `body`, Karte beim Ansichtswechsel sauber initialisieren. Regression prüft jetzt tatsächliche Viewport-Abmessungen; zusätzlich waren alle 21 Radarmarker im sichtbaren Ausschnitt. Desktop und 390px-Mobilansicht visuell geprüft. Lehre: sichtbare Buttons beweisen weder korrekte Geometrie noch sichtbare Messdaten.
