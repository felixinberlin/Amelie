---
name: amelie-ideenrunde
description: Runs a research round for Amélie, Félix' practice of finding app ideas that only became possible through recent AI and giving them away to the right people instead of building them. Finds new ideas from primary sources, checks whether each already exists, records verdicts, and updates the round's memory files so every round searches better than the last. Use this skill whenever the user asks to find, check, or keep finding new ideas ("keep on finding new ideas", "neue Ideen", "gibt es das schon?", "prüf diese Idee", "nächste Runde"), asks how the search can improve, or mentions Amélie, Dosen, Prüfprotokoll, Besetzungsatlas or Ideen verschenken — even if they don't say "round" or "skill".
---

# Amélie — Ideenrunde

Eine Runde findet Ideen, prüft sie gegen das, was es schon gibt, und hinterlässt bessere Werkzeuge für die nächste Runde.

## Warum diese Skill so gebaut ist

Claude hat zwischen Chats kein Gedächtnis. Lernen passiert nur, wenn jede Runde **liest**, was die letzte hinterlassen hat, und **schreibt**, was sie gelernt hat. Deshalb trennt diese Skill zwei Dinge:

- **Methode** (stabil) — steht hier und in `references/`. Ändert sich selten, und nur über einen Skill-Patch (Schritt 7).
- **Zustand** (wächst jede Runde) — steht in vier Projektdateien. Wird jede Runde gelesen und neu ausgegeben.

| Zustandsdatei | Inhalt |
|---|---|
| `amelie-pruefprotokoll.md` | jede je geprüfte Idee mit Urteil, Beleg, Prüfdatum |
| `amelie-suchplaybook.md` | Besetzungsatlas, Trefferquote, Retro pro Runde |
| `amelie-quellen.md` | Primärquellen mit Status (offen → erschöpft) |
| `08-friedhof/README.md` + `DISCARDED_DATA` | jede tote Idee mit Totenschein (Ursache, Killer, Fundweg, Herkunft, Stadium) und die Muster darüber |

Die Dateien liegen im Repo unter `06-suche/` (`amelie-pruefprotokoll.md`, `amelie-suchplaybook.md`, `amelie-quellen.md`) bzw. `08-friedhof/`. Fehlt eine, die Fassung aus `assets/` nehmen und das dem Nutzer in einem Satz sagen.

*[Claude-Code-Anpassung: Diese Skill wurde ursprünglich für ein Claude.ai-Projekt gebaut (`/mnt/project/`, `present_files`). Für den Einsatz in Claude Code wurden die Pfade in diesem installierten Exemplar auf die echten Repo-Pfade umgestellt; das Original-`.skill`-Paket bleibt unverändert. Details: `references/skill-update.md`.]*

## Ablauf

### 1 · Zustand lesen

Alle vier Zustandsdateien lesen, bevor irgendetwas gesucht wird. Aus dem Playbook zuerst die **letzte Retro**: Deren „Nächstes Mal"-Punkt ist die erste Aufgabe dieser Runde.

### 2 · Fälliges nachprüfen

Zeilen im Protokoll mit erreichtem „Prüfen ab" und alle `unklar`-Zeilen zuerst erneut prüfen. Das ist billig und verhindert, dass alte Urteile still veralten.

### 3 · Ideen aus Quellen ableiten, nicht erfinden

Eine `offen`-Quelle aus `amelie-quellen.md` wählen (Typ A oder B bevorzugt) und dort nach den Mustern aus `references/suchmethode.md` graben. In Runde 2 kamen alle drei Überlebenden aus Primärquellen und null aus freiem Brainstorming.

Wenn der Nutzer selbst eine Idee mitbringt: die direkt prüfen, Schritt 3 überspringen.

### 4 · Vorfilter

Jede Idee zuerst gegen das Protokoll (schon geprüft?) und den Besetzungsatlas im Playbook (Feld `dicht`?) halten. Treffer → ohne Suche protokollieren als `besetzt (Atlas)` bzw. mit Verweis auf die alte Zeile. Suchen sind für echte Unsicherheit da.

### 5 · Prüfen

Pro Idee höchstens vier Suchen, in der Reihenfolge aus `references/suchmethode.md` — **der wahrscheinliche Empfänger zuerst**. Urteil sofort mit Beleg festhalten:

- `frei` — nichts Vergleichbares gefunden
- `verengt` — gibt es halb; die Restlücke in einem Satz benennen
- `unklar` — Suche lieferte nur Rauschen; beim nächsten Mal anders suchen
- `besetzt` — ein Treffer deckt die Idee ab, ≤ 12 Monate alt

Zielgröße: 8–12 geprüfte Ideen. Mehr wird Sammeln statt Prüfen.

### 6 · Zustand schreiben

Alle geänderten Zustandsdateien **vollständig** aktualisieren. Konkret:

- Protokoll: neuer Rundenabschnitt, eine Zeile pro Idee.
- Quellen: Status der benutzten Quellen.
- Playbook: Trefferquote-Zeile, neue dichte/freie Felder im Atlas, **Retro** mit *gelernt / Fehler / nächstes Mal*. Mindestens ein konkreter „Nächstes Mal"-Punkt — ohne ihn lernt die nächste Runde nichts.

Dateien direkt im Repo unter `06-suche/` bzw. `08-friedhof/` bearbeiten (dies ist ein Git-Repo; Änderungen in place, kein Commit ohne Aufforderung).

### 7 · Methode verbessern (nur wenn verdient)

Hat die Runde etwas über die **Methode** gelernt, das in drei Runden noch stimmt (ein neues Suchmuster, eine Stoppregel, ein Quellentyp), dann `references/suchmethode.md` bzw. diese SKILL.md direkt in `.claude/skills/amelie-ideenrunde/` anpassen (siehe `references/skill-update.md`). Rundenspezifisches gehört in die Zustandsdateien, nicht in die Skill.

### 8 · Antwort

Kurz, auf Deutsch, locker (Félix mischt Spanisch/Englisch, das darf zurückkommen):

1. Überlebende Ideen mit je einem Satz: was, für wen, welcher Beleg.
2. Die überraschendsten Kills (höchstens zwei).
3. Was die Suche gelernt hat (aus der Retro).
4. **Loop-Check:** Liegt eine sendebereite Dose unzugestellt? Dann das einmal sagen. Das Manifest warnt: Sammeln fühlt sich produktiv an und ersetzt das Zustellen nicht.

Kein Packen von Dosen in derselben Runde, außer der Nutzer bittet darum — Format dann in `references/dose-format.md`.

## Woran man merkt, dass es wirkt

Die Trefferquote (`frei` + `verengt`) steigt über die Runden, Kills per Atlas nehmen zu, keine Idee taucht doppelt auf, „Nächstes Mal"-Punkte werden erledigt. Bleibt die Quote um 20 %, stimmt die Quellenwahl nicht — dann das in der Retro benennen, statt mehr Ideen zu prüfen.

## Referenzen

- `references/suchmethode.md` — Suchreihenfolge, Rezepte, Stoppregeln, Quellentypen. **Vor Schritt 3 lesen.**
- `references/dose-format.md` — Einseiter-Format, nur wenn eine Dose gepackt wird.
- `references/skill-update.md` — wie Schritt 7 paketiert.
- `assets/` — Zustandsdateien mit Stand Runde 2 (16.09.2026), als Startpunkt, falls im Projekt eine fehlt. Die Projektversion ist immer die aktuellere.
