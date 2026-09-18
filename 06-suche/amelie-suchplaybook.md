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

## 3. Besetzungsatlas (Stand 18.09.2026)

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

**Faustregel, jetzt mit zwei Runden Evidenz:** Wenn Endnutzer dafür zahlen würden oder eine Stadt es als Pressemitteilung verkaufen kann, existiert es. Frei ist, was ein Fachgremium als PDF veröffentlicht und niemand je in Software gegossen hat.

---

## 4. Trefferquote (Kalibrierung)

| Runde | Datum | Geprüft | Frei | Verengt | Unklar | Besetzt |
|---|---|---|---|---|---|---|
| 1 | Sep 2026 | 19 | 8 | 7 | – | 4 |
| 2 | 16.09.2026 | 13 | 2 | 1 | 2 | 8 |
| Nachtrag | 18.09.2026 | 2 | – | 2 | – | – |
| 3 | 18.09.2026 | 13 | 2 | 5 | 1 | 5 |

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
