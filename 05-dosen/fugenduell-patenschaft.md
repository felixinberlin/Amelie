---
status: Available
delivery_method: E-Mail
target_maker: CityLAB Berlin / Technologiestiftung
review_score: 29/35
architecture_tier: Tier 2
source_type: Type B
---
# Beobachtungsposten mit Übergabe

**Ein Satz:** Eine Patenschaft, die niemand mehr ausübt, sagt der Nachbarschaft weiterhin „für diesen Baum ist gesorgt" — dieser Posten soll stattdessen sichtbar altern, frei werden und nachbesetzt werden können, ohne dass die Messreihe abreißt.

**Stand:** 21.09.2026 · **Prüfen ab:** 03/2027 (verkürzt: Nature's Notebook bringt Frühjahr 2026 eine neue App, das Feld bewegt sich)
**Empfänger:** CityLAB Berlin / Technologiestiftung (Gieß den Kiez) · nachrangig: GLOBE Niederlande (GrowApp), USA-NPN (Nature's Notebook)
**Verdikt:** 🎁 verschenken — schmal, aber am Quellcode des Empfängers belegt  
**Review:** 29/35 · Tier 2 · Type B (Details: [Audit-Bericht](../06-suche/amelie-39-dosen-audit-report.md))

---

## Das Problem

Gieß den Kiez lässt Menschen einen einzelnen Straßenbaum adoptieren. Der Zweck steht in der App selbst:

> „Durch das Adoptieren eines Baumes — oder auch mehrerer — lässt Du Deine Nachbarschaft wissen, **dass für diese Bäume gesorgt wird**. So gelingt ein koordiniertes Engagement."

Diese Zusage wird nie zurückgenommen. Im Quellcode gibt es genau zwei Operationen, `adoptTree` und `unadoptTree`, und `unadoptTree` muss die Patin selbst auslösen. Es gibt keinen Ablauf, keine Inaktivitätsprüfung, keine Übergabe — die Begriffe kommen im Repository nicht vor.

Die Folge ist keine Kleinigkeit, sondern die Umkehrung des Versprechens: **Wer wegzieht, krank wird oder das Interesse verliert, hinterlässt einen Baum, der für die Nachbarschaft als versorgt markiert ist und es nicht mehr ist.** Je länger das Projekt läuft, desto mehr solcher Marken sammeln sich an, und desto weniger sagt die Karte aus. Ein Werkzeug gegen Trockenschäden wird mit der Zeit zu einem Werkzeug, das Trockenschäden verdeckt.

Dasselbe Muster, eine Ebene höher, kostet die Wissenschaft ihre wertvollsten Daten: **GrowApp** und **Nature's Notebook** binden eine Beobachtungsreihe ans Nutzerkonto. Hört das Konto auf, hört die Reihe auf; wer denselben Baum später fotografiert, beginnt bei Bild 1. #Krautschau mobilisiert jeden Mai zehntausende Menschen — 2026 waren es 85 Spaziergänge in 66 Städten — und fängt im Mai darauf wieder bei null an.

Das ist kein Motivationsproblem. Es fehlt ein Zustand zwischen „betreut" und „nie dagewesen".

## Warum das jetzt geht

Eine Nachbesetzung scheitert an einer Beweisfrage: Woher weiß die Nachfolgerin, dass sie **dasselbe** Individuum vom **selben** Standpunkt aufnimmt? Bis vor kurzem ging das nur mit Flatterband, GPS-Pfosten und Einweisung im Feld — deshalb gibt es Übergaben bisher nur in betreuten Messnetzen, nicht in Bürger-Apps.

1. **Bildregistrierung ist Bibliothekscode.** Das vorige Foto halbtransparent einblenden und den Standpunkt darüber wiederfinden, setzt GrowApp heute ein. Was fehlt, ist nur, dass das Overlay **einer anderen Person** gehören darf.
2. **Individuum-Segmentierung läuft on-device.** Nicht „welche Art", sondern „dieselbe Pflanze wie auf Bild 1" — Instanzsegmentierung plus Merkmalsabgleich, 2022 noch ein Forschungsprojekt.
3. **Der Alterungs-Teil braucht gar keine KI.** Bei Gieß den Kiez sind die Gießvorgänge bereits mit Zeitstempel erfasst; das Signal liegt in der Datenbank und wird nur nicht ausgewertet. Die KI wird erst für Schritt zwei gebraucht, die bestätigte Nachbesetzung.

## Skizze

- **Der Posten ist das Objekt, nicht der Mensch:** ein Baum bzw. eine Pflanze, ein Standpunkt, ein Aufnahmerezept (Höhe, Blickrichtung, Referenzobjekt im Bild).
- **Zustand am Posten**, öffentlich sichtbar: `betreut` → `überfällig` → `sucht Nachfolge`. Die Schwelle kommt aus der Sache — Gießintervall in der Hitzeperiode, phänologisches Fenster der Art — nicht aus einer runden Zahl.
- **Nachbesetzung:** Wer einen Posten mit Status `sucht Nachfolge` übernimmt, bekommt die letzte Aufnahme als Overlay und liefert einen Treffer, der Standpunkt und Individuum bestätigt. Gelingt das, läuft die Reihe **ohne Bruch** weiter.
- **Die Historie gehört dem Posten.** Wer aufhört, verliert die Rolle, nicht die Beobachtungen; jede Aufnahme bleibt der Person zugeordnet, die sie gemacht hat.

**Nicht dabei:** kein Wettbewerb um Posten, kein Duell, kein Entreißen aktiver Patenschaften, kein Ranking zwischen Menschen, keine eigene Artdatenbank, keine neue App. Das ist eine Erweiterung für eine bestehende Plattform.

Warum ausdrücklich kein Wettbewerb: Die Idee stammt aus einem Brainstorm, dessen Kern eine *Übernahme gegen den Willen* der Patin ist (Foto-Duell, Wissensquiz, Kampf). Die Mechanik selbst ist ausgereift — in Standortspielen: Munzee-Places, Pokémon-GO-Arenen, Ingress-Portale. Dort gehört sie zu einem virtuellen Objekt, das niemandem etwas schuldet. Hier hinge sie an Menschen, die ehrenamtlich gießen. Verfall plus Nachbesetzung ist die Hälfte davon, die trägt.

## Erster Schritt

**Ticket: Ein Posten wechselt die Person, die Reihe bricht nicht.**

Ein Datensatz mit drei Aufnahmen von Person A. Person B öffnet den Posten, bekommt Aufnahme 3 als Overlay, macht Aufnahme 4.

**Fertig, wenn:** der Export die vier Aufnahmen als *eine* Zeitreihe ausgibt, mit korrekter Zuordnung „wer hat wann" und ohne Bruch an der Übergabestelle.

*Für Gieß den Kiez gibt es einen kleineren Vorlauf-Schritt, der ohne jede KI auskommt: dem Adoptionsmarker ein Alter geben und ihn auf der Karte altern lassen. Die Gießdaten dafür liegen schon vor.*

## Wo es kippt

**Wenn der Marker das falsche Objekt ist.** Bei Gieß den Kiez ist die Adoption **nicht exklusiv** — mehrere Menschen können denselben Baum adoptieren, die App zeigt „Auch von anderen User:innen adoptiert". Ein Verfall pro Person ist dann sinnlos; altern muss die **Versorgung des Baums**, nicht das Lesezeichen des Menschen. Wer das verwechselt, baut eine Funktion, die niemandem hilft.

**Wenn Verfall wie eine Drohung wirkt.** „Deine Patenschaft läuft ab" vertreibt genau die Leute, die man halten will. Der Zustand gehört an den Posten und neutral formuliert („sucht Nachfolge"), nie an den Menschen („du hast versäumt"). Wird daraus ein Wettbewerb, ist es eine andere Idee.

**Wenn die Reihe niemanden interessiert.** Nachbesetzung lohnt nur, wo die Reihe ein Ziel hat (GBIF, ein Phänologienetz, ein kommunaler Datensatz). Ohne abnehmende Stelle ist das Buchhaltung.

**Wenn die Bestätigung zu streng ist.** Verweigert die Prüfung die Nachbesetzung bei schlechtem Licht oder nach einem Rückschnitt, ist der Posten tot statt frei. Sie muss überstimmbar sein.

## Wer es schon versucht hat

Recherche 21.09.2026, Protokoll: `06-suche/amelie-pruefprotokoll.md`, Runde 6 und Nachtrag. Belege unten stammen aus gelesenen Primärseiten bzw. aus dem Quellcode, nicht aus Suchzusammenfassungen.

- **Gieß den Kiez** (CityLAB Berlin / Technologiestiftung, seit 2020, 885.825 Bäume, quelloffen, Forks in Leipzig und Magdeburg). **Quellcode geprüft** (`github.com/technologiestiftung/giessdenkiez-de`, Klon vom 21.09.2026): Der Adoptions-Store kennt `adoptTree`, `unadoptTree` und `refreshIsTreeAdoptedByOthers` — sonst nichts. Kein Treffer im Repo für Ablauf, Inaktivität, Übertragung oder Verwaisung. Adoption ist nicht exklusiv und dient als Sichtbarkeits- und Koordinationsmarke.
- **Nature's Notebook** (USA-NPN): registriert Einzelpflanzen mit Spitznamen für Wiederbesuche. **Der Local-Phenology-Program-Leitfaden kennt eine Übergabe** — „you can transfer ownership of your managed Group to another person very easily via the Manage Users functionality before you depart" — aber auf **Gruppen-/Programmebene**, als Verwaltungsakt, und sie setzt voraus, dass die scheidende Person **vorher handelt**. Genau der Fall, um den es hier geht — sie handelt nicht —, ist damit nicht abgedeckt. Der Leitfaden behandelt Personalwechsel sonst organisatorisch (Nachfolge dokumentieren, zweite Person als Admin benennen).
- **GrowApp** (GLOBE Niederlande, European Phenology Campaign): dieselbe Einzelpflanze über Zeit, voriges Foto transparent zum Ausrichten, automatischer Zeitraffer ab dem zweiten Bild. Deckt den Zeitraffer vollständig ab; Reihe hängt am Konto.
- **Flora Incognita** betreibt ein eigenes #Krautschau-Projekt: Abzeichen über 40 Arten in fünf Stufen, „Flora-Routine" mit Geozone und automatischer Projektzuordnung. Senckenberg empfiehlt es offiziell, daneben ObsIdentify.
- **Standortspiele** (Munzee Places, Pokémon GO, Ingress) beherrschen Inbesitznahme und Verteidigung von Orten seit Jahren — bezogen auf virtuelle Objekte, ohne Pflegepflicht und ohne Messreihe.

**Was nach dieser Recherche wirklich fehlt:** ein Zustand „sucht Nachfolge", der **ohne Zutun der scheidenden Person** eintritt, und eine bestätigte Fortführung derselben Reihe durch eine zweite Person. Nature's Notebook kann übergeben, wenn jemand übergibt. Niemand kann nachbesetzen, wenn jemand einfach aufhört.

*Diese Dose ersetzt `crack-flora-watcher.md`. Deren Restlücke („Longitudinalspur derselben Pflanze fehlt bei allen gefundenen Apps") ist am 21.09.2026 widerlegt worden.*

## Vorarbeit

- **Gieß den Kiez** — quelloffen, Berlin, Adoption und Gießprotokoll existieren samt Zeitstempeln; der naheliegendste Ort, das einzubauen statt neu zu bauen.
- **GrowApp** — das Ausricht-Overlay ist gebaut und funktioniert; Vorbild, nicht Konkurrenz, sobald das Overlay übertragbar wird.
- **USA-NPN Local Phenology Program Guide** — das Übergabeproblem ist dort als Organisationsaufgabe beschrieben; die Vorlage für alles, was nicht Software ist.
- **#Krautschau / Senckenberg** — Saisonfenster 14.–23.05.2027, der natürliche Anlass für eine erste Staffel.
- **Fugenduell-Brainstorm** (`02-recherche/fugenduell-brainstorm/`) — Herkunft der Idee; die Wettbewerbsmechanik daraus ist bewusst nicht übernommen, Begründung oben.

*Kontaktadresse beim Zustellen von der jeweiligen Organisationsseite kopieren, nicht raten — hier bewusst nicht eingetragen.*

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
