# Lab-PR-Prüfung: `npm run lab`

Ein Befehl für die Prüfkette aus `06-suche/amelie-lab-protokoll.md` §7. Der Bibliothekar ist dabei ein **eigenständiger Agent** wie die im Schwesterprojekt: ein eigenes Programm mit eigener Gesprächsschleife gegen ein Modell (`scripts/lab-librarian-agent.mjs`), kein Claude-Code-Subagent. Er nutzt die Anbieter-Adapter des Modellvergleichs (Claude direkt, Claude über Vertex, Gemini).

```
npm run lab -- list                        offene PRs mit Branch lab/*
npm run lab -- review <pr>                 prüfen, nur lokal, nichts geht nach außen
npm run lab -- review <pr> --no-agent      nur die maschinellen Prüfungen (kostet nichts)
npm run lab -- review <pr> --merge --post  prüfen, bei grün mergen, Kommentar mit Kopfzeile posten
```

Optionen: `--model <id>` (Modell aus `scripts/model-compare/models.local.json`; sonst Eintrag `"librarian"`, sonst `"judge"`, sonst das erste), `--keep` (Worktree behalten).

## Was läuft

1. **PR lesen:** offen und Branch `lab/*`, sonst Abbruch.
2. **Umfang, bevor irgendein Code des PR läuft:** nur neue Dateien unter `06-suche/proposals/`. Verstoß = Befund, kein Worktree, keine Ausführung.
3. **Worktree** unter `/tmp` (nicht unter `.claude/worktrees`, Vitest sammelt das sonst ein), `node_modules` per Symlink.
4. **Manifest:** `check-lab-pr` in der Fassung von `main` gegen den Worktree (`--root`), mit dem PR-Text (Pflichtzeile „Existenzprüfung“). Bei PRs mit mehreren Läufen genügt es, dass jede Datei zu irgendeinem Manifest gehört.
5. **Pläne:** `bib apply --dry-run` je `*.json` (Akteur `lab-librarian`), gegen den Stand von `main`.
6. **`npm run lint` und `npm test`** im Worktree, einzeln. Nicht `bib abschluss`: das schreibt `export:data`.
7. **Agent (nur lesend):** Werkzeuge `bib_find`, `quellen_match`, `list_proposals`, `read_proposal` (nur unter `proposals/`). Er bucht und schreibt nichts, gleicht Begriffe und Quellen mit dem Gedächtnis ab und endet mit `EMPFEHLUNG: merge` oder `EMPFEHLUNG: nicht mergen`. Fehlt die Zeile oder startet der Agent nicht (SDK, Zugang), ist das ein Befund und `--merge` greift nicht.

## Nach außen geht nur mit Schalter

* `--merge`: nur wenn alle Prüfungen grün sind **und** der Agent „merge“ empfiehlt (mit `--no-agent` wird nie gemergt). Dann `gh pr merge --merge` und `git pull --ff-only`.
* `--post`: schreibt den Kommentar mit der festen Kopfzeile (Entscheidung / Existenzprüfung / Gebuchte Quellen) aus dem Protokoll. Nur bei Merge oder Ablehnung, sonst gibt es keine Entscheidung.
* Quellen werden **nie** gebucht. „Gebuchte Quellen“ steht immer auf `keine`; das entscheidet Félix.

Bericht liegt nach jedem Lauf unter `/tmp/amelie-lab-pr-<nr>-bericht.md`. Exit 0 = mergebar, 2 = Befunde.

## Einrichten des Agenten

Wie beim Modellvergleich (`06-suche/amelie-modellvergleich.md`): `npm i --no-save @anthropic-ai/sdk @anthropic-ai/vertex-sdk @google/genai`, dann `scripts/model-compare/models.local.json` anlegen, Zugang setzen (`ANTHROPIC_API_KEY`, `GOOGLE_CLOUD_PROJECT` oder `GEMINI_API_KEY`). Die Adapter sind in dieser Umgebung nicht gegen die Live-APIs gelaufen; die Schleife und die Werkzeuge sind mit einem geskripteten Adapter getestet (`src/utils/labReview.test.ts`).

Code: `scripts/lab-review.mjs` (CLI), `scripts/lab-review-lib.mjs` (Regeln), `scripts/lab-librarian-agent.mjs` (Agent).
