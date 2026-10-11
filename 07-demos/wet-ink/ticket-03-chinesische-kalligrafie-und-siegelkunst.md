# Ticket #3: Chinesische Kalligrafie, Mao-Bi-Haardynamik, Xuan-Papiere & Zhuanke-Siegelkunst (书法与篆刻)

**Status:** ABGESCHLOSSEN & VERIFIZIERT  
**Dose:** Wet Ink (`05-dosen/wet-ink.md`)  
**Pakete & Pfade:** `src/engine/wet-ink/`, `packages/wet-ink-core/`, `packages/wet-ink-react/`, `src/components/simulators/WetInkSimulator.tsx`  

---

## Zielsetzung

Ausbau der physikalischen 7-Pass-Simulation von Wet Ink zu einem vollwertigen, historisch akkuraten und didaktischen Atelier für traditionelle ostasiatische Kalligrafie (Shūfǎ / 书法) und Siegelschneidekunst (Zhuànkè / 篆刻):

1. **Substrate (宣纸三品):** Modellierung dreier Reifegrade traditionellen Xuan-Papiers (`sheng-xuan`, `ban-shu-xuan`, `shu-xuan`) mit physikalischer Kapillarschwelle, Faseranisotropie und kontrollierter Standfestigkeit.
2. **Haardynamik (毛笔特性):** Pinselmechanik für Wieselhaar (`langhao` / 狼毫 - elastisch, formstabil für feine Haken und Punkte), Ziegenhaar (`yanghao` / 羊毫 - saugfähig, tief biegsam für fleischige Züge) und Mischhaar (`jianhao` / 兼毫 - stabiler Kern mit weichem Mantel als Allrounder) sowie physikalisches Fliegendes Weiß (*Fēi Bái* / 飞白).
3. **Didaktische Übungsgitter:** Zuschaltbare Vektor-Raster im Simulator für das 8-Stern-Gitter *Mi Zi Ge* (米字格), das Tang-zeitliche 9-Felder-Gitter *Jiu Gong Ge* (九宫格) sowie das Wasserzeichen-Template der 8 Ur-Striche *Yongzi Bafa* (永字八法) nach Wang Xizhi.
4. **Zinnober-Siegel (朱砂印章):** Prozeduraler Stempelgenerator für Rotschrift (*Zhuwen* / 朱文) und Weißschrift (*Baiwen* / 白文), quadratische und runde Siegelsteine, 6 Siegelschrift-Glyphen (`阿梅莉`, `墨`, `和`, `吉`, `永`, `经典`), antike Bruchkanten (*Canbian* / 残边) und Web-Audio-Stempel-Resonanz (`playStampThud()`).
5. **Headless & SDK Integration:** Vollständige Unterstützung in `@wet-ink/core` (`WetInkController.stampSeal()`, `<wet-ink-signature>` Web Component, React Hook `useWetInk`).

---

## Definition of Done (DoD)

1. [x] **Xuan-Substrate (`presets.ts`):**
   - `sheng-xuan` (生宣): Rohes Xuan, extreme Kapillarexpansion (`roughness: 0.40`, `fiberStrength: 0.95`, `capacity: 0.98`, `evaporationMult: 0.85`).
   - `ban-shu-xuan` (半熟宣): Halbgares Xuan, ideale Balance für Regelschrift (*Kaishu*) und Laufschrift (*Xingshu*) (`capacity: 0.75`, `evaporationMult: 1.05`).
   - `shu-xuan` (熟宣): Alaungeleimtes Xuan, gestochen scharfe Ränder für *Gongbi* und feine Linienführung (`roughness: 0.20`, `capacity: 0.35`, `evaporationMult: 1.30`).
2. [x] **Mao-Bi Pinselmechanik (`brush.ts`):**
   - `langhao`: Höhere Rückfederung (`springK = 0.82`), feinerer Spitzenradius (`radiusMult = 0.72`), schärfere Druckmodulation.
   - `yanghao`: Weiche Biegung (`springK = 0.42`), erhöhtes Tintenreservoir (`fluidMult = 1.65`, `radiusMult = 1.35`).
   - `jianhao`: Hybrider Mittelwert (`springK = 0.65`, `fluidMult = 1.15`, `radiusMult = 1.05`).
   - *Fei Bai (飞白):* Geschwindigkeits- und andruckabhängige Trockenstrich-Ausfransung entlang der Papierfasern.
3. [x] **Kalligrafie-Didaktik (`WetInkSimulator.tsx`):**
   - SVG-Overlay für *Mi Zi Ge* (米字格) und *Jiu Gong Ge* (九宫格).
   - Interaktive Referenztafel und Wasserzeichen für *Yongzi Bafa* (永字八法): 侧 (Punkt), 勒 (Querstrich), 努 (Längsstrich), 趯 (Haken), 策 (Anstrich), 掠 (Langer Abstrich), 啄 (Kurzer Abstrich), 磔 (Rechtsabstrich).
4. [x] **Zhuanke-Siegelgenerator (`simulation.ts` & `audio.ts`):**
   - Quadratische und runde Siegelgeometrie.
   - Stile: Zhuwen (朱文 - Relief / rote Linien) vs. Baiwen (白文 - Intaglio / roter Grund mit weißen Zeichen).
   - Pseudo-Zufällige antike Bruchkanten (*Canbian* / 残边) für lebendige Stein-Haptik.
   - 6 Vektor-Glyphen: `amelie` (阿梅莉印), `mo` (墨), `ji` (吉), `he` (和), `yong` (永), `classic` (traditionelles Hanko-Kreuz).
   - Niederfrequenter akustischer Thud-Impuls (`playStampThud()`) via Web Audio API.
5. [x] **SDK & Headless Controller (`packages/wet-ink-core/`):**
   - `WetInkController.stampSeal(x, y, options)` und `setSealOptions()` implementiert.
   - `seal-stamp`-Klick/PointerDown als Einzelschlag ohne Strich-Verschmieren.
   - Forwarding im `<wet-ink-signature>` Web Component und im React-Hook `useWetInk()`.
6. [x] **Verifikation & Testabdeckung:**
   - 12 spezialisierte Tests in `src/engine/wet-ink/calligraphy.test.ts` (100 % grün).
   - 4 Tests in `packages/wet-ink-core/src/WetInkController.test.ts` (100 % grün).
   - Invarianten- und Determinismus-Garantien in `simulation.test.ts` verifiziert.
