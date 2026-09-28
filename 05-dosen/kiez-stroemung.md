# Kiez-Strömung: Mikroklima- und Schadstoffausbreitungsmodellierer

## Problemstellung
Die Luftqualität und das Mikroklima in urbanen Gebieten variieren stark auf lokaler Ebene. Traditionelle Messstationen sind oft zu weit voneinander entfernt, um diese "Mikroklimazonen" – wie etwa Straßenschluchten, Innenhöfe oder Parks – detailliert abzubilden. Die komplexen Wechselwirkungen von Gebäuden, Vegetation und Topografie beeinflussen Windströmungen, Temperaturverteilung und die Ausbreitung von Luftschadstoffen wie Feinstaub (PM2.5) oder Stickoxiden (NOx) erheblich. Bestehende Citizen-Science-Initiativen sammeln zwar wertvolle Sensordaten, diesen fehlt jedoch oft der Kontext eines physikalischen Modells, um die gemessenen Werte in ein umfassendes Verständnis der lokalen Umweltauswirkungen zu übersetzen. Für Stadtplaner, Umweltämter und Bürger*innen ist es schwierig, fundierte Entscheidungen zur Verbesserung der Umweltbedingungen zu treffen, ohne ein klares Bild dieser hyperlokalen Dynamiken zu haben.

## Lösungsidee: Kiez-Strömung
"Kiez-Strömung" ist ein Open-Source-Tool, das lokale Umweltdaten (z.B. von Citizen-Science-Sensoren, OpenStreetMap-Gebäudedaten) mit vereinfachten physikalischen Modellen zur Strömungsmechanik (Computational Fluid Dynamics, CFD) kombiniert. Ziel ist es, interaktive Simulationen und Visualisierungen von Windströmungen, Temperaturverteilungen und der Ausbreitung von Luftschadstoffen auf Quartiersebene (Kiez) zu ermöglichen.

### Kernfunktionen
1.  **Datenintegration**: Aggregation von Sensordaten (z.B. PM2.5, Temperatur) aus verschiedenen Quellen (z.B. SenseBox, AirRohr, offizielle Messstationen).
2.  **Geometriedaten-Import**: Nutzung von OpenStreetMap-Daten für Gebäudegrundrisse, Höhenmodelle und Vegetationsinformationen zur Erstellung des Simulationsgebiets.
3.  **Vereinfachte CFD-Simulation**: Durchführung von schnellen, lokalisierbaren 2D- oder vereinfachten 3D-Strömungs- und Ausbreitungsmodellen, die die Wechselwirkung von Wind und Bebauung abbilden. Der Fokus liegt auf der Erkennung von Mustern und Hotspots, nicht auf hochpräzisen Forschungssimulationen.
4.  **Interaktive Visualisierung**: Darstellung der Simulationsergebnisse (z.B. Windvektoren, Schadstoffkonzentrationen, Temperaturkarten) in einer nutzerfreundlichen Web-Anwendung.
5.  **Szenario-Analyse**: Möglichkeit für Nutzer*innen, hypothetische Änderungen (z.B. neue Gebäude, Begrünung, Verkehrsberuhigung) zu simulieren und deren Auswirkungen auf das Mikroklima und die Luftqualität zu bewerten.

## Technologische Umsetzung (Konzept)
*   **Frontend**: Web-Anwendung mit interaktiven Karten (z.B. Mapbox GL JS, Leaflet) und Datenvisualisierungsbibliotheken (z.B. D3.js, deck.gl).
*   **Backend/Compute**: Serverseitige Verarbeitung für CFD-Berechnungen (z.B. in Python mit SciPy/NumPy, oder WASM-kompilierte C++/Fortran-Bibliotheken für lokale Ausführung). Nutzung von Cloud-Funktionen für skalierbare Berechnungen.
*   **Datenbank**: Speicherung von Sensordaten und Simulationsergebnissen.
*   **Geodaten**: Integration von OSM-APIs und anderen Geodaten-Diensten.

## Nutzen und Wirkung
*   **Für Bürger*innen**: Besseres Verständnis der Luftqualität und des Mikroklimas in ihrer direkten Umgebung; Identifizierung gesünderer Wege, Spielplätze oder Aufenthaltsorte; Beitrag zur lokalen Umweltforschung.
*   **Für Stadtplaner & Umweltämter**: Fundierte Entscheidungen bei der Planung von Neubauprojekten, Grünflächen, Verkehrsmaßnahmen; Bewertung der Umweltauswirkungen von Bauvorhaben; Identifizierung von Problemzonen und potenziellen Verbesserungen.
*   **Für NGOs/Forschung**: Plattform für die Integration und Analyse von Citizen-Science-Daten; Werkzeug für Umweltbildung und -kommunikation; Grundlage für weitere Forschung im Bereich urbane Klimamodellierung.

"Kiez-Strömung" schließt die Lücke zwischen punktuellen Messungen und großräumigen Modellen, indem es eine zugängliche, physikbasierte Analyse des urbanen Mikroklimas auf Nachbarschaftsebene ermöglicht.