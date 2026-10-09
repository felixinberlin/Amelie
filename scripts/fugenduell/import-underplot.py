#!/usr/bin/env python3
"""Extract exact roster matches from the pinned official UNDERPLOT CSV.
Usage: python3 scripts/fugenduell/import-underplot.py /path/to/UNDERPLOT.csv
The official archive: https://idata.idiv.de/ddm/Data/DownloadZip/3610?version=7196
"""
import csv, hashlib, json, pathlib, sys
TAXA = ['Taraxacum officinale','Plantago major','Poa annua','Cardamine hirsuta','Cymbalaria muralis','Asplenium ruta-muraria','Bryum argenteum','Portulaca oleracea','Erigeron canadensis','Chelidonium majus','Sagina procumbens','Cochlearia danica','Buddleja davidii','Ailanthus altissima']
FIELDS = ['RDepth','LRExtent','BBsize']
path = pathlib.Path(sys.argv[1])
rows = {}
for row in csv.DictReader(path.open()):
    name = row['Aggregated_name']
    if name not in TAXA: continue
    if name in rows: raise ValueError('Duplicate aggregated taxon: '+name)
    rows[name] = row
result = {'source':'https://idata.idiv.de/ddm/data/Showdata/3610','doi':'10.25829/idiv.3610-56acy9','version':39,'csvSha256':hashlib.sha256(path.read_bytes()).hexdigest(),'license':'CC BY 4.0','methodSource':'https://www.nature.com/articles/s41597-026-08151-w','records':{}}
for taxon in TAXA:
    row = rows.get(taxon)
    result['records'][taxon.lower().replace(' ','-')] = {'taxon':taxon,'matched':row is not None,'values':{key:None if row is None or row[key] == 'NA' else float(row[key]) for key in FIELDS},'originalNames':{key:row[key] for key in ['RSIP_Original_name','CLOPLA_Original_name'] if row and row[key] != 'NA'}}
out = pathlib.Path(__file__).resolve().parents[2]/'src/data/fugenduellRootTraits.json'
out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('Exact matches:',len(rows),'of',len(TAXA))
