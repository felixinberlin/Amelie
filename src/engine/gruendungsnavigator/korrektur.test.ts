// @vitest-environment jsdom
// „Stimmt hier etwas nicht?“: Links, Kürzung, Fenster. Lizenz: CC0.
import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { korrekturMeldung, SEITE_OPTION, GITHUB_MAX, MAILTO_MAX, type KorrekturKontakt } from './korrektur';
import { bindeKorrektur, ortVon, auszugVon } from './korrekturUi';

const ROOT = resolve(__dirname, '../../..');
const KONTAKT = JSON.parse(readFileSync(resolve(ROOT, '07-demos/gruendungsnavigator/data/kontakt.json'), 'utf8')) as KorrekturKontakt;
const MIT_MAIL: KorrekturKontakt = { ...KONTAKT, korrekturMail: 'korrektur@example.org' };
const VORLAGE = readFileSync(resolve(ROOT, '.github/ISSUE_TEMPLATE', KONTAKT.issueVorlage), 'utf8');
const EIN = { seite: 'jobcenter-hilfe' as const, ort: 'Rückforderung · Bagatellgrenze', auszug: 'Unter 50 Euro wird nicht zurückgefordert.', vorschlag: 'Die Grenze gilt je Bescheid.', stand: '16.10.2026' };

const param = (url: string, k: string) => new URL(url).searchParams.get(k);

describe('korrekturMeldung', () => {
  it('GitHub-Link füllt das Issue-Formular vor', () => {
    const m = korrekturMeldung(EIN, KONTAKT);
    expect(m.github.startsWith(`https://github.com/${KONTAKT.repo}/issues/new?`)).toBe(true);
    expect(param(m.github, 'template')).toBe(KONTAKT.issueVorlage);
    expect(param(m.github, 'title')).toBe('[Korrektur] Rückforderung · Bagatellgrenze');
    expect(param(m.github, 'seite')).toBe(SEITE_OPTION['jobcenter-hilfe']);
    expect(param(m.github, 'stelle')).toContain('„Unter 50 Euro wird nicht zurückgefordert.“');
    expect(param(m.github, 'stelle')).toContain('Stand der Seite: 16.10.2026');
    expect(param(m.github, 'richtig')).toBe('Die Grenze gilt je Bescheid.');
    expect(m.gekuerzt).toBe(false);
  });

  it('ohne Postfach kein E-Mail-Weg, mit Postfach ein mailto mit dem ganzen Text', () => {
    expect(korrekturMeldung(EIN, KONTAKT).mailto).toBeNull();
    const m = korrekturMeldung(EIN, MIT_MAIL);
    expect(m.mailto!.startsWith('mailto:korrektur@example.org?subject=')).toBe(true);
    const body = decodeURIComponent(m.mailto!.split('&body=')[1]);
    expect(body).toBe(m.text);
    expect(m.text).toContain('Bitte keine persönlichen Daten');
  });

  it('langer Auszug wird nur für die Links gekürzt, der Kopiertext bleibt ganz', () => {
    const lang = 'Wort '.repeat(3000);
    const m = korrekturMeldung({ ...EIN, auszug: lang }, MIT_MAIL);
    expect(m.gekuerzt).toBe(true);
    expect(m.github.length).toBeLessThanOrEqual(GITHUB_MAX);
    expect(m.mailto!.length).toBeLessThanOrEqual(MAILTO_MAX);
    expect(m.text).toContain(lang.trim());
    expect(param(m.github, 'richtig')).toBe('Die Grenze gilt je Bescheid.');
  });

  it('Gegenprobe: falsches Repo, falsche Adresse, unbekannte Seite werden abgelehnt', () => {
    expect(() => korrekturMeldung(EIN, { ...KONTAKT, repo: 'kein repo' })).toThrow(/besitzer\/name/);
    expect(() => korrekturMeldung(EIN, { ...KONTAKT, korrekturMail: 'keine-adresse' })).toThrow(/keine E-Mail/);
    expect(() => korrekturMeldung({ ...EIN, seite: 'x' as never }, KONTAKT)).toThrow(/Unbekannte Seite/);
  });

  it('Drift: Seitennamen und Feld-Ids stehen so im Issue-Formular', () => {
    for (const o of Object.values(SEITE_OPTION)) expect(VORLAGE).toContain(`- ${o}`);
    for (const id of ['seite', 'stelle', 'richtig']) expect(VORLAGE).toMatch(new RegExp(`id: ${id}\\b`));
  });
});

describe('Fenster im Browser', () => {
  let stop = () => {};
  afterEach(() => { stop(); document.body.innerHTML = ''; });

  const seite = () => {
    document.body.innerHTML = `<section class="modul"><h2>Rückforderung</h2>
      <div class="law"><div class="h"><span class="chip">§ 40 Abs. 1 SGB II</span><span class="name">Bagatellgrenze</span><a class="src" href="#">Gesetzestext ↗</a></div><blockquote>Unter 50 Euro …</blockquote></div>
    </section><footer><a href="https://github.com/x/y/issues/new" data-korrektur-oeffnen>Korrektur melden</a></footer>`;
  };

  it('Knopf an jeder Stelle, Ort und Auszug richtig, Links gesetzt', () => {
    seite();
    stop = bindeKorrektur(document, { kontakt: MIT_MAIL, seite: 'jobcenter-hilfe', stand: '16.10.2026', ziele: '.law' }).stop;
    const law = document.querySelector('.law')!;
    expect(ortVon(law)).toBe('Rückforderung · § 40 Abs. 1 SGB II Bagatellgrenze');
    expect(auszugVon(law)).toBe('Unter 50 Euro …');
    expect(auszugVon(law, '50 Euro')).toBe('50 Euro');
    expect(auszugVon(law, 'steht woanders')).toBe('Unter 50 Euro …');
    const knopf = law.querySelector<HTMLButtonElement>('.kx-knopf')!;
    expect(knopf.textContent).toBe('Stimmt hier etwas nicht?');
    knopf.click();
    const gh = document.querySelector<HTMLAnchorElement>('#kx-github')!;
    expect(param(gh.href, 'stelle')).toContain('Unter 50 Euro');
    expect(document.querySelector<HTMLAnchorElement>('#kx-mail')!.href).toMatch(/^mailto:korrektur@example\.org/);
    const v = document.querySelector<HTMLTextAreaElement>('#kx-vorschlag')!;
    v.value = 'Es sind 50 Euro je Bescheid.';
    v.dispatchEvent(new Event('input', { bubbles: true }));
    expect(param(gh.href, 'richtig')).toBe('Es sind 50 Euro je Bescheid.');
    document.querySelector<HTMLButtonElement>('#kx-zu')!.click();
    expect(document.querySelector('.kx-huelle')).toBeNull();
  });

  it('ohne Postfach kein E-Mail-Knopf; Fußzeilen-Link öffnet das Fenster', () => {
    seite();
    stop = bindeKorrektur(document, { kontakt: KONTAKT, seite: 'jobcenter-hilfe', ziele: '.law' }).stop;
    document.querySelector<HTMLAnchorElement>('[data-korrektur-oeffnen]')!.click();
    expect(document.querySelector('.kx-huelle')).not.toBeNull();
    expect(document.querySelector('#kx-mail')).toBeNull();
    expect(document.querySelector<HTMLInputElement>('#kx-ort')!.value).toBe('Allgemein');
  });

  it('neu gerenderte Stellen bekommen ihren Knopf, aber nur einmal', async () => {
    seite();
    stop = bindeKorrektur(document, { kontakt: KONTAKT, seite: 'jobcenter-hilfe', ziele: '.law' }).stop;
    document.querySelector('section')!.insertAdjacentHTML('beforeend', '<div class="law"><span class="chip">§ 44 SGB X</span></div>');
    await new Promise((r) => setTimeout(r, 0));
    expect(document.querySelectorAll('.kx-knopf').length).toBe(2);
    for (const l of document.querySelectorAll('.law')) expect(l.querySelectorAll('.kx-knopf').length).toBe(1);
  });
});
