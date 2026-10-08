// TypeScript-Definitionen für scripts/reddit-lib.mjs
declare module '*reddit-lib.mjs' {
  export interface RedditPost { id: string; title: string; url: string; author: string; published: string; excerpt: string }
  export interface RedditFeed {
    sub: string; group: string; period: string; fetchedAt: string | null;
    stale: boolean; error: string | null; posts: RedditPost[];
  }
  export function decodeEntities(s: string): string;
  export function excerpt(contentHtml: string, len?: number): string;
  export function parseAtom(xml: string): RedditPost[];
  export function mergeFeed(
    previous: RedditFeed | undefined,
    fresh: { ok: boolean; sub: string; group: string; period: string; posts: RedditPost[]; error?: string },
    fetchedAt: string,
  ): RedditFeed;
}
