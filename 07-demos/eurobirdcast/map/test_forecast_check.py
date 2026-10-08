import importlib.util, math, unittest
from pathlib import Path

def load(name):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).parent / f'{name}.py')
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module); return module

fc = load('forecast_check')
recent = load('recent')

def station(code, lat, lon, densities, u=0.0, v=5.0):
    return {'code': code, 'lat': lat, 'lon': lon, 'readings': [
        {'density': d, 'u': u, 'v': v, 'status': 'observed'} if d is not None else {'density': None, 'u': None, 'v': None, 'status': 'missing'} for d in densities]}

def dataset(stations, hours):
    return {'times': [f'2026-10-01T{h % 24:02d}:00:00Z' for h in range(hours)], 'stations': stations}


class ForecastCheck(unittest.TestCase):
    def test_solver_recovers_a_linear_relation(self):
        X = [[1, i, i * i % 7] for i in range(20)]
        Y = [2 + 3 * x[1] - x[2] for x in X]
        w = fc.fit(X, Y, lam=1e-9)
        self.assertTrue(all(abs(a - b) < 1e-4 for a, b in zip(w, [2, 3, -1])))

    def test_features_use_only_hours_up_to_t(self):
        flat = dataset([station('a', 50, 5, [1, 1, 1, 1])], 4)
        changed = dataset([station('a', 50, 5, [1, 1, 1, 99])], 4)
        self.assertEqual(fc.features(flat, 0, 2), fc.features(changed, 0, 2))

    def test_missing_hours_are_never_samples_or_zeros(self):
        data = dataset([station('a', 50, 5, [1, 2, 3, None, 5, 6, 7])], 7)
        rows = fc.samples(data, 1)
        # t=2 has a missing target, t=4 has a missing previous hour, t=3 itself is missing.
        self.assertEqual([r['t'] for r in rows], [1, 5])
        self.assertAlmostEqual(rows[1]['y'], math.log1p(7) - math.log1p(6))

    def test_upwind_neighbour_must_lie_in_the_source_sector(self):
        south = station('s', 49.0, 5, [4, 4, 4], v=5.0)   # birds move north, so air comes from the south
        north = station('n', 51.0, 5, [9, 9, 9], v=5.0)
        target = station('t', 50.0, 5, [1, 1, 1], v=5.0)
        x = fc.features(dataset([target, south, north], 3), 0, 2)
        self.assertEqual(x[2], 1.0)
        self.assertAlmostEqual(x[1], math.log1p(4) - math.log1p(1))

    def test_prediction_cannot_make_density_negative(self):
        # A large predicted drop from 0.5 birds/km2 must stop at zero density, not go below it.
        level = math.log1p(0.5)
        self.assertAlmostEqual(math.expm1(level + fc.predict([-5.0], [1.0], level)), 0.0)

    def test_skill_is_relative_to_persistence(self):
        self.assertAlmostEqual(fc.skill([0.5], [1.0]), 0.5)
        self.assertIsNone(fc.skill([], []))


class RecentGate(unittest.TestCase):
    def layers(self, **override):
        row = {'dens': '2', 'n_dbz': '5', 'sd_vvp': '3', 'sd_vvp_threshold': '2', 'gap': 'FALSE', 'u': '1', 'v': '2'}
        row.update(override)
        return {h: dict(row) for h in recent.LAYERS}

    def test_screened_density_integrates_five_layers(self):
        density, vector, unscreened = recent.scan_values(self.layers())
        self.assertAlmostEqual(density, 2.0)  # five layers of 2 birds/km3 x 0.2 km
        self.assertEqual(vector, (1.0, 2.0))

    def test_below_threshold_is_zero_and_has_no_vector(self):
        density, vector, _ = recent.scan_values(self.layers(sd_vvp='1'))
        self.assertEqual(density, 0.0)
        self.assertIsNone(vector)

    def test_missing_sd_vvp_is_unscreened_not_birds(self):
        density, vector, unscreened = recent.scan_values(self.layers(sd_vvp=''))
        self.assertIsNone(density); self.assertIsNone(vector)
        self.assertAlmostEqual(unscreened, 2.0)

    def test_incomplete_profile_is_rejected(self):
        partial = self.layers(); del partial[1400]
        self.assertEqual(recent.scan_values(partial), (None, None, None))

    def test_midwinter_noon_is_daytime_and_midnight_is_not(self):
        from datetime import datetime, timezone
        self.assertGreater(recent.sun_elevation(50, 10, datetime(2026, 10, 5, 11, 0, tzinfo=timezone.utc)), 20)
        self.assertLess(recent.sun_elevation(50, 10, datetime(2026, 10, 5, 23, 0, tzinfo=timezone.utc)), -20)


if __name__ == '__main__':
    unittest.main()
