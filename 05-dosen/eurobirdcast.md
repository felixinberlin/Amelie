---
status: Available
delivery_method: E-Mail
target_maker: 'Joep Breuer, TNO / BIRDSAFE'
review_score: 22/35
architecture_tier: Tier 2/3
source_type: Type A/D
---
# EuroBirdCast — Vogelzug-Forschungswerkbank

Europäischen Nachtzug sichtbar machen und Abschaltszenarien nachrechnen: eine offene Forschungswerkbank mit Datenqualitätsprüfung, Rotorhöhen-Abdeckung und nachvollziehbaren Annahmen.

Am 08.10.2026 mit engerem Zuschnitt wiederaufgenommen. Erst bauen; neuer Bedarf unbestätigt. CC0. Keine Verbindung zu BirdCast.

## Das Problem

Radarprofile beschreiben regionalen Vogelzug; eine Windparkentscheidung braucht zusätzlich lokale Messungen, gültige Regeln und Netzzustand. Das ursprüngliche Projekt wurde nach einer negativen BfN-Bedarfsantwort am 30.09.2026 beerdigt. Die neue, noch unbestätigte Restlücke ist ein portabler Vergleichsbericht: Welche Daten und Höhen wurden tatsächlich erfasst, wie verändert eine frei gewählte Szenarioschwelle das Ergebnis, und was bleibt unbekannt?

## Skizze

Zwei getrennte Ebenen: europäische VPTS-Profile als regionaler Kontext und lokale Vogelradar-/Leistungsdaten als freiwilliger Import. Dichte (Vögel/km³) × Geschwindigkeit (km/h) × erfasste Schichtdicke (km) ergibt MTR (Vögel/km/h). Fehlende oder qualitätsgesperrte Schichten sperren die Rotorband-Auswertung. Szenarien vergleichen beobachteten Durchzug und hypothetische Energieverluste; weder Kollisionszahlen noch gerettete Vögel werden daraus abgeleitet. Export mit Quelle, Lizenz, UTC, Höhenbezug, Parametern und Softwareversion. Kein Live-Abschaltdienst.

## Wo es kippt

Das BfN sah keine Reproduzierbarkeitslücke und hielt DWD-Wetterradar für den damaligen Offshore-Zweck für ungeeignet. Diese Antwort bleibt gültig. Regionale MTR ist kein Kollisionsrisiko; Teilabdeckung ist kein Nullzug. Neue Bedarfsbestätigung und lokale Validierung fehlen. Wenn BIRDSAFE/HiRAD das Exportformat bereits abdecken oder keinen Nutzen sehen, endet der Ausbau. EuroBirdCast bleibt ein Arbeitstitel ohne Verbindung zum US-Projekt BirdCast.

## Wer es schon tut

Verengt, Bedarf unklar (08.10.2026): Aloft/CROW visualisieren europäischen Vogelzug; getRad und bioRad liefern Zugang und Auswertung; BirdCast bietet US-Karten und Prognosen. Niederländisches Start/Stop, BIRDSAFE und BfN-Vorhaben bearbeiten Offshore-Schutz bereits. VoVis Wx verarbeitet Radar für militärische Vogelzugberatung. Kein Anspruch auf Neuartigkeit des Radars, der Prognose oder der Abschaltung; nur ein interoperabler, qualitätsbewusster Forschungsbericht ist zu prüfen.

## Warum jetzt

- Desmet et al. (2025) dokumentieren europäische VPTS-Datensätze unter CC0; Zeitstempel sind UTC. Offene Daten sind keine Garantie für lokale Eignung.
- HiRAD meldete am 11.02.2026 weitere Radarstandorte, warnt aber ausdrücklich vor ungeprüfter biologischer Signalqualität.
- Der niederländische Änderungsbeschluss vom 30.01.2026 ersetzt die feste 500-Vögel/km/h-Schwelle durch modellgestützte Entscheidungen mit flexibler Grenze.
- BIRDSAFE untersucht bereits Radar, Kameras und Abschaltstrategien. EuroBirdCast muss als ergänzendes Exportmodul passen, statt diese Forschung zu duplizieren.

## Erster Schritt

Ein Rotorband, ein prüfbarer MTR-Bericht.

Der CC0-TypeScript-Kern und synthetische Tests liegen in 07-demos/eurobirdcast/. Ticket 01 ist erst abgeschlossen, wenn ein archivierter echter VPTS-Ausschnitt mit URL, Lizenz und SHA-256 eingelesen, der Höhenbezug geprüft und die MTR-Handrechnung unabhängig reproduziert ist. Fehlende Schichten, Regenflag, Überlappung, Nullzug und ungültige Werte müssen explizit behandelt werden. Vor Ausbau bestätigt ein Forschungspartner den Nutzen des Exportformats.

## Empfänger

Joep Breuer, TNO / BIRDSAFE (fachlicher Ansprechpartner laut Wozep-Poster 2025); nachrangig HiRAD / UvA. Neuer Bedarf unbestätigt; keine erneute BfN-Zustellung.

## Förderbrücke

DBU-Projektförderung ist eine mögliche Brücke für einen künftigen Umsetzungspiloten mit deutschem Partner und nachweisbarer Umweltentlastung. Skizzen sind laufend möglich; reines Monitoring, Grundlagenforschung und gesetzliche Pflichtaufgaben sind ausgeschlossen. Antragsteller, Passung und CC0-Bedingungen vor Antrag prüfen; keine Förderzusage und kein Versand.

## Recherche und Demo

- [Research dossier](../02-recherche/eurobirdcast-revival-2026-10-08.md)
- [CC0 scaffold](../07-demos/eurobirdcast/README.md)
- [Project](https://felixinberlin.github.io/Amelie/#dose=eurobirdcast)
- [DBU funding](https://www.dbu.de/foerderung/projektfoerderung/)


## Historische Messdatenkarte / Historical observation map

Die Projektseite enthält zusätzlich die am 08.10.2026 auf `origin/main` veröffentlichte Karte: Protzel, Dresden und Ummendorf, 01.10.2023 UTC. `src/data/birdMigrationSample.json` enthält Quell-URLs, SHA-256 und Dateigrößen; Regeneration: `scripts/eurobird-demo/fetch.py`. Diese echte historische Stichprobe ist unabhängig vom synthetischen MTR-Kern: Stunden-/Höhenmittel sind keine vollständige vertikale Integration und validieren keine Abschaltempfehlung. Die Karte benötigt für Basiskacheln Internet; die Messtabelle bleibt ohne Kacheln nutzbar. Keine europaweite Messabdeckung. Weitere Recherche: `02-recherche/eurobirdcast-radar-kakeya-research-2026.md`; kein neues Kakeya-Theorem implementiert.

The project page also includes the historical observation map merged from `origin/main`: three German radars, 1 October 2023 UTC. Source URLs and raw SHA-256 checksums are retained in the sample JSON. This real snapshot is separate from the synthetic MTR kernel; hourly averages do not validate rotor-band traffic or curtailment. No new Kakeya theorem is implemented.
