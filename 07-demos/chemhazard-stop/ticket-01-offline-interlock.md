# Ticket 01: Standalone Offline-Regel-Kernel & 4-Kanal-Mischinterlock

**Komponente:** `07-demos/chemhazard-stop` / `src/engine/chemhazard`  
**Status:** ABGESCHLOSSEN / VERIFIZIERT (27. September 2026)  
**Zuständigkeit:** Civic Tech / Chemical Safety / Offline Edge Architecture  
**Zugehörige Dose:** [`05-dosen/dose-cleaner-chemical-safety.md`](../../05-dosen/dose-cleaner-chemical-safety.md)  

---

## 1. Problemstellung & Ziel

Bestehende Gefahrstoffsysteme (WINGIS, GESTIS) erfordern manuelle Textsuche am PC. Bei der nächtlichen Reinigung muss die Gefahrenerkennung in unter 1 Sekunde direkt vor den beiden Behältern ohne Internetverbindung erfolgen.

Ziel dieses Tickets ist die Implementierung des vollständigen deterministischen Regel-Kerns mit Drei-Zustands-Logik (🔴 STOP, 🟠 UNVERIFIED, ⚪ NO_KNOWN_INCOMPATIBILITY), 4-Kanal-Alarm-Triggering und strikter Verifikation der Sicherheits-Invarianten (kein Grün, niemals Freigabe).

---

## 2. Aufgabenpakete

- [x] **Task 1: Typisierte Daten-Schemas (`schemas/`)**
  - `product.schema.json`: Modellierung von GTIN, GISCODE, Gefahrengruppen (Säure, Hypochlorit, Ammoniak, etc.), CLP-Sätzen (EUH031, H314), Provenienz und rechtlicher Spur.
  - `rule.schema.json`: Modellierung von erforderlichen Gefahrenmerkmalen, Reaktionsmechanismus, Schweregrad und mehrsprachigen Warntexten (DE, EN, UK, PL, TR, AR, RO).

- [x] **Task 2: Referenz-Datensätze (`data/`)**
  - `products.json`: 20 reale Industrie- und Gewerbereiniger (Kiehl Sanikal, Buzil Bucasan, DanKlorix, Ecolab Taxat, Dr. Schnell Milizid, Neutralreiniger, etc.).
  - `rules.json`: Inkompatibilitäts-Regeln für Säure + Hypochlorit (Chlorgas), Säure + Ammoniak (Ammoniumchlorid / Hitze), Hypochlorit + Ammoniak (Chloramine).

- [x] **Task 3: Deterministische Engine (`src/engine/chemhazard/chemHazardEngine.ts`)**
  - Mengenlogische Auswertung: $\text{hazards}(A) \cup \text{hazards}(B) \supseteq \text{rule.required}$.
  - Strikte 3-Zustands-Entscheidung:
    - 🔴 `STOP` bei Regel-Treffer.
    - 🟠 `UNVERIFIED` bei unbekanntem Produkt, unvollständigen Daten oder fehlendem Nachweis.
    - ⚪ `NO_KNOWN_INCOMPATIBILITY` bei bekannten, kompatiblen Produkten — mit unübersehbarem Disclaimer, **niemals grün**.
  - 4-Kanal-Alarm: Erzwingung des Alarm-Audiostreams, Stroboskop-Rotlicht, hochfrequente Haptikpulse `[300, 100, 300, 100, 500]` und Muttersprachen-Audio.
  - Hard Invariant Check: wirft eine Exception, falls jemals ein Zustand "SAFE" oder die Farbe "green" emittiert wird.

- [x] **Task 4: Vitest-Testsuite (`src/engine/chemhazard/chemHazardEngine.test.ts`)**
  - 100% Testabdeckung über alle Realszenarien, Grenzgänge und Sicherheits-Invarianten.

---

## 3. Akzeptanzkriterien (Definition of Done)

1. **Reaktionszeit:** Die Auswertung zweier Produkte erfolgt in unter 1 ms (Anforderung < 50 ms).
2. **Sicherheits-Invariante:** Kein Testfall erzeugt jemals ein grünes UI-Signal oder deklariert eine Mischung als „sicher".
3. **Uncertainty Fallback:** Jedes unvollständige oder unbekannte Produkt fällt ausnahmslos auf `UNVERIFIED` zurück.
4. **False-Negative Regression:** 100% Erkennungsrate aller lebensgefährlichen Paarungen (Säure + Hypochlorit $\to$ Chlorgas).
5. **Mehrsprachigkeit:** Audio-Shouts stehen für DE, EN, UK, PL, TR zur Verfügung.
