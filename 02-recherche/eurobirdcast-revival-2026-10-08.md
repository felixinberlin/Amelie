# EuroBirdCast — Wiederaufnahme und Forschungsplan

**Recherche: 08.10.2026.** Auftrag: wiederbeleben, gründlich recherchieren, als erstes Projekt im Frontend zeigen. Urteil: **verengt; neuer Bedarf unklar; build_first**. Kein neuer Versand. Die alte BfN-Antwort wird weder widerrufen noch als öffentliches Forschungsergebnis ausgegeben.

## 1. Was genau wiederkehrt

Die ursprüngliche Idee verband offene Wetterradarprofile mit turbinenspezifischen Abschaltempfehlungen und einer behaupteten Reproduzierbarkeitslücke. Laut internem Totenschein verneinte das BfN am 30.09.2026 diese Lücke; DWD-Daten seien für den damaligen Offshore-Zweck ungeeignet gewesen. Das ist Empfänger-Evidenz, keine universelle Aussage gegen die biologische Nutzung von Wetterradar. Die Originalmail liegt in den hier geprüften Dateien nicht vor; ihre Formulierung wird nicht erfunden.

Wiederaufgenommen wird eine **Forschungswerkbank**: regionalen Nachtzug erkunden, Datenabdeckung offenlegen und frei gewählte Szenarien als portablen Bericht vergleichen. Wetterradar ist Kontext. Lokale Vogelradare und Leistungsdaten sind eine eigene Ebene. Es gibt keine automatische Turbinensteuerung und keinen neuen behaupteten BfN-Bedarf.

Historie: [altes Dossier](../08-friedhof/grabbeigaben/eurobirdcast.md), [alter Totenschein](../08-friedhof/grabbeigaben/eurobirdcast-totenschein-2026-09-30.json), vier Prüfberichte vom 22.09.2026 in `08-friedhof/grabbeigaben/`. Der historische Grabdatensatz wurde archiviert und aus dem aktiven Friedhof entfernt, damit die Idee nicht gleichzeitig aktiv und beerdigt erscheint.

## 2. Primärquellen und Evidenzstand

Alle Links am 08.10.2026 geprüft. „Seite gelesen“ bedeutet abgerufenen Inhalt; kein erfolgreicher Live-Datendownload wird behauptet. Zahlen beziehen sich auf den jeweiligen Quellenstand.

| Quelle | Evidenz | Befund und Konsequenz |
|---|---|---|
| [Desmet et al., Biological data derived from European weather radars (2025)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11871220/) | Volltext gelesen | Beschreibt VPTS, UTC und CC0; zusammen 152 Radarstationen an 141 Orten im damaligen Datensatz. Profile enthalten biologische Bewegungsinformation. Stationsabdeckung und historische Qualität begrenzen die Auswertung; keine europäische Vollabdeckung voraussetzen. |
| [HiRAD: neue Länder, 11.02.2026](https://hirad.science/news/2026/aloft-new-countries/) | Seite gelesen | Zusätzliche VPTS aus Griechenland, Ungarn, Island, Irland, Litauen und Rumänien; Länderfreigabe bedeutet nicht automatisch Daten. Biologische Signalqualität neuer Standorte ausdrücklich nicht evaluiert. Radar-IDs haben sich teils geändert. |
| [Aloft data-repository: Qualitätsbewertung](https://aloftdata.github.io/data-repository/) | Seite gelesen | Gemeinschaft verfolgt Datenprobleme. Qualitätsprüfung ist eine eigene Arbeit, nicht mit erfolgreichem Download erledigt. |
| [getRad](https://github.com/aloftdata/getRad) | README gelesen, nicht ausgeführt | Bestehender Zugang zu Radarprodukten; vor einem neuen Downloader nutzen und Lizenz je Abhängigkeit prüfen. Kein Nachweis, dass jeder gewünschte Standort oder historische Zeitraum verfügbar ist. |
| [Aloft](https://aloftdata.eu/) | Einstiegsseite gelesen | Bestehendes europäisches Portal. Es verweist auf Datensätze und CROW; keine neue allgemeine Vogelzugkarte als Alleinstellungsmerkmal behaupten. |
| [ENRAM-Arbeitsgruppen](https://enram.eu/working-groups/) | Seite gelesen, historisch | Biologische Klassifikation, Validierung und Visualisierung sind langjährige Forschung. Kein neues Forschungsfeld beanspruchen. |
| [UvA, Fiona Lippert, Dissertation 05.06.2025](https://www.uva.nl/shared-content/uva/en/events/2025/06/from-weather-radars-to-bird-migration-fluxes-process-guided-machine-learning-for-spatio-temporal-forecasting-and-inference.html) | Universitätsseite gelesen | Wetterradar-basierte Flussmodellierung ist aktive Forschung. Die Veranstaltungsseite belegt Thema und Betreuung, nicht die Genauigkeit eines operativen Modells. |
| [BirdCast](https://birdcast.org/) | Seite gelesen | US-Projekt mit Karten und Prognosen. EuroBirdCast bleibt Arbeitstitel, ohne Zugehörigkeit; aus Namensähnlichkeit wird keine nachgewiesene Markenrechtsverletzung abgeleitet. |
| [Staatscourant 2026, 2078, 30.01.2026](https://zoek.officielebekendmakingen.nl/stcrt-2026-2078.html) | amtlicher Volltext gelesen | Feste 500-Vögel/km/h-Grenze wird in den betroffenen Kavelbesluiten durch modellgestützte Ermittlung mit flexibler Grenze ersetzt. Ministerielle Entscheidung bleibt entscheidend; Netzsicherheit wird berücksichtigt. Eine fest eingebaute „EU-Schwelle 500“ wäre falsch. |
| [BIRDSAFE, Wozep-Poster 2025](https://www.noordzeeloket.nl/publish/pages/239226/wozep-dag-2025-birdsafe_tno.pdf) | PDF-Text gelesen | TNO und Partner untersuchen Vogelverhalten und Minderungsstrategien, mit Vogelradaren und Kameras; Messphasen Herbst 2025/2026. Joep Breuer ist namentlich als Kontakt aufgeführt. Deutliche Überschneidung, daher Anschlussmodul statt Konkurrenzmodell prüfen. |
| [BfN: innovative Vermeidungsmaßnahmen Offshore-WEA](https://www.bfn.de/projektsteckbriefe/einsatz-von-innovativen-vermeidungsmassnahmen-zum-vogelschutz-offshore-wea) | Projektseite gelesen | Ein bestehendes Vorhaben untersucht Infrastruktur und internationale Erfahrungen für Offshore-Vogelschutz. Kein Beleg einer unbesetzten behördlichen Aufgabe. Öffentliche Seite bestätigt nicht wortgetreu die interne M0-Antwort. |
| [DBU: Millionenförderung für Meeresschutz](https://www.dbu.de/en/news/millionenfoerderung-fuer-meeresschutz/) | Seite gelesen | Forschung zu Singvogelzug und Offshore-Wind ist bereits gefördert. Potenzieller Partner- und Besetzt-Test, keine offene Ausschreibung und keine neue Förderzusage. |
| [DBU: PARASOL, Projekt 37768/01](https://www.dbu.de/projektdatenbank/37768-01/) | Suchschnipsel | Bestehende Passivradar-Entwicklung; vor technischer Detailaussage Volltext prüfen. Kein eigenes Detektionsgerät entwickeln. |
| [Bundeswehr: VoVis Wx](https://www.bundeswehr.de/de/organisation/cyber-und-informationsraum/aktuelles/bundeswehr-software-berechnet-vogelzug-6144886) | Seite gelesen | Radarbasierte Vogelzugvisualisierung und Beratung existieren auch für militärische Luftfahrt. Keine Übertragung ihrer Eignung oder Schnittstellen auf Offshore-Betrieb. |
| [DBU-Projektförderung](https://www.dbu.de/foerderung/projektfoerderung/) | Seite gelesen | Laufende Skizzeneinreichung möglich; Innovation, Modellcharakter und Umweltentlastung erforderlich. Reines Monitoring, Grundlagenforschung, begonnene Vorhaben und gesetzliche Pflichtaufgaben ausgeschlossen. Erst künftigen Pilot abgrenzen und Träger prüfen. |

Nicht gelungen: direkte Abrufe der bioRad-Dokumentation und Aloft-Caveats lieferten Fehler. Sie werden nicht als gelesen markiert. Der [Validierungsbericht Herbst 2024](https://noordzeeloket.nl/publish/pages/241995/validation-of-the-outcomes-of-the-bird-migration-prediction-model-for-autumn-2024.pdf) war nur als Suchauszug zugänglich; daraus werden keine Genauigkeitskennzahlen übernommen. Der amtliche Beschluss benennt selbst Modellgrenzen und Unterschiede zwischen Radararten.

## 3. Was die neue Evidenz trägt — und was sie nicht trägt

**Belegt:** Es gibt offene europäische biologische Wetterradarprofile und eine aktive Forschungsgemeinschaft. Radarprodukte, Qualitätsbewertung, Prognosen und Offshore-Start/Stop sind bereits besetzt. Der niederländische Rechtsstand verlangt eine aktualisierbare Entscheidungskette statt einer universellen festen Schwelle.

**Eigene Schlussfolgerung:** Ein kleines, unabhängiges Exportformat könnte beim Vergleich von Forschungsdaten und Szenarien helfen. Weder die Publikationen noch die Rechtsänderung belegen, dass jemand dieses Modul braucht. Die Wiederaufnahme folgt dem Nutzerauftrag, nicht einer erfundenen Bedarfsbestätigung. Die erste Frontendposition ist eine redaktionelle Entscheidung, kein Qualitätsranking.

**Nicht belegt:** reproduzierbarer Behördenprozess als ungedeckter Bedarf; exakte Rotorhöhen-Erfassung an beliebigen Standorten; offene lokale Offshore-Messdaten; präzise Kollisionsprognose; gerettete Vögel pro MWh; Betriebsfreigabe; rechtliche Neuartigkeit des Namens.

## 4. Datenvertrag und Rechenweg

Ein Import braucht Ursprungs-URL, Abrufzeit, Lizenz, archivierte Datei mit SHA-256, Radar-ID, Stationshistorie, UTC-Zeitstempel, Softwareversion und Höhenbezug (AGL/AMSL). Rohdaten werden nie als schon validierte biologische Profile ausgegeben. Fehlwerte, Regen/Clutter, Geschwindigkeitsdefinition und Qualitätsflags müssen im Adapter spezifiziert werden.

Für eine akzeptierte Schicht und ihre Schnittmenge mit dem betrachteten Höhenband:

`MTR_i = Dichte_i [Vögel/km³] × Geschwindigkeit_i [km/h] × Schnittdicke_i [km]`

Summe über vollständig abgedeckte, disjunkte Schichten. Annahme: Dichte und Geschwindigkeit innerhalb jeder Schicht konstant. Bei 100–300 m Band und zwei Schichten: `10×50×0,1 + 20×40×0,1 = 130 Vögel/km/h`. Das ist eine synthetische Handrechnung, keine gemessene Zugnacht. Richtungsspezifischer Fluss erfordert zusätzlich die Projektion auf eine deklarierte Transektausrichtung; der aktuelle Kern berechnet skalare MTR.

Fehlende Schicht oder gesperrte Qualität → `insufficient-coverage`, MTR `null`; vollständiges Profil mit Dichte null → echter Nullzug. Keine Hochrechnung der beobachteten Hälfte aufs gesamte Band. Lokales Gelände und Rotorhöhen müssen auf denselben Höhenbezug gebracht werden. Radare unterschiedlicher Hersteller oder Geometrie werden nicht ohne Validierung zusammengeführt.

Ein Szenario braucht ausdrücklich frei gewählte Schwelle, Intervalllänge und kontrafaktische Leistung. `MWh = MW × Stunden` unter Annahme vollständiger Abschaltung; kein realer Ertragsverlust ohne Betriebsmodell. `MTR × Stunden` ist Durchzug pro Kilometer, weder Individuenzählung im Windpark noch Kollisionsvermeidung. Nullwerte und fehlende Werte bleiben verschieden.

## 5. Bestehende Angebote und Anschlussstelle

| Bestehender Baustein | Bereits abgedeckt | EuroBirdCast darf ergänzen, falls gebraucht |
|---|---|---|
| Aloft / CROW / getRad / bioRad | Zugang, Darstellung, biologische Auswertung | Download mit transparentem Provenienz-/Abdeckungsbericht; keine neue Parallelpipeline |
| BirdCast | US-Migration und Prognosen | europäische Forschungsdaten; keine behauptete Verbindung |
| niederländisches Start/Stop | operativer Behördenprozess | retrospektive Lehr- und Forschungsberichte, keine Entscheidung |
| BIRDSAFE / HiRAD | Forschung, Validierung, Szenarien | einfacher wiederverwendbarer Export oder Testfixture nach deren Bedarf |
| BfN / lokale Vogelradarbetreiber | Offshore-Anforderungen und Messinfrastruktur | höchstens Anschluss an freigegebene Daten; keine erneute Bedarfsbehauptung |

**Empfänger:** Joep Breuer, TNO / BIRDSAFE, ist im offiziellen Poster als Kontakt genannt. Das belegt fachliche Ansprechbarkeit im Posterstand, keine Projektzusage oder heutige Zustellbereitschaft. Kein Versand in dieser Runde; vor einem späteren Entwurf Zuständigkeit erneut prüfen. BfN wird nicht nachgefasst.

## 6. Umsetzungsplan mit überprüfbaren Gates

- **M0 — Bedarf:** Forschungsgruppe bestätigt Nutzen eines konkreten Beispielexports; vorhandene Berichte und APIs gemeinsam abgleichen. Ohne Nutzen kein Ausbau.
- **M1 — Daten:** Ein echter archivierter VPTS-Ausschnitt, Lizenz, Hash, Höhenbezug und Qualitätsregeln; unabhängig reproduzierte Handrechnung und Vergleich mit bestehender Bibliothek. Noch offen.
- **M2 — Bericht:** UTC-Zeitachse, Höhen-/Qualitätslücken, experimentelle Parametervarianten und maschinenlesbarer Export. Jeder Wert muss auf eine Messung oder deklarierte Annahme zurückgehen.
- **M3 — Lokaler Vergleich:** Nur mit genehmigtem Vogelradar-Datensatz und Fachpartner; Train/Test nach Standort und Saison trennen, Unsicherheit und Ausfälle zeigen. Kein Training gegen die eigenen Testnächte.
- **M4 — Wirkung:** Erst mit unabhängigem Kollisions- und Betriebsmodell über Wirkung sprechen. Das liegt außerhalb des jetzigen Projekts.

Vorhanden: [CC0-Kern und synthetische Tests](../07-demos/eurobirdcast/README.md). Noch kein produktiver VPTS-Adapter, kein Live-Feed, keine reale Messfixture, kein validiertes Offshore-Modell. Der Forschungscharakter muss auch im Frontend stehen.

## 7. Förderbrücke, Risiko und Abbruch

DBU ist ein Kandidat für einen **künftigen** Umsetzungspiloten mit Partner und messbarer Umweltentlastung. Der bereits vorhandene Code wird nicht rückwirkend als förderfähiger Projektstart ausgegeben. Antragsteller, Eigenanteil, Umweltwirkung, CC0 und Drittanbieter-Lizenzen vorher klären. Keine Summe oder Bewilligung versprechen. Prototype Fund wurde als Landschaft geprüft; die gefundene Homepage nennt eine abgelaufene Bewerbungsphase 2025, deshalb kein Hinweis auf eine offene Frist.

Abbruch: BIRDSAFE/HiRAD haben bereits ein identisches Exportformat; Partner sehen keinen Bedarf; erforderliche lokale Daten bleiben unzugänglich; biologische Qualität oder Höhenabdeckung genügen nicht. Der wertvolle Rest wäre dann das getestete Lehrbeispiel, nicht ein Offshore-Dienst.

## Quellenmeldung

Für den Bibliothekar, ohne direkte Änderung des Quellenregisters: Desmet 2025 (Datensatz/Methodik, CC0), HiRAD-Länderupdate (Datenzugang/Qualitätswarnung), Staatscourant 2026/2078 (amtlicher Regelstand), BIRDSAFE-Poster (Besetzt-Test/Empfänger Joep Breuer), DBU-Projektförderung (bedingte Förderbrücke), VoVis Wx (Besetzt-Test). Ertrag: wiederaufgenommene Dose `eurobirdcast`, Urteil `verengt`, Bedarf `unklar`, 22/35. Vollständige Links und Evidenzstufen stehen in Abschnitt 2.
