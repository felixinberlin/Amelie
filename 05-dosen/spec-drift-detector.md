# Spec-Drift Detector

**Ein Satz:** Ein CI-Check, der Prosa-Spezifikationen gegen die tatsächliche Implementierung prüft und den Build bei Divergenz rot färbt.

**Stand:** September 2026 · **Prüfen ab:** März 2027 (schnelllebiges Feld)
**Empfänger:** GitHub Spec Kit (Discussion), Tessl · **Verdikt:** 🔒 **behalten und bauen** — Idee trotzdem öffentlich streuen

---

## Das Problem

Spec-driven Development hat kein Immunsystem.

Die Spezifikation wird geschrieben, der Agent baut danach, und ab dem ersten Refactoring läuft die Implementierung von der Spec weg. Niemand merkt es, weil nichts es prüft: Tests testen den Code gegen sich selbst, Linter prüfen Syntax, Reviews prüfen den Diff. Die Spec prüft niemand.

Der Schaden ist asymmetrisch und wächst: **Ab dem Moment der Divergenz baut der Agent zuverlässig das Falsche, mit Begründung.** Er liest eine Spec, die nicht mehr stimmt, und leitet daraus korrekte Schlüsse über einen Zustand ab, den es nicht gibt. Das ist schlimmer als gar keine Spec, weil es autoritativ aussieht.

Wer leidet: jedes Repo, in dem Spezifikationsdokumente als Quelle der Wahrheit gelten — bei mir aktuell vier.

## Warum das jetzt geht

1. **Prosa gegen Code zu prüfen ist erst seit Kurzem möglich.** „Sagt dieses Dokument etwas über das Verhalten, das der Code nicht tut" war bis vor Kurzem keine automatisierbare Frage. Das ist der ganze Grund, warum es das noch nicht gibt.
2. **Spec-driven Development ist gerade erst zum Standard geworden** — mit GitHub Spec Kit und kommerziellen Plattformen. Die Praxis existiert seit etwa einem Jahr breit; das zugehörige Kontrollwerkzeug noch nicht.
3. **CI-Integration ist trivial.** Ein Check, der rot wird, braucht keine neue Infrastruktur.

## Skizze

- Eingabe: Spec-Dokumente (Markdown) + der Code, auf den sie sich beziehen.
- Zerlegung der Spec in **prüfbare Aussagen** — jede Behauptung über Verhalten, Schnittstellen, Invarianten wird ein Prüfpunkt mit Anker im Dokument.
- Pro Aussage: Beleg im Code suchen. Drei Ergebnisse — **gedeckt**, **widersprochen**, **nicht auffindbar**.
- Ausgabe: Report plus Exit-Code. Widersprochen färbt rot, nicht auffindbar färbt gelb.
- **Cache über Spec-Hash und Code-Hash**, sonst ist jeder CI-Lauf zu teuer.

**Nicht dabei:** kein Generieren von Code aus der Spec, kein Umschreiben der Spec. Nur die Feststellung, dass beides auseinanderläuft — plus die Stelle.

## Erster Schritt

**Ticket: Ein Dokument, zehn Aussagen, ein Exit-Code.**

Eine Spec-Datei in Aussagen zerlegen, jede gegen das Repo prüfen, Report ausgeben, bei Widerspruch mit Code 1 beenden.

**Fertig, wenn:** in einem meiner eigenen Repos eine echte Divergenz gefunden wird, von der ich nichts wusste — und kein Fehlalarm in der ersten Runde.

## Wo es kippt

**Fehlalarme töten das Werkzeug innerhalb einer Woche.** Ein CI-Check, der grundlos rot wird, wird abgeschaltet, und zwar dauerhaft. Das ist die einzige wirklich gefährliche Stelle. Gegenmaßnahmen: extrem konservative Schwelle, „nicht auffindbar" niemals als Fehler werten, und ein `# spec-drift: ignore` für bewusste Abweichungen.

**Zweites Risiko: Kosten.** Bei jedem Commit die gesamte Spec gegen das gesamte Repo zu prüfen ist unbezahlbar. Nur geänderte Abschnitte gegen geänderte Dateien, alles andere aus dem Cache.

**Drittes Risiko:** Die Spec ist manchmal *richtigerweise* voraus — sie beschreibt, was gebaut werden soll. Ein Werkzeug, das das als Fehler meldet, missversteht spec-driven Development. Deshalb braucht jede Aussage einen Status: *beschlossen* oder *geplant*.

## Wer es schon versucht hat

Recherche September 2026, und das Ergebnis ist zweigeteilt:

- **API-Schema-Drift ist ein reifer, kommerzieller Markt.** Mehrere Anbieter vergleichen OpenAPI-Spezifikationen gegen laufenden Traffic oder Implementierung. Diese Hälfte ist besetzt und uninteressant.
- **Prosa-Spec-Drift ist offen — und wird gerade öffentlich als Problem benannt.** 2026 erschienen Beiträge, die genau das als die wiederkehrende Falle der spec-driven-Bewegung beschreiben („die Prosa-Spec-Drift-Falle, neu aufgelegt"). Es gibt vereinzelte kleine Repos, aber kein etabliertes Werkzeug.

**Deshalb 🔒:** Das Problem ist real, ich habe es selbst über mehrere Repos, die Lücke ist benannt und unbesetzt, und der Eigennutzen ist sofort da. Das ist der beste Grund zu bauen, den es gibt.

**Und trotzdem streuen:** Die Idee kostet mich nichts, wenn sie öffentlich ist, und sie wird ohnehin von mehreren Seiten gebaut werden. Ein Beitrag in der Spec-Kit-Discussion ist ein Geschenk an die Bewegung und kostet mich keinen Vorsprung — mein Vorsprung ist, dass ich das Problem täglich habe.

## Vorarbeit

- **GitHub Spec Kit** — Open-Source-Toolkit für spec-driven Development, Discussions offen, exakt dieser Problemraum.
- **Tessl** — „Spec as source" als Produktthese; Drift-Erkennung ist die fehlende Hälfte davon.
- **OpenAPI-Drift-Werkzeuge** — für die Schema-Hälfte, als Vorbild für Reporting und CI-Verhalten.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
