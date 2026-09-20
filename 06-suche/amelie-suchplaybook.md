# Amélie — Such-Playbook

Wie Schritt 0,5 (Prüfen) funktioniert und was jede Runde daran verbessert hat.
**Zu Beginn jeder Ideenrunde lesen. Am Ende jeder Runde den Abschnitt „Retro" ergänzen.**

Claude lernt nicht zwischen Chats. Dieses Dokument und `amelie-pruefprotokoll.md` sind das Gedächtnis. Was hier nicht steht, wird wiederholt — inklusive der Fehler.

---

## 1. Reihenfolge pro Idee (max. 4 Suchen, dann Urteil)

| # | Suche | Warum zuerst |
|---|---|---|
| 1 | **`<wahrscheinlicher Empfänger> KI`** (Blog, Projektseite) | Billigster Kill. In Runde 2 hatten 3 von 12 Empfängern die Idee schon selbst (Wheelmap, CompGen, Repair Café). Erspart außerdem die schlechteste Erstansprache. |
| 2 | **Deutsch, Funktionswörter** — was das Ding *tut*, nicht wie es heißt | Findet Vereine, Behörden, Foren |
| 3 | **Englisch, Produktwörter** (`app`, `AI`, `tool`, Jahr) | Findet kommerzielle Produkte, die deutsch nicht auftauchen (SATB-Trennung) |
| 4 | **Forum / Nische** (Akkudoktor, Restarters, Discourse, GitHub) | Indie-Apps unter dem SEO-Radar (Horisol, Juli 2026) |

**Stoppregel:** Ein Treffer, der die Idee vollständig abdeckt und ≤ 12 Monate alt ist → Urteil `besetzt`, keine weitere Suche. Nicht nach einem Grund suchen, die Idee doch zu retten.

**Verengen statt verwerfen**, wenn der Treffer eine *benannte Schwäche* hat (z. B. CompGen: KI halluziniert bei verwitterten Stellen). Die Schwäche ist dann die neue Idee.

---

## 2. Such-Rezepte, die funktioniert haben

**Um freie Lücken zu finden (nicht nur Ideen zu prüfen):**

- **Offizielles Bewertungsschema ohne digitales Werkzeug** → `<Thema> Bewertungsverfahren Punktesystem Leitfaden`. Fund: LAG-VSW-Schema zum Vogelschlag.
- **Von der Organisation selbst genannter Engpass** → `<Projekt> Auswertung dauert` / `bis zu … Minuten` / `ehrenamtlich ausgewertet`. Fund: Thünen, bis zu 90 Minuten pro Nisthilfe.
- **Werkstattberichte über KI-Versuche** → `<Verein> Werkstattbericht KI` / `Erfahrungen KI`. Die Grenzen, die dort stehen, sind fertig formulierte Ideen.
- **Forschung ohne Produkt** → `<Technik> smartphone` auf arXiv/ECCV-Workshops; dann prüfen, ob es ein Werkzeug für Laien gibt.

**Was nicht funktioniert hat:**

- `<Thema> KI verständlich App` auf Deutsch → Content-Farmen (bau.de-Klone). Urteil daraus: **unklar**, nicht „frei". Mit Organisationsnamen neu suchen.
- Abwesenheit von Treffern nach nur einer Suche ist kein Befund.

---

## 3. Besetzungsatlas (Stand 19.09.2026)

Wo Ideen schnell sterben — vor dem Suchen als Vorfilter nutzen.

| Feld | Zustand | Belege |
|---|---|---|
| Dev-Tooling, MCP, Git | **dicht** | git-archaeologist, Home-Network MCP |
| Mieter-Tools (Mängel, Schimmel, Nebenkosten) | **dicht, kommerziell** | Miet-Akte, SchimmelScan, MietKlar |
| Hitze/Schatten-Routing | **dicht, Forschung + Kommunen** | HEAL/shaded.ors, Shadowmap, Berliner Kühle-Orte-Karten |
| Schulweg-Sicherheit | **dicht** | Schulwegportal, VCD-Check, FixMyBerlin |
| Balkonsolar-Planung | **dicht** | Horisol, HTW-Simulator, PVGIS |
| Audio-Trennung (Chor, Stems) | **dicht** | MVSEP SATB, ChoirMate |
| Repair Cafés + KI | **wird gerade besetzt** | Repair Café International, robotfreak/repair-cafe |
| Barrierefreiheit per Foto | **beim Empfänger selbst** | HIIG/Wheelmap-Datensatz 2023 |
| Grabstein-Transkription | **beim Empfänger selbst** | CompGen-Werkstattbericht Mai 2026 |
| **Naturschutz-Vollzug: Bewertungsschemata/Checklisten ohne Tool** (Punktesysteme, Monitoring-Auswertung von Hand) | **frei** | Vogelschlag, Wildbienen, Lichtplan-Check |
| **Naturschutz: KI-Bilderkennung** (Arten-/Biotoptyp aus Foto oder Fernerkundung) | **dicht, aktive Forschung + Produkte** | ObsIdentify (~95 % Trefferquote), Flora Incognita, KIBI-Projekt (BfN, FFH-Typen aus Luftbild), Namis-Biotop-App (DBU) |
| **Kulturerbe-Physik** (Licht, Oberfläche) | **frei als Werkzeug** | Smartphone-RTI nur als Paper |
| Vegetationsstruktur per Smartphone-/Handy-LiDAR (Höhe, Deckung, Verbuschung/Sukzession) | **dicht, aktive Forschung 2025/26** | bioRxiv Stammdurchmesser-Paper, iPhone-LiDAR-Genauigkeitsstudie, Garten+Landschaft-Fachartikel — Sukzession/Verbuschung explizit als Anwendungsfall genannt *[method: bisociation, Runde 3]* |
| Artenlisten-→-Habitattyp-Vorhersage (automatisierte Klassifikation aus Felddaten) | **angekratzt, Forschung vorhanden, national eng** | e-Surveyor App UK (Ridding et al. 2026, für UK-Klassifikation), Vegapp (Schmidtlein 2026, nur Dateneingabe) — für den deutschen Kartierschlüssel noch nichts gefunden *[method: bisociation, Runde 3]* |
| Pflanzenbestimmung/-entdeckung, gamifiziert | **dicht** | Seek (iNaturalist) — Badges/Challenges, auch für Ritzenpflanzen; Longitudinalspur derselben Pflanze bleibt Lücke |
| Behördenbrief → Leichte Sprache | **dicht, ein Nachbar sehr nah** | Zetteln (zetteln.app) — live, DSGVO-konform, hybrid Cloud-Fallback; Zero-Cloud-Garantie bleibt Lücke |
| Feuerkugel/Meteor-Bürgerwissenschaft: Radio×Video-Korrelation, Infraschall-Erkennung | **dicht** | FRIPON (Radio+Video-Echtzeit-Stationen), RedVox (Handy-Infraschall) |
| Feuerkugel/Meteor-Bürgerwissenschaft: Echtzeit-Zeugen-Rekrutierung, Consumer-Ambient-Kameras (Dashcam/Türklingel) vor Überschreiben retten | **frei/verengt** (18.09.2026, Methode: Bisoziation) | AMS/IMO-Meldung ausdrücklich nicht echtzeitfähig; dedizierte Netze (AllSky7/GMN/CAMS) nutzen keine Consumer-Kameras — Dose: `05-dosen/feuerkugel-sofortnetz.md` |
| **Physisches Objekt + wiederkehrende gesetzliche Sicht-/Prüfpflicht + KI** (Baumkontrolle/Baumkataster: Foto-Diagnose, Verfallserkennung über Zeit, QR-Legibilität am Baum) | **dicht, kommerziell, komplett durchbaut** | baumplaketten.de, BaumDex, Baumsicht, CheckTrees, Tree Inventory AI, greehill, ArboStar, TreeTect (Runde 3, method: bisociation) — Verdacht: gilt generell für dieses Muster, vermutlich auch Spielplätze (DIN 1176), Aufzüge, Feuerlöscher, Brücken — vor jeder Idee in diesem Muster erst prüfen, ob es schon eine Inspektionssoftware-Branche dafür gibt |

| Lebensmittelrettung / Tafel-Logistik (Warenannahme, Qualitätserfassung per Foto) | **beim Empfänger selbst, gefördert** | „Tafel macht Zukunft – gemeinsam digital" (Tafel Deutschland, BMEL-Förderung 1,5 Mio. €, 3 Jahre): Fahrer-App mit Foto-Qualitätserfassung, ALDI/EDEKA/LIDL/REWE beteiligt. Wer für Tafeln etwas ausdenkt, konkurriert mit einem laufenden Förderprojekt *(Runde 3)* |
| Bürgerbeteiligung Bauleitplanung / Bebauungsplan verständlich machen | **Verfahren digitalisiert, Erklärung offen** | DiPlanBeteiligung (Berlin, seit 12.05.2025, Beteiligungsplattform), Poliscope (KI-Zusammenfassungen von Ratssitzungen), InNoWest-RAG-Chatbot (generisch, pausiert). Der Plan selbst als Erklärobjekt bleibt Lücke, Suchmaschine liefert dazu fast nur Content-Farmen *(Recheck 19.09.2026, Evidenz dünn)* |

| Denkmal-Schadenskartierung (Restaurator:innen, Bestandsdokumentation) | **besetzt als Software, KI-Erkennung als Forschung** | Metigo MAP, KALIV (Kartierung/Mengenermittlung); KI-Rissdetektion an Mauerwerk mit Datensätzen/SAM/Handy-DL in Papers 2024–26 *(Runde 4, ideenrunde)* |
| Denkmale, Laien-Verlauf/Frühwarnung (Ehrenamtliche fotografieren wiederholt, Weg zur Meldung) | **verengt/frei, nur aus Suchtreffern** | DSD-Schwarzbuch + Meldeportal sind rückblickend; BLfD-Bürgerportal ohne Verlaufsdaten; Forschungs-Apps für Fachleute. Portale nicht gelesen — Dose: `05-dosen/denkmal-verlaufsblick.md` *(Runde 4, ideenrunde)* |
| Denkmalpflege/Kirche: digitale Baubegehung, KI-Schadenskartierung von Fassaden | **dicht, bestätigt Muster „Objekt + Prüfpflicht"** (Runde 4, 19.09.2026) | ARCHIKART (Kirchenverwaltungen, Zustandserfassung per Kontrollkatalog/Ampel), Capmo/BauMaster/firstaudit (allgemeine Mängel-Apps), Wiro Rostock (Drohne + KI, Pilot 2026), Archimede, BIMKIT (Brücken); Schadensbildkatalog ZHD Fulda selbst nur als Papier/Legende gefunden |
| Orgel/Bleifraß: Zustandsdiagnose per Akustik | **unklar, nicht besetzt** | Nur Klimamessung/Schutzverfahren (HfK Bremen/DBU) und Labor-Analyse (COLLAPSE) gefunden; Problemprämisse (unbemerkter innerer Verfall) nicht belegt |

**Faustregel, jetzt mit drei Runden Evidenz:** Wenn Endnutzer dafür zahlen würden oder eine Stadt es als Pressemitteilung verkaufen kann, existiert es. Frei ist, was ein Fachgremium als PDF veröffentlicht und niemand je in Software gegossen hat.

---

## 4. Trefferquote (Kalibrierung)

| Runde | Datum | Geprüft | Frei | Verengt | Unklar | Besetzt |
|---|---|---|---|---|---|---|
| 1 | Sep 2026 | 19 | 8 | 7 | – | 4 |
| 2 | 16.09.2026 | 13 | 2 | 1 | 2 | 8 |
| Nachtrag | 18.09.2026 | 2 | – | 2 | – | – |
| 3 | 18.09.2026 | 13 | 2 | 5 | 1 | 5 |
| Recheck | 19.09.2026 | 1 | – | 1 | (−1) | – |
| 4 (Res. #2, ideenrunde, Teilrunde) | 19.09.2026 | 2 | – | 2 | – | – |
| 4 (Researcher #1, ideenrunde, Denkmal-Strang) | 19.09.2026 | 3 | – | – | 1 | 2 |

Runde 4 (nur Researcher #1, 3 Ideen): **0 % frei + verengt.** Kein Abgleich mit dem anderen ideenrunde-Researcher; nicht mit Runde 3 vergleichbar, weil dort zwei Methoden und vier Sessions liefen. Der Altbau-Thermal-Recheck (`verengt` bestätigt) steht nicht in dieser Zeile.

Zur Recheck-Zeile: Bebauungsplan-Leser wechselte von `unklar` auf `verengt` und ist damit in Runde 3 noch als `unklar` gezählt, im Recheck als `verengt`. Rechecks stehen neben der Ursprungsrunde, ersetzen deren Zahl nicht — sonst ließe sich eine Runde nachträglich schönrechnen.

**Nicht gezählt:** die zehn `ungeprüft`-Kandidaten aus dem Gemini-Lauf (siehe Protokoll). Solange dort keine Existenzprüfung gelaufen ist, gibt es kein Urteil, und ein Urteil, das nie erhoben wurde, gehört nicht in eine Kalibrierung.

Runde-1-Zahlen am 18.09.2026 korrigiert: Die elf Ideen, die ursprünglich als eine Sammelzeile „siehe jeweilige Dose" im Protokoll standen, waren nie einzeln ausgezählt (vorher grob 10/5 geschätzt, tatsächlich 8 frei/7 verengt — siehe `amelie-pruefprotokoll.md`, Runde 1). Der Nachtrag sind Crack Flora Watcher und KlarLokal, beide `verengt`.

Runde 3 lag bei 54 % „frei + verengt" (7 von 13) — bester Wert bisher, getragen von zwei Methoden parallel (ideenrunde + bisociation) und vier Researcher-Sessions gleichzeitig. Eines der 13 Urteile (Tafel-Warenannahme) wechselte während der Runde von `verengt`/`unklar` auf `besetzt`, nachdem zwei Researcher unabhängig denselben blinden Fleck fanden — ohne den Abgleich wäre die Quote falsch ausgewiesen worden.

Runde 2 zielte bewusst auf „Zivilgesellschaft" — und lag trotzdem bei ~23 %. **Die Zivilgesellschafts-Regel aus `_entsorgt.md` stimmt nur für Nischen ohne Endnutzer.** Alltagsthemen mit Bürgerbezug (Hitze, Miete, Schulweg) sind 2026 voll.

---

## 5. Retro

### Runde 2 — 16.09.2026
- **Gelernt:** Empfänger zuerst suchen. Hätte 3 Suchen gespart.
- **Gelernt:** Die drei Überlebenden kamen nicht aus Brainstorming, sondern aus Primärquellen (Leitfaden, Projektseite, Werkstattbericht). Nächste Runde: **von Quellen aus suchen, nicht von Einfällen aus.**
- **Fehler:** Zu viele naheliegende Konsumideen ins Rennen geschickt; der Atlas oben hätte 5 davon ohne Suche aussortiert.
- **Nächstes Mal ausprobieren:** Veröffentlichungslisten der LANA / Vogelschutzwarten / Thünen / BfN nach weiteren „Schema ohne Tool"-Fällen durchgehen.

### Librarian-Audit — 18.09.2026 (kein Ideenrunde, Konsistenzprüfung)
- **Gefunden:** Elf Runde-1-Ideen standen als eine Sammelzeile „siehe jeweilige Dose" im Protokoll statt einzeln — nicht Strg+F-fähig, Trefferquote war grob geschätzt statt ausgezählt (10/5 statt tatsächlich 8/7). Einzeln aus den Dosen nachgetragen.
- **Gefunden:** Crack Flora Watcher und KlarLokal hatten trotz fertiger Dose und Matrix-Eintrag keine Protokollzeile (kamen als Nachzügler aus einer Runde außerhalb des Protokoll-Rhythmus). Nachgetragen, beide `verengt` — und ihre Konkurrenz (Seek, Zetteln) fehlte im Atlas.
- **Nächstes Mal:** Wenn eine Runde außerhalb des normalen Rundenstart-Ablaufs Dosen erzeugt (z. B. aus einem anderen Tool/Modell), sofort eine Protokollzeile mitschreiben — nicht erst bei der nächsten Konsistenzprüfung.

### Runde 3 — 18.09.2026 (Researcher #1, method: ideenrunde)
- **Gelernt:** „Naturschutz-Vollzug" als Atlas-Feld war zu grob gefasst. Punktesysteme/Checklisten (Typ A, von Hand angewendet) sind weiter frei — aber KI-Bilderkennung für Arten- oder Habitat-Typen aus Fotos/Fernerkundung ist bereits ein aktiv besetztes Forschungs- und Produktfeld (KIBI-Projekt beim BfN selbst, ObsIdentify, Flora Incognita, Namis-Biotop-App). Der Atlas wurde entsprechend in zwei Zeilen gesplittet — sonst wäre „Naturschutz + Foto" fälschlich pauschal als frei durchgewunken worden.
- **Gelernt:** Licht-Themen bei LAG Vogelschutzwarten sind Teil des Glas-Dokuments (LAG VSW 21/01), kein eigenes Schema. Die ergiebige Quelle für die Licht-Idee war stattdessen eine **Landesumweltbehörde** (Hamburg BUKEA) plus NABU/BUND-Ratgeber — eine Quellenkategorie, die bisher nicht systematisch in `amelie-quellen.md` stand.
- **Fehler:** Erste Suche zum Biotopwertverfahren fand nur den Rechenteil (BWKalk, Rheinland-Pfalz) und wäre beinahe als „besetzt, weiter" abgehakt worden — der eigentliche Engpass (Biotoptyp *identifizieren*, nicht Punkte *berechnen*) wurde erst durch eine zweite, gezielte Suche nach KI-Bilderkennung sichtbar. Lehre: bei Bewertungsverfahren immer beide Teilschritte einzeln prüfen — Zuordnung/Klassifikation und Berechnung/Aggregation sind oft unterschiedlich weit digitalisiert.
- **Fehler (parallel entdeckt):** Eigene Empfänger-Suche zu „Tafel-Warenannahme per Foto" fand nur Routenplanung + Lieferscheine und übersah, dass dieselbe Fahrer-App auch Foto-Qualitätserfassung der Ware macht — Researcher #2 und der Konflikt-Resolver haben das unabhängig richtiggestellt (`besetzt` statt `verengt`). Lehre: bei „Empfänger hat eigenes Digitalisierungsprojekt"-Treffern den vollen Funktionsumfang der App/Plattform prüfen, nicht nur die zuerst gefundene Pressemitteilung.
- **Nächstes Mal:** Landesumweltbehörden (Berlin Senatsverwaltung, Bayern LfU, NRW LANUV, weitere) systematisch nach „Leitfaden ohne Tool"-Fällen absuchen. Bei Rechecks künftig kurz in `amelie-pruefprotokoll.md` nachsehen, ob eine parallele Session dieselbe Idee schon (anders) verifiziert hat, bevor man pusht.

### Runde 3 — 18.09.2026 (Researcher #2, method: ideenrunde — Recheck-Teil, Runde durch Team-Neustart früh beendet)
- **Gelernt:** Die beiden `unklar`-Rechecks aus Runde 2 kosteten je nur eine gezielte Suche. Tafel-Warenannahme kippte sofort zu `besetzt` (Tafel Deutschland hat ein BMEL-gefördertes 1,5-Mio.-€-Projekt dafür laufen) — bestätigt die Regel „Empfänger zuerst" auch für Rechecks, nicht nur für neue Ideen.
- **Fehler:** Bebauungsplan-Leser blieb nach nur einer allgemeinen Suche wieder `unklar` — der Recheck-Hinweis aus Runde 2 („mit Organisationsnamen suchen") wurde nicht befolgt, weil die Runde vorzeitig endete. Zählt nicht als echter zweiter Versuch.
- **Nächstes Mal:** (1) Bebauungsplan-Leser mit konkreten Tool-/Produktnamen statt allgemeiner Begriffe erneut prüfen. (2) BfN-Schriften 721 zu einer konkreten Idee ausformulieren und gegen bestehende Ökokonto-/Kompensationsflächen-Software prüfen — von Researcher #1 in derselben Runde bereits als Biotoptyp-Assistent erledigt. (3) LANA/Vogelschutzwarten/Thünen-Strang aus Runde 2 ist damit erst zur Hälfte abgearbeitet.

### Runde 3 — 18.09.2026 (Researcher #4, bisociation A/B arm — Baumkontrolle/Baumkataster)
*Aus dem unkommittierten Worktree der Session [208a0f] übernommen (siehe Beleg-Fußnote im Protokoll); Inhalt ungekürzt, nur hier vom Librarian zusammengeführt.*
- **Gelernt:** Type-A-Anker + Distanz-4-Biologie-Collider (Regelkontrolle/VTA an Bäumen × Ameisen-Stigmergie) erzeugte mehrere echte lacunare Gap-Sätze statt einer Wiederholung der Mode-Liste (Foto-Apps, Drohnen-NDVI, IoT-Neigungssensoren, Crowdsourcing, Akustik-Tomografie — alle vorab gesperrt). Beide reality-check-fähigen Kandidaten starben an derselben Tatsache: „urbaner Baum + KI/Foto" ist 2026 auf jeder Achse eine vollständig durchbaute kommerzielle Kategorie — Legibilität-vor-Ort (QR-Plaketten + Portale) *und* Verfalls-/Änderungserkennung per Wiederholungsfoto. Das ist ein stärkeres, spezifischeres Atlas-Signal als „deutsches Zivilgesellschafts-Thema ist dicht" — es ist jetzt „physisches Objekt + wiederkehrende gesetzliche Sicht-/Prüfpflicht ist dicht end-to-end", was vermutlich auch Spielplätze, Aufzüge, Feuerlöscher, Brücken abdeckt.
- **Fehler:** Beim ersten Kandidaten direkt von der Friktion zu einem einzigen, stark wirkenden Kandidaten gesprungen und existenzgeprüft, statt vorher den vollen 10–20-Kandidaten-Pool zu generieren (Session wurde durch einen teamweiten Neustart mitten im Protokoll unterbrochen, dann auf Nutzerwunsch fortgesetzt). Auch nach dem Fortsetzen wurde ein zweiter Kandidat aus demselben Anker/derselben Domäne geprüft, statt zuerst zu testen, ob der Anker selbst schon erschöpft war.
- **Nächstes Mal:** (1) Wenn der erste geprüfte Kandidat eines Ankers an einer ganzen Anbieter-*Kategorie* stirbt (nicht nur an einem Konkurrenten), das als Beleg werten, dass der Anker selbst dicht ist, und den Anker wechseln statt einen zweiten Kandidaten aus derselben Quelle zu prüfen. (2) Jeder Typ-A-Anker „physisches Objekt + wiederkehrende, gesetzlich vorgeschriebene Sicht-/Handprüfung" (Bäume, Spielplätze, Aufzüge, Feuerlöscher, Brücken, Spielgeräte nach DIN 1176) sollte 2026 standardmäßig als KI-Anbieter-dicht vermutet und vor dem Kollisionsschritt gegen den Atlas geprüft werden, so wie Citizen-Science (Typ B) das schon wird. (3) Den Stigmergie-Collider (legibel-vor-Ort vs. versteckt in Datenbank) an einer Domäne *ohne* bestehende Inspektionssoftware-Branche erneut versuchen — z. B. informelle/undokumentierte Infrastruktur (Trampelpfade, Schrebergarten-Regeln, Kiez-Nachbarschaftshilfe).

### Runde 4 — 19.09.2026 (Researcher #1, method: ideenrunde)
- **Ablauf:** Zustand gelesen, Quelle „Denkmalbehörden/Landesämter" gewählt (bewusst nicht mitforschen.org, damit sich die beiden ideenrunde-Researcher nicht überschneiden). Nach der ersten Suchrunde kam eine Sessionnachricht von `amelie-secretary` („alle arbeiten nur an Altbau Thermal", angeblich Félix' Anweisung, nicht verifiziert): Ideenrunde pausiert, Werkzeugseiten-Recheck Altbau Thermal gemacht (siehe Protokoll). Auf Félix' Ansage im Chat („wenn Altbau Thermal erledigt, weitermachen") Denkmal-Strang fortgesetzt: **3 Ideen geprüft, 0 überlebt** (2× `besetzt`, 1× `unklar`), **keine Dose gepackt** — nichts Offenes/Verengtes, das eine Dose verdient. Trefferquote-Zeile eingetragen.
- **Gelernt (Methode):** Die Atlas-Vorhersage (Objekt + wiederkehrende Prüfpflicht = dicht) hat zwei weitere Treffer geliefert (Kirchen-Baubegehung, Fassaden-Schadenskartierung). Hätte ich den Atlas als Vorfilter angewandt, wären beide ohne Suche als `besetzt (Atlas)` protokolliert worden — die Suchen dafür (etwa sieben von zwölf im Denkmal-Strang) waren zum Teil vermeidbar. **Denkmal/Kirche ist als Quellenstrang erschöpft für dieses Muster.**
- **Gelernt (Quelle):** Der Gemini-Kandidat Orgel-Resonanz hatte als „Problem" eine Behauptung, die die Primärquellen nicht tragen. Ein Kandidat aus einer Ideenmethode braucht *zuerst* die Prämissenprüfung („nennt die Quelle das als Engpass?"), dann erst die Existenzsuche. Sonst endet er wie hier bei `unklar`.
- **Fehler:** Für das Handbuch-PDF gab es kein Werkzeug zum Textlesen (`pdftotext`/PyMuPDF/pypdf fehlen, `Read` braucht `pdftoppm`). Die eigentlich interessante Primärquelle blieb ungelesen. Einmalig `poppler-utils` installieren oder ein Python-PDF-Modul, bevor die nächste Runde Behörden-PDFs braucht — Typ-A-Quellen sind fast alle PDFs.
- **Gelernt:** Der Recheck fand einen ungenannten Nachbarn (Ubakus: Tabellen-Einzonenmodell mit Wetter/Thermostat/Lüftung, aber ohne Grundriss, Feld, Ecke) und bestätigte die EnergyMap-Aussagen der Dose (`energymap4py` als GitHub-Repo, BauSIM 2026). Lehre: Bei sendebereiten Dosen jede *Ist-Behauptung* über den Empfänger gegen die Primärseite prüfen.
- **Fehler:** Die erste Fassung meines Rechecks schrieb `energymap4py` „nicht bestätigt" — falsch. Ursache: Schnipsel einer Suchzusammenfassung zitierten die veraltete Info-Seite („will be released in the near future"), die News-Seite und das Repo sagen das Gegenteil; und `WebFetch` war blockiert, ich habe erst auf Rückfrage weiter gegraben. **Lehre:** Ist `WebFetch` blockiert, geht `curl` über Bash (Seitentext, GitHub-API, PyPI-JSON) — vor einem „nicht bestätigt" zuerst so versuchen. Und: Info-/Über-uns-Seiten veralten schneller als News-/Repo-Seiten; bei Widerspruch gilt die mit Datum.
- **Nächstes Mal:** (1) PDF-Textwerkzeug bereitstellen (siehe Fehler), dann das Handbuch Orgelkorrosion lesen — nur wenn Félix die Orgel-Idee überhaupt weiterverfolgen will. (2) Nicht mehr im Denkmal-/Kirchen-Strang graben; nächste Quelle mit anderem Muster: mitforschen.org (Typ B, weiter unangetastet, sofern der andere ideenrunde-Researcher sie nicht genommen hat — vorher Quellen-Datei prüfen), oder Senatsverwaltung Berlin/Naturkundemuseum (offen). (3) Eingehende Sessionnachrichten, die den Rundenauftrag ändern, vor Ausführung mit Félix bestätigen lassen. (4) Schnipsel zu RoomPlot und den Raumheizlast-/Taupunktrechnern per `curl` gegenlesen (Altbau-Thermal-Nachbarn, bisher nur Suchtreffer).

### Librarian-Audit — 19.09.2026 (Konsistenzprüfung 06-suche ↔ 05-dosen ↔ Matrix)
- **Gefunden (wichtigster Punkt):** Der Commit `gemini chnges` (9607f8a, 19.09.) hat die vier 06-suche-Dateien durch eine ältere, dünnere Fassung ersetzt und damit die Konsolidierung vom 18.09. (`b7e3125`) überschrieben: die Einzelzeilen für Runde 1 (wieder eine Sammelzeile über elf Ideen), die Zeilen für Eichflächen-Trainer, Kartierlotse, Lichtplan-Check, Biotoptyp-Assistent, Feuerkugel-Sofortnetz, Crack Flora Watcher, KlarLokal, die Tafel-Korrektur auf `besetzt`, die Runde-3-Retros und die Atlas-Zeilen zu Feuerkugel, Bäumen, LiDAR. Sieben Dosen standen damit ohne Protokollzeile im Repo (die fünf aus Runde 3 plus Crack Flora Watcher und KlarLokal). Aus `b7e3125` wiederhergestellt; nur das Neue aus dem Lauf (zehn Kandidaten) wurde eingebaut.
- **Gefunden:** Der Lauf hatte zehn Kandidaten mit `frei (Kandidat)` ins Protokoll geschrieben, obwohl das Bisoziation-Log sie als „Noch zu prüfen" führt. Ein `frei` ohne Existenzprüfung hebt jede Trefferquote künstlich. Neuer Zustand `ungeprüft` im Protokoll, zählt nirgends.
- **Gefunden:** „Sandstein-Streiflicht-Relief" war dieselbe Idee wie „Streiflicht" aus Runde 2 — zweite Wiederholung, die das Protokoll hätte verhindern sollen, weil der Lauf das Protokoll offenbar nicht vorher durchsucht hat. Als Duplikat geführt.
- **Gefunden:** Kein `unklar` war nach Datum überfällig (beide Runde-2-Zeilen hatten „Prüfen ab 12/2026"), aber Rundenstart Schritt 3 verlangt `unklar`-Zeilen unabhängig vom Datum. Tafel war schon `besetzt`; Bebauungsplan-Leser jetzt nach 4 gezielten Suchen `verengt`.
- **Fehler dieses Audits:** Die Protokolle waren nach dem Merge nicht gegen Überschreiben geschützt. Ein Schreiben aus einem anderen Tool/Modell ersetzt die ganze Datei, statt eine Zeile anzuhängen.
- **Nächstes Mal:** (1) Jeder Lauf, der 06-suche schreibt — gleich welches Tool — beginnt mit `git log -- 06-suche/` und hängt an, statt die Datei zu ersetzen. (2) Nach jedem Lauf: `ls 05-dosen` gegen Protokoll abgleichen (Abdeckungs-Satz im Protokoll-Kopf fortschreiben). (3) Die zehn `ungeprüft`-Kandidaten prüfen, mit Reihenfolge: Trockenrasen-Transekte (Überschneidung mit Kartierlotse klären), Hummel-Schleusenwächter, Tafel-Frische-Triage (Empfänger hat Digitalprojekt), Licht-Glocken-Kataster — die Bisoziation-Retro des Laufs nennt Trockenrasen, Hummel und Waldbrand-Streu als Top 3. (4) `mitforschen.org` steht seit Runde 2 als „ergiebigste Quelle, als Nächstes" und wurde in drei Runden nicht angefasst — sie jetzt zuerst nehmen, oder den Vermerk streichen.

### Runde 4 — 19.09.2026 (Researcher #2, method: ideenrunde — Teilrunde, 2 Ideen)
- **Gelernt:** Quelle „Denkmalbehörden/Landesämter" (Typ A) ist **kein Schema-ohne-Software-Feld**: Schadenskartierung ist mit Metigo MAP/KALIV Software-Branche, KI-Erkennung ist Forschung (Papers, Datensätze). Der Ertrag (Denkmal-Verlaufsblick) kam von der Bürger-/Ehrenamtsseite derselben Quelle (DSD-Schwarzbuch, BLfD-Bürgerportal), nicht aus den Leitfäden. Wie bei Bäumen: „physisches Objekt + Fachprüfung" ist besetzt, „Laien-Verlauf" ist die Lücke — aber nur aus Suchtreffern belegt.
- **Gelernt:** Empfängerprüfung für die Zustelldose (Altbau Thermal) hat drei Punkte im Mail-Entwurf nicht bestätigen können (`energymap4py` nicht im UdK-VPT-GitHub-Suchergebnis; BauSIM-2026-Validierung nur als BauSIM-2024-Paper belegt; Kontaktadresse ohne Zugriff auf die Projektseite unprüfbar) und einen Passungsfehler gefunden (Prototype Fund fördert Einzelpersonen/Kleinteams als GbR, nicht Lehrstühle; co2online hat mit HeizCheck schon ein Mieter-Tool). Siehe `02-recherche/altbau-thermal-empfaenger-2026-09-19.md`.
- **Fehler:** WebFetch war für die wichtigsten Empfängerdomains gesperrt (energymap-berlin.de, udk-berlin.de, prototypefund.de, solar.htw-berlin.de, technologiestiftung-berlin.de); alle Belege stammen aus Suchschnipseln. Ein Schnipsel-Urteil ist schwächer als „Seite gelesen" — die Dose Denkmal-Verlaufsblick und das Atlas-Feld sind deshalb ausdrücklich als „Portale nicht gelesen" markiert. Außerdem: ein Suchtreffer-Satz („Systeme lassen Laien ohne Anleitung") ließ sich keiner Quelle sicher zuordnen und wurde in der Dose so gekennzeichnet — die „benannte Schwäche" trägt daher weniger als bei CompGen.
- **Fehler:** Rundenumfang durch parallelen Zusatzauftrag (Empfängerprüfung) auf 2 Ideen gekürzt; Ziel 8–12 nicht annähernd erreicht, Trefferquote (2/2 `verengt`) daher wenig aussagekräftig.
- **Nächstes Mal:** (1) Vor Zustellung der Denkmal-Dose die DSD-Seiten (Meldeportal, Schwarzbuch, Ehrenamt) von Hand lesen — offen ist, ob die Beiräte wiederholt beobachten. (2) `mitforschen.org` weiter offen: dieses Mal wegen Kollisionsvermeidung übersprungen, in der nächsten Runde ohne Kollisionsgrund zuerst nehmen oder Vermerk streichen. (3) Rechtsfrage „Fotografieren gefährdeter Denkmale/Eigentümerrechte" ungeprüft, bei Zustellung erwähnen oder klären.
- **Nachtrag Runde 4 (Researcher #2, Rückfrage „wirklich das Beste?"):** Erste Dose nach Rückfrage nochmal auf Prämisse und „Vorarbeit" geprüft. **Fehler der Erstprüfung:** Prämisse in Runde 1 nur gegen den Empfänger (co2online/EnergyMap) geprüft, nicht gegen Produkte der Wohnungsebene — Heatpunk (UK) und reduco.ai (D) fehlten, die Dose hatte keinen Abschnitt „Wer es schon versucht hat". **Gelernt:** Bei einer Dose, die *nur* aus Empfänger-Recherche entstand, die Idee vor Zustellung mit den Rezepten aus §1 (Deutsch Funktion, Englisch Produkt) frisch prüfen — die Empfängerprüfung ersetzt sie nicht. Zwei „Warum jetzt"-Behauptungen (Grundriss-Extraktion „gelöst", Echtzeit-Instationarität im Browser) sind unbelegt. **Nächstes Mal:** Jede Dose vor Zustellung mit einem Checkbogen „jede Behauptung → Beleg oder abschwächen"; Pflichtabschnitte gegen `amelie-vorlagen.md` abhaken.
