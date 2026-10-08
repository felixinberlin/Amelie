"""Chronological oracle-weather ablation, stdlib only. Never issues live forecasts."""
import json, math, random
from datetime import datetime, timedelta
from pathlib import Path
HERE = Path(__file__).parent
ROOT = HERE.parents[2]
MODELS = ('seasonal', 'weather', 'weather_recent_radar')

def features(row, model):
    day = datetime.fromisoformat(row['date']).timetuple().tm_yday
    angle = 2*math.pi*day/365.25
    x = [math.sin(angle), math.cos(angle)]
    if model != 'seasonal': x += row['weather']
    if model == 'weather_recent_radar': x += [math.log1p(row['lagBirdsKm2'])]
    return x

def solve(a, b):
    matrix = [list(row)+[v] for row,v in zip(a,b)]
    for i in range(len(b)):
        pivot = max(range(i,len(b)), key=lambda j: abs(matrix[j][i]))
        matrix[i], matrix[pivot] = matrix[pivot], matrix[i]
        if abs(matrix[i][i]) < 1e-12: raise ValueError('Singular system')
        scale = matrix[i][i]; matrix[i] = [v/scale for v in matrix[i]]
        for j in range(len(b)):
            if i == j: continue
            factor = matrix[j][i]
            matrix[j] = [v-factor*w for v,w in zip(matrix[j],matrix[i])]
    return [row[-1] for row in matrix]

def fit(rows, model, alpha):
    xs = [features(r,model) for r in rows]
    n, p = len(xs), len(xs[0])
    means = [sum(x[j] for x in xs)/n for j in range(p)]
    scales = [math.sqrt(sum((x[j]-means[j])**2 for x in xs)/n) or 1 for j in range(p)]
    design = [[1]+[(v-m)/s for v,m,s in zip(x,means,scales)] for x in xs]
    targets = [math.log1p(r['targetBirdsKm2']) for r in rows]
    a = [[sum(x[i]*x[j] for x in design) + (alpha if i==j and i>0 else 0) for j in range(p+1)] for i in range(p+1)]
    b = [sum(x[i]*y for x,y in zip(design,targets)) for i in range(p+1)]
    return {'beta': solve(a,b), 'means':means, 'scales':scales, 'model':model, 'alpha':alpha}

def predict(fitted, row):
    x = [1]+[(v-m)/s for v,m,s in zip(features(row,fitted['model']),fitted['means'],fitted['scales'])]
    log = max(0, sum(v*b for v,b in zip(x,fitted['beta'])))
    return log, math.expm1(log)

def with_lags(rows):
    answer=[]
    for row in rows:
        issue = datetime.fromisoformat(row['date']+'T18:00:00+00:00')
        eligible = [r for r in rows if timedelta(hours=48) <= issue-datetime.fromisoformat(r['nightEndUtc'].replace('Z','+00:00')) <= timedelta(hours=96)]
        if not eligible: continue
        lag = max(eligible,key=lambda r:r['nightEndUtc'])
        answer.append(dict(row, lagBirdsKm2=lag['targetBirdsKm2'], lagNightEndUtc=lag['nightEndUtc']))
    return answer

def metric(rows, fitted):
    pairs=[(r['targetBirdsKm2'],*predict(fitted,r)) for r in rows]
    errors=[abs(math.log1p(y)-log) for y,log,p in pairs]
    return {'n':len(rows),'maeLog':sum(errors)/len(rows),
        'rmseLog':math.sqrt(sum((math.log1p(y)-log)**2 for y,log,p in pairs)/len(rows)),
        'maeBirdsKm2':sum(abs(y-p) for y,log,p in pairs)/len(rows)}

def evaluate(dataset):
    rows = with_lags(dataset['rows'])
    byyear = {year:[r for r in rows if r['date'].startswith(str(year))] for year in (2021,2022,2023)}
    if min(map(len,byyear.values())) < 8:
        return {'kind':'oracle-weather historical experiment','status':'blocked-data-quality','liveForecast':False,
            'station':dataset['station'],'radar':dataset['radar'],'bandM':dataset['bandM'],'target':dataset['target'],
            'weather':'ERA5 retrospective weather; not archived issue-time forecasts',
            'split':{'tuneTrain':2021,'validation':2022,'test':2023,
                'counts':{str(y):len(r) for y,r in byyear.items()},
                'beforeLagCounts':{str(y):sum(r['date'].startswith(str(y)) for r in dataset['rows']) for y in byyear}},
            'reason':'Fewer than eight common eligible nights in at least one year; no model fitted, no skill estimated.',
            'minimumNightsPerYear':8,'coverageThreshold':0.75,
            'sources':dataset['sources'],'excludedNights':dataset['excluded'],
            'metrics':{},'predictions':[],
            'limitations':['One radar, October only, fixed 18:00–06:00 UTC window.',
                'Complete 1000–2000m layer coverage and at least 75% of quarter-hour slots required.',
                'Gap and finite-value checks do not establish expert biological quality.',
                'No improvement or live forecast demonstrated.',
                'Historical ringing, citizen science and tracking sources researched but not ingested.']}

    tuning=[]; models={}
    for model in MODELS:
        candidates=[]
        for alpha in (1,10,100):
            fitted=fit(byyear[2021],model,alpha)
            candidates.append((metric(byyear[2022],fitted)['maeLog'],alpha))
        score,alpha=min(candidates)
        tuning.append({'model':model,'alpha':alpha,'validationMaeLog':score})
        models[model]=fit(byyear[2021]+byyear[2022],model,alpha)
    test=byyear[2023]
    metrics={model:metric(test,fitted) for model,fitted in models.items()}
    baseline=metrics['seasonal']['maeLog']
    for model,m in metrics.items(): m['relativeMaeImprovement']=1-m['maeLog']/baseline if baseline else None
    predictions=[{'date':r['date'],'observedBirdsKm2':r['targetBirdsKm2'],'coverage':r['radarCoverage'],
        'lagNightEndUtc':r['lagNightEndUtc'],
        'predictedBirdsKm2':{model:predict(f,r)[1] for model,f in models.items()}} for r in test]
    # Paired seven-calendar-day block resampling; descriptive only for a tiny single-site test.
    groups={}
    first=datetime.fromisoformat(test[0]['date'])
    for i,r in enumerate(test): groups.setdefault((datetime.fromisoformat(r['date'])-first).days//7,[]).append(i)
    blocks=list(groups.values()); intervals={}; rng=random.Random(20261008)
    for model in MODELS[1:]:
        base_errors=[abs(math.log1p(r['targetBirdsKm2'])-predict(models['seasonal'],r)[0]) for r in test]
        new_errors=[abs(math.log1p(r['targetBirdsKm2'])-predict(models[model],r)[0]) for r in test]
        samples=[]
        for _ in range(500):
            indices=[i for _ in blocks for i in rng.choice(blocks)]
            base=sum(base_errors[i] for i in indices)
            if base: samples.append(1-sum(new_errors[i] for i in indices)/base)
        samples.sort();intervals[model]=[samples[int(.025*(len(samples)-1))],samples[int(.975*(len(samples)-1))]] if samples else None
    return {'kind':'oracle-weather historical experiment','status':'evaluated','liveForecast':False,'station':dataset['station'],
        'radar':dataset['radar'],'bandM':dataset['bandM'],'target':dataset['target'],
        'weather':'ERA5 retrospective target-night weather, unavailable at issue time',
        'radarLag':'48–96 hours after observation interval end; assumed availability, not archived publication time',
        'split':{'tuneTrain':2021,'validation':2022,'test':2023,'counts':{str(y):len(r) for y,r in byyear.items()},
            'beforeLagCounts':{str(y):sum(r['date'].startswith(str(y)) for r in dataset['rows']) for y in byyear}},
        'excludedNights':dataset['excluded'],'sources':dataset['sources'],'tuning':tuning,'metrics':metrics,
        'descriptiveBlockIntervals':intervals,'predictions':predictions,
        'limitations':['One radar, October only, three years; no Germany/Europe-wide claim.',
            'ERA5 uses later observations; not an operational forecast backtest.',
            'Automatic quality filtering is not expert validation; insects and radar changes may confound results.',
            '100m wind is a proxy, not measured wind throughout the 1000–2000m bird layer.',
            'No ringing, tracking, citizen-science or paper-extracted records ingested yet.',
            'Intervals reflect few within-season blocks and omit interannual and sensor uncertainty.']}

if __name__=='__main__':
    result=evaluate(json.loads((HERE/'dataset.json').read_text()))
    (ROOT/'src/data/birdForecastExperiment.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({'counts':result['split']['counts'],'metrics':result['metrics']},indent=2))
