# Prüfakte: Gründungsnavigator

**Dose:** [`gruendungsnavigator`](../../05-dosen/gruendungsnavigator.md) · **Stand:** 13.10.2026 · CC0

Alles, was über diese Dose geprüft wurde, an einem Ort: Urteil, Vektoren, Zitate, Handy, offene Bedingungen. Die Quellen der Einträge stehen jeweils dabei.

## 1. Urteil des Reviewers

Unabhängiger Review am 11.10.2026, Volltext in `06-suche/amelie-classification-log.md`, Abschnitt „Gründungsnavigator — Reviewer 11.10.2026“.

| Zuschnitt | V1 | V2 | V3 | V4 | V5 | V6 | V7 | V8 | Kern /35 | Urteil |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|
| GN-A, voller Prototyp (gepackt) | 3 | 5 | 4 | 3 | 3 | 4 | 4 | 2 | **26** | Dose Ready (bedingt) |
| GN-B, nur Normregister, Fristen, Rechte-Karten mit Wortlaut | 3 | 5 | 5 | 3 | 4 | 4 | 5 | 2 | **29** | Dose Ready (empfohlen) |

- **Restlücke (V1):** Gespräch statt Brief, für Gründerinnen und Gründer, mit zitiertem Wortlaut. Nachbarn: jobcenter.guru, BürgerChat, Sozialrat, Münchner Gründungsbüro, Gründerplattform (Prüfprotokoll G1).
- **Achillesferse:** RDG-Grenze (Formulierungsvorschläge eines Nichtjuristen) und ein Empfänger ohne verifizierte Ansprechperson.
- **Heilmittel:** Zuschnitt GN-B. Taktik bleibt ein austauschbares Beispielpaket außerhalb des geprüften Kerns.

## 2. Zitat-Abgleich gegen die Amtsquelle

Prüfbefehl: `npm run check:gn-zitate` (Skript `scripts/check-gruendungsnavigator-zitate.mjs`, braucht Netz). Er hält jedes als wörtlich markierte Zitat gegen gesetze-im-internet.de. Seit 13.10.2026 liest er das gemeinsame Register `data/normen.json` statt der zwei Konstanten in den Seiten.

| Lauf | Ergebnis |
|---|---|
| 11.10.2026, erster Lauf | 4 Abweichungen trotz Handprüfung am selben Tag |
| 11.10.2026, nach Korrektur | 39/39 stimmen, 0 Abweichungen, 0 nicht abrufbar |
| 11.10.2026, nach 5 neuen Normen (§ 2 Abs. 2, § 14 S. 2, § 16 Abs. 2 S. 1 SGB I; § 20 SGB X; § 44b SGB II) und § 17 Abs. 1 SGB I neu im Wortlaut | 45/45 stimmen, 0 Abweichungen, 0 nicht abrufbar |
| 13.10.2026, gemeinsames Register (Ticket 01; Zitate, die auf beiden Seiten standen, zählen jetzt einmal) | 30/31 maschinell, 0 Abweichungen; § 138 AO aus Node zweimal nicht abrufbar, per `curl` geholt und von Hand verglichen: stimmt. Also 31/31 |

Die vier korrigierten Stellen:

| Norm | Stand vorher | Amtlicher Wortlaut |
|---|---|---|
| § 10 Abs. 2 Nr. 5 SGB II (Fall-Landkarte) | „selbstständig“ | „selbständig“ |
| § 16 Abs. 3 SGB I (beide Seiten) | „dass unverzüglich“ | „daß unverzüglich“ (alte Schreibung im Gesetz) |
| § 44 SGB X (Fall-Landkarte) | „Im übrigen“ | „Im Übrigen“ |
| § 87 SGG (Fall-Landkarte) | „Verwaltungsaktes“ | „Verwaltungsakts“ |

Ein gescheiterter Abruf zählt nicht als Abweichung; der Befehl meldet ihn getrennt.

## 3. Tests des Kerns

`npx vitest run src/engine/gruendungsnavigator`. Seit Ticket 01 (13.10.2026) lesen die Tests die Dateien in `data/` und prüfen mit einem Drift-Wächter, dass die in die Seiten eingebauten Daten genau diesen Dateien entsprechen:

- Fristen (Monatsrechnung, Schaltjahr, Werktag-Verschiebung, Feiertage), Freibetrag § 11b, Reihenfolge § 37 Abs. 2, Normstand-Wächter.
- Telefonbaum: Umfang, keine toten Knoten, jeder Normverweis löst auf, jeder Weg endet.
- Normregister (ein Register für beide Seiten): Links vorhanden, genau eins von Wortlaut oder Kurzfassung, Fassung und Prüfdatum je Norm.
- Sprachwächter: kein „garantiert“, „Anspruch besteht“, „unzulässig“, „rechtswidrig“.
- **Zahlen-Wächter:** Jede Zahl vor „Fragen“, „Rechte-Karten“, „Normen“ oder „Antworten“ in README, Dossiers, Konzept, `dosen.ts` und Simulator muss eine echte Zahl der Seiten sein. Er fand beim ersten Lauf „31 Fragen“ für die Fall-Landkarte; die Seite hat 29.

- **Branchenpakete** (`paket.test.ts`, 57 Tests): jedes Paket gegen das Schema (ajv) und gegen `pruefePaket` (Zuschuss höchstens 5.000 €, Gewinn nicht über Umsatz, Kosten und Schwelle stimmig, Überschreibungen treffen, Normen im Register, keine offenen Platzhalter, keine Versprechenswörter). Zu jeder Regel eine Gegenprobe mit absichtlich falschem Eingang. Die Formprüfung im Browser (`pruefeStruktur`) muss dieselben kaputten Pakete ablehnen wie das Schema.

## 3a. Branchenpakete: was geprüft ist und was nicht (13.10.2026)

Geprüft: Zahlen in sich stimmig (Tests oben), alle sieben Pakete im Browser bei 360 px ohne offene Platzhalter, ohne JS-Fehler und ohne waagrechtes Scrollen; Paketwechsel, eigene Fassung, Download, Upload (auch einer absichtlich kaputten Datei, die abgelehnt wird) und Übernahme alter Eingaben mit Playwright.

Nicht geprüft: Die Branchenangaben (Preise, Stundensätze, Abläufe, „Selbst klären“-Punkte wie Handwerkskammer, Reisegewerbekarte, Künstlersozialkasse, Anerkennung für den Entlastungsbetrag, Verpackungsregister) stammen aus allgemeinem Wissen, nicht aus einer Primärquelle und nicht von einer Kammer oder Beratungsstelle. Sie sind darum als Fragen formuliert („klären Sie bei …“) und nennen keine Paragrafen. Vor einer Empfehlung an Betroffene sollte je Branche eine fachkundige Stelle drüberlesen.

## 4. Handy

Prüfbefehl: `npm run check:mobile` (Skript `scripts/check-mobile.mjs`, braucht Chromium). Er lädt jede Seite unter `public/` über HTTP bei 360 und 390 px und prüft waagrechtes Scrollen, JS-Fehler, fehlgeschlagene Ladevorgänge und den Viewport-Meta. Stand 11.10.2026: beide Seiten in Ordnung.

## 4a. Offline

Manifest, Symbol und Service Worker (`public/gruendungsnavigator/`). Playwright-Test 11.10.2026: Status „✓ Offline verfügbar“, Netz aus, beide Seiten laden, Telefonbaum bedienbar. Dauerhaft im Test „Offline: Manifest, Symbol und Service Worker“; Gegenprobe mit einer absichtlich fehlenden Datei in der Liste schlug an.

## 4b. Datenschutz

Der Beispielfall beruhte ursprünglich auf einem echten Fall. Seit 11.10.2026 ist er erfunden: neutraler Beruf (Webentwicklung ohne Produktname), andere Preise und Planzahlen, keine Ortsangaben des Netzwerks, „Beispiel“ statt „mein Fall“. Beide Seiten sagen das ausdrücklich. Der Test „Datenschutz-Wächter“ kennt die alten Werte nur als SHA-256-Präfixe und schlägt an, wenn einer zurückkommt (Gegenprobe ok). Hinweis: Ältere Fassungen stehen weiter in der Git-Geschichte.

## 4c. Erste Rückmeldung von Betroffenen (13.10.2026)

r/Grundsicherung, Thread „Dafür bin ich nicht zuständig“, zwei Kommentare:

| Kommentar | Einordnung | Reaktion |
|---|---|---|
| „AI Slop“ (zweimal) | Ablehnung ohne Inhalt; Signal, dass die Seite wie ungeprüfte KI-Ausgabe wirkt | Herkunft sichtbar gemacht (Transparenz-Kasten oben auf der Startseite, Fußzeilen) |
| „Bitte hört auf, in Rechtsfragen einer KI zu vertrauen … blind vertraut … Mist“ | sachlich berechtigt; deckt sich mit der Achillesferse des Reviewers (RDG, Formulierungen eines Nichtjuristen) und mit den 4 falschen „wörtlichen“ Zitaten vom 11.10. | Kasten sagt, was geprüft ist und was nicht; Prüfvermerk an jedem Zitat; Kurzfassungen als „nicht wörtlich“; neue Grundregel „Vorher gegenlesen lassen“ |

Ein Test („Transparenz“) hält das fest. Auf Reddit wurde nicht geantwortet.

## 5. Bedingungen vor Versand

| Bedingung (Reviewer) | Stand |
|---|---|
| Normtexte an der Amtsquelle gegengelesen, nicht nur dejure.org | **erfüllt** (Abschnitt 2) |
| Beispielfall ohne persönliche Daten | **erfüllt** (Abschnitt 4b); Branchenpakete bleiben [Ticket 01](ticket-01-vorlage.md) |
| RDG-Grenze juristisch geprüft oder Zuschnitt GN-B | offen |
| Ansprechperson beim Empfänger (Tacheles e.V.) verifiziert | offen |

Nichts versendet, keine Mail angelegt.

---
Lizenz: CC0 1.0 Public Domain.
