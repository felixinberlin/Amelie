# EcoLexiGraph: Kausale Verknüpfung von Politik und Umweltwirkung

## Problemstellung
Umweltpolitik ist oft ein komplexes Geflecht aus Gesetzen, Verordnungen und Richtlinien, die über verschiedene Ebenen und Sektoren verteilt sind. Die tatsächlichen kausalen Zusammenhänge zwischen einer spezifischen politischen Maßnahme (z.B. eine Grenzwertfestlegung) und ihrer ökologischen Auswirkung (z.B. Verbesserung der Wasserqualität) sind für Fachleute wie für die Öffentlichkeit schwer nachvollziehbar. Dies führt zu mangelnder Transparenz, erschwert die Bewertung der Effektivität von Maßnahmen und behindert eine kohärente Politikgestaltung. Häufig bleiben unbeabsichtigte Nebenwirkungen oder widersprüchliche Regelungen unentdeckt, da die schiere Menge und Komplexität der Dokumente eine manuelle Analyse unmöglich macht.

## Die Amélie-Lösung: EcoLexiGraph
EcoLexiGraph ist ein Open-Source-Tool, das darauf abzielt, die kausalen Verbindungen zwischen umweltpolitischen Texten und deren potenziellen ökologischen Auswirkungen mittels Künstlicher Intelligenz aufzudecken und zu visualisieren. Es kombiniert fortschrittliche Sprachmodelle (LLMs) mit einer semantischen Wissensgrafik (Knowledge Graph), um eine Brücke zwischen juristischem Text und ökologischer Realität zu schlagen.

### Technische Komponenten:
1.  **LLM-gestützte Extraktion (Policy Clause Semantic Parser):** Große Sprachmodelle werden trainiert und feinabgestimmt, um aus umweltpolitischen Dokumenten (Gesetze, Verordnungen, Gutachten, Berichte) spezifische Entitäten zu extrahieren. Dazu gehören:
    *   **Akteure:** Wer ist verantwortlich oder betroffen (z.B. Landwirtschaft, Industrie, Kommune)?
    *   **Aktionen:** Was soll getan werden (z.B. reduzieren, begrenzen, fördern)?
    *   **Ziele:** Worum geht es (z.B. Grundwasser, Luftqualität, Biodiversität)?
    *   **Bedingungen/Grenzwerte:** Welche quantitativen oder qualitativen Vorgaben gibt es (z.B. "max. 50 mg/l Nitrat")?
    *   **Kausale Indikatoren:** Formulierungen, die auf Ursache-Wirkungs-Beziehungen hindeuten (z.B. "zur Vermeidung von", "als Folge von").

2.  **Ökologische Wissensgrafik (Eco-Knowledge Graph):** Die extrahierten Entitäten werden in eine Wissensgrafik überführt. Diese Grafik speichert nicht nur die Entitäten selbst, sondern auch die **kausalen Beziehungen** zwischen ökologischen Konzepten, Prozessen und politischen Zielen. Beispiele für Beziehungen:
    *   "Nitrat-Eintrag" `führt zu` "Eutrophierung"
    *   "Eutrophierung" `beeinträchtigt` "Artenvielfalt im Gewässer"
    *   "Reduktion von Emission X" `verbessert` "Luftqualität"
    *   Diese Grafik wird durch die Integration wissenschaftlicher Erkenntnisse (z.B. aus Fachpublikationen, Umweltberichten) kontinuierlich angereichert und validiert.

3.  **Kausale Inferenz-Engine:** Basierend auf der semantischen Analyse der Politiktexte und der ökologischen Wissensgrafik kann EcoLexiGraph:
    *   **Politikkohärenz analysieren:** Widersprüche oder Synergien zwischen verschiedenen Regelwerken aufdecken.
    *   **Wirkungsprognosen erstellen:** Potentielle ökologische Auswirkungen von vorgeschlagenen oder bestehenden Maßnahmen ableiten.
    *   **Lücken identifizieren:** Bereiche aufzeigen, in denen wissenschaftlich bekannte kausalen Zusammenhänge nicht durch entsprechende politische Maßnahmen adressiert werden.
    *   **Compliance-Monitoring unterstützen:** Verknüpfung von Politikzielen mit Monitoringdaten, um die Erreichung der Ziele zu bewerten.

## Zielinstitution und Mehrwert
Das **Umweltbundesamt (UBA)** oder die **Senatsverwaltung für Umwelt, Mobilität, Verbraucher- und Klimaschutz Berlin** könnte EcoLexiGraph nutzen, um:
*   Die Transparenz und Nachvollziehbarkeit umweltpolitischer Entscheidungen zu erhöhen.
*   Die Erstellung von Umweltberichten und Folgenabschätzungen zu beschleunigen und zu verbessern.
*   Widersprüche in der Gesetzgebung frühzeitig zu erkennen und zu beheben.
*   Eine evidenzbasierte Politikgestaltung durch präzisere Wirkungsanalysen zu ermöglichen.
*   Bürgern und Interessengruppen einen besseren Zugang zu den kausalen Zusammenhängen von Umweltpolitik zu bieten.

## Technologische Relevanz
EcoLexiGraph nutzt modernste KI-Technologien im Bereich Natural Language Processing (NLP) und Graphen-Datenbanken, um ein Problem zu lösen, das mit traditionellen Methoden nur schwer zu bewältigen ist. Die Offenheit des Systems ermöglicht eine breite Adaption und Weiterentwicklung durch die Forschungsgemeinschaft und andere öffentliche Institutionen.