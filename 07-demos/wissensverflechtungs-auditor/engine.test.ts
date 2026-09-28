import { describe, it, expect, vi } from 'vitest';
import { analyzeDocumentInterdependencies, type DocumentGraph } from './wissensverflechtungs-auditor';

// Mock the underlying NLP and graph database interactions for testing
vi.mock('./nlp-service', () => ({
  extractEntitiesAndRelations: vi.fn(async (text: string) => {
    if (text.includes('Policy A')) {
      return {
        entities: [{ id: 'ent1', label: 'Policy A', type: 'Policy' }, { id: 'ent2', label: 'Funding Program X', type: 'Program' }],
        relations: [{ source: 'ent1', target: 'ent2', type: 'references' }]
      };
    } else if (text.includes('Research Report B')) {
      return {
        entities: [{ id: 'ent3', label: 'Research Report B', type: 'Report' }, { id: 'ent2', label: 'Funding Program X', type: 'Program' }],
        relations: [{ source: 'ent3', target: 'ent2', type: 'funded_by' }]
      };
    } else if (text.includes('Regulation C')) {
      return {
        entities: [{ id: 'ent4', label: 'Regulation C', type: 'Regulation' }, { id: 'ent1', label: 'Policy A', type: 'Policy' }],
        relations: [{ source: 'ent4', target: 'ent1', type: 'updates' }]
      };
    }
    return { entities: [], relations: [] };
  }),
}));

describe('analyzeDocumentInterdependencies', () => {
  it('should correctly extract and map interdependencies from multiple documents', async () => {
    const documents = [
      'This is document 1 outlining Policy A, which references Funding Program X.',
      'Document 2 is a Research Report B, funded by Funding Program X.',
      'Regulation C updates Policy A.'
    ];

    const graph: DocumentGraph = await analyzeDocumentInterdependencies(documents);

    // Check nodes
    const nodeLabels = graph.nodes.map(node => node.label).sort();
    expect(nodeLabels).toEqual(['Funding Program X', 'Policy A', 'Regulation C', 'Research Report B'].sort());

    // Check edges
    const expectedEdges = [
      { source: 'ent1', target: 'ent2', type: 'references' },
      { source: 'ent3', target: 'ent2', type: 'funded_by' },
      { source: 'ent4', target: 'ent1', type: 'updates' }
    ];
    expect(graph.edges).toEqual(expect.arrayContaining(expectedEdges));
    expect(graph.edges.length).toBe(expectedEdges.length);
  });

  it('should return an empty graph for no documents', async () => {
    const documents: string[] = [];
    const graph: DocumentGraph = await analyzeDocumentInterdependencies(documents);
    expect(graph.nodes).toEqual([]);
    expect(graph.edges).toEqual([]);
  });

  it('should handle documents with no detectable relations', async () => {
    const documents = ['This document has no specific entities or relations.', 'Another unrelated text.'];
    const graph: DocumentGraph = await analyzeDocumentInterdependencies(documents);
    expect(graph.nodes).toEqual([]);
    expect(graph.edges).toEqual([]);
  });
});

// Placeholder for the actual TypeScript entry file 'wissensverflechtungs-auditor.ts'
// This would contain the actual implementation using the mocked NLP service.
// For the purpose of this output, it's a minimal representation.

export type DocumentGraph = {
  nodes: { id: string; label: string; type: string }[];
  edges: { source: string; target: string; type: string }[];
};

interface ExtractedData {
  entities: { id: string; label: string; type: string }[];
  relations: { source: string; target: string; type: string }[];
}

// Mock or actual import for the NLP service
// In a real scenario, this would involve calling a Python service or a local NLP library
const nlpService = {
  extractEntitiesAndRelations: async (text: string): Promise<ExtractedData> => {
    // This is a placeholder for actual NLP logic.
    // For Vitest, this function is mocked.
    console.warn('Using placeholder NLP service. Ensure real implementation is present.');
    if (text.includes('Policy A')) {
      return {
        entities: [{ id: 'ent1', label: 'Policy A', type: 'Policy' }, { id: 'ent2', label: 'Funding Program X', type: 'Program' }],
        relations: [{ source: 'ent1', target: 'ent2', type: 'references' }]
      };
    }
    return { entities: [], relations: [] };
  }
};

export async function analyzeDocumentInterdependencies(documents: string[]): Promise<DocumentGraph> {
  const allEntities: { [id: string]: { id: string; label: string; type: string } } = {};
  const allRelations: { source: string; target: string; type: string }[] = [];

  for (const doc of documents) {
    const { entities, relations } = await nlpService.extractEntitiesAndRelations(doc);
    entities.forEach(entity => {
      allEntities[entity.id] = entity;
    });
    allRelations.push(...relations);
  }

  return {
    nodes: Object.values(allEntities),
    edges: allRelations,
  };
}
