# LabBook-Git: Wissenschaftliche Experiment- und Datenherkunftsverfolgung

## Problembeschreibung
Die Wissenschaft steht vor einer Reproduzierbarkeitskrise. Forschungsergebnisse sind oft schwer zu verifizieren, da die genauen Schritte, die zur Datengenerierung und -analyse führten, unzureichend dokumentiert sind. Manuelle Laborbücher und fragmentierte Dateiverwaltungssysteme bieten keine zuverlässige, versionierte Aufzeichnung von Experimentparametern, Datentransformationen und Code-Versionen. Dies führt zu einem Mangel an Transparenz, erschwert die Zusammenarbeit und behindert den Fortschritt der Open-Science-Bewegung.

## Lösungsidee: LabBook-Git
LabBook-Git ist ein Open-Source-Tool, das die Kernkonzepte von Git (Versionierung, Commits, Branches, Diffs) auf wissenschaftliche Experimente und Datenpipelines überträgt. Anstatt nur Code zu versionieren, ermöglicht LabBook-Git die systematische Verfolgung und Versionierung von:

1.  **Experimentellen Metadaten:** Parameter, Sensoreinstellungen, Probendetails.
2.  **Datenverarbeitungsschritten:** Skripte, Konfigurationen, Softwareversionen.
3.  **Abgeleiteten Daten:** Hashes der resultierenden Datensätze, um deren Integrität und Herkunft zu sichern.

Jede wichtige Änderung, jeder Experimentlauf oder jeder Verarbeitungsschritt wird als „Commit“ in einem Git-Repository festgehalten, ergänzt durch eine aussagekräftige Nachricht, die die vorgenommenen Änderungen und deren Kontext beschreibt. „Branches“ könnten verschiedene Hypothesen, Parameterstudien oder experimentelle Varianten repräsentieren. „Tags“ könnten verwendet werden, um publizierbare Datensätze oder Meilensteine zu markieren.

## Funktionsweise
-   **Repository-Struktur:** Ein Git-Repository speichert nicht die Rohdaten selbst (außer bei kleinen Dateien), sondern Metadaten, Konfigurationsdateien, Skripte und Verweise (z.B. Hashes, Pfade) auf große Datensätze. Git LFS (Large File Storage) könnte für mittelgroße Binärdateien verwendet werden.
-   **Befehlszeilen-Tool (CLI):** Ein benutzerfreundliches CLI ermöglicht Wissenschaftlern, Experimente zu initialisieren, Metadaten zu erfassen, Schritte zu „committen“ und den Verlauf ihrer Arbeit zu durchsuchen.
-   **Datenintegrität:** Durch das Hashing von Datendateien kann LabBook-Git sicherstellen, dass die Daten, auf die sich ein Commit bezieht, unverändert sind. Jede Änderung würde einen neuen Hash und damit einen neuen Commit erfordern.
-   **Visualisierung:** Eine optionale Web-Oberfläche könnte den „Stammbaum“ eines Experiments visualisieren, ähnlich wie `git log --graph`.

## Institutioneller Nutzen (TU Berlin Open Science Lab)
Das TU Berlin Open Science Lab könnte LabBook-Git als Kernkomponente zur Förderung von Open Science und reproduzierbarer Forschung einsetzen. Es würde die Transparenz von Forschungsprojekten erheblich verbessern, die Zusammenarbeit erleichtern und den Nachweis der Datenherkunft für Publikationen und Förderanträge vereinfachen. Es dient als praktisches Werkzeug, um die Prinzipien der FAIR-Daten (Findable, Accessible, Interoperable, Reusable) zu operationalisieren.

## Technologische Basis
-   **Frontend:** TypeScript (CLI, ggf. Web-UI mit React/Vue)
-   **Backend/Core Logic:** Node.js oder Python (für Git-Interaktion und Dateisystem-Operationen)
-   **Versionskontrolle:** Git (als Backend)
-   **Datenbank (optional):** SQLite für Metadaten-Indizierung und schnelle Abfragen.