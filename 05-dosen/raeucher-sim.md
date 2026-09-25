---
status: Available
delivery_method: E-Mail
target_maker: Teezeremonie- & Achtsamkeits-Communities
review_score: 30/35
architecture_tier: Tier 1
source_type: Type D
---
# Räucher-Sim

**Ein Satz:** Eine Rauchsimulation, die auf den Atem reagiert — Mikrofon als Windkanal, kein Ziel, kein Score, kein Account.

**Stand:** September 2026 · **Prüfen ab:** September 2028 (zeitlos, veraltet kaum)
**Empfänger:** die Web-Toy-Öffentlichkeit · nachrangig: Ausstellungshäuser (Futurium, Technikmuseum/Spectrum), Meditations-Apps als Lizenznehmer
**Verdikt:** 🎁 verschenken **durch Bauen** — ein Wochenende, dann veröffentlichen  
**Review:** 30/35 · Tier 1 · Type D (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))

---

## Das Problem

Es gibt keins. Das ist der Punkt.

Diese Dose ist die Ausnahme im Stapel: kein Schmerz, keine Zielgruppe mit Leidensdruck, keine Marktlücke. Eine Rauchsäule, die sich bewegt, wenn man sie anpustet, ist ein Geschenk an Fremde im Internet — dieselbe Kategorie wie ein Bücherschrank an der Straßenecke.

Der einzige ernsthafte Gedanke dahinter: **Atem ist der am wenigsten genutzte Eingabekanal, den jedes Gerät bereits hat.** Jedes Handy hat ein Mikrofon, niemand benutzt es für etwas anderes als Sprache und Lautstärke. Ein Pusten ist ein sauber erkennbares Signal — breitbandiges Rauschen mit charakteristischer Hüllkurve — und es ist die einzige Interaktion, die von selbst langsam macht. Man kann nicht hektisch pusten.

## Warum das jetzt geht

1. **Fluidsimulation im Browser ist gelöst.** Ein 2D-Stable-Fluids-Solver auf der GPU läuft seit Jahren flüssig; heute reicht ein Fullscreen-Quad und ein paar Shader.
2. **Atemerkennung ohne Spracherkennung.** Pusten von Sprache und Umgebungsgeräusch zu unterscheiden, geht über die spektrale Signatur — ohne dass je ein Audiosignal das Gerät verlässt oder gespeichert wird.
3. **Die beiden Stücke waren nie verbunden.** Rauchsims gibt es viele, atemgesteuerte Installationen gibt es in Museen. Im offenen Web zusammen: nicht gesehen.

## Skizze

- Stable-Fluids-Solver, 2D, GPU, Ping-Pong-Texturen.
- Mikrofon → Bandpass → Hüllkurve → Kraftfeld am unteren Bildrand. Nur Pegel und Spektralform, **nie Aufnahme**, nie Übertragung.
- Ein Regler: Viskosität. Sonst nichts.
- Läuft ohne Mikrofon-Erlaubnis genauso, nur ohne Atem — die Erlaubnisabfrage darf nie zwischen Nutzerin und Bild stehen.

**Nicht dabei:** kein Ziel, kein Score, kein Timer, kein Login, keine Sitzungsstatistik, keine Achtsamkeits-Sprüche.

## Erster Schritt

**Ticket: Rauch, der aufsteigt.**

Fluidsolver, eine Quelle unten, Auftrieb, Wirbel. Noch ohne Mikrofon.

**Fertig, wenn:** man zwei Minuten hinschaut, ohne etwas zu wollen.

## Wo es kippt

**Die Versuchung, es nützlich zu machen.** Sobald jemand einen Atemzähler, eine Übungsdauer oder eine Statistik einbaut, ist es eine Wellness-App und damit eines von tausend. Der ganze Wert liegt in der Abwesenheit von Zweck. Das ist schwerer durchzuhalten, als es klingt.

**Zweites Risiko:** Die Mikrofon-Erlaubnis schreckt ab und wirkt übergriffig — ausgerechnet bei einem Spielzeug. Deshalb muss die Seite ohne Mikrofon vollständig funktionieren und die Erlaubnis erst auf Klick erklären: „damit du reinpusten kannst, nichts wird aufgenommen".

**Drittes Risiko, ehrlich:** Auf dem Desktop pustet niemand ins Laptop-Mikro. Das hier ist ein Handy-Ding, und wer es am Desktop testet, hält es für kaputt.

## Wer es schon versucht hat

Rauch- und Fluidsimulationen im Web: unzählige, von Shadertoy bis zu bekannten Demos. Atemgesteuerte Installationen: in Ausstellungskontexten etabliert. **Die Kombination als freies Web-Toy: nicht gefunden** — aber diese Dose lebt ohnehin nicht von Neuheit. Wenn es das schon gibt, ist das kein Argument gegen ein zweites, das ist der Unterschied zwischen einem Produkt und einem Geschenk.

## Vorarbeit

- **Stam, „Stable Fluids" (1999)** — der Solver, in zweihundert Zeilen.
- Die **Web-Toy-Öffentlichkeit** — Verteilung ist der ganze Mechanismus; Quellcode MIT, Link posten, fertig.
- **Ausstellungshäuser** — eine atemgesteuerte Projektion ist eine fertige Installation für kleines Geld. In Berlin: Futurium, Spectrum am Technikmuseum.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
