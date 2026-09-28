# Geo-Delta-Audit: Git-ähnliche Revisionsverfolgung für Geodaten

## Vision
Das "Geo-Delta-Audit" ist ein Open-Source-Werkzeug, das die Prinzipien der Versionskontrolle, insbesondere des `git-diff`-Algorithmus, auf Geodaten anwendet. Es ermöglicht Universitäten, Kommunen und NGOs, Änderungen an raumbezogenen Datensätzen (wie Stadtplänen, Flächennutzungsplänen, Katasterdaten oder Umweltdaten) präzise zu verfolgen, zu visualisieren und zu auditieren. Ziel ist es, die Transparenz in Planungsprozessen zu erhöhen, Fehler zu reduzieren und die Bürgerbeteiligung durch verständliche Änderungsberichte zu fördern.

## Das Problem
Städtische Planungsämter, Umweltschutzorganisationen und Forschungseinrichtungen arbeiten ständig mit Geodaten, die sich über die Zeit ändern. Die manuelle Identifizierung und Dokumentation dieser Änderungen – sei es eine geänderte Grundstücksgrenze, eine neue Bauzone oder die Verschiebung einer Grünfläche – ist extrem zeitaufwändig, fehleranfällig und intransparent. Bei öffentlichen Auslegungen von Bebauungsplänen ist es oft schwierig, den Bürgern klar und deutlich zu vermitteln, *was genau* sich gegenüber einer früheren Version geändert hat, da übliche GIS-Systeme oft nur Side-by-Side-Vergleiche oder Überlagerungen erlauben, die keine echten "Deltas" hervorheben.

## Die Lösung: Analogous Collision "Git Diff" + "Geodaten"
Das Geo-Delta-Audit nimmt zwei Versionen eines Geodatensatzes (z.B. GeoJSON-Dateien oder Exporte aus einer PostGIS-Datenbank) und erzeugt einen detaillierten Änderungsbericht, ähnlich wie `git diff` für Code. Dieser Bericht identifiziert:

*   **Hinzugefügte Features:** Neue Punkte, Linien oder Polygone (z.B. ein neues Gebäude, eine neue Straße).
*   **Entfernte Features:** Gelöschte raumbezogene Objekte (z.B. ein abgerissenes Gebäude, eine aufgehobene Zone).
*   **Modifizierte Features:** Objekte, deren Geometrie (z.B. eine veränderte Grundstücksform) oder Attribute (z.B. die Höhe eines Gebäudes, die Nutzung einer Fläche) sich geändert haben.

Das Tool kann diese Änderungen sowohl als maschinenlesbaren Report (z.B. als separates GeoJSON mit Änderungs-Metadaten) als auch visuell aufbereiten, um sie für Fachleute und Laien gleichermaßen verständlich zu machen.

## Zielinstitution und Anwendungsfälle
*   **Senatsverwaltung für Stadtentwicklung, Bauen und Wohnen Berlin:** Zur transparenten Verfolgung von Änderungen an Bebauungsplänen, Flächennutzungsplänen und anderen raumrelevanten Daten. Ideal für die Vorbereitung von öffentlichen Auslegungen.
*   **Umweltämter:** Zur Überwachung von Landnutzungsänderungen, der Ausdehnung von Schutzgebieten oder der Entwicklung von Biotopen.
*   **Universitäten und Forschungseinrichtungen:** Für die Analyse historischer Stadtentwicklung, die Verfolgung von Infrastrukturprojekten oder die Validierung von Crowdsourcing-Geodaten.
*   **NGOs und Bürgerinitiativen:** Um vorgeschlagene Planänderungen schnell zu verstehen und fundierte Stellungnahmen abzugeben.

## Technische Umsetzung (Idee)
Das Tool könnte in TypeScript entwickelt werden und auf bewährte Open-Source-Geodatenbibliotheken wie GDAL/OGR für den Datenimport/-export, Turf.js oder JSTS für geometrische Operationen und Diff-Algorithmen setzen. Die Ausgabe könnte ein GeoJSON-Diff-Format, ein interaktiver Web-Viewer (z.B. mit Leaflet/Mapbox GL JS) oder ein generierter PDF-Bericht sein.

## Impact & Nutzen
*   **Erhöhte Transparenz:** Bürgern und Interessengruppen wird klar aufgezeigt, was sich in einem Planungsdokument geändert hat.
*   **Verbesserte Auditierbarkeit:** Jede Änderung an einem Geodatensatz wird nachvollziehbar.
*   **Effizienzsteigerung:** Automatisierung des Änderungsvergleichs spart Zeit und reduziert manuelle Fehler.
*   **Datenqualität:** Fördert eine präzisere und versionierte Datenpflege in der Verwaltung.