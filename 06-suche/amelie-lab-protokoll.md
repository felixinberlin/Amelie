# Austauschprotokoll Amélie ↔ Amélie-lab (Entwurf v0.6, 30.09.2026)

**Status: Entwurf v0.2; das Lab hat v0.1 gegengeprüft** (PR-Kommentar zu #172, Commit `137e7508` im Lab-Repo) und Manifest, Vorab-Prüfung und Namensregeln bestätigt. Erster Vorschlag der Amélie-Seite nach den PRs #171 und #172. Wo dieses Blatt und der Code (`bib schema`, `06-suche/bib-actors.json`) sich widersprechen, gilt der Code; dann Blatt nachziehen. Offene Punkte stehen am Ende.

Ziel: Lab-Läufe kommen als PR an, werden hier ohne Handarbeit geprüft und landen erst nach einer Freigabe im Gedächtnis. Das Lab liefert Vorschläge, Amélie fällt Urteile.

## 1. Rollen

| Seite | Wer | Darf |
|---|---|---|
| Lab | Lab-Sitzung, `lab-librarian` | PR aus dem eigenen Clone eröffnen; nur unter `06-suche/proposals/` schreiben; `bib apply` nur mit den Rechten aus `bib-actors.json` |
| Amélie | Orchestrator (koordiniert), `bibliothekar` (prüft und schreibt das Gedächtnis), `ideen-scout` (Existenzprüfung) | prüfen, mergen, Urteile fällen, Quellen/Gräber/Protokoll buchen |
| Félix | Mensch | `human_accepted` setzen (nur er); Regeländerungen entscheiden |

Das Lab fasst den Live-Checkout hier nie an. Amélie schreibt nichts ins Lab-Repo (nur lesend).

## 2. Was ein Lab-PR enthält

Nur Dateien unter `06-suche/proposals/`, ausschließlich neue Dateien (create-only), pro Lauf:

1. `<plan_id>.md` — Vorschläge für Log-Zeilen (Amélie setzt sie ein).
2. `<plan_id>.manifest.json` — maschinenlesbar (siehe §3).
3. optional `<plan_id>-source.json` (Quellen-Plan) — ohne `human_accepted`.

**PR-Text, Pflichtzeile ganz oben:** `Existenzprüfung: ja|nein`. Zusatz: was ist Vorschlag, was ist angewendet (im Lab-Repo angewendete Pläne dürfen nicht wie Änderungen hier klingen).

Nicht im PR: `src/data/`, `05-dosen/`, `08-friedhof/`, `06-suche/amelie-quellen.md`, Prüfprotokoll, Vektoren.

## 3. Manifest (Vorschlag, `manifest_version: 1`)

```json
{
  "manifest_version": 1,
  "run_id": "lacunar-20260930T073557-e87ad6",
  "plan_id": "lab-2026-09-30-lacunar-20260930T073557-e87ad6",
  "engine": "lacunar",
  "model": "gemini-2.5-flash",
  "existence_check": false,
  "survivors": { "count": 3, "status": "ungeprueft" },
  "files": ["06-suche/proposals/lab-2026-09-30-lacunar-20260930T073557-e87ad6.md"],
  "source_ops": [
    { "op": "source.log", "id": "ebms-methoden-tagfalter-transekt", "human_accepted": false, "urls": ["https://…"] }
  ],
  "grave_proposals": 0,
  "touches_memory": false
}
```

`engine` ist `lacunar`, `inversion` oder `review` (Enum im Schema; `inversion` seit v0.3, Lab-Commit `6e3cb27c`). Regeln: `files` ⊆ `06-suche/proposals/`; `existence_check` ist ein boolean, gleich der Pflichtzeile im PR-Text; `files` listet alle Dateien des PR inkl. Manifest; optional `contracts` (Versionen der Lab-Verträge). Das Lab validiert gegen `schemas/lab-manifest.schema.json` (Vertrag `lab-manifest` 1.0.0, Lab-Repo); der Prüfer hier kann es übernehmen; `touches_memory` ist `false`; `survivors.status` bleibt `ungeprueft`, solange Amélie nicht geprüft hat.

## 4. Namen und Schlüssel

- `plan_id` = `lab-<YYYY-MM-DD>-<engine>-<run-id>[-<art>]` (bei `inversion` z. B. `lab-<datum>-inversion-<ts>-<id>`), Zeichen `[A-Za-z0-9._-]`, höchstens 128. `<art>` z. B. `source`, `grave`, `log`. Nie für anderen Inhalt wiederverwenden; ändert sich der Inhalt, gibt es eine neue `plan_id`.
- Ledger-Schlüssel = `plan_id` (Standard von `bib apply`); ein zweiter Lauf desselben Schlüssels ist harmlos (`already_applied`, Exit 0).
- `runde` ist je Lauf stabil und in allen Plänen desselben Laufs gleich.
- Quellen-`id`: `host-thema` (kurz, sprechend, kein Titel-Slug). `enthaelt`: ein eigener Satz zum Inhalt, kein Snippet, kein „…".
- Sprache der Log-Zeilen und Befunde: Deutsch.

## 5. Rechte (technisch in `06-suche/bib-actors.json`)

| Op | `lab-librarian` | Vermerk |
|---|---|---|
| `source.log` | ja | Standardfall bei Host-/Pfadtreffer |
| `source.add` | ja (seit 30.09.2026 ohne `human_accepted`, Entscheidung Félix) | nur bei neuem Host oder Pfad; Konvention: im PR weiter als Vorschlag, Anwenden prüft der Bibliothekar |
| `grave.add` | ja (bleibt erlaubt, Entscheidung Félix 30.09.2026) | Konvention: Lab-Gräber weiter nur als Vorschlag im `.md`; Gräber anwenden tut der Bibliothekar |
| `protokoll.add` | ja (seit 30.09.2026 ohne `human_accepted`, Entscheidung Félix) | Konvention: Urteile fällt weiter Amélie; das Lab schreibt keine Urteile (Existenzprüfung: nein) |
| `terminology.add`, `question.add` | ja (seit 30.09.2026, Entscheidung Félix) | append-only, idempotent |

Das Lab kopiert Werte nicht, sondern liest `npm run bib -- schema`. Neue Ops oder Rechte sind ein Commit hier.

**Grab-Vorschläge:** `origin` nur aus `bib schema` (`ideenliste`, `brainstorm`, `quelle`, `bisoziation`, `inversion`, `modell-katalog`). **`inversion` ist seit 30.09.2026 gültig** (Entscheidung Félix; `Herkunft` in `src/types.ts`). Ältere Inversions-Gräber führen weiter `quelle`, `bisoziation` oder `brainstorm`.

**Inversions-Vorschläge** zielen auf `06-suche/amelie-inversions-log.md` (Tabellenzeile) und `src/data/graeber.json` (nur als Text). Die Retros dort stehen neueste zuerst; maßgeblich ist das „Nächstes Mal" der ersten Retro, die eines hat.

## 6. Vor dem Lauf (Lab)

1. `bib find --stamm <Begriffe>` gegen Prüfprotokoll, Gräber und Dosen; Treffer im Vorschlag nennen.
2. `bib quellen match --url <url>` je Quelle: exakter Treffer, Pfadtreffer oder genau ein Host-Treffer → `source.log`; mehrere Host-Treffer werden aufgelistet, nicht geraten; kein Treffer → `source.add` (`id` `host-thema`, kurzer eigener `enthaelt`).
   Lauf liest Stand aus einem frisch gezogenen Round-Clone (`--round`), nicht aus einem veralteten Live-Checkout.
3. Die Such-Obergrenze bleibt ein Wunsch; Überschreitung als „vom Lab gezählt" melden.

## 7. Prüfkette hier (Bibliothekar, automatisierbar)

Automatisiert: `npm run lab -- review <pr>` (Handbuch `06-suche/amelie-lab-review-cli.md`).

1. Diff-Umfang: nur `06-suche/proposals/`, nur neue Dateien.
2. Manifest lesen: Felder vollständig, Regeln aus §3.
3. Worktree im Scratchpad, `npm run lint` und `npm test` einzeln (nicht `bib abschluss`).
4. `bib apply --dry-run --json` je Plan (Rechte und Regeln prüfen; seit 30.09.2026 ist `source.add` für das Lab technisch erlaubt).
5. `quellen match --url` und `bib find --stamm` je Vorschlag; Duplikate benennen.
6. Kein Urteil, kein Grab, keine Quelle wird aus einem Vorschlag automatisch gebucht.
7. Bericht mit Merge-Empfehlung; Merge; Antwort als PR-Kommentar (Standardkanal) **mit fester Kopfzeile** als Rückkanal für das Lab:
   ```
   Entscheidung: gemergt | teilweise | abgelehnt
   Existenzprüfung: erfolgt | offen
   Gebuchte Quellen: <ids> | keine
   ```
   Darunter Freitext (Befund, Antworten). Beispiel: #172 → `Entscheidung: gemergt` (nur Ablage), `Existenzprüfung: offen`, `Gebuchte Quellen: keine`.

## 8. Danach (Amélie)

Existenzprüfung nur, wenn Félix oder der Orchestrator eine Runde ansetzt (`ideen-scout`, dann `bibliothekar`). Ein Lab-Lauf zählt in „Distance yield" erst mit, wenn mindestens ein Survivor ein Amélie-Urteil hat; vorher Fußnote. Vom Lab brauchen wir dafür die Suchfragen und den Ablageort der Rohantworten.

## 9. Kanäle

PR-Kommentar ist Standard (versioniert, verlinkbar, automatisierbar). Direktnachrichten zwischen den Sitzungen nur für Rückfragen. Beschlüsse, die Regeln ändern, wandern in dieses Blatt, `amelie-bibliothek-cli.md` oder `bib-actors.json`, nicht nur in einen Kommentar.

## 10. Offene Punkte

1. **Manifest:** vom Lab bestätigt (v0.2). Offen bei uns: Prüfer bauen (`check:lab-pr` o. ä.), Lab-Schema `schemas/lab-manifest.schema.json` übernehmen.
2. ~~`grave.add`~~ entschieden: bleibt erlaubt; `human_accepted`-Bindung für `source.add` und `protokoll.add` entfernt (Entscheidung Félix, 30.09.2026). Die Konvention „Lab-PRs sind Vorschläge“ ersetzt jetzt die technische Sperre.
3. **`bib quellen import`** prüft die Rechte-Datei nicht; das Lab soll `bib apply` nutzen (bekannte Lücke, keine technische Sperre).
4. **Requests 1/2 aus `Amelie-lab/docs/bib-lab-requests.md`:** Request 1 `bib apply --no-export` umgesetzt (30.09.2026). Request 2: **Speicher für Terminologie und Fragen wird geführt** (Entscheidung Félix, 30.09.2026), Ops `terminology.add` und `question.add` sind umgesetzt (Format wie im Request; siehe `amelie-bibliothek-cli.md`). Rechte für `lab-librarian` auf `terminology.add`/`question.add` vergeben (Entscheidung Félix, 30.09.2026). `proposal.add` und `dossier.annotate` nicht.
5. ~~Vorab-Prüfung im Lab-Lauf~~ erledigt (Lab, verbindlich eingebaut).
6. **Review-Pfad des Labs** (`write_plan`) schreibt noch außerhalb `proposals/` (Dossiernotizen, Register); bis ein Proposal-only-Modus existiert, öffnet das Lab dafür keinen PR. Lab-Arbeit.
7. **Rückkanal:** Kopfzeile aus §7 ab jetzt in jedem Kommentar; Lab wertet sie aus.

Änderungen an diesem Blatt: als PR/Commit hier, Gegenprüfung durch das Lab per PR-Kommentar.
