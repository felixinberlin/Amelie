# EthosGuard: Kontextuelle Richtlinien-Compliance für die Forschung

## Problemstellung
Universitäten und Forschungseinrichtungen sind komplexe Organisationen mit einer Vielzahl von internen Richtlinien, die von ethischen Grundsätzen über Datenschutz und Open Access bis hin zu Beschaffungsvorschriften reichen. Forschende müssen diese oft umfangreichen und schwer zugänglichen Dokumente eigenständig durchforsten, um die Relevanz für ihre spezifischen Projekte zu ermitteln. Dies führt zu einem erheblichen kognitiven Aufwand, Verzögerungen bei Projektgenehmigungen, potenziellen Compliance-Verstößen und einer ineffizienten Nutzung von Ressourcen. Die administrative Überprüfung ist oft reaktiv und personalintensiv, was eine "Enforcement Gap" zwischen der Existenz der Richtlinien und deren konsequenter Anwendung schafft.

## Asymmetrische Inversion (Friction & Enforcement Gaps)
Anstatt dass Forschende proaktiv nach relevanten Richtlinien suchen und Administratoren reaktiv Compliance prüfen müssen, kehrt EthosGuard diesen Prozess um. Das Tool nimmt die Komplexität der Richtlinien auf sich und bietet proaktive, kontextbezogene Beratung. Durch die Analyse von Projektbeschreibungen oder Forschungsfragen liefert EthosGuard maßgeschneiderte Compliance-Checklisten und Policy-Briefings. Dies reduziert die "Reibung" für Forschende erheblich und schließt die "Enforcement Gap", indem Compliance von Anfang an gefördert wird.

## Funktionsweise
1.  **Richtlinien-Ingestion:** EthosGuard importiert Richtliniendokumente (PDF, DOCX, Markdown) aus universitätseigenen Repositories.
2.  **Semantische Extraktion:** Mittels fortschrittlicher NLP- und Large Language Model (LLM)-Techniken werden Schlüsselregelungen, Verantwortlichkeiten, Verbote und Handlungsempfehlungen extrahiert und als semantisches Wissensgraph aufbereitet.
3.  **Kontextuelles Matching:** Forschende geben eine Beschreibung ihres Forschungsprojekts ein (z.B. Datentypen, Methodik, Forschungsfragen).
4.  **Personalisiertes Briefing:** Das System generiert eine Zusammenfassung relevanter Richtlinien, erforderlicher Formulare und Genehmigungsprozesse sowie potenzieller Risikobereiche. Direkte Links zu den Originaldokumenten gewährleisten Transparenz und Nachvollziehbarkeit.
5.  **Änderungsverfolgung (optional):** Integration mit Konzepten wie `diffgeist` könnte Forschende über relevante Richtlinienänderungen für laufende Projekte informieren.

## Zielgruppe
Universitätsverwaltungen, Open Science Büros, Ethikkommissionen, Forschungsförderstellen und Forschende an Hochschulen und NGOs.

## Institutioneller Anker
TU Berlin Open Science Lab: Als Vorreiter für offene Wissenschaftspraktiken und effiziente Forschungsprozesse ist das Open Science Lab ein idealer Partner für die Entwicklung und Implementierung von EthosGuard.

## Technischer Rahmen
*   **Sprache:** TypeScript, Python (für LLM-Backend)
*   **Frontend:** React/Vue (minimalistische UI)
*   **Backend:** Node.js/FastAPI
*   **Datenbank:** Vektor-Datenbank (z.B. Pinecone, Weaviate) für semantische Suche, PostgreSQL für Metadaten.
*   **LLM-Integration:** Open-source LLMs (z.B. LlamaIndex, LangChain) oder API-basierte Modelle.

## Suchprotokoll-Eintrag
`ethos-guard`: Kontextuelle Policy-Compliance für Forschungsprojekte. Nutzt LLMs und semantische Suche zur proaktiven Bereitstellung relevanter institutioneller Richtlinien (Ethik, Datenschutz, Open Access) basierend auf Projektbeschreibungen. Reduziert administrativen Aufwand und fördert Compliance. `knowledge`, `university-admin`, `open-science`, `llm-rag`.