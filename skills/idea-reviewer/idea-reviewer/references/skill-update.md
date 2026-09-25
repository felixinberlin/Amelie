# Updating the Idea Reviewer Skill

Guidelines for maintaining and refining the Reviewer's evaluation vectors.

---

## 1. When to Update

Only modify the core methodology (`SKILL.md` or files in `references/`) when an empirical observation has held true across **at least three consecutive review cycles**:
* A new architectural tier or edge capability emerges (e.g. WebNN becoming commodity in all major mobile browsers).
* A recurring blind spot in the SWOT framework is discovered (e.g. new municipal liability precedents for citizen measurements).
* A scoring vector systematically over- or under-rates ideas compared to actual delivery outcomes.

Specific idea reviews, individual scorecards, and temporary triage verdicts belong in `06-suche/amelie-classification-log.md`, never in the core skill definition.

---

## 2. Maintenance Procedure

1. Edit the methodology in `.claude/skills/idea-reviewer/`.
2. Sync all modifications to `skills/idea-reviewer/idea-reviewer/`.
3. Re-package `idea-reviewer.skill` in the repository root:
   ```bash
   python3 -c "import zipfile, os; z = zipfile.ZipFile('idea-reviewer.skill', 'w', zipfile.ZIP_DEFLATED); [z.write(os.path.join(r, f), os.path.relpath(os.path.join(r, f), '.claude/skills/idea-reviewer')) for r, d, fs in os.walk('.claude/skills/idea-reviewer') for f in fs]; z.close()"
   ```
4. Document the methodology update in your session summary.
