# Das lebende Spielobjekt

**Ein Satz:** Ein Standortspiel, in dem das umkämpfte Objekt kein Portal und keine Arena ist, sondern eine echte Pflanze an einer echten Fuge — die zwischen zwei Runden erfrieren, weggekehrt oder ausgerissen werden kann, und dann weg ist.

**Stand:** 21.09.2026 · **Prüfen ab:** 03/2027 (Konsum/Spiele, kurzes Fenster)
**Empfänger:** Pl@ntNet / The Plant Game (INRIA, Cirad, IRD, Inria — sie haben den Duell-Modus bereits) · nachrangig: Play Curious (Jesse Himmelstein), MMOS (Attila Szantner), Scientific Game Jam
**Verdikt:** 🎁 verschenken — mit lauffähigem Skelett, sonst wäre es nach Regel 4 keine Gabe

---

## Das Problem

Standortbasierte Spiele haben ein Objektproblem, über das niemand spricht: Ihre Welt ist **kuratiert**. Pokémon-GO-Arenen, Ingress-Portale, Munzee-Places — das sind Einträge in einer Datenbank, die an Briefkästen und Wandbildern hängen. Sie bewegen sich nicht, sie wachsen nicht, sie sterben nicht. Wer ein Portal einnimmt, nimmt eine Zeile ein.

Gleichzeitig gibt es einen Haufen Spiele über echte Pflanzen — *Out and About* lehrt seit 2026 echte Botanik als Cozy-Foraging, *Niche* baut seit Jahren echte Mendel-Genetik in eine Überlebenssimulation. Beide spielen in einer **gebauten Welt**. Die Pflanzen dort sind Instanzen, die der Entwurf erzeugt hat.

Dazwischen liegt eine Kategorie, die leer ist: ein Spielobjekt, das **existiert, ob gespielt wird oder nicht**. Eine Mauerraute in einer Fuge am Hauptbahnhof ist seit achtzig Jahren da. Ein Löwenzahn in einer Gehwegritze überlebt den Winter oder nicht. Kein Designer hat entschieden, wo sie stehen, wie viele es gibt und wann sie verschwinden — die Stadt hat das entschieden, und sie entscheidet es weiter, während niemand hinsieht.

Das ist keine Spielerei mit Flavour. Es kehrt die Grundannahme des Genres um: **Der Spielstand ist nicht mehr autoritativ.** Die Datenbank kann sagen „hier steht dein Individuum, Level 4" — und in der Fuge steht nichts mehr, weil die Kehrmaschine da war.

## Warum das jetzt geht

Ein geteiltes Objekt braucht einen Beweis, dass zwei Menschen dasselbe meinen. Genau daran ist die Idee bisher gescheitert.

1. **Individuum-Wiedererkennung statt Artbestimmung.** Nicht „das ist Taraxacum officinale" — das kann PlantNet seit Jahren —, sondern „das ist **dieselbe** Pflanze wie auf dem Foto von vorgestern, aufgenommen von jemand anderem". Instanzsegmentierung plus Merkmalsabgleich auf dem Gerät. Das ist der eine Teil, den es vor zwei Jahren nicht gab, und ohne ihn zerfällt das Spiel in private Notizbücher.
2. **Artbestimmung ist gratis geworden** und muss nicht mehr gebaut werden — Pl@ntNet und Flora Incognita liefern sie per Schnittstelle.
3. **Die Werte müssen nicht erfunden werden.** Für die Stats gibt es Merkmalsdatenbanken (TRY, LEDA, UNDERPLOT, SID, Grime & Hunt RGR, StrateFy für die CSR-Klasse). Das ist keine KI, sondern Fleißarbeit — aber es heißt, dass die Balance aus der Ökologie kommt statt aus dem Bauchgefühl, und genau das war der Reiz von *Niche*.

## Skizze

- **Das Objekt ist die Pflanze, nicht der Ort.** Ein Individuum an einer Fuge, wiedererkennbar am Foto, mit Stats aus den Merkmalsdaten seiner Art und Modifikatoren aus seinem Standort (Trittlast, Substrat, Salz im Winter).
- **Beanspruchen und Verteidigen** wie im Genre üblich — hier aber gegen andere Menschen um ein Ding, das keinem gehört.
- **Die Saison ist der Gegner, nicht der Mitspieler.** Ereignisse kommen aus dem echten Wetter und dem echten Stadtbetrieb: Frost, Hitze, Kehrmaschine, Streusalz. Das Kartenmaterial ist im Januar dünn und im Mai voll, und das ist kein Bug.
- **Tod ist echt.** Verschwindet die Pflanze, verschwindet das Objekt. Was bleibt, ist die Historie: wer es wann gefunden, gehalten, verloren hat.

**Nicht dabei:** keine gezüchteten oder gehandelten Kreaturen, kein Bezahlvorteil, keine kuratierte POI-Liste als Fallback, wenn die Karte leer ist. Der Reiz stirbt in dem Moment, in dem das Spiel anfängt, sich die Welt selbst zu schreiben.

**Das Skelett liegt bei:** `src/components/simulators/FugenduellArena.tsx` (698 Z.) und `src/data/fugenduellData.ts` (437 Z.) im selben Repo, dazu die ausformulierten Mechaniken unter `02-recherche/fugenduell-brainstorm/` — sechs Runden Jahreszyklus, CSR-Schere, Arena-Multiplikatoren, deterministische Auflösung ohne Zufallszahlen, vierzehn Startarten mit belegten Werten.

## Erster Schritt

**Ticket: Zwei Menschen, eine Pflanze, ein Beweis.**

Person A fotografiert eine Pflanze in einer Fuge. Person B, die nichts von A weiß, fotografiert dieselbe Pflanze zwei Tage später.

**Fertig, wenn:** das System sagt, dass es dasselbe Individuum ist — und bei der Nachbarpflanze drei Meter weiter sagt, dass es das nicht ist. Ohne diesen Test gibt es kein geteiltes Objekt und damit kein Spiel.

## Wo es kippt

**Der Wettbewerb schafft einen Anreiz, echte Pflanzen zu zerstören.** Wenn eine Fuge etwas wert ist, ist Ausreißen ein Gewinnzug. Das ist die ernsteste Stelle, und sie ist keine Randnotiz: Ein Spiel über Stadtnatur, das Vandalismus belohnt, ist schlechter als kein Spiel. Mögliche Antworten — Verlust der Historie bei Verschwinden, Punkte fürs Halten statt fürs Erobern, kein Ertrag aus dem Tod eines fremden Objekts — sind Entwurfsarbeit, nicht gelöst. **Wer das nicht zuerst löst, soll es nicht bauen.**

**Der Kaltstart liegt auf Straßenebene.** Ein Streitobjekt braucht einen zweiten Menschen in Gehweite. Das ist der Friedhof dieser Gattung, und ein kleines Team schultert ihn gegen Niantics Schatten. Ein Saisonfenster mit garantierter Dichte hilft: #Krautschau, 14.–23.05.2027, zuletzt 85 Spaziergänge in 66 Städten.

**Die These trägt nur halb.** Amélie sammelt Ideen, die es ohne die letzten Jahre KI nicht gäbe. Hier ist das genau ein Baustein — die Wiedererkennung des Individuums. Kampfsystem, Stats und Ökonomie sind klassisches Spieldesign. Wer die Dose als „KI-Idee" verkauft, übertreibt.

**Die Karte ist im Winter leer** und in versiegelten Vierteln ärmer als in solchen mit Baumscheiben. Ungleiche Inhaltsdichte nach Postleitzahl ist ein Gerechtigkeitsproblem, kein Balancing-Problem.

## Wer es schon versucht hat

Recherche 21.09.2026, Protokoll `06-suche/amelie-pruefprotokoll.md`, Runde 6 (Spiel-Strang).

- **Out and About** (Yaldi Games, Steam, 2026): Cozy-Foraging über **echte Pflanzenarten**, ausdrücklich damit beworben, dass man danach draußen bestimmen kann. Einzelspieler, gebaute Welt, kein Standortbezug, kein Kampf. **„Spiel über echte Pflanzen" ist damit besetzt** — das allein ist kein Pitch mehr.
- **Niche — a genetics survival game** (Stray Fawn Studio): echte Mendel-Genetik als Kernmechanik, kommerziell erfolgreich. Beweist das Muster „echte Wissenschaft als Spielsystem" und nimmt ihm zugleich die Neuheit.
- **Pokémon GO, Ingress, Munzee Places**: Inbesitznahme und Verteidigung von Orten, seit Jahren ausgereift — an kuratierten, virtuellen Objekten ohne Lebensdauer.
- **The Plant Game** (Pl@ntNet/INRIA, `theplantgame.com`): hat einen Duell-Modus gegen Freunde oder Zufallsgegner und adaptive Schwierigkeit. Geduelliert wird um **Bestimmungskönnen**, nicht um ein Objekt; die Doku nennt weder Regeln noch aktuelle Spielerzahlen.
- **MMOS / Project Discovery** (mmos.ch, Attila Szantner): echte Forschungsaufgaben in ein bestehendes Spiel eingebettet, EVE Online, hunderttausende Spieler, Publikation in *Nature Biotechnology* 2024. Das ist der **umgekehrte** Weg — Wissenschaft in ein Spiel hinein statt ein Spiel um ein Stück Welt herum.

**Was nach dieser Recherche wirklich fehlt:** ein Spielobjekt, das außerhalb des Spiels weiterlebt und aus echten Gründen stirbt. Alle gefundenen Nachbarn kuratieren ihre Welt entweder vollständig (Portale, Instanzen) oder verzichten auf den Besitz (Bestimmungsduelle). Die Kreuzung ist leer.

## Vorarbeit

- **Pl@ntNet / The Plant Game** — Bestimmungsmaschine, Spielerbasis, Duell-Modus und Datenmotiv liegen dort bereits zusammen; für sie wäre das eine Erweiterung, kein neues Unternehmen. Deshalb Empfänger Nummer eins und nicht ein Studio.
- **Play Curious** (Jesse Himmelstein) und **MMOS** (Attila Szantner) — beide Convenors des ECSA-2026-Workshops „Games for good: Games and gamification for Citizen Science" (Oulu, 03.03.2026, vorbei). Das Feld hat eine Adresse, und das sind zwei davon.
- **Scientific Game Jam** — der Ort, an dem eine Idee mit Skelett an einem Wochenende gebaut wird, von Leuten, die sich das ausgesucht haben.
- **Merkmalsdatenbanken** — TRY, LEDA, UNDERPLOT, SID, D3, Grime & Hunt, StrateFy, Pladias; zusammengestellt in `02-recherche/fugenduell-brainstorm/data-flora-quellen.md`.

*Ausdrücklich kein Empfänger:* **Stray Fawn Publishing.** Sie publishen Strategie, Simulation und City-Builder und wollen „pitch deck and trailer" an `pitch@strayfawnstudio.com`. Das ist ein Verkaufskanal für fertige Spiele; eine Idee ohne Produkt dort einzuwerfen wäre die Kaltakquise, die das Manifest als Anti-Pattern führt.

*Kontaktadresse beim Zustellen von der jeweiligen Organisationsseite kopieren, nicht raten — hier bewusst nicht eingetragen.*

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
