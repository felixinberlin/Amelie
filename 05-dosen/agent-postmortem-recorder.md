---
status: Available
delivery_method: E-Mail
target_maker: claude-reflect
---
# Agent Postmortem Recorder

**Ein Satz:** Nicht ein weiteres Dashboard über Agent-Sessions, sondern die Konsequenz daraus: die `CLAUDE.md`-Zeile, die fehlt, und die Zeile, die dasteht und nachweislich nicht wirkt.

**Stand:** 24. September 2026 (Nachprüfung) · **Prüfen ab:** März 2027 (schnelllebiges Feld)
**Empfänger:** **claude-reflect** (Bayram Annakov), als Pull Request · nachrangig: claude-doctor, RuleReceipt
**Verdikt:** 🎁 **verschenken, nicht neu bauen**. Der Patch liegt in der Dose: `07-demos/agent-postmortem-recorder/claude-reflect-recurrence.patch`. Auf einem frischen Klon laufen 340 Tests grün.

---

## Das Problem

Wer Agents ernsthaft nutzt, sammelt Frust in Form von Wiederholungen: derselbe falsch verstandene Auftrag, dieselbe Konvention, die nicht sitzt. Die Information darüber liegt vollständig in den Session-Logs, sie wird nur nie zu einer Änderung. Und wenn doch, bläht jede neue Regel die Instruktionsdatei auf. Niemand sagt, welche Regel schon dasteht und trotzdem nicht wirkt.

## Warum das jetzt geht

1. **Die Logs sind strukturiert und lokal.** Hook-Events, Transkripte und die Korrektur-Queue von claude-reflect liegen maschinenlesbar vor.
2. **„Diese vier Korrekturen sind dieselbe" ist billig geworden.** Früher war das Handarbeit, heute reicht Clustering über eine Queue von 100 Einträgen.
3. **Ein Diff ist anwendbar, ein Bericht nicht.**

## Skizze (so im Patch umgesetzt)

- **Nach Wiederkehr ordnen.** Queue-Einträge, die dasselbe sagen, werden gruppiert, die wiederkehrenden kommen zuerst: „×4 über 4 Tage [unipile]". Einmal-Umlenkungen landen unten. Das setzt das **eigene Backlog #1** von claude-reflect um.
- **„Aufgeschrieben, trotzdem korrigiert."** Eine wiederkehrende Gruppe, die einer bestehenden `CLAUDE.md`-Zeile entspricht, gilt heute als Duplikat, und das Tool bietet an, sie zu überspringen. Tatsächlich ist sie der Beleg, dass die Regel nicht wirkt: umschreiben, verschieben oder zum Hook machen. Das ist die Löschseite dieser Dose, belegt statt geraten.
- **Den Hook so testen, wie Claude Code ihn aufruft.** Das ist Backlog #3: Die CI hat den Schreibpfad nie ausgeführt.

**Nicht dabei:** keine neuen Regex-Muster, keine automatischen Löschungen, kein Replay-Test, keine Telemetrie. Nur lesen, nur die Standardbibliothek.

## Erster Schritt

**Ticket:** Repo forken, Patch anwenden, Pull Request mit dem Text unten öffnen.
**Fertig, wenn:** die CI auf allen drei Plattformen grün ist, auch auf `windows-latest`, das hier nicht getestet werden konnte.

## Wo es kippt

**Wortbasiert, nicht bedeutungsbasiert.** Zweiergruppen sind manchmal Zufall („smaller", „api"). Der Patch ordnet nur, er verwirft nichts. Der Parameter `similarity_fn` erlaubt es, später die semantische Schicht einzuhängen, die das Repo schon hat.

**Korrelation statt Ursache.** Die Korrekturen können älter sein als die Regel. Der Bericht zeigt deshalb das erste und das letzte Datum, und der Mensch entscheidet.

## Wer es schon versucht hat

Die Präskriptions-Hälfte ist **besetzt**, anders als die erste Fassung behauptete. [claude-reflect](https://github.com/BayramAnnakov/claude-reflect) (~1,6k ★) erfasst Korrekturen und schreibt sie nach Freigabe in CLAUDE.md, Regeldateien, Skills und AGENTS.md. [claude-doctor](https://github.com/millionco/claude-doctor) erzeugt Regeln aus Transkripten, [claude-learn](https://github.com/OutcomefocusAi/claude-learn) bewertet Regeln und lässt sie verfallen, [RuleReceipt](https://dev.to/rulereceipt/i-measured-whether-claude-code-actually-follows-my-claudemd-25ao) prüft, ob Regeln befolgt werden. Offen war nur, was das Backlog von claude-reflect selbst misst. Die Details stehen im Buch zur Dose (`02-recherche/agent-postmortem-recorder-nachpruefung-2026-09-24.md`).

---

## Beispiel-PR, als Mail geschrieben

> **An:** Bayram Annakov, als Pull Request auf github.com/BayramAnnakov/claude-reflect
> **Betreff:** Rank /reflect queue by recurrence (BACKLOG #1) + end-to-end hook test (BACKLOG #3)
>
> Hi Bayram,
>
> your BACKLOG.md is the best issue tracker I've read this year: everything in it is measured, and each item says what it costs to leave it. So this PR does two things from it and adds nothing of mine.
>
> **#1: recurrence ranking.** `scripts/rank_queue.py` groups queue items that say the same thing and shows the recurring ones first. Your unipile case, four wordings across three months among eight one-offs, comes out as `×4 over 4 day(s) [unipile]`, with the rest collapsed under "8 one-off items, review last". It is stdlib only and read-only (it uses `load_queue_at`, so no migrations run), and it adds no new regex, in line with #2.
>
> One more signal came out of it at no extra cost: a recurring cluster that already matches a CLAUDE.md entry. Step 4 currently offers "skip" there. I think that is backwards. If the rule is written down and the user keeps correcting the same thing, the entry isn't working. The report flags it as "already written down, still corrected ×4: rewrite, move, or make it a hook?", with first and last dates, because the corrections may be older than the entry.
>
> **#3: end-to-end hook test.** `tests/test_hook_e2e.py` sends real corrections through `capture_learning.py` as a subprocess, with a throwaway HOME and the platform's default codepage. It runs inside the existing pytest step, so the workflow doesn't change. I could only run it on Linux. The Windows runner is where it matters.
>
> In numbers: 4 new files, 567 lines, no edits to existing files, and 322 → 340 tests passing. `/reflect` behaves the same until you add the roughly 10-line "Step 4.5" from the README, or not at all if you'd rather not.
>
> Known limit: it matches words, not meaning, so some pairs are coincidences. It only reorders the queue and never drops anything. Things I deliberately left out: replay-testing rules, automatic deletion, "never used" detection (RuleReceipt already covers that), and new regexes.
>
> Happy to change anything or split this into two PRs. You're also welcome to take only the parts you like. No reply owed.
>
> Félix
> Berlin · github.com/felixinberlin

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie. Du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
