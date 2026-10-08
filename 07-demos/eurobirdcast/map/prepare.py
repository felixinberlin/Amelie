"""Historical observation-map slice; stdlib, CC0 code; source CC BY 4.0."""
import csv, importlib.util, io, json, math
from datetime import datetime, timedelta, timezone
from pathlib import Path

HERE=Path(__file__).parent
ROOT=HERE.parents[2]
START=datetime(2017,10,1,tzinfo=timezone.utc)
HOURS=168

def finite(value, nonnegative=False):
    try: result=float(value)
    except (TypeError,ValueError): return None
    return result if math.isfinite(result) and (not nonnegative or result>=0) else None

def reading(row):
    if row is None:return {'density':None,'u':None,'v':None,'status':'missing'}
    if row['night'].lower()!='true':return {'density':None,'u':None,'v':None,'status':'daytime'}
    if row['missing'].lower()!='false':return {'density':None,'u':None,'v':None,'status':'missing'}
    density=finite(row['birds_km2'],True)
    u,v=finite(row['bird_u']),finite(row['bird_v'])
    # Density can remain usable when the movement vector is unavailable, and vice versa.
    if u is None or v is None:u=v=None
    return {'density':density,'u':u,'v':v,'status':'observed' if density is not None or u is not None else 'missing'}

def make_map(static_by_year, dynamic, provenance):
    common=set.intersection(*({r['radar'] for r in rows if r['observed'].lower()=='true'} for rows in static_by_year.values()))
    times=[(START+timedelta(hours=h)).isoformat().replace('+00:00','Z') for h in range(HOURS)]
    indexed={}
    for row in dynamic:
        at=datetime.fromisoformat(row['datetime']).astimezone(timezone.utc)
        if START<=at<START+timedelta(hours=HOURS):
            key=(row['radar'],at.isoformat().replace('+00:00','Z'))
            if key in indexed:raise ValueError('Duplicate station-hour in source')
            indexed[key]=row
    stations=[]
    for row in sorted(static_by_year[2017],key=lambda r:r['radar']):
        code=row['radar']
        if code not in common:continue
        lat,lon=finite(row['lat']),finite(row['lon'])
        if lat is None or lon is None:raise ValueError('Missing coordinates')
        stations.append({'code':code,'lat':lat,'lon':lon,'readings':[reading(indexed.get((code,t))) for t in times]})
    return {'kind':'historical-radar-observation-map','live':False,
        'source':{'doi':'10.5281/zenodo.6874789','license':'CC-BY-4.0',
            'attribution':'Lippert, Kranstauber, Forré and van Loon (2022), Learning to predict spatio-temporal movement dynamics from weather radar networks',
            'provenance':provenance},'times':times,'stations':stations,
        'units':{'density':'birds/km² (vertically integrated)','u':'m/s eastward ground movement','v':'m/s northward ground movement'},
        'limitations':['Historical 1–7 October 2017 observations, not live data or forecasts.',
            'Radar vectors describe aggregate movement near sites, not individual tracks or observed connections between stations.',
            'Published upstream processing and quality flags inherited; no independent raw-radar validation.',
            'Daytime source zeros are hidden; unavailable values remain null. Valid nighttime zeros are retained.',
            'Source missing flag gates the observation; finite density and paired velocity availability are then checked separately.',
            '21 sites observed in all three benchmark years; not complete Germany or Europe coverage.']}

def main():
    spec=importlib.util.spec_from_file_location('european_benchmark',HERE.parent/'benchmark/run.py')
    helper=importlib.util.module_from_spec(spec);spec.loader.exec_module(helper)
    index=helper.members();static={};provenance=[]
    for year in (2015,2016,2017):
        name=f'data/preprocessed/1H_none_ndummy=0/radar/fall/{year}/static_features.csv'
        raw,info=helper.load_member(name,index[name]);provenance.append(info)
        static[year]=list(csv.DictReader(io.StringIO(raw.decode())))
    name='data/preprocessed/1H_none_ndummy=0/radar/fall/2017/dynamic_features.csv'
    raw,info=helper.load_member(name,index[name]);provenance.append(info)
    result=make_map(static,list(csv.DictReader(io.StringIO(raw.decode()))),provenance)
    (ROOT/'src/data/birdMovementMap.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
    print(f"{len(result['stations'])} stations, {len(result['times'])} hours; "+
          str({status:sum(r['status']==status for s in result['stations'] for r in s['readings']) for status in ('observed','daytime','missing')}))

if __name__=='__main__':main()
