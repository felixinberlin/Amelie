"""Recent real radar observations (October 2026) for the movement map. Stdlib only, CC0 code.

Source: Aloft BALTRAD daily VPTS CSV files (CC0-1.0). Same density-v2 gate and
1000-2000 m layer rule as ../forecast/prepare.py. Output: src/data/birdRecentMap.json.
"""
import csv, hashlib, importlib.util, json, math, urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from pathlib import Path
from collections import defaultdict

HERE = Path(__file__).parent
ROOT = HERE.parents[2]
CACHE = Path('/tmp/eurobirdcast-recent-cache')
CAP = 26_000_000
START = datetime(2026, 10, 1, tzinfo=timezone.utc)
DAYS = 6
HOURS = DAYS * 24
LAYERS = [1000, 1200, 1400, 1600, 1800]
RADARS = ['bejab', 'bewid', 'deboo', 'dedrs', 'deeis', 'deess', 'defbg', 'defld', 'dehnr', 'deisn',
          'demem', 'deneu', 'denhb', 'deoft', 'depro', 'deros', 'detur', 'deumd', 'nldhl']
URL = 'https://aloftdata.s3-eu-west-1.amazonaws.com/baltrad/daily/{r}/{y}/{r}_vpts_{y}{m:02d}{d:02d}.csv'

_spec = importlib.util.spec_from_file_location('forecast_prepare', HERE.parent / 'forecast/prepare.py')
_forecast = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(_forecast)
bird_density = _forecast.bird_density  # one gate for the whole project


def finite(value):
    try: result = float(value)
    except (TypeError, ValueError): return None
    return result if math.isfinite(result) else None


def fetch(radar, day):
    """Download one daily file (bounded). Missing objects return None; they are not zeros."""
    url = URL.format(r=radar, y=day.year, m=day.month, d=day.day)
    path = CACHE / f'{radar}_{day:%Y%m%d}.csv'
    meta = path.with_suffix('.meta.json')
    if not path.exists():
        CACHE.mkdir(exist_ok=True)
        try:
            with urllib.request.urlopen(url, timeout=90) as response:
                data = response.read(CAP + 1)
                headers = {'lastModified': response.headers.get('Last-Modified'), 'etag': response.headers.get('ETag')}
        except urllib.error.HTTPError as error:
            if error.code == 404: return None
            raise
        if len(data) > CAP: raise ValueError('Download cap exceeded')
        path.write_bytes(data)
        meta.write_text(json.dumps({**headers, 'retrievedAtUtc': datetime.now(timezone.utc).isoformat()}))
    raw = path.read_bytes()
    if len(raw) > CAP: raise ValueError('Cached file exceeds cap')
    info = json.loads(meta.read_text()) if meta.exists() else {}
    return raw, {'radar': radar, 'url': url, 'sha256': hashlib.sha256(raw).hexdigest(), 'bytes': len(raw), 'license': 'CC0-1.0', **info}


def sun_elevation(lat, lon, at):
    """NOAA low-precision solar elevation in degrees; used only to hide daytime hours."""
    day = at.timetuple().tm_yday + (at.hour + at.minute / 60) / 24
    g = 2 * math.pi / 365 * (day - 1)
    decl = 0.006918 - 0.399912 * math.cos(g) + 0.070257 * math.sin(g) - 0.006758 * math.cos(2 * g) + 0.000907 * math.sin(2 * g)
    eq = 229.18 * (0.000075 + 0.001868 * math.cos(g) - 0.032077 * math.sin(g) - 0.014615 * math.cos(2 * g) - 0.040849 * math.sin(2 * g))
    minutes = at.hour * 60 + at.minute + eq + 4 * lon
    hour_angle = math.radians(minutes / 4 - 180)
    la = math.radians(lat)
    return math.degrees(math.asin(math.sin(la) * math.sin(decl) + math.cos(la) * math.cos(decl) * math.cos(hour_angle)))


def scans_of(raw):
    """Group the 1000-2000 m rows of one daily file by scan (source_file)."""
    scans = defaultdict(dict)
    stamp = {}
    place = None
    for row in csv.DictReader(raw.decode().splitlines()):
        height = finite(row['height'])
        if height is None or int(height) not in LAYERS: continue
        place = place or (finite(row['radar_latitude']), finite(row['radar_longitude']))
        key = row['source_file']
        stamp[key] = datetime.fromisoformat(row['datetime'].replace('Z', '+00:00'))
        scans[key][int(height)] = row
    return scans, stamp, place


def scan_values(layers):
    """One scan -> (screened density, vector, unscreened density); None where the rule is not met."""
    if sorted(layers) != LAYERS: return None, None, None
    screened = [bird_density(layers[h]) for h in LAYERS]
    raw = [finite(layers[h]['dens']) for h in LAYERS]
    support = [finite(layers[h]['n_dbz']) for h in LAYERS]
    unscreened = None
    if all(v is not None and v >= 0 for v in raw) and all(s is not None and s > 0 for s in support):
        unscreened = sum(v * .2 for v in raw)
    if any(v is None for v in screened): return None, None, unscreened
    density = sum(v * .2 for v in screened)
    vector = None
    if density > 0 and all(layers[h]['gap'].upper() == 'FALSE' for h in LAYERS):
        parts = [(w, finite(layers[h]['u']), finite(layers[h]['v'])) for w, h in zip(screened, LAYERS)]
        if all(u is not None and v is not None for _, u, v in parts):
            weight = sum(w for w, _, _ in parts)
            vector = (sum(w * u for w, u, _ in parts) / weight, sum(w * v for w, _, v in parts) / weight)
    return density, vector, unscreened


def hourly(radar, days):
    """Per-hour readings for one radar; every slot is kept, absent data stay missing."""
    hours = defaultdict(lambda: {'d': [], 'uv': [], 'raw': []})
    sources, place = [], None
    for day, got in days:
        if got is None: continue
        raw, info = got; sources.append(info)
        scans, stamp, here = scans_of(raw); place = place or here
        for key, layers in scans.items():
            at = stamp[key]; slot = hours[at.replace(minute=0, second=0, microsecond=0)]
            density, vector, unscreened = scan_values(layers)
            if density is not None: slot['d'].append(density)
            if vector is not None: slot['uv'].append(vector)
            if unscreened is not None: slot['raw'].append(unscreened)
    times = [START + timedelta(hours=h) for h in range(HOURS)]
    readings = []
    for at in times:
        slot = hours.get(at)
        mid = at + timedelta(minutes=30)
        if place and sun_elevation(place[0], place[1], mid) > -6:
            readings.append({'density': None, 'u': None, 'v': None, 'status': 'daytime'}); continue
        if slot and slot['d']:
            u = v = None
            if slot['uv']: u = sum(x for x, _ in slot['uv']) / len(slot['uv']); v = sum(y for _, y in slot['uv']) / len(slot['uv'])
            readings.append({'density': sum(slot['d']) / len(slot['d']), 'u': u, 'v': v, 'status': 'observed'})
        elif slot and slot['raw']:
            # Density present but sd_vvp missing: no rain test possible, echo may include precipitation or insects. No vector is drawn.
            readings.append({'density': sum(slot['raw']) / len(slot['raw']), 'u': None, 'v': None, 'status': 'unscreened'})
        else:
            readings.append({'density': None, 'u': None, 'v': None, 'status': 'missing'})
    return place, readings, sources


def build():
    days = [START + timedelta(days=i) for i in range(DAYS)]
    jobs = [(r, d) for r in RADARS for d in days]
    with ThreadPoolExecutor(6) as pool:
        got = dict(zip(jobs, pool.map(lambda job: fetch(*job), jobs)))
    stations, provenance = [], []
    for radar in RADARS:
        place, readings, sources = hourly(radar, [(d, got[(radar, d)]) for d in days])
        if not place or place[0] is None: continue
        stations.append({'code': radar, 'lat': place[0], 'lon': place[1], 'readings': readings})
        provenance.extend(sources)
    return {'kind': 'recent-radar-observation-map', 'live': False,
        'source': {'license': 'CC0-1.0', 'attribution': 'Aloft / BALTRAD daily VPTS files (aloftdata.eu), CC0',
            'protocol': 'density-v2: finite nonnegative dens, n_dbz>0, finite sd_vvp and threshold, below threshold = 0; five complete 200 m layers 1000-2000 m; hour = mean of scans',
            'provenance': provenance},
        'times': [(START + timedelta(hours=h)).isoformat().replace('+00:00', 'Z') for h in range(HOURS)],
        'stations': stations,
        'units': {'density': 'birds/km² in the 1000-2000 m layer', 'u': 'm/s eastward', 'v': 'm/s northward'},
        'limitations': ['Screened means only that the sd_vvp velocity-variance test passed; it does not exclude insects or clutter and does not identify species.',
            'Real radar files retrieved after the fact; this is not a live feed and no object publication time is established.',
            'Density covers only the 1000-2000 m layer, not the full column, so it is not comparable with the 2017 map.',
            'Most German files lack sd_vvp: their density is shown as unscreened (no rain test) and may include precipitation or insects.',
            'Missing hours stay missing, never zero. No interpolation, no tracks.',
            'Daytime is hidden where the sun is above -6 degrees (NOAA approximation).']}


def main():
    result = build()
    (ROOT / 'src/data/birdRecentMap.json').write_text(json.dumps(result, separators=(',', ':')) + '\n')
    counts = {s: sum(r['status'] == s for st in result['stations'] for r in st['readings']) for s in ('observed', 'unscreened', 'daytime', 'missing')}
    print(len(result['stations']), 'stations', len(result['times']), 'hours', counts)


if __name__ == '__main__':
    main()
