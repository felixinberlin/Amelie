import { DeliveryEmail } from '../types';

export const DELIVERIES_DATA: DeliveryEmail[] = [
  {
    id: 'mail-1',
    mailIndex: 1,
    titleDe: 'Mail 1: Altbau Thermal → Forschungsverbund EnergyMap Berlin',
    titleEn: 'Mail 1: Altbau Thermal → EnergyMap Berlin Research Consortium',
    recipientOrg: 'Forschungsverbund EnergyMap Berlin (Projektleitung UdK Berlin)',
    recipientTypeDe: 'Forschung (Rang 2) · Kein Code nötig',
    recipientTypeEn: 'Academic Research (Rank 2) · No preliminary code required',
    contactPathDe: 'Projektkoordination Prof. Dr.-Ing. Christoph Nytsch-Geusen, UdK Berlin',
    contactPathEn: 'Project lead Prof. Dr.-Ing. Christoph Nytsch-Geusen, UdK Berlin',
    subjectDe: 'Idee zu verschenken: die Wohnungsebene unter EnergyMap Berlin',
    subjectEn: 'Free idea gift: the apartment level underneath EnergyMap Berlin',
    bodyDe: `Sehr geehrter Herr Professor Nytsch-Geusen,

ich recherchiere Software, die erst seit Kurzem technisch möglich ist, und baue nur einen kleinen Teil davon selbst. Diese Idee passt zu Ihrem Verbund und nicht zu mir, deshalb schenke ich sie Ihnen.

EnergyMap Berlin beantwortet seit Mai 2025 die Frage, was ein Gebäude braucht — und mit energymap4py sogar programmatisch. Unbeantwortet bleibt die Frage danach: was die einzelne Wohnung tut. Grundriss zeichnen, Baualtersklasse wählen, sehen, was das gekippte Fenster im Berliner Zimmer kostet und ab welcher Raumfeuchte eine Ecke über 80 % Oberflächenfeuchte rutscht. Kein Konkurrenzprodukt — es verbraucht Ihre Daten, statt sie zu ersetzen, und die Sommerrichtung derselben Gleichung wäre an CoolingMap anschlussfähig.

Eine Seite mit Skizze, erstem Ticket und der Stelle, an der es schiefgeht — nämlich Scheingenauigkeit bei fünfstelligen Sanierungsentscheidungen: [Link zur Dose: Altbau Thermal]

Falls das eine studentische Arbeit wert ist: der erste Schritt (ein Raum, gegen ISO 10211 validiert) ist klein genug dafür.

Keine Bedingungen, CC0, keine Gegenleistung erwartet. Wenn Sie so etwas längst planen, ignorieren Sie diese Mail bitte einfach — ich melde mich nicht erneut.

Mit freundlichen Grüßen
Félix (Berlin)`,
    bodyEn: `Dear Professor Nytsch-Geusen,

I research software opportunities that only recently became technically viable, and only build a small fraction myself. This idea belongs with your research consortium, not with me, which is why I am gifting it to you.

EnergyMap Berlin answers what an entire building requires — and with energymap4py even programmatically. Left open is the question right behind it: what does the individual apartment do? Draw a floor plan, pick the construction epoch, and see what a tilted window in a Berlin room costs and at what room humidity a corner passes 80 % surface humidity. Not a competitor — it consumes your open data instead of replacing it, and the summer orientation of the same physics links into CoolingMap.

One page with the sketch, first ticket, and the crucial failure point — false precision in five-figure retrofitting decisions: [Link to tin: Altbau Thermal]

If this is worth a student thesis: the first step (one room, validated against ISO 10211) is small enough for that.

No strings attached, CC0, zero compensation expected. If you already have this in flight, please just ignore this email — I will not follow up.

Warm regards,
Félix (Berlin)`,
    doseLinks: ['altbau-thermal'],
    scheduleDe: 'Sofort versendbar · Höchste Trefferwahrscheinlichkeit',
    scheduleEn: 'Immediate dispatch · Highest success probability',
    sent: true,
    sentAt: '2026-09-20'
  },
  {
    id: 'mail-2',
    mailIndex: 2,
    titleDe: 'Mail 2: Sperrmüll-Radar & Kiez-Lärmkarte → CityLAB Berlin',
    titleEn: 'Mail 2: Sperrmüll-Radar & Quiet-Windows Map → CityLAB Berlin',
    recipientOrg: 'CityLAB Berlin (Technologiestiftung Berlin)',
    recipientTypeDe: 'Organisation mit Bauauftrag und Budget (Rang 1)',
    recipientTypeEn: 'Public innovation lab with municipal mandate (Rank 1)',
    contactPathDe: 'Allgemeine Kontaktadresse citylab-berlin.org/kontakt',
    contactPathEn: 'General team contact at citylab-berlin.org/kontakt',
    subjectDe: 'Zwei Ideen zu verschenken: Sperrmüll-Radar und Ruhe-Fenster-Karte',
    subjectEn: 'Two ideas as a gift: Curb Giveaway Radar & Quiet-Windows Noise Map',
    bodyDe: `Hallo CityLAB-Team,

ich recherchiere Software-Lücken, die erst seit Kurzem technisch möglich sind, und baue nur einen kleinen Teil davon selbst. Zwei davon sind so berlinerisch, dass sie zu Ihnen gehören und nicht zu mir.

Sperrmüll-Radar: 2025 gab es fast 200.000 Meldungen illegaler Müllablagerungen in Berlin (>13 Mio. € Beseitigungskosten). Das Berliner „Zu verschenken"-Bordsteinprotokoll funktioniert ohne Server — ist analog aber zu langsam, sodass Brauchbares im Regen landet. In den USA gibt es dafür CurbAlert-Apps (werbefinanziert, mit Kontozwang). Die Berliner Lücke: gemeinnützig, kontolos, OSM-Straßensegment statt Hausnummer, und Verfall als Datenschutzkonzept. Als Kaltstart-Bühne bieten sich die ~80 BSR-Kieztage pro Jahr an; inhaltlicher Domänenpartner wäre Re-Use Berlin (deren Re-Use-Karte aktuell als 2,8-MB-PDF existiert).

Kiez-Lärmkarte: Der Lärmaktionsplan 2024–2029 liefert Modellkarten und Jahresmittel. Menschen suchen etwas anderes: das Zeitfenster, in dem diese Straße leise ist. Handy-Mikrofon misst ausschließlich dB-Pegel, nie Audio, Aggregation lokal. Auch hier die Vorarbeit offen auf den Tisch: Hush City ist an der TU Berlin entstanden und wurde 2018 von Berlin für die Quiet-Areas-Planung übernommen — die App bewertet allerdings Orte als ruhig und berechnet ihre Pegel aus einer Audioaufnahme. Die offene Frage bleibt die zeitliche: nicht wo es ruhig ist, sondern wann.

Je eine Seite mit Skizze, erstem Ticket und der Stelle, an der es kippt:
- Sperrmüll-Radar: [Link zur Dose: Sperrmüll-Radar]
- Kiez-Lärmkarte: [Link zur Dose: Kiez-Lärmkarte]

Beide sind CC0, ohne jede Bedingung. Falls eine davon in Richtung GovTech TestLAB oder Kiezlabor passt, umso besser; falls nicht, ist auch nichts verloren. Eine Antwort ist nicht nötig, ich fasse nicht nach.

Viele Grüße
Félix (Berlin)`,
    bodyEn: `Hello CityLAB Team,

I research software opportunities enabled by recent technology advances, and only build a fraction myself. Two of them are so quintessentially Berlin that they belong with your team rather than me.

Sperrmüll-Radar: In 2025, Berlin recorded nearly 200,000 reports of illegal fly-tipping (>€13M clean-up costs). The analog curb giveaway protocol is too slow: usable goods sit in rain until ruined. Commercial curb-alert apps exist in the US with ads and account requirements. The Berlin civic gap: non-profit, zero accounts, OSM street segments instead of house numbers, and automatic expiration as privacy by design. Ideal cold start: ~80 annual BSR neighborhood clean-up days; natural domain partner: Re-Use Berlin (whose current directory exists only as a 2.8MB PDF).

Kiez-Lärmkarte: The 2024–2029 Noise Action Plan provides annual model averages. But residents seek something else: tranquility windows — the time of day when a given street block is quiet. Phone mics capture sound level only, never raw audio, locally aggregated before transmission.

One page each with architecture sketch, first ticket, and key failure mode:
- Sperrmüll-Radar: [Link to tin: Sperrmüll-Radar]
- Kiez-Lärmkarte: [Link to tin: Kiez-Lärmkarte]

Both are CC0, without conditions. If either fits GovTech TestLAB or Kiezlabor explorations, all the better; if not, nothing is lost. No reply necessary, I will not follow up.

Best regards,
Félix (Berlin)`,
    doseLinks: ['sperrmuell-radar', 'kiez-laermkarte'],
    scheduleDe: 'Gesendet am 21.09.2026',
    scheduleEn: 'Sent on 2026-09-21',
    sent: true,
    sentAt: '2026-09-21'
  },
  {
    id: 'mail-3',
    mailIndex: 3,
    titleDe: 'Mail 3: Kiez-Lärmkarte (Methode) → Noise-Planet / NoiseCapture',
    titleEn: 'Mail 3: Quiet Windows Methodology → Noise-Planet / NoiseCapture',
    recipientOrg: 'Université Gustave Eiffel + CNRS (Noise-Planet / NoiseCapture)',
    recipientTypeDe: 'Internationale Forschung (Rang 2) · Englisch',
    recipientTypeEn: 'International Academic Research (Rank 2) · English',
    contactPathDe: 'Über das NoiseCapture-Repository bzw. noise-planet.org',
    contactPathEn: 'Via NoiseCapture repository / noise-planet.org team',
    subjectDe: 'Idee zu verschenken: Ruhe-Fenster statt Jahresmittel',
    subjectEn: 'Subject: Free idea: quiet windows instead of average levels',
    bodyDe: `Hallo NoiseCapture-Team,

ich recherchiere Software-Ideen und verschenke diejenigen, die ich nicht selbst bauen werde. Diese Idee gehört zu Ihrer Forschungsgruppe.

NoiseCapture kartiert gemessene Schallpegel weltweit. Offizielle Aktionspläne, wie auch der Berliner Lärmaktionsplan 2024–2029, arbeiten mit modellierten Jahresmittelwerten. Keines davon beantwortet die Frage, die Menschen bei der Wohnungssuche oder im Dialog mit Vermietern tatsächlich stellen: Wann ist diese Straße leise?

Um die Vorarbeit offen auf den Tisch zu legen: Hush City (an der TU Berlin entwickelt und 2018 von Berlin für die Quiet-Areas-Planung übernommen) hat die bürgerschaftliche Erfassung von alltäglichen Ruhe-Orten („everyday quiet areas") pionierhaft vorangebracht. Hush City bewertet jedoch statische Orte statt zeitlicher Zeitfenster und berechnet Pegel aus 44,1-kHz-Roh-Audioaufnahmen.

Dieselben Sensoren, andere Fragestellung: Eine Ruhe-Fenster-Karte pro Straßenabschnitt, lokal auf dem Gerät aggregiert, reine dB-Pegel, niemals Audio. Das Privacy-First-Design ist kein nachträgliches Feature; es ist die einzige Variante, die den Kontakt mit Bürgerinnen und Bürgern übersteht.

Eine Seite mit der Skizze, dem ersten Ticket und der Sollbruchstelle: [Link zur Dose: Kiez-Lärmkarte]

Vollständig CC0, ohne jede Bedingung, kein Nachfassen. Falls das ohnehin auf Ihrer Roadmap steht, ignorieren Sie diese Nachricht bitte einfach.

Félix (Berlin)`,
    bodyEn: `Subject: Free idea: quiet windows instead of average levels

Hello,

I research software ideas and give away the ones I won't build myself. This one belongs with your group.

NoiseCapture maps measured sound levels across the world. Official action plans, including Berlin's for 2024–2029, work with modelled yearly averages. Neither answers the question people actually ask when choosing a flat or arguing with a landlord: when is this street quiet?

To put prior art on the table: Hush City (developed at TU Berlin and adopted by Berlin in 2018 for quiet-area planning) pioneered civic mapping of "everyday quiet areas." However, Hush City rates static places rather than temporal windows, and computes levels from 44.1 kHz raw audio recordings.

Same sensors, different question — a quiet-window map per street segment, aggregated on-device, dB levels only, never audio. The privacy-first design is not a feature to add later; it is the only version that survives contact with users.

One page with the sketch, the first ticket, and the part most likely to kill it: [Link to tin: Kiez-Lärmkarte]

CC0, no strings, no follow-up. If this is already in your roadmap, please just ignore this.

Félix, Berlin`,
    doseLinks: ['kiez-laermkarte'],
    scheduleDe: 'Gesendet am 21.09.2026',
    scheduleEn: 'Sent on 2026-09-21',
    sent: true,
    sentAt: '2026-09-21'
  },
  {
    id: 'mail-4',
    mailIndex: 4,
    titleDe: 'Mail 4: Brettchen-Vorsortierer → Thünen-Institut für Biodiversität (MonViA)',
    titleEn: 'Mail 4: Bee Nesting Pre-sorter → Thuenen Institute of Biodiversity (MonViA)',
    recipientOrg: 'Thünen-Institut für Biodiversität / MonViA Wildbienen-Monitoring',
    recipientTypeDe: 'Bundesforschungsinstitut (Rang 2) · Citizen Science Engpass',
    recipientTypeEn: 'Federal Research Institute (Rank 2) · Citizen Science Bottleneck',
    contactPathDe: 'Projektleitung MonViA (Dr. Jens Dauber / Dr. David Ott), thuenen.de/de/bd',
    contactPathEn: 'MonViA project coordination (Dr. Jens Dauber / Dr. David Ott), thuenen.de/de/bd',
    subjectDe: 'Idee zu verschenken: automatischer Vorsortierer für MonViA-Nisthilfen-Fotos',
    subjectEn: 'Free idea gift: automated pre-sorting pipeline for MonViA nesting box photos',
    bodyDe: `Sehr geehrtes MonViA-Team, sehr geehrter Herr Dr. Dauber,

ich recherchiere Software-Lücken im zivilgesellschaftlichen und wissenschaftlichen Raum und verschenke die Entwürfe an Teams mit passendem Mandat. Diese Idee gehört zu Ihnen.

Ihr bundesweites Wildbienen-Monitoring leidet unter einem bekannten Citizen-Science-Flaschenhals: Tausende Einsendungen von Nisthilfen-Fotos müssen von Experten gesichtet werden — bis zu 90 Minuten manuelle Arbeit pro Block, obwohl 95 % der Bohrlöcher leer oder unbesiedelt sind.

Die Idee ist kein schwerfälliges KI-Allround-Modell, sondern ein reiner Bounding-Box-Vorsortierer: Bild entzerren, Raster der Röhrchen erkennen, leere Röhren automatisch ausschneiden und nur belegte Nistverschlüsse (Lehm, Blätter, Harz) in eine schnelle Review-Schlange geben. Reduziert die Sichtungszeit um 80 %, ohne Bestimmungsrisiko.

Eine Seite mit Skizze, erstem 2-Tage-Ticket und der Sollbruchstelle (schräge Aufnahmewinkel bei Sonnenlicht): [Link zur Dose: Brettchen-Vorsortierer]

Vollständig CC0, ohne jede Bedingung. Wenn Sie ein solches Werkzeug längst in Erprobung haben, ignorieren Sie diese Mail bitte einfach — ich fasse nicht nach.

Mit freundlichen Grüßen
Félix (Berlin)`,
    bodyEn: `Dear MonViA Team, dear Dr. Dauber,

I research software opportunities for civic and scientific domains and gift turn-key briefs to organizations with an authentic mandate. This idea belongs with your institute.

Your nationwide wild bee monitoring project faces a familiar Citizen Science bottleneck: thousands of submitted nesting board photos require expert manual inspection — taking up to 90 minutes per block, even though 95% of nesting holes are completely empty.

The concept is not a heavy end-to-end classification AI, but a clean bounding-box pre-sorter: perspective-correct the photo, detect hole centroids, filter out empty holes via simple edge contrast, and only present occupied closures (clay, leaf pulp, resin) to human taxonomists. Cuts manual review time by 80% with zero misclassification risk.

One page with architecture sketch, first 2-day ticket, and the crucial failure point (oblique phone angles with harsh sun glare): [Link to tin: Bee Nesting Pre-sorter]

Completely CC0, no strings attached. If you already have this in your research pipeline, please just ignore this email — I will not follow up.

Warm regards,
Félix (Berlin)`,
    doseLinks: ['brettchen-vorsortierer'],
    scheduleDe: 'Bereit für Runde 2 (Oktober 2026)',
    scheduleEn: 'Ready for Round 2 dispatch (October 2026)'
  },
  {
    id: 'mail-5',
    mailIndex: 5,
    titleDe: 'Mail 5: Glasanflug-Ampel → LAG Vogelschutzwarten & NABU',
    titleEn: 'Mail 5: Bird Collision Risk Calculator → LAG Bird Conservation & NABU',
    recipientOrg: 'Länderarbeitsgemeinschaft der Vogelschutzwarten (LAG VSW) / NABU Vogelschutz an Glas',
    recipientTypeDe: 'Fachgremium & Naturschutzverband (Rang 1 & 2)',
    recipientTypeEn: 'State Bird Conservation Centers & NABU (Rank 1 & 2)',
    contactPathDe: 'Arbeitsgruppe Vogelschutz an Glas (vogelwarte.de / nabu.de)',
    contactPathEn: 'Working group on bird collision mitigation (vogelwarte.de / nabu.de)',
    subjectDe: 'Idee zu verschenken: der Prüfleitfaden Vogelschutz an Glas als 3-Klick-Webtool',
    subjectEn: 'Free idea gift: LAG-VSW Bird Collision Testing Standard as a 3-click web calculator',
    bodyDe: `Sehr geehrte Damen und Herren der Länderarbeitsgemeinschaft, hallo NABU-Team,

ich recherchiere Software-Werkzeuge, die als verbindliche Normen existieren, aber nie als handhabbares Werkzeug gebaut wurden. Diese Idee gehört zu Ihnen.

Ihr „Prüfleitfaden Vogelschutz an Glas" definiert wissenschaftlich präzise Kriterien für BNatSchG §44: Reflexionsgrad, Scheibengeometrie, Durchsicht und zertifizierte Punktraster (9x9 cm) statt nutzloser Greifvogel-Aufkleber. Doch Architekten und Bauämter müssen sich noch immer durch 30 Seiten PDF arbeiten.

Die Idee: Eine clientseitige Web-App ohne Server („Glasanflug-Ampel"). 3 Fragen zu Glasart, Umgebungsvegetation und Markierungsposition führen zu einer sofortigen Ampelbewertung (Grün/Gelb/Rot) mit druckbarem PDF-Prüfnachweis für die Genehmigungsbehörde.

Eine Seite mit Skizze, Ticket #1 und der Sollbruchstelle (Scheinsicherheit durch fehlerhafte Reflexionsmessung): [Link zur Dose: Glasanflug-Ampel]

CC0, Public Domain, keine Bedingungen oder Gegenleistungen. Wenn so ein Tool bei Ihnen bereits in Arbeit ist, ignorieren Sie diese Nachricht einfach — ich melde mich nicht erneut.

Mit freundlichen Grüßen
Félix (Berlin)`,
    bodyEn: `Dear Members of the LAG Bird Conservation Working Group, hello NABU team,

I research software opportunities that exist as authoritative regulatory standards but have never been implemented as frictionless web tools. This idea belongs with your working group.

Your testing guide "Vogelschutz an Glas" establishes rigorous criteria under German conservation law (§44 BNatSchG): reflection percentages, surrounding greenery, through-vision corridors, and certified dot grids (9x9 cm) rather than useless raptor stickers. Yet architects and municipal authorities still thumb through a 30-page static PDF.

The concept: A zero-server client-side web tool ("Glass Hazard Score"). Answering 3 physical parameters produces an instant traffic-light rating (Green/Amber/Red) and an exportable compliance certificate for building permit applications.

One page with the sketch, Ticket #1, and the failure point (false sense of safety due to inaccurate reflection estimation): [Link to tin: Glass Hazard Score]

CC0 Public Domain, completely unencumbered. If you already have this in production, please just ignore this email — I will not follow up.

Warm regards,
Félix (Berlin)`,
    doseLinks: ['glasanflug-ampel'],
    scheduleDe: 'Bereit für Runde 2 (Oktober 2026)',
    scheduleEn: 'Ready for Round 2 dispatch (October 2026)'
  },
  {
    id: 'mail-6',
    mailIndex: 6,
    titleDe: 'Mail 6: Spec-Drift Detector → Guy Podjarny / Tessl & Agentic DevRel',
    titleEn: 'Mail 6: Spec-Drift Detector → Guy Podjarny / Tessl & Agentic DevRel',
    recipientOrg: 'Tessl (Spec-First Agentic Software Development)',
    recipientTypeDe: 'Tech-Pioniere im Developer-Tooling (Rang 5) · Englisch',
    recipientTypeEn: 'Developer Tooling Founders (Rank 5) · English',
    contactPathDe: 'Guy Podjarny (@guypod) / Tessl Engineering Community',
    contactPathEn: 'Guy Podjarny (@guypod) / Tessl Engineering Community',
    subjectDe: 'Ideen-Schenkung: Spec-Drift Detector für autonome Coding-Agenten',
    subjectEn: 'Subject: Free concept gift: Spec-Drift Detector for autonomous coding agents',
    bodyDe: `Hallo Guy, hallo Tessl-Team,

ich recherchiere neu entstehende Software-Mechaniken und verschenke die Architektur-Entwürfe an diejenigen, die sie am besten bauen können. Diese Idee gehört zu Tessl.

Wenn autonome Coding-Agenten große Repositories über Dutzende Iterationen hinweg modifizieren, laufen die Tests zwar durch, aber der Code driftet schleichend von der ursprünglichen Architekturspezifikation ab. Nach dem 15. Prompt morphen Typen, Randfall-Verträge fallen weg und sekundäre Abstraktionen wuchern.

Die Idee: Ein Git-Hook und eine CI-Action, die OpenAPI- und TypeScript-Schnittstellendefinitionen in semantische AST-Invarianten parst. Bei jedem Agent-Commit wird nicht der Code-Diff geprüft, sondern die Abweichung vom Spezifikationsvertrag. Wenn ein Agent einen internen Helper in eine unautorisierte externe Abhängigkeit refaktoriert, wird der Commit mit einem Auto-Correct-Prompt blockiert.

Ein Einseiter mit Architekturskizze, Ticket #1 und der Sollbruchstelle: [Link zur Dose: Spec-Drift Detector]

Vollständig unter CC0, ohne jede Bedingung, kein Nachfassen. Falls das bereits auf Ihrer Roadmap steht, archivieren Sie diese Notiz einfach.

Viele Grüße
Félix (Berlin)`,
    bodyEn: `Subject: Free concept gift: Spec-Drift Detector for autonomous coding agents

Hi Guy, hello Tessl team,

I research emerging software mechanics and gift the architecture briefs to the people uniquely positioned to build them. This one belongs with Tessl.

When autonomous coding agents modify large repositories over dozens of iterations, tests pass, but the code silently drifts away from the initial architectural specification. By the 15th prompt, types have morphed, edge-case contracts are dropped, and secondary abstractions have proliferated.

The idea: A git hook and CI action that parses OpenAPI / TypeScript interface definitions into semantic AST invariants. On every agent commit, it diffs not code lines, but contract divergence. If an agent refactors an internal helper into an unspec'd external dependency, the commit is blocked with an auto-correct prompt.

One page with the architecture sketch, Ticket #1, and the failure point: [Link to tin: Spec-Drift Detector]

Dedicated under CC0, no strings attached, zero follow-up. If this is already on your roadmap, just archive this note.

Best regards,
Félix, Berlin`,
    doseLinks: ['spec-drift-detector'],
    scheduleDe: 'Kurzes Zeitfenster (Q4 2026)',
    scheduleEn: 'Short window of viability (Q4 2026)'
  },
  {
    id: 'mail-7',
    mailIndex: 7,
    titleDe: 'Mail 7: Streiflicht (Smartphone RTI) → CompGen e.V.',
    titleEn: 'Mail 7: Smartphone RTI Relief → CompGen e.V.',
    recipientOrg: 'Verein für Computergenealogie e.V. (CompGen) · Projekt Grabsteine',
    recipientTypeDe: 'Fachverein & Bürgerforschung (Rang 4)',
    recipientTypeEn: 'Civic Research Association (Rank 4)',
    contactPathDe: 'Projektleitung Grabsteine-Datenbank compgen.de/projekte/grabsteine',
    contactPathEn: 'Tombstone documentation project leads, compgen.de/projekte/grabsteine',
    subjectDe: 'Idee zu verschenken: Streiflicht-Relief gegen KI-Halluzinationen auf verwitterten Grabsteinen',
    subjectEn: 'Free idea gift: Grazing light relief imaging to solve AI hallucinations on eroded gravestones',
    bodyDe: `Liebes CompGen-Team,

ich verfolge Ihre Pionierarbeit bei der automatisierten Grabstein-Transkription mit großem Respekt und habe Ihren Werkstattbericht vom Mai 2026 studiert. Eine Idee, die Ihre größte Hürde adressiert, möchte ich Ihnen schenken.

Sie schildern das zentrale Problem von Vision-Modellen: Bei verwittertem Sandstein halluzinieren LLMs plausible Namen und Jahreszahlen, statt Nicht-Lesbarkeit zu melden. Noch größere Modelle lösen das nicht, weil das optische Signal im frontalen Tageslicht schlicht fehlt.

Die Lösung kommt aus der Archäologie: Polynomial Texture Mapping / Reflectance Transformation Imaging (RTI), vereinfacht für jedes Smartphone. Der ehrenamtliche Fotograf hält die Handytaschenlampe flach (10° Streiflicht) an drei Seiten des Steins. Die Differenzbilder heben die mikroskopische Vertiefung der Meißelspuren als scharfe Schattenkante hervor. Deterministisch, ohne dass ein KI-Modell raten muss.

Eine Seite mit Skizze, Ticket #1 und der Sollbruchstelle (Verwacklung bei Freihand-Aufnahmen): [Link zur Dose: Streiflicht RTI]

Vollständig CC0, ohne Gegenleistung. Falls Sie das bereits erproben, ignorieren Sie diese Mail bitte einfach — ich fasse nicht nach.

Viele Grüße
Félix (Berlin)`,
    bodyEn: `Dear CompGen Team,

I follow your pioneering work in citizen-science gravestone documentation with deep admiration and carefully read your May 2026 technical report. I want to gift you an idea addressing your primary operational bottleneck.

Your report identifies the critical weakness of vision LLMs: on weathered sandstone inscriptions, models hallucinate plausible names and dates instead of flagging illegibility. Larger models cannot fix this because the physical contrast signal is absent under flat daylight.

The solution borrows from museum archaeology: Reflectance Transformation Imaging (RTI), radically simplified for standard smartphones. The volunteer holds their flashlight at a flat grazing angle (10° Streiflicht) at 3 points around the inscription. Image subtraction isolates the carved groove topography as stark shadow edges. Clean and deterministic, eliminating hallucinated characters.

One page with the sketch, Ticket #1, and the failure point (handheld camera shake): [Link to tin: Smartphone RTI]

Completely CC0, no strings attached. If you are already testing this, please just ignore this email — I will not follow up.

Warm regards,
Félix (Berlin)`,
    doseLinks: ['streiflicht'],
    scheduleDe: 'Bereit für Runde 2 (Oktober 2026)',
    scheduleEn: 'Ready for Round 2 dispatch (October 2026)'
  },
  {
    id: 'mail-9',
    mailIndex: 9,
    titleDe: 'Mail 9: Kristallwachstum 3D → FU Berlin Geowissenschaften',
    titleEn: 'Mail 9: 3D Crystal Growth → FU Berlin Geosciences (Mineralogy)',
    recipientOrg: 'Institut für Geologische Wissenschaften (FU Berlin) · Mineralogie-Petrologie',
    recipientTypeDe: 'Forschung & Hochschuldidaktik (Rang 2)',
    recipientTypeEn: 'Academic Research & University Didactics (Rank 2)',
    contactPathDe: 'Prof. Dr. Timm John (timm.john@fu-berlin.de)',
    contactPathEn: 'Prof. Dr. Timm John (timm.john@fu-berlin.de)',
    subjectDe: 'Idee zu verschenken: Interaktive 3D-Kristallisation & Gefüge-Didaktik im Browser',
    subjectEn: 'Free idea gift: Interactive 3D Crystallization & Microstructure Didactics in the Browser',
    bodyDe: `Guten Tag Prof. John,

ich recherchiere Software-Werkzeuge, die erst seit kurzer Zeit technisch im Browser möglich sind, und baue nur einen kleinen Teil davon selbst. Diese Idee gehört thematisch in die geowissenschaftliche Lehre (Mineralogie, Kristallographie und Gefügebildung) und nicht zu mir — deshalb schenke ich sie Ihnen und Ihrem Fachbereich.

In der universitären Didaktik werden Nichtgleichgewichts-Kristallisation, Dendritenwachstum und Grenzflächenenergie häufig noch über statische 2D-Diagramme oder Kunststoffgitter vermittelt, weil rigorose 3D-Simulationen historisch Supercomputer brauchten. Gleichzeitig bleiben existierende Web-Demos zur Diffusionsbegrenzten Aggregation (DLA) reine Bildschirmschoner: hübsche Partikelwolken ohne thermodynamischen Antrieb und ohne kristallographische Orientierungsfelder.

Kristallwachstum 3D schließt diese Lücke direkt im Browser über WebGPU:
1. Hybride Physik: Brownsche DLA-Partikelkeimung mit analytischer Driftkorrektur, gekoppelt mit dem Kobayashi-Phasenfeld-Modell (1993) für unterkühlte Schmelzen auf volumetrischen 3D-Gittern.
2. Didaktische Gefügelinsen: Echtzeit-Umschaltung zwischen 5 Analyse-Ebenen (Phasenordnungsparameter φ, EBSD-IPF Orientierungsfeld, thermische Unterkühlung ΔT mit latenter Wärme, Gibbs-Thomson-Krümmung und virtuelles Rasterelektronenmikroskop).
3. Quantitative Didaktik & 3D-Druck: Live-Messung der fraktalen Dimension (D_f) über 3D-Box-Counting, deterministische Rezept-Hashes (K3D-...) und direkter Export wasserdichter, stützfreier Manifold-Meshes (3MF/STL) für den 3D-Druck im Hörsaal.

Ein kompaktes Dokument mit Architektur, physikalischer Herleitung und den Bruchstellen:
https://github.com/felixinberlin/Amelie/blob/main/05-dosen/kristallwachstum-3d.md

Das funktionale Open-Source-Scaffolding mit WGSL-Shaderkernen, STL-Generator und interaktivem Voxel-Laufzeitkern steht frei bereit:
https://github.com/felixinberlin/Amelie/tree/main/07-demos/kristallwachstum-3d

Falls das für eine studentische Abschlussarbeit, ein Lehrprojekt in den Geomaterialien oder eine interaktive Vorlesungs-Visualisierung nützlich ist: Nehmen Sie den Code, verändern oder veröffentlichen Sie ihn nach Belieben.

Keine Bedingungen, CC0 / gemeinfrei, keinerlei Gegenleistung erwartet. Wenn Sie für solche interaktiven Visualisierungen im Fachbereich keine Verwendung haben oder bereits an Ähnlichem arbeiten, ignorieren Sie diese Nachricht bitte einfach — ich hake nicht nach.

Mit freundlichen Grüßen
Félix
Berlin · github.com/felixinberlin/Amelie`,
    bodyEn: `Dear Prof. John,

I research software opportunities that only recently became technically viable in the browser, and only build a fraction myself. This idea belongs in geoscientific education (mineralogy, crystallography, and microstructure formation) rather than with me — which is why I am gifting it to you.

In higher education, non-equilibrium crystallization, dendritic growth, and interfacial energy are often still taught using static 2D diagrams because rigorous 3D simulations previously required dedicated scientific workstations. Meanwhile, existing web demos of diffusion-limited aggregation (DLA) remain simple visualizers without thermodynamic driving forces or crystallographic orientation fields.

3D Crystal Growth bridges this gap directly in the browser via WebGPU:
1. Hybrid physics: Brownian DLA nucleation with analytic drift bias correction coupled to the Kobayashi (1993) phase-field solidification model on volumetric 3D grids.
2. Educational microstructure lenses: Real-time toggling across 5 scientific views (phase order parameter φ, EBSD-IPF orientation field, thermal undercooling ΔT with latent heat release, Gibbs-Thomson curvature, and virtual SEM backscatter).
3. Quantitative didactics & 3D printing: Real-time 3D box-counting calculation of the fractal dimension (D_f), deterministic recipe hashes (K3D-...), and direct export of watertight, support-free manifold meshes (3MF/STL).

A concise dossier with architecture, physics derivation, and points of failure:
https://github.com/felixinberlin/Amelie/blob/main/05-dosen/kristallwachstum-3d.md

The open-source scaffolding with WGSL compute shaders, STL generator, and interactive voxel runtime:
https://github.com/felixinberlin/Amelie/tree/main/07-demos/kristallwachstum-3d

No strings attached, CC0 public domain, zero compensation expected. If you have no use for this or are already working on something similar, please feel free to ignore this email — I will not follow up.

Warm regards,
Félix
Berlin · github.com/felixinberlin/Amelie`,
    doseLinks: ['kristallwachstum-3d'],
    scheduleDe: 'Versandfertig (September 2026)',
    scheduleEn: 'Ready for dispatch (September 2026)',
    sent: false
  },
  {
    id: 'mail-10',
    mailIndex: 10,
    titleDe: 'Mail 10: Tarot-Zustandsmaschine → Labyrinthos (Tina Gong)',
    titleEn: 'Mail 10: Tarot Spread Graph DSL → Labyrinthos (Tina Gong)',
    recipientOrg: 'Labyrinthos Academy / Little Palace LLC (Tina Gong)',
    recipientTypeDe: 'Didaktische Bildungs-Plattform & Deck-Herausgeberin (Rang 1)',
    recipientTypeEn: 'Educational tarot platform & independent publisher (Rank 1)',
    contactPathDe: 'faculty@labyrinthos.co (Tina Gong)',
    contactPathEn: 'faculty@labyrinthos.co (Tina Gong)',
    subjectDe: 'Idee zu verschenken: Eine herstellerunabhängige Graph-DSL für Tarot-Legesysteme',
    subjectEn: 'Free idea gift: A vendor-independent graph DSL for tarot spreads',
    bodyDe: `Guten Tag Tina Gong,

ich recherchiere Software-Werkzeuge, die erst seit Kurzem technisch möglich oder fällig sind, und baue nur einen Bruchteil davon selbst. Diese Idee gehört thematisch zu Labyrinthos und der breiteren Indie-Tarot-Community und nicht zu mir — deshalb schenke ich sie Ihnen.

Labyrinthos hat bewiesen, wie viel didaktische Klarheit in einer kuratierten Bibliothek von über dreißig Legesystemen steckt. Gleichzeitig leidet das gesamte digitale Ökosystem (von Indie-Künstlerinnen auf Kickstarter bis zu Entwicklern interaktiver Fiktion) an einem blinden Fleck: Legesysteme werden nach wie vor in unpräziser Prosa oder als starre, festverdrahtete Arrays implementiert. Was es bedeutet, dass Karte 2 Karte 1 „kreuzt", wie umgekehrte Karten benachbarte Übergänge blockieren oder wie ein System mit Nicht-Standard-Decks (22 Große Arkana) umgeht, ist nirgends maschinenlesbar formalisiert.

Die Idee: Eine offene, herstellerunabhängige Graph-Notation für Legesysteme (Tarot Spread DSL):
1. Deklarativer Deck-Vertrag: Definiert Mindestkartenzahlen und Arcana-Anforderungen, damit inkompatible Decks deterministisch abgefangen werden.
2. Geometrische & semantische Slots: Positionen mit relativen Koordinaten (x, y, Rotation in Grad, Z-Ebene) und funktionaler Rolle.
3. Typisierte Relationen: Gerichtete Kanten (crosses, grounds, crowns, leads_to, mirrors), aus denen Render-Engines das Layout autonom berechnen und LLM-Pipelines relationale Spannungen fundiert analysieren können.

Ein kompaktes Dokument mit Architektur, Schemadefinition und den Grenzen (warum Struktur formalisiert werden muss, Bedeutung aber freibleiben muss):
https://github.com/felixinberlin/Amelie/blob/main/05-dosen/tarot-zustandsmaschine.md

Das lauffähige JSON-Schema sowie Referenz-Dateien (Keltisches Kreuz, 3-Karten-Pfad) stehen frei bereit:
https://github.com/felixinberlin/Amelie/tree/main/07-demos/tarot-zustandsmaschine

Keine Bedingungen, CC0 / gemeinfrei, keinerlei Gegenleistung erwartet. Wenn Sie dafür keine Verwendung haben oder bereits an einem eigenen Standard arbeiten, ignorieren Sie diese Nachricht bitte einfach — ich melde mich nicht erneut.

Mit freundlichen Grüßen
Félix
Berlin · github.com/felixinberlin/Amelie`,
    bodyEn: `Dear Tina Gong,

I research software opportunities that only recently became technically viable or necessary, and only build a small fraction myself. This idea belongs with Labyrinthos and the wider indie tarot community rather than with me — which is why I am gifting it to you.

Labyrinthos has demonstrated how much educational clarity exists in a thoughtfully curated library of over 30 spreads. At the same time, the broader digital ecosystem (from deck artists crowdfunding on Kickstarter to narrative game designers) suffers from a systemic blind spot: spreads are still passed down in loose prose or hardcoded as rigid arrays. What it physically and semantically means for Card 2 to "cross" Card 1, how reversals block neighboring transitions, or how a spread handles non-standard card counts (22-card Majors-only decks) is nowhere machine-readable.

The idea: An open, vendor-independent graph DSL for tarot spreads:
1. Declarative Deck Contracts: Validates card counts and arcana constraints so incompatible decks fail gracefully before drawing.
2. Geometric & Semantic Slots: Positions defined with relative coordinates (x, y, rotation degrees, layer) and functional roles.
3. Typed Directed Relations: Edges (crosses, grounds, crowns, leads_to, mirrors) enabling renderers to layout boards autonomously and helping LLM agents evaluate relational dynamics rather than isolated cards.

A concise dossier with architecture, schema definitions, and guardrails:
https://github.com/felixinberlin/Amelie/blob/main/05-dosen/tarot-zustandsmaschine.md

The JSON schema and reference instances (Celtic Cross, 3-Card Linear):
https://github.com/felixinberlin/Amelie/tree/main/07-demos/tarot-zustandsmaschine

No strings attached, CC0 public domain, zero compensation expected. If you have no use for this or already have an internal format in flight, please feel free to ignore this email — I will not follow up.

Warm regards,
Félix
Berlin · github.com/felixinberlin/Amelie`,
    doseLinks: ['tarot-zustandsmaschine'],
    scheduleDe: 'Versandfertig (September 2026)',
    scheduleEn: 'Ready for dispatch (September 2026)',
    sent: false
  }
];
