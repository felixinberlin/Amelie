import SCIENTIFIC_TRAITS from '../../data/fugenduellScientificTraits.json';
import React, { useState } from 'react';
import { Language } from '../../types';
import { FUGENDUELL_STARTER_ROSTER } from '../../data/fugenduellData';
import { BOTANY } from '../../data/fugenduellBotany';

const TRAIT_LABELS: Record<string,string> = {
 'Height [m]':'Wuchshöhe [m]', 'Growth form':'Wuchsform', 'Life form':'Lebensform',
 'Life strategy (Pierce method based on leaf traits)':'CSR-Strategie (Pierce, aus Blattmerkmalen)',
 'Life strategy (Pierce method, C-score)':'Konkurrenzstrategie C [%]',
 'Life strategy (Pierce method, S-score)':'Stresstoleranzstrategie S [%]',
 'Life strategy (Pierce method, R-score)':'Ruderalstrategie R [%]',
 'Flowering period [month]':'Blühzeit [Monate]', 'Light indicator value':'Licht-Zeigerwert',
 'Temperature indicator value':'Temperatur-Zeigerwert', 'Moisture indicator value':'Feuchte-Zeigerwert',
 'Reaction indicator value':'Bodenreaktions-Zeigerwert (kein pH)', 'Nutrient indicator value':'Nährstoff-Zeigerwert',
 'Salinity indicator value':'Salz-Zeigerwert',
};
export function FugenduellPlantView({ lang, initialId = 'taraxacum-officinale' }: { lang: Language; initialId?: string }) {
 const de=lang==='de';const [id,setId]=useState(initialId);
 const plant=FUGENDUELL_STARTER_ROSTER.find(p=>p.id===id)!;const profile=BOTANY[id];
 const scientific=(SCIENTIFIC_TRAITS as Record<string, { source: string; values: Record<string,string>; scope?: string; error?: string }>)[id];
 return <section className="rounded-2xl border border-emerald-200 bg-white p-4 sm:p-6 space-y-4">
  <h2 className="text-2xl font-bold">{de?'Pflanze ansehen · Botanisches Notizbuch':'View plant · Botanical notebook'}</h2>
  <label className="block">{de?'Art auswählen':'Choose species'}<select className="mt-1 w-full min-h-11 rounded-lg border p-2 text-base" value={id} onChange={e=>setId(e.target.value)}>{FUGENDUELL_STARTER_ROSTER.map(p=><option key={p.id} value={p.id}>{de?p.nameCommonDe:p.nameCommonEn}</option>)}</select></label>
  <div><h3 className="text-xl font-bold">{de?plant.nameCommonDe:plant.nameCommonEn}</h3><p className="italic">{plant.scientificName}</p></div>
  <p className="text-sm text-stone-600">{de?'Ein überprüfter Anfang, kein vollständiger Datensatz. Größen gelten für die beschriebene Art und den Quellenkontext, nicht für deine einzelne Pflanze.':'A verified starting profile, not a complete dataset. Sizes describe the taxon in its source context, not your individual plant.'}</p>
  <dl className="space-y-3">{profile.facts.map(([label,german,english])=><div key={label} className="border-b pb-3"><dt className="font-bold">{label.split(' / ')[de?0:1]}</dt><dd>{de?german:english}</dd></div>)}</dl>
  {scientific && Object.keys(scientific.values).length > 0 && <div className="rounded-xl border border-emerald-200 p-3 space-y-3">
   <h4 className="font-bold">{de?'Wissenschaftliche Merkmale · Pladias':'Scientific traits · Pladias'}</h4>
   <dl className="space-y-2">{Object.entries(scientific.values).map(([trait,value])=><div key={trait} className="border-b pb-2"><dt className="text-sm font-semibold">{de ? TRAIT_LABELS[trait] || trait : trait}</dt><dd>{value}</dd></div>)}</dl>
   <p className="text-sm">{de?'Tschechische Flora. Zeigerwerte sind ökologische Präferenzen auf einer Rangskala, keine Messung des Bodens und keine pH-Zahlen. „x“ bedeutet breite ökologische Amplitude. Quellen und Methoden stehen beim jeweiligen Merkmal.':'Czech flora. Indicator values are ordinal ecological preferences, not soil measurements or pH numbers. “x” denotes broad ecological tolerance. Each source trait documents its references and method.'}</p>
   <p className="text-sm">Kaplan et al. (2019): {de?'Höhe, Lebensform, Blüte':'height, life form, flowering'} · Dřevojan (2020): {de?'Wuchsform':'growth form'} · Guo &amp; Pierce (2019): CSR · Chytrý et al. (2018): {de?'Zeigerwerte':'indicator values'}.</p>
   <a href={scientific.source} target="_blank" rel="noopener noreferrer" className="underline text-sky-800">Pladias · {de?'Merkmale und Originalreferenzen':'Traits and original references'}</a>
  </div>}
  {(!scientific || !Object.keys(scientific.values).length) && <p className="text-sm rounded-lg bg-amber-50 p-3">{de?'Für diese Art ist noch kein passend zugeordnetes Pladias-Profil importiert. Fehlende Werte werden nicht geschätzt.':'No matching Pladias profile has been imported for this taxon yet. Missing values are not estimated.'}</p>}
  <div className="space-y-3">
   <h4 className="text-lg font-bold">{de?'Vier botanische Fähigkeiten':'Four botanical abilities'}</h4>
   <p className="text-sm">{de?'Dokumentierte Merkmale der Art. Keine Bonuspunkte, keine Immunitäten. Merkmale können auch bei anderen Arten vorkommen.':'Documented species traits. No bonus points or immunities. Traits may also occur in other species.'}</p>
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{plant.skills.map(skill=><article key={skill.id} className="rounded-xl border border-sky-200 bg-sky-50 p-3 space-y-2">
    <h5 className="font-bold">{de?skill.nameDe:skill.nameEn}</h5>
    <p>{de?skill.descriptionDe:skill.descriptionEn}</p>
    <dl className="space-y-2">{skill.values.map(value=><div key={value.field}><dt className="text-sm font-semibold">{de?value.labelDe:value.labelEn}</dt><dd>{typeof value.value === 'number'?value.value.toLocaleString(de?'de-DE':'en-GB',{maximumSignificantDigits:4}):value.value} {value.unit}</dd></div>)}</dl>
    <a href={skill.source} target="_blank" rel="noopener noreferrer" className="underline text-sky-800 text-sm">{de?'Beleg und Methode':'Evidence and method'}</a>
    <p className="text-xs text-stone-600">{skill.scope}</p>
   </article>)}</div>
  </div>
  <div className="rounded-xl border border-violet-200 p-3 space-y-3">
   <h4 className="font-bold">{de?'Hitze, Kälte und Schatten messen':'Measuring heat, cold and shade tolerance'}</h4>
   <p className="text-sm">{de?'Diese Merkmale sind messbar. Für diese Art wurden hier noch keine passenden physiologischen Messwerte verifiziert. Die Links beschreiben Methoden, nicht Messungen dieser Art. Licht- und Temperatur-Zeigerwerte ersetzen diese Grenzwerte nicht.':'These traits are measurable. Matching physiological observations have not been verified here for this species yet. Links describe methods, not observations of this species. Light and temperature indicators do not replace these thresholds.'}</p>
   <dl className="space-y-3">{plant.stressMeasurements.map(trait=><div key={trait.id} className="border-b pb-2"><dt className="font-semibold">{de?trait.labelDe:trait.labelEn}</dt><dd>{trait.value ?? (de?'Noch nicht verifiziert':'Not verified yet')} · {trait.unit}<p className="text-sm mt-1">{de?trait.meaningDe:trait.meaningEn}</p><a className="text-sm underline text-sky-800" href={trait.methodSource} target="_blank" rel="noopener noreferrer">{de?'Methodenreferenz':'Method reference'}</a></dd></div>)}</dl>
   <p className="text-sm">{de?'Völlige Dunkelheit ist ein eigener Test: Überlebensdauer, Speicherreserven und Erholung nach Wiederbelichtung müssen bei definierter Temperatur und Wasserzufuhr erfasst werden. Es gibt keine allgemeine Dunkelheits-Punktzahl.':'Complete darkness requires a separate test: survival duration, stored reserves and recovery after re-illumination must be assessed under defined temperature and water conditions. There is no universal darkness score.'}</p>
  </div>
  <details><summary className="min-h-11 cursor-pointer font-bold">{de?'Datenlücken und Rohwerte':'Data gaps and raw values'}</summary>
   <p>{de?'Die alten 0–10-Werte und das 36-Punkte-Budget wurden entfernt. Für Tritt, physiologische Dürregrenzen, Samenproduktion, relative Wachstumsrate und chemische Wirkung fehlen hier passende verifizierte Messungen. Zeigerwerte ersetzen diese Messungen nicht.':'The old 0–10 scores and 36-point budget have been removed. Matching verified measurements are still missing here for trampling, physiological drought thresholds, seed output, relative growth rate and chemical effects. Indicator values do not substitute for those measurements.'}</p>
   <p className="mt-2">{de?'Wurzeltiefe RDepth (m, ungerundeter Datenbankwert):':'Root depth RDepth (m, unrounded database value):'} {plant.stats.wurzel ?? (de?'nicht verfügbar':'unavailable')}</p>
   <p className="mt-2">{de?'CSR nach Pladias/Pierce:':'CSR according to Pladias/Pierce:'} {plant.csr ?? (de?'noch nicht verifiziert':'not verified yet')}</p>
   <p className="mt-2">{de?'Wurzelwerte sind Artenmittel der erfassten Merkmale, keine Vorhersage für eine einzelne Straßenpflanze. Boden-pH braucht eine Standortmessung.':'Root values are species means of recorded traits, not predictions for an individual street plant. Soil pH requires a site measurement.'}</p>
  </details>
  <footer className="text-sm border-t pt-3 space-y-1"><a href={profile.source} target="_blank" rel="noopener noreferrer" className="text-sky-800 underline">{profile.publisher} · {de?'Quelle öffnen':'Open source'}</a><p>{profile.scope}</p><p>{de?'Geprüft: 09.10.2026 · zusammengefasste Fakten, keine übernommenen Abbildungen.':'Checked: 9 October 2026 · paraphrased facts, no copied illustrations.'}</p></footer>
 </section>;
}
