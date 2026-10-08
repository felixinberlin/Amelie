---
status: Available
delivery_method: E-Mail
target_maker: 'Joep Breuer, TNO / BIRDSAFE'
review_score: 22/35
architecture_tier: Tier 2/3
source_type: Type A/D
---
# EuroBirdCast — Bird Weather

Bird Weather für Deutschland und Europa: jüngste Radarbeobachtungen, Wettervorhersagen und historisches Wissen über Vogelzug verbinden — und an ungesehenen Nächten prüfen, ob die Prognose dadurch besser wird.

**Status:** Erst bauen. Keine Live-Prognose und keine belegte Genauigkeitsverbesserung. CC0-Code; Drittanbieter-Daten behalten ihre Lizenzen.

## Das Problem

Für die nächste Zugnacht zählen aktuelle Bedingungen und die langfristigen Muster der Arten. Radar, Beringung, GPS und Sichtungen messen aber verschiedene Dinge. EuroBirdCast soll daraus eine nachvollziehbare Vogelzugprognose entwickeln. Der erste reale Radar-/ERA5-Pilot ist am Qualitätsgate gescheitert (Protzel, Oktober 2021–2023: 5/3/0 auswertbare Nächte); eine bessere Prognose ist noch nicht belegt. Die frühere BfN-Ablehnung einer Offshore-Reproduzierbarkeitslücke bleibt gültig.

## Skizze

Drei Zeitskalen verbinden: aktuelle Luftbewegung aus Radar, Stunden bis Tage aus Wettervorhersagen, saisonale und artspezifische Muster aus langfristiger Forschung. Quellen behalten Messmodell, Art, Ort, Erfassungsaufwand, Lizenz, Unsicherheit und Verfügbarkeitszeit. Publikationen begründen Merkmale statt als Messpunkte zu dienen. Vergleich: saisonale Historie, plus Wetter, plus jüngstes Radar, danach Artenwissen. Vorhersageziel zuerst nächtliche integrierte Dichte; Richtung/Höhe und regionale Ausbreitung sind spätere getrennte Ziele. Keine Turbinensteuerung. Frontend zeigt Datenrollen, Qualitätsgate und die vorhandene historische Karte.

## Bestehende Angebote

Verengt; Bedarf unklar. FlySafe bietet bereits aktuelle Radarbeobachtungen und mehrtägige Vogelzugprognosen für Deutschland, Belgien und die Niederlande (UvA, 25.08.2026). Aloft/CROW, getRad/bioRad, HiRAD und FluxRGNN bearbeiten Daten, Auswertung und Modelle. EuroBirdPortal, EURING und Movebank liefern unterschiedliche historische Perspektiven. Der mögliche Beitrag ist ein überprüfbarer Vergleich zusätzlicher Wissensquellen; keine behauptete Erstentwicklung oder nachgewiesene Verbesserung.

## Erster Schritt

Historie, Wetter und jüngstes Radar mit einem überprüfbaren Datengate verbinden.

Ausführbar: Python-Pipeline unter 07-demos/eurobirdcast/forecast/, drei archivierte Radar-Monate plus ERA5, Quellen mit SHA-256 und Qualitätsbericht. Das erste Gate ist rot: 5/3/0 Nächte vor Radar-Lag, 1/0/0 danach; deshalb kein Modell und keine Prognose. Nächster Abschluss: genügend qualitätsgesicherte Mehrsaison-Daten, archivierte Vorhersageläufe mit Ausgabezeit und unabhängiger Standort-/Jahrestest; zusätzliche Artenquellen einzeln gegen dieselben Baselines prüfen.

## Grenzen und Historie

Die BfN-Ablehnung der früheren Offshore-Idee bleibt gültig. Radar liefert weder sichere Artbestimmung noch Kollisionsrisiko. Historische Aufzeichnungen haben ungleichen Erfassungsaufwand und verändertes Klima; Zugang und Weitergabe sind quellenspezifisch. ERA5 enthält spätere Beobachtungen und belegt deshalb keine operative Prognosegüte. EuroBirdCast ist ein Arbeitstitel ohne Verbindung zu BirdCast.

## Empfänger und Förderbrücke

Joep Breuer, TNO / BIRDSAFE, ist als Fachkontakt belegt; neuer Bedarf unbestätigt. Kein Versand. DBU ist eine mögliche Brücke für einen künftigen Umsetzungspiloten mit deutschem Partner und messbarer Umweltentlastung, vorbehaltlich Förderfähigkeit und CC0-Prüfung; Monitoring, Grundlagenforschung, Pflichtaufgaben und begonnene Vorhaben sind ausgeschlossen.

## Recherche und Demo

- [Forecasting and data fusion](../02-recherche/eurobirdcast-bird-weather-2026-10-08.md)
- [Revival research](../02-recherche/eurobirdcast-revival-2026-10-08.md)
- [Runnable pilot](../07-demos/eurobirdcast/forecast/README.md)
- [DBU](https://www.dbu.de/foerderung/projektfoerderung/)
- [Project](https://felixinberlin.github.io/Amelie/#dose=eurobirdcast)
