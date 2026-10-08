"""Small reproducible diagnostics; NOT implementations/proofs of the 2026 claims.
Run: python3 02-recherche/math-pilot-2026-10-08/run.py
Writes results.json beside this script. No network, audio playback or external data.
"""
import hashlib
import json
from pathlib import Path
import platform
import numpy as np

ROOT = Path(__file__).resolve().parent
SEED = 20261008


def metrics(sequence):
    """Aperiodic correlations and a sampled spectrum, not continuous certification."""
    x = np.asarray(sequence, dtype=np.int64)
    n = len(x)
    c = np.array([np.dot(x[:-k], x[k:]) for k in range(1, n)], dtype=np.int64)
    energy = int(np.dot(c, c))
    spectrum = abs(np.fft.fft(x, 4096)) / np.sqrt(n)
    # Exact circle endpoints are included in the FFT grid.
    return {
        'n': n, 'coefficients': x.tolist(),
        'merit_factor': n*n/(2*energy) if energy else None,
        'correlation_energy': energy,
        'peak_sidelobe_over_main': float(np.max(abs(c))/n),
        'sampled_normalized_spectral_min': float(spectrum.min()),
        'sampled_normalized_spectral_max': float(spectrum.max()),
        'circle_grid_samples': 4096,
    }


def finite_sequence_diagnostic():
    # N=16 exhaustively maximizes finite merit factor; a global sign is irrelevant.
    # Selection is based only on the declared objective, not observed test outcomes.
    n = 16
    bits = np.arange(2**(n-1), dtype=np.uint32)[:, None]
    signs = 1 - 2*((bits >> np.arange(n-1, dtype=np.uint32)) & 1).astype(np.int64)
    candidates = np.column_stack((np.ones(len(bits), dtype=np.int64), signs))
    energies = np.zeros(len(bits), dtype=np.int64)
    for lag in range(1, n):
        c = np.sum(candidates[:, :-lag] * candidates[:, lag:], axis=1)
        energies += c*c
    best = candidates[int(np.argmin(energies))]
    rng = np.random.default_rng(SEED)
    random = rng.choice([-1, 1], size=n)
    # Established Golay recursion; each sequence alone is not a complementary pair.
    a = np.array([1], dtype=np.int64)
    b = a.copy()
    while len(a) < n:
        a, b = np.r_[a, b], np.r_[a, -b]
    pair_sidelobes = [int(np.dot(a[:-k], a[k:]) + np.dot(b[:-k], b[k:]))
                      for k in range(1, n)]
    assert all(v == 0 for v in pair_sidelobes)
    assert int(energies.min()) == metrics(best)['correlation_energy']
    return {
        'purpose': 'Provide a finite baseline and test harness for a future published generator.',
        'new_2026_generator_used': False,
        'objective': 'maximize n^2/(2*sum(aperiodic_sidelobe^2)) at n=16',
        'searched_up_to_global_sign': int(len(candidates)),
        'sequences': {
            'all_ones_negative_control': metrics(np.ones(n, dtype=np.int64)),
            'seeded_random': metrics(random),
            'golay_a_existing_method': metrics(a),
            'golay_b_existing_method': metrics(b),
            'exhaustive_best_merit_existing_method': metrics(best),
        },
        'golay_pair_sum_sidelobes': pair_sidelobes,
        'limits': ['Not a new-math implementation.', 'Spectral extrema are grid samples only.',
                   'Merit factor is not a proof of good acoustic measurement.',
                   'Complementary-pair cancellation requires two compatible observations.',
                   'No speaker, microphone, room, band limitation or user benefit was tested.'],
    }


def channel_recovery_diagnostic():
    """Equal-energy paired probes in a synthetic LTI channel; no actual acoustics."""
    n, channel_length, trials, noise_sigma = 256, 64, 100, 0.1
    a = np.array([1.]); b = a.copy()
    while len(a) < n:
        a, b = np.r_[a, b], np.r_[a, -b]
    rng = np.random.default_rng(SEED)
    random = rng.choice([-1., 1.], size=n)
    h = np.zeros(channel_length); h[[0, 12, 37]] = [1., .35, .15]
    altered = np.zeros(channel_length); altered[[0, 15, 37]] = [1., .35, .15]
    def recover(probes, channels, noises):
        recovered = np.zeros(channel_length)
        for probe, channel, noise in zip(probes, channels, noises):
            y = np.convolve(probe, channel) + noise
            correlation = np.correlate(y, probe, mode='full')
            recovered += correlation[n-1:n-1+channel_length]
        return recovered/(2*n)
    zero = np.zeros(n+channel_length-1)
    exact = recover([a,b],[h,h],[zero,zero])
    np.testing.assert_allclose(exact, h, atol=1e-14)
    errors = {name: [] for name in ['golay_pair_static','random_repeated_static','golay_pair_changed_channel']}
    for _ in range(trials):
        noises = [rng.normal(0,noise_sigma,len(zero)),rng.normal(0,noise_sigma,len(zero))]
        cases = {
          'golay_pair_static': ([a,b],[h,h]),
          'random_repeated_static': ([random,random],[h,h]),
          'golay_pair_changed_channel': ([a,b],[h,altered]),
        }
        for name,(probes,channels) in cases.items():
            # For the changed case compare to the mean channel, not either snapshot.
            target = (channels[0]+channels[1])/2
            estimate = recover(probes,channels,noises)
            errors[name].append(float(np.sqrt(np.mean((estimate-target)**2))))
    return {
        'model': 'y_i = convolution(x_i, h_i) + independent additive Gaussian noise',
        'n': n, 'trials': trials, 'noise_sigma': noise_sigma,
        'per_case_transmitted_chips': 2*n, 'per_case_transmitted_energy': float(2*n),
        'channel': h.tolist(), 'altered_channel': altered.tolist(),
        'metric': 'RMSE of 64-tap impulse response, against mean channel for changed case',
        'mean_rmse': {k:float(np.mean(v)) for k,v in errors.items()},
        'standard_deviation_across_trials': {k:float(np.std(v,ddof=1)) for k,v in errors.items()},
        'noise_free_pair_max_error': float(np.max(abs(exact-h))),
        'new_math_generator_used': False,
        'limits': ['Known complementary-pair method; not the 2026 ultraflat construction.',
                   'One fixed random comparator, not the best existing acoustic method.',
                   'No band-limited transducers, nonlinearity, clock drift or real rooms.',
                   'Changed channel is a stress case with a mean-channel target, not a forecast.',
                   'No human benefit or reduced loudness established.'],
    }


def aggregate_observability_diagnostic():
    # Toy profile aggregation: two altitude bins, four lateral cells in each bin.
    # It illustrates lost information; it is NOT the full vol2bird/VPTS forward model.
    A = np.zeros((2, 8))
    A[0, :4] = 0.25
    A[1, 4:] = 0.25
    field_left = np.array([4., 0, 0, 0, 8, 0, 0, 0])
    field_right = np.array([0., 0, 0, 4, 0, 0, 0, 8])
    y1, y2 = A @ field_left, A @ field_right
    assert np.array_equal(y1, y2)
    null = field_left - field_right
    assert np.array_equal(A @ null, np.zeros(2))
    reconstructed = np.linalg.pinv(A) @ y1
    return {
        'purpose': 'Check whether aggregated profiles uniquely determine lateral paths.',
        'model': 'toy y=A*rho: average four lateral cells separately in two altitude bins',
        'new_kakeya_solver_used': False,
        'operator': A.tolist(), 'rank': int(np.linalg.matrix_rank(A)),
        'unknowns': 8, 'nullity': 6,
        'field_left': field_left.tolist(), 'field_right': field_right.tolist(),
        'identical_profiles': y1.tolist(), 'nullspace_example': null.tolist(),
        'minimum_norm_reconstruction': reconstructed.tolist(),
        'left_reconstruction_l2_error': float(np.linalg.norm(reconstructed-field_left)),
        'right_reconstruction_l2_error': float(np.linalg.norm(reconstructed-field_right)),
        'limits': ['Synthetic illustration, not actual radar/VPTS validation.',
                   'Additional observations or model assumptions may narrow ambiguity.',
                   'No theorem validity or impossibility for the full radar system is established.',
                   'No species/individual paths/forecasts recovered.'],
    }


def main():
    report = {
        'run_date': '2026-10-08', 'seed': SEED,
        'runtime': {'python': platform.python_version(), 'numpy': np.__version__},
        'script_sha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        'predeclared_scope': 'Synthetic feasibility diagnostics, no accepted new-theorem algorithm.',
        'sequence_diagnostic': finite_sequence_diagnostic(),
        'channel_diagnostic': channel_recovery_diagnostic(),
        'radar_diagnostic': aggregate_observability_diagnostic(),
    }
    (ROOT/'results.json').write_text(json.dumps(report, indent=2)+'\n')
    print(json.dumps({
        'best_n16_merit': report['sequence_diagnostic']['sequences']['exhaustive_best_merit_existing_method']['merit_factor'],
        'random_n16_merit': report['sequence_diagnostic']['sequences']['seeded_random']['merit_factor'],
        'golay_pair_sidelobes_all_zero': True,
        'two_distinct_radar_fields_same_profiles': True,
        'channel_mean_rmse': report['channel_diagnostic']['mean_rmse'],
        'new_math_algorithm_implemented': False,
    }, indent=2))


if __name__ == '__main__':
    main()
