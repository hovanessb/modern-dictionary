
type Sense = {
   glosses : string;
   examples : string[] ;
}

export type Word = {
   source : string;
   pos: string;
   word : string;
   sounds : string;
   senses : Sense[];
   etymology_text: string
   glosses : string[]
}