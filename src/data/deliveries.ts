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
    id: 'mail-8',
    mailIndex: 8,
    titleDe: 'Mail 8: Crack Flora Watcher → #Krautschau / Senckenberg',
    titleEn: 'Mail 8: Crack Flora Watcher → #Krautschau / Senckenberg Society',
    recipientOrg: 'Senckenberg Gesellschaft für Naturforschung (#Krautschau-Aktion)',
    recipientTypeDe: 'Bürgerwissenschaft & Kampagne (Rang 2) · Fertiges Konzept',
    recipientTypeEn: 'Citizen Science & Public Campaign (Rank 2) · Turnkey concept',
    contactPathDe: 'Dr. Julia Krohmer (Senckenberg) · julia.krohmer@senckenberg.de',
    contactPathEn: 'Dr. Julia Krohmer (Senckenberg) · julia.krohmer@senckenberg.de',
    subjectDe: 'Ideen-Schenkung: Crack Flora Watcher – Ganzjährige App & Toughness-Index für #Krautschau',
    subjectEn: 'Free Idea Gift: Crack Flora Watcher – Year-Round Mobile Experience & Toughness Index for #Krautschau',
    bodyDe: `Liebe Frau Dr. Krohmer, liebe Frau Prof. Dr. Klein, liebes #Krautschau-Team,

ich verfolge Ihre jährliche #Krautschau-Aktionswoche im Mai mit riesiger Begeisterung. Die Idee, mit bunter Straßenkreide und offenen Augen das Bewusstsein für die heimlichen Helden unseres Asphalts zu schärfen, hat den Blick tausender Menschen auf ihre Stadt für immer verändert.

Um diese Welle nicht nach dem Mai abebben zu lassen, habe ich ein vollständiges Produkt- und Interaktionskonzept ausgearbeitet, das ich Ihnen bedingungslos schenken möchte: „Crack Flora Watcher" (Ritzengrün-Wächter).

Der Kern des Konzepts:
1. Der „Toughness Index" (1–10): Statt trockenem Bestimmungs-Latein bewertet die App den Überlebenswillen der Pflanze — berechnet aus Substrat-Härte (reiner Asphalt vs. Mauerritze), Trittbelastung und städtischem Hitzeinsel-Faktor. Das kürt den wahren „König der Ritzen".
2. Kanten-ausgerichtetes Zeitraffer-Tracking: Ein Kamera-Overlay gleicht die Konturen des Asphaltrisses ab, sodass Bürger dieselbe Pflanze über Wochen und Monate hinweg vom Keimling bis zur Samenreife fotografieren können.
3. Direkte Brücke zu Senckenberg & GBIF: Jede Beobachtung wird mit 25m-Geofuzzing (zum Schutz privater Hauseingänge) in standardisiertem GeoJSON erfasst und kann mit einem Klick für die stadtökologische Forschung exportiert werden.

Das Dossier enthält die vollständige Architektur, User Journeys für Schulen, Pendler und Familien, sowie ein erstes minimales Ticket („Ein Pflasterriss, zwei Fotos, ein Toughness-Score").

Hier ist der Link zur fertig geschnürten Dose und dem interaktiven Prototyp-Labor: [Link zur Dose: Crack Flora Watcher / Ritzengrün]

Dieses Konzept ist ein Geschenk (CC0, Public Domain). Sie schulden mir nichts — keine Nennung, keine Rückmeldung. Wenn es Ihnen für die Vorbereitung der Aktionswoche 2027 hilft oder Sie Teile davon in bestehende Schulmaterialien einbauen möchten: Nehmen Sie es, wandeln Sie es ab und machen Sie daraus, was Ihnen nützt.

Mit herzlichen Grüßen aus Berlin,
Félix`,
    bodyEn: `Dear Dr. Julia Krohmer, dear Prof. Dr. Alexandra-Maria Klein, dear #Krautschau team,

I follow your annual #Krautschau week in May with immense admiration. Chalk-marking sidewalk plants has transformed how thousands of city dwellers perceive urban wild nature.

To carry this momentum year-round, I have structured an end-to-end product and gamification dossier that I want to gift you unconditionally: "Crack Flora Watcher" (Ritzengrün-Wächter).

Core primitives:
1. The "Toughness Index" (1-10): Gamifying hardiness based on substrate adversity (solid bitumen vs. curb seams), foot compaction, and heat island stress.
2. Contour-aligned time-lapse: Smartphone camera overlay matching crack fissures so citizens record serialized growth stages over months.
3. Turnkey citizen science export: 25m geo-fuzzed observations outputting standardized GeoJSON directly ingestible into Senckenberg research databases.

This dossier is completely CC0 (Public Domain). You owe me nothing — no attribution, no reply. Take it, adapt it, and use whatever serves the movement: [Link to tin: Crack Flora Watcher]

Warm regards from Berlin,
Félix`,
    doseLinks: ['crack-flora-watcher'],
    scheduleDe: 'Sofort versendbar · Vorbereitung Aktionswoche 2027',
    scheduleEn: 'Immediate dispatch · Campaign planning cycle 2027'
  },
  {
    id: 'mail-9',
    mailIndex: 9,
    titleDe: 'Mail 9: Crack Flora Watcher → Flora Incognita (MPI Jena & TU Ilmenau)',
    titleEn: 'Mail 9: Crack Flora Watcher → Flora Incognita (MPI Jena & TU Ilmenau)',
    recipientOrg: 'Flora Incognita (MPI für Biogeochemie Jena & TU Ilmenau)',
    recipientTypeDe: 'Forschungsinstitution & KI-Plattform (Rang 2) · Daten- & Kampagnenmodell',
    recipientTypeEn: 'Research Institution & AI Platform (Rank 2) · Data & campaign model',
    contactPathDe: 'Dr. Jana Wäldchen · kontakt@floraincognita.de',
    contactPathEn: 'Dr. Jana Wäldchen · kontakt@floraincognita.de',
    subjectDe: 'Kooperations-Idee als Geschenk: Crack Flora Watcher / Kampagnen-Tag für Flora Incognita',
    subjectEn: 'Idea Gift & Collaboration Concept: Crack Flora Watcher / Campaign Tag for Flora Incognita',
    bodyDe: `Liebe Frau Dr. Wäldchen, lieber Herr Prof. Dr. Mäder, liebes Flora-Incognita-Team,

Flora Incognita ist zweifellos das wissenschaftliche Gold-Standard-Werkzeug für KI-gestützte Pflanzenbestimmung in Deutschland. Besonders beeindruckt hat mich, wie elegant Sie spezifische Forschungsfragen über Projekt-Tags skaliert haben — wie bei „GartenDiv" oder im PhänoNetz mit dem Deutschen Wetterdienst.

Ich möchte Ihnen ein fertig durchdachtes Kampagnen- und Datenmodell schenken: „Crack Flora Watcher" — ein urbanes Biodiversitäts-Modul für Extremstandorte (Pflasterfugen, Asphaltrisse, Mauerwerk).

Warum dieser Zuschnitt wissenschaftlich und gesellschaftlich relevant ist:
1. Indikator für urbane Hitzeinseln: Pflanzen in bituminösen Dehnungsfugen trotzen extremen Oberflächentemperaturen (>50 °C) und mechanischem Trittstress. Ihre Besiedlungsmuster sind ein hochaktueller Bio-Indikator für städtische Klimaresilienz.
2. Der „Toughness Index": Eine mathematische Formel, die botanische Taxa mit mikroklimatischen Standortparametern (Substratklasse, Verdichtung, Versiegelungsgrad) verknüpft und so Bürgerwissenschaftlern einen spielerischen Zugang eröffnet.
3. Nahtlose Integration in Flora Incognita: Statt einer redundanten App könnte das Konzept als offizieller Projekt-Tag (#Krautschau oder #CrackFlora) direkt in Flora Incognita implementiert werden — inklusive Kurzanleitung zum Kanten-synchronisierten Zeitraffer.

Ich habe das Konzept als vollständiges Dossier mit Daten-Schema, Risikofaktoren und dem ersten Umsetzungsschritt niedergelegt: [Link zur Dose: Crack Flora Watcher / Ritzengrün]

Das gesamte Material steht unter CC0 (Public Domain). Sie können die Architektur, das Scoring-Modell und die Ideen frei nutzen, in Förderanträge (z. B. BfN oder BMBF) einfließen lassen oder im nächsten Release verwerten.

Vielen Dank für Ihre herausragende Arbeit für die heimische Pflanzenvielfalt.

Beste Grüße aus Berlin,
Félix`,
    bodyEn: `Dear Dr. Jana Wäldchen, dear Prof. Dr. Patrick Mäder, dear Flora Incognita team,

Flora Incognita is the undisputed scientific gold standard for AI-based botanical recognition in Europe. I am particularly impressed by how successfully you scale focused ecological questions via custom campaign tags — such as "GartenDiv" or "PhänoNetz" with the German Weather Service.

I want to gift you an end-to-end campaign and data blueprint: "Crack Flora Watcher" — an urban biodiversity module targeting hostile pavement cracks, asphalt fissures, and masonry joints.

Why this focus is ecologically and socially vital:
1. Heat island bio-indicators: Pioneer flora surviving in pavement joints endure surface temperatures exceeding 50 °C and intense compaction. Their distribution is an invaluable proxy for city resilience under climate change.
2. The Toughness Index: A deterministic formula marrying botanical taxonomy with micro-habitat adversity (bitumen porosity, soil volume, foot traffic), engaging casual explorers.
3. Turnkey Flora Incognita integration: Instead of a redundant standalone app, this can function as an official project tag (#Krautschau or #CrackFlora) within Flora Incognita.

The entire dossier is CC0 (Public Domain). Feel free to adapt the schema, metrics, and workflows into your research grants or upcoming releases: [Link to tin: Crack Flora Watcher]

Warm regards from Berlin,
Félix`,
    doseLinks: ['crack-flora-watcher'],
    scheduleDe: 'Bereit zur Kontaktaufnahme · Zuarbeit für Projekt-Tag',
    scheduleEn: 'Ready for outreach · Research tag proposal'
  }
];
