# Couleur-Sphinx: Der Air-Gapped S2S Klingel-Gatekeeper

**ID:** 041  
**Kategorie:** Hardware & Akademische Traditionen  
**Zielgruppe:** Türwachen (Chargierte) von Berliner Studentenverbindungen und reisende Couleurstudenten (Couleurbummel).  
**Lizenz:** CC0 1.0 Public Domain  

---

## Das Problem

Die Verwaltung der Haustür während eines Couleurbummels ist mühsam und bindet Aktive (Türwachen / Chargierte) im Haus. Gleichzeitig stellt die direkte Kopplung einer generativen KI an einen elektronischen Türöffner (Summer) ein massives Sicherheitsrisiko (Prompt-Injection, Voice-Spoofing, Halluzinationen) dar, wodurch Unbefugte physischen Zutritt zum Haus erlangen könnten.

Kommerzielle Smart-Doorbells (wie Ring oder DoorBird) übertragen permanente Videodaten in US-Clouds und überwachen den öffentlichen Straßenraum, was am Privathaus datenschutzrechtlich (DSGVO, KunstUrhG, EU AI Act) hochriskant ist.

---

## Die Lösung (Das Konzept)

Ein kleiner Touchscreen mit Mikrofon an der Haustür fungiert als interaktiver, physisch isolierter (*air-gapped*) Wächter. Die KI unterhält sich mit den Gästen und testet auf humorvolle Weise ihr Couleurwissen oder lokales historisches Wissen (Couleur-Comment, Farben, Zirkel, Stadtgeschichte).

Besteht der Besucher den Test, löst die KI ein Relais aus, das **ausschließlich die interne Hausklingel** betätigt. Die Haustür bleibt physisch verschlossen, bis ein aktives Mitglied im Haus entscheidet, sie manuell zu öffnen.

![Couleur-Sphinx Architektur und Air-Gap](/couleur-sphinx.png)

---

## Technische Architektur

* **Hardware:** Ein Raspberry Pi (4 oder 5) oder ESP32-S3 / Pi Zero 2 W, gekoppelt mit einem wetterfesten USB-/I2S-Konferenzmikrofon und einem Display.
* **Software:** Eine latenzarme Speech-to-Speech (S2S) Pipeline (lokal via Whisper.cpp + Ollama + Piper-TTS oder per schneller Streaming-API).
* **Ausführungsschicht & Air-Gap:** Das LLM verfügt über einen einzigen, deterministischen Function-Call (`ring_internal_bell()`), der ein 5V GPIO-Relais ansteuert. Dieses Relais ist ausschließlich mit der traditionellen Hausklingel (Gong) verbunden und umgeht den elektronischen Türöffner physisch komplett. Selbst ein erfolgreicher Jailbreak kann physikalisch keinen Türöffner betätigen.

---

## Geschätzte Kosten (Preise)

### Einmalige Hardwarekosten (CapEx)

| Komponente | Geschätzte Kosten | Details |
| :--- | :--- | :--- |
| **Recheneinheit** | 55 € – 95 € | Raspberry Pi 4 oder 5, 4 GB RAM |
| **Interface** | 40 € – 55 € | Offizielles 5-Zoll oder 7-Zoll Touch-Display / Rund-LCD |
| **Audio I/O** | 25 € – 35 € | Kompaktes USB-/I2S-Mikrofon und Mini-Lautsprecher |
| **Relais** | 5 € – 10 € | Standard 5V GPIO-Relais-Board mit galvanischer Trennung |
| **Gehäuse** | 20 € – 35 € | IP65/IP67 wetterfeste Abzweigdose oder 3D-Druck (PETG/ABS) |
| **Peripherie** | 20 € – 25 € | High-Endurance MicroSD, 5V/3A USB-C Netzteil, Verkabelung |
| **Gesamt** | **ca. 165 € – 255 €** | **Pro Türinstallation** |

### Laufende Software- & KI-Kosten (OpEx)

| Modell | Fixkosten / Monat | Variable Kosten | Eignung für Studenten |
| :--- | :--- | :--- | :--- |
| **Lokaler Stack (Ollama + Whisper.cpp + Piper)** | **0,00 €** | 0,00 € (nur Strom) | **Sehr hoch (Empfohlen):** Keine laufenden Kosten, maximale Privatsphäre. |
| **Custom-Stack (BYOK Developer APIs)** | ca. 18,00 € (Server) | 0,07 € – 0,11 € / Minute | **Gut:** Schnellere Inferenz, Deepgram STT + Cartesia/ElevenLabs TTS. |
| **Turn-key Wrapper Plattformen (Vapi, Retell AI)** | 29 € – 1.250 € | 0,07 € – 0,30 € / Minute | **Nicht empfohlen:** Hohe Grundgebühren, Bindung an Drittanbieter. |

---

## Übergabe & Der Pledge

Dieses Konzept ist als "Blechdose" für einen technikaffinen Fux oder Burschen (Informatik / Elektrotechnik) im Berliner Verbindungsnetzwerk gedacht, der die KI humoristisch auf die Hauskultur abstimmen kann und die Hardware sicher in den bestehenden Klingelkreislauf integriert.

**Der Pledge:**

> *Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut. (CC0 / Public Domain)*  
> — Félix, Berlin
