# Echter Zufall als Service

**Ein Satz:** Ein MCP-Server zwischen Rauschdiode und Agent — dreißig Zeilen, und jeder Würfelwurf, jedes Sigil, jede Kartenziehung zieht aus physikalischem Rauschen statt aus `Math.random()`.

**Stand:** September 2026 · **Prüfen ab:** September 2027
**Empfänger:** Infinite Noise TRNG (`waywardgeek/infnoise`, Vertrieb über leetronics in Deutschland) · nachrangig: Crowd-Supply-/Hackaday-Öffentlichkeit, Kryptographie-Lehre
**Verdikt:** 🔨 erst Skelett bauen, dann verschenken — Einzelmaintainer, also mit Code kommen

---

## Das Problem

Es gibt zwei Welten, die sich nie begegnet sind.

In der einen liegt seit Jahren offene, bezahlbare TRNG-Hardware herum: Rauschdioden, Ringoszillator-Jitter, fertige USB-Sticks für unter hundert Euro, vollständig dokumentiert. Sie wird fast ausschließlich für Kryptographie benutzt, wo sie hingehört.

In der anderen ziehen Millionen von Anwendungen Zufall aus einem Pseudozufallsgenerator, der mit der Systemzeit geseedet ist. Für Kryptographie wäre das fatal, für ein Würfelspiel ist es egal — **außer dort, wo der Zufall selbst der Gegenstand ist.** Eine Tarot-App, ein Würfelorakel, ein I-Ging, ein generatives Kunstwerk, ein Losverfahren: Da ist die Herkunft des Zufalls nicht Implementierungsdetail, sondern die halbe Aussage.

Wer leidet: niemand dringend. Aber es ist eine der wenigen Ideen im Stapel, bei denen **ein Nachmittag Arbeit eine dauerhaft nützliche Infrastruktur** ergibt.

## Warum das jetzt geht

1. **MCP hat den Stecker standardisiert.** Vorher hätte jede Anwendung eine eigene Integration gebraucht. Jetzt ist es ein Tool-Server, den beliebig viele Agents und Anwendungen ansprechen.
2. **Die Hardware ist fertig und offen.** Es muss nichts entwickelt werden — nur verbunden.
3. **Es gibt plötzlich Abnehmer.** Agentische Anwendungen, die würfeln, losen, ziehen oder generieren, sind seit Kurzem zahlreich. Die Nachfrageseite existiert erst seit zwei Jahren.

## Skizze

- Raspberry Pi oder beliebiger Rechner mit TRNG-Stick.
- MCP-Server mit drei Werkzeugen: `random_bytes(n)`, `random_int(min, max)` (mit korrekter, verzerrungsfreier Ablehnungsmethode), `draw(from_list, k, with_replacement)`.
- **Health-Endpoint als Kernstück, nicht als Beiwerk:** laufende Min-Entropie-Schätzung, Zustand der Quelle, und eine ehrliche Antwort, wenn die Hardware nicht erreichbar ist.
- **Niemals stillschweigend auf `Math.random()` zurückfallen.** Wenn die Quelle weg ist, ist der Aufruf ein Fehler. Ein Server, der heimlich Pseudozufall liefert, macht die ganze Idee zunichte.

**Nicht dabei:** kein Kryptographie-Anspruch, keine Zertifizierung, kein Schlüsselmaterial. Für echte Kryptographie nimmt man das Betriebssystem-CSPRNG — das ist keine Bescheidenheit, sondern richtig.

## Erster Schritt

**Ticket: Bytes durchreichen, Zustand melden.**

MCP-Server, der die Hardware liest, `random_bytes` bereitstellt und im Health-Check die geschätzte Min-Entropie ausgibt.

**Fertig, wenn:** ein Agent würfeln kann, und beim Abziehen des Sticks eine klare Fehlermeldung kommt statt stiller Ersatzwerte.

## Wo es kippt

**Die größte Gefahr ist Theater.** Physikalischer Zufall ist für 99 % der Anwendungen nicht besser als ein guter PRNG — er ist nur ehrlicher in Bezug auf die Herkunft. Wer das Ding mit Sicherheitsversprechen bewirbt, verkauft Aberglauben an Leute, die es nicht prüfen können. Die richtige Positionierung ist ästhetisch und epistemisch, nicht sicherheitstechnisch: *Du weißt, woher diese Zahl kommt.*

**Zweites Risiko:** Verfügbarkeit. Ein Dienst, der an einem Gerät auf einem Schreibtisch hängt, ist mal weg. Deshalb der harte Fehler statt Fallback — und deshalb gehört das Ding zu jemandem, der die Hardware ohnehin betreibt.

## Wer es schon versucht hat

Recherche September 2026: Es gibt einen MCP-Server für Zufallszahlen, aber auf Softwarebasis. **Eine Brücke von echter Rauschquellen-Hardware zu MCP habe ich nicht gefunden.** Die Hardware-Szene (TRNG-Sticks, Crowd-Supply-Projekte, Forschung zu Entropiequellen) und die Agent-Szene sind zwei getrennte Welten mit null Überlappung.

Diese Lücke ist so klein und so offensichtlich, dass sie wahrscheinlich in zwölf Monaten zu ist. Also entweder bald oder nie.

## Vorarbeit

- **Infinite Noise TRNG** (`waywardgeek/infnoise`, Crowd-Supply-Historie, Vertrieb über leetronics in Deutschland) — fertige offene Hardware mit Treiber. **Einzelmaintainer: nur mit lauffähigem Code ansprechen, niemals als Feature-Wunsch.**
- **MCP-Registries** — der Verteilweg, sobald der Server läuft.
- **Die eigenen Nachbardosen** — Tarot-DSL und Würfel-Toys sind die ersten Abnehmer. Ein Geschenk, das andere Geschenke bedient.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
