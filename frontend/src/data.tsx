import axios, { AxiosResponse } from "axios"

export function search  (search="")  {
   let results: AxiosResponse<any, any> | never[] = []
   return  axios({method:"get",url:"/api/v1/lookup", params : {"search":search}}).catch((error)=>{console.log(error)})
 }
 
 export function define  (word="")  {
   let results: AxiosResponse<any, any> | never[] = []
   return  axios({method:"get",url:"/api/v1/define", params : {"word":word}}).catch((error)=>{console.log(error)})
 }