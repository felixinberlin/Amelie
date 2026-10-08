# Modellvergleich — Handbuch

`npm run vergleich -- …` lässt **dieselbe Runde** (dieselben Agenten- und Skill-Prompts der drei Engines) mit verschiedenen Modellen laufen und misst, was sich nachprüfen lässt. Es beantwortet nicht „welches Modell ist klüger“, sondern konkrete Fragen, an denen Amélie schon einmal gescheitert ist: Hält das Modell die Form der Quellenmeldung? Meldet es etwas als frei, das schon begraben ist? Behauptet es, eine Seite gelesen zu haben, die es nie geholt hat? Kommen andere Modelle zum selben Ergebnis?

Code: `scripts/model-compare.mjs` (CLI), `scripts/model-compare/` (`lib` Auswertung · `tools` Werkzeuge · `providers` Anbieter-Adapter · `prompts` · `runner`), Tests `src/utils/modelCompare.test.ts`.

## Einrichten

1. SDKs nur bei Bedarf, ohne das Repo zu ändern: `npm i --no-save @anthropic-ai/sdk @anthropic-ai/vertex-sdk @google/genai`
2. `cp scripts/model-compare/models.example.json scripts/model-compare/models.local.json` (steht in `.gitignore`) und anpassen:
   * `provider`: `anthropic` (Claude direkt) · `vertex-claude` (Claude über Google Cloud) · `gemini` (Gemini-API oder mit `"vertex": true` über Vertex AI) · `mock`
   * **Gemini-Modell-Id ist absichtlich `SET_ME`:** die aktuelle Id aus deiner Google-Cloud-Konsole eintragen.
   * `price` = Dollar je Million Token `{in, out}`; ohne Preis bleibt die Kostenzeile `n/a`. Die Claude-Preise der Beispieldatei sind **Erstanbieter-Preise**; auf Vertex gelten Partnerpreise, bitte gegen die Vertex-Preisseite prüfen.
3. Zugang: `GOOGLE_CLOUD_PROJECT` (+ `gcloud auth application-default login`) für Vertex; `GEMINI_API_KEY` für die Gemini-API; `ANTHROPIC_API_KEY` für Claude direkt.
4. Prüfen, ohne etwas aufzurufen: `npm run vergleich -- models --check` (nennt fehlende Modell-Id, Zugang, SDK).

## Ablauf

```
npm run vergleich -- run --thema "Hochwasser Pegel" --dry-run      # Prompts ansehen, nichts läuft
npm run vergleich -- run --thema "Hochwasser Pegel" --mock         # ganze Kette ohne Netz (Probe der Auswertung)
npm run vergleich -- run --thema "Hochwasser Pegel" --repeats 3 --yes     # echt: kostet Geld
npm run vergleich -- judge --run <lauf-id> --judge claude-opus     # ein Modell ordnet die Vereinigung aller Kandidaten ein
npm run vergleich -- score --run <lauf-id>                         # Kennzahlen + Bericht
```

* **Echte Läufe kosten Geld** und starten nur mit `--yes`. Vorher prüft `run`, ob jedes Modell startklar aussieht. Eine Runde mit 3 Modellen, 3 Engines und 1 Wiederholung sind 9 Aufrufe, jeweils mit einer Werkzeugschleife von mehreren Runden.
* Ein **frisches Thema** nehmen. Bei einem Thema, das Amélie schon bearbeitet hat (z. B. Multiplayer), kennt das Gedächtnis fast alles, und die Wiedergänger-Zahlen sagen wenig.
* `--engines scout,kollider` begrenzt, `--models a,b` wählt Modelle, `--parallel` (Standard 3) und `--max-turns` (Standard 20) steuern die Last.
* Läufe liegen unter `06-suche/modellvergleich/runs/<id>/<modell>/<engine>-<n>.md|json` (**nicht versioniert**, mit Werkzeugprotokoll und Tokens). Berichte unter `06-suche/modellvergleich/berichte/<id>.md` sind versioniert.

## Was jedes Modell bekommt

Dieselben Prompts: der Agentenprompt (`.claude/agents/<rolle>.md`) plus der Skill (`.claude/skills/<skill>/SKILL.md`), dazu die Betriebsart „Modellvergleich“ (keine Shell, keine Dateien, Bericht als Text), eine Warnliste aus dem Gedächtnis und die gültigen Werte der Quellenmeldung (aus `quellen.json`). Und **dieselben zwei Werkzeuge**:

| Werkzeug | Zweck |
|---|---|
| `bib_find` | das Gedächtnis durchsuchen (wie `npm run bib -- find`, nur lesend) |
| `web_fetch` | eine Seite holen (Text, gekürzt, max. 12 je Lauf, keine internen Adressen); jeder Aufruf wird protokolliert |

Gleiche Werkzeuge sind der Grund, warum „[Seite] ohne geholte URL“ eine faire Messung ist. Mit `--search native` nutzt jedes Modell stattdessen seine eigene Websuche; dann entfällt diese Prüfung, und verglichen wird der ganze Stapel, nicht das Modell allein (bei Gemini bekommt das Modell dann nur die Suche, weil sich Funktionsaufrufe und Google-Suche nicht in jedem Modell kombinieren lassen).

## Was gemessen wird (keine Gesamtnote)

| Frage | Kennzahl |
|---|---|
| Läuft es, hält es die Form? | Läufe ohne Fehler · Bericht vollständig (Kandidatentabelle, „Gelernt“, Quellenmeldung) · Anteil der Quellenmeldungs-Zeilen, die `bib quellen import` annähme |
| Was kommt heraus? | Kandidaten · Verteilung frei/verengt/unklar/besetzt · **Doppelfund-Quote** (welcher Anteil auch bei einem anderen Modell auftaucht) |
| Wie ehrlich? | Kandidat war dem Gedächtnis schon bekannt · **als frei/verengt gemeldet, obwohl begraben** (die Zeile, die zählt; Ziel 0) · „[Seite]“ ohne geholte URL · frei/verengt ohne jede [Seite] |
| Was sagt ein Richter? | Anteil nutzbar (Dose Ready + Needs Research) und Ausschuss (Friedhof + besetzt) je Modell |
| Was kostet es? | Tokens, Dollar (nur mit Preisfeld), Zeit, Werkzeugaufrufe |

Bewusst **keine** Rangliste und kein gewichteter Punktestand: die Gewichte wären erfunden, und ein einzelner Wiedergänger wiegt mehr als zehn schöne Tabellen.

## Grenzen — bitte lesen

* **Die Anbieter-Adapter sind gegen die installierten SDK-Typen geprüft und gegen nachgebaute Antworten getestet, aber nicht gegen die Live-APIs gelaufen** (in der Entwicklungsumgebung gab es keine Zugangsdaten). Der erste echte Lauf ist also auch ein Test der Adapter; bei einem Fehler steht er im Bericht (`Läufe ohne Fehler`) und in `<engine>-<n>.json`. Ein `--repeats 1`-Probelauf mit einer Engine zuerst ist billig: `--engines scout --models gemini --yes`.
* **Stichprobe:** 3 Engines × 1 Wiederholung × 1 Thema trägt „läuft es, hält es die Form“, nicht feine Unterschiede. Mit `--repeats 3` und einem zweiten Thema wird es belastbarer; kleine Prozentunterschiede nicht überinterpretieren.
* **Der Richter ist ein einzelnes Modell** und kann sich irren; er kennt die Herkunft der Ideen nicht, wird aber Ideen aus der eigenen Familie eher wohlwollend sehen. Am aussagekräftigsten ist ein Richter aus einer **anderen Familie** als die beurteilten Modelle; das Ergebnis einmal mit einem zweiten Richter wiederholen (`judge --judge …`, dann `score`; die Datei `judge.json` wird überschrieben, den Bericht vorher sichern).
* **Vorwissen prüft nur Textähnlichkeit** (Wortteile der Id oder des Titels gegen das Gedächtnis). Dieselbe Idee in ganz anderen Worten wird nicht erkannt; die Doppelfund-Quote nutzt dieselbe Ähnlichkeit (Jaccard ≥ 0,5, mindestens zwei gemeinsame Wörter).
* **Kosten:** aus den Tokenzahlen der Antworten und dem Preisfeld; Cache-Preise, Denk-Aufschläge und Partnerpreise sind nicht berücksichtigt. Als Richtwert lesen.
* **Vertex-Einschränkungen** (laut Plattform-Tabelle): nur die einfache Websuche (`web_search_20250305`), kein Web-Fetch, kein Batch. Der Vergleich benutzt deshalb `web_fetch` als eigenes Werkzeug.

## Erste sinnvolle Messung

1. `models --check` grün machen (Gemini-Id eintragen, SDKs installieren).
2. Ein **frisches** Thema wählen (eines, zu dem `bib find` nichts oder wenig liefert).
3. Probelauf: `run --thema … --engines scout --repeats 1 --yes`, `score`. Läuft alles? Dann:
4. Vollständiger Lauf mit `--repeats 3`, danach `judge` mit einem Modell der jeweils **anderen** Familie, `score`.
5. Den Bericht committen (`06-suche/modellvergleich/berichte/`), die Erkenntnis ins Playbook (Retro) übernehmen.
