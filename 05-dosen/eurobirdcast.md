# EuroBirdCast: Dynamisches Vogelzugradar & BP/MWh-Index

*(englisch: EuroBirdCast: Dynamic Avian Radar & BP/MWh Index)*

**Ein Satz:** Rohdaten der Wetterradare des DWD per `vol2bird` in vertikale Vogelzugprofile übersetzen und einen „Bird Protection per MWh Lost" (BP/MWh)-Index berechnen, damit Windkraftanlagen dynamisch in extremen Zugfenstern abregeln statt pauschal nach Kalendermonaten abzuschalten.

**Stand:** 22. September 2026 · **Prüfen ab:** September 2027
**Empfänger:** The ENRAM Coordination Team & Open Science Lab for Biodiversity (EIC Pathfinder Open 2026) · Windpark-Betreiber, Bürgerwind-Genossenschaften, Prototype Fund Alumni / Open-Source Climate-Tech Kollektive, BWE, BfN
**Verdikt:** 🎁 **verschenken** — Prüfprotokoll: *verifiziert neuartig* (keine offene, automatisierte Pipeline übersetzt ENRAM/DWD-Radarvolumina direkt in einen lokalen ökonomisch-ökologischen Abschalt-Index für dezentrale Betreiber).

---

## Das Problem

Windkraftanlagen stehen im dauernden Konflikt zwischen Ausbauzielen für erneuerbare Energien und individuellem Artenschutz nach § 44 BNatSchG. Die heutige Genehmigungspraxis reagiert mit **starren, kalendarischen Abschaltzeiten** (z. B. feste Nachtabschaltungen von August bis Oktober).

Das erzeugt zwei gegenläufige Schäden:
1. **Unnötiger Verlust sauberer Energie:** An warmen, windstillen oder ungünstigen Zugabenden, an denen kaum ein Vogel fliegt, stehen Turbinen still und verlieren wertvolle Gigawattstunden Jahresenergieertrag (AEP).
2. **Ungeschützte Spitzen:** Klimawandelbedingte Wetterfronten verschieben Zugpulse oft spontan in Nächte oder Tageszeiten außerhalb der starren Auflagenfenster. Massive Zuggipfel treffen dann auf voll rotierende Turbinen.

Das Kernproblem ist kein Mangel an Vögeln, sondern ein Mangel an **zeitlicher und räumlicher Präzision**.

## Warum das jetzt geht

1. **DWD-Radardaten sind als Open Data zugänglich:** Der Deutsche Wetterdienst (DWD) stellt auf seinem Open-Data-Server ungefilterte polare Volumendaten (PVOL im standardisierten ODIM-HDF5-Format) für die 17 deutschen Radarstationen bereit. Ungefilterte Dual-Polarisations-Daten ($\rho_{HV}$, $Z_{DR}$) sind entscheidend, um biologische Streuer von Niederschlag und Insekten zu trennen.
2. **Die europäische Dateninfrastruktur steht mit Aloft:** Das Aloft-Projekt (Scientific Data 2025) stellt radarbasierte biologische Zeitreihen von über 150 Wetterstationen aus 18 europäischen Ländern bereit. Die Daten existieren kontinental.
3. **Der wissenschaftliche Extraktions-Stack ist quelloffen:** Der Algorithmus `vol2bird` (in C) und die Begleitwerkzeuge `bioRad` / `vol2birdR` (v1.3 mit MistNet-Neuronalem-Netz) berechnen vertikale Profile biologischer Streuer (VPB: Vogel-Dichte in Vögeln/km³, Flugrichtung, Geschwindigkeit, Höhenschichtung in 200-m-Intervallen) direkt aus HDF5-Volumenscans.
4. **Machbarkeit ist durch FlySafe und RADBIRD bewiesen:** Das niederländisch-belgisch-deutsche System FlySafe (UvA / KNMI) ist für die Flugsicherheit der Luftwaffe operativ im Einsatz; das BfN-Forschungsprojekt RADBIRD (Institut für Vogelforschung „Vogelwarte Helgoland", 2019–2021) hat die Grundlagen für Windkraft-Abschaltungen in Deutschland methodisch gelegt.
5. **Der Hebel ist durch die Nature-Sustainability-Studie 2026 quantifiziert:** Bauer u. a. (Juni 2026) wiesen anhand west-europäischer Wetterradare nach, dass intelligente, radarbasierte Abschaltungen 50 % des Kollisionsrisikos mit nur 1,2 % Energieverlust verhindern können (bzw. 90 % Risikoreduktion bei 7,6 % Ertragsverlust). Starre Abschaltungen kosten dagegen 2–20 % des Ertrags.

## Skizze

EuroBirdCast ist kein Hardware-Projekt und keine neue Radartechnologie, sondern eine **offene, neutrale Entscheidungs- und Risiko-Schicht**:

```
DWD / Wetterradar (HDF5)
         │
         ▼
`vol2bird` Extraktion (VPB)
  - Vogeldichte (Vögel/km³)
  - Höhenprofil (80–250 m Rotorebene)
  - Zugrichtung & Fluggeschwindigkeit
         │
         ▼
Nowcast & Kurzfrist-Wettermodell (0–6 h)
         │
         ▼
Risiko-Engine: Rotorüberdeckung × Vogeldichte × Wind
         │
         ▼
Index: BP/MWh (Bird Protection per MWh Lost)
         │
    ┌────┴──────────────────────────┐
    ▼                               ▼
SCADA / Turbinen-API         Monitoring-Dashboard
(Dynamische Drosselung)      (Audit-Trail & Behördennachweis)
```

- **Eingabe:** Automatisierter Abruf der 5-Minuten-HDF5-Radardaten des DWD für den jeweiligen Radarstandort (z. B. Boostedt, Prötzel, Umkirch) + lokale Wind- und Prognosedaten (DWD ICON-D2).
- **Berechnung:** `vol2bird` extrahiert die biologische Schicht. Aus der Vogeldichte in der Rotorebene (typisch 80–220 m) und dem aktuellen/prognostizierten Stromertrag der Anlage wird der Index **BP/MWh** berechnet: *Wie viele Vogel-Durchflüge im Rotorbereich werden pro abgeregelter Megawattstunde verhindert?*
- **Ausgabe:**
  - REST-API & Webhook für Windpark-SCADA-Systeme (`CURTAIL_RECOMMENDED`, `NORMAL_OPERATION`) mit Schwellenwert-Parametrisierung.
  - Revisionssicherer Audit-Trail: Für jede Abschaltung werden Radarprofil, Windgeschwindigkeit, errechnete Vogeldichte und Regelbegründung protokolliert (Beweissicherheit für Naturschutzbehörden nach § 44 BNatSchG).
  - Web-Dashboard: Höhenschichten-Visualisierung und 6-Stunden-Gefahrenprognose.

**Klare Systemgrenze:** Wetterradar misst *Biomasse und Bewegungsvektoren*, keine Vogelarten. EuroBirdCast verspricht keine automatische Arterkennung aus Radar. Artwahrscheinlichkeiten werden nachgelagert über phänologische Beobachtungsdaten (eBird, ornitho.de) und akustische Erfassung als Unsicherheitsgewichtung eingespielt.

## Erster Schritt

**Ticket: Ingestion- & Extraktions-Brücke (Python + Dockerized `vol2bird`)**

- Einen Python-Service aufsetzen, der ungefilterte ODIM-HDF5-Volumenscans einer Pilotstation (z. B. DWD Prötzel oder Boostedt) automatisiert herunterlädt.
- Einen Docker-Container mit `vol2bird` (inkl. HDF5, PROJ, GSL) schnüren, der die Volumenscans in JSON-strukturierte vertikale Profile (VPB) umwandelt.
- **Fertig, wenn:** Für 14 Tage historische Herbstzugdaten (bekannte Starkzugnächte aus Aloft) die extrahierten Dichteprofile in weniger als 45 Sekunden je 5-Minuten-Scan berechnet werden und die Korrelation zu den Aloft-Referenzprofilen über 95 % liegt.

## Wo es kippt

- **Falsch-Positive durch Clutter:** Starkregen, Insektenschwärme oder Bodenclutter bei fehlerhafter Refraktion können als „Geister-Vogelzüge" fehlinterpretiert werden und zu unberechtigten Abschaltungen führen. Gegenmaßnahme: Strikte Nutzung der polarimetrischen Korrelation ($\rho_{HV} < 0.85$ für biologische Streuer) und Geschwindigkeitsfilterung.
- **DWD-Filteranomalien:** DWD-interne Clutterfilterung entfernt zuweilen dichte Schwärme als Rauschen. Gegenmaßnahme: Bayessche Fusion mit überlappenden Radarkeulen benachbarter Stationen oder Grenzradaren (KNMI, DWD-Nachbarstationen).
- **Blackbox-Vorwurf:** Windpark-Betreiber akzeptieren keine intransparente KI-Empfehlung, die Erlöse kostet. Das System muss jeden Abschaltimpuls auf gemessene Vögel/km³ und Höhenbänder zurückführen.

## Wer es schon versucht hat

- **RADBIRD (BfN, Vogelwarte Helgoland, 2019–2021):** Hat das wissenschaftliche Fundament für radarbasierte Abschaltungen in Deutschland gelegt, endete jedoch als Forschungsbericht ohne offene, schlüsselfertige Betriebssoftware für Genossenschaften und Betreiber.
- **FlySafe (UvA / KNMI):** Voll operativ in NL/BE/DE, primär auf militärische und zivile Flugsicherheit optimiert, kein offenes B2B/Bürgerwind-Abschaltmodul mit BP/MWh-Ökonomie.
- **Aloft / bioRad:** Hervorragende offene Forschungsinfrastruktur (R, C), aber kein einsatzbereites API-System für SCADA-Leitsysteme.
- **Kommerzielle Kamerasysteme (z. B. IdentiFlight):** Setzen optisch an der Einzelanlage an (Rotmilan-Erkennung im Nahbereich), erfassen aber keinen großräumigen nächtlichen Breitfrontenzug von Kleinvögeln in 100–300 m Höhe.

EuroBirdCast schließt genau die Lücke zwischen dem kontinentalen Forschungsradar und der Leitwarte des Windparks.

---

## Übergabe-Mail (The Handover Email)

**Empfänger:** The ENRAM (European Network for the Radar surveillance of Animal Movement) Coordination Team & Open Science Lab for Biodiversity  
**Begründung:** Das Team hat grenzüberschreitende Wetterradardaten erfolgreich aggregiert und pflegt die Open-Source-Extraktionsalgorithmen rund um `vol2bird`. Um diese Grundlagenforschung jedoch in einen praxisnahen Energiestandard zu übersetzen, bedarf es einer klaren Verwertungs- und Software-Engineering-Perspektive. Die Verknüpfung der bestehenden Forschungsarbeit mit dem BP/MWh-Index positioniert das Team ideal zur Führung eines EIC-Pathfinder-Open-2026-Konsortiums gemeinsam mit einem Hightech-Klima-KMU.

```email
Betreff: EuroBirdCast & der BP/MWh-Index — Schlüsselfertige Architektur für EIC Pathfinder 2026

Liebes ENRAM-Koordinationsteam, liebes Team des Open Science Lab for Biodiversity,

ich schreibe Ihnen im Rahmen einer Initiative zur Freisetzung gemeinwohlorientierter Technologien. In einem Master-Dokument namens „Ideen" erfasse ich validierte technische Konzepte und Architekturen. Wenn eine Idee ausgereift ist, ich aber nicht die richtige Person für die Umsetzung bin, packe ich sie in eine „Dose" und übergebe sie an die Personen, die es sind.

Dies ist Ihre Dose.

Ihre Arbeit an AloftData und dem vol2bird-Algorithmus hat biologische Radardaten öffentlich zugänglich gemacht. Um jedoch die Vogelsterblichkeit an Windkraftanlagen drastisch zu senken, ohne den Ertrag erneuerbarer Energien abzuwürgen, müssen wir die Lücke zwischen biologischer Beobachtung und Energieökonomie schließen.

Das Konzept: EuroBirdCast & der BP/MWh-Index
Bislang verlassen sich Windparks auf statische, kalendarische Abschaltungen. EuroBirdCast schlägt vor, Ihre vertikalen Vogelprofile (VPB) zu verarbeiten, um einen lokalisierten BP/MWh-Index (Bird Protection per MWh Lost) zu berechnen. Dieses Entscheidungshilfe-System ermöglicht es Netz- und Parkbetreibern, API-gestütztes „Smart Curtailment" während kurzer, extrem risikobehafteter Zugfenster zu begründen – und so Vogelschlag und Ertragsverluste (AEP) gleichermaßen zu minimieren.

Ausrichtung auf EIC Pathfinder Open 2026
Ich habe diese Architektur direkt auf den kommenden Horizon Europe Grant abgestimmt, der frühe Phasen wissenschaftlicher, technologischer und Deep-Tech-Forschung fördert:
- Proof of Principle: Der EIC Pathfinder zielt darauf ab, die wissenschaftliche Grundlage für Durchbruchstechnologien zu schaffen. Der Schritt von retrospektiven Zugdaten zu einer echtzeitfähigen, lokalisierten wirtschaftlichen Risikoprognose (BP/MWh) erfüllt dieses Mandat passgenau.
- Pathway to Impact: Der Antrag verlangt logische Schritte zur Erzielung nachhaltiger Wirkung über die Projektlaufzeit hinaus. Die Bereitstellung von API-gestützten Drosselungswarnungen für regionale Windparkbetreiber dient als hochgradig glaubwürdige Verwertungsstrategie.
- Open Science Integration: Ihr Open-Source-Ethos entspricht exakt den Anforderungen an offenes Teilen von Forschungsergebnissen, Datenmanagementplänen (DMP) und Verbreitungskonzepten innerhalb der ersten sechs Monate.
- Kritisches Risikomanagement: Das Programm verlangt eine rigorose Risikomatrix. Das wesentliche Risiko bei EuroBirdCast sind falsch-positive „Geister-Abschaltungen" durch Artefakte in deutschen DWD-Radardaten (Dual-Polarisations-Anomalien). Dafür haben wir in der beigefügten Spezifikation bereits eine bayessche Interpolationsschicht als Gegenmaßnahme konzipiert.

Die Übergabe
Anbei finden Sie das vollständige EuroBirdCast-Strategiedokument, die 72-Stunden-MVP-Roadmap und die Architekturanforderungen für die API-Pipeline (FastAPI / SQLite / Dockerized vol2bird).

Ich suche weder nach Unternehmensanteilen noch nach Nennung oder einer Rolle im Konsortium. Dieses Konzept ist gemeinfrei (CC0). Nehmen Sie die Architektur, binden Sie ein vielversprechendes Hightech-Klima-KMU für die Softwareinfrastruktur ein und sichern Sie sich die EIC-Förderung, um Smart Curtailment zum europäischen Standard zu machen.

Viel Erfolg
Félix
github.com/felixinberlin
```
