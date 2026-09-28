# Regelwerk-Historiker: Semantische Driftanalyse für öffentliche Ordnungen

## Problemstellung
Öffentliche Verwaltungen und Institutionen sind Hüter komplexer Regelwerke, Richtlinien und Datenschemata, die sich über Jahre oder Jahrzehnte entwickeln. Diese Dokumente sind oft in heterogenen Formaten (PDF, Word, Markdown, XML) verfasst und erfahren inkrementelle Änderungen. Die manuelle Nachverfolgung der kumulativen Auswirkungen dieser Änderungen – des sogenannten 'Policy Drift' oder 'Regelwerk-Drift' – ist extrem aufwendig, fehleranfällig und führt zu mangelnder Transparenz. Bestehende Versionskontrollsysteme wie Git bieten zwar Zeilen-für-Zeilen-Diffe, erfassen aber nicht die semantische Bedeutung von Änderungen oder deren Auswirkungen auf die Konsistenz des gesamten Regelwerks. Dies erschwert die Bürgerbeteiligung, die Konsistenzprüfung und die Evaluierung politischer Maßnahmen erheblich.

## Lösungsansatz: Amélie "Regelwerk-Historiker"
Der "Regelwerk-Historiker" ist ein Open-Source-Werkzeug, das Git als primäres Versionskontrollsystem nutzt und um fortschrittliche KI-gestützte semantische Analyse erweitert. Das System transformiert disparate Regelwerksdokumente in ein standardisiertes, Git-freundliches Format (z.B. strukturiertes Markdown, JSON-LD). Anschließend werden LLMs (Large Language Models) eingesetzt, um nicht nur textuelle, sondern auch *konzeptuelle* Änderungen zwischen verschiedenen Versionen zu identifizieren. 

### Kernfunktionen:
1.  **Dokumenten-Ingestion & Normalisierung**: Automatisches Einlesen und Parsen von Regelwerken aus verschiedenen Quellen und Formaten in eine einheitliche, maschinenlesbare Struktur.
2.  **Git-Integration**: Versionierung jedes normalisierten Dokuments in einem dedizierten Git-Repository, um einen unveränderlichen, dezentralen Änderungsverlauf zu gewährleisten.
3.  **Semantische Diff-Analyse**: Einsatz von LLMs, um die *Bedeutung* von Änderungen zu erkennen. Statt nur 'Zeile X wurde zu Zeile Y geändert', identifiziert das System 'Der Anwendungsbereich von Paragraph Z wurde erweitert' oder 'Definition A wurde präzisiert, was Implikationen für Abschnitt B hat'.
4.  **Drift-Erkennung & -Quantifizierung**: Identifikation von schleichenden, kumulativen Änderungen über längere Zeiträume, die zu einer unerwarteten Verschiebung der ursprünglichen Absicht oder zu Inkonsistenzen führen können.
5.  **Wirkungsanalyse**: Abschätzung der potenziellen Auswirkungen von Änderungen auf andere Teile des Regelwerks oder auf betroffene Akteure (z.B. Bürger, Unternehmen).
6.  **Human-Readable Summaries & Visualisierung**: Generierung verständlicher Zusammenfassungen der Änderungen und deren Auswirkungen, ergänzt durch Visualisierungen von Drift-Trends und Abhängigkeiten.
7.  **Konsistenzprüfung**: Automatische Erkennung von Widersprüchen oder Redundanzen, die durch Änderungen im Regelwerk entstanden sind.

## Technologische Basis
*   **Versionskontrolle**: Git (Core)
*   **Dokumentenverarbeitung**: Parsen und Strukturieren mittels spezialisierter Bibliotheken (z.B. `pandoc`, `textract`, `markdown-it`)
*   **Semantische Analyse**: LLMs (z.B. Open-Source-Modelle wie Llama.cpp, oder API-basierte Dienste) mit spezifischen Prompt-Engineering-Strategien und ggf. Retrieval-Augmented Generation (RAG).
*   **Datenhaltung**: Eventuell ergänzt durch eine Graphdatenbank zur Abbildung von Abhängigkeiten und Beziehungen innerhalb des Regelwerks.
*   **Frontend**: Eine interaktive Webanwendung zur Visualisierung und Exploration des Änderungsverlaufs.

## Zielinstitutionen
Das Projekt richtet sich an Institutionen, die komplexe und sich entwickelnde Regelwerke verwalten, wie das Umweltbundesamt, Senatsverwaltungen (z.B. für Umwelt, Stadtentwicklung, Finanzen), Forschungseinrichtungen im Bereich Open Science oder NGOs, die sich für Transparenz und gute Verwaltungspraxis einsetzen.

## Gesellschaftlicher Nutzen
Der "Regelwerk-Historiker" schafft eine nie dagewesene Transparenz in der Evolution öffentlicher Regelwerke. Er ermöglicht es Bürgern, NGOs und Forschenden, die Gründe und Auswirkungen von Änderungen besser nachzuvollziehen. Für Verwaltungen führt er zu einer erhöhten Konsistenz, reduziert den administrativen Aufwand bei der Überprüfung und hilft, unbeabsichtigte Konsequenzen von Regelwerksänderungen frühzeitig zu erkennen. Dies stärkt das Vertrauen in die öffentliche Verwaltung und fördert eine informierte Debatte über Governance-Fragen.