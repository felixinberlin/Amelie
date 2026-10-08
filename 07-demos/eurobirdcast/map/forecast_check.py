"""Short-horizon forecast learned from the 2017 radar week, checked honestly. Stdlib only, CC0 code.

Model: ridge regression on the change in log(1 + birds/km2) between hour t and t+h, from
the previous-hour change, an upwind-neighbour difference and the hour of day. It uses only
radar observations (no weather) and only hours with a screened reading ('observed').

Commands (from the repository root):
  python3 07-demos/eurobirdcast/map/forecast_check.py evaluate   # writes src/data/birdForecastCheck.json
  python3 07-demos/eurobirdcast/map/forecast_check.py issue      # archives a forecast, hash and time stamp
  python3 07-demos/eurobirdcast/map/forecast_check.py score      # scores archived forecasts once data exist
"""
import hashlib, importlib.util, json, math, sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

HERE = Path(__file__).parent
ROOT = HERE.parents[2]
HORIZONS = (1, 3, 6)
LAMBDA = 3.0
FEATURES = ['trend', 'upwind', 'hasUpwind', 'sinHour', 'cosHour', 'intercept']
ARCHIVE = HERE / 'forecasts'


def mean(values): return sum(values) / len(values)


def solve(matrix, vector):
    n = len(vector)
    rows = [row[:] + [vector[i]] for i, row in enumerate(matrix)]
    for c in range(n):
        pivot = max(range(c, n), key=lambda r: abs(rows[r][c]))
        rows[c], rows[pivot] = rows[pivot], rows[c]
        for r in range(n):
            if r != c:
                factor = rows[r][c] / rows[c][c]
                rows[r] = [a - factor * b for a, b in zip(rows[r], rows[c])]
    return [rows[i][n] / rows[i][i] for i in range(n)]


def fit(X, Y, weights=None, lam=LAMBDA):
    weights = weights or [1.0] * len(Y)
    k = len(X[0])
    gram = [[sum(w * x[i] * x[j] for x, w in zip(X, weights)) + (lam if i == j else 0) for j in range(k)] for i in range(k)]
    return solve(gram, [sum(w * x[i] * y for x, y, w in zip(X, Y, weights)) for i in range(k)])


def predict(weights, x, level=None):
    """Predicted change in log(1+density). With `level` the result is clamped so density cannot go below zero."""
    change = sum(a * b for a, b in zip(weights, x))
    return change if level is None else max(change, -level)
def log(density): return math.log1p(density)


def offset_km(a, b):
    return (b['lon'] - a['lon']) * 111.2 * math.cos(math.radians(a['lat'])), (b['lat'] - a['lat']) * 111.2


def features(data, i, t):
    """Feature vector for station i at hour t, or None. Uses only hours <= t."""
    if t < 1: return None
    station = data['stations'][i]
    now, before = station['readings'][t], station['readings'][t - 1]
    if any(r['status'] != 'observed' or r['density'] is None for r in (now, before)): return None
    here = log(now['density'])
    upwind, has = 0.0, 0.0
    if now['u'] is not None and now['v'] is not None:
        speed = math.hypot(now['u'], now['v'])
        if speed > .5:
            best = None
            for j, other in enumerate(data['stations']):
                reading = other['readings'][t]
                if j == i or reading['status'] != 'observed' or reading['density'] is None: continue
                dx, dy = offset_km(station, other)
                distance = math.hypot(dx, dy)
                if not 40 < distance < 350: continue
                # Neighbour must lie in the sector the movement came from.
                if (dx * -now['u'] + dy * -now['v']) / (distance * speed) > .8 and (best is None or distance < best[0]):
                    best = (distance, log(reading['density']))
            if best: upwind, has = best[1] - here, 1.0
    hour = int(data['times'][t][11:13])
    return [log(before['density']) - here, upwind, has, math.sin(2 * math.pi * hour / 24), math.cos(2 * math.pi * hour / 24), 1.0]


def samples(data, horizon):
    out = []
    for i, station in enumerate(data['stations']):
        for t in range(1, len(data['times']) - horizon):
            target = station['readings'][t + horizon]
            if target['status'] != 'observed' or target['density'] is None: continue
            x = features(data, i, t)
            if x is None: continue
            level = log(station['readings'][t]['density'])
            out.append({'x': x, 'y': log(target['density']) - level, 'level': level, 'station': station['code'], 't': t})
    return out


def skill(model_errors, base_errors):
    return 1 - mean(model_errors) / mean(base_errors) if base_errors and mean(base_errors) > 0 else None


def leave_one_day_out(data, horizon):
    rows = samples(data, horizon)
    model, base = [], []
    for day in range(len(data['times']) // 24):
        test = [r for r in rows if r['t'] // 24 == day]
        # Purge training targets that overlap the held-out day.
        train = [r for r in rows if not (day * 24 - horizon <= r['t'] < (day + 1) * 24 + horizon)]
        if not test or not train: continue
        w = fit([r['x'] for r in train], [r['y'] for r in train])
        for r in test:
            model.append(abs(r['y'] - predict(w, r['x'], r['level']))); base.append(abs(r['y']))
    return {'horizonH': horizon, 'n': len(model), 'maeModel': mean(model), 'maePersistence': mean(base), 'skill': skill(model, base)}


def forward_test(train_data, test_data, horizon, recent_weight):
    """Train on the historical week; optionally add only test hours already known before each day."""
    train = samples(train_data, horizon)
    rows = samples(test_data, horizon)
    model, base = [], []
    for day in range(2, len(test_data['times']) // 24):
        cut = day * 24
        known = [r for r in rows if r['t'] + horizon < cut] if recent_weight else []
        test = [r for r in rows if cut <= r['t'] < cut + 24]
        if not test: continue
        w = fit([r['x'] for r in train + known], [r['y'] for r in train + known], [1.0] * len(train) + [float(recent_weight)] * len(known))
        for r in test:
            model.append(abs(r['y'] - predict(w, r['x'], r['level']))); base.append(abs(r['y']))
    return {'horizonH': horizon, 'recentWeight': recent_weight, 'n': len(model), 'maeModel': mean(model), 'maePersistence': mean(base), 'skill': skill(model, base)}


def load():
    historical = json.loads((ROOT / 'src/data/birdMovementMap.json').read_text())
    recent = json.loads((ROOT / 'src/data/birdRecentMap.json').read_text())
    return historical, recent


def evaluate():
    historical, recent = load()
    result = {
        'kind': 'bird-forecast-check', 'model': 'ridge on change of log(1+density); features: ' + ', '.join(FEATURES),
        'lambda': LAMBDA, 'horizonsH': list(HORIZONS), 'trainedOn': '1-7 October 2017 (Lippert et al. 2022, column density)',
        'leaveOneDay2017': [leave_one_day_out(historical, h) for h in HORIZONS],
        # Every variant tried is reported. Nothing was chosen by its 2026 score.
        'independent2026': [forward_test(historical, recent, h, w) for h in HORIZONS for w in (0, 5, 20)],
        'weights': {str(h): dict(zip(FEATURES, fit([r['x'] for r in samples(historical, h)], [r['y'] for r in samples(historical, h)]))) for h in HORIZONS},
        'caveats': [
            'No weather input: this is a statistical persistence-plus-structure model, not a weather forecast.',
            'The 2017 week is seven days of one synoptic regime; leave-one-day-out folds are not independent.',
            'The 2026 test has only three screened stations and a quiet week; 2017 is a column density, 2026 a 1-2 km layer, so only changes are compared.',
            'Skill is measured against persistence (next hours equal this hour) in log density, not in birds.',
        ],
        'prospective': prospective_status(),
    }
    (ROOT / 'src/data/birdForecastCheck.json').write_text(json.dumps(result, indent=1) + '\n')
    for row in result['leaveOneDay2017']: print('2017 LODO', row['horizonH'], f"skill {row['skill']:+.3f}")
    for row in result['independent2026']: print('2026', row['horizonH'], row['recentWeight'], f"skill {row['skill']:+.3f}")


def issue():
    historical, recent = load()
    stamp = datetime.now(timezone.utc)
    forecasts = []
    for i, station in enumerate(recent['stations']):
        observed = [t for t, r in enumerate(station['readings']) if r['status'] == 'observed']
        if len(observed) < 20: continue
        t = observed[-1]
        x = features(recent, i, t)
        if x is None: continue
        level = log(station['readings'][t]['density'])
        for h in HORIZONS:
            w = fit([r['x'] for r in samples(historical, h)], [r['y'] for r in samples(historical, h)])
            forecasts.append({'station': station['code'], 'basedOnUtc': recent['times'][t], 'targetUtc': (datetime.fromisoformat(recent['times'][t].replace('Z', '+00:00')) + timedelta(hours=h)).isoformat().replace('+00:00', 'Z'),
                'horizonH': h, 'model': math.expm1(level + predict(w, x, level)), 'persistence': station['readings'][t]['density']})
    body = {'kind': 'bird-forecast-issue', 'issuedAtUtc': stamp.isoformat(), 'trainedOn': '2017 week only', 'forecasts': forecasts}
    ARCHIVE.mkdir(exist_ok=True)
    path = ARCHIVE / f"issued-{stamp:%Y%m%dT%H%M%SZ}.json"
    path.write_text(json.dumps(body, indent=1) + '\n')
    print(path.name, len(forecasts), 'forecasts', hashlib.sha256(path.read_bytes()).hexdigest())


def prospective_status():
    out = []
    for path in sorted(ARCHIVE.glob('issued-*.json')) if ARCHIVE.exists() else []:
        body = json.loads(path.read_text())
        scored = HERE / 'forecasts' / path.name.replace('issued-', 'scored-')
        out.append({'file': path.name, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'issuedAtUtc': body['issuedAtUtc'],
            'forecasts': body['forecasts'], 'scored': json.loads(scored.read_text()) if scored.exists() else None})
    return out


def score():
    """Fetch the days after each issue and compare. Missing files mean 'not yet published', never zero."""
    recent_spec = importlib.util.spec_from_file_location('recent', HERE / 'recent.py')
    recent = importlib.util.module_from_spec(recent_spec); recent_spec.loader.exec_module(recent)
    for path in sorted(ARCHIVE.glob('issued-*.json')):
        body = json.loads(path.read_text())
        targets = {datetime.fromisoformat(f['targetUtc'].replace('Z', '+00:00')) for f in body['forecasts']}
        days = sorted({t.replace(hour=0, minute=0, second=0, microsecond=0) for t in targets})
        results, pending = [], 0
        for f in body['forecasts']:
            target = datetime.fromisoformat(f['targetUtc'].replace('Z', '+00:00'))
            day = target.replace(hour=0, minute=0, second=0, microsecond=0)
            got = recent.fetch(f['station'], day)
            if got is None: pending += 1; continue
            place, readings, sources = recent.hourly(f['station'], [(day, got)])
            reading = readings[target.hour]
            results.append({**f, 'status': reading['status'], 'observed': reading['density'] if reading['status'] == 'observed' else None,
                'sources': [s['sha256'] for s in sources]})
        out = HERE / 'forecasts' / path.name.replace('issued-', 'scored-')
        out.write_text(json.dumps({'issued': path.name, 'pending': pending, 'results': results, 'days': [d.date().isoformat() for d in days]}, indent=1) + '\n')
        scored = [r for r in results if r['observed'] is not None]
        print(path.name, 'pending', pending, 'scored', len(scored))
        if scored:
            model = mean([abs(log(r['model']) - log(r['observed'])) for r in scored]); base = mean([abs(log(r['persistence']) - log(r['observed'])) for r in scored])
            print(f'  log-MAE model {model:.3f} persistence {base:.3f}')


if __name__ == '__main__':
    command = sys.argv[1] if len(sys.argv) > 1 else 'evaluate'
    {'evaluate': evaluate, 'issue': issue, 'score': score}[command]()
