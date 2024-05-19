import duckdb as db
import json 
from tqdm import tqdm

database = db.connect("data/data.db")
database.execute("drop table if exists data")
wiki = db.read_parquet('data/wiktionary.parquet')
wordset = db.read_parquet('data/wordset.parquet')
#etym = db.read_parquet('data/etmology.parquet') "left join etym e on e.word = w.word and w.pos = case when e.pos = 'v' then 'verb' when e.pos = 'n' then 'noun' when e.pos = 'adv' then 'adverb' when e.pos = 'adj' then 'adjective' else e.pos end 

print(wordset)
print(wiki)

# print(database.execute(f"select w.senses , 'wiktionary' as source from wiki w ").fetchmany(50))
# print("*" * 100)
# print(database.execute(f"""select w.word, w.pos, e.pos,e.etymology, 'wordset' as source 
#                   from wordset w 
#                   left join etym e on e.word = w.word and w.pos = case when e.pos = 'v' then 'verb' when e.pos = 'n' then 'noun' when e.pos = 'adv' then 'adverb' when e.pos = 'adj' then 'adjective' else e.pos end """).fetchmany(50))

# print("*" * 100)

database.execute(f"create table data as select w.word, w.pos, w.etymology_text , w.sounds,  w.senses , 'wiktionary' as source " +
                  "from wiki w " +
                  " union " +
                  "select w.word, w.pos, '' as etymology_text, ww.sounds,  w.senses , 'wordset' as source " +
                  "from wordset w " +
                  "left join (select distinct on (word,pos) word, sounds , pos from wiki) ww on ww.word = w.word and w.pos = w.pos ")

print(database.execute("select * from data").fetch_df())