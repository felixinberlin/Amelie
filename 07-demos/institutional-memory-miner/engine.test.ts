// 07-demos/im-miner.test.ts
import { describe, it, expect } from 'vitest';
import { KnowledgeGap, ExpertProfile, KnowledgeArtifact, ElicitationTemplate, validateKnowledgeGap, validateKnowledgeArtifact } from '../src/types/im-miner'; // Assuming types are in '../src/types/im-miner.ts'

describe('IM Miner Core Data Structures', () => {

  it('should validate a correctly structured KnowledgeGap', () => {
    const validGap: KnowledgeGap = {
      id: 'gap-001',
      title: 'Grant Application Process for EU Funds',
      description: 'Critical steps and common pitfalls for applying to Horizon Europe grants after Dr. Schmidt\'s departure.',
      priority: 'critical',
      status: 'open',
      responsibleTeamId: 'team-research-grants',
      targetRoleId: 'research-coordinator',
      expectedLossDate: '2024-12-31',
      linkedArtifactIds: [],
    };
    expect(validateKnowledgeGap(validGap)).toBe(true);
  });

  it('should invalidate a KnowledgeGap with missing required fields', () => {
    const invalidGap: KnowledgeGap = {
      id: 'gap-002',
      title: 'Budget Approval Workflow',
      // description is missing
      priority: 'high',
      status: 'open',
      linkedArtifactIds: [],
    };
    expect(validateKnowledgeGap(invalidGap as KnowledgeGap)).toBe(false);

    const invalidStatusGap: KnowledgeGap = {
      id: 'gap-003',
      title: 'Legacy System Maintenance',
      description: 'How to restart the old server.',
      priority: 'medium',
      status: 'unknown-status' as any, // Invalid status
      linkedArtifactIds: [],
    };
    expect(validateKnowledgeGap(invalidStatusGap)).toBe(false);
  });

  it('should validate a correctly structured KnowledgeArtifact', () => {
    const validArtifact: KnowledgeArtifact = {
      id: 'art-001',
      title: 'Horizon Europe Grant Application - Step-by-Step',
      knowledgeType: 'process',
      contentMarkdown: '## Step 1: Pre-application check\n...\n## Step 2: Form filling\n...',
      tags: ['grants', 'EU', 'Horizon Europe'],
      contributorId: 'expert-001',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      version: 1,
      reviewDate: '2025-01-15',
      elicitationTemplateId: 'template-process',
      linkedGapIds: ['gap-001'],
    };
    expect(validateKnowledgeArtifact(validArtifact)).toBe(true);
  });

  it('should invalidate a KnowledgeArtifact with missing required fields', () => {
    const invalidArtifact: KnowledgeArtifact = {
      id: 'art-002',
      title: 'Decision on Q3 Budget',
      knowledgeType: 'decision-rationale',
      // contentMarkdown is missing
      tags: ['budget', 'Q3'],
      contributorId: 'expert-002',
      createdAt: '2024-03-01T14:00:00Z',
      updatedAt: '2024-03-01T14:00:00Z',
      version: 1,
      linkedGapIds: [],
    };
    expect(validateKnowledgeArtifact(invalidArtifact as KnowledgeArtifact)).toBe(false);

    const invalidVersionArtifact: KnowledgeArtifact = {
      id: 'art-003',
      title: 'Common Network Issues',
      knowledgeType: 'troubleshooting',
      contentMarkdown: 'Reboot router first.',
      tags: ['network'],
      contributorId: 'expert-003',
      createdAt: '2024-02-20T09:00:00Z',
      updatedAt: '2024-02-20T09:00:00Z',
      version: 'invalid' as any, // Invalid version type
      linkedGapIds: [],
    };
    expect(validateKnowledgeArtifact(invalidVersionArtifact)).toBe(false);
  });

  it('should allow a KnowledgeArtifact to be created without an elicitation template', () => {
    const artifactWithoutTemplate: KnowledgeArtifact = {
      id: 'art-004',
      title: 'Ad-hoc finding',
      knowledgeType: 'lessons-learned',
      contentMarkdown: 'Learned something new.',
      tags: ['ad-hoc'],
      contributorId: 'expert-004',
      createdAt: '2024-04-01T08:00:00Z',
      updatedAt: '2024-04-01T08:00:00Z',
      version: 1,
      linkedGapIds: [],
      // elicitationTemplateId is optional, so it can be omitted
    };
    expect(validateKnowledgeArtifact(artifactWithoutTemplate)).toBe(true);
  });

  it('should allow a KnowledgeGap to be created without an expected loss date or responsible team', () => {
    const gapWithoutOptionalFields: KnowledgeGap = {
      id: 'gap-004',
      title: 'New policy integration',
      description: 'How to integrate the new data protection policy into daily workflows.',
      priority: 'high',
      status: 'in-progress',
      linkedArtifactIds: [],
      // expectedLossDate and responsibleTeamId are optional
    };
    expect(validateKnowledgeGap(gapWithoutOptionalFields)).toBe(true);
  });
});