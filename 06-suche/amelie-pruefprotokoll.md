# Amélie — Prüfprotokoll

Jede je geprüfte Idee, eine Zeile. **Vor jeder neuen Idee hier suchen (Strg+F), bevor gesucht wird.**
Ergänzt `05-dosen/_entsorgt.md`: dort steht die Begründung für gepackte, dann verworfene Dosen; hier steht *alles*, was je geprüft wurde, auch Ideen, die nie eine Dose wurden.

**Urteile:** `frei` · `verengt` (Restlücke benannt) · `unklar` (Suche lieferte Rauschen) · `besetzt`
**Vorläufiger Zustand:** `ungeprüft` — Kandidat aus einer Ideenmethode, Existenzprüfung nicht gelaufen. Kein Urteil, zählt in keiner Trefferquote, darf nicht zugestellt werden.
**Prüfen ab:** Tooling/Konsum + 6 Monate · Zivilgesellschaft + 12 Monate

**Abdeckung Dosen ↔ Protokoll (Stand 19.09.2026):** Alle 22 Dosen in `05-dosen/` haben mindestens eine Zeile hier — Runde 1 (15), Nachtrag 18.09. (2), Runde 3 (5, Feuerkugel-Sofortnetz als zwei Zeilen). Neue Dose ohne Zeile hier = Fehler, sofort nachtragen. Am 19.09.2026 mechanisch nachgezählt (Dosen-Name gegen Protokoll gegrept): 22 von 22 gefunden, ebenso alle 21 Ideen der Matrix (19 aus Runde 1 + Crack Flora Watcher + KlarLokal).

**Umgekehrt nicht abgedeckt — Matrix:** Die fünf Runde-3-Dosen (Eichflächen-Trainer, Kartierlotse, Lichtplan-Check, Biotoptyp-Assistent, Feuerkugel-Sofortnetz) stehen **nicht** in `03-zuordnung/amelie-matrix.md` auf `main`. Commit `bb6eb24` hatte drei davon eingetragen; der Gemini-Commit `9607f8a` hat die Matrix mit überschrieben, nur `06-suche/` wurde danach wiederhergestellt (`40e25ee`). Die Matrix gehört nicht der Bibliothek — Hinweis liegt beim Sekretariat/Félix.

**Fälligkeit (Stand 19.09.2026): nichts überfällig, keine `unklar`-Zeile offen.** Nächste Fenster: **03/2027** — Diffgeist, Spec-Drift Detector, Agent Postmortem Recorder, Traumtagebuch, KlarLokal, Biotoptyp-Assistent, Bebauungsplan-Leser · **05/2027** Crack Flora Watcher · **09/2027** alle übrigen datierten Zeilen · **09/2028** Räucher-Sim. Strukturmonitoring per LiDAR hat kein Datum (nie gepackt).

**Runde-2-Überlebende ohne Dose:** Glasanflug-Ampel (`frei`), Brettchen-Vorsortierer (`frei`), Streiflicht (`verengt`) wurden nie gepackt und laufen ab 09/2027 aus dem Prüffenster. Bewusst so oder liegengeblieben? — Entscheidung bei Félix, siehe Playbook-Retro 19.09. (2).

---

## Runde 2 — 16.09.2026

| Idee | Urteil | Beleg (kurz) | Prüfen ab |
|---|---|---|---|
| **Glasanflug-Ampel** — Foto einer Glasfläche + Standort → Entwurf der LAG-VSW-Punktebewertung | `frei` | Punkteschema existiert als PDF (LAG VSW 21/01), kein digitales Werkzeug gefunden | 09/2027 |
| **Brettchen-Vorsortierer** — KI-Vorannotation der Brutzellen auf MonViA-Nisthilfe-Fotos | `frei` (Thünen direkt fragen lassen) | Thünen wertet manuell aus, bis zu 90 Min. pro Nisthilfe; keine KI-Auswertung erwähnt | 09/2027 |
| **Streiflicht** — Smartphone-RTI am Grabstein + Transkription, die unleserliche Stellen als Lücke markiert | `verengt` | CompGen nutzt LLMs, benennt Halluzination bei Verwitterung als Schwäche; Smartphone-RTI nur als Paper (Ca' Foscari, ECCVW 2022) | 09/2027 |
| Bebauungsplan-Leser für Bürger | `unklar` | Nur Content-Farm-Treffer. Neu suchen mit Organisationsnamen (z. B. Berliner Beteiligungsplattform) — **Recheck Runde 3: weiterhin `unklar`; Recheck 19.09.2026: jetzt `verengt`, siehe Abschnitt „Recheck 19.09.2026"** | 03/2027 |
| Tafel-Warenannahme per Foto | `besetzt` | Recheck 18.9.2026, zwei Researcher unabhängig: „Tafel macht Zukunft – gemeinsam digital" (BMEL-Förderung 1,5 Mio. €, 3 Jahre, eco-Platform von Inspired Consulting) liefert eine Fahrer-App mit Foto-Qualitätserfassung der Ware, alle großen Handelsketten (ALDI, EDEKA, LIDL, REWE) beteiligt — deckt die Foto-Prüfung ab, die zunächst übersehen wurde. Korrektur direkt hier eingetragen statt als separate Runde-3-Zeile (Dedup). | – |
| Balkonkraftwerk-Verschattung per Handykamera | `besetzt` | Horisol (Akkudoktor-Forum, Juli 2026), SunOnTrack AR | – |
| Wheelmap: Eingangsfoto → Barrierefreiheit | `besetzt` | HIIG + Wheelmap: offener Datensatz Stufen/Rampen (2023) | – |
| Repair-Café-Diagnoseassistent | `besetzt` | Repair Café International Artikel Juli 2026; robotfreak/repair-cafe | – |
| Chor-Übedateien aus Aufnahme (SATB-Trennung) | `besetzt` | MVSEP SATB-Modell, MusiCraft, ChoirMate | – |
| Mängelanzeige-/Schimmel-Assistent für Mieter | `besetzt` | Miet-Akte, SchimmelScan | – |
| Betriebskostenabrechnung prüfen | `besetzt` | MietKlar | – |
| Hitze-Schattenrouten für Ältere | `besetzt` | HEAL/shaded.ors (HeiGIT), Shadowmap, Berliner Kühle-Orte-Karten | – |
| Kreuzungs-Falschparker/Schulweg-Gefahrenkarte | `besetzt` | Schulwegportal Berlin, VCD-Schulwege-Check, FixMyBerlin | – |

---

## Runde 1 — September 2026

Details in `amelie-matrix.md`, `05-dosen/_entsorgt.md`. Belege der Einzelzeilen unten aus den jeweiligen Dosen (Abschnitt „Wer es schon versucht hat") nachgetragen am 18.09.2026 im Rahmen der Protokoll-Konsistenzprüfung — die gebündelte Sammelzeile über elf Ideen erlaubte kein Strg+F pro Idee und keine belastbare Trefferquote.

| Idee | Urteil | Beleg (kurz) | Prüfen ab |
|---|---|---|---|
| git-archaeologist (MCP) | `besetzt` | mehrfach unabhängig gebaut (u. a. Server, der „warum existiert diese Zeile" aus blame/PR/Issue beantwortet, „codebase-archaeology") | – |
| Home-Network MCP | `besetzt` | ≥4 unabhängige FRITZ!Box-MCP-Server, Home Assistant mit MCP in beide Richtungen | – |
| Repo-Museum | `besetzt` | begehbare 3D-Repo-Stadt bereits gebaut/veröffentlicht; Vorgeschichte CodeCity/Gource/GitHub Skyline | – |
| Commute Oracle | `besetzt` | Citymapper KI-Routenplanung 2026, dedizierte „wann losgehen"-Produkte, Google-Maps-Pendelfunktionen | – |
| Altbau Thermal | `verengt` | co2online/EnergyMap Berlin rechnet Gebäudeebene für 360.000 Gebäude; Wohnungsebene (Grundriss, Fenster, Heizkörper) bleibt Lücke | 09/2027 |
| Sperrmüll-Radar | `frei` | keine Berliner Live-Karte für Sperrmüll-Zu-verschenken-Pins mit Verfallslogik gefunden | 09/2027 |
| Kiez-Lärmkarte | `frei` | Noise-Planet/NoiseCapture liefert Durchschnittskarten; „wann ist diese Straße leise"-Perspektive nicht gefunden | 09/2027 |
| Diffgeist | `frei` | personalisierte Release-Notes (nur was der eigene Code tatsächlich aufruft) nicht gefunden; Zeitfenster geschätzt auf Monate | 03/2027 |
| Spec-Drift Detector | `frei` | Prosa-Spec-Drift 2026 öffentlich als offene Falle benannt, kein etabliertes Werkzeug; API-Schema-Drift-Markt (anderer Scope) ist besetzt | 03/2027 |
| Agent Postmortem Recorder | `verengt` | Session-/Observability-Analyse reichlich vorhanden; kein Tool schließt zu konkretem `CLAUDE.md`-Regel-Patch | 03/2027 |
| Wet Ink (Plan) | `frei` | Escape Motions/Rebelle macht Desktop-Fluid-Aquarell professionell; keine WebGL2-Browser-Entsprechung gefunden | 09/2027 |
| Pin Tumbler | `verengt` | Lockpicking-Spiele zahlreich (Mobile, Steam, itch.io); keins behandelt Fertigungstoleranzen als Lerngegenstand | 09/2027 |
| Räucher-Sim | `frei` | Rauch-/Fluidsims und atemgesteuerte Installationen einzeln verbreitet; Kombination als freies Web-Toy nicht gefunden | 09/2028 |
| Kristallwachstum 3D | `verengt` | DLA-Generatoren im Überfluss (als „neuer Generator" tot); druckfertige Kette (wasserdicht, Zwangsbedingungen, Seed-als-Rezept) nicht gefunden | 09/2027 |
| Tarot als Zustandsmaschine | `verengt` | Tarot-JSON-Datensätze und Schema-Sammlungen vorhanden; formale deckunabhängige Relationssprache zwischen Positionen nicht gefunden | 09/2027 |
| Traumtagebuch | `verengt` | Markt für Traum-Apps mit KI-Deutung/Mustererkennung groß; Kombination „keine Deutung + on-device + offen" nicht gefunden | 03/2027 |
| Echter Zufall als Service | `frei` | Software-basierter Zufalls-MCP-Server existiert; Brücke von TRNG-Hardware zu MCP nicht gefunden | 09/2027 |
| Ghost Replay fürs Editieren | `verengt` | Aufzeichnungs-/Replay-Technik für Editor-Sitzungen existiert; systematische Musterauswertung/-vergleich als Forschungsfrage offen | 09/2027 |
| Bugs → Spaced Repetition | `frei` | Spaced-Repetition-Ökosystem groß und reif; Brücke von Git-Historie zur Karteikarte nicht gefunden | 09/2027 |

**Korrigierte Bilanz Runde 1** (siehe auch Trefferquote-Tabelle im Playbook, dort ebenfalls korrigiert): 19 geprüft, **8 frei, 7 verengt, 0 unklar, 4 besetzt** — vorher fälschlich als 10 frei / 5 verengt geführt, weil elf Urteile nie einzeln ins Protokoll übertragen wurden.

---

## Nachtrag — 18.09.2026 (unfertig aus der „gemini changes"-Runde, hier nachgezogen)

Crack Flora Watcher und KlarLokal kamen als fertige Dosen ohne Protokollzeile ins Repo (siehe Anmerkung in `amelie-matrix.md`). Am 18.09.2026 im Rahmen der Protokoll-Konsistenzprüfung nachgetragen, Beleg aus den Dosen selbst.

| Idee | Urteil | Beleg (kurz) | Prüfen ab |
|---|---|---|---|
| Crack Flora Watcher (Ritzengrün-Wächter) | `verengt` | Seek (iNaturalist) gamifiziert Ritzenpflanzen-Entdeckung bereits mit Badges/Challenges; Longitudinalspur derselben Pflanze über Wochen fehlt bei allen gefundenen Apps | 05/2027 |
| KlarLokal | `verengt` | Zetteln (zetteln.app) macht fast dasselbe (Behördenbrief → Leichte Sprache, Fristen), läuft aber hybrid mit Cloud-Fallback; Zero-Cloud-Garantie ist die verbleibende Lücke | 03/2027 |

---

## Runde 3 — 18.09.2026 (Researcher #1+#2 ideenrunde, Researcher #3+#4 bisociation, Librarian-Merge)

*A/B-Test: Zeilen aus der lacunar-bisociation-Methode sind mit `[method: bisociation]` markiert, zur Abgrenzung von den amelie-ideenrunde-Zeilen derselben Runde.*

**Rechecks dieser Runde** (Regel aus `amelie-rundenstart.md`, Schritt 3 — `unklar`-Zeilen aus Runde 2 zuerst erneut geprüft): Tafel-Warenannahme ist oben direkt in der Runde-2-Zeile auf `besetzt` korrigiert. Bebauungsplan-Leser blieb `unklar`, siehe Zeile unten — *(überholt: am 19.09.2026 mit konkreten Produktnamen erneut geprüft, jetzt `verengt`, siehe Abschnitt „Recheck 19.09.2026"; kein Vormerken für Runde 4 mehr nötig.)*

| Idee | Urteil | Beleg (kurz) | Prüfen ab |
|---|---|---|---|
| **Eichflächen-Trainer** — Kalibrierdeck mit Referenzflächen (Foto/Artenliste → Code raten → Abgleich mit Experten-Konsens) für Biotopkartierer-Nachwuchs | `frei` | [method: bisociation] Ausbildung läuft nur als mehrtägiger Präsenzkurs (ANL Bayern, Akademie für angewandte Vegetationskunde, Botanik Plus-Zertifizierung); explizit genannter Fachkräftemangel; kein digitales Kalibrier-/Spaced-Repetition-Tool gefunden (4 Suchen) | 09/2027 |
| **Kartierlotse** — Live-Assistent im Feld, der während der Kartierung anzeigt, welche Zeigerart/Struktur noch fehlt, um zwischen zwei Biotopcodes zu entscheiden (für den deutschen Kartierschlüssel) | `verengt` | [method: bisociation] UK-Pendant existiert: e-Surveyor App sagt Habitattyp aus Artenliste voraus (Ridding et al., *Ecology and Evolution* 2026) — aber für UK-Klassifikation (Broad Habitat/UKHab/NVC), nachträgliche Vorhersage statt Live-Lückenhinweis, nicht für deutschen Kartierschlüssel. Vegapp (Schmidtlein 2026) digitalisiert nur die Dateneingabe. Lücke verengt auf: deutscher Schlüssel + Live-Hinweis *während* der Begehung | 09/2027 |
| Strukturmonitoring per Smartphone-LiDAR (Verbuschung/Sukzession im Offenland, ehrenamtlich zwischen den Kartierzyklen) | `verengt`, nahe `besetzt` | [method: bisociation] Forschung deckt Kernidee bereits ab: Smartphone-LiDAR für Vegetationsstruktur ist 2025/26 aktives Forschungsfeld (bioRxiv Stammdurchmesser-Paper, iPhone-LiDAR-Genauigkeitsstudie, Garten+Landschaft-Fachartikel zu LiDAR-Grünpflege); Fachartikel nennt Sukzession/Verbuschung explizit als Anwendungsfall. Nicht gepackt — Atlas-Eintrag stattdessen | – |
| Bebauungsplan-Leser für Bürger (erneut geprüft, 2. Recheck) | `unklar` (weiterhin) | [method: ideenrunde, Researcher #1+#2] Zwei unabhängige Rechecks: Researcher #1 fand mit `mein.berlin.de Bebauungsplan verständlich KI` zwei neue Spuren statt Content-Farmen — **DiPlanBeteiligung** (neues Berliner Digitalsystem fürs Verfahren, nicht für Textvereinfachung) und **wohnvision-digital.de** (privater Bestellservice, kein KI-Erklärer); Researcher #2 bestätigte unabhängig nur DiPlanBeteiligung, mit einer schwächeren allgemeinen Suche. Keine der beiden deckt „Plan in Laiensprache" ab. Nächste Runde: beide Funde gezielt auf KI-Zusammenfassungsfunktion prüfen, dann mit konkreten Tool-/Produktnamen suchen (z. B. „Ratsinformationssystem KI Zusammenfassung", „Bebauungsplan Chatbot Bürger") statt allgemeiner Begriffe **— erledigt 19.09.2026, Ergebnis `verengt`, siehe Recheck-Abschnitt** | ~~12/2026~~ → 03/2027 |
| **Lichtplan-Check** — Formular prüft geplante Außenbeleuchtung automatisch gegen verstreute insekten-/vogelfreundliche Kriterien mehrerer Behörden | `frei` | [method: ideenrunde, Researcher #1] Quelle: Typ A, Landesumweltbehörden (Hamburg BUKEA „Licht & Naturschutz") + NABU/BUND-Leitfäden. Nur Text-Leitfäden gefunden, kein Self-Check-Tool; ein Leuchtenhersteller (TRILUX) berät kommerziell. Dose gepackt: `05-dosen/lichtplan-check.md` | 09/2027 |
| **Biotoptyp-Assistent** — Foto → Vorschlag für BKompV-Anlage-2-Biotoptyp (statt Handnachschlag in 668 Typen) | `verengt` | [method: ideenrunde, Researcher #1] Quelle: Typ A, BfN-Schriften 721 (Kartieranleitung Biotoptypen 2025) + BKompV. Verwandtes Feld dicht: KIBI-Projekt (BfN, FFH-Typen aus Luftbild/Fernerkundung, nicht Bodenfoto), ObsIdentify/Flora Incognita (Artbestimmung, nicht Biotoptyp), Namis-Biotop-App (DBU, digitalisiert Erfassung, klassifiziert nicht automatisch). Zusätzlich geprüft (Hinweis Researcher #2): Ökokonto-/Kompensationsflächenkataster-Software (giscity Ökoflächenkataster u. ä.) ist GIS-Verwaltung/Monitoring bestehender Flächen, keine Bildanalyse zur Typ-Zuordnung — deckt die Idee nicht ab. Restlücke: Bodenfoto → BKompV-Typ-Vorschlag fehlt weiterhin. Dose gepackt: `05-dosen/biotoptyp-assistent.md` | 03/2027 (verkürzt, aktives Feld) |
| **Sofort-Rekrutierung** — Geofenced Push an Zeugen in ~20-Min-Fenster nach Feuerkugel-Erstmeldung, strukturierte Corroboration statt Wartens auf zufällige Zweitmeldung | `verengt` (Teil der Dose Feuerkugel-Sofortnetz) | [method: bisociation, Researcher #3] AMS/IMO-Meldesystem gruppiert Zeugen nachträglich, AMS nennt Daten ausdrücklich „nicht in Echtzeit"; kein Push-Rekrutierungsmechanismus gefunden. Dose gepackt: `05-dosen/feuerkugel-sofortnetz.md` | 09/2027 |
| **Ambient-Rettung** — On-Device-Erkennung auf Dashcam/Türklingelkamera markiert kurzen hellen Streifen lokal zum Nicht-Überschreiben, Opt-in-Teilen | `verengt` (Teil der Dose Feuerkugel-Sofortnetz) | [method: bisociation, Researcher #3] Dashcam-/Türklingel-Footage von Feuerkugeln kursiert viral, aber kein automatisiertes Pre-Overwrite-Erkennungstool gefunden; dedizierte Netze (AllSky7, GMN, CAMS) nutzen eigene Astro-Kameras, keine Consumer-Ambient-Geräte. Gleiche Dose | 09/2027 |
| Radio-Meteorscatter × visuelle Zeugenmeldung in Echtzeit korrelieren | `besetzt` | [method: bisociation, Researcher #3] FRIPON kombiniert Radio- und Videostationen bereits für Echtzeit-Trajektorien (arXiv 2111.09742) | – |
| Handy-Barometer/Infraschall zur Feuerkugel-Erkennung/Korrelation | `besetzt` | [method: bisociation, Researcher #3] RedVox-App misst Infraschall bereits u.a. für Meteore/Boliden | – |
| **Baum-Stigmergie** — Baum trägt legiblen, mitwachsenden Hinweis auf eigene Kontrollhistorie (Regelkontrolle/VTA), statt dass der Befund nur in einer separaten Behörden-Datenbank liegt | `besetzt` | [method: bisociation, Researcher #4 (Session [208a0f]), aus unkommittiertem Worktree vom Librarian übernommen] Dynamische QR-Baumplaketten + öffentliche Portale existieren bereits kommerziell: baumplaketten.de (dynamische QR-Codes, Aluminium-Plakette), BaumDex, Baumsicht (Portal mit Protokollen, automatisch berechnetem nächsten Kontrolltermin), CheckTrees-App, dazu ein akademisches QR-Baummanagement-Pilotprojekt (ACM 2023) | – |
| **Baum-Verfallsdatum** — ein Kontrollbefund im Kataster verliert automatisch an Gültigkeit/Sichtbarkeit, wenn er nicht durch einen Foto-Vergleich mit dem aktuellen Baumzustand erneut bestätigt wird | `besetzt` | [method: bisociation, Researcher #4 (Session [208a0f]), aus unkommittiertem Worktree vom Librarian übernommen] Ganzer Markt für „AI tree health from repeat photography" existiert bereits: Tree Inventory AI, greehill, ArboStar, TreeTect (Green City Watch) — automatisierte Gesundheits-/Zerfallserkennung inkl. Verlaufsvergleich über Zeit ist 2026 Standardfunktion, nicht Lücke | – |

---

## Recheck 19.09.2026 (Librarian, `unklar`-Zeilen zuerst, Regel Rundenstart Schritt 3)

Einzige noch offene `unklar`-Zeile war Bebauungsplan-Leser (Tafel-Warenannahme ist seit Runde 3 `besetzt`). Bisher zwei Rechecks mit allgemeinen Begriffen; diesmal wie vorgemerkt mit konkreten Produkt- und Organisationsnamen, vier Suchen inklusive eines Seitenabrufs.

| Idee | Urteil | Beleg (kurz) | Prüfen ab |
|---|---|---|---|
| Bebauungsplan-Leser für Bürger (3. Prüfung) | `verengt` (vorher `unklar`) | Kein Werkzeug gefunden, das einen einzelnen Bebauungsplan (Festsetzungen, Baufenster, Nutzungen) in Laiensprache erklärt. Nachbarn, keiner deckt es ab: **DiPlanBeteiligung** (Berlin, live seit 12.05.2025) ist Verfahrens-/Beteiligungsplattform, in den Treffern keine KI-Zusammenfassung erwähnt; **Poliscope** macht KI-Zusammenfassungen von Ratsinformationssystemen (Sitzungen), nicht der Pläne; **InNoWest-RAG-Chatbot** (TH Brandenburg/HNEE) ist generischer Kommunal-Chatbot über von der Kommune befüllte PDFs — Seite nennt Bebauungspläne nicht, Prototyp seit Anfang 2026 in Pause, Entscheidung „RAG 2.0" Herbst/Winter 2026. Restlücke: der Plan selbst als Erklärobjekt. **Einschränkung:** Suchmaschine liefert weiter Content-Farmen (bau.de-Klone); DiPlanBeteiligung-Absenz beruht auf Trefferschnipseln, nicht auf Durchsicht des Portals. Kein Beweis der Abwesenheit. | 03/2027 (verkürzt: Kommunal-KI bewegt sich, RAG-2.0-Entscheidung im Winter) |

Keine `unklar`-Zeile mehr offen. Nächster Recheck nur, wenn die Idee je in eine Dose soll — dann zuerst das DiPlanBeteiligung-Portal selbst durchsehen und die InNoWest-Entscheidung abwarten.

---

## Recheck 19.09.2026 (2) — Hinweise von Tester-2, vom Librarian nachgeprüft

Tester-2 (Peer-Session, Altbau-Faktencheck) meldete drei Ursprungsurteile als angreifbar. Nachgeprüft mit **WebSearch-Zusammenfassungen** (je 1 Suche); **WebFetch war für help.aikido.dev und docs.endorlabs.com gesperrt, die Seiten selbst wurden nicht gelesen**. Ursprungszeilen bleiben unverändert stehen (Zählregel Playbook); das aktuelle Urteil steht hier.

| Idee | Urteil | Beleg (kurz) | Prüfen ab |
|---|---|---|---|
| Diffgeist (Recheck; Ursprung Runde 1 `frei`) | `verengt` (vorher `frei`) | **Aikido „Upgrade impact analysis"** (help.aikido.dev/aikido-autofix/breaking-changes-and-upgrade-impact-analysis, dazu Aikido-Blogpost „Upgrade Impact Analysis: When Breaking Changes Actually Matter"): bewertet Breaking Changes aus den Library-Changelogs und **scannt die Codebasis nach Nutzung der Library**; der PR nennt betroffene Dateien und Zeilen; JS, Python, Java, Go, .NET, PHP, Clojure. Das ist Changelog ∩ eigene Nutzung — der Kern von Diffgeist, aber begrenzt auf **Breaking Changes**, eingebettet in ein Security-Vendor-Produkt. **Endor Labs „Upgrade Impact Analysis"** (JS/TS, docs Sept. 2025; erste Ankündigung Aug. 2024): Risikobewertung per Programmanalyse und Heuristik für Breaking Changes — schwächerer Treffer, aus der Zusammenfassung nicht als Abgleich mit eigener Nutzung belegt. Restlücke: nicht-brechende Release-Note-Inhalte (neue Features, Deprecations, Verhaltensänderungen) personalisiert auf den eigenen Code, ohne Security-Plattform. **Nicht geprüft:** arXiv 2608.20167 (BreakGuard) und 2607.17957 (DepRepair) — von Tester-2 genannt, von mir nicht geöffnet. Laut Tester-2 wurde das übersehen, weil die Erstsuche Renovate/Dependabot/Changelog-Generatoren absuchte, nicht SCA-/Security-Anbieter; die Erstsuche selbst ist nicht dokumentiert, das lässt sich nicht nachprüfen. **Dose `05-dosen/diffgeist.md` nennt Aikido/Endor weiterhin nicht** — Nachtrag beim Dosen-Besitzer | 03/2027 |
| Ghost Replay fürs Editieren (Recheck; Ursprung Runde 1 `verengt`) | `verengt`, **Begründung geschwächt** | Der Protokollsatz „Musterauswertung/-vergleich als Forschungsfrage offen" ist so nicht haltbar: Programmier-Navigation ist etablierte Forschung — bestätigt (Suchtreffer) Singh/Henley/Fleming/Luong, *An Empirical Evaluation of Models of Programmer Navigation*, ICSME 2016, und Lawrance et al., *How Programmers Debug, Revisited: An Information Foraging Theory Perspective*, TSE. Ko et al. und Mylyn-Interaction-Trace-Studien (Tester-2) von mir nicht geprüft. Was neu sein könnte: automatische LLM-Phasenkodierung solcher Traces — **ungeprüft**, keine Suche dazu gelaufen. Dose bleibt „Forschungsfrage"; die Frage ist enger als dort formuliert | 09/2027 |
| Pin Tumbler (Recheck; Ursprung Runde 1 `verengt`) | `verengt` (unverändert) | Zwei Nachbarn, in Dose nicht genannt: **DerGut/lockpicking** (Spiel, das das Picken eines Stiftzylinders simuliert) und **chestnutzero/pin-planner / lockbuilder.io** (Frontend-Tool, Stiftbelegung visualisieren und teilen, „Simulate picking" per matter.js-2D-Physik, eigene Stiftformen). Tester-2 nennt bei DerGut zusätzlich Binding Pins und Haptik — von mir **nicht bestätigt**. Ob eines der Projekte Bohrungsversätze/Fertigungstoleranzen (die Restlücke der Dose) modelliert: **nicht geprüft**, Repos nicht geöffnet | 09/2027 |
| Altbau Thermal (Recheck; Ursprung Runde 1 `verengt`) | `verengt` (unverändert, Restlücke **schmaler**) | Die Ursprungsbegründung „Wohnungsebene bleibt Lücke“ trägt so nicht mehr. **ubakus** „Thermische Simulation – Wärmebedarf und Hitzeschutz 2.0“ rechnet Wärmebedarf und Sommer-Überhitzung für eine „Gebäudezone“ (Raum, Wohnung oder Haus) per Tabelle, stündliche Außenklimawerte, Lüftungsverhalten, Bauteile auf 1D vereinfacht (**Seite am 19.09.2026 selbst gelesen**, Artikel vom 13.11.2023). **Raumscan → Heizlast** (ScanDom Heizlast, Heizreport Scanner App, Reonic/SHK Pro) ist für Fachleute besetzt (bestätigt). **Energy2D, Better Building Heat Transfer Simulator, HTflux** existieren als allgemeine/Fach-Wärmeübertragungswerkzeuge (bestätigt, keine Wohnungssimulation für Bewohner). Restlücke: Laien-Grundriss + ehrliches Band + Schimmelecke + A/B in einem Werkzeug — Oberflächentemperatur, Taupunkt, Schimmel, Grundriss und Unsicherheit kommen auf der gelesenen ubakus-Seite nicht vor (Aussage gilt nur für diese Seite). Heatpunk (UK, Grundrisseditor, raumweise Heizlast) und reduco.ai (Adresse → DIN V 18599, Gebäudeebene) nur per Suchzusammenfassung bestätigt. Thesim 3D und HRC-Hitzetool: nur von Researcher #4 genannt, ungeprüft | 09/2027 |

**Faktenprüfung Altbau Thermal (Vorarbeit der Dose; am 19.09.2026 mit Félix' Zustimmung in die Dose übernommen, soweit belegt):** `UdK-VPT/energymap4py` existiert — öffentliches Repo der UdK-VPT-Organisation, angelegt 2025-04-29, letzter Push 2026-07-21, BSD-3-Clause, Beschreibung „Python interface of the EnergyMap Berlin database" (GitHub-API direkt abgefragt). Damit ist „Python-Schnittstelle, seit 2025" belegt. **Taupunkt-Rechnung nachgerechnet (Magnus, a = 17,62, b = 243,12 °C):** bei 20 °C / 50 % r. F. Taupunkt 9,26 °C; Oberflächentemperatur bei 80 % r. F. an der Wand 12,62 °C — stimmt mit der Angabe des Sekretariats (9,3 / 12,6 °C) überein. Die Aussage, DIN 4108-2 / ISO 13788 nutzten das 80-%-Kriterium und f_Rsi ≥ 0,70, ist **nur über Suchschnipsel von Tester-2 belegt; Normtexte wurden von niemandem gelesen** (kostenpflichtig). Nicht bestätigt: Nutzungslizenz der EnergyMap-Daten (Code BSD-3, Datenbedingungen unbekannt); Reichweite der Verbraucherzentrale-Beratung — **inzwischen an der Primärseite geprüft (verbraucherzentrale-berlin.de/gebaeudecheck, 19.09.2026):** „kostenfrei für Berliner Ein- und Zweifamilienhausbesitzer*innen“ (Projekt ZuHaus in Berlin, Senatsförderung); für Mieter*innen und WEG nennt die Seite Beratung „zur Verfügung“, **ohne Preisangabe**. Die Dose spricht von „kostenfreier Energieberatung“ und „Gebäudecheck“ als Schiene für Wohnungsnutzer — das überdehnt die belegte Kostenfreiheit.

---

## Gemini-Lauf — Kandidaten `ungeprüft` (committet 19.09.2026, Zeilen datiert 18.09.2026)

Herkunft: `gemini chnges`-Commit (9607f8a) vom 19.09.2026, der beim Speichern die konsolidierten Protokolldateien vom 18.09. überschrieben hatte. Die Konsolidierung wurde am 19.09. aus `b7e3125` wiederhergestellt; nur was aus dem Lauf **neu** war, steht hier. Die im Lauf notierten Urteile `frei (Kandidat)` sind hier zu `ungeprüft` herabgestuft: Das Bisoziation-Log führt alle zehn als „Kandidat (unverpackt)" / „Noch zu prüfen", die Belege benennen den Ist-Zustand der Quelle, prüfen aber nicht, ob es das Werkzeug schon gibt (Empfänger-zuerst-Suche fehlt), und sind nicht quellenbelegt. Sie zählen nicht in der Trefferquote. **Vor jeder Weiterverwendung: Existenzprüfung nach Playbook §1, Empfänger zuerst.**

| Idee | Zustand | Aussage des Laufs (unverifiziert) | Anmerkung Librarian |
|---|---|---|---|
| Trockenrasen-Transekte (LRT 6120, Live-Sequentialanalyse Erhaltungsgrad A) | `ungeprüft` | LANA/BfN-Kartieranleitung LRT 6120; kein Tool mit Live-Sequentialanalyse gefunden | **Überschneidung prüfen:** Kartierlotse (`verengt`) ist ebenfalls „Live-Hinweis im Feld während der Kartierung" für denselben Quelltyp. Erst klären, ob das dieselbe Idee in anderem Kostüm ist |
| Fledermaus-Echo-Entwirrer (Wasser-Mehrwege, NABU-Batcorder) | `ungeprüft` | BatClassify scheitert an Wasser-Mehrwegeausbreitung; AudioWorklet-Phasenauslöschung neu | Audio-Feld beim Atlas als „Audio-Trennung dicht" vorsichtig behandeln; Empfänger (NABU) zuerst |
| Hummel-Schleusenwächter (Kuckuckshummel am Flugloch, Echtzeit) | `ungeprüft` | MonViA wertet erst nach Monaten aus | Gleiche Quelle (Thünen MonViA) wie Brettchen-Vorsortierer (Runde 2, `frei`), andere Idee — beide gemeinsam an Thünen adressieren, nicht zweimal |
| Orgelpfeifen-Bleifraß-Resonanz | `ungeprüft` | BDO/Stiftung Denkmalschutz: bisher visuell/zerstörend | Hardware-nah (Mikrofon-Messverfahren) → defensive Publikation mitdenken |
| Waldbrand-Streu-Knistern | `ungeprüft` | DWD-WBI nur 1-km-Gitter | Hardware-/Messverfahren-nah; Empfänger Landesforst/DWD zuerst prüfen |
| Phänologischer Knospen-Countdown | `ungeprüft` | DWD-Beobachter erfassen nur ex post | Typ-B-Quelle (DWD Phänologie); Pflanzen-Foto-KI-Feld im Atlas dicht — Vorfilter beachten |
| Tafel-Frische-Triage (Ethylen-Nachbarschaft) | `ungeprüft` | Tafel-Sortierung nach grober Sicht | **Empfänger hat bewiesen Digitalprojekt:** Tafel macht Zukunft (BMEL, 1,5 Mio. €, Foto-Qualitätserfassung) hat Tafel-Warenannahme gekippt. Zuerst prüfen, ob die Fahrer-App Frische/Ethylen-Aspekte abdeckt |
| Licht-Glocken-Kataster (bürgertaugliche ULOR-Messung per Gyroskop) | `ungeprüft` | Leitfaden Berlin 2021 ohne Messwerkzeug | Nachbar von Lichtplan-Check (`frei`, Plan-Selbstcheck gegen Leitfäden), andere Funktion (Messung Bestand statt Planprüfung); gemeinsamer Empfängerkreis (Senat/Landesumweltbehörden) |
| Totholz-Kolk-Peiler (hydroakustisch, WRRL) | `ungeprüft` | WRRL-Kartierung manuell | Die im Lauf notierte Grenze „Beschleunigungssensor im Wasser braucht wasserdichte Hülle" beachten; Empfänger (Wasserwirtschaft/Bachpaten) zuerst |
| ~~Sandstein-Streiflicht-Relief~~ | **Duplikat** | Lauf hatte `verengt`, Beleg identisch zu Streiflicht | Identisch mit **Streiflicht** (Runde 2, `verengt`, gleiche CompGen-Halluzinations-Schwäche, gleiche Smartphone-RTI-Lücke). Nicht separat geführt, sonst Wiederholte-Ideen-Signal verletzt |

Die Belege des Laufs (z. B. „BatClassify scheitert an…") wurden am 19.09.2026 **nicht** nachgeprüft; sie stehen als Behauptung im Bisoziation-Log.
