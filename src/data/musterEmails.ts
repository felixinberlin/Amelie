export interface MusterEmail {
  id: string;
  typeId: 'forschung' | 'govtech' | 'firmen' | 'international';
  titleDe: string;
  titleEn: string;
  targetDe: string;
  targetEn: string;
  subjectDe: string;
  subjectEn: string;
  contextDe: string;
  contextEn: string;
  bodyDe: string;
  bodyEn: string;
  rulesApplied: number[];
  keyStrengthsDe: string[];
  keyStrengthsEn: string[];
}

export interface AntiPattern {
  badExample: string;
  explanationDe: string;
  explanationEn: string;
  violatedRule: number;
}

export const AMELIE_MUSTERS: MusterEmail[] = [
  {
    id: 'muster-forschung',
    typeId: 'forschung',
    titleDe: 'Muster 1: An Forschung & Hochschulinstitute',
    titleEn: 'Template 1: Research & Academic Institutes',
    targetDe: 'Hochschulen, Lehrstühle, Masterarbeiten, Verbundforschung (z.B. UdK, TU Berlin, Fraunhofer)',
    targetEn: 'Universities, academic labs, thesis candidates, research consortia',
    subjectDe: 'Idee zu verschenken: [Name der Idee] – [Forschungslücke / Methodik]',
    subjectEn: 'Free idea: [Concept Name] – [Methodological Gap]',
    contextDe: 'Hochschulinstitute suchen stets methodisch saubere, förderfähige Fragestellungen für Masterarbeiten oder Drittmittelprojekte. Sie brauchen wissenschaftliche Relevanz, keine Marketing-Pitches.',
    contextEn: 'Academic labs constantly look for methodologically sound, grant-worthy questions for master theses. They require scientific grounding, not commercial pitches.',
    rulesApplied: [1, 2, 3, 4],
    keyStrengthsDe: [
      'Baut direkt auf deren letzter Publikation oder Software auf',
      'Keine Bevormundung: Überlässt die Methodik dem Lehrstuhl',
      'Entlastung durch konkreten "Ersten Schritt" und Risikobenennung',
      'Absolutes Klingelverbot: Garantiert kein Nachfassen'
    ],
    keyStrengthsEn: [
      'Directly cites their recent paper or software tool',
      'Zero arrogance: Leaves methodological freedom to the institute',
      'Clarity via concrete Ticket #1 and documented failure mode',
      'Strict phone booth rule: Guaranteed zero follow-up'
    ],
    bodyDe: `Sehr geehrte/r Frau/Herr Prof. Dr. [Nachname],

ich recherchiere Softwarewerkzeuge, die erst seit kurzer Zeit technisch möglich sind, und baue nur einen Bruchteil davon selbst. Diese Idee passt thematisch exakt zu Ihrer Forschungsgruppe und nicht zu mir, deshalb schenke ich sie Ihnen.

[Konkreter Anker: 1–2 Sätze über deren letzte Publikation oder Tool, z. B.: „Ihr Fachgebiet hat mit dem Tool X gezeigt, wie Y gelöst wird..."]. 
Unbeantwortet bleibt dabei oft die angrenzende Frage: [Das konkrete Problem]. [Name der Idee] setzt genau dort an: [1 prägnanter Satz zur Lösung / Datennutzung].

Ein kompakter Einseiter mit Skizze, erstem Arbeitsschritt und der Bruchstelle, an der das Vorhaben scheitern kann:
https://felixinberlin.github.io/Amelie/ (bzw. https://github.com/felixinberlin/Amelie/blob/main/05-dosen/[slug].md)

Falls das Thema für eine Masterarbeit, ein studentisches Projekt oder einen Förderantrag taugt: Der Zuschnitt ist Open Source.

Keine Bedingungen, CC0 / gemeinfrei, keinerlei Gegenleistung erwartet. Wenn Sie an ähnlichen Ansätzen bereits arbeiten oder kein Interesse haben, ignorieren Sie diese Nachricht bitte einfach – ich melde mich nicht erneut.

Mit freundlichen Grüßen
Félix
Berlin · https://felixinberlin.github.io/Amelie/`,
    bodyEn: `Dear Prof. Dr. [Last Name],

I research open-source software concepts made newly feasible by modern tools, and I only build a small fraction myself. This concept aligns directly with your lab's research focus, so I am gifting it to you.

[Specific anchor: 1–2 sentences referencing their recent tool or paper].
A related question often remains unaddressed: [the gap]. [Concept Name] focuses precisely on this: [1 sentence explaining the deterministic method].

A concise one-page breakdown with technical architecture, initial development ticket, and the exact failure risk is available here:
https://felixinberlin.github.io/Amelie/

Everything is released under CC0 (Public Domain) with zero obligations or strings attached. If your team is already working on this or it lies outside your current semester focus, please simply ignore this note. I will not follow up.

Best regards,
Félix
Berlin · https://felixinberlin.github.io/Amelie/`
  },
  {
    id: 'muster-govtech',
    typeId: 'govtech',
    titleDe: 'Muster 2: An Stadt-Labs & Stiftungen mit Bauauftrag',
    titleEn: 'Template 2: Civic Labs, Foundations & Public Interest Tech',
    targetDe: 'CityLAB Berlin, Technologiestiftung, Open Knowledge Foundation, Prototype-Fund-Teams',
    targetEn: 'Civic labs, municipal innovation centers, public interest grant candidates',
    subjectDe: 'Idee zu verschenken: [Name der Idee] für Berlin',
    subjectEn: 'Free idea: [Concept Name] for Civic / Open City Tech',
    contextDe: 'Öffentlich geförderte Labs haben ein Mandat, Prototypen für Bürger zu bauen. Sie brauchen pragmatische Lösungen ohne Cloud-Abos oder Vendor-Lock-in.',
    contextEn: 'Public innovation labs hold civic mandates to build prototypes for citizens. They need pragmatic, vendor-free solutions without proprietary subscriptions.',
    rulesApplied: [1, 2, 3, 4],
    keyStrengthsDe: [
      'Lokaler Berliner Bezug ohne überheblichen Berater-Ton',
      'Datensparsam & 0-Euro-Betriebskosten hervorgehoben',
      'Direkt als Baustein für Hackathons oder Kiezlabore nutzbar',
      'Ausdrückliche Erlaubnis, nicht zu antworten'
    ],
    keyStrengthsEn: [
      'Locally tailored without pompous consulting jargon',
      'Emphasizes zero cloud operating cost and privacy by default',
      'Immediately usable as a hackathon seed or prototype grant application',
      'Explicit permission to never reply'
    ],
    bodyDe: `Hallo [Team-Name / Ansprechpartner],

ich recherchiere digitale Werkzeuge, die durch neuere Modelle und Schnittstellen plötzlich mit minimalem Aufwand machbar sind. Ich baue nur wenige davon selbst; diese hier ist so lokal zugeschnitten, dass sie zu Ihrer Arbeit gehört und nicht zu mir.

[Name der Idee]: [1–2 Sätze zum konkreten Problem der Stadt/Bürger, z. B. Sperrmüll, Lärm, Bürgerbeteiligung]. 
Das Konzept löst dies ohne schwerfällige Infrastruktur: [Der Kniff: z. B. dezentrale Aggregation, 12h-Verfall, lokales Handy-Mikrofon].

Eine Seite mit Ablauf, erstem Ticket und der Schwachstelle des Konzepts liegt hier:
https://github.com/felixinberlin/Amelie/blob/main/05-dosen/[slug].md

Das Ganze steht unter CC0 (Public Domain), ohne jede Bedingung. Wenn es als Impuls für das Kiezlabor, einen Hackathon oder ein Bürger-Tool nützlich ist, freut es mich; falls nicht, ist nichts verloren. Eine Rückmeldung ist nicht erforderlich, ich fasse nicht nach.

Viele Grüße
Félix
Berlin · https://felixinberlin.github.io/Amelie/`,
    bodyEn: `Hello [Team / Contact],

I research digital tools made radically simpler by recent commodity interfaces. I only build a small fraction myself; this idea is tailored so directly to civic technology that it belongs in your hands, not mine.

[Concept Name]: [1–2 sentences explaining the civic friction point, e.g. bulk waste, urban acoustics, or participatory planning].
The concept bypasses heavy centralized overhead: [The technical lever: e.g. client-side computation, zero cloud storage].

A one-page document detailing the architecture, the first implementation ticket, and the exact vulnerability is hosted here:
https://felixinberlin.github.io/Amelie/

Everything is licensed under CC0 (Public Domain) without conditions. If it sparks an initiative in your lab or hackathon, wonderful; if not, nothing is lost. No reply is expected, and I will not follow up.

Warm regards,
Félix
Berlin · https://felixinberlin.github.io/Amelie/`
  },
  {
    id: 'muster-firmen',
    typeId: 'firmen',
    titleDe: 'Muster 3: An Firmen mit passendem Produkt',
    titleEn: 'Template 3: Software Companies with Matching Products',
    targetDe: 'DevTools, SaaS mit bestehender Nutzerbasis (z.B. GitKraken, Tessl, Escape Motions, Socket)',
    targetEn: 'Developer tools, specialized software suites (e.g. GitKraken, Tessl, Socket)',
    subjectDe: 'Idee zu verschenken: [Feature-Name] für [Produktname]',
    subjectEn: 'Free idea: [Feature Name] for [Product Name]',
    contextDe: 'Firmen haben bezahlte Ingenieure. Sie hassen vage Ideen von außen, schätzen aber messerscharf zugeschnittene Feature-Erweiterungen mit klarer Bruchstellen-Analyse.',
    contextEn: 'Companies employ salaried engineering teams. They dismiss vague pitches, but appreciate razor-sharp feature extensions grounded in technical reality.',
    rulesApplied: [1, 2, 3, 4],
    keyStrengthsDe: [
      'Bezieht sich direkt auf ein bereits existierendes Produktfeature',
      'Keine Beteiligungsansprüche: Völlige Freiheit für deren Roadmap',
      'Kein Sales-Pitch, sondern ein technischer Hebel in 3 Sätzen',
      'Kein Terminanfrage-Ballast'
    ],
    keyStrengthsEn: [
      'Directly references a specific product feature they already shipped',
      'Zero equity or licensing demands: Complete freedom for their roadmap',
      'No marketing pitch: Just 3 sentences of technical lever',
      'Zero calendar friction'
    ],
    bodyDe: `Hallo [Name / Team],

ich recherchiere Entwickler-Werkzeuge, die erst seit Kurzem technisch machbar sind, und baue selbst nur etwa jede zwanzigste Idee. Diese hier ergänzt direkt das, was Sie mit [spezifisches Feature/Produkt] gebaut haben — nehmen Sie sie gerne mit.

[Problem in einem Satz: z. B. „Coding-Agenten raten aktuell, warum Legacy-Code geändert wurde, weil Git-Historie, Issues und PR-Diskussionen voneinander getrennt sind"].
[Lösung in einem Satz: z. B. „Eine einheitliche Blame-to-Issue-Traversierung über das Model Context Protocol (MCP) löst dies ohne Bruch im Workflow des Entwicklers"].

Hier ist ein kompakter Einseiter mit der Architektur, dem ersten Implementierungs-Ticket und dem exakten Risiko, an dem es scheitern könnte:
https://felixinberlin.github.io/Amelie/ (bzw. https://github.com/felixinberlin/Amelie/blob/main/05-dosen/[slug].md)

Veröffentlicht unter CC0 (Public Domain) — übernehmen, anpassen oder verwerfen. Sie schulden mir nichts, nicht einmal eine Antwort. Falls das bereits auf Ihrer internen Roadmap steht oder aktuell nicht passt, ignorieren Sie diese E-Mail bitte einfach. Ich fasse nicht nach.

Viele Grüße
Félix
Berlin · https://github.com/felixinberlin/Amelie`,
    bodyEn: `Hi [Name / Team],

I research developer tooling that only recently became feasible, and I only build about one in twenty myself. This idea directly complements what you've shipped with [specific feature or product], so it's yours to take.

[Problem in one sentence: e.g. "AI agents currently guess why legacy code changed because git blame, issue discussions, and PR threads remain disconnected"].
[Solution in one sentence: e.g. "A unified blame-to-issue traversal service exposed over MCP bridges this gap with zero workflow disruption"].

Here is a one-page breakdown with the architecture, the first implementation ticket, and the exact failure risk:
https://felixinberlin.github.io/Amelie/

Released under CC0 (Public Domain) — adopt it, adapt it, or discard it. You owe me nothing, not even a reply. If this is already on your internal roadmap or conflicts with your priorities, simply ignore this note. I will not follow up.

Best regards,
Félix
Berlin · https://github.com/felixinberlin/Amelie`
  },
  {
    id: 'muster-international',
    typeId: 'international',
    titleDe: 'Muster 4: An Internationale Open-Source-Netze',
    titleEn: 'Template 4: International Open Source & Sensor Networks',
    targetDe: 'NoiseCapture/Noise-Planet, OpenStreetMap Tasking Manager, Thünen-Institut',
    targetEn: 'NoiseCapture/Noise-Planet, OpenStreetMap workgroups, international sensor consortia',
    subjectDe: 'Idee zu verschenken: [Kurztitel] – [Methodenwechsel / Ruhe-Fenster]',
    subjectEn: 'Free idea: [Short Concept Title] — [Key shift, e.g. quiet windows over averages]',
    contextDe: 'Internationale Forschungs- und Sensornetzwerke verfügen oft über riesige Datenmengen, haben aber Lücken bei alltagsnahen Visualisierungen für Laien.',
    contextEn: 'International sensor consortia possess vast telemetry archives, but frequently miss user-centric micro-tools for neighborhood questions.',
    rulesApplied: [1, 2, 3, 4],
    keyStrengthsDe: [
      'Respektvoller, präziser Ton auf Augenhöhe mit internationalen Maintainern',
      'Würdigt bestehende Dateninfrastruktur',
      'Kein Aufwand für die Maintainer, da reines Geschenk',
      'Ausdrückliche Zusage: Kein Nachfassen'
    ],
    keyStrengthsEn: [
      'Polished, precise English with respectful brevity',
      'Acknowledges and honors their existing data architecture',
      'Demands zero maintenance burden'
    ],
    bodyDe: `Hallo [Projekt-Team],

ich recherchiere Open-Source-Softwarekonzepte, die durch neuere Tools technisch machbar geworden sind, und gebe diejenigen ab, die ich nicht selbst baue. Diese Idee gehört in Ihren Themenbereich.

[Bezug zum Projekt]: [Projektname] leistet hervorragende Arbeit bei [bisherige Leistung, z. B. weltweite Schallpegel-Messungen]. Anwohnende und Bürger stehen jedoch oft vor einer anderen praktischen Frage: [die Lücke, z. B. „Wann ist diese Straße tatsächlich leise?"].
[Der Hebel / Methodenwechsel]: [Wie die Idee bestehende Sensordaten mit Privacy-by-Design alltagsnah nutzbar macht].

Ein kompakter Einseiter mit der Methode, dem ersten Entwicklungsschritt und der Sollbruchstelle:
https://felixinberlin.github.io/Amelie/ (bzw. https://github.com/felixinberlin/Amelie/blob/main/05-dosen/[slug].md)

Alles steht unter CC0 / Gemeinfreiheit, vollkommen ohne Bedingungen. Falls Sie bereits an etwas Ähnlichem arbeiten oder es nicht zu Ihren aktuellen Meilensteinen passt, ignorieren Sie diesen Hinweis einfach. Ich fasse nicht nach.

Félix (Berlin)
https://felixinberlin.github.io/Amelie/`,
    bodyEn: `Subject: Free idea: [Short Concept Title] — [Key shift, e.g. quiet windows instead of averages]

Hello [Project Team],

I research open-source software concepts enabled by recent commodity tooling, and I give away the ones I won't be building myself. This one belongs in your domain.

[Context]: [Project Name] provides excellent [crowdsourced measurements / open telemetry]. However, citizens often face a different practical question: [the gap, e.g. "When is this courtyard actually quiet?"].
[The shift]: [How the idea re-frames existing data with local privacy-by-design].

One page outlining the architecture, the first implementation ticket, and where the assumption might break:
https://felixinberlin.github.io/Amelie/

Everything is licensed under CC0 / Public Domain with zero obligations. If you are already working on this or it conflicts with current priorities, simply ignore this note.

Félix, Berlin
https://felixinberlin.github.io/Amelie/`
  }
];

export const AMELIE_ANTI_PATTERNS: AntiPattern[] = [
  {
    badExample: '„Ich hätte da eine tolle Idee für euer Tool, lasst uns doch mal nächste Woche 15 Minuten unverbindlich zoomen oder einen Kaffee trinken!"',
    explanationDe: 'Ein Geschenk bürdet dem Empfänger niemals einen Kalendertermin auf. Wer Kaffeetrinken verlangt, sucht Aufmerksamkeit, Bestätigung oder Akquise. Die Dose muss für sich selbst sprechen.',
    explanationEn: 'A genuine gift never burdens the recipient with calendar friction. Demanding a zoom call seeks validation or sales entry. The tin must stand completely on its own.',
    violatedRule: 2
  },
  {
    badExample: '„Hallo Maintainer, ich habe eine Idee für euer Open-Source-Repo: Ihr müsstet nur folgende 5 Features bauen..."',
    explanationDe: 'Einen überlasteten, unbezahlten Maintainer mit unerbetenen Aufgaben zu bewerfen, ist kein Geschenk, sondern Ausbeutung. An Einzelmaintainer gehen Ideen nur mit fertigem, lauffähigem Code-Skelett.',
    explanationEn: 'Dumping unsolicited homework onto unpaid, exhausted open-source maintainers is not a gift — it is emotional pollution. Maintainers only receive working, runnable code skeletons.',
    violatedRule: 4
  },
  {
    badExample: '„Hallo, ich wollte kurz nachfragen, ob meine Mail vom Dienstag angekommen ist und wie ihr die Idee findet?"',
    explanationDe: 'Das Klingelverbot! Wer nachfasst, beweist, dass es kein Geschenk war, sondern eine Bringschuld. Einmal zustellen, in die Telefonzelle legen, und verschwinden.',
    explanationEn: 'The telephone booth rule! Following up proves that it was not a gift, but a disguised demand for attention. Deliver once, step away, and vanish.',
    violatedRule: 3
  }
];
