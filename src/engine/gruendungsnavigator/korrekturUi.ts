// Jobcenter-Hilfe: Knopf „Stimmt hier etwas nicht?“ an Gesetzestexten,
// Ergebnissen und Karten, mit einem kleinen Meldefenster. Lizenz: CC0.
//
// Die Seiten rufen bindeKorrektur() einmal auf; neu gerenderte Stellen bekommen
// ihren Knopf über einen MutationObserver. Die Links baut korrekturMeldung().

import { korrekturMeldung, type KorrekturKontakt, type KorrekturSeite } from './korrektur';

export interface KorrekturOptionen {
  kontakt: KorrekturKontakt;
  seite: KorrekturSeite;
  stand?: string;
  /** CSS-Selektor der Stellen, die einen Knopf bekommen */
  ziele: string;
}

const AUSZUG_MAX = 400;
const STIL = `
.kx-knopf{display:inline-block;margin:6px 0 0;padding:2px 8px;font:inherit;font-size:.8rem;color:var(--ink-2,#5c5c57);background:none;border:1px dashed var(--line,#ccc);border-radius:6px;cursor:pointer}
.kx-knopf:hover,.kx-knopf:focus-visible{color:var(--accent,#1f5fbf);border-color:var(--accent,#1f5fbf)}
.kx-huelle{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center;padding:16px}
@media (min-width:640px){.kx-huelle{align-items:center}}
.kx-fenster{background:var(--surface,#fff);color:var(--ink,#1d1d1b);border-radius:12px;max-width:560px;width:100%;max-height:90vh;overflow:auto;padding:16px;box-shadow:0 10px 30px rgba(0,0,0,.3)}
.kx-fenster h2{margin:0 0 6px;font-size:1.1rem}
.kx-fenster label{display:block;margin:10px 0 4px;font-weight:600;font-size:.9rem}
.kx-fenster input,.kx-fenster textarea{width:100%;box-sizing:border-box;font:inherit;font-size:.9rem;padding:6px 8px;border:1px solid var(--line,#ccc);border-radius:6px;background:var(--surface-2,#f6f6f3);color:inherit}
.kx-fenster textarea{min-height:4.5em;resize:vertical}
.kx-fenster p{margin:6px 0;font-size:.85rem;color:var(--ink-2,#5c5c57)}
.kx-wege{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.kx-wege a,.kx-wege button{font:inherit;font-size:.9rem;padding:8px 12px;border-radius:8px;border:1px solid var(--accent,#1f5fbf);background:var(--accent,#1f5fbf);color:#fff;text-decoration:none;cursor:pointer}
.kx-wege .kx-zweit{background:none;color:var(--accent,#1f5fbf)}
@media print{.kx-knopf,.kx-huelle{display:none!important}}
`;

const eng = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Abschnitt einer Stelle: Überschrift des Moduls plus eigener Titel */
export function ortVon(el: Element): string {
  const teile: string[] = [];
  const bereich = el.closest('section, .modul, .qblock');
  const h = bereich?.querySelector('h2, h3.qtitle');
  if (h && !el.contains(h)) teile.push(eng(h.textContent ?? ''));
  const eigen = (el as HTMLElement).dataset?.korrekturOrt
    ?? (el.matches('.law') ? [el.querySelector('.chip'), el.querySelector('.name, .nm')].map((x) => eng(x?.textContent ?? '')).filter(Boolean).join(' ') : '')
    ?? '';
  const titel = eigen || eng(el.querySelector(':scope > h3, :scope > summary, summary .q, h3')?.textContent ?? '');
  if (titel) teile.push(titel);
  return [...new Set(teile)].join(' · ').slice(0, 160);
}

/** Text der Stelle ohne den Knopf selbst; eine Markierung darin hat Vorrang */
export function auszugVon(el: Element, auswahl?: string): string {
  const a = eng(auswahl ?? '');
  if (a && eng(el.textContent ?? '').includes(a)) return a.slice(0, AUSZUG_MAX);
  // Bei Gesetzestexten zählt der Wortlaut, nicht die Kopfzeile.
  const zitat = el.matches('.law') ? el.querySelector('blockquote') : null;
  const kopie = (zitat ?? el).cloneNode(true) as Element;
  kopie.querySelectorAll('.kx-knopf, a.src, .lk').forEach((x) => x.remove());
  const t = eng(kopie.textContent ?? '');
  return t.length > AUSZUG_MAX ? t.slice(0, AUSZUG_MAX - 1) + '…' : t;
}

export function bindeKorrektur(doc: Document, o: KorrekturOptionen): { oeffne: (el?: Element | null) => void; stop: () => void } {
  if (!doc.getElementById('kx-stil')) {
    const s = doc.createElement('style');
    s.id = 'kx-stil';
    s.textContent = STIL;
    doc.head.appendChild(s);
  }

  const knopfAn = (el: Element) => {
    if (el.querySelector(':scope > .kx-knopf')) return;
    const b = doc.createElement('button');
    b.type = 'button';
    b.className = 'kx-knopf';
    b.textContent = 'Stimmt hier etwas nicht?';
    b.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      oeffne(el);
    });
    el.appendChild(b);
  };
  const alle = () => doc.querySelectorAll(o.ziele).forEach(knopfAn);

  let offen: HTMLElement | null = null;
  const schliesse = () => {
    offen?.remove();
    offen = null;
  };

  function oeffne(el?: Element | null) {
    schliesse();
    const auswahl = doc.defaultView?.getSelection?.()?.toString() ?? '';
    const huelle = doc.createElement('div');
    huelle.className = 'kx-huelle';
    const f = doc.createElement('div');
    f.className = 'kx-fenster';
    f.setAttribute('role', 'dialog');
    f.setAttribute('aria-modal', 'true');
    f.setAttribute('aria-labelledby', 'kx-titel');
    const mail = !!o.kontakt.korrekturMail?.trim();
    f.innerHTML = `<h2 id="kx-titel">Stimmt hier etwas nicht?</h2>
<p>Danke. Jede Meldung wird geprüft und, wenn sie zutrifft, mit Datum in die Prüfakte übernommen. <b>Bitte keine persönlichen Daten</b> (Name, BG-Nummer, Anschrift). Für Ihren eigenen Fall: eine Sozialberatung.</p>
<label for="kx-ort">Wo?</label><input id="kx-ort">
<label for="kx-auszug">Die Stelle (gern kürzen)</label><textarea id="kx-auszug"></textarea>
<label for="kx-vorschlag">Was ist falsch oder fehlt, wie wäre es richtig?</label><textarea id="kx-vorschlag" placeholder="Freiwillig. Beleg (Norm, Weisung, Erfahrung aus der Praxis) hilft beim Prüfen."></textarea>
<div class="kx-wege">
  ${mail ? '<a id="kx-mail" href="#">Per E-Mail melden</a>' : ''}
  <a id="kx-github" href="#" target="_blank" rel="noopener"${mail ? ' class="kx-zweit"' : ''}>Auf GitHub melden</a>
  <button type="button" id="kx-kopie" class="kx-zweit">Text kopieren</button>
  <button type="button" id="kx-zu" class="kx-zweit">Schließen</button>
</div>
<p id="kx-info">${mail ? 'E-Mail öffnet Ihr Mailprogramm mit fertigem Text. ' : ''}GitHub braucht ein kostenloses Konto. Ohne beides: Text kopieren und weitergeben.</p>`;
    huelle.appendChild(f);
    doc.body.appendChild(huelle);
    offen = huelle;

    const $ = <T extends HTMLElement>(id: string) => f.querySelector('#' + id) as T;
    $<HTMLInputElement>('kx-ort').value = el ? ortVon(el) : 'Allgemein';
    $<HTMLTextAreaElement>('kx-auszug').value = el ? auszugVon(el, auswahl) : eng(auswahl).slice(0, AUSZUG_MAX);

    const meldung = () =>
      korrekturMeldung(
        { seite: o.seite, ort: $<HTMLInputElement>('kx-ort').value, auszug: $<HTMLTextAreaElement>('kx-auszug').value, vorschlag: $<HTMLTextAreaElement>('kx-vorschlag').value, stand: o.stand },
        o.kontakt,
      );
    const aktualisiere = () => {
      const m = meldung();
      $<HTMLAnchorElement>('kx-github').href = m.github;
      if (m.mailto) $<HTMLAnchorElement>('kx-mail').href = m.mailto;
      $('kx-info').dataset.gekuerzt = m.gekuerzt ? '1' : '';
    };
    f.addEventListener('input', aktualisiere);
    aktualisiere();

    $('kx-kopie').addEventListener('click', () => {
      const t = meldung().text;
      const knopf = $('kx-kopie');
      const ok = () => { knopf.textContent = 'Kopiert ✓'; };
      const nav = doc.defaultView?.navigator;
      if (nav?.clipboard?.writeText) nav.clipboard.writeText(t).then(ok, () => { $<HTMLTextAreaElement>('kx-auszug').select(); });
      else ok();
    });
    $('kx-zu').addEventListener('click', schliesse);
    huelle.addEventListener('click', (ev) => { if (ev.target === huelle) schliesse(); });
    f.addEventListener('keydown', (ev) => { if ((ev as KeyboardEvent).key === 'Escape') schliesse(); });
    $<HTMLInputElement>('kx-ort').focus();
  }

  // Links mit data-korrektur-oeffnen (Fußzeile) öffnen das Fenster statt GitHub.
  const klick = (ev: Event) => {
    const t = (ev.target as Element | null)?.closest?.('[data-korrektur-oeffnen]');
    if (!t) return;
    ev.preventDefault();
    oeffne(null);
  };
  doc.addEventListener('click', klick);

  alle();
  const MO = doc.defaultView?.MutationObserver;
  let plan = 0;
  const beobachter = MO ? new MO(() => {
    if (plan) return;
    plan = 1;
    Promise.resolve().then(() => { plan = 0; alle(); });
  }) : null;
  beobachter?.observe(doc.body, { childList: true, subtree: true });

  return {
    oeffne,
    stop: () => { beobachter?.disconnect(); doc.removeEventListener('click', klick); schliesse(); },
  };
}
