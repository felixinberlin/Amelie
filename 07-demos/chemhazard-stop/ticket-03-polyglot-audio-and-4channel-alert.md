# Ticket 03: 4-Kanal-Alarmsystem & Mehrsprachige Audio-Engine

**Komponente:** `07-demos/chemhazard-stop` / `app/alerting`  
**Status:** BEREIT FÜR IMPLEMENTIERUNG (27. September 2026)  
**Zuständigkeit:** Audio Engineering / Haptics / Accessibility / Multilingual UX  
**Zugehörige Dose:** [`05-dosen/dose-cleaner-chemical-safety.md`](../../05-dosen/dose-cleaner-chemical-safety.md)  

---

## 1. Problemstellung

Ein reines Bildschirm-Popup versagt im Reinigungsalltag: Das Smartphone liegt während des Wischens auf dem Reinigungswagen, steckt in der Tasche der Arbeitshose oder der Arbeiter trägt Kopfhörer gegen den Lärm der Scheuersaugmaschine.

Ziel dieses Tickets ist die Implementierung des synchronisierten 4-Kanal-Alarmsystems, das bei Detektion des Zustands 🔴 `STOP` alle sensorischen Ausgabekanäle des Smartphones gleichzeitig auf Maximallast ansteuert:
1. **Audio:** Frequenzoptimierter Alarmstream (übersteuert Stummschaltung) + lauter Sprachruf in Landessprache.
2. **Visuell:** Kontrastreiches Stroboskop-Flackern (Rot/Weiß) und Ansteuerung der Kamera-Taschenlampe (LED-Strobe).
3. **Haptik:** Repetitive, hochenergetische Vibrations-Impulskette.
4. **Typografie:** Maximale Schriftgröße im Vollbildmodus.

---

## 2. Aufgabenpakete

- [ ] **Task 1: OS-Alarm-Audiostreaming & Hardware-Routing**
  - Nutzung von Android `AudioAttributes.USAGE_ALARM` und `STREAM_ALARM`.
  - Erzwingung der Wiedergabe über den internen Gerätelautsprecher (`AudioManager.setSpeakerphoneOn(true)`), selbst wenn Bluetooth-Geräte gekoppelt sind.
  - Generierung eines frequenzoptimierten 3-kHz-Zweiton-Sirenenklangs (durchdringt Motorengeräusche).

- [ ] **Task 2: Polyglot Voice Soundbank (20+ Sprachen)**
  - Vorab komprimierte, optimierte Audio-Assets (Opus / Ogg / MP3, <100 kB pro Sprache) für Sofort-Wiedergabe ohne Latenz:
    - Deutsch (DE), Englisch (EN), Ukrainisch (UK), Polnisch (PL), Türkisch (TR), Arabisch (AR), Rumänisch (RO), Bulgarisch (BG), Russisch (RU), Spanisch (ES).
  - Vorlese-Satz: *"STOPP! Nicht mischen! Lebensgefahr durch Chlorgas!"*

- [ ] **Task 3: Haptik-Sequenzer & LED-Strobe**
  - Android `Vibrator` / `VibratorManager` mit `VibrationEffect.createWaveform()`:
    - `pattern = [0, 300, 100, 300, 100, 500]`
    - `amplitudes = [0, 255, 0, 255, 0, 255]`
  - Kamera-LED-Flash via Android `CameraManager.setTorchMode(cameraId, true)`.

---

## 3. Akzeptanzkriterien (Definition of Done)

1. **Muted Bypass:** Auf einem hardware-seitig stummgeschalteten Testgerät ertönt der Alarmton bei `STOP` in voller Lautstärke.
2. **Polyglot Instant Playback:** Der Sprachruf startet $< 100\text{ ms}$ nach Erkennung des toxischen Paares.
3. **Gleichzeitigkeit:** Audio, Display-Flash, LED-Flash und Vibration starten synchron innerhalb eines 50-ms-Fensters.
4. **Notfall-Abbruch:** Ein 1-Touch-Button „Habe verstanden / Gase meiden" beendet den Sirenenton, behält aber den roten Warnbildschirm bei.
