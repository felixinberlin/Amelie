# Vibecode-Ideen — komplett neue Projekte

Nichts hiervon überschneidet sich mit tortilla-world / tortillaC / openCulinaryRuntime / tortilladepatatas.org / recipes-API / phone-motion-3d / OpenCIB / Kleinanzeigen-Agent / WBS Solvente / wesnoth-mcp.

Tags: **S** = Wochenende · **M** = paar Wochen · **L** = echtes Projekt

---

## 1. Agent- & MCP-Tooling

**git-archaeologist (MCP)** — **M**
Exponiert Repo-History als Frage-Interface: „warum existiert diese Zeile?" → blame + PR + Issue + Diskussion als eine Kette. Claude hört auf zu raten, warum dein Code so aussieht.

**Spec-Drift Detector** — **M**
CI-Check: LLM vergleicht Spec-Dokumente gegen die tatsächliche Implementierung und failt den Build bei Divergenz. Du hast mehrere spec-driven Repos — das ist genau die Lücke, die sonst manuell zufällt.

**Agent Postmortem Recorder** — **S**
Hook-basierter Logger für Claude-Code-Sessions → Statistik darüber, *was* der Agent regelmäßig falsch versteht. Output ist ein konkreter CLAUDE.md-Patch, kein Gefühl.

**Diffgeist** — **S**
Watcher auf Release-Notes deiner Dependencies, der gegen deine echte Nutzung grept: „React 20 ändert X, du nutzt X an 4 Stellen". Personalisiertes Changelog statt Newsletter.

**Home-Network MCP** — **S**
Fritzbox/Router als Tool-Server: wer ist im Netz, Bandbreite, DNS-Blocklisten togglen — per Chat statt Web-UI.

---

## 2. Physik-Spielzeug (dein Heimspiel, ohne Essen)

**Wet Ink** — **M**
Tinte auf Papier: Kapillarfluss, Bleeding, Papierfaser-Noise. WebGL-Brush, Export als SVG/PNG. Eine Physik, tief statt breit.

**Altbau Thermal** — **L**
Grundriss zeichnen → Wärmesimulation: Fenster auf/zu, Heizkörper, Außenwand, Luftwechsel. Berliner Altbau als Sim-Sandbox, mit ehrlicher Heizkosten-Kurve.

**Pin Tumbler** — **M**
Schließzylinder-Physik als Lerngerät: Stifte, Federn, Toleranzen, Feedback über Vibration am Handy. Erklärt ein mechanisches System, das fast niemand je gesehen hat.

**Räucher-Sim** — **S**
Rauch-Fluidsim, die auf Mikrofon-Input reagiert (Atem bewegt den Rauch). Meditativ, kein Ziel, kein Score.

**Kristallwachstum 3D** — **M**
Diffusion-limited Aggregation im Raum, Parameter live regelbar, Export als GLB. Jeder Lauf ist ein Objekt, das man rendern oder drucken kann.

---

## 3. Berlin / Alltag

**Sperrmüll-Radar** — **M**
Foto vom Straßenfund → Klassifikation (Stuhl, Regal, Monitor) → Geo-Pin, der nach 12h verfällt. Extrem Berlin, extrem nützlich, keine Accounts nötig.

**Commute Oracle** — **M**
Kein offizielles ETA: du loggst deine eigenen Fahrten, das Modell lernt *deine* Strecke und sagt, wann du wirklich losmusst. Kleine Datenmenge, ehrliches Ergebnis.

**Kiez-Lärmkarte** — **L**
Handy-Mikro misst nur dB-Pegel (nie Audio), Aggregation lokal, Karte zeigt Ruhe-Fenster pro Straße. Privacy-first by design, sonst ist es tot.

---

## 4. Esoterik-Ecke, aber als Software

**Tarot als Zustandsmaschine** — **M**
Karten sind typisierte State-Transitions, ein Legesystem ist ein kleines Programm. Du baust ein Reading wie einen Graph, die Animation fällt aus der Struktur raus.

**Traumtagebuch mit Motiv-Karte** — **M**
Einträge lokal embedden, wiederkehrende Motive als 3D-Cluster über die Zeit. Nichts verlässt das Gerät — das ist das Feature.

**Echter Zufall als Service** — **S/Hardware**
Raspberry Pi + Rauschdiode als TRNG, serviert Entropie über MCP. Jeder Würfelwurf, jedes Sigil, jede Kartenziehung in deinen Apps zieht aus echtem physikalischem Rauschen.

---

## 5. Meta / Dev-Kultur

**Repo-Museum** — **M**
Begehbare 3D-Galerie deiner GitHub-Repos: Repo = Raum, Commits = Exponate, tote Branches = Keller. react-three-fiber, generiert aus der API.

**Ghost Replay fürs Editieren** — **M**
Zeichnet deinen Edit-Rhythmus auf und spielt ihn als „Geist" ab, Trackmania-Style. Zeigt dir, wie du dich tatsächlich durch Code bewegst — inkl. der 40 Sekunden Scrollen vor jeder Entscheidung.

**Bugs → Spaced Repetition** — **S**
Jeder gefixte Bug wird automatisch zur Lernkarte: Symptom vorne, Root Cause hinten. Nach drei Monaten weißt du, welche Fehlerklasse dich wirklich kostet.

---

## Wenn du eine auswählen müsstest

Schnellster Payoff: **Spec-Drift Detector** (löst ein Problem, das du real hast, über mehrere Repos).
Schönstes Ding: **Wet Ink** (eine Physik, sofort sichtbar, keine Infrastruktur).
Größtes Ding: **Altbau Thermal** (Sim-Engine + UI + echte Nützlichkeit, skaliert zu einem Produkt).
