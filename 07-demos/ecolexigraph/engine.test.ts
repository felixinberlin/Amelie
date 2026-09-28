import { describe, it, expect } from 'vitest';

/**
 * @module EcoLexiGraphCoreTests
 * @description Vitest test suite for core functionalities of the EcoLexiGraph system,
 * focusing on entity extraction and basic causal link inference.
 */

// Mock types for demonstration, mirroring src/index.ts
type PolicyClause = { id: string; text: string; source: string; date: string; section?: string; originalUrl?: string; };
type ExtractedEntity = { type: 'Actor' | 'Action' | 'Target' | 'Condition' | 'EnvironmentalParameter' | 'LegalReference' | 'MeasurementUnit'; value: string; startOffset: number; endOffset: number; confidence: number; normalizedValue?: string; };
type CausalLink = { sourceNodeId: string; targetNodeId: string; relationship: string; strength: number; evidence?: string[]; context?: string; };
type KnowledgeGraphNode = { id: string; label: string; type: 'EnvironmentalConcept' | 'PolicyObjective' | 'EcologicalProcess' | 'Measurement' | 'ActorType'; description?: string; synonyms?: string[]; };

// Mock class implementing core logic for testing purposes
class MockEcoLexiGraph {
  private knowledgeGraph: Map<string, KnowledgeGraphNode>;
  private causalRelationships: CausalLink[];

  constructor() {
    this.knowledgeGraph = new Map();
    this.causalRelationships = [];
  }

  addKnowledgeGraphNode(node: KnowledgeGraphNode): void {
    this.knowledgeGraph.set(node.id, node);
  }

  addCausalLink(link: CausalLink): void {
    this.causalRelationships.push(link);
  }

  async extractEntitiesFromClause(clause: PolicyClause): Promise<ExtractedEntity[]> {
    const text = clause.text.toLowerCase();
    const entities: ExtractedEntity[] = [];

    // Simulate LLM extraction with simple keyword matching for testing
    if (text.includes("nitrat")) {
      entities.push({ type: "EnvironmentalParameter", value: "Nitrat", startOffset: text.indexOf("nitrat"), endOffset: text.indexOf("nitrat") + 6, confidence: 0.95, normalizedValue: "Nitrate" });
    }
    if (text.includes("grundwasser")) {
      entities.push({ type: "Target", value: "Grundwasser", startOffset: text.indexOf("grundwasser"), endOffset: text.indexOf("grundwasser") + 11, confidence: 0.90, normalizedValue: "Groundwater" });
    }
    if (text.includes("reduzieren") || text.includes("begrenzen")) {
      const idx = text.includes("reduzieren") ? text.indexOf("reduzieren") : text.indexOf("begrenzen");
      const val = text.includes("reduzieren") ? "reduzieren" : "begrenzen";
      entities.push({ type: "Action", value: val, startOffset: idx, endOffset: idx + val.length, confidence: 0.88, normalizedValue: "Reduce" });
    }
    if (text.includes("landwirtschaft")) {
      entities.push({ type: "Actor", value: "Landwirtschaft", startOffset: text.indexOf("landwirtschaft"), endOffset: text.indexOf("landwirtschaft") + 14, confidence: 0.85, normalizedValue: "Agriculture" });
    }
    if (text.includes("max. 50 mg/l")) {
      entities.push({ type: "Condition", value: "max. 50 mg/l", startOffset: text.indexOf("max. 50 mg/l"), endOffset: text.indexOf("max. 50 mg/l") + 12, confidence: 0.92 });
    }
    return entities;
  }

  async inferCausalImpacts(extractedEntities: ExtractedEntity[]): Promise<CausalLink[]> {
    const inferredLinks: CausalLink[] = [];

    const hasNitrate = extractedEntities.some(e => e.normalizedValue === 'Nitrate');
    const hasGroundwater = extractedEntities.some(e => e.normalizedValue === 'Groundwater');
    const hasReduceAction = extractedEntities.some(e => e.normalizedValue === 'Reduce');

    if (hasNitrate && hasGroundwater && hasReduceAction) {
      const potentialLink = this.causalRelationships.find(
        link => link.sourceNodeId === 'NitrateReductionConcept' && link.targetNodeId === 'GroundwaterQualityImprovementConcept'
      );
      if (potentialLink) {
        inferredLinks.push(potentialLink);
      }
    }
    return inferredLinks;
  }
}

describe('EcoLexiGraph Core Functions', () => {
  let ecoLexiGraph: MockEcoLexiGraph;

  beforeEach(() => {
    ecoLexiGraph = new MockEcoLexiGraph();
    // Populate mock KG with relevant nodes and links for testing
    ecoLexiGraph.addKnowledgeGraphNode({ id: 'NitrateReductionConcept', label: 'Nitrate Reduction', type: 'EcologicalProcess' });
    ecoLexiGraph.addKnowledgeGraphNode({ id: 'GroundwaterQualityImprovementConcept', label: 'Groundwater Quality Improvement', type: 'EnvironmentalConcept' });
    ecoLexiGraph.addKnowledgeGraphNode({ id: 'CO2ReductionConcept', label: 'CO2 Reduction', type: 'EcologicalProcess' });
    ecoLexiGraph.addKnowledgeGraphNode({ id: 'AirQualityImprovementConcept', label: 'Air Quality Improvement', type: 'EnvironmentalConcept' });

    ecoLexiGraph.addCausalLink({
      sourceNodeId: 'NitrateReductionConcept',
      targetNodeId: 'GroundwaterQualityImprovementConcept',
      relationship: 'positively impacts',
      strength: 0.9,
      evidence: ['scientific_paper_A', 'UBA_report_2022'],
      context: 'in agricultural areas'
    });
    ecoLexiGraph.addCausalLink({
        sourceNodeId: 'CO2ReductionConcept',
        targetNodeId: 'AirQualityImprovementConcept',
        relationship: 'positively impacts',
        strength: 0.8,
        evidence: ['IPCC_report'],
        context: 'globally'
      });
  });

  it('should correctly extract entities from a policy clause regarding nitrate in groundwater', async () => {
    const policy: PolicyClause = {
      id: "P001",
      text: "Die Landwirtschaft muss den Nitratgehalt im Grundwasser auf max. 50 mg/l reduzieren.",
      source: "Nitratverordnung 2023",
      date: "2023-01-01"
    };
    const entities = await ecoLexiGraph.extractEntitiesFromClause(policy);
    expect(entities).toHaveLength(5);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: "EnvironmentalParameter", value: "Nitrat", normalizedValue: "Nitrate" }),
      expect.objectContaining({ type: "Target", value: "Grundwasser", normalizedValue: "Groundwater" }),
      expect.objectContaining({ type: "Action", value: "reduzieren", normalizedValue: "Reduce" }),
      expect.objectContaining({ type: "Actor", value: "Landwirtschaft", normalizedValue: "Agriculture" }),
      expect.objectContaining({ type: "Condition", value: "max. 50 mg/l" })
    ]));
  });

  it('should identify a causal link between nitrate reduction and groundwater quality improvement', async () => {
    const entities: ExtractedEntity[] = [
        { type: "EnvironmentalParameter", value: "Nitrat", startOffset: 0, endOffset: 0, confidence: 0.95, normalizedValue: "Nitrate" },
        { type: "Target", value: "Grundwasser", startOffset: 0, endOffset: 0, confidence: 0.90, normalizedValue: "Groundwater" },
        { type: "Action", value: "Reduktion", startOffset: 0, endOffset: 0, confidence: 0.88, normalizedValue: "Reduce" },
    ];

    const causalLinks = await ecoLexiGraph.inferCausalImpacts(entities);
    expect(causalLinks).toHaveLength(1);
    expect(causalLinks[0]).toEqual(expect.objectContaining({
      sourceNodeId: 'NitrateReductionConcept',
      targetNodeId: 'GroundwaterQualityImprovementConcept',
      relationship: 'positively impacts',
      strength: 0.9
    }));
  });

  it('should not identify a causal link if relevant entities are missing', async () => {
    const entities: ExtractedEntity[] = [
        { type: "EnvironmentalParameter", value: "Nitrat", startOffset: 0, endOffset: 0, confidence: 0.95, normalizedValue: "Nitrate" },
        { type: "Target", value: "Grundwasser", startOffset: 0, endOffset: 0, confidence: 0.90, normalizedValue: "Groundwater" },
        // Missing 'Action' entity
    ];

    const causalLinks = await ecoLexiGraph.inferCausalImpacts(entities);
    expect(causalLinks).toHaveLength(0);
  });

  it('should not identify an unrelated causal link', async () => {
    const entities: ExtractedEntity[] = [
        { type: "EnvironmentalParameter", value: "CO2", startOffset: 0, endOffset: 0, confidence: 0.95, normalizedValue: "CO2" },
        { type: "Target", value: "Luftqualität", startOffset: 0, endOffset: 0, confidence: 0.90, normalizedValue: "Air Quality" },
        { type: "Action", value: "Reduktion", startOffset: 0, endOffset: 0, confidence: 0.88, normalizedValue: "Reduce" },
    ];

    // This mock KG does not link CO2 reduction to *groundwater* quality, only air quality
    const causalLinks = await ecoLexiGraph.inferCausalImpacts(entities);
    // In this simplified mock, it won't find the CO2 -> Air Quality link either, as the check is specific.
    // A more complex mock would iterate through all KG links.
    expect(causalLinks).toHaveLength(0);
  });
});