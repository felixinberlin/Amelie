# Agent Postmortem Recorder

**Ein Satz:** Nicht ein weiteres Dashboard über Agent-Sessions, sondern die Konsequenz daraus — der konkrete `CLAUDE.md`-Patch gegen die Missverständnis-Klasse, die dich statistisch am meisten kostet.

**Stand:** September 2026 · **Prüfen ab:** März 2027 (schnelllebiges Feld)
**Empfänger:** Claude-Code-Plugin-Community · nachrangig: bestehende Hook-Observability-Projekte (als PR), Anthropic DevRel
**Verdikt:** 🔨 erst Skelett bauen, dann verschenken — ein Wochenende

---

## Das Problem

Wer Agents ernsthaft nutzt, sammelt Frust in Form von Wiederholungen: derselbe falsch verstandene Auftrag, dieselbe Datei am falschen Ort, dieselbe Konvention, die nicht sitzt. Die Information darüber liegt vollständig in den Session-Logs. Sie wird nur nie zu einer Änderung.

Die vorhandenen Werkzeuge halten an der falschen Stelle an. Sie messen: Tokens, Tool-Aufrufe, Read-Edit-Verhältnis, Kosten, Fehlerraten. Das beantwortet *was passiert ist*. Es beantwortet nicht die einzige Frage, die zu einer Verbesserung führt: **welche drei Zeilen hätten in der Instruktionsdatei stehen müssen, damit das nicht passiert?**

Wer leidet: alle mit Multi-Agent-Setups, also genau die Leute, bei denen sich die Wiederholung multipliziert.

## Warum das jetzt geht

1. **Die Logs sind strukturiert und lokal.** Hook-Events und Session-Transkripte liegen maschinenlesbar vor — man muss nichts instrumentieren, nur lesen.
2. **Klassifikation von Fehlermustern über viele Sessions ist billig geworden.** „Diese 14 Korrekturen sind dieselbe Ursache" ist genau die Art Aufgabe, die vorher Handarbeit war.
3. **Die Ausgabe ist ein Diff, kein Bericht.** Und ein Diff kann man anwenden. Das ist der Unterschied zwischen Einsicht und Verbesserung.

## Skizze

- Läuft lokal über die vorhandenen Session-Logs, keine Telemetrie, nichts verlässt die Maschine.
- Sucht **Korrekturschleifen**: Stellen, an denen der Mensch den Agent zurückgepfiffen hat — Abbruch, Zurücknahme, „nein, mach es anders", erneuter Anlauf an derselben Datei.
- Clustert diese über Sessions hinweg zu Ursachenklassen und sortiert nach Kosten (Zeit, Tokens, Anläufe).
- Ausgabe: ein **Patch-Vorschlag** für `CLAUDE.md` bzw. die Skill- oder Regeldatei, pro Cluster eine Regel, mit Beleg — „diese Regel adressiert 14 Korrekturen aus 9 Sessions, hier drei Beispiele".

**Nicht dabei:** kein Live-Dashboard, keine Cloud, keine Scores. Wer Observability will, hat sie schon.

## Erster Schritt

**Ticket: Korrekturschleifen finden und zählen.**

Ein Skript, das lokale Session-Logs liest und die zehn häufigsten Korrekturmuster ausgibt — noch ohne Patch-Generierung, nur die Liste mit Häufigkeit und Beispiel.

**Fertig, wenn:** die Liste beim Durchlesen wehtut, also etwas zeigt, das man selbst nicht gewusst hätte.

## Wo es kippt

**Das Ding kann eine Instruktionsdatei aufblähen, die dadurch schlechter wird.** Jede zusätzliche Regel konkurriert mit allen anderen um Aufmerksamkeit — eine `CLAUDE.md` mit 200 Zeilen wird schlechter befolgt als eine mit 30. Ein Werkzeug, das automatisch Regeln vorschlägt, hat eine eingebaute Tendenz zum Wuchern. **Gegenmaßnahme: Es muss auch Regeln zum Löschen vorschlagen** — welche bestehende Regel wurde nie gebraucht, welche wird ohnehin ignoriert. Ohne die Löschseite ist es netto schädlich.

**Zweites Risiko:** Korrelation statt Ursache. Dass der Mensch korrigiert hat, heißt nicht, dass eine Regel gefehlt hat — manchmal war die Aufgabe einfach unklar. Der Patch-Vorschlag muss als Hypothese auftreten, nicht als Befund.

## Wer es schon versucht hat

Recherche September 2026: Die **Analyse-Hälfte ist besetzt.** Es gibt Session-Analyzer für Claude-Code-Logs (Denktiefe, Read/Edit-Verhältnis, Kosten, Verhaltenssignale), OpenTelemetry-Setups, Hook-basierte Live-Dashboards und Transkript-Analyse-Skills.

**Die Präskriptions-Hälfte ist unbesetzt.** Kein gefundenes Werkzeug schließt den Kreis von „hier ist das Muster" zu „hier ist die Regeländerung, wende sie an". Die Dose ist dadurch enger als ursprünglich gedacht — und schärfer: Sie ist ausdrücklich **kein** Observability-Projekt, sondern ein Patch-Generator, der auf vorhandener Observability aufsetzen kann.

## Vorarbeit

- Bestehende Hook-Event- und Session-Analyse-Projekte — als Datenquelle und als Ort für einen PR statt für einen Wunsch.
- OpenTelemetry-Integrationen für Agent-Sessions — die Messseite, auf der man aufsetzen kann.
- Das Claude-Code-Plugin-Ökosystem — hier *ist* Bauen das Verschenken: veröffentlichen, fertig.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
