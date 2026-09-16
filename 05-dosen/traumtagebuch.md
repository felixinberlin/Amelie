# Traumtagebuch mit Motiv-Karte

**Ein Satz:** Einträge werden lokal eingebettet, wiederkehrende Motive erscheinen als Cluster über die Zeit — und nichts verlässt das Gerät. Das Letzte ist das Produkt.

**Stand:** September 2026 · **Prüfen ab:** März 2027 (bewegter Markt)
**Empfänger:** Obsidian-Plugin-Ökosystem · nachrangig: Local-First-Szene, Schlaf- und Traumforschung
**Verdikt:** 🔨 erst bauen, dann verschenken — als Plugin, nicht als App. Verengt, siehe unten.

---

## Das Problem

Traumtagebücher enthalten mit die intimsten Daten, die ein Mensch produziert — ungefiltertes Material über Ängste, Beziehungen, Verluste, Sexualität. Und der gesamte Markt für Traum-Apps funktioniert so: Eintrag hochladen, Deutung zurückbekommen.

Das ist eine bemerkenswerte Zumutung, und sie fällt nicht auf, weil sie Standard ist.

Dabei ist der nützliche Teil gar nicht die Deutung. Er ist die **Zeitreihe**: Welche Motive kommen wieder? Wann häufen sie sich? Was verschwindet, nachdem sich im Leben etwas geändert hat? Das ist eine Musterfrage, keine Orakelfrage — und sie braucht keine Cloud.

Wer leidet: jede Person, die ein Traumtagebuch führen will und beim Datenschutzhinweis abbricht. Und die Traumforschung, die an Längsschnittdaten interessiert ist und sie aus genau diesem Grund nicht bekommt.

## Warum das jetzt geht

1. **Embeddings laufen lokal.** Kleine Modelle auf dem Gerät reichen für Ähnlichkeit zwischen Texten. Vor zwei Jahren hätte das eine API gebraucht — und damit wäre das Versprechen gebrochen gewesen.
2. **Motiv-Extraktion ohne Übertragung.** „Wasser, Verfolgung, Haus meiner Kindheit" aus freiem Text zu ziehen, geht lokal.
3. **Damit wird der Datenschutz vom Kompromiss zum Merkmal.** Genau die Funktion, für die alle anderen einen Server brauchen, läuft jetzt offline. Das ist der einzige Grund, warum diese Dose existiert.

## Skizze

- Eintrag als Text, lokal. Keine Konten, keine Synchronisierung außer der, die die Nutzerin selbst betreibt.
- Lokale Embeddings, lokales Clustern. Motive als Cluster, nicht als vorgegebene Symbolliste.
- **Darstellung als Zeitkarte:** Cluster über Monate, Häufung sichtbar, Verschwinden sichtbar. Der Wert liegt in der Bewegung, nicht in der Momentaufnahme.
- **Keine Deutung.** Das Werkzeug zeigt Muster und schweigt über ihre Bedeutung. Wer deuten will, tut es selbst oder mit einem Menschen.

**Nicht dabei:** keine Symbol-Lexika, keine Persönlichkeitsauswertung, keine Stimmungs-Scores, keine Cloud-Option „für Komfort".

## Erster Schritt

**Ticket: Dreißig Einträge, fünf Cluster.**

Textdateien einlesen, lokal embedden, clustern, die Cluster über die Zeit auftragen.

**Fertig, wenn:** die Cluster für die Person, die die Einträge geschrieben hat, erkennbar Sinn ergeben — und das Gerät dabei offline war.

## Wo es kippt

**Das hier ist die sensibelste Dose im ganzen Stapel, und die Gefahr ist nicht technisch.** Ein Werkzeug, das Mustern in belastendem Material sichtbar macht, kann jemanden in eine schlechte Stelle bringen — wiederkehrende Albträume als Diagramm sind etwas anderes als wiederkehrende Albträume. Ein Produkt, das das bemerkt und nichts anbietet, handelt fahrlässig; eines, das Deutungen liefert, erst recht. Der einzige vertretbare Weg ist: **keine Bewertung, keine Prognose, keine Auffälligkeitsmeldung** — und an keiner Stelle den Eindruck erwecken, es könne beurteilen, wie es jemandem geht.

**Zweitens: Wer das verschenkt, muss die Privacy-Architektur mitverschenken.** Sonst baut jemand dasselbe Interface mit einer API dahinter und es ist das Gegenteil. Diese Dose ohne den Abschnitt „lokal oder gar nicht" weiterzugeben, wäre schlechter als sie zu behalten.

**Drittes Risiko, nüchtern:** Datenschutz allein verkauft nichts. Als Produkt ist das schwach. Als **Plugin** in einem Ökosystem, dessen Nutzer:innen bereits local-first denken, ist es genau richtig — und deshalb ist der Empfänger ein Plugin-Ökosystem und kein App-Store.

## Wer es schon versucht hat

Recherche September 2026: **Der Markt ist voll und die Mustererkennung ist besetzt.** Es gibt Traumtagebücher mit KI-Deutung, mindestens eine App, deren erklärter Zweck Mustererkennung über Träume ist, und diverse Journaling-Apps mit Motivanalyse. Auch On-Device-Verarbeitung taucht bereits auf.

**Was übrig bleibt, ist schmal, aber es ist der Kern:** keine Deutung, nichts verlässt das Gerät, Zeitreihe statt Momentaufnahme, offen und prüfbar statt versprochen. Wer diese Dose nimmt, konkurriert nicht über Funktionen, sondern über eine Zusage — und die kann man nur einlösen, wenn der Code offen ist.

## Vorarbeit

- **Obsidian-Plugin-Ökosystem** — billigster Weg: kein eigenes Produkt, ein Plugin. Die Nutzerbasis ist bereits local-first sozialisiert und schreibt ohnehin täglich.
- **Local-First-Szene** (Ink & Switch und Umfeld) — sucht überzeugende Endnutzer-Beispiele; „sensibelste denkbare Daten, trotzdem nützlich" ist eines.
- **Traum- und Schlafforschung** — Motivhäufigkeiten über Zeit sind ein echtes Forschungsinteresse, das regelmäßig am Datenschutz scheitert. Ein Werkzeug, das Auswertung lokal macht und nur aggregierte, freiwillige Beiträge kennt, ist dort ein Angebot.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
