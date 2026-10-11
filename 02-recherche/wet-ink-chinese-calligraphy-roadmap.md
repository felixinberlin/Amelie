# Wet Ink — Roadmap: Chinesische Kalligrafie & Siegelkunst (书法与篆刻)

**Dokument-Typ:** Entwicklungsplan & physikalische Spezifikation für die Folgesitzung  
**Datum:** 11. Oktober 2026  
**Projekt:** Amélie · Dose `wet-ink` (`src/engine/wet-ink/`, `packages/wet-ink-core/`)  
**Status:** Basiert auf dem produktionsreifen 7-Pass-WebGL2-Kernel (315 Tests grün, Tier 1, CC0)

---

## 1. Ausgangslage: Warum Wet Ink die ideale Basis ist

Die meisten digitalen Kalligrafie-Apps (auch in Asien) scheitern an der Authentizität, weil sie **Bézier-Stempel mit Transparenzen** nutzen. Echte ostasiatische Tusche (Shuǐmò / 水墨) basiert jedoch auf drei unverzichtbaren physikalischen Naturgesetzen, die Wet Ink bereits im Kern besitzt:

1. **Kapillarschwelle ($\varepsilon_{\min}$):** Tinte wandert entlang mikroskopischer Fasern, stoppt aber an Porenenden. Ohne Schwellenwert wirkt Tinte wie diffuser Qualm/Rauch; mit Schwellenwert entstehen die typischen, feinsten Ausfransungen (*Yùnrǎn* / 晕染).
2. **Kubelka-Munk-Lasuroptik:** Keine simple Alpha-Transparenz, sondern physikalische Lichtabsorption ($K$) und Streuung ($S$). Zweimal über dieselbe Stelle streichen erzeugt echte Tiefe (Schwärzung von Kiefernruß *Sōngyānmò* / 松烟墨), kein verwaschenes Digital-Matschgrau.
3. **Fliegendes Weiß (Dry Brush / 飞白 - Fēi Bái):** Bei schnellen Pinselzügen (*Cǎo-Shū* / 草书) oder geringem Auflagedruck überspringen die Pinselhaare mikroskopische Vertiefungen des Papiers und hinterlassen weiße Faserstreifen im Strichinneren.

---

## 2. Die 4 Ausbau-Module für die nächste Sitzung

In der kommenden Sitzung bauen wir Wet Ink gezielt zu einem spezialisierten **Kalligrafie- & Siegel-Atelier** aus:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   WET INK CALLIGRAPHY ARCHITECTURE                     │
├────────────────────────────────┬───────────────────────────────────────┤
│ 1. Substrate (Xuan-Papiere)    │ 2. Pinsel-Dynamik (Mao-Bi)            │
│   • Sheng Xuan (生宣 - Roh)    │   • Langhao (狼毫 - Wiesel/Straff)    │
│   • Ban Shu Xuan (半熟宣 - Mix)│   • Yanghao (羊毫 - Ziege/Weich)      │
│   • Shu Xuan (熟宣 - Reif)     │   • Jianhao (兼毫 - Hybrid-Kern)      │
├────────────────────────────────┼───────────────────────────────────────┤
│ 3. Didaktik & Gitter           │ 4. Siegelkunst (Zhuanke / 篆刻)       │
│   • Mi Zi Ge (米字格 - 8-Stern)│   • Roter Zinnober (朱砂印泥)         │
│   • Jiu Gong Ge (九宫格 - 3×3) │   • Baiwen vs. Zhuwen (Positiv/Neg.)  │
│   • Yongzi Bafa (永字八法)     │   • Taktiler Stempel-Abdruck          │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

### Modul A: Die 3 Reifegrade des Xuan-Papiers (宣纸三品)

In `src/engine/wet-ink/presets.ts` und `paper.ts` implementieren wir drei physikalische Profile traditionellen Reispapiers:

| Substrat-Preset | Chinesischer Name | Physikalische Parameter | Typische Eignung |
|---|---|---|---|
| **Sheng Xuan (生宣)** | Rohes, ungeleimtes Xuan | `roughness: 0.40`<br>`fiberStrength: 0.95`<br>`capacity: 0.98`<br>`evaporationMult: 0.85` | Extrem saugfähig, explosive Tintenausbreitung, sanfte Farbverläufe (*Xieyi* / 写意). |
| **Ban Shu Xuan (半熟宣)** | Halbgares Xuan | `roughness: 0.32`<br>`fiberStrength: 0.80`<br>`capacity: 0.75`<br>`evaporationMult: 1.05` | Kontrolliertes Bluten, ideale Standfestigkeit für Regelschrift (*Kaishu*) & Laufschrift (*Xingshu*). |
| **Shu Xuan (熟宣)** | Reifes (alaungeleimtes) Xuan | `roughness: 0.20`<br>`fiberStrength: 0.25`<br>`capacity: 0.35`<br>`evaporationMult: 1.30` | Kaum Kapillarblutung, gestochen scharfe Umrisse (*Gongbi* / 工笔, feine Siegelschrift). |

---

### Modul B: Pinselmodelle nach Haartyp (毛笔特性)

In `src/engine/wet-ink/brush.ts` erweitern wir `BrushToolType` um traditionelle Haartypen mit eigenem Druck- und Nachführungs-Verhalten:

1. **`langhao` (狼毫 - Wiesel-/Marderhaar):**
   * Hohe Elastizität und Rückfederung (*Tanxing* / 弹性).
   * Scharfe Spitze, reagiert sensibel auf Andruckwechsel (ideal für Haken *Gōu* und Punkte *Diǎn*).
2. **`yanghao` (羊毫 - Ziegenhaar):**
   * Sehr weich, biegt sich tief durch, speichert enorm viel Tinte.
   * Erzeugt satte, fleischige Striche mit reichhaltigem Tintenreservoir.
3. **`jianhao` (兼毫 - Mischhaar):**
   * Straffer Kern aus Wieselhaar, umhüllt von weichem Ziegenhaar.
   * Der Allrounder für Anfänger und Standard-Kalligrafie.

---

### Modul C: Übungsgitter (米字格 & 九宫格)

Kalligrafie erfordert präzise Raumaufteilung. Ein zuschaltbares Vektor-Overlay auf dem Canvas bietet:
* **Mi Zi Ge (米字格):** Traditionelles quadratisches Raster mit horizontaler, vertikaler und zwei diagonalen Achsen (wie das Schriftzeichen 米).
* **Jiu Gong Ge (九宫格):** Klassische 9-Felder-Einteilung nach Tang-zeitlichen Vorbildern (Ouyang Xun).
* **永字八法 (Yongzi Bafa):** Die 8 Ur-Striche der Kalligrafie am Beispiel des Zeichens 永 (*Yǒng* = Ewigkeit):
  1. 侧 (Cè) – Punkt
  2. 勒 (Lè) – Querstrich
  3. 努 (Nǔ) – Längsstrich
  4. 趯 (Tī) – Haken
  5. 策 (Cè) – Anstrich nach rechts oben
  6. 掠 (Lüè) – Langer Abstrich nach links
  7. 啄 (Zhuó) – Kurzer Abstrich nach links
  8. 磔 (Zhé) – Abstrich nach rechts mit Fuß

---

### Modul D: Das Zinnober-Siegel (朱砂篆刻印章)

Kein chinesisches Schriftwerk ist ohne das rote Namens- oder Stimmungssiegel (*Yìnzhāng* / 印章) vollendet:
* **Pigment:** Reines *Zinnoberrot* (`zinnober`, bereits in `PIGMENT_PRESETS` vorhanden).
* **Funktion:** Werkzeug im Simulator, mit dem man per Mausklick / Fingertipp ein quadratisches oder ovales Siegel auf das Blatt setzt.
* **Haptik:** Ein dezenter physikalischer „Stempel-Eindruck“ auf den Papierfasern mit leicht brüchigen Kanten und Web-Audio-Stempel-Resonanz.

---

## 3. Umgesetzte Tickets & Verifikation

- [x] **Ticket C1 (Substrate):** Hinzufügen der Presets `sheng-xuan`, `ban-shu-xuan` und `shu-xuan` in `src/engine/wet-ink/presets.ts`. Alle drei Reifegrade mit physikalischer Faseranisotropie, Kapazitäts- und Verdunstungsparametern implementiert.
- [x] **Ticket C2 (Pinsel):** Spezifische Pinsel-Parameter für `langhao` (狼毫 - Wieselhaar, elastisch mit spitzer Führung), `yanghao` (羊毫 - Ziegenhaar, weich mit hohem Tintenreservoir) und `jianhao` (兼毫 - Mischhaar, ausgewogener Allrounder) in `src/engine/wet-ink/brush.ts` implementiert.
- [x] **Ticket C3 (Gitter-Overlay):** Zuschaltbare interaktive Vektor-Overlays für `Mi Zi Ge` (米字格 - 8-Stern-Gitter), `Jiu Gong Ge` (九宫格 - Tang-zeitliches 3×3-Gitter) und `Yongzi Bafa` (永字八法 mit klassischem Wasserzeichen und 8 markierten Ur-Strichen) im `WetInkSimulator.tsx`.
- [x] **Ticket C4 (Siegel-Stempel):** Vollwertiger Zhuanke-Stempelmodus (篆刻印章) im Simulator mit Baiwen- (白文 - Weißschrift) und Zhuwen-Stil (朱文 - Rotschrift), quadratischen und runden Siegeln, traditionellen Siegelglyphen (`阿梅莉`, `墨`, `和`, `吉`, `永`, `经典`), antiken Canbian-Bruchkanten (残边) sowie taktil-akustischer Web-Audio-Stempelresonanz (`playStampThud()`).
- [x] **Ticket C5 (Validierung):** Test-Suite in `src/engine/wet-ink/calligraphy.test.ts` (12 Tests grün, 301 ms) und vollständige Verifikation über die gesamte Suite (`npm test`: 62 Suiten, 871 Tests grün; `npm run lint`: 0 Fehler).

---

## 4. Bereitstellung & Status

Alles ist zu 100 % **Zero-Cloud, CC0 Public Domain** und läuft lokal im Browser ohne Backend oder externe Assets.
Die chinesische Kalligrafie- und Siegelkunsterweiterung ist nahtlos in den Simulator und die `@wet-ink/*`-Engine integriert.
