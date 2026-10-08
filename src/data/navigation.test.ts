import { describe, it, expect } from 'vitest';
import { NAV_SECTIONS, ALL_NAV_TABS, sectionOfTab, visibleSections } from './navigation';

describe('navigation', () => {
  it('jeder Tab liegt in genau einem Bereich', () => {
    expect(new Set(ALL_NAV_TABS).size).toBe(ALL_NAV_TABS.length);
  });
  it('kein Bereich ist überladen', () => {
    for (const s of NAV_SECTIONS) expect(s.tabs.length).toBeLessThanOrEqual(8);
  });
  it('alle 21 Ziele sind erreichbar', () => {
    const expected = ['dosen', 'matrix', 'games', 'compare', 'funding', 'manifest', 'unpacked', 'sandboxes', 'normal-jobs', 'whimsy',
      'packer', 'quellen', 'relatives', 'reddit', 'playbook', 'google-import', 'data-hub', 'audit', 'muster-emails', 'discarded', 'ventures'];
    expect([...ALL_NAV_TABS].sort()).toEqual([...expected].sort());
  });
  it('Werkstatt erscheint nur im Admin-Modus oder wenn ein Tab daraus aktiv ist', () => {
    expect(visibleSections('dosen', false).map((s) => s.id)).not.toContain('workshop');
    expect(visibleSections('dosen', true).map((s) => s.id)).toContain('workshop');
    expect(visibleSections('packer', false).map((s) => s.id)).toContain('workshop');
  });
  it('sectionOfTab findet den Bereich', () => expect(sectionOfTab('reddit')?.id).toBe('research'));
});
