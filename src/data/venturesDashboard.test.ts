import { describe, it, expect } from 'vitest';
import { averageVectors, isScores, total, VentureLead } from './venturesDashboard';
import { parseVectors } from '../../scripts/export-ventures.mjs';

const lead = (id: string, v: VentureLead['vectors']): VentureLead => ({
  id, name: id, category: 'x', stage: 's', pricingModel: 'p', targetPrice: '', targetAudience: '',
  amelieTwin: '', mvpEngineReady: false, lastUpdated: '', vectors: v,
});

describe('ventures dashboard', () => {
  it('summiert und mittelt Scores, ignoriert Leads ohne Scores', () => {
    const a = { w: 4, t: 2, c: 2, m: 4, d: 2 };
    const b = { w: 2, t: 4, c: 4, m: 2, d: 4 };
    expect(total(a)).toBe(14);
    expect(averageVectors([lead('a', a), lead('b', b), lead('c', null)])).toEqual({ w: 3, t: 3, c: 3, m: 3, d: 3 });
    expect(averageVectors([lead('c', null)])).toBeNull();
    expect(isScores({ w: 6, t: 1, c: 1, m: 1, d: 1 })).toBe(false);
  });

  it('liest die fünf Vektorzeilen eines Dossiers', () => {
    const md = ['| Vector | Nota |', '|---|:---:|',
      '| **1. A** | 4/5 | x |', '| **2. B** | **2/5** | x |', '| **3. C** | 2/5 | x |',
      '| **4. D** | 4/5 | x |', '| **5. E** | 2/5 | x |'].join('\n');
    expect(parseVectors(md)).toEqual({ w: 4, t: 2, c: 2, m: 4, d: 2 });
    expect(parseVectors('| **1. A** | 4/5 |')).toBeNull();
  });
});
