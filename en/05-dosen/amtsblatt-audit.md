# Amtsblatt-Audit: Policy Provenance Tracker for Transparent Administration

## Problem Statement
The development of public policies and administrative regulations is often a complex, opaque process. From initial drafts to internal consultations, public feedback rounds, and final decisions – the genesis of a document is rarely fully and traceably documented. This makes it difficult for citizens, media, and even administrative staff to understand the reasons behind specific decisions, to ascertain accountability, and to see the impact of public feedback. While `diffgeist` tracks textual changes, the question of *why* and *who* behind these changes, linked to concrete evidence, remains unanswered.

## The Amélie Idea: Amtsblatt-Audit
`Amtsblatt-Audit` is an open-source tool that applies the principles of `git` version control to the evolution of policy documents. It enables seamless, transparent, and traceable documentation of the evolution of laws, ordinances, guidelines, and other official texts. The core is the linking of every change (every `git` commit) to concrete external evidence and decision protocols.

### How it Works
1.  **`git`-based Version Management**: Each official document (or a collection of related documents) is managed as a `git` repository.
2.  **Structured Commits**: Every change to the document is captured as a `git` commit. A mandatory, structured metadata section (e.g., in YAML format within the commit body) is added to the commit message. This section includes:
    *   **Links**: To meeting protocols, public consultation feedback statements, expert reports, legal precedents, or other relevant sources that justify the change.
    *   **Change Type**: Categorization of the change (e.g., feature, bugfix, legal adjustment, response to citizen feedback).
    *   **Responsible Entities**: Information about the departments or committees that initiated or approved the change.
3.  **Web Interface for Transparency**: A user-friendly web interface visualizes the `git` history (`git log`, `git blame`) for non-technical users. Citizens can view the history of a paragraph, click on the linked evidence, and thus trace the *provenance* of every decision.
4.  **Automated Validation**: `git` hooks ensure that all commit messages comply with the specified structure and that links to existing references (e.g., ID formats) are valid.

### Technical Core (TypeScript Excerpt)
The core logic for processing structured commit messages could look like this:

```typescript
// src/types/policy-audit.ts
export type PolicyCommitMetadata = {
  documentId: string; // Unique ID for the policy document
  version: string; // Semantic version (e.g., "1.0.0-draft.1")
  changeType: "feat" | "fix" | "refactor" | "docs" | "style" | "chore" | "revert" | "amend" | "legal-review" | "public-feedback";
  summary: string; // Short summary of the change
  links: {
    type: "meeting-protocol" | "public-comment" | "expert-report" | "legal-precedent" | "other";
    identifier: string; // e.g., "Stadtrat_2023-11-15_TOP_3.2", "BI_ABC_feedback_ID_123"
    url?: string; // Optional URL to the source document
  }[];
  authorDepartment?: string; // Department initiating the change
  reviewerDepartment?: string; // Department reviewing the change
  notes?: string; // Additional notes
};

// Function to parse a commit message and extract metadata
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
      // In a real implementation, a YAML parser would be used here.
      // For this example, we use JSON.parse to demonstrate the structure.
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
      console.error("Error parsing commit body metadata:", e);
    }
  }

  return metadata;
}
```

## Civic SWOT Analysis
*   **Strengths**: Significantly increases the transparency and traceability of political decisions. Strengthens trust in public administration. Promotes accountability. Utilizes proven and robust `git` technology. Provides detailed documentation for internal purposes.
*   **Weaknesses**: Requires a cultural shift in administration and adherence to new work processes. Integration with existing Document Management Systems (DMS) can be complex. Initial training effort for employees.
*   **Opportunities**: Can be established as a best practice for transparent administration. Potential for expansion to other document types (e.g., tender documents, annual reports). Can be further optimized through AI-assisted linking and analysis. Enhances citizen participation by transparently presenting the influence of feedback.
*   **Threats**: Resistance to increased transparency. Risk of inconsistent data entry without strict validation. High initial implementation and integration effort.

## Target Institution
Senatsverwaltung Berlin (especially for Urban Development, Building and Housing, or Interior and Sport for general administrative regulations).

## Empirical Evidence & Grounding
The lack of traceability in decision-making processes within public administration is a recurring problem that leads to mistrust and frustration among citizens. Numerous reports from transparency organizations highlight the necessity of making not only final products but also the genesis of documents transparent. `Amtsblatt-Audit` offers a technical solution for this structural gap by making the provenance of digital documents complete and machine-readable.