---
status: Available
delivery_method: E-Mail
target_maker: Andrew Nesbitt / Ecosyste.ms
---
# Diffgeist

**Ein Satz:** Kein Changelog für alle, sondern der Teil, den dein Code tatsächlich aufruft — „React 20 ändert X, du nutzt X an vier Stellen, hier sind sie".

**Stand:** September 2026 · **Prüfen ab:** März 2027 (schnelllebiges Feld)
**Empfänger:** Andrew Nesbitt / Ecosyste.ms · nachrangig: Renovate (Mend), Socket.dev
**Verdikt:** 🎁 verschenken — Rang 2/5, kein Code nötig

---

## Das Problem

Release Notes sind für ein anonymes Publikum geschrieben. Für dich sind 95 % davon irrelevant und die restlichen 5 % kritisch — aber welche 5 %, steht nirgends.

Die Folge ist das übliche Verhalten: Man liest sie nicht. Dependabot- und Renovate-PRs werden gemerged, weil die Tests grün sind, und die eine Verhaltensänderung, die deine Tests nicht abdecken, geht durch. Das ist keine Nachlässigkeit, sondern eine rationale Reaktion auf ein schlechtes Format.

Wer leidet: jedes Team mit mehr als fünfzig Dependencies, also jedes Team.

## Warum das jetzt geht

Drei Dinge mussten zusammenkommen, und das ist erst seit Kurzem der Fall:

1. **Release Notes lassen sich zuverlässig in Aussagen zerlegen.** „Was hat sich geändert, welches Symbol betrifft es, ist es breaking" aus Fließtext zu extrahieren ist heute robust genug für einen automatisierten Lauf — vorher war es Heuristik auf Überschriften.
2. **Call-Graph-Analyse ist billig.** „Rufst du diese API auf, und wo" beantwortet man pro Repo in Sekunden.
3. **Die Ökosystem-Datenschicht existiert offen.** Ohne eine offene Quelle für Paketmetadaten und Releases über alle Registries hinweg wäre der Datenbeschaffungsteil teurer als die eigentliche Idee. Genau diese Schicht hat Ecosyste.ms gebaut.

Die Kombination ist der Punkt: Erst wenn alle drei billig sind, lohnt sich ein personalisierter Changelog pro Repo und Update.

## Skizze

- Trigger: ein Dependency-Update-PR (Renovate/Dependabot) oder ein manueller Lauf.
- Schritt 1: Release Notes der betroffenen Version(en) holen und in Einzeländerungen zerlegen, je mit betroffenem Symbol und Schweregrad.
- Schritt 2: das Repo nach Verwendung genau dieser Symbole durchsuchen.
- Schritt 3: **Schnittmenge** als Kommentar in den PR — „drei von 47 Änderungen betreffen dich, hier die Fundstellen".
- Leerer Schnitt ist auch ein Ergebnis: „keine der Änderungen betrifft Code, den du aufrufst" ist die wertvollste Nachricht überhaupt.

**Nicht dabei:** kein eigener Update-Bot. Das ist eine Ergänzung zu Renovate, keine Konkurrenz.

## Erster Schritt

**Ticket: Eine Sprache, ein Paket, ein PR-Kommentar.**

Für JS/TS: Release Notes eines Pakets holen, Symbole extrahieren, Repo nach Imports und Aufrufen dieser Symbole durchsuchen, Ergebnis als Markdown ausgeben.

**Fertig, wenn:** bei einem echten Major-Update eines populären Pakets die Ausgabe kürzer ist als die Release Notes und nichts Relevantes fehlt. Der Test ist Rückruf, nicht Schönheit: lieber eine irrelevante Änderung zu viel als eine relevante zu wenig.

## Wo es kippt

**Falsch-negative sind fatal, falsch-positive nur lästig.** Wenn das Werkzeug eine breaking change übersieht, ist es schlimmer als kein Werkzeug — es erzeugt Vertrauen, das nicht gedeckt ist. Deshalb muss die Schwelle bewusst zu großzügig sein und das Werkzeug muss sagen, was es *nicht* prüfen konnte (dynamische Aufrufe, Reflection, transitive Dependencies).

**Zweites Risiko:** Transitive Abhängigkeiten. Die gefährlichen Änderungen stecken oft drei Ebenen tiefer, wo man den Aufruf nicht sieht. Ehrliche Abgrenzung: v1 kann nur direkte Dependencies.

## Wer es schon versucht hat

Recherche September 2026, nachgeprüft 19.09.2026: Changelog-Tooling ist ein großer Markt, und fast alles darin dreht sich um das **Erzeugen** von Changelogs fürs eigene Produkt. Den umgekehrten Weg — einen fremden Changelog gegen die eigene Nutzung filtern — gehen inzwischen aber **Security-/SCA-Anbieter**: **Aikido** („Upgrade impact analysis“) bewertet Breaking Changes aus den Library-Changelogs und scannt die Codebasis nach Nutzung; der Pull Request nennt betroffene Dateien und Zeilen (JavaScript, Python, Java, Go, .NET, PHP, Clojure). **Endor Labs** hat eine Upgrade Impact Analysis für JS/TS (schwächerer Treffer: Risikobewertung per Programmanalyse). Die Erstrecherche hatte diese Anbieterklasse nicht abgesucht. Beleg sind Suchzusammenfassungen; die Herstellerseiten wurden nicht gelesen, zwei von einem Tester genannte arXiv-Preprints (BreakGuard, DepRepair) sind nicht geprüft.

**Was offen bleibt:** Aikido und Verwandte decken **Breaking Changes** ab, innerhalb ihrer Plattform. Die *nicht* brechenden Release-Note-Inhalte (neue Features, Deprecations, Verhaltensänderungen), personalisiert auf den eigenen Code und ohne Security-Plattform, wurden nicht gefunden. Das Urteil im Prüfprotokoll steht deshalb bei `verengt` (vorher `frei`).

## Vorarbeit

- **Ecosyste.ms** — offene Datenschicht über Paket-Ökosysteme, inklusive Arbeiten zu Downstream-Testing. Ohne sie ist die Idee teuer, mit ihr ein Wochenende.
- **Renovate / Mend** — liefert den PR, in den das Ergebnis gehört.
- **Socket.dev** — analysiert ohnehin, was ein Update tatsächlich tut.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
