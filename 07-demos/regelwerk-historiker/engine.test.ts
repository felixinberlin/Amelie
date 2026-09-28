import { describe, it, expect, vi } from 'vitest';
import { analyzeRegulatoryDrift } from '../src/regulatoryHistorian';
import { GitService } from '../src/services/gitService';
import { LLMService } from '../src/services/llmService';
import { DocumentParser } from '../src/utils/documentParser';

// Mock dependencies
vi.mock('../src/services/gitService');
vi.mock('../src/services/llmService');
vi.mock('../src/utils/documentParser');

describe('analyzeRegulatoryDrift', () => {
  it('should identify semantic changes and cumulative impact between two versions of a regulation', async () => {
    const mockRepoPath = '/mock/repo';
    const mockCommitHashV1 = 'abcdef1';
    const mockCommitHashV2 = 'fedcba2';
    const mockFilePath = 'regulations/energy_efficiency.md';

    // Mock GitService to return file content for different versions
    GitService.prototype.getFileContentAtCommit = vi.fn(async (repoPath, commitHash, filePath) => {
      if (commitHash === mockCommitHashV1) {
        return '# Energy Efficiency Regulation\n\n## Article 1: Scope\nThis regulation applies to all buildings constructed after 2020.\n\n## Article 2: Standards\nMinimum insulation R-value is 3.5.';
      } else if (commitHash === mockCommitHashV2) {
        return '# Energy Efficiency Regulation\n\n## Article 1: Scope\nThis regulation applies to all *residential and commercial* buildings constructed after 2020.\n\n## Article 2: Standards\nMinimum insulation R-value is 4.0 for residential, and 3.8 for commercial.';
      }
      return '';
    });

    // Mock DocumentParser to return structured content
    DocumentParser.prototype.parseMarkdown = vi.fn((markdownContent) => {
      if (markdownContent.includes('residential and commercial')) {
        return { title: 'Energy Efficiency Regulation', articles: [{ id: '1', heading: 'Scope', content: 'This regulation applies to all residential and commercial buildings constructed after 2020.' }, { id: '2', heading: 'Standards', content: 'Minimum insulation R-value is 4.0 for residential, and 3.8 for commercial.' }] };
      } else {
        return { title: 'Energy Efficiency Regulation', articles: [{ id: '1', heading: 'Scope', content: 'This regulation applies to all buildings constructed after 2020.' }, { id: '2', heading: 'Standards', content: 'Minimum insulation R-value is 3.5.' }] };
      }
    });

    // Mock LLMService to simulate semantic diffing and impact analysis
    LLMService.prototype.getSemanticDiff = vi.fn(async (docV1, docV2) => {
      // Simulate LLM output for semantic changes
      return {
        conceptualChanges: [
          { article: '1', type: 'Scope Expansion', description: 'The scope of the regulation has been explicitly expanded to include both residential and commercial buildings, where it was previously generic.' },
          { article: '2', type: 'Standard Increase & Differentiation', description: 'Minimum insulation standards have been increased and differentiated for residential (4.0) and commercial (3.8) buildings.' }
        ],
        cumulativeImpactSummary: 'Overall, the regulation has become more stringent and specific, particularly for building types. This increases compliance burden but aims for higher energy efficiency.',
        potentialInconsistencies: []
      };
    });

    const result = await analyzeRegulatoryDrift(mockRepoPath, mockCommitHashV1, mockCommitHashV2, mockFilePath);

    expect(GitService.prototype.getFileContentAtCommit).toHaveBeenCalledTimes(2);
    expect(DocumentParser.prototype.parseMarkdown).toHaveBeenCalledTimes(2);
    expect(LLMService.prototype.getSemanticDiff).toHaveBeenCalledWith(
      expect.any(Object), // Structured doc V1
      expect.any(Object)  // Structured doc V2
    );

    expect(result.conceptualChanges).toHaveLength(2);
    expect(result.conceptualChanges[0].type).toBe('Scope Expansion');
    expect(result.cumulativeImpactSummary).toContain('more stringent and specific');
  });

  it('should detect potential inconsistencies introduced by a change', async () => {
    const mockRepoPath = '/mock/repo';
    const mockCommitHashV1 = 'gfedcb3';
    const mockCommitHashV2 = 'hijklm4';
    const mockFilePath = 'regulations/water_quality.md';

    GitService.prototype.getFileContentAtCommit = vi.fn(async (repoPath, commitHash, filePath) => {
      if (commitHash === mockCommitHashV1) {
        return '# Water Quality Standards\n\n## Section A: Testing Frequency\nWater quality tests must be conducted monthly.\n\n## Section B: Reporting\nAll results must be reported to the central authority within 7 days.';
      } else if (commitHash === mockCommitHashV2) {
        return '# Water Quality Standards\n\n## Section A: Testing Frequency\nWater quality tests must be conducted *quarterly* for small municipalities.\n\n## Section B: Reporting\nAll results must be reported to the central authority within *3 days*.';
      }
      return '';
    });

    DocumentParser.prototype.parseMarkdown = vi.fn((content) => ({ content })); // Simplified for this test

    LLMService.prototype.getSemanticDiff = vi.fn(async (docV1, docV2) => {
      return {
        conceptualChanges: [
          { article: 'A', type: 'Reduced Frequency', description: 'Testing frequency reduced for small municipalities.' },
          { article: 'B', type: 'Accelerated Reporting', description: 'Reporting deadline shortened.' }
        ],
        cumulativeImpactSummary: 'Mixed impact: less frequent testing but faster reporting.',
        potentialInconsistencies: [
          { type: 'Conflicting Requirements', description: 'Faster reporting (3 days) for less frequent tests (quarterly) might indicate an oversight, as the urgency for reporting might be misaligned with the reduced testing frequency.' }
        ]
      };
    });

    const result = await analyzeRegulatoryDrift(mockRepoPath, mockCommitHashV1, mockCommitHashV2, mockFilePath);

    expect(result.potentialInconsistencies).toHaveLength(1);
    expect(result.potentialInconsistencies[0].type).toBe('Conflicting Requirements');
  });

  // Dummy implementation for the main function to be tested
  // In a real scenario, this would orchestrate the services
  async function analyzeRegulatoryDrift(repoPath: string, commitV1: string, commitV2: string, filePath: string) {
    const gitService = new GitService();
    const llmService = new LLMService();
    const documentParser = new DocumentParser();

    const contentV1 = await gitService.getFileContentAtCommit(repoPath, commitV1, filePath);
    const contentV2 = await gitService.getFileContentAtCommit(repoPath, commitV2, filePath);

    const structuredDocV1 = documentParser.parseMarkdown(contentV1);
    const structuredDocV2 = documentParser.parseMarkdown(contentV2);

    const semanticDiffReport = await llmService.getSemanticDiff(structuredDocV1, structuredDocV2);

    return semanticDiffReport;
  }
});
