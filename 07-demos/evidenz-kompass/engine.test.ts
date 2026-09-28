import { describe, it, expect, vi } from 'vitest';

// Mocking external dependencies like an API for research papers or an LLM service
const mockResearchAPI = {
  search: vi.fn(async (query: string, topics: string[]) => {
    if (query.includes("urban heat islands") && topics.includes("climate")) {
      return [
        { id: "paper1", title: "Green Infrastructure for Urban Cooling", abstract: "This paper investigates the effectiveness of various green infrastructure types in mitigating urban heat island effects in dense cities. Findings show significant temperature reductions with tree canopy cover.", fullText: "This paper investigates the effectiveness of various green infrastructure types in mitigating urban heat island effects in dense cities. Findings show significant temperature reductions with tree canopy cover. Recommendations include prioritizing native species and community involvement." },
        { id: "paper2", title: "Participatory Planning for Climate Resilience", abstract: "Examines citizen engagement in developing climate adaptation strategies. Highlights community buy-in as crucial for long-term success.", fullText: "This study examines citizen engagement in developing climate adaptation strategies. Highlights community buy-in as crucial for long-term success. It suggests co-creation workshops and diverse representation." },
      ];
    }
    return [];
  }),
};

const mockLLMService = {
  extractActionableInsights: vi.fn(async (text: string, context: string) => {
    if (text.includes("tree canopy cover") && context.includes("dense cities")) {
      return ["Implement tree planting initiatives in dense urban areas to reduce temperatures.", "Prioritize native, drought-resistant species for sustainability."];
    }
    if (text.includes("citizen engagement") && context.includes("community buy-in")) {
        return ["Establish co-creation workshops with residents for climate adaptation plans.", "Ensure diverse representation in participatory processes."];
    }
    return [];
  }),
  contextualize: vi.fn(async (insights: string[], localContext: string) => {
    if (localContext.includes("Berlin-Mitte") && insights.some(i => i.includes("tree planting"))) {
      return insights.map(i => i + " (relevant for Berlin-Mitte's high building density)");
    }
    return insights;
  }),
};

// Core functions of Evidenz Kompass
async function searchResearch(query: string, topics: string[]): Promise<any[]> {
  // In a real scenario, this would call a research API
  return mockResearchAPI.search(query, topics);
}

async function extractInsights(paperText: string, context: string): Promise<string[]> {
  // In a real scenario, this would call an LLM service
  return mockLLMService.extractActionableInsights(paperText, context);
}

async function contextualizeFindings(insights: string[], localContext: string): Promise<string[]> {
    // In a real scenario, this would call an LLM service or apply rules
    return mockLLMService.contextualize(insights, localContext);
}

// Main processing pipeline
async function processCivicChallenge(challenge: string, localContext: string, topics: string[]): Promise<string[]> {
  const researchPapers = await searchResearch(challenge, topics);
  if (researchPapers.length === 0) {
    return ["No relevant research found for your challenge."];
  }

  let allInsights: string[] = [];
  for (const paper of researchPapers) {
    const insights = await extractInsights(paper.fullText, localContext);
    allInsights = allInsights.concat(insights);
  }

  const contextualized = await contextualizeFindings(allInsights, localContext);
  return contextualized;
}


describe('Evidenz Kompass Core Logic', () => {
  it('should search for relevant research papers based on query and topics', async () => {
    const query = "urban heat islands";
    const topics = ["climate", "urban planning"];
    const results = await searchResearch(query, topics);

    expect(mockResearchAPI.search).toHaveBeenCalledWith(query, topics);
    expect(results).toHaveLength(2);
    expect(results[0].title).toContain("Green Infrastructure");
  });

  it('should extract actionable insights from paper text using LLM', async () => {
    const paperText = "This paper investigates the effectiveness of various green infrastructure types in mitigating urban heat island effects in dense cities. Findings show significant temperature reductions with tree canopy cover. Recommendations include prioritizing native species and community involvement.";
    const context = "dense cities, Berlin-Mitte";
    const insights = await extractInsights(paperText, context);

    expect(mockLLMService.extractActionableInsights).toHaveBeenCalledWith(paperText, context);
    expect(insights).toHaveLength(2);
    expect(insights[0]).toContain("tree planting initiatives");
  });

  it('should contextualize extracted insights for a specific local context', async () => {
    const insights = ["Implement tree planting initiatives to reduce temperatures."];
    const localContext = "Berlin-Mitte, high building density";
    const contextualized = await contextualizeFindings(insights, localContext);

    expect(mockLLMService.contextualize).toHaveBeenCalledWith(insights, localContext);
    expect(contextualized[0]).toContain("Berlin-Mitte's high building density");
  });

  it('should process a civic challenge end-to-end and return contextualized insights', async () => {
    const challenge = "how to reduce urban heat islands";
    const localContext = "Berlin-Mitte, high building density, 1.5M population";
    const topics = ["climate", "urban planning"];

    const finalInsights = await processCivicChallenge(challenge, localContext, topics);

    expect(mockResearchAPI.search).toHaveBeenCalledWith(challenge, topics);
    expect(mockLLMService.extractActionableInsights).toHaveBeenCalledTimes(2); // Called for each mock paper
    expect(mockLLMService.contextualize).toHaveBeenCalledTimes(1);

    expect(finalInsights).toHaveLength(4); // 2 from paper1, 2 from paper2, all contextualized
    expect(finalInsights[0]).toContain("Berlin-Mitte's high building density");
    expect(finalInsights[2]).toContain("co-creation workshops");
  });

  it('should handle cases where no relevant research is found', async () => {
    mockResearchAPI.search.mockResolvedValueOnce([]); // Mock no results for this specific test

    const challenge = "non-existent research topic";
    const localContext = "anywhere";
    const topics = ["obscure"];

    const finalInsights = await processCivicChallenge(challenge, localContext, topics);

    expect(finalInsights).toEqual(["No relevant research found for your challenge."]);
    expect(mockLLMService.extractActionableInsights).not.toHaveBeenCalled();
    expect(mockLLMService.contextualize).not.toHaveBeenCalled();
  });
});