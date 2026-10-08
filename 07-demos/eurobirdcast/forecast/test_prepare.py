"""Scientific QC regressions, using synthetic profiles and no network access."""
import csv
import gzip
import io
import json
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch

import prepare


class DensityQualityTests(unittest.TestCase):
    def row(self, **changes):
        return dict(dens='12', n_dbz='100', sd_vvp='3',
                    sd_vvp_threshold='2', gap='FALSE', **changes)

    def test_velocity_gap_does_not_invalidate_discriminated_density(self):
        row = self.row()
        row['gap'] = 'TRUE'
        self.assertEqual(prepare.bird_density(row), 12)

    def test_below_threshold_is_zero_and_boundary_is_retained(self):
        row = self.row()
        row['sd_vvp'] = '1.999'
        self.assertEqual(prepare.bird_density(row), 0)
        row['sd_vvp'] = '2'
        self.assertEqual(prepare.bird_density(row), 12)

    def test_unknown_discrimination_and_unsupported_density_stay_missing(self):
        for field, value in [('dens', ''), ('dens', 'nan'), ('dens', '-1'),
                             ('n_dbz', '0'), ('n_dbz', 'inf'),
                             ('sd_vvp', ''), ('sd_vvp', 'nan'), ('sd_vvp', '-1'), ('sd_vvp', None),
                             ('sd_vvp_threshold', ''),
                             ('sd_vvp_threshold', '-1')]:
            with self.subTest(field=field, value=value):
                row = self.row()
                row[field] = value
                self.assertIsNone(prepare.bird_density(row))

    def test_missing_field_stays_missing(self):
        row = self.row()
        del row['sd_vvp']
        self.assertIsNone(prepare.bird_density(row))


class PreparationIntegrationTests(unittest.TestCase):
    def radar(self, year, slots=36):
        stream = io.StringIO()
        fields = ['datetime', 'height', 'source_file', 'dens', 'n_dbz',
                  'sd_vvp', 'sd_vvp_threshold', 'gap']
        writer = csv.DictWriter(stream, fieldnames=fields)
        writer.writeheader()
        start = datetime(year, 10, 1, 18, tzinfo=timezone.utc)
        for slot in range(slots):
            nominal = start + timedelta(minutes=15 * slot)
            for minutes, density in [(0, 2), (5, 4)]:
                actual = nominal + timedelta(minutes=minutes)
                for height in (1000, 1200, 1400, 1600, 1800):
                    writer.writerow(dict(datetime=nominal.isoformat(), height=height,
                        source_file=actual.strftime('depro_vp_%Y%m%dT%H%M%SZ_0xb.h5'),
                        dens=density, n_dbz=100, sd_vvp=3,
                        sd_vvp_threshold=2, gap='TRUE'))
        return gzip.compress(stream.getvalue().encode())

    def weather(self, year):
        start = datetime(year, 10, 1)
        times = [(start + timedelta(hours=h)).isoformat(timespec='minutes')
                 for h in range(31 * 24)]
        count = len(times)
        return json.dumps({'hourly': {'time': times,
            'temperature_2m': [10] * count, 'precipitation': [1] * count,
            'wind_speed_100m': [5] * count, 'wind_direction_100m': [90] * count}}).encode()

    def run_preparation(self, slots):
        def fake_fetch(url, name):
            year = int(name.split('-')[1][:4])
            raw = self.radar(year, slots) if name.endswith('.gz') else self.weather(year)
            return raw, {'url': url, 'sha256': 'synthetic', 'bytes': len(raw)}
        with tempfile.TemporaryDirectory() as folder:
            with patch.object(prepare, 'fetch', side_effect=fake_fetch), \
                 patch.object(prepare, 'OUT', Path(folder)), patch('builtins.print'):
                prepare.prepare()
            return json.loads((Path(folder) / 'dataset.json').read_text())

    def test_midnight_slot_coverage_scan_average_units_and_wind_direction(self):
        data = self.run_preparation(36)
        self.assertEqual(len(data['rows']), 3)
        for row in data['rows']:
            self.assertTrue(row['date'].endswith('-10-01'))
            self.assertEqual(row['radarCoverage'], .75)
            # Five .2-km bins give one km; equal slot means average the two scans.
            self.assertAlmostEqual(row['targetBirdsKm2'], 3)
            self.assertEqual(row['weather'][:2], [10, 12])
            self.assertAlmostEqual(row['weather'][2], -5)
            self.assertAlmostEqual(row['weather'][3], 0)
            self.assertTrue(row['nightEndUtc'].endswith('-10-02T06:00:00Z'))

    def test_many_scans_cannot_replace_missing_time_slots(self):
        data = self.run_preparation(35)
        self.assertEqual(data['rows'], [])
        first_nights = [r for r in data['excluded'] if r['date'].endswith('-10-01')]
        self.assertEqual(len(first_nights), 3)
        for row in first_nights:
            self.assertAlmostEqual(row['coverage'], 35 / 48)


if __name__ == '__main__':
    unittest.main()
