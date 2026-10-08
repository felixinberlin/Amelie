# Existing mathematics skills and tools

Discovery checked 2026-10-08. These are optional upstream resources, not installed dependencies or endorsements of all correctness claims. Recheck current contents, license, version and execution requirements before use. Link rather than copying third-party skills into Amélie's CC0 material.

| Resource | Use | Scope of inspection |
|---|---|---|
| https://github.com/leanprover/skills | Official Lean proof-writing, setup and Mathlib workflows; first place to inspect for formalization tasks | Repository README and skill catalogue; no local proof test |
| https://github.com/Wholiver/Math.Skill | General mathematical problem-solving workflow and verification guidance | README; implementation and claimed verification quality not audited |
| https://github.com/DerstedtCasper/MathProve-Skill | Candidate for substantial proof-engineering campaigns with SymPy/Lean | Repository description/README discovery; runtime not audited, too substantial for a default Amélie round |
| https://docs.sympy.org/latest/index.html | Exact symbolic calculations and counterexample probes | Documentation starting point; inspect version-specific instructions before use |
| https://leanprover-community.github.io/mathlib4_docs/ | Existing formal theorem library; search before reconstructing a known proof | Documentation starting point; pin actual project toolchain |

Use exact symbolic checks only within their domains. Use Lean only for a faithful formal statement and successful checked artifact. Neither a numerical benchmark nor an agent consensus establishes a general theorem. Keep dependency licenses intact if later importing code.

## Example consultations

- EuroBirdCast: map a Kakeya estimate to the actual VPTS observation operator; return no demonstrated bridge if the mapping is missing, and retain the ordinary radar baseline.
- Recipe scaling: distinguish additive mass balance from non-linear heating/time scaling; state units and physical assumptions before proposing a rule.
- Planning: identify whether a complexity result applies to the actual constraint class; do not turn a hardness theorem into a claimed faster algorithm.
