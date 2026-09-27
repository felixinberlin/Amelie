---
status: Available
delivery_method: E-Mail
target_maker: IG BAU Bundesfachgruppe Gebäudereinigung
review_score: 34/35
architecture_tier: Tier 1
source_type: Type A
---
# ChemGefahr-Stopp / MischStop (ChemHazard Stop)

*(englisch: ChemHazard Stop — Open-Source Chemical Mixing Warning Aid for Cleaners)*

**Ein Satz:** Kamera auf zwei Putzmittelflaschen richten: Warnt laut in der Sprache der Reinigungskraft vor gefährlichen Gasen und Verätzungen — offline, in unter 1 Sekunde; sagt wenn es etwas nicht prüfen kann, aber niemals „sicher“.

**Stand:** 27.09.2026 · **Prüfen ab:** März 2027
**Empfänger:** IG BAU Bundesfachgruppe Gebäudereinigung · Berufsgenossenschaft der Bauwirtschaft (BG BAU) · DGUV · EFCI · ver.di · European Cleaning and Facility Services Industry
**Verdikt:** 🎁 verschenken  
**Review:** 34/35 · Tier 1 · Type A (Details: [Audit-Bericht](../06-suche/amelie-classification-log.md))

---

## Das Problem

Reinigungskräfte im gewerblichen Bereich arbeiten unter extremem Zeitdruck und häufig über erhebliche Sprachbarrieren hinweg. Das versehentliche Mischen eines sauren Sanitär-Entkalkers mit einer hypochlorithaltigen Chlorbleiche setzt in engen, fensterlosen Waschräumen und Putzkammern sofort toxisches Chlorgas frei. 

Die Gefahr ist seit Jahrzehnten bekannt, das Mischverbot ist Lehrbuchwissen — und trotzdem kommt es regelmäßig zu Unfällen. Der Grund: Sicherheitswarnungen stehen in 15-seitigen technischen Sicherheitsdatenblättern oder deutschen Betriebsanweisungen im Büroordner, die mitten in der Nachtschicht niemand liest. 

Deutschland besitzt exzellente Referenz-Infrastruktur: WINGIS/GISBAU (Gefahrstoff-Informationssystem, GISCODE, Betriebsanweisungen), GESTIS/IFA, GSApp, CERTISCAN und DGUV Regel 101-019. Doch alle diese Systeme sind rein abfragebasiert (*Lookup*). Kein einziges Werkzeug steht in der Sekunde des Mischens physisch zwischen der Arbeitskraft und den zwei Flaschen. Stand September 2026 existiert kein quelloffener, kamerabasierter Zwei-Flaschen-Mischschutz auf dem Markt. Das ist die Lücke.

## Kernprinzip: Der Sicherheitsnachweis

**Die App attestiert niemals Sicherheit. Sie warnt ausschließlich vor erkannter Gefahr oder gibt transparent zu, dass sie nicht prüfen kann.**

Dies ist keine Design-Entscheidung, sondern der fundamentale Sicherheitsnachweis (*Safety Case*). Ein falsch-positives „alles sicher" (grüner Haken) ist lebensgefährlich und weitaus schlimmer als gar keine App. Daraus folgen unumstößliche Systemregeln:
1. **Niemals ein grünes Ergebnis.** Es gibt keinen „Freigabe"-Zustand.
2. **Unsicherheit führt immer zu Warnung / UNVERIFIED.**
3. **Community-Daten dürfen einen STOP-Zustand niemals überschreiben.**
4. **Reine Assistenz:** Die App ist eine warnende Hilfe, keine zertifizierte PSA, kein Compliance-Werkzeug und kein Ersatz für die gesetzliche Gefährdungsbeurteilung des Arbeitgebers nach GefStoffV und DGUV 101-019.

### Die drei Systemzustände

| Zustand | Signal | Bedeutung & Text |
|---|---|---|
| 🔴 **STOP** | Roter Bildschirm, schriller Alarm, laute Stimme in Landessprache, pulsierende Vibration | Gefährliche chemische Kombination in der lokalen Datenbank detektiert (z. B. Säure + Hypochlorit $\to$ Chlorgas). |
| 🟠 **UNVERIFIED** | Bernsteinfarbener Bildschirm, distinktes Haptikmuster | Mindestens ein Produkt unbekannt, Barcode unleserlich, Daten unvollständig oder Datenstand veraltet. |
| ⚪ **NO_KNOWN_INCOMPATIBILITY** | Grauer Bildschirm (**niemals grün**) | Beide Produkte identifiziert, keine bekannte Regel ausgelöst. **Keine Freigabe.** Text: *„Keine bekannte gefährliche Kombination in unserer Datenbank. Dies ist keine Sicherheitsfreigabe. Nicht mischen, außer ausdrücklich vom Arbeitgeber angewiesen.“* |

## Warum das jetzt geht

- **100% Offline-Edge-Inferenz:** Schnelle Erkennung von GTIN-/GS1-Barcodes, GISCODEs oder Etiketten direkt auf dem Smartphone ohne Cloud-Latenz.
- **Mehrsprachige Sofort-Sprachausgabe:** Vorab aufgenommene und synthetisierte Alarmrufe in über 20 Sprachen (Ukrainisch, Polnisch, Türkisch, Arabisch, Rumänisch, Bulgarisch etc.) erreichen Arbeiter sofort ohne Textlese-Zwang.
- **Robuste Drei-Spuren-Datenarchitektur:** Klare Trennung zwischen gemeinfreiem EU-CLP-Recht (EUH031), optional lizenzierten GISCODE-Tabellen und offenen Sicherheitsdatenblättern.

## Datenstrategie: Drei rechtlich getrennte Spuren

1. **Öffentlich-rechtliche Spur (immer auslieferbar):** CLP-Gefahren- und EUH-Sätze. Insbesondere `EUH031` (*„Entwickelt bei Berührung mit Säure giftige Gase"*) ist der deterministische Primär-Trigger für Hypochlorit. Gemeinfrei und frei redistribuierbar.
2. **Lizenzierte Spur (optional, nur mit Erlaubnis):** WINGIS / GISBAU Daten inklusive offizieller GISCODE-Zuordnungen. Wird nur mit schriftlicher Genehmigung der BG BAU gebündelt. Die App funktioniert auch ohne diese Spur autark. **WINGIS/GESTIS dürfen nicht gescrapt oder unerlaubt weiterverbreitet werden.**
3. **Offene & Community-Spur:** Hersteller-Sicherheitsdatenblätter (wo Lizenzen es erlauben), GS1 Digital Link / GTIN-Identifikatoren sowie kuratierte Meldungen von Reinigungsbetrieben und Gewerkschaften via GitHub-Pull-Requests.

*Menschliche Verifikation:* Jedes Produkt durchläuft vor Aufnahme in eine Release-Datenbank eine manuelle Prüf-Queue. Automatisches SDS-Scraping birgt das Risiko falsch-negativer Einstufungen — der einzige Fehler, den dieses System nicht tolerieren darf.

## Skizze

**Eingabe:** Smartphone-Kamera scannt nacheinander oder parallel die Barcodes / GISCODEs / Etiketten zweier Reinigungsmittelflaschen.  
**Logik:** Lokale Inkompatibilitäts-Matrix berechnet Mengenvereinigung der Gefahrenmerkmale:
$$\text{combined} = \text{hazards}(A) \cup \text{hazards}(B)$$
$$\text{if } \text{rule.required} \subseteq \text{combined} \implies \text{STOP}$$
**Ausgabe:** 
- Bei Gefahr: 4 parallele Kanäle (Maximal-Lautstärke-Alarm, Vollbild-Blinken Rot, hochfrequente Wiederholungs-Vibration, Klartext-Warnung in Muttersprache).
- Bei Unbekannt: Amber-Screen (*UNVERIFIED*).
- Bei neutraler Paarung: Grauer Info-Screen (*NO_KNOWN_INCOMPATIBILITY*, niemals grün).

*Was nicht dazu gehört:* Lagerverwaltung, Entsorgungshinweise, Erste-Hilfe-Ratgeber, Erstellung von Sicherheitsdatenblättern oder Dokumentation für Audits.

## Erster Schritt

**Ticket:** P0: Standalone Offline-Regel-Kernel & Zwei-Barcode/GISCODE-Prüfinterlock mit 4-Kanal-Alarm.
**Fertig, wenn:**
1. Ein 100% offline lauffähiger Engine-Kern existiert, der für 20 reale Reinigungsmittelpaare (z. B. WC-Reiniger mit Phosphorsäure + DanKlorix mit Natriumhypochlorit) innerhalb von <50 ms deterministisch `STOP` liefert.
2. Unbekannte Produkte ausnahmslos als `UNVERIFIED` eingestuft werden.
3. Kein Testfall jemals ein grünes Signal oder ein Zertifikat ausgibt.
4. Bei Erkennung von `STOP` ein lauter Audio-Alarm (Test-Audio DE/EN/PL/UK/TR) nebst rotem UI-Flash ausgelöst wird.

## Wo es kippt (Die Achillesferse)

**Stummes Smartphone in lauter Umgebung:** Muted Audio, Kopfhörer/Bluetooth verbunden, Handy in Hosentasche, Lautsprecher durch Gummihandschuh verdeckt oder laute Staubsauger.  
*Gegenmaßnahme:* System erzwingt Alarm-Audiostream (bypasst Stummschaltung auf Betriebssystemebene, wo zulässig), kombiniert mit grellem Vollbild-Flackern, distinkten haptischen Impulsmustern und riesiger Typografie („STOPP! NICHT MISCHEN!").

## Wer es schon versucht hat

Die BG BAU betreibt mit WINGIS ein weltweites Vorzeigesystem, flankiert von GESTIS (IFA) und DGUV 101-019. Doch alle existierenden Werkzeuge verlangen aktives Suchen, Textverständnis und Vorab-Recherche am Schreibtisch. Am Einsatzort im Putzwagen gibt es bisher kein interaktives Schutzschild. Kommerzielle GS1-/Barcode-Apps scannen Inhaltsstoffe für Allergiker oder Kosmetik-Scores (Yuka, CodeCheck), besitzen aber keine physikalisch-chemische Reaktionsmatrix für Zwei-Komponenten-Mischungen.

## Vorarbeit & Normen

- **GefStoffV & DGUV Regel 101-019** (Umgang mit Reinigungs- und Pflegemitteln).
- **Verordnung (EG) Nr. 1272/2008 (CLP-Verordnung)** — Gefahrenhinweise EUH031, H314, H318.
- **GISBAU / GISCODE-Klassifikationssystem** für Reinigungsmittel (Produktgruppen GD, GG, GS, GU).

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
