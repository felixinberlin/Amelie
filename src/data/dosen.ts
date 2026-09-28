import { DoseItem, DiscardedItem } from '../types';

export const DOSEN_DATA: DoseItem[] = [
  {
    id: 'altbau-thermal',
    title: 'Altbau Thermal',
    titleEn: 'Altbau Thermal (Historic Flat Heat Loss)',
    oneLinerDe: 'Grundriss zeichnen, Baualtersklasse wählen, sehen, was die eigene Wohnung thermisch tut — an der Ecke hinter dem Schrank, nicht im Mittel. Die Innenperspektive zu dem, was EnergyMap Berlin von außen für jedes Gebäude ausrechnet.',
    oneLinerEn: 'Draw your floor plan, pick a construction-era class, and see what your apartment does thermally — at the corner behind the wardrobe, not on average. The inside view to what EnergyMap Berlin calculates from the outside.',
    date: '19. September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Forschungsverbund EnergyMap Berlin (Leitung UdK Berlin, Fachgebiet VPT) · nachrangig: Verbraucherzentrale Berlin (Energieberatung)',
    recipientsEn: 'EnergyMap Berlin research consortium (lead: UdK Berlin, VPT department) · secondary: Verbraucherzentrale Berlin (energy consulting)',
    domain: 'civic',
    verdict: 'gift',
    status: 'zugestellt',
    tags: ['Berlin', 'Energie', 'Zivilgesellschaft', 'WebGL', 'Simulation'],
    problemDe: 'Seit Mai 2025 prognostiziert EnergyMap Berlin den Wärmebedarf des Berliner Gebäudebestands. Offen bleibt: Was tut meine Wohnung? Der Schimmelstreit braucht eine Aussage, die beide Seiten prüfen können („diese Ecke bleibt unter 80 % Oberflächenfeuchte, solange die Raumluft unter X % relativer Feuchte bleibt"). Die 20.000-Euro-Entscheidung braucht einen Variantenvergleich für den eigenen Grundriss, und die Energieberatung braucht etwas, das Ratsuchende mitnehmen können.',
    problemEn: 'Since May 2025, EnergyMap Berlin forecasts the heat demand of Berlin\'s building stock. What remains open: what does my apartment do? The mold dispute needs a statement both sides can check ("this corner stays below 80 % surface humidity as long as room air stays below X % relative humidity"). The €20,000 decision needs a variant comparison for one\'s own floor plan, and energy consulting needs something advice-seekers can take home.',
    whyNowDe: [
      'Grundriss aus Foto oder PDF gibt es als Produkt (RoomSketcher, FloorScan); Öffnungen werden schlechter erkannt als Wände, deshalb bestätigt der Mensch jeden Treffer.',
      'Baualtersklassen-Parameter aus der IWU-Gebäudetypologie (TABULA); die Streuung innerhalb der Klasse ist das Band, das die Oberfläche zeigen muss.',
      'Stationäre 2D-Wärmeleitung läuft mit JavaScript oder WASM im Browser; WebGL2 lohnt erst für die instationäre Echtzeit-Animation.',
      'DWD/BBSR-Testreferenzjahre liefern ortsgenaue Stundenwetterdaten.',
      'EnergyMap bietet CSV-Download und Energieatlas-Dienste, energymap4py ist auf GitHub veröffentlicht; abfragbare Attribute sind vorab zu prüfen.'
    ],
    whyNowEn: [
      'Floor plan from photo or PDF exists as a product (RoomSketcher, FloorScan); openings are recognized worse than walls, so a human confirms every detection.',
      'Construction-era parameters from the IWU building typology (TABULA); the spread within a class is the band the interface has to show.',
      'Steady-state 2D heat conduction runs in the browser with JavaScript or WASM; WebGL2 pays off only for the transient real-time animation.',
      'DWD/BBSR test reference years provide location-specific hourly weather data.',
      'EnergyMap offers CSV download and Energy Atlas services, and energymap4py is published on GitHub; queryable attributes have to be checked first.'
    ],
    sketchDe: 'Rastereditor für Wände, Fenster, Heizkörper; Adresse lädt Gebäudekontext. Wärmeleitung in zwei Schnitten (horizontal für Ecken und Laibungen, vertikal für Decke, Brüstung, Heizkörpernische), Raumluft als durchmischter Knoten. Schimmelrisiko als 80-%-Oberflächenfeuchte (fRsi ≥ 0,70), nicht als Taupunkt; Ausgabe als Temperaturfeld, Feuchtegrenze der Ecke und Verbrauch als Band, nie als Einzelzahl. Direkter A/B-Vergleich zweier Varianten.',
    sketchEn: 'Grid editor for walls, windows, radiators; address loads building context. Heat conduction in two sections (horizontal for corners and reveals, vertical for ceiling, parapet, radiator niche), room air as one well-mixed node. Mold risk as 80 % surface humidity (fRsi ≥ 0.70), not dew point; output as temperature field, the corner\'s humidity limit and consumption as a band, never a single number. Direct A/B comparison of two variants.',
    firstStepDe: {
      ticket: 'Eine Außenecke, ein Fenster, ein Heizkörper, stationär.',
      criteria: 'Rastereditor für einen Raum mit zwei Außenwänden, Regler für Wand-U, Fenster-U, Luftwechsel, Raumfeuchte. Fertig, wenn der 2D-Löser die Testfälle aus Anhang A der DIN EN ISO 10211 reproduziert und die Heizleistung eine Handrechnung nach DIN EN 12831 auf 10 % trifft.'
    },
    firstStepEn: {
      ticket: 'One outer corner, one window, one radiator, steady-state.',
      criteria: 'Grid editor for a room with two exterior walls, sliders for wall U, window U, air exchange, room humidity. Done when the 2D solver reproduces the test cases from Annex A of DIN EN ISO 10211 and the heating power matches a hand calculation per DIN EN 12831 within 10 %.'
    },
    failureModeDe: 'Scheingenauigkeit: Eine Simulation, die präzise aussieht und falsch ist, richtet bei fünfstelligen Sanierungsentscheidungen und im Mietstreit echten Schaden an. Gegenmaßnahme: nie eine Einzelzahl und nie „unbedenklich" (ein 2D-Schnitt unterschätzt echte Raumecken, das Band ist einseitig optimistisch), Validierung gegen etablierte Verfahren, Nicht-Anspruch in der Oberfläche.',
    failureModeEn: 'False precision: a simulation that looks precise and is wrong does real damage in five-figure renovation decisions and rent disputes. Remedy: never a single number and never "harmless" (a 2D section underestimates real room corners, so the band is one-sidedly optimistic), validation against established methods, disclaimer in the interface.',
    priorArtDe: 'Verengt (19.9.2026): Ubakus „Thermische Simulation" (seit 11/2023) rechnet Heizwärme und Sommerüberhitzung als Zonenmodell mit einer Lufttemperatur, ohne Grundriss und Ecken — die Sommerrichtung ist auf Zonenebene besetzt. Wärmebrücken-Werkzeuge (Schöck, Ubakus-U-Wert, ThermCAD, Better Building) rechnen Bauteile für Fachleute; fRsi-Rechner liefern Einzelzahlen. Nicht gefunden: ein Laienwerkzeug aus Grundriss, räumlicher Oberflächentemperatur, Feuchtegrenze und A/B.',
    priorArtEn: 'Narrowed (19 Sep 2026): Ubakus "Thermische Simulation" (since 11/2023) computes heating demand and summer overheating as a zone model with one air temperature, without floor plan or corners — the summer direction is taken at zone level. Thermal-bridge tools (Schöck, Ubakus U-value, ThermCAD, Better Building) compute components for professionals; fRsi calculators give single numbers. Not found: a layperson\'s tool combining floor plan, spatial surface temperature, humidity limit and A/B.'
  },
  {
    id: 'glasanflug-ampel',
    emailTemplates: [
      {
        recipientName: 'NABU Berlin — Artenschutz am Gebäude',
        to: 'artenschutz_am_gebaeude@nabu-berlin.de',
        subjectDe: 'Idee zu verschenken: aus einer Vogelschlag-Meldung eine LAG-VSW-Einstufung machen',
        bodyDe: 'Hallo Frau Lorenz, hallo Frau Friedlein,\n\nich recherchiere Software, die es ohne die letzten Jahre KI-Fortschritt nicht geben könnte, und baue nur wenige davon selbst. Diese hier gehört zu Ihrem Projekt und nicht zu mir, also schenke ich sie Ihnen. CC0, ohne Bedingungen.\n\nIhr Vogelschlagmelder sammelt pro Meldung bis zu fünf Fotos, die Ausrichtung der betroffenen Fassade, die Größe der Anprallspur und eine Adresse. Die Gefahrenkarte zeigt daraus, wo schon etwas passiert ist. Was fehlt, ist der Schritt davor: was diese Fassade unter dem Bewertungsschema der Vogelschutzwarten für eine Einstufung bekäme — und das ist genau der Satz, den Sie brauchen, wenn Sie danach einen Eigentümer oder eine Behörde anschreiben.\n\nSeit dem 10. Juni 2026 ist das in Berlin keine Fleißaufgabe mehr: Die Senatsverwaltung hat die Beurteilungshilfe als einheitlichen Standard für Bau- und Planungsverfahren eingeführt, und die verweist für die Einstufung auf genau dieses Schema. Das Schema selbst ist ein PDF.\n\nDie Idee: eine Bewertungsschicht auf den Melder. Aus den Fotos werden die Situationsfaktoren geschätzt — Glasanteil ohne Markierung, Größe zusammenhängender Scheiben, verglaste Ecken und Durchsichten —, aus OpenStreetMap und dem Baumkataster kommt das Umfeld dazu. Heraus kommt kein Urteil, sondern ein ausgefülltes Blatt: jeder Faktor mit seiner Herkunft und seiner Unsicherheit, von Hand überschreibbar, und was das Bild nicht hergibt, steht als „unbestimmt" drin statt als Zahl.\n\nWarum das jetzt geht, ist der Teil, für den sich das Lesen lohnt: Die Messung, an der alles hängt — wie viel einer Fassade ist Glas —, ist in einer anderen Branche längst gelöst. Die Gebäudeenergie-Forschung zieht Fenster-Wand-Verhältnisse aus Straßenbildern; eine Arbeit von 2025 liegt bei 94 Prozent der Fassaden innerhalb von fünf Prozentpunkten gegenüber der Handmessung und veröffentlicht den Workflow. Auf Vogelschlag hat das noch niemand gerichtet.\n\nDamit Sie meine Hausaufgaben sehen: In Kanada gibt es mit FLAPs BirdSafe-App eine kostenlose Risikoeinschätzung pro Fassade, und LEED führt seit April 2026 Vogelschlag in zwei Credits mit eigenem Punkterechner. Beide fragen den Menschen nach den Eingangswerten. Gemessen wird nirgends — und das deutsche Schema, das als einziges am Vollzug nach Paragraf 44 BNatSchG hängt statt an einem Zertifikat, ist bis heute nicht programmiert.\n\nDen ersten Schritt lege ich bei, weil Ihr Melder unter GPLv3 von einem einzelnen Menschen gepflegt wird und ich nichts über den Zaun werfen möchte: das Bewertungsschema aus Beschluss 21/01 (Stand 2023) als Regeldatei, eine Funktion, die daraus Punktsumme, Risikostufe und Begründung rechnet, und eine Testsuite mit allen elf Beispielen aus dem Anhang des Beschlusses. Keine Bilderkennung, keine Abhängigkeiten außer YAML, CC0 und damit in einem GPL-Projekt verwendbar.\n\nEine Seite mit Skizze, dem nächsten Ticket und der Stelle, an der es kippt: <Link>\n\nDrei Dinge stehen ehrlich darin, weil sie mir wichtig sind. Eine Zahl, die sicherer klingt als die Datenlage, wird in beide Richtungen missbraucht — deshalb Blatt statt Urteil. Eine Karte, die Meldungen zeigt, ist etwas anderes als eine Karte, die Gebäude bewertet; das Zweite gehört ins Anschreiben an den Eigentümer und nicht ins Netz. Und das Schema gehört der LAG VSW: Wenn so etwas gebaut wird, sollte es deren Fassung wortgetreu abbilden und von dort korrigierbar sein.\n\nEine Antwort ist nicht nötig, ich fasse nicht nach. Falls Sie so etwas längst planen, ignorieren Sie die Mail bitte einfach.\n\nViele Grüße\nFélix',
        subjectEn: 'Free idea: turning a bird-collision report into an official risk assessment',
        bodyEn: 'Dear Ms Lorenz, dear Ms Friedlein,\n\nI research software that only became possible through the last few years of AI progress, and I build very few of those ideas myself. This one belongs with your project rather than with me, so it is yours. CC0, no strings.\n\nYour collision reporting tool records up to five photos per report, the orientation of the façade involved, the size of the impact mark and an address. The hazard map shows where something has already happened. What is missing is the step before that: what rating this façade would receive under the assessment scheme of the German state bird conservation authorities — which is exactly the sentence you need when you then write to an owner or an authority.\n\nSince 10 June 2026 that is no longer optional in Berlin: the Senate administration introduced the assessment aid as a uniform standard for building and planning procedures, and it refers for classification to precisely this scheme. The scheme itself is a PDF.\n\nThe idea is an assessment layer on top of your reporting tool. The situational factors are estimated from the photos — share of unmarked glass, size of contiguous panes, glazed corners and see-throughs — and the surroundings come from OpenStreetMap and the tree cadastre. The output is not a verdict but a filled-in sheet: every factor with its origin and its uncertainty, editable by hand, and whatever the image cannot support says "undetermined" instead of a number.\n\nWhy this works now is the part worth reading: the measurement everything hinges on — how much of a façade is glass — has long been solved in another field. Building-energy research extracts window-to-wall ratios from street imagery; a 2025 paper is within five percentage points on 94 % of façades and publishes its workflow. Nobody has pointed it at bird collisions.\n\nSo you can see my homework: Canada has FLAP\'s free BirdSafe app for per-façade risk, and since April 2026 LEED carries bird collisions in two credits with its own scoring sheet. Both ask a human for the input values. Nobody measures — and the German scheme, the only one tied to enforcement under § 44 of the Federal Nature Conservation Act rather than to a certificate, has never been programmed.\n\nI am enclosing the first step, because your tool is GPLv3 and maintained by one person, and I do not want to throw anything over the fence: the scheme from decision 21/01 (2023 revision) as a rule file, a function that computes point sum, risk class and justification, and a test suite covering all eleven worked examples from the decision\'s annex. No computer vision, no dependencies beyond YAML, CC0 and therefore usable inside a GPL project.\n\nOne page with the sketch, the next ticket and the part most likely to kill it: <link>\n\nThree things are stated plainly there because they matter to me. A number that sounds more certain than the evidence gets abused in both directions — hence a sheet, not a verdict. A map of reports is something different from a map that rates buildings; the second belongs in the letter to the owner, not on the web. And the scheme belongs to the authorities who wrote it: anything built on it should reproduce their version verbatim and stay correctable from there.\n\nNo reply needed, and I will not follow up. If this is already on your roadmap, please just ignore the mail.\n\nBest regards\nFélix'
      },
      {
        recipientName: 'NABU Jena — Upstream des Vogelschlagmelders',
        to: 'Kontaktweg von nabu-jena.de kopieren oder Issue im Codeberg-Repo nabu-jena/Vogelschlagmelder — Adresse nicht raten',
        subjectDe: 'Modul zum Mitnehmen: LAG-VSW-Bewertung als Regeldatei plus Funktion (CC0)',
        bodyDe: 'Hallo Herr Schätz,\n\nkurz und ohne Feature-Wunsch: Ich habe etwas gebaut, das zu Ihrem Melder passen könnte, und lege es Ihnen hin, ohne dass daraus eine Verpflichtung entsteht.\n\nDer Vogelschlagmelder sammelt pro Meldung Fotos, Fassadenausrichtung und Adresse. Das sind fast genau die Eingangsgrößen, nach denen das Bewertungsschema der Vogelschutzwarten fragt (Beschluss 21/01, Stand 2023) — vier Kriterien mit je 1 bis 4 Punkten, Summe 4 bis 16, drei Risikostufen. Nur ist das Schema bisher ein PDF.\n\nBeigelegt: das Schema als Regeldatei mit den Wortlauten und einer Versionsangabe, eine reine Funktion, die daraus Punktsumme, Stufe und Begründung rechnet, und eine Testsuite mit allen elf durchgerechneten Beispielen aus dem Anhang des Beschlusses. Python, einzige Abhängigkeit ist YAML, keine Bilderkennung, CC0 — also in einem GPLv3-Projekt verwendbar.\n\nZwei Sachen, die beim Nachrechnen auffielen und die Sie vielleicht interessieren. Erstens: Der Anhang rechnet elf Gebäude durch, und bei einem stehen die Gebäudefaktoren 3 und 3 und darunter „Summe 7". Folgenlos für die Risikostufe, aber ein Argument dafür, das Addieren der Software zu überlassen. Zweitens: Wenn Glasanteil 4 und Fassadengestaltung 1 zusammentreffen, fordern die beiden Vorrangregeln des Schemas das Gegenteil voneinander, und der Beschluss regelt den Fall nicht. Mein Rechner entscheidet ihn deshalb auch nicht, sondern meldet ihn.\n\nWas daraus werden könnte, steht auf einer Seite: <Link>. Kurzfassung: Die drei Situationsfaktoren ließen sich aus den Fotos schätzen, die Sie ohnehin haben — der Glasanteil ist in der Gebäudeenergie-Forschung als Fenster-Wand-Verhältnis aus Straßenbildern schon gelöst. Aus der Meldung würde damit ein prüfbares Blatt für den Eigentümer statt einer Zeile in der Statistik.\n\nWenn das nicht in Ihre Richtung passt oder Sie schlicht keine Zeit haben: völlig in Ordnung, ich fasse nicht nach. Der Code liegt unter CC0 und wartet nicht auf mich.\n\nViele Grüße\nFélix',
        subjectEn: 'A module to take: the German assessment scheme as a rule file plus a function (CC0)',
        bodyEn: 'Hello Mr Schätz,\n\nBriefly, and without a feature request: I built something that might fit your reporting tool, and I am putting it in front of you without creating any obligation.\n\nThe tool collects photos, façade orientation and an address per report. Those are very nearly the inputs the German assessment scheme asks for (decision 21/01, 2023 revision) — four criteria at 1 to 4 points each, a sum of 4 to 16, three risk classes. Except the scheme has only ever been a PDF.\n\nEnclosed: the scheme as a rule file carrying its wording and a version number, a pure function that computes point sum, class and justification, and a test suite covering all eleven worked examples from the decision\'s annex. Python, YAML as the only dependency, no computer vision, CC0 — so usable inside a GPLv3 project.\n\nTwo things surfaced while recomputing it that may interest you. First, the annex works through eleven buildings, and for one of them it lists building factors of 3 and 3 with "sum 7" underneath. Harmless for the risk class, but an argument for letting software do the adding. Second, when a glass share of 4 meets a façade design of 1, the scheme\'s two priority rules demand the opposite of each other, and the decision does not cover that case. My implementation therefore does not decide it either; it reports it.\n\nWhat could come of it fits on one page: <link>. In short: the three situational factors could be estimated from the photos you already have — the glass share is already solved in building-energy research as window-to-wall ratio from street imagery. A report would then yield a checkable sheet for the owner instead of a line in a statistic.\n\nIf that is not your direction, or you simply have no time: entirely fine, I will not follow up. The code is CC0 and is not waiting for me.\n\nBest regards\nFélix'
      },
      {
        recipientName: 'LBV Bayern — Vogelschlag an Glas verhindern',
        to: 'vogelschlag@lbv.de',
        subjectDe: 'Idee zu verschenken: Glasanflug-Risiko aus einem Fassadenfoto schätzen',
        bodyDe: 'Hallo Herr Stimmler,\n\nich recherchiere Software, die es ohne die letzten Jahre KI-Fortschritt nicht geben könnte, und baue nur wenige davon selbst. Diese hier gehört zu Ihrem Projekt und nicht zu mir, also schenke ich sie Ihnen. CC0, ohne Bedingungen.\n\nIhre Münchner Untersuchung von 2020 ist der Grund, warum ich Ihnen schreibe. Neun Gebäudekomplexe, 1.957 Meter Fassade, dreizehn Wochen zweimal wöchentlich abgelaufen — und am Ende der klare Befund, dass unmarkierte Glaswände pro Meter rund achtundzwanzigmal so viele Opfer fordern wie Fassaden, während die markierten Lärmschutzwände bei null blieben. Diese Arbeit skaliert mit Personal und mit nichts sonst. Dasselbe gilt für die Plakette: Online-Formular, Foto, und dann fährt geschultes Personal hin.\n\nDie Idee setzt genau dort an. Das Bewertungsschema der Vogelschutzwarten fragt nach vier Dingen, und drei davon sind Geometrie und Umfeld: Glasanteil ohne Markierung, Größe zusammenhängender Scheiben, Abstand zu Gehölzen und Versiegelung der Umgebung. Diese Größen ließen sich aus einem Fassadenfoto und offenen Geodaten schätzen, statt sie abzufragen. Heraus käme kein Urteil, sondern ein ausgefülltes Blatt: jeder Faktor mit seiner Herkunft und seiner Unsicherheit, von Hand überschreibbar, und was das Bild nicht hergibt, steht als „unbestimmt" drin statt als Zahl.\n\nWarum das jetzt geht: Die Messung des Glasanteils ist in der Gebäudeenergie-Forschung gelöst — Fenster-Wand-Verhältnis aus Straßenbildern, eine Arbeit von 2025 trifft 94 Prozent der Fassaden auf fünf Prozentpunkte genau und veröffentlicht den Workflow. Auf Vogelschlag hat das niemand gerichtet.\n\nDen langweiligen ersten Schritt lege ich bei: das Schema aus Beschluss 21/01 (Stand 2023) als Regeldatei, eine Funktion, die Punktsumme, Stufe und Begründung rechnet, und Tests mit allen elf Beispielen aus dem Anhang. Keine Bilderkennung, CC0. Nebenbefund daraus, der Sie amüsieren dürfte: Bei einem der elf Beispiele addiert der Anhang 3 und 3 zu „Summe 7".\n\nEine Seite mit Skizze, nächstem Ticket und der Stelle, an der es kippt: <Link>\n\nZwei Vorbehalte gehören dazu. Eine Zahl, die sicherer klingt als die Datenlage, wird in beide Richtungen missbraucht — deshalb Blatt mit sichtbaren Eingangswerten statt Ampel allein. Und das Schema gehört der LAG VSW; ein Werkzeug, das es ohne sie auslegt, spaltet die Praxis in zwei Verfahren.\n\nEine Antwort ist nicht nötig, ich fasse nicht nach. Falls Sie so etwas längst planen, ignorieren Sie die Mail bitte einfach.\n\nViele Grüße\nFélix',
        subjectEn: 'Free idea: estimating bird-collision risk from a façade photo',
        bodyEn: 'Hello Mr Stimmler,\n\nI research software that only became possible through the last few years of AI progress, and I build very few of those ideas myself. This one belongs with your project rather than with me, so it is yours. CC0, no strings.\n\nYour 2020 Munich survey is why I am writing. Nine building complexes, 1,957 metres of façade, thirteen weeks walked twice a week — and a clear finding at the end: unmarked glass walls cost roughly twenty-eight times as many victims per metre as façades, while the marked noise barriers stayed at zero. That work scales with staff and with nothing else. The same is true of your bird-friendly glass plaque: an online form, a photo, and then trained personnel drive out.\n\nThe idea starts exactly there. The assessment scheme asks about four things, and three of them are geometry and surroundings: share of unmarked glass, size of contiguous panes, distance to woody vegetation, and how sealed the surroundings are. Those could be estimated from a façade photo plus open geodata instead of being asked for. The output would be no verdict but a filled-in sheet: every factor with its origin and its uncertainty, editable by hand, with "undetermined" instead of a number wherever the image does not support one.\n\nWhy now: measuring the glass share is solved in building-energy research — window-to-wall ratio from street imagery, with a 2025 paper landing within five percentage points on 94 % of façades and publishing its workflow. Nobody has pointed it at bird collisions.\n\nI enclose the deliberately boring first step: the scheme from decision 21/01 (2023 revision) as a rule file, a function computing point sum, class and justification, and tests covering all eleven examples from the annex. No computer vision, CC0. One by-product may amuse you: in one of those eleven examples, the annex adds 3 and 3 to "sum 7".\n\nOne page with the sketch, the next ticket and the part most likely to kill it: <link>\n\nTwo caveats belong with it. A number that sounds more certain than the evidence gets abused in both directions — hence a sheet with visible inputs rather than a traffic light alone. And the scheme belongs to the state bird conservation authorities; a tool that interprets it without them splits practice into two procedures.\n\nNo reply needed, and I will not follow up. If this is already planned on your side, please just ignore the mail.\n\nBest regards\nFélix'
      },
      {
        recipientName: 'LAG VSW — Eigentümerin des Schemas',
        to: 'Adresse aus dem Kontaktblock des Beschlusses übernehmen (Staatliche Vogelschutzwarte, Bayerisches LfU) — vorher gegenprüfen',
        subjectDe: 'Beschluss 21/01 maschinenlesbar — zwei Rückfragen aus dem Nachrechnen',
        bodyDe: 'Sehr geehrte Damen und Herren,\n\nich habe Ihren Beschluss 21/01 in der Fassung von 2023 in eine maschinenlesbare Form gebracht — die vier Kriterien aus Tabelle 3 mit ihren Punktwerten und Wortlauten, die Risikostufen aus Tabelle 4, die Schwellenwerte der drei Gebäudekategorien und die acht Anwendungsgrundsätze. Dazu eine kleine Funktion, die daraus Punktsumme, Risikostufe und Begründung rechnet, und eine Testsuite, die alle elf durchgerechneten Beispiele aus Ihrem Anhang nachrechnet. Das Ganze steht unter CC0 und ist damit frei verwendbar, auch von Ihnen, ohne dass ich etwas davon habe.\n\nDer Anlass ist nicht, Ihnen ein Produkt anzubieten, sondern zwei Dinge zurückzumelden, die beim Nachrechnen aufgefallen sind.\n\nErstens: Im Anhang, beim Beispiel „Berlin, Forschungszentrum", stehen die Gebäudefaktoren 3 und 3 und darunter „Summe 7"; der Gesamtwert ist mit 13 angegeben. Nachgerechnet ergeben sich 6 und damit 12. An der Risikostufe ändert das nichts — beide Werte liegen in „hoch" —, aber falls es eine überarbeitete Fassung gibt, wäre das eine Zeile.\n\nZweitens, und das ist die eigentliche Frage: Tabelle 3 enthält zwei Vorrangregeln, die die Punktsumme überstimmen. Ein Glasanteil von 4 Punkten führt zur Gesamtbewertung „hoch", eine Lochfassade mit Fensteröffnungen bis 1,5 Quadratmeter zur Gesamtbewertung „gering". Treffen beide zu — etwa eine Lochfassade mit einer freistehenden, vollverglasten Windschutzeinfriedung im selben Abschnitt —, fordern die Regeln das Gegenteil voneinander. Der Beschluss regelt diesen Fall nach meinem Lesen nicht. Meine Umsetzung entscheidet ihn deshalb nicht selbst, sondern meldet ihn als Konflikt und fällt auf die Punktsumme zurück. Falls es dazu eine Auslegung gibt, würde ich sie gerne wortgetreu abbilden statt sie zu erfinden.\n\nHintergrund, kurz: Ich recherchiere Softwareideen und verschenke die, die ich nicht selbst baue. Hier geht es um die Frage, ob sich die drei situationsbezogenen Kriterien — Glasanteil, Umgebung, Abstand zu Gehölzen — aus einem Fassadenfoto und offenen Geodaten schätzen lassen, damit Ihre Einschätzung nicht mehr an einem Ortstermin hängt. Die Ausgabe wäre ausdrücklich kein Urteil, sondern ein ausgefülltes Blatt mit sichtbaren Eingangswerten und der Angabe, was unbestimmt blieb. Die Beschreibung liegt hier: <Link>\n\nMir ist wichtig, dass so etwas Ihre Fassung wortgetreu abbildet und von Ihnen korrigierbar bleibt — sonst entstehen zwei Verfahren, und das hilft niemandem.\n\nEine Antwort ist nicht nötig, ich fasse nicht nach.\n\nMit freundlichen Grüßen\nFélix',
        subjectEn: 'Decision 21/01 in machine-readable form — two questions from recomputing it',
        bodyEn: 'Dear Sir or Madam,\n\nI have put your decision 21/01 in its 2023 revision into machine-readable form — the four criteria of Table 3 with their point values and wording, the risk classes of Table 4, the thresholds for the three building categories and the eight application principles. Alongside it, a small function that computes point sum, risk class and justification, and a test suite that recomputes all eleven worked examples from your annex. All of it is CC0 and therefore freely usable, including by you, with nothing in it for me.\n\nThe reason for writing is not to offer you a product, but to report two things that surfaced while recomputing.\n\nFirst: in the annex, at the example "Berlin, Forschungszentrum", the building factors are listed as 3 and 3 with "sum 7" underneath, and the total is given as 13. Recomputed, they come to 6 and therefore 12. This changes nothing about the risk class — both values fall in "high" — but if there is ever a revised edition, it is a one-line fix.\n\nSecond, and this is the actual question: Table 3 contains two priority rules that override the point sum. A glass share of 4 points leads to an overall rating of "high", while a punched façade with openings up to 1.5 m² leads to an overall rating of "low". Where both apply — a punched façade with a free-standing, fully glazed wind screen in the same section, say — the rules demand the opposite of each other. As far as I can read it, the decision does not resolve that case. My implementation therefore does not resolve it either: it reports a conflict and falls back on the point sum. If there is an established interpretation, I would rather reproduce it verbatim than invent one.\n\nBackground, briefly: I research software ideas and give away the ones I will not build myself. The question here is whether the three situational criteria — glass share, surroundings, distance to woody vegetation — can be estimated from a façade photo plus open geodata, so that an assessment no longer depends on a site visit. The output would explicitly not be a verdict but a filled-in sheet with visible input values and a statement of what remained undetermined. The description is here: <link>\n\nWhat matters to me is that anything of this kind reproduces your version verbatim and stays correctable by you — otherwise two procedures come into being, and that helps nobody.\n\nNo reply is necessary, and I will not follow up.\n\nYours sincerely\nFélix'
      }
    ],
    title: 'Glasanflug-Ampel',
    titleEn: 'Bird Glass Hazard Score',
    oneLinerDe: 'Die Fassadenfotos, die beim Melden eines toten Vogels ohnehin hochgeladen werden, einmal durchrechnen — Glasanteil, gespiegeltes Grün, Durchsichten, Ecken — und daraus den Entwurf einer LAG-VSW-Bewertung erzeugen, mit jedem Eingangswert und seiner Unsicherheit auf dem Blatt.',
    oneLinerEn: 'Take the façade photos that German bird-collision reports already carry, compute them once — glass share, reflected greenery, see-throughs, glazed corners — and return a draft assessment under the official German scheme, with every input and its uncertainty on the page.',
    date: '22. September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'NABU Berlin, Projekt „Artenschutz am Gebäude" (Julia Lorenz, Helen Friedlein) mit NABU Jena (Upstream des quelloffenen Vogelschlagmelders) · zweiter Empfänger: LBV Bayern, Projekt „Vogelschlag an Glas verhindern" · fachlicher Eigentümer des Schemas: LAG VSW',
    recipientsEn: 'NABU Berlin, "Artenschutz am Gebäude" project, together with NABU Jena (upstream of the open-source collision reporting tool) · second recipient: LBV Bavaria · owner of the scheme: LAG VSW (German state bird conservation authorities)',
    domain: 'civic',
    verdict: 'gift',
    status: 'zugestellt',
    tags: ['Berlin', 'Artenschutz', 'Vogelschlag', 'Vogel', 'Bird Protection', 'Glasanflug', 'Vollzug', 'Computer Vision', 'Geodaten', 'Open Source', 'Skelett gebaut'],
    problemDe: 'Über 5 % der jährlich in Deutschland vorkommenden Vögel sterben an Glas, nur 15–35 % der Opfer werden gefunden. Rechtlich entscheidet eine Frage: Ist das Tötungsrisiko nach § 44 Abs. 1 Nr. 1 BNatSchG signifikant erhöht? Die LAG VSW zieht die Grenze bei zwei Schlagopfern je 100 m Fassade und Jahr als normal, ab fünf als signifikant erhöht. Die Münchner Untersuchung (LBV mit LfU Bayern, 2021) zeigt, was das in der Praxis heißt: neun Komplexe, 1.957 m Fassade, dreizehn Wochen zu Fuß — unmarkierte Glaswände 0,41 Kollisionen pro Meter, Fassaden 0,02, markierte Lärmschutzwände null. Diese Arbeit skaliert mit Personal und mit nichts sonst. Seit dem 10.06.2026 ist Berlins Beurteilungshilfe einheitlicher Standard für Bau- und Planungsverfahren und verweist für die Einstufung auf ein Punkteschema, das als PDF existiert.',
    problemEn: 'More than 5 % of the birds occurring in Germany each year die on glass, and only 15–35 % of victims are ever found. One legal question decides everything: is the killing risk significantly elevated under § 44 BNatSchG? The threshold is two collision victims per 100 m of façade per year as normal, five or more as significantly elevated. A Munich field study (LBV with the Bavarian environment agency, 2021) shows what that means in practice: nine complexes, 1,957 m of façade, thirteen weeks on foot — unmarked glass walls 0.41 collisions per metre, façades 0.02, marked noise barriers zero. That work scales with staff and nothing else. Since 10 June 2026 Berlin\'s assessment aid has been the uniform standard for building and planning procedures, and it refers for classification to a point scheme that exists as a PDF.',
    whyNowDe: [
      'Die Fotos sind schon da: Der quelloffene Vogelschlagmelder (NABU Jena, Leipzig, Berlin, seit Februar 2026) erfasst pro Meldung bis zu fünf Fotos, die Ausrichtung der betroffenen Fassade, die Größe der Anprallspur und eine geokodierte Adresse.',
      'Der Glasanteil einer Fassade ist ein gelöstes Messproblem — in der Gebäudeenergie-Branche: Fenster-Wand-Verhältnis aus Straßenbildern, Suppa u. a. 2025 mit YOLOv9, bei 94 % der Fassaden innerhalb von fünf Prozentpunkten, Workflow offen veröffentlicht.',
      'Glas- und Transparenzsegmentierung ist ein eigenes Forschungsfeld (Mirror-and-Glass-Reihe der City University Hong Kong, TransCues auf der WACV 2026); NFGlassNet erkennt Glas über den Kontrast der Spiegelung zwischen Blitz- und Nicht-Blitz-Aufnahme.',
      'Das Umfeld ist eine Abfrage: Grün, Wasser und Alleen stehen in OpenStreetMap, Berlin hat ein Baumkataster mit rund 885.000 Einzelbäumen.',
      'Die Plattform ist quelloffen: der Melder liegt unter GPLv3 auf Codeberg, Python, Docker, aktiv gepflegt, von anderen Gruppen selbst hostbar. Eine Bewertungsschicht muss nichts neu bauen, sie dockt an.'
    ],
    whyNowEn: [
      'The photos already exist: the open-source collision reporting tool (NABU Jena, Leipzig, Berlin, live since February 2026) records up to five photos per report, the orientation of the façade involved, the size of the impact mark and a geocoded address.',
      'Measuring a façade\'s glass share is solved — in the building-energy field: window-to-wall ratio from street imagery, Suppa et al. 2025 with YOLOv9, within five percentage points on 94 % of façades, workflow published openly.',
      'Glass and transparency segmentation is its own research field (City University Hong Kong\'s mirror-and-glass series, TransCues at WACV 2026); NFGlassNet detects glass through the contrast in reflections between flash and no-flash shots.',
      'The surroundings are a query: greenery, water and tree lines are in OpenStreetMap, and Berlin has a tree cadastre with some 885,000 individual trees.',
      'The platform is open source: the reporting tool is GPLv3 on Codeberg, Python, Docker, actively maintained, self-hostable. An assessment layer need not build anything; it docks.'
    ],
    sketchDe: 'Eingabe ist die Meldung, die ohnehin entsteht — Fotos, Fassadenrichtung, Koordinate. Glasflächen segmentieren, Anteil und Größe zusammenhängender Scheiben je Höhenzone bestimmen, geometrische Sonderfälle erkennen (verglaste Ecke, Durchsicht, freistehende Scheibe), Spiegelinhalt klassifizieren (Himmel, Vegetation, Bau), Umfeld aus OSM und Baumkataster auf mehreren Radien. Gerechnet wird mit einer maschinenlesbaren Fassung des Schemas — Faktoren, Punktwerte, Schwellen im Wortlaut, mit Versionsnummer. Ausgabe ist eine Seite: Foto mit Overlays, jeder Faktor mit geschätztem Wert, Herkunft der Schätzung und Unsicherheit, von Hand überschreibbar. Was das Bild nicht hergibt, steht als „unbestimmt" da und nicht als Zahl. Nicht dabei: Produktempfehlungen, Zertifikat, automatisches § 44-Urteil, Prognose toter Vögel, flächendeckende Bewertung fremder Gebäude aus Straßenbildern.',
    sketchEn: 'Input is the report that is created anyway — photos, façade orientation, coordinate. Segment glass surfaces, determine share and size of contiguous panes per height zone, detect geometric special cases (glazed corner, see-through, free-standing pane), classify what is reflected (sky, vegetation, built), query surroundings from OSM and the tree cadastre at several radii. Scoring runs on a machine-readable version of the scheme — factors, point values and thresholds verbatim, with a version number. Output is one page: photo with overlays, every factor with its estimated value, the origin of that estimate and its uncertainty, editable by hand. Anything the image cannot support says "undetermined", not a number. Not included: product recommendations, certification, automatic legal verdicts, death-count forecasts, blanket scoring of other people\'s buildings from street imagery.',
    firstStepDe: {
      ticket: 'Erledigt am 22.09.2026: das Schema ausführbar machen, ohne eine Zeile Bilderkennung. Liegt in 04-werkzeug/glasanflug-ampel/ und als interaktiver Browser-Simulator.',
      criteria: 'Regeldatei mit den Wortlauten des Beschlusses, reine Bewertungsfunktion mit Herkunftsangabe je Eingabewert, 26 Tests grün — darunter alle elf durchgerechneten Beispiele aus dem Anhang des Beschlusses und die Münchner Felddaten. Interaktiver Simulator im Browser bereit. Nächstes Ticket: Kriterium 1 (Anteil frei sichtbarer Glasfläche ohne Markierung) aus einem gemeldeten Fassadenfoto schätzen. Fertig, wenn für dreißig handbestimmte Fassaden die geschätzte Stufe in vier von fünf Fällen stimmt und jede Abweichung mit dem Bild daneben erklärbar ist.'
    },
    firstStepEn: {
      ticket: 'Done on 22 Sep 2026: make the scheme executable without a single line of computer vision. Lives in 04-werkzeug/glasanflug-ampel/ and as an interactive browser simulator.',
      criteria: 'Rule file carrying the decision\'s wording, a pure scoring function with an origin tag per input, 26 tests green — including all eleven worked examples from the decision\'s annex and the Munich field data. Interactive browser simulator operational. Next ticket: estimate criterion 1 (share of freely visible unmarked glass) from a reported façade photo. Done when the estimated band is right for four out of five of thirty hand-measured façades and every deviation is explainable from the image.'
    },
    failureModeDe: 'Eine Zahl, die sicherer klingt als die Datenlage, wird in beide Richtungen missbraucht — deshalb ausgefülltes Blatt mit sichtbaren Eingangswerten statt Urteil. Die Evidenz widerspricht dem Schema teilweise: Li u. a. 2025 (3.078 Gebäude, 65.633 Erfassungstage) finden die Vegetationswirkung auf 1.000 m bis 10 km, und Bäume innerhalb von 5 m senkten das Herbstrisiko; Samuels u. a. 2022 fanden kleine Oberlichter fast so oft getroffen wie große Glastüren. Der Beschluss lässt den Reflexionsgrad bewusst außen vor, weil dafür „noch keine geeigneten Einstufungskriterien vorliegen" — wer ihn misst, erweitert das Schema und muss das ausweisen. Und der Weg vom Planungshilfsmittel zum Pranger ist kurz: Meldedaten enthalten Adressen; Bewertungen gehören in das Anschreiben an den Eigentümer, nicht auf eine öffentliche Karte.',
    failureModeEn: 'A number that sounds more certain than the evidence gets abused in both directions — hence a filled-in sheet with visible inputs instead of a verdict. The evidence partly contradicts the scheme: Li et al. 2025 (3,078 buildings, 65,633 survey days) found vegetation predicting at 1,000 m to 10 km, and trees within 5 m reduced autumn risk; Samuels et al. 2022 found small transom windows struck nearly as often as large glass doors. The decision deliberately leaves reflectance out because "no suitable classification criteria exist yet" — measuring it extends the scheme and must be declared. And the path from planning aid to pillory is short: reports carry addresses, so assessments belong in the letter to the owner, not on a public map.',
    priorArtDe: 'Verengt (21./22.09.2026, korrigiert von „frei"): Der Rechner existiert zweimal, nur anderswo. FLAP Canada betreibt mit flapapp.ca eine kostenlose BirdSafe-App, die Tag- und Nachtrisiko pro Fassade schätzt — als geführter Fragebogen ohne Bildauswertung. LEED führt seit April 2026 in v5 Vogelschlag in zwei Credits mit Threat Factor ≤ 30 nach ABC-Skala, CSA A460:19 gilt als kanadischer Alternativweg; Pilot Credit SSpc55 rechnet mit offizieller Tabellenvorlage, bewertet aber Materialien aus der Planung. New York (Local Law 15, seit 2021) und Toronto (seit 2010) haben Nachweismärkte, bedient von Beratungsbüros; Compliance-Software nicht gefunden. Österreich prüft Markierungen nach ONR 191040 im Flugtunnel Hohenau (mindestens 90 % Meiderate) — die Produktseite ist gründlich abgedeckt. In Deutschland: LAG VSW Beschluss 21/01 (aktualisiert 2023, im Auftrag der LANA, den Ländern zur Anwendung empfohlen), Berliner Beurteilungshilfe, Merkblätter — kein digitales Werkzeug, das das Schema rechnet. Die Gegenrichtung ist seit Februar 2026 besetzt: vogelschlagmelder.de sammelt Opferfunde, die Gefahrenkarte dort ist eine Heatmap der Meldungen, keine Bewertung. Melden ist gelöst, Bewerten nicht.',
    priorArtEn: 'Narrowed (21/22 Sep 2026, corrected from "free"): the calculator exists twice, elsewhere. FLAP Canada runs flapapp.ca, a free BirdSafe app estimating day and night risk per façade — a guided questionnaire without image analysis. Since April 2026 LEED v5 carries bird collisions in two credits requiring an ABC threat factor ≤ 30, with CSA A460:19 as the Canadian compliance path; Pilot Credit SSpc55 computes via an official spreadsheet but scores materials from a design. New York (Local Law 15, in force since 2021) and Toronto (since 2010) created documentation markets served by consultancies; compliance software was not found. Austria tests markings under ONR 191040 in the Hohenau flight tunnel (at least 90 % avoidance) — the product side is thoroughly covered. In Germany: LAG VSW decision 21/01 (updated 2023, commissioned by the LANA and recommended to the federal states), Berlin\'s assessment aid, various leaflets — no digital tool that computes the scheme. The opposite direction has been occupied since February 2026: vogelschlagmelder.de collects victim reports, and its hazard map is a heatmap of those reports, not an assessment. Reporting is solved. Rating is not.'
  },
  {
    id: 'eurobirdcast',
    title: 'EuroBirdCast',
    titleEn: 'EuroBirdCast: Auditable Migration Curtailment',
    image: 'eurobird.png',
    imageAlt: 'Dreiteilige Infografik zu EuroBirdCast: links eine Karte der europäischen Wetterradare mit Abdeckungskreisen, in der Mitte der Weg vom Rohsignal über die Vogelextraktion zur Mehrradar-Fusion, rechts eine Zugdichtekarte über Deutschland mit Dreistundenprognose.',
    imageAspect: 1.5,
    oneLinerDe: 'Aus bereits offen vorliegenden, wetterradarbasierten Vogelzugprofilen eine turbinenspezifische Abschaltempfehlung erzeugen, die eine Behörde ohne den Dienst selbst nachrechnen kann. Arbeitstitel — der Name kollidiert mit BirdCast (Cornell/CSU).',
    oneLinerEn: 'Turn already public, weather-radar-derived bird migration profiles into a turbine-specific curtailment recommendation a regulator can recompute without the service itself. Working title — the name collides with BirdCast (Cornell/CSU).',
    date: '22. September 2026 (nach Prüfung neu geschrieben)',
    reviewAfter: 'März 2027',
    recipientsDe: 'Offen — erst nach M0 zu entscheiden. Kandidaten: BfN / BioConsult SH (Fortsetzung von RADBIRD), Vogelschutzwarte im LfU Brandenburg (Zentrale Fundkartei), Betreiberverbände. Ausdrücklich nicht: ENRAM (seit 2017 beendet), UvA/WSL/INBO (betreiben HiRAD selbst), Prototype Fund (nicht antragsberechtigt).',
    recipientsEn: 'Open — to be decided only after M0. Candidates: BfN / BioConsult SH (RADBIRD successor), LfU Brandenburg bird conservation station (central carcass registry), operator associations. Explicitly not: ENRAM (ended 2017), UvA/WSL/INBO (they run HiRAD themselves), Prototype Fund (not eligible).',
    domain: 'physics',
    verdict: 'build_first',
    status: 'gepackt',
    tags: ['Vogelschutz', 'Windkraft', 'Radar', 'Open Data', 'vol2bird', 'MTR', 'Nachrechenbarkeit', 'Verdikt korrigiert'],
    problemDe: 'Die Erstfassung dieser Dose behauptete, Windparks würden pauschal nach Kalendermonaten abgeschaltet. Das stimmt nicht: Onshore in Deutschland gibt es für den Vogelzug überhaupt keine Abschaltauflage. Die Nachtabschaltungen im Spätsommer sind Fledermaus-Auflagen und an Temperatur (≥ 10 °C) und Windgeschwindigkeit (< 6 m/s) gekoppelt, die phänologischen gelten Brutvögeln (§ 45b BNatSchG, nicht § 44). Das wirkliche Problem ist ein anderes: Wo abgeschaltet wird — in den Niederlanden seit Mai 2023 verpflichtend, bei kommerziellen Systemen automatisch — kann niemand außerhalb des Systems nachprüfen, ob eine Abschaltung richtig war oder eine unterlassene falsch. Es fehlt die Nachrechenbarkeit, nicht die Messung.',
    problemEn: 'The first draft of this tin claimed wind farms are shut down by calendar month. They are not: onshore Germany has no migration-based curtailment obligation at all. The late-summer night shutdowns are bat conditions tied to temperature (≥ 10 °C) and wind speed (< 6 m/s); the phenological ones protect breeding birds (§ 45b BNatSchG, not § 44). The real problem is a different one: where curtailment does happen — mandatory in the Netherlands since May 2023, automatic in commercial systems — nobody outside the system can verify whether a shutdown was justified or a missing one was not. What is missing is recomputability, not measurement.',
    whyNowDe: [
      'Die Profile für Deutschland sind bereits gerechnet und offen: RMI/KMI Belgien rechnet seit Oktober 2019 täglich vol2bird-Profile für die deutschen Radare deess (Essen) und denhb (Neuheilenbach), frei abrufbar. Kein eigenes Ingest, kein HDF5, kein Docker nötig.',
      'FlySafe (UvA/KNMI/niederländische Luftwaffe) liefert seit August 2026 5-Minuten-Echtzeitprofile über NL, BE und DE, frei nutzbar über das KNMI Data Platform.',
      'Der Werkzeugkasten ist gepflegt: vol2birdR 1.3.2 (16.09.2026), bioRad 0.12.0.9000 (21.07.2026), getRad (CRAN) für die DWD-Rohdaten.',
      'Die Schwellenwerte sind veröffentlicht: 250 und 500 MTR (Welcker 2022, BfN-Schriften 635); NL offshore 500 Vögel/km/h, windabhängig 400/900/500 (van Bemmelen u. a. 2022).',
      'Die Gegenrichtung ist besetzt und damit Kalibrierquelle: Die Vogelschutzwarte im LfU Brandenburg führt seit 2002 die bundesweite Zentrale Fundkartei für Windkraftopfer.'
    ],
    whyNowEn: [
      'The profiles for Germany are already computed and open: RMI/KMI Belgium has computed daily vol2bird profiles for the German radars deess (Essen) and denhb (Neuheilenbach) since October 2019, freely available. No ingestion, no HDF5, no Docker needed.',
      'FlySafe (UvA/KNMI/Royal Netherlands Air Force) has delivered free 5-minute real-time profiles across NL, BE and DE since August 2026 via the KNMI Data Platform.',
      'The toolchain is maintained: vol2birdR 1.3.2 (16 Sep 2026), bioRad 0.12.0.9000 (21 Jul 2026), getRad (CRAN) for the raw DWD data.',
      'The thresholds are published: 250 and 500 MTR (Welcker 2022, BfN-Schriften 635); NL offshore 500 birds/km/h, wind-dependent 400/900/500 (van Bemmelen et al. 2022).',
      'The opposite direction is occupied and therefore a calibration source: the LfU Brandenburg bird conservation station has run the national carcass registry for wind turbine casualties since 2002.'
    ],
    sketchDe: 'Eingabe sind fertige VPTS-Profile (RMI/KMI für deess und denhb, FlySafe für Echtzeit) statt eigener Radarverarbeitung. Daraus wird eine einzige Kennzahl abgeleitet: MTR auf Rotorhöhe, also Vögel je Kilometer Frontbreite und Stunde, integriert über die Rotorebene (Referenzanlage DE-Zubau H1/2025: Nabe 146 m, Rotor 150 m, also 71–221 m). MTR ist die Einheit, in der die Schwellenwerte in DE, NL und BE formuliert sind, und damit die einzige, in der sich ein Ergebnis gegen veröffentlichte Grenzwerte prüfen lässt. Die Schwellen stehen in einer Datei mit Quellenangabe, nicht im Code, und werden mit Unsicherheitsband geführt. Der eigentliche Beitrag ist die Audit-Zeile: Radarquelle, Zeit, Höhenprofil, MTR, Unsicherheit, verwendete Schwelle mit Quelle, Ertragsverlust und Entscheidung — so, dass eine Behörde die Abschaltung ohne den Dienst nachrechnen kann. Genau das hält kein kommerzielles System offen.',
    sketchEn: 'Input is finished VPTS profiles (RMI/KMI for deess and denhb, FlySafe for real time) instead of in-house radar processing. From them a single metric is derived: MTR at rotor height, birds per km of front per hour integrated over the rotor-swept zone (German reference turbine H1/2025: hub 146 m, rotor 150 m, hence 71–221 m). MTR is the unit in which thresholds are formulated in DE, NL and BE, and therefore the only one in which a result can be checked against published limits. Thresholds live in a cited data file rather than in code and carry an uncertainty band. The actual contribution is the audit record: radar source, time, altitude profile, MTR, uncertainty, threshold with citation, energy loss and decision — such that a regulator can recompute the curtailment without the service. No commercial system exposes this.',
    firstStepDe: {
      ticket: 'M0: Bedarfsklärung. Zwei Fragen, kein Produkt.',
      criteria: 'An BfN/BioConsult SH: Das Vorhaben FKZ 3523 15 1601 (Vogelzug-Vorhersage für bedarfsgerechte Turbinenabschaltungen in der AWZ, 12/2023–11/2025) ist ausgelaufen — was fehlt dem Ergebnis zur Betriebsreife? An die Vogelschutzwarte im LfU Brandenburg: Wären Totfunddaten der Zentralen Fundkartei in einer Form verfügbar, die eine Schwellen-Kalibrierung trägt? Fertig, wenn aus beiden Richtungen eine Antwort vorliegt, die einen Bedarf benennt oder verneint. Kippschalter: Verneinen beide, wandert die Idee nach _entsorgt.md — ein vollwertiges Ergebnis. Erst danach lohnt M1 (Profil-Lesbarkeit, MTR auf Rotorhöhe); die volle Staffel steht in 02-recherche/eurobirdcast-roadmap-2026-09-22.md.'
    },
    firstStepEn: {
      ticket: 'M0: establish demand. Two questions, no product.',
      criteria: 'To BfN/BioConsult SH: project FKZ 3523 15 1601 (migration forecasting for demand-driven turbine curtailment in the EEZ, 12/2023–11/2025) has ended — what does the result still lack to be operational? To the LfU Brandenburg bird conservation station: would carcass data from the central registry be available in a form that can carry a threshold calibration? Done when an answer from both directions either names a demand or denies it. Kill switch: if both deny it, the idea moves to _entsorgt.md — a full result. Only then is M1 (profile readability, MTR at rotor height) worth starting; the full sequence is in 02-recherche/eurobirdcast-roadmap-2026-09-22.md.'
    },
    failureModeDe: 'Der Nullbefund vom Gotthard ist das größte Risiko: Tettamanti (J. Environ. Manage. 401, 1.3.2026) zeigt fünf Anlagen mit BirdScan-MV1-Radar und turbinenindividuellen MTR-Schwellen, bei denen die Abschaltzeit von 318 h auf 28–96 h je Anlage sank — die Kollisionszahl blieb bei rund 190 Tieren pro Jahr unverändert. Mehr zeitliche Präzision rettete dort nicht mehr Vögel. Zweitens fehlt der Käufer: ein Werkzeug für eine Pflicht, die es in Deutschland für den Zug nicht gibt, wird nicht betrieben — deshalb steht M0 vor dem Code. Drittens Scheingenauigkeit: Die Messabweichung zwischen Radarsystemen liegt bei 250 MTR bei rund 100 MTR; eine Ampel ohne Unsicherheitsband behauptet Präzision, die die Messung nicht hergibt. Viertens Lizenz: OPERA/Meteogate liefert research-only, die Zulässigkeit eines Betriebsdienstes ist ungeprüft.',
    failureModeEn: 'The Gotthard null result is the biggest risk: Tettamanti (J. Environ. Manage. 401, 1 Mar 2026) documents five turbines with BirdScan MV1 radar and turbine-specific MTR thresholds where downtime fell from 318 h to 28–96 h per turbine — while the collision count stayed at roughly 190 animals per year. More temporal precision did not save more birds there. Second, there is no buyer: a tool for an obligation that does not exist for migration in Germany will not be operated — hence M0 before any code. Third, false precision: the deviation between radar systems is around 100 MTR at 250 MTR; a traffic light without an uncertainty band claims precision the measurement cannot deliver. Fourth, licensing: OPERA/Meteogate is research-only and the admissibility of an operating service is unverified.',
    priorArtDe: 'Verdikt korrigiert am 22.09.2026 von „verifiziert neuartig" auf besetzt/verengt. Bauer u. a. (Nature Sustainability, 2.6.2026, doi 10.1038/s41893-026-01853-4) werten 37 Radare über DE/FR/BE/NL/LU und rund 42.000 Turbinen aus; ihr Szenario 3 schaltet ab, wenn die Kollisionen je erzeugter Kilowattstunde eine Grenze überschreiten — das ist exakt der BP/MWh-Index dieser Dose, drei Monate älter, mit offenem Code. Vorläufer der Metrik: Bureau Waardenburg 2022 (Percentage of Collisions Avoided gegen MWh). In den Niederlanden ist Start/Stop seit Mai 2023 für alle Parks mit kavelbesluit verpflichtend, mit Behördensoftware EVAS und veröffentlichten Saisonberichten — also dem Audit-Trail, den die Erstfassung als Alleinstellung reklamierte; das zugrunde liegende Prognosemodell gilt laut Technolution 2025 allerdings als wenig zuverlässig bei Zugspitzen und nutzt kein Wetterradar. Robin Radar Systems verkauft SCADA-gekoppelte Abschaltung inklusive Algorithmus für Massenzug (Eneco Maasvlakte 2, 22 Turbinen vollautomatisch); Swiss Birdradar bietet BirdScan MV1 (inzwischen „legacy", abgelöst durch FaunaScan MV2) mit automatischer Kommunikation zur Windparksteuerung. Beide proprietär. FlySafe (UvA/KNMI) liefert seit August 2026 Echtzeitprofile auch für Deutschland. RADBIRD (BfN/Vogelwarte Helgoland, 2019–2021) wurde als FKZ 3523 15 1601 (BioConsult SH, bis 11/2025) fortgesetzt. HiRAD (Biodiversa+: WSL, UvA, INBO, FMI, Agroscope, mit Swiss BirdRadar Solution AG) ist genau das Konsortium, das die Erstfassungs-Mail vorschlug zu gründen. ENRAM dagegen war eine COST-Action 2013–2017 und existiert nicht mehr.',
    priorArtEn: 'Verdict corrected on 22 Sep 2026 from "verified novel" to occupied/narrowed. Bauer et al. (Nature Sustainability, 2 Jun 2026, doi 10.1038/s41893-026-01853-4) analyse 37 radars across DE/FR/BE/NL/LU and around 42,000 turbines; their scenario 3 curtails when collisions per kilowatt-hour generated exceed a limit — exactly the BP/MWh index of this tin, three months older, with open code. Earlier ancestor: Bureau Waardenburg 2022 (Percentage of Collisions Avoided against MWh). In the Netherlands, Start/Stop has been mandatory since May 2023 for every farm with a kavelbesluit, with government software EVAS and published seasonal reports — the audit trail the first draft claimed as its unique contribution; the underlying forecast model is however rated of low reliability at migration peaks (Technolution 2025) and uses no weather radar. Robin Radar Systems sells SCADA-coupled curtailment including a mass-migration algorithm (Eneco Maasvlakte 2, 22 turbines fully automatic); Swiss Birdradar offers BirdScan MV1 (now "legacy", superseded by FaunaScan MV2) with automatic communication to wind park controls. Both proprietary. FlySafe (UvA/KNMI) has delivered real-time profiles covering Germany since August 2026. RADBIRD (BfN/Helgoland, 2019–2021) was continued as FKZ 3523 15 1601 (BioConsult SH, until 11/2025). HiRAD (Biodiversa+: WSL, UvA, INBO, FMI, Agroscope, with Swiss BirdRadar Solution AG) is precisely the consortium the first draft proposed forming. ENRAM, by contrast, was a COST Action from 2013 to 2017 and no longer exists.'
  },
  {
    id: 'sperrmuell-radar',
    title: 'Sperrmüll-Radar',
    titleEn: 'Bulky Waste & Curb Giveaway Radar',
    oneLinerDe: 'Foto vom Straßenfund → On-device-Klassifikation → Geo-Pin mit OSM-Straßensegment, der nach 12 Stunden verfällt. Kein Account, kein Marktplatz, Verfall als Datenschutz. Macht aus 13 Mio. € Müllkosten gerettete Dinge.',
    oneLinerEn: 'Snap street find → on-device classification → geo-pin with OSM street segment expiring after 12 hours. No account, no marketplace, TTL as privacy by design. Turns €13M municipal waste into saved goods.',
    date: 'September 2026 (vertieft 20.09.2026)',
    reviewAfter: 'März 2027',
    recipientsDe: 'CityLAB Berlin (Technologiestiftung Berlin) · Domänenpartner: Re-Use Berlin / Zero-Waste-Agentur · Kaltstart: BSR-Kieztage · Geodaten: OpenStreetMap Berlin',
    recipientsEn: 'CityLAB Berlin (Technology Foundation) · domain partner: Re-Use Berlin / Zero Waste Agency · cold start: BSR Kieztage · geodata: OpenStreetMap Berlin',
    domain: 'civic',
    verdict: 'gift',
    status: 'zugestellt',
    tags: ['Berlin', 'Kreislaufwirtschaft', 'Bordstein', 'Datenschutz', 'Ephemeral', 'Open Source'],
    problemDe: 'Berlin verzeichnete 2025 fast 200.000 Meldungen illegaler Müllablagerungen (>500/Tag, Beseitigungskosten >13 Mio. €). Ein Großteil davon sind intakte Möbel und Hausrat. Das Berliner Straßenverschenk-Protokoll („Zu verschenken"-Karton am Bordstein) ist analog zu langsam: Brauchbare Dinge stehen im Regen, bis die BSR sie teuer entsorgen muss. Bestehende Angebote sind entweder Anzeigenbörsen ohne Karte/Verfall (BSR Tauschmarkt) oder Müllmelder zum Wegräumen (Ordnungsamt-Online).',
    problemEn: 'Berlin recorded nearly 200,000 reports of illegal fly-tipping in 2025 (>500/day, clean-up costs >€13M). Much of this consists of usable furniture and household goods. The analog curb gift protocol is too slow: useful items sit in rain until ruined. Existing platforms are either static listings without map/decay (BSR Tauschmarkt) or reporting tools for clearance (Ordnungsamt-Online).',
    whyNowDe: [
      'Klassifikation on-device ist lokal und datensparsam: Nur Kategorie und OSM-Straßensegment („Weserstraße zw. Fulda- und Pannierstr.") verlassen das Gerät.',
      '12-Stunden-Halbwertszeit (TTL) löst das Kernproblem: Verfall als Datenschutzkonzept, keine Account-Datenbanken, kein Tracking, kein Archiv.',
      'Rund 80 BSR-Kieztage jährlich bieten eine fertige Bühne für Kiez-Adoption und Kaltstart ohne Marketingbudget.',
      'CityLAB hat mit Gieß den Kiez bewiesen, dass kommunale Open-Source-Karten bürgerschaftliches Engagement mobilisieren.'
    ],
    whyNowEn: [
      'On-device image classification is fast and private: only coarse category and OSM street segment leave the phone.',
      '12-hour TTL turns ephemeral existence into privacy by design: no user accounts, no tracking database, no archive.',
      '~80 municipal BSR Kieztage every year provide an existing stage for local community adoption without ad spend.',
      'CityLAB proved with Gieß den Kiez that municipal open-source civic maps mobilize neighborhood action.'
    ],
    sketchDe: 'Progressive Web App. Foto machen → On-device-Klassifikation → OSM-Straßensegment statt Hausnummer auf Kiez-Karte. Pin verfällt nach 12 Stunden automatisch. Einziger Interaktionsknopf für Vorbeigehende: „Schon weg / mitgenommen" löscht den Pin sofort. Kein Login, kein Chat, kein Marktplatz.',
    sketchEn: 'Progressive Web App. Photo → on-device classification → OSM street segment instead of street number on neighborhood map. Pin expires after 12 hours. Single button for passersby: "Already gone" clears pin instantly. No login, no messaging, no marketplace.',
    firstStepDe: {
      ticket: 'Ein Kiez, eine Karte, ein Verfall (am Beispiel Neukölln/Kreuzberg).',
      criteria: 'Zwei Personen setzen auf einem OSM-Straßensegment Pins, sehen sie ohne Login, und nach Ablauf des Zeitfensters ist die Karte automatisch leer.'
    },
    firstStepEn: {
      ticket: 'One neighborhood, one map, one decay cycle (e.g. Neukölln/Kreuzberg).',
      criteria: 'Two people place pins on an OSM street segment, view them with zero login, and when the TTL expires the map is cleanly cleared.'
    },
    failureModeDe: 'Verwechslung mit Müllmelder: Ordnungsamt-Online meldet Müll zum Wegräumen; Sperrmüll-Radar rettet Brauchbares davor. Gegenmaßnahme: OSM-Straßensegment statt Hausnummer (verhindert Denunziation von Anwohnern), keine Fotos auf dem Server, automatischer 12h-Verfall ohne Archiv.',
    failureModeEn: 'Confusion with fly-tipping reports: Ordnungsamt-Online reports waste for disposal; Sperrmüll-Radar rescues usable goods beforehand. Countermeasure: OSM street segment instead of house number (prevents resident denunciation), no server photo storage, strict 12h decay without archive.',
    priorArtDe: 'Verengt (Recheck 20.09.2026): US-Markt hat CurbAlert-Familie (curbalertapp.com mit 0,5-Meilen-Feed und Auto-Expire; curbalert.org, givore.com), dort kommerziell mit Konten/Werbung. In DE besetzen Ordnungsamt-Online und MÜLLweg! das Melden zum Wegräumen. BSR Tauschmarkt ist listenbasiert ohne Karte/Verfall. Re-Use Berlin bietet Übersicht nur als 2,8-MB-PDF. Lücke: kontolos, kommunal getragen, OSM-Straßensegment, Open Source.',
    priorArtEn: 'Narrowed (Recheck 20 Sep 2026): US market has CurbAlert family (curbalertapp.com with 0.5mi feed and auto-expiring posts, curbalert.org, givore.com), all commercial with accounts/ads. In Germany, Ordnungsamt-Online handles fly-tipping disposal. BSR Tauschmarkt is a static bulletin board. Re-Use Berlin map exists only as a 2.8MB PDF. Gap: zero-login, municipal/civic-backed, OSM street segment, open source.'
  },
  {
    id: 'kiez-laermkarte',
    title: 'Kiez-Lärmkarte',
    titleEn: 'Kiez Noise Map (Tranquility Windows)',
    titleEs: 'Mapa de Ruido Kiez (Ventanas de Tranquilidad)',
    oneLinerDe: 'Nicht wie laut eine Straße im Jahresmittel ist, sondern wann sie leise ist — gemessen von Handys, die nur dB-Pegel erfassen und nie Audio.',
    oneLinerEn: 'Not how loud a street is in yearly averages, but when it is quiet — measured by phones capturing only dB levels and never raw audio.',
    oneLinerEs: 'No cuán ruidosa es una calle en promedio anual, sino cuándo está tranquila — medido por teléfonos que solo capturan niveles dB y jamás audio.',
    date: 'September 2026 (vertieft 20.09.2026)',
    reviewAfter: 'März 2027',
    recipientsDe: 'Noise-Planet / NoiseCapture (Université Gustave Eiffel + CNRS) · parallel: CityLAB Berlin · Vorarbeit: Hush City (Dr. A. Radicchi, TU Berlin)',
    recipientsEn: 'Noise-Planet / NoiseCapture (Université Gustave Eiffel + CNRS) · parallel: CityLAB Berlin · prior art: Hush City (Dr. A. Radicchi, TU Berlin)',
    domain: 'civic',
    verdict: 'gift',
    status: 'zugestellt',
    tags: ['Berlin', 'Lärmschutz', 'Akustik', 'Datenschutz', 'Open Data', 'CityLAB', 'NoiseCapture', 'Hush City'],
    problemDe: 'Der Berliner Lärmaktionsplan liefert theoretische Modellwerte und Jahresmittelwerte (L_den / L_night). Menschen wollen aber wissen: „Kann ich hier bei gekipptem Fenster schlafen?", „Wann kann ich ungestört arbeiten?". Jahresmittelwerte mitteln die Zeitstruktur weg, die eigentlich die lebensentscheidende Information ist. Gleichzeitig scheitern Crowdsourcing-Ansätze an Datenschutzängsten vor Abhörmikrofonen.',
    problemEn: 'Strategic noise action plans publish annual modeled decibel averages (L_den / L_night). But residents need to know: "Can I sleep here with windows tilted?", "Which hours are tranquil for focused work?". Averages erase temporal rhythm, which is the biologically decisive signal. Concurrently, crowdsourcing projects stall on surveillance anxieties regarding smartphone microphones.',
    problemEs: 'Los planes estratégicos de ruido publican promedios anuales modelados (L_den / L_night). Pero los ciudadanos necesitan saber: "¿Puedo dormir aquí con la ventana abierta?", "¿A qué horas hay calma para concentrarse?". Los promedios borran el ritmo temporal, que es la señal biológica clave.',
    whyNowDe: [
      'Web Audio API AnalyserNode berechnet RMS-Pegel direkt im Browser-RAM — das Audiosignal wird nach wenigen Millisekunden hardwarenah überschrieben (Zero-Audio-Architektur).',
      'Relative Kreuzkalibrierung über Co-Lokalisierung mehrerer Geräte gleicht die hardwarebedingte Streuung von Smartphone-Mikrofonen (±3–5 dB) ohne Laboraufwand aus.',
      'Amtliche SenUMVK-Lärmkarten (Umgebungslärm 2022/2024 WFS/WMS) liegen als Open Data vor und dienen als makroskopischer Kalibrierungs- und Validierungsanker.',
      'WHO Europe Night Noise Guidelines definieren klare biologische Schwellenwerte (L_night < 40 dB(A)), die direkt in Schlaf-Tauglichkeits-Ampeln übersetzt werden können.',
      'Lokale Vektordatenbanken und PWA-Service-Worker erlauben Kiez-Aggregationsmodelle direkt auf dem Endgerät, bevor überhaupt Daten das Gerät verlassen.'
    ],
    whyNowEn: [
      'Web Audio API AnalyserNode calculates RMS decibels directly in volatile browser memory — raw audio is overwritten in milliseconds with zero disk persistence (zero-audio architecture).',
      'Relative cross-calibration via opportunistic multi-device co-location solves consumer microphone hardware variance (±3-5 dB) without lab calibration.',
      'Official SenUMVK Berlin noise maps (Environmental Noise 2022/2024 WFS/WMS) are published as Open Data, providing a macroscopic baseline sanity check.',
      'WHO Europe Night Noise Guidelines define unambiguous physiological thresholds (L_night < 40 dB(A)), easily converted into real-world sleep quality ratings.',
      'Edge vector indexing and local PWA caching allow street-segment diurnal aggregation directly on-device before any telemetry is transmitted.'
    ],
    sketchDe: 'Interaktive 24h-Diurnal-Karte mit Zeitschieberegler (Stunde / Wochentag) statt statischer Pegel-Farbfläche. Identifiziert automatisiert zusammenhängende „Ruhe-Fenster" (z. B. 11:00–14:00 Uhr und 23:00–06:00 Uhr). Integrierter Schlafrechner für Fensterzustände (offen, gekippt -15 dB, geschlossen -30 dB) nach WHO-Kriterien. Standardisierter GeoJSON-Export für Kiezlabore und NoiseCapture.',
    sketchEn: 'Interactive 24-hour diurnal map with time-of-day and weekday slider instead of a static average color wash. Automatically detects continuous "Tranquility Windows" (e.g. 11:00-14:00 and 23:00-06:00). Integrated sleep auditor computing indoor attenuation across window positions (open 0 dB, tilted -15 dB, closed -30 dB) per WHO criteria. Standardized GeoJSON export for civic labs.',
    sketchEs: 'Mapa interactivo de 24 horas con deslizador temporal. Detecta automáticamente ventanas de tranquilidad continuas y evalúa la calidad del sueño según la atenuación de la ventana (abierta 0 dB, oscilobatiente -15 dB, cerrada -30 dB) conforme a los estándares de la OMS.',
    firstStepDe: {
      ticket: 'Ein Straßenabschnitt, eine Woche, ein 24h-Tagesprofil.',
      criteria: 'Zwei Testgeräte an einer Berliner Wohnstraße messen innerhalb von 3 dB; der Berufsverkehr (07:30–09:00), das Mittags-Ruhe-Fenster (12:00–14:00) und der Nachtabfall heben sich im aggregierten 24h-Profil reproduzierbar ab, ohne dass ein einziges Byte Audio gespeichert wurde.'
    },
    firstStepEn: {
      ticket: 'One street segment, one week, one 24h diurnal profile.',
      criteria: 'Two test devices on a Berlin residential street agree within 3 dB; commuter peaks (07:30-09:00), the midday tranquility lull (12:00-14:00), and nocturnal drop are clearly distinguishable without a single byte of audio ever saved or sent.'
    },
    firstStepEs: {
      ticket: 'Un tramo de calle, una semana, un perfil diario de 24h.',
      criteria: 'Dos dispositivos en una calle residencial coinciden con un margen de 3 dB; los picos de tráfico y las ventanas de calma emergen con total nitidez sin almacenar ningún archivo de audio.'
    },
    failureModeDe: 'Audio-Datenschutz & Überwachungsverdacht: Wenn Bürger auch nur vermuten, dass ein Mikrofon Gespräche belauscht oder Roh-Audio auf Festplatte/Server landet, ist das Projekt politisch und sozial tot. Gegenmaßnahme: Die Audioverarbeitung läuft ausschließlich über Web Audio API AnalyserNode im RAM, Roh-Audio wird hardwarenah unmittelbar verworfen, open-source überprüfbar; keine Speicherung, keine Aufnahmeknöpfe. Zweites Risiko: Ehrenamts-Erschöpfung (Hush City wird seit 2020 privat finanziert; Kiez-Lärmkarte braucht institutionelle Verankerung).',
    failureModeEn: 'Audio privacy & surveillance suspicion: If citizens suspect that the phone microphone wiretaps conversations or caches raw audio on disk/cloud, the project is dead on arrival. Countermeasure: Processing occurs strictly in ephemeral RAM via Web Audio API AnalyserNode; raw samples are purged in milliseconds, zero recording capability in code. Second risk: volunteer burnout (Hush City had to rely on private maintenance since 2020; institutional anchorage is vital).',
    failureModeEs: 'Riesgo de privacidad y sospecha de vigilancia: Si la ciudadanía percibe riesgo de escucha, el proyecto fracasa. Contramedida: procesamiento en RAM volátil mediante Web Audio API, descarte inmediato de muestras sin almacenar audio.',
    priorArtDe: 'Verengt (Recheck 20.09.2026): Hush City (TU Berlin, 2018 von Berlin für Quiet-Areas-Planung übernommen) kartiert Ruhe-Orte, berechnet Pegel aber aus 44,1-kHz-Audioaufnahmen. SoundPrint (USA) erfasst Pegel für Innenräume (Restaurants/Cafés). NoiseCapture (Université Gustave Eiffel / CNRS) sammelt globale Punkte, fokussiert jedoch auf pegelbasierte Jahresmittelkarten statt auf zeitliche Ruhe-Fenster. Berliner Lärmaktionsplan 2024–2029 rechnet theoretische Großmodelle ohne Vor-Ort-Dynamik. Restlücke: Tagesprofil pro Straßenabschnitt („wann" statt „wo"), reine Pegelmessung ohne Audioaufnahme, institutionell getragen.',
    priorArtEn: 'Narrowed (Recheck 20 Sep 2026): Hush City (TU Berlin, adopted by Berlin in 2018 for quiet areas planning) maps tranquility places but computes decibels from raw 44.1 kHz audio recordings. SoundPrint (US) maps indoor venues (cafés/restaurants). NoiseCapture (Université Gustave Eiffel / CNRS) collects global acoustic data points but focuses on static decibel heatmaps rather than temporal quiet windows. Berlin\'s Noise Action Plan 2024–2029 uses top-down annual dispersion models. Remaining gap: diurnal tranquility profile per street segment ("when" instead of "where"), sound level without any audio recording, institutionally backed.',
    priorArtEs: 'NoiseCapture recoge puntos de ruido globales pero se centra en mapas de calor promedio. El plan oficial de Berlín utiliza modelos teóricos anuales. La oportunidad para un índice de ventanas de tranquilidad permanece libre.',
    emailTemplate: {
      subjectDe: 'Ideen-Schenkung: Kiez-Lärmkarte – Ruhe-Fenster statt Jahresmittel (Zero-Audio PWA & NoiseCapture-Brücke)',
      bodyDe: 'Liebes NoiseCapture- und CityLAB-Team,\n\nich übergebe hiermit ein vollständig ausgearbeitetes Konzept zur bedingungslosen Weiternutzung: „Kiez-Lärmkarte: Ruhe-Fenster-Radar".\n\nDas Kernproblem der bestehenden Lärmaktionspläne:\nAmtliche Lärmkarten (und auch viele Citizen-Science-Karten) mitteln Tag und Nacht zu abstrakten Dezibelwerten zusammen (L_den). Menschen bei der Wohnungssuche oder im Kiezalltag brauchen jedoch die zeitliche Struktur: Wann ist diese Straße leise? Gibt es ein 2-stündiges Ruhe-Fenster zum Arbeiten? Kann man mit gekipptem Fenster durchschlafen?\n\nDie Lösung:\n1. Zero-Audio Edge-Pipeline: Berechnung des RMS-Pegels rein im flüchtigen Browser-RAM (Web Audio API AnalyserNode). Es existiert keine Codezeile zur Audio-Speicherung — 0 Byte verlassen das Gerät unverschlüsselt als Ton.\n2. Ruhe-Fenster-Algorithmus: Automatische Erkennung zusammenhängender Zeitblöcke unter anpassbaren Schwellenwerten (z. B. < 45 dB(A)).\n3. WHO-Schlafindex mit Fensterdämpfung: Berechnung des Innenraumpegels bei gekipptem (-15 dB) vs. geschlossenem (-30 dB) Fenster im Vergleich zum WHO-Richtwert (< 40 dB).\n4. Standardisierter GeoJSON-Export für NoiseCapture und kommunale Geoportale.\n\nDas Konzept, die mathematischen Formeln und der funktionierende interaktive Prototyp-Simulator stehen bereit. Nehmen Sie die Idee, bauen Sie sie in NoiseCapture oder Kiezlabor-Projekte ein — als freies Geschenk (CC0).\n\nMit besten Grüßen aus Berlin,\nFélix',
      subjectEn: 'Idea Gift: Kiez Noise Map – Tranquility Windows over Averages (Zero-Audio PWA & NoiseCapture Bridge)',
      bodyEn: 'Dear NoiseCapture and CityLAB teams,\n\nI am gifting a fully conceptualized project dossier for unconditional civic implementation: "Kiez Noise Map: Tranquility Windows".\n\nThe core issue with existing noise action plans:\nOfficial strategic maps average days and nights into static decibel numbers (L_den). But citizens need the diurnal time structure: When is this street quiet? Is there a 2-hour lull for deep work? Can one sleep through the night with a tilted window?\n\nThe solution:\n1. Zero-Audio Edge Pipeline: RMS sound levels computed purely in ephemeral browser RAM via Web Audio API. Zero audio recording capability in code.\n2. Tranquility Window Algorithm: Automated detection of continuous calm intervals under configurable thresholds.\n3. WHO Sleep Index with Window Attenuation: Tilted (-15 dB) vs closed (-30 dB) window indoor levels benchmarked against WHO Europe Night Noise Guidelines (< 40 dB).\n4. Turnkey GeoJSON export for NoiseCapture and municipal GIS platforms.\n\nThe primitives and an interactive prototype simulator are complete. Take it and build upon it freely under CC0.\n\nWarm regards from Berlin,\nFélix',
      to: 'contact@noise-planet.org'
    },
    emailTemplates: [
      {
        recipientName: 'Université Gustave Eiffel / CNRS (NoiseCapture)',
        to: 'contact@noise-planet.org',
        subjectDe: 'Idee zu verschenken: Ruhe-Fenster statt Durchschnittspegel (NoiseCapture-Erweiterung)',
        bodyDe: 'Liebes NoiseCapture-Forschungsteam,\n\nich recherchiere Software-Lücken im zivilgesellschaftlichen Raum und verschenke die Ideen, die ich nicht selbst baue. Diese Architektur gehört zu Ihrem Team.\n\nNoiseCapture kartiert Schallpegel weltweit. Bürger und Mieter stellen jedoch eine grundlegend andere Frage: WANN ist diese Straße leise?\n\nOffene Vorarbeit: Hush City (entwickelt an der TU Berlin, 2018 von Berlin für die Quiet-Areas-Planung übernommen) hat bürgerschaftliche Ruhe-Orte erfasst, bewertet aber statische Orte und nutzt 44,1-kHz-Audioaufnahmen. Die Kiez-Lärmkarte liefert hingegen dynamische Tagesprofile pro Straßenabschnitt — rein über Dezibelpegel, niemals Audio.\n\nDurch die Berechnung täglicher Ruhe-Fenster (zusammenhängende Stunden unter 45 dB) und Innenraum-Dämpfung nach WHO-Leitlinien werden NoiseCapture-Daten unmittelbar nutzbar für Stadtplanung und Gesundheit.\n\nAlle Details, Formeln und ein interaktiver Prototyp sind quelloffen (CC0). Nutzen Sie es gerne für Ihre Forschung.\n\nBeste Grüße,\nFélix (Berlin)',
        subjectEn: 'Free idea: quiet windows instead of average sound levels (NoiseCapture extension)',
        bodyEn: 'Dear NoiseCapture research group,\n\nI research civic software opportunities and gift the ones I won\'t build myself. This architecture belongs with your team.\n\nNoiseCapture maps sound levels across the world. However, citizens and tenants ask a fundamentally different question: WHEN is this street quiet?\n\nBy computing diurnal quiet windows (continuous hours below 45 dB) and evaluating indoor attenuation per WHO Europe Night Noise Guidelines, NoiseCapture data becomes immediately actionable for urban planning and public health.\n\nAll details, formulas, and an interactive prototype are open source (CC0). Take it and integrate it into NoiseCapture if it serves your research.\n\nBest regards,\nFélix (Berlin)'
      },
      {
        recipientName: 'CityLAB Berlin (Technologiestiftung Berlin)',
        to: 'info@citylab-berlin.org',
        subjectDe: 'Ideen-Schenkung für Kiezlabor: Kiez-Lärmkarte mit Ruhe-Fenstern (Zero-Audio PWA)',
        bodyDe: 'Hallo CityLAB-Team,\n\nich übergebe Ihnen ein fertiges Konzept für eine lokale Kiezlabor-Interaktion: Die Kiez-Lärmkarte.\n\nStatt der starren amtlichen Modellkarten der Senatsverwaltung erfasst das Tool die Zeitstruktur von Straßenabschnitten und berechnet konkrete Ruhe-Fenster für Anwohnende. Die Zero-Audio-Architektur garantiert vollständigen Datenschutz ohne jede Tonaufnahme.\n\nVollständig CC0, inklusive GeoJSON-Export und interaktivem Simulator.\n\nViele Grüße,\nFélix (Berlin)',
        subjectEn: 'Civic Gift for Kiezlabor: Kiez Noise Map with Tranquility Windows (Zero-Audio PWA)',
        bodyEn: 'Hello CityLAB Team,\n\nI am gifting you a turnkey concept for hyper-local civic participation: The Kiez Noise Map.\n\nInstead of static top-down municipal averages, it reveals temporal tranquility windows and sleep quality indices with a strict zero-audio privacy architecture.\n\nCompletely CC0, ready for Kiezlabor field experiments.\n\nWarm regards,\nFélix (Berlin)'
      }
    ],
    aiFrontier: {
      impossibleBeforeAiDe: 'Frühere Ansätze erforderten teure geeichte Schallpegelmesser der Klasse 1 oder speicherten Audioschnipsel zur manuellen Auswertung — ein datenschutzrechtliches Desaster. Erst mit Web Audio API, lokaler Signalverarbeitung im Browser und Kreuzkalibrierungs-Algorithmen über viele Geräte hinweg wird eine privacy-konforme Zeitstruktur-Kartierung ohne dedizierte Messstationen möglich.',
      impossibleBeforeAiEn: 'Previous methods required expensive Class 1 sound level meters or stored audio snippets for post-processing, triggering massive surveillance pushback. Only modern Web Audio API RAM signal processing and opportunistic multi-device cross-calibration enable privacy-first acoustic temporal mapping without dedicated municipal hardware.',
      aiTechStack: [
        'Web Audio API (AnalyserNode / Ephemeral RAM RMS)',
        'NoiseCapture GeoJSON Community Schema',
        'SenUMVK Berlin Open Data WFS/WMS (Umgebungslärm 2022)',
        'WHO Europe Night Noise Guidelines Assessment Engine',
        'IndexedDB Local Aggregator (Zero Cloud Telemetry)'
      ],
      privacyModelDe: '100% Zero-Audio / Local-First: Der Browser erfasst ausschließlich mathematische RMS-Schallenergiewerte im flüchtigen RAM. Es existieren keinerlei Audio-Puffer, Dateischreiber oder Cloud-Uploads für Sprachdaten. Abhören oder Rekonstruktion von Gesprächen ist architektonisch unmöglich.',
      privacyModelEn: '100% Zero-Audio / Local-First: The browser computes solely root-mean-square sound power in volatile RAM. No audio files, recording buffers, or cloud audio streams exist in the entire codebase. Eavesdropping is architecturally impossible.',
      ordinaryPeopleBenefitDe: 'Schützt Mieter und Familien vor Fehlentscheidungen beim Wohnungskauf oder -umzug und gibt Bürgerinitiativen fundierte Daten über das tatsächliche Verschwinden nächtlicher Ruhephasen an die Hand.',
      ordinaryPeopleBenefitEn: 'Protects prospective tenants and families from renting sleep-disrupting apartments and equips neighborhood initiatives with empirical data on lost nocturnal tranquility.',
      learningCurriculumDe: [
        {
          step: 1,
          title: 'Woche 1: Zero-Audio RMS-Pipeline in der Web Audio API',
          focus: 'Implementierung eines hardware-isolierten AnalyserNodes mit garantierter Verwerfung der Audio-Samples im RAM',
          milestone: 'Präzise Pegelberechnung (30–90 dB) ohne Speicherallokation auf der Festplatte'
        },
        {
          step: 2,
          title: 'Woche 2: Zeitstruktur- und Ruhe-Fenster-Algorithmus',
          focus: 'Erkennung zusammenhängender Lull-Intervalle unter Schwellenwerten (DIN 45680 / TA Lärm)',
          milestone: 'Automatische Identifikation von 2h-Ruhe-Fenstern im 24-Stunden-Gang'
        },
        {
          step: 3,
          title: 'Woche 3: WHO-Schlafindex & Fensterdämpfung',
          focus: 'Berechnung des Innenraumpegels über Bauteil-Dämpfungswerte (offen, gekippt, geschlossen)',
          milestone: 'Biologische Schlafqualitäts-Ampel nach WHO Europe Night Noise Guidelines'
        },
        {
          step: 4,
          title: 'Woche 4: SenUMVK Open Data Abgleich & GeoJSON-Export',
          focus: 'Validierung gegen den Berliner Lärmaktionsplan und Export nach NoiseCapture-Standard',
          milestone: 'Vollständiger QGIS- und Noise-Planet-kompatibler GeoJSON-Export'
        }
      ],
      learningCurriculumEn: [
        {
          step: 1,
          title: 'Week 1: Zero-Audio RMS Pipeline via Web Audio API',
          focus: 'Implementing an isolated AnalyserNode with hardware-level buffer disposal in RAM',
          milestone: 'Accurate real-time sound level tracking (30-90 dB) with zero disk footprint'
        },
        {
          step: 2,
          title: 'Week 2: Diurnal Rhythm & Tranquility Window Algorithm',
          focus: 'Detecting continuous acoustic lulls under DIN 45680 / TA Lärm thresholds',
          milestone: 'Automated identification of 2-hour quiet windows in a 24-hour cycle'
        },
        {
          step: 3,
          title: 'Week 3: WHO Sleep Index & Window Attenuation',
          focus: 'Computing indoor decibel levels through building attenuation (open, tilted, closed)',
          milestone: 'Biological sleep quality traffic light aligned with WHO Europe guidelines'
        },
        {
          step: 4,
          title: 'Week 4: Berlin Open Data Ingestion & GeoJSON Export',
          focus: 'Validation against municipal strategic noise maps and NoiseCapture export',
          milestone: 'Fully valid GeoJSON export compatible with QGIS and Noise-Planet'
        }
      ]
    }
  },
  {
    id: 'klarlokal',
    title: 'KlarLokal (The Battering Ram)',
    titleEn: 'KlarLokal (The Battering Ram)',
    oneLinerDe: '100% offline, WebGPU-gestützte Übersetzung von bedrohlichem Beamtendeutsch in Leichte Sprache (DIN SPEC 33429) — ohne dass ein einziges Byte das Gerät verlässt.',
    oneLinerEn: '100% offline, WebGPU-powered on-device translation of intimidating bureaucratic letters into plain language (DIN SPEC 33429) — zero bytes ever leave the browser.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Prototype Fund (Runde Herbst 2026 / BMBF) · nachrangig: CityLAB Berlin, GovTech Hackathons, Berliner Flüchtlingsrat & Erwerbslosen-Initiativen',
    recipientsEn: 'Prototype Fund (Autumn 2026 Intake) · secondary: CityLAB Berlin, GovTech Hackathons, Berlin Refugee Council & Freelancers Guild',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Berlin', 'Zivilgesellschaft', 'Behörden', 'Leichte Sprache', 'WebGPU', 'Datenschutz', 'Prototype Fund', 'AI-Native'],
    problemDe: 'Das Öffnen behördlicher Post (Finanzamt, Jobcenter, Ausländerbehörde) löst bei Millionen Menschen Panik aus. Kommerzielle KI-Tools fordern den Upload vertraulicher Finanz-, Rechts- und Aufenthaltsdaten auf US-Cloud-Server — ein fataler Verstoß gegen DSGVO und Sozialgeheimnis. Viele Briefe bleiben aus Angst ungeöffnet, bis Fristen verstreichen.',
    problemEn: 'Navigating German administrative mail (Finanzamt, Arbeitsamt, Ausländerbehörde) induces panic. Commercial AI tools require uploading highly sensitive personal financial and legal documents to third-party cloud servers, violating privacy and eroding trust. Letters sit unopened until deadlines lapse.',
    whyNowDe: [
      'WebLLM führt quantisierte Sprachmodelle per WebGPU direkt im lokalen Browser-Cache aus (0 Byte Netzwerklast).',
      'German4All-Modellgewichte (Ende 2025) sind explizit auf lesbarkeitskontrollierte Textvereinfachung (Leichte Sprache / DIN SPEC 33429) trainiert.',
      'Offene Behörden-KlarText-Systemprompts des BMAS (Bundesministerium für Arbeit und Soziales) entschlüsseln amtlichen Nominalstil mit den eigenen Kriterien des Staates.',
      'WASM-OCR und PDF.js parsen Scans und Handyfotos vollständig auf dem Endgerät.',
      'Vite & Astro 5 PWA-Architektur garantiert vollständigen Offline-Betrieb selbst im Flugmodus.'
    ],
    whyNowEn: [
      'WebLLM runs quantized language models directly in the user browser cache via WebGPU (0 bytes network traffic).',
      'German4All open-weights (late 2025) are explicitly fine-tuned for readability-controlled German text simplification (DIN SPEC 33429).',
      'Open-source system prompts from the Federal Ministry of Labour and Social Affairs (BMAS Behörden-KlarText) decode official Nominalstil using the state\'s own linguistic parameters.',
      'WASM OCR and PDF.js parse scans and photos purely on-device without cloud computer vision.',
      'Vite & Astro 5 PWA caching guarantees 100% offline edge execution even in airplane mode.'
    ],
    sketchDe: 'Lokale PWA: Drag-and-drop eines gescannten Behördenbriefs. Lokales OCR + German4All WebGPU-Pipeline liefert in unter 5 Sekunden exakt drei Dinge: 1. Das Urteil (Was bedeutet das in einem einfachen Satz?), 2. Die Frist (Bis wann muss ich handeln?), 3. Die Checkliste (Welche 3 Schritte gehe ich jetzt der Reihe nach?). Inklusive Vorlage für Fristverlängerung.',
    sketchEn: 'Local-first PWA: Drag-and-drop a scanned administrative letter. Local OCR + German4All WebGPU pipeline delivers strictly three outputs in under 5 seconds: 1. The Verdict (What does this mean in one sentence?), 2. The Deadline (Exactly when must I act?), 3. The Checklist (What 3 steps do I take next?). Includes one-click extension request generator.',
    firstStepDe: {
      ticket: 'Ein Bescheid, ein Browser-Tab, drei Antworten offline.',
      criteria: 'Muster-Finanzamtbescheid wird bei gekappter WLAN-Verbindung im Browser fallengelassen; Ausgabe von Urteil, Fristdatum und 3-Punkte-Checkliste in unter 5 Sekunden via WebGPU.'
    },
    firstStepEn: {
      ticket: 'One letter, one browser tab, three offline answers.',
      criteria: 'Sample tax assessment dropped into browser with Wi-Fi disabled; outputs verdict, deadline date, and 3-step checklist in under 5 seconds via WebGPU.'
    },
    failureModeDe: 'Verwässerung der Zero-Cloud-Grenze oder juristisches Risiko: Sobald Cloud-Fallback einzieht, wird KlarLokal zum schlechteren Klon von Zetteln. Gegenmaßnahme: Zero-Cloud ist das Kernversprechen; deterministischer Datumsfilter parallel zum LLM, Quelltext-Verlinkung und striktes Framing als Lesegerät (kein Anwaltsersatz).',
    failureModeEn: 'Diluting the zero-cloud boundary or legal advice risk: Introducing cloud fallbacks makes KlarLokal a worse clone of Zetteln. Countermeasure: Zero-cloud is the core differentiator; dual deterministic regex alongside LLM, synchronized source highlights, and strict framing as a reading aid.',
    priorArtDe: 'Recherche September 2026: Zetteln (zetteln.app) macht fast genau das (Foto → Leichte Sprache + Fristen, DSGVO-konform), aber mit EU-Cloud-Fallback. KlarLokal besetzt die Nische mit strikter Zero-Cloud-Garantie für Beratungsstellen und Menschen mit unsicherem Aufenthaltsstatus.',
    priorArtEn: 'September 2026 research: Zetteln (zetteln.app) already does letter simplification and deadlines, but uses an EU-cloud fallback. KlarLokal narrows strictly to a 100% zero-cloud edge guarantee for users who cannot accept any external data transmission.',
    emailTemplate: {
      subjectDe: 'Schenkung für den Prototype Fund: KlarLokal – Das Brecheisen gegen Beamtendeutsch (100% Offline PWA)',
      bodyDe: 'Liebes Prototype-Fund-Team und Civic-Tech-Community,\n\nich übergebe hiermit ein fertig durchdachtes Dossier für die Herbst-Runde 2026: „KlarLokal – Das Brecheisen".\n\nZiel: Beseitigung der behördlichen Briefkasten-Panik durch eine 100% offline lauffähige Übersetzungs-Pipeline für Beamtendeutsch in Leichte Sprache (DIN SPEC 33429). Dank WebGPU, WebLLM und German4All verlässt kein einziges Byte das Gerät.\n\nDas Tool beantwortet genau drei Fragen:\n1. Das Urteil (Ein einfacher Satz)\n2. Die Frist (Konkretes Handlungsdatum)\n3. Die Checkliste (Drei aufeinanderfolgende Schritte)\n\nDie Architektur und Primitiven stehen. Nehmen Sie die Idee, reichen Sie sie ein, bauen Sie sie — als bedingungsloses Geschenk (CC0).\n\nMit besten Grüßen aus Berlin,\nFélix',
      subjectEn: 'Gift Proposal for Prototype Fund: KlarLokal – The Battering Ram (100% Offline Civic PWA)',
      bodyEn: 'Dear Prototype Fund team and Civic Tech community,\n\nI am presenting a fully articulated open-source project dossier for the Autumn 2026 Prototype Fund intake: "KlarLokal (The Battering Ram)".\n\nMission: Eradicate administrative letter anxiety through a 100% local-first translation engine decoding Beamtendeutsch into plain language (DIN SPEC 33429). By combining WebGPU, WebLLM, and German4All weights, zero personal data ever touches a server.\n\nDelivers strictly three outputs: The Verdict, The Deadline, and The Checklist.\n\nThe primitives and architecture are resolved. Take the dossier and build it — an unconditional civic gift (CC0).\n\nWarm regards from Berlin,\nFélix',
      to: 'info@prototypefund.de'
    },
    aiFrontier: {
      impossibleBeforeAiDe: 'Klassische Wortlisten-Übersetzer konnten den verschachtelten Nominalstil und die juristischen Passiv-Konstruktionen deutscher Amtsbriefe nicht sinngemäß auflösen; lokale LLM-Inferenz im Browser ohne Server war vor WebGPU und quantisierten Gewichten technisch undenkbar.',
      impossibleBeforeAiEn: 'Traditional rule-based parsers failed on German administrative Nominalstil and subjunctive legal clauses; running local LLM inference inside browser memory without a GPU server was impossible before WebGPU.',
      aiTechStack: ['WebLLM / WebGPU', 'German4All (Open Readability Weights)', 'BMAS Behörden-KlarText System Prompts', 'PDF.js & WASM OCR', 'Astro 5 + Vite PWA Cache'],
      privacyModelDe: '100% Local-First / Zero-Knowledge: Sämtliche Berechnungen, Texterkennungen und Sprachmodelle laufen im Browser-Arbeitsspeicher auf dem Endgerät. Keine Server, keine Telemetrie, keine DSGVO-Haftung.',
      privacyModelEn: '100% Local-First / Zero-Knowledge: All OCR, inference, and text simplification execute in local browser memory via WebGPU. Zero servers, zero telemetry, zero GDPR liability.',
      ordinaryPeopleBenefitDe: 'Nimmt vulnerablen Menschen, Zugewanderten und Selbstständigen die lähmende Angst vor dem Briefkasten und schützt vor unverschuldeten Kontensperrungen und Fristversäumnissen.',
      ordinaryPeopleBenefitEn: 'Removes debilitating fear of administrative mail for immigrants, freelancers, and working families, preventing unjustified account seizures and missed deadlines.',
      learningCurriculumDe: [
        { step: 1, title: 'Woche 1: Lokale Dokumenten-Extraktion', focus: 'WASM-basiertes OCR und PDF.js für schiefe Smartphone-Fotos von Behördenschreiben', milestone: 'Lokale Textextraktion mit Konfidenzwerten in unter 1 Sekunde' },
        { step: 2, title: 'Woche 2: WebGPU-Inferenz mit German4All', focus: 'Streaming-Integration von WebLLM mit quantisiertem German4All-Modell im Browser-Cache', milestone: 'Erste fehlerfreie lokale Inferenz auf Standard-Laptops ohne Netzwerkaufruf' },
        { step: 3, title: 'Woche 3: BMAS Behörden-KlarText Prompts', focus: 'Adaption der Ministeriums-Prompts für DIN SPEC 33429 (Urteil, Frist, Checkliste)', milestone: 'Konsistente Reduktion von 4-seitigen Bescheiden auf den 3-Punkte-Dreiklang' },
        { step: 4, title: 'Woche 4: Deterministischer Frist-Guard & Offline-PWA', focus: 'Regex-Sicherheitsnetz gegen Frist-Halluzinationen und Service-Worker-Offline-Bundle', milestone: 'Funktionsfähiger Prototype-Fund-Bewerbungsprototyp' }
      ],
      learningCurriculumEn: [
        { step: 1, title: 'Week 1: Local Document Extraction', focus: 'WASM-based OCR and PDF.js handling skewed smartphone snapshots of official letters', milestone: 'Sub-second on-device optical extraction with confidence scores' },
        { step: 2, title: 'Week 2: WebGPU Inference with German4All', focus: 'Streaming WebLLM integration with quantized German4All weights in IndexedDB cache', milestone: 'First zero-network inference running cleanly on commodity laptops' },
        { step: 3, title: 'Week 3: BMAS Behörden-KlarText System Prompts', focus: 'Adapting ministry prompt architecture for DIN SPEC 33429 output triade', milestone: 'Consistent distillation of 4-page formal notices into verdict, deadline, and checklist' },
        { step: 4, title: 'Week 4: Deterministic Deadline Guard & Offline PWA', focus: 'Regex safety net preventing date hallucinations and offline service worker packaging', milestone: 'Fully testable submission-ready prototype for the Prototype Fund' }
      ]
    }
  },
  {
    id: 'agent-postmortem-recorder',
    title: 'Agent Postmortem Recorder',
    titleEn: 'Agent Postmortem Recorder',
    oneLinerDe: 'Nicht ein weiteres Dashboard über Agent-Sessions, sondern die Konsequenz: die CLAUDE.md-Zeile, die fehlt, und die Zeile, die dasteht und nachweislich nicht wirkt — als fertiger Patch für claude-reflect.',
    oneLinerEn: 'Not another agent analytics dashboard, but the consequence: the CLAUDE.md line that is missing, and the line that is there and demonstrably not working — as a ready patch for claude-reflect.',
    date: 'September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'claude-reflect (Bayram Annakov), als Pull Request · nachrangig: claude-doctor, RuleReceipt',
    recipientsEn: 'claude-reflect (Bayram Annakov), as a pull request · secondary: claude-doctor, RuleReceipt',
    domain: 'git',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['DevTools', 'AI Agents', 'Claude Code', 'CLAUDE.md', 'Patch'],
    problemDe: 'Wer Agents ernsthaft nutzt, korrigiert dieselben Dinge immer wieder. Die Korrekturen liegen in den Logs, werden aber nie zur Regel — und wenn doch, bläht jede neue Regel die Instruktionsdatei auf, ohne dass jemand sagt, welche bestehende Regel nicht wirkt.',
    problemEn: 'Anyone using agents seriously corrects the same things again and again. The corrections sit in the logs but never become rules — and when they do, every new rule bloats the instruction file while nobody says which existing rule is not working.',
    whyNowDe: [
      'Hook-Events, Transkripte und die Korrektur-Queue von claude-reflect liegen lokal und maschinenlesbar vor.',
      '„Diese vier Korrekturen sind dieselbe" ist über eine Queue von 100 Einträgen billig geworden.',
      'Ein Diff ist anwendbar, ein Bericht nicht.'
    ],
    whyNowEn: [
      'Hook events, transcripts and the claude-reflect correction queue are local and machine-readable.',
      '"These four corrections are the same one" is now cheap over a 100-item queue.',
      'A diff can be applied; a report cannot.'
    ],
    sketchDe: 'Im Patch umgesetzt: (1) Queue nach Wiederkehr ordnen — „×4 über 4 Tage [unipile]" zuerst, Einmal-Umlenkungen unten (Backlog #1 von claude-reflect). (2) „Aufgeschrieben, trotzdem korrigiert": wiederkehrende Korrektur, die einer bestehenden CLAUDE.md-Zeile entspricht, ist kein Duplikat, sondern Beleg, dass die Regel nicht wirkt. (3) End-to-End-Test des Capture-Hooks (Backlog #3). Nur Standardbibliothek, nur lesend, keine neuen Regex.',
    sketchEn: 'Implemented in the patch: (1) rank the queue by recurrence — "×4 over 4 days [unipile]" first, one-off redirects last (claude-reflect backlog #1). (2) "Already written down, still corrected": a recurring correction matching an existing CLAUDE.md line is not a duplicate but evidence the rule does not work. (3) End-to-end test of the capture hook (backlog #3). Stdlib only, read-only, no new regexes.',
    firstStepDe: {
      ticket: 'claude-reflect forken, Patch aus dem Buch der Dose anwenden, PR mit der Mail unten öffnen.',
      criteria: 'CI grün auf allen drei Plattformen, auch windows-latest (hier nicht getestet).'
    },
    firstStepEn: {
      ticket: 'Fork claude-reflect, apply the patch from the tin\'s book, open a PR with the email below.',
      criteria: 'CI green on all three platforms, including windows-latest (not tested here).'
    },
    failureModeDe: 'Wortbasiert, nicht bedeutungsbasiert: Zweiergruppen sind manchmal Zufall („smaller", „api"). Der Patch ordnet nur und verwirft nichts; similarity_fn nimmt später die semantische Schicht auf. Korrekturen können älter sein als die Regel — deshalb erstes und letztes Datum, der Mensch entscheidet.',
    failureModeEn: 'Word-based, not meaning-based: pairs are sometimes coincidences ("smaller", "api"). The patch only reorders and drops nothing; similarity_fn takes the semantic layer later. Corrections may predate the rule — hence first and last dates, and a human decides.',
    priorArtDe: 'Besetzt (Nachprüfung 24.09.2026): claude-reflect (~1,6k ★) schreibt erfasste Korrekturen nach Freigabe in CLAUDE.md, Regeldateien, Skills, AGENTS.md; claude-doctor erzeugt Regeln aus Transkripten; claude-learn bewertet und lässt Regeln verfallen; RuleReceipt prüft Befolgung. Offen war nur, was das Backlog von claude-reflect selbst misst.',
    priorArtEn: 'Taken (re-check 24.09.2026): claude-reflect (~1.6k ★) writes captured corrections into CLAUDE.md, rule files, skills and AGENTS.md after review; claude-doctor generates rules from transcripts; claude-learn scores and decays rules; RuleReceipt checks compliance. Only what claude-reflect\'s own backlog measures was open.',
    emailTemplate: {
      to: 'Pull Request auf github.com/BayramAnnakov/claude-reflect — keine Mailadresse raten',
      subjectDe: 'Rank /reflect queue by recurrence (BACKLOG #1) + end-to-end hook test (BACKLOG #3)',
      subjectEn: 'Rank /reflect queue by recurrence (BACKLOG #1) + end-to-end hook test (BACKLOG #3)',
      bodyDe: `Hi Bayram,

your BACKLOG.md is the best issue tracker I've read this year: measured, with the cost of leaving each thing spelled out. So this PR does only two things from it, and nothing of mine.

#1 — recurrence ranking. scripts/rank_queue.py groups queue items that say the same thing and shows the recurring ones first. Your unipile case — four wordings across three months among eight one-offs — comes out as "×4 over 4 day(s) [unipile]", with the rest collapsed as "8 one-off items — review last". Stdlib only, read-only (load_queue_at, no migrations), no new regex (per #2).

One thing fell out of it for free: a recurring cluster that already matches a CLAUDE.md entry. Step 4 currently offers "skip" there. I think it's the opposite — the rule exists and the user keeps correcting anyway, so the entry isn't working. The report flags it as "already written down, still corrected ×4 — rewrite, move, or make it a hook?", with first/last dates since the corrections may predate the entry.

#3 — end-to-end hook test. tests/test_hook_e2e.py pipes real corrections through capture_learning.py as a subprocess, throwaway HOME, default codepage. Runs inside the existing pytest step; no workflow change. I could only run Linux — the Windows runner is where it earns its keep.

Numbers: 4 new files, 567 lines, zero edits to existing files, 322 → 340 tests passing. /reflect is unchanged until you add the ~10-line "Step 4.5" from the README — or don't.

Known limit: word-based, so some pairs are coincidences. It only reorders; nothing is dropped. Deliberately not done: replay-testing rules, automatic deletion, "never used" detection (RuleReceipt's lane), new regexes.

Happy to change anything, split it in two, or have you take only the parts you like. No reply owed.

Félix
Berlin · github.com/felixinberlin`,
      bodyEn: `Hi Bayram,

your BACKLOG.md is the best issue tracker I've read this year: measured, with the cost of leaving each thing spelled out. So this PR does only two things from it, and nothing of mine.

#1 — recurrence ranking. scripts/rank_queue.py groups queue items that say the same thing and shows the recurring ones first. Your unipile case — four wordings across three months among eight one-offs — comes out as "×4 over 4 day(s) [unipile]", with the rest collapsed as "8 one-off items — review last". Stdlib only, read-only (load_queue_at, no migrations), no new regex (per #2).

One thing fell out of it for free: a recurring cluster that already matches a CLAUDE.md entry. Step 4 currently offers "skip" there. I think it's the opposite — the rule exists and the user keeps correcting anyway, so the entry isn't working. The report flags it as "already written down, still corrected ×4 — rewrite, move, or make it a hook?", with first/last dates since the corrections may predate the entry.

#3 — end-to-end hook test. tests/test_hook_e2e.py pipes real corrections through capture_learning.py as a subprocess, throwaway HOME, default codepage. Runs inside the existing pytest step; no workflow change. I could only run Linux — the Windows runner is where it earns its keep.

Numbers: 4 new files, 567 lines, zero edits to existing files, 322 → 340 tests passing. /reflect is unchanged until you add the ~10-line "Step 4.5" from the README — or don't.

Known limit: word-based, so some pairs are coincidences. It only reorders; nothing is dropped. Deliberately not done: replay-testing rules, automatic deletion, "never used" detection (RuleReceipt's lane), new regexes.

Happy to change anything, split it in two, or have you take only the parts you like. No reply owed.

Félix
Berlin · github.com/felixinberlin`
    }
  },
  {
    id: 'bugs-spaced-repetition',
    title: 'Bugs als Spaced-Repetition',
    titleEn: 'Bugs as Spaced Repetition',
    oneLinerDe: 'Lerne aus deinen eigenen behobenen Fehlern — Git-Commits werden zu gezielten Anki-Karten für Denkfehler, die du persönlich machst.',
    oneLinerEn: 'Learn from your own past bugs: git commits automatically turn into personal spaced-repetition flashcards for your recurring mental traps.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Anki-Community / AnkiConnect-Entwickler · GitLens · Weiterbildungsplattformen',
    recipientsEn: 'Anki community / AnkiConnect developers · GitLens · developer education platforms',
    domain: 'git',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Lernen', 'Spaced Repetition', 'Git', 'Psychologie', 'DevTools'],
    problemDe: 'Entwickler machen dieselben Denkfehler mehrfach (Off-by-One, Concurrency-Races, Zeitzonen-Bugs). Man fixt den Bug, vergisst ihn nach drei Tagen, und tritt ein halbes Jahr später in dieselbe Grube.',
    problemEn: 'Engineers fall into the same personal cognitive traps repeatedly (timezones, off-by-one, cache invalidation). Once fixed, the lesson vanishes from memory within days.',
    whyNowDe: [
      'Diffs mit Bug-Präfix lassen sich heute treffsicher zu Frage-Antwort-Paaren synthetisieren.',
      'AnkiConnect ermöglicht nahtlosen Export ohne manuelle Tipparbeit.'
    ],
    whyNowEn: [
      'Bug fix diffs can now be converted into high-signal Q&A reasoning pairs automatically.',
      'AnkiConnect enables direct background sync into flashcard decks without friction.'
    ],
    sketchDe: 'Git-Hook oder CLI: Analysiert Fix-Commits, extrahiert: Was war der Fehlglaube? Warum war es falsch? Wie sieht die Invariante aus? Generiert 1-2 Anki-Karten mit Code-Snippet.',
    sketchEn: 'Git hook or CLI tool: Parses fix commits, distilling: What was the underlying faulty assumption? Why did it break? What is the correct invariant? Generates clean Anki cards.',
    firstStepDe: {
      ticket: 'Aus einem Git-Diff eine Anki-Karte erzeugen.',
      criteria: 'Ein interaktiver Befehl verwandelt den letzten Commit in eine Karte mit Frage, falschem Code und korrigiertem Prinzip.'
    },
    firstStepEn: {
      ticket: 'Generate an Anki card from a git diff.',
      criteria: 'Command takes previous fix commit and generates flashcard showing mistake prompt, broken code, and governing invariant.'
    },
    failureModeDe: 'Kartenmüll: Wer 50 triviale Tippfehler-Karten lernt, bricht nach zwei Tagen ab. Filterung muss strikt auf konzeptionelle Invarianten beschränkt bleiben.',
    failureModeEn: 'Flashcard noise: Reviewing trivial typos causes burnout. Filter must ruthlessly isolate structural conceptual mistakes only.',
    priorArtDe: 'Generische Anki-Programmier-Decks existieren zu Syntax, aber keines basiert auf den realen persönlichen Fehlern im eigenen Code.',
    priorArtEn: 'Generic programming Anki decks exist for language syntax, but none harvest lessons from your own codebase mistakes.'
  },
  {
    id: 'diffgeist',
    title: 'Diffgeist',
    titleEn: 'Diffgeist',
    oneLinerDe: 'Kein Changelog für alle, sondern der Teil, den dein Code tatsächlich aufruft — „React 20 ändert X, du nutzt X an vier Stellen, hier sind sie".',
    oneLinerEn: 'Not a generic changelog for everyone, but the specific slice your codebase actually calls: "React 20 changes X, your project calls X in 4 files: here they are."',
    date: 'September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'Andrew Nesbitt / Ecosyste.ms · nachrangig: Renovate (Mend), Socket.dev',
    recipientsEn: 'Andrew Nesbitt / Ecosyste.ms · secondary: Renovate (Mend), Socket.dev',
    domain: 'git',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Dependencies', 'Changelog', 'AST', 'Renovate', 'DevTools'],
    problemDe: 'Release-Notes richten sich an ein anonymes Publikum. 95% sind für dein Projekt irrelevant, 5% brechen still die Produktion. PRs von Renovate/Dependabot werden ungesehen gemerged, weil man 20 Seiten Release-Notes nicht lesen kann.',
    problemEn: 'Changelogs are written for an abstract world. 95% is irrelevant to you, but the remaining 5% can silently break production. Teams merge bot PRs blindly because reading twenty pages of release prose is unsustainable.',
    whyNowDe: [
      'LLMs zerlegen Release-Notes zuverlässig in strukturierte Breaking-Change-Tabellen.',
      'AST- und Call-Graph-Prüfung in JavaScript/TypeScript ist in Millisekunden machbar.',
      'Ecosyste.ms liefert die offene Dateninfrastruktur für weltweite Paketmetadaten.'
    ],
    whyNowEn: [
      'LLMs parse prose changelogs into structured breaking symbol tables effortlessly.',
      'AST search for imported symbols runs in milliseconds across repositories.',
      'Ecosyste.ms provides the open registry and release metadata layer.'
    ],
    sketchDe: 'Renovate/GitHub-Action-Plugin: Bei Dependency-Update die Release Notes laden, geänderte Symbole extrahieren, das Repo nach Aufrufen durchsuchen und die Schnittmenge als schlanken PR-Kommentar posten.',
    sketchEn: 'Renovate action: Upon package bump, fetch release notes, extract impacted symbols, check repository call-sites, and post an exact intersection comment into the PR.',
    firstStepDe: {
      ticket: 'Eine Sprache, ein Paket, ein PR-Kommentar.',
      criteria: 'Bei einem echten Major-Update eines NPM-Pakets zeigt die Ausgabe nur die 2-3 Symbole, die tatsächlich im Projekt importiert werden.'
    },
    firstStepEn: {
      ticket: 'One language, one package, one targeted PR comment.',
      criteria: 'During a real major npm package bump, output isolates precisely the 2-3 functions used in the repo.'
    },
    failureModeDe: 'False Negatives bei dynamischen Aufrufen. Muss ehrlich deklarieren, wo dynamische Reflection die statische AST-Suche blendet.',
    failureModeEn: 'Dynamic reflection blind spots: The tool must clearly warn whenever dynamic property access prevents static verification.',
    priorArtDe: 'Renovate bettet rohe Release-Notes ein; Socket.dev prüft Security, aber keine API-Callsite-Schnittmenge.',
    priorArtEn: 'Renovate pastes unparsed changelogs; Socket.dev audits supply chain security, but neither computes the exact call-site intersection.'
  },
  {
    id: 'echter-zufall',
    title: 'Echter Zufall als Service',
    titleEn: 'True Hardware Randomness as a Service',
    oneLinerDe: 'Ein MCP-Server zwischen Rauschdiode und Agent — dreißig Zeilen, und jeder Würfelwurf, jedes Sigil, jede Kartenziehung zieht aus physikalischem Rauschen statt aus Math.random().',
    oneLinerEn: 'An MCP server between physical hardware avalanche noise diode and AI agent — 30 lines, routing true quantum entropy to every dice roll, sigil, or card draw.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Infinite Noise TRNG (waywardgeek/infnoise) · Crowd Supply / Hackaday · Didaktik',
    recipientsEn: 'Infinite Noise TRNG (waywardgeek/infnoise) · Crowd Supply / Hackaday · Educational crypto',
    domain: 'physics',
    verdict: 'build_first',
    status: 'gepackt',
    tags: ['Hardware', 'Entropy', 'TRNG', 'MCP', 'Physics'],
    problemDe: 'Hardware-Zufallsgeneratoren (TRNG) auf USB-Basis kosten unter 100€, werden aber fast nur für Server-Kryptographie genutzt. Kreative Apps (Tarot, I Ging, generative Kunst, Losungen) nutzen banales Pseudo-Randomness, obwohl hier die physische Herkunft des Zufalls die halbe Seele ausmacht.',
    problemEn: 'Affordable hardware true random number generators (TRNG) sit idle in server rooms for crypto keys. Meanwhile creative divination, generative art, and lottery apps use pseudo-random seeds where physical entropy would provide genuine depth.',
    whyNowDe: [
      'MCP (Model Context Protocol) standardisiert die Werkzeug-Schnittstelle universell.',
      'Günstige offene TRNG-Hardware (Infinite Noise USB) ist lieferbar und quelloffen.',
      'Agenten und generative Tools, die Zufall anfordern, boomen.'
    ],
    whyNowEn: [
      'Model Context Protocol provides a plug-and-play standard tool interface for agents.',
      'Hardware TRNG devices (Infinite Noise) are mature and fully documented.',
      'Proliferation of autonomous generative apps needing entropy.'
    ],
    sketchDe: 'Leichter MCP-Server für Raspberry Pi / lokalen Host mit TRNG-Stick: Stellt random_bytes, random_int (mit unvoreingenommener Rejection-Sampling) und draw() bereit. Strenge Health-Checks mit Min-Entropie-Schätzung; wirft Fehler statt heimlich auf Math.random() zurückzufallen.',
    sketchEn: 'Lightweight MCP daemon for USB TRNG sticks exposing random_bytes, unbiased random_int, and draw tools with continuous min-entropy health checks. Never silently falls back to pseudo-random.',
    firstStepDe: {
      ticket: 'Bytes durchreichen und Hardware-Zustand melden.',
      criteria: 'Agent kann würfeln; zieht man den USB-Stick ab, meldet der Server sofort einen klaren Fehler statt gefälschten Zufall.'
    },
    firstStepEn: {
      ticket: 'Pass entropy bytes and verify disconnect safety.',
      criteria: 'Agent rolls physical dice; unplugging USB stick triggers an immediate hard error rather than silent synthetic degradation.'
    },
    failureModeDe: 'Heimlicher Fallback: Ein TRNG-Server, der bei Hardware-Ausfall unbemerkt Math.random() liefert, betrügt den Nutzer.',
    failureModeEn: 'Silent fallback: A physical entropy server that quietly degrades to pseudo-random when hardware disconnects destroys trust.',
    priorArtDe: 'infnoise Daemon existiert für Linux /dev/random; was fehlt, ist die unkomplizierte MCP- und Web-Tool-Schicht für kreative Anwendungen.',
    priorArtEn: 'Low-level Linux kernel drivers feed /dev/random, but no clean high-level MCP tool bridge exists for creative software.'
  },
  {
    id: 'ghost-replay',
    title: 'Ghost Replay',
    titleEn: 'Ghost Replay',
    oneLinerDe: 'Visueller Differenzabgleich von UI-Interaktionen — zeichnet Benutzeraktionen als Vektorgeister über die Oberfläche, um Usability-Knicke sofort zu sehen.',
    oneLinerEn: 'Visual interaction diff: overlays user sessions as vector ghost trails over UI elements to spot hesitation and usability friction instantly.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'PostHog Plugin Community · rrweb Maintainer · Open Source UX Tools',
    recipientsEn: 'PostHog Plugin Community · rrweb maintainers · Open-source UX tooling',
    domain: 'git',
    verdict: 'build_first',
    status: 'gepackt',
    tags: ['UX', 'rrweb', 'Analytics', 'Ghost Trails', 'Interaction'],
    problemDe: 'Session-Replays (wie Hotjar oder rrweb) zwingen Entwickler, stundenlang Videos in Originalzeit anzuschauen. Man sieht nicht auf einen Blick, wo 50 Nutzer gezögert oder wild im Kreis geklickt haben.',
    problemEn: 'Session replays require watching hours of 1x speed video. Product designers lack a synthetic spatial heatmap showing where 50 users hesitated or looped their cursors.',
    whyNowDe: [
      'rrweb DOM-Mutation-Streams erfassen Mauskoordinaten bereits strukturiert.',
      'Canvas2D und WebGL rendern hunderte semitransparente Pfade flüssig übereinander.'
    ],
    whyNowEn: [
      'rrweb records structured event streams without video bloat.',
      'Browser canvas effortlessly aggregates hundreds of translucent vector cursor traces.'
    ],
    sketchDe: 'Plugin für rrweb/PostHog: Aggregiert 100 Mauspfade über dieselbe Seite. Zeigt Mausbewegungen als leuchtende „Geisterspuren" mit Geschwindigkeits-Farbcodierung.',
    sketchEn: 'rrweb/PostHog extension aggregating 100 sessions into a single view. Renders ghost trails color-coded by velocity to highlight cognitive friction.',
    firstStepDe: {
      ticket: 'Zehn rrweb-Events in Canvas überblenden.',
      criteria: 'Zehn aufgezeichnete Interaktionen werden synchron als transparente Geisterpfade über ein Screenshot gerendert.'
    },
    firstStepEn: {
      ticket: 'Overlay ten rrweb session traces onto a canvas.',
      criteria: 'Ten user recordings render simultaneously as luminous trails over a static UI screenshot.'
    },
    failureModeDe: 'Visuelles Chaos bei responsivem Layout: Pfade müssen an DOM-Elemente relativ gebunden werden, nicht an absolute Bildschirmkoordinaten.',
    failureModeEn: 'Responsive layout misalignment: Cursor coordinates must bind to relative DOM element anchors rather than absolute pixels.',
    priorArtDe: 'Heatmaps zeigen Klickdichte, aber keine Bewegungsdynamik oder Verharren.',
    priorArtEn: 'Traditional click heatmaps highlight click density, but hide path trajectories and hesitation tempo.'
  },
  {
    id: 'kristallwachstum-3d',
    title: 'Kristallwachstum 3D',
    titleEn: '3D Crystal Growth Simulation',
    oneLinerDe: 'Die erste hybride DLA-Phasenfeld-Pipeline im Browser: Brownsche Keimbildung trifft anisotrope Kobayashi-Thermodynamik — von der fraktalen Didaktik mit 9 Gefügelinsen bis zum wasserdichten 3D-Rezept.',
    oneLinerEn: 'The first hybrid DLA phase-field pipeline in the browser: Brownian nucleation meets anisotropic Kobayashi thermodynamics — from fractal didactics with 9 microstructure lenses to a watertight 3D recipe.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Geowissenschaften FU Berlin / Lehrmittel-Verlage · nachrangig: Three.js/WebGPU-Demoszene, Nervous System, Printables/Prusa-Community',
    recipientsEn: 'FU Berlin Geosciences / Educational Publishers · secondary: Three.js/WebGPU demo scene, Nervous System, Printables/Prusa Community',
    domain: 'physics',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Physik', 'DLA', 'Phasenfeld', 'WebGPU', 'Three.js', 'Didaktik', '3D-Druck'],
    problemDe: 'Dendritenwachstum und Gefügebildung werden an Hochschulen mangels zugänglicher Simulationen primär über 2D-Zeichnungen gelehrt. Bestehende DLA-Demos verharren in der Bildschirmschoner-Falle (reine Punktwolken ohne Thermodynamik), während Maker an der aufwändigen Geometriebereinigung für den 3D-Druck scheitern.',
    problemEn: 'Dendritic solidification and crystalline microstructure are taught using static 2D textbook drawings because 3D simulation previously required dedicated scientific workstations. Existing DLA demos remain trapped as screensavers (point clouds lacking thermodynamics), while makers fail at tedious geometry cleanup for 3D printing.',
    whyNowDe: [
      'WebGPU Compute Shader (WGSL) berechnen zehntausende Brownian-Partikel und volumetrische 3D-Gitter parallel bei 60+ FPS direkt auf Standard-GPUs.',
      'Das Kobayashi-Phasenfeld-Modell (1993) für unterkühlte Schmelzen lässt sich heute in WGSL bei bis zu 192³ Voxeln lösen — gekoppelt mit DLA-Keimbildung entsteht exakte Kristallmorphologie.',
      'GPU Marching Cubes erzeugen direkt wasserdichte Manifold-Netze; kurze Seed-Strings machen jedes Objekt als reproduzierbares Rezept teilbar.'
    ],
    whyNowEn: [
      'WebGPU compute shaders (WGSL) simulate tens of thousands of Brownian particles and volumetric 3D grids in parallel at 60+ FPS on consumer GPUs.',
      'The Kobayashi (1993) phase-field model for undercooled solidification can now be solved in WGSL at up to 192³ voxels — coupled with DLA nucleation, it delivers authentic crystal morphology.',
      'GPU marching cubes extract watertight manifold meshes directly; concise seed strings turn every object into a shareable, reproducible recipe.'
    ],
    sketchDe: 'Vierstufen-Pipeline im Browser: 1. WebGPU DLA-Keimbildung mit Quartic-Solver-Driftkorrektur und Orientierungs-SSBO. 2. Kobayashi-Phasenfeld-Relaxation mit anisotroper Oberflächenenergie für Facetten und Trachten. 3. Didaktisches Gefüge-Dashboard mit 6 wissenschaftlichen Analyse-Linsen (ORIENT, MELT, THERM, CURV, SEM, ZONING) und interaktivem 3D-Z-Schnitt. 4. Echtzeit-Berechnung der fraktalen Dimension (Df) sowie Export als wasserdichtes 3MF/STL mit Seed-Rezept.',
    sketchEn: 'Four-stage browser pipeline: 1. WebGPU DLA nucleation with quartic-solver drift correction and an orientation SSBO. 2. Kobayashi phase-field relaxation with anisotropic surface energy for crystalline facets. 3. Educational dashboard with 6 scientific microstructure lenses (ORIENT, MELT, THERM, CURV, SEM, ZONING) and interactive 3D Z-slice plane. 4. Real-time fractal dimension (Df) box-counting and watertight 3MF/STL export with shareable seed recipes.',
    firstStepDe: {
      ticket: 'Ticket 02: GPU-Marching-Cubes Isosurface-Extraktion & Mehrfarbiger 3MF-Farbexport (Ticket 01 verifiziert).',
      criteria: 'Glatte Rekonstruktion planarer Kristallfacetten bei phi = 0,5 ohne Voxel-Treppen, Multi-Material 3MF-Export mit eingebetteten EBSD-IPF- und Wachstumszonierungs-Farben (ZONING), fehlerfreies Laden in PrusaSlicer/Bambu Studio.'
    },
    firstStepEn: {
      ticket: 'Ticket 02: GPU Marching Cubes Isosurface Extraction & Multi-Color 3MF Export (Ticket 01 verified).',
      criteria: 'Smooth reconstruction of planar crystal facets at phi = 0.5 without voxel staircasing, multi-material 3MF export with embedded EBSD-IPF and growth zoning (ZONING) colors, verified clean loading in PrusaSlicer/Bambu Studio.'
    },
    failureModeDe: 'Numerische Instabilität bei zu aggressivem Zeitschritt im Phasenfeld-Solver oder Ausfall auf Geräten ohne WebGPU-Treiber (erfordert robusten Fallback auf vereinfachte Gitter). Ohne Gitteranisotropie ermüdet die DLA-Formensprache nach wenigen Seeds.',
    failureModeEn: 'Numerical instability from overly aggressive timesteps in the phase-field solver or absence of WebGPU drivers (requires a graceful fallback). Without crystal lattice anisotropy, pure DLA forms quickly become visually repetitive.',
    priorArtDe: 'scttfrdmn/webgpu-compute-exploration demonstriert DLA in WGSL (ohne Phasenfeld/Thermodynamik); fronkt/solidify implementiert Kobayashi-Phasenfeld in WGSL mit 9 Linsen (ohne DLA-Keimung); markstock/dla-nd liefert mathematisch korrekte DLA-Algorithmen (C/Desktop). Die Synthese beider Welten im Browser ist neu.',
    priorArtEn: 'scttfrdmn/webgpu-compute-exploration demonstrates DLA in WGSL (lacking phase-field/thermodynamics); fronkt/solidify implements Kobayashi phase-field in WGSL with 9 lenses (lacking DLA nucleation); markstock/dla-nd provides rigorous off-lattice DLA algorithms (C/desktop). Combining both into a unified browser pipeline is novel.',
    emailTemplate: {
      to: 'timm.john@fu-berlin.de',
      subjectDe: 'Idee zu verschenken: Interaktive 3D-Kristallisation & Gefüge-Didaktik im Browser',
      subjectEn: 'Idea gift: Interactive 3D Crystallization & Microstructure Didactics in the Browser',
      bodyDe: `Guten Tag Prof. John,

ich recherchiere Software-Werkzeuge, die erst seit kurzer Zeit technisch im Browser möglich sind, und baue nur einen kleinen Teil davon selbst. Diese Idee gehört thematisch in die geowissenschaftliche Lehre (Mineralogie, Kristallographie und Gefügebildung) und nicht zu mir — deshalb schenke ich sie Ihnen und Ihrem Fachbereich.

In der universitären Didaktik werden Nichtgleichgewichts-Kristallisation, Dendritenwachstum und Grenzflächenenergie häufig noch über statische 2D-Diagramme oder Kunststoffgitter vermittelt, weil rigorose 3D-Simulationen historisch Supercomputer brauchten. Gleichzeitig bleiben existierende Web-Demos zur Diffusionsbegrenzten Aggregation (DLA) reine Bildschirmschoner: hübsche Partikelwolken ohne thermodynamischen Antrieb und ohne kristallographische Orientierungsfelder.

Kristallwachstum 3D schließt diese Lücke direkt im Browser über WebGPU:
1. Hybride Physik: Brownsche DLA-Partikelkeimung mit analytischer Driftkorrektur, gekoppelt mit dem Kobayashi-Phasenfeld-Modell (1993) für unterkühlte Schmelzen auf volumetrischen 3D-Gittern.
2. Didaktische Gefügelinsen & 3D-Schnitt: 3D-Orbit mit interaktiver Schnitt-Ebene (Z-Slice zur Begutachtung von Hohlräumen und Trichterwachstum) sowie 6 wissenschaftliche Analyse-Ebenen (EBSD-IPF Orientierungsfeld, Phasenordnungsparameter φ, thermische Unterkühlung ΔT mit latenter Wärme, Gibbs-Thomson-Krümmung, virtuelles Rasterelektronenmikroskop und petrologische Wachstumszonierung).
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
Berlin · github.com/felixinberlin/Amelie`
    }
  },
  {
    id: 'pin-tumbler',
    title: 'Pin Tumbler Didaktik',
    titleEn: 'Pin Tumbler Lockpick Didactics',
    oneLinerDe: 'Kein Lockpicking-Spiel, sondern ein Lerngerät — Stifte, Federn, Fertigungstoleranzen und Binding Order als sichtbares Modell, mit Handy-Vibration als Ersatz für das Gefühl, das man noch nicht hat.',
    oneLinerEn: 'Not a lockpicking mini-game, but an educational instrument: visual springs, tolerances, and binding order, paired with haptic feedback to build physical intuition.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'SSDeV (Sportsfreunde der Sperrtechnik Deutschland e. V., OG Berlin) · TOOOL · CCC-Workshops',
    recipientsEn: 'SSDeV (Sportsfreunde der Sperrtechnik) · TOOOL international · Locksport workshops',
    domain: 'physics',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Locksport', 'Physik', 'Mechanik', 'Haptik', 'Didaktik'],
    problemDe: 'Locksport lernt man durch Tasten im Dunkeln. Das entscheidende Prinzip — warum Stifte nacheinander binden — beruht auf winzigen Bohrungstoleranzen im Zehntelmillimeter-Bereich. Plexiglas-Schlösser zeigen Geometrie, aber nie die Toleranzen, auf die es ankommt.',
    problemEn: 'Lockpicking is traditionally learned blind through tactile trial and error. The governing principle—why pins bind sequentially—stems from microscopic manufacturing drilling tolerances. Cutaway plastic locks display shape but hide tolerance variance.',
    whyNowDe: [
      'Starrkörper-Kontaktreibung läuft in 2D in Echtzeit im Webbrowser.',
      'Moderne Smartphone-Haptik-Engines erzeugen präzise Impulse für „Stift setzt" vs. „Stift klemmt".',
      'Toleranzen lassen sich in der Simulation gezielt übertreiben und sichtbar schalten.'
    ],
    whyNowEn: [
      '2D rigid body contact mechanics with friction simulate smoothly in browsers.',
      'Modern smartphone vibration motors deliver tactile clicks distinguishing binding from oversetting.',
      'Drilling tolerances can be dynamically amplified and toggled between visible and blind modes.'
    ],
    sketchDe: 'Zylinderschloss im Querschnitt. Umschaltbar zwischen „Sichtbar" (Toleranzen farblich überhöht, Binding-Order ablesbar) und „Blind" (nur Vibration und Klickgeräusch). Regler für Drehspannung am Kern.',
    sketchEn: 'Cylinder lock cutaway with toggles between "Explaining Mode" (exaggerated tolerances, color-coded binding state) and "Tactile Practice Mode" (audio-haptic feedback only).',
    firstStepDe: {
      ticket: 'Fünf Stifte, eine Toleranz, eine sichtbare Binding Order.',
      criteria: 'Ein Laie versteht nach 5 Minuten interaktiver Bedienung, warum bei Drehspannung genau ein Stift blockiert.'
    },
    firstStepEn: {
      ticket: 'Five pins, one tolerance offset, visible binding order.',
      criteria: 'A beginner understands why rotational tension causes a single pin to bind first within five minutes of playing.'
    },
    failureModeDe: 'Gefühlsvortäuschung: Das reale haptische Feedback eines echten Picks im Schloss lässt sich nicht voll digitalisieren. Das Tool muss betonen: Es lehrt das mentale Modell, nicht die Muskelfingerfertigkeit.',
    failureModeEn: 'The digital illusion: A screen cannot replace physical brass resistance. The UI must explicitly position itself as a mental model teacher, not a replacement for hand practice.',
    priorArtDe: 'Es gibt viele Arcade-Lockpick-Minispiele, aber keines mit physikalisch realistischer Binding-Order-Didaktik.',
    priorArtEn: 'Dozens of video game lockpicking mini-games exist; zero focus on rigorous mechanical tolerance didactics.'
  },
  {
    id: 'raeucher-sim',
    title: 'Räucher-Sim',
    titleEn: 'Smokehouse & Curing Simulator',
    oneLinerDe: 'Strömungsdynamik von aufsteigendem Rauch — laminarer Auftrieb, Wirbelablösung und Duftdiffusions-Visualisierung als beruhigende, physikalisch fundierte Simulation.',
    oneLinerEn: 'Fluid simulation of rising incense smoke: laminar plume, vortex shedding, and aesthetic fragrance diffusion as a meditative, physically grounded tool.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Teezeremonie- & Achtsamkeits-Communities · WebGL-Grafik-Kuratoren · Physik-Didaktik',
    recipientsEn: 'Tea ceremony & mindfulness practitioners · WebGL creative coders · Fluid dynamics educators',
    domain: 'physics',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Fluidsim', 'Physik', 'Navier-Stokes', 'Achtsamkeit', 'WebGL'],
    problemDe: 'Rauchsimulationen in Apps sind entweder grobe Partikeleffekte oder rechenintensive 3D-Baking-Pipelines. Der zauberhafte Übergang von laminarer Strömung zu turbulenter Wirbelablösung bei einem Räucherstäbchen fehlt im Web.',
    problemEn: 'Smoke visuals in apps are either crude particle emitters or pre-rendered offline videos. The transition from laminar plume to vortex shedding characteristic of burning incense is missing in real-time web code.',
    whyNowDe: [
      'Navier-Stokes auf GPU-Grid (Jos Stam Modell) läuft in 4K bei 60 FPS im WebGL2-Canvas.',
      'Mikro-Luftzüge und Hindernis-Interaktionen lassen sich direkt per Maus oder Touch erzeugen.'
    ],
    whyNowEn: [
      'Grid Navier-Stokes solvers (Jos Stam formulation) execute at 60 FPS in WebGL2.',
      'Touch and cursor gestures generate fluid micro-drafts and obstacle vorticity.'
    ],
    sketchDe: 'Minimalistischer Raum mit glimmendem Punkt. Rauch steigt laminar auf, bricht in Helmholtz-Wirbel auf und diffundiert sanft. Interaktive Hindernisse (Teetasse, Hand, Fächer).',
    sketchEn: 'Minimalist aesthetic canvas with a single glowing ember. Plume rises laminarly, breaks into Kelvin-Helmholtz vortices, and diffuses. Interactive obstacles like bowls and screens.',
    firstStepDe: {
      ticket: 'Stam-Solver mit Dichte- und Temperaturauftrieb koppeln.',
      criteria: 'Aufsteigende Wärmequelle erzeugt selbstständig realistische Wirbelstraße ohne künstliche Turbulenz-Texturen.'
    },
    firstStepEn: {
      ticket: 'Coupled buoyant advection with Stam fluid solver.',
      criteria: 'A thermal point source naturally produces a vortex street without reliance on synthetic noise textures.'
    },
    failureModeDe: 'Verwaschenheit: Zu hohe numerische Dissipation lässt Rauch wie Nebelsuppe aussehen. Braucht vorticity confinement.',
    failureModeEn: 'Numerical dissipation: Naive Euler fluid grids blur out into cloudy fog. Demands vorticity confinement to preserve thin filaments.',
    priorArtDe: 'Hunderte generische 2D-Fluidsims existieren, fast alle als bunte Regenbogen-Spielereien ohne Auftriebsphysik.',
    priorArtEn: 'Generic rainbow fluid toys abound, but almost none accurately simulate thermal plume buoyancy and delicate incense curl dynamics.'
  },
  {
    id: 'spec-drift-detector',
    title: 'Spec-Drift Detector',
    titleEn: 'Spec-Drift Detector',
    oneLinerDe: 'CI-Wächter für Spec-Driven Development: Schlägt Alarm, wenn Code und Implementierung unbemerkt von der Markdown-Spezifikation weglaufen.',
    oneLinerEn: 'CI gate for spec-driven development: fails the build when code changes drift away from documented specification requirements.',
    date: 'September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'Tessl (Guy Podjarny) · GitHub Spec-Kit Maintainer · OpenAPI / Optic Ökosystem',
    recipientsEn: 'Tessl (Guy Podjarny) · GitHub Spec-Kit maintainers · OpenAPI / Optic ecosystem',
    domain: 'git',
    verdict: 'keep',
    status: 'gepackt',
    tags: ['Spec-Driven', 'CI/CD', 'Immunsystem', 'AI Coding', 'DevTools'],
    problemDe: 'Teams schreiben Spezifikationen für KI-Agenten. Dann fixen Entwickler Code direkt im PR. Die Spec veraltet schleichend. Drei Monate später generiert der nächste Agent Code auf Basis der veralteten Spec und reißt alte Bugs wieder auf.',
    problemEn: 'Teams author specs for AI agents. Then engineers make quick fixes directly in code. The spec silently rots. Months later, the next AI agent consults the outdated spec and recreates legacy regressions.',
    whyNowDe: [
      'AST-Extraktion von Interfaces und Signaturen ist standardisiert.',
      'Semantischer Abgleich von Markdown-Anforderungen gegen Code-AST ist im CI-Lauf in Sekunden machbar.'
    ],
    whyNowEn: [
      'AST interface and signature harvesting is fast and reliable.',
      'Semantic diffing between markdown requirement clauses and code exports runs in seconds during CI.'
    ],
    sketchDe: 'GitHub Action: Prüft bei jedem PR geänderte Dateien gegen zugehörige Specs. Zeigt Divergenz im PR-Report und schlägt automatische Spec-Nachführungen vor.',
    sketchEn: 'GitHub Action comparing touched source files against project specs. Fails CI when functionality drifts without corresponding spec updates, proposing synchronized documentation patches.',
    firstStepDe: {
      ticket: 'Funktionssignaturen mit Spec-Tabelle abgleichen.',
      criteria: 'Warnung in CI, wenn ein Parameter im Code umbenannt wurde, aber in der Spec-Tabelle noch der alte Name steht.'
    },
    firstStepEn: {
      ticket: 'Reconcile exported signatures with markdown spec tables.',
      criteria: 'Fails CI if a function signature or parameter was renamed in code without updating the corresponding spec entry.'
    },
    failureModeDe: 'False-Alarm-Müdigkeit: Wenn jeder Kommentar-Typo den Build anhält, deaktivieren Teams den Check.',
    failureModeEn: 'Linter fatigue: If minor doc typos block pull requests, developers will instantly disable the action.',
    priorArtDe: 'Optic und Schemathesis überwachen OpenAPI-Spezifikationen; generelle Prosa- und Architektur-Specs haben bisher keine Drift-Checks.',
    priorArtEn: 'Optic monitors OpenAPI spec drift, but general markdown architectural specs have lacked automated synchronization gates.'
  },
  {
    id: 'tarot-zustandsmaschine',
    title: 'Tarot als Zustandsmaschine — Arcana Schema',
    titleEn: 'Tarot Spread Graph DSL — Arcana Schema',
    oneLinerDe: 'Ein Legesystem ist bereits ein Programm — Arcana Schema liefert eine herstellerunabhängige Open-Source-Spezifikation (v2.0.0) für räumliche Layouts, typisierte Beziehungs-Graphen und Deck-Verträge.',
    oneLinerEn: 'A spread is already a program: Arcana Schema delivers an open-source JSON Schema standard (v2.0.0) for spatial layouts, typed directed graph relations, and deck contracts.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Open-Source Tarot & Entwickler-Community (Reddit: r/tarot, r/webdev, r/indiegames)',
    recipientsEn: 'Open-Source Tarot & Developer Community (Reddit: r/tarot, r/webdev, r/indiegames)',
    domain: 'creative',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Spezifikation', 'JSON Schema', 'Tarot', 'Graph DSL', 'State Machine', 'Game Design', 'Interactive Fiction'],
    problemDe: 'Legesysteme werden seit zweihundert Jahren in Prosa weitergegeben („Karte 2 kreuzt Karte 1"). Diese strukturellen Beziehungen (orthogonale Drehung, kausale Übergänge, Nachbarschafts-Modifikatoren) waren in Software bisher ad-hoc und als starre Arrays implementiert. Ein neues Legesystem erforderte neuen Code; alternative Decks (22 Majors, 36 Lenormand) brachten Apps zum Absturz.',
    problemEn: 'Tarot spreads have been passed down for centuries in prose ("Card 2 crosses Card 1"). These structural relationships (orthogonal rotations, causal transitions, neighbor modifiers) were previously hardcoded into apps as flat arrays. Adding a spread required custom code; alternative deck sizes (22-card Majors, 36-card Lenormand) crashed apps without contracts.',
    whyNowDe: [
      'LLM-Agenten (wie MCP-Server) benötigen strukturierte semantische Graphen statt unstrukturierter Prompts, um relationale Spannungsfelder in Lesungen fundiert zu analysieren.',
      'Moderne SVG- und CSS-Grid-Renderer im Browser können komplexe Karten-Layouts vollständig autonom aus (x, y, θ)-Slot-Koordinaten berechnen.',
      'JSON Schema (Draft 2020-12 & Draft-7) ermöglicht formale Deck-Verträge (deckContract), die Decks und Spreads typisiert entkoppeln.'
    ],
    whyNowEn: [
      'LLM agents (e.g. MCP servers) require structured semantic graphs rather than raw text prompts to accurately evaluate relational tension between card slots.',
      'Modern web layout engines can render spread boards autonomously from (x, y, θ) slot coordinates without custom CSS per spread.',
      'JSON Schema (Draft 2020-12 & Draft-7) provides strict deckContract boundaries, cleanly decoupling physical card sets from spread topology.'
    ],
    sketchDe: 'Formale Spezifikation (Arcana Schema v2.0.0): Clean Separation (TarotSpreadDefinition vs. TarotReading), deckContract (Mindestkarten, Arcana-Pflicht), typisierte Slots mit geometrischen Koordinaten (x, y, rotation, zIndex) und 9 gerichtete Relationen (crosses, grounds, crowns, leads_to, mirrors, opposes, clarifies, culminates_in, adjacent_to). Kanonischer Katalog und npm-Validator (@arcana-schema/validator).',
    sketchEn: 'Formal specification (Arcana Schema v2.0.0): Clean separation (TarotSpreadDefinition vs. TarotReading), deckContract (minimum cards, required arcana), typed slots with geometric coordinates (x, y, rotation, zIndex), and 9 directed relations (crosses, grounds, crowns, leads_to, mirrors, opposes, clarifies, culminates_in, adjacent_to). Canonical catalog and npm validator (@arcana-schema/validator).',
    firstStepDe: {
      ticket: 'Arcana Schema v2.0.0 Veröffentlichung & Community Reddit Post (Ticket #01).',
      criteria: 'Spezifikation unter felixinberlin.github.io/Arcana-schema/ veröffentlicht, npm-Paket @arcana-schema/validator einsatzbereit und Community-Outreach-Post für Reddit mit Schema-Minimalbeispiel aufbereitet.'
    },
    firstStepEn: {
      ticket: 'Arcana Schema v2.0.0 Release & Community Reddit Post (Ticket #01).',
      criteria: 'Specification published at felixinberlin.github.io/Arcana-schema/, npm package @arcana-schema/validator live, and community announcement post for Reddit prepared with minimal schema example.'
    },
    failureModeDe: 'Überformalisierung vs. intuitive Mehrdeutigkeit: Ein Schema, das versucht, alle spirituellen Nuancen in Enums zu zwingen, scheitert. Die DSL muss strikt Struktur und geometrische Relationen beschreiben, niemals Textbedeutungen (diese bleiben Sache des Decks).',
    failureModeEn: 'Over-formalization vs. intuitive ambiguity: A schema trying to compress esoteric nuance into rigid enums kills the practice. The DSL must strictly describe topological structure and geometry, never semantic card definitions.',
    priorArtDe: 'metabismuth/tarot-json liefert Karten-Daten, aber keine Legesysteme; fzlzjerry/tarot-mcp nutzt Spreads nur als Prompt-Vorlagen; Labyrinthos besitzt 30+ kuratierte Spreads in einer proprietären App. Arcana Schema bietet den ersten offenen Graph-Standard.',
    priorArtEn: 'metabismuth/tarot-json solves card catalogs but ignores spreads; fzlzjerry/tarot-mcp uses spreads only as prompt templates; Labyrinthos curates 30+ spreads inside a walled app. Arcana Schema provides the first open graph standard.',
    emailTemplate: {
      to: 'r/tarot, r/webdev, r/indiegames, r/occult (Reddit Announcement Post)',
      subjectDe: '[Show & Tell] Arcana Schema: Ein open-source JSON-Schema-Standard für Tarot-Legesysteme & Reading-Logs',
      subjectEn: '[Show & Tell] Arcana Schema: An open-source JSON Schema standard for Tarot Spreads & Reading Logs',
      bodyDe: `Hallo zusammen,

die meisten Tarot-Apps, Bots und Narrative-Engines speichern Legesysteme nach wie vor als starre, fest verdrahtete Arrays (\`cards[0]..cards[9]\`). Strukturelle Beziehungsregeln — etwa warum Karte 2 Karte 1 um 90° kreuzt, wie Umkehrungen kausale Übergänge blockieren oder wie Nicht-Standard-Decks (z. B. 22 Große Arkana) validiert werden — bleiben in proprietärem Code oder Prosa verborgen.

Um das zu lösen, haben wir **Arcana Schema** (v2.0.0) als herstellerunabhängigen, open-source JSON-Schema-Standard (Draft 2020-12 & Draft-7) veröffentlicht:
- **Clean Separation (\`TarotSpreadDefinition\` vs. \`TarotReading\`):** Wiederverwendbare Legesysteme sind strikt von historischen Sitzungsprotokollen getrennt.
- **Deck-Verträge (\`deckContract\`):** Validieren Mindestkarten, Arcana-Anforderungen und Reversals vor dem Ziehen.
- **Räumliche Slot-Koordinaten (\`layout\`):** Relative (x, y, Rotation, zIndex) Positionen ermöglichen dynamische Frontends ohne CSS-Hack pro Spread.
- **Typisierte Relationen (\`relations\`):** 9 gerichtete Beziehungs-Kanten (\`leads_to\`, \`crosses\`, \`grounds\`, \`crowns\`, \`mirrors\`, \`opposes\`, \`clarifies\`, \`culminates_in\`, \`adjacent_to\`) für autonome Layout-Engines und strukturierte LLM-Analysen.

Hier ist ein Minimalbeispiel für ein 3-Karten-Legesystem in Arcana Schema:

\`\`\`json
{
  "schemaVersion": "2.0.0",
  "id": "past-present-future",
  "name": "Past, Present, Future",
  "deckContract": { "minCards": 3, "allowReversals": true },
  "slots": [
    { "id": "past", "order": 1, "role": "Past Foundations", "layout": { "x": 0.2, "y": 0.5, "rotation": 0 } },
    { "id": "present", "order": 2, "role": "Present Circumstance", "layout": { "x": 0.5, "y": 0.5, "rotation": 0 } },
    { "id": "future", "order": 3, "role": "Emerging Outcome", "layout": { "x": 0.8, "y": 0.5, "rotation": 0 } }
  ],
  "relations": [
    { "source": "past", "target": "present", "type": "leads_to" },
    { "source": "present", "target": "future", "type": "leads_to" }
  ]
}
\`\`\`

Die Spezifikation, Dokumentation und der interaktive Playground stehen unter https://felixinberlin.github.io/Arcana-schema/ bereit.
Das GitHub-Repository findet ihr unter https://github.com/felixinberlin/Arcana-schema, und das npm-Paket ist als \`@arcana-schema/validator\` verfügbar.

Das Projekt ist komplett open-source und frei nutzbar (MIT / CC BY 4.0).`,
      bodyEn: `Hi everyone,

Most tarot apps, Discord bots, and game narrative engines still implement tarot spreads as rigid, hardcoded arrays (\`cards[0]..cards[9]\`). The structural rules — why Card 2 crosses Card 1 at 90°, how reversals block causal transitions, or how non-standard decks (such as 22-card Majors-only decks) validate — remain trapped inside custom code or loose prose.

To solve this, we created **Arcana Schema** (v2.0.0), an open-source, vendor-independent JSON Schema standard (JSON Schema Draft 2020-12 & Draft-7):
- **Clean Separation (\`TarotSpreadDefinition\` vs. \`TarotReading\`):** Decouples reusable spread definitions from historical reading logs.
- **Declarative Deck Contracts (\`deckContract\`):** Validates card counts, arcana requirements, and reversal constraints before drawing.
- **Spatial Slot Coordinates (\`layout\`):** Normalized (x, y, rotation, zIndex) positions allow web engines to render layouts dynamically without custom CSS per spread.
- **Typed Directed Relations (\`relations\`):** 9 semantic edge types (\`leads_to\`, \`crosses\`, \`grounds\`, \`crowns\`, \`mirrors\`, \`opposes\`, \`clarifies\`, \`culminates_in\`, \`adjacent_to\`) enabling autonomous rendering and structured LLM agent evaluation.

Here is a minimal Arcana Schema example defining a Past-Present-Future spread:

\`\`\`json
{
  "schemaVersion": "2.0.0",
  "id": "past-present-future",
  "name": "Past, Present, Future",
  "deckContract": { "minCards": 3, "allowReversals": true },
  "slots": [
    { "id": "past", "order": 1, "role": "Past Foundations", "layout": { "x": 0.2, "y": 0.5, "rotation": 0 } },
    { "id": "present", "order": 2, "role": "Present Circumstance", "layout": { "x": 0.5, "y": 0.5, "rotation": 0 } },
    { "id": "future", "order": 3, "role": "Emerging Outcome", "layout": { "x": 0.8, "y": 0.5, "rotation": 0 } }
  ],
  "relations": [
    { "source": "past", "target": "present", "type": "leads_to" },
    { "source": "present", "target": "future", "type": "leads_to" }
  ]
}
\`\`\`

Live Documentation & Interactive Playground: https://felixinberlin.github.io/Arcana-schema/
GitHub Repository: https://github.com/felixinberlin/Arcana-schema
npm package: \`@arcana-schema/validator\`

Dual-licensed under MIT (code & schema structure) and CC BY 4.0 (interpretive text) — completely free for indie deck creators, game designers, and developers.`
    }
  },
  {
    id: 'traumtagebuch',
    title: 'Lokales Traumtagebuch',
    titleEn: 'Local Offline Dream Journal',
    oneLinerDe: 'Träume erfassen und semantisch clustern — vollständig offline, verschlüsselt und ohne dass deine intimsten Gedanken auf fremden Cloud-Servern landen.',
    oneLinerEn: 'Record and semantically cluster dreams: 100% offline, client-side encrypted, keeping your intimate subconscious thoughts off cloud servers.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Schlaflabore / Oneirogene Forschung · Obsidian / Logseq Plugin-Ökosystem · Privacy Tools',
    recipientsEn: 'Sleep researchers / oneironautics · Obsidian/Logseq plugin communities · Local-first advocates',
    domain: 'knowledge',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Privacy', 'Local-First', 'Vector Search', 'Psychologie', 'Verschlüsselung'],
    problemDe: 'Wer Träume digital erfasst, nutzt Notiz-Apps, die unverschlüsselt in US-Clouds synchronisieren. Träume enthalten privateste Metaphern und Ängste. Gleichzeitig fehlen traditionellen Papierbüchern semantische Querverbindungen („Wann träume ich von alten Bahnhöfen?").',
    problemEn: 'Dreamers who digitize journals use cloud apps that expose their subconscious fears and intimate metaphors. Conversely, paper notebooks prevent semantic clustering of recurring symbolic motifs.',
    whyNowDe: [
      'Kleine Embedding-Modelle (ONNX / Transformers.js) laufen direkt im Browser ohne Backend.',
      'WebCrypto und IndexedDB ermöglichen Zero-Knowledge-Verschlüsselung mit Passwortableitung.'
    ],
    whyNowEn: [
      'Compact embedding models (Transformers.js) execute locally in the browser.',
      'WebCrypto and IndexedDB enable real zero-knowledge client-side encryption.'
    ],
    sketchDe: 'Progressive Web App: Offline-First, Passphrase entsperrt Tresor. Lokale Vektorberechnung. Visualisiert wiederkehrende Symbole und Gefühlsdynamiken als semantische Sternenkarte.',
    sketchEn: 'Offline-first PWA: Passphrase decrypts vault. On-device vector embeddings generate a celestial semantic map of recurring motifs over months.',
    firstStepDe: {
      ticket: 'Verschlüsselter Speicher und lokale Ähnlichkeitssuche.',
      criteria: 'Zwei Träume eingeben, offline Ähnlichkeit über lokale Embeddings berechnen, ohne Netzwerkanfrage.'
    },
    firstStepEn: {
      ticket: 'Encrypted storage with local semantic vector search.',
      criteria: 'Input two dream entries, verify zero outgoing network requests, compute cosine similarity in browser memory.'
    },
    failureModeDe: 'Pseudowissenschaftliche Traumdeutung: Die App darf keine esoterischen Deutungen erfinden, sondern nur eigene semantische Muster spiegeln.',
    failureModeEn: 'Astrology trap: Inventing fake dream interpretations instead of objectively reflecting the user\'s own recurring language.',
    priorArtDe: 'Kommerzielle Traum-Apps monetarisieren Daten mit KI-Deutungen; lokale sichere Alternativen existieren kaum.',
    priorArtEn: 'Commercial dream apps harvest personal entries for targeted ads and dubious AI horoscope readings.'
  },
  {
    id: 'wet-ink',
    title: 'Wet Ink',
    titleEn: 'Wet Ink (Capillary Flow Simulator & Modular SDK)',
    oneLinerDe: 'Tinte auf Papier als echte physikalische Mehrschicht-Simulation — Kapillarfluss mit Schwellenwert, Faser-Anisotropie, Kubelka-Munk-Optik, taktile Akustik und modulares SDK.',
    oneLinerEn: 'Physical ink on paper simulation: capillary pore thresholding, fiber anisotropy, Kubelka-Munk optical glazing, tactile acoustics, and headless SDK.',
    date: 'September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Escape Motions (Rebelle) · Open-Source RTE & Editor-Communities (TipTap, ProseMirror, Obsidian, tldraw) · Sumi-e & Kalligrafie-Szene · WebGL Grafik-Lehre',
    recipientsEn: 'Escape Motions (Rebelle) · Open-source RTE & editor communities (TipTap, ProseMirror, Obsidian, tldraw) · Sumi-e & calligraphy circles · WebGL graphics education',
    domain: 'creative',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['WebGL2', 'Physik', 'Shader', 'Kalligrafie', 'Headless-SDK', 'TipTap', 'React', 'Obsidian'],
    problemDe: 'Digitale Pinselwerkzeuge in Photoshop, Procreate oder Web-Editoren nutzen Bitmap-Stempel. Echte Tinte verhält sich physikalisch grundlegend anders: Sie wandert kapillar entlang von Papierfasern (Feathering), lagert Pigmente am getrockneten Rand ab (Edge Darkening) und granuliert in Papiertälern.',
    problemEn: 'Digital brushes rely on repeated bitmap stamps. Real wet ink behaves fundamentally like fluid porous physics: capillary bleed along cellulose fibers, coffee-ring edge darkening, and pigment pooling in paper valleys.',
    whyNowDe: [
      'WebGL2 mit Float-Texturen erlaubt gekoppelte Dreischicht-Simulation (Papier, Wasser, Fasern) bei 60 FPS in jedem Browser.',
      'Kubelka-Munk Farbmischung ersetzt simples Alpha-Blending durch physikalische Lichtabsorption und -streuung.',
      'Headless entkoppelte Architektur (@wet-ink/core) mit Adaptern für TipTap, React, Obsidian und Web Components.'
    ],
    whyNowEn: [
      'WebGL2 float textures support 3-layer physical ink simulation (paper, water, fibers) at 60 FPS in any standard browser.',
      'Kubelka-Munk optical model enables authentic subtractive pigment wash glazing instead of alpha blending.',
      'Headless decoupled architecture (@wet-ink/core) with turnkey adapters for TipTap, React, Obsidian, and Web Components.'
    ],
    sketchDe: 'Drei gekoppelte Texturschichten: Papierfasern (Höhe, Richtung, Kapazität), Oberflächenwasser (Geschwindigkeit, Pigment), Faserschicht (Deponiertes Pigment). Sieben Shader-Pässe mit Kapillarschwelle, Web Audio Haptik und Marching Squares Vektorexport.',
    sketchEn: 'Three linked simulation textures: paper substrate (roughness, grain vector, moisture capacity), water layer (velocity, suspended pigment), and stained fiber layer. 7 sequential shader passes, Web Audio acoustics, and Marching Squares vectorizer.',
    firstStepDe: {
      ticket: 'Ticket #1 & #2: @wet-ink/core Headless Fluid-Kernel, RTE-Adapter, Akustik & Vektor-SVG.',
      criteria: 'Framework-freie TS-Engine (<15 kB) mit 7-Pass-Simulation, Kapillarschwelle ε_min und 3-Phasen-Lifecycle (Nass 60 FPS → Trocknen 3s → 0 FPS Ruhezustand). Lauffähig mit TipTap, React, Obsidian und Live-Simulator (315 Tests grün).'
    },
    firstStepEn: {
      ticket: 'Ticket #1 & #2: @wet-ink/core Headless Fluid Kernel, RTE Adapters, Acoustics & Vector SVG.',
      criteria: 'Zero-dependency TS engine (<15 kB) with 7-pass simulation, capillary threshold ε_min, and 3-phase lifecycle (Wet 60 FPS → Drying 3s → 0 FPS Rest). Integrated into TipTap, React, Obsidian, and live simulator (315 tests passing).'
    },
    failureModeDe: 'Rauch statt Tinte: Ohne strikte Kapillarschwelle diffundiert das Pigment wolkig wie Rauch. Gelöst durch Kapillarschwelle vor der fluiden Advektion und Ruhezustands-Wächter gegen GPU-Last.',
    failureModeEn: 'The smoke bug: Without a strict capillary threshold, ink bleeds like soft smoke. Enforces capillary threshold before fluid advection, with idle sleep monitoring against GPU drain.',
    priorArtDe: 'Kommerzielle Monolithe verlangen 90–150 $ (Rebelle) oder 10–65 $/Monat (Adobe Fresco) für proprietäre Desktop-Silos. Unsere freie Web-Infrastruktur verschenkt diese Physik als offenes modulares Ökosystem.',
    priorArtEn: 'Commercial monoliths charge $90–$150 (Rebelle) or $10–$65/mo (Adobe Fresco) for closed desktop silos. Our open web infrastructure releases this physics as a free, modular ecosystem.'
  },
  {
    id: 'pillsafe-vision',
    title: 'PillSafe Vision',
    titleEn: 'PillSafe Vision',
    oneLinerDe: 'Ein Foto der 7-Tage-Dosette schützt pflegende Angehörige vor lebensgefährlichen Verwechslungen — multimodale Erkennung von Pillenprägung und Farbe gleicht alles mit dem Medikationsplan ab.',
    oneLinerEn: 'A single overhead photo of a 7-day pillbox shields exhausted family caregivers from fatal medication errors using multimodal imprint and color verification against doctor schedules.',
    date: 'September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'Pflegestützpunkte Deutschland · BAGSO (Seniorenorganisationen) · Pflegende Angehörige e.V.',
    recipientsEn: 'Family Caregiver Alliance · AARP Caregiving · National Institute on Aging',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['AI-Native', 'Pflege', 'Vision AI', 'Senioren', 'Gesundheit', 'Lokal'],
    problemDe: 'Über 4 Millionen Menschen pflegen Angehörige zuhause. Polymedikation (5 bis 12 verschiedene Tabletten täglich) führt bei Erschöpfung regelmäßig zu fatalen Doppelgaben oder Verwechslungen weißer Generika-Tabletten.',
    problemEn: 'Over 40 million informal family caregivers sort polypharmacy regimens late at night. Visually indistinguishable white generic pills lead to thousands of avoidable hospitalizations annually.',
    whyNowDe: [
      'Multimodale Vision-Modelle erkennen mikroskopische Pillenprägungen (z.B. Bruchrillen, Ziffern) selbst bei ungünstigem Küchenlicht.',
      'WebAssembly/WebGPU ermöglicht vollständige Bildanalyse im Browser ohne Übertragung intimer Patientendaten an fremde Clouds.',
      'Standardisierte BMP-QR-Codes auf deutschen Arztbriefen lassen sich sekundenschnell einscannen.'
    ],
    whyNowEn: [
      'Multimodal vision models parse subtle tablet imprints, bevels, and scoring lines under uneven kitchen illumination.',
      'WebGPU/Wasm enables complete on-device inference with zero patient data transmission to corporate clouds.',
      'Standardized national prescription QR codes allow instant schedule synchronization.'
    ],
    sketchDe: 'Kamera erfasst 7x4 Dosetten-Gitter. Ein Segmentierungsmodell isoliert jedes Fach. Ein Zero-Shot Vision-Modell zählt Tabletten und verifiziert Form/Prägung. Farbige Ampel zeigt sofort: „Mittwoch Mittag fehlt Blutdrucksenker".',
    sketchEn: 'Camera scans 7x4 organizer grid. Segmentation isolates compartments. Vision model counts tablets and cross-references imprints against medication schedule, instantly flagging discrepancies.',
    firstStepDe: {
      ticket: 'P0: 4-Fächer-Dosette Foto-Segmentierung und Pillenzählung.',
      criteria: 'Erkennt bei 10 realen Testfotos die exakte Tablettenanzahl pro Fach mit 95% Genauigkeit.'
    },
    firstStepEn: {
      ticket: 'P0: 4-slot pillbox photo segmentation and tablet count.',
      criteria: 'Counts tablet units per compartment with 95% accuracy across 10 sample images.'
    },
    failureModeDe: 'Falsche Sicherheit bei identisch aussehenden weißen Tabletten ohne Prägung: Das System muss bei Unklarheit explizit warnen („Tablette 3 nicht eindeutig unterscheidbar, bitte Beipackzettel prüfen") statt zu raten.',
    failureModeEn: 'False confidence on generic identical unmarked white tablets: Model must output explicit ambiguity warnings rather than ungrounded guesses.',
    priorArtDe: 'Pillen per Foto bestimmen ist ein dichter Markt (Smart Pill ID, checkmypill, Pill Pal, AI Pill Identifier), Tabletten per Kamera zählen ebenso (PillScan). Den bundeseinheitlichen Medikationsplan per QR-Code einlesen können MyTherapy und gesund.de kostenlos. Nicht gefunden (Prüfung 24.09.2026): eine App, die die gefüllte Dosette Fach für Fach gegen den Plan abgleicht. Vor jeder Zustellung offen: ob eine solche Warnfunktion ein Medizinprodukt wäre, und ob es für deutsche Generika eine offene Prägungsdatenbank gibt.',
    priorArtEn: 'Identifying pills by photo is a crowded market (Smart Pill ID, checkmypill, Pill Pal, AI Pill Identifier), and so is counting tablets by camera (PillScan). MyTherapy and gesund.de already scan the German federal medication plan QR code for free. Not found (check of 24.09.2026): an app that verifies a filled pill organizer compartment by compartment against the plan. Open before any delivery: whether such a warning feature would be a regulated medical device, and whether an open imprint database exists for German generics.',
    aiFrontier: {
      impossibleBeforeAiDe: 'Klassische Computer Vision scheiterte kläglich an Plastikspiegelungen, Schattenwurf in tiefen Fächern und minimalen Unterschieden weißer runder Pillen. Erst multimodale Vision-Netze erfassen semantische Prägungen und Kontext.',
      impossibleBeforeAiEn: 'Traditional OpenCV failed completely on plastic lid reflections, compartment shadow occlusions, and subtle 1mm bevel variations. Multimodal vision models solve this via zero-shot semantic visual reasoning.',
      aiTechStack: ['Florence-2 / Segment Anything Edge', 'WebGPU Multimodal Runtime', 'National BMP QR Parser', 'Local-First IndexDB'],
      privacyModelDe: '100% On-Device: Bilder verlassen niemals das Smartphone. Keine Accounts, keine Telemetrie, DSGVO-souverän.',
      privacyModelEn: '100% On-Device: Images never leave the handset. No accounts, zero analytics, zero health data leakage.',
      ordinaryPeopleBenefitDe: 'Nimmt pflegenden Angehörigen die quälende Angst, die eigene Mutter mit einer falschen Dosis ins Krankenhaus zu befördern.',
      ordinaryPeopleBenefitEn: 'Erases the paralyzing nocturnal dread of accidentally giving an elderly parent a double dose of heart medication.',
      learningCurriculumDe: [
        { step: 1, title: 'Woche 1: Bildgeometrie & Gitter-Entzerrung', focus: 'Homographie-Transformation zur Perspektivenkorrektur schiefer Handyfotos von Dosetten', milestone: 'Rechteckiges 4x7 Gitter wird aus jedem Winkel planar ausgerichtet' },
        { step: 2, title: 'Woche 2: Edge-Vision & Pillen-Segmentierung', focus: 'Wasm-basiertes SAM/YOLO zur Erkennung einzelner Pillen-Polygone in Vertiefungen', milestone: 'Exakte Zählung der Pillen pro Fach ohne Server-Roundtrip' },
        { step: 3, title: 'Woche 3: Prägungs- & OCR-Feinabstimmung', focus: 'Kontrastverstärkung und Zero-Shot Vision-Klassifikation von Tabletten-Codes (z.B. "50", "Bayer")', milestone: 'Verlässliche Zuordnung von Wirkstoffstärken' },
        { step: 4, title: 'Woche 4: Medikationsplan-Integration & UI-Ampel', focus: 'Abgleich mit Arzt-QR-Codes und fehlertolerante Benutzeroberfläche für Senioren', milestone: 'Klickbarer Prototyp mit roter/grüner Statusbox und akustischem Signal' }
      ],
      learningCurriculumEn: [
        { step: 1, title: 'Week 1: Perspective Homography', focus: 'Correcting angled smartphone snapshots of pillboxes into planar grids', milestone: 'Planar 4x7 grid rectification from hand-held camera angles' },
        { step: 2, title: 'Week 2: Edge-Vision Segmentation', focus: 'Lightweight Wasm segmentation isolating individual pills in shadows', milestone: 'Real-time pill count verification on client device' },
        { step: 3, title: 'Week 3: Micro-Imprint OCR & Classification', focus: 'Contrast enhancement and zero-shot visual parsing of tablet codes', milestone: 'Accurate differentiation between 25mg and 50mg scored pills' },
        { step: 4, title: 'Week 4: Prescription Pairing & High-Contrast UI', focus: 'Matching vision outputs to structured prescription standards with clear cues', milestone: 'Accessible web app with unambiguous green/amber/red indicators' }
      ]
    }
  },
  {
    id: 'klang-stethoskop',
    title: 'KlangStethoskop',
    titleEn: 'Acoustic Machine Stethoscope',
    oneLinerDe: 'Smartphone an die laute Heizungspumpe oder Waschmaschine halten — akustische Neuronale Netze diagnostizieren Lagerschaden oder Kavitation und zeigen die 10€-Reparatur.',
    oneLinerEn: 'Hold phone to a grinding heating pump or washing machine — acoustic neural networks diagnose bearing failure or cavitation, guiding a $10 DIY repair instead of replacement.',
    date: 'September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'Netzwerk Reparatur-Initiativen (Repair Cafés) · Bund der Energieverbraucher · Verbraucherzentrale',
    recipientsEn: 'iFixit Global Community · Repair Café International · Community Tool Libraries',
    domain: 'physics',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['AI-Native', 'Handwerk', 'Repair Café', 'Audio AI', 'Physik', 'Nachhaltigkeit'],
    problemDe: 'Wenn die Umwälzpumpe der Heizung oder das Lager der Waschmaschine schleift, tauschen Installateure meist das gesamte Gerät für 800–2.000 € aus. Verbraucher können normale Laufgeräusche nicht von trivialen, leicht behebbaren Fehlern unterscheiden.',
    problemEn: 'When heating pumps or appliance bearings vibrate, technicians push costly full-unit replacements ($800-$2,500). Normal people cannot distinguish harmless resonance from a dry $8 ball bearing.',
    whyNowDe: [
      'Audio-Transformer und Spektrogramm-KI klassifizieren mechanische Frequenzspitzen und Resonanzen in Echtzeit im Browser.',
      'Web Audio API liefert hochpräzise FFT-Rohdaten direkt über das Smartphone-Mikrofon.',
      'Offene Anomalie-Datensätze für Pumpen und Ventilatoren (MIMII) zeigen, dass die Methode trägt — für Haushaltsgeräte fehlt der Datensatz noch, und ihn anzulegen wäre der erste echte Schritt.'
    ],
    whyNowEn: [
      'Audio transformers and edge spectrogram models classify mechanical harmonics in real time on phones.',
      'Web Audio API captures high-resolution FFT telemetry directly from consumer microphones.',
      'Open anomaly datasets for pumps and fans (MIMII) show the method works — for household appliances the dataset is still missing, and building it would be the first real step.'
    ],
    sketchDe: '5 Sekunden Audioaufnahme bei laufendem Motor. Echtzeit-Wasserfall-Spektrogramm. Neuronales Modell vergleicht Frequenzen mit Fehlerdatenbank (Kavitation, Schaufelradbruch, Fremdkörper, Lagerspiel). Schritt-für-Schritt-Anleitung zur Reparatur.',
    sketchEn: '5-second audio sample while motor runs. Real-time waterfall spectrogram. Neural classifier matches harmonics against mechanical failure benchmarks (cavitation, worn bearing, debris). Outputs visual repair guide.',
    firstStepDe: {
      ticket: 'P0: Spektrogramm-Visualisierung und Peak-Frequenzerkennung im Browser.',
      criteria: 'Zeigt bei laufendem Haushaltsgerät die dominante Rotationsfrequenz und deren Oberschwingungen in Hz an.'
    },
    firstStepEn: {
      ticket: 'P0: Web Audio spectrogram visualizer with harmonic peak detection.',
      criteria: 'Displays primary rotation frequency and harmonic overtone peaks in Hz from live microphone.'
    },
    failureModeDe: 'Mikrofonverzerrung durch Übersteuerung bei lauten Motoren: App muss Nutzer warnen, das Telefon 20 cm entfernt zu halten und Verstärkung automatisch regeln.',
    failureModeEn: 'Microphone clipping: Loud motors saturate consumer mics; app must enforce a 20cm distance rule and autogain normalization.',
    priorArtDe: 'Das Spektrum auf dem Handy ist gelöst: Vibrations- und FFT-Apps gibt es viele (Vibration, WiSER VIBE, Resonance, myFrequency), Motorgeräusch-Diagnose per KI fürs Auto ebenfalls (Carithm). Maschinengeräusch-Anomalieerkennung ist ein etabliertes Forschungsfeld (DCASE-Challenge, MIMII-Datensatz für Pumpen, Ventilatoren und Ventile). Der Repair-Café-Diagnoseassistent steht im Prüfprotokoll als besetzt. Nicht gefunden: eine offene Sammlung von Fehlergeräuschen für Haushaltsgeräte — ohne sie hat das Modell nichts zu lernen, und genau diese Sammlung wäre der eigentliche Beitrag.',
    priorArtEn: 'The spectrum on a phone is solved: vibration and FFT apps abound (Vibration, WiSER VIBE, Resonance, myFrequency), and AI engine-noise diagnosis exists for cars (Carithm). Machine anomalous-sound detection is an established research field (DCASE challenge, MIMII dataset for pumps, fans and valves). A Repair Café diagnosis assistant is already recorded as taken. Not found: an open collection of household-appliance fault sounds — without it the model has nothing to learn from, and that collection would be the actual contribution.',
    aiFrontier: {
      impossibleBeforeAiDe: 'Klassische Frequenzanalyse (einfache FFT) scheiterte an Umgebungsgeräuschen (Kindergeschrei, Verkehrslärm, Hall im Heizungskeller). Erst neuronale Audio-Filter trennen Hintergrundkrach von mechanischen Kausalmustern.',
      impossibleBeforeAiEn: 'Basic Fourier transforms failed due to ambient kitchen echoes, voices, and traffic rumble. Modern neural audio models isolate machine harmonic patterns from chaotic room acoustics.',
      aiTechStack: ['Web Audio API FFT Engine', 'Mel-Spectrogram Convolutional Backbone', 'Edge WebAssembly Inference', 'iFixit Open Repair Graph'],
      privacyModelDe: 'Audiodaten werden ausschließlich flüchtig im Arbeitsspeicher analysiert und niemals auf Server übertragen.',
      privacyModelEn: 'Acoustic samples are evaluated in ephemeral browser memory and immediately discarded with zero cloud upload.',
      ordinaryPeopleBenefitDe: 'Verhindert, dass Mieter und Rentner hunderte Euro an unnötigen Handwerker-Austauschkosten für kleinste Verschleißteile zahlen.',
      ordinaryPeopleBenefitEn: 'Saves households hundreds of dollars in needless appliance replacements by identifying accessible $10 repairs.',
      learningCurriculumDe: [
        { step: 1, title: 'Woche 1: Web Audio API & Reales Spektrogramm', focus: 'Mikrofon-Eingang mit hoher Sampling-Rate (44.1/48kHz) und 2D-Wasserfall-Darstellung', milestone: 'Flüssige Visualisierung mechanischer Obertöne im Browser' },
        { step: 2, title: 'Woche 2: Akustische Rauschunterdrückung', focus: 'Filterung von Stimmen und Raumhall zur Isolation periodischer Maschinensignaturen', milestone: 'Sauberes Signal selbst bei hallenden Fliesen im Keller' },
        { step: 3, title: 'Woche 3: Neuronale Klassifikation von Schäden', focus: 'Training eines kompakten Modells auf Lager-Vibration, Kavitation und Unwucht', milestone: 'Diagnostische Genauigkeit >90% bei Test-Audioclips' },
        { step: 4, title: 'Woche 4: Reparaturanleitungs-Matching', focus: 'Verknüpfung der Fehlerdiagnose mit offenen iFixit- und Ersatzteilkatalogen', milestone: 'Benutzer sieht sofort Teilenummer, Werkzeugbedarf und Reparaturaufwand' }
      ],
      learningCurriculumEn: [
        { step: 1, title: 'Week 1: Web Audio High-Resolution Spectrogram', focus: 'Capturing clean 48kHz audio streams with canvas waterfall frequency rendering', milestone: 'Smooth browser visualization of mechanical overtones' },
        { step: 2, title: 'Week 2: Ambient Acoustic Denoising', focus: 'Stripping vocal chatter and room reverb to isolate periodic machine vibration', milestone: 'Stable diagnostic baseline in reverberant basement environments' },
        { step: 3, title: 'Week 3: Neural Harmonics Classification', focus: 'Training a compact edge model on bearing wear, cavitation bubbles, and rotor imbalance', milestone: '>90% diagnostic accuracy on open machine acoustic benchmarks' },
        { step: 4, title: 'Week 4: Repair Guide Synthesizer', focus: 'Mapping acoustic failure signatures to open-source repair manuals and replacement part specs', milestone: 'Clear display of replacement part cost, required tools, and DIY difficulty' }
      ]
    }
  },
  {
    id: 'dose-nurse-shift-guardian',
    title: 'DienstplanWächter (Shift Roster Auditor & Bonus Shield)',
    titleEn: 'Shift Roster Auditor & Statutory Bonus Shield',
    oneLinerDe: 'Fotografiert den Stations-Dienstplan, warnt vor illegalen Ruhezeitverkürzungen und berechnet steuerfreie Nacht- und Sonntagszuschläge.',
    oneLinerEn: 'Photographs hospital breakroom shift rosters, warns against illegal sub-11h turnaround shifts, and audits tax-free overtime wage bonuses.',
    date: '17.09.2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'ver.di Fachbereich Gesundheit · DBfK Deutscher Berufsverband für Pflegeberufe · Junge Pflege',
    recipientsEn: 'National Nurses United · Royal College of Nursing · European Federation of Nurses Associations',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    problemDe: 'Pflegekräfte rotieren durch zermürbende Schichten. Wegen handschriftlich korrigierter Aushänge gehen monatlich bis zu 300 € an Zuschlägen verloren, während illegale "Spät-auf-Früh"-Wechsel die Gesundheit zerstören.',
    problemEn: 'Nurses rotate through exhausting shifts. Messy paper breakroom corrections cause missed payroll bonuses of up to $300 monthly, while illegal short-rest turnarounds destroy physical and mental health.',
    whyNowDe: [
      'Multimodale Vision liest selbst unleserliche Kuli-Korrekturen und Pfeile auf laminierten Stations-Plänen.',
      'Edge-Modelle vergleichen Schichtfolgen lokal mit § 5 ArbZG und Tarifverträgen (TVöD-K, AVR) in Sekunden.',
      'Datenschutz: Keine Patientendaten, keine Cloud-Speicherung — schützt die Privatsphäre des Pflegepersonals.'
    ],
    whyNowEn: [
      'Multimodal vision decodes scribbled ballpoint amendments and directional arrows on crumpled staff bulletin boards.',
      'Edge models reconcile shift chronologies against statutory labor rest laws and collective bargaining agreements in seconds.',
      'Zero Cloud Risk: Operates entirely on the nurse\'s phone without uploading sensitive hospital scheduling data.'
    ],
    sketchDe: 'Foto des Dienstplan-Ausschnitts machen. Eigene Zeile antippen. KI berechnet Netto-Zuschläge (25% Nacht, 50% Sonntag, 35% Feiertag) und prüft 11-Stunden-Ruhezeit. Export als Gehalts-Prüfprotokoll.',
    sketchEn: 'Snap photo of ward roster. Tap your name row. AI computes net supplement entitlement (night, Sunday, holiday) and verifies 11-hour rest buffers. Generates payroll audit slip.',
    firstStepDe: {
      ticket: 'P0: Tabellen-Segmentierung für 1-Wochen-Dienstplan mit Erkennung der Schichtkürzel F, S, N.',
      criteria: 'Erkennt bei 10 verschiedenen Schriftbildern 95% der Schichtkürzel und berechnet Stundensummen fehlerfrei.'
    },
    firstStepEn: {
      ticket: 'P0: Roster grid cell extraction for 1-week rosters mapping shift symbols (E, L, N).',
      criteria: 'Achieves 95% parsing accuracy across 10 sample clinic rosters and sums working hours correctly.'
    },
    failureModeDe: 'Schlechtes Licht im Stations-Pausenraum: Bildverbesserungs-Filter (Grauwert-Spreizung und Schärfung) vor der Erkennung zwingend erforderlich.',
    failureModeEn: 'Dim breakroom lighting: Requires automated contrast stretching and adaptive thresholding prior to multimodal inference.',
    priorArtDe: 'Dienstplan abfotografieren und in den Kalender übernehmen können Shift2Cal AI (ausdrücklich für Pflegekräfte) und allgemeine Foto-zu-Kalender-Apps (Smart Calendars AI, ALMO). Zuschlagsrechner für Nacht, Sonntag und Feiertag gibt es viele und kostenlos (Ordio, Kenjo, rechner-portal.de, schichtlohnrechner.de; TVöD-Sätze in der Schichtplan-Fibel). Dienstplan-Software für Häuser prüft Ruhezeiten für die Leitung. Nicht gefunden: dieselbe Prüfung auf der Seite der Beschäftigten — Ruhezeit nach § 5 ArbZG und Tarifzuschläge aus dem eigenen Plan, als Beleg für Betriebsrat oder Gewerkschaft. Die Lücke ist die Kombination, keine neue Fähigkeit.',
    priorArtEn: 'Photographing a roster into a calendar is done by Shift2Cal AI (explicitly for nurses) and generic photo-to-calendar apps (Smart Calendars AI, ALMO). Free premium-pay calculators for nights, Sundays and holidays are plentiful (Ordio, Kenjo, rechner-portal.de, schichtlohnrechner.de). Hospital rostering software checks rest periods for management. Not found: the same check on the employee side — statutory rest periods and collective-agreement premiums from one\'s own roster, as evidence for a works council or union. The gap is the combination, not a new capability.',
    tags: ['Echte Arbeit', 'Pflege', 'Schichtdienst', 'Arbeitsrecht', 'Lohnschutz', 'AI-Native'],
    emailTemplate: {
      subjectDe: 'Ein Geschenk für Pflegende: DienstplanWächter (CC0 Open Source)',
      bodyDe: 'Liebes Team vom Berufsverband,\n\nwir haben ein werbefreies, quelloffenes Werkzeug gebaut, das Pflegekräften hilft, handschriftliche Dienstpläne zu fotografieren, unberechnete Zuschläge aufzudecken und illegale Ruhezeitverkürzungen abzuwehren. Es ist ein bedingungsloses Geschenk (CC0) ohne kommerzielle Absicht.\n\nHerzliche Grüße,\nAmélie Initiative',
      subjectEn: 'A Gift for Nurses: Open Shift Guardian (CC0 Public Good)',
      bodyEn: 'Dear Nursing Association Team,\n\nWe have developed an ad-free, open-source tool enabling nurses to photograph paper rosters, audit missing shift bonuses, and defend mandatory rest periods. It is offered as an unconditional gift (CC0).\n\nWarm regards,\nAmélie Initiative',
      to: 'kontakt@dbfk.de'
    },
    aiFrontier: {
      impossibleBeforeAiDe: 'Klassische Tabellen-OCR scheiterte an Pfeilen zwischen Zeilen, handschriftlichen Notizen ("tauscht mit Anna") und ungenormten Abkürzungen.',
      impossibleBeforeAiEn: 'Traditional grid OCR broke on handwritten arrows between staff rows, scribbled notes ("swapped with Anna"), and non-standard ward abbreviations.',
      aiTechStack: ['WebGPU ONNX Runtime', 'Vision-Language Transformer', 'Tarifvertrag (TVöD) Rule Engine', 'Local SQLite Storage'],
      privacyModelDe: 'Vollständig lokale Inferenz im Browser des Smartphones; kein Bild verlässt jemals das Telefon der Pflegekraft.',
      privacyModelEn: 'Strict on-device browser inference; zero images ever leave the healthcare worker’s smartphone.',
      ordinaryPeopleBenefitDe: 'Gibt überarbeiteten Pflegekräften hunderte Euro an rechtmäßigen Nacht- und Feiertagszuschlägen zurück und schützt vor gesundheitsgefährdenden Schichten.',
      ordinaryPeopleBenefitEn: 'Restores hundreds of dollars in earned shift differentials to exhausted hospital workers and shields them from illegal burnout shifts.',
      learningCurriculumDe: [
        { step: 1, title: 'Woche 1: Dienstplan-Gitter-Erkennung', focus: 'Kamera-Perspektivenkorrektur und Zeilen-/Spalten-Extraktion von Dienstplan-Fotos', milestone: 'Rechteckiges Roster-Gitter mit korrekten Wochentagen und Namen' },
        { step: 2, title: 'Woche 2: Handschriften- & Kürzel-Disambiguierung', focus: 'Zuordnung von F1/S3/N-Codes und Pfeilkorrekturen zur jeweiligen Pflegekraft', milestone: 'Fehlerfreie chronologische Schichtfolge pro Person' },
        { step: 3, title: 'Woche 3: Tarif- & Arbeitszeitrechts-Prüfer', focus: 'Berechnung von Nachtstunden (21-6 Uhr), Sonntagszuschlägen und ArbZG-11h-Puffern', milestone: 'Warnmeldung bei Unterschreitung der 11h-Mindestruhezeit' },
        { step: 4, title: 'Woche 4: Lohnabrechnungs-Gegenüberstellung', focus: 'Generierung eines einfachen monatlichen Prüf-Belegs für die Personalabteilung', milestone: 'Druck- und exportfähiges PDF mit aufgeschlüsselten Zuschlägen' }
      ],
      learningCurriculumEn: [
        { step: 1, title: 'Week 1: Roster Grid Rectification', focus: 'Perspective flattening and grid cell segmentation from handheld smartphone photos', milestone: 'Orthogonal grid representation with dates and worker rows' },
        { step: 2, title: 'Week 2: Handwritten Shift Code Disambiguation', focus: 'Mapping idiosyncratic shift symbols and crossed-out corrections to staff identities', milestone: 'Chronological timeline of shifts per nurse' },
        { step: 3, title: 'Week 3: Labor Law & Premium Calculation', focus: 'Evaluating statutory night hours (9pm-6am), weekend rates, and 11-hour turnaround minimums', milestone: 'Automated notification of illegal shift compressions' },
        { step: 4, title: 'Week 4: Payroll Audit Slip Synthesizer', focus: 'Generating a clear monthly variance report to present to hospital payroll accounting', milestone: 'Exportable PDF with itemized bonus calculations' }
      ]
    }
  },
  {
    id: 'dose-tradesman-liability-shield',
    title: 'BedenkenBlitz (VOB/B Baustellen-Schutzschirm)',
    titleEn: 'QuickObjection (Construction Liability Shield)',
    oneLinerDe: '15 Sekunden Sprachmemo + Foto vom feuchten Estrich: Erstellt sofort einen vollständigen Entwurf der VOB/B-Bedenkenanmeldung, bevor weitergearbeitet wird.',
    oneLinerEn: '15-second voice memo + photo of damp screed: instantly drafts a complete statutory notice of concerns before work continues.',
    date: '17.09.2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'Fachverband Fliesen und Naturstein · Zentralverband des Deutschen Baugewerbes · IG BAU',
    recipientsEn: 'Associated General Contractors · National Tile Contractors Association · Trades Unions',
    domain: 'tools',
    verdict: 'gift',
    status: 'gepackt',
    problemDe: 'Wer als Fliesenleger oder Handwerker auf unzureichenden Vorleistungen (Risse, Restfeuchte) arbeitet, ohne vorher schriftlich Bedenken nach VOB § 4 anzumelden, haftet mit tausenden Euro. Mit Arbeitshandschuhen schreibt niemand juristische Briefe.',
    problemEn: 'Subcontractors who proceed over cracked concrete or damp screed without formal written warnings under construction law are held liable for thousands of dollars. No one types legal briefs on a dusty building site in work gloves.',
    whyNowDe: [
      'Robuste Spracherkennung versteht Baustellenjargon trotz Baulärms.',
      'Multimodale Modelle erfassen Messwerte von Feuchtemessgeräten und Rissbreitenlinealen im Foto.',
      'DIN-Normen (DIN 18560, DIN 18202) werden automatisch korrekt zitiert.'
    ],
    whyNowEn: [
      'Noise-robust speech models parse colloquial site jargon through generator background hum.',
      'Multimodal models read numerical readings directly off digital moisture meters and crack calipers.',
      'Building codes and statutory warranty exemption paragraphs are quoted with legal precision.'
    ],
    sketchDe: 'Handwerker spricht: "Hier Estrich 3,2% Feuchte, Riss an Türschwelle". Foto schießen. App erzeugt unterschriftsbereites PDF mit DIN 18560 Zitat und schickt es per WhatsApp an Architekt und Bauherr.',
    sketchEn: 'Artisan speaks: "Concrete screed 3.2% moisture, unreinforced crack at doorway". Snap photo. App generates signed PDF citing DIN 18560 and sends via messaging to architect.',
    firstStepDe: {
      ticket: 'P0: Audio-Transkription für Baustellen-Vokabular mit PDF-Generierung nach VOB/B § 4 Abs. 3.',
      criteria: 'Generiert aus 3 Beispielsätzen ein formell gültiges Bedenkenanmeldungs-Schreiben mit Baustellen-Metadaten.'
    },
    firstStepEn: {
      ticket: 'P0: Field audio transcription coupled to statutory defect reservation notice generator.',
      criteria: 'Transforms 3 sample spoken statements into a legally binding defect objection PDF.'
    },
    failureModeDe: 'Mangelhafte Baustellen-Adresse: App muss GPS nutzen, um das Bauvorhaben automatisch mit Straße und Hausnummer zu versehen.',
    failureModeEn: 'Missing jobsite street address: App must utilize reverse geocoding to attach accurate building parcel metadata.',
    priorArtDe: 'Muster für die Bedenkenanmeldung nach § 4 Abs. 3 VOB/B gibt es überall (ZVSHK-Formularmuster, PlanRadar, BauMaster, WEKA-Checkliste, cendas). BauAnalyst (Blogbeitrag vom 29.03.2026) erzeugt Bedenkenanmeldungen automatisch — aus dem Leistungsverzeichnis, nicht von der Baustelle. KI-Bautagebücher mit Spracheingabe gibt es ebenfalls (HVNH AI, baustellen-kiassistent.de, Hero). Nicht gefunden: Sprachmemo plus Foto am Ort zur fertigen Bedenkenanmeldung für den Ein-Mann-Betrieb. Nicht versprechen: „rechtssicher" — ob ein Schreiben trägt, entscheidet der Einzelfall.',
    priorArtEn: 'Templates for the statutory notice of concerns under German construction contract rules are everywhere (ZVSHK, PlanRadar, BauMaster, WEKA, cendas). BauAnalyst (blog post of 29.03.2026) generates such notices automatically — from the bill of quantities, not from the site. AI site diaries with voice input exist too (HVNH AI, baustellen-kiassistent.de, Hero). Not found: voice memo plus photo on site turned into a finished notice for a one-person business. Do not promise legal certainty — whether a letter holds depends on the case.',
    tags: ['Echte Arbeit', 'Handwerk', 'Baustelle', 'Rechtsschutz', 'Fliesenleger', 'AI-Native'],
    emailTemplate: {
      subjectDe: 'BedenkenBlitz: Kostenloses Schutzschild für Handwerker auf der Baustelle (CC0)',
      bodyDe: 'Liebe Kolleginnen und Kollegen im Handwerk,\n\nwir schenken dem Baugewerbe ein quelloffenes Werkzeug, mit dem Handwerker in 20 Sekunden per Sprachaufnahme eine wasserdichte Bedenkenanmeldung nach VOB/B erstellen können. Es schützt kleine Betriebe vor ruinösen Schadensersatzforderungen.\n\nMit handwerklichem Gruß,\nAmélie Initiative',
      subjectEn: 'Subcontractor Liability Shield: Open Tool for Field Tradespeople (CC0)',
      bodyEn: 'Dear Trades Association Colleagues,\n\nWe are sharing an open-source field utility that allows solo tradespeople to generate enforceable liability warning notices in 20 seconds using voice and photos on site. Unconditional gift (CC0).\n\nBest regards,\nAmélie Initiative',
      to: 'info@zdb.de'
    },
    aiFrontier: {
      impossibleBeforeAiDe: 'Kombination aus verrauschter Sprachaufnahme, Handwerker-Fachbegriffen ("Estrich schüsselt") und juristischer DIN-Norm-Zuordnung war ohne Anwalt unmöglich.',
      impossibleBeforeAiEn: 'Synthesizing reverberant speech with specialized trade jargon into legally binding engineering code references was impossible without a construction attorney.',
      aiTechStack: ['Whisper Small On-Device Engine', 'DIN 18560 / VOB Knowledge Graph', 'Client-Side PDFKit', 'Geolocation Reverse Lookup'],
      privacyModelDe: 'Reine Browser-Anwendung ohne zentrale Speicherung von Baustellendaten oder Kundennamen.',
      privacyModelEn: 'Pure client-side web utility; zero jobsite photos or client identities are retained on any server.',
      ordinaryPeopleBenefitDe: 'Schützt selbstständige Handwerker und Gesellen vor existenzvernichtenden 15.000 € Haftungsklagen.',
      ordinaryPeopleBenefitEn: 'Protects independent working tradespeople from ruinous $15,000 contractor defect counterclaims.',
      learningCurriculumDe: [
        { step: 1, title: 'Woche 1: Baustellen-Spracheingabe & Rauschfilter', focus: 'Audio-Aufnahme mit automatischer Normalisierung gegen Hintergrundlärm von Sägen und Rührwerken', milestone: 'Verlässliche Transkription gesprochener Mängelbeschreibungen' },
        { step: 2, title: 'Woche 2: Messwerte- & Riss-Foto-Analyse', focus: 'Optisches Auslesen von CM-Messgeräten, Hygrometern und Risslinealen', milestone: 'Exakter numerischer Messwert im Protokoll hinterlegt' },
        { step: 3, title: 'Woche 3: VOB/B & DIN-Norm-Regelwerk', focus: 'Verknüpfung von Mängelbildern mit DIN 18560 (Estrich) und DIN 18202 (Toleranzen)', milestone: 'Automatische juristische Begründung mit Fristsetzung zur Nachbesserung' },
        { step: 4, title: 'Woche 4: 1-Klick WhatsApp- & PDF-Versand', focus: 'Generierung des fälschungssicheren PDF mit digitalem Unterschriftsfeld und Geotag', milestone: 'Rechtswirksamer Versand an Bauleitung vor Beginn der Verlegearbeiten' }
      ],
      learningCurriculumEn: [
        { step: 1, title: 'Week 1: Jobsite Acoustic Voice Input', focus: 'Capturing speech with ambient noise cancellation against power saws and concrete mixers', milestone: 'Accurate transcript of spoken substrate defects' },
        { step: 2, title: 'Week 2: Visual Gauge & Caliper Extraction', focus: 'Reading numerical values from digital moisture meters and crack gauges', milestone: 'Objective numerical evidence embedded in report' },
        { step: 3, title: 'Week 3: Statutory Building Code Mapping', focus: 'Matching defect classes to DIN 18560 (screeds) and DIN 18202 (tolerances)', milestone: 'Enforceable legal rationale with remediation deadline' },
        { step: 4, title: 'Week 4: Instant PDF & Message Dispatch', focus: 'Client-side PDF generation with digital signature field and verified GPS timestamp', milestone: 'Legally binding notice dispatched to general contractor before work begins' }
      ]
    }
  },
  {
    id: 'dose-cleaner-chemical-safety',
    title: 'ChemGefahr-Stopp / MischStop (ChemHazard Stop)',
    titleEn: 'ChemHazard Stop / MischStop',
    image: 'chemhazard-stop.jpg',
    imageAlt: 'Point-of-Action-Kamerawarnung bei zwei Putzmittelflaschen: Smartphone erkennt sauren WC-Reiniger und Chlor-Bleichmittel, schlägt stummen Alarm mit optischem Farb-Stroboskop, Chlorgas-Toxizitätsanzeige und Notfall-Warnung.',
    imageAspect: 0.707,
    videoUrl: 'https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link',
    videoTitle: 'Point-of-Action Video-Demonstration (ChemHazard Stop)',
    oneLinerDe: 'Kamera auf zwei Putzmittelflaschen richten: Warnt laut in der Sprache der Reinigungskraft vor gefährlichen Gasen und Verätzungen — offline, in unter 1 Sekunde; sagt wenn es etwas nicht prüfen kann, aber niemals „sicher“.',
    oneLinerEn: 'Point a phone camera at two cleaning chemical bottles: Warns audibly in the cleaner\'s language if the combination is dangerous — 100% offline, in under a second; admits when it cannot verify, but never says "safe."',
    date: '27.09.2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'BIV (Bundesinnungsverband des Gebäudereiniger-Handwerks) · EU-OSHA · IG BAU · BG BAU · DGUV · ver.di',
    recipientsEn: 'BIV (Federal Association of Contract Cleaners) · EU-OSHA · Service Employees International Union (SEIU) · EFCI · IG BAU · BG BAU',
    domain: 'civic',
    verdict: 'gift',
    status: 'zugestellt',
    problemDe: 'Reinigungskräfte im gewerblichen Bereich arbeiten unter extremem Zeitdruck und häufig über Sprachbarrieren hinweg. Das versehentliche Mischen von sauren Entkalkern mit Hypochlorit-Bleiche setzt tödliches Chlorgas frei. Mischverbote sind Lehrbuchwissen, aber Warnungen verstauben in 15-seitigen Sicherheitsdatenblättern im Büroordner. Bestehende Systeme (WINGIS, GESTIS, DGUV 101-019) sind reine Schreibtisch-Lookups — kein Werkzeug steht im Moment des Mischens an der Putzkammer.',
    problemEn: 'Commercial cleaners work under extreme speed pressure and frequent language barriers. Accidental mixing of acidic descalers with hypochlorite bleach releases deadly chlorine gas into confined restrooms. Mixing bans are textbook knowledge, but safety warnings remain locked in 15-page Safety Data Sheets. Existing systems (WINGIS, GESTIS, DGUV 101-019) are desktop lookup tools — none stands between a worker and two bottles at the moment of mixing.',
    whyNowDe: [
      '100% Offline-Edge-Inferenz: Schnelle Barcode- (GTIN/GS1), GISCODE- und Etiketten-Erkennung auf Standard-Smartphones ohne Server-Latenz.',
      'Mehrsprachige Audio-Sofort-Warnung in über 20 Sprachen (Ukrainisch, Polnisch, Türkisch, Arabisch etc.) überwindet Sprachbarrieren ohne Textlese-Zwang.',
      'Drei-Spuren-Datenmodell trennt gemeinfreies EU-CLP-Recht (EUH031) von optional lizenzierten WINGIS/GISCODE-Daten und offenen SDS.'
    ],
    whyNowEn: [
      '100% Offline edge inference: Real-time GTIN/GS1 barcode, GISCODE, and container scanning on commodity smartphones with zero cloud latency.',
      'Instant polyglot spoken audio alerts across 20+ languages remove the burden of reading technical German safety manuals.',
      'Three-lane data architecture separates public-domain EU CLP statements (EUH031) from optional licensed WINGIS/GISCODE data and open SDS.'
    ],
    sketchDe: 'Kamera scannt zwei Flaschen (Barcode, GISCODE oder OCR). Lokale Matrix berechnet: combined = hazards(A) | hazards(B). Bei Treffer (z.B. Säure + Hypochlorit) feuern 4 Kanäle: Roter Bildschirm, schriller Alarm, laute Muttersprachen-Stimme, repetitive Vibration. Bei Unbekannt: Bernsteinfarbenes UNVERIFIED. Bei neutraler Paarung: Grauer Info-Screen (niemals grün!) mit Pflicht-Hinweis: „Keine bekannte Gefahr in der DB — keine Sicherheitsfreigabe! Nur mischen, wenn vom Arbeitgeber angewiesen.“',
    sketchEn: 'Camera scans two bottles (barcode, GISCODE, or label). Local rule engine calculates combined hazard set. On danger trigger, 4 channels fire simultaneously: Flashing red screen, loud multilingual voice alert, shrill alarm tone, repeating haptics. On unknown: Amber UNVERIFIED. On neutral pair: Grey screen (never green!) with disclaimer: "No known dangerous combination in DB — not a safety clearance. Do not mix unless instructed by employer."',
    firstStepDe: {
      ticket: 'P0: Standalone Offline-Regel-Kernel & Zwei-Barcode/GISCODE-Prüfinterlock mit 4-Kanal-Alarm.',
      criteria: 'Deterministische STOP-Erkennung für Säure + Hypochlorit in <50ms auf 20 Testpaaren; unbekannte Produkte strikt UNVERIFIED; kein Testfall gibt jemals Grün oder „sicher“ aus; Audio-Alarm & haptisches Signal verifiziert.'
    },
    firstStepEn: {
      ticket: 'P0: Standalone offline rule engine and dual-input interlock with 4-channel alert.',
      criteria: 'Deterministic STOP detection for acid + hypochlorite in <50ms across 20 test pairs; unknown products strictly UNVERIFIED; zero green/safe states emitted; multi-lingual audio alarm and haptic patterns verified.'
    },
    failureModeDe: 'Stummgeschaltetes Telefon oder laute Umgebung (Staubsauger, Gummihandschuhe auf Lautsprecher): App erzwingt Alarm-Audiostream (bypasst Stummschaltung), gekoppelt mit grellem Vollbild-Flackern, hochfrequentem Vibrationsmuster und extragroßer visueller STOPP-Typografie.',
    failureModeEn: 'Muted handset or loud environment (vacuum cleaners, heavy gloves covering speaker): App forces system alarm audio stream (bypassing silent mode), paired with full-screen strobe flashing, continuous high-frequency vibration, and oversized STOP typography.',
    priorArtDe: 'BG BAU betreibt WINGIS und DGUV 101-019 (reine Suchdatenbanken für den PC). Barcode-Apps wie Yuka oder CodeCheck prüfen Kosmetik-Inhaltsstoffe, besitzen aber keine binäre Reaktions-Matrix für 2-Komponenten-Gefahren. Ein offener, kamerabasierter Zwei-Flaschen-Mischinterlock existiert am deutschen Markt nicht.',
    priorArtEn: 'BG BAU operates WINGIS and DGUV 101-019 (desktop lookup databases). Consumer barcode apps (Yuka, CodeCheck) scan single products for allergens/cosmetics, lacking two-component chemical reaction matrices. No open-source dual-bottle camera mixing interlock exists.',
    tags: ['Echte Arbeit', 'Reinigung', 'Arbeitsschutz', 'Sicherheit', 'Mehrsprachig', 'AI-Native'],
    emailTemplates: [
      {
        recipientName: 'BIV — Bundesinnungsverband des Gebäudereiniger-Handwerks',
        to: 'biv@die-gebaeudedienstleister.de',
        subjectDe: 'Arbeitsschutz & Haftungsschutz für Betriebe: Quelloffener Chemikalien-Mischschutz (Geschenk an den BIV)',
        bodyDe: `Sehr geehrte Frau Sudhop,
sehr geehrte Damen und Herren der Geschäftsführung des BIV,

als Spitzenverband von über 2.500 Dienstleistern mit 700.000 Beschäftigten kennen Sie das tägliche Spannungsfeld Ihrer Mitgliedsbetriebe:
Unternehmer tragen die volle gesetzliche Fürsorge- und Haftungspflicht für den Arbeitsschutz nach GefStoffV und DGUV Regel 101-019. Gleichzeitig arbeiten Reinigungskräfte in den Objekten unter erheblichem Zeitdruck und über massive Sprachgrenzen hinweg. Das versehentliche Mischen von sauren Entkalkern mit hypochlorithaltiger Bleiche (Chlorgas-Bildung) ist der gefürchtetste Unfallklassiker — Betriebsausfälle, Rettungseinsätze und behördliche Ermittlungen sind die Folge.

Weder 15-seitige Sicherheitsdatenblätter noch deutsche Ordner im Putzraum schützen im Moment des Mischens. Wir haben deshalb ein schlüsselfertiges, 100% offline lauffähiges Point-of-Action-Assistenzwerkzeug entwickelt und schenken es der Branche bedingungslos (CC0 Public Domain):

ChemGefahr-Stopp (MischStop / ChemHazard Stop):
1. Point-of-Action Scan in unter 1 Sekunde: Die Reinigungskraft richtet das Smartphone an Ort und Stelle auf die zwei Gebinde (Barcode, GISCODE oder Gebinde-Etikett). Ein deterministischer Regel-Kernel prüft lokal und völlig ohne Internetverbindung (<1 ms), ob eine gefährliche chemische Reaktion droht.
2. Sprachunabhängiger Mehrkanal-Sofort-Alarm: Droht Gefahr, ertönt ein lauter Alarmruf in der jeweiligen Muttersprache der Arbeitskraft (Ukrainisch, Polnisch, Türkisch, Arabisch, Rumänisch, Bulgarisch etc.).
3. Zuverlässig auch ohne Ton / bei lauten Maschinen: Selbst wenn das Smartphone stummgeschaltet ist oder laute Sauger laufen, sendet das Display ein grelles 15-Hz-Farb-Stroboskop (Rot/Weiß) und vibriert mit unverwechselbarem Notfall-Takt (300-100-300-100-500 ms) — unübersehbar selbst durch dicke Nitrilhandschuhe.
4. Absoluter Haftungs- und Sicherheitsnachweis (Safety Case): Das System attestiert NIEMALS eine trügerische „Grün/Sicher“-Freigabe, sondern warnt ausschließlich vor erkannter Gefahr (STOP) oder deklariert fehlende Daten transparent als UNVERIFIED. Es ersetzt keine Unterweisung, schützt Betriebe aber vor fatalen Mischunfällen.

Das Projekt ist vollständig lauffähig, dokumentiert und frei von Rechten Dritter:
• Interaktiver Web-Simulator & Live-Demo: https://felixinberlin.github.io/Amelie/#dose=dose-cleaner-chemical-safety
• Video-Demonstration (Praxistest am Putzwagen): https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link
• Quellcode, Testsuite & Architektur: https://github.com/felixinberlin/Amelie/tree/main/07-demos/chemhazard-stop

„Diese Idee gehört niemandem. Nimm sie, bau sie, gib sie an eure Mitgliedsbetriebe weiter — Sie schulden mir nichts, nicht einmal eine Antwort. Wenn Sie eines Tages eine Idee haben, die Sie nicht selbst umsetzen, geben Sie sie jemandem weiter, der es tut.“

Mit freundlichen Grüßen für sichere und unfallfreie Betriebe,
Amélie Initiative (Félix, Berlin)`,
        subjectEn: 'Occupational Safety & Liability Shield for Cleaning Contractors: ChemHazard Stop (Open Gift to BIV)',
        bodyEn: `Dear Ms. Sudhop,
Dear Members of the Executive Board at BIV,

Representing over 2,500 service enterprises employing 700,000 workers across Germany, you understand the daily operational challenges of cleaning contractors:
Employers bear strict legal duty of care and statutory liability for occupational safety (GefStoffV, DGUV Rule 101-019). Yet on the front lines, cleaning personnel work under extreme time constraints and across significant language barriers. Accidental mixing of acidic descalers with hypochlorite bleaches (releasing toxic chlorine gas) remains a persistent operational danger — causing severe respiratory injuries, emergency facility evacuations, and liability investigations.

Neither 15-page Safety Data Sheets nor static binder folders in custodial closets protect workers at the point of action. We have built an open-source, turnkey, 100% offline point-of-action safety assistant and are gifting it unconditionally to the industry (CC0 Public Domain):

ChemHazard Stop (MischStop):
1. Sub-Second Point-of-Action Verification: Cleaners aim their smartphone camera at two chemical containers (GTIN barcode, GISCODE, or label OCR). A deterministic local rule engine evaluates dangerous reaction risks on-device in <1 millisecond with zero cloud dependency.
2. Polyglot Audio Alerts: In hazardous pairings, loud spoken emergency instructions play immediately in the cleaner's native language (Ukrainian, Polish, Turkish, Arabic, Romanian, Bulgarian, etc.).
3. Sensory Redundancy for Noisy Facilities: If the handset is muted or drowned out by heavy vacuum equipment, the phone pulses with an unmistakable emergency tactile cadence (300-100-300-100-500 ms) and flashes a high-intensity 15 Hz optical color strobe (red/white) visible through nitrile gloves.
4. Formal Safety Case (Never Emits "Safe"): The system strictly avoids false reassurance. It never displays a green "safe" clearance. It either halts the worker on verified danger (STOP) or transparently flags incomplete data as UNVERIFIED.

Everything is turnkey, verified, and free of third-party IP restrictions:
• Interactive Web Simulator & Live Demo: https://felixinberlin.github.io/Amelie/#dose=dose-cleaner-chemical-safety
• Video Demonstration (Custodial Field Test): https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link
• Source Code, Test Suite & Specs: https://github.com/felixinberlin/Amelie/tree/main/07-demos/chemhazard-stop

"This idea belongs to no one. Take it, build it, deploy it across your member enterprises — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will."

With warm regards for safe and incident-free cleaning operations,
Amélie Initiative (Félix, Berlin)`
      },
      {
        recipientName: 'EU-OSHA — European Agency for Safety and Health at Work',
        to: 'information@osha.europa.eu',
        cc: 'eu-osha@baua.bund.de',
        subjectDe: 'Punktgenauer Schutz vor Chemikalien-Mischunfällen: ChemGefahr-Stopp (Offenes Geschenk an EU-OSHA)',
        bodyDe: `Sehr geehrtes Team der EU-OSHA Kampagne für gefährliche Stoffe,
sehr geehrte Kolleginnen und Kollegen am deutschen Focal Point (BAuA),

in ganz Europa arbeiten Millionen von gewerblichen Reinigungskräften — eine überwiegend verletzliche, mobile Arbeitsbevölkerung — täglich mit aggressiven chemischen Formulierungen.

Trotz jahrzehntelanger Regulierungsarbeit im Rahmen von REACH und CLP (Verordnung EG 1272/2008) kommt es immer wieder zu schweren Mischunfällen. Das versehentliche Zusammenschütten von sauren Entkalkern mit natriumhypochlorithaltiger Bleiche setzt in engen Sanitärräumen schlagartig tödliches Chlorgas (Cl2) frei. Die Ursache ist strukturell: 15-seitige Sicherheitsdatenblätter und technische Leitfäden bleiben nachts im Büroordner und überwinden keine Sprachbarrieren.

Um die Mission der EU-OSHA für sichere und gesunde Arbeitsplätze direkt an der Basis zu unterstützen, haben wir ein schlüsselfertiges, 100% offline lauffähiges Point-of-Action-Sicherheitswerkzeug entwickelt: ChemGefahr-Stopp (MischStop / ChemHazard Stop).

Wir verschenken das gesamte Projekt bedingungslos an die europäische Arbeitsschutz-Gemeinschaft (CC0 Public Domain):
1. Verifikation an der Putzkammer in unter 1 ms: Die Reinigungskraft richtet das Smartphone auf zwei Gebinde (GTIN-Barcode, GISCODE oder Etikett). Ein deterministischer lokaler Regel-Kernel prüft Gefahrenrisiken direkt auf dem Gerät ohne Cloud-Abhängigkeit.
2. Mehrsprachige Audio-Sofortwarnung: Bei Gefahr warnt eine laute Stimme in der jeweiligen Muttersprache der Arbeitskraft (Ukrainisch, Polnisch, Türkisch, Arabisch, Rumänisch, Bulgarisch, Spanisch, Deutsch, Englisch etc.).
3. Sensorische Redundanz für laute Umgebungen: Selbst bei Stummschaltung oder Maschinenlärm pulsiert das Gerät mit Notfall-Haptik (300-100-300-100-500 ms) und sendet ein grelles 15-Hz-Farb-Stroboskop (Rot/Weiß).
4. Formaler Sicherheitsnachweis (Kein Grün / Niemals "Sicher"): Das System schließt falsche Sicherheit kategorisch aus. Es warnt vor STOP oder meldet UNVERIFIED.

Das Projekt ist schlüsselfertig, getestet und unter CC0 veröffentlicht:
• Web-Simulator & Live-Demo: https://felixinberlin.github.io/Amelie/#dose=dose-cleaner-chemical-safety
• Video-Demonstration (Praxis-Feldtest): https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link
• Quellcode, Testsuite & Spezifikationen: https://github.com/felixinberlin/Amelie/tree/main/07-demos/chemhazard-stop

„Diese Idee gehört niemandem. Nimm sie, bau sie, setze sie in europäischen Betrieben ein — Sie schulden mir nichts, nicht einmal eine Antwort.“

Mit europäischen Grüßen für Sicherheit und Gesundheit bei der Arbeit,
Amélie Initiative (Félix, Berlin)`,
        subjectEn: 'Point-of-Action Chemical Safety for Migrant Cleaners: ChemHazard Stop (Open Gift to EU-OSHA)',
        bodyEn: `Dear Dangerous Substances Prevention Team at EU-OSHA,
Dear Colleagues at the German National Focal Point,

Across the European Union, millions of commercial cleaners — a predominantly vulnerable, migrant workforce working non-standard hours — handle hazardous chemical formulations daily. 

Despite decades of regulatory efforts under REACH, CLP (Regulation EC 1272/2008), and national safety rules, severe mixing incidents continue to occur in confined spaces. The accidental mixture of acidic descalers with sodium hypochlorite bleaches instantly releases lethal chlorine gas (Cl2). The root cause is structural: 15-page Safety Data Sheets and national technical guidance remain locked in supervisors' folders and are inaccessible across language barriers at 3:00 AM.

To directly support EU-OSHA's mission of safe and healthy workplaces, we have built and open-sourced a turnkey, 100% offline point-of-action safety tool: ChemHazard Stop (MischStop).

We are gifting this entire project unconditionally to the European occupational health community (CC0 Public Domain):

Key Capabilities of ChemHazard Stop:
1. Instant Point-of-Action Verification: Cleaners aim their smartphone camera at two cleaning product containers (GTIN barcode, GISCODE, or label OCR). A deterministic local rule engine evaluates dangerous reaction risks on-device in <1 millisecond without requiring internet or cellular connectivity.
2. Polyglot Audio Alerts: When an incompatible pair is detected, loud spoken emergency instructions immediately trigger in the cleaner's native language (Ukrainian, Polish, Turkish, Arabic, Romanian, Bulgarian, Spanish, German, English, etc.).
3. Sensory Redundancy for Noisy Facilities: If the phone is muted or drowned out by 85 dB machinery, the handset pulses with an unmistakable emergency tactile cadence (300-100-300-100-500 ms) and flashes a high-intensity 15 Hz color optical strobe (red/white) visible even through nitrile gloves.
4. Formal Safety Case (Never Emits "Safe"): The system strictly rejects false reassurance. It never displays a green "safe" clearance. It either halts the worker on verified danger (STOP) or transparently flags incomplete data as UNVERIFIED.

Compliance & European Data Architecture:
The core engine runs on public-domain EU CLP statements (specifically EUH031: "Contact with acids liberates toxic gas"). It operates with zero tracking, zero cloud data transfer, and complete offline sovereignty.

Everything is turnkey, tested, and published under CC0 / Public Domain:
• Interactive Web Simulator & Live Demo: https://felixinberlin.github.io/Amelie/#dose=dose-cleaner-chemical-safety
• Video Demonstration (Field Demonstration): https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link
• Source Code, Test Suite & Specs: https://github.com/felixinberlin/Amelie/tree/main/07-demos/chemhazard-stop

"This idea belongs to no one. Take it, build it, deploy it across European workplaces — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will."

In solidarity for occupational health and safety across Europe,
Amélie Initiative (Félix, Berlin)`
      },
      {
        recipientName: 'IG BAU & BG BAU — Gewerkschaft & Gesetzliche Unfallversicherung',
        to: 'kontakt@igbau.de',
        cc: 'info@bgbau.de',
        subjectDe: 'Lebensschutz für Reinigungskräfte: ChemGefahr-Stopp (Quelloffenes Geschenk an IG BAU & BG BAU)',
        bodyDe: `Liebe Kolleginnen und Kollegen der IG BAU Gebäudereinigung (z. Hd. Ulrike Laux),
sehr geehrtes Team Gefahrstoffe und GISBAU/WINGIS der BG BAU,

wir wenden uns heute gemeinsam an Sie beide, weil der Schutz von Reinigungskräften vor gefährlichen Chemikalien nur im direkten Zusammenspiel von gelebter Arbeitsrealität (Gewerkschaft) und fundierter Prävention (Berufsgenossenschaft) gelingt:

Wir haben ein offenes, 100% offline lauffähiges Point-of-Action-Sicherheitswerkzeug entwickelt: ChemGefahr-Stopp (MischStop / ChemHazard Stop).

Das Problem an der Putzkammer:
Reinigungskräfte arbeiten unter extremem Zeitdruck, oft nachts und häufig über Sprachbarrieren hinweg. Das versehentliche Zusammenschütten von sauren Sanitär-Entkalkern (z. B. Amidosulfonsäure, Phosphorsäure) mit hypochlorithaltiger Chlorbleiche setzt in engen, fensterlosen Waschräumen schlagartig tödliches Chlorgas frei.
Die Mischverbote sind Lehrbuchwissen und in DGUV Regel 101-019 sowie WINGIS exzellent dokumentiert — aber im Moment des Mischens nützt ein 15-seitiges Sicherheitsdatenblatt im Büroordner nichts. Was bisher fehlte, ist ein Werkzeug, das physisch in der Sekunde des Mischens zwischen der Arbeitskraft und den zwei Flaschen steht.

Was das Werkzeug tut:
1. Sekundenschneller Scan (Point-of-Action): Kamera auf zwei Gebinde richten (Barcode, GISCODE oder Etikett). Ein deterministischer Regel-Kernel prüft in unter 1 Millisekunde auf dem Gerät, ob eine gefährliche chemische Reaktion droht — komplett ohne Internetverbindung.
2. Mehrsprachiger Sofort-Alarm: Bei Gefahr warnt eine laute Stimme in der jeweiligen Muttersprache der Reinigungskraft (Ukrainisch, Polnisch, Türkisch, Arabisch, Rumänisch, Bulgarisch, Deutsch, Englisch etc.).
3. Notfall-Alarm auch ohne Ton: Selbst wenn das Smartphone stummgeschaltet ist oder laute Industriestaubsauger (85 dB) dröhnen, vibriert das Telefon mit einem unverwechselbaren Notfall-Impuls (300-100-300-100-500 ms) und das Display sendet ein grelles optisches 15-Hz-Farb-Stroboskop (Rot/Weiß), sodass die Gefahr selbst aus dem Augenwinkel und durch Nitrilhandschuhe sofort wahrgenommen wird.
4. Unbestechlicher Sicherheitsnachweis (Safety Case): Das System attestiert niemals eine trügerische „Grün/Sicher“-Entwarnung, sondern warnt ausschließlich vor bekannter Gefahr (STOP) oder deklariert fehlende Daten transparent als UNVERIFIED.

Respektierung von Standards & Datenhoheit (Drei-Spuren-Architektur):
Wir betreiben kein unzulässiges Scraping von WINGIS oder GESTIS. Der Regel-Kernel basiert primär auf gemeinfreiem EU-CLP-Recht (insb. EUH031). Die Architektur ist exakt so ausgelegt, dass offizielle WINGIS-GISCODE-Datenbanken der BG BAU als lizenzierte Spur nahtlos andocken können, wenn die BG BAU dies freigeben oder selbst hosten möchte.

Das gesamte Projekt ist schlüsselfertig, lauffähig und bedingungslos gemeinfrei (CC0):
• Interaktiver Web-Simulator & Live-Demo: https://felixinberlin.github.io/Amelie/#dose=dose-cleaner-chemical-safety
• Video-Demonstration (Point-of-Action Praxistest): https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link
• Quellcode, Testsuite & Scaffolding: https://github.com/felixinberlin/Amelie/tree/main/07-demos/chemhazard-stop

„Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.“

Mit kollegialem Gruß für sichere Arbeit und gesunde Beschäftigte,
Amélie Initiative (Félix, Berlin)`,
        subjectEn: 'Life Protection for Cleaners: ChemHazard Stop (Open Safety Gift to IG BAU & BG BAU)',
        bodyEn: `Dear Colleagues at IG BAU Building Cleaning Union (Attn: Ulrike Laux),
Dear Hazardous Substances & GISBAU/WINGIS Prevention Team at BG BAU,

We are reaching out to both of you simultaneously because frontline chemical safety requires the joint strength of workforce advocacy (union) and institutional prevention (statutory accident insurance):

We have developed a turnkey, 100% offline point-of-action safety interlock: ChemHazard Stop / MischStop.

The Workplace Reality:
Commercial cleaners work under extreme speed pressure, frequently at night and across severe language barriers. Accidentally mixing acidic descalers (e.g., sulfamic, phosphoric, or hydrochloric acid) with sodium hypochlorite bleach immediately releases lethal chlorine gas (Cl2) into confined, poorly ventilated restrooms.
Mixing prohibitions are textbook knowledge and thoroughly codified in DGUV Rule 101-019 and WINGIS — yet in the crucial second of mixing, a 15-page Safety Data Sheet filed away in a supervisor's binder provides zero protection. What was missing is a tool standing physically between the worker and two bottles at the custodial cart.

What the Tool Does:
1. Sub-Second Point-of-Action Scan: Point smartphone camera at two containers (barcode, GISCODE, or label OCR). A deterministic local rule engine evaluates reaction risks in <1 ms on-device with zero internet dependency.
2. Polyglot Audio Alerts: In hazardous pairings, loud spoken emergency instructions play in the cleaner's native language (Ukrainian, Polish, Turkish, Arabic, Romanian, Bulgarian, German, English, etc.).
3. Fail-Safe Without Sound: Even if the phone is silenced/muted or drowned out by 85 dB vacuum cleaners, the handset physically pulses with an unmistakable emergency cadence (300-100-300-100-500 ms) while the screen flashes a glaring 15 Hz optical color strobe (red/white) to alert workers even through heavy nitrile gloves.
4. Formal Safety Invariant: The system never emits a dangerous green "safe" clearance. It strictly triggers STOP on danger, or defaults to UNVERIFIED on incomplete data.

Respecting Authority Data & Architecture:
We perform zero unauthorized scraping of WINGIS or GESTIS. The engine triggers deterministically on public-domain EU CLP statements (especially EUH031). The architecture separates public data from licensed GISCODE datasets, ready to connect directly with official BG BAU WINGIS catalogs should BG BAU choose to adopt or host it.

The complete project is turnkey, tested, and released unconditionally into the public domain (CC0):
• Interactive Web Simulator & Live Demo: https://felixinberlin.github.io/Amelie/#dose=dose-cleaner-chemical-safety
• Video Demonstration (Point-of-Action Field Test): https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link
• Source Code, Test Suite & Scaffolding: https://github.com/felixinberlin/Amelie/tree/main/07-demos/chemhazard-stop

"This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will."

In solidarity for worker health and safety,
Amélie Initiative (Félix, Berlin)`
      }
    ],
    aiFrontier: {
      impossibleBeforeAiDe: 'Klassische Barcode-Scanner scheiterten an beschädigten, nassen Industrie-Gebinden ohne Barcode oder an verstaubten Etiketten. Schnelle On-Device-Vision und offline Polyglot-Audio machen Schutz in Sekundenbruchteilen möglich.',
      impossibleBeforeAiEn: 'Traditional barcode scanners failed on worn, wet industrial barrels without barcodes or damaged labels. Fast on-device vision and offline polyglot audio deliver sub-second protection directly at the custodial cart.',
      aiTechStack: ['On-Device Barcode/OCR Scanner', 'Deterministic Set-Logic Hazard Matrix', 'Polyglot Offline Audio Alert Bank', 'Signed Offline JSON Package'],
      privacyModelDe: '100% On-Device: Keinerlei Bildübertragung oder Telemetrie. Funktioniert vollständig ohne Internetverbindung in fensterlosen Kellern.',
      privacyModelEn: '100% On-Device: Zero image transmission or telemetry. Operates entirely offline in shielded basement custodial closets.',
      ordinaryPeopleBenefitDe: 'Schützt Reinigungskräfte, die oft ohne ausreichende Schulung und unter extremem Zeitdruck arbeiten, vor Vergiftung durch Chlorgas und Verätzungen.',
      ordinaryPeopleBenefitEn: 'Protects frontline custodial workers working under intense time pressure and language barriers from fatal chlorine gas exposure and chemical burns.',
      learningCurriculumDe: [
        { step: 1, title: 'Woche 1: Deterministischer Regel-Kernel', focus: 'Mengenbasierte Inkompatibilitäts-Matrix (Säure + Hypochlorit, Säure + Ammoniak) mit strengem Dreizustands-Modell (STOP, UNVERIFIED, NO_KNOWN_INCOMPATIBILITY)', milestone: 'Sub-50ms Auswertung von Produktpaaren mit 100% False-Negative-Regressionstest' },
        { step: 2, title: 'Woche 2: Barcode-, GISCODE- & Etiketten-Parser', focus: 'Offline-Erkennung von GTIN/EAN, GISCODEs und GHS-Piktogrammen/EUH031 auf Smartphone-Kamera', milestone: 'Robuste Identifikation gängiger Reinigungsmittel in unter 500ms' },
        { step: 3, title: 'Woche 3: 4-Kanal-Alarmsystem & Mehrsprachigkeit', focus: 'Simultaner Alarm (OS-Alarm-Stream, Bildschirm-Blitz, Haptik-Impulse, Sprachausgabe in 20+ Sprachen)', milestone: 'Zuverlässige Warnung auch bei stummem Telefon und lauter Umgebung' },
        { step: 4, title: 'Woche 4: Signierte Offline-Datenpakete & PWA/Android-Build', focus: 'Kryptografische Signaturprüfung von Offline-JSON-Updates und Feldtest-Packaging', milestone: 'Lauffähiges Scaffolding mit CI-Prüfsuite bereit für BG BAU / Gewerkschafts-Pilot' }
      ],
      learningCurriculumEn: [
        { step: 1, title: 'Week 1: Deterministic Rule Kernel', focus: 'Set-based incompatibility matrix (acid + hypochlorite, acid + ammonia) with strict 3-state logic (STOP, UNVERIFIED, NO_KNOWN_INCOMPATIBILITY)', milestone: 'Sub-50ms pair evaluation with 100% false-negative regression test suite' },
        { step: 2, title: 'Week 2: Barcode, GISCODE & Label Scanner', focus: 'Offline parsing of GTIN/EAN, GISCODEs, and GHS hazard statements (EUH031) on device', milestone: 'Robust identification of standard commercial cleaning agents in <500ms' },
        { step: 3, title: 'Week 3: 4-Channel Alert & Polyglot Voice Engine', focus: 'Simultaneous alarm stream, screen strobe, haptic pulses, and spoken warning in 20+ languages', milestone: 'Fail-safe alerting regardless of handset silent mode or ambient noise' },
        { step: 4, title: 'Week 4: Signed Offline Data Packages & Android/PWA Build', focus: 'Cryptographic signature verification for offline data updates and pilot-ready packaging', milestone: 'Tested, turnkey open-source repository ready for BG BAU / union field pilots' }
      ]
    }
  },
  {
    id: 'fugenduell-asphalt-arena',
    title: 'Fugenduell: Asphaltritzen-Arena',
    titleEn: 'Crack Duel: Asphalt Crack Arena',
    image: 'fugenduel.jpg',
    imageAlt: 'Querformat-Sammelkarte „Asplenium ruta-muraria — Frankfurt Hauptbahnhof": zwei Fotos einer Mauerraute in einer Bahnsteig-Mauerfuge, daneben Werteleisten, Fähigkeiten, Stammbaum und der Signature Move Austrocknungsstarre.',
    imageAspect: 1.833,
    oneLinerDe: 'Asynchrones rundenbasiertes Ökologie-Taktikspiel für urbane Gehwegritzen — 14 reale Pionierarten, Grimes CSR-Dreieck, Pacht-Chronisten-Modell und transparenter 6-Runden-Saisonkampf.',
    oneLinerEn: 'An asynchronous turn-based botanical tactical battle game set in sidewalk cracks — 14 real-world pioneer species, Grimes CSR triangle, civic stewardship custody, and transparent 6-round seasonal combat.',
    date: 'September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'Indie Game Developers · Botanischer Garten Berlin · Humboldt-Universität zu Berlin (Institut für Biologie) · Stiftung Naturschutz Berlin',
    recipientsEn: 'Indie Game Developers · Botanical Garden Berlin · Humboldt University Biology Dept · Nature Conservation Foundation Berlin',
    domain: 'creative',
    verdict: 'build_first',
    status: 'gepackt',
    tags: ['Gaming', 'Urbane Ökologie', 'CSR-Theorie', 'Gamification', 'Turn-Based', 'Botanik', 'Berlin'],
    problemDe: 'Klimawandel- und Ökologiespiele sind meist belehrend, langweilig oder basieren auf weltfremden Fantasiewerten. Echtes botanisches Wissen (z. B. 10 bar Wurzeldruck von Löwenzahn, Salzdrüsen des Löffelkrauts, poikilohydrische Moos-Kryptobiose) bietet fantastisches kompetitives Spielpotenzial, das bisher ungenutzt bleibt.',
    problemEn: 'Ecological games are frequently didactic, patronizing, or detached from real biology. Real botanical adaptations (such as 10-bar dandelion taproot turgor pressure, scurvygrass salt glands, or silver moss poikilohydric cryptobiosis) offer deep competitive tactical gameplay that remains entirely untapped.',
    whyNowDe: [
      'Empirische botanische Merkmalsdatenbanken (UNDERPLOT, SID Kew, Cole & Bayfield) ermöglichen ein exakt ausbalanciertes 36-Punkte-Stat-Budget.',
      'Rundenbasierte Taktik- und Kartenspiele (Balatro, Slay the Spire, Pokémon TCG) boomen bei jungen Spielern, die nach Tiefgang und Systemmechaniken suchen.',
      'Das „Pacht- und Chronisten-Modell" (Stewardship statt Besitz) löst das ethische Problem von Natur-Mining-Spielen: Die reale Pflanze bleibt unverkäuflich an ihrer Stelle, nur ihr Samen-Profil duelliert sich.',
      'Web-basierte Canvas- und State-Machine-Engines laufen verzögerungsfrei auf jedem Smartphone-Browser ohne App-Store-Reibung.'
    ],
    whyNowEn: [
      'Empirical botanical databases (UNDERPLOT, SID Kew, Cole & Bayfield) allow for a calibrated 36-point stat budget.',
      'Turn-based tactical games (Balatro, Slay the Spire, Pokémon TCG) have surging popularity among players seeking systemic depth.',
      'The "Stewardship Custody" model solves nature-mining ethical dilemmas: real plants are never owned or traded, only their abstracted seed profiles duel.',
      'Modern web runtime state machines deliver instant, zero-install async duel resolution across mobile browsers.'
    ],
    sketchDe: 'Asphaltritzen-Duellarena: Zwei Spieler oder ein Spieler gegen Kiez-Bot ringen auf einem 100%-Deckungsbalken um die Vorherrschaft in einer Straßenfuge. 6 Jahreszeiten-Events (Schneeschmelze, Kehrmaschine, Gluthitze, Herbststurm, Spurt, Streusalz) testen die 6 Kern-Stats (WURZEL, TRITT, DÜRRE, SAAT, TEMPO, CHEMIE). Signaturfähigkeiten (wie C4-Turbo oder Schleudersitz) wenden das Blatt.',
    sketchEn: 'Pavement crack duel arena: Two plants contest a 100% tug-of-war coverage bar inside an urban sidewalk fissure. 6 seasonal events (Snowmelt, Street Sweeper, Heatwave, Autumn Gale, Final Sprint, Road Salt) test the 6 fundamental ecological stats (ROOT, TRAMPLE, DROUGHT, SEED, SPEED, CHEMISTRY) alongside botanical signature abilities.',
    firstStepDe: {
      ticket: 'Interaktiver 6-Runden-Duellsimulator mit Deckungsbalken.',
      criteria: 'Spieler wählt aus dem 14-Arten-Kader (z. B. Löwenzahn vs. Breitwegerich), durchläuft 6 Jahreszeiten-Events mit sichtbarer Würfel-/Stat-Mathematik und sieht den animierten Deckungsbalken bis zum Sieg/Pacht-Gewinn.'
    },
    firstStepEn: {
      ticket: 'Interactive 6-round duel simulator with coverage tug-of-war.',
      criteria: 'Player selects from the 14-species roster (e.g. Dandelion vs. Plantain), resolves 6 seasonal crisis events with visible mathematical resolution, and tracks coverage shifts to victory.'
    },
    failureModeDe: 'Verwechslung mit Pay-to-Win Gacha: Wenn seltene invasive Arten (wie der Götterbaum) käuflich wären, kollabiert die biologische Integrität. Ailanthus altissima ist im Ranked-Modus permanent gebannt. Das Spiel belohnt ökologisches Verständnis, keine Mikrotransaktionen.',
    failureModeEn: 'Degradation into Pay-to-Win Gacha: Selling dominant alien invasives breaks ecological credibility. Ailanthus altissima is permanently banned from competitive play. The game must reward tactical ecological insight rather than microtransactions.',
    priorArtDe: 'Spiele über echte Pflanzenarten gibt es: Out and About (Yaldi Games, Steam 2026), Niche (Stray Fawn, echte Genetik als Kernmechanik), dazu Ökologie-Kartenspiele (Ecologies, Forest Shuffle, Earth, Reforest). Neu ist das Gebiet — urbane Ruderalflora in Gehwegfugen mit echten Merkmalen —, nicht das Genre. Die Kreuzung mit realen Standorten ist als eigene Dose geprüft (Das lebende Spielobjekt, frei). „Indie-Entwickler" ist kein Empfänger (Prüfprotokoll Runde 6): Die Adressen des Felds stehen im Programm seiner Konferenzen, etwa dem ECSA-Workshop „Games for good".',
    priorArtEn: 'Games about real plant species exist: Out and About (Yaldi Games, Steam 2026), Niche (Stray Fawn, real genetics as core mechanic), and ecology card games (Ecologies, Forest Shuffle, Earth, Reforest). What is new is the territory — urban ruderal flora in pavement cracks with real traits — not the genre. The crossing with real locations is its own checked Dose (The Living Game Piece, free). "Indie developers" is not a recipient (check log round 6): the field\'s addresses are in its conference programmes, e.g. the ECSA workshop "Games for good".',
    emailTemplate: {
      subjectDe: 'Ideen-Schenkung & Spieldesign: Fugenduell – Das urbane Asphaltritzen-Taktikspiel',
      bodyDe: 'Liebe Spiele-Entwickler, liebe Botanik-Begeisterte,\n\naus unserer Arbeit am Citizen-Science-Projekt „Crack Flora Watcher" ist eine spielmechanische Schwester-Idee entstanden, die wir hiermit bedingungslos als CC0-Gemeingut schenken: „Fugenduell" (Asphaltritzen-Arena).\n\nDas Konzept:\n- 14 real existierende Gehwegpioniere aus dem Berliner Asphalt mit empirischen Werten aus UNDERPLOT und LEDA.\n- Ein ausbalanciertes 36-Punkte-System auf den 6 Dimensionen WURZEL, TRITT, DÜRRE, SAAT, TEMPO und CHEMIE.\n- Das Pacht- und Chronisten-Prinzip: Spieler besitzen keine echten Pflanzen, sondern übernehmen die Pflegepatenschaft („Pacht") einer realen Ritze.\n- Ein transparenter 6-Runden-Jahreszeitenkampf mit sichtbarer Deckungsverlagerung.\n\nDas komplette Roster, die mathematische Kampfauflösung und der interaktive Prototyp stehen bereit zur freien Weiternutzung.\n\nHerzliche Grüße,\nFélix',
      subjectEn: 'Free Game Design Gift: Fugenduell – Sidewalk Crack Botanical Tactics',
      bodyEn: 'Dear Game Developers and Botany Enthusiasts,\n\nFrom our urban ecology research on crack flora, a sister tactical gaming concept was born, gifted under CC0 (Public Domain): "Fugenduell" (Sidewalk Crack Arena).\n\nCore Pillars:\n- 14 real pavement pioneer species calibrated via empirical databases (UNDERPLOT, LEDA, SID Kew).\n- Balanced 36-point budget across 6 ecological dimensions: ROOT, TRAMPLE, DROUGHT, SEED, SPEED, CHEMISTRY.\n- Stewardship custody instead of ownership: Players do not own wild nature; they become chroniclers and guardians.\n- Transparent 6-round seasonal tug-of-war combat.\n\nUse and adapt freely.\n\nWarm regards,\nFélix',
      to: 'kontakt@stiftung-naturschutz.de'
    },
    emailTemplates: [
      {
        recipientName: 'Stiftung Naturschutz Berlin / Bildungsprogramme',
        to: 'kontakt@stiftung-naturschutz.de',
        subjectDe: 'Ideen-Schenkung: Fugenduell – Spielerische Umweltbildung im Asphalt',
        bodyDe: 'Liebes Team der Stiftung Naturschutz Berlin,\n\num Jugendliche und Stadtmenschen für die verblüffende Überlebenskunst heimischer Wildpflanzen zu begeistern, schenken wir Ihnen das fertige Spieldesign-Konzept „Fugenduell". Es verwandelt jeden unscheinbaren Gehwegriss in ein strategisches Taktikfeld basierend auf echter CSR-Pflanzenökologie.\n\nFrei zur Nutzung im Rahmen von Schulprojekten, Apps oder Umwelt-Workshops (CC0 Public Domain).',
        subjectEn: 'Game Concept Gift: Fugenduell – Engaging Urban Botany Tactics',
        bodyEn: 'Dear Stiftung Naturschutz Berlin team,\n\nTo engage urban youth with wild urban flora, we gift you the complete tactical game design "Fugenduell". Transforms sidewalk cracks into ecological chessboards using real botanical adaptations. Completely CC0 Public Domain.'
      }
    ],
    aiFrontier: {
      impossibleBeforeAiDe: 'Dynamische Generierung von mikroklimatischen Duell-Ereignissen und kontextueller Kampf-Dramaturgie basierend auf echten historischen Wetterdaten und Straßen-Parametern.',
      impossibleBeforeAiEn: 'Dynamic generation of micro-climate battle events and responsive narrative drama grounded in localized historical weather feeds and pavement telemetry.',
      aiTechStack: ['Deterministic Combat Engine (TypeScript)', 'Local Botanical Trait Matrix', 'Canvas Tug-of-War Visualizer', 'Offline PWA State Machine'],
      privacyModelDe: '100% lokal im Browser spielbar; im Online-Modus anonyme Kiez-Kürzel ohne Speicherung privater GPS-Routen.',
      privacyModelEn: '100% client-side playable in browser; multiplayer mode uses anonymized district hashes without GPS tracking.',
      ordinaryPeopleBenefitDe: 'Verwandelt alltägliche Straßen und Gehwege in spannende ökologische Arenen und vermittelt spielerisch fundierte Pflanzenbiologie.',
      ordinaryPeopleBenefitEn: 'Transforms ordinary city streets into exciting ecological arenas, teaching genuine plant biology through deep tactical play.',
      learningCurriculumDe: [
        { step: 1, title: 'Woche 1: Die 14 Asphalthelden & CSR-Balancing', focus: 'Implementierung des 36-Punkte-Budgets und Validierung mit ökologischer Literatur', milestone: 'Mathematisch stabiler Kader ohne unbesiegbare Dominanz-Strategien' },
        { step: 2, title: 'Woche 2: Der 6-Runden-Jahreszeiten-Kampfmotor', focus: 'Bau der deterministischen Ereignis-Pipeline (Test → Taktik → Deckungsbalken)', milestone: 'Vollständig sichtbarer Kampflog mit nachvollziehbarer Rundenauflösung' },
        { step: 3, title: 'Woche 3: Signatur-Fähigkeiten & Pacht-System', focus: 'Interaktive Auslöser für Ballistochorie, C4-Turbo, Kryptobiose und Chronisten-Pacht', milestone: 'Samen-Markt-Protokoll und Stewardship-Zuweisung' },
        { step: 4, title: 'Woche 4: Mobile-Ready PWA & Community-Dossier', focus: 'Feinschliff der taktischen Oberfläche und Bereitstellung als freies Amélie-Geschenk', milestone: 'Spielbare Web-Arena in der Amélie-Galerie' }
      ],
      learningCurriculumEn: [
        { step: 1, title: 'Week 1: 14 Pioneer Species & CSR Balancing', focus: 'Implementation of the 36-point budget calibrated against ecological literature', milestone: 'Mathematically balanced roster with no dominant degenerate metas' },
        { step: 2, title: 'Week 2: 6-Round Seasonal Battle Engine', focus: 'Deterministic event resolution pipeline (Event → Test → Tactic → Tug-of-War)', milestone: 'Fully transparent combat log with intuitive round outcome' },
        { step: 3, title: 'Week 3: Signature Skills & Stewardship Protocol', focus: 'Interactive triggers for ballistic seeds, C4 shifts, cryptobiosis, and seed cards', milestone: 'Seed marketplace logic and non-extractive stewardship mechanics' },
        { step: 4, title: 'Week 4: Mobile-Ready PWA & Open Gift Dossier', focus: 'Polishing tactical canvas and releasing complete dossier as open CC0 gift', milestone: 'Playable arena sandbox embedded in the Amélie catalog' }
      ]
    }
  },
  {
    id: 'biotoptyp-assistent',
    title: 'Biotoptyp-Assistent',
    titleEn: 'Habitat Type Assistant',
    oneLinerDe: 'Foto-Upload für ein begangenes Gelände, das einen Vorschlag für den zutreffenden BKompV-Anlage-2-Biotoptyp macht — mit Wertpunkt-Spanne, damit Gutachter:innen bestätigen statt aus 668 Typen von Hand nachzuschlagen.',
    oneLinerEn: 'Upload field photos of a surveyed site and get a proposal for the applicable habitat type under the German compensation ordinance — with its value-point range, so surveyors confirm instead of looking up one of 668 types by hand.',
    date: '18. September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'Ökologische Planungsbüros und Gutachter:innen, die Eingriffsausgleich nach der Bundeskompensationsverordnung berechnen · nachrangig: BfN (Ergänzung zu BfN-Schriften 721) oder das KIBI-Projektteam',
    recipientsEn: 'Ecological planning offices and surveyors calculating impact compensation under the German compensation ordinance · secondary: the federal nature conservation agency (BfN) or the KIBI project team',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Naturschutz', 'Vollzug', 'Bildklassifikation', 'BKompV', 'Gutachten'],
    problemDe: 'Wer für Eingriffsvorhaben — Bau, Straßen, Windkraft — die Kompensation nach der Bundeskompensationsverordnung berechnet, muss jeden kartierten Geländeabschnitt einem von 668 Biotoptypen aus der 315-seitigen BfN-Kartieranleitung (Schrift 721, 2025) zuordnen, bevor Wertpunkte von 0 bis 24 und damit der Kompensationsbedarf feststehen. Handarbeit mit einem sehr dicken Nachschlagewerk, für jede Teilfläche einzeln.',
    problemEn: 'Anyone calculating compensation for construction, roads or wind farms under the German compensation ordinance must assign every surveyed patch to one of 668 habitat types from a 315-page mapping manual before value points from 0 to 24 — and thus the required compensation — are fixed. Manual work with a very thick reference book, patch by patch.',
    whyNowDe: [
      'Bildklassifikation auf Feldfotos ist günstig und schnell geworden; ObsIdentify erreicht bei der Artbestimmung aus einem einzelnen Foto rund 95 % Trefferquote.',
      'Solche Modelle sind bisher auf Artebene trainiert, nicht auf die rechtlich vorgeschriebene 668-Typen-Klassifikation der 2025er Kartieranleitung — die ist so neu, dass dafür noch kein öffentlicher Trainingsdatensatz existiert.',
      'Landesbehörden halten aus ihren Biotopkartierungen bereits gelabelte Flächen; die Frage ist Zugang, nicht Machbarkeit.'
    ],
    whyNowEn: [
      'Image classification on field photos has become cheap and fast; ObsIdentify reaches roughly 95 % accuracy on species from a single photo.',
      'Those models are trained at species level, not on the legally prescribed 668-type classification of the 2025 manual — which is new enough that no public training set exists for it.',
      'State agencies already hold labelled patches from their habitat surveys; the question is access, not feasibility.'
    ],
    sketchDe: 'Fotos plus grobe Standortangabe (Bundesland, Nutzungskontext) ergeben drei Vorschläge für den Biotoptyp mit Konfidenzwert und Seitenverweis in Schrift 721, die der Gutachter bestätigt oder korrigiert. Optional Anbindung an einen bestehenden Wertpunkte-Rechner wie das rheinland-pfälzische BWKalk. Nicht dazu gehört der Ersatz der Vor-Ort-Begehung — nur eine Vorsortierung, die den Katalog-Nachschlag abkürzt.',
    sketchEn: 'Photos plus a rough location (federal state, land-use context) yield three habitat-type proposals with confidence scores and page references into the manual, which the surveyor confirms or corrects. Optionally wired to an existing value-point calculator. It does not replace the site visit — it is a pre-sort that shortens the lookup.',
    firstStepDe: {
      ticket: 'Die Trainingsdaten-Frage klären, bevor irgendetwas gebaut wird.',
      criteria: 'Fertig, wenn eine Liste möglicher Datenquellen steht — Länder-Biotopkartierungen, GBIF, Namis-Biotop-App-Exporte — mit Ansprechpersonen. Das ist Voraussetzung für jedes Modelltraining.'
    },
    firstStepEn: {
      ticket: 'Settle the training-data question before building anything.',
      criteria: 'Done when a list of possible data sources exists — state habitat surveys, GBIF, app exports — with named contacts. That is the precondition for any model training.'
    },
    failureModeDe: 'Das BfN-Projekt KIBI geht dieselbe Grundaufgabe von der anderen Seite an, per Fernerkundung statt Bodenfoto. Das bringt eine Vorsortierung in Konkurrenz um Trainingsdaten und Zuständigkeit bei den Landesämtern. Ohne Kooperation mit einer Landesbehörde oder dem BfN bekommt ein unabhängiges Werkzeug vermutlich keinen Zugang zu belastbaren Trainingsdaten — deshalb das kurze Prüffenster.',
    failureModeEn: 'The federal KIBI project tackles the same task from the other side, via remote sensing rather than ground photos, which puts a pre-sorting tool in competition for training data and jurisdiction. Without cooperation from a state agency, an independent tool probably gets no access to reliable training data — hence the short review window.',
    priorArtDe: 'KIBI kartiert FFH-Lebensraumtypen automatisiert aus Luft- und Satellitenbildern — andere Datenquelle, schmalerer Typenkatalog. Die Namis-Biotop-App digitalisiert die Felderfassung, klassifiziert aber nicht. ObsIdentify und Flora Incognita bestimmen Arten, keine Biotoptypen. Ökokonto- und Kompensationsflächenkataster-Software ist GIS-Verwaltung, keine Bildanalyse. Ein Boden-Foto-zu-Typ-Klassifizierer wurde nicht gefunden; das Feld ist aktiv in Bewegung.',
    priorArtEn: 'KIBI maps habitat types automatically from aerial and satellite imagery — different data source, narrower catalogue. Field-recording apps digitise data entry without classifying. ObsIdentify and Flora Incognita identify species, not habitat types. Compensation-area registries are GIS administration, not image analysis. No ground-photo-to-type classifier was found, but the field is visibly moving.'
  },
  {
    id: 'lichtplan-check',
    title: 'Lichtplan-Check',
    titleEn: 'Lighting Plan Check',
    oneLinerDe: 'Ein Web-Formular, das eine geplante Außenbeleuchtung gegen die verstreuten insekten- und vogelfreundlichen Kriterien mehrerer Behörden prüft und mit Quellenangabe zeigt, wo es kippt.',
    oneLinerEn: 'A web form that checks planned outdoor lighting against the scattered insect- and bird-friendly criteria of several agencies, and shows with citations where it fails.',
    date: '18. September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Landesumweltbehörden mit eigenem Leitfaden (z. B. Hamburg BUKEA, „Licht & Naturschutz") · nachrangig: NABU und BUND, kommunale Umweltämter bei der Umrüstung der Straßenbeleuchtung',
    recipientsEn: 'State environment agencies with their own guidance (e.g. Hamburg\'s "Light & Nature Conservation") · secondary: conservation NGOs, municipal environment offices retrofitting street lighting',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Lichtverschmutzung', 'Insektenschutz', 'Vogelschutz', 'Artenschutz', 'Leitfäden', 'Selbstcheck', 'Kommunen'],
    problemDe: 'Bauherren, Kommunen und Lichtplaner:innen sollen Außenbeleuchtung gegen Vogel- und Insektenschutzkriterien prüfen — aber die Kriterien liegen verstreut über PDF-Leitfäden mehrerer Behörden und Verbände statt an einer Stelle: Abstrahlwinkel möglichst steil, Farbtemperatur ≤ 2700 K und optimal um 2200 K, Abschirmung, Betriebszeiten. Wer keinen Lichtplaner beauftragt — die meisten privaten Bauherren, viele kleine Kommunen — hat keine Möglichkeit, eine Planung selbst gegenzuprüfen.',
    problemEn: 'Builders, municipalities and lighting designers are expected to check outdoor lighting against bird and insect protection criteria — but those criteria are scattered across PDF guidance from several agencies and NGOs instead of sitting in one place: steep beam angles, colour temperature at or below 2700 K and ideally around 2200 K, shielding, operating hours. Anyone not hiring a lighting designer has no way to check a plan themselves.',
    whyNowDe: [
      'Sprachmodelle können PDF-Leitfäden mehrerer Behörden strukturiert zu einem einheitlichen, quellenbelegten Kriterienkatalog zusammenführen — vorher hieß das manuelle Leitfaden-Lektüre pro Bundesland.',
      'Der Check selbst braucht kein Modell, nur Schwellenwerte. Der Aufwand liegt vollständig in der Recherche, nicht im Bauen.'
    ],
    whyNowEn: [
      'Language models can consolidate PDF guidance from several agencies into one sourced criteria catalogue — previously that meant reading every state\'s guidance by hand.',
      'The check itself needs no model, only thresholds. The effort is entirely in the research, not the building.'
    ],
    sketchDe: 'Formular für Standort (naturnah ja/nein, grob geokodiert), Leuchtentyp, Farbtemperatur, Abstrahlwinkel, Abschirmung und Betriebszeiten; Ausgabe als Ampel pro Kriterium, mit wörtlichem Zitat der Leitfadenstelle und Handlungsempfehlung. Nicht dazu gehört die Kamera-Analyse einer bestehenden Anlage — ein eigenes, viel aufwendigeres Projekt — und jeder Anspruch, ein Fachgutachten im Genehmigungsverfahren zu ersetzen.',
    sketchEn: 'A form for location (near-natural yes/no, roughly geocoded), luminaire type, colour temperature, beam angle, shielding and operating hours; output as a traffic light per criterion, with the guidance quoted verbatim and a recommendation. Not included: camera analysis of existing installations, and any claim to replace an expert report in a permit procedure.',
    firstStepDe: {
      ticket: 'Die vier bis fünf Leitfäden in eine gemeinsame Kriterientabelle übertragen.',
      criteria: 'Fertig, wenn eine Tabelle mit Kriterium, Schwellenwert, Quelle und Quelldatum existiert, die Widersprüche zwischen den Leitfäden — etwa 2200 K gegen 2700 K — ausdrücklich markiert, statt sie zu verstecken.'
    },
    firstStepEn: {
      ticket: 'Transfer the four or five guidance documents into one shared criteria table.',
      criteria: 'Done when a table of criterion, threshold, source and source date exists that explicitly marks contradictions between the documents — 2200 K versus 2700 K, for instance — instead of hiding them.'
    },
    failureModeDe: 'Die Leitfäden widersprechen sich in Details, und ein Werkzeug, das eine falsche Schwelle als „sicher" ausgibt, ist schlimmer als gar keins. Gegenmaßnahme: jedes Kriterium mit Quelle zitieren statt als eigene Wahrheit ausgeben, und an jeder Stelle klar sagen, dass es ein Selbstcheck ist und kein Gutachten-Ersatz.',
    failureModeEn: 'The guidance documents contradict each other in detail, and a tool that declares a wrong threshold "safe" is worse than none. Remedy: quote every criterion with its source rather than asserting it, and say plainly throughout that this is a self-check, not a substitute for an expert report.',
    priorArtDe: 'Keine automatisierte Prüf-App gefunden (drei Suchen am 18.09.2026). Es gibt Text-Leitfäden von Hamburg BUKEA, NABU und BUND sowie ein kommerzielles Beratungsangebot eines Leuchtenherstellers für Kommunen — kein neutrales Self-Check-Werkzeug.',
    priorArtEn: 'No automated checking app was found (three searches on 18 Sep 2026). There is text guidance from the Hamburg environment authority and from conservation NGOs, plus a commercial advisory offer from a luminaire manufacturer — but no neutral self-check tool.'
  },
  {
    id: 'eichflaechen-trainer',
    title: 'Eichflächen-Trainer',
    titleEn: 'Calibration Deck for Habitat Surveyors',
    oneLinerDe: 'Ein Kalibrierdeck aus echten, bereits kartierten Biotopflächen: Feldfotos und Artenliste rein, eigenen Code raten, sofort mit dem archivierten Experten-Konsens abgleichen — damit Nachwuchs die seltenen Zweifelsfälle üben kann, ohne eine echte Saison zu verbrauchen.',
    oneLinerEn: 'A calibration deck built from real, already-mapped habitat patches: field photos and species list in, guess the code, compare instantly against the archived expert consensus — so trainees can practise the rare borderline cases without burning a real field season.',
    date: '18. September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Ausbildungsstellen für Biotopkartierung (Akademie für angewandte Vegetationskunde, ANL Bayern) · nachrangig: Landesämter mit digitalem Kartierschlüssel wie der NLWKN in Niedersachsen',
    recipientsEn: 'Training institutions for habitat mapping · secondary: state agencies with a digital mapping key',
    domain: 'knowledge',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Ausbildung', 'Biotopkartierung', 'Spaced Repetition', 'Referenzflächen', 'Fachkräftemangel'],
    problemDe: 'Wer Biotoptypen nach dem amtlichen Kartierschlüssel kartiert, lernt das fast ausschließlich, indem er einen erfahrenen Kartierer eine Saison lang begleitet. Die Kursbeschreibungen nennen das Problem selbst: pflanzensoziologisches Grundwissen ist die eigentliche Hürde, und es herrscht bereits ein spürbarer Mangel an gut ausgebildeten Kartierern. Die sechswöchige Vegetationsperiode, in der die diagnostischen Arten sicher erkennbar sind, macht jede Übungsrunde teuer — ein missklassifizierter Grenzfall fällt oft erst am Schreibtisch auf, wenn die Fläche für dieses Jahr nicht mehr zugänglich ist.',
    problemEn: 'Habitat mapping under the official key is learned almost exclusively by shadowing an experienced surveyor for a season. The course descriptions name the problem themselves: plant sociology is the real hurdle, and there is already a marked shortage of well-trained surveyors. The six-week window in which diagnostic species are reliably identifiable makes every practice round expensive — a misclassified borderline case is often noticed at the desk, when the site is no longer in the right state.',
    whyNowDe: [
      'Mehrere Bundesländer veröffentlichen ihre Kartierschlüssel inzwischen als strukturierte PDFs mit Querverweisen, und die Kartierungsergebnisse liegen bei vielen Landesämtern als Geodaten mit Attributen vor.',
      'Was fehlte, ist kein neues Verfahren, sondern die Kombination: archivierte Flächen, bekannter Konsens-Code, ein Interface, das den Vergleich sofort zeigt. Vor fünf Jahren hätte allein das Einscannen der Kartierbögen den Aufwand gesprengt.'
    ],
    whyNowEn: [
      'Several federal states now publish their mapping keys as structured PDFs with cross-references, and many agencies hold survey results as geodata with attributes.',
      'What was missing is not a new method but the combination: archived patches, the known consensus code, and an interface that shows the comparison instantly. Five years ago, digitising the survey sheets alone would have broken the budget.'
    ],
    sketchDe: 'Datenbasis sind 100 bis 300 georeferenzierte Referenzflächen aus einem Bundesland — Fotos, notierte Artenliste, zugewiesener Code —, kuratiert mit dem Landesamt statt gescrapt. Im Übungsmodus sieht die Nutzerin Fotos und Artenliste, wählt einen Code aus dem offiziellen Schlüssel und bekommt sofort den Konsens-Code plus die Begründung, welche Zeiger- oder Strukturmerkmale den Ausschlag gaben. Schwerpunkt auf Grenzfällen, weil genau die im Feld die teuersten Fehler sind. Kein automatischer Klassifikator, kein Ersatz für die Begehung, kein Live-Einsatz im Feld — das ist der Kartierlotse.',
    sketchEn: 'The data base is 100 to 300 georeferenced reference patches from one state — photos, recorded species list, assigned code — curated with the agency rather than scraped. In practice mode the user sees photos and species list, picks a code from the official key, and immediately gets the consensus code plus the reasoning about which indicator species or structural features decided it. The focus is on borderline cases, because those are the expensive mistakes. No automatic classifier, no replacement for the site visit, no live field use.',
    firstStepDe: {
      ticket: 'Eine Ausbildungsstelle oder ein Landesamt um fünfzig abgeschlossene, nicht mehr strittige Kartierbögen für ein Pilot-Deck bitten.',
      criteria: 'Fertig, wenn ein Klick-Prototyp mit diesen fünfzig Flächen läuft und drei Kursteilnehmer ihn eine Stunde lang durchgespielt haben.'
    },
    firstStepEn: {
      ticket: 'Ask one training institution or state agency to release fifty completed, uncontested survey sheets for a pilot deck.',
      criteria: 'Done when a click-through prototype runs on those fifty patches and three course participants have played through it for an hour.'
    },
    failureModeDe: 'Die veröffentlichten Geodaten enthalten meist nur Polygon und finalen Code, nicht die Begründung des Kartierers vor Ort. Ohne sie ist das Feedback nur „richtig/falsch" statt „warum" — pädagogisch deutlich schwächer. Gegenmaßnahme: nicht breit scrapen, sondern mit einer einzelnen Ausbildungsstelle starten, die ihre Kartierbögen inklusive Originalnotizen noch besitzt, und das Deck von dort wachsen lassen.',
    failureModeEn: 'Published geodata usually carry only the polygon and the final code, not the surveyor\'s on-site reasoning. Without it the feedback is merely right/wrong instead of why — pedagogically much weaker. Remedy: do not scrape broadly; start with one institution that still holds its survey sheets including the original notes, and grow the deck from there.',
    priorArtDe: 'Die bestehende Ausbildung ist ausschließlich Präsenz-Begleitung im Feld; der ausdrücklich benannte Fachkräftemangel bestätigt den Engpass. In vier Suchen wurde kein digitales Kalibrier- oder Spaced-Repetition-Werkzeug für diesen Zweck gefunden — nur allgemeine Felddatenerfassungs-Apps wie Vegapp oder e-Surveyor, die Neuerfassung adressieren, nicht Training.',
    priorArtEn: 'Existing training is exclusively in-person field shadowing, and the explicitly named shortage of surveyors confirms the bottleneck. Four searches found no digital calibration or spaced-repetition tool for this purpose — only general field data-entry apps, which address new recording rather than training.'
  },
  {
    id: 'kartierlotse',
    title: 'Kartierlotse',
    titleEn: 'Mapping Pilot',
    oneLinerDe: 'Ein Feld-Assistent für die Biotopkartierung, der während der Begehung anzeigt, welche Zeigerart oder Strukturangabe noch fehlt, um zwischen zwei möglichen Codes sicher zu entscheiden — Live-Hinweis statt nachträglicher Vorhersage am Schreibtisch.',
    oneLinerEn: 'A field assistant for habitat mapping that shows, while you are still on site, which indicator species or structural note is missing to decide between two candidate codes — a live prompt instead of a prediction made later at the desk.',
    date: '18. September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Landesämter mit digitalisiertem Kartierschlüssel (NLWKN Niedersachsen als Startpunkt) · nachrangig: Ausbildungsstellen und Planungsbüros mit eigenen Kartierteams',
    recipientsEn: 'State agencies with a digitised mapping key · secondary: training institutions and planning offices with their own survey teams',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Biotopkartierung', 'Feldarbeit', 'Offline', 'Entscheidungslogik', 'Vollständigkeits-Check'],
    problemDe: 'Kartierer arbeiten meist allein und entscheiden die Codezuweisung im Feld anhand eines über hundertseitigen amtlichen Schlüssels. Bei Übergangs- und Mosaik-Typen hängt die Entscheidung oft an einer einzigen zusätzlichen Beobachtung — einer Zeigerart, die man nicht extra gesucht hat, oder einem Strukturmerkmal, das man nicht notiert hat. Bemerkt wird die Lücke meist erst am Schreibtisch; dann ist die Fläche oft nicht mehr im richtigen Vegetationsstadium zugänglich, und die engen sechs Wochen der Saison machen einen zweiten Besuch teuer.',
    problemEn: 'Surveyors usually work alone and assign codes in the field from an official key of more than a hundred pages. For transitional and mosaic types the decision often hinges on a single extra observation — an indicator species nobody went looking for, or a structural feature nobody recorded. The gap is typically noticed at the desk, by which time the site is often no longer in the right state, and the narrow six-week season makes a second visit expensive.',
    whyNowDe: [
      'Mehrere Landeskartierschlüssel liegen mit strukturierten Querverweisen vor und sind damit erstmals maschinenlesbar in eine Entscheidungslogik überführbar.',
      'Kleine Sprachmodelle laufen offline auf einem Feldtelefon — wichtig, weil viele Offenlandflächen ohne Netzabdeckung liegen.',
      'Die e-Surveyor-Studie (Ridding u. a. 2026) belegt erstmals, dass automatisierte Habitattyp-Vorhersage aus einer Artenliste grundsätzlich funktioniert — nur für ein anderes Klassifikationssystem und als nachträgliche Vorhersage.'
    ],
    whyNowEn: [
      'Several state mapping keys now exist with structured cross-references, making them machine-readable as decision logic for the first time.',
      'Small language models run offline on a field phone — which matters because many open-land sites have no network coverage.',
      'The e-Surveyor study (Ridding et al. 2026) is the first published evidence that automated habitat-type prediction from a species list works at all — but for a different classification system and as an after-the-fact prediction.'
    ],
    sketchDe: 'Der Kartierer trägt Arten und Strukturbeobachtungen wie gewohnt während der Begehung ein, per Sprache oder Kürzel. Die App hält die digitalisierte Entscheidungslogik eines Kartierschlüssels im Hintergrund und erkennt, wenn zwei Codes nach aktuellem Stand gleich wahrscheinlich sind. In diesem Moment zeigt sie, was für die Unterscheidung noch fehlt und wo es typischerweise zu finden ist. Kein automatischer Codevorschlag, keine Ersetzung der fachlichen Entscheidung — nur ein Vollständigkeits-Check, solange man noch auf der Fläche steht.',
    sketchEn: 'The surveyor records species and structural observations as usual during the walk, by voice or shorthand. The app holds the digitised decision logic of one mapping key in the background and detects when two codes remain equally likely. At that moment it shows what is still missing to tell them apart and where it is typically found. No automatic code suggestion, no replacement of professional judgement — only a completeness check while you are still standing on the site.',
    firstStepDe: {
      ticket: 'Einen einzigen Biotop-Obertyp aus dem NLWKN-Kartierschlüssel von Hand in eine Entscheidungstabelle „Code ↔ notwendige Zeigerarten und Strukturmerkmale" übertragen.',
      criteria: 'Fertig, wenn ein erfahrener Kartierer diese Tabelle gegen drei reale, abgeschlossene Kartierfälle prüft und bestätigt, dass die Logik seine damalige Entscheidung korrekt nachvollzieht.'
    },
    firstStepEn: {
      ticket: 'Transfer a single top-level habitat group from one state key by hand into a decision table of code versus required indicator species and structural features.',
      criteria: 'Done when an experienced surveyor checks that table against three real, completed cases and confirms that the logic reproduces the decision they made at the time.'
    },
    failureModeDe: 'Die reale Entscheidungspraxis vieler Kartierer ist holistischer, als der gedruckte Schlüssel suggeriert — der Gesamteindruck der Fläche zählt oft mehr als einzelne Kriterien. Ein Werkzeug, das nur die schriftlichen Kriterien abbildet, kann bei genau den Grenzfällen, auf die es zielt, falsche Sicherheit erzeugen. Gegenmaßnahme: nie als Klassifikator verkaufen, sondern strikt als Erinnerung daran, was noch nicht geprüft wurde, und vor jedem Rollout gegen echte Altfälle validieren, nicht nur gegen den Text.',
    failureModeEn: 'Real practice is more holistic than the printed key suggests — the overall impression of a site often counts for more than individual criteria. A tool that reflects only the written criteria can create false confidence in exactly the borderline cases it targets. Remedy: never sell it as a classifier, only as a reminder of what has not been checked, and validate against real past cases before any rollout, not just against the text.',
    priorArtDe: 'Die e-Surveyor-App sagt aus einer im Feld erhobenen Artenliste den Habitattyp nach drei britischen Klassifikationssystemen voraus — das Grundprinzip funktioniert also, aber für ein anderes System und als nachträgliche Vorhersage. Vegapp digitalisiert die Felddateneingabe ohne Klassifikationslogik. Für den deutschen Kartierschlüssel wurde in vier Suchen kein vergleichbares Werkzeug gefunden; keines der Landesämter bietet mehr als PDF-Schlüssel mit Querverweisen.',
    priorArtEn: 'The e-Surveyor app predicts habitat type from a field species list under three UK classification systems — so the principle works, but for a different system and as an after-the-fact prediction. Vegapp digitises field data entry without classification logic. For the German key, four searches found no comparable tool; no state agency offers more than PDF keys with cross-references.'
  },
  {
    id: 'denkmal-verlaufsblick',
    title: 'Denkmal-Verlaufsblick',
    titleEn: 'Heritage Decay Timeline',
    oneLinerDe: 'Ehrenamtliche fotografieren ein gefährdetes Baudenkmal immer vom selben Standpunkt; ein Werkzeug legt die Bilder übereinander und markiert, was sich seit dem letzten Mal verändert hat — Putz ab, Dachfläche eingebrochen, Öffnung neu vernagelt.',
    oneLinerEn: 'Volunteers photograph an endangered listed building from the same vantage point each time; a tool aligns the images and marks what has changed since the last visit — render fallen, roof collapsed, an opening newly boarded up.',
    date: '19. September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'Deutsche Stiftung Denkmalschutz (Schwarzbuch-Team, ehrenamtliche Beiräte) · nachrangig: Landesdenkmalämter mit Bürgerportal, etwa das BLfD in Bayern',
    recipientsEn: 'German Foundation for Monument Protection (its "black book" team and volunteer boards) · secondary: state heritage agencies with a citizen portal',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Denkmalschutz', 'Ehrenamt', 'Bildregistrierung', 'Zeitreihe', 'Meldung'],
    problemDe: 'Gefährdete Baudenkmale verfallen meist nicht durch ein Ereignis, sondern durch Leerstand über Jahre. Wer das beobachtet, sind Anwohner:innen und Ehrenamtliche — sie haben aber keinen Weg, „es wird schlechter" so festzuhalten, dass ein Amt oder eine Stiftung es als Verlauf lesen kann. Was existiert, ist rückblickend: Die Deutsche Stiftung Denkmalschutz führt ein Meldeportal und veröffentlicht daraus das Schwarzbuch, zuletzt 324 Seiten zu 2024/25 mit über 1.000 verlorenen Denkmalen. Das ist ein Verlustverzeichnis. Es fehlt die Zeit davor.',
    problemEn: 'Endangered listed buildings rarely decay through one event; they decay through years of vacancy. The people who see it are neighbours and volunteers — and they have no way to record "it is getting worse" so that an agency or foundation can read it as a trajectory. What exists is retrospective: a reporting portal and, out of it, a "black book" of losses, most recently 324 pages covering 2024/25 and more than 1,000 lost monuments. That is an inventory of losses. What is missing is the time before.',
    whyNowDe: [
      'Wiederholte Fotos deckungsgleich zu bekommen ist Bibliothekscode geworden; früher war genau dieser Aufwand der Grund, warum niemand Zeitreihen von Laienfotos erwartet hat.',
      'Ein Vision-Language-Modell kann aus zwei ausgerichteten Fotos einen Satz wie „an der Nordost-Ecke ist der Putz auf etwa einem Quadratmeter neu abgefallen" formulieren — als erster Hinweis für Menschen, nicht als Befund.',
      'KI-gestützte Zustandserfassung an Baudenkmalen ist 2025/26 in Papers vorhanden; was diese Arbeiten übergehen, ist der Laie mit dem Handy.'
    ],
    whyNowEn: [
      'Aligning repeat photographs has become library code; that effort used to be the reason nobody expected time series from amateur photos.',
      'A vision-language model can turn two aligned photos into a sentence like "render has newly come off about a square metre at the north-east corner" — as a first hint for humans, not a finding.',
      'AI-assisted condition assessment of heritage buildings exists in the 2025/26 literature; what that work skips is the layperson with a phone.'
    ],
    sketchDe: 'Standpunkt anlegen mit Erstfoto, Ortsmarke, Kompassrichtung und einem halbtransparenten Overlay für spätere Aufnahmen. Alle paar Wochen ein Foto, das Overlay hilft beim Ausrichten. Danach ausrichten, Änderungen markieren, ein Satz Beschreibung — als Vorschlag mit Konfidenz, nie als Befund. Eine Zeitleiste pro Objekt erzeugt auf Klick ein Verlaufsblatt zum Anhängen an eine Meldung. Nicht dabei: Statik- oder Schadensbewertung, Ersatz der Schadenskartierung durch Restaurator:innen, eine öffentliche Karte gefährdeter Gebäude (Vandalismus- und Diebstahlrisiko), Betreten von Grundstücken.',
    sketchEn: 'Create a vantage point with a first photo, a location marker, a compass bearing and a semi-transparent overlay for later shots. Every few weeks another photo, with the overlay helping to line it up. Then align, mark changes, and add one sentence of description — as a proposal with confidence, never as a finding. A timeline per object produces, on one click, a sheet to attach to a report. Not included: structural or damage assessment, replacing professional damage mapping, a public map of endangered buildings, or entering private property.',
    firstStepDe: {
      ticket: 'Zwei Fotos, ein Overlay, ein Vergleichsblatt — keine KI im ersten Schritt.',
      criteria: 'Fertig, wenn eine Ehrenamtliche denselben Standpunkt nach vier Wochen ohne Anleitung so trifft, dass Ausrichtung und Vergleich ohne Handarbeit klappen. Erst danach lohnt die Änderungserkennung.'
    },
    firstStepEn: {
      ticket: 'Two photos, one overlay, one comparison sheet — no AI in the first step.',
      criteria: 'Done when a volunteer hits the same vantage point four weeks later, without instruction, closely enough that alignment and comparison work without manual fixing. Only then is change detection worth building.'
    },
    failureModeDe: 'Licht, Jahreszeit, Bewuchs und Schatten verändern Fotos stärker als Putz — ein Werkzeug, das ständig Schaden meldet, ist nach zwei Wochen aus. Deshalb zuerst Ausrichtung und Schiebe-Vergleich liefern, Änderungserkennung nur als schwacher Hinweis. Offen ist außerdem, ob die Stiftung Beobachter:innen hat, die wiederholt hinsehen statt einmal zu melden, und die Rechtslage beim Fotografieren von Privatgrundstücken ist nicht geprüft.',
    failureModeEn: 'Light, season, vegetation and shadow change photographs more than render does — a tool that constantly reports damage is uninstalled within two weeks. So deliver alignment and a slider comparison first, with change detection only as a weak hint. It is also unverified whether the foundation has volunteers who look repeatedly rather than report once, and the legal position on photographing private property has not been checked.',
    priorArtDe: 'Das Meldeportal der Stiftung und das Schwarzbuch sind rückblickend; in den Treffern keine Verlaufsbeobachtung. Das bayerische Bürgerportal Denkmalpflege bietet Beratung und Förderung, keine Foto-Verlaufsdaten. Profi-Software wie Metigo MAP und KALIV digitalisiert die Schadenskartierung durch Restaurator:innen — anderer Nutzer, anderes Ziel. Vision-basierte Verfallserkennung an Denkmalen ist aktive Forschung, richtet sich aber an Fachpersonal. Frei ist die schmale Rolle: Laien-Verlauf für gefährdete Objekte, mit Weg zur Meldung.',
    priorArtEn: 'The foundation\'s reporting portal and its "black book" are retrospective; no trajectory tracking appeared in the results. A state citizen portal offers advice and funding, not photo trajectories. Professional software digitises damage mapping by conservators — a different user with a different goal. Vision-based decay detection on heritage buildings is active research aimed at professionals. What is free is the narrow role: a layperson\'s trajectory for endangered objects, with a path to a report.'
  },
  {
    id: 'waermesignatur',
    title: 'Wärmesignatur',
    titleEn: 'Heat Signature',
    oneLinerDe: 'Zwölf Monatswerte vom Gaszähler plus das Wetter ergeben, wie viel Wärme diese Wohnung pro Grad Temperaturunterschied verliert und ab welcher Außentemperatur sie heizt — als ehrliches Band, ohne dass jemand einen Grundriss zeichnet.',
    oneLinerEn: 'Twelve monthly meter readings plus the weather yield how much heat this flat loses per degree of temperature difference, and at which outdoor temperature it starts heating — as an honest band, without anyone drawing a floor plan.',
    date: '19. September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'co2online gGmbH (HeizCheck, Partner im EnergyMap-Verbund) · nachrangig: Forschungsverbund EnergyMap Berlin als Kalibrierziel für Altbau Thermal, Verbraucherzentrale Berlin',
    recipientsEn: 'co2online (operator of a heating-cost check and partner in the EnergyMap consortium) · secondary: the EnergyMap Berlin research consortium as a calibration target, consumer advice centres',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Berlin', 'Energie', 'Mieter', 'Bayes', 'Unsicherheit', 'HeizkostenV'],
    problemDe: 'Wer zur Miete wohnt, bekommt bei fernablesbaren Geräten monatlich seinen Wärmeverbrauch mitgeteilt — und dazu nur den Vergleich mit einer Durchschnittsnutzerin. „Sie liegen 30 % über dem Durchschnitt" beantwortet nicht, was die Bewohnerin wissen will: Liegt es an meiner Wohnung oder an mir? Die Größe, die die Frage beantwortet — der Wärmeverlust in Watt pro Kelvin — ist genau das, was Laien nicht angeben können, weil niemand den U-Wert seiner Außenwand kennt. Ein Teil der Antwort liegt aber längst in der Schublade: in den Zählerständen.',
    problemEn: 'Tenants with remotely readable meters now receive their heat consumption monthly — together with nothing but a comparison to an average user. "You are 30 % above average" does not answer what the resident wants to know: is it my flat or is it me? The quantity that answers it — heat loss in watts per kelvin — is precisely what laypeople cannot supply, because nobody knows the U-value of their exterior wall. Yet part of the answer is already in the drawer: in the meter readings.',
    whyNowDe: [
      'Die Monatsreihe kommt ungefragt: Nicht fernablesbare Zähler mussten bis 31.12.2026 nachgerüstet sein, danach ist mindestens monatlich eine Verbrauchsinformation Pflicht. Bis vor Kurzem gab es einen Wert pro Jahr.',
      'Die Energiesignatur — Verbrauch gegen Außentemperatur regressieren — ist Lehrbuch. Neu ist die Bayes\'sche Fassung, die ein Band statt einer Zahl liefert (arXiv 2503.22321, 2025), und sie läuft in jedem Browser.',
      'Wetterdaten sind frei (DWD), und mit energymap4py gibt es den typischen Wert des eigenen Gebäudes zum Vergleich.'
    ],
    whyNowEn: [
      'The monthly series arrives unasked: meters had to be retrofitted for remote reading by the end of 2026, after which at least monthly consumption information is mandatory. Until recently there was one value a year.',
      'The energy signature — regressing consumption against outdoor temperature — is textbook. What is new is the Bayesian version that yields a band instead of a number (arXiv 2503.22321, 2025), and it runs in any browser.',
      'Weather data is free, and a building-level comparison value is available through an open Python interface.'
    ],
    sketchDe: 'Eingabe in unter einer Minute: sechs bis vierundzwanzig Monatswerte als Foto der Verbrauchsinformation, Zählerstände oder CSV, dazu Postleitzahl und Wohnfläche. Modell: Verbrauch gleich Wärmeverlust mal Gradtage plus Grundlast für Warmwasser, Bayes\'sche lineare Regression gegen DWD-Monatsmittel. Ausgabe nie als eine Zahl, sondern als Band für den Wärmeverlust, dazu Heizgrenztemperatur, Warmwasseranteil und die Lage gegenüber dem Gebäudevergleich — ohne Wertung. Nicht dabei: Energieausweis, Sanierungsprognose, Verhaltenskritik, Server (die Daten bleiben im Browser).',
    sketchEn: 'Input in under a minute: six to twenty-four monthly values as a photo of the consumption statement, meter readings or CSV, plus postcode and floor area. Model: consumption equals heat loss times degree days plus a base load for hot water, Bayesian linear regression against monthly weather means. Output never as a single number but as a band for heat loss, plus the heating threshold temperature, the hot-water share, and where the band sits against the building comparison — without judgement. Not included: energy certificates, renovation forecasts, criticism of behaviour, or a server.',
    firstStepDe: {
      ticket: 'Notebook: zwölf Monatswerte rein, Wärmeverlust-Band raus.',
      criteria: 'Fertig, wenn das Band den wahren Wert einer synthetischen Wohnung in mindestens 90 % von tausend Läufen enthält — und die Breite des Bandes mit ausgegeben wird, damit man sieht, ob es überhaupt informativ ist.'
    },
    firstStepEn: {
      ticket: 'A notebook: twelve monthly values in, a heat-loss band out.',
      criteria: 'Done when the band contains the true value of a synthetic flat in at least 90 % of a thousand runs — and the width of the band is reported alongside, so one can see whether it is informative at all.'
    },
    failureModeDe: 'Heizkostenverteiler messen keine Kilowattstunden, sondern dimensionslose Einheiten, die die Abrechnung erst auf das Haus verteilt; ob eine daraus abgeleitete Monats-Angabe physikalisch belastbar ist, ist strittig. Sauber funktioniert das nur mit echten kWh — Gasetagenheizung, Wärmemengenzähler, Wohnungsstation. Dazu stecken Raumtemperatur, Lüftungsverhalten und Wärme aus Nachbarwohnungen mit im Wert. Das Band muss das ehrlich breit zeigen; wird es so breit, dass es nichts sagt, ist die Idee tot — der Test im ersten Ticket entscheidet das, nicht eine Meinung.',
    failureModeEn: 'Heat cost allocators do not measure kilowatt-hours but dimensionless units that the annual bill distributes across the building; whether a monthly figure derived from them is physically sound is contested. It works cleanly only with real kWh — a flat\'s own gas boiler, a heat meter, a heat interface unit. Room temperature, ventilation behaviour and heat from neighbouring flats are also baked into the value. The band has to show that honestly; if it becomes so wide that it says nothing, the idea is dead — the test in the first ticket decides that, not an opinion.',
    priorArtDe: 'Der HeizCheck von co2online nimmt einen Jahreswert, Fläche und Postleitzahl und vergleicht; in den Treffern kein Monatsverlauf und kein Wärmeverlustkoeffizient. nexoen verfolgt Heiz- und Nebenkosten mit Nachzahlungsprognose, ohne Gebäudeparameter. Ratgeber und das Akkudoktor-Forum rechnen Heizlast aus Gasverbrauch für die Wärmepumpen-Auslegung — der nächste Nachbar, aber ohne Unsicherheitsband. Die Forschung kennt Energiesignatur-Verfahren für Mehrfamilienhäuser, dort kommen die Daten vom Eigentümer. Nicht gefunden: ein Verbraucherwerkzeug, das aus der Monatsreihe einer Mietwohnung ein Band mit Unsicherheit macht.',
    priorArtEn: 'The existing heating check takes one annual value, floor area and postcode and compares them; no monthly trajectory and no heat-loss coefficient appeared. A cost-tracking app forecasts back payments without building parameters. Advice sites and a DIY heat-pump forum derive heating load from gas consumption for sizing — the nearest neighbour, but without an uncertainty band. Research knows energy-signature methods for apartment buildings, where the data comes from the owner. Not found: a consumer tool that turns one flat\'s monthly series into a band with uncertainty.'
  },
  {
    id: 'feuerkugel-sofortnetz',
    title: 'Feuerkugel-Sofortnetz',
    titleEn: 'Fireball Rapid Network',
    oneLinerDe: 'Eine Echtzeit-Schicht über bestehenden Feuerkugel-Meldenetzen, die Zeugen in den ersten Minuten aktiv zusammenbringt und beiläufig laufende Dashcam- und Türklingelkameras vor dem automatischen Überschreiben rettet.',
    oneLinerEn: 'A real-time layer over existing fireball reporting networks that actively brings witnesses together in the first minutes and rescues incidental dashcam and doorbell footage before it is automatically overwritten.',
    date: '18. September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'American Meteor Society und IMO (bestehende Meldenetze) · nachrangig: Global Meteor Network, Betreiber bestehender Warn-Apps mit Nutzerbasis',
    recipientsEn: 'The American Meteor Society and the IMO (existing reporting networks) · secondary: the Global Meteor Network, operators of existing alerting apps with a user base',
    domain: 'physics',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Citizen Science', 'Meteore', 'Geofencing', 'On-Device', 'Dashcam'],
    problemDe: 'Wer eine Feuerkugel sieht, meldet sie — wenn überhaupt — Stunden oder Tage später über ein Webformular, aus dem Gedächtnis, ohne zu wissen, ob jemand sonst in der Nähe dasselbe gesehen hat. Die American Meteor Society sagt selbst, dass Auswertung und Gruppierung nachträglich passieren. Ergebnis: Die meisten Ereignisse erreichen nie die kritische Masse unabhängiger Zeugen für eine Bahnbestimmung — nicht weil zu wenige es gesehen haben, sondern weil niemand sie in den ersten Minuten zusammenbringt. Parallel filmen mehr private Dashcams den Himmel als je eine Astro-Kamera, und ihre Aufnahmen werden binnen ein bis zwei Tagen überschrieben.',
    problemEn: 'People who see a fireball report it — if at all — hours or days later through a web form, from memory, without knowing whether anyone nearby saw the same thing. The American Meteor Society itself says analysis and grouping happen after the fact. As a result most events never reach the critical mass of independent witnesses needed for a trajectory — not because too few people saw it, but because nobody brings them together in the first minutes. Meanwhile more private dashcams film the sky than any astronomical camera ever did, and their footage is overwritten within a day or two.',
    whyNowDe: [
      'Geofenced Push an alle Nutzer:innen in einem Umkreis von wenigen Kilometern ist Standardinfrastruktur geworden — Wetterwarn-Apps und Waldbrand-Apps wie Watch Duty machen es vor.',
      'Bewegungs- und Helligkeitserkennung für „kurzer, sehr heller Streifen am Nachthimmel" läuft lokal auf Dashcam-Chips oder als Begleit-App, ohne Cloud-Kosten; die Modelle, die das billig genug machen, gibt es erst seit ein bis zwei Jahren.'
    ],
    whyNowEn: [
      'Geofenced push to everyone within a few kilometres has become standard infrastructure — weather and wildfire alerting apps do it already.',
      'Motion and brightness detection for "a short, very bright streak in the night sky" runs locally on dashcam chips or as a companion app, without cloud costs; the models that make it cheap enough are only one or two years old.'
    ],
    sketchDe: 'Erster Baustein, Sofort-Rekrutierung: Die erste Meldung löst einen Geofenced Push an Nutzer:innen im Umkreis von etwa fünfzig Kilometern aus, mit einem Zeitfenster von zwanzig Minuten und einem strukturierten Mini-Formular statt Fließtext, damit die Angaben vergleichbar sind. Zweiter Baustein, Ambient-Rettung: eine kleine On-Device-Erkennung, die einen kurzen, sehr hellen, schnellen Streifen erkennt und den Clip lokal vor dem Überschreiben markiert, Teilen nur per Opt-in. Beide speisen in das bestehende Meldeformat ein und ersetzen die institutionelle Auswertung nicht. Nicht dazu gehört neue Kamera-Hardware oder eine eigene Bahnberechnung.',
    sketchEn: 'First building block, immediate recruitment: the first report triggers a geofenced push to users within about fifty kilometres, with a twenty-minute window and a structured mini form instead of free text, so the statements are comparable. Second block, ambient rescue: a small on-device detector that spots a short, very bright, fast streak and marks the clip locally against overwriting, with sharing strictly opt-in. Both feed the existing report format and do not replace institutional analysis. Not included: new camera hardware or a trajectory solver of its own.',
    firstStepDe: {
      ticket: 'Baustein 1 als eigenständiges Feature: ein Push-Bot, der an einen bestehenden Melde-Feed andockt und bei neuer Meldung Nutzer:innen in der Nähe benachrichtigt.',
      criteria: 'Fertig, wenn ein echtes Ereignis innerhalb von zwanzig Minuten mindestens eine zusätzliche, strukturierte Zeugenmeldung erzeugt hat, die es ohne den Push nicht gegeben hätte.'
    },
    firstStepEn: {
      ticket: 'Build block one on its own: a push bot that hooks into an existing report feed and alerts nearby users when a new report arrives.',
      criteria: 'Done when one real event produces, within twenty minutes, at least one additional structured witness report that would not have existed without the push.'
    },
    failureModeDe: 'Baustein 1 funktioniert nur, wenn genug Menschen die App vorher installiert haben — mit null Nutzer:innen gibt es niemanden zum Rekrutieren. Gegenmaßnahme: an eine bestehende Nutzerbasis andocken statt eine neue App zu starten. Baustein 2 kippt an Fehlalarmen durch Blitzlicht, Autoscheinwerfer und Kameraflackern; ohne guten Filter ist die Quote falscher Treffer höher als die Rettungsquote echter.',
    failureModeEn: 'Block one only works if enough people installed the app beforehand — with zero users there is nobody to recruit. Remedy: dock onto an existing user base instead of launching a new app. Block two fails on false alarms from camera flashes, headlights and flicker; without a good filter, the false-positive rate exceeds the rescue rate of real events.',
    priorArtDe: 'Die bestehende Infrastruktur deckt beide Bausteine ausdrücklich nicht ab. AMS und IMO sammeln Meldungen webbasiert und gruppieren sie nachträglich; die AMS nennt die Daten selbst nicht echtzeitfähig. FRIPON kombiniert Radio- und Videostationen für Echtzeit-Trajektorien, aber mit eigens installierten Profi-Stationen und ohne aktives Zeugen-Recruiting. AllSky7, Global Meteor Network und CAMS betreiben dedizierte, nach oben gerichtete Astro-Kameras. RedVox deckt die Infraschall-Route ab, einen verwandten, aber anderen Sensorkanal. Die Bahnberechnung ist besetzt, die Echtzeit-Zuführung von Zeugen und beiläufigem Kamerafootage nicht.',
    priorArtEn: 'Existing infrastructure explicitly covers neither block. The reporting networks collect reports through the web and group them afterwards, and state themselves that the data is not real time. FRIPON combines radio and video stations for real-time trajectories, but with purpose-installed professional stations and no active witness recruitment. All-sky camera networks run dedicated upward-facing astronomical cameras. An infrasound app covers a related but different sensor channel. Trajectory computation is taken; real-time routing of witnesses and incidental footage into those systems is not.'
  },
  {
    id: 'fugenduell-patenschaft',
    title: 'Beobachtungsposten mit Übergabe',
    titleEn: 'Observation Post with Handover',
    oneLinerDe: 'Eine Patenschaft, die niemand mehr ausübt, sagt der Nachbarschaft weiterhin „für diesen Baum ist gesorgt". Dieser Posten soll stattdessen sichtbar altern, frei werden und nachbesetzt werden können, ohne dass die Messreihe abreißt.',
    oneLinerEn: 'An adoption nobody acts on still tells the neighbourhood "this tree is being cared for". Instead, the post should visibly age, fall vacant and be taken over — without breaking the observation series.',
    date: '21. September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'CityLAB Berlin / Technologiestiftung (Gieß den Kiez) · nachrangig: GLOBE Niederlande (GrowApp), USA-NPN (Nature\'s Notebook)',
    recipientsEn: 'CityLAB Berlin / Technologiestiftung (the tree-watering platform) · secondary: GLOBE Netherlands (GrowApp), USA-NPN (Nature\'s Notebook)',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Berlin', 'Ehrenamt', 'Phänologie', 'Open Source', 'Zeitreihe', 'Übergabe'],
    problemDe: 'Gieß den Kiez lässt Menschen einen einzelnen Straßenbaum adoptieren, damit die Nachbarschaft weiß, dass für ihn gesorgt wird. Diese Zusage wird nie zurückgenommen: Im Quellcode gibt es genau zwei Operationen, adoptTree und unadoptTree, und die zweite muss die Patin selbst auslösen. Kein Ablauf, keine Inaktivitätsprüfung, keine Übergabe. Wer wegzieht, krank wird oder das Interesse verliert, hinterlässt einen Baum, der als versorgt markiert ist und es nicht mehr ist — je länger das Projekt läuft, desto mehr solcher Marken sammeln sich an. Dasselbe Muster kostet die Wissenschaft eine Ebene höher ihre wertvollsten Daten: Bei GrowApp und Nature\'s Notebook hängt die Beobachtungsreihe am Konto, und wer denselben Baum später fotografiert, beginnt bei Bild 1.',
    problemEn: 'The Berlin tree platform lets people adopt a single street tree so the neighbourhood knows it is being cared for. That promise is never withdrawn: the source code has exactly two operations, adopt and unadopt, and the second must be triggered by the adopter. No expiry, no inactivity check, no handover. Anyone who moves away, falls ill or loses interest leaves behind a tree marked as cared for that no longer is — and the longer the project runs, the more such markers accumulate. One level up, the same pattern costs science its most valuable data: in phenology apps the observation series is tied to the account, so whoever photographs the same tree later starts at image one.',
    whyNowDe: [
      'Bildregistrierung ist Bibliothekscode: das vorige Foto halbtransparent einblenden und den Standpunkt wiederfinden, macht GrowApp heute schon. Was fehlt, ist nur, dass das Overlay einer anderen Person gehören darf.',
      'Individuum-Segmentierung läuft on-device — nicht „welche Art", sondern „dieselbe Pflanze wie auf Bild 1". 2022 war das noch ein Forschungsprojekt.',
      'Der Alterungs-Teil braucht gar keine KI: Bei Gieß den Kiez sind die Gießvorgänge bereits mit Zeitstempel erfasst; das Signal liegt in der Datenbank und wird nur nicht ausgewertet.'
    ],
    whyNowEn: [
      'Image registration is library code: showing the previous photo semi-transparently to find the vantage point is already done by existing phenology apps. What is missing is only that the overlay may belong to someone else.',
      'Individual-level segmentation runs on device — not "which species" but "the same plant as in image one". In 2022 that was still a research project.',
      'The ageing part needs no AI at all: watering events already carry timestamps; the signal is in the database and simply is not evaluated.'
    ],
    sketchDe: 'Der Posten ist das Objekt, nicht der Mensch: ein Baum, ein Standpunkt, ein Aufnahmerezept aus Höhe, Blickrichtung und Referenzobjekt im Bild. Der Zustand am Posten ist öffentlich sichtbar und wandert von betreut über überfällig zu sucht Nachfolge; die Schwelle kommt aus der Sache — Gießintervall in der Hitzeperiode, phänologisches Fenster der Art —, nicht aus einer runden Zahl. Wer einen Posten übernimmt, bekommt die letzte Aufnahme als Overlay und liefert einen Treffer, der Standpunkt und Individuum bestätigt; dann läuft die Reihe ohne Bruch weiter. Die Historie gehört dem Posten: Wer aufhört, verliert die Rolle, nicht die Beobachtungen. Nicht dabei: kein Wettbewerb um Posten, kein Duell, kein Entreißen aktiver Patenschaften, kein Ranking zwischen Menschen, keine neue App.',
    sketchEn: 'The post is the object, not the person: one tree, one vantage point, one recipe of height, bearing and a reference object in frame. The state of the post is publicly visible and moves from tended through overdue to seeking successor; the threshold comes from the matter itself — watering intervals in a heatwave, the species\' phenological window — not from a round number. Whoever takes over a post receives the last image as an overlay and supplies a match confirming both vantage point and individual; the series then continues unbroken. The history belongs to the post: quitting costs the role, not the observations. Not included: competition for posts, duels, seizing active adoptions, rankings between people, or a new app.',
    firstStepDe: {
      ticket: 'Ein Posten wechselt die Person, die Reihe bricht nicht.',
      criteria: 'Fertig, wenn der Export vier Aufnahmen als eine Zeitreihe ausgibt, mit korrekter Zuordnung wer wann — und ohne Bruch an der Übergabestelle. Für Gieß den Kiez gibt es einen kleineren Vorlauf ohne jede KI: dem Adoptionsmarker ein Alter geben und ihn auf der Karte altern lassen; die Gießdaten dafür liegen vor.'
    },
    firstStepEn: {
      ticket: 'One post changes hands, and the series does not break.',
      criteria: 'Done when the export yields four images as one time series, correctly attributed to who took what when, with no break at the handover. For the tree platform there is a smaller precursor with no AI at all: give the adoption marker an age and let it visibly age on the map; the watering data is already there.'
    },
    failureModeDe: 'Wenn der Marker das falsche Objekt ist: Die Adoption ist nicht exklusiv, mehrere Menschen können denselben Baum adoptieren. Ein Verfall pro Person ist dann sinnlos — altern muss die Versorgung des Baums, nicht das Lesezeichen des Menschen. Wenn Verfall wie eine Drohung wirkt, vertreibt er genau die Leute, die man halten will; der Zustand gehört an den Posten und neutral formuliert, nie an den Menschen. Und Nachbesetzung lohnt nur, wo die Reihe ein Ziel hat — ohne abnehmende Stelle ist das Buchhaltung.',
    failureModeEn: 'If the marker is the wrong object: adoption is not exclusive, several people can adopt the same tree. Expiry per person is then meaningless — what must age is the tree\'s care, not a person\'s bookmark. If expiry reads as a threat, it drives away exactly the people worth keeping; the state belongs on the post and must be phrased neutrally, never on the person. And handover only pays where the series has a destination — without one it is bookkeeping.',
    priorArtDe: 'Gieß den Kiez ist quelloffen und wurde im Quellcode geprüft: Der Adoptions-Store kennt adoptTree, unadoptTree und refreshIsTreeAdoptedByOthers, sonst nichts; kein Treffer für Ablauf, Inaktivität, Übertragung oder Verwaisung. Nature\'s Notebook kennt eine Übergabe, aber auf Gruppen- und Programmebene, als Verwaltungsakt, und sie setzt voraus, dass die scheidende Person vorher handelt — genau der Fall, um den es hier geht, ist nicht abgedeckt. GrowApp deckt den Zeitraffer vollständig ab, die Reihe hängt am Konto. Die Wettbewerbsmechanik aus dem ursprünglichen Brainstorm ist in Standortspielen ausgereift, gehört dort aber zu virtuellen Objekten, die niemandem etwas schulden.',
    priorArtEn: 'The Berlin platform is open source and was checked in code: the adoption store knows adopt, unadopt and a check for adoption by others, and nothing else; no match for expiry, inactivity, transfer or orphaning. Nature\'s Notebook does know a handover, but at group and programme level, as an administrative act, and it assumes the departing person acts beforehand — precisely the case at issue here is not covered. GrowApp fully covers the time-lapse, with the series tied to the account. The competitive mechanic from the original brainstorm is mature in location-based games, but there it attaches to virtual objects that owe nobody anything.'
  },
  {
    id: 'lebendes-spielobjekt',
    title: 'Das lebende Spielobjekt',
    titleEn: 'The Living Game Object',
    oneLinerDe: 'Ein Standortspiel, in dem das umkämpfte Objekt kein Portal und keine Arena ist, sondern eine echte Pflanze an einer echten Fuge — die zwischen zwei Runden erfrieren, weggekehrt oder ausgerissen werden kann, und dann weg ist.',
    oneLinerEn: 'A location-based game in which the contested object is neither a portal nor a gym but a real plant in a real pavement crack — one that can freeze, be swept away or pulled out between two rounds, and then is gone.',
    date: '21. September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'Pl@ntNet und The Plant Game (INRIA, Cirad, IRD — sie haben den Duell-Modus bereits) · nachrangig: Play Curious, MMOS, Scientific Game Jam',
    recipientsEn: 'Pl@ntNet and The Plant Game (INRIA, Cirad, IRD — they already have a duel mode) · secondary: Play Curious, MMOS, Scientific Game Jam',
    domain: 'creative',
    verdict: 'build_first',
    status: 'gepackt',
    tags: ['Spiel', 'Standortspiel', 'Stadtnatur', 'Instanzsegmentierung', 'Merkmalsdaten'],
    problemDe: 'Standortbasierte Spiele haben ein Objektproblem, über das niemand spricht: Ihre Welt ist kuratiert. Arenen, Portale und Places sind Einträge in einer Datenbank, die an Briefkästen und Wandbildern hängen. Sie bewegen sich nicht, wachsen nicht, sterben nicht. Gleichzeitig gibt es Spiele über echte Pflanzen, die in einer gebauten Welt spielen. Dazwischen liegt eine leere Kategorie: ein Spielobjekt, das existiert, ob gespielt wird oder nicht. Eine Mauerraute in einer Fuge ist seit achtzig Jahren da; ein Löwenzahn überlebt den Winter oder nicht. Das kehrt die Grundannahme des Genres um — der Spielstand ist nicht mehr autoritativ.',
    problemEn: 'Location-based games have an object problem nobody talks about: their world is curated. Gyms, portals and places are database rows pinned to postboxes and murals. They do not move, grow or die. Meanwhile there are games about real plants that play out in a built world. Between the two lies an empty category: a game object that exists whether or not anyone plays. A wall fern in a joint has been there for eighty years; a dandelion survives the winter or does not. That inverts the genre\'s basic assumption — the save file is no longer authoritative.',
    whyNowDe: [
      'Individuum-Wiedererkennung statt Artbestimmung: nicht „das ist Taraxacum officinale", sondern „das ist dieselbe Pflanze wie auf dem Foto von vorgestern, aufgenommen von jemand anderem". Instanzsegmentierung plus Merkmalsabgleich auf dem Gerät — der eine Teil, den es vor zwei Jahren nicht gab.',
      'Artbestimmung ist gratis geworden und muss nicht gebaut werden; Pl@ntNet und Flora Incognita liefern sie per Schnittstelle.',
      'Die Werte müssen nicht erfunden werden: Merkmalsdatenbanken wie TRY, LEDA und StrateFy liefern die Stats. Das ist keine KI, sondern Fleißarbeit — aber es heißt, dass die Balance aus der Ökologie kommt statt aus dem Bauchgefühl.'
    ],
    whyNowEn: [
      'Individual re-identification rather than species identification: not "this is Taraxacum officinale" but "this is the same plant as in the photo from the day before yesterday, taken by someone else". Instance segmentation plus feature matching on device — the one part that did not exist two years ago.',
      'Species identification has become free and need not be built; existing platforms provide it through an API.',
      'The stats need not be invented: plant trait databases supply them. That is not AI but legwork — and it means the balance comes from ecology rather than from a hunch.'
    ],
    sketchDe: 'Das Objekt ist die Pflanze, nicht der Ort: ein Individuum an einer Fuge, wiedererkennbar am Foto, mit Stats aus den Merkmalsdaten seiner Art und Modifikatoren aus seinem Standort — Trittlast, Substrat, Salz im Winter. Beansprucht und verteidigt wird wie im Genre üblich, aber gegen andere Menschen um ein Ding, das keinem gehört. Die Saison ist der Gegner, nicht der Mitspieler: Ereignisse kommen aus echtem Wetter und echtem Stadtbetrieb. Tod ist echt — verschwindet die Pflanze, verschwindet das Objekt, und was bleibt, ist die Historie. Die Invariante, ohne die es nicht gebaut werden darf: Kein Punkt wechselt je den Besitzer, weil eine Pflanze fehlt.',
    sketchEn: 'The object is the plant, not the place: an individual in a joint, recognisable from the photo, with stats from its species\' trait data and modifiers from its location — trampling, substrate, road salt in winter. Claiming and defending work as the genre does, but between people over a thing nobody owns. The season is the opponent, not the other player: events come from real weather and real municipal operations. Death is real — if the plant disappears, the object disappears, and what remains is the history. The invariant without which it must not be built: no point ever changes hands because a plant is missing.',
    firstStepDe: {
      ticket: 'Das lauffähige Skelett, ohne das die Idee nach Regel 4 keine Gabe wäre.',
      criteria: 'Die Zerstörungs-Invariante ist der Kern: Gekämpft wird mit einer Samenkarte, die beim Dokumentieren gezogen wird; das Individuum bleibt ortsgebunden und unhandelbar. Abwesenheit löst nichts aus — verschwindet ein umstrittenes Objekt während eines Streits, ist der Streit ungültig. Die Stelle hat einen Wert, der mit der Artenvielfalt dort steigt, sodass Ausreißen den eigenen Multiplikator senkt. Fertig, wenn diese vier Festlegungen im Prototyp nachweislich greifen.'
    },
    firstStepEn: {
      ticket: 'The runnable skeleton, without which the idea would not be a gift under rule four.',
      criteria: 'The destruction invariant is the core: duels are fought with a seed card drawn when documenting; the individual stays place-bound and untradeable. Absence triggers nothing — if a contested object disappears mid-dispute, the dispute is void. The location carries a value that rises with the diversity of species there, so pulling a plant lowers your own multiplier. Done when those four rules demonstrably hold in the prototype.'
    },
    failureModeDe: 'Ein Spiel über Stadtnatur, in dem Ausreißen ein Gewinnzug ist, ist schlechter als kein Spiel. Der Anreiz entsteht nicht aus Bosheit, sondern aus der Struktur: Zerstörung erzeugt einen Zustand, der von natürlichem Tod nicht unterscheidbar ist, nichts kostet und dem Täter nützt. Die üblichen Pflaster greifen daneben — „Historie verfällt" bestraft das Opfer, „Punkte fürs Halten" übersieht, dass der Angreifer keine Punkte nimmt, sondern den fremden Ertrag abstellt.',
    failureModeEn: 'A game about urban nature in which uprooting is a winning move is worse than no game. The incentive comes not from malice but from structure: destruction produces a state indistinguishable from natural death, costs nothing and benefits the perpetrator. The usual patches miss — expiring history punishes the victim, and points for holding overlook that the attacker takes no points but switches off someone else\'s yield.',
    priorArtDe: 'Out and About (2026) ist Cozy-Foraging über echte Pflanzenarten, Einzelspieler in gebauter Welt — „Spiel über echte Pflanzen" ist damit besetzt und allein kein Pitch mehr. Niche baut echte Mendel-Genetik als Kernmechanik und beweist das Muster „echte Wissenschaft als Spielsystem", nimmt ihm aber die Neuheit. Pokémon GO, Ingress und Munzee Places haben Inbesitznahme und Verteidigung seit Jahren ausgereift — an kuratierten, virtuellen Objekten ohne Lebensdauer. Frei bleibt das Objekt, das ohne das Spiel existiert und ohne das Spiel stirbt.',
    priorArtEn: 'Out and About (2026) is cozy foraging over real plant species, single player in a built world — "a game about real plants" is therefore taken and no longer a pitch by itself. Niche builds real Mendelian genetics into its core loop and proves the pattern of real science as a game system while removing its novelty. Pokémon GO, Ingress and Munzee have had claiming and defending mature for years — on curated virtual objects with no lifespan. What remains free is the object that exists without the game and dies without it.'
  },
  {
    id: 'sperrmuell-weiche',
    title: 'Sperrmüll-Weiche',
    titleEn: 'Bulky Waste Switch',
    oneLinerDe: 'Bei der Sperrmüll-Buchung entscheidet ein Foto, ob der Sessel in den Ofen oder in die NochMall fährt — und der Preis der Abholung folgt dieser Entscheidung, statt ihr zu widersprechen.',
    oneLinerEn: 'When booking a bulky-waste pickup, a photo decides whether the armchair goes to the incinerator or to the reuse store — and the pickup price follows that decision instead of contradicting it.',
    date: '23. September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'BSR — besitzt beide Enden der Weiche (Sperrmüllabholung und NochMall) · Domänenpartner: Re-Use Berlin / Zero-Waste-Agentur (SenUVK) · nicht CityLAB (dort liegt seit 20.09. eine Mail)',
    recipientsEn: 'BSR (Berlin city cleaning) — owns both ends of the switch (bulky-waste pickup and the NochMall reuse store) · domain partner: Re-Use Berlin / Zero Waste Agency · not CityLAB (a mail has been there since 20 Sept)',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Berlin', 'Kreislaufwirtschaft', 'Gebührenwerk', 'Wiederverwendung', 'Foto-Triage'],
    problemDe: 'In Berlin kostet es Geld, einen Schrank loszuwerden — und auch Geld, ihn zu verschenken. Sperrmüllabholung 100 € (96 € Express, 50 € ab Tag 16), Recyclinghof kostenlos, aber nur mit Auto, NochMall-Abholservice kostenpflichtig, die Straße kostet nichts. Die Preisleiter ist falsch herum gebaut: Der einzige kostenlose, sofort verfügbare Weg ohne Auto ist der, der die Stadt über 13 Millionen Euro im Jahr kostet. Das UBA sagt dazu: Der Gewinn liegt nicht in besserer Sortiertechnik, sondern in Wiederverwendung.',
    problemEn: 'In Berlin it costs money to get rid of a wardrobe — and it also costs money to give it away. Bulky-waste pickup €100 (€96 express, €50 from day 16), recycling yard free but only by car, the reuse store\'s pickup service charges, the street costs nothing. The price ladder is upside down: the only free, immediate option without a car is the one that costs the city more than €13 million a year. The Federal Environment Agency adds: the gain lies not in better sorting technology but in reuse.',
    whyNowDe: [
      'Foto → Zustand und Wiederverkaufswert ist 2026 Massenware (Vondi, ReSell AI, Cluzy) — ausnahmslos für Verkäufer. Am Anfang einer Entsorgungsbuchung beantwortet dieselbe Schätzung die Frage, ob das Ding überhaupt in den Lkw muss.',
      'Damit wandert die Triage vor den Transport. Somerset × British Heart Foundation (Mai 2026) sortiert erst im Depot, nach der Abholung.',
      'Die BSR betreibt Sperrmüllabholung und NochMall samt Abholservice mit Fotoupload. Es fehlt kein Partner, kein Lkw, kein Lager — nur die Verbindung zwischen zwei Formularen desselben Betriebs.'
    ],
    whyNowEn: [
      'Photo → condition and resale value is a commodity in 2026 (Vondi, ReSell AI, Cluzy) — all of it for sellers. Placed at the start of a disposal booking, the same estimate answers whether the item needs to go in the truck at all.',
      'That moves triage before transport. Somerset × British Heart Foundation (May 2026) sorts only at the depot, after collection.',
      'BSR runs both the bulky-waste pickup and the NochMall with its own photo-upload pickup service. No partner, truck or warehouse is missing — only the link between two forms of the same operator.'
    ],
    sketchDe: 'Bei der Buchung Fotos plus zwei Fragen (funktioniert es, darf es weitergegeben werden). Das Modell schätzt keinen Preis, sondern stellt eine dreistufige Weiche: Wiederverkauf · Verschenken · Entsorgung. Der Tarif folgt der Weiche — geht der Gegenstand in die Wiederverwendung, wird die Abholung billiger oder kostenlos. Rückmeldung: „Ihr Sessel steht seit Dienstag in der NochMall." Kein Marktplatz, keine Preisschätzung für Private, keine Historie über Haushalte.',
    sketchEn: 'At booking time: photos plus two questions (does it work, may it be passed on). The model estimates no price; it sets a three-way switch: resale · give away · disposal. The tariff follows the switch — if the item goes to reuse, the pickup gets cheaper or free. Feedback: "Your armchair has been in the NochMall since Tuesday." No marketplace, no price estimates for private people, no history per household.',
    firstStepDe: {
      ticket: 'Ein Monat Buchungen, zwei Fotos, ein Mensch — bevor eine Zeile Modellcode entsteht.',
      criteria: '200 zurückliegende Sperrmüll-Buchungen mit Fotos von einem NochMall-Ankäufer nachträglich bewerten lassen: Wie viel Prozent wäre verkaufsfähig gewesen? Fertig, wenn eine belastbare Quote dasteht. Über zehn Prozent rechtfertigt alles Weitere; darunter ist die Idee tot und hat zwei Wochen gekostet statt zwei Jahren.'
    },
    firstStepEn: {
      ticket: 'One month of bookings, two photos, one person — before a single line of model code.',
      criteria: 'Have a NochMall buyer rate 200 past bulky-waste bookings with photos after the fact: what share would have been sellable? Done when a solid rate exists. Above ten percent justifies everything else; below it the idea is dead and cost two weeks instead of two years.'
    },
    failureModeDe: 'Die Quote könnte klein sein — rund 30 % des Sperrmülls sind Polster, Matratzen und Teppiche, meist nicht wiederverwendbar. Der Fehlanreiz ist eingebaut: Wer Rabatt will, nennt jeden Schrank „wie neu"; die Weiche darf nur Vorschlag sein. Die Fotos dürfen die Buchung nicht überleben. Und die ehrliche Grenze: Die Weiche senkt die 13 Millionen nicht — wer illegal ablagert, bucht gar nicht.',
    failureModeEn: 'The rate may be small — about 30 % of bulky waste is upholstery, mattresses and carpets, mostly not reusable. The perverse incentive is built in: anyone wanting a discount calls every wardrobe "as new"; the switch may only suggest. Photos must not outlive the booking. And the honest limit: the switch does not reduce the €13 million — people who dump illegally never book.',
    priorArtDe: 'Großbritannien hat das Verfahren ohne die Technik: Somerset Council × British Heart Foundation (Mai 2026), Worcestershire, Bridgwater — Bewertung erst im Depot nach der Abholung. Berlin hat beide Hälften, unverbunden: NochMall-Abholservice mit Formular, Fotoupload und Angebot binnen 48 h, getrennt von der Sperrmüllbuchung. „Foto → Wert" ist dicht, aber verkäuferseitig; KI + Abfall ist dicht, aber stromabwärts (Sortieranlagen). Die Nachfrageseite (Wanted/ISO bei Olio, Freecycle, Buy Nothing) ist besetzt.',
    priorArtEn: 'The UK has the procedure without the technology: Somerset Council × British Heart Foundation (May 2026), Worcestershire, Bridgwater — assessment only at the depot after collection. Berlin has both halves, unconnected: the NochMall pickup service with form, photo upload and an offer within 48 h, separate from the bulky-waste booking. "Photo → value" is crowded but seller-side; AI + waste is crowded but downstream (sorting plants). The demand side (Wanted/ISO on Olio, Freecycle, Buy Nothing) is taken.'
  },
  {
    id: 'bruchlesen',
    title: 'Bruchlesen',
    titleEn: 'Reading Fractures',
    oneLinerDe: 'Ein Übungsgerät für Fraktografie, das Bruchflächen mit exakt bekannter Ursache in beliebiger Zahl erzeugt — Streiflicht drehen, Ursprung zeigen, Spiegelradius und Last schätzen, und danach läuft der Riss rückwärts ab.',
    oneLinerEn: 'A practice tool for fractography that generates fracture surfaces with exactly known causes in any number — turn the raking light, point at the origin, estimate mirror radius and load, then watch the crack run backwards.',
    date: '23. September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'AG Fraktographie von DGM und DVM an der BAM (Dr.-Ing. Dirk Bettge; FractoDB, Kurs Fraktographie) · nachrangig: HVG-DGG, Glas- und Keramikrestaurierung, forensische Glasanalyse',
    recipientsEn: 'Fractography working group of DGM and DVM at BAM (Dr.-Ing. Dirk Bettge; FractoDB, fractography course) · secondary: HVG-DGG (glass industry), glass and ceramics conservation, forensic glass analysis',
    domain: 'physics',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Fraktografie', 'Peridynamik', 'Ausbildung', 'Glas', 'Simulation', 'Bisoziation'],
    problemDe: 'Bruchflächen lesen lernt man am echten Stück, und davon gibt es zu wenige mit sicher bekannter Ursache. Die Norm nennt das Verfahren selbst „qualitative, judgment-based", Anfänger verlieren viel Zeit mit der Ursprungssuche. Die Musterlösung ist bei Schadensfällen eine Deutung, nicht die Wahrheit, und jede Sammlung ist endlich: Eine systematische Variation — derselbe Bruch mit tieferem Fehler oder höherer Last — gibt es physisch nicht. FractoDB, die Referenzdatenbank der AG Fraktographie, ist zum Nachschlagen da, nicht zum Üben.',
    problemEn: 'Fracture surfaces are learned on real specimens, and too few of them have a securely known cause. The standard itself calls the method "qualitative, judgment-based"; novices lose much time searching for the origin. For failure cases the model answer is an interpretation, not the truth, and every collection is finite: a systematic variation — the same fracture with a deeper flaw or higher load — does not exist physically. FractoDB, the working group\'s reference database, is for looking things up, not for practice.',
    whyNowDe: [
      'Peridynamik reproduziert Verzweigung, den Übergang Spiegel–Nebel–Rauhigkeit, Rissablenkung und Möwenflügel-Muster; der Übergangsradius sinkt mit der Spannung wie im Experiment (Silling, Bobaru, Wang 2015). Heute auf einer Grafikkarte machbar.',
      'Ursprung, Last, Fehlergröße und Rissgeschwindigkeit liegen im Solver ohnehin vor. Die Musterlösung muss nicht erschlossen werden, sie wird mitprotokolliert.',
      'Das Bewertungsschema ist genormt (ASTM C1322 für Merkmale, C1678 für Spiegelradius → Bruchspannung).'
    ],
    whyNowEn: [
      'Peridynamics reproduces branching, the mirror–mist–hackle transition, crack deflection and gull-wing patterns; the transition radius falls with stress as in experiments (Silling, Bobaru, Wang 2015). Feasible on a GPU today.',
      'Origin, load, flaw size and crack speed are already in the solver. The model answer need not be inferred — it is logged.',
      'The scoring scheme is standardised (ASTM C1322 for features, C1678 for mirror radius → fracture stress).'
    ],
    sketchDe: 'Eine simulierte Bruchfläche (zuerst Glasstab und -platte unter Biegung) mit frei drehbarem Streiflicht. Drei Antworten: Ursprung, Spiegelradius, Lastart. Auflösung: Der Riss läuft vom wahren Ursprung ab, dein Klick bleibt stehen, C1678 rechnet die Spannung. Schwierigkeit über die Fälle, die die Norm als schwer nennt. Jede Stufe mischt blind echte Belegstücke unter. Spielmodus „Einer bricht, einer liest": Rezept als Seed verschicken. Keine Zertifizierung, kein Gutachten-Export, keine automatische Bewertung echter Stücke.',
    sketchEn: 'A simulated fracture surface (first glass rod and plate in bending) with freely rotatable raking light. Three answers: origin, mirror radius, load type. Reveal: the crack runs from the true origin, your click stays put, C1678 computes the stress. Difficulty follows the cases the standard calls hard. Every level blindly mixes in real specimens. Game mode "one breaks, one reads": send the recipe as a seed. No certification, no report export, no automatic assessment of real specimens.',
    firstStepDe: {
      ticket: 'Ein Glasstab, eine Biegung, ein Ursprung, ein Streiflichtregler.',
      criteria: 'Peridynamik-Lauf für einen Glasstab im Vierpunktbiegeversuch mit Oberflächenfehler an bekannter Stelle, Oberfläche im Browser mit drehbarem Streiflicht rendern. Fertig, wenn drei Fraktografie-Kundige den Ursprung jeweils innerhalb eines Spiegelradius finden und drei Laien deutlich daneben liegen.'
    },
    firstStepEn: {
      ticket: 'One glass rod, one bend, one origin, one raking-light slider.',
      criteria: 'Peridynamics run of a glass rod in four-point bending with a surface flaw at a known location, surface rendered in the browser with rotatable raking light. Done when three people who know fractography each find the origin within one mirror radius and three laypeople clearly miss.'
    },
    failureModeDe: 'Der wahrscheinlichste Ausgang: Das Gerät trainiert die Handschrift des Lösers statt des Materials — Peridynamik überschätzt die Grenzgeschwindigkeit des Risses. Gegenmittel sind die blind untergemischten echten Stücke. Zweitens: Die AG Fraktographie kommt aus der Metallfraktografie, gut simulierbar sind heute die Merkmale spröder Werkstoffe; sieht die AG Glas nicht als ihr Thema, geht die Dose an HVG-DGG oder die Restaurierung. Drittens: ASTM-Normen sind kostenpflichtig, das Gerät wendet das Schema an, liefert den Text nicht mit.',
    failureModeEn: 'The most likely outcome: the tool trains the solver\'s handwriting instead of the material — peridynamics overestimates the limiting crack speed. The antidote is the blindly mixed real specimens. Second: the working group comes from metal fractography, while today the brittle-material features are what simulates well; if the group does not see glass as its topic, the tin goes to the glass industry association or to conservation. Third: ASTM standards are paid; the tool applies the scheme but does not ship the text.',
    priorArtDe: 'FractoDB (AG Fraktographie, BAM/DGM, seit 2013): tausende reale Bruchflächenbilder, kostenlos auf Anfrage — Referenz, nicht Übung. Ausbildung nur in Präsenz am Belegstück: Gerresheimer, American Glass Research, ASM, OSAC 2023-N-0005, DGM-Kurs Berlin 2027. Simulation der Merkmale als Forschung ohne Lernbezug (Sandia/Nebraska 2015). Software, die selbst liest (DINOv2-REM-Fraktografie 2026, unüberwachtes Lernen 2021) — das Gegenteil: Dort verschwindet der Mensch aus dem Urteil.',
    priorArtEn: 'FractoDB (fractography working group, BAM/DGM, since 2013): thousands of real fracture images, free on request — reference, not practice. Training only in person on specimens: Gerresheimer, American Glass Research, ASM, OSAC 2023-N-0005, DGM course Berlin 2027. Simulation of the features as research without a learning angle (Sandia/Nebraska 2015). Software that reads by itself (DINOv2 SEM fractography 2026, unsupervised learning 2021) — the opposite: there the human leaves the judgement.'
  },
  {
    id: 'tischschiedsrichter',
    title: 'TischSchiedsrichter',
    titleEn: 'Dinner Table Referee',
    oneLinerDe: 'Handy in die Tischmitte, Wortliste gemeinsam beschließen — fällt ein Reizwort, pfeift es und zeigt Gelb, beim zweiten Mal Rot und ein neues Thema. Erkannt wird nur auf dem Gerät, nie in der Cloud.',
    oneLinerEn: 'Phone in the middle of the table, agree on a word list together — when a trigger word falls it whistles and shows yellow, the second time red and a new topic. Recognition only on the device, never in the cloud.',
    date: '24. September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'Die Öffentlichkeit — mit lauffähigem Skelett (Manifest, Regel 4 und Empfängertabelle, letzte Zeile) · Kanal: Blogbeitrag oder Show HN vor dem 1. Advent 2026 · Sammeltalk „Ideen, die ich nicht baue" (FOSDEM)',
    recipientsEn: 'The public — with a working skeleton (manifesto, rule 4 and recipient table, last row) · channel: blog post or Show HN before the first Sunday of Advent 2026 · collected talk "Ideas I won\'t build" (FOSDEM)',
    domain: 'audio',
    verdict: 'build_first',
    status: 'gepackt',
    tags: ['Spielzeug', 'Familie', 'Offline', 'Spracherkennung', 'Datenschutz', 'Weihnachten'],
    problemDe: 'Niemand will derjenige sein, der den Schwiegervater unterbricht. Wer beim Familienessen „bitte keine Politik" durchsetzt, ist der Böse; wer nichts sagt, erlebt denselben Streit wie letztes Jahr. Die Apps, die zuhören, verknüpfen Ton mit der Identität (Swearing Jar laut App-Store-Angabe) — am privaten Esstisch ein Ausschlussgrund.',
    problemEn: 'Nobody wants to be the one who interrupts the father-in-law. Whoever enforces "no politics, please" at a family dinner is the bad guy; whoever stays quiet sits through last year\'s argument again. The apps that listen link audio to identity (Swearing Jar per its App Store label) — a deal-breaker at a private table.',
    whyNowDe: [
      'Chrome erkennt Sprache seit Version 139 auf dem Gerät (Web Speech API, `processLocally`). Damit ist das Ganze eine Webseite: kein Server, keine App, kein Konto.',
      'Freie Wortlisten brauchen kein Training mehr: Open-Vocabulary-Keyword-Spotting (sherpa-onnx) oder eine eingeschränkte Offline-Erkennung genügen.',
      'Ehrlich: Neu ist das nicht erst durch KI. Noche de Paz lief 2015 als Werbe-App, JarGone 2018 als Gerät. Neu ist, dass es ohne Cloud und ohne Installation geht.'
    ],
    whyNowEn: [
      'Since version 139 Chrome recognises speech on the device (Web Speech API, `processLocally`). That makes the whole thing a web page: no server, no app, no account.',
      'Free word lists no longer need training: open-vocabulary keyword spotting (sherpa-onnx) or constrained offline recognition is enough.',
      'Honestly: this was not made possible by AI. Noche de Paz ran in 2015 as an ad-agency app, JarGone in 2018 as a device. What is new is doing it without a cloud and without installing anything.'
    ],
    sketchDe: 'Webseite, drei Schritte: Liste gemeinsam festlegen, Häkchen „alle wissen Bescheid", Anpfiff. Der Browser prüft vorher, ob er offline erkennen kann; wenn nicht, startet der Schiedsrichter nicht (kein Rückfall auf die Cloud). Treffer ab vier Buchstaben per Wortanfang („Partei" trifft „Parteitag"), acht Sekunden Abkühlzeit pro Wort, zweite Gelbe binnen zehn Minuten wird Rot mit Themenvorschlag. Gespeichert wird nichts; das Spielprotokoll hält nur Wort und Uhrzeit, bis die Seite zu ist. Läuft als Skelett in der Amélie-App (Tab „Sandboxes").',
    sketchEn: 'Web page, three steps: agree the list, tick "everyone knows", kick-off. The browser first checks whether it can recognise offline; if not, the referee does not start (no fallback to the cloud). Matches from four letters on by word prefix ("election" also hits "elections"), eight-second cooldown per word, a second yellow within ten minutes turns red with a topic suggestion. Nothing is stored; the match log holds only word and time until the page closes. Runs as a skeleton in the Amélie app (Sandboxes tab).',
    firstStepDe: {
      ticket: 'Skelett in echter Tischrunde testen: vier Personen, zehn Minuten Gespräch mit Liste, Erkennung offline in Chrome.',
      criteria: 'Mindestens 80 % der gesagten Listenwörter erkannt, höchstens zwei Fehlpfiffe; Netzwerk-Tab zeigt während des Spiels keinen Datenverkehr.'
    },
    firstStepEn: {
      ticket: 'Test the skeleton at a real table: four people, ten minutes of conversation with a list, offline recognition in Chrome.',
      criteria: 'At least 80 % of spoken list words detected, at most two false whistles; the network tab shows no traffic during play.'
    },
    failureModeDe: 'Fehlpfiffe. Im Stimmengewirr am Tisch trifft die Erkennung schlechter als am Schreibtisch, und im Deutschen erzwingen eingeschränkte Offline-Modelle gern Treffer (Vosk-Issue #1017). Wenn es beim ersten Essen dreimal falsch pfeift, liegt das Handy danach in der Schublade. Zweites Risiko: heimlich eingesetzt ist es Überwachung — deshalb ist die Einwilligung ein Schritt im Spiel, nicht eine Zeile im Kleingedruckten. Drittes: Offline-Erkennung gibt es derzeit nur in Chrome, und je nach Gerät erst nach einem Sprachpaket-Download.',
    failureModeEn: 'False whistles. In table chatter recognition is worse than at a desk, and constrained offline models tend to force matches in German (Vosk issue #1017). If it whistles wrongly three times at the first dinner, the phone ends up in a drawer. Second risk: used secretly it is surveillance — so consent is a step in the game, not a line in the small print. Third: offline recognition currently exists only in Chrome, sometimes after a language-pack download.',
    priorArtDe: 'Noche de Paz / SilentNight (Agentur Shackleton, 2015): Handy in die Tischmitte, feste Liste politischer Wörter, Alarm und Themenvorschlag — dasselbe Szenario, als Werbe-App. JarGone (Kickstarter 2018): Gerät mit frei eintragbaren Wörtern für die ganze Familie. Swearing Jar (App Store, 2025): eigene Wörter in Echtzeit, Gruppen — Audiodaten laut Store-Angabe mit der Identität verknüpft. Swear Jar 2.0 (itch.io) und mehrere GitHub-Bastelprojekte. Was dieser Dose bleibt: garantiert offline, Deutsch, freie Liste ohne Training, Gelb/Rot als Tischregel, Einwilligung als Spielzug. Prüfprotokoll Runde 9: `verengt` (dünn).',
    priorArtEn: 'Noche de Paz / SilentNight (Shackleton agency, 2015): phone in the middle of the table, fixed list of political words, alarm and topic suggestion — the same scenario, as an ad app. JarGone (Kickstarter 2018): a device with freely entered words for the whole family. Swearing Jar (App Store, 2025): custom words in real time, groups — audio linked to identity per its store label. Swear Jar 2.0 (itch.io) and several GitHub hobby projects. What remains for this tin: guaranteed offline, German, free list without training, yellow/red as a table rule, consent as a move in the game. Check log round 9: narrowed (thin).'
  },
  {
    id: 'chaos-clock',
    title: 'Chaos Clock',
    titleEn: 'Chaos Clock',
    oneLinerDe: 'Ein Google-Kalender-Add-on, das aus Zustand und Absicht einen Fokusmodus, eine Dauer und einen freien Platz würfelt, das Ergebnis als echten Termin einträgt — und je nach Chaos-Regler kleine, abschaltbare Streiche im Kalender spielt. Kein Server, keine KI, alle Daten im eigenen Google-Konto.',
    oneLinerEn: 'A Google Calendar add-on that rolls a focus mode, a duration and a free slot from your state and intent, puts the result in as a real event — and, depending on a chaos dial, plays small tricks on your calendar that you can switch off one by one. No server, no AI, all data in your own Google account.',
    date: '24. September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'Katta Spiel, HCI-Gruppe der TU Wien (ERC ACCESSTECH, 2024–2029) — als Forschungssonde, mit Code · nachrangig: Eva Hornecker (Bauhaus-Universität Weimar, Mitautorin derselben CHI-Studie) · danach die Öffentlichkeit (Show HN)',
    recipientsEn: 'Katta Spiel, HCI group at TU Wien (ERC ACCESSTECH, 2024–2029) — as a research probe, with code · secondary: Eva Hornecker (Bauhaus-Universität Weimar, co-author of the same CHI study) · then the public (Show HN)',
    domain: 'tools',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Kalender', 'ADHS', 'Spielzeug', 'Datenschutz', 'Google Workspace', 'Forschungssonde', 'Code liegt bei'],
    problemDe: 'Wer mit ADHS oder schlicht leerem Akku vor dem eigenen Kalender sitzt, liest ihn als Vorwurf: Jeder Block ist ein Versprechen, das man gleich bricht. Die Werkzeuge dagegen wollen fast alle dasselbe — die Person an die Norm anpassen, mit Streaks, Punkten und Nutzungsdaten. Die Literaturstudie „ADHD and Technology Research – Investigated by Neurodivergent Readers" (CHI 2022) fand genau das: ADHS-Technik zielt überwiegend darauf, Eigenschaften zu mildern, die neurotypische Verhaltensnormen stören, und Betroffene gestalten fast nie mit.',
    problemEn: 'Anyone with ADHD, or simply an empty battery, who looks at their own calendar reads it as an accusation: every block is a promise about to be broken. The tools on offer nearly all want the same thing — to adjust the person to the norm, with streaks, points and usage data. The literature review "ADHD and Technology Research – Investigated by Neurodivergent Readers" (CHI 2022) found exactly that: ADHD technology mostly aims to mitigate traits that disturb neurotypical norms, and the people concerned almost never co-design it.',
    whyNowDe: [
      'Ehrlich zuerst: Das fällt nicht unter die These des Manifests. Chaos Clock enthält keine KI, und Würfeln gegen Entscheidungslähmung ist alt (Würfelmethoden in ADHS-Blogs 2021, RandomTask). Die Uhr, die unberechenbar vorgeht, hat David Seah 2007 beschrieben.',
      'Neu ist der Ort: Ein Workspace-Add-on in Apps Script läuft ganz im Google-Konto der Nutzerin — Termine im eigenen Kalender, Verlauf in einer Tabelle im eigenen Drive, Einstellungen im Nutzerspeicher, keine Netzwerkaufrufe und keine Berechtigung dafür. Für eine Studie heißt das: Teilnehmende behalten ihre Daten und teilen die Tabelle nur, wenn sie wollen.',
      'Neu ist, dass es fertig ist: v0.5.2, 47 Tests grün in jeder Zeitzone, CC0. Verschenkt wird nicht die Idee, sondern der Code.'
    ],
    whyNowEn: [
      'Honesty first: this does not fall under the manifesto\'s thesis. Chaos Clock contains no AI, and rolling dice against decision paralysis is old (dice methods on ADHD blogs in 2021, RandomTask). The clock that runs unpredictably fast was described by David Seah in 2007.',
      'What is new is the place: a Workspace add-on in Apps Script runs entirely inside the user\'s Google account — events in their own calendar, history in a sheet in their own Drive, settings in per-user storage, no network calls and no permission for them. For a study that means participants keep their data and share the sheet only if they want to.',
      'What is new is that it exists: v0.5.2, 47 tests green in any time zone, CC0. What is given away is not the idea but the code.'
    ],
    sketchDe: 'Seitenleiste in Google Calendar mit fünf Feldern: Absicht (ein Satz), Energie 1–5, Fokus 1–5, verfügbare Minuten, Chaos 0–100. „Roll" wählt unter sechs Modi (Banish 2–5 min bis Gnosis 30–60 min) einen, den der Zustand zulässt — niedrige Energie würfelt nie Gnosis —, sucht den nächsten freien Platz und legt einen echten Termin an; der Termin ist der Timer. Danach Flow 1–5 eintragen. Der Chaos-Regler schaltet elf einzeln abschaltbare Streiche frei: Zeitdrift, Phantomtermine, Wiederauftauchen, wandernde Termine, der beleidigte Diener („Fine. I\'ll wait."), Termine in der Vergangenheit, Echos, Prophezeiung, Trickster-Wurf, Anti-Kalender-Tag, Sonntagsbeichte. Nicht dabei, mit Absicht: Streaks, Punkte, Countdown, Benachrichtigungen — alles, was die App öfter öffnen lässt. Code: github.com/felixinberlin/kaosclock (Apps Script, Jest).',
    sketchEn: 'A sidebar in Google Calendar with five fields: intent (one sentence), energy 1–5, focus 1–5, minutes available, chaos 0–100. "Roll" picks one of six modes (Banish 2–5 min up to Gnosis 30–60 min) that the state allows — low energy never rolls Gnosis —, finds the next free slot and creates a real event; the event is the timer. Afterwards, rate flow 1–5. The chaos dial unlocks eleven tricks, each switchable: time drift, phantom slots, resurfacing, wandering events, the reluctant servitor ("Fine. I\'ll wait."), events in the past, echoes, prophecy, trickster roll, anti-calendar day, Sunday confession. Deliberately absent: streaks, points, countdowns, notifications — anything that makes you open the app more. Code: github.com/felixinberlin/kaosclock (Apps Script, Jest).',
    firstStepDe: {
      ticket: 'Pilot mit fünf Personen, zwei Wochen: installieren (Testbereitstellung), täglich mindestens einmal würfeln, Chaos frei wählen; am Ende die eigene Tabelle „Chaos Clock Log" teilen oder nicht, und ein Gespräch über die Streiche.',
      criteria: 'Für jeden der elf Streiche liegt mindestens eine Aussage vor, ob er als Humor oder als Spott ankam — die Tonregel ist damit zum ersten Mal an Menschen geprüft, nicht am eigenen Schreibtisch.'
    },
    firstStepEn: {
      ticket: 'Pilot with five people for two weeks: install (test deployment), roll at least once a day, chaos level of their choice; at the end share their own "Chaos Clock Log" sheet or not, plus one conversation about the tricks.',
      criteria: 'For each of the eleven tricks there is at least one statement on whether it landed as humour or as mockery — the tone rule tested on people for the first time, not at one\'s own desk.'
    },
    failureModeDe: 'Ein Streich zu viel. Ein Termin in der Vergangenheit, ein Echo, eine Prophezeiung — für die eine ist das Humor, für den anderen das Gefühl, dass der eigene Kalender einen verspottet, und gerade die Leute mit dem meisten Kalenderstress haben dafür am wenigsten Puffer. Die Tonregel („wer es Freunden erzählt, lacht und will es sofort") ist bisher an niemandem geprüft. Zweitens: Ein Add-on, das selbstständig Termine in einen Arbeitskalender schreibt, kommt in vielen Firmen-Workspaces nicht an der Admin-Freigabe vorbei, und ohne Marketplace-Eintrag ist die Installation per clasp eine Hürde, die die Zielgruppe nicht nimmt. Drittens: Die Sprache der Chaosmagie zieht an und stößt ab — der Satz „es ist ein Kostüm" muss in der Oberfläche stehen, nicht nur im README.',
    failureModeEn: 'One trick too many. An event in the past, an echo, a prophecy — for one person that is humour, for another it is the feeling of being mocked by their own calendar, and the people with the most calendar stress have the least slack for it. The tone rule ("tell a friend, they laugh and want it") has not been tested on anyone yet. Second: an add-on that writes events into a work calendar on its own will not get past admin approval in many company Workspaces, and without a Marketplace listing, installing via clasp is a hurdle the target group will not clear. Third: chaos-magick vocabulary attracts and repels — "it is a costume" has to be said in the interface, not only in the README.',
    priorArtDe: 'Würfeln gegen Entscheidungslähmung ist besetzt: RandomTask (Web, Würfel wählt die Aufgabe, Pomodoro, Streaks, Pro-Abo), „Random Task Picker – ADHD Productivity Tool" (itch.io), Würfelmethoden in ADHS-Blogs seit 2021 — keins schreibt in den Kalender oder fragt nach dem Zustand. Planen nach Energie ist besetzt: Lifestack verteilt Aufgaben anhand von Wearable-Daten auf Hochphasen, Tiimo ist der visuelle Planer der Szene; beide optimieren, keins spielt. Sigil-Apps zur Chaosmagie gibt es mehrere (App Store, Google Play), alle ohne Kalender. Die unberechenbar vorgehende Uhr: David Seah, „A Chindogu Clock for Procrastinators" (2007), dort mit Hinweis auf ein Patent auf das Prinzip. Nicht gefunden: der Kalender selbst als Mitspieler — selbstständige, abschaltbare Streiche in den echten Terminen, ohne Server. Die Angabe „is_verified_novel: true" im Gemini-Datensatz ist damit zu stark; der „ADHMe"-Webring war nicht auffindbar, der „Apathetic Genius"-Webring existiert (Neocities, 2026 neu gestartet), ist aber ein Ring persönlicher Seiten, keine Adresse. Prüfprotokoll 24.09.2026: `verengt`.',
    priorArtEn: 'Rolling dice against decision paralysis is taken: RandomTask (web, the die picks the task, Pomodoro, streaks, Pro subscription), "Random Task Picker – ADHD Productivity Tool" (itch.io), dice methods on ADHD blogs since 2021 — none writes into the calendar or asks about your state. Planning by energy is taken: Lifestack places tasks in high-energy windows from wearable data, Tiimo is the scene\'s visual planner; both optimise, neither plays. There are several chaos-magick sigil apps (App Store, Google Play), none with a calendar. The unpredictably fast clock: David Seah, "A Chindogu Clock for Procrastinators" (2007), with a note about a patent on the principle. Not found: the calendar itself as a player — autonomous, switchable tricks in your real events, without a server. The Gemini dataset\'s "is_verified_novel: true" overstates this; the "ADHMe" webring could not be found, and the "Apathetic Genius" webring exists (Neocities, relaunched 2026) but is a ring of personal sites, not an address. Check log 24 Sep 2026: narrowed.',
    emailTemplate: {
      subjectDe: 'Idee zu verschenken: Chaos Clock — ein Kalender, der nicht erzieht',
      bodyDe: 'Hallo Katta Spiel,\n\nich recherchiere Software-Ideen und baue nur wenige davon selbst. Diese hier habe ich gebaut, und sie passt zu euch besser als zu mir, also schenke ich sie euch.\n\nIn „ADHD and Technology Research – Investigated by Neurodivergent Readers" (CHI 2022) zeigt ihr, dass ADHS-Technik fast immer Verhalten an eine Norm anpassen will. Chaos Clock ist ein Google-Kalender-Add-on, das es andersherum versucht: Es würfelt aus Energie und Absicht einen Termin und spielt dann kleine, abschaltbare Streiche im Kalender — ohne Streaks, ohne Punkte, ohne Server. Alle Daten bleiben im Google-Konto der Person, der Verlauf liegt in einer Tabelle in ihrem eigenen Drive. Als Sonde in einer Tagebuchstudie müsste also niemand Daten abgeben, der das nicht will.\n\nEine Seite mit Skizze, erstem Ticket und der Stelle, an der es schiefgeht, dazu Code und Tests:\n<Link zur Dose>\nhttps://github.com/felixinberlin/kaosclock\n\nCC0, keine Bedingungen. Wenn es nicht passt, einfach ignorieren — ich melde mich nicht nochmal.\n\nViele Grüße\nFélix\ngithub.com/felixinberlin',
      subjectEn: 'Free to take: Chaos Clock — a calendar that doesn\'t try to fix you',
      bodyEn: 'Hi Katta Spiel,\n\nI research software ideas and build only a few of them. I built this one, and it belongs with you more than with me, so it\'s yours.\n\nIn "ADHD and Technology Research – Investigated by Neurodivergent Readers" (CHI 2022) you show that ADHD technology nearly always tries to adjust behaviour to a norm. Chaos Clock is a Google Calendar add-on that tries the opposite: it rolls an event from energy and intent, then plays small, switchable tricks on the calendar — no streaks, no points, no server. All data stays in the person\'s Google account; the history is a sheet in their own Drive. As a probe in a diary study, nobody would have to hand over data they don\'t want to.\n\nOne page with the sketch, the first ticket and the part most likely to break it, plus code and tests:\n<link to the tin>\nhttps://github.com/felixinberlin/kaosclock\n\nCC0, no strings. If it doesn\'t fit, just ignore this — I won\'t follow up.\n\nFélix, Berlin\ngithub.com/felixinberlin',
      to: 'katta.spiel@tuwien.ac.at'
    }
  },
  {
    id: 'couleur-sphinx',
    title: 'Couleur-Sphinx',
    titleEn: 'Couleur-Sphinx: Air-Gapped S2S Intercom Gatekeeper',
    image: 'couleur-sphinx.png',
    imageAlt: 'Couleur-Sphinx 2.0: Air-Gapped S2S Klingel-Gatekeeper mit schlafendem Auge, Avatar und Relais',
    imageAspect: 1.778,
    oneLinerDe: 'Ein wetterfester, physisch isolierter S2S-Gatekeeper an der Haustür, der Couleurwissen prüft und bei Erfolg ausschließlich die interne Hausklingel betätigt — mit schlafendem Kamera-Auge, Consent-Taster und Human-in-the-Loop-Übernahme.',
    oneLinerEn: 'A weatherproof, air-gapped speech-to-speech gatekeeper at the door that quizzes visitors on student traditions, triggering only an internal bell via relay — featuring a mechanical sleeping eye, physical consent button, and human-in-the-loop takeover.',
    date: '24. September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'Türwachen (Chargierte) und technikaffine Füxe/Burschen von Berliner Studentenverbindungen · nachrangig: Hackerspaces & Vereinsheime mit traditionellem Zugangskonzept',
    recipientsEn: 'Door wardens (officers) and tech-minded student fraternity members in Berlin · secondary: hackerspaces and association clubhouses with custom access traditions',
    domain: 'tools',
    verdict: 'build_first',
    status: 'gepackt',
    tags: ['Hardware', 'Speech-to-Speech', 'Air-Gap', 'Tradition', 'Datenschutz', 'Relais', 'Human-in-the-Loop'],
    problemDe: 'Die Verwaltung der Haustür während eines Couleurbummels ist für die Türwache (Chargierte) mühsam und bindet Aktive im Haus. Gleichzeitig ist die direkte Kopplung einer generativen KI an einen elektronischen Türöffner (Summer) ein untragbares Sicherheitsrisiko (Prompt-Injection, Audio-Spoofing, Halluzinationen), wodurch Fremde physischen Zutritt zum Haus erlangen könnten. Bestehende kommerzielle Smarte Klingeln (Ring, DoorBird) setzen zudem auf permanente Cloud-Videostreams in den öffentlichen Straßenraum, was an Privathäusern datenschutzrechtlich (DSGVO, EU AI Act) hochriskant ist.',
    problemEn: 'Managing the front door during traditional fraternity visits binds active members inside the house. Meanwhile, wiring a generative AI directly to an electronic door latch buzzer is an unacceptable physical security vulnerability (prompt injection, voice spoofing, jailbreaks). Commercial smart doorbells also stream constant video to cloud vendors, conflicting with GDPR/EU AI Act regulations in public street-facing entrances.',
    whyNowDe: [
      'Latenzarme Speech-to-Speech (S2S) Pipelines laufen inzwischen entweder ultragünstig auf Mini-PCs (Whisper.cpp/sherpa-onnx + lokale LLMs/Ollama + Piper-TTS) oder über extrem schnelle Voice-APIs für wenige Cent pro Gespräch.',
      'Günstige Mikrocontroller und Einplatinenrechner (ESP32-S3, Pi Zero 2 W oder Pi 5) können mit I2S-Audio, Servos und GC9A01-Runddisplays für unter 70–200 € robuste Edge-Interaktionsknoten bilden.',
      'Air-Gap-Trennung durch strikte Hardware-Architektur: Das Modell hat ausschließlich Zugriff auf eine einzige deterministische Funktion (ring_internal_bell()), die ein physisches 5V-Relais ansteuert. Dieses Relais schließt nur den Stromkreis der internen Hausklingel — der Türöffner bleibt physisch getrennt und unberührt.',
      'Datenschutz-by-Design: Ein mechanisches Augenlid verdeckt die Kamera physisch und schaltet sie im Ruhezustand stromlos. Video wird nur nach explizitem Taster-Consent im flüchtigen RAM verarbeitet.'
    ],
    whyNowEn: [
      'Ultra-low-latency Speech-to-Speech (S2S) pipelines now run affordably on local mini-PCs (Whisper.cpp + Ollama + Piper) or via real-time speech APIs for fractions of a cent per minute.',
      'Low-cost single board computers and MCUs (ESP32-S3, Pi Zero 2 W, Pi 5) paired with I2S audio, servo eyelids, and 1.28-inch round avatar LCDs enable rich edge appliances for €70–€200.',
      'Air-gapped electrical isolation: The LLM exposes a single deterministic tool call (ring_internal_bell()) activating a 5V GPIO relay tied exclusively to the traditional indoor chime. The door buzzer remains entirely uncoupled.',
      'Privacy-by-design: A mechanical shutter physically covers and unpowers the camera module at rest; video processing requires explicit physical button consent and operates strictly in volatile RAM.'
    ],
    sketchDe: 'Drei-Ebenen-Architektur: 1. Edge-Türstation in wetterfester IP65-Abzweigdose (ESP32-S3 oder Pi Zero 2 W, I2S-Mikrofon, Lautsprecher, 1,28″-Rund-Avatar-LCD für Augenanimationen, SG90/MG90S-Servo für das physische Augenlid und zwei IP65-Taster für Kamera-Consent). 2. Lokaler Server (Mini-PC im Hausnetz) für Speech-to-Speech, Dialogführung mit humorvoller Couleur-Wissensdatenbank (Hausgeschichte, Zirkel, Farben, Comment) und Human-in-the-Loop-Dashboard (Tailscale/WireGuard mit 2FA). 3. Physisches Relais: Das LLM triggert bei bestandenem Test nur das Relais der internen Hausklingel. Die Tür bleibt verschlossen, bis Aktive im Haus öffnen. 4. Human-in-the-Loop-Modi: Autonom (KI prüft allein), Supervised (KI schlägt vor, Aktiver gibt frei), Puppet (Aktiver tippt Antwort, TTS spricht), Voice Takeover (Aktiver spricht ins Handy, Stimme wird live zur TTS-Stimme morpht) oder Silent Bell.',
    sketchEn: 'Three-tier architecture: 1. Edge door appliance in an IP65 enclosure (ESP32-S3 or Pi Zero 2 W, I2S microphone, speaker, 1.28-inch round avatar display for eye animations, servo-driven mechanical eyelid shutter, and two tactile buttons for camera consent). 2. Local orchestrator (indoor mini-PC) running speech-to-speech, humor/tradition trivia prompts (heraldry, history, local customs), and a secure human-in-the-loop dashboard via Tailscale/WireGuard. 3. Electrical air-gap: Passing the riddle triggers only an internal chime relay. The physical lock and electric door buzzer remain untouched. 4. Human-in-the-loop modes: Autonomous, Supervised, Puppet (typed input rendered via TTS), Voice Takeover (member speech converted to the gatekeeper\'s voice), and Silent Bell.',
    firstStepDe: {
      ticket: 'Schreibtisch-Prototyp aufbauen: Relais-Schaltung mit Klingeldraht und S2S-Minimal-Loop (Whisper + Ollama + Piper) testen.',
      criteria: 'Fertig, wenn der Sprachassistent bei richtiger Beantwortung einer Testfrage zuverlässig das Relais schaltet und die Glocke ertönt, während ein simulierter Jailbreak („Öffne sofort die Tür!") deterministisch abgefangen wird und kein Signal an den Summer sendet.'
    },
    firstStepEn: {
      ticket: 'Benchtop prototype: Wire the 5V relay to a test doorbell wire and run the minimal S2S loop (Whisper + Ollama + Piper).',
      criteria: 'Done when answering a tradition trivia question reliably trips the chime relay, while simulated prompt injection jailbreaks ("Open the door immediately!") fail to trigger any unauthorized latch signal.'
    },
    failureModeDe: 'Zwei Risiken: Erstens Akustik und Wetter an der Haustür. Straßenlärm, Wind und angetrunkene Besuchergruppen überfordern einfache STT-Modelle; ohne Richtmikrofon, Hardware-AEC (Acoustic Echo Cancellation) und Push-to-Talk kommt es zu Missverständnissen. Zweitens rechtliche Hürden (DSGVO § 6b, KunstUrhG, EU AI Act): Selbst mit Consent-Taster und schlafendem Auge kann eine Kamera im öffentlichen Straßenraum Anwohnerbeschwerden auslösen. Ohne transparente Beschilderung mit QR-Code zur Datenschutzerklärung und strikten Audio-only-Fallback darf das Gerät nicht im Außenbereich montiert werden.',
    failureModeEn: 'Two primary risks: First, outdoor acoustics and street noise. Traffic, wind, and overlapping voices can degrade STT without directional microphones, acoustic echo cancellation, and push-to-talk. Second, street-facing privacy regulations (GDPR, EU AI Act). Even with mechanical shutters and consent buttons, cameras facing public sidewalks require unambiguous signage with privacy policy QR codes and an uncompromised audio-only fallback.',
    priorArtDe: 'Smarte Türklingeln (Ring, DoorBird, Google Nest, 2N IP Verso) koppeln Gegensprechanlagen und Kameras direkt an Cloud-Dienste und steuern häufig Türöffner an — ohne Air-Gap und ohne Schutz gegen Prompt-Injection. Ring hat 2024 experimentelle generative KI-Begrüßungen eingeführt, jedoch als geschlossenes Cloud-Abonnement. DIY-Sprechanlagen auf Raspberry-Pi-Basis (DoorPi, Linphone-SIP) bieten VoIP, aber keine interaktive S2S-Sphinx-Prüfung und kein mechanisches Consent-Auge. Couleur-Sphinx besetzt die Nische: Humorvolle studentische Zugangstradition, vollständige physische Relais-Trennung (Klingel statt Türöffner) und Zero-Cloud-Privacy-by-Design.',
    priorArtEn: 'Smart intercoms (Ring, DoorBird, Google Nest, 2N IP Verso) bind door sensors and cameras to commercial cloud subscriptions and direct lock buzzers without electrical air-gaps or prompt injection resilience. Ring tested generative greeting bots in 2024 as closed cloud features. Open-source VoIP intercoms (DoorPi, Linphone) handle SIP streaming without voice trivia gatekeeping or mechanical eye shutters. Couleur-Sphinx uniquely occupies humor-driven academic tradition, strict relay-only isolation, and privacy-first local operation.',
    emailTemplate: {
      subjectDe: 'Idee zu verschenken: Couleur-Sphinx — der Air-Gapped S2S Klingel-Gatekeeper',
      bodyDe: 'Hallo Aktivitas,\n\nich recherchiere und verschenke Software- und Hardwarekonzepte nach dem Amélie-Poulain-Prinzip (CC0, ohne Gegenleistung, ohne Nachfassen).\n\nWährend eines Couleurbummels bindet die Haustür die Türwache; gleichzeitig verbietet sich eine direkte KI-Türöffnung aus Sicherheitsgründen von selbst. Couleur-Sphinx löst das als humorvoller, wetterfester Gatekeeper an der Pforte: Ein Avatar-Display und S2S-Dialog testen das Couleurwissen der Besucher. Erst bei Erfolg betätigt ein physisches 5V-Relais ausschließlich die interne Hausklingel — der elektrische Türöffner bleibt komplett getrennt und unberührt.\n\nDrei Varianten von günstig (ESP32-S3 ca. 70–90 €) über Mittelklasse (Pi Zero 2 W ca. 200 €) bis Premium (Pi 5 ca. 400 €) mit schlafendem Servo-Augenlid und Tailscale-Mitglieder-Dashboard.\n\nSkizze, Stückliste, Preistabelle und erstes Ticket:\n<Link zur Dose>\n\nCC0 / Public Domain. Nimm es, bau es, passe es an euer Haus an — du schuldest mir nichts.\n\nViele Grüße\nFélix, Berlin\ngithub.com/felixinberlin',
      subjectEn: 'Free to take: Couleur-Sphinx — the air-gapped S2S intercom gatekeeper',
      bodyEn: 'Hi door wardens and active members,\n\nI research and give away software and hardware ideas under the Amélie Poulain principle (CC0, unconditional, no follow-up).\n\nDuring traditional visits, the front door binds active members; simultaneously, hooking generative voice AI directly to an electric door strike is an unacceptable security hazard. Couleur-Sphinx solves this as an air-gapped, humorous gatekeeper at the door: an avatar display and S2S voice loop quiz visitors on tradition and local lore. Only on success does a 5V relay strike the internal chime — the electric door buzzer remains completely uncoupled.\n\nThree bill-of-materials tiers from budget (ESP32-S3 ~€70–90) to midrange (Pi Zero 2 W ~€200) to premium (Pi 5 ~€400) with a sleeping servo eyelid and member dashboard.\n\nFull sketch, BOM, cost breakdown, and first ticket:\n<Link to tin>\n\nCC0 Public Domain. Build it, adapt it to your house — you owe me nothing.\n\nFélix, Berlin\ngithub.com/felixinberlin',
      to: 'aktivitas@berliner-verbindungen.de'
    }
  },
  {
    id: 'bleifrei-lotse',
    title: 'Bleifrei-Lotse',
    titleEn: 'Lead-Free Navigator',
    oneLinerDe: 'Zerstörungsfreie Vor-Ort-Rohrprüfung (Magnet-Check, Wulstlötungs-Makrofoto, Ritzprobe, akustische Klopfton-Resonanz) für Altbauten und automatische Erzeugung des rechtssicheren Mieter-Auskunftsersuchens sowie der Vollzugsanzeige an das Gesundheitsamt nach § 17 TrinkwV.',
    oneLinerEn: 'Non-destructive on-site pipe material identification (magnet check, wiped solder joint macro photo, scratch test, acoustic resonance) for pre-1973 apartment buildings, generating statutory tenant disclosure requests and public health enforcement notices under TrinkwV § 17.',
    date: '25. September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Verbraucherzentrale Bundesverband (vzbv) · Deutscher Mieterbund (DMB) · Gesundheitsamt Berlin-Mitte (Fachdienst Hygiene)',
    recipientsEn: 'Federation of German Consumer Organisations (vzbv) · German Tenants Association (DMB) · Public Health Authorities (Gesundheitsamt Berlin-Mitte)',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Trinkwasser', 'Gesundheit', 'TrinkwV', 'Bleileitungen', 'Mieterschutz', 'Citizen Science', 'Web Audio'],
    problemDe: 'Seit dem 12. Januar 2026 sind Bleileitungen in Deutschland ausnahmslos verboten (§ 17 TrinkwV). Dennoch leben Millionen Mieter in Altbauten (vor 1973) im Ungewissen über Keller- und Steigleitungen, während Laborwassertests 80–150 € kosten und Gesundheitsämter die Vollzugslücke mangels Kontrollpersonal nicht schließen können.',
    problemEn: 'Since January 12, 2026, lead drinking water pipes are strictly banned across Germany (§ 17 TrinkwV). Yet millions of tenants in pre-1973 buildings face complete information asymmetry, while €100 lab tests are prohibitive and municipal health authorities suffer from an acute inspection deficit.',
    whyNowDe: [
      'Ausnahmsloses Stilllegungsverbot seit 12.01.2026 macht das Vorhandensein von Bleirohren zur bußgeldbewehrten Ordnungswidrigkeit.',
      'Web Audio API FFT analysiert die extrem hohe Eigendämpfung von Blei (Klopfton-Abklingzeit < 50 ms vs. helles Klingeln von Kupfer/Stahl) in Echtzeit lokal im Browser.',
      'Smartphone-Makrokameras erfassen charakteristische Wulstlötnähte und den silbrigen Glanz frischer Ritzspuren.',
      '100% clientseitige Ausführung ohne Server garantiert absoluten Datenschutz (kein Hochladen von Adressdaten).'
    ],
    whyNowEn: [
      'Mandatory lead pipe ban in effect since Jan 12, 2026 renders historic lead piping an actionable regulatory offense.',
      'Web Audio API FFT measures the high acoustic damping of lead (impulse decay < 50 ms vs. overtone ring of copper/iron) client-side in real time.',
      'Smartphone macro vision inspects bulbous wiped solder joints and the silvery metallic scratch sheen under patina.',
      '100% zero-cloud architecture protects tenant privacy without sending location or tenancy records to external servers.'
    ],
    sketchDe: 'Geführter 4-Schritt-Entscheidungsbaum im Browser: 1. Baujahrfilter (vor 1973). 2. Magnet-Vorfilter (haftet -> verzinkter Stahl, Blei ausgeschlossen). 3. Makro-Kratzprobe (weich, silbriger Glanz). 4. Akustischer Klopftest (Web Audio FFT-Dämpfungsmessung). Ausgabe: Wahrscheinlichkeitsscore + fertiger PDF-Musterbrief für Auskunftsersuchen an Vermieter gem. § 17 Abs. 6 TrinkwV und Verdachtsanzeige an das Gesundheitsamt gem. § 64 TrinkwV.',
    sketchEn: 'Guided 4-step browser decision tree: 1. Construction era filter (pre-1973). 2. Magnet pre-filter (sticks -> steel, lead ruled out). 3. Macro scratch inspection (soft, shiny metallic line). 4. Acoustic tap test (Web Audio FFT damping analyzer). Output: Probability score + pre-filled statutory disclosure request to landlord under TrinkwV § 17 and formal inspection docket for municipal health authorities.',
    firstStepDe: {
      ticket: 'Standalone-Entscheidungsbaum mit Web Audio FFT-Resonanzmesser und PDF-Generator.',
      criteria: 'Fertig, wenn an Test-Audiodateien von Blei-, Kupfer- und Zinkrohren in 9 von 10 Fällen das Dämpfungsverhalten korrekt differenziert wird und das generierte PDF die Pflichtangaben nach § 17 Abs. 6 TrinkwV fehlerfrei enthält.'
    },
    firstStepEn: {
      ticket: 'Standalone decision tree with Web Audio FFT resonance analyzer and PDF generator.',
      criteria: 'Done when on sample audio recordings of lead, copper, and galvanized pipes, acoustic damping is correctly classified in 9 of 10 cases, and the exported PDF matches legal requirements under TrinkwV § 17.'
    },
    failureModeDe: 'Falsch-positive Klassifikation: Ein Mieter verwechselt verzinkten Stahl oder verzinntes Kupfer mit Blei und gerät in einen unnötigen Rechtsstreit. Gegenmaßnahme: Zwingender Magnet-Vorfilter (schließt 90 % der Stahlrohre vor dem Kratzen aus) und sachliche Tonalität als „Auskunftsersuchen" statt Schuldvorwurf.',
    failureModeEn: 'False positive identification: A tenant mistakes tinned copper or painted steel for lead, creating unnecessary conflict with management. Remedy: Mandatory magnet pre-filter (eliminates 90% of steel pipes prior to scratching) and neutral phrasing as a "statutory request for information" rather than an accusation.',
    priorArtDe: 'Verengt (25.09.2026): Verbraucherzentralen und Mieterbund bieten Ratgebertexte, verweisen jedoch mangels Software pauschal auf 100-€-Labortests. Gesundheitsämter (Kassel, Hannover) halten Meldeformulare für Betriebe nach § 17 Abs. 6 TrinkwV vor, kontrollieren Wohnungen aber nicht. US-Versorger nutzen ArcGIS Survey123 zur manuellen Selbstauskunft. Die Lücke ist eine geführte mobile Bürger-Diagnosekette mit automatischer Generierung des rechtssicheren Auskunftsersuchens.',
    priorArtEn: 'Narrowed (25 Sep 2026): Consumer advocates publish text articles but advise expensive €100 lab tests. Municipal health authorities provide reporting forms for certified plumbers but lack inspection staff for apartments. US utilities deploy ArcGIS Survey123 for citizen reporting. The remaining gap is a guided, zero-cloud mobile citizen diagnostic suite translating acoustic and optical indicators into enforceable statutory requests.',
    emailTemplate: {
      to: 'wohnen@vzbv.de',
      subjectDe: 'Idee zu verschenken: Bleifrei-Lotse — Zerstörungsfreie Vor-Ort-Prüfung nach TrinkwV 2026',
      bodyDe: 'Hallo vzbv-Team,\n\nich recherchiere und verschenke schlüsselfertige Software- und Datenwerkzeuge nach dem Amélie-Poulain-Prinzip (CC0, ohne Gegenleistung, ohne Nachfassen).\n\nSeit dem 12. Januar 2026 gilt in Deutschland ein ausnahmsloses Verbot von Bleileitungen (§ 17 TrinkwV). Während Installateure anzeigepflichtig sind, stehen Mieter in unrenovierten Altbauten vor einer massiven Vollzugslücke: 100-€-Labortests sind teuer und Gesundheitsämter haben kein Kontrollpersonal.\n\nBleifrei-Lotse ist ein browserbasiertes Zero-Cloud-Werkzeug, das Mieter durch eine zerstörungsfreie Vor-Ort-Diagnostik führt (Magnet-Ausschluss, Makro-Wulstlötung, Ritzprobe, akustischer Klopfton-Dämpfungsabgleich via Web Audio API) und bei Verdacht direkt das rechtssichere Auskunftsersuchen an den Vermieter sowie die Vollzugsanzeige ans Gesundheitsamt als PDF generiert.\n\nEinseiter mit Skizze, physikalischer Resonanzlogik und erstem Ticket:\n<Link zur Dose>\n\nCC0 Public Domain. Nimm es, bau es, bettet es bei euch ein — ihr schuldet mir nichts.\n\nViele Grüße\nFélix, Berlin\ngithub.com/felixinberlin',
      subjectEn: 'Free to take: Lead-Free Navigator — Non-destructive pipe testing under TrinkwV 2026',
      bodyEn: 'Dear vzbv team,\n\nI research and give away turnkey public-interest software ideas under the Amélie Poulain principle (CC0, unconditional, no follow-up).\n\nSince January 12, 2026, lead drinking water pipes are strictly banned across Germany (§ 17 TrinkwV). While trade companies must report discoveries, tenants in older buildings face an acute enforcement deficit: lab tests cost €100 and health authorities lack inspection staff.\n\nLead-Free Navigator is a zero-cloud mobile web tool guiding tenants through non-destructive on-site diagnostics (magnet test, macro wiped joint check, scratch test, acoustic damping analysis via Web Audio API) and exporting statutory disclosure requests and health department dockets as PDFs.\n\nFull one-page dossier with sketch and first ticket:\n<Link to tin>\n\nCC0 Public Domain. Take it, build it, deploy it — you owe me nothing.\n\nBest regards\nFélix, Berlin\ngithub.com/felixinberlin'
    }
  },
  {
    id: 'abbe-fourier-filter',
    title: 'Abbe-Puzzle: Der Fourier-Filter',
    titleEn: "Abbe's Bench: The Fourier Filter",
    oneLinerDe: 'Ein optisches Physik-Puzzlespiel, das die 2D-Fouriertransformation vom Formelblatt auf eine interaktive 4f-Werkbank holt — du schneidest Blenden in die Beugungsebene, um Maschendrahtzäune verschwinden zu lassen, Phasenobjekte ohne Farbstoff sichtbar zu machen und Druckraster aus Archivalien zu filtern, in Echtzeit bei Lichtgeschwindigkeit.',
    oneLinerEn: 'An optical physics puzzle game that brings the 2D Fourier transform off the blackboard onto an interactive 4f bench — carve apertures into the diffraction plane to erase wire fences, reveal transparent phase objects without staining, and strip halftone screens from archives, in real time at the speed of light.',
    date: '25. September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Ernst-Abbe-Hochschule Jena (Fachbereich SciTec / Laser- und Optotechnologien; Prof. Dr. Jens Bliedtner) · nachrangig: DPG Fachgruppe Didaktik der Physik, Physikalisches Anfängerpraktikum (LMU München, TU Berlin)',
    recipientsEn: 'Ernst Abbe University of Applied Sciences Jena (Dept. SciTec / Laser and Optical Technologies; Prof. Dr. Jens Bliedtner) · secondary: DPG Physics Didactics Division, Introductory Physics Lab courses (LMU Munich, TU Berlin)',
    domain: 'physics',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Optik', 'Wellenphysik', 'Fourier', 'Didaktik', 'Lernspiel', 'WebGL'],
    problemDe: 'In Physik-, Elektrotechnik- und Mikroskopie-Vorlesungen wird die 2D-Fouriertransformation als rein abstrakte Doppelintegralrechnung gelehrt: Studierende haben keine räumliche Intuition dafür, was Ortsfrequenzen in einem Wellenfeld bedeuten. Im Hochschulpraktikum scheitert das Verstehen an der Mechanik: 90 % der Zeit verbringen Studierende mit der mikrometergenauen Laser-Justage; für das Erkunden von Filtermasken in der Fourier-Ebene bleiben oft nur zehn Minuten. Biologie- und Medizinstudierende nutzen Phasenkontrastmikroskope, ohne je zu begreifen, warum ein zentraler Phasenring transparente Zellen sichtbar macht.',
    problemEn: 'In physics, electrical engineering, and microscopy courses, the 2D Fourier transform is taught as abstract calculus: students develop zero spatial intuition for what spatial frequencies mean in an optical wavefield. In laboratory practicals, learning collapses under alignment friction: students spend 90% of their lab time troubleshooting micrometer screws and beam wander, leaving ten hurried minutes to test pre-made slits. Biology and medical students operate phase-contrast instruments daily without understanding why an optical phase plate makes transparent cells emerge with distinct contrast.',
    whyNowDe: [
      'WebGL2 und WebAssembly (SIMD) führen komplexe 2D-FFTs auf 256x256-Gittern in unter 1,5 ms aus — vollwertige 60-FPS-Interaktivität auf jedem Laptop oder Tablet ohne Installation.',
      'HTML5 Canvas erlaubt es, Beugungsmasken mit Touch- oder Mausgesten direkt in den Frequenzraum zu schnitzen (Pinholes, Spalte, Zernike-Ringe, Schlierenkanten) und die Rekonstruktion synchron mitzubewegen.',
      'Die Physikgeschichte bietet eine fertige, didaktisch brillante Puzzle-Progression: Abbe 1873 (Beugung), Porter 1906 (Gitterfilterung), Zernike 1934 (Phasenkontrast) und Toepler (Schlierenoptik).'
    ],
    whyNowEn: [
      'WebGL2 and WebAssembly with SIMD compute complex 2D FFTs on 256x256 grids in under 1.5 ms — full 60 FPS responsiveness on commodity laptops or tablets without plugins.',
      'HTML5 Canvas enables learners to directly carve diffraction masks in frequency space using touch or mouse gestures while the reconstructed image updates synchronously in real time.',
      'The history of optics offers a natural, pedagogically brilliant puzzle progression: Abbe 1873 (diffraction limit), Porter 1906 (grating filtering), Zernike 1934 (phase contrast), and Toepler (Schlieren imaging).'
    ],
    sketchDe: 'Virtuelle 4f-Optikbank im Browser (Laser 532 nm -> Objekt -> Fourier-Linse -> Fourier-Ebene mit Filtermaske -> Rekonstruktionslinse -> Kamerasensor). Anzeige von Original, k-Raum (Amplitude log-skaliert + Phase) und rekonstruiertem Bild. Werkzeugpalette: Lochblende (Tiefpass), Zentraler Block / Dunkelfeld (Hochpass), Spaltblende (Richtungsfilter), Notch-Stempel (Gitterlöschung), Zernike-Phasenplättchen (Phasenkontrast), Schlieren-Messer (Wärmekonvektion). Fünf Level historischer Experimente mit realen Zielbildern.',
    sketchEn: 'Virtual 4f optical bench in the browser (532 nm laser -> specimen -> Fourier lens -> conjugate Fourier plane with custom mask -> reconstruction lens -> sensor). Simultaneous display of original, k-space (log amplitude + phase), and reconstructed image. Toolkit: Pinhole (low-pass), Central stop / Darkfield (high-pass), Slit (directional), Notch punch (mesh excision), Zernike retarder (phase contrast), Schlieren blade (thermal convection). Five puzzle levels modeling historical experiments with real visual targets.',
    firstStepDe: {
      ticket: 'Ein Gitter, ein Zaun, ein Pinhole, ein invertierbares 2D-FFT-Canvas.',
      criteria: '2D-Cooley-Tukey-FFT auf einem 256x256-Graustufenbild; Amplitudenspektrum im k-Raum; interaktiv platzierbarer Notch-Filter blockiert diskrete Beugungspeaks des Gitters; inverse FFT rekonstruiert das Bild in unter 16 ms. Fertig, wenn drei Physik-Studierende auf Anhieb verstehen, warum das Ausblenden zweier Punkte das gesamte Gitter löscht, und ein Test die Parseval-Energieerhaltung auf 0,1 % Genauigkeit bestätigt.'
    },
    firstStepEn: {
      ticket: 'One grid, one fence, one pinhole, one reversible 2D-FFT canvas.',
      criteria: '2D Cooley-Tukey FFT on a 256x256 grayscale image; amplitude spectrum in k-space; interactive notch filter blocks discrete diffraction peaks of the grid; inverse FFT reconstructs the image in under 16 ms. Done when three physics students immediately understand why blocking two points erases the entire mesh, and an automated test confirms Parseval energy conservation to within 0.1% accuracy.'
    },
    failureModeDe: 'Verwechslung mit Photoshop-Filtern: Wenn Spielende denken, sie bedienen nur einen Weichzeichner, verpufft der didaktische Wert. Gegenmaßnahme: Zwingende Visualisierung des realen physikalischen 4f-Strahlengangs mit echten Einheiten (nm, Linien/mm, Phasenwinkel) und expliziter Bezug auf historische Originalexperimente. Rand-Aliasing der diskreten FFT wird durch integrierte Hanning/Tukey-Fensterung gedämpft.',
    failureModeEn: 'Confusion with digital Photoshop filters: If learners believe they are merely applying an Instagram blur, the didactic value evaporates. Remedy: Mandatory rendering of the physical 4f optical raypath with calibrated physical units (nm, lines/mm, phase retardance) and explicit historical experiment framing. Discrete FFT boundary aliasing is mitigated via integrated Hanning/Tukey windowing.',
    priorArtDe: 'Frei (25.09.2026): Geometrische Optikspiele (Laser Maze, Chromatron, Optika, Aargon) bilden nur Snellius-Strahlen mit Spiegeln/Prismen ab — null Wellenoptik, null Beugung. Didaktische Mathe-Erklärer (Jezzamon, 3Blue1Brown) bieten passive Schaubilder ohne Spielmechanik oder optischen Strahlengang. Hochschulpraktika verlieren 90 % der Zeit an Justierschrauben. ImageJ bietet FFT nur als Experten-Menüpunkt. Die Lücke ist ein physikalisches Puzzlespiel, das die 2D-Ortsfrequenzfilterung nach Ernst Abbe spielbar macht.',
    priorArtEn: 'Free (25 Sep 2026): Geometric optics games (Laser Maze, Chromatron, Optika, Aargon) only model Snell ray reflection with mirrors/prisms — zero wave mechanics, zero diffraction. Didactic math explainers (Jezzamon, 3Blue1Brown) offer passive diagrams without game mechanics or optical raypaths. University labs lose 90% of time to alignment screws. ImageJ provides FFT only as an unguided utility. The gap is a physical puzzle game rendering Ernst Abbe 2D spatial frequency filtering truly playable.'
  },
  {
    id: 'abbundzeichen-fundbuch',
    title: 'Abbundzeichen-Fundbuch',
    titleEn: "Carpenters' Marks Logbook",
    oneLinerDe: 'Ein Prüfer für Zählfolgen von Abbundzeichen: Sanierende tragen die Zeichen einer freigelegten Fachwerkwand ein, das Werkzeug meldet Lücken, Doppelungen und fremde Serien als Hinweis oder Verdacht (etwa auf Zweitverwendung) und legt den Fund in einem Format ab, das Hausforschende sammeln können.',
    oneLinerEn: 'A sequence checker for carpenters\' assembly marks: renovators enter the marks of an exposed timber-framed wall, and the tool reports gaps, duplicates and foreign series as a hint or a suspicion (for example of reused timber) and stores the find in a format house historians can collect.',
    date: '27. September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Interessengemeinschaft Bauernhaus e.V. (IgB), Bereich Hausforschung (Hausforschertreffen, Bauernhausarchiv Syke, AK Haus- und Gefügeforschung Nordwest; Kontakt laut Schnipsel Dr. Julia Ricker — vor Versand auf igbauernhaus.de verifizieren) · nachrangig (UK): Raking Light bzw. Vernacular Architecture Group',
    recipientsEn: 'Interessengemeinschaft Bauernhaus e.V. (IgB), house research section (researchers\' meetings, farmhouse archive Syke, North-West working group on house and timber-frame research; contact per search snippet Dr. Julia Ricker — verify on igbauernhaus.de before sending) · secondary (UK): Raking Light or the Vernacular Architecture Group',
    domain: 'knowledge',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Hausforschung', 'Fachwerk', 'Abbundzeichen', 'Denkmalpflege', 'Citizen Science', 'Bisoziation'],
    problemDe: 'Wer ein Fachwerkhaus saniert, sieht die Abbundzeichen genau einmal, in den wenigen Wochen, in denen Putz und Verkleidung ab sind, und kann sie nicht lesen (wiederkehrende Fragen auf fachwerk.de). Die wenigen Forschenden, die sie lesen, bitten öffentlich um Sichtungen und legen winzige Datenbanken von Hand an (Raking Light: 25 Belege). So entsteht nie eine Verteilung, an der man Umbauten, Zweitverwendung oder regionale Zeichensysteme ablesen könnte.',
    problemEn: 'Renovators of timber-framed houses see the carpenters\' marks exactly once, during the few weeks when plaster and cladding are off, and cannot read them (recurring questions on fachwerk.de). The few researchers who can read them publicly ask for sightings and compile tiny databases by hand (Raking Light: 25 instances). So no distribution ever emerges from which alterations, reused timber or regional marking systems could be read.',
    whyNowDe: [
      'Vision-Sprachmodelle (2025/26) können aus einem Streiflichtfoto Lesungen eingeschlagener oder eingeritzter Zeichen vorschlagen (römische Ziffern, Ausstiche, Rötel) — ungeprüft und für den Kern nicht nötig.',
      'Die Grammatik macht verrauschte Lesungen prüfbar: Eine Zählfolge ist monoton je Bund bzw. Wand und trägt ein Serienzeichen je Wandseite; ein deterministischer Prüfer erkennt, wenn eine Lesung nicht passt.',
      'Die Forschung verlangt nach Standardisierung und Sichtungen: Vernacular Architecture 49/1 (2018) zur einheitlichen Erfassung, Raking Light bittet um Fundmeldungen.'
    ],
    whyNowEn: [
      'Vision-language models (2025/26) can suggest readings of struck or scribed marks from a raking-light photo (Roman numerals, tags, red chalk) — untested and not needed for the kernel.',
      'The grammar makes noisy readings checkable: a numbering sequence is monotonic per frame or wall and carries one series tag per wall face; a deterministic checker notices when a reading does not fit.',
      'Research is asking for standardisation and sightings: Vernacular Architecture 49/1 (2018) on uniform recording, Raking Light asks for reports of sightings.'
    ],
    sketchDe: 'Eingabe: je Bauteil Bund bzw. Wand, Position, Rolle (Ständer, Riegel, Strebe, Sparren …) und Zeichen in kleiner Notation (IIII, IV, XII^, VII>> = Ziffer + Ausstich-Typ und -Anzahl); „unlesbar" ist ein eigener Zustand. Logik: Parser (Wert, Notation additiv/subtraktiv, Serie) und fünf deterministische Regeln — Lücke, Doppelung, fremde Serie, Notationsbruch, Richtungsbruch — jede mit Regel-ID und Klartextbegründung. Ausgabe: Serien, Befunde der Stufe „hinweis" oder „verdacht" (nie „bestätigt"), Liste der unlesbaren Zeichen; JSON-Export mit Feldern nach VA 49/1, Ort nur auf Gemeindeebene. Nicht dabei: keine eigene Karte, keine Sammeldatenbank, kein Server, keine Datierung, keine exakten Standorte.',
    sketchEn: 'Input: per member its frame or wall, position, role (post, rail, brace, rafter …) and the mark in a small notation (IIII, IV, XII^, VII>> = numeral + tag type and count); "unreadable" is a state of its own. Logic: parser (value, additive/subtractive notation, series) and five deterministic rules — gap, duplicate, foreign series, notation break, direction break — each with a rule ID and plain-language reason. Output: series, findings graded "hint" or "suspicion" (never "confirmed"), list of unreadable marks; JSON export with fields per VA 49/1, place only at municipality level. Not included: no map of its own, no collecting database, no server, no dating, no exact locations.',
    firstStepDe: {
      ticket: 'Eine Wand, eine Zählfolge, ein Verdacht: reiner TypeScript-Kern pruefeZaehlfolge(bauteile) für römische Zeichen mit Ausstich/Serienzeichen und römisch einfach (additive Formen wie IIII gültig).',
      criteria: 'Fertig, wenn eine Vitest-Suite mit ≥ 20 Fällen grün ist (lückenlose Wand, fehlender Ständer, fremder Ausstich, IIII neben IV, unlesbares Zeichen, Umsetzung) und mindestens ein publiziertes Zeichenregister aus der Literatur (DSD-Kulturspur, ing-hofer.de oder Gerner 1996) als Fixture mit dem publizierten Befund übereinstimmt; der Kern läuft als statische Seite offline ohne Netzwerk und ohne Modell, jede Meldung trägt Regel-ID und Begründung (De/En), Ablage unter 07-demos/abbundzeichen-fundbuch/.'
    },
    firstStepEn: {
      ticket: 'One wall, one sequence, one suspicion: a pure TypeScript kernel pruefeZaehlfolge(bauteile) for Roman marks with tags/series marks and plain Roman marks (additive forms such as IIII are valid).',
      criteria: 'Done when a Vitest suite with ≥ 20 cases is green (complete wall, missing post, foreign tag, IIII next to IV, unreadable mark, relocation) and at least one published mark register from the literature (DSD Kulturspur, ing-hofer.de or Gerner 1996) matches its published finding as a fixture; the kernel runs as a static page offline with no network and no model, every message carries a rule ID and reason (De/En), stored under 07-demos/abbundzeichen-fundbuch/.'
    },
    failureModeDe: 'Fehlgelesene Zeichen erzeugen falsche „Zweitverwendungs"-Befunde: Laien halten einen Hinweis für einen Bauforschungsbefund, und eine Sammlung füllt sich mit verrauschten Daten. Gegenmaßnahme in der Architektur: nur „hinweis" und „verdacht", nie ein Befund; Modell-Lesung nur als Vorschlag, gespeichert wird die vom Menschen bestätigte Lesung neben dem Foto; „unlesbar" gleichberechtigt; keine automatische Karte, Export an kuratierende Hausforschende; Standort nur auf Gemeindeebene. Zweitens hat der Empfänger keinen Softwarearm, daher eine statische Seite ohne Betrieb. Offen gelegt: Evidenz nur aus Suchschnipseln (Seitenabrufe gesperrt), VLM-Lesung ungeprüft, Kontakt unverifiziert.',
    failureModeEn: 'Misread marks produce false "reuse" findings: laypeople take a hint for a building-archaeology finding, and a collection fills with noisy data. Architectural remedy: only "hint" and "suspicion", never a finding; the model reading is only a suggestion, the human-confirmed reading is stored next to the photo; "unreadable" counts equally; no automatic map, export to curating house historians; location only at municipality level. Second, the recipient has no software arm, hence a static page with nothing to operate. Disclosed: evidence from search snippets only (page fetches blocked), VLM reading untested, contact unverified.',
    priorArtDe: 'Frei (27.09.2026, nur Suchschnipsel, keine Seite im Volltext gelesen): Kein Werkzeug, keine Datenbank und kein Laienmeldeweg für Abbundzeichen gefunden, weder deutsch noch englisch (englisch nur Papers, CAD-Software, Zimmerei-Rechner). Forschung sammelt von Hand (Raking Light, 25 Belege, Aufruf zu Sichtungen; Vernacular Architecture 49/1, 2018). Die Deutsche Stiftung Denkmalschutz vermittelt (Kulturspur „Abbundzeichen"), das IgB-Bauernhausarchiv erfasst Aufmaße, keine Zeichen; Grundlagen bei Gerner (Fulda 1996) und ing-hofer.de. Restlücke: Zeichen im Sanierungsfenster in eine prüfbare Zählfolge übersetzen und in einem sammelbaren Format ablegen. Dose: https://felixinberlin.github.io/Amelie/#dose=abbundzeichen-fundbuch',
    priorArtEn: 'Free (27 Sep 2026, search snippets only, no page read in full): no tool, no database and no lay reporting route for carpenters\' marks found, in German or English (English only papers, CAD software, carpentry calculators). Research collects by hand (Raking Light, 25 instances, call for sightings; Vernacular Architecture 49/1, 2018). Deutsche Stiftung Denkmalschutz does outreach (Kulturspur "Abbundzeichen"), the IgB farmhouse archive records surveys, not marks; foundations in Gerner (Fulda 1996) and ing-hofer.de. Remaining gap: turn marks into a checkable sequence during the renovation window and store them in a collectable format. Tin: https://felixinberlin.github.io/Amelie/#dose=abbundzeichen-fundbuch'
  },
  {
    id: 'vernichtungs-offenlegungsregister',
    title: 'Vernichtungs-Offenlegungsregister',
    titleEn: 'Destruction Disclosure Register',
    oneLinerDe: 'Ein offenes Register der Pflichtangaben, die große Unternehmen nach Art. 24 ESPR über vernichtete unverkaufte Verbraucherprodukte veröffentlichen müssen. Sein Kern ist ein deterministischer Prüfer gegen das Tabellenformat aus Anhang I der DVO (EU) 2026/2, der nie „Verstoß“ sagt, sondern nur „gefunden“ oder „keine Offenlegung gefunden (Stand, Suchweg)“.',
    oneLinerEn: 'An open register of the mandatory figures that large companies must publish under Art. 24 ESPR on destroyed unsold consumer products. Its core is a deterministic checker against the table format in Annex I of Implementing Regulation (EU) 2026/2 that never says "violation", only "found" or "no disclosure found (as of, search path)".',
    date: '28. September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'Deutsche Umwelthilfe e.V. (DUH), Bereich Kreislaufwirtschaft (Kampagnen gegen Retouren- und Warenvernichtung) — keine Person ermittelt, Ansprechperson vor Versand auf duh.de verifizieren · nachrangig: Greenpeace e.V. (Warenvernichtung), Changing Markets',
    recipientsEn: 'Deutsche Umwelthilfe e.V. (DUH), circular economy team (campaigns against destroying returns and unsold goods) — no person identified, verify the contact person on duh.de before sending · secondary: Greenpeace e.V. (destruction of goods), Changing Markets',
    domain: 'civic',
    verdict: 'build_first',
    status: 'gepackt',
    tags: ['ESPR', 'Ökodesign', 'Warenvernichtung', 'Offenlegung', 'Kreislaufwirtschaft', 'Umweltvollzug', 'Dreifachfund'],
    problemDe: 'Seit dem Geschäftsjahr 2025 müssen große Unternehmen, die unverkaufte Verbraucherprodukte entsorgen, jährlich offenlegen, wie viel, warum und auf welchem Weg (Art. 24 ESPR, VO (EU) 2024/1781). Die Angaben erscheinen verstreut auf Firmenseiten, als eigenes PDF oder als Kapitel im Nachhaltigkeitsbericht; die Exakttitel-Suche fand genau eins (Signify, GJ 2025, PDF vom 04.05.2026). Die Pflichtzahlen über vernichtete Ware stehen jedes Jahr auf hunderten Firmenseiten, aber nirgends nebeneinander. Umweltverbände, die die Wirkung des Vernichtungsverbots (Textilien und Schuhe seit 19.07.2026) belegen wollen, suchen jede Offenlegung einzeln; die Kommission braucht dieselben Zahlen für eine Ausweitung nach Art. 25.',
    problemEn: 'Since financial year 2025, large companies that discard unsold consumer products must disclose annually how much, why and by which route (Art. 24 ESPR, Regulation (EU) 2024/1781). The figures appear scattered across company websites, as a standalone PDF or as a chapter of the sustainability report; an exact-title search found exactly one (Signify, FY 2025, PDF of 4 May 2026). The mandatory figures on destroyed goods sit every year on hundreds of company pages, but nowhere side by side. Environmental groups that want to show whether the destruction ban works (textiles and footwear since 19 July 2026) hunt down each disclosure one by one; the Commission needs the same figures for an extension under Art. 25.',
    whyNowDe: [
      'Der erste Jahrgang erscheint jetzt: Die Offenlegung für GJ 2025 ist binnen 12 Monaten fällig, bei Kalender-GJ bis 31.12.2026, im freien Format. Wer ihn zuerst sammelt, setzt das Format der Debatte.',
      'Das Pflichtformat kommt später: Die DVO (EU) 2026/2 gilt ab 02.03.2027; das Tabellenformat aus Anhang I ist Pflicht für GJ ab 02.03.2027, bei Kalender-GJ also erstmals GJ 2028, offengelegt 2029 (Mehrheitslesart aus sechs Schnipseln).',
      'Das Why-Now-Fenster ist befristet: Für GJ 2025–2027 liegen drei Jahrgänge in freiem Format vor, die sich per LLM-Extraktion mit menschlicher Bestätigung in ein Schema bringen lassen. Danach genügt ein Parser. Der dauerhafte Kern ist deshalb der deterministische Anhang-I-Prüfer, die LLM-Stufe nur ein Übergangsmodul.'
    ],
    whyNowEn: [
      'The first vintage is appearing now: the disclosure for FY 2025 is due within 12 months, by 31 December 2026 for calendar FYs, in free format. Whoever collects it first sets the format of the debate.',
      'The mandatory format comes later: Implementing Regulation (EU) 2026/2 applies from 2 March 2027; the Annex I table format is mandatory for FYs starting on or after 2 March 2027, so for calendar FYs first FY 2028, disclosed in 2029 (majority reading across six snippets).',
      'The why-now window is time-limited: FY 2025–2027 yield three vintages in free format that LLM extraction with human confirmation can bring into one schema. After that a parser is enough. The durable core is therefore the deterministic Annex I checker; the LLM stage is only a transition module.'
    ],
    sketchDe: 'Eingabe: je Unternehmen und GJ eine Offenlegung, von Hand oder als bestätigter LLM-Vorschlag in das Anhang-I-Schema übertragen, mit Quell-URL, Abrufdatum und Archiv-Snapshot; für fehlende Offenlegungen Stand und Suchweg. Logik: deterministischer Prüfer pruefeOffenlegung() ohne Netz und Modell: Prozentsummen der Behandlungswege = 100, Grund aus der Ausnahmeliste, CN-Code-Format, Stück/Gewicht-Plausibilität je Warengruppe, Schätzkennzeichnung; jeder Befund mit Regel-ID und als Frage formuliert. Ausgabe: statische CSV/JSON je Unternehmen × GJ mit nur zwei Status, „gefunden“ oder „keine Offenlegung gefunden (Stand, Suchweg)“, nie „Verstoß“ oder „säumig“, weil die Pflicht bedingt ist. Es gibt keine Liste der Verpflichteten, daher eine offen gelegte, kuratierte Startliste (z. B. große Bekleidungs- und Schuhhändler in DE) und keine Quoten. Das Anhang-I-Schema ist vorläufig, bis es gegen den Normtext (DVO 2026/2 Anhang I, ESPR Art. 24 Abs. 1) geprüft ist. Nicht dabei: keine Bewertung oder Rangliste, kein Dauer-Crawler, kein Server, keine Ersatzteilpreise, keine Rechtsberatung.',
    sketchEn: 'Input: one disclosure per company and FY, entered into the Annex I schema by hand or as a confirmed LLM suggestion, with source URL, retrieval date and archive snapshot; for missing disclosures, date and search path. Logic: deterministic checker pruefeOffenlegung() without network or model: treatment-route percentages sum to 100, reason from the derogation list, CN code format, units/weight plausibility per product group, estimate flag; every finding with a rule ID and phrased as a question. Output: static CSV/JSON per company × FY with only two statuses, "found" or "no disclosure found (as of, search path)", never "violation" or "overdue", because the duty is conditional. There is no list of obliged companies, hence a published, curated start list (e.g. large clothing and footwear retailers in Germany) and no rates. The Annex I schema is provisional until checked against the legal text (IR 2026/2 Annex I, ESPR Art. 24(1)). Not included: no rating or ranking, no permanent crawler, no server, no spare-part prices, no legal advice.',
    firstStepDe: {
      ticket: 'Anhang I als Schema, ein Prüfer, eine echte Offenlegung: das Anhang-I-Format der DVO (EU) 2026/2 als JSON-Schema (anhang1-schema.json) und ein deterministischer TypeScript-Prüfer pruefeOffenlegung(offenlegung). Vorbedingung: Normtext DVO 2026/2 (Art. 2/3, Anhang I) und ESPR Art. 24 Abs. 1 im Volltext lesen; sonst trägt das Schema den Status „vorläufig“ mit Schnipselquelle je Feld.',
      criteria: 'Fertig, wenn eine Vitest-Suite mit ≥ 15 Fällen grün ist (vollständige Offenlegung ohne Befund, Prozentsumme ≠ 100, Grund außerhalb der Ausnahmeliste, ungültiger CN-Code, Stück/Gewicht unplausibel, fehlende Schätzkennzeichnung, Freitext-Offenlegung ohne Tabelle), die Signify-Offenlegung GJ 2025 von Hand als erste Fixture mit Quell-URL und Abrufdatum übertragen ist, ein Test sicherstellt, dass keine Ausgabe „Verstoß“, „säumig“ oder „violation“ enthält und fehlende Offenlegungen nur als „keine Offenlegung gefunden“ mit Datum und Suchweg erscheinen, jeder Befund Regel-ID und Klartextfrage (De/En) trägt, das Schema seinen Stand ausweist und alles unter 07-demos/vernichtungs-offenlegungsregister/ liegt.'
    },
    firstStepEn: {
      ticket: 'Annex I as a schema, one checker, one real disclosure: the Annex I format of Implementing Regulation (EU) 2026/2 as a JSON Schema (anhang1-schema.json) plus a deterministic TypeScript checker pruefeOffenlegung(offenlegung). Precondition: read the full legal text of IR 2026/2 (Art. 2/3, Annex I) and ESPR Art. 24(1); otherwise the schema carries the status "provisional" with a snippet source per field.',
      criteria: 'Done when a Vitest suite with ≥ 15 cases is green (complete disclosure with no finding, percentage sum ≠ 100, reason outside the derogation list, invalid CN code, implausible units/weight, missing estimate flag, prose-only disclosure without a table), Signify\'s FY 2025 disclosure is transcribed by hand as the first fixture with source URL and retrieval date, a test ensures no output contains "Verstoß", "säumig" or "violation" and missing disclosures only appear as "no disclosure found" with date and search path, every finding carries a rule ID and a plain-language question (De/En), the schema states its status, and everything lives under 07-demos/vernichtungs-offenlegungsregister/.'
    },
    failureModeDe: 'Das Register wird als Pranger gelesen, obwohl eine fehlende Offenlegung nichts beweist: Die Pflicht ist bedingt, es gibt keine Liste der Verpflichteten, und „unplausibel“-Markierungen bergen Abmahnrisiko. Gegenmaßnahme in der Architektur: nur zwei neutrale Status, Befunde als Fragen, jede Zeile mit Quell-URL, Abrufdatum und Archiv-Snapshot, keine Quoten, offen gelegte Startliste. Zweitens Kurator-Ermüdung und Nachzug durch Kommission oder Compliance-Anbieter (UK-Modern-Slavery-Präzedenz); deshalb ist der Kern der Prüfer, nicht die Sammlung. Offen gelegt: Evidenz nur aus Suchschnipseln (eur-lex EGRESS_BLOCKED), Zeitachse nach Mehrheitslesart, Schema vorläufig, keine Empfängerperson ermittelt.',
    failureModeEn: 'The register is read as a pillory although a missing disclosure proves nothing: the duty is conditional, there is no list of obliged companies, and "implausible" flags carry a cease-and-desist risk. Architectural remedy: only two neutral statuses, findings as questions, every row with source URL, retrieval date and archive snapshot, no rates, a published start list. Second, curator fatigue and catch-up by the Commission or a compliance vendor (UK Modern Slavery precedent); that is why the core is the checker, not the collection. Disclosed openly: evidence from search snippets only (eur-lex EGRESS_BLOCKED), timeline per majority reading, schema provisional, no recipient person identified.',
    priorArtDe: 'Frei (28.09.2026, Dreifachfund aller drei Engines, 11 unabhängige Gegen-Suchen des Reviewers DE/EN, nur Suchschnipsel): Kein NGO-, Journalisten- oder Kommissions-Aggregator der Art.-24-Offenlegungen gefunden. Nur herstellerseitige Compliance-Werkzeuge (Flexireo, Generation Impact, Cleo Labs, Complir, Compliance & Risks) und Kanzlei-Erklärtexte (Cooley 07.05.2026, Freshfields, Linklaters, Cattwyk, trade-e-bility). Die Kommission ist Datennutzerin für Art. 25, plant laut Arbeitsplan 2025–2030 aber keine Ausweitung. Prämisse belegt: Signify, „Disclosure on Discarded Unsold Consumer Products“, GJ 2025 (PDF 04.05.2026). Muster bekannt aus dem UK Modern Slavery Act (NGOs sammelten zuerst). Restlücke: offenes, datiertes Register mit deterministischem Anhang-I-Prüfer und neutralem Status. Dose: https://felixinberlin.github.io/Amelie/#dose=vernichtungs-offenlegungsregister',
    priorArtEn: 'Free (28 Sep 2026, triple find by all three engines, 11 independent counter-searches by the reviewer in German and English, search snippets only): no NGO, journalist or Commission aggregator of Art. 24 disclosures found. Only vendor-side compliance tools (Flexireo, Generation Impact, Cleo Labs, Complir, Compliance & Risks) and law-firm explainers (Cooley 7 May 2026, Freshfields, Linklaters, Cattwyk, trade-e-bility). The Commission is a data user for Art. 25 but plans no extension per its 2025–2030 working plan. Premise confirmed: Signify, "Disclosure on Discarded Unsold Consumer Products", FY 2025 (PDF 4 May 2026). Known pattern from the UK Modern Slavery Act (NGOs collected first). Remaining gap: an open, dated register with a deterministic Annex I checker and neutral status. Tin: https://felixinberlin.github.io/Amelie/#dose=vernichtungs-offenlegungsregister'
  },
  {
    id: 'umsetzungsplan-register',
    title: 'Umsetzungsplan-Register',
    titleEn: 'Implementation Plan Register',
    oneLinerDe: 'Ein offenes Register der Umsetzungspläne, die Unternehmen nach § 9 EnEfG (und EED Art. 11 Abs. 2) für ihre wirtschaftlichen Energiesparmaßnahmen veröffentlichen müssen. Sein Kern ist ein deterministischer Prüfer gegen die sieben Pflichtangaben des BAFA-Merkblatts, der je Plan die Statusverteilung und das Investitionsvolumen der offenen Maßnahmen ausgibt und nie „säumig“ sagt, sondern nur „gefunden“ oder „kein Plan gefunden (Stand, Suchweg)“.',
    oneLinerEn: 'An open register of the implementation plans that companies must publish under § 9 of the German Energy Efficiency Act (EnEfG, and EED Art. 11(2)) for their cost-effective energy-saving measures. Its core is a deterministic checker against the seven mandatory items in the BAFA guidance sheet that outputs, per plan, the status distribution and the investment volume of open measures, and never says "overdue", only "found" or "no plan found (as of, search path)".',
    date: '28. September 2026',
    reviewAfter: 'September 2027',
    recipientsDe: 'DENEFF e.V. (Deutsche Unternehmensinitiative Energieeffizienz), Christian Noll, geschäftsführender Vorstand (Effizienzpolitik, gegen die Aufweichung der EnEfG-Novelle) — Name und Funktion von deneff.org (07.07.2026), vor Versand erneut verifizieren · nachrangig: Umweltinstitut München e.V., Dr. Leonard Burtscher (Stand 2024, nicht verifiziert)',
    recipientsEn: 'DENEFF e.V. (German Business Initiative for Energy Efficiency), Christian Noll, managing board member (efficiency policy, opposing the weakening of the EnEfG amendment) — name and role from deneff.org (7 July 2026), re-verify before sending · secondary: Umweltinstitut München e.V., Dr. Leonard Burtscher (as of 2024, not verified)',
    domain: 'civic',
    verdict: 'build_first',
    status: 'gepackt',
    tags: ['EnEfG', 'EED', 'Energieeffizienz', 'Offenlegung', 'Umsetzungsplan', 'Energievollzug', 'Dreifachfund'],
    problemDe: 'Unternehmen oberhalb einer Verbrauchsschwelle müssen nach ihrem Energieaudit einen Umsetzungsplan für alle wirtschaftlichen Endenergieeinsparmaßnahmen erstellen und veröffentlichen (§ 9 EnEfG), aber nicht umsetzen. Die Pläne liegen verstreut als PDF auf Firmenseiten oder im Unternehmensbericht; es gibt kein Register, keine Liste der Verpflichteten und niemanden, der sie zählt. Die Exakttitel-Suche findet mindestens zehn Pläne, einer liefert schon 404. Tausende Firmen müssen öffentlich sagen, welche wirtschaftlichen Sparmaßnahmen noch offen sind, aber niemand zählt, wie viele liegen bleiben. DENEFF und Umweltinstitut argumentieren im Bundestagsverfahren zur Novelle (1. Lesung 24.09.2026) deshalb nur mit Modellrechnungen.',
    problemEn: 'Companies above a consumption threshold must, after their energy audit, draw up and publish an implementation plan for all cost-effective energy-saving measures (§ 9 EnEfG), but need not carry them out. The plans sit scattered as PDFs on company websites or in the company report; there is no register, no list of obliged companies and nobody counting them. An exact-title search finds at least ten plans, one already returns 404. Thousands of companies must say publicly which cost-effective savings measures are still open, but nobody counts how many are left undone. DENEFF and Umweltinstitut therefore argue in the Bundestag procedure on the amendment (first reading 24 Sep 2026) with model calculations only.',
    whyNowDe: [
      'Die Novelle wird gerade verhandelt: BT-Drs. 21/8027 vom 16.09.2026 [Seite] — § 9 n. F. für 2,77 bis < 23,6 GWh/a, Veröffentlichung binnen drei Monaten nach dem Audit, jährliche Aktualisierung, BAFA-Stichproben auch zur Veröffentlichung, Bußgeld bei Nicht-Veröffentlichung, aber kein Unternehmensregister. Der Bundesrat beantragt die Streichung der Veröffentlichungspflicht, die Bundesregierung hält daran fest.',
      'Das Format existiert faktisch: Das BAFA-Merkblatt schreibt sieben Pflichtangaben mit Statusvokabular {Offen, In Bearbeitung, Abgeschlossen} vor; Sanofi (11/2025) und VON ARDENNE (04/2025) übernehmen die Spalten wörtlich [Seite]. Damit ist der Kern deterministisch prüfbar.',
      'Die Pflicht ist unionsrechtlich gedeckelt (EED Art. 11 Abs. 2 UAbs. 3 [Seite]) und wird jährlich aktualisiert: Es entsteht eine Zeitreihe, wie viele „Offen“ zu „Abgeschlossen“ werden. Und die Pläne verschwinden (404) — wer jetzt archiviert, sichert den Jahrgang.'
    ],
    whyNowEn: [
      'The amendment is being negotiated now: BT-Drs. 21/8027 of 16 Sep 2026 [page] — new § 9 for 2.77 to < 23.6 GWh/a, publication within three months after the audit, annual update, BAFA spot checks now covering publication, fines for non-publication, but no company register. The Bundesrat requests deleting the publication duty; the federal government keeps it.',
      'The format exists in practice: the BAFA guidance sheet prescribes seven mandatory items with the status vocabulary {Offen, In Bearbeitung, Abgeschlossen}; Sanofi (11/2025) and VON ARDENNE (04/2025) copy the columns verbatim [page]. That makes the core deterministically checkable.',
      'The duty is capped by EU law (EED Art. 11(2) third subparagraph [page]) and updated annually: a time series of how many "open" measures become "completed" emerges. And the plans are disappearing (404) — whoever archives now secures the vintage.'
    ],
    sketchDe: 'Eingabe: je Unternehmen und Planstand ein Plan, von Hand oder als bestätigter LLM-Vorschlag in umsetzungsplan-schema.json übertragen, mit Quell-URL, Abrufdatum, Archiv-Snapshot und Feld rechtsstand (a. F. / n. F.); für fehlende Pläne Stand und Suchweg. Logik: deterministischer Prüfer pruefeUmsetzungsplan() ohne Netz und Modell: sieben Pflichtangaben vorhanden, Status aus dem Vokabular, Zeitrahmen parsebar, Investitionsvolumen numerisch; Ausgabe Statusverteilung und Investitionssumme der offenen Maßnahmen (jede Maßnahme im Plan ist per Definition wirtschaftlich, § 9 Abs. 2). Registerkern (Status, Suchnachweis, Snapshot, CSV, Sprachwächter) aus vernichtungs-offenlegungsregister wiederverwendet. Ausgabe: statische CSV/JSON mit nur zwei Status, „gefunden“ oder „kein Plan gefunden (Stand, Suchweg)“, nie „säumig“ oder „Verstoß“, weil die Pflicht bedingt ist. Keine Quote gegen die Schätzung von rund 16.461 Verpflichteten, nur „N gefundene Pläne, davon M Maßnahmen offen“; Selektionshinweis fest im Kopf jeder Auswertung. Schema vorläufig, bis die aktuelle BAFA-Merkblattfassung gelesen ist. Nicht dabei: keine MWh und kein Kapitalwert (stehen nicht in den Plänen), kein Firmenranking, kein Dauer-Crawler, kein Server, keine Beratung.',
    sketchEn: 'Input: one plan per company and plan version, entered into umsetzungsplan-schema.json by hand or as a confirmed LLM suggestion, with source URL, retrieval date, archive snapshot and a rechtsstand field (old / amended § 9); for missing plans, date and search path. Logic: deterministic checker pruefeUmsetzungsplan() without network or model: seven mandatory items present, status from the vocabulary, time frame parseable, investment volume numeric; outputs status distribution and investment total of open measures (every measure in the plan is cost-effective by definition, § 9(2)). Register core (status, search record, snapshot, CSV, language guard) reused from vernichtungs-offenlegungsregister. Output: static CSV/JSON with only two statuses, "found" or "no plan found (as of, search path)", never "overdue" or "violation", because the duty is conditional. No rate against the estimate of about 16,461 obliged companies, only "N plans found, M measures of them open"; a selection notice fixed at the top of every analysis. Schema provisional until the current BAFA guidance-sheet version has been read. Not included: no MWh and no net present value (not in the plans), no company ranking, no permanent crawler, no server, no advice.',
    firstStepDe: {
      ticket: 'Sieben Pflichtangaben als Schema, ein Prüfer, drei echte Pläne: umsetzungsplan-schema.json aus den sieben BAFA-Pflichtangaben (Priorität, Maßnahme, Investitionsvolumen, Zeitrahmen, Herkunft, verantwortliche Funktion, Status ∈ {Offen, In Bearbeitung, Abgeschlossen}) plus Feld rechtsstand (a. F. / n. F.) und ein deterministischer TypeScript-Prüfer pruefeUmsetzungsplan(plan). Vorbedingung: aktuell gültige Merkblattfassung auf bafa.de lesen; sonst trägt das Schema den Status „vorläufig“ und nennt die gelesene Fassung (12.02.2025).',
      criteria: 'Fertig, wenn eine Vitest-Suite grün ist (vollständiger Plan ohne Befund, fehlende Pflichtangabe, Status außerhalb des Vokabulars, unparsebarer Zeitrahmen, nicht-numerisches Investitionsvolumen, Statusverteilung und Investitionssumme „Offen“ korrekt, Freitext-Plan ohne Tabelle), drei Fixtures von Hand mit Quell-URL und Abrufdatum übertragen sind (Muster GmbH aus dem Merkblatt, Sanofi 11/2025, VON ARDENNE 04/2025), ein Test sicherstellt, dass keine Ausgabe „säumig“, „Verstoß“ oder „violation“ enthält, fehlende Pläne nur als „kein Plan gefunden“ mit Datum und Suchweg erscheinen und keine Quote gegen die Verpflichtetenzahl gebildet wird, jede Auswertung den Selektionshinweis trägt und keine Firmenrangfolge ausgibt, der Registerkern aus src/engine/vernichtungs-offenlegungsregister/ importiert wird, das Schema seinen Stand ausweist und alles unter 07-demos/umsetzungsplan-register/ liegt.'
    },
    firstStepEn: {
      ticket: 'Seven mandatory items as a schema, one checker, three real plans: umsetzungsplan-schema.json from the seven BAFA mandatory items (priority, measure, investment volume, time frame, origin, responsible function, status ∈ {Offen, In Bearbeitung, Abgeschlossen}) plus a rechtsstand field (old / amended § 9) and a deterministic TypeScript checker pruefeUmsetzungsplan(plan). Precondition: read the currently valid guidance-sheet version on bafa.de; otherwise the schema carries the status "provisional" and names the version read (12 Feb 2025).',
      criteria: 'Done when a Vitest suite is green (complete plan with no finding, missing mandatory item, status outside the vocabulary, unparseable time frame, non-numeric investment volume, correct status distribution and "open" investment total, prose-only plan without a table), three fixtures are transcribed by hand with source URL and retrieval date (Muster GmbH from the guidance sheet, Sanofi 11/2025, VON ARDENNE 04/2025), a test ensures no output contains "säumig", "Verstoß" or "violation", missing plans only appear as "no plan found" with date and search path and no rate against the number of obliged companies is computed, every analysis carries the selection notice and no company ranking is output, the register core is imported from src/engine/vernichtungs-offenlegungsregister/, the schema states its status, and everything lives under 07-demos/umsetzungsplan-register/.'
    },
    failureModeDe: 'Eine Quote aus gefundenen Plänen wird als Branchenquote gelesen: Veröffentlichen tun die Sorgfältigen, und wer keinen Plan zeigt, kann ausgenommen, unter der Schwelle oder nachlässig sein. Gegenmaßnahme in der Architektur: nur „N gefundene Pläne, davon M Maßnahmen offen“, Selektionshinweis in jeder Auswertung, nie „säumig“, keine Quote gegen die 16.461-Schätzung. Zweitens Pranger- und Lead-Listen-Lesart (offene Maßnahmen + Investitionsvolumen je Firma ist auch eine Vertriebsliste): kein Firmenranking, nur Aggregat und Einzelnachweis mit Quelle. Drittens beantragt der Bundesrat die Streichung der Veröffentlichungspflicht; das wäre wegen EED Art. 11 Abs. 2 unionsrechtswidrig, hieße aber de facto weniger Pläne — die Dose trägt unter altem und neuem § 9 (Feld rechtsstand). Offen gelegt: Schema vorläufig bis zur aktuellen Merkblattfassung, Formatdrift möglich, keine Energiemengen, Empfängerperson vor Versand erneut verifizieren.',
    failureModeEn: 'A rate from the plans found is read as a sector rate: the diligent publish, and a company without a visible plan may be exempt, below the threshold or negligent. Architectural remedy: only "N plans found, M measures of them open", a selection notice in every analysis, never "overdue", no rate against the 16,461 estimate. Second, pillory and sales-lead readings (open measures + investment volume per company is also a sales list): no company ranking, only aggregates and individual evidence with source. Third, the Bundesrat requests deleting the publication duty; that would breach EED Art. 11(2) but would de facto mean fewer plans — the tin works under both old and amended § 9 (rechtsstand field). Disclosed openly: schema provisional until the current guidance-sheet version is read, format drift possible, no energy quantities, recipient person to be re-verified before sending.',
    priorArtDe: 'Frei (28.09.2026, Dreifachfund aller drei Engines, 6 Gegen-Suchen des Reviewers DE/EN, Normtexte und drei Plan-PDFs selbst gelesen): Kein Aggregator der veröffentlichten § 9-Pläne gefunden (DENEFF, Fraunhofer ISI, Umweltinstitut, BfEE, EED-Art.-11-Tracker). Nur Berater-Erklärtexte (Luther, IHK Hannover; Grant Thornton, DQS, twobirds, energieundrecht.com teils mit überholter Referentenentwurfs-Lesart „Unternehmensregister“). Fraunhofer-ISI-Kurzexpertise für DENEFF und Umweltinstitut-Modellrechnung (~54 TWh) arbeiten mit Modellen, nicht mit Plandaten; zwei Springer-Papers 2025 mit nicht-öffentlichen Auditdaten. Die Norm nennt keinen Sammler (EED Art. 11 Abs. 3 nur Verbrauchsdaten). Restlücke: offenes, datiertes Register mit deterministischem Prüfer gegen die BAFA-Pflichtangaben und neutralem Status. Dose: https://felixinberlin.github.io/Amelie/#dose=umsetzungsplan-register',
    priorArtEn: 'Free (28 Sep 2026, triple find by all three engines, 6 counter-searches by the reviewer in German and English, legal texts and three plan PDFs read in full): no aggregator of published § 9 plans found (DENEFF, Fraunhofer ISI, Umweltinstitut, BfEE, EED Art. 11 trackers). Only consultant explainers (Luther, IHK Hannover; Grant Thornton, DQS, twobirds, energieundrecht.com, partly with an outdated ministerial-draft reading of "company register"). The Fraunhofer ISI short study for DENEFF and the Umweltinstitut model calculation (~54 TWh) use models, not plan data; two 2025 Springer papers use non-public audit data. The law names no collector (EED Art. 11(3) covers consumption data only). Remaining gap: an open, dated register with a deterministic checker against the BAFA mandatory items and neutral status. Tin: https://felixinberlin.github.io/Amelie/#dose=umsetzungsplan-register'
  },
  {
    id: 'amelie-umwelt-anomalie',
    title: 'Umwelt-Anomalie-Detektor',
    titleEn: 'Environmental Anomaly Detector for Citizen Science and Municipalities',
    oneLinerDe: 'Statistische Anomalie-Erkennung für Bürgerwissenschaften (BUND) und kommunale Umweltämter — erkennt ungewöhnliche Trends in Zeitreihen und Geodaten (GBIF, UBA) direkt im Browser.',
    oneLinerEn: 'Statistical anomaly detection for citizen science (BUND) and municipal environmental agencies — identifies unusual trends in time series and geodata (GBIF, UBA) client-side.',
    date: '28. September 2026',
    reviewAfter: 'März 2027',
    recipientsDe: 'BUND (Bund für Umwelt und Naturschutz Deutschland) · kommunale Umweltämter',
    recipientsEn: 'BUND (Friends of the Earth Germany) · municipal environmental agencies',
    domain: 'civic',
    verdict: 'gift',
    status: 'gepackt',
    tags: ['Open Data', 'Citizen Science', 'BUND', 'Umweltbundesamt', 'GBIF', 'Anomalie', 'Statistik'],
    problemDe: 'Die Erhebung von Umweltdaten durch Bürgerwissenschaften und kommunale Umweltämter nimmt stetig zu. Die Herausforderung liegt im schnellen Erfassen signifikanter Veränderungen oder ungewöhnlicher Muster in großen Datensätzen ohne teure Spezialsoftware.',
    problemEn: 'Environmental data collection by citizen scientists and municipal environmental agencies is growing steadily. The challenge lies in quickly identifying significant changes or unusual patterns in large datasets without expensive specialized software.',
    whyNowDe: [
      'Offene Datenschnittstellen (GBIF, Umweltbundesamt APIs) sind reif und frei zugänglich.',
      'Statistische Web-Algorithmen und Visualisierungsbibliotheken (D3.js, scikit-learn.js) laufen performant 100% offline im Browser.'
    ],
    whyNowEn: [
      'Open data APIs (GBIF, German Federal Environmental Agency) are mature and accessible.',
      'Statistical web algorithms and visualization libraries run performantly 100% client-side.'
    ],
    sketchDe: 'Browser-Applikation zum Upload von CSVs oder Anbindung von Open APIs (GBIF, UBA). Ein deterministischer Anomalie-Detektor hebt Abweichungen in Zeitreihen und Raumkoordinaten visuell auf Karten und Diagrammen hervor.',
    sketchEn: 'Browser app for CSV upload or Open API connection (GBIF, UBA). A deterministic anomaly detector visually highlights deviations in time series and spatial coordinates on maps and charts.',
    firstStepDe: {
      ticket: 'Minimaler CSV-Uploader mit 2D-Zeitreihen-Anomalielöser.',
      criteria: 'Fertig, wenn hochgeladene Messreihen Ausreißer nach 3-Sigma-Regel oder IQR im Browser visualisieren.'
    },
    firstStepEn: {
      ticket: 'Minimal CSV uploader with 2D time series anomaly solver.',
      criteria: 'Done when uploaded measurement series visualize outliers via 3-sigma or IQR rule client-side.'
    },
    failureModeDe: 'Scheingenauigkeit: Fehlalarme bei natürlichen Schwankungen. Gegenmaßnahme: klare Konfidenzintervalle und transparente Schwellenwerte.',
    failureModeEn: 'False positives on natural fluctuations. Remedy: clear confidence intervals and transparent thresholds.',
    priorArtDe: 'Frei (28.09.2026): Verschiedene GIS- und Statistiktools existieren für Experten; kein niederschwelliges, kostenloses Web-Tool für Ehrenamtliche.',
    priorArtEn: 'Free (28 Sep 2026): Various expert GIS and statistical tools exist; no lightweight, free web tool for volunteers.'
  }
];

export const DISCARDED_DATA: DiscardedItem[] = [
  {
    id: 'die-daten-schicht',
    title: 'Die Daten-Schicht (Synchronous Transcription Events)',
    originalIdeaDe: 'Eine Transkriptions-Plattform, die nur für intensive, geplante 30-Minuten-"Schichten" öffnet, bei denen Hunderte von Volunteers gleichzeitig tippen.',
    originalIdeaEn: 'A transcription platform that is intentionally closed most of the time and only opens for intense, scheduled 30-minute "shifts" where hundreds of volunteers type simultaneously.',
    whyDiscardedDe: 'Das Konzept von synchronen Transkriptions-Events ist unter dem Begriff "Transcribathons" (z.B. von Europeana) bereits etabliert.',
    whyDiscardedEn: 'The concept of synchronous transcription events is already established under the term "Transcribathons" (e.g. by Europeana).',
    lessonDe: 'Synchrone Crowdsourcing-Events sind kein neues Format; der Community-Aspekt wird in der Nische bereits gepflegt.',
    lessonEn: 'Synchronous crowdsourcing events are not a new format; the community aspect is already well cultivated in the niche.',
    domain: 'Zivilgesellschaft / Citizen Science',
    evidence: [
      'Europeana Transcribathons'
    ],
    cause: 'gebaut',
    killer: 'gemeinnuetzig',
    foundBy: 'englisch',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'Lacunar Runde 5',
    diedOn: '2026-09-24',
    resurrectIfDe: 'Wenn eine technologische Neuerung den synchronen Event funktional unabdingbar macht.',
    resurrectIfEn: 'If a technological advancement makes the synchronous event functionally indispensable.'
  },
  {
    id: 'git-archaeologist',
    title: 'git-archaeologist (MCP)',
    originalIdeaDe: 'Repo-History als Frage-Interface: Warum existiert diese Zeile? Kette aus blame → PR → Issue → Diskussion.',
    originalIdeaEn: 'Repo history inquiry interface: Why does this line exist? Connect blame → PR → Issue → discussion thread.',
    whyDiscardedDe: 'Innerhalb von wenigen Monaten mehrfach unabhängig von verschiedenen Entwicklern und Firmen gebaut (u.a. codebase-archaeology MCP, GitKraken MCP).',
    whyDiscardedEn: 'Independently built multiple times within months by different developers and companies (codebase-archaeology MCP, GitKraken MCP tools).',
    lessonDe: 'Bei naheliegenden Tooling-Ideen im aktiven Ökosystem beträgt das Zeitfenster Monate, nicht Jahre.',
    lessonEn: 'In active developer tooling ecosystems, the window of unbuilt obvious ideas is months, not years.',
    domain: 'DevTools & MCP',
    evidence: [
      'codebase-archaeology MCP Server',
      'GitKraken Code History MCP integration',
      'GitHub Copilot commit context tracing'
    ],
    cause: 'gebaut',
    killer: 'community',
    foundBy: 'unbekannt',
    origin: 'ideenliste',
    stage: 'kandidat',
    bornIn: 'Runde 1 · Ideenliste',
    diedOn: '2026-09',
    resurrectIfDe: 'nie — naheliegendes Tooling im aktiven MCP-Ökosystem wird mehrfach gebaut.',
    resurrectIfEn: 'never — obvious tooling in the active MCP ecosystem gets built many times over.',
    nachruf: '08-friedhof/nachrufe.md'
  },
  {
    id: 'home-network-mcp',
    title: 'Home-Network MCP',
    originalIdeaDe: 'Router als Tool-Server: Wer ist im Netz, Bandbreite, DNS-Blocklisten togglen per Chat statt Web-Interface.',
    originalIdeaEn: 'Home router as an agent tool server: check active devices, bandwidth, toggle DNS blocklists via chat.',
    whyDiscardedDe: 'Mindestens vier unabhängige FRITZ!Box-MCP-Server und Home Assistant MCP-Integrationen existieren bereits.',
    whyDiscardedEn: 'At least four separate FRITZ!Box MCP servers and deep Home Assistant bidirectional integrations already exist in registries.',
    lessonDe: '„Naheliegendes Gerät + neues Protokoll" ist die am dichtesten besetzte Nische überhaupt. Existiert fast immer bereits.',
    lessonEn: '"Ubiquitous device + new protocol" is the most crowded niche imaginable. Almost always saturated.',
    domain: 'IoT & Smart Home',
    evidence: [
      'fritzbox-mcp (mehrere Forks auf GitHub)',
      'Home Assistant MCP server',
      'OpenWRT chat plugins'
    ],
    cause: 'gebaut',
    killer: 'community',
    foundBy: 'unbekannt',
    origin: 'ideenliste',
    stage: 'kandidat',
    bornIn: 'Runde 1 · Ideenliste',
    diedOn: '2026-09',
    resurrectIfDe: 'nie — mindestens vier unabhängige Server.',
    resurrectIfEn: 'never — at least four independent servers.',
    nachruf: '08-friedhof/nachrufe.md'
  },
  {
    id: 'repo-museum',
    title: 'Repo-Museum',
    originalIdeaDe: 'Begehbare 3D-Galerie der eigenen Repos: Repo = Raum, Commits = Exponate, tote Branches = Keller.',
    originalIdeaEn: 'Walkable 3D museum of git repos: repository = exhibition hall, commits = artifacts, stale branches = basement.',
    whyDiscardedDe: 'Bereits mehrfach als 3D-Städte gebaut (Gource, CodeCity, GitHub Skyline, 3D Repo Explorer). Die Museumsmetapher ist nur Designkosmetik, keine neue Fähigkeit.',
    whyDiscardedEn: 'Built repeatedly as 3D cities and galleries (Gource, CodeCity, GitHub Skyline). The museum theme is visual styling, not a functional breakthrough.',
    lessonDe: 'Ein Designunterschied allein ohne funktionale neue Fähigkeit rechtfertigt keine Dose zum Verschenken.',
    lessonEn: 'A visual theme difference alone without new capability does not justify an Amélie tin gift.',
    domain: 'Visualisierung & Demos',
    evidence: [
      'Gource 3D software visualization',
      'GitHub Skyline & 3D city repos',
      'CodeCity academic research'
    ],
    cause: 'gebaut',
    killer: 'community',
    foundBy: 'unbekannt',
    origin: 'ideenliste',
    stage: 'kandidat',
    bornIn: 'Runde 1 · Ideenliste',
    diedOn: '2026-09',
    resurrectIfDe: 'nur als eigenes Spielzeug, nie als Geschenk — die Metapher ist Design, keine Fähigkeit.',
    resurrectIfEn: 'only as a personal toy, never as a gift — the metaphor is design, not a capability.',
    nachruf: '08-friedhof/nachrufe.md'
  },
  {
    id: 'commute-oracle',
    title: 'Commute Oracle',
    originalIdeaDe: 'Kein offizielles Fahrplan-ETA, sondern ein persönliches Modell, das geloggte Fahrten lernt und sagt, wann man wirklich losmuss.',
    originalIdeaEn: 'Personal departure oracle: learns your real movement speed rather than transit schedule to predict exact departure time.',
    whyDiscardedDe: 'Kommerziell vollständig besetzt durch Citymapper (KI-Pendelprognose 2026) und Google Maps. Eine Einzelperson kann ohne Echtzeitflottendaten nicht konkurrieren.',
    whyDiscardedEn: 'Commercially dominated by Citymapper (AI commute prediction) and Google Maps transit telemetry.',
    lessonDe: 'Gegen Plattformen mit proprietären Milliarden-Echtzeitdatenpunkten kann ein offenes Geschenk ohne Daten nicht bestehen.',
    lessonEn: 'An open gift app cannot compete against commercial giants with billion-point live vehicle telemetry.',
    domain: 'Mobilität & Pendeln',
    evidence: [
      'Citymapper departure prediction AI',
      'Google Maps Commute Assistant',
      'Transit App personal arrival forecasting'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'unbekannt',
    origin: 'ideenliste',
    stage: 'kandidat',
    bornIn: 'Runde 1 · Ideenliste',
    diedOn: '2026-09',
    resurrectIfDe: 'nie — Pendelprognose ist ein Kernprodukt großer Kartenanbieter.',
    resurrectIfEn: 'never — commute prediction is a core product of large map providers.',
    nachruf: '08-friedhof/nachrufe.md'
  },
  {
    id: 'tafel-warenannahme',
    title: 'Tafel-Warenannahme per Foto',
    originalIdeaDe: 'Tafel-Fahrer fotografieren gespendete Ware, eine KI erfasst Menge und Qualität.',
    originalIdeaEn: 'Food-bank drivers photograph donated goods; AI records quantity and quality.',
    whyDiscardedDe: 'Tafel Deutschland hat es selbst: „Tafel macht Zukunft – gemeinsam digital" (BMEL, 1,5 Mio. €, 3 Jahre) mit Fahrer-App und Foto-Qualitätserfassung, alle großen Handelsketten beteiligt. In Runde 2 übersehen, am 18.09. von zwei Researchern unabhängig gefunden.',
    whyDiscardedEn: 'Tafel Deutschland built it themselves: a government-funded digitalisation programme (EUR 1.5m, 3 years) with a driver app that records goods quality by photo. Missed in round 2, found independently by two researchers on 18.09.',
    lessonDe: 'Bei Empfängern mit eigenem Digitalprojekt den ganzen Funktionsumfang lesen, nicht nur die erste Pressemitteilung.',
    lessonEn: 'For recipients with their own digital project, read the full feature set, not just the first press release.',
    domain: 'Lebensmittelrettung',
    evidence: [
      'Tafel macht Zukunft – gemeinsam digital (BMEL-Förderung)',
      'Fahrer-App mit Foto-Qualitätserfassung'
    ],
    cause: 'beim-empfaenger',
    killer: 'gemeinnuetzig',
    foundBy: 'empfaenger',
    origin: 'brainstorm',
    stage: 'kandidat',
    bornIn: 'Runde 2 · Ideenrunde',
    diedOn: '2026-09-18',
    resurrectIfDe: 'Wenn das Förderprojekt ausläuft und die App nicht weiterbetrieben wird.',
    resurrectIfEn: 'If the funded project ends and the app is not maintained.'
  },
  {
    id: 'balkonsolar-verschattung',
    title: 'Balkonkraftwerk-Verschattung per Handykamera',
    originalIdeaDe: 'Handykamera am Balkon aufnehmen, Verschattung über das Jahr berechnen, Ertrag eines Balkonkraftwerks schätzen.',
    originalIdeaEn: 'Point the phone camera from the balcony, compute shading over the year, estimate plug-in solar yield.',
    whyDiscardedDe: 'Horisol (Indie-App, im Akkudoktor-Forum vorgestellt, Juli 2026) und SunOnTrack AR tun genau das; dazu HTW-Simulator und PVGIS für den Ertrag.',
    whyDiscardedEn: 'Horisol (indie app, presented in the Akkudoktor forum, July 2026) and SunOnTrack AR do exactly this; HTW simulator and PVGIS cover yield.',
    lessonDe: 'Indie-Apps unter dem SEO-Radar findet nur die Forensuche — sie ist deshalb Suchschritt 4.',
    lessonEn: 'Indie apps under the SEO radar only show up in forum searches — hence search step 4.',
    domain: 'Energie & Solar',
    evidence: [
      'Horisol (Akkudoktor-Forum, Juli 2026)',
      'SunOnTrack AR',
      'HTW-Simulator, PVGIS'
    ],
    cause: 'gebaut',
    killer: 'community',
    foundBy: 'forum',
    origin: 'brainstorm',
    stage: 'kandidat',
    bornIn: 'Runde 2 · Ideenrunde',
    diedOn: '2026-09-16',
    resurrectIfDe: 'nie — Balkonsolar ist ein aktiver Bastlermarkt.',
    resurrectIfEn: 'never — plug-in solar is an active hobbyist market.'
  },
  {
    id: 'wheelmap-eingangsfoto',
    title: 'Wheelmap: Eingangsfoto → Barrierefreiheit',
    originalIdeaDe: 'Foto eines Hauseingangs → automatische Einschätzung für Wheelmap (Stufe, Rampe, Breite).',
    originalIdeaEn: 'Photo of an entrance → automatic accessibility assessment for Wheelmap (step, ramp, width).',
    whyDiscardedDe: 'Der Empfänger hat es selbst angestoßen: HIIG und Wheelmap veröffentlichten 2023 einen offenen Datensatz zu Stufen und Rampen an Eingängen, genau als Grundlage für solche Modelle.',
    whyDiscardedEn: 'The recipient started it: HIIG and Wheelmap published an open dataset of steps and ramps at entrances in 2023, precisely as training ground for such models.',
    lessonDe: 'Empfänger zuerst suchen — der billigste Kill und zugleich die schlechteste Erstansprache, die man sich spart.',
    lessonEn: 'Search the recipient first — the cheapest kill and the worst first contact avoided.',
    domain: 'Barrierefreiheit',
    evidence: [
      'HIIG + Wheelmap: offener Datensatz Stufen/Rampen (2023)'
    ],
    cause: 'beim-empfaenger',
    killer: 'gemeinnuetzig',
    foundBy: 'empfaenger',
    origin: 'brainstorm',
    stage: 'kandidat',
    bornIn: 'Runde 2 · Ideenrunde',
    diedOn: '2026-09-16',
    resurrectIfDe: 'nie — beim Empfänger selbst.',
    resurrectIfEn: 'never — the recipient owns it.'
  },
  {
    id: 'repair-cafe-diagnose',
    title: 'Repair-Café-Diagnoseassistent',
    originalIdeaDe: 'KI-Assistent, der Ehrenamtlichen im Repair Café bei der Fehlerdiagnose hilft.',
    originalIdeaEn: 'AI assistant that helps Repair Café volunteers diagnose faults.',
    whyDiscardedDe: 'Repair Café International berichtete im Juli 2026 selbst über KI-Diagnose; dazu das offene Projekt robotfreak/repair-cafe.',
    whyDiscardedEn: 'Repair Café International reported on AI diagnosis itself in July 2026; there is also the open project robotfreak/repair-cafe.',
    lessonDe: 'Wenn ein Feld „gerade besetzt wird", ist der Empfänger meist der Erste, der es tut.',
    lessonEn: 'When a field "is being taken right now", the recipient is usually the first to do it.',
    domain: 'Reparatur',
    evidence: [
      'Repair Café International, Artikel Juli 2026',
      'github.com/robotfreak/repair-cafe'
    ],
    cause: 'beim-empfaenger',
    killer: 'gemeinnuetzig',
    foundBy: 'empfaenger',
    origin: 'brainstorm',
    stage: 'kandidat',
    bornIn: 'Runde 2 · Ideenrunde',
    diedOn: '2026-09-16',
    resurrectIfDe: 'nie — beim Empfänger selbst.',
    resurrectIfEn: 'never — the recipient owns it.'
  },
  {
    id: 'chor-satb-trennung',
    title: 'Chor-Übedateien aus Aufnahme (SATB-Trennung)',
    originalIdeaDe: 'Aus einer Chorprobenaufnahme einzelne Übedateien für Sopran, Alt, Tenor, Bass erzeugen.',
    originalIdeaEn: 'Split a choir rehearsal recording into practice tracks for soprano, alto, tenor, bass.',
    whyDiscardedDe: 'MVSEP hat ein eigenes SATB-Modell, dazu MusiCraft und ChoirMate. Auf Deutsch unsichtbar, die englische Produktsuche fand es sofort.',
    whyDiscardedEn: 'MVSEP has a dedicated SATB model, plus MusiCraft and ChoirMate. Invisible in German, found at once by an English product search.',
    lessonDe: 'Kommerzielle Produkte tauchen auf Deutsch oft nicht auf — englische Produktwörter gehören in jede Prüfung.',
    lessonEn: 'Commercial products often do not show up in German — English product words belong in every check.',
    domain: 'Audio & Musik',
    evidence: [
      'MVSEP SATB-Modell',
      'MusiCraft',
      'ChoirMate'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'englisch',
    origin: 'brainstorm',
    stage: 'kandidat',
    bornIn: 'Runde 2 · Ideenrunde',
    diedOn: '2026-09-16',
    resurrectIfDe: 'nie — Stem-Trennung ist ein dichter Markt.',
    resurrectIfEn: 'never — stem separation is a crowded market.'
  },
  {
    id: 'mieter-schimmel-assistent',
    title: 'Mängelanzeige-/Schimmel-Assistent für Mieter',
    originalIdeaDe: 'Mieter dokumentieren Mängel und Schimmel per Foto, die App schreibt die Mängelanzeige.',
    originalIdeaEn: 'Tenants document defects and mould by photo; the app writes the formal defect notice.',
    whyDiscardedDe: 'Miet-Akte und SchimmelScan gibt es als kommerzielle Produkte.',
    whyDiscardedEn: 'Miet-Akte and SchimmelScan exist as commercial products.',
    lessonDe: 'Wenn Endnutzer dafür zahlen würden, existiert es (Faustregel Atlas).',
    lessonEn: 'If end users would pay for it, it exists (atlas rule of thumb).',
    domain: 'Wohnen & Miete',
    evidence: [
      'Miet-Akte',
      'SchimmelScan'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'unbekannt',
    origin: 'brainstorm',
    stage: 'kandidat',
    bornIn: 'Runde 2 · Ideenrunde',
    diedOn: '2026-09-16',
    resurrectIfDe: 'nie — Mieter-Tools sind kommerziell dicht.',
    resurrectIfEn: 'never — tenant tools are commercially crowded.'
  },
  {
    id: 'betriebskosten-pruefen',
    title: 'Betriebskostenabrechnung prüfen',
    originalIdeaDe: 'Foto der Nebenkostenabrechnung → Prüfung auf typische Fehler.',
    originalIdeaEn: 'Photo of the service-charge statement → check for typical errors.',
    whyDiscardedDe: 'MietKlar bietet das an.',
    whyDiscardedEn: 'MietKlar offers this.',
    lessonDe: 'Dieselbe Faustregel wie beim Schimmel: zahlungsbereite Endnutzer, also schon gebaut.',
    lessonEn: 'Same rule of thumb as for mould: paying end users, so already built.',
    domain: 'Wohnen & Miete',
    evidence: [
      'MietKlar'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'unbekannt',
    origin: 'brainstorm',
    stage: 'kandidat',
    bornIn: 'Runde 2 · Ideenrunde',
    diedOn: '2026-09-16',
    resurrectIfDe: 'nie.',
    resurrectIfEn: 'never.'
  },
  {
    id: 'hitze-schattenrouten',
    title: 'Hitze-Schattenrouten für Ältere',
    originalIdeaDe: 'Routenplaner, der ältere Menschen an Hitzetagen durch den Schatten führt.',
    originalIdeaEn: 'Route planner guiding older people through shade on hot days.',
    whyDiscardedDe: 'HEAL / shaded.ors (HeiGIT), Shadowmap und die Berliner Kühle-Orte-Karten decken das ab.',
    whyDiscardedEn: 'HEAL / shaded.ors (HeiGIT), Shadowmap and Berlin\'s cool-places maps cover it.',
    lessonDe: 'Was eine Stadt als Pressemitteilung verkaufen kann, existiert.',
    lessonEn: 'What a city can sell as a press release already exists.',
    domain: 'Stadt & Klima',
    evidence: [
      'HEAL / shaded.ors (HeiGIT)',
      'Shadowmap',
      'Berliner Kühle-Orte-Karten'
    ],
    cause: 'gebaut',
    killer: 'forschung',
    foundBy: 'unbekannt',
    origin: 'brainstorm',
    stage: 'kandidat',
    bornIn: 'Runde 2 · Ideenrunde',
    diedOn: '2026-09-16',
    resurrectIfDe: 'nie — Forschung und Kommunen sind aktiv.',
    resurrectIfEn: 'never — research and cities are active.'
  },
  {
    id: 'schulweg-gefahrenkarte',
    title: 'Kreuzungs-Falschparker & Schulweg-Gefahrenkarte',
    originalIdeaDe: 'Eltern melden zugeparkte Kreuzungen auf Schulwegen, die Karte zeigt Gefahrenstellen.',
    originalIdeaEn: 'Parents report blocked crossings on school routes; the map shows hazards.',
    whyDiscardedDe: 'Schulwegportal Berlin, VCD-Schulwege-Check und FixMyBerlin gibt es.',
    whyDiscardedEn: 'Berlin\'s school-route portal, the VCD school route check and FixMyBerlin exist.',
    lessonDe: 'Alltagsthemen mit Bürgerbezug sind 2026 voll — die Zivilgesellschafts-Regel gilt nur für Nischen ohne Endnutzer.',
    lessonEn: 'Everyday civic topics are full in 2026 — the civil-society rule only holds for niches without end users.',
    domain: 'Verkehr',
    evidence: [
      'Schulwegportal Berlin',
      'VCD-Schulwege-Check',
      'FixMyBerlin'
    ],
    cause: 'gebaut',
    killer: 'behoerde',
    foundBy: 'unbekannt',
    origin: 'brainstorm',
    stage: 'kandidat',
    bornIn: 'Runde 2 · Ideenrunde',
    diedOn: '2026-09-16',
    resurrectIfDe: 'nie.',
    resurrectIfEn: 'never.'
  },
  {
    id: 'radio-meteorscatter-korrelation',
    title: 'Radio-Meteorscatter × visuelle Zeugenmeldung',
    originalIdeaDe: 'Radio-Meteorechos und visuelle Zeugenmeldungen einer Feuerkugel in Echtzeit korrelieren.',
    originalIdeaEn: 'Correlate radio meteor echoes with visual fireball witness reports in real time.',
    whyDiscardedDe: 'FRIPON kombiniert Radio- und Videostationen bereits für Echtzeit-Trajektorien (arXiv 2111.09742).',
    whyDiscardedEn: 'FRIPON already combines radio and video stations for real-time trajectories (arXiv 2111.09742).',
    lessonDe: 'Messnetze der Forschung sind oft weiter als ihre Webseiten zeigen — arXiv zuerst.',
    lessonEn: 'Research measurement networks are often further along than their websites show — check arXiv first.',
    domain: 'Feuerkugeln & Meteore',
    evidence: [
      'FRIPON (arXiv 2111.09742)'
    ],
    cause: 'gebaut',
    killer: 'forschung',
    foundBy: 'englisch',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'Runde 3 · Bisoziation',
    diedOn: '2026-09-18',
    resurrectIfDe: 'nie.',
    resurrectIfEn: 'never.'
  },
  {
    id: 'infraschall-feuerkugel',
    title: 'Handy-Barometer/Infraschall für Feuerkugeln',
    originalIdeaDe: 'Barometer und Mikrofon von Handys erfassen den Infraschall einer Feuerkugel.',
    originalIdeaEn: 'Phone barometers and microphones capture a fireball\'s infrasound.',
    whyDiscardedDe: 'Die RedVox-App misst Infraschall bereits, unter anderem für Meteore und Boliden.',
    whyDiscardedEn: 'The RedVox app already measures infrasound, including meteors and bolides.',
    lessonDe: 'Sensorfusion mit Alltagsgeräten ist ein bekanntes Forschungsmuster, keine Lücke.',
    lessonEn: 'Sensor fusion with everyday devices is a known research pattern, not a gap.',
    domain: 'Feuerkugeln & Meteore',
    evidence: [
      'RedVox'
    ],
    cause: 'gebaut',
    killer: 'forschung',
    foundBy: 'englisch',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'Runde 3 · Bisoziation',
    diedOn: '2026-09-18',
    resurrectIfDe: 'nie.',
    resurrectIfEn: 'never.'
  },
  {
    id: 'baum-stigmergie',
    title: 'Baum-Stigmergie (Kontrollhistorie am Baum)',
    originalIdeaDe: 'Der Baum trägt einen lesbaren, mitwachsenden Hinweis auf seine eigene Kontrollhistorie.',
    originalIdeaEn: 'The tree carries a legible, growing record of its own inspection history.',
    whyDiscardedDe: 'Dynamische QR-Baumplaketten mit öffentlichem Portal gibt es kommerziell: baumplaketten.de, BaumDex, Baumsicht, CheckTrees, dazu ein QR-Pilot (ACM 2023).',
    whyDiscardedEn: 'Dynamic QR tree tags with public portals exist commercially: baumplaketten.de, BaumDex, Baumsicht, CheckTrees, plus a QR pilot (ACM 2023).',
    lessonDe: 'Physisches Objekt + gesetzliche Sichtprüfung = eigene Softwarebranche. Vor jeder Idee in diesem Muster die Branche suchen.',
    lessonEn: 'Physical object + statutory visual inspection = its own software industry. Search for the industry before any idea in this pattern.',
    domain: 'Stadtbäume & Prüfpflicht',
    evidence: [
      'baumplaketten.de',
      'BaumDex',
      'Baumsicht',
      'CheckTrees',
      'QR-Baummanagement (ACM 2023)'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'deutsch',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'Runde 3 · Bisoziation',
    diedOn: '2026-09-18',
    resurrectIfDe: 'nie — Muster „Objekt + Prüfpflicht" ist dicht.',
    resurrectIfEn: 'never — the "object + inspection duty" pattern is dense.'
  },
  {
    id: 'baum-verfallsdatum',
    title: 'Baum-Verfallsdatum (Befund verfällt ohne Foto-Bestätigung)',
    originalIdeaDe: 'Ein Kontrollbefund im Baumkataster verliert an Gültigkeit, wenn er nicht per Foto-Vergleich bestätigt wird.',
    originalIdeaEn: 'A tree-register inspection finding expires unless confirmed by photo comparison.',
    whyDiscardedDe: 'KI-Baumgesundheit aus Wiederholungsfotos ist 2026 Standard: Tree Inventory AI, greehill, ArboStar, TreeTect.',
    whyDiscardedEn: 'AI tree health from repeat photography is standard in 2026: Tree Inventory AI, greehill, ArboStar, TreeTect.',
    lessonDe: 'Stirbt der erste Kandidat eines Ankers an einer ganzen Anbieterkategorie, ist der Anker dicht — wechseln statt nachlegen.',
    lessonEn: 'If a source\'s first candidate dies against a whole vendor category, the source is dense — switch instead of trying again.',
    domain: 'Stadtbäume & Prüfpflicht',
    evidence: [
      'Tree Inventory AI',
      'greehill',
      'ArboStar',
      'TreeTect'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'englisch',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'Runde 3 · Bisoziation',
    diedOn: '2026-09-18',
    resurrectIfDe: 'nie.',
    resurrectIfEn: 'never.'
  },
  {
    id: 'schimmel-symptomdiagnose',
    title: 'Schimmel-Symptomdiagnose (Ursachen-Band)',
    originalIdeaDe: 'Symptome antippen → Band der Ursachen (Wärmebrücke oder Lüften), ohne Grundriss.',
    originalIdeaEn: 'Tap symptoms → band of causes (thermal bridge or ventilation), no floor plan.',
    whyDiscardedDe: 'Taupunkt- und fRsi-Rechner gibt es in Menge (SchimmelScan, Silberkraft, Deutschlandrechner), und das Atlasfeld Mieter-Schimmel war bereits dicht.',
    whyDiscardedEn: 'Dew-point and fRsi calculators abound (SchimmelScan, Silberkraft, Deutschlandrechner), and the tenant-mould atlas field was already dense.',
    lessonDe: 'Der Atlas hätte die Suche gespart — Vorfilter vor der Suche.',
    lessonEn: 'The atlas would have saved the search — pre-filter before searching.',
    domain: 'Wohnen & Miete',
    evidence: [
      'SchimmelScan Taupunkt-Rechner',
      'Silberkraft fRSI-Rechner',
      'Deutschlandrechner'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'eigener-bestand',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'Runde 4 · Bisoziation (Altbau Thermal)',
    diedOn: '2026-09-19',
    resurrectIfDe: 'nie.',
    resurrectIfEn: 'never.'
  },
  {
    id: 'hausweite-symptomkarte',
    title: 'Hausweite Symptomkarte (Schimmel über Etagen)',
    originalIdeaDe: 'Nachbarn melden Schimmel und Kälte pro Wohnung; das Muster über Etagen soll einen Bauschaden beweisen.',
    originalIdeaEn: 'Neighbours report mould and cold per flat; the pattern across floors is meant to prove a building defect.',
    whyDiscardedDe: 'Rechtlich wirkungslos: Laut BGH ist eine Wärmebrücke, die dem Standard der Bauzeit entspricht, kein Mangel (Suchtreffer, Volltext nicht gelesen). Ein Beweiswerkzeug für einen Streit, in dem der Befund nicht trägt, hat keinen Empfänger.',
    whyDiscardedEn: 'Legally ineffective: per the German Federal Court, a thermal bridge that met the standard of its construction era is not a defect (search result, full text not read). An evidence tool for a dispute where the finding does not count has no recipient.',
    lessonDe: 'Bei Beweis- und Meldewerkzeugen zuerst fragen, ob der Befund rechtlich überhaupt zählt.',
    lessonEn: 'For evidence and reporting tools, first ask whether the finding counts legally at all.',
    domain: 'Wohnen & Miete',
    evidence: [
      'BGH: Wärmebrücke nach Baualtersstandard kein Mangel (Suchtreffer)'
    ],
    cause: 'reality-check',
    killer: 'keiner',
    foundBy: 'deutsch',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'Runde 4 · Bisoziation (Altbau Thermal)',
    diedOn: '2026-09-19',
    resurrectIfDe: 'Wenn sich die Rechtsprechung zu Wärmebrücken im Bestand ändert.',
    resurrectIfEn: 'If case law on thermal bridges in old buildings changes.'
  },
  {
    id: 'abrechnungsfoto-kalibrierung',
    title: 'Abrechnungsfoto → Raumverbrauch als Kalibrierung',
    originalIdeaDe: 'Foto der Heizkostenabrechnung liefert Raumliste und Verbrauch pro Raum als Kalibrierung für die Wohnungssimulation.',
    originalIdeaEn: 'Photo of the heating bill supplies room list and per-room consumption to calibrate the flat simulation.',
    whyDiscardedDe: 'Physikalisch nicht tragfähig: Verbrauchseinheiten von ista und Techem sind nicht genormt und ohne Bewertungsfaktoren keine physikalische Größe.',
    whyDiscardedEn: 'Physically unsound: ista and Techem consumption units are not standardised and, without rating factors, are not a physical quantity.',
    lessonDe: 'Vor der Existenzfrage prüfen, ob die Eingabedaten messen, was die Idee braucht.',
    lessonEn: 'Before asking whether it exists, check whether the input data measure what the idea needs.',
    domain: 'Energie & Heizung',
    evidence: [
      'Suchtreffer 123recht / HeizkostenChecker zu Verbrauchseinheiten'
    ],
    cause: 'reality-check',
    killer: 'keiner',
    foundBy: 'deutsch',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'Runde 4 · Bisoziation (Altbau Thermal)',
    diedOn: '2026-09-19',
    resurrectIfDe: 'Wenn Heizkostenverteiler kWh statt dimensionsloser Einheiten liefern (Fernablesung ab 2027 prüfen).',
    resurrectIfEn: 'If heat-cost allocators report kWh instead of dimensionless units (check remote reading from 2027).'
  },
  {
    id: 'hausakte-gespiegelt',
    title: 'Hausakte mit gespiegelten Grundrissen',
    originalIdeaDe: 'Bauteil-Parameter einmal pro Haus erfassen, Grundrisse für Nachbarwohnungen spiegeln.',
    originalIdeaEn: 'Record building parameters once per house, mirror floor plans for neighbouring flats.',
    whyDiscardedDe: 'Steckt schon in Altbau Thermal („Adresse → Gebäudekontext aus EnergyMap vorbelegen").',
    whyDiscardedEn: 'Already part of Altbau Thermal ("address → pre-fill building context from EnergyMap").',
    lessonDe: 'Bisoziation erzeugt gern Bausteine der eigenen Dose — vor dem Zählen gegen den eigenen Bestand prüfen.',
    lessonEn: 'Bisociation tends to produce building blocks of the own Dose — check against own records before counting.',
    domain: 'Energie & Heizung',
    evidence: [
      'Dose Altbau Thermal'
    ],
    cause: 'duplikat',
    killer: 'eigener-bestand',
    foundBy: 'eigener-bestand',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'Runde 4 · Bisoziation (Altbau Thermal)',
    diedOn: '2026-09-19',
    resurrectIfDe: 'nie — lebt in Altbau Thermal weiter.',
    resurrectIfEn: 'never — lives on inside Altbau Thermal.'
  },
  {
    id: 'raumscan-heizlast',
    title: 'Raumscan/LiDAR → Heizlast',
    originalIdeaDe: 'Raum per LiDAR oder Foto scannen, daraus die Heizlast berechnen.',
    originalIdeaEn: 'Scan a room by LiDAR or photo and compute the heating load.',
    whyDiscardedDe: 'Für Fachleute fertig: ScanDom Heizlast, Heizreport Scanner App, Heizlast App 3D, magicplan (DIN/TS 12831).',
    whyDiscardedEn: 'Done for professionals: ScanDom Heizlast, Heizreport Scanner App, Heizlast App 3D, magicplan (DIN/TS 12831).',
    lessonDe: 'Eingabe-Beschleunigung (Scan statt Zeichnen) ist fast immer schon ein Profi-Produkt.',
    lessonEn: 'Input acceleration (scan instead of drawing) is almost always a professional product already.',
    domain: 'Energie & Heizung',
    evidence: [
      'ScanDom Heizlast',
      'Heizreport Scanner App',
      'Heizlast App 3D',
      'magicplan'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'deutsch',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'Runde 4 · Bisoziation (Altbau Thermal)',
    diedOn: '2026-09-19',
    resurrectIfDe: 'nie.',
    resurrectIfEn: 'never.'
  },
  {
    id: 'kirchen-baubegehung',
    title: 'Kirchen-Baubegehung digital',
    originalIdeaDe: 'Küster:innen machen die jährliche Baubegehung per App mit Foto-Mängelvorschlag statt Papier-Checkliste.',
    originalIdeaEn: 'Sextons do the annual building inspection by app with photo defect suggestions instead of a paper checklist.',
    whyDiscardedDe: 'Landeskirchen nutzen Gebäudemanagement-Software; ARCHIKART wirbt mit Zustandserfassung per Kontrollkatalog für Kirchenverwaltungen, dazu allgemeine Mängel-Apps (Capmo, BauMaster, firstaudit). Nur Schnipsel, Alter nicht geprüft.',
    whyDiscardedEn: 'Regional churches use building-management software; ARCHIKART advertises condition surveys via checklist for church administrations, plus general defect apps (Capmo, BauMaster, firstaudit). Snippets only, age unchecked.',
    lessonDe: 'Das Muster „Objekt + wiederkehrende Prüfung" hat auch hier seine Branche — der Atlas hätte es vorhergesagt.',
    lessonEn: 'The "object + recurring inspection" pattern has its industry here too — the atlas would have predicted it.',
    domain: 'Denkmal & Kirche',
    evidence: [
      'ARCHIKART',
      'Capmo',
      'BauMaster',
      'firstaudit'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'empfaenger',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'Runde 4 · Ideenrunde (Quelle: Denkmalbehörden)',
    diedOn: '2026-09-19',
    resurrectIfDe: 'nie.',
    resurrectIfEn: 'never.'
  },
  {
    id: 'schadenskartierung-foto',
    title: 'Schadenskartierung per Foto (Denkmalfassade)',
    originalIdeaDe: 'Foto einer Denkmalfassade → Vorschlag nach dem ZHD-Schadensbildkatalog.',
    originalIdeaEn: 'Photo of a heritage facade → suggestion according to the ZHD damage catalogue.',
    whyDiscardedDe: 'Kartierungssoftware existiert (Metigo MAP, KALIV), KI-Schadenserkennung an Denkmalen läuft (Wiro Rostock Pilot 2026, Archimede), Fachtagungen „KI und Denkmalpflege".',
    whyDiscardedEn: 'Mapping software exists (Metigo MAP, KALIV), AI damage detection on heritage buildings is running (Wiro Rostock pilot 2026, Archimede), specialist conferences on AI in conservation.',
    lessonDe: 'Fachprüfung ist besetzt; die Lücke lag beim Laien-Verlauf (Denkmal-Verlaufsblick überlebte).',
    lessonEn: 'Expert inspection is taken; the gap was the layperson\'s time series (Denkmal-Verlaufsblick survived).',
    domain: 'Denkmal & Kirche',
    evidence: [
      'Metigo MAP',
      'KALIV',
      'Wiro Rostock (Pilot 2026)',
      'Archimede'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'deutsch',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'Runde 4 · Ideenrunde (Quelle: Denkmalbehörden)',
    diedOn: '2026-09-19',
    resurrectIfDe: 'nie.',
    resurrectIfEn: 'never.'
  },
  {
    id: 'sandstein-streiflicht-relief',
    title: 'Sandstein-Streiflicht-Relief',
    originalIdeaDe: 'Vier Taschenlampenfotos zu einer Höhenkarte verwitterter Grabsteine verrechnen.',
    originalIdeaEn: 'Combine four flashlight photos into a height map of weathered gravestones.',
    whyDiscardedDe: 'Dieselbe Idee wie Streiflicht (Runde 2, `verengt`), mit identischem Beleg. Der Lauf hatte das Protokoll nicht durchsucht.',
    whyDiscardedEn: 'The same idea as Streiflicht (round 2, narrowed), with identical evidence. The run had not searched the log.',
    lessonDe: 'Jeder Lauf, auch aus einem anderen Modell, beginnt mit Strg+F im Protokoll.',
    lessonEn: 'Every run, including from another model, starts with Ctrl+F in the log.',
    domain: 'Kulturerbe',
    evidence: [
      'Streiflicht (Runde 2)'
    ],
    cause: 'duplikat',
    killer: 'eigener-bestand',
    foundBy: 'eigener-bestand',
    origin: 'modell-katalog',
    stage: 'kandidat',
    bornIn: 'Gemini-Lauf · Bisoziation',
    diedOn: '2026-09-19',
    resurrectIfDe: 'nie — lebt als Streiflicht weiter.',
    resurrectIfEn: 'never — lives on as Streiflicht.'
  },
  {
    id: 'crack-flora-watcher',
    title: 'Crack Flora Watcher (Ritzengrün-Wächter)',
    originalIdeaDe: 'Foto derselben Ritzenpflanze über Wochen → Zeitraffer mit Härtegrad-Score → #Krautschau-tauglicher Datensatz.',
    originalIdeaEn: 'Photograph the same pavement-crack plant over weeks → time-lapse with toughness score → #Krautschau-ready dataset.',
    whyDiscardedDe: 'Die Dose stand auf einem Satz: „keine der genannten Apps verfolgt dieselbe Einzelpflanze". Die erste englische Suche nach der Funktion fand GrowApp (GLOBE Niederlande: voriges Foto transparent zum Ausrichten, Zeitraffer ab Bild 2) und Nature\'s Notebook (USA-NPN: Einzelpflanzen registrieren und wiederholt besuchen). Die Gamifizierung betreibt Flora Incognita selbst.',
    whyDiscardedEn: 'The Dose rested on one sentence: "none of the named apps tracks the same individual plant". The first English search for the function found GrowApp (GLOBE Netherlands: previous photo overlaid for alignment, time-lapse from image 2) and Nature\'s Notebook (USA-NPN: register individual plants and revisit them). Flora Incognita runs the gamification itself.',
    lessonDe: 'Gegenstand und Mechanik getrennt suchen — Werkzeuge, die über ihre Funktion definiert sind, sind unsichtbar, solange man nach dem Gegenstand sucht. Und: Zwei Mails an Senckenberg und Flora Incognita waren schon fertig, eine als „sofort versendbar" markiert.',
    lessonEn: 'Search object and mechanism separately — tools defined by their function stay invisible while you search for the object. And: two mails to Senckenberg and Flora Incognita were already drafted, one marked "ready to send".',
    domain: 'Pflanzen & Citizen Science',
    evidence: [
      'GrowApp (GLOBE Niederlande)',
      'Nature\'s Notebook (USA-NPN)',
      'Flora Incognita Krautschau'
    ],
    cause: 'gebaut',
    killer: 'gemeinnuetzig',
    foundBy: 'englisch',
    origin: 'modell-katalog',
    stage: 'mail-entwurf',
    bornIn: 'Nachtrag 18.09. (aus dem Gemini-Lauf) · als Dose gepackt, zwei Mails entworfen',
    diedOn: '2026-09-21',
    resurrectIfDe: 'Wenn GrowApp und Nature\'s Notebook eingestellt werden. Die Nachfolgerin ist die Dose „Beobachtungsposten mit Übergabe".',
    resurrectIfEn: 'If GrowApp and Nature\'s Notebook shut down. Its successor is the Dose "Observation post with handover".',
    nachruf: '08-friedhof/grabbeigaben/crack-flora-watcher.md'
  },
  {
    id: 'gamifizierte-ritzenpflanzen',
    title: 'Gamifizierte Ritzenpflanzen-Entdeckung',
    originalIdeaDe: 'Abzeichen und Stufen für das Finden von Pflanzen in Pflasterfugen.',
    originalIdeaEn: 'Badges and levels for finding plants in pavement cracks.',
    whyDiscardedDe: 'Flora Incognita betreibt das selbst: Krautschau-Projekt in der App, Abzeichen über bis zu 40 Arten in fünf Stufen, von Senckenberg offiziell empfohlen. Flora Incognita stand in der Dose als nachrangiger Empfänger.',
    whyDiscardedEn: 'Flora Incognita runs it itself: a Krautschau project in the app, badges for up to 40 species in five levels, officially recommended by Senckenberg. Flora Incognita was listed in the Dose as a secondary recipient.',
    lessonDe: 'Auch nachrangige Empfänger prüfen — jeder in der Dose genannte.',
    lessonEn: 'Check secondary recipients too — everyone named in the Dose.',
    domain: 'Pflanzen & Citizen Science',
    evidence: [
      'floraincognita.de/krautschau',
      'senckenberg.de/de/krautschau'
    ],
    cause: 'beim-empfaenger',
    killer: 'forschung',
    foundBy: 'empfaenger',
    origin: 'modell-katalog',
    stage: 'dose',
    bornIn: 'Nachtrag 18.09. (aus dem Gemini-Lauf) · Teil von Crack Flora Watcher',
    diedOn: '2026-09-21',
    resurrectIfDe: 'nie — beim Empfänger selbst.',
    resurrectIfEn: 'never — the recipient owns it.'
  },
  {
    id: 'samenkarten-markt',
    title: 'Samenkarten-Markt, Cross-City-Handel, Auktionshaus',
    originalIdeaDe: 'Handelsökonomie für Pflanzen-Sammelkarten zwischen Städten.',
    originalIdeaEn: 'Trading economy for plant collectible cards across cities.',
    whyDiscardedDe: 'Standard-Spieldesign ohne neue Fähigkeit — das Dokument nennt seine Vorbilder selbst (Pokémon GTS, Neopets, Animal Crossing, Axie Infinity …). Fällt nicht unter die These des Manifests.',
    whyDiscardedEn: 'Standard game design with no new capability — the document names its own models (Pokémon GTS, Neopets, Animal Crossing, Axie Infinity …). Outside the manifesto\'s thesis.',
    lessonDe: 'Wenn ein Brainstorm seine Vorbilder aufzählt, ist die Idee das Vorbild.',
    lessonEn: 'When a brainstorm lists its models, the idea is the model.',
    domain: 'Spiele',
    evidence: [
      'Vorbildliste in economy.txt §9'
    ],
    cause: 'mode',
    killer: 'keiner',
    foundBy: 'ohne-suche',
    origin: 'brainstorm',
    stage: 'kandidat',
    bornIn: 'Runde 6 · Fugenduell-Brainstorm',
    diedOn: '2026-09-21',
    resurrectIfDe: 'nie.',
    resurrectIfEn: 'never.'
  },
  {
    id: 'spiel-echte-pflanzenarten',
    title: 'Spiel über echte Pflanzenarten',
    originalIdeaDe: 'Ein Spiel, dessen Figuren echte Pflanzenarten mit echten Eigenschaften sind.',
    originalIdeaEn: 'A game whose pieces are real plant species with real traits.',
    whyDiscardedDe: 'Out and About (Yaldi Games, Steam 2026) und Niche (Stray Fawn, echte Genetik) sind fertig und gut besprochen.',
    whyDiscardedEn: 'Out and About (Yaldi Games, Steam 2026) and Niche (Stray Fawn, real genetics) are released and well reviewed.',
    lessonDe: '„Echte Wissenschaft als Spielsystem" ist ein Genre-Werkzeug, kein Alleinstellungsmerkmal.',
    lessonEn: '"Real science as game system" is a genre tool, not a differentiator.',
    domain: 'Spiele',
    evidence: [
      'Out and About (Yaldi Games, 2026)',
      'Niche (Stray Fawn)'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'englisch',
    origin: 'brainstorm',
    stage: 'kandidat',
    bornIn: 'Runde 6 · Spiel-Strang (Nebenbefund)',
    diedOn: '2026-09-21',
    resurrectIfDe: 'nie — Genre ist besetzt; frei blieb nur das lebende Spielobjekt.',
    resurrectIfEn: 'never — the genre is taken; only the living game piece stayed free.'
  },
  {
    id: 'wunschseite-nachfrage',
    title: 'Wunschseite / Nachfrage-Karte',
    originalIdeaDe: 'Nicht kartieren, was am Straßenrand steht, sondern was gebraucht wird.',
    originalIdeaEn: 'Map not what stands on the kerb, but what is needed.',
    whyDiscardedDe: 'Standardfunktion jeder Verschenk-Community: Olio „Wanted", Trash Nothing / Freecycle WANTED-Posts, Buy Nothing „ISO".',
    whyDiscardedEn: 'A standard feature of every giveaway community: Olio "Wanted", Trash Nothing / Freecycle WANTED posts, Buy Nothing "ISO".',
    lessonDe: 'Erst prüfen, wohin das Kernbild eines Colliders zieht — „Tausch" landet in einem dichten Feld.',
    lessonEn: 'First check where a collider\'s core image pulls — "exchange" lands in a dense field.',
    domain: 'Verschenken & Tauschen',
    evidence: [
      'Olio Wanted',
      'Trash Nothing / Freecycle',
      'Buy Nothing ISO'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'englisch',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'Runde 8 · Bisoziation (Trash Map)',
    diedOn: '2026-09-23',
    resurrectIfDe: 'nie.',
    resurrectIfEn: 'never.'
  },
  {
    id: 'raeumungsvorhersage',
    title: 'Räumungsvorhersage aus Kündigungsfristen',
    originalIdeaDe: 'Sperrmüllaufkommen je Straße aus dem dreimonatigen Vorlauf von Wohnungskündigungen vorhersagen.',
    originalIdeaEn: 'Predict bulky waste per street from the three-month notice period of tenancy terminations.',
    whyDiscardedDe: 'Scheitert an den Daten: Kündigungen sind nicht öffentlich, und wer sie bei Vermietern abfragt, sammelt Umzugsprofile. Kein Empfänger kann das rechtmäßig beschaffen.',
    whyDiscardedEn: 'Fails on data: terminations are not public, and whoever collects them from landlords builds moving profiles. No recipient can obtain this lawfully.',
    lessonDe: 'Datenfrage vor Existenzfrage — spart Suchbudget.',
    lessonEn: 'Data question before existence question — saves search budget.',
    domain: 'Verschenken & Tauschen',
    evidence: [
      'keine Suche; Datenschutz- und Beschaffungsfrage'
    ],
    cause: 'reality-check',
    killer: 'keiner',
    foundBy: 'ohne-suche',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'Runde 8 · Bisoziation (Trash Map)',
    diedOn: '2026-09-23',
    resurrectIfDe: 'Wenn es eine rechtmäßige, anonymisierte Quelle für Umzugsvolumen gibt.',
    resurrectIfEn: 'If a lawful, anonymised source of moving volumes appears.'
  },
  {
    id: 'paragraphen-dolmetscher',
    title: 'ParagraphenDolmetscher',
    originalIdeaDe: 'Foto des Amtsbescheids → Beamtendeutsch in drei klaren Sätzen, Frist erkennen, Widerspruch formulieren.',
    originalIdeaEn: 'Photo of an official decision letter → plain language in three sentences, detect the deadline, draft the objection.',
    whyDiscardedDe: 'Gibt es, kostenlos und in zehn Sprachen: jobcenter.guru (GuruSense AI) fotografiert den Bescheid, erklärt ihn per KI, erkennt die Frist und entwirft den Widerspruch (Stand der Seite 10.07.2026). Dazu amtly.app, briefgeist.de, papierfrei.app, docugov.ai. Und im eigenen Protokoll stand seit dem 18.09.2026 KlarLokal mit dem Nachbarn Zetteln — dieselbe Idee zum zweiten Mal gepackt. Der Satz der Dose „freie, bedingungslose Werkzeuge existieren nicht" war nie gesucht worden.',
    whyDiscardedEn: 'It exists, free and in ten languages: jobcenter.guru (GuruSense AI) photographs the letter, explains it with AI, detects the deadline and drafts the objection (page as of 10.07.2026). Also amtly.app, briefgeist.de, papierfrei.app, docugov.ai. And the own check log had listed KlarLokal with its neighbour Zetteln since 18.09.2026 — the same idea packed a second time. The Dose sentence "no free tools exist" had never been searched.',
    lessonDe: 'Ein Katalogeintrag, der ohne Protokollzeile zur Dose wird, überspringt den Vorfilter — hier hätte ein Blick in den eigenen Atlas genügt. Seit 24.09.2026 verhindert scripts/check-protokoll-coverage.mjs das.',
    lessonEn: 'A catalogue entry that becomes a Dose without a check-log line skips the pre-filter — a look at the own atlas would have sufficed here. Since 24.09.2026 scripts/check-protokoll-coverage.mjs prevents this.',
    domain: 'Behörden & Alltag',
    evidence: [
      'jobcenter.guru (GuruSense AI) — Foto, Erklärung, Frist, Widerspruchsentwurf, kostenlos',
      'amtly.app, briefgeist.de, papierfrei.app, docugov.ai',
      'KlarLokal / Zetteln (Prüfprotokoll, Nachtrag 18.09.2026)'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'deutsch',
    origin: 'modell-katalog',
    stage: 'dose',
    bornIn: 'Katalog „AI Frontier 2026" (Modelllauf) · als Dose gepackt',
    diedOn: '2026-09-24',
    resurrectIfDe: 'Wenn jobcenter.guru und die übrigen kostenlosen Angebote verschwinden — und dann zuerst KlarLokal prüfen, nicht diese Dose.',
    resurrectIfEn: 'If jobcenter.guru and the other free offerings disappear — and then check KlarLokal first, not this Dose.',
    nachruf: '08-friedhof/grabbeigaben/paragraphen-dolmetscher.md'
  },
  {
    id: 'hausbock-horcher',
    title: 'Hausbock-Horcher (Handy-Akustik im Dachstuhl)',
    originalIdeaDe: 'Handy (ggf. mit billigem Kontaktsensor) nimmt Fraßgeräusche im Dachstuhl auf, ein Klassifikator beantwortet „aktiver oder alter Hausbock-/Anobienbefall?" — auch als nächtliche Nachbarschafts-Horchaktion in Fachwerk-Altstädten.',
    originalIdeaEn: 'A phone (optionally with a cheap contact sensor) records larval feeding noise in the roof truss; a classifier answers "active or old house-longhorn / furniture-beetle infestation?" — also as a night-time neighbourhood listening campaign in half-timbered old towns.',
    whyDiscardedDe: 'Zweimal unabhängig gefunden (Ideenrunde und Bisoziation) und zweimal tot: Fraunhofer WKI misst Schadinsekten akustisch, die mobile Version „liefert gleichwertige Ergebnisse", eine App zur Datenerfassung wurde erprobt; kommerziell gibt es das „Insect Activity Detection System" (8 Schallaufnehmer, Mehrtagesmessung, Ortung). Dazu Physik: Der Nachweis läuft über Körperschall bei 20 kHz–2 MHz — außerhalb dessen, was ein Handymikrofon über Luftschall aufnimmt.',
    whyDiscardedEn: 'Found twice independently (ideenrunde and bisociation) and dead both times: Fraunhofer WKI detects wood-boring insects acoustically, its mobile version "delivers equivalent results", a data-capture app has been trialled; commercially there is the "Insect Activity Detection System" (8 transducers, multi-day measurement, localisation). Plus physics: detection runs on structure-borne sound at 20 kHz–2 MHz — outside what a phone microphone picks up through air.',
    lessonDe: 'Sensor-Kollisionen erzeugen ungeprüfte Physik (dritte Bestätigung nach der Nachprüfung vom 23.09.). Erst die Frequenz des Signals, dann die Idee.',
    lessonEn: 'Sensor collisions produce unchecked physics (third confirmation after the 23.09 re-check). Signal frequency first, idea second.',
    domain: 'Holz & Gebäude',
    evidence: [
      'Fraunhofer WKI, 31. Dt. Holzschutztagung 2022 — mobile akustische Detektion + App-Test (publica.fraunhofer.de)',
      'Insect Activity Detection System (insectactivitydetectionsystem.de)',
      'holzfragen.de „Hausbock Forschung" — Schallemission 20 kHz–2 MHz Körperschall'
    ],
    cause: 'beim-empfaenger',
    killer: 'forschung',
    foundBy: 'deutsch',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'Holz-Runde 27.09.2026 · Ideenrunde (Researcher #1) + Bisoziation (Researcher #2)',
    diedOn: '2026-09-27',
    resurrectIfDe: 'Wenn ein Körperschall-Aufsatz fürs Handy (≥ 100 kHz) unter 50 € erhältlich wird und weder WKI noch IADS ein Laienwerkzeug für die Aktiv/Inaktiv-Frage anbieten.',
    resurrectIfEn: 'If a phone contact-sensor add-on (≥ 100 kHz) under €50 appears and neither WKI nor IADS offers a lay tool for the active/inactive question.'
  },
  {
    id: 'holzart-handyfoto',
    title: 'Holzart per Handyfoto (EUDR/CITES-Gegencheck)',
    originalIdeaDe: 'Zoll, Händler, Tischler oder Verbraucher fotografiert Hirnholz (Makro/Lupe), KI bestimmt die Holzart und gleicht sie mit Etikett, EUDR-Erklärung bzw. CITES-Liste ab.',
    originalIdeaEn: 'Customs, traders, joiners or consumers photograph end grain (macro/loupe); AI identifies the species and checks it against the label, EUDR declaration or CITES list.',
    whyDiscardedDe: 'Zweimal unabhängig gefunden (Ideenrunde und Inversion), beide Male beim Empfänger tot: Das Thünen-Kompetenzzentrum Holzherkünfte bietet CITESwoodID und macroHOLZdata kostenlos als Apps an (seit 05/2022) und entwickelt mit dem Fraunhofer ITWM die KI-Bestimmung selbst (KI_Wood-ID, WoodFiberID, FNR-gefördert).',
    whyDiscardedEn: 'Found twice independently (ideenrunde and inversion), dead at the recipient both times: the Thünen Centre of Competence on the Origin of Timber offers CITESwoodID and macroHOLZdata as free apps (since 05/2022) and is building AI identification itself with Fraunhofer ITWM (KI_Wood-ID, WoodFiberID, FNR-funded).',
    lessonDe: 'Bundesforschungseinrichtungen mit „Kompetenzzentrum" im Namen haben ihre App meist schon — die Empfängersuche zuerst beendete den Kandidaten mit einer einzigen Suche.',
    lessonEn: 'Federal research bodies with "Centre of Competence" in their name usually already have their app — searching the recipient first ended the candidate in a single search.',
    domain: 'Holz & Handel',
    evidence: [
      'Thünen-Kompetenzzentrum Holzherkünfte — CITESwoodID, macroHOLZdata',
      'Thünen/Fraunhofer ITWM — Automatisierte Bilderkennung für die Holzartenbestimmung (KI_Wood-ID)',
      'hbz-nord.de — „Holzartenbestimmung per Smartphone – eine App für alles"'
    ],
    cause: 'beim-empfaenger',
    killer: 'forschung',
    foundBy: 'empfaenger',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'Holz-Runde 27.09.2026 · Ideenrunde (Researcher #1) + Inversion (Researcher #3)',
    diedOn: '2026-09-27',
    resurrectIfDe: 'Nie für die Holzartbestimmung; höchstens, wenn Thünen die Apps einstellt und die ITWM-KI nie veröffentlicht wird.',
    resurrectIfEn: 'Never for species identification; only if Thünen discontinues its apps and the ITWM AI is never released.'
  },
  {
    id: 'bohrmehl-foto',
    title: 'Bohrmehl-Foto (Borkenkäfer im Privatwald)',
    originalIdeaDe: 'Privatwaldbesitzer fotografiert den Stammfuß, KI erkennt Bohrmehl, die App meldet den Befall an den Förster.',
    originalIdeaEn: 'A private forest owner photographs the stem base, AI detects bore dust, the app reports the infestation to the forester.',
    whyDiscardedDe: 'Liegt im Atlas-Feld „Physisches Objekt + wiederkehrende Prüfpflicht + KI = dicht". Die Meldung ist gebaut (WaldKat mobile der LWK Niedersachsen, Waldpilot), und die Prämisse trägt nicht: Bohrmehl erkennt jeder Mensch leicht (AELF-Merkblätter) — der Engpass ist das Ablaufen der Bestände, nicht das Erkennen.',
    whyDiscardedEn: 'Sits in the atlas field "physical object + recurring inspection duty + AI = dense". Reporting is built (WaldKat mobile by LWK Lower Saxony, Waldpilot), and the premise fails: any person recognises bore dust easily (AELF leaflets) — the bottleneck is walking the stands, not recognising.',
    lessonDe: 'Wenn Menschen etwas mühelos erkennen, ist Bilderkennung keine Idee. Erst fragen: Liegt der Engpass im Sehen oder im Hingehen?',
    lessonEn: 'If people recognise something effortlessly, image recognition is not an idea. Ask first: is the bottleneck seeing or getting there?',
    domain: 'Wald',
    evidence: [
      'WaldKat mobile (LWK Niedersachsen) — Borkenkäfer-Meldung per App',
      'Waldpilot — Einschlagsmeldung, Holzliste, EUDR',
      'AELF Bayern — Borkenkäfer-Merkblätter (Bohrmehl-Erkennung)'
    ],
    cause: 'praemisse',
    killer: 'behoerde',
    foundBy: 'eigener-bestand',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'Holz-Runde 27.09.2026 · Ideenrunde (Researcher #1)',
    diedOn: '2026-09-27',
    resurrectIfDe: 'Wenn eine Forstbehörde benennt, dass Waldbesitzer Bohrmehl nicht erkennen (statt nicht ablaufen) — nie für die reine Meldefunktion.',
    resurrectIfEn: 'If a forestry authority names that owners fail to recognise bore dust (rather than to patrol) — never for the reporting function alone.'
  },
  {
    id: 'brennholz-raummass-check',
    title: 'Brennholz-Raummaß-Check',
    originalIdeaDe: 'Käufer fotografiert den gelieferten Brennholzstapel oder Schütthaufen, die App schätzt Ster/Schüttraummeter und warnt vor „Luftstapeln".',
    originalIdeaEn: 'A buyer photographs the delivered firewood stack or loose pile; the app estimates stacked/loose cubic metres and warns about "air stacks".',
    whyDiscardedDe: 'Gebaut, per englischer Suche in einem Treffer: „Firewood Identifier: AI" mit Stack-Modus (App Store, 2026) und Timberlog PhotoMeasure (Foto des Polters → Stammzahl, Durchmesser, Volumen); B2B dazu Timbeter.',
    whyDiscardedEn: 'Built, found by one English search: "Firewood Identifier: AI" with stack mode (App Store, 2026) and Timberlog PhotoMeasure (photo of the pile → log count, diameter, volume); B2B also Timbeter.',
    lessonDe: 'Konsum-Ideen, für die Endnutzer zahlen würden, zuerst englisch im App Store suchen — der Vorfilter hätte sie ohne Suche töten sollen.',
    lessonEn: 'Consumer ideas that end users would pay for: search the English app stores first — the pre-filter should have killed this without a search.',
    domain: 'Holz & Verbraucher',
    evidence: [
      'Firewood Identifier: AI (App Store id6762567109, Stack-Modus)',
      'Timberlog PhotoMeasure (Google Play)',
      'Timbeter (timbeter.com, B2B-Stapelvolumen)'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'englisch',
    origin: 'brainstorm',
    stage: 'kandidat',
    bornIn: 'Holz-Runde 27.09.2026 · Ideenrunde (Researcher #1)',
    diedOn: '2026-09-27',
    resurrectIfDe: 'Nie als Funktion; nur falls Eichbehörden oder eine Verbraucherzentrale ein amtliches Nachmessverfahren für Schüttraummeter fordern, das die Apps nicht abbilden.',
    resurrectIfEn: 'Never as a feature; only if metrology authorities or a consumer centre require an official re-measurement procedure the apps do not cover.'
  },
  {
    id: 'scheitholz-trocknungsuhr',
    title: 'Scheitholz-Trocknungsuhr',
    originalIdeaDe: 'Holzart, Scheitgröße, Stapeldatum und Lagerort → Prognose, wann der Wassergehalt unter 25 % (1. BImSchV) fällt, aus TFZ-Trocknungskurven und DWD-Wetter.',
    originalIdeaEn: 'Species, log size, stacking date and storage place → forecast of when moisture falls below 25 % (1st BImSchV), from TFZ drying curves and DWD weather.',
    whyDiscardedDe: 'Den Rechner gibt es (rechner-portal.de Holzfeuchte-Trocknungs-Rechner), die Kurven liegen als TFZ-Poster vor. Die Wetterkopplung wäre Physik, keine neue KI-Fähigkeit — fällt aus der Manifest-These.',
    whyDiscardedEn: 'The calculator exists (rechner-portal.de wood-moisture drying calculator), the curves exist as a TFZ poster. Weather coupling would be physics, not a new AI capability — outside the manifesto thesis.',
    lessonDe: 'Ein Rechner ohne neue Fähigkeit ist Modus, auch wenn es ihn in dieser Form noch nicht gibt.',
    lessonEn: 'A calculator without a new capability is mode, even if it does not yet exist in exactly this form.',
    domain: 'Holz & Verbraucher',
    evidence: [
      'rechner-portal.de — Holzfeuchte-Trocknungs-Rechner',
      'TFZ Straubing, Bericht 11 — Trocknungsverlauf Scheitholzsortimente (Poster)'
    ],
    cause: 'mode',
    killer: 'kommerziell',
    foundBy: 'deutsch',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'Holz-Runde 27.09.2026 · Ideenrunde (Researcher #1)',
    diedOn: '2026-09-27',
    resurrectIfDe: 'Wenn eine KI-Messung des Wassergehalts (aus Foto oder Klopfton) belegt machbar wird — dann ist die Messung die Idee, nicht die Uhr.',
    resurrectIfEn: 'If an AI measurement of moisture content (from photo or tap tone) is shown to be feasible — then the measurement is the idea, not the clock.'
  },
  {
    id: 'mikrohabitat-uebungsdeck',
    title: 'Mikrohabitat-Übungsdeck (Habitatbaum-Ansprache)',
    originalIdeaDe: 'Ein Übungsdeck mit bekannter Lösung, um die Ansprache von Baum-Mikrohabitaten (Höhlen, Totholz, Rindentaschen) zu kalibrieren — nach dem Muster von Eichflächen-Trainer und Bruchlesen.',
    originalIdeaEn: 'A training deck with known answers to calibrate the recording of tree microhabitats (cavities, deadwood, bark pockets) — following the Eichflächen-Trainer and Bruchlesen pattern.',
    whyDiscardedDe: 'Genau das sind Marteloskope: Übungsflächen mit digital erfassten Bäumen inkl. Mikrohabitaten, dazu die I+ Trainer Software des EFI (virtuelles Auszeichnen am Tablet mit Sofort-Rückmeldung) — seit Jahren in der Förster-Fortbildung (LWF Bayern, Landesforsten RLP, NRW seit 7 Jahren).',
    whyDiscardedEn: 'That is exactly what marteloscopes are: training plots with digitally recorded trees including microhabitats, plus the EFI I+ Trainer software (virtual marking on a tablet with instant feedback) — used for years in forester training (LWF Bavaria, Landesforsten RLP, NRW for 7 years).',
    lessonDe: 'Das „Übungsdeck mit bekannter Lösung" ist kein Freifahrtschein: Vor jedem neuen Deck „<Fach> Übungsfläche/Schulung Software" suchen.',
    lessonEn: 'The "training deck with known answers" is no free pass: before any new deck, search "<field> training plot / training software".',
    domain: 'Wald & Naturschutz',
    evidence: [
      'EFI Integrate+ / I+ Trainer (iplus.efi.int)',
      'LWF Bayern — Marteloskop-Fortbildungen',
      'waldwissen.net — 7 Jahre Marteloskope in NRW'
    ],
    cause: 'gebaut',
    killer: 'forschung',
    foundBy: 'deutsch',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'Holz-Runde 27.09.2026 · Bisoziation (Researcher #2)',
    diedOn: '2026-09-27',
    resurrectIfDe: 'Nie als Übungsdeck; höchstens, wenn das I+-Marteloskop-Netz eingestellt wird.',
    resurrectIfEn: 'Never as a training deck; only if the I+ marteloscope network is discontinued.'
  },
  {
    id: 'eudr-kleinwald-erklaerung',
    title: 'EUDR-Kleinwald-Erklärung',
    originalIdeaDe: 'Kleinwaldbesitzer zeichnet sein Flurstück, bekommt einen Entwaldungsfreiheitsnachweis aus offenen Satellitendaten und reicht die EUDR-Sorgfaltserklärung ein.',
    originalIdeaEn: 'A small forest owner draws the parcel, gets a deforestation-free proof from open satellite data and files the EUDR due-diligence statement.',
    whyDiscardedDe: 'Die Empfängersuche traf sofort: Waldpilot (Basis kostenlos, EUDR/Holzliste/Einschlagsmeldung), Sachsenforst-Geodatenwerkzeug, BMEL-Handreichung für Kleinprivatwald, timber worXs. Zusätzlich hat die EUDR-Vereinfachung (Postadresse statt Geokoordinaten für Kleinerzeuger aus Niedrigrisikoländern) den Engpass selbst weitgehend aufgelöst.',
    whyDiscardedEn: 'The recipient search hit at once: Waldpilot (free basic tier, EUDR/timber list/felling report), a Sachsenforst geodata tool, a BMEL guide for small private forests, timber worXs. On top, the EUDR simplification (postal address instead of geocoordinates for small producers from low-risk countries) largely removed the bottleneck itself.',
    lessonDe: 'Wo die EU gerade vereinfacht hat, stirbt die Vollzugslücke doppelt — erst am Gesetz, dann an den schon gebauten Apps.',
    lessonEn: 'Where the EU has just simplified, the enforcement gap dies twice — first at the law, then at the apps already built.',
    domain: 'Wald & Recht',
    evidence: [
      'waldpilot.app',
      'Sachsenforst — EUDR-Pflichten / Geodatenermittlung (sbs.sachsen.de)',
      'Bayerisches Waldbesitzerportal — FAQ EUDR; timberworxs.de/eudr'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'empfaenger',
    origin: 'brainstorm',
    stage: 'kandidat',
    bornIn: 'Holz-Runde 27.09.2026 · Inversion (Researcher #3)',
    diedOn: '2026-09-27',
    resurrectIfDe: 'Wenn die EUDR-Vereinfachung für Kleinerzeuger zurückgenommen wird und die bestehenden Forst-Apps die Einreichung hinter eine Bezahlschranke legen.',
    resurrectIfEn: 'If the EUDR simplification for small producers is reversed and the existing forestry apps paywall the submission.'
  },
  {
    id: 'holzschutzmittel-altlast-lotse',
    title: 'Holzschutzmittel-Altlast-Lotse (PCP/Lindan/DDT)',
    originalIdeaDe: 'Hauskäufer oder Renovierer gibt Baujahr und Region ein und fotografiert Ausblühungen/Anstrich am Dachstuhl → Verdachtsgrad nach PCP-Richtlinie, Anleitung zur Materialprobe.',
    originalIdeaEn: 'A home buyer or renovator enters construction year and region and photographs efflorescence/coating in the roof truss → suspicion level per PCP guideline, instructions for a material sample.',
    whyDiscardedDe: 'Der Rechner existiert: „Schadstoff-Check Altholz: Risiko nach Baujahr" (altholz-rustikal.de) schätzt nach Baujahr, Region (Ost/West, Hylotox) und Einsatzort, gestützt auf UBA und LAGA M20. Und der Foto-Teil hat keine Physik — PCP und Lindan sind auf einem Foto nicht sichtbar.',
    whyDiscardedEn: 'The calculator exists: "Schadstoff-Check Altholz: risk by construction year" (altholz-rustikal.de) estimates by year, region (East/West, Hylotox) and use, based on UBA and LAGA M20. And the photo part has no physics — PCP and lindane are invisible on a photo.',
    lessonDe: 'Reality-Check vor der Suche: Ist das Messziel optisch überhaupt sichtbar? Was überlebt, ist höchstens das Lesen von Indizien, die Menschen sehen (z. B. Etiketten), nicht der Stoff selbst.',
    lessonEn: 'Reality check before searching: is the measured target visible at all? What survives is at most reading clues people can see (e.g. labels), not the substance itself.',
    domain: 'Holz & Gebäude',
    evidence: [
      'altholz-rustikal.de — Schadstoff-Check Altholz (Rechner nach Baujahr)',
      'LfU Bayern — Schadstoffratgeber Gebäuderückbau Nr. 507 (Holzschutzmittel)',
      'umweltportal.nrw.de — PCP-Holzschutzmittel'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'deutsch',
    origin: 'brainstorm',
    stage: 'kandidat',
    bornIn: 'Holz-Runde 27.09.2026 · Inversion (Researcher #3)',
    diedOn: '2026-09-27',
    resurrectIfDe: 'Wenn ein peer-reviewtes Verfahren PCP/Lindan auf Holzoberflächen mit Smartphone plus Billig-Zubehör (Teststreifen-Kolorimetrie, Mini-NIR/Raman) nachweist.',
    resurrectIfEn: 'If a peer-reviewed method detects PCP/lindane on wood surfaces with a smartphone plus a cheap add-on (test-strip colorimetry, mini NIR/Raman).'
  },
  {
    id: 'rueckbauholz-vorsortierer',
    title: 'Rückbauholz-Vorsortierer (Handy-Vorsortierung nach DIN 4074 am Rückbauort)',
    originalIdeaDe: 'Zimmerei fotografiert ausgebaute Balken von vier Seiten; die KI erkennt Äste, Risse, Nagel- und Bohrlöcher und schätzt die Sortierklasse nach DIN 4074-1 (2026-05) samt Recyclingholz-Zusatzregeln als Vorsortierung vor dem Container.',
    originalIdeaEn: 'Carpenters photograph reclaimed beams from four sides; AI detects knots, cracks, nail and bolt holes and pre-grades them per DIN 4074-1 (2026-05) plus proposed reclaimed-timber rules before they hit the skip.',
    whyDiscardedDe: 'Der natürliche Empfänger baut es selbst: Im FNR-Verbund ReFoRe (TU Braunschweig iBHolz, Fraunhofer WKI, HTWK Leipzig, 01/2024–12/2026) entwickelt HTWK FLEX die systematische Erfassung von Abmessungen und Schadensmerkmalen wiederverwendbarer Holzbauteile (HoloLens, Artec Leo), die TU Braunschweig klassifiziert die mechanischen Eigenschaften.',
    whyDiscardedEn: 'The natural recipient is building it: in the FNR-funded ReFoRe consortium (TU Braunschweig iBHolz, Fraunhofer WKI, HTWK Leipzig, 01/2024–12/2026) HTWK FLEX develops systematic capture of dimensions and damage features of reusable timber members (HoloLens, Artec Leo); TU Braunschweig classifies their mechanical properties.',
    lessonDe: 'Frisch überarbeitete Norm + laufendes Förderprojekt = Empfänger zuerst ganz lesen; die Arbeitspaketbeschreibung tötet, nicht die Förderseite.',
    lessonEn: 'Freshly revised standard + running funded project = read the recipient fully first; the work-package description kills, not the funding page.',
    domain: 'Holzbau / Kreislaufwirtschaft',
    evidence: [
      'https://flex.htwk-leipzig.de/flexforschung/refore',
      'https://www.htwk-leipzig.de/forschen/forschungsprojekte/refore',
      'https://www.tu-braunschweig.de/ibholz/forschung/aktuelle-forschungsprojekte/refore',
      'https://www.wki.fraunhofer.de/en/research-projects/2024/refore-evaluation-and-processing-of-conctruction-waste-wood-for-reutilization-in-structural-timber-components.html'
    ],
    cause: 'beim-empfaenger',
    killer: 'forschung',
    foundBy: 'empfaenger',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'Holz-Runde · Ideenrunde #1 + Inversion #3 (Doppelfund), Review 27.09.2026',
    diedOn: '2026-09-27',
    resurrectIfDe: 'Wenn der ReFoRe-Abschlussbericht (nach 12/2026) nur ein Scanner-/HoloLens-Konzept ohne Handy-Feldwerkzeug liefert und die Feldtriage am Rückbauort ausdrücklich als offenen nächsten Schritt nennt.',
    resurrectIfEn: 'If the ReFoRe final report (after 12/2026) delivers only a scanner/HoloLens concept without a phone field tool and explicitly names on-site triage as an open next step.'
  },
  {
    id: 'kaminrauch-beweisbuch',
    title: 'Kaminrauch-Beweisbuch (Rauchopazität per Handyvideo + DWD-Wind für Nachbarn)',
    originalIdeaDe: 'Nachbarn filmen die Rauchfahne des Nachbarschornsteins; on-device-KI schätzt Opazität (Ringelmann-analog) und Farbe, kombiniert mit DWD-Wind zu einem Belastungsprotokoll für Ordnungsamt und Bezirksschornsteinfeger.',
    originalIdeaEn: 'Neighbours film the adjacent chimney plume; on-device AI estimates opacity (Ringelmann-like) and colour, combined with DWD wind into a nuisance log for the authority and district chimney sweep.',
    whyDiscardedDe: 'Reality-Check: (1) Die 1. BImSchV sieht kein optisches Nachweisverfahren vor, in UK zählt nur Beamten-Augenschein. (2) Holzöfen laufen vor allem an dunklen Winterabenden, eine Opazitätsschätzung per Handykamera ist dann unmöglich. (3) DSGVO: Dauerfilmen des Nachbargrundstücks für Beschwerden fällt nicht unter die Haushaltsausnahme. Übrig bleibt ein Tagebuch mit Winddaten, das jeder Ratgeber empfiehlt (keine neue Fähigkeit).',
    whyDiscardedEn: 'Reality check: (1) Germany\'s 1. BImSchV provides no optical evidence method; in the UK only officer-observed smoke counts. (2) Stoves run mainly on dark winter evenings, so phone-camera opacity estimation fails. (3) GDPR: continuously filming a neighbour\'s property for complaints is outside the household exemption. What remains is a diary with wind data, which every guide already recommends (no new capability).',
    lessonDe: 'Erst die Beweismittelfrage, dann die Funktionsfrage — und bei jedem Kamera-Kandidaten die Tageszeit der Belastung prüfen (Nachtcheck).',
    lessonEn: 'Ask whether the evidence counts before asking whether the function works — and check the time of day of the nuisance for every camera idea (night check).',
    domain: 'Luftreinhaltung / Nachbarschaft',
    evidence: [
      'https://www.schornsteinfegermeister.de/schornsteinfeger-informationen/schornsteinfeger-informationen-ueber-rauchbelaestigung.html',
      'https://www.walthamforest.gov.uk/neighbourhoods/pollution/air-quality-waltham-forest/smoke-control-and-wood-burning',
      'https://www.duh.de/fileadmin/user_upload/download/Projektinformation/Verkehr/Clean_Heat/L%C3%A4stige_Holzfeuerung_in_der_Nachbarschaft_H%C3%A4ufige_Fragen_und_Antworten.pdf',
      'https://thesilverbrief.blog/neighbour-bonfire-smoke-nuisance/'
    ],
    cause: 'reality-check',
    killer: 'keiner',
    foundBy: 'deutsch',
    origin: 'brainstorm',
    stage: 'kandidat',
    bornIn: 'Holz-Runde · Inversion #3 (OP-2), Gegenbeleg Ideenrunde #1, Review 27.09.2026',
    diedOn: '2026-09-27',
    resurrectIfDe: 'Wenn ein Bundesland oder die 1. BImSchV ein bildgestütztes Anlassverfahren (z. B. Foto-/Videomeldung als Auslöser einer Überprüfung) ausdrücklich zulässt und ein kostengünstiger Messweg für die Dunkelheit (PM-Sensor mit Windzuordnung) als Beleg anerkannt wird.',
    resurrectIfEn: 'If a federal state or the 1. BImSchV explicitly accepts image-based reports as a trigger for inspection, and a low-cost night-capable measurement (PM sensor with wind attribution) is recognised as evidence.'
  },
  {
    id: 'nachschraub-probe',
    title: 'Nachschraub-Probe (Reparierbarkeitsklasse nachzählen)',
    originalIdeaDe: 'Ehrenamtliche zählen die physischen Parameter der Reparierbarkeitsklasse nach VO (EU) 2023/1669 (Zerlegeschritte, Befestigungen, Werkzeug) aus dokumentierten Teardown-Videos nach festem Protokoll nach; neben der deklarierten Klasse steht eine „verifizierte" Spalte in marktüberwachungstauglicher Form (Collider: Speedrun-Verifikation).',
    originalIdeaEn: 'Volunteers recount the physical parameters of the EU repairability class under Regulation (EU) 2023/1669 (disassembly steps, fasteners, tools) from documented teardown videos following a fixed protocol; next to the declared class sits a "verified" column in a form market surveillance can use (collider: speedrun verification).',
    whyDiscardedDe: 'Der natürliche Empfänger macht es selbst: iFixit/Right to Repair Europe haben den Teardown-Korpus, die Zählkompetenz und das EPREL-Audit (09/2026). Unabhängige Verifikation existiert zudem kommerziell (TCO Certified verifiziert Reparierbarkeitsindizes durch akkreditierte Prüfer; UL 1590). Die Laienzählung wäre für die Marktüberwachung nur ein Anlass, kein Beweis. Review 21/35.',
    whyDiscardedEn: 'The natural recipient does it already: iFixit/Right to Repair Europe hold the teardown corpus, the counting expertise and the EPREL audit (09/2026). Independent verification also exists commercially (TCO Certified verifies repairability indices through accredited testers; UL 1590). A lay recount would only be a trigger for market surveillance, not evidence. Review 21/35.',
    lessonDe: '„claimed/verified" ist ein guter Rahmen, aber wer den Korpus hat, zählt selbst — bei Selbstauskunftsregimen zuerst suchen, wer schon Zweitprüfungen anbietet (Zertifizierer, NGO-Audits).',
    lessonEn: '"Claimed/verified" is a good frame, but whoever owns the corpus counts for themselves — in self-declaration regimes, first search for who already offers second checks (certifiers, NGO audits).',
    domain: 'Reparatur & Ökodesign',
    evidence: [
      'ifixit.com/News/119217 — R2R Europe/iFixit EPREL-Audit (09/2026) [Schnipsel]',
      'tcocertified.com — verifizierte Reparierbarkeitsindizes [Schnipsel]',
      'UL 1590 (Verifikationsverfahren Reparierbarkeit) [Schnipsel]'
    ],
    cause: 'beim-empfaenger',
    killer: 'gemeinnuetzig',
    foundBy: 'empfaenger',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'ESPR-Runde 28.09.2026 · Bisoziation Run 10 (Engine 2), Review 28.09.2026',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Wenn eine Marktüberwachungsbehörde ein Format veröffentlicht, in dem sie Dritt-Zerlegeprotokolle als Anlass annimmt, und iFixit es nicht bedient.',
    resurrectIfEn: 'If a market surveillance authority publishes a format for accepting third-party disassembly protocols as a trigger, and iFixit does not serve it.'
  },
  {
    id: 'ersatzteilpreis-pegel',
    title: 'Ersatzteilpreis-Pegel (Ersatzteilpreis-Zeitreihe)',
    originalIdeaDe: 'Datierte Snapshots der Herstellerpreisseiten für Ersatzteile (VO (EU) 2023/1670 Anh. II, Art. 5 RL (EU) 2024/1799 „angemessener Preis") pro Modell über sieben Jahre, relativ zum Einführungspreis — eine offene Zeitreihe statt Stichproben (Collider: Hochwassermarken).',
    originalIdeaEn: 'Dated snapshots of manufacturers\' spare-part price pages (Regulation (EU) 2023/1670 Annex II, Art. 5 Directive (EU) 2024/1799 "reasonable price") per model over seven years, relative to the launch price — an open time series instead of spot checks (collider: flood marks).',
    whyDiscardedDe: 'Keine neue Fähigkeit: Den datierten Vorher-Wert liefert das Internet Archive (Save Page Now) auf Knopfdruck, Preisverläufe sind ein Standardmuster (Keepa, camelcamelcamel), BEUC (06/2026) und vzbv machen die Stichproben selbst. Rechtlich misst die Reihe gegen keinen Schwellenwert: Anh. II verlangt nur einen Richtpreis (Höchstpreis gestrichen), „angemessen" ist nirgends beziffert. Scraper verrotten mit jedem Seitenumbau. Review 19/35; bewusst nicht mit dem Vernichtungs-Offenlegungsregister fusioniert.',
    whyDiscardedEn: 'No new capability: the Internet Archive (Save Page Now) produces the dated before-value on demand, price histories are a standard pattern (Keepa, camelcamelcamel), BEUC (06/2026) and vzbv run the spot checks themselves. Legally the series measures against no threshold: Annex II only requires an indicative price (the maximum price was dropped), and "reasonable" is quantified nowhere. Scrapers rot with every site redesign. Review 19/35; deliberately not merged into the destruction disclosure register.',
    lessonDe: 'Ein Doppelfund ist kein Freibrief: Zwei Engines fanden dieselbe Zeitreihe, aber ein Verlauf gegen einen unbezifferten Rechtsbegriff ist kein Prüfwerkzeug. Erst fragen, woran die Reihe gemessen wird.',
    lessonEn: 'A double find is no free pass: two engines found the same time series, but a history measured against an unquantified legal term is no audit tool. First ask what the series is measured against.',
    domain: 'Reparatur & Ökodesign',
    evidence: [
      'repair.eu/news/the-price-is-not-right [Schnipsel]',
      'BEUC-Marktcheck Ersatzteilpreise 06/2026 (Euronews 10.09.2026) [Schnipsel]',
      'vzbv Marktcheck Ersatzteile 2023 [Schnipsel]',
      'web.archive.org — Save Page Now'
    ],
    cause: 'mode',
    killer: 'gemeinnuetzig',
    foundBy: 'englisch',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'ESPR-Runde 28.09.2026 · Ideenrunde (Engine 1) + Bisoziation Run 10 (Engine 2), Doppelfund; Nachbar Ersatzteil-Stoppuhr (Inversion Run 4)',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Wenn ein Gericht, eine Behörde oder das deutsche Umsetzungsgesetz „angemessener Preis" relativ zu einem Referenzpreis beziffert — dann wird die Zeitreihe zum Prüfwerkzeug.',
    resurrectIfEn: 'If a court, an authority or the German transposition law quantifies "reasonable price" relative to a reference price — then the time series becomes an audit tool.'
  },
  {
    id: 'akkutausch-protokoll',
    title: 'Akkutausch-Protokoll (BattVO Art. 11)',
    originalIdeaDe: 'Geführter Ausbauversuch nach Kommissions-Leitlinie C/2025/214 (handelsübliches Werkzeug? Wärme? Lösungsmittel? Kleber?) → strukturiertes Protokoll pro Gerätemodell als Hinweis an die Marktüberwachung, ob der Akku im Sinne von Art. 11 VO (EU) 2023/1542 austauschbar ist.',
    originalIdeaEn: 'A guided removal attempt following Commission guideline C/2025/214 (commercially available tools? heat? solvents? glue?) → a structured protocol per device model as a tip to market surveillance on whether the battery is replaceable under Art. 11 Regulation (EU) 2023/1542.',
    whyDiscardedDe: 'Verfrüht und beim Empfänger: Die Pflicht gilt erst ab 18.02.2027, iFixit verfolgt die Umsetzung aktiv („The EU\'s Replaceable Battery Laws Are Finally Working") und hätte die Checkliste als Feld in seinen Guides. Ein Laienprotokoll ist kein Beweismittel, nur Anlass; die Checkliste selbst ist ein Formular ohne Why Now. Review 19/35.',
    whyDiscardedEn: 'Premature and with the recipient: the obligation applies only from 18.02.2027, iFixit actively tracks implementation ("The EU\'s Replaceable Battery Laws Are Finally Working") and would add the checklist as a field in its guides. A lay protocol is not evidence, only a trigger; the checklist itself is a form without a why-now. Review 19/35.',
    lessonDe: 'Pflichten mit Stichtag in der Zukunft sind keine Vollzugslücke, sondern ein Wiedervorlagetermin — Datum ins Grab, nicht in die Dose.',
    lessonEn: 'Obligations with a future start date are not an enforcement gap but a follow-up date — put the date on the grave, not into a Dose.',
    domain: 'Reparatur & Batterien',
    evidence: [
      'Kommissions-Leitlinie C/2025/214 zu Art. 11 BattVO [Schnipsel]',
      'ifixit.com — „The EU\'s Replaceable Battery Laws Are Finally Working" [Schnipsel]'
    ],
    cause: 'beim-empfaenger',
    killer: 'gemeinnuetzig',
    foundBy: 'englisch',
    origin: 'brainstorm',
    stage: 'kandidat',
    bornIn: 'ESPR-Runde 28.09.2026 · Inversion Run 4 (Engine 3, OP-2/OP-4), Review 28.09.2026',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Nach dem 18.02.2027, wenn eine Marktüberwachungsbehörde Bürgerhinweise zu Art. 11 BattVO anfordert und iFixit sie nicht strukturiert.',
    resurrectIfEn: 'After 18.02.2027, if a market surveillance authority asks for citizen tips on Art. 11 of the Batteries Regulation and iFixit does not structure them.'
  },
  {
    id: 'update-pegel',
    title: 'Update-Pegel (Sicherheitsupdates über die Zeit)',
    originalIdeaDe: 'Datierter Verlauf der tatsächlich gelieferten Sicherheitsupdates je Smartphone-Modell gegen die Update-Pflicht der VO (EU) 2023/1670 (Collider: Hochwassermarken).',
    originalIdeaEn: 'A dated history of security updates actually delivered per smartphone model against the update obligation of Regulation (EU) 2023/1670 (collider: flood marks).',
    whyDiscardedDe: 'Gebaut: endoflife.date/samsung-mobile führt 441 Samsung-Versionen mit Enddatum der Sicherheitsupdates, dazu endoflife.ai, eosl.date, SnoopSnitch und Presse-Übersichten (Engadget, nokiamob 08/2026). Der Rechtshebel ist schwach, weil die Pflicht nur greift, „wenn" ein Update erscheint. Review 19/35.',
    whyDiscardedEn: 'Built: endoflife.date/samsung-mobile lists 441 Samsung versions with security-update end dates, plus endoflife.ai, eosl.date, SnoopSnitch and press round-ups (Engadget, nokiamob 08/2026). The legal lever is weak because the obligation only applies "if" an update is released. Review 19/35.',
    lessonDe: 'Der Hochwassermarken-Collider trägt nur, wo niemand den Verlauf schon führt — bei Software-Lebenszyklen pflegt die Community ihn seit Jahren.',
    lessonEn: 'The flood-mark collider only works where nobody keeps the history yet — for software lifecycles the community has maintained it for years.',
    domain: 'Reparatur & Ökodesign',
    evidence: [
      'endoflife.date/samsung-mobile [Schnipsel]',
      'endoflife.ai, eosl.date [Schnipsel]',
      'SnoopSnitch (Patchlevel-Prüfung) [Schnipsel]'
    ],
    cause: 'gebaut',
    killer: 'community',
    foundBy: 'englisch',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'ESPR-Runde 28.09.2026 · Bisoziation Run 10 (Engine 2), Review 28.09.2026',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Nie für den Verlauf. Nur wenn eine Behörde einen konkreten Abgleich „zugesagte Updatejahre (EPREL) gegen gelieferte Patchlevel" als Vollzugsformat verlangt.',
    resurrectIfEn: 'Never for the history itself. Only if an authority requires a concrete comparison "promised update years (EPREL) versus delivered patch levels" as an enforcement format.'
  },
  {
    id: 'neuware-fundbuch',
    title: 'Neuware-Fundbuch (Fundmeldung vernichteter Neuware)',
    originalIdeaDe: 'Bürger melden neuwertige Ware mit Etikett im Abfallstrom wie einen Ringfund; eine Zentrale ordnet Funde Händlern und Chargen zu und macht so Verstöße gegen das Vernichtungsverbot (Art. 25 ESPR) sichtbar.',
    originalIdeaEn: 'Citizens report new goods with tags found in the waste stream like a bird-ring recovery; a central office matches finds to retailers and batches, making breaches of the destruction ban (Art. 25 ESPR) visible.',
    whyDiscardedDe: 'Reality-Check, zweifach: (a) Vernichtung durch große Unternehmen geschieht bei beauftragten Entsorgern (Verbrennung, Schredder) und ist für Bürger unsichtbar; was Bürger mit Etikett finden, ist fast immer private Entsorgung oder Spende — ein Einzelfund beweist nichts, Chargen gleicher SKU sehen nur Entsorger-Beschäftigte. (b) Deren Meldungen wären Hinweisgeberfälle (HinSchG) mit Arbeitsrechts- und Datenschutzfolgen. Review 16/35.',
    whyDiscardedEn: 'Reality check, twice: (a) destruction by large companies happens at contracted waste firms (incineration, shredding) and is invisible to citizens; what citizens find with tags is almost always private disposal or donation — a single find proves nothing, and batches of the same SKU are seen only by waste-firm staff. (b) Their reports would be whistleblower cases (German HinSchG) with labour-law and data-protection consequences. Review 16/35.',
    lessonDe: 'Der Ringfund-Mechanismus braucht Zuordenbarkeit: Ein Vogelring identifiziert ein Individuum, ein Hängeetikett keinen Vernichtungsvorgang. Bei Laienfund-Ideen zuerst fragen, ob der Fund den Vorwurf überhaupt tragen kann.',
    lessonEn: 'The ring-recovery mechanism needs attributability: a bird ring identifies an individual, a swing tag does not identify an act of destruction. For lay-find ideas, first ask whether a find can carry the allegation at all.',
    domain: 'Kreislaufwirtschaft & Vollzug',
    evidence: [
      'Reality-Check des Reviewers ohne eigene Suche (classification-log, ESPR-Runde)',
      'Greenpeace: Vernichtung „geht heimlich weiter" [Schnipsel]'
    ],
    cause: 'reality-check',
    killer: 'keiner',
    foundBy: 'ohne-suche',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'ESPR-Runde 28.09.2026 · Bisoziation Run 10 (Engine 2, Art. 25 × Ringfundmeldung), Review 28.09.2026',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Wenn eine Behörde oder NGO einen geschützten Hinweisgeberkanal für Entsorger-Beschäftigte zu Art. 25 ESPR einrichtet und ein Chargen-Erfassungsformat braucht.',
    resurrectIfEn: 'If an authority or NGO sets up a protected whistleblower channel for waste-firm staff on Art. 25 ESPR and needs a batch recording format.'
  },
  {
    id: 'reparaturverlangen-uhr',
    title: 'Reparaturverlangen-/Gewährleistungs-Uhr',
    originalIdeaDe: 'Aus Kassenbon und Produktkategorie: Fällt das Gerät unter die Herstellerreparaturpflicht (Anh. II RL (EU) 2024/1799)? Gewährleistungsende inkl. +12 Monate bei Wahl der Reparatur; erzeugt den datierten Reparaturverlangen-Brief.',
    originalIdeaEn: 'From receipt and product category: is the device covered by the manufacturer repair obligation (Annex II Directive (EU) 2024/1799)? Warranty end including +12 months when repair is chosen; generates the dated repair-request letter.',
    whyDiscardedDe: 'Beim Empfänger und Modus: Die Verbraucherzentralen haben eigene Themenseiten („Recht auf Reparatur: Mehr Rechte seit 31. Juli 2026") und Musterbriefe; ein Fristrechner mit Briefgenerator wäre schon 2018 baubar gewesen. Doppelkill — Ideen-Scout und Inversions-Agent fanden und töteten sie unabhängig.',
    whyDiscardedEn: 'With the recipient and mode: the consumer advice centres have their own topic pages ("Right to repair: more rights since 31 July 2026") and template letters; a deadline calculator with letter generator could have been built in 2018. Double kill — the idea scout and the inversion agent found and killed it independently.',
    lessonDe: 'Verbraucherbrief-Generatoren sind im Atlas dicht (Mieter-Tools, Musterbriefe). Warnliste und Vorfilter hätten die Idee ohne Suche töten müssen — zwei Engines verbrannten Suchen daran.',
    lessonEn: 'Consumer letter generators are dense in the atlas (tenant tools, template letters). The warning list and pre-filter should have killed this without a search — two engines burned searches on it.',
    domain: 'Reparatur & Verbraucherrecht',
    evidence: [
      'verbraucherzentrale.de — Recht auf Reparatur seit 31.07.2026, Musterbriefe [Schnipsel]',
      'BGBl. 2026 I Nr. 212 (Umsetzung RL 2024/1799) [Schnipsel]'
    ],
    cause: 'beim-empfaenger',
    killer: 'gemeinnuetzig',
    foundBy: 'empfaenger',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'ESPR-Runde 28.09.2026 · Ideenrunde (Engine 1) + Inversion Run 4 (Engine 3, OP-2), Doppelkill',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Nie als Brief- oder Fristrechner. Höchstens, wenn die Verbraucherzentralen ihre Musterbriefe einstellen.',
    resurrectIfEn: 'Never as a letter or deadline calculator. At most if the consumer advice centres withdraw their template letters.'
  },
  {
    id: 'reparaturformular-generator',
    title: 'Reparaturformular-Generator (Europäisches Reparaturinformationsformular)',
    originalIdeaDe: 'Generator für das Europäische Reparaturinformationsformular nach Anh. I RL (EU) 2024/1799.',
    originalIdeaEn: 'Generator for the European Repair Information Form under Annex I Directive (EU) 2024/1799.',
    whyDiscardedDe: 'Gebaut, anbieterseitig: FixFirst (right2repair-compliance.com) und RepairScore decken es ab. Das Formular füllt zudem der Reparierende aus, nicht der Verbraucher — das Werkzeug gehört zur Anbieterseite und ist ein Standard-Formularmuster ohne neue Fähigkeit.',
    whyDiscardedEn: 'Built, on the provider side: FixFirst (right2repair-compliance.com) and RepairScore cover it. The form is also filled in by the repairer, not the consumer — the tool belongs to the provider side and is a standard form pattern without a new capability.',
    lessonDe: 'Pflichtformulare, die ein Unternehmen ausfüllen muss, sind Compliance-SaaS-Markt — erst fragen, wer das Formular ausfüllt.',
    lessonEn: 'Mandatory forms a business must complete are a compliance-SaaS market — first ask who fills in the form.',
    domain: 'Reparatur & Ökodesign',
    evidence: [
      'right2repair-compliance.com (FixFirst) [Schnipsel]',
      'RepairScore-App [Schnipsel]'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'englisch',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'ESPR-Runde 28.09.2026 · Ideenrunde (Engine 1)',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Nie für Anbieter. Nur wenn ein Formular-Teil für Verbraucher verpflichtend wird (etwa ein Gegenstück zum Angebot, das der Kunde prüfen muss) und die Anbieter-Tools ihn nicht abbilden.',
    resurrectIfEn: 'Never for providers. Only if a consumer-side part of the form becomes mandatory (e.g. a counterpart the customer must check) and provider tools do not cover it.'
  },
  {
    id: 'eprel-reparierbarkeits-nachpruefer',
    title: 'EPREL-Reparierbarkeits-Nachprüfer',
    originalIdeaDe: 'Automatischer Abgleich der in EPREL deklarierten Reparierbarkeitsangaben (VO (EU) 2023/1669) auf Vollständigkeit und Plausibilität, als offene Mängelliste.',
    originalIdeaEn: 'Automatic check of the repairability data declared in EPREL (Regulation (EU) 2023/1669) for completeness and plausibility, as an open list of deficiencies.',
    whyDiscardedDe: 'Beim Akteur: Right to Repair Europe und iFixit haben 09/2026 die EPREL-Datensätze ausgewertet (2.334 Smartphone-/Tablet-Einträge, rund 80 % ohne verwertbare Pflichtangaben) und veröffentlicht. Die Bisoziations-Engine nannte dasselbe Audit — Doppelbeleg.',
    whyDiscardedEn: 'With the actor: Right to Repair Europe and iFixit analysed the EPREL records in 09/2026 (2,334 smartphone/tablet entries, about 80 % without usable mandatory information) and published the results. The bisociation engine cited the same audit — double evidence.',
    lessonDe: 'Wenn eine Datenbank öffentlich und die NGO schnell ist, ist das offensichtliche Audit schon gemacht — Lücken liegen neben der Momentaufnahme, nicht in ihr.',
    lessonEn: 'When a database is public and the NGO is fast, the obvious audit is already done — gaps lie next to the snapshot, not inside it.',
    domain: 'Reparatur & Ökodesign',
    evidence: [
      'ifixit.com/News/119217 [Schnipsel]',
      'theregister.com 2026-09-07 [Schnipsel]',
      'repair.eu — EPREL-Auswertung [Schnipsel]'
    ],
    cause: 'beim-empfaenger',
    killer: 'gemeinnuetzig',
    foundBy: 'englisch',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'ESPR-Runde 28.09.2026 · Ideenrunde (Engine 1), Doppelbeleg Bisoziation Run 10',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Wenn R2R Europe/iFixit das Audit nicht wiederholen und EPREL um weitere Produktgruppen mit Reparierbarkeitsklasse erweitert wird, die niemand prüft.',
    resurrectIfEn: 'If R2R Europe/iFixit do not repeat the audit and EPREL is extended to further product groups with a repairability class that nobody checks.'
  },
  {
    id: 'akku-ankaufsuntersuchung',
    title: 'Akku-Ankaufsuntersuchung (Batteriepass × Pferdekauf)',
    originalIdeaDe: 'Neutrale Zustandsprüfung gebrauchter E-Bike-/LMT-Akkus beim Kauf aus den Batteriepass-Daten (Art. 77 VO (EU) 2023/1542, SoH), nach dem Muster der tierärztlichen Ankaufsuntersuchung beim Pferdekauf.',
    originalIdeaEn: 'A neutral condition check of used e-bike/LMT batteries at purchase from battery passport data (Art. 77 Regulation (EU) 2023/1542, SoH), modelled on the veterinary pre-purchase exam when buying a horse.',
    whyDiscardedDe: 'Gebaut: „Certified by Bosch" — Händlerzertifikat für gebrauchte E-Bikes ab Frühjahr 2027. Das Feld „Akku-/Zustandszertifikat für den Wiederverkauf" ist bei EV-Akkus ohnehin dicht (Aviloo, TÜV).',
    whyDiscardedEn: 'Built: "Certified by Bosch" — a dealer certificate for used e-bikes from spring 2027. The field "battery/condition certificate for resale" is dense anyway for EV batteries (Aviloo, TÜV).',
    lessonDe: 'Ein Distanz-3-Paar, das im Mode-Feld „Zustand → Wiederverkauf" landet, stirbt an der Warnliste — die hätte es ohne Suche töten müssen.',
    lessonEn: 'A distance-3 pair that lands in the mode field "condition → resale" dies on the warning list — it should have been killed without a search.',
    domain: 'Batterien & Gebrauchtmarkt',
    evidence: [
      '„Certified by Bosch" — Händlerzertifikat gebrauchte E-Bikes ab 2027 [Schnipsel]',
      'Aviloo / TÜV — Batterie-SoH-Zertifikate (Warnliste) [Schnipsel]'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'unbekannt',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'ESPR-Runde 28.09.2026 · Bisoziation Run 10 (Engine 2)',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Nie als Zertifikat. Höchstens, wenn der Batteriepass SoH-Daten öffentlich lesbar macht und kein Händlerprogramm Privatverkäufe abdeckt.',
    resurrectIfEn: 'Never as a certificate. At most if the battery passport makes SoH data publicly readable and no dealer programme covers private sales.'
  },
  {
    id: 'dsa-anordnungs-gegenbuch',
    title: 'DSA-Anordnungs-Gegenbuch (Art.-15-Berichte gegen DSC-Zahl)',
    originalIdeaDe: 'Die Zahl der Behördenanordnungen „aus DE" aus den harmonisierten Art.-15-Transparenzberichten aller auffindbaren Vermittlungsdienste (DVO (EU) 2024/2835, CSV ab 2026) aufsummieren und als empfängerseitige Untergrenze gegen die 42 Anordnungen im Tätigkeitsbericht des Digital Services Coordinator legen; Nebenzuschnitt: vergleichbare Sicht auf die Berichte kleiner und mittlerer DE-Anbieter.',
    originalIdeaEn: 'Sum the number of authority orders "from DE" across the harmonised Art. 15 transparency reports of all findable intermediary services (Implementing Regulation (EU) 2024/2835, CSV from 2026) and set this recipient-side lower bound against the 42 orders in the Digital Services Coordinator\'s activity report; side cut: a comparable view of the reports of small and medium German providers.',
    whyDiscardedDe: 'Dreifachfund, trotzdem tot. Die Lücke ist erklärt, nicht versteckt: Der DSC-Bericht 2025 nennt 19 Art.-9- und 23 Art.-10-Anordnungen und begründet selbst, warum das nicht alle sind (Art. 9 Abs. 6 / 10 Abs. 6 DSA: viele, v. a. strafprozessuale Anordnungen werden nicht an den DSC übermittelt). Die VLOP-Seite, die die Anordnungszahlen dominiert, ist Forschungsgebiet (HIIG 09/2025, RTFP, Open Terms Archive, Trujillo et al. 2026). Für Nicht-VLOPs gibt es weder einen Nenner noch eine Stelle, die fehlende Vergleichbarkeit als Engpass nennt. Review 22/35.',
    whyDiscardedEn: 'Triple find, dead anyway. The gap is explained, not hidden: the DSC report 2025 lists 19 Art. 9 and 23 Art. 10 orders and itself explains why that is not all of them (Art. 9(6) / 10(6) DSA: many orders, especially in criminal proceedings, are not transmitted to the DSC). The VLOP side, which dominates order counts, is a research field (HIIG 09/2025, RTFP, Open Terms Archive, Trujillo et al. 2026). For non-VLOPs there is neither a denominator nor anyone naming missing comparability as a bottleneck. Review 22/35.',
    lessonDe: 'Bei Gegenstück-Paaren zuerst die Selbsterklärung der Stelle suchen: Eine Differenz, die die Behörde rechtlich begründet, ist kein Befund. Dreifachfund ≠ Qualität.',
    lessonEn: 'For counterpart pairs, first look for the body\'s own explanation: a difference the authority justifies in law is not a finding. A triple find is not quality.',
    domain: 'Plattformregulierung & Vollzug',
    evidence: [
      'DSC-Tätigkeitsbericht 2025 (dsc.bund.de): 19 + 23 Anordnungen, „do not … reflect the entirety of orders issued in Germany" [Seite]',
      'DSA Art. 15 Abs. 1 lit. a, DVO (EU) 2024/2835 Art. 1–3 (über publications.europa.eu) [Seite]',
      'digital-strategy.ec.europa.eu — nur VLOP/VLOSE-Berichte verlinkt [Seite]',
      'HIIG 09/2025; github.com/pushkinoxt/rtfp; Open Terms Archive dsa-reports-versions; arXiv 2605.17655 (Trujillo et al. 2026) [Seite]'
    ],
    cause: 'praemisse',
    killer: 'forschung',
    foundBy: 'englisch',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'Offenlegungs-Runde 28.09.2026 · Bisoziation Run 11 (Engine 2, DSA × Tephra-Leithorizont) + Ideenrunde (Engine 1) + Inversion Run 5 (Engine 3), Dreifachfund; Review 28.09.2026',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Wenn der DSC ein öffentliches Anbieterverzeichnis (Nenner) veröffentlicht oder eine Stelle mit Mandat (GFF, Bundestag) nach der Zahl der nicht übermittelten Anordnungen fragt.',
    resurrectIfEn: 'If the DSC publishes a public register of providers (a denominator), or a body with a mandate (GFF, Bundestag) asks for the number of orders not transmitted.'
  },
  {
    id: 'ezb-register',
    title: 'EzB-Register (Erklärung zur Barrierefreiheit öffentlicher Stellen)',
    originalIdeaDe: 'Deutsches Gegenstück zum niederländischen Dashboard: alle öffentlichen Stellen (Gemeindeverzeichnis + Wikidata), ein Crawler findet die Erklärung zur Barrierefreiheit (§ 12b BGG, BITV 2.0, Landesrecht), ein LLM liest die Pflichtbestandteile, Status A–E je Stelle.',
    originalIdeaEn: 'A German counterpart to the Dutch dashboard: all public bodies (municipality register + Wikidata), a crawler finds the accessibility statement (§ 12b BGG, BITV 2.0, state law), an LLM reads the mandatory elements, status A–E per body.',
    whyDiscardedDe: 'Der Staat misst es schon: Der zweite Überwachungsbericht nach Art. 8 RL 2016/2102 (BFIT-Bund mit den Länderstellen, an die Kommission 05.03.2025) prüfte 7.239 Webauftritte und 269 Apps und weist den Anteil mit Erklärung aus (36,13 % → 47,75 %). Der Atlas digitale Barrierefreiheit (DasDies/AWO) hat 2024 alle ~11.000 Kommunen geprüft. Die Norm nennt Mustererklärung und Überwachungsstelle. Übrig bliebe eine namentliche Vollliste — ein Pranger ohne Why-Now (Pflicht seit 2020). Review 20/35.',
    whyDiscardedEn: 'The state already measures it: the second monitoring report under Art. 8 Directive 2016/2102 (BFIT-Bund with the state bodies, sent to the Commission on 05.03.2025) checked 7,239 websites and 269 apps and reports the share with a statement (36.13 % → 47.75 %). The Atlas of digital accessibility (DasDies/AWO) checked all ~11,000 municipalities in 2024. The law names a model statement and a monitoring body. What remains is a named full list — a pillory without a why-now (obligation since 2020). Review 20/35.',
    lessonDe: 'Wenn ein Nachbarland das Register staatlich gebaut hat, zuerst die heimische Überwachungsstelle fragen: Die Norm, die eine Überwachungsstelle nennt, hat ihren Sammler schon.',
    lessonEn: 'If a neighbouring country has built the register as a state service, ask the domestic monitoring body first: a law that names a monitoring body already has its collector.',
    domain: 'Barrierefreiheit & Verwaltung',
    evidence: [
      'Zweiter Überwachungsbericht Art. 8 RL 2016/2102, BFIT-Bund (reha-recht.de) [Seite]',
      'gesetze-im-internet.de/bgg/__12b.html [Seite]',
      'digitoegankelijk.nl Dashboard-FAQ (staatlich, Status A–E) [Seite]',
      'behoerden-spiegel.de 01.07.2024 — DasDies-Studie ~11.000 Kommunen [Seite]; Atlas digitale Barrierefreiheit [Schnipsel]'
    ],
    cause: 'beim-empfaenger',
    killer: 'behoerde',
    foundBy: 'empfaenger',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'Offenlegungs-Runde 28.09.2026 · Inversion Run 5 (Engine 3, OP-4 + Auslandsabgleich NL); Review 28.09.2026',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Wenn der Überwachungsbericht auf die EzB-Kennzahl verzichtet oder die BFIT-Bund öffentlich nach einem Vollverzeichnis fragt.',
    resurrectIfEn: 'If the monitoring report drops the accessibility-statement metric, or BFIT-Bund publicly asks for a full register.'
  },
  {
    id: 'gleichstellungsbericht-archiv',
    title: 'Gleichstellungsbericht-Archiv (§ 21 EntgTranspG)',
    originalIdeaDe: 'Die seit 2018 veröffentlichten „Berichte zur Gleichstellung und Entgeltgleichheit" (Anlage zum Lagebericht, §§ 21/22 EntgTranspG) erfassen, als Nullmessung vor dem Regime der Entgelttransparenz-RL (EU) 2023/970.',
    originalIdeaEn: 'Capture the "reports on equality and equal pay" published since 2018 (annex to the management report, §§ 21/22 EntgTranspG) as a baseline before the regime of the Pay Transparency Directive (EU) 2023/970.',
    whyDiscardedDe: 'Reality-Check am Normtext: § 22 Abs. 4 EntgTranspG legt den Bericht im Unternehmensregister offen — der Fundort ist per Gesetz zentral. § 21 verlangt nur Prosa zu Maßnahmen und nach Geschlecht aufgeschlüsselte Beschäftigtenzahlen, keine Entgeltangaben; eine Nullmessung des Entgeltgefälles lässt sich daraus nicht gewinnen. Ab 2027 sammelt die Überwachungsstelle nach Art. 29 RL 2023/970 selbst. Review 16/35.',
    whyDiscardedEn: 'Reality check against the statute: § 22(4) EntgTranspG requires disclosure in the company register — the location is centralised by law. § 21 only requires prose on measures and headcounts by gender, no pay data; no pay-gap baseline can be derived. From 2027 the monitoring body under Art. 29 Directive 2023/970 collects the data itself. Review 16/35.',
    lessonDe: 'Pflichtfrage 3 vor jeder Sammelidee: Nennt die Norm selbst einen Fundort oder Sammler? Und: Enthält das Pflichtdokument überhaupt die Größe, die man messen will?',
    lessonEn: 'Mandatory question 3 before any collection idea: does the law itself name a location or collector? And: does the mandatory document contain the quantity one wants to measure at all?',
    domain: 'Entgeltgleichheit & Offenlegung',
    evidence: [
      '§§ 21, 22 EntgTranspG (gesetze-im-internet.de) [Seite]',
      'forvismazars.com — Evaluation 2019 [Seite]',
      'PUMA/Telekom/K+S — Berichte zur Gleichstellung und Entgeltgleichheit [Schnipsel]',
      'RL (EU) 2023/970 Art. 29 Abs. 3 lit. c (CELEX 32023L0970) [Seite]'
    ],
    cause: 'reality-check',
    killer: 'behoerde',
    foundBy: 'deutsch',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'Offenlegungs-Runde 28.09.2026 · Ideenrunde (Engine 1), Berührung Inversion Run 5 (Entgeltgefälle-Register); Review 28.09.2026',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Nie in dieser Form; die Umsetzung der RL 2023/970 ist ein eigenes Thema (Grab entgeltgefaelle-register).',
    resurrectIfEn: 'Never in this form; the transposition of Directive 2023/970 is a separate topic (grave entgeltgefaelle-register).'
  },
  {
    id: 'entgeltgefaelle-register',
    title: 'Entgeltgefälle-Register (Art. 9 RL 2023/970)',
    originalIdeaDe: 'Die Berichte über das geschlechtsspezifische Entgeltgefälle nach Art. 9 der Entgelttransparenz-RL (EU) 2023/970 sammeln und zwischen Arbeitgebern, Branchen und Regionen vergleichbar machen.',
    originalIdeaEn: 'Collect the gender pay gap reports under Art. 9 of the Pay Transparency Directive (EU) 2023/970 and make them comparable across employers, sectors and regions.',
    whyDiscardedDe: 'Der Sammler ist gesetzlich vorgeschrieben: Nach Art. 29 Abs. 3 lit. c RL 2023/970 muss die Überwachungsstelle die Daten sammeln und veröffentlichen, „um einen Vergleich zwischen Arbeitgebern, Sektoren und Regionen … zu ermöglichen". Das Register ist die Aufgabe der Behörde, die die Idee beschenken würde. Getötet am Normtext über Pflichtfrage 3, ohne Existenzsuche.',
    whyDiscardedEn: 'The collector is prescribed by law: under Art. 29(3)(c) Directive 2023/970 the monitoring body must collect and publish the data "to allow a comparison between employers, sectors and regions". The register is the job of the very authority that would receive the idea. Killed on the legal text via mandatory question 3, without an existence search.',
    lessonDe: 'Wo die Norm den Sammler selbst benennt, ist das Muster „Offenlegung ohne Register" zu — erst den Normtext lesen, dann suchen.',
    lessonEn: 'Where the law names the collector itself, the "disclosure without register" pattern is closed — read the legal text first, then search.',
    domain: 'Entgeltgleichheit & Offenlegung',
    evidence: [
      'RL (EU) 2023/970 Art. 9 Abs. 7, Art. 29 Abs. 3 lit. c (CELEX 32023L0970, über publications.europa.eu) [Seite]',
      'lto.de — Umsetzung verschoben, DE-Frist 07.06.2026 verpasst [Schnipsel]'
    ],
    cause: 'beim-empfaenger',
    killer: 'behoerde',
    foundBy: 'ohne-suche',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'Offenlegungs-Runde 28.09.2026 · Inversion Run 5 (Engine 3, OP-4, Pflichtfrage 3 am Normtext)',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Wenn das deutsche Umsetzungsgesetz die Veröffentlichungspflicht der Überwachungsstelle nicht übernimmt oder die Stelle nach Umsetzung keine vergleichbaren Daten veröffentlicht.',
    resurrectIfEn: 'If the German transposition law does not adopt the monitoring body\'s publication duty, or the body publishes no comparable data after transposition.'
  },
  {
    id: 'konfliktmineralien-berichtsregister',
    title: 'Konfliktmineralien-Berichtsregister (Art. 7 Abs. 3 VO 2017/821)',
    originalIdeaDe: 'Die öffentlichen Jahresberichte der Unionseinführer von Zinn, Tantal, Wolfram und Gold (Sorgfaltspolitik, Audit-Zusammenfassung, Name des Auditors) sammeln und gegen die Pflichtbestandteile nach Art. 7 Abs. 3 VO (EU) 2017/821 prüfen.',
    originalIdeaEn: 'Collect the public annual reports of Union importers of tin, tantalum, tungsten and gold (due-diligence policy, audit summary, name of the auditor) and check them against the mandatory elements of Art. 7(3) Regulation (EU) 2017/821.',
    whyDiscardedDe: 'Kein Nenner: In DE unterliegen rund 150 Unionseinführer der VO, ihre Identität steht nur in Zolldaten (öffentliche Liste nur in Österreich). Ein Register fände nur, wer freiwillig sichtbar ist. DEKSOR (BGR) prüft risikobasiert jährlich selbst, die NGO-Auswertung 2023 (IPIS/ARM) lief einmalig. Keine neue Pflicht seit 2021, also kein Why-Now. Review 17/35.',
    whyDiscardedEn: 'No denominator: in Germany about 150 Union importers fall under the Regulation, and their identity exists only in customs data (a public list exists only in Austria). A register would only find those who are voluntarily visible. DEKSOR (BGR) runs its own risk-based annual checks, and the NGO analysis of 2023 (IPIS/ARM) was a one-off. No new obligation since 2021, so no why-now. Review 17/35.',
    lessonDe: 'Pflichtfrage 2 (Liste der Verpflichteten?) am Normtext beantworten, bevor die Sammlersuche beginnt — ohne öffentliche Pflichtigenliste ist ein Register nur eine Sammlung Freiwilliger.',
    lessonEn: 'Answer mandatory question 2 (list of obliged parties?) on the legal text before searching for collectors — without a public list of obliged parties a register is only a collection of volunteers.',
    domain: 'Lieferketten & Rohstoffe',
    evidence: [
      'VO (EU) 2017/821 Art. 7 Abs. 3 (legislation.gov.uk; CELEX 32017R0821) [Seite]',
      'ipisresearch.be — „High stakes, disappointing results", Joint NGO Statement [Seite/Schnipsel]',
      'DEKSOR-Kontrollbericht: >80 % von 145 Importeuren nicht konform; IHK/BGR-FAQ ~150 Einführer [Schnipsel]'
    ],
    cause: 'reality-check',
    killer: 'behoerde',
    foundBy: 'deutsch',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'Offenlegungs-Runde 28.09.2026 · Ideenrunde (Engine 1) + Inversion Run 5 (Engine 3), Doppelfund; Review 28.09.2026',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Wenn die Kommission oder DEKSOR eine Liste der Unionseinführer veröffentlicht.',
    resurrectIfEn: 'If the Commission or DEKSOR publishes a list of Union importers.'
  },
  {
    id: 'gpai-summaries-register',
    title: 'GPAI-Summaries-Register (AI Act Art. 53 Trainingsdaten-Zusammenfassungen)',
    originalIdeaDe: 'Register der Pflicht-Zusammenfassungen der Trainingsdaten nach Art. 53 Abs. 1 lit. d AI Act, geprüft gegen das Template der Kommission (24.07.2025); Nebenzuschnitt der Bisoziation: Rückfrage für Rechteinhaber, welche Modelle die eigene Domain unter den Top-Domains führen.',
    originalIdeaEn: 'A register of the mandatory training-data summaries under Art. 53(1)(d) AI Act, checked against the Commission template (24.07.2025); bisociation side cut: a lookup for rights holders showing which models list their domain among the top domains.',
    whyDiscardedDe: 'Gebaut: gpailedger.com führt 124 Modelle von 31 Anbietern, 75 veröffentlichte und 49 fehlende Summaries, täglich versioniert mit SHA-256 und OpenTimestamps, Metadaten CC0 (Stand 28.09.2026). Die Qualitätsprüfung gibt es zusätzlich als FAccT-2026-Paper. Doppelkill — Ideen-Scout und Bisoziation fanden und töteten es unabhängig.',
    whyDiscardedEn: 'Built: gpailedger.com tracks 124 models from 31 providers, 75 published and 49 missing summaries, versioned daily with SHA-256 and OpenTimestamps, metadata CC0 (as of 28.09.2026). The quality check also exists as a FAccT 2026 paper. Double kill — the idea scout and the bisociation engine found and killed it independently.',
    lessonDe: 'Das Offenlegungsmuster ist nur frei, wo keine Forschungsgruppe von den Daten lebt. Vorab fragen: Wer würde darüber ein Paper schreiben? Fällt die Antwort leicht, zuerst dort suchen.',
    lessonEn: 'The disclosure pattern is only free where no research group lives off the data. Ask first: who would write a paper about this? If the answer comes easily, search there first.',
    domain: 'KI-Regulierung & Offenlegung',
    evidence: [
      'gpailedger.com — 124 Modelle, 31 Anbieter, CC0-Metadaten, Stand 28.09.2026 [Seite]',
      'FAccT 2026, doi.org/10.1145/3805689.3806755 [Schnipsel]'
    ],
    cause: 'gebaut',
    killer: 'forschung',
    foundBy: 'englisch',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'Offenlegungs-Runde 28.09.2026 · Ideenrunde (Engine 1) + Bisoziation Run 11 (Engine 2, KI-VO × Provenienzforschung), Doppelkill',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Wenn gpailedger.com eingestellt wird und kein anderer offener Tracker die Summaries versioniert.',
    resurrectIfEn: 'If gpailedger.com shuts down and no other open tracker versions the summaries.'
  },
  {
    id: 'lksg-berichtsregister',
    title: 'LkSG-Berichtsregister (§§ 12/13 LkSG)',
    originalIdeaDe: 'Die Berichte nach §§ 12/13 Lieferkettensorgfaltspflichtengesetz sammeln und vergleichbar machen.',
    originalIdeaEn: 'Collect the reports under §§ 12/13 of the German Supply Chain Due Diligence Act (LkSG) and make them comparable.',
    whyDiscardedDe: 'Die Prämisse ist tot: Das BAFA hat die Prüfung der Unternehmensberichte nach §§ 12/13 LkSG „ab sofort vollständig" eingestellt, die Einreichung ist „nicht mehr möglich"; ein Änderungsgesetz streicht die Berichtspflicht rückwirkend. Das Pflichtdokument existiert nicht mehr. Doppelkill — Ideen-Scout und Inversion töteten es unabhängig mit je einer Suche.',
    whyDiscardedEn: 'The premise is dead: BAFA has stopped reviewing company reports under §§ 12/13 LkSG "completely, with immediate effect", submission is "no longer possible", and an amending act abolishes the reporting duty retroactively. The mandatory document no longer exists. Double kill — the idea scout and the inversion agent each killed it with one search.',
    lessonDe: 'Vor der Sammlersuche die Gegenprobe „Gilt die Pflicht noch?" — Regime unter Abschaffung oder Verschiebung (LkSG, EUDR, CSDDD) liefern keine Dokumente.',
    lessonEn: 'Before searching for collectors, check "does the obligation still apply?" — regimes being abolished or postponed (LkSG, EUDR, CSDDD) yield no documents.',
    domain: 'Lieferketten & Offenlegung',
    evidence: [
      'bafa.de/DE/Lieferketten/Berichtspflicht/berichtspflicht_node.html — Prüfung eingestellt, Einreichung nicht mehr möglich [Seite]',
      'bundestag.de / bundesregierung.de — Änderungsgesetz, 1. Lesung 16.01.2026 [Schnipsel]'
    ],
    cause: 'praemisse',
    killer: 'keiner',
    foundBy: 'deutsch',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'Offenlegungs-Runde 28.09.2026 · Ideenrunde (Engine 1) + Inversion Run 5 (Engine 3), Doppelkill',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Wenn die CSDDD-Umsetzung eine öffentliche Berichtspflicht ohne Register zurückbringt.',
    resurrectIfEn: 'If the CSDDD transposition brings back a public reporting duty without a register.'
  },
  {
    id: 'waermeplan-register',
    title: 'Wärmeplan-Register (kommunale Wärmepläne nach WPG)',
    originalIdeaDe: 'Die nach §§ 13/23 Wärmeplanungsgesetz veröffentlichten kommunalen Wärmepläne sammeln und vergleichbar machen.',
    originalIdeaEn: 'Collect the municipal heat plans published under §§ 13/23 of the German Heat Planning Act (WPG) and make them comparable.',
    whyDiscardedDe: 'Gebaut: Der Wärmewendeatlas des Kompetenzzentrums Kommunale Wärmewende (KWW, Halle) bietet die Pläne über Kommunensteckbriefe zum Download und vergleicht den Wärmemix der Zieljahre in Diagrammen; dazu eine dena-Übersicht.',
    whyDiscardedEn: 'Built: the heat transition atlas of the Competence Centre for Municipal Heat Transition (KWW, Halle) offers the plans for download via municipal profiles and compares the heat mix of the target years in charts; plus a dena overview.',
    lessonDe: 'Regime mit politischer Aufmerksamkeit bekommen binnen Monaten ein staatliches Register — Wärmeplanung gehört in den Atlas, nicht in eine Runde.',
    lessonEn: 'Regimes with political attention get a state register within months — heat planning belongs in the atlas, not in a round.',
    domain: 'Energie & Kommunen',
    evidence: [
      'kww-halle.de/praxis-kommunale-waermewende/kww-waermewendeatlas [Seite]',
      'dena — Übersicht kommunale Wärmeplanung [Schnipsel]'
    ],
    cause: 'gebaut',
    killer: 'behoerde',
    foundBy: 'deutsch',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'Offenlegungs-Runde 28.09.2026 · Ideenrunde (Engine 1)',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Wenn der KWW-Atlas eingestellt wird oder aufhört, neue Pläne aufzunehmen.',
    resurrectIfEn: 'If the KWW atlas is discontinued or stops adding new plans.'
  },
  {
    id: 'bfsg-erklaerungspruefer',
    title: 'BFSG-Erklärungsprüfer (Barrierefreiheitsinformationen von Online-Shops)',
    originalIdeaDe: 'Die Pflichtinformationen zur Barrierefreiheit nach § 14 und Anlage 3 BFSG bei Online-Shops sammeln und auf Vollständigkeit prüfen.',
    originalIdeaEn: 'Collect the mandatory accessibility information under § 14 and Annex 3 of the German Accessibility Strengthening Act (BFSG) from online shops and check it for completeness.',
    whyDiscardedDe: 'Gebaut und kommerziell dicht: DataPulse hat 2.446 Shops ausgewertet, mindshape 1.000 Websites; Audit-Agenturen und Scanner verkaufen die Prüfung, die MLBF ist im Vollzug. Faustregel „Endnutzer zahlen" trifft.',
    whyDiscardedEn: 'Built and commercially dense: DataPulse analysed 2,446 shops, mindshape 1,000 websites; audit agencies and scanners sell the check, and the MLBF enforces. The rule of thumb "end users pay" applies.',
    lessonDe: 'Wo Firmen für die Prüfung ihrer eigenen Pflichtangabe zahlen, ist auch die Außensicht schon eine Studie oder ein Scanner.',
    lessonEn: 'Where companies pay to have their own mandatory statement checked, the outside view is already a study or a scanner.',
    domain: 'Barrierefreiheit & Online-Handel',
    evidence: [
      'assistenzplus.de — BFSG-Veränderungen (DataPulse 2.446 Shops, mindshape 1.000 Websites, MLBF) [Schnipsel]'
    ],
    cause: 'gebaut',
    killer: 'kommerziell',
    foundBy: 'deutsch',
    origin: 'quelle',
    stage: 'kandidat',
    bornIn: 'Offenlegungs-Runde 28.09.2026 · Ideenrunde (Engine 1)',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Nie als Shop-Prüfung. Höchstens, wenn die Marktüberwachung ein offenes Prüfformat anfordert, das die Scanner nicht liefern.',
    resurrectIfEn: 'Never as a shop check. At most if market surveillance requests an open audit format the scanners do not provide.'
  },
  {
    id: 'barrieren-spontanmeldung',
    title: 'Barrieren-Spontanmeldung (BFSG × Pharmakovigilanz)',
    originalIdeaDe: 'Betroffene melden Barrieren bei Produkten und Dienstleistungen mit Bezug auf die BFSG-Erklärung des Anbieters; eine Sammelstelle aggregiert die Einzelmeldungen wie ein Spontanmeldesystem zu Signalen.',
    originalIdeaEn: 'Affected people report barriers in products and services with reference to the provider\'s BFSG statement; a central office aggregates individual reports into signals like a pharmacovigilance spontaneous reporting system.',
    whyDiscardedDe: 'Beim Empfänger: Die Marktüberwachungsstelle der Länder für die Barrierefreiheit von Produkten und Dienstleistungen (MLBF, Magdeburg) betreibt ein Meldeportal; dazu der Hinweis der Bundesfachstelle vom 08.06.2026 und das Antragsrecht nach § 32 BFSG. Eine Sammelstelle für Beschwerden ist genau das, was eine Marktüberwachung baut.',
    whyDiscardedEn: 'With the recipient: the joint state market surveillance body for the accessibility of products and services (MLBF, Magdeburg) runs a reporting portal; plus the Federal Accessibility Agency\'s notice of 08.06.2026 and the right to apply under § 32 BFSG. A central complaints office is exactly what market surveillance builds.',
    lessonDe: 'Distanz-3-Kollisionen landen in Vollzugsfeldern oft genau auf der Behördenaufgabe — Beschwerde-Aggregatoren zuerst beim Empfänger suchen, nicht bei Nachbarn.',
    lessonEn: 'Distance-3 collisions in enforcement fields often land exactly on the authority\'s own task — search complaint aggregators at the recipient first, not among neighbours.',
    domain: 'Barrierefreiheit & Vollzug',
    evidence: [
      'MLBF-Meldeportal; Bundesfachstelle Barrierefreiheit, Hinweis 08.06.2026; § 32 BFSG [Schnipsel]'
    ],
    cause: 'beim-empfaenger',
    killer: 'behoerde',
    foundBy: 'deutsch',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'Offenlegungs-Runde 28.09.2026 · Bisoziation Run 11 (Engine 2, BFSG × Pharmakovigilanz, D3)',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Wenn die MLBF ihr Meldeportal einstellt oder Meldungen nicht aggregiert veröffentlicht und ein Betroffenenverband eine eigene Sammlung verlangt.',
    resurrectIfEn: 'If the MLBF closes its reporting portal or does not publish aggregated reports, and a disability organisation asks for its own collection.'
  },
  {
    id: 'public-cbcr-sammelbuch',
    title: 'Public-CbCR-Sammelbuch (Ertragsteuerinformationsberichte)',
    originalIdeaDe: 'Die öffentlichen länderbezogenen Ertragsteuerinformationsberichte nach RL (EU) 2021/2101 / § 342m HGB sammeln und vergleichbar machen.',
    originalIdeaEn: 'Collect the public country-by-country income tax information reports under Directive (EU) 2021/2101 / § 342m HGB and make them comparable.',
    whyDiscardedDe: 'Gebaut: taxplorer.eu (EU Tax Observatory) sammelt die Berichte von mehr als 800 Konzernen. Steuertransparenz ist ein Forschungsfeld mit eigenem Datenmotiv.',
    whyDiscardedEn: 'Built: taxplorer.eu (EU Tax Observatory) collects the reports of more than 800 groups. Tax transparency is a research field with its own data motive.',
    lessonDe: 'Frei ist das Offenlegungsmuster nur, wo keine Forschungsgruppe von den Daten lebt — Steuertransparenz gehört auf die Warnliste.',
    lessonEn: 'The disclosure pattern is only free where no research group lives off the data — tax transparency belongs on the warning list.',
    domain: 'Steuertransparenz & Offenlegung',
    evidence: [
      'taxplorer.eu (EU Tax Observatory), > 800 Konzerne [Schnipsel]'
    ],
    cause: 'gebaut',
    killer: 'forschung',
    foundBy: 'englisch',
    origin: 'bisoziation',
    stage: 'kandidat',
    bornIn: 'Offenlegungs-Runde 28.09.2026 · Bisoziation Run 11 (Engine 2, Tail-Kandidat)',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Wenn Taxplorer eingestellt wird oder deutsche Konzerne unterhalb der Taxplorer-Abdeckung bleiben und jemand mit Mandat danach fragt.',
    resurrectIfEn: 'If Taxplorer shuts down, or German groups remain below Taxplorer\'s coverage and someone with a mandate asks for them.'
  },
  {
    id: 'quanten-spielwiese',
    title: 'Quanten-Spielwiese (Browser-Native Quantum Visualizer)',
    originalIdeaDe: 'Interaktive Simulation von Schrödinger-Gleichungen und quantenmechanischen Phänomenen mit WebGPU und WASM im Browser.',
    originalIdeaEn: 'Interactive simulation of Schrödinger equations and quantum mechanical phenomena with WebGPU and WASM in the browser.',
    whyDiscardedDe: 'Reine didaktische MINT-Laborsimulation ohne behördlichen oder zivilgesellschaftlichen Vollzugsstau (Prämisse). PhET der University of Colorado, falstad.com und Quantum Flytrap decken das seit Jahren kostenlos ab.',
    whyDiscardedEn: 'Pure didactic STEM simulation without regulatory or civic enforcement bottleneck. PhET by University of Colorado, falstad.com and Quantum Flytrap have covered this for years for free.',
    lessonDe: 'Didaktische Physik-Spielereien ohne Vollzugslücke sind kein Amélie-Gemeingut.',
    lessonEn: 'Didactic physics playgrounds without governance or enforcement gaps are not Amélie civic goods.',
    domain: 'Physik & Didaktik',
    evidence: [
      'PhET Interactive Simulations (University of Colorado)',
      'falstad.com Quantum Physics Simulators',
      'Quantum Flytrap'
    ],
    cause: 'praemisse',
    killer: 'forschung',
    foundBy: 'englisch',
    origin: 'ideenliste',
    stage: 'kandidat',
    bornIn: 'PR-Triage Batch-Run 28.09.2026',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Nie als reine Physik-Simulation — nur wenn eine Behörde ein konkretes Quantensensor-Prüfschema vorschreibt.',
    resurrectIfEn: 'Never as pure physics simulation — only if an authority mandates a specific quantum sensor testing schema.'
  },
  {
    id: 'pedalpath-planner',
    title: 'PedalPath Planner (WebGPU Radwege-Planer)',
    originalIdeaDe: 'Interaktives WebGPU-Planungswerkzeug für kommunale Radwegeinfrastruktur und Querschnittsaufteilungen.',
    originalIdeaEn: 'Interactive WebGPU planning tool for municipal bicycle infrastructure and street cross-section allocation.',
    whyDiscardedDe: 'Vollständig durch bestehende Open-Source- und Verbands-Tools abgedeckt: Streetmix ist der weltweite Standard, dazu FixMyCity und ADFC-Radnetzplaner.',
    whyDiscardedEn: 'Fully covered by existing open-source and advocacy tools: Streetmix is the global standard, alongside FixMyCity and ADFC cycling network planners.',
    lessonDe: 'Kommunale Straßenraum- und Radwege-Planung ist eine dicht besetzte Open-Source-Domäne.',
    lessonEn: 'Municipal street space and cycling planning is a densely populated open-source domain.',
    domain: 'Mobilität & Stadtplanung',
    evidence: [
      'streetmix.net',
      'FixMyCity',
      'ADFC Radnetzplaner'
    ],
    cause: 'gebaut',
    killer: 'community',
    foundBy: 'deutsch',
    origin: 'ideenliste',
    stage: 'kandidat',
    bornIn: 'PR-Triage Batch-Run 28.09.2026',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Nie — Streetmix und ADFC decken zivilgesellschaftliche Straßenquerschnittsplanung ab.',
    resurrectIfEn: 'Never — Streetmix and ADFC cover civic street cross-section planning.'
  },
  {
    id: 'kiez-ohr-nlp',
    title: 'Kiez-Ohr / Kiez-Radar (Browser-Native Mängelmelder NLP)',
    originalIdeaDe: 'Bürgerhinweise zu Müll, Schlaglöchern und Defekten per On-Device-NLP kategorisieren und an Ämter leiten.',
    originalIdeaEn: 'Categorize citizen reports on litter, potholes and infrastructure defects via on-device NLP and route to authorities.',
    whyDiscardedDe: 'Gebaut und Standardmuster: Jede deutsche Kommune betreibt offizielle Portale (Ordnungsamt-Online Berlin, Mängelmelder.de, BSR-App). Inoffizielle Dritt-Tools scheitern an fehlenden Schnittstellen.',
    whyDiscardedEn: 'Built and standard pattern: Every German municipality operates official portals (Ordnungsamt-Online Berlin, Mängelmelder.de, BSR app). Unofficial third-party tools fail without API access.',
    lessonDe: 'Beschwerde- und Meldewerkzeuge funktionieren nur mit offiziellem Behörden-Kanal; inoffizielle Scraper erzeugen nur Verwaltungswiderstand.',
    lessonEn: 'Complaint and reporting tools only work with official municipal channels; unofficial scrapers create administrative friction.',
    domain: 'Verwaltung & Bürgerhinweise',
    evidence: [
      'Ordnungsamt-Online Berlin',
      'Maengelmelder.de',
      'BSR-App'
    ],
    cause: 'gebaut',
    killer: 'behoerde',
    foundBy: 'deutsch',
    origin: 'ideenliste',
    stage: 'kandidat',
    bornIn: 'PR-Triage Batch-Run 28.09.2026',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Nie — Städte akzeptieren keine Mängelberichte über inoffizielle Dritt-Apps ohne verifizierte Authentifizierung.',
    resurrectIfEn: 'Never — Cities do not accept defect reports via unofficial third-party apps without verified authentication.'
  },
  {
    id: 'florascan-invasive-webgpu',
    title: 'FloraScan / Invasives-Scout (Browser-Native Neophyten-Erkennung)',
    originalIdeaDe: 'Browser-native Bilderkennung für invasive Pflanzenarten (Neophyten) mit WebGPU On-Device-Inferenz.',
    originalIdeaEn: 'Browser-native image classification for invasive plant species (neophytes) via WebGPU on-device inference.',
    whyDiscardedDe: 'Besetzt durch millionenfach genutzte und staatlich geförderte Fachsysteme: Flora Incognita (TU Ilmenau / BfN), iNaturalist und ObsIdentify verfügen über riesige Referenzdatensätze und trainierte Expertennetzwerke.',
    whyDiscardedEn: 'Occupied by federally funded systems with millions of users: Flora Incognita (TU Ilmenau / BfN), iNaturalist, and ObsIdentify possess massive verified datasets and expert verification networks.',
    lessonDe: 'Rein visuelle Artbestimmung erfordert gigantische Referenzkorpora; gegen Flora Incognita und iNaturalist kann ein statisches WebGPU-Modell nicht konkurrieren.',
    lessonEn: 'Purely visual species identification requires massive reference corpora; a static WebGPU model cannot compete with Flora Incognita and iNaturalist.',
    domain: 'Naturschutz & Biodiversität',
    evidence: [
      'Flora Incognita (BfN / TU Ilmenau)',
      'iNaturalist',
      'ObsIdentify'
    ],
    cause: 'gebaut',
    killer: 'forschung',
    foundBy: 'deutsch',
    origin: 'ideenliste',
    stage: 'kandidat',
    bornIn: 'PR-Triage Batch-Run 28.09.2026',
    diedOn: '2026-09-28',
    resurrectIfDe: 'Nie als Allzweck-Kamera-App — nur wenn ein Behörden-Prüfprotokoll für spezifische Neophyten-Meldungen (z. B. Beifuß-Ambrosie) gefordert wird.',
    resurrectIfEn: 'Never as general camera app — only if a regulatory protocol for specific neophyte reporting (e.g. ragweed) is officially mandated.'
  }
];


