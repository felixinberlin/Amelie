# Kontext-Komet: Bürgerliches Wissenskonstellations-Explorer

## Vision
Das 'Kontext-Komet'-Projekt ist ein Open-Source-Tool, das darauf abzielt, die riesigen, oft unübersichtlichen Archive öffentlicher Dokumente (z.B. Stadtratsprotokolle, Forschungspapiere, Gesetzesentwürfe, NGO-Berichte) in eine interaktive und visuell ansprechende Wissenskonstellation zu verwandeln. Es nutzt moderne KI-Technologien, um verborgene Verbindungen, die Evolution von Konzepten und Wissenslücken aufzudecken. Weg vom statischen Papierberg, hin zu einem dynamischen, erkundbaren Wissensuniversum, das bürgerschaftliches Engagement und fundierte Entscheidungen fördert.

## Das Problem
Universitäten, Kommunen und NGOs sitzen auf Bergen von unstrukturierten Textdaten. Diese Dokumente enthalten unzählige Informationen und Beziehungen, die jedoch aufgrund ihres Formats und Umfangs schwer zugänglich, analysierbar oder miteinander verknüpfbar sind. Bürger, Forscher und Entscheidungsträger verpassen oft wichtige Kontextinformationen, Entwicklungen von Themen über die Zeit oder Querverbindungen zwischen scheinbar unzusammenhängenden Dokumenten. Die UX ist oft 'bürokratisch' und lädt nicht zur Exploration ein.

## Die Amélie-Lösung: Kontext-Komet
'Kontext-Komet' löst dieses Problem, indem es einen spielerischen und 'civic delightful' Ansatz verfolgt:

1.  **Dokumenten-Ingestion & KI-Analyse:** Das Tool nimmt Sammlungen von Dokumenten auf (PDFs, Markdown, Textdateien). Mithilfe fortschrittlicher Large Language Models (LLMs) und Natural Language Processing (NLP) extrahiert es automatisch Entitäten (Personen, Orte, Konzepte, Organisationen) und die Beziehungen zwischen ihnen.
2.  **Dynamischer Wissensgraph:** Die extrahierten Entitäten und Beziehungen werden in einen interaktiven Wissensgraphen überführt. Dieser Graph visualisiert die 'Konstellationen' von Ideen und Verbindungen.
3.  **Konzept-Kometen & Zeitliche Entwicklung:** Das Tool kann die Entwicklung von Konzepten über die Zeit verfolgen und als 'Kometenschweife' im Graphen darstellen. So lässt sich nachvollziehen, wie sich Begriffe oder Themen in der öffentlichen Debatte oder in der Forschung entwickeln.
4.  **'Dunkle Materie' & Wissenslücken:** Durch die Analyse der Graphenstruktur können unverbundene Cluster oder Themen identifiziert werden, die als 'dunkle Materie' des Wissensraums potenzielle Forschungs- oder Handlungsfelder aufzeigen.
5.  **Interaktive Exploration:** Nutzer können durch den Graphen 'fliegen', Konzepte anklicken, Beziehungen erkunden, Dokumente filtern und die Ursprungsdokumente einsehen. Die UX ist auf intuitive Entdeckung und spielerische Interaktion ausgelegt.

## Technologische Basis
*   **Backend:** Python (FastAPI) für NLP-Pipelines, LLM-Integration (z.B. LlamaIndex, LangChain mit lokalen oder API-basierten LLMs), Graphdatenbank (z.B. Neo4j, ArangoDB oder einfache JSON-Graphstrukturen für kleinere Projekte).
*   **Frontend:** TypeScript, React, D3.js oder spezialisierte Graph-Visualisierungsbibliotheken (z.B. React Flow, Sigma.js, Cytoscape.js) für eine flüssige, interaktive Benutzeroberfläche.
*   **Deployment:** Docker, Kubernetes für Skalierbarkeit und einfache Bereitstellung.

## Civic Delight & Playfulness
Der 'Kontext-Komet' macht das oft trockene Thema der Dokumentenanalyse zu einem spannenden Entdeckungsspiel. Die Metaphern von Konstellationen, Kometenschweifen und dunkler Materie laden zur spielerischen Erkundung ein. Es ist nicht nur ein Tool, sondern ein Portal in die kollektive Wissenswelt der Zivilgesellschaft und Verwaltung.