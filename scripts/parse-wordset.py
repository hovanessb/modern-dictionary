import duckdb as db
import json 
from tqdm import tqdm
import glob
i= 0
words = []
with open ("data/words-wordset.jsonl", 'w',encoding="utf-8") as o:
   for g in glob.glob("wordset-dictionary/data/*"):
      with open (g,'r') as f: 
         data = json.loads(f.read())
         for word in tqdm(data.keys()):
            i = i + 1
            parts = {}            
            poses = []
            if 'meanings'in data[word].keys():
               for meaning in data[word]['meanings']:
                  if meaning['speech_part'] not in poses:
                     parts[meaning['speech_part']] = []          
                     poses.append(meaning['speech_part'])
            for pos in poses:
               for meaning in data[word]['meanings']:
                  if pos == meaning['speech_part']:
                     parts[pos].append({'glosses': meaning['def'], 
                                       'examples': [meaning['example']] if 'example' in meaning.keys() else [],
                                       'tags':     []})
               wordx ={ 'word':data[word]['word'],
                           'pos': pos,
                           "etymology_text": "",
                           "sounds": '',
                           "etymology_templates":[],
                           'senses': parts[pos]}
               json.dump(wordx, o)            
               o.write("\n")
data = db.read_json("data/words-wordset.jsonl").write_parquet('data/wordset.parquet')