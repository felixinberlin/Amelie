import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { parseAtom, mergeFeed, decodeEntities } from '../../scripts/reddit-lib.mjs';

const ENTRY = `<feed><entry><author><name>/u/ragendem</name></author><content type="html">&lt;div class=&quot;md&quot;&gt;&lt;p&gt;And it feels &amp;amp; looks great&amp;#39;s&lt;/p&gt;&lt;/div&gt; submitted by</content><id>t3_1wpjw66</id><link href="https://www.reddit.com/r/opensource/comments/1wpjw66/x/" /><published>2026-09-25T01:51:43+00:00</published><title>First PR &amp;amp; more</title></entry></feed>`;

describe('reddit-lib', () => {
  it('parst einen Atom-Eintrag', () => {
    const [p] = parseAtom(ENTRY);
    expect(p.id).toBe('t3_1wpjw66');
    expect(p.author).toBe('ragendem');
    expect(p.url).toContain('/comments/1wpjw66/');
    expect(p.excerpt).toBe("And it feels & looks great's");
    expect(p.published).toBe('2026-09-25T01:51:43+00:00');
  });
  it('dekodiert Entitäten', () => expect(decodeEntities('a &amp; b &#39;c&#39;')).toBe("a & b 'c'"));
  it('mergeFeed behält bei Fehler den alten Bestand und markiert stale', () => {
    const prev = mergeFeed(undefined, { ok: true, sub: 'x', group: 'g', period: 'week', posts: parseAtom(ENTRY) }, '2026-09-28T00:00:00Z');
    const next = mergeFeed(prev, { ok: false, sub: 'x', group: 'g', period: 'week', posts: [], error: 'HTTP 429' }, '2026-09-29T00:00:00Z');
    expect(next.stale).toBe(true);
    expect(next.posts).toHaveLength(1);
    expect(next.fetchedAt).toBe('2026-09-28T00:00:00Z');
    expect(next.error).toBe('HTTP 429');
  });
  it('public/data/reddit.json deckt alle konfigurierten Subs ab', () => {
    const cfg = JSON.parse(fs.readFileSync('scripts/reddit-subs.json', 'utf-8'));
    const data = JSON.parse(fs.readFileSync('public/data/reddit.json', 'utf-8'));
    expect(data.feeds.map((f: { sub: string }) => f.sub)).toEqual(cfg.subs.map((s: { sub: string }) => s.sub));
  });
});
