# Prototype Fund Klasse 03: Antragsentwurf v2 (Software-Infrastruktur)

*Entwurf vom 30.09.2026, ersetzt v1 (Amélie als Ideenverfahren; v1 liegt in der Git-Historie, Commit `3866399`). Bewerbungsfenster 01.10.–30.11.2026 laut Suchschnipseln, Primärseite war für mich gesperrt. Felder mit **[FÉLIX]** kannst nur du ausfüllen. Kennzahlen aus `npm run bib -- status` vom 30.09.2026.*

**Warum v2:** Seit 2025 fördert der Prototype Fund Schwerpunkte **Datensicherheit** und **Software-Infrastruktur** (Bibliotheken, Protokoll-Implementierungen). v1 las sich als Ideensammlung und passte dazu schlecht (Begründung: `prototype-fund-swot-und-vergleich.md`). v2 macht daraus eine Bibliothek.

---

## 0. Zuerst lesen: Verkauf und Förderung vertragen sich nur mit Trennung

Du willst deinen Agenten-Workflow verkaufen. Im Repo gibt es dafür schon ein Produkt: `zero-drift-swarm-kit/` (`package.json`: Lizenz „Commercial", Lemon-Squeezy-Setup mit Preisstufen 79/149/299 $). Für den Antrag heißt das:

1. **Was die Förderung baut, muss Open Source sein.** Der Prototype Fund verlangt für das Ergebnis eine Open-Source-Lizenz. Geförderter Code darf deshalb nicht in das kommerzielle Kit wandern und dort proprietär werden. Saubere Lösung: **neues, getrenntes Repo** (`zdrift-core`) unter MIT oder EUPL-1.2, das mit Förderung entsteht. Das Kit nutzt es später als Abhängigkeit (Open-Core: Kern offen, Vorlagen, Support und Feinschliff kostenpflichtig).
2. **Kein Verkaufsantrag.** Der Antrag begründet Gemeinwohl und Infrastruktur, nicht Umsatz. Eine ehrliche Nachhaltigkeitszeile („optionale bezahlte Unterstützung und Vorlagen außerhalb des geförderten Umfangs") ist üblich und unschädlich; ein Preisplan wäre es nicht. **Offenlegen**, dass es ein kommerzielles Kit gibt, statt es zu verschweigen. Auf dem Prüfstand liegt sonst deine Glaubwürdigkeit.
3. **Nicht mit Fördergeld doppelt bezahlen.** Arbeitszeit, die das Kit verbessert, aber nicht dem offenen Kern dient, gehört nicht in den Antrag.
4. **Vorhabenbeginn.** Das Kit existiert und ist kommerziell veröffentlicht. Der Antrag beschreibt nur **neue** Arbeit am offenen Kern.
5. **Rückfrage vor Abgabe** beim Prototype-Fund-Team: „Darf ich das geförderte Open-Source-Ergebnis später in ein kostenpflichtiges Produkt/Angebot einbetten?" Die Regeln habe ich nicht lesen können. Erwartbar ist ja (Open Source erlaubt kommerzielle Nutzung), aber das ist meine Vermutung, keine Auskunft.
6. **Im Repo liegt ein Widerspruch:** `main` gilt als 100 % CC0 („Eiserne Trennung" mit `feat/venture-*`), das Kit liegt aber als „Commercial" in `main`. Klären, wo die Grenze verläuft, bevor du auf ein Repo verlinkst.
7. **Zahlen im Kit-Text veralten:** README nennt „42 Tools, 52 Sackgassen"; heute sind es 44 Dosen und 95 Gräber. Vor Verkaufsstart und vor Verlinkung im Antrag angleichen.

Weitere offene Punkte (unverändert): Antragsberechtigung (Einzelperson/GbR, Wohnsitz), Lizenzwahl für Code (CC0 ist keine OSI-Lizenz), aktuelle Fördersumme (Einzelperson bis 47.500 €/6 Monate, Team bis 95.000 €/6 Monate laut Schnipseln). Alles auf `bewerben.prototypefund.de` gegenprüfen.

---

## 1. Titel und Kurzbeschreibung

**Titel:** Zero-Drift: eine offene Bibliothek für überprüfbare Zusammenarbeit von KI-Agenten an gemeinsamem Projektwissen

**Kurzbeschreibung (ca. 500 Zeichen):**
Teams, die KI-Coding-Agenten einsetzen, verlieren Zuverlässigkeit: Agenten überschreiben sich gegenseitig, Dokumentation und Code laufen auseinander, gescheiterte Wege werden wiederholt. Zero-Drift ist eine Open-Source-Bibliothek, die genau diese Fehlerklassen mechanisch verhindert: ein transaktionaler Einzelschreiber für gemeinsamen Zustand (Rollback, Audit-Log, Rechte pro Agent), deklarative Drift-Prüfungen zwischen Spezifikation und Code und ein strukturiertes, maschinenlesbares Register gescheiterter Ansätze. Entstanden und erprobt in einem laufenden Projekt mit 44 Dokumenten, 95 Sackgassen und 302 geprüften Einträgen.

**English abstract:**
Teams using AI coding agents lose reliability: agents overwrite each other, docs and code drift apart, failed approaches get repeated. Zero-Drift is an open-source library that prevents these failure classes mechanically: a transactional single-writer store for shared state (rollback, audit log, per-agent permissions), declarative drift checks between specs and code, and a structured machine-readable registry of failed approaches. Extracted from a running project with 44 dossiers, 95 dead ends and 302 audited entries.

---

## 2. Problem

- **Agenten schreiben gleichzeitig in dieselben Dateien.** Ergebnis: Merge-Konflikte, überschriebene Notizen, halb geschriebene Register. Kein gängiges Werkzeug sichert Zustandsdateien, die mehrere Agenten lesen und einer schreibt, transaktional ab.
- **Dokumentation und Code laufen auseinander,** ohne dass es jemand merkt, bis ein Agent auf falschem Stand weiterbaut.
- **Agenten vergessen Fehlschläge.** Der Kontext ist endlich, dieselbe Sackgasse wird wiederholt. Ein strukturiertes Fehlschlagregister fehlt; es gibt Freitext-Postmortems, aber kein Schema, das ein Agent vor dem Handeln abfragen kann.
- **Nachprüfbarkeit fehlt.** „Es funktioniert" sagt das Modell. Wer prüft es, wer hat wann was geschrieben, und darf dieser Agent das überhaupt?
- **Gemeinwohl-Bezug:** Kleine Open-Source- und Civic-Tech-Teams haben kein Budget für Prozessaufsicht. Wenn sie Agenten einsetzen, brauchen sie Leitplanken, die als Bibliothek kommen, nicht als Beratung. Mechanische Prüfungen (Hashes, Rollback, Rechte, Audit-Log) sind zugleich ein Beitrag zur Integrität von KI-unterstützter Arbeit.

## 3. Lösung: drei kleine, unabhängig nutzbare Bausteine

1. **`zdrift-store`:** transaktionaler Einzelschreiber. Typisierte Operationen, alles oder nichts, Schreibsperre, Vorbedingungen (Hashes), idempotent über ein Ledger, Rollback nach Absturz, Audit-Log, Rechte pro Akteur.
2. **`zdrift-check`:** deklarative Drift-Prüfung. Regeln wie „jede Spezifikation in `specs/` hat einen Eintrag in `registry.ts` und umgekehrt", ausführbar in CI, Exit-Codes.
3. **`zdrift-graveyard`:** JSON-Schema und Validator für Totenscheine gescheiterter Ansätze (`cause`, `killer`, `foundBy`, `stage`) plus Abfrage („gab es das schon?") mit eindeutigem Exit-Code.

Alle drei sind heute im Repo vorhanden, aber **an das Repo-Layout gebunden** (`scripts/bib-*.mjs`, `scripts/check-*.mjs`, `scripts/friedhof-muster.mjs`). Die Arbeit ist Extraktion, Verallgemeinerung, Tests und Dokumentation, nicht Erfindung.

## 4. Arbeitspakete (6 Monate, Juni–November 2027) **[FÉLIX: Aufwände anpassen]**

Bewusst nur vier. Die Jury bevorzugt einen fokussierten Kern.

| AP | Ergebnis | Nachweis | Aufwand |
|---|---|---|---|
| 1 | **`zdrift-store`** als eigenständiges Paket: konfigurierbares Speicherlayout, Operationen per JSON-Schema, Sperre, Snapshot/Journal/Rollback, Ledger, Akteursrechte | Testsuite inkl. Crash-Simulation und parallelen Schreibversuchen; Beispiel mit zwei konkurrierenden Agenten | 9 Wochen |
| 2 | **`zdrift-check`:** deklarative Regeln, CI-Aktion, verständliche Fehlermeldungen | Regeln laufen auf zwei unterschiedlichen Fremd-Layouts (z. B. Amélie und ein externes Repo) | 5 Wochen |
| 3 | **`zdrift-graveyard`:** Schema v1, Validator, Abfrage-CLI, Export des Amélie-Friedhofs (95 Totenscheine) als offener Datensatz mit Datenblatt und Zenodo-DOI | Datensatz + Datenblatt, Validierung fehlerfrei | 4 Wochen |
| 4 | **Evaluation und Doku:** gemessen an echten Läufen (Amélie-Repo, ein externer Pilot **[FÉLIX: nennen oder streichen]**): Zahl verhinderter Kollisionen, gefangener Drift-Fälle, Fehlalarme; Schnellstart Deutsch/Englisch | Bericht mit Methode, Zahlen und Grenzen; Anleitung, die ein Fremder in 30 Minuten durchläuft | 6 Wochen |

**Nicht gefördert werden soll:** Ideensuche, Dosen-Erstellung, Empfängerkommunikation, Agentenprompts, Marketing des Kits.

## 5. Gemeinwohl, Zielgruppe, Reichweite

- **Zielgruppe:** Entwickler:innen und kleine Teams (Civic Tech, Open-Source-Projekte, Forschungssoftware), die KI-Agenten einsetzen und ihr Ergebnis nachprüfen müssen.
- **Nutzen:** weniger stille Fehler in KI-unterstützter Entwicklung, wiederverwendbare Bausteine statt Eigenbau, ein offener Datensatz gescheiterter Ansätze.
- **Reichweite (ehrlich):** heute unbelegt. Es gibt keine externen Nutzer:innen. Der Pilot in AP 4 ist der erste Beleg und ohne ihn ist die Aussage „nützlich" eine Behauptung.
- **Offenheit:** Kern unter OSI-Lizenz **[FÉLIX: MIT oder EUPL-1.2]**, Datensatz CC0, keine Registrierung, kein Tracking.

## 6. Innovation gegenüber Vorhandenem

Es gibt Frameworks zur Orchestrierung von Agenten und Sammlungen von Postmortems. Das Neue, soweit ich es aus Suchschnipseln beurteilen kann, ist die Kombination aus **transaktionalem Einzelschreiber für Projektwissen**, **mechanischen Drift-Prüfungen** und **abfragbarem Fehlschlagregister** als kleine, austauschbare Bibliotheken. Nicht geprüft: aktuelle Agenten-Frameworks und MCP-Memory-Server. **[FÉLIX/ich: vor Abgabe Besetzt-Test gegen Agenten-Memory-Bibliotheken und die Prototype-Fund-Projektliste durchführen.]** Ergebnis ins Prüfprotokoll eintragen.

## 7. Stand und Belege (nachprüfbar im Repo)

| Kennzahl | Wert | Quelle |
|---|---|---|
| Geprüfte Ideen-Dossiers / Friedhof / Protokollzeilen / Quellen | 44 / 95 / 302 / 158 | `npm run bib -- status` |
| Transaktionale Schreibschicht | `bib apply` mit Snapshot, Journal, Rollback, Ledger, Sperre, Vorbedingungen, Akteursrechte, Audit-Log | `AGENTS.md` §5, `scripts/bib-apply.mjs` |
| Drift-Guards in CI | check:dosen, books, idea-frontmatter, protokoll, friedhof, quellen | `npm run lint` |
| Agentenrollen mit getrennten Schreibrechten | 8 Rollen in `.claude/agents/` (3 Engines, Reviewer, Packer, Demo-Builder, Bibliothekar, Venture-Analyst) | Repo |
| Vorstufe als Vorlage | `zero-drift-swarm-kit/` (kommerziell lizenziert, nicht Teil der Förderung) | Repo |

## 8. Risiken und Grenzen

- **Kein externer Beleg.** Alles Vorhandene ist von einer Person in einem Projekt erprobt. Ob es außerhalb trägt, zeigt erst AP 2 und AP 4.
- **Repo-Bindung.** Die Bausteine sind heute nicht generisch; die Extraktion kann schwerer sein als geschätzt (Layout, Pfade, Annahmen über Dateiformate).
- **Schneller Markt.** Agenten-Werkzeuge ändern sich monatlich. Gegenmaßnahme: Bibliotheken bleiben agentenunabhängig (Dateien, JSON-Schema, Exit-Codes), keine Bindung an einen Anbieter.
- **Ehrlichkeit über KI:** Teile des Bestands entstanden mit KI-Agenten; der Modellvergleich (`npm run vergleich`) ist gebaut, aber noch nicht gegen Live-APIs gelaufen. Das steht im Antrag, nicht nur im Repo.
- **Einzelperson, Bus-Faktor 1.**
- **Konkurrenz durch Frameworks großer Anbieter,** die Ähnliches einbauen könnten.
- **Förderquote ≈ 9 %.** Plan B nötig (siehe `prototype-fund-swot-und-vergleich.md`).

## 9. Nachhaltigkeit

Kern als kleine Bibliotheken ohne Server (nur Dateien und CLI), Tests und CI im Repo, Dokumentation. Danach: Pflege durch Nutzer:innen und Autor; **optional** bezahlte Unterstützung und Vorlagen außerhalb des geförderten Umfangs (siehe §0, offen kommunizieren).

## 10. Team

**[FÉLIX]** Kurzvita, Wohnort, Rechtsform, Open-Source-Erfahrung. Nichts erfunden. Mögliche Partner:innen: `prototype-fund-partner-suche.md`.

## 11. Budget (Skizze, Einzelperson, 6 Monate) **[FÉLIX: an aktuelle Richtlinie anpassen]**

Obergrenze laut Schnipsel 47.500 €. Personalkostenmodell und erlaubte Sachkosten nach aktueller Ausschreibung. Sachkosten gering: Hosting kostenlos, wenige hundert Euro API-Kosten für die Evaluation (AP 4), Zenodo kostenlos.

## 12. Nächste Schritte

1. §0 klären, vor allem Punkte 1 (getrenntes Repo, Lizenz), 5 (Rückfrage zum späteren Verkauf) und 6 (Repo-Widerspruch).
2. Besetzt-Test: Prototype-Fund-Projektliste (Stichwörter: agent, memory, drift, schema, registry) und aktuelle Agenten-Memory-Bibliotheken.
3. Neues Repo `zdrift-core` mit Lizenz und leerem README anlegen, damit der Antrag auf etwas Reales verweist. **Keine** Funktionalität vor Förderbeginn hineinschieben, die als Vorhabenbeginn zählen könnte, ohne die Richtlinie gelesen zu haben.
4. Feldlimits der Bewerbungsmaske gegen diesen Entwurf abgleichen und kürzen.
5. Abgabe deutlich vor 30.11.2026.
