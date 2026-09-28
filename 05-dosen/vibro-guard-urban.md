# VibroGuard: Städtisches Vibrationsüberwachungsnetzwerk

## Problemstellung: Asymmetrie und Reibung bei städtischen Vibrationen

Städtische Gebiete sind ständig Vibrationen ausgesetzt, die durch Bauarbeiten, Schwerlastverkehr, U-Bahnen und industrielle Aktivitäten verursacht werden. Diese Vibrationen können erhebliche Auswirkungen auf die Lebensqualität der Anwohner haben, von Schlafstörungen und Stress bis hin zu wahrgenommenen (und manchmal realen) Schäden an Gebäuden. Obwohl es in Deutschland Normen wie die DIN 4150-3 gibt, die Grenzwerte für Schwingungseinwirkungen auf Gebäude festlegen, ist die Überwachung dieser Grenzwerte oft intransparent und reaktiv. Projektentwickler und städtische Behörden verfügen möglicherweise über eigene Messdaten, die der Öffentlichkeit jedoch selten zugänglich gemacht werden. Dies führt zu einer erheblichen Informationsasymmetrie: Anwohner spüren die Auswirkungen, haben aber keine objektiven, überprüfbaren Daten, um ihre Beschwerden zu untermauern oder die Einhaltung von Vorschriften einzufordern. Diese Reibung schwächt die bürgerschaftliche Teilhabe und die effektive Durchsetzung von Umwelt- und Baustandards.

## Die Amélie-Lösung: VibroGuard – Bürgerwissenschaft für Vibrationsdaten

VibroGuard ist ein dezentrales, quelloffenes Vibrationsüberwachungsnetzwerk, das darauf abzielt, diese Informationsasymmetrie umzukehren. Es ermöglicht Universitäten, Bürgerinitiativen und NGOs, kostengünstige Sensorknotenpunkte in betroffenen Gebieten zu installieren, um Vibrationsdaten in Echtzeit zu sammeln und zu visualisieren. Durch die Bereitstellung zugänglicher und überprüfbarer Daten versetzt VibroGuard die Bürger in die Lage, fundierte Gespräche mit Behörden und Bauträgern zu führen und die Einhaltung von Vorschriften einzufordern.

### Funktionsweise:
1.  **Kostengünstige Sensorknoten:** Basierend auf Open-Source-Hardware (z.B. ESP32 oder Raspberry Pi Zero) und MEMS-Beschleunigungssensoren (z.B. ADXL345, LIS3DH), die Vibrationen in drei Achsen erfassen können.
2.  **Datenübertragung:** Die Sensorknoten übertragen die gesammelten Rohdaten (z.B. Beschleunigungswerte) über drahtlose Netzwerke (WLAN, LoRaWAN) an eine zentrale Plattform.
3.  **Datenverarbeitung und -speicherung:** Eine Open-Source-Backend-Infrastruktur (z.B. MQTT für Nachrichten, PostgreSQL/TimescaleDB für Daten, Python/Node.js für Verarbeitung) empfängt, speichert und verarbeitet die Rohdaten zu aussagekräftigen Metriken (z.B. Effektivwert der Schwinggeschwindigkeit, Frequenzanalyse).
4.  **Visualisierung und Analyse:** Eine benutzerfreundliche Weboberfläche (z.B. basierend auf Grafana oder einer benutzerdefinierten Vue.js/React-Anwendung) visualisiert die Vibrationsdaten in Echtzeit und historisch. Sie ermöglicht den Vergleich mit relevanten Normen (z.B. DIN 4150-3 Grenzwerte für verschiedene Gebäudetypen und Frequenzen).
5.  **Benachrichtigungsfunktion:** Automatische Benachrichtigungen können ausgelöst werden, wenn definierte Vibrationsschwellen überschritten werden.

## Physikalische Grundlagen und Relevanz

VibroGuard basiert auf den physikalischen Prinzipien der Schwingungslehre und Mechanik. Die Messung von Beschleunigung, Geschwindigkeit und Auslenkung von Schwingungen ist entscheidend. Insbesondere der Effektivwert der Schwinggeschwindigkeit (RMS velocity) ist eine wichtige Größe zur Beurteilung von Schwingungseinwirkungen auf Bauwerke gemäß DIN 4150-3. Das Tool ermöglicht die Erfassung dieser physikalischen Größen und deren Kontextualisierung im Hinblick auf normative Grenzwerte.

## Zielgruppen und Anwendungsfälle

*   **Bürgerinitiativen und Anwohner:** Zur Dokumentation von Vibrationseinwirkungen und als Argumentationshilfe gegenüber Behörden und Bauträgern.
*   **Stadtplanungs- und Umweltämter:** Als ergänzendes Monitoring-Tool zur Überprüfung der Einhaltung von Vorschriften und zur datengestützten Entscheidungsfindung.
*   **Universitäten und Forschungseinrichtungen:** Für Studien zu städtischen Schwingungsquellen, deren Ausbreitung und Auswirkungen auf Infrastruktur und Mensch.
*   **NGOs im Bereich Denkmalschutz:** Zur Überwachung von Vibrationen in der Nähe historischer Gebäude.

## Auswirkungen und Wertschöpfung

VibroGuard schafft Transparenz und gleicht die Informationsasymmetrie aus. Es ermöglicht eine proaktivere und datengestützte Bürgerbeteiligung, verbessert die Durchsetzung von Umweltstandards und fördert eine verantwortungsvollere Stadtentwicklung. Die offene Natur der Hardware und Software gewährleistet Vertrauen und Reproduzierbarkeit der Messungen, was für die Akzeptanz in der Zivilgesellschaft entscheidend ist.

## Technologische Verankerung

Das Projekt würde auf bewährten Open-Source-Technologien aufbauen, die eine hohe Wartbarkeit und Erweiterbarkeit gewährleisten. Die Hardware ist leicht zugänglich und kostengünstig. Die Softwarearchitektur ist modular, um Anpassungen an spezifische Bedürfnisse zu ermöglichen.