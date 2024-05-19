import { Typography, Card ,CardHeader , Tabs, TabPanel, TabsBody,TabsHeader,CardBody, Tab} from "@material-tailwind/react";
import {useState, useEffect} from 'react';
import SearchComponent from "./SearchComponent";
import {search, define} from "./data"
import WordsComponent from "./WordsComponent";
import { Word } from "./WordModel";
import License from "./license";
import Pronounciation from "./PronounciationComponent";

export default function App() {
const [words, setWords] = useState<Word[]>([]);
const [wordChain, setWordChain] = useState<string[]>([]);
  
const handleSelectWord = (data: any) => {
  define(data.id).then((results)=>{
      if(results){
        setWords(results.data)
      }
  }) 
  setWordChain([])
}

const sliceWords = (ind: number) => {
  const word = wordChain[ind]
    setWordChain(wordChain.slice(0,ind+1))
    define(word).then((results)=>{
      if(results){
       setWords(results.data)
      }
    }) 
}

const jumpWord = (data: string) => {
  define(data).then((results)=>{
    if(results){
    setWords(results.data)
    const chain = [...wordChain, data]
    setWordChain(chain)
  }
  })
}

return (
    <> 
      <div className="relative grid min-h-[100vh] w-screen p-8">
        <div className="flex-col gap-2 pt-56 pb-40 text-center">
          <Typography placeholder="" variant="h1" color="black">
            The Modern Dictionary
          </Typography>
          <Typography placeholder="" variant="lead" color="black" className="opacity-70">
            A dictionary by the people of the internet.
          </Typography>
          <div className="mx-auto w-4/12">
            <SearchComponent label="Search Word" color="black" className="opacity-70" searchApi={search} handleSelect={handleSelectWord}></SearchComponent>
          </div>
          <div className="text-left max-w-3xl mx-auto mt-16">
            <p>{wordChain?.length>0 ? "Chain: " :""} {wordChain.map((chainWord, i)=>(<span className="hover:text-light-blue-700 cursor-pointer" onClick={()=>{sliceWords(i)}} key={i}>{i>0 ? " >> ":""}{chainWord} </span>))}</p>
            <Tabs key={words?.length > 0 ? words[0].word : "wordset"} value={words?.length > 0 ? words[0].source : "wordnet"}>
              <TabsHeader placeholder="" className="max-w-3xl">
                {[...new Set(words.map((result : Word,i) => (result.source)))].map((result,i)=>(<Tab placeholder="" key={result} value={result}>{result}</Tab>))}
              </TabsHeader>
              <TabsBody placeholder="" className="max-w-2xl mx-auto">
                {[...new Set(words.map((result  : Word,i) => (result.source)))].map((label)=>(
                  <TabPanel key={label} value={label}>
                    {words.filter((result: Word)=>{return label==result.source}).map((result : Word,i) => (
                      <Card key={result.word+i} placeholder="" className="mb-11 pt-16"> 
                        <CardHeader placeholder="" color="gray" className="relative p-4"> 
                            <Typography placeholder="" variant="h5"> {result.word} <Pronounciation text={result.sounds}></Pronounciation> - {result.pos}
                            </Typography>
                        </CardHeader>
                        <CardBody  placeholder="" className="relative">
                          {result.senses.map((defs,ii)=>( 
                              <p key={result.word+ii}> <WordsComponent callApi={jumpWord}  words={(ii+1)+". " + defs.glosses.replace('"','').replace('"','')}></WordsComponent> 
                                <i>{defs.examples.map((example,iii)=>(<WordsComponent key={iii} callApi={jumpWord}  words={example}></WordsComponent>))}</i>
                              </p> 
                          ))}
                            {result.etymology_text != '' ? <p><b>Derivation:</b> 
                              <WordsComponent  callApi={jumpWord} words={result.etymology_text}></WordsComponent>
                            </p> :''}
                          
                          <Typography placeholder="" className="font-sm"><i>Source: {result.source}</i></Typography>
                        </CardBody>
                      </Card>))}
                  </TabPanel>
                ))}
              </TabsBody>
            </Tabs>
        </div>
      </div>
       <License></License>
    </div>
  </>
  );
}
