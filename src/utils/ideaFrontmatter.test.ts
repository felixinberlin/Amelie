import { describe, it, expect, vi } from 'vitest';
import { parseIdeaFrontmatter, mapIdeaFrontmatterToDeliveryState, DOSE_STATUS_TO_IDEA_STATUS } from './ideaFrontmatter';
import { IdeaStatus, DoseStatus } from '../types';

describe('parseIdeaFrontmatter', () => {
  it('parst einen gültigen Block strikt gegen IdeaStatus', () => {
    const raw = `---\nstatus: Delivered\ndate_delivered: '2026-09-19T00:00:00Z'\ndelivery_method: E-Mail\ntarget_maker: EnergyMap Berlin\n---\n# Titel\n`;
    expect(parseIdeaFrontmatter(raw, 'test.md')).toEqual({
      status: IdeaStatus.Delivered,
      date_delivered: '2026-09-19T00:00:00Z',
      delivery_method: 'E-Mail',
      target_maker: 'EnergyMap Berlin',
    });
  });

  it('loggt eine Warnung und liefert null bei einem falsch geschriebenen Status', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const raw = `---\nstatus: Delivred\n---\n`;
    expect(parseIdeaFrontmatter(raw, 'typo.md')).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('invalid or misspelled status'));
    warn.mockRestore();
  });

  it('loggt eine Warnung und liefert null, wenn status ganz fehlt', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(parseIdeaFrontmatter('---\ndelivery_method: E-Mail\n---\n', 'missing.md')).toBeNull();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('ignoriert ein kaputtes date_delivered, statt daran zu scheitern', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const raw = `---\nstatus: Delivered\ndate_delivered: "letzten Dienstag"\n---\n`;
    const result = parseIdeaFrontmatter(raw, 'bad-date.md');
    expect(result?.status).toBe(IdeaStatus.Delivered);
    expect(result?.date_delivered).toBeUndefined();
    warn.mockRestore();
  });
});

describe('mapIdeaFrontmatterToDeliveryState', () => {
  it('setzt sent nur bei Delivered', () => {
    expect(mapIdeaFrontmatterToDeliveryState({ status: IdeaStatus.Available }).sent).toBe(false);
    expect(mapIdeaFrontmatterToDeliveryState({ status: IdeaStatus.InProgress }).sent).toBe(false);
    expect(mapIdeaFrontmatterToDeliveryState({ status: IdeaStatus.Launched }).sent).toBe(false);
    expect(mapIdeaFrontmatterToDeliveryState({ status: IdeaStatus.Delivered }).sent).toBe(true);
  });

  it('übernimmt date_delivered als sentAt und verkettet target_maker + delivery_method zu notes', () => {
    const result = mapIdeaFrontmatterToDeliveryState({
      status: IdeaStatus.Delivered,
      date_delivered: '2026-09-19T00:00:00Z',
      target_maker: 'EnergyMap Berlin',
      delivery_method: 'E-Mail',
    });
    expect(result).toEqual({ sent: true, sentAt: '2026-09-19T00:00:00Z', notes: 'EnergyMap Berlin · E-Mail' });
  });

  it('liefert sent: false ohne Absturz, wenn keine Frontmatter vorhanden ist', () => {
    expect(mapIdeaFrontmatterToDeliveryState(null)).toEqual({ sent: false, sentAt: '' });
  });
});

describe('Browser-Umgebung ohne globales Buffer', () => {
  // gray-matter ruft intern Buffer.from(...) auf (node_modules/gray-matter/lib/utils.js).
  // Node/vitest haben immer ein globales Buffer, ein Vite-Browserbundle nicht — das hat
  // genau hier dazu geführt, dass jede Dose beim echten Deploy als "nicht versendet" galt,
  // während dieselbe Testdatei in Node grün blieb. Simuliert die Browser-Lücke, indem
  // globalThis.Buffer entfernt und das Modul frisch importiert wird.
  it('parst trotzdem korrekt, weil ideaFrontmatter.ts Buffer selbst polyfillt', async () => {
    const originalBuffer = globalThis.Buffer;
    // @ts-expect-error - Absicht: die Lücke simulieren, die im Browser echt ist.
    delete globalThis.Buffer;
    vi.resetModules();
    try {
      const fresh = await import('./ideaFrontmatter');
      expect(typeof globalThis.Buffer).not.toBe('undefined');
      const result = fresh.parseIdeaFrontmatter(
        `---\nstatus: Delivered\ndate_delivered: '2026-09-19T00:00:00Z'\n---\n`,
        'ohne-buffer.md'
      );
      expect(result?.status).toBe(IdeaStatus.Delivered);
    } finally {
      globalThis.Buffer = originalBuffer;
      vi.resetModules();
    }
  });
});

describe('DOSE_STATUS_TO_IDEA_STATUS', () => {
  it('deckt jeden DoseStatus ab', () => {
    const alle: DoseStatus[] = ['gefunden', 'gepackt', 'zugestellt', 'antwort', 'gebaut', 'entsorgt'];
    for (const status of alle) {
      expect(DOSE_STATUS_TO_IDEA_STATUS[status]).toBeDefined();
    }
  });

  it('bildet zugestellt auf Delivered ab', () => {
    expect(DOSE_STATUS_TO_IDEA_STATUS.zugestellt).toBe(IdeaStatus.Delivered);
  });
});
