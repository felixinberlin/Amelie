import { describe, it, expect } from 'vitest';

// This function would typically be in a separate file, e.g., 'src/tender-analyzer.ts'
// For the purpose of a self-contained snippet, it's included here.
export function analyzeTenderDocument(documentContent: string): { sustainabilityScore: number; keywordsFound: string[] } {
  const sustainabilityKeywords = ["nachhaltigkeit", "umweltfreundlich", "co2-neutral", "ressourcenschonend", "soziale verantwortung"];
  let score = 0;
  const foundKeywords: string[] = [];

  const lowerContent = documentContent.toLowerCase();

  for (const keyword of sustainabilityKeywords) {
    if (lowerContent.includes(keyword)) {
      score += 1;
      foundKeywords.push(keyword);
    }
  }

  return { sustainabilityScore: score, keywordsFound: foundKeywords };
}

describe('analyzeTenderDocument', () => {
  it('should correctly identify sustainability keywords in a simple document', () => {
    const document = `
      Dieses Projekt legt großen Wert auf Nachhaltigkeit und umweltfreundliche Materialien.
      Wir streben eine CO2-neutrale Umsetzung an und fordern ressourcenschonende Ansätze.
    `;
    const result = analyzeTenderDocument(document);
    expect(result.sustainabilityScore).toBe(4);
    expect(result.keywordsFound).toEqual(expect.arrayContaining(["nachhaltigkeit", "umweltfreundlich", "co2-neutral", "ressourcenschonend"]));
    expect(result.keywordsFound).toHaveLength(4);
  });

  it('should return 0 score and empty array if no sustainability keywords are found', () => {
    const document = `
      This is a standard tender document without any specific environmental requirements.
      It focuses purely on cost and technical specifications.
    `;
    const result = analyzeTenderDocument(document);
    expect(result.sustainabilityScore).toBe(0);
    expect(result.keywordsFound).toEqual([]);
  });

  it('should handle case insensitivity', () => {
    const document = `
      NACHHALTIGKEIT ist unser Ziel.
    `;
    const result = analyzeTenderDocument(document);
    expect(result.sustainabilityScore).toBe(1);
    expect(result.keywordsFound).toEqual(["nachhaltigkeit"]);
  });

  it('should not count partial matches or non-keywords', () => {
    const document = `
      Dies ist ein nachhaltigerer Ansatz, aber "Nachhaltigkeit" als Begriff fehlt.
      Umweltfreundlichkeit ist wichtig.
    `;
    const result = analyzeTenderDocument(document);
    expect(result.sustainabilityScore).toBe(1);
    expect(result.keywordsFound).toEqual(["umweltfreundlich"]);
  });
});
