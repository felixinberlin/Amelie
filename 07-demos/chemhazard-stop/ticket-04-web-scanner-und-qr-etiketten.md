# Ticket 04: Kamera-Scan im Browser & QR-Etiketten für Umfüllflaschen

**Komponente:** `src/components/simulators/ChemHazardSimulator.tsx` · `src/engine/chemhazard/` · neue Seite für Etiketten  
**Status:** BEREIT (13. Oktober 2026), nächstes Ticket. Ersetzt für den ersten Schritt Ticket 02 (Android/CameraX, Etiketten-OCR); Ticket 02 bleibt als spätere native Variante stehen.  
**Zugehörige Dose:** [`05-dosen/dose-cleaner-chemical-safety.md`](../../05-dosen/dose-cleaner-chemical-safety.md)  
**Aufwand (Schätzung):** Scan 1–2 Tage, Etiketten 1 Tag, Test an echter Flasche 1 Stunde (Félix).

---

## 1. Warum dieses Ticket

Die Mails vom 27.09.2026 versprachen einen Kamera-Scan, den es nicht gibt (Richtigstellung: `03-zuordnung/mails-q4-2026/mail-11b-korrektur.md`). Heute wählt man die Produkte aus einer Liste oder tippt GTIN/UFI ein. Dieses Ticket baut den kleinsten ehrlichen Scan: im Browser, ohne Server, mit dem schon vorhandenen Abgleich (`gtinFromScan`, `lookupProductByIdentifier` in `src/engine/chemhazard/chemHazardEngine.ts`).

Zwei Befunde bestimmen den Zuschnitt:

1. **Wenige bekannte Barcodes.** Der Bestand hat 96 GTIN-Zuordnungen (91 bestätigt). Die meisten Flaschen in einer echten Putzkammer sind nicht darin; der Scan endet dann in `UNVERIFIED`. Das ist sicher, aber wenig nützlich.
2. **Umfüllflaschen haben keinen Barcode.** Konzentrat wird in Sprühflaschen umgefüllt, und gerade dort passiert das Mischen. Umfüllbehälter müssen nach GefStoffV/TRGS 510 ohnehin gekennzeichnet werden. Ein QR-Etikett pro Produkt, vom Betrieb selbst gedruckt, identifiziert die Flasche eindeutig.

## 2. Aufgabenpakete

### Teil A: Barcode- und QR-Scan im Browser

- [ ] Kamera über `getUserMedia` (Rückkamera, `facingMode: 'environment'`); Zugriff erst nach Tippen auf „Flasche scannen“, nie automatisch.
- [ ] Erkennung über `BarcodeDetector` (Chrome Android), sonst Rückfall auf `zxing-wasm` (lokal gebündelt, kein CDN). Formate: EAN-13, EAN-8, UPC-A, QR.
- [ ] Ablauf in zwei Schritten: Flasche A scannen → Produktname groß anzeigen → Flasche B scannen → Ergebnis. Der erkannte Produktname steht immer sichtbar da, damit ein Fehlscan auffällt.
- [ ] Jeder Scan läuft durch `lookupProductByIdentifier`; kein eigener Abgleich im UI. Unbekannt, mehrdeutig oder unbestätigt ergibt `UNVERIFIED`, nie Grau.
- [ ] Ohne Kamera, ohne Erlaubnis oder bei Fehler: Hinweis und die bisherige Auswahl/Eingabe; keine Sackgasse.
- [ ] Bilder verlassen das Gerät nie; kein Speichern, keine Telemetrie.

### Teil B: QR-Etiketten für Umfüllflaschen

- [ ] Inhalt des QR-Codes: GS1 Digital Link (`https://id.gs1.org/01/<GTIN>`, schon unterstützt), wenn das Produkt eine bestätigte GTIN hat; sonst `CHEMSTOP:1:<produkt-id>`.
- [ ] Engine: `CHEMSTOP:1:<id>` in `lookupProductByIdentifier` erkennen (Präfix, Version, id genau ein Treffer). Unbekannte Version oder id → `null` → `UNVERIFIED`.
- [ ] Etikettenseite: Produkt wählen → druckbares Etikett (QR, Produktname, Hersteller, H-Sätze im Klartext, Datum des Datenstands). Das Etikett ersetzt nicht die vorgeschriebene Kennzeichnung, sondern ergänzt sie; dieser Satz steht auf dem Etikett.
- [ ] QR-Erzeugung lokal (kleine Bibliothek, gebündelt), Druck als A4-Bogen.

### Teil C: Offline

- [ ] Demo-Seite installierbar und offline nutzbar (Manifest und Service Worker nach dem Muster `site/` in https://github.com/felixinberlin/jobcenter-hilfe), inklusive Produkt- und Regeldaten.

## 3. Was nicht dazugehört

- Etiketten-OCR (GISCODE, EUH031): langsam, unzuverlässig auf gebogenen oder nassen Etiketten, ein Fehllesen kann eine Warnung verschlucken. Bleibt in Ticket 02.
- Stummschaltung umgehen: geht im Browser nicht, braucht eine App (Ticket 03).
- Kein schnelles Blinken: Warnbildschirm höchstens 3 Wechsel pro Sekunde (WCAG 2.3.1).

## 4. Fertig, wenn

1. Vitest: `CHEMSTOP:1:<id>` findet genau das Produkt; falsche Version, unbekannte id, Leerzeichen und Groß/Klein-Varianten ergeben `null`; die bestehenden GTIN-Tests bleiben grün.
2. Vitest: Für jede Säure × jeden Chlorreiniger im Bestand ergibt der Weg „Scan-Text → Lookup → Auswertung“ `STOP`, sowohl über GTIN als auch über `CHEMSTOP`.
3. Playwright mit simulierter Kamera (`--use-fake-device-for-media-stream`, `--use-file-for-fake-video-capture` mit einem Video aus `data/barcodes/*.svg`): Säure scannen, Dan Klorix scannen → `STOP`; unbekannter Barcode → `UNVERIFIED`; Kamera verweigert → Auswahlliste erscheint.
4. `npm run check:mobile` grün für die Etikettenseite und die Demo.
5. Offline: Seite bei abgeschaltetem Netz geladen, Scan und Auswertung funktionieren (Playwright, Netz aus).
6. **Test an einer echten Flasche** (Félix): ein Produkt mit bekannter EAN und ein selbst gedrucktes QR-Etikett, Android und wenn möglich iPhone. Ergebnis mit Datum im README notiert. Erst danach darf eine Mail „scannt Barcode oder QR-Etikett“ sagen.
7. `npm run lint` und `npm test` grün; Dossier, `dosen.ts` und Simulatortext beschreiben den Scan so, wie er gebaut ist.
