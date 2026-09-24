---
status: Available
delivery_method: E-Mail
target_maker: '#Krautschau / Senckenberg Gesellschaft für Naturforschung'
---
# Crack Flora Watcher (Ritzengrün-Wächter)

> ⚰️ **Grabbeigabe — zurückgezogen am 21.09.2026, auf den Friedhof am 24.09.2026.**
> Die Restlücke dieser Dose ist widerlegt: **GrowApp** (GLOBE Niederlande) verfolgt dieselbe
> Einzelpflanze mit Ausricht-Overlay und automatischem Zeitraffer, **Nature's Notebook** (USA-NPN)
> registriert Einzelpflanzen für wiederholte Besuche. Die gamifizierte Entdeckung betreibt
> **Flora Incognita** selbst (Krautschau-Projekt, 40 Arten, fünf Stufen) — in dieser Dose als
> nachrangiger Empfänger geführt.
> Totenschein: App-Tab „Friedhof" · Nachruf: `08-friedhof/nachrufe.md` · Belege: `06-suche/amelie-pruefprotokoll.md`, Runde 6.
> **Nachfolgerin: `05-dosen/fugenduell-patenschaft.md`.**
> Text unten unverändert als Beleg dafür, worauf die Dose stand.

**Ein Satz:** Ein Foto derselben Ritzenpflanze über Wochen hinweg wird zum Zeitraffer mit Härtegrad-Score — und mit einem Klick zu einem #Krautschau-tauglichen Datensatz.

**Stand:** September 2026 · **Prüfen ab:** Mai 2027 (#Krautschau-Aktionswoche)
**Empfänger:** #Krautschau / Senckenberg Gesellschaft für Naturforschung · nachrangig: Flora-Incognita-Forschungsgruppe (MPI Biogeochemie Jena / TU Ilmenau), NABU Urbanes Grün
**Verdikt:** 🎁 verschenken — Forschung mit Saisonfenster, Prämisse verengt

---

## Das Problem

Millionen Stadtbewohner:innen laufen täglich an Pflanzen vorbei, die sich durch Asphaltritzen, Mauerspalten und Bordsteinkanten kämpfen — und sehen sie nicht („Plant Blindness") oder behandeln sie als Unkraut.

Zwei Dinge existieren bereits und lösen das Problem nur zur Hälfte: **Generische Bestimmungs-Apps** (PlantNet, Flora Incognita, Seek/iNaturalist) sagen, welche Pflanze das ist, aber nichts über ihre Geschichte an diesem Ort. **#Krautschau** (Senckenberg) mobilisiert einmal im Jahr, im Mai, Tausende Menschen mit Kreide und Hashtag — aber das Fenster ist eine Woche, danach ist die Aufmerksamkeit weg, und es gibt kein Werkzeug, das dieselbe Pflanze über die Saison hinweg verfolgt.

Wer leidet: Stadtökolog:innen, denen mikro-geotaggte Longitudinaldaten zu Pionierarten an Hitze- und Salzinseln fehlen — und die #Krautschau-Organisator:innen selbst, deren Aktionswoche jedes Jahr bei null anfängt.

## Warum das jetzt geht

1. **On-device-Klassifikation ist gratis geworden.** Ein TFLite-Modell für die häufigsten fünfzig Ritzenarten läuft direkt auf dem Handy; seltene Arten gehen per API an Flora Incognita oder PlantNet. Vorher wäre das ein eigenes Forschungsprojekt gewesen.
2. **Bildausrichtung per Kantenabgleich ist Standard-Bibliothekscode.** Dieselbe Pflanze über Monate exakt im selben Ausschnitt zu re-fotografieren war 2020 noch eine Bastelei, heute eine Funktion aus OpenCV/Canvas.
3. **GeoJSON/GBIF-Export ist ein gelöstes Format-Problem.** Eine Beobachtung standardisiert exportierbar zu machen bedeutet heute: einer bestehenden Schnittstelle folgen, nicht eine erfinden.

## Skizze

- Foto → On-device-Artbestimmung (Fallback: Flora-Incognita-/PlantNet-API) → Substrat- und Standortabfrage (Asphalt, Mauerritze, Kopfsteinpflaster, Trittbelastung).
- **Härtegrad-Index (1–10):** aus Substrat, Sonneneinstrahlung, Trittbelastung, Überlebensdauer — ein Zahlenwert, der die Pflanze als Überlebenskünstlerin einordnet, kein Ranking-Spiel um seiner selbst willen.
- **Zeitraffer:** Kamera-Overlay richtet neue Fotos am alten Rissverlauf aus; aus wiederholten Aufnahmen wird ein Video vom Keimling bis zur Blüte.
- **Export-Knopf:** eine Beobachtung → GeoJSON mit 25-m-Geofuzzing (schützt private Hauseingänge) → #Krautschau- und GBIF-kompatibel.

**Nicht dabei:** keine eigene Artdatenbank (die liefern PlantNet/Flora Incognita), kein Leaderboard zwischen Nutzer:innen, kein Social Feed. Das Ziel ist ein Datensatz, kein Wettbewerb.

## Erster Schritt

**Ticket: Ein Riss, zwei Fotos, ein Härtegrad-Score.**

Minimaler Prototyp: Web-App mit Kamera-Upload. Foto einer Pflanze im Gehweg, Artbestimmung per API, Härtegrad aus zwei Substrat-Fragen berechnet.

**Fertig, wenn:** eine Pflanze im Straßenbelag fotografiert, bestimmt, mit einem Härtegrad-Wert versehen und als #Krautschau-kompatibler Datensatz exportiert werden kann.

## Wo es kippt

**Verwechslung mit Seek.** Seek (iNaturalist) gamifiziert das Entdecken von Ritzenpflanzen bereits mit Badges und Challenges — wer diese Dose als „Seek für Ritzen" liest, hat recht und sollte sie nicht bauen. Der einzige tragfähige Unterschied ist die **Longitudinalspur**: dieselbe Pflanze über Wochen, nicht neue Funde für Punkte. Ohne das Zeitraffer-Feature ist das Projekt redundant.

**Vandalismus-Risiko.** Nutzer:innen könnten Pflanzen ausreißen, um Wurzeln zu prüfen. Gegenmaßnahme: feste Verhaltensregel in der App, im Geiste von #Krautschau — nur fotografieren, nie ausreißen.

## Wer es schon versucht hat

Recherche September 2026: **die Grundidee „Ritzenpflanzen gamifiziert entdecken" existiert bereits und ist keine Lücke.** Seek von iNaturalist gamifiziert exakt das — Badges, Challenges, inklusive Stadtunkraut — mit einer riesigen bestehenden Nutzerbasis. PlantNet und Flora Incognita liefern die Bestimmung wissenschaftlich sauber, ohne Spielelement. #Krautschau macht das kulturelle Ritual (Kreide, Hashtag), aber nur eine Woche im Jahr, ohne persistentes digitales Werkzeug.

**Was fehlt, nach dieser Recherche, wirklich:** ein Werkzeug, das dieselbe Einzelpflanze über die Saison verfolgt (keine der genannten Apps tut das) und die Beobachtung automatisiert in das #Krautschau-/GBIF-Format bringt. Das ist eine schmalere Idee als ursprünglich gepackt — sie geht als verengte Prämisse raus, nicht als "neue Ritzenpflanzen-App".

## Vorarbeit

- **Seek / iNaturalist** — Gamification-Vorbild, direkter Nachbar, nicht Konkurrenz für die Longitudinal-Nische.
- **Flora Incognita** (MPI Biogeochemie Jena / TU Ilmenau) — Artbestimmung, Projekt-Tag-Mechanismus (z. B. GartenDiv, PhänoNetz) als Vorbild für eine mögliche Integration statt einer separaten App.
- **#Krautschau** (Senckenberg, Dr. Julia Krohmer koordiniert seit 2020) — Zielevent Mai, Zielformat für den Export.
- **GBIF / OpenStreetMap** — Zielstandards für den Datenexport.

*Kontaktadresse beim Zustellen von der jeweiligen Organisationsseite kopieren, nicht raten — hier bewusst nicht eingetragen.*

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
