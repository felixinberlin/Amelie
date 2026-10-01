# Agenten, Übergaben und Schreibrechte (Diagramme)

Stand 30.09.2026 (Crew von der Kommandozeile seit 01.10.2026: dieselben Rollen als eigenständige Programme, siehe `amelie-kommandozeile.md` und für Menschen `amelie-agenten-fuer-menschen.md`). Quelle der Wahrheit sind `.claude/agents/*.md` (Rechte, Rückgabeformate) und `skills/amelie-orchestrator/` (Ablauf). Bei Änderungen dort dieses Blatt nachziehen. Mermaid rendert auf GitHub direkt.

## 1. Teamrunde: Ablauf und Übergaben

Die Agenten sprechen nicht miteinander. Jeder liefert einen Bericht an den Orchestrator, der die nächste Stufe füttert.

```mermaid
flowchart TD
    V["Vorflug<br/>bib vorflug: git fetch, fremde Branches/PRs, Netztest"] --> O
    O(["Orchestrator<br/>Themenwahl, Merge, Übergaben"])

    O --> E1["ideen-scout<br/>Engine 1: Primärquellen"]
    O --> E2["bisoziations-kollider<br/>Engine 2: Rahmen A x B"]
    O --> E3["inversions-agent<br/>Engine 3: Inversion"]

    E1 -- "Kandidatentabelle + Quellenmeldung" --> M
    E2 -- "Kandidatentabelle + Quellenmeldung" --> M
    E3 -- "Kandidatentabelle + Quellenmeldung" --> M
    M{"Konvergenz-Merge<br/>Doppelfunde markieren"}

    M -- "frei / verengt" --> R["idea-reviewer<br/>8 Vektoren, Triage-Urteil"]
    M -- "besetzt / Kills" --> B

    R -- "Dose Ready" --> P["dose-packer<br/>Dossiers DE+EN, dosen.ts, export:data"]
    R -- "Needs Research / Baustein / Friedhof" --> B
    R -. "Market Route" .-> VA["venture-analyst<br/>nur auf feat/venture-*"]

    P --> D["demo-builder<br/>07-demos/id + Engine + Tests"]
    D --> B
    P --> B

    B["bibliothekar<br/>Protokoll, Gräber, Quellen, Logs"] --> A["bib abschluss<br/>export:data, lint, test"]
    A --> C(["Commit + Push main"])
```

## 2. Wer darf was schreiben

Disjunkte Schreibrechte verhindern, dass zwei Agenten dieselbe Datei anfassen. Lesen dürfen alle, Kandidaten-Engines und Reviewer schreiben nur ihr eigenes Log.

```mermaid
flowchart LR
    subgraph Agenten
        S1[ideen-scout]
        S2[bisoziations-kollider]
        S3[inversions-agent]
        RV[idea-reviewer]
        PK[dose-packer]
        DB[demo-builder]
        BI[bibliothekar]
        VA[venture-analyst]
    end

    S1 -. "nichts" .-> X0[(keine Dateien)]
    S2 --> L2["amelie-bisoziation-log.md"]
    S3 --> L3["amelie-inversions-log.md"]
    RV --> L4["amelie-classification-log.md"]
    PK --> D1["05-dosen/, en/05-dosen/, dosen.ts, doseVectors.json"]
    PK --> PR1["Prüfprotokoll: nur Gepackt-Zeile"]
    DB --> D2["07-demos/id, src/engine/id, doseBooks.ts"]
    BI --> G1["Prüfprotokoll, Playbook/Atlas, Retro"]
    BI --> G2["Quellen-Register, Gräber, 08-friedhof"]
    VA --> V1["ventures/ (nur feat/venture-*)"]
```

`main` bleibt 100 % CC0; alles Kommerzielle liegt ausschließlich auf `feat/venture-*`.

## 3. Weg vom Schwesterprojekt (Lab → Amélie)

Lab-Läufe kommen als PR in `06-suche/` und werden vom Bibliothekar geprüft. Ein Lab-Lauf zählt in „Distance yield" erst mit, wenn ein Survivor ein Amélie-Urteil hat.

```mermaid
sequenceDiagram
    participant Lab as Amélie-lab
    participant PR as PR (lab/*)
    participant O as Orchestrator
    participant BI as bibliothekar
    participant SC as ideen-scout
    participant F as Félix

    Lab->>PR: Log-Abschnitt + Übergabe, Quellenvorschläge als Plan
    O->>BI: Diff-Umfang, lint + test im Worktree, bib find
    BI-->>O: Bericht, Antwortentwurf
    O->>PR: merge, Antworten als PR-Kommentar
    F->>O: Quelle freigeben (human_accepted)
    par Quelle buchen
        O->>BI: bib apply (nur freigegebene Quellen)
    and Existenzprüfung
        O->>SC: Survivors gegen fertige Apps/Produkte prüfen
    end
    SC-->>O: Urteilszeilen, Grabkandidaten, Quellenmeldung
    O->>BI: Protokoll, Gräber, Quellen, Log buchen, bib abschluss
    BI-->>O: grün
    O->>F: Commit + Push
```

## Hinweis

Diese Diagramme zeigen Übergaben und Rechte, nicht die Laufzeit. Für Live-Ansicht einer Sitzung (Knotengraph, Tool-Aufrufe, Tokens) taugen `agent-flow` (`npx agent-flow-app`) oder `agents-observe`; siehe Recherche in der Sitzung vom 30.09.2026.
