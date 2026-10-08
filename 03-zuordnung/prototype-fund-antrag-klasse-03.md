# Prototype Fund Klasse 03: Antragsentwurf „Amélie Werkbank"

*Entwurf vom 29.09.2026 · CC0 · Bewerbungsfenster laut Suchschnipsel 01.10.–30.11.2026 · Einreichung nur durch Félix selbst auf `bewerben.prototypefund.de`.*

> **Status: Entwurf, nicht eingereicht.** Die Primärseite `prototypefund.de` war beim Erstellen für den Agenten gesperrt (HTTP 403). Alle Angaben zum Programm sind Suchschnipsel (StartHub Hessen, Reflecta, DSEE-Förderdatenbank). **Vor dem Einreichen** auf der Ausschreibung prüfen: Frist, Summen, Rechtsform, Lizenzanforderung, Feldnamen und Zeichenlimits. Felder in `[eckigen Klammern]` kann nur Félix füllen.

## 0. Vor dem Einreichen zu klären (Blocker)

| # | Frage | Warum | Stand |
|---|---|---|---|
| 1 | **Lizenz.** Das Repo steht komplett unter CC0. PF verlangt eine freie Open-Source-Lizenz für den Code. | Ob CC0 für Software akzeptiert wird, ist im Repo als offen geführt (`amelie-foerderlandschaft.md` §8.2). | Ausschreibung lesen oder PF fragen. Fallback: Code der Werkbank (`src/`, `scripts/`, `packages/`) zusätzlich als MIT oder Apache-2.0, Inhalte bleiben CC0. |
| 2 | **Rechtsform.** Nur Freiberufler:innen/Selbstständige oder GbR bis 4 Personen, Wohnsitz DE. | Harte Regel laut Notiz 20.09.2026. | Félix bestätigt. |
| 3 | **Passung zu „Nie bauen".** Regel 5 verbietet, Geben als Ausrede zu nutzen. | Der Antrag baut nicht die Geschenke, sondern die Werkbank, mit der andere sie finden und verschenken. Das muss im Antrag genauso klar stehen. | Im Text gelöst (§2). |
| 4 | **Vorhabenbeginn.** Bereits Gebautes ist Vorarbeit, kein Förderinhalt. | Der Antrag darf nur Arbeit ab Förderbeginn abrechnen. | Arbeitspakete unten sind ausschließlich neu. |
| 5 | **Live-Links.** Deep-Link-Pflicht: nur `https://felixinberlin.github.io/Amelie/#dose=<id>`. | Zustellregel 5. | Beim Einfügen jeden Link prüfen. |

## 1. Kurzfassung (Projekttitel und Pitch)

**Titel:** Amélie Werkbank: offene Infrastruktur, mit der Gemeinschaften Ideen finden, auf Vorbelegung prüfen und verschenken

**Ein-Satz-Pitch:** Amélie macht aus der Frage „Was fehlt im Gemeinwohl-Software-Bereich und ist es noch frei?" einen wiederholbaren, prüfbaren Ablauf, und die Werkbank macht diesen Ablauf für jede Community mit einem Befehl nutzbar.

**Kategorie:** Public Interest Tech, Werkzeug für Civic-Tech- und Förder-Ökosystem.

**Laufzeit / Summe:** 6 Monate, Einzelperson. Summe laut Schnipsel bis 47.500 € (**vor Einreichen prüfen**).

## 2. Problem

Civic-Tech-Teams, Verwaltungs-Open-Source und Antragsteller:innen verlieren Wochen an zwei Fragen:

1. *Was wird gebraucht?* Bedarf steht verstreut in Normen, Ausschreibungen, Haushaltsdaten und Bürgerwünschen.
2. *Gibt es das schon?* Wer das nicht prüft, baut Doppeltes. Im Amélie-Bestand waren 44 von 81 verworfenen Ideen (Friedhof) „gebaut", 17 „beim Empfänger": rund drei Viertel der verworfenen Ideen (61 von 81) scheitern an fehlender Vorprüfung, nicht an fehlender Umsetzbarkeit.

Es gibt Ideenlisten und Förderdatenbanken, aber **keinen offenen, maschinenlesbaren Weg**, eine Idee mit Quellen, Belegtiefe und Urteil („frei / verengt / unklar / besetzt") so zu dokumentieren, dass Dritte das Urteil nachprüfen, wiederverwenden und fortschreiben können.

## 3. Lösung: Was bereits existiert (Vorarbeit, nicht förderfähig)

Amélie läuft seit 2026 als CC0-Repo (`felixinberlin/Amelie`). Stand 29.09.2026:

* **Methode:** drei Entdeckungs-Engines (Primärquellen, Bisoziation, Inversion), ein unabhängiger Reviewer mit 8 Vektoren, Packer, Demo-Builder, Bibliothekar (`skills/`, `.claude/agents/`).
* **Gedächtnis als Dateien:** Prüfprotokoll, Quellen-Register (`src/data/quellen.json`), 81 Gräber mit Totenschein, Playbook mit Vorfiltern.
* **Bestand:** 45 verschenkbare Dosen (zweisprachig), 10 lauffähige Demo-Gerüste mit Tests, Web-App (GitHub Pages).
* **Qualitätssicherung:** Drift-Guards (`npm run lint`: `check:dosen`, `check:protokoll`, `check:friedhof`, `check:quellen` u. a.) und Vitest-Suiten.

**Was fehlt (Gegenstand dieses Antrags):** Das alles ist heute ein persönliches Repo, das nur mit Wissen über die Interna und mit einem Claude-Code-Setup bedienbar ist. Andere Communities können es weder installieren noch ihre eigene Instanz betreiben, und die Urteile sind nicht als offenes Datenformat veröffentlicht.

## 4. Vorhaben: Was in 6 Monaten neu entsteht

Abgrenzung: **Gefördert wird die Werkbank (Software und Spezifikation), nicht die verschenkten Ideen.** Amélie baut weiterhin keine Dosen nach.

| AP | Monat | Ergebnis | Nachweis (prüfbar) |
|---|---|---|---|
| 1 | 1–2 | **`amelie-spec` v1**: JSON-Schema für Idee, Urteil, Beleg, Quelle, Grab, inkl. Beleg-Tiefe (Volltext / Schnipsel / nicht gelesen) | Schema + Validator-Paket auf npm, alle 45 Dosen und 81 Gräber validieren; Spezifikation CC0 |
| 2 | 2–4 | **CLI `npx amelie`**: `init`, `pack`, `check`, `export`. `check` fragt öffentliche Register ab (GitHub-Suche, npm, PyPI, OSBA-/PF-/NLnet-Projektlisten) und schreibt Belegzeilen mit Fundstelle | Tests, Beispielprotokoll, Doku; CLI läuft ohne Claude-Zugang (Agenten-Anbindung optional) |
| 3 | 3–5 | **Instanz-Vorlage**: Template-Repo, mit dem eine Community (z. B. Bibliothek, Verwaltung, Hackspace) eine eigene Amélie-Instanz mit eigenem Themenfeld aufsetzt; Drift-Guards als GitHub Action | Zwei Pilotinstanzen außerhalb des eigenen Repos, nachweisbar angelegt [Partner benennen, siehe §7] |
| 4 | 4–5 | **Offener Feed** (JSON/Atom) der Urteile und Gräber; Zenodo-/DOI-Anbindung als Defensivpublikation | Feed live, mindestens 20 Einträge mit DOI |
| 5 | 5–6 | **Dokumentation, Barrierefreiheit, Evaluation**: Handbuch (DE/EN), Nutzungstest mit 5 Personen ohne Vorwissen, Bericht mit Fehlern | Testbericht im Repo, behobene Befunde markiert |

**Nicht Teil des Antrags:** neue Dosen, Mailversand, Beratung, Vertrieb. Amélie verkauft nichts und hakt nicht nach.

## 5. Zielgruppe und gesellschaftlicher Nutzen

* **Primär:** Civic-Tech-Gruppen, Verwaltungs-Open-Source-Stellen (OpenCoDE-Umfeld), Hochschul-Transferstellen, Förder- und Vergabestellen, die Bedarf und Besetztheit prüfen müssen.
* **Sekundär:** Einzelentwickler:innen, die ein Thema für Prototype Fund und ähnliche Töpfe suchen. Der Nutzen ist hier konkret: weniger Anträge für bereits Gebautes.
* **Wirkung:** Doppelarbeit im Gemeinwohl-Software-Bereich sinkt, Ideen bleiben nachprüfbar, Wissen über gescheiterte Ideen (Friedhof) wird erstmals öffentliches Gut.

## 6. Stand der Technik und Abgrenzung

| Vergleich | Unterschied |
|---|---|
| Ideenlisten (Awesome-Listen, Up-for-grabs, Civic-Tech-Ideenbörsen) | Listen ohne Vorprüfung, ohne Urteil, ohne Beleg |
| Förderdatenbanken (Förderkatalog, Foerderdatenbank, PF-Klassenlisten) | Zeigen, was gefördert wird; sie prüfen keine Idee |
| Defensivpublikation (TDCommons, Zenodo) | Kanal, kein Ablauf; die Werkbank speist ihn |
| KI-Ideengeneratoren | Erzeugen Kandidaten ohne Belegpflicht. Amélie verlangt Fundstelle und Beleg-Tiefe, das Ergebnis ist ein Urteil mit Nachweis |

*Noch zu tun vor Einreichen:* PF-Klassenlisten und NLnet-Archiv nach „Ideenprüfung / Prior-Art / Ideenbörse" durchsuchen (Besetzt-Test gegen den eigenen Antrag; Playbook §3.3). Das ist bisher **nicht** geschehen.

## 7. Risiken (Wo es kippt)

1. **Keine externen Nutzer.** Pilotinstanzen kommen nicht zustande. *Gegenmittel:* bis Monat 2 zwei schriftliche Zusagen einholen; sonst AP 3 auf eigene Zweitinstanz (zweites Themenfeld) reduzieren und offen so berichten. [Partner: offen]
2. **Belegqualität bei Auto-Abfragen.** Treffer der `check`-Abfragen sind nur Hinweise. *Gegenmittel:* CLI markiert jede Zeile als „Schnipsel" oder „gelesen", nie automatisch „frei".
3. **Abhängigkeit von Claude-Agenten.** *Gegenmittel:* CLI und Spezifikation funktionieren ohne; Agenten sind ein optionales Frontend.
4. **Lizenzfrage** (§0 Nr. 1).
5. **Bündelung von Pflege.** Nach 6 Monaten trägt eine Person die Wartung. *Gegenmittel:* Instanz-Vorlage und Governance-Text (`GOVERNANCE.md`) so schreiben, dass Forks ohne den Autor funktionieren.

## 8. Arbeitsweise, Team, Lizenz

* **Team:** Félix [Name, Wohnort, Rechtsform: Freiberufler:in/Selbstständig, einzutragen].
* **Transparenz KI-Nutzung:** Amélie nutzt Claude-Code-Agenten für Recherche und Entwurf. Jede Behauptung im Bestand hat eine Fundstelle; Angaben aus Suchschnipseln sind als solche markiert. Das Projekt ist bereit, diese Nutzung im Antrag offen darzulegen.
* **Lizenz:** Inhalte und Spezifikation CC0 1.0. Code: CC0 bzw. bei Bedarf zusätzliche OSI-Lizenz (§0 Nr. 1). Alles öffentlich ab Tag 1.
* **Code Repository:** `https://github.com/felixinberlin/Amelie`
* **Demo:** `https://felixinberlin.github.io/Amelie/` [Deep-Link auf eine konkrete Dose statt Startseite einsetzen, z. B. `#dose=<id>`; Link vor Einreichen im Browser testen]

## 9. Förderbrücke und Anschluss

Nach Klasse 03: Sovereign Tech Agency / NLnet Open Internet Stack für die Spezifikation und das Validator-Paket (Passung „niedrig bis mittel": nur Bausteine, keine Anwendungen; **Frist und Zulässigkeit unverifiziert**).

## 10. Kurzfassung in English (für die Antragsmaske)

Amélie is an open (CC0) method and toolset for finding gaps in public-interest software, checking whether they are still free, and giving the idea away. Its 45 packaged ideas and 81 documented dead ends prove the method, but it only runs inside one personal repository. In six months we build the *Amélie Werkbank*: a JSON-schema specification for evidence-backed idea verdicts, a CLI (`npx amelie`) with prior-art checks against public registers, an instance template so other communities can run their own gap-finding, and an open feed with DOIs. We do not build the gifted ideas, and we sell nothing.

## 11. Einreichungs-Checkliste (für Félix)

- [ ] Ausschreibung Klasse 03 auf `prototypefund.de` lesen; §0 Nr. 1–2 klären
- [ ] Besetzt-Test gegen PF-Klassenlisten und NLnet-Archiv (§6)
- [ ] Zwei Pilotpartner ansprechen, **einmalig und ohne Nachfassen** (Zustellregel 3)
- [ ] Namen, Adresse, Rechtsform, Budgetaufstellung in die Maske eintragen (Personentage × Satz; Summe an die Grenze aus der Ausschreibung anpassen)
- [ ] Deep-Link im Antrag testen
- [ ] Eintrag im Prüfprotokoll oder Zustellplan, falls eingereicht
