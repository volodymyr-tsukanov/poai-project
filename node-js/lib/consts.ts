//    poai-project  Copyright  2025  volodymyr-tsukanov

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//        http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.
import crypto from "crypto";


export const DIconSide:number = 320;
export const DIcon404 = (sobriety:number=98)=>{
  const c = DRandomInt(0,100);
  const icon = (c>(sobriety%100))?'butt-plug':'404'
  return `/icons/${icon}.svg`;
};

export const DRandomInt = (min:number,max:number)=>{
  return min + Math.floor(Math.random() * (max-min+1));
};
export const DRandomString = (length:number)=>{
  return Array(length).fill(null).map(()=>Math.random().toString(36).charAt(length-1)).join("");
};
export const DRandomHash = (algorithm:'md5'|'sha256'|'sha512',digest:crypto.BinaryToTextEncoding='hex')=>{
  const hash = crypto.createHash(algorithm);
  hash.update(DRandomString(16));
  return hash.digest(digest);
};

export const DDelay = (ms:number)=>{
  if(!ms || ms>10000) ms = 10000;
  return new Promise((resolve)=>setTimeout(resolve,ms));
};

export const DEnum2Array = (enumerable:any)=>{
  return Object.values(enumerable) as string[];
};
export const DObject2Map = (obj:any)=>{
  const result = new Map<string,any>();
  if(!obj) return result;
  for(const key in obj){
    if(obj.hasOwnProperty(key) && obj[key]!==null){
      if(typeof obj[key]==='string'||typeof obj==='number'||typeof obj==='boolean') result.set(key,obj[key]);
      else result.set(key,'');
    }
  }
  return result;
};

export const DRegexName = /^([A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ\-\s])*$/;
export const DRegexEmail = /^[a-zA-Z0-9._%+-]+@[a-z.-]+\.[a-z]{2,}$/;