// 07-demos/ethos-guard/index.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ingestPolicyDocument,
  analyzeResearchProject,
  getPolicyDocument,
  PolicyDocument,
  ResearchProjectDescription,
  ComplianceBriefing
} from '../../src/api/ethos-guard/index'; // Adjust path as necessary

describe('EthosGuard API', () => {
  beforeEach(() => {
    // Reset mocks or state before each test
    vi.clearAllMocks();
  });

  it('should successfully ingest a policy document and return an ID', async () => {
    const mockPolicy: PolicyDocument = {
      id: 'mock-policy-1',
      title: 'Mock University Data Retention Policy',
      content: 'This policy outlines the retention periods for all research data...',
      sourceUrl: 'https://mockuni.edu/policy/data-retention.pdf',
      lastUpdated: new Date(),
      metadata: { department: 'IT', type: 'data-management' }
    };

    const policyId = await ingestPolicyDocument(mockPolicy);
    expect(policyId).toBeTypeOf('string');
    expect(policyId).toMatch(/^policy-\d+$/);
  });

  it('should generate a compliance briefing for a research project', async () => {
    const mockProject: ResearchProjectDescription = {
      title: 'Study on Student Mental Health in Remote Learning',
      abstract: 'This project aims to assess the impact of remote learning on student mental health through anonymous surveys and interviews.',
      keywords: ['mental health', 'students', 'remote learning', 'survey', 'interview'],
      dataTypes: ['anonymized-survey-responses', 'qualitative-interview-transcripts'],
      methodologyOverview: 'Mixed-methods approach using online surveys and semi-structured interviews with voluntary participants.',
      targetAudience: 'University students'
    };

    const briefing: ComplianceBriefing = await analyzeResearchProject(mockProject);

    expect(briefing).toBeDefined();
    expect(briefing.projectId).toBeTypeOf('string');
    expect(briefing.relevantPolicies).toBeInstanceOf(Array);
    expect(briefing.relevantPolicies.length).toBeGreaterThan(0);

    const ethicsPolicy = briefing.relevantPolicies.find(p => p.policyId === 'ethic-guidelines-v2');
    expect(ethicsPolicy).toBeDefined();
    expect(ethicsPolicy?.summary).toContain('ethics committee');
    expect(ethicsPolicy?.riskLevel).toBe('high');

    const gdprPolicy = briefing.relevantPolicies.find(p => p.policyTitle?.includes('Data Privacy Policy'));
    expect(gdprPolicy).toBeDefined();
    expect(gdprPolicy?.summary).toContain('GDPR');
    expect(gdprPolicy?.riskLevel).toBe('medium');

    expect(briefing.overallRecommendations.length).toBeGreaterThan(0);
    expect(briefing.potentialRedFlags.length).toBeGreaterThan(0);
  });

  it('should retrieve a specific policy document by ID', async () => {
    const policyIdToRetrieve = 'ethic-guidelines-v2';
    const policy = await getPolicyDocument(policyIdToRetrieve);

    expect(policy).toBeDefined();
    expect(policy?.id).toBe(policyIdToRetrieve);
    expect(policy?.title).toBe('University Ethics Guidelines v2.0');
    expect(policy?.sourceUrl).toBe('https://www.uni.edu/policies/ethics-v2.pdf');
  });

  it('should return null if a policy document is not found', async () => {
    const nonExistentPolicyId = 'non-existent-policy-id';
    const policy = await getPolicyDocument(nonExistentPolicyId);
    expect(policy).toBeNull();
  });
});
