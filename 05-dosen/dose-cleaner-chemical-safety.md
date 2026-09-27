---
status: Available
delivery_method: E-Mail
target_maker: BIV
review_score: 34/35
architecture_tier: Tier 1
source_type: Type A
---
# ChemGefahr-Stopp / MischStop (ChemHazard Stop)

*(englisch: ChemHazard Stop — Open-Source Chemical Mixing Warning Aid for Cleaners)*

**Ein Satz:** Kamera auf zwei Putzmittelflaschen richten: Warnt laut in der Sprache der Reinigungskraft vor gefährlichen Gasen und Verätzungen — offline, in unter 1 Sekunde; sagt wenn es etwas nicht prüfen kann, aber niemals „sicher“.

**Stand:** 27.09.2026 · **Prüfen ab:** März 2027
**Empfänger:** IG BAU Bundesfachgruppe Gebäudereinigung · Berufsgenossenschaft der Bauwirtschaft (BG BAU) · BIV (Bundesinnungsverband des Gebäudereiniger-Handwerks) · EU-OSHA · DGUV · EFCI · ver.di
**Verdikt:** 🎁 verschenken  
**Review:** 34/35 · Tier 1 · Type A (Details: [Audit-Bericht](../06-suche/amelie-classification-log.md))

---

![Point-of-Action-Kamerawarnung bei zwei Putzmittelflaschen: Smartphone erkennt sauren WC-Reiniger und Chlor-Bleichmittel](/chemhazard-stop.jpg)

> 📹 **Live-Demonstration:** [Point-of-Action Video auf Google Drive ansehen](https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link) *(on-demand gestreamt, 0 KB Vorab-Download)*

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

**Stummes Smartphone in lauter Umgebung:** Muted Audio, Kopfhörer/Bluetooth verbunden, Handy in Hosentasche, Lautsprecher durch Gummihandschuh verdeckt oder laute Staubsauger (85 dB).  
*Gegenmaßnahme:* Wenn kein Ton an ist oder überhört wird, greift die physisch-optische Redundanz: Das Smartphone vibriert energisch mit unverwechselbarem Notfall-Takt ([300, 100, 300, 100, 500] ms) und der gesamte Bildschirm emittiert einen hochfrequenten optischen Farb-Stroboskop-Blitz (Rot/Weiß), der selbst aus dem Augenwinkel und bei grellem Neonlicht wahrnehmbar ist. Wo Betriebssystem-Berechtigungen vorliegen, wird der Alarm-Audiostream (`STREAM_ALARM`) auf Maximallautstärke forciert.

## Wer es schon versucht hat

Die BG BAU betreibt mit WINGIS ein weltweites Vorzeigesystem, flankiert von GESTIS (IFA) und DGUV 101-019. Doch alle existierenden Werkzeuge verlangen aktives Suchen, Textverständnis und Vorab-Recherche am Schreibtisch. Am Einsatzort im Putzwagen gibt es bisher kein interaktives Schutzschild. Kommerzielle GS1-/Barcode-Apps scannen Inhaltsstoffe für Allergiker oder Kosmetik-Scores (Yuka, CodeCheck), besitzen aber keine physikalisch-chemische Reaktionsmatrix für Zwei-Komponenten-Mischungen.

## Vorarbeit & Normen

- **GefStoffV & DGUV Regel 101-019** (Umgang mit Reinigungs- und Pflegemitteln).
- **Verordnung (EG) Nr. 1272/2008 (CLP-Verordnung)** — Gefahrenhinweise EUH031, H314, H318.
- **GISBAU / GISCODE-Klassifikationssystem** für Reinigungsmittel (Produktgruppen GD, GG, GS, GU).

## Muster-E-Mails an Empfänger (Schenkungs-Post)

### 1. Anschreiben an die Arbeitgeber: BIV (Bundesinnungsverband des Gebäudereiniger-Handwerks)

**Empfänger:** BIV Bundesgeschäftsstelle (`info@die-gebaeudedienstleister.de` / `gl@die-gebaeudedienstleister.de`, z. Hd. Geschäftsführung Technik & Betriebswirtschaft / Arbeitssicherheit)  
**Betreff:** Arbeitsschutz & Haftungsschutz für Betriebe: Quelloffener Chemikalien-Mischschutz (Geschenk an den BIV)

```text
Sehr geehrte Damen und Herren der Geschäftsführung des BIV,
sehr geehrte Damen und Herren des Fachausschusses Technik und Betriebswirtschaft,

als Spitzenverband von über 2.500 Dienstleistern mit 700.000 Beschäftigten kennen Sie das tägliche Spannungsfeld Ihrer Mitgliedsbetriebe:
Unternehmer tragen die volle gesetzliche Fürsorge- und Haftungspflicht für den Arbeitsschutz nach GefStoffV und DGUV Regel 101-019. Gleichzeitig arbeiten Reinigungskräfte in den Objekten unter erheblichem Zeitdruck und über massive Sprachgrenzen hinweg. Das versehentliche Mischen von sauren Entkalkern mit hypochlorithaltiger Bleiche (Chlorgas-Bildung) ist der gefürchtetste Unfallklassiker — Betriebsausfälle, Rettungseinsätze und behördliche Ermittlungen sind die Folge.

Weder 15-seitige Sicherheitsdatenblätter noch deutsche Ordner im Putzraum schützen im Moment des Mischens. Wir haben deshalb ein schlüsselfertiges, 100% offline lauffähiges Point-of-Action-Assistenzwerkzeug entwickelt und schenken es der Branche bedingungslos (CC0 Public Domain):

ChemGefahr-Stopp (MischStop / ChemHazard Stop):
1. Point-of-Action Scan in unter 1 Sekunde: Die Reinigungskraft richtet das Smartphone an Ort und Stelle auf die zwei Gebinde (Barcode, GISCODE oder Gebinde-Etikett). Ein deterministischer Regel-Kernel prüft lokal und völlig ohne Internetverbindung (<1 ms), ob eine gefährliche chemische Reaktion droht.
2. Sprachunabhängiger Mehrkanal-Sofort-Alarm: Droht Gefahr, ertönt ein lauter Alarmruf in der jeweiligen Muttersprache der Arbeitskraft (Ukrainisch, Polnisch, Türkisch, Arabisch, Rumänisch, Bulgarisch etc.).
3. Zuverlässig auch ohne Ton / bei lauten Maschinen: Selbst wenn das Smartphone stummgeschaltet ist oder laute Sauger laufen, sendet das Display ein grelles 15-Hz-Farb-Stroboskop (Rot/Weiß) und vibriert mit unverwechselbarem Notfall-Takt (300-100-300-100-500 ms) — unübersehbar selbst durch dicke Nitrilhandschuhe.
4. Absoluter Haftungs- und Sicherheitsnachweis (Safety Case): Das System attestiert NIEMALS eine trügerische „Grün/Sicher“-Freigabe, sondern warnt ausschließlich vor erkannter Gefahr (STOP) oder deklariert fehlende Daten transparent als UNVERIFIED. Es ersetzt keine Unterweisung, schützt Betriebe aber vor fatalen Mischunfällen.

Das Projekt ist vollständig lauffähig, dokumentiert und frei von Rechten Dritter:
• Interaktiver Web-Simulator & Live-Demo: https://felixinberlin.github.io/Amelie/#dose=dose-cleaner-chemical-safety
• Video-Demonstration (Praxistest am Putzwagen): https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link
• Quellcode, Testsuite & Architektur: https://github.com/felixinberlin/Amelie/tree/main/07-demos/chemhazard-stop

„Diese Idee gehört niemandem. Nimm sie, bau sie, gib sie an eure Mitgliedsbetriebe weiter — Sie schulden mir nichts, nicht einmal eine Antwort. Wenn Sie eines Tages eine Idee haben, die Sie nicht selbst umsetzen, geben Sie sie jemandem weiter, der es tut.“

Mit freundlichen Grüßen für sichere und unfallfreie Betriebe,
Amélie Initiative (Félix, Berlin)
```

---

### 2. Anschreiben an die europäische Ebene: EU-OSHA (European Agency for Safety and Health at Work)

**Recipients:** EU-OSHA (`information@osha.europa.eu`, Attn: Prevention and Research Unit / Dangerous Substances Campaign)  
**CC:** German National Focal Point at BAuA (`eu-osha@baua.bund.de`)  
**Subject:** Point-of-Action Chemical Safety for Migrant Cleaners: ChemHazard Stop (Open Gift to EU-OSHA)

```text
Dear Dangerous Substances Prevention Team at EU-OSHA,
Dear Colleagues at the German National Focal Point,

Across the European Union, millions of commercial cleaners — a predominantly vulnerable, migrant workforce working non-standard hours — handle hazardous chemical formulations daily. 

Despite decades of regulatory efforts under REACH, CLP (Regulation EC 1272/2008), and national safety rules, severe mixing incidents continue to occur in confined spaces. The accidental mixture of acidic descalers with sodium hypochlorite bleaches instantly releases lethal chlorine gas (Cl2). The root cause is structural: 15-page Safety Data Sheets and national technical guidance remain locked in supervisors' folders and are inaccessible across language barriers at 3:00 AM.

To directly support EU-OSHA's mission of safe and healthy workplaces, we have built and open-sourced a turnkey, 100% offline point-of-action safety tool: ChemHazard Stop (MischStop).

We are gifting this entire project unconditionally to the European occupational health community (CC0 Public Domain):

Key Capabilities of ChemHazard Stop:
1. Instant Point-of-Action Verification: Cleaners aim their smartphone camera at two cleaning product containers (GTIN barcode, GISCODE, or label OCR). A deterministic local rule engine evaluates dangerous reaction risks on-device in <1 millisecond without requiring internet or cellular connectivity.
2. Polyglot Audio Alerts: When an incompatible pair is detected, loud spoken emergency instructions immediately trigger in the cleaner's native language (Ukrainian, Polish, Turkish, Arabic, Romanian, Bulgarian, Spanish, German, English, etc.).
3. Sensory Redundancy for Noisy Facilities: If the phone is muted or drowned out by 85 dB machinery, the handset pulses with an unmistakable emergency tactile cadence (300-100-300-100-500 ms) and flashes a high-intensity 15 Hz color optical strobe (red/white) visible even through nitrile gloves.
4. Formal Safety Case (Never Emits "Safe"): The system strictly rejects false reassurance. It never displays a green "safe" clearance. It either halts the worker on verified danger (STOP) or transparently flags incomplete data as UNVERIFIED.

Compliance & European Data Architecture:
The core engine runs on public-domain EU CLP statements (specifically EUH031: "Contact with acids liberates toxic gas"). It operates with zero tracking, zero cloud data transfer, and complete offline sovereignty.

Everything is turnkey, tested, and published under CC0 / Public Domain:
• Interactive Web Simulator & Live Demo: https://felixinberlin.github.io/Amelie/#dose=dose-cleaner-chemical-safety
• Video Demonstration (Field Demonstration): https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link
• Source Code, Test Suite & Specs: https://github.com/felixinberlin/Amelie/tree/main/07-demos/chemhazard-stop

"This idea belongs to no one. Take it, build it, deploy it across European workplaces — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will."

In solidarity for occupational health and safety across Europe,
Amélie Initiative (Félix, Berlin)
```

---

### 3. Anschreiben an IG BAU & BG BAU (Gewerkschaft & Gesetzliche Unfallversicherung)

**Empfänger:** IG BAU Bundesfachgruppe Gebäudereinigung / Bundesvorstand (`kontakt@igbau.de`, z. Hd. Ulrike Laux)  
**CC:** BG BAU – Berufsgenossenschaft der Bauwirtschaft (`info@bgbau.de` / `gefahrstoffe@bgbau.de`, z. Hd. Referat Gefahrstoffe / GISBAU)  
**Betreff:** Lebensschutz für Reinigungskräfte: ChemGefahr-Stopp (Quelloffenes Geschenk an IG BAU & BG BAU)

```text
Liebe Kolleginnen und Kollegen der IG BAU Gebäudereinigung (z. Hd. Ulrike Laux),
sehr geehrtes Team Gefahrstoffe und GISBAU/WINGIS der BG BAU,

wir wenden uns heute gemeinsam an Sie beide, weil der Schutz von Reinigungskräften vor gefährlichen Chemikalien nur im direkten Zusammenspiel von gelebter Arbeitsrealität (Gewerkschaft) und fundierter Prävention (Berufsgenossenschaft) gelingt:

Wir haben ein offenes, 100% offline lauffähiges Point-of-Action-Sicherheitswerkzeug entwickelt: ChemGefahr-Stopp (MischStop / ChemHazard Stop).

Das Problem an der Putzkammer:
Reinigungskräfte arbeiten unter extremem Zeitdruck, oft nachts und häufig über Sprachbarrieren hinweg. Das versehentliche Zusammenschütten von sauren Sanitär-Entkalkern (z. B. Amidosulfonsäure, Phosphorsäure) mit hypochlorithaltiger Chlorbleiche setzt in engen, fensterlosen Waschräumen schlagartig tödliches Chlorgas frei.
Die Mischverbote sind Lehrbuchwissen und in DGUV Regel 101-019 sowie WINGIS exzellent dokumentiert — aber im Moment des Mischens nützt ein 15-seitiges Sicherheitsdatenblatt im Büroordner nichts. Was bisher fehlte, ist ein Werkzeug, das physisch in der Sekunde des Mischens zwischen der Arbeitskraft und den zwei Flaschen steht.

Was das Werkzeug tut:
1. Sekundenschneller Scan (Point-of-Action): Kamera auf zwei Gebinde richten (Barcode, GISCODE oder Etikett). Ein deterministischer Regel-Kernel prüft in unter 1 Millisekunde auf dem Gerät, ob eine gefährliche chemische Reaktion droht — komplett ohne Internetverbindung.
2. Mehrsprachiger Sofort-Alarm: Bei Gefahr warnt eine laute Stimme in der jeweiligen Muttersprache der Reinigungskraft (Ukrainisch, Polnisch, Türkisch, Arabisch, Rumänisch, Bulgarisch, Deutsch, Englisch etc.).
3. Notfall-Alarm auch ohne Ton: Selbst wenn das Smartphone stummgeschaltet ist oder laute Industriestaubsauger (85 dB) dröhnen, vibriert das Telefon mit einem unverwechselbaren Notfall-Impuls (300-100-300-100-500 ms) und das Display sendet ein grelles optisches 15-Hz-Farb-Stroboskop (Rot/Weiß), sodass die Gefahr selbst aus dem Augenwinkel und durch Nitrilhandschuhe sofort wahrgenommen wird.
4. Unbestechlicher Sicherheitsnachweis (Safety Case): Das System attestiert niemals eine trügerische „Grün/Sicher“-Entwarnung, sondern warnt ausschließlich vor bekannter Gefahr (STOP) oder deklariert fehlende Daten transparent als UNVERIFIED.

Respektierung von Standards & Datenhoheit (Drei-Spuren-Architektur):
Wir betreiben kein unzulässiges Scraping von WINGIS oder GESTIS. Der Regel-Kernel basiert primär auf gemeinfreiem EU-CLP-Recht (insb. EUH031). Die Architektur ist exakt so ausgelegt, dass offizielle WINGIS-GISCODE-Datenbanken der BG BAU als lizenzierte Spur nahtlos andocken können, wenn die BG BAU dies freigeben oder selbst hosten möchte.

Das gesamte Projekt ist schlüsselfertig, lauffähig und bedingungslos gemeinfrei (CC0):
• Interaktiver Web-Simulator & Live-Demo: https://felixinberlin.github.io/Amelie/#dose=dose-cleaner-chemical-safety
• Video-Demonstration (Point-of-Action Praxistest): https://drive.google.com/file/d/1TGYV6aw7zWwe6isgin9UGvTJblDc-t8n/view?usp=drive_link
• Quellcode, Testsuite & Scaffolding: https://github.com/felixinberlin/Amelie/tree/main/07-demos/chemhazard-stop

„Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.“

Mit kollegialem Gruß für sichere Arbeit und gesunde Beschäftigte,
Amélie Initiative (Félix, Berlin)
```

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
