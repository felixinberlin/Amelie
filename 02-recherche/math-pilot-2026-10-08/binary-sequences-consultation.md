# Mathematician consultation: binary sequences (family 076)

Date: 2026-10-08. Real consultation by a fresh agent using the repository skill. Summary preserves findings; not independent expert validation.

## Question and people helped

Could binary sequences improve affordable acoustic measurement or classroom echo experiments? Desired benefit: more understandable and reliable measurement with inexpensive equipment. No real-world benefit has been measured.

## Claim and source status

At math commit `fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb`, the October 5 ultraflat manuscript's introduction, `thm:main`, claims that for every epsilon in (0,1), all sufficiently large integer lengths N admit signs such that `(1-epsilon)*sqrt(N) <= |P(exp(i*w))| <= (1+epsilon)*sqrt(N)` at every frequency. The signs depend on N. This is the authors' claim, not a theorem independently verified here.

The pinned history and all three family READMEs contained no family-076 withdrawal/revision note. The newest paper calls its lower-envelope companion retained version 2; the READMEs do not explain the terminology. The predecessor appears in `lean/formalization.yaml`; that entry does not validate the newer theorem. No Lean build was run.

## Application assumptions

| Requirement | Status |
|---|---|
| Finite usable sequence with verified bounds | Blocked for the new construction |
| Fixed linear response during measurement | Unknown for real devices; AGC, clipping and movement can violate it |
| Known excitation and synchronized full recording | Feasible in a controlled experiment |
| Padding/guard interval sufficient for linear convolution | Required; circular and linear convolution must be distinguished |
| Useful frequency coverage of hardware | Unknown; flat digital signals do not remove hardware nulls |
| Sufficiently large N | No explicit practical threshold identified |

## Derived bridge

For a specified LTI model `Y(w)=H(w)P(w)+E(w)`, direct spectral inversion gives error `E/P`. A uniform lower bound on `|P|` therefore limits inverse noise gain. The claimed bound would give at most `1/((1-epsilon)*sqrt(N))` in the ideal model. This is a conditional mathematical bridge, not a physical performance claim.

With normalized circle measure, `integral |P|^4 = N^2 + 2*sum_{k=1}^{N-1} C(k)^2`, where C is aperiodic autocorrelation. Uniform ultraflatness would imply growing merit factor. Total sidelobe energy alone does not establish individual echo-detection performance, physical accuracy or robustness to nonlinearities.

## Exact finite implementation blocker

The full newest source uses delta-dependent auxiliary dimension, frequency representatives, generic vectors, tolerances, sufficiently large spreading parameters, interval packing and discrepancy rounding. No practical N0, coefficient list, runnable reference generator or runtime budget was found.

Inherited lower-envelope `rounding.tex` uses an existential Lovett–Meka consequence and a convergent subsequence as eta tends to zero. `packing.tex` uses asymptotic finite-field primes, randomized slots and hypergraph matching. Citing constructive inputs does not provide a finite implementation of this manuscript. Filling these gaps is a research project, not a routine coding task.

## Checks performed

The consultant read all six newest source sections and three inherited lower-envelope sections. It separately executed the established Golay/Rudin–Shapiro recurrence from a=b=[1], extending `(a,b)` to `(a concatenated b, a concatenated -b)` eight times. At length 256, summed pair sidelobes are exactly zero and each individual sequence has merit factor 3.011764705882353. These are established baselines, not the new construction.

The main agent's runnable diagnostics and results are in `run.py` and `results.json`. Two compatible LTI captures can be decoded by the sum of their correlations divided by 2N. A changing response breaks exact pair cancellation.

## Application hypotheses and verdict

1. Classroom echo laboratory: explain why one noisy pulse differs from coded probes and complementary pairs. Buildable with established mathematics; novelty and teaching benefit require review.
2. Single-capture room-response probe: a practical finite ultraflat sequence might improve inverse conditioning while avoiding pair drift. New construction unavailable, real-device assumptions untested.
3. Citizen sensor consistency check: repeated probes might reveal changes in microphone response; AGC and placement may dominate. Existing-method hypothesis, no demonstrated new-math advantage.

**Proof:** needs independent expert review. **Application bridge:** conditionally applicable. **New finite implementation:** blocked. **Human benefit:** untested. Proceed with established-method baseline and keep the new construction as a research watch item.

## Sources actually inspected

Pinned base: `https://github.com/openai/math/tree/fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb/`.

- All files in `preprints/Ultraflat-real-Littlewood-polynomials-October-5-2026/build/sections`: `introduction.tex`, `rounding.tex`, `balanced.tex`, `oscillation.tex`, `waves.tex`, `completion.tex`.
- `introduction.tex`, `packing.tex`, `rounding.tex` in `preprints/Nearly-minimal-maxima-and-positive-minima-of-Littlewood-polynomials-October-5-2026/build/sections`.
- Three family READMEs, full `history.md`, relevant `lean/formalization.yaml` entry. No PDF content read; source TeX was used.
- Acoustic prior-art discovery: https://pmc.ncbi.nlm.nih.gov/articles/PMC6234353/ and https://pmc.ncbi.nlm.nih.gov/articles/PMC7817827/ — search extracts only, full pages CAPTCHA blocked.
- Time-variance research discovery: https://pubmed.ncbi.nlm.nih.gov/10738836/ — full text not read.

## Quellenmeldung handoff (not imported)

QUELLE NEU: OpenAI math family 076 primary source | status=durchsucht | evidenz=seite | zugang=ja | ertrag=– | urls=https://github.com/openai/math/tree/fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb/preprints/Ultraflat-real-Littlewood-polynomials-October-5-2026 | note=All six latest source sections and inherited packing/rounding read; no practical finite generator found; no independent proof verification.

QUELLE NEU: OpenAI math correction history | status=durchsucht | evidenz=seite | zugang=ja | ertrag=– | urls=https://github.com/openai/math/blob/fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb/history.md | note=October 7 history contains no family-076 correction; not proof validation.

QUELLE NEU: Golay acoustic baseline research | status=angekratzt | evidenz=schnipsel | zugang=teilweise | ertrag=– | urls=https://pmc.ncbi.nlm.nih.gov/articles/PMC6234353/,https://pmc.ncbi.nlm.nih.gov/articles/PMC7817827/ | note=Existing acoustic toolkit and recurrence discovered; full primary pages blocked by CAPTCHA. Bibliothekar must validate access/category enums before import.
