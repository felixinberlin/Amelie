# Der Sicherheitsnachweis: Formale Spezifikation des Dreizustands-Modells & Ausfallmodi

> **Architektur-Spezifikation und Formale Verifikation für ChemHazard Stop / MischStop**  
> *Stand: 27. September 2026 · Autor: Amélie Initiative (CC0)*

---

## 1. Das Kernaxiom: Das Verbot des grünen Zustands („Never says safe")

In der Softwaretechnik für Consumer-Apps herrscht das Paradigma der positiven Bestätigung: Eine erfolgreiche Prüfung erzeugt einen grünen Haken mit dem Prädikat „Sicher".

**In der chemischen Misch-Sicherheit ist dieses Paradigma fatal.**

### 1.1 Der mathematische Beweis für das Grün-Verbot

Sei $\mathcal{C}$ die Gesamtheit aller chemischen Reinigungsmittel auf dem europäischen Markt ($|\mathcal{C}| \approx 10^4\text{ bis }10^5$).  
Die Menge aller möglichen Zweier-Mischungen ist:
$$|\mathcal{C} \times \mathcal{C}| \approx \frac{|\mathcal{C}|^2}{2} \approx 10^8\text{ bis }10^{10} \text{ Kombinationen}$$

Die lokale Datenbank $\mathcal{D} \subset \mathcal{C}$ erfasst in einem realistischen Pilot-Szenario $|\mathcal{D}| = 100\text{ bis }2.000$ Produkte.  
Selbst wenn die Inkompatibilitäts-Matrix $\mathcal{R}$ alle bekannten toxischen Mechanismen (Chlorgas, Chloramine, Peroxid-Zersetzung) vollständig abbildet, gilt für ein Paar $(A, B) \in \mathcal{D} \times \mathcal{D}$, das keine bekannte Regel auslöst:

$$\neg \exists r \in \mathcal{R}: r \text{ ausgelöst} \centernot\implies (A \text{ gemischt mit } B) \text{ ist unbedenklich}$$

Denn:
1. Nicht deklarierte Additive, Duftstoffe, Konservierungsmittel oder Reduktionsmittel können unerwartete Sekundärreaktionen auslösen.
2. Schmutzfrachten im Putzeimer (z. B. organischer Urin, Reste von Metalloxiden, Fette) können als Katalysatoren wirken.
3. Die Konzentrationen und Temperaturen im realen Eimer weichen von Standardprüfungen ab.

> **Satz 1 (Toxikologische Asymmetrie):**  
> Eine Software kann die Existenz einer tödlichen Reaktion deterministisch beweisen ($\exists r \implies \text{STOP}$).  
> Eine Software kann jedoch die Abwesenheit jeglicher Gefahr niemals beweisen ($\forall r: \neg r \centernot\implies \text{SAFE}$).

Ein grünes Signal würde eine behördliche oder laborexakte Unbedenklichkeitserklärung vorspiegeln. Die Reinigungskraft würde sich berechtigt fühlen, die beiden Flaschen zusammenzukippen. **Deshalb ist die Farbe Grün im gesamten System hardcodiert verboten.**

---

## 2. Die drei Systemzustände

```
                           [ Eingabe: Flasche A, Flasche B ]
                                          │
                                          ▼
                      [ Beide Datensätze verifiziert in DB? ]
                                    /           \
                                 NEIN           JA
                                  │              │
                                  ▼              ▼
                          🟠 UNVERIFIED   [ Regel-Auswertung ]
                          (Bernstein)            /        \
                                        Regel trifft?    Kein Treffer
                                            /                  \
                                           JA                  NEIN
                                           │                    │
                                           ▼                    ▼
                                        🔴 STOP        ⚪ NO_KNOWN_INCOMPATIBILITY
                                        (Rot)          (Grau — Pflicht-Disclaimer)
```

### 2.1 Zustand 1: 🔴 STOP
* **Bedingung:** $(A \text{ und } B \text{ verifiziert}) \land \exists r \in \mathcal{R}: (r.\text{required} \subseteq \text{hazards}(A) \cup \text{hazards}(B))$.
* **UI-Darstellung:** Grelle Vollbild-Farbe Rot (`#DC2626`), kontrastreiches Stroboskop-Blinken.
* **Akustik:** OS-Alarm-Audiostream mit maximaler Lautstärke (bypasst Stummschaltung). Lautes Sprachaudio in der gewählten Muttersprache.
* **Haptik:** Repetitive hochfrequente Impulskette `[300ms an, 100ms aus, 300ms an, 100ms aus, 500ms an]`.
* **Typografie:** Extragroße STOPP-Schrift („STOPP! NICHT MISCHEN! LEBENSGEFAHR").

### 2.2 Zustand 2: 🟠 UNVERIFIED
* **Bedingung:** Mindestens ein Produkt unbekannt, Barcode unlesbar, Produkt in Datenbank als unbestätigt markiert oder Datenstand veraltet (>12 Monate).
* **UI-Darstellung:** Bernsteinfarben (`#D97706`).
* **Signal:** Dreifacher kurzer Vibrationsimpuls `[150ms, 150ms, 150ms]`.
* **Hinweis:** *„Prüfung unvollständig. Produkt nicht in der Sicherheitsdatenbank. Keine Prüfung möglich. Niemals auf Verdacht mischen!“*

### 2.3 Zustand 3: ⚪ NO_KNOWN_INCOMPATIBILITY
* **Bedingung:** Beide Produkte vollständig verifiziert und keine bekannte Regel aus $\mathcal{R}$ ausgelöst.
* **UI-Darstellung:** Neutrales Steingrau (`#4B5563` / `#E5E7EB`), **strikt kein Grün**.
* **Haptik:** Ein einzelner dezenter Bestätigungsklick `[50ms]`.
* **Unübersehbarer Pflicht-Disclaimer:**
  > *„Keine bekannte gefährliche Kombination in unserer Datenbank. Dies ist keine Sicherheitsfreigabe. Nicht mischen, außer ausdrücklich vom Arbeitgeber angewiesen.“*

---

## 3. Die 11 realen Ausfallmodi & Gegenmaßnahmen

Im Feldtest scheitern Labor-Apps an den rauen Umgebungsbedingungen. ChemHazard Stop begegnet allen 11 bekannten Fehlermodi mit dedizierten Schutzmechanismen:

| # | Ausfallmodus im Feld | Ursache | Systemische Gegenmaßnahme in ChemHazard Stop |
|---|---|---|---|
| **1** | Muted Audio | Smartphone ist stummgeschaltet | Erzwingung des Alarm-Audiostreams (`STREAM_ALARM`), der Stummschaltung auf OS-Ebene übersteuert. |
| **2** | Handy in Hosentasche | Arbeiter steckt Telefon nach Scan weg | Repetitives Vibrationsmuster mit maximaler Haptik-Amplitude; lauter Alarm ertönt mit 1 Sekunde Verzögerung erneut. |
| **3** | Bluetooth verbunden | Kopfhörer im Spind empfängt Ton | App route Audio zwingend auf den internen Gerätelautsprecher (`setSpeakerphoneOn(true)`). |
| **4** | Verdeckter Lautsprecher | Nitril-/Gummihandschuh dämpft Lautsprecher | Visueller Stroboskop-Blitz des Bildschirms und Nutzung der Kamera-LED als optisches Warnsignal. |
| **5** | Laute Umgebung | Staubsauger / Einscheibenmaschine läuft | Frequenzoptimierter Alarmton (2,5 bis 3,5 kHz), der das typische Maschinengeräusch akustisch durchdringt. |
| **6** | Schwacher Akku | Energiesparmodus drosselt Inferenz | 100% Offline-Regel-Kernel ohne schwere ML-Modelle; Rechenzeit <1 ms; funktioniert bei 5 % Akku. |
| **7** | Zerkratzte / nasse Linse | Putzwasser / Fett auf der Handylinse | Fallback von Kamera-OCR auf schnelle Barcode-/GTIN-Erkennung oder manuelle Schnellauswahl. |
| **8** | Barcode auf Flaschenrückseite | Reinigungskraft scannt Vorderseite | Geführter 2-Schritt-Assistent („Flasche 1 Rückseite scannen, dann Flasche 2"). |
| **9** | Schwache Vibrationsmotoren | Ältere Billiggeräte | Gleichzeitige Aktivierung aller vier Kanäle (Audio, LED, Display, Haptik). |
| **10** | Gehörlose / hörgeschädigte Arbeitskraft | Akustischer Alarm wirkungslos | Maximal-kontrastreiches Flackern und extragroße Typografie im Sichtfeld. |
| **11** | Flasche bereits gekippt | Scan erfolgt zu spät | Unverzüglicher Notfall-Evakuierungs-Button: *„Fenster auf, Raum sofort verlassen, Vorarbeiter informieren!"* |
