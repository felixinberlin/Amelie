# Amélie (Deutsche Dokumentation)

> **Ideen, die jemand anderem gehören.**
> *Hinweis: Die maßgebliche Fassung ist das englische [Haupt-README](./README.md).*

Ein Verfahren, um App-Ideen, die man selbst nicht bauen wird, an die Leute zuzustellen, die sie bauen können. Benannt nach Amélie Poulain: Sie findet eine Blechdose hinter einer Fliese, recherchiert vierzig Jahre später den Jungen, dem sie gehörte, legt sie ihm in eine Telefonzelle und verschwindet. Sie sucht sich die Person aus, bevor sie das Geschenk macht, und fragt hinterher nie nach.

Stand: 13. Oktober 2026 · Félix, Berlin · alle Inhalte CC0 · Website: [felixinberlin.github.io/Amelie](https://felixinberlin.github.io/Amelie/)

---

## Was es heute ist

Angefangen hat es mit einer Liste von 19 Ideen. Heute sind es drei Dinge:

1. **Eine Galerie von Geschenken („Dosen“).** Jede Dose ist ein Einseiter auf Deutsch und Englisch: Problem, warum jetzt, Skizze, erstes Ticket, wo es kippt, wer es schon versucht hat, und eine namentliche Empfängerin oder ein Empfänger. Jede Dose hat eine Seite auf der Website, viele mit Simulator: `https://felixinberlin.github.io/Amelie/#dose=<id>`.
2. **Lauffähige Startpunkte.** 14 Dosen haben Code und Tests in `07-demos/` und `src/engine/`; wer sie bekommt, bekommt einen Anfang, nicht nur eine Idee.
3. **Ein Gedächtnis, das jede Suche besser macht als die letzte.** Jede geprüfte Idee steht mit Urteil im Protokoll, jede gestorbene bekommt einen Totenschein, jede Quelle wird geführt. Ein Agententeam und eine Kommandozeile arbeiten darauf.

## Die Bilanz (13.10.2026)

| | |
|---|---|
| Dosen gepackt | **46** (5 zugestellt, 41 gepackt und warten auf eine geprüfte Empfängerperson) |
| Lauffähige Demos | **14** (`07-demos/`) |
| Geprüfte Ideen | **470** Protokollzeilen: 26 frei, 130 verengt, 124 unklar, 133 besetzt, 57 sonst |
| Friedhof | **149** Gräber, 74 davon, weil es schon jemand gebaut hatte |
| Geführte Quellen | **324** (Gremien, Datensätze, Normen, Förderer, Preise, Empfänger) |

Aktuelle Zahlen: `npm run bib -- status` und [`AMELIE_STATUS.md`](./AMELIE_STATUS.md).

## Was bisher zugestellt wurde

| Datum | Dose | An | Ergebnis |
|---|---|---|---|
| 20.09.2026 | Altbau Thermal | Forschungsverbund EnergyMap Berlin (UdK Berlin) | keine Antwort verzeichnet |
| 21.09.2026 | Sperrmüll-Radar, Kiez-Lärmkarte | CityLAB Berlin | keine Antwort verzeichnet |
| 21.09.2026 | Kiez-Lärmkarte | Université Gustave Eiffel / CNRS (NoiseCapture) | keine Antwort verzeichnet |
| 22.09.2026 | Glasanflug-Ampel | NABU-Bundesgeschäftsstelle | Standardantwort mit sachlicher Korrektur, in die Dose eingearbeitet |
| 27.09.2026 | Arcana Schema (Tarot als Zustandsmaschine) | Moderation r/tarot | vorab um Erlaubnis gefragt |
| 27.09.2026 | ChemGefahr-Stopp | IG BAU, BG BAU, BIV (Gebäudereinigung) | keine Antwort; die Mails beschrieben das Werkzeug zu groß, Richtigstellung als Entwurf ([Mail 11b](./03-zuordnung/mails-q4-2026/mail-11b-korrektur.md)) |
| 28.09.2026 | die Methode selbst | r/ClaudeCode, Showcase-Thread | gepostet |
| 09.10.2026 | Glasanflug-Ampel | NABU Jena (Vogelschlagmelder) | **positive Antwort** am 12.10. |

Volltexte und Status: [`src/data/deliveries.ts`](./src/data/deliveries.ts) und `03-zuordnung/mails-q4-2026/`.

## Die nächsten konkreten Schritte

- **ChemGefahr-Stopp:** über die einmalige Richtigstellung entscheiden; [Ticket 04](./07-demos/chemhazard-stop/ticket-04-web-scanner-und-qr-etiketten.md) bauen (Kamera-Scan im Browser, QR-Etiketten für Umfüllflaschen), bevor jemand Neues angeschrieben wird.
- **Regel für jede Mail ab jetzt:** nur beschreiben, was gebaut und getestet ist. Vorbild ist die Mail an NABU Jena.

---

## Wo anfangen

| Wenn du … | dann lies |
|---|---|
| wissen willst, worum es geht | [`01-konzept/amelie-manifest.md`](./01-konzept/amelie-manifest.md) |
| die Geschenke ansehen willst | [die Website](https://felixinberlin.github.io/Amelie/) oder `05-dosen/` |
| sehen willst, was verschickt wurde und wie es lief | [`03-zuordnung/amelie-zustellplan-q4-2026.md`](./03-zuordnung/amelie-zustellplan-q4-2026.md) |
| wissen willst, ob das funktioniert | `02-recherche/amelie-landschaft.md`, `amelie-bewegungen.md`, `amelie-verwandte.md` |
| eine neue Ideenrunde starten willst | [`06-suche/amelie-rundenstart.md`](./06-suche/amelie-rundenstart.md), die Agenten für Menschen erklärt in [`06-suche/amelie-agenten-fuer-menschen.md`](./06-suche/amelie-agenten-fuer-menschen.md) |
| prüfen willst, ob es eine Idee schon gibt | `npm run bib -- find <Begriffe>` ([Handbuch](./06-suche/amelie-bibliothek-cli.md)) |
| eine eigene Idee verpacken willst | [`04-werkzeug/amelie-vorlagen.md`](./04-werkzeug/amelie-vorlagen.md) |
| Ideen oder Code beitragen willst | [`CONTRIBUTING.md`](./CONTRIBUTING.md) |
| Entwickler-Doku suchst | [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`docs/website-routing.md`](./docs/website-routing.md) |
| als KI-Agent an diesem Repo arbeitest | [`AGENTS.md`](./AGENTS.md) |
| Roadmap, Entscheidungen, Verhaltensregeln suchst | [`ROADMAP.md`](./ROADMAP.md), [`GOVERNANCE.md`](./GOVERNANCE.md), [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) |
| Übersetzungen pflegen willst (XLIFF) | [`04-werkzeug/amelie-i18n-xliff.md`](./04-werkzeug/amelie-i18n-xliff.md) |

## Starten

```bash
npm ci
npm run dev            # Website lokal
npm test               # Vitest
npm run lint           # TypeScript + Drift-Wächter (Dosen ↔ Daten, Protokoll, Friedhof, Quellen, Diagramme)
npm run export:data    # public/data/*.json nach jeder Dosen-Änderung neu erzeugen
npm run bib -- hilfe   # die Gedächtnis-Kommandozeile
```

Eine Dose lebt an zwei Stellen: im Markdown (`05-dosen/<id>.md`, `en/05-dosen/<id>.md`) und in den Website-Daten (`src/data/dosen.ts`). Beide ändern, dann `npm run export:data`. Mehr in [`AGENTS.md`](./AGENTS.md).

---

## Was drin ist

| Ordner | Inhalt |
|---|---|
| `00-quelle/` | die ursprüngliche Liste mit 19 Ideen und der Wet-Ink-Plan |
| `01-konzept/` | das Prinzip: Manifest (fünf Regeln, Dosen-Format, Pledge) und Loop (Kadenz, Budget, wann aufhören) |
| `02-recherche/` | warum es so läuft: vergleichbare Projekte, Bewegungen, nächste Verwandte mit Kontaktwegen, Recherche zu einzelnen Dosen |
| `03-zuordnung/` | wer was bekommt: Matrix, Zustellplan, jede Mail in `mails-q4-2026/` |
| `04-werkzeug/` | Vorlagen (Dose, Kaltmail, Repo-README), XLIFF-Leitfaden, Mail-Anleitung |
| `05-dosen/` | die 46 Dosen (deutsch); englisch in `en/05-dosen/` |
| `06-suche/` | wie Ideen gefunden und geprüft werden: Prüfprotokoll, Suchplaybook, Quellen-Register, Förderlandschaft, Engine-Logs, Handbücher |
| `07-demos/` | lauffähiges Scaffolding je Dose: README, Tickets, Daten, Schemata |
| `08-friedhof/` | der Friedhof: jede gestorbene Idee mit Ursache, Killer, Fundweg und Mustern über alle Gräber (Daten in `src/data/graeber.json`) |
| `src/` | die Website (React + Vite), Dosen-Daten, Engines mit Tests |
| `skills/`, `.claude/agents/` | Entdeckungs-Engines, Reviewer, Packer, Demo-Bauer und Bibliothekar als Skills und Agenten |
| `scripts/` | Bibliotheks-CLI (`bib`), Exporte, Drift-Wächter, Crew von der Kommandozeile (`npm run agent`, `npm run teamrunde`) |
| `blog/` | Artikel, z. B. Agenten-Orchestrierung ohne Pleite |
| `packages/` | Wet-Ink-Pakete |
| `ventures/` | die getrennte kommerzielle Spur; `main` bleibt CC0 |

## Wie neue Ideen gefunden werden

Vier Entdeckungs-Engines laufen parallel auf ein Thema: Primärquellen (`ideen-scout`), Kollision ferner Rahmen (`bisoziations-kollider`), Umkehr regulierter Systeme (`inversions-agent`) und „was hat sich geändert“ (`constraint-release-agent`). Ihre Kandidaten werden zusammengeführt, ein unabhängiger Reviewer bewertet sie über acht Vektoren (Neuheit, Komplexität, Machbarkeit, Haltbarkeit, Civic-SWOT, Tech-Tree, Belegstand, Spaß), und nur „Dose Ready“ wird gepackt und gebaut. Nur der Bibliothekar schreibt das gemeinsame Gedächtnis. Vorher ist der Gang über den Friedhof Pflicht, damit keine Wiedergänger entstehen.

**Wo es frei ist, nach 470 Prüfungen:**

| Bereich | Ergebnis |
|---|---|
| Entwickler-Tooling im aktiven Ökosystem | fast vollständig besetzt |
| Schöne Demos (3D, DLA, Fluidsim) | vielfach gebaut; Restwert im langweiligen Teil |
| Kommerziell attraktive Endnutzer-Apps | von Firmen besetzt |
| EU-Compliance-Register, Erinnerungsarbeit, Apotheke, Multiplayer | dicht, meist schon beim Empfänger |
| **Zivilgesellschaft, Verwaltung, Vereine** | **frei, aber öfter fehlt der Empfänger als die Technik** |

Frei ist genau das, womit sich kein Geld verdienen lässt und wofür keine Entwicklerszene existiert. Das ist keine Einschränkung des Modells, sondern sein Anwendungsbereich, und ausgerechnet der, in dem Geschenke am meisten bewirken.

---

## Die fünf Regeln, in Kurzform

1. **Die Zustellung ist das Geschenk, nicht der Fund.** Pro Idee eine Stunde, pro Prüfung eine, pro Empfänger zwei.
2. **Signieren, aber nichts verlangen.** Name drunter, CC0 darüber, keine Bedingung.
3. **Einmal zustellen, dann weg.** Kein Nachfassen.
4. **Wer nicht gefragt hat, kriegt Werkzeug, kein Projekt.** Reine Ideen nur an Firmen, Forschung, Fördertöpfe und Vereine; an unbezahlte Einzelmaintainer nur mit lauffähigem Code.
5. **Nicht zur Ausrede machen.** Maximal zwei Ideen behalten und wirklich bauen. Verschenken fühlt sich produktiv an und ist trotzdem kein Bauen.

## Der Pledge

Er steht auf jeder Dose, nach dem Vorbild der Open Source Seed Initiative, die ihre Formel auf die Saatguttüte druckt:

> **Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.**

Das ist der Kula-Ring in drei Sätzen: Die Gabe geht weiter, nicht zurück.
