# Haushaltslupe: Differentialanalyse kommunaler Haushaltspläne und Nachtragshaushalte

## Problemstellung
Kommunale Haushalte sind die finanziellen Blaupausen unserer Städte und Gemeinden. Sie legen fest, wie öffentliche Gelder gesammelt und ausgegeben werden. Doch für Bürger, Journalisten und sogar für NGOs ist es oft extrem schwierig, diese komplexen Dokumente zu verstehen, geschweige denn, Änderungen über die Zeit oder zwischen verschiedenen Planungsständen (z.B. dem ursprünglichen Haushaltsplan und nachfolgenden Nachtragshaushalten) nachzuvollziehen. Diese Dokumente liegen häufig als schwer durchsuchbare PDFs vor, sind inkonsistent strukturiert und erfordern einen enormen manuellen Aufwand für Vergleiche. Diese Informationsasymmetrie behindert eine effektive öffentliche Aufsicht und eine informierte Bürgerbeteiligung.

## Die Amélie-Lösung: Haushaltslupe
Die 'Haushaltslupe' ist ein Open-Source-Tool, das darauf abzielt, diese Asymmetrie umzukehren. Sie ermöglicht die automatisierte Extraktion, Strukturierung und den differentialen Vergleich von kommunalen Haushaltsdaten. Insbesondere liegt der Fokus auf der Analyse von Nachtragshaushalten – den oft unübersichtlichen Ergänzungen und Änderungen zum ursprünglichen Haushaltsplan. 

### Funktionsweise
1.  **Dokumenten-Upload & Parsing**: Nutzer können kommunale Haushaltspläne (typischerweise PDFs) hochladen. Das Tool nutzt OCR und intelligente Texterkennung, um relevante Finanzdaten zu extrahieren (Einnahmen, Ausgaben, Posten, Bereiche, Projekte).
2.  **Strukturierung & Kategorisierung**: Die extrahierten Daten werden in ein standardisiertes, maschinenlesbares Format überführt und nach vordefinierten oder nutzerdefinierten Kategorien klassifiziert.
3.  **Differentialanalyse**: Der Kern der Haushaltslupe. Nutzer können zwei Versionen eines Haushaltsplans (z.B. Original vs. Nachtrag, oder Jahr X vs. Jahr Y) miteinander vergleichen. Das Tool identifiziert und visualisiert automatisch alle Änderungen: neue Posten, gestrichene Posten, Betragsänderungen, Verschiebungen zwischen Kategorien.
4.  **Visualisierung & Export**: Die Ergebnisse werden in interaktiven Diagrammen und Tabellen dargestellt, die auf einen Blick erkennen lassen, *wo* sich *was* und *wie stark* geändert hat. Exportoptionen ermöglichen die Weiterverarbeitung durch Journalisten oder Forscher.

## Asymmetrische Inversion & Reibungspunkte
Die Haushaltslupe invertiert die Asymmetrie, indem sie den Informationsvorsprung der Verwaltung bei der Interpretation komplexer Finanzdaten neutralisiert. Der Reibungspunkt liegt in der manuellen, fehleranfälligen und zeitaufwendigen Arbeit, die notwendig ist, um Haushaltsänderungen zu verfolgen. Das Tool schließt diese Lücke, indem es diesen Prozess automatisiert und die Bürger in die Lage versetzt, die Finanzentscheidungen ihrer Kommunen aktiv zu überwachen und zu hinterfragen.

## Zielgruppe
*   **Bürgerinnen und Bürger**: Um die Verwendung ihrer Steuergelder besser zu verstehen.
*   **Lokaljournalisten**: Für tiefgehende Recherchen und Berichterstattung über kommunale Finanzen.
*   **NGOs und Bürgerinitiativen**: Zur Argumentationsgrundlage für Lobbyarbeit oder zur Überprüfung von Wahlversprechen.
*   **Universitäten und Forschungseinrichtungen**: Für die Analyse von Public Finance und Governance-Studien.

## Technologische Basis
Moderne Web-Technologien (React/Vue), Datenvisualisierungsbibliotheken (D3.js, Vega-Lite), serverseitige Komponenten für robustes PDF-Parsing (Python mit `camelot`, `pdfminer.six` oder LLM-basierte Extraktion) und eine leichtgewichtige Datenbank (SQLite).