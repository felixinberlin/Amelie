# Ghost Replay fürs Editieren

**Ein Satz:** Der eigene Editier-Rhythmus als „Geist" abgespielt, Trackmania-Stil — nicht was du geschrieben hast, sondern wie du dich durch den Code bewegt hast, inklusive der vierzig Sekunden Scrollen vor jeder Entscheidung.

**Stand:** September 2026 · **Prüfen ab:** September 2027
**Empfänger:** HCI- und Software-Engineering-Forschung · nachrangig: Editor-DevEx-Teams, Bootcamps und Mentor:innen
**Verdikt:** 🎁 verschenken **an Forschung** — als Frage, nicht als Produkt. Verengt, siehe unten.

---

## Das Problem

Wir messen Entwicklerarbeit an ihren Artefakten: Commits, Zeilen, geschlossene Tickets, neuerdings Tokens. Alle diese Maße haben gemeinsam, dass sie **nach** der Entscheidung ansetzen.

Die Arbeit selbst passiert davor und ist unbeobachtet: das Springen zwischen vier Dateien, das dreimalige Zurückscrollen zu derselben Funktion, die Pause, in der klar wird, dass die Annahme falsch war. Jede erfahrene Person weiß, dass dort die Zeit hingeht. Es gibt kein Instrument dafür, obwohl die Daten in jedem Editor anfallen.

Das ist präzise eine **Forschungsfrage**, verpackt als Spielzeug: Wie navigieren Entwickler:innen tatsächlich durch Code, und unterscheiden sich Anfänger:innen und Erfahrene darin systematisch? Die Trackmania-Metapher — dein eigener Geist fährt neben dir — ist dabei nicht Deko, sondern der Grund, warum jemand das freiwillig aufzeichnen würde.

Wer profitiert: Forschungsgruppen, die genau das publizieren können; Mentor:innen, die den Prozess sehen wollen und nur das Ergebnis bekommen.

## Warum das jetzt geht

1. **Die Aufzeichnung ist billig und lokal.** Cursorposition, Viewport, Dateiwechsel, Suchvorgänge — alles über Editor-APIs zugänglich, ohne Inhalte zu erfassen.
2. **Die Auswertung ist neu.** Bewegungsspuren zu Mustern zu verdichten — „Orientierungsphase", „gezielter Sprung", „Suchschleife" — war vorher Handkodierung durch Forschende, Stunde um Stunde Video. Genau das ist jetzt automatisierbar, und das ist der Grund, warum die Frage heute bearbeitbar ist und vor fünf Jahren nicht.
3. **Wiedergabe im Browser** ist trivial geworden; die Spur ist ein kleines Zeitreihenformat.

## Skizze

- Aufzeichnung als Erweiterung: Zeitreihe aus Datei, Cursorzeile, Viewport, Suchereignissen. **Keine Inhalte**, nur Positionen — das macht sie teilbar.
- Wiedergabe: der eigene Verlauf als Geist über der aktuellen Datei, beschleunigbar.
- Auswertung: Phasenerkennung, Verweildauer pro Region, Rückkehrhäufigkeit („welche Funktion hast du siebenmal angesehen").
- **Vergleich als Kernfunktion, nicht als Extra:** derselbe Task, zwei Personen — das ist der Moment, in dem etwas gelernt wird.

**Nicht dabei:** keine Produktivitätsmetrik, kein Score, keine Arbeitgeberauswertung.

## Erster Schritt

**Ticket: Eine Sitzung aufzeichnen und abspielen.**

Erweiterung, die Positionen protokolliert, plus ein Viewer, der die Spur über der Datei animiert.

**Fertig, wenn:** man beim Zusehen etwas über sich selbst erfährt, das man vorher nicht wusste.

## Wo es kippt

**Das ist ein Überwachungswerkzeug, wenn man es falsch aufstellt — und der falsche Aufsteller ist fast immer ein Arbeitgeber.** Eine Spur, die zeigt, wann jemand wie lange worauf geschaut hat, ist in einem Beschäftigungsverhältnis Leistungskontrolle. In Deutschland ist das zusätzlich mitbestimmungspflichtig, aber das Problem ist nicht juristisch, sondern kulturell: In dem Moment, in dem die Spur das Gerät verlassen kann, wird das Werkzeug seinen Zweck verlieren, weil niemand mehr ehrlich arbeitet, während es läuft.

**Die einzige haltbare Bauweise:** lokal, freiwillig, jederzeit löschbar, ohne Serverkomponente, ohne Team-Ansicht. Und der natürliche Träger ist deshalb **Forschung** mit Einwilligung, nicht ein Produkt mit Nutzungsbedingungen.

**Zweites Risiko:** Beobachtereffekt. Wer weiß, dass aufgezeichnet wird, arbeitet anders. Für Forschung ist das handhabbar, für Selbsterkenntnis ist es ein Grundproblem.

## Wer es schon versucht hat

Recherche September 2026, und sie verengt diese Dose erheblich: **Die Aufzeichnungstechnik existiert.** Es gibt Werkzeuge, die Tipp-Sitzungen aufnehmen und abspielen, und Session-Replay für Editor-Aufgaben im Prüfungs- und Assessment-Kontext. Als „neues Werkzeug" ist die Idee weitgehend besetzt.

**Was offen ist, ist die Frage, nicht die Technik:** Bewegungsmuster systematisch auszuwerten und zu vergleichen, statt Sitzungen nur abzuspielen. Das ist kein Produkt, das ist ein Paper. Deshalb geht diese Dose an Forschungsgruppen und nicht an Editor-Hersteller — und deshalb braucht sie keinen mitgelieferten Code, sondern eine gut gestellte Frage.

## Vorarbeit

- Vorhandene **Record-and-Replay-Werkzeuge für Editor-Sitzungen** — die Aufzeichnungsschicht muss niemand neu bauen.
- **HCI- und Software-Engineering-Forschung** (CHI, VL/HCC, ICSE-Umfeld; in Deutschland Gruppen mit Fokus Developer Experience) — publizierbare offene Frage, kein Code nötig, idealer Empfängertyp.
- **Bootcamps und Mentor:innen** — der Ghost zeigt den Rhythmus, den ein Code-Review nie sieht.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
