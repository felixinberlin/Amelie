# Schema-Forge: Git-basiertes Versionsmanagement für öffentliche Daten-Schemata

## Kurzbeschreibung
Schema-Forge ist ein Amélie-Tool, das die Leistungsfähigkeit von Git auf die Versionskontrolle und transparente Evolution von strukturierten Daten-Schemata (z.B. JSON Schema, OpenAPI-Spezifikationen) und öffentlichen Dokumentenvorlagen anwendet. Es ermöglicht Universitäten, Kommunen und NGOs, Änderungen an ihren Datenstrukturen nachvollziehbar zu verfolgen, kollaborativ zu entwickeln und semantische Unterschiede klar zu kommunizieren, ähnlich wie Git Code-Änderungen verwaltet.

## Problemstellung
In der öffentlichen Verwaltung, Wissenschaft und Zivilgesellschaft werden zunehmend strukturierte Daten und Dokumente veröffentlicht, deren Schemata oder Vorlagen sich über die Zeit entwickeln müssen. Oft geschieht dies ad-hoc, ohne klare Versionskontrolle oder eine Möglichkeit, Änderungen transparent nachzuvollziehen. Dies führt zu:
*   **Dateninkonsistenzen:** Verbraucher öffentlicher Daten wissen nicht, wann und wie sich Datenschemata geändert haben.
*   **Reproduzierbarkeitsproblemen:** In der Forschung sind sich ändernde Datenmodelle schwer zu auditieren und nachzuvollziehen.
*   **Kollaborationshürden:** Die gemeinsame Entwicklung von Berichtsstandards oder Datenmodellen ist ohne ein robustes Werkzeug mühsam und fehleranfällig.
*   **Mangelnde Transparenz:** Bürger oder externe Partner können die Evolution von Datenstrukturen nicht einfach prüfen.

## Die Amélie-Lösung: Schema-Forge
Schema-Forge bietet eine Lösung, indem es die bewährten Prinzipien von Git – Versionskontrolle, Branching, Merging und Audit-Trails – auf die Verwaltung von Schemata und strukturierten Vorlagen überträgt. Es ist nicht nur ein 'Text-Diff-Tool', sondern versteht die *semantischen* Änderungen innerhalb eines Schemas (z.B. eine Eigenschaft wurde hinzugefügt, der Typ einer Eigenschaft geändert, ein Feld wurde erforderlich).

### Funktionsweise
1.  **Schema-Tracking:** Importiert und verwaltet Schemata (z.B. JSON Schema, YAML, XML-Schema) in einem Git-Repository.
2.  **Semantische Diff-Analyse:** Generiert verständliche Berichte über Änderungen zwischen verschiedenen Schema-Versionen, die über reine Zeilenunterschiede hinausgehen.
3.  **Branching & Merging für Schemata:** Ermöglicht die parallele Entwicklung von Schema-Versionen für zukünftige Anpassungen oder Experimente.
4.  **Auditierbarkeit:** Jede Schema-Änderung wird mit Autor, Zeitpunkt und Begründung in einem unveränderlichen Verlauf festgehalten.
5.  **API/CLI:** Bietet eine Schnittstelle zur Integration in bestehende Open-Data-Pipelines oder Entwicklungsworkflows.

## Technische Details
Schema-Forge wird als Open-Source-Tool entwickelt, vorzugsweise in TypeScript/JavaScript für breite Plattformkompatibilität. Es nutzt `git` als Backend für die Versionskontrolle. Die Kernfunktionalität umfasst:
*   **Schema-Parser:** Unterstützung für gängige Schemaformate (JSON Schema, OpenAPI, etc.).
*   **Diff-Algorithmen:** Implementierung von Algorithmen zur Erkennung semantischer Änderungen (z.B. property added/removed, type changed, constraint modified).
*   **Git-Integration:** Nahtlose Interaktion mit lokalen und Remote-Git-Repositories.
*   **Optionales Web-UI:** Eine einfache Benutzeroberfläche zur Visualisierung von Schema-Historien und Diffs.

## Potenzielle Anwendungsfälle
*   **Kommunale Open-Data-Portale:** Städte können die Evolution ihrer Datenschemata transparent machen und Nutzern ermöglichen, Änderungen zu abonnieren oder vergangene Versionen zu prüfen.
*   **Universitäre Forschung:** Forschungsgruppen können Datenmanagementpläne und Forschungsdatenschemata versionieren, um die Reproduzierbarkeit und Langzeitarchivierung zu gewährleisten.
*   **NGO-Berichtswesen:** NGOs, die komplexe Berichte mit strukturierten Daten an Förderer oder Regierungen übermitteln, können die zugrundeliegenden Berichtsstrukturen kollaborativ entwickeln und Änderungen formal verfolgen.
*   **Standardisierungsgremien:** Entwicklung und Pflege von offenen Datenstandards (z.B. für Mobilität, Umwelt) mit klarer Versionshistorie.

## Warum Amélie?
Schema-Forge ist ein Paradebeispiel für die Amélie-Initiative, da es eine robuste, bewährte Technologie (Git) auf ein ungelöstes Problem im zivilgesellschaftlichen Sektor anwendet. Es fördert Transparenz, stärkt die Datenqualität und ermöglicht eine effizientere, kollaborative Arbeit an kritischen Datenstrukturen, die für Universitäten, Kommunen und NGOs von entscheidender Bedeutung sind. Es ist ein Werkzeug, das die digitale Souveränität stärkt und die Grundlage für vertrauenswürdige öffentliche Daten legt.