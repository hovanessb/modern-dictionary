import { Typography, TypographyProps } from '@material-tailwind/react';
import React, { useState, useEffect } from 'react';

function WordsComponent(props: { words: string; callApi: (word: string) => void ;}) {
  const [words, setWords] = useState<string[]>([]);
   
  useEffect(() => {
   if(props.words != null){
      const splitWords = props.words.split(/\s+/g); // Split by words and filter out empty strings
      setWords(splitWords);
   }
  }, [props.words]);

  return (
    <Typography placeholder=""  >
      {words.map((word,i) => (
        <span className="cursor-pointer hover:text-blue-700" key={word+i} onClick={() => {
            const wordFound = word.match(/\w+/g)
            if(wordFound && wordFound.length >0){
               props.callApi(wordFound[0])
            } 
        }}>
          {word+" "}
        </span>
      ))}
    </Typography>
  );
}

export default WordsComponent;
