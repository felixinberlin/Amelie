# RegulaGraph: KI-gestütztes Policy-Relations-Mapping für die öffentliche Verwaltung

## Problemstellung
Die öffentliche Verwaltung, insbesondere in großen Städten wie Berlin, kämpft mit einer Zersplitterung von Wissen und einer mangelnden Nachvollziehbarkeit politischer Entscheidungen und deren Auswirkungen. Dokumente wie Gesetzesentwürfe, Verordnungen, Sitzungsprotokolle, Gutachten und interne Vermerke sind oft in Silos abgelegt, was eine umfassende Analyse von Policy-Entwicklungen, Akteursbeziehungen und die Identifizierung von Abhängigkeiten extrem erschwert. Dies führt zu Ineffizienzen, Inkonsistenzen in der Anwendung von Richtlinien und einem Verlust an institutionellem Gedächtnis, wenn Schlüsselpersonal wechselt.

## Lösungsansatz: RegulaGraph
RegulaGraph schlägt die Entwicklung eines Open-Source-Tools vor, das mittels Künstlicher Intelligenz (insbesondere Large Language Models und Natural Language Processing) einen dynamischen Wissensgraphen aus allen relevanten Verwaltungsdokumenten erstellt. Dieser Graph visualisiert die komplexen Beziehungen zwischen:

*   **Akteuren:** Personen, Abteilungen, Ausschüsse, externe Interessengruppen.
*   **Entscheidungen:** Beschlüsse, Verordnungen, Gesetze, Richtlinien.
*   **Dokumenten:** Quellen, Referenzen, Gutachten, Protokolle.
*   **Konzepten:** Themen, Sachverhalte, Wirkungsbereiche.
*   **Zeitlichen Entwicklungen:** Wann wurde etwas entschieden, wann trat es in Kraft, wann wurde es abgelöst?

Das Tool würde es Nutzern ermöglichen, mittels natürlicher Sprache Anfragen an diesen Graphen zu stellen (z.B. "Welche Abteilungen sind von der Bildungsreform 2024 betroffen und auf welchen Gutachten basiert sie?"), um sofort visuelle und textliche Antworten mit Verweisen auf die Originaldokumente zu erhalten.

## Technische Komponenten
1.  **Dokumenten-Ingestion & Parsing:** Unterstützung für diverse Formate (PDF, DOCX, TXT, HTML) mit OCR für gescannte Dokumente.
2.  **Entitäten- & Relations-Extraktion:** Einsatz von LLMs und spezialisierten NLP-Modellen zur Identifizierung von Named Entities (Personen, Organisationen, Gesetze, Daten) und zur Extraktion von Beziehungen zwischen ihnen (z.B. "verabschiedet von", "wirkt auf", "ersetzt", "referenziert").
3.  **Wissensgraphen-Datenbank:** Eine Graphdatenbank (z.B. Neo4j) zur Speicherung der extrahierten Entitäten und Beziehungen.
4.  **Natural Language to Graph Query (NL2GQ):** Eine Schnittstelle, die natürliche Sprachfragen in Graph-Abfragen übersetzt.
5.  **Interaktive Visualisierung:** Ein Frontend (z.B. mit React/Vue und D3.js) zur dynamischen Darstellung des Graphen, mit Filtermöglichkeiten, Zoom und Drill-down-Funktionen zu den Ursprungsdokumenten.

## Nutzen für die Zielinstitution
Die Senatsverwaltung für Bildung, Jugend und Familie Berlin ist ein idealer Anwendungsfall, da sie eine Vielzahl komplexer Gesetze, Verordnungen und Projekte verwaltet, die sich ständig weiterentwickeln und viele Akteure betreffen. RegulaGraph würde:

*   **Die Entscheidungsfindung verbessern:** Durch schnellen Zugriff auf alle relevanten Informationen und deren Kontext.
*   **Transparenz erhöhen:** Interne Prozesse und die Begründung von Entscheidungen werden nachvollziehbarer.
*   **Das institutionelle Gedächtnis stärken:** Wissen bleibt auch bei Personalwechsel erhalten und ist zugänglich.
*   **Die Policy-Kohärenz fördern:** Inkonsistenzen und Überschneidungen können frühzeitig erkannt werden.
*   **Einarbeitungszeiten verkürzen:** Neue Mitarbeiter können sich schneller in komplexe Themen einarbeiten.

RegulaGraph bietet eine innovative, technisch tiefgehende Lösung für ein grundlegendes Problem der modernen Verwaltung, indem es den Umgang mit Wissensfragmentierung transformiert und die Effizienz sowie die Qualität der öffentlichen Dienstleistungen steigert.