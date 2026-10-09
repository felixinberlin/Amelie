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
  <div className="rounded-xl bg-sky-50 border border-sky-200 p-3 space-y-2"><h4 className="font-bold">{de?'Wie wird daraus ein Spiel?':'How does this become a game?'}</h4>
   {profile.taproot && <p>{de?'Pfahlwurzel → Wurzelkarte gibt +3 statt +2. Die Eigenschaft ist belegt; der Bonus ist eine Spielentscheidung.':'Taproot → root card grants +3 rather than +2. The trait is sourced; the bonus is a game-design choice.'}</p>}
   {profile.dispersal && <p>{de?'Wind- oder Schleuderausbreitung → Samenkarte gibt +4 statt +3 Besiedlungskraft. Das ist keine gemessene Ausbreitungsrate.':'Wind or explosive dispersal → seed card grants +4 rather than +3 colonisation strength. This is not a measured dispersal rate.'}</p>}
   {profile.wall && <p>{de?'Belegter Mauerstandort → +2 im Mörtelwand-Spiel. Mauern unterscheiden sich in Feuchtigkeit und Licht; der Bonus vereinfacht das.':'Documented wall habitat → +2 in the mortar-wall game. Walls vary in moisture and light; the bonus simplifies this.'}</p>}
   {!profile.taproot && !profile.dispersal && !profile.wall && <p>{de?'Noch kein quellenbasierter Spezialbonus in der Gemeinschaft. Die Art nutzt die allgemeinen Kartenregeln.':'No source-backed special bonus in community mode yet. This species uses the general card rules.'}</p>}
  </div>
  <details><summary className="min-h-11 cursor-pointer font-bold">{de?'Spielwerte und noch fehlende Messdaten':'Game scores and missing measurements'}</summary>
   <p className="text-sm mb-2">{de?'Die bisherigen 0–10-Werte sind manuell kuratierte Spielwerte. Die importierten Pladias-Merkmale werden separat gezeigt; sie ersetzen noch nicht diese sechs Spielwerte.':'The existing 0–10 values are manually curated game scores. Imported Pladias traits are displayed separately; they do not yet replace these six game scores.'}</p>
   <dl className="grid grid-cols-2 sm:grid-cols-3 gap-2">{Object.entries(plant.stats).map(([trait,value])=><div key={trait} className="bg-stone-50 p-2"><dt>{trait}</dt><dd>{value}/10 · {de?'Spielwert':'game score'}</dd></div>)}</dl>
   <p className="mt-3">{de?'Hier noch nicht verifiziert: Wurzeltiefe (m), Wachstumsrate (g/g/Tag), Samen pro Individuum, Wasserpotential (MPa), Salzschwelle. Boden-pH und Gesundheit deiner Pflanze benötigen eigene Messungen.':'Not verified here yet: root depth (m), growth rate (g/g/day), seeds per individual, water potential (MPa), salt threshold. Your plant’s soil pH and condition require individual observations.'}</p>
  </details>
  <footer className="text-sm border-t pt-3 space-y-1"><a href={profile.source} target="_blank" rel="noopener noreferrer" className="text-sky-800 underline">{profile.publisher} · {de?'Quelle öffnen':'Open source'}</a><p>{profile.scope}</p><p>{de?'Geprüft: 09.10.2026 · zusammengefasste Fakten, keine übernommenen Abbildungen.':'Checked: 9 October 2026 · paraphrased facts, no copied illustrations.'}</p></footer>
 </section>;
}
