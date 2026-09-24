# Couleur-Sphinx 2.0: Der wachende Klingel-Gatekeeper für Berliner Studentenverbindungen

*Air-Gapped S2S, schlafendes Kamera-Auge, Avatar und Mitglieder-Steuerung*

**Status:** Gepackte Dose (`couleur-sphinx`)  
**Datum:** 24. September 2026  
**Lizenz:** CC0 1.0 Public Domain  

---

## Die Idee

Ein kleiner, wetterfester Gatekeeper an der Haustür unterhält sich mit Besuchern. Er prüft auf humorvolle Weise Couleurwissen oder lokale Geschichte. Besteht der Besucher, betätigt er nur die interne Hausklingel – **niemals den elektrischen Türöffner**.

![Couleur-Sphinx 2.0 Systemübersicht](/couleur-sphinx.png)

### Die drei Neuerungen von Version 2.0

1. **Das Kamera-Auge ist standardmäßig geschlossen.**  
   Ein mechanisches Augenlid (Servo-Shutter) verdeckt die Linse physisch. Die Kamera ist im Ruhezustand komplett stromlos geschaltet. Sie öffnet sich nur, wenn der Besucher am Klingeltaster ausdrücklich zustimmt.
2. **Ein kleines Avatar-Display zeigt Augen, Blinzeln und Zustände.**  
   Statt eines teuren, vandalismusgefährdeten Touchscreens kommt ein günstiges, 1,28″ großes rundes LCD (GC9A01) zum Einsatz. Es stellt animierte Augen dar, die den Systemzustand widerspiegeln (Schlafen, Zuhören, Grübeln, Schmunzeln, Feiern).
3. **Mitglieder können das Gespräch live übernehmen.**  
   Über ein geschütztes Dashboard am Smartphone (via Tailscale / WireGuard mit 2FA). Der Besucher hört immer dieselbe synthetische TTS-Stimme – ob KI oder Mensch spricht, bleibt verborgen (oder wird nach Wunsch transparent gehalten).

---

## Datenschutz by Design

* **Auge zu:** Kamera physisch verdeckt und stromlos.
* **Consent per Taster:** Zwei getrennte IP65-Taster an der Front (`[Kamera AN]` / `[Nur Audio]`).
* **Audio-only als vollwertiger Pfad:** Der Test funktioniert ohne Einschränkungen rein über Sprache.
* **Keine Speicherung:** Weder Audio noch Videobilder werden auf Datenträgern gespeichert (flüchtige Verarbeitung im RAM).
* **Transparente KI-Offenlegung:** Begrüßung durch die Sphinx: *„Ich bin eine KI-Sprechanlage. Ich kann dich sehen, wenn du einverstanden bist. Sonst machen wir nur Audio.“*
* **Sicheres Dashboard:** Zugriff nur im VPN (Tailscale mit 2FA), Live-Stream ohne Archivierung, automatischer Verbindungs-Timeout.
* **Hinweisschild an der Pforte:** *„KI-Sprechanlage mit optionaler Kamera. Audio wird lokal verarbeitet. Datenschutzerklärung via QR-Code.“*

---

## Technische Architektur

| Ebene | Aufgabe | Empfohlene Hardware |
| :--- | :--- | :--- |
| **Edge (Türstation)** | Mikrofon, Lautsprecher, Kamera, Servo-Lid, Avatar-LCD, Relais, Taster | Raspberry Pi Zero 2 W, ESP32-S3 oder Raspberry Pi 5 |
| **Server (lokal im Haus)** | STT (Whisper), LLM (Ollama), TTS (Piper), Orchestrierung, Dashboard | Vorhandener PC, Mac Mini oder gebrauchter 1L-Tiny-PC |
| **Clients** | Mitglieder-Handys im Haus | Mobiler Browser via privates Tailscale-Netzwerk |

### Strikter Hardware-Air-Gap

Das LLM besitzt nur ein einziges Werkzeug (*Tool Call*): `ring_internal_bell()`. Dieses Signal schaltet ein 5V-Galvanik-Relais, das direkt an den Zweidraht-Gong im Hausflur angeschlossen ist. Der elektrische Türöffner (Summer) besitzt **keine physikalische Verbindung** zum System. Ein Einlass erfordert stets das manuelle Öffnen durch einen Hausbewohner.

---

## Fünf Human-in-the-Loop Modi

| Modus | Ablauf | Anwendungsfall |
| :--- | :--- | :--- |
| **1. Autonom** | Die KI führt das Gespräch und prüft das Couleurwissen vollkommen selbstständig. | Standardbetrieb während ruhiger Abende. |
| **2. Supervised** | Die KI generiert Antwortvorschläge; das Mitglied im Haus gibt sie per Tastendruck frei. | Wichtige Besuche oder heikle Gäste. |
| **3. Puppet (Text-to-Speech)** | Das Mitglied tippt eine eigene Antwort im Dashboard; die Sphinx spricht sie mit ihrer gewohnten TTS-Stimme. | Gezielte Insider-Witze und Hausbräuche. |
| **4. Voice Takeover (Vocoder)** | Das Mitglied spricht live in das Smartphone-Mikrofon; die Stimme wird in Echtzeit zur Roboterstimme konvertiert. | Direkte humorvolle Unterhaltung. |
| **5. Silent Bell** | Das Mitglied drückt einen Knopf und löst ohne weitere Fragen die Glocke aus. | Bekannte Freunde oder Bundesbrüder. |

---

## Preistabellen & Hardware-Kombinationen

### Drei vorkonfigurierte Ausbaustufen

#### Variante A: Günstigste Ausbaustufe (~70 € – 90 €)
*Ideal für Tüftler mit schmalem Budget, nutzt vorhandene Rechnerressourcen.*
* ESP32-S3 CAM Entwicklerboard: ~15 €
* I2S-Mikrofon (INMP441) + I2S-Verstärker (MAX98357A) + Kleinlautsprecher: ~10 €
* SG90 Mikro-Servo + 3D-gedrucktes mechanisches Augenlid: ~5 €
* 1,28″ Rund-LCD (Waveshare GC9A01, SPI): ~10 €
* 5V Optokoppler-Relais + 2 wetterfeste IP65-Drucktaster: ~4 €
* IP65-Aufputz-Abzweigdose (wetterfest): ~13 €
* Lokaler Server: Vorhandener WG-Laptop / Heimserver: 0 €
* **Summe Hardware: ca. 70 € – 90 €**

#### Variante B: Ausgewogene Mittelklasse (~200 €)
*Ausgewogen in Zuverlässigkeit, Audioqualität und einfacher Linux-Wartung.*
* Raspberry Pi Zero 2 W: ~18 €
* ReSpeaker 2-Mics Pi HAT (mit integriertem Audio-Codec): ~12 €
* Raspberry Pi Camera Module V2: ~18 €
* MG90S Metallgetriebe-Servo + stabiles Augenlid: ~8 €
* 1,28″ Rund-LCD (GC9A01): ~12 €
* 5V Relais-Modul + 2 vandalismusgeschützte LED-Taster: ~8 €
* IP65 Industriegehäuse, USB-Netzteil, High-Endurance microSD: ~25 €
* Lokaler Server: Gebrauchter Refurbished Mini-PC (Intel Core i5, 8 GB RAM): ~80 € – 90 €
* **Summe Hardware: ca. 180 € – 210 €**

#### Variante C: Premium Enterprise (~400 €)
*Beste Mikrofon-Richtwirkung bei Straßenlärm, robuste Vollmetall-Mechanik und blitzschnelle lokale Inferenz.*
* Raspberry Pi 5 (8 GB RAM): ~80 €
* ReSpeaker 4-Mic Array mit Hardware-AEC + Visaton Wetterfest-Lautsprecher: ~45 €
* Raspberry Pi Camera Module 3 (Wide Angle, HDR): ~30 €
* Hochdrehmoment-Servo (Digital Coreless) + gefrästes Messing-Augenlid: ~20 €
* 1,28″ Rund-LCD IPS mit gehärtetem Frontglas: ~15 €
* Relais-Board mit Überspannungsschutz + Edelstahl-Taster IP67: ~15 €
* Wetterfestes Aluminium-Druckgussgehäuse + MeanWell Hutschienen-Netzteil: ~35 €
* Lokaler Server: Refurbished Lenovo ThinkCentre M920q Tiny (i5-8500T, 16 GB RAM, NVMe): ~150 €
* **Summe Hardware: ca. 390 € – 415 €**

---

### Vergleichende Komponenten- & Preismatrix (CapEx)

| Baugruppe | Budget (ESP32-S3) | Mittelklasse (Pi Zero 2 W) | Premium (Pi 5 / ThinkCentre) |
| :--- | :--- | :--- | :--- |
| **Edge-Rechner** | ESP32-S3 CAM (~15 €) | Pi Zero 2 W (~18 €) | Pi 5 8 GB (~80 €) |
| **Mikrofon & Audio** | INMP441 + MAX98357A (~10 €) | ReSpeaker 2-Mics HAT (~12 €) | ReSpeaker 4-Mic Array (~45 €) |
| **Kamera-Modul** | ESP32-CAM integriert (0 €) | RPi Camera V2 (~18 €) | RPi Camera 3 Wide (~30 €) |
| **Augenmechanik** | SG90 + 3D-Druck Lid (~5 €) | MG90S Metall + Lid (~8 €) | Digital-Servo + Metall (~20 €) |
| **Avatar-Display** | 1,28″ Rund-LCD (~10 €) | 1,28″ Rund-LCD (~12 €) | 1,28″ Rund-LCD IPS (~15 €) |
| **Relais & Taster** | 5V Relais + 2 Taster (~4 €) | Relais + LED-Taster (~8 €) | Schutz-Relais + IP67 (~15 €) |
| **Gehäuse & Strom** | IP65 Box + Netzteil (~13 €) | IP65 Box + PSU + SD (~25 €) | Alu-Box + MeanWell PSU (~35 €) |
| **Haus-Server** | Vorhandener PC (0 €) | Mini-PC i5 Refurbished (~80 €) | ThinkCentre M920q 16G (~150 €) |
| **Gesamtkosten (BOM)** | **~70 € – 90 €** | **~180 € – 210 €** | **~390 € – 415 €** |

---

### Laufende Betriebskosten (OpEx)

| Kostenart | Lokaler Betrieb (Offline / Self-Hosted) | Hybrid (BYOK Cloud APIs) | Wrapper-Dienste (Vapi, Retell) |
| :--- | :--- | :--- | :--- |
| **Spracherkennung (STT)** | 0,00 € (Whisper.cpp) | ~0,004 € / min (Deepgram Nova-2) | In Flat/Minutenpaket |
| **Sprachmodell (LLM)** | 0,00 € (Ollama / Llama-3-8B) | ~0,003 € / min (Gemini Flash / Haiku) | In Flat/Minutenpaket |
| **Sprachsynthese (TTS)** | 0,00 € (Piper-TTS) | ~0,050 € / min (Cartesia / ElevenLabs) | In Flat/Minutenpaket |
| **Hosting & VPN** | 0,00 € (Tailscale Free Tier) | 0,00 € – 15,00 € / Monat | 29,00 € – 1.250,00 € / Monat |
| **Stromverbrauch** | ~15 W Mini-PC ≈ 3,50 € / Monat | ~5 W Edge-Node ≈ 1,20 € / Monat | ~5 W Edge-Node ≈ 1,20 € / Monat |
| **Monatliche Gesamtkosten** | **ca. 3,50 € (nur Strom)** | **ca. 5 € – 15 € (bei 50 Gesprächen)** | **ab 35 € bis hunderte Euro** |

---

## Ablauf eines Gesprächs an der Haustür

```
[Besucher drückt Klingel]
       │
       ▼
[Auge bleibt geschlossen (Shutter zu)]
[1,28" Avatar wacht auf, blinzelt freundlich]
       │
       ▼
[Sphinx spricht: "Ich bin eine KI-Sprechanlage. Ich kann dich sehen, wenn du zustimmst."]
       │
       ├─────────────────────────────────┬─────────────────────────────────┐
       ▼                                                                   ▼
[Besucher drückt: KAMERA AN]                                        [Besucher drückt: NUR AUDIO]
[Servo öffnet Shutter, Kamera bestromt]                             [Shutter bleibt zu, Kamera aus]
       │                                                                   │
       └─────────────────────────────────┬─────────────────────────────────┘
                                         ▼
                      [Sphinx stellt humorvolle Frage]
                 (z. B. "Welche Farben trägt das älteste Corps?")
                                         │
                                         ▼
                               [Besucher antwortet]
                                         │
                                         ▼
                       [Whisper → LLM bewertet Antwort]
                                         │
                                         ▼
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
             [Test bestanden]                          [Nicht bestanden]
                    │                                         │
                    ▼                                         ▼
       [5V Relais schlägt Gong 🔔]                  [Humorvoller Trostspruch]
      [Hausbewohner entscheidet manuell]              [Kein Klingelsignal]
                    │                                         │
                    └────────────────────┬────────────────────┘
                                         ▼
                     [Gesprächsende: Servo schließt Auge]
                    [Kamera stromlos, RAM wird freigegeben]
```

---

## Lizenz & Pledge

Dieses Forschungskonzept ist Teil des Amélie-Poulain-Projekts. Alle Pläne, Tabellen und Skizzen sind bedingungslos gemeinfrei:

> *Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut. (CC0 1.0 Public Domain)*  
> — Félix, Berlin
