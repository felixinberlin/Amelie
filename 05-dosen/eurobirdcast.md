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

Zuerst eine verständliche Bewegungskarte: 21 Radarstandorte, 168 Stunden vom 1.–7. Oktober 2017, Zeitregler, Datumsauswahl und Wiedergabe. Kreisfarbe und -größe zeigen geschätzte höhenintegrierte Vogeldichte; Pfeile die gemessene mittlere Bewegungsrichtung mit schematischer Länge. Fehlende und tagsüber ausgeschlossene Werte bleiben sichtbar unterschieden. Keine erfundenen Verbindungen zwischen Stationen. Wissenschaft, Quellen, Modellvergleich und Fachkontakte sind dahinter aufklappbar. Frische Daten und Prognosen sind spätere Erweiterungen.

## Bestehende Angebote

Verengt; Bedarf unklar. FlySafe bietet bereits aktuelle Radarbeobachtungen und mehrtägige Vogelzugprognosen für Deutschland, Belgien und die Niederlande (UvA, 25.08.2026). Aloft/CROW, getRad/bioRad, HiRAD und FluxRGNN bearbeiten Daten, Auswertung und Modelle. EuroBirdPortal, EURING und Movebank liefern unterschiedliche historische Perspektiven. Der mögliche Beitrag ist ein überprüfbarer Vergleich zusätzlicher Wissensquellen; keine behauptete Erstentwicklung oder nachgewiesene Verbesserung.

## Erster Schritt

Eine wissenschaftlich nachvollziehbare Bewegungskarte im Frontend zeigen.

Umgesetzt: animierte Frontend-Karte mit 21 Standorten, 168 Stunden und 1.351 verfügbaren Nachtmessungen, CC-BY-Quelle und unabhängiger Datenprüfung. Reproduzierbar unter 07-demos/eurobirdcast/map/. Ausgeführt: 07-demos/eurobirdcast/benchmark/ nutzt publizierte Radar-/ERA5-Daten, trainiert 2015, stimmt 2016 ab und testet 18.217 Radarstunden aus 2017. Saisonaler Log-MAE 0,7925; plus Wetter 0,6606. Quellenlizenz, Masken, CRC und SHA-256 dokumentiert. Separater Protzel-Rohdatenpilot bleibt mit 9/4/1 Vogeldiskriminierungsnächten unzureichend. Nächster Abschluss: Ausgabezeit-archivierte Wettervorhersagen, frisches Radar, Mehrsaison-/Standorttests und Artenwissen einzeln prüfen; fachliche QC-Anfrage an INBO/UvA vorbereitet, nicht versendet.

## Grenzen und Historie

Die BfN-Ablehnung der früheren Offshore-Idee bleibt gültig. Radar liefert weder sichere Artbestimmung noch Kollisionsrisiko. Historische Aufzeichnungen haben ungleichen Erfassungsaufwand und verändertes Klima; Zugang und Weitergabe sind quellenspezifisch. ERA5 enthält spätere Beobachtungen und belegt deshalb keine operative Prognosegüte. EuroBirdCast ist ein Arbeitstitel ohne Verbindung zu BirdCast.

## Empfänger und Förderbrücke

Peter Desmet (INBO/Aloft): Datenqualität; Judy Shamoun-Baranes (UvA): wissenschaftlicher Vergleich; weitere verifizierte Kontakte im Recherchekapitel. Neuer Bedarf unbestätigt, kein Versand. DBU ist eine mögliche Brücke für einen künftigen Umsetzungspiloten mit deutschem Partner und messbarer Umweltentlastung, vorbehaltlich Förderfähigkeit und CC0-Prüfung; Monitoring, Grundlagenforschung, Pflichtaufgaben und begonnene Vorhaben sind ausgeschlossen.

## Recherche und Demo

- [Forecasting and data fusion](../02-recherche/eurobirdcast-bird-weather-2026-10-08.md)
- [Revival research](../02-recherche/eurobirdcast-revival-2026-10-08.md)
- [Runnable pilot](../07-demos/eurobirdcast/forecast/README.md)
- [DBU](https://www.dbu.de/foerderung/projektfoerderung/)
- [Project](https://felixinberlin.github.io/Amelie/#dose=eurobirdcast)

- [Real Amélie test](../02-recherche/eurobirdcast-real-test-2026-10-08.md)
- [Verified contacts and unsent drafts](../02-recherche/eurobirdcast-contacts-2026-10-08.md)
