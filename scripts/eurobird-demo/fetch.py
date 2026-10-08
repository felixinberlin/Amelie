"""Fetch a bounded historical Aloft sample; run from repository root."""
import csv,io,json,math,hashlib,urllib.request
from pathlib import Path
stations=[]
for code,name in [('depro','Protzel / Berlin'),('dedrs','Dresden'),('deumd','Ummendorf')]:
 url=f'https://aloftdata.s3-eu-west-1.amazonaws.com/baltrad/daily/{code}/2023/{code}_vpts_20231001.csv'
 with urllib.request.urlopen(url,timeout=30) as r:
  raw=r.read(8_000_001)
 if len(raw)>8_000_000: raise RuntimeError('Sample size cap exceeded')
 rows=list(csv.DictReader(io.StringIO(raw.decode())))
 bins=[]
 for hour in range(24):
  bands=[]
  for low,high in [(0,1000),(1000,2000),(2000,4000)]:
   valid=[]; total=0
   for row in rows:
    if int(row['datetime'][11:13])!=hour or not low<=float(row['height'])<high: continue
    total+=1
    try: d,u,v=map(float,(row['dens'],row['u'],row['v']))
    except ValueError: continue
    if row['gap'].upper()!='FALSE' or not all(math.isfinite(x) for x in [d,u,v]) or d<0: continue
    valid.append((d,u,v))
   weight=sum(x[0] for x in valid)
   bands.append({'density':sum(x[0] for x in valid)/len(valid) if valid else None,'u':sum(d*u for d,u,v in valid)/weight if weight else None,'v':sum(d*v for d,u,v in valid)/weight if weight else None,'valid':len(valid),'total':total})
  bins.append(bands)
 stations.append({'code':code,'name':name,'lat':float(rows[0]['radar_latitude']),'lon':float(rows[0]['radar_longitude']),'source':url,'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'hours':bins})
 print(code,len(raw),sum(b['valid'] for h in bins for b in h))
Path('src/data/birdMigrationSample.json').write_text(json.dumps({'date':'2023-10-01','stations':stations},indent=2)+'\n')
