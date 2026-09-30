# Besetzt-Test: Agenten-Memory, Drift-Prüfung und Fehlschlag-Register

*Stand 30.09.2026, für den Antrag „Zero-Drift" (`prototype-fund-antrag-klasse-03.md`). Methode: Websuche (8 Suchen) und 3 gelesene Seiten (fiberplane/drift, PROJECTMEM, AgentRoom als arXiv-Zusammenfassung). Alles andere sind **Suchschnipsel**. „Nicht gefunden" heißt hier nur „nicht in diesen Schnipseln", nie „gibt es nicht". Die Prototype-Fund-Projektliste war gesperrt und ist **nicht** geprüft.*

## Ergebnis in einem Satz

**Zwei der drei Bausteine sind besetzt oder eng, einer ist vermutlich frei.** Der Antrag sollte auf den freien Kern (transaktionaler Einzelschreiber) zielen und die beiden anderen als Anbindung an Vorhandenes statt als Neubau darstellen.

## Baustein für Baustein

### 1. Transaktionaler Einzelschreiber (`zdrift-store`): verengt, vermutlich frei im Kern

| Fund | Was es tut | Abstand zu Zero-Drift |
|---|---|---|
| Muster „single-writer memory steward" in Praxisberichten ([DEV Community](https://dev.to/akaranjkar08/claude-code-multi-agent-coordination-build-ai-teams-that-ship-2026-16b9), [Diskussion anthropic-sdk-python](https://github.com/anthropics/anthropic-sdk-python/discussions/1313)) | Als Muster beschrieben: eine Schreiberin, Rest liest; Hinweis „temp-Datei, dann tauschen" | Muster ist **bekannt**, eine Bibliothek dazu habe ich nicht gefunden |
| [agent-locks](https://github.com/Warnes-Innovations/agent-locks) | MCP-Server: Arbeit beanspruchen, Sperrdateien unter `.git/`, lesbares Log, über Worktrees hinweg | Koordiniert **wer woran arbeitet**, nicht transaktionales Schreiben von Zustandsdateien |
| [CORAL](https://arxiv.org/pdf/2604.01658) | Geteilter Speicher über Symlinks, eindeutige Dateinamen je Versuch, dadurch kein Locking nötig | Vermeidet das Problem durch Design; kein Rollback, keine Vorbedingungen |
| [AgentRoom](https://arxiv.org/abs/2608.23740) | Dateiebene-Claims und CRDT-gemergtes Dateisystem für gleichzeitige Agenten | Anderer Ansatz (gleichzeitiges Editieren), Forschungsstand |
| [Code as Agent Harness](https://arxiv.org/pdf/2605.18747) (Übersicht) | Benennt als offenes Problem: Synchronisierung liefert keine **transaktionale Semantik** | Stützt die These, dass die Lücke real ist |

**Nicht gefunden:** eine Bibliothek mit Snapshot + Journal + Rollback, Ledger (idempotent), Vorbedingungen per Hash und Rechten pro Akteur für gemeinsame Agenten-Zustandsdateien. Das ist der Teil, den `bib apply` heute hat. **Einschätzung: der Kern der Neuheit.**

### 2. Drift-Prüfung (`zdrift-check`): besetzt

| Fund | Was es tut |
|---|---|
| [fiberplane/drift](https://github.com/fiberplane/drift) (gelesen) | MIT, Zig, 146 Sterne, 94 Commits. Bindet Markdown an Code-Dateien oder Symbole (`drift.lock`, AST-Fingerabdruck), meldet veraltete Doku mit Exit-Code 1, GitHub-Action, `--changed` für PRs |
| [ryanwaits/drift](https://github.com/ryanwaits/drift) | Erkennt, wenn Doku vom Code abweicht |
| [OpenSpec](https://www.augmentcode.com/tools/best-spec-driven-development-tools) | Laut Schnipsel 52.100 GitHub-Sterne (Juni 2026); Spezifikationen als Quelle der Wahrheit, Vorschlag/Anwenden/Archiv |
| Spec Kit, Kiro, spec-driven-drift (VS-Code-Erweiterung) | Spezifikationsgetriebene Entwicklung, teils mit Drift-Erkennung |

Was Amélie hat, ist enger: Parität zwischen Markdown-Dossiers und einem **typisierten Register** (`dosen.ts`), nicht zwischen Doku und Code-Symbolen. Das ist ein Sonderfall, kein eigener Markt. **Einschätzung: als eigenständiges Werkzeug nicht förderwürdig neu.**

### 3. Fehlschlag-Register (`zdrift-graveyard`): teilweise besetzt

| Fund | Was es tut | Abstand |
|---|---|---|
| [PROJECTMEM](https://arxiv.org/abs/2606.12329) (gelesen, Juni 2026) | Append-only Ereignislog (Issues, Versuche, Fixes, Entscheidungen), **Vorab-Sperre**, die Agenten warnt, bevor sie einen früher gescheiterten Fix wiederholen; Python-Paket, MCP, 37 Tests, Quellcode offen | **Nächster Verwandter.** Deckt „Agenten vergessen Fehlschläge" schon ab. Concurrency wird in der Zusammenfassung nicht behandelt |
| [Agent Incident Registry](https://arxiv.org/html/2609.11030v1) | 487 öffentliche Vorfälle mit Quelle, Zitat, stabiler ID, expliziten Unbekannten | Andere Domäne (Vorfälle produktiver KI-Agenten), aber ähnliches Prinzip |
| Failory, Autopsy, CB Insights, danluu/post-mortems | Startup- und Technik-Postmortems | Kommerziell/Freitext |
| Mem0, Zep, Letta, MCP-Memory-Server | Semantische Langzeitspeicher für Agenten | Anderes Problem (Abruf per Ähnlichkeit, nicht Freigabe und Nachweis) |

**Bleibt frei:** ein **Datensatz gescheiterter Gemeinwohl-Software-Ideen** (95 Totenscheine) und ein Schema für Urteile über Ideen. Das ist keine Konkurrenz zu PROJECTMEM, weil es Ideen statt Code-Fixes betrifft. **Einschätzung: Werkzeug besetzt, Datensatz frei.**

## Folgen für den Antrag (in `prototype-fund-antrag-klasse-03.md` eingearbeitet)

1. **Schwerpunkt auf `zdrift-store`.** Das ist der einzige Baustein, für den ich keinen Vorläufer fand. AP 1 wird größer.
2. **Drift-Prüfung nicht neu bauen.** Stattdessen ein dünner Adapter, der Register-Parität als Regel bereitstellt und sich mit fiberplane/drift verträgt. Sonst fragt die Jury zu Recht „warum nicht das nehmen?".
3. **Graveyard als Datensatz und Schema, nicht als Konkurrenz zu PROJECTMEM.** Schnittstelle prüfen (Ereignistypen abbildbar?). Das ist ungeklärt und im Antrag als Prüfauftrag formuliert, nicht als Zusage.
4. **Die Neuheitsbehauptung lautet vorsichtig:** „Für transaktionale, nachvollziehbare Schreibzugriffe mehrerer Agenten auf gemeinsame Projektdateien haben wir in einer ersten Recherche keine Bibliothek gefunden."

## Grenzen dieser Prüfung

- Acht Suchen, keine Code-Suche auf GitHub, kein Test der Fundstücke. Stars und Aktivität stammen aus Schnipseln bzw. einer gelesenen Seite.
- PROJECTMEM und AgentRoom kenne ich nur aus der arXiv-Zusammenfassung, nicht aus dem Quelltext. Ob PROJECTMEM parallele Schreiber sicher behandelt, ist offen.
- Nicht durchsucht: npm/PyPI, Anthropic- und Cursor-Dokumentation zu eingebauten Sperren, Prototype-Fund-Projektliste.
- Der Markt bewegt sich schnell; Ergebnis nach 4–8 Wochen erneut prüfen und **vor Abgabe** noch einmal (30 Minuten).
