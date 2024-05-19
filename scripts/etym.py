import duckdb as db
import json 
from tqdm import tqdm
import re
#data = db.read_json("data/english-dict.jsonl").fetchall().write_parquet('data/wiktionary.parquet')
i= 0
words = []

with open ("data/etymologies.json", encoding="utf-8",) as f, open ("data/etym-words.jsonl", 'w',encoding="utf-8") as o:
   datas = json.load(f)
   for data in datas:
      matches = re.match(r'(.*)\s+?\(?([\w,\d]+)?',data['Word'])
      
      json.dump({
                  'word': matches.group(1),
                  'pos': matches.group(2),
                  'etymology': data['Etymology']
               }, o)
      o.write("\n") 

data = db.read_json("data/etym-words.jsonl").write_parquet('data/etmology.parquet')