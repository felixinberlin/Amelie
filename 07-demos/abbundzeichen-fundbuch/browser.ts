// CC0 1.0 Public Domain.
import { pruefeZaehlfolge, exportiereFund, type Bauteil, type Rolle, type Markierungsart, type Werkzeug } from '../../src/engine/abbundzeichen-fundbuch/fundbuchEngine';
import seeds from './data/synthetische-faelle.json';
import literature from './data/west-wycombe-2013.json';

type Lang = 'de' | 'en';
type Draft = Omit<Bauteil, 'position'> & { position: string };
let lang: Lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'de';
let nextId = 1;
let drafts: Draft[] = [];
let mode: 'manual' | 'synthetic' | 'literature' = 'manual';
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const t = (de: string, en: string) => lang === 'de' ? de : en;
const roles: [Rolle, string, string][] = [
  ['staender','Ständer','Post'],['riegel','Riegel','Rail'],['strebe','Strebe','Brace'],
  ['kopfband','Kopfband','Head brace'],['fussband','Fußband','Foot brace'],['balken','Balken','Beam'],
  ['sparren','Sparren','Rafter'],['rahm','Rähm','Wall plate'],['schwelle','Schwelle','Sill'],['sonstiges','Sonstiges','Other'],
];
const methods: [Markierungsart,string,string][] = [['unbekannt','Unbekannt','Unknown'],['eingeschlagen','Eingeschlagen','Struck'],['geritzt','Geritzt','Scratched'],['gerissen','Gerissen','Scribed'],['geroetelt','Gerötelt','Red chalk']];
const tools: [Werkzeug,string,string][] = [['unbekannt','Unbekannt','Unknown'],['stemmeisen','Stemmeisen','Chisel'],['reissmesser','Reißmesser','Scribing knife'],['beil','Beil','Axe'],['saege','Säge','Saw'],['roetel','Rötel','Red chalk']];
function node<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, cls?: string) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (cls) el.className = cls;
  return el;
}
function parts(): Bauteil[] {
  return drafts.map(d => {
    if (!d.position.trim()) throw new Error(t('Position fehlt bei ', 'Missing position for ') + d.id);
    return { ...d, position: Number(d.position) };
  });
}
function field(parent: HTMLElement, label: string, key: keyof Draft, d: Draft, index: number, options?: [string,string,string][]) {
  const wrapper = node('label');
  wrapper.append(node('span', label));
  const control = options ? document.createElement('select') : document.createElement('input');
  control.dataset.field = key;
  control.dataset.index = String(index);
  control.setAttribute('aria-label', label + ' · ' + d.id);
  if (options) for (const [value,de,en] of options) {
    const option = node('option', t(de,en)); option.value = value; control.append(option);
  }
  if (control instanceof HTMLInputElement) {
    control.type = 'text';
    control.autocomplete = 'off';
    control.maxLength = key === 'zeichen' ? 64 : 100;
    if (key === 'position') control.inputMode = 'decimal';
    if (key === 'zeichen') control.className = 'mark';
  }
  control.value = String(d[key] ?? '');
  control.addEventListener('input', () => {
    // Keep the raw draft, including invalid fields; errors never reset the form.
    Object.assign(d, { [key]: control.value });
    evaluate();
  });
  wrapper.append(control); parent.append(wrapper);
}
function renderParts() {
  const parent = $('parts'); parent.replaceChildren();
  drafts.forEach((d,index) => {
    const card = node('article', undefined, 'part'); card.dataset.testid = 'part';
    const head = node('div', undefined, 'part-head');
    head.append(node('h3', (mode === 'literature' ? t('Zeichenbeobachtung ', 'Mark observation ') : t('Bauteil ', 'Member ')) + (index + 1)));
    const remove = node('button', t('Entfernen', 'Remove')); remove.type = 'button'; remove.dataset.action = 'remove';
    remove.setAttribute('aria-label', t('Bauteil entfernen: ', 'Remove member: ') + d.id);
    remove.onclick = () => { drafts.splice(index,1); renderParts(); evaluate(); };
    head.append(remove); card.append(head);
    const fields = node('div', undefined, 'fields');
    field(fields,t('ID','ID'),'id',d,index);
    field(fields,t('Wand / Bund','Wall / frame'),'wand',d,index);
    field(fields,t('Position','Position'),'position',d,index);
    field(fields,t('Rolle','Role'),'rolle',d,index,roles);
    field(fields,t('Zeichen (manuell)','Mark (manual)'),'zeichen',d,index);
    field(fields,t('Holzseite (optional)','Timber face (optional)'),'seite',d,index);
    const details = node('details'); details.append(node('summary',t('Markierung und Werkzeug','Marking and tool')));
    const metadata = node('div',undefined,'fields');
    field(metadata,t('Markierungsart','Marking method'),'markierungsart',d,index,methods);
    field(metadata,t('Werkzeug','Tool'),'werkzeug',d,index,tools);
    details.append(metadata); card.append(fields,details); parent.append(card);
  });
}
function evaluate() {
  const result = $('results'); result.replaceChildren();
  $('export-status').textContent = '';
  $('origin').textContent = mode === 'synthetic'
    ? t('Synthetischer Arbeitsdatensatz — auch nach Änderungen kein belegter historischer Fall.', 'Synthetic working record — edits do not turn it into a documented historical case.')
    : mode === 'literature'
      ? t('Literaturbeispiel, bearbeitbarer Arbeitsdatensatz. Die ursprüngliche Quellenfixture enthält vier Zeichenbeobachtungen an EINEM Balken, keine vier Hölzer; der bearbeitete Datensatz kann davon abweichen. Positionen sind nur Reihenfolge; II und III ergänzen die ausdrücklich berichtete Folge I–IIII, keine einzelnen Fotolesungen. Änderungen sind nicht quellengeprüft.', 'Literature example, editable working record. The original source fixture contains four mark observations on ONE beam, not four timbers; the edited record may differ. Positions are ordinal; II and III expand the expressly reported sequence I–IIII, not individual photographic readings. Edits are not source-validated.')
      : t('Eigene manuelle Erfassung. Lesungen und Deutung sind fachlich ungeprüft.', 'Your manual record. Readings and interpretation have not been validated by an expert.');
  try {
    const data = parts();
    const checked = pruefeZaehlfolge(data);
    ($<HTMLButtonElement>('download')).disabled = data.length === 0;
    if (!data.length) { result.append(node('p',t('Füge ein Bauteil hinzu oder lade ein synthetisches Beispiel.','Add a member or load a synthetic example.'))); return; }
    result.append(node('p', t('Auffälligkeiten: ', 'Flags: ') + checked.befunde.length, 'summary'));
    if (!checked.befunde.length) result.append(node('p',t('Keine Auffälligkeit unter diesen Regeln. Das bestätigt weder Vollständigkeit noch Geschichte oder Sicherheit.', 'No flags under these rules. This confirms neither completeness, history nor safety.'),'muted'));
    if (checked.unlesbar.length) result.append(node('p',t('Unlesbar: ', 'Unreadable: ') + checked.unlesbar.join(', '), 'muted'));
    for (const wall of checked.serien) {
      const box = node('div',undefined,'sequence'); box.append(node('strong', wall.wand));
      for (const sequence of wall.folgen) {
        const role = roles.find(r => r[0] === sequence.rolle);
        box.append(node('p', (role ? t(role[1],role[2]) : sequence.rolle) + ': ' + (sequence.werte.join(' → ') || '—')));
      }
      result.append(box);
    }
    for (const message of checked.befunde) {
      const card = node('article',undefined,'result'); card.dataset.rule = message.regel; card.dataset.severity = message.stufe;
      card.append(node('span', message.stufe === 'verdacht' ? t('Verdacht','Suspicion') : t('Hinweis','Hint'), 'badge' + (message.stufe === 'verdacht' ? ' suspicion' : '')));
      card.append(node('span',message.regel,'muted'), node('p',lang === 'de' ? message.textDe : message.textEn));
      card.append(node('small', t('Bauteile: ','Members: ') + message.bauteile.join(', ')));
      result.append(card);
    }
  } catch (error) {
    $<HTMLButtonElement>('download').disabled = true;
    const box = node('div',undefined,'error'); box.dataset.testid = 'input-error'; box.setAttribute('role','alert');
    box.append(node('strong',t('Eingabe prüfen','Check your input')),node('p',error instanceof Error ? error.message : String(error)));
    if (lang === 'en') box.append(node('small','The engine’s detailed validation message may be in German. Your entries have been kept.'));
    result.append(box);
  }
}
function translate() {
  document.documentElement.lang = lang;
  document.title = t('Abbundzeichen-Fundbuch · Amélie','Carpenters’ Marks Logbook · Amélie');
  document.querySelectorAll<HTMLElement>('[data-de]').forEach(el => { el.textContent = el.dataset[lang] ?? ''; });
  $('language').textContent = lang === 'de' ? 'English' : 'Deutsch';
  const example = $<HTMLSelectElement>('example');
  const previous = example.value;
  example.replaceChildren();
  for (const entry of seeds.faelle) {
    const option = node('option', t('Synthetisch: ', 'Synthetic: ') + entry.id);
    option.value = entry.id; example.append(option);
  }
  if (previous) example.value = previous;
  renderParts(); evaluate();
}
$('language').onclick = () => { lang = lang === 'de' ? 'en' : 'de'; translate(); };
$('add').onclick = () => {
  let id: string;
  do { id = 'B' + nextId++; } while (drafts.some(d => d.id === id));
  drafts.push({ id, wand: 'A', position: String(drafts.length + 1), rolle: 'staender', zeichen: '?', markierungsart: 'unbekannt', werkzeug: 'unbekannt' });
  renderParts(); evaluate();
};
$('load').onclick = () => {
  const entry = seeds.faelle.find(e => e.id === $<HTMLSelectElement>('example').value);
  if (!entry) return;
  drafts = entry.bauteile.map(part => ({ ...part, position: String(part.position) })) as Draft[];
  mode = 'synthetic';
  renderParts(); evaluate();
};
$('download').onclick = () => {
  try {
    const data = exportiereFund(parts(), {
      gemeinde: $<HTMLInputElement>('municipality').value.trim(),
      land: $<HTMLInputElement>('country').value.trim(),
      erfasstAm: $<HTMLInputElement>('date').value,
      bemerkung: mode === 'synthetic'
        ? 'SYNTHETISCH / SYNTHETIC. Kein historisch belegter Fall. Human validation pending.'
        : mode === 'literature'
          ? 'Literaturbeispiel, bearbeitbarer Arbeitsdatensatz / Editable literature working record; edits not source-validated. Source: ' + literature.source.author + ', ' + literature.source.title + ', ' + literature.source.date + ', section ' + literature.source.section + ', printed p. ' + literature.source.printedPage + '. ' + literature.source.url + ' Original source fixture: four mark observations on ONE beam; edited record may differ; positions ordinal; II/III expand published consecutive range I–IIII. Only local continuity validated; no building completeness, extension or structural claim.'
          : 'Manuelle Erfassung. Lesungen und historische Deutung fachlich ungeprüft / Expert validation pending.',
    });
    const url = URL.createObjectURL(new Blob([JSON.stringify(data,null,2) + '\n'], { type:'application/json' }));
    const anchor = node('a'); anchor.href = url; anchor.download = 'abbundzeichen-fund.json';
    document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url),1000);
    $('export-status').textContent = t('JSON erstellt. Bitte vor Weitergabe fachlich und auf Ortsangaben prüfen.','JSON created. Review the record and location details before sharing.');
  } catch (error) { $('export-status').textContent = error instanceof Error ? error.message : String(error); }
};
const now = new Date();
$('load-literature').onclick = () => {
  drafts = literature.bauteile.map(part => ({ ...part, position: String(part.position) })) as Draft[];
  mode = 'literature';
  renderParts(); evaluate();
};
$<HTMLInputElement>('date').value = String(now.getFullYear()) + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
translate();
