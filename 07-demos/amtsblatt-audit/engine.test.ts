// 07-demos/amtsblatt-audit.test.ts
import { describe, it, expect } from 'vitest';

// Assuming the parsePolicyCommitMessage function and PolicyCommitMetadata type are in a shared utility file
// For this snippet, we'll include the function here for self-containment as per prompt requirements

export type PolicyCommitMetadata = {
  documentId: string;
  version: string;
  changeType: "feat" | "fix" | "refactor" | "docs" | "style" | "chore" | "revert" | "amend" | "legal-review" | "public-feedback";
  summary: string;
  links: {
    type: "meeting-protocol" | "public-comment" | "expert-report" | "legal-precedent" | "other";
    identifier: string;
    url?: string;
  }[];
  authorDepartment?: string;
  reviewerDepartment?: string;
  notes?: string;
};

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

describe('parsePolicyCommitMessage', () => {
  it('should parse a valid structured commit message', () => {
    const commitMessage = `feat(Bauordnung): Neue Regelung zu Dachbegrünung [version: 2.1.0-draft.5]\n---\n{\n  "links": [\n    {\n      "type": "meeting-protocol",\n      "identifier": "Bauausschuss_2024-03-10_TOP_A.1",\n      "url": "https://example.com/protocol/123"\n    },\n    {\n      "type": "public-comment",\n      "identifier": "Bürgerinitiative_GrünDach_ID_456"\n    }\n  ],\n  "authorDepartment": "Stadtplanungsamt"\n}\n---`;
    const result = parsePolicyCommitMessage(commitMessage);

    expect(result).not.toBeNull();
    expect(result?.documentId).toBe('Bauordnung');
    expect(result?.version).toBe('2.1.0-draft.5');
    expect(result?.changeType).toBe('feat');
    expect(result?.summary).toBe('Neue Regelung zu Dachbegrünung');
    expect(result?.authorDepartment).toBe('Stadtplanungsamt');
    expect(result?.links).toHaveLength(2);
    expect(result?.links[0]).toEqual({
      type: 'meeting-protocol',
      identifier: 'Bauausschuss_2024-03-10_TOP_A.1',
      url: 'https://example.com/protocol/123'
    });
    expect(result?.links[1]).toEqual({
      type: 'public-comment',
      identifier: 'Bürgerinitiative_GrünDach_ID_456',
      url: undefined
    });
  });

  it('should return null for an invalid commit message format', () => {
    const invalidMessage = `Fehlerhafte Nachricht ohne Struktur`;
    expect(parsePolicyCommitMessage(invalidMessage)).toBeNull();

    const partialMessage = `feat(Document): Summary`; // Missing version tag
    expect(parsePolicyCommitMessage(partialMessage)).toBeNull();
  });

  it('should handle commit messages without body metadata', () => {
    const commitMessage = `fix(Haushalt): Korrektur des Haushaltsplans [version: 2024.1.1]`;
    const result = parsePolicyCommitMessage(commitMessage);

    expect(result).not.toBeNull();
    expect(result?.documentId).toBe('Haushalt');
    expect(result?.links).toHaveLength(0);
    expect(result?.authorDepartment).toBeUndefined();
  });
});