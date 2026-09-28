import { describe, it, expect, vi } from 'vitest';
import { OpenScienceVerifier } from './src/open-science-verifier';
import type { VerificationReport, PaperMetadata } from './src/types';

// Mock PDF parsing and text extraction capabilities
vi.mock('./src/pdf-parser', () => ({
  parsePdf: vi.fn(async (file: File) => {
    if (file.name.includes('transparent')) {
      return {
        text: 'This is a highly transparent study. Data available at https://zenodo.org/record/123. Code at https://github.com/org/repo. Funding: DFG. Authors: A. Smith (Uni Berlin), B. Jones.',
        metadata: {
          title: 'A Transparent Study on X',
          author: 'A. Smith, B. Jones',
          date: '2023-01-01'
        }
      };
    } else if (file.name.includes('opaque')) {
      return {
        text: 'An opaque study. No data or code links provided. Funding: Private Corp. Authors: C. Doe.',
        metadata: {
          title: 'An Opaque Study on Y',
          author: 'C. Doe',
          date: '2022-06-15'
        }
      };
    } else if (file.name.includes('error')) {
      throw new Error('PDF parsing failed');
    }
    return { text: 'Generic text.', metadata: {} };
  }),
}));

describe('OpenScienceVerifier', () => {
  const verifier = new OpenScienceVerifier();

  it('should correctly parse metadata and identify open science indicators for a transparent paper', async () => {
    const mockFile = new File(['dummy content'], 'transparent_paper.pdf', { type: 'application/pdf' });
    const report: VerificationReport = await verifier.verifyPaper(mockFile);

    expect(report.metadata.title).toBe('A Transparent Study on X');
    expect(report.metadata.author).toBe('A. Smith, B. Jones');
    expect(report.metadata.funders).toContain('DFG');
    expect(report.dataAvailability.isDetected).toBe(true);
    expect(report.dataAvailability.links).toContain('https://zenodo.org/record/123');
    expect(report.codeAvailability.isDetected).toBe(true);
    expect(report.codeAvailability.links).toContain('https://github.com/org/repo');
    expect(report.transparencyScore).toBeGreaterThan(70);
    expect(report.keyClaims).toContain('highly transparent study');
  });

  it('should correctly identify lack of open science indicators for an opaque paper', async () => {
    const mockFile = new File(['dummy content'], 'opaque_paper.pdf', { type: 'application/pdf' });
    const report: VerificationReport = await verifier.verifyPaper(mockFile);

    expect(report.metadata.title).toBe('An Opaque Study on Y');
    expect(report.metadata.author).toBe('C. Doe');
    expect(report.metadata.funders).toContain('Private Corp');
    expect(report.dataAvailability.isDetected).toBe(false);
    expect(report.dataAvailability.links).toEqual([]);
    expect(report.codeAvailability.isDetected).toBe(false);
    expect(report.codeAvailability.links).toEqual([]);
    expect(report.transparencyScore).toBeLessThan(30);
    expect(report.keyClaims).toContain('opaque study');
  });

  it('should handle PDF parsing errors gracefully', async () => {
    const mockFile = new File(['dummy content'], 'error_paper.pdf', { type: 'application/pdf' });
    await expect(verifier.verifyPaper(mockFile)).rejects.toThrow('Failed to process PDF: PDF parsing failed');
  });

  it('should calculate transparency score based on indicators', async () => {
    const mockFile = new File(['dummy content'], 'mixed_paper.pdf', { type: 'application/pdf' });
    vi.mocked(require('./src/pdf-parser').parsePdf).mockResolvedValueOnce({
      text: 'Some text. Data at zenodo.org/data. No code mentioned. Funding: Public Grant.',
      metadata: { title: 'Mixed Paper', author: 'D. E. F.', date: '2023-03-01' }
    });
    const report = await verifier.verifyPaper(mockFile);

    expect(report.dataAvailability.isDetected).toBe(true);
    expect(report.codeAvailability.isDetected).toBe(false);
    // Score should be moderate, reflecting one indicator present
    expect(report.transparencyScore).toBeGreaterThan(40);
    expect(report.transparencyScore).toBeLessThan(70);
  });

  it('should extract funders correctly from various patterns', async () => {
    const mockFile = new File(['dummy content'], 'funders_paper.pdf', { type: 'application/pdf' });
    vi.mocked(require('./src/pdf-parser').parsePdf).mockResolvedValueOnce({
      text: 'This work was supported by the Grant Agency (GA). Further funding from the Ministry of Science. No other funding.',
      metadata: { title: 'Funded Research', author: 'X. Y. Z.', date: '2024-01-01' }
    });
    const report = await verifier.verifyPaper(mockFile);

    expect(report.metadata.funders).toEqual(expect.arrayContaining(['Grant Agency', 'Ministry of Science']));
  });
});

// src/open-science-verifier.ts (Simplified for snippet)

import { parsePdf } from './pdf-parser';

export interface DataAvailability {
  isDetected: boolean;
  links: string[];
}

export interface CodeAvailability {
  isDetected: boolean;
  links: string[];
}

export interface PaperMetadata {
  title: string;
  author: string;
  date: string;
  funders: string[];
}

export interface VerificationReport {
  metadata: PaperMetadata;
  dataAvailability: DataAvailability;
  codeAvailability: CodeAvailability;
  methodologyDescription: { isDetailed: boolean; excerpt: string | null };
  keyClaims: string[];
  transparencyScore: number;
  rawText: string;
}

export class OpenScienceVerifier {
  async verifyPaper(file: File): Promise<VerificationReport> {
    let parsed;
    try {
      parsed = await parsePdf(file);
    } catch (error: any) {
      throw new Error(`Failed to process PDF: ${error.message}`);
    }

    const { text, metadata } = parsed;

    const dataAvailability = this.checkDataAvailability(text);
    const codeAvailability = this.checkCodeAvailability(text);
    const funders = this.extractFunders(text);
    const keyClaims = this.extractKeyClaims(text);
    const methodology = this.checkMethodology(text);

    const transparencyScore = this.calculateTransparencyScore(
      dataAvailability.isDetected,
      codeAvailability.isDetected,
      methodology.isDetailed
    );

    return {
      metadata: { ...metadata, funders },
      dataAvailability,
      codeAvailability,
      methodologyDescription: methodology,
      keyClaims,
      transparencyScore,
      rawText: text,
    };
  }

  private checkDataAvailability(text: string): DataAvailability {
    const dataLinksRegex = /(https?:\/\/(?:zenodo\.org|osf\.io|datadryad\.org)\/[^\s"',)]+)/gi;
    const matches = Array.from(text.matchAll(dataLinksRegex)).map(match => match[1]);
    return { isDetected: matches.length > 0, links: [...new Set(matches)] };
  }

  private checkCodeAvailability(text: string): CodeAvailability {
    const codeLinksRegex = /(https?:\/\/github\.com\/[^\s"',)]+)/gi;
    const matches = Array.from(text.matchAll(codeLinksRegex)).map(match => match[1]);
    return { isDetected: matches.length > 0, links: [...new Set(matches)] };
  }

  private extractFunders(text: string): string[] {
    const fundingRegex = /(?:funded by|support(?:ed)? by|grant from|acknowledgements contain|financial support from)\s+([A-Z][a-zA-Z0-9\s&.,-]{5,100})(?:[.,;]|$)/gi;
    const matches = Array.from(text.matchAll(fundingRegex)).map(match => match[1].trim());
    // Add more specific patterns or use LLM for better extraction
    return [...new Set(matches)];
  }

  private extractKeyClaims(text: string): string[] {
    // Simplified: just extract first few sentences or a specific section if available
    const summaryMatch = text.match(/(?:Abstract|Summary|Introduction)\s+([\s\S]{100,500})/i);
    if (summaryMatch) {
      return [summaryMatch[1].replace(/\s+/g, ' ').trim() + '...'];
    }
    return [text.substring(0, 200).replace(/\s+/g, ' ').trim() + '...'];
  }

  private checkMethodology(text: string): { isDetailed: boolean; excerpt: string | null } {
    const methodologySectionRegex = /(?:Methods|Methodology|Experimental Procedures)[\s\S]{200,}/i;
    const match = text.match(methodologySectionRegex);
    if (match) {
      return { isDetailed: true, excerpt: match[0].substring(0, 300).replace(/\s+/g, ' ').trim() + '...' };
    }
    return { isDetailed: false, excerpt: null };
  }

  private calculateTransparencyScore(
    hasData: boolean,
    hasCode: boolean,
    hasDetailedMethodology: boolean
  ): number {
    let score = 0;
    if (hasData) score += 35;
    if (hasCode) score += 35;
    if (hasDetailedMethodology) score += 20;
    // Add baseline for basic metadata or other factors
    score += 10; 
    return Math.min(score, 100);
  }
}

// src/pdf-parser.ts (Mock implementation for snippet)

export async function parsePdf(file: File): Promise<{ text: string; metadata: any }> {
  // In a real application, this would use a library like pdf.js or pdf-parse
  // For the test snippet, it's mocked in the test file.
  return { text: '', metadata: {} };
}
