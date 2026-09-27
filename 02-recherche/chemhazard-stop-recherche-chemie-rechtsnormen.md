# Chemische Reaktionsmechanismen, CLP-Verordnung & GISCODE-Systematik

> **Das wissenschaftliche Fundament von ChemHazard Stop / MischStop**  
> *Stand: 27. September 2026 · Autor: Amélie Initiative (CC0)*

---

## 1. Das Kernrisiko: Säure + Natriumhypochlorit $\to$ Chlorgas

Das Mischen von sauren Entkalkern (WC-Beckenreiniger, Urinsteinlöser) mit oxidierenden Bleichmitteln ist einer der häufigsten und gefährlichsten Vergiftungsunfälle im Reinigungsgewerbe und in Privathaushalten.

### 1.1 Reaktionskinetik & Thermodynamik

In wässriger Lösung liegt Natriumhypochlorit ($\text{NaOCl}$) in einem alkalischen Gleichgewicht vor:
$$\text{OCl}^- + \text{H}_2\text{O} \rightleftharpoons \text{HOCl} + \text{OH}^- \quad (pK_a = 7{,}53)$$

Wird eine Säure ($\text{H}^+$) zugegeben — etwa Salzsäure ($\text{HCl}$), Phosphorsäure ($\text{H}_3\text{PO}_4$), Amidosulfonsäure ($\text{H}_3\text{NSO}_3$) oder Ameisensäure ($\text{HCOOH}$) —, verschiebt sich das Gleichgewicht schlagartig:
$$\text{OCl}^- + \text{H}^+ \to \text{HOCl}$$

Bei Anwesenheit von Chlorid-Ionen ($\text{Cl}^-$), wie sie in Salzsäure-Reinigern oder bereits als Stabilisator in technischen Bleichen enthalten sind, läuft die Komproportionierung sofort quantitativ ab:
$$\text{HOCl} + \text{H}^+ + \text{Cl}^- \to \text{Cl}_2 \uparrow + \text{H}_2\text{O}$$

Bruttogleichung:
$$2\text{H}^+ + \text{OCl}^- + \text{Cl}^- \to \text{Cl}_2 \uparrow + \text{H}_2\text{O}$$

### 1.2 Toxikologie des Chlorgases ($\text{Cl}_2$)

* **Geruchsschwelle:** ca. $0{,}2\text{ bis }0{,}4\text{ ppm}$
* **Arbeitsplatzgrenzwert (AGW nach TRGS 900):** $0{,}5\text{ ppm}$ ($1{,}5\text{ mg/m}^3$)
* **Schwere Reizung & Lungenödemgefahr:** ab $30\text{ bis }50\text{ ppm}$
* **Tödlich bei kurzer Exposition:** ab $400\text{ bis }1000\text{ ppm}$

In einer typischen fensterlosen Sanitärzelle (Raumvolumen $6\text{ bis }10\text{ m}^3$) genügen bereits $50\text{ ml}$ Bleiche und $50\text{ ml}$ saurer WC-Reiniger, um innerhalb von 30 Sekunden Chlorgaskonzentrationen von über $300\text{ ppm}$ in der Atemzone der Reinigungskraft freizusetzen. Chlorgas reagiert mit dem Feuchtigkeitsfilm der Bronchien und Alveolen zu Salzsäure und reaktiven Sauerstoffradikalen, was zu toxischem Lungenödem und Ersticken führt.

---

## 2. Sekundäre Gefahrenpaare

Neben der Chlorgasreaktion identifiziert das ChemHazard-Regelwerk drei weitere lebensbedrohliche Inkompatibilitäten:

| Kombination | Chemische Reaktion | Resultierendes Toxin / Risiko |
|---|---|---|
| **Säure + Ammoniak** | $\text{NH}_3 + \text{H}^+ \to \text{NH}_4^+$ (stark exotherm, $\Delta H = -52{,}2\text{ kJ/mol}$) | Siedeverzug, Verspritzen ätzender Säuretropfen, dichte Ammoniumsalzaerosole |
| **Hypochlorit + Ammoniak** | $\text{NH}_3 + \text{NaOCl} \to \text{NH}_2\text{Cl} + \text{NaOH}$<br>$\text{NH}_2\text{Cl} + \text{NaOCl} \to \text{NHCl}_2 + \text{NaOH}$<br>$\text{NHCl}_2 + \text{NaOCl} \to \text{NCl}_3 + \text{NaOH}$ | Monochloramin ($\text{NH}_2\text{Cl}$), Dichloramin ($\text{NHCl}_2$) und explosives Stickstofftrichlorid ($\text{NCl}_3$); schwere Atemwegsnekrosen |
| **Wasserstoffperoxid + Starke Lauge** | $2\text{H}_2\text{O}_2 \xrightarrow{\text{OH}^-} 2\text{H}_2\text{O} + \text{O}_2 \uparrow$ (katalysiert) | Schlagartige Gasfreisetzung, Bersten geschlossener Eimer/Flaschen, Heißdampf |

---

## 3. Der Rechtsrahmen: CLP-Verordnung & GefStoffV

### 3.1 Die europäische CLP-Verordnung (EG Nr. 1272/2008)

Der deterministische Hebel der öffentlich-rechtlichen Spur von ChemHazard Stop ist die EU-CLP-Einstufung:
* **`EUH031`:** *„Entwickelt bei Berührung mit Säure giftige Gase."*  
  Dieser Satz ist für Hypochlorit-Zubereitungen gesetzlich vorgeschrieben. Findet die App diesen Satz auf einem Produkt (per Barcode-Lookup oder Etiketten-OCR), wird das Produkt deterministisch als Gefahrengruppe `hypochlorite` eingestuft.
* **`H314`:** *„Verursacht schwere Verätzungen der Haut und schwere Augenschäden."* (Typisch für starke Säuren und Laugen mit $\text{pH} \le 2$ oder $\text{pH} \ge 11{,}5$).
* **`H318`:** *„Verursacht schwere Augenschäden."*

### 3.2 Gefahrstoffverordnung (GefStoffV) & DGUV Regel 101-019

Die GefStoffV (§§ 6, 7, 14) verpflichtet den Arbeitgeber zur Gefährdungsbeurteilung, Betriebsanweisung und Unterweisung. Die DGUV Regel 101-019 regelt den konkreten Umgang im Reinigungsgewerbe:
* Reiniger dürfen **grundsätzlich nicht miteinander gemischt** werden.
* Für GISCODE-Produktgruppen existieren vorformulierte Sammelbetriebsanweisungen.

**Rechtliche Abgrenzung:** ChemHazard Stop ersetzt weder die Gefährdungsbeurteilung des Arbeitgebers noch die PSA-Pflicht. Die App ist ein rein assistives Warnwerkzeug am Einsatzort.

---

## 4. Die GISBAU / GISCODE-Systematik der BG BAU

Die Berufsgenossenschaft der Bauwirtschaft (BG BAU) hat mit dem GISCODE eine freiwillige, aber in der deutschen Branche de facto standardisierte Kennzeichnung geschaffen:

| GISCODE | Bedeutung | Typische Inhaltsstoffe / Gefahrengruppe |
|---|---|---|
| **`GD10`** | Desinfizierende Reiniger, chlorhaltig | Natriumhypochlorit $\to$ `hypochlorite`, `oxidizer` |
| **`GD20`** | Desinfizierende Reiniger, chlor- und alkalihaltig | $\text{NaOCl} + \text{NaOH} \to$ `hypochlorite`, `caustic_lye` |
| **`GD30`** | Desinfizierende Reiniger, stark oxidierend | Hypochlorit / Perverbindungen |
| **`GS10`** | Sanitärreiniger, säurefrei / schwach sauer | Tenside, organische Salze $\to$ `neutral` |
| **`GS20`** | Sanitärreiniger, amidosulfonsäurehaltig | Amidosulfonsäure ($\text{pH} \approx 1$) $\to$ `acid` |
| **`GS50`** | Sanitärreiniger, stark sauer (Salzsäure, Phosphorsäure) | Starke anorganische Säuren ($\text{pH} < 1$) $\to$ `acid` |
| **`GS80`** | Sanitärreiniger, hochkonzentriert | Säurekonzentrate $\to$ `acid` |
| **`GU40`** | Neutraler Unterhaltsreiniger / Glasreiniger | Alkohol, Neutraltenside $\to$ `neutral` |
| **`GU50`** | Neutralreiniger für Fußböden | Tenside ($\text{pH } 6\text{–}8$) $\to$ `neutral` |

### 4.1 Die Lizenz-Spur: WINGIS vs. Open Data

Das WINGIS-System der BG BAU enthält über 15.000 erfasste Produkte mit GISCODEs.
* **Hard Rule:** Amélie und ChemHazard Stop scrapen WINGIS nicht ab. Urheberrecht und Datenbankherstellerrecht (§ 87a UrhG) werden strikt respektiert.
* ChemHazard Stop funktioniert autark über **offene CLP-Daten und GTINs**. Die offizielle GISCODE-Zuordnung wird als optionale Zusatzspur nur bei einer formellen Partnerschaft oder schriftlicher Genehmigung der BG BAU gebündelt.
