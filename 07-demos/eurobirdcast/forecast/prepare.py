"""Bounded CC0 radar + ERA5 experiment. Python stdlib only. No live prediction."""
import csv, gzip, hashlib, io, json, math, urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
from collections import defaultdict
ROOT = Path(__file__).resolve().parents[3]
CACHE = Path('/tmp/eurobirdcast-forecast-cache')
OUT = Path(__file__).parent
CAP = 25_000_000

def fetch(url, name):
    CACHE.mkdir(exist_ok=True)
    path = CACHE / name
    if not path.exists():
        with urllib.request.urlopen(url, timeout=60) as response:
            data = response.read(CAP + 1)
        if len(data) > CAP: raise ValueError('Download cap exceeded')
        path.write_bytes(data)
    raw = path.read_bytes()
    if len(raw) > CAP: raise ValueError('Cached file exceeds cap')
    return raw, {'url': url, 'sha256': hashlib.sha256(raw).hexdigest(), 'bytes': len(raw), 'retrievedAtUtc': datetime.fromtimestamp(path.stat().st_mtime, timezone.utc).isoformat()}

def prepare():
    rows_out, sources, exclusions = [], [], []
    for year in (2021, 2022, 2023):
        url = f'https://aloftdata.s3-eu-west-1.amazonaws.com/baltrad/monthly/depro/{year}/depro_vpts_{year}10.csv.gz'
        raw, source = fetch(url, f'depro-{year}10.csv.gz')
        source['license'] = 'CC0-1.0'; sources.append(source)
        scans = defaultdict(list)
        with gzip.GzipFile(fileobj=io.BytesIO(raw)) as zipped:
            for row in csv.DictReader(io.TextIOWrapper(zipped)):
                height = float(row['height'])
                if not 1000 <= height < 2000: continue
                # Fixed UTC window is reproducible, not astronomical night.
                at = datetime.fromisoformat(row['datetime'].replace('Z', '+00:00'))
                if 6 <= at.hour < 18: continue
                try: density = float(row['dens'])
                except ValueError: continue
                if row['gap'].upper() != 'FALSE' or not math.isfinite(density) or density < 0: continue
                scans[(at, row['source_file'])].append((height, density))
        # Accept complete five 200m layers in 1000–2000m; no extrapolation.
        nights = defaultdict(dict)
        for (at, source_file), layers in scans.items():
            if sorted(h for h, d in layers) != [1000, 1200, 1400, 1600, 1800]: continue
            night = (at - timedelta(hours=18)).date()
            if night.month != 10 or night.day >= 31: continue
            slot = int((at - datetime.combine(night, datetime.min.time(), tzinfo=at.tzinfo) - timedelta(hours=18)).total_seconds() // 900)
            # Deterministic first source file per slot avoids counting versions as independent scans.
            nights[night].setdefault(slot, []).append((source_file, sum(d * .2 for h, d in layers)))
        weather_url = ('https://archive-api.open-meteo.com/v1/archive?latitude=52.648667&longitude=13.858212'
            f'&start_date={year}-10-01&end_date={year}-10-31&hourly=temperature_2m,precipitation,wind_speed_100m,wind_direction_100m'
            '&models=era5&timezone=UTC&wind_speed_unit=ms')
        weather_raw, provenance = fetch(weather_url, f'weather-{year}10.json')
        provenance['license'] = 'CC-BY-4.0 (Open-Meteo / Copernicus attribution required)'; sources.append(provenance)
        weather = json.loads(weather_raw)['hourly']
        lookup = {t: i for i, t in enumerate(weather['time'])}
        for day in range(1, 31):
            date = datetime(year, 10, day, 18)
            night = date.date(); slots = nights.get(night, {})
            coverage = len(slots) / 48
            if coverage < .75:
                exclusions.append({'date': str(night), 'reason': 'radar-time-coverage-below-75%', 'coverage': coverage}); continue
            target = sum(min(values, key=lambda pair: pair[0])[1] for values in slots.values())/len(slots)
            temps, rain, east, north = [], [], [], []
            for h in range(12):
                at = (date + timedelta(hours=h)).isoformat(timespec='minutes')
                i = lookup[at]
                t, p, w, d = (weather[key][i] for key in ['temperature_2m','precipitation','wind_speed_100m','wind_direction_100m'])
                if any(v is None or not math.isfinite(v) for v in (t,p,w,d)): break
                temps.append(t); rain.append(p)
                # Meteorological direction is where wind comes FROM.
                east.append(-w*math.sin(math.radians(d))); north.append(-w*math.cos(math.radians(d)))
            if len(temps) != 12:
                exclusions.append({'date': str(night), 'reason': 'weather-missing'}); continue
            rows_out.append({'date': str(night), 'nightEndUtc': (date+timedelta(hours=12)).isoformat()+'Z',
                'targetBirdsKm2': target, 'radarCoverage': coverage,
                'weather': [sum(temps)/12,sum(rain),sum(east)/12,sum(north)/12]})
        print(year, 'usable nights:', sum(r['date'].startswith(str(year)) for r in rows_out), flush=True)
    result = {'radar': 'depro', 'station': 'Protzel / Berlin', 'bandM': [1000,2000],
        'nightUtc': '18:00–06:00', 'heightReference': 'AMSL', 'target': 'time-slot mean vertically integrated density (birds/km²)',
        'quality': 'automatic gap and finite-value filtering only; not expert validated',
        'weatherVariables': ['temperature2mC','precipitationMm12h','windEast100mMs','windNorth100mMs'],
        'sources': sources, 'excluded': exclusions, 'rows': rows_out}
    (OUT/'dataset.json').write_text(json.dumps(result, indent=2)+'\n')

if __name__ == '__main__': prepare()
