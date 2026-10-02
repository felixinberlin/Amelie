# Plan: Ein Repo nur für Agenten und Werkzeuge (Amélie und Amélie-lab)

*Entwurf vom 02.10.2026, auf Wunsch von Félix, für eine Folgesitzung (Erinnerung am 06.10.2026). Grundlage: beide Repos gelesen (`felixinberlin/Amelie` und das private `felixinberlin/Amlelie-Lab`, Stand `d0c0fac`, 01.10.2026), nichts im Lab-Repo geändert. Zahlen aus `wc`, `diff` und den Dokumenten beider Repos; was Schätzung ist, steht dabei.*

## 1. Antwort in einem Absatz

Die Repos sind **inhaltlich nah, technisch weit auseinander**. Amélie ist Node/TypeScript (Agenten als Markdown-Definitionen für Claude Code plus eigenständige Node-Programme). Das Lab ist Python (rund 16.200 Zeilen Code, 7.500 Zeilen Tests, 506 Testfunktionen) mit einem TypeScript-Dashboard. Dieselben Ideen, Rollen und Verträge gibt es **zweimal**, einmal je Sprache, und das Einzige, was wirklich geteilt wird, sind drei Skills über **Symlinks**, die nur auf Félix' Rechner funktionieren. Ein gemeinsames Repo lohnt sich, aber nicht als gemeinsame Laufzeit in einer Sprache (das wäre ein Umbau von rund 16.000 Zeilen), sondern **zuerst für das, was sprachneutral ist**: Skills, Agenten-Direktiven, Verträge (JSON-Schemas) und Werkzeug-Spezifikationen.

## 2. Wie weit sind die Repos auseinander?

| Maß | Amélie | Amélie-lab |
|---|---|---|
| Sprache der Agenten-Laufzeit | Node (`scripts/agent-kit.mjs` 297 Zeilen, `scripts/crew/*` ca. 1.800, Adapter `scripts/model-compare/providers.mjs` 229) | Python (`agents/*.py`, `providers.py` 866, `toolbox.py` 327, `schema_validator.py` 1.032, `librarian.py` 709) |
| Agentendefinitionen | `.claude/agents/*.md` (8 Dateien), Skills in `.claude/skills/` **und** `skills/` | `directives/*.json` + `*.md`, Skills nur als Symlinks |
| Verträge | `scripts/crew/contracts.mjs` (264 Zeilen: `candidates`, `reviews`, `librarian`) | `schemas/*.schema.json` mit Register `schemas/contracts.json` und Versionsregeln (`docs/contracts.md`) |
| Tests | 715 (Vitest, gesamtes Repo) | 506 Testfunktionen (pytest) |
| Letzter Stand | 02.10.2026 | 01.10.2026 |

**Was heute wirklich geteilt wird:**
- `.claude/skills/amelie-ideenrunde`, `asymmetric-inversion`, `idea-reviewer` im Lab sind **Symlinks** nach `../../../amelie/.claude/skills/...`. In jedem anderen Checkout (Cloud-Sitzung, CI, anderer Rechner) zeigen sie ins Leere: in dieser Sitzung waren alle drei kaputt.
- Der Lab-Pfad `/home/felix/amelie/amelie` steht fest in sieben Python-Stellen (`AMELIE_ROOT` in `agents/lacunar_state.py` und weitere), in `.claude/settings.json`, in `README.md`, `AGENTS.md`, `CLAUDE.md` und mehreren Docs.
- Umgekehrt findet Amélie das Lab über `AMELIE_LAB` oder `../Amelie-lab` (`scripts/agent-kit.mjs`, Werkzeuge `web_search` und `places_find` laufen über den Python-Suchdienst des Labs).
- Laufzeitkopplung: Das Lab schreibt über **`bib apply`** (Amélies CLI, Akteur `lab-librarian`, Rechte in `06-suche/bib-actors.json`) und klont Amélie pro Runde (`bridge/rounds.py`); Protokoll `06-suche/amelie-lab-protokoll.md`.

## 3. Was doppelt gebaut ist (Spiegelmatrix)

| Rolle / Baustein | Amélie | Amélie-lab |
|---|---|---|
| Ideen-Engine Bisoziation | `bisoziations-kollider` + Skill `lacunar-bisociation` | `agents/lacunar.py`, `directives/lacunar-*` (aus dem Amélie-Skill importiert) |
| Ideen-Engine Inversion | `inversions-agent` + Skill `asymmetric-inversion` | `agents/inversion.py`, `directives/inversion-*` |
| Ideen-Engine Primärquellen | `ideen-scout` + Skill `amelie-ideenrunde` | `independent_researcher` (`runner.py`) |
| Prüfer / Bewertung | `idea-reviewer` (8 Vektoren) | `blind_reviewer`, `comparator`, `adjudicator` (Regeln für Vektorverschiebung) |
| Gedächtnis-Schreiber | `bibliothekar` + `bib apply` | `agents/librarian.py`, `bridge/write_plan.py`, `plan_queue.py` |
| Ventures | `venture-analyst` | `agents/mark.py` (ehemals `ventures`) |
| Packen | `dose-packer`, `demo-builder` | `agents/packer.py` (packt Mark-Läufe zu Projekten) |
| Werkzeugkasten | `agent-kit.mjs`: `read_file`, `search_repo`, `run_cli` (bib/quellen), `web_fetch`, `web_search`, `places_find`, `load_skill`, `call_agent` | `agents/toolbox.py`: `bib_find`, `graves_find`, `search`, `places_find` (Werkzeugliste ist ein Vertrag, Erweiterung = MINOR-Version) |
| Modell-Adapter | `scripts/model-compare/providers.mjs` (Claude direkt, Vertex, Gemini) | `agents/providers.py` (Gemini, OpenAI-kompatibel, Anthropic, Vertex MaaS; laut Handoff „unused“) |
| Kosten / Preise | Kostenzeile im Modellvergleich, Preise in `models.local.json` | `utils/cost_tracker.py`, `data/pricing.json` |
| Format-Verträge | `crew/contracts.mjs` | `schemas/*.schema.json` + `schema_validator.py` |

**Nur im Lab:** Blind-Stufe mit `RedactionFilter`, `comparator`, `adjudicator`, `archivist`, `scarcity`, Dashboard (`src/`), Quote-Verifikation.
**Nur in Amélie:** `bib`-CLI mit Gedächtnis (Gräber, Register, Protokoll), `dose-packer`, `demo-builder`, Orchestrator-Skill, `teamrunde`, Lab-PR-Prüfung (`lab-review`).

## 4. Empfehlung: nicht eine Laufzeit, sondern ein gemeinsamer Inhalt

| Option | Inhalt | Aufwand | Risiko | Urteil |
|---|---|---|---|---|
| **A. Inhalts-Repo** | Skills, Direktiven, Verträge (JSON-Schema), Werkzeug-Spezifikationen, Preise; beide Laufzeiten lesen davon | klein bis mittel | niedrig | **Zuerst** |
| **B. Werkzeuge als MCP-Server** | `bib_find`, `graves_find`, `search`, `places_find` als sprachneutraler Dienst, den beide Laufzeiten und Claude Code aufrufen | mittel | mittel | **Danach**, wenn A steht |
| **C. Eine gemeinsame Laufzeit** | Das Lab nach Node portieren (oder Amélie nach Python), ein Kit für beide | groß (ca. 16.000 Zeilen plus 7.500 Testzeilen) | hoch | **Nicht jetzt**; nur wenn A und B zeigen, dass die Doppelung weiter schmerzt |

Zusatzidee: Das Prototype-Fund-Konzept (`04-werkzeug/prototype-fund-antrag-klasse-03.md`) sieht ein getrenntes Open-Source-Repo `zdrift-core` vor (transaktionaler Einzelschreiber mit Rollback, Audit-Log, Rechten). Das ist im Kern `bib apply` (`scripts/bib-apply.mjs`, `bib-store.mjs`, `bib-ops.mjs`, `bib-errors.mjs`, `06-suche/bib-actors.json` als Konfigurationsform). **Prüfen, ob das Werkzeug-Repo und `zdrift-core` dasselbe Repo sein sollen**: ein Repo unter MIT oder EUPL-1.2 würde zugleich die OSI-Lizenz-Hürde für Prototype Fund und Claude for Open Source lösen.

## 5. Was ins neue Repo gehört und was nicht

**Gehört hinein (sprachneutral oder generisch):**
- Methoden-Skills: `lacunar-bisociation`, `asymmetric-inversion`, `idea-reviewer`, `amelie-ideenrunde` (mit je einer einzigen Quelle statt der heutigen zwei Varianten in `.claude/skills/` und `skills/`, die laut `diff` schon um 8 bis 34 Diff-Zeilen auseinanderlaufen).
- Direktiven des Labs, aus denselben Quellen abgeleitet (`directives/*-operators.md` ist heute eine Kopie aus dem Amélie-Skill).
- Verträge: ein Register für `schemas/contracts.json` des Labs und `contracts.mjs` von Amélie, mit Versionsregeln.
- Werkzeug-Spezifikationen (`tool-call`/`tool-result`, Budgets, Namen).
- Gemeinsame Preisliste und Modellnamen.
- Generische Teile der Gedächtnis-Mechanik (`bib apply`-Kern), falls `zdrift-core` und Werkzeug-Repo zusammenfallen.

**Bleibt, wo es ist:**
- **Daten:** Gräber, Register, Protokoll, Logs (Amélie); Packets, Results, Archive, Rounds (Lab). Keine Daten ins Werkzeug-Repo.
- Projektspezifische Agenten mit Schreibrechten und Pfaden (`dose-packer`, `demo-builder`, `bibliothekar`, Lab-`librarian`).
- Die Fachlogik, die nur zu einem Projekt gehört: Lab-Blindstufe, Redaction, Adjudikation; Amélies Dose-Format und Lint.
- Das Dashboard des Labs.

## 6. Phasen mit Abnahmekriterium

| Phase | Ziel | Fertig, wenn |
|---|---|---|
| 0 | Entscheidungen von Félix (Abschnitt 8) | Name, Lizenz, Sichtbarkeit, Einbindungsweg stehen |
| 1 | Spiegel-Inventar als Skript (`diff` der gespiegelten Dateien, Hash-Liste, Drift-Alarm) | Ein Befehl zeigt, welche Skills, Direktiven und Verträge zwischen den Repos abweichen; CI-fähig |
| 2 | Neues Repo mit Skills und Direktiven (eine Quelle, Ableitung der zweiten Form) | `.claude/skills/` und `skills/` in Amélie sind eine Quelle; Lab-Symlinks ersetzt; Tests beider Repos grün |
| 3 | Vertragsregister vereinen | Beide Laufzeiten validieren gegen dieselben Schemas; Versionswechsel nur über das Register |
| 4 | Pfadkopplung lösen | `AMELIE_ROOT` und `AMELIE_LAB` per Umgebungsvariable oder Konfiguration, keine festen `/home/felix/...`-Pfade mehr; Lab läuft in einer Cloud-Sitzung ohne Handarbeit |
| 5 | Werkzeuge als MCP-Server (optional) | `bib_find`, `graves_find`, `search`, `places_find` laufen aus einem Prozess für Node-Kit, Python-Lab und Claude Code |
| 6 | Entscheidung zur Laufzeit-Konvergenz | Messung: Wie viel Doppelpflege blieb übrig? Dann C ja oder nein |

**Größenordnung (Schätzung, keine Messung):** Phase 1 ein halber Tag, Phase 2 und 3 je ein bis zwei Tage, Phase 4 ein Tag, Phase 5 zwei bis drei Tage, Phase 6 ist eine Entscheidung. Jede Phase soll einzeln lieferbar und rückbaubar sein.

## 7. Risiken

1. **Symlinks brechen still.** Die drei Lab-Skills waren in der Cloud-Sitzung tote Links. Kein neuer Weg darf auf relative Pfade zwischen Geschwister-Repos setzen.
2. **Versionsdrift.** Zwei Laufzeiten gegen ein Register: Ein Schema-Wechsel braucht Semver und beidseitige Tests, sonst bricht eine Seite unbemerkt (das Lab hat dafür schon Regeln in `docs/contracts.md`).
3. **Altlast im Lab-Verlauf.** Laut `docs/NEXT-SESSION.md` enthält die Lab-Historie ein eingechecktes `.venv` und einen 88-MB-Cloud-SDK-Tarball (Commit `0e18534f` und früher). **Nie mit Verlauf übernehmen**; neues Repo, Inhalte kopieren, nicht die Geschichte.
4. **Blindheit des Labs.** Das Lab darf der Blind-Stufe nichts Internes zeigen (Werte, Urteile, Pfade). Ein gemeinsames Repo darf keine Amélie-internen Daten in Werkzeug-Spezifikationen tragen, die an Gemini gehen.
5. **Sichtbarkeit.** Das Lab ist privat, Amélie öffentlich. Das Werkzeug-Repo muss öffentlich sein, wenn es Förderfähigkeit schaffen soll. Vorher prüfen, dass kein Schlüssel, keine GCP-Projektdaten und keine privaten Pfade im Material stehen (`.env.example`, `.claude/settings.json`).
6. **Schreibrechte.** Beide Repos haben harte Regeln: Das Lab fasst den Live-Checkout hier nie an, Amélie schreibt nichts ins Lab. Das Werkzeug-Repo darf diese Grenze nicht aufweichen.
7. **Namen.** Das Lab-Repo heißt `Amlelie-Lab` (Tippfehler), Dokumente schreiben `Amelie-lab`/„Amélie-lab“, die GCP-Projekt-ID ist `amelie-agents`. Für das neue Repo einen Namen wählen, der damit nicht kollidiert.

## 8. Entscheidungen, die Félix treffen muss (vor Phase 1)

1. **Name** des Repos (Vorschläge: `amelie-toolkit`, `amelie-crew`; nicht `amelie-agents`, das ist die GCP-Projekt-ID).
2. **Lizenz:** MIT oder EUPL-1.2 (OSI) für den Code, CC0 für Texte. Gleichzeitig `zdrift-core`: ein Repo oder zwei?
3. **Sichtbarkeit:** öffentlich (Förderfähigkeit) oder zunächst privat.
4. **Einbindungsweg:** Git-Submodul, Subtree, npm-/pip-Paket oder Kopie per Skript. Empfehlung: Submodul oder Paket mit festen Versionen, **keine** Symlinks.
5. **Reihenfolge:** Phase 1 und 2 zuerst (Skills und Direktiven), bevor etwas Größeres angefasst wird?
6. **Amélies Doppel-Variante der Skills** (`.claude/skills/` und `skills/`): ist `skills/` (mit `.skill`-Archiven) noch nötig oder genügt die Claude-Code-Fassung?
7. **Lab-PR-Prozess** (`lab-review`, `check-lab-pr`) bleibt in Amélie. Einverstanden?

## 9. Erster Schritt der Folgesitzung

1. Frage Félix, ob die Idee noch gilt und beantworte Abschnitt 8 mit ihm.
2. Phase 1 bauen: ein Skript, das Skills, Direktiven, Verträge und Werkzeugnamen beider Repos vergleicht. Es braucht nur Leserechte auf beiden Checkouts (`add_repo` für `felixinberlin/Amlelie-Lab`, `git clone --depth 1`, ein Klon, keine parallelen Operationen).
3. Das Skript-Ergebnis in dieses Dokument eintragen, bevor Phase 2 beginnt.

## 10. Was ich nicht geprüft habe

- Ob alle Lab-Tests heute grün sind (Pytest-Umgebung nicht aufgebaut; README nennt 422, das Handoff 547 Tests, gezählt wurden 506 Testfunktionen).
- Den tatsächlichen Verlauf des Lab-Repos (nur flacher Klon, `.git` hier 5,9 MB gegen die genannten 240 MB).
- Ob die Lab-Werkzeuge `search` und `places_find` heute live laufen (Amélie bindet sie über `AMELIE_LAB` ein, hier nicht getestet).
- Die `CLAUDE.md` des Labs (kam nicht in diese Lektüre).
