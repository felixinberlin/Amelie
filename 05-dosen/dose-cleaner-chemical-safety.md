---
status: Delivered
delivery_method: E-Mail
target_maker: BIV
review_score: 34/35
architecture_tier: Tier 1
source_type: Type A
---
# ChemGefahr-Stopp / MischStop (ChemHazard Stop)

*(englisch: ChemHazard Stop — Open-Source Chemical Mixing Warning Aid for Cleaners)*

**Ein Satz:** Zwei Putzmittel angeben, und ein Regel-Kern ohne Server warnt vor gefährlichen Mischungen wie Säure + Chlorreiniger. Er sagt nie „sicher“, nur STOP, „nicht prüfbar“ oder „keine bekannte Unverträglichkeit“. Kamera-Scan und Handy-App sind noch nicht gebaut.

**Stand:** 27.09.2026, Text überarbeitet 13.10.2026 · **Prüfen ab:** März 2027
**Empfänger:** IG BAU Bundesfachgruppe Gebäudereinigung · Berufsgenossenschaft der Bauwirtschaft (BG BAU) · BIV (Bundesinnungsverband des Gebäudereiniger-Handwerks) · EU-OSHA · DGUV · EFCI · ver.di
**Verdikt:** 🎁 verschenken  
**Review:** 34/35 · Tier 1 · Type A (Details: [Audit-Bericht](../06-suche/amelie-classification-log.md))

---

![Illustration (nicht die Demo): Smartphone warnt bei saurem WC-Reiniger und Chlor-Bleichmittel](/chemhazard-stop.jpg)

> **Was es heute gibt, was nicht (13.10.2026)**
> - **Gebaut und getestet:** Regel-Kern mit drei Zuständen (STOP, UNVERIFIED, grau ohne Freigabe), 45 reale Produkte aus Hersteller-Sicherheitsdatenblättern, Web-Demo mit Produktauswahl oder GTIN/UFI-Eingabe. Bei STOP: Warnton, Vibration (wo der Browser es erlaubt) und Warnsatz über die Sprachausgabe des Browsers in 7 Sprachen (DE, EN, UK, PL, TR, AR, RO).
> - **Nicht gebaut:** Kamera-Scan der Gebinde und Etiketten-OCR (Ticket 02), aufgenommene Warnrufe und Alarmsteuerung einer Handy-App (Ticket 03).
> - **Nächstes Ticket:** [Ticket 04](../07-demos/chemhazard-stop/ticket-04-web-scanner-und-qr-etiketten.md): Kamera-Scan von Barcode/QR im Browser und QR-Etiketten für Umfüllflaschen, offline.
> - **Korrektur:** Bis 12.10.2026 verlangte die Chlorgas-Regel `EUH031` auf dem Etikett; Dan Klorix (`EUH206`) und Domestos Professional (keiner der Sätze) blieben mit Säure ohne Warnung. Behoben. Die Mails vom 27.09.2026 beschrieben außerdem Kamera-Scan, 20+ Sprachen und ein 15-Hz-Stroboskop. Das stimmte nicht, und 15 Hz wäre ein Anfallsrisiko bei fotosensibler Epilepsie (WCAG 2.3.1: höchstens 3 Blitze pro Sekunde). Richtigstellung als Entwurf: `03-zuordnung/mails-q4-2026/mail-11b-korrektur.md`.

> 📹 **Video:** [auf Google Drive ansehen](https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link) *(on-demand gestreamt, 0 KB Vorab-Download)*


Quellenprüfung 12.10.2026: 41 reale Produkte plus zwei synthetische Beispiele, 92 GTIN-Zuordnungen (91 bestätigt), 36 dokumentierte aktuelle Hersteller-Quellenstände. 21 zusätzliche DR.SCHNELL-Produkte mit Hersteller-SDB und EAN aufgenommen; Meffert-SDB von 2025 ersetzt die Händlerkopie. GTIN/UFI müssen eindeutig sein, GISCODE bleibt Anzeige. Alle chemischen Vollständigkeitsprüfungen bleiben ausstehend; fünf neue Produkte behalten unknown. Dan Klorix bleibt per Barcode unbestätigt, Buzil und Domestos haben offene Quellenstände. Mellerud bleibt ein Inhaltsstoffblatt ohne vollständiges SDB. pH bei 1% Lösung wird nicht als Konzentrat-pH behandelt. Belege und offene Punkte: `07-demos/chemhazard-stop/product-review-2026-10-12.md`. Tests belegen Software-Invarianten, keine chemische Sicherheitsfreigabe.


Ergänzung nach PR #202: Vier weitere Herstellerprodukte (PEROTEX INTENSIV, GASTRO PUR ECO, MILIFEE, PEROCID ECO) sind mit unbekannten Gefahren und unbestätigten GTIN-Zuordnungen auswählbar. Die 43 Datensätze aus der Quellenprüfung bleiben unverändert. Aktueller Bestand: 45 reale Produkte (41 mit belegten Gefahren, vier ungeprüft) plus zwei synthetische Beispiele; 96 GTIN-Zuordnungen (91 bestätigt). Die neuen Einträge bleiben UNVERIFIED.

## Das Problem

Reinigungskräfte im gewerblichen Bereich arbeiten unter extremem Zeitdruck und häufig über erhebliche Sprachbarrieren hinweg. Das versehentliche Mischen eines sauren Sanitär-Entkalkers mit einer hypochlorithaltigen Chlorbleiche setzt in engen, fensterlosen Waschräumen und Putzkammern sofort toxisches Chlorgas frei. 

Die Gefahr ist seit Jahrzehnten bekannt, das Mischverbot ist Lehrbuchwissen — und trotzdem kommt es regelmäßig zu Unfällen. Der Grund: Sicherheitswarnungen stehen in 15-seitigen technischen Sicherheitsdatenblättern oder deutschen Betriebsanweisungen im Büroordner, die mitten in der Nachtschicht niemand liest. 

Deutschland besitzt exzellente Referenz-Infrastruktur: WINGIS/GISBAU (Gefahrstoff-Informationssystem, GISCODE, Betriebsanweisungen), GESTIS/IFA, GSApp, CERTISCAN und DGUV Regel 101-019. Doch alle diese Systeme sind rein abfragebasiert (*Lookup*). Kein einziges Werkzeug steht in der Sekunde des Mischens physisch zwischen der Arbeitskraft und den zwei Flaschen. Stand September 2026 existiert kein quelloffener, kamerabasierter Zwei-Flaschen-Mischschutz auf dem Markt. Das ist die Lücke.

## Kernprinzip: Getestete Software-Invarianten

**Die App attestiert niemals Sicherheit. Sie warnt ausschließlich vor erkannter Gefahr oder gibt transparent zu, dass sie nicht prüfen kann.**

Dies ist keine Design-Entscheidung, sondern der fundamentale Sicherheitsnachweis (*Safety Case*). Ein falsch-positives „alles sicher" (grüner Haken) ist lebensgefährlich und weitaus schlimmer als gar keine App. Daraus folgen unumstößliche Systemregeln:
1. **Niemals ein grünes Ergebnis.** Es gibt keinen „Freigabe"-Zustand.
2. **Unbekannte Identität führt zu UNVERIFIED; ausstehende Reviews dürfen belegtes STOP nicht abschwächen.**
3. **Community-Daten dürfen einen STOP-Zustand niemals überschreiben.**
4. **Reine Assistenz:** Die App ist eine warnende Hilfe, keine zertifizierte PSA, kein Compliance-Werkzeug und kein Ersatz für die gesetzliche Gefährdungsbeurteilung des Arbeitgebers nach GefStoffV und DGUV 101-019.

### Die drei Systemzustände

| Zustand | Signal | Bedeutung & Text |
|---|---|---|
| 🔴 **STOP** | Roter Bildschirm, schriller Alarm, laute Stimme in Landessprache, pulsierende Vibration | Gefährliche chemische Kombination in der lokalen Datenbank detektiert (z. B. Säure + Hypochlorit $\to$ Chlorgas). |
| 🟠 **UNVERIFIED** | Bernsteinfarbener Bildschirm, distinktes Haptikmuster | Mindestens ein Produkt unbekannt, Barcode unleserlich, Daten unvollständig oder Datenstand veraltet. |
| ⚪ **NO_KNOWN_INCOMPATIBILITY** | Grauer Bildschirm (**niemals grün**) | Identität eindeutig, Gefahren bestätigt, Vollständigkeit geprüft und aktuelle Fassung bestätigt; keine bekannte Regel ausgelöst. **Keine Freigabe.** Text: *„Keine bekannte gefährliche Kombination in unserer Datenbank. Dies ist keine Sicherheitsfreigabe. Nicht mischen, außer ausdrücklich vom Arbeitgeber angewiesen.“* |

## Warum das jetzt geht

- **Barcode-Erkennung auf dem Gerät:** Smartphones und Browser können GTIN-/GS1-Barcodes ohne Server lesen; der Abgleich mit bestätigten GTIN-Zuordnungen oder eindeutigen UFIs (GISCODE nur Anzeige) läuft lokal. Für ChemGefahr-Stopp noch nicht gebaut (Ticket 02).
- **Sprachausgabe ohne Textlesen:** Die Demo spricht den Warnsatz heute über die Sprachausgabe des Browsers in 7 Sprachen; aufgenommene Warnrufe in mehr Sprachen sind Ticket 03.
- **Robuste Drei-Spuren-Datenarchitektur:** Klare Trennung zwischen öffentlichen Tatsachen aus CLP-Kennzeichnung und Sicherheitsdatenblatt (Gefahrensätze, CAS-Nummern), optional lizenzierten GISCODE-Tabellen und Community-Meldungen.

## Datenstrategie: Drei rechtlich getrennte Spuren

1. **Öffentlich-rechtliche Spur (immer auslieferbar):** CLP-Gefahren- und EUH-Sätze sowie die Inhaltsstoffe (CAS-Nummern) aus dem Sicherheitsdatenblatt des Herstellers. Der deterministische Auslöser für Hypochlorit ist der Inhaltsstoff selbst (Natriumhypochlorit, CAS `7681-52-9`). `EUH031` (*„Entwickelt bei Berührung mit Säure giftige Gase"*) und `EUH206` sind zusätzliche Hinweise vom Etikett, aber keine Bedingung: Viele Chlorreiniger tragen nur `EUH206` oder keinen der beiden Sätze (geprüft an den Referenzprodukten, 12.10.2026). Tatsachen, frei weiterzugeben.
2. **Lizenzierte Spur (optional, nur mit Erlaubnis):** WINGIS / GISBAU Daten inklusive offizieller GISCODE-Zuordnungen. Wird nur mit schriftlicher Genehmigung der BG BAU gebündelt. Die App funktioniert auch ohne diese Spur autark. **WINGIS/GESTIS dürfen nicht gescrapt oder unerlaubt weiterverbreitet werden.**
3. **Offene & Community-Spur:** Hersteller-Sicherheitsdatenblätter (wo Lizenzen es erlauben), GS1 Digital Link / GTIN-Identifikatoren sowie kuratierte Meldungen von Reinigungsbetrieben und Gewerkschaften via GitHub-Pull-Requests.

*Menschliche Verifikation:* Jedes Produkt durchläuft vor Aufnahme in eine Release-Datenbank eine manuelle Prüf-Queue. Automatisches SDS-Scraping birgt das Risiko falsch-negativer Einstufungen — der einzige Fehler, den dieses System nicht tolerieren darf.

## Skizze

**Eingabe:** Heute: Auswahl aus der Produktliste oder Eingabe von GTIN/UFI. Ziel: Smartphone-Kamera liest nacheinander die Barcodes zweier Flaschen (GISCODE nur Anzeige).
**Logik:** Lokale Inkompatibilitäts-Matrix berechnet Mengenvereinigung der Gefahrenmerkmale:
$$\text{combined} = \text{hazards}(A) \cup \text{hazards}(B)$$
$$\text{if } \text{rule.required} \subseteq \text{combined} \implies \text{STOP}$$
**Ausgabe:** 
- Bei Gefahr: roter Vollbild-Warnbildschirm (kein schnelles Blinken, höchstens 3 Wechsel pro Sekunde), Warnton, Vibration, Warnsatz in der gewählten Sprache.
- Bei Unbekannt: Amber-Screen (*UNVERIFIED*).
- Nach drei dokumentierten Evidenzprüfungen ohne Regel-Treffer: Grauer Info-Screen (*NO_KNOWN_INCOMPATIBILITY*, niemals grün).

*Was nicht dazu gehört:* Lagerverwaltung, Entsorgungshinweise, Erste-Hilfe-Ratgeber, Erstellung von Sicherheitsdatenblättern oder Dokumentation für Audits.

## Erster Schritt

**Ticket:** P0: Standalone Offline-Regel-Kernel & Zwei-GTIN/UFI-Prüfinterlock mit 4-Kanal-Alarm.
**Fertig, wenn:**
1. Ein 100% offline lauffähiger Engine-Kern existiert, der für 20 reale Reinigungsmittelpaare (z. B. WC-Reiniger mit Phosphorsäure + DanKlorix mit Natriumhypochlorit) innerhalb von <50 ms deterministisch `STOP` liefert.
2. Unbekannte Produkte ausnahmslos als `UNVERIFIED` eingestuft werden.
3. Kein Testfall jemals ein grünes Signal oder ein Zertifikat ausgibt.
4. Bei Erkennung von `STOP` ein lauter Audio-Alarm (Test-Audio DE/EN/PL/UK/TR) nebst rotem UI-Flash ausgelöst wird.

## Wo es kippt (Die Achillesferse)

**Stummes Smartphone in lauter Umgebung:** Muted Audio, Kopfhörer/Bluetooth verbunden, Handy in Hosentasche, Lautsprecher durch Gummihandschuh verdeckt oder laute Staubsauger (85 dB).  
*Gegenmaßnahme (geplant, Ticket 03):* Vibration im Notfall-Takt ([300, 100, 300, 100, 500] ms, in der Demo bereits, wo der Browser es erlaubt), ein roter Vollbild-Warnbildschirm ohne schnelles Blinken (höchstens 3 Wechsel pro Sekunde, sonst Anfallsrisiko bei fotosensibler Epilepsie) und in einer Handy-App der Alarm-Audiostream (`STREAM_ALARM`). Ein Browser kann die Stummschaltung nicht umgehen; das kann erst eine App.

**Zweiter Kipppunkt: falsche Produktdaten.** Eine Lücke im Datensatz verschluckt eine Warnung, siehe Korrektur oben (`EUH031`). Deshalb hängt jede Regel an Inhaltsstoffen (CAS) statt an Etikettensätzen, und jeder Datensatz trägt Fundstelle, Datum und Hash des Herstellerdokuments.

## Wer es schon versucht hat

Die BG BAU betreibt mit WINGIS ein weltweites Vorzeigesystem, flankiert von GESTIS (IFA) und DGUV 101-019. Doch alle existierenden Werkzeuge verlangen aktives Suchen, Textverständnis und Vorab-Recherche am Schreibtisch. Am Einsatzort im Putzwagen gibt es bisher kein interaktives Schutzschild. Kommerzielle GS1-/Barcode-Apps scannen Inhaltsstoffe für Allergiker oder Kosmetik-Scores (Yuka, CodeCheck), besitzen aber keine physikalisch-chemische Reaktionsmatrix für Zwei-Komponenten-Mischungen.

## Vorarbeit & Normen

- **GefStoffV & DGUV Regel 101-019** (Umgang mit Reinigungs- und Pflegemitteln).
- **Verordnung (EG) Nr. 1272/2008 (CLP-Verordnung)** — Gefahrenhinweise EUH031, H314, H318.
- **GISBAU / GISCODE-Klassifikationssystem** für Reinigungsmittel (Produktgruppen GD, GG, GS, GU).

## Zustellung

| Datum | An | Stand |
|---|---|---|
| 27.09.2026 14:25 | IG BAU Gebäudereinigung (`gebaeudereinigung@igbau.de`) | versendet, keine Antwort |
| 27.09.2026 14:32 | IG BAU (`kontakt@igbau.de`) + BG BAU (`gisbau@bgbau.de`) | versendet, keine Antwort |
| 27.09.2026 | Gebäudedienstleister (`info@`, `gl@die-gebaeudedienstleister.de`) | versendet, keine Antwort |
| 27.09.2026 15:11 | BIV, Christine Sudhop (`biv@die-gebaeudedienstleister.de`) | versendet, keine Antwort; Wortlaut `03-zuordnung/mails-q4-2026/mail-11-biv.md` |
| — | dieselben vier: Richtigstellung | **Entwurf** `03-zuordnung/mails-q4-2026/mail-11b-korrektur.md`, Entscheidung Félix |
| — | EU-OSHA + BAuA Focal Point | **Entwurf, neu geschrieben 13.10.2026** `03-zuordnung/mails-q4-2026/mail-12-eu-osha.md`; Ansprechperson vor Versand verifizieren |

Kein Nachfassen bei IG BAU (Regel 3). Die Texte vom 27.09. stehen wortgetreu in `mail-11-biv.md` und in `src/data/deliveries.ts` und werden nicht nachträglich geändert; sie sind als Vorlage für neue Empfänger **nicht** mehr geeignet.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.“

Mit kollegialem Gruß für sichere Arbeit und gesunde Beschäftigte,
Amélie Initiative (Félix, Berlin)
```

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
