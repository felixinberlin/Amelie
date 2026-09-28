# Bürgerplan-Delta: Interaktiver Stadtplanungs-Diff-Editor

## Problemstellung
Die Bürgerbeteiligung in der Stadtplanung, insbesondere bei der Aufstellung von Bebauungsplänen, ist oft ein Prozess, der von Reibung und Ineffizienz geprägt ist. Aktuelle Methoden erfordern von Bürgern, komplexe technische Pläne zu interpretieren und schriftliche Stellungnahmen abzugeben. Diese Stellungnahmen sind für die Verwaltungen oft schwer zu aggregieren, räumlich zu verorten und systematisch in die digitalen Planungsdokumente zu integrieren. Dies führt zu einer "Enforcement Gap", bei der zwar Input gesammelt wird, dessen effektive Verarbeitung und sichtbare Wirkung jedoch begrenzt bleibt. Die Asymmetrie liegt darin, dass Bürger unstrukturierte Informationen liefern, die von der Verwaltung in strukturierte Pläne überführt werden müssen – ein aufwändiger und fehleranfälliger Prozess.

## Die Amélie-Lösung: Asymmetrische Inversion
"Bürgerplan-Delta" invertiert diesen Prozess. Anstatt schriftliche Kommentare zu einem statischen Plan abzugeben, können Bürgerinnen und Bürger direkt auf einer digitalen Karte (basierend auf den offiziellen Planungsdaten als GeoJSON-Layern) ihre Änderungsvorschläge einzeichnen. Das Tool erfasst diese Änderungen als "Delta" oder "Diff" zwischen dem offiziellen Planungsstand und dem Bürgervorschlag.

### Kernfunktionen:
1.  **Interaktiver Karten-Editor:** Basierend auf einem Web-GIS (z.B. Leaflet/Mapbox GL JS) können offizielle GeoJSON-Layer (z.B. Flächennutzungspläne, Bebauungspläne) geladen werden.
2.  **Zeichenwerkzeuge:** Bürger können neue Geometrien (Punkte, Linien, Polygone) hinzufügen, bestehende Geometrien bearbeiten (verschieben, skalieren, Attribute ändern) oder löschen.
3.  **Attribut-Editor:** Einfache Formulare ermöglichen das Hinzufügen oder Ändern von planerischen Attributen (z.B. "Wohngebiet", "Grünfläche", "Geschosshöhe").
4.  **Diff-Generierung:** Das System berechnet automatisch einen "Delta"-Datensatz (ähnlich einem Git-Diff) zwischen dem ursprünglichen offiziellen GeoJSON und der vom Bürger vorgenommenen Änderung. Dieser Diff ist maschinenlesbar und enthält nur die vorgenommenen Modifikationen.
5.  **Versionsverwaltung:** Jeder Bürgervorschlag wird als separate Version gespeichert und kann mit Kommentaren versehen werden.
6.  **Visualisierung von Deltas:** Die Verwaltung kann alle eingereichten Deltas visualisieren, aggregieren und potenzielle Konflikte oder häufige Vorschläge leicht identifizieren.

## Technischer Ansatz
Das Frontend basiert auf modernen Web-Technologien (TypeScript, React/Vue/Svelte) mit einer Kartenbibliothek wie Leaflet oder Mapbox GL JS und Zeichenerweiterungen (z.B. Leaflet.draw). Die Speicherung der GeoJSON-Daten und der Deltas erfolgt in einer PostgreSQL/PostGIS-Datenbank. Die Diff-Generierung kann serverseitig (z.B. mit Python/shapely oder Go/gdal) oder clientseitig (mit JavaScript-Bibliotheken für GeoJSON-Vergleiche) realisiert werden. Eine einfache Authentifizierung ermöglicht es, Vorschläge bestimmten Nutzern zuzuordnen.

## Vorteile
*   **Bürger:** Ermöglicht intuitive, präzise und visuelle Beteiligung; vereinfacht die Kommunikation komplexer Ideen.
*   **Verwaltung:** Erhält strukturierte, räumlich verortete und maschinenlesbare Eingaben; reduziert den manuellen Aufwand der Datenintegration und -analyse; ermöglicht eine transparentere Dokumentation des Beteiligungsprozesses.
*   **Transparenz:** Macht sichtbar, wie Vorschläge eingereicht werden und welche Auswirkungen sie potenziell auf den Plan haben könnten.