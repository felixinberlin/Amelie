# Maurer-Runde — 15.10.2026

## Betrieb und Vorflug

Thema von Félix: Maurer, bricklayer, construction worker. Vier Methoden: empirischer Scout, Bisoziation, Inversion und Constraint Release; drei parallele native Subagenten, Constraint Release beim Orchestrator, anschließend unabhängiger nativer Reviewer. Keine Vertex-Entdeckungsagenten, keine Google Maps. Zunächst WebSearch/Seitenabrufe; nach ausdrücklicher Klarstellung von Félix zusätzlich der Google-geerdete Suchdienst des Labs. Dies ist eine native Codex-Runde, kein behaupteter Claude-Stand-in und kein Live-Lab-Engine-Lauf.

Sauberer Start auf main, git fetch und offene PRs geprüft (keine offen), main auf a8f40ad4 vorgezogen. Baseline lint grün; Sandbox-Testfehler bei Unterprozessen, vollständiger Lauf außerhalb der Sandbox grün (78 Vitest-Dateien / 1178 Tests, Python-Suiten und 7 Intake-Tests). Förderprojekt-Vorfilter und Friedhofsgang je Engine dokumentiert. BedenkenBlitz, Kalkmörtel-Kandidat, Holz-Festigkeitsgrading und DoP-Stahlscanner ausgeschlossen.

## Konvergenz-Merge

| ID | Engines | Existenz vor Review | Zum Review / Entscheidung |
|---|---|---|---|
| mauerwerk-mehrschlitz-vorpruefung | Scout | unklar | Regeln sind kein Bedarfsbeleg; Normtabellen nicht vollständig verifiziert |
| maurer-staubmassnahmen-lotse | Scout | besetzt | WINGIS / OHCOW decken generischen Maßnahmenplan |
| mauerverband-fehlertrainer | Scout | besetzt, nur Schnipsel für exakte Lehrfunktion | Reviewer prüft Kill neu; Geometrie-Rechner allein kein Lehrtrainer |
| soka-urlaubsabgleich | Inversion | unklar | Historischer manueller Beratungsabgleich; aktueller Bedarf offen |
| quarz-arbeitsleben-pass | Inversion | verengt | Eigene Offline-Portabilität unbewiesen; vorhandene Expositionsverwaltung |
| abbruchziegel-vorentscheidung | Inversion + Constraint Release | besetzt | Ein Doppelfund; vorhandene Prüf-/Wiederverwendungskette, keine automatische Materialfreigabe |
| staubsystem-lockfile | Bisoziation | unklar | Exakte getestete Modellkombination; bestehende Positivlisten noch abzugleichen |
| nasssaege-wasserwechsel-uebergabe | Bisoziation | besetzt / mode | Vorlage bestehender Inspektionssoftware |
| mauerlast-tageskonto | Bisoziation | besetzt | BAuA LMM-Multi-E, HSE MAC |
| asbest-vorarbeits-informationscheck | Constraint Release | besetzt | BG BAU hat Asbesthaus und Handlungshilfen; Regeländerung ersetzt keine Erkundung |

11 Engine-Prüfungen → 10 eigenständige Ideen nach Merge. Ein Doppelfund, kein unabhängiger Wahrheitsbeweis. Generischer Staubmaßnahmenplan und exakter Komponentenmatcher sind verschiedene Zuschnitte. Ergonomisches Tageskonto und persönliches Expositionsarchiv ebenso.

## Suchdienst-Spur

- `constraint-release-20261015-masonry-s1`: status ok, 3 Suchqueries; Rohantwort im privaten Lab-Archiv. TU-Graz- und BOKU-Primärseiten anschließend direkt gelesen. Neue Materialien/Demonstratoren schaffen noch keine belegte Softwarelücke.
- `inversion-20261015-masonry-s1`: status ok, 2 Suchqueries; Rohantwort im privaten Lab-Archiv. Kein spezifischer aktueller Fall-/Werkzeugnachweis gefunden. Die Suchzusammenfassung deutete ein Fortbestehen aus dem Interview von 2017 an; diese Schlussfolgerung wird ausdrücklich nicht als Evidenz übernommen.
- 5 geerdete Queries dieser Runde; WebSearch ebenfalls genutzt. Keine vollständige Projektlisten-Erhebung, keine Empfänger kontaktiert. Seitenabruf belegt Lesen einer Beschreibung, keine Installation oder Wirksamkeitsprüfung. PDF-/App-Abruffehler bleiben als Schnipsel markiert.

## Engine-Übergaben

Die folgenden Abschnitte dokumentieren Recherche und Quellenmeldungen vor der unabhängigen Review. Endurteile stehen im Klassifikationslog und im Prüfprotokoll.

# Maurer-Runde 15.10.2026 — Empirischer Scout

[native Codex; Suche: WebSearch]. Kein Vertex, kein Lab-Modellaufruf, keine Google Maps. Nur Lesebefehle im Repo; keine gemeinsamen Register geschrieben. Pflichtlektüre: Scout-Rolle, Ideenrunde/Suchmethode, aktuelle Playbook-Retros und relevante Atlas-Zeilen, Quellen-Lesefassung, Friedhof-README, Förderlandschaft. Bekannte Duplikate BedenkenBlitz, Kalkmörtel-Rechner, Holzsortierung und Stahl-DoP nicht erneut entwickelt.

## Kandidaten

| Idee (Kurzname) | Ein-Satz-Beschreibung | Quelle (Typ) | Empfänger (Institution, Mandat) | Urteil | Beleg | Restlücke |
|---|---|---|---|---|---|---|
| Mehrschlitz-Vorprüfung (`mauerwerk-mehrschlitz-vorpruefung`) | Mehrere geplante Installationsschlitze und Aussparungen als maßstäbliche Skizze erfassen; gegen tabellarische Tiefen/Breiten/Abstände und Summenregeln prüfen; unbekannte Wandparameter in eine Rückfrage an die Tragwerksplanung überführen. | A, KS-Statikhandbuch und Ziegellexikon | DGfM, RA Christian Bruch, Geschäftsführer; institutionelle Fachvermittlung plausibel, kein Software-Bauauftrag nachgewiesen. Person offiziell verifiziert. | `unklar` | [Seite] https://www.dgfm.de/verband/geschaeftsstelle ; [Schnipsel, PDF aufgelöst aber relevanten Abschnitt nicht im Volltext lokalisiert] https://www.kalksandstein.de/media/08_downloadcenter/01_statikhandbuch_geschuetzt.pdf ; [Schnipsel, direkter Abruf 404] https://www.ziegel.de/sites/default/files/2023-08/Ziegellexikon_2020_0.pdf | DE/EN-Suche fand Tabellen/PDFs und allgemeine Statikprogramme, keinen eindeutig passenden Mehrschlitz-Checker. Das belegt keine Abwesenheit. Primärquellen zeigen Regeln, keinen belegten Arbeitsengpass. Kein Why Now; deterministische Geometrie wäre seit Jahren möglich. Kein Foto-Statikversprechen. Erst Tragwerksplaner/Verband muss Bedarf und Regelwerksrechte bestätigen; kein Dose-Ready. |
| Staubmaßnahmen-Lotse (`maurer-staubmassnahmen-lotse`) | Tätigkeit, Material und Innen/Außen-Situation wählen und daraus Schutzmaßnahmen sowie Betriebsanweisung erhalten. | A, BG BAU Rohbau-/Staubhandreichungen | BG BAU/GISBAU, Arbeitsschutz-Information und Werkzeuge | `besetzt` | [Seite] https://www.bgbau.de/themen/sicherheit-und-gesundheit/gefahrstoffe/was-ist-wingis ; [Seite] https://www.ohcow.on.ca/occupational-illness/silica-control-tool-ontario/ | WINGIS bietet mobile Nutzung, gewerkebezogene Hilfen und Betriebsanweisungen in 17 Sprachen. OHCOW/BCCSA bieten einen aktuellen Silica-Control-Tool-Aktionsplan aus Nutzereingaben. Bloße DE-Lokalisierung des Ontario-Modells ist keine neue Dose; Modelle und Messdaten nicht unbesehen übertragen. |
| Verband-Fehlertrainer (`mauerverband-fehlertrainer`) | Auszubildende legen Steinlagen und erhalten Rückmeldung zu Überbindung, Kreuzfugen und Endstücken. | A/L, Mauerwerksausführung und berufliche Lehrmaterialien | ZDB/Ausbildungszentren grundsätzlich plausibel; wegen frühem Kill keine Personensuche | `besetzt` (Produktkandidat nur Schnipsel; unabhängiger Rechner als Seite) | [Schnipsel] https://apps.apple.com/dk/app/wobbly-blocks/id6802654169 ; https://apps.apple.com/co/app/byxor-vlet/id6815691126 ; [Seite] https://www.blocklayer.com/brick-gauge | Wobbly Blocks beschreibt interaktive Legebank, deterministische Regeln, Überbindungsfeedback, Fehlerklassen und Übungen; Byxor Vlet zusätzliche Lehr-/Fehlerkataloge. Store-Abruf Cache-Miss, keine App installiert oder Wirksamkeit getestet. Blocklayer direkt gelesen: Fugen-/Verband-Geometrie, Endstücke und Anpassung von Fugen sind bereits interaktive freie Websoftware. Deutsche Normdidaktik wäre enger, aber kein belegter eigener Engpass. |

## Suchaudit

Vor jedem Urteil CLI `npm run -s bib -- find`: `Staub --any` (nur ChemGefahr-Stopp/andere fachfremde Treffer; abgegrenzt), `Überbindemaß --any` (kein Treffer), `Schlitze --any` (nur fachfremder Optik-Log), `Gips Mauerwerk` (kein Treffer; letzterer nur verworfener Quellenast, kein zusätzlicher geprüfter Kandidat).

Quellenexploration: `site.bgbau.de Maurer Staub Absaugung Bau Entstauber Betriebsanweisung Unterweisung`; `site.zdb.de Mauerwerk Überbindemaß Fehler Ausbildung`; `site.ziegel.de Mauerwerk Aussparungen Schlitze Software`. Gefunden wurden amtliche Handlungshilfen sowie bestehende Bauphysiksoftware. Die Pain-Prämisse „Regeln werden per Hand geprüft“ bleibt für Schlitze nur indirekt.

Mehrschlitz (vier Existenzsuchen): `site.dgfm.de Schlitze Aussparungen Ansprechpartner`; `Schlitze Aussparungen Mauerwerk Rechner App`; `masonry chase recess calculator app`; `"masonry" "chase" "calculator" "Eurocode"`. Ergänzende Quellenlokalisierung `site.kalksandstein.de Schlitze Aussparungen` fand lesbares offizielles Statikhandbuch; zitierte Grenzwerttabellen vor jeglicher Implementierung am aktuellen Normstand prüfen. Keine zusätzliche Rettungssuche nötig.

Staub (vier Existenzsuchen): `site.bgbau.de Staub Werkzeug Entstauber Auswahl App WINGIS`; `"BG BAU" "Staub" "App" Auswahl`; `"silica" "control selector" construction tool`; `site.ohcow.on.ca "Silica Control Tool"`. BG BAU Volltext WINGIS gelesen, OHCOW Volltext gelesen (aktuelle Hinweise auf 2025-Webinare und deutschsprachiger Trägerstand nicht behauptet). HazComFast https://hazcomfast.com/tools/silica-table-1-control-selector nur Schnipsel, direkter Abruf interner Fehler; nicht als tragender Kill nötig.

Verband (zwei dedizierte Existenzsuchen plus Empfängerquellenexploration): `Überbindemaß Mauerverband lernen App Simulator`; `brick bond training simulator app bricklaying bond checking`. Store-Inhalt nur Suchindex; keine Installationsbehauptung. Blocklayer tatsächlich gelesen. Primäres Bewertungs-/Lehrmaterial ebenfalls gefunden, aber nur Schnipsel: https://www.cityandguilds.com/-/media/productdocuments/construction_and_the_built_environment/construction/8711/assessment-materials/8711-35-bricklaying/grade_standard_exemplification_materials/8711-305-bricklaying-occupational-specialism--summer-2025-pass-grade-sem-v1-1-pdf.pdf .

## Förderprojekte / negative Vorfilter

Vor Kandidatenbildung gesucht: `site.dbu.de projekt Mauerwerk Ziegel Rückbau Digitalisierung`; `site.prototypefund.de Bau Baustelle Maurer`; `site.civic-coding.de Bau Baustelle Projekte`. Kein vollständiger Bestandsabzug; keine Aussage „keine Projekte“.

DBU 40089/01 [Seite] https://www.dbu.de/projektdatenbank/40089-01/ finanziert Dachverband Lehm e.V., Rückgewinnung/Wiederverwendung von Mauerwerk mit Lehmdünnbettmörtel (Projektzeitraum 27.05.2025–31.03.2027). Das verhindert pauschales „Zirkuläres Mauerwerk ist frei“. DBU 40517/01 [Schnipsel] https://www.dbu.de/projektdatenbank/40517-01/ entwickelt interaktive Plattform für klimabedingte Schrumpfschäden an historischen Gebäuden: generischen neuen Rissschaden-Sammler nicht ableiten.

Weiterer Quellenast Recycling: `site.dbu.de Mauerwerk "Gips" "Sortierung"`. DBU-Berichte 32105/01 und 33674/02 beschreiben sensorgestützte Sortierung. [Seite] https://www.ibp.fraunhofer.de/de/kompetenzen/mineralische-werkstoffe-baustoffrecycling/mineralische-rohstoffe-rezyklate/mauerwerksabbruch.html beschreibt laufende EDF/optische Sortierung und ENSUBA; Ansprechpartner Dr. Sebastian Dittrich und Dr. Volker Thome. Kein eigener Kandidat, da Smartphone-Farbfoto Sulfat/Gips nicht belastbar nachweist und Feld bereits starke Forschung hat.

Prototype-Fund-Suche ergab nur Bewerbungs-/Programmseiten, keine belastbare Bauprojektliste. Civic-Coding-Suche ergab Programmseite, keine passende verifizierte Challenge. mFUND-Mobilität hier fachlich nicht passend. Keine Förderbrücke als offen zugesagt; bei keinem Scout-Kandidaten besteht Dose-Reife.

## Gelernt / Nächstes Mal

Arbeitsschutz ist beim möglichen Empfänger bereits Software mit Mobil-/Sprachzugang. Aus PDFs allein folgt keine Softwarelücke. Das gilt ebenso für Maurer-Lehrspiele: englische Indie-App-Suche tötet, bevor ein neues Spiel gebaut wird. Nächster sinnvoller enger Anker wäre ein belegter Übergabefehler zwischen Elektriker und Tragwerksplanung bei mehreren Schlitzen, zuerst fachlicher Bedarfsnachweis und aktueller Normvolltext; weitere allgemeine Rechner vermeiden.

## Quellenmeldung

QUELLE NEU: BG BAU WINGIS | typ=A | kategorie=fachgremium | enthaelt=Mobile Gefahrstoffinformation und Betriebsanweisungen in 17 Sprachen sowie gewerkespezifische Module | status=durchsucht | evidenz=seite | zugang=ja | ertrag=Idee maurer-staubmassnahmen-lotse | urls=https://www.bgbau.de/themen/sicherheit-und-gesundheit/gefahrstoffe/was-ist-wingis | note=Empfänger baut wesentliche Funktion bereits selbst.
QUELLE NEU: OHCOW Silica Control Tool | typ=H | kategorie=auslandsregulierung | enthaelt=Ontario-spezifische Expositionsabschätzung und Maßnahmenplan für Bauarbeiten mit kristallinem Silika | status=durchsucht | evidenz=seite | zugang=ja | ertrag=Idee maurer-staubmassnahmen-lotse | urls=https://www.ohcow.on.ca/occupational-illness/silica-control-tool-ontario/ | note=Aktuelle kostenlose mobile Anwendung; Übertragung der Messmodelle nach Deutschland nicht belegt.
QUELLE NEU: DGfM Geschäftsstelle | typ=W | kategorie=empfaenger | enthaelt=Offizielle Mandats- und Kontaktnennung Geschäftsführer RA Christian Bruch | status=durchsucht | evidenz=seite | zugang=ja | ertrag=Idee mauerwerk-mehrschlitz-vorpruefung | urls=https://www.dgfm.de/verband/geschaeftsstelle | note=Person verifiziert; Softwareauftrag und konkreter Bedarf nicht belegt.
QUELLE NEU: Kalksandstein Statikhandbuch Schlitze | typ=A | kategorie=norm | enthaelt=Tabellen und Nebenbedingungen für Schlitze und Aussparungen in Mauerwerk | status=angekratzt | evidenz=schnipsel | zugang=teilweise | ertrag=Idee mauerwerk-mehrschlitz-vorpruefung | urls=https://www.kalksandstein.de/media/08_downloadcenter/01_statikhandbuch_geschuetzt.pdf | note=PDF öffnet mit 216 Seiten; relevanten Abschnitt nicht am Volltext lokalisiert und aktuellen Normstand nicht geprüft.
QUELLE NEU: Ziegellexikon Ausführung | typ=A | kategorie=norm | enthaelt=Ausführungsregeln einschließlich Schlitzen und Aussparungen | status=angekratzt | evidenz=schnipsel | zugang=teilweise | ertrag=Idee mauerwerk-mehrschlitz-vorpruefung | urls=https://www.ziegel.de/sites/default/files/2023-08/Ziegellexikon_2020_0.pdf | note=Suchindex liefert Abschnitt 9; direkter Abruf ergab 404.
QUELLE NEU: Blocklayer Brick Gauge | typ=L | kategorie=referenzsammlung | enthaelt=Interaktive freie Verband- und Fugenrechnung mit Endstücken | status=durchsucht | evidenz=seite | zugang=ja | ertrag=Idee mauerverband-fehlertrainer | urls=https://www.blocklayer.com/brick-gauge | note=Geometrischer Kern bereits als Webwerkzeug vorhanden.
QUELLE NEU: Wobbly Blocks und Byxor Vlet | typ=L | kategorie=bildung | enthaelt=Indie-Apps für Mauerwerksverbände mit Übungen und Fehlerkatalog | status=angekratzt | evidenz=schnipsel | zugang=teilweise | ertrag=Idee mauerverband-fehlertrainer | urls=https://apps.apple.com/dk/app/wobbly-blocks/id6802654169 https://apps.apple.com/co/app/byxor-vlet/id6815691126 | note=Store-Suchindex beschreibt genaue Kandidatenfunktion; Direktabruf Cache-Miss und keine Installation.
QUELLE NEU: DBU Mauerwerk Lehmdünnbettmörtel 40089 | typ=D | kategorie=foerderung | enthaelt=Geförderte Rückgewinnung und Wiederverwendung von Mauerwerk beim Dachverband Lehm | status=durchsucht | evidenz=seite | zugang=ja | ertrag=– | urls=https://www.dbu.de/projektdatenbank/40089-01/ | note=Laufendes Projekt 2025 bis 2027; Zirkularität nicht pauschal frei.
QUELLE NEU: DBU Schrumpfschäden Plattform 40517 | typ=D | kategorie=foerderung | enthaelt=Interaktive Erfassungsplattform für klimabedingte Schrumpfschäden an historischen Gebäuden | status=angekratzt | evidenz=schnipsel | zugang=ja | ertrag=– | urls=https://www.dbu.de/projektdatenbank/40517-01/ | note=Vorfilter gegen generischen Rissschaden-Sammler.
QUELLE NEU: Fraunhofer IBP Mauerwerksabbruch | typ=I | kategorie=messverfahren | enthaelt=EDF-Trennung optische Sortierung ENSUBA und offizielle Forschungsansprechpartner | status=durchsucht | evidenz=seite | zugang=ja | ertrag=– | urls=https://www.ibp.fraunhofer.de/de/kompetenzen/mineralische-werkstoffe-baustoffrecycling/mineralische-rohstoffe-rezyklate/mauerwerksabbruch.html | note=Gips und Ziegeltrennung sind aktive technische Forschungsfelder statt Smartphone-Fotodiagnose.


<!-- masonry-bisociation-20261015 -->

### Maurer / Baustellenhandwerk 15.10.2026 — native Codex-Bisoziation

**Ausführung:** Native Codex-Subagentenrunde mit Websuche und direkten Primärseiten; kein Vertex, kein Lab-Suchdienst, kein Google Maps. Kein Claude-`[stand-in]` und kein Live-Engine-Lauf. AGENTS, Rollenbeschreibung, Skill samt Linsen, letzte Retro, Friedhof, Besetzungsatlas und Förderlandschaft gelesen. Vorfilter: BedenkenBlitz bleibt bestehende Dose; Kalkmörtel-Rechner bleibt bestehender Kandidat; DoP-Scanner und Holz-Festigkeitsgrading bleiben Gräber. `bib find` für mauer, staub, wasserwechsel/ergonomie/absaug und hebelast/mauerstein/steckbrief sowie `grab list --cause beim-empfaenger` ausgeführt. Keine starke identische Idee zu den drei unten; breite Treffer wurden als Nachbarn gelesen, nicht als Neuheitsbeleg gewertet.

**Modusliste (verbannt):** Aufmaß-App, Ziegel-/Mörtelmengenrechner, KI-Bautagebuch, Übersetzer, Schulungsvideos, Foto-Mängelerkennung, Bauzeitenplan, Wetteralarm, Werkzeugverwaltung, Materialmarktplatz, Bedenkenanmeldung, Haltungscoach per Kamera.

**Sättigung / Fördervorfilter:** DBU 40089/01 (Dachverband Lehm, Rückgewinnung mit Lehmdünnbettmörtel) und TexMöFug zeigen aktive Forschung zu lösbarem Mauerwerk. DBU-Projektsuche zu Staub führte zu industrieller Holzstaubtechnik, nicht zum unten beschriebenen Matcher. Site-Suchen Prototype Fund/Civic Coding zu Baustelle erbrachten keine spezifische Deckung; das ist kein vollständiger Förderbestandsabzug. Prototype Fund ist auf Datensicherheit/Software-Infrastruktur begrenzt, keine pauschale Förderbrücke für Maurer-Apps.

**Sechs Slots:** A1 Staubschutz: Material = Werkzeug, Haube, Schlauch, Entstauber; Mechanik = gemeinsam getestete Kombination; Ziel = kontrollierte Staubentstehung; Emotion = falsche Sicherheit bei passendem Stecker; Grenze = Modell- und Zubehörbindung; Zeit = vor Gerätewechsel. B1 Software-Abhängigkeiten: Material = Paketversionen; Mechanik = nur vollständiger Lockfile reproduziert getesteten Zustand; Ziel = reproduzierbare Funktion; Emotion = Vertrauen; Grenze = transitive Abhängigkeiten; Zeit = vor Update. Distanz 3. Reibung: einzeln geeignete Teile ergeben noch kein belegtes Gesamtsystem.

A2 Nassschnitt: Material = Säge und Umlaufwasser; Mechanik = Wasserwechsel als Bedingung; Ziel = Staubreduktion; Emotion = unsichtbarer Zustandsverlust; Grenze = bestätigter letzter Wechsel; Zeit = täglich. B2 Lebensmittel-Chargenübergabe: Materialien = Behälter und Übergabezettel; Mechanik = Zustand mit Datum statt Erinnerung; Ziel = nachvollziehbare Übergabe; Emotion = Vertrauen; Grenze = Meldung ist keine Messung; Zeit = Schichtwechsel. Distanz 3. Reibung: Säge bleibt dieselbe, Schutzbedingung verändert sich ohne sichtbaren Gerätewechsel.

A3 Mauersteinhandhabung: Material = Steine, Greifspanne, Arbeitshöhe; Mechanik = wiederholte Hebevorgänge; Ziel = körperliche Entlastung; Emotion = Verschleiß; Grenze = Tätigkeit und Häufigkeit; Zeit = Arbeitstag. B3 Energiebilanz: Material = Ereignisse; Mechanik = kumulierte Dosis statt Einzelereignis; Ziel = Tagesbudget; Emotion = Übersicht; Grenze = falsche Addierbarkeit; Zeit = Tagesabschluss. Distanz 3. Reibung: zulässiges Einzelgewicht beschreibt keine Tagesbelastung; einfache Kilogrammsumme wäre fachlich falsch.

**Personenlinsen und Tail-Sampling:** Polier eines Dreierbetriebs mit geliehenem Sauger; Auszubildende am gemeinsam genutzten Nassschneidetisch; Ergonomieberaterin mit wechselnden Tätigkeiten. Je Reibung fünf Skizzen, subjektive Moduswahrscheinlichkeiten (keine statistischen Messungen): A1 Typenschild-Matcher .07, Schlauch-Adapter-Shop .35, Lockfile .06, Gerätekoffer-QR .14, Rückrufalarm .18; A2 Wechsel-Ereignis .08, Timer .30, Trübungskamera .07, Übergabeplakette .09, Wasserverbrauch .16; A3 Tageskonto .08, Hebezähler .23, Haltungscoach .40, Arbeitslagenvergleich .07, Greifspannenspiel .09. Reality-Check entfernt Shop/Timer/Coach als Modus, Trübungskamera ohne validierten Zusammenhang, Wasserverbrauch ohne Problembeleg, übrige schwache Varianten als Bausteine. Drei Kandidaten vollständig geprüft:

| Idee | Beschreibung | Rahmen A × B, Distanz | Empfänger | Urteil / Handoff | Beleg | Restlücke |
|---|---|---|---|---|---|---|
| B-M1 `staubsystem-lockfile` | Modellgenau Werkzeug, Haube, Schlauch und Sauger gegen belegte Testkombination abgleichen; nur exakter Nachweis oder „nicht in Quelle belegt“, keine Sicherheitsfreigabe. | Staubschutz × Abhängigkeits-Lockfile, 3; combinational | BG BAU GISBAU/Bereich Gefahrstoffe; Walter Gunreben wird auf der gelesenen BG-Seite als Kontakt genannt, Aktualität vor Versand prüfen. | **`unklar`, stark verengt**; Needs Research, kein frei-Anspruch | [Seite] HSE CIS69 beschreibt vier Teile und warnt vor ungeeigneten Kombinationen. [Seite] BG ETEM nennt normgetestete abgestimmte Systeme und Positivlisten. [Seite] BG BAU Bau-Entstauber erläutert M-Klasse und Modelleignung. [Schnipsel] DEWALT liefert bereits 220+ OSHA-Kombinationen. | Modellübergreifender offener Abgleich eventuell fehlend; BG-BAU-Positivlisten selbst konnten nicht geöffnet werden. Ohne deren vollständigen Datenabzug und Prüfung der bestehenden Suche kein eigenständiger Neuheitsbeleg. |
| B-M2 `nasssaege-wasserwechsel-uebergabe` | Datierter letzter Wasserwechsel am gemeinsam genutzten Gerät, mit offenem Zustand bei fehlender Meldung. | Nassschnitt × Lebensmittel-Chargenübergabe, 3; combinational | BG BAU GISBAU / Ausbildungszentrum Bau; Person nicht ermittelt | **Kill `mode`** (keine neue Fähigkeit), Existenzfeld `besetzt` | [Seite] BG BAU Expo-Matrix unterscheidet Nassschneiden mit täglichem Wasserwechsel und ohne. [Seite] MapTrack hat freien täglichen Säge-Prestart mit Wasserprüfung. [Schnipsel] DailyBuild unterstützt eigene Checklisten, Nachweise, Fälligkeit. | Spezifisches Formularfeld Wasserwechsel ist eine Vorlage für bestehende Inspektionssoftware; kein belegter Bedarf an neuer Software. |
| B-M3 `mauerlast-tageskonto` | Belastungen verschiedener Hebe-/Mauertätigkeiten eines Tages vergleichen, Arbeitslagenvarianten gegenüberstellen. Keine Addition bloßer Kilogramm. | Steinhandhabung × Energiebilanz, 3; combinational | BAuA LMM / BG BAU Ergonomie | **Kill `gebaut` / `behoerde`** | [Seite] BG BAU C366 nennt Greifspanne und Gewichtsgrenzen. [Schnipsel, Abruf 403] BAuA bietet LMM-HHT mit integrierter Rechenhilfe und LMM-Multi-E über mehrere Tätigkeiten eines Arbeitstags. [Seite] HSE MAC bietet bereits interaktives Score Sheet für Heben, Tragen, Teamhandling. | Keine belastbare Restlücke. Ein anderes Berufslabel ändert die bestehende Methode nicht. |

**Lakunärer Test:** B-M1-Lücke ohne Lösung: Wer gemischte oder geliehene Geräte zusammensetzt, kann aus der Eignung der Einzelteile nicht ableiten, dass genau dieser Gesamtaufbau getestet ist. Entfernte Annahme: „M-Sauger plus passender Anschluss genügt als Testnachweis“. Warum jetzt: kein belegter neuer technischer Enabler; OCR und statischer Tuple-Matcher sind seit Jahren möglich. Das schwächt Novelty, kein erzwungenes „Why now“. B-M2 und B-M3 eröffnen keinen neuen Handlungsraum und werden nicht zu Survivors umetikettiert.

**Existenzsuche:** B-M1 vier DE/EN-Suchen (geprüfte Kombination, Kompatibilitäts-App, HSE tested combinations, BG-Datenbank); B-M2 drei (DE Wasserwechsel-Protokoll, EN wet saw daily checklist, DE tägliche Maschinenkontrolle); B-M3 drei (DE LMM-Rechner, EN bricklayer lifting calculator, HSE MAC). Anker- und Förderrecherchen separat. Direkte URLs: https://www.hse.gov.uk/pubns/cis69.pdf · https://etem.bgetem.de/4.2024/etem/emissionsarmes-verfahren-fuer-das-dosensenken · https://www.bgbau.de/themen/sicherheit-und-gesundheit/staub/massnahmen-gegen-staub-in-der-bauwirtschaft/bau-entstauber · https://www.bgbau.de/fileadmin/Themen/Arbeitsschutz/Expo-Matrix.pdf · https://www.maptrack.com/templates/concrete-saw-pre-start-checklist · https://www.baua.de/DE/Themen/Arbeitsgestaltung/Gefaehrdungsbeurteilung/Leitmerkmalmethode · https://www.hse.gov.uk/msd/mac/index.htm · https://www.dbu.de/projektdatenbank/40089-01/ .

**Gelernt:** Ein Compiler-Collider trägt als genaue Nachweisregel; Wartungs- und Dosis-Collider führen hier zu vorhandenen Inspektions- und Ergonomiewerkzeugen. **Fehler/Grenzen:** Wichtigste Positivliste nicht gelesen, Förderprojektlisten nur über gezielte Site-Suchen, kein Empfängerbedarf erfragt. **Nächstes Mal:** Erst zehn reale BG-BAU-Kombinationen einschließlich Zubehör und Schlauch exportieren; nachsehen, ob die vorhandene BG-Suche exakte Bestandsgeräte schon abgleicht. Bei Deckung sofort Kill `beim-empfaenger`; andernfalls mit BG BAU den Pflegebedarf und Datenrechte klären, bevor ein Scaffolding gebaut wird.

**Quellenmeldung** (nur Übergabe; keine Registeränderung):

QUELLE NEU: HSE CIS69 on-tool extraction | typ=A | kategorie=fachgremium | enthaelt=Auswahl und Zusammenspiel Werkzeug Haube Schlauch Entstauber | status=durchsucht | evidenz=seite | zugang=ja | ertrag=Idee staubsystem-lockfile | urls=https://www.hse.gov.uk/pubns/cis69.pdf | note=Direktes PDF gelesen; vier Komponenten, keine Kompatibilitätsdatenbank.

QUELLE NEU: BG ETEM abgestimmte staubarme Systeme | typ=A | kategorie=fachgremium | enthaelt=Normtest gebundener Kombinationen und Hinweis auf BG-BAU-Positivliste | status=durchsucht | evidenz=seite | zugang=ja | ertrag=Idee staubsystem-lockfile | urls=https://etem.bgetem.de/4.2024/etem/emissionsarmes-verfahren-fuer-das-dosensenken | note=HTML gelesen; Positivliste selbst nicht erreichbar.

QUELLE NEU: BG BAU Expo-Matrix | typ=A | kategorie=referenzsammlung | enthaelt=Staubexpositionen nach Tätigkeit und Schutzmaßnahmen | status=durchsucht | evidenz=seite | zugang=ja | ertrag=Kill nasssaege-wasserwechsel-uebergabe | urls=https://www.bgbau.de/fileadmin/Themen/Arbeitsschutz/Expo-Matrix.pdf | note=PDF gelesen, Stand 2015; Quellenalter sichtbar halten, kein aktueller Grenzwertrechner.

QUELLE NEU: HSE MAC interaktives Score Sheet | typ=A | kategorie=messverfahren | enthaelt=Bestehendes Werkzeug für manuelle Lastenhandhabung | status=durchsucht | evidenz=seite | zugang=ja | ertrag=Kill mauerlast-tageskonto | urls=https://www.hse.gov.uk/msd/mac/index.htm | note=HTML gelesen; englischer Besetzt-Test, kein Ersatz für deutsche Gefährdungsbeurteilung.

QUELLE NEU: BAuA Leitmerkmalmethoden Rechenhilfen | typ=A | kategorie=messverfahren | enthaelt=LMM-HHT und LMM-Multi-E Rechenformblätter | status=angekratzt | evidenz=schnipsel | zugang=teilweise | ertrag=Kill mauerlast-tageskonto | urls=https://www.baua.de/DE/Themen/Arbeitsgestaltung/Gefaehrdungsbeurteilung/Leitmerkmalmethode | note=Suchtext nennt Rechenhilfen ausdrücklich; direkter Abruf 403.




### Run 6 (15.10.2026 · Teamrunde Maurer / masonry / construction workers) — native Codex-Inversion
- **Betrieb:** Native Codex-Websuche und direkte Seitenabrufe; kein Vertex, kein Lab-Suchdienst, keine Google-Maps-API. Kein Live-Lab-Lauf und kein Claude-Stand-in.
- **Vorflug/Gedächtnis:** AGENTS.md, Inversions-Rolle/Skill, Friedhofsordnung und Atlas gelesen; neueste Retro oben (Heimatgedächtnis) durch vorgegebenes Bauthema ersetzt, offene Ortsnamen-Nacharbeiten nicht als erledigt markiert. Letzte Register-Retro verlangt öffentliche Pflichtdaten vor OP-4: hier bewusst keine neue Register-Idee. Atlas sperrt CE/DoP-Scanner und Mauerwerks-Schadenskartierung; bestehende Kalkmörtel-Dose/Kandidat und BedenkenBlitz ausgeschlossen. bib find Mauer, Exposition, Quarz, Ziegel, SOKA ausgeführt; SOKA ohne Bestandstreffer, Ziegel nur Nachbarideen. Förderkatalog gelesen; DBU-Projektliste im Baustofffeld geprüft.
- **Asymmetrie:** Betriebe melden Lohn/Urlaub und führen Gefahrstoffverzeichnisse; einzelne Beschäftigte müssen deren Richtigkeit verstehen und Unstimmigkeiten selbst bemerken. Beim Rückbau verdienen Anbieter an Wiederverwendungsketten; Maurer brauchen vor dem Abbruch eine Entscheidung. Beweismittelprüfung vor Funktionsversprechen: eigenes Tagebuch ist weder Expositionsmessung noch Anspruchsnachweis, Dokumentabweichung allein beweist keinen Betrug.

| Idee | Beschreibung | Zielsystem + Operator | Empfänger | Urteil | Beleg | Restlücke |
|---|---|---|---|---|---|---|
| **soka-urlaubsabgleich** | Beschäftigter/Beratung stellt SOKA-Auszug, eigene Lohnabrechnungen und bestätigte eigene Angaben gegenüber; markierte Differenzen mit Dokumentstellen und Prüffragen als Beratungsblatt exportieren | Urlaubskassenverfahren, Arbeitgeber-Monatsmeldung → **OP-2**, Arbeitnehmer prüft dieselben Eingangsdaten unabhängig | **Faire Mobilität**, institutionelles Beratungsnetz; Letitia Matarea-Türk ist im historischen Interview benannt, aktuelle Zuständigkeit vor Versand prüfen | **unklar**, Needs Research; stärkster Kandidat dieser Engine | [Seite] SOKA international nennt Arbeitgeberdaten, Urlaubstage, Bruttolohn und zwei Monate ab Erhalt für Korrekturbegehren. [Seite/PDF] Faire Mobilität beschreibt 2017 manuellen Abgleich und fiktiv abgezogene Urlaubstage. Quellen unten | Aktueller Beratungsbedarf, verfügbare echte anonymisierte Dokumentpaare, vorhandene interne Werkzeuge und sichere Zuordnung verschiedener Stichtage fehlen. Kein Anspruchsrechner, kein automatischer Widerspruch. Why-now nur heterogene lokale OCR/Extraktion, nicht Regelrechnen; vor 2024 nicht unmöglich. |
| **quarz-arbeitsleben-pass** | Arbeitnehmer sammelt eigene Tätigkeiten/Schutzmaßnahmen über Arbeitgeberwechsel hinweg als persönliche Unterlagenübersicht | Betriebliches Expositionsverzeichnis/ZED → **OP-2** | BG BAU/GISBAU, DGUV | **verengt** | [Seite] BG BAU benennt Messlücken; BG-BAU-ZED-Eingabehilfe [Schnipsel/PDF-Treffer] vorhanden. [Seite] Silasafe bietet bereits freie digitale Expositionsverwaltung; RKS/VIMMS und Construction Apps weitere englische Treffer [Schnipsel] | Nur arbeitnehmergeführte Offline-Portabilität denkbar, keine belegte Versorgungslücke. Datensammlung ersetzt Messung nicht. Formular wäre 2018 möglich, Why-now fehlt. Nicht an Packer geben. |
| **abbruchziegel-vorentscheidung** | Vor Abbruch Mengen/Format, Ausbauweise und Materialunterlagen aufnehmen und Wiederverwendung statt Zerkleinerung vorprüfen | Recycling-/Wiederverwendungskette → **OP-1** | bauteilnetz Deutschland, Dachverband Lehm/DBU-Projekt | **besetzt** im vorgeschlagenen breiten Zuschnitt | [Seite] Concular LRS Aachen berichtet reale Ziegel-Wiedernutzung einschließlich Rückbau, Aufbereitung, Prüfung/Zertifizierung. [Seite] DBU 40089/01 fördert Dachverband Lehm für Rückgewinnung von Lehmdünnbett-Mauerwerk, Laufzeit 2025–2027 | Ein Foto erlaubt weder Freigabe noch Festigkeitsklasse. Ein schlankes kostenloses Formular ist keine neue Fähigkeit. Kein neues Produkt aus allgemeiner Ziegel-Reuse-Idee ableiten. |

**Prüfspur soka-urlaubsabgleich (für Reviewer):**
1. Empfänger zuerst: Faire Mobilität berät in Herkunftssprachen, sammelt bereits relevante Dateien für Fallberatung. Historisches Fachinterview Oktober 2017 beschreibt exakt die manuelle Vergleichsarbeit; nicht als aktuelle Prävalenzstudie behandeln.
2. Deutsche Suche: `SOKA Kontoauszug prüfen App` liefert Kundenportal und Erklärung/Chatbot, keinen unabhängigen mehrdokumentigen Arbeitnehmer-Abgleich. Das ist ein negativer Suchbefund, kein Freiheitsbeweis.
3. Englische Funktionssuche: `construction holiday fund payslip checker`; benachbart **SlipCheck** für koreanische Migranten-Arbeitsabrechnungen (anderes Land/Regelwerk). Allgemeine Payslip-OCR ist besetzt; nur quellengebundener SOKA-Abgleich könnte eigenständig sein.
4. Nischensuche GitHub SOKA Urlaub: kein passendes offenes Vergleichswerkzeug in Ergebnissen. Interne Empfängerwerkzeuge bleiben unbekannt.
5. Sicherheits-/Verfahrensgrenze: Originaldokument und manuell bestätigte Felder erhalten; keine Behauptung, dass ungleiche Summen Fehler/Betrug seien. Jahresstichtag, neuere Urlaubsnahme und vom Arbeitgeber gemeldete vs. tatsächlich gezahlte Beträge getrennt zeigen. Zwei-Monats-Hinweis stammt aus SOKA-Seite, keine automatische juristische Fristberechnung ohne Regelprüfung.
6. Falsifikation Ticket 01: 10 anonymisierte, fachlich gelabelte Dokumentpaare von einer Beratungsstelle; mindestens 3 echte Darstellungsvarianten und 3 legitime Differenzen (Stichtag/Korrektur/Vorarbeitgeber). Felderkennung und Differenzklassifikation manuell gegenprüfen. Stoppen, wenn die Beratung bereits ein gleichwertiges Werkzeug hat oder Belegpaare nicht verfügbar sind.
7. Förderbrücke nur intern: Gemeinwohl-/Datensicherheits-Prototyp könnte nach Rechtsform-/Lizenzprüfung zum Prototype Fund passen; weder Förderfähigkeit von Faire Mobilität noch offene Frist behauptet oder verifiziert. Keine Fördertipp-Mail.

**Gelernt:** Der stärkere Inversionsanker liegt bei den Arbeitgebermeldungen hinter dem Portal, nicht beim erneuten Darstellen eines Urlaubskontos. Expositionsverwaltung und Ziegel-Reuse sind bereits produktive Felder. **Nächstes Mal:** Vor weiterer Entwicklung SOKA-Abgleich mit aktuellen Beratungsfällen und Empfänger-Werkzeugbestand falsifizieren. Historischer Schmerz plus aktuelles Verfahren ergibt noch keine Dose.

**Quellenmeldung**
QUELLE NEU: SOKA-BAU Arbeitnehmerkontoauszug | typ=A | kategorie=norm | enthaelt=Arbeitgebergemeldete Urlaubsdaten und Korrekturhinweis fuer Arbeitnehmer | status=angekratzt | evidenz=seite | zugang=ja | ertrag=Idee soka-urlaubsabgleich | urls=https://international.soka-bau.de/en/for-workers/workers-account-statement https://www.soka-bau.de/nachrichten/detail/jahreskontoauszuege-2025-informationen-zum-versand | note=Englische Originalseite gelesen; DE-Auszug nur Suchergebnis nach fehlgeschlagenem Direktabruf; Portal und mehrsprachiger Chatbot sind Nachbarn.
QUELLE NEU: Faire Mobilitaet SOKA-Fallberatung | typ=W | kategorie=empfaenger | enthaelt=Historisches Interview zur manuellen Pruefung von Urlaubskontoauszuegen und aktueller Beratungszugang | status=angekratzt | evidenz=seite | zugang=ja | ertrag=Idee soka-urlaubsabgleich | urls=https://www.faire-mobilitaet.de/dgb-fm-fileadmin/dateien/Dokumente/Berichte_und_Erfolge/Interview-mit-Letita-Matarea-Tuerk.pdf https://www.faire-mobilitaet.de/beratung/beratungsanfrage/ | note=PDF von Oktober 2017 vollstaendig gelesen; keine aktuelle Praevalenzmessung; aktuelle Beratung mit Dokumentupload gelesen.
QUELLE NEU: BG BAU Staub Expositionsermittlung | typ=A | kategorie=fachgremium | enthaelt=Messluecken und branchenspezifische Staubschutzhilfen auf Baustellen | status=angekratzt | evidenz=seite | zugang=ja | ertrag=Idee quarz-arbeitsleben-pass | urls=https://www.bgbau.de/themen/sicherheit-und-gesundheit/staub/kooperationen-zur-verbesserung-der-situation/gefaehrdungsbeurteilung-expositionsermittlung https://www.bgbau.de/fileadmin/Service/Angebote/Kurzanleitung_zur_Nutzung_der_Eingabehilfe.pdf | note=Themenseite gelesen; ZED-PDF nur Suchschnipsel; bestehende Eingabehilfe begrenzt Neuheit.
QUELLE NEU: Silasafe Expositionsverwaltung | typ=I | kategorie=messverfahren | enthaelt=Freies digitales Management von Silika-Expositionsdaten | status=angekratzt | evidenz=seite | zugang=ja | ertrag=Idee quarz-arbeitsleben-pass | urls=https://www.silasafe.com/ | note=Produktseite gelesen; Arbeitnehmerselbsteigentum und Offline-Portabilitaet nicht belegt.
QUELLE NEU: Concular LRS Aachen Ziegelreuse | typ=I | kategorie=referenzsammlung | enthaelt=Reales Ziegelwiederverwendungsprojekt mit Pruefung und Zertifizierung | status=angekratzt | evidenz=seite | zugang=ja | ertrag=Grabkandidat abbruchziegel-vorentscheidung | urls=https://concular.de/lrs-zentrum-in-aachen/ | note=Projektseite gelesen; belegt bestehende Prozesskette, kein Beleg fuer automatische Foto-Freigabe.
QUELLE NEU: DBU Mauerwerk Lehmdduennbett 40089-01 | typ=D | kategorie=foerderung | enthaelt=Gefoerdertes Projekt zur Rueckgewinnung und Wiederverwendung von Mauerwerk | status=angekratzt | evidenz=seite | zugang=ja | ertrag=Grabkandidat abbruchziegel-vorentscheidung | urls=https://www.dbu.de/projektdatenbank/40089-01/ | note=Primaerseite gelesen; Dachverband Lehm als Projekttraeger; bestehendes Forschungsmandat, keine neue Softwareluecke behauptet.



# Engine 4 — Mauerwerk, 15.10.2026
Native Codex reasoning; initial searches WebSearch, subsequent grounded Google search explicitly authorized by Félix. No Vertex discovery/reviewer agents and no Maps. Read local constraint log, playbook retro, graveyard taxonomy and `bib find --stamm Ziegel` / `Asbest` before recommendations. Funding prefilter: DBU project 40089/01 and TexMöFug.

## Pair 1: reusable masonry with separable mortar
- Ambition: reclaim whole bricks rather than crush them. Old blocker: hard cementitious bonds impede nondestructive separation; environmental screening and strength/quality assurance remain necessary. Primary evidence: Gamle Mursten order form asks about mortar and environmental screening; https://gamlemursten.dk/en/laboratory/order-a-test-of-your-bricks/ [Seite, read 15.10.2026].
- Delta: DBU project 40089/01, 27.05.2025–31.03.2027, examines clay thin-bed mortar; https://www.dbu.de/projektdatenbank/40089-01/ [Seite]. TexMöFug investigates textile-modified mortar joints for separability; https://renatbau.de/projekte/projektdetails/texmoefug-untersuchungen-zu-umsetzungsmoeglichkeiten-der-verwendung-einer-moertelfuge-mit-textilen-einlagen-zur-sortenreinen-zerstoerungsarmen-trennung-vom-mauerwerk-und-wiederverwendung-von-grossformatigen-planziegeln.html [Seite]. Research underway is not a universally available validated process.
- Assessment: `partial` only for research into new construction; `unchanged` for unknown existing bonded walls. Counterfactual: ordinary material inventory software already works without these changes. No new software capability follows.
- Remaining blockers: separation yield, testing, contamination, permissions, recipient workflow and actual unmet software need. Existence `besetzt` for generic reclamation intake: Gamle Mursten already requests the relevant information and offers tests. No claim of a universal automated fitness test.
- Route: stop, no new candidate and no duplicate grave. Decisive experiment belongs to funded materials researchers: compare recoverable intact units and testing cost against conventional bond, predeclare acceptable results; not an Amélie software ticket.

## Pair 2: new asbestos duties → pre-work information checker
- Ambition: reduce uninformed work on existing building fabric. Changed fact: BG BAU describes revised requirements and updated 2026 guidance, https://bauportal.bgbau.de/bauportal-22026/rund-um-die-bg-bau/aktualisierter-leitfaden-asbest [Seite]. BG BAU describes building-age evidence, sampling and the limited scope of any result, https://www.bgbau.de/themen/sicherheit-und-gesundheit/asbest/der-richtige-umgang-mit-asbest-beprobung-bis-befund [Seite]. This is guidance evidence, not a fresh legal-text audit.
- Old blockers: missing building information, representative sampling, qualification, exposure controls; rule changes do not remove these. Assessment `unchanged` for safe material identification by a phone.
- Prior art: official interactive Asbesthaus, https://www.bgbau.de/service/angebote/medien-center-suche/medium/asbest-in-gebaeuden [Seite], and official guidance/checklists. DE query `Asbest Checker BG BAU App Gebäudecheck Asbest Gebäudebestand Checkliste` finds them. No independent gap established for a generic hazard-location helper; existence `besetzt`, recipient already provides it. A photo cannot establish absence.
- Route: stop generic helper; do not produce safety instructions or compliance verdicts. No review candidate.

## Result
Two pairs, zero review candidates. Changes in rules and funded materials research do not themselves remove the operational blocker. These stopped scopes are logged as two existence checks, no resurrection of wood grading or steel DoP graves.

## Retro
Learned: a materials breakthrough needs a software gap in addition to a causal mechanism. Mistake to avoid: presenting a project end date as proof of delivered capability. Next: if funded researchers publish measured recovery datasets, first ask what comparison their current tools cannot perform.

## Quellenmeldung
QUELLE NEU: DBU Mauerwerk Lehmdünnbettmörtel 40089 | typ=D | kategorie=foerderung | enthaelt=Funded separable masonry research and project dates | status=durchsucht | evidenz=seite | zugang=ja | ertrag=– | urls=https://www.dbu.de/projektdatenbank/40089-01/ | note=Research project does not establish generally available validated capability.
QUELLE NEU: TexMöFug separable masonry joints | typ=L | kategorie=referenzsammlung | enthaelt=Research on textile modified separable mortar joints | status=durchsucht | evidenz=seite | zugang=ja | ertrag=– | urls=https://renatbau.de/projekte/projektdetails/texmoefug-untersuchungen-zu-umsetzungsmoeglichkeiten-der-verwendung-einer-moertelfuge-mit-textilen-einlagen-zur-sortenreinen-zerstoerungsarmen-trennung-vom-mauerwerk-und-wiederverwendung-von-grossformatigen-planziegeln.html | note=Project description read; no measured validation claimed.
QUELLE NEU: Gamle Mursten laboratory brick testing | typ=L | kategorie=referenzsammlung | enthaelt=Existing reclaimed brick intake and quality testing service | status=durchsucht | evidenz=seite | zugang=ja | ertrag=– | urls=https://gamlemursten.dk/en/laboratory/order-a-test-of-your-bricks/ | note=Mortar and environmental information requested; generic intake is occupied.
QUELLE NEU: BG BAU Asbesthaus | typ=L | kategorie=bildung | enthaelt=Existing interactive asbestos locations learning app | status=durchsucht | evidenz=seite | zugang=ja | ertrag=– | urls=https://www.bgbau.de/service/angebote/medien-center-suche/medium/asbest-in-gebaeuden | note=Official app description read, application not functionally tested.
QUELLE NEU: BG BAU Asbest guidance 2026 | typ=L | kategorie=referenzsammlung | enthaelt=Updated guidance and prework building information limitations | status=durchsucht | evidenz=seite | zugang=ja | ertrag=– | urls=https://bauportal.bgbau.de/bauportal-22026/rund-um-die-bg-bau/aktualisierter-leitfaden-asbest https://www.bgbau.de/themen/sicherheit-und-gesundheit/asbest/der-richtige-umgang-mit-asbest-beprobung-bis-befund | note=Guidance reviewed; underlying law not audited.

### Grounded-search follow-up (authorized 15.10.2026)
Google search service request `constraint-release-20261015-masonry-s1`, status `ok`, 3 queries, response archived by Lab. This was search grounding, no Vertex discovery agent. Raw generated summary is not accepted as measured evidence. Two returned primary URLs were independently opened: TU Graz 21.05.2026 reports a reversible-wall demonstrator, not general reuse approval for old walls; BOKU describes ongoing research on nondestructive brick assessment. This strengthens the materials-research delta but does not establish an unmet software workflow. Routes unchanged, no third candidate.

QUELLE NEU: TU Graz Re-Use Ziegelwand 2026 | typ=L | kategorie=referenzsammlung | enthaelt=Reversible masonry wall demonstrator reported May 2026 | status=durchsucht | evidenz=seite | zugang=ja | ertrag=– | urls=https://www.tugraz.at/news/artikel/re-use-ziegelwand-bauwirtschaft | note=Grounded result independently read; demonstration is not general approval of reclaimed existing masonry.
QUELLE NEU: BOKU historical brick reuse research | typ=I | kategorie=messverfahren | enthaelt=Research into nondestructive assessment of historical bricks | status=durchsucht | evidenz=seite | zugang=ja | ertrag=– | urls=https://boku.ac.at/lawi/igce/news-container/wiederverwendung-historischer-ziegel | note=Primary page independently read; no validated phone-only capability claimed.

### SOKA follow-up: current advice versus current case evidence
The grounded service returned Faire Mobilität's January 2025 construction-workers flyer. The orchestrator independently read both PDF pages on 15.10.2026: https://www.faire-mobilitaet.de/dgb-fm-fileadmin/dateien/Dokumente/Baugewerbe/Beratung/Ihre_Rechte_im_Baugewerbe_DE__01_25_.pdf . It explicitly recommends checking the SOKA statement and reporting incorrect entries. This establishes current advice for the comparison task, but not prevalence of errors or absence of internal counselor tools. No legal figures from the 2025 flyer are presented as current 2026 advice.


## Endergebnis nach unabhängigem Review

10 eigenständige Ideen: **0 frei, 0 verengt, 5 unklar, 5 besetzt**. Fünf Needs Research, fünf eng begrenzte Friedhofseinträge, keine Dose Ready. Quarz bleibt im Zuschnitt verengt, aber das abschließende Existenzurteil ist wegen ungeklärten Bedarfs unklar. Der Trainer-Kill wurde aufgehoben. Keine Dose wird erzwungen; Packer und Demo-Builder entfallen.

<!-- masonry-review-20261015 -->

## Maurer / Bricklayer / Construction workers — unabhängiger Review 15.10.2026

Native Codex-Reviewer, kein Vertex, kein Maps. Vier Engines konsolidiert: 10 unterschiedliche Zuschnitte, Wiederverwendungsaufnahme als ein Doppelfund (Inversion/Constraint Release); Staubmaßnahmen und Gerätekombinationsnachweis bleiben verschieden. Pflichtlektüre Reviewer-Rolle/Skill/Rubriken/Learning-Log, AGENTS und Friedhofsordnung gelesen; bib find Mauerwerk, SOKA, Quarz, Staub: Nachbarideen und heutige Logs, keine identische bestehende Dose. Keine Venture-Evaluation beauftragt. Scores sind Urteile über die heutige Evidenz, keine Messwerte. V2 ist Fitness (einfach = hoch).

**Ergebnis: 0 Dose Ready, 5 Needs Research, 5 eng begrenzte Stopps/Friedhof-Kandidaten.** Ein unsicherer Trainer-Kill wurde aufgehoben. Unbelegter Bedarf ist keine widerlegte Prämisse. Kein Empfänger wurde angeschrieben, keine Förderfähigkeit zugesagt. Ohne reife Dose entfallen Packer und Demo-Builder.

| Kandidat | V1 | V2 | V3 | V4 | V5 | V6 | V7 | V8 | Kern /35 | Gesamt /40 | Triage |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| soka-urlaubsabgleich | 4 | 4 | 3 | 4 | 3 | 4 | 3 | 1 | 25 | 26 | Needs Research; Evidenz-Gate offen |
| staubsystem-lockfile | 3 | 4 | 3 | 4 | 3 | 3 | 2 | 2 | 22 | 24 | Needs Research |
| mauerwerk-mehrschlitz-vorpruefung | 3 | 5 | 3 | 4 | 2 | 3 | 2 | 3 | 22 | 25 | Needs Research |
| quarz-arbeitsleben-pass | 2 | 4 | 3 | 4 | 3 | 3 | 3 | 1 | 22 | 23 | Needs Research; verengt |
| mauerverband-fehlertrainer | 2 | 5 | 4 | 3 | 3 | 4 | 2 | 4 | 23 | 27 | Needs Research; Kill aufgehoben |

### SOKA-Urlaubsabgleich (`soka-urlaubsabgleich`)

**Origin:** Inversion · Empfänger: Faire Mobilität (institutionelles Beratungsmandat; aktuelle Person unbestätigt).

- **V1 4:** Arbeitgebermeldungen aus Sicht des Beschäftigten gegen eigene Belege halten ist eine konkrete Inversion; Restlücke: Beschäftigte können Abweichungen zwischen mehreren Belegen nicht leicht einordnen. Keine Behauptung einer vollständig freien Softwarekategorie.
- **V2 4:** Tier 1 bei bestätigten Feldern; lokale OCR kann folgen, darf aber nicht aus Dokumenten stillschweigend Tatsachen machen. Personenbezogene Lohnbelege verlangen bewussten Export und Schutz der Originale.
- **V3 3:** Vergleich ist technisch möglich; Stichtage, Korrekturen und Vorarbeitgeber verhindern einen naiven Summenvergleich. Kein neuer Regelrechen-Enabler; lokale Verarbeitung ist eine Umsetzungsoption, kein historischer Unmöglichkeitsbeleg.
- **V4 4:** Urlaubskassenverfahren ist dauerhaft; Felder und Tarifstand müssen versioniert werden.
- **V5 3:** S: unabhängige Belegübersicht. W: Eingabeaufwand. O: Fallvorbereitung für Beratung. T/Achillesferse: legitime Differenzen werden zu vermeintlichen Ansprüchen. Anker: nachlesbare Dokumentstellen und bestätigte Felder, nie Betrugs- oder Anspruchsurteil.
- **V6 4:** Originalbelege + Feldschema → bestätigter Differenzvergleich → Beratungsblatt und wiederverwendbarer lokaler Belegvergleich. Der kleine Kern ist testbar.
- **V7 3:** Aktuelle offizielle SOKA-Seite verifiziert Felder und Verfahren, aber nicht das vorgeschlagene feldweise Vergleichsschema. Historisches Interview 2017 ist keine aktuelle Bedarfsstudie. Der Orchestrator las den Rechteflyer Januar 2025, S. 2: Er fordert zur Prüfung der Kontoauszüge und schriftlicher Meldung falscher Einträge auf. Das stützt die heutige Aufgabe, nicht Fallhäufigkeit oder fehlende interne Werkzeuge. Daher trotz 25/35 kein verifizierter Type-A/B/D-Beleg für den konkreten Kern und kein Dose-Ready.
- **V8 1, none:** Belegprüfung ist Arbeit, kein Spiel.

**Urteil:** Needs Research, stärkste Forschungspriorität. [SOKA Arbeitnehmerkontoauszug](https://international.soka-bau.de/arbeitnehmer/arbeitnehmerkontoauszug) direkt gelesen: beschäftigungsbezogene Felder stammen vom Arbeitgeber; die dort genannte Korrekturmöglichkeit wird nur als Quellenhinweis geführt, ohne automatische Rechtsfristberechnung. Keine Normprüfung ersetzt.

**Falsifikation:** 10 anonymisierte fachlich gelabelte Dokumentpaare, mindestens 3 Layouts und 3 legitime Differenzen (Stichtag, Korrektur, Vorarbeitgeber); jede Zuordnung von Beratung gegenlesen lassen. Vorher Empfängerbestand prüfen. Stoppen, wenn gleichwertige interne Software vorhanden ist oder solche Belege nicht für Validierung erhältlich sind. Kein Prototyp als Ersatz für fehlenden Bedarf bauen.

### Staubsystem-Lockfile (`staubsystem-lockfile`)

**Origin:** Bisoziation · Empfänger: BG BAU GISBAU/Messtechnik, Person vor Versand verifizieren.

- **V1 3:** Prüfnachweis einer konkreten Kombination ist enger als generischer Staubschutz. Restlücke: Einzelteileignung belegt nicht die getestete Zusammensetzung geliehener Geräte.
- **V2 4:** Tier 1/2, statischer Quellentuple-Matcher; Pflege von Modellbezeichnungen und Versionen ist der eigentliche Aufwand.
- **V3 3:** Exakte Identitätsprüfung machbar; aus fehlendem Treffer folgt keine Gefahr und aus einem Treffer keine allgemeine Freigabe. Schlauch/Haube dürfen nicht dazuerfunden werden.
- **V4 4:** Dauerhafter Arbeitsschutzbedarf, Listen ändern sich.
- **V5 3:** S: nachvollziehbarer Nachweis. W: schmale Quellenabdeckung. O: neutraler Modellabgleich. T/Achillesferse: falsches Vollständigkeitsgefühl. Anker: Fundstelle, Stand und explizit unbekannte Bestandteile.
- **V6 3:** Positivlisten + Modell-IDs → exakter Nachweisabgleich → Beschaffung/Leihgeräte-Übergabe; ohne vollständige Datenauswahl noch unbewiesener Stamm.
- **V7 2:** BG BAU listet geprüfte Systeme, aber weder vollständige Tupeldaten noch bestehende Suchfunktion wurden geprüft. [Offizielle Übersicht](https://www.bgbau.de/themen/sicherheit-und-gesundheit/staub/staubarme-bearbeitungssysteme) direkt gelesen. Ein Suchindex liefert [Mauernutfräsenliste 2026](https://www.bgbau.de/fileadmin/Gisbau/Positivliste_Mauernutfr%C3%A4sen_2026_01_28.pdf) mit Maschine/Entstauber/Schnitttiefe; Abruf 404. Das ist Schnipsel, kein Volltextnachweis für vier Komponenten.
- **V8 2, discovery:** Kleines Aha beim nachvollziehbaren Treffer, kein Spiel.

**Urteil:** Needs Research. Zehn echte Listeneinträge einschließlich Zubehörbedingungen manuell übertragen; quellenbelegte und nicht belegte Felder getrennt markieren. Bestehende BG-Suche mit zehn gemischten Bestandskombinationen testen; nur wenn deren Abgleich fehlt und GISBAU Pflege/Datenrechte bestätigt, Ticket definieren. Bei Deckung Kill beim Empfänger. Kein Kill aus der bloßen Existenz einer PDF-Liste.

### Mehrschlitz-Vorprüfung (`mauerwerk-mehrschlitz-vorpruefung`)

**Origin:** Scout · Empfänger: DGfM, fachliche Bedarfsträgerschaft unbestätigt.

- **V1 3:** Mehrere Schlitze einschließlich Summen/Abständen statt Einzelwerttabellen ist ein enger, bisher ungesicherter Rest. Abwesenheit eines Suchtreffers belegt keine Neuheit.
- **V2 5:** Tier 1, Geometrie und Tabellen ohne Sensor oder Backend.
- **V3 3:** Nur mit vollständig bekannten Wandparametern und Regelkontext; kein Statiknachweis. Kein aktueller technischer Enabler belegt.
- **V4 4:** Normgebundener dauerhafter Bedarf, Änderungen müssen nachgezogen werden.
- **V5 2:** S: gemeinsame Skizze. W: unbekannter Bestand. O: weniger Übergabefragen. T/Achillesferse: vereinfachte Tabelle wird als sichere Tragwerksfreigabe verstanden. Anker wäre eine ausschließlich quellengebundene Rückfragenliste.
- **V6 3:** Normstand + Wanddaten → Regel-/Geometrie-Grenzfälle → Übergabe an Tragwerksplanung. Kern noch ohne validierte Fixtures.
- **V7 2:** [KS Planungshandbuch](https://www.kalksandstein.de/media/08_downloadcenter/01_planungshandbuch_auflage7_gesch_de.pdf) Suchindex zeigt Tafel 28 mit Abstand/Summenregel; aktueller Normtext samt Fußnoten und Rechten nicht geprüft. Aus Normregeln folgt kein betrieblicher Engpass.
- **V8 3, discovery:** Verschieben in der Skizze kann ein geometrisches Aha geben.

**Urteil:** Needs Research. Zwei Tragwerksplaner sollen mindestens zehn reale Übergabefälle benennen; aktuellen Normstand und Lizenz zum Regelkern klären; zehn Goldstandardfälle einschließlich Unbekannt/Berechnung erforderlich erstellen. Erst dann deterministischen Kern überlegen. Ohne reale Mehrschlitzfälle oder bei vorhandener Deckung stoppen.

### Quarz-Arbeitsleben-Pass (`quarz-arbeitsleben-pass`)

**Origin:** Inversion · Empfänger: DGUV/BG BAU; Arbeitnehmerberatung als möglicher Bedarfsträger noch unbestätigt.

- **V1 2:** Persönliche Tätigkeitschronik ist ein bekanntes Muster; nur arbeitnehmergeführte Offline-Ergänzung bleibt offen.
- **V2 4:** Tier 1 möglich, aber Langzeitsicherung/Portabilität und private Gesundheitsnähe sind nicht durch localStorage gelöst.
- **V3 3:** Tätigkeiten können dokumentiert werden; daraus darf keine Expositionsdosis oder Berufskrankheitskausalität entstehen.
- **V4 4:** Langfristige Latenz und Dokumentationszweck sind dauerhaft; kein neuer Software-Enabler.
- **V5 3:** S: persönliche Kontrolle. W: Erinnerungsfehler. O: Unterlagen für Beratung. T/Achillesferse: ungemessene Eigenangaben werden amtlicher Historie gleichgesetzt. Anker: strikte Trennung Eigenangabe/Arbeitgebernachweis/Messwert.
- **V6 3:** ZED-Auszug + eigene Belege → Quellenchronik → Arzt-/Beratungsvorbereitung, kein Dosisrechner.
- **V7 3:** [DGUV ZED](https://www.dguv.de/ifa/gestis/zentrale-expositionsdatenbank-zed/index.jsp) und [Dokumente](https://www.dguv.de/ifa/gestis/zentrale-expositionsdatenbank-zed/downloads-und-dokumente/index.jsp) direkt gelesen: Beschäftigte können ihre Historie anfordern; digitales Anfrageformular vorhanden. Seit Dezember 2024 ist §10a der genannte Verordnungsanker. Keine aktuelle Lücke der Eigenchronik nachgewiesen; Rechtsnorm nicht selbst auditiert.
- **V8 1, none:** Laufende Unterlagenpflege.

**Urteil:** Needs Research, deutlich verengt. Prüfen, ob arbeitgeberübergreifende vorhandene ZED-Auszüge und Aushändigung den gewünschten Zweck bereits erfüllen; fünf Beratungsfälle mit fehlender/umstrittener Historie analysieren. Nur ein nachgewiesener Mehrwert gegenüber Auszugsanforderung plus Dateiablage rechtfertigt Fortsetzung. ZED allein tötet die Eigenangabenlücke nicht; Silasafe-Arbeitgeberverwaltung ebenso wenig.

### Mauerverband-Fehlertrainer (`mauerverband-fehlertrainer`)

**Origin:** Scout, Kill-Gegenprüfung · Empfänger: Bau-Ausbildungszentrum/ZDB, noch unbestätigt.

- **V1 2:** Regeltrainer ist kombinatorisch bekannt; genaue didaktische Lücke nicht nachgewiesen. App-Store-Indiz spricht stark gegen breite Neuheit.
- **V2 5:** Tier 1, interaktive Geometrie ohne Backend.
- **V3 4:** Platzierung und regelgebundenes Feedback plausibel; fachliche Lernwirksamkeit ungeprüft.
- **V4 3:** Dauerhafte Ausbildungsaufgabe, keine belegte neue Normlücke.
- **V5 3:** S: unmittelbares Feedback. W: Bildschirm ersetzt Handwerk nicht. O: Fehlvorstellungen sichtbar machen. T/Achillesferse: identischer Trainer existiert oder Ausbildung braucht etwas anderes. Anker: gelabelte echte Ausbildungsfehler.
- **V6 4:** Steingeometrie + Fehlerklassen → zehn Aufgaben mit Erklärungen → Unterrichtsdiagnostik.
- **V7 2:** [Wobbly Blocks](https://apps.apple.com/dk/app/wobbly-blocks/id6802654169) weiter nur Suchindex, Abruf Cache-Miss; Blocklayer ist ein echter Geometrierechner, aber kein Beleg für die gesamte Lehr-/Feedbackfunktion. Keine App installiert, keine Feature-Deckung getestet.
- **V8 4, mastery:** Eigene Lagen korrigieren kann eine klare Lernschleife ergeben.

**Urteil:** Needs Research, Scout-Kill aufgehoben. Wobbly Blocks/Byxor anhand zehn vorab festgelegter Aufgaben funktional prüfen (Überbindemaß, Kreuzfugen, Endstücke, Erklärung, deutsche Regeln). Ausbildungszentrum soll fünf ungelöste Fehlvorstellungen nennen. Bei vollständiger Deckung stoppen; deutsche Übersetzung allein ist keine eigenständige Fähigkeit. Unsicherheit schützt vor voreiligem Grab, nicht vor Gegenprüfung.

### Prüfung der fünf übrigen Stopps / Totenschein-Übergabe

Keine Vollscorecards nötig: frühe klar abgegrenzte Stopps, nicht als weitere überlebende Ideen zählen. Bibliothekar muss Duplikate und genaue IDs vor Anlage prüfen. Für breite Wiederverwendung einmaliges Grab, kein zweites für Constraint Release.

1. **maurer-staubmassnahmen-lotse** — `cause=beim-empfaenger`, `killer=behoerde`, `foundBy=empfaenger`, `origin=quelle`, `stage=kandidat`. [WINGIS](https://www.bgbau.de/themen/sicherheit-und-gesundheit/gefahrstoffe/was-ist-wingis) direkt gegengelesen: mobile gewerkspezifische Gefahrstoffhilfen/Betriebsanweisungen. OHCOW liefert zusätzlichen internationalen Gegenbeleg. Nur generischer Tätigkeits-/Schutzmaßnahmenlotse gestoppt; kein Kill des exakten Gerätesystemabgleichs. `resurrectIfDe`: Eine fachlich dokumentierte Tätigkeitsentscheidung ist durch WINGIS und vorhandene offizielle Staubhilfen nicht abgedeckt und der Empfänger bestätigt den Bedarf. `resurrectIfEn`: Reopen when a documented task decision is uncovered by WINGIS and existing official dust guidance and its intended recipient confirms the need.
2. **nasssaege-wasserwechsel-uebergabe** — `cause=mode`, `killer=keiner`, `foundBy=englisch`, `origin=bisoziation`, `stage=kandidat`. Datierter Wasserwechsel plus unbekannter Zustand ist ein Feld einer bestehenden Geräte-Prestart-/Übergabecheckliste; die Hypothese eröffnet keine neue Fähigkeit. MapTrack ist Nachbarbeleg, nicht als exakter Funktionsklon behauptet. `resurrectIfDe`: Feldstudie belegt einen ungelösten Gerätewechsel-/Übergabefehler, den vorhandene Checklisten mit Zeitstempel nicht darstellen können. `resurrectIfEn`: Reopen when field evidence establishes a handover failure that existing timestamped equipment checklists cannot represent.
3. **mauerlast-tageskonto** — `cause=beim-empfaenger`, `killer=behoerde`, `foundBy=deutsch`, `origin=bisoziation`, `stage=kandidat`. [BAuA LMM](https://www.baua.de/leitmerkmalmethoden) und [LMM-Multi-E](https://www.baua.de/formblatt-lmm-multi-e) Suchindex nennen Rechenhilfe über Teiltätigkeiten; Direktabruf 403. Der volle fachliche Tagesvergleich ist bereits offizieller Werkzeugzweck. Nur Zusammenfassung derselben Belastungsart; keine erfundene Mischbelastungssumme. `resurrectIfDe`: BAuA bestätigt eine notwendige Arbeitslagen-/Tätigkeitskombination, die LMM-HHT und LMM-Multi-E nicht abbilden und die fachlich valide berechnet werden kann. `resurrectIfEn`: Reopen when BAuA confirms an essential work-scenario comparison not represented by LMM-HHT or LMM-Multi-E and a valid calculation method exists.
4. **abbruchziegel-vorentscheidung** — `cause=mode`, `killer=keiner`, `foundBy=englisch`, `origin=inversion`, `stage=kandidat`. [Gamle Mursten](https://gamlemursten.dk/en/laboratory/order-a-test-of-your-bricks/) direkt gelesen: Aufnahme von Gebäude-, Mörtel- und Umweltdaten plus reale Prüfung vorhanden. Kein vollständiger identischer Offline-Entscheidungsautomat behauptet; gestoppt wird die generische Aufnahme/Weiterleitung ohne neue Fähigkeit. DBU/TexMöFug sind Forschung und kein Beleg einer universell gelösten Trennung. `resurrectIfDe`: Wiederverwendungsakteure benennen eine konkrete ungelöste Vorentscheidung und liefern veröffentlichte validierte Daten, aus denen Software sie ohne vorgetäuschte Materialfreigabe ableiten kann. `resurrectIfEn`: Reopen when reuse practitioners identify an unmet preliminary decision and publish validated data that software can use without pretending to certify material fitness.
5. **asbest-vorarbeits-informationscheck** — `cause=beim-empfaenger`, `killer=behoerde`, `foundBy=empfaenger`, `origin=quelle`, `stage=kandidat`. Nur generischer Fundstellen-/Informationshelfer gestoppt: [Asbesthaus](https://www.bgbau.de/service/angebote/medien-center-suche/medium/asbest-in-gebaeuden) direkt gelesen, interaktive Fundstelleninformation des gewünschten Empfängers. Kein Kill eines nie geprüften vollständigen baurechtlichen Dokumentencheckers. `resurrectIfDe`: BG BAU bestätigt eine konkrete Informationsübergabe, die Asbesthaus und bestehende Checklisten nicht unterstützen; erforderliche Daten stehen verlässlich bereit. `resurrectIfEn`: Reopen when BG BAU confirms a specific unsupported information handover beyond Asbesthaus and existing checklists and reliable required data are available.

### Quellenmeldung / Grenzen

QUELLE NEU: DGUV ZED Arbeitnehmerzugang | typ=A | kategorie=fachgremium | enthaelt=Expositionshistorie auf Antrag und digitales Anfrageformular; aktueller §10a-Hinweis | status=durchsucht | evidenz=seite | zugang=ja | ertrag=Needs Research quarz-arbeitsleben-pass | urls=https://www.dguv.de/ifa/gestis/zentrale-expositionsdatenbank-zed/index.jsp https://www.dguv.de/ifa/gestis/zentrale-expositionsdatenbank-zed/downloads-und-dokumente/index.jsp | note=Arbeitnehmerzugang vorhanden; Eigenchronikbedarf offen. Suchindex und Seite nennen verschiedene Excel-Stände, nicht als geprüfte Aktualität übernommen.
QUELLE NEU: BG BAU Positivliste Mauernutfräsen 2026 | typ=A | kategorie=referenzsammlung | enthaelt=Modellkombinationen Maschine Entstauber plus Schnitttiefe | status=angekratzt | evidenz=schnipsel | zugang=teilweise | ertrag=Needs Research staubsystem-lockfile | urls=https://www.bgbau.de/fileadmin/Gisbau/Positivliste_Mauernutfr%C3%A4sen_2026_01_28.pdf | note=Index mit Daten, direkter Abruf 404; keine vierteilige Kompatibilität erfunden.

**Review-Lerneffekt:** Score-Summe ist notwendig, nicht hinreichend: SOKA erreicht 25/35, doch aktueller Bedarf, Feldmapping und Empfängerwerkzeuge sind offen. Norm-/Behördenseite belegt das Verfahren, nicht automatisch den konkreten Softwareengpass. Umgekehrt rechtfertigen App-Store-Schnipsel und ein benachbarter Rechner keinen sicheren Kill einer gesamten Lernfunktion. Nächster Schritt ist gezielte Falsifikation dieser fünf Resthypothesen, keine weitere allgemeine Baustellen-App-Suche.

QUELLE NEU: Faire Mobilität Rechte im Baugewerbe Januar 2025 | typ=W | kategorie=empfaenger | enthaelt=Aufforderung zur Prüfung der SOKA-Kontoauszüge, schriftlicher Korrektur und Beratung | status=durchsucht | evidenz=seite | zugang=ja | ertrag=Needs Research soka-urlaubsabgleich | urls=https://www.faire-mobilitaet.de/dgb-fm-fileadmin/dateien/Dokumente/Baugewerbe/Beratung/Ihre_Rechte_im_Baugewerbe_DE__01_25_.pdf | note=Orchestrator las S. 2 direkt; aktueller Aufgabenbeleg, keine Fallstatistik oder Werkzeuglücke.

## Gedächtnis-Abschluss

Bibliothekar über die Bibliotheks-CLI: zehn neue Prüfprotokollzeilen; fünf Totenscheine mit begrenztem Zuschnitt und Auferstehungsbedingung (149 → 154 Gräber); 29 neue, deduplizierte Quellen einschließlich Review-Nachträgen (338 → 367), alle 29 mit Q1–Q6 bewertet. Drei DBU-Quellenmeldungen wurden zusammengeführt. Aktueller Rechteflyer als zusätzliche URL der Faire-Mobilität-Quelle erfasst. Playbook: Trefferquote, Besetzungsatlas, Methoden-/Orchestrierungsretro und konkrete nächste Falsifikationen aktualisiert. Keine neue Dose und keine Änderung bestehender Dosen; daher keine zweisprachige Verpackung oder Demo-Bauphase.

**Quellenmeldung:** Alle Engine-/Reviewer-Blöcke wurden vom Bibliothekar normalisiert und über die CLI importiert; `Kill`, `Grabkandidat` und `Needs Research` aus den Rohmeldungen sind keine CLI-Ertragswerte. Verbindlich sind Quellenregister und Prüfprotokoll, nicht die Rohübergaben. Seiten-/Schnipselgrenzen bleiben erhalten.

## Validierung

`npm run bib -- abschluss` außerhalb der Sandbox: export:data, lint und test vollständig grün; 78 Vitest-Dateien / 1178 Tests, 34 Python-Tests und sieben Lab-Intake-Tests. Öffentliche Daten nach Ergänzung der Nasssäge-Beleglinks erneut exportiert. `git diff --check` ohne Befund. Es wurden keine Empfänger kontaktiert.
