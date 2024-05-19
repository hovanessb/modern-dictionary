import duckdb as db
import json 
from tqdm import tqdm
 
i= 0
words = []

with open ("data/english-dict.jsonl", encoding="utf-8") as f, open ("data/words.jsonl", 'w',encoding="utf-8") as o:
   for line in tqdm(f):
      data = json.loads(line)
      if 'word' in data.keys() and 'senses' in data.keys() and len(data['senses']) > 0 and data['lang_code']  == 'en':
         i = i + 1
         
         sound = ''
         if 'sounds' in data.keys():
            found = False
            for rr in data['sounds']:
               if 'tags' in rr.keys() and 'ipa' in rr.keys()  and rr['tags'] != None:
                  if 'US' in rr['tags'] or 'General-American' in rr['tags'] :
                     if rr['ipa'] != None and rr['ipa'] != '':
                           sound = rr['ipa']
                           found = True
               if found:
                  break
               elif 'ipa' in rr.keys() and rr['ipa'] != None and rr['ipa'] != '':
                  sound = rr['ipa']
                  break
         glosses = []
         senses = []
         for defs in data['senses']:
            if 'glosses' in defs.keys():
               definition = defs['glosses'][0].replace('"','')
               if definition not in glosses:
                  senses.append ({  'glosses':  definition, 
                                    'examples': [tex['text'] for tex in defs['examples']] if 'examples' in defs.keys() else [],
                                    'tags': defs['tags'] if 'tags' in defs.keys() else []} )
                  glosses.append(definition)
         if len(glosses ) > 0:
            json.dump({'word':data['word'],
                     'pos': data['pos'] if 'pos' in data.keys() else [],
                     "etymology_text": data['etymology_text'] if 'etymology_text' in data.keys() else "",
                     "sounds": sound,
                     "etymology_templates": data['etymology_templates'] if 'etymology_templates' in data.keys() else  [],
                     'senses': senses},o)
            o.write("\n") 

data = db.read_json("data/words.jsonl").write_parquet('data/wiktionary.parquet')