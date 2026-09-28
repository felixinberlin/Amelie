# Amtsblatt-Audit: Policy Provenance Tracker für Transparente Verwaltung

## Problemstellung
Die Entwicklung öffentlicher Politik und Verwaltungsvorschriften ist oft ein komplexer, intransparenter Prozess. Von ersten Entwürfen über interne Abstimmungen, öffentliche Konsultationen bis hin zu finalen Beschlüssen – die Entstehungsgeschichte eines Dokuments ist selten lückenlos und nachvollziehbar dokumentiert. Dies erschwert Bürgern, Medien und sogar Verwaltungsmitarbeitern, die Gründe für bestimmte Entscheidungen zu verstehen, die Verantwortlichkeiten nachzuvollziehen und die Wirkung von öffentlichem Feedback zu erkennen. `diffgeist` verfolgt zwar Textänderungen, aber die Frage nach dem *Warum* und *Wer* hinter diesen Änderungen, verknüpft mit konkreten Beweismitteln, bleibt unbeantwortet.

## Die Amélie-Idee: Amtsblatt-Audit
`Amtsblatt-Audit` ist ein Open-Source-Werkzeug, das die Prinzipien der Versionskontrolle von `git` auf die Entstehung von Politikdokumenten anwendet. Es ermöglicht eine lückenlose, transparente und nachvollziehbare Dokumentation der Evolution von Gesetzen, Verordnungen, Richtlinien und anderen amtlichen Texten. Das Kernstück ist die Verknüpfung jeder Änderung (jedes `git`-Commits) mit konkreten externen Beweismitteln und Entscheidungsprotokollen.

### Funktionsweise
1.  **`git`-basiertes Versionsmanagement**: Jedes offizielle Dokument (oder eine Sammlung verwandter Dokumente) wird als `git`-Repository verwaltet.
2.  **Strukturierte Commits**: Jede Änderung am Dokument wird als `git`-Commit erfasst. Der Commit-Nachricht wird eine verpflichtende, strukturierte Metadaten-Sektion hinzugefügt (z.B. im YAML-Format im Commit-Body). Diese Sektion enthält:
    *   **Verknüpfungen (Links)**: Zu Sitzungsprotokollen, Stellungnahmen aus öffentlichen Konsultationen, Gutachten, rechtlichen Präzedenzfällen oder anderen relevanten Quellen, die die Änderung begründen.
    *   **Change-Type**: Kategorisierung der Änderung (z.B. Feature, Bugfix, rechtliche Anpassung, Reaktion auf Bürgerfeedback).
    *   **Verantwortliche Stellen**: Angaben zu den Abteilungen oder Gremien, die die Änderung initiiert oder genehmigt haben.
3.  **Web-Interface für Transparenz**: Eine benutzerfreundliche Weboberfläche visualisiert den `git`-Verlauf (`git log`, `git blame`) für Nicht-Techniker. Bürger können die Historie eines Paragraphen einsehen, auf die verknüpften Beweismittel klicken und so die *Provenienz* jeder Entscheidung nachvollziehen.
4.  **Automatisierte Validierung**: `git`-Hooks stellen sicher, dass alle Commit-Nachrichten der vorgegebenen Struktur entsprechen und Verknüpfungen zu existierenden Referenzen (z.B. ID-Formaten) valide sind.

### Technischer Kern (TypeScript-Auszug)
Die Kernlogik für die Verarbeitung strukturierter Commit-Nachrichten könnte wie folgt aussehen:

```typescript
// src/types/policy-audit.ts
export type PolicyCommitMetadata = {
  documentId: string; // Eindeutige ID des Politikdokuments
  version: string; // Semantische Version (z.B. "1.0.0-draft.1")
  changeType: "feat" | "fix" | "refactor" | "docs" | "style" | "chore" | "revert" | "amend" | "legal-review" | "public-feedback";
  summary: string; // Kurze Zusammenfassung der Änderung
  links: {
    type: "meeting-protocol" | "public-comment" | "expert-report" | "legal-precedent" | "other";
    identifier: string; // z.B. "Stadtrat_2023-11-15_TOP_3.2", "BI_ABC_feedback_ID_123"
    url?: string; // Optionale URL zur Quell-Dokumentation
  }[];
  authorDepartment?: string; // Abteilung, die die Änderung initiiert hat
  reviewerDepartment?: string; // Abteilung, die die Änderung geprüft hat
  notes?: string; // Zusätzliche Anmerkungen
};

// Funktion zum Parsen einer Commit-Nachricht und Extrahieren der Metadaten
export function parsePolicyCommitMessage(message: string): PolicyCommitMetadata | null {
  const lines = message.split('\n');
  if (lines.length < 1) return null;

  const subjectMatch = lines[0].match(/^(feat|fix|refactor|docs|style|chore|revert|amend|legal-review|public-feedback)\((.+)\):\s(.+)\s\[version:\s(.+)\]$/);
  if (!subjectMatch) return null;

  const changeType = subjectMatch[1] as PolicyCommitMetadata['changeType'];
  const documentId = subjectMatch[2];
  const summary = subjectMatch[3];
  const version = subjectMatch[4];

  let metadata: PolicyCommitMetadata = {
    documentId,
    version,
    changeType,
    summary,
    links: []
  };

  const body = lines.slice(1).join('\n').trim();
  if (body.startsWith('---') && body.endsWith('---')) {
    try {
      const yamlContent = body.substring(3, body.length - 3).trim();
      // In einer realen Implementierung würde hier ein YAML-Parser verwendet werden.
      // Für dieses Beispiel verwenden wir JSON.parse zur Demonstration der Struktur.
      const parsedBody = JSON.parse(yamlContent); 
      if (Array.isArray(parsedBody.links)) {
        metadata.links = parsedBody.links.map((link: any) => ({
          type: link.type || 'other',
          identifier: link.identifier,
          url: link.url
        }));
      }
      if (parsedBody.authorDepartment) metadata.authorDepartment = parsedBody.authorDepartment;
      if (parsedBody.reviewerDepartment) metadata.reviewerDepartment = parsedBody.reviewerDepartment;
      if (parsedBody.notes) metadata.notes = parsedBody.notes;
    } catch (e) {
      console.error("Fehler beim Parsen der Commit-Body-Metadaten:", e);
    }
  }

  return metadata;
}
```

## Civic SWOT Analyse
*   **Stärken**: Erhöht die Transparenz und Nachvollziehbarkeit politischer Entscheidungen erheblich. Stärkt das Vertrauen in die öffentliche Verwaltung. Fördert Rechenschaftspflicht. Nutzt bewährte und robuste `git`-Technologie. Bietet eine detaillierte Dokumentation für interne Zwecke.
*   **Schwächen**: Erfordert einen Kulturwandel in der Verwaltung und die Einhaltung neuer Arbeitsprozesse. Die Integration in bestehende Dokumentenmanagement-Systeme (DMS) kann komplex sein. Anfänglicher Schulungsaufwand für Mitarbeiter.
*   **Chancen**: Kann als Best Practice für transparente Verwaltung etabliert werden. Potenzial zur Erweiterung auf weitere Dokumenttypen (z.B. Ausschreibungsunterlagen, Jahresberichte). Kann durch KI-gestützte Verlinkung und Analyse weiter optimiert werden. Stärkt die Bürgerbeteiligung durch transparente Aufbereitung von Feedback-Einflüssen.
*   **Risiken**: Widerstand gegen mehr Transparenz. Gefahr inkonsistenter Dateneingabe ohne strikte Validierung. Hoher initialer Implementierungs- und Integrationsaufwand.

## Zielinstitution
Senatsverwaltung Berlin (insbesondere für Stadtentwicklung, Bauen und Wohnen, oder Inneres und Sport für allgemeine Verwaltungsvorschriften).

## Empirische Evidenz & Begründung
Die mangelnde Nachvollziehbarkeit von Entscheidungsprozessen in der öffentlichen Verwaltung ist ein wiederkehrendes Problem, das zu Misstrauen und Frustration bei Bürgern führt. Zahlreiche Berichte von Transparenzorganisationen weisen auf die Notwendigkeit hin, nicht nur Endprodukte, sondern auch die Entstehung von Dokumenten transparent zu machen. `Amtsblatt-Audit` bietet eine technische Lösung für diese strukturelle Lücke, indem es die Provenienz digitaler Dokumente lückenlos und maschinenlesbar macht.