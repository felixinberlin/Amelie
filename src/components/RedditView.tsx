import React, { useEffect, useMemo, useState } from 'react';
import { MessageSquare, ExternalLink, AlertTriangle } from 'lucide-react';
import { Language } from '../types';

interface RedditPost { id: string; title: string; url: string; author: string; published: string; excerpt: string }
interface RedditFeed {
  sub: string; group: string; period: string; fetchedAt: string | null;
  stale: boolean; error: string | null; posts: RedditPost[];
}
interface RedditData { generatedAt: string; period: string; source: string; feeds: RedditFeed[] }

const GROUPS: Record<string, { de: string; en: string }> = {
  build: { de: 'Bauen & Gründen', en: 'Building & founding' },
  ideas: { de: 'Ideen', en: 'Ideas' },
  oss: { de: 'Open Source', en: 'Open source' },
  ai: { de: 'KI-Werkzeuge', en: 'AI tooling' },
  civic: { de: 'Civic & Daten', en: 'Civic & data' },
};

const dateOf = (iso: string | null, de: boolean) =>
  iso ? new Date(iso).toLocaleDateString(de ? 'de-DE' : 'en-GB', { day: '2-digit', month: 'short' }) : '–';

/** Zeigt den nächtlich geholten Reddit-Cache (public/data/reddit.json, Atom-Feeds, Reihenfolge = Wochen-Ranking). */
export function RedditView({ lang }: { lang: Language }) {
  const de = lang === 'de';
  const [data, setData] = useState<RedditData | null>(null);
  const [failed, setFailed] = useState(false);
  const [group, setGroup] = useState<string>('all');
  const [sub, setSub] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL || '/'}data/reddit.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  const feeds = useMemo(
    () => (data?.feeds ?? []).filter((f) => (group === 'all' || f.group === group) && (!sub || f.sub === sub)),
    [data, group, sub],
  );
  const groups = useMemo(() => Array.from(new Set((data?.feeds ?? []).map((f) => f.group))), [data]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[var(--m-accent)] mb-2">
          <MessageSquare className="w-5 h-5" />
          <span className="font-typewriter text-xs uppercase tracking-wider">Reddit</span>
        </div>
        <h2 className="font-amelie text-2xl sm:text-3xl font-bold text-[var(--m-ink)]">
          {de ? 'Was Reddit diese Woche baut und fragt' : 'What Reddit builds and asks this week'}
        </h2>
        <p className="mt-2 text-sm text-[var(--m-ink-2)] max-w-3xl">
          {de
            ? 'Wochen-Top der Subreddits, nachts als Cache geholt. Die Reihenfolge ist das Ranking; Scores liefert der Feed nicht. Ein Treffer ist eine Spur, keine Evidenz: vor Nutzung im Besetzt-Test prüfen.'
            : 'Weekly top of each subreddit, cached overnight. Order is the ranking; the feed has no scores. A hit is a lead, not evidence: check it in the occupied-test before use.'}
        </p>
        {data && (
          <p className="mt-1 text-xs font-typewriter text-[var(--m-ink-3)]">
            {de ? 'Stand' : 'As of'} {new Date(data.generatedAt).toLocaleString(de ? 'de-DE' : 'en-GB')}
          </p>
        )}
      </div>

      {failed && (
        <p className="text-sm text-[var(--m-ink-2)]">
          {de ? 'Noch kein Cache vorhanden. Der nächtliche Lauf legt public/data/reddit.json an.' : 'No cache yet. The nightly run creates public/data/reddit.json.'}
        </p>
      )}

      {data && (
        <div className="flex flex-wrap gap-2 text-xs">
          {['all', ...groups].map((g) => (
            <button
              key={g}
              onClick={() => { setGroup(g); setSub(null); }}
              className={`px-3 py-1.5 rounded-full border ${group === g && !sub ? 'bg-[var(--m-accent)] text-white border-transparent' : 'border-[var(--m-line-strong)] text-[var(--m-ink-2)]'}`}
            >
              {g === 'all' ? (de ? 'Alle' : 'All') : (GROUPS[g]?.[de ? 'de' : 'en'] ?? g)}
            </button>
          ))}
          {(data.feeds).map((f) => (
            <button
              key={f.sub}
              onClick={() => { setSub(sub === f.sub ? null : f.sub); setGroup('all'); }}
              className={`px-3 py-1.5 rounded-full border font-typewriter ${sub === f.sub ? 'bg-[var(--m-accent)] text-white border-transparent' : 'border-[var(--m-line)] text-[var(--m-ink-3)]'}`}
            >
              r/{f.sub}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {feeds.map((f) => (
          <section key={f.sub} className="rounded-2xl border border-[var(--m-line-strong)] bg-[var(--m-bg)] p-4">
            <div className="flex items-baseline justify-between gap-2 mb-3">
              <a href={`https://www.reddit.com/r/${f.sub}/top/?t=${f.period}`} target="_blank" rel="noopener noreferrer" className="font-amelie text-lg font-bold text-[var(--m-ink)] hover:underline">
                r/{f.sub}
              </a>
              <span className="text-[11px] font-typewriter text-[var(--m-ink-3)]">{dateOf(f.fetchedAt, de)}</span>
            </div>
            {f.stale && (
              <p className="mb-2 flex items-center gap-1.5 text-xs text-[var(--m-ink-3)]">
                <AlertTriangle className="w-3.5 h-3.5" />
                {f.posts.length
                  ? (de ? `Alter Stand, letzter Abruf schlug fehl (${f.error})` : `Old snapshot, last fetch failed (${f.error})`)
                  : (de ? `Noch nicht geholt (${f.error ?? 'offen'})` : `Not fetched yet (${f.error ?? 'pending'})`)}
              </p>
            )}
            <ol className="space-y-3">
              {f.posts.slice(0, 10).map((p, i) => (
                <li key={p.id} className="flex gap-3">
                  <span className="font-typewriter text-xs text-[var(--m-ink-3)] w-5 shrink-0 pt-0.5">{i + 1}</span>
                  <div className="min-w-0">
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[var(--m-ink)] hover:underline inline-flex items-start gap-1">
                      {p.title}<ExternalLink className="w-3 h-3 mt-1 shrink-0" />
                    </a>
                    {p.excerpt && <p className="text-xs text-[var(--m-ink-2)] mt-0.5 line-clamp-2">{p.excerpt}</p>}
                    <p className="text-[11px] font-typewriter text-[var(--m-ink-3)] mt-0.5">u/{p.author} · {dateOf(p.published, de)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
