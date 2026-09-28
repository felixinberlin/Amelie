```markdown
# Lizenz-Kompass für Offene Daten

## Projektübersicht
Der Lizenz-Kompass ist ein Open-Source-Werkzeug, das darauf abzielt, die Wiederverwendbarkeit von offenen Daten zu verbessern, indem es eine interaktive Visualisierung und Beratung zur Kompatibilität von Datenlizenzen bietet. Viele öffentliche Verwaltungen veröffentlichen Daten, aber die rechtlichen Rahmenbedingungen für deren Nutzung, insbesondere bei der Kombination verschiedener Datensätze, sind oft unklar. Dieses Werkzeug soll diese Lücke schließen, indem es sowohl Datenanbietern als auch -nutzern hilft, Lizenzen zu verstehen und korrekt anzuwenden.

## Problemstellung
Die Welt der offenen Daten ist komplex. Während viele Daten frei verfügbar sind, variieren die Lizenzen (z.B. Creative Commons, ODC-BY, Datenlizenz Deutschland) stark in ihren Anforderungen (Namensnennung, Weitergabe unter gleichen Bedingungen, Kommerzielle Nutzung etc.). Dies führt zu zwei Hauptproblemen:
1. **Für Datenanbieter (z.B. Kommunen, Behörden):** Unsicherheit bei der Auswahl der 'richtigen' Lizenz für neu veröffentlichte Datensätze, die den gewünschten Grad an Offenheit und Schutz bietet.
2. **Für Datennutzer (z.B. Forscher, NGOs, Startups):** Schwierigkeiten bei der Bewertung der rechtlichen Kompatibilität, wenn mehrere Datensätze mit unterschiedlichen Lizenzen kombiniert werden sollen. Dies hemmt die Entwicklung innovativer Anwendungen und Analysen.

## Zielgruppe
*   **Öffentliche Verwaltungen und Behörden:** Für die korrekte und konsistente Lizenzierung ihrer offenen Daten.
*   **Universitäten und Forschungseinrichtungen:** Für die Lizenzierung von Forschungsdaten und das Verständnis von Lizenzkompatibilitäten in interdisziplinären Projekten.
*   **NGOs und Zivilgesellschaftliche Organisationen:** Zur Bewertung der Wiederverwendbarkeit von Daten und zur Förderung einer besseren Datenpolitik.
*   **Entwickler und Datenanalysten:** Die offene Daten für Projekte und Anwendungen nutzen möchten.

## Funktionalitäten
1.  **Lizenz-Erkennung und -Analyse:** Ein Modul, das gängige Lizenzbezeichnungen erkennt und deren Kernmerkmale (z.B. Namensnennung, Share-Alike, kommerzielle Nutzung) extrahiert.
2.  **Interaktive Kompatibilitätsmatrix:** Eine visuelle Darstellung, welche Lizenzen miteinander kompatibel sind und welche Einschränkungen oder Auflagen bei der Kombination entstehen.
3.  **Lizenz-Wahlhelfer:** Ein geführter Prozess, der auf Basis von Nutzungsabsichten (z.B. "Muss Namensnennung erfolgen?", "Darf kommerziell genutzt werden?") passende Lizenzen vorschlägt.
4.  **Integration mit Datenportalen:** Eine API oder ein Plugin, um Lizenzinformationen direkt aus Open-Data-Portalen (z.B. CKAN-Instanzen) zu importieren und die Kompatibilität von Datensätzen eines Portals zu bewerten.
5.  **Bildungsressource:** Detaillierte Erklärungen zu jeder Lizenz und Best-Practice-Beispiele.

## Technischer Ansatz (MVP)
*   **Frontend:** Eine moderne Webanwendung (z.B. React/Vue/Svelte) für die interaktive Benutzeroberfläche und Datenvisualisierung.
*   **Backend/Logik:** TypeScript/JavaScript für die Kernlogik der Lizenzanalyse und Kompatibilitätsprüfung. Die Lizenzdaten und Kompatibilitätsregeln könnten in einer statischen JSON-Datei oder einer einfachen Datenbank abgelegt werden.
*   **Datenquellen:** Eine kuratierte Liste von Open-Data-Lizenzen (z.B. basierend auf SPDX, Creative Commons, GovData-Standards) und deren Eigenschaften.

## Impact und Mehrwert
Der Lizenz-Kompass würde die Rechtssicherheit im Umgang mit offenen Daten drastisch erhöhen. Er würde nicht nur die Wiederverwendung von Daten erleichtern, sondern auch die Qualität der Lizenzierung bei der Veröffentlichung verbessern. Dies führt zu einer effizienteren Nutzung öffentlicher Ressourcen und fördert Innovationen, die auf offenen Daten basieren.

## Nächste Schritte
*   Detaillierte Analyse der gängigsten Open-Data-Lizenzen in Deutschland und Europa.
*   Entwicklung eines Prototyps für die Kompatibilitätsmatrix.
*   Zusammenarbeit mit Rechtsexperten für Open Data und der Open Knowledge Foundation Deutschland.

```