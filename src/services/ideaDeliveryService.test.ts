import { describe, it, expect } from 'vitest';
import { loadSentEmailsMap, loadDeliveryStateForDose } from './ideaDeliveryService';
import { DELIVERIES_DATA } from '../data/deliveries';

describe('loadSentEmailsMap (echte 05-dosen/-Frontmatter)', () => {
  it('markiert genau die Mails als versendet, deren verlinkte Dose zugestellt ist', async () => {
    const map = await loadSentEmailsMap();
    // Jede in DELIVERIES_DATA bekannte Mail bekommt einen Eintrag.
    for (const mail of DELIVERIES_DATA) {
      expect(map[mail.id]).toBeDefined();
    }
    expect(map['mail-1'].sent).toBe(true); // altbau-thermal: zugestellt
    expect(map['mail-2'].sent).toBe(true); // sperrmuell-radar + kiez-laermkarte: zugestellt
    expect(map['mail-3'].sent).toBe(true); // kiez-laermkarte: zugestellt
    expect(map['mail-5'].sent).toBe(true); // glasanflug-ampel: zugestellt
    expect(map['mail-6'].sent).toBe(false); // spec-drift-detector: gepackt
  });

  it('liefert sentAt/notes aus der Dose-Frontmatter für eine versendete Mail', async () => {
    const map = await loadSentEmailsMap();
    expect(map['mail-1'].sentAt).toMatch(/^2026-09-19/);
    expect(map['mail-1'].notes).toContain('EnergyMap Berlin');
  });
});

describe('loadDeliveryStateForDose', () => {
  it('liest den Status direkt von einer einzelnen Dose', async () => {
    expect((await loadDeliveryStateForDose('glasanflug-ampel')).sent).toBe(true);
    expect((await loadDeliveryStateForDose('spec-drift-detector')).sent).toBe(false);
  });
});
