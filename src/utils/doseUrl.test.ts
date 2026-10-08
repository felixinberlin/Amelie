// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getBaseUrl, getDoseUrl, getDeliveryDoseUrl, getSimulatorUrl, getBookChapterUrl, getCompareUrl, resolveEmailBodyDoseUrls, parseDoseIdFromUrl, parseBookSlugFromUrl, parseCompareFromUrl } from './doseUrl';

describe('permanent URLs', () => {
  beforeEach(() => vi.stubEnv('BASE_URL', '/Amelie/'));
  afterEach(() => vi.unstubAllEnvs());
  it('builds from the configured deployment base instead of the current nested page', () => {
    window.history.replaceState(null, '', '/Amelie/dosen/strassennamen-pruefer/book/intro/?lang=es');
    expect(getBaseUrl()).toBe(window.location.origin + '/Amelie/');
    expect(getDoseUrl('strassennamen-pruefer')).toBe(window.location.origin + '/Amelie/dosen/strassennamen-pruefer/?lang=es');
    expect(getBookChapterUrl('strassennamen-pruefer', 'intro')).toContain('/Amelie/dosen/strassennamen-pruefer/book/intro/?lang=es');
    expect(parseDoseIdFromUrl()).toBe('strassennamen-pruefer');
    expect(parseBookSlugFromUrl()).toBe('intro');
  });
  it('keeps email links at the root anchor and local-only links refresh-safe', () => {
    window.history.replaceState(null, '', '/Amelie/games/');
    expect(getDeliveryDoseUrl('a b')).toBe(window.location.origin + '/Amelie/#dose=a%20b');
    expect(resolveEmailBodyDoseUrls('Gift: [Link to tin]', ['a'])).toBe('Gift: ' + window.location.origin + '/Amelie/#dose=a');
    expect(getDoseUrl('local-only')).toBe(window.location.origin + '/Amelie/dosen/?dose=local-only');
  });
  it('supports another deployment base and canonical simulator aliases', () => {
    vi.stubEnv('BASE_URL', '/nested/site/');
    window.history.replaceState(null, '', '/nested/site/dosen/a/');
    expect(getBaseUrl()).toBe(window.location.origin + '/nested/site/');
    expect(getSimulatorUrl('altbau-thermal')).toBe(window.location.origin + '/nested/site/simulators/altbau/');
  });
  it('roundtrips comparisons with reserved characters', () => {
    const ids = ['dose:one', 'cand:a b'];
    window.history.replaceState(null, '', getCompareUrl(ids));
    expect(parseCompareFromUrl()).toEqual(ids);
  });
});
