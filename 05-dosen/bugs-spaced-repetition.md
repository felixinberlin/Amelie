# Bugs → Spaced Repetition

**Ein Satz:** Jeder gefixte Bug wird automatisch zur Lernkarte — Symptom vorne, Ursache hinten. Nach drei Monaten weißt du, welche Fehlerklasse dich wirklich kostet.

**Stand:** September 2026 · **Prüfen ab:** September 2027
**Empfänger:** Anki-Ökosystem (als Add-on) · nachrangig: Incident- und Postmortem-Tooling, Bootcamps und Team-Leads
**Verdikt:** 🔨 erst Skelett bauen, dann verschenken — ein Wochenende

---

## Das Problem

Postmortems werden geschrieben und nie wieder gelesen. Das ist keine Disziplinlosigkeit, sondern ein Formatproblem: Ein Dokument, das einmal gelesen wird, kann per Konstruktion keine Gewohnheit ändern.

Gleichzeitig ist die Information vollständig vorhanden und maschinenlesbar. Ein Bugfix-Commit enthält beides: das Symptom (der Test, der jetzt grün ist, das Issue, die Fehlermeldung) und die Ursache (der Diff). Das ist bereits die Vorder- und Rückseite einer Karteikarte. Sie wird nur nie umgedreht.

Die eigentliche Frage, die niemand beantworten kann: **Welche Fehlerklasse kostet mich am meisten?** Nicht gefühlt, sondern gezählt. Off-by-one? Nullable-Verwechslungen? Zeitzonen? Race Conditions in genau diesem einen Modul? Nach einem Jahr Arbeit hat man die Daten und keine Auswertung.

Wer leidet: Einzelne mit wiederkehrenden Fehlern; Teams, in denen dieselbe Klasse durch drei Leute wandert; Bootcamps, die Fehlerkultur lehren wollen und nur Anekdoten haben.

## Warum das jetzt geht

1. **Aus einem Diff eine gute Frage zu formulieren ist der schwierige Teil — und er ist gelöst.** „Was war hier die Ursache" in eine Karteikarte zu fassen, die in drei Monaten noch verständlich ist, war Handarbeit. Genau das ist jetzt automatisierbar.
2. **Fehlerklassifikation über viele Commits.** „Diese siebzehn Fixes sind dieselbe Klasse" ist die Auswertung, die den eigentlichen Wert trägt, und sie war vorher unbezahlbar.
3. **Der Rest existiert seit Jahrzehnten.** Spaced-Repetition-Algorithmen, Anki-Add-on-Architektur, Git-Hooks. Es fehlt nur die Brücke.

## Skizze

- **Auslöser:** ein Commit, der als Fix erkennbar ist (Konvention, geschlossenes Issue, Test von rot auf grün).
- **Karte:** Vorderseite = Symptom, wie es sich gezeigt hat — Fehlermeldung, Testfall, Beobachtung. Rückseite = Ursache und die Zeile, die es behoben hat, mit Link auf den Commit.
- **Klassifikation:** jede Karte bekommt eine Fehlerklasse. Über Monate ergibt das eine sortierte Liste: *das* kostet dich am meisten.
- **Export nach Anki** statt eigener Lern-App. Die Wiederholungslogik ist gelöstes Problem, da gibt es nichts zu gewinnen.
- **Kuratierung ist Pflicht:** Nicht jeder Fix ist eine Karte wert. Vorschlagen, Mensch bestätigt. Automatisch erzeugte Stapel werden nicht gelernt.

**Nicht dabei:** keine eigene Lern-App, keine Team-Bestenliste, keine Produktivitätsmetrik.

## Erster Schritt

**Ticket: Aus zehn Fix-Commits zehn Karten.**

Ein Skript über die Git-Historie eines eigenen Repos: Fix-Commits finden, Karten vorschlagen, als Anki-Deck exportieren.

**Fertig, wenn:** man drei der zehn Karten nach vier Wochen nicht auf Anhieb beantworten kann. Wenn man alle kann, waren es die falschen Bugs.

## Wo es kippt

**Die Gefahr, dass daraus eine Überwachungsmetrik wird.** In dem Moment, in dem ein Team-Lead „Fehlerklassen pro Person" sieht, ist das Werkzeug ein Beurteilungsinstrument, und dann schreibt niemand mehr ehrliche Commit-Nachrichten. Das ist kein Randfall, das ist der wahrscheinlichste Weg, auf dem so etwas in Firmen ankommt. **Gegenmaßnahme ins Design: Karten sind persönlich und lokal. Kein Team-Dashboard. Aggregierte Klassen nur, wenn ein Mensch sie bewusst teilt.**

**Zweites Risiko:** Der Stapel wuchert. Zweihundert Karten aus einem Jahr Commits lernt niemand. Deshalb ist die Klassifikation wichtiger als die Karte — der Wert liegt in „drei Klassen kosten dich 60 % deiner Debugging-Zeit", nicht in zweihundert Einzelfällen.

**Drittes Risiko:** Viele Bugs sind nicht lehrreich. Ein Tippfehler ist keine Lektion. Die Vorschlagsschwelle muss hoch sein, lieber zu wenige Karten.

## Wer es schon versucht hat

Recherche September 2026: Das **Spaced-Repetition-Ökosystem ist groß und reif** — Anki und zahlreiche Alternativen, Terminal-Clients, Plugin-Architekturen. Es gibt Anleitungen, wie Programmierer:innen Anki für das Lernen von Code nutzen.

**Die Brücke von der Git-Historie zur Karteikarte habe ich nicht gefunden.** Alle vorhandenen Werkzeuge setzen voraus, dass ein Mensch die Karte schreibt — und genau daran scheitert es, weil nach einem Bugfix niemand noch Lust auf Karteikarten hat. **Der Wert liegt im Automatisieren des Moments, in dem man am wenigsten motiviert ist.**

## Vorarbeit

- **Anki** — offene Add-on-Architektur, größte Nutzerbasis, Export-Formate dokumentiert. Nicht neu bauen, andocken.
- **Incident- und Postmortem-Tooling** — besitzt die Fehlerdaten und das Postmortem-Ritual, aber keinen Lernkreislauf danach. Als Firma ohne Code ansprechbar.
- **Bootcamps und Team-Leads** — „unsere drei teuersten Fehlerklassen dieses Quartal" ist Onboarding-Material, das sonst niemand hat.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
