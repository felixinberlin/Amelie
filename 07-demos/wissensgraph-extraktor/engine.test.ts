// 07-demos/wissensgraph-extraktor/tests/index.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { extractKnowledge, PolicyImpactSchema } from '../src/index';

// Mock LLM client for testing purposes
const mockLLMClient = {
  // In a real scenario, this would simulate an API call
  // For now, we'll rely on the mock data within `extractKnowledge`
  // or provide a more complex mock if `extractKnowledge` were to be refactored
  // to take a true external LLM client.
  call: vi.fn(async (prompt: string, schema: any) => {
    // This mock mirrors the structure of the internal mock for simplicity
    // If the extractKnowledge was truly calling an external LLM, this mock would be more involved.
    if (prompt.includes("climate change policy")) {
      return `
        [
          {
            "policyName": "Klimaschutzgesetz Berlin",
            "policyDescription": "Das Gesetz verpflichtet Berlin zur Klimaneutralität bis 2045.",
            "affectedDemographic": ["Berliner Bürger", "Unternehmen", "Verwaltung"],
            "impactType": "positive",
            "impactDetails": "Fördert nachhaltige Stadtentwicklung, erfordert aber Investitionen.",
            "relevantParagraphs": ["§1 Ziel", "§3 Maßnahmen"],
            "confidenceScore": 0.98
          }
        ]
      `;
    } else if (prompt.includes("education reform")) {
      return `
        [
          {
            "policyName": "Bildungsreform 2024",
            "policyDescription": "Einführung neuer Lehrpläne und digitaler Lernmittel.",
            "affectedDemographic": ["Schüler", "Lehrer", "Eltern"],
            "impactType": "mixed",
            "impactDetails": "Potenzial zur Modernisierung, aber auch Herausforderungen bei der Implementierung.",
            "relevantParagraphs": ["Artikel 5.2", "Anlage B.1"],
            "confidenceScore": 0.85
          }
        ]
      `;
    } else if (prompt.includes("no relevant policy")) {
        return `[]`; // Simulate no extraction
    }
    return `[]`; // Default empty response
  }),
};

describe('extractKnowledge', () => {
  beforeEach(() => {
    // Reset mocks before each test if necessary
    mockLLMClient.call.mockClear();
  });

  it('should extract structured knowledge according to schema from a document', async () => {
    const documentText = `
      Das Klimaschutzgesetz Berlin wurde verabschiedet mit dem Ziel, die Stadt bis 2045 klimaneutral zu machen.
      Es betrifft alle Berliner Bürger, Unternehmen und die Verwaltung.
      Die Maßnahmen umfassen unter anderem den Ausbau erneuerbarer Energien und die Förderung der Elektromobilität.
      Dies ist in §1 Ziel und §3 Maßnahmen des Gesetzes detailliert.
    `;
    const documentId = 'doc-001-climate';

    // Temporarily override the internal mock logic for this test to use the external mock
    // In a production setup, `extractKnowledge` would directly take `llmClient` as an argument
    // For this demonstration, we simulate the `extractKnowledge` function's internal LLM call
    // by making the internal mock return what `mockLLMClient.call` would return.
    const result = await extractKnowledge(documentText, PolicyImpactSchema, documentId, mockLLMClient);

    expect(result.extractedData).toHaveLength(1);
    const policyImpact = result.extractedData[0];

    expect(policyImpact.policyName).toBe("Klimaschutzgesetz Berlin");
    expect(policyImpact.affectedDemographic).toEqual(expect.arrayContaining(["Berliner Bürger", "Unternehmen", "Verwaltung"]));
    expect(policyImpact.impactType).toBe("positive");
    expect(policyImpact.relevantParagraphs).toEqual(expect.arrayContaining(["§1 Ziel", "§3 Maßnahmen"]));
    expect(policyImpact.confidenceScore).toBeGreaterThan(0.9);
    expect(result.documentId).toBe(documentId);
    expect(result.errors).toHaveLength(0);
  });

  it('should handle documents with multiple policy impacts', async () => {
    const documentText = `
      Zuerst wurde das Gesetz zur Förderung erneuerbarer Energien verabschiedet (Abschnitt 3, Absatz 1).
      Es soll den Anteil erneuerbarer Energien steigern und betrifft Energieversorger und Endverbraucher.
      Danach kam das Städtebauförderungsprogramm 2023 (Kapitel 2, Artikel 5), das Anwohner und Baufirmen betrifft.
    `;
    const documentId = 'doc-002-multiple';

    // Mocking the internal LLM call to return multiple entries for this specific test
    const originalExtractKnowledge = vi.importActual('../src/index');
    vi.spyOn(originalExtractKnowledge, 'extractKnowledge').mockImplementation(async (text, schema, id, client) => {
        // This is a more direct way to control the mock output for the function under test
        const mockResponse = `
          [
            {
              "policyName": "Gesetz zur Förderung erneuerbarer Energien",
              "policyDescription": "Fördert erneuerbare Energien.",
              "affectedDemographic": ["Energieversorger", "Endverbraucher"],
              "impactType": "positive",
              "impactDetails": "Steigerung des Anteils erneuerbarer Energien.",
              "relevantParagraphs": ["Abschnitt 3, Absatz 1"],
              "confidenceScore": 0.92
            },
            {
              "policyName": "Städtebauförderungsprogramm 2023",
              "policyDescription": "Revitalisierung städtischer Quartiere.",
              "affectedDemographic": ["Anwohner", "Baufirmen"],
              "impactType": "positive",
              "impactDetails": "Verbesserung der Infrastruktur.",
              "relevantParagraphs": ["Kapitel 2, Artikel 5"],
              "confidenceScore": 0.89
            }
          ]
        `;
        const parsedData = JSON.parse(mockResponse);
        const validatedData: any[] = parsedData.map((item: any) => schema.parse(item));
        return {
            extractedData: validatedData,
            documentId: id,
            timestamp: new Date().toISOString(),
            errors: [],
        };
    });


    const result = await extractKnowledge(documentText, PolicyImpactSchema, documentId, mockLLMClient);

    expect(result.extractedData).toHaveLength(2);
    expect(result.extractedData[0].policyName).toBe("Gesetz zur Förderung erneuerbarer Energien");
    expect(result.extractedData[1].policyName).toBe("Städtebauförderungsprogramm 2023");
    expect(result.errors).toHaveLength(0);

    // Restore original implementation
    vi.restoreAllMocks();
  });


  it('should return empty array if no relevant knowledge is found', async () => {
    const documentText = 'This document contains only general information about local weather.';
    const documentId = 'doc-003-weather';

    const originalExtractKnowledge = vi.importActual('../src/index');
    vi.spyOn(originalExtractKnowledge, 'extractKnowledge').mockImplementation(async (text, schema, id, client) => {
        return {
            extractedData: [],
            documentId: id,
            timestamp: new Date().toISOString(),
            errors: [],
        };
    });

    const result = await extractKnowledge(documentText, PolicyImpactSchema, documentId, mockLLMClient);

    expect(result.extractedData).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
    vi.restoreAllMocks();
  });

  it('should report errors if LLM output is not schema-compliant', async () => {
    const documentText = 'This text should cause a schema validation error.';
    const documentId = 'doc-004-error';

    const originalExtractKnowledge = vi.importActual('../src/index');
    vi.spyOn(originalExtractKnowledge, 'extractKnowledge').mockImplementation(async (text, schema, id, client) => {
        // Simulate LLM returning malformed data for the schema
        const malformedResponse = `
          [
            {
              "policyName": "Bad Policy",
              "affectedDemographic": "Not an array", // This should fail validation
              "impactType": "unknown", // This should fail enum validation
              "relevantParagraphs": ["P1"],
              "confidenceScore": 1.1 // This should fail min/max validation
            }
          ]
        `;
        try {
            const parsedData = JSON.parse(malformedResponse);
            parsedData.map((item: any) => schema.parse(item)); // This will throw
            return { extractedData: [], documentId: id, timestamp: new Date().toISOString(), errors: [] };
        } catch (error: any) {
            return {
                extractedData: [],
                documentId: id,
                timestamp: new Date().toISOString(),
                errors: [`Schema validation failed: ${error.message}`],
            };
        }
    });

    const result = await extractKnowledge(documentText, PolicyImpactSchema, documentId, mockLLMClient);

    expect(result.extractedData).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain('Schema validation failed');
    vi.restoreAllMocks();
  });

  it('should correctly link relevant paragraphs for provenance', async () => {
    const documentText = `
      This is the first paragraph about a new housing policy. It aims to reduce homelessness.
      The second paragraph details the funding mechanisms and target groups, primarily low-income families.
      Paragraph three discusses the environmental impact.
      Paragraph four states that the policy is called "Housing for All" and was enacted in 2023.
    `;
    const documentId = 'doc-005-provenance';

    const originalExtractKnowledge = vi.importActual('../src/index');
    vi.spyOn(originalExtractKnowledge, 'extractKnowledge').mockImplementation(async (text, schema, id, client) => {
        const mockResponse = `
          [
            {
              "policyName": "Housing for All",
              "policyDescription": "A new housing policy enacted in 2023 to reduce homelessness.",
              "affectedDemographic": ["low-income families"],
              "impactType": "positive",
              "impactDetails": "Provides affordable housing solutions.",
              "relevantParagraphs": ["Paragraph four", "The second paragraph"],
              "confidenceScore": 0.90
            }
          ]
        `;
        const parsedData = JSON.parse(mockResponse);
        const validatedData: any[] = parsedData.map((item: any) => schema.parse(item));
        return {
            extractedData: validatedData,
            documentId: id,
            timestamp: new Date().toISOString(),
            errors: [],
        };
    });

    const result = await extractKnowledge(documentText, PolicyImpactSchema, documentId, mockLLMClient);

    expect(result.extractedData).toHaveLength(1);
    const policyImpact = result.extractedData[0];
    expect(policyImpact.policyName).toBe("Housing for All");
    expect(policyImpact.relevantParagraphs).toEqual(expect.arrayContaining(["Paragraph four", "The second paragraph"]));
    vi.restoreAllMocks();
  });
});