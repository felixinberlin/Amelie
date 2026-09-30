# Lab-PR-Prüfung: `npm run lab`

Ein Befehl für die Prüfkette aus `06-suche/amelie-lab-protokoll.md` §7. Der Bibliothekar ist dabei ein **eigenständiger Agent** wie die im Schwesterprojekt: ein eigenes Programm mit eigener Gesprächsschleife gegen ein Modell (`scripts/lab-librarian-agent.mjs`), kein Claude-Code-Subagent. Er nutzt die Anbieter-Adapter des Modellvergleichs (Claude direkt, Claude über Vertex, Gemini).

```
npm run lab -- list                        offene PRs mit Branch lab/*
npm run lab -- review <pr>                 prüfen, nur lokal, nichts geht nach außen
npm run lab -- review <pr> --no-agent      nur die maschinellen Prüfungen (kostet nichts)
npm run lab -- review <pr> --merge --post  prüfen, bei grün mergen, Kommentar mit Kopfzeile posten
```

Optionen: `--model <id>` (Modell aus `scripts/model-compare/models.local.json`; sonst Eintrag `"librarian"`, sonst `"judge"`, sonst das erste), `--no-delegate` (keine Unter-Agenten), `--keep` (Worktree behalten).

## Was läuft

1. **PR lesen:** offen und Branch `lab/*`, sonst Abbruch.
2. **Umfang, bevor irgendein Code des PR läuft:** nur neue Dateien unter `06-suche/proposals/`. Verstoß = Befund, kein Worktree, keine Ausführung.
3. **Worktree** unter `/tmp` (nicht unter `.claude/worktrees`, Vitest sammelt das sonst ein), `node_modules` per Symlink.
4. **Manifest:** `check-lab-pr` in der Fassung von `main` gegen den Worktree (`--root`), mit dem PR-Text (Pflichtzeile „Existenzprüfung“). Bei PRs mit mehreren Läufen genügt es, dass jede Datei zu irgendeinem Manifest gehört.
5. **Pläne:** `bib apply --dry-run` je `*.json` (Akteur `lab-librarian`), gegen den Stand von `main`.
6. **`npm run lint` und `npm test`** im Worktree, einzeln. Nicht `bib abschluss`: das schreibt `export:data`.
7. **Agent (nur lesend):** eigene Schleife gegen ein Modell. Er hat die Kernwerkzeuge (`bib_find`, `quellen_match`, `list_proposals`, `read_proposal`) und das **Kit** (`scripts/agent-kit.mjs`), mit dem er auf das Projekt zugreifen kann, wenn die Prüfung es braucht. Er endet mit `EMPFEHLUNG: merge` oder `EMPFEHLUNG: nicht mergen`. Fehlt die Zeile oder startet der Agent nicht (SDK, Zugang), ist das ein Befund und `--merge` greift nicht.

## Was der Agent aus dem Projekt nutzen kann

| Werkzeug | Was | Grenze |
|---|---|---|
| `run_cli` | Lesebefehle von `bib` (find, exists, vorflug, status, state, ledger, schema, grab list/show/stats/werte, protokoll show/stats, vector show, quellen match/formate) und `quellen` (next, show, stats, check, match, formate, list) | Erlaubnisliste, kein Schreibbefehl, keine Schalter wie `--dry-run`, `--actor`, `--key` |
| `read_file`, `search_repo` | Dateien lesen, `git grep` | nur im Repo, nie `.git`, `node_modules`, `.env*`, `client_secret*`, `models.local.json` |
| `web_fetch` | Quellen-URL ansehen | Text, gekürzt, keine internen Adressen, höchstens 12 Seiten |
| `list_skills`, `load_skill` | Skills unter `.claude/skills` als Text in den Kontext laden (SKILL.md und `references/`, `assets/`) | nur lesen |
| `list_agents`, `call_agent` | andere Amélie-Agenten als **Unter-Agent**: `ideen-scout`, `idea-reviewer`, `inversions-agent`, `bisoziations-kollider` | siehe unten |

**Unter-Agenten:** Die Definition aus `.claude/agents/<name>.md` wird zum Systemtext, die Werkzeuge ergeben sich aus ihrem `tools:`-Feld (Read→`read_file`, Grep/Glob→`search_repo`, Bash→`run_cli`, WebFetch→`web_fetch`, WebSearch→Suche des Anbieters). **Edit und Write entfallen immer**: Was der Agent in eine Datei schreiben würde, kommt als Text zurück. Unter-Agenten rufen keine weiteren Agenten (Tiefe 1), je Lauf sind höchstens 3 erlaubt, je Agent 14 Runden. Nicht delegierbar: `bibliothekar` (er selbst), `dose-packer`, `demo-builder`, `venture-analyst`. Token der Unter-Agenten zählen in die Kosten.

Zurückhaltung ist Teil der Anweisung: Eine Existenzprüfung setzen nach Protokoll §8 Félix oder der Orchestrator an. Der Agent ruft einen Unter-Agenten nur, wenn eine konkrete Frage der Prüfung sonst offen bliebe, und begründet das im Bericht. `--no-delegate` nimmt ihm `call_agent` ganz weg (Skills und Lesewerkzeuge bleiben).

## Nach außen geht nur mit Schalter

* `--merge`: nur wenn alle Prüfungen grün sind **und** der Agent „merge“ empfiehlt (mit `--no-agent` wird nie gemergt). Dann `gh pr merge --merge` und `git pull --ff-only`.
* `--post`: schreibt den Kommentar mit der festen Kopfzeile (Entscheidung / Existenzprüfung / Gebuchte Quellen) aus dem Protokoll. Nur bei Merge oder Ablehnung, sonst gibt es keine Entscheidung.
* Quellen werden **nie** gebucht. „Gebuchte Quellen“ steht immer auf `keine`; das entscheidet Félix.

Bericht liegt nach jedem Lauf unter `/tmp/amelie-lab-pr-<nr>-bericht.md`. Exit 0 = mergebar, 2 = Befunde.

## Einrichten des Agenten

Wie beim Modellvergleich (`06-suche/amelie-modellvergleich.md`): `npm i --no-save @anthropic-ai/sdk @anthropic-ai/vertex-sdk @google/genai`, dann `scripts/model-compare/models.local.json` anlegen, Zugang setzen (`ANTHROPIC_API_KEY`, `GOOGLE_CLOUD_PROJECT` oder `GEMINI_API_KEY`). Die Adapter sind in dieser Umgebung nicht gegen die Live-APIs gelaufen; die Schleife und die Werkzeuge sind mit einem geskripteten Adapter getestet (`src/utils/labReview.test.ts`).

Code: `scripts/lab-review.mjs` (CLI), `scripts/lab-review-lib.mjs` (Regeln), `scripts/lab-librarian-agent.mjs` (Agent), `scripts/agent-kit.mjs` (Kit: CLI, Dateien, Skills, Unter-Agenten; auch für andere eigenständige Agenten nutzbar). Tests: `src/utils/labReview.test.ts`, `src/utils/agentKit.test.ts`.
