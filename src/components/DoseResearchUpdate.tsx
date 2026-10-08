import React from 'react';
import { ExternalLink, Microscope } from 'lucide-react';
import { Language } from '../types';

const SOURCES = [
  { label: 'NABU Jena · Vogelschlagmelder', url: 'https://vogelschlag.nabu-jena.de/' },
  { label: 'Berlin SenMVKU · Beurteilungshilfe', url: 'https://www.berlin.de/sen/uvk/presse/pressemitteilungen/2026/pressemitteilung.1679571.php' },
  { label: 'FLAP · BirdSafe DIY', url: 'https://www.flapapp.ca/' },
  { label: 'USGBC · Save the Birds (2026)', url: 'https://www.usgbc.org/sites/default/files/2026-05/Save%20the%20Birds%20course_1.pdf' },
  { label: 'Lawson et al. · field study (2026)', url: 'https://academic.oup.com/condor/article/128/3/1/8677179' },
  { label: 'Ottawa · preprint (2024–25 data)', url: 'https://ecoevorxiv.org/repository/view/12042/' },
  { label: 'Google Maps · terms', url: 'https://cloud.google.com/maps-platform/terms' },
  { label: 'Google Street View · API limits', url: 'https://developers.google.com/maps/documentation/streetview/usage-and-billing' },
  { label: 'Google Street View Insights · Vertex AI', url: 'https://developers.google.com/maps/documentation/street-view-insights/overview' },
  { label: 'Mapillary · CC BY-SA', url: 'https://help.mapillary.com/hc/en-us/articles/115001770409-CC-BY-SA-license-for-open-data' },
  { label: 'Berlin · orthophotos', url: 'https://www.berlin.de/sen/stadt/stadtdaten/geoinformation/landesvermessung/geotopographie-atkis/dop-digitale-orthophotos/' },
  { label: 'Berlin · 3D city model', url: 'https://daten.berlin.de/artikel/berlin-3d-stadtmodell-als-open-data' },
];

export function DoseResearchUpdate({ doseId, lang }: { doseId: string; lang: Language }) {
  if (doseId !== 'glasanflug-ampel') return null;
  const de = lang === 'de';
  const title = de ? 'Forschungsstand · 6. Oktober 2026' : 'Research update · 6 October 2026';

  return (
    <section aria-labelledby="dose-research-update" className="rounded-2xl border border-[var(--m-line)] bg-[var(--m-surface)] p-5 sm:p-6 space-y-3">
      <div className="flex items-center gap-2 text-[var(--m-accent)]">
        <Microscope className="w-4 h-4" />
        <h3 id="dose-research-update" className="text-sm font-bold font-typewriter uppercase tracking-wider">{title}</h3>
      </div>
      <p className="text-sm text-[var(--m-ink-2)] leading-relaxed">
        {de
          ? 'Die Neuheit ist enger als zuerst formuliert: BirdSafe bewertet Fassaden bereits per Fragebogen und berücksichtigt Fotos oder Renderings. Offen bleibt ein transparenter, versionierter Rechner für LAG VSW 21/01. Automatische Fotoauswertung ist vorgeschlagene Forschung, kein Bestandteil des heutigen Rechners.'
          : 'The novelty is narrower than first described: BirdSafe already assesses façades with a questionnaire and uses photos or renderings. The remaining distinction is a transparent, versioned calculator for LAG VSW 21/01. Automated photo assessment is proposed research, not part of the current calculator.'}
      </p>
      <ul className="list-disc pl-5 space-y-1 text-sm text-[var(--m-ink-2)] leading-relaxed">
        <li>{de ? 'Berlins Planungshilfe gibt Anwendungskontext, aber keinen Bedarfsbeleg für KI-Bewertung.' : 'Berlin’s planning guidance gives context, not proof of demand for AI scoring.'}</li>
        <li>{de ? 'Das Meldeformular sammelt Fotos; Trainingsrechte sind damit nicht geklärt.' : 'The reporting form collects photos; training rights are not thereby established.'}</li>
        <li>{de ? 'Wirksamkeitsmessung nach einer Maßnahme ist getrennt von der Gebäude-Risikobewertung.' : 'Measuring treatment effectiveness is separate from assessing building risk.'}</li>
        <li>{de ? 'Muster-Wartung bleibt eine unbestätigte Anschlussfrage; Straßenmarkierung ist nur eine Analogie.' : 'Pattern maintenance remains an unverified follow-on; road markings are only an analogy.'}</li>
        <li>{de ? 'Google Street View eignet sich nicht als Bildquelle für Scoring oder ML: Google untersagt abgeleitete Inhalte und Modelltraining; Street View Insights nutzt Vertex AI.' : 'Google Street View is not an image source for scoring or ML: Google bars derived content and model training; Street View Insights uses Vertex AI.'}</li>
        <li>{de ? 'Mapillary ist der bessere Kandidat für eine Abdeckungsprüfung, aber CC BY-SA muss zur CC0-Weitergabe passen. Berliner Luftbilder und LoD2 helfen beim Umfeld, nicht bei Fenstern.' : 'Mapillary is the better candidate for a coverage check, but CC BY-SA must be reconciled with CC0 distribution. Berlin aerial imagery and LoD2 help with context, not windows.'}</li>
      </ul>
      <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--m-line)] pt-3">
        {SOURCES.map((source) => (
          <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-[var(--m-accent)] hover:underline">
            {source.label}<ExternalLink className="w-3 h-3" />
          </a>
        ))}
      </div>
    </section>
  );
}
