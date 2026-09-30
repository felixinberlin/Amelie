# Austauschprotokoll Amélie ↔ Amélie-lab (Entwurf v0.1, 30.09.2026)

**Status: Entwurf, noch nicht vom Lab gegengeprüft.** Erster Vorschlag der Amélie-Seite nach den PRs #171 und #172. Wo dieses Blatt und der Code (`bib schema`, `06-suche/bib-actors.json`) sich widersprechen, gilt der Code; dann Blatt nachziehen. Offene Punkte stehen am Ende.

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

Regeln: `files` ⊆ `06-suche/proposals/`; `existence_check` gleich der Pflichtzeile im PR-Text; `touches_memory` ist `false`; `survivors.status` bleibt `ungeprueft`, solange Amélie nicht geprüft hat.

## 4. Namen und Schlüssel

- `plan_id` = `lab-<YYYY-MM-DD>-<engine>-<run-id>[-<art>]`, Zeichen `[A-Za-z0-9._-]`, höchstens 128. `<art>` z. B. `source`, `grave`, `log`. Nie für anderen Inhalt wiederverwenden; ändert sich der Inhalt, gibt es eine neue `plan_id`.
- Ledger-Schlüssel = `plan_id` (Standard von `bib apply`); ein zweiter Lauf desselben Schlüssels ist harmlos (`already_applied`, Exit 0).
- `runde` ist je Lauf stabil und in allen Plänen desselben Laufs gleich.
- Quellen-`id`: `host-thema` (kurz, sprechend, kein Titel-Slug). `enthaelt`: ein eigener Satz zum Inhalt, kein Snippet, kein „…".
- Sprache der Log-Zeilen und Befunde: Deutsch.

## 5. Rechte (technisch in `06-suche/bib-actors.json`)

| Op | `lab-librarian` | Vermerk |
|---|---|---|
| `source.log` | ja | Standardfall bei Host-/Pfadtreffer |
| `source.add` | nur mit `human_accepted: true` | nur bei neuem Host oder Pfad; Lab setzt das Feld nie |
| `grave.add` | ja (technisch) | **Konvention: nur als Vorschlag im `.md`, nicht anwenden** (siehe offene Punkte) |
| `protokoll.add` | nur mit `human_accepted: true` | Urteile sind Amélies |

Das Lab kopiert Werte nicht, sondern liest `npm run bib -- schema`. Neue Ops oder Rechte sind ein Commit hier.

## 6. Vor dem Lauf (Lab)

1. `bib find --stamm <Begriffe>` gegen Prüfprotokoll, Gräber und Dosen; Treffer im Vorschlag nennen.
2. `bib quellen match --url <url>` je Quelle: Host-/Pfadtreffer → `source.log`, sonst `source.add`.
3. Die Such-Obergrenze bleibt ein Wunsch; Überschreitung als „vom Lab gezählt" melden.

## 7. Prüfkette hier (Bibliothekar, automatisierbar)

1. Diff-Umfang: nur `06-suche/proposals/`, nur neue Dateien.
2. Manifest lesen: Felder vollständig, Regeln aus §3.
3. Worktree im Scratchpad, `npm run lint` und `npm test` einzeln (nicht `bib abschluss`).
4. `bib apply --dry-run --json` je Plan; ohne `human_accepted` erwartet Exit 12 bei `source.add`.
5. `quellen match --url` und `bib find --stamm` je Vorschlag; Duplikate benennen.
6. Kein Urteil, kein Grab, keine Quelle wird aus einem Vorschlag automatisch gebucht.
7. Bericht mit Merge-Empfehlung; Merge; Antwort als PR-Kommentar (Standardkanal).

## 8. Danach (Amélie)

Existenzprüfung nur, wenn Félix oder der Orchestrator eine Runde ansetzt (`ideen-scout`, dann `bibliothekar`). Ein Lab-Lauf zählt in „Distance yield" erst mit, wenn mindestens ein Survivor ein Amélie-Urteil hat; vorher Fußnote. Vom Lab brauchen wir dafür die Suchfragen und den Ablageort der Rohantworten.

## 9. Kanäle

PR-Kommentar ist Standard (versioniert, verlinkbar, automatisierbar). Direktnachrichten zwischen den Sitzungen nur für Rückfragen. Beschlüsse, die Regeln ändern, wandern in dieses Blatt, `amelie-bibliothek-cli.md` oder `bib-actors.json`, nicht nur in einen Kommentar.

## 10. Offene Punkte

1. **Manifest:** Feldnamen und `manifest_version` vom Lab bestätigen lassen; danach Prüfer bauen (`check:lab-pr` o. ä.).
2. **`grave.add` für `lab-librarian`:** technisch ohne `human_accepted` erlaubt, obwohl Lab-Gräber nur Vorschläge sein sollen. Entscheidung Félix: Recht an `human_accepted` binden?
3. **`bib quellen import`** prüft die Rechte-Datei nicht; das Lab soll `bib apply` nutzen (bekannte Lücke, keine technische Sperre).
4. **Requests 1/2 aus `Amelie-lab/docs/bib-lab-requests.md`:** `--no-export` sinnvoll; `proposal.add` nicht nötig; `terminology.add`/`question.add` erst, wenn Amélie Speicher dafür führen will (Entscheidung Félix); `dossier.annotate` nicht.
5. **Vorab-Prüfung `bib find --stamm` im Lab-Lauf** verbindlich machen (Lab bestätigt Machbarkeit).
6. **Rückmeldung des Labs:** wo hakt der Weg (Formate, Rechte, Wartezeit)?

Änderungen an diesem Blatt: als PR/Commit hier, Gegenprüfung durch das Lab per PR-Kommentar.
