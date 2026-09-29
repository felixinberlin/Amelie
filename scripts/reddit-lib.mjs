// Reddit-Atom-Feed: reine Parser- und Merge-Funktionen (ohne Netz, testbar).
// Der Abruf selbst steht in scripts/fetch-reddit.mjs.

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#32;': ' ' };

export function decodeEntities(s) {
  return s
    .replace(/&(amp|lt|gt|quot|#39|#32);/g, (m) => ENTITIES[m])
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decodeEntities(m[1]).trim() : '';
}

/** Eintrag-Text ohne HTML, auf max. `len` Zeichen gekürzt. */
export function excerpt(contentHtml, len = 280) {
  const md = contentHtml.match(/<div class="md">([\s\S]*?)<\/div>/);
  if (!md) return '';
  const text = decodeEntities(md[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
  return text.length > len ? text.slice(0, len - 1).trimEnd() + '…' : text;
}

/** Atom-XML -> Liste von Beiträgen. Reihenfolge = Reihenfolge im Feed (bei top.rss das Ranking). */
export function parseAtom(xml) {
  const posts = [];
  for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const e = m[1];
    const link = e.match(/<link href="([^"]+)"/);
    const id = tag(e, 'id');
    if (!link || !id) continue;
    // Der Feed entity-kodiert den HTML-Inhalt; erst dekodieren, dann kürzen.
    const content = tag(e, 'content');
    posts.push({
      id,
      title: tag(e, 'title'),
      url: decodeEntities(link[1]),
      author: tag(e.match(/<author>([\s\S]*?)<\/author>/)?.[1] ?? '', 'name').replace(/^\/u\//, ''),
      published: tag(e, 'published') || tag(e, 'updated'),
      excerpt: excerpt(content),
    });
  }
  return posts;
}

/**
 * Ergebnis eines Laufs in den alten Bestand einmischen.
 * Ein Sub, der diesmal nicht kam (429/403/Netz), behält seine alten Beiträge und
 * bekommt `stale: true` plus den Fehler; nie wird ein guter Bestand durch Leere ersetzt.
 */
export function mergeFeed(previous, fresh, fetchedAt) {
  if (fresh.ok && fresh.posts.length > 0) {
    return { sub: fresh.sub, group: fresh.group, period: fresh.period, fetchedAt, stale: false, error: null, posts: fresh.posts };
  }
  return {
    sub: fresh.sub,
    group: fresh.group,
    period: fresh.period,
    fetchedAt: previous?.fetchedAt ?? null,
    stale: true,
    error: fresh.error ?? 'leer',
    posts: previous?.posts ?? [],
  };
}
