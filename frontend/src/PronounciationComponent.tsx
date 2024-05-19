import { useState, useEffect } from 'react';
import {IPA} from "./ipa"
import { Tooltip } from '@material-tailwind/react';

function groupConsecutiveLetters(letters : string) {
  const skip = [];
  const ipas = [];
  const groupedLetters = [];
  
if(letters.length>0){
  for (const chars  of IPA.filter((ipa,i)=>{return ipa['IPA'].length >=2}).map((ipa,i)=>{return ipa })) {
    const position = letters.indexOf(chars['IPA']);
    if(position>=0){
      for(let positions = position;  positions <= position+chars['IPA'].length-1; positions = positions +1 ){
        skip.push(positions);
        if( chars['examples'].length>0) {
          ipas.push("examples: " + chars['examples'].reduce((prev, current) =>{ return prev + " "+current}));
        }
      }
    }
  }
  let skipNext = -1
  for(let positions = 0;  positions < letters.length; positions = positions +1 ){
    if(positions != skipNext){
      if(letters[positions] == '/' || letters[positions] == '[' || letters[positions] == ']'){
        groupedLetters.push(<span key={positions}>/</span>)
      } else {
        let currentMatch = -1
        const double = skip.find((x,i,o)=>{
          currentMatch = i
          return x==positions
        })
        if(double != undefined){
          skipNext = positions+1
          groupedLetters.push(
          <Tooltip key={positions} content={<span className='text-lg' dangerouslySetInnerHTML={{__html : ipas[currentMatch] }}></span>}>
            <span className="cursor-pointer hover:text-blue-700" >{letters[positions] + letters[positions+1]}</span>
          </Tooltip>)
        } else {
          groupedLetters.push(<Tooltip key={positions} content={<span className='text-lg' dangerouslySetInnerHTML={{__html :"examples: " + IPA.filter((ipa)=>{return letters[positions].includes(ipa['IPA'])})
            .map((ipa,i)=>{
                return ipa['examples'].reduce((prev, current) =>{ return prev + " "+current})
            })}}></span>}>
              <span className="cursor-pointer hover:text-blue-700" >{letters[positions]}</span>
            </Tooltip>)
        }
      } 
    }
  }  
}
  return groupedLetters
}

function Pronounciation(props: { text: string}) {
  return (
    <>
      {groupConsecutiveLetters(props.text)}
    </>
  )};

export default Pronounciation;
