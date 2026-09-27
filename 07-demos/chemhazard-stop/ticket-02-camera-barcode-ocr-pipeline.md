# Ticket 02: On-Device Barcode- & GISCODE-Erkennungspipeline

**Komponente:** `07-demos/chemhazard-stop` / `app/scanner`  
**Status:** BEREIT FÜR IMPLEMENTIERUNG (27. September 2026)  
**Zuständigkeit:** Edge Computer Vision / Barcode Parsing / Android CameraX  
**Zugehörige Dose:** [`05-dosen/dose-cleaner-chemical-safety.md`](../../05-dosen/dose-cleaner-chemical-safety.md)  

---

## 1. Problemstellung

Reinigungskräfte dürfen nicht gezwungen sein, chemische Namen manuell auf einer Bildschirmtastatur einzutippen. Der Zwei-Flaschen-Scan muss über die Smartphone-Kamera in unter 1 Sekunde erfolgen. Erschwerend kommen hinzu:
* Gekrümmte, glänzende Zylinderflächen von 1-Liter-Flaschen.
* Teilweise abgewaschene oder zerkratzte Barcodes.
* Fehlen von Barcodes auf älteren Gebinden (nur GISCODE-Aufdruck vorhanden).

Ziel dieses Tickets ist die Bereitstellung einer hochperformanten, 100% offline laufenden Dual-Scan-Pipeline für GTIN/EAN-13, GS1 Digital Link QR-Codes und OCR-gestütztes Auslesen von GISCODEs (`GD10`, `GS50` etc.).

---

## 2. Aufgabenpakete

- [ ] **Task 1: CameraX / Barcode-Scanning Pipeline**
  - Einbindung von Google ML Kit Barcode Scanning (vollständig offline gebündelt) oder ZXing-C++ WASM.
  - Sequentieller 2-Flaschen-Modus: Flasche A anvisieren $\to$ haptischer Klick $\to$ Flasche B anvisieren.
  - Bildraten-Drosselung auf 15 FPS zur Akkusparung.

- [ ] **Task 2: GISCODE- & Gefahrenpiktogramm-OCR**
  - Lokales Text-Matching auf vordefinierte reguläre Ausdrücke (`/G[DSGU][0-9]{2}/`).
  - Erkennung des CLP-Gefahrensatzes `EUH031` auf dem Etikett als Sicherheitsnetz, falls Barcode unleserlich ist.

- [ ] **Task 3: Fehlerbehandlung & UNVERIFIED-Trigger**
  - Kann der Code nach 3 Sekunden kontinuierlicher Ausrichtung nicht dekodiert werden, schaltet die UI automatisch auf eine visuelle 1-Klick-Auswahlliste der gängigsten Markenprodukte um.
  - Unbekannte EANs lösen deterministisch den Zustand `UNVERIFIED` aus.

---

## 3. Akzeptanzkriterien (Definition of Done)

1. **Erkennungsrate:** Scannt EAN-13 Barcodes auf gekrümmten Plastikflaschen bei schlechter Ausleuchtung (50 Lux) in unter 800 ms mit $> 95\,\%$ Zuverlässigkeit.
2. **GISCODE-OCR:** Erkennt GISCODE-Muster (`GD10`, `GS50`, `GU40`) auf dem Rückenetikett in unter 1,2 Sekunden.
3. **Zero Network:** Funktioniert bei aktiviertem Flugmodus ohne jeden Netzwerkausfall.
4. **Handoff an Regel-Kernel:** Übergibt gefundene IDs/Codes direkt an `evaluatePairByIdentifiers()` in `chemHazardEngine.ts`.
