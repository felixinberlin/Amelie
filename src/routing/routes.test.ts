import { describe, it, expect } from 'vitest';
import { ALL_NAV_TABS } from '../data/navigation';
import { parsePageRoute, legacyDestination, dosePath, chapterPath, simulatorPath, tabPath, withPreferences } from './routes';

describe('page routing', () => {
  it('roundtrips every section and nested destination', () => {
    for (const tab of ALL_NAV_TABS) expect(parsePageRoute(tabPath(tab))).toEqual({ kind: 'tab', tab });
    expect(parsePageRoute(dosePath('a b'))).toEqual({ kind: 'dose', tab: 'dosen', doseId: 'a b' });
    expect(parsePageRoute(chapterPath('a', 'b'))).toEqual({ kind: 'dose', tab: 'dosen', doseId: 'a', chapter: 'b' });
    expect(parsePageRoute(simulatorPath('chemhazard'))).toEqual({ kind: 'simulator', tab: 'sandboxes', simulator: 'chemhazard' });
    expect(parsePageRoute('/dosen/', '?dose=local')).toEqual({ kind: 'dose', tab: 'dosen', doseId: 'local' });
  });
  it.each(['/wat/', '/dosen/%E0%A4%A/', '/dosen/a%2Fb/', '/dosen/a/nope/x/', '/simulators/unknown/'])('rejects unknown or malformed paths: %s', path => {
    expect(parsePageRoute(path).kind).toBe('not-found');
  });
  it.each(['#dose=one', '#/dose=one', '#/dose/one'])('supports old dose links: %s', hash => {
    expect(legacyDestination('?admin=1', hash)).toBe('/dosen/one/?admin=1');
  });
  it('normalizes old chapters, simulators, ventures and comparison selections', () => {
    expect(legacyDestination('', '#dose=one&buch=two&lang=es')).toBe('/dosen/one/book/two/?lang=es');
    expect(legacyDestination('', '#sim=altbau-thermal')).toBe('/simulators/altbau/');
    expect(legacyDestination('', '#/sandbox/glasanflug')).toBe('/simulators/glasanflug/');
    expect(legacyDestination('', '#venture=farmacia-mandate-engine')).toBe('/ventures/farmacia-mandate-engine/');
    expect(legacyDestination('', '#compare=')).toBe('/compare/?items=');
    expect(legacyDestination('?dose=one&chapter=two&lang=de', '#footnote')).toBe('/dosen/one/book/two/?lang=de#footnote');
    expect(legacyDestination('?lang=de', '#footnote')).toBeNull();
  });
  it('carries only preferences when switching sections', () => {
    expect(withPreferences('/games/', '?items=a&dose=b&lang=es&admin=1&mood=cinema')).toBe('/games/?lang=es&admin=1&mood=cinema');
  });
});
