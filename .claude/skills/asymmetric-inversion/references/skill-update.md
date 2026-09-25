# Updating the Asymmetric Inversion Skill

Guidelines for updating the skill methodology across rounds.

---

## When to Update

Only modify the methodology (`SKILL.md` or files in `references/`) when an insight has held true across **three consecutive rounds**:
- A new persistent inversion operator is discovered.
- A new search query failure pattern is identified across multiple domains.
- A new regulatory body or standard repository proves to be a recurring source of high-yield anchors.

Single-round observations, specific kills, and temporary findings belong in `06-suche/amelie-inversions-log.md` (under *Retro*), not in the core skill definition.

## Procedure

1. Edit the files in `.claude/skills/asymmetric-inversion/` directly.
2. If mirroring to `skills/asymmetric-inversion/asymmetric-inversion/`, sync the changes.
3. Re-package `asymmetric-inversion.skill` in the repository root:
   ```bash
   cd .claude/skills/asymmetric-inversion && zip -r ../../../asymmetric-inversion.skill .
   ```
4. Note the methodology change in your round summary.
