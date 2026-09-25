# Die Skill selbst aktualisieren (Schritt 7)

Nur für Methoden-Erkenntnisse, die mehrere Runden überleben werden.

1. Kopie anlegen, Name unverändert lassen:
   `cp -r <installierter Skill-Pfad> /tmp/amelie-ideenrunde`
2. `references/suchmethode.md` oder `SKILL.md` in der Kopie ändern. Stand-Datum in `suchmethode.md` aktualisieren.
3. Paketieren:
   `cd /mnt/skills/examples/skill-creator && python -m scripts.package_skill /tmp/amelie-ideenrunde /mnt/user-data/outputs`
4. Mit `present_files` ausliefern und in einem Satz sagen, was sich an der Methode geändert hat.

Die Datei heißt weiterhin `amelie-ideenrunde.skill` — kein `-v2`, sonst entstehen zwei Skills nebeneinander.
