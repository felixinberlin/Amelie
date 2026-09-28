import { DoseStatus, Verdict, DomainCategory } from '../types';

export interface AuditFinding {
  id: string;
  severity: 'info' | 'warning' | 'error';
  category:
    | 'inventory'
    | 'integrity'
    | 'documentation'
    | 'research'
    | 'demo'
    | 'test'
    | 'architecture';
  message: string;
  file?: string;
  relatedId?: string;
  details?: Record<string, unknown>;
}

export interface AuditCheckResult {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'not_available';
  findings: AuditFinding[];
}

export interface AmelieHealth {
  auditVersion: number;
  generatedAt: string;
  repository: {
    commit?: string;
    branch?: string;
  };

  inventory: {
    doses: number;
    graves: number;
    demos: number;
    researchEntries: number;
    candidateIdeas: number;
    books: number;
  };

  distributions: {
    doseStatus: Record<string, number>;
    doseVerdict: Record<string, number>;
    doseDomain: Record<string, number>;
    graveCategory: Record<string, number>;
  };

  checks: AuditCheckResult[];
  findings: AuditFinding[];

  generatedFiles: {
    json: string;
    markdown: string;
  };
}

export interface AuditCollectorContext {
  repoRoot: string;
}

export interface AuditCheckModule {
  id: string;
  description: string;
  run(context: AuditCollectorContext): AuditFinding[];
}
