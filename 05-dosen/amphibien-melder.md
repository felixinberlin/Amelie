# Amphibien-Melder: Akustische Artenbestimmung für die Bürgerwissenschaft

## Problemstellung
Der weltweite Rückgang der Amphibienpopulationen ist ein alarmierendes Zeichen für die Verschlechterung der Umwelt. Amphibien sind sensible Bioindikatoren für die Gesundheit von Ökosystemen. Traditionelle Monitoring-Methoden, wie manuelle Zählungen oder visuelle Erfassungen, sind jedoch extrem zeitaufwendig, personalintensiv und oft nur über kurze Zeiträume oder in begrenzten Gebieten durchführbar. Dies führt zu erheblichen Datenlücken, die eine präzise Bewertung von Populationsentwicklungen und die Wirksamkeit von Schutzmaßnahmen erschweren. Insbesondere für bürgerwissenschaftliche Projekte, die auf Freiwilligenarbeit basieren, stellen die Anforderungen an Fachwissen und Zeit erhebliche Hürden dar.

## Die Amélie-Lösung: 'Amphibien-Melder'
Der 'Amphibien-Melder' ist ein quelloffenes, kostengünstiges Hardware- und Software-System, das speziell für die passive akustische Überwachung von Amphibienarten im Rahmen der Bürgerwissenschaft entwickelt wurde. Das Projekt ermöglicht es Universitäten, Gemeinden und NGOs, mit geringem Budget ein Netzwerk von automatischen 'Lauschposten' einzurichten. 

### Funktionsweise:
1.  **DIY-Hardware:** Basierend auf gängigen Mikrocontrollern (z.B. ESP32, Raspberry Pi Pico W) und einem einfachen Mikrofon wird ein robuster, wetterfester Sensor gebaut. Die Bauanleitung ist leicht verständlich und für Bildungszwecke konzipiert.
2.  **Lokale KI-Erkennung (TinyML):** Auf dem Mikrocontroller läuft ein optimiertes Machine-Learning-Modell (TinyML), das in Echtzeit die charakteristischen Rufe spezifischer Amphibienarten (z.B. Grasfrosch, Erdkröte, Laubfrosch) erkennt. Die Erkennung erfolgt direkt auf dem Gerät, was den Energieverbrauch minimiert und Datenschutzbedenken reduziert.
3.  **Datenübertragung:** Bei einer positiven Erkennung werden Metadaten (Zeitstempel, erkannte Art, Konfidenzwert, Gerätekennung und GPS-Position) über eine energieeffiziente Verbindung (z.B. LoRaWAN oder WLAN) an eine zentrale Datenbank oder eine lokale Sammelstelle gesendet. Optional kann ein kurzes Audiosegment zur Verifizierung gespeichert werden.
4.  **Web-Dashboard:** Ein einfaches Web-Interface visualisiert die gesammelten Daten auf einer Karte und ermöglicht es Bürgerwissenschaftlern, die Ergebnisse zu überprüfen und weitere Beobachtungen hinzuzufügen.

## Technologische Basis
*   **Hardware:** ESP32 / Raspberry Pi Pico W, MEMS-Mikrofon, Power-Management, wetterfestes Gehäuse (3D-druckbar).
*   **Firmware:** MicroPython / C++ (Arduino-Framework) mit TensorFlow Lite for Microcontrollers (TinyML).
*   **ML-Modell:** Konvolutionale Neuronale Netze (CNN) trainiert auf öffentlich verfügbaren Amphibienruf-Datensätzen.
*   **Datenübertragung:** LoRaWAN (für ländliche Gebiete) oder WLAN (für städtische/halburbane Gebiete).
*   **Backend/Frontend:** Python (FastAPI/Django) / JavaScript (React/Vue) für das Dashboard.

## Anwendungsfälle & Nutzen
*   **Bürgerwissenschaft:** Schulen, Umweltgruppen und engagierte Bürger können aktiv am Monitoring teilnehmen, eigene Geräte bauen und betreiben.
*   **Naturschutzbehörden:** Erhalten kontinuierliche und flächendeckende Daten zur Populationsentwicklung und Verbreitung von Amphibien. Dies ermöglicht eine zielgerichtete Planung von Schutzmaßnahmen.
*   **Bildung:** Das Bauen und Programmieren des Amphibien-Melders bietet eine praktische Einführung in Elektronik, Programmierung und Umweltschutz.
*   **Früherkennung:** Lokalisierung von Hotspots und Erkennung von Populationstrends, um schnell auf Veränderungen reagieren zu können.

Der 'Amphibien-Melder' transformiert das passive akustische Monitoring in ein zugängliches, gemeinschaftsgetriebenes Werkzeug, das entscheidende Daten für den Amphibienschutz liefert und das Umweltbewusstsein fördert.