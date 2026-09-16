# Die Skill selbst aktualisieren (Schritt 7)

Nur für Methoden-Erkenntnisse, die mehrere Runden überleben werden.

**[Claude-Code-Anpassung]** Diese Skill läuft hier als Projekt-Skill unter
`.claude/skills/amelie-ideenrunde/` — kein separates Paketieren nötig, einfach direkt bearbeiten:

1. `references/suchmethode.md` oder `SKILL.md` in `.claude/skills/amelie-ideenrunde/` ändern.
   Stand-Datum in `suchmethode.md` aktualisieren.
2. Kurz im Antwortsummary sagen, was sich an der Methode geändert hat.

Das reicht — Claude Code liest die Dateien beim nächsten Aufruf der Skill direkt aus dem Repo,
es gibt keinen separaten Installationsschritt.

---

## Falls die Skill auch auf claude.ai (Projects) weiterverwendet werden soll

Dort gilt weiterhin der ursprüngliche Ablauf, weil claude.ai kein Repo-Dateisystem hat:

1. Kopie anlegen, Name unverändert lassen:
   `cp -r <installierter Skill-Pfad> /tmp/amelie-ideenrunde`
2. `references/suchmethode.md` oder `SKILL.md` in der Kopie ändern. Stand-Datum in
   `suchmethode.md` aktualisieren.
3. Paketieren:
   `cd /mnt/skills/examples/skill-creator && python -m scripts.package_skill /tmp/amelie-ideenrunde /mnt/user-data/outputs`
4. Mit `present_files` ausliefern und in einem Satz sagen, was sich an der Methode geändert hat.

Die Datei heißt weiterhin `amelie-ideenrunde.skill` — kein `-v2`, sonst entstehen zwei Skills
nebeneinander. Halte die claude.ai-Fassung (`amelie-ideenrunde.skill` im Repo-Root) und die
Claude-Code-Fassung (`.claude/skills/amelie-ideenrunde/`) inhaltlich synchron, wenn du eine
Methodenänderung in beiden Umgebungen willst — sie sind zwei Kopien, kein geteiltes Original.
