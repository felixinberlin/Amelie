---
status: Available
delivery_method: E-Mail
target_maker: SSDeV
review_score: 29/35
architecture_tier: Tier 1
source_type: Type A/B
---
# Pin Tumbler

**Ein Satz:** Kein Lockpicking-Spiel, sondern ein Lerngerät — Stifte, Federn, Fertigungstoleranzen und Binding Order als sichtbares Modell, mit Handy-Vibration als Ersatz für das Gefühl, das man noch nicht hat.

**Stand:** September 2026 · **Prüfen ab:** September 2027
**Empfänger:** SSDeV — Sportsfreunde der Sperrtechnik Deutschland e. V., Ortsgruppe Berlin · nachrangig: TOOOL, CCC-Workshops, Ausbildung Schließtechnik
**Verdikt:** 🎁 verschenken — Rang 4 (Community), Skelett hilft sehr  
**Review:** 29/35 · Tier 1 · Type A/B (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))

---

## Das Problem

Locksport bringt Gefühl bei, und zwar durch Wiederholung: Man spürt irgendwann, welcher Stift bindet. Der Weg dahin ist wochenlanges Tasten im Dunkeln, weil das Modell dahinter unsichtbar ist.

Unsichtbar ist dabei nicht metaphorisch gemeint. Der entscheidende Mechanismus — **warum Stifte in einer bestimmten Reihenfolge binden** — folgt aus Fertigungstoleranzen im Zehntelmillimeterbereich: Die Bohrungen im Zylinder sind minimal versetzt, deshalb trägt bei Drehspannung immer genau einer zuerst. Das kann man erklären, aber niemand sieht es, und die üblichen Plexiglas-Schnittmodelle zeigen die Geometrie ohne die Toleranzen, also gerade den Teil nicht, auf den es ankommt.

Wer leidet: Anfänger:innen, die Monate brauchen für eine Einsicht, die zwanzig Minuten dauern könnte — und die Leute, die es ihnen beibringen.

## Warum das jetzt geht

1. **Starrkörperphysik mit Kontakt und Reibung läuft in Echtzeit im Browser.** Ein Zylinder mit zehn beweglichen Teilen, Federn und Spannung ist rechnerisch trivial geworden.
2. **Haptik über das Handy ist gut genug geworden.** Moderne Vibrationsmotoren können kurze, scharfe Impulse — genug, um „der Stift setzt" von „der Stift rutscht zurück" unterscheidbar zu machen. Das war zu Zeiten der alten Rüttelmotoren nicht möglich.
3. **Der didaktische Teil ist neu:** Toleranzen lassen sich zufällig streuen und **sichtbar machen** — ein Schloss pro Übung, mit angezeigter Binding Order zum Vergleich mit der eigenen Vermutung. Das ist der Schritt vom Spiel zum Lerngerät.

## Skizze

- Ein Zylinder im Schnitt, Stifte, Federn, Kernspannung als Regler.
- **Toleranzen sind das Thema, nicht die Kulisse:** pro Schloss zufällig gestreute Bohrungsversätze, daraus ergibt sich die Binding Order von selbst statt scriptet zu sein.
- Zwei Modi: **sichtbar** (man sieht alles, versteht den Mechanismus) und **blind** (nur Haptik und Geräusch, wie in echt) — derselbe Zylinder, umschaltbar. Der Lerneffekt liegt im Wechsel.
- Security-Pins (Spool, Serrated) als spätere Stufe, weil sie den Counter-Rotation-Effekt erzeugen, den man am realen Schloss am schwersten deutet.

**Nicht dabei:** keine Punkte, keine Level, kein Fortschrittsbalken. Wer ein Spiel will, findet mehrere.

## Erster Schritt

**Ticket: Fünf Stifte, eine Toleranz, eine sichtbare Binding Order.**

Zylinder mit fünf Stiften, zufällig gestreuten Bohrungsversätzen, Spannungsregler. Anzeige: welcher Stift bindet gerade, und warum.

**Fertig, wenn:** jemand, der noch nie gepickt hat, nach fünf Minuten erklären kann, warum nicht alle Stifte gleichzeitig binden.

## Wo es kippt

**Das Gefühl ist nicht simulierbar, und so zu tun wäre eine Lüge.** Ein Simulator, der behauptet, echtes Picken zu ersetzen, produziert Leute, die am realen Schloss scheitern und frustriert aufhören. Die ehrliche Positionierung ist eng: **Das Werkzeug lehrt das Modell, nicht die Fertigkeit.** Wenn das nicht in der Oberfläche steht, ist es das falsche Produkt.

**Zweites Risiko:** die Doppelnutzung. Ein gutes Lernwerkzeug für Schließmechanik ist ein gutes Lernwerkzeug für alle. Die Locksport-Szene hat dafür seit Jahrzehnten eine Antwort (offene Prinzipien, keine konkreten Angriffe auf konkrete Produkte, keine Werkzeugbeschaffung) — die Community *ist* die Gegenmaßnahme. Deshalb gehört das Projekt zu ihr und nicht auf einen App-Store.

## Wer es schon versucht hat

Recherche September 2026: **Lockpicking-Spiele gibt es reichlich** — mehrere Mobile-Titel, ein browserbasierter 3D-Simulator, ein ganzes Steam-Projekt über Lockpicking-Mechaniken in Videospielen, diverse itch.io-Arbeiten. Alle sind Spiele: Ziel, Erfolg, Timing.

Nachgetragen 19.09.2026: **DerGut/lockpicking** (Spiel, das das Picken eines Stiftzylinders simuliert) und **chestnutzero/pin-planner** bzw. lockbuilder.io (Frontend-Werkzeug: Stiftbelegungen visualisieren und teilen, „Simulate picking“ per matter.js-2D-Physik, eigene Stiftformen) — Letzteres ist näher an einem Lernwerkzeug als ein Spiel. **Nicht geprüft:** ob eines der beiden Bohrungsversätze oder Fertigungstoleranzen modelliert; die Aussage unten gilt daher unter Vorbehalt.

**Kein gefundenes Werkzeug behandelt Toleranzen als Lerngegenstand** oder zeigt die Binding Order als Erklärung statt als Rätsel. Die Lücke ist schmal, aber echt — und sie liegt genau dort, wo die Community ihren didaktischen Engpass hat.

**Achtung, Patentlage:** Es existiert mindestens eine Patentanmeldung auf ein Lockpicking-Spiel. Das betrifft die Spielmechanik, nicht die Lehrsimulation — aber es ist ein Grund, diese Dose **vor der breiten Verteilung defensiv zu publizieren** (TDCommons).

## Vorarbeit

- **SSDeV** — größter Verein im deutschsprachigen Raum, ausdrücklich auf Wissensvermittlung ausgerichtet, mit **Ortsgruppe Berlin** und Wiki. Community mit Zeit und Interesse: idealer Empfänger.
- **TOOOL** — international dieselbe Rolle.
- **CCC / Congress** — Sperrtechnik ist dort seit jeher Programm; ein Simulator als Workshop-Beigabe verteilt sich von selbst.
- **Ausbildung Schließtechnik** — der unerwartete Markt: Azubis lernen Zylinder heute an Plexiglas-Schnittmodellen ohne Toleranzen.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
