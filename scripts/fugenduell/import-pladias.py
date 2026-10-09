#!/usr/bin/env python3
"""Refresh a small, cited roster extract. No inferred values, no taxon fallback."""
import concurrent.futures, datetime, html, json, pathlib, re, urllib.parse, urllib.request
TAXA = ['Plantago major','Poa annua','Cardamine hirsuta','Cymbalaria muralis','Asplenium ruta-muraria','Portulaca oleracea','Erigeron canadensis','Chelidonium majus','Sagina procumbens','Cochlearia danica','Buddleja davidii','Ailanthus altissima']
LABELS = ['Height [m]', 'Growth form', 'Life form', 'Life strategy (Pierce method based on leaf traits)', 'Life strategy (Pierce method, C-score)', 'Life strategy (Pierce method, S-score)', 'Life strategy (Pierce method, R-score)', 'Flowering period [month]', 'Light indicator value', 'Temperature indicator value', 'Moisture indicator value', 'Reaction indicator value', 'Nutrient indicator value', 'Salinity indicator value']
def fetch(taxon):
 url='https://pladias.cz/en/taxon/data/'+urllib.parse.quote(taxon)
 try:
  s=urllib.request.urlopen(url,timeout=25).read().decode('utf-8')
  headings=re.findall(r'<h1[^>]*>(.*?)</h1>',s,re.S)
  if taxon not in [html.unescape(re.sub('<[^>]+>','',h)).strip() for h in headings]: raise ValueError('Taxon heading mismatch')
  values={}
  for item in re.findall(r'<li[^>]*>(.*?)</li>',s,re.S):
   text=' '.join(html.unescape(re.sub('<[^>]+>',' ',item)).split()).split(' ?')[0]
   for label in LABELS:
    if text.startswith(label+' :') or text.startswith(label+':'):
     value=text.split(':',1)[1].strip()
     # Keep ordinal values and qualifiers; omit lengthy copied definitions.
     if 'indicator value' in label: value=value.split(' – ')[0]
     values[label]=value
  if not values: raise ValueError('No recognised traits')
  return taxon.lower().replace(' ','-'),{'taxon':taxon,'source':url,'checkedAt':datetime.date.today().isoformat(),'scope':'Czech flora; trait-specific citations and definitions on source page. Indicator values are ordinal ecological preferences, not pH or a measured site state.','values':values}
 except Exception as e: return taxon.lower().replace(' ','-'), {'taxon':taxon,'source':url,'error':str(e),'values':{}}
if __name__=='__main__':
 result=dict(concurrent.futures.ThreadPoolExecutor(max_workers=4).map(fetch,TAXA))
 path=pathlib.Path(__file__).resolve().parents[2]/'src/data/fugenduellScientificTraits.json'
 path.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 for key,item in result.items(): print(key,len(item['values']),item.get('error',''))
