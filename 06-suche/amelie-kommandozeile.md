# Amélie von der Kommandozeile

Stand 01.10.2026. Alles in diesem Blatt läuft **ohne Claude-Code-Sitzung**: im Terminal, in Shell-Skripten, per cron. Die Agenten der Crew sind eigenständige Programme mit eigener Gesprächsschleife gegen ein Modell (Gemini über Vertex AI, Claude direkt oder über Vertex). Sie lesen dieselben Agentendefinitionen (`.claude/agents/*.md`) und Skills (`.claude/skills/`) wie die Claude-Code-Subagenten.

Für Menschen ohne Technik: [`amelie-agenten-fuer-menschen.md`](amelie-agenten-fuer-menschen.md).
Node-PATH, falls nötig: `export PATH="/home/felix/.nvm/versions/node/v26.3.1/bin:$PATH"`.

---

## 1. Schnellstart

```bash
# einmal: Modelle und SDKs (siehe §2)
npm run agent -- list                                  # wer ist da, wer darf was schreiben

# ganze Kette ohne Netz und Kosten (prüft Verkabelung, schreibt nichts)
npm run teamrunde -- "Holz" --mock

# echte Teamrunde, nur Trockenlauf, danach durchsehen
npm run teamrunde -- "Holz" --model gemini-flash
npm run agent -- runs
npm run agent -- show latest:bibliothekar
npm run agent -- write latest:bibliothekar --dry-run   # zeigt Plan-Ergebnis und Retro
npm run agent -- write <bibliothekar-run_id>           # bucht wirklich
npm run bib -- abschluss                               # export:data → lint → test
```

---

## 2. Einrichten

1. **SDKs** (stehen nicht in `package.json`, nach jedem `npm install` neu):
   `npm i --no-save @google/genai @anthropic-ai/sdk @anthropic-ai/vertex-sdk`
2. **Modelle:** `scripts/model-compare/models.example.json` nach `scripts/model-compare/models.local.json` kopieren (git-ignoriert) und Modell-Ids eintragen. Für die Crew zusätzlich:

   ```json
   {
     "crew": "gemini-flash",
     "agents": { "idea-reviewer": "gemini-pro", "bibliothekar": "gemini-pro" },
     "models": [
       { "id": "gemini-flash", "provider": "gemini", "model": "gemini-2.5-flash", "vertex": true, "project": "amelie-agents", "location": "global", "price": { "in": 0.3, "out": 2.5 } },
       { "id": "gemini-pro",   "provider": "gemini", "model": "gemini-2.5-pro",   "vertex": true, "project": "amelie-agents", "location": "global", "price": { "in": 1.25, "out": 10 } }
     ]
   }
   ```

   Modellwahl je Lauf: `--model` → `agents.<agent>` → `crew` → `librarian` → `judge` → erstes Modell. Preise sind Dollar je Million Token und nur für die Kostenzeile; **bitte gegen die Preisseite des Anbieters prüfen**, sie stehen hier als Beispiel.
3. **Zugang:** Vertex AI über `gcloud auth application-default login` (Projekt `amelie-agents`), oder `GEMINI_API_KEY`, oder `ANTHROPIC_API_KEY`.
4. **Websuche:** Die Agenten suchen über den Suchdienst des Schwesterprojekts (Gratis-Kontingent). `AMELIE_LAB=/pfad/zum/lab-repo` setzen, wenn das Lab nicht als `../Amelie-lab` daneben liegt (es braucht dort `.venv` und `agents/search_service.py`). Ohne Lab nimmt das Kit die Suche des Anbieters (`--search` erzwingt das).

---

## 3. Die Crew

| Agent | Rolle | Auftrag | Liefert (Vertrag) | Schreibweg (nur mit `--write`) |
|---|---|---|---|---|
| `ideen-scout` | Engine 1: Ideen aus Primärquellen, Existenzprüfung | `--thema` | `candidates` | nichts |
| `bisoziations-kollider` | Engine 2: Rahmen A × fernen Rahmen B | `--thema` | `candidates` | Abschnitt in `06-suche/amelie-bisoziation-log.md` |
| `inversions-agent` | Engine 3: reguliertes System invertieren | `--thema` | `candidates` | Abschnitt in `06-suche/amelie-inversions-log.md` |
| `idea-reviewer` | 8 Vektoren, Triage-Urteil | `--input <Engine-Läufe>` | `reviews` | Abschnitt in `06-suche/amelie-classification-log.md` |
| `bibliothekar` | bucht ins Gedächtnis | `--input <Engines + Reviewer>` | `librarian` | `bib apply` (Akteur `cli-bibliothekar`) + Retro im Suchplaybook |

Nicht von der Kommandozeile (bleiben Claude-Code-Subagenten, weil sie Code und Dossiers bauen): `dose-packer`, `demo-builder`, `venture-analyst`.

**Werkzeuge** aller Crew-Agenten (aus `scripts/agent-kit.mjs`, alle nur lesend): `read_file`, `search_repo`, `run_cli` (Lesebefehle von `bib` und `quellen`), `web_fetch`, `web_search`, `list_skills`/`load_skill`. Welche ein Agent bekommt, folgt aus dem `tools:`-Feld seiner Definition; `Edit`/`Write` entfallen immer. Der Bibliothekar hat zusätzlich `plan_check` (Trockenlauf seines Entwurfs gegen das echte Gedächtnis).

---

## 4. `npm run agent` — alle Befehle

```
npm run agent -- list                               Agenten, Rollen, Schreibwege
npm run agent -- <agent> [Auftrag] [Optionen]       einen Agenten laufen lassen
npm run agent -- runs [--agent <name>] [--json]     Läufe auflisten (neueste zuerst)
npm run agent -- show <run> [--json]                einen Lauf zeigen (run_id, Pfad oder latest:<agent>)
npm run agent -- merge <run> <run> … [--json]       Ergebnisse mehrerer Läufe zusammenlegen (ohne Modell)
npm run agent -- write <run> [--dry-run]            Schreibweg eines früheren Laufs ausführen (nach Durchsicht)
```

**Auftrag** (einer davon, `--input` kombinierbar):

| Option | Bedeutung |
|---|---|
| `--thema "<Thema>"` | Standardauftrag des Agenten (Engines: Pflichtlektüre → Quelle → Kandidaten → `bib find` → Suche, Empfänger zuerst) |
| `--task "<Text>"` / `--task-file <Datei>` | eigener Auftrag; bei Reviewer und Bibliothekar wird er vor die Eingänge gesetzt |
| `--input <run>` | Ergebnis eines früheren Laufs (mehrfach). `run` ist eine run_id, ein Pfad zu einer `.json` oder `latest:<agent>`. Nur Läufe mit Status `ok` zählen. |

**Optionen:**

| Option | Bedeutung |
|---|---|
| `--model <id>` | Modell aus `models.local.json` |
| `--mock` | feste Antwort ohne Netz und Kosten; prüft die Kette. Mock-Läufe schreiben **nie** ins Gedächtnis |
| `--max-turns <n>` | Werkzeugrunden (Standard 20) |
| `--search` | Websuche des Anbieters statt Lab-Suchdienst |
| `--no-repair` | keinen Reparaturaufruf bei Vertragsfehlern |
| `--write` | nach einem `ok`-Lauf den Schreibweg ausführen |
| `--dry-write` | Schreibweg nur zeigen bzw. per Trockenlauf prüfen |
| `--json` | Laufdatensatz als JSON auf stdout (für Skripte); sonst der Bericht |
| `--runs-dir <Pfad>` | anderes Laufverzeichnis (Standard `06-suche/agent-runs`, oder Umgebungsvariable `AMELIE_RUNS`) |

**Ausgabekanäle:** stdout = Bericht oder (mit `--json`) Datensatz. stderr = Fortschritt, Fehler, Verbrauch und als letzte Zeile `[<agent>] run_id=… datei=…`. So lässt sich stdout umleiten, ohne den Fortschritt zu verlieren.

**Exit-Codes:**

| Code | Bedeutung | Was tun |
|---|---|---|
| 0 | ok (und, falls verlangt, geschrieben) | weiter |
| 1 | Aufruf falsch (Agent, Auftrag, Eingang, Modell) | Meldung auf stderr lesen |
| 3 | Lauf unvollständig: Modellfehler, leere Antwort oder Vertrag auch nach Reparatur gebrochen | `show <run>` zeigt `errors`; Modell wechseln oder wiederholen. Der Lauf ist gespeichert, zählt aber nirgends |
| 4 | Schreiben abgelehnt (Lauf nicht ok, schon geschrieben, Mock, `bib apply` verweigert) | Meldung lesen; bei `bib apply` steht `{code, field, message}` im Datensatz unter `writes` |

---

## 5. `npm run teamrunde`

```
npm run teamrunde -- "<Thema>" [--model <id>] [--mock] [--write] [--engines "ideen-scout inversions-agent"] [--runs-dir <Pfad>]
```

Ablauf (`scripts/crew/teamrunde.sh`): **0** `bib vorflug` → **1** Engines parallel → **2** `merge` → **3** Reviewer (entfällt, wenn alle Ideen besetzt sind) → **4** Bibliothekar → **5** ohne `--write`: Liste der `write`-Befehle zum Buchen nach Durchsicht; mit `--write`: Bibliothekar bucht, Logs der Engines und des Reviewers, `bib abschluss`.

Die **letzte Zeile auf stdout** ist JSON, alles andere steht auf stderr:

```json
{"thema":"Holz","engines":["ideen-scout-…","bisoziations-kollider-…","inversions-agent-…"],"reviewer":"idea-reviewer-…","bibliothekar":"bibliothekar-…","written":false,"workdir":"/tmp/teamrunde-…"}
```

Exit: 0 gelaufen · 1 Aufruf falsch · 3 keine Engine gültig oder ein Schritt brach ab · 4 Schreiben abgelehnt. Im `workdir` liegen die stdout/stderr jedes Schritts.

---

## 6. Was ein Lauf hinterlässt

`06-suche/agent-runs/<agent>/<run_id>.json` (Datensatz) und `.md` (Bericht), beim Bibliothekar nach `write` zusätzlich `<run_id>.plan.json` (der Plan für `bib apply`). Das Verzeichnis ist git-ignoriert: Laufdateien sind Arbeitsmaterial, ins Gedächtnis kommt nur, was der Bibliothekar bucht.

| Feld | Inhalt |
|---|---|
| `run_id` | `<agent>-<JJJJMMTTThhmmss>-<6 hex>` |
| `status` | `ok` · `contract_failed` · `empty` · `error` |
| `model` | `{id, provider, model}` |
| `thema`, `task`, `inputs` | Auftrag und die run_ids der Eingänge |
| `report` | Bericht des Agenten (Markdown, mit JSON-Block am Ende) |
| `data` | der geprüfte JSON-Block (siehe §7) |
| `errors`, `repaired` | Vertragsfehler; ob ein Reparaturaufruf nötig war |
| `usage`, `cost_usd` | Token ein/aus, Runden, Suchen; geschätzte Kosten (nur mit `price`) |
| `toolLog` | jeder Werkzeugaufruf mit Argumenten und gekürztem Ergebnis |
| `writes` | ausgeführte oder trocken geprüfte Schreibvorgänge (`append` mit Datei, `bib-apply` mit Plan, Exit und Ergebnis) |
| `summary` | eine Zeile für `runs` |

---

## 7. Datenverträge

Jeder Agent beendet seinen Bericht mit **genau einem** ` ```json `-Block. `scripts/crew/contracts.mjs` prüft ihn (Form, erlaubte Werte, Regeln). Bei Fehlern bekommt das Modell die Fehlerliste für **einen** Reparaturaufruf ohne Werkzeuge (keine neuen Suchen, keine neuen Fakten). Hält auch die Reparatur nicht, ist der Lauf `contract_failed` (Exit 3) und wird nicht weitergereicht. Vorbild ist der Schema-Validator im Lab.

**`candidates`** (Engines): `candidates[]` mit `id` (Kurzname), `title`, `beschreibung`, `quelle`, `empfaenger`, `urteil` (frei · verengt · unklar · besetzt), `beleg`, `evidenz` (seite · schnipsel), `restluecke`, `urls`; dazu `gelernt`, `naechstesMal`, `quellenmeldung` (Zeilen im Format von `amelie-quellen-register.md`). Regeln: `frei` nur mit `seite`; `verengt` nur mit Restlücke; keine doppelten ids.

**`reviews`** (Reviewer): `reviews[]` mit `id`, `title`, `vectors` (V1–V8, je 1–5), `kern` (= Summe V1–V7), `gesamt` (= kern + V8), `triage`, `begruendung`; je nach Triage `gegenSuche` + `dose` (Dose Ready, nur ab 24/35), `market` (Market Route), `baustein`, `grab` mit `cause`/`killer`/`foundBy`/`resurrectIfDe`/`resurrectIfEn` (Friedhof, Werte aus `src/types.ts`); dazu `lehren`.

**`librarian`** (Bibliothekar): `runde` (Abschnittstitel), `einleitung`, `protokoll[]` (Felder von `protokoll.add`), `graeber[]` (vollständige Totenscheine), `quellenmeldung[]`, `retro` (`erledigt`, `gelernt`, `fehler`, `naechstesMal`, `atlas`), `offen`. Zusätzlich zur Form muss der daraus gebaute Plan den **Trockenlauf von `bib apply`** bestehen; sonst gehen die Fehler von `bib` in den Reparaturaufruf.

---

## 8. Wie geschrieben wird (und wie nicht)

- **Das Modell schreibt nie.** Alle Werkzeuge lesen nur. Nach einem geprüften Lauf schreibt das Programm, und nur auf dem einen Weg, den die Definition des Agenten erlaubt (Tabelle §3).
- **Nur mit Freigabe:** `--write` beim Lauf oder später `npm run agent -- write <run>`. `--dry-write` / `write --dry-run` zeigen vorher, was passiert.
- **Nur einmal je Lauf**, nur bei Status `ok`, nie aus einem Mock-Lauf.
- **Logs:** neuer Abschnitt am Dateiende (Kopf mit run_id, Modell und Eingängen, Tabelle, Bericht). Bestehender Text wird nie geändert.
- **Gedächtnis:** nur der Bibliothekar, nur über `bib apply` als Akteur `cli-bibliothekar` (Rechte in `06-suche/bib-actors.json`: `protokoll.add`, `grave.add`, `source.add`, `source.log`, `terminology.add`, `question.add`; kein `vector.set`, kein `source.rate`). Alles oder nichts, idempotent über den Ledger (Plan-Id `crew-<run_id>`), mit Audit-Log und Sperre. Danach hängt er die Retro als Abschnitt ans Suchplaybook.
- Nach dem Buchen: `npm run bib -- abschluss` (export:data → lint → test), dann commit und push.

---

## 9. Automatisieren: Beispiele

**Ein Agent, Ergebnis weiterverarbeiten:**

```bash
id=$(npm run -s agent -- ideen-scout --thema "Glasanflug" --json 2>/dev/null | node -p 'JSON.parse(require("fs").readFileSync(0,"utf8")).run_id')
npm run -s agent -- show "$id" --json | node -p 'JSON.parse(require("fs").readFileSync(0,"utf8")).data.candidates.filter(c=>c.urteil!=="besetzt").map(c=>c.id).join("\n")'
```

**Eigene Kette mit Abbruch bei Fehlern:**

```bash
set -e
s=$(npm run -s agent -- ideen-scout --thema "$THEMA" --json | node -p 'JSON.parse(require("fs").readFileSync(0,"utf8")).run_id')
i=$(npm run -s agent -- inversions-agent --thema "$THEMA" --json | node -p 'JSON.parse(require("fs").readFileSync(0,"utf8")).run_id')
r=$(npm run -s agent -- idea-reviewer --input "$s" --input "$i" --json | node -p 'JSON.parse(require("fs").readFileSync(0,"utf8")).run_id')
npm run -s agent -- bibliothekar --input "$s" --input "$i" --input "$r" --thema "$THEMA" --dry-write
```

**Nachts eine Runde, morgens durchsehen (crontab):**

```cron
15 2 * * 1-5  cd /home/felix/amelie/amelie && PATH=/home/felix/.nvm/versions/node/v26.3.1/bin:$PATH npm run -s teamrunde -- "$(sed -n 1p 06-suche/themen-warteschlange.txt)" --model gemini-flash >> /tmp/teamrunde.jsonl 2>> /tmp/teamrunde.log
```

Ohne `--write` bucht die Nacht nichts; morgens `npm run agent -- runs` und `write <bibliothekar-run>`. (`themen-warteschlange.txt` ist ein Beispiel, die Datei gibt es nicht.)

**Exit-Codes auswerten:**

```bash
npm run -s agent -- idea-reviewer --input latest:ideen-scout --json > rev.json
case $? in 0) echo ok ;; 3) echo "unvollständig: $(node -p 'require("./rev.json").errors.join("; ")')" ;; *) echo "Aufruf prüfen" ;; esac
```

---

## 10. Was kostet was

| Weg | Kosten | Wofür |
|---|---|---|
| `npm run bib -- …`, `lint`, `test`, `export:data` | 0 | Gedächtnis lesen, Drift-Guards, Tests |
| `npm run lab -- list \| review <pr> --no-agent` | 0 | Lab-PR maschinell prüfen |
| `npm run agent -- … --mock`, `npm run teamrunde -- … --mock` | 0 | Kette prüfen |
| `npm run agent -- <agent> …` (Gemini über Vertex AI) | Guthaben des Labs, etwa 0,01 bis 0,30 USD je Lauf (Schätzung aus dem Lab, nicht die Rechnung) | ein Agent |
| `npm run teamrunde -- …` | etwa die Summe von fünf Läufen | eine Runde |
| Lab-Suchdienst | 5000 Suchen im Monat gratis, danach 14 USD je 1000 | Websuche der Agenten |
| Claude-Code-Subagenten (`.claude/agents`) | Claude-Credits | Packer, Demo-Builder, Venture; alles, was Code baut |

Stand im Lab (`runner.py --costs`, Schätzung): 250 USD Guthaben, 3,26 USD ausgegeben, 37 Läufe, im Mittel 0,09 USD je Lauf. **Nicht geprüft:** Preise gegen die Cloud Console, Abo-Grenzen von Google- und Claude-Konten.

---

## 11. Lehren aus den ersten Läufen

- **Gemini lässt Anbieter-Suche und Funktionswerkzeuge nicht zusammen zu.** Mit eingeschalteter Anbieter-Suche wurden die Werkzeuge ignoriert. Das Kit schaltet die Anbieter-Suche ab, sobald der Lab-Suchdienst da ist.
- **Flash liefert ohne Werkzeugzwang leere Hüllen.** Deshalb nennt jeder Standardauftrag die Werkzeugreihenfolge, und die Betriebsart sagt: ein Urteil ohne Werkzeugaufruf ist kein Urteil. `toolLog` im Datensatz zeigt, ob der Agent wirklich gearbeitet hat.
- **„frei“ auf Schnipseln ist kein Urteil** (der Vertrag lehnt es ab). Urteile der Agentenläufe sind Hinweise, bis der Bibliothekar sie bucht.
- Lab-Läufe nachliefern (im Lab-Repo): `.venv/bin/python -m bridge.librarian_pr --status`; Vorschläge unter `06-suche/proposals/` prüft `npm run lab`.

**Nicht live getestet (Stand dieses Blatts):** die Crew-Befehle sind mit geskripteten Modellen und `--mock` getestet (`src/utils/crew.test.ts`); der Gemini-Adapter ist am 30.09.2026 über `npm run lab` live gelaufen, die Crew selbst noch nicht. Erster echter Lauf: ein Agent mit `--dry-write`, `show` lesen, dann erst `write`.

---

## 12. Vorbereitung auf die Datenbank (macht eine andere Sitzung)

Heute ist das Gedächtnis Dateien; die Datenbank soll sie abbilden, nicht ersetzen, bis sie trägt.

| Entität | Quelle der Wahrheit heute | Schlüssel |
|---|---|---|
| Gräber | `src/data/graeber.json` | `id` |
| Quellen | `src/data/quellen.json` (`quellen`, `typen`, `katalog`) | `id` |
| Dosen-Vektoren | `src/data/doseVectors.json` | Dosen-`id` |
| Kandidaten-Vektoren | `src/data/candidateVectors.json` | Kandidaten-`id` |
| Prüfprotokoll | `06-suche/amelie-pruefprotokoll.md` (Zeilen, kein Schema) | keiner, nur Titel und Id im Text |
| Crew-Läufe | `06-suche/agent-runs/<agent>/<run_id>.json` (lokal, git-ignoriert) | `run_id` |
| Lab-Läufe | `Amelie-lab/results/{inversion,lacunar}/<run_id>.json` | `run_id` |
| Lab-Vorschläge | `06-suche/proposals/<plan_id>.md` + `.manifest.json` | `plan_id`, `run_id` |
| Schreibvorgänge | `06-suche/bib-audit.jsonl`, `bib-ledger.json` | Ledger-`key` |

Aktuelle Mengen: `npm run bib -- status`.

**Regeln für die Brücke:** Ein Schreibweg (`bib apply`); die Datenbank liest das Audit-Log als Änderungsstrom oder wird von `bib apply` als zweites Ziel bedient. Das Prüfprotokoll braucht zuerst stabile Ids (`bib protokoll show --json` als Ausgangspunkt). Herkunft mitführen (run_id, Modell, Suchfragen, geholte Seiten — die Crew-Datensätze haben `toolLog` dafür). **Offen für Félix:** Ort der Datenbank, öffentlich lesbar oder nicht (`ventures/` darf nie hinein), Rohläufe ja/nein.

Code: `scripts/agent-run.mjs` (CLI), `scripts/crew/` (crew, contracts, profiles, runs, write, librarian, merge, teamrunde.sh), `scripts/agent-kit.mjs` (Werkzeuge). Tests: `src/utils/crew.test.ts`.
