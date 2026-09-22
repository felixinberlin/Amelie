# EuroBirdCast — Roadmap nach der Prüfung

**Stand:** 22. September 2026 · **Status der Dose:** ⛔ nicht sendebereit
**Grundlage:** `eurobirdcast-empfaenger-2026-09-22.md`, `eurobirdcast-besetzung-2026-09-22.md`, `eurobirdcast-technik-2026-09-22.md`

Diese Roadmap ist kein Bauplan für die Dose, wie sie am 22.09. gepackt wurde. Drei unabhängige Prüfungen haben dieselbe Dose an drei verschiedenen Stellen widerlegt. Was hier steht, ist das, was von der Idee **nach** der Prüfung übrig ist — und der Weg, auf dem es in etwas Zustellbares zurückkommt.

---

## 0 · Was nicht mehr trägt

| Behauptung der Dose | Befund | Konsequenz |
|---|---|---|
| Empfänger „ENRAM Coordination Team" | ENRAM war eine COST-Action 2013–2017, enram.eu ist ein Archiv. Kein Team, keine Adresse. `enram@biodiversitylab.eu` nicht belegbar | Empfänger neu wählen |
| BP/MWh-Index als eigene Erfindung | Ist Szenario 3 in Bauer et al., *Nature Sustainability*, 2.6.2026, doi 10.1038/s41893-026-01853-4: Abschaltung, „when the number of potential collisions per kilowatt-hour … exceeded a defined limit". Code CC BY 4.0 auf Zenodo | Index zitieren, nicht anbieten |
| Erstes Ticket: DWD-HDF5 ziehen, dockerisiertes `vol2bird`, 14 Tage Herbstzug nachrechnen | DWD hält Rohvolumen ≈ 48 h vor (gemessen 20.09. → 22.09.), kein PVOL-Archiv. `getRad` (CRAN, UvA/INBO) zieht die `unfiltered/`-Dual-Pol-Zweige bereits. MistNet braucht `sweep_vol_w` — liefert der DWD nicht — und ist auf S-Band trainiert, DWD ist C-Band | Ticket ersatzlos streichen |
| „Windparks schalten pauschal nach Kalendermonaten ab" | Onshore-DE gibt es keine Vogelzug-Abschaltauflage. Die Nachtabschaltungen Aug.–Okt. sind **Fledermaus**-Auflagen und an ≥ 10 °C / < 6 m/s gekoppelt; die phänologischen Abschaltungen gelten **Brutvögeln**, § 45b Abs. 6 BNatSchG + § 6 WindBG, tagsüber | Prämisse fällt |
| Rechtsgrundlage § 44 BNatSchG | Für WEA an Land ist § 45b i. V. m. Anlage 1 einschlägig | Norm korrigieren |
| EIC Pathfinder Open 2026 als Topf | Frist war 12.05.2026, vier Monate vor Dosendatum. ≥ 3 unabhängige Rechtspersonen nötig, TRL 1–4 — das Vorhaben ist Integration, TRL 5–7 | Mail 1 in Gänze streichen |
| „Aloft: über 150 Stationen" | Paper: 141 Stationen, 18 Länder. Täglich nur der `baltrad`-Zweig, `uva` endet 2023. Lizenz: research-only | Zahl und Lizenzhürde nennen |
| „ρHV < 0,85 für biologische Streuer" | `vol2bird`-Default ist `RHOHVMIN = 0.95` | Zahl korrigieren |

**Und der unbequemste Einzelbefund**, der nicht in die Tabelle passt: Am Gotthard-Windpark sank die Abschaltzeit durch radargesteuerte, turbinenindividuelle Schwellen von 318 h auf 28–96 h je Anlage — **die Kollisionszahl blieb bei rund 190 Tieren im Jahr** (Tettamanti, *J. Environ. Manage.* 401, 1.3.2026). Mehr zeitliche Präzision hat dort nicht mehr Vögel gerettet. Wer diese Idee weiterbaut, muss diesen Nullbefund vorne in der Dose stehen haben, nicht in einer Fußnote.

---

## 1 · Was trägt

- **Die Daten liegen offen und sind für Deutschland bereits gerechnet.** RMI/KMI Belgien rechnet **täglich** `vol2bird`-Profile für zwei deutsche Radare — `deess` (Essen) und `denhb` (Neuheilenbach) — seit 10/2019, frei abrufbar:
  `opendata.meteo.be/ftp/observations/radar/vbird/deess/2026/deess_vpts_20260915.txt`
  Damit braucht die erste Version **kein** eigenes Ingest, kein Docker, kein HDF5.
- **Der Werkzeugkasten ist gepflegt:** `vol2birdR` 1.3.2 (16.09.2026), `bioRad` 0.12.0.9000 (21.07.2026), `getRad` für die DWD-Rohdaten.
- **FlySafe** (UvA/KNMI/NL-Luftwaffe) liefert seit August 2026 5-Minuten-Echtzeitprofile über NL/BE/**DE**, frei nutzbar.
- **Die Schwellenwerte existieren und sind veröffentlicht:** 250 und 500 MTR (Welcker 2022, BfN-Schriften 635); NL offshore 500 Vögel/km/h, windabhängig 400 / 900 / 500 (van Bemmelen et al. 2022).
- **Der Präzedenzfall existiert:** NL schaltet seit Mai 2023 Offshore-Parks bei Massenzug ab, Regelbetrieb, Deckel 60 h/Jahr, < 2 U/min, 48-h-Prognose, behördliche Software EVAS, veröffentlichte Saisonberichte.
- **Die Gegenrichtung ist besetzt und damit die Kalibrierquelle:** Zentrale Fundkartei der Vogelschutzwarte Brandenburg (LfU), seit 2002 bundesweite Datenzentrale für Windkraftopfer, `vogelschutzwarte@lfu.brandenburg.de`.

---

## 2 · Die Restlücke, in einem Satz

> Offen ist die **letzte Meile**: ein quelloffener, revisionssicherer Dienst, der bereits vorliegende wetterradarbasierte Vogelzugprofile in eine turbinenspezifische, behördlich prüfbare Abschaltempfehlung übersetzt — und genau dafür fehlt in Deutschland die Rechtspflicht, die sie nachfragen würde.

Der zweite Halbsatz ist der Kern der Roadmap. Die Technik ist das kleinere Problem. **Das Vorhaben hat keinen Käufer, solange es keine Auflage gibt.** Jede Meilensteinplanung, die das nicht zuerst adressiert, baut ein Werkzeug für ein Regal.

Daraus folgt die Reihenfolge: **erst den Bedarf klären, dann rechnen, dann ausliefern.** Nicht umgekehrt.

---

## 3 · Meilensteine

### M0 — Bedarfsklärung (vor jeder Zeile Code) · ca. 1 Woche

Zwei Gespräche, kein Produkt.

- **Ticket M0.1 — BfN/BioConsult SH ansprechen.** Das Vorhaben FKZ 3523 15 1601 („System für Erfassung und Vorhersage des Vogelzugs für bedarfsgerechte Turbinenabschaltungen in der AWZ", 12/2023–11/2025) ist ausgelaufen. Eine Frage: Was fehlt dem Ergebnis zur Betriebsreife, und ist der offene Betriebsdienst das Fehlende?
- **Ticket M0.2 — LfU Brandenburg, Zentrale Fundkartei.** Eine Frage: Wären Totfunddaten in einer Form verfügbar, die eine Schwellen-Kalibrierung trägt?
- **Fertig, wenn:** aus beiden Richtungen eine Antwort vorliegt, die entweder einen Bedarf benennt oder ihn verneint. Verneinen beide → Idee nach `05-dosen/_entsorgt.md`, Roadmap endet hier. Das ist ein vollwertiges Ergebnis.

**Kippschalter:** Ohne Abnehmer aus M0 wird M1 nicht begonnen.

### M1 — Profil-Lesbarkeit · ca. 3 Tage

Kleinster Schritt, der einen echten Wert zeigt, ohne Radarphysik neu zu bauen.

- **Ticket M1.1** — Leser für das VPTS-Format der RMI/KMI-Dateien (`deess`, `denhb`), Höhenschichten à 200 m, Dichte, Richtung, Geschwindigkeit.
- **Ticket M1.2** — **MTR auf Rotorhöhe** als einzige Kennzahl ableiten (Vögel pro km Frontbreite und Stunde, integriert über die Rotorebene). Nicht Vögel/km³: MTR ist die Einheit, in der alle Schwellenwerte in DE, NL und BE formuliert sind — und die einzige, in der sich das Ergebnis gegen veröffentlichte Grenzwerte prüfen lässt.
- **Ticket M1.3** — Rotorebene aus Nabenhöhe und Rotordurchmesser. Referenzanlage DE-Zubau H1/2025: Nabe Ø 146 m, Rotor Ø 150 m, 5,38 MW → **Rotorebene 71–221 m** (FA Wind und Solar, 15.07.2025). Die Angaben der Dose („80–250 m" bzw. „80–220 m") waren uneinheitlich und gehören ersetzt.
- **Fertig, wenn:** für eine bekannte Starkzugnacht (BE offshore-Referenz: Spitze 995 birdtracks/km/h am 14.10.2019, 22–23 Uhr) ein MTR-Verlauf über die Nacht ausgegeben wird und die Größenordnung zu den veröffentlichten Werten passt.

### M2 — Schwellen und Ampel · ca. 3 Tage

- **Ticket M2.1** — Schwellenwerte als **Datei, nicht als Code**: 250 / 500 MTR (Welcker 2022), NL 500 bzw. windabhängig 400/900/500 (van Bemmelen 2022). Jede Zahl mit Quelle im Datensatz.
- **Ticket M2.2** — Unsicherheit mitführen: Die Messabweichung zwischen Radarsystemen liegt bei 250 MTR bei rund 100 MTR. Eine Ampel ohne Unsicherheitsband behauptet eine Genauigkeit, die es nicht gibt.
- **Ticket M2.3** — Ertragsseite: Leistungskurve der Referenzanlage, daraus die abgeregelte Energie je Abschaltfenster. Belegter Anker: 26 h über drei Zugsaisons = 1,6 % der Zeit, 11 MWh je Anlage ≈ 0,05 % Ertrag (van Bemmelen 2022).
- **Fertig, wenn:** für eine Nacht Ampelstufe, Dauer und Ertragsverlust in MWh ausgegeben werden und der Ertragsverlust in der Größenordnung der veröffentlichten Werte liegt.

### M3 — Audit-Trail · ca. 4 Tage

Der eigentliche Beitrag, und der einzige Teil, den kein kommerzieller Anbieter offen hat.

- **Ticket M3.1** — Jede Empfehlung schreibt einen unveränderlichen Datensatz: Radarquelle und Zeitstempel, Höhenprofil, MTR auf Rotorhöhe, Unsicherheitsband, verwendete Schwelle **mit Quellenangabe**, Ertragsverlust, Entscheidung.
- **Ticket M3.2** — Nachrechenbarkeit: Aus dem Datensatz allein muss die Entscheidung ohne den Dienst reproduzierbar sein. Ziel ist, dass eine Behörde die Abschaltung prüfen kann, ohne dem Betreiber zu glauben.
- **Fertig, wenn:** eine dritte Person aus einer Audit-Zeile die Entscheidung nachrechnet und auf dasselbe Ergebnis kommt.

### M4 — Nullbefund-Prüfung · ca. 2 Tage

- **Ticket M4.1** — Gotthard gegenrechnen: Schwellen so variieren, wie es der Windpark 2021→2024 getan hat, und zeigen, wie viele Kollisionen das Modell jeweils vorhersagt. Wenn das Modell einen Rückgang vorhersagt, den die Realität nicht zeigte, steht das Ergebnis in der Dose — nicht im Papierkorb.
- **Fertig, wenn:** die Diskrepanz beziffert und erklärt oder als offene Frage dokumentiert ist.

### M5 — Zustellung · ca. 2 Tage

- **Ticket M5.1** — Dose neu schreiben (siehe Abschnitt 5).
- **Ticket M5.2** — Empfänger nach der Empfängerrangliste: **1** BfN / BioConsult SH (Bauauftrag und Budget), **2** LfU Brandenburg als Datenpartner, **3** ein Betreiberverband oder eine Bürgerwind-Genossenschaft als Anwender. **Nicht** ENRAM, **nicht** UvA/WSL/INBO — die betreiben HiRAD (Biodiversa+, WP5 „data products and tools for stakeholders") und haben Bauer et al. mitverfasst; ihnen diese Mail zu schicken hieße, ihnen ihre eigene Arbeit anzubieten. **Nicht** Prototype Fund — fördert nur Freiberufler und GbR ≤ 4 Personen mit Sitz in DE, nicht Institute.
- **Fertig, wenn:** eine Mail an eine belegte Adresse mit einem funktionierenden Link auf ein laufendes Repo zeigt.

---

## 4 · Reihenfolge, Abhängigkeiten, Aufwand

```
M0 Bedarf ──┬─▶ M1 Profil ──▶ M2 Schwellen ──▶ M3 Audit ──▶ M4 Nullbefund ──▶ M5 Zustellung
            │
            └─▶ (keine Antwort) ──▶ _entsorgt.md
```

Rund zwei Wochen reine Arbeit ab M1, bei laufender Zustimmung aus M0. Der Engpass ist nicht die Technik, sondern die Antwort aus M0 — und sie kann Nein lauten.

---

## 5 · Parallel: die Dose selbst

Unabhängig davon, ob die Roadmap gebaut wird, ist die vorhandene Dose zu korrigieren, weil sie sonst als „verifiziert neuartig" im Repo steht und irgendwann versendet wird.

1. **Verdikt** 🎁 `verifiziert neuartig` → `besetzt/verengt`, Begründung: Bauer et al. 2026 ist die Idee, drei Monate älter.
2. **Mail 1 (ENRAM/EIC)** streichen — toter Empfänger, erfundene Adresse, abgelaufene Frist, falscher Topf.
3. **Mail 2 (Prototype Fund)** streichen — nicht antragsberechtigt.
4. **Abschnitt „Wer es schon versucht hat"** ergänzen: Start/Stop + EVAS (NL, seit 5/2023), Bureau Waardenburg 2022 (PCA gegen MWh), Technolution 2025 („lage betrouwbaarheid" des NL-Modells), Robin Radar (SCADA-gekoppelt, Eneco Maasvlakte 2, 22 Turbinen vollautomatisch), Swiss Birdradar BirdScan MV1 „(legacy)" → FaunaScan MV2, Gotthard-Nullbefund, Bauer et al. 2026, FlySafe 8/2026, BfN/BioConsult FKZ 3523 15 1601.
5. **Prämisse** auf „Deutschland, onshore, keine Auflage — und genau das ist das Problem" umschreiben.
6. **Name:** „EuroBirdCast" kollidiert mit der US-Marke BirdCast (Cornell/CSU). Vorschlag: der Index heißt nach seiner Einheit, nicht nach seinem Vorbild.
7. **Gleichlauf** herstellen: `05-dosen/eurobirdcast.md`, `en/05-dosen/eurobirdcast.md`, `src/data/dosen.ts`, `src/data/deliveries.ts` tragen dieselben Mails und dasselbe Verdikt — alle vier ändern oder keine.
8. **Protokoll** (`06-suche/amelie-pruefprotokoll.md`), **Playbook** (Retro + Atlasfeld „radarbasierte Abschaltung"), **Quellen** fortschreiben.

---

## 6 · Offene Fragen, die diese Roadmap nicht beantworten kann

- Will Félix die Idee überhaupt weiterverfolgen, wenn die Restlücke Betriebsdienst statt Erfindung heißt? Das ist eine 🔨-Frage, keine 🎁-Frage.
- Ist der Gotthard-Nullbefund ein Standortartefakt (Alpenpass, fünf Anlagen) oder ein Ergebnis? Ohne Antwort darauf ist der Wirkungsanspruch des ganzen Felds unklar.
- Lässt die research-only-Lizenz von OPERA/Meteogate einen Betriebsdienst überhaupt zu? Die RMI/KMI-Dateien sind der Umweg, aber die Lizenzfrage ist ungeprüft.
- Wer zahlt einen Dienst, zu dem es keine Pflicht gibt?
