---
status: Available
delivery_method: E-Mail
target_maker: Fractography working group of DGM and DVM at BAM
review_score: 32/35
architecture_tier: Tier 1
source_type: Type D
---
# Reading Fractures

**One sentence:** A practice tool for fractography that generates fracture surfaces with exactly known causes in any number — turn the raking light, point at the origin, estimate mirror radius and load, then watch the crack run backwards.

**As of:** 23. September 2026 · **Recheck by:** September 2027  
**Recipient:** Fractography working group of DGM and DVM at BAM (Dr.-Ing. Dirk Bettge; FractoDB, fractography course) · secondary: HVG-DGG (glass industry), glass and ceramics conservation, forensic glass analysis  
**Verdict:** 🎁 **gift**  
**Review:** 32/35 · Tier 1 · Type D (Details: [Audit Report](../../06-suche/amelie-39-dosen-audit-report.md))

---

## The problem

Fracture surfaces are learned on real specimens, and too few of them have a securely known cause. The standard itself calls the method "qualitative, judgment-based"; novices lose much time searching for the origin. For failure cases the model answer is an interpretation, not the truth, and every collection is finite: a systematic variation — the same fracture with a deeper flaw or higher load — does not exist physically. FractoDB, the working group's reference database, is for looking things up, not for practice.

## Why now

- Peridynamics reproduces branching, the mirror–mist–hackle transition, crack deflection and gull-wing patterns; the transition radius falls with stress as in experiments (Silling, Bobaru, Wang 2015). Feasible on a GPU today.
- Origin, load, flaw size and crack speed are already in the solver. The model answer need not be inferred — it is logged.
- The scoring scheme is standardised (ASTM C1322 for features, C1678 for mirror radius → fracture stress).

## Sketch

A simulated fracture surface (first glass rod and plate in bending) with freely rotatable raking light. Three answers: origin, mirror radius, load type. Reveal: the crack runs from the true origin, your click stays put, C1678 computes the stress. Difficulty follows the cases the standard calls hard. Every level blindly mixes in real specimens. Game mode "one breaks, one reads": send the recipe as a seed. No certification, no report export, no automatic assessment of real specimens.

## First step

**Ticket:** One glass rod, one bend, one origin, one raking-light slider.

Peridynamics run of a glass rod in four-point bending with a surface flaw at a known location, surface rendered in the browser with rotatable raking light. Done when three people who know fractography each find the origin within one mirror radius and three laypeople clearly miss.

## Where it breaks

The most likely outcome: the tool trains the solver's handwriting instead of the material — peridynamics overestimates the limiting crack speed. The antidote is the blindly mixed real specimens. Second: the working group comes from metal fractography, while today the brittle-material features are what simulates well; if the group does not see glass as its topic, the tin goes to the glass industry association or to conservation. Third: ASTM standards are paid; the tool applies the scheme but does not ship the text.

## Who has already tried this

FractoDB (fractography working group, BAM/DGM, since 2013): thousands of real fracture images, free on request — reference, not practice. Training only in person on specimens: Gerresheimer, American Glass Research, ASM, OSAC 2023-N-0005, DGM course Berlin 2027. Simulation of the features as research without a learning angle (Sandia/Nebraska 2015). Software that reads by itself (DINOv2 SEM fractography 2026, unsupervised learning 2021) — the opposite: there the human leaves the judgement.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.  
CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
