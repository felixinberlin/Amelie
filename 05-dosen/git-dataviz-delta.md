# Git DataViz Delta: Semantische und Visuelle Unterschiede für Nicht-Code-Assets

## Problemstellung
Universitäten, NGOs und Stadtverwaltungen nutzen zunehmend Git und GitHub zur Versionierung nicht-code-basierter Assets wie Forschungsdaten (CSV, JSON), Policy-Dokumente (Markdown, YAML), Geodaten (GeoJSON) oder Konfigurationsdateien. Standard-Git-Diffs sind für diese Dateitypen jedoch oft unzureichend, da sie zeilenbasierte Textunterschiede anzeigen, anstatt die *semantischen* Änderungen im Dateninhalt oder visuelle Unterschiede in Diagrammen oder Karten hervorzuheben. Dies führt zu mangelnder Transparenz, erschwert die Zusammenarbeit und kann zu inkonsistenten Datenständen führen, da Änderungen nicht auf einen Blick nachvollziehbar sind.

## Projektidee: Git DataViz Delta
„Git DataViz Delta“ ist ein Open-Source-Tool, das semantische und visuelle Diff-Funktionen für gängige nicht-code-basierte Dateiformate in Git-Repositories bietet. Es soll Nutzern ermöglichen, Änderungen an Datensätzen, Dokumenten und Geodaten auf eine intuitive und aussagekräftige Weise zu verstehen.

### Kernfunktionen:
1.  **Semantische Diff-Engine**: Erkennung von Änderungen in strukturierten Daten (z.B. neue Zeilen/Spalten in CSV, geänderte Schlüssel/Werte in JSON/YAML, Änderungen an Features in GeoJSON). Nicht nur Textzeilen, sondern der *Inhalt* und die *Struktur* werden verglichen.
2.  **Visuelle Repräsentation**: Generierung von interaktiven HTML-Berichten oder Bildern, die die Unterschiede grafisch darstellen (z.B. hervorgehobene Änderungen in Datentabellen, Side-by-Side-Ansicht von JSON-Strukturen mit farbigen Markierungen, Überlagerung von GeoJSON-Änderungen auf einer Karte).
3.  **Git-Integration**: Kann als CLI-Tool, Pre-Commit-Hook, Post-Receive-Hook oder in CI/CD-Pipelines integriert werden, um automatisch Diff-Berichte zu generieren, wenn relevante Dateien geändert werden.
4.  **Unterstützte Formate (Initial)**: CSV, JSON, GeoJSON, YAML, Markdown (mit Fokus auf strukturelle Änderungen).

## Anwendungsfälle für Zielinstitutionen
*   **Universitäten (z.B. TU Berlin Open Science Lab)**: Forscher können Änderungen in ihren Datensätzen (z.B. Messreihen, Umfrageergebnisse) visuell nachvollziehen, was die Reproduzierbarkeit und Transparenz von Forschungsergebnissen verbessert. Ideal für Open Science Praktiken.
*   **NGOs (z.B. Open Knowledge Foundation Deutschland)**: Organisationen, die Open Data oder Policy-Dokumente versionieren, können Änderungen in ihren Datenpublikationen oder Gesetzesentwürfen leichter überprüfen und kommunizieren. Fördert die Nachvollziehbarkeit politischer Prozesse.
*   **Stadtverwaltungen (z.B. Senatsverwaltung Berlin für Stadtentwicklung)**: Für die Versionierung von Geodaten (z.B. Bebauungspläne, Baumkataster, Infrastrukturdaten) oder Open-Data-Portalen können Änderungen an den Datensätzen sofort visuell überprüft werden, was die Datenqualität sichert und die Kommunikation mit der Öffentlichkeit erleichtert.

## Technologischer Ansatz
Das Tool würde in TypeScript entwickelt und könnte bestehende Bibliotheken für Datenparsing (z.B. `papaparse` für CSV, `json-diff` für JSON) und Visualisierung (z.B. D3.js, Vega-Lite für Datenvisualisierungen, Leaflet/Mapbox GL JS für GeoJSON) nutzen. Die Ausgabe als HTML ermöglicht eine einfache Anzeige im Browser oder die Einbettung in Web-Anwendungen.

## Wirkung und Nachhaltigkeit
„Git DataViz Delta“ würde die Akzeptanz von Git für nicht-code-basierte Projekte in den Zielinstitutionen erheblich steigern. Es fördert Transparenz, verbessert die Datenqualität und erleichtert die Zusammenarbeit, indem es eine intuitive und verständliche Historie von Datenänderungen bereitstellt. Als Open-Source-Tool kann es von der Gemeinschaft erweitert und gepflegt werden, um neue Formate und Visualisierungen zu unterstützen.