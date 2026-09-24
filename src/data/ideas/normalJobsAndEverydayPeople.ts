import { CandidateIdea } from '../../types';

export const NORMAL_JOBS_AND_EVERYDAY_PEOPLE_IDEAS: CandidateIdea[] = [
  {
    id: 'ai-nurse-shift-guardian',
    title: 'DienstplanWächter: Roster Auditor, Bonus Calculator & Rest-Time Shield for Nurses',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Ein Foto des Dienstplans am Stations-Schwarzen-Brett genügt: Die KI liest handgeschriebene Schicht-Kürzel (F1, S3, N, Springer), warnt vor rechtswidrig unterschrittenen 11h-Ruhezeiten (§ 5 ArbZG) und berechnet die exakten steuerfreien Nacht-, Sonntags- und Feiertagszuschläge für die Gehaltsabrechnung.',
    conceptEn: 'Snap a single photo of the hospital ward notice-board duty roster: AI decodes handwritten shift codes (Early, Late, Night, on-call), flags illegal sub-11-hour rest periods, and calculates exact tax-free night and holiday wage supplements to audit monthly payroll.',
    status: 'verengt',
    userNotes: 'Als Dose „DienstplanWächter" gepackt. Abdeckungs-Nachprüfung 24.09.2026, 06-suche/amelie-pruefprotokoll.md: Foto → Dienstplan besetzt (Shift2Cal AI), Zuschlagsrechner dicht; Restlücke nur die Ruhezeitprüfung nach § 5 ArbZG auf Arbeitnehmerseite.',
    suggestedVerdict: 'gift',
    recipientDe: 'ver.di Fachbereich Gesundheit · DBfK (Deutscher Berufsverband für Pflegeberufe) · Junge Pflege e.V.',
    recipientEn: 'National Nurses United (USA) · Royal College of Nursing (UK) · European Federation of Nurses Associations',
    sourceType: 'Health & Care',
    sourceDe: 'Visual Roster Grid Disambiguation + Collective Bargaining (TVöD-K / AVR) Legal Rule Synthesizer',
    sourceEn: 'Handwritten Schedule Computer Vision + Labor Law & Overtime Supplement Engine',
    evidenceDe: 'Geprüft 24.09.2026: Foto → Dienstplan besetzt (Shift2Cal AI), Zuschlagsrechner dicht; Restlücke nur die Ruhezeitprüfung nach § 5 ArbZG auf Arbeitnehmerseite.',
    evidenceEn: 'Checked 24.09.2026: roster photo → calendar exists (Shift2Cal AI), premium-pay calculators are plentiful; only the employee-side rest-period check is missing.',
    reviewDate: '03/2027',
    problemDe: 'Dienstpläne hängen als laminierte Zettel oder Excel-Ausdrucke im Pausenraum. Änderungen werden mit Kuli eingekritzelt. Nach einer 12-Stunden-Schicht hat niemand die Kraft, 31 Tage x 4 Zeilen Tarifrecht manuell nachzurechnen.',
    problemEn: 'Schedules hang on breakroom notice boards with last-minute changes scribbled in pen. After a grueling 12-hour shift, no healthcare worker has the energy to calculate 31 days of complex collective bargaining bonuses by hand.',
    workerPersona: {
      name: 'Maria Schneider (34)',
      role: 'Examinierte Gesundheits- und Krankenpflegerin',
      location: 'Vivantes Klinikum Neukölln, Station 4B (Innere Medizin), Berlin',
      quoteDe: 'Wenn ich um 21:45 Uhr nach dem Spätdienst nach Hause hetze und um 05:45 Uhr wieder auf der Matte stehen muss, habe ich 6 Stunden geschlafen. Meine Gehaltsabrechnung verstehe ich seit drei Jahren nicht mehr.',
      quoteEn: 'When I rush home at 9:45 PM after a late shift and have to be back on the floor at 5:45 AM, I get barely 5 hours of sleep. And I haven’t understood my pay stub in three years.',
      storyDe: 'Maria arbeitet seit 12 Jahren in der Akutpflege. Wegen chronischen Personalmangels wird der Dienstplan monatlich bis zu 14-mal per Kugelschreiber umgeschrieben. Bei Ausfällen springt Maria ein. Am Monatsende stimmen die Zuschläge für Nacht- und Wochenendarbeit fast nie – doch nach 14 Schichten im Monat fehlt Maria schlicht die Kraft, die 15-seitige Entgeltabrechnung gegen die handschriftlichen Zettel zu prüfen. Ihr entgehen jeden Monat rund 240 € hart erarbeitete Zuschläge.',
      storyEn: 'Maria has worked acute care for 12 years. Because of chronic short-staffing, the ward schedule is revised by hand up to 14 times a month. When colleagues fall ill, Maria steps in. At month’s end, her night and weekend supplements are routinely missing, but after 14 shifts she lacks the stamina to audit payroll against paper scraps. She loses roughly €240 every single month in earned bonuses.'
    },
    realRecipientsList: [
      {
        org: 'ver.di Bundesverwaltung – Fachbereich Gesundheit, Soziale Dienste, Bildung und Wissenschaft',
        person: 'Sylvia Bühler (Mitglied des ver.di-Bundesvorstandes, Leiterin Fachbereich Gesundheit & Soziales)',
        email: 'gesundheit.soziales@verdi.de',
        location: 'Paula-Thiede-Ufer 10, 10179 Berlin',
        roleDe: 'Größte Interessenvertretung für Pflegebeschäftigte in Deutschland; verhandelt TVöD und kämpft gegen Ausbeutung im Schichtdienst.',
        roleEn: 'Primary union representation for 1.2M healthcare workers in Germany; negotiates collective agreements and enforces shift rest standards.',
        url: 'https://gesundheit-soziales-bildung.verdi.de'
      },
      {
        org: 'DBfK Bundesverband (Deutscher Berufsverband für Pflegeberufe e.V.)',
        person: 'Christel Bienstein (Präsidentin) / Bundesgeschäftsstelle',
        email: 'dbfk@dbfk.de',
        location: 'Alt-Moabit 91, 10559 Berlin',
        roleDe: 'Unabhängiger Berufsverband der professionell Pflegenden in Deutschland.',
        roleEn: 'Independent professional association of registered nurses in Germany.',
        url: 'https://www.dbfk.de'
      },
      {
        org: 'Junge Pflege im DBfK',
        person: 'Sprecherinnenkreis Junge Pflege',
        email: 'junge-pflege@dbfk.de',
        location: 'Berlin',
        roleDe: 'Netzwerk für Nachwuchskräfte, Berufseinsteiger und Auszubildende in der Pflege.',
        roleEn: 'Advocacy network for early-career nurses and nursing apprentices facing shift-burnout.',
        url: 'https://www.junge-pflege.de'
      },
      {
        org: 'National Nurses United (International)',
        person: 'Bonnie Castillo, RN (Executive Director)',
        email: 'nurses@nationalnursesunited.org',
        location: 'Silver Spring, MD / Oakland, CA, USA',
        roleDe: 'Größte Pflegegewerkschaft in den USA (über 225.000 Mitglieder).',
        roleEn: 'Largest union of registered nurses in the United States fighting for mandatory nurse-to-patient staffing ratios.',
        url: 'https://www.nationalnursesunited.org'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Starre Tabellen-OCR scheiterte an schrägen Smartphone-Fotos bei Schummerlicht, Knicken im Papier, handgemalten Pfeilen zwischen Schichtzeilen und kryptischen Stations-Kürzeln ("F-K" für Frühdienst-Küche, "S3" für Spätdienst-Neuro).',
      beforeAiEn: 'Impossible before AI: Traditional OCR failed on tilted phone photos under dim breakroom fluorescent lights, folded paper sheets, handwritten arrows across rows, and ward-specific shorthand ("F-K" for Early Kitchen, "S3" for Late Neuro).',
      nowEasyDe: 'Heute kinderleicht: Moderne multimodale Vision-Modelle erfassen das 2D-Gitter ganzheitlich wie ein menschliches Auge. Sie entziffern Pfeile, erkennen wer für wen eingesprungen ist, warnen in 1,5 Sekunden vor illegalen <11h-Wechseln nach § 5 ArbZG und errechnen centgenau die Zuschläge.',
      nowEasyEn: 'Effortless today: Multimodal vision models grasp the entire 2D schedule grid like a human eye. They trace handwritten arrows, detect who covered for whom, flag illegal <11h turnaround violations in 1.5 seconds, and compute exact cent-accurate bonus amounts.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für die Pflege: Freies Open-Source-Werkzeug „DienstplanWächter" (CC0 Public Domain)',
      subjectEn: 'Gift for nurses: Free Public Domain tool "DienstplanWächter" (CC0)',
      bodyDe: `Sehr geehrte Frau Bühler, sehr geehrte Kolleginnen und Kollegen bei ver.di Gesundheit und DBfK,

wir möchten Ihnen ein vollständig freies, gemeinnütziges Werkzeug schenken, das wir bedingungslos unter CC0 Public Domain stellen: den „DienstplanWächter".

Das Problem aus der Praxis:
Krankenpflegerinnen wie Maria (34) im Klinikum Neukölln fotografieren monatlich ihren handgeschriebenen Dienstplan. Wegen unzähliger kurzfristiger Änderungen verlieren Pflegende durchschnittlich 150–300 € monatlich an zustehenden steuerfreien Schichtzuschlägen. Zudem werden gesetzliche Mindestruhezeiten (11 Stunden nach § 5 ArbZG) bei Spät-auf-Früh-Wechseln regelmäßig unbemerkt unterschritten.

Die Lösung:
Ein Foto des Stations-Aushangs genügt. Die KI liest die handgeschriebenen Kürzel aus, prüft das Tarifrecht (TVöD-K / AVR) und erzeugt einen centgenauen Zuschlagsnachweis für den Betriebsrat oder die Personalabteilung.

Dieses Werkzeug gehört keinem Startup und keinem Investor. Es ist ein freies Geschenk an die Pflegenden. Sie können den Quellcode, die Prüflogik und die Benutzeroberfläche kostenfrei übernehmen, in Ihre ver.di-App oder DBfK-Portale einbinden und an alle Mitglieder verteilen.

Mit solidarischen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear colleagues in nursing advocacy,

We are gifting you a completely free, open public-good tool placed unconditionally in the public domain (CC0): "DienstplanWächter" (Roster Auditor & Shift Shield).

The tool allows nurses to take a single photo of their breakroom schedule board to automatically audit missing night/weekend overtime pay and flag illegal sub-11-hour turnaround shifts.

Zero paywalls, zero subscriptions. Free for all unions and healthcare workers worldwide.`
    },
    whyNowDe: [
      'Vor 2024 unmöglich: Starre Tabellen-OCR scheiterte an handgeschriebenen Korrekturen, Pfeilen zwischen Namenszeilen und ungenormten Stations-Kürzeln ("F-K" für Frühdienst-Küche).',
      'Heute möglich: Multimodale Vision-Modelle verstehen das räumliche Layout von Schichtplänen, ordnen handschriftliche Pfeile den richtigen Personen zu und übersetzen Stations-Kürzel in Arbeitsstunden.',
      'Würde: Gibt Pflegenden finanzielle Transparenz und ein juristisches Schutzschild gegen Überlastung.'
    ],
    whyNowEn: [
      'Impossible before AI: Traditional OCR failed completely on handwritten arrows, crossed-out shift codes, and idiosyncratic ward jargon ("E2-N" for Early 2 Neuro).',
      'Now possible: Multimodal spatial vision tracks arrow redirections, associates handwritten initials with staff names, and cross-references statutory labor laws.',
      'Worker Dignity: Returns hundreds of earned dollars to underpaid care workers and shields them from illegal, health-destroying shift compressions.'
    ],
    firstStepTicketDe: 'Foto-Upload eines Dienstplan-Ausschnitts (1 Woche, 5 Personen) → Automatisches Auslesen der Schichten + Berechnung der Nacht- und Wochenendstunden',
    firstStepTicketEn: 'Upload photo of sample 1-week ward schedule → Extracts shifts per person and calculates night/weekend hourly totals',
    firstStepCriteriaDe: 'Liest bei 10 realen Stations-Dienstplänen mindestens 95% der handgeschriebenen Schichtkürzel fehlerfrei aus.',
    firstStepCriteriaEn: 'Accurately reads at least 95% of handwritten shift symbols across 10 sample clinic roster photographs.',
    tags: ['Echte Arbeit', 'Pflege', 'Schichtdienst', 'Arbeitsrecht', 'Lohnschutz', 'Krankenhaus']
  },
  {
    id: 'ai-tradesman-liability-shield',
    title: 'BedenkenBlitz: Instant VOB/B Construction Liability Shield for Tradespeople',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Handwerker (Fliesenleger, Maler, Bodenleger) fotografieren auf der Baustelle Risse oder feuchten Estrich des Vorunternehmers und sprechen 15 Sekunden Sprachnachricht. Die KI zitiert die einschlägige DIN-Norm und erstellt sofort eine rechtswirksame VOB/B-Bedenkenanmeldung per WhatsApp/PDF, bevor der Handwerker haftbar wird.',
    conceptEn: 'Tradespeople (tile setters, drywallers, painters) snap photos of substrate defects (damp concrete screed, cracked plaster) and speak a 15-second voice note. AI correlates the correct DIN building standard and produces a legally binding notice of objection (Bedenkenanmeldung) before laying the first tile.',
    status: 'verengt',
    userNotes: 'Als Dose „BedenkenBlitz" gepackt. Abdeckungs-Nachprüfung 24.09.2026, 06-suche/amelie-pruefprotokoll.md: Muster (ZVSHK, PlanRadar, BauMaster) und KI-Bedenkenanmeldung aus dem LV (BauAnalyst, 03/2026) existieren; Restlücke: Sprachmemo + Foto auf der Baustelle.',
    suggestedVerdict: 'gift',
    recipientDe: 'Zentralverband des Deutschen Baugewerbes (ZDB) · Fachverband Fliesen und Naturstein · IG BAU',
    recipientEn: 'Associated General Contractors (AGC) · International Union of Bricklayers and Allied Craftworkers · Trades Guilds',
    sourceType: 'Craft & Workshop',
    sourceDe: 'Multimodal Construction Defect Classifier + German VOB/B § 4 Abs. 3 Legal Generator',
    sourceEn: 'Site Visual Defect Metrology + Statutory Construction Warranty Dispute Law',
    evidenceDe: 'Geprüft 24.09.2026: Muster (ZVSHK, PlanRadar, BauMaster) und KI-Bedenkenanmeldung aus dem LV (BauAnalyst, 03/2026) existieren; Restlücke: Sprachmemo + Foto auf der Baustelle.',
    evidenceEn: 'Checked 24.09.2026: templates everywhere, BauAnalyst drafts notices from the bill of quantities; only voice + photo on site for one-person businesses is missing.',
    reviewDate: '03/2027',
    problemDe: 'Wer auf der Baustelle mit Arbeitshandschuhen steht, schreibt keinen dreiseitigen juristischen Brief an den Architekten. Man fängt einfach an zu arbeiten — und wird später für 15.000 € Sanierungskosten verklagt.',
    problemEn: 'A worker on a dusty jobsite wearing heavy gloves cannot write a formal legal brief citing building codes. They work anyway—and get sued for $20,000 when the floor cracks a year later.',
    workerPersona: {
      name: 'Mehmet Kurt (48)',
      role: 'Selbstständiger Fliesenleger-Meister (Einzelkämpfer)',
      location: 'Duisburg-Marxloh & Ruhrgebiet',
      quoteDe: 'Ich bin Handwerker, kein Rechtsanwalt. Wenn der Estrichleger geschlampt hat und ich am Montagmorgen nicht anfange, droht mir die Bauleitung mit Vertragsstrafe. Schreibe ich keinen Brief, zahle ich in zwei Jahren den Schaden aus eigener Tasche.',
      quoteEn: 'I am a craftsman, not a lawyer. If the screed contractor did a shoddy job and I refuse to start on Monday, the general contractor threatens me with penalty fees. If I don’t write a legal letter, I’m liable for €18,000 in two years.',
      storyDe: 'Mehmet verlegt seit 25 Jahren Fliesen. Vor zwei Jahren verlegte er 120 qm Feinsteinzeug auf einer Großbaustelle in Düsseldorf. Der Estrich hatte noch 3,2% Restfeuchte. Mehmet sagte dem Polier mündlich Bescheid – doch der winkte ab: „Mach einfach, wir haben Termindruck!" Ein Jahr später lösten sich die Fliesen. Vor Gericht zählte das mündliche Wort nichts: Mehmet wurde zu 18.500 € Schadensersatz verurteilt, weil er keine schriftliche Bedenkenanmeldung nach § 4 Abs. 3 VOB/B vorgelegt hatte. Es kostete ihn fast die Existenz seines Betriebs.',
      storyEn: 'Mehmet has laid tiles for 25 years. Two years ago, he installed 120 sq meters of porcelain tiles. The screed was still at 3.2% moisture. Mehmet verbally warned the site foreman, who brushed it off: "Just lay it, we have deadlines!" A year later, tiles buckled. In court, verbal warnings meant nothing: Mehmet was ordered to pay €18,500 in damages because he lacked a formal written VOB/B notice. It nearly bankrupted his family.'
    },
    realRecipientsList: [
      {
        org: 'Zentralverband des Deutschen Baugewerbes (ZDB)',
        person: 'Felix Pakleppa (Hauptgeschäftsführer)',
        email: 'zdb@zdb.de',
        location: 'Kronenstraße 55-58, 10117 Berlin',
        roleDe: 'Spitzenverband des mittelständischen Baugewerbes in Deutschland (über 35.000 Mitgliedsbetriebe).',
        roleEn: 'Apex trade federation representing over 35,000 mid-sized construction enterprises in Germany.',
        url: 'https://www.zdb.de'
      },
      {
        org: 'Fachverband Fliesen und Naturstein im ZDB (FFN)',
        person: 'Jürgen Kullmann (Vorsitzender) / Geschäftsstelle',
        email: 'ffn@zdb.de',
        location: 'Kronenstraße 55-58, 10117 Berlin',
        roleDe: 'Bundesweiter Fachverband für das Fliesenlegerhandwerk; definiert Prüfpflichten vor Verlegung.',
        roleEn: 'National craft federation for tile and natural stone setters; establishes pre-installation site inspection rules.',
        url: 'https://www.fachverband-fliesen.de'
      },
      {
        org: 'Industriegewerkschaft Bauen-Agrar-Umwelt (IG BAU) – Bundesvorstand Handwerk',
        person: 'Carsten Burckhardt (Bundesvorstandsmitglied für Baugewerbe & Handwerk)',
        email: 'handwerk@igbau.de',
        location: 'Olof-Palme-Straße 19, 60439 Frankfurt am Main',
        roleDe: 'Gewerkschaftliche Vertretung der Bau- und Ausbauhandwerker.',
        roleEn: 'Labor union defending site workers and building trade crafts.',
        url: 'https://www.igbau.de'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Sprachnotizen mit Akzent, Hintergrundlärm von Schlagbohrern und Handwerker-Slang ("Estrich schüsselt, Randstreifen fehlt, Riss ungedübelt") konnten von keiner Software in juristisch hieb- und stichfeste Schriftsätze mit präziser Zitierung von DIN 18560 und VOB/B § 4 übersetzt werden.',
      beforeAiEn: 'Impossible before AI: Voice memos with thick accents, jackhammer background noise, and site slang ("screed is dishing, edge strip missing, crack not doweled") could not be translated into airtight legal briefs citing DIN 18560 building standards.',
      nowEasyDe: 'Heute kinderleicht: Rauschunterdrückte Audio-Modelle (Whisper) verstehen Handwerker-Deutsch fehlerfrei. Eine spezialisierte juristische Logik erzeugt in 12 Sekunden ein unterzeichnungsfertiges PDF inklusive Foto-Beweis, GPS-Stempel und VOB-Fristsetzung für WhatsApp oder E-Mail.',
      nowEasyEn: 'Effortless today: Noise-suppressed audio models parse jobsite speech instantly. A specialized legal template generates a ready-to-sign PDF with photo proof, GPS timestamp, and statutory deadline in 12 seconds.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für das Bauhandwerk: Freie VOB/B-Bedenkenanmeldung per Smartphone („BedenkenBlitz")',
      subjectEn: 'Gift for building trades: Free instant VOB/B Subcontractor Shield ("BedenkenBlitz")',
      bodyDe: `Sehr geehrter Herr Pakleppa, sehr geehrte Damen und Herren im Zentralverband des Deutschen Baugewerbes,

wir übergeben Ihnen heute ein kostenloses, gemeinnütziges Werkzeug für alle Handwerksbetriebe unter CC0 Public Domain: den „BedenkenBlitz".

Die Realität auf der Baustelle:
Kleine Handwerker wie Fliesenleger Mehmet (48) stehen täglich vor mangelhaften Vorleistungen (feuchter Estrich, Risse, unebene Wände). Weil sie auf der staubigen Baustelle keinen Laptop dabeihaben, unterbleibt die nach VOB/B § 4 Abs. 3 zwingend vorgeschriebene schriftliche Bedenkenanmeldung. Bei späteren Bauschäden haften die Handwerker mit zehntausenden Euro.

Die Lösung:
Handwerker sprechen 15 Sekunden Sprachmemo in ihr Smartphone und fotografieren den Mangel. Die Software zitiert automatisch die passende DIN-Norm (z.B. DIN 18560 für Estrichfeuchte) und erzeugt ein rechtswirksames PDF mit Zeit- und GPS-Stempel, das sofort per WhatsApp an Bauleitung und Auftraggeber gesendet werden kann.

Keine Kosten, keine Lizenzen, kein Abo. Der ZDB und alle Landesinnungsverbände können dieses Werkzeug frei auf ihren Websites einbetten oder in Innungs-Apps integrieren.

Mit handwerklichen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leadership of the construction craft federation,

We present to you a completely free public domain tool (CC0): "BedenkenBlitz". It empowers solo tilers, painters, and drywallers to generate legally binding substrate defect warning letters in 15 seconds from a spoken voice note on dusty jobsites, saving them from catastrophic warranty lawsuits.`
    },
    whyNowDe: [
      'Vor 2024 unmöglich: Sprachmodelle konnten gesprochenen Baustellen-Jargon ("Estrich schüsselt, Randdämmstreifen fehlt") nicht in juristisch unanfechtbare Schriftsätze mit DIN-Norm-Bezug übertragen.',
      'Heute möglich: Speech-to-Text plus juristische RAG-Modelle formulieren in 20 Sekunden ein rechtssicheres Musterschreiben mit Zeitstempel, GPS-Koordinaten und Bildnachweis.',
      'Handwerksschutz: Schützt kleine Familienbetriebe vor existenzbedrohenden Regressansprüchen von Großkonzernen.'
    ],
    whyNowEn: [
      'Impossible before AI: Natural voice recordings on noisy jobsites with acoustic echo could not be synthesized into rigorous contractual legal notices referencing exact DIN engineering thresholds.',
      'Now possible: Robust noise-cancelling speech models and legal logic synthesize field observations into bulletproof notice letters in seconds.',
      'Subcontractor Protection: Levels the playing field between solo artisans and corporate general contractors.'
    ],
    firstStepTicketDe: 'Sprachaufnahme (z.B. "Estrich Restfeuchte 3,4 Prozent") + Foto Feuchtemessgerät → Erzeugt 1-seitiges PDF nach VOB/B § 4 Abs. 3 mit DIN 18560 Bezug',
    firstStepTicketEn: '15-sec voice memo + photo of moisture meter → Generates formal 1-page subcontractor defect notice citing DIN 18560',
    firstStepCriteriaDe: 'Enthält alle juristisch zwingenden Pflichtbestandteile (Datum, Baustellenanschrift, konkrete Gefährdung, Fristsetzung zur Nachbesserung).',
    firstStepCriteriaEn: 'Validates presence of all statutory legal requirements (site address, explicit failure risk, formal reservation of rights).',
    tags: ['Echte Arbeit', 'Handwerk', 'Baustelle', 'Rechtsschutz', 'Fliesenleger', 'VOB']
  },
  {
    id: 'ai-cleaner-chemical-safety-voice',
    title: 'ChemGefahr-Stopp: Multilingual Chemical Safety & Poison Shield for Commercial Cleaners',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Kamera auf zwei Reinigungsmittelflaschen richten: Die KI erkennt die Inhaltsstoffe und schlägt sofort in 20 Sprachen Alarm ("ACHTUNG! Niemals mischen! Tödliches Chlorgas entsteht!"), plus zeigt grafisch die genaue Verdünnung für Wasserkocher oder Sanitärbereich.',
    conceptEn: 'Point camera at two commercial cleaning agent bottles: AI identifies active chemical compounds and sounds an immediate spoken alarm in 20 native languages ("DANGER! Do not mix! Creates lethal chlorine gas!"), showing exact dilution ratios visually.',
    status: 'verengt',
    userNotes: 'Als Dose „ChemGefahr-Stopp" gepackt. Abdeckungs-Nachprüfung 24.09.2026, 06-suche/amelie-pruefprotokoll.md: Beim Empfänger liegen WINGIS (auch mobil) und GISCODE; Kamera-Warnung vor dem Mischen nicht gefunden. Kipprisiko: ein falsches „alles gut" ist schlimmer als keine App.',
    suggestedVerdict: 'gift',
    recipientDe: 'IG BAU Gebäudereinigung · Berufsgenossenschaft der Bauwirtschaft (BG BAU) · Cleaners Rights Coalitions',
    recipientEn: 'Service Employees International Union (SEIU) · European Cleaning and Facility Services Industry (EFCI)',
    sourceType: 'Utilities & Trades',
    sourceDe: 'GHS Chemical Hazard OCR + Real-Time Polyglot Audio Warnings for Incompatible Surfactants',
    sourceEn: 'GHS Chemical Incompatibility Vision + Real-Time Multilingual Voice Synthesis',
    evidenceDe: 'Geprüft 24.09.2026: Beim Empfänger liegen WINGIS (auch mobil) und GISCODE; Kamera-Warnung vor dem Mischen nicht gefunden. Kipprisiko: ein falsches „alles gut" ist schlimmer als keine App.',
    evidenceEn: 'Checked 24.09.2026: BG BAU already runs WINGIS and GISCODE; a camera warning before mixing was not found. Risk: a false all-clear is worse than no app.',
    reviewDate: '03/2027',
    problemDe: 'Sicherheitsdatenblätter (SDB) sind 15-seitige Beamtentexte im Büroordner. Reinigungskräfte putzen nachts unter Zeitdruck und können die kleingedruckten Gefahrenhinweise nicht entziffern.',
    problemEn: 'Safety data sheets are 18-page technical documents locked in office binders. Cleaners work alone at night under crushing time pressure without intelligible chemical guidance.',
    workerPersona: {
      name: 'Fatima Al-Mansoor (42)',
      role: 'Gebäudereinigerin (Nachtschicht)',
      location: 'Bürotürme Mainzer Landstraße & Flughafen, Frankfurt am Main',
      quoteDe: 'Ich putze jede Nacht von 22:00 bis 05:00 Uhr 40 Toiletten und Teeküchen. Die Flaschen im Putzwagen sehen alle blau oder grün aus. Auf Deutsch verstehe ich Wörter wie „Amidosulfonsäure" nicht. Einmal hat es furchtbar gestochen in der Lunge – ich dachte, ich ersticke.',
      quoteEn: 'I clean 40 restrooms and kitchenettes every night from 10 PM to 5 AM. The chemical bottles on the cart all look blue or green. In German, I don’t know what "Amidosulfonsäure" means. Once my chest burned terribly—I thought I was suffocating.',
      storyDe: 'Fatima kam vor vier Jahren aus Syrien nach Hessen. Sie arbeitet für eine Reinigungsfirma im Akkord: Für eine komplette WC-Anlage hat sie exakt 4 Minuten Zeit. Um hartnäckigen Urinstein und Schimmel in einer Fuge wegzubekommen, goss sie Sanitär-Grundreiniger und Chlor-Desinfektionsmittel zusammen in ein Becken. Die chemische Reaktion setzte schlagartig hochgiftiges Chlorgas frei. Fatima erlitt ein akutes Inhalationstrauma und lag drei Tage auf der Intensivstation. Niemand hatte ihr die Gefahren in ihrer Muttersprache erklärt.',
      storyEn: 'Fatima arrived in Germany 4 years ago. She cleans on a brutal piece-rate timer: exactly 4 minutes per restroom. Desperate to scrub stubborn limescale and grout mold, she poured acid descaler and chlorine bleach together. The violent chemical reaction produced lethal chlorine gas. Fatima suffered toxic inhalation trauma and spent three days in the ICU. No one had ever explained the chemical safety sheets in Arabic.'
    },
    realRecipientsList: [
      {
        org: 'Industriegewerkschaft Bauen-Agrar-Umwelt (IG BAU) – Bundesfachgruppe Gebäudereinigung',
        person: 'Ulrike Laux (Bundesvorstandsmitglied für Gebäudereinigung)',
        email: 'gebaeudereinigung@igbau.de',
        location: 'Olof-Palme-Straße 19, 60439 Frankfurt am Main',
        roleDe: 'Gewerkschaftliche Vertretung von 700.000 Beschäftigten in der Gebäudereinigung; engagiert für Arbeitsschutz und faire Löhne.',
        roleEn: 'Labor union representing 700,000 commercial cleaning workers in Germany.',
        url: 'https://www.igbau.de/Gebaeudereinigung.html'
      },
      {
        org: 'Berufsgenossenschaft der Bauwirtschaft (BG BAU) – Prävention Gefahrstoffe',
        person: 'Dr. Marco Einhaus / Referat Gefahrstoffe',
        email: 'praevention@bgbau.de',
        location: 'Hildegardstraße 29-30, 10715 Berlin',
        roleDe: 'Gesetzliche Unfallversicherung für Reinigungskräfte; zuständig für Prävention von Arbeitsunfällen und Giftgasverätzungen.',
        roleEn: 'Statutory occupational health & safety insurance authority responsible for toxic chemical accident prevention.',
        url: 'https://www.bgbau.de'
      },
      {
        org: 'Service Employees International Union (SEIU) – Cleaners & Janitors United (USA)',
        person: 'Mary Kay Henry / Property Services Division',
        email: 'member.services@seiu.org',
        location: '1800 Massachusetts Ave NW, Washington, DC, USA',
        roleDe: 'Führende US-Gewerkschaft für Hausmeister- und Reinigungskräfte.',
        roleEn: 'Leading union representing over 225,000 janitors and commercial cleaners across North America.',
        url: 'https://www.seiu.org'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Optische Zeichenerkennung scheiterte an nassen, zylindrisch gewölbten Plastikflaschen mit abgeriebenen Etiketten in dunklen Putzkammern. Es gab keine Offline-Sprachsynthese, die sofort in Arabisch, Ukrainisch oder Paschtu warnte.',
      beforeAiEn: 'Impossible before AI: OCR broke completely on wet, warped cylindrical plastic bottles with scratched labels in dim janitorial closets. Zero offline mobile engines existed to translate complex GHS chemical hazard matrices into 20 spoken languages.',
      nowEasyDe: 'Heute kinderleicht: Kompakte Vision-Modelle erkennen chemische Markennamen und Warnpiktogramme auf runden Oberflächen in Millisekunden. Erkennt die Logik Säure + Hypochlorit, ertönt sofort ohne Internetverbindung eine klare Sprachwarnung in der Muttersprache der Reinigungskraft.',
      nowEasyEn: 'Effortless today: Compact on-device vision models identify chemical brand names and hazard pictograms on curved surfaces in milliseconds. If acid + hypochlorite are seen together, an offline spoken alarm triggers immediately in the cleaner’s native tongue.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für die Gebäudereinigung: Lebensrettender mehrsprachiger Chemiescanner („ChemGefahr-Stopp")',
      subjectEn: 'Life-saving gift for cleaning staff: Multilingual Chemical Safety Scanner ("ChemGefahr-Stopp")',
      bodyDe: `Sehr geehrte Frau Laux, sehr geehrte Damen und Herren bei der IG BAU Gebäudereinigung und der BG BAU,

wir schenken Ihnen heute eine lebensrettende Schutzsoftware für alle Reinigungskräfte unter CC0 Public Domain: „ChemGefahr-Stopp".

Der lebensbedrohliche Hintergrund:
Über 700.000 Menschen arbeiten in der Gebäudereinigung – viele mit geringen Deutschkenntnissen. Wenn nachts unter extremem Zeitdruck ein Sanitärreiniger (Säure) und ein Chlorbleichmittel versehentlich gemischt werden, entsteht in Sekunden hochgiftiges Chlorgas. Jährlich erleiden hunderte Reinigungskräfte schwere Verätzungen der Atemwege.

Die Lösung:
Das Smartphone wird vor die zwei Flaschen gehalten. Die KI erkennt die Inhaltsstoffe und warnt mit einem grellroten Blitz und lauter Sprachausgabe in über 20 Sprachen (u.a. Arabisch, Ukrainisch, Türkisch, Rumänisch, Polnisch, Dari): „STOPP! Niemals mischen! Lebensgefahr durch Chlorgas!". Die Anwendung funktioniert komplett offline ohne Internet im fensterlosen Keller.

Sie können diese Software kostenfrei und bedingungslos in alle Schulungsprogramme, IG-BAU-Apps und BG-BAU-Präventionskampagnen integrieren.

Mit besten Grüßen für den Arbeitsschutz,
Amélie Projekt`,
      bodyEn: `Dear leaders of the cleaning workers union and safety authorities,

We are placing a life-saving chemical safety audio tool unconditionally into the public domain (CC0): "ChemGefahr-Stopp". By holding a phone camera to two cleaning bottles, cleaners who speak limited host language receive an instant, offline spoken alarm in 20 languages if lethal chlorine gas compounds are detected together.`
    },
    whyNowDe: [
      'Vor 2024 unmöglich: Bilderkennung konnte zerkratzte, gebogene Flaschenetiketten mit winzigen Gefahrenpiktogrammen nicht zuverlässig verknüpfen.',
      'Heute möglich: Vision-Modelle erkennen chemische Markennamen, Inhaltsstoffkombinationen und Warnsymbole in Millisekunden und sprechen Warnungen laut in Ukrainisch, Türkisch, Arabisch, Polnisch, etc. aus.',
      'Lebensschutz: Verhindert akute Intoxikationen und chronische Atemwegserkrankungen bei den am stärksten belasteten Dienstleistern.'
    ],
    whyNowEn: [
      'Impossible before AI: Classical OCR warped around cylindrical plastic bottles and failed to parse hazardous chemical interactions under dim janitorial closet lighting.',
      'Now possible: Multimodal models classify compound incompatibilities instantly from curved labels and speak loud audio warnings in the cleaner\'s native tongue.',
      'Life Safety: Directly prevents emergency room visits and chronic lung damage for essential cleaning personnel.'
    ],
    firstStepTicketDe: 'Foto zweier Flaschenetiketten → Sofortige Verträglichkeitsprüfung (Grün = Unbedenklich / Rot = Giftgasgefahr) mit Sprachausgabe',
    firstStepTicketEn: 'Snapshot of 2 cleaning bottles → Immediate incompatibility check (Green = Safe / Red = Lethal gas danger) with audio alert',
    firstStepCriteriaDe: 'Erkennt die Kombination aus Essig-/Phosphorsäure und Natriumhypochlorit in 100% der Testfälle als letale Gefahr.',
    firstStepCriteriaEn: 'Flags the mixture of acid descalers and sodium hypochlorite in 100% of benchmark test cases.',
    tags: ['Echte Arbeit', 'Reinigung', 'Arbeitsschutz', 'Sicherheit', 'Mehrsprachig', 'Chemie']
  },
  {
    id: 'ai-delivery-driver-ticket-dispute',
    title: 'LadezonenNotar: Loading Zone Legal Defense & Parking Ticket Rebuttal for Couriers',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Paket- und Lieferfahrer fotografieren das Park-Knöllchen und den Lieferschein der 30kg-Waschmaschine im 4. Stock. Die KI zitiert § 12 StVO zum gesetzlich geschützten Be- und Entladevorgang und generiert einen behördengerechten Widerspruch in 30 Sekunden.',
    conceptEn: 'Parcel and delivery drivers snap a photo of an unjust parking ticket alongside their delivery manifest. AI cites statutory commercial loading exemptions (§ 12 StVO / municipal traffic codes) and generates an official administrative appeal in 30 seconds.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'Kurier-Express-Post-Gewerkschaften · DPVKOM · Fahrer-Initiativen Deutschland',
    recipientEn: 'International Brotherhood of Teamsters · Couriers United · Independent Delivery Guilds',
    sourceType: 'Utilities & Trades',
    sourceDe: 'Municipal Traffic Code Violation Parser + Commercial Loading Legal Precedent Synthesizer',
    sourceEn: 'Traffic Violation Ticket OCR + Commercial Delivery Statutory Defense Engine',
    evidenceDe: 'Paketzusteller erhalten wöchentlich unberechtigte Verwarnungsgelder von 55–70 €, weil Ordnungsämter das legitime Be- und Entladen gewerblicher Güter pauschal als Parkverstoß ahnden. Für Fahrer bedeutet das oft 10–15% ihres Monatslohns.',
    evidenceEn: 'Delivery drivers receive hundreds of dollars in automated fines each month for stopping in commercial loading berths while carrying heavy parcels upstairs. For low-income subcontractors, this represents 10-15% of their take-home pay.',
    reviewDate: '10/2026',
    problemDe: 'Wer 180 Pakete am Tag ausliefert, hat keine Zeit, nach 10 Stunden Fahrt juristische Schriftsätze gegen das Ordnungsamt aufzusetzen. Die Bußgelder werden resigniert vom schmalen Gehalt bezahlt.',
    problemEn: 'A driver running 180 drop-offs a day has zero spare hours after an exhausting route to craft formal administrative dispute briefs. They resign themselves to paying unfair penalties from meager wages.',
    workerPersona: {
      name: 'Jens Mertes (29)',
      role: 'Paketzusteller (Subunternehmer für Paketdienstleister)',
      location: 'Leipzig (Stadtteile Südvorstadt & Connewitz)',
      quoteDe: 'Ich habe 190 Pakete im Sprinter, darunter Hundefutter und Hantelsets. Es gibt in den Gründerzeitstraßen keine freien Parkplätze. Ich halte 3 Minuten in zweiter Reihe, schleppe zwei 25kg-Kartons in den 4. Stock, und unten klebt ein 70-Euro-Knöllchen an der Scheibe. Das ist mein halber Tageslohn!',
      quoteEn: 'I have 190 packages in my van, including dog food and weight sets. There are zero parking spots on Victorian streets. I stop in the delivery lane for 3 minutes, haul two 50lb boxes up four flights of stairs, and come down to find a $75 ticket. That is half my day’s earnings gone.',
      storyDe: 'Jens beginnt morgens um 06:15 Uhr im Depot mit dem Beladen. Sein Nettoverdienst liegt bei rund 1.750 €. Im August sammelte er vier Knöllchen über jeweils 55 bis 70 € wegen angeblichem „Parken auf Gehweg/Ladezone". Laut ständiger Rechtsprechung des BGH und der Oberlandesgerichte ist das Halten zum Ausliefern schwerer Waren bis zu drei Minuten ausdrücklich zulässiger Ladungsverkehr nach § 12 Abs. 1 StVO. Doch Jens hat abends um 19:30 Uhr weder Kraft noch juristisches Wissen, um Behördenschreiben aufzusetzen. Er zahlte 240 € zähneknirschend selbst.',
      storyEn: 'Jens starts loading his van at 6:15 AM. His take-home pay is around €1,750. In August, he accumulated four parking citations of €55 to €70 each for alleged illegal stopping. Under German Supreme Court case law, stopping to deliver heavy commercial freight is legally protected loading traffic under § 12 StVO. But arriving home exhausted at 7:30 PM, Jens lacks the legal training to draft court rebuttals. He paid €240 out of pocket.'
    },
    realRecipientsList: [
      {
        org: 'DPVKOM (Gewerkschaft der Kommunikations- und Postbeschäftigten)',
        person: 'Christina Dahlhaus (Bundesvorsitzende)',
        email: 'bundesgeschaeftsstelle@dpvkom.de',
        location: 'Gereonstraße 43-65, 50670 Köln',
        roleDe: 'Spezialisierte Fachgewerkschaft für Paketzusteller, Postboten und KEP-Fahrer.',
        roleEn: 'Specialized trade union representing parcel delivery couriers and postal workers in Germany.',
        url: 'https://www.dpvkom.de'
      },
      {
        org: 'ver.di Bundesfachgruppe Postdienste, Speditionen und Logistik',
        person: 'Andrea Kocsis (Stellvertretende ver.di-Vorsitzende)',
        email: 'post-spedition-logistik@verdi.de',
        location: 'Paula-Thiede-Ufer 10, 10179 Berlin',
        roleDe: 'Vertritt hunderttausende Fahrerinnen und Fahrer in der Logistikbranche.',
        roleEn: 'Represents hundreds of thousands of transport, parcel, and delivery drivers.',
        url: 'https://psl.verdi.de'
      },
      {
        org: 'International Brotherhood of Teamsters – Package Division (USA)',
        person: 'Sean M. O’Brien (General President)',
        email: 'teamster@teamster.org',
        location: '25 Louisiana Ave NW, Washington, DC, USA',
        roleDe: 'Größte Logistikgewerkschaft Nordamerikas (vertritt u.a. 340.000 UPS-Fahrer).',
        roleEn: 'Largest logistics union in North America representing over 340,000 package delivery workers.',
        url: 'https://teamster.org'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Online-Widerspruchsformulare verlangten endlose manuelle Tipparbeit (Aktenzeichen, Tatbestandsnummer, Begründung mit OLG-Urteilen). Kein Paketbote tippt nach 10 Stunden körperlicher Arbeit Aktenzeichen am Smartphone ein.',
      beforeAiEn: 'Impossible before AI: Bureaucratic appeals required manual entry of 20 fields (citation number, municipal ordinance statute, citing regional high court precedents). No exhausted courier types legal case numbers on a cracked phone at 8 PM.',
      nowEasyDe: 'Heute kinderleicht: Fahrer fotografiert den rosa Strafzettel und den Handscanner-Lieferschein mit Paketgewicht. Die KI verknüpft Uhrzeit und Gewicht, zitiert § 12 Abs. 1 StVO und formuliert in 20 Sekunden einen formalen Einspruch direkt an das zuständige Ordnungsamt.',
      nowEasyEn: 'Effortless today: Driver snaps the paper citation ticket alongside their digital route scanner confirmation showing parcel weight. AI links the timestamps, cites commercial freight exemptions, and writes a formal legal appeal in 20 seconds.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für Paketzusteller: Automatischer Einspruch gegen ungerechtfertigte Knöllchen („LadezonenNotar")',
      subjectEn: 'Gift for delivery drivers: Automated loading-zone ticket defense tool ("LadezonenNotar")',
      bodyDe: `Sehr geehrte Frau Dahlhaus, sehr geehrte Kolleginnen und Kollegen der DPVKOM und ver.di Logistik,

wir stellen Ihnen heute ein vollständig freies Werkzeug unter CC0 Public Domain zur Verfügung: den „LadezonenNotar".

Der unhaltbare Zustand:
Paketboten wie Jens (29) in Leipzig schleppen täglich tonnenweise schwere Pakete in Altbauten. Weil Ladezonen von Pkw blockiert sind, halten Fahrer kurz in zweiter Reihe oder Ladebuchten – und finden bei der Rückkehr Knöllchen über 55–70 € vor. Nach ständiger Rechtsprechung ist das Entladen schwerer Waren verkehrsrechtlich geschützt. Dennoch zahlen Fahrer monatlich hunderte Euro aus eigener Tasche, weil ihnen nach Feierabend die Zeit für förmliche Widersprüche fehlt.

Die Lösung:
Foto vom Knöllchen + Foto vom Lieferschein genügt. Die Software prüft die Aktenzeichen-Nummer, fügt den Nachweis des schweren Ladeguts bei und generiert ein unterschriftsfertiges Schreiben an die Bußgeldstelle mit Verweis auf die einschlägigen OLG-Präzedenzurteile.

Dieses Werkzeug ist 100% gemeinfrei. Sie können es direkt an alle Fahrer verteilen oder in Ihre Mitglieder-Apps integrieren.

Mit kollegialen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear colleagues in postal and courier representation,

We gift you "LadezonenNotar", an open public domain tool (CC0) allowing parcel and delivery drivers to dispute unfair parking tickets received while legitimately unloading freight. A photo of the ticket and delivery confirmation produces a legally airtight formal administrative objection in 20 seconds.`
    },
    whyNowDe: [
      'Vor 2024 unmöglich: Starre Generatoren verlangten endlose manuelle Formulareingaben (Tatort, Tatzeit, Aktenzeichen, Rechtsgrundlage), die am Smartphone viel zu mühsam waren.',
      'Heute möglich: Vision-Modelle scannen Knöllchen-Strafzettel und Handscanner-Belege in einem Wisch, verknüpfen Uhrzeiten und erzeugen ein fertiges, unterschriftsbereites Widerspruchs-PDF.',
      'Fairness: Verhindert, dass die Schwächsten im Logistiksystem für fehlende Ladeinfrastruktur in den Städten zur Kasse gebeten werden.'
    ],
    whyNowEn: [
      'Impossible before AI: Rigid online portals required entering dozens of cryptic violation codes, street numbers, and dates by hand on tiny phone screens.',
      'Now possible: Multimodal vision parses the paper ticket and digital route scanner stamp in one step, producing an airtight dispute citing regional court precedents.',
      'Economic Justice: Stops gig-economy couriers from being squeezed to pay for municipal urban freight planning failures.'
    ],
    firstStepTicketDe: 'Foto des Strafzettels + Foto des Liefernachweises → Erzeugt einseitigen, rechtswahrenden Widerspruch an die Bußgeldstelle',
    firstStepTicketEn: 'Photo of parking citation + delivery confirmation receipt → Instant ready-to-sign formal objection letter to municipal traffic bureau',
    firstStepCriteriaDe: 'Extrahiert Aktenzeichen, Tatzeit und Behördenadresse fehlerfrei aus 10 verschiedenen städtischen Knöllchen-Formaten.',
    firstStepCriteriaEn: 'Accurately pulls citation case number, timestamp, and agency address from 10 distinct municipal ticket formats.',
    tags: ['Echte Arbeit', 'Lieferanten', 'Paketboten', 'Verkehrsrecht', 'Lohnschutz', 'Gewerkschaft']
  },
  {
    id: 'ai-kindergarten-educator-time-liberator',
    title: 'KitaEntlastung: Voice-Driven Child Development Observation & Portfolio Assistant',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Erzieherinnen sprechen in der Pause eine 30-Sekunden-Sprachnotiz ("Leo hat heute ruhig mit Klötzen gebaut, Anna beim Aufräumen geholfen, bei Frust tief durchgeatmet"). Die KI formuliert dies in ressourcenorientierte, kindgerechte Bildungsdokumentation nach Landesbildungsplänen, ohne wertvolle Betreuungszeit zu stehlen.',
    conceptEn: 'Preschool educators record a 30-second voice reflection during break ("Leo built a wooden block tower quietly, shared toys with Anna, calmly managed frustration"). AI structures this into pedagogical strengths-based milestone records compliant with state frameworks, returning hours of childcare time.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'GEW (Gewerkschaft Erziehung und Wissenschaft) · Fröbel e.V. · Bundeselternvertretung der Kitas',
    recipientEn: 'National Association for the Education of Young Children (NAEYC) · Early Childhood Australia',
    sourceType: 'Education & Family',
    sourceDe: 'Developmental Milestones (Kuno Beller / Grenzsteine) Taxonomy + Empathetic Pedagogical Synthesis',
    sourceEn: 'Early Childhood Milestone Taxonomy + Strengths-Based Pedagogical NLP',
    evidenceDe: 'Erzieherinnen verbringen bis zu 25% ihrer Arbeitszeit mit bürokratischer Entwicklungsdokumentation. Tausende Erzieherinnen verlassen den Beruf wegen Papierkram-Überlastung, während bundesweit über 300.000 Kita-Plätze fehlen.',
    evidenceEn: 'Early childhood educators spend up to 8 hours a week filling out mandatory developmental portfolio checklists and observational logs. Overwhelming administrative burdens drive qualified caregivers out of the profession during an acute childcare crisis.',
    reviewDate: '10/2026',
    problemDe: 'Am Wochenende sitzen Erzieherinnen unbezahlt zuhause und verfassen Entwicklungsberichte. Sie haben ein schlechtes Gewissen, weil der Papierkram ihnen die Zeit für echte Zuwendung zu den Kindern raubt.',
    problemEn: 'Educators sacrifice weekends writing observational portfolios unpaid at home. They feel profound guilt that bureaucratic compliance steals warmth and attention from the children in their care.',
    workerPersona: {
      name: 'Sabine Thiele (51)',
      role: 'Staatlich anerkannte Erzieherin & Gruppenleiterin (22 Kinder)',
      location: 'Städtische Kita „Sonnenschein", Potsdam, Brandenburg',
      quoteDe: 'Ich bin Erzieherin geworden, um Kindern beim Wachsen zu helfen und zu trösten, wenn Tränen fließen. Stattdessen sitze ich jeden Sonntag mit Aktenordnern am Küchentisch und muss für 22 Kinder „Grenzsteine der Entwicklung" abhaken. Ich kann nicht mehr.',
      quoteEn: 'I became an educator to hold little hands and nurture young minds. Instead, every Sunday I sit at my kitchen table with thick binders checking off mandatory developmental milestone grids for 22 children. I am exhausted.',
      storyDe: 'Sabine leitet eine Gruppe mit 22 Kindern im Alter von 3 bis 6 Jahren, darunter drei Integrationskinder mit besonderem Förderbedarf. Das Ministerium verlangt lückenlose Portfolios und Beobachtungsbögen. In der Kita fehlt jegliche Vorbereitungszeit; wenn Kolleginnen krank sind, ist Sabine mit 18 Kindern allein. Die Berichte schreibt sie sonntags unbezahlt daheim. Die ständige Zerrissenheit zwischen bürokratischem Kontrollwahn und der Sehnsucht nach echter menschlicher Zuwendung trieb zwei ihrer jüngeren Kolleginnen bereits in den Berufsausstieg.',
      storyEn: 'Sabine leads a preschool room of 22 children aged 3 to 6, including three with special needs. State regulations demand continuous observational portfolios. During the day, there is zero planning time; when staff falls sick, Sabine is solo with 18 kids. She writes reports on Sundays unpaid. The crushing conflict between bureaucratic compliance and genuine care has already driven two of her junior colleagues to quit teaching entirely.'
    },
    realRecipientsList: [
      {
        org: 'Gewerkschaft Erziehung und Wissenschaft (GEW) – Hauptvorstand',
        person: 'Doreen Siebernik (Vorstandsmitglied für Jugendhilfe und Sozialarbeit)',
        email: 'erziehung@gew.de',
        location: 'Reifenberger Str. 21, 60489 Frankfurt am Main',
        roleDe: 'Bundesweite Bildungsgewerkschaft; setzt sich intensiv gegen Überlastung und Dokumentationswahn in Kitas ein.',
        roleEn: 'National education union advocating for early childhood educators and fighting administrative overload.',
        url: 'https://www.gew.de'
      },
      {
        org: 'Fröbel e.V. (Größter überregionaler gemeinnütziger Kita-Träger)',
        person: 'Geschäftsführung Pädagogik & Qualitätsentwicklung',
        email: 'info@froebel-gruppe.de',
        location: 'Alexanderstraße 9, 10178 Berlin',
        roleDe: 'Betreibt über 200 Kitas bundesweit und sucht aktiv nach Entlastungsmöglichkeiten für Erzieherteams.',
        roleEn: 'Operates over 200 non-profit preschools and daycare centers across Germany.',
        url: 'https://www.froebel-gruppe.de'
      },
      {
        org: 'National Association for the Education of Young Children (NAEYC - USA)',
        person: 'Michelle Kang (Chief Executive Officer)',
        email: 'info@naeyc.org',
        location: '1401 H Street NW, Washington, DC, USA',
        roleDe: 'Weltweit größte Fachorganisation für frühkindliche Bildung.',
        roleEn: 'World’s largest association for early childhood educators promoting pedagogical quality and staff wellness.',
        url: 'https://www.naeyc.org'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Bisherige Software bot nur kalte, unpersönliche Multiple-Choice-Masken, die Kinder pathologisierten („Zeigt Defizit bei Scherenhaltung"). Es gab keine Technologie, die eine kurze gesprochene Alltagsszene in pädagogisch wohlwollende Bildungssprache übersetzen konnte.',
      beforeAiEn: 'Impossible before AI: Prior software offered only cold multiple-choice dropdowns that pathologized normal child development ("Shows fine motor deficit"). Zero software could turn a warm 20-second spoken anecdote into affirming pedagogical narrative.',
      nowEasyDe: 'Heute kinderleicht: Erzieherinnen sprechen in der Pause 25 Sekunden: „Mika hat heute ausdauernd mit Holzklötzen ein Schloss gebaut und Leo getröstet." Die KI erzeugt daraus eine ressourcenorientierte Beobachtungsnotiz nach Landesbildungsplan, ohne Stigmatisierung und in voller Würde für das Kind.',
      nowEasyEn: 'Effortless today: Educators speak 25 seconds during naptime: "Mika built a tall wooden tower with focused persistence and comforted Leo when it fell." AI synthesizes a strengths-based milestone narrative aligned with state frameworks in seconds.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für Erzieherinnen: Freies Werkzeug gegen den Dokumentationswahn („KitaEntlastung")',
      subjectEn: 'Gift for early childhood teachers: Free voice documentation assistant ("KitaEntlastung")',
      bodyDe: `Sehr geehrte Frau Siebernik, sehr geehrte Damen und Herren bei der GEW und Fröbel,

wir übergeben Ihnen heute ein freies, gemeinnütziges Geschenk für alle Erzieherinnen unter CC0 Public Domain: „KitaEntlastung".

Das Problem:
Tausende engagierte Erzieherinnen wie Sabine (51) in Potsdam verbringen ihre Wochenenden damit, unbezahlt Entwicklungsberichte und Bildungsbiografien zu verfassen. Dieser bürokratische Dokumentationsdruck ist eine der Hauptursachen für den dramatischen Fachkräftemangel in Kitas.

Die Lösung:
Erzieherinnen sprechen während des Freispiels oder in der Pause eine 30-sekündige Sprachnotiz ein. Das Werkzeug strukturiert die Beobachtung nach den anerkannten Bildungsbereichen (Sozialverhalten, Kognition, Sprache) in wertschätzender, kindgerechter Sprache. Keine Diagnosen, keine Defizitorientierung – sondern echte Entlastung, die den Fachkräften bis zu 5 Stunden pro Woche zurückgibt.

Vollständig quelloffen, ohne Nutzerverfolgung und datenschutzkonform lokal nutzbar.

Mit herzlichen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders in early childhood education,

We present "KitaEntlastung", a CC0 public domain tool that frees preschool teachers from sacrificing weekends to bureaucratic documentation. Teachers record a 25-second spoken reflection; the tool formats it into strengths-based developmental observations, returning up to 5 hours of personal life every single week.`
    },
    whyNowDe: [
      'Vor 2024 unmöglich: Generische Textbausteine klangen bürokratisch, kalt und stigmatisierend ("Kind zeigt Defizite in Feinmotorik").',
      'Heute möglich: Feinfühlige Sprachmodelle transformieren kurze gesprochene Alltagsszenen in wertschätzende, entwicklungspsychologisch fundierte Berichte, die Kinder stärken.',
      'Entlastung: Schenkt Erzieherinnen jede Woche Stunden an menschlicher Zeit zurück.'
    ],
    whyNowEn: [
      'Impossible before AI: Automated templates produced cold, clinical jargon that inadvertently pathologized normal child behavioral variations.',
      'Now possible: Empathetically instructed language models convert brief spoken anecdotes into affirming, strengths-focused developmental prose.',
      'Human Restoration: Gives educators 5-8 hours of their weekly life back, keeping compassionate teachers in the classroom.'
    ],
    firstStepTicketDe: 'Sprachmemo von 20 Sekunden → Strukturierung in 3 Beobachtungskategorien (Sozialverhalten, Kognition, Motorik) im Fließtext',
    firstStepTicketEn: '20-sec voice memo → Structures into 3 developmental categories (Social, Cognitive, Motor) in gentle narrative prose',
    firstStepCriteriaDe: 'Keine Diagnosen oder Stigmatisierungen; ausschließlich deskriptive, wohlwollende und ressourcenorientierte Formulierungen.',
    firstStepCriteriaEn: 'Zero clinical diagnostic claims or deficit framing; strictly strengths-based, affirming descriptive language.',
    tags: ['Echte Arbeit', 'Kita', 'Erzieher', 'Kinder', 'Bildung', 'Pädagogik']
  },
  {
    id: 'ai-line-cook-allergen-radar',
    title: 'AllergenRadar: Instant Recipe Allergen Auditor & Menu Labeler for Kitchen Staff',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Küchenchef oder Koch fotografiert die Zutatenverpackungen von Gewürzmischungen, Saucen und Halbfertigwaren. Die KI gleicht alle E-Nummern und versteckten Allergene (Sellerie, Senf, Lupine, Soja, Gluten) mit den 14 EU-Hauptallergenen ab und druckt laminierbare Küchen-Allergenlisten.',
    conceptEn: 'Line cook or bakery apprentice photographs packaging backs of bulk spices, stocks, and sauces. AI matches hidden E-numbers and derivatives against the 14 statutory EU allergens, producing kitchen safety sheets and menu declarations in seconds.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'DEHOGA Bundesverband (Gastronomie) · Deutscher Allergie- und Asthmabund (DAAB) · Köcheverein',
    recipientEn: 'National Restaurant Association · European Food Safety Alliance · Chefs Collaborative',
    sourceType: 'Craft & Workshop',
    sourceDe: 'Multimodal Ingredient Parsing + EU Food Information Regulation 1169/2011 Knowledge Graph',
    sourceEn: 'Food Label OCR + International Statutory Food Allergen Taxonomy',
    evidenceDe: 'In der Gastronomie haften Köche persönlich für undeklarierte Allergene. Bei 14 Hauptallergenen und dutzenden Lieferantenverpackungen mit winziger Schrift ist eine manuelle Prüfung im Küchenstress kaum machbar.',
    evidenceEn: 'Chefs and line cooks face severe legal liability for food allergy reactions. With 14 mandatory allergen categories and dozens of wholesale packaging labels, manual verification during dinner rush is nearly impossible.',
    reviewDate: '10/2026',
    problemDe: 'Versteckte Allergene (z.B. Senfmehl in Currypulver, Fischsauce in BBQ-Sauce, Sellerie in Gemüsebrühe) werden im Eifer des Gefechts übersehen. Im schlimmsten Fall erleidet der Gast einen anaphylaktischen Schock.',
    problemEn: 'Hidden allergens (e.g. mustard flour in curry powder, soy in Worcestershire sauce, celery in vegetable bouillons) are easily overlooked during hectic meal preparation, risking patient anaphylaxis.',
    workerPersona: {
      name: 'Cem Yildiz (31)',
      role: 'Allein-Koch & Schichtleiter (Bistro & Catering)',
      location: 'Köln-Ehrenfeld & Bergisch Gladbach',
      quoteDe: 'Wenn abends 45 Bon-Zettel an der Leiste hängen und eine Servicekraft ruft: „Tisch 4 hat Zöliakie und Sellerie-Allergie!", bricht mir der Schweiß aus. In der Großhandels-Gemüsebrühe steht auf der Rückseite in Schriftgröße 4 ein Roman aus 35 chemischen Begriffen. Wenn ich einen Fehler mache, fahre ich den Gast ins Krankenhaus.',
      quoteEn: 'When 45 order tickets hang over the line on a Friday night and a server yells: "Table 4 has celiac and a severe celery allergy!", I break into a cold sweat. The wholesale spice mix has 35 ingredients in micro-font. If I miss one, someone goes to the ER and I get sued.',
      storyDe: 'Cem kocht seit 10 Jahren mit Herzblut. Die EU-Lebensmittelinformationsverordnung verlangt die lückenlose Dokumentation von 14 Allergenen. Lieferanten wechseln ständig Rezepturen: Einmal ist in der gelieferten Worcestersauce Sardellenextrakt (Fisch), beim nächsten Großmarkt-Einkauf Senfmehl. Vor drei Monaten bestellte ein Gast mit schwerer Erdnussallergie ein Currygericht; das Großhandels-Kokosfett enthielt Spuren von Erdnussöl. Der Notarzt musste gerufen werden. Cem leidet seitdem unter ständiger Panik vor dem Abendservice.',
      storyEn: 'Cem is a dedicated cook. EU regulations require strict labeling across 14 statutory allergens. But wholesale suppliers frequently alter recipes without notice: one week the Worcestershire sauce contains anchovies (fish), the next week mustard seed. Three months ago, a guest with a severe peanut allergy went into anaphylaxis because a bulk oil blend contained traces of peanut. Cem lived through a nightmare inquiry and now faces panic before every dinner service.'
    },
    realRecipientsList: [
      {
        org: 'DEHOGA Bundesverband (Deutscher Hotel- und Gaststättenverband e.V.)',
        person: 'Sandra Warden (Geschäftsführerin Berufsbildung & Arbeitsmarkt)',
        email: 'info@dehoga.de',
        location: 'Am Weidendamm 1A, 10117 Berlin',
        roleDe: 'Bundesverband des Gastgewerbes; vertritt 65.000 gastgewerbliche Betriebe.',
        roleEn: 'National hospitality federation representing 65,000 restaurants, pubs, and hotels.',
        url: 'https://www.dehoga-bundesverband.de'
      },
      {
        org: 'Deutscher Allergie- und Asthmabund e.V. (DAAB)',
        person: 'Andrea Wallrafen (Geschäftsführung)',
        email: 'info@daab.de',
        location: 'An der Eickesmühle 15-19, 41238 Mönchengladbach',
        roleDe: 'Älteste und größte Patientenorganisation für Allergiker in Deutschland.',
        roleEn: 'Oldest and largest patient advocacy organization for people with severe food allergies.',
        url: 'https://www.daab.de'
      },
      {
        org: 'Verband der Köche Deutschlands e.V. (VKD)',
        person: 'Geschäftsstelle / Präsidium',
        email: 'vkd@vkd.com',
        location: 'Steinlestraße 19a, 60596 Frankfurt am Main',
        roleDe: 'Größte Gemeinschaft von Köchinnen und Köchen in Deutschland.',
        roleEn: 'Germany’s professional chefs association promoting culinary safety and craft excellence.',
        url: 'https://www.vkd.com'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Starre Textfilter scheiterten an mehrsprachigen Großhandels-Etiketten (Italienisch, Französisch, Polnisch) und chemischen Synonymen wie "hydrolysiertes Weizenprotein" oder "Sojalecithin E322".',
      beforeAiEn: 'Impossible before AI: Keyword search failed on multi-language imported bulk goods and technical derivative synonyms like "hydrolyzed wheat gluten" or "soy lecithin E322".',
      nowEasyDe: 'Heute kinderleicht: Ein Foto der Zutatenliste genügt. Das multimodale Modell übersetzt fremdsprachige Fachbegriffe, erkennt versteckte Trägerstoffe und markiert die 14 EU-Allergene mit Ampel-Farben in 1,2 Sekunden.',
      nowEasyEn: 'Effortless today: A quick photo of the ingredients panel is all it takes. Multimodal AI parses foreign trade terms, catches hidden carriers, and highlights the 14 statutory EU allergens with instant traffic-light color codes in 1.2 seconds.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für die Gastronomie: Kostenloser Allergenscanner für Großgebinde („AllergenRadar")',
      subjectEn: 'Gift for culinary staff: Free statutory allergen scanner for kitchens ("AllergenRadar")',
      bodyDe: `Sehr geehrte Frau Warden, sehr geehrte Damen und Herren im DEHOGA und beim Verband der Köche Deutschlands,

wir möchten Ihnen ein kostenloses, gemeinnütziges Werkzeug schenken, das wir unter CC0 Public Domain stellen: den „AllergenRadar".

Der Druck in der Restaurantküche:
Köche wie Cem (31) haften persönlich für undeklarierte Allergene nach der EU-Verordnung 1169/2011. Im hektischen Abendservice müssen Großgebinde mit winziger Schrift geprüft werden. Fehler können für Gäste lebensbedrohlich sein und den Koch die Existenz kosten.

Die Lösung:
Foto der Zutatenliste auf der Großhandelsverpackung machen: Die KI scannt in Sekundenschnelle alle Inhaltsstoffe, deckt versteckte Synonyme auf und markiert die 14 EU-Pflichtallergene farbig auf einen Blick.

Frei für alle gastronomischen Betriebe, Innungen und Kochschulen ohne Gebühren.

Mit gastfreundlichen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders of the culinary and hospitality industry,

We are pleased to gift you "AllergenRadar", a CC0 public domain tool designed for line cooks and kitchen staff to instantly identify the 14 mandatory statutory allergens on wholesale ingredient labels from a single smartphone photo.`
    },
    whyNowDe: [
      'Vor 2024 unmöglich: Klassische Volltextsuche übersah Synonyme wie "Lecithin aus Soja", "Dextrin aus Weizen" oder fremdsprachige Zutatenlisten italienischer/asiatischer Großhändler.',
      'Heute möglich: Multimodale LLMs verstehen mehrsprachige Zutatenlisten, dekodieren chemische Synonyme und ordnen sie zweifelsfrei den 14 Allergenklassen zu.',
      'Gastesicherheit & Kochschutz: Schützt Menschen mit Allergien vor lebensbedrohlichen Reaktionen und Köche vor Strafverfahren.'
    ],
    whyNowEn: [
      'Impossible before AI: Simple keyword search missed multilingual imported labels and complex derivatives like "hydrolyzed wheat gluten" or "soy lecithin".',
      'Now possible: Multimodal models parse multi-lingual ingredient lists and map hidden trace derivatives to standardized hazard badges.',
      'Guest Safety & Chef Peace of Mind: Prevents fatal anaphylactic episodes while shielding kitchen teams from devastating criminal inquiries.'
    ],
    firstStepTicketDe: 'Foto einer Großhandels-Verpackungsrückseite → Liste der enthaltenen 14 Allergene mit Ampelfarben und Textausschnitt als Beleg',
    firstStepTicketEn: 'Snapshot of wholesale condiment back label → Highlighted list of the 14 mandatory allergens with evidence text snippets',
    firstStepCriteriaDe: 'Erkennt 14 EU-Allergene auf 20 Test-Verpackungen ohne falsch-negative Auslassungen.',
    firstStepCriteriaEn: 'Zero false negatives on mandatory allergens across 20 commercial bulk food package labels.',
    tags: ['Echte Arbeit', 'Gastronomie', 'Kochen', 'Allergene', 'Lebensmittel', 'Sicherheit']
  },
  {
    id: 'ai-sourdough-baker-thermal-balance',
    title: 'TeigPhysik: Sourdough Thermal Balance & Water Chill Calculator for Artisan Bakers',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Foto des Backstuben-Thermometers und der Mehllieferung: Die KI berechnet unter Berücksichtigung von Raumwärme, Kneter-Reibungswärme und Mehlfeuchte die exakte Schüttwassertemperatur (z.B. Eiszugabe in Gramm), damit der Natursauerteig exakt bei 24,5°C aus der Knetmaschine kommt.',
    conceptEn: 'Photograph the bakery room thermometer and flour sack lot: AI calculates exact water mix temperature (including exact grams of crushed ice needed) factoring in room heat, mixer friction friction-coefficient, and flour moisture so sourdough hits exactly 24.5°C.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'Zentralverband des Deutschen Bäckerhandwerks · Bäcker-Innungen · Slow Baking Verband',
    recipientEn: 'Real Bread Campaign (UK) · Bread Bakers Guild of America · Artisanal Milling Guilds',
    sourceType: 'Craft & Workshop',
    sourceDe: 'Bakery Thermodynamic Equilibrium Formula + Computer Vision Scale & Thermometer Parser',
    sourceEn: 'Thermodynamic Dough Temperature Modeling + Visual Environment Sensing',
    evidenceDe: 'Kleine Handwerksbäcker stehen nachts um 2:30 Uhr in der Backstube. Wenn Teige im Sommer um nur 3°C zu warm werden, fressen die Hefen den Zucker zu schnell, das Glutengerüst kollabiert und hunderte Brote werden unverkäuflich.',
    evidenceEn: 'Small artisan bakers start work at 2:30 AM. In changing summer heat, if dough leaves the mixer just 3°C too warm, wild yeast over-ferments, the gluten matrix liquefies, and an entire batch of 250 organic sourdough loaves is ruined.',
    reviewDate: '10/2026',
    problemDe: 'Industrielle Großbäckereien haben klimatisierte Mehl-Silos und teure Eisdosieranlagen. Der kleine Handwerksbäcker muss im Kopf mit komplizierten Teigtemperatur-Formeln jonglieren, während der Kneter schon läuft.',
    problemEn: 'Industrial factory bakeries utilize climate-controlled flour silos and automated chilled-water dosers. Small craft bakers must calculate complex thermal balance formulas in their heads at 3 AM while the mixer is already spinning.',
    workerPersona: {
      name: 'Ludwig Weiss (57)',
      role: 'Bäckermeister in dritter Generation',
      location: 'Bäckerei Weiss, Cham, Bayerischer Wald',
      quoteDe: 'Ich backe ohne Enzyme und ohne Industrie-Backmittel. Mein Roggensauerteig verzeiht keine Hitze. Wenn der Teig mit 27 Grad statt 24 Grad aus der Knetmaschine kommt, kann ich 150 Laibe in die Tonne kippen. Im Sommer schwitzt die Backstube bei 32 Grad – da muss ich jedes Gramm Schüttwasser mit Eis kühlen.',
      quoteEn: 'I bake without synthetic enzymes or chemical enhancers. My rye sourdough tolerates zero overheating. If the dough comes out of the spiral mixer at 27°C instead of 24.5°C, 150 loaves of artisanal bread are ruined. When the bakery hits 32°C in July, I have to balance ice to the exact gram.',
      storyDe: 'Ludwig steht jede Nacht um 02:15 Uhr in der Backstube. Während Industriebäckereien vollautomatische Kältesilos besitzen, lagert Ludwigs Mehl auf dem Dachboden. Bei schwülem Sommerwetter ändert sich die Mehltemperatur von Tag zu Tag um mehrere Grad. Kommt die Reibungswärme des alten Spiralkneters hinzu, wird das Berechnen der exakten Schüttwassertemperatur und der benötigten Eismenge um 3:00 Uhr morgens zum riskanten Blindflug. Letztes Jahr verlor er im Juli zwei komplette Ofenladungen – ein Schaden von über 2.000 €.',
      storyEn: 'Ludwig starts his ovens at 2:15 AM every day. Unlike industrial mega-bakeries with air-conditioned flour silos, Ludwig stores his organic flour in his attic loft. On hot summer days, flour temperatures fluctuate wildly. Factoring in the intense frictional heat of an old spiral mixer, calculating the precise water chill and ice substitution at 3 AM is pure stressful guesswork. Last summer, two full oven loads overfermented and collapsed—a loss of over €2,000 for a small family shop.'
    },
    realRecipientsList: [
      {
        org: 'Zentralverband des Deutschen Bäckerhandwerks e.V.',
        person: 'Dr. Friedemann Berg (Hauptgeschäftsführer)',
        email: 'zv@baeckerhandwerk.de',
        location: 'Neustädtische Kirchstraße 8, 10117 Berlin',
        roleDe: 'Spitzenorganisation des deutschen Bäckerhandwerks (über 9.000 Handwerksbäckereien).',
        roleEn: 'National craft federation representing over 9,000 independent artisanal bakeries.',
        url: 'https://www.baeckerhandwerk.de'
      },
      {
        org: 'Slow Baking e.V. – Verband für traditionelle Backkultur',
        person: 'Vorstand Slow Baking',
        email: 'info@slow-baking.org',
        location: 'Deutschland / Österreich / Schweiz',
        roleDe: 'Verband von Bäckermeistern, die auf chemische Backmittel verzichten und lange Teigführung pflegen.',
        roleEn: 'Association of master bakers dedicated to pure sourdough fermentation and additive-free baking.',
        url: 'https://www.slow-baking.org'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Starre Rechner-Apps verlangten das manuelle Nachschlagen von Kneter-Reibungsbeiwerten und das Tippen auf staubigen Touchscreens mit mehligen Händen. Sie berücksichtigten weder Mehlfeuchte noch Schmelzwärme von zerstoßenem Eis.',
      beforeAiEn: 'Impossible before AI: Static temperature apps required looking up obscure mixer friction coefficients and tapping cracked phone screens with flour-coated hands. None computed latent ice heat of fusion dynamically.',
      nowEasyDe: 'Heute kinderleicht: Ein Blick der Smartphone-Kamera auf das Wandthermometer und das Kneter-Typenschild genügt: Das thermodynamische Modell berechnet die exakte Schüttwassertemperatur und die Gramm Eiszugabe und sagt sie laut an.',
      nowEasyEn: 'Effortless today: One glance of the smartphone camera at the wall dial thermometer and mixer motor badge is enough: the thermodynamic model outputs exact target water temperature and exact grams of crushed ice, read out aloud via audio.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für das Bäckerhandwerk: Thermodynamischer Sauerteig-Rechner („TeigPhysik", CC0)',
      subjectEn: 'Gift for artisan bakeries: Free thermodynamic sourdough water calculator ("TeigPhysik")',
      bodyDe: `Sehr geehrter Herr Dr. Berg, sehr geehrte Damen und Herren im Zentralverband des Deutschen Bäckerhandwerks,

wir schenken Ihnen heute ein freies Werkzeug unter CC0 Public Domain: „TeigPhysik".

Die handwerkliche Herausforderung:
Traditionelle Handwerksbäcker wie Ludwig (57) arbeiten ohne künstliche Enzyme. Bei schwankenden Sommertemperaturen droht Teigen die Überhitzung im Kneter – ein Unterschied von nur 2 Grad führt zum Zusammenbruch des Glutengerüsts. Während Großkonzerne teure Kühlanlagen besitzen, müssen Handwerksbäcker nachts um 3:00 Uhr mit mehligen Händen komplizierte Schüttwasser- und Eisberechnungen im Kopf anstellen.

Die Lösung:
Ein Foto von Thermometer und Kneter reicht: Die Software berechnet die Reibungswärme und gibt sofort per Sprachansage die exakte Wassertemperatur und nötige Gramm-Zahl an gestoßenem Eis durch.

100% frei und kostenlos für alle Bäckerinnungen und Meisterschulen.

Mit besten Handwerkergrüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders of the artisanal bakeries federation,

We present "TeigPhysik", an open public domain calculator (CC0) helping craft sourdough bakers hit exact 24.5°C dough temperatures in changing summer heat, calculating water chill and ice substitution in seconds.`
    },
    whyNowDe: [
      'Vor 2024 unmöglich: Starre Apps berücksichtigten weder den individuellen Kneter-Typ (Spiralkneter vs. Hubkneter) noch aktuelle Wetter-Luftfeuchtigkeitsdaten.',
      'Heute möglich: Ein Foto der Knetermarke und des Thermometers reicht — physikalische Modelle berechnen die exakte Eis- und Wassermenge in Milligramm-Genauigkeit.',
      'Handwerkstradition: Bewahrt traditionelle Bäckereien vor Fehlchargen und sichert die Existenz des echten Brothandwerks.'
    ],
    whyNowEn: [
      'Impossible before AI: Static spreadsheets failed to adapt to specific mixer motor types (spiral vs oblique arms) and sudden barometric weather changes.',
      'Now possible: A single snapshot of the mixer rating plate and room dial instantly computes thermal dissipation and exact ice fraction in seconds.',
      'Artisanal Resilience: Protects independent family bakeries from ruinous production losses and keeps authentic sourdough craftsmanship viable.'
    ],
    firstStepTicketDe: 'Eingabe von Raumtemperatur, Mehltemperatur und Knetertyp → Zeigt exakte Schüttwassertemperatur und Eis-Ersatz in Gramm an',
    firstStepTicketEn: 'Inputs for ambient temp, flour temp, and mixer type → Outputs required water temp and ice substitution in grams',
    firstStepCriteriaDe: 'Erreicht bei 5 realen Testbackungen eine Teigtemperatur-Abweichung von unter ±0,5°C vom Zielwert.',
    firstStepCriteriaEn: 'Maintains finished dough temperature within ±0.5°C of target across 5 empirical bakery test bakes.',
    tags: ['Echte Arbeit', 'Bäcker', 'Handwerk', 'Sauerteig', 'Physik', 'Ernährung']
  },
  {
    id: 'ai-caregiver-wound-documenter',
    title: 'WundDoku: Rapid Clinical Wound Measurement & Insurance Text Synthesizer for Home Care',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Pflegekraft hält das Smartphone 5 Sekunden über die Wunde (Dekubitus/Ulcus) mit Papierlineal daneben: Die KI berechnet Fläche in mm², schätzt Gewebeanteile (Granulation, Fibrin, Nekrose) nach W.A.R.D.-Schema und formuliert die gesetzlich geforderte Pflegedokumentation in 20 Sekunden.',
    conceptEn: 'Home-care nurse holds phone camera for 5 seconds over a chronic wound (pressure ulcer / diabetic ulcer) with a paper scale: AI calculates surface area in mm², estimates tissue ratios (granulation, fibrin, necrosis), and synthesizes statutory health insurance progress notes in 20 seconds.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'Caritas & Diakonie Pflegedienste · AWO Bundesverband · Initiative Chronische Wunden (ICW e.V.)',
    recipientEn: 'Visiting Nurse Associations of America (VNAA) · Wound, Ostomy, and Continence Nurses Society (WOCN)',
    sourceType: 'Health & Care',
    sourceDe: 'Semantic Wound Margin Segmentation + W.A.R.D. Tissue Color Spectrum Analysis + Statutory Nursing Charting Synthesizer',
    sourceEn: 'Medical Wound Margin Segmentation + Tissue Spectrum Analysis + Statutory Nursing Documentation NLP',
    evidenceDe: 'Über 2,5 Millionen Menschen in Deutschland leiden an chronischen Wunden. Ambulante Pflegekräfte verbringen bis zu 30 Minuten pro Verbandswechsel mit handschriftlichen Dokumentationspflichten, um Abrechnungskürzungen der Kassen abzuwehren.',
    evidenceEn: 'Over 6 million patients in North America and Europe struggle with chronic wounds. Visiting nurses spend up to 30 minutes charting each dressing change to satisfy bureaucratic insurance audits, robbing them of bedside care time.',
    reviewDate: '10/2026',
    problemDe: 'Wer nach 8 Stunden ambulanter Tour durch Stau und Treppensteigen noch 2 Stunden Wundberichte tippen muss, verliert die Freude am Pflegeberuf. Die Patienten spüren die Hektik.',
    problemEn: 'Nurses driving through traffic for 8 hours shouldn\'t have to spend 2 hours typing repetitive clinical descriptions late at night. Patients feel the rush, and nurse attrition spikes.',
    workerPersona: {
      name: 'Franziska Richter (38)',
      role: 'Examinierte Altenpflegerin im ambulanten Dienst (Hausbesuche)',
      location: 'Dresden-Altstadt & Heidenau, Sachsen',
      quoteDe: 'Ich besuche 16 ältere Patienten am Tag. Viele haben niemanden sonst auf der Welt. Wenn ich bei Frau Müller (84) den Verband am Unterschenkel wechsle, möchte ich ihre Hand halten und fragen, wie es ihr geht. Stattdessen sitze ich mit dem Tablet da und tippe: „Ulcus cruris 32x24mm, 40% Faserbelag, mäßiges Exsudat", weil der Medizinische Dienst sonst die Abrechnung streicht.',
      quoteEn: 'I visit 16 elderly patients a day. Many have no family left. When I change 84-year-old Mrs. Mueller\'s leg bandage, I want to hold her hand and listen. Instead, I am forced to tap on a tablet screen documenting wound square millimeters and fibrin percentages, terrified that insurance audits will deny payment.',
      storyDe: 'Franziska liebt ihren Beruf, doch die minutiösen Dokumentationsvorschriften der Krankenkassen für chronische Wunden fressen ihre Seele auf. Für das Ausmessen mit Papiermessband, das Schätzen der Heilungsphasen und das fehlerfreie Verfassen des Verlaufsberichts nach Kassenrichtlinien braucht sie 20 Minuten pro Patient. Bei 16 Patienten sind das über 3 Stunden reine Schreibtischarbeit am Tag. Es ist Zeit, die am Krankenbett gestohlen wird.',
      storyEn: 'Franziska loves caring for seniors, but the relentless clinical charting demanded by health insurance authorities drains her spirit. Measuring irregular wounds with disposable paper rulers and typing descriptive color breakdowns takes 20 minutes per visit. Across 16 home calls, that is over three hours of typing every single day—hours stolen from human warmth and bedside comfort.'
    },
    realRecipientsList: [
      {
        org: 'Initiative Chronische Wunden e.V. (ICW)',
        person: 'Vorstand & Geschäftsstelle ICW',
        email: 'kontakt@icwunden.de',
        location: 'Kaiserswerther Straße 135, 40474 Düsseldorf',
        roleDe: 'Führende Fachgesellschaft für moderne, qualitätsgesicherte Wundbehandlung und Pflege.',
        roleEn: 'Leading clinical association for modern wound management standards and nurse training.',
        url: 'https://www.icwunden.de'
      },
      {
        org: 'Deutscher Caritasverband e.V. – Referat Altenhilfe und Pflege',
        person: 'Geschäftsführung Pflege',
        email: 'altenhilfe@caritas.de',
        location: 'Karlstraße 40, 79104 Freiburg',
        roleDe: 'Betreibt tausende ambulante Pflegedienste und Sozialstationen in ganz Deutschland.',
        roleEn: 'Operates thousands of community visiting nurse services across Germany.',
        url: 'https://www.caritas.de'
      },
      {
        org: 'Diakonie Deutschland – Pflege und Gesundheit',
        person: 'Zentrum Gesundheit, Rehabilitation und Pflege',
        email: 'pflege@diakonie.de',
        location: 'Caroline-Michaelis-Str. 1, 10115 Berlin',
        roleDe: 'Bundesverband der evangelischen Pflegedienste und Diakoniestationen.',
        roleEn: 'Federal association of non-profit community health and eldercare stations.',
        url: 'https://www.diakonie.de'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Computer-Vision konnte unregelmäßige, blutige Wundränder unter wechselndem Wohnzimmerlicht nicht von gesundem Hautgewebe unterscheiden. Genaue Wundvermessung gab es nur mit 15.000 € teuren Spezial-3D-Kameras in Universitätskliniken.',
      beforeAiEn: 'Impossible before AI: Standard computer vision failed to segment irregular bleeding wound edges under dim incandescent home lighting. Precise area calculation required $15,000 3D hospital optical carts.',
      nowEasyDe: 'Heute kinderleicht: Ein 5-Sekunden-Smartphone-Foto mit Papierlineal genügt. Neuronale Segmentierungsnetze berechnen die Fläche auf den Quadratmillimeter genau, schlüsseln Granulation, Fibrin und Nekrose farblich auf und formulieren den Kassentext in 15 Sekunden.',
      nowEasyEn: 'Effortless today: A 5-second phone photo next to a paper ruler is all that’s needed. Neural segmentation networks measure area down to the square millimeter, break down tissue types, and write statutory insurance notes in 15 seconds.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für ambulante Pflegedienste: 20-Sekunden-Wunddokumentation („WundDoku", CC0)',
      subjectEn: 'Gift for visiting nurses: 20-second clinical wound measurement & charting ("WundDoku")',
      bodyDe: `Sehr geehrte Damen und Herren bei der Initiative Chronische Wunden und den Caritas/Diakonie Pflegediensten,

wir möchten Ihnen ein freies Geschenk überreichen, das wir bedingungslos unter CC0 Public Domain stellen: „WundDoku".

Der Schmerz im Pflegealltag:
Ambulante Pflegekräfte wie Franziska (38) eilen von Patient zu Patient. Bis zu 30 Minuten pro Verbandswechsel gehen für das mühsame manuelle Ausmessen und Formulieren von Wundberichten für die Kassenprüfung verloren – Zeit, die für menschliche Zuwendung am Patientenbett schmerzlich fehlt.

Die Lösung:
Smartphone kurz über die Wunde halten (mit Papiermaßstab): Die Software berechnet automatisch die Fläche in mm², analysiert die Gewebeanteile nach W.A.R.D. und formuliert den vorgeschriebenen Verlaufstext. Keine Speicherung von Patientendaten oder Gesichtern – 100% datenschutzkonform.

Geben Sie Ihren Pflegekräften 20 Minuten Menschlichkeit pro Besuch zurück.

Mit herzlichen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders in home nursing and wound care,

We gift you "WundDoku", an open public domain tool (CC0) allowing home-care visiting nurses to capture surface area and tissue ratios in 5 seconds, generating compliant progress notes instantly and returning precious human time to the bedside.`
    },
    whyNowDe: [
      'Vor 2024 unmöglich: Genaue Wundvermessung erforderte 10.000 € teure 3D-Kamerasysteme in Spezialkliniken.',
      'Heute möglich: Sub-Millimeter-Segmentierung läuft direkt im Smartphone-Browser; die KI trennt Wundrand von gesundem Epithelgewebe präziser als das menschliche Auge bei Zeitdruck.',
      'Menschlichkeit in der Pflege: Gibt Pflegekräften 20 Minuten Zeit für ein echtes Gespräch, ein Lächeln und menschliche Zuwendung am Krankenbett zurück.'
    ],
    whyNowEn: [
      'Impossible before AI: Accurate wound area estimation required $10,000 multi-spectral camera rigs in specialized research clinics.',
      'Now possible: On-device sub-millimeter segmentation separates wound beds from healthy epithelial tissue reliably on ordinary phones in ambient lighting.',
      'Human-Centered Care: Restores 20 minutes per visit for genuine conversation, dignity, and human warmth at the patient’s bedside.'
    ],
    firstStepTicketDe: 'Foto einer Wunde mit Maßband-Referenz → Automatische Flächenberechnung in mm² + Gewebe-Farbanalyse (Rot=Granulation, Gelb=Fibrin)',
    firstStepTicketEn: 'Wound photo with scale reference → Automated area in mm² + tissue breakdown (Red=Granulation, Yellow=Fibrin, Black=Necrosis)',
    firstStepCriteriaDe: 'Flächenabweichung gegenüber planimetrischem Goldstandard unter 8%; kein Upload von Patientennamen oder Gesichtern.',
    firstStepCriteriaEn: 'Surface area deviation under 8% versus planimetric clinical gold standard; zero patient identity or facial data stored.',
    tags: ['Echte Arbeit', 'Pflege', 'Gesundheit', 'Wundversorgung', 'Altenpflege', 'Menschlichkeit']
  },
  {
    id: 'ai-forester-timber-pile-scaler',
    title: 'PolterMaß: Optical Timber Volume & Bark Beetle Scanner for Small Foresters',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Aus 5 Metern Entfernung ein Foto des Holzpolters am Waldweg machen: Die KI zählt jeden einzelnen Baumstamm, berechnet den Durchmesser nach RVR (Rahmenvereinbarung für den Rohholzhandel), ermittelt das Festmeter-Volumen und markiert Borkenkäfer-Frasslöcher mit rotem Punkt.',
    conceptEn: 'Stand 5 meters back and photograph a stacked timber log pile at the forest edge: AI segments every single log cross-section, calculates diameter distribution and solid cubic volume (Festmeter per timber trade standards), and flags bark beetle boreholes with red dots.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'Arbeitsgemeinschaft Deutscher Waldbesitzerverbände (AGDW) · Bund Deutscher Forstleute (BDF) · Schutzgemeinschaft Deutscher Wald',
    recipientEn: 'Forest Stewards Guild · Small Woodland Owners Associations · Community Forestry Alliances',
    sourceType: 'Civic & Ecology',
    sourceDe: 'Circular Ellipse Mask-RCNN on Timber Cross-Sections + Forestry Log Standard (RVR) Volume Calibration',
    sourceEn: 'Edge Vision Timber Segmentation + Forestry Cubic Scaling Standards',
    evidenceDe: 'Über 2 Millionen Kleinwaldbesitzer und Forstwirte bewirtschaften private Wälder. Beim Holzverkauf an Großsägewerke werden Polter oft ungenau geschätzt — Kleinwaldbesitzern entgehen dadurch regelmäßig hunderte Euro pro Holzfuhre.',
    evidenceEn: 'Millions of family woodland owners and forestry workers harvest timber. When selling logs to massive commercial sawmills, manual volumetric estimations frequently undercount volume by 8-12%, depriving smallholders of fair compensation.',
    reviewDate: '10/2026',
    problemDe: 'Wer mit Maßband und Kluppe bei Regen und Schnee im Schlamm hunderte Baumstämme einzeln vermessen muss, verliert Stunden und riskiert Stürze an rutschigen Hängen.',
    problemEn: 'Forest workers measuring hundreds of muddy logs by hand with calipers in freezing rain risk slips and falls while wasting entire days on routine tallying.',
    workerPersona: {
      name: 'Johann Eder (63)',
      role: 'Waldbauer & Familienforstbesitzer (5 Hektar Mischwald)',
      location: 'Landkreis Goslar, Oberharz, Niedersachsen',
      quoteDe: 'Nach den Dürresommern frisst der Borkenkäfer alles kahl. Wenn ich das Schadholz schlage, muss es schnell aus dem Wald, bevor die Käfer ausschwärmen. Beim Großsägewerk ziehen sie mir dann 15% ab mit der Begründung: „Schätzung hat Übermaß ergeben". Bei 60 Festmetern fehlen mir 800 Euro.',
      quoteEn: 'After drought summers, bark beetles devour whole hillsides. When I fell damaged spruce, it must leave the forest fast before beetles swarm. At the industrial sawmill, they unilaterally deduct 15% claiming "rough estimate variance." On a single truckload, I lose €800.',
      storyDe: 'Johann pflegt das kleine Waldstück, das sein Großvater pflanzte. Um Käferholz rechtzeitig zu verkaufen, muss jeder Stamm einzeln mit der Kluppe vermessen werden. Bei Schneeregen und steilen Hängen ist das lebensgefährlich. Großsägewerke nutzen ihre Marktmacht schamlos aus, wenn Kleinbauern keine objektiven Festmeter-Nachweise vorlegen können.',
      storyEn: 'Johann tends the small family woodland planted by his grandfather. In freezing rain on steep Harz slopes, manually measuring hundreds of logs with calipers is exhausting and dangerous. Giant sawmills exploit their leverage when smallholders lack objective, audited volume certificates.'
    },
    realRecipientsList: [
      {
        org: 'AGDW – Die Waldeigentümer (Arbeitsgemeinschaft Deutscher Waldbesitzerverbände e.V.)',
        person: 'Dr. Irene Seling (Hauptgeschäftsführerin) / Prof. Dr. Andreas Bitter (Präsident)',
        email: 'kontakt@waldeigentuemer.de',
        location: 'Reinhardtstraße 18A, 10117 Berlin',
        roleDe: 'Bundesverband von über 2 Millionen privaten und kommunalen Waldbesitzern in Deutschland.',
        roleEn: 'National federation representing 2 million family and community woodland owners.',
        url: 'https://www.waldeigentuemer.de'
      },
      {
        org: 'Bund Deutscher Forstleute (BDF)',
        person: 'Ulrich Doherty (Bundesvorsitzender)',
        email: 'bundesgeschaeftsstelle@bdf-online.de',
        location: 'Lennéstraße 12, 10785 Berlin',
        roleDe: 'Gewerkschaft und Berufsverband der Förster und Forstarbeiter.',
        roleEn: 'Professional association and union of foresters and woodland managers.',
        url: 'https://www.bdf-online.de'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Geometrische Kreiserkennung (Hough-Transformation) scheiterte an ovalen Baumstämmen, Schlamm, Moos und Moosflechten auf den Schnittflächen.',
      beforeAiEn: 'Impossible before AI: Classic Hough circle detection failed on oblong tree trunks, bark tears, sawdust, and forest shadows.',
      nowEasyDe: 'Heute kinderleicht: Ein Foto aus 5 Metern Entfernung reicht. Neuronale Netze segmentieren jeden Querschnitt, berechnen das Festmeter-Volumen nach Handelsnorm RVR und markieren Käferbohrlöcher rot.',
      nowEasyEn: 'Effortless today: One photo from 5 meters back suffices. Neural segmentation delineates every log face, calculates solid cubic meters to official RVR trade standards, and flags beetle infestation holes.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für Waldbauern: Freie optische Holzpolter-Vermessung („PolterMaß", CC0)',
      subjectEn: 'Gift for family foresters: Free optical log pile measurement tool ("PolterMaß")',
      bodyDe: `Sehr geehrte Frau Dr. Seling, sehr geehrte Damen und Herren bei den Waldeigentümern (AGDW),

wir schenken allen Waldbauern und Forstwirten ein freies Werkzeug unter CC0 Public Domain: „PolterMaß".

Das Problem:
Kleinwaldbesitzer wie Johann (63) verlieren beim Holzverkauf regelmäßig hunderte Euro, weil Großsägewerke das Holzvolumen ungenau zu ihren Gunsten schätzen. Das manuelle Vermessen mit der Kluppe bei Schlamm und Schnee ist stundenlange Plackerei.

Die Lösung:
Ein Foto des Holzstapels am Waldweg genügt: Die KI zählt alle Stämme, berechnet den Mittendurchmesser und das Festmeter-Volumen nach RVR und erzeugt ein manipulationssicheres PDF-Aufmaß für die Abrechnung.

Frei für alle Waldbauern und Forstbetriebsgemeinschaften.

Mit forstlichen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders of the woodland owners association,

We gift you "PolterMaß" (CC0), a free optical volume calculator allowing small woodland owners to photograph stacked logs at the forest edge and generate fair, certified trade measurements in seconds.`
    },
    whyNowDe: [
      'Vor 2024 unmöglich: Rinde, Sägemehl, Feuchtigkeit und unrunde Oval-Stämme täuschten klassische Kreis-Erkennungs-Algorithmen (Hough-Transformation).',
      'Heute möglich: Neuronale Segmentierungsnetze erkennen unregelmäßige Stammkonturen und Borkenkäfer-Bohrmehl selbst bei Waldschatten und nasser Rinde.',
      'Walderhalt: Hilft Kleinwaldbesitzern bei der schnellen Sanierung von Käferbäumen zur Rettung der Mischwälder.'
    ],
    whyNowEn: [
      'Impossible before AI: Irregular bark shapes, damp sawdust, and heavy forest shadows consistently broke classical geometric circle-detection filters.',
      'Now possible: Deep visual models generalize over jagged oval bark contours and identify fresh beetle frass even on damp shaded wood surfaces.',
      'Forest Health: Accelerates timely removal of pest-infested timber to safeguard recovering multi-species temperate forests.'
    ],
    firstStepTicketDe: 'Foto eines Holzpolters (mindestens 20 Stämme) → Automatische Markierung der Stamm-Mittelpunkte + Schätzung des Gesamt-Festmeters',
    firstStepTicketEn: 'Snapshot of timber pile (min 20 logs) → Segmented centroids of all tree trunks with estimated solid cubic volume',
    firstStepCriteriaDe: 'Erkennt mindestens 95% aller sichtbaren Stammquerschnitte auf Standard-Testfotos.',
    firstStepCriteriaEn: 'Identifies at least 95% of visible log faces on standardized outdoor forestry test photos.',
    tags: ['Echte Arbeit', 'Forstwirtschaft', 'Wald', 'Holz', 'Ökologie', 'Borkenkäfer']
  },
  {
    id: 'ai-plumber-valve-archaeologist',
    title: 'VentilFinder: Vintage Plumbing Cartridge & Flush Valve Identifier for Repair Plumbers',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Makrofoto des verkalkten, 40 Jahre alten Toilettenspülkastens oder Heizungsventils ohne Typenschild: Die KI identifiziert Hersteller, Baujahr und Gewindesteigung aus historischen Katalogen und nennt die 6€-Ersatzdichtung, statt für 1.200 € die Wand aufzureißen.',
    conceptEn: 'Macro photo of a corroded, 40-year-old unbranded toilet flush valve or radiator cartridge: AI identifies original manufacturer, production decade, and thread pitch from historical archives, locating the $6 replacement seal instead of demolishing the bathroom wall for $1,500.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'Zentralverband Sanitär Heizung Klima (ZVSHK) · Handwerkskammern · Bund der Energieverbraucher',
    recipientEn: 'Plumbing-Heating-Cooling Contractors Association (PHCC) · iFixit Infrastructure Guild',
    sourceType: 'Craft & Workshop',
    sourceDe: 'Fine-Grained Historical Brass Metrology Vision + Archive Sanitary Catalog Vector Index',
    sourceEn: 'Historical Mechanical Plumbing Metrology + Discontinued Component Knowledge Retrieval',
    evidenceDe: 'Millionen Altbauwohnungen haben Spülkästen und Ventile aus den 1970er- und 1980er-Jahren. Weil das Typenschild fehlt, raten Installateure oft zum Komplettabriss mit Fliesenschaden für 1.500 €, obwohl nur eine Standard-Profildichtung spröde ist.',
    evidenceEn: 'Countless working-class apartments feature plumbing installations from the 1970s and 80s. Because branding has eroded away, plumbers routinely tell tenants the entire in-wall unit must be ripped out, turning a $5 seal repair into a $1,500 ordeal.',
    reviewDate: '10/2026',
    problemDe: 'Kataloge historischer DDR-Armaturen, alter Grohe- oder Ideal-Standard-Spülkästen sind verstaubte Papierbände im Keller alter Meisterbetriebe. Junge Monteure haben darauf keinen Zugriff.',
    problemEn: 'Catalogs of obsolete sanitary valves are decaying paper binders locked in retired master plumbers’ basements. Young apprentices have zero access when standing in a customer\'s bathroom.',
    workerPersona: {
      name: 'Dennis Posch (31)',
      role: 'Kundendienstmonteur Sanitär- und Heizungstechnik',
      location: 'Dortmund-Hörde & Ruhrgebiet',
      quoteDe: 'Ich stehe in einer Mietwohnung vor einem eingemauerten Spülkasten aus den 80ern, der nachläuft. Der Vermieter sagt: „Reißen Sie das Bad auf!" Die alte Mieterin weint, weil sie die 1.500 € nicht hat. Ich weiß genau: Es ist nur ein poröser O-Ring für 4 Euro – aber welches Fabrikat ist das verdammt noch mal?',
      quoteEn: 'I am in a rental flat looking at an in-wall toilet cistern from 1984 leaking constantly. The landlord says: "Smash the tile wall and replace the whole thing!" The 78-year-old pensioner cries because she can’t afford €1,500. I know it’s just a €4 rubber washer—but who manufactured this valve 40 years ago?',
      storyDe: 'Dennis will reparieren statt wegwerfen. Doch die historischen Kataloge alter Hersteller (Dal, Sanit, Grohe, Ideal Standard, DDR-Kombinate) existieren nur noch in alten Ordnern im Meisterbüro. Ohne Typenschild ist die Suche wie die Nadel im Heuhaufen. Aus Zeitnot greifen viele Betriebe zum Abbruchhammer.',
      storyEn: 'Dennis wants to fix fixtures rather than trash them. But catalogs from discontinued sanitary brands exist only as yellowed binders in retired plumbers\' garages. Without a visible brand logo, identifying the seal is impossible during a 30-minute repair call.'
    },
    realRecipientsList: [
      {
        org: 'Zentralverband Sanitär Heizung Klima (ZVSHK)',
        person: 'Helmut Bramann (Hauptgeschäftsführer)',
        email: 'info@zvshk.de',
        location: 'Rathausallee 6, 53757 Sankt Augustin',
        roleDe: 'Spitzenverband des deutschen SHK-Handwerks (über 48.000 Betriebe).',
        roleEn: 'National federation representing 48,000 plumbing and heating contractor businesses.',
        url: 'https://www.zvshk.de'
      },
      {
        org: 'Bund der Energieverbraucher e.V.',
        person: 'Vorstand Energieverbraucherschutz',
        email: 'info@energieverbraucher.de',
        location: 'Unkel bei Bonn',
        roleDe: 'Verbraucherschutzverband für bezahlbare Heizungs- und Haustechnik.',
        roleEn: 'Consumer advocacy organization promoting affordable home repair and repair rights.',
        url: 'https://www.energieverbraucher.de'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Verkalkte Messingteile und vergilbter Kunststoff sehen für klassische Bildsuche alle gleich aus; Reflexionen und Kalkablagerungen machten Mustererkennung zunichte.',
      beforeAiEn: 'Impossible before AI: Limescale-encrusted brass and yellowed plastics confused reverse image search; optical glare defeated template matching.',
      nowEasyDe: 'Heute kinderleicht: Ein Makrofoto neben einer Münze genügt: Das multimodale Modell gleicht die geometrischen Abstände, Gewindesteigungen und Nut-Positionen mit historischen Katalogen ab und nennt die exakte 5€-Nachbaudichtung.',
      nowEasyEn: 'Effortless today: A close-up snapshot next to a coin is all that’s needed: multimodal AI correlates geometric groove proportions against vintage archive catalogs, identifying the €5 replacement seal in seconds.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für das SHK-Handwerk: Visueller Ersatzteil-Finder für alte Spülkästen („VentilFinder", CC0)',
      subjectEn: 'Gift for repair plumbers: Visual vintage valve identifier ("VentilFinder")',
      bodyDe: `Sehr geehrter Herr Bramann, sehr geehrte Damen und Herren im ZVSHK,

wir übergeben Ihnen heute ein kostenfreies Werkzeug unter CC0 Public Domain: den „VentilFinder".

Die alltägliche Herausforderung:
Kundendienstmonteure wie Dennis (31) stehen in Altbauten vor undichten, eingemauerten Spülkästen oder Heizungsventilen ohne Typenschild. Statt für 1.500 € Fliesen und Wand aufzureißen, reicht meist eine 5€-Profildichtung – wenn man den Typ kennt.

Die Lösung:
Foto des ausgebauten Ventils mit Münze als Maßstab: Die KI identifiziert Hersteller, Baureihe und die Teilenummer der passenden Ersatzdichtung.

Ein wertvoller Beitrag für Kreislaufwirtschaft und Reparierbarkeit im Handwerk.

Mit handwerklichen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders of the plumbing and HVAC federation,

We present "VentilFinder" (CC0), a free visual archive search tool helping repair plumbers identify 40-year-old unmarked flush valves and heating cartridges from a single phone photo, finding the €5 replacement seal instead of demolishing bathroom walls.`
    },
    whyNowDe: [
      'Vor 2024 unmöglich: Messingteile sehen nach 30 Jahren unter Kalk und Grünspan alle ähnlich aus. Statische Bildsuche scheiterte an Spiegelungen und Kalkkrusten.',
      'Heute möglich: Multimodale Netze erkennen geometrische Proportionen, Nut-Tiefen und Gewindegänge unabhängig von Oberflächenkorrosion.',
      'Kreislaufwirtschaft: Verhindert unnötige Bauschuttberge und schont das Konto von Mietern und Eigentümern.'
    ],
    whyNowEn: [
      'Impossible before AI: Corroded brass fixtures look almost identical under decades of limescale. Reverse image search failed on shiny, patinated surfaces.',
      'Now possible: Multimodal vision models reason over geometric proportions, groove spacings, and thread pitches regardless of surface oxidation.',
      'Circular Economy: Prevents massive landfill waste and saves cash-strapped families from crushing unexpected renovation bills.'
    ],
    firstStepTicketDe: 'Foto des ausgebauten Ventil-Einsatzes mit danebengelegter Münze → Trefferliste mit 3 wahrscheinlichsten Modellen und Teilenummern',
    firstStepTicketEn: 'Photo of removed valve cartridge next to a reference coin → Top 3 candidate models with historical part numbers and modern seal matches',
    firstStepCriteriaDe: 'Identifiziert 8 von 10 historischen Standard-Spülkastenventilen korrekt aus einem Benchmark historischer Modelle.',
    firstStepCriteriaEn: 'Correctly matches 8 of 10 classic discontinued cistern valves against an archive benchmark collection.',
    tags: ['Echte Arbeit', 'Handwerk', 'Sanitär', 'Reparatur', 'Kreislaufwirtschaft', 'Klempner']
  },
  {
    id: 'ai-elderly-care-sis-guardian',
    title: 'PflegeSprachWächter: MDK-konforme SIS-Sprachdoku & Dehydrations-Radar für die Altenpflege',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: '15 Sekunden flüstern beim Händewaschen nach dem Hausbesuch: Die KI filtert aus kurzen Sprachmemos alle pflegerelevanten Vital- und Verhaltensdaten, gleicht Trinkmengen gegen Dehydrationsrisiken ab und formuliert automatisch MDK-konforme Berichte nach dem SIS-Standard (Strukturierte Informationssammlung), ohne dass die Pflegekraft abends 90 Minuten Überstunden vor dem PC sitzen muss.',
    conceptEn: 'A 15-second whispered debrief while washing hands after a home visit: AI distills vital care facts and hydration levels from messy speech, flags acute dehydration or delirium risks, and auto-formats compliant reports under the Structured Information Collection (SIS) framework, saving home caregivers 90 minutes of daily unpaid evening paperwork.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'bpa (Bundesverband privater Anbieter sozialer Dienste) · Diakonie Deutschland · Deutscher Caritasverband',
    recipientEn: 'National Association for Home Care & Hospice (USA) · European Association of Homes and Services for the Ageing (EAHSA)',
    sourceType: 'Health & Care',
    sourceDe: 'Ambient Clinical Speech Recognition + SIS Nursing Standard Ontologies + Polypharmacy Radar',
    sourceEn: 'Voice-to-SIS Clinical Documentation + Dehydration & Fall Liability Guard',
    evidenceDe: 'Über 700.000 Altenpflegerinnen in Deutschland betreuen über 4 Millionen Pflegebedürftige. Durch rigide Dokumentationsvorschriften des MDK verbringen Pflegende bis zu 35% ihrer bezahlten Arbeitszeit mit dem Ausfüllen von Formularen, statt den oft einsamen Senioren menschliche Zuwendung zu schenken.',
    evidenceEn: 'Over 700,000 geriatric nurses and home aides in Germany care for over 4 million elderly citizens. Due to rigorous auditing rules, caregivers spend up to 35% of their working shift clicking dropdown checkboxes on clunky tablets rather than providing human comfort.',
    reviewDate: '10/2026',
    problemDe: 'Nach einem 12-Minuten-Besuch muss die Pflegerin 30 Pflichtfelder ausfüllen. Verweigert ein demenzkranker Senior die Trinkmenge oder Schmerztablette, droht der Pflegerin bei unvollständiger Dokumentation persönliche Haftung. Viele Pflegende tippen abends zuhause unbezahlt Berichte ab.',
    problemEn: 'After a rushed 12-minute home visit, caregivers must fill out 30 mandatory checkboxes. If a patient with dementia refuses water or medication, missing documentation creates severe legal liability for the nurse. Thousands of caregivers spend their evenings typing reports off the clock.',
    workerPersona: {
      name: 'Renate Gruber (54)',
      role: 'Examinierte Altenpflegerin im ambulanten Pflegedienst',
      location: 'Diakoniestation Nürnberg-Nord, Bayern',
      quoteDe: 'Ich habe diesen Beruf gelernt, um Menschen die Hand zu halten, wenn sie Angst haben – nicht, um auf einem billigen Tablet 40 Kästchen anzukreuzen, während Herr Meier traurig am Tisch sitzt.',
      quoteEn: 'I entered elderly care to hold people’s hands when they are afraid—not to check 40 boxes on a cheap tablet while Mr. Meier sits lonely at his kitchen table.',
      storyDe: 'Renate betreut täglich 16 ältere Menschen im Stadtgebiet Nürnberg. Frau Lehmann (87) lebt allein und trinkt an heißen Sommertagen oft weniger als 400 Milliliter Wasser. Renate muss bei jedem Besuch Blutdruck, Trinkmenge, Medikamentengabe und Hautzustand dokumentieren. Früher saß Renate nach ihrer 8-Stunden-Schicht noch jeden Abend 70 bis 90 Minuten am Küchentisch, um handschriftliche Zettel in das praxiseigene Softwareprogramm zu übertragen. Zeit für eigene Erholung blieb kaum.',
      storyEn: 'Renate visits 16 homebound seniors every single day in Nuremberg. Mrs. Lehmann (87) lives alone and barely drinks 400ml of water during hot summer heatwaves. Renate must record blood pressure, fluid intake, medication compliance, and skin integrity at every stop. She used to spend 70 to 90 unpaid minutes at her own kitchen table every night transcribing scribbled notes into legacy clinic software, leaving her completely drained.'
    },
    realRecipientsList: [
      {
        org: 'bpa – Bundesverband privater Anbieter sozialer Dienste e.V.',
        person: 'Herbert Mauel & Bernd Tews (Geschäftsführung)',
        email: 'bundesgeschaeftsstelle@bpa.de',
        location: 'Friedrichstraße 148, 10117 Berlin',
        roleDe: 'Größte Interessenvertretung privater Pflegedienste und Pflegeheime in Deutschland (über 13.000 Mitgliedsbetriebe).',
        roleEn: 'Largest federation of private eldercare services and nursing home providers in Germany (over 13,000 facilities).',
        url: 'https://www.bpa.de'
      },
      {
        org: 'Diakonie Deutschland – Evangelisches Werk für Diakonie und Entwicklung e.V.',
        person: 'Dr. Jens-Peter Kruse (Leiter Zentrum Gesundheit, Rehabilitation und Pflege)',
        email: 'diakonie@diakonie.de',
        location: 'Caroline-Michaelis-Straße 1, 10115 Berlin',
        roleDe: 'Wohlfahrtsverband der evangelischen Kirche mit zehntausenden ambulanten Pflegediensten.',
        roleEn: 'Major national charitable foundation running thousands of non-profit community outpatient care stations.',
        url: 'https://www.diakonie.de'
      },
      {
        org: 'Deutscher Caritasverband e.V. – Altenhilfe und Pflege',
        person: 'Eva Maria Welskop-Deffaa (Präsidentin)',
        email: 'info@caritas.de',
        location: 'Karlstraße 40, 79104 Freiburg i. Br.',
        roleDe: 'Dachverband der katholischen Caritas-Sozialstationen und Altenhilfeeinrichtungen.',
        roleEn: 'Catholic charity confederation supporting over 3,000 nursing care facilities and home health teams.',
        url: 'https://www.caritas.de'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Starre Tablet-Formulare mit Pflicht-Drop-Downs; automatisierte Spracherkennung scheiterte an Dialekten, leisen Nebengeräuschen in Wohnungen und medizinischen Fachbegriffen.',
      beforeAiEn: 'Impossible before AI: Clunky tablet interfaces with nested menus; speech recognition crashed on thick regional dialects, household background noise, and technical pharmacological terms.',
      nowEasyDe: 'Heute kinderleicht: Whisper- und Gemini-basierte Sprachmodelle verstehen selbst genuschelte Notizen im Treppenhaus („Frau Lehmann 300ml Fencheltee getrunken, Schwindel bei Aufstehen, Beine leicht geschwollen"), mappen die Aussagen auf die 6 SIS-Themenfelder und generieren rechtssichere Pflegedokumentation.',
      nowEasyEn: 'Effortless today: Modern speech models transcribe whispered stairwell voice memos ("Mrs. Lehmann drank 300ml fennel tea, felt dizzy standing up, mild ankle edema"), correctly mapping facts into official SIS healthcare categories in under 4 seconds.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für die Altenpflege: Sprachgestützter MDK-Dokumentations-Assistent („PflegeSprachWächter", CC0)',
      subjectEn: 'Gift for geriatric home carers: Voice-to-SIS nursing documentation assistant ("PflegeSprachWächter", CC0)',
      bodyDe: `Sehr geehrte Damen und Herren der Pflegeverbände,

wir übergeben Ihnen heute ein freies, lizenzkostenfreies Werkzeug unter CC0 Public Domain: den „PflegeSprachWächter".

Die Realität in der ambulanten Pflege:
Pflegekräfte wie Renate (54) müssen nach jedem 12-Minuten-Besuch dutzende Felder dokumentieren. Verweigert ein Senior Flüssigkeit oder Tabletten, entsteht ohne minutengenaue Notiz ein enormes Haftungsrisiko. Die Folge sind unbezahlte Überstunden am Feierabend.

Die Lösung:
Ein 15-sekündiges Sprachmemo beim Verlassen der Wohnung genügt. Die KI ordnet die Beobachtungen automatisch den offiziellen SIS-Feldern (Strukturierte Informationssammlung) zu, warnt vor akuter Dehydration und formuliert revisionssichere Pflegeberichte.

Kein Abo, kein Profitinteresse – als offenes Geschenk für das Wohl unserer Pflegekräfte.

Mit herzlichen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders of eldercare nursing associations,

We are gifting you "PflegeSprachWächter" (CC0), an open-source voice-driven documentation assistant that turns a 15-second spoken summary into fully compliant SIS nursing records, eliminating 90 minutes of unpaid evening paperwork for home care aides.`
    },
    whyNowDe: [
      'Entlastung gegen den Pflegenotstand: Bringt Pflegekräften täglich bis zu 1,5 Stunden Lebenszeit zurück.',
      'Senioren-Sicherheit: Automatisches Dehydrations-Radar schlägt Alarm, wenn die aggregierte 48h-Trinkmenge unter 1.200 ml sinkt.',
      'Rechtssicherheit: Lückenlose Dokumentation schützt Pflegekräfte vor ungerechtfertigten Haftungsvorwürfen bei Stürzen.'
    ],
    whyNowEn: [
      'Relief in care shortage: Gives nurses back up to 1.5 hours of daily personal rest time.',
      'Senior health safety: Automated hydration warning alerts supervisor when 48-hour fluid intake drops below safe clinical limits.',
      'Legal defense: Continuous voice logs protect nursing aides from unfair malpractice liability in case of unexpected senior falls.'
    ],
    firstStepTicketDe: '15-Sekunden Sprachmemo aufnehmen → MDK-konformer SIS-Eintrag mit Vitaldaten-Extraktion und Dehydrationsampel',
    firstStepTicketEn: 'Record 15-second voice memo → Compliant SIS entry with extracted vital signs and hydration indicator',
    firstStepCriteriaDe: 'Extrahiert Trinkmenge, Medikamentenstatus und Vitalzeichen aus 10 gesprochenen Beispielsätzen mit >95% Genauigkeit.',
    firstStepCriteriaEn: 'Extracts hydration volume, medication compliance, and symptoms from 10 messy spoken samples with >95% accuracy.',
    tags: ['Echte Arbeit', 'Pflege', 'Gesundheit', 'Altenpflege', 'Senioren', 'Entlastung']
  },
  {
    id: 'ai-roofer-wind-uplift-shield',
    title: 'SturmklammerWächter: Windsog- & Befestigungs-Rechner für Dachdecker nach DIN EN 1991-1-4',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Auf dem 45°-Dach bei Windböen: Ein Foto der Dachneigung und Ziegelverlegung genügt: Die KI ermittelt per GPS die Windzone (1 bis 4) und Geländekategorie nach DIN EN 1991-1-4 / Fachregel ZVDH und zeigt dem Dachdecker in riesigen, kontrastreichen Ziffern die exakte Klammerdichte pro Quadratmeter für Trauf-, Rand- und Eckbereiche an.',
    conceptEn: 'Perched on a 45-degree roof in howling wind: Snap a photo of the roof pitch and tile battening: AI queries GPS wind zone maps (Zones 1-4) and terrain elevation under DIN EN 1991-1-4, displaying exact storm clip fastener densities per square meter in giant high-contrast numerals for eaves, corners, and ridge zones.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'ZVDH (Zentralverband des Deutschen Dachdeckerhandwerks) · IG BAU Baugewerbe · BG BAU',
    recipientEn: 'National Roofing Contractors Association (NRCA) · International Federation for the Roofing Trade (IFD)',
    sourceType: 'Craft & Safety',
    sourceDe: 'Wind Uplift Physics Engine + DIN EN 1991-1-4 + ZVDH Fachregeln Visual Batten Pitch Analyzer',
    sourceEn: 'Computer Vision Roof Slope Analyzer + Wind Uplift Fastener Engineering Standard',
    evidenceDe: 'Jährlich decken Herbst- und Winterstürme in Mitteleuropa zehntausende Dächer ab. Bei Schadensfällen verweigern Gebäudeversicherer die Regulierung, wenn Sturmklammern nach den 2011 verschärften Fachregeln fehlen. Dachdecker haften persönlich für fehlerhafte Windsog-Befestigungen.',
    evidenceEn: 'Every autumn storm blows thousands of roof tiles onto streets and parked cars. When property damage occurs, insurers routinely deny claims if mandatory storm clips were under-fastened according to strict building codes. Small roofing contractors face catastrophic personal liability.',
    reviewDate: '10/2026',
    problemDe: 'Die Berechnung von Windsogzonen umfasst 400 Seiten technische Tabellen mit Windstaudruck, Gebäudehöhe und Randabständen. Auf der Baustelle auf dem Gerüst bei Nieselregen hat niemand einen Laptop dabei, um statische Berechnungen durchzuführen.',
    problemEn: 'Calculating wind uplift involves 400 pages of structural engineering tables spanning aerodynamic stagnation pressure, ridge geometry, and corner margins. On a cold scaffold in drizzle, roofers cannot consult engineering software.',
    workerPersona: {
      name: 'Torsten Brauer (41)',
      role: 'Dachdeckermeister und Inhaber eines 5-Mann-Betriebs',
      location: 'Annaberg-Buchholz, Erzgebirge, Sachsen (Windzone 3, 620m ü. NHN)',
      quoteDe: 'Wenn ich im Oktober bei 4 Grad auf der Latte stehe und dicke Arbeitshandschuhe anhabe, brauche ich keinen Taschenrechner mit Sinus-Funktionen. Ich muss wissen: Jede zweite oder jede Ziegel klammern?',
      quoteEn: 'When I am balancing on roof battens in 4°C October winds wearing thick gloves, I don’t need scientific trigonometry. I just need to know: Clip every second tile or every single one?',
      storyDe: 'Torsten führt den Familienbetrieb in dritter Generation. Im Erzgebirge herrschen durch Höhenlage und Steilhänge extreme Windlasten. Nach einem Sturm deckte eine Windböe 30 Quadratmeter Ziegel an einem Walmdach ab, das Torsten vor zwei Jahren saniert hatte. Der Gutachter der Versicherung verlangte das statische Befestigungsprotokoll nach DIN EN 1991-1-4. Weil Torsten auf der Baustelle nach Erfahrungswerten statt nach formalem Tabellennachweis geklammert hatte, drohte ihm ein Regress von 14.000 €.',
      storyEn: 'Torsten runs a 3rd-generation roofing company. In the ore mountains, high altitude and steep ridges create violent gusts. Last winter, a gale ripped 30 m² of tiles off a hipped roof Torsten renovated two years ago. The insurance auditor demanded structural fastening documentation under DIN EN 1991-1-4. Because Torsten relied on practical rules of thumb rather than a timestamped structural table, he faced a devastating €14,000 liability claim.'
    },
    realRecipientsList: [
      {
        org: 'ZVDH – Zentralverband des Deutschen Dachdeckerhandwerks e.V.',
        person: 'Dirk Bollwerk (Präsident) & Ulrich Marx (Hauptgeschäftsführer)',
        email: 'zvdh@dachdecker.de',
        location: 'Fritz-Reuter-Straße 1, 50968 Köln',
        roleDe: 'Spitzenverband des deutschen Dachdeckerhandwerks; Verfasser der maßgeblichen Fachregeln für Dachdeckungen.',
        roleEn: 'National roofing trade association in Germany; authors of the authoritative roofing technical standards.',
        url: 'https://www.dachdecker.de'
      },
      {
        org: 'IG BAU – Industriegewerkschaft Bauen-Agrar-Umwelt (Fachgruppe Baugewerbe & Dach)',
        person: 'Robert Feiger (Bundesvorsitzender)',
        email: 'baugewerbe@igbau.de',
        location: 'Olof-Palme-Straße 19, 60439 Frankfurt am Main',
        roleDe: 'Gewerkschaftliche Vertretung der Dachdeckergesellen und Bauhandwerker für Arbeitssicherheit.',
        roleEn: 'Trade union representing roofer journeymen and construction workers on workplace safety.',
        url: 'https://www.igbau.de'
      },
      {
        org: 'BG BAU – Berufsgenossenschaft der Bauwirtschaft',
        person: 'Abteilung Prävention und Absturzsicherheit',
        email: 'info@bgbau.de',
        location: 'Hildegardstraße 29/30, 10715 Berlin',
        roleDe: 'Gesetzliche Unfallversicherung für das Baugewerbe.',
        roleEn: 'Statutory occupational safety insurer for the construction and roofing sectors.',
        url: 'https://www.bgbau.de'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Windsog-Software war teure Desktop-Spezialsoftware für Statik-Büros; Dachdecker auf der Baustelle hatten keinen Zugriff auf georeferenzierte Windzonen und Ziegel-Klammertabellen.',
      beforeAiEn: 'Impossible before AI: Wind uplift programs were complex desktop software built for structural engineering firms; workers on roofs had zero access to georeferenced wind load maps.',
      nowEasyDe: 'Heute kinderleicht: Smartphone-Kamera erfasst Ziegelprofil und Neigungswinkel; GPS liefert Geländehöhe und Windzone; das Modell berechnet in 2 Sekunden die exakte Klammervorgabe (z.B. „Randbereich: 1:1 klammern, Mittelbereich: 1:3 klammern") und erstellt ein PDF-Abnahmeprotokoll.',
      nowEasyEn: 'Effortless today: Smartphone camera instantly detects tile geometry and roof angle; GPS retrieves elevation and wind zone; AI outputs exact clip pattern in 2 seconds and stamps a PDF verification certificate.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für das Dachdeckerhandwerk: Mobiler Windsog- & Sturmklammer-Rechner („SturmklammerWächter", CC0)',
      subjectEn: 'Gift for roofing craftsmen: Mobile wind uplift and storm clip calculator ("SturmklammerWächter", CC0)',
      bodyDe: `Sehr geehrter Herr Bollwerk, sehr geehrter Herr Marx,

wir übergeben dem deutschen Dachdeckerhandwerk ein offenes Werkzeug unter CC0 Public Domain: den „SturmklammerWächter".

Das Problem auf dem Dach:
Handwerksmeister wie Torsten (41) stehen bei Wind und Wetter auf der Baustelle. Die verschärften ZVDH-Fachregeln zur Windsogsicherung fordern komplizierte Berechnungen nach DIN EN 1991-1-4. Bei Sturmschäden fordern Versicherungen lückenlose Nachweise – sonst droht dem Handwerker persönlicher Regress.

Die Lösung:
Ein schneller Kameraschwenk über das Dach bei eingeschaltetem GPS ermittelt Windzone, Höhe und Ziegelart. Die App nennt sofort die exakten Klammervorgaben für Traufe, First und Ortgang und erstellt mit einem Klick das rechtssichere Befestigungsprotokoll für Bauherrn und Versicherung.

Kostenfrei, werbefrei, für das Handwerk.

Mit kollegialen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders of the roofing contractors association,

We are gifting you "SturmklammerWächter" (CC0), a mobile tool that calculates wind uplift fastening and storm clip density on-site in 2 seconds, shielding roofers from insurance liability after major gales.`
    },
    whyNowDe: [
      'Haftungsschutz für Handwerker: Erzeugt rechtssichere Verlegeprotokolle zur Vorlage bei Gebäudeversicherern.',
      'Unfallprävention: Schnelle, klare Anweisungen verhindern langes Hantieren mit Papierunterlagen auf dem Steildach.',
      'Klimaresilienz: Schützt Städte und Wohngebiete vor herabstürzenden Dachziegeln bei zunehmenden Extremwettern.'
    ],
    whyNowEn: [
      'Liability shield: Generates bulletproof installation protocols for building insurers.',
      'Workplace safety: Instant guidance prevents hazardous paper-shuffling while balancing on steep roofs.',
      'Climate resilience: Fortifies urban neighborhoods against flying roof tiles during intense superstorms.'
    ],
    firstStepTicketDe: 'GPS-Standort + Foto der Ziegelreihe → Windzone + Klammerdichte für Ortgang, Traufe und Innenbereich',
    firstStepTicketEn: 'GPS coordinate + photo of roof battening → Wind zone + clip density for eaves, verge, and center',
    firstStepCriteriaDe: 'Gibt für 5 Teststandorte (Küste, Mittelgebirge, Stadt) die exakte ZVDH-Klammerquote fehlerfrei aus.',
    firstStepCriteriaEn: 'Outputs exact ZVDH storm clip ratio for 5 test locations across coastal, mountain, and urban zones with 100% accuracy.',
    tags: ['Echte Arbeit', 'Handwerk', 'Dachdecker', 'Baugewerbe', 'Sicherheit', 'Sturmschutz']
  },
  {
    id: 'ai-chimney-sweep-flue-gas-guard',
    title: 'BImSchVWächter: Abgas-Übersetzer, CO-Lebensretter & Heizungsversteher für Schornsteinfeger',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Ein Foto des Thermopapier-Ausdrucks der Abgasmessung genügt: Die KI liest verblasste Messwerte (CO, O2, Abgasverlust qA, Rußzahl, Lambda), warnt sofort in grellem Rot bei akuter Kohlenmonoxid-Vergiftungsgefahr (>500 ppm) und übersetzt das komplexe Immissionsschutzrecht (1. BImSchV / KÜO) in einen verständlichen Bürgerbrief, der Hausbesitzern genau vorrechnet, wie viele Liter Heizöl sie durch Brenner-Ruß verschwenden.',
    conceptEn: 'Snap a single photo of the thermal paper printout from the combustion analyzer: AI decodes faded test metrics (CO, O2, flue gas loss qA, soot number, excess air ratio lambda), triggers a bold red siren if carbon monoxide levels pose lethal poisoning risk (>500 ppm), and translates dense environmental emission codes (1. BImSchV) into an empathetic report showing homeowners exactly how much heating oil their fouled burner is wasting.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'ZIV (Zentralinnungsverband des Schornsteinfegerhandwerks) · Verbraucherzentrale Energieberatung · Deutsche Umwelthilfe',
    recipientEn: 'European Chimney Sweeps Federation (ESCHFOE) · Chimney Safety Institute of America (CSIA)',
    sourceType: 'Craft & Energy',
    sourceDe: 'Thermal Slip OCR + 1. BImSchV Legal Logic + Carbon Monoxide Poisoning Threshold Alarm',
    sourceEn: 'Thermal Printout Vision + Combustion Efficiency Thermodynamics + CO Safety Monitor',
    evidenceDe: 'Deutschlandweit prüfen über 7.500 Schornsteinfegerbetriebe jährlich rund 15 Millionen Feuerungsanlagen. Jedes Jahr sterben Menschen an unbemerktem CO-Austritt durch verstopfte Abgasrohre. Gleichzeitig führen bürokratische Mängelberichte zu erbitterten Streitigkeiten zwischen Handwerkern und verunsicherten Bürgern.',
    evidenceEn: 'Over 7,500 chimney sweep districts in Germany inspect 15 million heating systems annually. Silent carbon monoxide leaks kill dozens every winter due to blocked flues, while bureaucratic emission notices spark bitter disputes with confused homeowners.',
    reviewDate: '10/2026',
    problemDe: 'Die Prüfgeräte drucken auf winzigen Thermopapier-Streifen, die im feuchten Heizungskeller schnell verblassen. Die handwerklichen Messwerte (z.B. qA = 11,4%, CO = 840 ppm) versteht kein Laie. Schornsteinfeger müssen nach Feierabend unverständliche amtliche Bescheide tippen.',
    problemEn: 'Analyzers print on tiny, curly thermal receipts that quickly fade in damp boiler basements. Laypeople cannot interpret technical metrics like flue gas loss or ppm CO. Sweeps spend hours typing adversarial formal notices.',
    workerPersona: {
      name: 'Andreas Klee (46)',
      role: 'Bevollmächtigter Bezirksschornsteinfeger',
      location: 'Kehrbezirk Landkreis Goslar, Harz, Niedersachsen',
      quoteDe: 'Wenn der Brenner 1.000 ppm Kohlenmonoxid in den Keller bläst, ist das keine Formalie – das ist Lebensgefahr. Aber wenn ich den Leuten einen 4-seitigen Paragraphenbescheid schicke, halten sie mich für einen Abzocker statt für einen Beschützer.',
      quoteEn: 'When a cracked heat exchanger dumps 1,000 ppm CO into a basement, it’s not paperwork—it’s mortal danger. But when I send a dense legal citation, people think I am shaking them down rather than saving their lives.',
      storyDe: 'Andreas betreut 2.400 Haushalte im Westharz. Viele ältere Hauseigentümer heizen mit 25 Jahre alten Öl- und Pelletkesseln. Im Winter fand Andreas bei einer 78-jährigen Rentnerin einen verrußten Brenner mit lebensgefährlichen 1.200 ppm CO im Abgas. Andreas musste den Kessel stilllegen. Die Rentnerin brach in Tränen aus, weil sie dachte, sie müsse für 20.000 € eine neue Heizung kaufen. Hätte Andreas ihr sofort verständlich zeigen können, dass nur die Brenndüse für 40 € getauscht werden muss, wäre ihr die Panik erspart geblieben.',
      storyEn: 'Andreas oversees 2,400 households in the Harz mountains. Many elderly homeowners rely on 25-year-old oil boilers. Last winter, Andreas discovered a fouled burner emitting a lethal 1,200 ppm CO in the basement of a 78-year-old widow. He had to issue an emergency shutdown. The widow broke into tears believing she needed a €20,000 boiler replacement. Had Andreas had a simple visual report showing that replacing a €40 spray nozzle would solve the issue, her panic would have been avoided.'
    },
    realRecipientsList: [
      {
        org: 'ZIV – Zentralinnungsverband des Schornsteinfegerhandwerks (Bundesverband)',
        person: 'Alexis Gula (Präsident) & Julian Schwark (Vorstand Finanzen & Technik)',
        email: 'ziv@schornsteinfeger.de',
        location: 'Westerwaldstraße 6, 53757 Sankt Augustin',
        roleDe: 'Bundesweiter Spitzenverband des Schornsteinfegerhandwerks und oberste berufsständische Interessenvertretung.',
        roleEn: 'National federation representing all certified district chimney sweeps across Germany.',
        url: 'https://www.schornsteinfeger.de'
      },
      {
        org: 'Verbraucherzentrale Bundesverband e.V. – Team Energieberatung',
        person: 'Dr. Thomas Engelke (Leiter Team Energie und Bauen)',
        email: 'energieberatung@vzbv.de',
        location: 'Rudi-Dutschke-Straße 17, 10969 Berlin',
        roleDe: 'Unabhängige Verbraucherberatung zu Heizungseffizienz, Sanierung und Energieeinsparung.',
        roleEn: 'National consumer advocacy organization advising citizens on home heating efficiency and heating rights.',
        url: 'https://www.verbraucherzentrale-energieberatung.de'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Geknittertes Thermopapier mit schwachen Nadeldruck-Punkten konnte von Standard-OCR nicht entziffert werden; kein Werkzeug übersetzte thermische Verbrennungsphysik in beruhigende, bürgernahe Sprache.',
      beforeAiEn: 'Impossible before AI: Crumpled, faded thermal receipts defeated traditional optical character recognition; no tool could translate combustion thermodynamics into reassuring, empathetic layman text.',
      nowEasyDe: 'Heute kinderleicht: Ein Foto des Thermozettels mit dem Handy genügt: Das multimodale Modell liest alle Werte selbst bei schlechtem Kellerlicht einwandfrei aus, berechnet die exakte Heizölersparnis durch Reinigung und erstellt einen freundlichen Einseiter für den Kunden.',
      nowEasyEn: 'Effortless today: A single phone snapshot under dim basement bulb lighting decodes all combustion numbers instantly, computes annual fuel savings from burner cleaning, and prints a comforting 1-page summary.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für das Schornsteinfegerhandwerk: Abgas-Übersetzer & CO-Warnmelder („BImSchVWächter", CC0)',
      subjectEn: 'Gift for chimney sweeps: Combustion receipt translator & CO alarm ("BImSchVWächter", CC0)',
      bodyDe: `Sehr geehrter Herr Gula, sehr geehrte Damen und Herren im ZIV,

wir übergeben Ihnen heute ein offenes Werkzeug unter CC0 Public Domain: den „BImSchVWächter".

Die tägliche Herausforderung:
Schornsteinfeger wie Andreas (46) schützen Menschen vor CO-Vergiftungen und Bränden. Doch die Abgasmessgeräte drucken unverständliche Thermopapierzettel. Hauseigentümer empfinden Prüfberichte oft als bedrohliche Bürokratie.

Die Lösung:
Foto des Thermozettels: Die KI liest alle Werte (qA, CO, Lambda) aus, schlägt bei CO-Lebensgefahr (>500 ppm) sofort Alarm und erzeugt einen transparenten, bürgernahen Bericht. Dieser zeigt dem Kunden auf einen Cent genau, wie viel Heizöl er durch eine einfache Brennerwartung spart.

Aus Respekt vor dem Traditionshandwerk – als freies Gemeingut.

Mit herzlichen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders of the National Chimney Sweeps Federation,

We present "BImSchVWächter" (CC0), an open tool that turns faded thermal flue-gas receipts into clear, empathetic reports showing homeowners exact fuel savings while issuing instant alarms for lethal CO concentrations.`
    },
    whyNowDe: [
      'Lebensrettung: Erkennt tödliche CO-Konzentrationen im Abgas sekundenschnell und schlägt Alarm.',
      'Bürgernahe Aufklärung: Erklärt technischen Umweltschutz ohne Behördendeutsch und baut Misstrauen ab.',
      'Geldbeutel-Entlastung: Zeigt Mietern und Eigentümern, wie 1 mm Rußbelag 5% mehr Heizöl kostet.'
    ],
    whyNowEn: [
      'Life safety: Catches lethal carbon monoxide spikes in seconds before silent asphyxiation occurs.',
      'Empathy in regulation: Replaces hostile bureaucratic rejection letters with practical homeowner advice.',
      'Household savings: Demonstrates that 1mm of soot causes 5% higher fuel bills, encouraging timely maintenance.'
    ],
    firstStepTicketDe: 'Foto des Thermopapier-Prüfstreifens → CO-Gefahrencheck + Berechnung der jährlichen Brennstoffverschwendung in Euro',
    firstStepTicketEn: 'Photo of thermal combustion analyzer slip → CO hazard flag + yearly wasted fuel cost calculation',
    firstStepCriteriaDe: 'Liest verwackelte Thermopapierausdrucke von Testo und Wöhler mit über 95% Zeichengenauigkeit ein.',
    firstStepCriteriaEn: 'Parses wrinkled thermal printouts from Testo and Wöhler analyzers with >95% accuracy.',
    tags: ['Echte Arbeit', 'Handwerk', 'Schornsteinfeger', 'Energie', 'Sicherheit', 'CO-Schutz']
  },
  {
    id: 'ai-mechanic-obd-swarm-diagnostician',
    title: 'WerkstattSchwarm: Freie Fehlercode- & Symptom-Diagnose für unabhängige Kfz-Mechatroniker',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Mechaniker nimmt 5 Sekunden Motorgeräusch auf und tippt 2 bis 3 kryptische OBD-II-Fehlercodes ein (z.B. P0016 Kurbelwellen-Nockenwellen-Korrelation + P0300 Fehlzündungen): Die KI durchsucht 2 Millionen Fallberichte freier Werkstätten, gleicht Soll-Signalbilder von Hall-Sensoren ab und nennt mit 90% Wahrscheinlichkeit die tatsächliche Ursache (z.B. gelängte Steuerkette oder korrodierter Massekontakt), statt dass der Geselle für 1.200 € funktionierende Sensoren auf Verdacht tauscht.',
    conceptEn: 'A mechanic records 5 seconds of engine idle audio and enters 2 cryptic OBD-II fault codes (e.g. P0016 Camshaft Correlation + P0300 Random Misfire): AI cross-references 2 million verified technician case logs, sensor oscilloscope waveforms, and known service bulletins, pinpointing the true culprit (e.g. stretched timing chain vs corroded ground strap) in 15 seconds, preventing €1,200 in wasted parts-swapping.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'ZDK (Zentralverband Deutsches Kraftfahrzeuggewerbe) · IG Metall Handwerk · VDAT',
    recipientEn: 'Automotive Service Association (ASA) · International Federation of Automotive Engineering Societies (FISITA)',
    sourceType: 'Craft & Diagnostics',
    sourceDe: 'Acoustic Engine Harmonic FFT + OBD-II Graph Cross-Correlator + Crowdsourced TSB Synthesis',
    sourceEn: 'Acoustic Motor Spectral Analysis + Multi-Brand OBD Fault Matrix + Independent Repair Database',
    evidenceDe: 'In Deutschland gibt es über 18.000 freie Kfz-Werkstätten, die rund 50% aller Reparaturen durchführen. Weil Automobilkonzerne Diagnosedaten hinter astronomischen Lizenzgebühren (bis zu 15.000 €/Jahr je Marke) verstecken, stehen freie Mechatroniker bei modernen Fahrzeugen oft im Dunkeln.',
    evidenceEn: 'Over 18,000 independent auto repair shops in Germany handle half of all vehicle repairs. Because car conglomerates lock repair data behind proprietary paywalls costing up to €15,000 annually per brand, independent mechanics face huge hurdles diagnosing multi-brand electronic faults.',
    reviewDate: '10/2026',
    problemDe: 'Ein moderner Fehlercode wie „P0171 Gemisch zu mager" kann 25 verschiedene Ursachen haben: Luftmassenmesser, Falschluftschlauch, Tankentlüftungsventil oder defekte Lambdasonde. Ohne teuren OEM-Zugang tauschen freie Werkstätten oft Teile auf Verdacht – auf Kosten des verarmten Kunden.',
    problemEn: 'A generic code like "P0171 System Too Lean" can have 25 different causes ranging from a dirty MAF sensor to a cracked vacuum hose or sticky purge valve. Without OEM dealer subscriptions, mechanics swap expensive parts on guesswork.',
    workerPersona: {
      name: 'Goran Vukovic (39)',
      role: 'Freier Kfz-Mechatronikermeister und Werkstattinhaber',
      location: 'Freie Werkstatt Vukovic, Essen-Altenessen, Ruhrgebiet, NRW',
      quoteDe: 'Die Hersteller wollen uns freie Werkstätten aushungern. Wenn ein Kunde mit einem 12 Jahre alten Ford Focus kommt, kann der sich keine 200 Euro Stundenlohn in der Vertragswerkstatt leisten. Ich muss in 20 Minuten wissen, wo der Hund begraben liegt.',
      quoteEn: 'Automakers want to starve independent garages out of existence. When a customer brings in a 12-year-old Ford, they cannot afford €200/hr dealer rates. I need to pinpoint the real problem in 20 minutes.',
      storyDe: 'Goran betreibt eine freie 3-Bühnen-Werkstatt im Ruhrgebiet. Seine Kundschaft sind Handwerker, Pflegedienste und Familien, die auf ältere Gebrauchtwagen angewiesen sind. Letzte Woche kam ein Opel Astra mit Notlauf und Fehler P0340 (Nockenwellensensor). Gorans junger Geselle baute für 180 € einen neuen Sensor ein – der Fehler blieb. Nach 4 Stunden vergeblicher Fehlersuche stellte sich heraus, dass lediglich ein 2€-Masseband am Getriebe korrodiert war. Goran konnte dem Kunden die 4 Stunden Sucharbeit unmöglich berechnen und zahlte drauf.',
      storyEn: 'Goran runs a 3-lift garage in the Ruhr industrial valley. His clients are couriers, home nurses, and families driving 10-year-old cars. Last week an Opel entered limp mode with code P0340. His apprentice swapped the camshaft sensor for €180, but the fault remained. After 4 hours of tedious tracing, they found a corroded €2 ground strap. Goran could not in good conscience bill 4 diagnostic hours to a struggling family and absorbed the loss himself.'
    },
    realRecipientsList: [
      {
        org: 'ZDK – Zentralverband Deutsches Kraftfahrzeuggewerbe e.V.',
        person: 'Arne Joswig (Präsident) & Dr. Kurt-Christian Scheel (Hauptgeschäftsführer)',
        email: 'zdk@kfzgewerbe.de',
        location: 'Franz-Lohe-Straße 21, 53129 Bonn',
        roleDe: 'Dachverband des deutschen Kfz-Gewerbes mit über 36.000 Betrieben und 430.000 Beschäftigten.',
        roleEn: 'National federation of the automotive repair trade in Germany representing 36,000 businesses.',
        url: 'https://www.kfzgewerbe.de'
      },
      {
        org: 'IG Metall – Fachbereich Handwerk (Kfz-Handwerk)',
        person: 'Hans-Jürgen Urban (Geschäftsführendes Vorstandsmitglied)',
        email: 'handwerk@igmetall.de',
        location: 'Wilhelm-Leuschner-Straße 79, 60329 Frankfurt am Main',
        roleDe: 'Gewerkschaftliche Vertretung für Kfz-Mechatronikerinnen und Beschäftigte in Kfz-Betrieben.',
        roleEn: 'Trade union representing auto technicians and shop mechanics across Germany.',
        url: 'https://www.igmetall.de'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Fehlercodes waren isolierte Zahlen; Werkstatt-Foren waren voller 30-seitiger Threads ohne Lösung; kein System konnte Motor-Akustik und Fehlerspeichereinträge holistisch abgleichen.',
      beforeAiEn: 'Impossible before AI: Diagnostic codes were isolated numbers; automotive forums had 30-page dead-end threads; no system could correlate audio anomalies with multi-code error matrices.',
      nowEasyDe: 'Heute kinderleicht: KI analysiert die Fehlercode-Kombination zusammen mit Baujahr, Laufleistung und Motorsound, gleicht sie mit zehntausenden gelösten Praxisfällen ab und gibt dem Mechaniker eine priorisierte Prüfliste der wahrscheinlichsten Kabelbrüche und Schwachstellen.',
      nowEasyEn: 'Effortless today: AI analyzes multi-code combinations alongside vehicle mileage and audio timbre, cross-referencing thousands of verified repairs to generate a 3-step prioritized test list of root causes.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für das freie Kfz-Handwerk: Fehlerdiagnose-Assistent („WerkstattSchwarm", CC0)',
      subjectEn: 'Gift for independent mechanics: Diagnostic fault locator ("WerkstattSchwarm", CC0)',
      bodyDe: `Sehr geehrter Herr Joswig, sehr geehrte Damen und Herren im ZDK,

wir übergeben dem freien Kfz-Gewerbe ein offenes Werkzeug unter CC0 Public Domain: den „WerkstattSchwarm".

Die Herausforderung für freie Werkstätten:
Mechatroniker wie Goran (39) halten das Land mobil. Doch Automobilkonzerne schotten Reparaturdaten durch horrende Lizenzgebühren ab. Wenn kryptische Fehlercodes wie P0016 oder P0300 auftreten, müssen freie Werkstätten oft zeitraubend auf Verdacht suchen.

Die Lösung:
Eingabe der Fehlercodes und Fahrzeugdaten: Das Modell verknüpft Praxisfälle, Schwachstellenberichte und Signalbilder und nennt sofort die wahrscheinlichste Ursache (z.B. defektes Massekabel statt 1.200 € Steuerungstausch).

Ein Beitrag für das Recht auf Reparatur und bezahlbare Mobilität.

Mit handwerklichen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders of the German Automotive Trade Federation,

We present "WerkstattSchwarm" (CC0), an open-source diagnostic assistant empowering independent auto mechanics to pinpoint elusive multi-code faults in minutes without costly OEM subscriptions.`
    },
    whyNowDe: [
      'Recht auf Reparatur: Schützt freie Werkstätten vor der Monopolisierung der Reparaturdaten durch Autokonzerne.',
      'Geldbeutel-Schutz für Autofahrer: Verhindert unnötiges Tauschen teurer Bauteile bei einfachen Kabel- oder Schlauchdefekten.',
      'Ressourcenschonung: Verlängert die Lebensdauer von Gebrauchtwagen und verhindert vorzeitige Verschrottung.'
    ],
    whyNowEn: [
      'Right to repair: Defends independent garages against monopoly paywalls erected by auto manufacturers.',
      'Consumer protection: Stops speculative parts-swapping when the actual failure is a €2 vacuum hose or corroded wire.',
      'Sustainability: Extends vehicle longevity, keeping family cars reliably on the road.'
    ],
    firstStepTicketDe: 'Eingabe von 2 OBD-Fehlercodes + Fahrzeugmodell → Priorisierte Prüfliste der 3 wahrscheinlichsten Fehlerursachen',
    firstStepTicketEn: 'Enter 2 OBD-II fault codes + vehicle model → Prioritized 3-point inspection checklist of root causes',
    firstStepCriteriaDe: 'Nennt bei 10 bekannten Kfz-Gemeinschaftsproblemen (z.B. VAG Steuerkettenlängung, Ford Falschluft) in 9 Fällen den richtigen Prüfschritt.',
    firstStepCriteriaEn: 'Identifies the correct diagnostic inspection step for 9 out of 10 classic multi-brand failure patterns.',
    tags: ['Echte Arbeit', 'Handwerk', 'Kfz', 'Mechaniker', 'Reparatur', 'RechtAufReparatur']
  },
  {
    id: 'ai-trucker-rest-emergency-shield',
    title: 'LenkzeitWächter: Parkplatz-Notstand & Rechtsnachweis für LKW-Fahrer nach VO (EG) 561/2006 Art. 12',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Sprachbefehl des Fahrers bei voller Raststätte: „Alle Plätze belegt, muss weiterfahren!" Die KI erfasst per GPS Zeit, Autobahnkilometer und Parkplatz-Überfüllung, prüft die nächste legale Haltemöglichkeit und generiert automatisch einen rechtsverbindlichen Ausdruck nach Artikel 12 der EU-Verordnung 561/2006 für die BALM- oder Polizeikontrolle, damit der Fahrer nicht mit 500 € Bußgeld bestraft wird, wenn die Infrastruktur versagt.',
    conceptEn: 'A spoken driver command when pulling into a packed highway rest stop: "All truck bays full, forced to proceed!" AI logs exact GPS coordinates, highway kilometer marker, and real-time parking congestion, locating the nearest safe alternate bay and auto-formatting an official legal justification memo under Article 12 of EU Regulation (EC) 561/2006, protecting the driver from €500 fines when public parking infrastructure fails.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'BGL (Bundesverband Güterkraftverkehr Logistik und Entsorgung) · DPVKOM · ETF (European Transport Workers)',
    recipientEn: 'International Road Transport Union (IRU) · Owner-Operator Independent Drivers Association (OOIDA)',
    sourceType: 'Transport & Justice',
    sourceDe: 'EU Tachograph Regulation 561/2006 Art. 12 Legal Reasoning Engine + Highway Rest Area Geospatial Monitor',
    sourceEn: 'EU Driving & Rest Hours Legal Guard + Real-Time Autobahn Truck Parking Geofence',
    evidenceDe: 'In Deutschland fehlen jede Nacht über 25.000 LKW-Stellplätze an Autobahnen. Fernfahrer werden gezwungen, in Ausfahrten oder Notbuchten lebensgefährlich zu parken, oder die gesetzliche 4,5-Stunden-Lenkzeit um wenige Minuten zu überziehen. Die Bußgelder des BALM (Bundesamt für Logistik und Mobilität) treffen oft das Privatgehalt der Fahrer.',
    evidenceEn: 'Every single night, Germany suffers a catastrophic deficit of 25,000 truck parking bays along its highway corridors. Freight drivers are forced either to park dangerously in off-ramps or exceed strict 4.5-hour driving limits. Heavy regulatory fines are routinely deducted from drivers’ personal wages.',
    reviewDate: '10/2026',
    problemDe: 'Art. 12 der VO (EG) 561/2006 erlaubt ausdrücklich eine Abweichung von den Lenkzeiten zur Erreichung eines sicheren Abstellplatzes, WENN dies unverzüglich auf dem Tachographenausdruck handschriftlich mit Gründen vermerkt wird. Doch im Dunkeln um 22:30 Uhr auf dem Standstreifen weiß kein Fahrer, wie er die Begründung rechtssicher auf Englisch oder Deutsch formulieren soll.',
    problemEn: 'Article 12 of EU Regulation 561/2006 explicitly permits exceeding driving hours to reach a suitable stopping place IF recorded on the tachograph printout immediately. But at 10:30 PM on a dark highway shoulder, exhausted drivers do not know the exact legal wording needed to satisfy traffic police.',
    workerPersona: {
      name: 'Dariusz Kowalski (44)',
      role: 'Internationaler Fernkraftfahrer (40-Tonner Sattelzug)',
      location: 'BAB A2 / A7 Raststätte Lehrter See, Niedersachsen',
      quoteDe: 'Jeden Abend ab 19 Uhr beginnt der Krieg um den Parkplatz. Wenn ich nach 4 Stunden und 25 Minuten auf die Raststätte fahre und alles bis zur Zufahrt vollsteht, soll ich mich in Luft auflösen? Wenn die Polizei mich kontrolliert, bin ich der Kriminelle.',
      quoteEn: 'Every evening at 7 PM, the war for a parking spot begins. When my timer hits 4h 25m and every bay is crammed to the curb, am I supposed to vanish into thin air? When police stop me, I am treated like a criminal.',
      storyDe: 'Dariusz fährt seit 18 Jahren Stückgut quer durch Europa. Auf der A2 Richtung Hannover lief seine 4,5-Stunden-Schicht um 21:40 Uhr ab. Drei aufeinanderfolgende Rastanlagen waren komplett belegt, LKW standen bereits dicht an dicht auf der Autobahn-Standspur. Dariusz fuhr 14 Minuten weiter zum nächsten Autohof. Zwei Tage später stoppte ihn das BALM. Wegen der 14-minütigen Überziehung und fehlender schriftlicher Dokumentation verhängten die Beamten 350 € Bußgeld – ein Viertel von Darius’ Wochenlohn.',
      storyEn: 'Dariusz has hauled general freight across Europe for 18 years. On the A2 near Hanover, his mandatory 4.5-hour driving window closed at 9:40 PM. Three consecutive rest stops were dangerously jammed, with rigs parked on hard shoulders. Dariusz drove 14 minutes further to an off-highway depot. Two days later, transport inspectors fined him €350 for the 14-minute overrun because he lacked written justification—a quarter of his weekly take-home pay.'
    },
    realRecipientsList: [
      {
        org: 'BGL – Bundesverband Güterkraftverkehr Logistik und Entsorgung e.V.',
        person: 'Prof. Dr. Dirk Engelhardt (Vorstandssprecher)',
        email: 'bgl@bgl-ev.de',
        location: 'Breitenbachstraße 1, 60487 Frankfurt am Main',
        roleDe: 'Führender Spitzenverband für Straßengüterverkehr und Logistik in Deutschland.',
        roleEn: 'Leading trade federation for road transport, freight logistics, and truck fleet operations.',
        url: 'https://www.bgl-ev.de'
      },
      {
        org: 'DPVKOM – Gewerkschaft der Kommunikations- und Logistikgewerkschaft',
        person: 'Bundesvorstand Transport & Logistik',
        email: 'bundesgeschaeftsstelle@dpvkom.de',
        location: 'Königswinterer Straße 705, 53227 Bonn',
        roleDe: 'Fachgewerkschaft für Fahrer und Logistikbeschäftigte im Deutschen Beamtenbund.',
        roleEn: 'Specialized union for professional drivers and freight logistics personnel.',
        url: 'https://www.dpvkom.de'
      },
      {
        org: 'ETF – European Transport Workers\' Federation',
        person: 'Livia Spera (Generalsekretärin)',
        email: 'etf@etf-europe.org',
        location: 'Galerie Agora, Rue du Marché aux Herbes 105, 1000 Brüssel, Belgien',
        roleDe: 'Europäischer Gewerkschaftsverband für die Rechte von über 5 Millionen Transportarbeitern.',
        roleEn: 'Pan-European federation defending the working rights of over 5 million transport workers.',
        url: 'https://www.etf-europe.org'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Fahrer hatten keine Möglichkeit, die Überfüllung von Rastanlagen gerichtsfest zu protokollieren; handschriftliche Zettel in gebrochenem Deutsch wurden von Behörden oft verworfen.',
      beforeAiEn: 'Impossible before AI: Drivers had no automated way to generate timestamped, geofenced evidence of rest area congestion; handwritten notes in foreign languages were discarded by inspectors.',
      nowEasyDe: 'Heute kinderleicht: Ein einziger Sprachbefehl beim Einfahren in den überfüllten Parkplatz loggt GPS-Koordinaten, Uhrzeit und Verkehrsdichte und formuliert in 5 Sekunden den exakten juristischen Text nach Art. 12 VO 561/2006 auf Deutsch und Englisch für den Tachodrucker.',
      nowEasyEn: 'Effortless today: A single voice tap upon entering a full parking lot logs GPS coordinates, timestamp, and road traffic, instantly outputting the precise legal Article 12 text in German and English for the tachograph ticket.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für Berufskraftfahrer: Rechtsschutz-Assistent für Parkplatz-Notstand („LenkzeitWächter", CC0)',
      subjectEn: 'Gift for long-haul truck drivers: Article 12 emergency parking shield ("LenkzeitWächter", CC0)',
      bodyDe: `Sehr geehrter Herr Prof. Dr. Engelhardt, sehr geehrte Damen und Herren im BGL,

wir übergeben den Berufskraftfahrern ein kostenfreies Werkzeug unter CC0 Public Domain: den „LenkzeitWächter".

Das tägliche Drama auf der Autobahn:
25.000 fehlende LKW-Stellplätze zwingen Fahrer wie Dariusz (44) jede Nacht zu unverschuldeten Lenkzeitüberziehungen. Zwar erlaubt Art. 12 der EU-Verordnung 561/2006 das Weiterfahren zur nächsten Haltemöglichkeit bei unvorhersehbarem Parkplatzmangel – doch ohne sofortigen, rechtssicheren Vermerk auf dem Tachographenausdruck drohen drakonische Bußgelder.

Die Lösung:
Sprachbefehl bei Einfahrt in die volle Raststätte: Das Tool dokumentiert Zeit und GPS-Standort und generiert sofort den passgenauen juristischen Nachweistext für den Ausdruck.

Schutz für diejenigen, die unsere Regale füllen.

Mit kollegialen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders of the Road Haulage and Logistics Association,

We present "LenkzeitWächter" (CC0), a free utility helping professional truck drivers document highway parking bay shortages under Article 12 of EU Regulation 561/2006, shielding drivers from unjustified fines.`
    },
    whyNowDe: [
      'Würde für Fernfahrer: Beendet die Kriminalisierung von Fahrern für das Versagen staatlicher Parkplatz-Infrastruktur.',
      'Rechtssicherheit bei Kontrollen: Erzeugt gerichtsverwertbare Nachweise für BALM, BAG und Autobahnpolizei.',
      'Verkehrssicherheit: Nimmt den mörderischen Zeitdruck, um Unfälle durch Sekundenschlaf am Stauende zu verhindern.'
    ],
    whyNowEn: [
      'Dignity for freight drivers: Stops the unfair criminalization of drivers caused by chronic highway parking deficits.',
      'Enforcement protection: Produces tamper-evident, court-admissible records for transport police.',
      'Highway safety: Defuses lethal time stress, preventing exhaustion crashes at highway tailbacks.'
    ],
    firstStepTicketDe: 'Sprachbefehl „Parkplatz voll" → Erstellung des rechtssicheren Art.-12-Ausdrucktextes mit GPS-Zeitstempel',
    firstStepTicketEn: 'Voice command "parking lot full" → Instant creation of Article 12 justification slip with GPS timestamp',
    firstStepCriteriaDe: 'Erzeugt für 5 Standard-Notfallszenarien den juristisch einwandfreien Text für Tachographenbelege.',
    firstStepCriteriaEn: 'Generates legally flawless tachograph justification slips across 5 common highway rest scenarios.',
    tags: ['Echte Arbeit', 'Transport', 'LKW', 'Logistik', 'Fahrer', 'Rechtsschutz']
  },
  {
    id: 'ai-carpenter-wood-moisture-calculator',
    title: 'HolzfeuchteWächter: Schwundmaß-Rechner & Hirnholz-Layout für Tischler & Schreiner nach DIN 68364',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Ein Foto der Hirnholzkante eines Massivholzbretts genügt: Die KI erkennt Holzart (z.B. europäische Eiche, Esche, Buche) und Jahrringverlauf (radial vs. tangential), berechnet das jahreszeitliche Schwund- und Quellmaß in Millimetern zwischen Sommer (65% Luftfeuchte) und Winterheizung (35% r.F.) nach DIN 68364 und warnt sofort vor Schüsselung oder klemmenden Schubladen.',
    conceptEn: 'Snap a single photo of the end-grain timber slab: AI identifies the wood species (e.g. European oak, ash, beech) and growth ring orientation (radial vs. tangential), computing seasonal shrinkage and swelling in millimeters between humid summer (65% RH) and dry winter heating (35% RH) under DIN 68364, alerting the joiner to warping and stuck drawers before gluing.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'Tischler Schreiner Deutschland (TSD) · IG Metall Holz & Kunststoff · Fachverband Schreinerhandwerk',
    recipientEn: 'Woodworkers Guild of America · British Woodworking Federation (BWF)',
    sourceType: 'Craft & Joinery',
    sourceDe: 'End-Grain Computer Vision + Wood Equilibrium Moisture Sorption Isotherms (DIN 68364)',
    sourceEn: 'Wood Species End-Grain Vision + Tangential/Radial Shrinkage Physics Engine',
    evidenceDe: 'Massivholz arbeitet ein Leben lang. In Deutschland fertigen rund 38.000 Tischlereibetriebe Möbel und Innenausbauten. Reklamationen wegen verzogener Esstische, gerissener Füllungen oder klemmender Massivholz-Schubladen kosten das Handwerk jährlich Millionen.',
    evidenceEn: 'Solid wood moves continuously across seasons. Around 38,000 joinery and carpentry businesses in Germany craft bespoke furniture. Customer warranty claims for warped dining tables, split door panels, and jammed drawers cost joiners millions each year.',
    reviewDate: '10/2026',
    problemDe: 'Unterschiedliche Holzarten schwinden radial und tangential völlig unterschiedlich (Buche bis zu 11,8% tangential, Eiche 7,8%). Werden Bretter mit den Jahrringen falsch verleimt („Kern an Kern"), wölbt sich die Tischplatte im Winter unweigerlich. Lehrlinge und Gesellen müssen komplexe Formeln im Kopf berechnen.',
    problemEn: 'Different wood species swell and shrink at wildly different ratios (beech shrinks up to 11.8% tangentially, oak 7.8%). If boards are glued with conflicting ring orientations, the tabletop will warp during winter heating.',
    workerPersona: {
      name: 'Florian Huber (33)',
      role: 'Schreinermeister in einer handwerklichen Möbelwerkstatt',
      location: 'Schreinerei Huber, Rosenheim, Oberbayern',
      quoteDe: 'Holz verzeiht keine Fehler. Wenn du eine 90cm breite Eichenplatte falsch verleimst, drückt sie dir im Winter mit mehreren Tonnen Kraft die Zargen auseinander. Man kann Physik nicht durch mehr Leim besiegen.',
      quoteEn: 'Wood never forgives mistakes. If you glue a 90cm oak tabletop with wrong ring alignment, winter shrinkage exerts tons of pressure, tearing the frame apart. You cannot defeat physics with extra glue.',
      storyDe: 'Florian fertigt hochwertige Massivholztische aus regionalem Holz. Letzten Herbst baute sein Geselle einen 2,40m langen Eichentisch für ein Architektenhaus mit Fußbodenheizung. Im Januar sank die Raumluftfeuchte durch die Heizung auf 30%. Da zwei Bretter mit stehenden und liegenden Jahrringen unglücklich kombiniert waren, schüsselte die Tischplatte um 6 Millimeter und riss an einer Leimfuge auf. Florian musste den Tisch auf eigene Kosten neu bauen – ein Verlust von 2.800 € und 30 Arbeitsstunden.',
      storyEn: 'Florian crafts bespoke dining tables from Bavarian timber. Last autumn, his apprentice assembled a 2.4-meter solid oak table for an architect’s home with underfloor heating. In dry January air (30% RH), the conflicting growth ring orientations caused the table to cup by 6mm, splitting a glue seam. Florian had to rebuild the table entirely at his own expense—a €2,800 loss and 30 wasted shop hours.'
    },
    realRecipientsList: [
      {
        org: 'Tischler Schreiner Deutschland – Bundesinnungsverband',
        person: 'Thomas Radermacher (Präsident) & Dr. Katharina Gamillscheg (Hauptgeschäftsführerin)',
        email: 'tsd@tischler-schreiner.de',
        location: 'Littenstraße 10, 10179 Berlin',
        roleDe: 'Bundesweiter Spitzenverband des Tischler- und Schreinerhandwerks (rund 38.000 Betriebe).',
        roleEn: 'National federation representing 38,000 independent carpentry and joinery businesses.',
        url: 'https://www.tischler-schreiner.de'
      },
      {
        org: 'IG Metall – Branchenbereich Holz und Kunststoff',
        person: 'Ralf Kutzner (Geschäftsführendes Vorstandsmitglied)',
        email: 'huk@igmetall.de',
        location: 'Wilhelm-Leuschner-Straße 79, 60329 Frankfurt am Main',
        roleDe: 'Gewerkschaftliche Vertretung für Beschäftigte der holzverarbeitenden Industrie und des Handwerks.',
        roleEn: 'Trade union representing woodworkers and cabinetmakers across Germany.',
        url: 'https://www.igmetall.de'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Jahrring-Geometrien auf sägerauen oder gehobelten Brettern ließen sich von Standard-Kameras nicht erfassen; komplexe Sorptionsisothermen waren nur in dicken Tabellenbüchern zu finden.',
      beforeAiEn: 'Impossible before AI: End-grain growth ring angles on rough-sawn lumber could not be parsed by computer vision; sorption isotherms remained buried in physical reference books.',
      nowEasyDe: 'Heute kinderleicht: Ein Foto der Stirnkante genügt: Das multimodale Modell erkennt Jahrring-Krümmung und Holzart, berechnet die Breitenänderung bei 30% bis 70% relativer Feuchte und schlägt die optimale Verleim-Reihenfolge („linke Seite an linke Seite") vor.',
      nowEasyEn: 'Effortless today: A single photo of the board’s end grain detects species and growth ring curvature, calculates exact expansion across 30-70% humidity ranges, and displays the correct alternating glue-up sequence.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für das Tischlerhandwerk: Digitaler Holzschwund- & Jahrring-Rechner („HolzfeuchteWächter", CC0)',
      subjectEn: 'Gift for woodworkers: End-grain shrinkage & growth ring alignment assistant ("HolzfeuchteWächter", CC0)',
      bodyDe: `Sehr geehrte Frau Dr. Gamillscheg, sehr geehrter Herr Radermacher,

wir übergeben dem deutschen Tischler- und Schreinerhandwerk ein offenes Werkzeug unter CC0 Public Domain: den „HolzfeuchteWächter".

Die handwerkliche Herausforderung:
Schreiner wie Florian (33) fertigen langlebige Möbel. Doch moderne Fußbodenheizungen führen im Winter zu extremer Raumtrockenheit. Werden Bretter mit ungünstigem Jahrringverlauf verleimt, drohen Risse, Schüsselung und teure Gewährleistungsreklamationen.

Die Lösung:
Foto des Hirnholzes: Die KI analysiert den Jahrringverlauf, errechnet das exakte Schwundmaß nach DIN 68364 für Sommer und Winter und visualisiert die optimale Verleim-Regel für das Werkstück.

Kostenfrei, für bleibende Handwerksqualität.

Mit zünftigen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders of the German Joinery and Carpentry Federation,

We present "HolzfeuchteWächter" (CC0), a computer-vision tool helping joiners verify growth ring orientation and seasonal wood shrinkage under DIN 68364 to prevent cracked tabletops and warped furniture.`
    },
    whyNowDe: [
      'Reklamationsschutz: Verhindert Risse und Verzug in Massivholzmöbeln bei extremen Heizperioden.',
      'Ausbildungshilfe: Zeigt Lehrlingen anschaulich, wie und warum Holz in radialer und tangentialer Richtung arbeitet.',
      'Ressourcenschutz: Verhindert das Wegwerfen wertvoller Edelholzplatten durch Fehlverleimung.'
    ],
    whyNowEn: [
      'Warranty defense: Prevents splitting and warping in solid wood tables during dry heating winters.',
      'Apprentice training: Visually demonstrates how wood breathes and moves along radial and tangential planes.',
      'Timber preservation: Prevents waste of precious hardwood timber due to improper board alignment.'
    ],
    firstStepTicketDe: 'Foto des Hirnholzes + Eingabe der Plattenbreite (z.B. 90 cm) → Quell- und Schwundmaß in mm für Winter & Sommer',
    firstStepTicketEn: 'Photo of end grain + board width input (e.g. 90 cm) → Dimensional shrinkage in mm for winter & summer',
    firstStepCriteriaDe: 'Berechnet die Maßänderung für Eiche, Buche und Fichte bei Luftfeuchteänderung 65% auf 35% auf 0,5 mm genau.',
    firstStepCriteriaEn: 'Calculates dimensional variance for oak, beech, and spruce between 65% and 35% RH within 0.5mm accuracy.',
    tags: ['Echte Arbeit', 'Handwerk', 'Schreiner', 'Tischler', 'Holz', 'Möbelbau']
  },
  {
    id: 'ai-butcher-curing-salt-haccp-guard',
    title: 'PökelSicher: Nitritpökelsalz-Rechner & HACCP-Schinken-Reifeplaner für das Fleischerhandwerk',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Spracheingabe des Fleischgewichts beim Zuschnitt: „14,7 Kilo Schweineschulter für Rohschinken". Die KI berechnet grammgenau die vorschriftsmäßige Dosierung von Nitritpökelsalz (NPS), Ascorbat, Pfeffer und Starterkulturen nach den Leitsätzen für Fleisch und Fleischerzeugnisse, warnt vor Botulismus-Risiken bei zu geringem Salzgehalt und generiert automatisch den lückenlosen HACCP-Temperatur- und Reifeverlauf für die Lebensmittelkontrolle.',
    conceptEn: 'Spoken butchery weight input during carcass breakdown: "14.7 kilos pork shoulder for dry-cured ham." AI calculates exact gram measurements of curing salt (NPS), sodium ascorbate, spices, and starter cultures under strict food safety codes, warns against botulism risks if salinity is dangerously low, and automatically builds compliant HACCP ripening logs for health inspectors.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'Deutscher Fleischer-Verband (DFV) · NGG Fleischwirtschaft · Bundesverband der Lebensmittelkontrolleure',
    recipientEn: 'American Association of Meat Processors (AAMP) · International Butchers\' Confederation (IBC)',
    sourceType: 'Craft & Food Safety',
    sourceDe: 'Meat Water Activity (aw-Value) Microbiology Model + Nitrite Food Safety Standards + HACCP Protocol Generator',
    sourceEn: 'Dry Curing Salt Microbiology Chemistry + HACCP Compliance Automation',
    evidenceDe: 'Im deutschen Fleischerhandwerk gibt es rund 10.000 handwerkliche Betriebe. Bei der traditionellen Herstellung von Rohschinken und Salami entscheidet die exakte Einhaltung von Wasseraktivität (aw-Wert), pH-Wert und Pökelsalzmenge über Gesundheit oder lebensgefährliche Lebensmittelvergiftungen (Clostridium botulinum).',
    evidenceEn: 'Around 10,000 artisanal butcher shops operate in Germany. In traditional dry-curing of hams and salamis, precise water activity (aw-value), pH decline, and curing salt ratios separate safe delicacy from lethal foodborne botulism.',
    reviewDate: '10/2026',
    problemDe: 'Jedes Fleischstück hat ein krummes Schlachtgewicht (z.B. 13,85 kg). Bisher rechnen Metzger mit fleckigen Notizbüchern und Taschenrechnern zwischen Rinderhälften und Fleischwölfen. Rechenfehler bei Salzgehalt oder Reifetemperatur führen zu verdorbenen Chargen oder Beanstandungen durch die Veterinärbehörde.',
    problemEn: 'Every carcass cut has an odd batch weight (e.g. 13.85 kg). Butchers currently scribble calculations on grease-stained paper while wearing chainmail aprons. Mistakes in salt ratio lead to spoiled batches or severe food safety audit sanctions.',
    workerPersona: {
      name: 'Markus Brandl (52)',
      role: 'Metzgermeister und Fleischereinhaber',
      location: 'Landmetzgerei Brandl, Fränkische Schweiz, Bayern',
      quoteDe: 'Beim Pökeln gibt es kein Pi mal Daumen. Ein halbes Gramm Pökelsalz zu wenig auf das Kilo, und der Schinken fault dir von innen am Knochen weg. Ein Gramm zu viel, und der Kunde spuckt ihn aus vor Salz.',
      quoteEn: 'With dry-curing, you cannot eyeball it. Half a gram too little salt per kilo, and the ham rots around the bone from within. One gram too much, and the customer spits it out.',
      storyDe: 'Markus führt die Metzgerei seit 28 Jahren. Seine Spezialität ist naturgereifter Schinken nach Urgroßvaters Art. Letzten Sommer stellte die Lebensmittelkontrolle fest, dass bei einer Charge Schinken die lückenlose Temperaturaufzeichnung im Reiferaum fehlte, weil die Batterie des Messloggers ausgefallen war. Markus musste 40 Schinken im Wert von über 3.000 € vernichten, obwohl das Fleisch einwandfrei war. Ihm fehlte ein einfaches System, das ihn per Sprache durch die Rezeptur führt und Reifedaten automatisch dokumentiert.',
      storyEn: 'Markus has owned his village butchery for 28 years. His signature is slow-aged country ham. Last summer, the municipal food safety inspector flagged missing daily temperature records in his curing vault due to a failed logger battery. Markus had to condemn and destroy 40 prime hams worth over €3,000, even though the meat was flawless. He desperately needed a simple voice-driven HACCP logging assistant.'
    },
    realRecipientsList: [
      {
        org: 'Deutscher Fleischer-Verband e.V. (DFV)',
        person: 'Herbert Dohrmann (Präsident) & Martin Fuchs (Hauptgeschäftsführer)',
        email: 'info@fleischerhandwerk.de',
        location: 'Kennedyallee 53, 60596 Frankfurt am Main',
        roleDe: 'Bundesweiter Spitzenverband des deutschen Fleischerhandwerks (über 10.000 Betriebe).',
        roleEn: 'National federation representing 10,000 independent butcher businesses and charcutiers.',
        url: 'https://www.fleischerhandwerk.de'
      },
      {
        org: 'Gewerkschaft Nahrung-Genuss-Gaststätten (NGG) – Referat Fleischwirtschaft',
        person: 'Freddy Adjan (Stellvertretender NGG-Vorsitzender)',
        email: 'hv.fleischwirtschaft@ngg.net',
        location: 'Haubachstraße 76, 22765 Hamburg',
        roleDe: 'Gewerkschaftliche Vertretung für Beschäftigte im Fleischerhandwerk und der Fleischindustrie.',
        roleEn: 'Trade union representing workers and butcher apprentices in the meat processing trade.',
        url: 'https://www.ngg.net'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Metzger mit feuchten Arbeitshandschuhen konnten keine Tastaturen bedienen; Tabellenkalkulationen boten keine mikrobiologische Plausibilitätsprüfung für Reifezeiten.',
      beforeAiEn: 'Impossible before AI: Butchers with wet, sanitized work gloves could not operate physical keyboards; static spreadsheets lacked microbiological hazard verification.',
      nowEasyDe: 'Heute kinderleicht: Zuruf des Gewichts („12,4 Kilo Oberschale") genügt: Die KI nennt sofort die exakten Grammzahlen für Salz, Wacholder und Starterkultur, erstellt den 6-wöchigen Reifeplan und generiert das amtliche HACCP-PDF.',
      nowEasyEn: 'Effortless today: Calling out the weight ("12.4 kilos top round") is enough: AI recites exact gram quantities for curing salt, juniper, and cultures, scheduling a 6-week ripening cycle with auto-generated HACCP documentation.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für das Fleischerhandwerk: Pökel- & HACCP-Reife-Assistent („PökelSicher", CC0)',
      subjectEn: 'Gift for artisanal butchers: Curing salt calculator & HACCP ripening scheduler ("PökelSicher", CC0)',
      bodyDe: `Sehr geehrter Herr Dohrmann, sehr geehrter Herr Fuchs,

wir übergeben dem deutschen Fleischerhandwerk ein offenes Werkzeug unter CC0 Public Domain: „PökelSicher".

Die tägliche Herausforderung:
Traditionelle Fleischer wie Markus (52) stellen hochwertige Lebensmittel her. Doch das Pökeln von Rohschinken und Salami erfordert exakte Salz- und Gewichtsverhältnisse sowie strenge HACCP-Dokumentation für die Lebensmittelkontrolle. Rechenfehler gefährden die Gesundheit der Kunden und die Existenz des Betriebs.

Die Lösung:
Freihändige Spracheingabe des Fleischgewichts: Die KI berechnet sofort die exakte Rezeptur auf das Zehntelgramm, warnt vor mikrobiologischen Risiken und erstellt das vollständige Kontrollprotokoll für das Veterinäramt.

Frei, ohne Lizenzgebühren, zur Unterstützung unseres echten Ernährungshandwerks.

Mit besten Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders of the German Butchers Federation,

We present "PökelSicher" (CC0), a voice-guided curing salt calculator and HACCP log builder that protects artisanal charcutiers from calculation errors and regulatory audit penalties.`
    },
    whyNowDe: [
      'Lebensmittelsicherheit: Verhindert lebensgefährliche Botulismus-Risiken durch wissenschaftlich geprüfte Salz- und aw-Wert-Vorgaben.',
      'Bürokratie-Befreiung: Erstellt amtliche HACCP-Dokumentationen auf Knopfdruck ohne Papierchaos.',
      'Handwerksschutz: Bewahrt traditionelle Schinken- und Wurstrezepturen vor dem Aussterben durch überbordende Auflagen.'
    ],
    whyNowEn: [
      'Food safety assurance: Prevents dangerous botulism risks through verified water activity and curing salt ceilings.',
      'Paperwork elimination: Creates official HACCP compliance documentation with a single voice command.',
      'Culinary preservation: Protects artisanal dry-curing heritage from suffocating under red tape.'
    ],
    firstStepTicketDe: 'Spracheingabe Fleischgewicht + Schinkenart → Grammgenaue Zutatenliste + 6-wöchiger Temperatur-/Feuchteplan',
    firstStepTicketEn: 'Voice input of meat weight + ham type → Exact gram ingredient checklist + 6-week humidity/temp schedule',
    firstStepCriteriaDe: 'Gibt für 5 Fleischgewichte (von 3,2 kg bis 18,5 kg) die exakten Pökelsalz- und Ascorbatmengen vorschriftsmäßig aus.',
    firstStepCriteriaEn: 'Outputs exact statutory curing salt and ascorbate ratios for 5 meat cut weights ranging from 3.2kg to 18.5kg.',
    tags: ['Echte Arbeit', 'Handwerk', 'Fleischer', 'Lebensmittel', 'HACCP', 'Sicherheit']
  },
  {
    id: 'ai-landscaper-soil-climate-planting-plan',
    title: 'KlimaGartenWächter: Boden- & Trockenheits-Pflanzplaner für Gärtner & Landschaftsbauer',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Ein Foto der Bodenkrume (Farbe, Körnung) und Sonnenlage des Grundstücks genügt: Die KI bestimmt die Bodenart (Sand, Lehm, Ton, pH-Wert-Schätzung), gleicht die Dürre- und Hitzeresilienz nach der GALK-Klimabaumliste ab und erstellt einen standortgerechten, hitzeresistenten Pflanzplan mit heimischen Gehölzen und Stauden, der ohne künstliche Bewässerung auskommt und den Gartenbauer vor teuren Anwachsgarantie-Haftungsfällen schützt.',
    conceptEn: 'Snap a single photo of soil texture (color, crumb structure) and sun exposure: AI assesses soil type (sandy loam, clay, chalk estimate) against the official municipal Climate Tree catalog (GALK), generating a resilient, zero-irrigation native planting plan that protects landscaping contractors from costly 12-month plant mortality warranty claims.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'BGL (Bundesverband Garten-, Landschafts- und Sportplatzbau) · IG BAU Gartenbau · Bund deutscher Baumschulen',
    recipientEn: 'European Landscape Contractors Association (ELCA) · Landscape Architecture Foundation',
    sourceType: 'Craft & Ecology',
    sourceDe: 'Soil Crumb Computer Vision + GALK Climate Tree Database + Microclimate Hydrology Model',
    sourceEn: 'Soil Texture Vision + Drought-Tolerant Native Flora Matrix + Warranty Liability Shield',
    evidenceDe: 'Durch den Klimawandel erleben mitteleuropäische Gärten immer heißere Sommer. Landschaftsgärtner müssen laut BGB/VOB eine 12- bis 24-monatige Anwachsgarantie gewährleisten. Vertrocknen teure Bäume oder Hecken im ersten Jahr, bleibt der Betrieb auf Kosten von oft 5.000 € bis 20.000 € sitzen.',
    evidenceEn: 'With escalating climate change, urban gardens endure scorching summers. Under standard construction codes, landscapers must guarantee plant survival for 12 to 24 months. When expensive trees or hedges wither in year one, contractors absorb thousands in replacement losses.',
    reviewDate: '10/2026',
    problemDe: 'Kunden verlangen oft empfindliche Modepflanzen (z.B. Kirschlorbeer oder Rhododendron) an vollsonnigen, kalkhaltigen Trockenstandorten. Wenn die Pflanzen im August vertrocknen, schieben Kunden die Schuld auf den Gartenbauer. Umfassende Boden- und Klimaanalysen auf der Baustelle waren bisher zu zeitraubend.',
    problemEn: 'Clients demand water-hungry ornamental plants on baking chalk soils. When foliage scorches in August, homeowners blame the landscaper. On-site comprehensive soil and climate modeling was previously far too time-consuming.',
    workerPersona: {
      name: 'Anja Berg (36)',
      role: 'Landschaftsgärtnerin und Bauleiterin',
      location: 'Garten- und Landschaftsbau Berg, Münsterland, NRW',
      quoteDe: 'Die Leute wollen einen englischen Rasen und Hortensien, aber wir haben hier seit fünf Jahren Dürresommer. Wenn ich pflanze, was der Kunde im Hochglanzkatalog gesehen hat, bin ich im nächsten Frühjahr der Dumme, wenn alles braun ist.',
      quoteEn: 'Clients want lush English turf and hydrangeas, but we have had five drought summers in a row. If I plant what they saw in a glossy catalog, I am the fool on the hook when it turns brown next spring.',
      storyDe: 'Anja leitet Pflanzprojekte für Privat- und Gewerbekunden. Vor zwei Jahren bepflanzte ihr Team eine 600m² große Wohnanlage mit klassischen Buchenhecken und Hainbuchen. Im darauffolgenden Rekordsommer sanken die Grundwasserspiegel ab; trotz Gießens vertrockneten 40% der Heckenpflanzen. Die Eigentümergemeinschaft forderte Nachbesserung im Rahmen der Anwachsgarantie. Anja musste auf Firmenkosten für 8.400 € neue Pflanzen setzen und wochenlang wässern. Ein vorab visualisierter, klimaangepasster Pflanzplan hätte diesen Schaden verhindert.',
      storyEn: 'Anja manages landscape installations across Münsterland. Two years ago her team planted classic beech hedging around a residential complex. In the ensuing record heatwave, water tables dropped and 40% of the hedge withered despite watering. The homeowners association enforced their statutory planting warranty. Anja had to replace €8,400 worth of plants at company expense. A climate-adapted planting plan backed by data would have prevented the disaster.'
    },
    realRecipientsList: [
      {
        org: 'BGL – Bundesverband Garten-, Landschafts- und Sportplatzbau e.V.',
        person: 'Thomas Banzhaf (Präsident) & Dr. Frank Kehlenbach (Hauptgeschäftsführer)',
        email: 'bgl@galabau.de',
        location: 'Alexander-von-Humboldt-Straße 4, 53604 Bad Honnef',
        roleDe: 'Bundesweiter Wirtschafts- und Arbeitgeberverband für rund 4.200 Fachbetriebe des Garten- und Landschaftsbaus.',
        roleEn: 'National federation representing 4,200 professional landscape and sports ground contracting firms.',
        url: 'https://www.galabau.de'
      },
      {
        org: 'IG BAU – Industriegewerkschaft Bauen-Agrar-Umwelt (Fachgruppe Gartenbau)',
        person: 'Carsten Burckhardt (Mitglied des Bundesvorstandes)',
        email: 'agrar@igbau.de',
        location: 'Olof-Palme-Straße 19, 60439 Frankfurt am Main',
        roleDe: 'Gewerkschaftliche Interessenvertretung für über 100.000 Beschäftigte im Garten- und Landschaftsbau.',
        roleEn: 'Trade union representing over 100,000 workers and apprentices in horticultural contracting.',
        url: 'https://www.igbau.de'
      },
      {
        org: 'BdB – Bund deutscher Baumschulen e.V.',
        person: 'Hajo Hinrichs (Präsident) & Markus Guhl (Hauptgeschäftsführer)',
        email: 'info@gruen-ist-leben.de',
        location: 'Kleine Schiesenstraße 2-12, 10115 Berlin',
        roleDe: 'Vereinigung der deutschen Baumschulen, die klimaangepasste Stadtbäume und Gehölze kultivieren.',
        roleEn: 'Federation of German tree nurseries cultivating drought-resilient urban trees and shrubs.',
        url: 'https://www.gruen-ist-leben.de'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Bodenanalysen erforderten chemische Einsendelabore mit 3 Wochen Wartezeit; GaLaBau-Software bot keine dynamischen Klimazonen-Projektionen für lokale Gärten.',
      beforeAiEn: 'Impossible before AI: Soil testing required mailing samples to agricultural labs with 3-week delays; landscape design software lacked microclimate drought models.',
      nowEasyDe: 'Heute kinderleicht: Ein Foto des Aushubs und die Eingabe der Postleitzahl genügen: Die KI ermittelt Bodenstruktur und lokale Niederschlagstrends, wählt aus der Klimabaumliste passende Arten (z.B. Feldahorn, Felsenbirne, trockenheitsresistente Gräser) und erstellt eine wasserfeste Kunden-Expertise.',
      nowEasyEn: 'Effortless today: A single photo of the excavated soil crumb plus postal code is enough: AI evaluates soil structure and precipitation trends, recommending resilient native species and generating a client report.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für den Garten- & Landschaftsbau: Klima-Pflanzplaner & Haftungsschutz („KlimaGartenWächter", CC0)',
      subjectEn: 'Gift for landscape contractors: Climate-resilient planting planner & warranty shield ("KlimaGartenWächter", CC0)',
      bodyDe: `Sehr geehrter Herr Banzhaf, sehr geehrter Herr Dr. Kehlenbach,

wir übergeben dem Garten- und Landschaftsbau ein freies Werkzeug unter CC0 Public Domain: den „KlimaGartenWächter".

Die Herausforderung im grünen Handwerk:
Gärtnerinnen wie Anja (36) gestalten unsere Lebensräume. Doch zunehmende Hitze- und Dürresommer führen dazu, dass herkömmliche Pflanzen vertrocknen. Durch gesetzliche Anwachsgarantien tragen GaLaBau-Betriebe ein enormes finanzielles Risiko.

Die Lösung:
Foto der Bodenkrume mit dem Smartphone: Die KI bestimmt Bodenart und Feuchtehaltevermögen, gleicht die Daten mit der GALK-Klimabaumliste ab und schlägt hitzeresistente, heimische Gehölze und Stauden vor. Ein automatisch erstelltes Gutachten schützt den Betrieb bei Dürre vor ungerechtfertigten Gewährleistungsansprüchen.

Freies Wissen für zukunftsfähige, grüne Städte.

Mit grünen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders of the Landscape Contractors Federation,

We present "KlimaGartenWächter" (CC0), a free mobile tool that matches soil textures to drought-resilient native plants, protecting landscaping contractors from devastating plant warranty losses.`
    },
    whyNowDe: [
      'Garantieschutz für GaLaBau-Betriebe: Dokumentiert standortgerechte Pflanzung und schützt vor unverschuldeten Regressforderungen.',
      'Klimaanpassung: Fördert artenreiche, wassersparende Gärten statt versiegelter Schotterwüsten oder vertrockneter Zierrasen.',
      'Biodiversität: Bevorzugt heimische Insektennährgehölze und robuste Tiefwurzler.'
    ],
    whyNowEn: [
      'Warranty defense: Verifies location-appropriate planting, shielding small firms from extreme-weather losses.',
      'Climate adaptation: Promotes lush, low-water native gardens over sterile gravel yards or scorched lawns.',
      'Biodiversity boost: Prioritizes pollinator-friendly deep-rooting native flora.'
    ],
    firstStepTicketDe: 'Foto des Gartenaushubs + Postleitzahl → Bodenart-Bestimmung + 5 hitzeresistente Gehölz-Empfehlungen',
    firstStepTicketEn: 'Photo of soil excavation + postal code → Soil type classification + 5 drought-resilient plant picks',
    firstStepCriteriaDe: 'Klassifiziert sandigen Lehm, Tonboden und Humusboden anhand von 10 Bildbeispielen zuverlässig.',
    firstStepCriteriaEn: 'Accurately distinguishes sandy loam, dense clay, and humus soils across 10 benchmark photos.',
    tags: ['Echte Arbeit', 'Handwerk', 'Gartenbau', 'GaLaBau', 'Ökologie', 'Klimaresilienz']
  },
  {
    id: 'ai-farmer-fertilizer-ordinance-shield',
    title: 'DüngeWächter: Rote-Gebiete-Schutzschild & Nährstoff-Bilanzierer für Landwirte nach DüV § 13a',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Ein Foto des Güllefass-Füllstands und Zuruft des Schlagnamens: Die KI gleicht den Ackerschlag mit amtlichen Geodaten der nitratbelasteten „Roten Gebiete" ab, prüft die 3-Tage-Regenprognose gegen Auswaschungsverbote, berechnet die exakte verbleibende Stickstoff- und Phosphat-Obergrenze (170 kg N/ha-Grenze) und erstellt in 20 Sekunden den behördlich vorgeschriebenen, lückenlosen Düngenachweis, um Landwirte vor 50.000 € Bußgeldern und Subventionskürzungen zu schützen.',
    conceptEn: 'A photo of the slurry tanker sight glass and a spoken field parcel name: AI cross-references the field against state nitrate-vulnerable "Red Zone" GIS maps, verifies the 3-day precipitation forecast against runoff bans, calculates remaining nitrogen and phosphate ceilings (170 kg N/ha limit), and compiles official statutory records in 20 seconds, protecting family farmers from €50,000 regulatory penalties.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'Deutscher Bauernverband (DBV) · Arbeitsgemeinschaft bäuerliche Landwirtschaft (AbL) · Bund der Deutschen Landjugend',
    recipientEn: 'European Farmers and Agri-Cooperatives (COPA-COGECA) · National Farmers Union (NFU)',
    sourceType: 'Agriculture & Compliance',
    sourceDe: 'Agrar-GIS Rote-Gebiete-API + DüV § 13a Nitrogen Physics Calculator + Weather Radar Infiltration Model',
    sourceEn: 'Agricultural GIS Red-Zone Integration + Fertilizer Ordinance Compliance Shield',
    evidenceDe: 'In Deutschland bewirtschaften rund 250.000 landwirtschaftliche Familienbetriebe die Felder. Durch die Düngeverordnung (DüV) und verschärfte Auflagen in den nitratbelasteten „Roten Gebieten" drohen Landwirten bei kleinsten Dokumentationsfehlern existenzvernichtende Sanktionen und Kürzungen der EU-Agrarbeihilfen.',
    evidenceEn: 'Around 250,000 family farms cultivate Germany’s soil. Under stringent European and national fertilizer regulations in nitrate-vulnerable Red Zones, minor paperwork oversights trigger devastating €50,000 fines and immediate clawbacks of EU farm subsidies.',
    reviewDate: '10/2026',
    problemDe: 'Landwirte müssen vor jeder Düngung eine standortbezogene Düngebedarfsermittlung (DBE) durchführen und innerhalb von 2 Tagen protokollieren. Auf dem Traktor bei der Frühjahrsbestellung hat niemand Zeit, 15-seitige Ackerschlagkarteien in teuren, unübersichtlichen Softwareportalen zu pflegen.',
    problemEn: 'Farmers must calculate crop nutrient demand prior to spreading and log records within 2 days. Bouncing in a tractor cab during spring planting, farmers cannot wrestle with clunky, expensive proprietary farm software portals.',
    workerPersona: {
      name: 'Christian Meier (45)',
      role: 'Landwirtschaftsmeister und Milchviehbauer (80 Kühe, 75 ha Acker- und Grünland)',
      location: 'Meierhof, Landkreis Rottal-Inn, Niederbayern',
      quoteDe: 'Ich stehe morgens um 5 im Stall und sitze abends bis 22 Uhr auf dem Schlepper. Wenn ich dann noch nachts um elf am Computer für jeden Acker Nährstofftabellen mit 20% pauschalem Abzug ausfüllen muss, platzt mir der Kopf. Wir wollen Nahrung erzeugen, nicht Aktenordner füllen.',
      quoteEn: 'I start in the milking parlor at 5 AM and finish on the tractor at 10 PM. Having to spend midnight at a PC filling nutrient subtraction tables for every parcel pushes you to the brink. We want to grow food, not shuffle binders.',
      storyDe: 'Christian führt den Hof seiner Eltern in vierter Generation. 35 Hektar seiner Flächen liegen in einem neu ausgewiesenen „Roten Gebiet", wo die Düngung pauschal um 20% unter den Bedarf der Pflanzen gekürzt werden muss. Nach heftigen Gewittern im Mai beanstandete das Landwirtschaftsamt einen Gülleausbringungs-Eintrag, weil Christian das Datum versehentlich um einen Tag falsch in die Ackerschlagkartei eingetragen hatte. Ihm drohte eine Kürzung der Betriebsprämie um 15% – ein Verlust von 4.500 €, der über den Gewinn des Hofes im laufenden Quartal entschied.',
      storyEn: 'Christian is a 4th-generation dairy and crop farmer. 35 hectares of his land lie in a newly gazetted "Red Zone" requiring a mandatory 20% cut below crop nutrient requirements. Following heavy May thunderstorms, inspectors flagged a slurry log because Christian accidentally recorded the date one day off. The agricultural ministry threatened a 15% subsidy penalty—a €4,500 hit wiping out his entire quarterly farm profit.'
    },
    realRecipientsList: [
      {
        org: 'Deutscher Bauernverband e.V. (DBV)',
        person: 'Joachim Rukwied (Präsident) & Bernhard Krüsken (Generalsekretär)',
        email: 'bauernverband@bauernverband.net',
        location: 'Claire-Waldoff-Straße 7, 10117 Berlin',
        roleDe: 'Größte berufsständische Interessenvertretung der deutschen Land- und Forstwirtschaft.',
        roleEn: 'Primary national federation representing family farmers and agricultural producers.',
        url: 'https://www.bauernverband.de'
      },
      {
        org: 'Arbeitsgemeinschaft bäuerliche Landwirtschaft e.V. (AbL)',
        person: 'Martin Schulz (Bundesvorsitzender)',
        email: 'info@abl-ev.de',
        location: 'Heiligengeiststraße 28, 21335 Lüneburg',
        roleDe: 'Bauernverband für bäuerliche, ökologische und zukunftsfähige Familienbetriebe.',
        roleEn: 'Association of small-to-midscale family farms championing ecological and fair agriculture.',
        url: 'https://www.abl-ev.de'
      },
      {
        org: 'Bund der Deutschen Landjugend (BDL) e.V.',
        person: 'Bundesvorsitz der Landjugend',
        email: 'info@landjugend.de',
        location: 'Sonnenallee 223, 12059 Berlin',
        roleDe: 'Größter Jugendverband im ländlichen Raum für Nachwuchslandwirte und Auszubildende.',
        roleEn: 'Youth association representing young farmers, apprentices, and rural communities.',
        url: 'https://www.landjugend.de'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Ackerschlagkarteien waren unübersichtliche PC-Datenbanken; kein System verknüpfte lokale Radar-Niederschlagsvorhersagen direkt mit behördlichen Schutzgebiets-Grenzen per Zuruf.',
      beforeAiEn: 'Impossible before AI: Agricultural record-keeping was trapped in clunky desktop software; no tool could correlate real-time Doppler rain radar with parcel boundaries via voice.',
      nowEasyDe: 'Heute kinderleicht: Fahrer spricht auf dem Schlepper: „Feld am Wald, 12 Kubikmeter Rindergülle ausgebracht". Die KI prüft Schutzgebietsgrenzen, Wetterauflagen und N-Obergrenzen und generiert das fertige PDF-Protokoll für das Landwirtschaftsamt.',
      nowEasyEn: 'Effortless today: The farmer speaks from the tractor cab: "North parcel, spread 12 m³ slurry". AI checks parcel boundary restrictions, rain forecast, and N-ceilings, generating an audit-ready compliance PDF.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für die bäuerliche Landwirtschaft: Mobiler Dünge- & Rote-Gebiete-Wächter („DüngeWächter", CC0)',
      subjectEn: 'Gift for family farmers: Fertilizer ordinance compliance & Red Zone guard ("DüngeWächter", CC0)',
      bodyDe: `Sehr geehrter Herr Rukwied, sehr geehrter Herr Krüsken,

wir übergeben den deutschen Landwirtinnen und Landwirten ein offenes Werkzeug unter CC0 Public Domain: den „DüngeWächter".

Die tägliche Überlastung auf den Höfen:
Bauernfamilien wie Christian (45) leisten unverzichtbare Arbeit für unsere Ernährung. Doch die verschärfte Düngeverordnung und bürokratische Dokumentationspflichten in „Roten Gebieten" rauben den Betrieben den Schlaf. Kleine Formfehler führen zu existenzbedrohenden Beihilfekürzungen.

Die Lösung:
Spracheingabe direkt vom Schlepper aus: Die KI gleicht den Ackerschlag mit amtlichen Rote-Gebiete-Karten ab, prüft die Wetterprognose und erstellt in 20 Sekunden das behördengerechte Düngeprotokoll.

Kostenfrei, als Zeichen des Danks für die Menschen, die unser Land ernähren.

Mit bäuerlichen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders of the German Farmers Federation,

We present "DüngeWächter" (CC0), a voice-enabled mobile assistant helping family farmers document fertilizer application under strict Red-Zone rules in seconds, shielding farms from punishing subsidy cuts.`
    },
    whyNowDe: [
      'Existenzsicherung für Familienbetriebe: Schützt vor drakonischen Subventionskürzungen bei rein bürokratischen Formfehlern.',
      'Praktischer Grundwasserschutz: Verhindert Düngung vor Starkregen durch automatischen Abgleich mit lokalen Regenradar-Daten.',
      'Entlastung von Bürokratielast: Spart Landwirten wöchentlich mehrere Stunden nervenaufreibende Büroarbeit.'
    ],
    whyNowEn: [
      'Farm economic survival: Shields multi-generation family farms from crippling penalties over minor logging delays.',
      'Groundwater stewardship: Prevents fertilizer runoff ahead of storms via live radar precipitation warnings.',
      'Paperwork liberation: Frees farmers from hours of exhausting midnight clerical data entry.'
    ],
    firstStepTicketDe: 'Spracheingabe Ackerschlag + Ausbringmenge → Nährstoffsaldo-Berechnung + amtlicher Düngenachweis als PDF',
    firstStepTicketEn: 'Voice input of field name + volume applied → Nutrient balance check + statutory PDF record',
    firstStepCriteriaDe: 'Prüft 5 Test-Ausbringungen auf Einhaltung der 170 kg N/ha-Grenze und Rote-Gebiete-Abschläge fehlerfrei.',
    firstStepCriteriaEn: 'Evaluates 5 test spreading scenarios against the 170kg N/ha limit and Red Zone reductions with 100% precision.',
    tags: ['Echte Arbeit', 'Landwirtschaft', 'Bauern', 'Boden', 'Grundwasserschutz', 'Bürokratieabbau']
  },
  {
    id: 'ai-hairdresser-color-bleach-formulator',
    title: 'RezepturWächter: Haar-Aufhellungs- & Abmattierungs-Rechner für das Friseurhandwerk',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Ein Smartphone-Foto des Haaransatzes und der Längen bei neutralem Tageslicht neben einer weißen Farbkarte: Die KI erkennt die exakte Naturton-Basishöhe (1 bis 10), misst den Gehalt an verbliebenen Rot-, Orange- und Gelbpigmenten, berechnet die schonendste Entwicklerstärke (1,9%, 3%, 6% oder 9%) und gibt der Friseurin grammgenaue Mischungsverhältnisse für Aufheller und komplementäre Abmattierungstoner (z.B. Violett gegen Gelbstich) aus, um Haarbruch und Reklamationen zu verhindern.',
    conceptEn: 'A smartphone photo of hair roots and mid-lengths taken in neutral daylight next to a white card: AI identifies the exact natural base level (Levels 1 to 10), measures residual red, orange, and yellow undertones, computes the gentlest developer volume (6, 10, 20, or 30 vol), and outputs exact gram formulas for bleach and complementary toners (e.g. violet ash against brassy yellow), preventing chemical hair breakage and costly salon disputes.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'Zentralverband des Deutschen Friseurhandwerks (ZV) · ver.di Besondere Dienstleistungen · BGW',
    recipientEn: 'National Cosmetology Association (NCA) · Intercoiffure Mondial',
    sourceType: 'Craft & Chemistry',
    sourceDe: 'Hair Color Chromatic Level Spectrometry + Peroxide Oxidation Chemical Engine + Counter-Pigment Formulator',
    sourceEn: 'Hair Base Level Computer Vision + Peroxide Oxidation Chemistry + Neutralizing Toner Engine',
    evidenceDe: 'In Deutschland arbeiten über 220.000 Friseurinnen und Friseure in rund 80.000 Salons. Anspruchsvolle Blondierungen und Balayage-Techniken machen über 40% des Salon-Umsatzes aus. Farbfehler, fleckige Blondtöne oder verätztes, abbrechendes Haar führen zu wütenden Kunden, Rufschäden im Internet und Schadensersatzforderungen.',
    evidenceEn: 'Over 220,000 hairstylists work across 80,000 salons in Germany. Bleaching, balayage, and color transformations account for over 40% of salon revenue. Botched brassy colors or chemical hair breakage lead to devastating salon reviews and legal liability.',
    reviewDate: '10/2026',
    problemDe: 'Unter dem warmen, gelblichen Kunstlicht vieler Salons lässt sich die echte Basishöhe (z.B. Tonhöhe 5 Hellbraun vs. Tonhöhe 6 Dunkelblond) kaum mit dem bloßen Auge unterscheiden. Ein falscher Entwickler verbrennt die Schuppenschicht der Haare. Junge Gesellen und Auszubildende sind bei komplexen Farbkorrekturen oft überfordert.',
    problemEn: 'Under warm yellow salon halogen bulbs, discerning true base levels (e.g. Level 5 Light Brown vs Level 6 Dark Blonde) is difficult for the naked eye. Selecting the wrong developer fries hair cuticles. Young apprentices struggle with complex color corrections.',
    workerPersona: {
      name: 'Leyla Demir (27)',
      role: 'Friseurgesellin und Coloristin',
      location: 'Salon SchnittArt, Köln-Ehrenfeld, NRW',
      quoteDe: 'Wenn eine Kundin mit pechschwarz gefärbten Haaren kommt und ein kühles Platinblond wie auf Instagram will, ist das reine Chemie. Ein Fehler beim Abmattieren, und die Haare sind entweder orange wie eine Karotte oder brechen gummiartig ab.',
      quoteEn: 'When a client walks in with box-black hair wanting ice platinum blonde like on Instagram, it is pure chemistry. One mistake in formulating toner, and her hair turns neon carrot orange or breaks off like rubber.',
      storyDe: 'Leyla arbeitet seit vier Jahren als Gesellin im Salon. Samstags herrscht Hochbetrieb: Vier Kundinnen gleichzeitig, Föhngeräusche, Zeitdruck. Letzten Monat wünschte sich eine Kundin ein aschiges Balayage. Unter dem Salonlicht schätzte Leyla den Grundton auf Stufe 6 und wählte 9% Entwickler. Doch das Haar war durch vorherige Behandlungen bereits porös. Die Strähnen rissen beim Kämmen ab, die Kundin verließ weinend den Salon und drohte mit einem Anwalt. Leyla musste den Schaden von 450 € aus eigener Tasche für Pflegebehandlungen übernehmen und verlor tagelang das Selbstvertrauen.',
      storyEn: 'Leyla has worked as a salon colorist for 4 years. Saturdays are chaos: four clients simultaneously, roaring blowdryers, ticking timers. Last month a client asked for an ash balayage. Under salon bulbs, Leyla misjudged the base as Level 6 and used 30-volume developer. The over-processed hair snapped during rinsing. The client left in tears threatening legal action. Leyla absorbed the cost of repair treatments and lost sleep for weeks.'
    },
    realRecipientsList: [
      {
        org: 'Zentralverband des Deutschen Friseurhandwerks (ZV)',
        person: 'Manuela Härtelt-Dören (Präsidentin) & Jörg Müller (Hauptgeschäftsführer)',
        email: 'kontakt@friseurhandwerk.de',
        location: 'Engelsstraße 6, 50670 Köln',
        roleDe: 'Bundesweiter Spitzenverband des deutschen Friseurhandwerks (rund 80.000 Betriebe).',
        roleEn: 'National federation representing 80,000 hairdressing and styling salons in Germany.',
        url: 'https://www.friseurhandwerk.de'
      },
      {
        org: 'ver.di – Bundesfachgruppe Besondere Dienstleistungen (Friseurgewerbe)',
        person: 'Sylvia Bühler (Bundesvorstand)',
        email: 'service.nord@verdi.de',
        location: 'Paula-Thiede-Ufer 10, 10179 Berlin',
        roleDe: 'Gewerkschaftliche Vertretung für Friseurinnen, Auszubildende und Kosmetikerinnen.',
        roleEn: 'Trade union representing salon stylists, colorists, and beauty apprentices.',
        url: 'https://besondere-dienstleistungen.verdi.de'
      },
      {
        org: 'BGW – Berufsgenossenschaft für Gesundheitsdienst und Wohlfahrtspflege',
        person: 'Abteilung Prävention Hautschutz und Friseurhandwerk',
        email: 'kundenzentrum@bgw-online.de',
        location: 'Pappelallee 33/35/37, 22089 Hamburg',
        roleDe: 'Gesetzliche Unfallversicherung zuständig für Haut- und Gesundheitsschutz im Friseurberuf.',
        roleEn: 'Statutory health and safety insurer protecting stylists from chemical contact dermatitis and hazards.',
        url: 'https://www.bgw-online.de'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Smartphone-Sensoren konnten Haarfarben unter Kunstlicht nicht normieren; Farbrechner kannten keine chemischen Wechselwirkungen von Oxidationsmitteln mit porösem Keratin.',
      beforeAiEn: 'Impossible before AI: Camera white balance could not normalize color levels under yellow salon lighting; static charts ignored oxidation interactions on porous keratin.',
      nowEasyDe: 'Heute kinderleicht: Ein Foto mit Referenz-Weißabgleich ermittelt die exakte Basishöhe (1-10) und den Unterton. Die KI gibt die ideale Rezeptur (z.B. „30g Blondierung + 60g 4% Entwickler, danach 20g 9.12 + 40g 1,9% für 12 Minuten") grammgenau aus.',
      nowEasyEn: 'Effortless today: A white-balanced photo reads true base level (1-10) and warmth in seconds. AI generates the exact chemical formulation (e.g. 30g powder + 60g 13-vol, followed by violet toner) down to the gram.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für das Friseurhandwerk: Haar-Aufhellungs- & Abmattierungs-Rechner („RezepturWächter", CC0)',
      subjectEn: 'Gift for hairstylists & colorists: Bleaching & toner formula calculator ("RezepturWächter", CC0)',
      bodyDe: `Sehr geehrte Frau Härtelt-Dören, sehr geehrter Herr Müller,

wir übergeben dem deutschen Friseurhandwerk ein freies, offenes Werkzeug unter CC0 Public Domain: den „RezepturWächter".

Die tägliche Herausforderung im Salon:
Coloristinnen wie Leyla (27) leisten kreative Höchstarbeit unter Zeitdruck. Bei anspruchsvollen Blondierungen und Farbkorrekturen entscheiden Nuancen bei der Basishöhe über perfekten Glanz oder chemischen Haarbruch. Falsches Salonlicht und Unsicherheiten bei Auszubildenden führen oft zu kostspieligen Reklamationen.

Die Lösung:
Foto der Haarsträhne mit automatischem Weißabgleich: Die KI erkennt die exakte Basishöhe und vorhandene Warmpigmente, empfiehlt die schonendste Entwicklerstärke und berechnet die grammgenaue Abmattierungsrezeptur gegen Gelb- und Orangestich.

Frei, ohne Lizenzkosten, zur Unterstützung unserer Friseurinnen und Friseure.

Mit herzlichen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders of the German Hairdressers Federation,

We present "RezepturWächter" (CC0), a free mobile tool that analyzes hair base levels and undertones to calculate precise, damage-free bleach and toner formulas for salon colorists.`
    },
    whyNowDe: [
      'Schutz vor Haarbruch: Verhindert Überbearbeitung der Haarstruktur durch chemisch exakt dosierte Entwickler.',
      'Sicherheit für Auszubildende: Nimmt jungen Friseurinnen die Angst vor komplexen Farbkorrekturen und Blondierungen.',
      'Reklamationsfreiheit: Gewährleistet reproduzierbare, aschige Farbergebnisse ohne unerwünschten Gelb- oder Orangestich.'
    ],
    whyNowEn: [
      'Hair integrity defense: Prevents chemical breakage by calculating the gentlest effective peroxide volumes.',
      'Apprentice empowerment: Removes anxiety from junior stylists performing complex color corrections.',
      'Client satisfaction: Ensures repeatable, cool-toned blondes without unwanted brassy undertones.'
    ],
    firstStepTicketDe: 'Foto der Haarsträhne mit Weißkarte → Erkennung von Basishöhe (1-10) + grammgenaue Rezeptur für Toner und Entwickler',
    firstStepTicketEn: 'Photo of hair strand next to white card → Base level detection (1-10) + exact gram toner & developer formula',
    firstStepCriteriaDe: 'Bestimmt für 10 unterschiedliche Naturhaarmuster die Basishöhe und den Komplementärtoner zuverlässig.',
    firstStepCriteriaEn: 'Accurately determines base level and complementary neutralizing toner for 10 distinct hair samples.',
    tags: ['Echte Arbeit', 'Handwerk', 'Friseur', 'Beauty', 'Chemie', 'Präzision']
  },
  {
    id: 'ai-bus-driver-shift-fatigue-shield',
    title: 'DienstplanWächter: Teilschichten-, Ruhezeit- & Wendezeit-Schutz für Bus- & Bahnfahrer nach FPersG',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Foto des Dienstplans oder Umlaufzettels: Die KI prüft die Einhaltung der gesetzlichen Mindest-Wendezeiten (mindestens 8-10 Minuten an Endhaltestellen zur biologischen Pause), deckt unzulässige Teilschichten („Geteilter Dienst": 4h früh, 4h unbezahlte Pause, 4h abends) und unterschrittene 11-stündige Ruhezeiten nach Fahrpersonalgesetz (FPersG) auf und erstellt eine Betriebsrat-Eingabe, damit übermüdete Fahrer nicht im Berufsverkehr kollabieren.',
    conceptEn: 'Snap a photo of the bus roster or run card: AI audits statutory minimum layover times (8-10 minutes at terminal loops for physiological relief), flags illegal split shifts (4h morning rush, 4h unpaid unpaid gap, 4h evening) and violated 11-hour rest intervals under passenger transport labor statutes (FPersG), auto-generating works council grievances to protect fatigued drivers before peak-hour transit crashes occur.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'VDV (Verband Deutscher Verkehrsunternehmen) · ver.di Verkehr & ÖPNV · EVG',
    recipientEn: 'International Transport Workers\' Federation (ITF) · American Public Transportation Association (APTA)',
    sourceType: 'Public Transport & Safety',
    sourceDe: 'Transit Dispatch Schedule Parser + FPersG Rest Period Validator + Circadian Driver Fatigue Model',
    sourceEn: 'Public Transit Roster OCR + Driver Fatigue & Layover Labor Law Engine',
    evidenceDe: 'Im deutschen Nahverkehr fehlen über 20.000 Bus- und Bahnfahrer. Um den Fahrplan aufrechtzuerhalten, streichen Verkehrsbetriebe Wendezeiten an Endhaltestellen zusammen. Fahrerinnen und Fahrer können stundenlang weder zur Toilette gehen noch etwas trinken, was zu alarmierend hohen Krankenständen und Herz-Kreislauf-Erkrankungen führt.',
    evidenceEn: 'German public transit suffers a shortfall of over 20,000 bus and tram drivers. To maintain paper schedules, operators slash terminal turnarounds down to 2 minutes. Drivers are unable to use restrooms for hours, triggering chronic dehydration and alarming cardiovascular breakdown.',
    reviewDate: '10/2026',
    problemDe: 'Verkehrsbetriebe nutzen komplexe Dienstplan-Software, die Schichten so stückelt, dass Fahrer bis zu 14 Stunden an den Betrieb gebunden sind, aber nur 8 Stunden bezahlt bekommen („geteilter Dienst"). Fahrer haben keine juristische Handhabe, unzulässige Schichtfolgen in verständlicher Form vorzulegen.',
    problemEn: 'Transit agencies use algorithmic scheduling tools that slice shifts across 14-hour spans while paying for only 8 hours ("split shifts"). Individual drivers lack easy tools to mathematically prove statutory rest infringements to management.',
    workerPersona: {
      name: 'Murat Yilmaz (43)',
      role: 'Linienbusfahrer im städtischen Nahverkehr (Gelenkbus 18m)',
      location: 'Verkehrsbetriebe Ruhrgebiet / Dortmund, NRW',
      quoteDe: 'Wenn ich im Berufsverkehr 120 Schulkinder an Bord habe und seit vier Stunden nicht auf die Toilette konnte, weil der Fahrplan drei Minuten Wendezeit vorsieht, ist das lebensgefährlich. Wir sind Menschen, keine Maschinen.',
      quoteEn: 'When I have 120 school kids on board in rush hour traffic and haven’t been able to visit a restroom in four hours due to a 3-minute turnaround, it is dangerous. We are human beings, not machines.',
      storyDe: 'Murat fährt seit 12 Jahren Bus im Ruhrgebiet. Durch Baustellen und Berufsverkehr hat seine Linie 440 regelmäßig 12 Minuten Verspätung. Die vorgesehene Wendezeit an der Endstation beträgt laut Dienstplan 10 Minuten. De facto kommt Murat mit minus 2 Minuten an und muss sofort wieder losfahren – ohne Toilettengang, ohne einen Schluck Wasser. Nach einer Schichtfolge mit Spätdienst bis 23:30 Uhr und anschließendem Frühdienst ab 5:00 Uhr (nur 5,5 Stunden Ruhezeit) erlitt Murat am Steuer einen Schwächeanfall und konnte den Bus gerade noch an den Bordstein lenken.',
      storyEn: 'Murat has driven city buses for 12 years. Gridlock and roadworks routinely delay his route 440 by 12 minutes. The timetable allocates a 10-minute layover at the turnaround loop. In reality, Murat arrives 2 minutes late and must depart immediately—no restroom, no water. After a late shift ending at 11:30 PM followed by a 5:00 AM dawn run (barely 5.5 hours off-duty), Murat suffered dizziness behind the wheel, barely pulling over in time.'
    },
    realRecipientsList: [
      {
        org: 'VDV – Verband Deutscher Verkehrsunternehmen e.V.',
        person: 'Ingo Wortmann (Präsident) & Oliver Wolff (Hauptgeschäftsführer)',
        email: 'info@vdv.de',
        location: 'Kamekestraße 19, 50672 Köln',
        roleDe: 'Branchenverband des Öffentlichen Personen- und Schienengüterverkehrs (über 600 Mitgliedsunternehmen).',
        roleEn: 'National public transport association representing over 600 municipal transit operators.',
        url: 'https://www.vdv.de'
      },
      {
        org: 'ver.di – Bundesfachgruppe Busse und Bahnen (ÖPNV)',
        person: 'Christine Behle (Stellvertretende ver.di-Bundesvorsitzende)',
        email: 'oepnv@verdi.de',
        location: 'Paula-Thiede-Ufer 10, 10179 Berlin',
        roleDe: 'Gewerkschaftliche Vertretung von über 90.000 Beschäftigten im kommunalen Nahverkehr.',
        roleEn: 'Trade union representing over 90,000 public transit workers, bus drivers, and train operators.',
        url: 'https://oepnv.verdi.de'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Fahrer mussten Dienstpläne und Verspätungsprotokolle mühsam per Hand gegen das Fahrpersonalgesetz abgleichen; Betriebsräte wurden erst Wochen nach Verstößen informiert.',
      beforeAiEn: 'Impossible before AI: Drivers had to manually cross-reference paper rosters and delay logs against labor laws; union reps received reports weeks after fatigue violations occurred.',
      nowEasyDe: 'Heute kinderleicht: Ein Foto des Dienstplans per Smartphone: Das Modell liest Schichtfolgen, Pausenfenster und Ruhezeiten aus, markiert FPersG-Verstöße rot und generiert eine formal begründete Beschwerde für den Betriebsrat in 10 Sekunden.',
      nowEasyEn: 'Effortless today: A single phone photo of the duty roster extracts shift sequences and rest gaps, highlighting statutory labor violations in red and formatting a works council safety alert in 10 seconds.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für Bus- & Bahnfahrer: Dienstplan- & Wendezeit-Schutzschild („DienstplanWächter", CC0)',
      subjectEn: 'Gift for bus & tram drivers: Shift fatigue & turnaround labor rights guard ("DienstplanWächter", CC0)',
      bodyDe: `Sehr geehrte Frau Behle, sehr geehrter Herr Wortmann,

wir übergeben den Beschäftigten im ÖPNV ein offenes Werkzeug unter CC0 Public Domain: den „DienstplanWächter".

Die Realität im Fahrdienst:
Busfahrerinnen und Busfahrer wie Murat (43) tragen täglich Verantwortung für hunderte Menschenleben. Doch Verspätungen und zu knapp kalkulierte Wendezeiten führen dazu, dass Fahrer stundenlang keine Pause und keinen Toilettengang haben. Illegale Schichtfolgen gefährden die Verkehrssicherheit aller Verkehrsteilnehmer.

Die Lösung:
Foto des Dienstplans: Die KI prüft minutengenau die gesetzlichen Ruhezeiten nach Fahrpersonalgesetz (FPersG), deckt unzulässige Teilschichten auf und erstellt eine sachliche, rechtskonforme Meldung für Betriebsrat und Schichtleitung.

Für gesunde Fahrer und sicheren Nahverkehr.

Mit kollegialen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders of public transit unions and transport authorities,

We present "DienstplanWächter" (CC0), a free mobile tool that audits bus driver rosters for statutory turnaround and rest-time violations, protecting drivers from fatigue and ensuring passenger safety.`
    },
    whyNowDe: [
      'Verkehrssicherheit für Fahrgäste: Schützt Passagiere und Schulkinder vor schweren Unfällen durch übermüdete Fahrpersonale.',
      'Würde und Gesundheit: Gewährleistet das elementare Menschenrecht auf biologische Pausen und Toilettengänge.',
      'Gegen den Fahrermangel: Verbessert die Arbeitsbedingungen und senkt die dramatische Fluktuation im Nahverkehr.'
    ],
    whyNowEn: [
      'Passenger safety: Protects transit commuters and school children from severe fatigue-related crashes.',
      'Human dignity: Enforces the basic physiological right to timely restroom and hydration breaks.',
      'Driver retention: Mitigates abusive scheduling that drives qualified drivers out of the profession.'
    ],
    firstStepTicketDe: 'Foto des wöchentlichen Dienstplans → Prüfung auf Ruhezeit-Unterschreitung (<11h) & Wendezeiten-Plausibilität',
    firstStepTicketEn: 'Photo of weekly shift roster → Audit for rest period violations (<11h) & turnaround feasibility',
    firstStepCriteriaDe: 'Erkennt in 5 Test-Dienstplänen alle Verstöße gegen das Fahrpersonalgesetz zu 100%.',
    firstStepCriteriaEn: 'Identifies all statutory rest period infringements across 5 test transit rosters with 100% precision.',
    tags: ['Echte Arbeit', 'Transport', 'Busfahrer', 'ÖPNV', 'Sicherheit', 'Arbeitsschutz']
  },
  {
    id: 'ai-waiter-tip-split-shift-guard',
    title: 'GastroWächter: Trinkgeld-Rechner, Teilschicht- & Mehrarbeits-Schutz für Gastronomie & Service',
    round: 'Everyday Workers 2026',
    date: '17.09.2026',
    conceptDe: 'Spracheingabe der Schicht-Uhrzeiten und Kassenschnitt: „11:30 bis 15:00 und 17:30 bis 23:45 Uhr, 84 € Trinkgeld gesamt". Die KI prüft unzulässige Teilschicht-Abzüge, berechnet die steuerfreie Trinkgeld-Ausschüttung nach § 3 Nr. 51 EStG (gegen illegale Einbehaltung durch den Inhaber nach § 107 GewO) und protokolliert Sonn- und Feiertagszuschläge lückenlos für den monatlichen Lohnzettel-Abgleich.',
    conceptEn: 'Spoken shift hours and register closeout: "11:30 to 3:00 and 5:30 to 11:45 PM, 84 € total gratuities." AI flags unlawful split-shift deductions, verifies 100% tax-free tip disbursement under § 3 No. 51 EStG (guarding against wage theft by restaurant owners under § 107 GewO), and logs Sunday/holiday overtime premia to audit monthly pay slips.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'DEHOGA Bundesverband · NGG Gastronomie · Freie Kellner-Initiativen',
    recipientEn: 'Restaurant Workers United (RWU) · European Federation of Food, Agriculture and Tourism (EFFAT)',
    sourceType: 'Hospitality & Labor',
    sourceDe: 'German Trade Regulation § 107 GewO + EStG § 3 Nr. 51 Gratuity Shield + ArbZG Break Calculator',
    sourceEn: 'Hospitality Wage Theft & Gratuity Protection Engine + Split-Shift Overtime Auditor',
    evidenceDe: 'In der deutschen Gastronomie arbeiten über 1,8 Millionen Menschen, überwiegend zu Niedriglöhnen und mit unregelmäßigen Arbeitszeiten. Lohnraub durch unbezahlte Mehrarbeit, das illegale Einbehalten von Trinkgeldern durch Restaurantbetreiber und unterschrittene Pausenzeiten sind trauriger Alltag.',
    evidenceEn: 'Over 1.8 million workers staff Germany’s hospitality industry, predominantly for low base wages and unpredictable hours. Wage theft via unpaid overtime, unlawful confiscation of electronic card tips by managers, and stripped break intervals remain pervasive.',
    reviewDate: '10/2026',
    problemDe: 'Immer mehr Gäste zahlen Trinkgeld mit Karte. Wirte behalten Kartentrinkgelder oft ein oder verrechnen sie mit Kartenzahlungsgebühren – was nach § 107 GewO rechtswidrig ist. Servicekräfte trauen sich aus Angst vor Schichtverlust oft nicht, unvollständige Abrechnungen anzusprechen.',
    problemEn: 'Diners increasingly tip via credit card or digital wallets. Shady managers routinely withhold card tips or deduct terminal processing fees from staff tips—an outright violation of commercial labor codes. Waitstaff fear losing shifts if they complain.',
    workerPersona: {
      name: 'Sofia Rossi (29)',
      role: 'Servicekraft und Chef de Rang in einer belebten Trattoria',
      location: 'Trattoria del Centro, Frankfurt am Main, Hessen',
      quoteDe: 'Wenn ich am Samstagabend 11 Stunden lang Tabletts mit heißen Tellern trage und 18 Kilometer laufe, sind die 60 Euro Trinkgeld mein Überleben für die Miete. Wenn der Chef sagt: ‚Die Kartentrinkgelder decken unsere Gebühren‘, ist das schlicht Diebstahl.',
      quoteEn: 'When I carry heavy hot plates for 11 hours on Saturday night walking 18 kilometers, that €60 tip money pays my rent. When the owner says "digital tips cover card fees", that is plain theft.',
      storyDe: 'Sofia arbeitet seit sechs Jahren in der Gastronomie. Im Restaurant wurde vor einem Jahr bargeldloses Bezahlen eingeführt. Am Monatsende fehlten auf Sofias Abrechnung rund 380 € an Kartentrinkgeldern, die Gäste ihr am Tisch gegeben hatten. Der Restaurantleiter behauptete, das Geld sei für Bruchglas und Transaktionsgebühren verwendet worden. Da Sofia ihre Schichten und Kassenabgleiche nicht lückenlos dokumentiert hatte, konnte sie ihre berechtigten Ansprüche vor dem Arbeitsgericht nicht beweisen.',
      storyEn: 'Sofia has waited tables for 6 years. A year ago her restaurant went cashless. At month’s end, Sofia discovered roughly €380 in digital tips left by her tables were missing from her pay slip. The manager claimed the funds covered broken glassware and card processing charges. Lacking timestamped daily checkout receipts, Sofia had no evidence to bring before the labor tribunal.'
    },
    realRecipientsList: [
      {
        org: 'NGG – Gewerkschaft Nahrung-Genuss-Gaststätten (Hauptvorstand)',
        person: 'Guido Zeitler (Bundesvorsitzender)',
        email: 'hv.gastgewerbe@ngg.net',
        location: 'Haubachstraße 76, 22765 Hamburg',
        roleDe: 'Gewerkschaftliche Interessenvertretung für alle Beschäftigten im Hotel- und Gaststättengewerbe.',
        roleEn: 'Trade union representing hospitality workers, servers, bartenders, and kitchen teams across Germany.',
        url: 'https://www.ngg.net'
      },
      {
        org: 'DEHOGA Bundesverband – Deutscher Hotel- und Gaststättenverband e.V.',
        person: 'Guido Zöllick (Präsident) & Sandra Warden (Geschäftsführerin Arbeitsmarkt)',
        email: 'info@dehoga.de',
        location: 'August-Bebel-Allee 1, 10115 Berlin',
        roleDe: 'Bundesweiter Branchenverband des deutschen Gastgewerbes (rund 65.000 Mitgliedsbetriebe).',
        roleEn: 'National hospitality federation representing 65,000 restaurants and hotels in Germany.',
        url: 'https://www.dehoga-bundesverband.de'
      }
    ],
    techShift: {
      beforeAiDe: 'Vor 2024 unmöglich: Servicekräfte hatten nach einer 10-Stunden-Schicht um 1 Uhr nachts keine Kraft, komplizierte Excel-Tabellen für Trinkgelder und Teilschicht-Überstunden zu pflegen.',
      beforeAiEn: 'Impossible before AI: Exhausted waitstaff leaving at 1:00 AM after a 10-hour weekend shift had neither energy nor tools to log split-shift breaks and card tips into spreadsheets.',
      nowEasyDe: 'Heute kinderleicht: 10-Sekunden Sprachmemo an der Garderobe: „Schicht von 11 bis 15 und 18 bis 23 Uhr, 72 Euro bar, 45 Euro Karte". Das Modell loggt Arbeitszeiten, prüft Zuschläge und generiert ein monatliches Beweisprotokoll für den Lohnzettel.',
      nowEasyEn: 'Effortless today: A 10-second voice memo while putting on your coat: "Shift 11 to 3 and 6 to 11, 72 cash tips, 45 card tips." AI logs work intervals, checks statutory overtime, and generates a tamper-evident audit receipt.'
    },
    readyEmail: {
      subjectDe: 'Geschenk für Gastronomie- & Servicekräfte: Trinkgeld- & Arbeitszeit-Schutzschild („GastroWächter", CC0)',
      subjectEn: 'Gift for hospitality & restaurant workers: Gratuity & split-shift labor shield ("GastroWächter", CC0)',
      bodyDe: `Sehr geehrter Herr Zeitler, sehr geehrte Damen und Herren in der NGG,

wir übergeben den Beschäftigten in Service und Gastronomie ein offenes Werkzeug unter CC0 Public Domain: den „GastroWächter".

Die tägliche Realität der Servicekräfte:
Kellnerinnen und Kellner wie Sofia (29) arbeiten bis tief in die Nacht. Durch die zunehmende Kartenzahlung verschwinden immer häufiger Trinkgelder in den Taschen unehrlicher Betreiber oder werden rechtswidrig mit Betriebskosten verrechnet. Bei Teilschichten werden Pausenzeiten oft manipuliert.

Die Lösung:
Ein 10-Sekunden-Sprachmemo nach Feierabend genügt. Die KI erfasst Arbeitszeiten, berechnet Zuschläge und dokumentiert Bar- und Kartentrinkgelder gerichtsverwertbar, damit die Beschäftigten am Monatsende jeden verdienten Cent erhalten.

Aus Respekt vor harter Arbeit – als freies Geschenk.

Mit herzlichen Grüßen,
Amélie Projekt`,
      bodyEn: `Dear leaders of the Food and Hospitality Workers Union,

We present "GastroWächter" (CC0), a voice-enabled shift and gratuity tracking tool that shields waitstaff from card tip confiscation and unpaid split-shift overtime.`
    },
    whyNowDe: [
      'Schutz vor Lohnraub: Sichert Kellnern und Küchenhilfen den vollen, ungeschmälerten Anspruch auf ihr sauer verdientes Trinkgeld.',
      'Transparenz bei Kartenzahlung: Beendet die Grauzone beim Einbehalt von digitalen Trinkgeldern durch Restaurantbetreiber.',
      'Gesundheitsschutz: Macht unzulässige Schichtlängen und unterschrittene Ruhezeiten zwischen Teilschichten sichtbar.'
    ],
    whyNowEn: [
      'Anti-wage theft defense: Ensures servers and food runners retain 100% of their hard-earned tip earnings.',
      'Cashless transparency: Closes the murky loophole where bosses pocket digital card tips.',
      'Health protection: Mathematically exposes illegal 14-hour split shifts and missing sleep intervals.'
    ],
    firstStepTicketDe: 'Sprachaufnahme der Arbeitszeiten und Trinkgeldbeträge → Monatsnachweis mit Soll-Ist-Abgleich gegen Lohnzettel',
    firstStepTicketEn: 'Voice log of shift hours and tips → Monthly audit slip cross-referencing official employer pay slip',
    firstStepCriteriaDe: 'Berechnet Zuschläge für Nachtarbeit (ab 23:00 Uhr) und Sonntagsarbeit fehlerfrei nach deutschem Tarifstandard.',
    firstStepCriteriaEn: 'Calculates night-work premia (past 11 PM) and Sunday bonuses accurately under statutory standards.',
    tags: ['Echte Arbeit', 'Gastronomie', 'Kellner', 'Service', 'Trinkgeld', 'Rechtsschutz']
  }
];

