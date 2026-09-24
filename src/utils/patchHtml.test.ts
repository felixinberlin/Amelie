import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { escapeHtml, patchToHtml, summarizePatch } from './patchHtml';

const SAMPLE = [
  'diff --git a/scripts/x.py b/scripts/x.py',
  'new file mode 100644',
  'index 0000000..1111111',
  '--- /dev/null',
  '+++ b/scripts/x.py',
  '@@ -0,0 +1,2 @@',
  '+print("<script>alert(1)</script>")',
  '+x = 1 & 2',
  ' context',
  '-gone',
  '',
].join('\n');

describe('Patch im Buch', () => {
  it('zählt Dateien und Zeilen, ohne die Kopfzeilen mitzuzählen', () => {
    expect(summarizePatch(SAMPLE)).toEqual({ files: ['scripts/x.py'], added: 2, removed: 1 });
  });

  it('escaped alles — fremder Code wird nie zu HTML', () => {
    const html = patchToHtml(SAMPLE);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('1 &amp; 2');
    expect(escapeHtml(`"'`)).toBe('&quot;&#39;');
  });

  it('markiert die vier Zeilenarten', () => {
    const html = patchToHtml(SAMPLE);
    for (const cls of ['diff-file', 'diff-meta', 'diff-hunk', 'diff-add', 'diff-del', 'diff-ctx']) {
      expect(html, cls).toContain(`class="${cls}"`);
    }
  });

  it('liest den echten Patch der Agent-Postmortem-Dose: vier neue Dateien', () => {
    const raw = readFileSync(
      resolve(__dirname, '../../07-demos/agent-postmortem-recorder/claude-reflect-recurrence.patch'),
      'utf8'
    );
    const { files, added, removed } = summarizePatch(raw);
    expect(files).toEqual([
      'scripts/lib/recurrence.py',
      'scripts/rank_queue.py',
      'tests/test_hook_e2e.py',
      'tests/test_recurrence.py',
    ]);
    expect(added).toBe(567);
    expect(removed).toBe(0);
  });
});
