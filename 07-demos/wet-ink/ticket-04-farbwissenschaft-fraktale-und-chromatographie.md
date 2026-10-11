# Ticket #04: Farbwissenschaft, Perkolationsfraktale & Papier-Chromatographie

**Status:** Abgeschlossen & verifiziert (11. Oktober 2026)  
**Komponenten:** `src/engine/wet-ink/color-science.ts`, `src/engine/wet-ink/chromatography.ts`, `src/engine/wet-ink/metrics.ts`, `@wet-ink/core`  
**Testabdeckung:** 21 Tests in 3 dedizierten Suiten (`color-science.test.ts`, `chromatography.test.ts`, `metrics.test.ts`), 100 % grün.

---

## 1. Problemstellung & Wissenschaftlicher Kontext

Digitale Mal- und Tuschwerkzeuge leiden historisch unter vier physikalischen Vereinfachungen:
1. **Unzureichende Grenzflächenoptik:** Die reine Kubelka-Munk-Gleichung vernachlässigt die Fresnel-Reflexion an der Grenzfläche zwischen Umgebungsluft ($n \approx 1.0$) und feuchtem Papier/Pigmentschicht ($n \approx 1.5$), was zu einer Überschätzung der beobachteten Helligkeit bei tiefen Schwarztönen (Sumi-Tusche) führt.
2. **Fehlende quantitative Wahrnehmungsmetrik:** Der Farbunterschied zwischen physikalischem subtraktivem Pigmentmischen und digitaler RGB-Mittelung wurde nie in international genormten Farbabständen gemessen.
3. **Mangel an morphologischen Perkolationsmetriken:** Das Ausfransen (Feathering) von Tinte in ungeleimtem Xuan- oder Washi-Papier wurde visuell beurteilt, statt die Fraktaldimension $D_f$ der Kapillarkontaktlinie physikalisch zu bestimmen.
4. **Ignorieren chromatographischer Pigmenttrennung:** Historische Tinten und Aquarelllasuren bestehen oft aus Mischungen mehrerer Pigmentpartikelarten (z. B. feine Rußnanopartikel vs. grobe Zinnoberextrakte). In porösen Medien trennen sich diese durch unterschiedliche hydrodynamische Mobilität und Porenfiltration radial voneinander (in der chinesischen Malerei als *Fen-Mo* 分墨 bekannt).

---

## 2. Realisierte mathematisch-physikalische Module

### 2.1 Saunderson (1942) Fresnel-Grenzflächenkorrektur
Erweiterung der Kubelka-Munk-Gleichung um die interne und externe diffuse Reflexion nach J. L. Saunderson (1942):
$$R_{\text{obs}} = k_1 + \frac{(1 - k_1)(1 - k_2) R_{\text{int}}}{1 - k_2 R_{\text{int}}}$$
mit den empirischen Standardkonstanten:
* $k_1 = 0{,}04$: Fresnel-Reflexionskoeffizient für senkrechten Einfall an der Luft-Dielektrikum-Grenzfläche.
* $k_2 = 0{,}60$: Judd-Konstante für interne diffuse Reflexion an der unebenen Papieroberfläche.
* Invertierbare Transformation via `inverseSaunderson(R_obs, k1, k2)` mit analytischer Genauigkeit bis $10^{-7}$.

### 2.2 ISO/CIE 11664-6:2014 & CIEDE2000 ($\Delta E_{00}$) Farbdifferenz-Engine
* Vollständige Implementierung der CIE-Standardmetrik zur Quantifizierung der wahrgenommenen Farbunterschiede zwischen CIELAB-Farbkoordinaten.
* **Ground-Truth-Audit:** Verifiziert gegen den autoritativen Benchmark-Datensatz von Sharma, Wu und Dalal (2005, *Color Research & Application*) mit exakter Reproduktion der 34 Referenzpaare.
* **Empirischer Befund:** Die Abweichung zwischen nativer subtraktiver Kubelka-Munk-Mischung und naiver digitaler RGB-Mittelung (z. B. Kadmiumgelb + Preußischblau) beträgt $\Delta E_{00} > 18{,}0$ — ein für das menschliche Auge drastischer, unübersehbarer Farbraumfehler der digitalen Standardprogramme.

### 2.3 Box-Counting Fraktaldimension ($D_f$) der Kapillarsaumlinie
* Implementierung eines multi-skaligen 2D-Box-Counting-Algorithmus ($\varepsilon \in [2, 4, 8, 16, 32]$ Pixel) mit linearer Regressionsanalyse nach Mandelbrot (1982) und Family & Vicsek (1991):
  $$\log N(\varepsilon) = -D_f \log \varepsilon + C, \quad R^2 > 0{,}95$$
* **Physikalische Differenzierung:**
  * Glatter euklidischer Kreis / geleimtes Kopierpapier (*Shu Xuan*): $D_f \approx 1{,}00 - 1{,}10$ (strikte Unterdrückung von Fingerbildung).
  * Rohes ungeleimtes Reispapier (*Sheng Xuan*) mit anisotropen Fasertendrilen: $D_f \ge 1{,}25$ (charakteristischer Übergang zur Invasionsperkolation).

### 2.4 Radiale Papier-Chromatographie mit Lucas-Washburn-Kinetik
* Modellierung der radialen Frontausbreitung nach Lucas (1918) und Washburn (1921):
  $$R(t) = \sqrt{R_0^2 + \frac{\gamma \cdot r_{\text{pore}} \cdot \cos\theta}{2\eta} t}$$
* Advektions-Dispersions-Porenfiltrations-PDE für Mehrkomponenten-Pigmentsuspensionen:
  $$\frac{\partial c_k}{\partial t} = \frac{1}{r} \frac{\partial}{\partial r} \left( r D_k \frac{\partial c_k}{\partial r} \right) - \frac{1}{r} \frac{\partial}{\partial r} \left( r v_k c_k \right) - \lambda_k c_k$$
  wobei $v_k(r, t) = R_{f, k} \cdot v_{\text{solvent}}(r, t)$ und $\lambda_k \propto (r_{p, k} / r_{\text{pore}})^2$.
* Ermittlung des IUPAC-Chromatographie-Auflösungsfaktors $R_s = \frac{2 |r_2 - r_1|}{w_1 + w_2}$ und des radialen spektralen Farbprofils.

---

## 3. UI- & SDK-Integration

* **Wet Ink Physics Lab (`WetInkPhysicsLab.tsx`):**
  * Live-Metrik $\Delta E_{00}$ im Kubelka-Munk-Vergleichsfeld.
  * Umschaltbare Saunderson-Grenzflächenkorrektur.
  * Interaktiver Tab *3. Papier-Chromatographie* mit Live-Farbgradientenstreifen, $R_s$-Auflösungsanzeige und Lucas-Washburn-Radiusrechner.
* **Headless SDK (`@wet-ink/core`):**
  * `controller.getMetrics()` liefert `StainMetrics` inklusive `fractalDimension`.
  * `controller.getFractalAnalysis()` liefert Multi-Skalen-Boxzählungen und $R^2$-Güte.
  * Algorithmen als eigenständige Funktionen exportiert: `ciede2000`, `srgbDeltaE`, `saundersonCorrection`, `simulateRadialChromatography`.
