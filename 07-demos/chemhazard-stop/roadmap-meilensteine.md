# Roadmap, Meilensteine & Ausbildungsplan

> **Entwicklungs-, Validierungs- und Bereitstellungsplan für ChemHazard Stop / MischStop**  
> *Stand: 27. September 2026 · Autor: Amélie Initiative (CC0)*

---

## 1. Meilensteinplan (Roadmap)

Das Projekt ist in drei strikte, deterministisch prüfbare Meilensteine unterteilt:

```
[ M0: Standalone Kernel & Interlock-Prototyp ]
  ├── 100% Offline Regel-Kernel (sub-1ms)
  ├── 20 kuratierte Referenzprodukte (Seed DB)
  ├── 4-Kanal-Alarmsystem (Audio, Blitz, Haptik, Text)
  └── 100% False-Negative-Regressionstest
                     │
                     ▼
[ M1: Betreuter Feldpilot (3–6 Monate) ]
  ├── 100–200 gewerbliche Reinigungsmittel (Kiehl, Buzil, Ecolab, Dr. Schnell)
  ├── Erprobung mit 30 Reinigungskräften in realen Sanitärräumen
  ├── Messung der Scan-Geschwindigkeit & Fehlalarm-Quote
  └── Feedback-Schleife mit Betriebsräten und Sicherheitsbeauftragten
                     │
                     ▼
[ M2: Produktionsreife & Gewerkschaftsauslieferung ]
  ├── 1.000–2.000 erfasste Produkte
  ├── Signierte, kryptografisch verifizierte Offline-Datenpakete
  ├── Partnerschafts-Zustellung an BG BAU, DGUV, IG BAU, SEIU, EFCI
  └── Veröffentlichung des formalen Sicherheitsnachweises (Safety Case)
```

### Meilenstein M0 · Demonstrator & Kern-Skelett (Abgeschlossen)
* **Ziel:** Lauffähiger, unbestechlicher Regel-Kernel im Amélie-Repository mit Vitest-Tests.
* **Ergebnis:**
  * Regel-Kernel in `src/engine/chemhazard/chemHazardEngine.ts`.
  * Schemas für Produkte und Regeln (`schemas/`).
  * 20 Referenzprodukte mit CLP- und GISCODE-Merkmalen.
  * Vitest-Suite mit 100 % Erfolgsquote über alle Invarianten.

### Meilenstein M1 · Betreuter Feldpilot (3 bis 6 Monate)
* **Ziel:** Praxis-Validierung mit echten Reinigungskräften in gewerblichen Objekten.
* **Umfang:** 100 bis 200 professionelle Reinigungsprodukte der Marktführer (Kiehl, Buzil, Ecolab, Dr. Schnell, Tana Chemie).
* **Bedingung:** Begleitung durch einen Sicherheitsbeauftragten; keine Freigabe als Alleinarbeits-Tool.
* **Erfolgsmetriken:**
  * Zeit vom Kamerastart bis zum Warnsignal: $< 1{,}5\text{ Sekunden}$.
  * Verständlichkeit der Warnrufe bei Arbeitskräften ohne Deutschkenntnisse: $> 95\,\%$.
  * False-Negative-Rate: **exakt $0\,\%$** (kein gefährliches Paar darf jemals durchrutschen).

### Meilenstein M2 · Produktionsreife & Freigabe
* **Ziel:** Bereitstellung über F-Droid, Google Play und als PWA für Gewerkschaften und Berufsgenossenschaften.
* **Infrastruktur:** Kryptografisch signierte JSON-Releases über GitHub Releases; kein automatisches Background-Sync während des Dienstes.

---

## 2. Der 4-Wochen-Trainings- & Schulungsplan

Für Sicherheitsfachkräfte (*SiFa*), Betriebsräte und Reinigungsteams:

### Woche 1: Das Mischen verstehen & Warum SDBs versagen
* **Schwerpunkt:** Die Chemie des Chlorgases ($2\text{H}^+ + \text{OCl}^- + \text{Cl}^- \to \text{Cl}_2$) und von Chloraminen.
* **Praxis:** Anschauliche Demonstration von pH-Werten (saure Entkalker $\text{pH } 0\text{–}1$ vs. Bleiche $\text{pH } 12\text{–}13$).
* **Erkenntnis:** Warum das Verbot absolut ist und warum man sich nicht auf den Geruchssinn verlassen kann.

### Woche 2: Die Bedienung der ChemHazard-Stop-App
* **Schwerpunkt:** 2-Flaschen-Scan-Ablauf vor dem Putzwagen.
* **Praxis:** Scannen von Barcodes, GISCODEs und Erkennung von unvollständigen Etiketten.
* **Übung:** Was bedeutet der bernsteinfarbene Zustand `UNVERIFIED`? (Niemals auf Verdacht mischen!).

### Woche 3: Die 4 Alarmkanäle & Notfallverhalten
* **Schwerpunkt:** Was tun bei rotem `STOPP`?
* **Simulation:** Raumakustik mit lauten Staubsaugern; Wahrnehmung von Haptik und Bildschirm-Blitz trotz Kopfhörern oder Handschuhen.
* **Notfallprotokoll:** Sofortige Evakuierung, Lüftung, Meldung an Vorarbeiter.

### Woche 4: Rechte der Beschäftigten & GefStoffV
* **Schwerpunkt:** § 14 GefStoffV, DGUV Regel 101-019 und das Recht auf sichere Arbeitsmittel.
* **Rolle der Gewerkschaft:** Wie Betriebsräte die App in Betriebsvereinbarungen und Unterweisungen verankern können.
