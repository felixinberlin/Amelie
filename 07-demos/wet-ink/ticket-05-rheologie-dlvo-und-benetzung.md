# Ticket #5: Nicht-Newtonsche Rheologie, DLVO-Kolloidstabilität, Deegan-Kaffeering & Benetzungsregime

**Status:** Abgeschlossen & Verifiziert  
**Datum:** Oktober 2026  
**Komponenten:** `src/engine/wet-ink/rheology.ts`, `src/engine/wet-ink/dlvo.ts`, `src/engine/wet-ink/evaporation-deegan.ts`, `src/engine/wet-ink/wetting-regimes.ts`, `packages/wet-ink-core/src/index.ts`, `src/components/simulators/WetInkPhysicsLab.tsx`  
**Testabdeckung:** 49 neue Tests in 4 Suiten (`rheology.test.ts`, `dlvo.test.ts`, `evaporation-deegan.test.ts`, `wetting-regimes.test.ts`), 100 % bestanden.

---

## 🎯 Zielsetzung

Die physikalische Simulation von Tinte und Tusche auf faserigem Papier um vier fundamentale kontinuumsmechanische, kolloidchemische und grenzflächenthermodynamische Phänomene erweitern:

1. **Nicht-Newtonsche Strukturviskosität & Thixotropie (Cross 1965, Carreau-Yasuda 1972, Herschel-Bulkley 1926, Mewis & Wagner 2009):**
   Authentische Tintenformulierungen (Rußtusche in Gelatine-Bindemittel, Zinnober HgS, Eisengallus, Acryl) weisen ein ausgeprägtes Scherverdünnen auf. In Ruhe schützt eine hohe Nullviskosität $\eta_0$ und Fließgrenze $\tau_y$ vor unkontrolliertem Ineinanderfließen; unter der Scherbeanspruchung der Schreibspitze ($\dot{\gamma} = v_{\text{tip}} / h_{\text{film}} \sim 10^1 - 10^4\text{ s}^{-1}$) bricht die Viskosität um Größenordnungen auf $\eta_\infty$ ein, gefolgt von zeitabhängiger Rückgelierung.

2. **DLVO-Kolloidstabilität & Verdunstungsflockung (Derjaguin & Landau 1941, Verwey & Overbeek 1948, Hogg et al. 1966):**
   Quantitative Berechnung des Kräftegleichgewichts zwischen Van-der-Waals-Anziehung $V_A(H)$ und elektrostatischer Doppelschichtabstoßung $V_R(H)$. Während des Trocknungsprozesses verdunstet das Wasser, die Ionenstärke $I(t)$ steigt, die Debye-Abschirmlänge $\lambda_D$ bricht ein und die Energiebarriere $V_{\max} / (k_B T)$ kollabiert unter die thermische Energieschwelle — dies löst den Übergang vom stabilen Sol zur irreversiblen Granulierung (Pigmentflockung) aus.

3. **Deegan-Nagel (1997) Kontaktlinien-Verdunstung & Kaffeering-Advektion:**
   Analytische Berechnung des singulären Verdunstungsflusses $J(r) = J_0 (1 - r^2/R^2)^{-\lambda}$ an der gepinnten Kontaktlinie mit Exponent $\lambda(\theta_c) = (\pi - 2\theta_c)/(2\pi - 2\theta_c)$, tiefengemittelter radialer Ausgleichsströmung $\bar{v}_r(r)$ aus der Kontinuitätsgleichung und Marangoni-Gegenströmung (Hu & Larson 2002/2006).

4. **Papier-Topografie & Wenzel / Cassie-Baxter Benetzungsregime (Wenzel 1936, Cassie & Baxter 1944):**
   Berechnung der scheinbaren Kontaktwinkel $\theta_W$ (homogenes Einsaugen in Zellulosetäler) und $\theta_{CB}$ (heterogene Lufteinschlüsse auf Faserkuppen), thermodynamischer Umschlags-Kontaktwinkel $\theta_c^*$ und Laplace-Durchbruchsdruck $\Delta P_{\text{Laplace}} = - (2\gamma \cos \theta_Y) / R_{\text{pore}}$ für stift- und pinseldruckinduzierte Benetzungsübergänge.

---

## 📐 Mathematische Formulierungen

### 1. Cross- und Carreau-Yasuda-Viskosität
$$\eta_{\text{Cross}}(\dot{\gamma}) = \eta_\infty + \frac{\eta_0 - \eta_\infty}{1 + (K \dot{\gamma})^m}$$
$$\eta_{\text{CY}}(\dot{\gamma}) = \eta_\infty + (\eta_0 - \eta_\infty) \left[ 1 + (\lambda \dot{\gamma})^a \right]^{\frac{n-1}{a}}$$

### 2. Herschel-Bulkley Fließgrenze
$$\tau(\dot{\gamma}) = \tau_y + K \dot{\gamma}^n \quad (\tau > \tau_y)$$

### 3. Thixotrope Strukturkinetik
$$\frac{d\lambda_{\text{thix}}}{dt} = \frac{1 - \lambda_{\text{thix}}}{\tau_{\text{rec}}} - k_{\text{break}} \dot{\gamma} \lambda_{\text{thix}}, \quad \lambda_{ss} = \frac{1}{1 + k_{\text{break}} \tau_{\text{rec}} \dot{\gamma}}$$

### 4. DLVO-Gesamtenergieprofil
$$V_{\text{tot}}(H) = V_A(H) + V_R(H)$$
$$V_A(H) = -\frac{A_H}{6} \left[ \frac{2}{s^2 - 4} + \frac{2}{s^2} + \ln\left( \frac{s^2 - 4}{s^2} \right) \right], \quad s = \frac{2a + H}{a}$$
$$V_R(H) = 2\pi \varepsilon_r \varepsilon_0 a \zeta^2 \ln(1 + e^{-\kappa H}), \quad \kappa = \sqrt{\frac{2 e^2 N_A I}{\varepsilon_r \varepsilon_0 k_B T}}$$

### 5. Deegan-Kaffeering Kontinuitätsströmung
$$J(r) = J_0 \left( 1 - \frac{r^2}{R^2} \right)^{-\lambda(\theta_c)}, \quad \lambda(\theta_c) = \frac{\pi - 2\theta_c}{2\pi - 2\theta_c}$$
$$\bar{v}_r(r) = \frac{1}{\rho r h(r)} \int_0^r r' J(r') dr'$$

### 6. Wenzel & Cassie-Baxter Benetzungsgleichungen
$$\cos \theta_W = r_w \cos \theta_Y, \quad \cos \theta_{CB} = f_s (\cos \theta_Y + 1) - 1$$
$$\cos \theta_c^* = \frac{f_s - 1}{r_w - f_s}$$
$$\Delta P_{\text{Laplace}} = -\frac{2 \gamma_{LV} \cos \theta_Y}{R_{\text{pore}}}$$

---

## 🔬 Verifizierte Kataloge

- **`INK_RHEOLOGY_CATALOG`:**
  - `pineSootGelatin`: Song-Yan Rußtusche mit Knochenleim ($\eta_0 = 1{,}85\text{ Pa}\cdot\text{s}$, $\tau_y = 0{,}42\text{ Pa}$, $\tau_{\text{rec}} = 4{,}8\text{ s}$).
  - `vermilionCinnabar`: Mineralischer Zinnober ($\eta_0 = 4{,}20\text{ Pa}\cdot\text{s}$, $\tau_y = 1{,}65\text{ Pa}$, $\tau_{\text{rec}} = 7{,}5\text{ s}$).
  - `fountainPenCarbon`: Nanosuspendierte Füllhaltertinte ($\eta_0 = 0{,}0028\text{ Pa}\cdot\text{s}$, $\tau_y = 0{,}001\text{ Pa}$, fast newtonsch).
  - `ironGallHistoric`: Historische Eisengallustinte mit Gummi arabicum ($\eta_0 = 0{,}0042\text{ Pa}\cdot\text{s}$).
  - `acrylicCalligraphy`: Polymer-Acryltusche ($\eta_0 = 0{,}45\text{ Pa}\cdot\text{s}$, hoher Scherverdünnungsindex).

- **`COLLOID_PIGMENT_CATALOG`:**
  - `carbonBlackGelatin`: $a = 40\text{ nm}$, $\zeta = -45\text{ mV}$, $A_H = 3{,}5 \times 10^{-20}\text{ J}$ (hohe elektrosterische Stabilität).
  - `vermilionMineral`: $a = 450\text{ nm}$, $\zeta = -22\text{ mV}$, $A_H = 9{,}5 \times 10^{-20}\text{ J}$ (starke Anziehung, frühzeitige Flockung).
  - `ultramarineMineral`: $a = 280\text{ nm}$, $\zeta = -28\text{ mV}$, $A_H = 6{,}0 \times 10^{-20}\text{ J}$.

- **`PAPER_TOPOGRAPHY_CATALOG`:**
  - `shengXuan`: Rohes Xuan ($r_w = 1{,}85$, $f_s = 0{,}35$, $R_p = 4{,}5\,\mu\text{m}$, Vollbenetzung).
  - `banShuXuan`: Halbreifes Xuan ($r_w = 1{,}45$, $f_s = 0{,}55$, $R_p = 2{,}2\,\mu\text{m}$).
  - `shuXuan`: Reifes Alaun-Xuan ($r_w = 1{,}20$, $f_s = 0{,}85$, $R_p = 0{,}8\,\mu\text{m}$, stabiler Flüssigkeitsfilm).
  - `torinokoWashi`: Glattes Torinoko-Gampi ($r_w = 1{,}28$, $f_s = 0{,}72$, $R_p = 1{,}4\,\mu\text{m}$).
  - `archesAquarelle`: Arches Feinkorn 300 g/m² ($r_w = 2{,}15$, $f_s = 0{,}42$, $R_p = 7{,}5\,\mu\text{m}$, ausgeprägte Pigmentgranulierung).

---

## 💻 Integration

- **SDK (`@wet-ink/core`):** Alle rheologischen, DLVO-, Verdunstungs- und Topografie-Berechnungsfunktionen sind erstklassige Exports in `packages/wet-ink-core/src/index.ts`.
- **Interaktives Physik-Labor (`WetInkPhysicsLab.tsx`):**
  - **Tab 4 (Tinten-Rheologie):** Interaktiver Schergeschwindigkeits-Slider $\dot{\gamma} \in [0{,}5, 1000]\text{ s}^{-1}$ mit Echtzeit-Auswertung von Cross, Carreau-Yasuda, Herschel-Bulkley und Thixotropie-Gelierung.
  - **Tab 5 (DLVO & Benetzung):** Interaktiver Verdunstungsfortschritts-Slider mit Live-Kollaps der Energiebarriere $V_{\max}$ und Umschlag zur Flockung sowie Wenzel/Cassie-Baxter-Winkelberechnung.
  - **Tab 6 (Deegan Kaffeering):** Interaktiver Kontaktwinkel- und Radius-Regler mit Berechnung des singulären Exponenten $\lambda$, Peclet-Zahl $\text{Pe}$ und dynamischem SVG-Meniskusquerschnitt.
