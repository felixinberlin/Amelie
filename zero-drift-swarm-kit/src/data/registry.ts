/**
 * Central Feature & Model Registry
 * 
 * NOTE: Every entry here must have a corresponding specification in `specs/<id>.md`.
 * The drift-guard script (`scripts/check-drift.mjs`) will fail in CI if these drift apart.
 */

export interface RegisteredFeature {
  id: string;
  name: string;
  version: string;
  stage: 'experimental' | 'stable' | 'deprecated';
  description: string;
}

export const FEATURE_REGISTRY: RegisteredFeature[] = [
  {
    id: 'sample-feature',
    name: 'Sample Deterministic State Engine',
    version: '1.0.0',
    stage: 'stable',
    description: 'Deterministic finite-state machine with strict transition guards.'
  }
];
