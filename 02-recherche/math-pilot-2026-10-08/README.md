# First live run of Amélie's mathematician consultant

**Run date:** 2026-10-08. **Stage:** feasibility research, no new Dose and no demonstrated practical implementation of a 2026 theorem.

Amélie's purpose is to discover opportunities for happier lives. This run tests whether the new mathematical consultant can help other agents move from a headline to a useful, falsifiable idea. It uses real consultant calls and executable synthetic experiments; it is not a fabricated agent transcript.

## What was run

1. Pinned `openai/math` to `fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb` and inspected the catalogue/correction log.
2. Started two fresh mathematician consultations with the repository skill: family 074/Kakeya for EuroBirdCast, and family 076/binary sequences for inexpensive sensing or learning.
3. Checked Amélie's existing memory and graveyard via read-only `bib find` searches: Littlewood, Akustik and Raumakustik. No Littlewood result was found; acoustic themes have existing candidates and graves. This is not evidence of external novelty.
4. Executed three small diagnostics using installed NumPy: finite sequence metrics, synthetic channel recovery, and ambiguity in an aggregated radar-like observation.
5. Prepared the source and experiment handoff below. No paid/Vertex calls, live acoustic signals, recipients or canonical register writes.

## Numerical results

Run `python3 02-recherche/math-pilot-2026-10-08/run.py` from the repository root. The script writes `results.json` beside itself, with coefficients, metrics, seed, runtime and script checksum. Python and NumPy are required; they were already installed for this run. The experiments use synthetic data only.

| Diagnostic | Result | Meaning |
|---|---:|---|
| Best merit factor at length 16, exhaustive search up to global sign | 5.3333 | An exact finite reference for this particular objective, using an established search method |
| Seeded random length-16 comparator | 2.4615 | One comparator, not a distribution or best existing method |
| Golay pair summed correlation sidelobes | Exactly zero | Existing complementary-pair identity verified with integer arithmetic |
| Static channel, Golay pair: mean impulse-response RMSE | 0.004391 | Across 100 synthetic equal-energy noisy trials |
| Static channel, repeated fixed random probe: mean RMSE | 0.052758 | Same channel, transmission length/energy and noise realizations |
| Changed channel, Golay pair: mean RMSE against mean channel | 0.005708 | Stress case; complementary cancellation assumes compatible observations |
| Two distinct nonnegative lateral fields, same aggregated profiles | Yes | Toy observation has rank 2, eight unknowns and nullity 6 |

The Golay comparison uses two 256-chip probes, total energy 512, a 64-tap linear channel with three echoes, and independent additive Gaussian noise of standard deviation 0.1. Both methods use the same correlation decoder and total energy. It is a diagnostic against one fixed random comparator, **not** a comparison against Room EQ Wizard, MLS or an optimized logarithmic sweep. No real speaker, microphone, frequency limits, distortion, clock drift or room was tested.

Sampled spectral extrema in `results.json` use 4096 points and do not certify extrema between grid points. Finite merit factor does not prove uniform spectral flatness or suitability for a physical instrument. Nothing here proves the new mathematical claims.

## What opportunities emerged?

| Possible gift | People helped / desired improvement | Mathematical role | Current decision |
|---|---|---|---|
| An understandable probe-comparison workbench | Teachers and learners experimenting with echoes, noise and reliable measurement | Binary correlations and deconvolution make the assumptions visible | Buildable with known methods; external educational gap still needs checking |
| A short measurement probe for difficult acoustic environments | Community rooms or classrooms needing easier measurements | A verified finite spectral lower bound could control inverse noise amplification | Needs a finite new construction, realistic audio model and fair sweep/MLS comparison; no reduced loudness or accessibility benefit established |
| An uncertainty-aware EuroBirdCast reconstruction experiment | Conservation researchers and communities protecting migration corridors | The observation operator and uncertainty matter; Kakeya transfer needs derivation | Continue the ordinary multi-radar baseline; no demonstrated new-Kakeya solver |

These are hypotheses, not reviewer-approved gifts. Existing room-measurement software is substantial prior art: [Room EQ Wizard](https://www.roomeqwizard.com/help/help/html/welcome.html) documents logarithmic-sweep measurements and advantages over MLS. A generic room-acoustics app cannot be claimed as a new opportunity merely because mathematics inspired it.

## The two mathematical decisions

### Family 076: a relevant mechanism, but finite construction is the gate

The catalogue claims asymptotically ultraflat polynomials with ±1 coefficients. If an implementable finite sequence has a useful lower bound on its spectrum, then in a specified linear convolution model the inverse filter's noise amplification can be bounded. Low aperiodic correlation sidelobes also give a concrete probe-design objective.

The consultant inspected the primary TeX and found unspecified constants, sufficiently-large-length conditions and existential choices rather than a practical finite generator. The simulated Golay pair and exhaustive search are established baselines; they must not be presented as implementations of this result. No independent proof audit or Lean build was performed. Consult `binary-sequences-consultation.md` for the source-level findings for details.

### Family 074: an upper bound is not a reconstruction algorithm

Aggregated profiles do not retain every spatial detail. The toy operator in `run.py` averages four lateral cells separately at two altitude levels. Two distinct fields produce the same measurements exactly. This illustrates why a proposed reconstruction must specify additional information or assumptions.

This is **not** the actual VPTS forward operator and establishes no impossibility theorem for all multi-radar methods. A Kakeya maximal-operator bound concerns a different mathematical object; a useful radar transfer needs an explicit observation model, derived stability/error result and an executable method. Consult `kakeya-consultation.md` for the primary-paper review for details.

## Next executable ticket

**Title:** Binary probe feasibility: can a finite published construction improve a realistic measurement task?

1. Obtain a pinned finite generator with all parameters and dependencies, or record a precise construction blocker. Do not reverse-engineer a theorem's existential steps into a claimed certified implementation.
2. Validate coefficient domain, length, exact aperiodic correlations and spectrum; distinguish sampled values from certified bounds.
3. Define the actual user's task and improvement: measurement reliability, duration, required signal energy, or classroom comprehension. Pick one objective before final testing.
4. Compare against a Golay pair, MLS and logarithmic sweep using matched total time, energy and frequency band. Account for the fact a pair uses two observations.
5. Test band-limited transducers, colored noise, timing offset, mild nonlinearity and changing channels. Hold out test cases when tuning.
6. Only proceed to real recordings once the model and measurement protocol are defensible. Evaluate the user benefit separately from numerical accuracy.

**Done when:** a runnable pinned method or exact blocker, fair baseline report, measured trade-offs and a human-benefit decision exist. **Stop:** finite construction unavailable, no useful improvement, no defensible measurement model, or existing tools already meet the proposed need. A truthful negative result completes this ticket.

EuroBirdCast's independent next step remains the historical multi-radar VPTS baseline in `../eurobirdcast-radar-kakeya-research-2026.md`; it does not wait for Kakeya mathematics.

## Skill evaluation

This run demonstrates that the consultant can be invoked by an agent, examine source assumptions, suggest an application mechanism and propose a bounded test. The consultation is another AI review, not independent mathematical verification. No controlled comparison with an agent lacking the skill was run, so this does not establish that the skill improves model performance.

For future evaluation, include both a constructive paper with a finite algorithm and a paper with incompatible application assumptions, and score whether the consultant preserves statement fidelity, reports blockers, produces reproducible tests and keeps human benefit central. Do not feed it the expected answers.

## Source handoff

- [Pinned mathematical catalogue](https://github.com/openai/math/blob/fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb/overview.tex): catalogue claims only.
- [Pinned correction log](https://github.com/openai/math/blob/fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb/history.md): read; tracks revisions and withdrawals, not independent validation.
- [Family 076 latest manuscript](https://github.com/openai/math/tree/fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb/preprints/Ultraflat-real-Littlewood-polynomials-October-5-2026): primary TeX examined by consultant.
- [Family 074 3D manuscript](https://github.com/openai/math/tree/fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb/preprints/The-Kakeya-maximal-conjecture-in-three-dimensions-September-23-2026): theorem introductions and consequences inspected; see consultation for exact reading scope.
- [REW primary documentation](https://www.roomeqwizard.com/help/help/html/welcome.html): webpage read, established room-measurement prior art.
- [2018 acoustic Golay research starting point](https://pmc.ncbi.nlm.nih.gov/articles/PMC6234353/): full page blocked by CAPTCHA; discovery evidence only. Do not claim full paper review.

Bibliothekar should deduplicate these sources against the current register and use the official CLI if importing. No shared source/state file was edited during this pilot.

Independent reviewer clarification: the random comparator’s correlation decoder is not optimized for its excitation, so the RMSE ratio is not evidence that Golay is superior to random excitation with appropriate decoding.

A real-data map demo now lives in `07-demos/europe-bird-migration/README.md` and the frontend Manifest section. It uses ordinary aggregation, not a Kakeya reconstruction claim.
