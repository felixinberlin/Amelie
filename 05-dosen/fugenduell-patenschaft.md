# Beobachtungsposten mit Übergabe

**Ein Satz:** Eine Messreihe an einer einzelnen wilden Pflanze bekommt einen Nachfolger, wenn die Person aufhört — der Posten verfällt sichtbar, wird frei, und wer ihn übernimmt, führt dieselbe Reihe weiter statt eine neue anzufangen.

**Stand:** 21.09.2026 · **Prüfen ab:** 03/2027 (verkürzt: Nature's Notebook bringt Frühjahr 2026 eine neue App, das Feld bewegt sich)
**Empfänger:** CityLAB Berlin / Technologiestiftung (Gieß den Kiez) · nachrangig: GLOBE Niederlande (GrowApp), USA-NPN (Nature's Notebook)
**Verdikt:** 🎁 verschenken — Restlücke aus einer gekippten Dose, schmal, aber belegt

---

## Das Problem

Longitudinaldaten sind das Einzige, was Bürgerbeobachtung wissenschaftlich wertvoll macht: eine Pflanze über Jahre, vom selben Standpunkt, in derselben Auflösung. Genau diese Daten brechen am zuverlässigsten ab — nicht weil die Pflanze stirbt, sondern weil die Person umzieht, krank wird oder das Interesse verliert.

Wer leidet, konkret:

- **Gieß den Kiez** (CityLAB Berlin) lässt Menschen einen einzelnen Straßenbaum adoptieren und Gießmengen eintragen. Was passiert, wenn eine Patin ein Jahr lang nichts einträgt, steht auf der Projektseite nicht. Der Baum sieht danach aus wie ein Baum ohne Paten — nicht wie ein Baum, dessen Reihe jemand fortsetzen könnte.
- **GrowApp** und **Nature's Notebook** binden die Serie ans Nutzerkonto. Hört das Konto auf, hört die Serie auf. Eine zweite Person, die denselben Baum fotografiert, beginnt bei Bild 1.
- **#Krautschau** (Senckenberg) mobilisiert jeden Mai zehn Tage lang zehntausende Menschen — 2026 waren es 85 Spaziergänge in 66 Städten. Im Juni ist die Aufmerksamkeit weg, und im nächsten Mai fängt alles wieder bei null an.

Das ist kein Motivationsproblem. Es ist ein fehlendes Übergabeprotokoll.

## Warum das jetzt geht

Eine Übergabe scheitert an einer Beweisfrage: Woher weiß die Nachfolgerin, dass sie **dieselbe** Pflanze vom **selben** Standpunkt fotografiert? Bis vor kurzem ging das nur mit Flatterband, GPS-Pfosten und einer Einweisung im Feld — deshalb gibt es Übergaben bisher nur in betreuten Messnetzen, nicht in Bürger-Apps.

1. **Bildregistrierung ist Bibliothekscode.** Das vorige Foto halbtransparent einblenden und den Standpunkt darüber wiederfinden, setzt GrowApp heute schon ein. Was fehlt, ist nur, dass das Overlay **einer anderen Person** gehören darf.
2. **Individuum-Segmentierung läuft on-device.** Nicht „welche Art", sondern „dieselbe Pflanze wie auf Bild 1" — Instanzsegmentierung plus Merkmalsabgleich, die 2022 noch ein Forschungsprojekt waren.
3. **Beides zusammen macht die Übergabe überprüfbar**, ohne dass sich die beiden Menschen je begegnen. Das ist der Teil, der neu ist — nicht die Patenschaft und nicht der Zeitraffer.

## Skizze

- **Der Posten** ist das Objekt, nicht der Nutzer: eine Pflanze, ein Standpunkt, ein Aufnahmerezept (Brennweite, Höhe, Blickrichtung, Referenzobjekt im Bild).
- **Zustand am Posten**, öffentlich sichtbar: `betreut` → `überfällig` → `offen zur Übergabe` → `verwaist`. Die Schwelle kommt aus der Phänologie der Art, nicht aus einer runden Zahl.
- **Übergabe:** Wer einen offenen Posten übernimmt, bekommt das letzte Foto als Overlay und muss einen Treffer liefern, der Standpunkt und Individuum bestätigt. Gelingt das, läuft die Reihe **ohne Bruch** weiter; die Vorgängerin bleibt dauerhaft in der Postenhistorie.
- **Die Historie gehört dem Posten.** Wer aufhört, verliert die Rolle, nicht die Beobachtungen — jede Aufnahme bleibt der Person zugeordnet, die sie gemacht hat.

**Nicht dabei:** kein Wettbewerb um Posten, kein Duell, kein Entreißen aktiver Patenschaften, kein Ranking zwischen Menschen, keine eigene Artdatenbank, keine neue App. Das ist eine Erweiterung für eine bestehende Plattform.

Warum ausdrücklich kein Wettbewerb: Die Idee stammt aus einem Brainstorm, dessen Kern eine *Übernahme gegen den Willen* der Patin ist (Foto-Duell, Wissensquiz, Kampf). Diese Mechanik ist **ungeprüft** (`unklar` im Protokoll, Runde 6) und sie richtet sich gegen Menschen, die ehrenamtlich arbeiten. Übergabe ist die Hälfte davon, die trägt.

## Erster Schritt

**Ticket: Ein Posten wechselt die Person, die Reihe bricht nicht.**

Ein Datensatz mit drei Aufnahmen von Person A. Person B öffnet den Posten, bekommt Aufnahme 3 als Overlay, macht Aufnahme 4.

**Fertig, wenn:** der Export die vier Aufnahmen als *eine* Zeitreihe ausgibt, mit korrekter Zuordnung „wer hat wann" und ohne Bruch an der Übergabestelle.

## Wo es kippt

**Wenn Gieß den Kiez das schon hat.** Gelesen ist nur die Projektseite, nicht das Repo und nicht die Issues. Verfall und Übertragung können dort längst besprochen sein. **Das ist vor jeder Zustellung zu prüfen** — `github.com/technologiestiftung/giessdenkiez-de`.

**Wenn Verfall wie eine Drohung wirkt.** „Deine Patenschaft läuft ab" vertreibt genau die Leute, die man halten will. Der Zustand muss am Posten hängen und neutral formuliert sein („sucht Nachfolge"), nicht am Menschen („du hast versäumt"). Wird daraus ein Wettbewerb, ist es eine andere Idee — eine, die noch niemand geprüft hat.

**Wenn die Reihe niemanden interessiert.** Übergabe lohnt nur, wo die Reihe ein Ziel hat (GBIF, ein Phänologienetz, ein kommunaler Datensatz). Ohne abnehmende Stelle ist das Buchhaltung.

**Wenn die Bestätigung zu streng ist.** Verweigert die Prüfung die Übergabe bei schlechtem Licht oder nach einem Rückschnitt, ist der Posten tot statt frei. Die Bestätigung muss überstimmbar sein.

## Wer es schon versucht hat

Recherche 21.09.2026, Protokoll: `06-suche/amelie-pruefprotokoll.md`, Runde 6. Alle vier Seiten unten selbst gelesen.

- **Gieß den Kiez** (CityLAB Berlin / Technologiestiftung, seit 2020 laufend): Baum adoptieren, Gießmenge eintragen, Patenbäume im Nutzerprofil, 885.825 Bäume, quelloffen inklusive Fork-Wiki für andere Städte. **Die Patenschaft über ein benanntes Individuum gibt es also bereits** — zu Verfall, Exklusivität und Übertragung sagt die Projektseite nichts.
- **GrowApp** (GLOBE Niederlande, European Phenology Campaign): dieselbe Einzelpflanze über Zeit, voriges Foto transparent zum Ausrichten, automatischer Zeitraffer ab dem zweiten Bild. **Deckt den Zeitraffer vollständig ab.**
- **Nature's Notebook** (USA National Phenology Network): Einzelpflanzen mit Spitznamen registrieren, im Feld markieren, wiederholt besuchen; neue App Frühjahr 2026 mit gestuftem Monitoring. US-Fokus, kuratierte Artenliste.
- **Flora Incognita** betreibt ein eigenes #Krautschau-Projekt in der App: Abzeichen über 40 Arten in fünf Stufen, „Flora-Routine" mit Geozone und automatischer Projektzuordnung. Senckenberg empfiehlt es offiziell, daneben ObsIdentify.

**Was nach dieser Recherche wirklich fehlt:** dass eine Reihe die Person überlebt. Keines der vier Werkzeuge kennt einen Zustand „offen zur Übergabe" oder eine bestätigte Fortführung durch eine zweite Person. Das ist deutlich weniger, als die Vorgängerdose behauptet hat — und es ist der Teil, der geprüft ist.

*Diese Dose ersetzt `crack-flora-watcher.md`. Deren Restlücke („Longitudinalspur derselben Pflanze fehlt bei allen gefundenen Apps") ist am 21.09.2026 widerlegt worden.*

## Vorarbeit

- **Gieß den Kiez** — quelloffen, Berlin, Patenschaft und Pflegeprotokoll existieren; der naheliegendste Ort, das einzubauen statt neu zu bauen.
- **GrowApp** — das Ausricht-Overlay ist gebaut und funktioniert; Vorbild, nicht Konkurrenz, sobald das Overlay übertragbar wird.
- **Fugenduell-Brainstorm** (`02-recherche/fugenduell-brainstorm/`) — Herkunft der Idee; die Wettbewerbsmechanik daraus ist bewusst **nicht** übernommen, Begründung oben.
- **#Krautschau / Senckenberg** — Saisonfenster 14.–23.05.2027, der natürliche Anlass für eine erste Staffel.

*Kontaktadresse beim Zustellen von der jeweiligen Organisationsseite kopieren, nicht raten — hier bewusst nicht eingetragen.*

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
