import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  extractEntitiesAndRelationships, 
  buildKnowledgeGraph, 
  identifyConceptDrift, 
  renderInteractiveGraph,
  KnowledgeGraphNode, 
  KnowledgeGraphEdge
} from '../src/kontext-komet';

// Mock an LLM client or service
const mockLLM = {
  extract: vi.fn((text: string) => {
    if (text.includes('Berlin')) {
      return {
        entities: [{ id: 'ent1', label: 'Berlin', type: 'City' }],
        relationships: []
      };
    } else if (text.includes('Umweltschutz')) {
      return {
        entities: [{ id: 'ent2', label: 'Umweltschutz', type: 'Concept' }],
        relationships: []
      };
    } else if (text.includes('Klimawandel')) {
      return {
        entities: [
          { id: 'ent3', label: 'Klimawandel', type: 'Concept' },
          { id: 'ent4', label: 'CO2-Emissionen', type: 'Metric' }
        ],
        relationships: [
          { source: 'ent3', target: 'ent4', type: 'causes' }
        ]
      };
    } else if (text.includes('Stadtentwicklung') && text.includes('Nachhaltigkeit')) {
      return {
        entities: [
          { id: 'ent5', label: 'Stadtentwicklung', type: 'Concept' },
          { id: 'ent6', label: 'Nachhaltigkeit', type: 'Concept' }
        ],
        relationships: [
          { source: 'ent5', target: 'ent6', type: 'incorporates' }
        ]
      };
    }
    return { entities: [], relationships: [] };
  })
};

describe('Kontext-Komet Core Logic', () => {
  beforeEach(() => {
    mockLLM.extract.mockClear();
  });

  it('should extract entities and relationships from a single document', async () => {
    const documentText = 'Die Stadt Berlin plant neue Maßnahmen zum Umweltschutz.';
    const result = await extractEntitiesAndRelationships(documentText, mockLLM);
    expect(result.entities).toHaveLength(2);
    expect(result.entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: 'Berlin' }),
      expect.objectContaining({ label: 'Umweltschutz' })
    ]));
    expect(result.relationships).toHaveLength(0);
    expect(mockLLM.extract).toHaveBeenCalledWith(documentText);
  });

  it('should build a knowledge graph from extracted data', () => {
    const extractedData = [
      { docId: 'doc1', date: '2023-01-01', entities: [{ id: 'n1', label: 'Berlin', type: 'City' }], relationships: [] },
      { docId: 'doc2', date: '2023-03-15', entities: [{ id: 'n2', label: 'Umweltschutz', type: 'Concept' }], relationships: [] },
      { docId: 'doc3', date: '2023-06-20', entities: [
          { id: 'n3', label: 'Klimawandel', type: 'Concept' },
          { id: 'n4', label: 'CO2-Emissionen', type: 'Metric' }
        ],
        relationships: [
          { source: 'n3', target: 'n4', type: 'causes' }
        ]
      }
    ];
    const { nodes, edges } = buildKnowledgeGraph(extractedData);

    expect(nodes).toHaveLength(4);
    expect(edges).toHaveLength(1);
    expect(nodes.some(node => node.label === 'Berlin')).toBe(true);
    expect(edges[0].source).toBe('n3');
    expect(edges[0].target).toBe('n4');
  });

  it('should identify concept drift over time', () => {
    const nodes: KnowledgeGraphNode[] = [
      { id: 'c1', label: 'Nachhaltigkeit', type: 'Concept', firstSeen: '2020-01-01', lastSeen: '2020-01-01' },
      { id: 'c2', label: 'Nachhaltigkeit', type: 'Concept', firstSeen: '2021-06-01', lastSeen: '2021-06-01' },
      { id: 'c3', label: 'Nachhaltigkeit', type: 'Concept', firstSeen: '2023-03-01', lastSeen: '2023-03-01' },
      { id: 'e1', label: 'Energieeffizienz', type: 'Subconcept', firstSeen: '2020-01-01', lastSeen: '2020-01-01' },
      { id: 'e2', label: 'Kreislaufwirtschaft', type: 'Subconcept', firstSeen: '2023-03-01', lastSeen: '2023-03-01' }
    ];
    const edges: KnowledgeGraphEdge[] = [
      { id: 'r1', source: 'c1', target: 'e1', type: 'includes', date: '2020-01-01' },
      { id: 'r2', source: 'c3', target: 'e2', type: 'includes', date: '2023-03-01' }
    ];

    const drift = identifyConceptDrift(nodes, edges, 'Nachhaltigkeit');
    expect(drift).toBeDefined();
    expect(drift?.length).toBeGreaterThan(0);
    // Expecting to see 'Energieeffizienz' in earlier periods and 'Kreislaufwirtschaft' later
    expect(drift?.some(d => d.date.startsWith('2020') && d.relatedConcepts.includes('Energieeffizienz'))).toBe(true);
    expect(drift?.some(d => d.date.startsWith('2023') && d.relatedConcepts.includes('Kreislaufwirtschaft'))).toBe(true);
  });

  it('should initialize the interactive graph renderer (mocked)', () => {
    const mockContainer = document.createElement('div');
    mockContainer.id = 'graph-container';
    document.body.appendChild(mockContainer);

    const nodes: KnowledgeGraphNode[] = [{ id: 'n1', label: 'Test Node', type: 'Concept', firstSeen: '2023-01-01', lastSeen: '2023-01-01' }];
    const edges: KnowledgeGraphEdge[] = [];

    // Mock D3 or other visualization library initialization
    const mockGraphRenderer = vi.fn((containerId: string, graphNodes: KnowledgeGraphNode[], graphEdges: KnowledgeGraphEdge[]) => {
      expect(containerId).toBe('graph-container');
      expect(graphNodes).toEqual(nodes);
      expect(graphEdges).toEqual(edges);
      return { update: vi.fn(), destroy: vi.fn() };
    });

    const graphInstance = renderInteractiveGraph('graph-container', nodes, edges, mockGraphRenderer);
    expect(mockGraphRenderer).toHaveBeenCalled();
    expect(graphInstance).toBeDefined();
    expect(graphInstance.update).toBeCalledTimes(0);

    document.body.removeChild(mockContainer);
  });
});
