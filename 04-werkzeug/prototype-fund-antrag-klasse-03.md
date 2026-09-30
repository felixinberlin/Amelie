# Prototype Fund Klasse 03: Antragsentwurf „Amélie"

*Entwurf vom 30.09.2026. Bewerbungsfenster laut Repo-Katalog: 01.10.–30.11.2026 (Quelle: Suchschnipsel, **nicht** auf der Primärseite gelesen). Die Felder mit **[FÉLIX]** kann nur du ausfüllen. Alle Zahlen unter „Belege" stammen aus `npm run bib -- status` vom 30.09.2026.*

---

## 0. Vor dem Absenden klären (Blocker)

Diese Punkte sind im Repo als offen geführt (`06-suche/amelie-foerderlandschaft.md` §8) und ich konnte sie nicht selbst schließen, weil der Egress-Proxy `prototypefund.de` sperrt (HTTP 403).

1. **Antragsberechtigung.** Laut Repo-Notiz nur Freiberufler:innen/Selbstständige oder GbR (≤ 4 Personen), keine Vereine, Stiftungen oder Behörden. Wohnsitz in Deutschland. **[FÉLIX]** Trifft das auf dich zu (Einzelperson, freiberuflich)? Auf `bewerben.prototypefund.de` gegenprüfen.
2. **Lizenz.** Der Prototype Fund verlangt Open Source. Das Repo ist komplett CC0. Ob CC0 für **Code** akzeptiert wird, ist nicht geklärt (CC0 ist keine OSI-Lizenz). Vorschlag: Code unter MIT (oder EUPL-1.2), Inhalte (Dossiers, Gräber, Daten) bleiben CC0. Das ist eine Entscheidung für dich, sie ändert `LICENSE` und `package.json`.
3. **Fördersumme.** Im Repo stehen widersprüchliche Angaben (Einzelperson 47.500 €; Team 95.000 € bzw. 158.000 €). Aktuelle Werte in der Ausschreibung nachlesen. Dieser Entwurf rechnet mit der Einzelperson-Variante.
4. **Vorhabenbeginn.** Bundesmittel fördern in der Regel nichts, was schon läuft. Das Repo existiert und ist weit fortgeschritten. Der Antrag muss deshalb **neue, klar abgegrenzte Arbeit** beschreiben (siehe Arbeitspakete), nicht den Bestand.
5. **Passung zur Haltung.** Amélie verkauft nichts und pitcht keine Empfänger. Ein eigener Förderantrag verletzt das nicht (Regel 1–3 betreffen die Zustellung an Empfänger), sollte aber im README kurz erwähnt werden, damit es nicht wie ein Widerspruch wirkt.

---

## 1. Projekttitel und Kurzbeschreibung

**Titel:** Amélie Kit: ein Baukasten, mit dem jede Community geprüfte Gemeinwohl-Software-Ideen verschenkt (und ihre Fehlschläge dokumentiert)

**Kurzbeschreibung (ca. 400 Zeichen):**
Amélie ist ein offenes Verfahren, Ideen für Gemeinwohl-Software nicht selbst zu bauen, sondern nach gründlicher Doppelprüfung an die richtigen Menschen zu verschenken. Heute liegt das Gedächtnis (44 geprüfte Ideen-Dossiers, 95 begrabene Ideen mit Totenschein, 302 Prüfprotokoll-Zeilen, 158 Quellen) in einem einzigen Repository. Das Projekt macht daraus ein wiederverwendbares Werkzeug: Schema, Kommandozeile, Feeds und eine Vorlage für eigene Instanzen.

**English abstract:**
Amélie is an open method for giving away civic-software ideas after rigorous prior-art checking instead of building them. Its memory (44 vetted idea dossiers, 95 buried ideas with cause of death, 302 audit rows, 158 sources) currently lives in one repository. This project turns it into a reusable toolkit: a schema, a CLI, machine-readable feeds and a template so other communities can run their own instance and share their dead ideas, which is the part nobody publishes.

---

## 2. Problem

- Gemeinwohl-Software wird immer wieder doppelt erdacht und doppelt gebaut. Ob es eine Idee „schon gibt", weiß vorher niemand systematisch. Die Antwort steckt verstreut in Förderlisten, Repositories und Fachgremien.
- **Fehlschläge werden nicht veröffentlicht.** Ideen, die an Recht, Empfänger oder Datenlage scheitern, verschwinden. Das nächste Team läuft in dieselbe Wand.
- Kleine Organisationen und Einzelentwickler:innen haben oft Zeit, aber keine belastbare, geprüfte Ideenliste mit klarem ersten Schritt und benannter Zielgruppe.
- Mit LLM-Werkzeugen entstehen Ideenlisten billig, aber ohne Nachprüfbarkeit. Eine Liste, die sagt „frei", obwohl die Idee schon begraben oder besetzt ist, schadet mehr als keine Liste.

## 3. Lösung

Amélie trennt drei Dinge sauber und macht jedes maschinenlesbar:

1. **Dose:** ein Dossier mit Problem, „Warum jetzt", Skizze, erstem Ticket, Bruchstellen, Vorläufern und benanntem Empfänger. Zweisprachig, CC0.
2. **Grab:** jede verworfene Idee mit Totenschein (`cause`, `killer`, `foundBy`, `stage`). Der Friedhof ist eine offene Datenbasis gescheiterter Gemeinwohl-Ideen.
3. **Prüfprotokoll:** jede geprüfte Idee, eine Zeile, Urteil (`frei`, `verengt`, `unklar`, `besetzt`), Evidenz.

Die Bibliotheks-Kommandozeile (`bib find`, `grab`, `protokoll`, `quellen`, `apply`) prüft vor jeder neuen Idee gegen das gesamte Gedächtnis und liefert einen eindeutigen Exit-Code, wenn es die Idee schon gibt. Schreibzugriffe laufen transaktional (alles oder nichts, Rollback, Audit-Log, Rechte pro Akteur).

## 4. Was mit der Förderung neu entsteht (Arbeitspakete, 6 Monate)

Nur Arbeit, die es heute **nicht** gibt. Aufwandsangaben sind Schätzungen **[FÉLIX: anpassen]**.

| AP | Ergebnis | Nachweis | Aufwand |
|---|---|---|---|
| 1 | **`amelie-spec` v1:** stabiles JSON-Schema für Dose, Grab und Protokollzeile, mit Validator als npm-Paket und Versionierung | Schema + Paket + Tests, Beispieldaten aus dem Bestand validieren fehlerfrei | 4 Wochen |
| 2 | **`amelie-bib` als eigenständiges Paket:** die CLI löst sich vom Repo-Layout, arbeitet auf beliebigen Instanz-Ordnern, `init` erzeugt eine leere Instanz | `npx amelie-bib init && npx amelie-bib find …` läuft auf leerem Ordner; Testsuite gegen Fixture-Instanz | 6 Wochen |
| 3 | **Instanz-Vorlage** („Template-Repo"): Gedächtnis-Struktur, CI-Checks (Drift-Guards), GitHub-Pages-Frontend, Anleitung „Starte deine eigene Amélie" | Template-Repo, das ohne Änderung deployt; Dokumentation Deutsch/Englisch | 4 Wochen |
| 4 | **Feeds und Veröffentlichung:** JSON/Atom-Feed neuer Dosen und Gräber, optional DOI über Zenodo für jede Dose (Prior-Art-Nachweis) | Feed validiert, ein Testlauf mit Zenodo-Sandbox | 4 Wochen |
| 5 | **Friedhof als offener Datensatz:** Totenschein-Schema, Kategorien (`gebaut`, `beim-empfaenger`, `reality-check`, `praemisse`, `mode`, `duplikat`), CSV/JSON-Export, Datenblatt mit Erhebungsmethode und Grenzen | Datensatz mit Datenblatt, Zenodo-DOI | 3 Wochen |
| 6 | **Ehrliche Evaluation:** Nachprüfung einer Stichprobe der bisherigen „frei"-Urteile gegen Primärquellen, Fehlerquote veröffentlichen | Bericht mit Stichprobengröße, Methode, Fehlerquote | 3 Wochen |
| 7 | **Pilot mit externen Nutzer:innen [FÉLIX: konkrete Personen/Gruppen nennen, sonst streichen]:** mindestens eine fremde Instanz setzt das Kit auf, Rückmeldungen fließen ein | Link auf die fremde Instanz, dokumentierte Probleme | 2 Wochen + laufend |

Abgrenzung: **nicht** gefördert werden soll die Ideensuche selbst, die Dosen-Erstellung oder die Empfängerkommunikation. Das bleibt Eigenarbeit außerhalb des Antrags.

## 5. Gemeinwohl und Zielgruppe

- **Zielgruppe:** Civic-Tech-Gruppen, Universitäten, Verwaltungen, NGOs, Förderer und Einzelentwickler:innen, die Gemeinwohl-Ideen sammeln oder prüfen wollen.
- **Nutzen:** weniger doppelte Arbeit, sichtbare Sackgassen, nachprüfbare Ideenlisten, übertragbares Verfahren statt Einzelsammlung.
- **Offen und frei:** Inhalte CC0, Code unter OSI-Lizenz (Vorschlag MIT/EUPL, siehe Blocker 2). Keine Registrierung, kein Tracking, kein Nachfassen bei Empfängern.

## 6. Stand heute (Belege, nachprüfbar im Repo)

| Kennzahl | Wert | Quelle |
|---|---|---|
| Dosen | 44 | `npm run bib -- status` |
| Gräber | 95 | dito |
| Prüfprotokoll-Zeilen | 302 (24 frei, 100 verengt, 36 unklar, 87 besetzt) | dito |
| Quellen im Register | 158 | dito |
| Ungeprüfte / geprüfte Kandidaten | 154 Kandidaten, 124 noch ungeprüft | dito |
| Demos mit Engine und Tests | 10 laufende Demos (`07-demos/`) | `AMELIE_STATUS.md` |
| Drift-Guards | check:dosen, books, idea-frontmatter, protokoll, friedhof, quellen | `npm run lint` |
| Rollen | 3 Entdeckungs-Engines, 1 Reviewer (8 Vektoren), Packer, Demo-Builder, Bibliothekar | `skills/`, `.claude/agents/` |

Ein Teil des Bestands wurde mit LLM-Agenten erzeugt und geprüft. Das sagt der Antrag offen (siehe Risiken).

## 7. Risiken und Grenzen (bewusst im Antrag)

- **Evidenzqualität.** Viele Recherchen liefen nur über Suchschnipsel, weil Behörden-Seiten gesperrt waren. Frühere Runden markieren das, aber „frei" heißt nur „nicht gefunden", nie „bewiesen frei". AP 6 misst genau das.
- **LLM-Beteiligung.** Ideen und Urteile entstehen zum Teil durch Agenten. Freigabe und Verifikation von Empfängern und Fristen liegen beim Menschen. Ein Modellvergleich (`npm run vergleich`) ist gebaut, aber noch **nicht** gegen Live-APIs gelaufen.
- **Einzelperson.** Bus-Faktor 1. Gegenmaßnahme: Template und Doku (AP 3), Governance-Dokument liegt vor.
- **Nutzen unbewiesen.** Bisher ist nicht belegt, dass Empfänger Dosen aufgreifen. Amélie fasst nicht nach, misst das also bewusst nicht aktiv. Pilot (AP 7) liefert erste Hinweise.
- **Überschneidung mit vorhandenen Projekten.** Vor Abgabe Klassenlisten des Prototype Fund auf ähnliche Projekte prüfen (im Repo ausdrücklich als noch nicht gelesen vermerkt).

## 8. Nachhaltigkeit nach der Förderung

Statisches Hosting (GitHub Pages, keine laufenden Kosten), Daten als Dateien im Repo, Drift-Guards in CI, Template-Ansatz verteilt die Pflege auf die Instanz-Betreiber:innen.

## 9. Team und Person

**[FÉLIX]** Kurzvita, Wohnort, Rechtsform (freiberuflich/GbR), Erfahrung mit Open Source. Der Entwurf erfindet nichts.

## 10. Budget (Skizze, Einzelperson, 6 Monate) **[FÉLIX: an aktuelle Richtlinie anpassen]**

Die Obergrenze für Einzelpersonen ist im Repo mit 47.500 € vermerkt (aus Suchschnipsel). Eine belastbare Aufteilung setzt die Vorgaben der aktuellen Ausschreibung voraus (Stundensatz/Personalkostenmodell, erlaubte Sachkosten). Sachkosten des Projekts sind gering: Hosting kostenlos, LLM-/API-Kosten für die Evaluation (AP 6) wenige hundert Euro, Domain optional.

---

## 11. Nächste Schritte (in dieser Reihenfolge)

1. Blocker 1–4 klären (Berechtigung, Lizenz, Summe, Vorhabenbeginn) auf `prototypefund.de` und `bewerben.prototypefund.de`.
2. Klassenlisten des Prototype Fund nach ähnlichen Projekten durchsuchen (Besetzt-Test), Ergebnis ins Prüfprotokoll eintragen.
3. Frage- und Zeichenlimits der Bewerbungsmaske gegen diesen Entwurf abgleichen und kürzen.
4. Wenn die Lizenzentscheidung fällt: `LICENSE`, `package.json` und README anpassen.
5. Abgabe vor 30.11.2026, nicht am letzten Tag.
