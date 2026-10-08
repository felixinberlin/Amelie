"""Small published European radar benchmark; stdlib, CC0 implementation.

Reads selected ZIP members using HTTP Range; never downloads model results.
Published input: Lippert et al., Zenodo 6874789, CC BY 4.0.
"""
import csv, hashlib, importlib.util, io, json, math, struct, urllib.request, zlib
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

HERE = Path(__file__).parent
ROOT = HERE.parents[2]
CACHE = Path('/tmp/eurobirdcast-europe-members')
URL = 'https://zenodo.org/api/records/6874789/files/data.zip/content'
SIZE = 269678095

def ranged(start, end):
    request = urllib.request.Request(URL, headers={'Range': f'bytes={start}-{end}'})
    with urllib.request.urlopen(request, timeout=90) as response:
        if response.status != 206: raise ValueError('Server must honor bounded byte range')
        data = response.read(end-start+2)
    if len(data) != end-start+1: raise ValueError('Incorrect range length')
    return data

def members():
    CACHE.mkdir(exist_ok=True)
    index_path = CACHE/'directory.bin'
    if not index_path.exists(): index_path.write_bytes(ranged(SIZE-65536, SIZE-1))
    tail = index_path.read_bytes()
    end = tail.rfind(b'PK\x05\x06')
    header = struct.unpack('<4s4H2LH', tail[end:end+22])
    offset = header[6]-(SIZE-len(tail))
    directory = tail[offset:offset+header[5]]
    index, answer = 0, {}
    while directory[index:index+4] == b'PK\x01\x02':
        h = struct.unpack('<4s6H3L5H2L', directory[index:index+46])
        name = directory[index+46:index+46+h[10]].decode()
        answer[name] = {'compressed':h[8], 'bytes':h[9], 'offset':h[-1], 'crc':h[7], 'method':h[4]}
        index += 46+h[10]+h[11]+h[12]
    return answer

def load_member(name, info):
    path = CACHE/(str(info['offset'])+'.csv')
    if not path.exists():
        header = ranged(info['offset'],info['offset']+29)
        h = struct.unpack('<4s5H3L2H',header)
        start = info['offset']+30+h[-2]+h[-1]
        packed = ranged(start,start+info['compressed']-1)
        if info['method'] != 8: raise ValueError('Expected deflate')
        raw = zlib.decompress(packed,-15)
        if len(raw)!=info['bytes'] or zlib.crc32(raw)!=info['crc']: raise ValueError('ZIP CRC or size mismatch')
        path.write_bytes(raw)
    raw=path.read_bytes()
    if len(raw)!=info['bytes'] or zlib.crc32(raw)!=info['crc']: raise ValueError('Cached CRC mismatch')
    return raw, {'member':name, **info, 'sha256':hashlib.sha256(raw).hexdigest()}

WEATHER = ['u','v','t2m','tp','sp','cc']

def eligible_row(source, stations):
    if source['radar'] not in stations:return None,'not-observed-station'
    if source['night'].lower()!='true':return None,'daytime'
    if source['missing'].lower()!='false':return None,'source-missing'
    try:
        target=float(source['birds_km2']);weather=[float(source[k]) for k in WEATHER]
    except ValueError:return None,'non-numeric'
    if target<0 or not all(math.isfinite(v) for v in [target]+weather):return None,'nonfinite-or-negative'
    return {'radar':source['radar'],'datetime':source['datetime'],'targetBirdsKm2':target,'weather':weather},None

def feature_vector(row, model):
    at=datetime.fromisoformat(row['datetime'])
    day=2*math.pi*at.timetuple().tm_yday/365.25
    hour=2*math.pi*at.hour/24
    result=[math.sin(day),math.cos(day),math.sin(hour),math.cos(hour)]
    return result+row['weather'] if model=='weather' else result

def evaluate(data,sources):
    spec=importlib.util.spec_from_file_location('bird_forecast_evaluate',HERE.parent/'forecast/evaluate.py')
    helper=importlib.util.module_from_spec(spec);spec.loader.exec_module(helper)
    helper.features=feature_vector
    eligible={}; exclusions={}; station_sets=[]
    for year in (2015,2016,2017):
        stations={r['radar'] for r in data[year,'static_features.csv'] if r['observed'].lower()=='true'}
        station_sets.append(stations);rows=[];reasons=Counter()
        for source in data[year,'dynamic_features.csv']:
            row,reason=eligible_row(source,stations)
            if reason:reasons[reason]+=1
            else:rows.append(row)
        eligible[year]=rows;exclusions[str(year)]=dict(reasons)
    stations=sorted(set.intersection(*station_sets))
    grouped={(y,s):[r for r in eligible[y] if r['radar']==s] for y in eligible for s in stations}
    if any(len(grouped[y,s])<100 for y in eligible for s in stations):raise ValueError('Insufficient source-eligible station-year support')
    metrics=[];tuning=[]
    for model in ('station_climatology','seasonal','weather'):
        alpha=None
        if model!='station_climatology':
            candidates=[]
            for penalty in (1,10,100):
                total=0;n=0
                for station in stations:
                    fitted=helper.fit(grouped[2015,station],model,penalty)
                    score=helper.metric(grouped[2016,station],fitted)
                    total+=score['maeLog']*score['n'];n+=score['n']
                candidates.append((total/n,penalty))
            score,alpha=min(candidates);tuning.append({'model':model,'alpha':alpha,'validationLogMae':score})
        pairs=[]
        for station in stations:
            train=grouped[2015,station]+grouped[2016,station]
            mean=sum(math.log1p(r['targetBirdsKm2']) for r in train)/len(train)
            fitted=helper.fit(train,model,alpha) if alpha is not None else None
            for row in grouped[2017,station]:
                log,pred=helper.predict(fitted,row) if fitted else (mean,math.expm1(mean))
                target=row['targetBirdsKm2'];error=abs(math.log1p(target)-log)
                pairs.append((target,pred,error))
        n=len(pairs)
        metrics.append({'model':model,'n':n,'mae':sum(abs(y-p) for y,p,e in pairs)/n,
            'rmse':math.sqrt(sum((y-p)**2 for y,p,e in pairs)/n),'logMae':sum(e for y,p,e in pairs)/n})
    baseline=metrics[1]['logMae']
    for metric in metrics:metric['relativeLogMaeImprovementVsSeasonal']=1-metric['logMae']/baseline
    counts={str(y):sum(len(grouped[y,s]) for s in stations) for y in eligible}
    return {'status':'completed','kind':'European published-data historical benchmark','liveForecast':False,
        'source':{'doi':'10.5281/zenodo.6874789','url':'https://zenodo.org/records/6874789','license':'CC-BY-4.0',
            'attribution':'Lippert, Kranstauber, Forré and van Loon (2022), Learning to predict spatio-temporal movement dynamics from weather radar networks',
            'archiveBytes':SIZE,'bytes':sum(s['compressed'] for s in sources),'members':sources,
            'sha256':hashlib.sha256(json.dumps(sources,sort_keys=True).encode()).hexdigest(),
            'hashScope':'SHA-256 of ordered member provenance JSON; each decompressed member has its own SHA-256 and ZIP CRC. Not whole archive hash.'},
        'coverage':{'stations':stations,'years':[2015,2016,2017],'rows':sum(counts.values()),'counts':counts,
            'sourceStationCounts':{str(y):len(s) for y,s in zip((2015,2016,2017),station_sets)},
            'excludedNonCommonStations':{str(y):sorted(s-set(stations)) for y,s in zip((2015,2016,2017),station_sets)},
            'stationSelection':'Use only stations marked observed in all three source annual static tables; independent of test target values.',
            'countries':['Germany','Netherlands','Belgium'],'period':'Autumn (August–November), source hourly records',
            'excluded':exclusions,'nighttimeZeroRows':{str(y):sum(r['targetBirdsKm2']==0 for r in eligible[y]) for y in eligible}},
        'protocol':{'trainYears':[2015],'validationYear':2016,'testYear':2017,'refitYears':[2015,2016],
            'target':'Source birds_km2, vertically integrated bird density (birds/km²); nighttime only',
            'weatherVariables':WEATHER,'models':'Separate ridge model per radar; training-only feature standardization; log1p density; globally choose alpha from 1,10,100 by 2016 pooled log MAE.',
            'mask':'Source night=True AND missing=False, finite nonnegative density and finite weather; retain valid night zeros; common rows across all three models.',
            'weather':'Target-hour ERA5 reanalysis: oracle weather, not archived issue-time forecasts'},
        'metrics':metrics,'tuning':tuning,'limitations':[
            'Simple independent ablation on published prepared data; not a reproduction of FluxRGNN neural models or original sequence protocol.',
            'Retrospective target-hour ERA5 is unavailable at forecast issue time; no operational forecast skill established.',
            'Hourly rows are correlated across time and radars; no confidence intervals or significance claims.',
            'Source preprocessing and quality decisions inherited; no independent raw-radar biological validation.',
            'Existing sites only, three autumns; no spring, new-site, present-day or all-Europe generalization demonstrated.',
            'No ringing, citizen-science, tracking, or paper-extracted priors ingested in this benchmark.',
            'Source physical-value columns used; no new normalization before training. Upstream processing may still introduce biases.']}

def main():
    index=members(); sources=[]; data={}
    for year in (2015,2016,2017):
        prefix=f'data/preprocessed/1H_none_ndummy=0/radar/fall/{year}/'
        for filename in ('static_features.csv','dynamic_features.csv'):
            name=prefix+filename
            raw,source=load_member(name,index[name]);sources.append(source)
            rows=list(csv.DictReader(io.StringIO(raw.decode())))
            data[year,filename]=rows
            print(year,filename,len(rows),'fields',list(rows[0]),flush=True)
    (CACHE/'inspection.json').write_text(json.dumps({'sources':sources,'examples':{str(y):data[y,'dynamic_features.csv'][:2] for y in (2015,2016,2017)},'stations':data[2015,'static_features.csv']},indent=2))
    result=evaluate(data,sources)
    (ROOT/'src/data/birdEuropeanBenchmark.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({'coverage':result['coverage'],'metrics':result['metrics']},indent=2),flush=True)
    return result

if __name__=='__main__': main()
