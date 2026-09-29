# Ticket 01: Ein Vorschlag, ein Verzeichnis, ein Prüfhinweis

**Komponente:** `07-demos/strassennamen-pruefer` / `src/engine/strassennamen-pruefer`
**Status:** Offen (Kern, Regeln, Tests und synthetische Fixtures fertig; echte Richtlinienpaare, echtes Verzeichnis und Offline-Seite stehen aus)
**Zuständigkeit:** Civic Tech / Vermessung und Geoinformation
**Zugehörige Dose:** [`05-dosen/strassennamen-pruefer.md`](../../05-dosen/strassennamen-pruefer.md) · [Die Dose online](https://felixinberlin.github.io/Amelie/#dose=strassennamen-pruefer)

---

## 1. Problemstellung & Ziel

Ein reiner TypeScript-Kern `pruefeStrassenname(vorschlag, verzeichnis, optionen)` meldet Doppelungen und Klangzwillinge eines Namensvorschlags als **Prüfhinweis mit Fundstelle**. Er sagt nie „unzulässig"; die Entscheidung bleibt bei Amt und Gremium.

---

## 2. Aufgabenpakete

- [x] **Task 1: Kern und Regeln (`strassennamenPruefer.ts`)**
  - Normalisierung (ß/ss, Umlaute, „Str.", Grundwort abgestreift), Kölner Phonetik, Damerau-Levenshtein, Regeln S1–S4, Schalter Personennamen-Ausnahme und Ortsteil-Markierung, Vorschlagsliste gegeneinander, Sprachwächter, JSON-Ausgabe.
- [x] **Task 2a: Tests (31, ≥ 20 verlangt)**
  - Grundwort-Doppelung, ß/ss, Umlaute, Klangzwilling (Meier/Maier), Personennamen-Ausnahme, unverdächtige Namen (0 Hinweise), Test „nie unzulässig", kein Netzwerkaufruf.
- [x] **Task 3: Schema und synthetische Fixture** (`strassenverzeichnis-schema.json`, `data/`).
- [ ] **Task 2: Testset aus echten Verwechslungspaaren**
  - Die Beispielpaare aus den Richtlinien Drensteinfurt, Bornheim, Dortmund und Frankfurt (Leitfaden 2023) sowie den Sachverhalt VGH Mannheim, 13.11.1978, **an der Primärquelle lesen** und wortgetreu mit Quelle und Abrufdatum in `data/` übertragen. Dabei Absatznummern für `richtlinie.absatz` mitnehmen und die Regeln S1–S3 gegen den Wortlaut prüfen. Bisher stützt sich alles auf Suchschnipsel (Dossier).
- [ ] **Task 4: Echte Straßenliste ohne unerklärte Treffer-Flut**
  - Einen Auszug beschaffen: **GovData** (Datensätze „Straßenverzeichnis") oder **OSM über Overpass** (Straßen einer Gemeinde nach `highway`+`name`; OSM-Lizenz ODbL und Namensnennung beachten). Abrufdatum, URL, sha256 in das Schema (`quelle`) eintragen. Der Abruf geschieht **von Hand oder in einem eigenen Skript, nie im Test**; im Repo liegt nur der Auszug.
  - Mit dem Auszug alle vorhandenen Straßen gegeneinander prüfen: Trefferzahl je Regel ausweisen, Stichprobe von Hand sichten, Schwellen (`minStammLaenge`, `maxDistanz*`) begründet einstellen. Offen ist, wie hoch die Falschalarm-Rate wirklich ist.
- [ ] **Task 5: Statische Offline-Seite**
  - Eine Seite (Datei-Upload CSV/GeoJSON, Namensliste, Ergebnistabelle mit Fundstelle), die ohne Netzwerkaufruf läuft (im Browser-Netzwerkreiter prüfbar).
- [ ] **Task 6: Grenzen der Normalisierung**
  - Präpositionsnamen („An der Linde"), Mehrwortnamen, Genitiv-Formen und Ortsteil-Zusätze; ggf. eigene Regel-ID, nie stilles Zusammenlegen.
- [ ] **Task 7: Empfänger verifizieren**
  - Keine Person ermittelt. Vor jedem Versand Name, Zuständigkeit und Adresse prüfen; ohne Verifikation kein Versand. Ob Ämter intern schon prüfen (ALKIS-Fachschalen), ist offen.

---

## 3. Akzeptanzkriterien / Definition of Done

Dieser Abschnitt ist der Vertrag und ändert sich nicht (Änderungen brauchen ein neues Ticket).

- [ ] Eine Vitest-Suite mit mindestens 20 Fällen ist grün, darunter Grundwort-Doppelung, ß/ss, Umlaute, Klangzwilling (z. B. „Meier"/„Maier"), Personennamen-Ausnahme und ein unverdächtiger Name (0 Hinweise).
- [ ] Ein Testset aus **bekannten Verwechslungspaaren** (aus Richtlinien-Beispielen und dem VGH-Fall) wird erkannt, und eine echte Straßenliste (GovData oder OSM-Overpass) läuft ohne unerklärte Treffer-Flut.
- [ ] Jede Meldung trägt Regel-ID, Fundstelle und Klartextbegründung (De/En); das Wort „unzulässig" wird nirgends ausgegeben.
- [ ] Die Seite läuft offline ohne Netzwerkaufruf, und alles liegt im Scaffolding unter `07-demos/strassennamen-pruefer/` (Regel 4).

Stand: das erste Kriterium ist erfüllt (31 Tests), das dritte für die Engine (Test), das zweite und vierte stehen aus (Tasks 2, 4, 5).

---

## 4. Förderbrücke (nur Hinweis)

Siehe Dossier: Prototype Fund (Klasse 03, Frist laut Katalog-Schnipsel, Primärseite ungeprüft), nachrangig mFUND. CC0-Vereinbarkeit mit der Lizenzpflicht offen. Kein Fördertipp in Mails ohne Freigabe.

---

Lizenz: CC0 1.0 Public Domain.
