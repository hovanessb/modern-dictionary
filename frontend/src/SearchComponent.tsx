import { Input } from '@material-tailwind/react';
import { debounce } from 'lodash';
import { useState, useEffect } from 'react';
import { Word } from './WordModel';


export default function SearchComponent(props : any) {
   const [searchTerm, setSearchTerm] = useState('');
   const [searchResults, setSearchResults] = useState([]);

   const fetchData = debounce(()=> {
         if (!searchTerm) return; // Don't call API if search term is empty 
         props.searchApi(searchTerm).then((results:any)=>{
         setSearchResults(results.data)
         })
      },100)
      
   // API endpoint URL (replace with your actual API URL)
   // Function to handle search input changes
   const handleChange = (event :any) => {
      setSearchTerm(event.target.value);
   };

   // Call API on search term change (using useEffect)
   useEffect(() => {
      fetchData();
   }, [searchTerm]); // Dependency array ensures API call only happens on searchTerm change

   return (
      <div>
         <Input crossOrigin="" label="Search" onChange={handleChange} value={searchTerm} placeholder={"Search..."} ></Input>
         <ul>
         {searchResults.map((result : Word) => (
            <li className="cursor-pointer border-light-green-800" key={result.word} onClick={() => {
               setSearchTerm("") 
               setSearchResults([])
               props.handleSelect({id:result.word, name:result.word})
            }}>
               {result.word}
            </li>
         ))}
         </ul>
      </div>
   );
} 