// 07-demos/wissenspfad-netzwerk/wissenspfad-netzwerk.test.ts
import { describe, it, expect } from 'vitest';

// Mock an example knowledge artifact structure and a function to extract relationships.
interface KnowledgeArtifact {
  id: string;
  type: 'research-paper' | 'policy-brief' | 'news-article' | 'report';
  title: string;
  content: string;
  authors?: string[];
  source?: string; // e.g., journal, institution, news outlet
  publishDate: string;
}

interface KnowledgeRelationship {
  sourceId: string;
  targetId: string;
  type: 'cites' | 'references' | 'influences' | 'discusses';
  strength?: number; // e.g., confidence score
  context?: string; // e.g., "discussed in paragraph X"
}

// A simplified mock function for knowledge relationship extraction
// In a real scenario, this would involve NLP, entity linking, etc.
const extractKnowledgeRelationships = (
  artifacts: KnowledgeArtifact[],
  keywords: string[] = []
): KnowledgeRelationship[] => {
  const relationships: KnowledgeRelationship[] = [];
  const artifactMap = new Map(artifacts.map(a => [a.id, a]));

  for (let i = 0; i < artifacts.length; i++) {
    for (let j = i + 1; j < artifacts.length; j++) {
      const art1 = artifacts[i];
      const art2 = artifacts[j];

      // Simulate a simple content-based influence/discussion check
      const art1ContentLower = art1.content.toLowerCase();
      const art2ContentLower = art2.content.toLowerCase();

      let foundKeyword = false;
      for (const keyword of keywords) {
        if (art1ContentLower.includes(keyword.toLowerCase()) && art2ContentLower.includes(keyword.toLowerCase())) {
          foundKeyword = true;
          break;
        }
      }

      if (foundKeyword) {
        // Simulate a reciprocal 'discusses' relationship if both contain relevant keywords
        relationships.push({
          sourceId: art1.id,
          targetId: art2.id,
          type: 'discusses',
          strength: 0.7,
          context: `Both discuss relevant keywords related to: ${keywords.join(', ')}`
        });
        relationships.push({
          sourceId: art2.id,
          targetId: art1.id,
          type: 'discusses',
          strength: 0.7,
          context: `Both discuss relevant keywords related to: ${keywords.join(', ')}`
        });
      }

      // Simulate a 'references' relationship if one artifact explicitly mentions the other
      if (art1ContentLower.includes(art2.title.toLowerCase()) && art1.publishDate < art2.publishDate) {
        relationships.push({
          sourceId: art1.id,
          targetId: art2.id,
          type: 'references',
          strength: 0.9,
          context: `"${art2.title}" mentioned in "${art1.title}"`
        });
      }
      if (art2ContentLower.includes(art1.title.toLowerCase()) && art2.publishDate < art1.publishDate) {
        relationships.push({
          sourceId: art2.id,
          targetId: art1.id,
          type: 'references',
          strength: 0.9,
          context: `"${art1.title}" mentioned in "${art2.title}"`
        });
      }
    }
  }

  return relationships;
};

describe('Wissenspfad-Netzwerk Core Logic', () => {
  const mockArtifacts: KnowledgeArtifact[] = [
    {
      id: 'rp-001',
      type: 'research-paper',
      title: 'Climate Change Impact on Urban Heat Islands',
      content: 'This paper investigates the effect of global warming on urban heat islands, proposing green infrastructure as a mitigation strategy.',
      authors: ['Dr. A. Smith'],
      source: 'Environmental Science Journal',
      publishDate: '2020-01-15'
    },
    {
      id: 'pb-001',
      type: 'policy-brief',
      title: 'Mitigating Urban Heat: Policy Recommendations',
      content: 'Based on recent research, including studies on urban heat islands, this brief recommends policies for green infrastructure implementation in cities.',
      source: 'City Planning Department',
      publishDate: '2021-03-01'
    },
    {
      id: 'na-001',
      type: 'news-article',
      title: 'Berlin Faces Summer Heatwave Challenges',
      content: 'With rising temperatures, Berlin must address its urban heat island effect. Experts suggest greening initiatives, echoing policy brief "Mitigating Urban Heat: Policy Recommendations".',
      source: 'Berlin Times',
      publishDate: '2022-07-20'
    },
    {
      id: 'rp-002',
      type: 'research-paper',
      title: 'Socio-economic Factors in Green Infrastructure Adoption',
      content: 'Examines community engagement and socio-economic disparities in the adoption of green infrastructure projects.',
      authors: ['Dr. B. Jones'],
      source: 'Urban Studies Review',
      publishDate: '2021-05-10'
    }
  ];

  it('should correctly identify relationships based on keywords', () => {
    const keywords = ['urban heat island', 'green infrastructure'];
    const relationships = extractKnowledgeRelationships(mockArtifacts, keywords);

    expect(relationships).toBeInstanceOf(Array);
    expect(relationships.length).toBeGreaterThan(0);

    const rp001_pb001_discusses = relationships.some(r =>
      (r.sourceId === 'rp-001' && r.targetId === 'pb-001' && r.type === 'discusses') ||
      (r.sourceId === 'pb-001' && r.targetId === 'rp-001' && r.type === 'discusses')
    );
    expect(rp001_pb001_discusses).toBe(true);

    const pb001_na001_discusses = relationships.some(r =>
      (r.sourceId === 'pb-001' && r.targetId === 'na-001' && r.type === 'discusses') ||
      (r.sourceId === 'na-001' && r.targetId === 'pb-001' && r.type === 'discusses')
    );
    expect(pb001_na001_discusses).toBe(true);
  });

  it('should identify direct references between artifacts', () => {
    const relationships = extractKnowledgeRelationships(mockArtifacts);

    const na001_references_pb001 = relationships.some(r =>
      r.sourceId === 'na-001' &&
      r.targetId === 'pb-001' &&
      r.type === 'references' &&
      r.context?.includes('"Mitigating Urban Heat: Policy Recommendations" mentioned in "Berlin Faces Summer Heatwave Challenges"')
    );
    expect(na001_references_pb001).toBe(true);
  });

  it('should not create relationships for irrelevant artifacts', () => {
    const keywords = ['urban heat island'];
    const relationships = extractKnowledgeRelationships(mockArtifacts, keywords);

    const rp002_to_rp001_discusses = relationships.some(r =>
      ((r.sourceId === 'rp-002' && r.targetId === 'rp-001') || (r.sourceId === 'rp-001' && r.targetId === 'rp-002')) &&
      r.type === 'discusses'
    );
    expect(rp002_to_rp001_discusses).toBe(false);
  });

  it('should handle artifacts with no common keywords', () => {
    const noKeywordsArtifacts: KnowledgeArtifact[] = [
      { id: 'a1', type: 'research-paper', title: 'Quantum Computing Basics', content: 'Quantum entanglement and qubits.', authors: ['X'], source: 'Journal', publishDate: '2023-01-01' },
      { id: 'a2', type: 'news-article', title: 'New AI Breakthrough', content: 'Machine learning and neural networks.', source: 'News', publishDate: '2023-02-01' }
    ];
    const relationships = extractKnowledgeRelationships(noKeywordsArtifacts, ['climate', 'AI']);
    expect(relationships.length).toBe(0);
  });

  it('should ensure relationship structure is consistent', () => {
    const relationships = extractKnowledgeRelationships(mockArtifacts, ['green infrastructure']);
    relationships.forEach(rel => {
      expect(rel).toHaveProperty('sourceId');
      expect(rel).toHaveProperty('targetId');
      expect(rel).toHaveProperty('type');
      expect(['cites', 'references', 'influences', 'discusses']).toContain(rel.type);
      expect(rel).toHaveProperty('strength');
      expect(typeof rel.strength).toBe('number');
      expect(rel).toHaveProperty('context');
      expect(typeof rel.context).toBe('string');
    });
  });
});