# ChemHazard: Erste Produkt- und Barcode-Recherche vom 12.10.2026

**Fortgeschrieben:** Die [anschließende Quellenprüfung](product-review-2026-10-12.md) hat die hier gefundenen Produkte plus acht weitere mit Hersteller-SDB abgeglichen und übernommen. Die folgende Liste dokumentiert den ursprünglichen Recherchestand; chemische Vollständigkeitsprüfung und physischer Gebindeabgleich bleiben offen.

**Ergebnis:** 13 zusätzliche Produktnamen/Formulierungskandidaten mit 22 veröffentlichten EAN sowie vier EAN für das bereits erfasste MILIZID. Alle 26 Nummern bestehen die GS1-Prüfziffer. Quelle sind öffentlich indexierte Produktseiten des Hersteller-Shops DR.SCHNELL; SDB-Zuordnung und physisches Gebinde wurden noch nicht geprüft.

Der maschinenlesbare Bestand steht in [data/product-candidates.json](data/product-candidates.json). Er wird **nicht** von Simulator, Misch-Engine oder Barcode-Generator eingelesen. Die Laufzeitdaten bleiben unverändert. Varianten wie MILIZID, MILIZID ECO und MILIZID KALKREINIGER dürfen nicht über ähnliche Namen zusammengelegt werden.

| Herstellerprodukt / Fundstelle | Veröffentlichte EAN | Einordnung |
|---|---|---|
| [ONEMÜ 2000](https://shop.dr-schnell.com/shop/kategorien-in-der-uebersicht/kuechen-und-lebensmittelhygiene/handspuelmittel/1381/onemue-2000) | `4008439001236` | neu |
| [EASY QUICK A](https://shop.dr-schnell.com/shop/kategorien-in-der-uebersicht/gebaeudereinigung/boeden/1939/easy-quick-a) | `4008439036863` | neu |
| [EASY QUICK N](https://shop.dr-schnell.com/shop/kategorien-in-der-uebersicht/gebaeudereinigung/oberflaechen/1921/easy-quick-n) | `4008439036283` | neu |
| [GLASFEE](https://shop.dr-schnell.com/shop/kategorien-in-der-uebersicht/gebaeudereinigung/oberflaechen/1388/glasfee) | `4008439001564`, `4008439001373`, `4008439001427` | neu |
| [MILIZID ECO](https://shop.dr-schnell.com/shop/kategorien-in-der-uebersicht/gebaeudereinigung/sanitaerreiniger/1481/milizid-eco) | `4008439009928`, `4008439309974` | neu |
| [RAPIDO SPRÜH-EX](https://shop.dr-schnell.com/shop/kategorien-in-der-uebersicht/gebaeudereinigung/textile-bodenbelaege-polster/1405/dr.schnell-s-rapido-sprueh-ex) | `4008439001953` | neu |
| [MILIZID KALKREINIGER](https://shop.dr-schnell.com/shop/kategorien-in-der-uebersicht/gebaeudereinigung/sanitaerreiniger/1374/milizid-kalkreiniger) | `4008439001069`, `4008439300056` | neu |
| [ECOLUTION FOROL ULTRAHOCHKONZENTRAT](https://shop.dr-schnell.com/shop/kategorien-in-der-uebersicht/gebaeudereinigung/oberflaechen/1326/ecolution-forol-ultrahochkonzentrat) | `4008439312127` | neu |
| [LEVANTE ECO](https://shop.dr-schnell.com/shop/kategorien-in-der-uebersicht/gebaeudereinigung/oberflaechen/1766/levante-eco) | `4008439035828` | neu |
| [SCHIROCCO CLEAN](https://shop.dr-schnell.com/shop/kategorien-in-der-uebersicht/gebaeudereinigung/boeden/1469/schirocco-clean) | `4008439007245`, `4008439307260`, `4008439307222` | neu |
| [EASY QUICK S](https://shop.dr-schnell.com/shop/kategorien-in-der-uebersicht/gebaeudereinigung/boeden/1976/easy-quick-s) | `4008439044103`, `4008439044141` | neu |
| [DESIFOR-QUICK](https://shop.dr-schnell.com/shop/kategorien-in-der-uebersicht/desinfektion/flaechendesinfektion/1453/desifor-quick) | `4008439205221`, `4008439204514`, `4008439045315` | neu |
| [ECOLUTION FOROL STICKS](https://shop.dr-schnell.com/shop/kategorien-in-der-uebersicht/gebaeudereinigung/oberflaechen/1328/ecolution-forol-sticks) | `4008439312028` | neu |
| [MILIZID](https://shop.dr-schnell.com/shop/kategorien-in-der-uebersicht/gebaeudereinigung/sanitaerreiniger/1373/milizid) | `4008439001045`, `4008439300070`, `4008439300001`, `4008439001038` | bestehendes MILIZID |

## Gebinde und Nachprüfung

Die Produktseiten enthalten mehrere Gebindegrößen. Beispiel MILIZID: 200 ml `4008439001038`, 1 l `4008439001045`, 10 l `4008439300070`, 200 kg `4008439300001`. Diese Beispiele ersetzen keine vollständige Prüfung jeder Zuordnung. Die maschinenlesbaren Kandidaten enthalten deshalb `packageMappingReviewed: false`.

Für jede Aufnahme in `products.json`:

1. Herstellerseite öffnen, genauen Produktnamen, Artikelnummer, Land, Gebinde und Barcode dokumentieren. Ein gleichnamiges Produkt in anderem Markt oder eine andere Formulierung bleibt getrennt.
2. Das aktuelle deutsche Sicherheitsdatenblatt desselben Produkts abrufen. `node scripts/chemhazard-sds.mjs extract <pdf|url>` liefert einen Entwurf; Herkunft, Revision und Hash speichern, die PDF selbst nicht ins Repository aufnehmen.
3. Gefahrengruppen und Abschnitt 2/3/9/10 manuell prüfen. Barcode-Evidenz und Gefahrendaten-Evidenz getrennt dokumentieren. Keine Review-Flags allein aufgrund dieser Kandidatenliste setzen.
4. GTINs im Laufzeitbestand auf GTIN-14 normalisieren und jede Zuordnung einzeln bestätigen. Vollständigkeit und aktuelle Fassung gesondert prüfen. Erst danach kontrolliert übernehmen; `npm run check:chemhazard`, Barcode-Generierung und Regressionstests ausführen.

## Leerflaschen sind keine Produktidentität

Die [Herstellerseite für ECOLUTION-Handsprühflaschen](https://shop.dr-schnell.com/shop/kategorien-in-der-uebersicht/zubehoer/dosierhilfen/handsprueher/1329/handsprueher-ecolution) nennt:

- `4008439312073`: leere ECOLUTION FOROL-Sprühflasche.
- `4008439312059`: leere ECOLUTION MILIZID-Sprühflasche.

Diese Codes dürfen **niemals** als Inhaltsstoff- oder Formulierungsidentität importiert werden. Der Inhalt einer nachgefüllten Flasche lässt sich aus ihrem Kaufbarcode nicht bestimmen. Beide stehen als Ausschlüsse in der Kandidatendatei; der Test prüft, dass sie und die noch ungeprüften Kandidaten bei der Laufzeitabfrage unbekannt bleiben.

## Quellenmeldung

- **Quelle:** DR.SCHNELL Hersteller-Shop, Produktseiten (14 verlinkte Seiten plus Leerflaschen-Seite).
- **Zugang:** öffentliche, indexierte Herstellerseiten über Websuche; keine API, kein WINGIS-/GESTIS-Scraping.
- **Ertrag:** 13 neue Produktkandidaten, 22 EAN; vier weitere EAN für bestehendes MILIZID; zwei Leerflaschen-Codes ausdrücklich ausgeschlossen.
- **Evidenzgrenze:** veröffentlichte Identitätsangaben und Prüfziffer geprüft; keine neue chemische Verifikation, kein physischer Gebindeabgleich, keine abgeschlossene SDB-/Vollständigkeitsprüfung.
- **Korrektur:** DR.SCHNELL veröffentlicht EAN je Gebinde in seinem eigenen Shop. Die frühere Aussage „keine EAN veröffentlicht“ war zu pauschal.
- **Register:** Meldung für den Bibliothekar; Quellenregister nicht direkt bearbeitet.
