/**
 * Rendert einen Unified Diff (`git diff`, `.patch`) als lesbares HTML fürs Buch.
 *
 * Bewusst ohne Syntax-Highlighter-Bibliothek: Ein Patch braucht nur vier
 * Zeilenarten (Datei, Hunk, hinzu, weg). Alles wird escaped — der Patch ist
 * fremder Code und darf im Leser nie als HTML wirken.
 */

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

export interface PatchSummary {
  files: string[];
  added: number;
  removed: number;
}

export function summarizePatch(raw: string): PatchSummary {
  const files: string[] = [];
  let added = 0;
  let removed = 0;
  for (const line of raw.split('\n')) {
    const m = /^diff --git a\/(\S+) b\//.exec(line);
    if (m) files.push(m[1]);
    else if (line.startsWith('+') && !line.startsWith('+++')) added++;
    else if (line.startsWith('-') && !line.startsWith('---')) removed++;
  }
  return { files, added, removed };
}

function lineClass(line: string): string {
  if (line.startsWith('diff --git')) return 'diff-file';
  if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('index ') || line.startsWith('new file mode')) return 'diff-meta';
  if (line.startsWith('@@')) return 'diff-hunk';
  if (line.startsWith('+')) return 'diff-add';
  if (line.startsWith('-')) return 'diff-del';
  return 'diff-ctx';
}

export function patchToHtml(raw: string): string {
  const { files, added, removed } = summarizePatch(raw);
  const list = files.map((f) => `<li><code>${escapeHtml(f)}</code></li>`).join('');
  const body = raw
    .replace(/\n$/, '')
    .split('\n')
    .map((line) => `<span class="${lineClass(line)}">${escapeHtml(line) || ' '}</span>`)
    // Spans sind display:block — ein zusätzliches \n im <pre> gäbe Leerzeilen.
    .join('');
  return (
    `<p><strong>${files.length}</strong> ${files.length === 1 ? 'file' : 'files'} · ` +
    `<span class="diff-count-add">+${added}</span> <span class="diff-count-del">−${removed}</span></p>` +
    (list ? `<ul>${list}</ul>` : '') +
    `<pre class="amelie-diff"><code>${body}</code></pre>`
  );
}
