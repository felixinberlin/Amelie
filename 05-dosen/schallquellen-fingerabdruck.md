# Schallquellen-Fingerabdruck für urbane Akustik

## Problemstellung
Die Lärmbelastung in urbanen Gebieten stellt ein erhebliches Gesundheitsrisiko dar und mindert die Lebensqualität. Aktuelle Lärmkarten basieren oft auf Modellrechnungen oder wenigen Messpunkten, die primär den Dezibel-Pegel erfassen. Was fehlt, ist ein tiefgreifendes Verständnis der *Quellen* des Lärms. Es ist ein großer Unterschied, ob ein hoher Pegel durch gleichmäßigen Verkehr oder durch sporadische, besonders laute Ereignisse (z.B. Baulärm, Motorräder, spezielle Industrieanlagen) verursacht wird. Ohne diese spezifische Quellenzuordnung sind gezielte Lärmschutzmaßnahmen schwierig zu entwickeln und umzusetzen.

## Die Amélie-Idee: Schallquellen-Fingerabdruck
Das Tool „Schallquellen-Fingerabdruck für urbane Akustik“ (oder kurz: „Akustik-Fingerabdruck Stadt“) ist ein quelloffenes System zur automatisierten Erkennung und Klassifizierung spezifischer urbaner Geräuschquellen aus akustischen Rohdaten. Es nutzt verteilte, kostengünstige Sensornetzwerke (z.B. auf Basis von Raspberry Pi mit Mikrofonen) oder bürgerwissenschaftliche Beiträge, um Audioaufnahmen zu sammeln. Mittels fortgeschrittener Signalverarbeitung und maschinellem Lernen (z.B. tiefe neuronale Netze für akustische Ereigniserkennung) werden einzigartige „akustische Fingerabdrücke“ von Geräuschquellen identifiziert und kartiert. Dies ermöglicht es, nicht nur *wo* es laut ist, sondern auch *was* den Lärm verursacht, präzise zu verorten und zu visualisieren.

### Funktionsweise
1.  **Datenerfassung**: Audioaufnahmen von dezentralen Sensoren oder mobilen Geräten.
2.  **Vorverarbeitung**: Filterung, Normalisierung und Extraktion relevanter akustischer Merkmale (z.B. Mel-Frequenz-Cepstral-Koeffizienten, Spektrogramme).
3.  **Klassifikation**: Anwendung eines trainierten Machine-Learning-Modells zur Identifizierung und Kategorisierung von Geräuschquellen (z.B. „Lkw“, „Pkw“, „Motorrad“, „Bauarbeiten“, „Sprache“, „Vogelgezwitscher“).
4.  **Georeferenzierung & Visualisierung**: Zuordnung der klassifizierten Ereignisse zu geografischen Koordinaten und Darstellung auf einer interaktiven Karte, eventuell mit zeitlicher Auflösung.

## Zielgruppen und Nutzen
*   **Kommunen und Umweltämter**: Ermöglicht die Entwicklung zielgerichteter Lärmschutzstrategien (z.B. Anpassung von Verkehrsführungen, Baustellenzeiten, Lärmschutzwänden basierend auf Verursachern).
*   **Universitäten und Forschungseinrichtungen**: Bietet eine Plattform für die Erforschung urbaner Klanglandschaften und die Weiterentwicklung von Akustik-KI-Modellen.
*   **NGOs und Bürgerinitiativen**: Stellt empirische Daten zur Verfügung, um lokale Lärmprobleme zu untermauern und politische Entscheidungen einzufordern.

## Technologische Basis
Das Tool soll auf modernen Open-Source-Technologien basieren: Python für Machine Learning (TensorFlow/PyTorch), TypeScript für die Web-Anwendung (Frontend), PostGIS für die Geodatenbank und containerisierte Bereitstellung (Docker).

## Vision
Der „Schallquellen-Fingerabdruck“ soll zu einem Standardwerkzeug für ein datengestütztes Lärmmanagement in Städten werden, das über reine Dezibel-Messungen hinausgeht und so zu einer besseren Lebensqualität beiträgt.