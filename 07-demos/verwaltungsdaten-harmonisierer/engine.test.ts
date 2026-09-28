// 07-demos/verwaltungsdaten-harmonisierer.test.ts
import { describe, it, expect } from 'vitest';

interface HarmonizationRule {
  type: 'replace' | 'format' | 'infer_type';
  pattern?: string | RegExp;
  replacement?: string;
  targetType?: string;
  valueMap?: Record<string, string>;
}

interface HarmonizationResult {
  processedData: (string | number | boolean | null)[];
  appliedRules: HarmonizationRule[];
  inconsistenciesFound: number;
}

/**
 * Simulates an AI suggestion for a harmonization rule based on column data.
 * In a real scenario, this would involve LLM calls or advanced heuristics.
 */
function aiSuggestNormalization(columnData: string[]): HarmonizationRule | null {
  const uniqueValues = new Set(columnData.map(s => s.toLowerCase()));
  if (uniqueValues.has('berlin') && uniqueValues.has('berlin') && uniqueValues.has('bln')) {
    return {
      type: 'replace',
      valueMap: {
        'berlin': 'Berlin',
        'BERLIN': 'Berlin',
        'Bln': 'Berlin'
      }
    };
  }
  if (columnData.every(val => /\d{1,2}\.\d{1,2}\.\d{4}/.test(val))) {
    return { type: 'format', targetType: 'date', pattern: 'DD.MM.YYYY' };
  }
  return null;
}

/**
 * Applies a given harmonization rule to a column of data.
 */
function applyHarmonizationRule(data: string[], rule: HarmonizationRule): (string | number | boolean | null)[] {
  return data.map(item => {
    if (rule.type === 'replace' && rule.valueMap) {
      const lowerItem = item.toLowerCase();
      return rule.valueMap[lowerItem] !== undefined ? rule.valueMap[lowerItem] : item;
    }
    if (rule.type === 'format' && rule.targetType === 'date' && rule.pattern === 'DD.MM.YYYY') {
      // Simple date format conversion for test purposes
      const parts = item.split('.');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    // Add more rule types as needed
    return item;
  });
}

/**
 * Main function to harmonize a column, potentially using AI suggestions.
 */
function harmonizeColumn(columnData: string[], useAi: boolean = true): HarmonizationResult {
  let processedData = [...columnData];
  const appliedRules: HarmonizationRule[] = [];
  let inconsistenciesFound = 0;

  if (useAi) {
    const aiRule = aiSuggestNormalization(columnData);
    if (aiRule) {
      processedData = applyHarmonizationRule(processedData as string[], aiRule);
      appliedRules.push(aiRule);
      // For simplicity, count changes as inconsistencies fixed
      inconsistenciesFound = columnData.filter((val, i) => val !== processedData[i]).length;
    }
  }

  // Basic consistency check after AI/manual rules
  const uniqueValues = new Set(processedData.map(String));
  if (uniqueValues.size < columnData.length && inconsistenciesFound === 0) {
    // If AI didn't catch it, and there are still duplicates after initial processing
    inconsistenciesFound = columnData.length - uniqueValues.size;
  }

  return {
    processedData,
    appliedRules,
    inconsistenciesFound
  };
}

describe('harmonizeColumn', () => {
  it('should normalize city names using AI suggestion', () => {
    const data = ['Berlin', 'berlin', 'BERLIN', 'Bln', 'Hamburg'];
    const result = harmonizeColumn(data);
    expect(result.processedData).toEqual(['Berlin', 'Berlin', 'Berlin', 'Berlin', 'Hamburg']);
    expect(result.appliedRules.length).toBe(1);
    expect(result.inconsistenciesFound).toBe(3); // 'berlin', 'BERLIN', 'Bln' changed
  });

  it('should format dates using AI suggestion', () => {
    const data = ['01.01.2023', '15.12.2022', '05.03.2021'];
    const result = harmonizeColumn(data);
    expect(result.processedData).toEqual(['2023-01-01', '2022-12-15', '2021-03-05']);
    expect(result.appliedRules.length).toBe(1);
    expect(result.appliedRules[0].targetType).toBe('date');
  });

  it('should return original data if no AI rule applies', () => {
    const data = ['Apples', 'Bananas', 'Oranges'];
    const result = harmonizeColumn(data);
    expect(result.processedData).toEqual(['Apples', 'Bananas', 'Oranges']);
    expect(result.appliedRules.length).toBe(0);
    expect(result.inconsistenciesFound).toBe(0);
  });

  it('should handle mixed data gracefully without AI', () => {
    const data = ['Berlin', 'Hamburg', 'berlin'];
    const result = harmonizeColumn(data, false); // Disable AI
    expect(result.processedData).toEqual(['Berlin', 'Hamburg', 'berlin']);
    expect(result.appliedRules.length).toBe(0);
    // No AI, so it might not see 'berlin' as an inconsistency to fix automatically here
    // More sophisticated checks would be needed for non-AI inconsistency detection
    expect(result.inconsistenciesFound).toBe(0); 
  });

  it('should count inconsistencies even if not fully harmonized by AI', () => {
    const data = ['Berlin', 'berlin', 'BERLIN', 'Bln', 'Hamburg', 'hamburg'];
    const result = harmonizeColumn(data); // AI should fix Berlin, but not Hamburg here
    expect(result.processedData).toEqual(['Berlin', 'Berlin', 'Berlin', 'Berlin', 'Hamburg', 'hamburg']);
    expect(result.appliedRules.length).toBe(1);
    // 3 for Berlin variations + 1 for 'hamburg' which AI didn't fix but is an inconsistency
    expect(result.inconsistenciesFound).toBe(4);
  });
});
