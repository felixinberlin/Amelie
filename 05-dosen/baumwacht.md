# Baumwacht: Satellitenbasierte Überwachung von Baumschutzsatzungen

## Problemstellung
Städtische Baumschutzsatzungen sind essenziell für den Erhalt des Grüns in unseren Städten. Sie schützen Bäume vor Fällung, Beschädigung oder Rodung, die ohne Genehmigung stattfinden könnten. Doch die Überwachung dieser Satzungen ist eine Mammutaufgabe für Kommunen und Umweltämter. Personelle Ressourcen sind begrenzt, und illegale Baumfällungen oder Baumaßnahmen, die Bäume schädigen, bleiben oft unentdeckt oder werden erst gemeldet, wenn der Schaden bereits irreversibel ist. Dies führt zu einer asymmetrischen Situation: Die Durchsetzung der Satzung ist schwerfällig und reaktiv, während Verstöße oft unbemerkt und proaktiv geschehen.

## Die Amélie-Lösung: Baumwacht
Baumwacht ist ein Open-Source-Tool, das diese Asymmetrie umkehrt. Es nutzt öffentlich verfügbare Satellitendaten (z.B. Sentinel-2, Landsat oder kommerzielle Anbieter mit entsprechenden Lizenzen für Non-Profit-Nutzung), um Veränderungen in der Baumkronendichte über die Zeit zu erkennen. Diese Veränderungen werden dann mit den Geodaten von geschützten Baumstandorten und den jeweiligen Baumschutzsatzungen einer Kommune abgeglichen.

### Funktionsweise:
1.  **Satellitendaten-Analyse**: Regelmäßiger Abruf und Verarbeitung von Satellitenbildern für definierte Überwachungsgebiete.
2.  **Veränderungserkennung**: Einsatz von Machine-Learning-Algorithmen zur Identifizierung signifikanter Veränderungen der Baumkronen (z.B. Verlust durch Fällung, Beschädigung oder Neupflanzung).
3.  **Abgleich mit Schutzsatzungen**: Überlagerung der erkannten Veränderungen mit digitalisierten Baumkatastern und Zonen, die unter Baumschutzsatzungen fallen.
4.  **Priorisierung und Alarmierung**: Potenzielle Verstöße werden nach Schutzstatus des Baumes und Ausmaß der Veränderung priorisiert und in einer interaktiven Karte visualisiert. Bei kritischen Veränderungen können automatische Benachrichtigungen ausgelöst werden.
5.  **Bürgerbeteiligung & Verifizierung**: Eine Webplattform ermöglicht es Bürgern, potenzielle Verstöße zu verifizieren (z.B. durch Vor-Ort-Besuche und Fotos) und strukturierte Meldungen direkt an die zuständigen Umweltämter zu senden. Dies kann auch die Möglichkeit umfassen, Genehmigungen für Baumfällungen zu hinterlegen, um Falschmeldungen zu vermeiden.
6.  **Beweissicherung**: Automatische Bereitstellung von Vorher-/Nachher-Bildern und Geodaten als Grundlage für behördliche Prüfungen und mögliche Sanktionen.

## Civic Impact (Bürgerlicher Nutzen)
*   **Effektiver Umweltschutz**: Proaktive Erkennung schützt den Baumbestand und damit die städtische Biodiversität, das Mikroklima und die Luftqualität.
*   **Transparenz & Rechenschaftspflicht**: Macht die Einhaltung von Baumschutzsatzungen transparenter und erhöht die Rechenschaftspflicht bei Verstößen.
*   **Bürgerliches Engagement**: Ermöglicht Bürgern, aktiv am Schutz ihrer lokalen Umwelt teilzuhaben und als 'Augen und Ohren' der Stadt zu fungieren.
*   **Ressourceneffizienz für Kommunen**: Entlastet Umweltämter von routinemäßigen Überwachungsaufgaben und ermöglicht es ihnen, sich auf die Bearbeitung bestätigter Verstöße zu konzentrieren.
*   **Datenbasierte Entscheidungen**: Liefert wertvolle Daten über die Entwicklung des Baumbestandes und die Wirksamkeit von Schutzmaßnahmen.

## Technische Details
Das Projekt würde auf einem modernen Webstack basieren, der Python (für Geodatenverarbeitung und ML-Modelle), TypeScript/JavaScript (für Frontend und Backend-APIs) und PostGIS/PostgreSQL für die Speicherung der Geodaten verwendet. Der Einsatz von Open-Source-Bibliotheken wie GDAL, Rasterio, Scikit-learn und Turf.js ist vorgesehen. Die Benutzeroberfläche würde als interaktive Karte mit Filtermöglichkeiten und Reporting-Funktionen umgesetzt.