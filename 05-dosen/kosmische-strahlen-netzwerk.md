# Amélie-CosmicFlow: Offenes Netzwerk für Kosmische Strahlung

## Problemstellung
Die Detektion und Analyse von kosmischer Strahlung bietet faszinierende Einblicke in fundamentale Physik, Astrophysik und sogar die Weltraumwettervorhersage. Aktuelle Projekte zur Messung kosmischer Strahlung sind oft teuer, proprietär oder erfordern spezialisiertes Fachwissen für Aufbau und Datenanalyse. Für Universitäten, Schulen und Citizen Scientists ist es eine Herausforderung, eigene Detektoren zu betreiben und die gewonnenen Daten in einem größeren Kontext zu teilen und zu visualisieren. Es fehlt eine zugängliche, einheitliche Open-Source-Plattform, die sowohl den Aufbau einfacher Detektoren als auch die Aggregation und Visualisierung der Daten ermöglicht.

## Die Amélie-Lösung: CosmicFlow
Amélie-CosmicFlow ist ein Open-Source-Ökosystem, das es Bildungseinrichtungen, Forschungsgruppen und interessierten Bürgern ermöglicht, kostengünstige, DIY-Kosmische-Strahlung-Detektoren zu bauen und in ein globales Netzwerk zu integrieren. Die Lösung besteht aus:

1.  **Hardware-Bauplan:** Detaillierte Anleitungen für den Bau eines Detektors auf Basis von Standardkomponenten (z.B. Raspberry Pi, Geigerzähler oder Szintillationsdetektor mit Photomultiplier).
2.  **Embedded Software:** Eine Open-Source-Software für den Raspberry Pi, die Sensordaten ausliest, vorverarbeitet und sicher an einen zentralen oder föderierten Datenserver sendet.
3.  **Daten-Aggregationsplattform:** Ein Backend-System, das die Daten von allen angeschlossenen Detektoren sammelt, speichert und für die Analyse aufbereitet.
4.  **Interaktive Visualisierung:** Eine Webanwendung, die die globalen und lokalen Datenströme in Echtzeit auf einer Karte darstellt, zeitliche Verläufe zeigt und grundlegende Analysen ermöglicht (z.B. Korrelation mit Sonnenaktivität).

## Technischer Ansatz
*   **Hardware:** Raspberry Pi (oder vergleichbarer Einplatinencomputer), Geiger-Müller-Zählrohr (z.B. SBM-20) oder Szintillationsdetektor, ADC-Wandler.
*   **Embedded Software:** Python oder MicroPython auf dem Raspberry Pi, MQTT für die Datenübertragung.
*   **Backend:** FastAPI (Python) oder Node.js/Express für die API, PostgreSQL/TimescaleDB für die Datenhaltung.
*   **Frontend:** React/Vue.js mit Mapbox GL JS oder OpenLayers für die Kartenvisualisierung, D3.js oder Chart.js für Diagramme.
*   **Containerisierung:** Docker für einfache Bereitstellung.

## Zielgruppe und Impact
*   **Universitäten:** Für Lehre (experimentelle Physik, Datenanalyse) und Forschung (Verteilung kosmischer Strahlung, Weltraumwetter).
*   **Schulen:** MINT-Projekte, die Schüler für Physik und Informatik begeistern.
*   **Citizen Scientists / Astronomievereine:** Aktive Teilnahme an wissenschaftlicher Datenerfassung und -analyse.

Der Impact liegt in der Demokratisierung der Forschung an kosmischer Strahlung, der Förderung von MINT-Fächern und der Schaffung einer einzigartigen, globalen Open-Source-Datenbank für atmosphärische und astrophysikalische Phänomene.