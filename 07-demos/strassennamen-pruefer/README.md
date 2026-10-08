# Straßennamen-Prüfer — Scaffolding & Ähnlichkeitsprüfer

> Ein deterministischer Prüfer, der einen vorgeschlagenen neuen Straßennamen gegen das Straßenverzeichnis einer Gemeinde hält und **Doppelungen und Klangzwillinge als Prüfhinweis mit Fundstelle** meldet. **Nie „unzulässig".** Die Entscheidung bleibt bei Amt und Gremium.
> *CC0 / Public-Domain-Geschenk für eine Person im Fachbereich Vermessung/Geoinformation einer Stadt (Person nicht ermittelt, vor Versand verifizieren).*
>
> *(English: Street Name Checker — a deterministic checker that compares a proposed street name against a municipality's street directory and reports duplicates and sound-alikes as a note with a reference to the existing street. It never says "inadmissible".)*

Die Dose online: https://felixinberlin.github.io/Amelie/#dose=strassennamen-pruefer

---

## 1. Problem & Lücke

Für ein Neubaugebiet brauchen Dutzende Straßen Namen. Kommunale Richtlinien verlangen, dass sie sich nicht mit vorhandenen verwechseln lassen; das Vermessungsamt prüft das von Hand gegen das Verzeichnis. Ein Werkzeug dafür wurde nicht gefunden (Suchschnipsel, ALKIS-interne Prüfungen nicht ausgeschlossen).

*Municipal guidelines demand that new street names cannot be confused with existing ones; offices check by hand.*

---

## 2. Der Sicherheitsnachweis (Safety Case)

> [!CAUTION]
> **Der Prüfer sagt nie „unzulässig", „zulässig", „freigegeben" oder ähnliches.** Er meldet Hinweise. Ein leeres Ergebnis heißt nur: unter den eingestellten Schwellen keine Ähnlichkeit zum übergebenen Verzeichnis. Ob ein Name tragbar ist, entscheidet Amt und Gremium, oft aus Gründen (Geschichte, Ortsbezug, Personenehrung), die kein Prüfer kennt.

Harte Invarianten (jede durch einen Test abgesichert):

1. **Kein Gesamturteil.** Das Ergebnis hat kein Feld `ok`, `gueltig`, `status`, `urteil`; nur `hinweise`, `unterdrueckt` und die Geltungsgrenze.
2. **Kein Urteilswort in der Ausgabe.** `assertNeutraleSprache()` wirft bei „unzulässig", „genehmigt", „unbedenklich", „sicher", „grün" u. ä. Straßennamen selbst (z. B. „Grüner Weg") sind Daten und werden vor der Prüfung ausgenommen. Ein Test scannt alle Ausgabewerte des Testsets.
3. **Jeder Hinweis ist eine Frage** mit Regel-ID, Stärke, Fundstelle (vorhandene Straße, ID, Ortsteil, Quelle) und Klartext De/En.
4. **Kölner Phonetik nie allein stark.** Klang gibt höchstens `mittel`; Editierdistanz allein `schwach`. Für Stämme unter 4 Zeichen wird weder Klang noch Distanz geprüft (Falschalarm-Bremse).
5. **Ausnahmen sind sichtbar.** Die Personennamen-Ausnahme unterdrückt Klang und Distanz, führt das Unterdrückte aber in `unterdrueckt` auf; Grundwort-Doppelung und identische Namen bleiben immer. Der Schalter „räumlicher Zusammenhang" markiert (`raum`), versteckt nichts.
6. **Richtlinienbezug nur, wo belegt.** Wörtliche Zitate nur aus dem Dossier (Frankfurt, Leitfaden 2023: „nur durch das Grundwort unterschieden", „gleichklingende Namen sind zu vermeiden"); Absatznummern sind **nicht** übertragen (`absatz: null`). Die Distanzregel ist ausdrücklich als Heuristik des Prüfers gekennzeichnet.
7. **Offline, ohne Modell.** Kein `fetch`, kein Zugriff außer auf die übergebene Liste (per Test geprüft).
8. **Ungültige Eingaben werfen** (leerer Vorschlag, leerer Straßenname, doppelte Straßen-IDs).

---

## 3. Regeln

| Regel | Bedingung | Stärke |
|---|---|---|
| `S1-IDENTISCH` | gleicher Stamm und gleiches Grundwort nach Normalisierung (ß/ss, Umlaute, Großschreibung, „Str.") | stark |
| `S2-GRUNDWORT` | gleicher Stamm, anderes Grundwort („Lindenweg" gegen „Lindenstraße") | stark |
| `S3-KLANG` | gleicher Kölner-Phonetik-Code des Stamms („Maier"/„Meier") | mittel |
| `S4-DISTANZ` | Damerau-Levenshtein-Abstand der Stämme ≤ 1 (bis 8 Zeichen) bzw. ≤ 2 (ab 9), einstellbar | schwach (mittel, wenn Klang mitschlägt) |

Je vorhandener Straße gibt es **einen** Hinweis mit der stärksten Regel; weitere Signale stehen in `signale`. Sortierung: Stärke, Regel, Straßenname.

Grundwörter (einstellbar): -straße/-str., -weg, -allee, -platz, -gasse, -ring, -pfad, -damm, -ufer, -steig. Präpositionsnamen („An der Linde") und Mehrwortnamen ohne Grundwort werden nicht besonders behandelt (offen).

---

## 4. Architektur-Übersicht

```
Straßenverzeichnis (JSON: id, name, ortsteil)  +  Vorschlag(e) (Text oder { name, personenname, ortsteil })
   │
   ▼
normalisiere()  →  koelnerPhonetik() + editierdistanz()  →  Regeln S1–S4  →  Hinweise mit Fundstelle
   │                                                                          (+ unterdrueckt, Geltungsgrenze)
   ▼
pruefeStrassenname() / pruefeVorschlagsliste() / alsJson()
```

| Datei | Zweck |
|---|---|
| `src/engine/strassennamen-pruefer/strassennamenPruefer.ts` | Normalisierung, Kölner Phonetik, Editierdistanz, Regeln, Sprachwächter |
| `src/engine/strassennamen-pruefer/strassennamenPruefer.test.ts` | 31 Tests |
| `data/synthetisches-verzeichnis.json` | **synthetische** Gemeinde „Musterstadt", 18 erfundene Straßen |
| `data/testpaare.json` | Testpaare mit Herkunft (`dossier` / `synthetisch`) |
| `strassenverzeichnis-schema.json` | Eingabeformat (Schema `vorläufig`) |
| `ticket-01-strassenname-pruefer.md` | Vertrag für den ersten Schritt |

---

## 5. Ehrlichkeit über die Testdaten

* **Alle Fixtures sind synthetisch.** Musterstadt gibt es nicht; kein Paar im Testset ist ein amtlich dokumentierter Fall.
* Zwei Paarformen stammen aus dem Dossier als Beispiele (Meier/Maier, Lindenweg gegen Lindenstraße); alle anderen sind für den Test ausgedacht.
* Die Beispielpaare der Richtlinien (Drensteinfurt, Bornheim, Dortmund, Frankfurt) und der VGH-Fall Mannheim 13.11.1978 sind **nicht** übertragen. Das ist Aufgabe 2 in Ticket 01.
* Es gibt **keinen Nachweis** an einem echten Verzeichnis: die Falschalarm-Rate ist unbekannt.
* Eine statische Offline-Seite ist **nicht gebaut**.

---

## 6. Lokal ausführen

```bash
npx vitest run src/engine/strassennamen-pruefer
```

```ts
import { pruefeStrassenname } from './src/engine/strassennamen-pruefer/strassennamenPruefer';
const e = pruefeStrassenname('Lindenweg', [{ id: 'm01', name: 'Lindenstraße', ortsteil: 'Nord' }]);
// e.hinweise[0]: S2-GRUNDWORT, stark, Fundstelle „Lindenstraße"; kein Urteil.
```

---

Lizenz: CC0 1.0 Public Domain.
