# Gründungsnavigator & Jobcenter-Hilfe: das Werkzeug

Die Dose [`gruendungsnavigator`](../../05-dosen/gruendungsnavigator.md) bleibt in Amélie. Das Werkzeug selbst lag ab 17.10.2026 in einem eigenen, öffentlichen Repository (`felixinberlin/jobcenter-hilfe`, CC0). **Seit 18.10.2026 ist es privat, weil daraus eine App wird.** Die alten Seiten unter `felixinberlin.github.io/jobcenter-hilfe/` sind damit nicht mehr erreichbar.

## Vorschau in Amélie

Damit Interessierte sehen, was kommt, liegt in Amélie eine kleine, eigenständige Vorschau:

**https://felixinberlin.github.io/Amelie/gruendungsnavigator/** (Datei `public/gruendungsnavigator/index.html`)

| Teil | Was |
|---|---|
| Widerspruchsfrist | Bekanntgabe am vierten Tag nach Aufgabe zur Post (§ 37 Abs. 2 SGB X) oder bei Übergabe, ein Monat (§ 84 Abs. 1 SGG) bzw. ein Jahr ohne Belehrung (§ 66 Abs. 2 SGG), Verschiebung auf den nächsten Werktag (§ 64 Abs. 3 SGG) mit bundesweiten und landesweiten Feiertagen |
| Drei Rechte-Karten | „Dafür bin ich nicht zuständig“ (§ 16 Abs. 2 SGB I), „Das nehme ich so nicht an“ (§ 20 Abs. 3 SGB X), Akteneinsicht (§ 25 Abs. 1 SGB X); Wortlaut aus dem geprüften Normregister (Abgleich 16.10.2026) |
| Was die App kann | Übersicht der Module, Knopf „Bescheid sagen, wenn die App da ist“ (mailto) |
| Transparenz | Keine Rechtsberatung, zur Laufzeit keine KI, was geprüft ist und was nicht |

Konservativ gerechnet: Wo das Recht unklar ist (verschiebt sich der vierte Tag bei Wochenende?) oder ein Feiertag nur regional gilt (Mariä Himmelfahrt in Bayern, Fronleichnam in Sachsen und Thüringen), nimmt die Vorschau den früheren Tag. Der Fristkern steht als `<script id="frist-kern">` in der Seite und wird von `src/utils/jobcenterVorschau.test.ts` direkt aus dem HTML geprüft (Monatsende, Ostern, Landesfeiertage, Verschiebung, ungültige Eingaben, Zitate, keine Links ins private Repository).

Die alten Adressen `fall-landkarte.html` und `jobcenter-hilfe.html` leiten auf die Vorschau. Der alte Service Worker leert seinen Speicher und meldet sich ab.

Änderungen an der App gehen nur ins Werkzeug-Repository. Wird dort ein Zitat korrigiert, das auch hier steht, die Vorschau nachziehen.
