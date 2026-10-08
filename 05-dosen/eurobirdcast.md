---
status: Available
delivery_method: E-Mail
target_maker: 'Peter Desmet, INBO / Aloft'
review_score: 22/35
architecture_tier: Tier 2/3
source_type: Type A/D
---
# EuroBirdCast — Bird Weather

Vogelzug wie Wetter sichtbar machen: eine animierte Karte mit echten Radarbeobachtungen, Zugintensität und Bewegungsrichtung über Deutschland und seinen Nachbarländern.

**Status:** Historische Bewegungskarte lauffähig. Rückblickender Modellvergleich ausgeführt; operative Prognose noch offen. CC0-Code; Drittanbieter-Daten behalten ihre Lizenzen.

## Das Problem

Für die nächste Zugnacht zählen aktuelle Bedingungen und langfristige Artenmuster. Radar, Beringung, GPS und Sichtungen messen verschiedene Dinge. Ein ausführbarer Vergleich auf publizierten europäischen Daten nutzt 61.881 Nacht-Radarstunden an 21 gemeinsamen Standorten: plus Wetter senkt den Log-MAE im Testjahr 2017 um 16,6 % gegenüber saisonaler Historie. Das ist ein historischer Vergleich mit rückblickendem Wetter, noch keine belegte Live-Prognose. Die frühere BfN-Ablehnung bleibt gültig.

## Skizze

Zuerst eine verständliche Bewegungskarte: 21 Radarstandorte, 168 Stunden vom 1.–7. Oktober 2017, Zeitregler, Datumsauswahl, Nachtwiedergabe, verifizierte Standortnamen, Standort-Zeitdiagramme und große Kartenansicht. Kreisfarbe und -größe zeigen geschätzte höhenintegrierte Vogeldichte; Pfeile die gemessene mittlere Bewegungsrichtung mit schematischer Länge. Fehlende und tagsüber ausgeschlossene Werte bleiben sichtbar unterschieden. Keine erfundenen Verbindungen zwischen Stationen. Wissenschaft, Quellen, Modellvergleich und Fachkontakte sind dahinter aufklappbar. Frische Daten und Prognosen sind spätere Erweiterungen.

## Bestehende Angebote

Verengt; Bedarf unklar. FlySafe bietet bereits aktuelle Radarbeobachtungen und mehrtägige Vogelzugprognosen für Deutschland, Belgien und die Niederlande (UvA, 25.08.2026). Aloft/CROW, getRad/bioRad, HiRAD und FluxRGNN bearbeiten Daten, Auswertung und Modelle. EuroBirdPortal, EURING und Movebank liefern unterschiedliche historische Perspektiven. Der mögliche Beitrag ist ein überprüfbarer Vergleich zusätzlicher Wissensquellen; keine behauptete Erstentwicklung oder nachgewiesene Verbesserung.

## Erster Schritt

Eine wissenschaftlich nachvollziehbare Bewegungskarte im Frontend zeigen.

Umgesetzt: animierte Frontend-Karte mit 21 Standorten, 168 Stunden und 1.351 verfügbaren Nachtmessungen, CC-BY-Quelle und unabhängiger Datenprüfung. Reproduzierbar unter 07-demos/eurobirdcast/map/. Ausgeführt: 07-demos/eurobirdcast/benchmark/ nutzt publizierte Radar-/ERA5-Daten, trainiert 2015, stimmt 2016 ab und testet 18.217 Radarstunden aus 2017. Saisonaler Log-MAE 0,7925; plus Wetter 0,6606. Quellenlizenz, Masken, CRC und SHA-256 dokumentiert. Separater Protzel-Rohdatenpilot bleibt mit 9/4/1 Vogeldiskriminierungsnächten unzureichend. Nächster Abschluss: Ausgabezeit-archivierte Wettervorhersagen, frisches Radar, Mehrsaison-/Standorttests und Artenwissen einzeln prüfen; fachliche QC-Anfrage an INBO/UvA vorbereitet, nicht versendet.

## Grenzen und Historie

Die BfN-Ablehnung der früheren Offshore-Idee (FKZ 3519 86 0500, 30.09.2026) bleibt uneingeschränkt gültig. Großraum-Wetterradar (C-Band) operiert in 200–2.000 m Höhe mit kilometergroßen Voxeln; es kann weder Einzeltiere geschützter Arten (Rotmilan, Seeadler, Sterntaucher) identifizieren noch das kleinräumige Kollisionsrisiko im Rotorbereich (50–250 m) quantifizieren. Eine automatisierte Abschaltung allein auf Wetterradarbasis ist haftungs- und immissionsschutzrechtlich (BImSchG) unhaltbar.

## Konzeptionelle Schärfung & Systemarchitektur

EuroBirdCast ist kein Mikrosensor an der Turbine, sondern die **synoptische Makro-Frühwarnschicht** („Vogelwetter"):
1. **Makro-Ebene (EuroBirdCast):** 24–48 h Vorwarnung synoptischer Massenzugwellen (>500 Vögel/km/h) über DWD/EUMETNET C-Band Radar und Aloft VPTS.
   - Dient Übertragungsnetzbetreibern (TSOs: 50Hertz, TenneT, Amprion, TransnetBW) zur 24–48-stündigen Vorhaltung von Redispatch- und Regelenergiereserven bei drohender Cluster-Abregelung.
   - Ermöglicht kommunales „Lights Out" (Abschaltung von Hochhaus- und Fassadenbeleuchtung in Frankfurt, Hamburg, Berlin) und liefert zivile Synergien zu BIRDTAM-Warnstufen (ZGeoBw).
2. **Meso-/Mikro-Ebene (Lokales AKS):** Dediziertes Vogelradar (X-Band / Robin Radar) und validierte KI-Kamerasysteme (z. B. IdentiFlight nach § 45b BNatSchG) direkt am Park triggern die eigentliche Trudelstellung (< 2 U/min).
3. **Öffentliche Kontroll-Baseline:** EuroBirdCast schafft einen offenen, auditierbaren Benchmark für Genehmigungsbehörden (Staatliche Gewerbeaufsichtsämter / LfU) und Umweltverbände (NABU, BUND, DUH), um interne Betreiberprotokolle in Hauptzugphasen unabhängig zu verifizieren.

## Macht- und Entscheidungslandkarte (Wer entscheidet?)

Die Durchsetzungskraft verteilt sich auf vier institutionelle Ebenen:
- **Datenhoheit:** DWD (17 Radarstationen, § 10 DWD-Gesetz Open Data) und EUMETNET/OPERA; wissenschaftliche Aufbereitung durch INBO/Aloft (Peter Desmet) und UvA (Judy Shamoun-Baranes).
- **Regulierung & Recht:** BMUV und Landesumweltministerien (Verwaltungsvorschriften, Windenergie-Erlasse für BImSchG-Genehmigungsbehörden). Die europäische Blaupause liefert die Niederlande (*Staatscourant 2026, 2036*), wo das Ministerie van Klimaat en Groene Groei mit TenneT flexible Abschaltschwellen für Nordsee-Parks (Borssele, Hollandse Kust, IJmuiden Ver; max. 60 h/Jahr) gesetzlich anordnet.
- **Operative Schaltung:** TSOs (Redispatch-Koordination) und Windparkbetreiber (RWE, Ørsted, Vattenfall, EnBW via SCADA-Leitwarten).
- **Evidenz & Klagerechte:** DDA / ornitho.de (Bodenevidenz / NocMig) und anerkannte Umweltverbände (Verbandsklagerecht nach UmwRG).

## Empfänger und Förderbrücke

Peter Desmet (INBO/Aloft): Datenqualität; Judy Shamoun-Baranes (UvA): wissenschaftlicher Vergleich; weitere verifizierte Kontakte im Recherchekapitel. Neuer Bedarf unbestätigt, kein Versand. DBU ist eine mögliche Brücke für einen künftigen Umsetzungspiloten mit deutschem Partner und messbarer Umweltentlastung, vorbehaltlich Förderfähigkeit und CC0-Prüfung; Monitoring, Grundlagenforschung, Pflichtaufgaben und begonnene Vorhaben sind ausgeschlossen.

## Recherche und Demo

- [Governance and power landscape](../02-recherche/eurobirdcast-governance-and-power-2026-10-08.md)
- [Forecasting and data fusion](../02-recherche/eurobirdcast-bird-weather-2026-10-08.md)
- [Revival research](../02-recherche/eurobirdcast-revival-2026-10-08.md)
- [Runnable pilot](../07-demos/eurobirdcast/forecast/README.md)
- [DBU](https://www.dbu.de/foerderung/projektfoerderung/)
- [Project](https://felixinberlin.github.io/Amelie/#dose=eurobirdcast)
- [Real Amélie test](../02-recherche/eurobirdcast-real-test-2026-10-08.md)
- [Verified contacts and unsent drafts](../02-recherche/eurobirdcast-contacts-2026-10-08.md)
