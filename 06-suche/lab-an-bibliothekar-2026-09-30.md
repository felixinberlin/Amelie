# Vom Lab-Bibliothekar an den Bibliothekar (30.09.2026)

Übergabe zum zweiten Live-Lauf des Lacunar-Agenten aus Amélie-lab (Lauf `lacunar-20260930T064824-38e1d7`, Zielgebiet Schmetterlinge). Die Befunde stehen im Log (Abschnitt „Lab-Lauf 30.09.2026"); hier steht, was dort nicht hineinpasst, und was ich von deiner Seite wissen möchte. Dieser PR ist auch ein Test des Weges Lab → Amélie: bitte melde, wo er hakt.

## Was ich eingetragen habe
- **Log:** Lab-Lauf-Abschnitt (Tabellenzeile, fünf Survivors sinngemäß übersetzt, Befunde, Retro), Collider-Eintrag „Tintenfisch-Tarnung", Hinweis unter Distance yield. Alle fünf Survivors sind `ungeprüft`.
- **Nicht eingetragen:** Prüfprotokoll (Urteile sind deine), Besetzungsatlas, Gräber (der Lauf hat nichts gekillt), Quellen (siehe unten), Vektoren.

## Was der Lauf gefunden hat (Kurzfassung, Details im Log)
1. Der Collider trägt vor allem als Bild, wie schon im ersten Lab-Lauf.
2. Kein Kill: alle fünf Shortlist-Kandidaten überlebten, teils mit der Ankerseite als einzigem Beleg.
3. Die Kernannahmen der Survivors 1 und 2 (akustische Erkennung, „Stimmung" aus dem Flug) sind in den Suchantworten nicht belegt; Survivor 2 steht trotzdem als „baubar".
4. Nach fertigen Apps oder Produkten der Monitoring-Programme wurde nicht gesucht.

## Quellen, die ich dir vorschlage (nicht gebucht)
`lab-librarian` darf `source.add` nur mit `human_accepted`, das das Lab nie setzt. Deshalb steht hier nur die Liste; einen fertigen `bib apply`-Plan gibt es im Lab-Repo (`results/lacunar/lacunar-20260930T064824-38e1d7.proposed-sources.json`), zum Prüfen, Freigeben (`human_accepted: true`) und Anwenden. Evidenz jeweils nur Suchschnipsel (`angekratzt` / `schnipsel`).

| Vorschlag | URL | Rolle im Lauf |
|---|---|---|
| eBMS-Methodenseite (Tagfalter-Transekt) | https://butterfly-monitoring.net/de/bms-methods | Anker (Typ A: Schema ohne Software) |
| Nah-Infrarot-Sensornetz zur Insektenüberwachung | https://pmc.ncbi.nlm.nih.gov/articles/PMC8850605/ | Beleg „warum jetzt" für die Survivors 1 und 4 (Insekten allgemein, nicht Falter) |
| Tagfalter-Monitoring Deutschland (UFZ) | https://www.ufz.de/tagfalter-monitoring/index.php?de=41769 | Nachbar/Empfängerkreis, Programm |

Ob eine der drei ins Register gehört, ist deine Entscheidung; die UFZ-Seite habe ich nur als Fundstelle der ersten Suche, nicht gelesen.

Geprüft gegen deine CLI (im Clone, nichts geschrieben): `bib apply --dry-run` lehnt den Plan ohne Flag mit Exit 12 ab (`PERMISSION_DENIED`, „darf source.add nur mit human_accepted: true"); mit `human_accepted: true` läuft der Trockenlauf durch (Exit 0, drei Quellen „aufgenommen (angekratzt)", betroffen `06-suche/amelie-quellen.md` und `src/data/quellen.json`). `bib quellen match --url` findet für die beiden anderen URLs nichts; für die PMC-Seite meldet es nur einen Host-Treffer (Score 0,5) auf die Walnuss-Arbeit `aufprallakustik-an-walnuessen-ijabe-pmc`, eine andere Seite desselben Hosts. Ich habe sie deshalb als eigene Quelle vorgeschlagen; wenn du Host-Treffer lieber als `source.log` auf die bestehende Quelle buchst, ist das deine Wahl.

## Was ich gelernt habe (Lab-Seite)
Nach dem Lauf habe ich den Lacunar-Agenten gehärtet (Commits im Lab-Repo, noch nicht live gelaufen): Sprachzeile und Prüfregel (der Lauf schrieb Englisch zur deutschen Absicht), Pflichtfeld „Mechanismus des Colliders" mit Wortschatzprüfung, jeder Shortlist-Kandidat wird beurteilt, und eine automatische Vorab-Suche nach Bestehendem (je Kandidat eine Suche, Ergebnis als Leads für deine Existenzprüfung, nie als Urteil). Die Such-Obergrenze bleibt ein Wunsch: Suche 3 nahm 4 statt 3 Queries.

## Fragen an deine Seite
1. **Format:** Passt der Lab-Abschnitt so ins Log (Länge, Übersetzung der englischen Survivors), oder soll das Lab kürzer und nur mit Verweis auf die Lauf-Datei eintragen?
2. **Existenzprüfung:** Wer prüft die fünf Survivors, und braucht ihr vom Lab etwas Bestimmtes dafür (Suchfragen, Rohantworten aus `data/archive/…/searches/`)?
3. **`source.add`:** Ist der Weg „Lab schlägt vor, Bibliothekar gibt frei" so brauchbar, oder wollt ihr die Vorschläge lieber im Repo (`06-suche/proposals/`) statt als Datei im Lab?
4. **Log-Zeilen:** Sollen Lab-Läufe ohne Existenzprüfung überhaupt in die Tabelle „Distance yield" eingehen oder weiter nur als Fußnote?

Beleg für alles: Lab-Repo `Amelie-lab`, `results/lacunar/lacunar-20260930T064824-38e1d7.json`, Archiv `data/archive/lacunar-20260930T064824-38e1d7/`.
