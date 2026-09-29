# Quellen-Register — Handbuch

Jede Quelle, aus der Amélie Ideen, Technik und Möglichkeiten holt (Fachgremium, Citizen-Science-Projekt, Norm, Förderprogramm, Preis, Datensatz, Empfänger …), ist ein **Objekt** in `src/data/quellen.json`. Man kann sie zählen, filtern, bewerten und vergleichen.

* **Wahrheit:** `src/data/quellen.json` (Typen in `src/data/quellen.ts`, Export `public/data/quellen.json` über `npm run export:data`).
* **Lesefassung:** `06-suche/amelie-quellen.md` wird **erzeugt** (`npm run quellen -- md`). Nicht von Hand editieren; `npm run lint` (`check:quellen`) schlägt an, wenn sie veraltet ist.
* **Einziger Schreiber:** der `bibliothekar`, über die CLI unten. Alle anderen Agenten lesen und **melden**.

## Ein Objekt

| Feld | Bedeutung |
|---|---|
| `id`, `name` | Slug (kebab-case, stabil) und Anzeigename |
| `typ` | historischer Quellentyp A–W aus dem Playbook (Katalog `typen`) |
| `kategorie` | gröbere Auswertungsachse: fachgremium · citizen-science · ki-versuch · foerderung · preis · kapital · kommunal · statistik · beobachtungsplattform · spiel · auslandsregulierung · messverfahren · tarif · potenzialstudie · referenzsammlung · norm · empfaenger · datensatz |
| `rollen` | wofür die Quelle taugt: `ideenquelle` · `besetzt-test` · `evidenz` · `empfaenger` · `geldgeber` |
| `tags` | Themenfelder (vogel, holz, abfall, eu-recht …) |
| `urls` | kanonische Adressen |
| `zugang` | `art` (web · pdf · repo · api · norm · formular · app · register · paywall · offline), `erreichbar` (ja · teilweise · gesperrt · unbekannt) und **`wie`**: der Zugangsweg in ein bis drei Sätzen — nur wo er nicht trivial ist (Proxy sperrt, `git clone` statt API, WebFetch statt curl, CELEX-Route …) |
| `enthaelt`, `fokus` | was dort steht · wonach dort gesucht werden soll |
| `status` | `offen` → `angekratzt` (eine Suche/Schnipsel) → `durchsucht` (Seite/Liste gelesen) → `erschöpft`; `gesperrt` = nicht (mehr) nutzen |
| `evidenz` | `seite` (Volltext gelesen) · `schnipsel` (nur Suchschnipsel) · `unbekannt` |
| `zuletzt`, `wiedervorlage` | letzte Prüfung (ISO) · Monat, in dem sich ein Nachsehen lohnt (`2027-03`) |
| `ertrag` | `dosen`, `graeber`, `kandidaten`: was aus der Quelle entstanden ist (ids) |
| `vektoren` | `q` = Q1–Q6, `basis` = wer bewertet hat (`auto` · `bibliothekar` · `reviewer` · `mensch`) |
| `verlauf` | Logbuch: `{datum, agent, runde, notiz, status?}` — hängt nur an |

## Vektoren Q1–Q6 (1–5, Summe /30)

| | Vektor | Frage |
|---|---|---|
| Q1 | Ergiebigkeit | Wie viele überlebende Ideen/Dosen/Gräber kamen bisher heraus? |
| Q2 | Restpotenzial | Wie viel Ungegrabenes liegt noch da? (5 = offen, 1 = erschöpft) |
| Q3 | Zugang | Wie leicht kommt ein Agent an den Volltext? |
| Q4 | Belastbarkeit | Primärquelle im Volltext oder nur Schnipsel? |
| Q5 | Geländefreiheit | Wie unbesetzt ist das Feld? (1 = Anker dicht, Wiedergänger-Gefahr) |
| Q6 | Anschluss | Führt sie zu Empfängern, Geldgebern, Förderbrücken? |

Aus Q1–Q6 rechnet `npm run quellen -- next` eine **Grab-Empfehlung** (Restpotenzial ×3, Zugang ×2, Geländefreiheit ×2, Ergiebigkeit ×2, Belastbarkeit ×1, Anschluss ×0,5). Sie schlägt vor, sie entscheidet nicht.

**Bei der Einführung (29.09.2026)** wurden alle Vektoren aus Status, Evidenz und Ertrag *abgeleitet* (`basis: auto`, in der Tabelle mit `*` markiert). Der Bibliothekar ersetzt sie mit `rate`, sobald eine Runde die Quelle wirklich angefasst hat. `auto` heißt: brauchbare Grobsortierung, kein Urteil.

## Arbeitsweise

**Vor der Runde** (Scouts, Kollider, Inversions-Agent lesen nur):
```
npm run quellen -- next --limit 5 [--tag holz] [--kategorie norm]
npm run quellen -- list --status offen --sort q2
npm run quellen -- show <id>          # Zugangsweg, Verlauf, Ertrag
```

**Während der Runde** liefern Agenten am Ende ihres Berichts einen Block **Quellenmeldung**, eine Zeile pro Quelle:
```
QUELLE <id | NEU: Name> | status=<…> | evidenz=<seite|schnipsel> | zugang=<ja|teilweise|gesperrt> [wie: …] | ertrag=<Idee/Dose/Grab/–> | urls=<…> | note=<was wurde gefunden, ein Satz>
```
Neue Quellen mit `NEU:` sind ausdrücklich erwünscht (Typ- und Kategorievorschlag dazuschreiben). Wichtig ist auch die **negative Meldung**: „nicht abrufbar", „Anker dicht", „Zugangsweg gefunden".

**Nach der Runde** überträgt der Bibliothekar jede Meldung:
```
npm run quellen -- log <id> --note "…" --status durchsucht --evidenz seite --agent ideen-scout --runde "Holz-Runde" [--dose <id>] [--grab <id>] [--kandidat <id>] [--wie "…"] [--erreichbar gesperrt] [--wv 2027-03]
npm run quellen -- add --id <slug> --name "…" --typ M --kategorie norm --enthaelt "…" --fokus "…" --status angekratzt --evidenz schnipsel --note "…"
npm run quellen -- rate <id> --q 4,3,5,4,3,4 --note "warum"
```
Jeder Befehl validiert (Ertragsverweise müssen echte Dosen/Gräber sein), speichert und erzeugt `amelie-quellen.md` neu. Danach `npm run export:data` und `npm run lint`.

**Regeln des Bibliothekars**
1. Status nur hochsetzen, wenn die Quelle **selbst gelesen** wurde (`durchsucht` = Seite/Liste gelesen, nicht Suchtreffer). Schnipsel bleiben `angekratzt` + `evidenz=schnipsel`.
2. Erst wenn eine Dose gepackt ist, `--dose` setzen; Reviewer-Kills mit `--grab <id>` (Grab muss in `DISCARDED_DATA` stehen — Friedhof zuerst).
3. Ein Zugangsproblem ist ein Befund: `--erreichbar` und `--wie` setzen, damit der nächste Agent keine Zeit verliert.
4. Eine Quelle, die nicht mehr genutzt werden soll (Nachfass-Sperre, Verkaufskanal statt Empfänger): `--status gesperrt` und den Grund in `--note`.
5. Allgemeine Regeln („Nicht mehr als Quelle nutzen") bleiben in `nichtNutzen` im Register.

## Auswerten
```
npm run quellen -- stats                      # Bestand nach Status, Kategorie, Typ, Evidenz, Erreichbarkeit, Mittel Q1–Q6
npm run quellen -- list --rolle empfaenger    # Adressbuch
npm run quellen -- list --erreichbar gesperrt # wo Agenten regelmäßig scheitern
```
Frontend: `import { QUELLEN_DATA, quellenFuerDose, quellenEmpfehlung } from 'src/data/quellen'`.
